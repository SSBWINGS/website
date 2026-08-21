import Reveal from "./Reveal";

/** Kicker size presets an admin can pick in the CMS. */
export const KICKER_SIZES: Record<string, string> = {
  xs: "!text-[10px]",
  sm: "!text-xs",
  md: "", // theme default
  lg: "!text-base",
  xl: "!text-lg",
};

export default function SectionHeading({
  kicker,
  kickerSize = "md",
  title,
  subtitle,
  center = false,
  light = false,
}: {
  kicker: string;
  kickerSize?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      <p className={`kicker ${center ? "justify-center" : ""} ${light ? "!text-gold-300" : ""} ${KICKER_SIZES[kickerSize] ?? ""}`}>{kicker}</p>
      <h2 className={`section-title mt-4 text-4xl sm:text-5xl ${light ? "!text-white" : ""}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-lg ${center ? "mx-auto" : ""} ${light ? "text-navy-100/85" : "text-ink-soft"}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
