import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import ModalProvider from "@/components/ModalProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import BackToTop from "@/components/BackToTop";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const SITE_URL = "https://www.ssbwings.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SSBWINGS — Best SSB Coaching in India | We Give Shape to Your Dreams",
    template: "%s | SSBWINGS",
  },
  description:
    "SSBWINGS, Noida — India's trusted SSB interview coaching academy mentored by ex-SSB officers. 677+ recommendations, 3450+ alumni. 15-day offline & 20-day online courses for NDA, CDS, AFCAT, TES & all entries. Master the 5-day SSB: Screening, Psychology, GTO, Interview & Conference.",
  keywords: [
    "SSB coaching", "best SSB coaching in India", "SSB interview preparation",
    "SSB coaching in Noida", "NDA SSB coaching", "CDS SSB coaching", "AFCAT SSB coaching",
    "5 day SSB process", "GTO training", "SSB psychology tests", "ex SSB officer mentors", "SSBWINGS",
  ],
  authors: [{ name: "SSBWINGS" }],
  creator: "SSBWINGS",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "SSBWINGS",
    title: "SSBWINGS — Best SSB Coaching in India",
    description: "Mentored by ex-SSB officers. 677+ recommendations. Master all 5 days of the SSB.",
    images: [{ url: "/logo.webp", width: 512, height: 512, alt: "SSBWINGS logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSBWINGS — Best SSB Coaching in India",
    description: "Mentored by ex-SSB officers. 677+ recommendations. Your journey to the Armed Forces begins here.",
    images: ["/logo.webp"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: "/logo.webp", apple: "/logo.webp" },
};

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Preloader />
        <Cursor />
        <ModalProvider>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
          <ChatBot />
          <BackToTop />
        </ModalProvider>
      </body>
    </html>
  );
}
