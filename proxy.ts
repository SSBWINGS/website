import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { ENTRY_PAGES } from "@/lib/entry-pages";

const ENTRY_SLUGS = new Set(ENTRY_PAGES.map((p) => p.slug));

// Next.js 16 "proxy" convention (replaces the deprecated "middleware" file).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Unknown entry pages must be a real 404. The site's loading.tsx streams the
  // shell with status 200 before the page can call notFound(), so rejecting
  // after rendering starts produced a "soft 404" — a 200 carrying a noindex
  // tag, which search engines flag. The valid slugs are a fixed list, so they
  // can be checked here, before anything renders.
  if (pathname.startsWith("/entries/")) {
    const slug = pathname.slice("/entries/".length).replace(/\/$/, "");
    if (ENTRY_SLUGS.has(slug)) return NextResponse.next();
    // Rewriting to a path no route matches renders the site's not-found page
    // with a genuine 404 status.
    return NextResponse.rewrite(new URL("/__entry-not-found", request.url), { status: 404 });
  }

  // Admin only from here: refresh the Supabase session. Never on public pages —
  // that would add a database round trip to every visitor's request.
  return updateSession(request);
}

export const config = {
  // Admin routes + admin API for the session, plus entry pages for the 404
  // check. The rest of the public site and static assets skip the proxy.
  matcher: ["/admin/:path*", "/api/admin/:path*", "/entries/:slug+"],
};
