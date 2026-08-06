import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { saveEnquiry } from "@/lib/enquiries";

export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  entry?: string;
  message?: string;
  source?: "eligibility" | "mock_test";
  meta?: Record<string, unknown>;
  company?: string; // honeypot
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+\-\s]{10,15}$/;

/** Lightweight lead capture for the Eligibility Finder & Mock Tests.
 *  Stores to the CRM (best-effort). No email is required. */
export async function POST(req: Request) {
  const rl = rateLimit(`lead:${clientIp(req)}`, { limit: 8, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.company) return NextResponse.json({ ok: true }); // bot

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  if (name.length < 2 || name.length > 80) return NextResponse.json({ error: "Enter a valid name." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (phone && !PHONE.test(phone)) return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });

  const source = body.source === "mock_test" ? "mock_test" : "eligibility";
  await saveEnquiry({
    name,
    email,
    phone,
    entry: (body.entry ?? "").slice(0, 200),
    message: (body.message ?? "").slice(0, 2000),
    source,
    meta: body.meta && typeof body.meta === "object" ? body.meta : {},
  });

  return NextResponse.json({ ok: true });
}
