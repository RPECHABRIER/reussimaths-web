// ---------------------------------------------------------------------------
// Chapitre : Notion de fonction (3e) — sous abonnement.
//
// Correspond au chapitre 5 du manuel de 3e : vocabulaire et expression
// algébrique d'une fonction (calculer une image, trouver un antécédent en
// résolvant une équation, cas particulier d'une fonction constante),
// lectures d'images et d'antécédents dans un tableau de valeurs, la fonction
// puissance de 10, un programme de calcul défini comme une fonction, et
// l'égalité de deux fonctions (résoudre f(x) = g(x)).
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique. Les exercices de lecture
// graphique du manuel (tracer/lire une courbe) ne sont pas repris ici car ils
// nécessitent un support visuel ; ils sont remplacés par des lectures
// équivalentes dans un tableau de valeurs.
// Voir automatismes-troisieme.js (thème "notion-fonction-troisieme") pour
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

function randomDistinctInts(n, min, max) {
  const vals = new Set();
  while (vals.size < n) vals.add(randInt(min, max));
  return shuffle([...vals]);
}

// =========================== Vocabulaire, images, antécédents ===========================

// ---------- 1. Calculer l'image d'un nombre par une fonction affine ----------
function genImageFonctionLineaireNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const answer = a * x0 + b;
  return {
    type: "numeric",
    chapter: "Notion de fonction — Vocabulaire, image, antécédent",
    prompt: `On définit la fonction f par \\(f(x) = ${a}x ${sgn(b)} ${abs(b)}\\). Calcule \\(f(${x0})\\).`,
    answer,
    steps: [{ type: "calcul", text: `f(${x0}) = ${a} \\times ${x0} ${sgn(b)} ${abs(b)} = ${answer}` }],
  };
}

// ---------- 2. Calculer l'image d'un nombre par une fonction quadratique ----------
function genImageFonctionQuadratiqueNumeric() {
  const a = nonZero(-6, 6);
  const b = nonZero(-9, 9);
  const x0 = nonZero(-6, 6);
  const answer = a * x0 * x0 + b;
  return {
    type: "numeric",
    chapter: "Notion de fonction — Vocabulaire, image, antécédent",
    prompt: `On définit la fonction g par \\(g(x) = ${a}x^{2} ${sgn(b)} ${abs(b)}\\). Calcule \\(g(${x0})\\).`,
    answer,
    steps: [{ type: "calcul", text: `g(${x0}) = ${a} \\times \\left(${x0}\\right)^{2} ${sgn(b)} ${abs(b)} = ${a * x0 * x0} ${sgn(b)} ${abs(b)} = ${answer}` }],
  };
}

// ---------- 3. Calculer l'image d'un nombre par une fonction cubique ----------
function genImageFonctionCubiqueNumeric() {
  const a = nonZero(-3, 3);
  const b = nonZero(-9, 9);
  const x0 = nonZero(-4, 4);
  const answer = a * x0 ** 3 + b;
  return {
    type: "numeric",
    chapter: "Notion de fonction — Vocabulaire, image, antécédent",
    prompt: `On définit la fonction h par \\(h(x) = ${a}x^{3} ${sgn(b)} ${abs(b)}\\). Calcule \\(h(${x0})\\).`,
    answer,
    steps: [{ type: "calcul", text: `h(${x0}) = ${a} \\times \\left(${x0}\\right)^{3} ${sgn(b)} ${abs(b)} = ${a * x0 ** 3} ${sgn(b)} ${abs(b)} = ${answer}` }],
  };
}

// ---------- 4. Trouver un antécédent par une fonction affine ----------
function genAntecedentFonctionLineaireNumeric() {
  const a = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const target = a * x0 + b;
  return {
    type: "numeric",
    chapter: "Notion de fonction — Vocabulaire, image, antécédent",
    prompt: `On définit la fonction f par \\(f(x) = ${a}x ${sgn(b)} ${abs(b)}\\). Trouve un antécédent de ${target} par f.`,
    answer: x0,
    steps: [
      { type: "donnee", text: `${a}x ${sgn(b)} ${abs(b)} = ${target}` },
      { type: "calcul", text: `${a}x = ${target - b}` },
      { type: "resultat", text: `x = \\dfrac{${target - b}}{${a}} = ${x0}` },
    ],
  };
}

// ---------- 5. Trouver l'antécédent positif par une fonction quadratique ----------
function genAntecedentFonctionQuadratiqueNumeric() {
  const r = randInt(2, 12);
  const b = nonZero(-9, 9);
  const target = r * r + b;
  return {
    type: "numeric",
    chapter: "Notion de fonction — Vocabulaire, image, antécédent",
    prompt: `On définit la fonction f par \\(f(x) = x^{2} ${sgn(b)} ${abs(b)}\\). Trouve l'antécédent positif de ${target} par f.`,
    answer: r,
    steps: [
      { type: "donnee", text: `x^{2} ${sgn(b)} ${abs(b)} = ${target}` },
      { type: "calcul", text: `x^{2} = ${target - b} = ${r * r}` },
      { type: "resultat", text: `x = ${r} \\text{ (solution positive)}` },
    ],
  };
}

// ---------- 6. Vocabulaire image / antécédent ----------
function genVocabulaireImageAntecedentQCM() {
  const fname = pick(["f", "g", "h"]);
  const x0 = nonZero(-9, 9);
  let y0;
  do {
    y0 = nonZero(-9, 9);
  } while (y0 === x0);
  const correct = `${y0} \\text{ est l'image de } ${x0} \\text{ par } ${fname}`;
  const wrong1 = `${x0} \\text{ est l'image de } ${y0} \\text{ par } ${fname}`;
  const wrong2 = `${y0} \\text{ est un antécédent de } ${x0} \\text{ par } ${fname}`;
  const options = shuffle([correct, wrong1, wrong2]);
  return {
    type: "qcm",
    chapter: "Notion de fonction — Vocabulaire, image, antécédent",
    prompt: `On sait que \\(${fname}(${x0}) = ${y0}\\). Quelle affirmation est correcte ?`,
    answer: correct,
    options,
    steps: [{ type: "regle", text: `${fname}(${x0}) = ${y0} \\text{ signifie que } ${y0} \\text{ est l'image de } ${x0} \\text{ par } ${fname}, \\text{ et que } ${x0} \\text{ est un antécédent de } ${y0} \\text{ par } ${fname}.` }],
  };
}

// =========================== Lecture dans un tableau de valeurs ===========================

// ---------- 7. Lire une image dans un tableau de valeurs ----------
function genLectureTableauImageNumeric() {
  const xs = [-2, -1, 0, 1, 2];
  const ys = randomDistinctInts(5, -9, 9);
  const idx = randInt(0, 4);
  const table = xs.map((x, i) => `f(${x}) = ${ys[i]}`).join(", ");
  return {
    type: "numeric",
    chapter: "Notion de fonction — Tableau de valeurs",
    prompt: `Voici les images de quelques nombres par une fonction f : ${table}. Quelle est l'image de ${xs[idx]} par f ?`,
    answer: ys[idx],
    steps: [{ type: "donnee", text: `f(${xs[idx]}) = ${ys[idx]}` }],
  };
}

// ---------- 8. Lire un antécédent dans un tableau de valeurs ----------
function genLectureTableauAntecedentNumeric() {
  const xs = [-2, -1, 0, 1, 2];
  const ys = randomDistinctInts(5, -9, 9);
  const idx = randInt(0, 4);
  const table = xs.map((x, i) => `f(${x}) = ${ys[i]}`).join(", ");
  return {
    type: "numeric",
    chapter: "Notion de fonction — Tableau de valeurs",
    prompt: `Voici les images de quelques nombres par une fonction f : ${table}. Quel est l'antécédent de ${ys[idx]} par f ?`,
    answer: xs[idx],
    steps: [{ type: "resultat", text: `f(${xs[idx]}) = ${ys[idx]}, \\text{ donc } ${xs[idx]} \\text{ est l'antécédent de } ${ys[idx]}.` }],
  };
}

// =========================== Cas particuliers ===========================

// ---------- 9. La fonction puissance de 10 ----------
function pow10Display(k) {
  if (k >= 0) return String(10 ** k);
  const zeros = -k - 1;
  return `0,${"0".repeat(zeros)}1`;
}
function genPuissanceDixAntecedentNumeric() {
  const k = randInt(-4, 6);
  return {
    type: "numeric",
    chapter: "Notion de fonction — Cas particuliers",
    prompt: `On définit la fonction m par \\(m(x) = 10^{x}\\). Quel est l'antécédent de ${pow10Display(k)} par m ?`,
    answer: k,
    steps: [
      {
        type: "regle",
        text:
          k >= 0
            ? `10^{n} \\text{ s'écrit 1 suivi de n zéros.}`
            : `10^{n} \\text{ avec n négatif s'écrit } 0,\\underbrace{0\\ldots0}_{(-n-1) \\text{ zéros}}1 \\text{ (le chiffre 1 est en } (-n)\\text{-ième position après la virgule).}`,
      },
      { type: "calcul", text: `10^{${k}} = ${pow10Display(k)}` },
    ],
  };
}

// ---------- 10. Nombre d'antécédents par une fonction constante ----------
function genFonctionConstanteAntecedentsQCM() {
  const k = nonZero(-9, 9);
  const askSameValue = Math.random() < 0.5;
  const target = askSameValue ? k : k + nonZero(1, 9);
  return {
    type: "qcm",
    chapter: "Notion de fonction — Cas particuliers",
    prompt: `On définit la fonction f par \\(f(x) = ${k}\\) pour tout nombre x. Combien le nombre ${target} a-t-il d'antécédents par f ?`,
    answer: askSameValue ? "Une infinité" : "0",
    options: ["0", "1", "Une infinité"],
    steps: [
      {
        type: "regle",
        text: askSameValue
          ? `f(x) \\text{ vaut toujours } ${k}, \\text{ donc tout nombre x est un antécédent de } ${k} : \\text{une infinité d'antécédents.}`
          : `f(x) \\text{ vaut toujours } ${k} \\text{ et jamais } ${target}, \\text{ donc } ${target} \\text{ n'a aucun antécédent par f.}`,
      },
    ],
  };
}

// =========================== Programmes de calcul et égalité de fonctions ===========================

// ---------- 11. Un programme de calcul définit une fonction : calculer une image ----------
function genProgrammeCalculExpressionFonctionNumeric() {
  const k = nonZero(-9, 9);
  const a = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const answer = k * (x0 + a);
  return {
    type: "numeric",
    chapter: "Notion de fonction — Programmes de calcul",
    prompt: `Un programme de calcul définit une fonction p : choisir un nombre x, lui ajouter ${a}, puis multiplier le résultat par ${k}. Calcule \\(p(${x0})\\).`,
    answer,
    steps: [{ type: "calcul", text: `p(${x0}) = ${k}\\left(${x0} ${sgn(a)} ${abs(a)}\\right) = ${k} \\times ${x0 + a} = ${answer}` }],
  };
}

// ---------- 12. Un programme de calcul définit une fonction : trouver un antécédent ----------
function genProgrammeCalculAntecedentNumeric() {
  const k = nonZero(-9, 9);
  const a = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const target = k * (x0 + a);
  return {
    type: "numeric",
    chapter: "Notion de fonction — Programmes de calcul",
    prompt: `Un programme de calcul définit une fonction p : choisir un nombre x, lui ajouter ${a}, puis multiplier le résultat par ${k}. Quel nombre de départ x donne \\(p(x) = ${target}\\) ?`,
    answer: x0,
    steps: [
      { type: "donnee", text: `${k}\\left(x ${sgn(a)} ${abs(a)}\\right) = ${target}` },
      { type: "calcul", text: `x ${sgn(a)} ${abs(a)} = \\dfrac{${target}}{${k}} = ${x0 + a}` },
      { type: "resultat", text: `x = ${x0}` },
    ],
  };
}

// ---------- 13. Égalité de deux fonctions : résoudre f(x) = g(x) ----------
function genEgaliteDeuxFonctionsNumeric() {
  const a = randInt(2, 9);
  const r = nonZero(-9, 9);
  const c = a - r;
  const diff = c - a; // = -r
  return {
    type: "numeric",
    chapter: "Notion de fonction — Égalité de deux fonctions",
    prompt: `On définit \\(f(x) = ${a}x\\) et \\(g(x) = x^{2} ${sgn(c)} ${abs(c)}x\\). Pour quelle valeur de x non nulle a-t-on \\(f(x) = g(x)\\) ?`,
    answer: r,
    steps: [
      { type: "donnee", text: `${a}x = x^{2} ${sgn(c)} ${abs(c)}x` },
      { type: "calcul", text: `0 = x^{2} ${sgn(diff)} ${abs(diff)}x` },
      { type: "calcul", text: `0 = x\\left(x ${sgn(diff)} ${abs(diff)}\\right)` },
      { type: "regle", text: `\\text{Un produit de deux facteurs est nul si (et seulement si) l'un au moins des facteurs est nul.}` },
      { type: "calcul", text: `x = 0 \\text{ ou } x ${sgn(diff)} ${abs(diff)} = 0 \\text{, donc } x = 0 \\text{ ou } x = ${r}` },
      { type: "resultat", text: `\\text{La valeur non nulle est } x = ${r}` },
    ],
  };
}

// ---------- 14. Vrai ou faux : vérifier une image annoncée ----------
function genVraiFauxImageQCM() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const trueVal = a * x0 + b;
  const isTrue = Math.random() < 0.5;
  const claimedVal = isTrue ? trueVal : trueVal + nonZero(1, 6);
  return {
    type: "qcm",
    chapter: "Notion de fonction — Vocabulaire, image, antécédent",
    prompt: `On définit \\(f(x) = ${a}x ${sgn(b)} ${abs(b)}\\). Est-il vrai que \\(f(${x0}) = ${claimedVal}\\) ?`,
    answer: isTrue ? "Vrai" : "Faux",
    options: ["Vrai", "Faux"],
    steps: [{ type: "calcul", text: `f(${x0}) = ${a} \\times ${x0} ${sgn(b)} ${abs(b)} = ${trueVal}` }],
  };
}

const GENERATORS = [
  genImageFonctionLineaireNumeric,
  genImageFonctionQuadratiqueNumeric,
  genImageFonctionCubiqueNumeric,
  genAntecedentFonctionLineaireNumeric,
  genAntecedentFonctionQuadratiqueNumeric,
  genVocabulaireImageAntecedentQCM,
  genLectureTableauImageNumeric,
  genLectureTableauAntecedentNumeric,
  genPuissanceDixAntecedentNumeric,
  genFonctionConstanteAntecedentsQCM,
  genProgrammeCalculExpressionFonctionNumeric,
  genProgrammeCalculAntecedentNumeric,
  genEgaliteDeuxFonctionsNumeric,
  genVraiFauxImageQCM,
];

const DIFFICULTY = {
  genImageFonctionLineaireNumeric: "facile",
  genVocabulaireImageAntecedentQCM: "facile",
  genLectureTableauImageNumeric: "facile",
  genLectureTableauAntecedentNumeric: "facile",
  genImageFonctionQuadratiqueNumeric: "standard",
  genImageFonctionCubiqueNumeric: "standard",
  genAntecedentFonctionLineaireNumeric: "standard",
  genPuissanceDixAntecedentNumeric: "standard",
  genFonctionConstanteAntecedentsQCM: "standard",
  genProgrammeCalculExpressionFonctionNumeric: "standard",
  genVraiFauxImageQCM: "standard",
  genAntecedentFonctionQuadratiqueNumeric: "expert",
  genProgrammeCalculAntecedentNumeric: "expert",
  genEgaliteDeuxFonctionsNumeric: "expert",
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
    id: "notion-fonction-troisieme",
    title: "Notion de fonction",
    description: "Vocabulaire (image, antécédent), calculer une image ou trouver un antécédent par une fonction, lecture dans un tableau de valeurs, cas particuliers, programmes de calcul et égalité de deux fonctions.",
    pourquoi: "Trouver une image ou un antécédent, c'est apprendre à lire n'importe quel graphique scientifique du quotidien.",
    level: "troisieme",
    free: false,
    order: 6,
    cours: {
      mindMap: {
        title: "Notion de fonction",
        branches: [
          {
            title: "Image, antécédent",
            items: [
              "\\(f(x) = y\\) se lit « y est l'image de x par f » et « x est un antécédent de y par f ».",
              "Pour calculer une image, on remplace x par sa valeur. Pour trouver un antécédent, on résout une équation.",
            ],
          },
          {
            title: "Tableau de valeurs",
            items: [
              "Dans un tableau f(x) = ..., on lit l'image en partant de x, l'antécédent en partant du résultat.",
              "Piège classique : un même nombre peut avoir plusieurs antécédents, mais une seule image.",
            ],
          },
          {
            title: "Cas particuliers",
            items: [
              "Une fonction constante donne toujours la même image : le nombre atteint a une infinité d'antécédents, tout autre nombre n'en a aucun.",
              "La fonction puissance de 10, \\(x \\mapsto 10^x\\), relie un exposant à son écriture décimale.",
            ],
          },
          {
            title: "Égalité de deux fonctions",
            items: [
              "Résoudre \\(f(x) = g(x)\\) revient à résoudre une équation (souvent une équation produit après réduction).",
              "Un programme de calcul décrit aussi une fonction : on la traduit en formule avant de calculer une image ou un antécédent.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
