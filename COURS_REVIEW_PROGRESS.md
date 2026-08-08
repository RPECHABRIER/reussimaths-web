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

**La 5e, la 4e, la 3e, la 2nde, la Première non spé et la Première Spé
sont maintenant intégralement terminées (11/11 pour la Première Spé).
Prochain fichier : suites-numeriques-premiere-techno.js (Première
techno, 1er des 8 fichiers de ce niveau).**

`algorithmique-python-premiere-spe.js` (Première Spé) relu intégralement,
dernier fichier de ce niveau : 5 branches (4 avant). Nouvelle branche
« Conditions et vocabulaire de base » ajoutée, couvrant if/else, le test
de parité n % 2 == 0, l'instruction break et import random — thème
entier absent malgré 4 sous-cas de genVocabulaireAlgoQCM et
genCompleterConditionQCM qui le testent directement. Branche « Calculer
les termes d'une suite par script » enrichie : item sur les deux
schémas d'accumulation somme (part de 0, +=) vs produit (part de 1,
*=), absent avant. Aucun €, aucun candidat texTable supplémentaire (le
fichier utilise déjà texTable via pyBlock() pour le code, non touché).

`variables-aleatoires-premiere-spe.js` (Première Spé) relu
intégralement : 5 branches inchangées en nombre mais enrichies. Branche
« Loi de probabilité » enrichie : item sur la lecture cumulative de
P(X≤a) (à distinguer de P(X=a)), absente avant. Branche « Espérance »
enrichie : règle de comparaison de deux jeux par l'espérance, absente.
Branche « Loi binomiale B(n,p) » enrichie : formules des cas extrêmes
P(X=0)=(1-p)^n et P(X=n)=p^n ajoutées — la NOTE en tête de fichier
signale ces 2 générateurs comme ajout intentionnel mais le cours ne
donnait que E(X) et V(X). Aucun €, aucun candidat texTable, fichier
sans figure.

`probabilites-conditionnelles-premiere-spe.js` (Première Spé) relu
intégralement : 5 branches (4 avant). Nouvelle branche « Arbre pondéré :
deux règles à connaître » ajoutée — les règles de multiplication le long
d'un chemin et d'addition entre chemins n'apparaissaient dans aucune
branche avant, alors que 4 générateurs s'appuient dessus directement.
Branche « Épreuves de Bernoulli répétées » enrichie : formule complète
de la loi binomiale P(k succès)=C(n,k)p^k(1-p)^{n-k} ajoutée, absente
avant. Branche « Indépendance » enrichie : rappel de la formule de
l'union P(A∪B)=P(A)+P(B)-P(A∩B), testée par un générateur dédié mais
absente. Aucun €, aucun candidat texTable, fichier sans figure.

`geometrie-reperee-premiere-spe.js` (Première Spé) relu intégralement :
4 branches inchangées en nombre mais enrichies. Branche « Forme
développée du cercle » enrichie de la formule x_Ω=-D/2, y_Ω=-E/2,
r²=x_Ω²+y_Ω²-F, absente alors qu'utilisée directement dans 2 prompts.
Branche « Vecteur normal à une droite » enrichie : item sur la méthode
pour trouver c depuis un point et un vecteur normal. Branche
« Projection orthogonale et distance à une droite » enrichie : item sur
les cas simples droites horizontales/verticales, testés par 3
générateurs mais absents avant (seule la formule générale figurait).
Aucun €, aucun candidat texTable. Figures existantes non modifiées.

`vecteurs-produit-scalaire-premiere-spe.js` (Première Spé) relu
intégralement : 4 branches inchangées en nombre mais enrichies. Branche
« Produit scalaire : deux expressions » enrichie : symétrie u·v=v·u
(absente avant, chapter dédié) ; formule inversée cosθ=(u·v)/(‖u‖‖v‖)
pour retrouver un angle (absente) ; formule de la norme ‖u‖=√(x²+y²)
(absente). Branche « Développer, bilinéarité » enrichie : la règle de
bilinéarité elle-même (u+v)·w=u·w+v·w ajoutée en toutes lettres (le
titre l'annonçait mais seule la formule du carré de la somme figurait) ;
formule de développement de ‖u-v‖² ajoutée (seule la version ‖u+v‖²
existait) avec piège sur le signe du terme croisé. Aucun €, aucun
candidat texTable. Figures existantes non modifiées.

`trigonometrie-premiere-spe.js` (Première Spé) relu intégralement : 6
branches (5 avant). Nouvelle branche « Angles associés et signe selon
le quadrant » ajoutée — gap le plus grave du fichier : 7 générateurs
sur 21 (un tiers du fichier) testent les angles associés et le signe
selon le quadrant, sans qu'aucune de ces règles n'apparaisse dans une
seule branche avant. Branche « Cercle trigonométrique et radian »
enrichie : formule de longueur d'arc ℓ=r×θ ajoutée. Branche « Cosinus
et sinus » enrichie : tableau des valeurs remarquables (0, π/6, π/4,
π/3, π/2) ajouté en formule sous forme de vrai tableau LaTeX
\begin{array}, alors que 3 générateurs demandent de les connaître « par
cœur » sans qu'aucun tableau ne les récapitule avant. Aucun €, aucun
candidat texTable dans les exercices. Fichier géométrique : figures
existantes (cercle trigo, triangle rectangle) non modifiées, toujours
correctes.

`fonction-exponentielle-premiere-spe.js` (Première Spé) relu
intégralement : 5 branches (4 avant). Nouvelle branche « Modéliser une
croissance ou décroissance exponentielle » ajoutée, couvrant un thème
entier absent : genModeliserCroissanceDecroissanceQCM teste la forme
générale C(t)=C0 e^{kt} et la lecture du signe de k, absente de toute
branche avant, alors que c'est exactement l'application annoncée par le
champ pourquoi du chapitre. Aucun €, aucun candidat texTable, fichier
purement algébrique.

`variations-courbes-premiere-spe.js` (Première Spé) relu intégralement :
5 branches (4 avant). Nouvelle branche « Allure et symétrie de la
parabole » ajoutée, couvrant 2 thèmes entiers absents à chapter dédié :
orientation selon le signe de a (min/max) et symétrie par rapport au
sommet. Branche « Signe de f' et sens de variation » enrichie de 3
items : cas f'=0 ⟹ f constante (chapter dédié, absent) ; règle
d'utilisation de la monotonie pour comparer/encadrer des images ;
somme de deux fonctions de même monotonie. Branche « Extremums et
optimisation » enrichie d'une formule explicite α=-b/2a. Aucun €, aucun
candidat texTable, fichier purement algébrique.

`derivation-premiere-spe.js` (Première Spé) relu intégralement : 6
branches (5 avant). Nouvelle branche « Signe de f' et sens de
variation » ajoutée — gap le plus grave : le théorème fondamental
signe(f') → sens de variation n'apparaissait dans aucune branche avant,
alors que 2 générateurs entiers le testent directement, et que c'est la
raison d'être de la dérivation en analyse ; piège classique sur la
réciproque fausse (f'(a)=0 n'implique pas extremum). Branche
« Opérations » enrichie : règle (u+v)'=u'+v' ajoutée (seuls
produit/quotient y figuraient). Items ajoutés : dérivée nulle d'une
constante, non-dérivabilité (point anguleux, tangente verticale).
Aucun €, aucun candidat texTable, fichier purement algébrique.

`suites-numeriques-premiere-spe.js` (Première Spé) relu intégralement :
6 branches (5 avant). Nouvelle branche « Reconnaître une situation
arithmétique ou géométrique » ajoutée, couvrant un thème entier absent :
genModeliserPhenomeneQCM (chapter dédié) testait déjà la distinction
accroissement en montant fixe (arithmétique) vs en pourcentage fixe
(géométrique) sur 6 situations concrètes, absente de toute branche
avant, alors que c'est exactement le sujet annoncé par le champ pourquoi
du chapitre. Branche « Arithmétique et géométrique » enrichie : item +
formule sur l'extraction de la raison depuis deux termes consécutifs (r
= soustraction, q = division), méthode testée mais jamais formulée.
Branche « Sommes de termes » enrichie : formule de Gauss
1+2+...+n=n(n+1)/2 ajoutée, cas particulier testé par un générateur à
chapter dédié totalement absent du cours avant. Aucun €, aucun candidat
texTable, fichier purement algébrique sans figure.

`second-degre.js` (Première Spé) relu intégralement : 5 branches (4
avant). Nouvelle branche « Déterminer un trinôme à partir de données »
ajoutée, couvrant un thème entier totalement absent du cours avant :
trouver a depuis racines connues + un point (genConstructionRacines), et
trouver a,b depuis un système à deux points (2 exercices FIXED_BANK
« Bac • détermination de f »). Branche « Trois formes du trinôme »
enrichie de 2 items : identités remarquables (A+B)² et A²-B² pour
développer/factoriser sans discriminant (genExpandQCM, genFactorQCM,
absentes avant) ; règle du produit nul A×B=0 ⟺ A=0 ou B=0 (chapter dédié
de genFactoredEquation, jamais énoncée). Branche « Discriminant et
racines » enrichie : item sur les racines comme valeurs interdites d'un
quotient (chapter FIXED_BANK « Bac • domaine de définition », absent).
Branche « Sommet et sens de la parabole » enrichie : item sur la
symétrie de la parabole (FIXED_BANK « Bac • signe et variations »,
absent). Aucun €, aucun candidat texTable, fichier purement algébrique
sans figure (Figure.jsx ne supporte pas les paraboles, cohérent avec
modelisation-quadratique-premiere-non-spe.js).

`variations-globales-premiere-non-spe.js` (Première non spé) relu
intégralement : 4 branches enrichies de 6 items absents (pas de
nouvelle branche). La Première non spé est maintenant intégralement
terminée (7/7). Item ajouté montrant la dérivation d'un trinôme terme à
terme. Item ajouté sur la dérivée nulle d'une constante et sa
conséquence (fonctions différant d'une constante = même dérivée).
2 items ajoutés à « Tangentes horizontales » : piège x²=k a deux
solutions opposées ; équation de la tangente horizontale y=f(x0).
2 items ajoutés à « Signe de f' et sens de variation » : règle
d'identification max/min sur un tableau de signes (jusque-là le cours
disait seulement « candidats à un extremum » sans dire comment
trancher) ; piège important f'(a)=0 n'implique pas toujours un
extremum (contre-exemple x³ en 0, point d'inflexion). Aucun €, aucun
candidat texTable, fichier purement algébrique.

`variations-instantanees-premiere-non-spe.js` (Première non spé) relu
intégralement : 5 branches (4 avant). Nouvelle branche « Taux
d'accroissement, approximation du nombre dérivé » ajoutée — gap
conceptuel important, (f(a+h)-f(a))/h qui relie le nombre dérivé à une
pente moyenne calculable n'apparaissait dans aucune branche avant, alors
que c'est le lien fondamental entre pente moyenne et nombre dérivé,
testé par genTauxAccroissementApprocheNumeric. Branche « Nombre dérivé =
coefficient directeur de la tangente » enrichie de 3 items : lecture
graphique par déplacement d'une unité (absent) ; nombre dérivé constant
d'une fonction affine = son coefficient directeur (chapter et générateur
propres, absent) ; piège général ne pas confondre f(a) et f'(a) (plus
général que le piège déjà présent sur le signe, qui n'en est qu'un
corollaire). Branche « Signe du nombre dérivé » enrichie : item sur la
comparaison de deux nombres dérivés (le plus grand = tangente la plus
pentue), absent avant. Aucun €, aucun candidat texTable, fichier
purement algébrique.

`modelisation-quadratique-premiere-non-spe.js` (Première non spé) relu
intégralement : 4 branches inchangées en nombre, branche 1 renommée
« Forme canonique et forme développée » (nom repris de la description
officielle du chapitre) et enrichie. Gap le plus important du fichier :
la forme canonique f(x)=a(x-α)²+β elle-même n'apparaissait NULLE PART
dans le cours avant, alors que la NOTE en tête de fichier explique que
ce chapitre est un AJOUT du programme 2026 spécifiquement pour
introduire cette forme, et que le tout premier générateur du fichier
(genFormeCanoniqueVersDeveloppee) la teste directement. Item ajouté sur
la lecture directe du sommet S(α;β) sur la forme canonique (sans
calcul, contraste avec x_S=-b/2a en forme développée) ; item sur la
méthode de développement via l'identité remarquable (x-α)²=x²-2αx+α² ;
formule complétée montrant les deux écritures ensemble. Les 3 autres
branches déjà complètes, non modifiées. Pas de figure : Figure.jsx ne
supporte pas les courbes/paraboles, cohérent avec second-degre.js
(Première Spé) qui n'en a pas non plus. Aucun €, aucun candidat
texTable, fichier purement algébrique.

`croissance-exponentielle-premiere-non-spe.js` (Première non spé) relu
intégralement : 5 branches enrichies de 6 items + 1 formule (pas de
nouvelle branche, tous les thèmes principaux avaient déjà une branche).
Item ajouté sur le recul d'un rang (division par q), absent avant.
Branche « Sens de variation » renommée « ... (suites et fonctions
exponentielles) » + item ajouté sur le sens de variation de x↦a^x selon
la base — absence notable car "fonctions exponentielles" est dans la
description du chapitre mais totalement absent du cours avant, malgré
le titre même du chapitre « Croissance exponentielle ». Item ajouté sur
la comparaison de deux suites géométriques par leur raison. Piège
classique ajouté sur le taux global ≠ somme des taux périodiques (avec
exemple chiffré), signalé par le nom même du générateur
genPiegeTauxGlobalQCM mais jamais formulé dans le cours. Item + formule
ajoutés sur le coefficient multiplicateur réciproque (même concept que
l'Évolution réciproque déjà ajoutée dans informations-chiffrees-seconde.js
plus tôt dans ce chantier, ici absent à ce niveau aussi). Aucun €,
aucun candidat texTable, fichier non géométrique.

`croissance-lineaire-premiere-non-spe.js` (Première non spé) relu
intégralement : 6 branches (4 avant). Nouvelle branche « Modéliser une
situation par une suite arithmétique » ajoutée, couvrant 3 générateurs
entiers portant le chapter "Modélisation" — le cours ne disait nulle
part comment identifier r et u0 dans un problème concret. Nouvelle
branche « Fonctions affines et croissance continue » ajoutée, couvrant 2
générateurs portant le chapter "Fonctions affines" — aucune formule
f(x)=mx+p ni coefficient directeur depuis deux points n'existait avant.
Branche « Suite arithmétique : la raison » enrichie : formule
généralisée pour la raison entre termes non consécutifs r=(uq-up)/(q-p)
ajoutée (genRaisonDepuisDeuxTermesNonConsecutifsNumeric, expert, absente
— seul le cas consécutif était donné). Branche « Résoudre u_n≥k »
enrichie : piège classique ajouté sur l'inversion du sens de l'inégalité
si r est négatif (mis en scène dans les steps du générateur mais jamais
formulé dans le cours). Aucun €, aucun candidat texTable, fichier non
géométrique.

`statistique-probabilites-premiere-non-spe.js` (Première non spé) relu
intégralement : 6 branches (5 avant). Nouvelle branche « Fréquences
depuis un tableau croisé » ajoutée — c'était le gap le plus grave
trouvé sur ce fichier : 5 générateurs entiers portant le chapter
"Fréquences" (fréquence marginale/conditionnelle, case manquante,
contraire, effectif depuis fréquence conditionnelle) n'avaient AUCUNE
branche alors que le titre même du chapitre est « De la STATISTIQUE aux
probabilités » — seul le volet probabilités était couvert avant. Branche
« Probabilité conditionnelle » enrichie : item sur P_A(B) non définie si
P(A)=0 et P_A(B)+P_A(non B)=1, testés par 2 des 6 affirmations de
genVraiFauxProbabilitesQCM mais absents. Branche « Indépendance »
enrichie : item sur le test par comparaison de fréquences dans un
tableau croisé (technique utilisée dans les steps de 2 générateurs mais
jamais reliée à la formule abstraite P_A(B)=P(B) présentée). Branche
« Point moyen et droite d'ajustement » enrichie : formule explicite de
la méthode des points extrêmes ajoutée (a=(yn-y1)/(xn-x1), b=y1-a×x1),
nommée dans le cours et le générateur mais jamais donnée. Défaut de
présentation corrigé sur 2 générateurs (tableau croisé en prose dense
jusqu'à 477 caractères converti en texTable, même helper buildTableauCroiseTex
que sur le fichier précédent). Validé par génération de 4000 exercices
aléatoires : aucun undefined/NaN.

`analyse-information-chiffree-premiere-non-spe.js` (Première non spé)
relu intégralement : 5 branches enrichies de 5 items + 3 formules
absentes (pas de nouvelle branche, tous les thèmes principaux étaient
déjà couverts). Piège classique ajouté sur la comparaison de proportions
plutôt que d'effectifs bruts (genComparerProportionsQCM, absent) ;
formule proportion=effectif/total ajoutée. Formule t=(V1-V0)/V0×100
ajoutée pour le taux d'évolution (seul un exemple isolé existait).
Diagrammes : item ajouté sur le rapport des hauteurs des bâtons
(genVerifierDiagrammeBatonsQCM, absent, distinct du piège échelle
tronquée déjà présent) ; formule angle=%×360° ajoutée pour les
diagrammes circulaires (seule une phrase qualitative existait). Item
ajouté en tête de la branche corrélation donnant le vocabulaire de base
positive/négative/aucune (compétence principale de genQualifierCorrelationQCM,
le cours ne contenait avant que l'avertissement corrélation≠causalité
sans jamais définir les 3 qualifications). Défaut de présentation
corrigé sur 4 générateurs de tableaux croisés 2x2 (un prompt atteignait
527 caractères en énumération prose) : nouveau helper
buildTableauCroiseTex() ajouté (import texTable, même précédent que
buildCrossTableTex en 2nde) pour un vrai tableau lisible avec option
totaux/case masquée. Validé par génération de 4000 exercices aléatoires :
aucun undefined/NaN.

`probabilites-echantillonnage-seconde.js` (2nde) relu intégralement : 6
branches (4 avant), la 2nde est maintenant intégralement terminée
(12/12). Nouvelle branche « Vocabulaire des événements » ajoutée,
couvrant genTypeEvenementQCM (certain/impossible/élémentaire/non
élémentaire) totalement absent avant ; item ajouté sur les axiomes de
base (probabilité entre 0 et 1, somme des probabilités de l'univers = 1),
testés par 2 des 6 affirmations de genVraiFauxProbabiliteQCM mais jamais
énoncés. Nouvelle branche « Loi des grands nombres » ajoutée, couvrant
genLoiGrandsNombresQCM — absence d'autant plus notable que la NOTE en
tête de fichier explique que c'est le SEUL élément d'échantillonnage
maintenu au programme 2026 en 2nde (le reste du volet a été retiré), or
il n'apparaissait dans aucune branche. Branche « Modèle équiprobable »
enrichie : item distinguant modèle équiprobable et étude statistique
(genModeliserExperienceQCM, absent). Branche « Univers à deux épreuves »
enrichie : principe multiplicatif ajouté en item ET en formule (absent,
seule la consigne de lister les issues était donnée, pas la règle de
comptage). Branche « Probabilités conditionnelles » enrichie : item sur
l'arbre pondéré et la règle P(A∩B)=P(A)×P_A(B) (genProbabiliteConditionnelleArbreNumeric,
difficulté "expert", absent — seule la lecture via tableau croisé était
couverte). Aucun €, aucun candidat texTable supplémentaire, fichier non
géométrique.

`statistiques-descriptives-seconde.js` (2nde) relu intégralement : 6
branches (5 avant). Nouvelle branche « Effectifs cumulés » ajoutée,
couvrant genEffectifCumuleNumeric et genLectureTableauEffectifsQCM (« au
moins k » / « au plus k »), 2 générateurs partageant un tag chapter
dédié mais totalement absents du cours avant. Branche « Médiane et
quartiles » enrichie : formules explicites du rang de la médiane
ajoutées ((N+1)/2 si impair, sinon moyenne des rangs N/2 et N/2+1),
utilisées dans les steps mais jamais données explicitement avant.
Branche « Moyenne et écart type » enrichie : formule ajoutée donnant
x̄=somme/effectif ET σ=racine carrée de la moyenne des carrés des écarts
(la formule de calcul concrète de l'écart type manquait entièrement,
seule une définition qualitative existait) ; item ajouté sur la
linéarité de la moyenne (chapter dédié, genLineariteMoyenneNumeric,
absent avant). Défaut de présentation corrigé sur 14 générateurs sur 20 :
séries de valeurs et tableaux valeur/effectif en prose (jusqu'à 20
éléments) convertis en texTable(), reproduisant le pattern déjà validé
sur statistiques-troisieme.js (séries à une ligne, comparaisons à deux
séries juxtaposées, classes au format `\,;\,`). Validé par génération
de 3000 exercices aléatoires : aucun undefined/NaN.

`informations-chiffrees-seconde.js` (2nde) relu intégralement : 6 branches
(5 avant). Nouvelle branche « Évolution réciproque » ajoutée, couvrant
genEvolutionReciproqueNumeric (chapter dédié, difficulté "expert")
totalement absent du cours avant alors que c'est un piège classique très
fréquent (réciproque d'une baisse de 20 % = hausse de 25 %, pas 20 %) ;
formule CM_réciproque=1/CM ajoutée avec piège chiffré. Branche
« Proportions et pourcentages » enrichie : item distinguant explicitement
proportion (partie d'un tout, même instant) et évolution (avant/après
dans le temps), testé par genIdentifierProportionOuEvolutionQCM mais
jamais formulé avant. Branche « Coefficient multiplicateur » enrichie de
3 items : formule inverse t=(CM-1)×100 (genTauxDepuisCoefficientMultiplicateurNumeric,
absent) ; piège diviser (pas multiplier) par CM pour la valeur initiale
(genValeurInitialeDepuisValeurFinaleNumeric, absent, erreur fréquente) ;
règle de comparaison de deux CM (genComparerCoefficientsMultiplicateursQCM,
absent). Branche « Évolutions successives » enrichie : formule du taux
global ajoutée (genTauxGlobalEvolutionsSuccessivesNumeric, absent, seul
le CM global était donné). Branche « Tableau croisé » enrichie : item sur
la complétion d'une case manquante par différence des totaux
(genCompleterTableauCroiseNumeric, absent). Fichier non géométrique,
aucune figure requise. Aucun candidat texTable supplémentaire (tableau
croisé déjà via texTable()) ; un seul € en prose libre hors texTable,
conforme à l'usage établi dans tout le repo.

`equations-droites-seconde.js` (2nde) relu intégralement : 6 branches (4
avant). Nouvelle branche « Droites verticales et horizontales » ajoutée,
couvrant 2 générateurs partageant le tag chapter "Droites particulières"
(genDroiteVerticaleHorizontaleQCM — classification depuis a=0/b=0 —, et
genEquationDroiteVerticaleHorizontaleNumeric — écrire x=k ou y=k passant
par un point) totalement absents du cours avant, seul un piège isolé
mentionnait b=0 ; figure dédiée avec axes gradués fléchés (nouveau
paramètre `opts` sur buildCoursDroiteFigure, rétrocompatible). Nouvelle
branche « Construire une équation à partir d'un point et d'un vecteur
directeur » ajoutée, couvrant 3 générateurs
(genEquationCartesienneDepuisPointVecteurNumeric,
genEquationCartesienneDepuisDeuxPointsNumeric,
genVecteurDirecteurDepuisDeuxPointsQCM) dont la méthode de correction
(colinéarité de AM et u, déterminant nul) n'apparaissait dans aucune
branche, le cours ne présentant que le sens inverse (équation → vecteur
directeur) ; figure dédiée. Branche « Équation cartésienne et vecteur
directeur » enrichie : item sur les vecteurs colinéaires aussi
directeurs (genVecteurDirecteurValideQCM, absent) et item sur le test
d'appartenance d'un point par substitution (genPointAppartientDroiteCartesienneQCM,
absent). Branche « Position relative de deux droites » enrichie : item
reliant le vocabulaire système (une seule/aucune/infinité de solutions,
genNombreSolutionsSystemeQCM, difficulté "expert") à la position
géométrique déjà présentée. Aucun €, aucun candidat texTable.

`colinearite-vecteurs-seconde.js` (2nde) relu intégralement : item ajouté
sur le vecteur nul colinéaire à tout vecteur (déterminant toujours nul) ;
piège classique ajouté sur droites parallèles vs confondues (vecteurs
directeurs colinéaires n'implique pas confondues, il faut vérifier un
point commun) ; 2 nouvelles branches ajoutées — « Résoudre une équation de
colinéarité, coefficient » (déterminant=0, formule k=x_v/x_u) et
« Vecteurs directeurs d'une droite » (infinité colinéaire entre eux, cas
particuliers axe-aligné), toutes deux avec figure dédiée. Correction
technique dans `buildCoursColinFigure` : les droites (paramètre `lines`)
ne portent plus de flèche par erreur — seuls les vecteurs (paramètre
`vectors`) doivent en porter, une droite n'a pas de sens privilégié
contrairement à un axe ou une droite graduée. 6 branches au total.

`vecteurs-seconde.js` (2nde) relu intégralement : 3 nouvelles branches
ajoutées pour des thèmes entiers absents. « Translation d'un point »
(image A'=A+u, antécédent inverse, vecteur de translation) : 3
générateurs dédiés (chapitre "Vecteurs — Translations") sans aucune
branche, alors que la NOTE en tête de fichier explique pourquoi ce thème
est maintenu en 2nde. « Caractérisation vectorielle du milieu »
(AM=MB) et « Combinaison linéaire de deux vecteurs » (w=au+bv) : les 2
signalées explicitement "ajout du programme 2026" dans les NOTE du
fichier lui-même mais absentes de toute branche avant cette relecture.
Branche « Coordonnées et norme » : item comparaison de normes via leurs
carrés ajouté (genComparerNormesQCM, absent). Branche « Vecteur opposé »
renommée « Opérations sur les vecteurs : opposé, somme, multiplication »
+ item somme de vecteurs ajouté (genSommeDeuxVecteursNumeric, absent).
8 branches au total (5 avant), 3 nouvelles figures suivant la convention
déjà en place (arrowEnd correct sur tous les vecteurs). Aucun €, aucun
candidat texTable.

`reperage-configurations-seconde.js` (2nde, 1er fichier géométrie de la
2nde) relu intégralement : item taxonomie orthogonal/orthonormé complété
(testé par genTypeRepereDepuisDescriptionQCM à 3 réponses, seul le cas
orthonormé était défini) ; item symétrique par rapport à l'origine ajouté
(genSymetriqueOrigineNumeric, absent) ; item technique inverse
x_B=2x_M-x_A ajouté (genPointMilieuVersACoordinateNumeric, absent) ; item
cas particulier axe-aligné ajouté à « Distance entre deux points »
(genVraiFauxParalleleAxeQCM/genDistanceSegmentAxeAligneNumeric, absent).
Branche « Parallélogramme : milieu commun » scindée : le centre de
gravité devient sa propre branche « Centre de gravité d'un triangle »
avec formule explicite (absente avant) et figure dédiée. Nouvelle branche
« Réciproque du théorème de Pythagore » ajoutée avec formule et figure
(triangle non axe-aligné) : thème testé par
genTriangleRectangleReciproquePythagoreQCM (portant littéralement ce nom
de chapitre) mais totalement absent du cours avant cette relecture.
Figures : 7 figures, toutes via buildCoursRepereFigure avec axes fléchés
(arrowEnd) — convention déjà confirmée correcte pour ce fichier lors de
l'audit flèches antérieur (voir section « Ce qui a déclenché ce
chantier » plus bas). Aucun symbole €, aucun candidat texTable (grep
mécanique confirmé faux positif comme anticipé — coordonnées de points).

`fonctions-reference-seconde.js` (2nde) relu intégralement : item ajouté
à « Fonction inverse » sur le fait que l'inverse n'est jamais nul (0 sans
antécédent), testé par 2 générateurs mais absent. Branche « Comparer des
images, résoudre » : item générique imprécis corrigé — l'ancienne
formulation « compter les solutions selon le signe de a » pour les 3
fonctions était fausse pour l'inverse (1/x=a a toujours 1 solution si
a≠0, indépendamment du signe de a, contrairement au carré/valeur
absolue) ; scindé en 2 items distincts. Item ajouté sur la résolution
d'inéquations x²<a/x²>a et |x|<a/|x|>a (technique racines/extérieur),
testée par 2 générateurs experts mais totalement absente du cours (seules
les équations =a étaient couvertes). Branches « Fonction carré » et
« Fonction valeur absolue » laissées inchangées. Aucune figure, aucun €,
aucun candidat texTable.

`fonctions-affines-seconde.js` (2nde) relu intégralement : item taxonomie
linéaire/constante/affine non linéaire ajouté à « Reconnaître et écrire
f(x)=ax+b » (testée par genClasserFonctionQCM à 4 réponses mais absente,
même famille de gap déjà vue sur fonctions-affines-troisieme.js) ; item
équation généralisé de ax+b=0 à ax+b=k (genResoudreEquationAffineNumeric
résout le cas général) ; nouvelle branche « Modéliser un tarif par une
fonction affine » ajoutée (b=forfait fixe, a=prix unitaire, résolution
inverse), 2 générateurs dédiés (genTarifContexteNumeric,
genTarifInverseNumeric) sans aucune branche correspondante avant cette
relecture. Reste déjà au niveau attendu (Taux de variation, Sens de
variation, Déterminer f à partir de deux points déjà clairs). Aucune
figure, € en prose courte seulement (2 tarifs par prompt), aucun
candidat texTable.

`variations-fonctions-seconde.js` (2nde) relu intégralement : item ajouté
à « Comparer ou encadrer des images » sur l'encadrement d'une image
intermédiaire (si x est compris entre les bornes a et b d'un morceau
monotone, f(x) est strictement compris entre f(a) et f(b), quel que soit
le sens de variation), testé par `genEncadrerImageQCM` mais absent — les
2 items existants ne couvraient que la comparaison directe f(a) vs f(b),
pas l'encadrement d'un point intermédiaire. Reste déjà au niveau attendu
(branches « Lire un tableau de variations », « Maximum et minimum » —
piège local/global déjà présent —, « Nombre de solutions de f(x)=k »
déjà claires, 15 générateurs bien couverts). Fichier purement textuel,
aucune figure, aucun symbole €, aucun candidat texTable.

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
- [x] variations-fonctions-seconde.js *(item encadrement d'une image intermédiaire ajouté, testé par genEncadrerImageQCM mais absent ; sinon déjà bon)*
- [x] fonctions-affines-seconde.js *(taxonomie linéaire/constante/affine ajoutée, équation généralisée à ax+b=k, nouvelle branche « Modéliser un tarif » ajoutée)*
- [x] fonctions-reference-seconde.js *(item inverse jamais nul ajouté, item équations imprécis corrigé/scindé, item inéquations x²/|x| ajouté — thème entier absent avant)*
- [x] reperage-configurations-seconde.js *(4 items ajoutés — orthogonal/orthonormé, symétrique origine, inverse milieu, distance axe-alignée ; branche Parallélogramme scindée ; 2 nouvelles branches ajoutées — Centre de gravité, Réciproque de Pythagore, avec figures ; flèches déjà correctes)*
- [x] vecteurs-seconde.js *(3 nouvelles branches — Translation, Caractérisation du milieu, Combinaison linéaire, 2 signalées « ajout programme 2026 » par la NOTE du fichier ; item comparaison normes ajouté ; item somme de vecteurs ajouté)*
- [x] colinearite-vecteurs-seconde.js *(item vecteur nul colinéaire ajouté ; piège classique parallèles vs confondues ajouté ; 2 nouvelles branches — équation de colinéarité/coefficient, vecteurs directeurs d'une droite ; correction technique : droites sans flèche, seuls les vecteurs en portent)*
- [x] equations-droites-seconde.js *(2 nouvelles branches — Droites verticales/horizontales avec figure à axes, Construire une équation depuis point+vecteur directeur ; items ajoutés sur vecteurs colinéaires directeurs, test d'appartenance par substitution, lien vocabulaire système/position relative)*
- [x] informations-chiffrees-seconde.js *(nouvelle branche Évolution réciproque avec formule et piège chiffré ; items ajoutés — distinction proportion/évolution, formules inverses CM, comparaison de CM, taux global, complétion de case manquante)*
- [x] statistiques-descriptives-seconde.js *(nouvelle branche Effectifs cumulés ; formules du rang de la médiane et de l'écart type ajoutées ; item linéarité de la moyenne ; 14 générateurs convertis en texTable — séries et tableaux valeur/effectif en prose)*
- [x] probabilites-echantillonnage-seconde.js *(nouvelles branches Vocabulaire des événements et Loi des grands nombres ; items ajoutés — axiomes de base, modéliser équiprobable/statistique, principe multiplicatif, arbre pondéré ; 2nde intégralement terminée 12/12)*

### Première non spé
- [x] analyse-information-chiffree-premiere-non-spe.js *(items+formules ajoutés — comparer proportions pas effectifs, formule taux d'évolution, rapport hauteurs bâtons, angle secteur, vocabulaire corrélation ; 4 générateurs de tableaux croisés convertis en texTable)*
- [x] statistique-probabilites-premiere-non-spe.js *(nouvelle branche Fréquences depuis un tableau croisé — gap le plus grave du fichier, tout le volet statistique était absent ; items sur P_A(B) non définie/somme, test d'indépendance par fréquences, formule points extrêmes ; 2 générateurs convertis en texTable)*
- [x] croissance-lineaire-premiere-non-spe.js *(nouvelles branches Modéliser une situation par une suite, Fonctions affines et croissance continue ; formule raison non consécutive, piège inversion inégalité si r négatif)*
- [x] croissance-exponentielle-premiere-non-spe.js *(item sens de variation fonction exponentielle ajouté — absence notable malgré le titre du chapitre ; item recul d'un rang, comparaison de raisons, piège taux global≠somme, coefficient réciproque)*
- [x] modelisation-quadratique-premiere-non-spe.js *(branche renommée Forme canonique et forme développée — la forme canonique a(x-α)²+β était totalement absente malgré la NOTE signalant que c'est l'ajout central du programme 2026 pour ce chapitre)*
- [x] variations-instantanees-premiere-non-spe.js *(nouvelle branche Taux d'accroissement — gap conceptuel fondamental ; items ajoutés — lecture graphique déplacement d'une unité, dérivée constante d'une fonction affine, piège général f(a) vs f'(a), comparaison de nombres dérivés)*
- [x] variations-globales-premiere-non-spe.js *(items ajoutés — dérivation d'un trinôme, dérivée nulle d'une constante, piège x²=k deux solutions, équation tangente horizontale, règle max/min sur tableau de signes, piège f'(a)=0 n'implique pas extremum ; Première non spé terminée 7/7)*

### Première Spé
- [x] second-degre.js *(nouvelle branche Déterminer un trinôme à partir de données — thème entier absent, racines+point et système à deux points ; items ajoutés — identités remarquables pour développer/factoriser, règle du produit nul, racines=valeurs interdites d'un quotient, symétrie de la parabole)*
- [x] suites-numeriques-premiere-spe.js *(nouvelle branche Reconnaître une situation arithmétique ou géométrique — thème entier absent malgré le champ pourquoi du chapitre ; item+formule extraction de r/q depuis deux termes consécutifs ; formule de Gauss 1+2+...+n=n(n+1)/2 ajoutée)*
- [x] derivation-premiere-spe.js *(nouvelle branche Signe de f' et sens de variation — théorème fondamental totalement absent alors que testé par 2 générateurs ; règle (u+v)'=u'+v' ajoutée ; items dérivée nulle d'une constante et non-dérivabilité (point anguleux, tangente verticale))*
- [x] variations-courbes-premiere-spe.js *(nouvelle branche Allure et symétrie de la parabole — 2 thèmes absents ; items ajoutés — f'=0 sur un intervalle donne f constante, monotonie pour comparer/encadrer des images, somme de fonctions de même monotonie ; formule α=-b/2a ajoutée)*
- [x] fonction-exponentielle-premiere-spe.js *(nouvelle branche Modéliser une croissance ou décroissance exponentielle — thème entier absent, forme C0 e^{kt} et signe de k jamais donnés malgré le champ pourquoi du chapitre)*
- [x] trigonometrie-premiere-spe.js *(nouvelle branche Angles associés et signe selon le quadrant — 7 générateurs sur 21 sans aucune branche avant ; formule longueur d'arc ℓ=rθ ajoutée ; tableau des valeurs remarquables ajouté en formule via \begin{array})*
- [x] vecteurs-produit-scalaire-premiere-spe.js *(items+formules ajoutés — symétrie u·v=v·u, formule inversée pour l'angle, formule de la norme, règle de bilinéarité (u+v)·w=u·w+v·w, développement de ‖u-v‖²)*
- [x] geometrie-reperee-premiere-spe.js *(formule x_Ω=-D/2, y_Ω=-E/2, r²=x_Ω²+y_Ω²-F ajoutée — utilisée dans 2 prompts mais absente du cours ; items ajoutés — méthode pour trouver c depuis point+vecteur normal, cas simples droites horizontales/verticales)*
- [x] probabilites-conditionnelles-premiere-spe.js *(nouvelle branche Arbre pondéré : deux règles à connaître — multiplication/addition des chemins absentes malgré 4 générateurs ; formule loi binomiale ajoutée ; rappel formule union P(A∪B))*
- [x] variables-aleatoires-premiere-spe.js *(items ajoutés — lecture cumulative de P(X≤a), règle de comparaison de deux jeux par l'espérance ; formules P(X=0)=(1-p)^n et P(X=n)=p^n ajoutées pour la loi binomiale)*
- [x] algorithmique-python-premiere-spe.js *(nouvelle branche Conditions et vocabulaire de base — if/else, n%2==0, break, import random, thème entier absent malgré 4+1 générateurs le testant ; item sur les 2 schémas d'accumulation somme/produit)*

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
