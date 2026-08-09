import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import SoundManager from "./components/SoundManager";
import { useAuth } from "./hooks/useAuth";
import { useSubscription } from "./hooks/useProgress";
import { useSingleSession } from "./hooks/useSingleSession";
import { isRealAdmin, isFullAccessSubscription, getEffectiveSubscription } from "./lib/access";
import { getAdminPreview, setAdminPreview } from "./lib/adminPreview";
import { colors, fonts } from "./theme";
import { supabase } from "./lib/supabaseClient";

const LevelSelect = lazy(() => import("./pages/LevelSelect"));
const CycleSelect = lazy(() => import("./pages/CycleSelect"));
const CycleLevels = lazy(() => import("./pages/CycleLevels"));
const Niveau = lazy(() => import("./pages/Niveau"));
const ParcoursSelect = lazy(() => import("./pages/ParcoursSelect"));
const ParcoursDiagnostic = lazy(() => import("./pages/ParcoursDiagnostic"));
const ParcoursOverview = lazy(() => import("./pages/ParcoursOverview"));
const ParcoursStep = lazy(() => import("./pages/ParcoursStep"));
const ChapterPage = lazy(() => import("./pages/ChapterPage"));
const Account = lazy(() => import("./pages/Account"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Amis = lazy(() => import("./pages/Amis"));
const Reviser = lazy(() => import("./pages/Reviser"));
const Bilan = lazy(() => import("./pages/Bilan"));
const Enseignant = lazy(() => import("./pages/Enseignant"));
const Jeux = lazy(() => import("./pages/Jeux"));
const CourseTables = lazy(() => import("./pages/CourseTables"));
const EstimationExpress = lazy(() => import("./pages/EstimationExpress"));
const MemoryMaths = lazy(() => import("./pages/MemoryMaths"));
const MemoryCpCe1 = lazy(() => import("./pages/MemoryCpCe1"));
const CourseAdditionsCpCe1 = lazy(() => import("./pages/CourseAdditionsCpCe1"));
const Idees = lazy(() => import("./pages/Idees"));
const AdminPreview = lazy(() => import("./pages/AdminPreview"));
const MentionsLegales = lazy(() => import("./pages/legal/MentionsLegales"));
const CGU = lazy(() => import("./pages/legal/CGU"));
const Confidentialite = lazy(() => import("./pages/legal/Confidentialite"));

function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: colors.bg, color: colors.slate }}>
      <div className="relative" style={{ width: 44, height: 44 }}>
        <div className="absolute inset-0 rounded-full" style={{ border: `3px solid ${colors.gold}2b` }} />
        <div className="absolute inset-0 rounded-full animate-spin" style={{ border: "3px solid transparent", borderTopColor: colors.gold }} />
      </div>
      <p className="text-xs font-semibold tracking-wide">Reussimaths prépare la suite…</p>
    </div>
  );
}

export default function App() {
  const { user, loading, signOut } = useAuth();
  const { subscription: rawSubscription } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const location = useLocation();
  const navigate = useNavigate();
  const pathRef = useRef(location.pathname);
  const [evictedMessage, setEvictedMessage] = useState(false);
  const preview = isRealAdmin(user) ? getAdminPreview() : null;
  const previewing = !!preview?.mode && preview.mode !== "admin";

  // Anti-partage : un abonnement complet ne peut être utilisé que sur un seul
  // appareil à la fois (voir src/hooks/useSingleSession.js) — l'admin
  // (Romain) en est TOUJOURS exempté, y compris pendant une prévisualisation
  // (sinon activer "prévisualiser abonnement complet" déclencherait l'anti-
  // partage sur son propre compte réel).
  const singleSessionEnabled = isFullAccessSubscription(subscription) && !isRealAdmin(user);
  const handleEvicted = useCallback(() => {
    setEvictedMessage(true);
    signOut();
  }, [signOut]);
  useSingleSession(user?.id, singleSessionEnabled, handleEvicted);

  useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);

  // Capture un éventuel lien de parrainage (?ref=code), quelle que soit la
  // page d'arrivée — utilisé à la création du profil (voir Onboarding.jsx).
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) localStorage.setItem("reussimaths_ref_code", ref);
  }, []);

  // Première connexion : pas encore de pseudo choisi -> redirection globale
  // vers /pseudo, quelle que soit la page sur laquelle l'utilisateur atterrit.
  // Fait sa propre requête (plutôt que de dépendre d'un hook séparé) pour
  // éviter toute course entre deux vérifications qui se marchent dessus.
  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    supabase
      .from("profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error("[App] vérification du profil :", error.message);
        if (!data && pathRef.current !== "/pseudo") navigate("/pseudo");
      });
    return () => {
      cancelled = true;
    };
  }, [loading, user, navigate]);

  if (evictedMessage) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center gap-4 p-6 text-center"
        style={{ background: colors.bg, fontFamily: fonts.body }}
      >
        <p style={{ fontFamily: fonts.display, fontSize: "1.2rem", fontWeight: 800, color: colors.ink }}>
          Session terminée
        </p>
        <p className="text-sm" style={{ color: colors.slate }}>
          Une connexion a été détectée sur un autre appareil avec ce compte. L'abonnement complet ne permet qu'un seul
          appareil connecté à la fois.
        </p>
        <button
          onClick={() => {
            setEvictedMessage(false);
            navigate("/compte");
          }}
          className="py-2.5 px-6 rounded-full font-semibold text-sm"
          style={{ backgroundColor: colors.ink, color: colors.bg }}
        >
          Se reconnecter
        </button>
      </div>
    );
  }

  return (
    <>
      <SoundManager />
      {previewing && (
        <div
          className="w-full flex items-center justify-center gap-3 py-2 px-4 text-xs font-semibold text-center"
          style={{ backgroundColor: colors.gold, color: colors.ink }}
        >
          <span>
            ⚠ Prévisualisation admin en cours —{" "}
            {preview.mode === "gratuit"
              ? "vue Gratuit"
              : preview.mode === "special_examen"
              ? "vue Pack Examen"
              : "vue Abonnement complet"}
          </span>
          <button
            onClick={() => {
              setAdminPreview(null);
              window.location.reload();
            }}
            className="underline"
          >
            Quitter
          </button>
        </div>
      )}
      <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<CycleSelect />} />
        <Route path="/niveaux" element={<LevelSelect />} />
        <Route path="/college" element={<CycleLevels />} />
        <Route path="/lycee" element={<CycleLevels />} />
        <Route path="/niveau/:levelId" element={<Niveau />} />
        <Route path="/parcours/niveau/:levelId/diagnostic" element={<ParcoursDiagnostic />} />
        <Route path="/parcours/niveau/:levelId" element={<ParcoursSelect />} />
        <Route path="/parcours/:parcoursId/etape/:stepIndex" element={<ParcoursStep />} />
        <Route path="/parcours/:parcoursId" element={<ParcoursOverview />} />
        <Route path="/chapitre/:id" element={<ChapterPage />} />
        <Route path="/compte" element={<Account />} />
        <Route path="/pseudo" element={<Onboarding />} />
        <Route path="/amis" element={<Amis />} />
        <Route path="/reviser" element={<Reviser />} />
        <Route path="/bilan" element={<Bilan />} />
        <Route path="/enseignant" element={<Enseignant />} />
        <Route path="/jeux" element={<Jeux />} />
        <Route path="/jeux/course-tables" element={<CourseTables />} />
        <Route path="/jeux/estimation-express" element={<EstimationExpress />} />
        <Route path="/jeux/memory-maths" element={<MemoryMaths />} />
        <Route path="/jeux/memory-cp-ce1" element={<MemoryCpCe1 />} />
        <Route path="/jeux/course-additions-cp-ce1" element={<CourseAdditionsCpCe1 />} />
        <Route path="/idees" element={<Idees />} />
        <Route path="/admin" element={<AdminPreview />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
      </Routes>
      </Suspense>
    </>
  );
}
