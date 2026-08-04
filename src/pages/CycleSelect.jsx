import { Link } from "react-router-dom";
import { GraduationCap, School, Sparkles, Brain } from "lucide-react";
import { CYCLES } from "../levels";
import ReviserCard from "../components/ReviserCard";
import { colors, fonts, shadow } from "../theme";

// Nouvelle page d'accueil (/) : premier choix, avant même les niveaux —
// Collège ou Lycée. Chaque carte mène à /college ou /lycee (voir
// CycleLevels.jsx), qui reprend l'ancien affichage de LevelSelect.jsx mais
// filtré sur le cycle choisi. La sélection à plat de tous les niveaux reste
// possible via LevelSelect.jsx si besoin, mais n'est plus la page d'accueil.
const ICONS = { college: School, lycee: GraduationCap };

export default function CycleSelect() {
  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10 pt-4">
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Reussimaths
          </h1>
          <p className="text-sm mt-1.5" style={{ color: colors.slate }}>
            Tu es en collège ou au lycée ?
          </p>
          <div
            className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 rounded-full"
            style={{ backgroundColor: `${colors.gold}18` }}
          >
            <p className="text-xs font-semibold" style={{ color: colors.gold }}>
              Conforme aux nouveaux programmes 2026
            </p>
          </div>
          <p
            className="flex items-start justify-center gap-1.5 text-xs mt-3 max-w-[19rem] mx-auto leading-relaxed"
            style={{ color: colors.slate }}
          >
            <Brain size={13} className="flex-shrink-0 mt-0.5" style={{ color: colors.ink }} />
            <span>
              Une pédagogie appuyée sur les sciences cognitives : répétition espacée, correction immédiate et méthode
              visible avant le résultat.
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {CYCLES.map((cycle) => {
            const Icon = ICONS[cycle.id];
            return (
              <Link key={cycle.id} to={`/${cycle.id}`}>
                <div
                  className="rounded-3xl px-6 py-7 flex items-center gap-4 transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: colors.card, boxShadow: shadow.raised }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl"
                    style={{ width: 52, height: 52, backgroundColor: `${colors.ink}0d`, flexShrink: 0 }}
                  >
                    <Icon size={26} color={colors.ink} />
                  </div>
                  <div>
                    <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.3rem", fontWeight: 800 }}>
                      {cycle.label}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: colors.slate }}>
                      {cycle.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <ReviserCard className="block mt-6" />

        <Link to="/parcours/decouverte">
          <div
            className="rounded-3xl px-5 py-4 flex items-center gap-3 mt-3 transition-transform active:scale-[0.98]"
            style={{ backgroundColor: `${colors.gold}12`, border: `1px solid ${colors.gold}33` }}
          >
            <div
              className="flex items-center justify-center rounded-2xl flex-shrink-0"
              style={{ width: 44, height: 44, backgroundColor: `${colors.gold}22` }}
            >
              <Sparkles size={20} color={colors.gold} />
            </div>
            <div>
              <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1rem", fontWeight: 700 }}>
                Parcours découverte
              </p>
              <p className="text-xs mt-0.5" style={{ color: colors.slate }}>
                Un avant-goût gratuit, du collège au lycée
              </p>
            </div>
          </div>
        </Link>

        <div className="text-center mt-10 flex items-center justify-center gap-5">
          <Link to="/compte" className="text-sm font-medium" style={{ color: colors.ink }}>
            Mon compte
          </Link>
          <Link to="/amis" className="text-sm font-medium" style={{ color: colors.ink }}>
            Amis & défis
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link to="/enseignant" className="text-xs font-medium" style={{ color: colors.slate }}>
            Espace enseignant
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4 pt-5 text-xs" style={{ borderTop: `1px solid ${colors.hairline}`, color: colors.slate }}>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/cgu">CGU</Link>
          <Link to="/confidentialite">Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}
