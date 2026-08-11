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

## Recette de la version publiée

- La page d’accueil Vercel est accessible et présente clairement l’essai gratuit, le rituel enseignant et l’offre complète.
- Le diagnostic de 6e publié a été ouvert, commencé et testé avec une réponse erronée.
- L’animation publiée de numération reprend bien 4 milliers, 3 centaines, 2 dizaines et 7 unités pour la réponse 4 327.
- Le bouton sonore, le pavé numérique avec touche ±, la correction détaillée et la navigation vers la question suivante restent opérationnels.

## Suite de l’audit

Le contrôle automatique garantit désormais la structure, la longueur et la spécificité du retour réellement montré. La phase éditoriale peut continuer niveau par niveau afin d’affiner encore le ton et les exemples, même lorsque le seuil qualitatif est déjà satisfait.
