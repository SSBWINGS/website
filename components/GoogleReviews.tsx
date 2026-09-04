import Image from "next/image";
import Reveal from "./Reveal";
import CmsSectionHeading from "./CmsSectionHeading";
import { getPublished } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/media";
import { GOOGLE_REVIEWS, GOOGLE_PLACE_URL, type GoogleReview } from "@/lib/homepage-defaults";
import { asArray } from "@/lib/shape";

function Stars({ n }: { n: number }) {
  const full = Math.max(0, Math.min(5, Math.round(n || 5)));
  return (
    <span className="text-gold-500" aria-label={`${full} out of 5 stars`}>
      {"★".repeat(full)}
      <span className="text-ink-soft/30">{"★".repeat(5 - full)}</span>
    </span>
  );
}

/** Google reviews wall. The admin pastes each review's link and its details in
 *  the CMS; the profile button always points at the Google Business listing. */
export default async function GoogleReviews() {
  const doc = await getPublished<{ items: GoogleReview[]; placeUrl: string }>("google_reviews", {
    items: GOOGLE_REVIEWS,
    placeUrl: GOOGLE_PLACE_URL,
  });
  const items = asArray<GoogleReview>(doc.items).filter((r) => r?.text || r?.name);
  if (!items.length) return null;

  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        <CmsSectionHeading
          sectionKey="google_reviews"
          fallback={{
            kicker: "Rated 5.0 on Google",
            title: 'What Aspirants <span class="tricolour-text">Say</span>',
            subtitle: "Unedited reviews from aspirants and parents on our Google Business profile.",
          }}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r, i) => (
            <Reveal key={(r.url || r.name) + i} delay={(i % 3) * 90}>
              <article className="skeu-panel card-lift flex h-full flex-col p-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-paper-2">
                    {r.avatar ? (
                      <Image src={mediaUrl(r.avatar)} alt="" fill sizes="44px" className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-ink-soft">
                        {(r.name || "G").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-bold uppercase text-ink">{r.name}</p>
                    <p className="text-xs text-ink-soft"><Stars n={r.rating} />{r.date ? ` · ${r.date}` : ""}</p>
                  </div>
                  <svg viewBox="0 0 24 24" className="ml-auto h-5 w-5 shrink-0" aria-hidden>
                    <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4h6.6c-.1 1.1-.9 2.8-2.5 3.9l3.9 3c2.3-2.1 3.5-5.2 3.5-8.7z" />
                    <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5l-3.9 3C3.4 21.3 7.4 24 12 24z" />
                    <path fill="#FBBC05" d="M5.3 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.6.4-2.4l-4-3C.5 8.3 0 10.1 0 12s.5 3.7 1.3 5.3l4-2.9z" />
                    <path fill="#EA4335" d="M12 4.8c2.2 0 3.7.9 4.5 1.7l3.4-3.3C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.3 6.7l4 3c1-2.9 3.6-4.9 6.7-4.9z" />
                  </svg>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">{r.text}</p>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    className="mt-4 text-xs font-semibold uppercase tracking-wide text-saffron-700 hover:underline">
                    Read on Google ↗
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href={doc.placeUrl || GOOGLE_PLACE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-shine">
            See all Google reviews ↗
          </a>
        </div>
      </div>
    </section>
  );
}
