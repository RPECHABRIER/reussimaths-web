begin;

create table if not exists public.student_study_topics (
  user_id uuid not null references auth.users (id) on delete cascade,
  level_id text not null check (char_length(level_id) between 1 and 80),
  chapter_id text not null check (char_length(chapter_id) between 1 and 160),
  status text not null check (status in ('current', 'completed')),
  updated_at timestamptz not null default now(),
  primary key (user_id, level_id, chapter_id)
);

create index if not exists student_study_topics_user_level_idx
  on public.student_study_topics (user_id, level_id);

alter table public.student_study_topics enable row level security;

drop policy if exists "student_study_topics: self read" on public.student_study_topics;
drop policy if exists "student_study_topics: self read/write" on public.student_study_topics;
drop policy if exists "student_study_topics: self insert" on public.student_study_topics;
drop policy if exists "student_study_topics: self update" on public.student_study_topics;
drop policy if exists "student_study_topics: self delete" on public.student_study_topics;

create policy "student_study_topics: self read"
  on public.student_study_topics for select
  using (auth.uid() = user_id);

create policy "student_study_topics: self insert"
  on public.student_study_topics for insert
  with check (auth.uid() = user_id);

create policy "student_study_topics: self update"
  on public.student_study_topics for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "student_study_topics: self delete"
  on public.student_study_topics for delete
  using (auth.uid() = user_id);

revoke all on table public.student_study_topics from public;
grant select, insert, update, delete on table public.student_study_topics to authenticated;

commit;
