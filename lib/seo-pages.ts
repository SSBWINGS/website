/** SEO defaults per page (client-safe plain data). */
export type SeoPage = { key: string; label: string; path: string; absolute?: boolean; title: string; description: string };

export const SEO_PAGES: SeoPage[] = [
  { key: "home", label: "Home", path: "/", absolute: true,
    title: "SSBWINGS — Best SSB Coaching in India | We Give Shape to Your Dreams",
    description: "SSBWINGS, Noida — India's trusted SSB interview coaching academy mentored by ex-SSB officers. 677+ recommendations, 3450+ alumni. Master the 5-day SSB: Screening, Psychology, GTO, Interview & Conference." },
  { key: "about", label: "About", path: "/about",
    title: "About Us — Mentored by Ex-SSB Officers",
    description: "SSBWINGS is an SSB coaching academy in Noida founded and mentored by ex-SSB assessors. 677+ recommendations across the Army, Navy and Air Force." },
  { key: "ssb-process", label: "The 5-Day SSB", path: "/ssb-process",
    title: "The 5-Day SSB Process — Screening to Conference",
    description: "A complete guide to the 5-day SSB interview: Screening (OIR, PPDT), Psychology (TAT, WAT, SRT, SD), GTO tasks, Personal Interview and the Conference." },
  { key: "entries", label: "Entries", path: "/entries",
    title: "Entries — How to Become an Officer in the Indian Armed Forces",
    description: "Every officer-entry route into the Indian Army, Navy, Air Force and Coast Guard — NDA, TES, CDS, AFCAT, 10+2 B.Tech, TGC, SSC, NCC Special, JAG and more." },
  { key: "courses", label: "Courses", path: "/courses",
    title: "SSB Courses — 15-Day Offline, 20-Day Online & Smart Learning App",
    description: "Explore SSBWINGS courses built by ex-SSB assessors: 15-day offline immersion, 20-day online masterclass and the AI-powered Smart Learning App." },
  { key: "gallery", label: "Gallery", path: "/gallery",
    title: "Gallery — Wall of Honour & Recommended Cadets",
    description: "The SSBWINGS Wall of Honour: photographs of recommended cadets, All India Rank holders and commissioned officers across the Army, Navy and Air Force." },
  { key: "testimonials", label: "Testimonials", path: "/testimonials",
    title: "Testimonials — Success Stories from Recommended Cadets",
    description: "Read and watch success stories from SSBWINGS cadets — from repeated conference-outs to AIR-1 recommendations. Written testimonials, YouTube interviews and more." },
  { key: "contact", label: "Contact", path: "/contact",
    title: "Contact Us — Book Free SSB Counselling",
    description: "Get in touch with SSBWINGS, Noida Sector 62. Book a free counselling call, WhatsApp our team, or visit our campus." },
];

export const getSeoPage = (key: string) => SEO_PAGES.find((p) => p.key === key);
