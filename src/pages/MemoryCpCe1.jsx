import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, shadow } from "../theme";
import { shuffle, formatSeconds } from "../lib/gameUtils";

// ---------------------------------------------------------------------------
// Jeu "Memory CP/CE1" (/jeux/memory-cp-ce1) : variante "memory à trios"
// (demande de Romain) — on ne cherche plus des PAIRES mais des GROUPES DE 3
// cartes qui représentent la même valeur, uniquement sur les doubles et les
// triples (les anciennes catégories "amis de 10" et "calculs de base" ont
// été retirées) :
//   - Doubles (4 à 10) : "6 + 6", "2 × 6", "12".
//   - Triples (5, 7, 9) : "7 + 7 + 7", "3 × 7", "21".
// 10 groupes de 3 cartes = 30 cartes, plateau fixe (tout le contenu tient sur
// un seul plateau, plus besoin de tirer un sous-ensemble au hasard).
//
// Mécanique de retournement : comme un memory classique, on retourne 2
// cartes par tour. Si elles appartiennent au même groupe, elles restent
// retournées (2 des 3 membres du groupe trouvés). La 3e et dernière carte
// d'un groupe déjà trouvé à 2/3 se valide alors TOUTE SEULE dès qu'on la
// retourne (inutile de lui trouver un partenaire : on sait déjà qu'elle va
// avec les 2 autres) — sinon elle ne pourrait jamais être confirmée, ses 2
// partenaires étant déjà immobilisés face visible.
//
// Comme pour la version précédente, AUCUN texte affiché ne se répète ailleurs
// dans le plateau (vérifié par script Node avant intégration) : indispensable
// dans un memory, sinon deux cartes de valeur identique mais de groupes
// différents se confondraient.
//
// Gratuit, sans connexion : meilleur temps et meilleur nombre de coups
// gardés en localStorage sur cet appareil (clés dédiées à cette version, la
// mécanique ayant changé par rapport à la précédente version "en paires").
// ---------------------------------------------------------------------------

const CP_CE1_GROUPS = [
  // Doubles.
  { id: "double-4", cards: ["4 + 4", "2 × 4", "8"] },
  { id: "double-5", cards: ["5 + 5", "2 × 5", "10"] },
  { id: "double-6", cards: ["6 + 6", "2 × 6", "12"] },
  { id: "double-7", cards: ["7 + 7", "2 × 7", "14"] },
  { id: "double-8", cards: ["8 + 8", "2 × 8", "16"] },
  { id: "double-9", cards: ["9 + 9", "2 × 9", "18"] },
  { id: "double-10", cards: ["10 + 10", "2 × 10", "20"] },
  // Triples.
  { id: "triple-5", cards: ["5 + 5 + 5", "3 × 5", "15"] },
  { id: "triple-7", cards: ["7 + 7 + 7", "3 × 7", "21"] },
  { id: "triple-9", cards: ["9 + 9 + 9", "3 × 9", "27"] },
];

const GROUPS_COUNT = CP_CE1_GROUPS.length; // 10
const TOTAL_CARDS = GROUPS_COUNT * 3; // 30
const BEST_KEY_MS = "reussimaths_memory_cp_ce1_trio_best_ms";
const BEST_KEY_TRIES = "reussimaths_memory_cp_ce1_trio_best_tries";

function buildBoard() {
  const cards = [];
  CP_CE1_GROUPS.forEach((group) => {
    group.cards.forEach((text, idx) => {
      cards.push({ uid: `${group.id}-${idx}`, groupId: group.id, text });
    });
  });
  return shuffle(cards);
}

export default function MemoryCpCe1() {
  const [phase, setPhase] = useState("intro"); // intro | playing | result
  const [board, setBoard] = useState([]);
  const [flippedUids, setFlippedUids] = useState([]);
  const [matchedUids, setMatchedUids] = useState(new Set());
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

  const matchedGroupsCount = useMemo(() => {
    let count = 0;
    for (const group of CP_CE1_GROUPS) {
      const uids = [0, 1, 2].map((idx) => `${group.id}-${idx}`);
      if (uids.every((uid) => matchedUids.has(uid))) count++;
    }
    return count;
  }, [matchedUids]);

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => setNowMs(Date.now() - startAt), 100);
    return () => clearInterval(interval);
  }, [phase, startAt]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (matchedGroupsCount < GROUPS_COUNT) return;
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
  }, [matchedGroupsCount]);

  const startGame = () => {
    setBoard(buildBoard());
    setFlippedUids([]);
    setMatchedUids(new Set());
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
    if (matchedUids.has(card.uid)) return;
    if (flippedUids.includes(card.uid)) return;

    // La 3e carte d'un groupe déjà trouvé à 2/3 se valide toute seule, sans
    // avoir besoin d'un partenaire (ses 2 partenaires sont déjà immobilisés
    // face visible, donc impossibles à re-cliquer pour "faire la paire").
    const groupMatchedCount = board.filter((c) => c.groupId === card.groupId && matchedUids.has(c.uid)).length;
    if (groupMatchedCount === 2) {
      setMatchedUids((prev) => new Set(prev).add(card.uid));
      return;
    }

    if (flippedUids.length === 0) {
      setFlippedUids([card.uid]);
      return;
    }

    const firstUid = flippedUids[0];
    const firstCard = board.find((c) => c.uid === firstUid);
    const isMatch = firstCard.groupId === card.groupId;
    setFlippedUids([firstUid, card.uid]);
    setTries((t) => t + 1);
    setLocked(true);

    setTimeout(() => {
      setFlippedUids([]);
      setLocked(false);
      if (isMatch) {
        setMatchedUids((prev) => new Set(prev).add(firstUid).add(card.uid));
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

          <div className="game-intro-hero text-center my-7">
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
              Ici, pas de paires : il faut retrouver des GROUPES DE 3 cartes qui vont ensemble (par exemple "6 + 6",
              "2 × 6" et "12"), sur les doubles et les triples.
            </p>
            {bestTimeMs && (
              <p className="text-xs mt-3 font-semibold" style={{ color: gold }}>
                Ton record : {formatSeconds(bestTimeMs)}s{bestTries ? ` en ${bestTries} coups` : ""}
              </p>
            )}
          </div>

          <div className="rounded-3xl p-5 mb-6 text-center" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <p className="text-sm font-semibold" style={{ color: ink }}>
              {TOTAL_CARDS} cartes ({GROUPS_COUNT} groupes de 3)
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
              {matchedGroupsCount} / {GROUPS_COUNT} groupes — {tries} coups
            </p>
            <p className="text-sm font-bold" style={{ fontFamily: fonts.mono, color: gold }}>
              {formatSeconds(nowMs)}s
            </p>
          </div>

          <div
            className="memory-board-shell"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
            }}
          >
            {board.map((card) => {
              const isFlipped = flippedUids.includes(card.uid);
              const isMatched = matchedUids.has(card.uid);
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
                      style={{ fontFamily: fonts.mono, fontSize: "0.8rem", color: ink }}
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
      <div className="game-result-card max-w-md mx-auto text-center">
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
