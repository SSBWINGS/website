import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { getTrackRecord } from "@/lib/content";
import { countText } from "@/lib/track-record";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const SITE_URL = "https://www.ssbwings.com";

/** Site-wide defaults. Built per request (cached) so the figures in the
 *  descriptions are the admin's stat cards, never a number typed here. */
export async function generateMetadata(): Promise<Metadata> {
  const r = await getTrackRecord();
  const recs = countText(r.recommendations);
  const alumni = countText(r.alumni);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "SSBWINGS — Best SSB Coaching in India | We Give Shape to Your Dreams",
      template: "%s | SSBWINGS",
    },
    description:
      `SSBWINGS, Noida Sector 62 — India's trusted SSB interview coaching academy in Delhi NCR, mentored by ex-SSB officers. ${recs} recommendations, ${alumni} alumni. 2-week offline & 30-day online SSB courses for NDA, CDS, AFCAT, TES & all entries. Master the 5-day SSB: Screening, Psychology, GTO, Interview & Conference.`,
    keywords: [
      "SSB coaching", "best SSB coaching in India", "SSB interview preparation",
      "SSB coaching in Noida", "SSB coaching Noida Sector 62", "SSB academy Noida", "SSB interview coaching Delhi NCR",
      "SSB coaching near Delhi", "SSB coaching in Uttar Pradesh", "SSB interview coaching online India",
      "NDA SSB coaching", "CDS SSB coaching", "AFCAT AFSB coaching", "5 day SSB process", "SSB GTO coaching",
      "SSB psychology test preparation", "SSB coaching by retired officers", "ex SSB officer mentors",
      "SSBWINGS", "SSBWINGS Academy", "SSB Wings Noida",
    ],
    authors: [{ name: "SSBWINGS" }],
    creator: "SSBWINGS",
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: SITE_URL,
      siteName: "SSBWINGS",
      title: "SSBWINGS — Best SSB Coaching in India",
      description: `Mentored by ex-SSB officers. ${recs} recommendations. Master all 5 days of the SSB.`,
      images: [{ url: "/logo.webp", width: 512, height: 512, alt: "SSBWINGS logo" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "SSBWINGS — Best SSB Coaching in India",
      description: `Mentored by ex-SSB officers. ${recs} recommendations. Your journey to the Armed Forces begins here.`,
      images: ["/logo.webp"],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    // Search Console ownership, via a Vercel env var — no code change to verify.
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
