# SSB WINGS — Website

Modern, animated, SEO-friendly **multi-page** website for **SSB WINGS**, an SSB (Services Selection Board) coaching academy in Noida.

Built with **Next.js 16 (App Router) · Tailwind CSS v4 · TypeScript · Resend**.

## Design language

- **Light tricolour + skeuomorphic** theme — warm paper canvas, brass/gold plates, tactile pressable buttons, inset form fields, medal-ringed avatars. No dark overlays, no flat grid patterns.
- **Tri-service inspiration** — Army (olive), Navy (deep blue), Air Force (sky blue) colour-coded throughout.
- **Custom cursor** (dot + easing ring), auto-popup contact modal (once/session), hovering WhatsApp button, sticky tricolour-progress navbar, enlarged Lottie preloader with a large tricolour "SSB WINGS" wordmark.

## Pages

`/` Home · `/about` · `/ssb-process` (5-day SSB) · `/courses` · `/gallery` (Wall of Honour + AIR-1 cards + officer banners) · `/testimonials` (written + YouTube + Instagram) · `/contact` (form + map).

## Content & images

Real content, student photos, mentor photos, testimonials and achievement cards live in `public/images/` + `lib/data.ts` (the built-in defaults). Parade/ceremonial imagery is Government of India (GODL-India) / Wikimedia (CC BY-SA). Once the CMS below is connected, published content overrides these defaults; until then the site uses `lib/data.ts`.

## Admin CMS (Supabase)

A custom admin panel at **`/admin`** lets non-technical admins edit the site — powered by **Supabase** (Postgres + Auth + Storage). The public site always falls back to `lib/data.ts`, so it never breaks before the CMS is populated.

### One-time setup

1. **Create a project** at [supabase.com](https://supabase.com) (free tier).
2. **Run the schema** — open *SQL Editor*, paste `supabase/migrations/0001_cms_init.sql`, and run it. This creates the content tables, roles, RLS policies and the `media` storage bucket.
3. **Add env vars** — copy `.env.example` → `.env.local` and fill the Supabase block from *Settings → API*:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (safe for the browser)
   - `SUPABASE_SERVICE_ROLE_KEY` (**server only** — used to create admins)
4. **Create the first admin** — *Authentication → Add user* (email + password). The **first** user automatically becomes **super-admin**.
5. Restart, then sign in at **`/admin/login`**.

### Roles & accounts

- **Super Admin** — can add new admins (*Users* tab) and manage everything.
- **Admin** — full content editing.
- Everyone can change their own password under *My Account*.

### How content works

- Each editable section is a document with a **draft** and a **published** copy. The public site reads *published*; the live preview shows *draft*. `lib/content.ts` (`getPublished` / `getCollection`) fetches published content with automatic fallback to the code defaults.
- **Security**: RLS is enabled on every table; only authenticated admins can write; the public reads *published-only* views. Roles are checked via a `private.is_admin()` function (never via user-editable metadata).

### Build status of the CMS (phased)

- ✅ Auth, roles, route-protection, add-admin, change-password, admin shell
- ⏳ Next: Recommended-Candidates manager · page/section & footer editors with fonts/colours/word-art · live video-editor-style preview & publish · media library.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Contact form (Resend)

Form submissions on `#contact` POST to `app/api/contact/route.ts`, which emails the admin via [Resend](https://resend.com).

1. Create an API key at https://resend.com/api-keys
2. Copy `.env.example` → `.env.local` and fill in:

```env
RESEND_API_KEY=re_xxxxxxxx
CONTACT_ADMIN_EMAIL=marketing@ssbwings.com
CONTACT_FROM_EMAIL=SSB Wings <noreply@ssbwings.com>
```

- Until you verify a domain in Resend, use `onboarding@resend.dev` as the from address (already the fallback) — with it, Resend only delivers to the email address that owns the API key.
- The route validates input, escapes HTML, and includes a honeypot field for bots.

## Project map

| Path | Purpose |
| --- | --- |
| `app/layout.tsx` | Fonts, SEO metadata, Open Graph, JSON-LD (Organization + Courses) |
| `app/page.tsx` | Section composition |
| `app/globals.css` | Tailwind v4 theme (logo-derived gold + service navy), animations, micro-interactions |
| `app/api/contact/route.ts` | Resend-powered contact endpoint |
| `components/` | Preloader (Lottie + SSB WINGS wordmark), Navbar, Hero, 5-Day Journey, Courses, Mentors, Results, Testimonials, FAQ, Contact, Footer |
| `public/preloader.lottie` | Loading animation (TFU Republic.lottie) |
| `public/logo.webp` | Brand logo |

## Production

```bash
npm run build
npm start
```

Deploys cleanly to Vercel — remember to set the three env vars in the dashboard.
