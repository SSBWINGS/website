"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { HeroSlide } from "@/lib/hero-slides";


/** The large hero frame: an auto-rotating carousel of commissioned officers.
 *  The caption underneath (term on the left, academy on the right) changes
 *  with each slide. */
export default function HeroShowcase({ slides, interval = 4200 }: { slides: HeroSlide[]; interval?: number }) {
  const [i, setI] = useState(0);
  const list = slides.length ? slides : [];

  useEffect(() => {
    if (list.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % list.length), interval);
    return () => clearInterval(t);
  }, [list.length, interval]);

  if (!list.length) return null;
  const active = list[Math.min(i, list.length - 1)];
  const hasCaption = Boolean(active.term || active.academy || active.name);

  return (
    <div>
      <div className="photo-frame card-lift relative w-full">
        <div>
          <div className="relative w-full bg-navy-950" style={{ aspectRatio: "3/2" }}>
            {list.map((s, idx) => (
              <Image
                key={s.image + idx}
                src={s.image}
                alt={idx === i ? `${s.name ?? "SSBWINGS alumnus"}${s.academy ? ` — ${s.academy}` : ""}` : ""}
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                priority={idx === 0}
                className={`object-cover transition-opacity duration-[900ms] ease-in-out ${idx === i ? "opacity-100" : "opacity-0"}`}
                style={{ objectPosition: "center 35%" }}
              />
            ))}
            {list.length > 1 && (
              <span className="absolute bottom-3 right-3 flex gap-1" aria-hidden>
                {list.map((_, idx) => (
                  <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-4 bg-gold-400" : "w-1.5 bg-white/60"}`} />
                ))}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Caption — term (left) · academy (right), changes with the slide */}
      {hasCaption && (
        <div key={i} className="journey-panel mt-3 flex items-start justify-between gap-4 px-1">
          <div className="min-w-0">
            {active.term && (
              <>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">Passed out</p>
                <p className="truncate font-display text-sm font-bold uppercase text-saffron-700">{active.term}</p>
              </>
            )}
          </div>
          <div className="min-w-0 text-right">
            {active.academy && (
              <>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">Academy</p>
                <p className="truncate font-display text-sm font-bold uppercase text-saffron-700">{active.academy}</p>
              </>
            )}
          </div>
        </div>
      )}
      {active.name && (
        <p key={`n${i}`} className="journey-panel mt-1 px-1 text-center font-display text-sm font-bold uppercase tracking-wide text-ink">
          {active.name}
        </p>
      )}
    </div>
  );
}
