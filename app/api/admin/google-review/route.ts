import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const strip = (s: string) => s.replace(/\s+/g, " ").trim();

/** Best-effort scrape of a pasted Google review/place link so the admin doesn't
 *  have to retype the reviewer's name and text. Google renders reviews with
 *  JavaScript, so this only reliably recovers the page title/preview — whatever
 *  it finds is returned as a starting point for the admin to correct. */
export async function POST(req: Request) {
  const rl = rateLimit(`greview:${clientIp(req)}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  let body: { url?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const url = (body.url ?? "").trim();
  if (!/^https?:\/\/[^\s]+$/i.test(url) || !/google\.|goo\.gl|maps\.app/i.test(url)) {
    return NextResponse.json({ error: "Paste a Google review or Maps link." }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SSBWINGS-CMS/1.0)" },
      redirect: "follow",
    });
    const html = await res.text();

    const og = (prop: string) => {
      const m = html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, "i"))
        || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, "i"));
      return m ? strip(m[1]) : "";
    };

    const title = og("title");
    const description = og("description");
    const image = og("image");

    // Google's OG title is usually "<Reviewer> on Google" or the place name.
    const name = strip(title.replace(/\s*[-–—|]\s*Google.*$/i, "").replace(/\s+on Google$/i, ""));
    const ratingMatch = description.match(/([1-5])(?:\.\d)?\s*(?:star|★|\/\s*5)/i);

    return NextResponse.json({
      ok: true,
      url,
      name: name || "",
      text: description || "",
      avatar: image || "",
      rating: ratingMatch ? Number(ratingMatch[1]) : 5,
      note: "Google renders reviews with JavaScript, so please check these details before publishing.",
    });
  } catch {
    return NextResponse.json({ error: "Could not read that link — enter the details manually." }, { status: 502 });
  }
}
