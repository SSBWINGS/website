"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clampOffset, coverScale, cropRect, outputSize } from "@/lib/crop";

/** Longest edge kept from the source before cropping — bounds canvas memory
 *  on phone photos without visibly softening anything we output. */
const MAX_SOURCE = 2600;
/** Longest edge of the exported crop. */
const MAX_OUTPUT = 1800;

export type CropOptions = {
  /** Width ÷ height of the frame this image lands in. Omit for a free crop. */
  aspect?: number;
  /** Shown in the dialog so the admin knows where the image will appear. */
  label?: string;
  /** Set for avatars so the preview is masked as a circle. */
  round?: boolean;
};

const FREE_RATIOS: { label: string; value: number | null }[] = [
  { label: "Original", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:1", value: 3 },
];

/** Downscale the picked file once, so panning stays smooth on big photos. */
async function loadSource(file: File): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  const longest = Math.max(width, height);
  if (longest > MAX_SOURCE) {
    const s = MAX_SOURCE / longest;
    width = Math.round(width * s);
    height = Math.round(height * s);
  }
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  c.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return c;
}

/** The source rotated by a multiple of 90°, so cropping is plain arithmetic. */
function rotateCanvas(src: HTMLCanvasElement, deg: number): HTMLCanvasElement {
  if (deg % 360 === 0) return src;
  const quarter = ((deg % 360) + 360) % 360;
  const swap = quarter === 90 || quarter === 270;
  const out = document.createElement("canvas");
  out.width = swap ? src.height : src.width;
  out.height = swap ? src.width : src.height;
  const ctx = out.getContext("2d");
  if (!ctx) return src;
  ctx.translate(out.width / 2, out.height / 2);
  ctx.rotate((quarter * Math.PI) / 180);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  return out;
}

export default function ImageCropper({
  file,
  aspect,
  label,
  round = false,
  onDone,
}: CropOptions & { file: File; onDone: (result: File | null) => void }) {
  const [source, setSource] = useState<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ratio, setRatio] = useState<number | null>(aspect ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  /** Frame size in state — the transform depends on it, so reading the DOM
   *  during render would leave the first paint (and any resize) wrong. */
  const [view, setView] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const measure = () => setView({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Decode once; the rotated copy is derived from this on demand.
  useEffect(() => {
    let alive = true;
    loadSource(file)
      .then((c) => alive && setSource(c))
      .catch(() => alive && setError("That image could not be read. Try a JPG or PNG."));
    return () => {
      alive = false;
    };
  }, [file]);

  // A new rotation or ratio invalidates the current pan.
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  }, [rotation, ratio]);

  // Memoised: without this the whole image would be re-rotated on every
  // pointer move, which stutters badly on a large photo.
  const rotated = useMemo(() => (source ? rotateCanvas(source, rotation) : null), [source, rotation]);
  // The preview must be the ROTATED pixels — it is displayed at the rotated
  // dimensions, so showing the original here would stretch it.
  const preview = useMemo(() => (rotated ? rotated.toDataURL("image/webp", 0.9) : ""), [rotated]);
  const effW = rotated?.width ?? 0;
  const effH = rotated?.height ?? 0;
  /** No ratio chosen → the frame simply follows the image. */
  const boxRatio = ratio ?? (effW && effH ? effW / effH : 1);

  /** Scale at which the image exactly covers the frame (see lib/crop.ts). */
  const cover = coverScale({ imageW: effW, imageH: effH, viewW: view.w, viewH: view.h });

  /** Keep the image covering the frame, so no empty edges can be exported. */
  const clamp = useCallback(
    (next: { x: number; y: number }, z: number) => {
      if (!effW || !view.w) return next;
      return clampOffset({
        imageW: effW, imageH: effH, viewW: view.w, viewH: view.h,
        zoom: z, offsetX: next.x, offsetY: next.y,
      });
    },
    [effW, effH, view.w, view.h],
  );

  useEffect(() => {
    setOffset((o) => clamp(o, zoom));
  }, [zoom, clamp]);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    setOffset(clamp({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) }, zoom));
  }
  const endDrag = () => {
    drag.current = null;
  };

  async function apply() {
    if (!rotated || !view.w) return;
    setBusy(true);
    setError(null);
    try {
      // Map the frame back onto the rotated image, in its own pixels.
      const rect = cropRect({
        imageW: effW, imageH: effH, viewW: view.w, viewH: view.h,
        zoom, offsetX: offset.x, offsetY: offset.y,
      });
      const size = outputSize(rect, MAX_OUTPUT);

      const out = document.createElement("canvas");
      out.width = size.width;
      out.height = size.height;
      const ctx = out.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(rotated, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, out.width, out.height);

      const blob: Blob | null = await new Promise((r) => out.toBlob(r, "image/webp", 0.9));
      if (!blob) throw new Error("Could not export the image");
      onDone(new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" }));
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Could not process that image.");
    }
  }

  const btn = "rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 p-4" role="dialog" aria-modal="true" aria-label="Crop image">
      <div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Position &amp; crop</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {label ? <>Fitting the frame used by <b>{label}</b>. </> : null}
              Drag to move, zoom with the slider, and rotate if it came out sideways.
            </p>
          </div>
          <button onClick={() => onDone(null)} className="rounded-full px-2 text-xl leading-none text-slate-400 hover:text-slate-700" aria-label="Cancel">
            ✕
          </button>
        </div>

        {/* Crop frame — exactly the shape the image will appear in. */}
        <div className="mt-4 flex justify-center">
          <div
            ref={viewRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={`relative w-full max-w-[440px] cursor-move touch-none select-none overflow-hidden bg-slate-800 ${round ? "rounded-full" : "rounded-lg"}`}
            style={{ aspectRatio: String(boxRatio) }}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt=""
                draggable={false}
                className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
                style={{
                  width: effW,
                  height: effH,
                  transform: `translate(-50%,-50%) translate(${offset.x}px, ${offset.y}px) scale(${cover * zoom})`,
                  transformOrigin: "center",
                }}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-sm text-slate-300">Loading…</div>
            )}
            {!round && (
              <div className="pointer-events-none absolute inset-0 border border-white/40" aria-hidden>
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/25" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-white/25" />
                <div className="absolute inset-x-0 top-1/3 h-px bg-white/25" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-white/25" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex flex-1 items-center gap-2 text-xs font-medium text-slate-600">
            Zoom
            <input
              type="range" min={1} max={4} step={0.01} value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-blue-600"
            />
          </label>
          <button type="button" onClick={() => setRotation((r) => r - 90)} className={btn} title="Rotate left">↺ 90°</button>
          <button type="button" onClick={() => setRotation((r) => r + 90)} className={btn} title="Rotate right">↻ 90°</button>
          <button
            type="button"
            onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); setRotation(0); }}
            className={btn}
          >
            Reset
          </button>
        </div>

        {/* Only offered where the destination has no fixed shape. */}
        {aspect === undefined && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Shape</span>
            {FREE_RATIOS.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => setRatio(r.value)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${
                  ratio === r.value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => onDone(null)} className={btn} disabled={busy}>Cancel</button>
          <button
            type="button"
            onClick={apply}
            disabled={busy || !source}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {busy ? "Working…" : "Use this crop"}
          </button>
        </div>
      </div>
    </div>
  );
}
