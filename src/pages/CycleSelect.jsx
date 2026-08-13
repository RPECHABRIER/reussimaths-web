import { Link } from "react-router-dom";
import {
  GraduationCap,
  School,
  Sparkles,
  Brain,
  Gamepad2,
  Flame,
  Presentation,
  ArrowRight,
  CheckCircle2,
  Target,
  RotateCcw,
  BarChart3,
  KeyRound,
  UserRound,
  Timer,
} from "lucide-react";
import { CYCLES } from "../levels";
import Mascot from "../components/Mascot";
import { useAuth } from "../hooks/useAuth";
import { useDailyStreak } from "../hooks/useDailyStreak";
import { useDueSkillsCount } from "../hooks/useDueSkillsCount";
import { getLevel } from "../levels";
import { getPreferredLevel } from "../lib/preferences";
import { colors, fonts, shadow, cycleColors } from "../theme";
import { useSubscription } from "../hooks/useProgress";
import { useDailyMentalSummary } from "../hooks/useDailyMentalSummary";
import { getEffectiveSubscription, isFullAccessSubscription } from "../lib/access";

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
  const preferredLevel = getLevel(getPreferredLevel());
  const { subscription: rawSubscription } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const fullAccess = isFullAccessSubscription(subscription);
  // Le niveau acheté prime sur une ancienne préférence locale issue d'un
  // essai, afin que tous les raccourcis d'accueil restent dans l'abonnement.
  const subscriptionLevel = fullAccess && !subscription?.admin_granted
    ? getLevel(subscription?.subscription_level)
    : null;
  const journeyLevel = subscriptionLevel ?? preferredLevel;
  const mentalLevel = subscriptionLevel ?? preferredLevel;
  const dueCount = useDueSkillsCount(user?.id, subscriptionLevel?.id ?? null);
  const { summary: mentalSummary } = useDailyMentalSummary(user?.id, subscriptionLevel?.id ?? null);
  const todayMentalScore = mentalSummary?.days?.at(-1)?.score ?? null;
  const hasStreak = streak?.current_streak > 0;
  const nextAction = !user
    ? { to: "/niveaux?objectif=essai", title: "Commencer gratuitement", detail: "Choisis ton niveau, puis fais un diagnostic court et une série adaptée" }
    : dueCount > 0
    ? { to: "/reviser", title: "Mes révisions du jour", detail: `${dueCount} compétence${dueCount > 1 ? "s" : ""} à consolider maintenant` }
    : journeyLevel
    ? { to: `/parcours/niveau/${journeyLevel.id}/programme`, title: `Continuer en ${journeyLevel.label}`, detail: "Indique ce que tu fais en classe, puis vérifie tes prérequis" }
    : { to: "/niveaux?objectif=essai", title: "Choisir mon niveau", detail: "Un diagnostic court puis une série adaptée" };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-10">
        <header className="flex items-center justify-between py-4 sm:py-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Mascot size={42} style={{ boxShadow: shadow.soft }} />
            <span style={{ fontFamily: fonts.display, color: colors.ink, fontWeight: 850, fontSize: "1.05rem" }}>
              RéussiMaths
            </span>
          </Link>
          <Link to="/compte" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold" style={{ backgroundColor: colors.card, boxShadow: shadow.soft, color: colors.ink }}>
            <UserRound size={14} /> {user ? "Mon compte" : "Se connecter"}
          </Link>
        </header>

        <main>
          <section className="grid lg:grid-cols-[1.08fr_0.92fr] gap-8 lg:gap-14 items-center pt-6 sm:pt-10 lg:pt-16">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full" style={{ backgroundColor: `${colors.gold}18` }}>
                <Sparkles size={13} color={colors.gold} />
                <p className="text-xs font-bold" style={{ color: colors.gold }}>Maths collège & lycée · Programmes 2026</p>
              </div>

              <h1
                className="mt-5 mx-auto lg:mx-0 max-w-2xl"
                style={{
                  fontFamily: fonts.display,
                  color: colors.ink,
                  fontSize: "clamp(2.35rem, 6vw, 4.4rem)",
                  lineHeight: 1.02,
                  fontWeight: 900,
                  letterSpacing: "-0.045em",
                }}
              >
                Travaille ce qu’il faut. <span style={{ color: colors.gold }}>Vois tes progrès.</span>
              </h1>
              <p className="text-base sm:text-lg mt-5 max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ color: colors.slate }}>
                RéussiMaths transforme 15 minutes d’entraînement en prochaine action claire : diagnostic, exercices ciblés,
                correction détaillée et révisions au bon moment.
              </p>

              <div className="mt-7 max-w-lg mx-auto lg:mx-0">
                <Link
                  to={nextAction.to}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full text-base font-black transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: colors.ink, color: colors.bg, boxShadow: shadow.raised }}
                >
                  {nextAction.title} <ArrowRight size={17} />
                </Link>
                <p className="text-xs mt-2.5 text-center" style={{ color: colors.slate }}>{nextAction.detail}</p>
                <Link
                  to="/enseignant"
                  className="inline-flex items-center justify-center gap-1.5 mt-4 text-sm font-bold"
                  style={{ color: colors.ink }}
                >
                  <Presentation size={16} /> Enseignant ? Ouvrir le rituel gratuit
                </Link>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 mt-4 text-xs" style={{ color: colors.slate }}>
                {["Première série gratuite", "Sans carte bancaire", "Corrections détaillées"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} color={colors.green} />{item}</span>
                ))}
              </div>
              {user && fullAccess && mentalLevel && (
                <Link
                  to={`/calcul-mental/${mentalLevel.id}`}
                  className="mt-5 mx-auto lg:mx-0 flex max-w-lg items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-transform active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, ${colors.gold}22, ${colors.green}18)`, border: `2px solid ${colors.gold}55`, boxShadow: shadow.soft }}
                >
                  <span className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{background:colors.card}}><Timer size={23} color={colors.gold}/></span><span><span className="block text-base font-black" style={{color:colors.ink}}>Mon calcul mental du jour</span><span className="block text-xs mt-0.5" style={{color:colors.slate}}>{todayMentalScore === null ? "10 nouvelles questions · sans calculatrice" : `Terminé aujourd’hui : ${todayMentalScore}/10 · Rejouer`}</span></span></span><ArrowRight size={19} color={colors.ink}/>
                </Link>
              )}
            </div>

            <div className="relative max-w-lg w-full mx-auto">
              <div className="absolute -inset-5 rounded-[2.5rem] blur-2xl" style={{ background: `linear-gradient(135deg, ${colors.gold}25, ${cycleColors.college.accent}18)` }} />
              <div className="relative rounded-[2rem] p-5 sm:p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.raised, border: `1px solid ${colors.hairline}` }}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Ta séance du jour</p>
                    <p className="text-xl font-black mt-1" style={{ color: colors.ink }}>15 minutes pour avancer</p>
                  </div>
                  <div className="flex items-center justify-center rounded-2xl" style={{ width: 48, height: 48, backgroundColor: `${colors.gold}18` }}>
                    <Target size={23} color={colors.gold} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6">
                  {[
                    { icon: Brain, value: "3 min", label: "Diagnostic" },
                    { icon: Target, value: "8 min", label: "Entraînement" },
                    { icon: RotateCcw, value: "4 min", label: "Révisions" },
                  ].map(({ icon: Icon, value, label }) => (
                    <div key={label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: colors.bg }}>
                      <Icon size={16} color={colors.ink} className="mx-auto" />
                      <p className="text-sm font-black mt-1.5" style={{ color: colors.ink }}>{value}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: colors.slate }}>{label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl p-4" style={{ backgroundColor: `${cycleColors.college.accent}0d` }}>
                  <div className="flex items-center justify-between text-xs font-semibold" style={{ color: colors.ink }}>
                    <span>Fractions · maîtrise</span><span style={{ color: cycleColors.college.accent }}>68 %</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden mt-2" style={{ backgroundColor: `${colors.ink}10` }}>
                    <div className="h-full rounded-full" style={{ width: "68%", backgroundColor: cycleColors.college.accent }} />
                  </div>
                  <p className="text-xs mt-2" style={{ color: colors.slate }}>Prochaine étape : comparer deux fractions</p>
                </div>
                <p className="text-[10px] text-center mt-3" style={{ color: colors.slate }}>Aperçu illustratif d’un parcours élève</p>
              </div>
            </div>
          </section>

          {hasStreak && (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold" style={{ color: colors.red }}>
              <Flame size={16} /> {streak.current_streak} jour{streak.current_streak > 1 ? "s" : ""} de suite
            </div>
          )}

          <section className="mt-16 sm:mt-24">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Explorer les programmes</p>
              <h2 className="text-2xl sm:text-3xl font-black mt-2" style={{ color: colors.ink, letterSpacing: "-0.025em" }}>
                Ou accéder directement au collège ou au lycée
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-8 max-w-4xl mx-auto">
              {CYCLES.map((cycle) => {
                const Icon = ICONS[cycle.id];
                const c = cycleColors[cycle.id];
                return (
                  <Link key={cycle.id} to={`/${cycle.id}`} className="group">
                    <div className="h-full rounded-3xl px-6 py-7 flex items-center gap-4 transition-transform group-hover:-translate-y-1 active:scale-[0.98]"
                      style={{ backgroundColor: colors.card, boxShadow: shadow.soft, borderTop: `3px solid ${c.accent}` }}>
                      <div className="flex items-center justify-center rounded-2xl" style={{ width: 54, height: 54, backgroundColor: `${c.accent}1f`, flexShrink: 0 }}>
                        <Icon size={27} color={c.accent} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xl font-black" style={{ color: colors.ink }}>{cycle.label}</p>
                        <p className="text-sm mt-0.5" style={{ color: colors.slate }}>{cycle.description}</p>
                      </div>
                      <ArrowRight size={18} color={c.accent} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-4 mt-12 max-w-5xl mx-auto">
            {[
              { icon: Target, title: "Toujours savoir quoi faire", text: "Un diagnostic court puis une recommandation adaptée au niveau réel." },
              { icon: RotateCcw, title: "Revoir au bon moment", text: "Les notions fragiles reviennent automatiquement avant d’être oubliées." },
              { icon: BarChart3, title: "Rendre les progrès visibles", text: "Temps, réussite, notions consolidées et priorité suivante dans un bilan clair." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
                <div className="flex items-center justify-center rounded-2xl" style={{ width: 42, height: 42, backgroundColor: `${colors.gold}18` }}>
                  <Icon size={20} color={colors.gold} />
                </div>
                <h3 className="font-black mt-4" style={{ color: colors.ink }}>{title}</h3>
                <p className="text-sm mt-1.5 leading-relaxed" style={{ color: colors.slate }}>{text}</p>
              </div>
            ))}
          </section>

          <section className="mt-12 max-w-5xl mx-auto rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            style={{ backgroundColor: colors.ink, boxShadow: shadow.raised }}>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center rounded-2xl shrink-0" style={{ width: 48, height: 48, backgroundColor: `${colors.gold}20` }}>
                <KeyRound size={22} color={colors.gold} />
              </div>
              <div>
                <p className="text-xl font-black" style={{ color: colors.bg }}>Vous enseignez les mathématiques ?</p>
                <p className="text-sm mt-1 max-w-xl" style={{ color: "#d7dce6" }}>
                  Projetez gratuitement un rituel en classe, sans compte élève ni préparation supplémentaire.
                </p>
              </div>
            </div>
            <Link to="/enseignant" className="inline-flex items-center gap-2 py-3 px-5 rounded-full font-bold text-sm shrink-0"
              style={{ backgroundColor: colors.gold, color: colors.ink }}>
              Découvrir l’espace enseignant <ArrowRight size={16} />
            </Link>
          </section>

          <section className="mt-6 max-w-5xl mx-auto rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            style={{ backgroundColor: colors.card, border: `1px solid ${colors.hairline}` }}>
            <div>
              <p className="text-sm font-bold" style={{ color: colors.gold }}>Accès complet</p>
              <p className="text-2xl font-black mt-1" style={{ color: colors.ink }}>Tout RéussiMaths pour 4,99 €/mois</p>
              <p className="text-sm mt-1" style={{ color: colors.slate }}>Un niveau au choix, entraînement illimité et bilan de progression. Sans engagement.</p>
            </div>
            <Link to="/compte" className="inline-flex items-center gap-2 py-3 px-5 rounded-full font-bold text-sm shrink-0"
              style={{ backgroundColor: colors.ink, color: colors.bg }}>
              Voir les offres <ArrowRight size={16} />
            </Link>
          </section>

          <div className="flex items-center justify-center gap-5 mt-8 text-sm">
            <Link to="/niveaux?objectif=essai" style={{ color: colors.ink }}>Faire l’essai gratuit</Link>
            <Link to="/jeux" className="inline-flex items-center gap-1.5" style={{ color: colors.slate }}><Gamepad2 size={15} /> Jeux</Link>
          </div>

          <footer className="flex flex-wrap justify-center gap-4 mt-10 pt-6 text-xs" style={{ borderTop: `1px solid ${colors.hairline}`, color: colors.slate }}>
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/cgu">CGU</Link>
            <Link to="/confidentialite">Confidentialité</Link>
          </footer>
        </main>
      </div>
    </div>
  );
}
