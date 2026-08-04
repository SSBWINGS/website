"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { YT_VIDEOS, SITE } from "@/lib/data";

function Facade({ id }: { id: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="card-lift photo-frame relative aspect-video w-full overflow-hidden">
      <div className="relative h-full w-full">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title="SSBWINGS recommendation interview"
            allow="accelerated-motion; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label="Play video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt="Recommended cadet interview"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-navy-950/25 transition-colors group-hover:bg-navy-950/10" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg"
              style={{ background: "linear-gradient(180deg,#ff3d3d,#c40000)" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function YouTubeGrid({ heading = true }: { heading?: boolean }) {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        {heading && (
          <SectionHeading
            center
            kicker="Straight from the Cadets"
            title={<>Recommendation <span className="tricolour-text">Interviews</span></>}
            subtitle="Unscripted conversations with cadets who cracked the SSB after training with us. Watch their journeys in their own words."
          />
        )}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {YT_VIDEOS.map((id, i) => (
            <Reveal key={id} delay={(i % 3) * 90}><Facade id={id} /></Reveal>
          ))}
        </div>
        <Reveal delay={150} className="mt-10 text-center">
          <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-shine">
            ▶ Watch More on YouTube
          </a>
        </Reveal>
      </div>
    </section>
  );
}
