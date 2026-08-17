import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import Mentors from "@/components/Mentors";
import WhyUs from "@/components/WhyUs";
import CtaBanner from "@/components/CtaBannerSection";
import { STATS } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("about");
}

const VALUES = [
  { icon: "🎯", title: "Merit Before Marketing", body: "We never promise recommendations. We promise assessor-grade preparation and honest feedback — the Board decides the rest." },
  { icon: "🤝", title: "Mentorship for Life", body: "Enroll once; stay family forever. Alumni return for free monthly practice sessions and to mentor the next batch." },
  { icon: "🛡️", title: "Discipline & Character", body: "The uniform rewards OLQs. Everything we do — from the GTO ground to midnight interview calls — builds the officer within." },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        crumb="About"
        kicker="Our Story"
        title={<>We Give Shape to Your <span className="tricolour-text">Dreams</span></>}
        subtitle="Born from the belief that every deserving aspirant deserves an honest shot at the uniform — mentored by the very officers who once sat on the assessor's chair."
        image="/images/ota-sunrise.jpg"
      />

      <section className="relative py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1840px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-2">
          <Reveal direction="left">
            <p className="kicker">The Mission</p>
            <h2 className="section-title mt-4 text-4xl sm:text-5xl">From Aspirant to <span className="tricolour-text">Officer</span></h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>India has more than 1.4 billion people, yet the Armed Forces remain short of officers. The gap isn&apos;t talent — it&apos;s <strong className="text-ink">preparation that understands the Board</strong>.</p>
              <p>SSBWINGS was founded to close that gap. Our director <strong className="text-ink">Vishal Kaushik</strong>, alongside a bench of retired Interviewing Officers, GTOs and DIPR-trained psychologists, built an academy that mirrors the real SSB — a full GTO ground, honest psychology feedback and one-on-one mock interviews.</p>
              <p>The result: <strong className="text-ink">677+ recommendations</strong>, cadets marching into IMA, INA, AFA and OTA — many after repeated setbacks that we helped them turn around.</p>
            </div>
          </Reveal>
          <Reveal direction="right" delay={120}>
            <div className="photo-frame">
              <div>
                <Image src="/images/campus/imagestwo-20.jpg" alt="SSBWINGS commissioned officer alumnus" width={900} height={300} sizes="(min-width:1024px) 45vw, 90vw" className="h-auto w-full" />
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

      <section className="relative py-16">
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
