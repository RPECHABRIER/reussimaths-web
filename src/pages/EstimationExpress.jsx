import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, shadow } from "../theme";
import RaceTrack from "../components/RaceTrack";
import { shuffle, formatSeconds, formatNumber, rankFromTime } from "../lib/gameUtils";

// ---------------------------------------------------------------------------
// Jeu "Estimation express" (/jeux/estimation-express) : même moteur de course
// que Course aux tables (voir CourseTables.jsx + RaceTrack.jsx / gameUtils.js
// partagés), mais sur une compétence différente : trouver rapidement l'ordre
// de grandeur d'un calcul (+ − × ÷) avec de grands nombres, sans le poser.
//
// Technique enseignée = celle du programme : arrondir chaque nombre à son
// chiffre le plus significatif (ex. 427 -> 400, 68 -> 70) puis calculer sur
// ces valeurs arrondies (400 × 70 = 28 000). C'est cette valeur "propre" qui
// sert de bonne réponse dans le QCM.
//
// QCM à 4 choix : la bonne estimation + 3 pièges — un ordre de grandeur trop
// grand (×10), un trop petit (÷10), et un du bon ordre mais avec le mauvais
// chiffre significatif (ex. 21 000 au lieu de 28 000) — pour éviter que les
// élèves gagnent juste en comptant les zéros sans vraiment estimer.
//
// Mêmes 3 niveaux de jeu que Course aux tables (temps un peu plus généreux :
// lire de grands nombres et estimer prend plus de temps que rappeler une
// table de multiplication) :
//   Expert       : 18s / 22s / 26s
//   Intermédiaire: 24s / 28s / 32s
//   Débutant     : 30s / 35s / 40s
// ---------------------------------------------------------------------------

const ANIMALS = [
  { id: "lapin", emoji: "🐇", label: "Lapin" },
  { id: "renard", emoji: "🦊", label: "Renard" },
  { id: "tortue", emoji: "🐢", label: "Tortue" },
  { id: "grenouille", emoji: "🐸", label: "Grenouille" },
];

const DIFFICULTIES = [
  { id: "expert", label: "Expert", thresholds: { gold: 18000, silver: 22000, bronze: 26000 } },
  { id: "moyen", label: "Intermédiaire", thresholds: { gold: 24000, silver: 28000, bronze: 32000 } },
  { id: "debutant", label: "Débutant", thresholds: { gold: 30000, silver: 35000, bronze: 40000 } },
];

const PENALTY_MS = 1500;
const QUESTIONS_COUNT = 10;
const BEST_KEY_PREFIX = "reussimaths_estimation_express_best_ms_";

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Arrondit n à son chiffre le plus significatif (ex. 427 -> 400, 68 -> 70,
// 5 -> 5). Suppose n >= 1.
function round1sig(n) {
  const power = Math.pow(10, Math.floor(Math.log10(n) + 1e-9));
  let digit = Math.round(n / power);
  if (digit >= 10) return 10 * power;
  return digit * power;
}

// Génère un piège "du bon ordre de grandeur, mauvais chiffre" (ex. 28 000 ->
// 21 000) : force à vraiment estimer plutôt qu'à juste compter les zéros.
function sameOrderDistractor(E) {
  const power = Math.pow(10, Math.floor(Math.log10(E) + 1e-9));
  const digit = Math.max(1, Math.round(E / power));
  let newDigit = digit + (Math.random() < 0.5 ? -1 : 1) * (Math.random() < 0.5 ? 1 : 2);
  if (newDigit <= 0 || newDigit === digit) newDigit = digit + 2;
  if (newDigit > 9) newDigit = Math.max(1, digit - 2);
  return newDigit * power;
}

function buildChoices(E) {
  const used = new Set([E]);
  const options = [E];
  const tryAdd = (v) => {
    const rounded = Math.max(1, Math.round(v));
    if (!used.has(rounded)) {
      used.add(rounded);
      options.push(rounded);
    }
  };
  tryAdd(E * 10);
  tryAdd(E / 10);
  tryAdd(sameOrderDistractor(E));
  let guard = 0;
  while (options.length < 4 && guard < 20) {
    tryAdd(E * (0.4 + Math.random() * 4));
    guard++;
  }
  return shuffle(options);
}

function generateQuestion(op) {
  let a, b, result, E, exprStr;
  if (op === "+") {
    a = randInt(1000, 89999);
    b = randInt(500, 78999);
    result = a + b;
    E = round1sig(a) + round1sig(b);
    exprStr = `${formatNumber(a)} + ${formatNumber(b)}`;
  } else if (op === "-") {
    a = randInt(5000, 98000);
    b = randInt(200, a - 300);
    result = a - b;
    E = round1sig(a) - round1sig(b);
    if (E <= 0) E = round1sig(result);
    exprStr = `${formatNumber(a)} − ${formatNumber(b)}`;
  } else if (op === "×") {
    a = randInt(23, 986);
    b = randInt(12, 97);
    result = a * b;
    E = round1sig(a) * round1sig(b);
    exprStr = `${formatNumber(a)} × ${formatNumber(b)}`;
  } else {
    a = randInt(1000, 97000);
    b = randInt(12, 96);
    result = a / b;
    E = round1sig(round1sig(a) / round1sig(b));
    exprStr = `${formatNumber(a)} ÷ ${formatNumber(b)}`;
  }
  return { op, exprStr, product: Math.round(E), choices: buildChoices(Math.round(E)) };
}

// Bag équilibré (3 + / 3 − / 2 × / 2 ÷) mélangé, pour garantir de la variété
// sur les 10 questions plutôt qu'un tirage aléatoire pur (qui pourrait, par
// malchance, enchaîner plusieurs fois la même opération).
function generateQuestions() {
  const ops = shuffle([
    ...Array(3).fill("+"),
    ...Array(3).fill("-"),
    ...Array(2).fill("×"),
    ...Array(2).fill("÷"),
  ]);
  return ops.slice(0, QUESTIONS_COUNT).map(generateQuestion);
}

export default function EstimationExpress() {
  const [phase, setPhase] = useState("intro"); // intro | racing | result
  const [selectedAnimal, setSelectedAnimal] = useState(ANIMALS[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTIES[1].id);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null
  const [raceStartAt, setRaceStartAt] = useState(null);
  const [penaltyMs, setPenaltyMs] = useState(0);
  const [nowMs, setNowMs] = useState(0);
  const [finalTimeMs, setFinalTimeMs] = useState(null);

  const difficulty = DIFFICULTIES.find((d) => d.id === selectedDifficulty);
  const thresholds = difficulty.thresholds;
  const bestKey = BEST_KEY_PREFIX + difficulty.id;

  const [bestTimeMs, setBestTimeMs] = useState(() => {
    const stored = Number(localStorage.getItem(bestKey));
    return stored > 0 ? stored : null;
  });
  useEffect(() => {
    const stored = Number(localStorage.getItem(bestKey));
    setBestTimeMs(stored > 0 ? stored : null);
  }, [bestKey]);

  const opponents = useMemo(() => ANIMALS.filter((a) => a.id !== selectedAnimal), [selectedAnimal]);
  const player = ANIMALS.find((a) => a.id === selectedAnimal);

  useEffect(() => {
    if (phase !== "racing") return;
    const interval = setInterval(() => setNowMs(Date.now() - raceStartAt), 100);
    return () => clearInterval(interval);
  }, [phase, raceStartAt]);

  const startRace = () => {
    setQuestions(generateQuestions());
    setQuestionIndex(0);
    setPenaltyMs(0);
    setFinalTimeMs(null);
    setFeedback(null);
    setSelectedChoice(null);
    setRaceStartAt(Date.now());
    setNowMs(0);
    setPhase("racing");
  };

  const handleChoice = (value) => {
    if (feedback) return;
    const q = questions[questionIndex];
    const isCorrect = value === q.product;
    const addedPenalty = isCorrect ? 0 : PENALTY_MS;
    const answeredAtElapsed = Date.now() - raceStartAt;
    setSelectedChoice(value);
    setFeedback(isCorrect ? "correct" : "wrong");
    if (addedPenalty) setPenaltyMs((p) => p + addedPenalty);

    setTimeout(() => {
      const isLast = questionIndex + 1 >= questions.length;
      if (isLast) {
        const total = answeredAtElapsed + penaltyMs + addedPenalty;
        setFinalTimeMs(total);
        setPhase("result");
        if (!bestTimeMs || total < bestTimeMs) {
          localStorage.setItem(bestKey, String(Math.round(total)));
          setBestTimeMs(total);
        }
      } else {
        setQuestionIndex((i) => i + 1);
        setFeedback(null);
        setSelectedChoice(null);
      }
    }, 500);
  };

  const question = questions[questionIndex];
  const playerProgress = phase === "result" ? 1 : questionIndex / QUESTIONS_COUNT;
  const rank = finalTimeMs !== null ? rankFromTime(finalTimeMs, thresholds) : null;

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
            <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Estimation express
            </h1>
            <p className="text-sm mt-2" style={{ color: slate }}>
              10 calculs (+ − × ÷) avec de grands nombres, en QCM : trouve le bon ordre de grandeur sans poser
              l'opération. Astuce : arrondis chaque nombre à son chiffre le plus significatif, puis calcule.
            </p>
            <p className="text-sm mt-2" style={{ color: slate }}>
              Une bonne réponse te fait avancer, une erreur te fait chuter et ajoute {formatSeconds(PENALTY_MS)}s à ton
              temps.
            </p>
            <p className="text-sm mt-2" style={{ color: slate }}>
              Termine en moins de {formatSeconds(thresholds.gold)}s pour la 1ère place, {formatSeconds(thresholds.silver)}
              s pour la 2e, {formatSeconds(thresholds.bronze)}s pour la 3e.
            </p>
            {bestTimeMs && (
              <p className="text-xs mt-3 font-semibold" style={{ color: gold }}>
                Ton meilleur temps en {difficulty.label} sur cet appareil : {formatSeconds(bestTimeMs)}s
              </p>
            )}
          </div>

          <div className="rounded-3xl p-5 mb-4" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <p className="text-xs uppercase tracking-wide font-semibold mb-3" style={{ color: slate }}>
              Choisis ton niveau
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDifficulty(d.id)}
                  className="flex flex-col items-center gap-1 rounded-2xl py-3 px-1"
                  style={{
                    backgroundColor: selectedDifficulty === d.id ? `${gold}22` : paper,
                    border: selectedDifficulty === d.id ? `2px solid ${gold}` : "2px solid transparent",
                  }}
                >
                  <span className="text-sm font-bold" style={{ color: ink }}>
                    {d.label}
                  </span>
                  <span className="text-[0.65rem] text-center leading-tight" style={{ color: slate }}>
                    {formatSeconds(d.thresholds.gold)}/{formatSeconds(d.thresholds.silver)}/
                    {formatSeconds(d.thresholds.bronze)}s
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl p-5 mb-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <p className="text-xs uppercase tracking-wide font-semibold mb-3" style={{ color: slate }}>
              Choisis ton animal
            </p>
            <div className="grid grid-cols-4 gap-2">
              {ANIMALS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAnimal(a.id)}
                  className="flex flex-col items-center gap-1 rounded-2xl py-3"
                  style={{
                    backgroundColor: selectedAnimal === a.id ? `${gold}22` : paper,
                    border: selectedAnimal === a.id ? `2px solid ${gold}` : "2px solid transparent",
                  }}
                >
                  <span style={{ fontSize: "1.8rem" }}>{a.emoji}</span>
                  <span className="text-xs font-medium" style={{ color: ink }}>
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button onClick={startRace} className="w-full py-3.5 rounded-full font-bold text-lg" style={{ backgroundColor: gold, color: ink }}>
            C'est parti !
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------- RACING ---
  if (phase === "racing") {
    return (
      <div className="min-h-screen w-full p-4 sm:p-8 flex flex-col" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: slate }}>
              Question {questionIndex + 1} / {QUESTIONS_COUNT}
            </p>
            <p className="text-sm font-bold" style={{ fontFamily: fonts.mono, color: gold }}>
              {formatSeconds(nowMs + penaltyMs)}s
            </p>
          </div>

          <RaceTrack
            player={player}
            opponents={opponents}
            playerProgress={playerProgress}
            nowMs={nowMs}
            feedback={feedback}
            thresholds={thresholds}
          />

          <div className="game-question-stage flex-1 flex flex-col items-center justify-center text-center">
            <p
              style={{
                fontFamily: fonts.display,
                color: feedback === "wrong" ? colors.red : feedback === "correct" ? colors.green : ink,
                fontSize: "2.3rem",
                fontWeight: 800,
              }}
            >
              {question.exprStr}
            </p>
            <p className="text-xs mt-1" style={{ color: slate }}>
              ≈ ?
            </p>

            <div className="w-full max-w-[320px] mt-6 grid grid-cols-2 gap-3">
              {question.choices.map((value) => {
                const isCorrectChoice = value === question.product;
                let bg = colors.card;
                let border = colors.hairline;
                let textColor = ink;
                if (feedback) {
                  if (isCorrectChoice) {
                    bg = `${colors.green}22`;
                    border = colors.green;
                    textColor = colors.green;
                  } else if (value === selectedChoice) {
                    bg = `${colors.red}22`;
                    border = colors.red;
                    textColor = colors.red;
                  } else {
                    border = colors.hairline;
                  }
                }
                return (
                  <button
                    key={value}
                    onClick={() => handleChoice(value)}
                    disabled={!!feedback}
                    className="text-xl font-bold rounded-2xl py-4"
                    style={{
                      fontFamily: fonts.mono,
                      backgroundColor: bg,
                      color: textColor,
                      boxShadow: `0 0 0 2px ${border}`,
                      opacity: feedback && !isCorrectChoice && value !== selectedChoice ? 0.5 : 1,
                    }}
                  >
                    {formatNumber(value)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------- RESULT ---
  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
      <div className="game-result-card max-w-md mx-auto text-center">
        <RaceTrack
          player={player}
          opponents={opponents}
          playerProgress={playerProgress}
          nowMs={nowMs}
          feedback={feedback}
          thresholds={thresholds}
        />

        <p style={{ fontFamily: fonts.display, color: rank.color, fontSize: "1.8rem", fontWeight: 800 }}>{rank.label}</p>
        <p className="text-sm mt-2" style={{ color: slate }}>
          Niveau {difficulty.label} — Temps final : <strong style={{ color: ink }}>{formatSeconds(finalTimeMs)}s</strong>
          {penaltyMs > 0 && ` (dont ${formatSeconds(penaltyMs)}s de pénalités)`}
        </p>
        {bestTimeMs && (
          <p className="text-xs mt-1" style={{ color: gold }}>
            Meilleur temps en {difficulty.label} sur cet appareil : {formatSeconds(bestTimeMs)}s
          </p>
        )}

        <div className="flex flex-col gap-2.5 mt-8">
          <button onClick={startRace} className="w-full py-3 rounded-full font-bold text-lg" style={{ backgroundColor: gold, color: ink }}>
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
