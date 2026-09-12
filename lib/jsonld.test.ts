import test from "node:test";
import assert from "node:assert/strict";
import { breadcrumbLd, faqLd, plainText, serializeLd } from "./jsonld.ts";

test("a </script> in CMS text cannot break out of the JSON-LD tag", () => {
  const out = serializeLd({ text: "Nice answer</script><script>alert(1)</script>" });
  assert.ok(!out.includes("</script>"), "closing tag must be escaped");
  assert.ok(!out.includes("<script>"), "opening tag must be escaped");
});

test("escaped output is still valid JSON that decodes to the original", () => {
  const original = { name: "Q&A <b>bold</b>", note: "line\u2028sep\u2029para" };
  const decoded = JSON.parse(serializeLd(original));
  assert.deepEqual(decoded, original);
});

test("line and paragraph separators are escaped, and spaces are left alone", () => {
  const out = serializeLd({ t: "a b\u2028c\u2029d" });
  assert.ok(!out.includes(String.fromCharCode(0x2028)), "raw U+2028 removed");
  assert.ok(!out.includes(String.fromCharCode(0x2029)), "raw U+2029 removed");
  assert.ok(out.includes("a b"), "ordinary spaces untouched");
});

test("FAQ markup strips HTML from answers and drops empty rows", () => {
  const ld = faqLd([
    { question: "Who can apply?", answer: "<p>Unmarried <strong>men</strong> &amp; women.</p>" },
    { question: "", answer: "orphan answer" },
  ]);
  assert.ok(ld);
  assert.equal(ld.mainEntity.length, 1);
  assert.equal(ld.mainEntity[0].acceptedAnswer.text, "Unmarried men & women.");
});

test("no FAQ markup is emitted for an empty list", () => {
  assert.equal(faqLd([]), null);
});

test("breadcrumbs always start at Home and use absolute URLs", () => {
  const ld = breadcrumbLd([{ name: "Entries", path: "/entries" }, { name: "NDA", path: "/entries/nda" }]);
  assert.equal(ld.itemListElement[0].name, "Home");
  assert.equal(ld.itemListElement[0].item, "https://www.ssbwings.com");
  assert.equal(ld.itemListElement[2].item, "https://www.ssbwings.com/entries/nda");
  assert.deepEqual(ld.itemListElement.map((i) => i.position), [1, 2, 3]);
});

test("plainText collapses markup and whitespace", () => {
  assert.equal(plainText("<p>One</p>\n\n<p>Two&nbsp;three</p>"), "One Two three");
});
