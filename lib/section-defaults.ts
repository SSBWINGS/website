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
import { AIR1 } from "@/lib/data";

export const SECTION_DEFAULTS: Record<string, Record<string, unknown>> = {
  hero: HERO,
  story: STORY,
  whyus: WHYUS,
  services: SERVICES,
  cta: CTA,
  air1: { items: AIR1 },
  // One editable hero doc per interior page (pagehero.<page>).
  ...Object.fromEntries(Object.entries(PAGE_HEROES).map(([k, v]) => [`pagehero.${k}`, v])),
};
