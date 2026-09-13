"use client";

import { Fragment, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { enquiryDetails, searchText } from "@/lib/enquiry-details";

type Status = "new" | "contacted" | "enrolled" | "dropped";
export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  entry: string | null;
  message: string | null;
  source: string;
  status: Status;
  notes: string | null;
  /** Extra answers the form collected — batch, status, the admin's own
   *  questions, Eligibility Finder answers and so on. */
  meta: Record<string, unknown> | null;
  created_at: string;
};

const STATUSES: Status[] = ["new", "contacted", "enrolled", "dropped"];
const STATUS_STYLE: Record<Status, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  enrolled: "bg-green-100 text-green-700",
  dropped: "bg-slate-200 text-slate-600",
};

const SOURCE_LABEL: Record<string, string> = {
  contact_form: "Contact form",
  eligibility: "Eligibility Finder",
  mock_test: "Mock test",
};

const csvCell = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

const waLink = (phone: string) =>
  `https://wa.me/${phone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(?!91)/, "91")}`;

export default function EnquiryInbox({
  initial,
  labels = {},
}: {
  initial: Enquiry[];
  /** The field names the admin gave the form, so the inbox uses the same words. */
  labels?: Record<string, string>;
}) {
  const supabase = createClient();
  const [rows, setRows] = useState<Enquiry[]>(initial);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const s of STATUSES) c[s] = rows.filter((r) => r.status === s).length;
    return c;
  }, [rows]);

  // Search every detail — batch, status, answers to added questions, message —
  // not only the name and contact details.
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(
      (r) => (filter === "all" || r.status === filter) && (!needle || searchText(r).includes(needle)),
    );
  }, [rows, filter, q]);

  async function setStatus(id: string, status: Status) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    await supabase.from("enquiries").update({ status }).eq("id", id);
  }

  async function saveNotes(id: string, notes: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, notes } : r)));
    await supabase.from("enquiries").update({ notes }).eq("id", id);
  }

  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    const prev = rows;
    setRows((rs) => rs.filter((r) => r.id !== id));
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) { setRows(prev); alert(error.message); }
  }

  /** One column per detail, in the order they first appear — so every answer
   *  gets its own spreadsheet column, including questions added later. */
  function exportCsv() {
    const detailed = visible.map((r) => ({ r, d: enquiryDetails(r, labels) }));
    const columns: string[] = [];
    for (const { d } of detailed) for (const x of d) if (!columns.includes(x.label)) columns.push(x.label);

    const header = ["Received", "Name", "Phone", "Email", ...columns, "Source", "Status", "Notes"];
    const lines = [header.map(csvCell).join(",")].concat(
      detailed.map(({ r, d }) => {
        const byLabel = new Map(d.map((x) => [x.label, x.value]));
        return [
          when(r.created_at), r.name, r.phone ?? "", r.email,
          ...columns.map((c) => byLabel.get(c) ?? ""),
          SOURCE_LABEL[r.source] ?? r.source, r.status, r.notes ?? "",
        ].map((v) => csvCell(String(v))).join(",");
      }),
    );
    // Byte-order mark so Excel reads the ₹, – and Hindi characters correctly.
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ssbwings-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setFilter("all")} className={`rounded-full px-3 py-1 text-xs font-semibold ${filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
          All {counts.all}
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${filter === s ? "bg-slate-900 text-white" : STATUS_STYLE[s]}`}>
            {s} {counts[s]}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search any detail…"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500" />
          <button onClick={exportCsv} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">⬇ CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Aspirant</th>
              <th className="px-4 py-3 font-semibold">Everything they filled in</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Received</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((r) => {
              const details = enquiryDetails(r, labels);
              const message = details.find((d) => d.label === (labels.message || "Message"));
              const rest = details.filter((d) => d !== message);
              const open = openId === r.id;
              return (
                <Fragment key={r.id}>
                  <tr className="align-top">
                    <td className="w-56 px-4 py-3">
                      <p className="font-semibold text-slate-900">{r.name || "—"}</p>
                      {r.phone && (
                        <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="mt-0.5 block text-xs text-slate-600 hover:text-blue-700">
                          📞 {r.phone}
                        </a>
                      )}
                      {r.email && (
                        <a href={`mailto:${r.email}`} className="block break-all text-xs text-slate-600 hover:text-blue-700">
                          ✉ {r.email}
                        </a>
                      )}
                      <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                        {SOURCE_LABEL[r.source] ?? r.source}
                      </span>
                    </td>

                    {/* Every answer, right in the row — nothing to discover. */}
                    <td className="px-4 py-3">
                      {rest.length ? (
                        <dl className="grid gap-x-4 gap-y-1 text-xs sm:grid-cols-[auto_1fr]">
                          {rest.map((d, i) => (
                            <Fragment key={i}>
                              <dt className="font-semibold text-slate-500">{d.label}</dt>
                              <dd className="text-slate-800">{d.value}</dd>
                            </Fragment>
                          ))}
                        </dl>
                      ) : (
                        !message && <span className="text-xs text-slate-400">No other details</span>
                      )}
                      {message && (
                        <p className={`mt-2 whitespace-pre-line rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 ${open ? "" : "line-clamp-3"}`}>
                          <span className="font-semibold text-slate-500">{message.label}: </span>
                          {message.value}
                        </p>
                      )}
                      {r.notes && !open && (
                        <p className="mt-2 text-xs text-amber-800">
                          <span className="font-semibold">Note: </span>{r.notes}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value as Status)}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[r.status]}`}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{when(r.created_at)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        onClick={() => setOpenId(open ? null : r.id)}
                        className="mr-1 rounded border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {open ? "Close" : "Notes & reply"}
                      </button>
                      <button onClick={() => remove(r.id)} className="rounded border border-red-200 px-1.5 text-xs text-red-600 hover:bg-red-50" aria-label="Delete enquiry">✕</button>
                    </td>
                  </tr>
                  {open && (
                    <tr>
                      <td colSpan={5} className="bg-slate-50 px-4 py-4">
                        <label className="mb-1 block text-xs font-medium text-slate-500">Internal notes</label>
                        <textarea defaultValue={r.notes ?? ""} onBlur={(e) => saveNotes(r.id, e.target.value)} rows={2}
                          placeholder="Add a note (saved when you click away)…"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                        <div className="mt-2 flex flex-wrap gap-4">
                          {r.email && (
                            <a href={`mailto:${r.email}`} className="text-xs font-medium text-blue-600 hover:underline">Reply by email →</a>
                          )}
                          {r.phone && (
                            <>
                              <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="text-xs font-medium text-blue-600 hover:underline">Call →</a>
                              <a href={waLink(r.phone)} target="_blank" rel="noopener noreferrer"
                                className="text-xs font-medium text-green-700 hover:underline">WhatsApp →</a>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {visible.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">No enquiries{filter !== "all" ? ` with status "${filter}"` : q ? " match that search" : " yet"}.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
