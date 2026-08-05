import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import Sidebar from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <AdminNotConfigured />;

  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar role={admin.role} email={admin.email} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
