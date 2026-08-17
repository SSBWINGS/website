import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/data";
import { getSettings, telHref } from "@/lib/content";

export default async function Footer() {
  const SITE = await getSettings();
  return (
    <footer className="relative bg-navy-950 text-paper">
      <div className="tricolour-bar h-1.5 w-full" aria-hidden />
      <div className="mx-auto max-w-[1840px] px-4 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="medal">
                <Image src="/logo.webp" alt="SSBWINGS logo" width={56} height={56} className="h-14 w-14 rounded-full bg-navy-950 object-contain p-1.5" />
              </span>
              <span>
                <span className="block font-display text-2xl font-extrabold uppercase tracking-widest gold-text">SSBWINGS</span>
                <span className="block text-[10px] uppercase tracking-[0.26em] text-navy-200/80">We give shape to your dreams</span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-navy-100/80">
              India&apos;s trusted SSB interview academy — mentored by ex-SSB assessors,
              powered by 677+ recommendations and a 3,450+ strong alumni family of officers.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-gold-300">★★★★★ <span className="text-navy-100/80">5.0 Google Rating</span></p>
          </div>

          <nav aria-label="Pages">
            <h3 className="font-display text-lg font-bold uppercase tracking-widest text-gold-400">Explore</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block text-navy-100/85 transition-all duration-200 hover:translate-x-1 hover:text-gold-300">
                    → {l.label}
                  </Link>
                </li>
              ))}
              <li className="col-span-2">
                <a href={SITE.brochure} download className="inline-block font-semibold text-gold-300 transition-all duration-200 hover:translate-x-1">
                  ⬇ Download 2026 Brochure
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-widest text-gold-400">Find Us</h3>
            <a href="https://maps.google.com/maps?q=SSBWINGS%2C%20Sector%2062%2C%20Noida&ll=28.6150754%2C77.3672718&z=16" target="_blank" rel="noopener noreferrer"
              className="mt-5 block overflow-hidden rounded-xl border border-navy-700/60">
              <iframe
                title="SSBWINGS location — Sector 62, Noida"
                src="https://maps.google.com/maps?q=SSBWINGS%2C%20C-56%2F43%2C%20Sector%2062%2C%20Noida&ll=28.6150754%2C77.3672718&z=15&output=embed"
                className="pointer-events-none h-36 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-widest text-gold-400">Contact HQ</h3>
            <address className="mt-5 space-y-3 text-sm not-italic text-navy-100/85">
              <p>{SITE.address}</p>
              <p>
                <a href={telHref(SITE.phone1)} className="transition-colors hover:text-gold-300">{SITE.phone1}</a><br />
                <a href={telHref(SITE.phone2)} className="transition-colors hover:text-gold-300">{SITE.phone2}</a>
              </p>
              <p><a href={`mailto:${SITE.email}`} className="transition-colors hover:text-gold-300">{SITE.email}</a></p>
            </address>
            <div className="mt-5 flex gap-3">
              {[
                {
                  label: "YouTube", href: SITE.youtube,
                  icon: <path fillRule="evenodd" clipRule="evenodd" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
                },
                {
                  label: "Instagram", href: SITE.instagram,
                  icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />,
                },
                {
                  label: "Telegram", href: SITE.telegram,
                  icon: <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />,
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy-600/60 text-navy-100/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-300"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="mx-auto flex max-w-[1840px] flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-navy-200/70 sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} SSBWINGS. All rights reserved.</p>
          <p>Champions of Discipline, Dedication &amp; Determination 🇮🇳</p>
        </div>
        <p className="mx-auto max-w-[1840px] px-4 pb-5 text-center text-xs text-navy-200/70 sm:px-8">
          Developed with <span className="text-red-500" aria-hidden>❤</span> by{" "}
          <a
            href="https://jyotiranjansahoo.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="dev-glow font-display font-bold uppercase tracking-wider"
          >
            Jyotiranjan
          </a>
        </p>
      </div>
    </footer>
  );
}
