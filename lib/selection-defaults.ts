export type Selection = {
  id?: string;
  year: number;
  exam: string;
  center: string | null;
  count: number;
  sort_order?: number;
};

/**
 * No built-in rows.
 *
 * This section reports real recommendations, so it must never invent them —
 * an empty list hides the whole section until the academy enters its own data
 * under Admin → Selection Tracker.
 */
export const SELECTIONS: Selection[] = [];

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
