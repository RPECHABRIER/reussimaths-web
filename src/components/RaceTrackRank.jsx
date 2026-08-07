import { colors } from "../theme";

// ---------------------------------------------------------------------------
// Piste de course "par classement" (/jeux/course-additions-cp-ce1) — variante
// de RaceTrack.jsx pensée pour un mécanisme différent : ici, personne n'a de
// vitesse propre indépendante. Les 4 personnages avancent TOUS À LA MÊME
// VITESSE le long de la piste (même position de base `progress`, qui ne
// dépend que du nombre de bonnes réponses du joueur) ; ce qui les distingue,
// c'est leur PLACE actuelle dans la course (1er à 4e), affichée comme un
// petit décalage avant/arrière au sein du peloton — pas un temps qui défile.
//
// Le joueur reste devant tant qu'il répond juste (rang inchangé), un
// personnage le double s'il se trompe (rang +1), et il peut lui-même doubler
// un personnage en répondant correctement en moins de 5s (rang -1) — logique
// portée par la page (voir CourseAdditionsCpCe1.jsx), ce composant ne fait
// qu'afficher le résultat (`rank`) de façon très lisible et animée pour de
// jeunes enfants (CP/CE1) : gros émojis, médaille de position, "boost" plus
// marqué qu'ailleurs dans l'appli (demande explicite de Romain : rendre
// l'animation plus visible pour motiver l'élève).
//
// Props :
//   player     : { emoji, label } — l'animal du joueur
//   opponents  : [{ emoji, label }, ...] (3 adversaires)
//   progress   : 0..1, avancement commun (nombre de bonnes réponses / objectif)
//   rank       : 1..4, place actuelle du joueur
//   feedback   : "correct" | "bonus" | "wrong" | null — anime le joueur
// ---------------------------------------------------------------------------

const SLOT_OFFSET = { 1: 9, 2: 3, 3: -3, 4: -9 }; // points de % ajoutés à `progress`
const MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉", 4: "4e" };

export default function RaceTrackRank({ player, opponents, progress, rank, feedback }) {
  const gold = colors.gold;

  // Les 3 adversaires occupent les places restantes (celles que le joueur
  // n'occupe pas actuellement), dans l'ordre.
  const remainingSlots = [1, 2, 3, 4].filter((s) => s !== rank);
  const lanes = [
    { animal: player, isPlayer: true, slot: rank },
    { animal: opponents[0], isPlayer: false, slot: remainingSlots[0] },
    { animal: opponents[1], isPlayer: false, slot: remainingSlots[1] },
    { animal: opponents[2], isPlayer: false, slot: remainingSlots[2] },
  ];

  return (
    <div className="flex flex-col gap-3 mb-6">
      {lanes.map((lane, i) => {
        const leftPct = Math.min(90, Math.max(3, progress * 100 + SLOT_OFFSET[lane.slot]));
        return (
          <div key={i} className="relative flex items-center gap-2">
            <span
              className="flex-shrink-0 text-center font-bold"
              style={{
                width: 28,
                fontSize: lane.slot <= 3 ? "1.1rem" : "0.65rem",
                color: lane.isPlayer ? gold : colors.slate,
              }}
            >
              {MEDALS[lane.slot]}
            </span>
            <div className="relative flex-1" style={{ height: 42 }}>
              <div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: lane.isPlayer ? `${gold}18` : colors.hairline }}
              />
              <div
                className="absolute top-1/2"
                style={{
                  left: `calc(${leftPct}% - ${leftPct * 0.3}px)`,
                  transform: "translateY(-50%)",
                  transition: "left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  fontSize: "2.1rem",
                  lineHeight: 1,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    animation:
                      lane.isPlayer && feedback === "wrong"
                        ? "course-stumble 0.5s ease"
                        : lane.isPlayer && feedback === "bonus"
                        ? "course-bonus 0.6s ease"
                        : lane.isPlayer && feedback === "correct"
                        ? "course-boost 0.5s ease"
                        : "none",
                  }}
                >
                  {lane.animal.emoji}
                </span>
              </div>
              <div className="absolute top-1/2 right-1" style={{ transform: "translateY(-50%)", fontSize: "1.1rem" }}>
                🏁
              </div>
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes course-stumble {
          0% { transform: translateY(-50%) rotate(0deg); }
          30% { transform: translateY(-30%) rotate(-25deg); }
          60% { transform: translateY(-50%) rotate(10deg); }
          100% { transform: translateY(-50%) rotate(0deg); }
        }
        @keyframes course-boost {
          0% { transform: translateY(-50%) scale(1); }
          40% { transform: translateY(-65%) scale(1.35); }
          100% { transform: translateY(-50%) scale(1); }
        }
        @keyframes course-bonus {
          0% { transform: translateY(-50%) scale(1); filter: drop-shadow(0 0 0 rgba(217,164,65,0)); }
          35% { transform: translateY(-80%) scale(1.6); filter: drop-shadow(0 0 10px rgba(217,164,65,0.9)); }
          70% { transform: translateY(-60%) scale(1.2); }
          100% { transform: translateY(-50%) scale(1); filter: drop-shadow(0 0 0 rgba(217,164,65,0)); }
        }
      `}</style>
    </div>
  );
}
