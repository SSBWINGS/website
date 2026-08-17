"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type CourseEdit = { tag: string; title: string; where: string; price: string; desc: string; features: string[] };

export default function CoursesManager({ initial }: { initial: CourseEdit[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<CourseEdit[]>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = (i: number, patch: Partial<CourseEdit>) =>
    setItems((s) => s.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  async function save() {
    setBusy(true); setMsg(null);
    const doc = { items };
    const { error } = await supabase.from("site_content").upsert(
      { key: "courses_cards", label: "Course Cards", draft: doc, published: doc },
      { onConflict: "key" },
    );
    setBusy(false);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Saved & published — live on the Courses page." });
  }

  return (
    <div className="mt-6 space-y-5">
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
        You can edit the text below. The <b>payment link, button, highlight badge and image</b> for each course are locked and managed in code, so checkout never breaks.
      </p>

      {items.map((c, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Course {i + 1}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-slate-500">Badge / tag
              <input value={c.tag} onChange={(e) => set(i, { tag: e.target.value })} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium text-slate-500">Title
              <input value={c.title} onChange={(e) => set(i, { title: e.target.value })} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium text-slate-500">Where / mode
              <input value={c.where} onChange={(e) => set(i, { where: e.target.value })} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium text-slate-500">Price (blank to hide)
              <input value={c.price} onChange={(e) => set(i, { price: e.target.value })} placeholder="e.g. ₹24,999" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
          </div>
          <label className="mt-3 block text-xs font-medium text-slate-500">Description
            <textarea value={c.desc} onChange={(e) => set(i, { desc: e.target.value })} rows={2} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="mt-3 block text-xs font-medium text-slate-500">Features (one per line)
            <textarea value={c.features.join("\n")} onChange={(e) => set(i, { features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
              rows={5} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
        </div>
      ))}

      {msg && <p className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
      <button onClick={save} disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
        {busy ? "Saving…" : "Save & publish"}
      </button>
    </div>
  );
}
