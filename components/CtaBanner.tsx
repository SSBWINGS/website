"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { SITE } from "@/lib/data";
import { CTA } from "@/lib/section-defaults";

type CtaContent = { eyebrow: string; title: string; paragraph: string };

export default function CtaBanner({ content = CTA }: { content?: CtaContent }) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="tricolour-bar absolute inset-x-0 top-0 z-10 h-2" aria-hidden />
      <div className="absolute inset-0" aria-hidden>
        <Image src="/images/ota-sunrise.jpg" alt="" fill sizes="100vw" className="kenburns object-cover object-[center_58%]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,248,236,0.86), rgba(243,236,217,0.92))" }} />
      </div>

      <Reveal className="relative mx-auto max-w-4xl px-4 text-center sm:px-8">
        <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-saffron-700">
          {content.eyebrow}
        </p>
        <h2 className="section-title mt-4 text-4xl leading-tight sm:text-6xl" dangerouslySetInnerHTML={{ __html: content.title }} />
        <p className="rich-html mx-auto mt-5 max-w-xl text-lg text-ink-soft" dangerouslySetInnerHTML={{ __html: content.paragraph }} />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/contact" className="btn btn-saffron btn-shine text-base">Book Free Counselling</Link>
          <a href={SITE.phone1Href} className="btn btn-outline btn-shine">📞 Call {SITE.phone1}</a>
        </div>
      </Reveal>
      <div className="tricolour-bar absolute inset-x-0 bottom-0 z-10 h-2" aria-hidden />
    </section>
  );
}
