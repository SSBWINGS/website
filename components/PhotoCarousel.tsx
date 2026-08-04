"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PhotoCarousel({
  images,
  alt,
  interval = 2600,
  sizes,
  ratio = "8/5",
  position = "center 28%",
}: {
  images: string[];
  alt: string;
  interval?: number;
  sizes?: string;
  ratio?: string;
  position?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  return (
    <div className="relative w-full bg-navy-950" style={{ aspectRatio: ratio }}>
      {images.map((src, idx) => (
        <Image
          key={src}
          src={src}
          alt={idx === i ? alt : ""}
          fill
          sizes={sizes}
          priority={idx === 0}
          className={`object-cover transition-opacity duration-[900ms] ease-in-out ${idx === i ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition: position }}
        />
      ))}
      {/* subtle caption badge */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-navy-950/85 to-transparent px-3 pb-2 pt-8">
        <span className="font-display text-[11px] font-bold uppercase tracking-wider text-gold-300">Recommended</span>
        <span className="flex gap-1" aria-hidden>
          {images.map((_, idx) => (
            <span key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-4 bg-gold-400" : "w-1.5 bg-white/50"}`} />
          ))}
        </span>
      </div>
    </div>
  );
}
