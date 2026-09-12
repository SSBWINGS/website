import { serializeLd } from "@/lib/jsonld";

/** Emits schema.org structured data. Renders nothing visible — it exists for
 *  search engines and AI answer engines. Null entries are skipped, so callers
 *  can pass optional builders (e.g. an FAQ block with no questions) directly. */
export default function JsonLd({ data }: { data: unknown | unknown[] }) {
  const blocks = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!blocks.length) return null;
  return (
    <>
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeLd(b) }} />
      ))}
    </>
  );
}
