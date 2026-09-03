export type Selection = {
  id?: string;
  year: number;
  exam: string;
  center: string | null;
  count: number;
  sort_order?: number;
};

/** Fallback shown before the CMS is populated. */
export const SELECTIONS: Selection[] = [
  { year: 2025, exam: "CDS OTA", center: "Allahabad", count: 18 },
  { year: 2025, exam: "AFCAT", center: "Dehradun", count: 12 },
  { year: 2025, exam: "NDA", center: "Bhopal", count: 15 },
  { year: 2024, exam: "CDS IMA", center: "Bangalore", count: 9 },
  { year: 2024, exam: "AFCAT", center: "Mysore", count: 11 },
  { year: 2024, exam: "TES", center: "Allahabad", count: 7 },
];

/** Every text on the "Proven Results" section — all editable from the CMS.
 *  A blank number override means "calculate it from the tracker rows". */
export type TrackerDoc = {
  kicker: string;
  heading: string;
  subtitle: string;
  totalLabel: string;
  totalOverride: string;
  yearsLabel: string;
  yearsOverride: string;
  centresLabel: string;
  centresOverride: string;
  barsHeading: string;
};

export const TRACKER: TrackerDoc = {
  kicker: "Proven results",
  heading: "Our Selection Tracker",
  subtitle: "Recommendations our aspirants have earned across all SSBs.",
  totalLabel: "Total recommendations",
  totalOverride: "",
  yearsLabel: "Years tracked",
  yearsOverride: "",
  centresLabel: "SSB centres cleared",
  centresOverride: "",
  barsHeading: "Recommendations by entry",
};
