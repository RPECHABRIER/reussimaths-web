import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { colors, fonts, shadow } from "../theme";

// ---------------------------------------------------------------------------
// Onglet "Jeux" (/jeux), au même niveau que Collège/Lycée sur l'accueil (voir
// CycleSelect.jsx) : des jeux courts pour travailler les maths autrement,
// gratuits et sans connexion. Pour l'instant un seul jeu (Course aux tables),
// mais cette page hub est prévue pour en accueillir d'autres facilement — il
// suffira d'ajouter une entrée à GAMES ci-dessous.
// ---------------------------------------------------------------------------
const GAMES = [
  {
    id: "course-tables",
    title: "Course aux tables",
    description: "Réponds à 10 tables de multiplication (1 à 10) le plus vite possible et gagne la course.",
    icon: Zap,
  },
];

export default function Jeux() {
  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto">
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Accueil
        </Link>

        <div className="text-center my-7">
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Jeux
          </h1>
          <p className="text-sm mt-1.5" style={{ color: colors.slate }}>
            Travailler les maths autrement — gratuit, sans connexion.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {GAMES.map((game) => {
            const Icon = game.icon;
            return (
              <Link key={game.id} to={`/jeux/${game.id}`}>
                <div
                  className="rounded-3xl px-5 py-5 flex items-center gap-4 transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl flex-shrink-0"
                    style={{ width: 52, height: 52, backgroundColor: `${colors.gold}18` }}
                  >
                    <Icon size={24} color={colors.gold} />
                  </div>
                  <div>
                    <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.1rem", fontWeight: 700 }}>
                      {game.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: colors.slate }}>
                      {game.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
