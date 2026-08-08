// ---------------------------------------------------------------------------
// Chapitre : Fonctions affines (3e) — sous abonnement.
//
// Correspond au chapitre 6 du manuel de 3e : identifier les coefficients a et
// b d'une fonction affine f(x) = ax + b (donnés directement, après réduction
// d'une écriture fractionnaire, après une double distributivité, ou après
// simplification d'une différence où le terme en x² s'annule), vérifier
// qu'un point appartient à une droite, comparer des coefficients directeurs,
// déterminer une fonction affine à partir de deux conditions, résoudre f(x) =
// cible pour trouver un antécédent, comparer deux tarifs (seuil d'égalité),
// classer une fonction (linéaire / affine / constante), et déterminer le
// sens de variation (croissante / décroissante) à partir du signe de a.
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique. Les exercices de tracé/lecture
// graphique du manuel ne sont pas repris ici car ils nécessitent un support
// visuel.
// Voir automatismes-troisieme.js (thème "fonctions-affines-troisieme") pour
// les mini-exercices "Calcul mental" associés.
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

// =========================== Identifier a et b ===========================

// ---------- 1. Identifier a et b dans f(x) = ax + b (forme directe) ----------
function genIdentifierABFormeSimpleNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const askA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Identifier a et b",
    prompt: `On définit \\(f(x) = ${a}x ${sgn(b)} ${abs(b)}\\), une fonction affine de la forme \\(f(x) = ax + b\\). Quelle est ${askA ? "la valeur de a" : "la valeur de b"} ?`,
    answer: askA ? a : b,
    steps: [{ type: "donnee", text: `f(x) = ax + b \\text{ avec } a = ${a} \\text{ et } b = ${b}` }],
  };
}

// ---------- 2. Mettre une écriture fractionnaire sous la forme ax + b ----------
function genMettreSousFormeFractionNumeric() {
  const d = pick([2, 3, 4, 5, 6]);
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const p = a * d;
  const q = b * d;
  const askA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Identifier a et b",
    prompt: `On écrit \\(f(x) = \\dfrac{${p}x ${sgn(q)} ${abs(q)}}{${d}}\\) sous la forme \\(f(x) = ax + b\\). Quelle est ${askA ? "la valeur de a" : "la valeur de b"} ?`,
    answer: askA ? a : b,
    steps: [{ type: "calcul", text: `f(x) = \\dfrac{${p}}{${d}}x ${sgn(q)} \\dfrac{${abs(q)}}{${d}} = ${a}x ${sgn(b)} ${abs(b)}` }],
  };
}

// ---------- 3. Mettre une double distributivité sous la forme ax + b ----------
function genMettreSousFormeDoubleDistributiviteNumeric() {
  const k = nonZero(-9, 9);
  const p = nonZero(-9, 9);
  const q = nonZero(-9, 9);
  const a = k;
  const b = k * p + q;
  const askA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Identifier a et b",
    prompt: `On écrit \\(h(x) = ${k}\\left(x ${sgn(p)} ${abs(p)}\\right) ${sgn(q)} ${abs(q)}\\) sous la forme \\(h(x) = ax + b\\). Quelle est ${askA ? "la valeur de a" : "la valeur de b"} ?`,
    answer: askA ? a : b,
    steps: [{ type: "calcul", text: `h(x) = ${k}x ${sgn(k * p)} ${abs(k * p)} ${sgn(q)} ${abs(q)} = ${a}x ${sgn(b)} ${abs(b)}` }],
  };
}

// ---------- 4. Mettre (x+p)(x+q) - x² sous la forme ax + b (le terme en x² s'annule) ----------
function genMettreSousFormeDifferenceCarresNumeric() {
  const p = nonZero(-9, 9);
  const q = nonZero(-9, 9);
  const a = p + q;
  const b = p * q;
  const askA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Identifier a et b",
    prompt: `On écrit \\(k(x) = \\left(x ${sgn(p)} ${abs(p)}\\right)\\left(x ${sgn(q)} ${abs(q)}\\right) - x^{2}\\) sous la forme \\(k(x) = ax + b\\). Quelle est ${askA ? "la valeur de a" : "la valeur de b"} ?`,
    answer: askA ? a : b,
    steps: [
      { type: "calcul", text: `\\left(x ${sgn(p)} ${abs(p)}\\right)\\left(x ${sgn(q)} ${abs(q)}\\right) = x^{2} ${sgn(a)} ${abs(a)}x ${sgn(b)} ${abs(b)}` },
      { type: "resultat", text: `k(x) = x^{2} ${sgn(a)} ${abs(a)}x ${sgn(b)} ${abs(b)} - x^{2} = ${a}x ${sgn(b)} ${abs(b)}` },
    ],
  };
}

// =========================== Droites, coefficients, variations ===========================

// ---------- 5. Un point appartient-il à une droite ? ----------
function genPointAppartientDroiteQCM() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const trueY = a * x0 + b;
  const isOn = Math.random() < 0.5;
  const y0 = isOn ? trueY : trueY + nonZero(1, 6);
  return {
    type: "qcm",
    chapter: "Fonctions affines — Droites et coefficients",
    prompt: `La droite représentant \\(f(x) = ${a}x ${sgn(b)} ${abs(b)}\\) passe-t-elle par le point de coordonnées \\((${x0}\\,;\\,${y0})\\) ?`,
    answer: isOn ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "calcul", text: `f(${x0}) = ${a} \\times ${x0} ${sgn(b)} ${abs(b)} = ${trueY}` }],
  };
}

// ---------- 6. Comparer deux coefficients directeurs ----------
function genComparerCoefficientsDirecteursQCM() {
  const a1 = nonZero(-9, 9);
  let a2;
  do {
    a2 = nonZero(-9, 9);
  } while (a2 === a1);
  return {
    type: "qcm",
    chapter: "Fonctions affines — Droites et coefficients",
    prompt: `On considère deux fonctions affines f et g de coefficients directeurs respectifs ${a1} et ${a2}. Laquelle a le coefficient directeur le plus grand ?`,
    answer: a1 > a2 ? "f" : "g",
    options: ["f", "g"],
    steps: [{ type: "resultat", text: `${a1} ${a1 > a2 ? ">" : "<"} ${a2}` }],
  };
}

// ---------- 7. Sens de variation d'une fonction affine ----------
function genCroissanteDecroissanteQCM() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "qcm",
    chapter: "Fonctions affines — Droites et coefficients",
    prompt: `On définit \\(f(x) = ${a}x ${sgn(b)} ${abs(b)}\\). La fonction f est-elle croissante ou décroissante ?`,
    answer: a > 0 ? "Croissante" : "Décroissante",
    options: ["Croissante", "Décroissante"],
    steps: [{ type: "regle", text: `\\text{Le coefficient directeur } a = ${a} \\text{ est } ${a > 0 ? "positif" : "négatif"}, \\text{ donc f est } ${a > 0 ? "croissante" : "décroissante"}.` }],
  };
}

// ---------- 8. La droite passe-t-elle par l'origine ? ----------
function genPasseParOrigineQCM() {
  const a = nonZero(-9, 9);
  const isLinear = Math.random() < 0.5;
  const b = isLinear ? 0 : nonZero(1, 9) * pick([1, -1]);
  const exprB = b === 0 ? "" : ` ${sgn(b)} ${abs(b)}`;
  return {
    type: "qcm",
    chapter: "Fonctions affines — Droites et coefficients",
    prompt: `La droite représentant \\(f(x) = ${a}x${exprB}\\) passe-t-elle par l'origine du repère ?`,
    answer: isLinear ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      {
        type: "regle",
        text: isLinear ? `b = 0, \\text{ donc la droite passe par l'origine.}` : `b = ${b} \\neq 0, \\text{ donc la droite ne passe pas par l'origine.}`,
      },
    ],
  };
}

// ---------- 9. Classer une fonction : linéaire / affine / constante ----------
function genFonctionLineaireVsAffineQCM() {
  const kind = pick(["lineaire", "affine", "constante"]);
  const labels = {
    lineaire: "Une fonction linéaire",
    affine: "Une fonction affine (non linéaire)",
    constante: "Une fonction constante",
  };
  let expr;
  if (kind === "lineaire") {
    const a = nonZero(-9, 9);
    expr = `${a}x`;
  } else if (kind === "affine") {
    const a = nonZero(-9, 9);
    const b = nonZero(-9, 9);
    expr = `${a}x ${sgn(b)} ${abs(b)}`;
  } else {
    const b = nonZero(-9, 9);
    expr = `${b}`;
  }
  return {
    type: "qcm",
    chapter: "Fonctions affines — Droites et coefficients",
    prompt: `La fonction définie par \\(f(x) = ${expr}\\) est :`,
    answer: labels[kind],
    options: Object.values(labels),
    steps: [{ type: "resultat", text: `Il s'agit de ${labels[kind].toLowerCase()}.` }],
  };
}

// =========================== Déterminer et résoudre ===========================

// ---------- 10. Déterminer une fonction affine à partir de deux conditions ----------
function genDeterminerAffineDeuxConditionsNumeric() {
  const b = nonZero(-9, 9);
  const x1 = nonZero(-9, 9);
  const a = nonZero(-9, 9);
  const y1 = a * x1 + b;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Déterminer une fonction",
    prompt: `f est une fonction affine telle que \\(f(0) = ${b}\\) et \\(f(${x1}) = ${y1}\\). Quel est le coefficient a de f (avec \\(f(x) = ax + b\\)) ?`,
    answer: a,
    steps: [
      { type: "donnee", text: `f(0) = b, \\text{ donc } b = ${b}` },
      { type: "donnee", text: `f(${x1}) = a \\times ${x1} + ${b} = ${y1}` },
      { type: "calcul", text: `a \\times ${x1} = ${y1 - b}` },
      { type: "resultat", text: `a = \\dfrac{${y1 - b}}{${x1}} = ${a}` },
    ],
  };
}

// ---------- 11. Résoudre f(x) = cible pour trouver un antécédent ----------
function genResoudreFxEgaleCibleNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const target = a * x0 + b;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Déterminer une fonction",
    prompt: `On définit \\(f(x) = ${a}x ${sgn(b)} ${abs(b)}\\). Trouve l'antécédent de ${target} par f.`,
    answer: x0,
    steps: [
      { type: "donnee", text: `${a}x ${sgn(b)} ${abs(b)} = ${target}` },
      { type: "calcul", text: `${a}x = ${target - b}` },
      { type: "resultat", text: `x = \\dfrac{${target - b}}{${a}} = ${x0}` },
    ],
  };
}

// =========================== Problèmes de tarifs ===========================

// ---------- 12. Comparer deux tarifs : trouver le seuil d'égalité ----------
function genCompareDeuxTarifsSeuilNumeric() {
  let a1, a2, b1, b2, x0;
  do {
    x0 = randInt(2, 30);
    a1 = randInt(2, 9);
    a2 = randInt(2, 9);
    b1 = randInt(50, 900);
    b2 = a1 * x0 + b1 - a2 * x0;
  } while (a1 === a2 || b2 <= 0 || b2 === b1);
  return {
    type: "numeric",
    chapter: "Fonctions affines — Problèmes de tarifs",
    prompt: `Un tarif A coûte ${b1} € de forfait plus ${a1} € par unité : \\(f(x) = ${a1}x + ${b1}\\). Un tarif B coûte ${b2} € de forfait plus ${a2} € par unité : \\(g(x) = ${a2}x + ${b2}\\). À partir de combien d'unités les deux tarifs coûtent-ils le même prix ?`,
    answer: x0,
    steps: [
      { type: "donnee", text: `${a1}x + ${b1} = ${a2}x + ${b2}` },
      { type: "regle", text: `\\text{On regroupe les termes en x d'un côté et les nombres de l'autre, en soustrayant } ${a2}x \\text{ et } ${b1} \\text{ des deux côtés de l'égalité.}` },
      { type: "calcul", text: `${a1}x - ${a2}x = ${b2} - ${b1}` },
      { type: "calcul", text: `${a1 - a2}x = ${b2 - b1}` },
      { type: "resultat", text: `x = \\dfrac{${b2 - b1}}{${a1 - a2}} = ${x0}` },
    ],
  };
}

// ---------- 13. Calculer le prix total avec un tarif (forfait + unités) ----------
function genCalculerImageContexteTarifNumeric() {
  const a = randInt(2, 9);
  const b = randInt(10, 200);
  const x0 = randInt(5, 80);
  const answer = a * x0 + b;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Problèmes de tarifs",
    prompt: `Un forfait téléphonique coûte ${b} € par mois plus ${a} € par gigaoctet utilisé au-delà du forfait inclus : \\(p(x) = ${a}x + ${b}\\), où x est le nombre de gigaoctets supplémentaires. Calcule le prix total pour ${x0} gigaoctets supplémentaires.`,
    answer,
    steps: [{ type: "calcul", text: `p(${x0}) = ${a} \\times ${x0} + ${b} = ${answer}` }],
  };
}

// ---------- 14. Trouver le nombre d'unités permis par un budget ----------
function genResoudreAntecedentContexteTarifNumeric() {
  const a = randInt(2, 9);
  const b = randInt(10, 200);
  const x0 = randInt(5, 80);
  const target = a * x0 + b;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Problèmes de tarifs",
    prompt: `Un forfait coûte ${b} € plus ${a} € par unité supplémentaire : \\(p(x) = ${a}x + ${b}\\). Combien d'unités supplémentaires obtient-on avec un budget total de ${target} € ?`,
    answer: x0,
    steps: [
      { type: "donnee", text: `${a}x + ${b} = ${target}` },
      { type: "calcul", text: `${a}x = ${target - b}` },
      { type: "resultat", text: `x = \\dfrac{${target - b}}{${a}} = ${x0}` },
    ],
  };
}

const GENERATORS = [
  genIdentifierABFormeSimpleNumeric,
  genMettreSousFormeFractionNumeric,
  genMettreSousFormeDoubleDistributiviteNumeric,
  genMettreSousFormeDifferenceCarresNumeric,
  genPointAppartientDroiteQCM,
  genComparerCoefficientsDirecteursQCM,
  genCroissanteDecroissanteQCM,
  genPasseParOrigineQCM,
  genFonctionLineaireVsAffineQCM,
  genDeterminerAffineDeuxConditionsNumeric,
  genResoudreFxEgaleCibleNumeric,
  genCompareDeuxTarifsSeuilNumeric,
  genCalculerImageContexteTarifNumeric,
  genResoudreAntecedentContexteTarifNumeric,
];

const DIFFICULTY = {
  genIdentifierABFormeSimpleNumeric: "facile",
  genComparerCoefficientsDirecteursQCM: "facile",
  genCroissanteDecroissanteQCM: "facile",
  genPasseParOrigineQCM: "facile",
  genMettreSousFormeFractionNumeric: "standard",
  genMettreSousFormeDoubleDistributiviteNumeric: "standard",
  genPointAppartientDroiteQCM: "standard",
  genFonctionLineaireVsAffineQCM: "standard",
  genResoudreFxEgaleCibleNumeric: "standard",
  genCalculerImageContexteTarifNumeric: "standard",
  genResoudreAntecedentContexteTarifNumeric: "standard",
  genMettreSousFormeDifferenceCarresNumeric: "expert",
  genDeterminerAffineDeuxConditionsNumeric: "expert",
  genCompareDeuxTarifsSeuilNumeric: "expert",
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
    id: "fonctions-affines-troisieme",
    title: "Fonctions affines",
    description: "Identifier les coefficients a et b d'une fonction affine, vérifier qu'un point appartient à une droite, comparer des coefficients directeurs, déterminer une fonction affine, résoudre f(x) = cible, et comparer des tarifs.",
    pourquoi: "Identifier une fonction affine, c'est reconnaître immédiatement les situations qui évoluent à vitesse constante (tarifs, trajets, conversions).",
    level: "troisieme",
    free: false,
    order: 7,
    cours: {
      mindMap: {
        title: "Fonctions affines",
        branches: [
          {
            title: "Identifier a et b",
            items: [
              "Une fonction affine s'écrit \\(f(x) = ax + b\\) : a est le coefficient directeur, b l'ordonnée à l'origine.",
              "Il faut parfois réduire, développer ou simplifier une expression avant de lire a et b.",
            ],
            formula: "\\(f(x) = ax + b\\)",
          },
          {
            title: "Droites et coefficients",
            items: [
              "Le signe de a donne le sens de variation : a > 0, f est croissante ; a < 0, f est décroissante.",
              "La droite passe par l'origine si et seulement si b = 0 (fonction linéaire).",
              "Un point appartient à la droite si ses coordonnées vérifient \\(y = ax+b\\).",
            ],
          },
          {
            title: "Déterminer une fonction affine",
            items: [
              "Connaissant f(0), on obtient directement b ; avec une deuxième valeur, on en déduit a.",
              "Pour trouver un antécédent (résoudre f(x) = cible), on résout une équation du premier degré.",
            ],
          },
          {
            title: "Comparer deux tarifs",
            items: [
              "Chaque tarif (forfait + prix unitaire) se modélise par une fonction affine.",
              "Le seuil où deux tarifs coûtent le même prix s'obtient en résolvant f(x) = g(x).",
            ],
          },
        ],
      },
    },
  },
  generate,
};
