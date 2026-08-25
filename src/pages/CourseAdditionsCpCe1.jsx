import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, shadow } from "../theme";
import RaceTrackRank from "../components/RaceTrackRank";
import NumberPad from "../components/NumberPad";
import { generateAdditionQuestion } from "../lib/primaryGameUtils";

// ---------------------------------------------------------------------------
// Jeu "Course des additions" (/jeux/course-additions-cp-ce1) — pensé pour les
// CP/CE1, avec un mécanisme différent des autres jeux de course de l'onglet
// Jeux (Course aux tables, Estimation express) qui reposent sur un chrono
// comparé à des seuils. Ici (demande explicite de Romain) :
//
//   - Additions de deux entiers naturels dont AUCUN terme ne dépasse 20.
//   - Réponse TAPÉE au clavier numérique tactile (NumberPad.jsx), pas de QCM
//     — pour vraiment travailler le calcul plutôt que reconnaître la bonne
//     réponse parmi 4.
//   - On avance seulement en cas de bonne réponse : l'avancement commun
//     affiché (même vitesse pour tout le monde, voir RaceTrackRank.jsx) suit
//     le nombre de bonnes réponses, pas un chrono qui défile.
//   - Fin de partie dès 6 bonnes réponses (peu importe le nombre d'erreurs
//     commises en chemin, il n'y a pas de limite de questions).
//   - Classement : le joueur reste en tête tant qu'il répond juste (rang
//     inchangé) ; une erreur fait doubler un personnage (rang +1, jusqu'à
//     4e) ; répondre juste en moins de 5s fait au contraire doubler un
//     personnage dans l'autre sens (rang -1, jusqu'à 1er) — ce bonus compte
//     aussi dans le classement final (validé avec Romain), donc un enfant
//     qui fait quelques erreurs mais répond souvent très vite peut quand
//     même terminer 1er. Volontairement, cette règle n'est PAS expliquée
//     dans le texte affiché à l'enfant (demande explicite) : seule
//     l'animation de la course (médaille de position en temps réel) la rend
//     perceptible.
// ---------------------------------------------------------------------------

const ANIMALS = [
  { id: "lapin", emoji: "🐇", label: "Lapin" },
  { id: "renard", emoji: "🦊", label: "Renard" },
  { id: "tortue", emoji: "🐢", label: "Tortue" },
  { id: "grenouille", emoji: "🐸", label: "Grenouille" },
];

const TARGET_CORRECT = 6;
const BONUS_THRESHOLD_MS = 5000;
const BEST_RANK_KEY = "reussimaths_course_additions_cpce1_best_rank";
const BEST_MISTAKES_KEY = "reussimaths_course_additions_cpce1_best_mistakes";

const RANK_INFO = {
  1: { label: "1er — bravo !", color: colors.gold },
  2: { label: "2e — pas mal !", color: colors.slate },
  3: { label: "3e — presque !", color: "#a3762a" },
  4: { label: "4e — retente ta chance !", color: colors.red },
};

export default function CourseAdditionsCpCe1({ level = "cp" }) {
  const isCp = level === "cp";
  const maxSum = isCp ? 20 : null;
  const gamesPath = isCp ? "/jeux/cp" : "/jeux/ce1";
  const bestRankKey = `${BEST_RANK_KEY}_${level}`;
  const bestMistakesKey = `${BEST_MISTAKES_KEY}_${level}`;
  const [phase, setPhase] = useState("intro"); // intro | racing | result
  const [selectedAnimal, setSelectedAnimal] = useState(ANIMALS[0].id);
  const [question, setQuestion] = useState(null);
  const [typedValue, setTypedValue] = useState("");
  const [feedback, setFeedback] = useState(null); // "correct" | "bonus" | "wrong" | null
  const [locked, setLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [rank, setRank] = useState(1);
  const [finalRank, setFinalRank] = useState(null);
  const [isNewBestRank, setIsNewBestRank] = useState(false);
  const [isNewBestMistakes, setIsNewBestMistakes] = useState(false);
  const questionStartAtRef = useRef(null);

  const [bestRank, setBestRank] = useState(() => {
    const stored = Number(localStorage.getItem(bestRankKey));
    return stored >= 1 && stored <= 4 ? stored : null;
  });
  const [bestMistakes, setBestMistakes] = useState(() => {
    const stored = localStorage.getItem(bestMistakesKey);
    return stored !== null ? Number(stored) : null;
  });

  const opponents = useMemo(() => ANIMALS.filter((a) => a.id !== selectedAnimal), [selectedAnimal]);
  const player = ANIMALS.find((a) => a.id === selectedAnimal);

  const startRace = () => {
    setQuestion(generateAdditionQuestion(null, { maxSum }));
    setTypedValue("");
    setFeedback(null);
    setLocked(false);
    setCorrectCount(0);
    setMistakes(0);
    setRank(1);
    setFinalRank(null);
    setIsNewBestRank(false);
    setIsNewBestMistakes(false);
    questionStartAtRef.current = Date.now();
    setPhase("racing");
  };

  const handleDigit = (d) => {
    if (locked) return;
    setTypedValue((v) => (v.length >= 2 ? v : v + d));
  };
  const handleBackspace = () => {
    if (locked) return;
    setTypedValue((v) => v.slice(0, -1));
  };

  const handleSubmit = () => {
    if (locked || typedValue === "") return;
    const value = Number(typedValue);
    const isCorrect = value === question.sum;
    const elapsed = Date.now() - questionStartAtRef.current;
    const isFinishing = isCorrect && correctCount + 1 >= TARGET_CORRECT;

    let newRank = rank;
    let fb;
    if (isCorrect) {
      if (elapsed < BONUS_THRESHOLD_MS) {
        newRank = Math.max(1, rank - 1);
        fb = "bonus";
      } else {
        fb = "correct";
      }
    } else {
      newRank = Math.min(4, rank + 1);
      fb = "wrong";
    }

    setLocked(true);
    setFeedback(fb);
    setRank(newRank);

    const delay = fb === "wrong" ? 900 : fb === "bonus" ? 750 : 500;
    setTimeout(() => {
      if (isCorrect) setCorrectCount((c) => c + 1);
      else setMistakes((m) => m + 1);

      if (isFinishing) {
        setFinalRank(newRank);
        setPhase("result");

        const storedRank = Number(localStorage.getItem(bestRankKey));
        if (!storedRank || newRank < storedRank) {
          localStorage.setItem(bestRankKey, String(newRank));
          setBestRank(newRank);
          setIsNewBestRank(true);
        }
        const storedMistakes = localStorage.getItem(bestMistakesKey);
        if (storedMistakes === null || mistakes < Number(storedMistakes)) {
          localStorage.setItem(bestMistakesKey, String(mistakes));
          setBestMistakes(mistakes);
          setIsNewBestMistakes(true);
        }
      } else {
        setQuestion((prev) => generateAdditionQuestion(prev, { maxSum }));
        setTypedValue("");
        setFeedback(null);
        setLocked(false);
        questionStartAtRef.current = Date.now();
      }
    }, delay);
  };

  // Valider avec la touche Entrée si un clavier physique est utilisé.
  useEffect(() => {
    if (phase !== "racing") return;
    const onKeyDown = (e) => {
      if (e.key === "Enter") handleSubmit();
      else if (e.key === "Backspace") handleBackspace();
      else if (/^[0-9]$/.test(e.key)) handleDigit(e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, typedValue, locked, question, rank, correctCount, mistakes]);

  const ink = colors.ink;
  const paper = colors.bg;
  const slate = colors.slate;
  const gold = colors.gold;
  const progress = correctCount / TARGET_CORRECT;

  // -------------------------------------------------------------- INTRO ---
  if (phase === "intro") {
    return (
      <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="max-w-md mx-auto">
          <Link to={gamesPath} className="text-sm font-medium" style={{ color: ink }}>
            ← Jeux {isCp ? "CP" : "CE1"}
          </Link>

          <div className="game-intro-hero text-center my-7">
            <span
              className="inline-block text-xs font-bold uppercase tracking-wide rounded-full px-3 py-1 mb-3"
              style={{ backgroundColor: `${colors.green}22`, color: colors.green }}
            >
              Jeu pour les {isCp ? "CP" : "CE1"}
            </span>
            <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Course des additions
            </h1>
            {isCp ? (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm font-black" style={{ color: ink }} aria-label="Calcule, réponds, ton animal avance">
                <span>🧮 Calcule</span><span aria-hidden="true">→</span><span>🔢 Réponds</span><span aria-hidden="true">→</span><span>🐇 Avance</span>
              </div>
            ) : (
              <p className="text-sm mt-2" style={{ color: slate }}>
                Calcule, tape ta réponse et reste devant jusqu'à l'arrivée. Les additions peuvent dépasser 20.
              </p>
            )}
            <p className="text-xs mt-3" style={{ color: slate }}>{TARGET_CORRECT} bonnes réponses pour finir la course.</p>
            {bestRank && (
              <p className="text-xs mt-3 font-semibold" style={{ color: gold }}>
                Ton meilleur classement : {RANK_INFO[bestRank].label}
                {bestMistakes !== null ? ` (${bestMistakes} erreur${bestMistakes > 1 ? "s" : ""})` : ""}
              </p>
            )}
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
  if (phase === "racing" && question) {
    return (
      <div className="min-h-screen w-full p-4 sm:p-8 flex flex-col" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
          <Link to={gamesPath} className="mb-3 text-sm font-medium" style={{ color: slate }}>
            ← Jeux {isCp ? "CP" : "CE1"}
          </Link>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: slate }}>
              {correctCount} / {TARGET_CORRECT} bonnes réponses
            </p>
          </div>

          <RaceTrackRank player={player} opponents={opponents} progress={progress} rank={rank} feedback={feedback} />

          <div className="game-question-stage flex-1 flex flex-col items-center justify-center text-center">
            <p
              style={{
                fontFamily: fonts.display,
                color: feedback === "wrong" ? colors.red : feedback ? colors.green : ink,
                fontSize: "3rem",
                fontWeight: 800,
              }}
            >
              {question.a} + {question.b}
            </p>

            <div
              className="mt-4 mb-6 rounded-2xl px-8 py-3 text-3xl font-bold"
              style={{
                fontFamily: fonts.mono,
                minWidth: 90,
                backgroundColor: colors.card,
                boxShadow: `0 0 0 2px ${feedback === "wrong" ? colors.red : feedback ? colors.green : colors.hairline}`,
                color:
                  feedback === "wrong" ? colors.red : feedback ? colors.green : typedValue ? ink : colors.slate,
              }}
            >
              {feedback && feedback !== "wrong" ? question.sum : typedValue || "?"}
              {feedback === "wrong" && (
                <span className="block text-sm mt-1" style={{ color: slate }}>
                  Réponse : {question.sum}
                </span>
              )}
            </div>

            <NumberPad value={typedValue} maxLength={2} disabled={locked} onDigit={handleDigit} onBackspace={handleBackspace} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------- RESULT ---
  const info = RANK_INFO[finalRank] ?? RANK_INFO[4];
  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
      <div className="game-result-card max-w-md mx-auto text-center">
        <RaceTrackRank player={player} opponents={opponents} progress={1} rank={finalRank} feedback={null} />

        <p style={{ fontFamily: fonts.display, color: info.color, fontSize: "1.8rem", fontWeight: 800 }}>{info.label}</p>
        <p className="text-sm mt-2" style={{ color: slate }}>
          {mistakes === 0 ? "Aucune erreur, bravo !" : `${mistakes} erreur${mistakes > 1 ? "s" : ""} pendant la course.`}
        </p>
        {(isNewBestRank || isNewBestMistakes) && (
          <p className="text-sm mt-2 font-semibold" style={{ color: colors.green }}>
            Nouveau record !
          </p>
        )}
        {bestRank && (
          <p className="text-xs mt-1" style={{ color: gold }}>
            Meilleur classement : {RANK_INFO[bestRank].label}
            {bestMistakes !== null ? ` (${bestMistakes} erreur${bestMistakes > 1 ? "s" : ""})` : ""}
          </p>
        )}

        <div className="flex flex-col gap-2.5 mt-8">
          <button onClick={startRace} className="w-full py-3 rounded-full font-bold text-lg" style={{ backgroundColor: gold, color: ink }}>
            Rejouer
          </button>
          <Link to={gamesPath} className="text-sm font-medium py-2" style={{ color: slate }}>
            ← Retour aux jeux {isCp ? "CP" : "CE1"}
          </Link>
        </div>
      </div>
    </div>
  );
}
