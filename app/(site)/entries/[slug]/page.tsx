import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import CtaBanner from "@/components/CtaBannerSection";
import JsonLd from "@/components/JsonLd";
import {
  ENTRY_PAGES,
  ageRange,
  descriptionFor,
  educationText,
  entryPage,
  faqsFor,
  genderText,
  keywordsFor,
  maritalText,
  relatedTo,
  rulesFor,
  titleFor,
} from "@/lib/entry-pages";
import { breadcrumbLd, courseLd, faqLd, webPageLd } from "@/lib/jsonld";

const capitalise = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Service artwork already used by the Entries page, so these pages share its look. */
const SERVICE_IMAGE: Record<string, string> = {
  Army: "/images/services/army-op.jpg",
  Navy: "/images/services/navy-op.jpg",
  "Air Force": "/images/services/airforce-op.jpg",
  "Coast Guard": "/images/services/coastguard-op.jpg",
};

// Every entry is known at build time, so each page is pre-rendered.
export function generateStaticParams() {
  return ENTRY_PAGES.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = entryPage(slug);
  if (!page) return {};
  const title = titleFor(page);
  const description = descriptionFor(page);
  const path = `/entries/${page.slug}`;
  return {
    title,
    description,
    keywords: keywordsFor(page),
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "article" },
    twitter: { title, description },
  };
}

export default async function EntryPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = entryPage(slug);
  if (!page) notFound();

  const rules = rulesFor(page);
  const faqs = faqsFor(page);
  const related = relatedTo(page);
  const path = `/entries/${page.slug}`;

  // The facts the SSB turns on — laid out like the route cards on /entries.
  const facts: { label: string; value: string }[] = [
    { label: "Route", value: page.exam },
    ...(page.academy ? [{ label: "Training", value: page.academy }] : []),
    { label: "Commission", value: page.commission },
  ];

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Entries", path: "/entries" },
            { name: page.short, path },
          ]),
          webPageLd({ name: page.name, description: descriptionFor(page), path }),
          courseLd({
            name: `${page.short} SSB Interview Coaching`,
            description: `${page.intro} SSBWINGS prepares candidates for every stage of the ${page.short} SSB interview.`,
            path,
            keywords: keywordsFor(page),
          }),
          faqLd(faqs),
        ]}
      />

      <PageHero
        kicker={`${page.service} · Officer Entry`}
        title={page.name}
        subtitle={page.intro}
        image={SERVICE_IMAGE[page.service]}
        crumb={page.short}
      />

      {/* Eligibility — one card per rule this entry covers */}
      <section className="relative py-9 sm:py-12">
        <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
          <SectionHeading
            center
            kicker="Who Can Apply"
            title={<>{page.short} <span className="tricolour-text">Eligibility</span></>}
            subtitle={`Age limit, qualification and marital status for ${page.short}, from the latest official notifications.`}
          />

          <div className={`mt-12 grid gap-5 ${rules.length > 1 ? "md:grid-cols-2 xl:grid-cols-3" : "mx-auto max-w-2xl"}`}>
            {rules.map((e, i) => (
              <Reveal key={e.id} delay={i * 90}>
                <article className="skeu-panel card-lift h-full p-6">
                  <h3 className="font-display text-xl font-bold uppercase leading-tight text-ink">{e.name}</h3>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    {[
                      ["Age", ageRange(e)],
                      ["Who", genderText(e)],
                      ["Marital", maritalText(e)],
                      ["Qualification", capitalise(educationText(e))],
                      ...(e.serving ? [["Service", "Open only to serving personnel"]] : []),
                      ["How", e.how],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <dt className="w-28 shrink-0 font-display font-bold uppercase tracking-wide text-saffron-700">{k}</dt>
                        <dd className="text-ink-soft">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-ink-soft">
            {page.indicative
              ? "Indicative: no separate official notification with its own limits could be confirmed for this entry. Check the latest circular before applying."
              : "Figures follow the latest official notifications. Limits can change between cycles — always confirm against the current advertisement."}
          </p>
        </div>
      </section>

      {/* Route to commission */}
      <section className="relative py-8 sm:py-10">
        <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 90}>
                <div className="skeu-plate h-full p-6 text-center">
                  <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-saffron-700">{f.label}</p>
                  <p className="mt-2 text-ink">{f.value}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-3xl text-center">
            <p className="kicker justify-center">Every Route Ends at the SSB</p>
            <h2 className="section-title mt-4 text-3xl sm:text-4xl">
              Prepare for the <span className="tricolour-text">{page.short}</span> SSB
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-soft">
              Whatever the route to it, the {page.short} selection is decided at the 5-day SSB. SSBWINGS, mentored by
              ex-SSB assessors in Noida, trains you for every day of it — screening, psychology, GTO, interview and conference.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/courses" className="btn btn-saffron btn-shine">Explore Courses</Link>
              <Link href="/contact" className="btn btn-outline btn-shine">Book Free Counselling</Link>
              <Link href="/eligibility" className="btn btn-outline btn-shine">Check Your Eligibility</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Questions — also emitted as FAQPage data above */}
      <section className="relative pt-4">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <SectionHeading center kicker="Questions Answered" title={<>{page.short} <span className="tricolour-text">FAQs</span></>} />
        </div>
      </section>
      <FaqAccordion items={faqs} heading={false} />

      {/* Other entries in the same service — internal links for readers and crawlers */}
      {related.length > 0 && (
        <section className="relative py-8 sm:py-10">
          <div className="mx-auto max-w-[1840px] px-4 text-center sm:px-8">
            <p className="kicker justify-center">More {page.service} Entries</p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/entries/${r.slug}`}
                    className="inline-block rounded-full bg-paper-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft shadow-[var(--shadow-pressed)] transition hover:text-saffron-700"
                  >
                    {r.short}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/entries"
                  className="inline-block rounded-full bg-paper-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-saffron-700 shadow-[var(--shadow-pressed)]"
                >
                  All entries →
                </Link>
              </li>
            </ul>
          </div>
        </section>
      )}

      <CtaBanner />
    </main>
  );
}
