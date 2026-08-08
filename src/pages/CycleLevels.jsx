import { Link, useLocation } from "react-router-dom";
import { getLevelsByCycle, CYCLES } from "../levels";
import { getChaptersByLevel } from "../chapters/registry";
import ReviserCard from "../components/ReviserCard";
import { colors, fonts, shadow, cycleColors } from "../theme";

// Deuxième étape de l'accueil (/college ou /lycee) : la liste des niveaux du
// cycle choisi (repris de l'ancien LevelSelect.jsx, désormais filtré par
// cycle). Voir CycleSelect.jsx pour le premier choix.
// Routes explicites (/college, /lycee, pas de segment dynamique) : on déduit
// le cycle directement du chemin plutôt que via useParams.
export default function CycleLevels() {
  const { pathname } = useLocation();
  const cycleId = pathname.replace(/^\//, "");
  const cycle = CYCLES.find((c) => c.id === cycleId);
  const levels = getLevelsByCycle(cycleId);
  const c = cycleColors[cycleId] ?? cycleColors.college;

  if (!cycle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center" style={{ background: colors.bg }}>
        <p style={{ color: colors.slate }}>Cycle introuvable.</p>
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto">
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Collège ou lycée
        </Link>

        <div className="text-center my-7">
          <div
            className="inline-flex items-center justify-center rounded-2xl mb-3"
            style={{ width: 48, height: 48, backgroundColor: `${c.accent}1f` }}
          >
            <div style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: c.accent }} />
          </div>
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {cycle.label}
          </h1>
          <p className="text-sm mt-1.5" style={{ color: colors.slate }}>
            Choisis ta classe
          </p>
        </div>

        <ReviserCard className="block mb-4" />

        <div className="flex flex-col gap-3">
          {levels.map((level) => {
            const available = getChaptersByLevel(level.id).length > 0;
            return (
              <Link key={level.id} to={`/niveau/${level.id}`}>
                <div
                  className="rounded-3xl px-5 py-4 flex items-center justify-between transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: colors.card, boxShadow: shadow.soft, borderLeft: `3px solid ${c.accent}` }}
                >
                  <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.1rem", fontWeight: 700 }}>
                    {level.label}
                  </p>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: available ? `${colors.green}18` : `${colors.slate}14`,
                      color: available ? colors.green : colors.slate,
                    }}
                  >
                    {available ? "Disponible" : "Bientôt"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10 flex items-center justify-center gap-5">
          <Link to="/compte" className="text-sm font-medium" style={{ color: colors.ink }}>
            Mon compte
          </Link>
          <Link to="/amis" className="text-sm font-medium" style={{ color: colors.ink }}>
            Amis & défis
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8 pt-5 text-xs" style={{ borderTop: `1px solid ${colors.hairline}`, color: colors.slate }}>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/cgu">CGU</Link>
          <Link to="/confidentialite">Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}
