# SSBWINGS Content Manager — Scope & Architecture

The custom CMS lets non-technical admins edit the live site. It is Supabase-backed
(Postgres + Auth + Storage) and fully serverless — deployable on Vercel free tier.

## How content flows

```
Admin edits (draft)  ──publish──▶  published (JSONB / row flag)  ──▶  public site
        │                                                              ▲
        └── preview cookie (ssbw-preview) lets admins see draft ───────┘
```

- `site_content` — singleton docs keyed by name, each holding `draft` + `published` JSONB.
- Collections (`recommended_candidates`, `testimonials`, `mentors`, `faqs`) — one row
  per item with a `published` boolean; anon reads go through `published_*` views.
- `content_versions` — snapshot-per-publish for **rollback**.
- `lib/content.ts` — `getPublished(key, fallback)` / `getCollection(view, fallback)`.
  In preview mode reads `draft`; always falls back to `lib/data.ts` defaults so the
  public site never breaks before the CMS is populated.

## Admin panels (`/admin`)

| Panel | Route | Edits |
|-------|-------|-------|
| Dashboard | `/admin` | Live counts, quick links |
| Recommended Candidates | `/admin/candidates` | Wall of Honour (photo + name + entry) |
| Testimonials | `/admin/testimonials` | Student testimonials |
| Mentors | `/admin/mentors` | Mentor cards |
| FAQs | `/admin/faqs` | Question/answer accordion (rich text) |
| Pages & Sections | `/admin/sections` | Hero, Story, Services, Why Us, CTA — split-view live preview |
| Scoreboard Stats | `/admin/stats` | The numeric stat plates |
| Footer & Contact | `/admin/settings` | Footer, phone, address, socials |
| SEO | `/admin/seo` | Per-page title/description + Google preview |
| Media Library | `/admin/media` | Upload/browse images |
| Activity Log | `/admin/activity` | Who changed what |
| Users | `/admin/users` | Super-admin only: add admins |
| My Account | `/admin/account` | Change password |

## Feature notes

- **Live preview** — Sections editor shows Mobile/Tablet/Desktop iframe of the draft.
- **Rich text + word-art** — font, colour, highlight, size, alignment, tricolour presets.
- **Rollback** — every publish snapshots to `content_versions`.
- **Autosave** — draft saved on a debounce while editing sections.
- **Smart images** — client-side downscale + WebP re-encode before upload (`lib/image-client.ts`).
- **SEO** — `generateMetadata` on every page reads `seo.<key>` from the CMS with defaults.
- **Auth** — email/password; first user becomes super_admin; RLS via `private.is_admin()`.

## Code-managed by design (not in CMS)

These are structural/layout content edited in code, not exposed as free-form CMS fields:

- 5-day SSB journey steps (`/ssb-process` timeline structure)
- Course card definitions & pricing (`lib/data.ts`)
- Entry-route detail pages structure
- Navigation menu structure

Their **copy** can be surfaced to the CMS later by adding a `site_content` key and a
matching section in `lib/sections.ts` — the plumbing (`getPublished` + fallback) is
already in place.
