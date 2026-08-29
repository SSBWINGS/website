import { getPublished } from "@/lib/content";
import SectionHeading from "./SectionHeading";

export type HeadingDoc = { kicker: string; title: string; subtitle?: string; kickerSize?: string };

/** A section heading whose kicker/title/subtitle live in the CMS under
 *  `heading.<key>`. Every homepage section uses this so the admin can retitle
 *  any block without touching code. */
export default async function CmsSectionHeading({
  sectionKey,
  fallback,
  center = true,
  light = false,
}: {
  sectionKey: string;
  fallback: HeadingDoc;
  center?: boolean;
  light?: boolean;
}) {
  const h = await getPublished<HeadingDoc>(`heading.${sectionKey}`, fallback);
  if (!h.kicker && !h.title) return null;
  return (
    <SectionHeading
      center={center}
      light={light}
      kicker={h.kicker}
      kickerSize={h.kickerSize}
      title={<span dangerouslySetInnerHTML={{ __html: h.title }} />}
      subtitle={h.subtitle}
    />
  );
}
