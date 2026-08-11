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

La commande `npm test` exécute désormais `audit-pedagogy.mjs --check`. Le test échoue si une nouvelle question retombe sur le retour pédagogique générique.

## Suite de l’audit

Le contrôle automatique garantit désormais la structure et la spécificité du retour. Une seconde phase éditoriale doit encore relire les corrections sources les plus courtes, chapitre par chapitre, afin d’améliorer leur formulation mathématique au-delà du socle transversal fourni par RéussiMaths.
