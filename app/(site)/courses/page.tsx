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
import { getPublished } from "@/lib/content";

/** Online courses and the app run remotely; everything else is on campus.
 *  Title and "where" together: the online batch's "where" is just its hours. */
const modeOf = (c: { title: string; where: string }): "online" | "onsite" =>
  /online|app|google play|android/i.test(`${c.title} ${c.where}`) ? "online" : "onsite";

type CardText = { title?: string; desc?: string; where?: string };

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("courses");
}

export default async function CoursesPage() {
  // The cards as published in the admin, merged over the code cards exactly
  // as the Courses section shows them — so search engines read what the
  // visitor reads (titles, durations, descriptions).
  const doc = await getPublished<{ items: CardText[] }>("courses_cards", { items: [] });
  const cards = COURSES.map((c, i) => ({ ...c, ...(doc.items?.[i] ?? {}) }));
  return (
    <main>
      <JsonLd
        data={cards.map((c) =>
          courseLd({
            name: `${c.title} — SSB Interview Course`,
            description: c.desc,
            path: "/courses",
            mode: modeOf(c),
            keywords: ["SSB coaching", "SSB interview preparation", "SSBWINGS SSB course", c.title],
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
