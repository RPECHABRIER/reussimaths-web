import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useLastActivity } from "../hooks/useLastActivity";
import { getEffectiveSubscription, isFullAccessSubscription, isPackExamenSubscription } from "../lib/access";
import mascotTriste from "../assets/mascot/mascot-triste.png";
import mascotGratuit from "../assets/mascot/mascot-gratuit.png";
import mascotPackExamen from "../assets/mascot/mascot-pack-examen.png";
import mascotFullAccess from "../assets/mascot/mascot-full-access.png";

// ---------------------------------------------------------------------------
// Logo/mascotte qui change de tête selon la situation de l'utilisateur (4
// versions dessinées par Romain) :
//   - "triste"       : plus de 7 jours sans pratique (voir useLastActivity)
//   - "gratuit"       : pas connecté, ou connecté sans abonnement actif
//   - "pack-examen"   : Pack Examen actif
//   - "full-access"   : abonnement complet actif (avec étoiles)
// La priorité va à l'inactivité : même un abonné complet qui n'a pas
// pratiqué depuis plus d'une semaine voit la version triste (pour l'inciter
// à revenir), pas la version étoilée.
// ---------------------------------------------------------------------------
const INACTIVITY_DAYS = 7;

const MASCOTS = {
  triste: mascotTriste,
  gratuit: mascotGratuit,
  packExamen: mascotPackExamen,
  fullAccess: mascotFullAccess,
};

export function useMascotKey() {
  const { user } = useAuth();
  const { subscription: rawSubscription } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const { daysSinceLastActivity } = useLastActivity(user?.id);

  if (user && daysSinceLastActivity !== null && daysSinceLastActivity > INACTIVITY_DAYS) {
    return "triste";
  }
  if (isFullAccessSubscription(subscription)) return "fullAccess";
  if (isPackExamenSubscription(subscription)) return "packExamen";
  return "gratuit";
}

export default function Mascot({ size = 84, className = "", style, motion = "none" }) {
  const key = useMascotKey();
  return (
    <img
      src={MASCOTS[key]}
      alt="RéussiMaths"
      width={size}
      height={size}
      className={`${className} ${motion !== "none" ? `mascot-motion-${motion}` : ""}`.trim()}
      style={{ objectFit: "contain", borderRadius: size * 0.22, ...style }}
    />
  );
}
