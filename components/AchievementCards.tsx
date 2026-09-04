import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { AIR_CARDS } from "@/lib/data";

export default function AchievementCards() {
  return (
    <section className="relative py-9 sm:py-12">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        <SectionHeading
          center
          kicker="All India Rank Holders"
          title={<>The <span className="tricolour-text">AIR-1</span> Wall</>}
          subtitle="Toppers who trained with SSBWINGS and finished first in the merit list. Discipline, dedication and determination — measured in ranks."
        />
        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {AIR_CARDS.map((src, i) => (
            <Reveal key={src} delay={(i % 5) * 70}>
              <div className="photo-frame card-lift">
                <div>
                  <Image src={src} alt="SSBWINGS All India Rank holder achievement card" width={500} height={700} sizes="(min-width:1024px) 18vw, 45vw" className="h-auto w-full" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
