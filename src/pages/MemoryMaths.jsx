import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, shadow } from "../theme";
import Figure from "../components/Figure";
import MathText from "../components/MathText";
import { shuffle, formatSeconds } from "../lib/gameUtils";

// ---------------------------------------------------------------------------
// Jeu "Memory maths" (/jeux/memory-maths) : memory classique (retourner deux
// cartes, trouver les paires), mais les paires mélangent 3 familles de
// contenu du programme :
//   - une figure géométrique (dessinée avec le composant Figure, déjà utilisé
//     dans les chapitres) associée à son nom ;
//   - une expression algébrique associée à sa forme réduite ;
//   - une fraction associée à sa forme irréductible.
//
// Deux tailles de plateau, choisies avant de jouer (même contenu pour les
// deux — seule la taille change, validé avec Romain) :
//   Facile    : 15 paires -> 30 cartes
//   Difficile : 27 paires -> 54 cartes
// Le stock total (ALL_PAIRS, ~31 paires) est mélangé et on en tire N au
// hasard à chaque partie, donc le plateau n'est jamais deux fois identique.
//
// Gratuit, sans connexion (comme les autres jeux — voir Jeux.jsx) : seul le
// meilleur temps et le meilleur nombre de coups sont gardés en localStorage
// sur cet appareil, séparément par taille de plateau.
// ---------------------------------------------------------------------------

// Sommets d'un polygone régulier à n côtés, centré sur un canevas 100x100 —
// utilisé pour Pentagone/Hexagone régulier plutôt que de coder les points à
// la main.
function regularPolygonSpec(n) {
  const cx = 50;
  const cy = 52;
  const r = 38;
  const points = [];
  for (let k = 0; k < n; k++) {
    const angle = ((-90 + (k * 360) / n) * Math.PI) / 180;
    points.push({ id: `P${k}`, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), hideDot: true });
  }
  const segments = points.map((p, i) => ({ from: p.id, to: points[(i + 1) % n].id }));
  return { points, segments, hidePointLabels: true };
}

const FIGURES = [
  {
    name: "Triangle rectangle",
    spec: {
      points: [
        { id: "A", x: 10, y: 80 },
        { id: "B", x: 80, y: 80 },
        { id: "C", x: 10, y: 20 },
      ],
      segments: [{ from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "A" }],
      rightAngles: [{ at: "A", from: "B", to: "C" }],
      hidePointLabels: true,
    },
  },
  {
    name: "Triangle isocèle",
    spec: {
      points: [
        { id: "A", x: 10, y: 80 },
        { id: "B", x: 90, y: 80 },
        { id: "C", x: 50, y: 15 },
      ],
      segments: [
        { from: "A", to: "B" },
        { from: "B", to: "C", ticks: 1 },
        { from: "C", to: "A", ticks: 1 },
      ],
      hidePointLabels: true,
    },
  },
  {
    name: "Triangle équilatéral",
    spec: {
      points: [
        { id: "A", x: 10, y: 80 },
        { id: "B", x: 90, y: 80 },
        { id: "C", x: 50, y: 10.7 },
      ],
      segments: [
        { from: "A", to: "B", ticks: 1 },
        { from: "B", to: "C", ticks: 1 },
        { from: "C", to: "A", ticks: 1 },
      ],
      hidePointLabels: true,
    },
  },
  {
    name: "Carré",
    spec: {
      points: [
        { id: "A", x: 15, y: 15 },
        { id: "B", x: 85, y: 15 },
        { id: "C", x: 85, y: 85 },
        { id: "D", x: 15, y: 85 },
      ],
      segments: [{ from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "D" }, { from: "D", to: "A" }],
      hidePointLabels: true,
    },
  },
  {
    name: "Rectangle",
    spec: {
      points: [
        { id: "A", x: 10, y: 25 },
        { id: "B", x: 90, y: 25 },
        { id: "C", x: 90, y: 75 },
        { id: "D", x: 10, y: 75 },
      ],
      segments: [{ from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "D" }, { from: "D", to: "A" }],
      hidePointLabels: true,
    },
  },
  {
    name: "Losange",
    spec: {
      points: [
        { id: "A", x: 50, y: 8 },
        { id: "B", x: 90, y: 50 },
        { id: "C", x: 50, y: 92 },
        { id: "D", x: 10, y: 50 },
      ],
      segments: [{ from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "D" }, { from: "D", to: "A" }],
      hidePointLabels: true,
    },
  },
  {
    name: "Parallélogramme",
    spec: {
      points: [
        { id: "A", x: 15, y: 80 },
        { id: "B", x: 75, y: 80 },
        { id: "C", x: 95, y: 20 },
        { id: "D", x: 35, y: 20 },
      ],
      segments: [{ from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "D" }, { from: "D", to: "A" }],
      hidePointLabels: true,
    },
  },
  {
    name: "Trapèze",
    spec: {
      points: [
        { id: "A", x: 10, y: 80 },
        { id: "B", x: 90, y: 80 },
        { id: "C", x: 70, y: 20 },
        { id: "D", x: 30, y: 20 },
      ],
      segments: [{ from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "D" }, { from: "D", to: "A" }],
      hidePointLabels: true,
    },
  },
  {
    name: "Cercle",
    spec: {
      points: [{ id: "O", x: 50, y: 50, hideDot: true }],
      circles: [{ center: "O", radius: 38 }],
      hidePointLabels: true,
    },
  },
  { name: "Pentagone régulier", spec: regularPolygonSpec(5) },
  { name: "Hexagone régulier", spec: regularPolygonSpec(6) },
];

const EXPRESSIONS = [
  { raw: "3x + 2x", simplified: "5x" },
  { raw: "6x - 2x", simplified: "4x" },
  { raw: "x + x + x", simplified: "3x" },
  { raw: "2x + 3 + x - 1", simplified: "3x + 2" },
  { raw: "4(x + 1)", simplified: "4x + 4" },
  { raw: "2(x + 3)", simplified: "2x + 6" },
  { raw: "3(2x - 1)", simplified: "6x - 3" },
  { raw: "x^{2} + x^{2}", simplified: "2x^{2}" },
  { raw: "5 + 2x - 3", simplified: "2x + 2" },
  { raw: "10x - 4x + x", simplified: "7x" },
];

const FRACTIONS = [
  { raw: [6, 8], simplified: [3, 4] },
  { raw: [8, 12], simplified: [2, 3] },
  { raw: [10, 12], simplified: [5, 6] },
  { raw: [8, 16], simplified: [1, 2] },
  { raw: [9, 15], simplified: [3, 5] },
  { raw: [12, 15], simplified: [4, 5] },
  { raw: [6, 15], simplified: [2, 5] },
  { raw: [15, 24], simplified: [5, 8] },
  { raw: [9, 24], simplified: [3, 8] },
  { raw: [14, 20], simplified: [7, 10] },
];

const ALL_PAIRS = [
  ...FIGURES.map((f, i) => ({
    id: `fig-${i}`,
    a: { type: "figure", spec: f.spec },
    b: { type: "label", text: f.name },
  })),
  ...EXPRESSIONS.map((e, i) => ({
    id: `expr-${i}`,
    a: { type: "math", tex: e.raw },
    b: { type: "math", tex: e.simplified },
  })),
  ...FRACTIONS.map((f, i) => ({
    id: `frac-${i}`,
    a: { type: "math", tex: `\\dfrac{${f.raw[0]}}{${f.raw[1]}}` },
    b: { type: "math", tex: `\\dfrac{${f.simplified[0]}}{${f.simplified[1]}}` },
  })),
];

const BOARD_SIZES = [
  { id: "facile", label: "Facile", pairs: 15, cols: 5 },
  { id: "difficile", label: "Difficile", pairs: 27, cols: 6 },
];

const BEST_KEY_PREFIX = "reussimaths_memory_maths_best_";

function buildBoard(n) {
  const chosen = shuffle(ALL_PAIRS).slice(0, n);
  const cards = [];
  chosen.forEach((pair) => {
    cards.push({ uid: `${pair.id}-a`, pairId: pair.id, content: pair.a });
    cards.push({ uid: `${pair.id}-b`, pairId: pair.id, content: pair.b });
  });
  return shuffle(cards);
}

function CardContent({ content }) {
  if (content.type === "figure") {
    return (
      <div style={{ marginBottom: -16, maxWidth: "78%" }}>
        <Figure spec={content.spec} />
      </div>
    );
  }
  if (content.type === "math") {
    return <MathText text={`\\(${content.tex}\\)`} style={{ fontSize: "0.72rem", color: colors.ink }} />;
  }
  return (
    <span className="text-center font-semibold" style={{ fontSize: "0.62rem", lineHeight: 1.15, color: colors.ink }}>
      {content.text}
    </span>
  );
}

export default function MemoryMaths() {
  const [phase, setPhase] = useState("intro"); // intro | playing | result
  const [selectedSizeId, setSelectedSizeId] = useState(BOARD_SIZES[0].id);
  const [board, setBoard] = useState([]);
  const [flippedUids, setFlippedUids] = useState([]);
  const [matchedPairIds, setMatchedPairIds] = useState(new Set());
  const [locked, setLocked] = useState(false);
  const [tries, setTries] = useState(0);
  const [startAt, setStartAt] = useState(null);
  const [nowMs, setNowMs] = useState(0);
  const [finalTimeMs, setFinalTimeMs] = useState(null);
  const [isNewBestTime, setIsNewBestTime] = useState(false);
  const [isNewBestTries, setIsNewBestTries] = useState(false);

  const size = BOARD_SIZES.find((s) => s.id === selectedSizeId);
  const bestTimeKey = BEST_KEY_PREFIX + "ms_" + size.id;
  const bestTriesKey = BEST_KEY_PREFIX + "tries_" + size.id;

  const [bestTimeMs, setBestTimeMs] = useState(() => {
    const stored = Number(localStorage.getItem(bestTimeKey));
    return stored > 0 ? stored : null;
  });
  const [bestTries, setBestTries] = useState(() => {
    const stored = Number(localStorage.getItem(bestTriesKey));
    return stored > 0 ? stored : null;
  });
  useEffect(() => {
    const storedMs = Number(localStorage.getItem(bestTimeKey));
    setBestTimeMs(storedMs > 0 ? storedMs : null);
    const storedTries = Number(localStorage.getItem(bestTriesKey));
    setBestTries(storedTries > 0 ? storedTries : null);
  }, [bestTimeKey, bestTriesKey]);

  // Chrono temps réel pendant la partie.
  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => setNowMs(Date.now() - startAt), 100);
    return () => clearInterval(interval);
  }, [phase, startAt]);

  // Fin de partie : toutes les paires trouvées.
  useEffect(() => {
    if (phase !== "playing") return;
    if (matchedPairIds.size === 0 || matchedPairIds.size < size.pairs) return;
    const total = Date.now() - startAt;
    setFinalTimeMs(total);
    setPhase("result");
    const bestMs = Number(localStorage.getItem(bestTimeKey));
    if (!bestMs || total < bestMs) {
      localStorage.setItem(bestTimeKey, String(Math.round(total)));
      setBestTimeMs(total);
      setIsNewBestTime(true);
    }
    const bestT = Number(localStorage.getItem(bestTriesKey));
    if (!bestT || tries < bestT) {
      localStorage.setItem(bestTriesKey, String(tries));
      setBestTries(tries);
      setIsNewBestTries(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedPairIds]);

  const startGame = () => {
    setBoard(buildBoard(size.pairs));
    setFlippedUids([]);
    setMatchedPairIds(new Set());
    setLocked(false);
    setTries(0);
    setFinalTimeMs(null);
    setIsNewBestTime(false);
    setIsNewBestTries(false);
    setStartAt(Date.now());
    setNowMs(0);
    setPhase("playing");
  };

  const handleCardClick = (card) => {
    if (locked) return;
    if (matchedPairIds.has(card.pairId)) return;
    if (flippedUids.includes(card.uid)) return;

    if (flippedUids.length === 0) {
      setFlippedUids([card.uid]);
      return;
    }

    const firstUid = flippedUids[0];
    const firstCard = board.find((c) => c.uid === firstUid);
    const isMatch = firstCard.pairId === card.pairId;
    setFlippedUids([firstUid, card.uid]);
    setTries((t) => t + 1);
    setLocked(true);

    setTimeout(() => {
      setFlippedUids([]);
      setLocked(false);
      if (isMatch) {
        setMatchedPairIds((prev) => new Set(prev).add(card.pairId));
      }
    }, isMatch ? 500 : 900);
  };

  const ink = colors.ink;
  const paper = colors.bg;
  const slate = colors.slate;
  const gold = colors.gold;

  // -------------------------------------------------------------- INTRO ---
  if (phase === "intro") {
    return (
      <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="max-w-md mx-auto">
          <Link to="/jeux" className="text-sm font-medium" style={{ color: ink }}>
            ← Jeux
          </Link>

          <div className="text-center my-7">
            <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Memory maths
            </h1>
            <p className="text-sm mt-2" style={{ color: slate }}>
              Retourne deux cartes pour trouver les paires : une figure géométrique et son nom, une expression et sa
              forme réduite, ou une fraction et sa forme irréductible.
            </p>
            {bestTimeMs && (
              <p className="text-xs mt-3 font-semibold" style={{ color: gold }}>
                Ton record en {size.label} : {formatSeconds(bestTimeMs)}s{bestTries ? ` en ${bestTries} coups` : ""}
              </p>
            )}
          </div>

          <div className="rounded-3xl p-5 mb-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <p className="text-xs uppercase tracking-wide font-semibold mb-3" style={{ color: slate }}>
              Choisis ta grille
            </p>
            <div className="grid grid-cols-2 gap-2">
              {BOARD_SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSizeId(s.id)}
                  className="flex flex-col items-center gap-1 rounded-2xl py-3 px-1"
                  style={{
                    backgroundColor: selectedSizeId === s.id ? `${gold}22` : paper,
                    border: selectedSizeId === s.id ? `2px solid ${gold}` : "2px solid transparent",
                  }}
                >
                  <span className="text-sm font-bold" style={{ color: ink }}>
                    {s.label}
                  </span>
                  <span className="text-[0.65rem] text-center leading-tight" style={{ color: slate }}>
                    {s.pairs * 2} cartes
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={startGame} className="w-full py-3.5 rounded-full font-bold text-lg" style={{ backgroundColor: gold, color: ink }}>
            Commencer
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------- PLAYING ---
  if (phase === "playing") {
    return (
      <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: slate }}>
              {matchedPairIds.size} / {size.pairs} paires — {tries} coups
            </p>
            <p className="text-sm font-bold" style={{ fontFamily: fonts.mono, color: gold }}>
              {formatSeconds(nowMs)}s
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${size.cols}, 1fr)`,
              gap: 6,
            }}
          >
            {board.map((card) => {
              const isFlipped = flippedUids.includes(card.uid);
              const isMatched = matchedPairIds.has(card.pairId);
              const faceUp = isFlipped || isMatched;
              return (
                <button
                  key={card.uid}
                  onClick={() => handleCardClick(card)}
                  disabled={faceUp}
                  className="flex items-center justify-center rounded-xl overflow-hidden"
                  style={{
                    aspectRatio: "1",
                    backgroundColor: faceUp ? colors.card : `${colors.ink}0d`,
                    boxShadow: isMatched ? `0 0 0 2px ${colors.green}` : shadow.soft,
                    padding: 3,
                  }}
                >
                  {faceUp ? (
                    <CardContent content={card.content} />
                  ) : (
                    <span style={{ color: slate, fontSize: "1rem", fontWeight: 700 }}>?</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------- RESULT ---
  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto text-center">
        <p style={{ fontFamily: fonts.display, color: gold, fontSize: "1.8rem", fontWeight: 800 }}>Bien joué !</p>
        <p className="text-sm mt-2" style={{ color: slate }}>
          Grille {size.label} terminée en <strong style={{ color: ink }}>{formatSeconds(finalTimeMs)}s</strong>, en{" "}
          <strong style={{ color: ink }}>{tries}</strong> coups.
        </p>
        {(isNewBestTime || isNewBestTries) && (
          <p className="text-sm mt-2 font-semibold" style={{ color: colors.green }}>
            Nouveau record {isNewBestTime && isNewBestTries ? "de temps et de coups" : isNewBestTime ? "de temps" : "de coups"} !
          </p>
        )}
        {bestTimeMs && (
          <p className="text-xs mt-1" style={{ color: gold }}>
            Meilleur temps en {size.label} : {formatSeconds(bestTimeMs)}s{bestTries ? `, meilleur score : ${bestTries} coups` : ""}
          </p>
        )}

        <div className="flex flex-col gap-2.5 mt-8">
          <button onClick={startGame} className="w-full py-3 rounded-full font-bold text-lg" style={{ backgroundColor: gold, color: ink }}>
            Rejouer
          </button>
          <Link to="/jeux" className="text-sm font-medium py-2" style={{ color: slate }}>
            ← Retour aux jeux
          </Link>
        </div>
      </div>
    </div>
  );
}
