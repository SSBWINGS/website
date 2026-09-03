import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import CmsHero from "@/components/CmsHero";
import AchievementCards from "@/components/AchievementCards";
import OfficerBanners from "@/components/OfficerBanners";
import CtaBanner from "@/components/CtaBannerSection";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("gallery");
}

export default function GalleryPage() {
  return (
    <main>
      <CmsHero pageKey="gallery" />

      <section className="py-12 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <p className="text-lg text-ink-soft">
            Hundreds of SSBWINGS aspirants have walked out of the Board recommended — see every face and chest number in the Recommendation Gallery.
          </p>
          <Link href="/recommended" className="btn btn-gold btn-shine mt-6 inline-flex">
            View the Recommendation Gallery →
          </Link>
        </div>
      </section>

      <OfficerBanners />

      <AchievementCards />
      <CtaBanner />
    </main>
  );
}
