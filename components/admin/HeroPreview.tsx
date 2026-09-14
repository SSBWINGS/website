"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { asArray } from "@/lib/shape";
import { HEADING_REM, HEADING_SIZE, headingPercent, stepHeading } from "@/lib/hero-heading";
import { useTypewriter } from "@/components/useTypewriter";
import { HERO } from "@/lib/section-defaults";

/**
 * Preview of the homepage hero on a phone and on a desktop, for the hero
 * editor: the admin's text exactly as the live site sets it — same fonts,
 * sizes, colours and line breaks — with the photo slider left out (an empty
 * frame holds its place). The hero is laid out at the real device width and
 * scaled down, so text wraps exactly where the site wraps it. Follows the
 * draft as it is typed, before anything is published.
 *
 * Mirrors Hero.tsx and HeroShowcase.tsx. Sizes are in px from each device's
 * root font size rather than rem, because rem here would follow the admin's
 * own window, not the device being previewed.
 */

type Form = Record<string, unknown>;
export type HeroPreviewData = {
  stats: { value: number; label: string; suffix?: string }[];
  /** Caption of the slide the live site opens on. */
  slide: { name?: string; academy?: string; term?: string } | null;
};
type Props = { form: Form; setField: (key: string, value: unknown) => void; data?: unknown };

/** Each device's screen in CSS px — desktop 16:9, phone 9:16 — and its root
 *  font size (globals.css bumps the root to 104% from 1280px wide). */
const PHONE = { width: 360, height: 640, root: 16 } as const;
const DESKTOP = { width: 1280, height: 720, root: 16.64 } as const;

/** What surrounds the two screens, for fitting them into the window. Across:
 *  the gap between them, the phone's bezel, the browser frame's border, and
 *  the size controls' column when they sit beside the screens. Down: each
 *  screen's caption and frame chrome, the size controls when they sit below,
 *  and a little breathing room above the window's edge. */
const FIT = {
  gapX: 24, phoneBezelX: 20, desktopBorderX: 2, controlsW: 240,
  chromeY: 60, controlsY: 112, marginY: 16, minScreen: 200,
} as const;
const SCREEN_RATIO = 16 / 9 + 9 / 16; // total width of both screens per px of height

const DISPLAY = 'var(--font-barlow), "Arial Narrow", sans-serif';
const SANS = "var(--font-inter), ui-sans-serif, system-ui, sans-serif";
const INK = "var(--color-ink)";
const INK_SOFT = "var(--color-ink-soft)";

/** The editor's HTML with anything executable removed. The rich-text editor
 *  already renders this same HTML, so this is belt and braces. */
function cleanHtml(html: string): string {
  const doc = new DOMParser().parseFromString(`<div>${html || ""}</div>`, "text/html");
  doc.querySelectorAll("script,style,iframe,object,embed,link,meta,base,form").forEach((n) => n.remove());
  doc.querySelectorAll("*").forEach((el) => {
    for (const a of [...el.attributes]) {
      if (/^on/i.test(a.name) || (/^(href|src|xlink:href|action)$/i.test(a.name) && /^\s*(javascript|data|vbscript):/i.test(a.value))) {
        el.removeAttribute(a.name);
      }
    }
  });
  return doc.body.firstElementChild?.innerHTML ?? "";
}

/** Lays children out at `width` and shows them at `scale`. Transform, not
 *  zoom, so line breaking happens at full size and matches the site. */
function Scaled({ width, scale, children }: { width: number; scale: number; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const update = () => setHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div style={{ position: "relative", width: width * scale, height: height * scale, overflow: "hidden" }}>
      <div ref={inner} style={{ position: "absolute", left: 0, top: 0, width, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        {children}
      </div>
    </div>
  );
}

/** The screens' height, and where the size controls go: as tall as fits
 *  both screens side by side in the preview's width, and everything in the
 *  window below the preview's top, so the whole preview is visible without
 *  scrolling the page. Controls go beside the screens on short, wide windows
 *  and below them on tall ones — whichever leaves the screens bigger. */
function useScreenFit() {
  const [row, ref] = useState<HTMLDivElement | null>(null);
  const [fit, setFit] = useState({ height: 0, beside: false });
  useEffect(() => {
    if (!row) return;
    const measure = () => {
      const across = row.clientWidth - FIT.gapX - FIT.phoneBezelX - FIT.desktopBorderX;
      const down = window.innerHeight - (row.getBoundingClientRect().top + window.scrollY) - FIT.chromeY - FIT.marginY;
      const below = Math.min(across / SCREEN_RATIO, down - FIT.controlsY);
      const beside = Math.min((across - FIT.gapX - FIT.controlsW) / SCREEN_RATIO, down);
      const next = beside > below
        ? { height: Math.max(FIT.minScreen, Math.floor(beside)), beside: true }
        : { height: Math.max(FIT.minScreen, Math.floor(below)), beside: false };
      setFit((f) => (f.height === next.height && f.beside === next.beside ? f : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [row]);
  return { ref, ...fit };
}

/** Width inside an element's scrollbar, kept up to date: the scale for the
 *  page drawn in it. */
function useInnerWidth() {
  const [el, ref] = useState<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, [el]);
  return { ref, width };
}

type Resolved = {
  str: (k: string) => string;
  typed: string;
  paragraph: string;
  rating: string;
  data: HeroPreviewData;
};

/** The hero itself, set at one device's real width. */
function HeroLayout({ form, phone, v }: { form: Form; phone: boolean; v: Resolved }) {
  const root = phone ? PHONE.root : DESKTOP.root;
  const r = (rem: number) => rem * root; // rem → px on this device
  const pct = headingPercent(phone ? form.headingSizeMobile : form.headingSizeDesktop);
  const headingPx = r(phone ? HEADING_REM.phone : HEADING_REM.desktop) * (pct / 100);
  const { str, data } = v;

  // The hero's buttons: site colours from .btn-saffron / .btn-ink, sizes from
  // .hero-btn for this device.
  const button = (label: string, primary: boolean) => (
    <span
      className={`btn ${primary ? "btn-saffron" : "btn-ink"}`}
      style={{
        cursor: "default", gap: r(0.55), minHeight: r(phone ? 3.75 : 3.3),
        paddingBlock: r(0.9), paddingInline: r(phone ? 1.75 : 2), borderRadius: r(0.7), maxWidth: "100%",
        fontSize: phone ? Math.min(r(1.3125), PHONE.width * 0.061) : r(1.0625), lineHeight: 1,
      }}
    >
      {label}
      {primary && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );

  const copy = (
    <div>
      {str("badge") && (
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: r(0.5), marginBottom: r(1),
            border: "1px solid rgba(43,36,22,0.14)", borderRadius: 999, background: "rgba(255,255,255,0.7)",
            paddingInline: r(1), paddingBlock: r(0.375), boxShadow: "var(--shadow-raised)",
            fontFamily: SANS, fontSize: r(0.82), lineHeight: 1.5, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.05em", color: INK_SOFT,
          }}
        >
          <span className="chakra" style={{ fontSize: 14, flexShrink: 0 }} aria-hidden /> {str("badge")}
        </div>
      )}

      <div
        style={{
          fontFamily: DISPLAY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.01em",
          lineHeight: 0.98, fontSize: headingPx, textAlign: "left", color: INK,
        }}
      >
        <span style={{ display: "block" }}>{str("headingLine1")}</span>
        <span style={{ display: "block" }}>{str("headingLine2")}</span>
        <span style={{ display: "block" }}>
          <span className="tricolour-text">{str("typedPrefix")}{v.typed}</span>
          <span className="animate-pulse" style={{ color: "var(--color-saffron-600)" }}>|</span>
        </span>
      </div>

      <div
        className="rich-html [&_strong]:text-ink"
        style={{ marginTop: r(1), maxWidth: r(36), fontFamily: SANS, fontSize: r(1.1), lineHeight: 1.625, color: INK_SOFT }}
        dangerouslySetInnerHTML={{ __html: v.paragraph }}
      />

      <div style={{ marginTop: r(1.5), display: "flex", flexWrap: "wrap", alignItems: "center", gap: r(1), justifyContent: phone ? "center" : "flex-start" }}>
        {button(str("primaryCta") || HERO.primaryCta, true)}
        {button(str("secondaryCta") || HERO.secondaryCta, false)}
      </div>

      <div style={{ marginTop: r(1.25), display: "flex", alignItems: "center", gap: r(0.5), fontFamily: SANS, fontSize: r(0.96), lineHeight: 1.55, color: INK_SOFT }}>
        <span style={{ display: "flex", color: "var(--color-gold-500)" }} aria-hidden>★★★★★</span>
        <span dangerouslySetInnerHTML={{ __html: v.rating }} />
      </div>
    </div>
  );

  const label: CSSProperties = { fontFamily: DISPLAY, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: INK_SOFT, lineHeight: 1.5 };
  const caption: CSSProperties = { fontFamily: DISPLAY, fontSize: r(0.96), fontWeight: 700, textTransform: "uppercase", color: "var(--color-saffron-700)", lineHeight: 1.55, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
  const slide = data.slide;

  // The photo slider's frame and caption, with the photo itself left out.
  const showcase = (
    <div>
      <div className="photo-frame" style={{ borderRadius: r(1) }}>
        <div
          style={{ position: "relative", aspectRatio: "3 / 2", borderRadius: r(0.6), background: "#0a1524", display: "grid", placeItems: "center" }}
          title="Photo slider (photos are not shown in the preview)"
        >
          <svg viewBox="0 0 24 24" width={r(3)} height={r(3)} fill="none" aria-hidden style={{ opacity: 0.35 }}>
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="#fff" strokeWidth="1.5" />
            <circle cx="9" cy="10" r="1.8" stroke="#fff" strokeWidth="1.5" />
            <path d="m4 18 5.5-5.5L13 16l3-3 4 4" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {slide && (slide.term || slide.academy) && (
        <div style={{ marginTop: r(0.75), display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: r(1), paddingInline: 4 }}>
          <div style={{ minWidth: 0 }}>
            {slide.term && <><p style={label}>Passed out</p><p style={caption}>{slide.term}</p></>}
          </div>
          <div style={{ minWidth: 0, textAlign: "right" }}>
            {slide.academy && <><p style={label}>Academy</p><p style={caption}>{slide.academy}</p></>}
          </div>
        </div>
      )}
      {slide?.name && (
        <p style={{ marginTop: r(0.25), paddingInline: 4, textAlign: "center", fontFamily: DISPLAY, fontSize: r(0.96), fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em", color: INK, lineHeight: 1.55 }}>
          {slide.name}
        </p>
      )}
    </div>
  );

  return (
    <section style={{ position: "relative", overflow: "hidden", fontSize: root, color: INK }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#fff8ec 0%, #faf6ec 55%, #f3ecd9 100%)" }} aria-hidden />
      <div style={{ position: "absolute", insetInline: 0, top: 0, height: r(18), opacity: 0.7, background: "linear-gradient(180deg, rgba(255,153,51,0.16), transparent)" }} aria-hidden />
      <div style={{ position: "absolute", insetInline: 0, bottom: 0, height: r(18), opacity: 0.6, background: "linear-gradient(0deg, rgba(19,136,8,0.12), transparent)" }} aria-hidden />

      <div
        style={{
          position: "relative", display: "grid", alignItems: "center", gap: r(2),
          gridTemplateColumns: phone ? "minmax(0,1fr)" : "minmax(0,1fr) minmax(0,1.08fr)",
          paddingInline: r(phone ? 1 : 2), paddingTop: r(phone ? 1.75 : 2.5), paddingBottom: r(2.5),
        }}
      >
        {phone ? <>{showcase}{copy}</> : <>{copy}{showcase}</>}
      </div>

      <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${phone ? 2 : 4}, minmax(0,1fr))`, gap: r(0.75), paddingInline: r(phone ? 1 : 2), paddingBottom: r(1) }}>
        {data.stats.map((s, i) => (
          <div key={s.label + i} className="skeu-plate" style={{ padding: `${r(0.875)}px ${r(1)}px`, borderRadius: r(0.9), textAlign: "center" }}>
            <p className="gold-text" style={{ fontFamily: DISPLAY, fontSize: r(phone ? 2.1 : 2.5), fontWeight: 900, lineHeight: 1 }}>
              {Number(s.value || 0).toLocaleString("en-IN")}{s.suffix ?? "+"}
            </p>
            <p style={{ marginTop: r(0.25), fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: INK_SOFT, fontFamily: SANS, lineHeight: 1.5 }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** − / slider / + for one device's heading size. */
function SizeControl({ label, value, onChange, basePx }: { label: string; value: unknown; onChange: (v: number) => void; basePx: number }) {
  const pct = headingPercent(value);
  const btn = "inline-flex h-8 shrink-0 items-center justify-center gap-px rounded-lg border border-slate-300 bg-white px-2 font-semibold leading-none text-slate-700 hover:bg-slate-50 disabled:opacity-40";
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <span className="text-xs tabular-nums text-slate-500">
          {pct}% · ≈{Math.round((basePx * pct) / 100)}px
          {pct !== HEADING_SIZE.default && (
            <button type="button" onClick={() => onChange(HEADING_SIZE.default)} className="ml-2 font-medium text-blue-600 hover:underline">Reset</button>
          )}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <button type="button" className={btn} onClick={() => onChange(stepHeading(pct, -1))} disabled={pct <= HEADING_SIZE.min} aria-label={`${label}: smaller`}>
          <span className="text-xs">A</span>−
        </button>
        <input
          type="range" min={HEADING_SIZE.min} max={HEADING_SIZE.max} step={HEADING_SIZE.step} value={pct}
          onChange={(e) => onChange(headingPercent(e.target.value))}
          aria-label={label} className="min-w-0 flex-1 accent-blue-600"
        />
        <button type="button" className={btn} onClick={() => onChange(stepHeading(pct, 1))} disabled={pct >= HEADING_SIZE.max} aria-label={`${label}: bigger`}>
          <span className="text-base">A</span>+
        </button>
      </div>
    </div>
  );
}

export default function HeroPreview({ form, setField, data }: Props) {
  const screens = useScreenFit();
  const desktop = useInnerWidth();
  const phone = useInnerWidth();
  const h = screens.height;
  const scroller = "overflow-y-auto overflow-x-hidden";
  const thin = { scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" } as const;

  // The page is admin-only and rendered after mount (the HTML cleaner needs
  // the browser), so the server and first client render agree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const str = (k: string) => (typeof form[k] === "string" ? (form[k] as string) : "");
  const typedWordsKey = asArray<string>(form.typedWords).filter(Boolean).join("\n");
  // Same fallback as the live hero: its default words if none are set.
  const words = useMemo(() => (typedWordsKey ? typedWordsKey.split("\n") : (HERO.typedWords as string[])), [typedWordsKey]);
  const typed = useTypewriter(words);
  const paragraph = useMemo(() => (mounted ? cleanHtml(str("paragraph")) : ""), [mounted, form.paragraph]); // eslint-disable-line react-hooks/exhaustive-deps
  const rating = useMemo(() => (mounted ? cleanHtml(str("rating")) : ""), [mounted, form.rating]); // eslint-disable-line react-hooks/exhaustive-deps

  const d = (data ?? {}) as Partial<HeroPreviewData>;
  const resolved: Resolved = {
    str, typed, paragraph, rating,
    data: { stats: Array.isArray(d.stats) ? d.stats : [], slide: d.slide ?? null },
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Preview</h2>
        <p className="text-xs text-slate-500">
          Live text on real screen shapes · scroll inside a screen for the rest · photos left out · updates as you type
        </p>
      </div>

      {mounted && (
        <div ref={screens.ref} className={`mt-3 flex justify-center gap-6 ${screens.beside ? "flex-row items-start" : "flex-col items-center"}`}>
          <div className="flex min-w-0 items-start justify-center gap-6">
            {/* Desktop — a 16:9 screen */}
            <figure className="min-w-0" style={{ width: h ? (h * 16) / 9 + FIT.desktopBorderX : undefined }}>
              <figcaption className="mb-2 truncate text-xs font-medium text-slate-500">Desktop · 16:9 screen (1280 × 720)</figcaption>
              <div className="overflow-hidden rounded-lg border border-slate-300 shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-3 py-2" aria-hidden>
                  {[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-slate-300" />)}
                  <span className="ml-3 h-4 flex-1 rounded bg-white" />
                </div>
                <div ref={desktop.ref} className={scroller} style={{ height: h, ...thin }}>
                  {h > 0 && desktop.width > 0 && (
                    <Scaled width={DESKTOP.width} scale={desktop.width / DESKTOP.width}>
                      <HeroLayout form={form} phone={false} v={resolved} />
                    </Scaled>
                  )}
                </div>
              </div>
            </figure>

            {/* Phone — a 9:16 screen */}
            <figure className="shrink-0" style={{ width: h ? (h * 9) / 16 + FIT.phoneBezelX : undefined }}>
              <figcaption className="mb-2 truncate text-xs font-medium text-slate-500">Phone · 9:16 (360 × 640)</figcaption>
              <div className="rounded-[1.6rem] border-[10px] border-slate-800 bg-slate-800 shadow-md">
                <div className="mx-auto mb-1.5 h-1.5 w-12 rounded-full bg-slate-600" aria-hidden />
                <div ref={phone.ref} className={`${scroller} rounded-[0.9rem] bg-white`} style={{ height: h, ...thin }}>
                  {h > 0 && phone.width > 0 && (
                    <Scaled width={PHONE.width} scale={phone.width / PHONE.width}>
                      <HeroLayout form={form} phone v={resolved} />
                    </Scaled>
                  )}
                </div>
              </div>
            </figure>
          </div>

          {/* Heading sizes — beside the screens or below them, whichever fits */}
          <div
            className={screens.beside ? "shrink-0 space-y-3 pt-6" : "grid w-full gap-3 sm:grid-cols-2"}
            style={screens.beside ? { width: FIT.controlsW } : { maxWidth: (h * 16) / 9 + (h * 9) / 16 + FIT.gapX + FIT.phoneBezelX + FIT.desktopBorderX }}
          >
            <SizeControl
              label="Heading size — tablets & desktops"
              value={form.headingSizeDesktop}
              onChange={(v) => setField("headingSizeDesktop", v)}
              basePx={HEADING_REM.desktop * 16}
            />
            <SizeControl
              label="Heading size — phones"
              value={form.headingSizeMobile}
              onChange={(v) => setField("headingSizeMobile", v)}
              basePx={HEADING_REM.phone * 16}
            />
          </div>
        </div>
      )}
    </section>
  );
}
