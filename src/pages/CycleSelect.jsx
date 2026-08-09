import { Link } from "react-router-dom";
import { GraduationCap, School, Sparkles, Brain, Gamepad2, Flame, Presentation } from "lucide-react";
import { CYCLES } from "../levels";
import Mascot from "../components/Mascot";
import { useAuth } from "../hooks/useAuth";
import { useDailyStreak } from "../hooks/useDailyStreak";
import { useDueSkillsCount } from "../hooks/useDueSkillsCount";
import { getLevel } from "../levels";
import { getPreferredLevel } from "../lib/preferences";
import { colors, fonts, shadow, cycleColors } from "../theme";

// Nouvelle page d'accueil (/) : premier choix, avant même les niveaux —
// Collège ou Lycée. Chaque carte mène à /college ou /lycee (voir
// CycleLevels.jsx), qui reprend l'ancien affichage de LevelSelect.jsx mais
// filtré sur le cycle choisi. La sélection à plat de tous les niveaux reste
// possible via LevelSelect.jsx si besoin, mais n'est plus la page d'accueil.
//
// Chaque cycle a sa propre couleur d'accent (voir cycleColors dans theme.js)
// pour bien différencier collège et lycée dès le premier écran, tout en
// gardant la base marine/or de la marque. L'accès enseignant, auparavant en
// tout petit tout en bas de page (quasi invisible), est remonté ici en badge
// bien visible sous l'accroche.
const ICONS = { college: School, lycee: GraduationCap };

export default function CycleSelect() {
  const { user } = useAuth();
  const { streak } = useDailyStreak(user?.id);
  const dueCount = useDueSkillsCount(user?.id);
  const preferredLevel = getLevel(getPreferredLevel());
  const hasStreak = streak?.current_streak > 0;
  const nextAction = dueCount > 0
    ? { to: "/reviser", title: "Mes révisions du jour", detail: `${dueCount} compétence${dueCount > 1 ? "s" : ""} à consolider maintenant` }
    : preferredLevel
    ? { to: `/parcours/niveau/${preferredLevel.id}/diagnostic`, title: `Continuer en ${preferredLevel.label}`, detail: "Un diagnostic rapide pour choisir le bon entraînement" }
    : { to: "/parcours/decouverte/etape/0", title: "Essayer maintenant", detail: "5 questions guidées pour découvrir Reussimaths" };

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-end">
          <Link
            to="/enseignant"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform active:scale-[0.97]"
            style={{ border: `1px solid ${colors.ink}22`, color: colors.ink }}
          >
            <Presentation size={13} />
            Espace enseignant
          </Link>
        </div>

        <div className="text-center mb-10 mt-2">
          <Mascot size={96} className="mx-auto mb-3" style={{ boxShadow: shadow.raised }} />
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Reussimaths
          </h1>
          <p className="text-sm mt-1.5" style={{ color: colors.slate }}>
            Entraîne-toi jusqu'à la maîtrise
          </p>

          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full" style={{ backgroundColor: `${colors.gold}18` }}>
              <p className="text-xs font-semibold" style={{ color: colors.gold }}>
                Conforme aux nouveaux programmes 2026
              </p>
            </div>
            {hasStreak && (
              <div className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full" style={{ backgroundColor: `${colors.red}18` }}>
                <Flame size={13} color={colors.red} />
                <p className="text-xs font-semibold" style={{ color: colors.red }}>
                  {streak.current_streak} jour{streak.current_streak > 1 ? "s" : ""} de suite
                </p>
              </div>
            )}
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

        <Link to={nextAction.to} className="block mb-6">
          <div
            className="rounded-3xl px-6 py-5 transition-transform active:scale-[0.98]"
            style={{ backgroundColor: colors.ink, color: colors.bg, boxShadow: shadow.raised }}
          >
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: colors.gold }}>À faire maintenant</p>
            <p style={{ fontFamily: fonts.display, fontSize: "1.2rem", fontWeight: 800 }}>{nextAction.title}</p>
            <p className="text-xs mt-1" style={{ color: "#d7dce6" }}>{nextAction.detail}</p>
          </div>
        </Link>

        <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: colors.slate }}>Ou choisis ta classe</p>
        <div className="flex flex-col gap-4">
          {CYCLES.map((cycle) => {
            const Icon = ICONS[cycle.id];
            const c = cycleColors[cycle.id];
            return (
              <Link key={cycle.id} to={`/${cycle.id}`}>
                <div
                  className="rounded-3xl px-6 py-7 flex items-center gap-4 transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: colors.card, boxShadow: shadow.raised, borderTop: `3px solid ${c.accent}` }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl"
                    style={{ width: 52, height: 52, backgroundColor: `${c.accent}1f`, flexShrink: 0 }}
                  >
                    <Icon size={26} color={c.accent} />
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

        <Link to="/jeux" className="flex items-center justify-center gap-2 mt-5 text-sm font-medium" style={{ color: colors.slate }}>
          <Gamepad2 size={16} /> Jeux mathématiques
        </Link>

        <div className="text-center mt-10 flex items-center justify-center gap-5">
          <Link to="/compte" className="text-sm font-medium" style={{ color: colors.ink }}>
            Mon compte
          </Link>
          <Link to="/amis" className="text-sm font-medium" style={{ color: colors.ink }}>
            Amis & défis
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6 pt-5 text-xs" style={{ borderTop: `1px solid ${colors.hairline}`, color: colors.slate }}>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/cgu">CGU</Link>
          <Link to="/confidentialite">Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}
