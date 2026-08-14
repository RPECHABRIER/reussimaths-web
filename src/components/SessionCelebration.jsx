import { ArrowRight, BarChart3, Brain, CalendarClock, CheckCircle2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Mascot from "./Mascot";
import ProgressPath from "./ProgressPath";
import { colors, fonts, shadow } from "../theme";
import { trackProductEvent } from "../lib/productAnalytics";

function progressMessage(ratio) {
  if (ratio >= 0.8) return "La méthode est déjà solide. La prochaine séance vérifiera qu’elle reste disponible sans aide.";
  if (ratio >= 0.5) return "Tu as commencé à construire la méthode. Une courte révision permettra de la rendre plus sûre.";
  return "Tu as identifié ce qu’il faut retravailler. C’est une information utile : RéussiMaths va maintenant cibler ce point.";
}

export default function SessionCelebration({ chapterTitle, correct, total, discoverySignup, levelId, onContinue }) {
  const ratio = total > 0 ? correct / total : 0;
  const percent = Math.round(ratio * 100);
  const path = [
    { label: "Comprendre", done: true },
    { label: "S’entraîner", done: ratio >= .5 },
    { label: "Consolider", done: false },
    { label: "Maîtrisé", done: false },
  ];
  return (
    <div className="w-full max-w-lg rounded-[2rem] p-5 text-center sm:p-7" style={{background:colors.card,boxShadow:shadow.floating}}>
      <div className="mx-auto h-20 w-20"><Mascot size={80} style={{boxShadow:shadow.soft}}/></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[.18em]" style={{color:colors.gold}}>Séance accomplie</p>
      <h1 className="mt-1 text-2xl font-black" style={{fontFamily:fonts.display,color:colors.ink}}>{discoverySignup ? "Tu viens d’apprendre une vraie méthode" : "Cette notion vient de progresser"}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed" style={{color:colors.slate}}>{progressMessage(ratio)}</p>

      <div className="mt-5 grid grid-cols-2 gap-2 text-left">
        <div className="rounded-2xl p-3.5" style={{background:colors.bg}}><CheckCircle2 size={17} color={colors.green}/><p className="mt-2 text-xl font-black" style={{color:colors.ink}}>{correct}/{total}</p><p className="text-[10px]" style={{color:colors.slate}}>réponses réussies · {percent} %</p></div>
        <div className="rounded-2xl p-3.5" style={{background:`${colors.gold}10`}}><Brain size={17} color={colors.gold}/><p className="mt-2 truncate text-sm font-black" style={{color:colors.ink}}>{chapterTitle}</p><p className="text-[10px]" style={{color:colors.slate}}>notion travaillée aujourd’hui</p></div>
      </div>

      <div className="mt-4 rounded-2xl p-4 text-left" style={{background:colors.bg}}>
        <div className="mb-3 flex items-center justify-between"><p className="text-xs font-black" style={{color:colors.ink}}>Ton chemin de maîtrise</p><span className="flex items-center gap-1 text-[10px] font-bold" style={{color:colors.gold}}><CalendarClock size={12}/> prochaine révision programmée</span></div>
        <ProgressPath steps={path} activeIndex={ratio >= .5 ? 2 : 1} compact />
      </div>

      {discoverySignup ? <>
        <div className="mt-4 grid grid-cols-2 gap-2 text-left"><div className="rounded-2xl p-3" style={{background:`${colors.green}0d`}}><BarChart3 size={16} color={colors.green}/><p className="mt-1.5 text-xs font-black" style={{color:colors.ink}}>Garde ce progrès</p><p className="mt-0.5 text-[10px]" style={{color:colors.slate}}>Retrouve ta priorité et tes corrections.</p></div><div className="rounded-2xl p-3" style={{background:`${colors.gold}0d`}}><UserPlus size={16} color={colors.gold}/><p className="mt-1.5 text-xs font-black" style={{color:colors.ink}}>Espace gratuit</p><p className="mt-0.5 text-[10px]" style={{color:colors.slate}}>Un pseudo suffit, sans afficher ton nom.</p></div></div>
        <Link to="/compte" onClick={() => trackProductEvent("account_cta_clicked", { source: "trial_completed", levelId })} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-black" style={{background:colors.ink,color:colors.card}}>Créer mon espace gratuit <ArrowRight size={15}/></Link>
      </> : <button type="button" onClick={onContinue} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-black" style={{background:colors.ink,color:colors.card}}>Continuer mon parcours <ArrowRight size={15}/></button>}

      <Link to="/bilan" className="mt-3 inline-flex items-center gap-1 text-xs font-black" style={{color:colors.gold}}>Montrer ce progrès à mes parents <ArrowRight size={13}/></Link>
      {discoverySignup && <button type="button" onClick={onContinue} className="mt-3 block w-full text-xs font-semibold" style={{color:colors.slate}}>Continuer sans compte</button>}
    </div>
  );
}
