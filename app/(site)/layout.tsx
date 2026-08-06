import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import ModalProvider from "@/components/ModalProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import BackToTop from "@/components/BackToTop";
import PageViewTracker from "@/components/PageViewTracker";
import PreviewBar from "@/components/PreviewBar";

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
      telephone: "+91-9560510035",
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

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageViewTracker />
      <Preloader />
      <Cursor />
      <ModalProvider>
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
        <ChatBot />
        <BackToTop />
        <PreviewBar />
      </ModalProvider>
    </>
  );
}
