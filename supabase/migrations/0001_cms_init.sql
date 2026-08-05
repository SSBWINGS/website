-- ============================================================================
-- SSBWINGS CMS — initial schema, roles, RLS & storage
-- Run this in your Supabase project: Dashboard → SQL Editor → paste → Run.
-- Safe to re-run (idempotent where practical).
-- ============================================================================

-- Private schema for SECURITY DEFINER helpers (NOT exposed to the Data API).
create schema if not exists private;

-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES  (admin accounts + role)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'admin' check (role in ('admin','super_admin')),
  created_at  timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Authorization helpers (run as owner; scoped to the calling user via auth.uid()).
create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role in ('admin','super_admin')
  );
$$;

create or replace function private.is_super_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'super_admin'
  );
$$;

-- A user reads their own profile; super-admins read all (for user management).
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated
  using ( id = (select auth.uid()) or private.is_super_admin() );

-- Only super-admins may change roles / manage profile rows.
drop policy if exists "profiles_write" on public.profiles;
create policy "profiles_write" on public.profiles
  for all to authenticated
  using ( private.is_super_admin() )
  with check ( private.is_super_admin() );

-- Auto-create a profile when an auth user is created. The FIRST user becomes super_admin.
create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case when (select count(*) from public.profiles) = 0 then 'super_admin' else 'admin' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 2. SITE CONTENT  (one row per section; draft + published documents)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.site_content (
  key         text primary key,          -- e.g. 'hero', 'footer', 'story', 'seo.home'
  label       text,                       -- human name shown in the admin
  draft       jsonb not null default '{}'::jsonb,
  published   jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id)
);
alter table public.site_content enable row level security;

drop policy if exists "content_admin_all" on public.site_content;
create policy "content_admin_all" on public.site_content
  for all to authenticated
  using ( private.is_admin() )
  with check ( private.is_admin() );

-- Public (anon) reads only PUBLISHED content, via a view that hides the draft column.
create or replace view public.published_content as
  select key, published from public.site_content;

-- ─────────────────────────────────────────────────────────────
-- 3. RECOMMENDED CANDIDATES  (Wall of Honour)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.recommended_candidates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  exam        text not null,             -- their entry, e.g. "CDS OTA"
  image_path  text,                      -- storage path in the media bucket
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.recommended_candidates enable row level security;

drop policy if exists "candidates_admin_all" on public.recommended_candidates;
create policy "candidates_admin_all" on public.recommended_candidates
  for all to authenticated
  using ( private.is_admin() )
  with check ( private.is_admin() );

create or replace view public.published_candidates as
  select id, name, exam, image_path, sort_order
  from public.recommended_candidates
  where published = true;

-- ─────────────────────────────────────────────────────────────
-- 4. TESTIMONIALS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  rank        text,
  body        text not null,
  image_path  text,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.testimonials enable row level security;

drop policy if exists "testimonials_admin_all" on public.testimonials;
create policy "testimonials_admin_all" on public.testimonials
  for all to authenticated
  using ( private.is_admin() ) with check ( private.is_admin() );

create or replace view public.published_testimonials as
  select id, name, rank, body, image_path, sort_order
  from public.testimonials where published = true;

-- ─────────────────────────────────────────────────────────────
-- 5. MENTORS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.mentors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  specialty   text,
  bio         text,
  image_path  text,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.mentors enable row level security;

drop policy if exists "mentors_admin_all" on public.mentors;
create policy "mentors_admin_all" on public.mentors
  for all to authenticated
  using ( private.is_admin() ) with check ( private.is_admin() );

create or replace view public.published_mentors as
  select id, name, role, specialty, bio, image_path, sort_order
  from public.mentors where published = true;

-- ─────────────────────────────────────────────────────────────
-- 6. MEDIA LIBRARY  (metadata for uploaded images; files live in Storage)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  path        text not null,             -- storage path
  alt         text,
  width       int,
  height      int,
  uploaded_by uuid references auth.users(id),
  created_at  timestamptz not null default now()
);
alter table public.media enable row level security;

drop policy if exists "media_admin_all" on public.media;
create policy "media_admin_all" on public.media
  for all to authenticated
  using ( private.is_admin() ) with check ( private.is_admin() );

-- ─────────────────────────────────────────────────────────────
-- 7. ACTIVITY LOG  (audit trail)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.activity_log (
  id          bigint generated always as identity primary key,
  actor       uuid references auth.users(id),
  actor_email text,
  action      text not null,             -- e.g. 'publish', 'update', 'create_admin'
  target      text,                      -- e.g. 'site_content:hero'
  created_at  timestamptz not null default now()
);
alter table public.activity_log enable row level security;

drop policy if exists "activity_admin_read" on public.activity_log;
create policy "activity_admin_read" on public.activity_log
  for select to authenticated using ( private.is_admin() );

drop policy if exists "activity_admin_insert" on public.activity_log;
create policy "activity_admin_insert" on public.activity_log
  for insert to authenticated with check ( private.is_admin() );

-- ─────────────────────────────────────────────────────────────
-- 8. GRANTS  (PostgREST checks role grants, then RLS restricts rows)
-- ─────────────────────────────────────────────────────────────
grant usage on schema public to anon, authenticated;

-- Admin tables: authenticated may operate (RLS restricts to admins).
grant select, insert, update, delete on
  public.profiles, public.site_content, public.recommended_candidates,
  public.testimonials, public.mentors, public.media, public.activity_log
  to authenticated;

-- Public read of PUBLISHED content only, through the views.
grant select on
  public.published_content, public.published_candidates,
  public.published_testimonials, public.published_mentors
  to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- 9. STORAGE  (public 'media' bucket; admins write, everyone reads)
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select to anon, authenticated using ( bucket_id = 'media' );

-- Upsert needs INSERT + SELECT + UPDATE for admins.
drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert to authenticated with check ( bucket_id = 'media' and private.is_admin() );

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update to authenticated
  using ( bucket_id = 'media' and private.is_admin() )
  with check ( bucket_id = 'media' and private.is_admin() );

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete to authenticated using ( bucket_id = 'media' and private.is_admin() );

-- ============================================================================
-- DONE. Next steps:
--   1. Create your first admin: Dashboard → Authentication → Add user
--      (enter email + password). That first user auto-becomes SUPER_ADMIN.
--   2. Set env vars from Settings → API into .env.local (see .env.example).
--   3. Log in at /admin/login.
-- ============================================================================
