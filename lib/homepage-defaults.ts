/** Plain data for the homepage sections — importable from server and client. */

/** Entries marquee: entry name + how many candidates were recommended in it. */
export type EntryCount = { entry: string; count: number };
export const ENTRY_COUNTS: EntryCount[] = [
  { entry: "NDA & NA", count: 175 },
  { entry: "CDS – OTA", count: 168 },
  { entry: "AFCAT", count: 125 },
  { entry: "CDS – IMA", count: 84 },
  { entry: "10+2 TES", count: 55 },
  { entry: "SSC Tech", count: 48 },
  { entry: "Navy SSC", count: 32 },
  { entry: "NCC Special", count: 28 },
  { entry: "10+2 B.Tech (Navy)", count: 22 },
  { entry: "ICG Asst Commandant", count: 18 },
  { entry: "TGC", count: 15 },
  { entry: "ACC / SCO", count: 12 },
];

/** AIR-1 achievement cards shown in the second marquee. */
export const AIR1_IMAGES: string[] = Array.from({ length: 15 }, (_, i) => `/images/campus/images-${i}.jpg`);

/** Campus gallery images. */
export const CAMPUS_IMAGES: string[] = Array.from({ length: 12 }, (_, i) => `/images/campus/imagestwo-${i + 15}.jpg`);

/** Display switches for the courses section. */
export type CoursesOptions = { showPrices: string };
export const COURSES_OPTIONS: CoursesOptions = { showPrices: "on" };

/** Hostel / facilities note under the courses section. */
export const COURSES_NOTE =
  "We offer boarding and lodging facilities on first come first serve basis";

/** Google reviews — the admin pastes review links; name/photo/text are editable. */
export type GoogleReview = {
  url: string;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
  date?: string;
};
export const GOOGLE_REVIEWS: GoogleReview[] = [];

/** Google Business profile link for the "see all reviews" button. */
export const GOOGLE_PLACE_URL =
  "https://www.google.com/maps/place/SSBWINGS/@28.6150754,77.3646969,17z";

/** The enquiry popup that opens shortly after the site loads. */
export type EnquiryPopupDoc = {
  enabled: string;      // "on" | "off"
  title: string;
  subtitle: string;
  body: string;         // HTML
  delayMs: string;
};
export const ENQUIRY_POPUP: EnquiryPopupDoc = {
  enabled: "on",
  title: "Book Free Counselling",
  subtitle: "Talk to a mentor, not a salesperson",
  body: "New batches open every month — seats are limited. Share your details and we'll map your entry & timeline, free of cost.",
  delayMs: "900",
};
