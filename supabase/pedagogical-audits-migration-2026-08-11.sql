begin;

create table if not exists public.pedagogical_correction_audits (
  sample_key text primary key check (length(sample_key) between 1 and 240),
  title text not null check (length(title) between 1 and 240),
  status text not null default 'à_revoir' check (status in ('à_revoir', 'validée', 'prioritaire')),
  checked_criteria smallint[] not null default '{}',
  note text not null default '' check (length(note) <= 5000),
  updated_at timestamptz not null default now()
);

alter table public.pedagogical_correction_audits enable row level security;

drop policy if exists "pedagogical audits: admin read" on public.pedagogical_correction_audits;
create policy "pedagogical audits: admin read"
  on public.pedagogical_correction_audits for select to authenticated
  using ((auth.jwt() ->> 'email') = 'romainpechabrier@gmail.com');

drop policy if exists "pedagogical audits: admin insert" on public.pedagogical_correction_audits;
create policy "pedagogical audits: admin insert"
  on public.pedagogical_correction_audits for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'romainpechabrier@gmail.com');

drop policy if exists "pedagogical audits: admin update" on public.pedagogical_correction_audits;
create policy "pedagogical audits: admin update"
  on public.pedagogical_correction_audits for update to authenticated
  using ((auth.jwt() ->> 'email') = 'romainpechabrier@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'romainpechabrier@gmail.com');

create index if not exists pedagogical_audits_status_idx
  on public.pedagogical_correction_audits (status, updated_at desc);

revoke all on table public.pedagogical_correction_audits from anon;
grant select, insert, update on table public.pedagogical_correction_audits to authenticated;

insert into public.pedagogical_correction_audits (sample_key, title, status, note)
values
  ('Nombres relatifs', 'Nombres relatifs', 'prioritaire', 'Vérifier l’explication signes opposés, distance à zéro, points de vie et la question proche.'),
  ('Fractions', 'Fractions', 'prioritaire', 'Vérifier le sens des parts de même taille, le dénominateur commun et la transformation équivalente.'),
  ('Équation', 'Équation', 'prioritaire', 'Vérifier le contrôle par substitution, l’image de la balance et les opérations sur les deux membres.'),
  ('Pourcentage', 'Pourcentage', 'prioritaire', 'Vérifier la distinction 20/20 %, la méthode par 10 % et le coefficient multiplicateur.'),
  ('Image et antécédent', 'Image et antécédent', 'prioritaire', 'Vérifier la distinction départ/arrivée, substitution/équation et le vocabulaire image-antécédent.')
on conflict (sample_key) do nothing;

commit;
