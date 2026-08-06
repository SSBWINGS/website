import { getPublished } from "@/lib/content";
import { STATS } from "@/lib/data";
import Hero, { HERO_DEFAULT, type HeroContent } from "./Hero";

type Stat = { value: number; label: string };

export default async function HeroSection() {
  const [content, statsDoc] = await Promise.all([
    getPublished<HeroContent>("hero", HERO_DEFAULT),
    getPublished<{ items: Stat[] }>("stats", { items: STATS }),
  ]);
  return <Hero content={content} stats={statsDoc.items.slice(0, 4)} />;
}
