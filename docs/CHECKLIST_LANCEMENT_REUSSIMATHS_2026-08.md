# Checklist de lancement de RéussiMaths

Document de pilotage vivant. L’audit de Claude sert de second avis ; les priorités ci-dessous tiennent compte de la stratégie réelle de RéussiMaths : abonnement familial, rituel enseignant gratuit et accès classe exceptionnel créé uniquement par l’administrateur.

## État vérifié le 14 août 2026

### Validé

- [x] Entreprise individuelle de Nadine LEFEBVRE créée ; SIREN reçu et compte Indy ouvert.
- [x] Stripe activé en production avec un prix mensuel et un prix Pack Examen.
- [x] Abonnement mensuel testé avec un paiement réel : activation, niveau unique, calcul mental, résiliation, webhook et remboursement contrôlés.
- [x] Pack Examen testé avec un paiement réel : activation, durée de trois mois, choix du niveau et de deux bonus, verrouillage des autres chapitres et remboursement contrôlés.
- [x] Webhooks d'abonnement adaptés à l'API Stripe 2026 et retours `200 OK` observés.
- [x] Recette automatisée : 48 tests techniques réussis, 135 chapitres, 27 000 exercices, 884 figures, 475 graphiques et 15 692 expressions mathématiques contrôlés sans anomalie.
- [x] Audit pédagogique : 32 400 exercices contrôlés, aucun retour générique, aucune correction trop courte et aucune famille hors niveau.
- [x] Audit des cours, modes de calcul et rendus LaTeX réussi sans anomalie.

### Actions techniques avant le prochain remboursement réel

- [ ] Exécuter `supabase/pack-refund-revocation-2026-08-14.sql` dans Supabase.
- [ ] Déployer le webhook contenant la gestion de `charge.refunded`.
- [ ] Ajouter l'événement `charge.refunded` à la destination Stripe « RéussiMaths production ».
- [ ] Effectuer ensuite un dernier remboursement de Pack sur un compte de test et vérifier la révocation automatique.

### Blocages juridiques avant ouverture commerciale publique

- [x] Recevoir le SIRET et le code APE, puis remplacer « en cours d'attribution » dans les mentions légales (`108 734 930 00010`, APE `58.29C`).
- [ ] Disposer d'un numéro de téléphone professionnel publiable ; les sources officielles françaises le listent parmi les coordonnées obligatoires d'un site marchand.
- [x] Signer la convention avec le médiateur de la consommation.
- [ ] À réception, publier le nom, les coordonnées et le site du médiateur dans les mentions légales et les CGV.
- [ ] Faire relire le cadre contractuel, la propriété intellectuelle et le rôle effectif de chaque intervenant par un professionnel compétent.

## 1. Avant d’accepter le premier paiement

### Cadre professionnel et administratif

- [ ] Confirmer que la mère du créateur sera l’exploitante effective de RéussiMaths, et pas uniquement la titulaire administrative de l’activité.
- [x] Déclarer à son nom l’entreprise individuelle sous régime micro-entrepreneur sur le guichet unique officiel.
- [ ] Formaliser par écrit le droit pour l’entreprise d’exploiter le logiciel, les contenus, la marque et les visuels créés antérieurement.
- [ ] Faire valider par un professionnel le cadre de la contribution régulière du créateur au produit, afin d’éviter une activité professionnelle informelle ou une gérance de fait.
- [x] Recevoir et contrôler les numéros SIREN/SIRET et le code APE attribué.
- [x] Créer le compte bancaire dédié Indy et conserver les justificatifs d’ouverture.
- [ ] Créer les espaces Urssaf et impots.gouv professionnels dès que les identifiants sont disponibles.
- [ ] Déterminer avec l’Urssaf ou le SIE la qualification fiscale/sociale exacte de la vente d’abonnements à RéussiMaths (BIC ou BNC) ; ne pas la deviner dans le formulaire.
- [ ] Vérifier l’éligibilité à l’Acre et au versement libératoire, sans les sélectionner automatiquement.
- [ ] Demander à la caisse de retraite de l’exploitante de confirmer les règles de cumul emploi-retraite applicables à sa pension.
- [ ] Prévoir un livre des recettes et une numérotation continue des factures.

### Confiance et conformité du site

- [ ] Acheter et connecter un nom de domaine RéussiMaths.
- [ ] Créer une adresse électronique professionnelle sur ce domaine.
- [x] Mettre à jour les mentions légales avec identité, statut, adresse de contact, SIREN/SIRET et coordonnées professionnelles.
- [ ] Mettre à jour les CGV/CGU, la politique de confidentialité et l’identité affichée dans Stripe.
- [ ] Vérifier les règles applicables aux mineurs, aux données scolaires et au consentement parental.
- [ ] Maintenir une séparation stricte entre les fonctions institutionnelles du créateur et la promotion de l’activité privée de sa mère.

### Paiement et exploitation

- [x] Passer Stripe en production uniquement après obtention des informations d’entreprise et du compte bancaire.
- [x] Créer le produit et le prix réels, puis reporter les identifiants dans Vercel.
- [x] Contrôler le webhook Stripe en production et effectuer un paiement réel de faible montant.
- [x] Vérifier le remboursement, l’annulation en fin de période et l’accès au portail client.
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
- [x] Lancer la suite complète de tests et conserver un résultat sans erreur.
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

- [ ] Appliquer chaque semaine le rituel de maintenance de 1 à 2 heures décrit dans `docs/RITUEL_HEBDOMADAIRE_APRES_LANCEMENT.md`.

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
