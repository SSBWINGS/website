/** Default content for every CMS-editable section (single source of truth).
 *  Public components use these as fallback; the admin editor seeds from them.
 *  Plain data only — safe to import from both server and client code. */

export const HERO = {
  badge: "Noida Sector 62 · Mentored by Ex-SSB Officers",
  headingLine1: "The Uniform Doesn't",
  headingLine2: "Choose Everyone.",
  paragraph:
    "Five days at the Services Selection Board decide who wears the stars. At <strong>SSBWINGS</strong>, ex-SSB assessors rebuild you for every one of them — Screening, Psychology, GTO, Interview and Conference — until the Board sees what we see: <em>an officer</em>.",
  rating: "Rated 5.0 on Google by aspirants across India",
};

export const STORY = {
  kicker: "The Hard Truth",
  title: '1.4 Billion Indians.<br><span class="tricolour-text">Still Short of Officers.</span>',
  paragraph:
    "Every year lakhs clear the written exam, reach the SSB gates — and come back with a <strong>Conference Out</strong>. Not because they lack potential, but because nobody showed them the battlefield map. In mentoring 3,450+ aspirants, almost every failure traces back to three gaps:",
};

export const WHYUS = {
  kicker: "The SSBWINGS Edge",
  title: 'Why Aspirants Trust the <span class="tricolour-text">Wings</span>',
  subtitle:
    "Coaching factories teach tricks. We run a personality forge — the same standards, ground realities and honest assessment you'll face at Allahabad, Bhopal or Bengaluru.",
};

export const SERVICES = {
  kicker: "Four Forces · One Dream",
  title: 'Which <span class="tricolour-text">Uniform</span> Calls You?',
  subtitle:
    "Army, Navy, Air Force or Coast Guard — the SSB is common, but the interview, PIQ and career path are not. We prepare you for your exact service and entry.",
};

export const CTA = {
  eyebrow: "⏳ New batches open every month · Seats are limited",
  title: 'Your Chest Number<br><span class="tricolour-text">Is Waiting to Be Called</span>',
  paragraph:
    "Every day you delay is a day your competition trains. Book a free counselling call — a mentor will map your entry, your timeline and your battle plan.",
};

import { PAGE_HEROES } from "@/lib/pagehero-defaults";
import { AIR1, DAYS, JOIN_ROUTES } from "@/lib/data";

export const WHYUS_ITEMS = [
  { icon: "🎖️", title: "Mentored by Ex-SSB Assessors", body: "Learn from officers who sat on the other side of the table — retired Interviewing Officers, GTOs and psychology experts who assessed thousands at real Boards." },
  { icon: "🪖", title: "Real GTO Ground on Campus", body: "Full-scale PGT structures, command task areas and obstacle courses. You rehearse Day 3 & 4 physically — not on a whiteboard." },
  { icon: "🧭", title: "Guidance Till Recommendation", body: "One enrollment, our commitment till you hear your chest number called. Repeaters get focused conference-out analysis and a rebuilt strategy." },
  { icon: "🔍", title: "Personal Attention, Small Batches", body: "Every dossier read, every mock interview debriefed one-on-one. You are a name and a personality here — never a roll number." },
  { icon: "🤝", title: "3,450+ Strong Alumni Network", body: "Serving officers across the Army, Navy and Air Force mentor the next generation. Free monthly practice sessions for alumni, always." },
  { icon: "⚖️", title: "Merit-First, No False Promises", body: "No academy can 'guarantee' a recommendation. We build the officer; the Board does the rest — honestly, transparently." },
];

export const ABOUT_VALUES = [
  { icon: "🎯", title: "Merit Before Marketing", body: "We never promise recommendations. We promise assessor-grade preparation and honest feedback — the Board decides the rest." },
  { icon: "🤝", title: "Mentorship for Life", body: "Enroll once; stay family forever. Alumni return for free monthly practice sessions and to mentor the next batch." },
  { icon: "🛡️", title: "Discipline & Character", body: "The uniform rewards OLQs. Everything we do — from the GTO ground to midnight interview calls — builds the officer within." },
];

export const ABOUT_MISSION = {
  kicker: "The Mission",
  title: 'From Aspirant to <span class="tricolour-text">Officer</span>',
  body:
    "<p>India has more than 1.4 billion people, yet the Armed Forces remain short of officers. The gap isn't talent — it's <strong>preparation that understands the Board</strong>.</p><p>SSBWINGS was founded to close that gap. Our director <strong>Vishal Kaushik</strong>, alongside a bench of retired Interviewing Officers, GTOs and DIPR-trained psychologists, built an academy that mirrors the real SSB — a full GTO ground, honest psychology feedback and one-on-one mock interviews.</p><p>The result: <strong>677+ recommendations</strong>, cadets marching into IMA, INA, AFA and OTA — many after repeated setbacks that we helped them turn around.</p>",
  image: "/images/campus/imagestwo-20.jpg",
};

export const GATEWAYS = [
  { icon: "🎓", title: "After Class 12th", body: "Join right after school and train as a cadet. Routes like NDA, 10+2 TES and the Navy's 10+2 B.Tech entry commission you young — with a full degree earned in uniform.", tags: ["NDA & NA", "10+2 TES", "10+2 B.Tech (Navy)"] },
  { icon: "🎖️", title: "After Graduation", body: "Already a graduate? CDS, AFCAT, TGC, SSC, NCC Special and JAG open both Permanent and Short Service Commissions across all branches and specialisations.", tags: ["CDS", "AFCAT", "TGC / SSC Tech", "NCC Special", "JAG"] },
  { icon: "⚔️", title: "From the Ranks", body: "Serving soldiers, sailors and airmen can earn a commission through departmental entries like ACC and SCO — the classic 'Sipahi to Officer' journey many of our alumni have walked.", tags: ["ACC", "SCO", "Departmental"] },
];

export const SECTION_DEFAULTS: Record<string, Record<string, unknown>> = {
  hero: HERO,
  story: STORY,
  whyus: WHYUS,
  services: SERVICES,
  cta: CTA,
  air1: { items: AIR1 },
  whyus_items: { items: WHYUS_ITEMS },
  about_values: { items: ABOUT_VALUES },
  about_mission: ABOUT_MISSION,
  gateways: { items: GATEWAYS },
  journey: { items: DAYS },
  join_routes: { items: JOIN_ROUTES },
  // One editable hero doc per interior page (pagehero.<page>).
  ...Object.fromEntries(Object.entries(PAGE_HEROES).map(([k, v]) => [`pagehero.${k}`, v])),
};
