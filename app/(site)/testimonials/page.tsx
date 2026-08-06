import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
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
      <PageHero
        crumb="Testimonials"
        kicker="Stories in Uniform"
        title={<>They Were Told <span className="tricolour-text">No.</span> They Answered Again.</>}
        subtitle="Setbacks, medical rejections, five failed attempts — and then a chest number called. These are the journeys our cadets share in their own words."
        image="/images/ima-guard.jpg"
      />
      <Testimonials heading={false} />
      <YouTubeGrid />
      <StudentWall heading limit={18} showCta />
      <InstagramFeed />
      <CtaBanner />
    </main>
  );
}
