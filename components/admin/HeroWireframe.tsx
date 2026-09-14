"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { asArray } from "@/lib/shape";
import {
  HEADING_REM, HEADING_SIZE, headingPercent, stepHeading, richTextAlign, richTextBlocks,
} from "@/lib/hero-heading";

/**
 * Wireframe of the homepage hero on a phone and on a desktop, for the hero
 * editor. Frames and structure only: every piece of text is drawn as grey
 * bars. The bars are the admin's real text set invisibly in the site's own
 * fonts and sizes, at the real device width, then scaled down — so each bar
 * is as long as the words it stands for and wraps exactly where the live site
 * does. Changing a heading, the paragraph or a heading size shows up here as
 * you type, before anything is published.
 */

type Form = Record<string, unknown>;
type Props = { form: Form; setField: (key: string, value: unknown) => void };

/** Design width and root font size of each device (globals.css bumps the
 *  root to 104% from 1280px wide). */
const PHONE = { width: 360, root: 16, screen: 740 } as const;
const DESKTOP = { width: 1280, root: 16.64 } as const;

const SHADE = { heading: "#475569", accent: "#94a3b8", text: "#cbd5e1", soft: "#e2e8f0", line: "#cbd5e1" };
const DISPLAY = 'var(--font-barlow), "Arial Narrow", sans-serif';
const SANS = "var(--font-inter), ui-sans-serif, system-ui, sans-serif";

/** Text as bars: the words are there (so widths and wrapping are real) but
 *  invisible, with a bar painted behind each line they occupy. */
function Bars({ text, color, thickness = 0.62 }: { text: string; color: string; thickness?: number }) {
  return (
    <span
      style={{
        background: `linear-gradient(${color},${color}) 0 55% / 100% ${thickness * 100}% no-repeat`,
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
        borderRadius: "0.14em",
      }}
    >
      <span style={{ opacity: 0 }}>{text}</span>
    </span>
  );
}

/** A plain placeholder block (image, number, small label). */
const Block = ({ w, h, color = SHADE.soft, style }: { w: CSSProperties["width"]; h: number; color?: string; style?: CSSProperties }) => (
  <div style={{ width: w, height: h, background: color, borderRadius: Math.min(6, h / 2), ...style }} />
);

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

/** Width of an element, kept up to date. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

/** The hero itself, drawn at one device's real width. Mirrors Hero.tsx. */
function HeroLayout({ form, phone }: { form: Form; phone: boolean }) {
  const root = phone ? PHONE.root : DESKTOP.root;
  const r = (rem: number) => rem * root; // rem → px on this device
  const pct = headingPercent(phone ? form.headingSizeMobile : form.headingSizeDesktop);
  const headingPx = r(phone ? HEADING_REM.phone : HEADING_REM.desktop) * (pct / 100);

  const str = (k: string) => (typeof form[k] === "string" ? (form[k] as string) : "");
  const words = asArray<string>(form.typedWords).filter(Boolean);
  // The typewriter line at its widest: the longest word fully typed.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const typedLine = `${str("typedPrefix")}${longest}`;
  const paragraph = richTextBlocks(str("paragraph"));
  const align = richTextAlign(str("paragraph"));
  const rating = richTextBlocks(str("rating")).join(" ");

  const button = (label: string, primary: boolean) => (
    <div
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: r(0.55),
        minHeight: r(phone ? 3.75 : 3.3), paddingBlock: r(0.9), paddingInline: r(phone ? 1.75 : 2),
        borderRadius: r(0.7), maxWidth: "100%",
        background: primary ? SHADE.accent : SHADE.heading,
        fontFamily: DISPLAY, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1,
        fontSize: phone ? Math.min(r(1.3125), PHONE.width * 0.061) : r(1.0625),
      }}
    >
      <Bars text={label} color="rgba(255,255,255,0.75)" thickness={0.7} />
      {primary && <Block w={18} h={3} color="rgba(255,255,255,0.75)" />}
    </div>
  );

  const copy = (
    <div>
      {str("badge") && (
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: r(0.5), marginBottom: r(1),
            border: `1px solid ${SHADE.line}`, borderRadius: 999, background: "#fff",
            paddingInline: r(1), paddingBlock: r(0.375),
            fontFamily: SANS, fontSize: r(0.82), fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.5,
          }}
        >
          <Block w={r(0.8)} h={r(0.8)} color={SHADE.accent} style={{ borderRadius: 999, flexShrink: 0 }} />
          <span><Bars text={str("badge")} color={SHADE.text} /></span>
        </div>
      )}

      <div
        style={{
          fontFamily: DISPLAY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.01em",
          lineHeight: 0.98, fontSize: headingPx, textAlign: "left",
        }}
      >
        {str("headingLine1") && <div><Bars text={str("headingLine1")} color={SHADE.heading} thickness={0.5} /></div>}
        {str("headingLine2") && <div><Bars text={str("headingLine2")} color={SHADE.heading} thickness={0.5} /></div>}
        {typedLine.trim() && (
          <div>
            <Bars text={typedLine} color={SHADE.accent} thickness={0.5} />
            <span style={{ display: "inline-block", width: "0.08em", height: "0.8em", marginLeft: "0.06em", background: SHADE.accent, verticalAlign: "-0.05em" }} />
          </div>
        )}
      </div>

      {paragraph.length > 0 && (
        <div style={{ marginTop: r(1), maxWidth: r(36), fontFamily: SANS, fontSize: r(1.1), lineHeight: 1.625, textAlign: align }}>
          {paragraph.map((b, i) => <div key={i}><Bars text={b} color={SHADE.text} thickness={0.55} /></div>)}
        </div>
      )}

      <div style={{ marginTop: r(1.5), display: "flex", flexWrap: "wrap", alignItems: "center", gap: r(1), justifyContent: phone ? "center" : "flex-start" }}>
        {button(str("primaryCta") || "Button", true)}
        {button(str("secondaryCta") || "Button", false)}
      </div>

      <div style={{ marginTop: r(1.25), display: "flex", alignItems: "center", gap: r(0.5), fontFamily: SANS, fontSize: r(0.96), lineHeight: 1.55 }}>
        <Block w={r(4.6)} h={r(0.8)} color={SHADE.text} style={{ flexShrink: 0 }} />
        {rating && <span><Bars text={rating} color={SHADE.soft} /></span>}
      </div>
    </div>
  );

  const showcase = (
    <div>
      <div style={{ border: `${r(0.45)}px solid ${SHADE.soft}`, borderRadius: r(1), background: "#fff", padding: r(0.3) }}>
        <div style={{ position: "relative", aspectRatio: "3 / 2", borderRadius: r(0.7), background: SHADE.soft, display: "grid", placeItems: "center" }}>
          <svg viewBox="0 0 24 24" width={r(3.5)} height={r(3.5)} fill="none" aria-hidden>
            <rect x="3" y="4" width="18" height="16" rx="2" stroke={SHADE.accent} strokeWidth="1.5" />
            <circle cx="9" cy="10" r="1.8" stroke={SHADE.accent} strokeWidth="1.5" />
            <path d="m4 18 5.5-5.5L13 16l3-3 4 4" stroke={SHADE.accent} strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <div style={{ position: "absolute", right: r(0.75), bottom: r(0.75), display: "flex", gap: 4 }}>
            <Block w={16} h={6} color={SHADE.accent} />
            {[0, 1, 2, 3].map((i) => <Block key={i} w={6} h={6} color="#fff" />)}
          </div>
        </div>
      </div>
      <div style={{ marginTop: r(0.75), display: "flex", justifyContent: "space-between", paddingInline: 4 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ display: "grid", gap: 6, justifyItems: i ? "end" : "start" }}>
            <Block w={r(4)} h={r(0.55)} color={SHADE.soft} />
            <Block w={r(7)} h={r(0.8)} color={SHADE.text} />
          </div>
        ))}
      </div>
      <Block w={r(6)} h={r(0.8)} color={SHADE.text} style={{ margin: `${r(0.5)}px auto 0` }} />
    </div>
  );

  return (
    <div style={{ background: "linear-gradient(180deg,#f8fafc,#f1f5f9)", fontSize: root }}>
      <div
        style={{
          display: "grid", alignItems: "center", gap: r(2),
          gridTemplateColumns: phone ? "minmax(0,1fr)" : "minmax(0,1fr) minmax(0,1.08fr)",
          paddingInline: r(phone ? 1 : 2), paddingTop: r(phone ? 1.75 : 2.5), paddingBottom: r(2.5),
        }}
      >
        {phone ? <>{showcase}{copy}</> : <>{copy}{showcase}</>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${phone ? 2 : 4}, minmax(0,1fr))`, gap: r(0.75), paddingInline: r(phone ? 1 : 2), paddingBottom: r(1) }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: "grid", justifyItems: "center", gap: 8, padding: `${r(0.875)}px ${r(1)}px`, borderRadius: r(1), border: `1px solid ${SHADE.soft}`, background: "#fff" }}>
            <Block w="45%" h={r(phone ? 2.1 : 2.5) * 0.8} color={SHADE.text} />
            <Block w="70%" h={9} color={SHADE.soft} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** − / slider / + for one device's heading size. */
function SizeControl({ label, value, onChange, basePx }: { label: string; value: unknown; onChange: (v: number) => void; basePx: number }) {
  const pct = headingPercent(value);
  const btn = "inline-flex h-8 shrink-0 items-center justify-center gap-px rounded-lg px-2 leading-none border border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40";
  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <span className="text-xs tabular-nums text-slate-500">
          {pct}% · ≈{Math.round((basePx * pct) / 100)}px
          {pct !== HEADING_SIZE.default && (
            <button type="button" onClick={() => onChange(HEADING_SIZE.default)} className="ml-2 font-medium text-blue-600 hover:underline">Reset</button>
          )}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
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

export default function HeroWireframe({ form, setField }: Props) {
  const desktop = useWidth<HTMLDivElement>();
  const phoneShown = 240; // px on screen
  const phoneScale = phoneShown / PHONE.width;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Layout preview</h2>
        <p className="text-xs text-slate-500">
          Wireframe of the hero only. Grey bars stand for your text and break onto new lines exactly where the live site does. Updates as you type.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Desktop */}
        <figure className="min-w-0 flex-1">
          <figcaption className="mb-2 text-xs font-medium text-slate-500">Desktop · 1280px wide</figcaption>
          <div className="overflow-hidden rounded-lg border border-slate-300 shadow-sm">
            <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-3 py-2" aria-hidden>
              {[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-slate-300" />)}
              <span className="ml-3 h-4 flex-1 rounded bg-white" />
            </div>
            <div ref={desktop.ref}>
              {desktop.width > 0 && (
                <Scaled width={DESKTOP.width} scale={desktop.width / DESKTOP.width}>
                  <HeroLayout form={form} phone={false} />
                </Scaled>
              )}
            </div>
          </div>
          <SizeControl
            label="Heading size — tablets & desktops"
            value={form.headingSizeDesktop}
            onChange={(v) => setField("headingSizeDesktop", v)}
            basePx={HEADING_REM.desktop * 16}
          />
        </figure>

        {/* Phone */}
        <figure className="mx-auto w-[16.5rem] shrink-0">
          <figcaption className="mb-2 text-xs font-medium text-slate-500">Phone · 360px wide (scroll inside)</figcaption>
          <div className="rounded-[2rem] border-[10px] border-slate-800 bg-slate-800 shadow-md">
            <div className="mx-auto mb-1.5 h-1.5 w-14 rounded-full bg-slate-600" aria-hidden />
            <div
              className="overflow-y-auto overflow-x-hidden rounded-[1.2rem] bg-white"
              style={{ width: phoneShown, height: PHONE.screen * phoneScale, scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}
            >
              <Scaled width={PHONE.width} scale={phoneScale}>
                <HeroLayout form={form} phone />
              </Scaled>
            </div>
          </div>
          <SizeControl
            label="Heading size — phones"
            value={form.headingSizeMobile}
            onChange={(v) => setField("headingSizeMobile", v)}
            basePx={HEADING_REM.phone * 16}
          />
        </figure>
      </div>
    </section>
  );
}
