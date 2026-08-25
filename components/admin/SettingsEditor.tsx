"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { bustCmsCache } from "@/lib/revalidate-client";

const FIELDS: { key: string; label: string; hint?: string }[] = [
  { key: "name", label: "Brand name" },
  { key: "tagline", label: "Tagline" },
  { key: "phone1", label: "Phone 1" },
  { key: "phone2", label: "Phone 2" },
  { key: "email", label: "Email" },
  { key: "whatsapp", label: "WhatsApp link", hint: "Full https://wa.me/… URL" },
  { key: "address", label: "Address" },
  { key: "instagram", label: "Instagram URL" },
  { key: "youtube", label: "YouTube URL" },
  { key: "telegram", label: "Telegram URL" },
];

export default function SettingsEditor({ initial }: { initial: Record<string, string> }) {
  const supabase = createClient();
  const [form, setForm] = useState<Record<string, string>>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const doc = { ...form };
    const { error } = await supabase.from("site_content").upsert({
      key: "settings",
      label: "Site Settings (contact & socials)",
      draft: doc,
      published: doc,
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setMsg({ ok: true, text: "Saved & published. Changes are live on the site." }); void bustCmsCache();
  }

  return (
    <form onSubmit={save} className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.key === "address" ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-sm font-medium text-slate-700">{f.label}</label>
            <input value={form[f.key] ?? ""} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            {f.hint && <p className="mt-0.5 text-xs text-slate-400">{f.hint}</p>}
          </div>
        ))}
      </div>
      {msg && <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
      <button type="submit" disabled={busy} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
        {busy ? "Saving…" : "Save & publish"}
      </button>
    </form>
  );
}
