import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChapterPage from "./pages/ChapterPage";
import Account from "./pages/Account";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chapitre/:id" element={<ChapterPage />} />
      <Route path="/compte" element={<Account />} />
    </Routes>
  );
}
