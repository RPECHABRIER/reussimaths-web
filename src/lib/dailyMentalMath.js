const LEVEL_INDEX={sixieme:0,cinquieme:1,quatrieme:2,troisieme:3,seconde:4,"premiere-spe":5,"premiere-non-spe":5,"premiere-techno":5,"terminale-spe":6,"terminale-techno":6};

function hash(value){let h=2166136261;for(const char of value){h^=char.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function random(seed){let state=seed||1;return()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};}
function integer(rng,min,max){return Math.floor(rng()*(max-min+1))+min;}
function format(value){return String(Math.round(value*100)/100).replace(".",",");}

export function localDateKey(date=new Date()){const year=date.getFullYear();const month=String(date.getMonth()+1).padStart(2,"0");const day=String(date.getDate()).padStart(2,"0");return `${year}-${month}-${day}`;}
export function dailyMentalKey(levelId,date=new Date()){return `${levelId}:${localDateKey(date)}`;}

export function buildDailyMentalQuestions(levelId,date=new Date()){
  const tier=LEVEL_INDEX[levelId]??0;const rng=random(hash(dailyMentalKey(levelId,date)));const questions=[];
  const limit=tier<2?60:tier<4?120:250;
  const add=()=>{const a=integer(rng,8,limit),b=integer(rng,5,limit);questions.push({prompt:`${a} + ${b} = ?`,answer:a+b,method:`${a} + ${b} = ${a+b}`});};
  const subtract=()=>{let a=integer(rng,15,limit*2),b=integer(rng,4,a);if(tier>=2&&rng()<.35)[a,b]=[b,a];questions.push({prompt:`${a} − ${b} = ?`,answer:a-b,method:`${a} − ${b} = ${a-b}`});};
  const multiply=()=>{const max=tier<2?10:tier<4?15:20,a=integer(rng,2,max),b=integer(rng,2,max);questions.push({prompt:`${a} × ${b} = ?`,answer:a*b,method:`${a} × ${b} = ${a*b}`});};
  const divide=()=>{const divisor=integer(rng,2,tier<3?10:15),quotient=integer(rng,2,tier<3?12:20),value=divisor*quotient;questions.push({prompt:`${value} ÷ ${divisor} = ?`,answer:quotient,method:`${value} ÷ ${divisor} = ${quotient}`});};
  [add,subtract,multiply,divide,add,subtract,multiply,divide].forEach((make)=>make());
  const rates=tier<2?[10,25,50]:[5,10,15,20,25,50];
  for(let i=0;i<2;i+=1){const rate=rates[integer(rng,0,rates.length-1)];const base=integer(rng,2,tier<3?12:20)*20;const answer=base*rate/100;questions.push({prompt:`${rate} % de ${base} = ?`,answer,method:`10 % de ${base} vaut ${format(base/10)}. On adapte ensuite pour obtenir ${rate} %, soit ${format(answer)}.`});}
  return questions.map((question,index)=>({...question,id:`${dailyMentalKey(levelId,date)}:${index}`,chapter:"Calcul mental du jour",calculationMode:"mental"}));
}
