import { Link } from "react-router-dom";
import { LEVELS } from "../levels";
import { getChaptersByLevel } from "../chapters/registry";

export default function LevelSelect() {
  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: "#F7F4EC", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 style={{ fontFamily: "Fraunces, serif", color: "#1B2A4A", fontSize: "2rem", fontWeight: 600 }}>
            Reussimaths
          </h1>
          <p className="text-sm mt-1" style={{ color: "#5C6B7A" }}>
            Choisis ton niveau
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {LEVELS.map((level) => {
            const available = getChaptersByLevel(level.id).length > 0;
            return (
              <Link key={level.id} to={`/niveau/${level.id}`}>
                <div
                  className="rounded-2xl p-4 flex items-center justify-between"
                  style={{ backgroundColor: "#ffffff", border: "1px solid #e4dfd0" }}
                >
                  <p style={{ fontFamily: "Fraunces, serif", color: "#1B2A4A", fontSize: "1.1rem", fontWeight: 600 }}>
                    {level.label}
                  </p>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: available ? "#4E8B6B22" : "#5C6B7A18",
                      color: available ? "#4E8B6B" : "#5C6B7A",
                    }}
                  >
                    {available ? "Disponible" : "Bientôt"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link to="/compte" className="text-sm underline" style={{ color: "#5C6B7A" }}>
            Mon compte
          </Link>
        </div>
      </div>
    </div>
  );
}
