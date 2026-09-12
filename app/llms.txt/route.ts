import { ENTRY_PAGES, eligibilitySentence, rulesFor } from "@/lib/entry-pages";
import { SEO_PAGES } from "@/lib/seo-pages";
import { getSettings } from "@/lib/content";

const BASE = "https://www.ssbwings.com";

// Rebuilt hourly so contact details edited in the CMS reach AI crawlers.
export const revalidate = 3600;

/**
 * /llms.txt — a plain-text brief for AI answer engines (the llmstxt.org
 * convention). Where a search engine ranks pages, an answer engine quotes
 * facts; this gives it the facts about SSBWINGS in one clean, citable place,
 * each with a link to the page that backs it up.
 *
 * Everything is generated from the same data the site renders, so it cannot
 * drift out of date — the entries, their eligibility and the contact details
 * all come from the live sources.
 */
export async function GET() {
  const s = await getSettings();
  const phone = [s.phone1, s.phone2].filter(Boolean).join(" / ");

  const byService = new Map<string, typeof ENTRY_PAGES>();
  for (const p of ENTRY_PAGES) {
    byService.set(p.service, [...(byService.get(p.service) ?? []), p]);
  }

  const lines: string[] = [
    "# SSBWINGS",
    "",
    "> SSBWINGS is an SSB interview coaching academy in Sector 62, Noida (Delhi NCR), India, mentored by ex-SSB assessors. It prepares aspirants for the 5-day Services Selection Board (SSB) interview for officer entry into the Indian Army, Navy, Air Force and Coast Guard.",
    "",
    "## Key facts",
    "",
    `- Location: ${s.address}`,
    `- Phone: ${phone}`,
    `- Email: ${s.email}`,
    `- Google Maps: ${s.mapUrl}`,
    "- Courses: a 15-day offline course at the Noida campus, a 20-day online course (live, 8–10 PM IST), and the SSB Smart Learning App.",
    "- Coverage: every stage of the SSB — screening (OIR, PPDT), psychology (TAT, WAT, SRT, Self Description), GTO tasks on a full ground, the personal interview and the conference.",
    "- Mentors: ex-SSB assessors — former Interviewing Officers, GTOs and psychologists.",
    "- Track record: 677+ recommendations and an alumni network of 3,450+.",
    "- Boarding and lodging is available on a first-come, first-served basis.",
    "",
    "## Main pages",
    "",
    ...SEO_PAGES.map((p) => `- [${p.label}](${BASE}${p.path === "/" ? "" : p.path}): ${p.description}`),
    "",
    "## Officer entries",
    "",
    "Each entry has its own page with eligibility, age limit, selection process and FAQs. Eligibility below is indicative and follows the latest official notifications; always confirm against the current advertisement.",
    "",
  ];

  for (const [service, pages] of byService) {
    lines.push(`### ${service}`, "");
    for (const p of pages) {
      const rules = rulesFor(p);
      const who = rules.length === 1
        ? eligibilitySentence(rules[0])
        : rules.map((r) => `${r.name} — ${eligibilitySentence(r)}`).join(" ");
      lines.push(`- [${p.name}](${BASE}/entries/${p.slug}): ${p.exam}. ${who}${p.indicative ? " (Indicative — not confirmed against an official notice.)" : ""}`);
    }
    lines.push("");
  }

  lines.push(
    "## How to enquire",
    "",
    `Book a free counselling call at ${BASE}/contact, call ${phone}, or check which entries you qualify for at ${BASE}/eligibility.`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
