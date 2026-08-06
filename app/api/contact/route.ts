import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { saveEnquiry } from "@/lib/enquiries";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  entry?: string;
  message?: string;
  company?: string; // honeypot
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(req: Request) {
  // Throttle abusive submitters (best-effort per instance; honeypot handles bots).
  const rl = rateLimit(`contact:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled → silently accept (bot)
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const entry = body.entry?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!/^[0-9+\-\s]{10,15}$/.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  // Capture the lead in the CRM first (best-effort, independent of email).
  await saveEnquiry({ name, email, phone, entry, message, source: "contact_form" });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Lead is saved; email just isn't configured. Treat as success for the user.
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_ADMIN_EMAIL || "marketing@ssbwings.com";
  const from = process.env.CONTACT_FROM_EMAIL || "SSBWINGS Website <onboarding@resend.dev>";

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Target Entry", entry || "—"],
    ["Message", message || "—"],
  ]
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:10px 16px;font-weight:700;color:#101f33;background:#faf8f1;border-bottom:1px solid #eee;white-space:nowrap;">${k}</td>
          <td style="padding:10px 16px;color:#333;border-bottom:1px solid #eee;">${escapeHtml(v)}</td>
        </tr>`,
    )
    .join("");

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `🎖️ New Enquiry — ${name} (${entry || "Entry not specified"})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
          <div style="background:#0a1524;padding:20px 24px;">
            <h1 style="margin:0;color:#f2d519;font-size:20px;letter-spacing:2px;">SSBWINGS</h1>
            <p style="margin:4px 0 0;color:#c1d5ea;font-size:12px;">New callback request from the website</p>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
          <div style="padding:14px 24px;background:#faf8f1;font-size:12px;color:#666;">
            Reply directly to this email to reach the aspirant.
          </div>
        </div>`,
    });

    if (error) {
      console.error("Resend error:", error);
      // Lead is already saved; report success but note delivery couldn't happen.
      return NextResponse.json({ ok: true, warning: "saved" });
    }

    // Auto-responder to the aspirant (best-effort; don't fail the request).
    try {
      await resend.emails.send({
        from,
        to: email,
        subject: "We've received your enquiry — SSBWINGS",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
            <div style="background:#0a1524;padding:20px 24px;">
              <h1 style="margin:0;color:#f2d519;font-size:20px;letter-spacing:2px;">SSBWINGS</h1>
              <p style="margin:4px 0 0;color:#c1d5ea;font-size:12px;">We give shape to your dreams</p>
            </div>
            <div style="padding:22px 24px;color:#333;font-size:14px;line-height:1.6;">
              <p>Dear ${escapeHtml(name)},</p>
              <p>Thank you for reaching out to <strong>SSBWINGS</strong>. Our counselling team has received your enquiry${entry ? ` about <strong>${escapeHtml(entry)}</strong>` : ""} and will call you back shortly.</p>
              <p>Meanwhile, feel free to explore our courses and the 5-day SSB process on our website. Jai Hind! 🇮🇳</p>
              <p style="margin-top:18px;color:#666;">— Team SSBWINGS</p>
            </div>
          </div>`,
      });
    } catch {
      /* auto-responder failure is non-fatal */
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Could not send your message right now." },
      { status: 500 },
    );
  }
}
