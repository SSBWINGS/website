/** SEO defaults per page (client-safe plain data). */
export type SeoPage = {
  key: string;
  label: string;
  path: string;
  absolute?: boolean;
  title: string;
  description: string;
  /** Target search terms for the page, most important first. */
  keywords?: string[];
};

export const SEO_PAGES: SeoPage[] = [
  { key: "home", label: "Home", path: "/", absolute: true,
    title: "SSBWINGS — Best SSB Coaching in India | We Give Shape to Your Dreams",
    description: "SSBWINGS, Noida — India's trusted SSB interview coaching academy mentored by ex-SSB officers. 677+ recommendations, 3450+ alumni. Master the 5-day SSB: Screening, Psychology, GTO, Interview & Conference.",
    keywords: ["SSB coaching", "best SSB coaching in India", "SSB coaching in Noida", "SSB coaching in Delhi NCR", "SSB interview preparation", "SSB coaching near me", "online SSB coaching", "NDA SSB coaching", "CDS SSB coaching", "AFCAT SSB coaching", "ex-SSB assessor mentors", "SSBWINGS"] },
  { key: "about", label: "About", path: "/about",
    title: "About Us — Mentored by Ex-SSB Officers",
    description: "SSBWINGS is an SSB coaching academy in Noida founded and mentored by ex-SSB assessors. 677+ recommendations across the Army, Navy and Air Force.",
    keywords: ["SSBWINGS academy", "ex-SSB officers coaching", "SSB coaching institute Noida", "Vishal Kaushik SSB", "SSB mentors", "defence coaching Noida"] },
  { key: "ssb-process", label: "The 5-Day SSB", path: "/ssb-process",
    title: "The 5-Day SSB Process — Screening to Conference",
    description: "A complete guide to the 5-day SSB interview: Screening (OIR, PPDT), Psychology (TAT, WAT, SRT, SD), GTO tasks, Personal Interview and the Conference.",
    keywords: ["5 day SSB process", "SSB interview procedure", "SSB screening test", "OIR test", "PPDT", "TAT WAT SRT SD", "GTO tasks", "SSB personal interview", "SSB conference"] },
  { key: "entries", label: "Entries", path: "/entries",
    title: "Entries — How to Become an Officer in the Indian Armed Forces",
    description: "Every officer-entry route into the Indian Army, Navy, Air Force and Coast Guard — NDA, TES, CDS, AFCAT, 10+2 B.Tech, TGC, SSC, NCC Special, JAG and more.",
    keywords: ["Indian Armed Forces officer entries", "how to become an officer", "defence entries after 12th", "defence entries after graduation", "Army Navy Air Force entry schemes", "officer entry list"] },
  { key: "courses", label: "Courses", path: "/courses",
    title: "SSB Courses — 15-Day Offline, 20-Day Online & Smart Learning App",
    description: "Explore SSBWINGS courses built by ex-SSB assessors: 15-day offline immersion, 20-day online masterclass and the AI-powered Smart Learning App.",
    keywords: ["SSB course", "15 day SSB course", "online SSB course", "SSB coaching fees", "SSB interview training", "SSB smart learning app"] },
  { key: "gallery", label: "Gallery", path: "/gallery",
    title: "Gallery — Wall of Honour & Recommended Cadets",
    description: "The SSBWINGS Wall of Honour: photographs of recommended cadets, All India Rank holders and commissioned officers across the Army, Navy and Air Force.",
    keywords: ["SSB recommended candidates", "SSBWINGS wall of honour", "recommended cadets", "commissioned officers"] },
  { key: "testimonials", label: "Testimonials", path: "/testimonials",
    title: "Testimonials — Success Stories from Recommended Cadets",
    description: "Read and watch success stories from SSBWINGS cadets — from repeated conference-outs to AIR-1 recommendations. Written testimonials, YouTube interviews and more.",
    keywords: ["SSB success stories", "SSB recommended testimonials", "SSBWINGS reviews", "SSB interview experience"] },
  { key: "contact", label: "Contact", path: "/contact",
    title: "Contact Us — Book Free SSB Counselling",
    description: "Get in touch with SSBWINGS, Noida Sector 62. Book a free counselling call, WhatsApp our team, or visit our campus.",
    keywords: ["SSB coaching contact", "SSB counselling", "SSBWINGS Noida address", "SSB coaching Sector 62"] },
  { key: "eligibility", label: "Eligibility Finder", path: "/eligibility",
    title: "SSB Eligibility Finder — Which Defence Entry Can I Apply For?",
    description: "Answer five quick questions and instantly find which officer entries you're eligible for — NDA, CDS, AFCAT, TES, TGC, SSC, JAG and more — then get free counselling.",
    keywords: ["SSB eligibility", "defence eligibility checker", "which defence exam can I apply", "NDA eligibility", "CDS eligibility", "AFCAT eligibility", "officer entry age limit"] },
  { key: "mock-tests", label: "Free Mock Tests", path: "/mock-tests",
    title: "Free SSB Mock Tests — OIR & SRT Practice",
    description: "Practise Officer Intelligence Rating (OIR) and Situation Reaction Test (SRT) questions free, with instant scoring — sharpen your SSB screening & psychology skills.",
    keywords: ["SSB mock test", "OIR mock test", "SRT practice", "free SSB practice test", "SSB screening practice"] },
  { key: "blog", label: "Blog", path: "/blog",
    title: "SSB Blog & Defence Current Affairs",
    description: "Tips, strategy and current affairs for SSB aspirants from the ex-SSB assessors at SSBWINGS — OIR, PPDT, psychology, GTO and personal-interview guidance.",
    keywords: ["SSB tips", "SSB interview tips", "defence current affairs", "SSB preparation blog", "GTO tips"] },
  { key: "recommended", label: "Recommended Candidates", path: "/recommended",
    title: "All Recommended Candidates — Wall of Honour",
    description: "The complete wall of SSBWINGS recommended cadets across NDA, CDS, AFCAT, TES, Navy, ICG and more — hundreds of real faces and chest numbers.",
    keywords: ["SSB recommended list", "recommended candidates", "SSBWINGS results", "SSB results"] },
  { key: "academies", label: "Academies", path: "/academies",
    title: "Armed Forces Academies — IMA, OTA, INA & AFA Explained",
    description: "Complete guide to the Indian Armed Forces training academies — IMA Dehradun, OTA Chennai, OTA Gaya, INA Ezhimala and AFA Dundigal: which entries train where, and for how long.",
    keywords: ["IMA Dehradun", "OTA Chennai", "OTA Gaya", "INA Ezhimala", "AFA Dundigal", "NDA Khadakwasla", "defence training academies"] },
  { key: "medical", label: "Medical Process", path: "/medical",
    title: "SSB Medical Process & Standards — Complete Guide",
    description: "The full SSB medical board process, academy-wise medical standards (height, weight, vision), the most common reasons for rejection, and how the AMB/RMB appeal system works.",
    keywords: ["SSB medical standards", "armed forces medical test", "AMB RMB appeal", "defence medical rejection", "SSB medical height weight", "SSB eye standards"] },
  { key: "resources", label: "Resources", path: "/resources",
    title: "Free SSB Resources — Notes, PDFs & Video Lessons",
    description: "Downloadable SSB study material from SSBWINGS — notes, sample dossiers, PDFs and video lessons, organised by topic. Free for every aspirant.",
    keywords: ["SSB study material", "SSB PDF", "free SSB notes", "SSB video lessons", "SSB resources"] },
];

export const getSeoPage = (key: string) => SEO_PAGES.find((p) => p.key === key);
