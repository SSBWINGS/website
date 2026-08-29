"use client";

import { useState } from "react";

/** Lightweight YouTube "facade": shows the thumbnail and only loads the real
 *  iframe once the visitor clicks play (keeps the page fast). */
export default function VideoFacade({ id, title }: { id: string; title?: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="card-lift photo-frame relative aspect-video w-full overflow-hidden">
      <div className="relative h-full w-full">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title || "SSBWINGS video"}
            allow="accelerated-motion; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play ${title || "video"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt={title || "SSBWINGS video"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-navy-950/25 transition-colors group-hover:bg-navy-950/10" />
            <span
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg"
              style={{ background: "linear-gradient(180deg,#ff3d3d,#c40000)" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7"><path d="M8 5v14l11-7z" /></svg>
            </span>
            {title && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 to-transparent px-3 pb-2 pt-8 text-left text-sm font-semibold text-white">
                <span className="line-clamp-2">{title}</span>
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
