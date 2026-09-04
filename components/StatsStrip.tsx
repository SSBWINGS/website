import Image from "next/image";
import Counter from "./Counter";
import Reveal from "./Reveal";
import CmsSectionHeading from "./CmsSectionHeading";
import { STATS, type Stat } from "@/lib/data";
import { getPublished } from "@/lib/content";
import { RECENT_WINS } from "@/lib/section-defaults";

export default async function StatsStrip() {
  const [{ items: stats }, winsDoc] = await Promise.all([
    getPublished<{ items: Stat[] }>("stats", { items: STATS }),
    getPublished<{ items: (string | { text: string })[] }>("recent_wins", { items: RECENT_WINS }),
  ]);
  // Accept either plain strings or { text } rows from the CMS repeater.
  const RECENT = (winsDoc.items?.length ? winsDoc.items : RECENT_WINS)
    .map((w) => (typeof w === "string" ? w : w?.text ?? ""))
    .filter(Boolean);
  return (
    <section id="results" className="relative overflow-hidden py-12 sm:py-16">
      {/* Guard-of-honour photo, softly lit */}
      <div className="absolute inset-0" aria-hidden>
        <Image src="/images/ima-guard.jpg" alt="" fill sizes="100vw" className="object-cover object-center opacity-[0.12]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#fff8ec,#f3ecd9)" }} />
      </div>

      <div className="relative mx-auto max-w-[1840px] px-4 sm:px-8">
        <CmsSectionHeading
          sectionKey="stats"
          fallback={{ kicker: "Proof, Not Promises", title: 'The Scoreboard <span class="tricolour-text">Speaks</span>' }}
        />

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, i) => (
            <Reveal key={s.label + i} delay={i * 80}>
              <div className="skeu-plate card-lift px-4 py-6 text-center">
                <p className="font-display text-4xl font-black leading-none gold-text sm:text-5xl"><Counter target={s.value} suffix={s.suffix ?? "+"} /></p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Ticker */}
      <div className="marquee relative mt-16 overflow-hidden border-y-2 border-[rgba(43,36,22,0.14)] bg-[linear-gradient(180deg,#fffdf7cc,#f3ecd9cc)] py-4">
        <div className="marquee-track slow">
          {[...RECENT, ...RECENT].map((r, i) => (
            <span key={i} className="flex shrink-0 items-center gap-3 px-6 text-sm font-medium text-ink">
              <span className="text-tri-green-600" aria-hidden>🎉</span> {r}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
