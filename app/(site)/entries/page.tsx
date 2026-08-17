import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import CmsHero from "@/components/CmsHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CtaBanner from "@/components/CtaBannerSection";
import { JOIN_ROUTES } from "@/lib/data";
import { getPublished } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/media";
import { GATEWAYS as GATEWAYS_DEFAULT } from "@/lib/section-defaults";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("entries");
}

const STAGE_STYLE: Record<string, string> = {
  "After 10+2": "bg-saffron-500 text-white",
  "After Graduation": "bg-chakra text-white",
  "For Serving Personnel": "bg-army-500 text-white",
};

export default async function EntriesPage() {
  const [gwDoc, routesDoc] = await Promise.all([
    getPublished<{ items: typeof GATEWAYS_DEFAULT }>("gateways", { items: GATEWAYS_DEFAULT }),
    getPublished<{ items: typeof JOIN_ROUTES }>("join_routes", { items: JOIN_ROUTES }),
  ]);
  const GATEWAYS = gwDoc.items?.length ? gwDoc.items : GATEWAYS_DEFAULT;
  const routes = routesDoc.items?.length ? routesDoc.items : JOIN_ROUTES;
  return (
    <main>
      <CmsHero pageKey="entries" />

      {/* Three gateways */}
      <section className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
          <SectionHeading
            center
            kicker="Where Do You Stand Today?"
            title={<>Three Gateways to a <span className="tricolour-text">Commission</span></>}
            subtitle="Your starting point decides your entry. Find the stage you're at, then explore the exact schemes for your chosen service below."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {GATEWAYS.map((g, i) => (
              <Reveal key={g.title} delay={i * 120}>
                <article className="card-lift skeu-panel h-full p-8">
                  <span className="text-5xl" aria-hidden>{g.icon}</span>
                  <h3 className="mt-4 font-display text-2xl font-bold uppercase text-ink">{g.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: g.body }} />
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {g.tags.map((t) => (
                      <li key={t} className="rounded-full bg-paper-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-soft shadow-[var(--shadow-pressed)]">{t}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Per-service entry routes */}
      {routes.map((svc, si) => (
        <section key={svc.id} className={`relative py-16 sm:py-20 ${si % 2 === 1 ? "bg-cream-dark/40" : ""}`}>
          <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]">
              {/* Service banner — sticks beside its own route cards on desktop */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <Reveal direction="left">
                  <div className="card-lift relative overflow-hidden rounded-2xl p-8 text-white shadow-[var(--shadow-plate)]">
                    <Image src={mediaUrl(svc.image)} alt="" fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover" />
                    <div className="absolute inset-0" style={{ background: svc.grad, opacity: 0.82 }} aria-hidden />
                    <div className="relative">
                      <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-white/80">{svc.motto}</p>
                      <h2 className="mt-2 font-display text-3xl font-extrabold uppercase sm:text-4xl">{svc.name}</h2>
                      <p className="mt-4 leading-relaxed text-white/90">{svc.intro}</p>
                      <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                        🏛️ {svc.academy}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Route cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {svc.routes.map((r, i) => (
                  <Reveal key={r.name} delay={(i % 2) * 90}>
                    <article className="skeu-panel card-lift flex h-full flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg font-bold uppercase leading-tight text-ink">{r.name}</h3>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-[var(--shadow-raised)] ${STAGE_STYLE[r.stage]}`}>
                          {r.stage}
                        </span>
                      </div>
                      <dl className="mt-3 space-y-2 text-sm">
                        <div className="flex gap-2">
                          <dt className="font-display font-bold uppercase tracking-wide text-saffron-700">Who</dt>
                          <dd className="text-ink-soft">{r.who}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="font-display font-bold uppercase tracking-wide text-saffron-700">How</dt>
                          <dd className="text-ink-soft">{r.how}</dd>
                        </div>
                      </dl>
                      <p className="mt-auto pt-3 text-xs font-semibold uppercase tracking-wide text-tri-green-700">
                        ★ {r.commission}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Common thread */}
      <section className="relative py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-8">
          <Reveal>
            <div className="skeu-plate p-8 sm:p-10">
              <p className="kicker justify-center">One Gate They All Pass Through</p>
              <h2 className="section-title mt-4 text-3xl sm:text-4xl">Every Route Ends at the <span className="tricolour-text">SSB</span></h2>
              <p className="mx-auto mt-4 max-w-2xl text-ink-soft">
                No matter the entry — written exam or direct shortlist — the final gate is the same
                5-day Services Selection Board. That is exactly what SSBWINGS prepares you for.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
