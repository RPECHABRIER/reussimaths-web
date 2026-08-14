import LegalLayout from "./LegalLayout";

// ⚠️ Modèle générique à faire relire par un professionnel avant lancement
// commercial réel (droit de la consommation, vente à distance, etc.).
export default function CGU() {
  return (
    <LegalLayout title="Conditions Générales d'Utilisation et de Vente">
      <p>
        Les présentes Conditions Générales d'Utilisation et de Vente (« CGU ») régissent l'accès et l'utilisation de
        l'application RéussiMaths (le « Service »), destinée à la révision des mathématiques du collège et du lycée.
        En créant un compte ou en utilisant le Service, l'utilisateur accepte les présentes CGU.
      </p>
      <p><strong>Vendeur et éditeur :</strong> Nadine LEFEBVRE, Entrepreneur individuel (EI), nom commercial RéussiMaths, SIREN 108 734 930, RCS Meaux 108 734 930. Adresse et coordonnées professionnelles publiées dans les mentions légales.</p>

      <h2>1. Description du Service</h2>
      <p>
        RéussiMaths propose des exercices de mathématiques générés ou issus d'une banque d'exercices, organisés par
        niveau scolaire (de la 6e à la terminale). Certains contenus sont accessibles gratuitement (avec ou sans
        limite quotidienne), d'autres nécessitent un abonnement payant.
      </p>

      <h2>2. Compte utilisateur</h2>
      <p>
        La création d'un compte se fait via une adresse e-mail ou une connexion Google. Aucun nom réel ni
        adresse e-mail de connexion n'est affiché publiquement dans l'application : l'utilisateur choisit un pseudo
        après sa première connexion, qui constitue son identité publique (visible par ses amis en cas de défi).
        L'utilisateur est responsable de la confidentialité de son moyen de connexion.
      </p>

      <h2>3. Abonnements et paiement</h2>
      <p>Deux formules sont proposées à ce jour :</p>
      <ul>
        <li>un abonnement mensuel à 4,99 € TTC donnant accès à un niveau scolaire choisi, reconductible automatiquement et résiliable à tout moment depuis l'espace « Mon compte » ;</li>
        <li>
          une offre ponctuelle (« Pack Examen ») à 9 € TTC donnant, pendant 3 mois et pour un niveau choisi,
          accès au chapitre de préparation à l'examen, aux automatismes en illimité et à deux chapitres bonus
          choisis par l'utilisateur : paiement unique, non reconductible, qui n'est jamais débité à nouveau
          automatiquement.
        </li>
      </ul>
      <p>Un compte est destiné au suivi d'un seul élève. Le niveau associé à l'abonnement mensuel peut être corrigé librement pendant les 24 heures suivant le choix initial, puis modifié au maximum une fois tous les 30 jours. Une modification de niveau ne supprime pas l'historique de progression déjà enregistré.</p>
      <p>
        Les paiements sont traités par Stripe, prestataire de paiement tiers. RéussiMaths n'a à aucun moment accès
        aux coordonnées bancaires complètes de l'utilisateur. Les tarifs sont indiqués toutes taxes comprises le cas
        échéant.
      </p>
      <p>
        Avant de payer, l'utilisateur voit la formule choisie, son prix, sa durée et, pour l'abonnement mensuel, sa
        reconduction automatique. La validation du bouton portant la mention « avec obligation de paiement » vaut
        commande ferme. Une confirmation de la transaction est ensuite fournie par voie électronique.
      </p>

      <h2>4. Droit de rétractation</h2>
      <p>
        Conformément au droit de la consommation, l'utilisateur consommateur dispose en principe d'un délai de 14
        jours pour se rétracter d'un achat à distance. En souscrivant à un accès immédiat au contenu numérique avant
        la fin de ce délai, l'utilisateur reconnaît et accepte expressément la perte de son droit de rétractation dès
        le début de l'exécution du Service, conformément à l'article L221-28 du Code de la consommation.
      </p>

      <h2>5. Résiliation</h2>
      <p>
        L'abonnement mensuel peut être résilié à tout moment depuis « Mon compte » ; la résiliation prend effet à la
        fin de la période déjà payée, sans remboursement au prorata. L'offre ponctuelle expire automatiquement à la
        fin de sa durée et n'a pas besoin d'être résiliée.
      </p>

      <h2>6. Parrainage</h2>
      <p>
        Un utilisateur peut inviter d'autres personnes via son lien de parrainage personnel. Certains contenus
        peuvent être débloqués en fonction du nombre de filleuls inscrits. RéussiMaths se réserve le droit
        d'invalider un parrainage en cas d'usage frauduleux manifeste (comptes multiples créés dans le seul but de
        débloquer du contenu).
      </p>

      <h2>7. Comportement et contenus</h2>
      <p>
        L'utilisateur s'engage à ne pas utiliser le Service à des fins autres que la révision scolaire, à ne pas
        tenter de contourner les mécanismes d'abonnement ou de quota, et à respecter les autres utilisateurs dans le
        cadre des fonctionnalités sociales (défis entre amis).
      </p>

      <h2>8. Responsabilité</h2>
      <p>
        Le Service est fourni « en l'état ». RéussiMaths met tout en œuvre pour assurer l'exactitude des contenus
        pédagogiques mais ne garantit pas l'absence totale d'erreur. Le Service ne remplace pas un enseignement
        structuré et ne saurait engager la responsabilité de l'éditeur quant aux résultats scolaires de
        l'utilisateur.
      </p>

      <h2>9. Modification des CGU</h2>
      <p>
        Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés de toute
        modification substantielle.
      </p>

      <h2>10. Droit applicable</h2>
      <p>Les présentes CGU sont soumises au droit français.</p>

      <h2>11. Réclamation et médiation</h2>
      <p>En cas de difficulté, l’utilisateur doit d’abord adresser une réclamation écrite à <a href="mailto:reussimaths@protonmail.com">reussimaths@protonmail.com</a> afin de rechercher une solution amiable. <strong>La convention de médiation est signée.</strong> Les coordonnées du médiateur désigné seront publiées ici et dans les mentions légales dès leur réception.</p>
    </LegalLayout>
  );
}
