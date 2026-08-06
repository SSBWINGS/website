-- ============================================================================
-- SSBWINGS CMS — serialize super-admin count decisions
--   Races fixed:
--     • Two concurrent FIRST signups could each see count(profiles)=0 and both
--       become super_admin.
--     • Two concurrent demotions/deletes could each see supers=2 and both
--       proceed, leaving zero super-admins.
--   Both role-count functions now take the SAME transaction-scoped advisory
--   lock before counting, so these decisions are serialized. The lock is
--   released automatically at transaction end.
-- ============================================================================

-- Shared lock key for every super-admin-count decision.
--   hashtext(...) is deterministic; ::bigint picks the single-arg overload.

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(hashtext('ssbwings_role_guard')::bigint);
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

create or replace function private.protect_last_super_admin()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  supers int;
begin
  perform pg_advisory_xact_lock(hashtext('ssbwings_role_guard')::bigint);

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
