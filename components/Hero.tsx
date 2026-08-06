"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Counter from "./Counter";
import PhotoCarousel from "./PhotoCarousel";
import { useContactModal } from "./ModalProvider";

const ROLES = ["an Officer", "a Leader", "a Warrior", "Recommended"];

import { HERO } from "@/lib/section-defaults";

export type HeroContent = {
  badge: string;
  headingLine1: string;
  headingLine2: string;
  paragraph: string; // HTML
  rating: string;
};

export const HERO_DEFAULT: HeroContent = HERO;

/** Recommended-candidate photos that auto-rotate in the hero collage. */
const RECO_PHOTOS = [
  "/images/students/tanishq.png",
  "/images/students/tejas.jpg",
  "/images/students/yash.jpg",
  "/images/students/rahul.jpg",
  "/images/students/tanya.jpg",
  "/images/students/harshvardhan.jpg",
  "/images/students/khushi.jpg",
  "/images/students/chaitanya.jpg",
  "/images/students/harsh.jpg",
  "/images/students/aditya.png",
];

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

const DEFAULT_STATS = [
  { value: 677, label: "Recommendations" },
  { value: 3450, label: "Alumni Family" },
  { value: 175, label: "NDA Entries" },
  { value: 10, label: "All India Rank 1" },
];

export default function Hero({ content = HERO_DEFAULT, stats = DEFAULT_STATS }: { content?: HeroContent; stats?: { value: number; label: string }[] }) {
  const typed = useTypewriter(ROLES);
  const { open } = useContactModal();

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

          <h1 className="section-title text-4xl leading-[0.98] sm:text-5xl lg:text-6xl">
            {content.headingLine1}
            <br /> {content.headingLine2}
            <br />
            <span className="tricolour-text">Become {typed}</span>
            <span className="animate-pulse text-saffron-600">|</span>
          </h1>

          <p
            className="rich-html mt-4 max-w-xl text-base leading-relaxed text-ink-soft [&_strong]:text-ink"
            dangerouslySetInnerHTML={{ __html: content.paragraph }}
          />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button onClick={open} className="btn btn-saffron btn-shine text-base">
              Book Free Counselling
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <Link href="/ssb-process" className="btn btn-outline btn-shine">Decode the 5-Day SSB</Link>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-ink-soft">
            <span className="flex text-gold-500" aria-hidden>★★★★★</span>
            {content.rating}
          </div>
        </div>

        {/* Right — photo collage: pipping ceremony + marching contingent (first on mobile) */}
        <div className="relative order-1 mx-auto w-full max-w-lg pb-10 sm:max-w-none sm:pb-16 lg:order-2 lg:pb-8">
          {/* Main — commissioning "pipping" ceremony */}
          <div className="photo-frame card-lift relative z-10 w-full sm:ml-auto sm:w-[92%] sm:-rotate-2">
            <div>
              <Image
                src="/images/pipping-ceremony.jpg"
                alt="A newly commissioned officer receives his rank stars at the pipping ceremony"
                width={1000}
                height={667}
                priority
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="kenburns h-auto w-full"
              />
            </div>
          </div>
          {/* Secondary — auto carousel of recommended candidates, overlapping */}
          <div className="photo-frame card-lift absolute -bottom-6 left-0 z-20 w-[58%] rotate-3 sm:-bottom-10 sm:w-[52%]">
            <div>
              <PhotoCarousel
                images={RECO_PHOTOS}
                alt="An SSBWINGS recommended candidate"
                sizes="(min-width: 1024px) 26vw, 55vw"
              />
            </div>
          </div>
          {/* Floating tricolour medal */}
          <div className="absolute -right-1 -top-5 z-30 hidden animate-float lg:block">
            <div className="skeu-plate flex h-24 w-24 flex-col items-center justify-center text-center">
              <span className="font-display text-2xl font-black leading-none gold-text">AIR 1</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-ink-soft">10× Toppers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat plates */}
      <div className="relative mx-auto -mb-8 grid max-w-[1840px] grid-cols-2 gap-3 px-4 pb-4 sm:px-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="skeu-plate card-lift px-4 py-3.5 text-center">
            <p className="font-display text-3xl font-black leading-none gold-text sm:text-4xl">
              <Counter target={s.value} />
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
