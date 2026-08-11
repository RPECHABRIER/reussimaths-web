import { ArrowDown, ArrowRight, Scale } from "lucide-react";
import { colors } from "../theme";

function valuesFrom(exercise) {
  return `${exercise?.prompt ?? ""}`.match(/−?-?\d+(?:[,.]\d+)?(?:\s*(?:km\/h|cm²|cm³|cm|m²|m³|m|°|€|%))?/g)?.slice(0, 4) ?? [];
}

export default function FeedbackVisual({ family, exercise }) {
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
  if (["fraction_of_number", "fraction_multiplication"].includes(family)) {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Partager, puis prendre le nombre de parts</p><div className="mt-3 grid grid-cols-4 gap-1">{Array.from({length:8},(_,index)=><span key={index} className="h-8 rounded-md" style={{background:index<6?`${colors.gold}65`:`${colors.ink}10`,animation:`pulse 1.8s ${index*80}ms infinite`}} />)}</div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Le dénominateur partage la quantité ; le numérateur indique combien de parts on prend.</p></div>;
  }
  if (["whole_number_place_value", "decimal_place_value", "rounding"].includes(family)) {
    return <div className="mt-4 rounded-xl bg-white p-3 overflow-x-auto" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Chaque chiffre a une place</p><div className="mt-3 grid min-w-[310px] grid-cols-5 text-center text-[10px] font-bold" style={{color:colors.ink}}>{["centaines","dizaines","unités","dixièmes","centièmes"].map((label,index)=><div key={label} className="border px-1 py-2" style={{borderColor:`${colors.ink}30`,background:index===2?`${colors.gold}35`:colors.bg}}><span>{label}</span><span className="mt-1 block text-base" style={{color:index===2?colors.gold:colors.ink}}>{["1","2","3","4","5"][index]}</span></div>)}</div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>On repère d’abord la colonne demandée avant de lire, calculer ou arrondir.</p></div>;
  }
  if (family === "arithmetic_order") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Respecter l’ordre des opérations</p><div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-black" style={{color:colors.ink}}>{["Parenthèses","× et ÷","+ et −"].map((label,index)=><div key={label} className="flex items-center"><span className="rounded-lg px-2 py-2" style={{background:index===0?`${colors.gold}30`:`${colors.ink}0d`}}>{label}</span>{index<2&&<ArrowRight size={13} color={colors.gold}/>}</div>)}</div></div>;
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
  if (["function_affine_coefficients", "function_variations", "function_domain"].includes(family)) {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Lire les informations dans le bon ordre</p><svg viewBox="0 0 240 95" className="mt-2 w-full"><line x1="18" y1="76" x2="225" y2="76" stroke={colors.ink} strokeWidth="2"/><line x1="38" y1="88" x2="38" y2="10" stroke={colors.ink} strokeWidth="2"/><path d="M38 68 L92 48 L145 57 L211 20" fill="none" stroke={colors.gold} strokeWidth="4" strokeDasharray="8 5"><animate attributeName="stroke-dashoffset" values="26;0" dur="1.6s" repeatCount="indefinite"/></path><circle cx="92" cy="48" r="5" fill={colors.green}/><circle cx="145" cy="57" r="5" fill={colors.green}/></svg><p className="text-[11px] text-center" style={{color:colors.slate}}>Domaine, variations et coefficients ne répondent pas à la même question : on identifie d’abord ce qui est demandé.</p></div>;
  }
  if (family === "distributivity") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Le facteur multiplie tous les termes</p><div className="mt-3 flex items-center justify-center gap-2 text-sm font-black" style={{color:colors.ink}}><span className="rounded-lg p-2" style={{background:`${colors.gold}30`}}>3</span><span>×</span><span className="rounded-lg p-2" style={{background:`${colors.ink}0d`}}>( x + 4 )</span></div><div className="mt-2 flex justify-center gap-8 text-xs font-bold" style={{color:colors.green}}><span className="animate-pulse">↘ 3 × x</span><span className="animate-pulse">↙ 3 × 4</span></div></div>;
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
    const values = valuesFrom(exercise);
    if (family === "geometry_circle_measure") {
      return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Repérer rayon, diamètre et grandeur demandée</p><svg viewBox="0 0 240 115" className="mt-2 w-full"><circle cx="120" cy="58" r="43" fill={`${colors.gold}12`} stroke={colors.ink} strokeWidth="3"/><line x1="120" y1="58" x2="163" y2="58" stroke={colors.gold} strokeWidth="4"><animate attributeName="stroke-dasharray" values="0 50;50 0" dur="1.4s" repeatCount="indefinite"/></line><circle cx="120" cy="58" r="4" fill={colors.green}/><text x="130" y="50" fontSize="12" fill={colors.ink}>{values[0] ? `r = ${values[0]}` : "rayon"}</text></svg></div>;
    }
    if (family === "geometry_coordinates" || family === "geometry_vectors") {
      return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Lire horizontalement, puis verticalement</p><svg viewBox="0 0 240 120" className="mt-2 w-full"><line x1="20" y1="70" x2="225" y2="70" stroke={colors.ink} strokeWidth="2"/><line x1="95" y1="108" x2="95" y2="12" stroke={colors.ink} strokeWidth="2"/><path d="M95 70 L170 70 L170 30" fill="none" stroke={colors.gold} strokeWidth="3" strokeDasharray="7 4"><animate attributeName="stroke-dashoffset" values="22;0" dur="1.5s" repeatCount="indefinite"/></path><circle cx="170" cy="30" r="5" fill={colors.green}/><text x="176" y="27" fontSize="11" fill={colors.ink}>{values.length ? `(${values.slice(0,2).join(" ; ")})` : "point"}</text></svg></div>;
    }
    if (family === "geometry_volume") {
      return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Voir les trois dimensions</p><svg viewBox="0 0 240 125" className="mt-2 w-full"><path d="M45 45 L155 45 L195 22 L85 22 Z M45 45 L45 100 L155 100 L155 45 M155 100 L195 76 L195 22 M45 100 L85 76 L195 76 M85 76 L85 22" fill={`${colors.gold}09`} stroke={colors.ink} strokeWidth="2"/><path d="M45 108 L155 108" stroke={colors.gold} strokeWidth="3"><animate attributeName="stroke-dasharray" values="0 120;120 0" dur="1.5s" repeatCount="indefinite"/></path><text x="88" y="122" fontSize="11" fill={colors.ink}>{values[0] ?? "base"}</text><text x="202" y="55" fontSize="11" fill={colors.ink}>{values[1] ?? "hauteur"}</text></svg></div>;
    }
    return (
      <div className="mt-4 rounded-xl bg-white p-3 overflow-hidden" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Lire la figure avant de choisir la propriété</p>
        <svg viewBox="0 0 240 95" className="mt-2 w-full h-auto" role="img" aria-label="Triangle animé avec données repérées">
          <path d="M35 75 L35 18 L200 75 Z" fill={`${colors.gold}12`} stroke={colors.ink} strokeWidth="3" strokeLinejoin="round" />
          <path d="M35 62 L48 62 L48 75" fill="none" stroke={colors.green} strokeWidth="3" />
          <circle cx="35" cy="18" r="5" fill={colors.gold}><animate attributeName="r" values="4;7;4" dur="1.8s" repeatCount="indefinite" /></circle>
          <text x="22" y="15" fontSize="11" fill={colors.ink}>A</text><text x="20" y="90" fontSize="11" fill={colors.ink}>B</text><text x="204" y="90" fontSize="11" fill={colors.ink}>C</text><text x="42" y="48" fontSize="11" fill={colors.ink}>{values[0] ?? ""}</text><text x="112" y="89" fontSize="11" fill={colors.ink}>{values[1] ?? ""}</text>
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
