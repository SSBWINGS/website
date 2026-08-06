import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Courses from "@/components/Courses";
import WhyUs from "@/components/WhyUs";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBannerSection";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("courses");
}

export default function CoursesPage() {
  return (
    <main>
      <PageHero
        crumb="Courses"
        kicker="Choose Your Battle Plan"
        title={<>Courses Built by <span className="tricolour-text">Assessors</span></>}
        subtitle="Offline immersion, live online masterclass or train-anywhere app — every programme is designed and delivered by the officers who once assessed candidates at real Boards."
        image="/images/hero-parade.jpg"
      />
      <Courses heading={false} />
      <WhyUs />
      <Faq />
      <CtaBanner />
    </main>
  );
}
