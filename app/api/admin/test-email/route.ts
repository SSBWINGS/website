import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sendTestEmail } from "@/lib/mailer";

export const runtime = "nodejs";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" || profile?.role === "super_admin" ? user : null;
}

/** Admin-only: send a test message and report exactly what Resend said.
 *  The one way to see a production mail failure without the Vercel logs. */
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }
  const rl = rateLimit(`test-email:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "Too many tests — wait a minute." }, { status: 429 });

  const result = await sendTestEmail();
  return NextResponse.json(result, { status: 200 });
}
