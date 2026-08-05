import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, shadow } from "../theme";
import { shuffle, formatSeconds } from "../lib/gameUtils";

// ---------------------------------------------------------------------------
// Jeu "Memory CP/CE1" (/jeux/memory-cp-ce1) : variante du memory pensée pour
// les plus jeunes (CP/CE1, ~6-7 ans), demandée par Romain après le premier
// Memory maths (destiné 6e-Terminale). Contrairement à celui-ci :
//   - une seule taille de plateau, fixe : 30 cartes (15 paires), pas de choix
//     de difficulté ;
//   - contenu 100% additions/soustractions avec des entiers de 1 à 40, sur 4
//     familles demandées explicitement par Romain : compléments à 10 ("amis
//     de 10"), doubles, triples, calculs de base.
//
// Modèle des paires : soit deux nombres qui se complètent à 10 (ex. "3" et
// "7"), soit un calcul et son résultat (ex. "6 + 6" et "12"). Le stock
// (CP_CE1_PAIRS, 20 paires) a été construit à la main pour qu'AUCUN nombre
// affiché (qu'il s'agisse d'un nombre seul ou du résultat d'un calcul) ne se
// répète ailleurs dans le stock — indispensable dans un memory : si deux
// paires différentes affichaient la même valeur (ex. deux cartes "12" qui ne
// sont pas censées se répondre), un enfant les associerait à tort en pensant
// avoir trouvé une paire. 15 paires sont tirées au hasard dans ce stock de 20
// à chaque partie, donc la grille change d'une partie à l'autre.
//
// Gratuit, sans connexion (comme les autres jeux) : meilleur temps et
// meilleur nombre de coups gardés en localStorage sur cet appareil.
// ---------------------------------------------------------------------------

const CP_CE1_PAIRS = [
  // Compléments à 10 ("amis de 10") : deux nombres qui s'additionnent à 10.
  { id: "c10-3-7", a: { text: "3" }, b: { text: "7" } },
  { id: "c10-6-4", a: { text: "6" }, b: { text: "4" } },
  { id: "c10-9-1", a: { text: "9" }, b: { text: "1" } },
  { id: "c10-8-2", a: { text: "8" }, b: { text: "2" } },
  // Doubles.
  { id: "double-5", a: { text: "5 + 5" }, b: { text: "10" } },
  { id: "double-6", a: { text: "6 + 6" }, b: { text: "12" } },
  { id: "double-7", a: { text: "7 + 7" }, b: { text: "14" } },
  { id: "double-8", a: { text: "8 + 8" }, b: { text: "16" } },
  { id: "double-9", a: { text: "9 + 9" }, b: { text: "18" } },
  { id: "double-10", a: { text: "10 + 10" }, b: { text: "20" } },
  // Triples.
  { id: "triple-5", a: { text: "5 + 5 + 5" }, b: { text: "15" } },
  { id: "triple-7", a: { text: "7 + 7 + 7" }, b: { text: "21" } },
  { id: "triple-9", a: { text: "9 + 9 + 9" }, b: { text: "27" } },
  // Additions et soustractions de base (entiers 1 à 40).
  { id: "calc-1", a: { text: "12 + 5" }, b: { text: "17" } },
  { id: "calc-2", a: { text: "20 − 9" }, b: { text: "11" } },
  { id: "calc-3", a: { text: "15 + 8" }, b: { text: "23" } },
  { id: "calc-4", a: { text: "30 − 6" }, b: { text: "24" } },
  { id: "calc-5", a: { text: "19 + 6" }, b: { text: "25" } },
  { id: "calc-6", a: { text: "40 − 14" }, b: { text: "26" } },
  { id: "calc-7", a: { text: "28 − 9" }, b: { text: "19" } },
];

const BOARD_PAIRS = 15; // 30 cartes, fixe (pas de choix de difficulté)
const BEST_KEY_MS = "reussimaths_memory_cp_ce1_best_ms";
const BEST_KEY_TRIES = "reussimaths_memory_cp_ce1_best_tries";

function buildBoard() {
  const chosen = shuffle(CP_CE1_PAIRS).slice(0, BOARD_PAIRS);
  const cards = [];
  chosen.forEach((pair) => {
    cards.push({ uid: `${pair.id}-a`, pairId: pair.id, text: pair.a.text });
    cards.push({ uid: `${pair.id}-b`, pairId: pair.id, text: pair.b.text });
  });
  return shuffle(cards);
}

export default function MemoryCpCe1() {
  const [phase, setPhase] = useState("intro"); // intro | playing | result
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

  const [bestTimeMs, setBestTimeMs] = useState(() => {
    const stored = Number(localStorage.getItem(BEST_KEY_MS));
    return stored > 0 ? stored : null;
  });
  const [bestTries, setBestTries] = useState(() => {
    const stored = Number(localStorage.getItem(BEST_KEY_TRIES));
    return stored > 0 ? stored : null;
  });

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => setNowMs(Date.now() - startAt), 100);
    return () => clearInterval(interval);
  }, [phase, startAt]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (matchedPairIds.size === 0 || matchedPairIds.size < BOARD_PAIRS) return;
    const total = Date.now() - startAt;
    setFinalTimeMs(total);
    setPhase("result");
    const bestMs = Number(localStorage.getItem(BEST_KEY_MS));
    if (!bestMs || total < bestMs) {
      localStorage.setItem(BEST_KEY_MS, String(Math.round(total)));
      setBestTimeMs(total);
      setIsNewBestTime(true);
    }
    const bestT = Number(localStorage.getItem(BEST_KEY_TRIES));
    if (!bestT || tries < bestT) {
      localStorage.setItem(BEST_KEY_TRIES, String(tries));
      setBestTries(tries);
      setIsNewBestTries(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedPairIds]);

  const startGame = () => {
    setBoard(buildBoard());
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
            <span
              className="inline-block text-[0.65rem] font-bold px-2.5 py-1 rounded-full mb-3"
              style={{ backgroundColor: `${gold}22`, color: ink }}
            >
              Jeu pour les CP / CE1
            </span>
            <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Memory CP/CE1
            </h1>
            <p className="text-sm mt-2" style={{ color: slate }}>
              Retourne deux cartes pour trouver les paires : des nombres amis de 10, des doubles, des triples, et des
              petits calculs d'addition et de soustraction (nombres de 1 à 40).
            </p>
            {bestTimeMs && (
              <p className="text-xs mt-3 font-semibold" style={{ color: gold }}>
                Ton record : {formatSeconds(bestTimeMs)}s{bestTries ? ` en ${bestTries} coups` : ""}
              </p>
            )}
          </div>

          <div className="rounded-3xl p-5 mb-6 text-center" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <p className="text-sm font-semibold" style={{ color: ink }}>
              30 cartes (15 paires)
            </p>
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
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: slate }}>
              {matchedPairIds.size} / {BOARD_PAIRS} paires — {tries} coups
            </p>
            <p className="text-sm font-bold" style={{ fontFamily: fonts.mono, color: gold }}>
              {formatSeconds(nowMs)}s
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
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
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    aspectRatio: "1",
                    backgroundColor: faceUp ? colors.card : `${colors.ink}0d`,
                    boxShadow: isMatched ? `0 0 0 2px ${colors.green}` : shadow.soft,
                    padding: 2,
                  }}
                >
                  {faceUp ? (
                    <span
                      className="text-center font-bold"
                      style={{ fontFamily: fonts.mono, fontSize: "0.85rem", color: ink }}
                    >
                      {card.text}
                    </span>
                  ) : (
                    <span style={{ color: slate, fontSize: "1.2rem", fontWeight: 700 }}>?</span>
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
        <p style={{ fontFamily: fonts.display, color: gold, fontSize: "1.8rem", fontWeight: 800 }}>Bravo !</p>
        <p className="text-sm mt-2" style={{ color: slate }}>
          Terminé en <strong style={{ color: ink }}>{formatSeconds(finalTimeMs)}s</strong>, en{" "}
          <strong style={{ color: ink }}>{tries}</strong> coups.
        </p>
        {(isNewBestTime || isNewBestTries) && (
          <p className="text-sm mt-2 font-semibold" style={{ color: colors.green }}>
            Nouveau record {isNewBestTime && isNewBestTries ? "de temps et de coups" : isNewBestTime ? "de temps" : "de coups"} !
          </p>
        )}
        {bestTimeMs && (
          <p className="text-xs mt-1" style={{ color: gold }}>
            Meilleur temps : {formatSeconds(bestTimeMs)}s{bestTries ? `, meilleur score : ${bestTries} coups` : ""}
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
