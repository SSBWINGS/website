"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/** Fires a privacy-friendly aggregate page-view count (no cookies, no PII)
 *  via the track_view RPC on every public route change. */
export default function PageViewTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    if (!pathname || pathname.startsWith("/admin")) return;
    if (last.current === pathname) return;
    last.current = pathname;
    try {
      const supabase = createClient();
      supabase.rpc("track_view", { p: pathname }).then(() => {}, () => {});
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return null;
}
