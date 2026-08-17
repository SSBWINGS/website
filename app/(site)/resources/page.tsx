import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsHero from "@/components/CmsHero";
import ResourceBrowser from "@/components/ResourceBrowser";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("resources");
}

export default function ResourcesPage() {
  return (
    <main>
      <CmsHero pageKey="resources" />
      <section className="bg-[#faf6ec] px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-[1840px]">
          <ResourceBrowser />
        </div>
      </section>
    </main>
  );
}
