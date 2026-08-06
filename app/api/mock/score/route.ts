import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Scores an OIR attempt server-side so the correct answers are never exposed
 *  to the client before submission. Body: { answers: { [id]: number } } */
export async function POST(req: Request) {
  const rl = rateLimit(`mock:${clientIp(req)}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts. Please wait." }, { status: 429 });

  let body: { answers?: Record<string, number> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const answers = body.answers ?? {};
  const ids = Object.keys(answers).slice(0, 100);
  if (ids.length === 0) return NextResponse.json({ error: "No answers submitted." }, { status: 400 });

  // Read the correct answers with elevated read (service role if available,
  // otherwise the anon view can't see answers — so fall back to no scoring).
  const db = hasServiceRole() ? createAdminClient() : await createClient();
  const { data, error } = await db
    .from(hasServiceRole() ? "mock_questions" : "published_mock_questions")
    .select("id, answer, explanation")
    .in("id", ids);

  if (error || !data) {
    return NextResponse.json({ error: "Could not score right now." }, { status: 502 });
  }

  let correct = 0;
  const details = data.map((q: { id: string; answer: number | null; explanation: string | null }) => {
    const chosen = answers[q.id];
    const isRight = typeof q.answer === "number" && chosen === q.answer;
    if (isRight) correct += 1;
    return { id: q.id, chosen, answer: q.answer, correct: isRight, explanation: q.explanation ?? null };
  });

  return NextResponse.json({ correct, total: data.length, details });
}
