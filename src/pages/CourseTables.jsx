import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, shadow } from "../theme";

// ---------------------------------------------------------------------------
// Jeu "Course aux tables" (/jeux/course-tables) : course entre 4 animaux
// (l'utilisateur + 3 adversaires), sur les tables de multiplication de 1 à
// 10. Gratuit, sans connexion (voir Jeux.jsx).
//
// Mécanique (validée avec Romain, v2 après retour terrain) :
//   - 10 questions, tirées sans remise parmi les 100 combinaisons a×b
//     (a, b ∈ [1, 10]).
//   - Réponse au clavier numérique remplacée par un QCM à 4 choix (1 seule
//     bonne réponse) : trop lent d'écrire/valider au clavier pour tenir les
//     temps visés, un tap sur la bonne carte est beaucoup plus rapide.
//   - Bonne réponse : petite animation "boost", question suivante.
//   - Mauvaise réponse : animation "chute" + pénalité fixe (PENALTY_MS)
//     ajoutée au temps total, question suivante quand même (jamais bloqué
//     sur une question). La bonne réponse est révélée en vert.
//   - Temps final = temps réel écoulé jusqu'à la 10e réponse + somme des
//     pénalités.
//   - Trois niveaux de jeu, choisis avant de lancer la course, chacun avec
//     ses propres seuils de classement (1er / 2e / 3e en secondes) :
//       Expert   : 10s / 12s / 14s  (seuils d'origine, jugés trop rapides
//                  une fois testés au clavier texte — restent pertinents
//                  maintenant que la saisie QCM est beaucoup plus rapide)
//       Moyen    : 15s / 17s / 19s
//       Débutant : 20s / 24s / 28s
//
// Animation : les 3 adversaires avancent à VITESSE CONSTANTE en temps réel
// (ils franchissent la ligne d'arrivée à 10s / 12s / 14s pile, ou aux seuils
// du niveau choisi) — c'est ce qui donne le sentiment de course et la
// pression du chrono. Le joueur, lui, avance par palier à chaque question
// répondue (10 paliers de 10% de la piste), avec une transition CSS
// adoucie pour un mouvement fluide — sa position ne sert qu'à l'ambiance,
// seul le temps final compte pour le classement.
//
// Aucune sauvegarde compte (jeu ouvert à tous, sans connexion) : seul le
// meilleur temps est gardé en localStorage sur cet appareil, par niveau de
// difficulté (un bon temps en Débutant n'écrase pas le record Expert).
// ---------------------------------------------------------------------------

const ANIMALS = [
  { id: "lapin", emoji: "🐇", label: "Lapin" },
  { id: "renard", emoji: "🦊", label: "Renard" },
  { id: "tortue", emoji: "🐢", label: "Tortue" },
  { id: "grenouille", emoji: "🐸", label: "Grenouille" },
];

const DIFFICULTIES = [
  { id: "expert", label: "Expert", thresholds: { gold: 10000, silver: 12000, bronze: 14000 } },
  { id: "moyen", label: "Moyen", thresholds: { gold: 15000, silver: 17000, bronze: 19000 } },
  { id: "debutant", label: "Débutant", thresholds: { gold: 20000, silver: 24000, bronze: 28000 } },
];

const PENALTY_MS = 1500;
const QUESTIONS_COUNT = 10;
const BEST_KEY_PREFIX = "reussimaths_course_tables_best_ms_";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Génère 3 réponses plausibles mais fausses (erreurs de table classiques :
// se tromper d'un cran sur un des deux facteurs) pour accompagner la bonne
// réponse dans le QCM.
function generateChoices(q) {
  const correct = q.product;
  const pool = shuffle(
    [
      correct + q.a,
      correct - q.a,
      correct + q.b,
      correct - q.b,
      correct + 10,
      correct - 10,
      (q.a + 1) * q.b,
      q.a * (q.b + 1),
      (q.a - 1) * q.b,
      q.a * (q.b - 1),
    ].filter((n) => n > 0 && n !== correct)
  );
  const distractors = [];
  for (const n of pool) {
    if (distractors.length >= 3) break;
    if (!distractors.includes(n)) distractors.push(n);
  }
  while (distractors.length < 3) {
    const n = correct + Math.floor(Math.random() * 20) - 10;
    if (n > 0 && n !== correct && !distractors.includes(n)) distractors.push(n);
  }
  return shuffle([correct, ...distractors]);
}

function generateQuestions() {
  const all = [];
  for (let a = 1; a <= 10; a++) {
    for (let b = 1; b <= 10; b++) all.push({ a, b, product: a * b });
  }
  return shuffle(all)
    .slice(0, QUESTIONS_COUNT)
    .map((q) => ({ ...q, choices: generateChoices(q) }));
}

function formatSeconds(ms) {
  return (ms / 1000).toFixed(1).replace(".", ",");
}

function rankFromTime(ms, thresholds) {
  if (ms <= thresholds.gold) return { place: 1, label: "1er — bravo !", color: colors.gold };
  if (ms <= thresholds.silver) return { place: 2, label: "2e — pas mal !", color: colors.slate };
  if (ms <= thresholds.bronze) return { place: 3, label: "3e — presque !", color: "#a3762a" };
  return { place: null, label: "Perdu — retente ta chance !", color: colors.red };
}

// Piste de course, définie au niveau du module (PAS imbriquée dans
// CourseTables) : une fonction composant redéfinie à chaque rendu du parent
// serait vue par React comme un type de composant différent à chaque fois,
// forçant un démontage/remontage complet du DOM à chaque rendu — ce qui
// casserait purement et simplement la transition CSS "left" (l'animation a
// besoin que ce soit le MÊME élément DOM qui change de position).
function RaceTrack({ player, opponents, playerProgress, nowMs, feedback, thresholds }) {
  const gold = colors.gold;
  const lanes = [
    { animal: player, isPlayer: true, durationMs: null },
    { animal: opponents[0], isPlayer: false, durationMs: thresholds.gold },
    { animal: opponents[1], isPlayer: false, durationMs: thresholds.silver },
    { animal: opponents[2], isPlayer: false, durationMs: thresholds.bronze },
  ];
  return (
    <div className="flex flex-col gap-3 mb-6">
      {lanes.map((lane, i) => {
        const progress = lane.isPlayer ? playerProgress : Math.min(nowMs / lane.durationMs, 1);
        return (
          <div key={i} className="relative" style={{ height: 34 }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: lane.isPlayer ? `${gold}14` : colors.hairline }}
            />
            <div
              className="absolute top-1/2"
              style={{
                left: `calc(${progress * 100}% - ${progress * 30}px)`,
                transform: "translateY(-50%)",
                transition: lane.isPlayer ? "left 0.4s ease" : "left 0.1s linear",
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  animation:
                    lane.isPlayer && feedback === "wrong"
                      ? "course-stumble 0.5s ease"
                      : lane.isPlayer && feedback === "correct"
                      ? "course-boost 0.5s ease"
                      : "none",
                }}
              >
                {lane.animal.emoji}
              </span>
            </div>
            <div className="absolute top-1/2 right-1" style={{ transform: "translateY(-50%)", fontSize: "0.9rem" }}>
              🏁
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes course-stumble {
          0% { transform: translateY(-50%) rotate(0deg); }
          30% { transform: translateY(-30%) rotate(-25deg); }
          60% { transform: translateY(-50%) rotate(10deg); }
          100% { transform: translateY(-50%) rotate(0deg); }
        }
        @keyframes course-boost {
          0% { transform: translateY(-50%) scale(1); }
          40% { transform: translateY(-65%) scale(1.3); }
          100% { transform: translateY(-50%) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default function CourseTables() {
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
  // Le record affiché dépend du niveau choisi (chaque niveau a son propre
  // classement) : on relit localStorage à chaque changement de niveau.
  useEffect(() => {
    const stored = Number(localStorage.getItem(bestKey));
    setBestTimeMs(stored > 0 ? stored : null);
  }, [bestKey]);

  const opponents = useMemo(() => ANIMALS.filter((a) => a.id !== selectedAnimal), [selectedAnimal]);
  const player = ANIMALS.find((a) => a.id === selectedAnimal);

  // Chrono temps réel, utilisé pour l'affichage et pour faire avancer les 3
  // adversaires à vitesse constante — indépendant des réponses du joueur.
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
    // Capturé immédiatement (pas après le délai d'animation ci-dessous) :
    // le temps final doit correspondre au moment réel de la réponse, pas au
    // moment où l'animation de feedback se termine 500ms plus tard.
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
            <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Course aux tables
            </h1>
            <p className="text-sm mt-2" style={{ color: slate }}>
              10 questions sur les tables de multiplication (1 à 10), en QCM. Une bonne réponse te fait avancer, une
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
              {question.a} × {question.b}
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
