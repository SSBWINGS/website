"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { bustCmsCache } from "@/lib/revalidate-client";
import { mediaUrl, MEDIA_CACHE_CONTROL } from "@/lib/supabase/media";
import { compressImage } from "@/lib/image-client";
import { asArray } from "@/lib/shape";
import type { HeroSlide } from "@/lib/hero-slides";

export default function HeroSlidesManager({ initial }: { initial: HeroSlide[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<HeroSlide[]>(asArray<HeroSlide>(initial));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = (i: number, patch: Partial<HeroSlide>) =>
    setItems((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const remove = (i: number) => setItems((s) => s.filter((_, j) => j !== i));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const c = [...items]; [c[i], c[j]] = [c[j], c[i]]; setItems(c);
  };

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true); setMsg(null);
    try {
      const added: HeroSlide[] = [];
      for (const raw of files) {
        const f = await compressImage(raw);
        const path = `hero/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
        const { error } = await supabase.storage.from("media").upload(path, f, {
          cacheControl: MEDIA_CACHE_CONTROL, upsert: true, contentType: f.type,
        });
        if (error) throw new Error(error.message);
        added.push({ image: path, name: "", academy: "", term: "" });
      }
      setItems((s) => [...s, ...added]);
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Upload failed." });
    } finally { setBusy(false); e.target.value = ""; }
  }

  async function save() {
    setBusy(true); setMsg(null);
    const doc = { items: items.filter((s) => s.image) };
    const { error } = await supabase.from("site_content").upsert(
      { key: "hero_slides", label: "Hero Showcase", draft: doc, published: doc },
      { onConflict: "key" },
    );
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message });
    setMsg({ ok: true, text: "Saved & published — live on the homepage hero." });
    void bustCmsCache();
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          {busy ? "Working…" : "⬆ Upload officer photos"}
          <input type="file" accept="image/*" multiple onChange={onUpload} className="hidden" disabled={busy} />
        </label>
        <p className="mt-2 text-xs text-slate-400">
          These rotate in the big frame at the top of the homepage. For each photo, add the officer&apos;s name,
          the academy they passed out from (shown on the right) and the term (shown on the left).
        </p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          No photos yet — upload some above. Until then the homepage shows the built-in defaults.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((s, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-slate-100">
                {s.image && <Image src={mediaUrl(s.image)} alt="" fill sizes="112px" className="object-cover" />}
              </div>
              <div className="grid min-w-[260px] flex-1 gap-2 sm:grid-cols-3">
                <label className="text-xs text-slate-500">Officer name
                  <input value={s.name ?? ""} onChange={(e) => set(i, { name: e.target.value })} placeholder="e.g. Lt. Arjun Singh"
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
                </label>
                <label className="text-xs text-slate-500">Term (left)
                  <input value={s.term ?? ""} onChange={(e) => set(i, { term: e.target.value })} placeholder="e.g. Spring Term 2025"
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
                </label>
                <label className="text-xs text-slate-500">Academy (right)
                  <input value={s.academy ?? ""} onChange={(e) => set(i, { academy: e.target.value })} placeholder="e.g. IMA Dehradun"
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
                </label>
              </div>
              <div className="flex gap-1">
                <button onClick={() => move(i, -1)} className="rounded border border-slate-200 px-1.5 text-slate-600 hover:bg-slate-50">↑</button>
                <button onClick={() => move(i, 1)} className="rounded border border-slate-200 px-1.5 text-slate-600 hover:bg-slate-50">↓</button>
                <button onClick={() => remove(i)} className="rounded border border-red-200 px-1.5 text-xs text-red-600 hover:bg-red-50">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {msg && <p className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
      <button onClick={save} disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
        {busy ? "Saving…" : "Save & publish"}
      </button>
    </div>
  );
}
