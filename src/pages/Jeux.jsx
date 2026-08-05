import { Link } from "react-router-dom";
import { Zap, Calculator, LayoutGrid } from "lucide-react";
import { colors, fonts, shadow } from "../theme";

// ---------------------------------------------------------------------------
// Onglet "Jeux" (/jeux), au même niveau que Collège/Lycée sur l'accueil (voir
// CycleSelect.jsx) : des jeux courts pour travailler les maths autrement,
// gratuits et sans connexion. Cette page hub est prévue pour en accueillir
// facilement d'autres — il suffit d'ajouter une entrée à GAMES ci-dessous.
//
// `level` est un simple repère indicatif affiché sur la carte (demandé par
// Romain) — il ne filtre pas le contenu du jeu, c'est juste une indication
// pour aider à choisir (âges 10-18 visés par l'onglet).
// ---------------------------------------------------------------------------
const GAMES = [
  {
    id: "course-tables",
    title: "Course aux tables",
    description: "Réponds à 10 tables de multiplication (1 à 10) le plus vite possible et gagne la course.",
    icon: Zap,
    level: "Primaire à 3e",
  },
  {
    id: "estimation-express",
    title: "Estimation express",
    description: "Trouve le bon ordre de grandeur d'un calcul (+ − × ÷) avec de grands nombres, sans le poser.",
    icon: Calculator,
    level: "6e à Terminale",
  },
  {
    id: "memory-maths",
    title: "Memory maths",
    description: "Retrouve les paires : figures géométriques, expressions réduites et fractions irréductibles.",
    icon: LayoutGrid,
    level: "6e à Terminale",
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.1rem", fontWeight: 700 }}>
                        {game.title}
                      </p>
                      <span
                        className="text-[0.62rem] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${colors.ink}0d`, color: colors.slate }}
                      >
                        {game.level}
                      </span>
                    </div>
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
