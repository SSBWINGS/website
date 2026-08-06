import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { sanitizeHtml } from "@/lib/sanitize";
import { mediaUrl } from "@/lib/supabase/media";

export const dynamic = "force-dynamic";

type Post = {
  id: string; slug: string; title: string; excerpt: string | null;
  cover_path: string | null; body: string; tag: string | null;
  author: string | null; published_at: string | null;
};

async function getPost(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("published_posts").select("*").eq("slug", slug).maybeSingle();
    return (data as Post) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found — SSBWINGS" };
  const description = post.excerpt || `${post.title} — SSBWINGS blog.`;
  return {
    title: `${post.title} — SSBWINGS`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      images: post.cover_path ? [mediaUrl(post.cover_path)] : undefined,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="bg-[#faf6ec]">
      <article className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
        <nav className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Link href="/blog" className="hover:text-[#b8860b]">← Back to blog</Link>
        </nav>
        {post.tag && <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#b8860b]">{post.tag}</span>}
        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#0a1524] sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-500">
          {post.author ? `${post.author} · ` : ""}{post.published_at ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
        </p>
        {post.cover_path && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
            <Image src={mediaUrl(post.cover_path)} alt="" fill sizes="768px" className="object-cover" priority />
          </div>
        )}
        <div className="prose prose-slate mt-8 max-w-none prose-headings:text-[#0a1524] prose-a:text-blue-700"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body) }} />

        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <p className="font-semibold text-[#0a1524]">Ready to crack the SSB?</p>
          <Link href="/contact" className="mt-3 inline-block rounded-lg bg-[#0a1524] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#13233b]">
            Book free counselling with SSBWINGS
          </Link>
        </div>
      </article>
    </main>
  );
}
