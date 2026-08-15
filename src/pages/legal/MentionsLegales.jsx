import { Link } from "react-router-dom";
import LegalLayout from "./LegalLayout";

export default function MentionsLegales() {
  return (
    <LegalLayout title="Mentions légales">
      <h2>Éditrice et exploitante</h2>
      <p>
        Le site RéussiMaths est édité et exploité par <strong>Nadine LEFEBVRE, Entrepreneur individuel (EI)</strong>,
        exerçant sous le nom commercial <strong>RéussiMaths</strong>.
      </p>
      <ul>
        <li>Adresse professionnelle : 37 rue Caron, 77610 Marles-en-Brie, France</li>
        <li>SIREN : 108 734 930</li>
        <li>Immatriculation : RCS Meaux 108 734 930 et Registre national des entreprises (RNE)</li>
        <li>SIRET : en cours d'attribution</li>
        <li>Adresse électronique : <a href="mailto:reussimaths@protonmail.com">reussimaths@protonmail.com</a></li>
        <li>Téléphone professionnel : <a href="tel:+33602720997">06 02 72 09 97</a></li>
        <li>TVA non applicable, article 293 B du Code général des impôts</li>
      </ul>
      <p>Directrice de la publication : Nadine LEFEBVRE.</p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis — téléphone : +1 559 288 7060. Informations légales de l'hébergeur disponibles sur{" "}
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
        Les contenus pédagogiques (exercices, corrections, méthodes), la charte graphique et le code de
        l'application RéussiMaths sont exploités par l'éditeur en vertu des droits qu'il détient ou des autorisations
        qui lui ont été accordées. Toute reproduction ou représentation, totale ou partielle, sans autorisation est
        interdite.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative au site ou toute réclamation, écrire à{" "}
        <a href="mailto:reussimaths@protonmail.com">reussimaths@protonmail.com</a>. Voir également les{" "}
        <Link to="/cgu">CGU/CGV</Link> et la{" "}
        <Link to="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>Médiation de la consommation</h2>
      <p>
        Après une réclamation écrite préalable auprès de RéussiMaths et à défaut de solution amiable, le Client
        consommateur peut saisir gratuitement le médiateur de la consommation désigné :
      </p>
      <address className="not-italic">
        <strong>La Société Médiation Professionnelle</strong><br />
        <a href="https://www.mediateur-consommation-smp.fr/" target="_blank" rel="noreferrer">
          www.mediateur-consommation-smp.fr
        </a><br />
        Alteritae, 5 rue Salvaing, 12000 Rodez
      </address>
    </LegalLayout>
  );
}
