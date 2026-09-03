"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/data";
import {
  CONTACT_FORM,
  type ContactField,
  type ContactFormDoc,
} from "@/lib/form-defaults";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({
  compact = false,
  config = CONTACT_FORM,
}: {
  compact?: boolean;
  /** CMS-editable labels, placeholders, required flags and dropdown options. */
  config?: ContactFormDoc;
}) {
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

  const shown = config.fields.filter((f) => f.enabled);
  const find = (key: ContactField["key"]) => shown.find((f) => f.key === key);

  /** Label + the red asterisk that marks a mandatory field. */
  const Label = ({ f }: { f: ContactField }) => (
    <label htmlFor={`cf-${f.key}`} className={labelCls}>
      {f.label}
      {f.required && (
        <span className="ml-0.5 text-red-600" aria-hidden>
          *
        </span>
      )}
    </label>
  );

  /** One <select> built from a CMS-managed option list. */
  const Dropdown = ({ f, options }: { f: ContactField; options: string[] }) => (
    <div>
      <Label f={f} />
      <select id={`cf-${f.key}`} name={f.key} required={f.required} defaultValue="" className="field">
        <option value="" disabled={f.required}>
          {f.placeholder || `Select ${f.label.toLowerCase()}`}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  const name = find("name");
  const phone = find("phone");
  const email = find("email");
  const entry = find("entry");
  const batch = find("batch");
  const statusField = find("status");
  const message = find("message");

  return (
    <form onSubmit={onSubmit} aria-label="Enquiry form" className={compact ? "space-y-3" : "space-y-4"}>
      <div className={compact ? "grid grid-cols-2 gap-3" : "grid gap-4 sm:grid-cols-2"}>
        {name && (
          <div>
            <Label f={name} />
            <input id="cf-name" name="name" required={name.required} minLength={2} maxLength={80}
              placeholder={name.placeholder} className="field" />
          </div>
        )}
        {phone && (
          <div>
            <Label f={phone} />
            <input id="cf-phone" name="phone" type="tel" required={phone.required} pattern="[0-9+\-\s]{10,15}"
              placeholder={phone.placeholder} className="field" />
          </div>
        )}
        {email && (
          <div>
            <Label f={email} />
            <input id="cf-email" name="email" type="email" required={email.required}
              placeholder={email.placeholder} className="field" />
          </div>
        )}
        {entry && <Dropdown f={entry} options={config.entryOptions} />}
        {batch && <Dropdown f={batch} options={config.batchOptions} />}
        {statusField && <Dropdown f={statusField} options={config.statusOptions} />}
      </div>

      {message && (
        <div>
          <Label f={message} />
          <textarea id="cf-message" name="message" required={message.required} rows={compact ? 2 : 3}
            maxLength={2000} placeholder={message.placeholder} className="field resize-y" />
        </div>
      )}

      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <button type="submit" disabled={status === "sending"} className="btn btn-saffron btn-shine w-full text-base disabled:opacity-60">
        {status === "sending" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
            Transmitting…
          </>
        ) : config.submitLabel}
      </button>

      <div aria-live="polite">
        {status === "success" && (
          <p className="journey-panel rounded-xl border border-tri-green-500/40 bg-tri-green-50 px-4 py-3 text-sm font-medium text-tri-green-700">
            ✅ {config.successMessage}
          </p>
        )}
        {status === "error" && (
          <p className="journey-panel rounded-xl border border-saffron-600/40 bg-saffron-50 px-4 py-3 text-sm font-medium text-saffron-700">
            ⚠️ {errorMsg} — or call us at {SITE.phone1}.
          </p>
        )}
      </div>
      <p className="text-center text-xs text-ink-soft">{config.privacyNote}</p>
    </form>
  );
}
