import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CmsHero from "@/components/CmsHero";
import { getSettings, mapHref, mapEmbedSrc } from "@/lib/content";
import ContactSection from "@/components/ContactSection";
import Faq from "@/components/Faq";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("contact");
}

export default async function ContactPage() {
  const SITE = await getSettings();
  return (
    <main>
      <CmsHero pageKey="contact" />
      <ContactSection />

      <section className="pb-8">
        <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
          <a href={mapHref(SITE)} target="_blank" rel="noopener noreferrer"
            className="photo-frame block overflow-hidden" aria-label="Open SSBWINGS on Google Maps">
            <iframe
              title={`${SITE.name} location — ${SITE.address}`}
              src={mapEmbedSrc(SITE)}
              className="pointer-events-none h-[380px] w-full rounded-xl"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
          <p className="mt-3 text-center text-sm text-ink-soft">
            <a href={mapHref(SITE)} target="_blank" rel="noopener noreferrer" className="font-semibold text-saffron-700 hover:underline">
              Open in Google Maps →
            </a>
          </p>
        </div>
      </section>

      <Faq />
    </main>
  );
}
