import { useState } from "react";
import { ArrowRight, Check, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import MathText from "./MathText";
import { colors, fonts, shadow } from "../theme";

export default function HomeLearningDemo() {
  const [answer, setAnswer] = useState(null);
  const correct = answer === "5/6";
  return (
    <section className="home-learning-demo mt-16 sm:mt-24" aria-labelledby="demo-title">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-black uppercase tracking-widest" style={{color:colors.gold}}>Essaie une vraie explication</p>
        <h2 id="demo-title" className="mt-2 text-2xl font-black sm:text-3xl" style={{color:colors.ink,fontFamily:fonts.display}}>Une erreur devient une méthode comprise</h2>
        <p className="mt-2 text-sm leading-relaxed" style={{color:colors.slate}}>Choisis une réponse : RéussiMaths ne donne pas seulement le résultat, il explique le raisonnement.</p>
      </div>
      <div className="mx-auto mt-7 grid max-w-4xl gap-4 lg:grid-cols-[.82fr_1.18fr]">
        <div className="rounded-[1.75rem] p-5" style={{background:colors.card,boxShadow:shadow.soft}}>
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black" style={{background:`${colors.gold}18`,color:colors.gold}}><Sparkles size={11}/> Fractions</span>
          <p className="mt-5 text-lg font-black leading-relaxed" style={{color:colors.ink}}>Calcule <MathText text={`\\(\\dfrac{1}{2}+\\dfrac{1}{3}\\)`}/>.</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["2/5","2/6","5/6"].map((option)=><button key={option} type="button" onClick={()=>setAnswer(option)} className="rounded-2xl py-3 text-sm font-black transition-transform active:scale-95" style={{background:answer===option?(option==="5/6"?`${colors.green}18`:`${colors.red}12`):colors.bg,color:answer===option?(option==="5/6"?colors.green:colors.red):colors.ink,border:`1px solid ${answer===option?(option==="5/6"?colors.green:colors.red):colors.hairline}`}}>{option}</button>)}
          </div>
          {answer && <button type="button" onClick={()=>setAnswer(null)} className="mx-auto mt-4 flex items-center gap-1 text-[11px] font-bold" style={{color:colors.slate}}><RotateCcw size={12}/> Recommencer</button>}
        </div>
        <div className="rounded-[1.75rem] p-5" style={{background:answer?(correct?`${colors.green}0d`:`${colors.gold}0d`):colors.card,boxShadow:shadow.soft,border:`1px solid ${answer?(correct?`${colors.green}35`:`${colors.gold}35`):colors.hairline}`}}>
          {!answer ? <div className="flex min-h-48 flex-col items-center justify-center text-center"><Lightbulb size={28} color={colors.gold}/><p className="mt-3 text-sm font-black" style={{color:colors.ink}}>L’explication s’adaptera à ta réponse</p><p className="mt-1 max-w-sm text-xs leading-relaxed" style={{color:colors.slate}}>Choisis volontairement une réponse, même fausse : c’est là que l’apprentissage commence.</p></div> : <>
            <p className="flex items-start gap-2 text-sm font-black" style={{color:correct?colors.green:colors.ink}}><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{background:correct?colors.green:colors.gold}}>{correct?<Check size={12} color="white"/>:<Lightbulb size={12} color={colors.ink}/>}</span>{correct?"Oui : tu as trouvé un dénominateur commun.":"Non : on ne peut pas additionner des parts de tailles différentes."}</p>
            <div className="mt-4 rounded-2xl bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-wide" style={{color:colors.gold}}>Comprendre visuellement</p>
              <div className="mt-3 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 text-center text-sm font-black" style={{color:colors.ink}}><MathText text={`\\(\\frac{1}{2}=\\frac{3}{6}\\)`}/><span>+</span><MathText text={`\\(\\frac{1}{3}=\\frac{2}{6}\\)`}/><span>=</span><MathText text={`\\(\\frac{5}{6}\\)`}/></div>
              <div className="mt-3 grid grid-cols-6 gap-1" aria-label="Cinq sixièmes coloriés">{Array.from({length:6},(_,i)=><span key={i} className="h-7 rounded-md" style={{background:i<5?colors.green:`${colors.ink}0d`}}/>)}</div>
              <p className="mt-3 text-xs leading-relaxed" style={{color:colors.slate}}>Les deux fractions sont transformées en sixièmes : les parts ont enfin la même taille. On additionne alors 3 parts et 2 parts.</p>
            </div>
            <p className="mt-3 text-xs font-black" style={{color:colors.ink}}>À retenir : même dénominateur, puis addition des numérateurs.</p>
          </>}
        </div>
      </div>
      <div className="mt-5 text-center"><Link to="/niveaux?objectif=essai" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black" style={{background:colors.ink,color:colors.card}}>Faire mon diagnostic gratuit <ArrowRight size={15}/></Link></div>
    </section>
  );
}
