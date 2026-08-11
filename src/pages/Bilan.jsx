import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Target, TrendingUp, ListChecks, Award, ArrowRight, BookOpenCheck, Sparkles, Printer, CalendarDays, HeartHandshake } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useWeeklySummary } from "../hooks/useWeeklySummary";
import { useLearningReviews } from "../hooks/useLearningReviews";
import { getChapter } from "../chapters/registry";
import { getLevel } from "../levels";
import { colors, fonts, shadow } from "../theme";
import LoadError from "../components/LoadError";
import MathText from "../components/MathText";
import FeedbackVisual from "../components/FeedbackVisual";

// ---------------------------------------------------------------------------
// Page "Bilan de la semaine" (/bilan) : pensée pour être consultée par un
// parent avec l'élève (même compte, pas de compte parent séparé — l'app
// reste anonyme, voir supabase/schema.sql). Regroupe le temps passé, les
// notions travaillées, le taux de réussite et les priorités pour la semaine
// suivante, sur une fenêtre glissante des 7 derniers jours (et non une
// semaine calendaire lundi-dimanche, plus simple et toujours à jour).
// Voir useWeeklySummary.js pour l'agrégation des données.
// ---------------------------------------------------------------------------

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function dayLabel(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  const jsDay = d.getDay(); // 0 = dimanche
  return DAY_LABELS[(jsDay + 6) % 7];
}

function formatDuration(totalSeconds) {
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 1) return "moins d'une minute";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

function comparison(current, previous, suffix = "") {
  if (previous === null || previous === undefined || previous === 0) return null;
  const delta = current - previous;
  if (delta === 0) return `Stable par rapport aux 7 jours précédents${suffix}`;
  return `${delta > 0 ? "+" : ""}${delta}${suffix} par rapport aux 7 jours précédents`;
}

function durationComparison(current, previous) {
  if (!previous) return null;
  const delta = current - previous;
  if (Math.abs(delta) < 30) return "Temps de travail stable par rapport aux 7 jours précédents";
  return `${delta > 0 ? "+" : "−"}${formatDuration(Math.abs(delta))} par rapport aux 7 jours précédents`;
}

function formatWeekRange(days = []) {
  if (!days.length) return "Les 7 derniers jours";
  const format = (value) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(new Date(`${value}T12:00:00`));
  return `Du ${format(days[0].date)} au ${format(days[days.length - 1].date)}`;
}

function parentSummary(summary) {
  if (summary.totalAttempts === 0 && summary.totalSeconds === 0) {
    return "Aucune activité enregistrée ces 7 derniers jours. Une courte séance permet de relancer la progression.";
  }
  if (summary.previousSuccessRate !== null && summary.successRate !== null) {
    const delta = summary.successRate - summary.previousSuccessRate;
    if (delta >= 5) return `La réussite progresse de ${delta} points. Le travail de la semaine porte ses fruits.`;
    if (delta <= -5) return `La réussite baisse de ${Math.abs(delta)} points. Les notions fragiles ci-dessous sont à revoir en priorité.`;
  }
  if (summary.consolidatedSkills.length > 0) {
    return `${summary.consolidatedSkills.length} notion${summary.consolidatedSkills.length > 1 ? "s ont" : " a"} atteint un palier de consolidation cette semaine.`;
  }
  return `${summary.totalAttempts} exercice${summary.totalAttempts > 1 ? "s" : ""} réalisé${summary.totalAttempts > 1 ? "s" : ""} sur ${summary.activeDays} jour${summary.activeDays > 1 ? "s" : ""}. La régularité aidera à consolider les acquis.`;
}

export default function Bilan() {
  const { user } = useAuth();
  const { loading, summary, error, reload } = useWeeklySummary(user?.id);
  const learningReviews = useLearningReviews(user?.id);

  const ink = colors.ink;
  const paper = colors.bg;
  const slate = colors.slate;
  const gold = colors.gold;

  return (
    <div className="weekly-report min-h-screen w-full max-w-full overflow-x-hidden p-3 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
      <div className="w-full min-w-0 max-w-5xl mx-auto">
        <Link to="/compte" className="print-hide inline-flex items-center gap-1 text-xs font-semibold mb-4" style={{ color: slate }}>
          <ArrowLeft size={14} /> Mon compte
        </Link>

        <div className="text-center mb-10 mt-5">
          <p className="text-xs tracking-widest uppercase mb-1 font-semibold" style={{ color: gold, letterSpacing: "0.12em" }}>
            Suivi de la progression
          </p>
          <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "clamp(2.1rem, 5vw, 3.3rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Une semaine de progrès
          </h1>
          <p className="text-sm mt-2" style={{ color: slate }}>
            Un bilan clair à regarder ensemble : travail effectué, acquis et prochaine étape.
          </p>
          {summary?.days?.length > 0 && <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold" style={{color:gold}}><CalendarDays size={14}/>{formatWeekRange(summary.days)}</p>}
          <div className="print-hide mt-4">
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold" style={{backgroundColor:colors.card,color:ink,boxShadow:shadow.soft}}><Printer size={14}/> Imprimer ou enregistrer en PDF</button>
          </div>
        </div>

        {!user && (
          <div className="text-center rounded-3xl p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <p className="text-sm" style={{ color: slate }}>
              Les explications vues sur cet appareil restent accessibles ci-dessous. Crée un espace gratuit pour conserver aussi la progression de ton enfant.
            </p>
            <Link
              to="/compte"
              className="inline-block mt-4 py-2.5 px-6 rounded-full text-sm font-semibold"
              style={{ backgroundColor: ink, color: paper }}
            >
              Se connecter
            </Link>
          </div>
        )}

        {learningReviews.length > 0 && (
          <section className="report-card report-reviews mt-4 rounded-3xl p-4 sm:p-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-xl p-2" style={{ backgroundColor: `${gold}18` }}><Sparkles size={18} color={gold} /></div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest font-bold" style={{ color: gold }}>Ce que j’ai appris</p>
                <h2 className="mt-1 text-lg font-black" style={{ color: ink, fontFamily: fonts.display }}>Mes explications de la semaine</h2>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: slate }}>Ouvre une carte pour revoir avec tes parents l’erreur, la méthode et l’animation associée.</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl p-4" style={{backgroundColor:`${colors.green}10`,border:`1px solid ${colors.green}25`}}>
              <p className="text-[10px] uppercase tracking-widest font-black" style={{color:colors.green}}>L’apprentissage à raconter cette semaine</p>
              <p className="mt-2 text-sm leading-relaxed" style={{color:ink}}>Une difficulté a été rencontrée en <strong>{learningReviews[0].chapter}</strong>. RéussiMaths a repris l’idée importante et la méthode étape par étape. L’objectif suivant est de réussir une question proche sans aide, puis de vérifier quelques jours plus tard que la méthode revient.</p>
              <p className="mt-2 text-xs" style={{color:slate}}><strong style={{color:ink}}>À demander à votre enfant :</strong> « Peux-tu m’expliquer avec tes mots ce que tu feras différemment la prochaine fois ? »</p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {learningReviews.slice(0, 8).map((review, index) => (
                <details key={review.id} className="group min-w-0 rounded-2xl p-3 sm:p-4" style={{ backgroundColor: colors.bg }} open={index === 0}>
                  <summary className="cursor-pointer list-none flex min-w-0 items-start gap-2">
                    <BookOpenCheck size={16} color={colors.green} className="mt-0.5 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm font-bold break-words" style={{ color: ink }}>{review.chapter}</span>
                      <MathText as="span" text={review.prompt} className="block mt-0.5 text-xs break-words" style={{ color: slate }} />
                    </span>
                  </summary>
                  <div className="mt-3 border-t pt-3 text-xs leading-relaxed" style={{ borderColor: colors.hairline, color: slate }}>
                    <p><strong style={{ color: ink }}>L’idée importante :</strong> <MathText text={review.meaning} /></p>
                    <p className="mt-2"><strong style={{ color: ink }}>Méthode à retenir :</strong> <MathText text={review.rule} /></p>
                    {review.steps?.length > 0 && <div className="mt-2 rounded-xl bg-white p-3">{review.steps.map((step, stepIndex) => <MathText key={`${review.id}-${stepIndex}`} as="p" text={`${stepIndex + 1}. ${typeof step === "string" ? step : step?.text ?? ""}`} className={stepIndex ? "mt-1" : ""} />)}</div>}
                    <FeedbackVisual family={review.family} exercise={{ prompt: review.prompt, chapter: review.chapter }} />
                    <p className="mt-2 font-bold" style={{ color: ink }}><MathText text={review.conclusion} /></p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {user && loading && (
          <p className="text-center text-sm" style={{ color: slate }}>
            Chargement…
          </p>
        )}

        {user && !loading && error && (
          <LoadError message="Le bilan n'a pas pu être chargé." onRetry={reload} />
        )}

        {user && !loading && !error && summary && (
          <div className="grid w-full min-w-0 grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div
              className="report-card report-essential min-w-0 overflow-hidden rounded-3xl p-4 sm:p-6 md:col-span-2"
              style={{ backgroundColor: colors.ink, color: colors.bg, boxShadow: shadow.raised }}
            >
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: gold }}>
                L'essentiel pour le parent
              </p>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: colors.bg }}>
                {parentSummary(summary)}
              </p>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  [`${summary.activeDays}/7`, "jours actifs"],
                  [summary.totalAttempts, "exercices"],
                  [summary.consolidatedSkills.length, "acquis consolidés"],
                ].map(([value, label]) => <div key={label} className="min-w-0 rounded-2xl p-2.5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}><p className="text-base font-black" style={{ color: gold }}>{value}</p><p className="text-[9px] leading-tight mt-0.5" style={{ color: colors.bg }}>{label}</p></div>)}
              </div>
              {summary.priorities.length > 0 && (
                <Link
                  to={`/chapitre/${summary.priorities[0].chapter_id}?competence=${encodeURIComponent(summary.priorities[0].skill_id)}`}
                  className="inline-flex max-w-full items-center gap-1.5 mt-3 text-xs font-semibold break-words"
                  style={{ color: gold }}
                >
                  Travailler la priorité n°1 <ArrowRight size={13} />
                </Link>
              )}
            </div>

            <div className="report-card report-plan min-w-0 overflow-hidden rounded-3xl p-4 sm:p-6 md:col-span-2" style={{backgroundColor:colors.card,boxShadow:shadow.soft,border:`1px solid ${colors.green}25`}}>
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-xl p-2" style={{backgroundColor:`${colors.green}15`}}><HeartHandshake size={19} color={colors.green}/></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-widest font-bold" style={{color:colors.green}}>Le petit plan familial</p>
                  <h2 className="mt-1 text-lg font-black" style={{color:ink,fontFamily:fonts.display}}>Une priorité, trois séances courtes</h2>
                  <p className="mt-1 text-xs leading-relaxed" style={{color:slate}}>L’objectif n’est pas de tout reprendre : trois séances de 10 à 15 minutes, espacées dans la semaine, suffisent pour vérifier que la méthode revient sans aide.</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {["1. Relire une correction", "2. Refaire une question proche", "3. Vérifier quelques jours après"].map((label,index)=><div key={label} className="rounded-2xl p-3 text-xs font-bold" style={{backgroundColor:index===2?`${colors.green}12`:paper,color:ink}}>{label}</div>)}
              </div>
              <div className="mt-4 rounded-2xl p-3" style={{backgroundColor:paper}}>
                <p className="text-xs font-black" style={{color:ink}}>Deux questions simples à poser à votre enfant</p>
                <p className="mt-1 text-xs leading-relaxed" style={{color:slate}}>« Peux-tu m’expliquer l’erreur que tu faisais ? » puis « Quelle méthode utiliseras-tu la prochaine fois ? » Expliquer à voix haute aide à stabiliser l’apprentissage.</p>
              </div>
            </div>

            {/* Temps passé */}
            <div className="report-card min-w-0 overflow-hidden rounded-3xl p-4 sm:p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} color={gold} />
                <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: slate }}>
                  Temps passé
                </p>
              </div>
              <p style={{ fontFamily: fonts.display, color: ink, fontSize: "1.6rem", fontWeight: 800 }}>
                {formatDuration(summary.totalSeconds)}
              </p>
              <p className="text-xs mt-1" style={{ color: slate }}>
                {summary.activeDays} jour{summary.activeDays > 1 ? "s" : ""} actif{summary.activeDays > 1 ? "s" : ""} sur 7
              </p>
              {durationComparison(summary.totalSeconds, summary.previousSeconds) && (
                <p className="text-xs mt-1 font-medium" style={{ color: summary.totalSeconds >= summary.previousSeconds ? colors.green : colors.red }}>
                  {durationComparison(summary.totalSeconds, summary.previousSeconds)}
                </p>
              )}
              <div className="flex items-end gap-1.5 mt-4" style={{ height: 56 }}>
                {summary.days.map((d) => {
                  const maxSeconds = Math.max(...summary.days.map((x) => x.seconds), 60);
                  const h = Math.max(4, Math.round((d.seconds / maxSeconds) * 52));
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-md"
                        style={{ height: h, backgroundColor: d.seconds > 0 ? gold : `${colors.hairline}` }}
                      />
                      <p className="text-[0.6rem]" style={{ color: slate }}>
                        {dayLabel(d.date)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Taux de réussite */}
            <div className="report-card min-w-0 overflow-hidden rounded-3xl p-4 sm:p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
              <div className="flex items-center gap-2 mb-3">
                <Target size={16} color={colors.green} />
                <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: slate }}>
                  Taux de réussite
                </p>
              </div>
              {summary.successRate === null ? (
                <p className="text-sm" style={{ color: slate }}>
                  Pas encore assez d'exercices cette semaine pour calculer un taux de réussite.
                </p>
              ) : (
                <>
                  <p style={{ fontFamily: fonts.display, color: ink, fontSize: "1.6rem", fontWeight: 800 }}>
                    {summary.successRate} %
                  </p>
                  <p className="text-xs mt-1" style={{ color: slate }}>
                    {summary.totalCorrect} bonnes réponses sur {summary.totalAttempts} exercices faits.
                  </p>
                  {comparison(summary.totalAttempts, summary.previousAttempts, " exercices") && (
                    <p className="text-xs mt-1" style={{ color: slate }}>
                      {comparison(summary.totalAttempts, summary.previousAttempts, " exercices")}
                    </p>
                  )}
                  {comparison(summary.successRate, summary.previousSuccessRate, " points") && (
                    <p className="text-xs mt-1 font-medium" style={{ color: summary.successRate >= summary.previousSuccessRate ? colors.green : colors.red }}>
                      {comparison(summary.successRate, summary.previousSuccessRate, " points")}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Notions consolidées */}
            <div className="report-card min-w-0 overflow-hidden rounded-3xl p-4 sm:p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} color={gold} />
                <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: slate }}>
                  Notions en cours de consolidation
                </p>
              </div>
              {summary.consolidatedSkills.length === 0 ? (
                <p className="text-sm" style={{ color: slate }}>
                  Aucune notion n'a encore atteint ce palier cette semaine. Plusieurs réussites sont nécessaires.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {summary.consolidatedSkills.slice(0, 5).map((s) => (
                    <div key={`${s.chapter_id}-${s.skill_id}`} className="flex min-w-0 items-start gap-2">
                      <Award size={13} color={colors.green} className="shrink-0" />
                      <p className="min-w-0 text-sm break-words" style={{ color: ink, overflowWrap: "anywhere" }}>{s.skill_id}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notions travaillées */}
            <div className="report-card min-w-0 overflow-hidden rounded-3xl p-4 sm:p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
              <div className="flex items-center gap-2 mb-3">
                <ListChecks size={16} color={ink} />
                <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: slate }}>
                  Notions travaillées cette semaine
                </p>
              </div>
              {summary.skillsWorked.length === 0 ? (
                <p className="text-sm" style={{ color: slate }}>
                  Aucune notion travaillée cette semaine.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {summary.skillsWorked
                    .sort((a, b) => new Date(b.last_practiced_at) - new Date(a.last_practiced_at))
                    .map((s) => {
                      const chapter = getChapter(s.chapter_id);
                      const level = chapter ? getLevel(chapter.meta.level) : null;
                      return (
                        <div key={`${s.chapter_id}-${s.skill_id}`} className="flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium break-words" style={{ color: ink, overflowWrap: "anywhere" }}>
                              {s.skill_id}
                            </p>
                            <p className="text-xs break-words" style={{ color: slate, overflowWrap: "anywhere" }}>
                              {level?.label ?? ""}
                              {chapter ? ` — ${chapter.meta.title}` : ""}
                            </p>
                          </div>
                          <p className="text-xs font-semibold shrink-0" style={{ color: colors.green }}>
                            {Math.round((s.correct / s.attempts) * 100)} % cumulés
                          </p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Priorités pour la semaine suivante */}
            <div className="report-card min-w-0 overflow-hidden rounded-3xl p-4 sm:p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} color={colors.red} />
                <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: slate }}>
                  Notions fragiles observées
                </p>
              </div>
              {summary.priorities.length === 0 ? (
                <p className="text-sm" style={{ color: slate }}>
                  Rien à signaler : les notions travaillées cette semaine sont bien maîtrisées.
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <p className="text-xs" style={{ color: slate }}>
                    Classement fondé sur toutes les réponses enregistrées pour les notions pratiquées cette semaine.
                  </p>
                  {summary.priorities.map((s) => {
                    const chapter = getChapter(s.chapter_id);
                    return (
                      <Link
                        key={`${s.chapter_id}-${s.skill_id}`}
                        to={chapter ? `/chapitre/${s.chapter_id}?competence=${encodeURIComponent(s.skill_id)}` : "#"}
                        className="min-w-0 rounded-2xl px-3 sm:px-4 py-3 flex items-start justify-between gap-2 sm:gap-3 transition-transform active:scale-[0.98]"
                        style={{ backgroundColor: `${colors.red}0d`, opacity: chapter ? 1 : 0.5 }}
                      >
                        <p className="min-w-0 text-sm font-medium break-words" style={{ color: ink, overflowWrap: "anywhere" }}>
                          {s.skill_id}
                        </p>
                        <p className="text-xs font-semibold shrink-0" style={{ color: colors.red }}>
                          {Math.round(s.rate * 100)} %
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="text-xs text-center mt-2 md:col-span-2" style={{ color: slate }}>
              Chaque séance enrichit ce bilan. Relisez ensemble une correction, puis choisissez une seule priorité pour la prochaine séance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
