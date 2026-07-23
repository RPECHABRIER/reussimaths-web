import { useParams, Link } from "react-router-dom";
import { getChapter } from "../chapters/registry";
import ChapterRunner from "../components/ChapterRunner";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";

export default function ChapterPage() {
  const { id } = useParams();
  const chapter = getChapter(id);
  const { user } = useAuth();
  const { isActive, loading } = useSubscription(user?.id);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>
          Chapitre introuvable. <Link to="/">Retour à l'accueil</Link>
        </p>
      </div>
    );
  }

  const locked = !chapter.meta.free && !isActive;

  if (loading && !chapter.meta.free) {
    return <div className="min-h-screen flex items-center justify-center">Chargement…</div>;
  }

  if (locked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p style={{ fontFamily: "Fraunces, serif", fontSize: "1.3rem", color: "#1B2A4A" }}>
          {chapter.meta.title} est un chapitre sous abonnement
        </p>
        <p className="text-sm" style={{ color: "#5C6B7A" }}>
          {chapter.meta.unlockHint ?? "Abonne-toi pour y accéder."}
        </p>
        <Link to="/compte" className="text-sm underline">
          Gérer mon abonnement
        </Link>
      </div>
    );
  }

  return <ChapterRunner chapter={chapter} />;
}
