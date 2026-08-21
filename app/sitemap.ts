import type { MetadataRoute } from "next";

const BASE = "https://www.ssbwings.com";
const ROUTES = ["", "/about", "/ssb-process", "/entries", "/eligibility", "/academies", "/medical", "/courses", "/mock-tests", "/resources", "/gallery", "/recommended", "/blog", "/testimonials", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.8,
  }));
}
