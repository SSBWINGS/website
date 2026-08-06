-- ============================================================================
-- SSBWINGS CMS — security hardening
--   Fixes a privilege-escalation gap: previously EVERY new auth user was given
--   role='admin' by the signup trigger. If email sign-ups are enabled on the
--   project, anyone could self-register into full CMS write access.
--
--   New model:
--     • The very first user still bootstraps as 'super_admin'.
--     • Any other self-service signup lands as 'pending' (NO admin access —
--       private.is_admin() only matches 'admin'/'super_admin').
--     • Admins are minted only by the super-admin via the service-role API
--       route, which explicitly promotes the new profile to 'admin'.
-- ============================================================================

-- 1. Allow the non-privileged 'pending' role.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('pending','admin','super_admin'));

-- 2. New signups are 'pending' unless they are the first user (bootstrap).
create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case when (select count(*) from public.profiles) = 0 then 'super_admin' else 'pending' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 3. Let a super-admin fully manage profile rows (promote/demote/remove) and
--    let each user keep reading their own row. (Re-assert; unchanged shape.)
drop policy if exists "profiles_write" on public.profiles;
create policy "profiles_write" on public.profiles
  for all to authenticated
  using ( private.is_super_admin() )
  with check ( private.is_super_admin() );

-- 4. Guard rail: never allow the LAST super-admin to be demoted or deleted,
--    so the account can't be locked out of itself.
create or replace function private.protect_last_super_admin()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  supers int;
begin
  if (tg_op = 'DELETE') then
    if old.role = 'super_admin' then
      select count(*) into supers from public.profiles where role = 'super_admin';
      if supers <= 1 then
        raise exception 'Cannot remove the last super admin.';
      end if;
    end if;
    return old;
  end if;

  -- UPDATE that demotes a super-admin
  if old.role = 'super_admin' and new.role <> 'super_admin' then
    select count(*) into supers from public.profiles where role = 'super_admin';
    if supers <= 1 then
      raise exception 'Cannot demote the last super admin.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_last_super_admin on public.profiles;
create trigger trg_protect_last_super_admin
  before update or delete on public.profiles
  for each row execute function private.protect_last_super_admin();
