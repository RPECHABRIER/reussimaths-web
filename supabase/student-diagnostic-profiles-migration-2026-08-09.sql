begin;

create table if not exists public.student_diagnostic_profiles (
  user_id uuid not null references auth.users (id) on delete cascade,
  level_id text not null check (char_length(level_id) between 1 and 80),
  results jsonb not null default '[]'::jsonb check (jsonb_typeof(results) = 'array'),
  completed_at timestamptz not null default now(),
  primary key (user_id, level_id)
);

alter table public.student_diagnostic_profiles enable row level security;

drop policy if exists "student_diagnostic_profiles: self read/write" on public.student_diagnostic_profiles;

create policy "student_diagnostic_profiles: self read/write"
  on public.student_diagnostic_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on table public.student_diagnostic_profiles from public;
grant select, insert, update, delete on table public.student_diagnostic_profiles to authenticated;

commit;
