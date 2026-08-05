-- ============================================================================
-- SSBWINGS CMS — content version history (for rollback)
-- Run after 0001 + 0002.
-- ============================================================================

create table if not exists public.content_versions (
  id          bigint generated always as identity primary key,
  key         text not null,
  snapshot    jsonb not null,          -- the previously published document
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users(id)
);
alter table public.content_versions enable row level security;

drop policy if exists "versions_admin_all" on public.content_versions;
create policy "versions_admin_all" on public.content_versions
  for all to authenticated
  using ( private.is_admin() )
  with check ( private.is_admin() );

grant select, insert, update, delete on public.content_versions to authenticated;
