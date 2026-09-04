import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsHero from "@/components/CmsHero";
import EligibilityFinder from "@/components/EligibilityFinder";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("eligibility");
}

export default function EligibilityPage() {
  return (
    <main>
      <CmsHero pageKey="eligibility" />
      <section className="bg-[#faf6ec] px-4 pb-10 pt-8 sm:pb-16 sm:pt-10">
        <EligibilityFinder />
      </section>
    </main>
  );
}
