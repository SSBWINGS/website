import { getPublished } from "@/lib/content";
import { CTA } from "@/lib/section-defaults";
import CtaBanner from "./CtaBanner";

export default async function CtaBannerSection() {
  const content = await getPublished("cta", CTA);
  return <CtaBanner content={content} />;
}
