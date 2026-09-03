import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Maximize, ArrowRight, RotateCcw, Settings2, Play, CheckCircle2, RefreshCw, Pencil, X, ChevronUp, ChevronDown, Copy, Save, Printer, Timer } from "lucide-react";
import { chapters } from "../chapters/registry";
import { LEVELS } from "../levels";
import MathText from "../components/MathText";
import StepsList from "../components/StepsList";
import Figure from "../components/Figure";
import Graph from "../components/Graph";
import CalculationModeBadge from "../components/CalculationModeBadge";
import { teacherAnswer, hasTeacherOptions } from "../lib/teacherExercise";
import { colors, fonts, shadow } from "../theme";

// ---------------------------------------------------------------------------
// Mode Automatismes spécial enseignant (/enseignant) : gratuit, public, sans
// connexion — pensé pour une projection en classe. Réutilise TEL QUEL les
// chapitres Automatismes existants (aucun contenu dupliqué) : l'enseignant
// choisit un niveau, examine plusieurs questions proposées dans chaque thème,
// choisit le nombre de questions (de 1 à 10), puis lance
// un diaporama SANS réponse visible (l'enseignant avance à la main avec
// "Suivant") ; à la fin, un écran unique affiche toutes les corrections.
//
// Trois écrans internes (state `view`) : "setup" → "diaporama" → "corrections".
// Pas de score, pas de sauvegarde, pas de compte — usage éphémère en classe.
// ---------------------------------------------------------------------------

function formatAnswer(answer) {
  if (Array.isArray(answer)) return answer.join(" · ");
  return typeof answer === "number" ? String(answer).replace(".", ",") : String(answer);
}

const levelOrder = new Map(LEVELS.map((level, index) => [level.id, index]));
const AUTOMATISMES_CHAPTERS = chapters
  .filter((c) => c.meta.isAutomatismes)
  .sort((a, b) => (levelOrder.get(a.meta.level) ?? 999) - (levelOrder.get(b.meta.level) ?? 999));

function buildThemeProposals(chapter, themeId, count = 3) {
  const proposals = [];
  const prompts = new Set();
  for (let attempt = 0; proposals.length < count && attempt < count * 8; attempt += 1) {
    const exercise = chapter.generate(themeId);
    if (!exercise || prompts.has(exercise.prompt)) continue;
    prompts.add(exercise.prompt);
    proposals.push({ id: `${themeId}-${Date.now()}-${attempt}-${Math.random().toString(36).slice(2, 7)}`, themeId, exercise });
  }
  return proposals;
}

function buildChapterProposals(chapter) {
  return Object.fromEntries(chapter.themes.map((theme) => [theme.id, buildThemeProposals(chapter, theme.id)]));
}

function frenchNumber(value) {
  return Number(String(value).replace(",", "."));
}

function deriveSimpleNumericQuestion(prompt) {
  const normalized = prompt.replace(/\\[()]/g, "").replace(/\{,\}/g, ",").trim();
  const operation = normalized.match(/(-?\d+(?:[,.]\d+)?)\s*([+\-×x*÷/])\s*(-?\d+(?:[,.]\d+)?)\s*=\s*\?/);
  if (operation) {
    const a = frenchNumber(operation[1]); const b = frenchNumber(operation[3]); const symbol = operation[2];
    if (![a,b].every(Number.isFinite) || ((symbol === "÷" || symbol === "/") && b === 0)) return null;
    const answer = symbol === "+" ? a+b : symbol === "-" ? a-b : ["×","x","*"].includes(symbol) ? a*b : a/b;
    const rounded = Math.round(answer * 1e9) / 1e9;
    return { answer: rounded, steps: [{type:"calcul",text:`${formatAnswer(a)} ${symbol} ${formatAnswer(b)} = ${formatAnswer(rounded)}`}] };
  }
  const missing = normalized.match(/(-?\d+(?:[,.]\d+)?)\s*([+\-])\s*\?\s*=\s*(-?\d+(?:[,.]\d+)?)/);
  if (missing) {
    const a=frenchNumber(missing[1]); const target=frenchNumber(missing[3]); const answer=missing[2]==="+"?target-a:a-target;
    const rounded=Math.round(answer*1e9)/1e9;
    return {answer:rounded,steps:[{type:"calcul",text:`Le nombre manquant est ${formatAnswer(rounded)}.`}]};
  }
  const percentage = normalized.match(/(?:calcule\s+)?(-?\d+(?:[,.]\d+)?)\s*%\s+de\s+(-?\d+(?:[,.]\d+)?)/i);
  if (percentage) {
    const rate=frenchNumber(percentage[1]); const value=frenchNumber(percentage[2]); const answer=Math.round(rate*value*1e7)/1e9;
    return {answer,steps:[{type:"calcul",text:`\\(${formatAnswer(rate)}\\,\\%\\text{ de }${formatAnswer(value)}=\\dfrac{${formatAnswer(rate)}}{100}\\times${formatAnswer(value)}=${formatAnswer(answer)}\\)`}]};
  }
  const fraction = normalized.match(/(?:calcule\s+)?(-?\d+)\s*\/\s*(-?\d+)\s+de\s+(-?\d+(?:[,.]\d+)?)/i);
  if (fraction) {
    const numerator=Number(fraction[1]);const denominator=Number(fraction[2]);const value=frenchNumber(fraction[3]);if(!denominator)return null;
    const answer=Math.round(numerator/denominator*value*1e9)/1e9;
    return {answer,steps:[{type:"calcul",text:`\\(\\dfrac{${numerator}}{${denominator}}\\text{ de }${formatAnswer(value)}=${formatAnswer(value)}\\div${denominator}\\times${numerator}=${formatAnswer(answer)}\\)`}]};
  }
  const equation = normalized.match(/(-?\d+(?:[,.]\d+)?)\s*x\s*([+\-])\s*(\d+(?:[,.]\d+)?)\s*=\s*(-?\d+(?:[,.]\d+)?)/i);
  if(equation){const a=frenchNumber(equation[1]);const b=frenchNumber(equation[3])*(equation[2]==="-"?-1:1);const target=frenchNumber(equation[4]);if(!a)return null;const answer=Math.round((target-b)/a*1e9)/1e9;return {answer,steps:[{type:"calcul",text:`On effectue la même opération dans les deux membres, puis on divise par ${formatAnswer(a)} : \\(x=${formatAnswer(answer)}\\).`}]};}
  const conversion = normalized.match(/(?:convertis?|conversion de)\s+(-?\d+(?:[,.]\d+)?)\s*(km|hm|dam|m|dm|cm|mm)\s+(?:en|vers)\s*(km|hm|dam|m|dm|cm|mm)/i);
  if(conversion){const factors={km:1000,hm:100,dam:10,m:1,dm:.1,cm:.01,mm:.001};const value=frenchNumber(conversion[1]);const from=conversion[2].toLowerCase();const to=conversion[3].toLowerCase();const answer=Math.round(value*factors[from]/factors[to]*1e9)/1e9;return {answer,steps:[{type:"calcul",text:`Dans le tableau de conversion des longueurs, on passe de ${from} à ${to} : \\(${formatAnswer(value)}\\ ${from}=${formatAnswer(answer)}\\ ${to}\\).`}]};}
  return null;
}

function encodeSession(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = ""; bytes.forEach((byte)=>{binary+=String.fromCharCode(byte);});
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function decodeSession(value) {
  if (!value || value.length > 40000) return null;
  const base64=value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length/4)*4,"=");
  const binary=atob(base64); const bytes=Uint8Array.from(binary,(char)=>char.charCodeAt(0));
  const parsed=JSON.parse(new TextDecoder().decode(bytes));
  if (!parsed || !Array.isArray(parsed.exercises) || parsed.exercises.length < 1 || parsed.exercises.length > 10) return null;
  const exercises=parsed.exercises.map((exercise)=>{
    if (!exercise || typeof exercise.prompt!=="string" || exercise.prompt.length>1200 || typeof exercise.chapter!=="string" || exercise.chapter.length>240) throw new Error("Séance invalide");
    const options=Array.isArray(exercise.options)?exercise.options.slice(0,8).map((option)=>String(option).slice(0,300)):undefined;
    return {...exercise,prompt:exercise.prompt,chapter:exercise.chapter,options};
  });
  return {levelId:typeof parsed.levelId==="string"?parsed.levelId:"",title:typeof parsed.title==="string"?parsed.title.slice(0,120):"",date:typeof parsed.date==="string"?parsed.date.slice(0,10):"",timerSeconds:[0,30,60,90,120].includes(parsed.timerSeconds)?parsed.timerSeconds:0,exercises};
}

function QuestionEditForm({ draft, setDraft, isQcm, onSave, onCancel }) {
  const auto = !isQcm ? deriveSimpleNumericQuestion(draft.prompt) : null;
  return <div><label className="block text-[10px] font-bold" style={{color:colors.slate}}>Énoncé personnalisé<textarea rows={3} value={draft.prompt} onChange={(event)=>{const prompt=event.target.value;const derived=deriveSimpleNumericQuestion(prompt);setDraft((current)=>({...current,prompt,...(derived?{answer:formatAnswer(derived.answer),autoSteps:derived.steps}:{autoSteps:null})}));}} className="mt-1 w-full rounded-lg border bg-white p-2 text-xs" style={{borderColor:colors.hairline,color:colors.ink}}/></label>{isQcm?<><p className="mt-2 text-[10px] font-bold" style={{color:colors.slate}}>Propositions et bonne réponse</p><div className="mt-1 grid gap-1.5">{draft.options.map((option,optionIndex)=><label key={optionIndex} className="flex items-center gap-2"><input type="radio" name={`correct-${draft.id}`} checked={draft.correctIndex===optionIndex} onChange={()=>setDraft((current)=>({...current,correctIndex:optionIndex}))}/><input value={option} onChange={(event)=>setDraft((current)=>({...current,options:current.options.map((item,index)=>index===optionIndex?event.target.value:item)}))} className="min-w-0 flex-1 rounded-lg border bg-white p-2 text-xs" style={{borderColor:colors.hairline,color:colors.ink}}/></label>)}</div></>:<label className="block mt-2 text-[10px] font-bold" style={{color:colors.slate}}>Réponse attendue<input value={draft.answer} onChange={(event)=>setDraft((current)=>({...current,answer:event.target.value,autoSteps:null}))} className="mt-1 w-full rounded-lg border bg-white p-2 text-xs" style={{borderColor:colors.hairline,color:colors.ink}}/></label>}{auto&&<p className="mt-2 text-[10px] font-bold" style={{color:colors.green}}>Réponse recalculée automatiquement pour cette opération simple.</p>}<p className="mt-2 text-[10px]" style={{color:colors.slate}}>La correction sera reconstruite avec la nouvelle réponse afin de ne pas conserver des calculs liés aux anciennes valeurs.</p><div className="mt-2 flex gap-2"><button type="button" onClick={onSave} className="rounded-full px-3 py-1.5 text-[10px] font-black" style={{backgroundColor:colors.gold,color:colors.ink}}>Enregistrer</button><button type="button" onClick={onCancel} className="inline-flex items-center gap-1 px-2 text-[10px] font-bold" style={{color:colors.slate}}><X size={11}/> Annuler</button></div></div>;
}

export function PrintableSession({ title, date, levelId, exercises, withCorrections }) {
  const level=LEVELS.find((item)=>item.id===levelId)?.label||levelId;
  return <section className="teacher-print-sheet hidden" aria-hidden="true"><header><p>RéussiMaths · {level}</p><h1>{title||"Rituel de mathématiques"}</h1><p>{date?new Intl.DateTimeFormat("fr-FR",{dateStyle:"long"}).format(new Date(`${date}T12:00:00`)):""}</p></header>{exercises.map((exercise,i)=><article key={i}><h2>Question {i+1}</h2><MathText as="p" text={exercise.prompt}/>{exercise.figure&&<Figure spec={exercise.figure}/>} {exercise.graph&&<Graph spec={exercise.graph}/>} {hasTeacherOptions(exercise)&&<ul>{exercise.options.map((option,j)=><li key={j}><MathText text={String(option)}/></li>)}</ul>}{withCorrections&&<div className="teacher-print-answer"><strong>Réponse : </strong><MathText text={teacherAnswer(exercise)}/>{Array.isArray(exercise.steps)&&exercise.steps.length>0&&<StepsList steps={exercise.steps} dark={false}/>}</div>}</article>)}</section>;
}

export default function Enseignant() {
  const [view, setView] = useState("setup");
  const [levelId, setLevelId] = useState("");
  const [proposals, setProposals] = useState({});
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ id: "", prompt: "", answer: "", options: [], correctIndex: 0, autoSteps: null });
  const [exercises, setExercises] = useState([]);
  const [index, setIndex] = useState(0);
  const [shareMessage, setShareMessage] = useState("");
  const [sessionTitle, setSessionTitle] = useState("Rituel de mathématiques");
  const [sessionDate, setSessionDate] = useState(()=>new Date().toISOString().slice(0,10));
  const [questionCount, setQuestionCount] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [printMode, setPrintMode] = useState("student");

  const chapter = useMemo(() => AUTOMATISMES_CHAPTERS.find((c) => c.meta.level === levelId) ?? null, [levelId]);
  const total = selectedQuestions.length;

  const selectLevel = (id) => {
    setLevelId(id);
    const selectedChapter = AUTOMATISMES_CHAPTERS.find((item) => item.meta.level === id);
    setProposals(selectedChapter ? buildChapterProposals(selectedChapter) : {});
    setSelectedQuestions([]);
    setEditingId(null);
  };

  const toggleQuestion = (proposal) => {
    setSelectedQuestions((current) => {
      if (current.some((item) => item.id === proposal.id)) return current.filter((item) => item.id !== proposal.id);
      if (current.length >= questionCount) return current;
      return [...current, proposal];
    });
  };

  const refreshTheme = (themeId) => {
    if (!chapter) return;
    const removedIds = new Set((proposals[themeId] ?? []).map((item) => item.id));
    setSelectedQuestions((current) => current.filter((item) => !removedIds.has(item.id)));
    setProposals((current) => ({ ...current, [themeId]: buildThemeProposals(chapter, themeId) }));
  };

  const startEditing = (proposal) => {
    setEditingId(proposal.id);
    const options=Array.isArray(proposal.exercise.options)?proposal.exercise.options.map(String):[];
    const correctIndex=options.findIndex((option)=>option===String(proposal.exercise.answer));
    setEditDraft({ id:proposal.id,prompt:proposal.exercise.prompt,answer:formatAnswer(proposal.exercise.answer),options,correctIndex:correctIndex>=0?correctIndex:0,autoSteps:null });
  };

  const saveCustomization = (proposal) => {
    const prompt = editDraft.prompt.trim();
    const isQcm=proposal.exercise.type==="qcm"&&editDraft.options.length>0;
    const rawAnswer = isQcm?editDraft.options[editDraft.correctIndex]?.trim():editDraft.answer.trim();
    if (!prompt || !rawAnswer || (isQcm&&editDraft.options.some((option)=>!option.trim()))) return;
    const parsed = Number(rawAnswer.replace(",", "."));
    const answer = !isQcm&&typeof proposal.exercise.answer === "number" && Number.isFinite(parsed) ? parsed : rawAnswer;
    const derived=!isQcm?deriveSimpleNumericQuestion(prompt):null;
    const updated = {
      ...proposal,
      exercise: {
        ...proposal.exercise,
        prompt,
        answer,
        ...(isQcm?{options:editDraft.options.map((option)=>option.trim())}:{}),
        steps: derived?.steps ?? [{ type: "resultat", text: `Réponse attendue : ${formatAnswer(answer)}` }],
        teacherCustomized: true,
      },
    };
    setProposals((current) => ({ ...current, [proposal.themeId]: (current[proposal.themeId] ?? []).map((item) => item.id === proposal.id ? updated : item) }));
    setSelectedQuestions((current) => current.map((item) => item.id === proposal.id ? updated : item));
    setEditingId(null);
  };

  const moveSelected = (selectedIndex, direction) => {
    setSelectedQuestions((current)=>{
      const target=selectedIndex+direction;
      if(target<0||target>=current.length)return current;
      const next=[...current];[next[selectedIndex],next[target]]=[next[target],next[selectedIndex]];return next;
    });
  };

  const launch = () => {
    if (!chapter || total !== questionCount) return;
    setExercises(selectedQuestions.map((item) => item.exercise));
    setIndex(0);
    setView("review");
  };

  const launchDemo = () => {
    const demoChapter = AUTOMATISMES_CHAPTERS[0];
    if (!demoChapter) return;
    const demoThemes = demoChapter.themes.slice(0, 5);
    const demoExercises = demoThemes.map((theme) => demoChapter.generate(theme.id));
    setLevelId(demoChapter.meta.level);
    setProposals(buildChapterProposals(demoChapter));
    setSelectedQuestions([]);
    setExercises(demoExercises);
    setIndex(0);
    setView("review");
  };

  const next = () => {
    if (index < exercises.length - 1) setIndex((i) => i + 1);
    else setView("corrections");
  };

  const restartSameParams = () => {
    setIndex(0);
    setView("diaporama");
  };

  const backToSetup = () => {
    setView("setup");
    setExercises([]);
    setIndex(0);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  const copySessionLink = async () => {
    try {
      const encoded=encodeSession({levelId,title:sessionTitle,date:sessionDate,timerSeconds,exercises});
      if(encoded.length>40000)throw new Error("Lien trop long");
      const url=`${window.location.origin}/enseignant?seance=${encoded}`;
      await navigator.clipboard.writeText(url);
      setShareMessage("Lien de séance copié.");
    } catch { setShareMessage("Cette séance contient trop d’éléments pour être partagée par un lien."); }
  };

  useEffect(() => {
    const value=new URLSearchParams(window.location.search).get("seance");
    if(!value)return;
    try {
      const imported=decodeSession(value);
      if(!imported)throw new Error("Séance invalide");
      setLevelId(imported.levelId);setSessionTitle(imported.title||"Rituel de mathématiques");setSessionDate(imported.date||new Date().toISOString().slice(0,10));setTimerSeconds(imported.timerSeconds);setExercises(imported.exercises);setIndex(0);setView("review");
    } catch { setShareMessage("Le lien de séance est invalide ou incomplet."); }
  }, []);

  useEffect(()=>{if(view!=="diaporama"||!timerSeconds)return undefined;setTimeLeft(timerSeconds);const interval=window.setInterval(()=>setTimeLeft((value)=>Math.max(0,value-1)),1000);return()=>window.clearInterval(interval);},[view,index,timerSeconds]);

  const printSession=(mode)=>{setPrintMode(mode);window.setTimeout(()=>window.print(),50);};

  useEffect(() => {
    if (view !== "diaporama") return undefined;
    const handleKey = (event) => {
      if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
        event.preventDefault();
        next();
      }
      if (event.key.toLowerCase() === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [view, index, exercises.length]);

  const ink = colors.ink;
  const paper = colors.bg;
  const slate = colors.slate;
  const gold = colors.gold;

  // -------------------------------------------------------------- SETUP ---
  if (view === "setup") {
    return (
      <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold mb-4" style={{ color: slate }}>
            <ArrowLeft size={14} /> Accueil
          </Link>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start py-5 lg:py-10">
            <section className="lg:sticky lg:top-8">
              <p className="text-xs tracking-widest uppercase font-bold" style={{ color: gold, letterSpacing: "0.12em" }}>Gratuit · sans compte</p>
              <h1 className="mt-3" style={{ fontFamily: fonts.display, color: ink, fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.03, fontWeight: 900, letterSpacing: "-0.04em" }}>
                Votre rituel de maths, prêt à projeter.
              </h1>
              <p className="text-base mt-5 max-w-lg leading-relaxed" style={{ color: slate }}>
                Composez de 1 à 10 automatismes en moins d’une minute. Les questions s’affichent sans réponse, puis toutes les corrections détaillées arrivent ensemble.
              </p>
              <div className="grid grid-cols-3 gap-2 mt-7">
                {["Choisissez", "Projetez", "Corrigez"].map((label, i) => (
                  <div key={label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
                    <p className="text-lg font-black" style={{ color: gold }}>{i + 1}</p>
                    <p className="text-xs font-semibold mt-1" style={{ color: ink }}>{label}</p>
                  </div>
                ))}
              </div>
              <button type="button" onClick={launchDemo} className="w-full sm:w-auto mt-5 py-3.5 px-6 rounded-full font-bold flex items-center justify-center gap-2" style={{ backgroundColor: ink, color: paper, boxShadow: shadow.raised }}>
                <Play size={16} /> Lancer la démo en un clic
              </button>
              <p className="text-xs mt-3" style={{ color: slate }}>Aucune préparation et aucun compte élève nécessaires.</p>

              <div className="mt-7">
                <Link to="/niveaux?objectif=essai" className="py-3 px-4 rounded-2xl flex items-center justify-between gap-3" style={{ backgroundColor: colors.card, color: ink, border: `1px solid ${colors.hairline}` }}>
                  <div><p className="text-sm font-semibold">Voir l’expérience élève</p><p className="text-xs mt-0.5" style={{ color: slate }}>Choix du niveau, diagnostic puis série gratuite</p></div>
                  <CheckCircle2 size={18} color={gold} />
                </Link>
              </div>
            </section>

            <section className="rounded-[2rem] p-5 sm:p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.raised, border: `1px solid ${colors.hairline}` }}>
              <div className="flex items-start justify-between gap-3 mb-6">
                <div><p className="text-xs uppercase tracking-widest font-bold" style={{ color: gold }}>Créer une séance</p><h2 className="text-2xl font-black mt-1" style={{ color: ink }}>Choisissez vos {questionCount} question{questionCount > 1 ? "s" : ""}</h2></div>
                <p aria-live="polite" className="text-sm font-black px-3 py-1.5 rounded-full" style={{ color: total === questionCount ? colors.green : gold, backgroundColor: total === questionCount ? `${colors.green}18` : `${gold}18` }}>{total} / {questionCount}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 mb-5">
                <label className="text-xs font-semibold" style={{color:slate}}>Titre de la séance<input value={sessionTitle} maxLength={120} onChange={(event)=>setSessionTitle(event.target.value)} className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm" style={{border:`1px solid ${colors.hairline}`,backgroundColor:colors.bg,color:ink}}/></label>
                <label className="text-xs font-semibold" style={{color:slate}}>Date<input type="date" value={sessionDate} onChange={(event)=>setSessionDate(event.target.value)} className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm" style={{border:`1px solid ${colors.hairline}`,backgroundColor:colors.bg,color:ink}}/></label>
              </div>

            <label htmlFor="teacher-level" className="block text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: slate }}>
              1. Niveau
            </label>
            <select
              id="teacher-level"
              value={levelId}
              onChange={(e) => selectLevel(e.target.value)}
              className="w-full text-sm rounded-xl px-3 py-2.5"
              style={{ border: `1px solid ${colors.hairline}`, color: ink, backgroundColor: colors.bg }}
            >
              <option value="">— Choisir un niveau —</option>
              {AUTOMATISMES_CHAPTERS.map((c) => {
                const level = LEVELS.find((l) => l.id === c.meta.level);
                return (
                  <option key={c.meta.level} value={c.meta.level}>
                    {level?.label ?? c.meta.level}
                  </option>
                );
              })}
            </select>
              <label className="block mt-4 text-xs font-semibold" style={{color:slate}}>Minuteur par question (optionnel)<select value={timerSeconds} onChange={(event)=>setTimerSeconds(Number(event.target.value))} className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm" style={{border:`1px solid ${colors.hairline}`,backgroundColor:colors.bg,color:ink}}><option value={0}>Sans minuteur</option><option value={30}>30 secondes</option><option value={60}>1 minute</option><option value={90}>1 min 30</option><option value={120}>2 minutes</option></select></label>
              <label className="block mt-4 text-xs font-semibold" style={{color:slate}}>Nombre de questions<select value={questionCount} onChange={(event)=>{const count=Number(event.target.value);setQuestionCount(count);setSelectedQuestions((current)=>current.slice(0,count));}} className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm" style={{border:`1px solid ${colors.hairline}`,backgroundColor:colors.bg,color:ink}}>{Array.from({length:10},(_,index)=>index+1).map((count)=><option key={count} value={count}>{count} question{count>1?"s":""}</option>)}</select></label>
              <div className="my-5" style={{ height: 1, backgroundColor: colors.hairline }} />

          {chapter && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: slate }}>
                  2. Sélectionnez précisément les questions
                </p>
              </div>
              <p className="text-xs mb-4" style={{color:slate}}>Trois propositions sont affichées par thème. Cochez celles qui correspondent exactement à votre séance ; leur ordre de sélection sera conservé.</p>
              <div className="flex flex-col gap-4">
                {chapter.themes.map((t) => {
                  return (
                    <div key={t.id} className="rounded-2xl p-3" style={{ backgroundColor: colors.bg }}>
                      <div className="flex items-center justify-between gap-3"><p className="text-sm font-black" style={{ color: ink }}>{t.title}</p><button type="button" onClick={()=>refreshTheme(t.id)} className="inline-flex items-center gap-1 text-[10px] font-bold" style={{color:gold}}><RefreshCw size={12}/> Autres questions</button></div>
                      <div className="mt-2 grid gap-2">
                        {(proposals[t.id] ?? []).map((proposal) => {
                          const selectedIndex = selectedQuestions.findIndex((item)=>item.id===proposal.id);
                          const selected = selectedIndex >= 0;
                          const editable = (["numeric", "text"].includes(proposal.exercise.type) || (proposal.exercise.type === "qcm" && Array.isArray(proposal.exercise.options))) && !proposal.exercise.figure && !proposal.exercise.graph && !Array.isArray(proposal.exercise.answer);
                          return <div key={proposal.id} className="rounded-xl p-3" style={{backgroundColor:selected?`${colors.green}12`:colors.card,border:`1px solid ${selected?colors.green:colors.hairline}`,opacity:!selected&&total>=questionCount?.55:1}}>{editingId===proposal.id?<QuestionEditForm draft={editDraft} setDraft={setEditDraft} isQcm={proposal.exercise.type==="qcm"} onSave={()=>saveCustomization(proposal)} onCancel={()=>setEditingId(null)}/>:<div className="flex items-start gap-2"><button type="button" onClick={()=>toggleQuestion(proposal)} disabled={!selected&&total>=questionCount} className="min-w-0 flex-1 text-left flex items-start gap-3"><span className="shrink-0 flex items-center justify-center rounded-full text-[10px] font-black" style={{width:24,height:24,backgroundColor:selected?colors.green:`${ink}0d`,color:selected?"white":slate}}>{selected?selectedIndex+1:"+"}</span><span className="min-w-0"><MathText as="span" text={proposal.exercise.prompt} className="text-xs leading-relaxed" style={{color:ink}}/>{proposal.exercise.teacherCustomized&&<span className="block mt-1 text-[9px] font-black uppercase tracking-wide" style={{color:gold}}>Question personnalisée</span>}</span></button>{editable&&<button type="button" onClick={()=>startEditing(proposal)} className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold" style={{backgroundColor:colors.bg,color:slate}}><Pencil size={10}/> Modifier</button>}</div>}</div>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

              {selectedQuestions.length > 0 && <div className="mt-5 rounded-2xl p-3" style={{backgroundColor:colors.bg}}><p className="text-xs uppercase tracking-wide font-bold" style={{color:slate}}>Ordre de projection</p><div className="mt-2 grid gap-1.5">{selectedQuestions.map((item,selectedIndex)=><div key={item.id} className="flex items-center gap-2 rounded-xl bg-white p-2"><span className="text-xs font-black" style={{color:gold}}>{selectedIndex+1}</span><MathText as="span" text={item.exercise.prompt} className="min-w-0 flex-1 truncate text-[10px]" style={{color:ink}}/><button type="button" onClick={()=>moveSelected(selectedIndex,-1)} disabled={selectedIndex===0} aria-label="Monter la question" style={{opacity:selectedIndex===0?.3:1,color:slate}}><ChevronUp size={14}/></button><button type="button" onClick={()=>moveSelected(selectedIndex,1)} disabled={selectedIndex===selectedQuestions.length-1} aria-label="Descendre la question" style={{opacity:selectedIndex===selectedQuestions.length-1?.3:1,color:slate}}><ChevronDown size={14}/></button></div>)}</div></div>}

              <button
            type="button"
            disabled={total !== questionCount}
            onClick={launch}
            className="w-full mt-5 py-3.5 rounded-full font-bold flex items-center justify-center gap-2"
            style={{ backgroundColor: total === questionCount ? gold : colors.hairline, color: total === questionCount ? ink : slate, opacity: total === questionCount ? 1 : 0.75, display: chapter ? undefined : "none" }}
          >
            <CheckCircle2 size={16} /> Vérifier la séance
          </button>
              {!chapter && <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: colors.bg }}><p className="text-sm font-semibold" style={{ color: ink }}>Choisissez un niveau pour afficher les propositions.</p><p className="text-xs mt-1" style={{ color: slate }}>Vous pourrez examiner puis sélectionner de 1 à 10 questions.</p></div>}
            </section>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------- REVIEW ---
  if (view === "review") {
    return <div className="teacher-session-page min-h-screen w-full p-4 sm:p-8" style={{background:paper,fontFamily:fonts.body}}><div className="mx-auto max-w-3xl"><button type="button" onClick={()=>setView("setup")} className="inline-flex items-center gap-1 text-xs font-semibold" style={{color:slate}}><ArrowLeft size={14}/> Modifier la sélection</button><div className="mt-8 text-center"><p className="text-xs uppercase tracking-widest font-bold" style={{color:gold}}>Dernière vérification</p><h1 className="mt-2 text-3xl font-black" style={{fontFamily:fonts.display,color:ink}}>{sessionTitle||"Votre séance est prête"}</h1><p className="mt-2 text-sm" style={{color:slate}}>{sessionDate&&new Intl.DateTimeFormat("fr-FR",{dateStyle:"long"}).format(new Date(`${sessionDate}T12:00:00`))} · Contrôlez l’ordre, les énoncés et les réponses.</p></div><div className="mt-7 grid gap-3">{exercises.map((exercise,exerciseIndex)=><div key={`${exercise.prompt}-${exerciseIndex}`} className="rounded-2xl p-4" style={{backgroundColor:colors.card,boxShadow:shadow.soft}}><div className="flex items-start gap-3"><span className="shrink-0 flex items-center justify-center rounded-full text-xs font-black" style={{width:28,height:28,backgroundColor:gold,color:ink}}>{exerciseIndex+1}</span><div className="min-w-0 flex-1"><p className="text-[10px] uppercase tracking-wide font-bold" style={{color:slate}}>{exercise.chapter}</p><MathText as="p" text={exercise.prompt} className="mt-1 text-sm font-bold" style={{color:ink}}/>{exercise.figure&&<Figure spec={exercise.figure}/>} {exercise.graph&&<Graph spec={exercise.graph}/>}<p className="mt-2 text-xs" style={{color:colors.green}}>Réponse : <MathText text={teacherAnswer(exercise)}/></p>{hasTeacherOptions(exercise)&&<p className="mt-1 text-[10px]" style={{color:slate}}>Propositions : {exercise.options.map((option, optionIndex)=><span key={`${option}-${optionIndex}`}>{optionIndex ? " · " : ""}<MathText text={String(option)}/></span>)}</p>}</div></div></div>)}</div><div className="mt-6 grid gap-2 sm:grid-cols-2"><button type="button" onClick={()=>{setIndex(0);setView("diaporama");}} className="rounded-full py-3.5 font-black inline-flex items-center justify-center gap-2" style={{backgroundColor:gold,color:ink}}><Play size={16}/> Lancer la projection</button><button type="button" onClick={copySessionLink} className="rounded-full py-3.5 font-black inline-flex items-center justify-center gap-2" style={{backgroundColor:colors.card,color:ink,border:`1px solid ${colors.hairline}`}}><Copy size={16}/> Copier le lien de cette séance</button><button type="button" onClick={()=>printSession("student")} className="rounded-full py-3 font-bold inline-flex items-center justify-center gap-2" style={{backgroundColor:colors.card,color:ink,border:`1px solid ${colors.hairline}`}}><Printer size={15}/> PDF des questions</button><button type="button" onClick={()=>printSession("correction")} className="rounded-full py-3 font-bold inline-flex items-center justify-center gap-2" style={{backgroundColor:colors.card,color:ink,border:`1px solid ${colors.hairline}`}}><Printer size={15}/> PDF du corrigé</button></div>{shareMessage&&<p className="mt-3 text-center text-xs font-bold" style={{color:shareMessage.includes("copié")?colors.green:colors.red}}>{shareMessage}</p>}<p className="mt-3 text-center text-[10px]" style={{color:slate}}><Save size={11} className="inline mr-1"/>Le lien conserve le titre, la date, le minuteur et les cinq questions.</p></div><PrintableSession title={sessionTitle} date={sessionDate} levelId={levelId} exercises={exercises} withCorrections={printMode==="correction"}/></div>;
  }

  // ---------------------------------------------------------- DIAPORAMA ---
  if (view === "diaporama") {
    const exercise = exercises[index];
    const isLast = index === exercises.length - 1;
    return (
      <div className="min-h-screen w-full flex flex-col p-4 sm:p-10" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="flex items-center justify-between max-w-3xl w-full mx-auto mb-8">
          <button onClick={backToSetup} className="text-xs font-semibold flex items-center gap-1" style={{ color: slate }}>
            <Settings2 size={14} /> Quitter
          </button>
          <div className="text-center"><p className="text-xs font-semibold uppercase tracking-wide" style={{ color: gold, letterSpacing: "0.1em" }}>Question {index + 1} / {exercises.length}</p>{timerSeconds>0&&<p aria-live="polite" className="mt-1 inline-flex items-center gap-1 text-sm font-black" style={{color:timeLeft===0?colors.red:ink}}><Timer size={14}/>{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}</p>}</div>
          <button onClick={toggleFullscreen} className="text-xs font-semibold flex items-center gap-1" style={{ color: slate }}>
            <Maximize size={14} /> Plein écran
          </button>
        </div>

        <div className="max-w-3xl w-full mx-auto h-1.5 rounded-full overflow-hidden -mt-5 mb-5" style={{ backgroundColor: `${ink}0d` }}><div className="h-full rounded-full transition-all" style={{ width: `${((index + 1) / exercises.length) * 100}%`, backgroundColor: gold }} /></div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto text-center">
          <p className="text-xs font-bold mb-2" style={{color:gold}}>{sessionTitle}</p>
          <p className="text-sm uppercase tracking-wide font-semibold mb-4" style={{ color: slate }}>
            {exercise.chapter}
          </p>
          <div className="mb-5"><CalculationModeBadge exercise={exercise} large/></div>
          <MathText
            as="p"
            text={exercise.prompt}
            style={{ fontFamily: fonts.display, color: ink, fontSize: "clamp(1.5rem, 4vw, 2.4rem)", fontWeight: 700, lineHeight: 1.35 }}
          />

          {exercise.figure && (
            <div className="mt-6">
              <Figure spec={exercise.figure} projection />
            </div>
          )}
          {exercise.graph && (
            <div className="mt-6">
              <Graph spec={exercise.graph} />
            </div>
          )}

          {hasTeacherOptions(exercise) && (
            <div className="grid sm:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
              {exercise.options.map((opt, i) => (
                <div
                  key={i}
                  className="rounded-2xl px-5 py-4 text-lg flex items-center justify-center min-h-16"
                  style={{ backgroundColor: colors.card, boxShadow: shadow.soft, color: ink }}
                >
                  <MathText text={typeof opt === "string" ? opt : String(opt)} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-3xl w-full mx-auto mt-8">
          <button
            onClick={next}
            className="w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: gold, color: ink }}
          >
            {isLast ? "Voir les corrections" : "Suivant"}
            <ArrowRight size={20} />
          </button>
          <p className="hidden sm:block text-center text-[11px] mt-3" style={{ color: slate }}>Flèche droite, Entrée ou Espace pour avancer · F pour le plein écran</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------- CORRECTIONS --
  return (
    <div className="min-h-screen w-full p-4 sm:p-10" style={{ background: paper, fontFamily: fonts.body }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-7">
          <p className="text-xs tracking-widest uppercase mb-1 font-semibold" style={{ color: gold, letterSpacing: "0.12em" }}>
            Correction collective
          </p>
          <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {exercises.length === 1 ? "La réponse" : `Les ${exercises.length} réponses`}
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {exercises.map((ex, i) => (
            <div key={i} className="rounded-3xl p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
              <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: slate }}>
                Question {i + 1} — {ex.chapter}
              </p>
              <MathText as="p" text={ex.prompt} className="mb-3" style={{ fontFamily: fonts.mono, fontSize: "1.05rem", color: ink }} />
              {hasTeacherOptions(ex) && <ul>{ex.options.map((option, optionIndex) => <li key={optionIndex}><MathText text={String(option)} /></li>)}</ul>}
              {ex.figure && <Figure spec={ex.figure} />}
              {ex.graph && <Graph spec={ex.graph} />}
              <div className="rounded-xl px-4 py-2.5 mb-2 mt-2" style={{ backgroundColor: `${colors.green}14` }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: colors.green }}>
                  Réponse
                </p>
                <MathText text={teacherAnswer(ex)} style={{ color: ink, fontWeight: 700 }} />
              </div>
              {Array.isArray(ex.steps) && ex.steps.length > 0 && <StepsList steps={ex.steps} dark={false} />}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 mt-6">
          <button
            onClick={restartSameParams}
            className="w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: gold, color: ink }}
          >
            <RotateCcw size={16} /> Rejouer {exercises.length === 1 ? "cette question" : `ces ${exercises.length} questions`}
          </button>
          <button onClick={backToSetup} className="w-full py-2.5 rounded-full text-sm font-medium" style={{ color: slate }}>
            Modifier les réglages
          </button>
        </div>
      </div>
    </div>
  );
}
