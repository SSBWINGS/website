import { createClient } from "@/lib/supabase/server";
import HeroCarouselManager from "@/components/admin/HeroCarouselManager";

export const dynamic = "force-dynamic";

export default async function HeroCarouselAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("draft").eq("key", "hero_carousel").maybeSingle();
  const custom = ((data?.draft as { images?: string[] })?.images) ?? [];

  // If no custom list is set, show what the hero is ACTUALLY displaying right now
  // (the latest recommended candidates) so the admin can see & customise them.
  let initial = custom;
  let auto = false;
  if (initial.length === 0) {
    const { data: cands } = await supabase
      .from("published_candidates")
      .select("image_path")
      .order("recommended_on", { ascending: false, nullsFirst: false })
      .order("sort_order", { ascending: true })
      .limit(10);
    initial = (cands ?? []).map((c: { image_path: string }) => c.image_path).filter(Boolean);
    auto = true;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Hero Carousel</h1>
      <p className="mt-1 text-sm text-slate-500">The rotating recommended-candidate photos at the top of the homepage.</p>
      <HeroCarouselManager initial={initial} auto={auto} />
    </div>
  );
}
