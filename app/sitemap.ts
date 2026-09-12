import type { MetadataRoute } from "next";
import { SEO_PAGES } from "@/lib/seo-pages";
import { ENTRY_PAGES } from "@/lib/entry-pages";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const BASE = "https://www.ssbwings.com";

// Re-generated hourly so a newly published blog post reaches the sitemap
// without waiting for the next deploy.
export const revalidate = 3600;

/** How each kind of page should be weighted. The homepage and the pages that
 *  answer high-intent searches ("NDA SSB coaching", "SSB eligibility") lead. */
const WEIGHT: Record<string, { priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = {
  home: { priority: 1, changeFrequency: "weekly" },
  courses: { priority: 0.9, changeFrequency: "weekly" },
  entries: { priority: 0.9, changeFrequency: "monthly" },
  eligibility: { priority: 0.9, changeFrequency: "monthly" },
  contact: { priority: 0.8, changeFrequency: "yearly" },
  blog: { priority: 0.8, changeFrequency: "daily" },
  recommended: { priority: 0.7, changeFrequency: "weekly" },
  gallery: { priority: 0.6, changeFrequency: "monthly" },
  testimonials: { priority: 0.7, changeFrequency: "monthly" },
};

async function blogPosts(): Promise<{ slug: string; published_at: string | null }[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data } = await createPublicClient()
      .from("published_posts")
      .select("slug, published_at")
      .order("published_at", { ascending: false });
    return (data ?? []) as { slug: string; published_at: string | null }[];
  } catch {
    // A database hiccup must never take the whole sitemap down.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = SEO_PAGES.map((p) => ({
    url: `${BASE}${p.path === "/" ? "" : p.path}`,
    lastModified: now,
    changeFrequency: WEIGHT[p.key]?.changeFrequency ?? "monthly",
    priority: WEIGHT[p.key]?.priority ?? 0.7,
  }));

  // One page per officer entry — each targets its own search terms.
  const entries: MetadataRoute.Sitemap = ENTRY_PAGES.map((p) => ({
    url: `${BASE}/entries/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p.indicative ? 0.5 : 0.8,
  }));

  const posts: MetadataRoute.Sitemap = (await blogPosts()).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // llms.txt is deliberately absent: sitemaps list pages meant to rank, and
  // AI crawlers find /llms.txt by convention at the root.
  return [...pages, ...entries, ...posts];
}
