# Recette finale RéussiMaths — 14 août 2026

## Verdict

Le cœur pédagogique et les deux parcours de paiement fonctionnent. Le produit
est techniquement proche du lancement, mais l'ouverture commerciale publique
reste conditionnée par les informations juridiques manquantes et par
l'installation de la migration de révocation des Packs remboursés.

## Paiements vérifiés manuellement

### Abonnement mensuel

- paiement réel Stripe accepté ;
- activation automatique du niveau choisi ;
- accès aux chapitres du niveau et verrouillage des autres niveaux ;
- calcul mental quotidien accessible ;
- résiliation enregistrée par Stripe ;
- webhooks reçus en `200 OK` ;
- remboursement réel effectué.

### Pack Examen

- paiement unique réel de 9 € accepté ;
- aucune reconduction automatique ;
- date de fin exacte à trois mois ;
- choix définitif d'un niveau et de deux chapitres bonus ;
- chapitre d'examen, automatismes et bonus accessibles ;
- autres chapitres verrouillés ;
- remboursement réel effectué.

## Contrôles automatisés

- 48 tests techniques et de sécurité : succès complet ;
- 135 chapitres et 27 000 exercices générés : aucune anomalie ;
- 884 figures, 475 graphiques et 2 714 réponses négatives contrôlés ;
- 15 692 expressions mathématiques contrôlées ;
- 32 400 exercices soumis à l'audit pédagogique : aucun retour générique,
  aucune correction trop courte, aucune famille hors niveau ;
- 107 cours, 493 rubriques, 1 150 explications et 996 expressions contrôlés ;
- 920 questions auditées pour l'usage de la calculatrice ;
- 30 000 cas supplémentaires de proportionnalité et d'organisation de données
  contrôlés ; aucune erreur KaTeX.

## Correctif ajouté

Le webhook traite désormais `charge.refunded`. Pour un Pack intégralement
remboursé, il révoque uniquement l'accès rattaché au même `payment_intent`.
Cette association empêche un remboursement tardif d'un ancien paiement de
supprimer un Pack acheté plus récemment par le même client.

Déploiement requis :

1. exécuter `supabase/pack-refund-revocation-2026-08-14.sql` ;
2. ajouter `charge.refunded` aux événements de la destination Stripe ;
3. déployer le code ;
4. vérifier une fois l'événement et la révocation sur un compte test.

## Blocages avant ouverture publique

1. ~~SIRET et code APE à recevoir et publier.~~ Terminé le 15 août 2026.
2. ~~Numéro de téléphone professionnel à publier.~~ Terminé le 15 août 2026.
3. ~~Médiateur de la consommation à contractualiser et publier dans les mentions
   légales et les CGV.~~ Terminé le 15 août 2026.
4. Relecture professionnelle recommandée des CGV, de la confidentialité, de la
   propriété intellectuelle et de l'organisation réelle de l'exploitation.

## Recette matérielle restant à documenter

- smartphone Android réel ;
- tablette réelle ;
- impression ou export du bilan parental ;
- vidéoprojection du rituel enseignant dans les conditions du pilote ;
- réception effective des courriels Supabase et Stripe sur l'adresse
  professionnelle.
