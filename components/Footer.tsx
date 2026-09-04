import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/data";
import { getSettings, telHref, mapHref, mapEmbedSrc } from "@/lib/content";
import { SocialIcon } from "./SocialIcons";
import { mediaUrl } from "@/lib/supabase/media";

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
                <a href={mediaUrl(SITE.brochure)} download className="inline-block font-semibold text-gold-300 transition-all duration-200 hover:translate-x-1">
                  ⬇ Download 2026 Brochure
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-widest text-gold-400">Find Us</h3>
            <a href={mapHref(SITE)} target="_blank" rel="noopener noreferrer"
              className="mt-5 block overflow-hidden rounded-xl border border-navy-700/60">
              <iframe
                title="SSBWINGS location — Sector 62, Noida"
                src={mapEmbedSrc(SITE)}
                className="pointer-events-none h-36 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-widest text-gold-400">Contact HQ</h3>
            <address className="mt-5 space-y-3 text-sm not-italic text-navy-100/85">
              <p>
                <a href={mapHref(SITE)} target="_blank" rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-300">{SITE.address}</a>
              </p>
              <p>
                <a href={telHref(SITE.phone1)} className="transition-colors hover:text-gold-300">{SITE.phone1}</a>
                {SITE.phone2 ? (
                  <><br /><a href={telHref(SITE.phone2)} className="transition-colors hover:text-gold-300">{SITE.phone2}</a></>
                ) : null}
              </p>
              <p><a href={`mailto:${SITE.email}`} className="transition-colors hover:text-gold-300">{SITE.email}</a></p>
            </address>
            <div className="mt-5 flex gap-3">
              {[
                { label: "YouTube", href: SITE.youtube, icon: "youtube" as const },
                { label: "Instagram", href: SITE.instagram, icon: "instagram" as const },
                { label: "Telegram", href: SITE.telegram, icon: "telegram" as const },
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
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="mx-auto flex max-w-[1840px] flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-navy-200/70 sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} SSBWINGS. All rights reserved.</p>
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
