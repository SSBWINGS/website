import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const PHASES = [
  { done: true, title: "Secure login, roles & users", desc: "Email/password auth, super-admin & admin roles, password changes." },
  { done: true, title: "Recommended Candidates, Testimonials & Mentors", desc: "Add photos, names & entries with rich text and image uploads." },
  { done: true, title: "Footer, contact & page sections", desc: "Edit headings, taglines & text with fonts, colours & word-art." },
  { done: true, title: "Live preview, publish & rollback", desc: "Device-framed preview, autosave, one-click publish and rollback." },
  { done: true, title: "Media library & activity log", desc: "Upload/browse images; full audit trail of changes." },
];

async function countOf(table: string) {
  try {
    const supabase = await createClient();
    const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
    return count ?? 0;
  } catch { return 0; }
}

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin();
  const [candidates, testimonials, mentors] = await Promise.all([
    countOf("recommended_candidates"),
    countOf("testimonials"),
    countOf("mentors"),
  ]);

  const cards = [
    { label: "Recommended Candidates", value: candidates, hint: "Wall of Honour entries", href: "/admin/candidates" },
    { label: "Testimonials", value: testimonials, hint: "Success stories", href: "/admin/testimonials" },
    { label: "Mentors", value: mentors, hint: "Team members", href: "/admin/mentors" },
  ];

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
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
            <p className="text-sm font-medium text-slate-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-400">{c.hint}</p>
          </Link>
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
