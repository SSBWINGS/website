"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/data";
import {
  CONTACT_FORM,
  PHONE_DIAL_CODE,
  fullPhone,
  isValidPhone,
  phoneDigits,
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
  /** Just the 10 national digits — the +91 is printed beside the box. */
  const [phoneVal, setPhoneVal] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    // Send the full international number, not the digits shown in the box.
    if ("phone" in data) data.phone = fullPhone(phoneVal);
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
      setPhoneVal("");
      setPhoneTouched(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const labelCls = compact
    ? "mb-1 block font-display text-xs font-bold uppercase tracking-wider text-ink"
    : "mb-1.5 block font-display text-sm font-bold uppercase tracking-wider text-ink";

  /** Full-width row: long answers need the room. */
  const wide = compact ? "col-span-2" : "sm:col-span-2";

  // Plain render functions, not components. Declared as components inside this
  // one, React would see a brand-new type on every render and remount them —
  // so typing in the phone box, or a failed submit, reset every dropdown the
  // student had already picked.

  /** Label + the red asterisk that marks a mandatory field. */
  const label = (f: ContactField) => (
    <label htmlFor={`cf-${f.key}`} className={labelCls}>
      {f.label}
      {f.required && (
        <span className="ml-0.5 text-red-600" aria-hidden>
          *
        </span>
      )}
    </label>
  );

  /** A <select> built from a CMS-managed option list. */
  const dropdown = (f: ContactField, options: string[]) => (
    <div key={f.key}>
      {label(f)}
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

  const input = (f: ContactField, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div key={f.key}>
      {label(f)}
      <input id={`cf-${f.key}`} name={f.key} required={f.required} placeholder={f.placeholder} className="field" {...props} />
    </div>
  );

  const textarea = (f: ContactField, maxLength: number) => (
    <div key={f.key} className={wide}>
      {label(f)}
      <textarea id={`cf-${f.key}`} name={f.key} required={f.required} rows={compact ? 2 : 3}
        maxLength={maxLength} placeholder={f.placeholder} className="field resize-y" />
    </div>
  );

  /** One field, whichever kind it is — built-in or added by the admin. */
  function renderField(f: ContactField) {
    switch (f.key) {
      case "name":
        return input(f, { minLength: 2, maxLength: 80 });
      case "email":
        return input(f, { type: "email" });
      case "entry":
        return dropdown(f, config.entryOptions);
      case "batch":
        return dropdown(f, config.batchOptions);
      case "status":
        return dropdown(f, config.statusOptions);
      case "message":
        return textarea(f, 2000);
      case "phone":
        return (
          <div key={f.key}>
            {label(f)}
            {/* The dial code is fixed and shown, not typed — one less thing to
                get wrong, and every stored number ends up in the same shape. */}
            <div className="flex">
              <span className="flex shrink-0 items-center rounded-l-[0.6rem] border border-r-0 border-[rgba(43,36,22,0.18)] bg-[rgba(43,36,22,0.06)] px-3 font-semibold text-ink-soft">
                {PHONE_DIAL_CODE}
              </span>
              <input
                id="cf-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                required={f.required}
                value={phoneVal}
                onChange={(e) => setPhoneVal(phoneDigits(e.target.value))}
                onBlur={() => setPhoneTouched(true)}
                pattern="[6-9][0-9]{9}"
                title="Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9"
                placeholder={f.placeholder}
                className="field rounded-l-none"
              />
            </div>
            {phoneTouched && phoneVal && !isValidPhone(phoneVal) && (
              <p className="mt-1 text-xs font-medium text-saffron-700">
                Enter a 10-digit mobile number starting with 6, 7, 8 or 9.
              </p>
            )}
          </div>
        );
    }
    // Added by the admin in the CMS.
    switch (f.type) {
      case "textarea":
        return textarea(f, 2000);
      case "select":
        return dropdown(f, f.options ?? []);
      case "number":
        return input(f, { type: "number", inputMode: "decimal" });
      case "date":
        return input(f, { type: "date" });
      default:
        return input(f, { maxLength: 300 });
    }
  }

  return (
    <form onSubmit={onSubmit} aria-label="Enquiry form" className={compact ? "space-y-3" : "space-y-4"}>
      {/* Every field in the admin's order. Long answers span the full width,
          which keeps the message box where it has always been: last, full width. */}
      <div className={compact ? "grid grid-cols-2 gap-3" : "grid gap-4 sm:grid-cols-2"}>
        {config.fields.filter((f) => f.enabled).map(renderField)}
      </div>

      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <button type="submit" disabled={status === "sending" || (Boolean(phoneVal) && !isValidPhone(phoneVal))} className="btn btn-saffron btn-shine w-full text-base disabled:opacity-60">
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
