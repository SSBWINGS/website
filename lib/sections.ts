import { SECTION_DEFAULTS } from "@/lib/section-defaults";
import { PAGE_HEROES } from "@/lib/pagehero-defaults";

export type FieldType = "text" | "rich" | "image" | "tags" | "repeater" | "select";
export type SectionField = {
  key: string;
  label: string;
  type: FieldType;
  itemFields?: SectionField[]; // for repeater
  itemLabel?: string; // singular noun for repeater items
  options?: { value: string; label: string }[]; // for select
};

/** Reusable kicker font-size picker. */
export const KICKER_SIZE_FIELD: SectionField = {
  key: "kickerSize",
  label: "Kicker font size",
  type: "select",
  options: [
    { value: "xs", label: "Extra small" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Default" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra large" },
  ],
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
  KICKER_SIZE_FIELD,
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
      KICKER_SIZE_FIELD,
      { key: "title", label: "Title (word-art supported)", type: "rich" },
      { key: "paragraph", label: "Paragraph", type: "rich" },
    ],
  },
  {
    key: "story_gaps", label: "The Hard Truth — Cards", page: "Home",
    description: "The three 'why aspirants fail' cards (icon, title and text).",
    previewPath: "/",
    fields: [{ key: "items", label: "Cards", type: "repeater", itemLabel: "Card", itemFields: [
      { key: "icon", label: "Emoji / icon", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "rich" },
    ] }],
  },
  {
    key: "recent_wins", label: "Recent Wins Marquee", page: "Home",
    description: "The scrolling ticker under 'Proof, Not Promises'.",
    previewPath: "/",
    fields: [{ key: "items", label: "Ticker lines", type: "repeater", itemLabel: "Line", itemFields: [
      { key: "text", label: "Line text", type: "text" },
    ] }],
  },
  {
    key: "preloader", label: "Preloader", page: "Site-wide",
    description: "The loading screen shown when the site first opens.",
    previewPath: "/",
    fields: [{
      key: "lottie", label: "Aeroplane animation", type: "select",
      options: [
        { value: "on", label: "On — show the aeroplane animation" },
        { value: "off", label: "Off — show only the SSBWINGS name" },
      ],
    }],
  },
  {
    key: "whyus", label: "Why Aspirants Trust Us", page: "Home",
    description: "Heading for the 'Why SSBWINGS' section.",
    previewPath: "/",
    fields: [
      { key: "kicker", label: "Kicker", type: "text" },
      KICKER_SIZE_FIELD,
      { key: "title", label: "Title (word-art supported)", type: "rich" },
      { key: "subtitle", label: "Subtitle", type: "rich" },
    ],
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
  {
    key: "whyus_items", label: "Why Us — Cards", page: "Home",
    description: "The six 'Why aspirants trust us' cards.", previewPath: "/",
    fields: [{ key: "items", label: "Cards", type: "repeater", itemLabel: "Card", itemFields: [
      { key: "icon", label: "Icon (emoji)", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "rich" },
    ] }],
  },
  {
    key: "journey", label: "5-Day SSB Journey", page: "Home",
    description: "The day-by-day SSB timeline (also on the 5-Day SSB page).", previewPath: "/",
    fields: [{ key: "items", label: "Days", type: "repeater", itemLabel: "Day", itemFields: [
      { key: "day", label: "Day label (e.g. Day 1)", type: "text" },
      { key: "code", label: "Code (e.g. Screening)", type: "text" },
      { key: "service", label: "Colour theme (army/navy/airforce)", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "text" },
      { key: "brief", label: "Brief", type: "rich" },
      { key: "drill", label: "Our Drill", type: "rich" },
      { key: "tests", label: "Tests of the day", type: "repeater", itemLabel: "Test", itemFields: [
        { key: "name", label: "Test name", type: "text" },
        { key: "detail", label: "Detail", type: "text" },
      ] },
    ] }],
  },
  {
    key: "about_mission", label: "Mission", page: "About",
    description: "The 'From Aspirant to Officer' intro block.", previewPath: "/about",
    fields: [
      { key: "kicker", label: "Kicker", type: "text" },
      KICKER_SIZE_FIELD,
      { key: "title", label: "Title (HTML allowed)", type: "text" },
      { key: "body", label: "Body paragraphs", type: "rich" },
      { key: "image", label: "Photo", type: "image" },
    ],
  },
  {
    key: "about_values", label: "Core Values", page: "About",
    description: "The three 'What we stand for' value cards.", previewPath: "/about",
    fields: [{ key: "items", label: "Values", type: "repeater", itemLabel: "Value", itemFields: [
      { key: "icon", label: "Icon (emoji)", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "text" },
    ] }],
  },
  {
    key: "gateways", label: "Three Gateways", page: "Entries",
    description: "The 'Where do you stand today?' gateway cards.", previewPath: "/entries",
    fields: [{ key: "items", label: "Gateways", type: "repeater", itemLabel: "Gateway", itemFields: [
      { key: "icon", label: "Icon (emoji)", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "rich" },
      { key: "tags", label: "Tags", type: "tags" },
    ] }],
  },
  {
    key: "join_routes", label: "Entry Routes by Service", page: "Entries",
    description: "Army/Navy/Air Force/Coast Guard entry-route cards.", previewPath: "/entries",
    fields: [{ key: "items", label: "Services", type: "repeater", itemLabel: "Service", itemFields: [
      { key: "name", label: "Service name", type: "text" },
      { key: "motto", label: "Motto", type: "text" },
      { key: "intro", label: "Intro", type: "rich" },
      { key: "academy", label: "Academy", type: "text" },
      { key: "image", label: "Banner image", type: "image" },
      { key: "routes", label: "Routes", type: "repeater", itemLabel: "Route", itemFields: [
        { key: "name", label: "Route name", type: "text" },
        { key: "stage", label: "Stage (After 10+2 / After Graduation / For Serving Personnel)", type: "text" },
        { key: "who", label: "Who", type: "text" },
        { key: "how", label: "How", type: "text" },
        { key: "commission", label: "Commission", type: "text" },
      ] },
    ] }],
  },
  ...PAGE_HERO_SECTIONS,
];

export const getSection = (key: string) => SECTIONS.find((s) => s.key === key);
export const sectionDefaults = (key: string): Record<string, unknown> => SECTION_DEFAULTS[key] ?? {};
