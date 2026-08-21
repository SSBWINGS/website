import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/supabase/media";

import { KICKER_SIZES } from "./SectionHeading";

export default function PageHero({
  kicker,
  kickerSize = "md",
  title,
  subtitle,
  image,
  crumb,
}: {
  kicker: string;
  kickerSize?: string;
  title: React.ReactNode;
  subtitle?: string;
  image: string;
  crumb: string;
}) {
  return (
    <section className="page-hero relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <Image src={mediaUrl(image)} alt="" fill priority sizes="100vw" className="kenburns object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,248,236,0.82), rgba(250,246,236,0.92) 60%, #faf6ec)" }} />
      </div>
      <div className="tricolour-bar absolute inset-x-0 top-0 h-1.5" aria-hidden />

      <div className="relative mx-auto max-w-[1840px] px-4 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-16">
        <nav className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-soft" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-saffron-700">Home</Link>
          <span aria-hidden>›</span>
          <span className="text-saffron-700">{crumb}</span>
        </nav>
        <p className={`kicker ${KICKER_SIZES[kickerSize] ?? ""}`}>{kicker}</p>
        {typeof title === "string" ? (
          <h1 className="section-title mt-4 max-w-4xl text-5xl leading-[0.98] sm:text-6xl lg:text-7xl" dangerouslySetInnerHTML={{ __html: title }} />
        ) : (
          <h1 className="section-title mt-4 max-w-4xl text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">{title}</h1>
        )}
        {subtitle && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{subtitle}</p>}
      </div>
    </section>
  );
}
