"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { bustCmsCache } from "@/lib/revalidate-client";
import { mediaUrl, MEDIA_CACHE_CONTROL } from "@/lib/supabase/media";

const FIELDS: { key: string; label: string; hint?: string }[] = [
  { key: "name", label: "Brand name" },
  { key: "tagline", label: "Tagline" },
  { key: "phone1", label: "Phone 1" },
  { key: "phone2", label: "Phone 2", hint: "Leave blank to show only one number across the site" },
  { key: "email", label: "Email" },
  { key: "whatsapp", label: "WhatsApp link", hint: "Full https://wa.me/… URL" },
  { key: "address", label: "Address" },
  { key: "mapUrl", label: "Google Maps link", hint: "Every address on the site opens this. Blank = searches the address above." },
  { key: "instagram", label: "Instagram URL" },
  { key: "youtube", label: "YouTube URL" },
  { key: "telegram", label: "Telegram URL" },
];

export default function SettingsEditor({ initial }: { initial: Record<string, string> }) {
  const supabase = createClient();
  const [form, setForm] = useState<Record<string, string>>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  /** Outcome of the last "send test email", straight from the server. */
  const [mailTest, setMailTest] = useState<
    | { ok: boolean; from: string; to: string[]; error?: string; hint?: string; usingTestSender?: boolean }
    | null
  >(null);
  const [testing, setTesting] = useState(false);

  async function testEmail() {
    setTesting(true);
    setMailTest(null);
    try {
      const res = await fetch("/api/admin/test-email", { method: "POST" });
      const json = await res.json();
      setMailTest(res.ok ? json : { ok: false, from: "", to: [], error: json.error ?? "Request failed." });
    } catch {
      setMailTest({ ok: false, from: "", to: [], error: "Could not reach the server." });
    } finally {
      setTesting(false);
    }
  }

  /** Upload a replacement brochure PDF and point the site at it. */
  async function uploadBrochure(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      return setMsg({ ok: false, text: "Please choose a PDF file." });
    }
    if (file.size > 25 * 1024 * 1024) {
      return setMsg({ ok: false, text: "That PDF is over 25 MB — please compress it first." });
    }
    setBusy(true); setMsg(null);
    // Timestamped name so browsers and the CDN never serve the previous file.
    const path = `brochure/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: MEDIA_CACHE_CONTROL, upsert: true, contentType: "application/pdf",
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setForm((s2) => ({ ...s2, brochure: path }));
    setMsg({ ok: true, text: "Brochure uploaded — press Save & publish to make it live." });
  }

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
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800">Brochure (PDF)</p>
        <p className="mt-0.5 text-xs text-slate-500">
          Linked from the footer, the Courses page and the chatbot. Uploading a new file replaces it everywhere.
        </p>
        <label className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={(form.brochureEnabled ?? "on") !== "off"}
            onChange={(e) => setForm((s2) => ({ ...s2, brochureEnabled: e.target.checked ? "on" : "off" }))}
            className="h-4 w-4"
          />
          Allow visitors to download the brochure
        </label>
        <p className="mb-3 mt-0.5 text-xs text-slate-500">
          When this is off, every “Download brochure” link on the site sends the visitor to the
          <b> contact form</b> instead, so you can send it to them yourself. The file below is kept either way.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            {busy ? "Working…" : "⬆ Upload new brochure"}
            <input type="file" accept="application/pdf,.pdf" onChange={uploadBrochure} className="hidden" disabled={busy} />
          </label>
          {form.brochure && (
            <a href={mediaUrl(form.brochure)} target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-blue-700 underline">
              View current brochure ↗
            </a>
          )}
        </div>
        <p className="mt-2 break-all text-[11px] text-slate-400">{form.brochure || "No brochure set"}</p>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800">Enquiry emails</p>
        <p className="mt-0.5 text-xs text-slate-500">
          Every enquiry is saved under <b>Enquiries</b> whatever happens. This checks the email notification
          on top of that — it sends a real test message and shows exactly what the mail service replied.
        </p>
        <button
          type="button"
          onClick={testEmail}
          disabled={testing}
          className="mt-3 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {testing ? "Sending…" : "✉ Send test email"}
        </button>

        {mailTest && (
          <div className={`mt-3 rounded-lg px-3 py-2.5 text-sm ${mailTest.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {mailTest.ok ? (
              <>
                <p className="font-semibold">✓ Accepted for delivery to {mailTest.to.join(", ")}</p>
                <p className="mt-1 text-xs">
                  From <code>{mailTest.from}</code>. If it does not arrive within a few minutes, the problem is the
                  receiving mailbox rather than the website — check spam, and that the address has a working inbox.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">✗ Not sent{mailTest.to.length ? ` to ${mailTest.to.join(", ")}` : ""}</p>
                {mailTest.error && <p className="mt-1 text-xs"><b>Mail service said:</b> {mailTest.error}</p>}
                {mailTest.hint && <p className="mt-1 text-xs"><b>How to fix:</b> {mailTest.hint}</p>}
                {mailTest.from && <p className="mt-1 text-xs text-red-700/80">Current sender: <code>{mailTest.from}</code></p>}
              </>
            )}
          </div>
        )}
      </div>

      {msg && <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
      <button type="submit" disabled={busy} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
        {busy ? "Saving…" : "Save & publish"}
      </button>
    </form>
  );
}
