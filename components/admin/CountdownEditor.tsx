"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { bustCmsCache } from "@/lib/revalidate-client";
import type { CountdownDoc, CountdownItem } from "@/lib/countdown-defaults";

export default function CountdownEditor({ initial }: { initial: CountdownDoc }) {
  const supabase = createClient();
  const [heading, setHeading] = useState(initial.heading);
  const [items, setItems] = useState<CountdownItem[]>(
    initial.items.length ? initial.items : [{ label: "", date: "", kind: "exam" }],
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const update = (i: number, patch: Partial<CountdownItem>) =>
    setItems((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const add = () => setItems((s) => [...s, { label: "", date: "", kind: "exam" }]);
  const remove = (i: number) => setItems((s) => s.filter((_, j) => j !== i));

  async function save() {
    setBusy(true); setMsg(null);
    const doc: CountdownDoc = { heading, items: items.filter((i) => i.label && i.date) };
    const { error } = await supabase.from("site_content").upsert({
      key: "countdown", label: "Batch & Exam Countdown", draft: doc, published: doc,
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setMsg({ ok: true, text: "Saved & published — live on the site." }); void bustCmsCache();
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
      <label className="mb-1 block text-sm font-medium text-slate-700">Section heading</label>
      <input value={heading} onChange={(e) => setHeading(e.target.value)}
        className="mb-5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />

      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <input value={it.label} onChange={(e) => update(i, { label: e.target.value })}
              placeholder="Label (e.g. AFCAT 2 2026)"
              className="min-w-[180px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <input type="date" value={it.date} onChange={(e) => update(i, { date: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <select value={it.kind ?? "exam"} onChange={(e) => update(i, { kind: e.target.value as "exam" | "batch" })}
              className="rounded-lg border border-slate-300 px-2 py-2 text-sm">
              <option value="exam">Exam</option>
              <option value="batch">Batch</option>
            </select>
            <button onClick={() => remove(i)} className="rounded border border-red-200 px-1.5 text-xs text-red-600 hover:bg-red-50">✕</button>
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800">+ Add date</button>

      {msg && <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
      <div className="mt-4">
        <button onClick={save} disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {busy ? "Saving…" : "Save & publish"}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">Live ticking countdowns appear on the homepage, auto-sorted by nearest date. Past dates show “passed”.</p>
    </div>
  );
}
