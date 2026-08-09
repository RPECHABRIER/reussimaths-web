begin;

drop policy if exists "profiles: public read" on public.profiles;
drop policy if exists "profiles: authenticated read" on public.profiles;
create policy "profiles: authenticated read" on public.profiles
  for select using (auth.uid() is not null);

drop policy if exists "friendships: self read/write" on public.friendships;
drop policy if exists "friendships: friend can accept" on public.friendships;
drop policy if exists "friendships: participants read" on public.friendships;
drop policy if exists "friendships: requester creates pending" on public.friendships;
drop policy if exists "friendships: participants delete" on public.friendships;

create policy "friendships: participants read" on public.friendships
  for select using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "friendships: requester creates pending" on public.friendships
  for insert with check (auth.uid() = user_id and friend_id <> auth.uid() and status = 'pending');
create policy "friendships: participants delete" on public.friendships
  for delete using (auth.uid() = user_id or auth.uid() = friend_id);

create or replace function public.accept_friend_request(p_from_user uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Non authentifié'; end if;
  update public.friendships set status = 'accepted'
   where user_id = p_from_user and friend_id = auth.uid() and status = 'pending';
  if not found then raise exception 'Demande introuvable'; end if;
end;
$$;
revoke all on function public.accept_friend_request(uuid) from public;
grant execute on function public.accept_friend_request(uuid) to authenticated;

drop policy if exists "referrals: referred user creates own row" on public.referrals;
create or replace function public.register_referral(p_referral_code text)
returns void language plpgsql security definer set search_path = public as $$
declare v_referrer_id uuid;
begin
  if auth.uid() is null then raise exception 'Non authentifié'; end if;
  select user_id into v_referrer_id from public.profiles
   where referral_code = lower(trim(p_referral_code));
  if v_referrer_id is null or v_referrer_id = auth.uid() then return; end if;
  insert into public.referrals (referrer_id, referred_id)
  values (v_referrer_id, auth.uid()) on conflict (referred_id) do nothing;
end;
$$;
revoke all on function public.register_referral(text) from public;
grant execute on function public.register_referral(text) to authenticated;

drop policy if exists "challenges: participants update" on public.challenges;
drop policy if exists "challenges: from_user creates" on public.challenges;
create policy "challenges: from_user creates" on public.challenges
  for insert with check (
    auth.uid() = from_user and to_user <> auth.uid()
    and from_score between 0 and 5
    and (from_duration_ms is null or from_duration_ms between 0 and 3600000)
    and exists (
      select 1 from public.friendships f where f.status = 'accepted'
      and ((f.user_id = auth.uid() and f.friend_id = to_user)
        or (f.friend_id = auth.uid() and f.user_id = to_user))
    )
  );

create or replace function public.submit_challenge_response(
  p_challenge_id uuid, p_score integer, p_duration_ms integer default null
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Non authentifié'; end if;
  if p_score not between 0 and 5 then raise exception 'Score invalide'; end if;
  if p_duration_ms is not null and p_duration_ms not between 0 and 3600000 then
    raise exception 'Durée invalide';
  end if;
  update public.challenges
     set to_score = p_score, to_duration_ms = p_duration_ms, to_played_at = now()
   where id = p_challenge_id and to_user = auth.uid() and to_played_at is null;
  if not found then raise exception 'Défi introuvable ou déjà joué'; end if;
end;
$$;
revoke all on function public.submit_challenge_response(uuid, integer, integer) from public;
grant execute on function public.submit_challenge_response(uuid, integer, integer) to authenticated;

commit;
