import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { getCalculationMode } from "./src/lib/calculationMode.js";
import { buildDailyMentalQuestions } from "./src/lib/dailyMentalMath.js";
import { LEVELS } from "./src/levels.js";
import { getAllDiscoveryShowcases } from "./src/discoveryShowcases.js";

const chapterDirectory=new URL("./src/chapters/",import.meta.url);
const files=(await readdir(chapterDirectory)).filter((name)=>name.endsWith(".js")&&name!=="registry.js").sort();
let mental=0,calculator=0,freeChoice=0,checked=0;
const examples={mental:[],calculator:[],choice:[]};
for(const file of files){
  const chapter=(await import(pathToFileURL(new URL(file,chapterDirectory).pathname))).default;
  const themes=chapter.meta.isAutomatismes?chapter.themes.map((theme)=>theme.id):[undefined];
  for(const theme of themes){for(let index=0;index<4;index+=1){
    const exercise=chapter.generate(theme);if(!exercise)continue;const mode=getCalculationMode(exercise);checked+=1;
    if(mode==="mental"){mental+=1;if(examples.mental.length<20)examples.mental.push(exercise.prompt);}else if(mode==="calculator"){calculator+=1;if(examples.calculator.length<20)examples.calculator.push(exercise.prompt);}else{freeChoice+=1;if(examples.choice.length<20)examples.choice.push(exercise.prompt);}
    const text=`${exercise.chapter??""} ${exercise.prompt??""}`;
    if(/sans calculatrice/i.test(text)&&mode!=="mental")throw new Error(`Question sans calculatrice mal classée : ${exercise.prompt}`);
    if(/calcule[^.?!]*(?:arrondi|valeur approchée)/i.test(text)&&mode!=="calculator")throw new Error(`Calcul lourd mal classé : ${exercise.prompt}`);
  }}
}
for(const level of LEVELS){const daily=buildDailyMentalQuestions(level.id);if(daily.length!==10||daily.some((exercise)=>getCalculationMode(exercise)!=="mental"))throw new Error(`Série quotidienne invalide : ${level.id}`);}
const showcaseExercises=getAllDiscoveryShowcases().flatMap((showcase)=>showcase.showcaseExercises);
if(showcaseExercises.length!==50)throw new Error("Les parcours de découverte doivent contenir exactement 50 questions.");
console.log(`${checked} questions auditées : ${mental} sans calculatrice, ${calculator} calculatrice autorisée, ${freeChoice} laissées au choix. Les 10 niveaux gardent 10/10 questions quotidiennes sans calculatrice et les 50 questions de découverte ont été contrôlées.`);
if(process.argv.includes("--details"))for(const [mode,prompts] of Object.entries(examples)){console.log(`\n${mode.toUpperCase()}`);prompts.forEach((prompt)=>console.log(`- ${prompt}`));}
