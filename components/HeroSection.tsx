import { getPublished, getCollection } from "@/lib/content";
import { STATS } from "@/lib/data";
import { mediaUrl } from "@/lib/supabase/media";
import Hero, { HERO_DEFAULT, RECO_PHOTOS, HERO_MAIN_PHOTOS, type HeroContent } from "./Hero";

type Stat = { value: number; label: string };
type Cand = { image_path: string; sort_order: number; recommended_on?: string | null };

export default async function HeroSection() {
  const [content, statsDoc, carouselDoc, mainDoc] = await Promise.all([
    getPublished<HeroContent>("hero", HERO_DEFAULT),
    getPublished<{ items: Stat[] }>("stats", { items: STATS }),
    getPublished<{ images: string[] }>("hero_carousel", { images: [] }),
    getPublished<{ images: string[] }>("hero_main_carousel", { images: [] }),
  ]);

  const mainImages = (mainDoc.images ?? []).filter(Boolean).map(mediaUrl);

  // Carousel priority: admin-set images → latest recommended candidates → bundled defaults.
  let images: string[] = (carouselDoc.images ?? []).filter(Boolean).map(mediaUrl);
  if (images.length === 0) {
    const cands = await getCollection<Cand>("published_candidates", [], {
      order: [
        { column: "recommended_on", ascending: false, nullsFirst: false },
        { column: "sort_order", ascending: true },
      ],
      limit: 10,
    });
    images = cands.map((c) => mediaUrl(c.image_path)).filter(Boolean);
  }
  if (images.length === 0) images = RECO_PHOTOS;

  return (
    <Hero
      content={content}
      stats={statsDoc.items.slice(0, 4)}
      carousel={images}
      mainCarousel={mainImages.length ? mainImages : HERO_MAIN_PHOTOS}
    />
  );
}
