import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSkillTracking } from "../hooks/useSkillTracking";
import { getChapter } from "../chapters/registry";
import { getLevel } from "../levels";
import { colors, fonts, shadow } from "../theme";
import LoadError from "../components/LoadError";

// ---------------------------------------------------------------------------
// Onglet "Réviser" : liste, TOUS NIVEAUX ET CHAPITRES CONFONDUS, les
// compétences dues en répétition espacée pour l'utilisateur connecté (voir
// supabase/schema.sql table skill_mastery, et src/hooks/useSkillTracking.js
// pour l'algorithme des intervalles croissants). Un clic ouvre directement
// le chapitre concerné, concentré sur cette compétence précise (voir
// ChapterRunner prop `focusSkill`, branchée via ?competence= dans
// ChapterPage.jsx) plutôt qu'un tirage au hasard dans tout le chapitre.
// ---------------------------------------------------------------------------
export default function Reviser() {
  const { user } = useAuth();
  const { getDueSkills } = useSkillTracking(user?.id);
  const [dueSkills, setDueSkills] = useState(null); // null = chargement
  const [loadError, setLoadError] = useState(null);
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    if (!user) {
      setDueSkills([]);
      setLoadError(null);
      return;
    }
    let cancelled = false;
    setDueSkills(null);
    setLoadError(null);
    getDueSkills()
      .then((rows) => {
        if (!cancelled) setDueSkills(rows);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("[Reviser] load error:", error.message);
        setLoadError(error);
        setDueSkills([]);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, retryNonce]);

  const ink = colors.ink;
  const paper = colors.bg;
  const slate = colors.slate;
  const gold = colors.gold;

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto">
        <Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold mb-4" style={{ color: slate }}>
          <ArrowLeft size={14} /> Accueil
        </Link>

        <div className="text-center mb-7">
          <p className="text-xs tracking-widest uppercase mb-1 font-semibold" style={{ color: gold, letterSpacing: "0.12em" }}>
            Répétition espacée
          </p>
          <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Réviser
          </h1>
          <p className="text-sm mt-2" style={{ color: slate }}>
            Les compétences à repasser aujourd'hui, tous niveaux confondus — au bon moment pour les ancrer durablement.
          </p>
        </div>

        {!user && (
          <div className="text-center rounded-3xl p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <p className="text-sm" style={{ color: slate }}>
              Connecte-toi pour suivre tes compétences à réviser.
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

        {user && dueSkills === null && (
          <p className="text-center text-sm" style={{ color: slate }}>
            Chargement…
          </p>
        )}

        {user && dueSkills !== null && loadError && (
          <LoadError message="Les révisions du jour n'ont pas pu être chargées." onRetry={() => setRetryNonce((value) => value + 1)} />
        )}

        {user && dueSkills !== null && !loadError && dueSkills.length === 0 && (
          <div className="text-center rounded-3xl p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <CheckCircle2 size={26} color={colors.green} className="mx-auto mb-3" />
            <p style={{ fontFamily: fonts.display, color: ink, fontSize: "1.1rem", fontWeight: 800 }}>
              Rien à réviser pour l'instant
            </p>
            <p className="text-sm mt-2" style={{ color: slate }}>
              Continue à t'entraîner : les compétences à repasser apparaîtront ici au bon moment.
            </p>
          </div>
        )}

        {user && dueSkills !== null && !loadError && dueSkills.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {dueSkills.map((row) => {
              const chapter = getChapter(row.chapter_id);
              const level = chapter ? getLevel(chapter.meta.level) : null;
              const overdue = new Date(row.next_review_at).getTime() < Date.now() - 24 * 60 * 60 * 1000;
              return (
                <Link
                  key={row.skill_id}
                  to={chapter ? `/chapitre/${row.chapter_id}?competence=${encodeURIComponent(row.skill_id)}` : "#"}
                  className="rounded-3xl px-5 py-4 flex items-center justify-between gap-3 transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: colors.card, boxShadow: shadow.soft, opacity: chapter ? 1 : 0.5 }}
                >
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide mb-0.5 truncate" style={{ color: slate }}>
                      {level?.label ?? chapter?.meta.level ?? ""}
                      {chapter ? ` — ${chapter.meta.title}` : ""}
                    </p>
                    <p className="font-semibold text-sm truncate" style={{ fontFamily: fonts.display, color: ink }}>
                      {row.skill_id}
                    </p>
                    {overdue && (
                      <p className="text-xs mt-0.5 font-semibold" style={{ color: colors.red }}>
                        En retard
                      </p>
                    )}
                  </div>
                  <RotateCcw size={18} color={gold} className="flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
