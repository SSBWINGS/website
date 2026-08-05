import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SITE } from "@/lib/data";

/** True when an authenticated admin is previewing drafts (cookie set by the editor). */
async function isPreview(): Promise<boolean> {
  try {
    const c = await cookies();
    return c.get("ssbw-preview")?.value === "1";
  } catch {
    return false;
  }
}

export type SiteSettings = typeof SITE;

/** Site-wide settings (contact, socials, footer), CMS-overridable with defaults. */
export async function getSettings(): Promise<SiteSettings> {
  return getPublished<SiteSettings>("settings", SITE);
}

/** tel: href from a display phone number. */
export const telHref = (p: string) => `tel:${(p || "").replace(/[^\d+]/g, "")}`;

/**
 * Content layer with graceful fallback.
 *
 * `getPublished(key, fallback)` returns the PUBLISHED document for a section
 * from Supabase, or the provided `fallback` (the built-in defaults in
 * lib/data.ts) when Supabase isn't configured or the row doesn't exist yet.
 *
 * This lets the public site keep working before the CMS is populated.
 */
export async function getPublished<T>(key: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    const supabase = await createClient();

    // Preview: an authenticated admin sees the DRAFT (RLS on site_content
    // restricts this to admins; everyone else silently gets published).
    if (await isPreview()) {
      const { data: draftRow } = await supabase
        .from("site_content")
        .select("draft")
        .eq("key", key)
        .maybeSingle();
      if (draftRow?.draft && Object.keys(draftRow.draft).length > 0) {
        return { ...fallback, ...(draftRow.draft as Partial<T>) } as T;
      }
    }

    const { data, error } = await supabase
      .from("published_content")
      .select("published")
      .eq("key", key)
      .maybeSingle();
    if (error || !data?.published || Object.keys(data.published).length === 0) {
      return fallback;
    }
    return { ...fallback, ...(data.published as Partial<T>) } as T;
  } catch {
    return fallback;
  }
}

/** Fetch a published collection view (e.g. 'published_candidates'), else fallback. */
export async function getCollection<T>(view: string, fallback: T[]): Promise<T[]> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from(view).select("*").order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallback;
    return data as T[];
  } catch {
    return fallback;
  }
}
