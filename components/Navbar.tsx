"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE } from "@/lib/data";
import { useContactModal } from "./ModalProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { open: openModal } = useContactModal();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* Top contact strip */}
      <div
        className={`bg-navy-950 text-paper transition-all duration-300 ${
          scrolled ? "max-h-0 overflow-hidden opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-[1840px] items-center justify-between gap-4 px-4 py-1.5 text-xs sm:px-8">
          <p className="hidden font-medium tracking-wide sm:block">
            🎖️ Champions of Discipline, Dedication &amp; Determination
          </p>
          <div className="flex items-center gap-4">
            <a href={SITE.phone1Href} className="transition-colors hover:text-gold-300">📞 {SITE.phone1}</a>
            <a href={`mailto:${SITE.email}`} className="hidden transition-colors hover:text-gold-300 sm:block">✉️ {SITE.email}</a>
          </div>
        </div>
      </div>

      {/* Main nav — light skeuomorphic bar */}
      <nav
        aria-label="Primary"
        className="relative border-b border-[rgba(43,36,22,0.12)] bg-[linear-gradient(180deg,#fffdf7,#f4ecd8)] shadow-[0_6px_18px_-10px_rgba(43,36,22,0.4)]"
      >
        <div className="mx-auto flex max-w-[1840px] items-center justify-between px-4 py-2.5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="SSBWINGS home">
            <span className="medal">
              <Image
                src="/logo.webp"
                alt="SSBWINGS logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full bg-navy-950 object-contain p-1"
                priority
              />
            </span>
            <span className="leading-tight">
              <span className="block whitespace-nowrap font-display text-xl font-extrabold uppercase tracking-widest gold-text sm:text-2xl">
                SSBWINGS
              </span>
              <span className="hidden whitespace-nowrap text-[10px] uppercase tracking-[0.28em] text-ink-soft sm:block">
                We give shape to your dreams
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-4 xl:flex 2xl:gap-6">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`nav-link whitespace-nowrap font-display text-base font-semibold uppercase tracking-wide text-ink hover:text-saffron-600 ${
                      active ? "is-active text-saffron-700" : ""
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <button onClick={openModal} className="btn btn-gold btn-shine hidden px-5 py-2.5 text-sm xl:inline-flex">
              Enquire
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-[rgba(43,36,22,0.2)] bg-paper text-saffron-700 shadow-[var(--shadow-raised)] xl:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={`h-0.5 w-6 bg-current transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-0.5 w-6 bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-6 bg-current transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`grid overflow-hidden transition-[grid-template-rows] duration-300 xl:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <ul className="space-y-1 border-t border-[rgba(43,36,22,0.12)] px-4 py-4">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block rounded-lg px-4 py-3 font-display text-lg font-semibold uppercase tracking-wider transition-colors hover:bg-paper-2 ${
                      pathname === l.href ? "text-saffron-700" : "text-ink"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <button onClick={openModal} className="btn btn-gold w-full">Book Free Counselling</button>
              </li>
            </ul>
          </div>
        </div>

        {/* Scroll progress — tricolour */}
        <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden">
          <div
            className="tricolour-bar h-full transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
        </div>
      </nav>
    </header>
  );
}
