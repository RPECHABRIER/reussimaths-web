import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createRequire, Module } from 'node:module';
import { build } from 'esbuild';
import { getDiagnosticShowcaseExercises } from '../src/discoveryShowcases.js';
import { createDiagnosticResult, summarizeDiagnostic } from '../src/lib/diagnosticResults.js';
import { selectPrerequisiteChapters } from '../src/lib/prerequisites.js';
import { teacherAnswer, hasTeacherOptions, TEACHER_EXERCISE_TYPES } from '../src/lib/teacherExercise.js';
import * as thales from '../src/chapters/theoreme-thales.js';

const root = new URL('../', import.meta.url).pathname;
const files = (await readdir(`${root}src/chapters`)).filter(f => f.endsWith('.js') && f !== 'registry.js');
const chapters = (await Promise.all(files.map(f => import(`../src/chapters/${f}`)))).map(m => m.default).filter(Boolean);
const byId = new Map(chapters.map(c => [c.meta.id, c]));
async function bundle(source) {
  const registry = await readFile(`${root}src/chapters/registry.js`, 'utf8');
  const imports = files.map((f,i) => `import * as c${i} from './${f}';`).join('\n');
  const result = await build({stdin:{contents:source,resolveDir:root,sourcefile:'p0a-test-entry.jsx',loader:'jsx'},bundle:true,format:'cjs',platform:'node',write:false,jsx:'automatic',logLevel:'silent',plugins:[{name:'vite-registry',setup(b){b.onLoad({filter:/chapters\/registry\.js$/},()=>({contents:imports+'\n'+registry.replace('import.meta.glob("./*.js", { eager: true })','{'+files.map((f,i)=>`${JSON.stringify(f)}:c${i}`).join(',')+'}'),resolveDir:`${root}src/chapters`,loader:'js'}));}}]});
  const m = new Module(`${root}tests/p0a-bundle.cjs`);
  m.paths = createRequire(import.meta.url).resolve.paths('react');
  m._compile(result.outputFiles[0].text, `${root}tests/p0a-bundle.cjs`);
  return m.exports;
}
const runtime = await bundle(`export * from './src/parcours.js'; export * from './src/lib/diagnosticProfile.js';`);
const expected = {
  sixieme: ['Numération — Grands nombres','Calcul — Priorités',"Fractions — Fraction d'une quantité",'Proportionnalité — Retour à l’unité','Grandeurs et mesures — Unités de longueur'],
  cinquieme: ['Numération décimale — Valeur de position','Fractions — Partage','Proportionnalité — Retour à l’unité',"Grandeurs et mesures — Aire d'un rectangle",'Géométrie repérée — Coordonnées'],
  quatrieme: ['Nombres relatifs — Addition de signes opposés','Fractions — Addition','Pourcentages — Calculer une proportion',"Angles — Angles d'un triangle",'Probabilités — Issues favorables'],
  troisieme: ['Nombres relatifs — Produit','Équations — Résoudre','Théorème de Pythagore — Hypoténuse','Proportionnalité — Vitesse','Statistiques — Moyenne'],
  seconde: ['Théorème de Thalès — Longueur','Équations — Produit nul','Fonctions — Image','Pourcentages — Évolution','Probabilités — Événement contraire'],
  'premiere-spe': ['Fonctions — Antécédent','Fonctions affines — Coefficient directeur','Statistiques — Médiane','Vecteurs — Coordonnées','Probabilités — Événement contraire'],
  'terminale-spe': ['Second degré — Discriminant','Dérivation — Nombre dérivé','Suites arithmétiques — Terme général','Probabilités conditionnelles — Probabilité conditionnelle','Produit scalaire — Orthogonalité'],
  'terminale-techno': ['Pourcentages — Coefficient multiplicateur','Fonctions affines — Antécédent','Second degré — Image','Statistiques — Moyenne pondérée','Algorithmique — Boucle'],
};
expected['premiere-techno']=expected['premiere-spe'];
expected['premiere-non-spe']=expected['premiere-spe'];
const targets = {
 sixieme:['nombres-decimaux','operations-decimaux','fractions','proportionnalite','grandeurs-mesures'],
 cinquieme:['nombres-decimaux','fractions','proportionnalite','grandeurs-mesures','nombres-relatifs'],
 quatrieme:['nombres-relatifs','divisibilite-fractions','proportionnalite-cinquieme','triangles','statistiques-probabilites'],
 troisieme:['multiplication-division-rationnels','resolution-equations','triangles-rectangles-quatrieme','proportionnalite-quatrieme','statistiques-quatrieme'],
 seconde:['thales-triangles-semblables-troisieme','equations-troisieme','notion-fonction-troisieme','proportionnalite-troisieme','probabilites-troisieme'],
 'premiere-spe':['generalites-fonctions-seconde','fonctions-affines-seconde','statistiques-descriptives-seconde','vecteurs-seconde','probabilites-echantillonnage-seconde'],
 'terminale-spe':['second-degre','derivation-premiere-spe','suites-numeriques-premiere-spe','probabilites-conditionnelles-premiere-spe','vecteurs-produit-scalaire-premiere-spe'],
 'terminale-techno':['informations-chiffrees-seconde','fonctions-affines-seconde','fonctions-second-degre-premiere-techno','statistiques-descriptives-seconde','algorithmique-python-premiere-techno'],
};
targets['premiere-non-spe']=targets['premiere-spe'];
targets['premiere-techno']=targets['premiere-spe'];
const memory = new Map();
globalThis.localStorage = {getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)};
for (const [level, skills] of Object.entries(expected)) {
  test(`diagnostic ${level}: question → résultat → bilan → stockage`, () => {
    const wrappers=runtime.getDiagnosticChapters(level, ['calcul-litteral-troisieme']);
    const questions=wrappers.map(c=>c.generate());
    assert.deepEqual(questions.map(q=>q.chapter),skills);
    assert.deepEqual(questions.map(q=>q.diagnostic.remediationChapterId),targets[level]);
    assert.equal(new Set(questions.map(q=>q.diagnostic.id)).size,5);
    for (const q of questions) {
      assert.ok(q.diagnostic.levelId && q.diagnostic.skillId);
      assert.ok(byId.has(q.diagnostic.remediationChapterId));
      if(q.diagnostic.sourceChapterId && q.diagnostic.levelId!=='cm2') assert.ok(byId.has(q.diagnostic.sourceChapterId));
    }
    // Chaque question devient tour à tour la seule erreur : aucune permutation possible.
    for (let wrong=0;wrong<5;wrong++) {
      const results=questions.map((q,i)=>createDiagnosticResult(q,i!==wrong));
      const summary=summarizeDiagnostic(results);
      assert.deepEqual(summary.priorities,[results[wrong]]);
      assert.equal(summary.priorities[0].skill,skills[wrong]);
      assert.equal(summary.remediationChapterId,questions[wrong].diagnostic.remediationChapterId);
      assert.ok(summary.strengths.every(r=>r.correct && skills.includes(r.skill) && r.skill!==skills[wrong]));
      assert.deepEqual(results.map(r=>r.correct),questions.map((_,i)=>i!==wrong));
      runtime.setDiagnosticProfile(level,results);
      assert.deepEqual(runtime.getDiagnosticRemediationIds(level),[questions[wrong].diagnostic.remediationChapterId]);
    }
  });
}
test('scénario 3e : seul le produit de négatifs est en difficulté',()=>{
 const questions=getDiagnosticShowcaseExercises('troisieme');
 assert.equal(questions[0].answer,12);
 const summary=summarizeDiagnostic(questions.map((q,i)=>createDiagnosticResult(q,i!==0)));
 assert.equal(summary.remediationChapterId,'multiplication-division-rationnels');
 assert.equal(summary.priorities[0].chapterTitle,'Nombres relatifs — Produit');
 assert.equal(summary.priorities[0].levelId,'quatrieme');
 assert.throws(()=>createDiagnosticResult({...questions[0],chapter:'Autre notion'},false));
});
test('un ancien profil sans identité de question ne crée plus de remédiation',()=>{
 runtime.setDiagnosticProfile('troisieme',[{chapterId:'calcul-litteral-quatrieme',correct:false}]);
 assert.deepEqual(runtime.getDiagnosticRemediationIds('troisieme'),[]);
});
test('la recommandation hors essai commence aussi par la difficulté, sans programme configuré',()=>{
 const qs=getDiagnosticShowcaseExercises('troisieme');
 runtime.setDiagnosticProfile('troisieme',qs.map((q,i)=>createDiagnosticResult(q,i!==0)));
 for(const p of runtime.getParcoursForLevel('troisieme')) assert.equal(p.steps[0].chapterId,'multiplication-division-rationnels');
});
const c=(id,order,title='neutre')=>({meta:{id,title,...(order==null?{}:{order})}});
test('prérequis : présent, absent, ordre incomplet, égalité déterministe',()=>{
 const pool=[c('z-absent',0),c('multiplication-division-rationnels'),c('addition-soustraction-rationnels'),c('a-absent',0)];
 const ids=selectPrerequisiteChapters('troisieme',[],pool).map(c=>c.meta.id);
 assert.deepEqual(ids,['addition-soustraction-rationnels','multiplication-division-rationnels','a-absent','z-absent']);
 assert.deepEqual(selectPrerequisiteChapters('inconnu',[],[c('b'),c('a')]).map(c=>c.meta.id),['a','b']);
 assert.deepEqual(selectPrerequisiteChapters('troisieme',[],pool,2).map(c=>c.meta.id),ids.slice(0,2));
 assert.deepEqual(selectPrerequisiteChapters('troisieme',[],[]),[]);
});
test('prérequis : un thème pertinent peut primer, jamais le seul -1',()=>{
 const selected=[c('fonction-cible',1,'Fonctions')];
 const pool=[c('addition-soustraction-rationnels'),c('fonctions-source',99,'Fonctions')];
 assert.equal(selectPrerequisiteChapters('troisieme',selected,pool)[0].meta.id,'fonctions-source');
});
function seeded(run) { const original=Math.random;let seed=42;Math.random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/2**32;};try{return run();}finally{Math.random=original;} }
const length=(e,name)=>{const m=e.prompt.match(new RegExp(`\\b${name} = (\\d+(?:[.,]\\d+)?)`));assert.ok(m,e.prompt);return Number(m[1].replace(',','.'));};
for(const name of ['genCalculerLongueurThalesANNumeric','genCalculerLongueurThalesMNNumeric','genFormeCorrecteEgaliteThalesQCM','genReciproqueThalesParallelesQCM','genRapportAgrandissementReductionThalesQCM']) {
 test(`Thalès ${name} : 3000 configurations valides`,()=>seeded(()=>{
  const outcomes=new Set();
  for(let i=0;i<3000;i++) {
   const e=thales[name]();outcomes.add(e.answer);
   if(name.includes('Agrandissement')) {
    const PT=length(e,'PT'),PR=length(e,'PR');assert.ok(PT>0&&PR>0&&PT!==PR);
    if(e.prompt.includes('T appartient au côté [PR]')) {assert.ok(PT<PR,e.prompt);assert.ok(e.prompt.includes('V appartient au côté [PS]'));assert.equal(e.answer,'Réduction');}
    else {assert.ok(PR<PT,e.prompt);assert.ok(e.prompt.includes('R appartient au côté [PT]')&&e.prompt.includes('S appartient au côté [PV]'));assert.equal(e.answer,'Agrandissement');}
   } else {
    const AM=length(e,'AM'),AB=length(e,'AB');assert.ok(AM>0&&AM<AB,e.prompt);
    if(name.includes('Reciproque')) {const AN=length(e,'AN'),AC=length(e,'AC');assert.ok(AN>0&&AN<AC,e.prompt);assert.equal(e.answer,Math.abs(AM/AB-AN/AC)<1e-10?'Oui':'Non');}
    if(name.includes('ANNumeric')||name.includes('MNNumeric')) {const total=length(e,name.includes('ANNumeric')?'AC':'BC');assert.ok(total>0);assert.ok(e.answer>0&&e.answer<total);assert.ok(Math.abs(e.answer-total*AM/AB)<=.00501);}
    if(name.includes('Egalite')) {const AC=length(e,'AC');assert.ok(AC>0);assert.equal(e.answer,`\\dfrac{${AM}}{${AB}} = \\dfrac{AN}{${AC}}`);}
    if(e.figure){const pts=Object.fromEntries(e.figure.points.map(p=>[p.id,p]));for(const [part,end] of [['M','B'],['N','C']]) for(const axis of ['x','y']) assert.ok(Math.abs(pts[part][axis]-(pts.A[axis]+AM/AB*(pts[end][axis]-pts.A[axis])))<1e-9);}
   }
  }
  if(name.includes('Agrandissement')) assert.deepEqual([...outcomes].sort(),['Agrandissement','Réduction']);
  if(name.includes('Reciproque')) assert.deepEqual([...outcomes].sort(),['Non','Oui']);
 }));
}
const rendering=await bundle(`import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server'; import {PrintableSession} from './src/pages/Enseignant.jsx'; export const render=(exercises,withCorrections)=>renderToStaticMarkup(<PrintableSession title="Test" levelId="sixieme" exercises={exercises} withCorrections={withCorrections}/>);`);
const samples=seeded(()=>{const found=new Map();for(const ch of chapters.filter(c=>c.meta.isAutomatismes))for(const theme of ch.themes)for(let i=0;i<100;i++){const e=ch.generate(theme.id);assert.ok(TEACHER_EXERCISE_TYPES.includes(e.type),`${ch.meta.id}: nouveau type non testé ${e.type}`);if(!found.has(e.type)||e.type==='text'&&e.figure)found.set(e.type,e);}return found;});
for(const type of TEACHER_EXERCISE_TYPES) test(`enseignant ${type} : répondable, propositions et corrigé imprimables`,()=>{
 const e=samples.get(type);assert.ok(e);assert.ok(e.prompt);
 const question=rendering.render([e],false),correction=rendering.render([e],true);
 assert.ok(!question.includes('teacher-print-answer'));assert.ok(correction.includes('teacher-print-answer'));
 assert.ok(teacherAnswer(e)&&teacherAnswer(e)!=='undefined');
 if(hasTeacherOptions(e)){assert.equal((question.match(/<li/g)||[]).length,e.options.length);assert.ok(e.options.length>1);}
 if(e.figure) assert.ok(question.includes('<svg')&&correction.includes('<svg'));
 if(type==='multi') assert.equal(teacherAnswer(e),e.answer.length ? e.answer.map(i=>String(e.options[i])).join(' · ') : 'Aucune proposition');
});
test('enseignant : indices internes multi remplacés par les valeurs, sans ambiguïté QCM',()=>{
 const e={type:'multi',prompt:'Coche les diviseurs de 100.',chapter:'Divisibilité',options:['3','7','1','2'],answer:[2,3],steps:[]};
 assert.equal(teacherAnswer(e),'1 · 2');
 assert.ok(rendering.render([e],true).includes('1 · 2'));
 assert.ok(!rendering.render([e],false).includes('teacher-print-answer'));
 assert.equal(teacherAnswer({type:'qcm',options:['0','1','2'],answer:'2'}),'2');
 assert.equal(teacherAnswer({...e,answer:[99]}),'Réponse indisponible');
});
test('intégration : bilan et sauvegarde gardent les métadonnées de la question',async()=>{
 const page=await readFile(`${root}src/pages/ParcoursDiagnostic.jsx`,'utf8');
 assert.match(page,/createDiagnosticResult\(exercise, correct\)/);
 assert.match(page,/summarizeDiagnostic\(results\)/);
 assert.doesNotMatch(page,/chapterId: chapters\[index\]/);
 assert.match(page,/trial_source=diagnostic/);
});
