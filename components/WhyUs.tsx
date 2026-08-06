import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import BookButton from "./BookButton";
import { getPublished } from "@/lib/content";
import { WHYUS } from "@/lib/section-defaults";

const USPS = [
  { title: "Mentored by Ex-SSB Assessors", body: "Learn from officers who sat on the other side of the table — retired Interviewing Officers, GTOs and psychology experts who assessed thousands at real Boards.", icon: "🎖️" },
  { title: "Real GTO Ground on Campus", body: "Full-scale PGT structures, command task areas and obstacle courses. You rehearse Day 3 & 4 physically — not on a whiteboard.", icon: "🪖" },
  { title: "Guidance Till Recommendation", body: "One enrolment, our commitment till you hear your chest number called. Repeaters get focused conference-out analysis and a rebuilt strategy.", icon: "🧭" },
  { title: "Personal Attention, Small Batches", body: "Every dossier read, every mock interview debriefed one-on-one. You are a name and a personality here — never a roll number.", icon: "🔍" },
  { title: "3,450+ Strong Alumni Network", body: "Serving officers across the Army, Navy and Air Force mentor the next generation. Free monthly practice sessions for alumni, always.", icon: "🤝" },
  { title: "Merit-First, No False Promises", body: "No academy can 'guarantee' a recommendation. We build the officer; the Board does the rest — honestly, transparently.", icon: "⚖️" },
];

export default async function WhyUs() {
  const c = await getPublished("whyus", WHYUS);
  return (
    <section id="why-us" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              kicker={c.kicker}
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
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{u.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
