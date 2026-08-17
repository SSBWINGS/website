import { getPublished } from "@/lib/content";
import { DAYS } from "@/lib/data";
import Journey from "./Journey";

/** Server wrapper: reads the CMS 'journey' doc and feeds the interactive
 *  Journey component, falling back to the bundled 5-day timeline. */
export default async function JourneySection({ heading = true }: { heading?: boolean }) {
  const doc = await getPublished<{ items: typeof DAYS }>("journey", { items: DAYS });
  const days = doc.items?.length ? doc.items : DAYS;
  return <Journey heading={heading} days={days} />;
}
