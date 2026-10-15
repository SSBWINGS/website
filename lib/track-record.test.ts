import test from "node:test";
import assert from "node:assert/strict";
import { trackRecord, countText, TRACK_RECORD_DEFAULT } from "./track-record.ts";

test("reads the figures from the stat cards, whatever their exact labels", () => {
  const r = trackRecord([
    { label: "Recommendations", value: 760 },
    { label: "Alumni Officers Family", value: 3500 },
    { label: "NDA entries", value: 195 },
  ]);
  assert.deepEqual(r, { recommendations: 760, alumni: 3500 });
});

test("a missing or broken card falls back rather than printing nonsense", () => {
  assert.deepEqual(trackRecord(undefined), TRACK_RECORD_DEFAULT);
  assert.deepEqual(trackRecord([{ label: "Recommendations", value: "" }, { label: "Alumni", value: -4 }]), TRACK_RECORD_DEFAULT);
});

test("figures are written with Indian digit grouping and a plus", () => {
  assert.equal(countText(760), "760+");
  assert.equal(countText(3500), "3,500+");
  assert.equal(countText(125000), "1,25,000+");
});
