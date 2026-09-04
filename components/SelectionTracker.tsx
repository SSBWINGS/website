import { getCollection, getPublished } from "@/lib/content";
import { SELECTIONS, TRACKER, type Selection, type TrackerDoc } from "@/lib/selection-defaults";
import CountUp from "./CountUp";

export default async function SelectionTracker() {
  const [rows, doc] = await Promise.all([
    getCollection<Selection>("published_selections", SELECTIONS, { columns: "year, exam, center, count, sort_order" }),
    getPublished<TrackerDoc>("selection_tracker", TRACKER),
  ]);
  if (!rows.length) return null;

  const total = rows.reduce((s, r) => s + (r.count || 0), 0);
  const years = Array.from(new Set(rows.map((r) => r.year))).sort((a, b) => b - a);
  const centres = new Set(rows.map((r) => r.center).filter(Boolean)).size;

  // Totals per exam, for the bars.
  const byExam = new Map<string, number>();
  for (const r of rows) byExam.set(r.exam, (byExam.get(r.exam) ?? 0) + (r.count || 0));
  const exams = Array.from(byExam.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = Math.max(...exams.map(([, c]) => c), 1);

  // Each card counts itself from the tracker rows unless the admin typed an
  // override (any text — "5", "5+", "All India" — is shown verbatim).
  const cards = [
    { label: doc.totalLabel, value: total, suffix: "+", override: doc.totalOverride?.trim() },
    { label: doc.yearsLabel, value: years.length, suffix: "", override: doc.yearsOverride?.trim() },
    { label: doc.centresLabel, value: centres, suffix: "", override: doc.centresOverride?.trim() },
  ].filter((c) => c.label);

  return (
    <section className="bg-[#faf8f1] py-9 sm:py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          {doc.kicker && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b8860b]">{doc.kicker}</span>}
          {doc.heading && <h2 className="mt-2 text-2xl font-bold text-[#0a1524] sm:text-3xl">{doc.heading}</h2>}
          {doc.subtitle && <p className="mt-2 text-sm text-slate-600">{doc.subtitle}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-[#e5ddcb] bg-white p-6 text-center">
              {c.override ? (
                <p className="text-4xl font-extrabold text-[#0a1524]">{c.override}</p>
              ) : (
                <CountUp end={c.value} suffix={c.suffix} className="text-4xl font-extrabold text-[#0a1524]" />
              )}
              <p className="mt-1 text-sm font-medium text-slate-500">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[#e5ddcb] bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{doc.barsHeading}</h3>
          <div className="space-y-3">
            {exams.map(([exam, count]) => (
              <div key={exam} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm font-medium text-[#0a1524]">{exam}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#b8860b] to-[#f2d519]"
                    style={{ width: `${Math.round((count / max) * 100)}%` }} />
                </div>
                <span className="w-8 shrink-0 text-right text-sm font-bold text-[#0a1524]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
