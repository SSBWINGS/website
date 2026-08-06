-- ============================================================================
-- SSBWINGS CMS — FAQ collection. Run after 0001–0003.
-- ============================================================================

create table if not exists public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,          -- rich HTML
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.faqs enable row level security;

drop policy if exists "faqs_admin_all" on public.faqs;
create policy "faqs_admin_all" on public.faqs
  for all to authenticated
  using ( private.is_admin() ) with check ( private.is_admin() );

create or replace view public.published_faqs as
  select id, question, answer, sort_order from public.faqs where published = true;

grant select, insert, update, delete on public.faqs to authenticated;
grant select on public.published_faqs to anon, authenticated;
