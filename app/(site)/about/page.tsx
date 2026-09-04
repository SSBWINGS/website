import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import CmsHero from "@/components/CmsHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import Mentors from "@/components/Mentors";
import WhyUs from "@/components/WhyUs";
import CtaBanner from "@/components/CtaBannerSection";
import { STATS } from "@/lib/data";
import { getPublished } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/media";
import { ABOUT_MISSION, ABOUT_VALUES } from "@/lib/section-defaults";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("about");
}

type Value = { icon: string; title: string; body: string };

export default async function AboutPage() {
  const [mission, valuesDoc] = await Promise.all([
    getPublished("about_mission", ABOUT_MISSION),
    getPublished<{ items: Value[] }>("about_values", { items: ABOUT_VALUES }),
  ]);
  const VALUES = valuesDoc.items?.length ? valuesDoc.items : ABOUT_VALUES;

  return (
    <main>
      <CmsHero pageKey="about" />

      <section className="relative py-9 sm:py-12">
        <div className="mx-auto grid max-w-[1840px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-2">
          <Reveal direction="left">
            <p className="kicker">{mission.kicker}</p>
            <h2 className="section-title mt-4 text-4xl sm:text-5xl" dangerouslySetInnerHTML={{ __html: mission.title }} />
            <div className="rich-html mt-6 space-y-4 text-lg leading-relaxed text-ink-soft [&_strong]:text-ink" dangerouslySetInnerHTML={{ __html: mission.body }} />
          </Reveal>
          <Reveal direction="right" delay={120}>
            <div className="photo-frame">
              <div>
                <Image src={mediaUrl(mission.image)} alt="SSBWINGS commissioned officer alumnus" width={900} height={300} sizes="(min-width:1024px) 45vw, 90vw" className="h-auto w-full" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4">
              {STATS.slice(0, 3).map((s) => (
                <div key={s.label} className="skeu-plate px-3 py-5 text-center">
                  <p className="font-display text-3xl font-black gold-text"><Counter target={s.value} /></p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative py-9 sm:py-12">
        <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
          <SectionHeading center kicker="What We Stand For" title={<>Our <span className="tricolour-text">Core Values</span></>} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 110}>
                <article className="card-lift skeu-panel h-full p-8 text-center">
                  <span className="text-5xl" aria-hidden>{v.icon}</span>
                  <h3 className="mt-4 font-display text-2xl font-bold uppercase text-ink">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{v.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Mentors />
      <WhyUs />
      <CtaBanner />
    </main>
  );
}
