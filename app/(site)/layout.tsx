import PreloaderSection from "@/components/PreloaderSection";
import Cursor from "@/components/Cursor";
import ModalProvider from "@/components/ModalProvider";
import { CONTACT_FORM, resolveContactForm } from "@/lib/form-defaults";
import { getSettings, telHref, brochureHref, brochureOn } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import CallButton from "@/components/CallButton";
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
      // Both types: an educational organisation *and* a local business, so the
      // academy qualifies for local results ("SSB coaching near me") as well as
      // being understood as a school.
      "@type": ["EducationalOrganization", "LocalBusiness"],
      "@id": `${SITE_URL}/#organization`,
      name: "SSBWINGS",
      alternateName: "SSB Wings",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.webp`,
      image: `${SITE_URL}/logo.webp`,
      slogan: "We give shape to your Dreams",
      description:
        "SSB interview coaching academy in Noida mentored by ex-SSB assessors, preparing aspirants for NDA, CDS, AFCAT, TES, TGC, SSC, NCC, JAG and every Armed Forces officer entry.",
      telephone: "+91-9560510036",
      email: "marketing@ssbwings.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "C-56/43, Institutional Area, Phase 2, Sector 62",
        addressLocality: "Noida", addressRegion: "Uttar Pradesh", postalCode: "201309", addressCountry: "IN",
      },
      // Coordinates match the Google Maps listing the site links to.
      geo: { "@type": "GeoCoordinates", latitude: 28.6150754, longitude: 77.3672718 },
      hasMap: "https://www.google.com/maps/place/SSBWINGS/@28.6150754,77.3672718,17z",
      areaServed: [
        { "@type": "Country", name: "India" },
        { "@type": "City", name: "Noida" },
        { "@type": "City", name: "Delhi" },
        { "@type": "City", name: "Ghaziabad" },
        { "@type": "City", name: "Gurugram" },
      ],
      knowsAbout: [
        "SSB interview", "Services Selection Board", "Officer Intelligence Rating (OIR)",
        "Picture Perception and Discussion Test (PPDT)", "Thematic Apperception Test (TAT)",
        "Word Association Test (WAT)", "Situation Reaction Test (SRT)", "Group Testing Officer (GTO) tasks",
        "SSB personal interview", "NDA", "CDS", "AFCAT", "10+2 TES", "TGC", "SSC Tech",
        "NCC Special Entry", "JAG", "Indian Navy SSC", "Indian Coast Guard Assistant Commandant",
      ],
      sameAs: ["https://www.youtube.com/@ssbwings", "https://www.instagram.com/ssbwings", "https://t.me/ssbwings"],
      aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "250" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "SSBWINGS",
      description: "SSB interview coaching — mentored by ex-SSB assessors.",
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#organization` },
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
        <CallButton href={telHref(settings.phone1)} number={settings.phone1} />
        <ChatBot brochure={brochureHref(settings)} brochureOn={brochureOn(settings)} />
        <BackToTop />
        <PreviewBar />
      </ModalProvider>
    </>
  );
}
