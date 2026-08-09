// ---------------------------------------------------------------------------
// Chapitre : Notion de fonctions (4e) — sous abonnement.
//
// Correspond au chapitre 9 du sommaire officiel : calculer l'image ou
// l'antécédent d'un nombre par une fonction définie par une formule ou un
// tableau de valeurs, tester l'appartenance d'un point à la représentation
// graphique d'une fonction, reconnaître une situation de proportionnalité,
// problèmes contextualisés. Reprend la tâche intellectuelle des exercices
// fournis, avec des nombres, prénoms et contextes différents à chaque
// génération. Voir automatismes-quatrieme.js pour le thème "Calcul mental"
// associé.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

import { texTable } from "../utils/texTable.js";

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

// =========================== Fonction définie par une formule ===========================

// ---------- 1. Calculer l'image d'un nombre par une fonction affine ----------
function genImageParFormuleLineaireNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const x = nonZero(-12, 12);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Notion de fonctions — Image, antécédent",
    prompt: `Soit f une fonction qui, à chaque nombre x, associe le nombre \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Quel est le nombre associé à ${x} par f ?`,
    answer,
    steps: [{ type: "calcul", text: `${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}` }],
  };
}

// ---------- 2. Calculer l'image d'un nombre par une fonction du second degré ----------
function genImageParFormuleQuadratiqueNumeric() {
  const a = nonZero(-5, 5);
  const b = nonZero(-9, 9);
  const x = nonZero(-8, 8);
  const answer = a * x * x + b;
  return {
    type: "numeric",
    chapter: "Notion de fonctions — Image, antécédent",
    prompt: `Soit f une fonction qui, à chaque nombre x, associe le nombre \\(${a}x^{2} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Quel est le nombre associé à ${x} par f ?`,
    answer,
    steps: [{ type: "calcul", text: `${a} \\times ${x}^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}` }],
  };
}

// ---------- 3. Calculer l'antécédent d'un nombre par une fonction affine ----------
function genAntecedentParFormuleLineaireNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const xSol = nonZero(-15, 15);
  const y = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Notion de fonctions — Image, antécédent",
    prompt: `Soit f une fonction qui, à chaque nombre x, associe le nombre \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Quel nombre est associé à ${y} par f (autrement dit, quel est l'antécédent de ${y}) ?`,
    answer: xSol,
    steps: [
      { type: "donnee", text: `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${y}` },
      { type: "calcul", text: `${a}x = ${y - b}` },
      { type: "resultat", text: `x = ${y - b} \\div ${a} = ${xSol}` },
    ],
  };
}

// ---------- 4. Un point appartient-il à la représentation graphique ? ----------
function genAppartientCourbeQCM() {
  const a = nonZero(-6, 6);
  const b = nonZero(-9, 9);
  const x = nonZero(-10, 10);
  const yCorrect = a * x + b;
  const testBelongs = Math.random() < 0.5;
  const yTest = testBelongs ? yCorrect : yCorrect + nonZero(1, 5);
  return {
    type: "qcm",
    chapter: "Notion de fonctions — Image, antécédent",
    prompt: `Soit f une fonction qui, à chaque nombre x, associe le nombre \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Le point \\((${x} ; ${yTest})\\) appartient-il à la représentation graphique de f ?`,
    answer: testBelongs ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${yCorrect}` },
      {
        type: "resultat",
        text: testBelongs ? `${yTest} = ${yCorrect}, donc le point appartient à la courbe.` : `${yTest} \\neq ${yCorrect}, donc le point n'appartient pas à la courbe.`,
      },
    ],
  };
}

// ---------- 5. Piège de calcul (formule du second degré) ----------
function genErreurCalculImageQCM() {
  let x;
  do {
    x = nonZero(-10, 10);
  } while (x === 1);
  const correct = x * x - 1;
  const wrongOpposite = -(x * x) - 1;
  const wrongLinear = x - 1;
  const options = shuffle([...new Set([correct, wrongOpposite, wrongLinear])].map(String));
  return {
    type: "qcm",
    chapter: "Notion de fonctions — Image, antécédent",
    prompt: `Soit f la fonction qui, à chaque nombre x, associe le nombre \\(x^{2} - 1\\). Quel est le nombre associé à ${x} par f ?`,
    answer: String(correct),
    options: options.length >= 2 ? options : [String(correct), String(wrongLinear)],
    steps: [{ type: "calcul", text: `${x}^2 - 1 = ${correct}` }],
  };
}

// ---------- 6. Calculer l'image par une fonction du troisième degré (calculatrice) ----------
function genImageFormuleCubeNumeric() {
  const a = nonZero(-4, 4);
  const b = nonZero(-4, 4);
  const c = nonZero(-9, 9);
  const x = nonZero(-5, 5);
  const answer = a * x ** 3 + b * x * x + c;
  return {
    type: "numeric",
    chapter: "Notion de fonctions — Image, antécédent",
    prompt: `Soit k une fonction qui, à chaque nombre x, associe le nombre \\(${a}x^{3} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x^{2} ${c >= 0 ? "+" : "-"} ${Math.abs(c)}\\). À l'aide de la calculatrice, calcule le nombre associé à ${x} par k.`,
    answer,
    steps: [{ type: "calcul", text: `${a} \\times ${x}^3 ${b >= 0 ? "+" : "-"} ${Math.abs(b)} \\times ${x}^2 ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = ${answer}` }],
  };
}

// =========================== Fonction définie par un tableau de valeurs ===========================

// ---------- 7. Lire l'image d'un nombre dans un tableau ----------
function genFonctionDepuisTableauLireNumeric() {
  const xs = shuffle([-6, -4, -2, -1, 0, 1, 2, 3, 5, 8]).slice(0, 5).sort((a, b) => a - b);
  const ys = xs.map(() => randInt(-15, 15));
  const idx = randInt(0, xs.length - 1);
  return {
    type: "numeric",
    chapter: "Notion de fonctions — Tableau de valeurs",
    prompt: `Une fonction f est définie par le tableau de valeurs suivant : ${texTable([["x", ...xs], ["y (image de x)", ...ys]])} Quel est le nombre associé à ${xs[idx]} par f ?`,
    answer: ys[idx],
    steps: [{ type: "donnee", text: `D'après le tableau, à x = ${xs[idx]} on associe ${ys[idx]}.` }],
  };
}

// ---------- 8. Retrouver l'antécédent d'un nombre dans un tableau ----------
function genFonctionDepuisTableauAntecedentNumeric() {
  const xs = shuffle([-6, -4, -2, -1, 0, 1, 2, 3, 5, 8]).slice(0, 5).sort((a, b) => a - b);
  const usedYs = new Set();
  const ys = xs.map(() => {
    let v;
    do {
      v = randInt(-15, 15);
    } while (usedYs.has(v));
    usedYs.add(v);
    return v;
  });
  const idx = randInt(0, xs.length - 1);
  return {
    type: "numeric",
    chapter: "Notion de fonctions — Tableau de valeurs",
    prompt: `Une fonction f est définie par le tableau de valeurs suivant : ${texTable([["x", ...xs], ["y (image de x)", ...ys]])} Quel nombre a pour image ${ys[idx]} par f (antécédent de ${ys[idx]}) ?`,
    answer: xs[idx],
    steps: [{ type: "donnee", text: `D'après le tableau, ${ys[idx]} est associé à x = ${xs[idx]}.` }],
  };
}

// =========================== Proportionnalité et fonctions ===========================

// ---------- 9. Une fonction correspond-elle à une situation de proportionnalité ? ----------
function genProportionnaliteOuNonQCM() {
  const isProportional = Math.random() < 0.5;
  const k = randInt(2, 9);
  const xs = [randInt(1, 5), randInt(6, 10), randInt(11, 15)];
  const ys = isProportional ? xs.map((x) => x * k) : xs.map((x) => x * k + randInt(1, 5));
  return {
    type: "qcm",
    chapter: "Notion de fonctions — Proportionnalité",
    prompt: `Voici un tableau de valeurs : ${texTable([["x", ...xs], ["y (image de x)", ...ys]])} Cette fonction correspond-elle à une situation de proportionnalité ?`,
    answer: isProportional ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "calcul", text: `On vérifie si le quotient y/x est constant : ${xs.map((x, i) => fr(roundTo(ys[i] / x, 3))).join(", ")}.` }],
  };
}

// ---------- 10. Quelle expression correspond à la fonction ? ----------
function genQuelleFormuleCorrespondQCM() {
  const x = nonZero(-6, 6);
  const a1 = nonZero(-9, 9);
  const b1 = nonZero(-9, 9);
  const correctY = a1 * x + b1;
  const correctExpr = `${a1}x ${b1 >= 0 ? "+" : "-"} ${Math.abs(b1)}`;
  const wrong1Expr = `${a1 + 1}x ${b1 >= 0 ? "+" : "-"} ${Math.abs(b1)}`;
  const wrong2Expr = `${a1}x ${b1 >= 0 ? "-" : "+"} ${Math.abs(b1)}`;
  const wrong3Expr = `${-a1}x ${b1 >= 0 ? "+" : "-"} ${Math.abs(b1)}`;
  const options = shuffle([...new Set([correctExpr, wrong1Expr, wrong2Expr, wrong3Expr])]);
  return {
    type: "qcm",
    chapter: "Notion de fonctions — Problèmes",
    prompt: `Une fonction associe à ${x} le nombre ${correctY}. Laquelle de ces expressions peut correspondre à cette fonction ?`,
    answer: correctExpr,
    options: options.length >= 2 ? options : [correctExpr, wrong1Expr],
    steps: [{ type: "calcul", text: `${a1} \\times ${x} ${b1 >= 0 ? "+" : "-"} ${Math.abs(b1)} = ${correctY}` }],
  };
}

// =========================== Problèmes ===========================

// ---------- 11. Périmètre ou aire d'un rectangle (fonction contextualisée) ----------
function genPerimetreAireRectangleFonctionNumeric() {
  const decalage = randInt(2, 9);
  const askAire = Math.random() < 0.5;
  const x = randInt(1, 20);
  const answer = askAire ? x * (x + decalage) : 2 * x + 2 * (x + decalage);
  return {
    type: "numeric",
    chapter: "Notion de fonctions — Problèmes",
    prompt: `Un rectangle a pour largeur x et pour longueur \\(x + ${decalage}\\). On définit une fonction qui, à x, associe ${askAire ? "l'aire" : "le périmètre"} du rectangle. Quelle est l'image de ${x} par cette fonction ?`,
    answer,
    steps: askAire
      ? [
          { type: "regle", text: `Aire d'un rectangle = longueur × largeur.` },
          { type: "calcul", text: `${x} \\times (${x} + ${decalage}) = ${answer}` },
        ]
      : [
          { type: "regle", text: `Périmètre d'un rectangle = 2 × longueur + 2 × largeur.` },
          { type: "calcul", text: `2 \\times ${x} + 2 \\times (${x} + ${decalage}) = ${answer}` },
        ],
  };
}

// ---------- 12. Prix avec réduction au-delà d'un seuil (fonction contextualisée) ----------
function genFonctionPourcentageReductionNumeric() {
  const prixUnitaire = randInt(5, 15);
  const seuil = randInt(4, 8);
  const reduction = pick([10, 15, 20, 25]);
  const nbBoites = randInt(seuil + 1, seuil + 6);
  const prixSansReduction = prixUnitaire * nbBoites;
  const prixAvecReduction = roundTo(prixSansReduction * (1 - reduction / 100), 2);
  return {
    type: "numeric",
    chapter: "Notion de fonctions — Problèmes",
    prompt: `Dans un magasin, chaque boîte de macarons coûte ${prixUnitaire} €. À partir de ${seuil + 1} boîtes, on bénéficie de ${reduction} % de réduction sur l'ensemble des boîtes achetées. Quel est le prix payé pour ${nbBoites} boîtes ?`,
    answer: prixAvecReduction,
    tolerance: 0.01,
    steps: [
      { type: "calcul", text: `${prixUnitaire} \\times ${nbBoites} = ${prixSansReduction}` },
      { type: "resultat", text: `${prixSansReduction} \\times (1 - ${reduction}/100) = ${fr(prixAvecReduction)}` },
    ],
  };
}

const GENERATORS = [
  genImageParFormuleLineaireNumeric,
  genImageParFormuleQuadratiqueNumeric,
  genAntecedentParFormuleLineaireNumeric,
  genAppartientCourbeQCM,
  genErreurCalculImageQCM,
  genImageFormuleCubeNumeric,
  genFonctionDepuisTableauLireNumeric,
  genFonctionDepuisTableauAntecedentNumeric,
  genProportionnaliteOuNonQCM,
  genQuelleFormuleCorrespondQCM,
  genPerimetreAireRectangleFonctionNumeric,
  genFonctionPourcentageReductionNumeric,
];

const DIFFICULTY = {
  genImageParFormuleLineaireNumeric: "facile",
  genFonctionDepuisTableauLireNumeric: "facile",
  genImageParFormuleQuadratiqueNumeric: "standard",
  genAntecedentParFormuleLineaireNumeric: "standard",
  genAppartientCourbeQCM: "standard",
  genImageFormuleCubeNumeric: "standard",
  genFonctionDepuisTableauAntecedentNumeric: "standard",
  genProportionnaliteOuNonQCM: "standard",
  genPerimetreAireRectangleFonctionNumeric: "standard",
  genErreurCalculImageQCM: "expert",
  genQuelleFormuleCorrespondQCM: "expert",
  genFonctionPourcentageReductionNumeric: "expert",
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
    id: "notion-fonctions",
    title: "Notion de fonctions",
    description: "Calculer une image ou un antécédent par une fonction définie par une formule ou un tableau, tester l'appartenance à une courbe, reconnaître une situation de proportionnalité.",
    pourquoi: "Calculer une image ou un antécédent, c'est le premier pas pour lire et interpréter n'importe quel graphique.",
    level: "quatrieme",
    free: false,
    order: 10,
    cours: {
      mindMap: {
        title: "Notion de fonctions",
        branches: [
          {
            title: "Image et antécédent",
            items: [
              "L'image de x par f, c'est le nombre associé à x : on remplace x par sa valeur dans la formule.",
              "Un antécédent de y, c'est un nombre x dont l'image par f est y : on résout une équation pour le trouver.",
            ],
          },
          {
            title: "Fonction par tableau ou par courbe",
            items: [
              "Dans un tableau de valeurs, on lit directement l'image (ligne du bas) ou l'antécédent (ligne du haut).",
              "Un point \\((x ; y)\\) appartient à la courbe de f si et seulement si y est bien l'image de x par f.",
              "Piège classique : confondre image (on part de x) et antécédent (on part de y).",
            ],
          },
          {
            title: "Fonction et proportionnalité",
            items: [
              "Une fonction correspond à une situation de proportionnalité si le quotient \\(\\frac{y}{x}\\) reste constant pour toutes les valeurs.",
              "Si f associe à x le nombre \\(ax + b\\), la fonction n'est proportionnelle que si b = 0 (sinon le quotient y/x n'est pas constant).",
            ],
          },
        ],
      },
    },
  },
  generate,
};
