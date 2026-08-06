-- ============================================================================
-- SSBWINGS CMS — feature expansion
--   Enquiry CRM · Blog · Selection tracker · Mock tests · Analytics ·
--   Scheduled publishing
-- Depends on 0001 (private.is_admin / is_super_admin, media bucket).
-- ============================================================================

-- ─────────────────────────────────────────────────────────────
-- 1. ENQUIRIES  (lead CRM — inserted by trusted server code only)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  entry       text,
  message     text,
  source      text not null default 'contact_form',   -- contact_form | eligibility | mock_test
  status      text not null default 'new' check (status in ('new','contacted','enrolled','dropped')),
  notes       text,
  meta        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
alter table public.enquiries enable row level security;

-- Admins read/update/delete. Inserts come from the server via the service role
-- (RLS is bypassed there), so no anon insert policy is exposed.
drop policy if exists "enquiries_admin_all" on public.enquiries;
create policy "enquiries_admin_all" on public.enquiries
  for all to authenticated
  using ( private.is_admin() ) with check ( private.is_admin() );

grant select, insert, update, delete on public.enquiries to authenticated;

-- ─────────────────────────────────────────────────────────────
-- 2. BLOG POSTS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text,
  cover_path   text,
  body         text not null default '',   -- rich HTML
  tag          text,
  author       text,
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.posts enable row level security;

drop policy if exists "posts_admin_all" on public.posts;
create policy "posts_admin_all" on public.posts
  for all to authenticated
  using ( private.is_admin() ) with check ( private.is_admin() );

create or replace view public.published_posts as
  select id, slug, title, excerpt, cover_path, body, tag, author, published_at
  from public.posts
  where published = true and (published_at is null or published_at <= now());

grant select, insert, update, delete on public.posts to authenticated;
grant select on public.published_posts to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- 3. SELECTIONS  (results tracker — year/centre/entry counts)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.selections (
  id          uuid primary key default gen_random_uuid(),
  year        int not null,
  exam        text not null,              -- e.g. "CDS OTA", "AFCAT"
  center      text,                       -- SSB centre, e.g. "Allahabad"
  count       int not null default 1,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.selections enable row level security;

drop policy if exists "selections_admin_all" on public.selections;
create policy "selections_admin_all" on public.selections
  for all to authenticated
  using ( private.is_admin() ) with check ( private.is_admin() );

create or replace view public.published_selections as
  select id, year, exam, center, count, sort_order
  from public.selections where published = true;

grant select, insert, update, delete on public.selections to authenticated;
grant select on public.published_selections to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- 4. MOCK QUESTIONS  (OIR / SRT practice)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.mock_questions (
  id          uuid primary key default gen_random_uuid(),
  type        text not null default 'OIR' check (type in ('OIR','SRT')),
  question    text not null,
  options     jsonb not null default '[]'::jsonb,   -- string[] (OIR)
  answer      int,                                   -- index into options (OIR)
  explanation text,
  difficulty  text default 'medium',
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.mock_questions enable row level security;

drop policy if exists "mock_admin_all" on public.mock_questions;
create policy "mock_admin_all" on public.mock_questions
  for all to authenticated
  using ( private.is_admin() ) with check ( private.is_admin() );

-- Public view HIDES the answer & explanation so the quiz can't be cheated
-- from the network tab. Scoring happens server-side.
create or replace view public.published_mock_questions as
  select id, type, question, options, difficulty, sort_order
  from public.mock_questions where published = true;

grant select, insert, update, delete on public.mock_questions to authenticated;
grant select on public.published_mock_questions to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- 5. ANALYTICS  (privacy-friendly aggregate page views)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.page_view_daily (
  path   text not null,
  day    date not null,
  views  int  not null default 0,
  primary key (path, day)
);
alter table public.page_view_daily enable row level security;

-- Only admins may read the analytics table.
drop policy if exists "pv_admin_read" on public.page_view_daily;
create policy "pv_admin_read" on public.page_view_daily
  for select to authenticated using ( private.is_admin() );

-- Anonymous visitors increment counts ONLY through this SECURITY DEFINER RPC,
-- which validates & normalizes the path. No direct table write is exposed.
create or replace function public.track_view(p text)
returns void language plpgsql security definer set search_path = '' as $$
declare clean text;
begin
  -- keep only same-origin path-like strings; cap length; strip query/hash
  clean := split_part(split_part(coalesce(p,'/'), '?', 1), '#', 1);
  if clean = '' or left(clean,1) <> '/' then clean := '/'; end if;
  if length(clean) > 120 then clean := left(clean,120); end if;
  insert into public.page_view_daily (path, day, views)
  values (clean, current_date, 1)
  on conflict (path, day) do update set views = public.page_view_daily.views + 1;
end;
$$;

grant execute on function public.track_view(text) to anon, authenticated;
grant select on public.page_view_daily to authenticated;

-- ─────────────────────────────────────────────────────────────
-- 6. SCHEDULED PUBLISHING
-- ─────────────────────────────────────────────────────────────
create table if not exists public.scheduled_content (
  id          uuid primary key default gen_random_uuid(),
  key         text not null,               -- site_content key
  snapshot    jsonb not null,              -- the doc to publish
  publish_at  timestamptz not null,
  done        boolean not null default false,
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);
alter table public.scheduled_content enable row level security;

drop policy if exists "sched_admin_all" on public.scheduled_content;
create policy "sched_admin_all" on public.scheduled_content
  for all to authenticated
  using ( private.is_admin() ) with check ( private.is_admin() );

grant select, insert, update, delete on public.scheduled_content to authenticated;
