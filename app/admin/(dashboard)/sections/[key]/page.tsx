import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSection, sectionDefaults } from "@/lib/sections";
import SectionEditor from "@/components/admin/SectionEditor";
import type { HeroPreviewData } from "@/components/admin/HeroPreview";
import { getPublished } from "@/lib/content";
import { STATS, type Stat } from "@/lib/data";
import { HERO_SLIDES, type HeroSlide } from "@/lib/hero-slides";

/** What the hero preview shows besides the hero's own fields: the four stat
 *  plates and the caption of the slide the site opens on - the same data the
 *  homepage reads (see HeroSection). */
async function heroPreviewData(): Promise<HeroPreviewData> {
  const [statsDoc, slidesDoc] = await Promise.all([
    getPublished<{ items: Stat[] }>("stats", { items: STATS }),
    getPublished<{ items: HeroSlide[] }>("hero_slides", { items: HERO_SLIDES }),
  ]);
  const slides = (slidesDoc.items ?? []).filter((s) => s?.image);
  const first = (slides.length ? slides : HERO_SLIDES)[0];
  return {
    stats: (statsDoc.items ?? []).slice(0, 4).map((s) => ({ value: s.value, label: s.label, suffix: s.suffix })),
    slide: first ? { name: first.name, academy: first.academy, term: first.term } : null,
  };
}

export const dynamic = "force-dynamic";

export default async function SectionEditorPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const section = getSection(key);
  if (!section) notFound();

  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("draft").eq("key", key).maybeSingle();
  const { count } = await supabase
    .from("content_versions")
    .select("id", { count: "exact", head: true })
    .eq("key", key);

  const initial = { ...sectionDefaults(key), ...((data?.draft as Record<string, unknown>) ?? {}) };
  const previewData = key === "hero" ? await heroPreviewData() : undefined;

  return (
    <div>
      <Link href="/admin/sections" className="text-sm text-slate-500 hover:text-slate-800">← All sections</Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{section.label}</h1>
      <p className="mt-1 text-sm text-slate-500">{section.description}</p>
      <SectionEditor section={section} initial={initial} canRollback={(count ?? 0) > 0} previewData={previewData} />
    </div>
  );
}
