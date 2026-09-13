/** Configuration for the contact / enquiry form — labels, placeholders, which
 *  fields show, which are mandatory, and the dropdown option lists.
 *
 *  Plain data with no imports, so it is safe to use from both the server
 *  (admin editor, API validation) and the client (the form itself). */

/** The built-in fields — each has its own storage and behaviour. */
export type ContactFieldKey =
  | "name"
  | "phone"
  | "email"
  | "entry"
  | "batch"
  | "status"
  | "message";

/** What an admin-added field collects. */
export type CustomFieldType = "text" | "textarea" | "number" | "select" | "date";

export const CUSTOM_FIELD_TYPES: { value: CustomFieldType; label: string }[] = [
  { value: "text", label: "Short answer" },
  { value: "textarea", label: "Long answer" },
  { value: "number", label: "Number" },
  { value: "select", label: "Dropdown" },
  { value: "date", label: "Date" },
];

export type ContactField = {
  /** A built-in key, or "c_…" for a field the admin added. */
  key: string;
  label: string;
  placeholder: string;
  /** Shown with a red *, and an empty submit is refused. */
  required: boolean;
  /** Off hides the field without deleting its settings. */
  enabled: boolean;
  /** Admin-added fields only — built-ins have fixed behaviour. */
  type?: CustomFieldType;
  /** Choices for an admin-added dropdown. */
  options?: string[];
};

export type ContactFormDoc = {
  /** Every field, in the order the form shows them. */
  fields: ContactField[];
  /** Built-in fields the admin deleted. Kept so they can be restored, and so a
   *  deleted field is not quietly brought back. */
  removed: ContactFieldKey[];
  /** Options for the three built-in dropdowns. */
  entryOptions: string[];
  batchOptions: string[];
  statusOptions: string[];
  submitLabel: string;
  successMessage: string;
  privacyNote: string;
};

export const BUILT_IN_KEYS: ContactFieldKey[] = ["name", "phone", "email", "entry", "batch", "status", "message"];

/** Can be hidden but never deleted: an enquiry needs a name and a way to reply,
 *  and the enquiries table requires both columns. */
export const CORE_KEYS: ContactFieldKey[] = ["name", "phone", "email"];

export const isBuiltIn = (key: string): key is ContactFieldKey => (BUILT_IN_KEYS as string[]).includes(key);
export const isCore = (key: string) => (CORE_KEYS as string[]).includes(key);
/** Keys for admin-added fields: "c_" plus 4–12 lowercase letters or digits. */
export const isCustomKey = (key: string) => /^c_[a-z0-9]{4,12}$/.test(key);

/** A fresh admin-added field. */
export function newCustomField(type: CustomFieldType = "text"): ContactField {
  const key = `c_${Math.random().toString(36).slice(2, 10).padEnd(6, "0")}`;
  return {
    key,
    label: "New question",
    placeholder: "",
    required: false,
    enabled: true,
    type,
    ...(type === "select" ? { options: ["Option 1", "Option 2"] } : {}),
  };
}

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
  "SSC Logistics / ATC / Education",
  "JAG (Navy) – Law Cadre",
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
  "RVC (Remount & Veterinary Corps)",
  "AMC (NT) – Army Medical Corps (Non-Tech)",
  "Navy (CW) – Commission Worthy",
  "Navy (HET) – Higher Educational Test",
  "Agniveer / Other Ranks to Officer",
  "Other / Not sure yet",
];

export const BATCH_OPTIONS: string[] = ["Offline (Noida campus)", "Online (live classes)"];
export const STATUS_OPTIONS: string[] = ["Fresher (first attempt)", "Repeater (attempted before)"];

export const CONTACT_FORM: ContactFormDoc = {
  fields: [
    { key: "name", label: "Full Name", placeholder: "e.g. Arjun Singh", required: true, enabled: true },
    { key: "phone", label: "Phone", placeholder: "98765 43210", required: true, enabled: true },
    { key: "email", label: "Email", placeholder: "you@example.com", required: true, enabled: true },
    { key: "entry", label: "Target Entry", placeholder: "Select your entry", required: true, enabled: true },
    { key: "batch", label: "Preferred Batch", placeholder: "Select a batch", required: true, enabled: true },
    { key: "status", label: "Current Status", placeholder: "Select your status", required: true, enabled: true },
    { key: "message", label: "Message", placeholder: "Attempt history, Board date, or any question…", required: false, enabled: true },
  ],
  removed: [],
  entryOptions: ENTRY_OPTIONS,
  batchOptions: BATCH_OPTIONS,
  statusOptions: STATUS_OPTIONS,
  submitLabel: "Request Free Callback →",
  successMessage: "Message received, future officer! A mentor will contact you within 24 hours.",
  privacyNote: "🔒 Your details stay with SSBWINGS. We never share them.",
};

const isText = (v: unknown): v is string => typeof v === "string";
const cleanList = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => isText(x) && x.trim() !== "").map((x) => x.trim()) : [];

/** A built-in field with the admin's edits applied over its defaults. */
function mergeBuiltIn(def: ContactField, saved: Partial<ContactField>): ContactField {
  return {
    key: def.key,
    label: isText(saved.label) && saved.label.trim() ? saved.label : def.label,
    placeholder: isText(saved.placeholder) ? saved.placeholder : def.placeholder,
    required: typeof saved.required === "boolean" ? saved.required : def.required,
    enabled: typeof saved.enabled === "boolean" ? saved.enabled : def.enabled,
  };
}

/** An admin-added field, checked property by property — the stored document is
 *  editable data, so nothing about its shape is trusted. */
function cleanCustom(saved: Partial<ContactField>): ContactField | null {
  if (!isText(saved.key) || !isCustomKey(saved.key)) return null;
  const type = CUSTOM_FIELD_TYPES.some((t) => t.value === saved.type) ? (saved.type as CustomFieldType) : "text";
  const options = type === "select" ? cleanList(saved.options) : undefined;
  // A dropdown with no choices could never be answered; show it as free text.
  const safeType: CustomFieldType = type === "select" && !options?.length ? "text" : type;
  return {
    key: saved.key,
    label: isText(saved.label) && saved.label.trim() ? saved.label.slice(0, 80) : "Question",
    placeholder: isText(saved.placeholder) ? saved.placeholder.slice(0, 120) : "",
    required: saved.required === true,
    enabled: saved.enabled !== false,
    type: safeType,
    ...(safeType === "select" ? { options } : {}),
  };
}

/**
 * The form as it should render: the admin's fields in the admin's order,
 * built-ins merged over their defaults, deleted built-ins left out.
 *
 * Built-ins the stored document never mentions are appended, so a field added
 * to the code later still appears on sites saved before it existed.
 */
export function resolveContactForm(saved: unknown): ContactFormDoc {
  const doc = (saved ?? {}) as Partial<ContactFormDoc>;
  // Core fields can never be deleted, whatever the stored document says.
  const removed = cleanList(doc.removed).filter(
    (k): k is ContactFieldKey => isBuiltIn(k) && !isCore(k),
  );
  const gone = new Set<string>(removed);
  const seen = new Set<string>();
  const fields: ContactField[] = [];

  for (const raw of Array.isArray(doc.fields) ? doc.fields : []) {
    if (!raw || !isText(raw.key) || seen.has(raw.key)) continue;
    const def = CONTACT_FORM.fields.find((f) => f.key === raw.key);
    const field = def ? (gone.has(def.key) ? null : mergeBuiltIn(def, raw)) : cleanCustom(raw);
    if (!field) continue;
    fields.push(field);
    seen.add(field.key);
  }
  for (const def of CONTACT_FORM.fields) {
    if (!seen.has(def.key) && !gone.has(def.key)) fields.push(def);
  }

  const list = (v: unknown, fallback: string[]) => {
    const arr = cleanList(v);
    return arr.length ? arr : fallback;
  };
  const text = (v: unknown, fallback: string) => (isText(v) && v.trim() ? v : fallback);

  return {
    fields,
    removed: Array.from(new Set(removed)),
    entryOptions: list(doc.entryOptions, CONTACT_FORM.entryOptions),
    batchOptions: list(doc.batchOptions, CONTACT_FORM.batchOptions),
    statusOptions: list(doc.statusOptions, CONTACT_FORM.statusOptions),
    submitLabel: text(doc.submitLabel, CONTACT_FORM.submitLabel),
    successMessage: text(doc.successMessage, CONTACT_FORM.successMessage),
    privacyNote: text(doc.privacyNote, CONTACT_FORM.privacyNote),
  };
}

/** Longest answer kept for each kind of admin-added field. */
const CUSTOM_MAX: Record<CustomFieldType, number> = { text: 300, textarea: 2000, number: 30, select: 200, date: 10 };

/**
 * Read and check the answers to admin-added fields from a submission.
 *
 * Returns them in form order as label/value pairs — labels rather than keys,
 * so an enquiry stays readable even after the admin renames or deletes the
 * question. Hidden fields are ignored; anything submitted for a field that is
 * not on the form is dropped.
 */
export function readCustomAnswers(
  form: ContactFormDoc,
  body: Record<string, unknown>,
): { answers: { label: string; value: string }[]; error?: string } {
  const answers: { label: string; value: string }[] = [];
  for (const f of form.fields) {
    if (!f.enabled || isBuiltIn(f.key) || !f.type) continue;
    const raw = body[f.key];
    const value = isText(raw) ? raw.trim().slice(0, CUSTOM_MAX[f.type]) : "";

    if (!value) {
      if (f.required) return { answers, error: `Please fill in ${f.label}.` };
      continue;
    }
    if (f.type === "number" && !/^-?\d+(\.\d+)?$/.test(value)) {
      return { answers, error: `${f.label} must be a number.` };
    }
    if (f.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return { answers, error: `${f.label} must be a date.` };
    }
    // A dropdown answer must be one of its choices — anything else was typed
    // in by hand rather than picked from the form.
    if (f.type === "select" && !(f.options ?? []).includes(value)) {
      return { answers, error: `Please choose a valid option for ${f.label}.` };
    }
    answers.push({ label: f.label, value });
  }
  return { answers };
}

/* ── Phone handling ───────────────────────────────────────────────────────
   The academy serves Indian aspirants, so the dial code is fixed and shown
   as a prefix rather than typed. Visitors enter the 10 national digits only;
   everything stored, emailed and validated uses the full +91 form. */

export const PHONE_DIAL_CODE = "+91";

/**
 * Reduce anything typed or pasted to at most 10 national digits.
 * Tolerates the formats people actually paste — "+91 98765 43210",
 * "091-98765-43210", "(+91) 9876543210" — so a paste is never rejected for
 * repeating the country code the field already shows.
 */
export function phoneDigits(raw: string): string {
  let d = (raw ?? "").replace(/\D/g, "");
  d = d.replace(/^0+/, "");
  // Only strip a leading 91 when digits remain beyond a full local number,
  // so a genuine number starting "91…" is left alone.
  if (d.startsWith("91") && d.length > 10) d = d.slice(2);
  return d.slice(0, 10);
}

/** Indian mobile numbers are exactly 10 digits and begin 6, 7, 8 or 9. */
export const isValidPhone = (digits: string): boolean => /^[6-9]\d{9}$/.test(digits);

/** The form the number is stored and emailed in. */
export const fullPhone = (digits: string): string =>
  digits ? `${PHONE_DIAL_CODE}${digits}` : "";
