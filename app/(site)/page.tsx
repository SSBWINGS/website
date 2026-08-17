import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import HeroSection from "@/components/HeroSection";
import EntriesTicker from "@/components/EntriesTicker";
import Air1Marquee from "@/components/Air1Marquee";
import StudentWall from "@/components/StudentWall";
import ServicesStrip from "@/components/ServicesStrip";
import Story from "@/components/Story";
import Journey from "@/components/Journey";
import Courses from "@/components/Courses";
import WhyUs from "@/components/WhyUs";
import Mentors from "@/components/Mentors";
import StatsStrip from "@/components/StatsStrip";
import CountdownStrip from "@/components/CountdownStrip";
import SelectionTracker from "@/components/SelectionTracker";
import OfficerBanners from "@/components/OfficerBanners";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBannerSection";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("home");
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <EntriesTicker />
      <Air1Marquee />
      <StudentWall limit={24} showCta />
      <ServicesStrip />
      <Story />
      <Journey />
      <Courses />
      <WhyUs />
      <Mentors />
      <StatsStrip />
      <SelectionTracker />
      <CountdownStrip />
      <OfficerBanners />
      <Testimonials />
      <InstagramFeed />
      <Faq />
      <CtaBanner />
    </main>
  );
}
