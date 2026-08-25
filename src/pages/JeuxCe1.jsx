import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bot, Brain, ChevronRight, Delete, Flag, Pizza, Play, Trophy, Undo2 } from "lucide-react";
import { colors, fonts, shadow } from "../theme";
import { shuffle } from "../lib/gameUtils";

const GAME_CARDS = [
  { id: "thousand", title: "La course à 1 000", description: "Retrouve les différentes écritures d’un nombre.", icon: Flag, accent: "#1565c0" },
  { id: "pizza", title: "La pizzeria des fractions", description: "Observe les parts et complète les pizzas.", icon: Pizza, accent: "#d81b60" },
  { id: "robot", title: "Le robot livreur", description: "Programme le chemin jusqu’au colis.", icon: Bot, accent: "#00897b" },
  { id: "mental", title: "Le défi calcul mental", description: "Résous 10 calculs variés sans les poser.", icon: Brain, accent: "#ef6c00" },
];

function GameShell({ title, accent, onBack, children }) {
  return <div className="min-h-screen p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}><div className="mx-auto max-w-2xl"><button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: colors.slate }}><ArrowLeft size={16}/> Jeux CE1</button><div className="mt-5 rounded-[2rem] p-5 sm:p-8" style={{ backgroundColor: colors.card, borderTop: `5px solid ${accent}`, boxShadow: shadow.raised }}><h1 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: fonts.display, color: colors.ink }}>{title}</h1>{children}</div></div></div>;
}

function FinishCard({ score, total, restart, back }) {
  return <div className="py-8 text-center"><Trophy size={52} className="mx-auto" color={colors.gold}/><p className="mt-4 text-3xl font-black" style={{ color: colors.ink }}>{score} / {total}</p><p className="mt-2 text-sm" style={{ color: colors.slate }}>{score === total ? "Parfait !" : score >= total * .7 ? "Bravo, tu progresses !" : "Bien joué ! Recommence pour battre ton score."}</p><div className="mt-7 grid gap-2 sm:grid-cols-2"><button onClick={restart} className="rounded-full py-3 font-black" style={{ backgroundColor: colors.gold, color: colors.ink }}>Rejouer</button><button onClick={back} className="rounded-full py-3 font-bold" style={{ border: `1px solid ${colors.hairline}`, color: colors.slate }}>Autre jeu CE1</button></div></div>;
}

function makeNumberQuestion() {
  const number = 100 + Math.floor(Math.random() * 900);
  const hundreds = Math.floor(number / 100), tens = Math.floor(number / 10) % 10, units = number % 10;
  const mode = Math.floor(Math.random() * 2);
  const representation = (value) => `${Math.floor(value / 100)} centaines, ${Math.floor(value / 10) % 10} dizaines et ${value % 10} unités`;
  const correct = mode === 0 ? String(number) : representation(number);
  const options = new Set([correct]);
  while (options.size < 4) {
    const candidate = Math.max(100, Math.min(999, number + shuffle([-100, -10, -1, 1, 10, 100])[0]));
    options.add(mode === 0 ? String(candidate) : representation(candidate));
  }
  return { prompt: mode === 0 ? `${hundreds} centaines, ${tens} dizaines et ${units} unités` : String(number), correct, options: shuffle([...options]) };
}

function QuizGame({ type, onBack }) {
  const total = 8;
  const makeQuestion = type === "number" ? makeNumberQuestion : makeFractionQuestion;
  const [question, setQuestion] = useState(makeQuestion);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const restart = () => { setQuestion(makeQuestion()); setRound(1); setScore(0); setFeedback(null); };
  const answer = (option) => {
    if (feedback) return;
    const correct = option === question.correct;
    if (correct) setScore((value) => value + 1);
    setFeedback(correct ? (type === "number" ? "Bravo !" : "Commande réussie !") : `La bonne réponse était ${question.correct}.`);
    window.setTimeout(() => { setRound((value) => value + 1); setQuestion(makeQuestion()); setFeedback(null); }, 950);
  };
  const numberGame = type === "number";
  const accent = numberGame ? "#1565c0" : "#d81b60";
  const title = numberGame ? "La course à 1 000" : "La pizzeria des fractions";
  return <GameShell title={title} accent={accent} onBack={onBack}>{round > total ? <FinishCard score={score} total={total} restart={restart} back={onBack}/> : <><p className="mt-2 text-sm" style={{ color: colors.slate }}>{numberGame ? "Associe le nombre à son écriture en centaines, dizaines et unités." : "Compte les parts égales avant de choisir ta réponse."}</p><div className="mt-5 flex justify-between text-xs font-bold" style={{ color: colors.slate }}><span>{numberGame ? "Étape" : "Commande"} {round} / {total}</span><span>{score} point{score > 1 ? "s" : ""}</span></div>{numberGame ? <p className="my-8 text-center text-2xl sm:text-3xl font-black" style={{ color: colors.ink }}>{question.prompt}</p> : <><p className="mt-6 text-center text-lg font-black" style={{ color: colors.ink }}>{question.prompt}</p><PizzaPicture numerator={question.numerator} denominator={question.denominator}/></>}<div className={`grid gap-2 ${numberGame ? "sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>{question.options.map((option) => <button key={option} onClick={() => answer(option)} className="min-h-14 rounded-2xl p-3 text-sm font-black" style={{ backgroundColor: colors.bg, border: `2px solid ${colors.hairline}`, color: colors.ink }}>{option}</button>)}</div><p aria-live="polite" className="mt-4 min-h-6 text-center text-sm font-black" style={{ color: feedback?.includes("Bravo") || feedback?.includes("réussie") ? colors.green : colors.red }}>{feedback}</p></>}</GameShell>;
}

function PizzaPicture({ numerator, denominator }) {
  const size = 150, center = size / 2, radius = size * .43;
  const paths = Array.from({ length: denominator }, (_, index) => {
    const start = -Math.PI / 2 + index * 2 * Math.PI / denominator, end = -Math.PI / 2 + (index + 1) * 2 * Math.PI / denominator;
    return `M ${center} ${center} L ${center + radius * Math.cos(start)} ${center + radius * Math.sin(start)} A ${radius} ${radius} 0 0 1 ${center + radius * Math.cos(end)} ${center + radius * Math.sin(end)} Z`;
  });
  return <svg width={size} height={size} role="img" aria-label={`${numerator} parts colorées sur ${denominator}`} className="mx-auto"><circle cx={center} cy={center} r={radius + 5} fill="#d99a38"/>{paths.map((path, index) => <path key={path} d={path} fill={index < numerator ? "#ef5350" : "#fff4d6"} stroke="#8d4d20" strokeWidth="2"/>)}</svg>;
}

function makeFractionQuestion() {
  const denominator = shuffle([2, 3, 4, 5, 6, 8, 10])[0], numerator = 1 + Math.floor(Math.random() * (denominator - 1)), complement = Math.random() < .45;
  const answerNumerator = complement ? denominator - numerator : numerator;
  const correct = `${answerNumerator}/${denominator}`;
  const options = new Set([correct]);
  const distractors = [
    `${Math.min(denominator, answerNumerator + 1)}/${denominator}`,
    `${Math.max(1, answerNumerator - 1)}/${denominator}`,
    `${denominator}/${denominator}`,
    "1/2", "1/3", "1/4", "2/3", "3/4", "2/5", "4/5",
  ];
  for (const distractor of distractors) if (options.size < 4) options.add(distractor);
  return { numerator, denominator, correct, options: shuffle([...options]), prompt: complement ? "Quelle fraction manque pour compléter la pizza ?" : "Quelle fraction de la pizza est rouge ?" };
}

function makeMentalQuestion() {
  const mode = Math.floor(Math.random() * 6);
  if (mode === 0) { const a = 20 + Math.floor(Math.random() * 70), b = 1 + Math.floor(Math.random() * 9); return { prompt: `${a} + ${b}`, answer: a + b, skill: "Addition rapide" }; }
  if (mode === 1) { const a = 30 + Math.floor(Math.random() * 70), b = 1 + Math.floor(Math.random() * Math.min(20, a)); return { prompt: `${a} − ${b}`, answer: a - b, skill: "Soustraction rapide" }; }
  if (mode === 2) { const a = 1 + Math.floor(Math.random() * 9); return { prompt: `${a} + ? = 10`, answer: 10 - a, skill: "Complément à 10" }; }
  if (mode === 3) { const a = 2 + Math.floor(Math.random() * 39); return { prompt: `Le double de ${a}`, answer: 2 * a, skill: "Les doubles" }; }
  if (mode === 4) { const answer = 2 + Math.floor(Math.random() * 39); return { prompt: `La moitié de ${2 * answer}`, answer, skill: "Les moitiés" }; }
  const factor = shuffle([2, 5, 10])[0], a = 1 + Math.floor(Math.random() * 10);
  return { prompt: `${factor} × ${a}`, answer: factor * a, skill: `Table de ${factor}` };
}

function MentalGame({ onBack }) {
  const total = 10;
  const [question, setQuestion] = useState(makeMentalQuestion);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState(null);
  const restart = () => { setQuestion(makeMentalQuestion()); setRound(1); setScore(0); setValue(""); setFeedback(null); };
  const submit = () => {
    if (!value || feedback) return;
    const correct = Number(value) === question.answer;
    if (correct) setScore((current) => current + 1);
    setFeedback(correct ? "Bonne réponse !" : `La réponse était ${question.answer}.`);
    window.setTimeout(() => { setRound((current) => current + 1); setQuestion(makeMentalQuestion()); setValue(""); setFeedback(null); }, 950);
  };
  return <GameShell title="Le défi calcul mental" accent="#ef6c00" onBack={onBack}>{round > total ? <FinishCard score={score} total={total} restart={restart} back={onBack}/> : <>
    <p className="mt-2 text-sm" style={{ color: colors.slate }}>Réponds sans poser le calcul. Chaque bonne réponse rapporte une étoile.</p>
    <div className="mt-5 flex justify-between text-xs font-bold" style={{ color: colors.slate }}><span>Calcul {round} / {total}</span><span>⭐ {score}</span></div>
    <div className="mt-6 rounded-3xl p-6 text-center" style={{ backgroundColor: `${colors.gold}16` }}><p className="text-xs font-black uppercase tracking-wider" style={{ color: "#b45309" }}>{question.skill}</p><p className="mt-3 text-3xl font-black" style={{ fontFamily: fonts.mono, color: colors.ink }}>{question.prompt}</p><div className="mx-auto mt-5 flex h-14 max-w-48 items-center justify-center rounded-2xl text-2xl font-black" style={{ backgroundColor: colors.card, border: `2px solid ${feedback ? colors.hairline : colors.gold}`, color: colors.ink }}>{value || "?"}</div></div>
    <div className="mx-auto mt-4 grid max-w-xs grid-cols-3 gap-2">{[1,2,3,4,5,6,7,8,9,"⌫",0,"OK"].map((key) => <button key={key} disabled={!!feedback} onClick={() => { if (key === "⌫") setValue((current) => current.slice(0, -1)); else if (key === "OK") submit(); else setValue((current) => current.length < 3 ? `${current}${key}` : current); }} className="rounded-2xl py-3 text-lg font-black" style={{ backgroundColor: key === "OK" ? colors.gold : colors.bg, border: `1px solid ${colors.hairline}`, color: colors.ink }}>{key}</button>)}</div>
    <p aria-live="polite" className="mt-4 min-h-6 text-center text-sm font-black" style={{ color: feedback?.includes("Bonne") ? colors.green : colors.red }}>{feedback}</p>
  </>}</GameShell>;
}

const ROBOT_LEVELS = [
  { start: [4, 0], direction: 0, goal: [1, 0] },
  { start: [4, 0], direction: 0, goal: [2, 2] },
  { start: [4, 4], direction: 3, goal: [1, 1] },
  { start: [0, 0], direction: 2, goal: [4, 3] },
  { start: [4, 1], direction: 0, goal: [0, 4] },
];
const COMMAND_LABELS = { forward: "Avancer", left: "↶ Gauche", right: "Droite ↷" };
function runCommands(level, commands) {
  let [row, column] = level.start, direction = level.direction;
  for (const command of commands) {
    if (command === "left") direction = (direction + 3) % 4;
    else if (command === "right") direction = (direction + 1) % 4;
    else { const moves = [[-1, 0], [0, 1], [1, 0], [0, -1]]; row += moves[direction][0]; column += moves[direction][1]; if (row < 0 || row > 4 || column < 0 || column > 4) return { row, column, direction, outside: true }; }
  }
  return { row, column, direction, outside: false };
}

function RobotGame({ onBack }) {
  const [levelIndex, setLevelIndex] = useState(0), [commands, setCommands] = useState([]), [feedback, setFeedback] = useState(null);
  const [robotState, setRobotState] = useState(() => ({ row: ROBOT_LEVELS[0].start[0], column: ROBOT_LEVELS[0].start[1], direction: ROBOT_LEVELS[0].direction, outside: false }));
  const [running, setRunning] = useState(false);
  const level = ROBOT_LEVELS[levelIndex];
  const resetRobot = (targetLevel = level) => setRobotState({ row: targetLevel.start[0], column: targetLevel.start[1], direction: targetLevel.direction, outside: false });
  const updateCommands = (updater) => { if (running) return; setCommands(updater); setFeedback(null); resetRobot(); };
  const restart = () => { setLevelIndex(0); setCommands([]); setFeedback(null); setRunning(false); resetRobot(ROBOT_LEVELS[0]); };
  if (!level) return <GameShell title="Le robot livreur" accent="#00897b" onBack={onBack}><FinishCard score={5} total={5} restart={restart} back={onBack}/></GameShell>;
  const execute = async () => {
    if (running || !commands.length) return;
    setRunning(true); setFeedback(null); resetRobot();
    let result = { row: level.start[0], column: level.start[1], direction: level.direction, outside: false };
    for (const command of commands) {
      await new Promise((resolve) => window.setTimeout(resolve, 380));
      result = runCommands({ ...level, start: [result.row, result.column], direction: result.direction }, [command]);
      setRobotState(result);
      if (result.outside) break;
    }
    const success = !result.outside && result.row === level.goal[0] && result.column === level.goal[1];
    setFeedback(success ? "Colis livré !" : result.outside ? "Le robot est sorti du quadrillage." : "Le robot n’est pas encore sur le colis.");
    setRunning(false);
    if (success) window.setTimeout(() => { const nextLevel = ROBOT_LEVELS[levelIndex + 1]; setLevelIndex((value) => value + 1); setCommands([]); setFeedback(null); if (nextLevel) resetRobot(nextLevel); }, 950);
  };
  return <GameShell title="Le robot livreur" accent="#00897b" onBack={onBack}><p className="mt-2 text-sm" style={{ color: colors.slate }}>Prépare toute ta liste d’instructions, puis lance le robot pour vérifier ton trajet.</p><div className="mt-5 flex justify-between text-xs font-bold" style={{ color: colors.slate }}><span>Livraison {levelIndex + 1} / 5</span><span>{commands.length} / 15 instructions</span></div><div className="mx-auto mt-5 grid max-w-sm grid-cols-5 gap-1 rounded-2xl p-2" style={{ backgroundColor: `${colors.ink}0d` }}>{Array.from({ length: 25 }, (_, index) => { const row = Math.floor(index / 5), column = index % 5, robot = row === robotState.row && column === robotState.column && !robotState.outside, goal = row === level.goal[0] && column === level.goal[1]; return <div key={index} className="flex aspect-square items-center justify-center rounded-lg text-xl" style={{ backgroundColor: goal ? `${colors.gold}38` : colors.card, border: `1px solid ${goal ? colors.gold : colors.hairline}` }}>{robot ? <span aria-label="robot">🤖<small>{["↑", "→", "↓", "←"][robotState.direction]}</small></span> : goal ? <span aria-label="colis">📦</span> : ""}</div>; })}</div><div className="mt-5 grid grid-cols-3 gap-2">{["left", "forward", "right"].map((command) => <button key={command} disabled={running || commands.length >= 15} onClick={() => updateCommands((current) => [...current, command])} className="rounded-2xl py-3 text-sm font-black" style={{ backgroundColor: `${colors.green}16`, color: colors.ink }}>{COMMAND_LABELS[command]}</button>)}</div><div className="mt-3 flex gap-2"><button onClick={() => updateCommands((current) => current.slice(0, -1))} disabled={running || !commands.length} className="flex flex-1 items-center justify-center gap-1 rounded-full py-2 text-xs font-bold" style={{ border: `1px solid ${colors.hairline}`, color: colors.slate }}><Undo2 size={14}/> Annuler</button><button onClick={() => updateCommands([])} disabled={running || !commands.length} className="flex flex-1 items-center justify-center gap-1 rounded-full py-2 text-xs font-bold" style={{ border: `1px solid ${colors.hairline}`, color: colors.slate }}><Delete size={14}/> Effacer</button></div><p className="mt-4 min-h-12 rounded-xl p-2 text-center text-xs" style={{ backgroundColor: colors.bg, color: colors.slate }}>{commands.length ? commands.map((command) => COMMAND_LABELS[command]).join(" → ") : "Ajoute toutes tes instructions ici."}</p><button onClick={execute} disabled={running || !commands.length} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3 font-black" style={{ backgroundColor: commands.length && !running ? colors.gold : colors.hairline, color: colors.ink }}><Play size={16}/> {running ? "Le robot avance…" : "Lancer le robot"}</button><p aria-live="polite" className="mt-3 min-h-6 text-center text-sm font-black" style={{ color: feedback?.includes("livré") ? colors.green : colors.red }}>{feedback}</p></GameShell>;
}

export default function JeuxCe1() {
  const [activeGame, setActiveGame] = useState(null);
  if (activeGame === "thousand") return <QuizGame type="number" onBack={() => setActiveGame(null)}/>;
  if (activeGame === "pizza") return <QuizGame type="fraction" onBack={() => setActiveGame(null)}/>;
  if (activeGame === "robot") return <RobotGame onBack={() => setActiveGame(null)}/>;
  if (activeGame === "mental") return <MentalGame onBack={() => setActiveGame(null)}/>;
  return <div className="min-h-screen p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}><div className="mx-auto max-w-5xl"><Link to="/jeux" className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: colors.slate }}><ArrowLeft size={16}/> Tous les jeux</Link><header className="my-7 rounded-[2rem] p-7 text-center sm:p-10" style={{ backgroundColor: colors.ink, boxShadow: shadow.raised }}><p className="text-xs font-black uppercase tracking-[.2em]" style={{ color: colors.gold }}>Espace CE1</p><h1 className="mt-2 text-4xl font-black" style={{ fontFamily: fonts.display, color: "white" }}>Jeux CE1</h1><p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: "rgba(255,255,255,.72)" }}>Quatre défis courts pour progresser en numération, fractions, calcul mental et repérage tout en s’amusant.</p></header><div className="grid gap-4 sm:grid-cols-2">{GAME_CARDS.map(({ id, title, description, icon: Icon, accent }) => <button key={id} onClick={() => setActiveGame(id)} className="interactive-card flex min-h-64 flex-col rounded-3xl p-6 text-left" style={{ backgroundColor: colors.card, borderTop: `5px solid ${accent}`, boxShadow: shadow.soft }}><span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}18` }}><Icon size={27} color={accent}/></span><h2 className="mt-5 text-xl font-black" style={{ fontFamily: fonts.display, color: colors.ink }}>{title}</h2><p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: colors.slate }}>{description}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-black" style={{ color: accent }}>Jouer <ChevronRight size={16}/></span></button>)}</div></div></div>;
}
