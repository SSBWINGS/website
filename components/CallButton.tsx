"use client";

import { useEffect, useState } from "react";
import { isMobileOrTablet } from "@/lib/device";

/**
 * Floating "call us" button, above the WhatsApp one.
 *
 * Only rendered on phones and tablets — a desktop has no dialler, so a tel:
 * link there either does nothing or hands off to whatever app claimed the
 * protocol. The check is on the device, not the window width, so narrowing a
 * desktop browser never conjures it up.
 */
export default function CallButton({ href, number }: { href: string; number: string }) {
  /** Whether this device gets the button at all — decided after mount, since
   *  the server has no idea what it is rendering for. */
  const [enabled, setEnabled] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isMobileOrTablet()) return;
    setEnabled(true);
    // Appears alongside the WhatsApp button rather than fighting it for
    // attention during the page's first moments.
    const t = setTimeout(() => setShow(true), 3200);
    // Lifts the back-to-top button clear of this one; see globals.css.
    document.documentElement.style.setProperty("--call-stack", "4.25rem");
    return () => {
      clearTimeout(t);
      document.documentElement.style.removeProperty("--call-stack");
    };
  }, []);

  // Nothing is rendered on a desktop — not even hidden markup a screen reader
  // could still reach.
  if (!enabled || !href) return null;

  return (
    <a
      href={href}
      aria-label={`Call SSBWINGS on ${number}`}
      className={`call-float group flex items-center gap-3 transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
      }`}
    >
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-navy-950 px-3 py-2 text-xs font-semibold text-paper opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 sm:block">
        Call {number}
      </span>
      <span
        className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_10px_24px_-6px_rgba(239,122,18,0.7)]"
        style={{ background: "linear-gradient(180deg,#ffb64d,#ff9933 55%,#ef7a12)" }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden>
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
        </svg>
      </span>
    </a>
  );
}
