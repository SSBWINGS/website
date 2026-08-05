import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // 1. Authenticate the caller and confirm they are a super-admin.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") {
    return NextResponse.json({ error: "Only the Super Admin can add admins." }, { status: 403 });
  }

  if (!hasServiceRole()) {
    return NextResponse.json(
      { error: "Server is missing SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 },
    );
  }

  // 2. Validate input.
  let body: { email?: string; password?: string; full_name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const fullName = body.full_name?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  // 3. Create the auth user (a profile row is auto-created by the DB trigger).
  const admin = createAdminClient();
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // 4. Store the full name on the profile.
  if (created.user && fullName) {
    await admin.from("profiles").update({ full_name: fullName }).eq("id", created.user.id);
  }

  // 5. Audit log.
  await supabase.from("activity_log").insert({
    actor: user.id,
    actor_email: user.email,
    action: "create_admin",
    target: email,
  });

  return NextResponse.json({ ok: true });
}
