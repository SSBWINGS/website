import { getCurrentAdmin } from "@/lib/auth";

const PHASES = [
  { done: true, title: "Secure login & roles", desc: "Email/password auth, super-admin & admin roles, route protection." },
  { done: false, title: "Recommended Candidates manager", desc: "Add photos, names & entries to the Wall of Honour." },
  { done: false, title: "Page & section editors", desc: "Edit every heading, tagline, text & image with fonts, colours & word-art." },
  { done: false, title: "Footer editor", desc: "Update contact details, links & credits." },
  { done: false, title: "Live preview & publish", desc: "Video-editor-style preview with device frames and one-click publish." },
];

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin();
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome back{admin?.full_name ? `, ${admin.full_name}` : ""} 👋
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage your SSBWINGS website content from here. You are signed in as{" "}
        <span className="font-medium capitalize text-slate-700">{admin?.role.replace("_", " ")}</span>.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Recommended Candidates", value: "—", hint: "Wall of Honour entries" },
          { label: "Editable Sections", value: "12+", hint: "Across all pages" },
          { label: "Your Role", value: admin?.role === "super_admin" ? "Super Admin" : "Admin", hint: "Access level" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-400">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Build progress</h2>
        <p className="text-sm text-slate-500">Your CMS is being delivered in phases.</p>
        <ul className="mt-4 space-y-3">
          {PHASES.map((p) => (
            <li key={p.title} className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${p.done ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`}>
                {p.done ? "✓" : "•"}
              </span>
              <div>
                <p className={`text-sm font-medium ${p.done ? "text-slate-900" : "text-slate-600"}`}>{p.title}</p>
                <p className="text-xs text-slate-500">{p.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
