import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsHero from "@/components/CmsHero";
import Courses from "@/components/Courses";
import BooksSection from "@/components/BooksSection";
import WhyUs from "@/components/WhyUs";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBannerSection";
import JsonLd from "@/components/JsonLd";
import { COURSES } from "@/lib/data";
import { courseLd } from "@/lib/jsonld";

/** Online courses and the app run remotely; everything else is on campus. */
const modeOf = (where: string): "online" | "onsite" =>
  /online|app|google play|android/i.test(where) ? "online" : "onsite";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("courses");
}

export default function CoursesPage() {
  return (
    <main>
      <JsonLd
        data={COURSES.map((c) =>
          courseLd({
            name: `${c.title} — SSB Interview Coaching`,
            description: c.desc,
            path: "/courses",
            mode: modeOf(c.where),
            keywords: ["SSB coaching", "SSB interview preparation", c.title],
          }),
        )}
      />
      <CmsHero pageKey="courses" />
      <Courses heading={false} />
      <BooksSection />
      <WhyUs />
      <Faq />
      <CtaBanner />
    </main>
  );
}
