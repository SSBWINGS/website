"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Counter from "./Counter";
import HeroShowcase from "./HeroShowcase";
import { HERO_SLIDES, type HeroSlide } from "@/lib/hero-slides";
import { asArray } from "@/lib/shape";
import { headingPercent } from "@/lib/hero-heading";
import { useTypewriter } from "./useTypewriter";

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
  /** Heading size as a % of the design size — phones, and tablets/desktops. */
  headingSizeMobile?: number | string;
  headingSizeDesktop?: number | string;
};

export const HERO_DEFAULT: HeroContent = HERO;

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

          {/* Left-aligned; each heading starts on its own line and a long one
              wraps. Size is the design size scaled by the admin's setting for
              phones and for larger screens (see .hero-headline). */}
          <h1
            className="hero-headline section-title text-left leading-[0.98]"
            style={{
              "--hs-m": headingPercent(content.headingSizeMobile) / 100,
              "--hs-d": headingPercent(content.headingSizeDesktop) / 100,
            } as CSSProperties}
          >
            <span className="block">{content.headingLine1}</span>
            <span className="block">{content.headingLine2}</span>
            <span className="block">
              <span className="tricolour-text">{prefix}{typed}</span>
              <span className="animate-pulse text-saffron-600">|</span>
            </span>
          </h1>

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
