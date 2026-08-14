import { ArrowDown, ArrowRight, Scale } from "lucide-react";
import { colors } from "../theme";
import MathText from "./MathText";

function valuesFrom(exercise) {
  return `${exercise?.prompt ?? ""}`.match(/−?-?\d+(?:[,.]\d+)?(?:\s*(?:km\/h|cm²|cm³|cm|m²|m³|m|°|€|%))?/g)?.slice(0, 8) ?? [];
}

function fractionsFrom(exercise) {
  return [...`${exercise?.prompt ?? ""}`.matchAll(/(\d+)\s*\/\s*(\d+)/g)]
    .slice(0, 2)
    .map((match) => ({ numerator: Number(match[1]), denominator: Number(match[2]) }))
    .filter(({ numerator, denominator }) => denominator > 0 && denominator <= 12 && numerator >= 0);
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

export default function FeedbackVisual({ family, exercise }) {
  if (family === "fraction_decimal_quotient") {
    const match = `${exercise?.prompt ?? ""}`.match(/\\dfrac\{(\d+)\}\{(\d+)\}/);
    const numerator = match?.[1] ?? "numérateur";
    const denominator = match?.[2] ?? "dénominateur";
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>La barre de fraction signifie « divisé par »</p><div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm font-black" style={{color:colors.ink}}><span className="rounded-xl px-3 py-2" style={{background:`${colors.gold}22`}}>{numerator}/{denominator}</span><ArrowRight size={16} color={colors.gold}/><span>{numerator} ÷ {denominator}</span><ArrowRight size={16} color={colors.gold}/><span className="rounded-xl px-3 py-2 animate-pulse" style={{background:`${colors.green}20`}}>{String(exercise?.answerDisplay ?? exercise?.answer ?? "résultat").replace(".", ",")}</span></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>On effectue la division, puis on arrondit seulement si l’énoncé le demande.</p></div>;
  }
  if (family === "fraction_sharing") {
    const display = String(exercise?.answerDisplay ?? exercise?.answer ?? "3/4");
    const match = display.match(/(\d+)\s*\/\s*(\d+)/);
    const numerator = Math.max(0, Number(match?.[1] ?? 3));
    const denominator = Math.min(12, Math.max(1, Number(match?.[2] ?? 4)));
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Trois parts prises sur quatre parts égales</p><div className="mx-auto mt-4 flex h-20 max-w-sm overflow-hidden rounded-xl" style={{border:`2px solid ${colors.ink}55`}}>{Array.from({length:denominator},(_,index)=><span key={index} className="flex flex-1 items-center justify-center border-r text-lg font-black last:border-r-0" style={{borderColor:`${colors.ink}55`,backgroundColor:index<numerator?`${colors.gold}70`:colors.bg,color:colors.ink,animation:index<numerator?`pulse 1.8s ${index*120}ms infinite`:undefined}}>{index<numerator?"✓":""}</span>)}</div><div className="mt-3 flex items-center justify-center gap-3 text-sm font-black" style={{color:colors.ink}}><span><strong style={{color:colors.gold}}>{numerator}</strong> parts prises</span><span>sur</span><span><strong>{denominator}</strong> parts égales</span><span>=</span><MathText text={`\\dfrac{${numerator}}{${denominator}}`} /></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Le nombre du haut compte les parts coloriées ; le nombre du bas compte toutes les parts égales.</p></div>;
  }
  if (["fractions", "fraction_equivalence", "fraction_comparison", "fraction_simplification"].includes(family)) {
    const parsedFractions = fractionsFrom(exercise);
    const strips = parsedFractions.length === 2 ? parsedFractions : [{ numerator: 1, denominator: 3 }, { numerator: 1, denominator: 4 }];
    const isAddition = family === "fractions" && parsedFractions.length === 2 && /addition|ajout|\+/i.test(`${exercise?.chapter ?? ""} ${exercise?.prompt ?? ""}`);
    if (isAddition) {
      const [left, right] = parsedFractions;
      const commonDenominator = (left.denominator * right.denominator) / gcd(left.denominator, right.denominator);
      const leftEquivalent = left.numerator * (commonDenominator / left.denominator);
      const rightEquivalent = right.numerator * (commonDenominator / right.denominator);
      const total = leftEquivalent + rightEquivalent;
      const cells = (filled, accent = colors.gold, offset = 0) => Array.from({length:commonDenominator},(_,index)=><span key={index} className="h-7 border-r last:border-r-0" style={{borderColor:`${colors.ink}25`,background:index<offset?`${colors.gold}75`:index<offset+filled?`${accent}75`:colors.bg,animation:index>=offset&&index<offset+filled?`pulse 1.8s ${index*70}ms infinite`:undefined}} />);
      return <div className="mt-4 rounded-xl bg-white p-3" data-visual="fraction-common-denominator" style={{border:`1px solid ${colors.gold}35`}}>
        <p className="text-xs font-bold" style={{color:colors.ink}}>Redécouper les parts avant de les additionner</p>
        <div className="mt-3 grid gap-3">
          <div><p className="mb-1 text-[10px] font-bold" style={{color:colors.slate}}>1. Les parts n’ont pas la même taille</p><div className="grid grid-cols-2 gap-3">{[left,right].map(({numerator,denominator},stripIndex)=><div key={stripIndex}><div className="grid overflow-hidden rounded-md" style={{gridTemplateColumns:`repeat(${denominator}, minmax(0, 1fr))`,border:`1px solid ${colors.ink}25`}}>{Array.from({length:denominator},(_,index)=><span key={index} className="h-7 border-r last:border-r-0" style={{borderColor:`${colors.ink}25`,background:index<numerator?`${colors.gold}65`:colors.bg}} />)}</div><p className="mt-1 text-center text-[10px] font-black" style={{color:colors.ink}}>{numerator}/{denominator}</p></div>)}</div></div>
          <ArrowDown size={17} color={colors.gold} className="mx-auto animate-pulse"/>
          <div><p className="mb-1 text-[10px] font-bold" style={{color:colors.slate}}>2. On redécoupe les deux bandes en {commonDenominator} parts égales</p><div className="grid gap-2">{[[leftEquivalent,`${leftEquivalent}/${commonDenominator}`],[rightEquivalent,`${rightEquivalent}/${commonDenominator}`]].map(([filled,label],index)=><div key={label} className="flex items-center gap-2"><div className="grid flex-1 overflow-hidden rounded-md" style={{gridTemplateColumns:`repeat(${commonDenominator}, minmax(0, 1fr))`,border:`1px solid ${colors.ink}25`}}>{cells(filled,index?colors.green:colors.gold)}</div><span className="w-10 text-[10px] font-black" style={{color:colors.ink}}>{label}</span></div>)}</div></div>
          <ArrowDown size={17} color={colors.gold} className="mx-auto animate-pulse"/>
          <div><p className="mb-1 text-[10px] font-bold" style={{color:colors.slate}}>3. On réunit les parts de même taille</p><div className="grid overflow-hidden rounded-md" style={{gridTemplateColumns:`repeat(${commonDenominator}, minmax(0, 1fr))`,border:`2px solid ${colors.ink}30`}}>{cells(rightEquivalent,colors.green,leftEquivalent)}{total < commonDenominator ? null : null}</div><p className="mt-2 text-center text-sm font-black" style={{color:colors.ink}}>{leftEquivalent}/{commonDenominator} + {rightEquivalent}/{commonDenominator} = <span style={{color:colors.green}}>{total}/{commonDenominator}</span></p></div>
        </div>
      </div>;
    }
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
    if (exercise?.decimalOperation) {
      const { left, right, operator = "+", answer, decimalPlaces = 1 } = exercise.decimalOperation;
      const format = (number) => Number(number).toFixed(decimalPlaces).replace(".", ",").padStart(5, " ");
      return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Poser l’addition en alignant les rangs</p><div className="mx-auto mt-3 w-fit rounded-xl px-5 py-3 font-mono text-xl font-black tabular-nums" style={{backgroundColor:colors.bg,color:colors.ink}}><div className="whitespace-pre">{"  "}{format(left)}</div><div className="whitespace-pre"><span style={{color:colors.gold}}>{operator}</span>{" "}{format(right)}</div><div className="my-1 h-0.5" style={{backgroundColor:colors.ink}}/><div className="whitespace-pre animate-pulse" style={{color:colors.green}}>{"  "}{format(answer)}</div></div><div className="mx-auto mt-2 grid w-fit grid-cols-[auto_auto_auto] gap-x-3 text-center text-[10px] font-bold" style={{color:colors.slate}}><span>unités</span><span>,</span><span>dixièmes</span><span>↕</span><span>↕</span><span>↕</span></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Les virgules, les unités et les dixièmes sont exactement les uns sous les autres.</p></div>;
    }
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
  if (family === "relative_product") {
    const prompt = `${exercise?.prompt ?? ""}`;
    const signs = [...prompt.matchAll(/[−-]\s*\d+/g)].length >= 2 ? ["−", "−", "+"] : ["+", "−", "−"];
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Déterminer le signe avant de calculer</p><div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xl font-black" style={{color:colors.ink}}><span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{background:`${colors.gold}25`}}>{signs[0]}</span><span>×</span><span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{background:`${colors.gold}25`}}>{signs[1]}</span><span>=</span><span className="flex h-11 w-11 items-center justify-center rounded-xl animate-pulse" style={{background:`${colors.green}25`,color:colors.green}}>{signs[2]}</span></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Même signe : résultat positif. Signes opposés : résultat négatif. On calcule ensuite avec les distances à zéro.</p></div>;
  }
  if (family === "relative_numbers") {
    const operands = [...`${exercise?.prompt ?? ""}`.matchAll(/[−-]?\s*\d+(?:[,.]\d+)?/g)]
      .slice(0, 2)
      .map((match) => Number(match[0].replace(/\s/g, "").replace("−", "-").replace(",", ".")));
    const [first = -7, second = 12] = operands;
    const negativeDistance = Math.abs(first < 0 ? first : second < 0 ? second : -7);
    const positiveDistance = Math.abs(first > 0 ? first : second > 0 ? second : 12);
    const negativeWins = negativeDistance > positiveDistance;
    const winnerDistance = Math.max(negativeDistance, positiveDistance, 1);
    const neutralized = Math.min(negativeDistance, positiveDistance);
    const remaining = Math.abs(positiveDistance - negativeDistance);
    const winnerColor = negativeWins ? colors.red : colors.green;
    const cellCount = Number.isInteger(winnerDistance) && winnerDistance <= 20 ? winnerDistance : 12;
    const neutralizedCells = Math.round((neutralized / winnerDistance) * cellCount);
    const remainingCells = Math.max(0, cellCount - neutralizedCells);
    return (
      <div className="mt-4 rounded-xl bg-white p-3" data-visual="relative-neutralization" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Superposer pour neutraliser les forces opposées</p>
        <div className="mt-3 grid gap-2 text-[10px] font-bold" style={{color:colors.ink}}>
          <div className="flex items-center gap-2"><span className="w-16 shrink-0 text-right" style={{color:colors.red}}>négatif : {negativeDistance}</span><div className="h-5 rounded-md" style={{width:`${Math.max(12,(negativeDistance/winnerDistance)*100)}%`,maxWidth:"calc(100% - 4.5rem)",background:colors.red}} /></div>
          <div className="flex items-center gap-2"><span className="w-16 shrink-0 text-right" style={{color:colors.green}}>positif : {positiveDistance}</span><div className="h-5 rounded-md" style={{width:`${Math.max(12,(positiveDistance/winnerDistance)*100)}%`,maxWidth:"calc(100% - 4.5rem)",background:colors.green}} /></div>
        </div>
        <div className="mt-4 flex overflow-hidden rounded-lg" aria-label={`${neutralized} unités se neutralisent et il reste ${remaining} unités ${negativeWins ? "négatives" : "positives"}`} style={{border:`2px solid ${colors.ink}25`}}>
          {Array.from({length:neutralizedCells},(_,index)=><span key={`neutral-${index}`} className="flex h-10 flex-1 items-center justify-center border-r text-xs font-black" style={{minWidth:10,borderColor:"white",background:`linear-gradient(135deg, ${colors.red} 0 46%, ${colors.slate} 47% 53%, ${colors.green} 54% 100%)`,color:"white"}}>×</span>)}
          {Array.from({length:remainingCells},(_,index)=><span key={`remain-${index}`} className="h-10 flex-1 border-r last:border-r-0 animate-pulse" style={{minWidth:10,borderColor:"white",background:winnerColor}} />)}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold" style={{color:colors.slate}}><span>{neutralized} unités se neutralisent</span><ArrowRight size={14} color={colors.gold}/><span style={{color:winnerColor}}>il reste {remaining} unité{remaining>1?"s":""} {negativeWins?"en rouge":"en vert"}</span></div>
        <p className="mt-2 text-center text-sm font-black" style={{color:winnerColor}}>Résultat : {negativeWins?"−":""}{remaining}</p>
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
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] font-black" style={{color:colors.ink}}><span className="max-w-full break-words rounded-lg px-3 py-2" style={{background:`${colors.ink}10`}}>{values.slice(0,2).join(" pour ") || "quantité connue"}</span><ArrowRight size={16} color={colors.gold}/><span className="rounded-lg px-3 py-2 animate-pulse" style={{background:`${colors.gold}25`}}>1 unité</span><ArrowRight size={16} color={colors.gold}/><span className="max-w-full break-words rounded-lg px-3 py-2" style={{background:`${colors.green}18`}}>{exercise?.answerDisplay ?? String(exercise?.answer ?? "résultat")}{exercise?.answerUnit ? ` ${exercise.answerUnit}` : ""}</span></div>
        <p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>On divise pour revenir à une unité, puis on multiplie pour atteindre la quantité demandée.</p>
      </div>
    );
  }
  if (["percentage_of_number", "percentages"].includes(family)) {
    const percentageMatch = `${exercise?.prompt ?? ""}`.match(/(\d+(?:[,.]\d+)?)\s*%/);
    const quantityMatch = `${exercise?.prompt ?? ""}`.match(/%\s*(?:de|d['’])\s*(\d+(?:[,.]\d+)?)/i);
    const percentage = Number((percentageMatch?.[1] ?? "20").replace(",", "."));
    const quantity = Number((quantityMatch?.[1] ?? "80").replace(",", "."));
    const highlightedGroups = Math.max(0, Math.min(10, Math.round(percentage / 10)));
    const tenPercentValue = quantity / 10;
    const result = Number.isFinite(Number(exercise?.answer)) ? Number(exercise.answer) : quantity * percentage / 100;
    return (
      <div className="mt-4 rounded-xl bg-white p-3" data-visual="percentage-ten-groups" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Partager {quantity} en dix groupes égaux</p>
        <div className="mt-3 grid grid-cols-5 gap-1 sm:grid-cols-10">{Array.from({ length: 10 }, (_, index) => <span key={index} className="flex h-10 items-center justify-center rounded-md text-[10px] font-black" style={{ background: index < highlightedGroups ? (index === 0 ? `${colors.gold}85` : `${colors.green}75`) : `${colors.ink}12`, color:index<highlightedGroups?"white":colors.slate, animation:index<highlightedGroups?`pulse 1.8s ${index*260}ms infinite`:undefined }}>{Number.isInteger(tenPercentValue)?tenPercentValue:String(tenPercentValue).replace(".",",")}</span>)}</div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] font-black" style={{color:colors.ink}}><span className="rounded-lg px-2 py-1" style={{background:`${colors.gold}22`}}>10 % = {String(tenPercentValue).replace(".",",")}</span><ArrowRight size={14} color={colors.gold}/><span className="rounded-lg px-2 py-1" style={{background:`${colors.green}20`}}>{percentage} % = {highlightedGroups} × {String(tenPercentValue).replace(".",",")} = {String(result).replace(".",",")}</span></div>
        <p className="mt-2 text-[11px] text-center" style={{ color: colors.slate }}>Le premier groupe représente 10 %. On en colorie {highlightedGroups} pour obtenir {percentage} %, soit {String(result).replace(".",",")}.</p>
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
    const values = valuesFrom(exercise);
    const inputValue = values.at(-1) ?? "x";
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>La machine à fonctions</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold" style={{color:colors.ink}}><span className="rounded-lg px-3 py-2" style={{background:`${colors.gold}18`}}>{inputValue}</span><ArrowRight size={17} color={colors.gold}/><span className="max-w-[130px] truncate rounded-lg px-3 py-2 animate-pulse" style={{background:`${colors.ink}12`}}>{`${exercise?.prompt ?? "fonction"}`.match(/f\(x\)\s*=\s*([^,;.]+)/i)?.[1] ?? "fonction"}</span><ArrowRight size={17} color={colors.gold}/><span className="rounded-lg px-3 py-2" style={{background:`${colors.green}18`}}>{exercise?.answerDisplay ?? exercise?.answer ?? "image"}</span></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Le nombre de départ est connu : on le remplace dans l’expression pour obtenir son image.</p>
      </div>
    );
  }
  if (family === "probability_contrary") {
    const contrary = Number(exercise?.answer);
    const contraryPercent = Number.isFinite(contrary) ? Math.max(0, Math.min(100, contrary * 100)) : 65;
    const eventPercent = 100 - contraryPercent;
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Un événement et son contraire remplissent tout</p><div className="mt-3 flex h-10 overflow-hidden rounded-xl text-xs font-black" style={{color:colors.ink,border:`1px solid ${colors.ink}20`}}><span className="flex items-center justify-center" style={{width:`${eventPercent}%`,background:`${colors.gold}55`}}>P(A) = {String(eventPercent / 100).replace(".", ",")}</span><span className="flex flex-1 items-center justify-center animate-pulse" style={{background:`${colors.green}25`}}>P(non A) = {String(contrary).replace(".", ",")}</span></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>{String(eventPercent / 100).replace(".", ",")} + {String(contrary).replace(".", ",")} = 1.</p></div>;
  }
  if (family === "probability_conditional") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Se placer uniquement parmi les cas de A</p><div className="relative mx-auto mt-3 h-28 max-w-sm overflow-hidden rounded-2xl" style={{background:`${colors.ink}0d`,border:`2px solid ${colors.ink}25`}}><span className="absolute left-3 top-2 text-[11px] font-black" style={{color:colors.ink}}>Univers de départ</span><div className="absolute inset-y-8 left-[12%] right-[12%] rounded-xl" style={{background:`${colors.gold}30`,border:`2px solid ${colors.gold}`}}><span className="absolute left-2 top-1 text-xs font-black" style={{color:colors.ink}}>A : nouvel univers</span><div className="absolute bottom-2 right-3 top-7 w-[40%] rounded-lg animate-pulse" style={{background:`${colors.green}45`,border:`2px solid ${colors.green}`}}><span className="flex h-full items-center justify-center text-[10px] font-black" style={{color:colors.ink}}>A ∩ B</span></div></div></div><div className="mt-3 text-center text-sm font-black" style={{color:colors.ink}}><MathText text="\\(P_A(B)=\\dfrac{P(A\\cap B)}{P(A)}\\)" /></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>On mesure la part de A qui réalise aussi B : ici, on divise la probabilité de l’intersection par celle de A.</p></div>;
  }
  if (family === "probability_tree") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Suivre une branche à la fois</p><svg viewBox="0 0 250 120" className="mt-2 w-full"><circle cx="25" cy="60" r="5" fill={colors.ink}/><path d="M30 60 L105 25 M30 60 L105 95 M110 25 L220 12 M110 25 L220 42 M110 95 L220 78 M110 95 L220 108" fill="none" stroke={colors.ink} strokeWidth="2"/><path d="M30 60 L105 25 L220 42" fill="none" stroke={colors.gold} strokeWidth="5" strokeLinecap="round" strokeDasharray="9 5"><animate attributeName="stroke-dashoffset" values="28;0" dur="1.6s" repeatCount="indefinite"/></path>{[[105,25],[105,95],[220,12],[220,42],[220,78],[220,108]].map(([cx,cy],index)=><circle key={index} cx={cx} cy={cy} r="4" fill={index===3?colors.green:colors.ink}/>)}</svg><p className="text-[11px] text-center" style={{color:colors.slate}}>Sur un chemin, on multiplie les probabilités inscrites sur les branches.</p></div>;
  }
  if (family === "probability_independence") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Deux événements indépendants</p><div className="mt-3 grid grid-cols-2 gap-2 text-center text-[10px] font-bold" style={{color:colors.ink}}>{["A","non A","B","non B"].map((label,index)=><span key={label} className="rounded-lg py-3" style={{background:index%2?`${colors.ink}0d`:`${colors.gold}25`}}>{label}</span>)}</div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Connaître le résultat du premier événement ne change pas la probabilité du second.</p></div>;
  }
  if (family === "function_affine_coefficients") {
    const values = valuesFrom(exercise);
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Comparer la montée et l’avancée</p><svg viewBox="0 0 250 125" className="mt-2 w-full" role="img" aria-label="Calcul graphique du coefficient directeur"><line x1="20" y1="105" x2="235" y2="105" stroke={colors.ink} strokeWidth="2"/><line x1="35" y1="118" x2="35" y2="10" stroke={colors.ink} strokeWidth="2"/><path d="M60 92 L195 28" stroke={colors.gold} strokeWidth="4"/><path d="M60 92 H195 V28" fill="none" stroke={colors.green} strokeWidth="3" strokeDasharray="8 5"><animate attributeName="stroke-dashoffset" values="26;0" dur="1.5s" repeatCount="indefinite"/></path><circle cx="60" cy="92" r="5" fill={colors.ink}/><circle cx="195" cy="28" r="5" fill={colors.ink}/><text x="74" y="107" fontSize="11" fill={colors.ink}>variation de x : {values[2] && values[0] ? `${values[2]} − ${values[0]}` : "Δx"}</text><text x="199" y="62" fontSize="11" fill={colors.ink}>Δy</text></svg><p className="text-[11px] text-center" style={{color:colors.slate}}>Coefficient directeur = variation verticale ÷ variation horizontale = {exercise?.answerDisplay ?? exercise?.answer ?? "?"}.</p></div>;
  }
  if (["function_variations", "function_domain"].includes(family)) {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Lire les informations dans le bon ordre</p><svg viewBox="0 0 240 95" className="mt-2 w-full"><line x1="18" y1="76" x2="225" y2="76" stroke={colors.ink} strokeWidth="2"/><line x1="38" y1="88" x2="38" y2="10" stroke={colors.ink} strokeWidth="2"/><path d="M38 68 L92 48 L145 57 L211 20" fill="none" stroke={colors.gold} strokeWidth="4" strokeDasharray="8 5"><animate attributeName="stroke-dashoffset" values="26;0" dur="1.6s" repeatCount="indefinite"/></path><circle cx="92" cy="48" r="5" fill={colors.green}/><circle cx="145" cy="57" r="5" fill={colors.green}/></svg><p className="text-[11px] text-center" style={{color:colors.slate}}>Domaine, variations et coefficients ne répondent pas à la même question : on identifie d’abord ce qui est demandé.</p></div>;
  }
  if (family === "distributivity") {
    const expression = `${exercise?.prompt ?? "3(x + 4)"}`.match(/(?:développe|réduis|calcule)?\s*:?\s*([^?]+?\([^?]+\))/i)?.[1] ?? "facteur × (terme 1 + terme 2)";
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Le facteur multiplie tous les termes</p><div className="mt-3 rounded-lg p-2 text-center text-sm font-black" style={{color:colors.ink,background:`${colors.gold}22`}}>{expression}</div><div className="mt-2 flex justify-center gap-8 text-xs font-bold" style={{color:colors.green}}><span className="animate-pulse">↘ premier produit</span><span className="animate-pulse">↙ second produit</span></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Aucun terme placé dans la parenthèse ne doit être oublié.</p></div>;
  }
  if (family === "probabilities" && /boules? rouges?/i.test(`${exercise?.prompt ?? ""}`)) {
    return <div className="mt-4 rounded-xl bg-white p-3" data-visual="probability-favorable-balls" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Compter les favorables parmi tous les possibles</p><div className="mx-auto mt-3 flex w-fit items-end justify-center gap-2 rounded-b-[2rem] border-x-4 border-b-4 px-5 pb-3 pt-1" style={{borderColor:`${colors.ink}35`,background:`${colors.ink}05`}}>{[0,1,2].map((index)=><span key={`red-${index}`} className="h-9 w-9 rounded-full" style={{background:colors.red,boxShadow:`0 0 0 3px ${colors.red}25`,animation:`pulse 1.8s ${index*160}ms infinite`}}/>)}{[0,1].map((index)=><span key={`blue-${index}`} className="h-9 w-9 rounded-full" style={{background:colors.ink,opacity:.78}}/>)}</div><div className="mt-3 grid gap-2 sm:grid-cols-2"><div className="rounded-xl px-3 py-2 text-center" style={{background:`${colors.red}10`}}><p className="text-[10px] font-bold" style={{color:colors.slate}}>issues favorables</p><p className="text-lg font-black" style={{color:colors.red}}>3 rouges</p></div><div className="rounded-xl px-3 py-2 text-center" style={{background:`${colors.ink}08`}}><p className="text-[10px] font-bold" style={{color:colors.slate}}>issues possibles</p><p className="text-lg font-black" style={{color:colors.ink}}>3 + 2 = 5 boules</p></div></div><div className="mt-3 text-center text-base font-black" style={{color:colors.ink}}><MathText text="\\(P(\\text{rouge})=\\dfrac{3}{5}=0{,}6\\)"/></div><div className="mt-4 flex items-start gap-2"><div className="relative h-12 flex-1"><div className="absolute left-2 right-2 top-3 h-2 rounded-full" style={{background:`${colors.ink}18`}}/><span className="absolute left-2 top-8 text-[10px] font-bold" style={{color:colors.ink}}>0</span><span className="absolute right-2 top-8 text-[10px] font-bold" style={{color:colors.ink}}>1</span><span className="absolute top-0 h-7 w-1 rounded animate-pulse" style={{left:"60%",background:colors.green}}/><span className="absolute top-8 -translate-x-1/2 text-[10px] font-black" style={{left:"60%",color:colors.green}}>3/5</span></div><div className="rounded-lg border-2 px-2 py-1 text-center text-[10px] font-black line-through" style={{borderColor:colors.red,color:colors.red,background:`${colors.red}08`}}>3/2 = 1,5<br/>hors de [0 ; 1]</div></div><p className="mt-2 text-center text-[11px]" style={{color:colors.slate}}>Une probabilité appartient toujours à l’intervalle [0 ; 1].</p></div>;
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
  if (family === "statistics_range") {
    const values = valuesFrom(exercise);
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Mesurer l’écart entre les deux extrêmes</p><div className="relative mx-auto mt-5 h-14 max-w-sm"><div className="absolute left-4 right-4 top-4 h-1 rounded" style={{background:`${colors.ink}22`}}/><span className="absolute left-4 top-1 flex h-7 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-black" style={{background:`${colors.gold}25`,color:colors.ink}}>{values[0] ?? "min"}</span><span className="absolute right-4 top-1 flex h-7 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-black" style={{background:`${colors.green}25`,color:colors.ink}}>{values[1] ?? "max"}</span><div className="absolute left-16 right-16 top-3 border-t-2 border-dashed" style={{borderColor:colors.gold}}/></div><p className="text-[11px] text-center" style={{color:colors.slate}}>Étendue = maximum − minimum = {exercise?.answerDisplay ?? exercise?.answer ?? "?"}.</p></div>;
  }
  if (family === "statistics_median") {
    const values = valuesFrom(exercise);
    const displayValues = values.length >= 3 ? values : ["2", "5", "7", "9", "12"];
    const middle = Math.floor(displayValues.length / 2);
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Ranger puis viser le centre</p><div className="mt-3 flex items-center justify-center gap-1">{displayValues.map((value,index)=><span key={`${value}-${index}`} className="flex h-10 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-black" style={{color:colors.ink,background:index===middle?`${colors.green}30`:`${colors.ink}0d`,animation:index===middle?"pulse 1.6s infinite":undefined}}>{value}</span>)}</div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>La valeur centrale partage la série ordonnée en deux groupes de même effectif : médiane = {exercise?.answerDisplay ?? exercise?.answer ?? "?"}.</p></div>;
  }
  if (family.startsWith("statistics")) {
    const values = valuesFrom(exercise).map((value) => Number(String(value).replace(",", ".").replace(/[^\d.-]/g, ""))).filter(Number.isFinite);
    const heights = values.length >= 3 ? values.slice(0, 6).map((value) => 18 + (value / Math.max(...values, 1)) * 42) : [12,24,18,36,30,48];
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Organiser les données avant de calculer</p>
        <div className="relative mt-4 flex items-end justify-center gap-2 h-16 border-b" style={{borderColor:`${colors.ink}25`}}>{heights.map((height,index)=><span key={index} className="relative w-8 rounded-t-md transition-all" style={{height:`${height}px`,background:`${colors.gold}${index===heights.length-1?"75":"35"}`}}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold" style={{color:colors.ink}}>{values[index] ?? ""}</span></span>)}</div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Le résultat recherché vaut {exercise?.answerDisplay ?? exercise?.answer ?? "?"}. Pour une moyenne, il doit rester entre la plus petite et la plus grande valeur.</p>
      </div>
    );
  }
  if (family === "multiple_choice_reasoning") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Tester chaque proposition</p><div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-black" style={{color:colors.ink}}>{["Lire","Vérifier","Éliminer","Conclure"].map((label,index)=><div key={label} className="flex items-center"><span className="rounded-lg px-2 py-2" style={{background:index===3?`${colors.green}18`:`${colors.ink}0d`}}>{label}</span>{index<3&&<ArrowRight size={12} color={colors.gold}/>}</div>)}</div></div>;
  }
  if (family.startsWith("geometry") || family === "point_coordinates" || family === "pythagoras") {
    const values = valuesFrom(exercise);
    if (family === "geometry_thales") {
      return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Triangles semblables, donc longueurs proportionnelles</p><svg viewBox="0 0 270 150" className="mt-2 w-full" role="img" aria-label="Deux triangles semblables dans une configuration de Thalès"><path d="M35 125 L135 22 L235 125 Z" fill={`${colors.gold}08`} stroke={colors.ink} strokeWidth="3"/><path d="M78 81 L135 22 L192 81 Z" fill={`${colors.green}18`} stroke={colors.green} strokeWidth="3"><animate attributeName="fill-opacity" values="0.2;0.7;0.2" dur="1.8s" repeatCount="indefinite"/></path><line x1="78" y1="81" x2="192" y2="81" stroke={colors.green} strokeWidth="4"/><line x1="35" y1="125" x2="235" y2="125" stroke={colors.gold} strokeWidth="4"/><path d="M78 81 L35 125 M192 81 L235 125" stroke={colors.gold} strokeWidth="5" strokeDasharray="8 6"><animate attributeName="stroke-dashoffset" values="28;0" dur="1.5s" repeatCount="indefinite"/></path><text x="126" y="17" fontSize="11" fill={colors.ink}>sommet commun</text><text x="94" y="76" fontSize="11" fill={colors.ink}>petit triangle</text><text x="91" y="143" fontSize="11" fill={colors.ink}>grand triangle semblable</text></svg><p className="text-[11px] text-center" style={{color:colors.slate}}>Les parallèles donnent les mêmes angles : les triangles sont semblables. L’un est une réduction de l’autre, donc leurs côtés correspondants sont proportionnels. Ici, la longueur cherchée vaut {exercise?.answerDisplay ?? exercise?.answer ?? "?"}.</p></div>;
    }
    if (family === "pythagoras") {
      return <div className="mt-4 rounded-xl bg-white p-3 overflow-hidden" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Les carrés des deux côtés construisent celui de l’hypoténuse</p><svg viewBox="0 0 270 155" className="mt-2 w-full" role="img" aria-label="Triangle rectangle illustrant le théorème de Pythagore"><path d="M55 118 L55 38 L205 118 Z" fill={`${colors.gold}10`} stroke={colors.ink} strokeWidth="3"/><path d="M55 102 H71 V118" fill="none" stroke={colors.green} strokeWidth="3"/><rect x="20" y="38" width="35" height="80" fill={`${colors.green}18`} stroke={colors.green} strokeWidth="2"/><rect x="55" y="118" width="150" height="25" fill={`${colors.gold}25`} stroke={colors.gold} strokeWidth="2"/><path d="M55 38 L205 118" stroke={colors.gold} strokeWidth="5" strokeDasharray="9 5"><animate attributeName="stroke-dashoffset" values="28;0" dur="1.5s" repeatCount="indefinite"/></path><text x="28" y="82" fontSize="11" fill={colors.ink}>{values[0] ?? "a"}</text><text x="120" y="138" fontSize="11" fill={colors.ink}>{values[1] ?? "b"}</text><text x="129" y="68" fontSize="11" fill={colors.ink}>hypoténuse</text></svg><p className="text-[11px] text-center" style={{color:colors.slate}}>On calcule d’abord le carré, puis on prend la racine carrée : longueur = {exercise?.answerDisplay ?? exercise?.answer ?? "?"}{exercise?.answerUnit ? ` ${exercise.answerUnit}` : ""}.</p></div>;
    }
    if (family === "geometry_rectangle_measure") {
      return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Voir la surface comme des lignes de carrés</p><svg viewBox="0 0 260 135" className="mt-2 w-full" role="img" aria-label="Rectangle quadrillé avec longueur et largeur"><rect x="42" y="22" width="176" height="82" rx="3" fill={`${colors.gold}12`} stroke={colors.ink} strokeWidth="3"/><g stroke={`${colors.ink}28`} strokeWidth="1">{[1,2,3,4,5,6].map(index=><line key={`v-${index}`} x1={42+index*25.14} y1="22" x2={42+index*25.14} y2="104"/>)}{[1,2,3].map(index=><line key={`h-${index}`} x1="42" y1={22+index*20.5} x2="218" y2={22+index*20.5}/>)}</g><path d="M42 116 H218" stroke={colors.gold} strokeWidth="4" strokeDasharray="8 5"><animate attributeName="stroke-dashoffset" values="26;0" dur="1.5s" repeatCount="indefinite"/></path><path d="M30 22 V104" stroke={colors.green} strokeWidth="4" strokeDasharray="8 5"><animate attributeName="stroke-dashoffset" values="26;0" dur="1.5s" repeatCount="indefinite"/></path><text x="112" y="131" fontSize="11" fill={colors.ink}>{values[0] ?? "longueur"}</text><text x="4" y="67" fontSize="11" fill={colors.ink}>{values[1] ?? "largeur"}</text></svg><p className="text-[11px] text-center" style={{color:colors.slate}}>Chaque ligne contient « longueur » carrés et il y a « largeur » lignes : aire = longueur × largeur.</p></div>;
    }
    if (family === "geometry_circle_measure") {
      return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Repérer rayon, diamètre et grandeur demandée</p><svg viewBox="0 0 240 115" className="mt-2 w-full"><circle cx="120" cy="58" r="43" fill={`${colors.gold}12`} stroke={colors.ink} strokeWidth="3"/><line x1="120" y1="58" x2="163" y2="58" stroke={colors.gold} strokeWidth="4"><animate attributeName="stroke-dasharray" values="0 50;50 0" dur="1.4s" repeatCount="indefinite"/></line><circle cx="120" cy="58" r="4" fill={colors.green}/><text x="130" y="50" fontSize="12" fill={colors.ink}>{values[0] ? `r = ${values[0]}` : "rayon"}</text></svg></div>;
    }
    if (family === "geometry_triangle_angles") {
      return <div className="mt-4 rounded-xl bg-white p-3" data-visual="triangle-alternate-interior-angles" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Les trois angles forment un angle plat au sommet</p><svg viewBox="0 0 280 175" className="mt-2 w-full" role="img" aria-label="Triangle avec une parallèle au côté passant par le sommet et report des angles alternes-internes"><line x1="18" y1="30" x2="262" y2="30" stroke={colors.green} strokeWidth="3" strokeDasharray="9 5"><animate attributeName="stroke-dashoffset" values="28;0" dur="1.8s" repeatCount="indefinite"/></line><path d="M35 142 L140 30 L245 142 Z" fill={`${colors.gold}08`} stroke={colors.ink} strokeWidth="3" strokeLinejoin="round"/><line x1="35" y1="142" x2="245" y2="142" stroke={colors.green} strokeWidth="3"/><path d="M122 49 A25 25 0 0 0 105 40" fill="none" stroke={colors.gold} strokeWidth="7" strokeLinecap="round"><animate attributeName="stroke-opacity" values=".35;1;.35" dur="2s" repeatCount="indefinite"/></path><path d="M158 49 A25 25 0 0 1 175 40" fill="none" stroke={colors.green} strokeWidth="7" strokeLinecap="round"><animate attributeName="stroke-opacity" values=".35;1;.35" dur="2s" begin=".4s" repeatCount="indefinite"/></path><path d="M126 45 A21 21 0 0 1 154 45" fill="none" stroke={colors.red} strokeWidth="7" strokeLinecap="round"><animate attributeName="stroke-opacity" values=".35;1;.35" dur="2s" begin=".8s" repeatCount="indefinite"/></path><path d="M50 142 A20 20 0 0 1 48 128" fill="none" stroke={colors.gold} strokeWidth="6"/><path d="M230 142 A20 20 0 0 0 232 128" fill="none" stroke={colors.green} strokeWidth="6"/><text x="49" y="128" fontSize="12" fontWeight="800" fill={colors.gold}>50°</text><text x="208" y="128" fontSize="12" fontWeight="800" fill={colors.green}>60°</text><text x="91" y="22" fontSize="12" fontWeight="800" fill={colors.gold}>50°</text><text x="180" y="22" fontSize="12" fontWeight="800" fill={colors.green}>60°</text><text x="132" y="58" fontSize="12" fontWeight="800" fill={colors.red}>70°</text><text x="64" y="70" fontSize="9" fill={colors.slate}>angles alternes-internes</text><text x="145" y="164" textAnchor="middle" fontSize="10" fontWeight="700" fill={colors.green}>droites parallèles</text><path d="M126 139 l8 -5 l8 5 M126 27 l8 -5 l8 5" fill="none" stroke={colors.green} strokeWidth="2"/></svg><div className="flex flex-wrap items-center justify-center gap-1 text-[11px] font-black" style={{color:colors.ink}}><span style={{color:colors.gold}}>50°</span><span>+</span><span style={{color:colors.red}}>70°</span><span>+</span><span style={{color:colors.green}}>60°</span><span>= 180°</span></div><p className="mt-2 text-center text-[11px]" style={{color:colors.slate}}>La parallèle reporte les angles de la base au sommet grâce aux angles alternes-internes. Les trois angles adjacents forment alors un angle plat : ils sont supplémentaires.</p></div>;
    }
    if (family === "geometry_parallel_vectors") {
      return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Même direction : les droites sont parallèles</p><svg viewBox="0 0 270 135" className="mt-2 w-full" role="img" aria-label="Deux droites parallèles avec des vecteurs directeurs colinéaires"><defs><marker id="parallel-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={colors.gold}/></marker></defs><line x1="25" y1="99" x2="240" y2="49" stroke={colors.ink} strokeWidth="3"/><line x1="30" y1="59" x2="245" y2="9" stroke={colors.ink} strokeWidth="3"/><line x1="58" y1="91" x2="145" y2="71" stroke={colors.gold} strokeWidth="5" markerEnd="url(#parallel-arrow)"/><line x1="92" y1="45" x2="179" y2="25" stroke={colors.gold} strokeWidth="5" markerEnd="url(#parallel-arrow)"/></svg><div className="text-center text-sm font-black" style={{color:colors.ink}}><MathText text="\\(\\vec v=k\\vec u\\Rightarrow(d_1)\\parallel(d_2)\\)"/></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Les droites peuvent être distinctes ou confondues ; leurs directions sont parallèles.</p></div>;
    }
    if (family === "point_coordinates") {
      return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Abscisse d’abord, ordonnée ensuite</p><svg viewBox="0 0 250 135" className="mt-2 w-full" role="img" aria-label="Point A de coordonnées 3 moins 2 dans un repère"><defs><marker id="coordinates-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={colors.ink}/></marker></defs><line x1="20" y1="55" x2="232" y2="55" stroke={colors.ink} strokeWidth="2" markerEnd="url(#coordinates-arrow)"/><line x1="100" y1="122" x2="100" y2="12" stroke={colors.ink} strokeWidth="2" markerEnd="url(#coordinates-arrow)"/>{[-3,-2,-1,1,2,3,4].map((value)=><g key={`x-${value}`}><line x1={100+value*25} y1="51" x2={100+value*25} y2="59" stroke={colors.ink}/><text x={100+value*25} y="70" textAnchor="middle" fontSize="9" fill={colors.slate}>{value}</text></g>)}{[-3,-2,-1,1,2].map((value)=><g key={`y-${value}`}><line x1="96" y1={55-value*20} x2="104" y2={55-value*20} stroke={colors.ink}/><text x="90" y={58-value*20} textAnchor="end" fontSize="9" fill={colors.slate}>{value}</text></g>)}<path d="M100 55 H175 V95" fill="none" stroke={colors.gold} strokeWidth="4" strokeDasharray="8 5"><animate attributeName="stroke-dashoffset" values="26;0" dur="1.5s" repeatCount="indefinite"/></path><circle cx="175" cy="95" r="6" fill={colors.green}/><text x="183" y="99" fontSize="12" fontWeight="700" fill={colors.ink}>A(3 ; −2)</text><text x="218" y="48" fontSize="10" fill={colors.ink}>x</text><text x="107" y="17" fontSize="10" fill={colors.ink}>y</text></svg><div className="mt-1 flex items-center justify-center gap-2 text-[11px] font-black" style={{color:colors.ink}}><span className="rounded-lg px-2 py-1" style={{background:`${colors.gold}22`}}>3 horizontalement</span><ArrowRight size={13} color={colors.gold}/><span className="rounded-lg px-2 py-1" style={{background:`${colors.green}18`}}>−2 verticalement</span></div><div className="mt-3 grid gap-2 sm:grid-cols-2"><div className="rounded-xl p-2" style={{background:`${colors.gold}10`}}><svg viewBox="0 0 150 72" className="w-full" role="img" aria-label="Le a manuscrit se termine horizontalement"><text x="18" y="51" fontSize="48" fontFamily="cursive" fontStyle="italic" fill={colors.ink}>a</text><path d="M52 50 C75 50 95 50 128 50" fill="none" stroke={colors.gold} strokeWidth="5" strokeLinecap="round"><animate attributeName="stroke-dasharray" values="0 90;90 0" dur="1.5s" repeatCount="indefinite"/></path><text x="73" y="23" fontSize="10" fill={colors.ink}>abscisse</text></svg><p className="text-center text-[10px] font-bold" style={{color:colors.slate}}>Le « a » finit horizontalement.</p></div><div className="rounded-xl p-2" style={{background:`${colors.green}10`}}><svg viewBox="0 0 150 72" className="w-full" role="img" aria-label="Le o manuscrit se termine verticalement"><text x="20" y="55" fontSize="48" fontFamily="cursive" fontStyle="italic" fill={colors.ink}>o</text><path d="M56 52 C58 40 58 25 58 8" fill="none" stroke={colors.green} strokeWidth="5" strokeLinecap="round"><animate attributeName="stroke-dasharray" values="0 60;60 0" dur="1.5s" repeatCount="indefinite"/></path><text x="73" y="23" fontSize="10" fill={colors.ink}>ordonnée</text></svg><p className="text-center text-[10px] font-bold" style={{color:colors.slate}}>Le « o » remonte verticalement.</p></div></div><p className="mt-2 text-center text-[11px]" style={{color:colors.slate}}>L’ordonnée fonctionne comme une altitude : elle indique la hauteur du point.</p></div>;
    }
    if (family === "geometry_vectors" || (family === "geometry_coordinates" && /vecteur/i.test(`${exercise?.chapter ?? ""} ${exercise?.prompt ?? ""}`))) {
      return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Arrivée moins départ</p><svg viewBox="0 0 250 125" className="mt-2 w-full" role="img" aria-label="Vecteur allant du point A au point B"><line x1="20" y1="95" x2="232" y2="95" stroke={colors.ink} strokeWidth="2"/><line x1="55" y1="115" x2="55" y2="12" stroke={colors.ink} strokeWidth="2"/><path d="M80 82 L190 30" stroke={colors.gold} strokeWidth="5" strokeDasharray="9 5"><animate attributeName="stroke-dashoffset" values="28;0" dur="1.5s" repeatCount="indefinite"/></path><circle cx="80" cy="82" r="5" fill={colors.ink}/><circle cx="190" cy="30" r="5" fill={colors.green}/><text x="66" y="78" fontSize="12" fill={colors.ink}>A</text><text x="198" y="28" fontSize="12" fill={colors.ink}>B</text><text x="112" y="48" fontSize="11" fill={colors.ink}>AB = {exercise?.answerDisplay ?? exercise?.answer ?? "?"}</text></svg><p className="text-[11px] text-center" style={{color:colors.slate}}>Coordonnées de AB = coordonnées de B − coordonnées de A, horizontalement puis verticalement.</p></div>;
    }
    if (family === "geometry_coordinates") {
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
  if (family === "geometry_dot_product") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Deux directions perpendiculaires, un produit scalaire nul</p><svg viewBox="0 0 240 125" className="mt-2 w-full" role="img" aria-label="Deux vecteurs perpendiculaires de coordonnées 2, 1 et moins 1, 2"><defs><marker id="arrow-gold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill={colors.gold}/></marker><marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill={colors.green}/></marker></defs><line x1="115" y1="88" x2="202" y2="45" stroke={colors.gold} strokeWidth="5" markerEnd="url(#arrow-gold)"/><line x1="115" y1="88" x2="72" y2="18" stroke={colors.green} strokeWidth="5" markerEnd="url(#arrow-green)"/><path d="M103 68 L123 56 L135 76" fill="none" stroke={colors.ink} strokeWidth="2.5"/><circle cx="115" cy="88" r="4" fill={colors.ink}/><text x="176" y="38" fontSize="12" fontWeight="700" fill={colors.ink}>u⃗ (2 ; 1)</text><text x="30" y="18" fontSize="12" fontWeight="700" fill={colors.ink}>v⃗ (−1 ; 2)</text></svg><div className="text-center text-sm font-black" style={{color:colors.ink}}><MathText text="\\(\\vec u\\cdot\\vec v=2\\times(-1)+1\\times2=0\\)" /></div><p className="mt-2 text-[11px] text-center" style={{color:colors.slate}}>Le calcul avec les coordonnées confirme ce que montre la figure : les deux vecteurs non nuls sont orthogonaux.</p></div>;
  }
  if (family === "calculus_derivative") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}>
        <p className="text-xs font-bold" style={{color:colors.ink}}>La dérivée donne la pente</p>
        <svg viewBox="0 0 240 115" className="mt-2 w-full" role="img" aria-label="Courbe avec point d'inflexion et tangente qui traverse la courbe"><path d="M15 96 C75 96 88 70 120 56 C152 42 165 16 225 16" fill="none" stroke={colors.ink} strokeWidth="3"/><line x1="48" y1="91" x2="192" y2="21" stroke={colors.gold} strokeWidth="3" strokeDasharray="7 5"><animate attributeName="stroke-dashoffset" values="24;0" dur="1.4s" repeatCount="indefinite"/></line><circle cx="120" cy="56" r="5" fill={colors.green}/><text x="126" y="70" fontSize="10" fill={colors.ink}>point de tangence</text><text x="128" y="82" fontSize="9" fill={colors.slate}>la tangente traverse la courbe</text></svg>
      </div>
    );
  }
  if (family === "number_sequence_pattern") {
    const values = valuesFrom(exercise).slice(0, 3);
    const shown = values.length >= 3 ? values : ["2", "2,5", "3"];
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Repérer la règle qui se répète</p><div className="mt-4 flex items-center justify-center gap-1 text-xs font-black" style={{color:colors.ink}}>{[...shown, "?"].map((value,index)=><div key={`${value}-${index}`} className="flex items-center"><span className="flex h-10 min-w-10 items-center justify-center rounded-xl px-2" style={{background:index===shown.length?`${colors.green}22`:`${colors.gold}20`,animation:index===shown.length?"pulse 1.6s infinite":undefined}}>{value}</span>{index<shown.length&&<div className="flex flex-col items-center"><ArrowRight size={15} color={colors.gold}/><span className="text-[8px] font-bold" style={{color:colors.slate}}>même règle</span></div>}</div>)}</div><p className="mt-3 text-[11px] text-center" style={{color:colors.slate}}>On vérifie la règle sur deux passages avant de l’appliquer au terme recherché.</p></div>;
  }
  if (["sequence_squeeze_theorem", "function_squeeze_theorem"].includes(family)) {
    const sequence = family === "sequence_squeeze_theorem";
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Les deux bornes se resserrent vers la même limite</p><svg viewBox="0 0 260 135" className="mt-2 w-full" role="img" aria-label="Encadrement par deux bornes convergeant vers la même limite"><line x1="20" y1="68" x2="240" y2="68" stroke={colors.green} strokeWidth="2" strokeDasharray="6 5"/><text x="226" y="61" fontSize="11" fontWeight="700" fill={colors.green}>ℓ</text><path d="M25 20 C90 28 150 52 235 66" fill="none" stroke={colors.gold} strokeWidth="3"/><path d="M25 116 C90 108 150 84 235 71" fill="none" stroke={colors.gold} strokeWidth="3"/><path d="M25 62 C75 93 122 45 166 79 C195 91 220 68 235 69" fill="none" stroke={colors.ink} strokeWidth="3" strokeDasharray={sequence?"2 7":undefined}/><text x="35" y="130" fontSize="10" fill={colors.slate}>l’encadrement se resserre lorsque {sequence?"n":"x"} grandit</text></svg><div className="text-center text-sm font-black" style={{color:colors.ink}}><MathText text={sequence ? "\\(a_n\\leq u_n\\leq b_n,\\quad a_n\\to\\ell,\\ b_n\\to\\ell\\Rightarrow u_n\\to\\ell\\)" : "\\(g(x)\\leq f(x)\\leq h(x),\\quad g(x)\\to\\ell,\\ h(x)\\to\\ell\\Rightarrow f(x)\\to\\ell\\)"}/></div></div>;
  }
  if (family === "sequence_limit") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>Observer les termes lorsque le rang devient grand</p><svg viewBox="0 0 260 115" className="mt-2 w-full" role="img" aria-label="Termes d’une suite qui se rapprochent d’une limite"><line x1="20" y1="55" x2="240" y2="55" stroke={colors.green} strokeWidth="2" strokeDasharray="7 5"/><text x="226" y="49" fontSize="11" fontWeight="700" fill={colors.green}>ℓ</text>{[[30,94],[58,25],[88,78],[118,40],[148,67],[178,50],[208,60],[235,54]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="4" fill={i>4?colors.gold:colors.ink}><animate attributeName="r" values="3;5;3" dur="1.5s" begin={`${i*0.1}s`} repeatCount="indefinite"/></circle>)}</svg><p className="text-[11px] text-center" style={{color:colors.slate}}>On étudie le comportement global de \\(u_n\\) lorsque \\(n\\to+\\infty\\), pas le passage d’un terme au suivant.</p></div>;
  }
  if (family === "function_limit") {
    return <div className="mt-4 rounded-xl bg-white p-3" style={{border:`1px solid ${colors.gold}35`}}><p className="text-xs font-bold" style={{color:colors.ink}}>La courbe se rapproche d’une valeur limite</p><svg viewBox="0 0 260 115" className="mt-2 w-full" role="img" aria-label="Courbe se rapprochant d’une asymptote horizontale"><line x1="20" y1="57" x2="240" y2="57" stroke={colors.green} strokeWidth="2" strokeDasharray="7 5"/><path d="M23 104 C62 104 78 83 105 73 C144 57 179 60 237 57" fill="none" stroke={colors.ink} strokeWidth="3"/><text x="214" y="50" fontSize="11" fill={colors.green}>y = ℓ</text></svg><p className="text-[11px] text-center" style={{color:colors.slate}}>La limite décrit le comportement de \\(f(x)\\) au voisinage de la valeur étudiée ou lorsque \\(x\\) devient très grand.</p></div>;
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
