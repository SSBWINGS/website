/** Builders for schema.org structured data (JSON-LD).
 *
 *  Invisible to visitors, read by search engines and AI answer engines. Pure
 *  data only — the <JsonLd> component does the rendering and escaping. */

export const SITE_URL = "https://www.ssbwings.com";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path === "/" ? "" : path}`);

/** Strip tags and collapse whitespace — schema text fields must be plain. */
export function plainText(html: string): string {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Home › Section › Page trail. `items` excludes Home, which is always first. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

/** Question-and-answer markup. The format answer engines lift answers from. */
export function faqLd(items: { question: string; answer: string }[]) {
  const clean = items
    .map((f) => ({ q: plainText(f.question), a: plainText(f.answer) }))
    .filter((f) => f.q && f.a);
  if (!clean.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: clean.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

const CAMPUS = {
  "@type": "Place",
  name: "SSBWINGS, Sector 62, Noida",
  address: {
    "@type": "PostalAddress",
    streetAddress: "C-56/43, Institutional Area, Phase 2, Sector 62",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201309",
    addressCountry: "IN",
  },
};

/** Where a course runs. "blended" covers the entry pages, whose coaching is
 *  offered both on campus and online. */
function instancesFor(mode: "online" | "onsite" | "blended") {
  const onsite = { "@type": "CourseInstance", courseMode: "onsite", location: CAMPUS };
  const online = { "@type": "CourseInstance", courseMode: "online" };
  return mode === "online" ? [online] : mode === "onsite" ? [onsite] : [onsite, online];
}

/** A coaching course, attributed to the academy. Prices are deliberately left
 *  out: the admin can hide them on the site, and structured data must never
 *  advertise a price the page itself does not show. */
export function courseLd(opts: {
  name: string;
  description: string;
  path: string;
  mode?: "online" | "onsite" | "blended";
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: abs(opts.path),
    inLanguage: "en-IN",
    ...(opts.keywords?.length ? { keywords: opts.keywords.join(", ") } : {}),
    provider: { "@type": "EducationalOrganization", "@id": ORG_ID, name: "SSBWINGS", sameAs: SITE_URL },
    hasCourseInstance: instancesFor(opts.mode ?? "blended"),
  };
}

/** A web page node, linked to the site and the organisation. */
export function webPageLd(opts: { name: string; description: string; path: string; type?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    "@id": `${abs(opts.path)}#webpage`,
    url: abs(opts.path),
    name: opts.name,
    description: opts.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  };
}

/** Serialise for a <script> tag. `<` is escaped so text from the CMS can never
 *  close the script element early and inject markup. */
export function serializeLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
