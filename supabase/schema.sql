-- ---------------------------------------------------------------------------
-- Schéma Reussimaths — à exécuter dans l'éditeur SQL de ton projet Supabase.
-- Comptes individualisés : auth.users (géré par Supabase) + 3 tables perso.
-- ---------------------------------------------------------------------------

-- Profil public, séparé de l'identité de connexion (anonymat voulu : pas de
-- nom réel, pas d'email visible dans l'app — seulement un pseudo choisi).
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  pseudo text not null unique,
  avatar text,
  -- Code de parrainage unique, généré automatiquement. Partagé via un lien
  -- /?ref=<code> (voir src/pages/Onboarding.jsx et src/hooks/useReferrals.js).
  referral_code text unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  created_at timestamptz not null default now()
);

-- Statut d'abonnement, mis à jour uniquement par le webhook Stripe (clé
-- service_role), jamais directement par le client.
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text,
  status text not null default 'none', -- none | trialing | active | canceled | past_due
  plan text, -- 'mensuel' | 'special_examen'
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

-- Progression par chapitre.
create table if not exists public.chapter_progress (
  user_id uuid references auth.users (id) on delete cascade,
  chapter_id text not null,
  score integer not null default 0,
  best_streak integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, chapter_id)
);

-- Défis entre amis (structure minimale, à enrichir plus tard : duel,
-- asynchrone, tournoi de classe). Pas de messagerie libre : uniquement des
-- invitations et des résultats chiffrés.
create table if not exists public.friendships (
  user_id uuid references auth.users (id) on delete cascade,
  friend_id uuid references auth.users (id) on delete cascade,
  status text not null default 'pending', -- pending | accepted
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id)
);

-- Votes "je veux ce niveau en priorité" sur les niveaux sans contenu (voir
-- src/pages/ComingSoon.jsx). voter_key = user_id si connecté, sinon un
-- identifiant aléatoire généré côté navigateur (pas besoin de compte pour
-- voter). Aucune donnée personnelle stockée ici.
create table if not exists public.level_votes (
  level_id text not null,
  voter_key text not null,
  created_at timestamptz not null default now(),
  primary key (level_id, voter_key)
);

-- Parrainage : un ami parrainé (referred_id) ne peut être enregistré qu'une
-- fois (clé primaire), ce qui empêche de compter deux fois le même compte.
-- Débloque certains chapitres via meta.unlockReferrals (ex: probabilites.js).
create table if not exists public.referrals (
  referrer_id uuid references auth.users (id) on delete cascade,
  referred_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Défis asynchrones entre amis (voir src/pages/Amis.jsx et
-- src/hooks/useChallenges.js) : celui qui défie joue N questions sur un
-- chapitre et enregistre son score (from_score), l'ami joue à son tour
-- (to_score), puis les deux scores sont comparés.
-- Limite connue : la policy d'update ci-dessous permet à chaque participant
-- de modifier n'importe quel champ de la ligne (Postgres RLS ne filtre pas
-- par colonne) — acceptable pour un défi entre amis de confiance, mais à
-- durcir via une fonction RPC dédiée si le produit grandit.
-- from_duration_ms / to_duration_ms : temps mis pour répondre aux
-- QUESTIONS_PER_CHALLENGE questions, en millisecondes. Sert uniquement de
-- départage quand from_score = to_score (voir src/pages/Amis.jsx).
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references auth.users (id) on delete cascade,
  to_user uuid not null references auth.users (id) on delete cascade,
  chapter_id text not null,
  from_score integer,
  to_score integer,
  from_duration_ms integer,
  to_duration_ms integer,
  created_at timestamptz not null default now(),
  from_played_at timestamptz,
  to_played_at timestamptz
);

-- Migration idempotente si la table existait déjà avant l'ajout du chrono.
alter table public.challenges add column if not exists from_duration_ms integer;
alter table public.challenges add column if not exists to_duration_ms integer;

-- theme_id : pour un défi sur un chapitre "Automatismes" (qui mélange
-- plusieurs thèmes, voir meta.isAutomatismes), précise sur QUEL thème porte
-- le défi (ex: "fractions"), pour que les deux joueurs soient interrogés sur
-- le même sujet au lieu d'un mélange aléatoire indépendant de chaque côté.
-- NULL pour un défi sur un chapitre classique (un seul sujet, pas d'ambiguïté).
alter table public.challenges add column if not exists theme_id text;

-- Meilleur temps d'un abonné sur une série de 5 questions d'Automatismes, par
-- thème (un id de thème par chapitre du manuel, + "mix" pour le mélange de
-- tous les chapitres) — voir src/hooks/useAutomatismesBestTime.js et
-- src/components/AutomatismesRunner.jsx. Non-abonnés : jamais de ligne créée
-- ici (cohérent avec le quota freemium de 5 questions/jour, une série).
create table if not exists public.automatismes_best_times (
  user_id uuid references auth.users (id) on delete cascade,
  theme_id text not null,
  best_time_ms integer not null,
  best_score integer not null default 5,
  updated_at timestamptz not null default now(),
  primary key (user_id, theme_id)
);

-- Progression par étape de parcours (voir src/parcours.js pour la définition
-- des parcours eux-mêmes — débutant/avancé/expert par niveau + "découverte" —
-- qui vit en dur dans le code, pas en base, pour rester facile à ajuster
-- sans migration). Une ligne = une étape (chapitre joué en série notée)
-- terminée. Voir src/hooks/useParcoursProgress.js.
create table if not exists public.parcours_progress (
  user_id uuid references auth.users (id) on delete cascade,
  parcours_id text not null,
  step_index integer not null,
  completed boolean not null default false,
  score integer not null default 0,
  total integer not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, parcours_id, step_index)
);

-- ---------------------------------------------------------------------------
-- Row Level Security : chacun ne voit / modifie que ses propres données.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.chapter_progress enable row level security;
alter table public.friendships enable row level security;
alter table public.level_votes enable row level security;
alter table public.referrals enable row level security;
alter table public.challenges enable row level security;
alter table public.automatismes_best_times enable row level security;
alter table public.parcours_progress enable row level security;

create policy "automatismes_best_times: self read/write" on public.automatismes_best_times
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "parcours_progress: self read/write" on public.parcours_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "profiles: self read/write" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Le pseudo (et le code de parrainage) sont l'identité PUBLIQUE dans l'app
-- (défis entre amis, résolution d'un lien de parrainage) : lecture ouverte
-- à tous, écriture toujours restreinte à soi-même (policy ci-dessus).
create policy "profiles: public read" on public.profiles
  for select using (true);

-- Les abonnements ne sont modifiables que par le service_role (webhook
-- Stripe côté serveur) ; le client peut seulement lire sa propre ligne.
create policy "subscriptions: self read" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "chapter_progress: self read/write" on public.chapter_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "friendships: self read/write" on public.friendships
  for all using (auth.uid() = user_id or auth.uid() = friend_id)
  with check (auth.uid() = user_id);

-- Le destinataire d'une demande (friend_id) doit aussi pouvoir l'accepter :
-- la policy ci-dessus ne l'autorise qu'en lecture et à supprimer (refuser),
-- pas à faire passer le statut à "accepted".
create policy "friendships: friend can accept" on public.friendships
  for update using (auth.uid() = friend_id) with check (auth.uid() = friend_id);

-- Les votes de niveau sont publics en lecture (pour afficher le compteur) et
-- ouverts en écriture (insert) à tous, y compris sans compte ; la clé
-- primaire (level_id, voter_key) empêche un même votant de voter deux fois.
create policy "level_votes: public read" on public.level_votes
  for select using (true);

create policy "level_votes: anyone can vote once" on public.level_votes
  for insert with check (true);

-- Un utilisateur ne voit que les amis qu'IL a parrainés (pas ceux des
-- autres) ; seul l'utilisateur parrainé peut créer sa propre ligne (il ne
-- peut pas se faire passer pour quelqu'un d'autre grâce à la clé primaire).
create policy "referrals: referrer can read own" on public.referrals
  for select using (auth.uid() = referrer_id);

create policy "referrals: referred user creates own row" on public.referrals
  for insert with check (auth.uid() = referred_id);

-- Défis : chaque participant (celui qui défie ou celui qui répond) voit et
-- peut créer/mettre à jour les défis auxquels il participe.
create policy "challenges: participants read" on public.challenges
  for select using (auth.uid() = from_user or auth.uid() = to_user);

create policy "challenges: from_user creates" on public.challenges
  for insert with check (auth.uid() = from_user);

create policy "challenges: participants update" on public.challenges
  for update using (auth.uid() = from_user or auth.uid() = to_user)
  with check (auth.uid() = from_user or auth.uid() = to_user);

-- ---------------------------------------------------------------------------
-- Paliers d'accès (2026-08-03) : Pack Examen restreint (niveau choisi + 2
-- chapitres bonus fixés une fois), abonnement complet à accès total (tous
-- niveaux, pas de restriction), anti-partage (1 session active par compte),
-- et un onglet "Idées d'amélioration" réservé à l'abonnement complet, visible
-- uniquement par l'admin (romainpechabrier@gmail.com). Voir src/lib/access.js
-- pour toute la logique côté client.
-- ---------------------------------------------------------------------------

-- Niveau choisi (Pack Examen) et 2 chapitres bonus au choix, fixés une seule
-- fois via la fonction set_pack_examen_choices ci-dessous (jamais modifiables
-- directement par le client — la table subscriptions reste "service_role +
-- lecture seule pour soi", voir policy "subscriptions: self read" plus haut).
alter table public.subscriptions add column if not exists pack_examen_level text;
alter table public.subscriptions add column if not exists pack_examen_bonus_chapters text[];

-- Fonction appelée une seule fois par l'abonné Pack Examen (depuis
-- src/pages/Account.jsx) pour fixer son niveau + ses 2 chapitres bonus.
-- SECURITY DEFINER : contourne le RLS de `subscriptions` (normalement
-- réservé au service_role) mais seulement pour la propre ligne de
-- l'appelant (auth.uid()), et seulement si le Pack Examen est actif et que le
-- choix n'a pas déjà été fait — garantit le "fixé une fois, non modifiable".
create or replace function public.set_pack_examen_choices(p_level text, p_bonus_chapters text[])
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_plan text;
  v_status text;
  v_current_level text;
begin
  if v_user_id is null then
    raise exception 'Non authentifié';
  end if;

  select plan, status, pack_examen_level
    into v_plan, v_status, v_current_level
    from public.subscriptions
    where user_id = v_user_id;

  if v_plan is distinct from 'special_examen' or v_status not in ('active', 'trialing') then
    raise exception 'Pack Examen non actif';
  end if;

  if v_current_level is not null then
    raise exception 'Choix déjà effectué, non modifiable';
  end if;

  if p_bonus_chapters is null or array_length(p_bonus_chapters, 1) is distinct from 2 then
    raise exception 'Il faut choisir exactement 2 chapitres bonus';
  end if;

  update public.subscriptions
    set pack_examen_level = p_level,
        pack_examen_bonus_chapters = p_bonus_chapters
    where user_id = v_user_id;
end;
$$;

grant execute on function public.set_pack_examen_choices(text, text[]) to authenticated;

-- Anti-partage : une seule session active par compte abonné (voir
-- src/hooks/useSingleSession.js). Chaque appareil écrit son
-- device_session_id ; la clé primaire (user_id) garantit qu'un seul appareil
-- "gagne" à la fois. Les autres appareils, abonnés au temps réel sur cette
-- table, se déconnectent dès qu'ils voient un device_session_id différent du
-- leur.
create table if not exists public.active_sessions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  device_session_id uuid not null,
  updated_at timestamptz not null default now()
);
alter table public.active_sessions enable row level security;

create policy "active_sessions: self read/write" on public.active_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Active le temps réel sur cette table pour que les autres appareils soient
-- notifiés immédiatement (sans ça, ils ne verraient le changement qu'au
-- prochain rechargement) :
alter publication supabase_realtime add table public.active_sessions;

-- Idées d'amélioration : réservé à l'abonnement complet ("mensuel") en
-- écriture, visible uniquement par l'admin en lecture (pas par les autres
-- abonnés, ni même par l'auteur après envoi — voir src/pages/Idees.jsx).
create table if not exists public.feature_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.feature_ideas enable row level security;

create policy "feature_ideas: abonnement complet can submit" on public.feature_ideas
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.subscriptions s
      where s.user_id = auth.uid()
        and s.plan = 'mensuel'
        and s.status in ('active', 'trialing')
    )
  );

-- Seul l'admin (email fixe) peut lire les idées soumises.
create policy "feature_ideas: admin only read" on public.feature_ideas
  for select using (auth.jwt() ->> 'email' = 'romainpechabrier@gmail.com');
