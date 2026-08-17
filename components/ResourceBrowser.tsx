"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { mediaUrl } from "@/lib/supabase/media";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Folder = { id: string; name: string; parent_id: string | null };
type Resource = { id: string; folder_id: string | null; kind: "file" | "youtube"; title: string; path: string | null; url: string | null; mime: string | null; thumbnail: string | null };

export default function ResourceBrowser() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [preview, setPreview] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    const supabase = createClient();
    Promise.all([
      supabase.from("resource_folders").select("id, name, parent_id").order("name"),
      supabase.from("resources").select("id, folder_id, kind, title, path, url, mime, thumbnail").order("created_at"),
    ]).then(([f, r]) => {
      setFolders((f.data as Folder[]) ?? []);
      setResources((r.data as Resource[]) ?? []);
      setLoading(false);
    });
  }, []);

  const subfolders = useMemo(() => folders.filter((f) => f.parent_id === current), [folders, current]);
  const items = useMemo(() => resources.filter((r) => r.folder_id === current), [resources, current]);
  const crumbs = useMemo(() => {
    const path: Folder[] = []; let id = current;
    while (id) { const f = folders.find((x) => x.id === id); if (!f) break; path.unshift(f); id = f.parent_id; }
    return path;
  }, [current, folders]);

  if (loading) return <p className="py-10 text-center text-ink-soft">Loading resources…</p>;
  if (folders.length === 0 && resources.length === 0)
    return <p className="rounded-2xl border border-[rgba(43,36,22,0.12)] bg-white p-10 text-center text-ink-soft">Resources are being added — check back soon.</p>;

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="mb-6 flex flex-wrap items-center gap-1 text-sm font-semibold">
        <button onClick={() => setCurrent(null)} className="rounded px-2 py-1 text-saffron-700 hover:bg-paper-2">🏠 Resources</button>
        {crumbs.map((f) => (
          <span key={f.id} className="flex items-center gap-1">
            <span className="text-ink-soft">/</span>
            <button onClick={() => setCurrent(f.id)} className="rounded px-2 py-1 text-saffron-700 hover:bg-paper-2">{f.name}</button>
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {subfolders.map((f) => (
          <button key={f.id} onClick={() => setCurrent(f.id)} className="card-lift skeu-panel flex flex-col items-center gap-2 p-6 text-center">
            <span className="text-5xl" aria-hidden>📁</span>
            <span className="font-display text-sm font-bold uppercase tracking-wide text-ink">{f.name}</span>
          </button>
        ))}

        {items.map((r) => {
          const isPdf = r.mime === "application/pdf";
          const isImg = r.mime?.startsWith("image/");
          return (
            <button key={r.id} onClick={() => setPreview(r)} className="card-lift skeu-panel overflow-hidden text-left">
              <div className="relative flex aspect-video items-center justify-center bg-navy-950/5">
                {r.kind === "youtube" && r.thumbnail ? (
                  <Image src={r.thumbnail} alt="" fill sizes="300px" className="object-cover" />
                ) : isImg && r.path ? (
                  <Image src={mediaUrl(r.path)} alt="" fill sizes="300px" className="object-cover" />
                ) : (
                  <span className="text-5xl" aria-hidden>{isPdf ? "📕" : "📄"}</span>
                )}
                {r.kind === "youtube" && <span className="absolute inset-0 flex items-center justify-center text-4xl">▶️</span>}
              </div>
              <p className="truncate px-3 py-2 text-sm font-semibold text-ink" title={r.title}>{r.title}</p>
            </button>
          );
        })}
      </div>

      {subfolders.length === 0 && items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[rgba(43,36,22,0.2)] bg-white p-10 text-center text-ink-soft">This folder is empty.</p>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4" onClick={() => setPreview(null)}>
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <p className="truncate font-semibold text-slate-900">{preview.title}</p>
              <div className="flex items-center gap-2">
                {preview.kind === "file" && preview.path && (
                  <a href={mediaUrl(preview.path)} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">Open / Download ↗</a>
                )}
                {preview.kind === "youtube" && preview.url && (
                  <a href={preview.url} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700">Watch on YouTube ↗</a>
                )}
                <button onClick={() => setPreview(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button>
              </div>
            </div>
            <div className="min-h-0 flex-1 bg-slate-100">
              {preview.kind === "youtube" && preview.url ? (
                <iframe title={preview.title} src={`https://www.youtube-nocookie.com/embed/${preview.url.split("v=")[1] ?? ""}`} className="h-[70vh] w-full" allowFullScreen />
              ) : preview.mime === "application/pdf" && preview.path ? (
                <iframe title={preview.title} src={mediaUrl(preview.path)} className="h-[75vh] w-full" />
              ) : preview.mime?.startsWith("image/") && preview.path ? (
                <div className="relative h-[75vh] w-full">
                  <Image src={mediaUrl(preview.path)} alt={preview.title} fill sizes="900px" className="object-contain" />
                </div>
              ) : (
                <p className="p-10 text-center text-slate-500">Use “Open / Download” to view this file.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
