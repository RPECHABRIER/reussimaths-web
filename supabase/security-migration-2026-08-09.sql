-- À exécuter dans Supabase AVANT de déployer les nouvelles fonctions api/.
begin;

alter table public.challenges add column if not exists notified_at timestamptz;

create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  received_at timestamptz not null default now()
);
alter table public.stripe_webhook_events enable row level security;

-- L'ancien code a été versionné et doit être considéré comme compromis.
delete from public.class_access_codes where code = 'soleil';

commit;

-- Créer ensuite un nouveau code imprévisible directement dans Supabase, sans
-- reporter sa valeur dans le dépôt :
-- insert into public.class_access_codes (code, level, label)
-- values ('REMPLACER_PAR_UN_CODE_ALEATOIRE', 'terminale-techno', 'Terminale technologique');
