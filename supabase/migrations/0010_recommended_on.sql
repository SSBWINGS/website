-- Recommended candidates: add a date-of-recommendation so the wall can order
-- latest-first. Existing bulk-imported rows have NULL (sorted after dated ones).
alter table public.recommended_candidates
  add column if not exists recommended_on date;

create or replace view public.published_candidates as
  select id, name, exam, image_path, sort_order, recommended_on
  from public.recommended_candidates
  where published = true;

grant select on public.published_candidates to anon, authenticated;
