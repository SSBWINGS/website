import { createClient } from "@/lib/supabase/server";
import MockManager, { type MockQuestion } from "@/components/admin/MockManager";

export const dynamic = "force-dynamic";

export default async function MockAdmin() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mock_questions")
    .select("id, type, question, options, answer, explanation, difficulty, sort_order, published")
    .order("sort_order", { ascending: true });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Mock Tests</h1>
      <p className="mt-1 text-sm text-slate-500">Manage the free OIR quiz and SRT practice prompts shown on /mock-tests.</p>
      <MockManager initial={(data ?? []) as MockQuestion[]} />
    </div>
  );
}
