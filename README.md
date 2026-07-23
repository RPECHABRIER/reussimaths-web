# Reussimaths — web app

App de révision (brevet/bac), lancée en web-first : une page web (PWA installable),
paiement direct via Stripe pour l'abonnement, comptes individualisés via Supabase.
Une coque native (Capacitor ou équivalent) pourra être ajoutée plus tard sans
réécrire l'app, si la présence dans les stores devient nécessaire.

## Ajouter un nouveau chapitre (le point important)

Dépose un seul fichier `src/chapters/<slug>.js` qui exporte par défaut :

```js
export default {
  meta: {
    id: "mon-chapitre",       // utilisé dans l'URL /chapitre/mon-chapitre
    title: "Mon chapitre",
    description: "Courte description affichée sur l'accueil.",
    free: false,               // true = accessible sans abonnement
    order: 4,                  // ordre d'affichage (optionnel)
    unlockHint: "Débloqué avec l'abonnement.", // optionnel, si free: false
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
utilise `import.meta.glob`), il apparaît sur la page d'accueil, verrouillé ou
non selon `free`, sans toucher à aucun autre fichier. `automatismes.js` et
`suites.js` sont des exemples volontairement minimalistes à remplacer par du
vrai contenu.

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
choisit un pseudo stocké dans `profiles`, complètement séparé de son identité
Google/Apple. À implémenter : un écran "choisis ton pseudo" au premier login
(pas encore fait dans ce squelette — la table existe, l'écran reste à créer).

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
