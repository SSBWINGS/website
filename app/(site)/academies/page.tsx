import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import { getPublished } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/media";
import CmsHero from "@/components/CmsHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CtaBanner from "@/components/CtaBannerSection";
import { ACADEMIES_DOC, type AcademiesDoc } from "@/lib/academies";
import { asArray } from "@/lib/shape";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("academies");
}

const anchor = (s: unknown) => String(s ?? "").toLowerCase().replace(/\s+/g, "-") || "academy";

export default async function AcademiesPage() {
  const doc = await getPublished<AcademiesDoc>("academies", ACADEMIES_DOC);
  const items = asArray<AcademiesDoc["items"][number]>(doc.items);
  const academies = items.length ? items : ACADEMIES_DOC.items;

  return (
    <main>
      <CmsHero pageKey="academies" />

      <section className="relative py-10 sm:py-14">
        <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
          <SectionHeading
            center
            kicker={doc.kicker}
            kickerSize={(doc as { kickerSize?: string }).kickerSize}
            title={<span dangerouslySetInnerHTML={{ __html: doc.title }} />}
            subtitle={doc.subtitle}
          />

          {/* Quick jump */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {academies.map((a) => (
              <a key={anchor(a.short) + a.name} href={`#${anchor(a.short)}`}
                className="rounded-full border border-[rgba(43,36,22,0.18)] bg-paper px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wide text-ink shadow-[var(--shadow-raised)] transition hover:text-saffron-700">
                {a.short}
              </a>
            ))}
          </div>
        </div>
      </section>

      {academies.map((a, i) => (
        <section key={anchor(a.short) + i} id={anchor(a.short)}
          className={`relative py-10 sm:py-12 ${i % 2 === 1 ? "bg-cream-dark/40" : ""}`}>
          <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.3fr]">
              {/* Academy banner */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <Reveal direction="left">
                  <div className="card-lift relative overflow-hidden rounded-2xl shadow-[var(--shadow-plate)]">
                    <div className="relative aspect-[4/3] w-full">
                      <Image src={mediaUrl(a.image)} alt={a.name} fill sizes="(min-width:1024px) 32vw, 92vw" className="object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,21,36,0.15) 0%, rgba(10,21,36,0.88) 72%)" }} aria-hidden />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">{a.short}</span>
                      <h2 className="mt-3 font-display text-2xl font-extrabold uppercase leading-tight sm:text-3xl">{a.name}</h2>
                      <p className="mt-1 text-sm italic text-gold-300">{a.motto}</p>
                    </div>
                  </div>
                  <dl className="mt-4 grid gap-2 text-sm">
                    <div className="skeu-inset flex gap-2 px-3 py-2">
                      <dt className="font-display font-bold uppercase tracking-wide text-saffron-700">Location</dt>
                      <dd className="text-ink-soft">{a.location}</dd>
                    </div>
                    <div className="skeu-inset flex gap-2 px-3 py-2">
                      <dt className="font-display font-bold uppercase tracking-wide text-saffron-700">Service</dt>
                      <dd className="text-ink-soft">{a.service}</dd>
                    </div>
                    <div className="skeu-inset flex gap-2 px-3 py-2">
                      <dt className="font-display font-bold uppercase tracking-wide text-saffron-700">Since</dt>
                      <dd className="text-ink-soft">{a.established}</dd>
                    </div>
                  </dl>
                </Reveal>
              </div>

              {/* Detail */}
              <div>
                <Reveal>
                  <p className="rich-html text-lg leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: a.intro }} />
                </Reveal>

                <Reveal delay={120} className="mt-8">
                  <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ink-soft">Courses &amp; Training Duration</h3>
                  <div className="mt-4 overflow-hidden rounded-xl border border-[rgba(43,36,22,0.12)] bg-white">
                    <table className="w-full text-sm">
                      <thead className="bg-paper-2 text-left text-xs uppercase tracking-wide text-ink-soft">
                        <tr>
                          <th className="px-4 py-3 font-bold">Course / Entry</th>
                          <th className="px-4 py-3 font-bold">Duration</th>
                          <th className="px-4 py-3 font-bold">Who trains here</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgba(43,36,22,0.08)]">
                        {asArray<{ name: string; duration: string; who: string }>(a.courses).map((c, j) => (
                          <tr key={c.name + j}>
                            <td className="px-4 py-3 font-semibold text-ink">{c.name}</td>
                            <td className="whitespace-nowrap px-4 py-3 font-bold text-saffron-700">{c.duration}</td>
                            <td className="px-4 py-3 text-ink-soft">{c.who}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Reveal>

                {asArray<string>(a.highlights).length > 0 && (
                  <Reveal delay={180} className="mt-6">
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {asArray<string>(a.highlights).map((h, j) => (
                        <li key={j} className="skeu-panel flex gap-2 p-3 text-sm text-ink-soft">
                          <span className="text-tri-green-600" aria-hidden>★</span> {h}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      <CtaBanner />
    </main>
  );
}
