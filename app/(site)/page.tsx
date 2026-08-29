import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
import { getPublished } from "@/lib/content";
import { resolveHomeOrder, type HomeSectionKey } from "@/lib/homepage-order";

import HeroSection from "@/components/HeroSection";
import EntriesTicker from "@/components/EntriesTicker";
import Air1Marquee from "@/components/Air1Marquee";
import StudentWall from "@/components/StudentWall";
import Courses from "@/components/Courses";
import CampusGallery from "@/components/CampusGallery";
import BooksSection from "@/components/BooksSection";
import Mentors from "@/components/Mentors";
import ServicesStrip from "@/components/ServicesStrip";
import WhyUs from "@/components/WhyUs";
import CountdownStrip from "@/components/CountdownStrip";
import StatsStrip from "@/components/StatsStrip";
import SelectionTracker from "@/components/SelectionTracker";
import JourneySection from "@/components/JourneySection";
import OfficerBanners from "@/components/OfficerBanners";
import GoogleReviews from "@/components/GoogleReviews";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBannerSection";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("home");
}

/** Every movable homepage section, keyed exactly as in lib/homepage-order.ts. */
const SECTION_VIEWS: Record<HomeSectionKey, ReactNode> = {
  entries_marquee: <EntriesTicker />,
  air1_marquee: <Air1Marquee />,
  wall: <StudentWall limit={24} showCta />,
  courses: <Courses />,
  campus: <CampusGallery />,
  books: <BooksSection />,
  mentors: <Mentors />,
  four_forces: <ServicesStrip />,
  whyus: <WhyUs />,
  countdown: <CountdownStrip />,
  stats: <StatsStrip />,
  selection_tracker: <SelectionTracker />,
  journey: <JourneySection />,
  officer_banners: <OfficerBanners />,
  google_reviews: <GoogleReviews />,
  testimonials: <Testimonials />,
  instagram: <InstagramFeed />,
  faq: <Faq />,
  cta: <CtaBanner />,
};

export default async function Home() {
  const doc = await getPublished<{ items: unknown }>("homepage_order", { items: [] });
  const order = resolveHomeOrder(doc.items);

  return (
    <main>
      {/* The hero is always first and is not reorderable. */}
      <HeroSection />
      {order
        .filter((s) => s.enabled)
        .map((s) => <div key={s.key}>{SECTION_VIEWS[s.key]}</div>)}
    </main>
  );
}
