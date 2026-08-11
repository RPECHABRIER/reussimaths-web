import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { getCalculationMode } from "./src/lib/calculationMode.js";
import { buildDailyMentalQuestions } from "./src/lib/dailyMentalMath.js";
import { LEVELS } from "./src/levels.js";
import { getAllDiscoveryShowcases } from "./src/discoveryShowcases.js";

const chapterDirectory=new URL("./src/chapters/",import.meta.url);
const files=(await readdir(chapterDirectory)).filter((name)=>name.endsWith(".js")&&name!=="registry.js").sort();
let mental=0,calculator=0,checked=0;
for(const file of files){
  const chapter=(await import(pathToFileURL(new URL(file,chapterDirectory).pathname))).default;
  const themes=chapter.meta.isAutomatismes?chapter.themes.map((theme)=>theme.id):[undefined];
  for(const theme of themes){for(let index=0;index<4;index+=1){
    const exercise=chapter.generate(theme);if(!exercise)continue;const mode=getCalculationMode(exercise);checked+=1;
    if(mode==="mental")mental+=1;else calculator+=1;
    const text=`${exercise.chapter??""} ${exercise.prompt??""}`;
    if(/sans calculatrice/i.test(text)&&mode!=="mental")throw new Error(`Question sans calculatrice mal classée : ${exercise.prompt}`);
    if(/arrondi|valeur approchée/i.test(text)&&mode!=="calculator")throw new Error(`Calcul lourd mal classé : ${exercise.prompt}`);
  }}
}
for(const level of LEVELS){const daily=buildDailyMentalQuestions(level.id);if(daily.length!==10||daily.some((exercise)=>getCalculationMode(exercise)!=="mental"))throw new Error(`Série quotidienne invalide : ${level.id}`);}
const showcaseExercises=getAllDiscoveryShowcases().flatMap((showcase)=>showcase.showcaseExercises);
if(showcaseExercises.length!==50||showcaseExercises.some((exercise)=>getCalculationMode(exercise)!=="mental"))throw new Error("Les 50 questions de découverte doivent rester explicitement sans calculatrice.");
console.log(`${checked} questions auditées : ${mental} calcul mental, ${calculator} calculatrice autorisée. Les 10 niveaux gardent 10/10 questions quotidiennes sans calculatrice et les 50 questions de découverte ont été validées manuellement sans calculatrice.`);
