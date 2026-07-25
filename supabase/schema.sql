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
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references auth.users (id) on delete cascade,
  to_user uuid not null references auth.users (id) on delete cascade,
  chapter_id text not null,
  from_score integer,
  to_score integer,
  created_at timestamptz not null default now(),
  from_played_at timestamptz,
  to_played_at timestamptz
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
