/** Everything an enquiry recorded, as label/value pairs for the admin inbox.
 *
 *  Enquiries arrive from several forms — the contact form and enquiry popup,
 *  the Eligibility Finder, the mock tests — and each stores its extra answers
 *  in `meta` under its own keys. The inbox used to know only two of them
 *  (batch and status), so anything else was saved but never shown. This turns
 *  all of it into readable rows, including keys it has never seen.
 *
 *  Pure and dependency-free, so it can be unit-tested. */

export type EnquiryLike = {
  phone?: string | null;
  email?: string | null;
  entry?: string | null;
  message?: string | null;
  meta?: Record<string, unknown> | null;
};

export type Detail = { label: string; value: string };

/** Friendly names for meta keys the site's forms are known to send. */
const KNOWN_LABELS: Record<string, string> = {
  batch: "Preferred Batch",
  status: "Current Status",
  // Eligibility Finder
  age: "Age",
  gender: "Gender",
  marital: "Marital status",
  education: "Qualification",
  pcm: "Physics & Maths in Class 12",
  serving: "Already serving",
  count: "Entries matched",
  // Mock tests
  score: "Score",
  total: "Out of",
  test: "Test",
};

/** Meta keys never shown to the admin — internal bookkeeping. */
const HIDDEN = new Set(["custom"]);

/** "preferred_batch" / "preferredBatch" → "Preferred batch". */
export function humanise(key: string): string {
  const words = key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : key;
}

/** Any stored value as something a person can read. Empty values give "". */
export function readable(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "";
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v)) return v.map(readable).filter(Boolean).join(", ");
  if (typeof v === "object") {
    return Object.entries(v as Record<string, unknown>)
      .map(([k, x]) => (readable(x) ? `${humanise(k)}: ${readable(x)}` : ""))
      .filter(Boolean)
      .join("; ");
  }
  return String(v);
}

/** Answers to questions the admin added to the form, stored by label. */
export function customAnswers(meta: Record<string, unknown> | null | undefined): Detail[] {
  const v = meta?.custom;
  if (!Array.isArray(v)) return [];
  return v
    .map((a) =>
      a && typeof a === "object"
        ? { label: readable((a as { label?: unknown }).label), value: readable((a as { value?: unknown }).value) }
        : { label: "", value: "" },
    )
    .filter((a) => a.label && a.value);
}

/**
 * Every piece of information the enquiry holds, in a sensible reading order:
 * the target entry, the known extra answers, the admin's own questions, then
 * anything else stored, and finally the message.
 *
 * `labels` lets the inbox use the wording the admin gave the fields on the
 * form (e.g. "Target Entry"), rather than the storage key.
 */
export function enquiryDetails(r: EnquiryLike, labels: Record<string, string> = {}): Detail[] {
  const meta = r.meta ?? {};
  const out: Detail[] = [];
  const push = (label: string, value: unknown) => {
    const text = readable(value);
    if (text) out.push({ label, value: text });
  };

  push(labels.entry || "Target Entry", r.entry);
  // Known keys first, in a fixed order, then whatever else the form stored.
  const known = Object.keys(KNOWN_LABELS).filter((k) => k in meta);
  for (const k of known) push(labels[k] || KNOWN_LABELS[k], meta[k]);
  out.push(...customAnswers(meta));
  for (const [k, v] of Object.entries(meta)) {
    if (HIDDEN.has(k) || k in KNOWN_LABELS) continue;
    push(humanise(k), v);
  }
  push(labels.message || "Message", r.message);
  return out;
}

/** One searchable string covering every detail of an enquiry. */
export const searchText = (r: EnquiryLike & { name?: string | null }) =>
  [r.name, r.phone, r.email, ...enquiryDetails(r).map((d) => `${d.label} ${d.value}`)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
