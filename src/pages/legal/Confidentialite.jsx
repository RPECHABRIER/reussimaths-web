import LegalLayout from "./LegalLayout";

// ⚠️ Modèle générique à faire relire par un professionnel avant lancement
// commercial réel (obligations RGPD précises selon le statut de l'éditeur).
export default function Confidentialite() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <p>
        Cette politique explique quelles données sont collectées par Reussimaths, pourquoi, et comment elles sont
        protégées, conformément au Règlement Général sur la Protection des Données (RGPD).
      </p>

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
        <li>
          <strong>Abonnement</strong> : statut d'abonnement et identifiant client Stripe (pas les coordonnées
          bancaires, gérées exclusivement par Stripe).
        </li>
        <li>
          <strong>Parrainage</strong> : lien entre un compte parrain et les comptes parrainés.
        </li>
      </ul>

      <h2>2. Finalités</h2>
      <p>
        Ces données sont utilisées pour : permettre la connexion et la sauvegarde de la progression, gérer les
        abonnements payants, faire fonctionner les fonctionnalités sociales (défis, parrainage), et améliorer le
        Service.
      </p>

      <h2>3. Sous-traitants et destinataires</h2>
      <ul>
        <li>Supabase (hébergement de la base de données et authentification)</li>
        <li>Stripe (traitement des paiements)</li>
        <li>Google (et Apple, lorsque disponible) pour l'authentification</li>
        <li>Vercel (hébergement de l'application)</li>
      </ul>
      <p>Aucune donnée n'est vendue à des tiers à des fins publicitaires.</p>

      <h2>4. Durée de conservation</h2>
      <p>
        Les données sont conservées tant que le compte est actif. En cas de suppression du compte, les données
        personnelles associées sont supprimées dans un délai raisonnable, sous réserve des obligations légales de
        conservation (notamment comptables, liées aux paiements).
      </p>

      <h2>5. Droits de l'utilisateur</h2>
      <p>
        Conformément au RGPD, l'utilisateur dispose d'un droit d'accès, de rectification, d'effacement, de limitation
        et de portabilité de ses données, ainsi que d'un droit d'opposition. Ces droits peuvent être exercés en
        contactant l'éditeur (coordonnées publiées dans les{" "}
        <a href="/mentions-legales">mentions légales</a> dès finalisation du statut de l'éditeur).
      </p>

      <h2>6. Sécurité</h2>
      <p>
        L'accès aux données est protégé par des règles de sécurité au niveau de la base de données (Row Level
        Security) : chaque utilisateur ne peut consulter que ses propres données de progression et d'abonnement. Les
        mots de passe ne sont jamais gérés directement par Reussimaths (connexion déléguée à Google/Apple).
      </p>

      <h2>7. Cookies</h2>
      <p>
        Le Service utilise le stockage local du navigateur (localStorage) pour retenir certaines préférences
        techniques (par exemple le quota quotidien de questions gratuites, ou un identifiant de parrainage temporaire)
        et la session de connexion. Aucun cookie publicitaire tiers n'est utilisé.
      </p>
    </LegalLayout>
  );
}
