import { getPublished } from "@/lib/content";
import { pageHero, type PageHeroDoc } from "@/lib/pagehero-defaults";
import PageHero from "./PageHero";

/** CMS-driven page hero. Reads the `pagehero.<pageKey>` doc, falling back to the
 *  bundled default. Every interior page renders this so its hero is editable. */
export default async function CmsHero({ pageKey }: { pageKey: string }) {
  const doc = await getPublished<PageHeroDoc>(`pagehero.${pageKey}`, pageHero(pageKey));
  return <PageHero kicker={doc.kicker} title={doc.title} subtitle={doc.subtitle} image={doc.image} crumb={doc.crumb} />;
}
