import { useState } from "react";
import { ArrowRight, Check, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import MathText from "./MathText";
import { colors, fonts, shadow } from "../theme";

function PartitionedFraction({ label, groups, split, filled, color, result }) {
  return (
    <div className="rounded-xl p-3" style={{ background: colors.bg }}>
      <div className="flex items-center justify-between gap-2">
        <MathText text={`\\(${label}\\)`} />
        <span className="text-[10px] font-bold" style={{ color: colors.slate }}>{result}</span>
      </div>
      <div className="mt-2 grid h-12 overflow-hidden rounded-lg" style={{ gridTemplateColumns: `repeat(${groups}, minmax(0, 1fr))`, border: `2px solid ${colors.ink}` }}>
        {Array.from({ length: groups }, (_, groupIndex) => (
          <div key={groupIndex} className="grid" style={{ gridTemplateColumns: `repeat(${split}, minmax(0, 1fr))`, borderLeft: groupIndex ? `2px solid ${colors.ink}` : "none" }}>
            {Array.from({ length: split }, (_, partIndex) => (
              <span key={partIndex} style={{ background: groupIndex < filled ? color : "white", borderLeft: partIndex ? "1px solid rgba(27,42,74,.3)" : "none" }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

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
            {["2/5","2/6","5/6"].map((option)=><button key={option} type="button" onClick={()=>setAnswer(option)} className="rounded-2xl py-3 text-sm font-black transition-transform active:scale-95" style={{background:answer===option?(option==="5/6"?`${colors.green}18`:`${colors.red}12`):colors.bg,color:answer===option?(option==="5/6"?colors.green:colors.red):colors.ink,border:`1px solid ${answer===option?(option==="5/6"?colors.green:colors.red):colors.hairline}`}}><MathText text={option}/></button>)}
          </div>
          {answer && <button type="button" onClick={()=>setAnswer(null)} className="mx-auto mt-4 flex items-center gap-1 text-[11px] font-bold" style={{color:colors.slate}}><RotateCcw size={12}/> Recommencer</button>}
        </div>
        <div className="rounded-[1.75rem] p-5" style={{background:answer?(correct?`${colors.green}0d`:`${colors.gold}0d`):colors.card,boxShadow:shadow.soft,border:`1px solid ${answer?(correct?`${colors.green}35`:`${colors.gold}35`):colors.hairline}`}}>
          {!answer ? <div className="flex min-h-48 flex-col items-center justify-center text-center"><Lightbulb size={28} color={colors.gold}/><p className="mt-3 text-sm font-black" style={{color:colors.ink}}>L’explication s’adaptera à ta réponse</p><p className="mt-1 max-w-sm text-xs leading-relaxed" style={{color:colors.slate}}>Choisis volontairement une réponse, même fausse : c’est là que l’apprentissage commence.</p></div> : <>
            <p className="flex items-start gap-2 text-sm font-black" style={{color:correct?colors.green:colors.ink}}><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{background:correct?colors.green:colors.gold}}>{correct?<Check size={12} color="white"/>:<Lightbulb size={12} color={colors.ink}/>}</span>{correct?"Oui : tu as trouvé un dénominateur commun.":"Non : on ne peut pas additionner des parts de tailles différentes."}</p>
            <div className="mt-4 rounded-2xl bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-wide" style={{color:colors.gold}}>Comprendre visuellement</p>
              <p className="mt-2 text-xs leading-relaxed" style={{color:colors.slate}}>On partage chaque demi en 3 parts égales et chaque tiers en 2 parts égales. Les morceaux obtenus ont alors tous la même taille : ce sont des sixièmes.</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <PartitionedFraction label={"\\dfrac{1}{2}"} groups={2} split={3} filled={1} color={`${colors.green}d9`} result="1 demi → 3 sixièmes" />
                <PartitionedFraction label={"\\dfrac{1}{3}"} groups={3} split={2} filled={1} color={`${colors.gold}d9`} result="1 tiers → 2 sixièmes" />
              </div>
              <div className="mt-3 rounded-xl p-3" style={{ background: `${colors.ink}06` }}>
                <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: colors.ink }}>On réunit les parts</p>
                <div className="mt-2 grid h-9 grid-cols-6 overflow-hidden rounded-lg" aria-label="Trois sixièmes verts plus deux sixièmes dorés donnent cinq sixièmes" style={{ border: `2px solid ${colors.ink}` }}>
                  {Array.from({length:6},(_,i)=><span key={i} style={{background:i<3?`${colors.green}d9`:i<5?`${colors.gold}d9`:"white",borderLeft:i?"1px solid rgba(27,42,74,.35)":"none"}}/>)}
                </div>
                <p className="mt-2 text-center text-xs font-black" style={{ color: colors.ink }}>3 sixièmes + 2 sixièmes = 5 sixièmes</p>
              </div>
              <p className="mt-4 text-xs leading-relaxed" style={{color:colors.slate}}>On ne change pas la valeur d’une fraction lorsqu’on multiplie son numérateur et son dénominateur par un même nombre non nul. On peut donc mettre les deux fractions au même dénominateur.</p>
              <div className="mt-3 rounded-xl p-3 text-center text-sm font-black" style={{ background: colors.bg, color: colors.ink }}>
                <MathText text={`\\[\\dfrac{1}{2}+\\dfrac{1}{3}=\\dfrac{1\\times3}{2\\times3}+\\dfrac{1\\times2}{3\\times2}=\\dfrac{3}{6}+\\dfrac{2}{6}=\\dfrac{5}{6}\\]`}/>
              </div>
            </div>
            <p className="mt-3 text-xs font-black" style={{color:colors.ink}}>À retenir : on obtient d’abord des parts de même taille, puis on additionne uniquement les numérateurs.</p>
          </>}
        </div>
      </div>
      <div className="mt-5 text-center"><Link to="/niveaux?objectif=essai" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black" style={{background:colors.ink,color:colors.card}}>Faire mon diagnostic gratuit <ArrowRight size={15}/></Link></div>
    </section>
  );
}
