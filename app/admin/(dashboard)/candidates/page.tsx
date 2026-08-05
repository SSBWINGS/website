import { createClient } from "@/lib/supabase/server";
import CandidatesManager, { type Candidate } from "@/components/admin/CandidatesManager";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recommended_candidates")
    .select("id, name, exam, image_path, sort_order, published")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Recommended Candidates</h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage the Wall of Honour. Add a photo, name and entry — changes appear on the public site immediately.
      </p>
      <CandidatesManager initial={(data as Candidate[]) ?? []} />
    </div>
  );
}
