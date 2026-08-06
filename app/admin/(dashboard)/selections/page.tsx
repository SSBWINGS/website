import { createClient } from "@/lib/supabase/server";
import SelectionsManager from "@/components/admin/SelectionsManager";

export const dynamic = "force-dynamic";

export default async function SelectionsAdmin() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("selections")
    .select("id, year, exam, center, count, sort_order, published")
    .order("year", { ascending: false })
    .order("sort_order", { ascending: true });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Selection Tracker</h1>
      <p className="mt-1 text-sm text-slate-500">Year-wise recommendations by entry and SSB centre — powers the animated results section on the homepage.</p>
      <SelectionsManager initial={(data ?? []) as never} />
    </div>
  );
}
