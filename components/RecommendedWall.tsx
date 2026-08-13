"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { mediaUrl } from "@/lib/supabase/media";

export type Candidate = { name: string; exam: string; image_path: string; sort_order: number };

/** Full recommended-candidates wall with infinite scroll — loads a page at a
 *  time as the user nears the bottom, so we never pull all rows up front.
 *  `startAt` is the sort_order to begin from (past the homepage set). */
export default function RecommendedWall({
  initial,
  startAt,
  pageSize,
}: {
  initial: Candidate[];
  startAt: number;
  pageSize: number;
}) {
  const supabase = createClient();
  const [items, setItems] = useState<Candidate[]>(initial);
  const [offset, setOffset] = useState(initial.length); // rows already loaded from the (>= startAt) set
  const [done, setDone] = useState(initial.length < pageSize);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || done) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("published_candidates")
      .select("name, exam, image_path, sort_order")
      .gte("sort_order", startAt)
      .order("sort_order", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (!error && data) {
      setItems((prev) => [...prev, ...(data as Candidate[])]);
      setOffset((o) => o + data.length);
      if (data.length < pageSize) setDone(true);
    } else if (error) {
      setDone(true); // stop trying on error
    }
    setLoading(false);
  }, [loading, done, supabase, startAt, offset, pageSize]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((s, i) => (
          <figure key={s.image_path + i} className="card-lift group skeu-panel overflow-hidden p-3 text-center">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={mediaUrl(s.image_path)}
                alt={`${s.name} — recommended for ${s.exam}`}
                fill
                loading="lazy"
                sizes="(min-width:1024px) 15vw, 45vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 h-1 tricolour-bar opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
            </div>
            <figcaption className="pt-3">
              <p className="font-display text-base font-bold uppercase leading-tight text-ink">{s.name}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-saffron-700">{s.exam}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Sentinel + status */}
      <div ref={sentinel} className="mt-10 flex justify-center">
        {loading && (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-saffron-500 border-t-transparent" aria-hidden />
            Loading more…
          </span>
        )}
        {done && !loading && (
          <span className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            🎖 That&apos;s every recommended cadet
          </span>
        )}
      </div>
    </div>
  );
}
