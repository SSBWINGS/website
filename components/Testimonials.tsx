import { TESTIMONIALS } from "@/lib/data";
import { getCollection } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/media";
import TestimonialsCarousel, { type TItem } from "./TestimonialsCarousel";

type Row = { name: string; rank: string; body: string; image_path: string; sort_order: number };

export default async function Testimonials({ heading = true }: { heading?: boolean }) {
  const fallback: Row[] = TESTIMONIALS.map((t, i) => ({
    name: t.name,
    rank: t.rank,
    body: t.text,
    image_path: t.photo,
    sort_order: i,
  }));
  const rows = await getCollection<Row>("published_testimonials", fallback, { columns: "name, rank, body, image_path, sort_order" });
  const items: TItem[] = rows.map((r) => ({
    name: r.name,
    rank: r.rank,
    body: r.body,
    image: mediaUrl(r.image_path),
  }));
  return <TestimonialsCarousel items={items} heading={heading} />;
}
