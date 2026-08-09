import { Link, useLocation } from "react-router-dom";
import { ArrowRight, GraduationCap, School } from "lucide-react";
import { getLevelsByCycle, CYCLES } from "../levels";
import { getChaptersByLevel } from "../chapters/registry";
import ReviserCard from "../components/ReviserCard";
import { colors, fonts, shadow, cycleColors } from "../theme";
import { setPreferredLevel } from "../lib/preferences";

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
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Collège ou lycée
        </Link>

        <div className="text-center my-10 sm:my-14">
          <div
            className="inline-flex items-center justify-center rounded-2xl mb-3"
            style={{ width: 54, height: 54, backgroundColor: `${c.accent}1f` }}
          >
            {cycleId === "college" ? <School size={26} color={c.accent} /> : <GraduationCap size={26} color={c.accent} />}
          </div>
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Ton parcours {cycle.label.toLowerCase()}
          </h1>
          <p className="text-base mt-2 max-w-xl mx-auto" style={{ color: colors.slate }}>
            Choisis ta classe pour retrouver les chapitres du programme et commencer par le bon entraînement.
          </p>
        </div>

        <ReviserCard className="block mb-6 max-w-xl mx-auto" />

        <div className="grid sm:grid-cols-2 gap-4">
          {levels.map((level) => {
            const available = getChaptersByLevel(level.id).length > 0;
            return (
              <Link key={level.id} to={`/niveau/${level.id}`} onClick={() => setPreferredLevel(level.id)}>
                <div
                  className="group rounded-3xl px-5 py-5 flex items-center gap-4 transition-transform hover:-translate-y-1 active:scale-[0.98]"
                  style={{ backgroundColor: colors.card, boxShadow: shadow.soft, borderTop: `3px solid ${c.accent}` }}
                >
                  <p className="flex-1" style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.25rem", fontWeight: 800 }}>
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
                  {available && <ArrowRight size={17} color={c.accent} />}
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
