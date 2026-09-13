import test from "node:test";
import assert from "node:assert/strict";
import { addressOf, explainMailError, isTestSender, parseRecipients } from "./mail-diagnosis.ts";

test("one or several recipients can be configured", () => {
  assert.deepEqual(parseRecipients("marketing@ssbwings.com", "x@y.com"), ["marketing@ssbwings.com"]);
  assert.deepEqual(parseRecipients("a@x.com, b@y.com; c@z.com", "x@y.com"), ["a@x.com", "b@y.com", "c@z.com"]);
});

test("junk and duplicates are dropped, and an empty setting falls back", () => {
  assert.deepEqual(parseRecipients("a@x.com, not-an-email, a@x.com", "f@b.com"), ["a@x.com"]);
  assert.deepEqual(parseRecipients("", "marketing@ssbwings.com"), ["marketing@ssbwings.com"]);
  assert.deepEqual(parseRecipients(undefined, "marketing@ssbwings.com"), ["marketing@ssbwings.com"]);
});

test("the bare address is pulled out of a display name", () => {
  assert.equal(addressOf("SSBWINGS <Noreply@SSBWings.com>"), "noreply@ssbwings.com");
  assert.equal(addressOf("plain@ssbwings.com"), "plain@ssbwings.com");
});

test("Resend's test sender is recognised — the cause of the silent failures", () => {
  assert.ok(isTestSender("SSBWINGS <onboarding@resend.dev>"));
  assert.ok(!isTestSender("SSBWINGS <noreply@ssbwings.com>"));
});

test("sending from the test address explains exactly what to change", () => {
  const hint = explainMailError(
    "You can only send testing emails to your own email address (owner@gmail.com).",
    "SSBWINGS <onboarding@resend.dev>",
  );
  assert.match(hint, /CONTACT_FROM_EMAIL/);
  assert.match(hint, /noreply@ssbwings\.com/);
});

test("an unverified domain points at resend.com/domains and names the domain", () => {
  const hint = explainMailError("The ssbwings.com domain is not verified.", "SSBWINGS <noreply@ssbwings.com>");
  assert.match(hint, /ssbwings\.com/);
  assert.match(hint, /resend\.com\/domains/);
});

test("a bad key and a missing key are told apart", () => {
  assert.match(explainMailError("API key is invalid", "a <b@ssbwings.com>"), /api-keys/);
  assert.match(explainMailError("RESEND_API_KEY is not set", "a <b@ssbwings.com>"), /Environment Variables/);
});
