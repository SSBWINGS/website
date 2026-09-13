import test from "node:test";
import assert from "node:assert/strict";
import { enquiryDetails, humanise, readable, searchText } from "./enquiry-details.ts";

const contact = {
  name: "Aarti Boraste",
  phone: "+919876543210",
  email: "aarti@example.com",
  entry: "CDS – OTA / SSC",
  message: "Second attempt, board date in March.",
  meta: {
    batch: "Offline (Noida campus)",
    status: "Repeater (attempted before)",
    custom: [{ label: "Your city", value: "Nashik" }],
  },
};

test("a contact-form enquiry shows every field it was sent", () => {
  assert.deepEqual(enquiryDetails(contact), [
    { label: "Target Entry", value: "CDS – OTA / SSC" },
    { label: "Preferred Batch", value: "Offline (Noida campus)" },
    { label: "Current Status", value: "Repeater (attempted before)" },
    { label: "Your city", value: "Nashik" },
    { label: "Message", value: "Second attempt, board date in March." },
  ]);
});

test("the admin's own field names are used when given", () => {
  const d = enquiryDetails(contact, { entry: "Entry you want", batch: "Batch", status: "Attempt" });
  assert.equal(d[0].label, "Entry you want");
  assert.equal(d[1].label, "Batch");
  assert.equal(d[2].label, "Attempt");
});

test("Eligibility Finder answers are shown, not silently dropped", () => {
  const d = enquiryDetails({
    entry: "NDA & NA (Army)",
    meta: { age: "18", gender: "female", marital: "unmarried", education: "10+2", pcm: true, serving: false, count: 4 },
  });
  const byLabel = Object.fromEntries(d.map((x) => [x.label, x.value]));
  assert.equal(byLabel["Age"], "18");
  assert.equal(byLabel["Gender"], "female");
  assert.equal(byLabel["Physics & Maths in Class 12"], "Yes");
  assert.equal(byLabel["Already serving"], "No");
  assert.equal(byLabel["Entries matched"], "4");
});

test("keys the inbox has never heard of still appear, readably named", () => {
  const d = enquiryDetails({ meta: { preferredCity: "Pune", source_campaign: "Instagram" } });
  assert.deepEqual(d, [
    { label: "Preferred city", value: "Pune" },
    { label: "Source campaign", value: "Instagram" },
  ]);
});

test("empty values are left out rather than shown as blanks", () => {
  const d = enquiryDetails({ entry: "", message: "   ", meta: { batch: "", status: null, custom: [] } });
  assert.deepEqual(d, []);
});

test("values of any shape become readable text", () => {
  assert.equal(readable(true), "Yes");
  assert.equal(readable(["NDA", "CDS"]), "NDA, CDS");
  assert.equal(readable({ correctAnswers: 8 }), "Correct answers: 8");
  assert.equal(readable(undefined), "");
});

test("search covers every detail, not just name and email", () => {
  const s = searchText(contact);
  for (const needle of ["nashik", "repeater", "offline", "board date"]) assert.ok(s.includes(needle), needle);
});

test("key names are humanised", () => {
  assert.equal(humanise("preferred_batch"), "Preferred batch");
  assert.equal(humanise("dateOfBirth"), "Date of birth");
});
