import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Journey from "@/components/Journey";
import ServicesStrip from "@/components/ServicesStrip";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "The 5-Day SSB Process — Screening to Conference",
  description:
    "A complete guide to the 5-day SSB interview: Day 1 Screening (OIR, PPDT), Day 2 Psychology (TAT, WAT, SRT, SD), Days 3–4 GTO tasks & Personal Interview, Day 5 Conference. Learn what to expect and how SSBWINGS prepares you.",
};

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
