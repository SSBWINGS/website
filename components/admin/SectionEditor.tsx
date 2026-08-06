"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SectionDef } from "@/lib/sections";
import RichText from "./RichText";

async function logActivity(
  supabase: ReturnType<typeof createClient>,
  action: string,
  target: string,
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("activity_log").insert({
    actor: user.id, actor_email: user.email, action, target,
  });
}

function setPreviewCookie(on: boolean) {
  document.cookie = on
    ? "ssbw-preview=1; path=/; SameSite=Lax"
    : "ssbw-preview=; path=/; Max-Age=0; SameSite=Lax";
}

export default function SectionEditor({
  section,
  initial,
  canRollback,
}: {
  section: SectionDef;
  initial: Record<string, string>;
  canRollback: boolean;
}) {
  const supabase = createClient();
  const [form, setForm] = useState<Record<string, string>>(initial);
  const [busy, setBusy] = useState<"" | "save" | "publish" | "rollback">("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [hasHistory, setHasHistory] = useState(canRollback);
  const [autosave, setAutosave] = useState<"idle" | "saving" | "saved">("idle");
  const firstRun = useRef(true);

  // While editing, let this admin see drafts on the live site (draft-preview
  // cookie). Cleared when they leave the editor.
  useEffect(() => {
    setPreviewCookie(true);
    return () => setPreviewCookie(false);
  }, []);

  // Autosave the draft ~1.6s after typing stops.
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    setAutosave("saving");
    const t = setTimeout(async () => {
      await supabase.from("site_content").upsert(
        { key: section.key, label: section.label, draft: form },
        { onConflict: "key" },
      );
      setAutosave("saved");
    }, 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  async function saveDraft() {
    setBusy("save"); setMsg(null);
    const { error } = await supabase.from("site_content").upsert(
      { key: section.key, label: section.label, draft: form },
      { onConflict: "key", ignoreDuplicates: false },
    );
    setBusy("");
    if (error) return setMsg({ ok: false, text: error.message });
    setMsg({ ok: true, text: "Draft saved." });
  }

  async function publish() {
    setBusy("publish"); setMsg(null);
    // snapshot current published for rollback
    const { data: cur } = await supabase.from("site_content").select("published").eq("key", section.key).maybeSingle();
    if (cur?.published) {
      await supabase.from("content_versions").insert({ key: section.key, snapshot: cur.published });
      setHasHistory(true);
    }
    const { error } = await supabase.from("site_content").update({ published: form }).eq("key", section.key);
    setBusy("");
    if (error) return setMsg({ ok: false, text: error.message });
    await logActivity(supabase, "publish", `section:${section.key}`);
    setMsg({ ok: true, text: "Published! This is now live on the website." });
  }

  async function rollback() {
    if (!confirm("Restore the previous published version?")) return;
    setBusy("rollback"); setMsg(null);
    const { data: ver } = await supabase
      .from("content_versions").select("id, snapshot").eq("key", section.key)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!ver) { setBusy(""); return setMsg({ ok: false, text: "No previous version to restore." }); }
    await supabase.from("site_content").update({ published: ver.snapshot, draft: ver.snapshot }).eq("key", section.key);
    await supabase.from("content_versions").delete().eq("id", ver.id);
    await logActivity(supabase, "rollback", `section:${section.key}`);
    firstRun.current = true; // don't retrigger autosave from this programmatic change
    setForm(ver.snapshot as Record<string, string>);
    setBusy("");
    setMsg({ ok: true, text: "Rolled back to the previous version." });
  }

  return (
    <div className="mt-6 max-w-3xl">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="space-y-4">
          {section.fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-sm font-medium text-slate-700">{f.label}</label>
              {f.type === "text" ? (
                <input value={form[f.key] ?? ""} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              ) : (
                <RichText value={form[f.key] ?? ""} onChange={(html) => setForm((s) => ({ ...s, [f.key]: html }))} />
              )}
            </div>
          ))}
        </div>

        {msg && <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}

        <p className="mt-3 text-xs text-slate-400">
          {autosave === "saving" ? "● Autosaving draft…" : autosave === "saved" ? "✓ Draft auto-saved" : "Drafts save automatically as you type."}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={saveDraft} disabled={!!busy} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            {busy === "save" ? "Saving…" : "Save draft"}
          </button>
          <button onClick={publish} disabled={!!busy} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
            {busy === "publish" ? "Publishing…" : "Publish live"}
          </button>
          {hasHistory && (
            <button onClick={rollback} disabled={!!busy} className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-60">
              {busy === "rollback" ? "Restoring…" : "↩ Rollback"}
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Changes are saved privately as a <b>draft</b>. Open your live site while signed in to preview them; nothing is public until you <b>Publish</b>.
        </p>
      </div>
    </div>
  );
}
