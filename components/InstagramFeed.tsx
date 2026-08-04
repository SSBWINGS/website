import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { SITE } from "@/lib/data";

export default function InstagramFeed() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: "linear-gradient(135deg,#fff4e6 0%, #faf6ec 45%, #e9f7e9 100%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1840px] px-4 sm:px-8">
        <SectionHeading
          center
          kicker="@ssbwings on Instagram"
          title={<>Live from the <span className="tricolour-text">Feed</span></>}
          subtitle="84K+ aspirants follow SSBWINGS for daily reels, results, tips and motivation. Follow along and never miss a batch announcement."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Follow card */}
          <Reveal direction="left">
            <div className="skeu-panel p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-plate)]"
                style={{ background: "linear-gradient(45deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888)" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-11 w-11" aria-hidden>
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07zM12 6.87a5.13 5.13 0 1 0 0 10.26 5.13 5.13 0 0 0 0-10.26zm0 8.46a3.33 3.33 0 1 1 0-6.66 3.33 3.33 0 0 1 0 6.66zm6.54-8.66a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                </svg>
              </div>
              <p className="mt-5 font-display text-3xl font-extrabold uppercase gold-text">@ssbwings</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[["84K+", "Followers"], ["2,100+", "Posts"], ["677+", "Recos"]].map(([v, l]) => (
                  <div key={l} className="skeu-inset px-2 py-3">
                    <p className="font-display text-xl font-black text-ink">{v}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">{l}</p>
                  </div>
                ))}
              </div>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-saffron btn-shine mt-6 w-full">
                Follow on Instagram
              </a>
            </div>
          </Reveal>

          {/* Live profile embed */}
          <Reveal direction="right" delay={120}>
            <div className="skeu-panel overflow-hidden p-3">
              <div className="tricolour-bar mb-3 h-1 w-full rounded" aria-hidden />
              <iframe
                src="https://www.instagram.com/ssbwings/embed/"
                title="SSBWINGS Instagram feed"
                className="h-[560px] w-full rounded-xl bg-white"
                loading="lazy"
                scrolling="no"
              />
              <p className="px-2 py-2 text-center text-xs text-ink-soft">
                Live reels &amp; posts from Instagram. If the feed doesn&apos;t load,{" "}
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-saffron-700 underline">open @ssbwings →</a>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
