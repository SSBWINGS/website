import test from "node:test";
import assert from "node:assert/strict";
import { estimateEm, estimateFitCqw, fitFontPx, FIT_SLACK } from "./fit-text.ts";

test("both lines share one size, set by the longer line", () => {
  const short = estimateFitCqw(["Choose everyone."]);
  const both = estimateFitCqw(["Choose everyone.", "The uniform doesn't choose everyone."]);
  const long = estimateFitCqw(["The uniform doesn't choose everyone."]);
  assert.ok(both! < short!);
  assert.equal(both, long);
});

test("a longer heading gets a smaller size", () => {
  assert.ok(estimateFitCqw(["750+ recommendations and counting!"])! < estimateFitCqw(["750+ recommendations"])!);
});

test("case does not matter: the headline is set in capitals", () => {
  assert.equal(estimateEm("become a warrior"), estimateEm("BECOME A WARRIOR"));
});

test("emoji count as wide, and their invisible modifiers as nothing", () => {
  assert.ok(estimateEm("🏆 WIN") > estimateEm("W WIN"));
  assert.equal(estimateEm("\u2764\uFE0F"), estimateEm("\u2764")); // heart with and without its emoji modifier
});

test("nothing to fit gives no size, so the design size applies", () => {
  assert.equal(estimateFitCqw(["", ""]), null);
  assert.equal(fitFontPx(320, [0, 0], 36), null);
  assert.equal(fitFontPx(0, [100], 36), null);
});

test("the measured size makes the widest line exactly fill the space, less the slack", () => {
  // At 36px the widest line is 400px wide; the column is 300px.
  const px = fitFontPx(300, [250, 400], 36)!;
  assert.ok(Math.abs(px - 36 * (300 / 400) * FIT_SLACK) < 0.01);
  // Scaled to that size the widest line fits inside the column.
  assert.ok((400 * px) / 36 <= 300);
});
