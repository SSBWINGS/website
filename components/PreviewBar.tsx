"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Shown on the live site ONLY when an admin has draft-preview mode on
 *  (the ssbw-preview cookie, set by the section editor). Gives a one-click
 *  jump into the CMS to edit whatever page they're looking at, plus an exit. */
export default function PreviewBar() {
  const pathname = usePathname();
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(document.cookie.split("; ").some((c) => c.startsWith("ssbw-preview=1")));
  }, [pathname]);

  if (!on) return null;

  function exit() {
    document.cookie = "ssbw-preview=; path=/; Max-Age=0; SameSite=Lax";
    setOn(false);
    window.location.reload();
  }

  // Map the current page to the most relevant CMS destination.
  const editHref =
    pathname === "/" ? "/admin/sections"
      : pathname.startsWith("/blog") ? "/admin/blog"
      : pathname.startsWith("/testimonials") ? "/admin/testimonials"
      : pathname.startsWith("/gallery") ? "/admin/candidates"
      : "/admin/sections";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] flex items-center justify-center gap-3 border-t border-amber-300 bg-amber-100/95 px-4 py-2 text-sm shadow-lg backdrop-blur">
      <span className="font-semibold text-amber-900">👁 Draft preview — you&apos;re seeing unpublished changes</span>
      <Link href={editHref} className="rounded-md bg-amber-900 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-800">
        ✎ Edit this page
      </Link>
      <Link href="/admin" className="rounded-md border border-amber-400 px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-200">
        Open CMS
      </Link>
      <button onClick={exit} className="rounded-md border border-amber-400 px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-200">
        Exit preview
      </button>
    </div>
  );
}
