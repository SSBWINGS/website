import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
