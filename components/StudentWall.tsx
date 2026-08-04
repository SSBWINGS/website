import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { STUDENTS } from "@/lib/data";

export default function StudentWall({
  heading = true,
  limit,
  showCta = false,
}: {
  heading?: boolean;
  limit?: number;
  showCta?: boolean;
}) {
  const list = limit ? STUDENTS.slice(0, limit) : STUDENTS;

  return (
    <section id="wall-of-honour" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        {heading && (
          <SectionHeading
            center
            kicker="Wall of Honour"
            title={<>Our <span className="tricolour-text">Recommended</span> Cadets</>}
            subtitle="Real faces, real chest numbers. Every photograph below is an SSBWINGS aspirant who walked out recommended — from NDA to CDS, AFCAT to Navy."
          />
        )}

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {list.map((s, i) => (
            <Reveal key={s.name + i} delay={(i % 6) * 70}>
              <figure className="card-lift group skeu-panel overflow-hidden p-3 text-center">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={`/images/students/${s.file}`}
                    alt={`${s.name} — recommended for ${s.exam}`}
                    fill
                    sizes="(min-width:1024px) 15vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1 tricolour-bar opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </div>
                <figcaption className="pt-3">
                  <p className="font-display text-base font-bold uppercase leading-tight text-ink">{s.name}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-saffron-700">{s.exam}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {showCta && (
          <Reveal delay={200} className="mt-12 text-center">
            <Link href="/gallery" className="btn btn-gold btn-shine">See the Full Wall of Honour →</Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
