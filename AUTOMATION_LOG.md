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
