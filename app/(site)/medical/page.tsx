import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import { getPublished } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/media";
import CmsHero from "@/components/CmsHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CtaBanner from "@/components/CtaBannerSection";
import { MEDICAL, type MedicalDoc } from "@/lib/medical";
import { asArray } from "@/lib/shape";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("medical");
}

const pick = <T,>(v: unknown, fallback: T[]): T[] => {
  const arr = asArray<T>(v);
  return arr.length ? arr : fallback;
};

export default async function MedicalPage() {
  const d = await getPublished<MedicalDoc>("medical", MEDICAL);
  const stages = pick(d.stages, MEDICAL.stages);
  const standards = pick(d.standards, MEDICAL.standards);
  const common = pick(d.common, MEDICAL.common);
  const faqs = pick(d.faqs, MEDICAL.faqs);

  return (
    <main>
      <CmsHero pageKey="medical" />

      {/* Process */}
      <section className="relative py-10 sm:py-12">
        <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
          <SectionHeading
            center
            kicker={d.kicker}
            kickerSize={(d as { kickerSize?: string }).kickerSize}
            title={<span dangerouslySetInnerHTML={{ __html: d.processTitle }} />}
            subtitle={d.processIntro}
          />

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.25fr_1fr]">
            <ol className="space-y-4">
              {stages.map((s, i) => (
                <Reveal key={s.title + i} delay={i * 60}>
                  <li className="skeu-panel flex gap-4 p-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-2xl shadow-[var(--shadow-raised)]" aria-hidden>{s.icon}</span>
                    <div>
                      <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-saffron-700">{s.step}</p>
                      <h3 className="mt-0.5 font-display text-lg font-bold uppercase text-ink">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: s.detail }} />
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>

            <Reveal direction="right" delay={150} className="lg:sticky lg:top-24">
              <figure className="photo-frame">
                <div className="relative aspect-[4/3] w-full">
                  <Image src={mediaUrl(d.image1)} alt="Medical fitness training at SSBWINGS" fill sizes="(min-width:1024px) 34vw, 92vw" className="object-cover" />
                </div>
              </figure>
              <figure className="photo-frame mt-5">
                <div className="relative aspect-[4/3] w-full">
                  <Image src={mediaUrl(d.image2)} alt="Guard of honour — the reward for clearing the medical" fill sizes="(min-width:1024px) 34vw, 92vw" className="object-cover" />
                </div>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Standards table */}
      <section className="relative bg-cream-dark/40 py-10 sm:py-12">
        <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
          <SectionHeading center kicker="Know the Bar" title={<span dangerouslySetInnerHTML={{ __html: d.standardsTitle }} />} subtitle={d.standardsIntro} />
          <div className="mt-10 overflow-x-auto rounded-xl border border-[rgba(43,36,22,0.12)] bg-white">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-paper-2 text-left text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-bold">Academy / Service</th>
                  <th className="px-4 py-3 font-bold">Height</th>
                  <th className="px-4 py-3 font-bold">Weight</th>
                  <th className="px-4 py-3 font-bold">Vision</th>
                  <th className="px-4 py-3 font-bold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(43,36,22,0.08)]">
                {standards.map((s, i) => (
                  <tr key={s.academy + i}>
                    <td className="px-4 py-3 font-semibold text-ink">{s.academy}</td>
                    <td className="px-4 py-3 text-ink-soft">{s.height}</td>
                    <td className="px-4 py-3 text-ink-soft">{s.weight}</td>
                    <td className="px-4 py-3 text-ink-soft">{s.vision}</td>
                    <td className="px-4 py-3 text-ink-soft">{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-xs text-ink-soft">Indicative standards — always confirm against the official notification for your entry.</p>
        </div>
      </section>

      {/* Common rejections + appeal */}
      <section className="relative py-10 sm:py-12">
        <div className="mx-auto grid max-w-[1840px] gap-10 px-4 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <h2 className="section-title text-3xl sm:text-4xl" dangerouslySetInnerHTML={{ __html: d.commonTitle }} />
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {common.map((c, i) => (
                <li key={i} className="skeu-inset flex gap-2 px-3 py-2 text-sm text-ink-soft">
                  <span className="text-saffron-600" aria-hidden>▸</span> {c}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="right" delay={120}>
            <div className="skeu-plate p-8">
              <h2 className="section-title text-3xl" dangerouslySetInnerHTML={{ __html: d.appealTitle }} />
              <div className="rich-html mt-4 space-y-3 leading-relaxed text-ink-soft [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink"
                dangerouslySetInnerHTML={{ __html: d.appealBody }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQs */}
      <section className="relative bg-cream-dark/40 py-10 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <SectionHeading center kicker="Medical Queries" title={<>Frequently Asked <span className="tricolour-text">Questions</span></>} />
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="skeu-panel group p-5">
                <summary className="cursor-pointer list-none font-display text-base font-bold uppercase text-ink marker:hidden">
                  <span className="mr-2 text-saffron-600" aria-hidden>❯</span>{f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
