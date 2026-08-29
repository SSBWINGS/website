/** Homepage section registry + default order.
 *  Plain data (no components) so it is safe to import from client code too —
 *  the admin reorder screen uses the same list the page renders from. */

export type HomeSectionKey =
  | "entries_marquee"
  | "air1_marquee"
  | "wall"
  | "courses"
  | "campus"
  | "books"
  | "mentors"
  | "four_forces"
  | "whyus"
  | "countdown"
  | "stats"
  | "selection_tracker"
  | "journey"
  | "officer_banners"
  | "google_reviews"
  | "testimonials"
  | "instagram"
  | "faq"
  | "cta";

export type HomeSectionMeta = { key: HomeSectionKey; label: string; hint?: string; editHref?: string };

/** Every movable homepage section, in the order they ship by default.
 *  (The hero is always first and is not part of this list.) */
export const HOME_SECTIONS: HomeSectionMeta[] = [
  { key: "entries_marquee", label: "Entries Marquee", hint: "Entries + recommended counts", editHref: "/admin/sections/entry_counts" },
  { key: "air1_marquee", label: "AIR-1 Marquee", hint: "Rank-holder cards", editHref: "/admin/air1" },
  { key: "wall", label: "Wall of Honour", hint: "Recommended candidate tiles", editHref: "/admin/candidates" },
  { key: "courses", label: "Courses", hint: "Course cards + facilities note", editHref: "/admin/courses" },
  { key: "campus", label: "Campus Gallery", hint: "Photos of the campus", editHref: "/admin/campus" },
  { key: "books", label: "Books", hint: "The two SSBWINGS books" },
  { key: "mentors", label: "Mentors", hint: "Your Commanding Officers", editHref: "/admin/mentors" },
  { key: "four_forces", label: "Four Forces", hint: "Army/Navy/AF/ICG cards", editHref: "/admin/four-forces" },
  { key: "whyus", label: "Why Us", hint: "Heading + trust cards", editHref: "/admin/sections/whyus_items" },
  { key: "countdown", label: "Upcoming Events", hint: "Batch & exam countdown", editHref: "/admin/countdown" },
  { key: "stats", label: "Scoreboard + Recent Wins", editHref: "/admin/stats" },
  { key: "selection_tracker", label: "Selection Tracker", editHref: "/admin/selections" },
  { key: "journey", label: "5-Day SSB Journey", editHref: "/admin/sections/journey" },
  { key: "officer_banners", label: "Alumni in Uniform" },
  { key: "google_reviews", label: "Google Reviews", editHref: "/admin/google-reviews" },
  { key: "testimonials", label: "Testimonials", editHref: "/admin/testimonials" },
  { key: "instagram", label: "Instagram Feed" },
  { key: "faq", label: "FAQs", editHref: "/admin/faqs" },
  { key: "cta", label: "CTA Banner", editHref: "/admin/sections/cta" },
];

export type HomeOrderItem = { key: HomeSectionKey; enabled: boolean };

export const HOME_ORDER_DEFAULT: HomeOrderItem[] = HOME_SECTIONS.map((s) => ({ key: s.key, enabled: true }));

/** Merge a saved order with the registry: keeps the admin's order, drops keys
 *  that no longer exist, and appends any newly-added sections at the end. */
export function resolveHomeOrder(saved: unknown): HomeOrderItem[] {
  const list = Array.isArray(saved) ? (saved as HomeOrderItem[]) : [];
  const known = new Set(HOME_SECTIONS.map((s) => s.key));
  const seen = new Set<string>();
  const out: HomeOrderItem[] = [];
  for (const it of list) {
    if (!it || typeof it.key !== "string" || !known.has(it.key as HomeSectionKey) || seen.has(it.key)) continue;
    seen.add(it.key);
    out.push({ key: it.key as HomeSectionKey, enabled: it.enabled !== false });
  }
  for (const s of HOME_SECTIONS) if (!seen.has(s.key)) out.push({ key: s.key, enabled: true });
  return out;
}
