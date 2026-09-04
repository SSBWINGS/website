import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import { getCollection } from "@/lib/content";
import { mediaUrl } from "@/lib/supabase/media";
import CmsHero from "@/components/CmsHero";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("blog");
}

type Post = { id: string; slug: string; title: string; excerpt: string | null; cover_path: string | null; tag: string | null; author: string | null; published_at: string | null };

export default async function BlogList() {
  const posts = await getCollection<Post>("published_posts", [], {
    columns: "id, slug, title, excerpt, cover_path, tag, author, published_at",
    order: [{ column: "published_at", ascending: false, nullsFirst: false }],
  });

  return (
    <main>
      <CmsHero pageKey="blog" />
      <section className="bg-[#faf6ec] px-4 pb-8 pt-6 sm:pb-12 sm:pt-8">
        <div className="mx-auto max-w-6xl">
          {posts.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              Fresh articles are on the way — check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md">
                  <div className="relative aspect-[16/9] bg-slate-100">
                    {p.cover_path && <Image src={mediaUrl(p.cover_path)} alt="" fill sizes="400px" className="object-cover transition group-hover:scale-105" />}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {p.tag && <span className="mb-2 w-fit rounded-full bg-[#faf8f1] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#b8860b]">{p.tag}</span>}
                    <h2 className="text-lg font-bold leading-snug text-[#0a1524] group-hover:text-blue-700">{p.title}</h2>
                    {p.excerpt && <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">{p.excerpt}</p>}
                    <p className="mt-3 text-xs text-slate-400">
                      {p.author ? `${p.author} · ` : ""}{p.published_at ? new Date(p.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
