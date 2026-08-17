import Image from "next/image";
import { AIR_CARDS } from "@/lib/data";

/** Continuous photo marquee of the All India Rank (AIR-1) holder cards —
 *  the same achievers shown on the Wall of Honour, scrolling across the homepage. */
export default function Air1Marquee() {
  const row = [...AIR_CARDS, ...AIR_CARDS];
  return (
    <section aria-label="All India Rank 1 holders" className="marquee relative overflow-hidden bg-[#0a1524] py-5">
      <div className="tricolour-bar absolute inset-x-0 top-0 z-10 h-1" aria-hidden />
      <div className="marquee-track gap-4 px-2">
        {row.map((src, i) => (
          <figure key={i} className="relative h-48 w-[137px] shrink-0 overflow-hidden rounded-lg border border-white/10 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.7)]">
            <Image src={src} alt="SSBWINGS All India Rank holder achievement card" fill sizes="137px" className="object-cover" />
          </figure>
        ))}
      </div>
      <div className="tricolour-bar absolute inset-x-0 bottom-0 z-10 h-1" aria-hidden />
    </section>
  );
}
