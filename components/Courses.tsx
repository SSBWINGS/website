"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { COURSES, BOOK, SITE } from "@/lib/data";
import { useContactModal } from "./ModalProvider";

export default function Courses({ heading = true }: { heading?: boolean }) {
  const { open } = useContactModal();
  return (
    <section id="courses" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        {heading && (
          <SectionHeading
            center
            kicker="Choose Your Battle Plan"
            title={<>Courses Built by <span className="tricolour-text">Assessors</span>, Not Teachers</>}
          />
        )}

        <div className="mt-8 flex justify-center">
          <a href={SITE.brochure} download className="btn btn-outline btn-shine">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download 2026 Brochure (PDF)
          </a>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {COURSES.map((c, i) => (
            <Reveal key={c.title} delay={i * 130} className="h-full">
              <article className={`card-lift relative flex h-full flex-col overflow-hidden p-8 ${c.highlight ? "skeu-plate" : "skeu-panel"}`}>
                {c.highlight && <div className="tricolour-bar absolute inset-x-0 top-0 h-1.5" aria-hidden />}
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-white shadow-[var(--shadow-raised)]"
                  style={{ background: c.highlight ? "linear-gradient(180deg,#ff9f43,#ef7a12)" : "linear-gradient(180deg,#2f3a4a,#101820)" }}>
                  ★ {c.tag}
                </span>

                <h3 className="mt-5 section-title text-3xl">{c.title}</h3>
                <p className="mt-1 font-display text-sm font-semibold uppercase tracking-[0.18em] text-saffron-700">{c.where}</p>
                <p className="mt-4 leading-relaxed text-ink-soft">{c.desc}</p>

                {c.image && (
                  <div className="photo-frame mt-5">
                    <div>
                      <Image src={c.image.src} alt={c.image.alt} width={646} height={377} sizes="(min-width: 1024px) 30vw, 90vw" className="h-auto w-full transition-transform duration-500 hover:scale-105" />
                    </div>
                  </div>
                )}

                <ul className="mt-6 flex-1 space-y-3">
                  {c.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                      <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-tri-green-600" aria-hidden>
                        <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {c.enrollUrl ? (
                  <a
                    href={c.enrollUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-shine mt-8 w-full ${c.highlight ? "btn-saffron" : "btn-ink"}`}
                  >
                    {c.cta}
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ) : (
                  <button onClick={open} className="btn btn-ink btn-shine mt-8 w-full">{c.cta}</button>
                )}
                {c.enrollUrl && (
                  <p className="mt-2 text-center text-[11px] text-ink-soft">🔒 Secure payment via Razorpay · seats limited</p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-8">
          <p className="skeu-inset px-6 py-4 text-center text-sm text-ink">
            🏠 <strong>Outstation aspirant?</strong> Our campus hostel offers AC rooms with three fresh meals a day.
            Alumni get <strong>free monthly practice sessions, for life.</strong>
          </p>
        </Reveal>

        {/* Featured book */}
        <Reveal delay={100} className="mt-14">
          <article className="skeu-plate card-lift grid items-center gap-8 overflow-hidden p-8 sm:p-10 md:grid-cols-[auto_1fr]">
            {/* Book cover mockup */}
            <div className="mx-auto w-[190px]">
              <div className="relative aspect-[3/4.4] w-full overflow-hidden rounded-r-md rounded-l-sm shadow-[0_18px_40px_-14px_rgba(16,24,32,0.7)]"
                style={{ background: "linear-gradient(160deg,#16233f,#0a1524)" }}>
                <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/50 to-transparent" aria-hidden />
                <div className="tricolour-bar absolute inset-x-0 top-0 h-1" aria-hidden />
                <div className="flex h-full flex-col items-center justify-between p-4 text-center">
                  <Image src="/logo.webp" alt="" width={44} height={44} className="mt-2 h-11 w-11 object-contain opacity-90" />
                  <div>
                    <p className="font-display text-3xl font-black uppercase leading-none gold-text">Victor</p>
                    <p className="font-display text-3xl font-black uppercase leading-none gold-text">Kilo</p>
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-navy-100/80">The Hustle Behind<br />Earning the Stars</p>
                  </div>
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gold-300">Vishal Kaushik</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <p className="kicker">From Our Director&apos;s Desk</p>
              <h3 className="mt-3 section-title text-3xl sm:text-4xl">
                {BOOK.title} <span className="tricolour-text">— {BOOK.subtitle}</span>
              </h3>
              <p className="mt-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-saffron-700">
                By {BOOK.author} · {BOOK.publisher}
              </p>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{BOOK.blurb}</p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="skeu-inset px-3 py-1.5 text-sm font-bold text-ink">{BOOK.price} <span className="text-xs font-normal text-ink-soft line-through">{BOOK.mrp}</span></span>
                <span className="skeu-inset px-3 py-1.5 text-sm font-semibold text-tri-green-700">{BOOK.rating}</span>
                <span className="skeu-inset px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft">{BOOK.edition}</span>
              </div>

              <a href={BOOK.buyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-saffron btn-shine mt-6">
                Buy on Flipkart
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                  <path d="M7 17 17 7m0 0H9m8 0v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
