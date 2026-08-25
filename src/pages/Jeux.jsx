import { Link } from "react-router-dom";
import { ArrowRight, Gamepad2, Zap, Calculator, LayoutGrid, Baby, ShieldCheck } from "lucide-react";
import { colors, fonts, shadow } from "../theme";
import Mascot from "../components/Mascot";

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
    accent: "#F59E0B",
    duration: "2 min",
  },
  {
    id: "estimation-express",
    title: "Estimation express",
    description: "Trouve le bon ordre de grandeur d'un calcul (+ − × ÷) avec de grands nombres, sans le poser.",
    icon: Calculator,
    level: "6e à Terminale",
    accent: "#1789A0",
    duration: "3 min",
  },
  {
    id: "memory-maths",
    title: "Memory maths",
    description: "Retrouve les paires : figures géométriques, expressions réduites et fractions irréductibles.",
    icon: LayoutGrid,
    level: "6e à Terminale",
    accent: "#6C5CE7",
    duration: "4 min",
  },
  {
    id: "memory-cp-ce1",
    title: "Memory CP/CE1",
    description: "Retrouve les paires de doubles et affronte le robot, avec un point pour chaque paire gagnée.",
    icon: Baby,
    level: "CP / CE1",
    accent: "#E56B8B",
    duration: "4 min",
  },
  {
    id: "course-additions-cp-ce1",
    title: "Course des additions",
    description: "Écris la réponse à des additions de nombres jusqu'à 20 et gagne la course jusqu'à 6 bonnes réponses.",
    icon: Zap,
    level: "CP / CE1",
    accent: "#3FA66B",
    duration: "2 min",
  },
];

export default function Jeux() {
  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Accueil
        </Link>

        <div className="rounded-[2rem] px-5 py-8 sm:p-10 text-center my-7 sm:my-10 relative overflow-hidden" style={{ backgroundColor: colors.ink, boxShadow: shadow.raised }}>
          <div className="absolute rounded-full" style={{ width: 260, height: 260, top: -170, right: -70, backgroundColor: `${colors.gold}28` }} />
          <div className="relative mx-auto w-fit"><Mascot size={76} motion="float"/><span className="absolute -bottom-1 -right-2 flex h-9 w-9 items-center justify-center rounded-full" style={{background:colors.gold,border:"3px solid #1B2A4A"}}><Gamepad2 size={18} color={colors.ink}/></span></div>
          <p className="relative text-xs uppercase tracking-[0.18em] font-bold mt-5" style={{ color: colors.gold }}>Réflexes · logique · calcul mental</p>
          <h1 className="relative mt-2" style={{ fontFamily: fonts.display, color: "#fff", fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>Joue. Réfléchis. Recommence.</h1>
          <p className="relative text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,.68)" }}>Des parties courtes pour entraîner les automatismes sans avoir l’impression de refaire une fiche d’exercices.</p>
          <div className="relative flex flex-wrap justify-center gap-4 mt-5 text-xs" style={{ color: "rgba(255,255,255,.72)" }}><span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} color={colors.green} /> Gratuit</span><span>Sans compte</span><span>Sans publicité</span></div>
        </div>

        <nav aria-label="Catégories de jeux" className="mb-6 flex justify-center gap-2">
          <span className="rounded-full px-5 py-2.5 text-sm font-black" style={{ backgroundColor: colors.ink, color: "white" }}>Tous les jeux</span>
          <Link to="/jeux/ce1" className="rounded-full px-5 py-2.5 text-sm font-black" style={{ backgroundColor: `${colors.gold}22`, color: colors.ink, border: `1px solid ${colors.gold}` }}>CE1</Link>
        </nav>

        <div className="grid sm:grid-cols-2 gap-4">
          {GAMES.map((game, index) => {
            const Icon = game.icon;
            return (
              <Link key={game.id} to={`/jeux/${game.id}`}>
                <div
                  className="game-card interactive-card rounded-3xl p-5 sm:p-6 flex flex-col h-full"
                  style={{ backgroundColor: colors.card, boxShadow: shadow.soft, border: `1px solid ${colors.hairline}`, borderTop: `3px solid ${game.accent}` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: 52, height: 52, backgroundColor: `${game.accent}16` }}><Icon size={24} color={game.accent} /></div>
                    <div className="flex items-center gap-1.5">{index === 0 && <span className="text-[0.6rem] font-black px-2 py-1 rounded-full" style={{background:colors.gold,color:colors.ink}}>À essayer</span>}<span className="text-[0.65rem] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${game.accent}12`, color: game.accent }}>{game.duration}</span></div>
                  </div>
                  <div className="flex-1 min-w-0 mt-5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.1rem", fontWeight: 700 }}>
                        {game.title}
                      </p>
                    </div>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: colors.slate }}>
                      {game.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 mt-5 pt-4" style={{ borderTop: `1px solid ${colors.hairline}` }}><span className="text-xs font-semibold" style={{ color: colors.slate }}>{game.level}</span><span className="game-card-cta inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-black" style={{ color: game.accent, background:`${game.accent}10` }}>Jouer <ArrowRight size={14} /></span></div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-center py-9"><p className="text-xs" style={{ color: colors.slate }}>Les jeux complètent l’entraînement structuré ; ils ne modifient pas la progression du parcours.</p><Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold mt-3" style={{ color: colors.ink }}>Revenir à mon parcours <ArrowRight size={14} /></Link></div>
      </div>
    </div>
  );
}
