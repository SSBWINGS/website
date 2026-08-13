import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/CtaBannerSection";
import RecommendedWall, { type Candidate } from "@/components/RecommendedWall";
import { HOMEPAGE_WALL_COUNT, WALL_PAGE_SIZE } from "@/lib/candidates";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("recommended");
}

async function firstPage(): Promise<Candidate[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("published_candidates")
      .select("name, exam, image_path, sort_order")
      .gte("sort_order", HOMEPAGE_WALL_COUNT)
      .order("sort_order", { ascending: true })
      .range(0, WALL_PAGE_SIZE - 1);
    return (data as Candidate[]) ?? [];
  } catch {
    return [];
  }
}

export default async function RecommendedPage() {
  const initial = await firstPage();

  return (
    <main>
      <PageHero
        crumb="Recommended"
        kicker="Wall of Honour"
        title={<>Every <span className="tricolour-text">Recommended</span> Cadet</>}
        subtitle="The complete roll of SSBWINGS aspirants who walked out of the Board recommended — hundreds of real faces and chest numbers, from NDA and CDS to AFCAT, Navy and Coast Guard."
        image="/images/women-officers.jpg"
      />

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
          {initial.length === 0 ? (
            <p className="rounded-2xl border border-[rgba(43,36,22,0.12)] bg-paper-2 p-10 text-center text-ink-soft">
              Our recommended-cadet wall is being updated — please check back shortly.
            </p>
          ) : (
            <RecommendedWall initial={initial} startAt={HOMEPAGE_WALL_COUNT} pageSize={WALL_PAGE_SIZE} />
          )}
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
