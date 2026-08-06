import { getPublished } from "@/lib/content";
import { COUNTDOWN, type CountdownDoc } from "@/lib/countdown-defaults";
import CountdownTicker from "./CountdownTicker";

export default async function CountdownStrip() {
  const doc = await getPublished<CountdownDoc>("countdown", COUNTDOWN);
  if (!doc.items?.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#0a1524] py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">Mark your calendar</span>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{doc.heading}</h2>
        </div>
        <CountdownTicker items={doc.items} />
      </div>
    </section>
  );
}
