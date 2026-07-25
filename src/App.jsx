import { useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LevelSelect from "./pages/LevelSelect";
import Niveau from "./pages/Niveau";
import ChapterPage from "./pages/ChapterPage";
import Account from "./pages/Account";
import Onboarding from "./pages/Onboarding";
import Amis from "./pages/Amis";
import MentionsLegales from "./pages/legal/MentionsLegales";
import CGU from "./pages/legal/CGU";
import Confidentialite from "./pages/legal/Confidentialite";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pathRef = useRef(location.pathname);

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

  return (
    <Routes>
      <Route path="/" element={<LevelSelect />} />
      <Route path="/niveau/:levelId" element={<Niveau />} />
      <Route path="/chapitre/:id" element={<ChapterPage />} />
      <Route path="/compte" element={<Account />} />
      <Route path="/pseudo" element={<Onboarding />} />
      <Route path="/amis" element={<Amis />} />
      <Route path="/mentions-legales" element={<MentionsLegales />} />
      <Route path="/cgu" element={<CGU />} />
      <Route path="/confidentialite" element={<Confidentialite />} />
    </Routes>
  );
}
