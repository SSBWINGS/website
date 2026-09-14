/** The hero heading's size controls, and the text helpers the admin's hero
 *  wireframe uses. Shared by the public hero and the admin editor.
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

// ── Wireframe text helpers ─────────────────────────────────────────────────

const ENTITIES: Record<string, string> = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'" };

/** Rich-text HTML as plain text, one entry per visual line block: every <br>,
 *  and the end of every <div>, <p>, <li> or heading, starts a new block. */
export function richTextBlocks(html: string): string[] {
  return (html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|p|li|h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(nbsp|amp|lt|gt|quot|#39|apos);/g, (_, e: string) => ENTITIES[e])
    .split("\n")
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** How the rich text is aligned, from the alignment the editor applied. */
export function richTextAlign(html: string): "left" | "center" | "right" {
  const m = (html || "").match(/text-align:\s*(left|center|right)/i);
  return m ? (m[1].toLowerCase() as "left" | "center" | "right") : "left";
}
