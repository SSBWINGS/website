"use client";

import { useState } from "react";
import { findEligible, type Entry, type EligibilityInput, type Education, type Gender, type Marital } from "@/lib/eligibility";

const EDU: { v: Education; label: string }[] = [
  { v: "10+2", label: "Class 12 (10+2)" },
  { v: "graduate", label: "Graduate" },
  { v: "engineering", label: "Engineering" },
  { v: "law", label: "Law (LLB)" },
  { v: "postgraduate", label: "Post-graduate" },
];

export default function EligibilityFinder() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [marital, setMarital] = useState<Marital>("unmarried");
  const [education, setEducation] = useState<Education>("10+2");
  const [pcm, setPcm] = useState(true);
  const [serving, setServing] = useState(false);
  const [results, setResults] = useState<Entry[] | null>(null);

  // lead capture
  const [lead, setLead] = useState({ name: "", email: "", phone: "", company: "" });
  const [sent, setSent] = useState(false);
  const [leadMsg, setLeadMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function compute() {
    const a = parseFloat(age);
    if (Number.isNaN(a) || a < 15 || a > 40) {
      setResults([]);
      return;
    }
    const input: EligibilityInput = { age: a, gender, marital, education, pcm, serving };
    setResults(findEligible(input));
    setSent(false);
    setLeadMsg(null);
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setLeadMsg(null);
    try {
      const entries = (results ?? []).map((r) => r.name).join(", ");
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          source: "eligibility",
          entry: (results ?? [])[0]?.name ?? "",
          message: `Eligible for: ${entries || "none"}`,
          meta: { age, gender, marital, education, pcm, serving, count: results?.length ?? 0 },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not submit.");
      setSent(true);
    } catch (err) {
      setLeadMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const byService = (results ?? []).reduce<Record<string, Entry[]>>((acc, e) => {
    (acc[e.service] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Your age
            <input type="number" step="0.5" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 18"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </label>
          <label className="text-sm font-medium text-slate-700">Highest qualification
            <select value={education} onChange={(e) => setEducation(e.target.value as Education)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500">
              {EDU.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
            </select>
          </label>
          <div className="text-sm font-medium text-slate-700">Gender
            <div className="mt-1 flex gap-2">
              {(["male", "female"] as Gender[]).map((g) => (
                <button key={g} type="button" onClick={() => setGender(g)}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-sm capitalize ${gender === g ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-600"}`}>{g}</button>
              ))}
            </div>
          </div>
          <div className="text-sm font-medium text-slate-700">Marital status
            <div className="mt-1 flex gap-2">
              {(["unmarried", "married"] as Marital[]).map((m) => (
                <button key={m} type="button" onClick={() => setMarital(m)}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-sm capitalize ${marital === m ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-600"}`}>{m}</button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
            <input type="checkbox" checked={pcm} onChange={(e) => setPcm(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            I had Physics &amp; Maths in Class 12
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
            <input type="checkbox" checked={serving} onChange={(e) => setServing(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            I am already serving in the Armed Forces (soldier / sailor / airman / JCO / NCO)
            <span className="text-xs font-normal text-slate-500">— unlocks ACC, SCO and PC(SL)</span>
          </label>
        </div>
        <button onClick={compute}
          className="mt-6 w-full rounded-lg bg-[#0a1524] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#13233b] sm:w-auto sm:px-8">
          Show my eligible entries →
        </button>
      </div>

      {results !== null && (
        <div className="mt-8">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
              <p className="font-semibold text-amber-900">No standard officer entries matched those exact criteria.</p>
              <p className="mt-1 text-sm text-amber-800">Eligibility windows are tight — talk to our counsellors, there may still be a route for you.</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-center text-lg font-semibold text-[#0a1524]">
                🎖 You may be eligible for <span className="text-[#b8860b]">{results.length}</span> officer {results.length === 1 ? "entry" : "entries"}
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {Object.entries(byService).map(([service, list]) => (
                  <div key={service} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#b8860b]">{service}</h3>
                    <ul className="space-y-3">
                      {list.map((e) => (
                        <li key={e.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                          <p className="font-semibold text-[#0a1524]">{e.name}</p>
                          <p className="text-xs text-slate-500">{e.stage} · {e.how}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Lead capture */}
          {!sent ? (
            <form onSubmit={submitLead} className="mt-8 rounded-2xl border border-slate-200 bg-[#faf8f1] p-6">
              <h3 className="text-base font-bold text-[#0a1524]">Get a free counselling call</h3>
              <p className="mt-1 text-sm text-slate-600">Our ex-SSB officers will help you pick the right entry and prep plan.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <input required value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="Full name"
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
                <input required type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="Email"
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
                <input required value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} placeholder="Phone"
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
              <input tabIndex={-1} autoComplete="off" value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })}
                className="hidden" aria-hidden />
              {leadMsg && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{leadMsg}</p>}
              <button type="submit" disabled={busy}
                className="mt-4 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                {busy ? "Sending…" : "Request my free call"}
              </button>
            </form>
          ) : (
            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
              <p className="font-semibold text-green-800">✓ Thank you! Our team will call you back shortly.</p>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-slate-400">
            Indicative guidance based on typical eligibility. Always confirm against the official UPSC/Service notification.
          </p>
        </div>
      )}
    </div>
  );
}
