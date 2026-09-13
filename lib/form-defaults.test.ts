import test from "node:test";
import assert from "node:assert/strict";
import {
  fullPhone,
  isCustomKey,
  isValidPhone,
  newCustomField,
  phoneDigits,
  readCustomAnswers,
  resolveContactForm,
  CONTACT_FORM,
} from "./form-defaults.ts";

test("a plain 10-digit number is kept as typed", () => {
  assert.equal(phoneDigits("9876543210"), "9876543210");
});

test("the country code is stripped when a visitor pastes it back in", () => {
  // The field already shows "+91", so every one of these must reduce to the
  // same 10 digits rather than being rejected as too long.
  for (const raw of [
    "+91 98765 43210",
    "+919876543210",
    "91-98765-43210",
    "(+91) 9876543210",
    "091 9876543210",
    "0091 9876543210",
  ]) {
    assert.equal(phoneDigits(raw), "9876543210", `failed for ${raw}`);
  }
});

test("a leading zero from landline habits is dropped", () => {
  assert.equal(phoneDigits("09876543210"), "9876543210");
});

test("a genuine number beginning 91 is not mistaken for a country code", () => {
  assert.equal(phoneDigits("9176543210"), "9176543210");
  assert.equal(phoneDigits("9198765432"), "9198765432");
});

test("letters, spaces and punctuation are ignored", () => {
  assert.equal(phoneDigits("98765-43210"), "9876543210");
  assert.equal(phoneDigits("ph: 98765 43210"), "9876543210");
  assert.equal(phoneDigits(""), "");
});

test("overlong input is capped rather than accepted", () => {
  assert.equal(phoneDigits("98765432109999").length, 10);
});

test("only real Indian mobile numbers validate", () => {
  for (const ok of ["9876543210", "6000000000", "7123456789", "8999999999"]) {
    assert.ok(isValidPhone(ok), `${ok} should be valid`);
  }
  for (const bad of ["1234567890", "5876543210", "987654321", "98765432101", "", "0987654321"]) {
    assert.ok(!isValidPhone(bad), `${bad} should be rejected`);
  }
});

test("storage always carries the dial code, and blank stays blank", () => {
  assert.equal(fullPhone("9876543210"), "+919876543210");
  assert.equal(fullPhone(""), "");
});

test("typing and pasting reach the same stored value", () => {
  assert.equal(fullPhone(phoneDigits("+91 98765 43210")), fullPhone(phoneDigits("9876543210")));
});

test("a saved form document keeps its own settings but gains new fields", () => {
  const saved = { fields: [{ key: "email", label: "E-mail", placeholder: "", required: false, enabled: false }] };
  const doc = resolveContactForm(saved);
  const email = doc.fields.find((f) => f.key === "email");
  assert.equal(email?.enabled, false, "the admin's choice to hide email is honoured");
  assert.equal(email?.label, "E-mail");
  // Fields the saved doc never mentioned fall back to the defaults.
  assert.equal(doc.fields.length, CONTACT_FORM.fields.length);
  assert.equal(doc.fields.find((f) => f.key === "phone")?.enabled, true);
});

// ── Adding, deleting, hiding and reordering fields ─────────────────────────

const keys = (doc: ReturnType<typeof resolveContactForm>) => doc.fields.map((f) => f.key);

test("an older saved form (no custom fields, no deletions) still renders all seven built-ins", () => {
  const doc = resolveContactForm({ fields: [{ key: "name", label: "Name", placeholder: "", required: true, enabled: true }] });
  assert.deepEqual(keys(doc), ["name", "phone", "email", "entry", "batch", "status", "message"]);
  assert.deepEqual(doc.removed, []);
});

test("the admin's order is kept", () => {
  const doc = resolveContactForm({
    fields: ["message", "email", "name", "phone", "entry", "batch", "status"].map((key) => ({ key })),
  });
  assert.deepEqual(keys(doc), ["message", "email", "name", "phone", "entry", "batch", "status"]);
});

test("a deleted built-in stays deleted and is not quietly brought back", () => {
  const doc = resolveContactForm({
    fields: ["name", "phone", "email", "message"].map((key) => ({ key })),
    removed: ["entry", "batch", "status"],
  });
  assert.deepEqual(keys(doc), ["name", "phone", "email", "message"]);
  assert.deepEqual(doc.removed.sort(), ["batch", "entry", "status"]);
});

test("name, phone and email can never be deleted, even if the saved document says so", () => {
  const doc = resolveContactForm({ fields: [], removed: ["name", "phone", "email", "entry"] });
  for (const k of ["name", "phone", "email"]) assert.ok(keys(doc).includes(k), `${k} must survive`);
  assert.ok(!keys(doc).includes("entry"), "entry was genuinely deletable");
  assert.deepEqual(doc.removed, ["entry"]);
});

test("core fields can still be hidden", () => {
  const doc = resolveContactForm({ fields: [{ key: "email", enabled: false }] });
  assert.equal(doc.fields.find((f) => f.key === "email")?.enabled, false);
});

test("admin-added fields are kept with their type and options", () => {
  const doc = resolveContactForm({
    fields: [
      { key: "name" },
      { key: "c_city01", label: "City", type: "text", required: true },
      { key: "c_dob001", label: "Date of birth", type: "date" },
      { key: "c_ssb001", label: "Attempts", type: "select", options: ["First", "Second", "Third+"] },
    ],
  });
  const city = doc.fields.find((f) => f.key === "c_city01")!;
  assert.equal(city.type, "text");
  assert.equal(city.required, true);
  assert.deepEqual(doc.fields.find((f) => f.key === "c_ssb001")?.options, ["First", "Second", "Third+"]);
  assert.equal(doc.fields.find((f) => f.key === "c_dob001")?.type, "date");
});

test("malformed custom fields are dropped or repaired, never trusted", () => {
  const doc = resolveContactForm({
    fields: [
      { key: "hack<script>", label: "x", type: "text" },        // bad key → dropped
      { key: "c_ok0001", label: "Q", type: "rocket" },            // unknown type → text
      { key: "c_ok0002", label: "Pick", type: "select", options: [] }, // empty dropdown → text
      { key: "c_ok0001", label: "Duplicate" },                    // duplicate key → dropped
    ],
  });
  assert.ok(!keys(doc).includes("hack<script>"));
  assert.equal(doc.fields.filter((f) => f.key === "c_ok0001").length, 1);
  assert.equal(doc.fields.find((f) => f.key === "c_ok0001")?.type, "text");
  assert.equal(doc.fields.find((f) => f.key === "c_ok0002")?.type, "text");
});

test("a new field gets a valid, unique-looking key", () => {
  const a = newCustomField();
  const b = newCustomField("select");
  assert.ok(isCustomKey(a.key) && isCustomKey(b.key));
  assert.notEqual(a.key, b.key);
  assert.deepEqual(b.options, ["Option 1", "Option 2"]);
});

// ── Reading answers to admin-added fields ─────────────────────────────────

const form = resolveContactForm({
  fields: [
    { key: "name" },
    { key: "c_city01", label: "City", type: "text", required: true },
    { key: "c_age001", label: "Age", type: "number" },
    { key: "c_ssb001", label: "Attempts", type: "select", options: ["First", "Second"] },
    { key: "c_hide01", label: "Hidden one", type: "text", required: true, enabled: false },
  ],
});

test("answers come back labelled, in form order", () => {
  const r = readCustomAnswers(form, { c_city01: " Noida ", c_age001: "21", c_ssb001: "Second" });
  assert.equal(r.error, undefined);
  assert.deepEqual(r.answers, [
    { label: "City", value: "Noida" },
    { label: "Age", value: "21" },
    { label: "Attempts", value: "Second" },
  ]);
});

test("a mandatory custom field must be answered", () => {
  assert.match(readCustomAnswers(form, {}).error ?? "", /City/);
});

test("hidden fields are ignored, even when marked mandatory", () => {
  const r = readCustomAnswers(form, { c_city01: "Noida" });
  assert.equal(r.error, undefined);
});

test("a dropdown only accepts its own choices", () => {
  assert.match(readCustomAnswers(form, { c_city01: "Noida", c_ssb001: "Tenth" }).error ?? "", /valid option/);
});

test("a number field refuses text", () => {
  assert.match(readCustomAnswers(form, { c_city01: "Noida", c_age001: "twenty" }).error ?? "", /number/);
});

test("fields that are not on the form are dropped", () => {
  const r = readCustomAnswers(form, { c_city01: "Noida", c_zzzz99: "injected", admin: "true" });
  assert.deepEqual(r.answers.map((a) => a.label), ["City"]);
});
