export type SectionField = { key: string; label: string; type: "text" | "rich" };
export type SectionDef = {
  key: string;
  label: string;
  description: string;
  previewPath: string;
  fields: SectionField[];
};

/** Editable page sections backed by `site_content` documents.
 *  Add a new entry here + wire its public component via getPublished() to expand. */
export const SECTIONS: SectionDef[] = [
  {
    key: "hero",
    label: "Home — Hero",
    description: "The headline, badge, intro paragraph and rating at the top of the homepage.",
    previewPath: "/",
    fields: [
      { key: "badge", label: "Badge (small pill text)", type: "text" },
      { key: "headingLine1", label: "Heading — line 1", type: "text" },
      { key: "headingLine2", label: "Heading — line 2", type: "text" },
      { key: "paragraph", label: "Intro paragraph (fonts/colours/word-art)", type: "rich" },
      { key: "rating", label: "Rating line", type: "text" },
    ],
  },
];

export const getSection = (key: string) => SECTIONS.find((s) => s.key === key);
