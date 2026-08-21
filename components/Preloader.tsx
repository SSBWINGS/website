"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const WORD = "SSBWINGS";
const MIN_SHOW_MS = 2900;

export default function Preloader({ lottie = true }: { lottie?: boolean }) {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const shownAt = performance.now();

    const finish = () => {
      const wait = Math.max(MIN_SHOW_MS - (performance.now() - shownAt), 0);
      setTimeout(() => {
        setDone(true);
        document.body.style.overflow = "";
        window.dispatchEvent(new Event("ssbw:loaded"));
        setTimeout(() => setRemoved(true), 750);
      }, wait);
    };

    if (document.readyState === "complete") finish();
    else {
      window.addEventListener("load", finish);
      const failsafe = setTimeout(finish, 6500);
      return () => {
        window.removeEventListener("load", finish);
        clearTimeout(failsafe);
        document.body.style.overflow = "";
      };
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (removed) return null;

  return (
    <div className={`preloader ${done ? "is-done" : ""}`} role="status" aria-label="SSBWINGS is loading">
      {lottie && (
        <div className="h-64 w-64 sm:h-80 sm:w-80">
          <DotLottieReact src="/preloader.lottie" loop autoplay />
        </div>
      )}

      <h1 className="font-display font-black uppercase leading-none tracking-[0.14em] text-6xl drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] sm:text-8xl">
        {WORD.split("").map((ch, i) => (
          <span
            key={i}
            className="preloader-letter tricolour-text"
            style={{ animationDelay: `${250 + i * 95}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </h1>

      <p
        className="preloader-letter mt-3 max-w-[90vw] text-center font-display text-base uppercase tracking-[0.4em] text-white/90 [text-shadow:0_2px_8px_rgba(0,0,0,0.8)] sm:text-xl"
        style={{ animationDelay: "1200ms" }}
      >
        We give shape to your Dreams
      </p>

      <div className="preloader-bar mt-8" />
    </div>
  );
}
