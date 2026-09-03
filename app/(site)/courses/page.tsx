import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsHero from "@/components/CmsHero";
import Courses from "@/components/Courses";
import BooksSection from "@/components/BooksSection";
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
      <BooksSection />
      <WhyUs />
      <Faq />
      <CtaBanner />
    </main>
  );
}
