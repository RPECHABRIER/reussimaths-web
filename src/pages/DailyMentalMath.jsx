import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Brain, Clock3, Target, Trophy, TrendingUp } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useDailyStreak } from "../hooks/useDailyStreak";
import { useSkillTracking } from "../hooks/useSkillTracking";
import { usePracticeHeartbeat } from "../hooks/usePracticeHeartbeat";
import { getEffectiveSubscription, isAdminUser, isFullAccessSubscription } from "../lib/access";
import { buildDailyMentalQuestions, localDateKey, recommendedAdjustment } from "../lib/dailyMentalMath";
import { parseNumericInput } from "../lib/answerMatch";
import { supabase } from "../lib/supabaseClient";
import CalculationModeBadge from "../components/CalculationModeBadge";
import { colors, fonts, shadow } from "../theme";

const QUESTION_SECONDS = 18;

export default function DailyMentalMath() {
  const { levelId } = useParams();
  const { user } = useAuth();
  usePracticeHeartbeat(user?.id);
  const dailyStreak = useDailyStreak(user?.id);
  const skillTracking = useSkillTracking(user?.id);
  const { subscription: raw, loading } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, raw);
  const allowed = isAdminUser(user) || (isFullAccessSubscription(subscription) && (subscription?.admin_granted || subscription?.subscription_level === levelId));
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const goalKey = `reussimaths_mental_goal_${user?.id ?? "anonymous"}_${levelId}`;
  const [goal, setGoal] = useState(() => Number(localStorage.getItem(goalKey)) || 8);
  const adjustment = useMemo(() => recommendedAdjustment(history), [history]);
  const questions = useMemo(() => buildDailyMentalQuestions(levelId, new Date(), adjustment), [levelId, adjustment]);
  const [phase, setPhase] = useState("intro");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [feedback, setFeedback] = useState(null);
  const startedAt = useRef(0);
  const locked = useRef(false);
  const exercise = questions[index];

  useEffect(() => {
    if (!user?.id || !allowed) { setHistoryLoading(false); return; }
    const since = new Date(); since.setDate(since.getDate() - 30);
    supabase.from("daily_mental_sessions").select("session_date,score,total,duration_ms,attempts").eq("user_id", user.id).eq("level_id", levelId).gte("session_date", localDateKey(since)).order("session_date", { ascending: false }).then(({data,error})=>{if(error)console.error("[DailyMentalMath] historique :",error.message);setHistory(data??[]);setHistoryLoading(false);});
  }, [user?.id, allowed, levelId]);

  const periodStats = (days) => { const cutoff=new Date();cutoff.setDate(cutoff.getDate()-(days-1));const rows=history.filter((item)=>item.session_date>=localDateKey(cutoff));return {days:rows.length,average:rows.length?(rows.reduce((sum,item)=>sum+item.score,0)/rows.length).toFixed(1):"—",best:rows.length?Math.max(...rows.map((item)=>item.score)):"—"}; };
  const stats7=periodStats(7),stats30=periodStats(30);

  const chooseGoal=(value)=>{setGoal(value);try{localStorage.setItem(goalKey,String(value));}catch{/* objectif disponible pour la session */}};
  useEffect(()=>{try{setGoal(Number(localStorage.getItem(goalKey))||8);}catch{setGoal(8);}},[goalKey]);

  const finish = async (finalScore) => {
    setPhase("result");
    if (!user?.id) return;
    const today=history.find((item)=>item.session_date===localDateKey());
    const duration=Date.now()-startedAt.current;
    const bestScore=Math.max(finalScore,today?.score??0);
    const bestDuration=!today||finalScore>today.score||(finalScore===today.score&&duration<today.duration_ms)?duration:today.duration_ms;
    const row={
      user_id: user.id,
      session_date: localDateKey(),
      level_id: levelId,
      score: bestScore,
      total: questions.length,
      duration_ms: bestDuration,
      attempts:(today?.attempts??0)+1,
      completed_at:new Date().toISOString(),
    };
    const { error } = await supabase.from("daily_mental_sessions").upsert(row, { onConflict: "user_id,session_date,level_id" });
    if (error) console.error("[DailyMentalMath] sauvegarde :", error.message);
    else setHistory((current)=>[row,...current.filter((item)=>item.session_date!==row.session_date)]);
  };

  const advance = (correct) => {
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    if (index + 1 >= questions.length) { finish(nextScore); return; }
    setIndex((value) => value + 1);
    setInput(""); setFeedback(null); setTimeLeft(QUESTION_SECONDS); locked.current = false;
  };

  const answer = (timedOut = false) => {
    if (locked.current) return;
    const value = parseNumericInput(input);
    const correct = !timedOut && Number.isFinite(value) && Math.abs(value - exercise.answer) < 0.001;
    locked.current = true;
    skillTracking.recordAttempt({ skillId: exercise.prompt.includes("%") ? "calcul-mental-pourcentages" : "calcul-mental-operations", chapterId: "calcul-mental-quotidien", correct });
    setFeedback({ correct, timedOut });
    window.setTimeout(() => advance(correct), correct ? 650 : 1400);
  };

  useEffect(() => {
    if (phase !== "running" || feedback) return undefined;
    const interval = window.setInterval(() => setTimeLeft((value) => {
      if (value <= 1) { window.clearInterval(interval); window.setTimeout(() => answer(true), 0); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(interval);
  }, [phase, index, feedback]);

  const start = () => {
    setIndex(0); setScore(0); setInput(""); setFeedback(null); setTimeLeft(QUESTION_SECONDS);
    locked.current = false; startedAt.current = Date.now(); dailyStreak.markPracticed(); setPhase("running");
  };

  if (loading || historyLoading) return <div className="min-h-screen grid place-items-center" style={{ background: colors.bg }}>Chargement…</div>;
  if (!user || !allowed) return <Shell><Brain className="mx-auto" color={colors.gold}/><h1 className="mt-3 text-2xl font-black" style={{color:colors.ink}}>Le calcul mental du jour</h1><p className="mt-2 text-sm" style={{color:colors.slate}}>Cette série quotidienne fait partie de l’abonnement complet.</p><Link to="/compte" className="mt-5 inline-flex rounded-full px-5 py-3 font-bold" style={{backgroundColor:colors.ink,color:colors.bg}}>Voir l’abonnement</Link></Shell>;

  if (phase === "intro") return <Shell wide>
    <Brain size={38} className="mx-auto" color={colors.green}/>
    <p className="mt-4 text-xs font-black uppercase tracking-widest" style={{color:colors.green}}>Série du {new Date().toLocaleDateString("fr-FR")}</p>
    <h1 className="mt-2 text-3xl font-black" style={{fontFamily:fonts.display,color:colors.ink}}>10 réflexes pour progresser</h1>
    <p className="mt-3 text-sm" style={{color:colors.slate}}>Les quatre opérations et deux calculs de pourcentage. Tu disposes de 18 secondes par question, toujours sans calculatrice.</p>
    <div className="mt-5 flex flex-wrap justify-center gap-3"><CalculationModeBadge exercise={{calculationMode:"mental"}} large/><span className="inline-flex items-center gap-1 text-xs font-bold" style={{color:colors.ink}}><Clock3 size={15}/> 3 minutes environ</span></div>
    <div className="mt-5 grid grid-cols-2 gap-2 text-left"><StatCard label="7 derniers jours" stats={stats7}/><StatCard label="30 derniers jours" stats={stats30}/></div>
    <div className="mt-4 rounded-2xl p-3 text-left" style={{backgroundColor:colors.bg}}><p className="text-xs font-black" style={{color:colors.ink}}><Target size={14} className="inline mr-1"/>Mon objectif quotidien</p><div className="mt-2 grid grid-cols-3 gap-2">{[6,8,10].map((value)=><button key={value} onClick={()=>chooseGoal(value)} className="rounded-full py-2 text-xs font-black" style={{backgroundColor:goal===value?colors.green:colors.card,color:goal===value?"white":colors.ink,border:`1px solid ${colors.hairline}`}}>{value}/10</button>)}</div></div>
    <p className="mt-3 text-xs" style={{color:colors.slate}}><TrendingUp size={14} className="inline mr-1"/>{adjustment>0?"Les derniers résultats sont solides : les nombres montent légèrement en difficulté.":adjustment<0?"La série allège temporairement les nombres pour consolider les réflexes.":"La difficulté reste stable et adaptée au niveau."}</p>
    <button onClick={start} className="mt-5 w-full rounded-full py-3.5 font-black" style={{backgroundColor:colors.gold,color:colors.ink}}>Commencer</button>
    <Link to={`/niveau/${levelId}`} className="mt-4 inline-block text-xs font-bold" style={{color:colors.slate}}>Retour au niveau</Link>
  </Shell>;

  if (phase === "result") return <Shell><Trophy size={40} className="mx-auto" color={score>=goal?colors.green:colors.gold}/><h1 className="mt-3 text-3xl font-black" style={{color:colors.ink}}>{score} / 10</h1><p className="mt-2 text-sm font-bold" style={{color:score>=goal?colors.green:colors.slate}}>{score>=goal?`Objectif de ${goal}/10 atteint !`:`Encore ${goal-score} point${goal-score>1?"s":""} pour atteindre ton objectif.`}</p><p className="mt-2 text-xs" style={{color:colors.slate}}>Le meilleur score de chaque journée est conservé. Rejouer permet de battre ton record sans effacer un meilleur résultat.</p><button onClick={start} className="mt-5 w-full rounded-full py-3 font-black" style={{backgroundColor:colors.gold,color:colors.ink}}>Rejouer la série</button><Link to={`/niveau/${levelId}`} className="mt-4 inline-block text-xs font-bold" style={{color:colors.slate}}>Continuer mon parcours</Link></Shell>;

  return <div className="min-h-screen flex flex-col p-4 sm:p-8" style={{background:colors.bg,fontFamily:fonts.body}}><div className="mx-auto w-full max-w-2xl"><div className="flex items-center justify-between"><CalculationModeBadge exercise={exercise} large/><p className="text-sm font-black" style={{color:timeLeft<=5?colors.red:colors.ink}}>{timeLeft} s</p></div><div className="mt-3 h-2 overflow-hidden rounded-full" style={{backgroundColor:colors.hairline}}><div className="h-full transition-all duration-1000" style={{width:`${timeLeft/QUESTION_SECONDS*100}%`,backgroundColor:timeLeft<=5?colors.red:colors.green}}/></div><p className="mt-8 text-center text-xs font-bold uppercase tracking-widest" style={{color:colors.slate}}>Question {index+1} / 10</p><div className="mt-4 rounded-[2rem] p-7 text-center" style={{backgroundColor:colors.card,boxShadow:shadow.raised}}><p className="text-3xl sm:text-5xl font-black" style={{fontFamily:fonts.mono,color:colors.ink}}>{exercise.prompt}</p><input autoFocus inputMode="decimal" value={input} disabled={!!feedback} onChange={(event)=>setInput(event.target.value)} onKeyDown={(event)=>event.key==="Enter"&&answer(false)} placeholder="Ta réponse" className="mt-7 w-full rounded-2xl p-4 text-center text-2xl font-black" style={{backgroundColor:colors.bg,color:colors.ink,border:`1px solid ${colors.hairline}`}}/><button disabled={!input.trim()||!!feedback} onClick={()=>answer(false)} className="mt-3 w-full rounded-full py-3.5 font-black" style={{backgroundColor:colors.ink,color:colors.bg,opacity:(!input.trim()||feedback)?0.6:1}}>Valider <ArrowRight size={17} className="inline"/></button>{feedback&&<div className="mt-4 rounded-2xl p-3 text-sm font-bold" style={{backgroundColor:feedback.correct?`${colors.green}15`:`${colors.red}12`,color:feedback.correct?colors.green:colors.ink}}>{feedback.correct?"Oui, bon réflexe !":<>{feedback.timedOut?"Temps écoulé. ":"Pas encore. "}{exercise.method}</>}</div>}</div></div></div>;
}

function Shell({ children, wide = false }) {
  return <div className="min-h-screen grid place-items-center p-5 text-center" style={{background:colors.bg,fontFamily:fonts.body}}><div className={`${wide?"max-w-lg":"max-w-md"} w-full rounded-[2rem] p-7`} style={{backgroundColor:colors.card,boxShadow:shadow.raised}}>{children}</div></div>;
}

function StatCard({label,stats}){return <div className="rounded-2xl p-3" style={{backgroundColor:colors.bg}}><p className="text-[10px] font-black uppercase" style={{color:colors.slate}}>{label}</p><p className="mt-1 text-lg font-black" style={{color:colors.ink}}>{stats.average}/10</p><p className="text-[10px]" style={{color:colors.slate}}>{stats.days} jour{stats.days>1?"s":""} · record {stats.best}/10</p></div>}
