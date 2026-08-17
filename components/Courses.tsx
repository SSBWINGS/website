import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { COURSES, BOOKS, SITE } from "@/lib/data";
import { getPublished } from "@/lib/content";

// Fields an admin may safely edit; payment URL, button, styling & image stay in code.
type CourseEdit = { tag: string; title: string; where: string; price: string; desc: string; features: string[] };
const pickSafe = (c: (typeof COURSES)[number]): CourseEdit => ({
  tag: c.tag, title: c.title, where: c.where, price: c.price ?? "", desc: c.desc, features: c.features,
});

export default async function Courses({ heading = true }: { heading?: boolean }) {
  const doc = await getPublished<{ items: CourseEdit[] }>("courses_cards", { items: COURSES.map(pickSafe) });
  // Merge editable text over the protected code card (enrollUrl, cta, highlight, image kept).
  const cards = COURSES.map((c, i) => ({ ...c, ...(doc.items?.[i] ?? {}) }));
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
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 130} className="h-full">
              <article className={`card-lift relative flex h-full flex-col overflow-hidden p-8 ${c.highlight ? "skeu-plate" : "skeu-panel"}`}>
                {c.highlight && <div className="tricolour-bar absolute inset-x-0 top-0 h-1.5" aria-hidden />}
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-white shadow-[var(--shadow-raised)]"
                  style={{ background: c.highlight ? "linear-gradient(180deg,#ff9f43,#ef7a12)" : "linear-gradient(180deg,#2f3a4a,#101820)" }}>
                  ★ {c.tag}
                </span>

                <h3 className="mt-5 section-title text-3xl">{c.title}</h3>
                <p className="mt-1 font-display text-sm font-semibold uppercase tracking-[0.18em] text-saffron-700">{c.where}</p>
                {c.price && (
                  <p className="mt-3 font-display text-3xl font-black text-ink">
                    {c.price}
                    <span className="ml-2 align-middle text-xs font-semibold uppercase tracking-wide text-ink-soft">all inclusive</span>
                  </p>
                )}
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
                  <Link href="/contact" className="btn btn-ink btn-shine mt-8 w-full">{c.cta}</Link>
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

        {/* Featured books */}
        <div className="mt-14 space-y-8">
          {BOOKS.map((book, i) => (
            <Reveal key={book.title} delay={100}>
              <article className="skeu-plate card-lift grid items-center gap-8 overflow-hidden p-8 sm:p-10 md:grid-cols-[auto_1fr]">
                {/* Real cover */}
                <div className="mx-auto w-[190px]">
                  <div className="relative aspect-[3/4.4] w-full overflow-hidden rounded-r-md rounded-l-sm shadow-[0_18px_40px_-14px_rgba(16,24,32,0.7)]">
                    <Image src={book.cover} alt={`${book.title} — ${book.subtitle}`} fill sizes="190px" className="object-cover" />
                  </div>
                </div>

                {/* Details */}
                <div>
                  <p className="kicker">{i === 0 ? "New · SSB Workbook" : "From Our Director’s Desk"}</p>
                  <h3 className="mt-3 section-title text-3xl sm:text-4xl">
                    {book.title} <span className="tricolour-text">— {book.subtitle}</span>
                  </h3>
                  <p className="mt-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-saffron-700">
                    By {book.author} · {book.publisher}
                  </p>
                  <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{book.blurb}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {book.rating && <span className="skeu-inset px-3 py-1.5 text-sm font-semibold text-tri-green-700">{book.rating}</span>}
                    {book.edition && <span className="skeu-inset px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft">{book.edition}</span>}
                  </div>

                  <a href={book.buyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-saffron btn-shine mt-6">
                    Buy on Flipkart
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                      <path d="M7 17 17 7m0 0H9m8 0v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
