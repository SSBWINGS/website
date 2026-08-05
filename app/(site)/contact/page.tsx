import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactSection from "@/components/ContactSection";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Contact Us — Book Free SSB Counselling",
  description:
    "Get in touch with SSBWINGS, Noida Sector 62. Book a free counselling call, WhatsApp our team, or visit our campus. Mentors will map your entry, timeline and preparation plan.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        crumb="Contact"
        kicker="Report for Duty"
        title={<>Begin Your <span className="tricolour-text">March</span></>}
        subtitle="A mentor — not a salesperson — will call you back with an honest assessment of your entry, timeline and preparation plan. No spam, ever."
        image="/images/gto-training.jpg"
      />
      <ContactSection />

      <section className="pb-8">
        <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
          <div className="photo-frame overflow-hidden">
            <iframe
              title="SSBWINGS location — Noida Sector 62"
              src="https://www.google.com/maps?q=Sector+62+Noida&output=embed"
              className="h-[380px] w-full rounded-xl"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Faq />
    </main>
  );
}
