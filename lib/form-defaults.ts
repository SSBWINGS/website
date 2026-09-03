/** Configuration for the contact / enquiry form — labels, placeholders, which
 *  fields show, which are mandatory, and the dropdown option lists.
 *
 *  Plain data with no imports, so it is safe to use from both the server
 *  (admin editor, API validation) and the client (the form itself). */

export type ContactFieldKey =
  | "name"
  | "phone"
  | "email"
  | "entry"
  | "batch"
  | "status"
  | "message";

export type ContactField = {
  key: ContactFieldKey;
  label: string;
  placeholder: string;
  /** "on" → shown with a red *, and the browser blocks an empty submit. */
  required: boolean;
  /** "off" hides the field entirely without deleting its settings. */
  enabled: boolean;
};

export type ContactFormDoc = {
  fields: ContactField[];
  /** Options for the three dropdowns. */
  entryOptions: string[];
  batchOptions: string[];
  statusOptions: string[];
  submitLabel: string;
  successMessage: string;
  privacyNote: string;
};

/** Every officer entry an aspirant can target. */
export const ENTRY_OPTIONS: string[] = [
  "NDA & NA",
  "10+2 TES (Technical Entry)",
  "10+2 B.Tech Cadet Entry (Navy)",
  "CDS – IMA (Permanent)",
  "CDS – OTA / SSC",
  "CDS – INA (Navy)",
  "CDS – AFA (Air Force Academy)",
  "TGC (Technical Graduate Course)",
  "SSC (Tech) – Men & Women",
  "SSC Executive – GS(X) & Technical",
  "SSC Pilot / Observer",
  "SSC Logistics / ATC / Education / Law",
  "AFCAT – Flying Branch",
  "AFCAT – Ground Duty (Technical)",
  "AFCAT – Ground Duty (Non-Technical)",
  "Meteorology Entry",
  "NCC Special Entry",
  "JAG (Judge Advocate General)",
  "ICG Asst Commandant – General Duty",
  "ICG AC – Pilot / Navigator",
  "ICG AC – Technical",
  "ACC (Army Cadet College)",
  "SCO (Special Commissioned Officer)",
  "PC (SL) – Permanent Commission",
  "Agniveer / Other Ranks to Officer",
  "Other / Not sure yet",
];

export const BATCH_OPTIONS: string[] = ["Offline (Noida campus)", "Online (live classes)"];
export const STATUS_OPTIONS: string[] = ["Fresher (first attempt)", "Repeater (attempted before)"];

export const CONTACT_FORM: ContactFormDoc = {
  fields: [
    { key: "name", label: "Full Name", placeholder: "e.g. Arjun Singh", required: true, enabled: true },
    { key: "phone", label: "Phone", placeholder: "+91 XXXXX XXXXX", required: true, enabled: true },
    { key: "email", label: "Email", placeholder: "you@example.com", required: true, enabled: true },
    { key: "entry", label: "Target Entry", placeholder: "Select your entry", required: true, enabled: true },
    { key: "batch", label: "Preferred Batch", placeholder: "Select a batch", required: true, enabled: true },
    { key: "status", label: "Current Status", placeholder: "Select your status", required: true, enabled: true },
    { key: "message", label: "Message", placeholder: "Attempt history, Board date, or any question…", required: false, enabled: true },
  ],
  entryOptions: ENTRY_OPTIONS,
  batchOptions: BATCH_OPTIONS,
  statusOptions: STATUS_OPTIONS,
  submitLabel: "Request Free Callback →",
  successMessage: "Message received, future officer! A mentor will contact you within 24 hours.",
  privacyNote: "🔒 Your details stay with SSBWINGS. We never share them.",
};

/** Merge a stored document over the defaults so a partially-filled CMS doc (or
 *  one saved before a field existed) still renders a complete form. */
export function resolveContactForm(saved: unknown): ContactFormDoc {
  const doc = (saved ?? {}) as Partial<ContactFormDoc>;
  const savedFields = Array.isArray(doc.fields) ? doc.fields : [];

  const fields = CONTACT_FORM.fields.map((def) => {
    const hit = savedFields.find((f) => f && f.key === def.key);
    if (!hit) return def;
    return {
      key: def.key,
      label: typeof hit.label === "string" && hit.label.trim() ? hit.label : def.label,
      placeholder: typeof hit.placeholder === "string" ? hit.placeholder : def.placeholder,
      required: typeof hit.required === "boolean" ? hit.required : def.required,
      enabled: typeof hit.enabled === "boolean" ? hit.enabled : def.enabled,
    };
  });

  const list = (v: unknown, fallback: string[]) => {
    const arr = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];
    return arr.length ? arr : fallback;
  };
  const text = (v: unknown, fallback: string) =>
    typeof v === "string" && v.trim() ? v : fallback;

  return {
    fields,
    entryOptions: list(doc.entryOptions, CONTACT_FORM.entryOptions),
    batchOptions: list(doc.batchOptions, CONTACT_FORM.batchOptions),
    statusOptions: list(doc.statusOptions, CONTACT_FORM.statusOptions),
    submitLabel: text(doc.submitLabel, CONTACT_FORM.submitLabel),
    successMessage: text(doc.successMessage, CONTACT_FORM.successMessage),
    privacyNote: text(doc.privacyNote, CONTACT_FORM.privacyNote),
  };
}
