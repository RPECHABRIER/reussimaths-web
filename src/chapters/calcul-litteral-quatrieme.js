// ---------------------------------------------------------------------------
// Chapitre : Calcul littéral (4e) — sous abonnement.
//
// Correspond au chapitre 5 du sommaire officiel : exprimer en fonction d'une
// variable, évaluer une expression littérale, programmes de calcul, réduire,
// développer (simple et double distributivité), factoriser. Reprend la tâche
// intellectuelle des exercices fournis, avec des nombres, prénoms et
// contextes différents à chaque génération. Voir automatismes-quatrieme.js
// pour le thème "Calcul mental" associé.
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

// =========================== Exprimer en fonction d'une variable, évaluer ===========================

// ---------- 1. Traduire une phrase par une expression littérale ----------
function genTraduireExpressionLitteraleQCM() {
  const items = [
    { phrase: "Le double d'un nombre", expr: "2x" },
    { phrase: "Le triple d'un nombre", expr: "3x" },
    { phrase: "Le carré d'un nombre", expr: "x^2" },
    { phrase: "La moitié d'un nombre", expr: "\\dfrac{x}{2}" },
    { phrase: "L'opposé d'un nombre", expr: "-x" },
    { phrase: "L'inverse d'un nombre", expr: "\\dfrac{1}{x}" },
    { phrase: "La somme d'un nombre et de 5", expr: "x + 5" },
    { phrase: "La différence d'un nombre et de 5", expr: "x - 5" },
  ];
  const target = pick(items);
  const distractors = shuffle(items.filter((i) => i.expr !== target.expr)).slice(0, 3).map((i) => i.expr);
  const options = shuffle([target.expr, ...distractors]);
  return {
    type: "qcm",
    chapter: "Calcul littéral — Exprimer, évaluer",
    prompt: `« ${target.phrase} », noté x, se traduit par l'expression littérale :`,
    answer: target.expr,
    options,
    steps: [{ type: "regle", text: `« ${target.phrase} » se traduit par \\(${target.expr}\\).` }],
  };
}

// ---------- 2. Évaluer une expression littérale du premier degré ----------
function genEvaluerExpressionLineaireNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const x = nonZero(-9, 9);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Exprimer, évaluer",
    prompt: `Évalue l'expression \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\) pour \\(x = ${x}\\).`,
    answer,
    steps: [{ type: "calcul", text: `${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}` }],
  };
}

// ---------- 3. Évaluer une expression littérale du second degré ----------
function genEvaluerExpressionQuadratiqueNumeric() {
  const a = nonZero(-5, 5);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const x = nonZero(-6, 6);
  const answer = a * x * x + b * x + c;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Exprimer, évaluer",
    prompt: `Évalue l'expression \\(${a}x^{2} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)}\\) pour \\(x = ${x}\\).`,
    answer,
    steps: [{ type: "calcul", text: `${a} \\times ${x}^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)} \\times ${x} ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = ${answer}` }],
  };
}

// ---------- 4. Traduire un programme de calcul par une expression ----------
function genProgrammeCalculLitteralQCM() {
  const m = nonZero(-9, 9);
  const p = nonZero(-9, 9);
  const correct = `x \\times ${m} ${p >= 0 ? "+" : "-"} ${Math.abs(p)}`;
  const wrong1 = `x + ${m} ${p >= 0 ? "+" : "-"} ${Math.abs(p)}`;
  const wrong2 = `x \\times ${m} ${p >= 0 ? "-" : "+"} ${Math.abs(p)}`;
  const wrong3 = `\\left(x ${p >= 0 ? "+" : "-"} ${Math.abs(p)}\\right) \\times ${m}`;
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])]);
  return {
    type: "qcm",
    chapter: "Calcul littéral — Exprimer, évaluer",
    prompt: `Un programme de calcul consiste à : choisir un nombre, le multiplier par ${m}, puis ajouter ${p}. Quelle expression littérale correspond à ce programme (nombre de départ noté x) ?`,
    answer: correct,
    options: options.length >= 2 ? options : [correct, wrong1],
    steps: [{ type: "regle", text: `On traduit chaque étape : \\(x \\times ${m} ${p >= 0 ? "+" : "-"} ${Math.abs(p)}\\).` }],
  };
}

// ---------- 5. Appliquer un programme de calcul à un nombre de départ ----------
function genProgrammeCalculEvaluerNumeric() {
  const m = nonZero(-9, 9);
  const p = nonZero(-9, 9);
  const depart = nonZero(-12, 12);
  const answer = depart * m + p;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Exprimer, évaluer",
    prompt: `Un programme de calcul consiste à : choisir un nombre, le multiplier par ${m}, puis ajouter ${p}. Quel résultat obtient-on si on choisit ${depart} comme nombre de départ ?`,
    answer,
    steps: [{ type: "calcul", text: `${depart} \\times ${m} ${p >= 0 ? "+" : "-"} ${Math.abs(p)} = ${answer}` }],
  };
}

// =========================== Réduire ===========================

// ---------- 6. Réduire une expression du premier degré (coefficient de x) ----------
function genReduireExpressionLineaireCoefficientNumeric() {
  const a = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const d = nonZero(-9, 9);
  const coefX = a + c;
  const constant = b + d;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Réduire",
    prompt: `On réduit l'expression \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} ${c >= 0 ? "+" : "-"} ${Math.abs(c)}x ${d >= 0 ? "+" : "-"} ${Math.abs(d)}\\). Quel est le coefficient de x dans la forme réduite ?`,
    answer: coefX,
    steps: [
      { type: "regle", text: `Pour réduire, on regroupe entre eux les termes en x, et entre eux les termes constants.` },
      { type: "resultat", text: `${a} + ${c} = ${coefX}\\ \\text{(coefficient de x)}` },
      { type: "calcul", text: `${b} + ${d} = ${constant}\\ \\text{(terme constant)}` },
    ],
  };
}

// ---------- 7. Réduire une expression du second degré (coefficient de x²) ----------
function genReduireExpressionQuadratiqueCoefficientNumeric() {
  const a = nonZero(-6, 6);
  const d = nonZero(-6, 6);
  const b = nonZero(-9, 9);
  const e = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const f = nonZero(-9, 9);
  const coefX2 = a + d;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Réduire",
    prompt: `On réduit l'expression \\(${a}x^{2} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} ${d >= 0 ? "+" : "-"} ${Math.abs(d)}x^{2} ${e >= 0 ? "+" : "-"} ${Math.abs(e)}x ${f >= 0 ? "+" : "-"} ${Math.abs(f)}\\). Quel est le coefficient de \\(x^2\\) dans la forme réduite ?`,
    answer: coefX2,
    steps: [
      { type: "regle", text: `Pour réduire, on regroupe entre eux les termes en \\(x^2\\), entre eux les termes en x, et entre eux les termes constants.` },
      { type: "calcul", text: `${a} + ${d} = ${coefX2}\\ \\text{(coefficient de } x^2\\text{)}` },
    ],
  };
}

// =========================== Développer ===========================

// ---------- 8. Développer avec la simple distributivité (terme constant) ----------
function genDevelopperSimpleDistributiviteConstanteNumeric() {
  const k = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const answer = k * b;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Développer",
    prompt: `On développe \\(${k}\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right) = ${k}x + ?\\). Quel est ce terme constant ?`,
    answer,
    steps: [
      { type: "regle", text: `Distributivité : \\(k(x + b) = k \\times x + k \\times b\\).` },
      { type: "calcul", text: `${k} \\times ${b} = ${answer}` },
    ],
  };
}

// ---------- 9. Développer un signe devant une parenthèse ----------
function genDevelopperSigneDevantParentheseQCM() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const isNeg = Math.random() < 0.5;
  const correct = isNeg ? `${-a}x ${-b >= 0 ? "+" : "-"} ${Math.abs(b)}` : `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;
  const wrong = isNeg ? `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}` : `${-a}x ${-b >= 0 ? "+" : "-"} ${Math.abs(b)}`;
  return {
    type: "qcm",
    chapter: "Calcul littéral — Développer",
    prompt: `Développe : \\(${isNeg ? "-" : "+"}\\left(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right)\\)`,
    answer: correct,
    options: [correct, wrong],
    steps: [
      {
        type: "regle",
        text: isNeg
          ? `Développer un signe - devant une parenthèse change les signes : ${correct}.`
          : `Développer un signe + devant une parenthèse laisse l'expression inchangée : ${correct}.`,
      },
    ],
  };
}

// ---------- 10. Développer une double distributivité (x+a)(x+b) ----------
function genDevelopperDoubleDistributiviteCoefficientNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const askCoefX = Math.random() < 0.5;
  const sumAB = a + b;
  const prodAB = a * b;
  const answer = askCoefX ? sumAB : prodAB;
  const prompt = askCoefX
    ? `On développe \\(\\left(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)}\\right)\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right) = x^{2} + ?x ${prodAB >= 0 ? "+" : "-"} ${Math.abs(prodAB)}\\). Quel est le coefficient de x ?`
    : `On développe \\(\\left(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)}\\right)\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right) = x^{2} ${sumAB >= 0 ? "+" : "-"} ${Math.abs(sumAB)}x + ?\\). Quel est ce terme constant ?`;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Développer",
    prompt,
    answer,
    steps: [
      { type: "regle", text: `Double distributivité : \\((x+a)(x+b) = x^2 + (a+b)x + a \\times b\\).` },
      { type: "calcul", text: `${a} + ${b} = ${a + b}\\ \\text{(coefficient de x)}` },
      { type: "calcul", text: `${a} \\times ${b} = ${a * b}\\ \\text{(terme constant)}` },
    ],
  };
}

// =========================== Factoriser ===========================

// ---------- 11. Factoriser en mettant un facteur commun en évidence ----------
function genFactoriserFacteurCommunNumeric() {
  const k = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Calcul littéral — Factoriser",
    prompt: `On factorise \\(${k}x ${k * b >= 0 ? "+" : "-"} ${Math.abs(k * b)} = ?\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right)\\). Quel est ce facteur commun ?`,
    answer: k,
    steps: [
      { type: "regle", text: `Factoriser, c'est l'opération inverse de développer : on met le facteur commun en évidence.` },
      { type: "calcul", text: `${k}x ${k * b >= 0 ? "+" : "-"} ${Math.abs(k * b)} = ${k}\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right)` },
    ],
  };
}

// ---------- 12. Factoriser avec une parenthèse en facteur commun ----------
function genFactoriserParentheseCommuneNumeric() {
  const a = nonZero(-9, 9);
  const p = nonZero(-9, 9);
  const q = nonZero(-9, 9);
  const answer = p + q;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Factoriser",
    prompt: `On factorise \\(\\left(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)}\\right) \\times ${p} + \\left(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)}\\right) \\times ${q} = \\left(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)}\\right)\\left(?\\right)\\). Que vaut ce facteur (somme entre parenthèses) ?`,
    answer,
    steps: [
      { type: "regle", text: `Les deux termes partagent le même facteur \\(\\left(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)}\\right)\\) : on le met en évidence, et on additionne les coefficients ${p} et ${q}.` },
      { type: "calcul", text: `${p} + ${q} = ${answer}` },
    ],
  };
}

// ---------- 13. Vérifier une proposition de factorisation ----------
function genVraiFauxFactorisationQCM() {
  const k = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const isCorrect = Math.random() < 0.5;
  const proposedB = isCorrect ? b : b + nonZero(1, 3);
  return {
    type: "qcm",
    chapter: "Calcul littéral — Factoriser",
    prompt: `L'expression \\(${k}x ${k * b >= 0 ? "+" : "-"} ${Math.abs(k * b)}\\) a-t-elle pour factorisation \\(${k}\\left(x ${proposedB >= 0 ? "+" : "-"} ${Math.abs(proposedB)}\\right)\\) ?`,
    answer: isCorrect ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "calcul", text: `${k}\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right) = ${k}x ${k * b >= 0 ? "+" : "-"} ${Math.abs(k * b)}` }],
  };
}

// =========================== Évaluer avec vigilance (pièges de signes) ===========================

// ---------- 14. Évaluer une expression du second degré (QCM, piège de signe) ----------
function genEvaluerExpressionSigneQCM() {
  const a = nonZero(-6, 6);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  let x;
  do {
    x = nonZero(-6, 6);
  } while (Math.abs(x) === 1);
  const correct = a * x * x + b * x + c;
  const wrongSignSquare = a * x + b * x + c;
  const wrongNegSquare = -a * x * x + b * x + c;
  const opts = new Set([correct, wrongSignSquare, wrongNegSquare]);
  let bump = 1;
  while (opts.size < 3) {
    opts.add(correct + bump * 3);
    bump++;
  }
  const options = shuffle([...opts].map(String));
  return {
    type: "qcm",
    chapter: "Calcul littéral — Exprimer, évaluer",
    prompt: `Lorsque \\(x = ${x}\\), l'expression \\(${a}x^{2} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)}\\) vaut :`,
    answer: String(correct),
    options,
    steps: [{ type: "calcul", text: `${a} \\times (${x})^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)} \\times ${x} ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = ${correct}` }],
  };
}

// =========================== Problèmes (périmètres, aires) ===========================

// ---------- 15. Périmètre d'un rectangle en fonction de x ----------
function genPerimetreRectangleLitteralNumeric() {
  const largeur = randInt(2, 9);
  const x = randInt(1, 20);
  const perimetre = 2 * x + 2 * largeur;
  return {
    type: "numeric",
    chapter: "Calcul littéral — Problèmes",
    prompt: `Un rectangle a pour longueur x cm et pour largeur ${largeur} cm. Exprime son périmètre en fonction de x, puis calcule sa valeur pour \\(x = ${x}\\) cm.`,
    answer: perimetre,
    steps: [
      { type: "regle", text: `\\text{Périmètre} = 2x + 2 \\times ${largeur} = 2x + ${2 * largeur}` },
      { type: "resultat", text: `2 \\times ${x} + ${2 * largeur} = ${perimetre}` },
    ],
  };
}

// ---------- 16. Aire d'un rectangle en fonction de x ----------
function genAireRectangleLitteralNumeric() {
  const a = randInt(1, 9);
  const x = randInt(1, 15);
  const aire = x * (x + a);
  return {
    type: "numeric",
    chapter: "Calcul littéral — Problèmes",
    prompt: `Un rectangle a pour longueur \\(x + ${a}\\) cm et pour largeur x cm. Exprime son aire en fonction de x, puis calcule sa valeur pour \\(x = ${x}\\) cm.`,
    answer: aire,
    steps: [
      { type: "regle", text: `\\text{Aire} = x(x + ${a}) = x^2 + ${a}x` },
      { type: "resultat", text: `${x}^2 + ${a} \\times ${x} = ${aire}` },
    ],
  };
}

const GENERATORS = [
  genTraduireExpressionLitteraleQCM,
  genEvaluerExpressionLineaireNumeric,
  genEvaluerExpressionQuadratiqueNumeric,
  genProgrammeCalculLitteralQCM,
  genProgrammeCalculEvaluerNumeric,
  genReduireExpressionLineaireCoefficientNumeric,
  genReduireExpressionQuadratiqueCoefficientNumeric,
  genDevelopperSimpleDistributiviteConstanteNumeric,
  genDevelopperSigneDevantParentheseQCM,
  genDevelopperDoubleDistributiviteCoefficientNumeric,
  genFactoriserFacteurCommunNumeric,
  genFactoriserParentheseCommuneNumeric,
  genVraiFauxFactorisationQCM,
  genEvaluerExpressionSigneQCM,
  genPerimetreRectangleLitteralNumeric,
  genAireRectangleLitteralNumeric,
];

const DIFFICULTY = {
  genEvaluerExpressionLineaireNumeric: "facile",
  genReduireExpressionLineaireCoefficientNumeric: "facile",
  genDevelopperSimpleDistributiviteConstanteNumeric: "facile",
  genEvaluerExpressionSigneQCM: "facile",
  genTraduireExpressionLitteraleQCM: "standard",
  genEvaluerExpressionQuadratiqueNumeric: "standard",
  genProgrammeCalculLitteralQCM: "standard",
  genProgrammeCalculEvaluerNumeric: "standard",
  genReduireExpressionQuadratiqueCoefficientNumeric: "standard",
  genDevelopperSigneDevantParentheseQCM: "standard",
  genFactoriserFacteurCommunNumeric: "standard",
  genFactoriserParentheseCommuneNumeric: "standard",
  genVraiFauxFactorisationQCM: "standard",
  genPerimetreRectangleLitteralNumeric: "standard",
  genAireRectangleLitteralNumeric: "standard",
  genDevelopperDoubleDistributiviteCoefficientNumeric: "expert",
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
    id: "calcul-litteral-quatrieme",
    title: "Calcul littéral",
    description: "Exprimer en fonction d'une variable, évaluer une expression, programmes de calcul, réduire, développer et factoriser des expressions littérales.",
    pourquoi: "Manipuler des expressions littérales, c'est apprendre à raisonner sur une situation générale plutôt que sur un seul exemple — la base de toute formule, en maths comme en sciences.",
    level: "quatrieme",
    free: false,
    order: 6,
    cours: {
      mindMap: {
        title: "Calcul littéral",
        branches: [
          {
            title: "Exprimer, évaluer",
            items: [
              "Une expression littérale traduit un énoncé ou un programme de calcul avec une lettre.",
              "Évaluer, c'est remplacer la lettre par sa valeur et calculer, en respectant les priorités opératoires.",
              "Piège classique : \\((-x)^2\\) et \\(-x^2\\) donnent des résultats différents pour une même valeur négative de x.",
            ],
          },
          {
            title: "Réduire",
            items: [
              "On regroupe entre eux les termes de même nature (les x² ensemble, les x ensemble, les constantes ensemble).",
              "Chaque terme garde le signe qui le précède quand on le déplace.",
            ],
          },
          {
            title: "Développer",
            items: [
              "Simple distributivité : on multiplie chaque terme de la parenthèse par le facteur extérieur.",
              "Double distributivité : chaque terme du premier facteur multiplie chaque terme du second.",
              "Piège classique : un « - » devant une parenthèse change le signe de TOUS les termes qu'elle contient.",
            ],
            formula: "\\(k(a+b) = ka+kb\\ ;\\ (x+a)(x+b) = x^2+(a+b)x+ab\\)",
          },
          {
            title: "Factoriser",
            items: [
              "Factoriser, c'est l'opération inverse de développer : on fait apparaître un facteur commun.",
              "On vérifie toujours une factorisation en la redéveloppant : on doit retrouver l'expression de départ.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
