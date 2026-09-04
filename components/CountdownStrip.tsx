import { getPublished } from "@/lib/content";
import { COUNTDOWN, type CountdownDoc } from "@/lib/countdown-defaults";
import { asArray } from "@/lib/shape";
import CountdownTicker from "./CountdownTicker";

export default async function CountdownStrip() {
  const doc = await getPublished<CountdownDoc>("countdown", COUNTDOWN);
  const items = asArray<CountdownDoc["items"][number]>(doc.items);
  if (!items.length) return null;

  const bg = doc.bg || "#0a1524";
  const text = doc.textColor || "#ffffff";
  const kickerColor = doc.kickerColor || "#f2d519";

  return (
    <section className="relative overflow-hidden py-10 sm:py-12" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: kickerColor }}>
            {doc.kicker || COUNTDOWN.kicker}
          </span>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: text }}>{doc.heading}</h2>
        </div>
        <CountdownTicker items={items} textColor={text} />
      </div>
    </section>
  );
}
