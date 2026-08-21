import { createClient } from "@/lib/supabase/server";
import { HERO_MAIN_PHOTOS } from "@/components/Hero";
import HeroCarouselManager from "@/components/admin/HeroCarouselManager";

export const dynamic = "force-dynamic";

export default async function HeroCarouselAdmin() {
  const supabase = await createClient();

  const [{ data: small }, { data: main }] = await Promise.all([
    supabase.from("site_content").select("draft").eq("key", "hero_carousel").maybeSingle(),
    supabase.from("site_content").select("draft").eq("key", "hero_main_carousel").maybeSingle(),
  ]);

  // Small frame: if no custom list, show what the hero is actually displaying
  // right now (the latest recommended candidates) so it's visible & manageable.
  let smallImages = ((small?.draft as { images?: string[] })?.images) ?? [];
  let smallAuto = false;
  if (smallImages.length === 0) {
    const { data: cands } = await supabase
      .from("published_candidates")
      .select("image_path")
      .order("recommended_on", { ascending: false, nullsFirst: false })
      .order("sort_order", { ascending: true })
      .limit(10);
    smallImages = (cands ?? []).map((c: { image_path: string }) => c.image_path).filter(Boolean);
    smallAuto = true;
  }

  const mainImages = ((main?.draft as { images?: string[] })?.images) ?? HERO_MAIN_PHOTOS;

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hero Carousels</h1>
        <p className="mt-1 text-sm text-slate-500">The rotating photos at the top of the homepage.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Main (large) photo</h2>
        <p className="mt-1 text-sm text-slate-500">The big tilted frame. Add several photos and they rotate automatically.</p>
        <HeroCarouselManager initial={mainImages} docKey="hero_main_carousel" label="Hero Main Carousel" />
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-900">Small (overlapping) photo</h2>
        <p className="mt-1 text-sm text-slate-500">The smaller frame showing recommended candidates.</p>
        <HeroCarouselManager initial={smallImages} auto={smallAuto} docKey="hero_carousel" label="Hero Carousel" />
      </section>
    </div>
  );
}
