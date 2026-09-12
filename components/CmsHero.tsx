import { getPublished } from "@/lib/content";
import { pageHero, type PageHeroDoc } from "@/lib/pagehero-defaults";
import PageHero from "./PageHero";
import JsonLd from "./JsonLd";
import { getSeoPage } from "@/lib/seo-pages";
import { breadcrumbLd } from "@/lib/jsonld";

/** CMS-driven page hero. Reads the `pagehero.<pageKey>` doc, falling back to the
 *  bundled default. Every interior page renders this so its hero is editable. */
export default async function CmsHero({ pageKey }: { pageKey: string }) {
  const doc = await getPublished<PageHeroDoc & { kickerSize?: string }>(`pagehero.${pageKey}`, pageHero(pageKey));
  // The visible crumb and the structured one come from the same place, so
  // search results show the same "Home › Page" trail the visitor sees.
  const seo = getSeoPage(pageKey);
  return (
    <>
      {seo && <JsonLd data={breadcrumbLd([{ name: doc.crumb || seo.label, path: seo.path }])} />}
      <PageHero
        kicker={doc.kicker}
        kickerSize={doc.kickerSize}
        title={doc.title}
        subtitle={doc.subtitle}
        image={doc.image}
        crumb={doc.crumb}
      />
    </>
  );
}
