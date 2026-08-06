"use client";

import { useState } from "react";

export type OirQuestion = { id: string; question: string; options: string[] };
type Result = {
  correct: number;
  total: number;
  details: { id: string; chosen: number; answer: number | null; correct: boolean; explanation: string | null }[];
};

export default function MockQuiz({ questions }: { questions: OirQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (questions.length === 0) {
    return <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Practice questions are being added — check back soon.</p>;
  }

  const detailFor = (id: string) => result?.details.find((d) => d.id === id);

  async function submit() {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/mock/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not score.");
      setResult(json as Result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const pct = result ? Math.round((result.correct / result.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl">
      {result && (
        <div className="mb-8 rounded-2xl border border-[#e5ddcb] bg-white p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#b8860b]">Your OIR score</p>
          <p className="mt-2 text-5xl font-extrabold text-[#0a1524]">{result.correct}<span className="text-2xl text-slate-400">/{result.total}</span></p>
          <div className="mx-auto mt-4 h-3 max-w-sm overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-[#b8860b] to-[#f2d519]" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {pct >= 80 ? "Excellent — screening-ready reasoning! 🎯" : pct >= 50 ? "Good going — keep drilling speed & accuracy." : "Keep practising — reasoning improves fast with reps."}
          </p>
        </div>
      )}

      <div className="space-y-5">
        {questions.map((q, i) => {
          const d = detailFor(q.id);
          return (
            <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-semibold text-[#0a1524]"><span className="text-slate-400">Q{i + 1}.</span> {q.question}</p>
              <div className="mt-3 grid gap-2">
                {q.options.map((opt, idx) => {
                  const chosen = answers[q.id] === idx;
                  let cls = "border-slate-200 hover:border-blue-300";
                  if (d) {
                    if (idx === d.answer) cls = "border-green-400 bg-green-50";
                    else if (chosen) cls = "border-red-400 bg-red-50";
                    else cls = "border-slate-200 opacity-70";
                  } else if (chosen) cls = "border-blue-500 bg-blue-50";
                  return (
                    <button key={idx} type="button" disabled={!!result}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition ${cls}`}>
                      <span className="font-semibold text-slate-500">{String.fromCharCode(65 + idx)}.</span> {opt}
                    </button>
                  );
                })}
              </div>
              {d?.explanation && (
                <p className="mt-3 rounded-lg bg-[#faf8f1] px-3 py-2 text-xs text-slate-600"><span className="font-semibold">Why:</span> {d.explanation}</p>
              )}
            </div>
          );
        })}
      </div>

      {err && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

      {!result ? (
        <button onClick={submit} disabled={busy || Object.keys(answers).length === 0}
          className="mt-6 w-full rounded-lg bg-[#0a1524] px-6 py-3 text-sm font-semibold text-white hover:bg-[#13233b] disabled:opacity-50 sm:w-auto sm:px-10">
          {busy ? "Scoring…" : `Submit & see my score (${Object.keys(answers).length}/${questions.length})`}
        </button>
      ) : (
        <button onClick={() => { setResult(null); setAnswers({}); }}
          className="mt-6 w-full rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto sm:px-10">
          Try again
        </button>
      )}
    </div>
  );
}
