import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsHero from "@/components/CmsHero";
import ContactSection from "@/components/ContactSection";
import Faq from "@/components/Faq";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("contact");
}

export default function ContactPage() {
  return (
    <main>
      <CmsHero pageKey="contact" />
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
