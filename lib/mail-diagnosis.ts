/** Turning mail configuration and Resend errors into something an admin can
 *  act on. Pure and dependency-free, so it can be unit-tested.
 *
 *  This exists because email failures here were silent: the enquiry saved, the
 *  visitor saw "sent", and the only symptom was an inbox that stayed empty. */

/** Resend's shared sending address. It only delivers to the Resend account
 *  owner's own inbox — never to anyone else. */
export const RESEND_TEST_DOMAIN = "resend.dev";

/** "a@x.com, b@y.com" → ["a@x.com", "b@y.com"]. Lets the academy add a backup
 *  inbox (a Gmail, say) through an environment variable, without a code change. */
export function parseRecipients(raw: string | undefined, fallback: string): string[] {
  const list = (raw ?? "")
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
  return list.length ? Array.from(new Set(list)) : [fallback];
}

/** The bare address out of `Name <address>` or a plain address. */
export function addressOf(from: string): string {
  const m = from.match(/<([^>]+)>/);
  return (m ? m[1] : from).trim().toLowerCase();
}

export const isTestSender = (from: string) => addressOf(from).endsWith(`@${RESEND_TEST_DOMAIN}`);

/** Plain-language explanation of why a send failed, and what to change. */
export function explainMailError(message: string, from: string): string {
  const m = message.toLowerCase();

  if (isTestSender(from) || m.includes("testing emails to your own email") || m.includes("own email address")) {
    return (
      `The sender is Resend's test address (${addressOf(from)}), which can only email the owner of the Resend ` +
      `account. Set CONTACT_FROM_EMAIL on Vercel to an address on your verified domain, e.g. ` +
      `"SSBWINGS <noreply@ssbwings.com>", then redeploy.`
    );
  }
  if (m.includes("not verified") || m.includes("verify a domain") || m.includes("domain is not")) {
    const domain = addressOf(from).split("@")[1] ?? "your domain";
    return `The sender's domain (${domain}) is not verified in Resend. Open resend.com/domains, add it, and add the DNS records it shows at your DNS provider.`;
  }
  if (m.includes("api key") || m.includes("unauthorized") || m.includes("invalid_api_key") || m.includes("restricted_api_key")) {
    return "Resend rejected the API key. Create a new key with sending access at resend.com/api-keys and set it as RESEND_API_KEY on Vercel.";
  }
  if (m.includes("rate") && m.includes("limit")) {
    return "Resend's sending limit was hit. It clears on its own; check your plan's daily quota if it keeps happening.";
  }
  if (m.includes("not set")) {
    return "RESEND_API_KEY is not set on this deployment. Add it under Vercel → Settings → Environment Variables, then redeploy.";
  }
  return "Resend refused the message. The error above is Resend's own wording — check resend.com/emails for the full log.";
}
