import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, shadow } from "../theme";
import { shuffle, formatSeconds } from "../lib/gameUtils";

// ---------------------------------------------------------------------------
// Jeu "Memory CP/CE1" (/jeux/memory-cp-ce1) : memory classique à 15 paires.
// Pour chaque nombre n de 1 à 15, l'enfant associe n + n à son résultat 2n.
// Une égalité animée apparaît brièvement après chaque paire trouvée.
// ---------------------------------------------------------------------------

const CP_CE1_GROUPS = Array.from({ length: 15 }, (_, index) => {
  const n = index + 1;
  return { id: `double-${n}`, n, cards: [`${n} + ${n}`, String(2 * n)] };
});

// L'ordre alterne volontairement les familles de teintes pour que deux
// paires successives ne puissent pas être confondues sur le plateau.
const GROUP_COLORS = [
  "#d81b60", "#1565c0", "#ef6c00", "#6a1b9a", "#00897b",
  "#c62828", "#558b2f", "#4527a0", "#ad6a00", "#00838f",
  "#9c2f00", "#7b1fa2", "#00695c", "#283593", "#827717",
];

const GROUPS_COUNT = CP_CE1_GROUPS.length; // 15
const TOTAL_CARDS = GROUPS_COUNT * 2; // 30
const BEST_KEY_MS = "reussimaths_memory_cp_ce1_pairs_15_best_ms";
const BEST_KEY_TRIES = "reussimaths_memory_cp_ce1_pairs_15_best_tries";

function buildBoard() {
  const cards = [];
  CP_CE1_GROUPS.forEach((group, groupIndex) => {
    group.cards.forEach((text, idx) => {
      cards.push({ uid: `${group.id}-${idx}`, groupId: group.id, groupColor: GROUP_COLORS[groupIndex], n: group.n, text });
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
  const [matchCelebration, setMatchCelebration] = useState(null);
  const [turn, setTurn] = useState("child");
  const [childScore, setChildScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentAttempts, setOpponentAttempts] = useState(0);
  const [opponentTarget, setOpponentTarget] = useState(() => 3 + Math.floor(Math.random() * 2));
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
      const uids = [0, 1].map((idx) => `${group.id}-${idx}`);
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
    if (phase !== "playing" || turn !== "opponent" || board.length === 0) return undefined;

    setLocked(true);
    const available = board.filter((card) => !matchedUids.has(card.uid));
    const groups = [...new Set(available.map((card) => card.groupId))];
    const mustFindPair = opponentAttempts + 1 >= opponentTarget || groups.length === 1;
    let chosen;

    if (mustFindPair) {
      const groupId = groups[Math.floor(Math.random() * groups.length)];
      chosen = available.filter((card) => card.groupId === groupId).slice(0, 2);
    } else {
      const shuffledGroups = shuffle(groups).slice(0, 2);
      chosen = shuffledGroups.map((groupId) => available.find((card) => card.groupId === groupId));
    }

    if (chosen.length < 2 || chosen.some((card) => !card)) return undefined;

    const timers = [
      window.setTimeout(() => setFlippedUids([chosen[0].uid]), 450),
      window.setTimeout(() => {
        setFlippedUids([chosen[0].uid, chosen[1].uid]);
        if (mustFindPair) {
          setMatchCelebration({
            equation: `${chosen[0].n * 2} = ${chosen[0].n} + ${chosen[0].n}`,
            color: chosen[0].groupColor,
            owner: "opponent",
          });
        }
      }, 950),
      window.setTimeout(() => {
        setFlippedUids([]);
        setMatchCelebration(null);
        if (mustFindPair) {
          setMatchedUids((previous) => new Set(previous).add(chosen[0].uid).add(chosen[1].uid));
          setOpponentScore((score) => score + 1);
          setOpponentAttempts(0);
          setOpponentTarget(3 + Math.floor(Math.random() * 2));
        } else {
          setOpponentAttempts((attempts) => attempts + 1);
        }
        setTurn("child");
        setLocked(false);
      }, mustFindPair ? 2150 : 1750),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
    // matchedUids is captured when the opponent's turn begins and must not
    // restart the animation while that turn is being resolved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turn, board, opponentAttempts, opponentTarget]);

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
    setMatchCelebration(null);
    setTurn("child");
    setChildScore(0);
    setOpponentScore(0);
    setOpponentAttempts(0);
    setOpponentTarget(3 + Math.floor(Math.random() * 2));
    setTries(0);
    setFinalTimeMs(null);
    setIsNewBestTime(false);
    setIsNewBestTries(false);
    setStartAt(Date.now());
    setNowMs(0);
    setPhase("playing");
  };

  const handleCardClick = (card) => {
    if (locked || turn !== "child") return;
    if (matchedUids.has(card.uid)) return;
    if (flippedUids.includes(card.uid)) return;

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

    if (isMatch) {
      setMatchCelebration({
        equation: `${card.n * 2} = ${card.n} + ${card.n}`,
        color: card.groupColor,
        owner: "child",
      });
    }

    setTimeout(() => {
      setFlippedUids([]);
      setLocked(false);
      if (isMatch) {
        setMatchedUids((prev) => new Set(prev).add(firstUid).add(card.uid));
        setChildScore((score) => score + 1);
        setMatchCelebration(null);
      }
      setTurn("opponent");
    }, isMatch ? 1100 : 900);
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
              Retrouve les 15 paires de doubles, de 1 + 1 jusqu’à 15 + 15. Associe chaque somme à son résultat,
              par exemple « 6 + 6 » avec « 12 ».
            </p>
            {bestTimeMs && (
              <p className="text-xs mt-3 font-semibold" style={{ color: gold }}>
                Ton record : {formatSeconds(bestTimeMs)}s{bestTries ? ` en ${bestTries} coups` : ""}
              </p>
            )}
          </div>

          <div className="rounded-3xl p-5 mb-6 text-center" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <p className="text-sm font-semibold" style={{ color: ink }}>
              {TOTAL_CARDS} cartes ({GROUPS_COUNT} paires)
            </p>
            <p className="text-xs mt-2" style={{ color: slate }}>
              Tu retournes deux cartes, puis le robot joue. Chaque paire trouvée rapporte 1 point.
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
          <Link to="/jeux" className="mb-4 inline-flex items-center gap-1 text-sm font-bold" style={{ color: slate }}>
            ← Retour aux jeux
          </Link>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
            <div className="rounded-xl px-3 py-2 text-center" style={{ backgroundColor: turn === "child" ? `${gold}22` : colors.card, border: `2px solid ${turn === "child" ? gold : colors.hairline}` }}>
              <p className="text-[10px] font-black uppercase" style={{ color: slate }}>Toi</p>
              <p className="text-xl font-black" style={{ color: ink }}>{childScore}</p>
            </div>
            <p className="text-sm font-bold" style={{ fontFamily: fonts.mono, color: gold }}>
              {formatSeconds(nowMs)}s
            </p>
            <div className="rounded-xl px-3 py-2 text-center" style={{ backgroundColor: turn === "opponent" ? `${colors.green}18` : colors.card, border: `2px solid ${turn === "opponent" ? colors.green : colors.hairline}` }}>
              <p className="text-[10px] font-black uppercase" style={{ color: slate }}>Robot</p>
              <p className="text-xl font-black" style={{ color: ink }}>{opponentScore}</p>
            </div>
          </div>
          <p aria-live="polite" className="mb-3 text-center text-xs font-bold" style={{ color: turn === "child" ? gold : colors.green }}>
            {turn === "child" ? "À toi de jouer !" : "Le robot cherche une paire…"} · {matchedGroupsCount} / {GROUPS_COUNT} paires
          </p>

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
                    backgroundColor: isMatched ? `${card.groupColor}18` : faceUp ? colors.card : `${colors.ink}0d`,
                    boxShadow: isMatched ? `0 0 0 3px ${card.groupColor}` : shadow.soft,
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

          {matchCelebration && (
            <div className="memory-match-overlay fixed inset-0 z-50 flex items-center justify-center pointer-events-none" aria-live="assertive">
              <div
                className="memory-match-celebration rounded-[2rem] px-8 py-7 text-center"
                style={{ backgroundColor: colors.card, border: `5px solid ${matchCelebration.color}`, boxShadow: shadow.raised }}
              >
                <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: matchCelebration.color }}>{matchCelebration.owner === "child" ? "Paire trouvée !" : "Le robot marque !"}</p>
                <p className="mt-2 text-4xl sm:text-5xl font-black" style={{ fontFamily: fonts.mono, color: ink }}>{matchCelebration.equation}</p>
              </div>
            </div>
          )}
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
        <p className="mt-3 text-lg font-black" style={{ color: childScore >= opponentScore ? colors.green : ink }}>
          Toi {childScore} – {opponentScore} Robot
        </p>
        <p className="mt-1 text-sm font-bold" style={{ color: slate }}>
          {childScore > opponentScore ? "Tu as gagné !" : childScore === opponentScore ? "Égalité !" : "Le robot gagne cette fois. Rejoue pour prendre ta revanche !"}
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
