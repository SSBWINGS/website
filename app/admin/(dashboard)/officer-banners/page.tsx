import { createClient } from "@/lib/supabase/server";
import { OFFICER_BANNERS } from "@/lib/data";
import { asArray } from "@/lib/shape";
import ImageListManager from "@/components/admin/ImageListManager";

export const dynamic = "force-dynamic";

export default async function OfficerBannersAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("draft").eq("key", "officer_banners").maybeSingle();
  const saved = asArray<string>((data?.draft as { images?: string[] })?.images);
  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900">Now Serving — Alumni in Uniform</h1>
      <p className="mt-1 text-sm text-slate-500">
        The two scrolling rows of commissioned alumni. One list feeds both the <b>homepage</b> and the
        <b> Success Stories / Wall of Honour</b> page — edit here and both update together.
      </p>
      <ImageListManager
        initial={saved.length ? saved : OFFICER_BANNERS}
        docKey="officer_banners"
        label="Now Serving — Alumni Banners"
        folder="officers"
        shape="wide"
        note="Use ← → to reorder and ✕ to remove. The list is split in half: the first half scrolls left, the second half scrolls right."
      />
    </div>
  );
}
