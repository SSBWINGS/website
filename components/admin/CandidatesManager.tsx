"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { bustCmsCache } from "@/lib/revalidate-client";
import { mediaUrl, MEDIA_CACHE_CONTROL } from "@/lib/supabase/media";

export type Candidate = {
  id: string;
  name: string;
  exam: string;
  image_path: string | null;
  sort_order: number;
  published: boolean;
  recommended_on?: string | null;
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const today = () => new Date().toISOString().slice(0, 10);

// Latest recommendation first; undated rows fall back to sort_order.
const sortCands = (arr: Candidate[]) =>
  [...arr].sort((a, b) => {
    if (a.recommended_on && b.recommended_on) return b.recommended_on.localeCompare(a.recommended_on);
    if (a.recommended_on) return -1;
    if (b.recommended_on) return 1;
    return a.sort_order - b.sort_order;
  });

export default function CandidatesManager({ initial }: { initial: Candidate[] }) {
  const supabase = createClient();
  const [rows, setRows] = useState<Candidate[]>(() => sortCands(initial));
  const [name, setName] = useState("");
  const [exam, setExam] = useState("");
  const [date, setDate] = useState(today);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function uploadImage(f: File): Promise<string> {
    const ext = f.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `candidates/${Date.now()}-${slug(name) || "candidate"}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, f, { cacheControl: MEDIA_CACHE_CONTROL, upsert: true, contentType: f.type });
    if (error) throw new Error(error.message);
    return path;
  }

  async function addCandidate(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!file) return setMsg({ ok: false, text: "Please choose a photo." });
    setBusy(true);
    try {
      const image_path = await uploadImage(file);
      const sort_order = rows.length ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
      const { data, error } = await supabase
        .from("recommended_candidates")
        .insert({ name, exam, image_path, sort_order, published: true, recommended_on: date || null })
        .select("id, name, exam, image_path, sort_order, published, recommended_on")
        .single();
      if (error) throw new Error(error.message);
      setRows((r) => sortCands([...r, data as Candidate]));
      setName(""); setExam(""); setFile(null); setDate(today());
      (document.getElementById("cand-file") as HTMLInputElement | null)?.value && ((document.getElementById("cand-file") as HTMLInputElement).value = "");
      setMsg({ ok: true, text: "Candidate added." }); void bustCmsCache();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Failed to add." });
    } finally {
      setBusy(false);
    }
  }

  async function removeCandidate(id: string) {
    if (!confirm("Remove this candidate from the Wall of Honour?")) return;
    const prev = rows;
    setRows((r) => r.filter((x) => x.id !== id));
    const { error } = await supabase.from("recommended_candidates").delete().eq("id", id);
    if (error) { setRows(prev); alert(error.message); }
  }

  async function togglePublished(c: Candidate) {
    const next = !c.published;
    setRows((r) => r.map((x) => (x.id === c.id ? { ...x, published: next } : x)));
    await supabase.from("recommended_candidates").update({ published: next }).eq("id", c.id); void bustCmsCache();
  }

  async function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= rows.length) return;
    const a = rows[index], b = rows[j];
    const newRows = [...rows];
    newRows[index] = { ...b, sort_order: a.sort_order };
    newRows[j] = { ...a, sort_order: b.sort_order };
    setRows(newRows);
    await Promise.all([
      supabase.from("recommended_candidates").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("recommended_candidates").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    // re-sort locally
    setRows((r) => [...r].sort((x, y) => x.sort_order - y.sort_order));
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Add form */}
      <form onSubmit={addCandidate} className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Add a candidate</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="e.g. Arjun Singh" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Entry</label>
            <input value={exam} onChange={(e) => setExam(e.target.value)} required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="e.g. CDS OTA" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date of recommendation</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Photo</label>
            <input id="cand-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-slate-700" />
          </div>
        </div>
        {msg && <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
        <button type="submit" disabled={busy} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
          {busy ? "Adding…" : "Add candidate"}
        </button>
      </form>

      {/* List */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">On the Wall ({rows.length})</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((c, i) => (
            <div key={c.id} className={`rounded-lg border p-2 ${c.published ? "border-slate-200" : "border-dashed border-slate-300 opacity-60"}`}>
              <div className="relative aspect-square overflow-hidden rounded-md bg-slate-100">
                {c.image_path && (
                  <Image src={mediaUrl(c.image_path)} alt={c.name} fill sizes="200px" className="object-cover" />
                )}
              </div>
              <p className="mt-2 truncate text-sm font-semibold text-slate-900">{c.name}</p>
              <p className="truncate text-xs text-slate-500">{c.exam}</p>
              <div className="mt-2 flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <button onClick={() => move(i, -1)} title="Move up" className="rounded border border-slate-200 px-1.5 text-slate-600 hover:bg-slate-50">↑</button>
                  <button onClick={() => move(i, 1)} title="Move down" className="rounded border border-slate-200 px-1.5 text-slate-600 hover:bg-slate-50">↓</button>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => togglePublished(c)} title={c.published ? "Hide" : "Show"} className="rounded border border-slate-200 px-1.5 text-xs text-slate-600 hover:bg-slate-50">
                    {c.published ? "👁" : "🚫"}
                  </button>
                  <button onClick={() => removeCandidate(c.id)} title="Delete" className="rounded border border-red-200 px-1.5 text-xs text-red-600 hover:bg-red-50">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {rows.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No candidates yet — add the first one above.</p>}
      </div>
    </div>
  );
}
