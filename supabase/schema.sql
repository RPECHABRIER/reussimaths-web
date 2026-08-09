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
-- Débloque un chapitre au choix (voir referral_bonus_chapter plus bas) et,
-- pour un parrain abonné complet, un mois gratuit si le filleul s'abonne
-- (colonne subscription_reward_granted_at, ajoutée plus bas).
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
alter table public.challenges add column if not exists notified_at timestamptz;

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

-- Les profils sont consultables uniquement par les comptes connectés. Le
-- parrainage par code passe par register_referral(), ce qui évite d'exposer
-- les UUID et codes de tous les élèves aux visiteurs anonymes.
create policy "profiles: authenticated read" on public.profiles
  for select using (auth.uid() is not null);

-- Les abonnements ne sont modifiables que par le service_role (webhook
-- Stripe côté serveur) ; le client peut seulement lire sa propre ligne.
create policy "subscriptions: self read" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "chapter_progress: self read/write" on public.chapter_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "friendships: participants read" on public.friendships
  for select using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "friendships: requester creates pending" on public.friendships
  for insert with check (
    auth.uid() = user_id
    and friend_id <> auth.uid()
    and status = 'pending'
  );

create policy "friendships: participants delete" on public.friendships
  for delete using (auth.uid() = user_id or auth.uid() = friend_id);

create or replace function public.accept_friend_request(p_from_user uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Non authentifié'; end if;

  update public.friendships
     set status = 'accepted'
   where user_id = p_from_user
     and friend_id = auth.uid()
     and status = 'pending';

  if not found then raise exception 'Demande introuvable'; end if;
end;
$$;
revoke all on function public.accept_friend_request(uuid) from public;
grant execute on function public.accept_friend_request(uuid) to authenticated;

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

create or replace function public.register_referral(p_referral_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referrer_id uuid;
begin
  if auth.uid() is null then raise exception 'Non authentifié'; end if;

  select user_id into v_referrer_id
    from public.profiles
   where referral_code = lower(trim(p_referral_code));

  if v_referrer_id is null or v_referrer_id = auth.uid() then return; end if;

  insert into public.referrals (referrer_id, referred_id)
  values (v_referrer_id, auth.uid())
  on conflict (referred_id) do nothing;
end;
$$;
revoke all on function public.register_referral(text) from public;
grant execute on function public.register_referral(text) to authenticated;

-- Défis : chaque participant (celui qui défie ou celui qui répond) voit et
-- peut créer/mettre à jour les défis auxquels il participe.
create policy "challenges: participants read" on public.challenges
  for select using (auth.uid() = from_user or auth.uid() = to_user);

create policy "challenges: from_user creates" on public.challenges
  for insert with check (
    auth.uid() = from_user
    and to_user <> auth.uid()
    and from_score between 0 and 5
    and (from_duration_ms is null or from_duration_ms between 0 and 3600000)
    and exists (
      select 1 from public.friendships f
       where f.status = 'accepted'
         and ((f.user_id = auth.uid() and f.friend_id = to_user)
           or (f.friend_id = auth.uid() and f.user_id = to_user))
    )
  );

create or replace function public.submit_challenge_response(
  p_challenge_id uuid,
  p_score integer,
  p_duration_ms integer default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Non authentifié'; end if;
  if p_score not between 0 and 5 then raise exception 'Score invalide'; end if;
  if p_duration_ms is not null and p_duration_ms not between 0 and 3600000 then
    raise exception 'Durée invalide';
  end if;

  update public.challenges
     set to_score = p_score,
         to_duration_ms = p_duration_ms,
         to_played_at = now()
   where id = p_challenge_id
     and to_user = auth.uid()
     and to_played_at is null;

  if not found then raise exception 'Défi introuvable ou déjà joué'; end if;
end;
$$;
revoke all on function public.submit_challenge_response(uuid, integer, integer) from public;
grant execute on function public.submit_challenge_response(uuid, integer, integer) to authenticated;

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

-- ---------------------------------------------------------------------------
-- Récompenses de parrainage (2026-08-03) : remplace l'ancien mécanisme
-- meta.unlockReferrals (chapitre fixe imposé, ex probabilites.js, supprimé).
-- Deux récompenses indépendantes, voir src/lib/access.js et
-- api/stripe-webhook.js :
--   1. N'importe quel utilisateur (gratuit ou Pack Examen) qui parraine 5
--      amis peut choisir UN chapitre supplémentaire, fixé une seule fois
--      (table + fonction ci-dessous, même schéma que
--      set_pack_examen_choices).
--   2. Un abonné complet ("mensuel") dont un filleul s'abonne (n'importe quel
--      palier) reçoit un mois gratuit, crédité automatiquement par le webhook
--      Stripe (une seule fois par filleul, voir subscription_reward_granted_at
--      ci-dessous et grantReferralFreeMonthIfEligible dans stripe-webhook.js).
-- ---------------------------------------------------------------------------

-- Empêche de créditer deux fois le même parrain pour le même filleul (par ex.
-- si le filleul se désabonne puis se réabonne plus tard).
alter table public.referrals add column if not exists subscription_reward_granted_at timestamptz;

-- Chapitre bonus choisi via le parrainage (5 amis), fixé une seule fois via
-- set_referral_bonus_chapter ci-dessous. Table séparée (plutôt qu'une colonne
-- sur `profiles`, où le client a déjà un accès self read/write complet) pour
-- que ce choix ne soit modifiable QUE via la fonction RPC, jamais en écriture
-- directe.
create table if not exists public.referral_bonus_chapter (
  user_id uuid primary key references auth.users (id) on delete cascade,
  chapter_id text not null,
  granted_at timestamptz not null default now()
);
alter table public.referral_bonus_chapter enable row level security;

create policy "referral_bonus_chapter: self read" on public.referral_bonus_chapter
  for select using (auth.uid() = user_id);

-- Fonction appelée une seule fois par l'utilisateur (depuis
-- src/components/ReferralBonusChoice.jsx, affiché dans Account.jsx) pour
-- fixer son chapitre bonus. SECURITY DEFINER : vérifie elle-même le seuil de
-- 5 amis parrainés (comptés dans `referrals`) et qu'aucun choix n'a déjà été
-- fait, avant d'insérer.
create or replace function public.set_referral_bonus_chapter(p_chapter_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_referral_count integer;
  v_already boolean;
begin
  if v_user_id is null then
    raise exception 'Non authentifié';
  end if;

  select count(*) into v_referral_count
    from public.referrals
    where referrer_id = v_user_id;

  if v_referral_count < 5 then
    raise exception 'Il faut avoir parrainé au moins 5 amis';
  end if;

  select exists(select 1 from public.referral_bonus_chapter where user_id = v_user_id) into v_already;
  if v_already then
    raise exception 'Chapitre bonus déjà choisi, non modifiable';
  end if;

  insert into public.referral_bonus_chapter (user_id, chapter_id) values (v_user_id, p_chapter_id);
end;
$$;

grant execute on function public.set_referral_bonus_chapter(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Panneau admin (2026-08-03) : voir src/pages/AdminPreview.jsx (/admin,
-- réservé à romainpechabrier@gmail.com). Deux besoins :
--   1. Un mode "prévisualisation" (gratuit / Pack Examen / abonnement
--      complet) purement CLIENT (localStorage, voir src/lib/adminPreview.js)
--      pour que l'admin voie l'app comme chaque palier sans créer de vrais
--      comptes de test. Ne touche à AUCUNE donnée en base, donc rien à
--      ajouter ici pour ça.
--   2. Un tableau de bord listant tous les abonnés (pseudo, palier, statut,
--      nombre de connexions) — nécessite que l'admin puisse lire TOUTES les
--      lignes de `subscriptions` (actuellement "self read" seulement) et une
--      nouvelle table de suivi des connexions.
-- ---------------------------------------------------------------------------

-- L'admin peut lire tous les abonnements (en plus de la policy existante qui
-- permet à chacun de lire seulement le sien) — utilisé par le tableau de bord
-- de /admin.
create policy "subscriptions: admin can read all" on public.subscriptions
  for select using (auth.jwt() ->> 'email' = 'romainpechabrier@gmail.com');

-- Suivi du nombre de connexions par utilisateur. Table séparée de `profiles`
-- (plutôt qu'une colonne dessus) car `profiles` a une policy de lecture
-- PUBLIQUE (nécessaire pour les pseudos/parrainage) — on ne veut surtout pas
-- que le nombre de connexions de chacun devienne visible par tout le monde.
create table if not exists public.user_login_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  login_count integer not null default 0,
  last_login_at timestamptz
);
alter table public.user_login_stats enable row level security;

create policy "user_login_stats: self read" on public.user_login_stats
  for select using (auth.uid() = user_id);

create policy "user_login_stats: admin read all" on public.user_login_stats
  for select using (auth.jwt() ->> 'email' = 'romainpechabrier@gmail.com');

-- Appelée depuis src/hooks/useAuth.js à chaque évènement Supabase "SIGNED_IN"
-- (une vraie connexion, pas juste un rechargement de page / refresh de
-- token). SECURITY DEFINER pour pouvoir upsert sans policy d'écriture
-- publique sur la table.
create or replace function public.record_login()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    return;
  end if;

  insert into public.user_login_stats (user_id, login_count, last_login_at)
  values (v_user_id, 1, now())
  on conflict (user_id) do update
    set login_count = public.user_login_stats.login_count + 1,
        last_login_at = now();
end;
$$;

-- ---------------------------------------------------------------------------
-- Refonte apprentissage (neurosciences) : suivi de maîtrise PAR COMPÉTENCE
-- (pas par chapitre) + répétition espacée + streak quotidien de pratique.
-- skill_id = exercise.chapter (le libellé déjà présent sur chaque exercice
-- dans tous les générateurs, ex: "Second degré — Discriminant") : on évite
-- ainsi de retoucher ~150 fichiers de chapitres pour leur donner un id
-- explicite. chapter_id = chapter.meta.id, gardé pour regrouper/filtrer par
-- chapitre sans reparser skill_id.
--
-- interval_stage suit une répétition espacée à intervalles croissants :
-- 0 -> à revoir de suite (question ratée), 1 -> +2 jours, 2 -> +1 semaine,
-- 3 -> +2 semaines, 4 -> +4 semaines (palier max). Une bonne réponse fait
-- avancer interval_stage d'un cran (jusqu'à 4) et recule next_review_at
-- d'autant ; une erreur remet interval_stage à 0 et next_review_at à
-- maintenant (la compétence redevient "à réviser" dès aujourd'hui). Voir
-- src/hooks/useSkillTracking.js pour le calcul exact et src/pages/Reviser.jsx
-- pour l'écran qui liste les compétences dues.
create table if not exists public.skill_mastery (
  user_id uuid references auth.users (id) on delete cascade,
  skill_id text not null,
  chapter_id text not null,
  attempts integer not null default 0,
  correct integer not null default 0,
  interval_stage integer not null default 0,
  last_correct boolean,
  last_practiced_at timestamptz,
  next_review_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, skill_id)
);
alter table public.skill_mastery enable row level security;

create policy "skill_mastery: self read/write" on public.skill_mastery
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists skill_mastery_due_idx on public.skill_mastery (user_id, next_review_at);

-- Streak quotidien de PRATIQUE (jours consécutifs où l'élève a fait au moins
-- un exercice), distinct du streak de bonnes réponses en session (mode
-- Jeu/Défi de ChapterRunner, purement local à la session en cours). Un seul
-- enregistrement par jour compte, quel que soit le nombre d'exercices faits
-- ce jour-là. Voir src/hooks/useDailyStreak.js.
create table if not exists public.daily_streak (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_streak integer not null default 0,
  best_streak integer not null default 0,
  last_practice_date date,
  updated_at timestamptz not null default now()
);
alter table public.daily_streak enable row level security;

create policy "daily_streak: self read/write" on public.daily_streak
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant execute on function public.record_login() to authenticated;

-- Temps de pratique cumulé par jour (pour le bilan hebdomadaire destiné aux
-- parents, voir src/pages/Bilan.jsx et src/hooks/usePracticeTime.js). Un seul
-- enregistrement par jour, incrémenté par petites tranches ("heartbeat"
-- régulier pendant qu'un exercice est ouvert, voir ChapterRunner /
-- AutomatismesRunner / MiniDuel) plutôt qu'une ligne par session, pour
-- simplifier l'agrégation hebdomadaire (SUM sur practice_date). Même
-- convention de lecture-puis-écriture côté client que skill_mastery /
-- daily_streak (pas de RPC dédiée) : le pire cas d'abus (un élève gonfle son
-- propre compteur de temps) n'affecte que son propre bilan, sans enjeu de
-- sécurité ou d'accès contrairement aux quotas/abonnements.
create table if not exists public.practice_time (
  user_id uuid references auth.users (id) on delete cascade,
  practice_date date not null,
  seconds integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, practice_date)
);
alter table public.practice_time enable row level security;

create policy "practice_time: self read/write" on public.practice_time
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists practice_time_user_date_idx on public.practice_time (user_id, practice_date);

-- Activité quotidienne agrégée (tentatives + bonnes réponses), pour le bilan
-- hebdomadaire (% de réussite et priorités de la semaine suivante, voir
-- src/pages/Bilan.jsx). skill_mastery ne garde que des compteurs CUMULATIFS
-- par compétence (attempts/correct depuis toujours) — impossible d'en tirer
-- un taux de réussite "cette semaine" précis. D'où cette table dédiée,
-- incrémentée en même temps que skill_mastery (voir useSkillTracking.js,
-- fonction recordAttempt).
create table if not exists public.daily_activity (
  user_id uuid references auth.users (id) on delete cascade,
  activity_date date not null,
  attempts integer not null default 0,
  correct integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, activity_date)
);
alter table public.daily_activity enable row level security;

create policy "daily_activity: self read/write" on public.daily_activity
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists daily_activity_user_date_idx on public.daily_activity (user_id, activity_date);

-- ---------------------------------------------------------------------------
-- Résiliation en libre-service (2026-08-04) : voir src/pages/Account.jsx +
-- api/cancel-subscription.js. Ne concerne que le plan "mensuel" (abonnement
-- Stripe classique, renouvellement automatique) — "special_examen" est un
-- paiement unique déjà non reconductible (voir api/create-checkout-session.js),
-- rien à résilier dessus. Résilier = cancel_at_period_end: true côté Stripe :
-- l'accès reste actif jusqu'à current_period_end, sans reconduction ensuite.
-- Écrit par api/cancel-subscription.js (à l'action de l'utilisateur) ET par
-- api/stripe-webhook.js (pour rester synchro si l'abonnement est géré
-- autrement, ex. directement dans le dashboard Stripe).
-- ---------------------------------------------------------------------------
alter table public.subscriptions add column if not exists cancel_at_period_end boolean not null default false;

-- ---------------------------------------------------------------------------
-- Accès classe (2026-08-04) : accès gratuit et complet à UN niveau donné,
-- offert via un code distribué en classe par Romain à ses propres élèves
-- (voir src/pages/Account.jsx, lien "Code d'accès professeur" + fonction
-- redeem_class_access_code ci-dessous). Objectif : faire connaître l'app et
-- avoir des retours, sans passer par un abonnement payant.
--
-- Un code peut être redeem par autant d'élèves que nécessaire (pas un code à
-- usage unique). Table volontairement SANS policy de lecture client (RLS
-- activé, aucune policy select) : seule la fonction SECURITY DEFINER
-- ci-dessous peut la consulter, les codes ne sont donc jamais visibles
-- depuis le navigateur/réseau.
-- ---------------------------------------------------------------------------
create table if not exists public.class_access_codes (
  code text primary key,
  level text not null,
  label text,
  created_at timestamptz not null default now()
);
alter table public.class_access_codes enable row level security;

-- Niveau débloqué gratuitement pour l'élève qui a saisi un code valide.
-- Colonne INDÉPENDANTE de plan/status (qui restent liés à Stripe) : un élève
-- qui redeem ce code n'a pas de ligne Stripe derrière, et un abonné payant
-- qui redeem aussi ce code (improbable mais inoffensif) garde tout son accès
-- sans rien perdre — voir isClassAccessSubscription() dans src/lib/access.js.
alter table public.subscriptions add column if not exists class_access_level text;

create or replace function public.redeem_class_access_code(p_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_level text;
begin
  if v_user_id is null then
    raise exception 'Non authentifié';
  end if;

  select level into v_level from public.class_access_codes where code = p_code;
  if v_level is null then
    raise exception 'Code invalide';
  end if;

  insert into public.subscriptions (user_id, class_access_level, updated_at)
  values (v_user_id, v_level, now())
  on conflict (user_id) do update
    set class_access_level = v_level,
        updated_at = now();

  return v_level;
end;
$$;

grant execute on function public.redeem_class_access_code(text) to authenticated;

-- Les codes sont créés et renouvelés directement dans Supabase. Ne jamais
-- versionner leur valeur dans ce fichier : un code de classe est un secret
-- d'accès partagé, même s'il ne donne accès qu'à un niveau.

-- ---------------------------------------------------------------------------
-- Accès complet offert par l'admin (voir /admin, api/admin-grant-access.js) :
-- permet à Romain de donner gratuitement l'accès complet (comme l'abonnement
-- "mensuel") à une personne de son choix, à partir de son email, sans passer
-- par Stripe. `admin_granted` distingue ces comptes offerts des vrais abonnés
-- payants (aucun stripe_customer_id/current_period_end n'est renseigné pour
-- eux, donc la carte de résiliation dans Mon compte reste masquée — rien qui
-- pourrait tenter un appel Stripe sur un compte qui n'a pas d'abonnement
-- Stripe réel derrière).
-- ---------------------------------------------------------------------------
alter table public.subscriptions add column if not exists admin_granted boolean not null default false;

-- Journal interne d'idempotence des webhooks Stripe. RLS sans policy : seul
-- le service_role des fonctions serveur peut lire ou écrire ces identifiants.
create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  received_at timestamptz not null default now()
);
alter table public.stripe_webhook_events enable row level security;
