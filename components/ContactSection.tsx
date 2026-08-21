import Reveal from "./Reveal";
import ContactForm from "./ContactForm";
import { SocialIcon } from "./SocialIcons";
import { getSettings, telHref } from "@/lib/content";

export default async function ContactSection() {
  const SITE = await getSettings();
  return (
    <section id="contact" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal direction="left">
            <p className="kicker">Report for Duty</p>
            <h2 className="section-title mt-4 text-4xl sm:text-5xl">Begin Your March to the <span className="tricolour-text">Academy</span></h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Fill in your details and a mentor — not a salesperson — will call you back with an honest
              assessment of your entry, timeline and preparation plan. No spam, ever.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-gold-400 shadow-[var(--shadow-raised)]" aria-hidden>📍</span>
                <div>
                  <p className="font-display font-bold uppercase tracking-wide text-ink">Academy Campus</p>
                  <p className="text-sm text-ink-soft">{SITE.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-gold-400 shadow-[var(--shadow-raised)]" aria-hidden>📞</span>
                <div>
                  <p className="font-display font-bold uppercase tracking-wide text-ink">Call the Ops Room</p>
                  <p className="text-sm text-ink-soft">
                    <a href={telHref(SITE.phone1)} className="hover:text-saffron-700">{SITE.phone1}</a> · <a href={telHref(SITE.phone2)} className="hover:text-saffron-700">{SITE.phone2}</a>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-gold-400 shadow-[var(--shadow-raised)]" aria-hidden>✉️</span>
                <div>
                  <p className="font-display font-bold uppercase tracking-wide text-ink">Write to Us</p>
                  <a href={`mailto:${SITE.email}`} className="text-sm text-ink-soft hover:text-saffron-700">{SITE.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-[var(--shadow-raised)]" style={{ background: "linear-gradient(180deg,#4ce87d,#1da851)" }} aria-hidden>✆</span>
                <div>
                  <p className="font-display font-bold uppercase tracking-wide text-ink">WhatsApp</p>
                  <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-soft hover:text-tri-green-700">Chat instantly with our team →</a>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex gap-3">
              {([
                { label: "YouTube", href: SITE.youtube, icon: "youtube" as const },
                { label: "Instagram", href: SITE.instagram, icon: "instagram" as const },
                { label: "Telegram", href: SITE.telegram, icon: "telegram" as const },
              ]).map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-ink shadow-[var(--shadow-raised)] transition-all duration-300 hover:-translate-y-1 hover:text-saffron-700"
                  style={{ background: "linear-gradient(180deg,#fffdf7,#efe7d3)" }}>
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal direction="right" delay={120}>
            <div className="skeu-panel p-8 sm:p-10">
              <div className="tricolour-bar -mx-8 -mt-8 mb-8 h-1.5 sm:-mx-10 sm:-mt-10" aria-hidden />
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
