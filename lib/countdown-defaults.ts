export type CountdownItem = { label: string; date: string; kind?: "batch" | "exam" };
export type CountdownDoc = { heading: string; items: CountdownItem[] };

/** Fallback shown before the CMS is populated. Dates are ISO (YYYY-MM-DD). */
export const COUNTDOWN: CountdownDoc = {
  heading: "Countdown to your next milestone",
  items: [
    { label: "Next SSB Batch", date: "2026-09-01", kind: "batch" },
    { label: "AFCAT 2 2026", date: "2026-08-30", kind: "exam" },
    { label: "CDS II 2026 Exam", date: "2026-09-13", kind: "exam" },
    { label: "NDA II 2026 Exam", date: "2026-09-14", kind: "exam" },
  ],
};
