/** Geometry for the admin image cropper.
 *
 *  Pure and dependency-free so it can be unit-tested without a DOM: the crop
 *  dialog shows the image scaled to *cover* a frame, and this maps that frame
 *  back onto the source pixels the canvas should copy.
 */

export type CropInput = {
  /** Source size after any 90° rotation has been applied. */
  imageW: number;
  imageH: number;
  /** The crop frame on screen. */
  viewW: number;
  viewH: number;
  /** 1 = image exactly covers the frame. */
  zoom: number;
  /** Pan, in screen pixels, of the image centre from the frame centre. */
  offsetX: number;
  offsetY: number;
};

export type CropRect = { sx: number; sy: number; sw: number; sh: number };

/** Scale at which the image just covers the frame, before zoom. */
export function coverScale(i: Pick<CropInput, "imageW" | "imageH" | "viewW" | "viewH">): number {
  if (!i.imageW || !i.imageH || !i.viewW || !i.viewH) return 1;
  return Math.max(i.viewW / i.imageW, i.viewH / i.imageH);
}

/** How far the image may be panned before an edge would enter the frame. */
export function panBounds(i: CropInput): { maxX: number; maxY: number } {
  const s = coverScale(i) * i.zoom;
  return {
    maxX: Math.max(0, (i.imageW * s - i.viewW) / 2),
    maxY: Math.max(0, (i.imageH * s - i.viewH) / 2),
  };
}

/** Clamp a pan so the image always fills the frame — no blank edges can be
 *  exported, whatever the admin drags. */
export function clampOffset(i: CropInput): { x: number; y: number } {
  const { maxX, maxY } = panBounds(i);
  return {
    x: Math.min(maxX, Math.max(-maxX, i.offsetX)),
    y: Math.min(maxY, Math.max(-maxY, i.offsetY)),
  };
}

/** The source-pixel rectangle currently framed. Always inside the image. */
export function cropRect(i: CropInput): CropRect {
  const s = coverScale(i) * i.zoom;
  const sw = Math.min(i.imageW, i.viewW / s);
  const sh = Math.min(i.imageH, i.viewH / s);
  const cx = i.imageW / 2 - i.offsetX / s;
  const cy = i.imageH / 2 - i.offsetY / s;
  return {
    sx: Math.max(0, Math.min(i.imageW - sw, cx - sw / 2)),
    sy: Math.max(0, Math.min(i.imageH - sh, cy - sh / 2)),
    sw,
    sh,
  };
}

/** Output size for a crop, capped on its longest edge. */
export function outputSize(rect: CropRect, maxEdge: number): { width: number; height: number } {
  const scale = Math.min(1, maxEdge / Math.max(rect.sw, rect.sh));
  return {
    width: Math.max(1, Math.round(rect.sw * scale)),
    height: Math.max(1, Math.round(rect.sh * scale)),
  };
}
