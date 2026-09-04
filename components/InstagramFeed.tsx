import Reveal from "./Reveal";
import CmsSectionHeading from "./CmsSectionHeading";
import { SocialIcon } from "./SocialIcons";
import { getSettings } from "@/lib/content";

export default async function InstagramFeed() {
  const SITE = await getSettings();
  const handle = (SITE.instagram || "").replace(/\/+$/, "").split("/").pop() || "ssbwings";

  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: "linear-gradient(135deg,#fff4e6 0%, #faf6ec 45%, #e9f7e9 100%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1840px] px-4 sm:px-8">
        <CmsSectionHeading
          sectionKey="instagram"
          center
          fallback={{
            kicker: `@${handle} on Instagram`,
            title: 'Live from the <span class="tricolour-text">Feed</span>',
            subtitle:
              "Daily reels, results, tips and motivation. Follow along and never miss a batch announcement.",
          }}
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Follow card */}
          <Reveal direction="left">
            <div className="skeu-panel p-8 text-center">
              {/* Both channels sit side by side — each icon opens its own channel. */}
              <div className="flex items-center justify-center gap-5">
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SSBWINGS on Instagram"
                  title="Instagram"
                  className="flex h-20 w-20 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-plate)] transition-transform duration-300 hover:-translate-y-1"
                  style={{ background: "linear-gradient(45deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888)" }}
                >
                  <SocialIcon name="instagram" className="h-11 w-11" />
                </a>
                <a
                  href={SITE.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SSBWINGS on YouTube"
                  title="YouTube"
                  className="flex h-20 w-20 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-plate)] transition-transform duration-300 hover:-translate-y-1"
                  style={{ background: "linear-gradient(180deg,#ff4e45,#ff0000 55%,#c40000)" }}
                >
                  <SocialIcon name="youtube" className="h-11 w-11" />
                </a>
              </div>

              <p className="mt-5 font-display text-3xl font-extrabold uppercase gold-text">@{handle}</p>
              <p className="mt-2 text-sm text-ink-soft">
                Reels, results and mentor tips on Instagram — full interviews and SSB breakdowns on YouTube.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-saffron btn-shine w-full">
                  Follow on Instagram
                </a>
                <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-shine w-full">
                  Subscribe on YouTube
                </a>
              </div>
            </div>
          </Reveal>

          {/* Live profile embed */}
          <Reveal direction="right" delay={120}>
            <div className="skeu-panel overflow-hidden p-3">
              <div className="tricolour-bar mb-3 h-1 w-full rounded" aria-hidden />
              <iframe
                src={`https://www.instagram.com/${handle}/embed/`}
                title="SSBWINGS Instagram feed"
                className="h-[560px] w-full rounded-xl bg-white"
                loading="lazy"
                scrolling="no"
              />
              <p className="px-2 py-2 text-center text-xs text-ink-soft">
                Live reels &amp; posts from Instagram. If the feed doesn&apos;t load,{" "}
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-saffron-700 underline">open @{handle} →</a>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
