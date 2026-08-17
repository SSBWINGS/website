import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsHero from "@/components/CmsHero";
import JourneySection from "@/components/JourneySection";
import ServicesStrip from "@/components/ServicesStrip";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBannerSection";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("ssb-process");
}

export default function SsbProcessPage() {
  return (
    <main>
      <CmsHero pageKey="ssb-process" />
      <JourneySection heading={false} />
      <ServicesStrip />
      <Faq />
      <CtaBanner />
    </main>
  );
}
