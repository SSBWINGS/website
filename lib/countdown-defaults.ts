export type CountdownItem = { label: string; date: string; kind?: "batch" | "exam"; bg?: string; fg?: string };
export type CountdownDoc = {
  kicker: string;
  heading: string;
  /** Section background colour. */
  bg?: string;
  /** Colour for ALL text in the section (heading + card numbers/labels).
   *  A card's own `fg` overrides this for that card. */
  textColor?: string;
  /** Kicker colour (defaults to the brand gold). */
  kickerColor?: string;
  items: CountdownItem[];
};

/** Fallback shown before the CMS is populated. Dates are ISO (YYYY-MM-DD). */
export const COUNTDOWN: CountdownDoc = {
  kicker: "Mark your calendar",
  heading: "Countdown to your next milestone",
  bg: "#0a1524",
  textColor: "#ffffff",
  kickerColor: "#f2d519",
  items: [
    { label: "Next SSB Batch", date: "2026-09-01", kind: "batch" },
    { label: "AFCAT 2 2026", date: "2026-08-30", kind: "exam" },
    { label: "CDS II 2026 Exam", date: "2026-09-13", kind: "exam" },
    { label: "NDA II 2026 Exam", date: "2026-09-14", kind: "exam" },
  ],
};
