import { getPublished } from "@/lib/content";
import { ENTRY_COUNTS, type EntryCount } from "@/lib/homepage-defaults";
import { asArray } from "@/lib/shape";

/** Scrolling band of entries with how many candidates were recommended in each. */
export default async function EntriesTicker() {
  const doc = await getPublished<{ items: EntryCount[] }>("entry_counts", { items: ENTRY_COUNTS });
  const items = asArray<EntryCount>(doc.items).filter((e) => e?.entry);
  const list = items.length ? items : ENTRY_COUNTS;
  const row = [...list, ...list];

  return (
    <section aria-label="Entries we prepare you for" className="marquee relative overflow-hidden border-y-2 border-[rgba(43,36,22,0.15)]">
      <div className="tricolour-bar absolute inset-0 opacity-[0.14]" aria-hidden />
      <div className="relative bg-[linear-gradient(180deg,#fffdf7cc,#f3ecd9cc)] py-3.5">
        <div className="marquee-track slow">
          {row.map((e, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2.5 px-6 font-display text-lg font-bold uppercase tracking-widest text-ink">
              <span className="rounded-md bg-navy-950 px-2 py-0.5 text-sm font-black text-gold-300 tabular-nums">{e.count}</span>
              {e.entry}
              <span aria-hidden className="text-saffron-500">★</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
