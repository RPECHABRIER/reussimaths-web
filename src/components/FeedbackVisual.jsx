import { ArrowDown, ArrowRight, Scale } from "lucide-react";
import { colors } from "../theme";

function valuesFrom(exercise) {
  return `${exercise?.prompt ?? ""}`.match(/−?-?\d+(?:[,.]\d+)?(?:\s*(?:km\/h|cm²|cm³|cm|m²|m³|m|°|€|%))?/g)?.slice(0, 4) ?? [];
}

function fractionsFrom(exercise) {
  return [...`${exercise?.prompt ?? ""}`.matchAll(/(\d+)\s*\/\s*(\d+)/g)]
    .slice(0, 2)
    .map((match) => ({ numerator: Number(match[1]), denominator: Number(match[2]) }))
    .filter(({ numerator, denominator }) => denominator > 0 && denominator <= 12 && numerator >= 0);
}

export default function FeedbackVisual({ family, exercise }) {
  if (["fractions", "fraction_equivalence", "fraction_comparison", "fraction_simplification"].includes(family)) {
    const parsedFractions = fractionsFrom(exercise);
    const strips = parsedFractions.length === 2 ? parsedFractions : [{ numerator: 1, denominator: 3 }, { numerator: 1, denominator: 4 }];
    return (
      <div className="mt-4 rounded-xl bg-white p-3 overflow-hidden" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Des parts de même taille</p>
        <div className="mt-3 grid gap-2">
          {strips.map(({ numerator, denominator }, stripIndex) => <div key={`${numerator}-${denominator}-${stripIndex}`} className="flex items-center gap-2"><span className="w-9 shrink-0 text-center text-xs font-black" style={{color:colors.ink}}>{numerator}/{denominator}</span><div className="flex h-9 flex-1 rounded-lg overflow-hidden" style={{ border: `1px solid ${colors.ink}25` }}>{Array.from({ length: denominator }, (_, index) => <span key={index} className="flex-1 border-r last:border-r-0" style={{ background: index < numerator ? `${colors.gold}65` : colors.bg, borderColor: `${colors.ink}25`, animation:index<numerator?`pulse 1.8s ${index*90}ms infinite`:undefined }} />)}</div></div>)}
        </div>
        <p className="mt-2 text-[11px] text-center" style={{ color: colors.slate }}>Les bandes représentent les fractions de la question. Pour les additionner ou les comparer, on les redécoupe en parts de même taille.</p>
      </div>
    );
  }
  if (["fraction_of_number", "fraction_multiplication"].includes(family)) {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Partager, puis prendre le nombre de parts</p><div className="mt-3 grid grid-cols-4 gap-1">{Array.from({length:8},(_,index)=><span key={index} className="h-8 rounded-md" style={{background:index<6?`${colors.gold}65`:`${colors.ink}10`,animation:`pulse 1.8s ${index*80}ms infinite`}} />)}</div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Le dénominateur partage la quantité ; le numérateur indique combien de parts on prend.</p></div>;
  }
  if (family === "whole_number_place_value") {
    const integer = Math.abs(Math.trunc(Number(exercise?.answer)));
    const digits = Number.isFinite(integer) ? String(integer).padStart(4, "0").slice(-4).split("") : ["4", "3", "2", "7"];
    return <div className="mt-4 rounded-xl bg-white p-3 overflow-x-auto" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Chaque chiffre prend la valeur de sa colonne</p><div className="mt-3 grid min-w-[300px] grid-cols-4 text-center text-[10px] font-bold" style={{color:colors.ink}}>{["milliers","centaines","dizaines","unités"].map((label,index)=><div key={label} className="border px-1 py-2" style={{borderColor:`${colors.ink}30`,background:index===3?`${colors.gold}30`:colors.bg}}><span>{label}</span><span className="mt-1 block text-base" style={{color:index===3?colors.gold:colors.ink}}>{digits[index]}</span></div>)}</div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>{digits[0]} milliers + {digits[1]} centaines + {digits[2]} dizaines + {digits[3]} unités.</p></div>;
  }
  if (["decimal_place_value", "decimal_operations", "rounding"].includes(family)) {
    const value = Math.abs(Number(exercise?.answer));
    const [wholePart = "0", decimalPart = ""] = (Number.isFinite(value) ? String(value) : "123.45").split(".");
    const digits = [...wholePart.padStart(3, "0").slice(-3), ...decimalPart.padEnd(2, "0").slice(0, 2)];
    return <div className="mt-4 rounded-xl bg-white p-3 overflow-x-auto" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Chaque chiffre a une place dans le résultat</p><div className="mt-3 grid min-w-[310px] grid-cols-5 text-center text-[10px] font-bold" style={{color:colors.ink}}>{["centaines","dizaines","unités","dixièmes","centièmes"].map((label,index)=><div key={label} className="border px-1 py-2" style={{borderColor:`${colors.ink}30`,background:index===2?`${colors.gold}35`:colors.bg}}><span>{label}</span><span className="mt-1 block text-base" style={{color:index===2?colors.gold:colors.ink}}>{digits[index]}</span></div>)}</div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Le tableau reprend ici le résultat attendu : {String(exercise?.answerDisplay ?? exercise?.answer).replace(".", ",")}.</p></div>;
  }
  if (family === "arithmetic_order") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Respecter l’ordre des opérations</p><div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-black" style={{color:colors.ink}}>{["Parenthèses","× et ÷","+ et −"].map((label,index)=><div key={label} className="flex items-center"><span className="rounded-lg px-2 py-2" style={{background:index===0?`${colors.gold}30`:`${colors.ink}0d`}}>{label}</span>{index<2&&<ArrowRight size={13} color={colors.gold}/>}</div>)}</div></div>;
  }
  if (family === "number_theory") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Décomposer pour voir les diviseurs</p><div className="mt-3 flex items-center justify-center gap-2 text-xs font-black" style={{color:colors.ink}}><span className="rounded-lg px-3 py-2" style={{background:`${colors.ink}0d`}}>60</span><ArrowRight size={15} color={colors.gold}/><span className="rounded-lg px-3 py-2 animate-pulse" style={{background:`${colors.gold}25`}}>2 × 2 × 3 × 5</span></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Les facteurs premiers rendent visibles divisibilité, multiples et diviseurs communs.</p></div>;
  }
  if (family === "combinatorics") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Compter les choix successifs</p><div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-black" style={{color:colors.ink}}>{["3 choix","× 4 choix","= 12 possibilités"].map((label,index)=><span key={label} className="rounded-lg py-3" style={{background:index===2?`${colors.green}18`:`${colors.gold}20`}}>{label}</span>)}</div></div>;
  }
  if (family === "random_variables") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Valeurs et probabilités vont ensemble</p><div className="mt-4 flex h-16 items-end justify-center gap-3">{[3,7,5,2].map((height,index)=><span key={index} className="w-10 rounded-t-lg" style={{height:`${height*8}px`,background:index===1?colors.gold:`${colors.ink}20`,animation:`pulse 1.8s ${index*120}ms infinite`}} />)}</div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>L’espérance est une moyenne pondérée ; la variance mesure l’écart autour de cette moyenne.</p></div>;
  }
  if (family === "calculation_strategy") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Traduire avant de calculer</p><div className="mt-3 flex items-center justify-center gap-1 text-[10px] font-black" style={{color:colors.ink}}>{["Question","Opération","Calcul","Unité"].map((label,index)=><div key={label} className="flex items-center"><span className="rounded-lg px-2 py-2" style={{background:index===3?`${colors.green}18`:`${colors.ink}0d`}}>{label}</span>{index<3&&<ArrowRight size={12} color={colors.gold}/>}</div>)}</div></div>;
  }
  if (family === "compound_measures") {
    const values = valuesFrom(exercise);
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Relier les trois grandeurs</p><div className="mx-auto mt-3 grid h-24 w-44 grid-cols-2 overflow-hidden rounded-2xl text-center text-xs font-black" style={{border:`2px solid ${colors.ink}30`,color:colors.ink}}><span className="col-span-2 flex items-center justify-center" style={{background:`${colors.gold}28`}}>distance {values[0] ? `: ${values[0]}` : ""}</span><span className="flex items-center justify-center border-r animate-pulse" style={{background:`${colors.green}18`,borderColor:`${colors.ink}25`}}>vitesse<br/>{exercise?.answerDisplay ?? exercise?.answer ?? "?"}{exercise?.answerUnit ? ` ${exercise.answerUnit}` : ""}</span><span className="flex items-center justify-center" style={{background:colors.bg}}>temps {values[1] ? `: ${values[1]}` : ""}</span></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Pour trouver la vitesse, on partage la distance par la durée.</p></div>;
  }
  if (["measurement_problem", "exam_reasoning", "automatic_calculation"].includes(family)) {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Une chaîne de vérification complète</p><div className="mt-3 flex items-center justify-center gap-1 text-[10px] font-black" style={{color:colors.ink}}>{["Données","Méthode","Calcul","Contrôle"].map((label,index)=><div key={label} className="flex items-center"><span className="rounded-lg px-2 py-2" style={{background:index===3?`${colors.green}18`:`${colors.gold}16`}}>{label}</span>{index<3&&<ArrowRight size={12} color={colors.gold}/>}</div>)}</div></div>;
  }
  if (family === "continuity_reasoning") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Réduire l’intervalle par dichotomie</p><div className="relative mt-5 h-12"><div className="absolute left-3 right-3 top-3 h-1 rounded" style={{background:`${colors.ink}20`}}/><div className="absolute left-[18%] right-[18%] top-1 h-5 rounded-full" style={{background:`${colors.gold}35`}}/><div className="absolute left-[43%] right-[32%] top-1 h-5 rounded-full animate-pulse" style={{background:`${colors.green}45`}}/><span className="absolute left-1/2 top-7 -translate-x-1/2 text-[10px] font-bold" style={{color:colors.ink}}>milieu</span></div></div>;
  }
  if (family === "duration_calculation") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Les durées fonctionnent par groupes de 60</p><div className="mt-3 flex items-center justify-center gap-2 text-xs font-black" style={{color:colors.ink}}><span className="rounded-xl px-3 py-2" style={{background:`${colors.ink}0d`}}>1 h</span><ArrowRight size={16} color={colors.gold}/><span className="rounded-xl px-3 py-2 animate-pulse" style={{background:`${colors.gold}28`}}>60 min</span><ArrowRight size={16} color={colors.gold}/><span className="rounded-xl px-3 py-2" style={{background:`${colors.green}18`}}>3 600 s</span></div></div>;
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
    const prompt = `${exercise?.prompt ?? ""}`.replace(/^Résous\s*(?:l[’']équation)?\s*/i, "").replace(/[.?]\s*$/, "");
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Garder la balance à l’équilibre</p>
        <p className="mt-3 rounded-lg px-3 py-2 text-center text-xs font-black" style={{background:`${colors.ink}0d`,color:colors.ink}}>{prompt || "membre de gauche = membre de droite"}</p><div className="mt-2 flex items-center justify-center gap-3 text-[11px] font-black" style={{ color: colors.ink }}><span className="rounded-lg px-3 py-2" style={{background:`${colors.green}18`}}>même opération</span><Scale size={24} color={colors.gold} className="animate-pulse"/><span className="rounded-lg px-3 py-2" style={{background:`${colors.green}18`}}>même opération</span></div>
        <p className="mt-2 text-[11px] text-center" style={{ color: colors.slate }}>On conserve l’équilibre jusqu’à isoler x = {exercise?.answerDisplay ?? exercise?.answer ?? "?"}.</p>
      </div>
    );
  }
  if (["proportionality", "percentage_from_counts"].includes(family)) {
    const values = valuesFrom(exercise);
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Le retour à l’unité</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-black" style={{color:colors.ink}}><span className="rounded-lg px-3 py-2" style={{background:`${colors.ink}10`}}>{values.slice(0,2).join(" pour ") || "quantité connue"}</span><ArrowRight size={16} color={colors.gold}/><span className="rounded-lg px-3 py-2 animate-pulse" style={{background:`${colors.gold}25`}}>1 unité</span><ArrowRight size={16} color={colors.gold}/><span className="rounded-lg px-3 py-2" style={{background:`${colors.green}18`}}>{exercise?.answerDisplay ?? String(exercise?.answer ?? "résultat")}{exercise?.answerUnit ? ` ${exercise.answerUnit}` : ""}</span></div>
        <p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>On divise pour revenir à une unité, puis on multiplie pour atteindre la quantité demandée.</p>
      </div>
    );
  }
  if (["percentage_of_number", "percentages"].includes(family)) {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Partager la quantité en pourcentages</p>
        <div className="mt-3 grid grid-cols-10 gap-1">{Array.from({ length: 10 }, (_, index) => <span key={index} className="h-8 rounded-md animate-pulse" style={{ background: index < 2 ? `${colors.gold}75` : `${colors.ink}12`, animationDelay: `${index * 60}ms` }} />)}</div>
        <p className="mt-2 text-[11px] text-center" style={{ color: colors.slate }}>Chaque bloc représente 10 % ; deux blocs représentent 20 %.</p>
      </div>
    );
  }
  if (family === "percentage_conversion") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Passer de l’écriture décimale au pourcentage</p><div className="mt-3 flex items-center justify-center gap-2 text-xs font-black" style={{color:colors.ink}}><span className="rounded-xl px-3 py-2" style={{background:`${colors.ink}0d`}}>0,20</span><ArrowRight size={16} color={colors.gold}/><span className="rounded-xl px-3 py-2 animate-pulse" style={{background:`${colors.gold}30`}}>× 100</span><ArrowRight size={16} color={colors.gold}/><span className="rounded-xl px-3 py-2" style={{background:`${colors.green}18`}}>20 %</span></div></div>;
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
  if (["function_image", "functions"].includes(family)) {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>La machine à fonctions</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold" style={{color:colors.ink}}><span className="rounded-lg px-3 py-2" style={{background:`${colors.gold}18`}}>nombre de départ</span><ArrowRight size={17} color={colors.gold}/><span className="rounded-lg px-3 py-2 animate-pulse" style={{background:`${colors.ink}12`}}>fonction</span><ArrowRight size={17} color={colors.gold}/><span className="rounded-lg px-3 py-2" style={{background:`${colors.green}18`}}>image</span></div>
      </div>
    );
  }
  if (family === "probability_contrary") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Un événement et son contraire remplissent tout</p><div className="mt-3 flex h-10 overflow-hidden rounded-xl text-xs font-black" style={{color:colors.ink,border:`1px solid ${colors.ink}20`}}><span className="flex w-[35%] items-center justify-center" style={{background:`${colors.gold}55`}}>P(A)</span><span className="flex flex-1 items-center justify-center animate-pulse" style={{background:`${colors.green}25`}}>1 − P(A)</span></div></div>;
  }
  if (["probability_tree", "probability_conditional"].includes(family)) {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Suivre une branche à la fois</p><svg viewBox="0 0 250 120" className="mt-2 w-full"><circle cx="25" cy="60" r="5" fill={colors.ink}/><path d="M30 60 L105 25 M30 60 L105 95 M110 25 L220 12 M110 25 L220 42 M110 95 L220 78 M110 95 L220 108" fill="none" stroke={colors.ink} strokeWidth="2"/><path d="M30 60 L105 25 L220 42" fill="none" stroke={colors.gold} strokeWidth="5" strokeLinecap="round" strokeDasharray="9 5"><animate attributeName="stroke-dashoffset" values="28;0" dur="1.6s" repeatCount="indefinite"/></path>{[[105,25],[105,95],[220,12],[220,42],[220,78],[220,108]].map(([cx,cy],index)=><circle key={index} cx={cx} cy={cy} r="4" fill={index===3?colors.green:colors.ink}/>)}</svg><p className="text-[11px] text-center" style={{color:colors.slate}}>Sur un chemin, on multiplie les probabilités inscrites sur les branches.</p></div>;
  }
  if (family === "probability_independence") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Deux événements indépendants</p><div className="mt-3 grid grid-cols-2 gap-2 text-center text-[10px] font-bold" style={{color:colors.ink}}>{["A","non A","B","non B"].map((label,index)=><span key={label} className="rounded-lg py-3" style={{background:index%2?`${colors.ink}0d`:`${colors.gold}25`}}>{label}</span>)}</div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Connaître le résultat du premier événement ne change pas la probabilité du second.</p></div>;
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
    const values = valuesFrom(exercise).map((value) => Number(String(value).replace(",", ".").replace(/[^\d.-]/g, ""))).filter(Number.isFinite);
    const heights = values.length >= 3 ? values.slice(0, 6).map((value) => 18 + (value / Math.max(...values, 1)) * 42) : [12,24,18,36,30,48];
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Organiser les données avant de calculer</p>
        <div className="relative mt-4 flex items-end justify-center gap-2 h-16 border-b" style={{borderColor:`${colors.ink}25`}}>{heights.map((height,index)=><span key={index} className="relative w-8 rounded-t-md transition-all" style={{height:`${height}px`,background:`${colors.gold}${index===heights.length-1?"75":"35"}`}}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold" style={{color:colors.ink}}>{values[index] ?? ""}</span></span>)}</div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>La moyenne recherchée vaut {exercise?.answerDisplay ?? exercise?.answer ?? "?"} : elle doit rester entre la plus petite et la plus grande valeur.</p>
      </div>
    );
  }
  if (family === "multiple_choice_reasoning") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Tester chaque proposition</p><div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-black" style={{color:colors.ink}}>{["Lire","Vérifier","Éliminer","Conclure"].map((label,index)=><div key={label} className="flex items-center"><span className="rounded-lg px-2 py-2" style={{background:index===3?`${colors.green}18`:`${colors.ink}0d`}}>{label}</span>{index<3&&<ArrowRight size={12} color={colors.gold}/>}</div>)}</div></div>;
  }
  if (family.startsWith("geometry") || family === "pythagoras") {
    const values = valuesFrom(exercise);
    if (family === "pythagoras") {
      return <div className="mt-4 rounded-xl bg-white p-3 overflow-hidden" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Les carrés des deux côtés construisent celui de l’hypoténuse</p><svg viewBox="0 0 270 155" className="mt-2 w-full" role="img" aria-label="Triangle rectangle illustrant le théorème de Pythagore"><path d="M55 118 L55 38 L205 118 Z" fill={`${colors.gold}10`} stroke={colors.ink} strokeWidth="3"/><path d="M55 102 H71 V118" fill="none" stroke={colors.green} strokeWidth="3"/><rect x="20" y="38" width="35" height="80" fill={`${colors.green}18`} stroke={colors.green} strokeWidth="2"/><rect x="55" y="118" width="150" height="25" fill={`${colors.gold}25`} stroke={colors.gold} strokeWidth="2"/><path d="M55 38 L205 118" stroke={colors.gold} strokeWidth="5" strokeDasharray="9 5"><animate attributeName="stroke-dashoffset" values="28;0" dur="1.5s" repeatCount="indefinite"/></path><text x="28" y="82" fontSize="11" fill={colors.ink}>{values[0] ?? "a"}</text><text x="120" y="138" fontSize="11" fill={colors.ink}>{values[1] ?? "b"}</text><text x="129" y="68" fontSize="11" fill={colors.ink}>hypoténuse</text></svg><p className="text-[11px] text-center" style={{color:colors.slate}}>On calcule d’abord le carré, puis on prend la racine carrée : longueur = {exercise?.answerDisplay ?? exercise?.answer ?? "?"}{exercise?.answerUnit ? ` ${exercise.answerUnit}` : ""}.</p></div>;
    }
    if (family === "geometry_rectangle_measure") {
      return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Voir la surface comme des lignes de carrés</p><svg viewBox="0 0 260 135" className="mt-2 w-full" role="img" aria-label="Rectangle quadrillé avec longueur et largeur"><rect x="42" y="22" width="176" height="82" rx="3" fill={`${colors.gold}12`} stroke={colors.ink} strokeWidth="3"/><g stroke={`${colors.ink}28`} strokeWidth="1">{[1,2,3,4,5,6].map(index=><line key={`v-${index}`} x1={42+index*25.14} y1="22" x2={42+index*25.14} y2="104"/>)}{[1,2,3].map(index=><line key={`h-${index}`} x1="42" y1={22+index*20.5} x2="218" y2={22+index*20.5}/>)}</g><path d="M42 116 H218" stroke={colors.gold} strokeWidth="4" strokeDasharray="8 5"><animate attributeName="stroke-dashoffset" values="26;0" dur="1.5s" repeatCount="indefinite"/></path><path d="M30 22 V104" stroke={colors.green} strokeWidth="4" strokeDasharray="8 5"><animate attributeName="stroke-dashoffset" values="26;0" dur="1.5s" repeatCount="indefinite"/></path><text x="112" y="131" fontSize="11" fill={colors.ink}>{values[0] ?? "longueur"}</text><text x="4" y="67" fontSize="11" fill={colors.ink}>{values[1] ?? "largeur"}</text></svg><p className="text-[11px] text-center" style={{color:colors.slate}}>Chaque ligne contient « longueur » carrés et il y a « largeur » lignes : aire = longueur × largeur.</p></div>;
    }
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
  if (["sequences", "sequence_convergence"].includes(family)) {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Passer d’un terme au suivant</p><div className="mt-3 flex items-end justify-center gap-1">{[1,2,3,4,5].map((value,index)=><div key={value} className="flex items-center"><span className="flex w-8 items-center justify-center rounded-lg text-[10px] font-black" style={{height:`${24+index*7}px`,background:index===4?`${colors.green}25`:`${colors.gold}20`,color:colors.ink}}>u{index}</span>{index<4&&<ArrowRight size={13} color={colors.gold}/>}</div>)}</div></div>
    );
  }
  if (family === "integral_calculus") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Accumuler entre deux bornes</p><svg viewBox="0 0 240 100" className="mt-2 w-full"><line x1="15" y1="82" x2="225" y2="82" stroke={colors.ink} strokeWidth="2"/><path d="M35 82 Q95 12 200 45 L200 82 Z" fill={`${colors.gold}30`} stroke="none"><animate attributeName="fill-opacity" values="0.25;0.7;0.25" dur="2s" repeatCount="indefinite"/></path><path d="M35 82 Q95 12 200 45" fill="none" stroke={colors.ink} strokeWidth="3"/><line x1="35" y1="82" x2="35" y2="76" stroke={colors.green} strokeWidth="3"/><line x1="200" y1="82" x2="200" y2="45" stroke={colors.green} strokeWidth="3"/></svg></div>;
  }
  if (family === "real_number_sets") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Revenir à la droite réelle</p><div className="relative mt-5 h-12"><div className="absolute left-3 right-3 top-3 h-0.5" style={{background:colors.ink}}/><div className="absolute left-[28%] right-[18%] top-1 h-5 rounded-full animate-pulse" style={{background:`${colors.gold}45`}}/><span className="absolute left-[27%] top-0 h-7 w-1" style={{background:colors.green}}/><span className="absolute right-[17%] top-0 h-7 w-1" style={{background:colors.green}}/></div></div>;
  }
  if (family === "space_vectors") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Trois coordonnées dans l’espace</p><svg viewBox="0 0 240 115" className="mt-2 w-full"><line x1="70" y1="88" x2="220" y2="88" stroke={colors.ink} strokeWidth="2"/><line x1="70" y1="88" x2="70" y2="12" stroke={colors.ink} strokeWidth="2"/><line x1="70" y1="88" x2="20" y2="108" stroke={colors.ink} strokeWidth="2"/><path d="M70 88 L165 38" stroke={colors.gold} strokeWidth="4" strokeDasharray="8 5"><animate attributeName="stroke-dashoffset" values="26;0" dur="1.5s" repeatCount="indefinite"/></path><circle cx="165" cy="38" r="5" fill={colors.green}/><text x="222" y="92" fontSize="11" fill={colors.ink}>x</text><text x="74" y="14" fontSize="11" fill={colors.ink}>z</text><text x="12" y="111" fontSize="11" fill={colors.ink}>y</text></svg></div>;
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
