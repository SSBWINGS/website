import Image from "next/image";
import { getPublished } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/media";
import { OFFICER_BANNERS } from "@/lib/data";
import { asArray } from "@/lib/shape";
import CmsSectionHeading from "./CmsSectionHeading";

/**
 * "Now Serving" marquee of commissioned alumni.
 *
 * One CMS document (`officer_banners`) backs both the homepage section and the
 * Gallery page, so adding, removing or reordering an image in the admin panel
 * changes both at once.
 */
export default async function OfficerBanners() {
  const doc = await getPublished<{ images: string[] }>("officer_banners", { images: OFFICER_BANNERS });
  const saved = asArray<string>(doc.images).filter(Boolean);
  const items = (saved.length ? saved : OFFICER_BANNERS).map(mediaUrl);
  if (!items.length) return null;

  // Two rows scrolling opposite directions
  const half = Math.ceil(items.length / 2);
  const rowA = items.slice(0, half);
  const rowB = items.slice(half);

  const Row = ({ items, reverse }: { items: string[]; reverse?: boolean }) => (
    <div className="marquee overflow-hidden">
      <div className="marquee-track slow" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {[...items, ...items].map((src, i) => (
          <div key={i} className="photo-frame mx-3 w-[340px] shrink-0 sm:w-[420px]">
            <div>
              <Image src={src} alt="Commissioned officer — SSBWINGS alumnus" width={420} height={140} sizes="420px" className="h-auto w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden py-6">
      <div className="mx-auto max-w-[1840px] px-4 pb-8 sm:px-8">
        <CmsSectionHeading
          sectionKey="officer_banners"
          fallback={{
            kicker: "Now Serving",
            title: 'Our Alumni in <span class="tricolour-text">Uniform</span>',
            subtitle: "From aspirant to commissioned officer — a few of the many who now serve the nation.",
          }}
        />
      </div>
      <div className="space-y-4">
        <Row items={rowA} />
        {rowB.length > 0 && <Row items={rowB} reverse />}
      </div>
    </section>
  );
}
