export type PageHeroDoc = { kicker: string; title: string; subtitle: string; image: string; crumb: string };

const tri = (s: string) => `<span class="tricolour-text">${s}</span>`;

export const PAGE_HEROES: Record<string, PageHeroDoc> = {
  about: {
    kicker: "Our Story", crumb: "About",
    title: `We Give Shape to Your ${tri("Dreams")}`,
    subtitle: "Born from the belief that every deserving aspirant deserves an honest shot at the uniform — mentored by the very officers who once sat on the assessor's chair.",
    image: "/images/ota-sunrise.jpg",
  },
  "ssb-process": {
    kicker: "Know Your Battlefield", crumb: "The 5-Day SSB",
    title: `The ${tri("5-Day SSB")} Decoded`,
    subtitle: "Five days. Three assessors. Fifteen Officer Like Qualities. Here is exactly what awaits you at the Services Selection Board — day by day, test by test.",
    image: "/images/gto-training.jpg",
  },
  entries: {
    kicker: "How to Join as an Officer", crumb: "Entries",
    title: `Every Route to the ${tri("Uniform")}`,
    subtitle: "Army, Navy, Air Force or Coast Guard — there is more than one way to earn a commission. Here is every officer-entry scheme, who it's for, how selection works and the commission it leads to.",
    image: "/images/pipping-ceremony.jpg",
  },
  courses: {
    kicker: "Choose Your Battle Plan", crumb: "Courses",
    title: `Courses Built by ${tri("Assessors")}`,
    subtitle: "Offline immersion, live online masterclass or train-anywhere app — every programme is designed and delivered by the officers who once assessed candidates at real Boards.",
    image: "/images/hero-parade.jpg",
  },
  gallery: {
    kicker: "Wall of Honour", crumb: "Gallery",
    title: `Faces of ${tri("Recommendation")}`,
    subtitle: "Every photograph here is a real SSBWINGS alumnus who walked out of the Board recommended. Discipline, dedication and determination — made visible.",
    image: "/images/women-officers.jpg",
  },
  testimonials: {
    kicker: "Stories in Uniform", crumb: "Testimonials",
    title: `They Were Told ${tri("No.")} They Answered Again.`,
    subtitle: "Setbacks, medical rejections, five failed attempts — and then a chest number called. These are the journeys our cadets share in their own words.",
    image: "/images/ima-guard.jpg",
  },
  contact: {
    kicker: "Report for Duty", crumb: "Contact",
    title: `Begin Your ${tri("March")}`,
    subtitle: "A mentor — not a salesperson — will call you back with an honest assessment of your entry, timeline and preparation plan. No spam, ever.",
    image: "/images/gto-training.jpg",
  },
  eligibility: {
    kicker: "Am I eligible?", crumb: "Eligibility",
    title: `SSB Eligibility ${tri("Finder")}`,
    subtitle: "Answer five quick questions and instantly see which officer entries — NDA, CDS, AFCAT, TES and more — you can apply for.",
    image: "/images/services/army-op.jpg",
  },
  "mock-tests": {
    kicker: "Free practice", crumb: "Mock Tests",
    title: `SSB ${tri("Mock Tests")}`,
    subtitle: "Sharpen your screening reasoning with a free Officer Intelligence Rating (OIR) quiz — instant scoring, no sign-up.",
    image: "/images/hero-parade.jpg",
  },
  blog: {
    kicker: "Insights & current affairs", crumb: "Blog",
    title: `SSBWINGS ${tri("Blog")}`,
    subtitle: "Strategy, tips and defence current affairs for SSB aspirants — straight from our ex-SSB assessors.",
    image: "/images/hero-parade.jpg",
  },
  recommended: {
    kicker: "Wall of Honour", crumb: "Recommended",
    title: `Every ${tri("Recommended")} Cadet`,
    subtitle: "The complete roll of SSBWINGS aspirants who walked out of the Board recommended — hundreds of real faces and chest numbers, from NDA and CDS to AFCAT, Navy and Coast Guard.",
    image: "/images/women-officers.jpg",
  },
  academies: {
    kicker: "Where Officers Are Forged", crumb: "Academies",
    title: `The ${tri("Academies")}`,
    subtitle: "IMA Dehradun, OTA Chennai, OTA Gaya, INA Ezhimala and AFA Dundigal — what each academy trains, who trains there and exactly how long each course runs.",
    image: "/images/ima-guard.jpg",
  },
  medical: {
    kicker: "After the Recommendation", crumb: "Medical",
    title: `The SSB ${tri("Medical")} Process`,
    subtitle: "The complete medical board process, academy-wise standards, common reasons for rejection and how the appeal system works.",
    image: "/images/gto-training.jpg",
  },
  resources: {
    kicker: "Free Study Material", crumb: "Resources",
    title: `SSB ${tri("Resources")}`,
    subtitle: "Downloadable notes, sample dossiers, PDFs and video lessons — organised by topic. Browse the folders below.",
    image: "/images/gto-training.jpg",
  },
};

export const pageHero = (key: string): PageHeroDoc =>
  PAGE_HEROES[key] ?? { kicker: "", title: "", subtitle: "", image: "/images/hero-parade.jpg", crumb: "" };
