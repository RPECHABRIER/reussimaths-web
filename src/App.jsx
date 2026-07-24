import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LevelSelect from "./pages/LevelSelect";
import Niveau from "./pages/Niveau";
import ChapterPage from "./pages/ChapterPage";
import Account from "./pages/Account";
import Onboarding from "./pages/Onboarding";
import { useAuth } from "./hooks/useAuth";
import { useProfile } from "./hooks/useProfile";

export default function App() {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const location = useLocation();
  const navigate = useNavigate();

  // Capture un éventuel lien de parrainage (?ref=code), quelle que soit la
  // page d'arrivée — utilisé à la création du profil (voir Onboarding.jsx).
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) localStorage.setItem("reussimaths_ref_code", ref);
  }, []);

  // Première connexion : pas encore de pseudo choisi -> redirection globale
  // vers /pseudo, quelle que soit la page sur laquelle l'utilisateur atterrit.
  useEffect(() => {
    if (!loading && !profileLoading && user && !profile && location.pathname !== "/pseudo") {
      navigate("/pseudo");
    }
  }, [loading, profileLoading, user, profile, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<LevelSelect />} />
      <Route path="/niveau/:levelId" element={<Niveau />} />
      <Route path="/chapitre/:id" element={<ChapterPage />} />
      <Route path="/compte" element={<Account />} />
      <Route path="/pseudo" element={<Onboarding />} />
    </Routes>
  );
}
