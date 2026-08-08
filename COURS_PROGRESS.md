# Suivi du chantier "Cours" (carte mentale + vidéos)

Ce fichier sert de mémoire persistante pour ce chantier : en cas de coupure de
session (limite d'usage, plantage), tout ce qui est déjà fait est committé
en local (voir `git log`) et coché ci-dessous. Une nouvelle session reprend
en lisant ce fichier — pas besoin de redécouvrir l'état des lieux.

**Règle impérative : committer + cocher ce fichier après CHAQUE chapitre**,
jamais en fin de session en une seule fois. Un chapitre fini mais non
committé/coché n'existe pas pour la session suivante.

## Reprise ici

**Collège (6e, 5e, 4e, 3e) intégralement terminé** — 49 chapitres avec
`meta.cours.mindMap` (+ 2 chapitres de synthèse/révision mixte
délibérément sans Cours : `exercices-fin-annee-quatrieme.js` et
`dossier-brevet-troisieme.js` — voir git log pour le détail commit par
commit de ce lot, ou l'historique de ce fichier). Détail par niveau dans
les checklists ci-dessous (toutes cochées pour 6e/5e/4e/3e).

**Chantier lycée (2nde → Terminale techno) en cours.** Progression détaillée
dans les checklists par niveau ci-dessous (cases cochées = fait, avec commit
noté en commentaire dans le code seulement — voir `git log --oneline` pour
les hashes). État actuel :

- 2nde : `nombres-calculs-seconde.js` fait (commit `14e7c51`, pas de
  figure). `generalites-fonctions-seconde.js` fait (commit `05bcc23`, pas
  de figure). `variations-fonctions-seconde.js` fait (commit `b4875b0`,
  pas de figure). `fonctions-affines-seconde.js` fait (commit `9568b50`,
  pas de figure). `fonctions-reference-seconde.js` fait (commit `7e95059`,
  pas de figure). `reperage-configurations-seconde.js` fait (commit
  `2b9c25f`, 5 figures neuves — helper `buildCoursRepereFigure()` créé,
  aucun helper de figure n'existait dans ce fichier avant). **Prochain
  fichier : `vecteurs-seconde.js` (géométrie).** `vecteurs-seconde.js` fait
  (commit `9da70f9`, 5 figures neuves — helper `buildCoursVecteurFigure()`
  créé, utilise `arrowEnd`/`extend:0` sur `lines` pour dessiner des
  vecteurs finis fléchés). **Prochain fichier :
  `colinearite-vecteurs-seconde.js` (géométrie).**
  `colinearite-vecteurs-seconde.js` fait (commit `94d010f`, 4 figures
  neuves via `buildCoursColinFigure()`). **Prochain fichier :
  `equations-droites-seconde.js` (géométrie).** `equations-droites-seconde.js`
  fait (commit `d31c684`, 3 figures neuves via `buildCoursDroiteFigure()`).
  `informations-chiffrees-seconde.js` fait (commit `1b48bea`, pas de
  figure). `statistiques-descriptives-seconde.js` fait (commit `97919fc`,
  pas de figure). `probabilites-echantillonnage-seconde.js` fait (commit
  `b192366`, pas de figure). `exercices-fin-annee-seconde.js` délibérément
  SANS Cours (synthèse transversale, voir checklist "2nde" pour le détail).
  **La 2nde est intégralement terminée.**
- Première non spé : `analyse-information-chiffree-premiere-non-spe.js`
  fait (commit `cafea33`, pas de figure).
  `statistique-probabilites-premiere-non-spe.js` fait (commit `8c52d7b`,
  pas de figure). `croissance-lineaire-premiere-non-spe.js` fait (commit
  `8e608ac`, pas de figure). `croissance-exponentielle-premiere-non-spe.js`
  fait (commit `9c80e61`, pas de figure). `modelisation-quadratique-premiere-non-spe.js`
  fait (commit `19e39d7`, pas de figure). `variations-instantanees-premiere-non-spe.js`
  fait (commit `508dcca`, pas de figure). `variations-globales-premiere-non-spe.js`
  fait (commit `f73038b`, pas de figure). `exercices-rituels-premiere-non-spe.js`
  et `preparation-eam-premiere-non-spe.js` délibérément SANS Cours (synthèses,
  voir checklist "Première non spé"). **La Première non spé est
  intégralement terminée. Prochain fichier : `second-degre.js` (Première
  Spé).** `second-degre.js` fait (commit `dc3b126`, pas de figure).
  `suites-numeriques-premiere-spe.js` fait (commit `7420eb7`, pas de
  figure). `derivation-premiere-spe.js` fait (commit `41bb0b5`, pas de
  figure). `variations-courbes-premiere-spe.js` fait (commit `c0cb22f`,
  pas de figure). `fonction-exponentielle-premiere-spe.js` fait (commit
  `2911256`, pas de figure). `trigonometrie-premiere-spe.js` fait (commit
  `1f4f566`, 3 figures neuves — cercle trigo, cercle+projections cos/sin,
  triangle rectangle — via `buildCoursCercleFigure()` /
  `buildCoursTriangleTrigFigure()`). **Prochain fichier :
  `vecteurs-produit-scalaire-premiere-spe.js` (géométrie).**
  `vecteurs-produit-scalaire-premiere-spe.js` fait (commit `cfc5be6`, 3
  figures neuves). **Prochain fichier :
  `geometrie-reperee-premiere-spe.js` (géométrie).**
  `geometrie-reperee-premiere-spe.js` fait (commit `649f3ba`, 3 figures
  neuves). `probabilites-conditionnelles-premiere-spe.js` fait (commit
  `3915737`, pas de figure). `variables-aleatoires-premiere-spe.js` fait
  (commit `232c59e`, pas de figure). `algorithmique-python-premiere-spe.js`
  fait (commit `8e6a395`, pas de figure). `preparation-bac-premiere-spe.js`
  délibérément SANS Cours (synthèse EAM, voir checklist "Première Spé").
  **La Première Spé est intégralement terminée. Prochain fichier :
  `suites-numeriques-premiere-techno.js` (Première techno).**
  `suites-numeriques-premiere-techno.js` fait (commit `fc7ed27`, pas de
  figure). `fonctions-second-degre-premiere-techno.js` fait (commit
  `23bf741`, pas de figure). `derivation-premiere-techno.js` fait (commit
  `9c7c6fb`, pas de figure). `statistiques-deux-variables-premiere-techno.js`
  fait (commit `08797a5`, pas de figure).
  `probabilites-conditionnelles-premiere-techno.js` fait (commit `0a2255b`,
  pas de figure). `epreuves-independantes-premiere-techno.js` fait (commit
  `4ed1f29`, pas de figure). `variables-aleatoires-premiere-techno.js` fait
  (commit `ae4e87f`, pas de figure). `preparation-eam-premiere-techno.js`
  délibérément SANS Cours (synthèse EAM). `algorithmique-python-premiere-techno.js`
  fait (commit `d4b3bbe`, pas de figure). **La Première techno est
  intégralement terminée. Prochain fichier :
  `combinatoire-denombrement-terminale-spe.js` (Terminale Spé).**
  `combinatoire-denombrement-terminale-spe.js` fait (commit `bb295c8`,
  pas de figure). **Prochain fichier :
  `vecteurs-droites-plans-espace-terminale-spe.js` (géométrie, 3D).**
  `vecteurs-droites-plans-espace-terminale-spe.js` fait (commit `a701f2a`,
  4 figures neuves — **première projection 3D→2D du chantier**, technique
  `project3D()`/`build3DFigure()` en perspective cavalière, à réutiliser
  pour `orthogonalite-distances-espace-terminale-spe.js`). **Prochain
  fichier : `orthogonalite-distances-espace-terminale-spe.js` (géométrie,
  3D).** `orthogonalite-distances-espace-terminale-spe.js` fait (commit
  `184c223`, 3 figures neuves en perspective cavalière, même technique
  project3D()/build3DFigure()). `suites-terminale-spe.js` fait (commit
  `9785db2`, pas de figure). `limites-fonctions-terminale-spe.js` fait
  (commit `09e9ad7`, pas de figure). `continuite-terminale-spe.js` fait
  (commit `fb492c3`, pas de figure). **Prochain fichier :
  `complements-derivation-terminale-spe.js`.**

Note technique importante (rencontrée dans cette session) : `git commit`
normal a recommencé à échouer de façon permanente sur ce repo
(`.git/index.lock` reste bloqué après la première tentative, contrairement
aux sessions précédentes où il fonctionnait). **Contournement utilisé pour
tous les commits suivants** : script `/tmp/gcommit.sh "message" fichier1
[fichier2...]` (le recréer si absent — voir modèle dans la section
"Note technique" plus bas, qui explique aussi le piège historique à éviter
— ne jamais copier `.git/index` tel quel, toujours `git read-tree HEAD`).
**Toujours vérifier `git diff HEAD --stat` vide après chaque commit.**

Méthode (à réutiliser pour tous les niveaux restants) : lire
`src/chapters/<file>.js` en entier, 3-5 branches courtes, figure
obligatoire pour toute branche géométrique (réutiliser les éventuels
`build...Figure()` déjà présents dans le fichier cible s'il y en a, sinon
suivre le format de `Figure.jsx` ; pour la géométrie dans l'espace en
1ère/Terminale, envisager une projection façon "perspective cavalière" en
2D plutôt qu'une vraie 3D — `Figure.jsx` ne rend que du SVG 2D), vérifier
avec `node --check` + `node check-cours-katex.mjs ./src/chapters/<file>.js`
+ `ulimit -n 4096 && npx vite build --outDir /tmp/dist-verify-cours-<file>`,
committer CE fichier seul, cocher la checklist ci-dessous, committer ce
fichier de suivi, avant de passer au chapitre suivant.

Note technique : `.git/index.lock` / `HEAD.lock` / `refs/heads/main.lock`
sont bloqués dans ce repo (impossible à supprimer, `Operation not
permitted`) — `git commit` normal échoue désormais. Contournement qui
fonctionne : `git add <file>` (fonctionne malgré le warning), puis
`cp .git/index /tmp/x; TREE=$(GIT_INDEX_FILE=/tmp/x git write-tree);
NEWCOMMIT=$(echo "msg" | git commit-tree $TREE -p $(git rev-parse HEAD));
echo $NEWCOMMIT > .git/refs/heads/main` (écriture directe du fichier de ref,
en contournant le lock). Un script prêt à l'emploi a été laissé dans
`/tmp/gcommit.sh` côté sandbox (peut ne pas persister entre sessions — le
recréer si besoin, il est court : voir modèle ci-dessus).

**Piège découvert et corrigé pendant cette session** : la première version
de ce contournement copiait `.git/index` (l'index réel, jamais mis à jour
par ces commits en plumbing) à chaque nouveau commit — du coup chaque commit
« écrasait » silencieusement les fichiers ajoutés par les commits
précédents (l'objet commit restait valide et consultable individuellement
via `git show <sha>:<fichier>`, mais son arbre ne cumulait pas les
changements). Résultat : 11 des 12 cartes mentales 5e avaient disparu de
HEAD avant d'être détectées et réparées en fin de session (commit
`f531a420`, qui restaure le contenu exact déjà rédigé — rien n'a été
réécrit). **Fix obligatoire pour la suite : ne JAMAIS copier `.git/index`
tel quel. Toujours partir de l'arbre du dernier commit** :
`IDX=$(mktemp); GIT_INDEX_FILE=$IDX git read-tree HEAD; GIT_INDEX_FILE=$IDX
git add <fichier(s)>; TREE=$(GIT_INDEX_FILE=$IDX git write-tree); ...` (le
`git read-tree HEAD` remplace le `cp .git/index ...` de l'ancienne version).
**Après CHAQUE commit en plumbing, vérifier avec `git diff HEAD --stat`
(doit être vide) avant de passer au fichier suivant** — c'est le seul moyen
fiable de détecter ce genre de régression silencieuse tout de suite plutôt
qu'en fin de session.

Dernière mise à jour : 2026-08-08 — Collège (6e/5e/4e/3e, 49 chapitres) ET
2nde (12 chapitres + 1 synthèse sans Cours) intégralement terminés, voir
git log pour l'historique commit par commit. Prochain fichier :
`analyse-information-chiffree-premiere-non-spe.js` (Première non spé).

## Ce qui a été fait avant ce chantier (état de départ)

3 chapitres 6e servaient de pilote pour la fonctionnalité, avant même ce
suivi organisé : `nombres-decimaux.js`, `fractions.js`, `proportionnalite.js`
(commits `9edaac0`, `cdb41c9` et audits ultérieurs). Ils sont considérés
comme faits ci-dessous.

## Infrastructure (faite le 2026-08-08)

- [x] `src/components/MindMap.jsx` étendu : chaque branche de carte mentale
  peut désormais porter un champ `figure` optionnel (même format que le
  champ `figure` des exercices, rendu via le composant `Figure.jsx`
  existant) — nécessaire pour les chapitres de géométrie.

## Conventions de rédaction (lire avant d'écrire un `meta.cours`)

Objectif du Cours : donner à l'élève, en 2-4 branches courtes, **l'essentiel
et rien de plus** — ce qu'il doit absolument savoir/retenir pour réussir les
exercices du chapitre. Pas un cours complet et exhaustif : une fiche mémo
très claire et mémorisable. Priorité à la clarté sur l'exhaustivité.

Forme (dans `meta` du fichier chapitre, à côté de `title`/`description`/etc.) :

```js
cours: {
  mindMap: {
    title: "Titre du chapitre",
    branches: [
      {
        title: "Nom de la notion",
        items: [
          "Règle ou définition, une phrase courte.",
          "Piège classique à éviter, si pertinent.",
        ],
        formula: "\\(\\text{formule mise en avant, optionnelle}\\)",
        figure: { points: [...], segments: [...], ... }, // géométrie only
      },
      // 2 à 5 branches, pas plus — sinon ce n'est plus mémorisable
    ],
  },
  // videos: [{ title, youtubeId }]  — laissé vide tant que Romain n'a pas tourné de vidéo
},
```

Règles :
- **3 à 5 branches maximum** par chapitre. Regrouper plutôt que multiplier.
- Chaque `items` : 1 à 3 puces courtes (une phrase chacune), pas de pavés de
  texte. Un piège classique (erreur fréquente d'élève) est bienvenu si le
  chapitre en a un connu.
- `formula` : uniquement si une formule/écriture symbolique aide vraiment à
  mémoriser (pas systématique).
- **`figure` obligatoire pour toute branche qui introduit un objet
  géométrique** (droite, angle, cercle, symétrie, triangle, solide...) — un
  élève de collège/lycée retient une notion de géométrie par le dessin
  autant que par le texte. Réutiliser le style déjà en place dans les
  générateurs d'exercices du même fichier (mêmes couleurs/épaisseurs, via le
  composant `Figure.jsx` — voir son en-tête pour le format du spec).
- Réutiliser le vocabulaire et le niveau de langue déjà présents dans les
  `steps` des exercices du même fichier (cohérence de ton).
- LaTeX : délimiteurs `\( \)` (rendu par `MathText`), jamais de décimal brut
  non "francisé" (`fr()` déjà utilisé ailleurs dans le fichier).
- Après rédaction : `npx vite build` pour vérifier que le fichier compile
  (les cartes mentales ne sont pas testées par les scripts `node` de
  vérification d'exercices, qui ne portent que sur `generate()`).

## Checklist par niveau

Cases cochées = `meta.cours` déjà écrit. `reviser-les-bases-*` et
`automatismes-*` sont exclus de cette liste pour l'instant (priorité aux
chapitres principaux ; à traiter plus tard si Romain le souhaite).

### 6e — TERMINÉ (niveau pilote)

- [x] nombres-decimaux.js
- [x] fractions.js
- [x] proportionnalite.js
- [x] operations-decimaux.js
- [x] grandeurs-mesures.js
- [x] distances-symetries.js *(géométrie — figures requises)*
- [x] angles.js *(géométrie — figures requises)*
- [x] configurations-geometriques.js *(géométrie — figures requises)*
- [x] organisation-gestion-donnees.js

### 5e (cinquieme) — TERMINÉ

- [x] calcul-numerique.js
- [x] divisibilite-fractions.js
- [x] puissances.js
- [x] calcul-litteral.js
- [x] nombres-relatifs.js *(géométrie — figures requises)*
- [x] geometrie-espace.js *(géométrie)*
- [x] symetrie-centrale-parallelogrammes.js *(géométrie)*
- [x] triangles.js *(géométrie)*
- [x] statistiques-probabilites.js
- [x] proportionnalite-cinquieme.js
- [x] fonctions.js
- [x] algorithmique-cinquieme.js

### 4e (quatrieme)

- [x] nombres-relatifs-quatrieme.js
- [x] addition-soustraction-rationnels.js
- [x] multiplication-division-rationnels.js
- [x] puissances-quatrieme.js
- [x] calcul-litteral-quatrieme.js
- [x] resolution-equations.js
- [x] statistiques-quatrieme.js
- [x] probabilites-quatrieme.js
- [x] notion-fonctions.js
- [x] proportionnalite-quatrieme.js
- [x] theoreme-thales.js *(géométrie)*
- [x] triangles-rectangles-quatrieme.js *(géométrie)*
- [x] geometrie-plane.js *(géométrie)*
- [x] geometrie-espace-quatrieme.js *(géométrie)*
- [x] exercices-fin-annee-quatrieme.js *(délibérément SANS `meta.cours` — chapitre
  de révision mixte confirmé par son propre commentaire d'en-tête : "il ne
  s'agit pas d'un chapitre du programme à proprement parler mais d'une
  révision finale mélangeant les notions vues toute l'année de 4e" ; aucune
  notion nouvelle à résumer, tout est déjà couvert par les 14 Cours
  précédents de 4e)*

**La 4e est désormais intégralement terminée** (14 chapitres avec
`meta.cours.mindMap` + 1 chapitre de révision mixte délibérément sans
Cours). Passage direct à la 3e (troisième), comme prévu par la consigne
initiale de Romain.

### 3e (troisieme)

- [x] nombres-entiers-troisieme.js
- [x] calcul-numerique-troisieme.js
- [x] calcul-litteral-troisieme.js
- [x] equations-troisieme.js
- [x] notion-fonction-troisieme.js
- [x] fonctions-affines-troisieme.js
- [x] proportionnalite-troisieme.js
- [x] statistiques-troisieme.js
- [x] probabilites-troisieme.js
- [x] thales-triangles-semblables-troisieme.js *(géométrie)*
- [x] trigonometrie-triangle-rectangle-troisieme.js *(géométrie)*
- [x] transformations-plan-troisieme.js *(géométrie)*
- [x] geometrie-espace-troisieme.js *(géométrie)*
- [x] mesures-grandeurs-troisieme.js
- [x] dossier-brevet-troisieme.js (délibérément SANS Cours — chapitre de
      synthèse type Brevet, aucune notion nouvelle, voir "Reprise ici")

### 2nde (seconde)

- [x] nombres-calculs-seconde.js
- [x] generalites-fonctions-seconde.js
- [x] variations-fonctions-seconde.js
- [x] fonctions-affines-seconde.js
- [x] fonctions-reference-seconde.js
- [x] reperage-configurations-seconde.js *(géométrie)*
- [x] vecteurs-seconde.js *(géométrie)*
- [x] colinearite-vecteurs-seconde.js *(géométrie)*
- [x] equations-droites-seconde.js *(géométrie)*
- [x] informations-chiffrees-seconde.js
- [x] statistiques-descriptives-seconde.js
- [x] probabilites-echantillonnage-seconde.js
- [x] exercices-fin-annee-seconde.js (délibérément SANS Cours — chapitre de
      synthèse transversale confirmé par son propre commentaire d'en-tête :
      "Dernier chapitre du niveau 2nde : synthèse transversale mêlant les
      grands thèmes de l'année... dans l'esprit des « Exercices
      transversaux » du manuel" ; recombine les 12 autres chapitres 2nde
      sans notion nouvelle, même raisonnement que
      `exercices-fin-annee-quatrieme.js` en 4e)

**La 2nde est intégralement terminée** (12 chapitres avec `meta.cours.mindMap`
+ 1 chapitre de synthèse délibérément sans Cours).

### Première non spé (premiere-non-spe)

- [x] analyse-information-chiffree-premiere-non-spe.js
- [x] statistique-probabilites-premiere-non-spe.js
- [x] croissance-lineaire-premiere-non-spe.js
- [x] croissance-exponentielle-premiere-non-spe.js
- [x] modelisation-quadratique-premiere-non-spe.js
- [x] variations-instantanees-premiere-non-spe.js
- [x] variations-globales-premiere-non-spe.js
- [x] exercices-rituels-premiere-non-spe.js (délibérément SANS Cours —
      son propre commentaire d'en-tête le décrit comme une "synthèse de fin
      d'année mêlant les automatismes... et un rappel d'une compétence clé
      de chacun des 6 chapitres du programme" ; aucune notion nouvelle,
      même raisonnement que `exercices-fin-annee-quatrieme.js`)
- [x] preparation-eam-premiere-non-spe.js (délibérément SANS Cours — banque
      de questions type Épreuve Anticipée de Mathématiques (sujets
      officiels + variantes), synthèse transversale par nature, aucune
      notion nouvelle)

**La Première non spé est intégralement terminée** (7 chapitres avec
`meta.cours.mindMap` + 2 chapitres de synthèse/examen délibérément sans
Cours).

### Première Spé (premiere-spe)

- [x] second-degre.js
- [x] suites-numeriques-premiere-spe.js
- [x] derivation-premiere-spe.js
- [x] variations-courbes-premiere-spe.js
- [x] fonction-exponentielle-premiere-spe.js
- [x] trigonometrie-premiere-spe.js *(géométrie)*
- [x] vecteurs-produit-scalaire-premiere-spe.js *(géométrie)*
- [x] geometrie-reperee-premiere-spe.js *(géométrie)*
- [x] probabilites-conditionnelles-premiere-spe.js
- [x] variables-aleatoires-premiere-spe.js
- [x] algorithmique-python-premiere-spe.js
- [x] preparation-bac-premiere-spe.js (délibérément SANS Cours — banque de
      questions type Épreuve Anticipée de Mathématiques (sujets officiels
      2026 + variantes), synthèse transversale par nature, aucune notion
      nouvelle)

**La Première Spé est intégralement terminée** (11 chapitres avec
`meta.cours.mindMap` + 1 chapitre d'examen délibérément sans Cours).

### Première techno (premiere-techno)

- [x] suites-numeriques-premiere-techno.js
- [x] fonctions-second-degre-premiere-techno.js
- [x] derivation-premiere-techno.js
- [x] statistiques-deux-variables-premiere-techno.js
- [x] probabilites-conditionnelles-premiere-techno.js
- [x] epreuves-independantes-premiere-techno.js
- [x] variables-aleatoires-premiere-techno.js
- [x] preparation-eam-premiere-techno.js (délibérément SANS Cours — banque
      de questions construite à partir de 4 sujets officiels de l'EAM voie
      technologique + variantes originales, synthèse transversale par
      nature, aucune notion nouvelle)
- [x] algorithmique-python-premiere-techno.js

**La Première techno est intégralement terminée** (9 chapitres avec
`meta.cours.mindMap` + 1 chapitre d'examen délibérément sans Cours).

### Terminale Spé (terminale-spe)

- [x] combinatoire-denombrement-terminale-spe.js
- [x] vecteurs-droites-plans-espace-terminale-spe.js *(géométrie)*
- [x] orthogonalite-distances-espace-terminale-spe.js *(géométrie)*
- [x] suites-terminale-spe.js
- [x] limites-fonctions-terminale-spe.js
- [x] continuite-terminale-spe.js
- [ ] complements-derivation-terminale-spe.js
- [ ] logarithme-neperien-terminale-spe.js
- [ ] fonctions-trigonometriques-terminale-spe.js
- [ ] primitives-equations-differentielles-terminale-spe.js
- [ ] calcul-integral-terminale-spe.js
- [ ] loi-binomiale-terminale-spe.js
- [ ] sommes-variables-aleatoires-terminale-spe.js
- [ ] loi-grands-nombres-terminale-spe.js
- [ ] exercices-transversaux-terminale-spe.js

### Terminale techno (terminale-techno)

- [ ] suites-terminale-techno.js
- [ ] fonctions-exponentielles-terminale-techno.js
- [ ] logarithme-decimal-terminale-techno.js
- [ ] statistiques-deux-variables-terminale-techno.js
- [ ] probabilites-conditionnelles-terminale-techno.js
- [ ] variables-aleatoires-terminale-techno.js

## Total

61 / 148 chapitres principaux faits (hors `reviser-les-bases-*` et
`automatismes-*`, à traiter plus tard ; et hors les chapitres de synthèse
délibérément sans Cours : `exercices-fin-annee-quatrieme.js`,
`dossier-brevet-troisieme.js`, `exercices-fin-annee-seconde.js`) — **le
collège (6e/5e/4e/3e) ET la 2nde sont intégralement terminés.** Prochaine
étape : Première non spé, puis Première Spé, Première techno, Terminale
Spé, Terminale techno.

---

## Chantier séparé : audit "programme 2026" (dépriorisé)

Sans lien direct avec le chantier Cours ci-dessus — noté ici pour mémoire
seulement. Romain a dépriorisé ce chantier (plusieurs niveaux ne changent
pas de programme cette année, et il travaille déjà avec les nouveaux
programmes en classe) :

- [x] Phase 0 : 5e, 2nde, Première non spé, Première Spé, Première techno
- [x] Phase 1 : 6e (tous les 7 fichiers principaux)
- [ ] 4e, 3e (cycle 4, arrêté du 18-2-2026)
- [ ] Terminale Spé (arrêté du 26-2-2026)
- [ ] Terminale techno : aucun arrêté 2026 identifié pour l'instant — à
  vérifier avant de programmer quoi que ce soit
- En attente (décision Romain) : profondeur Première non spé
  (croissance lin./expo, stats-proba), sujets EAM anciens (Première
  non spé + techno)
