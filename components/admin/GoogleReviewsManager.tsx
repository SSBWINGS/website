"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { bustCmsCache } from "@/lib/revalidate-client";
import { mediaUrl, MEDIA_CACHE_CONTROL } from "@/lib/supabase/media";
import { compressImage } from "@/lib/image-client";
import { asArray } from "@/lib/shape";
import type { GoogleReview } from "@/lib/homepage-defaults";

export default function GoogleReviewsManager({
  initial,
  placeUrl: initialPlaceUrl,
}: {
  initial: GoogleReview[];
  placeUrl: string;
}) {
  const supabase = createClient();
  const [items, setItems] = useState<GoogleReview[]>(asArray<GoogleReview>(initial));
  const [placeUrl, setPlaceUrl] = useState(initialPlaceUrl);
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = (i: number, patch: Partial<GoogleReview>) =>
    setItems((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const remove = (i: number) => setItems((s) => s.filter((_, j) => j !== i));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const c = [...items]; [c[i], c[j]] = [c[j], c[i]]; setItems(c);
  };

  async function addFromLink() {
    if (!link.trim()) return;
    setBusy(true); setMsg(null);
    try {
      const res = await fetch("/api/admin/google-review", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link.trim() }),
      });
      const meta = await res.json();
      if (!res.ok) throw new Error(meta.error || "Could not read that link.");
      setItems((s) => [...s, {
        url: meta.url, name: meta.name || "", rating: meta.rating || 5,
        text: meta.text || "", avatar: "", date: "",
      }]);
      setLink("");
      setMsg({ ok: true, text: meta.note || "Added — check the details below." });
    } catch (err) {
      // Still add a blank row so the admin can type it in manually.
      setItems((s) => [...s, { url: link.trim(), name: "", rating: 5, text: "", avatar: "", date: "" }]);
      setLink("");
      setMsg({ ok: false, text: (err instanceof Error ? err.message : "Failed.") + " A blank review was added — fill it in below." });
    } finally { setBusy(false); }
  }

  async function uploadAvatar(i: number, file: File) {
    setBusy(true);
    try {
      const f = await compressImage(file);
      const path = `reviews/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.webp`;
      const { error } = await supabase.storage.from("media").upload(path, f, {
        cacheControl: MEDIA_CACHE_CONTROL, upsert: true, contentType: f.type,
      });
      if (error) throw new Error(error.message);
      set(i, { avatar: path });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Upload failed." });
    } finally { setBusy(false); }
  }

  async function save() {
    setBusy(true); setMsg(null);
    const doc = { items: items.filter((r) => r.name || r.text), placeUrl };
    const { error } = await supabase.from("site_content").upsert(
      { key: "google_reviews", label: "Google Reviews", draft: doc, published: doc },
      { onConflict: "key" },
    );
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setMsg({ ok: true, text: "Saved & published — live on the homepage." });
    void bustCmsCache();
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <label className="mb-1 block text-sm font-medium text-slate-700">Paste a Google review link</label>
        <div className="flex flex-wrap gap-2">
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://maps.app.goo.gl/…"
            className="min-w-[240px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <button onClick={addFromLink} disabled={busy}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {busy ? "Reading…" : "+ Add review"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Google loads reviews with JavaScript, so we pull what we can from the link and you confirm the rest below.
        </p>
        <label className="mt-4 block text-sm font-medium text-slate-700">Google profile link (for the “See all reviews” button)</label>
        <input value={placeUrl} onChange={(e) => setPlaceUrl(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>

      {items.map((r, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-start gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-slate-100">
              {r.avatar && <Image src={mediaUrl(r.avatar)} alt="" fill sizes="56px" className="object-cover" />}
            </div>
            <div className="grid min-w-[260px] flex-1 gap-2 sm:grid-cols-3">
              <label className="text-xs text-slate-500">Reviewer
                <input value={r.name} onChange={(e) => set(i, { name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
              <label className="text-xs text-slate-500">Rating (1–5)
                <input type="number" min={1} max={5} value={r.rating}
                  onChange={(e) => set(i, { rating: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
              <label className="text-xs text-slate-500">Date shown
                <input value={r.date ?? ""} onChange={(e) => set(i, { date: e.target.value })} placeholder="e.g. 2 months ago"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </label>
            </div>
            <div className="flex shrink-0 gap-1">
              <button onClick={() => move(i, -1)} className="rounded border border-slate-200 px-1.5 text-slate-600 hover:bg-slate-50">↑</button>
              <button onClick={() => move(i, 1)} className="rounded border border-slate-200 px-1.5 text-slate-600 hover:bg-slate-50">↓</button>
              <button onClick={() => remove(i)} className="rounded border border-red-200 px-1.5 text-xs text-red-600 hover:bg-red-50">✕</button>
            </div>
          </div>
          <textarea value={r.text} onChange={(e) => set(i, { text: e.target.value })} rows={3} placeholder="Review text…"
            className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <input value={r.url} onChange={(e) => set(i, { url: e.target.value })} placeholder="Review link"
              className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs" />
            <label className="text-xs text-slate-500">
              Photo
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAvatar(i, f); }}
                className="ml-2 text-xs file:mr-2 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-slate-700" />
            </label>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          No reviews yet — paste a Google review link above. The section stays hidden until you add one.
        </p>
      )}

      {msg && <p className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-800"}`}>{msg.text}</p>}
      <button onClick={save} disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
        {busy ? "Saving…" : "Save & publish"}
      </button>
    </div>
  );
}
