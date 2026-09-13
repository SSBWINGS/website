"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { bustCmsCache } from "@/lib/revalidate-client";
import {
  CONTACT_FORM,
  CUSTOM_FIELD_TYPES,
  isBuiltIn,
  isCore,
  newCustomField,
  type ContactField,
  type ContactFieldKey,
  type ContactFormDoc,
  type CustomFieldType,
} from "@/lib/form-defaults";

/** What each built-in field is, for the admin. Their behaviour is fixed —
 *  the phone box always adds +91 — but their dropdown choices are editable. */
const BUILT_IN_INFO: Record<ContactFieldKey, { kind: string; hint: string }> = {
  name: { kind: "Name", hint: "The aspirant's full name." },
  phone: { kind: "Phone", hint: "Indian mobile number — +91 is added automatically." },
  email: { kind: "Email", hint: "Used to reply, and for the automatic acknowledgement." },
  entry: { kind: "Dropdown", hint: "What an aspirant picks as their target entry." },
  batch: { kind: "Dropdown", hint: "Usually offline and online." },
  status: { kind: "Dropdown", hint: "Usually fresher and repeater." },
  message: { kind: "Long answer", hint: "The free-text box." },
};

type ListKey = "entryOptions" | "batchOptions" | "statusOptions";
/** Which choice list each built-in dropdown reads. */
const LIST_FOR: Partial<Record<ContactFieldKey, ListKey>> = {
  entry: "entryOptions",
  batch: "batchOptions",
  status: "statusOptions",
};

const toLines = (a?: string[]) => (a ?? []).join("\n");
const fromLines = (t: string) => t.split("\n").map((s) => s.trim()).filter(Boolean);

const inputCls = "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm";

/** The choices editor shown directly under a dropdown, so its options are
 *  edited where the dropdown is — not in a separate list further down. */
function choicesBox(id: string, value: string, onChange: (v: string) => void) {
  const count = fromLines(value).length;
  return (
    <div className="mt-2 max-w-xl rounded-lg border border-blue-100 bg-blue-50/40 p-3">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
        Dropdown choices — one per line
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(Math.max(count + 1, 3), 12)}
        className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-blue-500"
      />
      <p className="mt-1 text-[11px] text-slate-500">
        {count} choice{count === 1 ? "" : "s"}. Press Enter for a new line; delete a line to remove a choice.
      </p>
    </div>
  );
}
const iconBtn =
  "rounded border border-slate-200 px-1.5 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30";

/** Editor for the contact page form AND the enquiry popup — both render the
 *  same document, so one save updates both. */
export default function ContactFormManager({ initial }: { initial: ContactFormDoc }) {
  const supabase = createClient();
  const [doc, setDoc] = useState<ContactFormDoc>(initial);
  // Choice lists are edited as raw text and parsed only on save. Parsing on
  // every keystroke threw away the blank line Enter makes, so a new choice
  // could never be typed on its own line.
  const [listText, setListText] = useState<Record<ListKey, string>>({
    entryOptions: toLines(initial.entryOptions),
    batchOptions: toLines(initial.batchOptions),
    statusOptions: toLines(initial.statusOptions),
  });
  const [optionText, setOptionText] = useState<Record<string, string>>(() =>
    Object.fromEntries(initial.fields.filter((f) => f.type === "select").map((f) => [f.key, toLines(f.options)])),
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const update = (key: string, patch: Partial<ContactField>) =>
    setDoc((d) => ({ ...d, fields: d.fields.map((f) => (f.key === key ? { ...f, ...patch } : f)) }));

  function move(index: number, dir: -1 | 1) {
    setDoc((d) => {
      const j = index + dir;
      if (j < 0 || j >= d.fields.length) return d;
      const fields = [...d.fields];
      [fields[index], fields[j]] = [fields[j], fields[index]];
      return { ...d, fields };
    });
  }

  function addField(type: CustomFieldType) {
    const f = newCustomField(type);
    setDoc((d) => {
      // Slot new questions in above the message box, so it stays last.
      const at = d.fields.findIndex((x) => x.key === "message");
      const fields = [...d.fields];
      fields.splice(at === -1 ? fields.length : at, 0, f);
      return { ...d, fields };
    });
    if (type === "select") setOptionText((o) => ({ ...o, [f.key]: toLines(f.options) }));
    setMsg({ ok: true, text: "Question added — rename it, then Save & publish." });
  }

  function removeField(f: ContactField) {
    if (isCore(f.key)) return;
    // Built-ins can be restored, so only a question the admin wrote needs a check.
    if (!isBuiltIn(f.key) && !window.confirm(`Delete "${f.label}"? Answers already received are kept.`)) return;
    setDoc((d) => ({
      ...d,
      fields: d.fields.filter((x) => x.key !== f.key),
      removed: isBuiltIn(f.key) ? Array.from(new Set([...d.removed, f.key])) : d.removed,
    }));
  }

  function restore(key: ContactFieldKey) {
    const def = CONTACT_FORM.fields.find((f) => f.key === key);
    if (!def) return;
    setDoc((d) => {
      const at = d.fields.findIndex((x) => x.key === "message");
      const fields = [...d.fields];
      // The message box goes back to the end; anything else goes above it.
      if (key === "message" || at === -1) fields.push(def);
      else fields.splice(at, 0, def);
      return { ...d, fields, removed: d.removed.filter((k) => k !== key) };
    });
  }

  function changeType(f: ContactField, type: CustomFieldType) {
    update(f.key, { type, options: type === "select" ? f.options ?? ["Option 1", "Option 2"] : undefined });
    if (type === "select" && optionText[f.key] === undefined) {
      setOptionText((o) => ({ ...o, [f.key]: toLines(f.options ?? ["Option 1", "Option 2"]) }));
    }
  }

  /** The document as it will be stored, with the text boxes parsed. */
  function finalDoc(): ContactFormDoc | string {
    const fields = doc.fields.map((f) =>
      f.type === "select" ? { ...f, options: fromLines(optionText[f.key] ?? toLines(f.options)) } : f,
    );
    const blank = fields.find((f) => !f.label.trim());
    if (blank) return "Every question needs a label.";
    const emptyDropdown = fields.find((f) => f.type === "select" && !f.options?.length);
    if (emptyDropdown) return `"${emptyDropdown.label}" is a dropdown with no choices — add at least one.`;
    // An emptied built-in list would quietly fall back to the defaults on the
    // next load, which looks like the edit was ignored. Say so instead.
    const emptyBuiltIn = fields.find((f) => {
      const list = LIST_FOR[f.key as ContactFieldKey];
      return list && !fromLines(listText[list]).length;
    });
    if (emptyBuiltIn) return `"${emptyBuiltIn.label}" has no choices — add at least one, or delete the field.`;
    return {
      ...doc,
      fields,
      entryOptions: fromLines(listText.entryOptions),
      batchOptions: fromLines(listText.batchOptions),
      statusOptions: fromLines(listText.statusOptions),
    };
  }

  async function save() {
    const next = finalDoc();
    if (typeof next === "string") return setMsg({ ok: false, text: next });
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.from("site_content").upsert(
      { key: "contact_form", label: "Contact & Enquiry Form", draft: next, published: next },
      { onConflict: "key" },
    );
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setDoc(next);
    setMsg({ ok: true, text: "Saved & published — live on the contact page and the enquiry popup." });
    void bustCmsCache();
  }

  function resetDefaults() {
    if (!window.confirm("Reset the form to its original fields? Any questions you added will be removed.")) return;
    setDoc(CONTACT_FORM);
    setListText({
      entryOptions: toLines(CONTACT_FORM.entryOptions),
      batchOptions: toLines(CONTACT_FORM.batchOptions),
      statusOptions: toLines(CONTACT_FORM.statusOptions),
    });
    setOptionText({});
    setMsg({ ok: true, text: "Reset to the original fields — press Save & publish to apply." });
  }

  const shownCount = doc.fields.filter((f) => f.enabled).length;
  const noContact = !doc.fields.some((f) => (f.key === "phone" || f.key === "email") && f.enabled);

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Fields</h2>
            <p className="mt-0.5 max-w-2xl text-xs text-slate-500">
              Add your own questions, delete ones you don&apos;t need, change the order with ↑ ↓, hide a field,
              or make it mandatory (a red <b className="text-red-600">*</b> appears and an empty answer is refused).
              Every dropdown has its choices box right underneath it.
              {" "}{shownCount} of {doc.fields.length} shown.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Add a question:</span>
            {CUSTOM_FIELD_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => addField(t.value)}
                className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
              >
                + {t.label}
              </button>
            ))}
          </div>
        </div>

        {noContact && (
          <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
            ⚠ Phone and Email are both hidden — you would have no way to reply to an enquiry.
          </p>
        )}

        <ol className="divide-y divide-slate-100">
          {doc.fields.map((f, i) => {
            const builtIn = isBuiltIn(f.key);
            const info = builtIn ? BUILT_IN_INFO[f.key as ContactFieldKey] : null;
            const choice = f.key === "entry" || f.key === "batch" || f.key === "status" || f.type === "select";
            return (
              <li key={f.key} className={`p-4 ${f.enabled ? "" : "bg-slate-50/70"}`}>
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex flex-col gap-1 pt-5">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={iconBtn} aria-label="Move up">↑</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === doc.fields.length - 1} className={iconBtn} aria-label="Move down">↓</button>
                  </div>

                  <div className="grid min-w-[240px] flex-1 gap-3 sm:grid-cols-[1fr_1.2fr_auto]">
                    <label className="text-xs text-slate-500">
                      Label
                      <input value={f.label} onChange={(e) => update(f.key, { label: e.target.value })} className={inputCls} />
                    </label>
                    <label className="text-xs text-slate-500">
                      {choice ? "Prompt shown before a choice is made" : "Placeholder (hint inside the box)"}
                      <input value={f.placeholder} onChange={(e) => update(f.key, { placeholder: e.target.value })} className={inputCls} />
                    </label>
                    <label className="text-xs text-slate-500">
                      Type
                      {builtIn ? (
                        <span className="mt-1 flex h-[34px] items-center rounded-lg bg-slate-100 px-3 text-sm text-slate-600">
                          {info?.kind}
                        </span>
                      ) : (
                        <select
                          value={f.type}
                          onChange={(e) => changeType(f, e.target.value as CustomFieldType)}
                          className={inputCls}
                        >
                          {CUSTOM_FIELD_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      )}
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-5">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={f.required} onChange={(e) => update(f.key, { required: e.target.checked })} className="h-4 w-4" />
                      Mandatory <span className="text-red-600">*</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={f.enabled} onChange={(e) => update(f.key, { enabled: e.target.checked })} className="h-4 w-4" />
                      Show
                    </label>
                    <button
                      type="button"
                      onClick={() => removeField(f)}
                      disabled={isCore(f.key)}
                      title={isCore(f.key) ? "Every enquiry needs a name and a way to reply — hide this field instead." : "Delete this field"}
                      className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="ml-9 mt-2">
                  {info && <p className="text-[11px] text-slate-400">{info.hint}{isCore(f.key) ? " Can be hidden, not deleted." : ""}</p>}
                  {builtIn && LIST_FOR[f.key as ContactFieldKey] &&
                    choicesBox(`choices-${f.key}`, listText[LIST_FOR[f.key as ContactFieldKey]!], (v) =>
                      setListText((t) => ({ ...t, [LIST_FOR[f.key as ContactFieldKey]!]: v })),
                    )}
                  {!builtIn && f.type === "select" &&
                    choicesBox(`choices-${f.key}`, optionText[f.key] ?? toLines(f.options), (v) =>
                      setOptionText((o) => ({ ...o, [f.key]: v })),
                    )}
                  {!f.enabled && <p className="mt-1 text-[11px] font-medium text-slate-500">Hidden — not on the form.</p>}
                </div>
              </li>
            );
          })}
        </ol>

        {doc.removed.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-xs font-medium text-slate-500">Deleted fields:</span>
            {doc.removed.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => restore(k)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                ↺ Restore {CONTACT_FORM.fields.find((f) => f.key === k)?.label ?? k}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <label className="text-xs text-slate-500">
          Submit button text
          <input value={doc.submitLabel} onChange={(e) => setDoc((d) => ({ ...d, submitLabel: e.target.value }))} className={inputCls} />
        </label>
        <label className="text-xs text-slate-500">
          Privacy note under the button
          <input value={doc.privacyNote} onChange={(e) => setDoc((d) => ({ ...d, privacyNote: e.target.value }))} className={inputCls} />
        </label>
        <label className="text-xs text-slate-500 sm:col-span-2">
          Thank-you message after a successful submit
          <input value={doc.successMessage} onChange={(e) => setDoc((d) => ({ ...d, successMessage: e.target.value }))} className={inputCls} />
        </label>
      </div>

      {msg && (
        <p className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={save} disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {busy ? "Saving…" : "Save & publish"}
        </button>
        <button onClick={resetDefaults} disabled={busy} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
          Reset to original fields
        </button>
      </div>
    </div>
  );
}
