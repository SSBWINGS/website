"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const WORD = "SSBWINGS";
const MIN_SHOW_MS = 2900;
/** Marks that this visit has already seen the intro. Session-scoped, so it
 *  plays once when the site is opened and not again while browsing. */
const SEEN_KEY = "ssbw:preloader-seen";

/** Runs before paint in the browser, so a repeat visit never flashes the
 *  preloader; falls back to useEffect during server rendering. */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Preloader({ lottie = true }: { lottie?: boolean }) {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [skip, setSkip] = useState(false);

  // A hard reload or a link that leaves the app would otherwise replay the
  // whole intro. Anything after the first page of a visit skips straight past
  // it — but still announces itself, since the enquiry popup waits on that.
  useBeforePaint(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private mode or storage disabled — fall through and just play it.
    }
    if (!seen) return;
    setSkip(true);
    setDone(true);
    setRemoved(true);
    document.body.style.overflow = "";
    // Deferred by a tick: this is a layout effect, so ModalProvider has not
    // attached its listener yet and would miss the event, leaving the enquiry
    // popup to its 5s fallback instead of its configured delay.
    setTimeout(() => window.dispatchEvent(new Event("ssbw:loaded")), 0);
  }, []);

  useEffect(() => {
    if (skip) return;
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
  }, [skip]);

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
