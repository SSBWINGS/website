import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsHero from "@/components/CmsHero";
import Testimonials from "@/components/Testimonials";
import YouTubeGrid from "@/components/YouTubeGrid";
import InstagramFeed from "@/components/InstagramFeed";
import StudentWall from "@/components/StudentWall";
import CtaBanner from "@/components/CtaBannerSection";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("testimonials");
}

export default function TestimonialsPage() {
  return (
    <main>
      <CmsHero pageKey="testimonials" />
      <Testimonials heading={false} />
      <YouTubeGrid />
      <StudentWall heading limit={18} showCta />
      <InstagramFeed />
      <CtaBanner />
    </main>
  );
}
