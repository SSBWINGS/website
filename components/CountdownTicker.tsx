"use client";

import { useEffect, useState } from "react";
import type { CountdownItem } from "@/lib/countdown-defaults";

function parts(target: number, now: number) {
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { d, h, m, s, done: diff === 0 };
}

function Cell({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="tabular-nums text-2xl font-bold leading-none text-white sm:text-3xl">
        {String(n).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-white/60">{label}</span>
    </div>
  );
}

export default function CountdownTicker({ items }: { items: CountdownItem[] }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const upcoming = items
    .map((it) => ({ ...it, ts: new Date(it.date + "T00:00:00").getTime() }))
    .filter((it) => !Number.isNaN(it.ts))
    .sort((a, b) => a.ts - b.ts);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {upcoming.map((it) => {
        const p = now === null ? null : parts(it.ts, now);
        const past = p?.done ?? false;
        return (
          <div key={it.label + it.date}
            className={`rounded-2xl border p-4 ${it.kind === "batch" ? "border-yellow-400/40 bg-yellow-400/10" : "border-white/15 bg-white/5"}`}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{it.label}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase text-white/70">
                {it.kind === "batch" ? "Batch" : "Exam"}
              </span>
            </div>
            {past ? (
              <p className="py-2 text-sm font-semibold text-yellow-300">Happening now / passed</p>
            ) : p === null ? (
              <div className="grid grid-cols-4 gap-2 opacity-40">
                {["Days", "Hrs", "Min", "Sec"].map((l) => <Cell key={l} n={0} label={l} />)}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                <Cell n={p.d} label="Days" />
                <Cell n={p.h} label="Hrs" />
                <Cell n={p.m} label="Min" />
                <Cell n={p.s} label="Sec" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
