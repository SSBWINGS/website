import test from "node:test";
import assert from "node:assert/strict";
import { ENTRIES } from "./eligibility.ts";
import {
  ENTRY_PAGES,
  ROUTE_SLUGS,
  ageText,
  descriptionFor,
  eligibilitySentence,
  faqsFor,
  keywordsFor,
  relatedTo,
  rulesFor,
  titleFor,
} from "./entry-pages.ts";

test("every page points only at eligibility rules that exist", () => {
  for (const p of ENTRY_PAGES) {
    assert.equal(rulesFor(p).length, p.ids.length, `${p.slug}: references a missing rule id`);
  }
});

test("every eligibility rule has a landing page — no entry is left out", () => {
  const covered = new Set(ENTRY_PAGES.flatMap((p) => p.ids));
  const orphans = ENTRIES.map((e) => e.id).filter((id) => !covered.has(id));
  assert.deepEqual(orphans, [], `rules with no page: ${orphans.join(", ")}`);
});

test("slugs are unique and URL-safe", () => {
  const slugs = ENTRY_PAGES.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  for (const s of slugs) assert.match(s, /^[a-z0-9]+(-[a-z0-9]+)*$/, `unsafe slug: ${s}`);
});

test("the five entries added in Sep 2026 each have a page", () => {
  const slugs = new Set(ENTRY_PAGES.map((p) => p.slug));
  for (const s of ["jag-navy", "rvc", "amc-nt", "navy-cw", "navy-het"]) assert.ok(slugs.has(s), s);
});

test("titles and descriptions stay within what search results display", () => {
  for (const p of ENTRY_PAGES) {
    // The layout appends " | SSBWINGS" (11 chars); Google shows ~60.
    assert.ok(titleFor(p).length + 11 <= 75, `${p.slug} title too long: ${titleFor(p).length}`);
    assert.ok(descriptionFor(p).length <= 200, `${p.slug} description too long: ${descriptionFor(p).length}`);
  }
});

test("each page targets its own head term first", () => {
  for (const p of ENTRY_PAGES) {
    const kw = keywordsFor(p);
    assert.equal(kw[0], `${p.short} SSB coaching`);
    assert.equal(new Set(kw).size, kw.length, `${p.slug} has duplicate keywords`);
  }
});

test("FAQ answers are derived from the rules, not retyped", () => {
  const nda = ENTRY_PAGES.find((p) => p.slug === "nda")!;
  const age = faqsFor(nda).find((f) => f.question.startsWith("What is the age limit"))!;
  assert.ok(age.answer.includes("16½–19½"), "NDA age comes from the eligibility rule");

  const jagNavy = ENTRY_PAGES.find((p) => p.slug === "jag-navy")!;
  const married = faqsFor(jagNavy).find((f) => f.question.startsWith("Can married"))!;
  assert.match(married.answer, /^No/, "Navy JAG is unmarried only");

  const cw = ENTRY_PAGES.find((p) => p.slug === "navy-cw")!;
  assert.match(faqsFor(cw).find((f) => f.question.startsWith("Can married"))!.answer, /^Yes/);
});

test("every page has at least five answerable questions", () => {
  for (const p of ENTRY_PAGES) {
    const faqs = faqsFor(p);
    assert.ok(faqs.length >= 5, `${p.slug} has only ${faqs.length}`);
    for (const f of faqs) assert.ok(f.answer.length > 20, `${p.slug}: thin answer to "${f.question}"`);
  }
});

test("eligibility sentences read naturally", () => {
  const rvc = ENTRIES.find((e) => e.id === "rvc")!;
  assert.equal(
    eligibilitySentence(rvc),
    "Men and women, married or unmarried, aged 21–32 years, with a veterinary degree (BVSc / BVSc & AH).",
  );
  const tes = ENTRIES.find((e) => e.id === "tes")!;
  assert.match(eligibilitySentence(tes), /Men only, unmarried only, aged 16½–19½ years, with Class 12 \(10\+2\), with Physics & Maths/);
});

test("half-years print as ½", () => {
  assert.equal(ageText(16.5), "16½");
  assert.equal(ageText(19), "19");
});

test("related links stay within the same service and exclude the page itself", () => {
  for (const p of ENTRY_PAGES) {
    for (const r of relatedTo(p)) {
      assert.equal(r.service, p.service);
      assert.notEqual(r.slug, p.slug);
    }
  }
});

test("every /entries route link points at a page that exists", () => {
  const slugs = new Set(ENTRY_PAGES.map((p) => p.slug));
  for (const [name, slug] of Object.entries(ROUTE_SLUGS)) {
    assert.ok(slugs.has(slug), `"${name}" links to missing page "${slug}"`);
  }
});
