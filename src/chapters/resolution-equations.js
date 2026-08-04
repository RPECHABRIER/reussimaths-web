// ---------------------------------------------------------------------------
// Chapitre : Résolution d'équations (4e) — sous abonnement.
//
// Correspond au chapitre 6 du sommaire officiel : tester si un nombre est
// solution d'une équation, résoudre des équations du premier degré (avec ou
// sans parenthèses, inconnue des deux côtés), traduire un problème par une
// équation puis le résoudre (âges, prix, périmètres, programmes de calcul).
// Reprend la tâche intellectuelle des exercices fournis, avec des nombres,
// prénoms et contextes différents à chaque génération. Voir
// automatismes-quatrieme.js pour le thème "Calcul mental" associé.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const nonZero = (min, max) => {
  let n = 0;
  while (n === 0) n = randInt(min, max);
  return n;
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const fr = (n) => String(n).replace(".", ",");

// =========================== Tester une égalité ===========================

// ---------- 1. Un nombre est-il solution d'une équation ? ----------
function genTesterSolutionEquationQCM() {
  const a = nonZero(-9, 9);
  const xSol = nonZero(-12, 12);
  const b = nonZero(-9, 9);
  const c = a * xSol + b;
  const testIsSolution = Math.random() < 0.5;
  const xTest = testIsSolution ? xSol : xSol + nonZero(1, 4);
  const leftValue = a * xTest + b;
  const isSolution = leftValue === c;
  return {
    type: "qcm",
    chapter: "Résolution d'équations — Tester",
    prompt: `Le nombre ${xTest} est-il solution de l'équation \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\) ?`,
    answer: isSolution ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `${a} \\times ${xTest} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${leftValue}` },
      {
        type: "resultat",
        text: isSolution ? `${leftValue} = ${c}, donc c'est bien solution.` : `${leftValue} \\neq ${c}, donc ce n'est pas solution.`,
      },
    ],
  };
}

// =========================== Résoudre une équation du premier degré ===========================

// ---------- 2. Équation du type x + a = b ----------
function genResoudreEquationAdditionSoustractionNumeric() {
  const xSol = nonZero(-30, 30);
  const a = nonZero(-20, 20);
  const b = xSol + a;
  return {
    type: "numeric",
    chapter: "Résolution d'équations — Résoudre",
    prompt: `Résous l'équation : \\(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)} = ${b}\\)`,
    answer: xSol,
    steps: [{ type: "calcul", text: `x = ${b} ${a >= 0 ? "-" : "+"} ${Math.abs(a)} = ${xSol}` }],
  };
}

// ---------- 3. Équation du type ax = b ----------
function genResoudreEquationMultiplicationNumeric() {
  const a = nonZero(-12, 12);
  const xSolNum = nonZero(-40, 40);
  const xSolDen = pick([1, 1, 1, 2, 4, 5]);
  const xSol = roundTo(xSolNum / xSolDen, 4);
  const b = roundTo(a * xSol, 4);
  return {
    type: "numeric",
    chapter: "Résolution d'équations — Résoudre",
    prompt: `Résous l'équation : \\(${a}x = ${fr(b)}\\)`,
    answer: xSol,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `x = ${fr(b)} \\div ${a} = ${fr(xSol)}` }],
  };
}

// ---------- 4. Équation du type ax + b = c ----------
function genResoudreEquationDeuxEtapesNumeric() {
  const a = nonZero(-12, 12);
  const xSol = nonZero(-20, 20);
  const b = nonZero(-20, 20);
  const c = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Résolution d'équations — Résoudre",
    prompt: `Résous l'équation : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\)`,
    answer: xSol,
    steps: [
      { type: "calcul", text: `${a}x = ${c} ${b >= 0 ? "-" : "+"} ${Math.abs(b)} = ${c - b}` },
      { type: "resultat", text: `x = ${c - b} \\div ${a} = ${xSol}` },
    ],
  };
}

// ---------- 5. Équation avec l'inconnue des deux côtés : ax + b = cx + d ----------
function genResoudreEquationDesDeuxCotesNumeric() {
  let a, c;
  do {
    a = nonZero(-9, 9);
    c = nonZero(-9, 9);
  } while (a === c);
  const xSol = nonZero(-15, 15);
  const b = nonZero(-20, 20);
  const d = a * xSol + b - c * xSol;
  return {
    type: "numeric",
    chapter: "Résolution d'équations — Résoudre",
    prompt: `Résous l'équation : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}x ${d >= 0 ? "+" : "-"} ${Math.abs(d)}\\)`,
    answer: xSol,
    steps: [
      { type: "calcul", text: `${a}x - (${c}x) = ${d} - (${b})` },
      { type: "calcul", text: `${a - c}x = ${d - b}` },
      { type: "resultat", text: `x = ${d - b} \\div ${a - c} = ${xSol}` },
    ],
  };
}

// ---------- 6. Équation avec parenthèses : k(x + m) + b = c ----------
function genResoudreEquationAvecParenthesesNumeric() {
  const k = nonZero(-9, 9);
  const m = nonZero(-9, 9);
  const xSol = nonZero(-15, 15);
  const b = nonZero(-15, 15);
  const c = k * (xSol + m) + b;
  const km = k * m;
  return {
    type: "numeric",
    chapter: "Résolution d'équations — Résoudre",
    prompt: `Résous l'équation : \\(${k}\\left(x ${m >= 0 ? "+" : "-"} ${Math.abs(m)}\\right) ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\)`,
    answer: xSol,
    steps: [
      { type: "calcul", text: `${k}x ${km >= 0 ? "+" : "-"} ${Math.abs(km)} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}` },
      { type: "calcul", text: `${k}x = ${c} ${km + b >= 0 ? "-" : "+"} ${Math.abs(km + b)} = ${c - (km + b)}` },
      { type: "resultat", text: `x = ${c - (km + b)} \\div ${k} = ${xSol}` },
    ],
  };
}

// ---------- 7. Quelle opération pour isoler x ? ----------
function genOperationInverseQCM() {
  const a = nonZero(-9, 9);
  const isAdd = Math.random() < 0.5;
  const correct = isAdd ? `Soustraire ${Math.abs(a)}` : `Ajouter ${Math.abs(a)}`;
  const wrong1 = isAdd ? `Ajouter ${Math.abs(a)}` : `Soustraire ${Math.abs(a)}`;
  const wrong2 = `Multiplier par ${Math.abs(a)}`;
  const wrong3 = `Diviser par ${Math.abs(a)}`;
  const b = nonZero(-20, 20);
  return {
    type: "qcm",
    chapter: "Résolution d'équations — Résoudre",
    prompt: `Pour résoudre l'équation \\(x ${isAdd ? "+" : "-"} ${Math.abs(a)} = ${b}\\), quelle opération faut-il effectuer sur les deux membres pour isoler x ?`,
    answer: correct,
    options: shuffle([correct, wrong1, wrong2, wrong3]),
    steps: [{ type: "regle", text: `Pour isoler x, on effectue l'opération inverse : ${correct}.` }],
  };
}

// =========================== Traduire et résoudre un problème ===========================

// ---------- 8. Traduire un problème d'âges par une équation ----------
function genTraduireProblemeAgeQCM() {
  const anneesEcoulees = randInt(2, 10);
  const multiple1 = randInt(2, 4);
  const multiple2 = multiple1 + randInt(1, 3);
  const correct = `${multiple1}x = ${multiple2}(x - ${anneesEcoulees})`;
  const wrong1 = `${multiple1}x = ${multiple2}x - ${anneesEcoulees}`;
  const wrong2 = `${multiple1}(x - ${anneesEcoulees}) = ${multiple2}x`;
  const wrong3 = `${multiple1}x + ${multiple2}x = ${anneesEcoulees}`;
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])]);
  const noms = { 2: "double", 3: "triple" };
  const mult1Str = noms[multiple1] || `${multiple1} fois`;
  const mult2Str = noms[multiple2] || `${multiple2} fois`;
  return {
    type: "qcm",
    chapter: "Résolution d'équations — Problèmes",
    prompt: `« Si je prends le ${mult1Str} de mon âge, j'obtiens le ${mult2Str} de l'âge que j'avais il y a ${anneesEcoulees} ans. » En notant x mon âge actuel, quelle équation traduit ce problème ?`,
    answer: correct,
    options: options.length >= 2 ? options : [correct, wrong1],
    steps: [
      {
        type: "regle",
        text: `Le ${mult1Str} de mon âge : ${multiple1}x. L'âge il y a ${anneesEcoulees} ans : x - ${anneesEcoulees}. Le ${mult2Str} de cet âge : ${multiple2}(x - ${anneesEcoulees}).`,
      },
    ],
  };
}

// ---------- 9. Problème : somme d'un nombre, son double et son triple ----------
function genProblemeSommeMultiplesNumeric() {
  const xSol = randInt(2, 100);
  const total = xSol + 2 * xSol + 3 * xSol;
  return {
    type: "numeric",
    chapter: "Résolution d'équations — Problèmes",
    prompt: `On cherche un nombre pour lequel la somme de lui-même, de son double et de son triple est égale à ${total}. Quel est ce nombre ?`,
    answer: xSol,
    steps: [
      { type: "calcul", text: `x + 2x + 3x = 6x = ${total}` },
      { type: "resultat", text: `x = ${total} \\div 6 = ${xSol}` },
    ],
  };
}

// ---------- 10. Problème d'âges : le double égale le triple d'un âge passé ----------
function genProblemeDoubleTripleAgeNumeric() {
  const anneesEcoulees = randInt(2, 10);
  const xSol = 3 * anneesEcoulees;
  return {
    type: "numeric",
    chapter: "Résolution d'équations — Problèmes",
    prompt: `« Le double de mon âge est égal au triple de l'âge que j'avais il y a ${anneesEcoulees} ans. » Quel est mon âge actuel (noté x) ?`,
    answer: xSol,
    steps: [
      { type: "donnee", text: `2x = 3(x - ${anneesEcoulees})` },
      { type: "calcul", text: `2x = 3x - ${3 * anneesEcoulees}` },
      { type: "calcul", text: `-x = -${3 * anneesEcoulees}` },
      { type: "resultat", text: `x = ${xSol}` },
    ],
  };
}

// ---------- 11. Problème de périmètre ----------
function genPerimetreEquationNumeric() {
  const largeurFixe = randInt(2, 15);
  const nbCotesX = randInt(2, 6);
  const xSol = randInt(2, 30);
  const perimetre = nbCotesX * xSol + 2 * largeurFixe;
  return {
    type: "numeric",
    chapter: "Résolution d'équations — Problèmes",
    prompt: `Une figure a un périmètre égal à \\(${nbCotesX}x + ${2 * largeurFixe}\\) mm. Détermine x pour que ce périmètre soit égal à ${perimetre} mm.`,
    answer: xSol,
    steps: [
      { type: "donnee", text: `${nbCotesX}x + ${2 * largeurFixe} = ${perimetre}` },
      { type: "calcul", text: `${nbCotesX}x = ${perimetre - 2 * largeurFixe}` },
      { type: "resultat", text: `x = ${perimetre - 2 * largeurFixe} \\div ${nbCotesX} = ${xSol}` },
    ],
  };
}

// ---------- 12. Programme de calcul : trouver le nombre de départ ----------
function genProgrammeCalculTrouverEntreeNumeric() {
  const m = nonZero(-9, 9);
  const p = nonZero(-15, 15);
  const xSol = nonZero(-20, 20);
  const sortie = m * xSol + p;
  return {
    type: "numeric",
    chapter: "Résolution d'équations — Problèmes",
    prompt: `Un programme de calcul consiste à : choisir un nombre, le multiplier par ${m}, puis ajouter ${p}. Quel nombre de départ permet d'obtenir ${sortie} en sortie du programme ?`,
    answer: xSol,
    steps: [
      { type: "donnee", text: `${m}x ${p >= 0 ? "+" : "-"} ${Math.abs(p)} = ${sortie}` },
      { type: "calcul", text: `${m}x = ${sortie - p}` },
      { type: "resultat", text: `x = ${sortie - p} \\div ${m} = ${xSol}` },
    ],
  };
}

// ---------- 13. Deux programmes de calcul donnant le même résultat ----------
function genDeuxProgrammesMemeResultatNumeric() {
  let m1, m2;
  do {
    m1 = nonZero(-9, 9);
    m2 = nonZero(-9, 9);
  } while (m1 === m2);
  const p1 = nonZero(-15, 15);
  const xSol = nonZero(-15, 15);
  const p2 = m1 * xSol + p1 - m2 * xSol;
  return {
    type: "numeric",
    chapter: "Résolution d'équations — Problèmes",
    prompt: `Le programme A consiste à multiplier un nombre par ${m1} puis ajouter ${p1}. Le programme B consiste à multiplier ce même nombre par ${m2} puis ajouter ${p2}. Pour quelle valeur du nombre de départ les deux programmes donnent-ils le même résultat ?`,
    answer: xSol,
    steps: [
      { type: "donnee", text: `${m1}x ${p1 >= 0 ? "+" : "-"} ${Math.abs(p1)} = ${m2}x ${p2 >= 0 ? "+" : "-"} ${Math.abs(p2)}` },
      { type: "calcul", text: `${m1 - m2}x = ${p2 - p1}` },
      { type: "resultat", text: `x = ${p2 - p1} \\div ${m1 - m2} = ${xSol}` },
    ],
  };
}

// ---------- 14. Problème de prix (sortie scolaire) ----------
function genPrixEquationContexteNumeric() {
  const nEnfants = randInt(10, 150);
  const nAdultes = randInt(2, 15);
  const diff = randInt(1, 5);
  const xSol = randInt(3, 20);
  const total = nEnfants * xSol + nAdultes * (xSol + diff);
  return {
    type: "numeric",
    chapter: "Résolution d'équations — Problèmes",
    prompt: `Une sortie scolaire réunit ${nEnfants} enfants et ${nAdultes} adultes. Une place adulte coûte ${diff} € de plus qu'une place enfant, et le coût total de la sortie est de ${total} €. Quel est le prix d'une place enfant, en euros ?`,
    answer: xSol,
    steps: [
      { type: "donnee", text: `${nEnfants}x + ${nAdultes}(x + ${diff}) = ${total}` },
      { type: "calcul", text: `${nEnfants + nAdultes}x + ${nAdultes * diff} = ${total}` },
      { type: "resultat", text: `x = (${total} - ${nAdultes * diff}) \\div ${nEnfants + nAdultes} = ${xSol}` },
    ],
  };
}

const GENERATORS = [
  genTesterSolutionEquationQCM,
  genResoudreEquationAdditionSoustractionNumeric,
  genResoudreEquationMultiplicationNumeric,
  genResoudreEquationDeuxEtapesNumeric,
  genResoudreEquationDesDeuxCotesNumeric,
  genResoudreEquationAvecParenthesesNumeric,
  genOperationInverseQCM,
  genTraduireProblemeAgeQCM,
  genProblemeSommeMultiplesNumeric,
  genProblemeDoubleTripleAgeNumeric,
  genPerimetreEquationNumeric,
  genProgrammeCalculTrouverEntreeNumeric,
  genDeuxProgrammesMemeResultatNumeric,
  genPrixEquationContexteNumeric,
];

const DIFFICULTY = {
  genTesterSolutionEquationQCM: "facile",
  genResoudreEquationAdditionSoustractionNumeric: "facile",
  genResoudreEquationMultiplicationNumeric: "facile",
  genOperationInverseQCM: "facile",
  genResoudreEquationDeuxEtapesNumeric: "standard",
  genResoudreEquationDesDeuxCotesNumeric: "standard",
  genResoudreEquationAvecParenthesesNumeric: "standard",
  genPerimetreEquationNumeric: "standard",
  genProgrammeCalculTrouverEntreeNumeric: "standard",
  genTraduireProblemeAgeQCM: "expert",
  genProblemeSommeMultiplesNumeric: "expert",
  genProblemeDoubleTripleAgeNumeric: "expert",
  genDeuxProgrammesMemeResultatNumeric: "expert",
  genPrixEquationContexteNumeric: "expert",
};

function generate(difficulty) {
  if (difficulty) {
    const pool = GENERATORS.filter((fn) => (DIFFICULTY[fn.name] ?? "standard") === difficulty);
    if (pool.length) return pick(pool)();
  }
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "resolution-equations",
    title: "Résolution d'équations",
    description: "Tester si un nombre est solution d'une équation, résoudre des équations du premier degré, traduire et résoudre des problèmes concrets.",
    pourquoi: "Résoudre une équation, c'est traduire un problème concret en calcul, puis remonter du calcul à la solution du problème.",
    level: "quatrieme",
    free: false,
    order: 7,
  },
  generate,
};
