# Audit pédagogique global — 11 août 2026

## Périmètre

- 135 chapitres chargés directement depuis `src/chapters`.
- Trois difficultés contrôlées : facile, standard et expert.
- 80 générations par difficulté et par chapitre.
- 32 400 exercices examinés à chaque passage complet.

## Contrôles automatisés

- présence d’un énoncé, d’une réponse et d’une correction exploitable ;
- validité des types numérique, texte, QCM et QCM multiple ;
- classification de l’erreur dans une famille pédagogique précise ;
- qualité minimale des explications « Comprendre » et « Méthode à retenir » ;
- diversité des énoncés générés ;
- repérage indicatif des corrections sources trop courtes et des réponses dévoilées trop tôt ;
- mesure de la correction réellement affichée, en réunissant l’explication, la méthode, l’application et la conclusion ;
- audit complémentaire des figures, graphiques, graduations et expressions KaTeX par `test-all-chapters.mjs`.

## Résultat de ce lot

Le premier passage comptait 3 707 retours génériques sur 32 400 exercices, soit environ 11,4 %. Les principales lacunes concernaient la combinatoire, les variables aléatoires, l’arithmétique des entiers, les opérations décimales, les suites, les grandeurs composées, le calcul intégral et les vecteurs de l’espace.

Après ajout des familles pédagogiques et des animations correspondantes, le même audit ne trouve plus aucun retour générique sur les 32 400 exercices générés.

## Nouvelles familles couvertes

- nombres entiers et divisibilité ;
- combinatoire et dénombrement ;
- variables aléatoires, espérance et variance ;
- opérations décimales et stratégie de calcul ;
- vitesses, débits et grandeurs composées ;
- durées ;
- suites, convergence et récurrence ;
- calcul intégral ;
- intervalles, valeur absolue et racines ;
- vecteurs de l’espace ;
- continuité et dichotomie ;
- raisonnement d’examen ;
- automatismes et problèmes de mesures.

## Prévention des régressions

La commande `npm test` exécute désormais `audit-pedagogy.mjs --check`. Le test échoue si une nouvelle question retombe sur le retour pédagogique générique ou si la correction complète présentée à l’élève devient trop courte.

## Relecture approfondie de la 6e

- Les 11 chapitres du niveau ont été soumis à 240 générations chacun, soit 2 640 exercices de 6e relus automatiquement.
- Aucune correction affichée n’est générique ou insuffisamment développée après assemblage de « Comprendre », « Méthode à retenir », de l’application et de la conclusion.
- Les cinq questions du parcours découverte ont désormais quatre étapes identifiées : donnée, règle, calcul et résultat.
- Le diagnostic de 6e a été parcouru intégralement dans l’interface, en provoquant une erreur à chacune des cinq questions.
- La conversion de 2,5 m en centimètres affiche bien la méthode attendue et le tableau de conversion des longueurs.
- Les animations de numération utilisent maintenant les chiffres de l’exercice courant. Elles n’affichent plus un exemple fixe sans rapport avec la question.

## Audit des parcours gratuits

- Dix niveaux possèdent chacun cinq questions vitrines, soit 50 questions contrôlées.
- Les 50 énoncés sont uniques, complets et reliés à une famille pédagogique spécialisée.
- Le diagnostic et la première série gratuite d’un même niveau ne reprennent jamais le même énoncé.
- Les erreurs comme les réussites donnent accès à l’explication détaillée et au support visuel.
- Le chemin public vérifié est : accueil → choix du niveau → programme étudié → diagnostic → recommandation → série gratuite.
- Les 50 vitrines suivent désormais toutes une application en quatre temps : donnée, règle, calcul et résultat.
- Les supports visuels de fractions reprennent les numérateurs et dénominateurs de la question ; ceux de proportionnalité affichent les valeurs et le résultat attendus ; les aires de rectangles disposent d’un quadrillage animé.

## Relecture approfondie de la 5e

- Les 14 chapitres du niveau ont été soumis à 240 générations chacun, soit 3 360 exercices audités.
- Aucun retour générique et aucune correction affichée trop courte n’ont été détectés.
- Les cinq vitrines de 5e ont été réécrites manuellement : addition de relatifs par distance à zéro, fractions et dénominateur commun, calcul de 20 % par le dixième, somme des angles et probabilité favorable sur total.
- La méthode des relatifs reprend l’image du nombre le plus « fort » qui donne son signe puis perd des « points de vie ».
- La correction de probabilité se termine par le contrôle indispensable : le résultat doit être compris entre 0 et 1.

## Relecture approfondie de la 4e

- Les 17 chapitres du niveau ont été soumis à 240 générations chacun, soit 4 080 exercices audités.
- Aucun retour générique et aucune correction affichée trop courte n’ont été détectés.
- Les cinq vitrines ont été réécrites manuellement : produit de relatifs, résolution d’équation, théorème de Pythagore, vitesse moyenne et moyenne statistique.
- L’équation utilise explicitement l’image de la balance et se termine par la vérification de la solution.
- Pythagore distingue clairement BC de BC², impose la racine carrée et contrôle la cohérence avec l’inégalité triangulaire.
- La moyenne est contrôlée entre la plus petite et la plus grande valeur ; l’unité km/h est explicitée comme kilomètres parcourus en une heure.
- Les animations d’équation, de Pythagore, de statistiques et de vitesse reprennent maintenant l’énoncé ou le résultat de l’exercice courant.

## Relecture approfondie de la 3e

- Les 17 chapitres du niveau ont été soumis à 240 générations chacun, soit 4 080 exercices audités.
- Aucun retour générique et aucune correction affichée trop courte n’ont été détectés.
- Les cinq vitrines ont été réécrites manuellement : Thalès, produit nul, image d’une fonction, évolution en pourcentage et événement contraire.
- Thalès conserve explicitement l’ordre des côtés et se termine par une vérification des rapports.
- Le produit nul recherche séparément les deux solutions avant de sélectionner la solution positive demandée.
- La fonction distingue clairement image et antécédent ; le pourcentage propose les méthodes par 10 % et par coefficient multiplicateur.
- L’événement contraire est contrôlé en vérifiant que les deux probabilités totalisent 1.
- Les animations de Thalès, fonctions, événement contraire et distributivité utilisent désormais les données de l’exercice courant.

## Relecture approfondie de la 2nde

- La recette effectuée sur la version publiée Vercel confirme l’affichage de la correction détaillée sur les antécédents, de l’animation spécialisée et du pavé autorisant les nombres négatifs.

- Les 15 chapitres du niveau ont été soumis à 240 générations chacun, soit 3 600 exercices audités.
- Aucun retour générique et aucune correction affichée trop courte n’ont été détectés.
- Les cinq vitrines ont été réécrites manuellement : antécédent, coefficient directeur, médiane, coordonnées d’un vecteur et événement contraire.
- L’antécédent est présenté comme un nombre de départ recherché et la solution est vérifiée par son image.
- Le coefficient directeur donne le sens de la variation verticale rapportée à une unité horizontale.
- La médiane partage explicitement la série ordonnée en deux groupes de même effectif.
- Le vecteur utilise systématiquement « arrivée moins départ » et la probabilité contraire est contrôlée par une somme égale à 1.
- Des animations spécialisées représentent maintenant la montée et l’avancée, la valeur centrale et le déplacement de A vers B.

## Premier audit des parcours de Première

- Première spécialité : 14 chapitres et 3 360 exercices audités.
- Première sans spécialité : 11 chapitres et 2 640 exercices audités.
- Première technologique : 11 chapitres et 2 640 exercices audités.
- Les 36 chapitres de Première ont ensuite été contrôlés chapitre par chapitre sur les trois difficultés : 8 640 générations, aucun retour générique et aucune correction affichée trop courte.
- Les quinze questions vitrines de Première ont été réécrites manuellement et associées à des visuels spécialisés.

## Relecture approfondie de la Terminale

- Les cinq questions vitrines de Terminale spécialité et les cinq questions vitrines de Terminale technologique ont été réécrites manuellement.
- Chaque correction distingue les données, la règle, l’application et le contrôle du résultat.
- Les corrections insistent sur les confusions fréquentes : image et pente, termes et rangs, produit le long d’un chemin, signe de la dérivée et signe de la fonction, probabilité conditionnelle et intersection.
- Les vitrines mobilisent les animations spécialisées sur l’exponentielle et le logarithme, la dérivation, les suites, les arbres pondérés, la géométrie dans l’espace et les statistiques.
- La banque monolithique de chapitres a été découpée à la compilation en lots collège, seconde, première et terminale afin d’éviter un unique fichier de contenus de près de 1,9 Mo et d’améliorer la mise en cache.
- Sur les 8 640 exercices contrôlés, aucun retour générique et aucune correction affichée trop courte n’ont été détectés.
- Les quinze vitrines ont ensuite été relues et réécrites manuellement : discriminant, dérivation, suites, probabilités conditionnelles, produit scalaire, évolutions, fonctions, statistiques et algorithmique.
- Chaque correction distingue désormais donnée, règle, calcul et résultat, avec un contrôle final lorsque celui-ci donne du sens au résultat.
- Des visuels spécialisés complètent notamment le produit scalaire nul, l’étendue statistique, les suites et les probabilités conditionnelles.

## Lien Thalès, triangles semblables et proportionnalité

- Toutes les corrections relevant de Thalès expliquent désormais que l’alignement et le parallélisme produisent deux triangles semblables.
- Les triangles ont alors les mêmes angles et l’un est un agrandissement ou une réduction de l’autre.
- C’est cette similitude qui justifie la proportionnalité des longueurs correspondantes et l’égalité des rapports.
- La méthode demande d’identifier les triangles, d’associer leurs sommets et leurs côtés, puis de conserver le même ordre dans les rapports.
- L’animation montre simultanément le petit triangle, le grand triangle semblable et les côtés correspondants.

## Recette de la version publiée

- La page d’accueil Vercel est accessible et présente clairement l’essai gratuit, le rituel enseignant et l’offre complète.
- Le diagnostic de 6e publié a été ouvert, commencé et testé avec une réponse erronée.
- L’animation publiée de numération reprend bien 4 milliers, 3 centaines, 2 dizaines et 7 unités pour la réponse 4 327.
- Le bouton sonore, le pavé numérique avec touche ±, la correction détaillée et la navigation vers la question suivante restent opérationnels.
- Le parcours découverte de 5e publié a également été testé avec une réponse erronée à −7 + 12.
- La correction publiée reprend bien les quatre étapes typées, l’image du nombre le plus « fort » et les « points de vie », ainsi que la droite graduée animée.
- Le parcours découverte de 4e publié a été testé avec une réponse erronée au produit (−4) × (−3).
- Ce contrôle a conduit à remplacer, pour les produits de relatifs, la droite graduée par une animation spécialisée de la règle des signes.
- Le parcours découverte de 3e publié a été testé avec une erreur volontaire sur Thalès : les conditions, les rapports ordonnés, la vérification et l’animation sont correctement affichés.

## Suite de l’audit

Le contrôle automatique garantit désormais la structure, la longueur et la spécificité du retour réellement montré. La phase éditoriale peut continuer niveau par niveau afin d’affiner encore le ton et les exemples, même lorsque le seuil qualitatif est déjà satisfait.
