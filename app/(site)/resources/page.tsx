import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import ResourceBrowser from "@/components/ResourceBrowser";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("resources");
}

export default function ResourcesPage() {
  return (
    <main>
      <PageHero
        crumb="Resources"
        kicker="Free Study Material"
        title={<>SSB <span className="tricolour-text">Resources</span></>}
        subtitle="Downloadable notes, sample dossiers, PDFs and video lessons — organised by topic. Browse the folders below."
        image="/images/gto-training.jpg"
      />
      <section className="bg-[#faf6ec] px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-[1840px]">
          <ResourceBrowser />
        </div>
      </section>
    </main>
  );
}
