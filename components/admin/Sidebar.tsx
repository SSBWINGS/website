"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { AdminRole } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

type Item = { href: string; label: string; icon: string; soon?: boolean; superOnly?: boolean };

const ITEMS: Item[] = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/candidates", label: "Recommended Candidates", icon: "🎖", soon: true },
  { href: "/admin/pages", label: "Pages & Sections", icon: "✎", soon: true },
  { href: "/admin/footer", label: "Footer", icon: "▤", soon: true },
  { href: "/admin/media", label: "Media Library", icon: "🖼", soon: true },
  { href: "/admin/users", label: "Users", icon: "👤", superOnly: true },
  { href: "/admin/account", label: "My Account", icon: "⚙" },
];

export default function Sidebar({ role, email }: { role: AdminRole; email: string | null }) {
  const pathname = usePathname();
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-4">
        <Image src="/logo-black.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
        <div className="leading-tight">
          <p className="text-sm font-bold text-slate-900">SSBWINGS</p>
          <p className="text-[11px] font-medium text-slate-500">Content Manager</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {ITEMS.filter((i) => !i.superOnly || role === "super_admin").map((i) => {
          const active = i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
          if (i.soon) {
            return (
              <span key={i.href} className="flex cursor-default items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-400">
                <span className="flex items-center gap-2.5"><span aria-hidden>{i.icon}</span> {i.label}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-400">Soon</span>
              </span>
            );
          }
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span aria-hidden>{i.icon}</span> {i.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="mb-2 px-3">
          <p className="truncate text-xs font-medium text-slate-700">{email}</p>
          <p className="text-[11px] capitalize text-slate-400">{role.replace("_", " ")}</p>
        </div>
        <SignOutButton className="w-full justify-start" />
        <Link href="/" target="_blank" className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
          <span aria-hidden>↗</span> View live site
        </Link>
      </div>
    </aside>
  );
}
