import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDueSkillsCount } from "../hooks/useDueSkillsCount";
import { useSubscription } from "../hooks/useProgress";
import { getEffectiveSubscription, isFullAccessSubscription } from "../lib/access";
import { colors, fonts } from "../theme";

// ---------------------------------------------------------------------------
// Carte "Réviser" mise en avant — remplace l'ancien lien texte discret noyé
// parmi "Mon compte" / "Amis & défis" sur les pages d'accueil, de sélection
// de niveau et de compte. Affiche un badge avec le nombre de compétences
// dues (répétition espacée, voir src/pages/Reviser.jsx) dès que l'utilisateur
// est connecté et en a au moins une, pour donner un vrai signal de rappel
// plutôt qu'un lien perdu dans la page.
// ---------------------------------------------------------------------------
export default function ReviserCard({ className = "" }) {
  const { user } = useAuth();
  const { subscription: rawSubscription } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const activeLevel = isFullAccessSubscription(subscription) && !subscription.admin_granted ? subscription.subscription_level : null;
  const dueCount = useDueSkillsCount(user?.id, activeLevel);

  return (
    <Link to="/reviser" className={className}>
      <div
        className="rounded-3xl px-5 py-4 flex items-center gap-3 transition-transform active:scale-[0.98]"
        style={{ backgroundColor: `${colors.green}14`, border: `1px solid ${colors.green}33` }}
      >
        <div
          className="flex items-center justify-center rounded-2xl flex-shrink-0 relative"
          style={{ width: 44, height: 44, backgroundColor: `${colors.green}22` }}
        >
          <RotateCcw size={20} color={colors.green} />
          {dueCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-[0.65rem] font-bold"
              style={{ minWidth: 18, height: 18, padding: "0 4px", backgroundColor: colors.red, color: "#fff" }}
            >
              {dueCount > 9 ? "9+" : dueCount}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1rem", fontWeight: 700 }}>Réviser</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: colors.slate }}>
            {dueCount > 0
              ? `${dueCount} compétence${dueCount > 1 ? "s" : ""} à repasser aujourd'hui`
              : activeLevel ? "Répétition espacée adaptée au niveau actif" : "Répétition espacée personnalisée"}
          </p>
        </div>
      </div>
    </Link>
  );
}
