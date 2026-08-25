import { createClient } from "@/lib/supabase/server";
import { COURSES } from "@/lib/data";
import CoursesManager, { type CourseEdit } from "@/components/admin/CoursesManager";
import { coerceShape } from "@/lib/shape";

export const dynamic = "force-dynamic";

const defaults: CourseEdit[] = COURSES.map((c) => ({
  tag: c.tag, title: c.title, where: c.where, price: c.price ?? "", desc: c.desc, features: c.features,
}));

export default async function CoursesAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("draft").eq("key", "courses_cards").maybeSingle();
  const draft = (data?.draft as { items?: CourseEdit[] })?.items;
  const initial = draft && draft.length === defaults.length ? coerceShape(draft, defaults) : defaults;
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Course Cards</h1>
      <p className="mt-1 text-sm text-slate-500">Edit the text on each course tile. Payment links and styling stay safely in code.</p>
      <CoursesManager initial={initial} />
    </div>
  );
}
