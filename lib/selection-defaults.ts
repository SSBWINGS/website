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
