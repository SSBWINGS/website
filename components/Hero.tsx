"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Counter from "./Counter";
import HeroShowcase from "./HeroShowcase";
import { HERO_SLIDES, type HeroSlide } from "@/lib/hero-slides";
import { asArray } from "@/lib/shape";
import { estimateFitCqw, fitFontPx } from "@/lib/fit-text";

import { HERO } from "@/lib/section-defaults";

export type HeroContent = {
  badge: string;
  headingLine1: string;
  headingLine2: string;
  paragraph: string; // HTML
  rating: string;
  /** Static text before the animated word, e.g. "Become ". */
  typedPrefix?: string;
  /** Words the typewriter cycles through. */
  typedWords?: string[];
  primaryCta?: string;
  primaryCtaHref?: string;
  secondaryCta?: string;
  secondaryCtaHref?: string;
};

export const HERO_DEFAULT: HeroContent = HERO;

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i % words.length];
    const delay = del ? 45 : text === w ? 1700 : 95;
    const t = setTimeout(() => {
      if (!del && text === w) setDel(true);
      else if (del && text === "") { setDel(false); setI((n) => (n + 1) % words.length); }
      else setText(w.slice(0, text.length + (del ? -1 : 1)));
    }, delay);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return text;
}

/**
 * Keeps each headline line on one line. Heading lines 1 and 2 share the
 * largest size at which both fit; the animated line matches them, shrinking
 * on its own only if its longest word would not fit at that size. Never
 * larger than the design size (set in CSS), so short headings look as before.
 *
 * The server can't measure text, so the first paint uses an estimate from the
 * characters (in cqw, which follows the column's width); the browser then
 * measures the real text before painting and whenever the column resizes.
 */
function useFittedHeadline(headings: string[], animated: string[]) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [measured, setMeasured] = useState<{ head: number; typed: number } | null>(null);
  const headKey = headings.join("\n");
  const typedKey = animated.join("\n");

  useLayoutEffect(() => {
    const h = ref.current;
    if (!h) return;
    let live = true;
    const measure = () => {
      if (!live) return;
      // Measured at the headline's current size so it inherits the exact
      // font, weight and tracking; width scales with size from there.
      const atPx = parseFloat(getComputedStyle(h).fontSize);
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap;pointer-events:none";
      h.appendChild(probe);
      const widthOf = (t: string) => ((probe.textContent = t), probe.getBoundingClientRect().width);
      const head = fitFontPx(h.clientWidth, headKey.split("\n").map(widthOf), atPx);
      const typed = fitFontPx(h.clientWidth, typedKey.split("\n").map(widthOf), atPx);
      probe.remove();
      if (head && typed) setMeasured((m) => (m && m.head === head && m.typed === typed ? m : { head, typed }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(h);
    // The display font may arrive after first paint and is a different width.
    document.fonts?.ready.then(measure);
    return () => { live = false; ro.disconnect(); };
  }, [headKey, typedKey]);

  const estHead = estimateFitCqw(headings);
  const estTyped = estimateFitCqw(animated);
  const style = {
    "--hero-fit": measured ? `${measured.head}px` : estHead ? `${estHead}cqw` : undefined,
    "--hero-typed-fit": measured ? `${measured.typed}px` : estTyped ? `${estTyped}cqw` : undefined,
  } as CSSProperties;
  return { ref, style };
}

const DEFAULT_STATS = [
  { value: 677, label: "Recommendations" },
  { value: 3450, label: "Alumni Family" },
  { value: 175, label: "NDA Entries" },
  { value: 10, label: "All India Rank 1" },
];

export default function Hero({
  content = HERO_DEFAULT,
  stats = DEFAULT_STATS,
  slides = HERO_SLIDES,
}: {
  content?: HeroContent;
  stats?: { value: number; label: string; suffix?: string }[];
  slides?: HeroSlide[];
}) {
  // Everything in the headline is CMS-editable, including the animated words.
  const words = asArray<string>(content.typedWords).filter(Boolean);
  const roles = words.length ? words : (HERO.typedWords as string[]);
  const typed = useTypewriter(roles);
  const prefix = content.typedPrefix ?? HERO.typedPrefix;
  // The animated line is sized for its longest word, cursor included.
  const headline = useFittedHeadline(
    [content.headingLine1, content.headingLine2],
    roles.map((w) => `${prefix}${w}|`),
  );

  return (
    <section className="relative overflow-hidden">
      {/* Tricolour wash + soft radial light — no dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,#fff8ec 0%, #faf6ec 55%, #f3ecd9 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-72 opacity-70"
        style={{ background: "linear-gradient(180deg, rgba(255,153,51,0.16), transparent)" }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-72 opacity-60"
        style={{ background: "linear-gradient(0deg, rgba(19,136,8,0.12), transparent)" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-[1840px] items-center gap-8 px-4 pb-10 pt-7 sm:px-8 lg:grid-cols-[1fr_1.08fr] lg:pt-10">
        {/* Left — copy (below the images on mobile) */}
        <div className="order-2 lg:order-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(43,36,22,0.14)] bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-soft shadow-[var(--shadow-raised)]">
            <span className="chakra text-[14px]" aria-hidden /> {content.badge}
          </div>

          {/* The wrapper is the size container the first-paint estimate uses. */}
          <div className="@container">
            <h1 ref={headline.ref} style={headline.style} className="hero-headline section-title leading-[0.98]">
              <span className="block whitespace-nowrap">{content.headingLine1}</span>
              <span className="block whitespace-nowrap">{content.headingLine2}</span>
              <span className="hero-typed block whitespace-nowrap">
                <span className="tricolour-text">{prefix}{typed}</span>
                <span className="animate-pulse text-saffron-600">|</span>
              </span>
            </h1>
          </div>

          {/* A div, not a p: the paragraph is rich text that may hold its own
              block tags, and a p cannot contain them — the browser would split
              it, the page would stop matching the server render, and React
              would throw the hero away and rebuild it on every load. */}
          <div
            className="rich-html mt-4 max-w-xl text-base leading-relaxed text-ink-soft [&_strong]:text-ink"
            dangerouslySetInnerHTML={{ __html: content.paragraph }}
          />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <Link href={content.primaryCtaHref || HERO.primaryCtaHref} className="btn btn-saffron btn-shine hero-btn">
              {content.primaryCta || HERO.primaryCta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href={content.secondaryCtaHref || HERO.secondaryCtaHref} className="btn btn-ink btn-shine btn-pulse hero-btn">
              {content.secondaryCta || HERO.secondaryCta}
            </Link>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-ink-soft">
            <span className="flex text-gold-500" aria-hidden>★★★★★</span>
            <span dangerouslySetInnerHTML={{ __html: content.rating }} />
          </div>
        </div>

        {/* Right — commissioned-officer showcase */}
        <div className="relative order-1 mx-auto w-full max-w-lg sm:max-w-none lg:order-2">
          <HeroShowcase slides={slides} />
        </div>
      </div>

      {/* Stat plates */}
      <div className="relative mx-auto -mb-8 grid max-w-[1840px] grid-cols-2 gap-3 px-4 pb-4 sm:px-8 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label + i} className="skeu-plate card-lift px-4 py-3.5 text-center">
            <p className="font-display text-3xl font-black leading-none gold-text sm:text-4xl">
              <Counter target={s.value} suffix={s.suffix ?? "+"} />
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
