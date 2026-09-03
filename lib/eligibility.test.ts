import test from "node:test";
import assert from "node:assert/strict";
import { findEligible, ENTRIES, type EligibilityInput } from "./eligibility.ts";

const base: EligibilityInput = {
  age: 22,
  gender: "male",
  marital: "unmarried",
  education: "engineering",
  pcm: true,
};

const ids = (i: Partial<EligibilityInput>) => findEligible({ ...base, ...i }).map((e) => e.id);

test("Navy 10+2 B.Tech admits women (INA has inducted women cadets since 2021)", () => {
  assert.ok(ids({ age: 18, education: "10+2", gender: "female" }).includes("navy-btech"));
  assert.ok(ids({ age: 18, education: "10+2", gender: "male" }).includes("navy-btech"));
});

test("Army 10+2 TES stays men-only", () => {
  assert.ok(ids({ age: 18, education: "10+2", gender: "male" }).includes("tes"));
  assert.ok(!ids({ age: 18, education: "10+2", gender: "female" }).includes("tes"));
});

test("SSC (Tech) and JAG require unmarried candidates", () => {
  assert.ok(ids({ age: 22 }).includes("ssc-tech"));
  assert.ok(!ids({ age: 22, marital: "married" }).includes("ssc-tech"));
  assert.ok(ids({ age: 24, education: "law" }).includes("jag"));
  assert.ok(!ids({ age: 24, education: "law", marital: "married" }).includes("jag"));
});

test("CDS AFA opens at 20, not 19", () => {
  assert.ok(!ids({ age: 19 }).includes("cds-afa"));
  assert.ok(ids({ age: 20 }).includes("cds-afa"));
});

test("AFCAT flying needs Physics & Maths in Class 12", () => {
  assert.ok(ids({ age: 22, pcm: true }).includes("afcat-flying"));
  assert.ok(!ids({ age: 22, pcm: false }).includes("afcat-flying"));
});

test("service entries are hidden from civilians and shown to serving personnel", () => {
  const civilian = ids({ age: 25, education: "10+2" });
  assert.ok(!civilian.includes("acc"));
  assert.ok(!civilian.includes("sco"));

  const soldier = ids({ age: 25, education: "10+2", serving: true });
  assert.ok(soldier.includes("acc"));

  // ACC/SCO/PC(SL) are the only routes open to a married candidate.
  const marriedSoldier = ids({ age: 30, education: "10+2", marital: "married", serving: true });
  assert.deepEqual(marriedSoldier.sort(), ["pc-sl", "sco"]);
});

test("women can reach Coast Guard General Duty via the Women SSA entry", () => {
  const women = ids({ age: 23, gender: "female" });
  assert.ok(women.includes("cg-gd-women"));
  assert.ok(!women.includes("cg-gd")); // the permanent GD entry stays men-only
});

test("every entry has a sane age window and at least one gender", () => {
  for (const e of ENTRIES) {
    assert.ok(e.minAge < e.maxAge, `${e.id}: minAge must be below maxAge`);
    assert.ok(e.genders.length > 0, `${e.id}: needs at least one gender`);
    assert.ok(e.education.length > 0, `${e.id}: needs at least one qualification`);
  }
});
