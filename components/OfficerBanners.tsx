import Image from "next/image";
import { OFFICER_BANNERS } from "@/lib/data";

export default function OfficerBanners() {
  // Two rows scrolling opposite directions
  const half = Math.ceil(OFFICER_BANNERS.length / 2);
  const rowA = OFFICER_BANNERS.slice(0, half);
  const rowB = OFFICER_BANNERS.slice(half);

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
      <div className="space-y-4">
        <Row items={rowA} />
        <Row items={rowB} reverse />
      </div>
    </section>
  );
}
