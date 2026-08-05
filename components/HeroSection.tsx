import { getPublished } from "@/lib/content";
import Hero, { HERO_DEFAULT, type HeroContent } from "./Hero";

export default async function HeroSection() {
  const content = await getPublished<HeroContent>("hero", HERO_DEFAULT);
  return <Hero content={content} />;
}
