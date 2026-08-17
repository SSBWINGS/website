import { createClient } from "@/lib/supabase/server";
import { FOUR_FORCES, type FourForcesDoc } from "@/lib/four-forces";
import FourForcesManager from "@/components/admin/FourForcesManager";

export const dynamic = "force-dynamic";

export default async function FourForcesAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("draft").eq("key", "four_forces").maybeSingle();
  const initial = (data?.draft && Object.keys(data.draft).length ? data.draft : FOUR_FORCES) as FourForcesDoc;
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Four Forces · One Dream</h1>
      <p className="mt-1 text-sm text-slate-500">Edit the heading and each service card — name, motto, text, tags, CTA link and background image.</p>
      <FourForcesManager initial={initial} />
    </div>
  );
}
