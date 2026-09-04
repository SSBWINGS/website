import test from "node:test";
import assert from "node:assert/strict";
import { clampOffset, coverScale, cropRect, outputSize, type CropInput } from "./crop.ts";

/** A 4000×3000 photo (4:3) shown in a 600×200 frame (3:1) — the officer-banner case. */
const wide: CropInput = { imageW: 4000, imageH: 3000, viewW: 600, viewH: 200, zoom: 1, offsetX: 0, offsetY: 0 };

const close = (a: number, b: number, msg?: string) =>
  assert.ok(Math.abs(a - b) < 0.001, `${msg ?? ""} expected ${b}, got ${a}`);

test("cover scale fills the frame's tighter dimension", () => {
  // 600/4000 = 0.15, 200/3000 = 0.0667 → must take the larger so nothing gaps.
  close(coverScale(wide), 0.15);
});

test("an un-panned crop is centred and spans the full width", () => {
  const r = cropRect(wide);
  close(r.sw, 4000, "full width is visible");
  close(r.sh, 200 / 0.15, "height is the frame height in source pixels");
  close(r.sx, 0);
  close(r.sy, (3000 - r.sh) / 2, "vertically centred");
});

test("the crop never leaves the image, however far it is panned", () => {
  for (const [dx, dy] of [[99999, 99999], [-99999, -99999], [500, -400]]) {
    const r = cropRect({ ...wide, offsetX: dx, offsetY: dy });
    assert.ok(r.sx >= 0 && r.sy >= 0, "origin inside the image");
    assert.ok(r.sx + r.sw <= wide.imageW + 0.001, "right edge inside the image");
    assert.ok(r.sy + r.sh <= wide.imageH + 0.001, "bottom edge inside the image");
  }
});

test("panning moves the crop the opposite way, at source scale", () => {
  const base = cropRect(wide);
  // Dragging the image 30px right reveals what was 30/0.15 = 200px to its left.
  const moved = cropRect({ ...wide, offsetY: 30 });
  close(base.sy - moved.sy, 200);
});

test("zooming in narrows the crop proportionally", () => {
  const r1 = cropRect(wide);
  const r2 = cropRect({ ...wide, zoom: 2 });
  close(r2.sw, r1.sw / 2);
  close(r2.sh, r1.sh / 2);
});

test("clamping keeps the image covering the frame", () => {
  // Cover here is width-driven (600/4000 = 0.15 beats 200/3000), so the image
  // renders 600x450 in a 600x200 frame: pinned across, 125px of slack down.
  const c = clampOffset({ ...wide, offsetX: 5000, offsetY: 5000 });
  close(c.x, 0, "no horizontal pan — the width exactly fills the frame");
  close(c.y, (3000 * 0.15 - 200) / 2, "vertical pan is limited to the overflow");

  // A frame the same shape as the photo has no slack in either direction.
  const square = clampOffset({ imageW: 1000, imageH: 1000, viewW: 400, viewH: 400, zoom: 1, offsetX: 999, offsetY: 999 });
  assert.deepEqual(square, { x: 0, y: 0 });

  // Zooming in creates slack both ways.
  const z = clampOffset({ imageW: 1000, imageH: 1000, viewW: 400, viewH: 400, zoom: 2, offsetX: 999, offsetY: 999 });
  assert.ok(z.x > 0 && z.y > 0, "zoomed in, the image can be panned");
});

test("a portrait crop into a portrait frame keeps the whole height", () => {
  // AIR-1 cards: 5:7 frame, a 1000×1400 source is already that shape.
  const r = cropRect({ imageW: 1000, imageH: 1400, viewW: 500, viewH: 700, zoom: 1, offsetX: 0, offsetY: 0 });
  close(r.sw, 1000);
  close(r.sh, 1400);
});

test("output is capped on its longest edge and keeps the crop's ratio", () => {
  const r = cropRect(wide);
  const o = outputSize(r, 1800);
  assert.equal(Math.max(o.width, o.height), 1800);
  close(o.width / o.height, r.sw / r.sh, "aspect preserved");

  // A crop smaller than the cap is never upscaled.
  const small = outputSize({ sx: 0, sy: 0, sw: 300, sh: 200 }, 1800);
  assert.deepEqual(small, { width: 300, height: 200 });
});
