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
    title: "SSBWINGS — Best SSB Coaching in India | SSB Academy, Noida",
    description: "SSBWINGS, Noida Sector 62 — India's trusted SSB interview coaching academy in Delhi NCR, mentored by ex-SSB officers. 760+ recommendations, 3,500+ alumni. Master the 5-day SSB: Screening, Psychology, GTO, Interview & Conference.",
    keywords: ["SSB coaching", "best SSB coaching in India", "SSB coaching in Noida", "SSB coaching Noida Sector 62", "SSB academy Noida", "SSB interview coaching Delhi NCR", "SSB coaching near Delhi", "SSB coaching in Uttar Pradesh", "SSB interview preparation", "how to prepare for SSB interview", "SSB coaching near me", "online SSB coaching", "SSB interview coaching online India", "NDA SSB coaching", "CDS SSB coaching", "AFCAT AFSB coaching", "SSB coaching by retired officers", "SSB coaching with GTO ground", "SSB coaching with hostel facility", "ex-SSB assessor mentors", "SSBWINGS", "SSBWINGS Academy", "SSB Wings Noida"] },
  { key: "about", label: "About", path: "/about",
    title: "About Us — Mentored by Ex-SSB Officers",
    description: "SSBWINGS Academy is an SSB coaching academy in Noida founded and mentored by ex-SSB assessors and retired officers. 760+ recommendations across the Army, Navy and Air Force.",
    keywords: ["SSBWINGS Academy", "SSB Wings Noida", "SSB academy Noida", "SSB coaching by retired officers", "ex-SSB officers coaching", "SSB coaching institute Noida", "Vishal Kaushik SSB", "SSB mentors", "defence coaching Noida"] },
  { key: "ssb-process", label: "The 5-Day SSB", path: "/ssb-process",
    title: "The 5-Day SSB Process — Screening to Conference",
    description: "A complete guide to the 5-day SSB interview: Screening (OIR, PPDT), Psychology (TAT, WAT, SRT, SDT), GTO tasks, Personal Interview and the Conference.",
    keywords: ["5 day SSB process", "what happens in the five-day SSB interview", "SSB interview procedure", "SSB screening test preparation", "SSB stage 1 preparation", "SSB OIR test", "SSB PPDT test", "PPDT narration practice", "PPDT group discussion tips", "SSB psychology test preparation", "SSB psychological tests explained", "SSB psychologist assessment", "TAT WAT SRT SDT preparation", "SSB TAT test", "SSB WAT test", "SSB SRT test", "SSB SDT test", "SSB psychology test time limit", "SSB GTO task preparation", "SSB GTO ground training", "SSB group testing officer tasks", "SSB group discussion preparation", "SSB group planning exercise", "SSB progressive group task", "SSB half group task", "SSB command task preparation", "SSB individual obstacles", "SSB final group task", "SSB snake race preparation", "SSB lecturette topics", "SSB personal interview preparation", "SSB PIQ form preparation", "SSB officer like qualities", "SSB conference"] },
  { key: "entries", label: "Entries", path: "/entries",
    title: "Entries — How to Become an Officer in the Indian Armed Forces",
    description: "Every officer-entry route into the Indian Army, Navy, Air Force and Coast Guard — NDA, TES, CDS, AFCAT, 10+2 B.Tech, TGC, SSC, NCC Special, JAG and more.",
    keywords: ["Indian Armed Forces officer entries", "how to become an officer", "defence entries after 12th", "defence entries after graduation", "Army Navy Air Force entry schemes", "officer entry list", "service entry SSB interview preparation"] },
  { key: "courses", label: "Courses", path: "/courses",
    title: "SSB Courses — 2-Week Offline, 30-Day Online & Smart Learning App",
    description: "Explore SSBWINGS SSB courses built by ex-SSB assessors: a 2-week offline immersion in Noida, a 30-day online SSB course with recordings and the AI-powered SSB Smart Learning App.",
    keywords: ["SSB course", "SSBWINGS SSB course", "SSBWINGS online SSB course", "2 week SSB course", "30 day online SSB course", "online SSB course", "SSB interview course fees Noida", "SSB coaching fees", "SSB interview training", "SSB coaching with hostel facility", "SSB coaching with GTO ground", "SSB coaching with mock interview", "SSB interview course with psychology practice", "SSB coaching for working professionals", "SSB online classes with recordings", "SSB interview workbook", "SSB Smart Learning App"] },
  { key: "gallery", label: "Gallery", path: "/gallery",
    title: "Gallery — Wall of Honour & Recommended Cadets",
    description: "The SSBWINGS Wall of Honour: photographs of recommended cadets, All India Rank holders and commissioned officers across the Army, Navy and Air Force.",
    keywords: ["SSB recommended candidates", "SSBWINGS wall of honour", "recommended cadets", "commissioned officers"] },
  { key: "testimonials", label: "Testimonials", path: "/testimonials",
    title: "Testimonials — Success Stories from Recommended Cadets",
    description: "Read and watch success stories from SSBWINGS cadets — from repeated conference-outs to AIR-1 recommendations. Written testimonials, YouTube interviews and more.",
    keywords: ["SSB success stories", "SSB recommended testimonials", "SSBWINGS reviews", "SSB interview experience", "SSB interview experience and lessons", "SSB interview for repeaters"] },
  { key: "contact", label: "Contact", path: "/contact",
    title: "Contact Us — Book Free SSB Counselling",
    description: "Get in touch with SSBWINGS, Noida Sector 62, Uttar Pradesh — SSB coaching near Delhi. Book a free counselling call, WhatsApp our team, or visit our campus.",
    keywords: ["SSB coaching contact", "SSB counselling", "SSBWINGS Noida address", "SSB coaching Noida Sector 62", "SSB Wings Noida", "SSB coaching near Delhi", "SSB coaching in Uttar Pradesh"] },
  { key: "eligibility", label: "Eligibility Finder", path: "/eligibility",
    title: "SSB Eligibility Finder — Which Defence Entry Can I Apply For?",
    description: "Answer five quick questions and instantly find which officer entries you're eligible for — NDA, CDS, AFCAT, TES, TGC, SSC, JAG and more — then get free counselling.",
    keywords: ["SSB eligibility", "defence eligibility checker", "which defence exam can I apply", "NDA eligibility", "CDS eligibility", "AFCAT eligibility", "officer entry age limit"] },
  { key: "mock-tests", label: "Free Mock Tests", path: "/mock-tests",
    title: "Free SSB Mock Tests — OIR & SRT Practice",
    description: "Practise Officer Intelligence Rating (OIR) and Situation Reaction Test (SRT) questions free, with instant scoring — sharpen your SSB screening & psychology skills.",
    keywords: ["SSB mock test", "OIR mock test", "SSB OIR test", "OIR test questions for SSB", "SSB OIR practice questions", "SRT practice", "SSB SRT practice questions", "SRT questions for SSB", "SSB psychology online practice", "free SSB practice test", "SSB screening practice"] },
  { key: "blog", label: "Blog", path: "/blog",
    title: "SSB Blog & Defence Current Affairs",
    description: "Tips, strategy and current affairs for SSB aspirants from the ex-SSB assessors at SSBWINGS — OIR, PPDT, psychology, GTO and personal-interview guidance.",
    keywords: ["SSB tips", "SSB interview tips", "how to prepare for SSB interview", "SSB interview current affairs questions", "defence current affairs", "SSB preparation blog", "GTO tips"] },
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
    description: "Downloadable SSB study material from SSBWINGS — TAT, WAT and SRT practice sets, OIR practice questions, lecturette topics, notes and video lessons, organised by topic. Free for every aspirant.",
    keywords: ["SSB study material", "SSB TAT picture practice", "SSB WAT practice", "WAT words for SSB", "SSB SRT practice questions", "SSB OIR practice questions", "SSB lecturette practice topics", "SSB GPE practice", "SSB command task preparation", "SSB PDF", "free SSB notes", "SSB video lessons", "SSB resources"] },
];

export const getSeoPage = (key: string) => SEO_PAGES.find((p) => p.key === key);
