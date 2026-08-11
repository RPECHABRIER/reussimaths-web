import LegalLayout from "./LegalLayout";

// ⚠️ Modèle générique à faire relire par un professionnel avant lancement
// commercial réel (obligations RGPD précises selon le statut de l'éditeur).
export default function Confidentialite() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <p>
        Cette politique explique quelles données sont collectées par RéussiMaths, pourquoi, et comment elles sont
        protégées, conformément au Règlement Général sur la Protection des Données (RGPD).
      </p>
      <p><strong>Responsable du traitement :</strong> <strong>[à compléter avant la première vente]</strong> — Mme [nom et prénom], entrepreneur individuel, SIRET [numéro], coordonnées publiées dans les mentions légales.</p>

      <h2>1. Données collectées</h2>
      <ul>
        <li>
          <strong>Identité de connexion</strong> : lors de la connexion via Google (ou Apple), un identifiant unique
          et une adresse e-mail sont transmis par le fournisseur d'identité. Cette adresse n'est jamais affichée
          publiquement dans l'application.
        </li>
        <li>
          <strong>Pseudo</strong> : choisi par l'utilisateur, affiché à ses amis dans le cadre des défis.
        </li>
        <li>
          <strong>Progression</strong> : scores, séries de bonnes réponses, chapitres pratiqués.
        </li>
        <li><strong>Données d’apprentissage</strong> : compétence travaillée, réussite ou erreur, catégorie générale de l’erreur, durée de réponse et utilisation éventuelle d’une aide. La réponse brute saisie n’est pas conservée dans ce suivi.</li>
        <li>
          <strong>Abonnement</strong> : statut d'abonnement et identifiant client Stripe (pas les coordonnées
          bancaires, gérées exclusivement par Stripe).
        </li>
        <li>
          <strong>Parrainage</strong> : lien entre un compte parrain et les comptes parrainés.
        </li>
        <li><strong>Mesure d’usage</strong> : identifiant aléatoire du navigateur, pages principales et étapes du parcours commercial, sans nom ni adresse e-mail.</li>
        <li><strong>Retours facultatifs</strong> : notes d’utilité et de simplicité, rôle déclaré et commentaire transmis volontairement.</li>
      </ul>

      <h2>2. Finalités</h2>
      <p>
        Ces données sont utilisées pour : permettre la connexion et la sauvegarde de la progression, gérer les
        abonnements payants, faire fonctionner les fonctionnalités sociales (défis, parrainage), adapter les révisions,
        mesurer la conversion et la rétention de manière pseudonyme, et améliorer le Service.
      </p>

      <h2>3. Bases juridiques</h2>
      <ul><li>exécution du service demandé : compte, progression, accès et abonnement ;</li><li>obligations légales : conservation des justificatifs liés aux paiements ;</li><li>intérêt légitime de RéussiMaths : sécurité, prévention des abus et diagnostic des erreurs techniques ;</li><li>consentement lorsqu’il est juridiquement nécessaire pour une fonctionnalité facultative.</li></ul>

      <h2>4. Utilisateurs mineurs</h2>
      <p>RéussiMaths est destiné notamment à des élèves mineurs. Pour un traitement facultatif fondé sur le consentement, un utilisateur âgé de moins de 15 ans doit être accompagné par le titulaire de l’autorité parentale selon les règles applicables. Les fonctionnalités essentielles sont conçues pour limiter les données demandées : le nom réel n’est pas affiché et un pseudo peut être utilisé.</p>

      <h2>5. Sous-traitants et destinataires</h2>
      <ul>
        <li>Supabase (hébergement de la base de données et authentification)</li>
        <li>Stripe (traitement des paiements)</li>
        <li>Google (et Apple, lorsque disponible) pour l'authentification</li>
        <li>Vercel (hébergement de l'application)</li>
      </ul>
      <p>Aucune donnée n'est vendue à des tiers à des fins publicitaires.</p>

      <h2>6. Durée de conservation</h2>
      <p>
        Les données sont conservées tant que le compte est actif. En cas de suppression du compte, les données
        personnelles associées sont supprimées dans un délai raisonnable, sous réserve des obligations légales de
        conservation (notamment comptables, liées aux paiements).
      </p>

      <h2>7. Droits de l'utilisateur</h2>
      <p>
        Conformément au RGPD, l'utilisateur dispose d'un droit d'accès, de rectification, d'effacement, de limitation
        et de portabilité de ses données, ainsi que d'un droit d'opposition. Ces droits peuvent être exercés en
        contactant l'éditeur (coordonnées publiées dans les{" "}
        <a href="/mentions-legales">mentions légales</a> dès finalisation du statut de l'éditeur).
      </p>

      <h2>8. Sécurité et diagnostic technique</h2>
      <p>
        L'accès aux données est protégé par des règles de sécurité au niveau de la base de données (Row Level
        Security) : chaque utilisateur ne peut consulter que ses propres données de progression et d'abonnement. Les
        mots de passe ne sont jamais gérés directement par RéussiMaths (connexion déléguée à Google/Apple).
      </p>
      <p>Lorsqu’une erreur technique bloque une page, un diagnostic limité peut être transmis aux journaux de l’hébergeur : message technique, emplacement dans l’application, trace logicielle et date. Le contenu des réponses scolaires, l’adresse e-mail et les informations bancaires ne sont pas inclus dans ce signalement.</p>

      <h2>9. Cookies et stockage local</h2>
      <p>
        Le Service utilise le stockage local du navigateur (localStorage) pour retenir certaines préférences
        techniques (par exemple le quota quotidien de questions gratuites, un identifiant de parrainage temporaire ou
        un identifiant aléatoire servant à mesurer les étapes d’utilisation)
        et la session de connexion. Aucun cookie publicitaire tiers n'est utilisé.
      </p>
    </LegalLayout>
  );
}
