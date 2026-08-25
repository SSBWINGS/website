import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getCollection } from "@/lib/content";
import CmsHero from "@/components/CmsHero";
import MockQuiz, { type OirQuestion } from "@/components/MockQuiz";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("mock-tests");
}

type Row = { id: string; type: string; question: string; options: string[]; sort_order: number };

export default async function MockTestsPage() {
  const all = await getCollection<Row>("published_mock_questions", [], { columns: "id, type, question, options, sort_order" });
  const oir: OirQuestion[] = all
    .filter((q) => q.type === "OIR" && Array.isArray(q.options) && q.options.length >= 2)
    .map((q) => ({ id: q.id, question: q.question, options: q.options }));
  const srt = all.filter((q) => q.type === "SRT");

  return (
    <main>
      <CmsHero pageKey="mock-tests" />

      <section className="bg-[#faf6ec] px-4 pb-14 pt-8 sm:pb-20 sm:pt-10">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-[#0a1524]">OIR — Officer Intelligence Rating</h2>
          <p className="mt-2 text-sm text-slate-600">Pick the best answer for each question, then submit to see your score and explanations.</p>
        </div>
        <MockQuiz questions={oir} />
      </section>

      {srt.length > 0 && (
        <section className="border-t border-slate-200 bg-white px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#0a1524]">SRT — Situation Reaction Test</h2>
              <p className="mt-2 text-sm text-slate-600">Read each situation and jot your natural, action-oriented response. Great daily practice for psychology.</p>
            </div>
            <ol className="space-y-3">
              {srt.map((q, i) => (
                <li key={q.id} className="rounded-xl border border-slate-200 bg-[#faf6ec] p-4 text-sm text-[#0a1524]">
                  <span className="font-semibold text-slate-400">{i + 1}.</span> {q.question}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </main>
  );
}
