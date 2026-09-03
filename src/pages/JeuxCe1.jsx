import { useState } from "react";
import MathText from "../components/MathText";
import { Link } from "react-router-dom";
import { ArrowLeft, Bot, Brain, ChevronRight, Delete, Flag, Pizza, Play, Trophy, Undo2, Zap } from "lucide-react";
import { colors, fonts, shadow } from "../theme";
import { shuffle } from "../lib/gameUtils";
import { PIZZA_PART_COUNTS, assessPizza, pizzaRectangleGrid } from "../lib/pizzaFractions";

const GAME_CARDS = [
  { id: "additions", path: "/jeux/course-additions-ce1", title: "La course des additions", description: "Calcule vite et fais avancer ton animal jusqu’à l’arrivée.", icon: Zap, accent: "#3fa66b" },
  { id: "thousand", title: "La course à 1 000", description: "Retrouve les différentes écritures d’un nombre.", icon: Flag, accent: "#1565c0" },
  { id: "pizza", title: "La pizzeria des fractions", description: "Observe les parts et complète les pizzas.", icon: Pizza, accent: "#d81b60" },
  { id: "robot", title: "Le robot livreur", description: "Programme le chemin jusqu’au colis.", icon: Bot, accent: "#00897b" },
  { id: "mental", title: "Le défi calcul mental", description: "Résous 10 calculs variés sans les poser.", icon: Brain, accent: "#ef6c00" },
];

function GameShell({ title, accent, onBack, children }) {
  return <div className="min-h-screen p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}><div className="mx-auto max-w-2xl"><button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: colors.slate }}><ArrowLeft size={16}/> Jeux CE1</button><div className="mt-5 rounded-[2rem] p-5 sm:p-8" style={{ backgroundColor: colors.card, borderTop: `5px solid ${accent}`, boxShadow: shadow.raised }}><h1 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: fonts.display, color: colors.ink }}>{title}</h1>{children}</div></div></div>;
}

function FinishCard({ score, total, restart, back }) {
  return <div className="py-8 text-center"><Trophy size={52} className="mx-auto" color={colors.gold}/><p className="mt-4 text-3xl font-black" style={{ color: colors.ink }}>{score} sur {total}</p><p className="mt-2 text-sm" style={{ color: colors.slate }}>{score === total ? "Parfait !" : score >= total * .7 ? "Bravo, tu progresses !" : "Bien joué ! Recommence pour battre ton score."}</p><div className="mt-7 grid gap-2 sm:grid-cols-2"><button onClick={restart} className="rounded-full py-3 font-black" style={{ backgroundColor: colors.gold, color: colors.ink }}>Rejouer</button><button onClick={back} className="rounded-full py-3 font-bold" style={{ border: `1px solid ${colors.hairline}`, color: colors.slate }}>Autre jeu CE1</button></div></div>;
}

function makeNumberQuestion() {
  const number = 100 + Math.floor(Math.random() * 900);
  const hundreds = Math.floor(number / 100), tens = Math.floor(number / 10) % 10, units = number % 10;
  const mode = Math.floor(Math.random() * 2);
  const representation = (value) => { const h = Math.floor(value / 100), t = Math.floor(value / 10) % 10, u = value % 10; return `${h} centaine${h > 1 ? "s" : ""}, ${t} dizaine${t > 1 ? "s" : ""} et ${u} unité${u > 1 ? "s" : ""}`; };
  const correct = mode === 0 ? String(number) : representation(number);
  const options = new Set([correct]);
  while (options.size < 4) {
    const candidate = Math.max(100, Math.min(999, number + shuffle([-100, -10, -1, 1, 10, 100])[0]));
    options.add(mode === 0 ? String(candidate) : representation(candidate));
  }
  return { prompt: mode === 0 ? representation(number) : String(number), correct, options: shuffle([...options]) };
}

function ThousandRace({ onBack }) {
  const total = 8;
  const [question, setQuestion] = useState(makeNumberQuestion);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const restart = () => { setQuestion(makeNumberQuestion()); setRound(1); setScore(0); setFeedback(null); };
  const answer = (option) => {
    if (feedback) return;
    const correct = option === question.correct;
    if (correct) setScore((value) => value + 1);
    setFeedback(correct ? "Bravo, tu avances !" : `Regarde : la bonne réponse était ${question.correct}.`);
    window.setTimeout(() => { setRound((value) => value + 1); setQuestion(makeNumberQuestion()); setFeedback(null); }, 850);
  };
  const distance = score * 125;
  return <GameShell title="La course à 1 000" accent="#1565c0" onBack={onBack}>{round > total ? <><div className="py-8 text-center"><Trophy size={52} className="mx-auto" color={distance === 1000 ? colors.gold : "#1565c0"}/><p className="mt-4 text-3xl font-black" style={{ color: colors.ink }}>{distance} m</p><p className="mt-2 text-sm" style={{ color: colors.slate }}>{distance === 1000 ? "Arrivée atteinte !" : "Belle course ! Rejoue pour te rapprocher de 1 000 m."}</p><div className="mt-7 grid gap-2 sm:grid-cols-2"><button onClick={restart} className="rounded-full py-3 font-black" style={{ backgroundColor: colors.gold, color: colors.ink }}>Rejouer</button><button onClick={onBack} className="rounded-full py-3 font-bold" style={{ border: `1px solid ${colors.hairline}`, color: colors.slate }}>Autre jeu CE1</button></div></div></> : <><p className="mt-2 text-sm" style={{ color: colors.slate }}>Trouve les bonnes écritures pour parcourir 1 000 mètres.</p><div className="mt-5 flex justify-between text-xs font-bold" style={{ color: colors.slate }}><span>Étape {round} / {total}</span><span>{distance} / 1 000 m</span></div><div className="relative mt-4 h-12 overflow-hidden rounded-full" style={{ backgroundColor: `${colors.ink}0d`, border: `2px solid ${colors.hairline}` }}><div className="absolute inset-y-0 left-0 transition-all duration-500" style={{ width: `${distance / 10}%`, backgroundColor: "#1565c026" }}/><span className="absolute top-1/2 text-2xl transition-all duration-500" style={{ left: `calc(${Math.min(92, distance / 10)}% - 12px)`, transform: "translateY(-50%)" }} aria-label={`${distance} mètres`}>🚗</span><span className="absolute right-2 top-1/2 -translate-y-1/2 text-xl" aria-hidden="true">🏁</span></div><p className="my-7 text-center text-2xl sm:text-3xl font-black" style={{ color: colors.ink }}>{question.prompt}</p><div className="grid gap-2 sm:grid-cols-2">{question.options.map((option) => <button key={option} onClick={() => answer(option)} className="min-h-14 rounded-2xl p-3 text-sm font-black" style={{ backgroundColor: colors.bg, border: `2px solid ${colors.hairline}`, color: colors.ink }}>{option}</button>)}</div><p aria-live="polite" className="mt-4 min-h-6 text-center text-sm font-black" style={{ color: feedback?.includes("Bravo") ? colors.green : colors.slate }}>{feedback}</p></>}</GameShell>;
}

function PizzaPicture({ denominator, selectedParts, onToggle, disabled, shape, layout }) {
  const rectangle = shape === "rectangle";
  const center = 110, radius = 94;
  const interaction = (index) => ({
    role: "button", tabIndex: disabled ? -1 : 0,
    "aria-label": `Part ${index + 1} ${selectedParts.has(index) ? "coloriée" : "vide"}`,
    "aria-pressed": selectedParts.has(index), "aria-disabled": disabled,
    onClick: () => !disabled && onToggle(index),
    onKeyDown: (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!disabled) onToggle(index);
      }
    },
    fill: selectedParts.has(index) ? "#ef5350" : "#fff4d6",
    stroke: "#8d4d20", strokeWidth: 2,
    style: { cursor: disabled ? "default" : "pointer", transition: "fill .18s ease" },
  });
  const { rows, columns } = pizzaRectangleGrid(denominator || 1, layout);
  return <svg viewBox={rectangle ? "0 0 280 200" : "0 0 220 220"} role={denominator ? "group" : "img"}
    aria-label={`Pizza ${rectangle ? "rectangulaire" : "ronde"} ${denominator ? `en ${denominator} parts égales` : "entière, pas encore découpée"}`}
    className="mx-auto my-4 w-full max-w-72 touch-manipulation">
    {rectangle ? <rect x="9" y="19" width="262" height="162" rx="9" fill="#d99a38"/> : <circle cx={center} cy={center} r={radius + 6} fill="#d99a38"/>}
    {!denominator ? (rectangle ? <rect x="15" y="25" width="250" height="150" fill="#fff4d6"/> : <circle cx={center} cy={center} r={radius} fill="#fff4d6"/>) :
      Array.from({ length: denominator }, (_, index) => {
        if (rectangle) return <rect key={index} x={15 + (index % columns) * 250 / columns} y={25 + Math.floor(index / columns) * 150 / rows} width={250 / columns} height={150 / rows} {...interaction(index)}/>;
        const start = -Math.PI / 2 + index * 2 * Math.PI / denominator;
        const end = -Math.PI / 2 + (index + 1) * 2 * Math.PI / denominator;
        return <path key={index} d={`M ${center} ${center} L ${center + radius * Math.cos(start)} ${center + radius * Math.sin(start)} A ${radius} ${radius} 0 0 1 ${center + radius * Math.cos(end)} ${center + radius * Math.sin(end)} Z`} {...interaction(index)}/>;
      })}
  </svg>;
}

function makeFractionQuestion() {
  const denominator = shuffle(PIZZA_PART_COUNTS)[0];
  return { denominator, numerator: 1 + Math.floor(Math.random() * (denominator - 1)) };
}

function PizzaGame({ onBack }) {
  const total = 8;
  const [question, setQuestion] = useState(makeFractionQuestion);
  const [round, setRound] = useState(1);
  const [cutCount, setCutCount] = useState(null);
  const [stage, setStage] = useState("cut");
  const [selectedParts, setSelectedParts] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const fraction = `\\dfrac{${question.numerator}}{${question.denominator}}`;
  const shape = round % 2 === 0 ? "rectangle" : "round";
  const layout = round < 4 ? "vertical" : round < 6 ? "horizontal" : "grid";
  const resetPizza = () => { setCutCount(null); setStage("cut"); setSelectedParts(new Set()); setFeedback(null); };
  const restart = () => { setQuestion(makeFractionQuestion()); setRound(1); resetPizza(); };
  const chooseCut = (count) => { setCutCount(count); setSelectedParts(new Set()); setFeedback(null); setStage("color"); };
  const togglePart = (index) => {
    if (stage !== "color") return;
    setSelectedParts((current) => { const next = new Set(current); next.has(index) ? next.delete(index) : next.add(index); return next; });
    setFeedback(null);
  };
  const validate = () => {
    if (stage !== "color") return;
    const result = assessPizza(question, cutCount, selectedParts.size);
    setFeedback(result);
    if (result === "correct") setStage("done");
  };
  const nextPizza = () => { setRound((value) => value + 1); setQuestion(makeFractionQuestion()); resetPizza(); };
  const needsNewCut = feedback === "denominator" || feedback === "equivalent";
  return <GameShell title="La pizzeria des fractions" accent="#d81b60" onBack={onBack}>
    {round > total ? <><p className="mt-4 text-center text-sm" style={{ color: colors.slate }}>Tu as préparé les 8 pizzas, en corrigeant si nécessaire. Bravo !</p><FinishCard score={total} total={total} restart={restart} back={onBack}/></> : <div className="pizza-game">
      <p className="mt-2 text-sm" style={{ color: colors.slate }}>Découpe en parts égales, puis choisis les parts à colorier.</p>
      <div className="mt-5 flex justify-between gap-2 text-xs font-bold" style={{ color: colors.slate }}><span>Commande {round} sur {total}</span><span>{shape === "rectangle" ? "Pizza rectangulaire" : "Pizza ronde"}</span></div>
      <ol className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-bold" style={{ color: colors.ink }}>
        <li aria-current={stage === "cut" ? "step" : undefined} className="rounded-xl p-3" style={{ background: stage === "cut" ? `${colors.gold}35` : colors.bg }}>1. Je découpe</li>
        <li aria-current={stage !== "cut" ? "step" : undefined} className="rounded-xl p-3" style={{ background: stage !== "cut" ? `${colors.gold}35` : colors.bg }}>2. Je colorie</li>
      </ol>
      <div className="mt-5 text-center text-lg font-black leading-loose" style={{ color: colors.ink }}>
        {stage === "cut" ? <>Pour représenter <MathText text={fraction}/>, en combien de parts égales dois-tu couper cette pizza ?</> : <>Sélectionne les parts pour représenter <MathText text={fraction}/>.</>}
      </div>
      <PizzaPicture denominator={cutCount} shape={shape} layout={layout} selectedParts={selectedParts} onToggle={togglePart} disabled={stage !== "color"}/>
      {stage === "cut" ? <div className="grid grid-cols-3 gap-2" role="group" aria-label="Nombre de parts égales">
        {PIZZA_PART_COUNTS.map((count) => <button key={count} type="button" onClick={() => chooseCut(count)} className="min-h-12 rounded-xl p-3 font-black" style={{ background: colors.bg, border: `2px solid ${colors.hairline}`, color: colors.ink }}>{count} parts</button>)}
      </div> : <>
        <p className="text-center text-sm font-bold" style={{ color: colors.slate }}>{selectedParts.size} part{selectedParts.size > 1 ? "s" : ""} coloriée{selectedParts.size > 1 ? "s" : ""} sur {cutCount}</p>
        {stage === "color" && <button type="button" onClick={validate} className="mt-3 min-h-12 w-full rounded-full px-4 py-3 font-black" style={{ backgroundColor: colors.gold, color: colors.ink }}>Valider ma pizza</button>}
      </>}
      <div aria-live="polite" aria-atomic="true" className="mt-4 text-center text-sm leading-loose" style={{ color: feedback === "correct" || feedback === "equivalent" ? colors.green : colors.ink }}>
        {feedback && <div className="rounded-2xl p-4" style={{ background: colors.bg }}>
          {feedback === "correct" ? <>Pizza réussie ! Tu as découpé {cutCount} parts égales et colorié {selectedParts.size} part{selectedParts.size > 1 ? "s" : ""} : <MathText text={fraction}/>.</> : <>
            <p>Tu as colorié {selectedParts.size} part{selectedParts.size > 1 ? "s" : ""} sur {cutCount} : tu as représenté <MathText text={`\\dfrac{${selectedParts.size}}{${cutCount}}`}/>.</p>
            {feedback === "equivalent" ? <p>Tu as représenté la même quantité ! <MathText text={`\\dfrac{${selectedParts.size}}{${cutCount}} = ${fraction}`}/>. Maintenant, représente-la avec un découpage en {question.denominator} parts égales.</p> : feedback === "denominator" ? <p>Pas encore : pour représenter <MathText text={fraction}/>, le nombre du bas, {question.denominator}, indique en combien de parts égales découper la pizza. Réessaie le découpage.</p> : <p>Le découpage en {cutCount} parts est correct. Le nombre du haut, {question.numerator}, indique combien de parts colorier. Corrige seulement les parts coloriées.</p>}
          </>}
        </div>}
      </div>
      {stage === "done" ? <button type="button" onClick={nextPizza} className="mt-4 min-h-12 w-full rounded-full px-4 py-3 font-black" style={{ background: colors.green, color: "white" }}>{round === total ? "Voir mon bilan" : "Pizza suivante"}</button> : stage === "color" && <button type="button" onClick={resetPizza} className="mt-3 min-h-12 w-full rounded-full px-4 py-2 text-sm font-bold underline" style={{ color: colors.ink }}>{needsNewCut ? "Corriger le découpage" : "Changer le découpage"}</button>}
    </div>}
  </GameShell>;
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
    setFeedback(correct ? "Bonne réponse, la jauge monte !" : `Regarde : la réponse était ${question.answer}.`);
    window.setTimeout(() => { setRound((current) => current + 1); setQuestion(makeMentalQuestion()); setValue(""); setFeedback(null); }, 950);
  };
  return <GameShell title="Le défi calcul mental" accent="#ef6c00" onBack={onBack}>{round > total ? <FinishCard score={score} total={total} restart={restart} back={onBack}/> : <>
    <p className="mt-2 text-sm" style={{ color: colors.slate }}>Réponds sans poser le calcul et remplis ta jauge d’énergie.</p>
    <div className="mt-5 flex justify-between text-xs font-bold" style={{ color: colors.slate }}><span>Calcul {round} / {total}</span><span>Jauge {score * 10} %</span></div>
    <div className="mt-2 h-5 overflow-hidden rounded-full" role="progressbar" aria-label="Jauge d’énergie" aria-valuemin="0" aria-valuemax="100" aria-valuenow={score * 10} style={{ backgroundColor: `${colors.ink}0d`, border: `1px solid ${colors.hairline}` }}><div className="h-full rounded-full transition-all duration-500" style={{ width: `${score * 10}%`, backgroundColor: "#ef6c00" }}/></div>
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
  if (activeGame === "thousand") return <ThousandRace onBack={() => setActiveGame(null)}/>;
  if (activeGame === "pizza") return <PizzaGame onBack={() => setActiveGame(null)}/>;
  if (activeGame === "robot") return <RobotGame onBack={() => setActiveGame(null)}/>;
  if (activeGame === "mental") return <MentalGame onBack={() => setActiveGame(null)}/>;
  return <div className="min-h-screen p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}><div className="mx-auto max-w-5xl"><Link to="/jeux" className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: colors.slate }}><ArrowLeft size={16}/> Tous les jeux</Link><header className="my-7 rounded-[2rem] p-7 text-center sm:p-10" style={{ backgroundColor: colors.ink, boxShadow: shadow.raised }}><p className="text-xs font-black uppercase tracking-[.2em]" style={{ color: colors.gold }}>Espace CE1</p><h1 className="mt-2 text-4xl font-black" style={{ fontFamily: fonts.display, color: "white" }}>Jeux CE1</h1><p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: "rgba(255,255,255,.72)" }}>Cinq défis courts pour progresser en numération, fractions, calcul mental et repérage tout en s’amusant.</p></header><div className="grid gap-4 sm:grid-cols-2">{GAME_CARDS.map(({ id, path, title, description, icon: Icon, accent }) => { const content = <><span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}18` }}><Icon size={27} color={accent}/></span><h2 className="mt-5 text-xl font-black" style={{ fontFamily: fonts.display, color: colors.ink }}>{title}</h2><p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: colors.slate }}>{description}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-black" style={{ color: accent }}>Jouer <ChevronRight size={16}/></span></>; const cardClass = "interactive-card flex min-h-64 flex-col rounded-3xl p-6 text-left"; const cardStyle = { backgroundColor: colors.card, borderTop: `5px solid ${accent}`, boxShadow: shadow.soft }; return path ? <Link key={id} to={path} className={cardClass} style={cardStyle}>{content}</Link> : <button key={id} onClick={() => setActiveGame(id)} className={cardClass} style={cardStyle}>{content}</button>; })}</div></div></div>;
}
