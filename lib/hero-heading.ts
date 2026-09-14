/** The hero heading's size controls. Shared by the public hero and the
 *  admin editor.
 *
 *  Pure and dependency-free, so it can be unit-tested. */

/** Heading size, as a percentage of the design size. One value for phones,
 *  one for tablets and desktops, so a long heading can be made smaller on a
 *  phone without shrinking it on a laptop. */
export const HEADING_SIZE = { min: 50, max: 150, step: 5, default: 100 } as const;

/** The design size of the heading at 100% (Tailwind text-4xl / 5xl / 6xl in
 *  globals.css @theme), in rem. */
export const HEADING_REM = { phone: 2.5, tablet: 3.25, desktop: 4 } as const;

/** Any stored value as a usable percentage: a whole number on the step, within
 *  range. Blank, missing or nonsense values give the design size. */
export function headingPercent(v: unknown): number {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() ? Number(v) : NaN;
  if (!Number.isFinite(n)) return HEADING_SIZE.default;
  const clamped = Math.min(HEADING_SIZE.max, Math.max(HEADING_SIZE.min, n));
  return Math.round(clamped / HEADING_SIZE.step) * HEADING_SIZE.step;
}

/** One step bigger or smaller, stopping at the ends of the range. */
export const stepHeading = (v: unknown, dir: 1 | -1) => headingPercent(headingPercent(v) + dir * HEADING_SIZE.step);

/** How the heading lines sit in the hero's text column. Only the text moves;
 *  on a desktop the photo beside it stays where it is. */
export const HEADING_ALIGNS = ["left", "center", "right"] as const;
export type HeadingAlign = (typeof HEADING_ALIGNS)[number];

/** Any stored value as a valid alignment; anything else means left. */
export const headingAlign = (v: unknown): HeadingAlign =>
  (HEADING_ALIGNS as readonly unknown[]).includes(v) ? (v as HeadingAlign) : "left";
