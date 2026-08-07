// ---------------------------------------------------------------------------
// Chapitre : Puissances d'un nombre, carré et cube (5e) — sous abonnement.
//
// Correspond au chapitre 3 du sommaire officiel : utiliser la notion de
// puissance, enchaîner des calculs avec puissances. Reprend la tâche
// intellectuelle des exercices fournis, avec des nombres et contextes
// différents à chaque génération. Voir automatismes-cinquieme.js (thème
// "puissances") pour la Série 1 (Automatismes).
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function buildRectangleFigure(L, l) {
  const scale = Math.min(9, 130 / Math.max(L, l));
  const A = { id: "A", x: 20, y: 20 };
  const B = { id: "B", x: 20 + L * scale, y: 20 };
  const C = { id: "C", x: 20 + L * scale, y: 20 + l * scale };
  const D = { id: "D", x: 20, y: 20 + l * scale };
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
      { x: (A.x + B.x) / 2, y: A.y - 8, text: `${L} cm` },
      { x: A.x - 18, y: (A.y + D.y) / 2, text: `${l} cm` },
    ],
  };
}

// =========================== Utiliser la notion de puissance ===========================

// ---------- 1. Calculer un carré ou un cube ----------
function genCalculerCarreCube() {
  const n = randInt(2, 15);
  const mode = pick(["carre", "cube"]);
  const answer = mode === "carre" ? n * n : n * n * n;
  return {
    type: "numeric",
    chapter: "Puissances — Notion de puissance",
    prompt: `Calcule : \\(${n}^{${mode === "carre" ? 2 : 3}}\\)`,
    answer,
    steps: mode === "carre" ? [{ type: "calcul", text: `${n} \\times ${n} = ${answer}` }] : [{ type: "calcul", text: `${n} \\times ${n} \\times ${n} = ${answer}` }],
  };
}

// ---------- 2. Écriture en puissance (nombre de facteurs ou valeur) ----------
// NOTE (audit programme 2026) : exposant limité à 2 ou 3 — le programme
// officiel de 5e restreint explicitement les puissances au carré et au cube
// (« dans le cas du carré et du cube »). La notion générale de puissance
// d'exposant entier positif est un objectif de Quatrième.
function genEcriturePuissance() {
  const base = randInt(2, 9);
  const exposant = pick([2, 3]);
  const mode = pick(["compter", "valeur"]);
  if (mode === "compter") {
    const expr = Array.from({ length: exposant }, () => base).join(" \\times ");
    return {
      type: "numeric",
      chapter: "Puissances — Notion de puissance",
      prompt: `Dans l'écriture \\(${expr}\\), combien y a-t-il de facteurs ?`,
      answer: exposant,
      steps: [{ type: "regle", text: `Cette écriture correspond à ${base}^{${exposant}} : il y a ${exposant} facteurs égaux à ${base}.` }],
    };
  }
  const answer = base ** exposant;
  return {
    type: "numeric",
    chapter: "Puissances — Notion de puissance",
    prompt: `Calcule : \\(${base}^{${exposant}}\\)`,
    answer,
    steps: [{ type: "calcul", text: `${Array.from({ length: exposant }, () => base).join(" \\times ")} = ${answer}` }],
  };
}

// ---------- 3. Puissances de dix ----------
// NOTE (audit programme 2026) : n limité à 1, 2 ou 3 — le programme officiel
// de 5e ne cite explicitement que « le cube de 10 » (10³) ; les puissances
// de dix plus générales relèvent de la Quatrième.
function genPuissanceDeDixEcriture() {
  const n = pick([1, 2, 3]);
  const mode = pick(["valeur", "exposant"]);
  if (mode === "valeur") {
    return {
      type: "numeric",
      chapter: "Puissances — Notion de puissance",
      prompt: `Quelle est l'écriture décimale de \\(10^{${n}}\\) ?`,
      answer: 10 ** n,
      steps: [
        { type: "regle", text: `\\(10^{${n}}\\) s'écrit 1 suivi de ${n} zéro${n > 1 ? "s" : ""}.` },
        { type: "resultat", text: `10^{${n}} = ${10 ** n}` },
      ],
    };
  }
  const value = 10 ** n;
  return {
    type: "numeric",
    chapter: "Puissances — Notion de puissance",
    prompt: `Écris ${value} sous la forme \\(10^{?}\\). Quel est l'exposant ?`,
    answer: n,
    steps: [
      { type: "regle", text: `L'exposant correspond au nombre de zéros après le 1.` },
      { type: "resultat", text: `${value} = 10^{${n}}` },
    ],
  };
}

// ---------- 4. Aire d'un carré (figure) ----------
function genAireCarreCote() {
  const c = randInt(3, 15);
  const aire = c * c;
  return {
    type: "numeric",
    chapter: "Puissances — Notion de puissance",
    prompt: `ABCD est un carré de côté ${c} cm. Quelle est son aire, en cm² ?`,
    figure: buildRectangleFigure(c, c),
    answer: aire,
    steps: [
      { type: "regle", text: `Aire d'un carré = côté², c'est-à-dire côté × côté.` },
      { type: "calcul", text: `${c}^2 = ${aire}` },
    ],
  };
}

// ---------- 5. Volume d'un cube ----------
function genVolumeCubeArete() {
  const c = randInt(2, 10);
  const volume = c ** 3;
  return {
    type: "numeric",
    chapter: "Puissances — Notion de puissance",
    prompt: `Un cube a une arête de ${c} cm. Quel est son volume, en cm³ ?`,
    answer: volume,
    steps: [
      { type: "regle", text: `Volume d'un cube = arête³, c'est-à-dire arête × arête × arête.` },
      { type: "calcul", text: `${c}^3 = ${volume}` },
    ],
  };
}

// =========================== Enchaîner des calculs avec puissances ===========================

// ---------- 6. Calculer une expression avec puissances (priorités) ----------
function genCalculerExpressionPuissancesPriorites() {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = randInt(2, 9);
  const templates = [
    { expr: `${a} + ${b} \\times ${c}^2`, value: a + b * c * c, explain: `On calcule d'abord ${c}^2 = ${c * c}, puis ${b} \\times ${c * c} = ${b * c * c}, puis ${a} + ${b * c * c} = ${a + b * c * c}.` },
    { expr: `${a} \\times ${b}^2 + ${c}`, value: a * b * b + c, explain: `On calcule d'abord ${b}^2 = ${b * b}, puis ${a} \\times ${b * b} = ${a * b * b}, puis ${a * b * b} + ${c} = ${a * b * b + c}.` },
    { expr: `(${a} \\times ${b})^2 - ${c}`, value: (a * b) ** 2 - c, explain: `On calcule d'abord ${a} \\times ${b} = ${a * b}, puis ${a * b}^2 = ${(a * b) ** 2}, puis ${(a * b) ** 2} - ${c} = ${(a * b) ** 2 - c}.` },
    { expr: `${a}^2 + ${b} \\times ${c}`, value: a * a + b * c, explain: `On calcule d'abord ${a}^2 = ${a * a}, puis ${b} \\times ${c} = ${b * c}, puis ${a * a} + ${b * c} = ${a * a + b * c}.` },
  ];
  const t = pick(templates);
  return {
    type: "numeric",
    chapter: "Puissances — Enchaîner des calculs",
    prompt: `Calcule (en respectant les priorités) : \\(${t.expr}\\)`,
    answer: t.value,
    steps: [
      { type: "regle", text: `Les puissances se calculent avant les produits et les sommes, sauf indication contraire des parenthèses.` },
      { type: "calcul", text: t.explain },
    ],
  };
}

// ---------- 7. Valeur d'une expression littérale simple (avec puissance) ----------
function genValeurExpressionLitteraleSimplePuissance() {
  const a = randInt(2, 6);
  const b = randInt(1, 15);
  const puissance = pick([2, 3]);
  const x = randInt(0, 5);
  const signe = Math.random() < 0.5 ? "+" : "-";
  const valeurPuissance = x ** puissance;
  const answer = signe === "+" ? a * valeurPuissance + b : a * valeurPuissance - b;
  return {
    type: "numeric",
    chapter: "Puissances — Enchaîner des calculs",
    prompt: `On considère l'expression \\(A = ${a}x^{${puissance}} ${signe} ${b}\\). Calcule A lorsque \\(x = ${x}\\).`,
    answer,
    steps: [
      { type: "calcul", text: `${x}^{${puissance}} = ${valeurPuissance}` },
      { type: "calcul", text: `${a} \\times ${valeurPuissance} ${signe} ${b} = ${answer}` },
    ],
  };
}

const GENERATORS = [
  genCalculerCarreCube,
  genEcriturePuissance,
  genPuissanceDeDixEcriture,
  genAireCarreCote,
  genVolumeCubeArete,
  genCalculerExpressionPuissancesPriorites,
  genValeurExpressionLitteraleSimplePuissance,
];

const DIFFICULTY = {
  genCalculerCarreCube: "facile",
  genEcriturePuissance: "facile",
  genPuissanceDeDixEcriture: "facile",
  genAireCarreCote: "facile",
  genVolumeCubeArete: "facile",
  genCalculerExpressionPuissancesPriorites: "standard",
  genValeurExpressionLitteraleSimplePuissance: "standard",
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
    id: "puissances",
    title: "Puissances d'un nombre, carré et cube",
    description: "Notion de puissance, carré, cube, puissances de dix, calculs enchaînés avec puissances.",
    pourquoi: "Les puissances de 10 permettent d'écrire simplement des très grands ou très petits nombres, comme la distance Terre-Lune ou la taille d'une cellule.",
    level: "cinquieme",
    free: false,
    order: 4,
  },
  generate,
};
