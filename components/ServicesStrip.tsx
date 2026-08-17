import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { getPublished } from "@/lib/content";
import { SERVICES as SERVICES_HEAD } from "@/lib/section-defaults";

const SERVICES = [
  {
    name: "Indian Army",
    motto: "Service Before Self",
    desc: "IMA, OTA & ACC entries through NDA, CDS, TES, TGC & NCC. The olive greens begin on the GTO ground.",
    image: "/images/services/army-op.jpg",
    alt: "Indian Army soldiers conducting check-point operations during a peacekeeping exercise",
    scrim: "rgba(40,48,20,0.82)",
    accent: "#9ab04a",
    icon: "⭐",
    entries: ["NDA", "CDS IMA/OTA", "TES", "TGC", "ACC"],
    blog: "/blog/join-indian-army",
  },
  {
    name: "Indian Navy",
    motto: "Śaṁ No Varuṇaḥ",
    desc: "INA Ezhimala & beyond — 10+2 B.Tech, Navy SSC (GS/X, Pilot, Logistics, ATC). Command the deep blue.",
    image: "/images/services/navy-op.jpg",
    alt: "Indian Navy frigate INS Shivalik underway at sea",
    scrim: "rgba(15,38,80,0.82)",
    accent: "#5aa0e0",
    icon: "⚓",
    entries: ["10+2 B.Tech", "GS(X)", "Pilot SSC", "Logistics", "ATC"],
    blog: "/blog/join-indian-navy",
  },
  {
    name: "Indian Air Force",
    motto: "Touch the Sky with Glory",
    desc: "AFA Hyderabad through AFCAT, NDA & NCC. Flying & Ground Duty (Tech & Non-Tech) — reach for the skies.",
    image: "/images/services/airforce-op.jpg",
    alt: "Indian Air Force Su-30 MKI fighters during Exercise Iron Fist",
    scrim: "rgba(20,55,90,0.80)",
    accent: "#7cc0ef",
    icon: "✈",
    entries: ["AFCAT", "NDA (Air)", "Flying", "Ground Duty", "NCC"],
    blog: "/blog/join-indian-air-force",
  },
  {
    name: "Indian Coast Guard",
    motto: "Vayam Rakshamah",
    desc: "Assistant Commandant entry — protecting India's coasts & seas. Guard the shoreline, day and night.",
    image: "/images/services/coastguard-op.jpg",
    alt: "Indian Coast Guard ships sailing in formation during an exercise",
    scrim: "rgba(20,45,72,0.80)",
    accent: "#63b3e8",
    icon: "🛡️",
    entries: ["Asst. Commandant", "GD Branch", "Tech", "Pilot / Navigator", "Law"],
    blog: "/blog/join-indian-coast-guard",
  },
];

export default async function ServicesStrip() {
  const c = await getPublished("services", SERVICES_HEAD);
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        <SectionHeading
          center
          kicker={c.kicker}
          title={<span dangerouslySetInnerHTML={{ __html: c.title }} />}
          subtitle={c.subtitle}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.name} delay={i * 110}>
              <article className="card-lift group relative h-full overflow-hidden rounded-2xl p-7 text-white shadow-[var(--shadow-plate)]">
                {/* Operation photo background */}
                <Image src={s.image} alt={s.alt} fill sizes="(min-width:1280px) 22vw, (min-width:640px) 45vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${s.scrim.replace("0.8", "0.55")} 0%, ${s.scrim} 68%)` }} aria-hidden />
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-50" style={{ background: s.accent }} aria-hidden />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-4xl drop-shadow-lg" aria-hidden>{s.icon}</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur">{s.motto}</span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-extrabold uppercase tracking-wide drop-shadow">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/90">{s.desc}</p>
                  <ul className="mt-4 flex flex-1 flex-wrap content-start gap-2">
                    {s.entries.map((e) => (
                      <li key={e} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-medium backdrop-blur">{e}</li>
                    ))}
                  </ul>
                  <Link href={s.blog} className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/95 px-4 py-2 text-sm font-bold uppercase tracking-wide text-[#0a1524] transition hover:bg-white">
                    How to Join →
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
