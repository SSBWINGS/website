import { SECTION_DEFAULTS } from "@/lib/section-defaults";

export type SectionField = { key: string; label: string; type: "text" | "rich" };
export type SectionDef = {
  key: string;
  label: string;
  description: string;
  previewPath: string;
  fields: SectionField[];
};

/** Editable page sections backed by `site_content` documents.
 *  Add an entry here + wire its public component via getPublished() to expand. */
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
  {
    key: "story",
    label: "Home — The Hard Truth",
    description: "The 'still short of officers' story block on the homepage.",
    previewPath: "/",
    fields: [
      { key: "kicker", label: "Kicker (small heading)", type: "text" },
      { key: "title", label: "Title (word-art supported)", type: "rich" },
      { key: "paragraph", label: "Paragraph", type: "rich" },
    ],
  },
  {
    key: "services",
    label: "Home — Four Forces",
    description: "Heading for the Army/Navy/Air Force/Coast Guard section.",
    previewPath: "/",
    fields: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "title", label: "Title (word-art supported)", type: "rich" },
      { key: "subtitle", label: "Subtitle", type: "rich" },
    ],
  },
  {
    key: "whyus",
    label: "Home — Why Aspirants Trust Us",
    description: "Heading for the 'Why SSBWINGS' section.",
    previewPath: "/",
    fields: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "title", label: "Title (word-art supported)", type: "rich" },
      { key: "subtitle", label: "Subtitle", type: "rich" },
    ],
  },
  {
    key: "cta",
    label: "Call-to-Action Banner",
    description: "The 'Your chest number is waiting' banner (appears on most pages).",
    previewPath: "/",
    fields: [
      { key: "eyebrow", label: "Eyebrow (top line)", type: "text" },
      { key: "title", label: "Title (word-art supported)", type: "rich" },
      { key: "paragraph", label: "Paragraph", type: "rich" },
    ],
  },
];

export const getSection = (key: string) => SECTIONS.find((s) => s.key === key);
export const sectionDefaults = (key: string) => SECTION_DEFAULTS[key] ?? {};
