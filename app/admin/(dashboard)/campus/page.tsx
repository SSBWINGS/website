import { createClient } from "@/lib/supabase/server";
import { CAMPUS_IMAGES } from "@/lib/homepage-defaults";
import { asArray } from "@/lib/shape";
import ImageListManager from "@/components/admin/ImageListManager";

export const dynamic = "force-dynamic";

export default async function CampusAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("draft").eq("key", "campus_images").maybeSingle();
  const saved = asArray<string>((data?.draft as { images?: string[] })?.images);
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Campus Gallery</h1>
      <p className="mt-1 text-sm text-slate-500">Photos of the campus shown on the homepage.</p>
      <ImageListManager
        initial={saved.length ? saved : CAMPUS_IMAGES}
        docKey="campus_images"
        label="Campus Gallery"
        folder="campus-gallery"
        note="Shown in a grid under the Courses section."
      />
    </div>
  );
}
