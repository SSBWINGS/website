import test from "node:test";
import assert from "node:assert/strict";
import { headingPercent, stepHeading, headingAlign, HEADING_SIZE } from "./hero-heading.ts";

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

test("alignment is left, centre or right, and anything else means left", () => {
  assert.equal(headingAlign("center"), "center");
  assert.equal(headingAlign("right"), "right");
  assert.equal(headingAlign("left"), "left");
  for (const v of [undefined, null, "", "middle", 3, "CENTER"]) assert.equal(headingAlign(v), "left", String(v));
});
