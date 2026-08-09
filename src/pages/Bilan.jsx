import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Target, TrendingUp, ListChecks } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useWeeklySummary } from "../hooks/useWeeklySummary";
import { getChapter } from "../chapters/registry";
import { getLevel } from "../levels";
import { colors, fonts, shadow } from "../theme";

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
  if (!previous) return null;
  const delta = current - previous;
  if (delta === 0) return `Stable par rapport aux 7 jours précédents${suffix}`;
  return `${delta > 0 ? "+" : ""}${delta}${suffix} par rapport aux 7 jours précédents`;
}

export default function Bilan() {
  const { user } = useAuth();
  const { loading, summary } = useWeeklySummary(user?.id);

  const ink = colors.ink;
  const paper = colors.bg;
  const slate = colors.slate;
  const gold = colors.gold;

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto">
        <Link to="/compte" className="inline-flex items-center gap-1 text-xs font-semibold mb-4" style={{ color: slate }}>
          <ArrowLeft size={14} /> Mon compte
        </Link>

        <div className="text-center mb-7">
          <p className="text-xs tracking-widest uppercase mb-1 font-semibold" style={{ color: gold, letterSpacing: "0.12em" }}>
            Suivi de la progression
          </p>
          <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Bilan de la semaine
          </h1>
          <p className="text-sm mt-2" style={{ color: slate }}>
            Les 7 derniers jours — utile pour suivre la progression avec ton enfant.
          </p>
        </div>

        {!user && (
          <div className="text-center rounded-3xl p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <p className="text-sm" style={{ color: slate }}>
              Connecte-toi (ou connecte-toi avec le compte de ton enfant) pour voir ce bilan.
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

        {user && loading && (
          <p className="text-center text-sm" style={{ color: slate }}>
            Chargement…
          </p>
        )}

        {user && !loading && summary && (
          <div className="flex flex-col gap-4">
            {/* Temps passé */}
            <div className="rounded-3xl p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
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
            <div className="rounded-3xl p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
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
                  {comparison(summary.successRate, summary.previousSuccessRate, " points") && (
                    <p className="text-xs mt-1 font-medium" style={{ color: summary.successRate >= summary.previousSuccessRate ? colors.green : colors.red }}>
                      {comparison(summary.successRate, summary.previousSuccessRate, " points")}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Notions travaillées */}
            <div className="rounded-3xl p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
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
                        <div key={s.skill_id} className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: ink }}>
                              {s.skill_id}
                            </p>
                            <p className="text-xs truncate" style={{ color: slate }}>
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
            <div className="rounded-3xl p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
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
                        key={s.skill_id}
                        to={chapter ? `/chapitre/${s.chapter_id}?competence=${encodeURIComponent(s.skill_id)}` : "#"}
                        className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3 transition-transform active:scale-[0.98]"
                        style={{ backgroundColor: `${colors.red}0d`, opacity: chapter ? 1 : 0.5 }}
                      >
                        <p className="text-sm font-medium truncate" style={{ color: ink }}>
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

            <p className="text-xs text-center mt-2" style={{ color: slate }}>
              Ce bilan se met à jour au fil de la pratique — repasse le voir la semaine prochaine.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
