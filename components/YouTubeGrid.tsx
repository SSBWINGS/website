import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import VideoFacade from "./VideoFacade";
import { getSiteVideos } from "@/lib/videos";
import { SITE } from "@/lib/data";

export default async function YouTubeGrid({ heading = true }: { heading?: boolean }) {
  const videos = await getSiteVideos();
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-[1840px] px-4 sm:px-8">
        {heading && (
          <SectionHeading
            center
            kicker="Straight from the Cadets"
            title={<>Recommendation <span className="tricolour-text">Interviews</span></>}
            subtitle="Unscripted conversations with cadets who cracked the SSB after training with us. Watch their journeys in their own words."
          />
        )}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((v, i) => (
            <Reveal key={v.id + i} delay={(i % 3) * 90}><VideoFacade id={v.id} title={v.title} /></Reveal>
          ))}
        </div>
        <Reveal delay={150} className="mt-10 text-center">
          <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-shine">
            ▶ Watch More on YouTube
          </a>
        </Reveal>
      </div>
    </section>
  );
}
