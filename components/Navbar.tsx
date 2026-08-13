"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, isNavGroup, SITE } from "@/lib/data";
import { useContactModal } from "./ModalProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [desktopGroup, setDesktopGroup] = useState<string | null>(null);
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

  useEffect(() => { setOpen(false); setOpenGroup(null); setDesktopGroup(null); }, [pathname]);

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
        <div className="relative mx-auto flex max-w-[1840px] items-center justify-between px-4 py-2.5 sm:px-8">
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

          <ul className="hidden items-center gap-5 xl:absolute xl:left-1/2 xl:flex xl:-translate-x-1/2 2xl:gap-7">
            {NAV.filter((entry) => isNavGroup(entry) || entry.href !== "/contact").map((entry) => {
              if (!isNavGroup(entry)) {
                const active = pathname === entry.href;
                return (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      className={`nav-link whitespace-nowrap font-display text-base font-semibold uppercase tracking-wide text-ink hover:text-saffron-600 ${
                        active ? "is-active text-saffron-700" : ""
                      }`}
                    >
                      {entry.label}
                    </Link>
                  </li>
                );
              }
              const groupActive = entry.items.some((i) => pathname === i.href);
              const isOpenDesktop = desktopGroup === entry.label;
              return (
                <li
                  key={entry.label}
                  className="relative"
                  onMouseEnter={() => setDesktopGroup(entry.label)}
                  onMouseLeave={() => setDesktopGroup(null)}
                  onFocus={() => setDesktopGroup(entry.label)}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDesktopGroup(null); }}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpenDesktop}
                    className={`nav-link inline-flex items-center gap-1 whitespace-nowrap font-display text-base font-semibold uppercase tracking-wide text-ink hover:text-saffron-600 ${
                      groupActive ? "is-active text-saffron-700" : ""
                    }`}
                  >
                    {entry.label}
                    <span className={`text-[10px] transition-transform duration-200 ${isOpenDesktop ? "rotate-180" : ""}`} aria-hidden>▾</span>
                  </button>
                  {/* Dropdown */}
                  <div className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-all duration-200 ${isOpenDesktop ? "visible opacity-100" : "invisible opacity-0"}`}>
                    <ul className="w-72 rounded-xl border border-[rgba(43,36,22,0.14)] bg-[#fffdf7] p-2 shadow-[0_18px_44px_-16px_rgba(43,36,22,0.55)]">
                      {entry.items.map((i) => {
                        const active = pathname === i.href;
                        return (
                          <li key={i.href}>
                            <Link
                              href={i.href}
                              onClick={() => setDesktopGroup(null)}
                              className={`block rounded-lg px-3 py-2 transition-colors hover:bg-paper-2 ${active ? "bg-paper-2" : ""}`}
                            >
                              <span className={`block font-display text-sm font-bold uppercase tracking-wide ${active ? "text-saffron-700" : "text-ink"}`}>
                                {i.label}
                              </span>
                              {i.desc && <span className="mt-0.5 block text-xs normal-case text-ink-soft">{i.desc}</span>}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            {/* Desktop: glowing "+" with label → recommendation gallery */}
            <Link
              href="/recommended"
              aria-label="Recommendation gallery — all recommended candidates"
              className="hidden flex-col items-center gap-1 xl:flex"
            >
              <span
                className={`glow-plus flex h-9 w-9 items-center justify-center rounded-full bg-navy-950 text-xl font-bold leading-none text-gold-300 transition-transform hover:scale-110 ${
                  pathname === "/recommended" ? "ring-2 ring-gold-400" : ""
                }`}
                aria-hidden
              >
                +
              </span>
              <span className="text-center text-[8px] font-bold uppercase leading-tight tracking-wide text-ink-soft">
                Recommendation<br />Gallery
              </span>
            </Link>

            {/* Desktop: Contact */}
            <Link
              href="/contact"
              className={`hidden items-center rounded-lg border border-[rgba(43,36,22,0.25)] bg-paper px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wide shadow-[var(--shadow-raised)] transition hover:text-saffron-700 xl:inline-flex ${
                pathname === "/contact" ? "text-saffron-700" : "text-ink"
              }`}
            >
              Contact
            </Link>

            {/* Desktop: Enquire */}
            <button onClick={openModal} className="btn btn-gold btn-shine hidden px-5 py-2.5 text-sm xl:inline-flex">
              Enquire
            </button>

            {/* Mobile: compact "+" icon */}
            <Link
              href="/recommended"
              aria-label="Recommendation gallery"
              className="glow-plus flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-950 text-2xl font-bold leading-none text-gold-300 xl:hidden"
            >
              <span className="-mt-0.5" aria-hidden>+</span>
            </Link>
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
              <li>
                <Link
                  href="/recommended"
                  className="flex items-center gap-3 rounded-lg bg-navy-950 px-4 py-3 font-display text-lg font-semibold uppercase tracking-wider text-gold-300"
                >
                  <span className="glow-plus flex h-7 w-7 items-center justify-center rounded-full bg-gold-400 text-xl leading-none text-navy-950" aria-hidden>+</span>
                  All Recommended Candidates
                </Link>
              </li>
              {NAV.map((entry) => {
                if (!isNavGroup(entry)) {
                  return (
                    <li key={entry.href}>
                      <Link
                        href={entry.href}
                        className={`block rounded-lg px-4 py-3 font-display text-lg font-semibold uppercase tracking-wider transition-colors hover:bg-paper-2 ${
                          pathname === entry.href ? "text-saffron-700" : "text-ink"
                        }`}
                      >
                        {entry.label}
                      </Link>
                    </li>
                  );
                }
                const isOpen = openGroup === entry.label;
                const groupActive = entry.items.some((i) => pathname === i.href);
                return (
                  <li key={entry.label}>
                    <button
                      type="button"
                      onClick={() => setOpenGroup(isOpen ? null : entry.label)}
                      aria-expanded={isOpen}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 font-display text-lg font-semibold uppercase tracking-wider transition-colors hover:bg-paper-2 ${
                        groupActive ? "text-saffron-700" : "text-ink"
                      }`}
                    >
                      {entry.label}
                      <span className={`text-sm transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} aria-hidden>▾</span>
                    </button>
                    <div className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <ul className="overflow-hidden pl-3">
                        {entry.items.map((i) => (
                          <li key={i.href}>
                            <Link
                              href={i.href}
                              className={`block rounded-lg px-4 py-2.5 font-display text-base font-semibold uppercase tracking-wide transition-colors hover:bg-paper-2 ${
                                pathname === i.href ? "text-saffron-700" : "text-ink-soft"
                              }`}
                            >
                              {i.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
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
