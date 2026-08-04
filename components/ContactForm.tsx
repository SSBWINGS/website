"use client";

import { useState, type FormEvent } from "react";

const ENTRY_OPTIONS = [
  "NDA", "CDS", "AFCAT", "TES", "TGC", "10+2 Navy B.Tech",
  "SSC Tech", "NCC Special Entry", "Indian Coast Guard",
  "Service Entry (ACC / PC-SL / SCO)", "Other / Not sure yet",
];

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const labelCls = compact
    ? "mb-1 block font-display text-xs font-bold uppercase tracking-wider text-ink"
    : "mb-1.5 block font-display text-sm font-bold uppercase tracking-wider text-ink";

  return (
    <form onSubmit={onSubmit} aria-label="Enquiry form" className={compact ? "space-y-3" : "space-y-4"}>
      <div className={compact ? "grid grid-cols-2 gap-3" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label htmlFor="cf-name" className={labelCls}>
            Full Name *
          </label>
          <input id="cf-name" name="name" required minLength={2} maxLength={80} placeholder="e.g. Arjun Singh" className="field" />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelCls}>
            Phone *
          </label>
          <input id="cf-phone" name="phone" type="tel" required pattern="[0-9+\-\s]{10,15}" placeholder="+91 XXXXX XXXXX" className="field" />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelCls}>
            Email *
          </label>
          <input id="cf-email" name="email" type="email" required placeholder="you@example.com" className="field" />
        </div>
        <div>
          <label htmlFor="cf-entry" className={labelCls}>
            Target Entry *
          </label>
          <select id="cf-entry" name="entry" required defaultValue="" className="field">
            <option value="" disabled>Select your entry</option>
            {ENTRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="cf-msg" className={labelCls}>
          Message
        </label>
        <textarea id="cf-msg" name="message" rows={compact ? 2 : 3} maxLength={2000} placeholder="Attempt history, Board date, or any question…" className="field resize-y" />
      </div>

      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <button type="submit" disabled={status === "sending"} className="btn btn-saffron btn-shine w-full text-base disabled:opacity-60">
        {status === "sending" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
            Transmitting…
          </>
        ) : "Request Free Callback →"}
      </button>

      <div aria-live="polite">
        {status === "success" && (
          <p className="journey-panel rounded-xl border border-tri-green-500/40 bg-tri-green-50 px-4 py-3 text-sm font-medium text-tri-green-700">
            ✅ Message received, future officer! A mentor will contact you within 24 hours.
          </p>
        )}
        {status === "error" && (
          <p className="journey-panel rounded-xl border border-saffron-600/40 bg-saffron-50 px-4 py-3 text-sm font-medium text-saffron-700">
            ⚠️ {errorMsg} — or call us at +91 95605 10035.
          </p>
        )}
      </div>
      <p className="text-center text-xs text-ink-soft">🔒 Your details stay with SSBWINGS. We never share them.</p>
    </form>
  );
}
