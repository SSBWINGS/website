import { createClient } from "@/lib/supabase/server";
import { AIR1_IMAGES } from "@/lib/homepage-defaults";
import { asArray } from "@/lib/shape";
import ImageListManager from "@/components/admin/ImageListManager";

export const dynamic = "force-dynamic";

export default async function Air1Admin() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("draft").eq("key", "air1_images").maybeSingle();
  const saved = asArray<string>((data?.draft as { images?: string[] })?.images);
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">AIR-1 Marquee</h1>
      <p className="mt-1 text-sm text-slate-500">The scrolling All India Rank holder cards on the homepage.</p>
      <ImageListManager
        initial={saved.length ? saved : AIR1_IMAGES}
        docKey="air1_images"
        label="AIR-1 Marquee"
        folder="air1"
        shape="tall"
        note="These scroll continuously below the entries marquee."
      />
    </div>
  );
}
