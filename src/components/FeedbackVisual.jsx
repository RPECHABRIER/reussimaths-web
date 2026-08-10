import { ArrowDown, ArrowRight, Scale } from "lucide-react";
import { colors } from "../theme";

export default function FeedbackVisual({ family }) {
  if (["fractions", "fraction_equivalence", "fraction_comparison", "fraction_simplification"].includes(family)) {
    return (
      <div className="mt-4 rounded-xl bg-white p-3 overflow-hidden" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Des parts de même taille</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          {[3, 4].map((count) => <div key={count} className="flex h-10 flex-1 rounded-lg overflow-hidden" style={{ border: `1px solid ${colors.ink}25` }}>{Array.from({ length: count }, (_, index) => <span key={index} className="flex-1 border-r last:border-r-0" style={{ background: index === 0 ? `${colors.gold}55` : colors.bg, borderColor: `${colors.ink}25` }} />)}</div>)}
        </div>
        <p className="mt-2 text-[11px] text-center" style={{ color: colors.slate }}>Avant d’additionner, on découpe les deux unités avec les mêmes parts.</p>
      </div>
    );
  }
  if (["relative_numbers", "relative_product"].includes(family)) {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Se déplacer sur la droite graduée</p>
        <div className="relative mt-5 h-10"><div className="absolute left-2 right-2 top-3 h-0.5" style={{ background: colors.ink }} />{[-2,-1,0,1,2].map((n,i)=><div key={n} className="absolute top-1 text-[10px] text-center" style={{ left:`${5+i*22.5}%`, color:colors.slate }}><span className="block h-4 w-px mx-auto" style={{background:colors.ink}} />{n}</div>)}<ArrowRight size={18} color={colors.gold} className="absolute right-0 top-1 animate-pulse" /></div>
        <p className="text-[11px] text-center" style={{ color: colors.slate }}>Le signe donne le sens ; la distance à zéro donne la longueur du déplacement.</p>
      </div>
    );
  }
  if (["equations", "equation_test", "equation_product_zero", "equation_square"].includes(family)) {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Garder la balance à l’équilibre</p>
        <div className="mt-3 flex items-center justify-center gap-3 text-[11px] font-black" style={{ color: colors.ink }}><span className="rounded-lg px-3 py-2" style={{background:`${colors.green}18`}}>même action</span><Scale size={24} color={colors.gold} className="animate-pulse"/><span className="rounded-lg px-3 py-2" style={{background:`${colors.green}18`}}>même action</span></div>
        <p className="mt-2 text-[11px] text-center" style={{ color: colors.slate }}>Chaque transformation effectuée à gauche doit aussi être effectuée à droite.</p>
      </div>
    );
  }
  if (["proportionality", "percentage_from_counts"].includes(family)) {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Le retour à l’unité</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-black" style={{color:colors.ink}}><span className="rounded-lg px-3 py-2" style={{background:`${colors.ink}10`}}>plusieurs objets</span><ArrowRight size={16} color={colors.gold}/><span className="rounded-lg px-3 py-2 animate-pulse" style={{background:`${colors.gold}25`}}>1 objet</span><ArrowRight size={16} color={colors.gold}/><span className="rounded-lg px-3 py-2" style={{background:`${colors.green}18`}}>quantité voulue</span></div>
      </div>
    );
  }
  if (family === "percentage_change") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3 overflow-hidden" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Voir l’augmentation</p>
        <div className="mt-3 flex items-center gap-2 text-[11px] font-bold" style={{ color: colors.ink }}>
          <div className="h-8 rounded-lg flex items-center justify-center" style={{ width: "64%", background: `${colors.ink}18` }}>100 %</div>
          <div className="h-8 rounded-lg flex items-center justify-center animate-pulse" style={{ width: "22%", background: `${colors.gold}55` }}>+ 20 %</div>
        </div>
        <div className="flex justify-center my-1"><ArrowDown size={15} color={colors.gold} /></div>
        <div className="h-9 w-full rounded-lg flex items-center justify-center text-xs font-black" style={{ background: `${colors.green}18`, color: colors.green }}>120 % de la valeur initiale</div>
      </div>
    );
  }
  if (family === "function_antecedent") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Le sens de lecture</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold" style={{ color: colors.ink }}>
          <span className="rounded-lg px-3 py-2" style={{ background: `${colors.gold}18` }}>résultat connu</span>
          <ArrowRight size={17} color={colors.gold} className="animate-pulse" />
          <span className="rounded-lg px-3 py-2" style={{ background: `${colors.green}18` }}>nombre de départ recherché</span>
        </div>
      </div>
    );
  }
  if (family === "function_image") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>La machine à fonctions</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold" style={{color:colors.ink}}><span className="rounded-lg px-3 py-2" style={{background:`${colors.gold}18`}}>nombre de départ</span><ArrowRight size={17} color={colors.gold}/><span className="rounded-lg px-3 py-2 animate-pulse" style={{background:`${colors.ink}12`}}>fonction</span><ArrowRight size={17} color={colors.gold}/><span className="rounded-lg px-3 py-2" style={{background:`${colors.green}18`}}>image</span></div>
      </div>
    );
  }
  return null;
}
