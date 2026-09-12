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

  // Only service entries are open to a married candidate — AMC (NT) joined
  // SCO and PC(SL) here in Sep 2026, since it takes soldiers aged 28–42.
  const marriedSoldier = ids({ age: 30, education: "10+2", marital: "married", serving: true });
  assert.deepEqual(marriedSoldier.sort(), ["amc-nt", "pc-sl", "sco"]);
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

// ── Entries added Sep 2026: JAG (Navy), RVC, AMC (NT), Navy CW & HET ─────────

test("JAG (Navy) matches the Law cadre notification: 22–27, unmarried, men and women", () => {
  const law = { age: 24, education: "law" as const };
  assert.ok(ids({ ...law, gender: "male" }).includes("navy-jag"));
  assert.ok(ids({ ...law, gender: "female" }).includes("navy-jag"));
  assert.ok(!ids({ ...law, marital: "married" }).includes("navy-jag"), "unmarried only");
  assert.ok(!ids({ ...law, age: 21 }).includes("navy-jag"), "opens at 22, not 21 like Army JAG");
  assert.ok(ids({ ...law, age: 27 }).includes("navy-jag"));
  assert.ok(!ids({ ...law, age: 28 }).includes("navy-jag"));
});

test("a law graduate sees exactly one Navy law route", () => {
  // An LLB is a degree, so Navy entries open to any graduate still match —
  // that is correct. What must not happen is two *law* routes with different
  // age windows, as when Law was folded into the Logistics entry at 19–25.
  const navyLawRoutes = findEligible({ ...base, age: 23, education: "law" })
    .filter((e) => e.service === "Navy" && /law|jag/i.test(e.name))
    .map((e) => e.id);
  assert.deepEqual(navyLawRoutes, ["navy-jag"]);
});

test("RVC is only for veterinary graduates — not every graduate", () => {
  assert.ok(ids({ age: 26, education: "veterinary" }).includes("rvc"));
  assert.ok(ids({ age: 26, education: "veterinary", gender: "female" }).includes("rvc"));
  assert.ok(!ids({ age: 26, education: "graduate" }).includes("rvc"), "a BA/BSc is not a vet");
  assert.ok(!ids({ age: 26, education: "engineering" }).includes("rvc"));
  assert.ok(ids({ age: 32, education: "veterinary" }).includes("rvc"), "upper limit 32");
  assert.ok(!ids({ age: 33, education: "veterinary" }).includes("rvc"));
});

test("a vet also qualifies for entries that accept any graduate", () => {
  // CDS OTA takes any graduate; a BVSc is a degree.
  assert.ok(ids({ age: 23, education: "veterinary" }).includes("cds-ota"));
});

test("AMC (NT) is a service entry for experienced soldiers, 28–42", () => {
  const soldier = { education: "10+2" as const, serving: true, marital: "married" as const };
  assert.ok(ids({ ...soldier, age: 30 }).includes("amc-nt"));
  assert.ok(ids({ ...soldier, age: 42 }).includes("amc-nt"));
  assert.ok(!ids({ ...soldier, age: 27 }).includes("amc-nt"), "below the 28 floor");
  assert.ok(!ids({ ...soldier, age: 43 }).includes("amc-nt"));
  assert.ok(!ids({ age: 30, education: "10+2", serving: false }).includes("amc-nt"), "not for civilians");
});

test("Navy CW is for serving sailors with Physics & Maths, married allowed", () => {
  const sailor = { age: 21, education: "10+2" as const, serving: true };
  assert.ok(ids(sailor).includes("navy-cw"));
  assert.ok(ids({ ...sailor, marital: "married" }).includes("navy-cw"), "married sailors may apply");
  assert.ok(!ids({ ...sailor, pcm: false }).includes("navy-cw"), "needs Physics & Maths");
  assert.ok(!ids({ ...sailor, age: 25 }).includes("navy-cw"), "over the artificer limit of 24");
  assert.ok(!ids({ ...sailor, serving: false }).includes("navy-cw"), "not for civilians");
});

test("Navy HET follows the CW constraints it feeds into", () => {
  const sailor = { age: 21, education: "10+2" as const, serving: true };
  assert.ok(ids(sailor).includes("navy-het"));
  assert.ok(!ids({ ...sailor, serving: false }).includes("navy-het"));
});
