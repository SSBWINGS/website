"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { mediaUrl } from "@/lib/supabase/media";
import { compressImage } from "@/lib/image-client";

export default function HeroCarouselManager({ initial }: { initial: string[] }) {
  const supabase = createClient();
  const [images, setImages] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true); setMsg(null);
    try {
      const added: string[] = [];
      for (const raw of files) {
        const f = await compressImage(raw);
        const path = `carousel/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
        const { error } = await supabase.storage.from("media").upload(path, f, { upsert: true, contentType: f.type });
        if (error) throw new Error(error.message);
        added.push(path);
      }
      setImages((im) => [...im, ...added]);
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  const move = (i: number, d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= images.length) return;
    const copy = [...images]; [copy[i], copy[j]] = [copy[j], copy[i]]; setImages(copy);
  };
  const remove = (i: number) => setImages((im) => im.filter((_, j) => j !== i));

  async function saveDoc(imgs: string[], text: string) {
    setBusy(true); setMsg(null);
    const doc = { images: imgs };
    const { error } = await supabase.from("site_content").upsert(
      { key: "hero_carousel", label: "Hero Carousel", draft: doc, published: doc },
      { onConflict: "key" },
    );
    setBusy(false);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text });
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          {busy ? "Working…" : "⬆ Upload photos"}
          <input type="file" accept="image/*" multiple onChange={onUpload} className="hidden" disabled={busy} />
        </label>
        <p className="mt-2 text-xs text-slate-400">
          These photos auto-rotate in the homepage hero. Leave the list empty to automatically show your latest recommended candidates.
        </p>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          {images.map((p, i) => (
            <figure key={p + i} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="relative aspect-square bg-slate-100">
                <Image src={mediaUrl(p)} alt="" fill sizes="200px" className="object-cover" />
              </div>
              <figcaption className="flex items-center justify-between gap-1 p-1.5">
                <div className="flex gap-1">
                  <button onClick={() => move(i, -1)} className="rounded border border-slate-200 px-1.5 text-slate-600 hover:bg-slate-50">←</button>
                  <button onClick={() => move(i, 1)} className="rounded border border-slate-200 px-1.5 text-slate-600 hover:bg-slate-50">→</button>
                </div>
                <button onClick={() => remove(i)} className="rounded border border-red-200 px-1.5 text-xs text-red-600 hover:bg-red-50">✕</button>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          No custom photos — the hero is automatically showing your latest recommended candidates.
        </p>
      )}

      {msg && <p className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}

      <div className="flex gap-2">
        <button onClick={() => saveDoc(images, "Saved & published — live on the homepage hero.")} disabled={busy}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {busy ? "Saving…" : "Save & publish"}
        </button>
        <button onClick={() => { setImages([]); saveDoc([], "Reset — hero now shows your latest recommended candidates."); }} disabled={busy}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
          Reset to automatic
        </button>
      </div>
    </div>
  );
}
