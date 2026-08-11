# Checklist de lancement de RéussiMaths

Document de pilotage vivant. L’audit de Claude sert de second avis ; les priorités ci-dessous tiennent compte de la stratégie réelle de RéussiMaths : abonnement familial, rituel enseignant gratuit et accès classe exceptionnel créé uniquement par l’administrateur.

## 1. Avant d’accepter le premier paiement

### Cadre professionnel et administratif

- [ ] Vérifier auprès de la hiérarchie ou du référent déontologue les règles de cumul applicables à la situation d’agent public, avant le début de l’activité commerciale.
- [ ] Obtenir l’autorisation ou effectuer la déclaration requise avant de créer/exploiter l’activité, selon la réponse de l’administration.
- [ ] Déclarer l’entreprise individuelle sous régime micro-entrepreneur sur le guichet unique officiel.
- [ ] Recevoir et contrôler les numéros SIREN/SIRET et le code APE attribué.
- [ ] Créer le compte bancaire dédié Indy et conserver les justificatifs d’ouverture.
- [ ] Créer les espaces Urssaf et impots.gouv professionnels dès que les identifiants sont disponibles.
- [ ] Déterminer avec l’Urssaf ou le SIE la qualification fiscale/sociale exacte de la vente d’abonnements à RéussiMaths (BIC ou BNC) ; ne pas la deviner dans le formulaire.
- [ ] Vérifier l’éligibilité à l’Acre et au versement libératoire, sans les sélectionner automatiquement.
- [ ] Prévoir un livre des recettes et une numérotation continue des factures.

### Confiance et conformité du site

- [ ] Acheter et connecter un nom de domaine RéussiMaths.
- [ ] Créer une adresse électronique professionnelle sur ce domaine.
- [ ] Mettre à jour les mentions légales avec identité, statut, adresse de contact, SIREN/SIRET et coordonnées professionnelles.
- [ ] Mettre à jour les CGV/CGU, la politique de confidentialité et l’identité affichée dans Stripe.
- [ ] Vérifier les règles applicables aux mineurs, aux données scolaires et au consentement parental.
- [ ] Vérifier la séparation entre la fonction institutionnelle du fondateur et la promotion de l’activité privée.

### Paiement et exploitation

- [ ] Passer Stripe en production uniquement après obtention des informations d’entreprise et du compte bancaire.
- [ ] Créer le produit et le prix réels, puis reporter les identifiants dans Vercel.
- [ ] Contrôler le webhook Stripe en production et effectuer un paiement réel de faible montant.
- [ ] Vérifier le remboursement, l’annulation en fin de période et l’accès au portail client.
- [ ] Vérifier l’émission et le contenu des justificatifs/factures.
- [ ] Appliquer la migration `client-errors-monitoring-migration-2026-08-11.sql`.
- [ ] Vérifier que les erreurs techniques apparaissent dans le panneau admin.
- [ ] Documenter une procédure courte en cas d’indisponibilité de Supabase, Vercel ou Stripe.

### Recette produit finale

- [ ] Tester sur au moins un iPhone, un smartphone Android, une tablette et un ordinateur.
- [ ] Tester le parcours complet : accueil, choix du niveau, programme, diagnostic, essai, inscription, paiement, accès complet, bilan et résiliation.
- [ ] Tester au moins un exercice nécessitant une réponse négative à chaque niveau concerné.
- [ ] Contrôler figures, graphiques, tableaux de conversion et formules longues sur mobile.
- [ ] Vérifier la musique et le bouton de son dans chaque mode.
- [ ] Lancer la suite complète de tests et conserver un résultat sans erreur.
- [ ] Geler les nouvelles fonctionnalités pendant les derniers jours précédant le pilote.

## 2. Préparation du pilote

- [ ] Créer un code distinct par classe ou groupe afin de constituer des cohortes séparées.
- [ ] Utiliser un libellé non nominatif mais reconnaissable, par exemple `Pilote 5e - établissement A`.
- [ ] Fixer pour chaque code le niveau, l’effectif maximal et la durée décidée par l’administrateur.
- [ ] Présenter clairement aux élèves l’existence de contenus gratuits et l’absence d’obligation d’achat.
- [ ] Préparer un message indépendant destiné aux parents expliquant la finalité, le prix et la protection des données.
- [ ] Préparer un canal unique de retour et une procédure de réponse aux incidents.

### Indicateurs par cohorte

- [ ] Codes distribués et élèves attendus.
- [ ] Comptes activés.
- [ ] Élèves ayant répondu à au moins un exercice.
- [ ] Élèves revenus au moins deux jours distincts.
- [ ] Nombre total de réponses et taux de réussite.
- [ ] Diagnostics et parcours gratuits terminés.
- [ ] Consultations du bilan familial.
- [ ] Abonnements payants issus de la cohorte.
- [ ] Retours qualitatifs élève, parent et enseignant.
- [ ] Temps de support réellement consommé.

## 3. Première semaine après ouverture

- [ ] Lire chaque jour les erreurs techniques et les retours utilisateurs.
- [ ] Corriger immédiatement les blocages de paiement, connexion, saisie ou affichage.
- [ ] Ne pas interpréter les taux pédagogiques sur un échantillon trop petit.
- [ ] Contacter l’enseignant pilote à J+2 et J+7 avec des questions précises.
- [ ] Vérifier que les élèves reviennent spontanément hors de la séance collective.
- [ ] Contrôler la charge Supabase/Vercel et les erreurs Stripe.

## 4. Premier mois après lancement

- [ ] Mesurer activation, retour à J7, fréquence hebdomadaire, parcours terminés et conversion.
- [ ] Distinguer les cohortes plutôt que de mélanger tous les utilisateurs.
- [ ] Identifier les trois abandons les plus fréquents dans le tunnel.
- [ ] Relire manuellement les corrections ayant déclenché le plus d’erreurs ou de consultations.
- [ ] Interroger séparément élèves actifs, élèves abandonnistes et parents.
- [ ] Vérifier que le prix de 4,99 € est compris et accepté avant de le modifier.
- [ ] Calculer le revenu net réel après Stripe, cotisations, impôts et coûts techniques.
- [ ] Décider du prochain lot à partir des données, pas du nombre d’idées disponibles.

## 5. Après 1 à 3 mois, si les premiers signaux sont positifs

- [ ] Tester une offre annuelle simple sans supprimer le mensuel.
- [ ] Ajouter une relance légère et consentie pour les comptes inactifs.
- [ ] Améliorer le bilan parental selon les questions réellement posées par les familles.
- [ ] Étendre les contrôles visuels automatisés aux pages les plus sensibles.
- [ ] Centraliser les erreurs dans une solution avec alertes si le volume dépasse ce que le panneau admin permet de traiter.
- [ ] Solliciter de nouvelles cohortes d’enseignants en utilisant les résultats du premier pilote.
- [ ] Évaluer l’intérêt d’un domaine de contenu public ou de pages pré-rendues pour le référencement.

## 6. Évolutions possibles, seulement après validation du besoin

- [ ] Offre famille/fratrie avec profils enfants séparés.
- [ ] Abonnement annuel avec remise maîtrisée.
- [ ] Notifications ou courriels de réactivation configurables.
- [ ] Comparaison anonyme de progression personnelle dans le temps.
- [ ] Nouvelles animations spécialisées guidées par les erreurs réellement observées.
- [ ] Mode examen enrichi et offres saisonnières brevet/baccalauréat.
- [ ] Partenariats professionnels fondés sur des résultats documentés.
- [ ] Optimisation plus profonde du chargement asynchrone des banques de chapitres.

## 7. À ne pas construire pour le moment

- [ ] Pas de tableau de bord enseignant de suivi nominatif ou de gestion de classe.
- [ ] Pas de distribution autonome d’accès complets par les enseignants.
- [ ] Pas de nouvelle matière avant validation de la valeur en mathématiques.
- [ ] Pas de refonte technique générale sans problème mesuré.
- [ ] Pas de publicité payante avant mesure de la conversion et de la rétention.
- [ ] Pas de changement de prix sur la base de suppositions uniquement.

## 8. Seuils de décision provisoires

Ces seuils servent à organiser la discussion ; ils devront être adaptés à la taille réelle des cohortes.

- Signal pédagogique encourageant : au moins 50 % des activés reviennent un deuxième jour et les retours d’utilité atteignent 4/5.
- Signal de rétention encourageant : au moins 30 % des activés restent actifs à J7.
- Signal commercial initial : au moins 5 % des familles réellement exposées à l’offre s’abonnent.
- Signal commercial fort : conversion supérieure à 10 % avec résiliation faible après deux mois.
- Alerte produit : moins de 50 % terminent le diagnostic ou un abandon récurrent apparaît au même écran.
- Alerte opérationnelle : le support dépasse durablement 15 minutes par utilisateur payant et par mois.
