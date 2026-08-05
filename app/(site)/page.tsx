import Hero from "@/components/Hero";
import EntriesTicker from "@/components/EntriesTicker";
import StudentWall from "@/components/StudentWall";
import ServicesStrip from "@/components/ServicesStrip";
import Story from "@/components/Story";
import Journey from "@/components/Journey";
import Courses from "@/components/Courses";
import WhyUs from "@/components/WhyUs";
import Mentors from "@/components/Mentors";
import StatsStrip from "@/components/StatsStrip";
import OfficerBanners from "@/components/OfficerBanners";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  return (
    <main>
      <Hero />
      <EntriesTicker />
      <StudentWall limit={24} showCta />
      <ServicesStrip />
      <Story />
      <Journey />
      <Courses />
      <WhyUs />
      <Mentors />
      <StatsStrip />
      <OfficerBanners />
      <Testimonials />
      <InstagramFeed />
      <Faq />
      <CtaBanner />
    </main>
  );
}
