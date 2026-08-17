import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsHero from "@/components/CmsHero";
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
      <CmsHero pageKey="courses" />
      <Courses heading={false} />
      <WhyUs />
      <Faq />
      <CtaBanner />
    </main>
  );
}
