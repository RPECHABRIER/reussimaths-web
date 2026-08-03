# Automation log — Reussimaths content pipeline

## 2026-08-03 (suite 15) — Chapitre "Préparation à l'EAM" (Première non spé)

Demande de Romain : "il manque la partie préparation des EAM pour les
premières non spé [...] en te servant des documents réels tombés au bac
cette année [...] avec les corrigés que tu trouveras dans le répertoire
Première non spé". Précision ensuite : "ce sont des sujets du bac, donc on a
le droit d'utiliser ces énoncés. Tu peux aussi en proposer d'autres basés
sur les mêmes compétences [...] simplement quand c'est le sujet original tu
précises que c'est extrait du bac en disant le lieu, la période et l'année."

- Copié et lu 3 sessions complètes (sujet + corrigé) de l'EAM 2026, seul
  format d'examen des Première SANS spécialité maths : Métropole (12 juin),
  Antilles-Guyane (12 juin), Centres Étrangers (8 juin). Format confirmé :
  Partie 1 = 8 à 12 QCM Automatismes (6 pts, sans justification, sans
  pénalité) ; Partie 2 = 2-3 exercices (14 pts), presque toujours
  probabilités conditionnelles (tableau croisé ou arbre pondéré) +
  modélisation par suite arithmétique/géométrique, parfois signe de
  dérivée et variations.
- **Nouveau** `src/chapters/preparation-eam-premiere-non-spe.js` (order 9,
  niveau `premiere-non-spe`) avec 23 générateurs :
  - **10 générateurs "officiels"** reproduisant fidèlement les questions
    réelles de ces 3 sessions (une banque de sous-questions réelles tirée
    au hasard à chaque appel, valeurs et réponses inchangées). Chaque
    exercice affiche sa source exacte via le champ `chapter` (étiquette
    au-dessus de l'énoncé), ex. « Préparation EAM — Sujet officiel
    (Métropole, 12 juin 2026) ». Les 4 questions réelles qui reposaient sur
    la lecture d'un graphique ont été reformulées en description textuelle
    des informations du graphique (le composant `<Figure />` du projet ne
    sait tracer que des figures géométriques, pas de repère cartésien ni de
    courbes de fonctions) — réponses et options restent celles du sujet
    officiel.
  - **13 générateurs "originaux"** sur les mêmes compétences (pourcentages,
    équations affines, coefficient directeur, identités remarquables,
    médiane, isoler une variable dans une formule, lecture de tableau de
    valeurs, probabilités conditionnelles par tableau croisé et par arbre
    pondéré, suites arithmétique/géométrique en contexte, signe d'une
    dérivée factorisée), entièrement randomisés à chaque tirage, étiquetés
    génériquement (« Préparation EAM — Automatismes/Probabilités/Suites/
    Fonctions », sans mention de source).
  - Testé à 40 000 itérations (toutes difficultés + sans filtre) : 0 erreur
    (types valides, réponse QCM toujours présente dans les options, réponse
    numérique toujours un nombre fini, aucun "undefined"/"NaN" dans les
    textes). Distribution vérifiée entre les 7 étiquettes de source.
- `src/lib/access.js` : `EXAM_CHAPTER_BY_LEVEL["premiere-non-spe"]` pointe
  maintenant vers `"preparation-eam-premiere-non-spe"` (au lieu de
  `"exercices-rituels-premiere-non-spe"`, qui reste disponible comme
  chapitre classique de l'abonnement, simplement plus comme "chapitre
  examen" du Pack Examen).
- `plannedChapters.js` : aucun changement nécessaire (ce chapitre n'y était
  pas répertorié comme "à venir" ; le mécanisme d'auto-enregistrement par
  `import.meta.glob` suffit).
- Build de production vérifié (`npx vite build`, 0 erreur). Synchronisé
  dans les deux dossiers (dossier de travail + clone Git
  `APPLI GITHUB/Sans titre`) ; `git status --short` confirme les diffs
  attendus (M sur `access.js`, ?? sur le nouveau fichier de chapitre).

## 2026-08-03 (suite 14) — Panneau admin : prévisualisation par palier + tableau de bord abonnés

Demande de Romain : "j'ai besoin d'un compte gratuit, un compte pack examen
[...] et un compte abonné [...] afin de voir ce que chaque utilisateur voit"
→ reformulée ensuite en "une page réservée uniquement à l'admin qui me permet
de switcher sur les différents types de compte sans avoir à créer ces
comptes [...] avec le nombre d'abonnés, leur nom, leur nombre de connexion,
leur type d'abonnement". Impossible de créer de vrais comptes de test à la
place de Romain (connexion Google/Apple uniquement) → implémenté comme un
mode de prévisualisation + un tableau de bord, tous deux réservés à l'admin.

### 1. Mode prévisualisation ("view as"), purement client, aucune donnée en base touchée
- **Nouveau** `src/lib/adminPreview.js` : get/set d'un état de préviz
  (`{mode: "gratuit"|"special_examen"|"mensuel", packExamenLevel?,
  packExamenBonusChapters?}`) en `localStorage`, aucune vérification
  d'identité ici (volontaire, voir garde-fou ci-dessous).
- `src/lib/access.js` : ajout de `isRealAdmin(user)` (identité RÉELLE, jamais
  influencée par la préviz — sert de garde-fou) ; `isAdminUser(user)` devient
  sensible à la préviz (renvoie `false` pendant une préviz active, sinon
  `canAccessChapter`/`hasUnlimitedQuota` court-circuiteraient dessus avant
  même de regarder l'abonnement simulé) ; nouvelle fonction
  `getEffectiveSubscription(user, subscription)` qui renvoie un objet
  `subscription` simulé (plan/status/pack_examen_level/bonus_chapters selon
  le mode) si et seulement si `isRealAdmin(user)` est vrai ET qu'une préviz
  est active — sinon elle renvoie la ligne réelle telle quelle. **Garde-fou
  sécurité documenté dans les deux fichiers** : un utilisateur normal qui
  bidouillerait ce `localStorage` dans sa console n'obtient RIEN de plus que
  son accès réel, car `getEffectiveSubscription`/`isAdminUser` ne consultent
  jamais la préviz sans avoir d'abord vérifié `isRealAdmin(user)` sur l'objet
  utilisateur réellement authentifié par Supabase.
- Câblage dans les 10 points de consommation de `useSubscription`/
  `isAdminUser` (`Niveau.jsx`, `ChapterPage.jsx`, `ParcoursOverview.jsx`,
  `ParcoursStep.jsx`, `Amis.jsx`, `Account.jsx`, `Idees.jsx`,
  `ChapterRunner.jsx`, `AutomatismesRunner.jsx`, `App.jsx`) : chacun
  récupère désormais la ligne brute puis appelle
  `getEffectiveSubscription(user, rawSubscription)` avant de l'utiliser —
  `canAccessChapter`/`hasUnlimitedQuota` n'ont eux-mêmes pas changé, ils
  continuent de raisonner normalement sur ce qu'on leur donne.
- `App.jsx` : anti-partage (`useSingleSession`) exempté sur `isRealAdmin`
  (pas `isAdminUser`) pour que "prévisualiser abonnement complet" ne
  déclenche jamais l'éviction multi-appareils sur le vrai compte de Romain.
  Ajout d'un bandeau doré fixe en haut de l'app quand une préviz est active
  ("⚠ Prévisualisation admin en cours — vue X" + bouton "Quitter"), pour ne
  jamais laisser Romain se demander pourquoi l'accès a changé.
- `Account.jsx` : lien "Panneau admin" (visible seulement pour l'admin réel,
  même pendant une préviz), qui devient "⚠ Prévisualisation active — gérer"
  en doré quand une préviz tourne. `isActive` de la page recalculé sur la
  subscription EFFECTIVE plutôt que sur celle du hook (cohérent avec la
  préviz).
- **Nouveau** `src/pages/AdminPreview.jsx` (route `/admin`, réservée à
  `isRealAdmin`) : sélecteur de palier (Vue réelle / Gratuit / Pack Examen /
  Abonnement complet). Pour Pack Examen : soit laisser le niveau vide pour
  tester le VRAI écran de choix (`PackExamenChoice`, en simulant juste le
  statut d'abonnement), soit choisir un niveau + optionnellement les 2
  chapitres bonus (filtrés au niveau choisi, même logique que
  `PackExamenChoice`/suite 13). Le bouton "Activer cette vue" sauvegarde en
  `localStorage` puis recharge la page.

### 2. Tableau de bord abonnés (lecture seule sur les vraies données)
- Nouvelle policy RLS `subscriptions: admin can read all` (en plus de "self
  read" existante, les deux policies SELECT se cumulent en OR).
- **Nouvelle table** `user_login_stats` (user_id PK, login_count,
  last_login_at) — SÉPARÉE de `profiles` volontairement : `profiles` a une
  policy de lecture PUBLIQUE (nécessaire pour pseudos/parrainage/défis), on
  ne veut surtout pas que le nombre de connexions de chacun devienne visible
  par tout le monde. RLS : self peut lire sa propre ligne, admin lit tout.
- Nouvelle fonction RPC `record_login()` (SECURITY DEFINER), incrémente
  `login_count` et met à jour `last_login_at` pour `auth.uid()`. Appelée
  depuis `src/hooks/useAuth.js` sur l'évènement Supabase `"SIGNED_IN"`
  uniquement (pas sur un simple rechargement de page / refresh de token —
  évite le sur-comptage).
- `AdminPreview.jsx` charge séparément `profiles` (public), `subscriptions`
  (admin-read-all) et `user_login_stats` (admin-read-all), et fait la
  jointure côté client par `user_id` (pas de relation FK directe entre ces 3
  tables exploitable par l'auto-embedding PostgREST, elles ne sont reliées
  qu'via `auth.users`). Affiche : nombre total de comptes + répartition par
  palier, puis un tableau (pseudo, palier déduit de plan+status, nombre de
  connexions, dernière connexion) trié par nombre de connexions décroissant.
  Aucun email ni nom réel affiché (cohérent avec le principe d'anonymat déjà
  en place ailleurs dans l'app).

### Schéma SQL (déjà collé en chat avant application, voir `supabase/schema.sql`)
- Policy `subscriptions: admin can read all`.
- Table `user_login_stats` + ses 2 policies RLS.
- Fonction RPC `record_login()`.

Build vérifié (`npx vite build --outDir /tmp/dist-verify-adminpreview`,
0 erreur). 15 fichiers modifiés/ajoutés synchronisés vers le dossier
persistant ET le clone Git de référence (`reussimaths-web/APPLI GITHUB/Sans
titre/` — voir correction de chemin en suite 13, `git status` y confirme
tous les fichiers attendus, prêt pour commit/push depuis GitHub Desktop).

## 2026-08-03 (suite 13) — Correction du clone Git actif + chapitres bonus Pack Examen restreints au niveau choisi

- **Correction d'un mauvais chemin de sync (signalé par Romain : "github ne
  voit pas ce que tu as ajouté").** Le vrai dépôt Git connecté à GitHub
  Desktop (remote `RPECHABRIER/reussimaths-web`, historique cohérent avec les
  commits précédents de Romain) est en fait imbriqué à
  `Application TOP/reussimaths-web/APPLI GITHUB/Sans titre/` — PAS
  `Application TOP/Première Spé/reussimaths-web-github` (ce dossier-là n'est
  pas un dépôt Git, une copie sans rapport). Les fichiers de la suite 12
  (récompenses de parrainage) ont été recopiés au bon endroit ; `git status`
  y confirme désormais les bons fichiers modifiés/ajoutés. **Pour toute
  synchronisation future : le clone Git de référence est bien
  `reussimaths-web/APPLI GITHUB/Sans titre/`.**
- Adresse du site en production communiquée par Romain :
  https://reussimaths-web.vercel.app/ — ajoutée en haut du `README.md`.
- **Bug signalé par Romain :** dans le choix des 2 chapitres bonus du Pack
  Examen (`PackExamenChoice.jsx`), les menus déroulants proposaient TOUS les
  chapitres de la plateforme, pas seulement ceux du niveau choisi — un
  abonné Pack Examen pouvait donc piocher un chapitre bonus dans n'importe
  quel autre niveau que celui qu'il paie. Corrigé : `bonusOptions` filtre
  désormais sur `c.meta.level === level` (recalculé dès que le niveau
  change, avec reset de `bonusA`/`bonusB` si le niveau est modifié avant
  validation), en excluant aussi le chapitre d'examen du niveau (déjà
  débloqué par le Pack Examen, doublon inutile). Les 2 menus bonus sont
  désactivés tant qu'aucun niveau n'est choisi, avec un message si un niveau
  n'a pas encore de chapitre bonus disponible.
- Build vérifié (`npx vite build --outDir /tmp/dist-verify-packbonus`,
  0 erreur). Synchronisé vers le dossier persistant et le clone Git (au bon
  emplacement, voir ci-dessus).

## 2026-08-03 (suite 12) — Récompenses de parrainage (chapitre au choix + mois gratuit)

Suite ouverte en "suite 11" (carte de parrainage neutralisée après suppression
de `probabilites.js`). Décision de Romain : "la récompense pour le parrainage
est de pouvoir débloquer un chapitre supplémentaire au choix. Pour les
abonnés qui ont accès à tout, ils peuvent avoir un mois gratuit si une
personne parrainée s'abonne." Deux mécaniques indépendantes, cumulables :

- **Chapitre bonus au choix** (tous paliers non-complet, seuil 5 amis comme
  l'ancien `unlockReferrals`) : remplace l'ancien mécanisme (chapitre fixe
  imposé par `meta.unlockReferrals`, abandonné avec `probabilites.js`).
  L'utilisateur choisit librement N'IMPORTE QUEL chapitre du catalogue une
  fois qu'il a parrainé 5 amis, fixé une seule fois (même schéma que
  `PackExamenChoice.jsx`/`set_pack_examen_choices`).
- **Mois gratuit** (abonnés complet uniquement) : si un filleul s'abonne
  (n'importe quel palier, mensuel ou Pack Examen), le parrain — SI il a un
  abonnement complet actif au moment où ça arrive — reçoit un mois gratuit,
  crédité automatiquement côté serveur (webhook Stripe), une seule fois par
  filleul (pas à chaque renouvellement).

### Schéma SQL (déjà collé en chat avant application, voir `supabase/schema.sql`)
- `referrals` : nouvelle colonne `subscription_reward_granted_at` (empêche de
  créditer deux fois le même filleul, ex: désabonnement puis réabonnement).
- Nouvelle table `referral_bonus_chapter` (`user_id` PK, `chapter_id`,
  `granted_at`), RLS lecture seule pour soi (écriture SEULEMENT via la RPC
  ci-dessous — volontairement pas de policy insert/update directe, pour
  empêcher un client de contourner la règle des 5 amis en écrivant
  directement dans la table).
- Fonction RPC `set_referral_bonus_chapter(p_chapter_id)` (SECURITY DEFINER) :
  vérifie elle-même `count(referrals où referrer_id = auth.uid()) >= 5` et
  qu'aucun choix n'existe déjà, avant d'insérer.

### Code
- **Nouveau** `src/hooks/useReferralBonus.js` : charge le chapitre bonus déjà
  choisi (ou `null`) depuis `referral_bonus_chapter`.
- **Nouveau** `src/components/ReferralBonusChoice.jsx` : UI de choix (menu
  déroulant, choix définitif), affichée dans `Account.jsx` dès que
  `referralCount >= 5` et pas encore de choix fait (masquée pour l'admin et
  l'abonnement complet, qui ont déjà tout).
- `src/lib/access.js` (`canAccessChapter`) : le paramètre de contexte
  `referralCount` + le check `meta.unlockReferrals` sont remplacés par
  `referralBonusChapterId` (le chapitre concrètement choisi). Répercuté dans
  tous les points d'accès qui construisaient ce contexte : `Niveau.jsx`,
  `ChapterPage.jsx`, `ParcoursOverview.jsx`, `ParcoursStep.jsx`, `Amis.jsx`
  (tous passés de `useReferrals` à `useReferralBonus` pour ce usage précis —
  `Account.jsx` garde `useReferrals` en plus, pour l'affichage "X/5 amis").
  Les messages de verrouillage par chapitre qui mentionnaient
  `meta.unlockReferrals` (Niveau.jsx, ChapterPage.jsx) sont simplifiés,
  ce champ n'existant plus sur aucun chapitre.
- `api/stripe-webhook.js` : nouvelle fonction
  `grantReferralFreeMonthIfEligible(referredUserId)`, appelée après chaque
  `checkout.session.completed` réussi. Cherche le parrain via `referrals`,
  vérifie qu'il a `plan = 'mensuel'` actif et n'a pas déjà été crédité pour ce
  filleul, retrouve son abonnement Stripe actif (`stripe.subscriptions.list`
  par `customer`), et repousse `trial_end` de 30 jours
  (`proration_behavior: "none"`) — aucune facture émise pendant cette
  période, la facturation normale reprend ensuite automatiquement (le webhook
  `customer.subscription.updated` existant reflète le nouveau
  `current_period_end` sans changement de code). Marque
  `subscription_reward_granted_at` seulement si l'appel Stripe réussit.
  N'échoue jamais bruyamment (try/catch dédié, ne bloque pas le traitement du
  paiement du filleul).
- `src/pages/Account.jsx` : carte de parrainage avec texte différencié selon
  le palier (abonnement complet → "tu reçois un mois gratuit" ; sinon →
  progression vers le chapitre bonus, ou confirmation une fois choisi) +
  affichage de `ReferralBonusChoice` quand éligible.
- Build vérifié (`npx vite build --outDir /tmp/dist-verify-referral`,
  0 erreur). 12 fichiers synchronisés vers les deux destinations
  persistantes (le clone Git imbriqué a été retrouvé sous
  `Application TOP/Première Spé/reussimaths-web-github`, pas
  `APPLI GITHUB/Sans titre` comme dans les entrées précédentes — chemin à
  vérifier/confirmer par Romain si ce n'est pas le bon clone actif).

## 2026-08-03 (suite 11) — Refonte des paliers d'accès (Pack Examen / abonnement complet / admin / idées)

Décisions actées avec l'utilisateur (clarifications successives) :
- **Pack Examen** (`plan: "special_examen"`) : n'est plus équivalent à l'abonnement
  complet. Débloque, pour UN niveau choisi une seule fois à la souscription
  (`subscriptions.pack_examen_level`) : le chapitre de préparation à l'examen
  de ce niveau (Dossier Brevet / Préparation au Bac / Exercices de fin
  d'année selon le niveau — voir `EXAM_CHAPTER_BY_LEVEL` dans
  `src/lib/access.js`), + Automatismes en illimité pour ce niveau seulement.
  Débloque aussi 2 chapitres bonus au choix n'importe où dans le catalogue
  (`subscriptions.pack_examen_bonus_chapters`), fixés une seule fois et non
  modifiables (il faut l'abonnement complet pour en débloquer d'autres).
- **Abonnement complet** (`plan: "mensuel"`) : reste à accès total, tous
  niveaux, sans restriction (retour en arrière sur l'idée initiale de "un
  seul niveau", abandonnée par l'utilisateur au profit d'une protection
  anti-partage).
- **Anti-partage** : une seule session active à la fois par compte abonnement
  complet (pas Pack Examen). Une nouvelle connexion sur un autre appareil
  déconnecte automatiquement l'ancienne, avec un message explicite. L'admin
  (Romain) est exempté pour pouvoir tester sur plusieurs appareils.
- **Accès admin** : le compte de Romain (`romainpechabrier@gmail.com`) a un
  accès complet à tout, sans abonnement — vérifié par email, pas de colonne
  DB dédiée (plus simple, cohérent avec le modèle de confiance déjà en place
  côté client pour le verrouillage des chapitres).
- **Onglet "Idées d'amélioration"** (`/idees`) : réservé à l'abonnement
  complet (pas Pack Examen). Un abonné peut seulement ENVOYER une idée — pas
  de lecture, ni des siennes ni de celles des autres (pas de policy SELECT
  pour lui). Seul l'admin voit la liste complète.

### Schéma SQL (déjà collé en chat avant application, voir aussi `supabase/schema.sql`)
- `subscriptions` : colonnes `pack_examen_level` et
  `pack_examen_bonus_chapters` (text[]), jamais écrites directement par le
  client.
- Fonction RPC `set_pack_examen_choices(p_level, p_bonus_chapters)`
  (SECURITY DEFINER) : seul moyen pour un abonné Pack Examen de fixer son
  choix, une seule fois (vérifie plan actif + `pack_examen_level` encore
  null + exactement 2 chapitres bonus).
- Table `active_sessions` (clé primaire `user_id`, temps réel activé) :
  support de l'anti-partage.
- Table `feature_ideas` (RLS : insert réservé à `plan = 'mensuel'` actif,
  select réservé à `auth.jwt() ->> 'email' = 'romainpechabrier@gmail.com'`).

### Code
- **Nouveau** `src/lib/access.js` : logique centralisée (`canAccessChapter`,
  `hasUnlimitedQuota`, `isAdminUser`, `isFullAccessSubscription`,
  `isPackExamenSubscription`, `EXAM_CHAPTER_BY_LEVEL`). Remplace la logique
  de verrouillage auparavant dupliquée (et incohérente entre paliers) dans
  6 pages + 2 composants.
- Refactorés pour utiliser `canAccessChapter`/`hasUnlimitedQuota` :
  `Niveau.jsx`, `ChapterPage.jsx`, `ParcoursOverview.jsx`, `ParcoursStep.jsx`,
  `Amis.jsx`, `ChapterRunner.jsx`, `AutomatismesRunner.jsx`. (`Home.jsx` non
  touché : page morte, non routée dans `App.jsx`, superseded par
  `CycleSelect`/`Niveau`.)
- **Nouveau** `src/components/PackExamenChoice.jsx` : écran affiché une fois
  dans `Account.jsx` pour qu'un abonné Pack Examen choisisse son niveau + ses
  2 chapitres bonus (appelle la RPC `set_pack_examen_choices`).
- **Nouveau** `src/hooks/useSingleSession.js` + wiring dans `App.jsx` :
  anti-partage via la table `active_sessions` + Supabase Realtime (pas de
  révocation serveur du token, une Edge Function avec clé service_role
  serait nécessaire pour ça — limite documentée dans le hook, jugée
  suffisante pour dissuader un partage familial normal).
- **Nouveau** `src/pages/Idees.jsx` + route `/idees` dans `App.jsx`.
- `useProgress.js` (`useSubscription`) : ajout de `reload` (même pattern que
  `useProfile`), nécessaire pour rafraîchir après `set_pack_examen_choices`.
- `Account.jsx` : badge admin, résumé Pack Examen, lien vers `/idees` pour
  les abonnés complet.
- **Effet de bord corrigé** : le texte de la carte parrainage promettait de
  débloquer "le chapitre Probabilités" — supprimé lors du nettoyage des
  doublons legacy (suite 9/10). Texte neutralisé (ne promet plus rien de
  précis). **Reste ouvert** : définir une nouvelle récompense de parrainage,
  ou abandonner ce mécanisme — décision à prendre séparément.
- Build vérifié (`npx vite build --outDir /tmp/dist-verify-access`,
  0 erreur). 15 fichiers synchronisés vers les deux destinations
  persistantes.

## 2026-08-03 (suite 10) — Suppression des 2 derniers doublons legacy (Première Spé)

- Confirmation utilisateur : "on supprime tous les doublons, éventuellement
  quand il y a des exercices intéressants on les bascule sur l'autre pour
  les conserver" → vérification du contenu de `automatismes.js` et
  `suites.js` avant suppression.
- `automatismes.js` : placeholder à un seul générateur ("calcul mental,
  multiplication de deux nombres 2-20"). Le vrai chapitre
  `automatismes-premiere-spe.js` couvre déjà très largement le calcul
  mental via ~49 générateurs `*Mental` organisés par thème (discriminant,
  suites, dérivation, exponentielle, trigonométrie, produit scalaire,
  géométrie repérée, probabilités conditionnelles, variables aléatoires).
  Rien d'unique à préserver → supprimé tel quel.
- `suites.js` : placeholder à un seul générateur (calcul de \(u_3\) à partir
  de \(u_0\) et \(r\) pour une suite arithmétique, plage étroite : \(u_0 \in
  [1,10]\), \(r \in [2,5]\)). Le vrai chapitre
  `suites-numeriques-premiere-spe.js` couvre exactement le même exercice
  via `genTermeRecurrenceArithmetiqueNumeric`, avec une plage plus large
  (\(u_0 \in [-15,15]\), \(r\) non nul dans \([-9,9]\), n variable). Rien
  d'unique à préserver → supprimé tel quel.
- Les 2 fichiers supprimés des 3 emplacements (scratchpad, dossier
  persistant, clone Git imbriqué). Suppression déjà autorisée par
  `allow_cowork_file_delete` lors du nettoyage précédent.
- Build revérifié (`npx vite build --outDir /tmp/dist-verify-dupfix`) :
  0 erreur.
- **Les 3 doublons legacy de Première Spé (`probabilites.js`,
  `automatismes.js`, `suites.js`) sont désormais tous supprimés.** Le
  sommaire de Première Spé ne référence plus qu'un seul chapitre par
  thème.

## 2026-08-03 (suite 9) — Suppression du chapitre "Probabilités" legacy dupliqué (Première Spé)

- Suite à la découverte documentée en "suite 7" : `probabilites.js` était un
  placeholder à un seul générateur (commentaire interne explicite), antérieur
  au vrai chapitre `probabilites-conditionnelles-premiere-spe.js`, et créait
  un doublon "Probabilités" dans le sommaire de Première Spé (débloqué par
  parrainage, `unlockReferrals: 5`, alors que le vrai chapitre est sous
  abonnement).
- Confirmation utilisateur : "on ne garde qu'un seul chapitre sur les
  probabilités" → `probabilites.js` supprimé des 3 emplacements (scratchpad,
  dossier persistant, clone Git imbriqué). Suppression autorisée via
  `allow_cowork_file_delete` (le dossier `Application TOP` protège les
  suppressions par défaut).
- Build revérifié après suppression (`npx vite build --outDir
  /tmp/dist-verify-probafix`) : 0 erreur, le registre auto-découverte ne
  référence plus ce fichier.
- **Restent en suspens (mêmes doublons legacy, non confirmés par
  l'utilisateur) :** `automatismes.js` (doublon de
  `automatismes-premiere-spe.js`) et `suites.js` (doublon de
  `suites-numeriques-premiere-spe.js`), tous deux dans Première Spé. À
  traiter si l'utilisateur confirme vouloir les supprimer aussi.

## 2026-08-03 (suite 8) — Retaggage difficulté : Terminale Spé terminée — TÂCHE #183 COMPLÈTE

- Tag `DIFFICULTY` + `generate(difficulty)` appliqué aux 15 chapitres
  d'abonnement de Terminale Spé : `combinatoire-denombrement-terminale-spe.js`
  (15), `vecteurs-droites-plans-espace-terminale-spe.js` (15),
  `orthogonalite-distances-espace-terminale-spe.js` (15), `suites-terminale-spe.js`
  (15), `limites-fonctions-terminale-spe.js` (15), `continuite-terminale-spe.js`
  (15), `complements-derivation-terminale-spe.js` (15), `logarithme-neperien-terminale-spe.js`
  (15), `fonctions-trigonometriques-terminale-spe.js` (15),
  `primitives-equations-differentielles-terminale-spe.js` (15),
  `calcul-integral-terminale-spe.js` (15), `loi-binomiale-terminale-spe.js`
  (15), `sommes-variables-aleatoires-terminale-spe.js` (15),
  `loi-grands-nombres-terminale-spe.js` (15, volontairement plus expert —
  dernier chapitre du programme, inégalités de concentration), et
  `exercices-transversaux-terminale-spe.js` (15, chapitre de révision
  transversale, skew standard/expert).
- `automatismes-terminale-spe.js` (`freemiumDaily: 5`) et
  `reviser-les-bases-terminale-spe.js` (`free: true`) confirmés exclus du
  système Parcours, non retaggés.
- Build vérifié (`npx vite build --outDir /tmp/dist-verify-ts`) : premier
  essai en échec (`EMFILE: too many open files` sur un icône lucide-react),
  résolu avec `ulimit -n 65536`, build réussi ensuite.
- Les 15 fichiers synchronisés vers les deux destinations persistantes.
- **Tâche #183 terminée : tous les niveaux sont désormais retaggés**
  (6e, 5e, 4e, 3e, 2nde, Première non spé, Première Spé, Terminale Spé).
- Rappel : la découverte de fichiers legacy dupliqués dans Première Spé
  (`automatismes.js`, `probabilites.js`, `suites.js` — voir entrée
  "suite 7") reste un sujet ouvert distinct, non traité ici.
- Rappel : aucun zip final ne sera produit tant que Première technologique
  et Terminale technologique ne sont pas construites (reporté par
  l'utilisateur — "on fera cela plus tard").

## 2026-08-03 (suite 7) — Retaggage difficulté : Première Spé terminée

- Tag `DIFFICULTY` + `generate(difficulty)` appliqué aux 10 chapitres
  d'abonnement de Première Spé (générateurs multiples) : `derivation-premiere-spe.js`
  (15), `fonction-exponentielle-premiere-spe.js` (15), `geometrie-reperee-premiere-spe.js`
  (15), `preparation-bac-premiere-spe.js` (15, chapitre de révision, skew
  standard/expert), `probabilites-conditionnelles-premiere-spe.js` (15),
  `suites-numeriques-premiere-spe.js` (15), `trigonometrie-premiere-spe.js`
  (15), `variables-aleatoires-premiere-spe.js` (15), `variations-courbes-premiere-spe.js`
  (15), `vecteurs-produit-scalaire-premiere-spe.js` (15).
- `automatismes-premiere-spe.js`/`automatismes.js` (`freemiumDaily: 5`),
  `reviser-les-bases-premiere-spe.js`/`second-degre.js` (`free: true`)
  confirmés exclus du système Parcours, non retaggés.
- **Découverte (hors-scope tagging, signalée à l'utilisateur) :** le registre
  de chapitres (`src/chapters/registry.js`) charge TOUS les fichiers `.js` du
  dossier via `import.meta.glob`, sans liste blanche. Trois fichiers legacy
  (`automatismes.js`, `probabilites.js`, `suites.js`) sont des placeholders à
  UN SEUL générateur (commentaires internes : "Placeholder minimal pour
  valider le registre"), antérieurs aux vrais chapitres `-premiere-spe.js`
  correspondants. Ils sont donc toujours actifs en prod et créent des
  chapitres dupliqués dans le niveau Première Spé (ex : "Probabilités"
  ≠ "Probabilités conditionnelles et indépendance", "Suites numériques" ≠
  "Suites numériques, modèles discrets"). N'ayant qu'un seul générateur,
  aucun tag `DIFFICULTY` ne s'applique à ces 3 fichiers — ils sont laissés
  tels quels, sujet distinct du retaggage difficulté, à traiter séparément
  si souhaité (probablement suppression des 3 fichiers legacy).
- Build vérifié (`npx vite build --outDir /tmp/dist-verify-ps`, 0 erreur).
- Les 10 fichiers synchronisés vers les deux destinations persistantes.
- Prochaine étape : Terminale Spé (dernier niveau restant pour la tâche #183).

## 2026-08-03 (suite 6) — Retaggage difficulté : Première non spé terminée

- Tag `DIFFICULTY` + `generate(difficulty)` appliqué aux 7 chapitres
  d'abonnement de Première non spé : `analyse-information-chiffree-premiere-non-spe.js`
  (15 générateurs), `croissance-lineaire-premiere-non-spe.js` (15),
  `croissance-exponentielle-premiere-non-spe.js` (15),
  `variations-instantanees-premiere-non-spe.js` (15),
  `variations-globales-premiere-non-spe.js` (15),
  `statistique-probabilites-premiere-non-spe.js` (15, volontairement plus
  expert compte tenu du chapitre probabilités conditionnelles), et
  `exercices-rituels-premiere-non-spe.js` (15, chapitre de révision, skew
  standard/expert comme les autres chapitres de synthèse).
- `automatismes-premiere-non-spe.js` (`freemiumDaily: 5`) et
  `reviser-les-bases-premiere-non-spe.js` (`free: true`) confirmés exclus du
  système Parcours (filtre `levelChapters()`), donc non retaggés.
- Build vérifié (`npx vite build --outDir /tmp/dist-verify-pns`, 0 erreur).
- Les 7 fichiers synchronisés vers les deux destinations persistantes.
- Prochaine étape : Première Spé, puis Terminale Spé.

## 2026-08-03 (suite 5) — Retaggage difficulté : 2nde terminée

- Tag `DIFFICULTY` + `generate(difficulty)` appliqué aux 13 chapitres 2nde
  d'abonnement : `nombres-calculs-seconde.js` (15 générateurs),
  `generalites-fonctions-seconde.js` (15), `variations-fonctions-seconde.js`
  (15), `fonctions-affines-seconde.js` (15), `fonctions-reference-seconde.js`
  (15), `reperage-configurations-seconde.js` (15), `vecteurs-seconde.js`
  (15), `colinearite-vecteurs-seconde.js` (15), `equations-droites-seconde.js`
  (15), `informations-chiffrees-seconde.js` (15),
  `statistiques-descriptives-seconde.js` (15),
  `probabilites-echantillonnage-seconde.js` (15),
  `exercices-fin-annee-seconde.js` (15).
- **Niveau 2nde entièrement retaggé.** Un `Rollup failed to resolve
  @supabase/auth-js` est apparu au premier essai de build (résolu par un
  simple `rm -rf node_modules/.vite` — cache Vite corrompu, pas un vrai
  problème de dépendances). Build ensuite vérifié 0 erreur, synchronisé
  vers le dossier de référence et le clone Git.
- Prochaine étape : Première non spé (6 chapitres + exercices rituels).

## 2026-08-03 (suite 4) — Retaggage difficulté : 3e terminée

- Tag `DIFFICULTY` + `generate(difficulty)` appliqué aux 15 chapitres 3e
  d'abonnement : `nombres-entiers-troisieme.js` (18 générateurs),
  `calcul-numerique-troisieme.js` (16), `calcul-litteral-troisieme.js` (16),
  `equations-troisieme.js` (16), `fonctions-affines-troisieme.js` (14),
  `notion-fonction-troisieme.js` (14), `statistiques-troisieme.js` (15),
  `probabilites-troisieme.js` (15), `proportionnalite-troisieme.js` (14),
  `thales-triangles-semblables-troisieme.js` (15),
  `trigonometrie-triangle-rectangle-troisieme.js` (15),
  `transformations-plan-troisieme.js` (15),
  `geometrie-espace-troisieme.js` (15), `mesures-grandeurs-troisieme.js`
  (15), `dossier-brevet-troisieme.js` (15, orienté standard/expert car
  chapitre de révision Brevet).
- **Niveau 3e entièrement retaggé.** Build vérifié (0 erreur — un
  `EMFILE: too many open files` transitoire a nécessité un `ulimit -n
  16384` avant de relancer), synchronisé vers le dossier de référence et
  le clone Git.
- Prochaine étape : niveau 2nde (12 chapitres + exercices transversaux).

## 2026-08-03 (suite 3) — Retaggage difficulté : 4e terminée

- Tag `DIFFICULTY` + `generate(difficulty)` appliqué aux 15 chapitres 4e
  d'abonnement : `nombres-relatifs-quatrieme.js` (22 générateurs),
  `addition-soustraction-rationnels.js` (18),
  `multiplication-division-rationnels.js` (15), `puissances-quatrieme.js`
  (18), `calcul-litteral-quatrieme.js` (16), `resolution-equations.js` (14),
  `statistiques-quatrieme.js` (15), `probabilites-quatrieme.js` (13),
  `notion-fonctions.js` (12), `proportionnalite-quatrieme.js` (16),
  `theoreme-thales.js` (9), `triangles-rectangles-quatrieme.js` (13),
  `geometrie-plane.js` (12), `geometrie-espace-quatrieme.js` (14),
  `exercices-fin-annee-quatrieme.js` (15, orienté standard/expert car
  c'est un chapitre de révision de synthèse).
- **Niveau 4e entièrement retaggé.** Build vérifié (0 erreur), synchronisé
  vers le dossier de référence et le clone Git.
- Prochaine étape : niveau 3e (14 chapitres + Dossier Brevet).

## 2026-08-03 (suite 2) — Retaggage difficulté : 5e terminée

- Tâche #183 (suite) : identifié que `automatismes-cinquieme.js` et
  `reviser-les-bases-cinquieme.js` sont exclus des paliers Parcours
  (`levelChapters()` dans `src/parcours.js` filtre `meta.free` et
  `meta.freemiumDaily`) — donc pas besoin de leur ajouter `DIFFICULTY`,
  seulement aux 11 vrais chapitres d'abonnement de la 5e.
- Tag `DIFFICULTY` + `generate(difficulty)` appliqué aux 11 chapitres 5e :
  `calcul-numerique.js` (9 générateurs), `nombres-relatifs.js` (29),
  `puissances.js` (7), `calcul-litteral.js` (17),
  `divisibilite-fractions.js` (22),
  `symetrie-centrale-parallelogrammes.js` (29), `triangles.js` (22),
  `geometrie-espace.js` (17), `statistiques-probabilites.js` (20),
  `proportionnalite-cinquieme.js` (20), `fonctions.js` (15).
- **Niveau 5e entièrement retaggé.** Build vérifié (0 erreur), synchronisé
  vers le dossier de référence et le clone Git.
- Prochaine étape : niveau 4e (14 chapitres + exercices fin d'année).

## 2026-08-03 (suite) — Retaggage difficulté : 6e terminée

- Tâche #183 : tag `DIFFICULTY` + `generate(difficulty)` appliqué aux 8
  chapitres 6e restants (`nombres-decimaux.js` était déjà fait comme pilote) :
  `operations-decimaux.js` (21 générateurs), `fractions.js` (25),
  `grandeurs-mesures.js` (22), `distances-symetries.js` (16), `angles.js`
  (17), `configurations-geometriques.js` (14),
  `organisation-gestion-donnees.js` (18), `proportionnalite.js` (18).
  Classification facile/standard/expert faite à la main par lecture de
  chaque générateur (règle générale : les fonctions préfixées
  `genProbleme*` = expert, sinon facile/standard selon nombre d'étapes de
  raisonnement).
- **Niveau 6e entièrement retaggé** (9/9 chapitres) — les paliers
  Débutant/Avancé/Expert des Parcours sont maintenant vraiment différenciés
  sur ce niveau, pas seulement sur le chapitre pilote.
- Build vérifié (`vite build`, 0 erreur — juste un avertissement taille de
  bundle, sans rapport) puis synchronisé vers le dossier de référence et le
  clone Git (`APPLI GITHUB/Sans titre`).
- Prochaine étape : 5e (chapitres à identifier), puis 4e → 3e → 2nde →
  Première non spé → Première Spé → Terminale Spé, dans cet ordre.

## 2026-08-03 — Première Spé finished, Parcours feature, LaTeX fix, défis par thème

**Contexte :** reprise après plusieurs jours ; Romain a demandé de tenir ce
journal à jour à chaque session à partir de maintenant (trace rapide, pas un
compte-rendu exhaustif).

**Première Spé (dernier niveau de contenu en attente) :**
- Fini les 2 derniers bugs de QCM à doublons dans `preparation-bac-premiere-spe.js`
  (`genLectureGraphiqueAffineQCM` : b=0 faisait coïncider deux options ;
  `genPuissancesDix10QCM` : distracteurs `10^{-exp}` retombaient sur la bonne
  réponse ou un autre distracteur pour exp∈{0,1}). Testé 40 000 itérations, 0
  erreur. Niveau Première Spé désormais **complet** (11 chapitres + Réviser
  les bases + Automatismes) — il ne reste plus que Première techno et
  Terminale techno comme niveaux sans contenu (report explicite de Romain,
  pas de source fournie).

**Refonte structure du site (demande de Romain) :**
- Accueil (`/`) : choix Collège / Lycée uniquement (`CycleSelect.jsx`), puis
  liste des niveaux du cycle (`CycleLevels.jsx`, `/college` ou `/lycee`).
  Ajout du champ `cycle` sur chaque niveau (`levels.js`).
- **Système de Parcours** (`src/parcours.js`) : 3 paliers par niveau
  (Débutant/Avancé/Expert), dérivés automatiquement du registre de chapitres
  (pas de duplication en base) ; parcours gratuit "Découverte" (avant-goût
  multi-niveaux, contourne le mur d'abonnement pour ses étapes précises).
  Chaque étape = un chapitre joué en série notée de 8 questions
  (`ChapterRunner` étendu en "mode session" : `difficulty`, `sessionLength`,
  `onSessionComplete`, `backTo`, rétrocompatible). Progression stockée dans
  la nouvelle table Supabase `parcours_progress`. Pages :
  `ParcoursSelect.jsx`, `ParcoursOverview.jsx`, `ParcoursStep.jsx`.
- **Mini-diagnostic** (`ParcoursDiagnostic.jsx`) : 6 questions réparties sur
  le programme du niveau, recommande un palier en fin de série.
- Convention de tag de difficulté par générateur : objet `DIFFICULTY` en fin
  de fichier de chapitre (nom de générateur → facile/standard/expert) +
  `generate(difficulty)` qui filtre `GENERATORS`, repli sur le pool complet
  si non tagué ou vide. Pilote sur `nombres-decimaux.js` (6e) uniquement pour
  l'instant — **le reste des ~115 fichiers de chapitres reste à tagger,
  niveau par niveau (tâche en cours, voir plus bas)**.

**Bug LaTeX non compilé (signalé par Romain) :** ~109/115 fichiers de
chapitres avaient des `steps` (aide/correction) contenant du LaTeX brut
(`\dfrac`, `\times`, `^{...}`...) SANS l'enrobage `\( \)` que KaTeX exige —
affiché en code brut au lieu d'être compilé. Fix centralisé dans
`MathText.jsx` : détecte la syntaxe LaTeX sans délimiteur et l'enrobe
automatiquement. Vérifié à grande échelle (7600+ chaînes, tous chapitres) :
0 régression, ~3600 lignes corrigées. Corrigé au passage 2 coquilles
préexistantes sans rapport (`statistiques-troisieme.js` : `$` en trop ;
`suites-numeriques-premiere-spe.js` : double enrobage). Trouvé et fixé aussi
un souci d'environnement : `@supabase/supabase-js` non épinglé strictement
cassait le build avec sa dernière version publiée → épinglé sur `2.45.4`.

**Défier un ami : clarté des thèmes (signalé par Romain) :** le sélecteur de
défi affichait "Automatismes" identique pour chaque niveau (aucune
différenciation), et un défi sur un chapitre Automatismes mélangeait tous
les thèmes au hasard indépendamment pour chaque joueur. Fix : chaque option
du sélecteur précise le niveau (ex: "Réviser les bases (6e)"), et les
chapitres Automatismes sont éclatés en une option par vrai thème (ex:
"Automatismes (6e) — Fractions"). Nouvelle colonne `theme_id` sur
`challenges`, transmise à `chapter.generate(themeId)` des deux côtés du duel
pour un vrai duel sur le même sujet. Vérifié : 197 options générées, 0
doublon de libellé.

**Email de notification de défi : mis en pause à la demande de Romain** — pas
de solution d'adresse d'envoi gratuite qui lui convient pour l'instant
(Gmail bloqué à la création, domaine payant non voulu, adresse perso pas
souhaitée). Le code (`api/notify-challenge.js`, appel best-effort depuis
`useChallenges.createChallenge`) existe déjà et est inoffensif sans
identifiants — à reprendre plus tard.

**SQL exécuté par Romain aujourd'hui (les deux d'un coup, en une requête) :**
table `parcours_progress` + RLS, et `challenges.theme_id`. Confirmé fait.

**Git :** tout syncé et pushé dans le clone `APPLI GITHUB/Sans titre`
(remote `RPECHABRIER/reussimaths-web`, branche `main`) via GitHub Desktop.

**Prochaine étape (en cours) :** tâche #183 — retagger la difficulté de tous
les générateurs, niveau par niveau, dans le même ordre que la construction
du contenu (6e → 5e → 4e → 3e → 2nde → Première non spé → Première Spé →
Terminale Spé). Démarrage par les 7 chapitres 6e restants (nombres-decimaux
déjà fait) : operations-decimaux, fractions, grandeurs-mesures,
distances-symetries, angles, configurations-geometriques,
organisation-gestion-donnees, proportionnalite.

## 2026-07-28, run starting ~20:19 (session ee0dc5a3…)

**Folder-naming anomaly found at start of run.** The connected folder
contained several mis-synced copies from older runs: `reussimaths-web 16`,
`reussimaths-web 17`, `reussimaths-web-update26`, `reussimaths-web-update27`
(none named exactly `reussimaths-web`), plus a `reussimaths-web-update40.zip`.
I initially adopted `reussimaths-web 17` (most complete of the mis-named
copies, 46 chapters) as ground truth and started rebuilding niveau 3e
scaffolding + chapter 1 (nombres-entiers) on top of it.

**Concurrent run discovered mid-session.** Partway through, a bash listing of
the connected folder revealed a correctly-named `reussimaths-web` folder
*already existed*, with a very recent mtime (~20:12–20:17) and containing
`nombres-entiers-troisieme.js`, `reviser-les-bases-troisieme.js`,
`automatismes-troisieme.js`, and a `troisieme` entry in `plannedChapters.js`
— i.e. another run (very likely a genuinely concurrent/overlapping scheduled
invocation) had independently done almost exactly the same unit of work at
the same time, correctly named this time. Diffing confirmed these were
different files (different comments, `dossier-brevet-troisieme` vs
`preparation-brevet-troisieme` id) — not a coincidence of me re-reading my
own writes.

**Decision:** rather than overwrite that newer, correctly-named, verified
work with my redundant duplicate, I discarded my duplicate chapter-1 attempt,
adopted the concurrent run's `reussimaths-web` as ground truth (verified with
a 20k-iteration sanity check on its 3 troisieme files — 0 errors), and moved
on to the *next* unit of work instead of redoing the same one.

**This run's actual net-new contribution:**
- `src/chapters/calcul-numerique-troisieme.js` — chapter 2 of the 3e manuel
  (fractions: +/-/×/÷ and priorités, problème "fraction du reste", puissances:
  calcul, puissance négative, priorités, règles produit/quotient/puissance de
  puissance/produit même exposant, encadrement de racine carrée, carré
  parfait, écriture scientifique — 16 generators). Tested at 40,000 iterations
  standalone, 0 errors.
- Added the matching "Calcul numérique" theme (5 generators) to
  `automatismes-troisieme.js`. Verified exactly one `const THEMES = [`
  declaration after the edit, `node --check` passes, and the full
  automatismes file re-tested at 40,000 iterations across all themes
  (`nombres-entiers-troisieme`, `calcul-numerique-troisieme`, `mix`,
  undefined) — 0 errors.
- Full `npx vite build` succeeds with both new chapters present in the bundle
  (grepped `calcul-numerique-troisieme` in the built JS to confirm).
- Synced back into the connected folder's canonical `reussimaths-web`.

**3e progress so far (across this run + the concurrent one):** chapter 1
(nombres-entiers) and chapter 2 (calcul-numerique) done and tested, plus
level scaffolding (`levels.js` already had all 4 target levels pre-existing;
`plannedChapters.js` troisieme entries for all 15 chapters; free
"Réviser les bases" chapter; Automatismes shell). **12 more 3e chapters
still to go** (calcul-littéral, équations, notion de fonction, fonctions
affines, proportionnalité, statistiques, probabilités, Thalès/triangles
semblables, trigonométrie, transformations, géométrie dans l'espace, mesures
et grandeurs, dossier Brevet) before 3e is complete — then 2nde, Première non
spé, Terminale Spé remain untouched. This is nowhere near zip-ready; per
standing instructions, no zip was produced this run.

**Known cosmetic issue, not fixed (no delete permission / this sandbox
appears to disallow rm even in the ephemeral scratch dir — got "Operation
not permitted" trying to clean up a leftover `dist-verify-check` build dir
there too):** the connected folder's `reussimaths-web/` contains a
self-nested `reussimaths-web/reussimaths-web/` subdirectory — a stray full
duplicate of the project, most likely created by an earlier run's `cp`/
`rsync` without a trailing slash. It does **not** affect the app (chapter
auto-discovery in `registry.js` uses a non-recursive `import.meta.glob`, so
the nested copy is invisible to the build), but it is dead weight that will
need a human (or a run with delete permission) to remove before the final
zip step, so it doesn't get bundled into
`reussimaths-web-updateN.zip`. Also still present: the old mis-named
`reussimaths-web 16`, `reussimaths-web 17`, `reussimaths-web-update26`,
`reussimaths-web-update27` folders and the stale `reussimaths-web-update40.zip`
at the top level of "Application TOP" — historical debris from before the
folder-naming bug was noticed, safe to delete once confirmed unneeded, but
left alone here since deletion wasn't attempted.

**Note for future runs:** if two runs ever overlap again, prefer re-checking
the connected folder's actual `reussimaths-web` (not just trusting your own
in-progress ephemeral copy) before syncing back, to avoid a lost-update race.

## 2026-07-28, continuation run part 2 (same session, still going per Romain's request)

**Net-new:**
- `proportionnalite-troisieme.js` (3e chapitre 7, order 8) — 14 generators:
  simplifier un ratio, reconnaître un ratio équivalent, exprimer un ratio en
  pourcentage, partager selon un ratio, recette à l'échelle (produit en
  croix), deux nombres dans un ratio donné avec une différence connue,
  coefficient multiplicateur d'une évolution (les deux sens : % → CM et
  CM → %), taux d'évolution depuis deux prix, prix final après évolution,
  prix initial depuis le prix final, enchaînement de deux évolutions
  successives, coefficient réciproque pour revenir au prix de départ (via 5
  curated clean pairs so the answer is always an exact integer percentage),
  comparer deux offres de réduction (réduction unique vs deux réductions
  successives). Tested at 40,000 iterations, 0 errors, plus manual
  spot-check of 32 samples confirming correct arithmetic (including the
  percent/coefficient-multiplicateur round-tripping and the decimal
  formatting via fr()).
- Added the matching "Situations de proportionnalité" theme (5 generators)
  to `automatismes-troisieme.js`. Verified exactly one `const THEMES = [`
  declaration (line 701), `node --check` passed, full automatismes file
  re-tested at 40,000 iterations across all 8 theme selectors (7 named
  themes + mix + default) — 0 errors throughout.
- Synced back into the connected folder's canonical `reussimaths-web`.

**3e progress now:** chapters 1–7 done and tested (nombres entiers, calcul
numérique, calcul littéral, équations, notion de fonction, fonctions
affines, situations de proportionnalité). **8 more 3e chapters still to go**
(statistiques, probabilités, Thalès et triangles semblables, trigonométrie
dans le triangle rectangle, transformations dans le plan, géométrie dans
l'espace, mesures et grandeurs, dossier Brevet) before 3e is complete — then
2nde, Première non spé, Terminale Spé remain untouched. Not zip-ready; no
zip produced.

Same known pre-existing issue as before (nested reussimaths-web/reussimaths-web
duplicate, sandbox rm permission denied) — unchanged, doesn't affect the
build, still needs manual cleanup before the eventual final zip.
