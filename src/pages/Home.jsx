import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { chapters } from "../chapters/registry";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";

export default function Home() {
  const { user } = useAuth();
  const { isActive } = useSubscription(user?.id);

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: "#F7F4EC", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: "Fraunces, serif", color: "#1B2A4A", fontSize: "2rem", fontWeight: 600 }}>
            Reussimaths
          </h1>
          <p className="text-sm mt-1" style={{ color: "#5C6B7A" }}>
            Première Spécialité
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {chapters.map((chapter) => {
            const locked = !chapter.meta.free && !isActive;
            const content = (
              <div
                className="rounded-2xl p-4 flex items-center justify-between"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e4dfd0",
                  opacity: locked ? 0.6 : 1,
                }}
              >
                <div>
                  <p style={{ fontFamily: "Fraunces, serif", color: "#1B2A4A", fontSize: "1.1rem", fontWeight: 600 }}>
                    {chapter.meta.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#5C6B7A" }}>
                    {locked ? chapter.meta.unlockHint ?? "Chapitre sous abonnement" : chapter.meta.description}
                  </p>
                </div>
                {locked && <Lock size={18} color="#5C6B7A" />}
              </div>
            );
            return locked ? (
              <div key={chapter.meta.id}>{content}</div>
            ) : (
              <Link key={chapter.meta.id} to={`/chapitre/${chapter.meta.id}`}>
                {content}
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link to="/compte" className="text-sm underline" style={{ color: "#5C6B7A" }}>
            {user ? "Mon compte" : "Se connecter"}
          </Link>
        </div>
      </div>
    </div>
  );
}
