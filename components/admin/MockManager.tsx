"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type MockQuestion = {
  id: string; type: "OIR" | "SRT"; question: string; options: string[];
  answer: number | null; explanation: string | null; difficulty: string | null;
  sort_order: number; published: boolean;
};

const emptyOir = { type: "OIR" as const, question: "", options: ["", "", "", ""], answer: 0, explanation: "", difficulty: "medium" };

export default function MockManager({ initial }: { initial: MockQuestion[] }) {
  const supabase = createClient();
  const [rows, setRows] = useState<MockQuestion[]>(initial);
  const [type, setType] = useState<"OIR" | "SRT">("OIR");
  const [form, setForm] = useState({ ...emptyOir });
  const [srtText, setSrtText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function add() {
    setBusy(true); setMsg(null);
    try {
      const sort_order = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
      const options = type === "OIR" ? form.options.map((o) => o.trim()).filter(Boolean) : [];
      const payload: Record<string, unknown> = type === "OIR"
        ? { type, question: form.question.trim(), options, answer: form.answer, explanation: form.explanation.trim() || null, difficulty: form.difficulty, sort_order, published: true }
        : { type, question: srtText.trim(), options: [], answer: null, explanation: null, difficulty: "medium", sort_order, published: true };
      if (!payload.question) throw new Error("Question text is required.");
      if (type === "OIR" && options.length < 2) throw new Error("Add at least two options.");
      const { data, error } = await supabase.from("mock_questions").insert(payload).select("*").single();
      if (error) throw new Error(error.message);
      setRows((r) => [...r, data as MockQuestion]);
      setForm({ ...emptyOir }); setSrtText("");
      setMsg(null);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(r: MockQuestion) {
    const next = !r.published;
    setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, published: next } : x)));
    await supabase.from("mock_questions").update({ published: next }).eq("id", r.id);
  }
  async function remove(id: string) {
    if (!confirm("Delete this question?")) return;
    const prev = rows;
    setRows((rs) => rs.filter((r) => r.id !== id));
    const { error } = await supabase.from("mock_questions").delete().eq("id", id);
    if (error) { setRows(prev); alert(error.message); }
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex gap-2">
          {(["OIR", "SRT"] as const).map((t) => (
            <button key={t} onClick={() => setType(t)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${type === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>{t}</button>
          ))}
        </div>

        {type === "OIR" ? (
          <div className="grid gap-3">
            <textarea value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} rows={2}
              placeholder="OIR question…" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <div className="grid gap-2 sm:grid-cols-2">
              {form.options.map((opt, i) => (
                <label key={i} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${form.answer === i ? "border-green-400 bg-green-50" : "border-slate-200"}`}>
                  <input type="radio" name="correct" checked={form.answer === i} onChange={() => setForm((f) => ({ ...f, answer: i }))} />
                  <input value={opt} onChange={(e) => setForm((f) => ({ ...f, options: f.options.map((o, j) => (j === i ? e.target.value : o)) }))}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`} className="flex-1 bg-transparent outline-none" />
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-400">Select the radio next to the correct option.</p>
            <input value={form.explanation} onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))}
              placeholder="Explanation (shown after submit)" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
        ) : (
          <textarea value={srtText} onChange={(e) => setSrtText(e.target.value)} rows={3}
            placeholder="Situation Reaction Test prompt…" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
        )}

        {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}
        <button onClick={add} disabled={busy} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{busy ? "Saving…" : "Add question"}</button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-base font-semibold text-slate-900">Questions ({rows.length})</h2>
        <ul className="divide-y divide-slate-100">
          {rows.map((r) => (
            <li key={r.id} className={`flex items-start gap-3 py-3 ${r.published ? "" : "opacity-50"}`}>
              <span className="mt-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">{r.type}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-800">{r.question}</p>
                {r.type === "OIR" && <p className="mt-0.5 truncate text-xs text-slate-400">Ans: {typeof r.answer === "number" ? r.options[r.answer] : "—"}</p>}
              </div>
              <button onClick={() => togglePublished(r)} className="rounded border border-slate-200 px-1.5 text-xs hover:bg-slate-50">{r.published ? "👁" : "🚫"}</button>
              <button onClick={() => remove(r.id)} className="rounded border border-red-200 px-1.5 text-xs text-red-600 hover:bg-red-50">✕</button>
            </li>
          ))}
          {rows.length === 0 && <li className="py-6 text-center text-sm text-slate-400">No questions yet.</li>}
        </ul>
      </div>
    </div>
  );
}
