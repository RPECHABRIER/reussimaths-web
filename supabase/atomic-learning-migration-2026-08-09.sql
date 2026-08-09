-- À exécuter dans Supabase AVANT de déployer les hooks qui appellent ces RPC.
begin;

drop policy if exists "skill_mastery: self read/write" on public.skill_mastery;
drop policy if exists "skill_mastery: self read" on public.skill_mastery;
create policy "skill_mastery: self read" on public.skill_mastery
  for select using (auth.uid() = user_id);

drop policy if exists "daily_streak: self read/write" on public.daily_streak;
drop policy if exists "daily_streak: self read" on public.daily_streak;
create policy "daily_streak: self read" on public.daily_streak
  for select using (auth.uid() = user_id);

drop policy if exists "practice_time: self read/write" on public.practice_time;
drop policy if exists "practice_time: self read" on public.practice_time;
create policy "practice_time: self read" on public.practice_time
  for select using (auth.uid() = user_id);

drop policy if exists "daily_activity: self read/write" on public.daily_activity;
drop policy if exists "daily_activity: self read" on public.daily_activity;
create policy "daily_activity: self read" on public.daily_activity
  for select using (auth.uid() = user_id);

create or replace function public.record_learning_attempt(
  p_skill_id text,
  p_chapter_id text,
  p_correct boolean,
  p_activity_date date
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_now timestamptz := now();
begin
  if v_user_id is null then raise exception 'Non authentifié'; end if;
  if p_skill_id is null or length(trim(p_skill_id)) not between 1 and 200 then raise exception 'Compétence invalide'; end if;
  if p_chapter_id is null or length(trim(p_chapter_id)) not between 1 and 120 then raise exception 'Chapitre invalide'; end if;
  if p_correct is null then raise exception 'Résultat invalide'; end if;
  if p_activity_date is null or p_activity_date not between current_date - 1 and current_date + 1 then
    raise exception 'Date invalide';
  end if;

  insert into public.skill_mastery as sm (
    user_id, skill_id, chapter_id, attempts, correct, interval_stage,
    last_correct, last_practiced_at, next_review_at, updated_at
  ) values (
    v_user_id, trim(p_skill_id), trim(p_chapter_id), 1, case when p_correct then 1 else 0 end,
    case when p_correct then 1 else 0 end, p_correct, v_now,
    case when p_correct then v_now + interval '2 days' else v_now end, v_now
  )
  on conflict (user_id, skill_id) do update set
    chapter_id = excluded.chapter_id,
    attempts = sm.attempts + 1,
    correct = sm.correct + case when p_correct then 1 else 0 end,
    interval_stage = case when p_correct then least(sm.interval_stage + 1, 4) else 0 end,
    last_correct = p_correct,
    last_practiced_at = v_now,
    next_review_at = case
      when not p_correct then v_now
      when least(sm.interval_stage + 1, 4) = 1 then v_now + interval '2 days'
      when least(sm.interval_stage + 1, 4) = 2 then v_now + interval '7 days'
      when least(sm.interval_stage + 1, 4) = 3 then v_now + interval '14 days'
      else v_now + interval '28 days'
    end,
    updated_at = v_now;

  insert into public.daily_activity as da (user_id, activity_date, attempts, correct, updated_at)
  values (v_user_id, p_activity_date, 1, case when p_correct then 1 else 0 end, v_now)
  on conflict (user_id, activity_date) do update set
    attempts = da.attempts + 1,
    correct = da.correct + case when p_correct then 1 else 0 end,
    updated_at = v_now;
end;
$$;

create or replace function public.add_practice_seconds(p_seconds integer, p_practice_date date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_user_id uuid := auth.uid();
begin
  if v_user_id is null then raise exception 'Non authentifié'; end if;
  if p_seconds is null or p_seconds not between 1 and 300 then raise exception 'Durée invalide'; end if;
  if p_practice_date is null or p_practice_date not between current_date - 1 and current_date + 1 then
    raise exception 'Date invalide';
  end if;
  insert into public.practice_time as pt (user_id, practice_date, seconds, updated_at)
  values (v_user_id, p_practice_date, p_seconds, now())
  on conflict (user_id, practice_date) do update set
    seconds = pt.seconds + excluded.seconds,
    updated_at = now();
end;
$$;

create or replace function public.mark_daily_practice(p_practice_date date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare v_user_id uuid := auth.uid();
begin
  if v_user_id is null then raise exception 'Non authentifié'; end if;
  if p_practice_date is null or p_practice_date not between current_date - 1 and current_date + 1 then
    raise exception 'Date invalide';
  end if;
  insert into public.daily_streak as ds (
    user_id, current_streak, best_streak, last_practice_date, updated_at
  ) values (v_user_id, 1, 1, p_practice_date, now())
  on conflict (user_id) do update set
    current_streak = case
      when ds.last_practice_date > p_practice_date then ds.current_streak
      when ds.last_practice_date = p_practice_date then ds.current_streak
      when ds.last_practice_date = p_practice_date - 1 then ds.current_streak + 1
      else 1
    end,
    best_streak = greatest(ds.best_streak, case
      when ds.last_practice_date > p_practice_date then ds.current_streak
      when ds.last_practice_date = p_practice_date then ds.current_streak
      when ds.last_practice_date = p_practice_date - 1 then ds.current_streak + 1
      else 1
    end),
    last_practice_date = greatest(ds.last_practice_date, p_practice_date),
    updated_at = now();
end;
$$;

revoke all on function public.record_learning_attempt(text, text, boolean, date) from public;
revoke all on function public.add_practice_seconds(integer, date) from public;
revoke all on function public.mark_daily_practice(date) from public;
grant execute on function public.record_learning_attempt(text, text, boolean, date) to authenticated;
grant execute on function public.add_practice_seconds(integer, date) to authenticated;
grant execute on function public.mark_daily_practice(date) to authenticated;

commit;
