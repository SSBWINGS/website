import Image from "next/image";
import { getPublished } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/media";
import { AIR1_IMAGES } from "@/lib/homepage-defaults";
import { asArray } from "@/lib/shape";

/** Continuous photo marquee of the All India Rank (AIR-1) holder cards. */
export default async function Air1Marquee() {
  const doc = await getPublished<{ images: string[] }>("air1_images", { images: AIR1_IMAGES });
  const imgs = asArray<string>(doc.images).filter(Boolean);
  const list = (imgs.length ? imgs : AIR1_IMAGES).map(mediaUrl);
  const row = [...list, ...list];

  return (
    <section aria-label="All India Rank 1 holders" className="marquee relative overflow-hidden bg-[#0a1524] py-5">
      <div className="tricolour-bar absolute inset-x-0 top-0 z-10 h-1" aria-hidden />
      <div className="marquee-track slow gap-4 px-2">
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
