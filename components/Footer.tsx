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
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block text-navy-100/85 transition-all duration-200 hover:translate-x-1 hover:text-gold-300">
                    → {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={SITE.brochure} download className="inline-block font-semibold text-gold-300 transition-all duration-200 hover:translate-x-1">
                  ⬇ Download 2026 Brochure
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-widest text-gold-400">Find Us</h3>
            <p className="mt-4 text-sm text-navy-100/80">{SITE.address}</p>
            <a href="https://maps.google.com/maps?q=SSBWINGS%2C%20Sector%2062%2C%20Noida&ll=28.6150754%2C77.3672718&z=16" target="_blank" rel="noopener noreferrer"
              className="mt-4 block overflow-hidden rounded-xl border border-navy-700/60">
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
                  icon: <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />,
                },
                {
                  label: "Instagram", href: SITE.instagram,
                  icon: <><rect x="2" y="2" width="20" height="20" rx="5.5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.4" /></>,
                },
                {
                  label: "Telegram", href: SITE.telegram,
                  icon: <path d="M21.9 4.3 2.9 11.6c-1.1.5-1.1 1.6-.2 1.9l4.8 1.5 1.8 5.6c.3.7.5 1 1 1 .5 0 .7-.2 1-.7l2.5-2.4 4.9 3.6c.9.5 1.6.2 1.8-.8l3.2-15c.3-1.3-.5-1.9-1.6-1.5Z" />,
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
