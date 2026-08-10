# Audit du laboratoire des 43 corrections

Audit réalisé le 11 août 2026 avec quatre exigences : exactitude mathématique, méthode adaptée au sous-type, unité cohérente et lisibilité mobile.

## Contrôles appliqués aux 43 exemples

- La correction commence par identifier l’erreur, sans simplement annoncer la bonne réponse.
- Le bloc « Comprendre » donne du sens à la méthode.
- La méthode est spécifique à la notion et non remplacée par un conseil générique.
- Les étapes reprennent les données de la question.
- La conclusion répond exactement à la grandeur demandée et utilise la bonne unité.
- Les formules, tableaux, graphiques et animations restent dans la largeur d’un téléphone.

## Défauts transversaux corrigés

1. Une évolution de 80 € de 20 % concluait à 96 % : le résultat conserve désormais l’unité euro.
2. L’exemple d’évolution utilisait la famille générale « pourcentages » : les évolutions sont maintenant reconnues avant la famille générale.
3. Une réponse fractionnaire attendue comme `11/12` pouvait être classée à tort comme format invalide : la réponse attendue utilise désormais le même analyseur que la réponse de l’élève.
4. Les conclusions peuvent recevoir une unité explicite avec `answerUnit`, ce qui évite une déduction ambiguë.
5. La correction de Pythagore rappelle désormais l’inégalité triangulaire avant le calcul des carrés.

## Couverture visuelle

- Fractions : parts de même taille.
- Nombres relatifs : droite graduée orientée.
- Équations : balance conservée à l’équilibre.
- Proportionnalité : retour à l’unité.
- Pourcentages : valeur initiale, évolution et valeur finale.
- Fonctions : machine à images et sens inverse pour les antécédents.

Le laboratoire affiche la famille réellement sélectionnée dans l’attribut `data-feedback-family`, ce qui permet de détecter automatiquement une régression de routage pédagogique.
