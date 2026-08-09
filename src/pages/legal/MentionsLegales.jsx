import { Link } from "react-router-dom";
import LegalLayout from "./LegalLayout";

// ⚠️ Contenu générique à faire relire par un professionnel (avocat,
// expert-comptable ou CFE) avant toute exploitation commerciale réelle —
// ceci n'est pas un conseil juridique. Voir les [À compléter] ci-dessous :
// une fois le statut auto-entrepreneur créé, il faudra a minima publier
// nom/prénom, statut, SIRET et adresse conformément à l'article 6-III de la
// loi LCEN pour toute activité professionnelle (même en ligne).
export default function MentionsLegales() {
  return (
    <LegalLayout title="Mentions légales">
      <p>
        RéussiMaths est actuellement en <strong>phase de test</strong>. L'éditeur du site n'a, à ce stade, pas encore
        finalisé son immatriculation professionnelle (auto-entrepreneur). Cette page doit donc rester considérée comme
        provisoire et sera complétée avant toute ouverture commerciale réelle.
      </p>
      <div className="legal-callout">
        <strong>Ouverture commerciale bloquée tant que ces informations ne sont pas publiées :</strong>
        <ul><li>nom, prénom, statut et adresse professionnelle de l’éditeur ;</li><li>SIRET et inscription au registre national des entreprises ;</li><li>adresse e-mail et numéro de téléphone professionnels ;</li><li>coordonnées du médiateur de la consommation choisi.</li></ul>
      </div>
      <p>
        <strong>[À compléter dès l'immatriculation]</strong> — avant toute ouverture commerciale réelle
        (abonnements payants hors mode test), cette page sera mise à jour avec : nom et prénom de l'éditeur, statut
        (entrepreneur individuel), numéro SIRET, adresse du siège, adresse e-mail de contact.
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis. Informations légales de l'hébergeur disponibles sur{" "}
        <a href="https://vercel.com/legal" target="_blank" rel="noreferrer">
          vercel.com/legal
        </a>
        .
      </p>
      <p>
        La base de données et l'authentification sont gérées par Supabase (Supabase Inc.). Informations légales sur{" "}
        <a href="https://supabase.com/legal" target="_blank" rel="noreferrer">
          supabase.com/legal
        </a>
        .
      </p>
      <p>
        Les paiements sont traités par Stripe. Informations légales sur{" "}
        <a href="https://stripe.com/fr/legal" target="_blank" rel="noreferrer">
          stripe.com/fr/legal
        </a>
        .
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus pédagogiques (exercices, corrections, méthodes), la charte graphique et le code de
        l'application RéussiMaths sont la propriété de l'éditeur, sauf mention contraire. Toute reproduction ou
        représentation, totale ou partielle, sans autorisation est interdite.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative au site, une adresse de contact sera publiée ici dès la finalisation du statut
        de l'éditeur. En attendant, voir les <Link to="/cgu">CGU</Link> et la{" "}
        <Link to="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>Médiation de la consommation</h2>
      <p><strong>[À compléter avant la première vente]</strong> — les coordonnées et le site internet du médiateur de la consommation auquel l’éditeur aura adhéré seront publiés dans cette section.</p>
    </LegalLayout>
  );
}
