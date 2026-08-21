import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import BookButton from "./BookButton";
import { getPublished } from "@/lib/content";
import { WHYUS, WHYUS_ITEMS } from "@/lib/section-defaults";

type Usp = { icon: string; title: string; body: string };

export default async function WhyUs() {
  const [c, itemsDoc] = await Promise.all([
    getPublished("whyus", WHYUS),
    getPublished<{ items: Usp[] }>("whyus_items", { items: WHYUS_ITEMS }),
  ]);
  const USPS = itemsDoc.items?.length ? itemsDoc.items : WHYUS_ITEMS;
  return (
    <section id="why-us" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              kicker={c.kicker}
              kickerSize={(c as { kickerSize?: string }).kickerSize}
              title={<span dangerouslySetInnerHTML={{ __html: c.title }} />}
              subtitle={c.subtitle}
            />
            <Reveal delay={150}><BookButton className="btn btn-ink btn-shine mt-8">Talk to a Mentor</BookButton></Reveal>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {USPS.map((u, i) => (
              <Reveal key={u.title} delay={i * 90}>
                <article className="card-lift skeu-panel group h-full p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 text-2xl shadow-[var(--shadow-raised)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" aria-hidden>{u.icon}</span>
                  <h3 className="mt-4 font-display text-xl font-bold uppercase leading-snug text-ink">{u.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: u.body }} />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
