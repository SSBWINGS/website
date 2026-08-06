import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import EligibilityFinder from "@/components/EligibilityFinder";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("eligibility");
}

export default function EligibilityPage() {
  return (
    <main>
      <PageHero
        kicker="Am I eligible?"
        title={<>SSB Eligibility <span className="tricolour-text">Finder</span></>}
        subtitle="Answer five quick questions and instantly see which officer entries — NDA, CDS, AFCAT, TES and more — you can apply for."
        image="/images/services/army-op.jpg"
        crumb="Eligibility"
      />
      <section className="bg-[#faf6ec] px-4 py-14 sm:py-20">
        <EligibilityFinder />
      </section>
    </main>
  );
}
