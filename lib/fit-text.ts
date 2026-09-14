/** Sizing for a headline whose lines must each stay on one line, all at one
 *  shared size — the largest that lets the longest line fit.
 *
 *  The browser measures the real text once it can (fitFontPx). Until then —
 *  the server render and the first paint — an estimate from the characters
 *  themselves (estimateFitCqw) gets the size close, so the headline neither
 *  wraps nor visibly jumps when the measurement lands.
 *
 *  Pure and dependency-free, so it can be unit-tested. */

/** Advance widths, in em, of Barlow Condensed ExtraBold capitals at the
 *  headline's tracking — measured in the browser. */
const EM: Record<string, number> = {
  A: 0.508, B: 0.469, C: 0.463, D: 0.472, E: 0.434, F: 0.42, G: 0.466, H: 0.476, I: 0.228,
  J: 0.455, K: 0.498, L: 0.43, M: 0.551, N: 0.515, O: 0.472, P: 0.467, Q: 0.46, R: 0.474,
  S: 0.447, T: 0.478, U: 0.473, V: 0.499, W: 0.7, X: 0.483, Y: 0.485, Z: 0.412,
  "0": 0.449, "1": 0.284, "2": 0.444, "3": 0.439, "4": 0.501, "5": 0.443, "6": 0.444,
  "7": 0.415, "8": 0.439, "9": 0.439,
  " ": 0.2, ".": 0.228, ",": 0.216, "'": 0.181, "’": 0.204, "!": 0.282, "?": 0.455,
  "-": 0.33, "&": 0.617, ":": 0.291, "|": 0.194,
};
const DEFAULT_EM = 0.47;
/** Emoji render from the system emoji font, roughly square. */
const EMOJI_EM = 1.1;

/** Estimated width of `text`, in em, as the headline would set it. */
export function estimateEm(text: string): number {
  let em = 0;
  for (const ch of text.toUpperCase()) {
    if (/[\p{M}\u200D\uFE0F]/u.test(ch)) continue; // joiners and modifiers take no space
    if (/\p{Extended_Pictographic}/u.test(ch)) em += EMOJI_EM;
    else if (/\s/.test(ch)) em += EM[" "];
    else em += EM[ch] ?? DEFAULT_EM;
  }
  return em;
}

/** Leaves a sliver of room so sub-pixel rounding never tips a line onto two. */
export const FIT_SLACK = 0.97;

/** First-paint size, in cqw (percent of the container's width), at which the
 *  widest line fills the container. Null when there is nothing to fit. */
export function estimateFitCqw(lines: string[]): number | null {
  const widest = Math.max(0, ...lines.map(estimateEm));
  return widest > 0 ? Math.floor((100 / widest) * FIT_SLACK * 1000) / 1000 : null;
}

/** Exact size, in px, from the lines' real widths measured at `atPx`: text
 *  width grows in proportion to font size, so one measurement is enough. */
export function fitFontPx(containerPx: number, widths: number[], atPx: number): number | null {
  const widest = Math.max(0, ...widths);
  if (!(containerPx > 0) || !(widest > 0) || !(atPx > 0)) return null;
  return Math.floor(((containerPx * atPx) / widest) * FIT_SLACK * 100) / 100;
}
