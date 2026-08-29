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
  academies: "Academies", medical: "Medical Process",
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

/** Every homepage section heading is editable under `heading.<key>`. */
const HEADING_KEYS: { key: string; label: string }[] = [
  { key: "wall", label: "Wall of Honour" },
  { key: "courses", label: "Courses" },
  { key: "campus", label: "Campus Gallery" },
  { key: "books", label: "Books" },
  { key: "mentors", label: "Mentors" },
  { key: "stats", label: "Scoreboard" },
  { key: "testimonials", label: "Testimonials" },
  { key: "videos", label: "YouTube Videos" },
  { key: "google_reviews", label: "Google Reviews" },
];

const HEADING_SECTIONS: SectionDef[] = HEADING_KEYS.map((h) => ({
  key: `heading.${h.key}`,
  label: `${h.label} — Heading`,
  page: "Home",
  description: "Kicker, title and subtitle for this section.",
  previewPath: "/",
  fields: [
    { key: "kicker", label: "Kicker", type: "text" },
    KICKER_SIZE_FIELD,
    { key: "title", label: "Title (HTML allowed)", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
  ],
}));

/** Editable page sections backed by `site_content` documents. */
export const SECTIONS: SectionDef[] = [
  {
    key: "hero", label: "Hero", page: "Home",
    description: "Every text in the homepage hero — badge, both heading lines, the animated typewriter words, paragraph, rating line and both buttons.",
    previewPath: "/",
    fields: [
      { key: "badge", label: "Badge (small pill text)", type: "text" },
      { key: "headingLine1", label: "Heading — line 1", type: "text" },
      { key: "headingLine2", label: "Heading — line 2", type: "text" },
      { key: "typedPrefix", label: "Animated line — fixed start (e.g. \"Become \")", type: "text" },
      { key: "typedWords", label: "Animated line — rotating words (comma-separated)", type: "tags" },
      { key: "paragraph", label: "Intro paragraph (fonts/colours/word-art)", type: "rich" },
      { key: "rating", label: "Rating line (HTML allowed)", type: "text" },
      { key: "primaryCta", label: "Primary button — label", type: "text" },
      { key: "primaryCtaHref", label: "Primary button — link", type: "text" },
      { key: "secondaryCta", label: "Secondary button — label", type: "text" },
      { key: "secondaryCtaHref", label: "Secondary button — link", type: "text" },
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
  {
    key: "academies", label: "Academies Content", page: "Academies",
    description: "Heading plus every academy — photo, motto, intro, course table and highlights.",
    previewPath: "/academies",
    fields: [
      { key: "kicker", label: "Kicker", type: "text" },
      KICKER_SIZE_FIELD,
      { key: "title", label: "Title (HTML allowed)", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "text" },
      { key: "items", label: "Academies", type: "repeater", itemLabel: "Academy", itemFields: [
        { key: "short", label: "Short name (IMA, INA, AFA…)", type: "text" },
        { key: "name", label: "Full name", type: "text" },
        { key: "motto", label: "Motto", type: "text" },
        { key: "location", label: "Location", type: "text" },
        { key: "service", label: "Service & commission", type: "text" },
        { key: "established", label: "Established", type: "text" },
        { key: "image", label: "Photo", type: "image" },
        { key: "intro", label: "Introduction", type: "rich" },
        { key: "courses", label: "Courses", type: "repeater", itemLabel: "Course", itemFields: [
          { key: "name", label: "Course / entry", type: "text" },
          { key: "duration", label: "Training duration", type: "text" },
          { key: "who", label: "Who trains here", type: "text" },
        ] },
        { key: "highlights", label: "Highlights", type: "tags" },
      ] },
    ],
  },
  {
    key: "medical", label: "Medical Content", page: "Medical Process",
    description: "The full medical page — board stages, academy standards, rejections, appeals and FAQs.",
    previewPath: "/medical",
    fields: [
      { key: "kicker", label: "Kicker", type: "text" },
      KICKER_SIZE_FIELD,
      { key: "processTitle", label: "Process heading", type: "text" },
      { key: "processIntro", label: "Process intro", type: "text" },
      { key: "stages", label: "Board stages", type: "repeater", itemLabel: "Stage", itemFields: [
        { key: "icon", label: "Emoji / icon", type: "text" },
        { key: "step", label: "Step label (e.g. Day 1)", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "detail", label: "Detail", type: "rich" },
      ] },
      { key: "image1", label: "Photo 1", type: "image" },
      { key: "image2", label: "Photo 2", type: "image" },
      { key: "standardsTitle", label: "Standards heading", type: "text" },
      { key: "standardsIntro", label: "Standards intro", type: "text" },
      { key: "standards", label: "Standards table", type: "repeater", itemLabel: "Row", itemFields: [
        { key: "academy", label: "Academy / service", type: "text" },
        { key: "height", label: "Height", type: "text" },
        { key: "weight", label: "Weight", type: "text" },
        { key: "vision", label: "Vision", type: "text" },
        { key: "notes", label: "Notes", type: "text" },
      ] },
      { key: "commonTitle", label: "Common rejections heading", type: "text" },
      { key: "common", label: "Common rejection reasons", type: "tags" },
      { key: "appealTitle", label: "Appeal heading", type: "text" },
      { key: "appealBody", label: "Appeal explanation", type: "rich" },
      { key: "faqs", label: "Medical FAQs", type: "repeater", itemLabel: "FAQ", itemFields: [
        { key: "q", label: "Question", type: "text" },
        { key: "a", label: "Answer", type: "rich" },
      ] },
    ],
  },
  {
    key: "entry_counts", label: "Entries Marquee", page: "Home",
    description: "Entries shown in the scrolling band and how many were recommended in each.",
    previewPath: "/",
    fields: [{ key: "items", label: "Entries", type: "repeater", itemLabel: "Entry", itemFields: [
      { key: "entry", label: "Entry name", type: "text" },
      { key: "count", label: "Recommended count", type: "text" },
    ] }],
  },
  {
    key: "courses_note", label: "Courses — Facilities Note", page: "Home",
    description: "The line under the course cards about boarding & lodging.",
    previewPath: "/",
    fields: [{ key: "text", label: "Note", type: "rich" }],
  },
  {
    key: "enquiry_popup", label: "Enquiry Popup", page: "Site-wide",
    description: "The pop-up that greets visitors shortly after the site loads.",
    previewPath: "/",
    fields: [
      { key: "enabled", label: "Show the popup", type: "select",
        options: [{ value: "on", label: "On" }, { value: "off", label: "Off" }] },
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Sub-line", type: "text" },
      { key: "body", label: "Message", type: "rich" },
      { key: "delayMs", label: "Delay before it opens (milliseconds)", type: "text" },
    ],
  },
  ...HEADING_SECTIONS,
  ...PAGE_HERO_SECTIONS,
];

export const getSection = (key: string) => SECTIONS.find((s) => s.key === key);
export const sectionDefaults = (key: string): Record<string, unknown> => SECTION_DEFAULTS[key] ?? {};
