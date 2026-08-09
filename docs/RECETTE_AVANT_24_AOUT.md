# Recette ReussiMaths avant le 24 août 2026

Cette liste couvre uniquement les vérifications qui nécessitent le site déployé, de vrais comptes ou le matériel du pilote. Noter pour chaque ligne : date, appareil, compte utilisé et résultat.

## 1. Déploiement

- [ ] Le dernier commit attendu est bien celui déployé par Vercel.
- [ ] La page d'accueil s'ouvre sans erreur dans une fenêtre privée.
- [ ] Les routes profondes restent accessibles après rechargement (niveau, diagnostic, parcours, compte, enseignant).
- [ ] Les journaux Vercel ne montrent pas d'erreur récurrente après la recette.
- [ ] Le tableau Supabase ne montre pas d'échec récurrent d'authentification ou de requête.

## 2. Comptes et authentification

- [ ] Créer un compte élève de test puis terminer l'onboarding.
- [ ] Se déconnecter et se reconnecter : niveau, progression et accès sont conservés.
- [ ] Tester Google dans une fenêtre privée.
- [ ] Tester Apple dans une fenêtre privée si Apple est proposé publiquement.
- [ ] Tester un abandon ou un refus du fournisseur externe : retour propre sur ReussiMaths.
- [ ] Vérifier qu'un utilisateur non connecté ne voit aucune donnée d'un autre compte.

## 3. Boucle pédagogique

- [ ] Terminer un diagnostic et ouvrir le parcours recommandé.
- [ ] Commencer la première série depuis la carte « Ta prochaine étape ».
- [ ] Répondre juste, répondre faux, afficher la méthode puis réussir un nouvel essai.
- [ ] Terminer une série et vérifier l'enregistrement de l'étape.
- [ ] Recharger la page puis reprendre à la bonne étape.
- [ ] Vérifier le bilan et la liste des révisions dues.

## 4. Accès administrateur à une classe

- [ ] Depuis l'administration, créer un code pour le niveau réellement testé.
- [ ] Choisir une durée courte de recette et vérifier la date d'expiration affichée.
- [ ] Activer le code avec un compte élève distinct.
- [ ] Vérifier que tout le niveau choisi est accessible et que les autres niveaux ne le sont pas.
- [ ] Vérifier qu'un enseignant ordinaire ne peut ni créer ni administrer ces codes.
- [ ] Après expiration, vérifier que l'accès est réellement retiré sans supprimer la progression.
- [ ] Créer ensuite le code définitif avec la durée décidée pour le pilote.

## 5. Stripe

À exécuter d'abord en mode test, puis une seule fois avec de petits paiements réels après activation du compte Stripe de production.

- [ ] Vérifier que les prix et libellés Stripe correspondent exactement à ceux du site et des CGU.
- [ ] Souscrire à l'abonnement mensuel : accès disponible après retour sur le site.
- [ ] Acheter le pack examen : bon niveau et bonne durée d'accès.
- [ ] Abandonner Checkout : aucun accès accordé et retour compréhensible.
- [ ] Utiliser une carte de test refusée : aucun accès accordé.
- [ ] Rejouer ou attendre un webhook : aucun doublon d'abonnement ou de droit.
- [ ] Annuler l'abonnement depuis le parcours prévu : date de fin correcte et accès conservé jusqu'à cette date.
- [ ] Vérifier les événements et journaux du webhook dans Stripe.
- [ ] Vérifier qu'aucune clé secrète Stripe n'est exposée dans le navigateur ou dans Git.

## 6. Appareils

- [ ] Safari sur iPhone, petit écran.
- [ ] Chrome sur Android.
- [ ] Safari et Chrome sur Mac.
- [ ] Chrome sur Windows ou Chromebook.
- [ ] Tablette en portrait et paysage.
- [ ] Vérifier clavier numérique, QCM longs, figures, graphiques, modales et boutons en bas d'écran.
- [ ] Vérifier que la musique ne redémarre pas entre deux écrans et que le réglage muet est conservé.

## 7. Répétition en classe

- [ ] Ouvrir le rituel enseignant sur l'ordinateur qui sera utilisé.
- [ ] Tester le vidéoprojecteur et le plein écran depuis le fond de la salle.
- [ ] Commencer avec le son coupé ; l'activer uniquement volontairement.
- [ ] Faire connecter plusieurs appareils simultanément sur le réseau prévu.
- [ ] Chronométrer une séance de 15 minutes sans expliquer la navigation aux élèves testeurs.
- [ ] Noter chaque hésitation, texte illisible et étape nécessitant une explication orale.

## 8. Gel et secours

- [ ] À partir du 21 ou 22 août, ne déployer que des corrections bloquantes et testées.
- [ ] Identifier dans Vercel le dernier déploiement stable pouvant être restauré.
- [ ] Vérifier l'accès administrateur à Vercel, Supabase et Stripe depuis le téléphone.
- [ ] Conserver le contact direct de l'enseignant pilote.
- [ ] Le 23 août, refaire uniquement le parcours critique sans migration importante.
