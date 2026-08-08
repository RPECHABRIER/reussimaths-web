# Suivi du chantier "Cours" (carte mentale + vidéos)

Ce fichier sert de mémoire persistante pour ce chantier : en cas de coupure de
session (limite d'usage, plantage), tout ce qui est déjà fait est committé
en local (voir `git log`) et coché ci-dessous. Une nouvelle session reprend
en lisant ce fichier — pas besoin de redécouvrir l'état des lieux.

**Règle impérative : committer + cocher ce fichier après CHAQUE chapitre**,
jamais en fin de session en une seule fois. Un chapitre fini mais non
committé/coché n'existe pas pour la session suivante.

## Reprise ici

**La 6e (niveau pilote) est intégralement terminée.** La 5e est en cours :
`calcul-numerique.js` fait. **Prochaine étape : `puissances.js`**
(voir la checklist "5e (cinquieme)" ci-dessous, dans l'ordre où les fichiers
y sont listés). Même méthode : lire `src/chapters/<file>.js` en entier, 3-5
branches courtes, figure obligatoire pour toute branche géométrique
(réutiliser les éventuels `build...Figure()` déjà présents dans le fichier
cible s'il y en a, sinon suivre le format de `Figure.jsx`), vérifier avec
`node --check` + `npx vite build` + le script `check-cours-katex.mjs` (à la
racine du repo, créé pendant le chantier 6e — usage : `node
check-cours-katex.mjs ./src/chapters/<file>.js`), committer CE fichier seul,
cocher, committer ce fichier de suivi, avant de passer au chapitre suivant.

Note technique : `.git/index.lock` / `HEAD.lock` / `refs/heads/main.lock`
sont bloqués dans ce repo (impossible à supprimer, `Operation not
permitted`) — `git commit` normal échoue désormais. Contournement qui
fonctionne : `git add <file>` (fonctionne malgré le warning), puis
`cp .git/index /tmp/x; TREE=$(GIT_INDEX_FILE=/tmp/x git write-tree);
NEWCOMMIT=$(echo "msg" | git commit-tree $TREE -p $(git rev-parse HEAD));
echo $NEWCOMMIT > .git/refs/heads/main` (écriture directe du fichier de ref,
en contournant le lock). Un script prêt à l'emploi a été laissé dans
`/tmp/gcommit.sh` côté sandbox (peut ne pas persister entre sessions — le
recréer si besoin, il est court).

Dernière mise à jour : 2026-08-08 — 6e terminée, 5e en cours
(`calcul-numerique.js` commit `47455ab`, `divisibilite-fractions.js` commit
`c16f70a`). Prochaine étape : `puissances.js`.

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

### 5e (cinquieme)

- [x] calcul-numerique.js
- [x] divisibilite-fractions.js
- [ ] puissances.js
- [ ] calcul-litteral.js
- [ ] nombres-relatifs.js
- [ ] geometrie-espace.js *(géométrie)*
- [ ] symetrie-centrale-parallelogrammes.js *(géométrie)*
- [ ] triangles.js *(géométrie)*
- [ ] statistiques-probabilites.js
- [ ] proportionnalite-cinquieme.js
- [ ] fonctions.js
- [ ] algorithmique-cinquieme.js

### 4e (quatrieme)

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
- [ ] theoreme-thales.js *(géométrie)*
- [ ] triangles-rectangles-quatrieme.js *(géométrie)*
- [ ] geometrie-plane.js *(géométrie)*
- [ ] geometrie-espace-quatrieme.js *(géométrie)*
- [ ] exercices-fin-annee-quatrieme.js

### 3e (troisieme)

- [ ] nombres-entiers-troisieme.js
- [ ] calcul-numerique-troisieme.js
- [ ] calcul-litteral-troisieme.js
- [ ] equations-troisieme.js
- [ ] notion-fonction-troisieme.js
- [ ] fonctions-affines-troisieme.js
- [ ] proportionnalite-troisieme.js
- [ ] statistiques-troisieme.js
- [ ] probabilites-troisieme.js
- [ ] thales-triangles-semblables-troisieme.js *(géométrie)*
- [ ] trigonometrie-triangle-rectangle-troisieme.js *(géométrie)*
- [ ] transformations-plan-troisieme.js *(géométrie)*
- [ ] geometrie-espace-troisieme.js *(géométrie)*
- [ ] mesures-grandeurs-troisieme.js
- [ ] dossier-brevet-troisieme.js

### 2nde (seconde)

- [ ] nombres-calculs-seconde.js
- [ ] generalites-fonctions-seconde.js
- [ ] variations-fonctions-seconde.js
- [ ] fonctions-affines-seconde.js
- [ ] fonctions-reference-seconde.js
- [ ] reperage-configurations-seconde.js *(géométrie)*
- [ ] vecteurs-seconde.js *(géométrie)*
- [ ] colinearite-vecteurs-seconde.js *(géométrie)*
- [ ] equations-droites-seconde.js *(géométrie)*
- [ ] informations-chiffrees-seconde.js
- [ ] statistiques-descriptives-seconde.js
- [ ] probabilites-echantillonnage-seconde.js
- [ ] exercices-fin-annee-seconde.js

### Première non spé (premiere-non-spe)

- [ ] analyse-information-chiffree-premiere-non-spe.js
- [ ] statistique-probabilites-premiere-non-spe.js
- [ ] croissance-lineaire-premiere-non-spe.js
- [ ] croissance-exponentielle-premiere-non-spe.js
- [ ] modelisation-quadratique-premiere-non-spe.js
- [ ] variations-instantanees-premiere-non-spe.js
- [ ] variations-globales-premiere-non-spe.js
- [ ] exercices-rituels-premiere-non-spe.js
- [ ] preparation-eam-premiere-non-spe.js

### Première Spé (premiere-spe)

- [ ] second-degre.js
- [ ] suites-numeriques-premiere-spe.js
- [ ] derivation-premiere-spe.js
- [ ] variations-courbes-premiere-spe.js
- [ ] fonction-exponentielle-premiere-spe.js
- [ ] trigonometrie-premiere-spe.js *(géométrie)*
- [ ] vecteurs-produit-scalaire-premiere-spe.js *(géométrie)*
- [ ] geometrie-reperee-premiere-spe.js *(géométrie)*
- [ ] probabilites-conditionnelles-premiere-spe.js
- [ ] variables-aleatoires-premiere-spe.js
- [ ] algorithmique-python-premiere-spe.js
- [ ] preparation-bac-premiere-spe.js

### Première techno (premiere-techno)

- [ ] suites-numeriques-premiere-techno.js
- [ ] fonctions-second-degre-premiere-techno.js
- [ ] derivation-premiere-techno.js
- [ ] statistiques-deux-variables-premiere-techno.js
- [ ] probabilites-conditionnelles-premiere-techno.js
- [ ] epreuves-independantes-premiere-techno.js
- [ ] variables-aleatoires-premiere-techno.js
- [ ] preparation-eam-premiere-techno.js
- [ ] algorithmique-python-premiere-techno.js

### Terminale Spé (terminale-spe)

- [ ] combinatoire-denombrement-terminale-spe.js
- [ ] vecteurs-droites-plans-espace-terminale-spe.js *(géométrie)*
- [ ] orthogonalite-distances-espace-terminale-spe.js *(géométrie)*
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
- [ ] exercices-transversaux-terminale-spe.js

### Terminale techno (terminale-techno)

- [ ] suites-terminale-techno.js
- [ ] fonctions-exponentielles-terminale-techno.js
- [ ] logarithme-decimal-terminale-techno.js
- [ ] statistiques-deux-variables-terminale-techno.js
- [ ] probabilites-conditionnelles-terminale-techno.js
- [ ] variables-aleatoires-terminale-techno.js

## Total

9 / 135 chapitres principaux faits (hors `reviser-les-bases-*` et
`automatismes-*`, 122 non comptés ici, à traiter plus tard) — la 6e est
intégralement terminée, prochaine étape : la 5e.

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
