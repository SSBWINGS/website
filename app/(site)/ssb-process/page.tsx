import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Journey from "@/components/Journey";
import ServicesStrip from "@/components/ServicesStrip";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBannerSection";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("ssb-process");
}

export default function SsbProcessPage() {
  return (
    <main>
      <PageHero
        crumb="The 5-Day SSB"
        kicker="Know Your Battlefield"
        title={<>The <span className="tricolour-text">5-Day SSB</span> Decoded</>}
        subtitle="Five days. Three assessors. Fifteen Officer Like Qualities. Here is exactly what awaits you at the Services Selection Board — day by day, test by test."
        image="/images/gto-training.jpg"
      />
      <Journey heading={false} />
      <ServicesStrip />
      <Faq />
      <CtaBanner />
    </main>
  );
}
