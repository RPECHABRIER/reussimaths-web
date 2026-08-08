// ---------------------------------------------------------------------------
// Chapitre : Équations (3e) — sous abonnement.
//
// Correspond au chapitre 4 du manuel de 3e : résoudre une équation du premier
// degré (avec x d'un seul côté, des deux côtés, avec réduction ou
// développement préalable, avec des fractions de même dénominateur),
// résoudre une équation produit ou de la forme x² = a (et déterminer le
// nombre de solutions), programmes de calcul menant à une équation,
// reconnaître le type d'une équation, repérer une erreur de signe classique,
// et modéliser un problème concret par une équation.
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "equations-troisieme") pour les
// mini-exercices "Calcul mental" associés.
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

const sgn = (n) => (n >= 0 ? "+" : "-");
const abs = (n) => Math.abs(n);

// =========================== Résoudre une équation du premier degré ===========================

// ---------- 1. ax = b ----------
function genResoudreEquationAxNumeric() {
  const a = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const b = a * x0;
  return {
    type: "numeric",
    chapter: "Équations — Premier degré",
    prompt: `Résous l'équation \\(${a}x = ${b}\\).`,
    answer: x0,
    steps: [
      { type: "regle", text: `Pour isoler x, on divise les deux côtés de l'égalité par ${a}.` },
      { type: "resultat", text: `x = \\dfrac{${b}}{${a}} = ${x0}` },
    ],
  };
}

// ---------- 2. ax + b = c ----------
function genResoudreEquationAxPlusBNumeric() {
  const a = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = a * x0 + b;
  return {
    type: "numeric",
    chapter: "Équations — Premier degré",
    prompt: `Résous l'équation \\(${a}x ${sgn(b)} ${abs(b)} = ${c}\\).`,
    answer: x0,
    steps: [
      { type: "regle", text: `On isole d'abord le terme en x en ${b >= 0 ? "soustrayant" : "ajoutant"} ${abs(b)} des deux côtés, puis on divise par ${a}.` },
      { type: "calcul", text: `${a}x = ${c} ${sgn(-b)} ${abs(b)} = ${c - b}` },
      { type: "resultat", text: `x = \\dfrac{${c - b}}{${a}} = ${x0}` },
    ],
  };
}

// ---------- 3. ax + b = cx + d (x des deux côtés) ----------
function genResoudreEquationDeuxCotesNumeric() {
  const a = nonZero(-9, 9);
  let c;
  do {
    c = nonZero(-9, 9);
  } while (c === a);
  const x0 = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const d = a * x0 + b - c * x0;
  return {
    type: "numeric",
    chapter: "Équations — Premier degré",
    prompt: `Résous l'équation \\(${a}x ${sgn(b)} ${abs(b)} = ${c}x ${sgn(d)} ${abs(d)}\\).`,
    answer: x0,
    steps: [
      { type: "regle", text: `On regroupe les termes en x d'un côté et les termes constants de l'autre, en effectuant la même opération des deux côtés.` },
      { type: "calcul", text: `${a - c}x ${sgn(b)} ${abs(b)} = ${d}` },
      { type: "calcul", text: `${a - c}x = ${d - b}` },
      { type: "resultat", text: `x = \\dfrac{${d - b}}{${a - c}} = ${x0}` },
    ],
  };
}

// ---------- 4. Réduire chaque membre avant de résoudre ----------
function genResoudreEquationReductionPrealableNumeric() {
  const p1 = nonZero(-9, 9);
  const p2 = nonZero(-9, 9);
  let p3;
  do {
    p3 = nonZero(-9, 9);
  } while (p3 === p1 + p2);
  const q1 = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const q2 = q1 + (p1 + p2 - p3) * x0;
  return {
    type: "numeric",
    chapter: "Équations — Premier degré",
    prompt: `On réduit puis on résout : \\(${p1}x ${sgn(p2)} ${abs(p2)}x ${sgn(q1)} ${abs(q1)} = ${p3}x ${sgn(q2)} ${abs(q2)}\\).`,
    answer: x0,
    steps: [
      { type: "calcul", text: `${p1}x ${sgn(p2)} ${abs(p2)}x = ${p1 + p2}x` },
      { type: "calcul", text: `${p1 + p2}x ${sgn(q1)} ${abs(q1)} = ${p3}x ${sgn(q2)} ${abs(q2)}` },
      { type: "calcul", text: `${p1 + p2 - p3}x = ${q2 - q1}` },
      { type: "resultat", text: `x = \\dfrac{${q2 - q1}}{${p1 + p2 - p3}} = ${x0}` },
    ],
  };
}

// ---------- 5. Équation avec des fractions de même dénominateur ----------
function genResoudreEquationFractionsNumeric() {
  const d = pick([2, 3, 4, 5, 6]);
  const t = nonZero(-6, 6);
  const x0 = d * t;
  let m;
  do {
    m = nonZero(-5, 5);
  } while (m === 1);
  const c = nonZero(-9, 9);
  const f = t * (m - 1) - c;
  const cd = c * d;
  const fd = f * d;
  return {
    type: "numeric",
    chapter: "Équations — Premier degré",
    prompt: `Résous l'équation \\(\\dfrac{x}{${d}} ${sgn(c)} ${abs(c)} = \\dfrac{${m}x}{${d}} ${sgn(-f)} ${abs(f)}\\).`,
    answer: x0,
    steps: [
      { type: "regle", text: `\\text{On multiplie chaque membre par } ${d} : x ${sgn(cd)} ${abs(cd)} = ${m}x ${sgn(-fd)} ${abs(fd)}` },
      { type: "calcul", text: `${1 - m}x = ${-fd - cd}` },
      { type: "resultat", text: `x = \\dfrac{${-fd - cd}}{${1 - m}} = ${x0}` },
    ],
  };
}

// ---------- 6. Développer avant de résoudre : k1(x+p1) + k2(x+p2) = cible ----------
function genResoudreEquationDeveloppementPrealableNumeric() {
  const x0 = nonZero(-9, 9);
  let k1, k2;
  do {
    k1 = nonZero(-9, 9);
    k2 = nonZero(-9, 9);
  } while (k1 + k2 === 0);
  const p1 = nonZero(-9, 9);
  const p2 = nonZero(-9, 9);
  const constSum = k1 * p1 + k2 * p2;
  const target = (k1 + k2) * x0 + constSum;
  return {
    type: "numeric",
    chapter: "Équations — Premier degré",
    prompt: `Résous l'équation \\(${k1}\\left(x ${sgn(p1)} ${abs(p1)}\\right) + ${k2}\\left(x ${sgn(p2)} ${abs(p2)}\\right) = ${target}\\).`,
    answer: x0,
    steps: [
      { type: "calcul", text: `${k1}x ${sgn(k1 * p1)} ${abs(k1 * p1)} + ${k2}x ${sgn(k2 * p2)} ${abs(k2 * p2)} = ${target}` },
      { type: "calcul", text: `${k1 + k2}x ${sgn(constSum)} ${abs(constSum)} = ${target}` },
      { type: "calcul", text: `${k1 + k2}x = ${target - constSum}` },
      { type: "resultat", text: `x = \\dfrac{${target - constSum}}{${k1 + k2}} = ${x0}` },
    ],
  };
}

// =========================== Programmes de calcul ===========================

// ---------- 7. Deux programmes donnant le même résultat ----------
function genProgrammeMemeResultatNumeric() {
  const c = randInt(2, 9);
  let a, k;
  do {
    a = nonZero(-9, 9);
    k = nonZero(-6, 6);
  } while (a - k * c === 0);
  const d = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const b = k * (c * x0 + d) - a * x0;
  return {
    type: "numeric",
    chapter: "Équations — Programmes de calcul",
    prompt: `Un programme A : choisir un nombre x, le multiplier par ${a}, puis ajouter ${b}. Un programme B : choisir un nombre x, le multiplier par ${c}, ajouter ${d}, puis multiplier le résultat par ${k}. Pour quel nombre de départ x les deux programmes donnent-ils le même résultat ?`,
    answer: x0,
    steps: [
      { type: "donnee", text: `${a}x ${sgn(b)} ${abs(b)} = ${k}\\left(${c}x ${sgn(d)} ${abs(d)}\\right)` },
      { type: "calcul", text: `${a}x ${sgn(b)} ${abs(b)} = ${k * c}x ${sgn(k * d)} ${abs(k * d)}` },
      { type: "calcul", text: `${a - k * c}x = ${k * d - b}` },
      { type: "resultat", text: `x = \\dfrac{${k * d - b}}{${a - k * c}} = ${x0}` },
    ],
  };
}

// =========================== Équation produit / x² = a ===========================

// ---------- 8. Équation produit (ax+b)(cx+d) = 0 ----------
function genResoudreEquationProduitNulNumeric() {
  const a = randInt(2, 9);
  const r1 = nonZero(-9, 9);
  const b = -a * r1;
  const c = randInt(2, 9);
  let r2;
  do {
    r2 = nonZero(-9, 9);
  } while (r2 === r1);
  const d = -c * r2;
  const askFirst = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Équations — Produit nul, x² = a",
    prompt: `Résous l'équation produit \\(\\left(${a}x ${sgn(b)} ${abs(b)}\\right)\\left(${c}x ${sgn(d)} ${abs(d)}\\right) = 0\\). Donne la solution associée au facteur \\(${askFirst ? `${a}x ${sgn(b)} ${abs(b)}` : `${c}x ${sgn(d)} ${abs(d)}`}\\).`,
    answer: askFirst ? r1 : r2,
    steps: [
      { type: "regle", text: `\\text{Un produit de facteurs est nul si au moins l'un de ses facteurs est nul.}` },
      { type: "resultat", text: `${a}x ${sgn(b)} ${abs(b)} = 0 \\Rightarrow x = ${r1}` },
      { type: "resultat", text: `${c}x ${sgn(d)} ${abs(d)} = 0 \\Rightarrow x = ${r2}` },
    ],
  };
}

// ---------- 9. Nombre de solutions distinctes d'une équation produit ----------
function genCombienSolutionsProduitQCM() {
  const sameRoot = Math.random() < 0.35;
  const a = randInt(2, 9);
  const r1 = nonZero(-9, 9);
  const c = randInt(2, 9);
  let r2;
  if (sameRoot) {
    r2 = r1;
  } else {
    do {
      r2 = nonZero(-9, 9);
    } while (r2 === r1);
  }
  const b = -a * r1;
  const d = -c * r2;
  return {
    type: "qcm",
    chapter: "Équations — Produit nul, x² = a",
    prompt: `L'équation \\(\\left(${a}x ${sgn(b)} ${abs(b)}\\right)\\left(${c}x ${sgn(d)} ${abs(d)}\\right) = 0\\) admet combien de solutions distinctes ?`,
    answer: sameRoot ? "1" : "2",
    options: ["1", "2"],
    steps: [
      { type: "calcul", text: `${a}x ${sgn(b)} ${abs(b)} = 0 \\Rightarrow x = ${r1}` },
      { type: "calcul", text: `${c}x ${sgn(d)} ${abs(d)} = 0 \\Rightarrow x = ${r2}` },
      {
        type: "resultat",
        text: sameRoot
          ? `\\text{Les deux facteurs donnent la même solution : une seule solution distincte.}`
          : `\\text{Les deux facteurs donnent des solutions différentes : deux solutions distinctes.}`,
      },
    ],
  };
}

// ---------- 10. Résoudre x² = a (a > 0), donner la solution positive ----------
function genResoudreEquationCarreNumeric() {
  const r = randInt(2, 15);
  const a = r * r;
  return {
    type: "numeric",
    chapter: "Équations — Produit nul, x² = a",
    prompt: `Résous l'équation \\(x^{2} = ${a}\\). Donne la solution positive.`,
    answer: r,
    steps: [{ type: "resultat", text: `${a} > 0, \\text{ donc il y a deux solutions : } x = -\\sqrt{${a}} = -${r} \\text{ et } x = \\sqrt{${a}} = ${r}` }],
  };
}

// ---------- 11. Nombre de solutions de x² = a ----------
function genCombienSolutionsCarreQCM() {
  const kind = pick(["pos", "zero", "neg"]);
  const a = kind === "pos" ? randInt(1, 120) : kind === "zero" ? 0 : -randInt(1, 80);
  const answer = kind === "pos" ? "2" : kind === "zero" ? "1" : "0";
  const step =
    kind === "pos"
      ? `${a} > 0, \\text{ donc l'équation a deux solutions.}`
      : kind === "zero"
      ? `x^{2} = 0 \\text{ équivaut à } x = 0 : \\text{une seule solution.}`
      : `${a} < 0, \\text{ or un carré est toujours positif ou nul : aucune solution.}`;
  return {
    type: "qcm",
    chapter: "Équations — Produit nul, x² = a",
    prompt: `Combien de solutions a l'équation \\(x^{2} = ${a}\\) ?`,
    answer,
    options: ["0", "1", "2"],
    steps: [{ type: "resultat", text: step }],
  };
}

// ---------- 12. Repérer une erreur de signe dans une équation produit ----------
function genCorrigerErreurSigneEquationProduitQCM() {
  const a = randInt(2, 9);
  const r1 = nonZero(-9, 9);
  const b = -a * r1;
  let r2;
  do {
    r2 = nonZero(-9, 9);
  } while (r2 === r1);
  const e = -r2;
  const correct = `x = ${r1} \\text{ ou } x = ${r2}`;
  const wrong = `x = ${-r1} \\text{ ou } x = ${-r2}`;
  return {
    type: "qcm",
    chapter: "Équations — Produit nul, x² = a",
    prompt: `Un élève résout \\(\\left(${a}x ${sgn(b)} ${abs(b)}\\right)\\left(x ${sgn(e)} ${abs(e)}\\right) = 0\\) et commet des erreurs de signe. Quelles sont les solutions correctes ?`,
    answer: correct,
    options: [correct, wrong],
    steps: [
      { type: "calcul", text: `${a}x ${sgn(b)} ${abs(b)} = 0 \\Rightarrow x = ${r1}` },
      { type: "resultat", text: `x ${sgn(e)} ${abs(e)} = 0 \\Rightarrow x = ${r2}` },
    ],
  };
}

// ---------- 13. Reconnaître le type d'une équation ----------
function genReconnaitreTypeEquationQCM() {
  const kind = pick(["premier", "produit", "carre"]);
  const labels = {
    premier: "Une équation du premier degré",
    produit: "Une équation produit",
    carre: "Une équation de la forme x² = a",
  };
  let expr;
  if (kind === "premier") {
    const a = nonZero(-9, 9);
    const b = nonZero(-9, 9);
    const c = nonZero(-9, 9);
    expr = `${a}x ${sgn(b)} ${abs(b)} = ${c}`;
  } else if (kind === "produit") {
    const a = nonZero(-9, 9);
    const b = nonZero(-9, 9);
    const c = nonZero(-9, 9);
    const d = nonZero(-9, 9);
    expr = `\\left(${a}x ${sgn(b)} ${abs(b)}\\right)\\left(${c}x ${sgn(d)} ${abs(d)}\\right) = 0`;
  } else {
    const a = nonZero(-100, 100);
    expr = `x^{2} = ${a}`;
  }
  return {
    type: "qcm",
    chapter: "Équations — Produit nul, x² = a",
    prompt: `Quel type d'équation est \\(${expr}\\) ?`,
    answer: labels[kind],
    options: Object.values(labels),
    steps: [{ type: "resultat", text: `Il s'agit de ${labels[kind].toLowerCase()}.` }],
  };
}

// =========================== Modéliser un problème par une équation ===========================

// ---------- 14. Problème d'achat (prix inconnu) ----------
function genModeliserProblemeAchatNumeric() {
  const n1 = randInt(20, 40);
  let n2;
  do {
    n2 = randInt(5, 15);
  } while (n2 >= n1);
  let x0, R, M;
  do {
    x0 = randInt(3, 25);
    R = randInt(5, 80);
    M = (n1 - n2) * x0 - R;
  } while (M <= 0);
  return {
    type: "numeric",
    chapter: "Équations — Modéliser un problème",
    prompt: `Pour acheter ${n1} objets identiques, il manque ${M} € à Camille. Pour acheter seulement ${n2} de ces mêmes objets, il lui reste ${R} €. Quel est le prix x (en €) d'un objet ?`,
    answer: x0,
    steps: [
      { type: "donnee", text: `${n1}x - ${M} = ${n2}x + ${R}` },
      { type: "calcul", text: `${n1 - n2}x = ${R + M}` },
      { type: "resultat", text: `x = \\dfrac{${R + M}}{${n1 - n2}} = ${x0}` },
    ],
  };
}

// ---------- 15. Somme de trois nombres proportionnels à x ----------
function genModeliserProblemeSommeNumeric() {
  let k1, k2, k3;
  do {
    k1 = randInt(1, 5);
    k2 = randInt(1, 5);
    k3 = randInt(1, 5);
  } while (k1 === k2 || k2 === k3 || k1 === k3);
  const x0 = randInt(2, 20);
  const total = (k1 + k2 + k3) * x0;
  return {
    type: "numeric",
    chapter: "Équations — Modéliser un problème",
    prompt: `Trois nombres valent respectivement \\(${k1}x\\), \\(${k2}x\\) et \\(${k3}x\\). Leur somme vaut ${total}. Quelle est la valeur de x ?`,
    answer: x0,
    steps: [
      { type: "donnee", text: `${k1}x + ${k2}x + ${k3}x = ${total}` },
      { type: "calcul", text: `${k1 + k2 + k3}x = ${total}` },
      { type: "resultat", text: `x = \\dfrac{${total}}{${k1 + k2 + k3}} = ${x0}` },
    ],
  };
}

// ---------- 16. Aire d'un rectangle menant à une équation ----------
function genModeliserProblemeAireNumeric() {
  const L = randInt(2, 9);
  const a = randInt(1, 9);
  const x0 = randInt(2, 15);
  const aire = L * (a + x0);
  return {
    type: "numeric",
    chapter: "Équations — Modéliser un problème",
    prompt: `Un rectangle a pour largeur ${L} cm et pour longueur \\(${a} + x\\) cm (x en cm). Son aire vaut ${aire} cm². Quelle est la valeur de x ?`,
    answer: x0,
    steps: [
      { type: "donnee", text: `${L}\\left(${a} + x\\right) = ${aire}` },
      { type: "calcul", text: `${L * a} + ${L}x = ${aire}` },
      { type: "calcul", text: `${L}x = ${aire - L * a}` },
      { type: "resultat", text: `x = \\dfrac{${aire - L * a}}{${L}} = ${x0}` },
    ],
  };
}

const GENERATORS = [
  genResoudreEquationAxNumeric,
  genResoudreEquationAxPlusBNumeric,
  genResoudreEquationDeuxCotesNumeric,
  genResoudreEquationReductionPrealableNumeric,
  genResoudreEquationFractionsNumeric,
  genResoudreEquationDeveloppementPrealableNumeric,
  genProgrammeMemeResultatNumeric,
  genResoudreEquationProduitNulNumeric,
  genCombienSolutionsProduitQCM,
  genResoudreEquationCarreNumeric,
  genCombienSolutionsCarreQCM,
  genCorrigerErreurSigneEquationProduitQCM,
  genReconnaitreTypeEquationQCM,
  genModeliserProblemeAchatNumeric,
  genModeliserProblemeSommeNumeric,
  genModeliserProblemeAireNumeric,
];

const DIFFICULTY = {
  genResoudreEquationAxNumeric: "facile",
  genResoudreEquationAxPlusBNumeric: "facile",
  genReconnaitreTypeEquationQCM: "facile",
  genResoudreEquationDeuxCotesNumeric: "standard",
  genResoudreEquationReductionPrealableNumeric: "standard",
  genResoudreEquationDeveloppementPrealableNumeric: "standard",
  genResoudreEquationProduitNulNumeric: "standard",
  genCombienSolutionsProduitQCM: "standard",
  genResoudreEquationCarreNumeric: "standard",
  genCombienSolutionsCarreQCM: "standard",
  genResoudreEquationFractionsNumeric: "expert",
  genProgrammeMemeResultatNumeric: "expert",
  genCorrigerErreurSigneEquationProduitQCM: "expert",
  genModeliserProblemeAchatNumeric: "expert",
  genModeliserProblemeSommeNumeric: "expert",
  genModeliserProblemeAireNumeric: "expert",
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
    id: "equations-troisieme",
    title: "Équations",
    description: "Résoudre une équation du premier degré, une équation produit ou de la forme x² = a, reconnaître le type d'une équation, et modéliser un problème concret par une équation.",
    pourquoi: "Résoudre une équation, c'est trouver la valeur inconnue d'un problème concret — un raisonnement qui sert bien au-delà des mathématiques.",
    level: "troisieme",
    free: false,
    order: 5,
    cours: {
      mindMap: {
        title: "Équations",
        branches: [
          {
            title: "Équation du premier degré",
            items: [
              "On réduit et on développe chaque membre si nécessaire, puis on regroupe les x d'un côté et les nombres de l'autre.",
              "Avec des fractions de même dénominateur, on peut multiplier les deux membres par ce dénominateur pour s'en débarrasser.",
              "Piège classique : en multipliant par le dénominateur commun, il faut multiplier TOUS les termes de l'équation, pas seulement ceux qui sont des fractions.",
            ],
            formula: "\\(ax + b = cx + d \\Rightarrow (a-c)x = d - b\\)",
          },
          {
            title: "Équation produit",
            items: [
              "Un produit de facteurs est nul si et seulement si au moins un des facteurs est nul.",
              "On résout chaque facteur séparément : chacun donne une solution (parfois la même pour les deux).",
              "Piège classique : pour résoudre \\(ax+b=0\\), on obtient \\(x=-\\dfrac{b}{a}\\) — ne pas oublier le signe -.",
            ],
            formula: "\\((ax+b)(cx+d)=0 \\Leftrightarrow ax+b=0\\ \\text{ou}\\ cx+d=0\\)",
          },
          {
            title: "Équation x² = a",
            items: [
              "Si a > 0 : deux solutions, \\(\\sqrt{a}\\) et \\(-\\sqrt{a}\\). Si a = 0 : une seule solution, 0. Si a < 0 : aucune solution.",
              "Piège classique : oublier la solution négative quand a > 0 — un carré ne détermine pas le signe de x.",
            ],
          },
          {
            title: "Modéliser un problème, programmes de calcul",
            items: [
              "On choisit une inconnue x, on traduit chaque donnée de l'énoncé en expression littérale, puis on assemble une égalité.",
              "Pour comparer deux programmes de calcul, on traduit chacun en expression littérale, puis on cherche x pour lequel les deux expressions sont égales.",
              "On résout l'équation obtenue, puis on vérifie que la solution a bien un sens dans le contexte de l'énoncé.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
