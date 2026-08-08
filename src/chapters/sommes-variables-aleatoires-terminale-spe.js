// ---------------------------------------------------------------------------
// Chapitre : Sommes de variables aléatoires (Terminale Spé) — abonnement.
// Linéarité de l'espérance, variance d'une somme de variables indépendantes,
// somme de n variables i.i.d., comparaison de lois binomiales.
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

// ---------- 1. Espérance de pX+qY (numeric) ----------
function genEsperanceLineaireNumeric() {
  const EX = randInt(-9, 9);
  const EY = randInt(-9, 9);
  const p = nonZero(-6, 6);
  const q = nonZero(-6, 6);
  const answer = p * EX + q * EY;
  return {
    type: "numeric",
    chapter: "Sommes de variables aléatoires — Espérance",
    prompt: `On sait que \\(E(X) = ${EX}\\) et \\(E(Y) = ${EY}\\). Calcule \\(E(${p}X ${q >= 0 ? "+" : "-"} ${Math.abs(q)}Y)\\).`,
    answer,
    steps: [
      { type: "regle", text: "Linéarité de l'espérance : E(pX+qY) = pE(X) + qE(Y)." },
      { type: "resultat", text: `${p}E(X) + ${q}E(Y) = ${p} \\times ${EX} + ${q} \\times ${EY} = ${answer}` },
    ],
  };
}

// ---------- 2. Variance de pX+qY, indépendantes (numeric) ----------
function genVarianceSommeIndependanteNumeric() {
  const VX = randInt(1, 20);
  const VY = randInt(1, 20);
  const p = nonZero(-6, 6);
  const q = nonZero(-6, 6);
  const answer = p * p * VX + q * q * VY;
  return {
    type: "numeric",
    chapter: "Sommes de variables aléatoires — Variance",
    prompt: `X et Y sont deux variables aléatoires indépendantes avec \\(V(X) = ${VX}\\) et \\(V(Y) = ${VY}\\). Calcule \\(V(${p}X + ${q}Y)\\).`,
    answer,
    steps: [
      { type: "regle", text: "Pour X et Y indépendantes : V(pX+qY) = p²V(X) + q²V(Y)." },
      { type: "resultat", text: `V(${p}X+${q}Y) = ${p}^2V(X) + ${q}^2V(Y) = ${p * p} \\times ${VX} + ${q * q} \\times ${VY} = ${answer}` },
    ],
  };
}

// ---------- 3. Variance de pX-qY, indépendantes (numeric) ----------
function genVarianceDifferenceIndependanteNumeric() {
  const VX = randInt(1, 20);
  const VY = randInt(1, 20);
  const p = nonZero(-6, 6);
  const q = nonZero(1, 6);
  const answer = p * p * VX + q * q * VY;
  return {
    type: "numeric",
    chapter: "Sommes de variables aléatoires — Variance",
    prompt: `X et Y sont deux variables aléatoires indépendantes avec \\(V(X) = ${VX}\\) et \\(V(Y) = ${VY}\\). Calcule \\(V(${p}X - ${q}Y)\\).`,
    answer,
    steps: [
      { type: "regle", text: "Attention : même pour une différence, la variance s'ajoute (car V(-qY) = q²V(Y) ≥ 0) : V(pX-qY) = p²V(X) + q²V(Y)." },
      { type: "resultat", text: `V(${p}X-${q}Y) = V(${p}X) + V(-${q}Y) = ${p}^2V(X) + ${q}^2V(Y) = ${p * p} \\times ${VX} + ${q * q} \\times ${VY} = ${answer}` },
    ],
  };
}

// ---------- 4. Espérance d'une somme de n variables i.i.d. (numeric) ----------
function genEsperanceSommeNIidNumeric() {
  const EX1 = randInt(-9, 9);
  const n = randInt(3, 30);
  return {
    type: "numeric",
    chapter: "Sommes de variables aléatoires — Somme de n variables",
    prompt: `\\(X_1, X_2, \\ldots, X_${n}\\) suivent toutes la même loi de probabilité, avec \\(E(X_1) = ${EX1}\\). Calcule \\(E(X_1+X_2+\\cdots+X_${n})\\).`,
    answer: n * EX1,
    steps: [
      { type: "regle", text: "Pour n variables suivant la même loi : E(X₁+⋯+Xₙ) = nE(X₁)." },
      { type: "resultat", text: `E(X_1+\\cdots+X_${n}) = ${n} \\times E(X_1) = ${n} \\times ${EX1} = ${n * EX1}` },
    ],
  };
}

// ---------- 5. Variance d'une somme de n variables i.i.d. indépendantes (numeric) ----------
function genVarianceSommeNIidNumeric() {
  const VX1 = randInt(1, 15);
  const n = randInt(3, 30);
  return {
    type: "numeric",
    chapter: "Sommes de variables aléatoires — Somme de n variables",
    prompt: `\\(X_1, X_2, \\ldots, X_${n}\\) sont indépendantes et suivent toutes la même loi de probabilité, avec \\(V(X_1) = ${VX1}\\). Calcule \\(V(X_1+X_2+\\cdots+X_${n})\\).`,
    answer: n * VX1,
    steps: [
      { type: "regle", text: "Pour n variables indépendantes suivant la même loi : V(X₁+⋯+Xₙ) = nV(X₁)." },
      { type: "resultat", text: `V(X_1+\\cdots+X_${n}) = ${n} \\times V(X_1) = ${n} \\times ${VX1} = ${n * VX1}` },
    ],
  };
}

// ---------- 6. Reconnaître la formule de V(aX+bY) (QCM) ----------
function genFormuleVarianceIndependanceQCM() {
  const a = nonZero(-6, 6);
  const b = nonZero(-6, 6);
  const correct = `${a}^2V(X) + ${b}^2V(Y)`;
  const options = shuffle([correct, `${a}V(X) + ${b}V(Y)`, `${a}^2V(X) - ${b}^2V(Y)`, `(${a}V(X) + ${b}V(Y))^2`]);
  return {
    type: "qcm",
    chapter: "Sommes de variables aléatoires — Variance",
    prompt: `X et Y sont deux variables aléatoires indépendantes. Quelle est l'expression de \\(V(${a}X+${b}Y)\\) ?`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: "Pour X et Y indépendantes : V(aX+bY) = a²V(X) + b²V(Y)." },
      { type: "resultat", text: `V(${a}X+${b}Y) = ${correct}` },
    ],
  };
}

// ---------- 7. Reconnaître la formule de E(aX+bY) (QCM) ----------
function genFormuleEsperanceQCM() {
  const a = nonZero(-6, 6);
  const b = nonZero(-6, 6);
  const correct = `${a}E(X) + ${b}E(Y)`;
  const options = shuffle([correct, `${a}E(X) - ${b}E(Y)`, `${a}E(X) \\times ${b}E(Y)`, `${a + b}E(X+Y)`]);
  return {
    type: "qcm",
    chapter: "Sommes de variables aléatoires — Espérance",
    prompt: `Quelle est l'expression de \\(E(${a}X+${b}Y)\\) (linéarité de l'espérance) ?`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: "Linéarité de l'espérance : E(aX+bY) = aE(X) + bE(Y)." },
      { type: "resultat", text: `E(${a}X+${b}Y) = ${correct}` },
    ],
  };
}

// ---------- 8. Vrai ou faux sur les sommes de variables aléatoires (QCM) ----------
function genVraiFauxSommesVariablesQCM() {
  const cas = pick([
    { description: "Si X et Y sont indépendantes, \\(V(X-Y) = V(X) - V(Y)\\).", reponse: "Faux", explication: "C'est faux : même pour une différence, les variances s'additionnent : V(X-Y) = V(X) + V(Y) (car V(-Y) = V(Y))." },
    { description: "\\(V(-Y) = V(Y)\\).", reponse: "Vrai", explication: "C'est vrai : V(-Y) = (-1)²V(Y) = V(Y), le signe disparaît car il est élevé au carré." },
    { description: "Si \\(X_1, \\ldots, X_n\\) suivent la même loi, alors \\(E(X_1+\\cdots+X_n) = nE(X_1)\\).", reponse: "Vrai", explication: "C'est vrai : la linéarité de l'espérance s'applique sans avoir besoin d'indépendance." },
    { description: "Deux variables aléatoires suivant la même loi prennent nécessairement les mêmes valeurs à chaque tirage.", reponse: "Faux", explication: "C'est faux : suivre la même loi signifie avoir les mêmes probabilités associées aux mêmes valeurs, pas obtenir le même résultat à chaque tirage." },
    { description: "Sans hypothèse d'indépendance, on ne peut pas affirmer que \\(V(X+Y) = V(X)+V(Y)\\).", reponse: "Vrai", explication: "C'est vrai : contrairement à l'espérance, la formule additive de la variance nécessite l'indépendance des variables." },
  ]);
  return {
    type: "qcm",
    chapter: "Sommes de variables aléatoires — Variance",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 9. Comparer les espérances de deux lois binomiales (QCM) ----------
function genComparerEsperanceBinomialesQCM() {
  const n = randInt(10, 100);
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
  const m = randInt(10, 100);
  const q = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
  const EX = roundTo(n * p, 4);
  const EY = roundTo(m * q, 4);
  if (EX === EY) return genComparerEsperanceBinomialesQCM();
  const answer = EX < EY ? "E(X) < E(Y)" : "E(X) > E(Y)";
  return {
    type: "qcm",
    chapter: "Sommes de variables aléatoires — Somme de n variables",
    prompt: `X suit une loi \\(\\mathcal{B}(${n};${fr(p)})\\) et Y suit une loi \\(\\mathcal{B}(${m};${fr(q)})\\). Compare \\(E(X)\\) et \\(E(Y)\\).`,
    answer,
    options: ["E(X) < E(Y)", "E(X) > E(Y)", "E(X) = E(Y)"],
    steps: [
      { type: "regle", text: "Pour une loi binomiale B(n;p), E(X) = np." },
      { type: "calcul", text: `E(X) = ${n} \\times ${fr(p)} = ${fr(EX)}` },
      { type: "resultat", text: `E(Y) = ${m} \\times ${fr(q)} = ${fr(EY)}` },
    ],
  };
}

// ---------- 10. Comparer les écarts-types de deux lois binomiales (QCM) ----------
function genComparerEcartTypeBinomialesQCM() {
  const n = randInt(10, 100);
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
  const m = randInt(10, 100);
  const q = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
  const sigmaX = roundTo(Math.sqrt(n * p * (1 - p)), 4);
  const sigmaY = roundTo(Math.sqrt(m * q * (1 - q)), 4);
  if (sigmaX === sigmaY) return genComparerEcartTypeBinomialesQCM();
  const answer = sigmaX < sigmaY ? "\\sigma(X) < \\sigma(Y)" : "\\sigma(X) > \\sigma(Y)";
  return {
    type: "qcm",
    chapter: "Sommes de variables aléatoires — Somme de n variables",
    prompt: `X suit une loi \\(\\mathcal{B}(${n};${fr(p)})\\) et Y suit une loi \\(\\mathcal{B}(${m};${fr(q)})\\). Compare \\(\\sigma(X)\\) et \\(\\sigma(Y)\\).`,
    answer,
    options: ["\\sigma(X) < \\sigma(Y)", "\\sigma(X) > \\sigma(Y)", "\\sigma(X) = \\sigma(Y)"],
    steps: [
      { type: "regle", text: "Pour une loi binomiale B(n;p), σ(X) = √(np(1-p))." },
      { type: "calcul", text: `\\sigma(X) = \\sqrt{np(1-p)} \\approx ${fr(sigmaX)}` },
      { type: "resultat", text: `\\sigma(Y) = \\sqrt{mq(1-q)} \\approx ${fr(sigmaY)}` },
    ],
  };
}

// ---------- 11. Résoudre une équation avec l'espérance (numeric) ----------
function genResoudreEquationEsperanceNumeric() {
  const a = randInt(-9, 9); // valeur recherchée
  const m = nonZero(-6, 6);
  const c = randInt(-9, 9);
  const k = nonZero(-5, 5);
  const V1 = randInt(-9, 9); // E(X)
  const target = V1 + k * (m * a + c);
  return {
    type: "numeric",
    chapter: "Sommes de variables aléatoires — Espérance",
    prompt: `On donne \\(E(X) = ${V1}\\) et \\(E(Y) = ${m}a ${c >= 0 ? "+" : "-"} ${Math.abs(c)}\\) (où a est un réel inconnu). Sachant que \\(E(X ${k >= 0 ? "+" : "-"} ${Math.abs(k)}Y) = ${target}\\), détermine a.`,
    answer: a,
    steps: [
      { type: "regle", text: "On applique la linéarité de l'espérance E(X+kY) = E(X)+kE(Y), puis on résout l'équation en a." },
      { type: "calcul", text: `${V1} + ${k} \\times (${m}a ${c >= 0 ? "+" : "-"} ${Math.abs(c)}) = ${target}` },
      { type: "calcul", text: `${m * k}a = ${target - V1 - k * c}` },
      { type: "resultat", text: `a = ${a}` },
    ],
  };
}

// ---------- 12. Variance et transformation affine (QCM Vrai/Faux) ----------
function genVarianceAffineQCM() {
  const cas = pick([
    { description: "Pour tout réel b, \\(V(aX+b) = a^2V(X)\\) (b n'a pas d'effet sur la variance).", reponse: "Vrai", explication: "C'est vrai : la variance mesure la dispersion, or ajouter une constante translate toutes les valeurs sans changer leur écart entre elles." },
    { description: "\\(V(aX+b) = a^2V(X) + b^2\\).", reponse: "Faux", explication: "C'est faux : la constante b n'intervient pas du tout dans la variance, la formule correcte est V(aX+b) = a²V(X)." },
    { description: "Ajouter une constante à une variable aléatoire ne change pas sa variance.", reponse: "Vrai", explication: "C'est vrai : une translation (ajout d'une constante) décale toutes les valeurs de la même quantité, la dispersion autour de la moyenne reste identique." },
  ]);
  return {
    type: "qcm",
    chapter: "Sommes de variables aléatoires — Variance",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 13. Reconnaître la formule de E(aX+b) (QCM) ----------
function genFormuleEsperanceAffineQCM() {
  const a = nonZero(-6, 6);
  const b = nonZero(-9, 9);
  const correct = `${a}E(X) + ${b}`;
  const options = shuffle([correct, `${a}E(X)`, `${a}(E(X)+${b})`, `E(X) + ${b}`]);
  return {
    type: "qcm",
    chapter: "Sommes de variables aléatoires — Espérance",
    prompt: `Quelle est l'expression de \\(E(${a}X+${b})\\) ?`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : E(aX+b) = aE(X) + b." },
      { type: "resultat", text: `E(${a}X+${b}) = ${correct}` },
    ],
  };
}

// ---------- 14. Variance d'une transformation affine (numeric) ----------
function genVarianceUniqueVariableAffineNumeric() {
  const VX = randInt(1, 20);
  const a = nonZero(-6, 6);
  const b = randInt(-9, 9);
  const answer = a * a * VX;
  return {
    type: "numeric",
    chapter: "Sommes de variables aléatoires — Variance",
    prompt: `On sait que \\(V(X) = ${VX}\\). Calcule \\(V(${a}X ${b >= 0 ? "+" : "-"} ${Math.abs(b)})\\).`,
    answer,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : V(aX+b) = a²V(X) (b n'intervient pas)." },
      { type: "resultat", text: `V(${a}X${b >= 0 ? "+" : ""}${b}) = ${a}^2 \\times V(X) = ${a * a} \\times ${VX} = ${answer}` },
    ],
  };
}

// ---------- 15. Espérance d'une transformation affine (numeric) ----------
function genEsperanceUniqueVariableAffineNumeric() {
  const EX = randInt(-9, 9);
  const a = nonZero(-6, 6);
  const b = randInt(-9, 9);
  const answer = a * EX + b;
  return {
    type: "numeric",
    chapter: "Sommes de variables aléatoires — Espérance",
    prompt: `On sait que \\(E(X) = ${EX}\\). Calcule \\(E(${a}X ${b >= 0 ? "+" : "-"} ${Math.abs(b)})\\).`,
    answer,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : E(aX+b) = aE(X) + b." },
      { type: "resultat", text: `E(${a}X${b >= 0 ? "+" : ""}${b}) = ${a} \\times ${EX} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}` },
    ],
  };
}

const GENERATORS = [
  genEsperanceLineaireNumeric,
  genVarianceSommeIndependanteNumeric,
  genVarianceDifferenceIndependanteNumeric,
  genEsperanceSommeNIidNumeric,
  genVarianceSommeNIidNumeric,
  genFormuleVarianceIndependanceQCM,
  genFormuleEsperanceQCM,
  genVraiFauxSommesVariablesQCM,
  genComparerEsperanceBinomialesQCM,
  genComparerEcartTypeBinomialesQCM,
  genResoudreEquationEsperanceNumeric,
  genVarianceAffineQCM,
  genFormuleEsperanceAffineQCM,
  genVarianceUniqueVariableAffineNumeric,
  genEsperanceUniqueVariableAffineNumeric,
];

const DIFFICULTY = {
  genFormuleVarianceIndependanceQCM: "facile",
  genFormuleEsperanceQCM: "facile",
  genVarianceAffineQCM: "facile",
  genFormuleEsperanceAffineQCM: "facile",
  genEsperanceUniqueVariableAffineNumeric: "facile",
  genEsperanceLineaireNumeric: "standard",
  genVarianceSommeIndependanteNumeric: "standard",
  genEsperanceSommeNIidNumeric: "standard",
  genVarianceSommeNIidNumeric: "standard",
  genVraiFauxSommesVariablesQCM: "standard",
  genVarianceUniqueVariableAffineNumeric: "standard",
  genVarianceDifferenceIndependanteNumeric: "expert",
  genComparerEsperanceBinomialesQCM: "expert",
  genComparerEcartTypeBinomialesQCM: "expert",
  genResoudreEquationEsperanceNumeric: "expert",
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
    id: "sommes-variables-aleatoires-terminale-spe",
    title: "Sommes de variables aléatoires",
    description: "Linéarité de l'espérance, variance d'une somme de variables indépendantes, somme de n variables i.i.d.",
    pourquoi: "Additionner des variables aléatoires indépendantes permet de modéliser un total (temps d'attente cumulé, somme de mesures) et d'en prévoir la fluctuation.",
    level: "terminale-spe",
    free: false,
    order: 14,
    cours: {
      mindMap: {
        title: "Sommes de variables aléatoires",
        branches: [
          {
            title: "Linéarité de l'espérance",
            items: [
              "Toujours vraie, même si les variables ne sont pas indépendantes.",
            ],
            formula: "\\(E(X+Y) = E(X)+E(Y)\\)",
          },
          {
            title: "Variance d'une somme (variables indépendantes)",
            items: [
              "Piège classique très fréquent : cette formule n'est valable QUE si X et Y sont indépendantes.",
            ],
            formula: "\\(V(X+Y) = V(X)+V(Y)\\ \\text{(si X, Y indépendantes)}\\)",
          },
          {
            title: "Somme de n variables identiques et indépendantes",
            items: [
              "Si \\(S_n = X_1+\\cdots+X_n\\) avec les \\(X_i\\) i.i.d. de même loi que X.",
            ],
            formula: "\\(E(S_n)=nE(X),\\quad V(S_n)=nV(X)\\)",
          },
          {
            title: "Variable affine aX+b",
            items: [
              "Piège classique : le b disparaît dans la variance (translater ne change pas la dispersion).",
            ],
            formula: "\\(E(aX+b)=aE(X)+b,\\quad V(aX+b)=a^2V(X)\\)",
          },
        ],
      },
    },
  },
  generate,
};
