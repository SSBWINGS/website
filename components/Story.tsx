import Image from "next/image";
import Reveal from "./Reveal";
import Link from "next/link";
import { getPublished } from "@/lib/content";
import { STORY } from "@/lib/section-defaults";

const GAPS = [
  {
    num: "01",
    title: "They don't know what the Board wants",
    body: "The SSB doesn't test knowledge — it tests 15 Officer Like Qualities. Most aspirants polish answers while assessors silently map their personality.",
    icon: "🔍",
  },
  {
    num: "02",
    title: "They don't know how they're assessed",
    body: "Three independent assessors — Psychologist, GTO and Interviewing Officer — cross-verify every response for five days. One rehearsed mask cannot fool all three.",
    icon: "⚖️",
  },
  {
    num: "03",
    title: "They can't project under pressure",
    body: "Qualities buried under nervousness are invisible to the Board. Projection is a trainable skill — and it's exactly what we drill, day after day, on real GTO ground.",
    icon: "📈",
  },
];

export default async function Story() {
  const c = await getPublished("story", STORY);
  return (
    <section id="story" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <p className="kicker">{c.kicker}</p>
              <h2 className="section-title mt-4 text-4xl sm:text-5xl" dangerouslySetInnerHTML={{ __html: c.title }} />
            </Reveal>
            <Reveal delay={150}>
              <p className="rich-html mt-6 text-lg leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: c.paragraph }} />
            </Reveal>
            <Reveal delay={250} className="mt-8 space-y-4">
              {GAPS.map((g) => (
                <div key={g.num} className="skeu-panel flex gap-4 p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-2xl shadow-[var(--shadow-raised)]" aria-hidden>{g.icon}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase text-ink">{g.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{g.body}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>

          <Reveal direction="right" delay={200}>
            <figure className="photo-frame group relative">
              <div>
                <Image
                  src="/images/women-officers.jpg"
                  alt="Women Officers contingent marching on the Kartavya Path during the Republic Day parade"
                  width={960}
                  height={639}
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption className="mt-4 px-2 pb-1 text-sm font-medium text-ink-soft">
                Every stride on the Kartavya Path began with one decision —{" "}
                <span className="font-bold text-saffron-700">to attempt the SSB.</span>
              </figcaption>
            </figure>
            <div className="mt-6 text-center">
              <Link href="/ssb-process" className="btn btn-ink btn-shine">See How the 5 Days Unfold →</Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
