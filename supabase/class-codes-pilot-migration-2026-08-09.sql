begin;

alter table public.class_access_codes add column if not exists active boolean not null default true;
alter table public.class_access_codes add column if not exists expires_at timestamptz;
alter table public.class_access_codes add column if not exists max_redemptions integer;
alter table public.class_access_codes add column if not exists created_by uuid references auth.users (id) on delete set null;

alter table public.class_access_codes drop constraint if exists class_access_codes_max_redemptions_check;
alter table public.class_access_codes add constraint class_access_codes_max_redemptions_check
  check (max_redemptions is null or max_redemptions between 1 and 500);
create unique index if not exists class_access_codes_upper_code_idx on public.class_access_codes (upper(code));

create table if not exists public.class_access_redemptions (
  code text not null references public.class_access_codes (code) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  primary key (code, user_id)
);
alter table public.class_access_redemptions enable row level security;

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

  if v_code.code is null or not v_code.active or (v_code.expires_at is not null and v_code.expires_at <= now()) then
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

  insert into public.subscriptions (user_id, class_access_level, updated_at)
  values (v_user_id, v_code.level, now())
  on conflict (user_id) do update set class_access_level = v_code.level, updated_at = now();

  return v_code.level;
end;
$$;

revoke all on function public.redeem_class_access_code(text) from public;
grant execute on function public.redeem_class_access_code(text) to authenticated;

commit;
