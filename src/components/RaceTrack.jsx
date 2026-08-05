import { colors } from "../theme";

// ---------------------------------------------------------------------------
// Piste de course animée, partagée par tous les jeux "course" de l'onglet
// Jeux (Course aux tables, Estimation express...) — voir src/pages/*.jsx.
// Extraite en composant de module séparé (et non redéfinie dans chaque page)
// : une fonction composant redéfinie à chaque rendu du parent serait vue par
// React comme un type de composant différent à chaque fois, forçant un
// démontage/remontage complet du DOM à chaque rendu — ce qui casserait
// purement et simplement la transition CSS "left" (l'animation a besoin que
// ce soit le MÊME élément DOM qui change de position).
//
// Props :
//   player          : { emoji, label } — l'animal du joueur
//   opponents       : [{ emoji, label }, ...] (3 adversaires)
//   playerProgress  : 0..1, avancement du joueur (par palier de question)
//   nowMs           : chrono temps réel écoulé depuis le départ
//   feedback        : "correct" | "wrong" | null — anime le joueur
//   thresholds      : { gold, silver, bronze } en ms — temps d'arrivée des
//                      3 adversaires (vitesse constante)
// ---------------------------------------------------------------------------
export default function RaceTrack({ player, opponents, playerProgress, nowMs, feedback, thresholds }) {
  const gold = colors.gold;
  const lanes = [
    { animal: player, isPlayer: true, durationMs: null },
    { animal: opponents[0], isPlayer: false, durationMs: thresholds.gold },
    { animal: opponents[1], isPlayer: false, durationMs: thresholds.silver },
    { animal: opponents[2], isPlayer: false, durationMs: thresholds.bronze },
  ];
  return (
    <div className="flex flex-col gap-3 mb-6">
      {lanes.map((lane, i) => {
        const progress = lane.isPlayer ? playerProgress : Math.min(nowMs / lane.durationMs, 1);
        return (
          <div key={i} className="relative" style={{ height: 34 }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: lane.isPlayer ? `${gold}14` : colors.hairline }}
            />
            <div
              className="absolute top-1/2"
              style={{
                left: `calc(${progress * 100}% - ${progress * 30}px)`,
                transform: "translateY(-50%)",
                transition: lane.isPlayer ? "left 0.4s ease" : "left 0.1s linear",
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  animation:
                    lane.isPlayer && feedback === "wrong"
                      ? "course-stumble 0.5s ease"
                      : lane.isPlayer && feedback === "correct"
                      ? "course-boost 0.5s ease"
                      : "none",
                }}
              >
                {lane.animal.emoji}
              </span>
            </div>
            <div className="absolute top-1/2 right-1" style={{ transform: "translateY(-50%)", fontSize: "0.9rem" }}>
              🏁
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
          40% { transform: translateY(-65%) scale(1.3); }
          100% { transform: translateY(-50%) scale(1); }
        }
      `}</style>
    </div>
  );
}
