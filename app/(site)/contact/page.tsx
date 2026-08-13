import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import ContactSection from "@/components/ContactSection";
import Faq from "@/components/Faq";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("contact");
}

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
              title="SSBWINGS location — C-56/43, Sector 62, Noida"
              src="https://maps.google.com/maps?q=SSBWINGS%2C%20C-56%2F43%2C%20Sector%2062%2C%20Noida&ll=28.6150754%2C77.3672718&z=16&output=embed"
              className="h-[380px] w-full rounded-xl"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Faq />
    </main>
  );
}
