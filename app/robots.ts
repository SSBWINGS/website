import type { MetadataRoute } from "next";

const BASE = "https://www.ssbwings.com";

/** Private areas no crawler should index: the API and the CMS. */
const PRIVATE = ["/api/", "/admin/"];

/** Crawlers behind AI answer engines. Named explicitly so being cited by
 *  ChatGPT, Claude, Perplexity or Gemini survives any future tightening of the
 *  catch-all rule below. */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
