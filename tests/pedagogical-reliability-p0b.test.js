import test from 'node:test';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire, Module } from 'node:module';
import { build } from 'esbuild';
import { observeAnswer, summarizeQuestions, sessionEvidence, reviewObservation } from '../src/lib/pedagogicalReliability.js';
import { analogueMatch, generateSimilarExercise } from '../src/lib/recoveryAnalogue.js';
import { rememberLearningReview, toRemoteLearningReview, mergeLearningReviews } from '../src/lib/learningReviewHistory.js';
import { correctWowMessage } from '../src/lib/pedagogyWow.js';
const direct = () => observeAnswer({}, {correct:true});
const failed = () => observeAnswer({}, {correct:false});
const skill='Décimaux';
const stats = (...facts) => summarizeQuestions(facts.map(f=>({...f,skill})));
test('A première réussite sans aide, sans difficulté ni maîtrise déduite',()=>{
 const q=direct(); assert.equal(q.correct,true); assert.equal(q.autonomous,true); assert.equal(q.hadError,false);
 assert.deepEqual(sessionEvidence(stats(q)),{autonomous:[skill],reinforce:[],recovered:[]});
});
test('B erreur → aide → même question correcte : réussite finale unique non autonome',()=>{
 const q=observeAnswer(failed(),{correct:true,assisted:true});
 assert.equal(q.correct,true);assert.equal(q.autonomous,false);assert.equal(q.hadError,true);
 assert.equal(stats(q)[skill].correct,1); assert.deepEqual(sessionEvidence(stats(q)).reinforce,[skill]);
});
test('C erreur puis analogue autonome : récupération sans effacement de difficulté',()=>{
 const q=observeAnswer({}, {correct:true,recoveryPresented:true});
 assert.equal(q.recovered,true);assert.equal(q.autonomous,true);
 assert.deepEqual(sessionEvidence(stats(failed(),q)).reinforce,[skill]);
 assert.match(correctWowMessage({},q.recovered),/réussi seul/); assert.doesNotMatch(correctWowMessage({},true),/réparée|maîtris/);
});
test('D analogue aidé puis correct : pas de recovery_success',()=>{
 const q=observeAnswer({}, {correct:true,assisted:true,recoveryPresented:true});assert.equal(q.recovered,false);assert.equal(q.autonomous,false);assert.equal(q.correct,true);
});
test('E analogue erroné puis retry correct : erreur conservée, jamais récupération autonome',()=>{
 const q=observeAnswer(failed(),{correct:true,recoveryPresented:true});assert.equal(q.recovered,false);assert.equal(q.hadError,true);assert.equal(q.autonomous,false);
});
const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)};globalThis.window={dispatchEvent(){}};
const exercise={chapter:'Statistiques — Moyenne',prompt:'Moyenne de 8, 10, 15 ?',type:'numeric',answer:11};
test('F carte après bonne réponse, disponible puis consultée : aucune difficulté',()=>{
 memory.clear();const options={exercise,response:11,feedback:{family:'stats',steps:[]},...direct()};
 rememberLearningReview(options);const review=rememberLearningReview({exercise,response:11,feedback:{family:'stats'},correct:true,methodStatus:'consulted'});
 assert.equal(review.hadError,false);assert.equal(review.correct,true);assert.equal(review.autonomous,true);assert.equal(review.methodStatus,'consulted');assert.doesNotMatch(reviewObservation(review),/erreur a été rencontrée/);
 const remote=toRemoteLearningReview(review);assert.ok(!('response' in remote.payload));assert.equal(remote.payload.autonomous,true);assert.equal(remote.payload.expectedAnswer,11);
 const merged=mergeLearningReviews([],[{id:1,payload:remote.payload,reviewed_at:new Date().toISOString()}]);assert.equal(merged[0].hadError,false);
});
test('parent legacy : information inconnue conservée, pas de difficulté inventée',()=>{assert.match(reviewObservation({family:'stats'}),/ne sont pas renseignés/);});
test('G réussites rapprochées : chaque question compte une fois, aucune preuve durable',()=>{
 const q=observeAnswer(direct(),{correct:true});assert.equal(stats(q)[skill].correct,1);assert.equal(stats(q)[skill].autonomousCorrect,1);
 assert.equal(stats(direct(),direct(),direct())[skill].correct,3);
});
test('sans présentation pertinente : réussite autonome générale, sans récupération',()=>{assert.equal(direct().recovered,false);});
const dec=(a,b)=>({chapter:'Nombres décimaux — Comparaison',type:'qcm',prompt:`Compare ${a} et ${b}.`,answer:'<'});
test('décimaux : rejeter le contre-exemple et conserver le piège de position',()=>{
 const a=dec('0,17','0,3');assert.equal(analogueMatch(a,dec('12,6','68')),null);assert.equal(analogueMatch(a,dec('0,24','0,4')),'obstacle');
 let i=0;const chapter={generate:()=>[dec('12,6','68'),dec('0,24','0,4')][Math.min(i++,1)]};assert.equal(generateSimilarExercise(chapter,'standard',a).prompt,dec('0,24','0,4').prompt);
 assert.equal(generateSimilarExercise({generate:()=>dec('12,6','68')},'standard',a),null);
});
const samples=[
 ['signes','Nombres relatifs — Addition','Calcule (-8) + 3.','Calcule (-9) + 4.','Calcule (-2) + 7.'],
 ['équations','Équations — Résoudre','Résous 3x + 4 = 13.','Résous 5x + 6 = 21.','Résous 5x - 6 = 21.'],
 ['proportionnalité','Proportionnalité — Retour à l’unité','3 cahiers coûtent 6 €. Prix de 5 cahiers ?','4 cahiers coûtent 8 €. Prix de 7 cahiers ?','Quel pourcentage représente 4 sur 8 ?'],
 ['Thalès','Théorème de Thalès — Longueur','AM = 3, AB = 9, AC = 12. Calcule AN.','AM = 4, AB = 12, AC = 15. Calcule AN.','AN = 4, AC = 12, AB = 15. Calcule AM.'],
 ['probabilités','Probabilités — Événement contraire','P(A) = 0,2. Calcule P(non A).','P(A) = 0,3. Calcule P(non A).','P(A) = 0,3. Calcule P(A et B).'],
 ['fonctions','Fonctions — Image','f(x) = 3x + 4. Calcule f(2).','f(x) = 5x + 6. Calcule f(3).','f(x) = 5x + 6. Résous f(x) = 3.'],
 ['dérivation','Dérivation — Nombre dérivé',"f’(x) = 3x + 4. Calcule f’(2).","f’(x) = 5x + 6. Calcule f’(3).","f’(x) = 5x^2 + 6. Calcule f’(3)."],
];
for(const [family,chapter,prompt,next,other] of samples)test(`analogue ${family} : structure préservée, autre obstacle non certifié`,()=>{
 const a={chapter,prompt,type:'numeric'};assert.equal(analogueMatch(a,{...a,prompt:next}),'obstacle');assert.notEqual(analogueMatch(a,{...a,prompt:other}),'obstacle');
});
test('obstacle inconnu : général ; changement de compétence/énoncé identique : refus',()=>{
 const a={chapter:'Vocabulaire',prompt:'Quel mot décrit 2 côtés ?',type:'text'};assert.equal(analogueMatch(a,{...a,prompt:'Quel mot décrit 3 angles ?'}),'skill');assert.equal(analogueMatch(a,a),null);assert.equal(analogueMatch(a,{...a,chapter:'Autre'}),null);
});
// Rendu du vrai composant aux quatre âges, sans serveur ni compte.
const root=new URL('../',import.meta.url).pathname;
const result=await build({stdin:{contents:`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {MemoryRouter} from 'react-router-dom';import Session from './src/components/SessionCelebration';export function render(props){return renderToStaticMarkup(<MemoryRouter><Session {...props}/></MemoryRouter>)}`,resolveDir:root,loader:'jsx'},plugins:[{name:'offline-supabase',setup(b){b.onLoad({filter:/supabaseClient\.js$/},()=>({contents:'export const supabase = {};',loader:'js'}));}}],loader:{'.png':'dataurl'},bundle:true,platform:'node',format:'cjs',write:false,jsx:'automatic',logLevel:'silent'});
const m=new Module(root+'tests/p0b-render.cjs');m.paths=createRequire(import.meta.url).resolve.paths('react');m._compile(result.outputFiles[0].text,root+'tests/p0b-render.cjs');
for(const levelId of ['sixieme','troisieme','seconde','terminale-spe'])test(`bilan ${levelId} : immédiat et factuel, sans révision promise`,()=>{
 const html=m.exports.render({levelId,chapterTitle:'Notion',correct:3,total:3,skillStats:stats(direct(),direct(),direct())});
 assert.match(html,/Réussi sans aide aujourd’hui/);assert.doesNotMatch(html,/Bien maîtrisé|révision programmée|méthode est réparée/);assert.match(html,/autre séance/);
});
test('câblage analytics : présentation, autonomie et déduplication',async()=>{
 const runner=await readFile(root+'src/components/ChapterRunner.jsx','utf8');
 assert.match(runner,/recoveryPresented: recoveryOpportunityTrackedRef.current.has\(exercise\)/);
 assert.match(runner,/if \(recovered && !recoverySuccessTrackedRef.current.has\(exercise\)\)/);
 assert.match(runner,/questionFactsRef.current.set/);assert.match(runner,/setSessionSkillStats\(summarizeQuestions/);
});

// Exécuter les gestionnaires réels de ChapterRunner avec leurs dépendances
// contrôlées : vérifie les événements émis, pas une copie de leur condition.
const runnerSource=await readFile(root+'src/components/ChapterRunner.jsx','utf8');
function runnerHarness(scope='obstacle') {
 const events=[];
 const ctx={observeAnswer,summarizeQuestions,Date,console,Boolean,
  persistQuestionReview(){},exercise:{chapter:'Test',prompt:'Question analogue',recoveryCheck:{scope}},
  chapter:{meta:{id:'test',level:'sixieme',title:'Test'}},mode:'entrainement',isCours:false,isDecouverte:false,quotaExhausted:false,sessionDone:false,
  verificationSkill:'Test',effectiveDifficulty:'standard',user:null,
  classifyLearningError:()=> 'calculation_error',generateSimilarExercise:()=>null,buildPedagogicalFeedback:()=>({}),rememberLearningReview:()=>null,toRemoteLearningReview:()=>null,
  exerciseStartRef:{current:Date.now()},assistanceUsedRef:{current:false},completedExerciseRef:{current:null},questionFactsRef:{current:new Map()},
  recoveryOpportunityTrackedRef:{current:new WeakSet()},recoverySuccessTrackedRef:{current:new WeakSet()},sessionCorrectExercisesRef:{current:new WeakSet()},
  lastAttemptRef:{current:null},activeDecisionRef:{current:null},consecutiveCorrectRef:{current:0},
  quotaApplies:false,isSession:true,streak:0,score:0,skillTracking:{recordAttempt(){}},
  trackProductEvent:(name)=>events.push(name),setFeedback(value){ctx.feedback=value},setSessionSkillStats(value){ctx.stats=value},
 };
 for(const name of ['setAttemptsOnExercise','setSimilarExercise','setAnsweredCount','setCorrectCount','adjustDifficulty','queueRedrill','setScore','setStreak','setBest','recordResult','setVerificationSkill'])ctx[name]=()=>{};
 vm.createContext(ctx);
 const register=runnerSource.slice(runnerSource.indexOf('  const registerResult ='),runnerSource.indexOf('  const submitNumeric ='));
 const effect=runnerSource.slice(runnerSource.indexOf('  // La présentation effective'),runnerSource.indexOf('  // Streak quotidien'));
 ctx.useEffect=(fn)=>{ctx.present=fn};
 vm.runInContext(effect+register+';this.answer=registerResult;',ctx);
 return {ctx,events};
}
for (const scenario of ['C','D','E','general']) test(`runner réel ${scenario} : opportunité/succès émis exactement`,()=>{
 const {ctx,events}=runnerHarness(scenario==='general'?'skill':'obstacle');
 assert.equal(events.length,0);ctx.present();ctx.present();
 assert.equal(events.filter(e=>e==='recovery_opportunity').length,scenario==='general'?0:1);
 if(scenario==='D')ctx.assistanceUsedRef.current=true;
 if(scenario==='E')ctx.answer(false,'0');
 ctx.answer(true,'1');ctx.answer(true,'1');
 assert.equal(events.filter(e=>e==='recovery_success').length,scenario==='C'?1:0);
 assert.equal(events.filter(e=>e==='exercise_completed').length,1);
 assert.equal(ctx.stats.Test.correct,1);
 assert.equal(ctx.stats.Test.autonomousCorrect,['C','general'].includes(scenario)?1:0);
});
test('runner : aucune opportunité si cours, quota ou fin masque la question',()=>{
 for(const flag of ['isCours','quotaExhausted','sessionDone']){const {ctx,events}=runnerHarness();ctx[flag]=true;ctx.present();assert.equal(events.length,0);}
});

test('puissances Unicode : carré et cube ne sont pas le même obstacle',()=>{
 const q={chapter:'Fonctions — Image',type:'numeric',prompt:'f(x) = x². Calcule f(3).'};
 assert.notEqual(analogueMatch(q,{...q,prompt:'f(x) = x³. Calcule f(4).'}),'obstacle');
});
test('la consultation de méthode conserve le fait d’aide avant de quitter la question',()=>{
 const {ctx}=runnerHarness();ctx.answer(false,'0');ctx.showHelp=false;ctx.setShowHelp=()=>{};
 let saved;ctx.persistQuestionReview=(_exercise,_response,facts,status)=>{saved={facts,status}};
 const source=runnerSource.slice(runnerSource.indexOf('  const toggleMethod ='),runnerSource.indexOf('  const retry ='));
 vm.runInContext(source+';toggleMethod();',ctx);
 assert.equal(saved.status,'consulted');assert.equal(saved.facts.assisted,true);assert.equal(saved.facts.hadError,true);
});
test('les synchronisations parent restent ordonnées malgré une réponse réseau lente',async()=>{
 let release;const first=new Promise(resolve=>{release=resolve});const sent=[];
 const ctx={chapter:{meta:{level:'sixieme'}},user:{id:'test'},console,Date,reviewSyncRef:{current:Promise.resolve()},
 rememberLearningReview:value=>value,toRemoteLearningReview:review=>({reviewKey:'same',payload:review}),buildPedagogicalFeedback:()=>({}),
 supabase:{from:()=>({upsert:({payload})=>{sent.push(payload.correct);return sent.length===1?first:Promise.resolve({error:null})}})}};
 vm.createContext(ctx);const source=runnerSource.slice(runnerSource.indexOf('  const persistQuestionReview ='),runnerSource.indexOf('  const toggleMethod ='));
 vm.runInContext(source+`;persistQuestionReview({},'0',{correct:false},'available');persistQuestionReview({},'1',{correct:true},'available');`,ctx);
 await Promise.resolve();assert.deepEqual(sent,[false]);release({error:null});await ctx.reviewSyncRef.current;assert.deepEqual(sent,[false,true]);
});
