import { FAQS } from "@/lib/data";
import { getCollection } from "@/lib/content";
import FaqAccordion, { type FaqItem } from "./FaqAccordion";

type FaqRow = { question: string; answer: string; sort_order: number };

export default async function Faq({ heading = true }: { heading?: boolean }) {
  const fallback: FaqRow[] = FAQS.map((f, i) => ({ question: f.q, answer: f.a, sort_order: i }));
  const rows = await getCollection<FaqRow>("published_faqs", fallback, { columns: "question, answer, sort_order" });
  const items: FaqItem[] = rows.map((r) => ({ question: r.question, answer: r.answer }));
  return <FaqAccordion items={items} heading={heading} />;
}
