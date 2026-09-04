"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export type FaqItem = { question: string; answer: string };

export default function FaqAccordion({ items, heading = true }: { items: FaqItem[]; heading?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-9 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        {heading && (
          <SectionHeading center kicker="Intel Briefing" title={<>Questions, <span className="tricolour-text">Answered Straight</span></>} />
        )}
        <div className="mt-12 space-y-4">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 60}>
                <div className={`faq-item skeu-panel overflow-hidden ${isOpen ? "is-open" : ""}`}>
                  <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                    <span className="font-display text-lg font-bold uppercase leading-snug text-ink sm:text-xl">{f.question}</span>
                    <span className="faq-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white shadow-[var(--shadow-raised)]"
                      style={{ background: isOpen ? "linear-gradient(180deg,#ff9f43,#ef7a12)" : "linear-gradient(180deg,#2f3a4a,#101820)" }}>+</span>
                  </button>
                  <div className="faq-answer"><div><div className="rich-html px-6 pb-6 leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: f.answer }} /></div></div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
