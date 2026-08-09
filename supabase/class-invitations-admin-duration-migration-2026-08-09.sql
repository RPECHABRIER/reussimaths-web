begin;

-- Aligne les éventuels accès déjà activés sur la date choisie par l'admin
-- pour leur code, au lieu de conserver l'ancien plafond de sept jours.
update public.subscriptions as subscription
set class_access_expires_at = code.expires_at,
    updated_at = now()
from public.class_access_redemptions as redemption
join public.class_access_codes as code on code.code = redemption.code
where subscription.user_id = redemption.user_id
  and subscription.class_access_level = code.level
  and code.expires_at is not null
  and (
    subscription.class_access_expires_at is null
    or subscription.class_access_expires_at <> code.expires_at
  );

create or replace function public.redeem_class_access_code(p_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_code public.class_access_codes%rowtype;
  v_count integer;
  v_already_redeemed boolean;
begin
  if v_user_id is null then raise exception 'Non authentifié'; end if;
  if p_code is null or length(trim(p_code)) not between 4 and 40 then raise exception 'Code invalide'; end if;

  perform pg_advisory_xact_lock(hashtext(upper(trim(p_code))));
  select * into v_code from public.class_access_codes
   where upper(code) = upper(trim(p_code)) for update;

  if v_code.code is null or not v_code.active or v_code.expires_at is null or v_code.expires_at <= now() then
    raise exception 'Code invalide ou expiré';
  end if;

  select exists(
    select 1 from public.class_access_redemptions
     where code = v_code.code and user_id = v_user_id
  ) into v_already_redeemed;

  if not v_already_redeemed and v_code.max_redemptions is not null then
    select count(*) into v_count from public.class_access_redemptions where code = v_code.code;
    if v_count >= v_code.max_redemptions then raise exception 'Code complet'; end if;
  end if;

  insert into public.class_access_redemptions (code, user_id)
  values (v_code.code, v_user_id) on conflict (code, user_id) do nothing;

  insert into public.subscriptions (user_id, class_access_level, class_access_expires_at, updated_at)
  values (v_user_id, v_code.level, v_code.expires_at, now())
  on conflict (user_id) do update
    set class_access_level = excluded.class_access_level,
        class_access_expires_at = excluded.class_access_expires_at,
        updated_at = now();

  return v_code.level;
end;
$$;

revoke all on function public.redeem_class_access_code(text) from public;
grant execute on function public.redeem_class_access_code(text) to authenticated;

commit;
