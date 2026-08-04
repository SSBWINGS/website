import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Courses from "@/components/Courses";
import WhyUs from "@/components/WhyUs";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "SSB Courses — 15-Day Offline, 20-Day Online & Smart Learning App",
  description:
    "Explore SSBWINGS courses: 15-day offline residential immersion at Noida, 20-day live online masterclass, and the AI-powered SSB Smart Learning App. Built by ex-SSB assessors for NDA, CDS, AFCAT & all entries.",
};

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
