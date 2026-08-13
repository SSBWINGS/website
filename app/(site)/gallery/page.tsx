import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import StudentWall from "@/components/StudentWall";
import AchievementCards from "@/components/AchievementCards";
import OfficerBanners from "@/components/OfficerBanners";
import CtaBanner from "@/components/CtaBannerSection";
import SectionHeading from "@/components/SectionHeading";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("gallery");
}

export default function GalleryPage() {
  return (
    <main>
      <PageHero
        crumb="Gallery"
        kicker="Wall of Honour"
        title={<>Faces of <span className="tricolour-text">Recommendation</span></>}
        subtitle="Every photograph here is a real SSBWINGS aspirant who walked out of the Board recommended. Discipline, dedication and determination — made visible."
        image="/images/women-officers.jpg"
      />

      <StudentWall heading={false} limit={24} showCta />

      <section className="pt-4">
        <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
          <SectionHeading center kicker="Now Serving" title={<>Our Alumni in <span className="tricolour-text">Uniform</span></>} subtitle="From aspirant to commissioned officer — a few of the many who now serve the nation." />
        </div>
      </section>
      <OfficerBanners />

      <AchievementCards />
      <CtaBanner />
    </main>
  );
}
