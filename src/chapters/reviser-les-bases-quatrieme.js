// ---------------------------------------------------------------------------
// Chapitre : Réviser les bases (4e) — gratuit, illimité.
//
// Équivalent, pour l'entrée en 4e, du chapitre "Réviser les bases" (5e) : un
// tour d'horizon des savoir-faire de 5e indispensables pour aborder les
// nouveaux chapitres de 4e (nombres relatifs simples, calcul littéral de
// base, priorités opératoires, fractions, puissances, aires usuelles,
// symétrie centrale, proportionnalité). Fichier indépendant (par convention,
// chaque chapitre a ses propres helpers, pas de mutualisation entre fichiers).
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

function buildRectangleFigure(L, l) {
  const scale = Math.min(9, 130 / Math.max(L, l));
  const A = { id: "A", x: 20, y: 20 };
  const B = { id: "B", x: 20 + L * scale, y: 20 };
  const C = { id: "C", x: 20 + L * scale, y: 20 + l * scale };
  const D = { id: "D", x: 20, y: 20 + l * scale };
  return {
    points: [A, B, C, D],
    segments: [
      { from: "A", to: "B", ticks: 1 },
      { from: "D", to: "C", ticks: 1 },
      { from: "A", to: "D", ticks: 2 },
      { from: "B", to: "C", ticks: 2 },
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

// =========================== Priorités opératoires ===========================

// ---------- 1. Calculer une expression avec priorités ----------
function genCalculerExpressionPriorites() {
  const a = randInt(2, 15);
  const b = randInt(2, 12);
  const c = randInt(2, 15);
  const op1 = pick(["+", "-"]);
  const result = op1 === "+" ? a + b * c : a - b * c;
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Priorités",
    prompt: `Calcule en respectant les priorités : \\(${a} ${op1} ${b} \\times ${c}\\)`,
    answer: result,
    steps: [
      { type: "calcul", text: `On calcule d'abord ${b} \\times ${c} = ${b * c}` },
      { type: "resultat", text: `Puis : ${a} ${op1} ${b * c} = ${result}` },
    ],
  };
}

// =========================== Nombres relatifs (5e) ===========================

// ---------- 2. Additionner deux relatifs simples ----------
function genAdditionnerRelatifsSimple() {
  const a = nonZero(-20, 20);
  const b = nonZero(-20, 20);
  const answer = a + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Nombres relatifs",
    prompt: `Calcule : \\(${signedTex(a)} ${signedTex(b)}\\)`,
    answer,
    steps: [{ type: "calcul", text: `${a} + (${b}) = ${answer}` }],
  };
}
function signedTex(n) {
  return `${n >= 0 ? "+" : ""}${frTex(n)}`;
}

// ---------- 3. Soustraire deux relatifs simples ----------
function genSoustraireRelatifsSimple() {
  const a = nonZero(-20, 20);
  const b = nonZero(-20, 20);
  const answer = a - b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Nombres relatifs",
    prompt: `Calcule : \\(${signedTex(a)} - (${signedTex(b)})\\)`,
    answer,
    steps: [{ type: "calcul", text: `${a} - (${b}) = ${a} + (${-b}) = ${answer}` }],
  };
}

// =========================== Fractions et puissances (5e) ===========================

// ---------- 4. Simplifier une fraction ----------
function genSimplifierFraction() {
  const g = pick([2, 3, 4, 5]);
  const a = nonZero(1, 8);
  const b = a + nonZero(1, 8);
  const num = a * g;
  const den = b * g;
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Fractions",
    prompt: `Simplifie la fraction \\(\\dfrac{${num}}{${den}}\\) le plus possible. Donne le ${askNum ? "numérateur" : "dénominateur"} de la fraction simplifiée.`,
    answer: askNum ? a : b,
    steps: [{ type: "calcul", text: `\\(\\dfrac{${num}}{${den}} = \\dfrac{${a}}{${b}}\\) (on divise haut et bas par ${g}).` }],
  };
}

// ---------- 5. Carré ou cube d'un nombre ----------
function genCarreOuCube() {
  const n = randInt(2, 12);
  const mode = pick(["carre", "cube"]);
  const answer = mode === "carre" ? n * n : n * n * n;
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Puissances",
    prompt: `Quel est le ${mode === "carre" ? "carré" : "cube"} de ${n} ?`,
    answer,
    steps: [{ type: "calcul", text: mode === "carre" ? `${n} \\times ${n} = ${answer}` : `${n} \\times ${n} \\times ${n} = ${answer}` }],
  };
}

// ---------- 6. Multiplier/diviser par 10, 100, 1000 ----------
function genMultDiviserPuissanceDix() {
  const n = randDecimal(0.01, 900, 2);
  const p = pick([10, 100, 1000]);
  const isMult = Math.random() < 0.5;
  const answer = roundTo(isMult ? n * p : n / p, 4);
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Puissances de dix",
    prompt: `Calcule : \\(${frTex(n)} ${isMult ? "\\times" : "\\div"} ${p}\\)`,
    answer,
    tolerance: 0.001,
    steps: [
      {
        type: "regle",
        text: `${isMult ? "Multiplier" : "Diviser"} par ${p} déplace la virgule de ${Math.log10(p)} rang(s) vers ${isMult ? "la droite" : "la gauche"}.`,
      },
    ],
  };
}

// =========================== Calcul littéral (5e) ===========================

// ---------- 7. Valeur d'une expression littérale ----------
function genValeurExpressionLitterale() {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const x = randInt(1, 10);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Calcul littéral",
    prompt: `Calcule la valeur de l'expression \\(${a}x + ${b}\\) pour \\(x = ${x}\\).`,
    answer,
    steps: [{ type: "calcul", text: `${a} \\times ${x} + ${b} = ${answer}` }],
  };
}

// ---------- 8. Tester une égalité (calcul littéral) ----------
function genTesterEgaliteQCM() {
  const a = randInt(2, 8);
  const x = randInt(1, 10);
  const correct = a * (x + 2);
  const propose = Math.random() < 0.5 ? correct : correct + nonZero(-4, 4);
  return {
    type: "qcm",
    chapter: "Réviser les bases (4e) — Calcul littéral",
    prompt: `Pour \\(x = ${x}\\), l'expression \\(${a} \\times (x + 2)\\) est-elle égale à ${propose} ?`,
    answer: propose === correct ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "calcul", text: `${a} \\times (${x} + 2) = ${a} \\times ${x + 2} = ${correct}` }],
  };
}

// =========================== Géométrie (5e) ===========================

// ---------- 9. Aire d'un rectangle ----------
function genAireRectangle() {
  const L = randInt(6, 15);
  const l = randInt(3, L - 1);
  const aire = L * l;
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Géométrie",
    prompt: `ABCD est un rectangle. Calcule son aire, en cm².`,
    figure: buildRectangleFigure(L, l),
    answer: aire,
    steps: [
      { type: "regle", text: `Aire d'un rectangle = longueur × largeur.` },
      { type: "calcul", text: `${L} \\times ${l} = ${aire}` },
    ],
  };
}

// ---------- 10. Aire d'un triangle ----------
function genAireTriangle() {
  const base = randInt(4, 20);
  const hauteur = randInt(3, 16);
  const answer = roundTo((base * hauteur) / 2, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Géométrie",
    prompt: `Un triangle a une base de ${base} cm et une hauteur relative à cette base de ${hauteur} cm. Quelle est son aire, en cm² ?`,
    answer,
    steps: [
      { type: "regle", text: `Aire d'un triangle = (base × hauteur) ÷ 2.` },
      { type: "calcul", text: `(${base} \\times ${hauteur}) \\div 2 = ${fr(answer)}` },
    ],
  };
}

// ---------- 11. Symétrie centrale : conservation des longueurs ----------
function genSymetrieCentraleDistance() {
  const oa = randDecimal(2, 15, 1);
  const askOM = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Géométrie",
    prompt: askOM
      ? `M est le symétrique de A par rapport au point O. Sachant que OA = ${fr(oa)} cm, quelle est la longueur OM, en cm ?`
      : `M est le symétrique de A par rapport au point O, avec OM = ${fr(oa)} cm. Quelle est la longueur OA, en cm ?`,
    answer: oa,
    tolerance: 0.01,
    steps: [{ type: "regle", text: `Le symétrique d'un point par rapport à un point O est à la même distance de O.` }],
  };
}

// ---------- 12. Angles opposés par le sommet ----------
function genAnglesOpposesParSommet() {
  const angle = randInt(10, 170);
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Géométrie",
    prompt: `Deux angles opposés par le sommet : l'un mesure ${angle}°. Quelle est la mesure de l'autre, en degrés ?`,
    answer: angle,
    steps: [{ type: "regle", text: `Deux angles opposés par le sommet ont la même mesure.` }],
  };
}

// =========================== Proportionnalité (5e) ===========================

// ---------- 13. Pourcentage d'une quantité ----------
function genPourcentageDuneQuantite() {
  const p = pick([10, 20, 25, 50, 75]);
  const total = randInt(20, 400);
  const answer = roundTo((p / 100) * total, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Proportionnalité",
    prompt: `Calcule ${p} % de ${total}.`,
    answer,
    tolerance: 0.02,
    steps: [
      { type: "regle", text: `Calculer ${p} % d'un nombre, c'est le multiplier par \\(\\dfrac{${p}}{100}\\).` },
      { type: "calcul", text: `${total} \\times \\dfrac{${p}}{100} = ${fr(answer)}` },
    ],
  };
}

// ---------- 14. Coefficient de proportionnalité ----------
function genCoefficientProportionnalite() {
  const k = randDecimal(0.5, 6, 2);
  const a = randInt(2, 15);
  const b = roundTo(a * k, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Proportionnalité",
    prompt: `Dans un tableau de proportionnalité, la valeur ${a} correspond à ${fr(b)}. Quel est le coefficient de proportionnalité ?`,
    answer: k,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `Coefficient = ${fr(b)} \\div ${a} = ${fr(k)}` }],
  };
}

// =========================== Fonctions (5e) ===========================

// ---------- 15. Évaluer une fonction affine ----------
function genEvaluerFonctionAffine() {
  const a = nonZero(-6, 6);
  const b = randInt(-8, 8);
  const x = randInt(-6, 6);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Fonctions",
    prompt: `On considère \\(f(x) = ${a}x ${b >= 0 ? "+" : ""} ${b}\\). Calcule \\(f(${x})\\).`,
    answer,
    steps: [{ type: "calcul", text: `${a} \\times ${x} ${b >= 0 ? "+" : ""} ${b} = ${answer}` }],
  };
}

// =========================== Statistiques (5e) ===========================

// ---------- 16. Calculer une moyenne simple ----------
function genCalculerMoyenneSimple() {
  const n = randInt(4, 6);
  const valeurs = Array.from({ length: n }, () => randInt(0, 20));
  const total = valeurs.reduce((s, v) => s + v, 0);
  const answer = roundTo(total / n, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (4e) — Statistiques",
    prompt: `Calcule la moyenne de la série statistique suivante (arrondie au centième si besoin) : ${valeurs.join(" ; ")}`,
    answer,
    tolerance: 0.02,
    steps: [
      { type: "regle", text: `Moyenne = (somme des valeurs) ÷ (nombre de valeurs).` },
      { type: "calcul", text: `(${valeurs.join(" + ")}) \\div ${n} \\approx ${fr(answer)}` },
    ],
  };
}

const GENERATORS = [
  genCalculerExpressionPriorites,
  genAdditionnerRelatifsSimple,
  genSoustraireRelatifsSimple,
  genSimplifierFraction,
  genCarreOuCube,
  genMultDiviserPuissanceDix,
  genValeurExpressionLitterale,
  genTesterEgaliteQCM,
  genAireRectangle,
  genAireTriangle,
  genSymetrieCentraleDistance,
  genAnglesOpposesParSommet,
  genPourcentageDuneQuantite,
  genCoefficientProportionnalite,
  genEvaluerFonctionAffine,
  genCalculerMoyenneSimple,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "reviser-les-bases-quatrieme",
    title: "Réviser les bases",
    description: "Nombres relatifs, fractions, puissances, calcul littéral, aires, symétrie centrale, angles, proportionnalité et fonctions de 5e — pour prendre un bon départ en 4e. Gratuit et illimité.",
    pourquoi: "Ce chapitre gratuit consolide les bases indispensables du niveau précédent, pour démarrer l'année sur des fondations solides plutôt que de découvrir des lacunes en cours de route.",
    level: "quatrieme",
    free: true,
    order: 0,
  },
  generate,
};
