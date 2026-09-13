import test from "node:test";
import assert from "node:assert/strict";
import { emailRows, enquiryDetails, humanise, readable, searchText } from "./enquiry-details.ts";

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

// ── Notification emails ────────────────────────────────────────────────────

test("the email lists every filled field, in the inbox's order", () => {
  const rows = emailRows(contact);
  assert.deepEqual(rows.map(([label]) => label), [
    "Name", "Phone", "Email", "Target Entry", "Preferred Batch", "Current Status", "Your city", "Message",
  ]);
});

test("a field that was not on the form is left out, not printed as a dash", () => {
  const rows = emailRows({ ...contact, email: "" });
  assert.ok(!rows.some(([label]) => label === "Email"));
  assert.ok(!rows.some(([, value]) => value === "—" || value === ""));
});

test("the email uses the admin's field names, like the inbox", () => {
  const labels = { name: "Full Name", status: "Attempt", batch: "Mode" };
  const labelsUsed = emailRows(contact, labels).map(([l]) => l);
  assert.ok(labelsUsed.includes("Full Name") && labelsUsed.includes("Attempt") && labelsUsed.includes("Mode"));
});

test("email and inbox agree on every answer", () => {
  const fromEmail = emailRows(contact).slice(3);            // after name, phone, email
  const fromInbox = enquiryDetails(contact).map((d) => [d.label, d.value]);
  assert.deepEqual(fromEmail, fromInbox);
});

test("Eligibility Finder emails read as sentences, not 'Pcm: true'", () => {
  const rows = Object.fromEntries(
    emailRows({ name: "A", phone: "+919876543210", meta: { pcm: true, serving: false, gender: "male" } }),
  );
  assert.equal(rows["Physics & Maths in Class 12"], "Yes");
  assert.equal(rows["Already serving"], "No");
  assert.equal(rows["Pcm"], undefined);
});

test("extra rows (such as the source) slot in after the contact details", () => {
  const rows = emailRows({ name: "A", phone: "+919876543210" }, {}, [{ label: "Source", value: "Eligibility Finder" }]);
  assert.deepEqual(rows, [["Name", "A"], ["Phone", "+919876543210"], ["Source", "Eligibility Finder"]]);
});
