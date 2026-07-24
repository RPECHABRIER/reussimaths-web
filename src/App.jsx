import { Routes, Route } from "react-router-dom";
import LevelSelect from "./pages/LevelSelect";
import Niveau from "./pages/Niveau";
import ChapterPage from "./pages/ChapterPage";
import Account from "./pages/Account";
import Onboarding from "./pages/Onboarding";

export default function App() {
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
