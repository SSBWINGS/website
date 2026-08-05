"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export type TItem = { name: string; rank: string; body: string; image: string };

const AUTOPLAY_MS = 7000;

export default function TestimonialsCarousel({ items, heading = true }: { items: TItem[]; heading?: boolean }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = items.length || 1;

  const go = useCallback((d: number) => setIdx((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    timer.current = setInterval(() => go(1), AUTOPLAY_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [go, idx]);

  if (items.length === 0) return null;
  const s = items[Math.min(idx, items.length - 1)];

  return (
    <section id="testimonials" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        {heading && (
          <SectionHeading
            center
            kicker="Stories in Uniform"
            title={<>They Were Told <span className="tricolour-text">No.</span> They Answered <span className="tricolour-text">Again.</span></>}
          />
        )}

        <Reveal delay={120}>
          <figure key={idx} className="journey-panel skeu-panel relative mt-12 grid gap-8 p-8 sm:grid-cols-[auto_1fr] sm:p-10">
            <div className="mx-auto sm:mx-0">
              <div className="medal h-32 w-32">
                <Image src={s.image} alt={s.name} width={200} height={200} className="h-full w-full rounded-full object-cover" />
              </div>
            </div>
            <div>
              <span aria-hidden className="font-display text-6xl leading-none text-gold-400">&ldquo;</span>
              <blockquote className="rich-html -mt-4 text-lg leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: s.body }} />
              <figcaption className="mt-5">
                <p className="font-display text-xl font-bold uppercase text-ink">{s.name}</p>
                <p className="text-sm font-semibold text-saffron-700">{s.rank}</p>
              </figcaption>
            </div>
          </figure>
        </Reveal>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} aria-label="Previous" className="flex h-11 w-11 items-center justify-center rounded-full text-ink shadow-[var(--shadow-raised)] transition hover:text-saffron-600" style={{ background: "linear-gradient(180deg,#fffdf7,#e6d29a)" }}>←</button>
          <div className="flex gap-2" role="tablist">
            {items.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} aria-label={`Story ${i + 1}`} aria-selected={i === idx} role="tab"
                className={`h-2.5 rounded-full transition-all duration-300 ${i === idx ? "w-8 bg-saffron-500" : "w-2.5 bg-ink-soft/30 hover:bg-ink-soft/50"}`} />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next" className="flex h-11 w-11 items-center justify-center rounded-full text-ink shadow-[var(--shadow-raised)] transition hover:text-saffron-600" style={{ background: "linear-gradient(180deg,#fffdf7,#e6d29a)" }}>→</button>
        </div>
      </div>
    </section>
  );
}
