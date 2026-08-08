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

**La 5e, la 4e et la 3e sont intégralement terminées. Prochain fichier :
variations-fonctions-seconde.js (2nde) — 3e fichier de la 2nde.**

`generalites-fonctions-seconde.js` (2nde) relu intégralement : item ajouté
à « Vocabulaire : image et antécédent » sur les 4 modes de représentation
équivalents d'une fonction (formule, tableau, courbe, programme de
calcul), testés par `genModeRepresentationQCM` mais absents du cours ;
item ajouté à « Tableau de signes d'un produit ou quotient » sur la
résolution d'une équation quotient=constante par multiplication des deux
membres par le dénominateur, testée par `genResoudreEquationQuotientNumeric`
mais absente. Exercices : import `texTable` ajouté, 3 prompts convertis
(`genLectureTableauImageNumeric`, `genNombreAntecedentsTableauQCM`,
`genResoudreFEgalGTableauNumeric`) qui énonçaient « voici un tableau de
valeurs » puis listaient les paires x/image en prose séparée par des
virgules au lieu d'un vrai tableau (même bug déjà vu sur
`notion-fonction-troisieme.js`). Branches « Ensemble de définition » et
« Résoudre f(x)=0 ou f(x)>0 » laissées inchangées (déjà claires).

`nombres-calculs-seconde.js` (2nde, premier fichier de la 2nde) relu
intégralement : plusieurs gaps de fond comblés. Branche « Intervalles » :
règle de transformation d'un encadrement par une opération ajoutée (piège
classique multiplier/diviser par un négatif inverse le sens des
inégalités), testée par `genEncadrementOperationNumeric` mais absente du
cours. Branche « Valeur absolue et distance » : règle
\\(|X|=b \\iff X=b \\text{ ou } X=-b\\) ajoutée, testée par
`genResoudreValeurAbsolueEgaliteNumeric` mais absente (seule la version
inégalité était couverte). Branche « Racines carrées et puissances »
scindée en « Racines carrées » et « Puissances » : piège classique
\\(\\sqrt{a^2}=|a|\\) ajouté (testé par `genSimplifierRacineCarreNumeric`
avec a pouvant être négatif, absent avant) ; nouvelle branche
« Puissances » créée (formule \\(a^{-n}=1/a^n\\) + piège parité de
l'exposant) alors qu'un thème entier testé par 3 générateurs
(`genPuissanceNegativeNumeric`, `genComparerPuissanceZeroQCM`,
`genEcritureScientifiqueNumeric`) était absent du cours. Branche
« Comparer deux quantités » : heuristique rapport/différence selon
l'ordre de grandeur ajoutée, testée par `genChoisirComparaisonAdapteeQCM`
mais absente. Branche « Identités remarquables » laissée inchangée (déjà
claire). Aucune figure, aucun symbole € en cellule, aucun candidat
texTable.

`mesures-grandeurs-troisieme.js` (3e) relu intégralement : piège
classique ajouté à « Vitesse, énergie, débit » sur la conversion
heures/minutes en heures décimales avant calcul (30 min = 0,5 h, ne pas
utiliser directement les minutes comme centièmes d'heure) — testé par
`genVitesseMoyenneAvecMinutesNumeric` dont le step montre explicitement
cette conversion, confusion très classique (2h30 lu comme 2,30)
totalement absente du cours avant cette relecture. Item « Échelles »
complété pour couvrir explicitement le sens réel→plan (division par n),
qui n'était pas énoncé alors que testé symétriquement par
`genEchelleDistancePlanNumeric` (seul le sens plan→réel était donné).
Reste déjà au niveau attendu (3 branches, formule vitesse/énergie/débit
déjà présente, piège classique échelle/unités déjà présent, branche
« Problèmes contextualisés » déjà claire). Fichier purement numérique,
aucune figure, aucun symbole €, aucun candidat texTable.

**Avec ce fichier, la 3e est intégralement terminée (14/14).** Les 6
fichiers confiés dans cette session (probabilites, thales-triangles-
semblables, trigonometrie-triangle-rectangle, transformations-plan,
geometrie-espace, mesures-grandeurs) ont tous été relus intégralement.
Point notable : `thales-triangles-semblables-troisieme.js` avait une
**vraie correction de fond** dans `genThalesPapillonNumeric` (formule
enseignée par l'exercice contredisait la formule, correcte, du Cours —
DE et DF étaient inversés). Deux autres gaps de fond notables : la
rotation était totalement absente du cours de
`transformations-plan-troisieme.js` alors que directement testée par un
générateur dédié ; le coefficient de réduction d'une section de pyramide
(k = hauteur coupe / hauteur totale) était absent de
`geometrie-espace-troisieme.js` alors que littéralement utilisé dans les
steps d'un générateur.

`geometrie-espace-troisieme.js` (3e) relu intégralement : item ajouté à
« Section d'une pyramide ou d'une sphère » sur le coefficient de
réduction k = hauteur de la coupe ÷ hauteur totale (formule littéralement
utilisée dans les steps de `genSectionPyramideLongueurNumeric` mais
absente du cours, qui ne mentionnait que la nature « réduction » sans
donner le moyen de calculer le coefficient) ; item ajouté à « La sphère :
aire et volume » sur le volume d'une demi-sphère = moitié du volume
complet (testé par `genVolumeDemiSphereNumeric` mais absent). Reste déjà
au niveau attendu (sphère terrestre déjà claire avec formule
cos(latitude), section cube/cylindre déjà claire, 4 figures déjà bien
construites — solides finis sans besoin d'arrows, axe des pôles dans
`buildLatitudeParalleleFigure` schématique fini, pas une droite
infinie). Aucun symbole €, aucun candidat texTable.

`transformations-plan-troisieme.js` (3e) relu intégralement : gap de
fond comblé dans « Coordonnées d'une image » — la rotation était
totalement absente du cours (seules translation/symétrie centrale/
symétrie axiale étaient couvertes) alors que
`genImageRotationCoordNumeric` teste directement les 3 formules de
coordonnées (90°/180°/270° sens direct) ; formules ajoutées, groupées par
angle. Piège classique ajouté sur le sens direct = sens trigonométrique
(chaque appel du générateur le précise dans le prompt lui-même, signe
d'une confusion attendue, mais le cours ne le rappelait pas). Reste déjà
au niveau attendu (branches homothétie coefficient/périmètre+aire/
propriétés conservées déjà claires, piège classique aire=k² déjà présent,
figures déjà claires). Aucun symbole €, aucun candidat texTable.

`trigonometrie-triangle-rectangle-troisieme.js` (3e) relu intégralement :
piège classique ajouté à « Calculer une longueur » (si le côté cherché
est au dénominateur, souvent l'hypoténuse, on divise ; sinon, on
multiplie) — seule branche du fichier sans piège classique explicite,
alors que `genCalculerLongueurCosinusNumeric`/`Sinus`/`Tangente`/
`genCalculerHypotenuseTrigoNumeric` alternent justement entre demander
l'hypoténuse (division) et demander le côté opposé/adjacent
(multiplication) à partir de la même relation, confusion fréquente
(multiplier systématiquement). Reste déjà au niveau attendu (4 branches,
figure `buildTrigoTriangleFigure` claire et bien étiquetée — triangle
fini, aucun arrowStart/arrowEnd nécessaire). Aucun symbole €, aucun
candidat texTable.

`thales-triangles-semblables-troisieme.js` (3e) relu intégralement :
**correction de fond** dans `genThalesPapillonNumeric` — les variables DE
et DF étaient inversées par rapport à la configuration décrite dans le
prompt (« droites (AE) et (BF) sécantes en D » implique DA/DE sur la même
droite (AE) et DB/DF sur la même droite (BF), donc DE = DA×k et
DF = DB×k), alors que le générateur calculait l'inverse et enseignait
dans son step « regle » la formule DA/DF = DB/DE = AB/EF, en contradiction
directe avec la formule DA/DE = DB/DF = AB/EF déjà correcte dans le Cours
(branche « Configuration papillon ») — corrigé pour que le générateur et
le Cours enseignent la même formule, cohérente avec la figure
`buildPapillonFigure()` (déjà géométriquement correcte). Cours : item
ajouté à « Agrandissement, réduction, triangles semblables » sur le
coefficient réciproque 1/k (testé par `genCoefficientReciproqueNumeric`
mais totalement absent du cours avant cette relecture). Reste déjà au
niveau attendu (3 autres branches déjà claires, pièges classiques déjà
présents, 3 figures bien proportionnées et étiquetées sans chevauchement).
Aucun symbole €, aucun candidat texTable.

`probabilites-troisieme.js` (3e) relu intégralement : item ajouté à
« Calculer une probabilité » sur la conversion pourcentage/décimal
(p% = p/100, testée par `genProbabiliteDepuisPourcentageNumeric` mais
absente du cours) ; piège classique ajouté sur la simplification en
fraction irréductible (`genProbabiliteDeNumeric`/`genProbabiliteCarteQCM`/
`genProbabiliteMultipleNumeric` demandent tous une fraction irréductible
p/q, dont `genProbabiliteCarteQCM` propose explicitement la fraction non
simplifiée comme distracteur, mais aucun item du cours ne rappelait la
nécessité de simplifier). Reste déjà au niveau attendu (4 branches,
vocabulaire/équiprobabilité/événement contraire/tirage sans remise déjà
clairs et concrets, piège classique tirage sans remise déjà présent).
Fichier purement numérique, aucune figure, aucun symbole €, aucun
candidat texTable (les 2 énumérations de probabilités restent à 4 valeurs
décimales courtes maximum, sous le seuil).

`statistiques-troisieme.js` (3e) relu intégralement : 3 items ajoutés au
cours — relation inverse pour retrouver une valeur manquante connaissant
la moyenne (testé par `genValeurManquanteMoyenneNumeric` mais absent) ;
formule tableur MOYENNE(plage) avec piège classique sur la ligne
d'en-tête (testé par `genFormuleTableurQCM`, dont les distracteurs
incluent une plage démarrant à la ligne 1 au lieu de 2, mais absent du
cours) ; technique de la classe médiane par cumul d'effectifs (testée par
`genMedianeClasseQCM`, seule technique de "Tableau à classes" totalement
absente du cours). Exercices : 8 prompts convertis en `texTable()` (import
ajouté) — `genMoyenneSimpleNumeric`/`genMedianeImpairNumeric`/
`genMedianePairNumeric`/`genEtendueNumeric`/
`genValeurManquanteMoyenneNumeric` énuméraient une série de 5 à 11 valeurs
séparées par " ; " en prose (risque de débordement fort sur mobile pour
n=11) ; `genMoyennePondereeNumeric` énumérait jusqu'à 5 fragments de
phrase grammaticalement variables ; `genComparerSeriesQCM` énumérait 2
séries de 5-6 notes en prose (motif déjà corrigé sur
statistiques-quatrieme.js) ; `genLectureTableauEffectifsQCM` et
`genMoyenneClasseNumeric`/`genMedianeClasseQCM` énuméraient des paires
catégorie/classe + effectif en prose (motif "Catégorie/Effectif" déjà
corrigé sur statistiques-quatrieme.js). Branches "Comparer deux séries" et
"Diagramme circulaire" laissées inchangées (déjà au niveau attendu).
Aucun symbole € dans le fichier.

**Les 7 fichiers de 3e confiés dans cette session sont terminés**
(calcul-numerique, calcul-litteral, equations, notion-fonction,
fonctions-affines, proportionnalite, statistiques — en plus de
nombres-entiers-troisieme.js terminé en amont). Il reste 6 fichiers de 3e
dans la checklist ci-dessous (probabilites, thales-triangles-semblables,
trigonometrie-triangle-rectangle, transformations-plan, geometrie-espace,
mesures-grandeurs), puis la 2nde et le lycée.

`proportionnalite-troisieme.js` (3e) relu intégralement : branche "Ratios"
scindée en deux branches distinctes ("Ratios : simplifier, comparer,
exprimer en %" et "Appliquer une proportionnalité") : sur 6 générateurs de
la section Ratios, seuls 2 (simplifier, partager) étaient couverts par les
2 items d'origine. Ajouts : item sur le ratio équivalent par mise à
l'échelle (testé par `genRatioEquivalentQCM` mais absent — le cours ne
montrait que la simplification, direction inverse), item sur l'expression
d'un ratio en pourcentage (testé par `genPourcentageDepuisRatioNumeric`
mais absent), item sur la technique du produit en croix/valeur unitaire
pour une proportionnalité concrète type recette à l'échelle (testé par
`genRecetteEchelleNumeric` mais absente du cours alors que c'est la
technique centrale du chapitre — formule \\(a/b=c/d \\Rightarrow ad=bc\\)
ajoutée, absente de tout le fichier avant), item sur la résolution
ratio+différence connue (testé par `genDeuxNombresRatioDifferenceNumeric`
mais absent). Branches "Coefficient multiplicateur", "Enchaîner des
évolutions" (piège classique déjà présent) et "Coefficient réciproque"
laissées inchangées (déjà au niveau attendu). Fichier purement numérique,
aucune figure. 8 usages de € dans le fichier, tous en prose courte,
aucun candidat texTable.

`fonctions-affines-troisieme.js` (3e) relu intégralement : piège classique
ajouté à "Identifier a et b" (pour f(x)=(px+q)/d, il faut diviser CHAQUE
terme du numérateur par d, pas seulement le terme en x — testé par
`genMettreSousFormeFractionNumeric` mais absent du cours, même famille
d'erreur que celle déjà signalée dans calcul-litteral-troisieme.js/
equations-troisieme.js cette session) ; item de "Droites et coefficients"
enrichi pour couvrir la taxonomie complète linéaire/affine/constante
(b=0 ⇒ linéaire, a=0 ⇒ constante), testée par le QCM à 3 réponses
`genFonctionLineaireVsAffineQCM` mais dont seul le cas linéaire était
mentionné avant cette relecture (le cas constante n'apparaissait nulle
part). Branches "Déterminer une fonction affine" et "Comparer deux
tarifs" laissées inchangées (déjà au niveau attendu). Fichier purement
algébrique, aucune figure. 3 prompts avec € restent en prose courte,
aucun candidat texTable.

`notion-fonction-troisieme.js` (3e) relu intégralement : notation
\\(x \\mapsto 10^x\\) de la branche "Cas particuliers" remplacée par
\\(m(x)=10^x\\), pour rester cohérente avec la notation f(x) utilisée
partout ailleurs dans ce fichier et avec `genPuissanceDixAntecedentNumeric`
lui-même qui définit "la fonction m par m(x) = 10^x" (même famille de bug
que celui déjà repéré sur `notion-fonctions.js` 4e, ici en sens inverse
puisque f(x) est la notation propre à la 3e). Reste déjà au niveau attendu
(4 branches, piège classique pertinent). Exercices :
`genLectureTableauImageNumeric` et `genLectureTableauAntecedentNumeric`
énuméraient jusqu'à 5 couples f(x)=y en prose séparés par des virgules —
exactement le même bug déjà corrigé sur `notion-fonctions.js` 4e (mêmes
deux générateurs à l'identique) — convertis en `texTable()` (import
ajouté). Aucun symbole € dans le fichier.

`equations-troisieme.js` (3e) relu intégralement : piège classique ajouté
à "Équation du premier degré" (en multipliant par le dénominateur commun,
il faut multiplier TOUS les termes, pas seulement les fractions — testé
par `genResoudreEquationFractionsNumeric` mais oubli fréquent non prévenu
par le cours) ; piège classique ajouté à "Équation produit" (résoudre
ax+b=0 donne x=-b/a, oubli du signe — testé explicitement par
`genCorrigerErreurSigneEquationProduitQCM`, un QCM "un élève commet des
erreurs de signe") ; branche "Modéliser un problème" renommée "Modéliser
un problème, programmes de calcul" et complétée d'un item dédié (traduire
chaque programme en expression littérale puis égaliser) — ce thème a son
propre chapter (`Équations — Programmes de calcul`,
`genProgrammeMemeResultatNumeric`) mais n'apparaissait nulle part dans le
cours avant cette relecture. Branche "Équation x² = a" laissée inchangée
(déjà au niveau attendu, piège classique déjà présent). Fichier purement
algébrique, aucune figure. Un seul € dans tout le fichier (2 valeurs en
prose courte), pas un candidat texTable.

`calcul-litteral-troisieme.js` (3e) relu intégralement : branche
"Programmes de calcul, problèmes" scindée en deux branches distinctes
("Programmes de calcul" et "Problèmes de périmètre et d'aire") : le titre
promettait deux thèmes mais aucun item ne couvrait les problèmes de
périmètre/aire testés par `genAireRectangleDifferenceCarresNumeric` et
`genPerimetreCarreEgalRectangleNumeric` ; item ajouté sur la traduction
grandeur→expression en x puis substitution, piège classique ajouté
(périmètre carré 4×côté vs rectangle 2×(L+l)). Branche "Programmes de
calcul" : item ajouté sur la démonstration par développement/
simplification jusqu'à une expression donnée (testé par
`genProgrammeCarreToujoursNumeric` mais absent, seule la technique par
factorisation pour un multiple était couverte). Branche "Développer" :
item de distributivité simple k(ax+b)=kax+kb ajouté avant la double
distributivité (testée en premier par
`genDevelopperSimpleDistributiviteGeneraleNumeric` mais absente du cours) ;
piège classique ajouté sur la soustraction d'une parenthèse à deux termes
(testé par `genCorrigerErreurEleveQCM`). Branche "Factoriser" : item
requalifié en piège classique explicite (plus grand facteur commun vs
factorisation partielle, testé par `genFactoriserPlusGrandFacteurCommunQCM`)
et formule ajoutée (ax+bx=x(a+b)), qui n'en avait aucune. Branche
"Identités remarquables" laissée inchangée (déjà au niveau attendu). Fichier
purement algébrique, aucune figure, aucun €, aucun candidat texTable
(prompts = courtes expressions LaTeX).

`calcul-numerique-troisieme.js` (3e) relu intégralement : piège classique
ajouté à la branche "Opérations sur les fractions" (dans une expression
avec + ou − et ×, on calcule d'abord la multiplication, comme pour les
décimaux — testé par `genPrioriteFractionsNumeric` mais absent du cours)
et à la branche "Puissances" (sans parenthèses on calcule d'abord les
puissances puis l'addition/multiplication, avec parenthèses l'intérieur
d'abord, \\((a+b)^2 \\neq a^2+b^2\\) en général — testé par
`genPrioritePuissanceSommeNumeric`/`genPrioritePuissanceProduitNumeric`
mais absent). Sur 4 branches, seule "Écriture scientifique" avait un
piège classique explicite avant cette relecture, alors que les priorités
opératoires sont directement testées par 3 générateurs. Reste déjà au
niveau attendu (branches "Racines carrées" et "Écriture scientifique"
déjà claires et concrètes, formules déjà présentes où utiles). Fichier
purement numérique/algébrique, aucune figure, aucun symbole €, aucun
candidat texTable (tous les prompts restent de courtes expressions LaTeX
ou 2 phrases narratives, jamais une énumération chiffrée).

`nombres-entiers-troisieme.js` (3e) relu intégralement : **vraies
corrections de fond**. Branche "Divisibilité, nombres premiers" scindée en
deux branches distinctes ("Divisibilité" et "Nombres premiers") et
complétée : les critères de divisibilité (par 2/5/10, 3/9, 4/6), testés
directement par `genCritereDivisibiliteQCM` mais totalement absents du
cours avant cette relecture, ajoutés groupés par technique (unités / somme
des chiffres / cas composés) pour la mémorisation. Piège classique ajouté
à "Nombres premiers" sur les conjectures (un seul contre-exemple suffit à
invalider — testé par `genConjectureNombrePremierQCM`, exemple classique
d'Euler n²+n+41, mais absent du cours). Piège classique ajouté à
"Divisibilité" sur la parité d'un programme de calcul (testé par
`genProgrammeCalculPariteGeneraleQCM` mais absent). Branche "Décomposition
en facteurs premiers" : formule du nombre de diviseurs ajoutée
(N=p^a×q^b ⇒ (a+1)(b+1) diviseurs), littéralement énoncée dans les steps
de `genNombreDeDiviseursNumeric` mais absente du cours. Branche "Division
euclidienne" : exemple concret (17÷5) ajouté avant la règle abstraite.
Branche "PGCD" laissée inchangée (déjà bonne). Fichier purement
numérique/algébrique (pas de figure), aucun €, aucun candidat texTable
(liste de nombres dans `genCompterNombresPremiersListeNumeric` reste
courte sur une ligne).

`geometrie-espace-quatrieme.js` (4e) relu intégralement : branche
« Pyramide » reformulée pour partir du concret (base carrée = 5 faces / 5
sommets, puis généralisation n+1/n+1/2n incluant la formule des arêtes,
absente jusqu'ici alors que testée par un générateur) au lieu de démarrer
par le terme abstrait « base n-gonale » ; piège classique ajouté (ne pas
oublier de diviser par 3) — seule branche du fichier sans piège classique
avant cette revue. Branche « Repérage » : piège classique ajouté (ordre
abscisse/ordonnée/altitude, à ne pas confondre avec longueur/largeur/
hauteur). Reste déjà au niveau attendu (3 branches, formules utiles,
figures buildPyramideFigure/buildConeFigure/buildPaveRepereFigure déjà
claires ; cohérent avec la convention déjà établie sur geometrie-espace.js
5e : les solides finis n'ont pas besoin d'arrowStart/arrowEnd). Aucun
candidat texTable, aucun €.

`geometrie-plane.js` (4e) relu intégralement : piège classique ajouté à
« Angles dans un triangle » (isocèle : retirer d'abord l'angle au sommet à
180°, puis partager le reste par 2, pas de division par 3) ; piège
classique ajouté à « Translations » (image retournée type miroir = pas
une translation). Seules 2 des 3 branches avaient un piège classique
avant cette revue. Reste déjà au niveau attendu (3 branches, formule
utile, figures buildAngleTriangleFigure/buildEgaliteTrianglesFigure/
buildTranslationFigure toutes claires, ticks côté-côté-côté bien appariés,
flèche de translation déjà présente). Aucun candidat texTable, aucun €.

`theoreme-thales.js` (4e) relu intégralement : figure ajoutée à la branche
« Problèmes, agrandissement/réduction » (seule branche géométrique du
fichier sans figure, alors que les 3 autres en ont une), item réécrit pour
partir du concret (le petit triangle AMN est un agrandissement/réduction
du grand ABC) avant la règle du coefficient. Reste déjà au niveau attendu
(4 branches, formule utile, pièges classiques déjà bien ciblés : ordre du
quotient, alignement des points). Le grep mécanique qui avait repéré ce
fichier comme candidat (contexte long) est un faux positif confirmé : le
long contexte est le commentaire d'en-tête narratif, pas un prompt
d'exercice. Aucun candidat texTable, aucun symbole €.

`triangles-rectangles-quatrieme.js` (4e) relu intégralement : piège
classique ajouté à la branche « Théorème de Pythagore » (ne pas s'arrêter
à BC², il faut ensuite calculer la racine carrée) — seule branche du
fichier sans piège classique explicite, alors que l'oubli de la racine
carrée est une erreur très fréquente et visible dans les steps mêmes des
exercices. Reste déjà au niveau attendu (4 branches, formules utiles,
figures buildRightTriangleFigure toutes claires et bien étiquetées, pièges
classiques déjà présents ailleurs : bon sommet dans la réciproque, côté
adjacent qui change selon l'angle). Aucun candidat texTable, aucun €.

`proportionnalite-quatrieme.js` (4e) relu intégralement : branche
« Grandeurs produits et quotients » reformulée pour partir du concret
(vitesse/débit/densité nommés d'abord, puis la règle) au lieu de démarrer
par le terme abstrait "grandeur quotient" ; piège classique ajouté sur la
conversion km/h ↔ m/s (diviser par 3,6, pas multiplier), testée par un
générateur mais absente jusqu'ici de cette branche. Reste déjà bon (4
branches, piège classique déjà présent et pertinent dans « Agrandissement,
réduction »). Aucun candidat texTable (le seul tableau à 2 colonnes du
fichier ne liste que 2 couples, sous le seuil).

`notion-fonctions.js` (4e) relu intégralement : notation \\(x \\mapsto
ax+b\\) remplacée par une formulation en langage naturel dans la branche
« Fonction et proportionnalité », pour rester cohérente avec le Cours et
les exercices qui n'utilisent jamais f(x) ni la flèche mapsto ailleurs
dans le fichier (f(x) est réservée à la Troisième — même famille de bug
que celui déjà repéré sur `fonctions.js` en 5e). Reste déjà bon (3
branches, piège classique pertinent sur image/antécédent). Exercices : 2
générateurs "tableau de valeurs" (jusqu'à 5 couples x/y en prose avec
flèches — exactement le bug de présentation d'origine signalé par Romain)
et 1 générateur "proportionnalité" convertis en `texTable()`.

`probabilites-quatrieme.js` (4e) relu intégralement : branches
« Équiprobabilité » et « Calculer une probabilité » inversées (l'ancienne
1ère branche utilisait le terme « équiprobabilité » dans sa formule avant
que la 2e branche ne le définisse). Reste déjà bon (4 branches, formules
utiles, pièges classiques déjà bien ciblés : couleurs vs boules dans une
urne, somme des probabilités = 1). Exercices : 2 prompts convertis en
`texTable()` (vérification d'une répartition de probabilités jusqu'à 5
valeurs en prose ; tableau de probabilités à compléter qui se disait déjà
« tableau » mais s'affichait en énumération prose).

`statistiques-quatrieme.js` (4e) relu intégralement : formule de la moyenne
pondérée réécrite sans notation Σ/indices (non enseignée au collège,
remplacée par une somme explicite \\(v_1 e_1 + v_2 e_2 + \\cdots\\)).
Reste déjà bon (4 branches, piège classique pertinent, distinction
médiane/moyenne déjà explicite). Exercices : 5 prompts qui énuméraient
jusqu'à 5-7 valeurs chiffrées en prose (série valeurs/effectifs,
notes/coefficients, salaires de deux entreprises avec €, effectifs d'un
tableau, effectifs par catégorie) convertis en `texTable()` — même bug de
présentation que l'énumération "jusqu'à X kg → Y €" déjà corrigée ailleurs
— avec labels "(en euros)" pour respecter la règle jamais-€-en-cellule.

`resolution-equations.js` (4e) relu intégralement : branche "Tester une
solution" reformulée pour partir du concret (remplacer x puis calculer
chaque membre) plutôt que de la définition abstraite ("une solution
vérifie l'égalité"). Reste déjà au niveau attendu : formule utile dans
"Résoudre pas à pas", piège classique déjà présent et pertinent dans
"Traduire un problème" (relire la solution dans le contexte : âge/prix ne
peut pas être négatif), 3 branches concises. Aucun candidat texTable
(prompts déjà courts et narratifs).

`calcul-litteral-quatrieme.js` (4e) relu intégralement : formules ajoutées
aux branches "Exprimer, évaluer", "Réduire" et "Factoriser" (aucune des
trois n'en avait, contrairement à "Développer"), chacune avec un exemple
numérique concret (évaluer 3x-2 pour x=4 ; réduire 3x-5+2x ; factoriser
ka+kb=k(a+b), qui fait écho à la formule de développement déjà présente).
Le candidat repéré par le grep mécanique (fichier signalé comme "prompt
possiblement trop long") a été vérifié sérieusement : **faux positif** —
les lignes de code longues (`genReduireExpressionQuadratiqueCoefficientNumeric`,
`genFactoriserParentheseCommuneNumeric`) contiennent des ternaires de
signes dans le code source, mais le prompt affiché une fois substitué
reste une seule expression algébrique courte, pas une énumération
chiffrée en prose. Reste déjà au niveau attendu (pièges classiques déjà
bien ciblés : signe devant une parenthèse, \\((-x)^2\\) vs \\(-x^2\\)).
Aucun € dans le fichier.

`puissances-quatrieme.js` (4e) relu intégralement : **RAS, aucun
changement**. Cours déjà exemplaire (4 branches : Règles de calcul, Signe
d'une puissance, Notation scientifique, Racine carrée), formules déjà
présentes et utiles partout où pertinent, pièges classiques déjà bien
ciblés et cohérents avec les exercices. Aucun € dans le fichier, aucun
candidat `texTable()` (prompts déjà courts, max 171 caractères).

`multiplication-division-rationnels.js` (4e) relu intégralement : formule
ajoutée à la branche "Opposé et inverse" (opposé de 2/3 = -2/3 ; inverse de
2/3 = 3/2, affichés côte à côte), qui n'en avait aucune alors que le piège
classique de cette branche porte justement sur la confusion opposé/inverse.
Reste déjà au niveau attendu (branches "Multiplier des fractions",
"Diviser par une fraction", "Priorités et problèmes" déjà claires et
concrètes, formules déjà présentes où utiles). Aucun € dans le fichier,
aucun candidat `texTable()` (prompts déjà courts, max 278 caractères).

`addition-soustraction-rationnels.js` (4e) relu intégralement : branche
"Rappels : simplifier, comparer" — les 2 items qui n'avaient pas d'exemple
numérique en ont reçu un (décomposition de 60 en facteurs premiers,
produits en croix sur 3/4 vs 5/6) ; formule ajoutée à la branche "Trouver
un dénominateur commun" (PPCM(4,6)=12), qui n'en avait aucune alors que
c'est l'étape la plus utilisée dans les exercices. Reste déjà au niveau
attendu (branches "Additionner, soustraire" et "Problèmes de proportions"
déjà claires et concrètes, piège classique déjà présent sur l'entier
relatif à réécrire en fraction). Aucun € dans le fichier, aucun candidat
`texTable()` (prompts déjà courts, max 326 caractères).

`nombres-relatifs-quatrieme.js` (4e) relu intégralement : branche "Signe
inconnu (produit, quotient)" renommée "Signe inconnu, programmes de
calcul" (l'item sur les programmes de calcul n'avait pas sa place sous un
titre parlant uniquement de signe) ; piège classique de la branche
"Priorités opératoires" reformulé pour coller à ce que testent réellement
les exercices (`genErreurCalculatriceQCM` teste l'oubli de multiplier
TOUTE la parenthèse par le facteur, pas la distribution d'un signe « - »
que décrivait l'ancien piège et qu'aucun exercice du fichier ne teste) ;
formules ajoutées aux 3 premières branches (aucune n'en avait) avec
exemples numériques concrets pour la mémorisation (ex.
\\((-3)+(-5)=-8\\), \\((-4)\\times(-3)=12\\)). Reste déjà au niveau
attendu (règles des signes, priorités déjà claires et bien pourvues en
pièges classiques). Aucun symbole € dans le fichier, aucun candidat à
`texTable()` (prompts déjà courts et narratifs, max 341 caractères).

`algorithmique-cinquieme.js` (5e) relu intégralement : piège classique
ajouté à la branche "Traduire et calculer une formule" (bien recopier le
signe + ou − de la formule dans l'instruction Calculer — testé par le
distracteur `wrongFormula` de `genTraduireFormuleProgrammeQCM` mais absent
du cours). Fichier déjà exemplaire par ailleurs : pseudo-code déjà
présenté via `texTable()` dans tous les générateurs concernés
(Lire/Calculer/Afficher/Répéter en colonnes — exactement la bonne pratique
demandée après le bug de débordement mobile corrigé ailleurs), aucun € dans
une cellule de tableau, cours déjà concis (4 branches), piège classique
sur les boucles déjà présent, vocabulaire déjà clair et bien aligné avec
`genVocabulaireAlgorithmiqueQCM`.

`fonctions.js` (5e) relu intégralement : deux corrections de fond trouvées
en scannant les générateurs, en plus de la relecture du cours —
`genAireCarreFonctionCoteNumeric` utilisait la notation fonctionnelle
`A(c) = c × c` et `genProgrammeCalculFonctionNumeric` introduisait
explicitement « on note f la fonction... Calcule f(x) », deux usages de la
notation f(x) en contradiction directe avec la NOTE de tête de fichier qui
affirme cette notation retirée/reformulée partout dans ce chapitre 5e
(réservée à la Troisième par le programme officiel) — les deux reformulés
sans notation fonctionnelle, cohérents avec le reste du fichier. Cours :
piège classique ajouté à la branche "Évaluer une formule" (pour retrouver
le nombre de départ, on refait les étapes en sens inverse avec les
opérations inverses — testé par `genRetrouverDepartFonctionNumeric` et
`genDiametreEolienneNumeric` mais absent du cours). Reste déjà au niveau
attendu (vocabulaire, proportionnelle ou non, formules en contexte réel
déjà clairs). Aucun candidat à `texTable()` (énumérations restent à 3-4
items courts, sous le seuil).

`proportionnalite-cinquieme.js` (5e) relu intégralement : branche
"Pourcentages" — item qui entassait remise et majoration/TVA en une seule
puce éclaté en deux items distincts, piège classique ajouté (une remise de
p % n'est pas « soustraire p » au prix, il faut d'abord calculer le
montant de la remise puis le soustraire — testé par
`genPrixApresRemiseNumeric` mais absent du cours) ; branche "Identifier
une situation" enrichie d'une formule illustrant le critère d'égalité des
quotients (\\(b_1/a_1 = b_2/a_2\\)), qui n'en avait pas alors que les 4
autres branches en ont une. Reste déjà au niveau attendu (coefficient/
valeur manquante, échelles, vitesse déjà clairs et concrets, piège
classique tarif+abonnement déjà présent). Le candidat repéré par le grep
mécanique a été vérifié : les prompts avec 2-3 valeurs en € restent en
prose fluide et courte (jamais une énumération multi-lignes du type
"jusqu'à X kg → Y €"), aucun candidat réel à `texTable()`.

`statistiques-probabilites.js` (5e) relu intégralement : piège classique
ajouté à la branche "Calculer une probabilité" (pour comparer qui a le
plus de chances entre plusieurs sacs, on compare les proportions/fractions,
pas les nombres bruts de billes favorables — testé par
`genComparerProbabilitesSacsQCM` mais absent du cours avant cette
relecture). Reste déjà au niveau attendu (effectifs/fréquences, moyenne
déjà claires et concrètes, piège classique valeurs extrêmes déjà présent,
vocabulaire des probabilités déjà clair). Prompts d'exercices vérifiés,
aucun candidat clair à `texTable()` (listes d'effectifs/probabilités
restent courtes et compactes), aucun symbole € présent dans le fichier.

`triangles.js` (5e) relu intégralement : petite correction ciblée. Piège
classique ajouté à la branche "Médiatrices, hauteurs, médianes" pour
désambiguïser les trois cévians dont les noms se ressemblent et sont
classiquement confondus par les élèves (médiatrice = perpendiculaire au
milieu d'un côté, ne passe pas forcément par le sommet opposé ; hauteur =
passe par le sommet, perpendiculaire au côté opposé ; médiane = passe par
le sommet et le milieu du côté opposé). Le reste du fichier est déjà au
niveau attendu (angles/classification, isocèle/rectangle, aire déjà clairs
et concis, piège classique déjà présent pour l'aire — hauteur perpendiculaire,
pas un côté oblique), figures `buildTriangleFigure` toutes bien proportionnées
et étiquetées sans chevauchement, formules déjà utiles. Prompts d'exercices
déjà courts et narratifs, aucun candidat à `texTable()`.

**Les 4 fichiers de 5e confiés dans cette session sont terminés**
(nombres-relatifs, geometrie-espace, symetrie-centrale-parallelogrammes,
triangles). Il reste 4 fichiers de 5e dans la checklist ci-dessous
(statistiques-probabilites, proportionnalite-cinquieme, fonctions,
algorithmique-cinquieme), puis la 4e, la 3e, la 2nde et le lycée.

`symetrie-centrale-parallelogrammes.js` (5e) relu intégralement : branche
"Symétrie centrale" enrichie d'un item sur le centre de symétrie des
figures usuelles (cercle, carré, rectangle, losange, parallélogramme vs
triangle équilatéral, pentagone régulier), notion testée par
`genCentresDeSymetrieFigureUsuelleQCM`/`genFiguresAvecCentreDeSymetrieMulti`
mais totalement absente du cours avant cette relecture. Branche "Angles et
droites parallèles" : item alternes-internes/correspondants reformulé en
équivalence bidirectionnelle (le cours ne donnait que le sens direct, alors
que `genDroitesParallelesTestAnglesQCM` teste la réciproque), item ajouté
sur deux droites perpendiculaires à une même troisième (testé par
`genPerpendiculairesMemeDroiteParallelesQCM` mais absent). Piège classique
ajouté à "Propriétés du parallélogramme" (diagonales égales/perpendiculaires
ne suffisent pas sans savoir déjà que c'est un parallélogramme — testé par
`genReconnaitreCasParticulierViaDiagonalesQCM`). Figures déjà claires, pas
d'axe gradué nécessitant des flèches (droites géométriques finies avec
`extend`, cohérent avec la convention d'`angles.js`/
`configurations-geometriques.js`). Le prompt candidat repéré par le grep
mécanique (`genAireParallelogrammeDemiDisquesComposeeNumeric`, 348
caractères) a été vérifié sérieusement comme demandé : **faux positif**,
c'est un problème d'aire composée légitimement long (pas une énumération de
valeurs chiffrées), pas un candidat à `texTable()`.

`geometrie-espace.js` (5e) relu intégralement : branche "Patrons et
perspective cavalière" — item qui entassait deux règles (arêtes cachées en
pointillés + parallélisme conservé) éclaté en deux puces distinctes ;
branche "Volumes des solides usuels" enrichie d'un item unifiant les trois
formules (Volume = aire de la base × hauteur, valable pour tout prisme
droit — éclaire `genVolumePrismeDroitBaseTriangleNumeric`, qui utilise ce
principe général sans qu'il soit énoncé dans le cours) ; piège classique
ajouté à "Conversions volume et capacité" (facteur 1000 entre unités de
volume, à ne pas confondre avec le facteur 10 des longueurs). Figures
`buildPaveCavaliereFigure`/`buildCylindreFigure`/`buildDisqueRayonFigure`
déjà claires et bien étiquetées (r, h), aucun axe/droite orienté à
corriger (segments finis de solides, pas de droite graduée). Prompts
d'exercices déjà courts et narratifs, aucun candidat à `texTable()`.

`nombres-relatifs.js` (5e) relu intégralement : branche "Droite graduée"
reformulée pour partir d'exemples concrets (opposé de 3, \\(|3|=|-3|=3\\))
avant la notation abstraite en a ; piège classique ajouté à "Additionner
des relatifs" (signes contraires : on soustrait les distances à zéro, on
ne les additionne pas — testé par `genAdditionnerDeuxRelatifsSignesContraires`
mais absent du cours) ; item de "Repérage dans le plan" sur les symétries
par axe éclaté en deux puces distinctes (axe des abscisses / axe des
ordonnées) au lieu d'une formulation ambiguë ("coordonnée perpendiculaire
à cet axe"). Flèches de `buildGraduatedLineFigure` et `buildRepereFigure`
(commit `da902e8`) confirmées toujours correctes, non retirées. Prompts
d'exercices vérifiés, aucun candidat clair à `texTable()`
(`genBilanCarboneAdditionSoustraction` reste à 3-4 items courts, sous le
seuil de conversion).

`calcul-litteral.js` (5e) relu : branche "Résoudre une équation" enrichie
d'une formule illustrant les deux types d'équations autorisés en 5e
(\\(x+5=12 \\Rightarrow x=7\\) ; \\(3x=12 \\Rightarrow x=4\\)), qui n'en
avait pas. Reste déjà au niveau attendu ("Traduire en formule", "Tester
une égalité", "Distributivité" déjà clairs et bien pourvus en pièges
classiques — notamment le piège "oublier de multiplier TOUS les termes
par k", bien aligné avec `genFactoriserTrouverFacteurCommun`/
`genTesterVraiFauxDeveloppementQCM`). Prompts d'exercices déjà bien
calibrés (le problème d'héritage façon Al-Khwârizmî, plus long et
narratif, reste sous 400 caractères et n'est pas une énumération à
convertir en tableau), aucun candidat `texTable()`.

`puissances.js` (5e) relu : branche "Carré et cube" clarifiée — la
formulation "multiplié par lui-même deux/trois fois" était ambiguë (source
de confusion classique entre nombre de facteurs et nombre de
multiplications, pourrait laisser croire que le cube = carré appliqué deux
fois), remplacée par des exemples numériques concrets
(\\(5^2=5\\times5=25\\), \\(5^3=5\\times5\\times5=125\\)). Reste déjà au
niveau attendu (puissances de dix, priorités avec puissances, aire/volume
déjà clairs et alignés sur les exercices, prompts courts, aucun candidat
`texTable()`).

`divisibilite-fractions.js` (5e) relu : branche "Multiples et diviseurs"
reformulée pour partir d'un exemple concret (\\(12 \\div 4 = 3\\)) avant la
définition abstraite en a/b ; branche "Comparer des fractions" enrichie
d'une formule illustrant les produits en croix sur un exemple concret
(n'en avait pas). Reste déjà au niveau attendu (nombres premiers, division
par un décimal, addition/soustraction de fractions déjà clairs et bien
pourvus en pièges classiques, prompts d'exercices courts, aucun candidat
`texTable()`).

`calcul-numerique.js` (5e) relu : piège classique ajouté à la branche
"Distributivité" (\\(k \\times (a+b) \\neq k \\times a + b\\), oubli de
distribuer sur le second terme — testé par
`genReconnaitreExpressionsEgalesDistributivite` mais absent du cours).
Reste déjà au niveau attendu (branches "Priorités opératoires", "Nommer
un calcul", "Programme de calcul", "Choisir la bonne opération" déjà
concrètes et courtes, aucun prompt d'exercice candidat à `texTable()`).

Lot `fractions.js` / `proportionnalite.js` / `operations-decimaux.js` /
`grandeurs-mesures.js` / `distances-symetries.js` (6e) relus intégralement.

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
- `distances-symetries.js` : petite correction. Carte mentale déjà bien
  construite (5 branches, pièges classiques déjà présents pour le
  disque/cercle — "sur" n'est pas "dans" — et pour la réciprocité de la
  symétrie, figures claires et non surchargées, aucune droite orientée à
  corriger car les médiatrices/axes n'ont pas de sens à indiquer).
  Seul défaut réel : la formule "diamètre = 2 × rayon" écrivait les mots
  français en mode maths brut (lettres italiques collées, mal rendu par
  KaTeX) — enveloppée en `\text{}`, cohérent avec le reste du fichier.
  Prompts d'exercices déjà tous courts et compacts, aucun candidat à
  `texTable()`.

- `angles.js` : **vraies corrections**. Branche "Nature d'un angle"
  reformulée : l'item qui entassait 4 définitions (aigu/droit/obtus/plat)
  dans une seule puce a été éclaté en puces distinctes, et les natures
  "nul" (0°) et "plein" (360°) — testées par `genNatureAngleQCM` et
  `genClassifierAngleMulti` mais absentes du cours — ajoutées au piège
  classique. Branche "Droites sécantes" (renommée "Deux droites qui se
  croisent") reformulée pour partir d'une image concrète (angles côte à
  côte / droites qui se croisent) avant d'énoncer la règle
  (supplémentaires / opposés par le sommet), le terme "sécantes" n'étant
  auparavant jamais expliqué. Branches Bissectrice et Angles d'un triangle :
  RAS. Figures toutes correctes (angles/triangles construits aux bonnes
  proportions, pas de chevauchement), pas de droite orientée à corriger
  (rayons d'angle, pas d'axes gradués). Prompts d'exercices déjà courts,
  aucun candidat à `texTable()`.

- `configurations-geometriques.js` : **vraie correction, ciblée**. Piège
  classique ajouté à la branche "Triangle isocèle" : « isocèle en A »
  signifie que A est le sommet principal (là où se rejoignent les deux
  côtés égaux), pas un angle à la base — confusion que les exercices
  testent explicitement via le paramètre `sommetLettre` de
  `genAngleTriangleIsocele`/`genProblemeIsoceleRectangleCombine` mais que
  le cours n'expliquait pas. Le reste (inégalité triangulaire, équilatéral,
  rectangle isocèle) déjà au niveau attendu — pièges déjà présents,
  figures claires (triangle générique étiqueté a/b/c pour l'inégalité,
  triangles avec codage de côtés/angle droit sans lettres superflues pour
  les autres), formules déjà utiles. Prompts d'exercices déjà courts,
  aucun candidat à `texTable()`.

- `organisation-gestion-donnees.js` : **vraies corrections**. Branche
  "Expérience aléatoire et échelle de probabilité" reformulée pour définir
  "expérience aléatoire" avant "issue" (l'ordre précédent utilisait le
  terme non défini pour définir l'autre). `genLireTableauDonneesValeur`
  convertie en `texTable()` : le prompt énumérait 7 paires âge→taille en
  prose continue ("0 mois → 50 cm ; 6 mois → 55 cm ; ..."), exactement le
  même défaut de débordement mobile que le cas d'origine corrigé dans
  `nombres-decimaux.js` (import `texTable` ajouté, même convention).
  `node check-cours-katex.mjs` échoue sur ce fichier avec
  `ERR_MODULE_NOT_FOUND` pour l'import extensionless de `texTable.js` —
  vérifié que c'est une limitation préexistante du script (échoue
  identiquement sur `nombres-decimaux.js`, qui a le même import depuis une
  session antérieure), pas un défaut introduit ici ; `npx vite build`
  passe sans erreur et confirme la résolution/syntaxe. Reste du fichier
  (branches "Lire des données", "Calculer une probabilité", "Événement
  contraire et fréquence") déjà au niveau attendu, pièges classiques déjà
  bien ciblés, figure du diagramme en bâtons claire.

**La 6e est intégralement terminée pour ce chantier** (9/9 fichiers :
nombres-decimaux, fractions, proportionnalite, operations-decimaux,
grandeurs-mesures, distances-symetries, angles,
configurations-geometriques, organisation-gestion-donnees). **Prochain
fichier à traiter : `calcul-numerique.js` (5e).** Puis le reste de la 5e,
4e, 3e dans cet ordre (périmètre de ce chantier = collège uniquement, voir
consigne — 2nde/lycée hors scope pour l'instant).

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
- [x] distances-symetries.js *(formule diamètre/rayon enveloppée en \text{}, sinon déjà bon)*
- [x] angles.js *(item "nature d'un angle" éclaté en puces + nul/plein ajoutés, branche "droites sécantes" reformulée)*
- [x] configurations-geometriques.js *(piège "isocèle en A = sommet principal" ajouté)*
- [x] organisation-gestion-donnees.js *(branche "expérience aléatoire" reformulée + genLireTableauDonneesValeur converti en texTable)*

### 5e
- [x] calcul-numerique.js *(piège classique distributivité k×(a+b)≠k×a+b ajouté, sinon déjà bon)*
- [x] divisibilite-fractions.js *(branche multiples/diviseurs partie du concret, formule produits en croix ajoutée)*
- [x] puissances.js *(formulation carré/cube clarifiée avec exemples numériques concrets, sinon déjà bon)*
- [x] calcul-litteral.js *(formule "résoudre une équation" ajoutée avec exemples concrets, sinon déjà bon)*
- [x] nombres-relatifs.js *(branche droite graduée reformulée en partant du concret, piège classique addition signes contraires ajouté, item symétries par axe éclaté en deux puces — flèches déjà correctes, non touchées)*
- [x] geometrie-espace.js *(item perspective cavalière éclaté en 2 puces, item unifiant Volume=aire base×hauteur ajouté, piège classique facteur 1000 ajouté)*
- [x] symetrie-centrale-parallelogrammes.js *(item centres de symétrie des figures usuelles ajouté, item angles parallèles reformulé en équivalence, item perpendiculaires-à-même-droite ajouté, piège diagonales ajouté ; candidat texTable du grep vérifié = faux positif)*
- [x] triangles.js *(piège classique désambiguïsant médiatrice/hauteur/médiane ajouté, sinon déjà bon)*
- [x] statistiques-probabilites.js *(piège classique ajouté à « Calculer une probabilité » — comparer les proportions entre sacs, pas les nombres bruts de billes favorables ; sinon déjà bon, aucun candidat texTable, aucun €)*
- [x] proportionnalite-cinquieme.js *(branche Pourcentages éclatée en items distincts remise/majoration + piège classique ajouté, formule ajoutée à « Identifier une situation » ; grep € vérifié = faux positif, aucun texTable)*
- [x] fonctions.js *(2 corrections de fond : A(c)=c×c et f(x) explicite retirés — contredisaient la NOTE du fichier interdisant f(x) en 5e ; piège classique ajouté sur l'inversion d'étapes)*
- [x] algorithmique-cinquieme.js *(piège classique ajouté sur le signe de la formule ; déjà exemplaire par ailleurs — texTable() déjà utilisé partout pour le pseudo-code, aucun €)*

### 4e
- [x] nombres-relatifs-quatrieme.js *(branche "Signe inconnu" renommée pour inclure les programmes de calcul ; piège classique priorités reformulé pour coller aux exercices ; formules ajoutées à 3 branches)*
- [x] addition-soustraction-rationnels.js *(exemples numériques ajoutés à 2 items sans exemple ; formule PPCM ajoutée à une branche qui n'en avait pas)*
- [x] multiplication-division-rationnels.js *(formule opposé/inverse ajoutée à une branche qui n'en avait aucune, aligne avec son piège classique)*
- [x] puissances-quatrieme.js *(déjà bon, RAS — cours exemplaire, formules et pièges déjà bien ciblés)*
- [x] calcul-litteral-quatrieme.js *(formules ajoutées à 3 branches sans formule ; candidat texTable du grep mécanique vérifié = faux positif)*
- [x] resolution-equations.js
- [x] statistiques-quatrieme.js
- [x] probabilites-quatrieme.js
- [x] notion-fonctions.js
- [x] proportionnalite-quatrieme.js
- [x] theoreme-thales.js *(figure ajoutée à la branche « Problèmes, agrandissement/réduction », seule branche géométrique sans figure ; item réécrit du concret vers la règle ; sinon déjà bon, faux positif du grep mécanique confirmé — commentaire d'en-tête long, pas un prompt)*
- [x] triangles-rectangles-quatrieme.js *(piège classique ajouté à « Théorème de Pythagore » — ne pas s'arrêter à BC², calculer la racine carrée ; sinon déjà bon, 4 branches, figures et pièges déjà bien ciblés ailleurs)*
- [x] geometrie-plane.js *(piège classique ajouté à « Angles dans un triangle » — isocèle : 180° moins l'apex, puis diviser par 2 ; piège classique ajouté à « Translations » — image retournée = pas une translation ; sinon déjà bon, 3 branches, figures et ticks déjà bien appariés)*
- [x] geometrie-espace-quatrieme.js *(item "Pyramide" reformulé du concret vers la généralisation + formule des arêtes ajoutée ; piège classique ajouté à "Pyramide" (diviser par 3) et à "Repérage" (ordre abscisse/ordonnée/altitude) ; sinon déjà bon, 3 branches, figures déjà claires)*

### 3e
- [x] nombres-entiers-troisieme.js *(branche "Divisibilité, nombres premiers" scindée en 2 + critères de divisibilité ajoutés, absents avant ; piège conjecture/contre-exemple ajouté ; piège parité ajouté ; formule nombre de diviseurs ajoutée ; exemple concret ajouté à division euclidienne)*
- [x] calcul-numerique-troisieme.js *(piège classique ajouté à « Opérations sur les fractions » — priorité × avant + / − ; piège classique ajouté à « Puissances » — priorité puissance avant + / ×, (a+b)² ≠ a²+b² ; sinon déjà bon, « Racines carrées »/« Écriture scientifique » déjà claires)*
- [x] calcul-litteral-troisieme.js *(branche « Programmes de calcul, problèmes » scindée en 2 ; item + piège classique ajoutés à « Problèmes de périmètre et d'aire » ; item ajouté à « Programmes de calcul » ; distributivité simple + piège classique ajoutés à « Développer » ; piège classique + formule ajoutés à « Factoriser »)*
- [x] equations-troisieme.js *(piège classique ajouté à « Équation du premier degré » — multiplier TOUS les termes par le dénominateur ; piège classique ajouté à « Équation produit » — x=-b/a, signe ; branche « Modéliser un problème » renommée « …, programmes de calcul » + item ajouté, thème absent du cours avant)*
- [x] notion-fonction-troisieme.js *(notation x↦10^x remplacée par m(x)=10^x pour cohérence avec f(x) partout ailleurs ; genLectureTableauImageNumeric/genLectureTableauAntecedentNumeric convertis en texTable(), même bug déjà vu sur notion-fonctions.js 4e)*
- [x] fonctions-affines-troisieme.js *(piège classique ajouté à « Identifier a et b » — diviser CHAQUE terme du numérateur par d ; item « Droites et coefficients » enrichi pour couvrir aussi le cas constante a=0, absent avant alors que testé par un QCM à 3 réponses)*
- [x] proportionnalite-troisieme.js *(branche « Ratios » scindée en 2 : « Ratios : simplifier, comparer, exprimer en % » et « Appliquer une proportionnalité » + formule produit en croix ajoutée ; items ajoutés pour ratio équivalent, ratio en %, produit en croix/valeur unitaire, ratio+différence — 4 des 6 générateurs de la section n'étaient pas couverts avant)*
- [x] statistiques-troisieme.js *(3 items ajoutés : valeur manquante via somme=moyenne×effectif, formule tableur MOYENNE(plage) + piège en-tête, classe médiane par cumul d'effectifs ; 8 prompts convertis en texTable() — séries de 5-11 valeurs en prose, notes de 2 élèves, catégorie/classe+effectif)*
- [x] probabilites-troisieme.js *(item conversion pourcentage/décimal ajouté à « Calculer une probabilité », absent alors que testé par genProbabiliteDepuisPourcentageNumeric ; piège classique simplification fraction irréductible ajouté, testé par 3 générateurs dont un avec distracteur non simplifié ; sinon déjà bon, 4 branches déjà claires)*
- [x] thales-triangles-semblables-troisieme.js *(correction de fond : DE/DF inversés dans genThalesPapillonNumeric, formule enseignée contredisait le Cours ; item coefficient réciproque 1/k ajouté, absent alors que testé ; sinon déjà bon, 3 figures déjà claires)*
- [x] trigonometrie-triangle-rectangle-troisieme.js *(piège classique ajouté à « Calculer une longueur » — diviser si l'inconnue est au dénominateur, multiplier sinon ; sinon déjà bon, figure déjà claire)*
- [x] transformations-plan-troisieme.js *(gap de fond comblé : rotation totalement absente du cours alors que testée par genImageRotationCoordNumeric, formules 90°/180°/270° ajoutées + piège classique sens direct ; sinon déjà bon, figures déjà claires)*
- [x] geometrie-espace-troisieme.js *(item coefficient de réduction pyramide k=hauteur coupe/hauteur totale ajouté, formule utilisée dans les steps mais absente du cours ; item volume demi-sphère ajouté ; sinon déjà bon, 4 figures déjà claires)*
- [x] mesures-grandeurs-troisieme.js *(piège classique conversion minutes→heures décimales ajouté, testé par genVitesseMoyenneAvecMinutesNumeric ; item échelle complété pour le sens réel→plan ; sinon déjà bon — 3e intégralement terminée, 14/14)*

### 2nde
- [x] nombres-calculs-seconde.js *(branche Intervalles enrichie — transformation d'encadrement/piège négatif ; règle |X|=b ajoutée ; branche Racines carrées et puissances scindée en 2 + piège √(a²)=|a| + nouvelle branche Puissances ; heuristique rapport/différence ajoutée)*
- [x] generalites-fonctions-seconde.js *(item modes de représentation ajouté ; item résolution équation quotient=constante ajouté ; 3 prompts tableau-en-prose convertis en texTable)*
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
