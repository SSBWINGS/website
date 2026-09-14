import test from "node:test";
import assert from "node:assert/strict";
import { headingPercent, stepHeading, richTextBlocks, richTextAlign, HEADING_SIZE } from "./hero-heading.ts";

test("missing or blank sizes mean the design size", () => {
  for (const v of [undefined, null, "", "  ", "abc", NaN]) assert.equal(headingPercent(v), 100, String(v));
});

test("sizes are kept within range and on the step", () => {
  assert.equal(headingPercent(20), HEADING_SIZE.min);
  assert.equal(headingPercent(400), HEADING_SIZE.max);
  assert.equal(headingPercent("85"), 85);
  assert.equal(headingPercent(87), 85);
  assert.equal(headingPercent(88), 90);
});

test("stepping moves one step and stops at the ends", () => {
  assert.equal(stepHeading(100, 1), 105);
  assert.equal(stepHeading(100, -1), 95);
  assert.equal(stepHeading(HEADING_SIZE.max, 1), HEADING_SIZE.max);
  assert.equal(stepHeading(HEADING_SIZE.min, -1), HEADING_SIZE.min);
  assert.equal(stepHeading(undefined, 1), 105);
});

test("rich text splits into its visual lines, tags and entities removed", () => {
  const html =
    '<div style="text-align: center;"><div><b>CDS 2 2025 (OTA</b>): <b>16</b> Recommendations</div>' +
    "<div><b>CDS (IMA 162)</b>- <b>5&nbsp;</b>Recommendations</div><div>A &amp; B<br>next</div></div>";
  assert.deepEqual(richTextBlocks(html), [
    "CDS 2 2025 (OTA): 16 Recommendations",
    "CDS (IMA 162)- 5 Recommendations",
    "A & B",
    "next",
  ]);
  assert.equal(richTextAlign(html), "center");
});

test("a plain paragraph is one block, aligned left", () => {
  const html = "Five days at the <strong>SSB</strong> decide who wears the stars.";
  assert.deepEqual(richTextBlocks(html), ["Five days at the SSB decide who wears the stars."]);
  assert.equal(richTextAlign(html), "left");
  assert.deepEqual(richTextBlocks(""), []);
});
