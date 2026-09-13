import "server-only";
import { Resend } from "resend";
import { explainMailError, isTestSender, parseRecipients } from "./mail-diagnosis";

/** Where every lead notification goes. CONTACT_ADMIN_EMAIL may hold several
 *  addresses, comma-separated — a backup inbox can be added without code. */
export const adminRecipients = () => parseRecipients(process.env.CONTACT_ADMIN_EMAIL, "marketing@ssbwings.com");

/** Who the mail is from. The default is on the academy's own domain: Resend's
 *  test address (onboarding@resend.dev) only delivers to the Resend account
 *  owner, which is why notifications to marketing@ssbwings.com never arrived. */
export const senderAddress = () => process.env.CONTACT_FROM_EMAIL || "SSBWINGS <noreply@ssbwings.com>";

/** The outcome of a send, with Resend's reason and a plain-language fix. */
export type Delivery =
  | { ok: true; id?: string; from: string; to: string[] }
  | { ok: false; error: string; hint: string; from: string; to: string[] };

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Renders label/value pairs as the email's detail table. Empty values show "—". */
export function detailRows(rows: [string, string][]): string {
  return rows
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:10px 16px;font-weight:700;color:#101f33;background:#faf8f1;border-bottom:1px solid #eee;white-space:nowrap;">${escapeHtml(k)}</td>
          <td style="padding:10px 16px;color:#333;border-bottom:1px solid #eee;">${escapeHtml(v || "—")}</td>
        </tr>`,
    )
    .join("");
}

export function emailShell(subtitle: string, inner: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
      <div style="background:#0a1524;padding:20px 24px;">
        <h1 style="margin:0;color:#f2d519;font-size:20px;letter-spacing:2px;">SSBWINGS</h1>
        <p style="margin:4px 0 0;color:#c1d5ea;font-size:12px;">${escapeHtml(subtitle)}</p>
      </div>
      ${inner}
    </div>`;
}

/** One send, with the failure reason kept rather than swallowed. */
async function deliver(opts: { subject: string; html: string; replyTo?: string }): Promise<Delivery> {
  const from = senderAddress();
  const to = adminRecipients();
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const error = "RESEND_API_KEY is not set";
    return { ok: false, error, hint: explainMailError(error, from), from, to };
  }
  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
      subject: opts.subject,
      html: opts.html,
    });
    if (error) {
      const message = error.message || String(error);
      return { ok: false, error: message, hint: explainMailError(message, from), from, to };
    }
    return { ok: true, id: data?.id, from, to };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message, hint: explainMailError(message, from), from, to };
  }
}

/**
 * Send a lead notification to the academy inbox.
 *
 * Best-effort by design: the caller has already persisted the lead, so a
 * missing API key or a Resend outage must never fail the visitor's submission.
 * Failures are logged with Resend's reason and the fix, so they show up in the
 * Vercel logs instead of disappearing.
 */
export async function notifyAdmin(opts: {
  subject: string;
  subtitle: string;
  rows: [string, string][];
  replyTo?: string;
  footer?: string;
}): Promise<boolean> {
  const result = await deliver({
    subject: opts.subject,
    replyTo: opts.replyTo,
    html: emailShell(
      opts.subtitle,
      `<table style="width:100%;border-collapse:collapse;font-size:14px;">${detailRows(opts.rows)}</table>
       <div style="padding:14px 24px;background:#faf8f1;font-size:12px;color:#666;">
         ${escapeHtml(opts.footer ?? "Reply directly to this email to reach the aspirant.")}
       </div>`,
    ),
  });
  if (!result.ok) {
    console.error(`Lead email NOT sent (${opts.subject}): ${result.error} — ${result.hint}`);
  }
  return result.ok;
}

/** A labelled test message to the admin inbox, returning the full outcome so
 *  the admin panel can show exactly what went wrong. */
export async function sendTestEmail(): Promise<Delivery & { usingTestSender: boolean }> {
  const result = await deliver({
    subject: "SSBWINGS website — test email",
    html: emailShell(
      "Delivery test from the admin panel",
      `<div style="padding:22px 24px;color:#333;font-size:14px;line-height:1.6;">
         <p>If you are reading this, website enquiry emails are reaching this inbox.</p>
         <p style="color:#666;">Sent from the Footer &amp; Contact page of the SSBWINGS admin panel.</p>
       </div>`,
    ),
  });
  return { ...result, usingTestSender: isTestSender(result.from) };
}
