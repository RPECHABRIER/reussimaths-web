# Suivi de la revue qualité du Cours (clarté + présentation)

Chantier séparé du chantier de rédaction initial (voir `COURS_PROGRESS.md`,
qui reste la référence pour le format `meta.cours.mindMap` et les
conventions de base — ce fichier-ci ne les répète pas). Les 107 chapitres
principaux ont désormais un `meta.cours.mindMap`, écrit rapidement chapitre
par chapitre. Romain a demandé une passe de relecture qualité pour
s'assurer que chaque Cours est **au maximum de la clarté et de la
mémorisabilité**, dans l'esprit d'un enseignant réputé pour sa clarté
(Yvan Monka cité en référence) — et, en passant, que les **exercices** du
même fichier n'ont pas de défaut de présentation qui nuit à la
compréhension (texte trop dense/long qui déborde du cadre, énumération qui
devrait être un tableau, etc.).

**Règle impérative, comme pour le chantier précédent : committer + cocher
après CHAQUE fichier revu, jamais en fin de session.**

## Reprise ici

Lot `fractions.js` / `proportionnalite.js` / `operations-decimaux.js` /
`grandeurs-mesures.js` (6e) relus intégralement.

- `fractions.js` : **vraies corrections**. Piège classique ajouté sur la
  branche "Comparer des fractions" (à numérateur égal, la fraction au plus
  grand dénominateur n'est PAS la plus grande — révélé par le mode
  `memeNum` de `genComparerDeuxFractions`), formule mise à jour pour
  l'illustrer (\\(1/3 > 1/7\\)). Flèche de sens ajoutée sur la demi-droite
  graduée de `genLireAbscisseFraction` (`arrowEnd: true`), qui n'en avait
  pas — même défaut que celui déjà corrigé ailleurs (commit `da902e8`).
- `proportionnalite.js` : RAS. Carte mentale déjà organisée selon la
  progressivité du programme 2025 (linéarité → retour à l'unité →
  coefficient), piège "situations qui semblent proportionnelles mais ne le
  sont pas" déjà présent et bien aligné avec `genVraiFauxProportionnaliteConceptuel`,
  tous les tableaux déjà en `texTable()`.
- `operations-decimaux.js` : RAS. Piège classique déjà présent (0,5 × 0,5 =
  0,25, un produit de décimaux ne "grandit" pas toujours), bien aligné avec
  `genComparerAvantApresMultiplication`/`genOrdreDeGrandeurProduitDecimaux`.
- `grandeurs-mesures.js` : RAS. Trois pièges classiques déjà présents et
  bien ciblés (conversion de longueurs = compter les rangs, aires = facteur
  100 entre unités consécutives, durées en base 60 — 1,5 h ≠ 1 h 50 min).

**Prochain fichier à traiter : `distances-symetries.js` (6e).** Puis le
reste de la 6e, 5e, 4e, 3e dans cet ordre (périmètre de ce chantier =
collège uniquement, voir consigne — 2nde/lycée hors scope pour l'instant).

## Ce qui a déclenché ce chantier

Capture d'écran fournie par Romain (mode Découverte, `nombres-decimaux.js`,
`genProblemeTarifPoids`) : un énoncé avec 9 paliers tarifaires énumérés en
prose continue ("jusqu'à X kg → Y € ; jusqu'à..."), illisible et débordant
du cadre sur mobile. Corrigé (commit `9fa7fea`) en remplaçant l'énumération
par un vrai tableau `texTable()`.

Romain a aussi signalé que les droites graduées doivent TOUJOURS avoir une
flèche de sens — celle de `nombres-relatifs.js` (5e) n'en avait pas.
Recherche faite sur l'ensemble du dépôt (toute figure de type droite
graduée / axe / repère) : 3 endroits corrigés ce jour (commit `da902e8`) :
`buildGraduatedLineFigure` et `buildRepereFigure` dans `nombres-relatifs.js`
(5e), `buildAxeGradueFigure` dans `automatismes-sixieme.js`. Les figures
créées APRÈS l'ajout du support de flèche dans `Figure.jsx`
(`reperage-configurations-seconde.js`, `transformations-plan-troisieme.js`,
`vecteurs-droites-plans-espace-terminale-spe.js`) l'utilisaient déjà
correctement — pas de correction nécessaire là.

**Recherche mécanique faite (grep) pour repérer d'autres énoncés à risque
de débordement** (prompt > 350 caractères, ou ≥ 4 points-virgules, ou ≥ 3
symboles €, ou ≥ 3 flèches "→") : liste de ~53 fichiers/generateurs
candidats obtenue, mais BEAUCOUP sont des faux positifs (ex. des
coordonnées de points \\(A(x;y)\\), \\(B(x;y)\\)... ont naturellement
plusieurs points-virgules mais restent compactes et lisibles en mode
mathématique — ce n'est PAS le même problème qu'une longue phrase en
prose). **Chaque candidat doit être jugé au cas par cas par une vraie
lecture**, pas par ce grep seul. Liste brute des candidats (pour référence,
à vérifier un par un lors de la relecture du fichier concerné — beaucoup
seront probablement jugés OK tels quels) :

- analyse-information-chiffree-premiere-non-spe.js (tableau croisé en
  prose — probablement à convertir en texTable)
- statistique-probabilites-premiere-non-spe.js (idem, tableau croisé)
- preparation-eam-premiere-techno.js (hors périmètre du chantier Cours —
  chapitre volontairement sans Cours, mais l'énoncé long reste à vérifier
  si le temps le permet)
- preparation-bac-premiere-spe.js (idem, hors périmètre Cours)
- preparation-eam-premiere-non-spe.js (idem, hors périmètre Cours,
  tableau en prose à vérifier)
- theoreme-thales.js (contexte long mais probablement narratif normal —
  à relire)
- algorithmique-python-premiere-spe.js (contient probablement du code —
  normal que ce soit long, à vérifier que c'est bien présenté en `texTable`
  comme le reste du fichier)
- continuite-terminale-spe.js, orthogonalite-distances-espace-terminale-spe.js,
  vecteurs-droites-plans-espace-terminale-spe.js (semi-colons = coordonnées
  de vecteurs/points, probablement OK, à confirmer)
- probabilites-troisieme.js, symetrie-centrale-parallelogrammes.js,
  dossier-brevet-troisieme.js, calcul-litteral-troisieme.js (longueur >
  350, contexte narratif à relire)
- fonctions-affines-troisieme.js, fonctions-affines-seconde.js,
  proportionnalite-cinquieme.js, equations-troisieme.js,
  dossier-brevet-troisieme.js (2e occurrence) : tarifs avec plusieurs "€"
  — probablement OK si c'est juste 2-3 tarifs comparés (pas un tableau à 9
  lignes comme le cas corrigé), à confirmer au cas par cas.
- vecteurs-seconde.js, reperage-configurations-seconde.js,
  colinearite-vecteurs-seconde.js : coordonnées de points, probablement OK.

## Critères de relecture (checklist mentale par chapitre)

Pour le **Cours** (`meta.cours.mindMap`) :
1. Un élève qui n'a jamais vu la notion peut-il, en lisant les 3-5
   branches, comprendre l'essentiel ET s'en souvenir ? (test : le relire à
   voix haute — si une phrase demande un effort de relecture, la
   simplifier.)
2. Vocabulaire le plus concret possible, exemples avec des nombres/objets
   du quotidien plutôt que des tournures abstraites.
3. Chaque `items` fait UNE phrase courte, jamais un paragraphe.
4. Un `formula` seulement si elle aide vraiment à mémoriser (sinon la
   retirer).
5. Toute branche géométrique a une `figure` claire, bien proportionnée,
   sans éléments qui se chevauchent.
6. Toute droite/axe orienté a sa flèche de sens (voir ci-dessus).
7. Pas de délimiteur LaTeX cassé, pas de décimal brut non francisé.

Pour les **exercices** du même fichier (relecture rapide, pas exhaustive
sauf signal du grep ci-dessus ou repéré à l'œil) :
1. Un prompt qui énumère plus de 3-4 éléments chiffrés en prose (tarifs,
   paliers, séries de valeurs) devrait être un `texTable()` plutôt qu'une
   phrase à rallonge.
2. Pas de symbole `€` dans une cellule de `texTable()` (rappel : KaTeX ne
   le rend pas correctement — voir `src/utils/texTable.js`), écrire
   "euros" en toutes lettres dans ce cas précis.
3. Un prompt anormalement long (> 400 caractères) pour une simple question
   numérique mérite d'être resserré.

## Checklist de relecture par niveau

(Cases cochées = Cours relu et, si besoin, amélioré ; prompts du fichier
vérifiés pour débordement.)

### 6e
- [x] nombres-decimaux.js *(relu intégralement, déjà au niveau attendu — RAS)*
- [x] fractions.js *(piège classique numérateur égal + flèche demi-droite ajoutés)*
- [x] proportionnalite.js *(déjà bon, RAS)*
- [x] operations-decimaux.js *(déjà bon, RAS)*
- [x] grandeurs-mesures.js *(déjà bon, RAS)*
- [ ] distances-symetries.js
- [ ] angles.js
- [ ] configurations-geometriques.js
- [ ] organisation-gestion-donnees.js

### 5e
- [ ] calcul-numerique.js
- [ ] divisibilite-fractions.js
- [ ] puissances.js
- [ ] calcul-litteral.js
- [ ] nombres-relatifs.js *(flèches déjà corrigées — relire le reste)*
- [ ] geometrie-espace.js
- [ ] symetrie-centrale-parallelogrammes.js
- [ ] triangles.js
- [ ] statistiques-probabilites.js
- [ ] proportionnalite-cinquieme.js
- [ ] fonctions.js
- [ ] algorithmique-cinquieme.js

### 4e
- [ ] nombres-relatifs-quatrieme.js
- [ ] addition-soustraction-rationnels.js
- [ ] multiplication-division-rationnels.js
- [ ] puissances-quatrieme.js
- [ ] calcul-litteral-quatrieme.js
- [ ] resolution-equations.js
- [ ] statistiques-quatrieme.js
- [ ] probabilites-quatrieme.js
- [ ] notion-fonctions.js
- [ ] proportionnalite-quatrieme.js
- [ ] theoreme-thales.js
- [ ] triangles-rectangles-quatrieme.js
- [ ] geometrie-plane.js
- [ ] geometrie-espace-quatrieme.js

### 3e
- [ ] nombres-entiers-troisieme.js
- [ ] calcul-numerique-troisieme.js
- [ ] calcul-litteral-troisieme.js
- [ ] equations-troisieme.js
- [ ] notion-fonction-troisieme.js
- [ ] fonctions-affines-troisieme.js
- [ ] proportionnalite-troisieme.js
- [ ] statistiques-troisieme.js
- [ ] probabilites-troisieme.js
- [ ] thales-triangles-semblables-troisieme.js
- [ ] trigonometrie-triangle-rectangle-troisieme.js
- [ ] transformations-plan-troisieme.js
- [ ] geometrie-espace-troisieme.js
- [ ] mesures-grandeurs-troisieme.js

### 2nde
- [ ] nombres-calculs-seconde.js
- [ ] generalites-fonctions-seconde.js
- [ ] variations-fonctions-seconde.js
- [ ] fonctions-affines-seconde.js
- [ ] fonctions-reference-seconde.js
- [ ] reperage-configurations-seconde.js
- [ ] vecteurs-seconde.js
- [ ] colinearite-vecteurs-seconde.js
- [ ] equations-droites-seconde.js
- [ ] informations-chiffrees-seconde.js
- [ ] statistiques-descriptives-seconde.js
- [ ] probabilites-echantillonnage-seconde.js

### Première non spé
- [ ] analyse-information-chiffree-premiere-non-spe.js
- [ ] statistique-probabilites-premiere-non-spe.js
- [ ] croissance-lineaire-premiere-non-spe.js
- [ ] croissance-exponentielle-premiere-non-spe.js
- [ ] modelisation-quadratique-premiere-non-spe.js
- [ ] variations-instantanees-premiere-non-spe.js
- [ ] variations-globales-premiere-non-spe.js

### Première Spé
- [ ] second-degre.js
- [ ] suites-numeriques-premiere-spe.js
- [ ] derivation-premiere-spe.js
- [ ] variations-courbes-premiere-spe.js
- [ ] fonction-exponentielle-premiere-spe.js
- [ ] trigonometrie-premiere-spe.js
- [ ] vecteurs-produit-scalaire-premiere-spe.js
- [ ] geometrie-reperee-premiere-spe.js
- [ ] probabilites-conditionnelles-premiere-spe.js
- [ ] variables-aleatoires-premiere-spe.js
- [ ] algorithmique-python-premiere-spe.js

### Première techno
- [ ] suites-numeriques-premiere-techno.js
- [ ] fonctions-second-degre-premiere-techno.js
- [ ] derivation-premiere-techno.js
- [ ] statistiques-deux-variables-premiere-techno.js
- [ ] probabilites-conditionnelles-premiere-techno.js
- [ ] epreuves-independantes-premiere-techno.js
- [ ] variables-aleatoires-premiere-techno.js
- [ ] algorithmique-python-premiere-techno.js

### Terminale Spé
- [ ] combinatoire-denombrement-terminale-spe.js
- [ ] vecteurs-droites-plans-espace-terminale-spe.js
- [ ] orthogonalite-distances-espace-terminale-spe.js
- [ ] suites-terminale-spe.js
- [ ] limites-fonctions-terminale-spe.js
- [ ] continuite-terminale-spe.js
- [ ] complements-derivation-terminale-spe.js
- [ ] logarithme-neperien-terminale-spe.js
- [ ] fonctions-trigonometriques-terminale-spe.js
- [ ] primitives-equations-differentielles-terminale-spe.js
- [ ] calcul-integral-terminale-spe.js
- [ ] loi-binomiale-terminale-spe.js
- [ ] sommes-variables-aleatoires-terminale-spe.js
- [ ] loi-grands-nombres-terminale-spe.js

### Terminale techno
- [ ] suites-terminale-techno.js
- [ ] fonctions-exponentielles-terminale-techno.js
- [ ] logarithme-decimal-terminale-techno.js
- [ ] statistiques-deux-variables-terminale-techno.js
- [ ] probabilites-conditionnelles-terminale-techno.js
- [ ] variables-aleatoires-terminale-techno.js

## Note technique (git)

Mêmes contraintes que documentées dans `COURS_PROGRESS.md` : `.git/index.lock`
etc. peuvent être bloqués — essayer `git commit` normal d'abord, sinon
utiliser le contournement documenté là-bas (`git read-tree HEAD` puis
`write-tree`/`commit-tree`/écriture directe de `refs/heads/main`), et
vérifier `git diff HEAD --stat` vide après chaque commit.
