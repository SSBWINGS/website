import { getPublished } from "@/lib/content";
import { STATS } from "@/lib/data";
import { mediaUrl } from "@/lib/supabase/media";
import Hero, { HERO_DEFAULT, type HeroContent } from "./Hero";
import { HERO_SLIDES, type HeroSlide } from "@/lib/hero-slides";

type Stat = { value: number; label: string };

export default async function HeroSection() {
  const [content, statsDoc, slidesDoc] = await Promise.all([
    getPublished<HeroContent>("hero", HERO_DEFAULT),
    getPublished<{ items: Stat[] }>("stats", { items: STATS }),
    getPublished<{ items: HeroSlide[] }>("hero_slides", { items: HERO_SLIDES }),
  ]);

  const slides = (slidesDoc.items ?? [])
    .filter((s) => s?.image)
    .map((s) => ({ ...s, image: mediaUrl(s.image) }));

  return (
    <Hero
      content={content}
      stats={statsDoc.items.slice(0, 4)}
      slides={slides.length ? slides : HERO_SLIDES}
    />
  );
}
