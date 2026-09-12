/** One landing page per officer entry — the unit search engines rank on.
 *
 *  Each page targets the queries aspirants actually type ("NDA SSB coaching",
 *  "AFCAT age limit", "how to join Navy JAG"). Eligibility facts are NOT typed
 *  here: they are derived from the tested rules in lib/eligibility.ts, so a
 *  page can never disagree with the Eligibility Finder.
 *
 *  Plain data and pure helpers — safe on server and client. */

import { ENTRIES, type Entry, type Education } from "./eligibility.ts";

export type EntryPage = {
  slug: string;
  /** The page's H1. */
  name: string;
  /** Short form used in questions, links and titles, e.g. "CDS OTA". */
  short: string;
  service: Entry["service"];
  /** Eligibility-rule ids this page covers (lib/eligibility.ts). */
  ids: string[];
  /** Written exam or shortlisting route that leads to the SSB. */
  exam: string;
  /** Where selected candidates train — omitted where not confirmed. */
  academy?: string;
  commission: string;
  intro: string;
  /** Extra keywords beyond the generated set. */
  extraKeywords?: string[];
  /** Entry-specific questions, on top of the generated eligibility ones. */
  faqs?: { q: string; a: string }[];
  /** Set where the limits could not be confirmed against an official notice. */
  indicative?: boolean;
};

export const ENTRY_PAGES: EntryPage[] = [
  // ── After 10+2 ────────────────────────────────────────────────────────────
  {
    slug: "nda", name: "NDA & NA — National Defence Academy", short: "NDA", service: "Army",
    ids: ["nda-army", "nda-navy", "nda-air"],
    exam: "UPSC NDA & NA written exam, held twice a year",
    academy: "National Defence Academy, Khadakwasla — then IMA, INA or AFA",
    commission: "Permanent Commission",
    intro: "The NDA is the most sought-after officer entry straight after Class 12. Clear the UPSC written exam and the 5-day SSB, train three years at Khadakwasla, and commission as a permanent officer in the Army, Navy or Air Force.",
    extraKeywords: ["NDA coaching after 12th", "NDA SSB interview tips", "NDA 1 NDA 2 SSB", "join NDA after 12th", "NDA for girls"],
    faqs: [
      { q: "Can girls apply for NDA?", a: "Yes. Women have been eligible for the NDA since 2021 and train alongside men at Khadakwasla, in the Army, Navy and Air Force wings." },
      { q: "Do I need PCM for NDA?", a: "Only for the Navy and Air Force wings, which need Physics and Maths in Class 12. The Army wing is open to Class 12 in any stream." },
    ],
  },
  {
    slug: "tes", name: "10+2 TES — Technical Entry Scheme", short: "10+2 TES", service: "Army",
    ids: ["tes"],
    exam: "Shortlisting on the JEE Mains score — no separate written exam",
    academy: "Officers Training Academy, Gaya, then technical training",
    commission: "Permanent Commission, with a four-year engineering degree",
    intro: "10+2 TES takes Class 12 PCM students straight to the SSB on the strength of their JEE Mains score — no UPSC written paper — and commissions them as Army engineers with a funded B.Tech.",
    extraKeywords: ["TES entry coaching", "TES SSB interview", "Army technical entry after 12th", "TES JEE Mains cutoff"],
    faqs: [
      { q: "Is there a written exam for 10+2 TES?", a: "No. Candidates are shortlisted on their JEE Mains score and go straight to the SSB interview, followed by the medical." },
    ],
  },
  {
    slug: "navy-btech", name: "Navy 10+2 B.Tech Cadet Entry", short: "Navy 10+2 B.Tech", service: "Navy",
    ids: ["navy-btech"],
    exam: "Shortlisting on the JEE Mains Common Rank List",
    academy: "Indian Naval Academy, Ezhimala",
    commission: "Permanent Commission, with a four-year B.Tech",
    intro: "The Navy's 10+2 B.Tech Cadet Entry takes PCM students with a JEE Mains rank directly to the SSB. Selected cadets study a fully funded four-year B.Tech at INA Ezhimala and commission as naval officers.",
    extraKeywords: ["Navy B.Tech entry SSB", "10+2 B.Tech entry scheme", "INA Ezhimala entry", "Navy entry after 12th"],
    faqs: [
      { q: "Can women apply for the Navy 10+2 B.Tech entry?", a: "Yes. The entry is open to unmarried men and women, and INA Ezhimala has trained women B.Tech cadets since 2021." },
    ],
  },

  // ── After graduation ──────────────────────────────────────────────────────
  {
    slug: "cds-ima", name: "CDS — Indian Military Academy (IMA)", short: "CDS IMA", service: "Army",
    ids: ["cds-ima"],
    exam: "UPSC Combined Defence Services (CDS) written exam",
    academy: "Indian Military Academy, Dehradun",
    commission: "Permanent Commission",
    intro: "CDS IMA is the graduate route to a permanent commission in the Army. Clear the UPSC CDS exam and the SSB, and train at the Indian Military Academy in Dehradun.",
    extraKeywords: ["CDS SSB coaching", "CDS IMA SSB interview", "IMA Dehradun entry", "join Army after graduation"],
  },
  {
    slug: "cds-ota", name: "CDS — Officers Training Academy (OTA)", short: "CDS OTA", service: "Army",
    ids: ["cds-ota"],
    exam: "UPSC Combined Defence Services (CDS) written exam",
    academy: "Officers Training Academy, Chennai",
    commission: "Short Service Commission",
    intro: "CDS OTA is the Short Service route into the Army for graduates, and one of the few CDS entries open to women. Clear UPSC CDS and the SSB, and train at OTA Chennai.",
    extraKeywords: ["CDS OTA SSB interview", "OTA Chennai entry", "CDS for women", "short service commission Army"],
    faqs: [
      { q: "Can women apply through CDS?", a: "Yes, through CDS OTA — the Short Service entry trained at OTA Chennai is open to women as well as men." },
    ],
  },
  {
    slug: "cds-ina", name: "CDS — Indian Naval Academy (INA)", short: "CDS INA", service: "Navy",
    ids: ["cds-navy"],
    exam: "UPSC Combined Defence Services (CDS) written exam",
    academy: "Indian Naval Academy, Ezhimala",
    commission: "Permanent Commission",
    intro: "CDS INA is the Navy's graduate entry through the UPSC CDS exam. It needs an engineering degree and leads to a permanent commission after training at INA Ezhimala.",
    extraKeywords: ["CDS Navy SSB", "INA CDS entry", "join Navy after graduation"],
  },
  {
    slug: "cds-afa", name: "CDS — Air Force Academy (AFA)", short: "CDS AFA", service: "Air Force",
    ids: ["cds-afa"],
    exam: "UPSC CDS written exam, then the AFSB and pilot aptitude test",
    academy: "Air Force Academy, Dundigal",
    commission: "Permanent Commission (Flying Branch)",
    intro: "CDS AFA is the graduate route into the Air Force's flying branch. After UPSC CDS you face the AFSB and the pilot aptitude battery, then train at the Air Force Academy in Dundigal.",
    extraKeywords: ["CDS AFA SSB", "AFSB interview coaching", "Air Force flying branch after graduation", "PABT preparation"],
  },
  {
    slug: "tgc", name: "TGC — Technical Graduate Course", short: "TGC", service: "Army",
    ids: ["tgc"],
    exam: "Shortlisting on degree merit — no written exam",
    academy: "Indian Military Academy, Dehradun",
    commission: "Permanent Commission",
    intro: "The Technical Graduate Course takes engineering graduates straight to the SSB on merit, with no written exam, and commissions them permanently into the Army's technical arms after training at IMA.",
    extraKeywords: ["TGC entry coaching", "TGC SSB interview", "Army entry for engineers"],
  },
  {
    slug: "ssc-tech", name: "SSC (Tech) — Short Service Commission Technical", short: "SSC Tech", service: "Army",
    ids: ["ssc-tech"],
    exam: "Shortlisting on degree merit — no written exam",
    academy: "Officers Training Academy, Chennai",
    commission: "Short Service Commission",
    intro: "SSC (Tech) is the Army's Short Service entry for engineering graduates — men and women — shortlisted on merit for the SSB, with training at OTA Chennai.",
    extraKeywords: ["SSC Tech SSB interview", "SSCW Tech coaching", "Army SSC for engineers", "SSC Tech for women"],
  },
  {
    slug: "afcat", name: "AFCAT — Air Force Common Admission Test", short: "AFCAT", service: "Air Force",
    ids: ["afcat-flying", "afcat-tech", "afcat-nontech"],
    exam: "AFCAT written exam, then the AFSB (and CPSS for flying)",
    academy: "Air Force Academy, Dundigal",
    commission: "Short Service or Permanent Commission, depending on branch",
    intro: "AFCAT is the Air Force's own entrance exam for graduates, covering the Flying, Ground Duty (Technical) and Ground Duty (Non-Technical) branches. Clear AFCAT, then the 5-day AFSB.",
    extraKeywords: ["AFSB coaching", "AFCAT interview preparation", "AFCAT flying branch", "AFCAT ground duty", "Air Force SSB"],
    faqs: [
      { q: "Is the AFCAT interview the same as an SSB?", a: "It is conducted by an Air Force Selection Board (AFSB) and follows the same 5-day pattern — screening, psychology, GTO and interview — with an extra pilot aptitude test (CPSS) for the flying branch." },
    ],
  },
  {
    slug: "jag-army", name: "JAG — Judge Advocate General (Army)", short: "Army JAG", service: "Army",
    ids: ["jag"],
    exam: "Shortlisting on the LLB score (and CLAT PG) — no separate written exam",
    academy: "Officers Training Academy, Chennai",
    commission: "Short Service Commission",
    intro: "The Army's JAG entry commissions law graduates as the Army's legal officers. Shortlisted candidates go straight to the SSB and train at OTA Chennai.",
    extraKeywords: ["JAG entry SSB coaching", "Army JAG eligibility", "join Army as a lawyer", "JAG SSB interview"],
  },
  {
    slug: "jag-navy", name: "JAG (Navy) — Law Cadre", short: "Navy JAG", service: "Navy",
    ids: ["navy-jag"],
    exam: "Shortlisting on the law degree — no separate written exam",
    academy: "Indian Naval Academy, Ezhimala — Naval Orientation Course",
    commission: "Short Service Commission",
    intro: "The Navy's Law cadre commissions law graduates as the Navy's legal officers. It needs a law degree with at least 55% from a Bar Council-recognised college, and runs through the SSB and a Naval Orientation Course at INA Ezhimala.",
    extraKeywords: ["Navy law cadre", "Navy JAG eligibility", "join Navy as a lawyer", "Navy SSC Law"],
    faqs: [
      { q: "How is Navy JAG different from Army JAG?", a: "Both are Short Service entries for law graduates. The Navy Law cadre takes candidates from 22 to 27 and trains them at INA Ezhimala; Army JAG takes 21 to 27 and trains at OTA Chennai." },
    ],
  },
  {
    slug: "ncc-special", name: "NCC Special Entry", short: "NCC Special Entry", service: "Army",
    ids: ["ncc-army"],
    exam: "NCC 'C' certificate — no written exam",
    academy: "Officers Training Academy, Chennai",
    commission: "Short Service Commission",
    intro: "NCC Special Entry rewards NCC cadets who hold the 'C' certificate with a direct route to the SSB — no written exam — and a Short Service Commission after training at OTA Chennai.",
    extraKeywords: ["NCC special entry SSB", "NCC C certificate entry", "NCC entry Army"],
  },
  {
    slug: "navy-ssc", name: "Navy SSC Officer Entry", short: "Navy SSC", service: "Navy",
    ids: ["navy-ssc-exec", "navy-ssc-pilot", "navy-ssc-logistics"],
    exam: "Shortlisting on degree marks (or INET) — then the SSB",
    academy: "Indian Naval Academy, Ezhimala",
    commission: "Short Service Commission",
    intro: "The Navy's Short Service Commission entries take graduates into the Executive, Technical, Pilot, Observer, Logistics, ATC and Education branches, through the SSB and training at INA Ezhimala.",
    extraKeywords: ["Navy SSC officer SSB", "Navy pilot entry", "Navy observer entry", "Navy logistics entry", "INET coaching"],
  },
  {
    slug: "meteorology", name: "Air Force Meteorology Branch", short: "IAF Meteorology", service: "Air Force",
    ids: ["af-met"],
    exam: "AFCAT written exam, then the AFSB",
    academy: "Air Force Academy, Dundigal",
    commission: "Short Service or Permanent Commission",
    intro: "The Air Force's Meteorology branch takes postgraduates in the sciences through AFCAT and the AFSB, to forecast the weather every sortie depends on.",
    extraKeywords: ["IAF meteorology entry", "Air Force meteorology branch eligibility"],
  },
  {
    slug: "coast-guard", name: "Indian Coast Guard — Assistant Commandant", short: "Coast Guard AC", service: "Coast Guard",
    ids: ["cg-gd", "cg-gd-women", "cg-pilot", "cg-tech"],
    exam: "Coast Guard Common Admission Test (CGCAT), then the Selection Board",
    academy: "Indian Naval Academy, Ezhimala",
    commission: "Assistant Commandant (Group 'A' Gazetted Officer)",
    intro: "Assistant Commandant is the officer entry into the Indian Coast Guard, across General Duty, Pilot, Navigator and Technical branches — through CGCAT and a selection board.",
    extraKeywords: ["Coast Guard SSB coaching", "ICG assistant commandant eligibility", "CGCAT preparation", "Coast Guard FSB interview"],
    faqs: [
      { q: "Can women join the Coast Guard as officers?", a: "Yes. Women can enter General Duty through the Short Service Appointment, and the Pilot and Navigator branches are also open to women." },
    ],
  },
  {
    slug: "rvc", name: "RVC — Remount & Veterinary Corps", short: "RVC", service: "Army",
    ids: ["rvc"],
    exam: "Shortlisting on the veterinary degree — then the SSB",
    commission: "Short Service Commission, commissioned as Captain",
    intro: "The Remount & Veterinary Corps commissions veterinary graduates to care for the Army's horses, mules and dogs. It needs a BVSc or BVSc & AH with the internship complete, and runs through the SSB.",
    extraKeywords: ["RVC entry Army", "Army veterinary officer", "Remount Veterinary Corps eligibility", "BVSc Army job"],
    faqs: [
      { q: "What rank do RVC officers join at?", a: "Veterinary officers are granted a Short Service Commission in the rank of Captain." },
    ],
  },

  // ── For serving personnel ─────────────────────────────────────────────────
  {
    slug: "amc-nt", name: "AMC (NT) — Army Medical Corps (Non-Technical)", short: "AMC (NT)", service: "Army",
    ids: ["amc-nt"],
    exam: "Unit screening (and a written exam for permanent commission), then the SSB",
    academy: "AMC Centre & College, Lucknow",
    commission: "Short Service or Permanent Commission",
    intro: "AMC (NT) lets serving soldiers of the Army Medical Corps and Army Dental Corps become officers in the non-technical side of the medical corps. It needs at least five years' service and Class 12 with Biology.",
    extraKeywords: ["AMC NT entry", "Army Medical Corps non technical", "soldier to officer AMC"],
  },
  {
    slug: "acc", name: "ACC — Army Cadet College", short: "ACC", service: "Army",
    ids: ["acc"],
    exam: "ACC written exam, then the SSB",
    academy: "Army Cadet College wing, IMA Dehradun",
    commission: "Permanent Commission",
    intro: "The Army Cadet College is the classic 'sipahi to officer' route: serving soldiers with at least two years' service clear a written exam and the SSB, earn a degree at the ACC wing and commission from IMA.",
    extraKeywords: ["ACC entry SSB coaching", "soldier to officer", "Army Cadet College eligibility", "ACC exam preparation"],
  },
  {
    slug: "sco", name: "SCO — Special Commissioned Officer", short: "SCO", service: "Army",
    ids: ["sco"],
    exam: "Screening, then the SSB",
    commission: "Special Commissioned Officer",
    intro: "The Special Commissioned Officer scheme lets experienced serving soldiers — typically 28 to 35 with long service — earn a commission after screening and the SSB.",
    extraKeywords: ["SCO entry Army", "special commissioned officer eligibility"],
  },
  {
    slug: "pc-sl", name: "PC (SL) — Permanent Commission (Special List)", short: "PC (SL)", service: "Army",
    ids: ["pc-sl"],
    exam: "Screening, then the SSB",
    commission: "Permanent Commission (Special List)",
    intro: "PC (SL) offers serving JCOs, NCOs and other ranks a permanent commission on the Special List, after screening and the SSB.",
    extraKeywords: ["PC SL entry", "permanent commission special list"],
  },
  {
    slug: "navy-cw", name: "Navy (CW) — Commission Worthy Scheme", short: "Navy CW", service: "Navy",
    ids: ["navy-cw"],
    exam: "Preliminary Screening Board and a written exam, then the SSB",
    commission: "Commissioned as Sub Lieutenant",
    intro: "The Commission Worthy scheme — formerly the Upper Yardmen scheme — is the Navy's route for serving sailors to become officers, through a screening board, a written exam and the SSB.",
    extraKeywords: ["Navy CW entry", "commission worthy scheme", "sailor to officer", "Upper Yardmen scheme"],
    faqs: [
      { q: "Can married sailors apply for CW?", a: "Yes. Married sailors may apply, though they are not given married accommodation during training; unmarried sailors may not marry until they are commissioned as Sub Lieutenants." },
    ],
  },
  {
    slug: "navy-het", name: "Navy (HET) — Higher Educational Test", short: "Navy HET", service: "Navy",
    ids: ["navy-het"],
    exam: "Higher Educational Test, then a commission scheme and the SSB",
    commission: "Commission through a sailor-to-officer scheme",
    intro: "The Higher Educational Test is taken by serving sailors on the way to a commission. Qualifying in it opens the Navy's sailor-to-officer schemes and the SSB that follows.",
    extraKeywords: ["Navy HET", "Higher Educational Test Navy", "sailor to officer Navy"],
    indicative: true,
  },
];

// ── Derived facts ───────────────────────────────────────────────────────────

const byId = new Map(ENTRIES.map((e) => [e.id, e]));

/** The eligibility rules a page covers, in the order it lists them. */
export function rulesFor(page: EntryPage): Entry[] {
  return page.ids.map((id) => byId.get(id)).filter((e): e is Entry => Boolean(e));
}

export const entryPage = (slug: string) => ENTRY_PAGES.find((p) => p.slug === slug);

/** "16½" rather than "16.5" — how the age limits are written everywhere else. */
export function ageText(n: number): string {
  const whole = Math.floor(n);
  return n - whole >= 0.5 ? `${whole}½` : String(whole);
}

export const ageRange = (e: Entry) => `${ageText(e.minAge)}–${ageText(e.maxAge)} years`;

export function genderText(e: Entry): string {
  const m = e.genders.includes("male");
  const f = e.genders.includes("female");
  return m && f ? "Men and women" : f ? "Women only" : "Men only";
}

export const maritalText = (e: Entry) =>
  e.requiresUnmarried ? "Unmarried only" : "Married or unmarried";

const EDU_TEXT: Record<Education, string> = {
  "10+2": "Class 12 (10+2)",
  graduate: "a graduate degree",
  engineering: "an engineering degree (BE/B.Tech)",
  law: "a law degree (LLB)",
  postgraduate: "a postgraduate degree",
  veterinary: "a veterinary degree (BVSc / BVSc & AH)",
};

/** The minimum qualification, worded for a person rather than a filter. */
export function educationText(e: Entry): string {
  const ed = e.education;
  const base = ed.includes("10+2")
    ? EDU_TEXT["10+2"]
    : ed.includes("graduate")
      ? EDU_TEXT.graduate
      : ed.length === 1
        ? EDU_TEXT[ed[0]]
        : ed.map((x) => EDU_TEXT[x]).join(" or ");
  return e.requiresPcm ? `${base}, with Physics & Maths in Class 12` : base;
}

/** One-sentence summary of who may apply — the kind of line answer engines quote. */
export const eligibilitySentence = (e: Entry) =>
  `${genderText(e)}, ${maritalText(e).toLowerCase()}, aged ${ageRange(e)}, with ${educationText(e)}${
    e.serving ? ", who are already serving" : ""
  }.`;

/** Target keywords — the head term first, then the variants people search. */
export function keywordsFor(page: EntryPage): string[] {
  const t = page.short;
  return Array.from(
    new Set([
      `${t} SSB coaching`,
      `${t} SSB interview preparation`,
      `${t} eligibility`,
      `${t} age limit`,
      `${t} selection process`,
      `best ${t} SSB coaching in Noida`,
      `${t} SSB coaching in Delhi NCR`,
      `online ${t} SSB coaching`,
      `how to join ${page.service === "Coast Guard" ? "the Coast Guard" : `the Indian ${page.service}`} through ${t}`,
      ...(page.extraKeywords ?? []),
    ]),
  );
}

/** Search results show roughly 60 characters before truncating, and the
 *  layout appends " | SSBWINGS", so long entry names get the shorter form. */
export function titleFor(page: EntryPage): string {
  const full = `${page.short} SSB Coaching — Eligibility, Age Limit & Selection`;
  return full.length <= 60 ? full : `${page.short} SSB Coaching — Eligibility & Age Limit`;
}

export const descriptionFor = (page: EntryPage) =>
  `${page.short} eligibility, age limit and selection process — and how SSBWINGS, mentored by ex-SSB officers in Noida, prepares you for the ${page.short} SSB interview.`;

/** Questions and answers for the page — generated from the rules, then the
 *  page's own. Written as complete answers so each stands alone when quoted. */
export function faqsFor(page: EntryPage): { question: string; answer: string }[] {
  const rules = rulesFor(page);
  const multi = rules.length > 1;
  const each = (fn: (e: Entry) => string) =>
    multi ? rules.map((e) => `${e.name}: ${fn(e)}`).join(" ") : fn(rules[0]);

  const generated = rules.length
    ? [
        { question: `Who is eligible for ${page.short}?`, answer: each(eligibilitySentence) },
        { question: `What is the age limit for ${page.short}?`, answer: multi ? rules.map((e) => `For ${e.name}, candidates must be ${ageRange(e)} old.`).join(" ") : `Candidates for ${page.short} must be ${ageRange(rules[0])} old.` },
        { question: `What is the selection process for ${page.short}?`, answer: `${page.exam}, followed by the 5-day SSB interview and a medical examination. ${multi ? "" : `(${rules[0].how}.)`}`.trim() },
        { question: `Can married candidates apply for ${page.short}?`, answer: each((e) => (e.requiresUnmarried ? "No — candidates must be unmarried, and must stay unmarried through training." : "Yes — married candidates may apply.")) },
      ]
    : [];

  return [
    ...generated,
    ...(page.faqs ?? []).map((f) => ({ question: f.q, answer: f.a })),
    {
      question: `How does SSBWINGS prepare you for the ${page.short} SSB interview?`,
      answer:
        "SSBWINGS is mentored by ex-SSB assessors. The 15-day offline course at our Noida campus and the 20-day online course cover all five days of the SSB — screening (OIR and PPDT), psychology (TAT, WAT, SRT, SD), GTO tasks on a full ground, the personal interview and the conference — with one-on-one feedback.",
    },
  ];
}

/** Other entries in the same service, for internal links. */
export const relatedTo = (page: EntryPage) =>
  ENTRY_PAGES.filter((p) => p.service === page.service && p.slug !== page.slug);

/** Route names on the /entries page → the entry page each one links to.
 *  An explicit table rather than fuzzy matching: if an admin renames a route
 *  in the CMS, its link simply disappears instead of pointing somewhere wrong.
 *  The Navy and Air Force NCC routes are deliberately absent — the NCC page
 *  covers the Army entry, so linking them there would mislead. */
export const ROUTE_SLUGS: Record<string, string> = {
  "NDA & NA": "nda",
  "NDA (Naval)": "nda",
  "NDA (Air)": "nda",
  "10+2 TES (Technical Entry Scheme)": "tes",
  "10+2 (B.Tech) Cadet Entry": "navy-btech",
  "CDS – IMA": "cds-ima",
  "CDS – OTA (SSC)": "cds-ota",
  "CDS (Navy)": "cds-ina",
  "CDS – AFA (Flying)": "cds-afa",
  "TGC (Technical Graduate Course)": "tgc",
  "SSC (Tech) – Men & Women": "ssc-tech",
  "NCC Special Entry": "ncc-special",
  "JAG (Judge Advocate General)": "jag-army",
  "JAG (Navy) – Law Cadre": "jag-navy",
  "RVC (Remount & Veterinary Corps)": "rvc",
  "ACC & SCO": "acc",
  "AMC (NT) – Army Medical Corps (Non-Tech)": "amc-nt",
  "SSC Executive (GS/X) & Technical": "navy-ssc",
  "SSC Pilot / Observer": "navy-ssc",
  "SSC Logistics / ATC / Education": "navy-ssc",
  "Navy (CW) – Commission Worthy": "navy-cw",
  "Navy (HET) – Higher Educational Test": "navy-het",
  "AFCAT – Flying Branch": "afcat",
  "AFCAT – Ground Duty (Tech)": "afcat",
  "AFCAT – Ground Duty (Non-Tech)": "afcat",
  "Meteorology Entry": "meteorology",
  "Assistant Commandant – General Duty": "coast-guard",
  "AC – GD (Pilot / Navigator)": "coast-guard",
  "AC – Technical (Engineering)": "coast-guard",
  "AC – Commercial Pilot / Law / Others": "coast-guard",
};
