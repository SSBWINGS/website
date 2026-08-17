"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { DAYS } from "@/lib/data";

const SERVICE_GRAD: Record<string, string> = {
  army: "linear-gradient(160deg,#5a6b2b,#3a4019)",
  navy: "linear-gradient(160deg,#22508f,#142c52)",
  airforce: "linear-gradient(160deg,#3f92cf,#235f94)",
};

export default function Journey({ heading = true, days = DAYS }: { heading?: boolean; days?: typeof DAYS }) {
  const [active, setActive] = useState(0);
  const d = days[active];

  return (
    <section id="journey" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        {heading && (
          <SectionHeading
            center
            kicker="Know Your Battlefield"
            title={<>The 5-Day <span className="tricolour-text">SSB Journey</span></>}
            subtitle="Five days. Three assessors. Fifteen Officer Like Qualities. Here is exactly what awaits you at the Board — and how we forge you for each day."
          />
        )}

        {/* Day tabs */}
        <div role="tablist" aria-label="SSB days" className="mt-12 flex flex-wrap justify-center gap-3">
          {days.map((day, i) => (
            <button
              key={day.code}
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className="day-tab flex flex-col items-center rounded-xl px-5 py-3 font-display uppercase tracking-wider"
              style={
                active === i
                  ? { background: SERVICE_GRAD[day.service], color: "#fff", boxShadow: "var(--shadow-plate)" }
                  : { background: "linear-gradient(180deg,#fffdf7,#efe7d3)", color: "var(--color-ink)", boxShadow: "var(--shadow-raised)" }
              }
            >
              <span className="text-xs opacity-80">{day.day}</span>
              <span className="text-base font-bold">{day.code}</span>
            </button>
          ))}
        </div>

        {/* Progress track */}
        <div className="mx-auto mt-8 hidden h-2 max-w-3xl overflow-hidden rounded-full sm:block skeu-inset" aria-hidden>
          <div className="tricolour-bar h-full transition-all duration-500 ease-out" style={{ width: `${((active + 1) / days.length) * 100}%` }} />
        </div>

        {/* Active panel */}
        <div key={active} role="tabpanel" className="journey-panel skeu-panel mx-auto mt-10 max-w-5xl overflow-hidden">
          <div className="grid lg:grid-cols-[1.2fr_1fr]">
            <div className="p-8 sm:p-10">
              <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-saffron-700">{d.day} — {d.code}</p>
              <h3 className="mt-3 section-title text-3xl sm:text-4xl">{d.title}</h3>
              <p className="mt-1 font-semibold text-saffron-600">{d.subtitle}</p>
              <p className="mt-5 leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: d.brief }} />
              <div className="mt-6 rounded-xl border-l-4 border-gold-500 bg-gold-50 p-5">
                <p className="text-sm leading-relaxed text-ink">
                  <span className="font-display font-bold uppercase tracking-wider text-saffron-700">Our Drill → </span>
                  <span dangerouslySetInnerHTML={{ __html: d.drill }} />
                </p>
              </div>
            </div>
            <div className="skeu-inset border-t border-[rgba(43,36,22,0.08)] p-8 sm:p-10 lg:border-l lg:border-t-0">
              <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-ink-soft">Tests of the Day</p>
              <ul className="mt-5 space-y-4">
                {d.tests.map((t, i) => (
                  <li key={t.name} className="journey-panel flex gap-4" style={{ animationDelay: `${i * 80}ms` }}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-sm font-extrabold text-white shadow-[var(--shadow-raised)]" style={{ background: SERVICE_GRAD[d.service] }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-lg font-bold uppercase tracking-wide text-ink">{t.name}</p>
                      <p className="text-sm text-ink-soft">{t.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
