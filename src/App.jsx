import { useCallback, useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LevelSelect from "./pages/LevelSelect";
import CycleSelect from "./pages/CycleSelect";
import CycleLevels from "./pages/CycleLevels";
import Niveau from "./pages/Niveau";
import ParcoursSelect from "./pages/ParcoursSelect";
import ParcoursDiagnostic from "./pages/ParcoursDiagnostic";
import ParcoursOverview from "./pages/ParcoursOverview";
import ParcoursStep from "./pages/ParcoursStep";
import ChapterPage from "./pages/ChapterPage";
import Account from "./pages/Account";
import Onboarding from "./pages/Onboarding";
import Amis from "./pages/Amis";
import Idees from "./pages/Idees";
import AdminPreview from "./pages/AdminPreview";
import MentionsLegales from "./pages/legal/MentionsLegales";
import CGU from "./pages/legal/CGU";
import Confidentialite from "./pages/legal/Confidentialite";
import { useAuth } from "./hooks/useAuth";
import { useSubscription } from "./hooks/useProgress";
import { useSingleSession } from "./hooks/useSingleSession";
import { isRealAdmin, isFullAccessSubscription, getEffectiveSubscription } from "./lib/access";
import { getAdminPreview, setAdminPreview } from "./lib/adminPreview";
import { colors, fonts } from "./theme";
import { supabase } from "./lib/supabaseClient";

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
        <Route path="/idees" element={<Idees />} />
        <Route path="/admin" element={<AdminPreview />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
      </Routes>
    </>
  );
}
