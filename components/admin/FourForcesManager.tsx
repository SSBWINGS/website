"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { mediaUrl } from "@/lib/supabase/media";
import { compressImage } from "@/lib/image-client";
import type { FourForcesDoc, ForceCard } from "@/lib/four-forces";

export default function FourForcesManager({ initial }: { initial: FourForcesDoc }) {
  const supabase = createClient();
  const [doc, setDoc] = useState<FourForcesDoc>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const setHead = (patch: Partial<FourForcesDoc>) => setDoc((d) => ({ ...d, ...patch }));
  const setCard = (i: number, patch: Partial<ForceCard>) =>
    setDoc((d) => ({ ...d, cards: d.cards.map((c, j) => (j === i ? { ...c, ...patch } : c)) }));

  async function uploadImage(i: number, file: File) {
    setBusy(true); setMsg(null);
    try {
      const f = await compressImage(file);
      const path = `four-forces/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.webp`;
      const { error } = await supabase.storage.from("media").upload(path, f, { upsert: true, contentType: f.type });
      if (error) throw new Error(error.message);
      setCard(i, { image: path });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true); setMsg(null);
    const { error } = await supabase.from("site_content").upsert(
      { key: "four_forces", label: "Four Forces · One Dream", draft: doc, published: doc },
      { onConflict: "key" },
    );
    setBusy(false);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Saved & published — live on the homepage." });
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-base font-semibold text-slate-900">Section heading</h2>
        <div className="grid gap-3">
          <label className="text-xs font-medium text-slate-500">Kicker
            <input value={doc.kicker} onChange={(e) => setHead({ kicker: e.target.value })} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-medium text-slate-500">Title (HTML allowed, e.g. &lt;span class=&quot;tricolour-text&quot;&gt;…&lt;/span&gt;)
            <input value={doc.title} onChange={(e) => setHead({ title: e.target.value })} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-medium text-slate-500">Subtitle
            <textarea value={doc.subtitle} onChange={(e) => setHead({ subtitle: e.target.value })} rows={2} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {doc.cards.map((c, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                {c.image && <Image src={mediaUrl(c.image)} alt="" fill sizes="80px" className="object-cover" />}
              </div>
              <div className="flex-1">
                <input value={c.name} onChange={(e) => setCard(i, { name: e.target.value })} placeholder="Force name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold" />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex gap-2">
                <input value={c.icon} onChange={(e) => setCard(i, { icon: e.target.value })} placeholder="Icon"
                  className="w-16 rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
                <input value={c.motto} onChange={(e) => setCard(i, { motto: e.target.value })} placeholder="Motto"
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              </div>
              <textarea value={c.desc} onChange={(e) => setCard(i, { desc: e.target.value })} rows={2} placeholder="Description"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              <input value={c.entries.join(", ")} onChange={(e) => setCard(i, { entries: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                placeholder="Tags (comma-separated)" className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              <input value={c.blog} onChange={(e) => setCard(i, { blog: e.target.value })} placeholder="CTA link (e.g. /blog/join-indian-army)"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
              <label className="text-xs text-slate-500">Background image
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(i, f); }}
                  className="mt-1 block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-slate-700" />
              </label>
            </div>
          </div>
        ))}
      </div>

      {msg && <p className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
      <button onClick={save} disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
        {busy ? "Saving…" : "Save & publish"}
      </button>
    </div>
  );
}
