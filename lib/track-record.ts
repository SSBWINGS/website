/** The academy's headline numbers — recommendations and alumni — taken from
 *  one place: the "Recommendations" and "Alumni" cards in the admin's Stats.
 *
 *  Every sentence the code writes about them (footer, chatbot, search and AI
 *  descriptions) reads them from here, so updating the stat card updates the
 *  whole site and the figures can no longer disagree with each other.
 *
 *  Pure and dependency-free, so it can be unit-tested. */

type StatLike = { value?: unknown; label?: unknown; suffix?: unknown };

export type TrackRecord = { recommendations: number; alumni: number };

/** Used only when the stats are missing or unreadable. Keep in step with the
 *  STATS defaults in lib/data.ts. */
export const TRACK_RECORD_DEFAULT: TrackRecord = { recommendations: 760, alumni: 3500 };

const pick = (stats: StatLike[], pattern: RegExp, fallback: number): number => {
  const hit = stats.find((s) => typeof s?.label === "string" && pattern.test(s.label));
  const n = Number(hit?.value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export function trackRecord(stats: unknown): TrackRecord {
  const list = Array.isArray(stats) ? (stats as StatLike[]) : [];
  return {
    recommendations: pick(list, /recommend/i, TRACK_RECORD_DEFAULT.recommendations),
    alumni: pick(list, /alumni/i, TRACK_RECORD_DEFAULT.alumni),
  };
}

/** 3500 → "3,500+", the way the figures are written across the site. */
export const countText = (n: number) => `${Math.round(n).toLocaleString("en-IN")}+`;
