import PreloaderSection from "@/components/PreloaderSection";
import Cursor from "@/components/Cursor";
import ModalProvider from "@/components/ModalProvider";
import { CONTACT_FORM, resolveContactForm } from "@/lib/form-defaults";
import { getSettings } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/media";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import BackToTop from "@/components/BackToTop";
import PageViewTracker from "@/components/PageViewTracker";
import PreviewBar from "@/components/PreviewBar";
import { getPublished } from "@/lib/content";
import { ENQUIRY_POPUP, type EnquiryPopupDoc } from "@/lib/homepage-defaults";

const SITE_URL = "https://www.ssbwings.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: "SSBWINGS",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.webp`,
      slogan: "We give shape to your Dreams",
      description: "SSB interview coaching academy in Noida mentored by ex-SSB officers, preparing aspirants for NDA, CDS, AFCAT, TES and all Armed Forces entries.",
      telephone: "+91-9560510036",
      email: "marketing@ssbwings.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "C-56/43, Institutional Area, Phase 2, Sector 62",
        addressLocality: "Noida", addressRegion: "Uttar Pradesh", postalCode: "201309", addressCountry: "IN",
      },
      sameAs: ["https://www.youtube.com/@ssbwings", "https://www.instagram.com/ssbwings", "https://t.me/ssbwings"],
      aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "250" },
    },
  ],
};

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [popup, formDoc, settings] = await Promise.all([
    getPublished<EnquiryPopupDoc>("enquiry_popup", ENQUIRY_POPUP),
    getPublished<unknown>("contact_form", CONTACT_FORM),
    getSettings(),
  ]);
  const form = resolveContactForm(formDoc);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageViewTracker />
      <PreloaderSection />
      <Cursor />
      <ModalProvider popup={popup} form={form}>
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
        <ChatBot brochure={mediaUrl(settings.brochure)} />
        <BackToTop />
        <PreviewBar />
      </ModalProvider>
    </>
  );
}
