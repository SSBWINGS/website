import Link from "next/link";
import { SECTIONS } from "@/lib/sections";

export const dynamic = "force-dynamic";

export default function SectionsList() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Pages &amp; Sections</h1>
      <p className="mt-1 text-sm text-slate-500">
        Edit headings, taglines and text with a live preview, then publish when you&apos;re happy.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link key={s.key} href={`/admin/sections/${s.key}`}
            className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">{s.label}</h2>
              <span className="text-slate-300 transition group-hover:text-blue-500">✎</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
