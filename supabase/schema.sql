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

-- ---------------------------------------------------------------------------
-- Row Level Security : chacun ne voit / modifie que ses propres données.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.chapter_progress enable row level security;
alter table public.friendships enable row level security;
alter table public.level_votes enable row level security;

create policy "profiles: self read/write" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Les abonnements ne sont modifiables que par le service_role (webhook
-- Stripe côté serveur) ; le client peut seulement lire sa propre ligne.
create policy "subscriptions: self read" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "chapter_progress: self read/write" on public.chapter_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "friendships: self read/write" on public.friendships
  for all using (auth.uid() = user_id or auth.uid() = friend_id)
  with check (auth.uid() = user_id);

-- Les votes de niveau sont publics en lecture (pour afficher le compteur) et
-- ouverts en écriture (insert) à tous, y compris sans compte ; la clé
-- primaire (level_id, voter_key) empêche un même votant de voter deux fois.
create policy "level_votes: public read" on public.level_votes
  for select using (true);

create policy "level_votes: anyone can vote once" on public.level_votes
  for insert with check (true);
