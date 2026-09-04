import Image from "next/image";
import Reveal from "./Reveal";
import Link from "next/link";
import { getPublished } from "@/lib/content";
import { STORY, STORY_GAPS } from "@/lib/section-defaults";

type Gap = { icon: string; title: string; body: string };

export default async function Story() {
  const [c, gapsDoc] = await Promise.all([
    getPublished("story", STORY),
    getPublished<{ items: Gap[] }>("story_gaps", { items: STORY_GAPS }),
  ]);
  const GAPS = gapsDoc.items?.length ? gapsDoc.items : STORY_GAPS;
  return (
    <section id="story" className="relative py-9 sm:py-12">
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
              {GAPS.map((g, i) => (
                <div key={g.title + i} className="skeu-panel flex gap-4 p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-2xl shadow-[var(--shadow-raised)]" aria-hidden>{g.icon}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase text-ink">{g.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: g.body }} />
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
