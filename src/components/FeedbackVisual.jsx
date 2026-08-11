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
  if (family === "percentage_of_number") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Partager la quantité en pourcentages</p>
        <div className="mt-3 grid grid-cols-10 gap-1">{Array.from({ length: 10 }, (_, index) => <span key={index} className="h-8 rounded-md animate-pulse" style={{ background: index < 2 ? `${colors.gold}75` : `${colors.ink}12`, animationDelay: `${index * 60}ms` }} />)}</div>
        <p className="mt-2 text-[11px] text-center" style={{ color: colors.slate }}>Chaque bloc représente 10 % ; deux blocs représentent 20 %.</p>
      </div>
    );
  }
  if (["percentage_change", "percentage_coefficient"].includes(family)) {
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
  if (family.startsWith("probability" ) || family === "probabilities") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Favorables parmi tous les possibles</p>
        <div className="mt-3 grid grid-cols-5 gap-1.5">{Array.from({ length: 10 }, (_, index) => <span key={index} className="aspect-square rounded-full animate-pulse" style={{ background: index < 4 ? colors.green : `${colors.ink}16`, animationDelay: `${index * 70}ms` }} />)}</div>
        <p className="mt-2 text-[11px] text-center" style={{ color: colors.slate }}>On compte les cas favorables, puis on les compare à l’ensemble des cas possibles.</p>
      </div>
    );
  }
  if (family.startsWith("statistics")) {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Organiser les données avant de calculer</p>
        <div className="mt-4 flex items-end justify-center gap-2 h-14">{[2,4,3,6,5,8].map((height,index)=><span key={index} className="w-6 rounded-t-md transition-all" style={{height:`${height*6}px`,background:index===2||index===3?colors.gold:`${colors.ink}20`}} />)}</div>
      </div>
    );
  }
  if (family.startsWith("geometry") || family === "pythagoras") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3 overflow-hidden" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Lire la figure avant de choisir la propriété</p>
        <svg viewBox="0 0 240 95" className="mt-2 w-full h-auto" role="img" aria-label="Triangle animé avec données repérées">
          <path d="M35 75 L35 18 L200 75 Z" fill={`${colors.gold}12`} stroke={colors.ink} strokeWidth="3" strokeLinejoin="round" />
          <path d="M35 62 L48 62 L48 75" fill="none" stroke={colors.green} strokeWidth="3" />
          <circle cx="35" cy="18" r="5" fill={colors.gold}><animate attributeName="r" values="4;7;4" dur="1.8s" repeatCount="indefinite" /></circle>
          <text x="22" y="15" fontSize="11" fill={colors.ink}>A</text><text x="20" y="90" fontSize="11" fill={colors.ink}>B</text><text x="204" y="90" fontSize="11" fill={colors.ink}>C</text>
        </svg>
        <p className="text-[11px] text-center" style={{ color: colors.slate }}>Codages, positions et unités indiquent la propriété utile.</p>
      </div>
    );
  }
  if (["algebra_second_degree", "powers"].includes(family)) {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Identifier avant de calculer</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-black" style={{color:colors.ink}}>{["a", "b", "c"].map((letter,index)=><span key={letter} className="flex h-10 w-10 items-center justify-center rounded-xl animate-pulse" style={{background:[`${colors.green}20`,`${colors.gold}30`,`${colors.ink}12`][index],animationDelay:`${index*180}ms`}}>{letter}</span>)}</div>
        <p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>On conserve chaque signe lorsque l’on relève les coefficients.</p>
      </div>
    );
  }
  if (family === "calculus_derivative") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}>
        <p className="text-xs font-bold" style={{color:colors.ink}}>La dérivée donne la pente</p>
        <svg viewBox="0 0 240 100" className="mt-2 w-full"><path d="M15 85 Q85 88 115 55 T225 15" fill="none" stroke={colors.ink} strokeWidth="3"/><line x1="72" y1="83" x2="165" y2="35" stroke={colors.gold} strokeWidth="3" strokeDasharray="6 4"><animate attributeName="stroke-dashoffset" values="20;0" dur="1.4s" repeatCount="indefinite"/></line><circle cx="115" cy="55" r="5" fill={colors.green}/></svg>
      </div>
    );
  }
  if (family === "sequences") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Passer d’un terme au suivant</p><div className="mt-3 flex items-end justify-center gap-1">{[1,2,3,4,5].map((value,index)=><div key={value} className="flex items-center"><span className="flex w-8 items-center justify-center rounded-lg text-[10px] font-black" style={{height:`${24+index*7}px`,background:index===4?`${colors.green}25`:`${colors.gold}20`,color:colors.ink}}>u{index}</span>{index<4&&<ArrowRight size={13} color={colors.gold}/>}</div>)}</div></div>
    );
  }
  if (family === "exponential_logarithm") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Deux opérations réciproques</p><div className="mt-3 flex items-center justify-center gap-3 text-xs font-black" style={{color:colors.ink}}><span className="rounded-xl px-4 py-3" style={{background:`${colors.gold}20`}}>exposant</span><span className="animate-pulse" style={{color:colors.gold}}>⇄</span><span className="rounded-xl px-4 py-3" style={{background:`${colors.green}18`}}>logarithme</span></div></div>
    );
  }
  if (family === "algorithm_assignments") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Exécuter dans l’ordre</p><div className="mt-3 flex items-center justify-center gap-1 text-[10px] font-black" style={{color:colors.ink}}>{["départ","instruction 1","instruction 2","résultat"].map((label,index)=><div key={label} className="flex items-center"><span className="rounded-lg px-2 py-2" style={{background:index===3?`${colors.green}20`:`${colors.ink}10`}}>{label}</span>{index<3&&<ArrowRight size={12} color={colors.gold}/>}</div>)}</div></div>
    );
  }
  if (["area_conversion","volume_conversion","length_conversion","capacity_conversion"].includes(family)) {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Se déplacer entre les unités</p><div className="mt-3 flex justify-center gap-1">{["km","m","cm","mm"].map((unit,index)=><span key={unit} className="rounded-lg px-2.5 py-2 text-[10px] font-black animate-pulse" style={{background:index===1?`${colors.gold}35`:`${colors.ink}0d`,color:colors.ink,animationDelay:`${index*120}ms`}}>{unit}</span>)}</div></div>
    );
  }
  return (
    <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
      <p className="text-xs font-bold" style={{ color: colors.ink }}>Le chemin de la méthode</p>
      <div className="mt-3 flex items-center justify-center gap-2">{["Données", "Propriété", "Conclusion"].map((label,index)=><div key={label} className="flex items-center"><span className="rounded-lg px-2.5 py-2 text-[10px] font-black animate-pulse" style={{background:index===2?`${colors.green}20`:`${colors.gold}18`,color:colors.ink,animationDelay:`${index*160}ms`}}>{label}</span>{index<2&&<ArrowRight size={13} color={colors.gold}/>}</div>)}</div>
    </div>
  );
}
