import Link from "next/link";
import Reveal from "./Reveal";
import CmsSectionHeading from "./CmsSectionHeading";
import VideoFacade from "./VideoFacade";
import { getSiteVideos } from "@/lib/videos";
import { SITE } from "@/lib/data";

/** Homepage video wall — the same YouTube links the admin adds under
 *  Resources, so the two stay in step automatically. */
export default async function VideosSection({ limit = 6 }: { limit?: number }) {
  const videos = await getSiteVideos(limit);
  if (!videos.length) return null;

  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        <CmsSectionHeading
          sectionKey="videos"
          fallback={{
            kicker: "Watch & Learn",
            title: 'From the <span class="tricolour-text">SSBWINGS</span> Channel',
            subtitle: "Recommendation interviews, SSB tips and campus life — straight from our aspirants and mentors.",
          }}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v, i) => (
            <Reveal key={v.id + i} delay={(i % 3) * 90}>
              <VideoFacade id={v.id} title={v.title} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/resources" className="btn btn-outline btn-shine">All videos &amp; resources →</Link>
          <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-ink btn-shine">
            Subscribe on YouTube ↗
          </a>
        </div>
      </div>
    </section>
  );
}
