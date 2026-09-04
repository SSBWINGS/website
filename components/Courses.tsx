import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import CmsSectionHeading from "./CmsSectionHeading";
import { COURSES } from "@/lib/data";
import { mediaUrl } from "@/lib/supabase/media";
import { getPublished, getSettings } from "@/lib/content";
import { COURSES_NOTE, COURSES_OPTIONS, type CoursesOptions } from "@/lib/homepage-defaults";

// Fields an admin may safely edit; payment URL, button, styling & image stay in code.
type CourseEdit = { tag: string; title: string; where: string; price: string; desc: string; features: string[] };
const pickSafe = (c: (typeof COURSES)[number]): CourseEdit => ({
  tag: c.tag, title: c.title, where: c.where, price: c.price ?? "", desc: c.desc, features: c.features,
});

export default async function Courses({ heading = true }: { heading?: boolean }) {
  const [doc, noteDoc, optionsDoc, SITE] = await Promise.all([
    getPublished<{ items: CourseEdit[] }>("courses_cards", { items: COURSES.map(pickSafe) }),
    getPublished<{ text: string }>("courses_note", { text: COURSES_NOTE }),
    getPublished<CoursesOptions>("courses_options", COURSES_OPTIONS),
    getSettings(),
  ]);
  // "off" hides every price without the admin having to clear each card.
  const showPrices = optionsDoc.showPrices !== "off";
  // Merge editable text over the protected code card (enrollUrl, cta, highlight, image kept).
  const cards = COURSES.map((c, i) => ({ ...c, ...(doc.items?.[i] ?? {}) }));
  return (
    <section id="courses" className="relative pb-6 pt-12 sm:pb-8 sm:pt-16">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        {heading && (
          <CmsSectionHeading
            sectionKey="courses"
            fallback={{
              kicker: "Choose Your Battle Plan",
              title: 'Courses Built by <span class="tricolour-text">Assessors</span>, Not Teachers',
            }}
          />
        )}

        <div className="mt-8 flex justify-center">
          <a href={mediaUrl(SITE.brochure)} download className="btn btn-outline btn-shine">
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
                {showPrices && c.price && (
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
          <p className="rich-html skeu-inset px-6 py-4 text-center text-sm text-ink [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: noteDoc.text }} />
        </Reveal>

      </div>
    </section>
  );
}
