begin;

create table if not exists public.daily_mental_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  session_date date not null,
  level_id text not null check (length(level_id) between 1 and 80),
  score integer not null check (score between 0 and 10),
  total integer not null default 10 check (total = 10),
  duration_ms integer not null check (duration_ms between 0 and 3600000),
  completed_at timestamptz not null default now(),
  primary key (user_id, session_date, level_id)
);

alter table public.daily_mental_sessions enable row level security;

drop policy if exists "daily mental: own read" on public.daily_mental_sessions;
create policy "daily mental: own read" on public.daily_mental_sessions
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "daily mental: own insert" on public.daily_mental_sessions;
create policy "daily mental: own insert" on public.daily_mental_sessions
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "daily mental: own update" on public.daily_mental_sessions;
create policy "daily mental: own update" on public.daily_mental_sessions
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke all on table public.daily_mental_sessions from anon;
grant select, insert, update on table public.daily_mental_sessions to authenticated;

create index if not exists daily_mental_sessions_user_date_idx
on public.daily_mental_sessions (user_id, session_date desc);

commit;
