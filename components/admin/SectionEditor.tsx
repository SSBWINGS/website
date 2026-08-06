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

const DEVICES = [
  { id: "mobile", label: "📱 Mobile", width: 390 },
  { id: "tablet", label: "💻 Tablet", width: 768 },
  { id: "desktop", label: "🖥 Desktop", width: 0 },
] as const;

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
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState<"" | "save" | "publish" | "rollback">("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [hasHistory, setHasHistory] = useState(canRollback);
  const [autosave, setAutosave] = useState<"idle" | "saving" | "saved">("idle");
  const [scheduleAt, setScheduleAt] = useState("");
  const firstRun = useRef(true);

  // Turn preview mode on for this admin while editing; off when leaving.
  useEffect(() => {
    setPreviewCookie(true);
    setReady(true);
    return () => setPreviewCookie(false);
  }, []);

  // Autosave the draft ~1.6s after typing stops, then refresh the preview.
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    setAutosave("saving");
    const t = setTimeout(async () => {
      await supabase.from("site_content").upsert(
        { key: section.key, label: section.label, draft: form },
        { onConflict: "key" },
      );
      setAutosave("saved");
      reloadPreview();
    }, 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const reloadPreview = () => setIframeKey((k) => k + 1);

  async function saveDraft() {
    setBusy("save"); setMsg(null);
    const { error } = await supabase.from("site_content").upsert(
      { key: section.key, label: section.label, draft: form },
      { onConflict: "key", ignoreDuplicates: false },
    );
    setBusy("");
    if (error) return setMsg({ ok: false, text: error.message });
    setMsg({ ok: true, text: "Draft saved — preview updated." });
    reloadPreview();
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
    reloadPreview();
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
    reloadPreview();
  }

  async function schedule() {
    if (!scheduleAt) return setMsg({ ok: false, text: "Pick a date & time first." });
    const when = new Date(scheduleAt);
    if (Number.isNaN(when.getTime()) || when.getTime() < Date.now()) {
      return setMsg({ ok: false, text: "Choose a future date & time." });
    }
    setBusy("save"); setMsg(null);
    // Save the current form as the draft too, so what you see is what will go live.
    await supabase.from("site_content").upsert({ key: section.key, label: section.label, draft: form }, { onConflict: "key" });
    const { error } = await supabase.from("scheduled_content").insert({
      key: section.key, snapshot: form, publish_at: when.toISOString(),
    });
    setBusy("");
    if (error) return setMsg({ ok: false, text: error.message });
    await logActivity(supabase, "schedule", `section:${section.key}`);
    setMsg({ ok: true, text: `Scheduled to publish on ${when.toLocaleString()}.` });
    setScheduleAt("");
  }

  const activeDevice = DEVICES.find((d) => d.id === device)!;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(360px,2fr)_3fr]">
      {/* Editor panel */}
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
          Edits show in the preview after <b>Save draft</b>. Nothing is live until you <b>Publish</b>.
        </p>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">⏱ Schedule publish</p>
          <div className="flex flex-wrap items-center gap-2">
            <input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
            <button onClick={schedule} disabled={!!busy}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60">
              Schedule
            </button>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">The current editor content will auto-publish at the chosen time.</p>
        </div>
      </div>

      {/* Live preview panel */}
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-1">
            {DEVICES.map((d) => (
              <button key={d.id} onClick={() => setDevice(d.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${device === d.id ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                {d.label}
              </button>
            ))}
          </div>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">● Live preview (draft)</span>
        </div>
        <div className="flex justify-center overflow-hidden rounded-lg bg-white" style={{ height: "70vh" }}>
          {ready && (
            <iframe
              key={iframeKey}
              src={section.previewPath}
              title="Live preview"
              className="h-full border-0 transition-all"
              style={{ width: activeDevice.width ? activeDevice.width : "100%", maxWidth: "100%" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
