# Recette premiers clients

À exécuter après la migration `prelaunch-conversion-learning-2026-08-09.sql`, le commit et le déploiement Vercel.

## Deux comptes réels

- Compte administrateur : ouvrir `/admin`, vérifier les blocs conversion, rétention, MRR, retours pilote et utilisateurs.
- Compte élève distinct : terminer l'onboarding, le diagnostic et la série gratuite de son niveau.
- Répondre faux puis utiliser la méthode : la compétence doit rester à réviser aujourd'hui.
- Répondre juste sans aide : la prochaine révision doit être programmée.
- Recharger et se reconnecter : progression, bilan et révisions doivent rester présents.
- Vérifier que le compte élève reçoit « Réservé à l'admin » sur `/admin`.

## Stripe test

- Configurer le portail client Stripe et autoriser l'historique des factures ainsi que la mise à jour du moyen de paiement.
- Vérifier les prix : 4,99 EUR mensuel récurrent et 9 EUR en paiement unique.
- Souscrire au mensuel : le retour doit afficher « Activation en cours », puis « Accès activé » sans second paiement.
- Rouvrir Checkout avec le même compte actif : l'API doit refuser le doublon.
- Ouvrir « Factures et moyen de paiement », puis revenir sur `/compte`.
- Résilier : l'accès doit rester actif jusqu'à la fin de période.
- Tester le Pack Examen avec un autre compte, choisir le niveau et vérifier l'expiration à trois mois.
- Tester un abandon et une carte refusée : aucun droit ne doit être accordé.
- Dans Stripe, rejouer `checkout.session.completed` : aucune seconde ligne de droit ou de consentement ne doit apparaître.
- Vérifier dans Supabase `purchase_consents` : plan, version des CGU, date et session Stripe sont présents.

## Mesure et retours

- Faire le tunnel dans une fenêtre privée : accueil → niveau → diagnostic → essai → compte → Checkout test.
- Vérifier que les compteurs correspondants apparaissent dans `/admin`.
- Envoyer un retour depuis `/retour-pilote`, puis vérifier son apparition dans `/admin`.
- Les rétentions J+7 et J+30 affichent « — » tant qu'aucune cohorte assez ancienne n'existe : c'est le comportement attendu.

## Production

- Remplacer toutes les clés Stripe test par les clés production dans Vercel.
- Créer le webhook production séparément et contrôler son secret.
- Réaliser un seul achat réel à faible montant, puis une résiliation réelle.
- Vérifier le reçu, les informations d'entreprise, la TVA applicable et le libellé bancaire.
- Consulter les logs Vercel, Stripe et Supabase immédiatement après le paiement.
