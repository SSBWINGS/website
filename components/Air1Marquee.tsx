import { getPublished } from "@/lib/content";
import { AIR1 } from "@/lib/data";

/** Medium-speed marquee celebrating All India Rank 1 achievers.
 *  CMS-overridable via the site_content "air1" doc: { items: string[] }. */
export default async function Air1Marquee() {
  const doc = await getPublished<{ items: string[] }>("air1", { items: AIR1 });
  const items = doc.items?.length ? doc.items : AIR1;
  const row = [...items, ...items];

  return (
    <section aria-label="All India Rank 1 achievers" className="marquee relative overflow-hidden bg-[#0a1524]">
      <div className="tricolour-bar absolute inset-x-0 top-0 h-1" aria-hidden />
      <div className="relative py-3">
        {/* medium speed = default 34s track */}
        <div className="marquee-track">
          {row.map((item, i) => (
            <span key={i} className="flex shrink-0 items-center gap-3 px-6 font-display text-base font-bold uppercase tracking-[0.15em] text-gold-300">
              <span aria-hidden>🥇</span>
              {item}
              <span aria-hidden className="text-saffron-500">★</span>
            </span>
          ))}
        </div>
      </div>
      <div className="tricolour-bar absolute inset-x-0 bottom-0 h-1" aria-hidden />
    </section>
  );
}
