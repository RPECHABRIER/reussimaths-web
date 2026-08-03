# Reussimaths — web app

App de révision (brevet/bac), lancée en web-first : une page web (PWA installable),
paiement direct via Stripe pour l'abonnement, comptes individualisés via Supabase.
Une coque native (Capacitor ou équivalent) pourra être ajoutée plus tard sans
réécrire l'app, si la présence dans les stores devient nécessaire.

## Niveaux et modèle freemium

Les niveaux proposés (6e à Terminale) sont listés dans `src/levels.js`. Un
niveau s'affiche "Disponible" sur l'accueil dès qu'au moins un chapitre déclare
`meta.level` égal à son `id` ; sinon il s'affiche "Bientôt disponible" avec un
bouton de vote (table `level_votes`) qui permet de prioriser les niveaux à
développer. Rien à coder pour ça : ça découle automatiquement du contenu
présent.

Modèle freemium : un chapitre peut être...
- `free: true` — accessible sans compte ni abonnement, en illimité ;
- `freemiumDaily: 5` — accessible sans abonnement mais limité à N questions
  par jour (quota client, voir `src/hooks/useDailyQuota.js`), illimité avec un
  abonnement actif. C'est le mode utilisé pour "Automatismes" sur chaque niveau ;
- ni l'un ni l'autre (`free` absent) — entièrement réservé à l'abonnement.

## Ajouter un nouveau chapitre (le point important)

Dépose un seul fichier `src/chapters/<slug>.js` qui exporte par défaut :

```js
export default {
  meta: {
    id: "mon-chapitre",       // utilisé dans l'URL /chapitre/mon-chapitre
    title: "Mon chapitre",
    description: "Courte description affichée sur l'accueil.",
    level: "seconde",          // voir la liste des niveaux dans src/levels.js
    free: false,               // true = accessible sans abonnement, en illimité
    freemiumDaily: 5,          // OU : N questions gratuites/jour (incompatible avec free)
    order: 4,                  // ordre d'affichage (optionnel)
    unlockHint: "Débloqué avec l'abonnement.", // optionnel, si ni free ni freemiumDaily
  },
  generate() {
    // doit retourner un exercice, cf. src/chapters/second-degre.js pour des
    // exemples de générateurs "numeric" et "qcm"
    return {
      type: "numeric", // ou "qcm"
      chapter: "Mon chapitre — sous-thème",
      prompt: "Énoncé affiché à l'élève",
      answer: 42,       // nombre pour "numeric", chaîne EXACTE d'une des options pour "qcm"
      options: [],      // uniquement pour type "qcm"
      steps: ["étape 1", "étape 2"], // aide progressive affichée si l'élève se trompe
    };
  },
};
```

C'est tout. Le fichier est repéré automatiquement (`src/chapters/registry.js`
utilise `import.meta.glob`), il apparaît dans la liste de son niveau (et fait
"apparaître" ce niveau comme disponible s'il ne l'était pas), verrouillé ou
non selon `free`/`freemiumDaily`, sans toucher à aucun autre fichier.
`automatismes.js` et `suites.js` sont des exemples volontairement
minimalistes à remplacer par du vrai contenu.

## Lancer le projet en local

```bash
npm install
cp .env.example .env   # puis renseigne VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

Sans les variables Supabase, l'appli se lance quand même (avertissement en
console) : tu peux voir l'UI et le contenu, mais connexion/abonnement/progression
ne fonctionneront pas.

## Configurer les comptes individualisés (Supabase)

1. Crée un projet sur [supabase.com](https://supabase.com) (gratuit pour démarrer).
2. Dans l'éditeur SQL du projet, exécute `supabase/schema.sql` (tables `profiles`,
   `subscriptions`, `chapter_progress`, `friendships`, avec Row Level Security :
   chaque utilisateur ne voit/modifie que ses propres lignes).
3. Dans Authentication > Providers, active Google et Apple, avec les identifiants
   OAuth de chaque plateforme (Google Cloud Console / Apple Developer).
4. Renseigne `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` (Project Settings > API).

Important sur l'anonymat (décision produit actée) : l'app n'affiche jamais le
nom réel ni l'email de connexion. Après la première connexion, l'utilisateur
est automatiquement redirigé vers `/pseudo` (voir `src/pages/Onboarding.jsx`)
pour choisir un pseudo stocké dans `profiles`, complètement séparé de son
identité Google/Apple.

### Mise à jour du schéma pour un projet Supabase déjà existant

Si tu as déjà exécuté une version précédente de `supabase/schema.sql`,
exécute seulement ce complément dans l'éditeur SQL (au lieu de tout le
fichier) :

```sql
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_pseudo_unique') then
    alter table public.profiles add constraint profiles_pseudo_unique unique (pseudo);
  end if;
end $$;

create table if not exists public.level_votes (
  level_id text not null,
  voter_key text not null,
  created_at timestamptz not null default now(),
  primary key (level_id, voter_key)
);

alter table public.level_votes enable row level security;

drop policy if exists "level_votes: public read" on public.level_votes;
create policy "level_votes: public read" on public.level_votes
  for select using (true);

drop policy if exists "level_votes: anyone can vote once" on public.level_votes;
create policy "level_votes: anyone can vote once" on public.level_votes
  for insert with check (true);
```

## Configurer l'abonnement (Stripe)

1. Crée deux "Prices" récurrents dans le dashboard Stripe : un mensuel à 4,99 €,
   un "spécial examen" (3 mois, facturé une fois 9 €, ou en usage limité — à
   décider selon si tu veux un vrai abonnement 3 mois ou un paiement unique
   donnant accès 3 mois).
2. Renseigne les variables serveur (Vercel > Settings > Environment Variables,
   PAS dans `.env` du front) : `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MENSUEL`,
   `STRIPE_PRICE_EXAMEN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `PUBLIC_APP_URL`.
3. Dans le dashboard Stripe > Webhooks, ajoute l'URL
   `https://<ton-domaine>/api/stripe-webhook` sur les événements
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Récupère le secret de signature généré
   et mets-le dans `STRIPE_WEBHOOK_SECRET`.

Le flux : la page Compte appelle `/api/create-checkout-session` → redirection
vers Stripe Checkout → paiement → Stripe appelle `/api/stripe-webhook` → la
table `subscriptions` est mise à jour → le front lit cette table (jamais
Stripe directement) pour savoir si un chapitre est débloqué.

## Notification email des défis entre amis

Quand un défi est lancé (voir `src/pages/Amis.jsx` / `src/hooks/useChallenges.js`),
`/api/notify-challenge` envoie un email à l'ami défié via un compte Gmail dédié.

1. Crée un compte Gmail dédié au site (pas ton adresse perso).
2. Sur ce compte : active la validation en deux étapes, puis dans les
   paramètres de sécurité Google, génère un "mot de passe d'application"
   (App Password) pour "Mail" — c'est un code à 16 caractères, différent du
   mot de passe normal du compte.
3. Renseigne sur Vercel : `GMAIL_USER` (l'adresse Gmail) et
   `GMAIL_APP_PASSWORD` (le mot de passe d'application). Réutilise
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` et `PUBLIC_APP_URL`, déjà
   nécessaires pour Stripe ci-dessus.

Limite connue : Gmail plafonne l'envoi à ~500 emails/jour par ce biais — large
pour des notifications de défi, à revoir si l'appli grossit beaucoup (passer
à un service d'emails transactionnels dédié, ex. Resend).

## Déploiement

Recommandé : **Vercel** plutôt que du pur GitHub Pages, car il faut exécuter le
webhook Stripe côté serveur (fonction dans `/api`) — GitHub Pages ne fait que
de l'hébergement statique, sans backend. Vercel reste gratuit pour ce volume
et se branche directement sur le dépôt GitHub (déploiement automatique à
chaque push), donc l'esprit "aussi simple qu'une page GitHub" est conservé.

1. Pousse ce dossier sur un dépôt GitHub.
2. Sur [vercel.com](https://vercel.com), importe le dépôt (détection automatique
   Vite, aucune config nécessaire).
3. Ajoute les variables d'environnement (front `VITE_...` + serveur Stripe/Supabase
   listées ci-dessus) dans Vercel > Settings > Environment Variables.
4. Déploie. Chaque push sur la branche principale redéploie automatiquement.

## Vérifications effectuées

- `npm install` puis `npm run build` passent sans erreur dans un environnement
  propre (voir historique de la session de build).
- Le registre de chapitres a été testé avec 3 fichiers (`automatismes.js`,
  `second-degre.js`, `suites.js`) pour confirmer que l'auto-découverte
  fonctionne et que le verrouillage par abonnement (`free: false`) s'affiche
  correctement sur la page d'accueil.
