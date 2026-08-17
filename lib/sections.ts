import { SECTION_DEFAULTS } from "@/lib/section-defaults";
import { PAGE_HEROES } from "@/lib/pagehero-defaults";

export type FieldType = "text" | "rich" | "image" | "tags" | "repeater";
export type SectionField = {
  key: string;
  label: string;
  type: FieldType;
  itemFields?: SectionField[]; // for repeater
  itemLabel?: string; // singular noun for repeater items
};
export type SectionDef = {
  key: string;
  label: string;
  page: string;
  description: string;
  previewPath: string;
  fields: SectionField[];
};

const HERO_FIELDS: SectionField[] = [
  { key: "kicker", label: "Kicker (small heading)", type: "text" },
  { key: "title", label: "Title (HTML allowed — e.g. <span class=\"tricolour-text\">Word</span>)", type: "text" },
  { key: "subtitle", label: "Subtitle", type: "text" },
  { key: "image", label: "Background image", type: "image" },
  { key: "crumb", label: "Breadcrumb label", type: "text" },
];

const PAGE_LABEL: Record<string, string> = {
  about: "About", "ssb-process": "The 5-Day SSB", entries: "Entries", courses: "Courses",
  gallery: "Gallery", testimonials: "Testimonials", contact: "Contact", eligibility: "Eligibility Finder",
  "mock-tests": "Mock Tests", blog: "Blog", recommended: "Recommended", resources: "Resources",
};

// One editable hero per interior page.
const PAGE_HERO_SECTIONS: SectionDef[] = Object.keys(PAGE_HEROES).map((k) => ({
  key: `pagehero.${k}`,
  label: "Page Hero",
  page: PAGE_LABEL[k] ?? k,
  description: "The banner at the top of the page — kicker, title, subtitle and background image.",
  previewPath: `/${k === "recommended" || k === "resources" || k === "blog" || k === "eligibility" || k === "mock-tests" ? k : k}`,
  fields: HERO_FIELDS,
}));

/** Editable page sections backed by `site_content` documents. */
export const SECTIONS: SectionDef[] = [
  {
    key: "hero", label: "Hero", page: "Home",
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
    key: "story", label: "The Hard Truth", page: "Home",
    description: "The 'still short of officers' story block on the homepage.",
    previewPath: "/",
    fields: [
      { key: "kicker", label: "Kicker (small heading)", type: "text" },
      { key: "title", label: "Title (word-art supported)", type: "rich" },
      { key: "paragraph", label: "Paragraph", type: "rich" },
    ],
  },
  {
    key: "whyus", label: "Why Aspirants Trust Us", page: "Home",
    description: "Heading for the 'Why SSBWINGS' section.",
    previewPath: "/",
    fields: [
      { key: "kicker", label: "Kicker", type: "text" },
      { key: "title", label: "Title (word-art supported)", type: "rich" },
      { key: "subtitle", label: "Subtitle", type: "rich" },
    ],
  },
  {
    key: "air1", label: "AIR-1 Marquee", page: "Home",
    description: "The scrolling 'All India Rank 1' highlights band under the entries ticker.",
    previewPath: "/",
    fields: [{ key: "items", label: "AIR-1 highlights (comma-separated)", type: "tags" }],
  },
  {
    key: "cta", label: "Call-to-Action Banner", page: "Home",
    description: "The 'Your chest number is waiting' banner (appears on most pages).",
    previewPath: "/",
    fields: [
      { key: "eyebrow", label: "Eyebrow (top line)", type: "text" },
      { key: "title", label: "Title (word-art supported)", type: "rich" },
      { key: "paragraph", label: "Paragraph", type: "rich" },
    ],
  },
  ...PAGE_HERO_SECTIONS,
];

export const getSection = (key: string) => SECTIONS.find((s) => s.key === key);
export const sectionDefaults = (key: string): Record<string, unknown> => SECTION_DEFAULTS[key] ?? {};
