import Image from "next/image";
import Counter from "./Counter";
import Reveal from "./Reveal";
import { STATS } from "@/lib/data";
import { getPublished } from "@/lib/content";

type Stat = { value: number; label: string };

const RECENT = [
  "GC Ashok Suthar — AIR-1 · SSC Tech · OTA Gaya",
  "NC Khushvant Sharma — 10+2 Navy B.Tech · INA",
  "GC Maan Singh — Sipahi to Gentleman Cadet · IMA",
  "GC Chandan Sahani — CDS · IMA Dehradun",
  "Recommended — 19 SSB Allahabad · NDA",
  "Recommended — 22 SSB Bhopal · CDS OTA",
  "Recommended — 4 AFSB Varanasi · AFCAT",
  "Recommended — 33 SSB Bhopal · TES",
  "Recommended — NSB Coimbatore · Navy SSC",
];

export default async function StatsStrip() {
  const { items: stats } = await getPublished<{ items: Stat[] }>("stats", { items: STATS });
  return (
    <section id="results" className="relative overflow-hidden py-20 sm:py-24">
      {/* Guard-of-honour photo, softly lit */}
      <div className="absolute inset-0" aria-hidden>
        <Image src="/images/ima-guard.jpg" alt="" fill sizes="100vw" className="object-cover object-center opacity-[0.12]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#fff8ec,#f3ecd9)" }} />
      </div>

      <div className="relative mx-auto max-w-[1840px] px-4 sm:px-8">
        <Reveal className="text-center">
          <p className="kicker justify-center">Proof, Not Promises</p>
          <h2 className="section-title mt-4 text-4xl sm:text-5xl">The Scoreboard <span className="tricolour-text">Speaks</span></h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="skeu-plate card-lift px-4 py-6 text-center">
                <p className="font-display text-4xl font-black leading-none gold-text sm:text-5xl"><Counter target={s.value} /></p>
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
