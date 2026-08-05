import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, shadow } from "../theme";
import RaceTrack from "../components/RaceTrack";
import { shuffle, formatSeconds, rankFromTime } from "../lib/gameUtils";

// ---------------------------------------------------------------------------
// Jeu "Course des additions" (/jeux/course-additions-cp-ce1) : même moteur de
// course que Course aux tables / Estimation express (RaceTrack.jsx +
// gameUtils.js partagés), mais pensé pour les CP / CE1 (voir Memory CP/CE1,
// MemoryCpCe1.jsx, pour le même repère de niveau) : additions de deux nombres
// entiers naturels entre 1 et 20, en QCM à 4 choix.
//
// Seuils de temps volontairement plus généreux que les autres jeux de course
// (public plus jeune, lecture et repérage plus lents) :
//   Expert       : 20s / 24s / 28s
//   Intermédiaire: 26s / 30s / 34s
//   Débutant     : 32s / 36s / 40s
// ---------------------------------------------------------------------------

const ANIMALS = [
  { id: "lapin", emoji: "🐇", label: "Lapin" },
  { id: "renard", emoji: "🦊", label: "Renard" },
  { id: "tortue", emoji: "🐢", label: "Tortue" },
  { id: "grenouille", emoji: "🐸", label: "Grenouille" },
];

const DIFFICULTIES = [
  { id: "expert", label: "Expert", thresholds: { gold: 20000, silver: 24000, bronze: 28000 } },
  { id: "moyen", label: "Intermédiaire", thresholds: { gold: 26000, silver: 30000, bronze: 34000 } },
  { id: "debutant", label: "Débutant", thresholds: { gold: 32000, silver: 36000, bronze: 40000 } },
];

const PENALTY_MS = 1500;
const QUESTIONS_COUNT = 10;
const BEST_KEY_PREFIX = "reussimaths_course_additions_cpce1_best_ms_";

// Génère 3 réponses plausibles mais fausses : erreurs classiques d'un enfant
// qui compte sur ses doigts (décalage de 1 ou 2 sur le résultat, ou confusion
// avec l'un des deux termes).
function generateChoices(q) {
  const correct = q.sum;
  const pool = shuffle(
    [
      correct + 1,
      correct - 1,
      correct + 2,
      correct - 2,
      correct + 10,
      correct - 10,
      q.a,
      q.b,
      q.a * q.b <= 40 ? q.a * q.b : correct + 3,
    ].filter((n) => n > 0 && n !== correct)
  );
  const distractors = [];
  for (const n of pool) {
    if (distractors.length >= 3) break;
    if (!distractors.includes(n)) distractors.push(n);
  }
  while (distractors.length < 3) {
    const n = correct + Math.floor(Math.random() * 8) - 4;
    if (n > 0 && n !== correct && !distractors.includes(n)) distractors.push(n);
  }
  return shuffle([correct, ...distractors]);
}

function generateQuestions() {
  const all = [];
  for (let a = 1; a <= 20; a++) {
    for (let b = 1; b <= 20; b++) all.push({ a, b, sum: a + b });
  }
  return shuffle(all)
    .slice(0, QUESTIONS_COUNT)
    .map((q) => ({ ...q, choices: generateChoices(q) }));
}

export default function CourseAdditionsCpCe1() {
  const [phase, setPhase] = useState("intro"); // intro | racing | result
  const [selectedAnimal, setSelectedAnimal] = useState(ANIMALS[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTIES[1].id); // "moyen" par défaut
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
    const isCorrect = value === q.sum;
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

          <div className="text-center my-7">
            <span
              className="inline-block text-xs font-bold uppercase tracking-wide rounded-full px-3 py-1 mb-3"
              style={{ backgroundColor: `${colors.green}22`, color: colors.green }}
            >
              Jeu pour les CP / CE1
            </span>
            <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Course des additions
            </h1>
            <p className="text-sm mt-2" style={{ color: slate }}>
              10 questions d'addition avec des nombres entre 1 et 20, en QCM. Une bonne réponse te fait avancer, une
              erreur te fait chuter et ajoute {formatSeconds(PENALTY_MS)}s à ton temps.
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

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p
              style={{
                fontFamily: fonts.display,
                color: feedback === "wrong" ? colors.red : feedback === "correct" ? colors.green : ink,
                fontSize: "3rem",
                fontWeight: 800,
              }}
            >
              {question.a} + {question.b}
            </p>

            <div className="w-full max-w-[320px] mt-6 grid grid-cols-2 gap-3">
              {question.choices.map((value) => {
                const isCorrectChoice = value === question.sum;
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
                    className="text-2xl font-bold rounded-2xl py-4"
                    style={{
                      fontFamily: fonts.mono,
                      backgroundColor: bg,
                      color: textColor,
                      boxShadow: `0 0 0 2px ${border}`,
                      opacity: feedback && !isCorrectChoice && value !== selectedChoice ? 0.5 : 1,
                    }}
                  >
                    {value}
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
      <div className="max-w-md mx-auto text-center">
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
