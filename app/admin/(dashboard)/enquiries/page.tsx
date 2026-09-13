import { createClient } from "@/lib/supabase/server";
import EnquiryInbox, { type Enquiry } from "@/components/admin/EnquiryInbox";
import { resolveContactForm } from "@/lib/form-defaults";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const supabase = await createClient();
  const [{ data }, { data: formRow }] = await Promise.all([
    supabase
      .from("enquiries")
      .select("id, name, email, phone, entry, message, source, status, notes, meta, created_at")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("site_content").select("published").eq("key", "contact_form").maybeSingle(),
  ]);
  // Show each answer under the name the admin gave that field on the form.
  const labels = Object.fromEntries(
    resolveContactForm(formRow?.published).fields.map((f) => [f.key, f.label]),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Enquiries</h1>
      <p className="mt-1 text-sm text-slate-500">
        Every website enquiry lands here, with everything the aspirant filled in. Move each lead through the
        pipeline and add notes.
      </p>
      <EnquiryInbox initial={(data ?? []) as Enquiry[]} labels={labels} />
    </div>
  );
}
