import { createClient } from "@/lib/supabase/server";
import HeroCarouselManager from "@/components/admin/HeroCarouselManager";

export const dynamic = "force-dynamic";

export default async function HeroCarouselAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("draft").eq("key", "hero_carousel").maybeSingle();
  const initial = ((data?.draft as { images?: string[] })?.images) ?? [];
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Hero Carousel</h1>
      <p className="mt-1 text-sm text-slate-500">The rotating recommended-candidate photos at the top of the homepage.</p>
      <HeroCarouselManager initial={initial} />
    </div>
  );
}
