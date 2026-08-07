# Automation log — Reussimaths content pipeline

## Règle permanente — plus de "zip final"

Romain confirme (2026-08-03) que le zip final n'est plus nécessaire : le
dossier `Application TOP/reussimaths-web/APPLI GITHUB/Sans titre` est
directement le clone git à jour, poussé sur GitHub. Chaque unité de travail
doit continuer à être synchronisée dans les deux dossiers
(`Application TOP/reussimaths-web/` et `.../APPLI GITHUB/Sans titre`) et
vérifiée via `git status --short`, mais aucun zip n'est à produire.

## 2026-08-03 (suite 18) — Refonte apprentissage (neurosciences)

Demande de Romain : dossier `Application TOP/Neurosciences` (7 PDF sur le
fonctionnement du cerveau et les méthodes d'apprentissage des maths) à
exploiter pour reprendre toute l'appli et la rendre plus efficace pour
l'apprentissage réel, avec des propositions à valider puis une mise en
œuvre "dans l'ordre que je veux", une seule notification à la fin, et des
questions à chaque choix de design. Les 7 PDF ont été lus (extraction texte
+ synthèse), l'app auditée, 10 propositions envoyées et **toutes acceptées**
par Romain, avec 4 réponses à des questions de design (voir ci-dessous).

**Décisions de Romain (via questions à choix) :**
- Liste des compétences à réviser (répétition espacée) → nouvel onglet
  `/reviser` dédié (pas intégré ailleurs).
- Phrase "pourquoi c'est utile" en tête de chapitre → sur tous les chapitres
  existants immédiatement (pas progressif).
- Étapes de correction en couleur → codage sémantique par étape (donnée /
  règle / calcul / résultat), option la plus lente mais la plus fidèle.
- Évolution Classique/Jeu → renommer et ajouter Découverte (Découverte /
  Entraînement / Défi), Découverte en première position.

**Nouveau schéma SQL** (`supabase/schema.sql`, à exécuter par Romain dans
Supabase) : tables `skill_mastery` (suivi de maîtrise PAR COMPÉTENCE —
`skill_id` = `exercise.chapter`, le libellé déjà présent sur chaque exercice,
évite de retoucher les ~150 fichiers de chapitres — avec répétition espacée
à intervalles croissants 0/+2j/+1sem/+2sem/+4sem) et `daily_streak` (streak
quotidien de pratique, distinct du streak de bonnes réponses en session).

**Nouveaux hooks** : `useSkillTracking` (enregistre chaque tentative, calcule
la prochaine révision, expose `getDueSkills()`) et `useDailyStreak`
(incrémente une fois par jour, remet à zéro si un jour est sauté).

**Branchement dans les 3 lecteurs d'exercices** (`ChapterRunner`,
`AutomatismesRunner`, `MiniDuel`) :
- Suivi par compétence + streak quotidien branchés partout.
- `AutomatismesRunner`/`MiniDuel` : les steps (méthode) sont maintenant
  affichables sur une mauvaise réponse (bouton "Voir la méthode" +
  "Suivant" manuel — avant, l'enchaînement était automatique après 500 ms
  quelle que soit la réponse, empêchant de voir la correction).
- `ChapterRunner` : difficulté adaptative en continu (fenêtre glissante des
  3 à 5 dernières réponses, désactivée si un palier fixe est imposé par un
  Parcours) ; rejouer une variante de la compétence ratée 2 à 3 questions
  plus tard (`generateMatchingSkill`, tire jusqu'à retomber sur le même
  libellé de compétence, avec repli si le générateur ne la ressort pas assez
  vite) ; nouveau triptyque Découverte (méthode visible en permanence, pas
  de score sauvegardé) / Entraînement (comportement historique) / Défi
  (chronométré, sans bouton "Voir la méthode") ; prop `focusSkill` pour
  rester concentré sur UNE compétence (utilisée par `/reviser`).

**Nouvelle page `/reviser`** (route ajoutée dans `App.jsx`, lien ajouté sur
les 4 écrans d'accueil/compte : `CycleSelect`, `CycleLevels`, `LevelSelect`,
`Account`) : liste, tous niveaux confondus, les compétences dues (via
`getDueSkills()`), avec lien direct `/chapitre/:id?competence=<skill>` qui
ouvre `ChapterRunner` concentré sur cette compétence précise.

**Nouveau composant `StepsList`** (`src/components/StepsList.jsx`) : rendu
partagé des steps, rétro-compatible (chaîne simple = affichage neutre comme
avant) ou objet `{ type, text }` avec `type` ∈ donnée/règle/calcul/résultat,
chacun avec une couleur dédiée (dual coding). Utilisé par les 3 lecteurs et
le nouveau panneau "Méthode" du mode Découverte.

**Contenu — `pourquoi c'est utile`** : champ `meta.pourquoi` ajouté sur les
131 chapitres existants (script Node ciblant la dernière occurrence de
`description:` dans chaque fichier, avec un mapping id → phrase rédigé à la
main ; 1 fichier avec description multi-ligne corrigé manuellement). Affiché
dans l'en-tête de `ChapterRunner`.

**Contenu — biais "nombre entier" sur les décimaux** : `genComparerDecimaux`
et `genVraiFauxComparaison` (`nombres-decimaux.js`, 6e) et `genComparerDecimaux`
(`reviser-les-bases-cinquieme.js`, 5e) mélangent désormais délibérément, une
fois sur deux, un piège classique (ex. 0,7 > 0,65 : le décimal avec le plus
de chiffres après la virgule n'est pas le plus grand) avec des paires
"normales" — pour casser l'heuristique fausse plutôt que la laisser
s'installer (interleaving, cf. dossier Neurosciences).

**Contenu — codage sémantique des steps (retrofit)** : `second-degre.js`
(chapitre "modèle" documenté dans `registry.js`) entièrement retaggé —
10 générateurs + 8 entrées de la banque fixe — comme démonstration complète
du pattern. `nombres-decimaux.js` : la section "Comparer, ranger, encadrer"
retaggée. **Le reste des ~130 chapitres n'est pas encore retaggé** : c'est
un travail de contenu long (chaque step doit être relu et classé), qui
continue progressivement — zéro régression pour les chapitres non retouchés
(un step non tagué s'affiche exactement comme avant, voir `StepsList.jsx`).

Build vérifié (`npm run build`) après chaque étape, 0 erreur. Smoke tests
Node sur les fichiers de chapitres modifiés (générations en masse, formes de
steps valides). Synchronisation vérifiée par diff (pas juste `git status`)
sur tous les fichiers touchés, dans les deux dossiers.

## 2026-08-03 (suite 17) — Niveaux Première technologique et Terminale STMG (complets)

Demande de Romain : construire Première technologique à partir du dossier
"première technologique" (Application TOP — sujets 2026, corrigés, nouveau
programme 2026) et Terminale STMG à partir du dossier "Terminale STMG"
(Lycée — progression annuelle + fiches de séance 2026-2027). Exploration
complète d'abord (lecture des 2 annexes de programme officielles, des 4
sujets EAM technologique réels 2026, listing des fiches par bloc), proposition
envoyée en chat, confirmation de Romain reçue avec une seule précision :
construire quand même les chapitres "Fonction inverse" et "Thème d'étude et
synthèse" (Terminale STMG, blocs G/H) comme "Bientôt disponible" — Romain
rédige leurs fiches sources de son côté, à intégrer plus tard.

**Découverte importante** : `src/levels.js` contenait déjà les entrées
`"premiere-techno"` et `"terminale-techno"` (placeholders "Bientôt" créés lors
d'une session antérieure) — réutilisées telles quelles, aucune modification de
`levels.js` nécessaire.

### Première technologique (`level: "premiere-techno"`, 10 chapitres)

Sommaire construit comme pour Première Spé : `reviser-les-bases-premiere-techno`
(gratuit) + `automatismes-premiere-techno` (4 thèmes : évolutions, équations/
signe, lecture graphique, probabilités) + 7 chapitres de programme +
`preparation-eam-premiere-techno`. Programme 2026 confirmé par lecture de
l'annexe officielle : suites (croissance linéaire/exponentielle), fonctions
polynômes de degré 2 **sans discriminant** (forme factorisée uniquement,
allure/sommet/axe de symétrie par lecture), dérivation (sécantes, tangente,
nombre dérivé, dérivée d'un polynôme degré ⩽ 3), statistiques à deux variables
(ajustement affine uniquement), probabilités conditionnelles et indépendance
(via P_A(B)=P(B)), épreuves indépendantes/Bernoulli (n ⩽ 4), variables
aléatoires (loi de Bernoulli, espérance, fluctuation d'échantillonnage).
Fichiers : `suites-numeriques-premiere-techno.js`,
`fonctions-second-degre-premiere-techno.js`, `derivation-premiere-techno.js`,
`statistiques-deux-variables-premiere-techno.js`,
`probabilites-conditionnelles-premiere-techno.js`,
`epreuves-independantes-premiere-techno.js`,
`variables-aleatoires-premiere-techno.js`. Usage systématique de `exercise.graph`
(jamais de description texte) pour toute lecture graphique.

`preparation-eam-premiere-techno.js` : construit à partir des 4 sujets réels de
l'EAM technologique du 12 juin 2026 (Métropole, Antilles-Guyane, 8 juin pour
Centres étrangers, Polynésie) — lus intégralement (QCM automatismes +
exercices de suites/fonctions/probabilités). Vérification faite : ces sujets
collent bien au nouveau programme 2026 (aucune trace de discriminant ou de
notion supprimée), donc pas d'adaptation majeure nécessaire, seulement des
reformulations mineures. Citation systématique via le champ `chapter`
("Préparation EAM — Sujet officiel (Métropole, 12 juin 2026)", etc.), plus des
générateurs originaux sur les mêmes compétences (automatismes, suites,
fonctions/dérivation, probabilités) sans citation.

### Terminale STMG (`level: "terminale-techno"`, 8 chapitres réels + 2 "Bientôt")

Pas de chapitre "Préparation EAM" (confirmé : pas d'épreuve écrite du bac de
maths en Terminale STMG — `EXAM_CHAPTER_BY_LEVEL["terminale-techno"] = null`).
Sommaire et contenu construits à partir de la progression de Romain
(`Progression_globale_TSTMG.pdf`) et des fiches de séance
(`Terminale STMG/2026-2027/files_bloc*`), après avoir confirmé la
correspondance bloc → thème via les noms de fichiers de séance :
bloc0+A (S1-5) = Suites, blocB (S6-8) = Statistiques à deux variables
(changement de variable), blocC (S9-11) = Probabilités conditionnelles,
blocE (S12-16) = Fonctions exponentielles, blocD-postE (S18-20) = Variables
aléatoires/loi binomiale, blocF (S21-23) = Logarithme décimal. Lecture de 4
fiches de cours (exponentielle base e, taux d'évolution moyen, définition du
log, loi binomiale) pour reprendre les notations exactes de Romain
(X ∼ 𝓑(n;p), CM_moyen = CM_global^(1/n), log(b) défini par 10^x=b).

Fichiers créés : `reviser-les-bases-terminale-techno.js` (gratuit),
`automatismes-terminale-techno.js` (6 thèmes, un par bloc),
`suites-terminale-techno.js` (moyennes arithmétique/géométrique, sommes,
preuve de suites consécutives, versements réguliers à intérêts composés),
`fonctions-exponentielles-terminale-techno.js` (x↦a^x, sens de variation/
allure selon a, propriétés algébriques, taux d'évolution moyen),
`logarithme-decimal-terminale-techno.js` (définition, valeurs immédiates,
propriétés algébriques, résolution a^x=b et x^a=b, nombre de chiffres d'un
entier), `statistiques-deux-variables-terminale-techno.js` (changement de
variable pour ajustement non affine, retour au modèle d'origine),
`probabilites-conditionnelles-terminale-techno.js` (partitions à 3+
évènements, probabilités totales, arbres à plusieurs niveaux),
`variables-aleatoires-terminale-techno.js` (coefficients binomiaux/triangle
de Pascal n⩽10, loi binomiale, cas particuliers P(X=0)/P(X=n)/P(X=n-1),
espérance).

**Bloc G (Fonction inverse) et Bloc H (Thème d'étude et synthèse)** : prévus
dans la progression de Romain mais sans dossier de fiches sur le disque
(confirmé par `find`/`grep`, aucun `files_blocG`/`files_blocH`). Sur demande
explicite de Romain, laissés en "Bientôt disponible" : ajoutés uniquement à
`plannedChapters["terminale-techno"]` (`fonction-inverse-terminale-techno`,
`theme-etude-terminale-techno`), sans fichier `src/chapters/*.js` — à
construire quand Romain aura rédigé ses fiches sources (ou sur nouvelle
demande explicite).

### Modifications transverses

- `src/lib/access.js` — `EXAM_CHAPTER_BY_LEVEL` : ajout de
  `"premiere-techno": "preparation-eam-premiere-techno"` et
  `"terminale-techno": null`.
- `src/plannedChapters.js` — ajout des clés `"premiere-techno"` (10 entrées,
  toutes déjà réelles) et `"terminale-techno"` (8 entrées réelles + les 2
  placeholders G/H).
- Aucune modification nécessaire à `src/levels.js`, au routage (`App.jsx`), ni
  à la tarification/Stripe (tout est dérivé automatiquement de `meta.level`
  sur les chapitres, confirmé par exploration du code avant de commencer).

### Vérification

- `test-premiere-techno.mjs` (9 chapitres × 6000 tirages + variantes de
  difficulté + thèmes Automatismes) : 0 erreur, 10956 exercices avec un
  `graph` valide observés.
- `test-eam-techno.mjs` (40 000 tirages du chapitre EAM) : 0 erreur, 9
  sources de citation distinctes observées (4 sujets officiels + 5 catégories
  originales), 11 469 exercices avec un `graph` valide.
- `test-terminale-stmg.mjs` (8 chapitres × 6000 tirages + variantes +
  thèmes) : 0 erreur, 2042 exercices avec un `graph` valide.
- `npx vite build` : 0 erreur (seul l'avertissement pré-existant sur la
  taille du chunk principal, sans rapport avec ce travail).
- Synchronisation vérifiée par `git status --short` dans
  `Application TOP/reussimaths-web/APPLI GITHUB/Sans titre` : 18 nouveaux
  fichiers de chapitres + 2 fichiers modifiés (`access.js`,
  `plannedChapters.js`), rien d'autre.

## 2026-08-03 (suite 16) — Vrai rendu de graphiques (repère cartésien) : Graph.jsx

Remarque de Romain après la suite 15 : "cela m'embête quand même cette
difficulté avec les graphiques qui nous oblige à des descriptions
textuelles. Pour une bonne application mathématiques on doit pouvoir
afficher tous les types de graphiques. Que peut-on faire pour régler ce
problème une bonne fois pour toutes ?" → confirmé de construire le
composant tout de suite, avec retrofit complet (voir question posée en
chat, réponse "Oui, tout de suite, avec retrofit complet").

- **Nouveau** `src/components/Graph.jsx`, le pendant de `Figure.jsx` (qui
  reste dédié à la géométrie pure) mais pour tout ce qui se lit sur un
  repère cartésien : axes + grille avec graduations, tracé de courbes de
  fonctions (échantillonnage d'une vraie fonction JS fournie par le
  générateur, pas de parsing symbolique), tracé de droites `y = a x + b`
  automatiquement découpées aux bords du repère, points avec projection en
  pointillés sur les axes (lecture d'image/antécédent), bandes verticales
  surlignées (ensemble solution d'une inéquation). Spec déclarative
  `{xMin,xMax,yMin,yMax,curves,lines,points,shade}`, cohérente avec le
  style de `Figure.jsx` (spec objet + rendu SVG, pas de dépendance externe).
- Branché `{exercise.graph && <Graph spec={exercise.graph} />}` dans les 3
  lecteurs d'exercices, à côté du `<Figure />` existant : `ChapterRunner.jsx`,
  `AutomatismesRunner.jsx`, `MiniDuel.jsx`.
- **Retrofit des 4 questions EAM texte-only de la suite 15** (chapitre
  `preparation-eam-premiere-non-spe.js`) : Métropole Q3 (antécédent sur une
  courbe), Antilles-Guyane Q3 (identifier une droite parmi 4), Centres
  Étrangers Q5 (droite (AB) par deux points) et Q8 (ensemble solution d'une
  inéquation sur une courbe) affichent maintenant un vrai graphique ; les
  réponses/options du sujet officiel sont inchangées, seule la présentation
  passe du texte au visuel.
- **Scan des autres niveaux** pour d'autres contournements du même genre
  (question qui parle d'un graphique sans jamais en afficher un) : trouvé et
  corrigé 4 générateurs supplémentaires, tous passés en `graph:` réel :
  - `genLectureGraphiqueAffineQCM` (`preparation-bac-premiere-spe.js`,
    Première Spé) — droite affine à lire au lieu d'être décrite.
  - `genNombreDeriveDeuxPointsNumeric` et `genNombreDeriveDeplacementNumeric`
    (`variations-instantanees-premiere-non-spe.js`, Première non spé) —
    tangente et points A/B, ou triangle des pentes (avancer de 1, monter de
    m), désormais tracés.
  - `genPenteSecanteNumeric` (`derivation-premiere-spe.js`, Première Spé) —
    sécante (AB) entre deux points d'une courbe.
  - `genPointsAlignesOrigineQCM` (`proportionnalite-quatrieme.js`, 4e) —
    points à juger alignés (ou non) avec l'origine, désormais placés sur un
    vrai repère au lieu d'une liste de coordonnées en texte.
- Testé : `test-eam-chapter.mjs` (40 000 itérations, désormais avec
  validation des specs `graph` — bornes finies, `fn` majoritairement fini
  sur le domaine, droites/points numériques cohérents) et un second script
  `test-graph-retrofit.mjs` sur les 4 fichiers retouchés (20 000 itérations
  chacun, 80 000 au total) : 0 erreur, 6707 exercices avec un `graph` valide
  observés sur l'échantillon.
- Build de production vérifié (`npx vite build`, 0 erreur). Synchronisé
  dans les deux dossiers ; `git status --short` confirme les diffs attendus
  (?? sur `Graph.jsx`, M sur les 3 lecteurs d'exercices et les 5 fichiers de
  chapitres retouchés).

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

## 2026-08-04 — Codage sémantique des steps (collège complet) + refonte apprentissage

**Contexte :** suite des 10 propositions neurosciences validées par Romain.
Tâche #233 (codage sémantique des steps `{ type, text }` avec
type ∈ donnée/règle/calcul/résultat, pour un rendu dual-coding distinct dans
`StepsList.jsx`) terminée pour l'intégralité du collège (6e, 5e, 4e, 3e).

**Net-new cette session (suite de la session précédente) :** conversion des
steps de `statistiques-troisieme.js`, `thales-triangles-semblables-troisieme.js`,
`transformations-plan-troisieme.js`, `trigonometrie-triangle-rectangle-troisieme.js`
et `reviser-les-bases-troisieme.js` (les 5 derniers fichiers 3e restants) —
chaque tableau `steps` retaggé selon l'heuristique établie : `donnee` pour la
restitution d'une information donnée avant toute manipulation, `regle` pour
l'énoncé d'une propriété/formule générale (y compris les justifications QCM
mono-étape référençant les valeurs de l'instance), `calcul` pour une étape de
manipulation numérique/algébrique par défaut, `resultat` pour la conclusion
finale d'une chaîne à plusieurs étapes ou une réponse mono-étape énoncée sans
justification. Vérifié par balayage anti-oubli (`grep steps: [\``) et test de
génération (8000 itérations par fichier sur tous les paliers de difficulté
présents, 0 erreur), puis synchronisé.

**Bilan collège (task #233) :** 6e = 100 %, 5e = 100 %, 4e = 100 %, 3e = 17/17
fichiers = 100 %. Le collège est donc entièrement retaggé.

**Vérification finale :** `npm install` + `npm run build` (vite) passent sans
erreur sur l'ensemble du dépôt (avertissement de taille de chunk uniquement,
non bloquant).

**Poussé sur GitHub cette session :** l'ensemble des changements accumulés
depuis le dernier commit (« mise à jour filière technologique », Première/
Terminale technologique), incluant tout le chantier neurosciences en cours :
`StepsList.jsx`, `useSkillTracking.js`, `useDailyStreak.js`, `Reviser.jsx`,
le triptyque Découverte/Entraînement/Défi, les phrases « pourquoi c'est
utile » sur tous les chapitres, l'audit du biais « nombre entier » sur les
décimaux, et le codage sémantique des steps pour tout le collège.

**⚠️ Action manuelle requise (SQL) :** `supabase/schema.sql` contient deux
nouvelles tables (`skill_mastery`, `daily_streak`) nécessaires au
fonctionnement de `useSkillTracking.js` / `useDailyStreak.js` / la page
Réviser. Cet environnement n'a pas d'accès direct à la base Supabase de
production — Romain doit exécuter le contenu ajouté à la fin de
`supabase/schema.sql` (section « Refonte apprentissage (neurosciences) »)
dans l'éditeur SQL Supabase pour que le suivi par compétence et le streak
quotidien fonctionnent en production.

**Reste à faire (lycée, demain, mêmes principes) :** 2nde (15 fichiers),
Première non spé (10), Première spé (12), Première techno (10), Terminale
spé (17), Terminale techno (8) — codage sémantique des steps selon la même
heuristique donnée/règle/calcul/résultat.

## 2026-08-04 (suite) — Repères pédagogiques : 6e complet

Poursuite de la demande de Romain : "il faut donner un repère à l'élève" avant
un résultat numérique, uniquement là où c'était nécessaire (pas de refonte
systématique). Audit complet des 10 fichiers de générateurs de 6e :

- fractions.js : fractions égales, décomposition entier+fraction, additions/
  soustractions de fractions, multiplication par un entier, comparaison
  vrai/faux (sucre en %).
- operations-decimaux.js : multiplier/diviser par 10/100/1000 (décalage de
  virgule), multiplier deux décimaux (placement de la virgule).
- grandeurs-mesures.js : conversions longueur/aire (calcul manquant après la
  règle), formules périmètre du cercle/volume nommées avant application.
- distances-symetries.js : conversion de contenances.
- angles.js : angles supplémentaires/adjacents/bissectrice, angles d'un
  triangle/triangle rectangle/isocèle — règle rappelée avant le calcul.
- configurations-geometriques.js : inégalité triangulaire, triangles
  particuliers, troisième angle, volume d'un empilement de cubes.
- organisation-gestion-donnees.js : pourcentages, chance sur X, probabilités
  (urne/cartes/roue), fréquence, événement contraire — formule avant calcul.
- proportionnalite.js : appliquer un pourcentage, remise, comparer deux
  écoles, pourcentage inverse.
- reviser-les-bases.js : conversion d'unités (dizaines/centaines/milliers).
- nombres-decimaux.js : déjà fait en amont dans la session (fraction→décimal,
  décomposition en somme décimale — exemple d'origine de Romain "9 + 71/100").

Chaque fichier : node --check, smoke test (8000 itérations, 0 erreur),
sync vers les deux copies (dossier utilisateur + repo git), commit séparé.
Build final vérifié (`npm run build`, succès, cache .vite nettoyé au
préalable).

⚠️ Comme pour chaque commit de cette session, le push GitHub doit être fait
manuellement par Romain (pas d'identifiants dans ce sandbox).

Prochaine étape (non commencée) : même audit pour la 5e, la 4e et la 3e, puis
le lycée (reporté à plus tard selon l'instruction initiale de Romain).

## 2026-08-04 (suite) — Repères pédagogiques : 5e complet

Suite de la tâche #236 sur le niveau 5e (même méthode que pour la 6e : ajout
d'un step `regle` avant le calcul chaque fois qu'un générateur sautait
directement à la réponse numérique sans expliciter la règle/formule sous-jacente).

Fichiers modifiés (avec exemples de règles ajoutées) :
- calcul-numerique.js : aire d'un rectangle décomposé en somme de longueurs.
- divisibilite-fractions.js : simplifier une fraction (diviser par un même
  nombre), somme de fractions via écriture décimale, fraction d'une longueur.
- nombres-relatifs.js : soustraire un négatif = ajouter son opposé (durée
  historique, variation de masse).
- calcul-litteral.js : correction la plus significative du lot — l'équation
  x+a=b / a+x=b / x-a=b / a-x=b n'affichait **aucune méthode**, juste la
  solution finale ; ajout de la méthode d'isolement de x (ajouter/soustraire
  des deux côtés) pour les 4 cas, + équations ax=b / x÷a=b.
- puissances.js : écriture des puissances de dix (1 suivi de n zéros), aire
  d'un carré (côté²), volume d'un cube (arête³).
- fonctions.js : +75% = multiplier par 1,75 ; racine carrée du diamètre
  d'éolienne (« nombre qui, multiplié par lui-même, donne... »).
- proportionnalite-cinquieme.js : p% d'un nombre = multiplier par p/100.
- geometrie-espace.js : formules nommées avant application (volume pavé,
  volume cube, volume cylindre, aire du disque).
- reviser-les-bases-cinquieme.js : fraction d'un nombre (diviser puis
  multiplier), écriture décimale d'une fraction, pourcentage d'un nombre,
  périmètre/aire d'un rectangle.

Fichiers relus intégralement, aucune modification nécessaire (déjà bien
expliqués) : statistiques-probabilites.js, symetrie-centrale-parallelogrammes.js,
triangles.js.

Volontairement exclu, comme pour automatismes-sixieme.js en 6e :
automatismes-cinquieme.js (exercices de fluence rapide "Série 1", pas des
leçons expliquées — l'ajout d'explications irait à l'encontre de leur objectif
de calcul mental rapide).

Chaque fichier : node --check, smoke test (8000 itérations, 0 erreur), sync
vers les deux copies, commit séparé. Build final vérifié (`npm run build`,
succès, cache .vite nettoyé au préalable).

⚠️ Le push GitHub doit être fait manuellement par Romain (pas d'identifiants
dans ce sandbox).

Prochaine étape : même audit pour la 4e, puis la 3e (déjà taguée sémantiquement
côté steps via la tâche #233, mais pas encore auditée pour les repères
pédagogiques de la tâche #236). Le lycée reste reporté à plus tard.

## 2026-08-04 (suite 2) — Repères pédagogiques : 4e complet

Suite de la tâche #236 sur le niveau 4e (16 fichiers audités : les 15
chapitres du sommaire + Exercices de fin d'année ; automatismes-quatrieme.js
volontairement exclu, même raison qu'en 6e/5e — fluence rapide, pas des
leçons expliquées).

Fichiers modifiés (avec exemples de règles ajoutées) :
- reviser-les-bases-quatrieme.js : aires rectangle/triangle, pourcentage,
  moyenne.
- addition-soustraction-rationnels.js : décomposition en facteurs premiers
  avec divisions détaillées (au lieu d'afficher juste le résultat), PGCD via
  algorithme d'Euclide avec les étapes, comparaison de fractions par produits
  en croix.
- multiplication-division-rationnels.js : règle de multiplication des
  fractions, fraction d'un nombre, pourcentages, aire rectangle.
- puissances-quatrieme.js : règles produit/quotient/puissance de puissances
  (a^m×a^n=a^(m+n), etc. — jusqu'ici le calcul apparaissait sans jamais
  énoncer la règle), notation scientifique, racine carrée d'une aire.
- calcul-litteral-quatrieme.js : réduire (regrouper les termes), distributivité
  simple et double, factoriser.
- resolution-equations.js : méthode d'isolement de x pour les 4 types
  d'équations (simple, deux étapes, deux côtés, avec parenthèses) — même
  lacune que celle identifiée en 5e (calcul-litteral.js).
- statistiques-quatrieme.js : formule de moyenne, formule de l'angle d'un
  secteur circulaire, conversion angle→pourcentage (le "÷3,6" était un nombre
  magique non expliqué).
- probabilites-quatrieme.js : définitions des types d'événement (certain,
  impossible, élémentaire), principe de l'événement contraire.
- notion-fonctions.js : formule aire/périmètre nommée dans le problème
  contextualisé.
- proportionnalite-quatrieme.js : produit en croix, effet du rapport k sur
  longueur (×k) / aire (×k²) / volume (×k³) — jusqu'ici k² et k³ étaient
  appliqués sans jamais expliquer pourquoi l'exposant change.
- theoreme-thales.js : produit en croix pour résoudre une proportion.
- triangles-rectangles-quatrieme.js : formule de Pythagore nommée avant
  application (deux générateurs qui calculaient directement sans l'énoncer).
- exercices-fin-annee-quatrieme.js : angle diagramme circulaire, Pythagore,
  distributivité, volume pyramide.

Fichiers relus intégralement, aucune modification nécessaire (déjà bien
expliqués) : nombres-relatifs-quatrieme.js, geometrie-plane.js,
geometrie-espace-quatrieme.js.

Chaque fichier : node --check, smoke test (8000 itérations, 0 erreur), sync
vers les deux copies, commit séparé. Build final vérifié (`npm run build`,
succès après un premier essai en échec sur une erreur transitoire EMFILE du
sandbox — sans lien avec le code).

⚠️ Le push GitHub doit être fait manuellement par Romain (pas d'identifiants
dans ce sandbox).

Prochaine étape : même audit pour la 3e (déjà taguée sémantiquement côté
steps via la tâche #233, mais pas encore auditée pour les repères
pédagogiques de la tâche #236). Le lycée reste reporté à plus tard.

## 2026-08-04 (suite 3) — Repères pédagogiques : 3e complet — COLLÈGE COMPLET (tâche #236)

Suite et fin de la tâche #236 sur le niveau 3e (15 fichiers audités : les 14
chapitres du sommaire + Dossier Brevet ; automatismes-troisieme.js
volontairement exclu, même raison qu'aux niveaux précédents — fluence
rapide, pas des leçons expliquées). Avec ce fichier, les quatre niveaux du
collège (6e, 5e, 4e, 3e) ont maintenant été intégralement audités pour la
tâche #236.

Fichiers modifiés (avec exemples de règles ajoutées) :
- reviser-les-bases-troisieme.js : méthode d'isolement de x, Pythagore,
  pourcentage, moyenne.
- nombres-entiers-troisieme.js : PGCD via algorithme d'Euclide avec les
  étapes détaillées (au lieu d'afficher juste le résultat), même lacune que
  celle déjà corrigée en 4e.
- calcul-numerique-troisieme.js : normalisation de l'écriture scientifique
  (ramener la mantisse entre 1 et 10).
- calcul-litteral-troisieme.js : factoriser = mettre un facteur commun en
  évidence.
- equations-troisieme.js : méthode d'isolement de x — un générateur
  n'affichait qu'une seule ligne, zéro méthode, la lacune la plus sévère du
  fichier.
- statistiques-troisieme.js : angle d'un diagramme circulaire, fréquence.
- probabilites-troisieme.js : effectif attendu = probabilité × nombre
  d'expériences ; dérivation du nombre d'issues favorables (« un nombre sur
  trois est multiple de 3 »), qui n'était auparavant qu'un résultat affirmé
  sans justification.
- notion-fonction-troisieme.js : fonction puissance de 10 (écriture avec des
  zéros selon le signe de l'exposant), règle du produit nul dans une égalité
  de fonctions (jusqu'ici l'équation x(x+a)=0 sautait directement à « x=0 ou
  x=... » sans jamais énoncer pourquoi).
- fonctions-affines-troisieme.js : regroupement des termes en x pour
  comparer deux tarifs (équation à x des deux côtés).
- proportionnalite-troisieme.js : correction la plus significative du
  fichier — la notion de « coefficient multiplicateur » (cœur du chapitre
  sur les évolutions en pourcentage) était utilisée dans presque tous les
  générateurs sans jamais être dérivée du pourcentage annoncé dans l'énoncé ;
  ajout systématique de la dérivation (1 ± p/100) avant chaque usage.
- thales-triangles-semblables-troisieme.js : produit en croix, somme des
  angles d'un triangle = 180°.
- trigonometrie-triangle-rectangle-troisieme.js : fonctions réciproques
  (arccos, arcsin, arctan) explicitées avant de donner l'angle — jusqu'ici
  le résultat apparaissait sans jamais mentionner qu'on utilise la fonction
  réciproque à la calculatrice.
- transformations-plan-troisieme.js : formules de coordonnées (translation,
  symétrie centrale, symétrie axiale, rotation) — la rotation en particulier
  n'avait aucune explication, juste les coordonnées de l'image.
- geometrie-espace-troisieme.js : méridien = demi grand cercle, rayon d'un
  parallèle via le cosinus de la latitude (triangle rectangle centre
  Terre/centre parallèle/point), réduction de section de pyramide.
- mesures-grandeurs-troisieme.js : conversions km/h ↔ m/s (1000 m, 3600 s),
  distance réelle depuis une échelle, consommation proportionnelle (produit
  en croix).
- dossier-brevet-troisieme.js : regroupement de termes, division explicite
  dans l'isolement de x, coefficient multiplicateur, moyenne pondérée.

Chaque fichier : node --check, smoke test (8000 itérations, 0 erreur), sync
vers les deux copies (avec diff vide vérifié), commit séparé.

⚠️ Anomalie corrigée en cours de route : AUTOMATION_LOG.md n'était à jour
qu'à travers le dépôt Git (APPLI GITHUB/Sans titre) — les entrées "5e
complet" et "4e complet" de la session précédente n'avaient jamais été
synchronisées vers la copie canonique d'Application TOP ni vers le
répertoire de travail (`outputs`). Corrigé ici : les trois copies sont de
nouveau alignées avant l'ajout de cette entrée.

Build final vérifié avec succès (`npm run build` depuis la copie de travail
`outputs/reussimaths-web`, après un contournement d'une erreur EMFILE
persistante du montage réseau d'Application TOP — problème d'environnement
sandbox, sans lien avec le code ; le code source des deux copies
Application TOP est identique au caractère près à celui testé, vérifié par
diff à chaque commit).

⚠️ Le push GitHub doit être fait manuellement par Romain (pas d'identifiants
dans ce sandbox).

**Collège (6e/5e/4e/3e) intégralement audité pour la tâche #236.** Reste :
le lycée (2nde, Première non spé, Première Spé, Terminale Spé, Première
techno, Terminale STMG), explicitement reporté à plus tard par Romain.

## Lycée — 2nde intégralement auditée pour la tâche #236 (repères pédagogiques + codage sémantique)

Reprise du chantier lycée là où le collège l'avait laissé. Les 12 fichiers
de chapitres de 2nde ont été relus un par un et corrigés selon la même
méthode qu'au collège : conversion des steps en format sémantique
`{type, text}` (donnee/regle/calcul/résultat — tâche #233, jamais faite au
lycée jusqu'ici) et ajout d'un repère pédagogique (`regle`) partout où un
générateur sautait directement au résultat sans expliquer le raisonnement
intermédiaire (tâche #236).

- reviser-les-bases-seconde.js, nombres-calculs-seconde.js,
  generalites-fonctions-seconde.js, variations-fonctions-seconde.js :
  audités et corrigés (steps typés, règles ajoutées où nécessaire).
- fonctions-affines-seconde.js : calculs de tarifs et résolutions
  d'équations affines inverses complétés.
- fonctions-reference-seconde.js : QCM de reconnaissance de propriété
  (carré/cube/racine/inverse) totalement muet auparavant — réécrit avec une
  vraie règle citant les propriétés de chaque fonction de référence ;
  équations x²=a, x³=a, 1/x=a et parité également enrichies.
- reperage-configurations-seconde.js : produit en croix pour tester
  l'alignement désormais montré (calculé mais jamais affiché avant),
  réciproque de Pythagore nommée, centre de gravité, symétrique par
  rapport à l'origine, comparaison de distances via le carré.
- vecteurs-seconde.js : QCM vrai/faux sur les propriétés des vecteurs
  (6 cas, zéro explication) entièrement réécrit avec justification par cas.
- colinearite-vecteurs-seconde.js : même traitement pour le QCM vrai/faux
  sur la colinéarité (vecteur nul, droites parallèles vs confondues, etc.).
- equations-droites-seconde.js : les résolutions de systèmes par
  substitution et par combinaison linéaire affichent désormais le calcul
  intermédiaire complet au lieu d'asserter directement la solution. Cela a
  révélé un **bug latent réel** : ~3,2 % des systèmes générés avaient un
  déterminant nul (pas de solution unique), masqué jusqu'ici par un texte
  vague ("on trouve y=..., x=..."). Corrigé par des gardes de régénération
  (`while` loop) sur les deux générateurs concernés, vérifié par deux
  scripts Node.js indépendants (200k puis 500k tirages).
- informations-chiffrees-seconde.js : règle explicite sur la raison pour
  laquelle les évolutions successives se multiplient (coefficients
  multiplicateurs) et ne s'additionnent pas (taux).
- statistiques-descriptives-seconde.js : moyenne, moyenne pondérée,
  médiane (pair/impair), quartiles, écart interquartile, effectifs
  cumulés, comparaison de séries. Le QCM vrai/faux sur la signification de
  la médiane (5 cas, zéro explication) entièrement réécrit avec
  justification par cas (contre-exemple médiane ≠ moyenne, etc.).
- probabilites-echantillonnage-seconde.js : principe multiplicatif pour
  l'univers à deux épreuves, dénombrement pour les dés (36 issues),
  fréquence vs probabilité théorique, nombre de succès attendu. Le QCM
  "type d'événement" et le QCM vrai/faux sur les propriétés des
  probabilités (tous deux réduits à "C'est correct/incorrect") entièrement
  réécrits avec justification par cas.
- exercices-fin-annee-seconde.js : synthèse transversale reprenant tous
  les thèmes de l'année — mêmes corrections appliquées (division explicite
  dans la résolution d'équation affine, règle du signe pour le sens de
  variation, nombre d'antécédents par la fonction carré selon le signe,
  multiplication des coefficients pour les évolutions successives, etc.).

Chaque fichier : node --check, smoke test (8000 itérations, 0 erreur), sync
vers les deux copies Application TOP (avec diff vide vérifié), commit
séparé (12 commits au total).

Build final vérifié avec succès (`npm run build` depuis le dépôt Git
`APPLI GITHUB/Sans titre`).

⚠️ Le push GitHub doit être fait manuellement par Romain (pas d'identifiants
dans ce sandbox).

**2nde intégralement auditée pour la tâche #236.** Reste : Première non
spé, Première Spé, Terminale Spé, Première techno, Terminale STMG.

## Lycée — Première non spé intégralement auditée pour la tâche #236 (repères pédagogiques + codage sémantique)

Suite de l'audit lycée entamé sur la 2nde. Les 9 fichiers de chapitres de
Première (enseignement mathématique, non spécialité) ont été audités et
corrigés selon la même méthode (conversion des steps legacy vers le format
sémantique {type, text} + ajout d'un repère pédagogique — étape "règle" —
partout où un raccourci silencieux existait) :

- reviser-les-bases-premiere-non-spe.js : lacune sévère sur le coefficient
  multiplicateur (steps affichait uniquement le résultat, sans la formule
  1 ± t/100) corrigée.
- analyse-information-chiffree-premiere-non-spe.js et
  statistique-probabilites-premiere-non-spe.js : lacune sévère récurrente
  sur la case manquante d'un tableau croisé d'effectifs (le résultat était
  affiché sans dérivation) corrigée dans les deux fichiers avec la même
  règle (somme des trois cases connues + case manquante = total général) ;
  distinction explicite proportion globale / proportion conditionnelle ;
  écart en points de pourcentage vs taux d'évolution (à ne pas confondre) ;
  QCM "qualifier une corrélation" et "pourcentage ou point de pourcentage"
  entièrement réécrits avec justification par cas.
- croissance-lineaire-premiere-non-spe.js : **bug mathématique réel
  découvert et corrigé** dans la résolution d'inéquation-seuil — le sens de
  l'inégalité n'était pas inversé lors de la division par une raison
  négative (suite décroissante), ce qui aurait affiché une algèbre fausse
  une fois les étapes détaillées ajoutées. Vérifié par un script Node.js
  (200 000 tirages, 0 écart) avant correction. Documenté dans le message de
  commit dédié. QCM vrai/faux sur les suites réécrit avec justification par
  cas.
- croissance-exponentielle-premiere-non-spe.js : lacune sévère sur le
  calcul de la raison d'une suite géométrique modélisant une évolution
  (steps affichait juste `q = résultat`) corrigée ; distinction
  raison = quotient (et non différence) systématiquement rappelée ; QCM
  vrai/faux sur les suites géométriques réécrit avec justification par cas.
- variations-instantanees-premiere-non-spe.js : QCM vrai/faux sur le nombre
  dérivé (5 cas, zéro explication) entièrement réécrit, notamment la
  confusion classique f(a) vs f'(a) ; règles ajoutées pour la comparaison
  de nombres dérivés et la dérivation de l'ordonnée à l'origine d'une
  tangente.
- variations-globales-premiere-non-spe.js : QCM vrai/faux sur la fonction
  dérivée et les variations réécrit (5 cas), notamment le contre-exemple
  x³ pour "f'(a)=0 n'implique pas toujours un extremum" ; règle sur la
  dérivation terme à terme d'un trinôme ; piège des deux solutions opposées
  d'une équation x²=k pour les tangentes horizontales.
- exercices-rituels-premiere-non-spe.js : lacune sévère sur le coefficient
  multiplicateur (même correction que reviser-les-bases) ; règles ajoutées
  pour les 6 rappels de compétences clés de l'année (tableaux croisés,
  probabilités composées, suites arithmétiques et géométriques, nombre
  dérivé, fonction dérivée).
- preparation-eam-premiere-non-spe.js : fichier particulier (sujets
  officiels de la session 2026 de l'EAM, déjà bien détaillés dans leurs
  corrigés) — audit ciblé plutôt que conversion systématique : ajout de
  règles uniquement là où un raccourci silencieux existait (évolutions
  successives, équation produit nul, isoler une variable dans une formule
  physique, dénominateur d'une probabilité conditionnelle = effectif du
  sous-groupe et non du total, évènements complémentaires sachant A, seuil
  sur une suite arithmétique avec arrondi à l'entier supérieur, dérivée
  d'un trinôme du troisième degré, identités remarquables) ; correction
  d'une lacune sur les générateurs originaux de suites (arithmétique et
  géométrique) qui affichaient la réponse sans la substitution numérique.

Chaque fichier : node --check, smoke test (8000 à 12000 itérations selon le
fichier, 0 erreur), sync vers les deux copies Application TOP (avec diff
vide vérifié), commit séparé (9 commits au total).

Build final vérifié avec succès (`npm run build` depuis le dépôt Git
`APPLI GITHUB/Sans titre`).

⚠️ Le push GitHub doit être fait manuellement par Romain (pas d'identifiants
dans ce sandbox).

**Première non spé intégralement auditée pour la tâche #236.** Reste :
Première Spé, Terminale Spé, Première techno, Terminale STMG.

## Lycée — Première Spé intégralement auditée pour la tâche #236 (repères pédagogiques + codage sémantique)

12 chapitres audités (le 12e, second-degre.js, était déjà entièrement
conforme depuis une session antérieure — vérifié via grep, aucune édition
nécessaire) :

- reviser-les-bases-premiere-spe.js : lacune sévère sur le coefficient
  multiplicateur (steps: [fr(answer)]) ; règles ajoutées pour l'identité
  remarquable, le sens de l'inégalité selon le signe du diviseur, la
  formule générale de la norme d'un vecteur.
- second-degre.js : déjà conforme, aucune modification.
- suites-numeriques-premiere-spe.js : ajout d'une règle distinguant la
  raison arithmétique (différence de deux termes consécutifs) de la
  raison géométrique (quotient, pas différence).
- derivation-premiere-spe.js : lacune sévère sur le QCM vrai/faux
  dérivation (4 cas réécrits avec justification : point anguleux de la
  valeur absolue, tangente verticale de la racine carrée, existence de la
  tangente, dérivée d'une constante) ; label « formule de référence à
  connaître » ajouté sur les dérivées de 1/x, racine de x, produit et
  quotient.
- variations-courbes-premiere-spe.js : lacune sévère sur 2 QCM sans
  aucune explication (traduction géométrique parité/symétrie ; vrai/faux
  variations avec contre-exemple x³ pour « f'(a)=0 sans extremum » et
  correction de la confusion parité/symétrie-origine).
- fonction-exponentielle-premiere-spe.js : lacune sévère sur le QCM de
  modélisation croissance/décroissance (distinction du signe de k dans
  e^{kt}) ; label « propriété/formule de référence à connaître » sur les
  propriétés algébriques et les dérivées.
- trigonometrie-premiere-spe.js : aucune lacune sévère, codage sémantique
  systématique avec label « valeur remarquable / formule de référence à
  connaître » sur les valeurs de cos/sin et les formules d'angles associés.
- vecteurs-produit-scalaire-premiere-spe.js : lacune sévère sur le
  vrai/faux (4 cas réécrits, dont contre-exemple d'un angle obtus pour
  « produit scalaire toujours positif ») ; label « formule de référence »
  sur Al-Kashi, développement de normes, bilinéarité.
- geometrie-reperee-premiere-spe.js : lacune sévère sur le vrai/faux
  (4 cas réécrits, dont la correction du signe -D/2 pour l'abscisse du
  centre d'un cercle, erreur classique).
- probabilites-conditionnelles-premiere-spe.js : lacune sévère sur le
  vrai/faux (4 cas réécrits, dont la correction « incompatible n'implique
  pas indépendant », avec démonstration).
- variables-aleatoires-premiere-spe.js : 2 lacunes sévères (interprétation
  des notations P(X=a) vs P(X≤a) sans justification ; vrai/faux avec
  correction du signe dans la formule de König-Huygens).
- preparation-bac-premiere-spe.js : lacune sévère sur le QCM coefficient
  multiplicateur (distinction hausse/baisse selon coefficient >1 ou <1) ;
  rappel de la distinction dénominateur pour les probabilités
  conditionnelles (sous-groupe connu, pas le total).

Chaque fichier : node --check, smoke test 8000 itérations (4 paliers),
0 erreur, sync vers les deux copies Application TOP (diff vide vérifié),
commit séparé (11 commits, second-degre.js n'a nécessité aucun commit).

Build final vérifié avec succès (`npm run build` depuis le dépôt Git
`APPLI GITHUB/Sans titre`, après nettoyage du cache Vite qui provoquait une
erreur de résolution transitoire).

⚠️ Le push GitHub doit être fait manuellement par Romain (pas d'identifiants
dans ce sandbox).

**Première Spé intégralement auditée pour la tâche #236.** Reste :
Terminale Spé, Première techno, Terminale STMG.

## 2026-08-04 — Terminale Spé : repères pédagogiques + codage sémantique (tâche #236 / #233)

Audit complet des 16 chapitres de Terminale Spécialité, en appliquant la
même méthode que pour les niveaux précédents : conversion des `steps`
en objets typés `{ type, text }` (donnee/regle/calcul/resultat), ajout
d'un repère pédagogique (`regle`) partout où un générateur faisait un
saut numérique ou conceptuel sans justification, et réécriture complète
des générateurs à lacune sévère (QCM vrai/faux ou d'interprétation qui se
contentaient de répéter la réponse sans aucune explication).

- combinatoire-denombrement-terminale-spe.js
- vecteurs-droites-plans-espace-terminale-spe.js
- orthogonalite-distances-espace-terminale-spe.js
- suites-terminale-spe.js
- limites-fonctions-terminale-spe.js : lacune sévère sur le vrai/faux des
  limites (contre-exemple de sin(x)/x qui croise son asymptote horizontale
  une infinité de fois) et sur le QCM contre-exemple (∞-∞, inégalité
  stricte qui devient égalité à la limite).
- continuite-terminale-spe.js : 3 lacunes sévères (continuité des
  fonctions usuelles avec restrictions de domaine, opérations sur les
  fonctions continues avec contre-exemple de discontinuité au
  dénominateur, fonctions continues non dérivables avec explication
  tangente verticale / point anguleux).
- complements-derivation-terminale-spe.js : lacune sévère sur le
  vrai/faux convexité (corrections des confusions convexe⟹f' croissante
  et concave⟹f' décroissante).
- logarithme-neperien-terminale-spe.js : 2 lacunes sévères (valeurs
  remarquables du ln avec correction ln(e²)=2 et ln(0) non défini ;
  propriétés algébriques avec correction ln(a²)=2ln(|a|), restriction de
  domaine).
- fonctions-trigonometriques-terminale-spe.js : 3 lacunes sévères
  (parité avec 8 cas justifiés par parité de produit/somme, formules de
  réduction, propriétés générales avec identité cos²+sin²=1).
- primitives-equations-differentielles-terminale-spe.js : 2 lacunes
  sévères (vrai/faux équations différentielles, vrai/faux primitives avec
  justification F-G constante).
- calcul-integral-terminale-spe.js : lacune sévère sur le vrai/faux
  intégrales (contre-exemple V(X-Y)=V(X)+V(Y) même pour une différence,
  correction produit d'intégrales).
- loi-binomiale-terminale-spe.js : 2 lacunes sévères (identifier un
  schéma de succès avec correction tirage sans remise, vrai/faux
  propriétés avec correction de l'inversion d'exposants dans P(X=k)).
- sommes-variables-aleatoires-terminale-spe.js : 2 lacunes sévères
  (vrai/faux sommes de variables avec correction V(X-Y)=V(X)+V(Y), vrai/
  faux variance affine avec correction de la constante b).
- loi-grands-nombres-terminale-spe.js : 3 lacunes sévères (vrai/faux loi
  des grands nombres, condition d'application de Markov, vrai/faux
  inégalités probabilistes).
- exercices-transversaux-terminale-spe.js : 3 lacunes sévères (limite de
  suite géométrique selon la raison, forme indéterminée, vrai/faux
  transversal avec correction convexité/tangentes).

Chaque fichier : node --check, smoke test 8000 itérations (4 paliers),
0 erreur, sync vers les deux copies Application TOP (diff vide vérifié),
16 commits séparés dans le dépôt `APPLI GITHUB/Sans titre`.

Build final vérifié avec succès (`npm run build` depuis le dépôt Git
`APPLI GITHUB/Sans titre`).

⚠️ Le push GitHub doit être fait manuellement par Romain (pas d'identifiants
dans ce sandbox).

**Terminale Spé intégralement auditée pour la tâche #236.** Reste :
Première techno, Terminale STMG.

## 2026-08-04 — Première technologique : repères pédagogiques + codage sémantique (tâche #236 / #233)

Audit complet des 9 chapitres de Première technologique, en appliquant la
même méthode que pour les niveaux précédents : conversion des `steps`
en objets typés `{ type, text }` (donnee/regle/calcul/resultat), ajout
d'un repère pédagogique (`regle`) partout où un générateur faisait un
saut numérique ou conceptuel sans justification, et réécriture complète
des générateurs à lacune sévère (QCM vrai/faux ou d'interprétation qui se
contentaient de répéter la réponse sans aucune explication).

- derivation-premiere-techno.js : lacune sévère sur le QCM sécante/tangente
  (4 cas, justification de la définition de chacune).
- epreuves-independantes-premiere-techno.js : lacune sévère sur le QCM
  épreuve de Bernoulli (5 cas justifiés par le nombre d'issues possibles).
- fonctions-second-degre-premiere-techno.js : repères pédagogiques ajoutés
  sur la factorisation, la lecture graphique et les fonctions de référence
  (aucune lacune sévère, uniquement des sauts numériques).
- preparation-eam-premiere-techno.js (fichier le plus dense, 28
  générateurs) : réécriture complète des 4 QCM automatismes issus des
  sujets officiels (30 items au total, chacun avec une explication propre)
  et de tous les autres générateurs (suites, fonctions, probabilités,
  originaux) avec repères pédagogiques.
- probabilites-conditionnelles-premiere-techno.js : lacune sévère sur le
  vrai/faux indépendance et partitions (5 cas, correction des confusions
  classiques : incompatible ≠ indépendant, P(A∩B)=P(A)×P(B) et non une
  somme).
- reviser-les-bases-premiere-techno.js : lacune sévère sur le coefficient
  multiplicateur (steps ne faisait que répéter la réponse) ; repères
  ajoutés sur les identités remarquables, équations/inéquations,
  fonctions de référence.
- statistiques-deux-variables-premiere-techno.js : lacune sévère sur le
  QCM pertinence d'un ajustement affine (2 cas justifiés) ; distinction
  interpolation/extrapolation explicitée.
- suites-numeriques-premiere-techno.js : repères de référence ajoutés pour
  les formules de raison (r = u_{n+1}-u_n, q = u_{n+1}/u_n) ; les
  générateurs de sens de variation et de modélisation avaient déjà de
  bonnes explications, converties au format typé.
- variables-aleatoires-premiere-techno.js : lacune sévère sur le QCM
  reconnaissance d'une loi de Bernoulli (4 cas justifiés par le nombre de
  valeurs possibles de X).

Chaque fichier : node --check, smoke test 8000 itérations (4 paliers ou
générique selon le fichier), 0 erreur, sync vers les deux copies
Application TOP (diff vide vérifié), 9 commits séparés dans le dépôt
`APPLI GITHUB/Sans titre`.

Build final vérifié avec succès (`npm run build` depuis le dépôt Git
`APPLI GITHUB/Sans titre`).

⚠️ Le push GitHub doit être fait manuellement par Romain (pas d'identifiants
dans ce sandbox).

**Première technologique intégralement auditée pour la tâche #236.** Reste :
Terminale STMG.

## 2026-08-04 — Terminale technologique (STMG) : repères pédagogiques + codage sémantique (tâche #236 / #233)

Audit complet des 7 chapitres de Terminale technologique (STMG), dernier
niveau du lycée, avec la même méthode que pour tous les niveaux
précédents : conversion des `steps` en objets typés `{ type, text }`
(donnee/regle/calcul/resultat), ajout d'un repère pédagogique (`regle`)
partout où un générateur faisait un saut numérique ou conceptuel sans
justification, et réécriture complète des générateurs à lacune sévère
(QCM qui se contentaient de répéter la réponse sans aucune explication).

- fonctions-exponentielles-terminale-techno.js : repères pédagogiques
  ajoutés (sens de variation, allure de courbe, comparaison de bases,
  taux d'évolution moyen) ; aucune lacune sévère.
- logarithme-decimal-terminale-techno.js : repère ajouté sur la
  résolution de 10^x = b (définition de log) et le sens de variation ;
  aucune lacune sévère.
- probabilites-conditionnelles-terminale-techno.js : lacune sévère sur le
  QCM d'interprétation des pondérations d'arbre (2 cas justifiés :
  pondération sur une branche partant d'un nœud intermédiaire =
  probabilité conditionnelle, vs racine = probabilité simple) ; repères
  ajoutés sur la partition à 3+ évènements, la formule des probabilités
  totales, les pondérations complémentaires, les chemins de l'arbre.
- reviser-les-bases-terminale-techno.js (chapitre gratuit) : lacune
  sévère sur le coefficient multiplicateur (steps ne faisait que répéter
  la réponse) ; repères ajoutés sur les suites (formules de référence),
  la lecture de tableau croisé, l'espérance.
- statistiques-deux-variables-terminale-techno.js : lacune sévère sur 2
  QCM (choisir le bon changement de variable selon la forme du nuage ;
  reconnaître pourquoi un ajustement affine direct ne convient pas) —
  chacun avec justification mathématique du critère de choix.
- suites-terminale-techno.js : lacune sévère sur le QCM de reconnaissance
  d'une situation de versements réguliers (suite arithmétique vs
  géométrique selon la présence d'intérêts composés) ; repères de
  référence ajoutés pour les formules de terme général, moyennes,
  sommes ; preuves de suites consécutives enrichies d'un critère
  explicite.
- variables-aleatoires-terminale-techno.js : lacune sévère sur le QCM de
  reconnaissance d'une loi binomiale (3 cas justifiés : remise/indépendance
  vs tirage sans remise) ; repères ajoutés sur les cas particuliers
  P(X=0)/P(X=n) (un seul chemin de l'arbre), l'union d'évènements
  incompatibles, l'espérance d'une variable discrète quelconque.

automatismes-terminale-techno.js exclu de cet audit (précédent établi :
les fichiers automatismes-* ne rentrent pas dans le périmètre de la
tâche #236 à aucun niveau).

Chaque fichier : node --check, smoke test 8000 itérations (4 paliers ou
générique selon le fichier), 0 erreur, sync vers les deux copies
Application TOP (diff vide vérifié), 7 commits séparés dans le dépôt
`APPLI GITHUB/Sans titre`.

Build final vérifié avec succès (`npm run build` depuis le dépôt Git
`APPLI GITHUB/Sans titre`) — un premier essai a échoué avec une erreur de
résolution de module transitoire (`@supabase/auth-js`), résolue par un
simple nouvel essai (le fichier existait bien sur disque).

⚠️ Le push GitHub doit être fait manuellement par Romain (pas
d'identifiants dans ce sandbox).

**Terminale technologique (STMG) intégralement auditée pour la tâche
#236. Le lycée est désormais entièrement audité : 2nde, Première non
spé, Première Spé, Terminale Spé, Première techno, Terminale STMG.**


## 2026-08-04 (suite 4) — 5 fonctionnalités demandées par Romain : mode Réviser visible, Bilan de la semaine, Espace enseignant, Pack Examen expliqué, fuite de réponse en Découverte corrigée

Romain a demandé 5 choses dans un seul message, à traiter dans l'ordre de
mon choix, avec questions de clarification si besoin. Deux questions
posées (accès au bilan parent, accès au mode prof) — Romain a choisi à
chaque fois l'option la plus simple : page in-app uniquement pour le
bilan (pas d'email), aucune connexion requise pour le mode prof.

**1. Fuite de réponse en mode Découverte (tâche #293).** Le mécanisme de
masquage de la dernière étape se basait sur le tag `type: "resultat"` du
dernier step — or un script d'analyse dynamique (génération ~40x par
chapitre, tous chapitres) a montré que 125 fichiers chapitres sur 132 ont
au moins un générateur dont le dernier step n'est PAS tagué "resultat"
(calcul/regle/donnee/chaîne simple selon les cas). Un correctif fichier
par fichier était irréaliste. Correctif architectural dans
`ChapterRunner.jsx` : on masque désormais TOUJOURS le dernier step de
`exercise.steps`, quel que soit son type, révélé par le bouton existant.

**2. Pack Examen enfin expliqué (tâche #294).** Ajout d'un paragraphe
dans `PackExamenChoice.jsx` (au moment du choix du niveau) et d'un bloc
avant les boutons d'abonnement dans `Account.jsx` détaillant ce que
débloque chaque offre (abonnement complet vs Pack Examen). La carte
"Pack Examen — niveau choisi" (après le choix) liste maintenant
explicitement : le chapitre de préparation à l'examen, les Automatismes
illimités, et les 2 chapitres bonus choisis.

**3. Mode Réviser plus visible (tâche #295).** Nouveau composant
`ReviserCard.jsx` (carte verte, icône dédiée, badge rouge avec le nombre
de compétences dues si > 0, via le nouveau hook `useDueSkillsCount.js`).
Remplace l'ancien lien texte discret sur `CycleSelect.jsx`, `CycleLevels.jsx`,
`LevelSelect.jsx` et `Account.jsx`.

**4. Bilan de la semaine (tâches #296, #297, #298).** Nouvelle page
`/bilan`, pensée pour être consultée par un parent avec l'enfant (pas de
compte parent séparé, l'app reste anonyme — voir schema.sql). Contenu :
temps passé (graphique en barres sur 7 jours), taux de réussite,
notions travaillées, priorités pour la semaine suivante. Nécessite 2
nouvelles tables SQL (`practice_time`, `daily_activity`) + un hook de
"heartbeat" (`usePracticeHeartbeat.js`, 20s d'intervalle, en pause si
l'onglet est en arrière-plan via la Page Visibility API) branché dans
les 3 lecteurs d'exercices, et un enregistrement quotidien
attempts/correct ajouté dans `useSkillTracking.recordAttempt` (les
compteurs `skill_mastery` existants sont cumulatifs à vie, insuffisants
seuls pour un taux de réussite hebdomadaire fiable).

⚠️ **Migration SQL à exécuter manuellement par Romain** dans l'éditeur
SQL Supabase avant que le temps passé et le bilan ne fonctionnent
réellement (tables `practice_time` et `daily_activity`, voir la fin de
`supabase/schema.sql`) — aucun accès direct à la base depuis ce sandbox.

**5. Espace enseignant gratuit (tâche #299).** Nouvelle page publique
`/enseignant` (aucune connexion requise), lien discret "Espace
enseignant" ajouté en bas de la page d'accueil. Réutilise TEL QUEL les
chapitres `automatismes-*.js` existants (aucun contenu dupliqué,
`chapters.filter(c => c.meta.isAutomatismes)`) : l'enseignant choisit un
niveau, répartit exactement 5 questions entre les thèmes du chapitre
(+/- par thème, ex. 2 multiplication + 1 géométrie + 2 pourcentages),
puis un diaporama plein écran (police large pensée pour une projection,
bouton plein écran) présente les questions une par une SANS réponse
visible (l'enseignant avance avec "Suivant") ; à la fin, un écran unique
affiche les 5 corrections complètes (réponse + étapes de méthode).
Aucune sauvegarde, aucun score, usage éphémère en classe.

Build vérifié avec succès (`npx vite build` puis `npm run build` depuis
le dépôt Git `APPLI GITHUB/Sans titre`). Tous les fichiers synchronisés
(diff vide vérifié) vers les deux copies Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain (pas
d'identifiants dans ce sandbox).


## 2026-08-04 (suite 5) — Mascotte dynamique (4 logos dessinés par Romain)

Romain a retravaillé le logo de l'app en 4 versions et voulait qu'elles
soient utilisées selon la situation de l'utilisateur : triste après plus
d'une semaine sans pratique, une version pour le contenu gratuit, une
pour le Pack Examen, une avec des étoiles pour l'abonnement complet.

Aucun logo n'était jusqu'ici affiché DANS l'app (seulement l'icône PWA
statique utilisée pour l'écran d'accueil du téléphone une fois l'app
installée — techniquement impossible à faire varier par utilisateur,
puisque fixée à l'installation). La mascotte dynamique est donc affichée
à deux endroits bien visibles à l'intérieur de l'app : en haut de la
page d'accueil (`CycleSelect.jsx`) et sur la carte de profil de
`Account.jsx`.

Nouveau composant `Mascot.jsx` + hook `useLastActivity.js` : ce dernier
lit la date de la dernière ligne de `daily_activity` (alimentée à chaque
tentative d'exercice, voir tâche #298) plutôt que
`user_login_stats.last_login_at`, qui ne se met à jour qu'à une vraie
reconnexion Supabase et resterait figé pendant des mois pour un
utilisateur avec une session déjà persistée — donc peu fiable pour
détecter une inactivité réelle.

Logique de priorité dans `Mascot.jsx` : plus de 7 jours sans pratique →
version triste (même pour un abonné complet, pour l'inciter à revenir) ;
sinon abonnement complet actif → version étoilée ; sinon Pack Examen actif
→ version Pack Examen ; sinon (pas connecté ou sans abonnement) → version
gratuite par défaut.

Les 4 images fournies par Romain ont été redimensionnées (max 400px,
optimisées) : ~2 Mo au total à l'origine, ~430 Ko après optimisation —
seule l'image réellement affichée est chargée par le navigateur (URL
séparée par image via Vite, pas d'inlining).

Build vérifié avec succès (`npx vite build` puis `npm run build` depuis
le dépôt Git `APPLI GITHUB/Sans titre`). Fichiers synchronisés (diff vide
vérifié) vers les deux copies Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain (pas
d'identifiants dans ce sandbox).


## 2026-08-04 (suite 6) — Icône PWA (écran d'accueil) remplacée par la mascotte full access

Romain a demandé de garder la version "full access" (avec étoiles) de la
nouvelle mascotte comme icône fixe de l'app sur l'écran d'accueil du
téléphone — contrairement à la mascotte in-app (tâche #301) qui varie par
utilisateur, cette icône PWA est unique et figée pour tout le monde (pas
de personnalisation possible côté OS), donc c'est la version la plus
"aboutie" (étoiles, abonnement complet) qui a été choisie.

Régénéré à partir de l'image source haute résolution (pas de la version
déjà réduite à 400px utilisée in-app) : aplati sur fond marine uni
(#1B2A4A, plus de transparence dans les coins), recadré en carré, puis
exporté aux 4 tailles attendues par public/icons/ : favicon-32.png (32px),
icon-192.png, icon-512.png (icônes standards, contenu plein cadre) et
icon-512-maskable.png (zone de sécurité ~78% pour ne pas être rogné par
un masque circulaire/squircle Android).

Build vérifié avec succès. Fichiers synchronisés (diff vide vérifié) vers
les deux copies Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain (pas
d'identifiants dans ce sandbox). Sur les téléphones où l'app est DÉJÀ
installée sur l'écran d'accueil, l'icône ne se mettra pas à jour
automatiquement (comportement standard des PWA) — il faudra retirer puis
réajouter l'app à l'écran d'accueil pour voir la nouvelle icône.


## 2026-08-04 (suite 7) — Parrainage : masquer le /5 pour les abonnés complets

Romain a fait remarquer qu'afficher "0/5 amis" n'a pas de sens pour un
abonné complet : le palier des 5 filleuls sert à débloquer un chapitre
bonus, ce qui est déjà inutile puisqu'il a accès à tout. Pour ce palier,
la récompense est différente (1 mois offert par filleul qui s'abonne, pas
de seuil de 5). Account.jsx affiche désormais simplement "Parrainage — X
ami(s)" pour les abonnés complets, et garde "Parrainage — X/5 amis" pour
les autres (gratuit / Pack Examen), qui progressent bien vers un seuil de
5.

Build vérifié avec succès. Fichier synchronisé (diff vide vérifié) vers
les deux copies Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain (pas
d'identifiants dans ce sandbox).


## 2026-08-04 (suite 8) — Résiliation d'abonnement en libre-service

Romain a demandé un lien dans Mon compte pour résilier facilement,
l'utilisateur gardant l'accès jusqu'à la fin de la période déjà payée
(mois en cours ou 3 mois du Pack Examen).

Ne concerne en pratique que le plan "mensuel" (abonnement Stripe
classique, renouvellement automatique) : le Pack Examen ("special_examen")
est un paiement UNIQUE (mode Stripe "payment", voir
create-checkout-session.js), déjà non reconductible par nature — il n'y a
donc rien à résilier dessus côté Stripe, l'accès s'arrête déjà tout seul à
+3 mois (déjà affiché dans Account.jsx : "Accès jusqu'au [date] (offre non
reconductible)").

Nouvelle colonne subscriptions.cancel_at_period_end (SQL, migration
additive comme les précédentes). Nouvel endpoint POST
/api/cancel-subscription (body { userId, action: "cancel" | "reactivate" })
: retrouve l'abonnement Stripe actif du client via son stripe_customer_id
déjà enregistré, appelle
stripe.subscriptions.update(id, { cancel_at_period_end }) — PAS
stripe.subscriptions.cancel() qui couperait l'accès immédiatement — puis
répercute le flag en base. api/stripe-webhook.js persiste aussi ce flag
sur customer.subscription.updated/deleted, pour rester synchro même si
l'abonnement est modifié directement dans le dashboard Stripe plutôt que
depuis l'app.

Account.jsx : pour un abonné complet (plan mensuel, pas admin), nouvelle
carte affichant soit "Renouvellement automatique le [date]" + bouton
"Résilier mon abonnement" (avec confirmation inline avant l'appel API),
soit, si déjà résilié, "Résiliation prévue — accès jusqu'au [date]" +
bouton "Annuler la résiliation" (permet de revenir en arrière tant que la
période n'est pas terminée).

Build vérifié avec succès (`npx vite build` puis `npm run build` depuis
le dépôt Git `APPLI GITHUB/Sans titre`) + `node --check` sur les 3
fonctions serverless Stripe (api/cancel-subscription.js,
api/stripe-webhook.js, api/create-checkout-session.js), syntaxe ESM
valide. Fichiers synchronisés (diff vide vérifié) vers les deux copies
Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain (pas
d'identifiants dans ce sandbox), ET la migration SQL ci-dessous doit être
collée dans l'éditeur SQL Supabase avant que le bouton de résiliation ne
fonctionne réellement (sinon l'écriture de cancel_at_period_end échouera,
colonne inexistante) :

```sql
alter table public.subscriptions add column if not exists cancel_at_period_end boolean not null default false;
```


## 2026-08-04 (suite 9) — Correction : la carte de résiliation restait invisible en préviz admin "mensuel"

Romain a signalé ne pas voir la carte de résiliation en testant via
"prévisualisation abonnement complet" dans le panneau admin. Cause :
buildPreviewSubscription() (src/lib/access.js) simule un abonnement
"mensuel" avec current_period_end: null (aucune date réelle à
simuler à l'origine) — or la nouvelle carte de résiliation
(Account.jsx, tâche #302) n'affiche rien tant que current_period_end
n'est pas renseigné (il lui faut une date à afficher). Corrigé en
simulant une date réaliste (+1 mois) pour la préviz "mensuel", comme
c'était déjà fait pour la préviz "special_examen" (+3 mois). Vérifié
qu'aucune autre logique ne dépendait de cette valeur nulle
(planIsCurrentlyValid traite l'absence de date comme "non expiré",
donc aucun effet de bord sur isFullAccessSubscription).

⚠️ En préviz, cliquer "Confirmer" sur la résiliation produira une
erreur attendue ("Rien à résilier") : l'API cancel-subscription
travaille sur la VRAIE ligne subscriptions de Romain en base (compte
admin, sans abonnement Stripe réel derrière), pas sur l'abonnement
simulé côté client. La préviz permet de vérifier l'affichage/le texte,
pas le bout en bout — il faudra un vrai compte abonné mensuel pour ça.

Build vérifié avec succès. Fichier synchronisé (diff vide vérifié) vers
les deux copies Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain (pas
d'identifiants dans ce sandbox).


## 2026-08-05 — Accès classe gratuit pour les élèves de Terminale technologique de Romain

Romain veut offrir un accès complet et gratuit à toute la partie Terminale
technologique à ses propres élèves, pour faire connaître l'app et avoir des
retours. Deux questions posées : où saisir le code (réponse : depuis Mon
compte, une fois connecté normalement) et suivi admin (réponse : oui, code
stocké en base + visible dans /admin). Romain a aussi confirmé explicitement
que cet accès doit être entièrement gratuit — pas de ligne Stripe derrière.

Chaque élève garde un compte individuel classique (connexion Google/Apple,
pseudo, progression propre — inchangé) ; le code ne sert qu'à débloquer un
niveau entier gratuitement dessus, ce n'est pas un mot de passe de connexion.

Nouvelle table `class_access_codes` (code, level, label) — RLS activé SANS
aucune policy select : les codes ne sont donc jamais lisibles depuis le
navigateur, seule la fonction SECURITY DEFINER redeem_class_access_code peut
les consulter. Nouvelle colonne subscriptions.class_access_level,
INDÉPENDANTE de plan/status (pas de date d'expiration, pas de conflit avec un
abonnement payant existant). Code seedé : 'soleil' -> niveau
'terminale-techno'. D'autres codes pourront être ajoutés plus tard (autres
classes/niveaux) par simple INSERT SQL, sans toucher au code de l'app.

src/lib/access.js : nouvelle fonction isClassAccessSubscription() +
intégration dans canAccessChapter() (accès à tous les chapitres du niveau
débloqué) et hasUnlimitedQuota() (Automatismes illimités pour ce niveau,
comme le Pack Examen mais sans limite de temps).

src/pages/Account.jsx : lien discret "Code d'accès professeur" (visible tant
que l'élève n'a pas encore de class_access_level), formulaire de saisie avec
message d'erreur si code invalide, et une fois validé une ligne de statut
"Accès classe — Terminale technologique (offert par ton professeur)".

src/pages/AdminPreview.jsx : le tableau de bord /admin affiche maintenant
"Accès classe (Terminale technologique)" comme palier à part entière pour
les élèves qui ont redeem le code, avec un comptage automatique dans le
résumé en haut (généralisé pour compter n'importe quel palier, pas seulement
les 3 historiques).

Build vérifié avec succès (`npx vite build` puis `npm run build` depuis le
dépôt Git `APPLI GITHUB/Sans titre` — une erreur transitoire EMFILE liée au
sandbox, résolue par un nouvel essai, sans lien avec le contenu). Fichiers
synchronisés (diff vide vérifié) vers les deux copies Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain (pas d'identifiants
dans ce sandbox), ET la migration SQL ci-dessous doit être collée dans
l'éditeur SQL Supabase avant que le code d'accès ne fonctionne réellement :

```sql
create table if not exists public.class_access_codes (
  code text primary key,
  level text not null,
  label text,
  created_at timestamptz not null default now()
);
alter table public.class_access_codes enable row level security;

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

insert into public.class_access_codes (code, level, label)
values ('soleil', 'terminale-techno', 'Terminale technologique — classe de Romain')
on conflict (code) do nothing;
```
## 2026-08-05 (suite) — Jeu "Course aux tables" + nouvel onglet Jeux

Romain veut intégrer des jeux pour travailler les maths autrement, en
commençant par une course entre 4 animaux où chaque bonne/mauvaise réponse à
une table de multiplication (1 à 10) accélère ou fait chuter le personnage.
Objectif : répondre à 10 questions en 10s pour finir 1er, 12s pour 2e, 14s
pour 3e, au-delà c'est perdu.

Faisabilité confirmée, 4 questions posées avant construction (toutes
tranchées en faveur de l'option recommandée) : erreur = pénalité de temps
fixe (1,5s) puis question suivante (pas de nouvelle tentative sur la même
question) ; adversaires = repères de rythme fixes arrivant pile à 10s/12s/14s
(pas d'IA simulée) ; saisie = clavier numérique natif du téléphone (comme le
reste de l'app), pas de QCM ; accès = gratuit pour tout le monde, sans
connexion requise (contrairement au reste de l'app).

Nouvel onglet "Jeux" (src/pages/Jeux.jsx) ajouté à l'accueil au même niveau
que Collège/Lycée (CycleSelect.jsx) — page hub prévue pour accueillir
d'autres jeux plus tard, un seul pour l'instant.

src/pages/CourseTables.jsx (nouveau) : logique du jeu. Le score (classement)
est un calcul exact du temps réel écoulé + pénalités cumulées, conforme à la
règle de Romain. L'animation de course, elle, distingue volontairement deux
logiques : le joueur avance par paliers discrets (1 par question, lissé par
une transition CSS) tandis que les 3 adversaires avancent à vitesse
constante vers leurs temps d'arrivée fixes (10s/12s/14s) — un modèle
"position du joueur = temps réel moins pénalité" aurait paradoxalement fait
avancer le personnage en cas d'erreur, donc écarté au profit de ce modèle
hybride qui donne la sensation de course voulue sans fausser le classement.

Aucun compte ni Supabase requis : seul le meilleur temps personnel est gardé,
en local (localStorage) sur l'appareil.

Deux bugs auto-détectés et corrigés avant livraison : (1) le temps final
était mesuré après le délai d'animation de 500ms au lieu du moment réel de
la dernière réponse (aurait pénalisé injustement les temps limites) ; (2) le
composant d'affichage de la piste était défini à l'intérieur du composant
principal, ce qui aurait cassé l'animation CSS (React le remonte entièrement
à chaque rendu) — extrait au niveau du module pour corriger.

src/App.jsx : routes /jeux et /jeux/course-tables ajoutées.

Build vérifié avec succès (`npx vite build` puis `npm run build` depuis le
dépôt Git `APPLI GITHUB/Sans titre` — erreurs transitoires EMFILE et
résolution `@supabase/auth-js` liées au sandbox, résolues après plusieurs
essais, sans lien avec le contenu). Fichiers synchronisés (diff vide
vérifié) vers les deux copies Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain (pas d'identifiants
dans ce sandbox). Aucune migration SQL cette fois : la fonctionnalité est
entièrement côté client (pas de nouvelle table ni colonne Supabase).


## 2026-08-05 (suite 2) — Course aux tables : QCM + 3 niveaux de difficulté

Retour de Romain après test : le clavier numérique (écrire + valider) est
trop lent pour tenir des temps de 10/12/14s, ce qui rendait le jeu quasi
imbattable. Passage à un QCM à 4 réponses (1 seule bonne, 3 distracteurs
plausibles générés à partir d'erreurs de table classiques : ±a, ±b, facteur
voisin) — un tap est bien plus rapide qu'une saisie clavier.

Ajout de 3 niveaux de jeu, choisis avant de lancer la course (comme le choix
d'animal) : Expert 10s/12s/14s (seuils d'origine, redevenus pertinents avec
la saisie QCM), Moyen 15s/17s/19s, Débutant 20s/24s/28s. Le meilleur temps
est désormais gardé en localStorage séparément par niveau (un record en
Débutant n'écrase pas le record Expert).

Au passage, correction d'un bug qui serait passé inaperçu tant qu'aucune
partie n'était allée jusqu'au bout avec le clavier : l'écran de résultat
appelait `<Track />` (composant inexistant, l'ancien nom avant l'extraction
au niveau module en RaceTrack) au lieu de `<RaceTrack ... />` avec ses
props — ça aurait fait planter l'écran de résultat en pratique.

src/pages/CourseTables.jsx : DIFFICULTIES (3 niveaux + seuils), QCM
(generateChoices, boutons de réponse colorés vert/rouge après validation),
sélecteur de niveau sur l'écran d'intro, RaceTrack et rankFromTime
paramétrés par les seuils du niveau choisi, clé localStorage par niveau.

Build vérifié avec succès dès le premier essai (`npx vite build` puis
`npm run build` depuis le dépôt Git `APPLI GITHUB/Sans titre`, sans erreur
transitoire cette fois). Fichiers synchronisés (diff vide vérifié) vers les
deux copies Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain (pas d'identifiants
dans ce sandbox). Aucune migration SQL : toujours entièrement côté client.


## 2026-08-05 (suite 3) — Course aux tables : ajustement des seuils de temps

Romain a retesté et ajusté les seuils des 3 niveaux (toujours 1er/2e/3e en
secondes) :
  Expert       : 14s / 17s / 20s  (était 10s / 12s / 14s)
  Intermédiaire: 18s / 21s / 24s  (était "Moyen" 15s / 17s / 19s — libellé
                 renommé "Intermédiaire" au passage)
  Débutant     : 22s / 25s / 28s  (était 20s / 24s / 28s)

src/pages/CourseTables.jsx : uniquement DIFFICULTIES mis à jour (seuils +
libellé "Moyen" -> "Intermédiaire", id interne "moyen" conservé donc les
éventuels records déjà enregistrés sur ce niveau restent valables).

Build vérifié avec succès dès le premier essai (`npx vite build` puis
`npm run build` depuis le dépôt Git `APPLI GITHUB/Sans titre`). Fichiers
synchronisés (diff vide vérifié) vers les deux copies Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain. Aucune migration
SQL.


## 2026-08-05 (suite 4) — Deux nouveaux jeux : Estimation express + Memory maths, badges de niveau

Suite à la demande de Romain de proposer d'autres jeux "dans le même esprit"
que Course aux tables (10-18 ans, faciles à mettre en place). Après une liste
de pistes classées par faisabilité, Romain a retenu 2 jeux à construire tout
de suite, plus une demande transverse (repère de niveau sur les jeux).
Questions posées avant construction, toutes tranchées :
  - Memory : le passage Facile -> Difficile change uniquement le NOMBRE de
    paires (30 -> 54 cartes), pas la difficulté du contenu (même stock pour
    les deux tailles).
  - Repère de niveau : un simple badge indicatif sur chaque jeu dans le hub
    /jeux (pas un vrai sélecteur de classe qui filtrerait le contenu).
  - Estimation express : ordre de grandeur sur les 4 opérations (+ − × ÷),
    avec de grands nombres.

Refactor préalable : RaceTrack (piste animée) et les utilitaires communs
(shuffle, formatSeconds, rankFromTime, + nouveau formatNumber) sortis de
CourseTables.jsx vers src/components/RaceTrack.jsx et src/lib/gameUtils.js,
pour que le futur jeu de course les réutilise sans dupliquer le code
(CourseTables.jsx retesté et fonctionnellement inchangé après coup).

**Estimation express** (src/pages/EstimationExpress.jsx, /jeux/estimation-
express) : même moteur de course que Course aux tables (QCM, animaux,
classement par seuils de temps), sur une autre compétence — trouver l'ordre
de grandeur d'un calcul avec de grands nombres, sans le poser. Technique du
programme reproduite fidèlement : arrondir chaque nombre à son chiffre le
plus significatif puis calculer sur ces valeurs arrondies (ex. 427 × 68 ->
400 × 70 = 28 000), qui sert de bonne réponse. QCM à 4 choix : la bonne
estimation + un ordre trop grand (×10), un trop petit (÷10), et un du bon
ordre mais avec le mauvais chiffre significatif (ex. 21 000), pour empêcher
de gagner juste en comptant les zéros. Testé isolément (20 000 tirages × 4
opérations, script Node) : toujours 4 choix distincts, toujours positifs,
bonne réponse toujours présente — y compris le cas limite d'une soustraction
où les deux nombres arrondissent à la même valeur (repli automatique sur
l'ordre de grandeur du résultat exact). 3 niveaux (mêmes seuils que Course
aux tables mais plus généreux, lire de grands nombres prend plus de temps) :
Expert 18/22/26s, Intermédiaire 24/28/32s, Débutant 30/35/40s.

**Memory maths** (src/pages/MemoryMaths.jsx, /jeux/memory-maths) : memory
classique mélangeant 3 familles de paires : 11 figures géométriques (dessinées
avec le composant Figure déjà utilisé dans les chapitres — triangle
rectangle/isocèle/équilatéral, carré, rectangle, losange, parallélogramme,
trapèze, cercle, pentagone et hexagone réguliers) associées à leur nom ; 10
paires expression algébrique / forme réduite ; 10 paires fraction / forme
irréductible (ces deux dernières familles rendues en KaTeX via MathText,
déjà utilisé ailleurs dans l'app). Stock total ~31 paires, mélangé et tiré
au hasard à chaque partie (jamais deux fois la même grille). Deux tailles :
Facile 15 paires (30 cartes, grille 5 colonnes), Difficile 27 paires (54
cartes, grille 6 colonnes) — même contenu pour les deux, comme demandé.
Meilleur temps ET meilleur nombre de coups gardés séparément en localStorage
par taille de grille.

**Badges de niveau** (src/pages/Jeux.jsx) : chaque jeu affiche maintenant une
étiquette indicative sur sa carte dans le hub ("Primaire à 3e" pour Course
aux tables, "6e à Terminale" pour les deux nouveaux) — purement informatif,
ne filtre pas le contenu des questions.

Build vérifié avec succès dès le premier essai (`npx vite build` puis
`npm run build` depuis le dépôt Git `APPLI GITHUB/Sans titre`). Fichiers
synchronisés (diff vide vérifié) vers les deux copies Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain. Aucune migration
SQL : les 2 nouveaux jeux sont entièrement côté client (localStorage).

## 2026-08-05 (suite 5) — Nouveau jeu : Memory CP/CE1 (additions/soustractions 1-40)

Romain a demandé un memory dédié aux CP/CE1 (donc bien plus jeunes que la
cible 10-18 ans initiale de l'onglet Jeux), en dehors de Memory maths :
30 cartes fixes (pas de choix de difficulté cette fois), uniquement des
additions et soustractions avec des entiers de 1 à 40, sur 4 familles
précises : compléments à 10, doubles, triples, calculs de base. Demande déjà
suffisamment précise pour construire directement, sans nouvelles questions.

src/pages/MemoryCpCe1.jsx (/jeux/memory-cp-ce1) : même mécanique de memory
que Memory maths (retourner deux cartes, retrouver les paires, chrono +
nombre de coups, meilleur score en localStorage), mais contenu et modèle de
paire différents. Deux formats de paire : soit deux nombres qui se
complètent à 10 façon "amis de 10" (ex. "3" / "7"), soit un calcul et son
résultat (ex. "6 + 6" / "12", "9 + 9 + 9" / "27"). Banque de 20 paires
construite à la main : 4 compléments à 10, 6 doubles, 3 triples, 7 calculs
d'addition/soustraction de base — vérifiée par un script Node avant
intégration pour garantir qu'aucun nombre affiché (isolé ou résultat) ne se
répète ailleurs dans la banque, ce qui casserait le jeu (deux cartes
identiques qui ne sont pourtant pas censées se répondre). 15 des 20 paires
sont tirées au hasard à chaque partie (30 cartes), pour varier la grille
d'une partie à l'autre tout en gardant le stock entièrement maîtrisé.

Le niveau "CP / CE1" est affiché à deux endroits, comme demandé : en badge
sur la carte du jeu dans le hub /jeux (src/pages/Jeux.jsx), et en bandeau
explicite en haut de l'écran d'accueil du jeu lui-même.

Build vérifié avec succès dès le premier essai (`npx vite build` puis
`npm run build` depuis le dépôt Git `APPLI GITHUB/Sans titre`). Fichiers
synchronisés (diff vide vérifié) vers les deux copies Application TOP.

⚠️ Le push GitHub doit être fait manuellement par Romain. Aucune migration
SQL : entièrement côté client (localStorage), comme les autres jeux.

## 2026-08-05 (suite 6) — Audit du mois gratuit de parrainage + correction d'un cas limite

Romain a demandé une vérification : le mois gratuit du parrain (abonnement
complet) se déclenche-t-il bien automatiquement quand un filleul s'abonne ?
Audit du code (pas juste de la todo-list) :

Confirmé automatique. Le webhook Stripe (api/stripe-webhook.js) appelle
grantReferralFreeMonthIfEligible(userId) directement dans le traitement de
checkout.session.completed, dès qu'un filleul paie (mensuel ou Pack Examen).
La fonction vérifie le parrain via la table `referrals`, s'assure qu'il a
bien un abonnement complet actif, repousse son trial_end Stripe de 30 jours
(aucune facture pendant cette période), et marque
subscription_reward_granted_at pour ne jamais créditer deux fois le même
filleul. Code bien présent et identique dans le dépôt Git actif (`APPLI
GITHUB/Sans titre`) — l'incertitude notée le 2026-08-03 sur un possible
mauvais clone Git de destination ne concerne plus ce dépôt, confirmée à jour.

Un vrai bug (mineur, cas limite) trouvé et corrigé au passage : la recherche
de l'abonnement Stripe du parrain filtrait sur status: "active" uniquement,
alors que le code autorise par ailleurs un parrain dont le statut DB est
"trialing". Un parrain encore en période d'essai Stripe au moment où son
filleul payait n'aurait donc jamais reçu son mois gratuit (la fonction
s'arrêtait silencieusement, faute de trouver l'abonnement). Corrigé pour
reprendre exactement le même motif que api/cancel-subscription.js
(status: "all" + filtre JS sur ["active", "trialing"]).

⚠️ Deux points restent à vérifier par Romain lui-même, hors de portée de ce
sandbox : (1) que le webhook Stripe (dashboard Stripe > Webhooks) est bien
abonné à l'événement checkout.session.completed, en plus de
customer.subscription.updated/deleted déjà nécessaires pour le reste de
l'app — sans ça, cette fonction n'est jamais appelée en production, même si
le code est correct ; (2) que ce fichier corrigé est bien poussé sur GitHub
puis redéployé sur Vercel (git push manuel, comme toujours dans ce sandbox).

Build vérifié (`npx vite build`, aucune erreur — ce fichier api/ n'est de
toute façon pas inclus dans le bundle Vite, seul un `node --check` de
syntaxe était vraiment nécessaire, fait aussi). Fichier synchronisé (diff
vide vérifié) vers les deux copies Application TOP. Aucune migration SQL.

## 2026-08-05 (suite 7) — Outil admin : offrir un accès complet gratuit par email

Suite à l'audit du webhook (voir plus haut) : Romain a confirmé être encore
en Stripe Test (pas encore passé en production) et a demandé la possibilité
d'offrir un accès complet gratuit à des personnes de son choix une fois en
production, en plus des codes d'accès classe déjà existants (qui ne
débloquent qu'un seul niveau).

supabase/schema.sql : nouvelle colonne `subscriptions.admin_granted`
(boolean, défaut false) — distingue un accès offert par l'admin d'un vrai
abonnement Stripe payant. Volontairement aucun `stripe_customer_id` ni
`current_period_end` renseigné sur ces lignes : la carte de résiliation
(Account.jsx) ne s'affiche que si `current_period_end` est renseigné, donc
ces comptes offerts ne déclenchent jamais d'appel Stripe accidentel.

api/admin-grant-access.js (nouveau) : endpoint POST { adminUserId,
targetEmail, action: "grant" | "revoke" }. Revérifie l'identité admin
CÔTÉ SERVEUR via supabaseAdmin.auth.admin.getUserById (jamais de confiance
au seul contrôle client, cet endpoint a le pouvoir d'offrir un accès complet
à n'importe qui). Cherche le compte cible par email (pas de recherche directe
par email dans l'API admin Supabase : parcourt les pages de listUsers).
"grant" : upsert subscriptions avec plan="mensuel", status="active",
admin_granted=true. "revoke" : ne fonctionne QUE si admin_granted est déjà
vrai sur la ligne existante (sécurité : ne touche jamais un vrai abonnement
payant par erreur), repasse status="canceled", admin_granted=false.

src/pages/AdminPreview.jsx : nouveau bloc "Offrir un accès complet gratuit"
sur /admin (champ email + boutons Offrir/Révoquer). Le tableau de bord des
utilisateurs affiche désormais "Abonnement complet (offert)" au lieu de
"Abonnement complet" pour ces comptes-là, pour bien les distinguer des vrais
abonnés en un coup d'œil.

Build vérifié avec succès (`npx vite build` puis `npm run build` depuis le
dépôt Git `APPLI GITHUB/Sans titre` — une erreur transitoire EMFILE liée au
sandbox à la première tentative, résolue au second essai, sans lien avec le
contenu). Fichiers synchronisés (diff vide vérifié) vers les deux copies
Application TOP.

⚠️ Migration SQL à coller dans l'éditeur SQL Supabase avant que l'outil ne
fonctionne :

```sql
alter table public.subscriptions add column if not exists admin_granted boolean not null default false;
```

⚠️ Le push GitHub doit être fait manuellement par Romain.

Par ailleurs, Romain a demandé si les comptes de test créés maintenant
resteraient fonctionnels après le passage en mode Live, et si les mises à
jour de l'app en production risquaient de faire perdre les comptes des vrais
abonnés. Réponses données en chat (pas de code à ce sujet) : les lignes
`subscriptions` créées en Stripe Test resteront lisibles par l'app après
bascule en Live (l'accès est piloté par la table Supabase, pas par une
requête Stripe en direct), mais toute action qui reparle à Stripe pour ces
lignes (résiliation, futur renouvellement) échouera puisque l'identifiant
client Stripe stocké est un identifiant Test introuvable avec une clé Live —
recommandé de nettoyer ces lignes de test avant la bascule. Les redéploiements
de l'app (git push -> Vercel) ne touchent jamais aux données Supabase : les
comptes/abonnements des vrais utilisateurs ne sont affectés que par une
migration SQL explicitement collée par Romain (jamais automatique).

## 2026-08-05 — Son (musiques + bruitage), refonte Memory CP/CE1 "amis de 10", jeu "Course des additions" CP/CE1

Demande de Romain : intégrer les 6 fichiers audio fournis dans `Application
TOP/Music/` (musiques d'ambiance par mode + bruitage de clic), utiliser la
musique "révisions" pour les jeux de memory (concentration), remplacer les
paires "amis de 10" du Memory CP/CE1 (nombres seuls, ex. "6" avec "4") par
des paires de calculs (ex. "6 + 4" avec "3 + 7"), et créer un nouveau jeu de
course pour les CP/CE1 sur les additions de nombres entiers entre 1 et 20.

**Son.** Fichiers copiés dans `public/audio/` (renommés `college.mp3`,
`lycee.mp3`, `jeux.mp3`, `revisions.mp3`, `courses.mp3`, `click.wav`).
Nouveau `src/lib/sound.js` : détermine la "zone sonore" active à partir du
chemin de l'URL (`getZoneForPath`) — collège/lycée pour `/college`, `/lycee`
et pour toute page de contenu (`/niveau/:id`, `/parcours/...`, `/chapitre/:id`)
en retrouvant le cycle du niveau concerné via `src/levels.js` ; "jeux" pour le
hall des jeux ; "révisions" pour `/reviser` **et pour les deux jeux de
memory** (Memory maths et Memory CP/CE1 : jeux qui demandent de la
concentration, comme demandé) ; "courses" (piste énergique dédiée) pour les 3
jeux de course chronométrés (Course aux tables, Estimation express, et le
nouveau Course des additions) ; silence sur les pages utilitaires (accueil,
compte, amis, bilan, admin, pages légales...).

Nouveau composant `src/components/SoundManager.jsx`, monté une seule fois
dans `App.jsx` (en dehors de `<Routes>` pour ne jamais être démonté lors des
navigations) : bascule en fondu enchaîné (500 ms) vers la musique de la zone
à chaque changement de page, en boucle ; bouton flottant en bas à droite pour
couper/activer le son (état persisté en localStorage) ; gère la politique
"autoplay" des navigateurs en retentant la lecture au premier clic si elle a
été bloquée initialement. Bruitage de clic (`click.wav`) sur tout clic
détecté sur un lien, un bouton ou un élément `role="button"`, partout dans
l'app (écouteur global unique) — portée volontairement un peu plus large que
"les liens" au sens strict pour un rendu cohérent, à resserrer si besoin.

**Memory CP/CE1 — "amis de 10".** Les 4 anciennes paires nombre-seul-avec-
nombre-seul (3↔7, 6↔4, 9↔1, 8↔2 — pas de lien visible entre les deux cartes
pour un enfant) remplacées par 2 paires de calculs, chacune montrant deux
décompositions différentes de 10 : "6 + 4" ↔ "3 + 7" et "8 + 2" ↔ "9 + 1".
Pour garder le stock à 20 paires (au lieu de tomber à 18), 2 nouvelles paires
"calculs de base" ajoutées : "9 + 4" ↔ "13" et "27 − 5" ↔ "22". Unicité
globale de tous les textes affichés et exactitude de chaque paire (les deux
côtés valent la même chose) revérifiées par script Node (comme pour les
créations précédentes de ce jeu) : 20 paires, 40 cartes, aucune valeur
dupliquée, aucun écart de calcul — tout est correct.

**Nouveau jeu "Course des additions" (CP/CE1).** `/jeux/course-additions-cp-
ce1` (`src/pages/CourseAdditionsCpCe1.jsx`) : même moteur que les autres jeux
de course (`RaceTrack.jsx` + `gameUtils.js` partagés), 10 questions
d'addition entre deux entiers naturels de 1 à 20, en QCM à 4 choix
(distractors = erreurs classiques d'un enfant qui compte sur ses doigts :
±1, ±2, ±10 du résultat, ou confusion avec l'un des deux termes). Seuils de
temps plus généreux que les autres jeux de course (public plus jeune) :
Expert 20s/24s/28s, Intermédiaire 26s/30s/34s, Débutant 32s/36s/40s. Badge
"Jeu pour les CP / CE1" sur l'écran d'accueil du jeu, comme pour Memory
CP/CE1. Ajouté au hub `/jeux` (`Jeux.jsx`) et routé dans `App.jsx`.

Build vérifié avec succès (`npx vite build` puis `npm run build` depuis le
dépôt Git `APPLI GITHUB/Sans titre` — une erreur transitoire EMFILE liée au
sandbox à la première tentative, résolue au second essai, sans lien avec le
contenu). Fichiers (code + les 6 fichiers audio dans `public/audio/`)
synchronisés (diff vide vérifié) vers les deux copies Application TOP.

Aucune migration SQL nécessaire pour cette mise à jour (uniquement du contenu
client + des assets statiques).

⚠️ Le push GitHub doit être fait manuellement par Romain.

Point resté ouvert, à trancher si besoin : les 6 fichiers audio fournis sont
plus longs (3'36" à 8'00" pour la piste "révisions") que les "~2 minutes"
évoqués au départ pour la génération Suno — comme ils tournent en boucle,
cela ne pose pas de problème de fonctionnement, juste des fichiers un peu
plus lourds à charger la première fois (jusqu'à 11,5 Mo pour la piste
révisions). À signaler si Romain souhaite les raccourcir/compresser
davantage.

## 2026-08-05 — Refonte des deux jeux CP/CE1 : Memory en "trios" + Course des additions (classement par rang, saisie tapée)

Demande de Romain, avec 2 clarifications tranchées via questions posées en
chat : (1) le bonus "réponse en moins de 5s" compte bien dans le classement
final, pas seulement pendant la course ; (2) les triples passent eux aussi en
groupes de 3 cartes (ajout de "3×N"), pas seulement les doubles.

**Memory CP/CE1 — mécanique "trio".** Jusqu'ici un memory classique en
paires ; devient un memory en GROUPES DE 3 cartes. Contenu recentré sur
uniquement doubles et triples (retrait complet des catégories "amis de 10"
et "calculs de base") : 6 doubles (5 à 10) + 3 triples (5, 7, 9) = 9 groupes,
chacun avec 3 cartes qui valent la même chose (ex. "6 + 6" / "2 × 6" / "12",
ou "7 + 7 + 7" / "3 × 7" / "21") — 27 cartes au total, plateau fixe (plus de
tirage aléatoire d'un sous-ensemble, tout le contenu tient sur un plateau).
On retourne toujours 2 cartes par tour comme avant ; nouveauté : une fois 2
des 3 cartes d'un groupe déjà trouvées, la 3e et dernière carte se valide
TOUTE SEULE dès qu'on la retourne (sinon elle ne pourrait jamais être
confirmée, ses 2 partenaires étant déjà immobilisés face visible). Logique
vérifiée par une simulation de 500 parties jouées aléatoirement (aucune
erreur, aucune carte "orpheline", aucun blocage) en plus du script
d'unicité/exactitude habituel sur les 27 cartes. Nouvelles clés localStorage
dédiées (la mécanique ayant changé, les anciens records "en paires"
n'auraient plus de sens à comparer).

**Course des additions CP/CE1 — refonte complète du mécanisme.** Terminée la
course chronométrée façon "Course aux tables" : nouveau système, propre à ce
jeu (piste `RaceTrackRank.jsx`, distincte de `RaceTrack.jsx` utilisée par les
2 autres jeux de course) :
- Additions dont aucun terme ne dépasse 20 (déjà le cas, reconfirmé).
- Réponse TAPÉE au clavier numérique tactile (nouveau composant réutilisable
  `NumberPad.jsx`) plutôt qu'en QCM — pour vraiment travailler le calcul.
- On n'avance que sur bonne réponse ; fin de partie dès 6 bonnes réponses,
  sans limite de questions (autant d'erreurs que nécessaire pour y arriver).
- Classement par RANG (1er à 4e), pas par temps : le joueur reste en tête
  tant qu'il répond juste (rang inchangé), une erreur fait doubler un
  personnage (rang +1, jusqu'à 4e), répondre juste en moins de 5s fait au
  contraire en doubler un dans l'autre sens (rang -1, jusqu'à 1er) — ce
  bonus compte dans le classement final. Logique testée par simulation
  (0 faute → 1er, 1 faute → 2e, 2 fautes → 3e, 5 fautes → plafonne à 4e,
  fautes + bonus rapides → peut quand même finir 1er : tous les cas
  attendus vérifiés). Volontairement, la règle exacte n'est PAS expliquée
  dans le texte affiché à l'enfant (demande explicite) — seule l'animation
  de la course la rend perceptible.
- Piste rendue "plus visible" comme demandé : gros émojis (2,1rem), médaille
  de position en temps réel à côté de chaque personnage (🥇🥈🥉), animation
  de "doublement" avec rebond + halo doré pour le bonus rapidité, tous les
  personnages avancent à la même vitesse (même position de base commune, qui
  ne dépend que du nombre de bonnes réponses) et ne se distinguent que par
  leur décalage avant/arrière selon leur rang actuel.

Build vérifié avec succès (`npx vite build` puis `npm run build` depuis le
dépôt Git — une erreur transitoire EMFILE au premier essai, résolue au
second, sans lien avec le contenu). Fichiers synchronisés (diff vide
vérifié) vers les deux copies Application TOP.

Aucune migration SQL nécessaire (uniquement du contenu client).

⚠️ Le push GitHub doit être fait manuellement par Romain.


## 2026-08-05 — Memory CP/CE1 : ajout d'un 10e groupe (double de 4) pour revenir à 30 cartes

Romain a demandé pourquoi le plateau n'était plus à 30 cartes (27 avec les 9
groupes doubles/triples repris tels quels de la version précédente). Ajout
d'un 10e groupe, comme proposé et validé : le double de 4 ("4 + 4" / "2 × 4"
/ "8"), sans collision avec le reste du contenu (revérifié par script Node :
10 groupes, 30 cartes, toutes valeurs correctes et tous textes uniques).

Build vérifié avec succès (`npx vite build` puis `npm run build` depuis le
dépôt Git, bon du premier coup cette fois). Fichier synchronisé (diff vide
vérifié) vers les deux copies Application TOP.

Aucune migration SQL nécessaire.

⚠️ Le push GitHub doit être fait manuellement par Romain.


## 2026-08-05 — Nouvel onglet "Cours" (carte mentale + vidéos courtes), pilote sur 3 chapitres de 6e

Romain a demandé d'ajouter une partie explicative à l'appli (jusqu'ici
uniquement des exercices) : l'essentiel du cours et des méthodes à
connaître, sous forme de cartes mentales et/ou de très courtes vidéos qu'il
tournera lui-même avec l'IA. Discussion en chat pour cadrer l'approche
(recommandations données, validées par Romain via deux questions posées) :
cartes mentales en contenu structuré généré dans l'appli (pas des images,
pour rester lisible sur mobile et cohérent visuellement) plutôt que produites
par Romain dans un outil externe ; pilote sur 2-3 chapitres de 6e avant de
généraliser.

**Architecture.** Nouveau 4e mode "Cours", ajouté EN PREMIÈRE POSITION dans
le sélecteur Découverte/Entraînement/Défi de `ChapterRunner.jsx`,
uniquement si le chapitre définit `meta.cours` — dégradation propre : un
chapitre sans `meta.cours` ne montre pas du tout cet onglet (pas de case
vide), ce qui permet un déploiement progressif chapitre par chapitre sans
jamais laisser un état bancal visible. Le sélecteur de mode (piste à pastille
coulissante) était câblé en dur pour exactement 3 modes (`/3` partout) ; recalculé
dynamiquement sur `MODES.length` pour s'adapter à 3 ou 4 modes selon le
chapitre. En visite libre (hors Parcours), un chapitre avec `meta.cours`
atterrit par défaut sur l'onglet Cours plutôt que Découverte (à confirmer à
l'usage si Romain préfère garder Découverte par défaut).

**Nouveaux composants :**
- `src/components/MindMap.jsx` — rendu de la carte mentale : PAS un vrai
  diagramme radial en SVG (illisible sur mobile sans zoomer/déplacer la vue),
  mais un nœud central (titre du chapitre) suivi de cartes de branche en
  grille responsive (`auto-fit`, une colonne sur téléphone, plusieurs sur
  tablette/desktop), chacune avec ses points clés et une formule mise en
  avant si besoin. Réutilise `MathText.jsx` pour le rendu LaTeX, palette
  limitée aux couleurs déjà définies dans le thème.
- `src/components/CoursPanel.jsx` — assemble vidéos (embeds YouTube via
  youtube-nocookie.com, format 16:9 responsive) + `MindMap`, dans les deux
  cas de façon optionnelle (aucune vidéo tant que Romain n'en a pas encore
  tourné pour un chapitre donné).

**Contenu pilote — 3 chapitres de 6e** (`meta.cours.mindMap` ajouté, pas de
vidéo pour l'instant) :
- Nombres décimaux : écriture décimale, fractions décimales, comparaison,
  droite graduée.
- Fractions : définition, fractions égales/simplification, comparaison,
  addition/soustraction, multiplication.
- Proportionnalité : reconnaître une situation de proportionnalité,
  coefficient, produit en croix, pourcentages.

Les 10 formules LaTeX ont été passées directement dans le moteur KaTeX
(`katex.renderToString`) en Node avant intégration pour vérifier qu'aucune ne
génère d'erreur de rendu (piège repéré et corrigé au passage : le caractère
`%` déclenche un commentaire LaTeX/KaTeX et doit être échappé en `\%`).

Build vérifié avec succès (`npx vite build` puis `npm run build` depuis le
dépôt Git — une erreur transitoire `@supabase/auth-js` au premier essai,
résolue au second, sans lien avec le contenu). Fichiers synchronisés (diff
vide vérifié) vers les deux copies Application TOP.

Aucune migration SQL nécessaire (uniquement du contenu client).

⚠️ Le push GitHub doit être fait manuellement par Romain.

Prochaine étape suggérée : une fois ce pilote testé/validé par Romain,
généraliser la carte mentale aux autres chapitres (je peux les rédiger au
même rythme que demandé), et brancher les vidéos dès que Romain en aura
tourné (juste ajouter `videos: [{ title, youtubeId }]` dans `meta.cours` du
chapitre concerné — aucun changement de code nécessaire).

## 2026-08-05 — Corrections carte mentale + audit programme officiel 6e + liens "Revoir le cours"

Suite au retour de Romain sur le pilote de l'onglet Cours : la branche
"Droite graduée" ne convenait pas, il fallait relier les explications de
méthode/correction au cours, et surtout vérifier que le contenu des cartes
mentales correspond bien au programme officiel de 6e (le cas précis soulevé :
la multiplication de fractions).

**Droite graduée corrigée.** L'ancienne explication était trop vague
(encadrement) et ne correspondait pas à la méthode réellement enseignée dans
le chapitre. Réécrite pour coller exactement à ce que testent les exercices
du chapitre (voir `genLireAbscisseDecimale`/`genPlacerPointQCM` dans
nombres-decimaux.js) : repérer le pas de graduation, compter le nombre de
graduations depuis un repère connu, multiplier par le pas et ajouter au
repère — avec un exemple chiffré concret.

**Liens "Revoir le cours".** Ajoutés dans `ChapterRunner.jsx` : un lien
"Revoir le cours" apparaît sous la Méthode en mode Découverte, et sous l'aide
("Voir la méthode") en mode Entraînement — uniquement si le chapitre a un
onglet Cours. Cliquer dessus bascule directement sur l'onglet Cours. Fait le
lien entre théorie et pratique comme demandé.

**Audit programme officiel — vérification demandée par Romain.** Recherche
effectuée sur le programme 2025 de mathématiques du cycle 3 (BO du 17 avril
2025, applicable depuis la rentrée 2025 — texte officiel actuel), pas sur ma
mémoire. Deux non-conformités trouvées et corrigées :

1. **Multiplication de deux fractions entre elles (ex. 2/3 × 4/5) N'EST PAS
   au programme de 6e** — seule la multiplication d'une fraction PAR UN
   NOMBRE ENTIER l'est ("Multiplier une fraction par un nombre entier",
   objectif d'apprentissage officiel). Ce n'était pas qu'un problème de carte
   mentale : le générateur d'exercices `fractions.js` contenait bien un
   générateur `genMultiplierDeuxFractions` (fraction × fraction) tiré au
   hasard parmi les exercices du chapitre — **retiré** (fonction supprimée,
   désenregistrée du pool de génération et du tag de difficulté), avec un
   commentaire expliquant pourquoi, pour éviter qu'il ne soit réintroduit par
   erreur. La description du chapitre a été corrigée en conséquence. La
   carte mentale reflète maintenant uniquement "multiplier une fraction par
   un entier" (avec l'exemple \\(4 \\times \\dfrac{2}{3}\\)).

2. **Trouvaille supplémentaire (pas demandée, mais découverte en sourçant le
   contenu) : la technique du "produit en croix" est explicitement EXCLUE du
   programme de 6e** par le texte officiel ("la technique du « produit en
   croix » n'est pas enseignée"). Ma carte mentale de Proportionnalité
   utilisait justement cette technique — corrigée : remplacée par le
   raisonnement par coefficient (celui que testent réellement les exercices
   du chapitre, voir `genCompleterTableauProportionnaliteManquant`), avec
   mention de la linéarité et du retour à l'unité comme alternatives, en
   cohérence avec le texte officiel.

⚠️ Point à trancher avec Romain, pas résolu unilatéralement dans cette
session : le programme 2025 met l'accent sur "linéarité multiplicative ou
additive, retour à l'unité" plutôt que sur un "coefficient de
proportionnalité" formalisé comme objectif nommé explicitement en 6e — or
plusieurs générateurs du chapitre Proportionnalité (6e) sont construits
autour de ce coefficient. Ce n'est pas mathématiquement faux et reste une
méthode standard, mais un audit plus large de ce chapitre (et potentiellement
d'autres, vu que le programme 2025 est très récent et que la majeure partie
du contenu de l'appli a été construite avant sa parution) pourrait être utile
si Romain veut une conformité stricte au tout dernier texte officiel — à
prévoir comme un chantier à part si souhaité, pas fait ici sans son accord
(ampleur potentiellement importante).

Formules LaTeX revérifiées via `katex.renderToString` avant intégration
(y compris `\text{}` avec accents français, confirmé sans risque — seul `%`
non échappé est réellement dangereux, déjà identifié et corrigé
précédemment).

Build vérifié avec succès (`npx vite build` puis `npm run build` depuis le
dépôt Git — une erreur transitoire EMFILE au premier essai, résolue au
second, sans lien avec le contenu). Fichiers synchronisés (diff vide
vérifié) vers les deux copies Application TOP.

Aucune migration SQL nécessaire.

⚠️ Le push GitHub doit être fait manuellement par Romain.

## 2026-08-07 — Audit du chapitre Proportionnalité (6e) contre le programme 2025

Suite au point en suspens soulevé dans la correction précédente : audit demandé
par Romain ("oui tu peux t'y atteler") sur la cohérence entre `proportionnalite.js`
(6e) et le nouveau programme 2025 (BO du 17 avril 2025, cycle 3), en particulier
sur la place du "coefficient de proportionnalité".

**Recherche complémentaire.** Au-delà du texte officiel déjà consulté, lecture
d'une ressource académique détaillée (Académie de Bordeaux, "Proportionnalité
en 6e") qui explicite la progressivité voulue par le programme : 3 définitions
de plus en plus précises, introduites dans l'ordre — (1) linéarité (« si l'une
double, l'autre double »), (2) retour à l'unité, (3) coefficient de
proportionnalité comme raccourci une fois les deux premières notions
maîtrisées. Le texte précise aussi explicitement qu'un tableau de
proportionnalité ne doit "jamais" être une liste de nombres seule, mais
toujours être associé à des grandeurs nommées avec leur unité.

**Deux défauts trouvés dans les générateurs existants, corrigés :**

1. Trois générateurs (`genCoefficientDeProportionnalite`,
   `genEstTableauProportionnel`, `genCompleterTableauProportionnaliteManquant`)
   présentaient des tableaux de nombres bruts, sans aucune grandeur nommée ni
   unité — contraire à l'instruction explicite du programme. Corrigé : ajout
   d'un ensemble de contextes (`TABLE_CONTEXTS` — masse de pommes/prix, essence/
   prix, stylos/prix, durée/pièces produites, billets de cinéma/prix), chaque
   ligne du tableau affichant désormais le nom de la grandeur et son unité.

2. `genCoefficientDeProportionnalite` était tagué "facile", donc proposé dès le
   début de l'apprentissage — alors que le programme introduit le vocabulaire
   "coefficient" en dernier, après linéarité et retour à l'unité. Reclassé en
   "standard". Le générateur `genCompleterTableauProportionnaliteManquant`
   (resté "facile") a aussi été reformulé pour ne plus employer le mot
   "coefficient" dans son étape de correction, restant sur un raisonnement de
   type retour à l'unité/linéarité ("on cherche par quel nombre on multiplie
   toujours...").

**Carte mentale réorganisée** en conséquence : la branche "Trouver une valeur
manquante" présente maintenant en premier la linéarité et le retour à l'unité
(avec un exemple recette : 3 pers. → 150 g ⇒ 1 pers. → 50 g ⇒ 5 pers. → 250 g),
et une branche séparée "Le coefficient de proportionnalité" vient ensuite,
explicitement présentée comme une méthode plus rapide une fois les précédentes
comprises — reflet fidèle de la progression officielle. La branche
"Reconnaître la proportionnalité" gagne un item rappelant que les tableaux
doivent toujours nommer leurs grandeurs avec leur unité.

**Formule LaTeX corrigée en cours de vérification** : la première version de
l'exemple linéarité/retour à l'unité utilisait le symbole « € » à l'intérieur
d'un bloc `\(\)` — testé avec `katex.renderToString(..., {strict: "error"})`,
qui a révélé que KaTeX n'a pas de métriques de caractère pour « € » (avertissement
"No character metrics"). Remplacé par un exemple sans symbole monétaire
(recette : personnes/grammes), qui passe la vérification stricte sans aucun
avertissement — cohérent avec la convention déjà en place dans le reste du
fichier (les montants en € sont toujours affichés en texte brut, hors des
délimiteurs `\( \)`, jamais à l'intérieur d'un `\text{}`).

**Vérifications effectuées avant intégration :**
- Les 3 formules LaTeX modifiées/ajoutées passent `katex.renderToString` en
  mode strict ("error"), sans avertissement.
- Génération de 400 exercices aléatoires du chapitre : aucune réponse `NaN`,
  les 17 générateurs s'exécutent tous sans erreur.
- Inspection manuelle de plusieurs exemples générés pour les 3 générateurs
  modifiés : grandeurs et unités bien affichées, calculs corrects (ex. tableau
  "Durée (en min) / Nombre de pièces produites" avec coefficient 3 correctement
  identifié comme proportionnel).
- Build (`npm run build`) réussi depuis le dépôt Git.

Fichier synchronisé (diff vide vérifié) vers les deux copies Application TOP.

Aucune migration SQL nécessaire.

⚠️ Le push GitHub doit être fait manuellement par Romain.

## 2026-08-07 — Nouvel outil texTable() : vrais tableaux LaTeX (correction d'un bug d'affichage)

Signalé par Romain : l'affichage des tableaux de proportionnalité (6e) posait
problème. Diagnostic : dans `proportionnalite.js`, 3 générateurs construisaient
leur tableau en juxtaposant plusieurs blocs `\( ... \)` séparés par un `\\\\`
flottant dans du texte brut (hors de tout environnement LaTeX). Or `\\` (retour
à la ligne) n'a de sens QUE à l'intérieur d'un environnement comme
`\begin{array}` ou `\begin{cases}` — utilisé en texte libre, KaTeX ne le
reconnaît pas du tout : ça ne produisait aucun vrai retour à la ligne, avec un
risque de texte qui déborde du cadre de la carte d'exercice sur mobile
(exactement le problème remonté). Ce n'était pas propre à la 6e : le mécanisme
sous-jacent (juxtaposition de plusieurs `\(\)` pour simuler un tableau) est un
besoin qui revient dans beaucoup de chapitres (tableaux de données, de
proportionnalité, de statistiques...), d'où la décision de construire un
outil réutilisable plutôt qu'un correctif local.

**Nouveau fichier `src/utils/texTable.js`** : exporte `texTable(rows)`, qui
construit un vrai tableau LaTeX (`\[\begin{array}{|l|c|c|...|} ... \end{array}\]`)
avec bordures et colonnes alignées à partir d'un tableau de lignes de
cellules — la première cellule de chaque ligne est traitée comme un libellé
de grandeur (rendue en `\text{}`), les suivantes comme des valeurs. KaTeX
sait nativement rendre cet environnement `array`, donc plus de bricolage :
c'est un unique bloc LaTeX cohérent, en mode bloc (`\[ \]`), qui s'affiche
sur ses propres lignes quel que soit le nombre de colonnes.

Règle documentée dans le fichier : ne jamais mettre le symbole « € » dans une
cellule (KaTeX n'a pas de métriques de caractère pour ce symbole, déjà
identifié précédemment) — écrire « euros » en toutes lettres à la place. Les
5 contextes de `TABLE_CONTEXTS` dans `proportionnalite.js` ont été mis à jour
en conséquence (« Prix (en €) » → « Prix (en euros) »).

**CSS ajoutée dans `src/index.css`** : règle `.katex-display { overflow-x:
auto; overflow-y: hidden; max-width: 100%; }`, recommandation standard de
KaTeX pour le mode bloc — si un tableau reste malgré tout trop large pour un
très petit écran, il défile horizontalement au lieu de déborder du cadre ou
de casser la mise en page (demande explicite de Romain : « fais bien
attention à ce que le texte n'sorte pas du cadre »).

**Migration des 3 générateurs concernés** (`genCoefficientDeProportionnalite`,
`genEstTableauProportionnel`, `genCompleterTableauProportionnaliteManquant`)
vers `texTable()`. Recherche exhaustive dans tout `src/chapters/` : seuls 2
autres fichiers utilisaient un `\\\\` (`equations-droites-seconde.js`,
`vecteurs-droites-plans-espace-terminale-spe.js`) mais correctement, à
l'intérieur d'un vrai `\begin{cases}...\end{cases}` — donc pas de bug là,
rien à changer.

**Vérifications effectuées :**
- `texTable()` testé via `katex.renderToString(..., {strict: "error"})` :
  aucun avertissement, aucune erreur.
- 500 exercices générés du chapitre Proportionnalité : aucun crash, aucune
  réponse `NaN`.
- Les blocs `\[ ... \]` effectivement produits par les 3 générateurs modifiés
  ont été extraits des prompts générés et revérifiés un par un avec KaTeX en
  mode strict : tous corrects.
- Build (`npm run build`) réussi depuis le dépôt Git.

Fichiers synchronisés (diff vide vérifié) vers les deux copies Application TOP.

Aucune migration SQL nécessaire.

⚠️ Le push GitHub doit être fait manuellement par Romain.

## 2026-08-07 — Phase 0 : mise en conformité 5e avec le nouveau programme 2026 (lot 1)

Suite à l'audit officiel de la classe de 5e (BO n°10 du 5 mars 2026, arrêté du
18-2-2026, applicable dès la rentrée 2026), correction de 6 fichiers pour
retirer ou reformuler le contenu hors-programme identifié.

**`src/chapters/statistiques-probabilites.js`** : suppression de
`genMoyennePondereeNumeric` (moyenne pondérée = objectif 4e),
`genProbabiliteEvenementContraireNumeric` (événement contraire = objectif 4e)
et `genSommeDeuxDesProbabiliteNumeric` (probabilités sur deux épreuves =
objectif 4e). Description du chapitre mise à jour.

**`src/chapters/triangles.js`** : suppression de `genAngleExterieurTriangle`
(hors programme cycle 4), `genTriangleRectangleHypotenuseDiametre` et
`genReconnaitreTriangleRectangleViaCercleQCM` (caractérisation cercle
circonscrit/triangle rectangle = objectif 4e), `genOrthocentreDefinitionQCM`,
`genCentreDeGraviteRatioNumeric` et `genCentreDeGraviteDefinitionQCM`
(orthocentre et centre de gravité hors programme, sauf culture générale via
la droite d'Euler, déjà couverte par `genCultureDroiteEulerQCM`, inchangé).
`genAireTrapezeNumeric` repositionné en enrichissement (repassé en difficulté
« expert »). Description du chapitre mise à jour.

**`src/chapters/automatismes-cinquieme.js`** (deux corrections indépendantes) :
- Section triangles : suppression de `genAutoCentreGraviteRatio` (ratio 2/3
  hors programme) ; `genAutoVocabulaireTriangleQCM` reformulé en question de
  culture mathématique sur la droite d'Euler plutôt qu'en vocabulaire à
  mémoriser.
- Section fonctions : `genAutoEvaluerFonctionAffine` reformulé — suppression
  de la notation `f(x)` (réservée à la Troisième), remplacée par un contexte
  concret nommé (« P, le prix d'une course de taxi, s'exprime en fonction de
  d... »), en miroir de la correction faite dans `fonctions.js`.

**`src/chapters/calcul-litteral.js`** : suppression de
`genResoudreEquationDeuxEtapes` (équation `ax+b=c` = objectif 4e ; le
programme 5e limite à `ax=c` ou `x+b=c` séparément).
`genTrouverValeurXEgaliteVraieQCM` réécrit pour ne plus tester que ces deux
formes simples, tirées aléatoirement.

**`src/chapters/puissances.js`** : `genEcriturePuissance` et
`genPuissanceDeDixEcriture` restreints au carré/cube (exposants 2 et 3) et à
10¹/10²/10³ — le programme 5e ne cite explicitement que le carré, le cube et
« le cube de 10 » ; la notion générale de puissance d'exposant entier positif
relève de la Quatrième.

**`src/chapters/proportionnalite-cinquieme.js`** : suppression de
`genLongueurArcCercleNumeric` et `genAireSecteurCirculaireNumeric` (arc de
cercle et secteur circulaire hors programme cycle 4). Description du
chapitre mise à jour.

**`src/chapters/fonctions.js`** : refonte complète pour rester au niveau 5e
(« exprimer une grandeur en fonction d'une autre », sans étude générale de la
notion de fonction — la notation f(x), la notation fléchée et le vocabulaire
image/antécédent sont des objectifs de Troisième). Introduction d'un tableau
partagé de contextes concrets nommés (`CONTEXTES_GRANDEUR_FONCTION` : prix
d'une course de taxi, coût de location d'un vélo, épargne d'un enfant).
Suppression complète de `genTrouverAntecedentNumeric` et
`genNotationFlecheeNumeric`. Reformulation de `genVocabulaireEnFonctionDeQCM`,
`genEvaluerFonctionAffineNumeric`, `genRetrouverDepartFonctionNumeric` et
`genCompleterTableauValeursNumeric` pour utiliser ces contextes concrets.
Description du chapitre mise à jour.

**Vérifications effectuées :**
- Chaque fichier modifié testé individuellement (300 à 600 exercices générés
  par script Node) : aucun crash, aucune réponse `NaN`.
- Le thème « fonctions » d'Automatismes 5e testé spécifiquement (200
  exercices) après la correction du miroir `genAutoEvaluerFonctionAffine`.
- Build (`npm run build`) réussi depuis le dépôt Git.

Fichiers synchronisés (diff vide vérifié) vers les deux copies Application TOP.

Aucune migration SQL nécessaire.

⚠️ Le push GitHub doit être fait manuellement par Romain.
