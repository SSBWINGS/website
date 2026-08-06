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

## Security model

Defense-in-depth across four layers:

1. **Auth gate** — `proxy.ts` refreshes the session and redirects unauthenticated
   users away from `/admin` and `/api/admin`.
2. **Role gate** — the dashboard layout calls `getCurrentAdmin()`, which is
   **fail-closed**: a signed-in user with no profile row, or a `pending` role, is
   NOT treated as admin. Privileged API routes independently re-check
   `super_admin`.
3. **Row-Level Security** — every table is `TO authenticated` + `private.is_admin()`
   (SECURITY DEFINER, `search_path=''`). Anon users only read `published_*` views.
4. **Least-privilege signup** — new auth users default to `pending` (no access).
   Only the super-admin, via the service-role API route, promotes them to `admin`.
   The **first** user bootstraps as `super_admin`. A DB trigger blocks demoting or
   deleting the **last** super-admin (no lockout).

Additional hardening:

- **User management** — super-admin can promote/demote/approve/remove admins
  (`/api/admin/manage-user`, service-role, revokes login). Can't act on self.
- **HTML sanitization** — all CMS strings pass through `lib/sanitize.ts` in the
  content layer before being rendered with `dangerouslySetInnerHTML`, stripping
  `<script>`, inline `on*` handlers, `javascript:`/`data:` URLs, `<iframe>` etc.
- **Security headers** (`next.config.ts`) — CSP (`frame-ancestors 'none'`,
  `object-src 'none'`, `base-uri 'self'`), HSTS, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.
  `X-Powered-By` is disabled.
- **Rate limiting** — `lib/rate-limit.ts` throttles `/api/contact` and the admin
  API routes (best-effort per instance); the contact form also has a honeypot.
- **No SQL injection surface** — all DB access goes through the parameterized
  supabase-js query builder; the only raw SQL is static migration files.
- **Secrets** — the service-role key is `server-only` and never shipped to the
  client; `.env.local` is gitignored.

> One project-side setting to confirm in the Supabase dashboard:
> **Authentication → Providers → Email → disable "Allow new users to sign up"**.
> Even if it's left on, the `pending`-by-default trigger keeps self-registered
> users powerless — but disabling it is belt-and-braces.

## Code-managed by design (not in CMS)

These are structural/layout content edited in code, not exposed as free-form CMS fields:

- 5-day SSB journey steps (`/ssb-process` timeline structure)
- Course card definitions & pricing (`lib/data.ts`)
- Entry-route detail pages structure
- Navigation menu structure

Their **copy** can be surfaced to the CMS later by adding a `site_content` key and a
matching section in `lib/sections.ts` — the plumbing (`getPublished` + fallback) is
already in place.
