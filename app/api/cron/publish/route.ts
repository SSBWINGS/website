import { NextResponse } from "next/server";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Promotes scheduled content whose time has arrived. Called by Vercel Cron.
 *  Protected by CRON_SECRET (Vercel sends it as `Authorization: Bearer <secret>`). */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") || "";
    const url = new URL(req.url);
    const provided = auth.replace(/^Bearer\s+/i, "") || url.searchParams.get("key") || "";
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  }
  if (!hasServiceRole()) {
    return NextResponse.json({ error: "Service role not configured." }, { status: 503 });
  }

  const admin = createAdminClient();
  const nowIso = new Date().toISOString();
  const { data: due, error } = await admin
    .from("scheduled_content")
    .select("id, key, snapshot")
    .eq("done", false)
    .lte("publish_at", nowIso)
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let published = 0;
  for (const row of due ?? []) {
    // Snapshot the current published version for rollback.
    const { data: cur } = await admin.from("site_content").select("published, label").eq("key", row.key).maybeSingle();
    if (cur?.published && Object.keys(cur.published).length) {
      await admin.from("content_versions").insert({ key: row.key, snapshot: cur.published });
    }
    await admin
      .from("site_content")
      .upsert({ key: row.key, label: cur?.label ?? row.key, published: row.snapshot, draft: row.snapshot }, { onConflict: "key" });
    await admin.from("scheduled_content").update({ done: true }).eq("id", row.id);
    await admin.from("activity_log").insert({ action: "scheduled_publish", target: `section:${row.key}` });
    published += 1;
  }

  return NextResponse.json({ ok: true, published });
}
