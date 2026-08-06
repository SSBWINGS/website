"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Stat = { value: number; label: string };

export default function StatsEditor({ initial }: { initial: Stat[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<Stat[]>(initial.length ? initial : [{ value: 0, label: "" }]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const update = (i: number, patch: Partial<Stat>) =>
    setItems((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const add = () => setItems((s) => [...s, { value: 0, label: "" }]);
  const remove = (i: number) => setItems((s) => s.filter((_, j) => j !== i));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const copy = [...items]; [copy[i], copy[j]] = [copy[j], copy[i]]; setItems(copy);
  };

  async function save() {
    setBusy(true); setMsg(null);
    const doc = { items };
    const { error } = await supabase.from("site_content").upsert({
      key: "stats", label: "Scoreboard Stats", draft: doc, published: doc,
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setMsg({ ok: true, text: "Saved & published — live on the site." });
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
      <div className="space-y-3">
        {items.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="number" value={s.value} onChange={(e) => update(i, { value: Number(e.target.value) })}
              className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Number" />
            <input value={s.label} onChange={(e) => update(i, { label: e.target.value })}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Label (e.g. Recommendations)" />
            <button onClick={() => move(i, -1)} className="rounded border border-slate-200 px-1.5 text-slate-600 hover:bg-slate-50">↑</button>
            <button onClick={() => move(i, 1)} className="rounded border border-slate-200 px-1.5 text-slate-600 hover:bg-slate-50">↓</button>
            <button onClick={() => remove(i)} className="rounded border border-red-200 px-1.5 text-xs text-red-600 hover:bg-red-50">✕</button>
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800">+ Add stat</button>

      {msg && <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
      <div className="mt-4">
        <button onClick={save} disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {busy ? "Saving…" : "Save & publish"}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">The first four also appear as the plates under the homepage hero. A “+” is shown after each number automatically.</p>
    </div>
  );
}
