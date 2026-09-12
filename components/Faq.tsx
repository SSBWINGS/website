import { FAQS } from "@/lib/data";
import { getCollection } from "@/lib/content";
import FaqAccordion, { type FaqItem } from "./FaqAccordion";
import JsonLd from "./JsonLd";
import { faqLd } from "@/lib/jsonld";

type FaqRow = { question: string; answer: string; sort_order: number };

export default async function Faq({ heading = true }: { heading?: boolean }) {
  const fallback: FaqRow[] = FAQS.map((f, i) => ({ question: f.q, answer: f.a, sort_order: i }));
  const rows = await getCollection<FaqRow>("published_faqs", fallback, { columns: "question, answer, sort_order" });
  const items: FaqItem[] = rows.map((r) => ({ question: r.question, answer: r.answer }));
  // Question-and-answer markup is what answer engines lift answers from.
  return (
    <>
      <JsonLd data={faqLd(items)} />
      <FaqAccordion items={items} heading={heading} />
    </>
  );
}
