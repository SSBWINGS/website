import Image from "next/image";
import Reveal from "./Reveal";
import CmsSectionHeading from "./CmsSectionHeading";
import { getPublished } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/media";
import { CAMPUS_IMAGES } from "@/lib/homepage-defaults";
import { asArray } from "@/lib/shape";

/** Photos of the Noida campus — fully admin-managed. */
export default async function CampusGallery() {
  const doc = await getPublished<{ images: string[] }>("campus_images", { images: CAMPUS_IMAGES });
  const imgs = asArray<string>(doc.images).filter(Boolean);
  const list = imgs.length ? imgs : CAMPUS_IMAGES;
  if (!list.length) return null;

  return (
    <section className="relative pb-9 pt-5 sm:pb-12 sm:pt-6">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        <CmsSectionHeading
          sectionKey="campus"
          fallback={{
            kicker: "Inside SSBWINGS",
            title: 'Our <span class="tricolour-text">Campus</span>',
            subtitle: "The GTO ground, classrooms and hostel where aspirants train — Noida Sector 62.",
          }}
        />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((src, i) => (
            <Reveal key={src + i} delay={(i % 4) * 80}>
              <figure className="photo-frame card-lift group overflow-hidden">
                <div className="relative aspect-[4/3] w-full">
                  <Image src={mediaUrl(src)} alt="SSBWINGS campus" fill sizes="(min-width:1024px) 22vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
