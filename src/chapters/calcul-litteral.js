// ---------------------------------------------------------------------------
// Chapitre : Calcul littéral (5e) — sous abonnement.
//
// Reprend la tâche intellectuelle des exercices fournis (Séries 2 à 7 du
// chapitre "Calcul littéral" : traduire en formule, tester une égalité,
// distributivité littérale, démontrer une égalité, résoudre une équation, et
// une touche culturelle inspirée d'Al-Khwârizmî), avec des nombres, prénoms
// et contextes différents à chaque génération. Voir automatismes-cinquieme.js
// (thème "calcul littéral") pour la Série 1 (Automatismes : suites et motifs).
//
// Adaptation du format : les exercices "Démontre que..." du manuel (Série 5)
// ne peuvent pas être corrigés automatiquement (il faudrait évaluer une
// rédaction). Ils sont remplacés par des questions Oui/Non équivalentes sur
// le plan du raisonnement : "cette égalité est-elle vraie pour toute valeur
// de x ?", ce qui teste la même compréhension (développer/réduire pour
// vérifier une identité) sans nécessiter de correction de texte libre. Pour
// la même raison, l'énigme du Série 7 sur le quotient de deux "biens" (avec
// x inconnu des deux côtés de l'égalité) est remplacée par le problème
// d'héritage du même exercice, qui se résout par une simple équation à une
// inconnue.
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
const randDecimal = (min, max, decimals) => roundTo(min + Math.random() * (max - min), decimals);
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

const personnages = ["Marcus", "Livia", "Séverus", "Cassia", "Aurélia", "Tullius", "Octavia", "Décimus"];

function buildRectangleFigureLabeled(numLabel, letterLabel) {
  const A = { id: "A", x: 20, y: 20 };
  const B = { id: "B", x: 150, y: 20 };
  const C = { id: "C", x: 150, y: 70 };
  const D = { id: "D", x: 20, y: 70 };
  return {
    points: [A, B, C, D],
    segments: [
      { from: "A", to: "B" },
      { from: "B", to: "C" },
      { from: "C", to: "D" },
      { from: "D", to: "A" },
    ],
    rightAngles: [
      { at: "A", from: "D", to: "B" },
      { at: "B", from: "A", to: "C" },
      { at: "C", from: "B", to: "D" },
      { at: "D", from: "C", to: "A" },
    ],
    freeLabels: [
      { x: (A.x + B.x) / 2, y: A.y - 8, text: `${numLabel} cm` },
      { x: A.x - 18, y: (A.y + D.y) / 2, text: `${letterLabel} cm` },
    ],
  };
}

// =========================== Série 2 : Traduire en formule ===========================

// ---------- 1. Traduire une phrase en expression littérale ----------
function genTraduirePhraseEnExpressionQCM() {
  const templates = [
    { phrase: "le double d'un nombre", expr: "2 \\times n" },
    { phrase: "le triple d'un nombre", expr: "3 \\times n" },
    { phrase: "la moitié d'un nombre", expr: "n \\div 2" },
    { phrase: "le tiers d'un nombre", expr: "n \\div 3" },
    { phrase: "le carré d'un nombre", expr: "n \\times n" },
    { phrase: "le successeur d'un nombre", expr: "n + 1" },
    { phrase: "le prédécesseur d'un nombre", expr: "n - 1" },
    { phrase: "un nombre augmenté de 7", expr: "n + 7" },
    { phrase: "un nombre diminué de 5", expr: "n - 5" },
  ];
  const shuffled = shuffle(templates);
  const [target, d1, d2] = shuffled;
  const options = shuffle([target.expr, d1.expr, d2.expr]);
  return {
    type: "qcm",
    chapter: "Calcul littéral — Traduire en formule",
    prompt: `Quelle expression littérale correspond à : « ${target.phrase} » ?`,
    answer: target.expr,
    options,
    steps: [{ type: "resultat", text: `« ${target.phrase} » se traduit par \\(${target.expr}\\).` }],
  };
}

// ---------- 2. Valeur d'une expression littérale simple ----------
function genValeurExpressionLitteraleBasique() {
  const kind = pick(["ax+b", "a(x+b)"]);
  const a = randInt(2, 9);
  const b = randInt(1, 20);
  const x = randInt(-6, 10);
  const value = kind === "ax+b" ? a * x + b : a * (x + b);
  return {
    type: "numeric",
    chapter: "Calcul littéral — Traduire en formule",
    prompt: kind === "ax+b" ? `Calcule A = ${a}x + ${b} lorsque x = ${x}.` : `Calcule A = ${a}(x + ${b}) lorsque x = ${x}.`,
    answer: value,
    steps: kind === "ax+b" ? [{ type: "calcul", text: `${a} \\times ${x} + ${b} = ${value}` }] : [{ type: "calcul", text: `${a} \\times (${x} + ${b}) = ${a} \\times ${x + b} = ${value}` }],
  };
}

// ---------- 3. Périmètre d'un rectangle exprimé en fonction de x (figure) ----------
function genPerimetreRectangleEnFonctionDeX() {
  const L = randInt(2, 15);
  const x = randInt(2, 20);
  const perimetre = 2 * (x + L);
  return {
    type: "numeric",
    chapter: "Calcul littéral — Traduire en formule",
    prompt: `ABCD est un rectangle de largeur x et de longueur ${L} cm. Calcule son périmètre (en cm) lorsque x = ${x} cm.`,
    figure: buildRectangleFigureLabeled(L, "x"),
    answer: perimetre,
    steps: [
      { type: "regle", text: `Périmètre = 2 \\times (x + ${L})` },
      { type: "calcul", text: `2 \\times (${x} + ${L}) = ${perimetre}` },
    ],
  };
}

// ---------- 4. Problème : effectif total en fonction de x ----------
function genProblemeAssembleeEffectifEnFonctionDeX() {
  const [groupeA, groupeB, groupeC] = shuffle(["Bretons", "Corses", "Basques", "Alsaciens", "Savoyards", "Occitans"]).slice(0, 3);
  const extra = randInt(10, 80);
  const x = randInt(5, 50);
  const total = 4 * x + extra;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Traduire en formule",
    prompt: `Dans une assemblée, il y a deux fois plus de ${groupeA} que de ${groupeB}, et ${extra} ${groupeC} de plus que de ${groupeB}. On note x le nombre de ${groupeB}. Calcule le nombre total de personnes dans l'assemblée lorsque x = ${x}.`,
    answer: total,
    steps: [
      { type: "regle", text: `Total = x + 2x + (x + ${extra}) = 4x + ${extra}` },
      { type: "calcul", text: `4 \\times ${x} + ${extra} = ${total}` },
    ],
  };
}

// =========================== Série 3 : Tester une égalité ===========================

// ---------- 5. Tester si deux expressions sont égales pour une valeur donnée ----------
function genTesterEgaliteQCM() {
  const a = randInt(2, 8);
  const b = randInt(1, 15);
  const c = randInt(1, 15);
  const x = randInt(0, 6);
  const e1 = a * x + b;
  const e2 = x * x + c;
  const egales = e1 === e2;
  return {
    type: "qcm",
    chapter: "Calcul littéral — Tester une égalité",
    prompt: `On considère \\(E_1 = ${a}x + ${b}\\) et \\(E_2 = x^2 + ${c}\\). Pour x = ${x}, a-t-on \\(E_1 = E_2\\) ?`,
    answer: egales ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `\\(E_1 = ${a} \\times ${x} + ${b} = ${e1}\\)` },
      { type: "calcul", text: `\\(E_2 = ${x}^2 + ${c} = ${e2}\\)` },
    ],
  };
}

// ---------- 6. Trouver, parmi plusieurs valeurs, laquelle vérifie l'égalité ----------
// NOTE (audit programme 2026) : reformulé pour rester dans le cadre officiel
// de 5e — équations du type ax=c OU x+b=c uniquement (jamais les deux
// combinées ax+b=c, qui est un objectif de Quatrième).
function genTrouverValeurXEgaliteVraieQCM() {
  const useMultiplication = Math.random() < 0.5;
  const xTrue = randInt(-6, 10);
  let equation, stepText;
  if (useMultiplication) {
    const a = randInt(2, 8);
    const c = a * xTrue;
    equation = `${a}x = ${c}`;
    stepText = `${a} \\times ${xTrue} = ${c}`;
  } else {
    const b = nonZero(-15, 15);
    const c = xTrue + b;
    equation = `x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}`;
    stepText = `${xTrue} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}`;
  }
  const candidats = new Set([xTrue]);
  while (candidats.size < 4) candidats.add(xTrue + nonZero(-4, 4));
  const options = shuffle([...candidats]).map((v) => `${v}`);
  return {
    type: "qcm",
    chapter: "Calcul littéral — Tester une égalité",
    prompt: `Parmi les valeurs suivantes, laquelle est solution de l'équation \\(${equation}\\) ?`,
    answer: `${xTrue}`,
    options,
    steps: [{ type: "calcul", text: stepText }],
  };
}

// =========================== Série 4 : Distributivité littérale ===========================

// ---------- 7. Développer et trouver le coefficient de x ----------
function genDevelopperTrouverCoefficient() {
  const k = randInt(2, 9);
  const a = randInt(1, 9);
  const b = randInt(1, 20);
  return {
    type: "numeric",
    chapter: "Calcul littéral — Distributivité",
    prompt: `Développe : \\(${k}(${a}x + ${b})\\). Quel est le coefficient de x dans la forme développée ?`,
    answer: k * a,
    steps: [{ type: "calcul", text: `${k}(${a}x + ${b}) = ${k} \\times ${a}x + ${k} \\times ${b} = ${k * a}x + ${k * b}` }],
  };
}

// ---------- 8. Factoriser en trouvant le facteur commun ----------
function genFactoriserTrouverFacteurCommun() {
  let a, b;
  do {
    a = randInt(2, 9);
    b = randInt(2, 9);
  } while (a === b);
  const g = pgcdLocal(a, b);
  const k = randInt(2, 8);
  const coeffX = (k * a) / g;
  const constante = (k * b) / g;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Distributivité",
    prompt: `Factorise en mettant en évidence le plus grand facteur commun entier : \\(${coeffX}x + ${constante}\\). Quel est ce facteur commun ?`,
    answer: k,
    steps: [
      { type: "calcul", text: `${coeffX} = ${k} \\times ${a / g}` },
      { type: "calcul", text: `${constante} = ${k} \\times ${b / g}` },
      { type: "resultat", text: `\\(${coeffX}x + ${constante} = ${k}(${a / g}x + ${b / g})\\)` },
    ],
  };
}

function pgcdLocal(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

// ---------- 9. Vrai ou faux : le développement est-il correct ? ----------
function genTesterVraiFauxDeveloppementQCM() {
  const k = randInt(2, 9);
  const a = randInt(1, 9);
  const b = randInt(1, 20);
  const correct = Math.random() < 0.5;
  const developpementCorrect = `${k * a}x + ${k * b}`;
  const developpementFaux = `${k * a}x + ${b}`;
  const developpementAffiche = correct ? developpementCorrect : developpementFaux;
  return {
    type: "qcm",
    chapter: "Calcul littéral — Distributivité",
    prompt: `Est-ce que \\(${k}(${a}x + ${b}) = ${developpementAffiche}\\) ?`,
    answer: correct ? "Vrai" : "Faux",
    options: ["Vrai", "Faux"],
    steps: [{ type: "calcul", text: `Le développement correct est : \\(${k}(${a}x + ${b}) = ${developpementCorrect}\\)` }],
  };
}

// ---------- 10. Aire d'un rectangle (forme factorisée / développée) ----------
function genAireRectangleFactoriseDeveloppe() {
  const a = randInt(2, 12);
  const b = randInt(2, 12);
  const x = randInt(2, 20);
  const aire = x * (a + b);
  return {
    type: "numeric",
    chapter: "Calcul littéral — Distributivité",
    prompt: `Un rectangle a pour largeur x et pour longueur (${a} + ${b}). Calcule son aire lorsque x = ${x}.`,
    answer: aire,
    steps: [
      { type: "regle", text: `Aire = x \\times (${a} + ${b})` },
      { type: "calcul", text: `${x} \\times (${a} + ${b}) = ${x} \\times ${a + b} = ${aire}` },
    ],
  };
}

// =========================== Série 5 : Démontrer une égalité ===========================

// ---------- 11. Vérifier si une identité est vraie pour toute valeur de x ----------
function genVerifierIdentiteAlgebriqueQCM() {
  const k = randInt(2, 9);
  const a = randInt(1, 15);
  const c = randInt(1, 15);
  const vraie = Math.random() < 0.5;
  const developpe = `${k * a}x + ${k * c}`;
  const faux = `${k * a}x + ${c}`;
  const droite = vraie ? developpe : faux;
  return {
    type: "qcm",
    chapter: "Calcul littéral — Démontrer",
    prompt: `L'égalité \\(${k}(${a}x + ${c}) = ${droite}\\) est-elle vraie pour toute valeur de x ?`,
    answer: vraie ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `En développant, \\(${k}(${a}x + ${c}) = ${developpe}\\), quelle que soit la valeur de x.` }],
  };
}

// =========================== Série 6 : Résoudre une équation ===========================

// ---------- 12. Résoudre une équation d'addition/soustraction ----------
function genResoudreEquationAdditionSoustraction() {
  const mode = pick(["x+a=b", "a+x=b", "x-a=b", "a-x=b"]);
  const a = nonZero(-40, 40);
  const xSolution = nonZero(-40, 40);
  let b, prompt, regle, calcul;
  if (mode === "x+a=b") {
    b = xSolution + a;
    prompt = `Résous : \\(x + ${fr(a)} = ${fr(b)}\\)`;
    regle = `Pour isoler x, on soustrait ${fr(a)} des deux côtés de l'égalité.`;
    calcul = `x = ${fr(b)} - ${fr(a)} = ${fr(xSolution)}`;
  } else if (mode === "a+x=b") {
    b = a + xSolution;
    prompt = `Résous : \\(${fr(a)} + x = ${fr(b)}\\)`;
    regle = `Pour isoler x, on soustrait ${fr(a)} des deux côtés de l'égalité.`;
    calcul = `x = ${fr(b)} - ${fr(a)} = ${fr(xSolution)}`;
  } else if (mode === "x-a=b") {
    b = xSolution - a;
    prompt = `Résous : \\(x - ${fr(a)} = ${fr(b)}\\)`;
    regle = `Pour isoler x, on ajoute ${fr(a)} des deux côtés de l'égalité.`;
    calcul = `x = ${fr(b)} + ${fr(a)} = ${fr(xSolution)}`;
  } else {
    b = a - xSolution;
    prompt = `Résous : \\(${fr(a)} - x = ${fr(b)}\\)`;
    regle = `On isole x en le faisant passer de l'autre côté, puis on soustrait ${fr(b)}.`;
    calcul = `x = ${fr(a)} - ${fr(b)} = ${fr(xSolution)}`;
  }
  return {
    type: "numeric",
    chapter: "Calcul littéral — Résoudre une équation",
    prompt,
    answer: xSolution,
    steps: [
      { type: "regle", text: regle },
      { type: "resultat", text: calcul },
    ],
  };
}

// ---------- 13. Résoudre une équation de multiplication/division ----------
function genResoudreEquationMultiplicationDivision() {
  const mode = pick(["ax=b", "x/a=b"]);
  const a = randInt(2, 12);
  if (mode === "ax=b") {
    const xSolution = Math.random() < 0.7 ? nonZero(-15, 15) : nonZero(-15, 15) + pick([0.5, -0.5]);
    const b = roundTo(a * xSolution, 2);
    return {
      type: "numeric",
      chapter: "Calcul littéral — Résoudre une équation",
      prompt: `Résous : \\(${a}x = ${fr(b)}\\)`,
      answer: xSolution,
      tolerance: 0.01,
      steps: [
        { type: "regle", text: `Pour isoler x, on divise les deux côtés de l'égalité par ${a}.` },
        { type: "calcul", text: `x = ${fr(b)} \\div ${a} = ${fr(xSolution)}` },
      ],
    };
  }
  const b = nonZero(-15, 15);
  const xSolution = a * b;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Résoudre une équation",
    prompt: `Résous : \\(x \\div ${a} = ${b}\\)`,
    answer: xSolution,
    steps: [
      { type: "regle", text: `Pour isoler x, on multiplie les deux côtés de l'égalité par ${a}.` },
      { type: "calcul", text: `x = ${b} \\times ${a} = ${xSolution}` },
    ],
  };
}

// NOTE (audit programme 2026) : un générateur "genResoudreEquationDeuxEtapes"
// (équations à deux étapes du type ax+b=c) a été retiré d'ici — le
// programme officiel de 5e limite explicitement la résolution d'équations
// aux types ax=c OU x+b=c (« Modéliser des problèmes... par des équations du
// type ax = c ou x + b = c »). Les équations à deux étapes (ax+b=c) sont un
// objectif explicite de Quatrième (voir genResoudreEquationAdditionSoustraction
// et genResoudreEquationMultiplicationDivision ci-dessus pour les deux types
// autorisés en 5e).

// ---------- 15. Vérifier si une solution proposée est correcte ----------
function genVerifierSiSolutionEquationQCM() {
  const a = randInt(2, 9);
  const xTrue = nonZero(-15, 15);
  const b = a * xTrue;
  const correct = Math.random() < 0.5;
  const propose = correct ? xTrue : xTrue + pick([1, -1, 2, -2]);
  const prenom = pick(prenoms);
  return {
    type: "qcm",
    chapter: "Calcul littéral — Résoudre une équation",
    prompt: `${prenom} a trouvé ${propose} comme solution de l'équation \\(${a}x = ${b}\\). A-t-il/elle raison ?`,
    answer: correct ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "calcul", text: `La solution de \\(${a}x = ${b}\\) est x = ${b} \\div ${a} = ${xTrue}.` }],
  };
}

// ---------- 16. Problème contextualisé (schéma en barres) ----------
function genEquationContexteSchemaBarres() {
  const parts = [randInt(1, 3), randInt(1, 3), randInt(1, 3)];
  const totalParts = parts.reduce((s, p) => s + p, 0);
  const prixUnitaire = randDecimal(2, 20, 2);
  const total = roundTo(totalParts * prixUnitaire, 2);
  const [p1, p2, p3] = shuffle(prenoms).slice(0, 3);
  const objet = pick(["carte cadeau", "boîte de chocolats", "plante en pot"]);
  return {
    type: "numeric",
    chapter: "Calcul littéral — Résoudre une équation",
    prompt: `Pour un cadeau, ${p1}, ${p2} et ${p3} achètent chacun une ou plusieurs ${objet}s de même valeur : ${p1} en achète ${parts[0]}, ${p2} en achète ${parts[1]} et ${p3} en achète ${parts[2]}. La valeur totale du cadeau est de ${fr(total)} €. Quelle est la valeur d'une ${objet}, en € ?`,
    answer: prixUnitaire,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `${totalParts} \\times \\text{valeur} = ${fr(total)}` },
      { type: "calcul", text: `\\text{valeur} = ${fr(total)} \\div ${totalParts} = ${fr(prixUnitaire)}` },
    ],
  };
}

// =========================== Série 7 : Culture — Al-Khwârizmî ===========================

// ---------- 17. Problème d'héritage (à la façon d'Al-Khwârizmî) ----------
function genProblemeHeritageAlKhwarizmi() {
  const base = randInt(50, 300);
  const total = 4 * base;
  const aMax = Math.max(10, Math.min(100, Math.floor(total / 2) - 1));
  const a = randInt(10, aMax);
  const nom = pick(personnages);
  return {
    type: "numeric",
    chapter: "Calcul littéral — Culture",
    prompt: `À sa mort, ${nom} laisse 3 fils et une fortune qui s'élève à ${total} pièces. Il fait à son deuxième fils une donation égale à la part du premier fils à laquelle il ajoute ${a} pièces. Au troisième fils, il fait une donation égale au double de la part du premier fils à laquelle il retire ${a} pièces. Quelle est la part du premier fils, en pièces ?`,
    answer: base,
    steps: [
      { type: "donnee", text: `Si x est la part du premier fils : x + (x + ${a}) + (2x - ${a}) = ${total}` },
      { type: "calcul", text: `4x = ${total}` },
      { type: "resultat", text: `x = ${base}` },
    ],
  };
}

const GENERATORS = [
  genTraduirePhraseEnExpressionQCM,
  genValeurExpressionLitteraleBasique,
  genPerimetreRectangleEnFonctionDeX,
  genProblemeAssembleeEffectifEnFonctionDeX,
  genTesterEgaliteQCM,
  genTrouverValeurXEgaliteVraieQCM,
  genDevelopperTrouverCoefficient,
  genFactoriserTrouverFacteurCommun,
  genTesterVraiFauxDeveloppementQCM,
  genAireRectangleFactoriseDeveloppe,
  genVerifierIdentiteAlgebriqueQCM,
  genResoudreEquationAdditionSoustraction,
  genResoudreEquationMultiplicationDivision,
  genVerifierSiSolutionEquationQCM,
  genEquationContexteSchemaBarres,
  genProblemeHeritageAlKhwarizmi,
];

const DIFFICULTY = {
  genValeurExpressionLitteraleBasique: "facile",
  genTesterEgaliteQCM: "facile",
  genResoudreEquationAdditionSoustraction: "facile",
  genResoudreEquationMultiplicationDivision: "facile",
  genVerifierSiSolutionEquationQCM: "facile",
  genTraduirePhraseEnExpressionQCM: "standard",
  genPerimetreRectangleEnFonctionDeX: "standard",
  genTrouverValeurXEgaliteVraieQCM: "standard",
  genDevelopperTrouverCoefficient: "standard",
  genFactoriserTrouverFacteurCommun: "standard",
  genTesterVraiFauxDeveloppementQCM: "standard",
  genAireRectangleFactoriseDeveloppe: "standard",
  genVerifierIdentiteAlgebriqueQCM: "standard",
  genEquationContexteSchemaBarres: "standard",
  genProblemeAssembleeEffectifEnFonctionDeX: "expert",
  genProblemeHeritageAlKhwarizmi: "expert",
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
    id: "calcul-litteral",
    title: "Calcul littéral",
    description: "Traduire en formule, tester une égalité, distributivité, résoudre une équation.",
    pourquoi: "Traduire une situation en formule et vérifier une égalité, c'est le tout premier pas vers l'algèbre : raisonner sans connaître tous les nombres à l'avance.",
    level: "cinquieme",
    free: false,
    order: 5,
    cours: {
      mindMap: {
        title: "Calcul littéral",
        branches: [
          {
            title: "Traduire en formule",
            items: [
              "Une lettre (x, n...) représente un nombre inconnu ou variable.",
              "« Le double d'un nombre » se traduit par \\(2 \\times n\\), « augmenté de 7 » par \\(n + 7\\).",
              "Pour calculer la valeur d'une expression, on remplace la lettre par le nombre donné.",
            ],
          },
          {
            title: "Tester une égalité",
            items: [
              "Pour vérifier si une valeur de x est solution, on la remplace dans les deux membres et on compare.",
              "Une identité vraie pour toute valeur de x reste vraie après avoir développé.",
            ],
          },
          {
            title: "Distributivité",
            items: [
              "Développer : \\(k(ax + b) = kax + kb\\).",
              "Factoriser, c'est l'opération inverse : retrouver le facteur commun.",
              "Piège classique : oublier de multiplier TOUS les termes de la parenthèse par k.",
            ],
            formula: "\\(k(ax + b) = kax + kb\\)",
          },
          {
            title: "Résoudre une équation",
            items: [
              "\\(x + a = b\\) : on isole x en soustrayant a des deux côtés.",
              "\\(ax = b\\) : on isole x en divisant les deux côtés par a.",
              "Ce qu'on fait à un membre de l'égalité, il faut le faire aussi à l'autre.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
