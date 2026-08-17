import Link from "next/link";

export const dynamic = "force-dynamic";

type Item = { label: string; href: string; hint?: string };
type Page = { name: string; view?: string; items: Item[] };

// Every page, broken into its editable sections (each links to its own editor).
const PAGES: Page[] = [
  {
    name: "Home", view: "/",
    items: [
      { label: "Hero", href: "/admin/sections/hero", hint: "Headline, badge, intro, rating" },
      { label: "Hero Carousel", href: "/admin/hero-carousel", hint: "Rotating candidate photos" },
      { label: "AIR-1 Marquee", href: "/admin/sections/air1", hint: "Scrolling AIR-1 highlights" },
      { label: "Wall of Honour", href: "/admin/candidates", hint: "Recommended candidate tiles" },
      { label: "Four Forces", href: "/admin/four-forces", hint: "Army/Navy/AF/ICG cards" },
      { label: "The Hard Truth", href: "/admin/sections/story", hint: "Story block" },
      { label: "Why Aspirants Trust Us", href: "/admin/sections/whyus" },
      { label: "Mentors", href: "/admin/mentors" },
      { label: "Scoreboard Stats", href: "/admin/stats" },
      { label: "Selection Tracker", href: "/admin/selections" },
      { label: "Batch & Exam Countdown", href: "/admin/countdown" },
      { label: "Testimonials", href: "/admin/testimonials" },
      { label: "FAQs", href: "/admin/faqs" },
      { label: "CTA Banner", href: "/admin/sections/cta" },
    ],
  },
  { name: "About", view: "/about", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.about" }] },
  { name: "The 5-Day SSB", view: "/ssb-process", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.ssb-process" }] },
  { name: "Entries", view: "/entries", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.entries" }] },
  { name: "Eligibility Finder", view: "/eligibility", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.eligibility" }] },
  { name: "Courses", view: "/courses", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.courses" }] },
  { name: "Resources", view: "/resources", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.resources" }, { label: "Files & Videos", href: "/admin/resources" }] },
  { name: "Mock Tests", view: "/mock-tests", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.mock-tests" }, { label: "Questions", href: "/admin/mock-tests" }] },
  { name: "Gallery", view: "/gallery", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.gallery" }] },
  { name: "Recommended", view: "/recommended", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.recommended" }, { label: "Candidates", href: "/admin/candidates" }] },
  { name: "Blog", view: "/blog", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.blog" }, { label: "Articles", href: "/admin/blog" }] },
  { name: "Testimonials", view: "/testimonials", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.testimonials" }, { label: "Testimonials", href: "/admin/testimonials" }] },
  { name: "Contact", view: "/contact", items: [{ label: "Page Hero", href: "/admin/sections/pagehero.contact" }, { label: "Footer & Contact", href: "/admin/settings" }] },
  { name: "Site-wide", items: [
    { label: "Footer & Contact", href: "/admin/settings" },
    { label: "SEO (all pages)", href: "/admin/seo" },
    { label: "Media Library", href: "/admin/media" },
  ] },
];

export default function SectionsHub() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Pages &amp; Sections</h1>
      <p className="mt-1 text-sm text-slate-500">
        Every page and its editable sections. Pick a section to edit its text, images, tags and buttons — with a draft preview before you publish.
      </p>

      <div className="mt-6 space-y-6">
        {PAGES.map((p) => (
          <div key={p.name} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">{p.name}</h2>
              {p.view && <Link href={p.view} target="_blank" className="text-xs font-medium text-blue-600 hover:underline">View page ↗</Link>}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {p.items.map((it) => (
                <Link key={it.href + it.label} href={it.href}
                  className="group flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 transition hover:border-blue-300 hover:bg-blue-50">
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">{it.label}</span>
                    {it.hint && <span className="block text-xs text-slate-400">{it.hint}</span>}
                  </span>
                  <span className="text-slate-300 transition group-hover:text-blue-500">✎</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
