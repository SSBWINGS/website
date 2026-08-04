"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/data";

export default function WhatsAppButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SSBWINGS on WhatsApp"
      className={`wa-float group flex items-center gap-3 transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-navy-950 px-3 py-2 text-xs font-semibold text-paper opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 md:block">
        Chat with us on WhatsApp
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_10px_24px_-6px_rgba(37,211,102,0.7)]"
        style={{ background: "linear-gradient(180deg,#4ce87d,#25d366 55%,#1da851)" }}
      >
        <span className="wa-ring" aria-hidden />
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 animate-wave" aria-hidden>
          <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.5 9.5 0 0 1-4.84-1.33l-.35-.2-3.6.94.96-3.5-.23-.36a9.46 9.46 0 0 1-1.45-5.05c0-5.24 4.27-9.5 9.52-9.5 2.54 0 4.93.99 6.73 2.79a9.44 9.44 0 0 1 2.79 6.72c0 5.24-4.27 9.5-9.52 9.5zm8.1-17.6A11.42 11.42 0 0 0 12.04.5C5.76.5.65 5.61.65 11.89c0 2.09.55 4.13 1.59 5.93L.5 23.5l5.83-1.53a11.34 11.34 0 0 0 5.71 1.46h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.19-5.9-3.34-8.05z" />
        </svg>
      </span>
    </a>
  );
}
