// ---------------------------------------------------------------------------
// Chapitre : Logarithme népérien (Terminale Spé) — abonnement.
// Propriétés algébriques du logarithme, domaine de définition, dérivée de
// ln(u), équations et inéquations, signe et comparaison, limites usuelles.
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

const texAffine = (a, b) => `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;

// ---------- 1. Propriété ln(m×n) = ln(m) + ln(n) (QCM) ----------
function genLnProduitQCM() {
  const m = randInt(2, 9);
  let n = randInt(2, 9);
  if (n === m) n += 1;
  const correct = `\\ln(${m}) + \\ln(${n})`;
  const options = shuffle([correct, `\\ln(${m}) \\times \\ln(${n})`, `\\ln(${m}) - \\ln(${n})`, `\\ln(${m + n})`]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `Quelle est l'expression de \\(\\ln(${m} \\times ${n})\\) en fonction de \\(\\ln(${m})\\) et \\(\\ln(${n})\\) ?`,
    answer: correct,
    options,
    steps: [{ type: "regle", text: `\\text{Formule de référence à connaître : } \\ln(m \\times n) = \\ln(m) + \\ln(n). \\text{ Donc } \\ln(${m} \\times ${n}) = ${correct}` }],
  };
}

// ---------- 2. Propriété ln(m/n) = ln(m) - ln(n) (QCM) ----------
function genLnQuotientQCM() {
  const m = randInt(2, 9);
  let n = randInt(2, 9);
  if (n === m) n += 1;
  const correct = `\\ln(${m}) - \\ln(${n})`;
  const options = shuffle([correct, `\\ln(${n}) - \\ln(${m})`, `\\ln(${m}) + \\ln(${n})`, `\\dfrac{\\ln(${m})}{\\ln(${n})}`]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `Quelle est l'expression de \\(\\ln\\left(\\dfrac{${m}}{${n}}\\right)\\) en fonction de \\(\\ln(${m})\\) et \\(\\ln(${n})\\) ?`,
    answer: correct,
    options,
    steps: [{ type: "regle", text: `\\text{Formule de référence à connaître : } \\ln\\left(\\dfrac{m}{n}\\right) = \\ln(m) - \\ln(n). \\text{ Donc } \\ln\\left(\\dfrac{${m}}{${n}}\\right) = ${correct}` }],
  };
}

// ---------- 3. Coefficient dans ln(b^n) = n ln(b) (numeric) ----------
function genLnPuissanceCoefficientNumeric() {
  const b = pick([2, 3, 5, 7]);
  const n = randInt(2, 6);
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `On écrit \\(\\ln(${b}^{${n}})\\) sous la forme \\(k \\times \\ln(${b})\\). Donne la valeur de k.`,
    answer: n,
    steps: [{ type: "regle", text: `\\text{Formule de référence à connaître : } \\ln(b^n) = n\\ln(b). \\text{ Donc } \\ln(${b}^{${n}}) = ${n}\\ln(${b})` }],
  };
}

// ---------- 4. Racine k-ième et logarithme (QCM) ----------
function genLnRacineFormuleQCM() {
  const v = pick(["x", "t", "a"]);
  const k = pick([2, 3, 4]);
  const correct = `\\dfrac{1}{${k}}\\ln(${v})`;
  const options = shuffle([correct, `${k}\\ln(${v})`, `\\ln(${v})^{\\frac{1}{${k}}}`, `\\ln\\left(\\dfrac{${v}}{${k}}\\right)`]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `On considère \\(${v} > 0\\). Quelle est l'expression de \\(\\ln\\left(\\sqrt[${k}]{${v}}\\right)\\) en fonction de \\(\\ln(${v})\\) ?`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: `\\text{Une racine } k\\text{-ième s'écrit comme une puissance } \\frac{1}{k}, \\text{ puis on applique } \\ln(u^n)=n\\ln(u).` },
      { type: "resultat", text: `\\sqrt[${k}]{${v}} = ${v}^{\\frac{1}{${k}}} \\Rightarrow \\ln\\left(\\sqrt[${k}]{${v}}\\right) = ${correct}` },
    ],
  };
}

// ---------- 5. Valeurs remarquables du logarithme (QCM Vrai/Faux) ----------
function genLnValeurRemarquableQCM() {
  const cas = pick([
    { description: "\\ln(1) = 0", reponse: "Vrai", explication: "C'est vrai : ln(1)=0 est une valeur remarquable à connaître, car e^0=1." },
    { description: "\\ln(\\mathrm{e}) = 1", reponse: "Vrai", explication: "C'est vrai : ln(e)=1 par définition, puisque e^1=e." },
    { description: "\\ln(0) \\text{ est défini et vaut } 0", reponse: "Faux", explication: "C'est faux : ln(0) n'est pas défini du tout — le logarithme népérien n'est défini que pour les réels strictement positifs. Quand x tend vers 0 par valeurs positives, ln(x) tend vers -∞." },
    { description: "\\text{Pour tout } a>0, \\mathrm{e}^{\\ln(a)} = a", reponse: "Vrai", explication: "C'est vrai : exp et ln sont des fonctions réciproques l'une de l'autre, donc composer l'une avec l'autre redonne le nombre de départ." },
    { description: "\\text{Pour tout réel } k, \\ln(\\mathrm{e}^k) = k", reponse: "Vrai", explication: "C'est vrai : c'est la même propriété de réciprocité, appliquée dans l'autre sens." },
    { description: "\\ln(\\mathrm{e}^2) = 4", reponse: "Faux", explication: "C'est faux : ln(e^2)=2 (et non 4), car ln(e^k)=k pour tout réel k. Ne pas confondre avec e^2=e×e, qui n'a rien à voir avec ce calcul." },
  ]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 6. Borne du domaine de définition de ln(ax+b) (numeric) ----------
function genDomaineDefinitionLnNumeric() {
  const x0 = randInt(-6, 6);
  const a = nonZero(-5, 5);
  const b = -a * x0;
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Domaine de définition",
    prompt: `On considère \\(f(x) = \\ln(${texAffine(a, b)})\\). f est définie là où \\(${texAffine(a, b)} > 0\\). Détermine la valeur de x pour laquelle \\(${texAffine(a, b)} = 0\\) (borne du domaine de définition).`,
    answer: x0,
    steps: [
      { type: "calcul", text: `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = 0` },
      { type: "resultat", text: `x = ${x0}` },
    ],
  };
}

// ---------- 7. Dérivée de ln(ax+b) en un point (numeric) ----------
function genDeriveeLnAffineNumeric() {
  const a = nonZero(-6, 6);
  const x0 = randInt(-5, 5);
  const k = randInt(1, 9); // valeur de ax+b en x0, choisie strictement positive
  const b = k - a * x0;
  const answer = roundTo(a / k, 4);
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Dérivée",
    prompt: `On considère \\(f(x) = \\ln(${texAffine(a, b)})\\). Calcule \\(f'(${x0})\\), arrondi au millième si nécessaire.`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{Formule de référence à connaître : } (\\ln(u))' = \\dfrac{u'}{u}.` },
      { type: "calcul", text: `f'(x) = \\dfrac{${a}}{${texAffine(a, b)}}` },
      { type: "resultat", text: `f'(${x0}) = \\dfrac{${a}}{${k}} = ${fr(answer)}` },
    ],
  };
}

// ---------- 8. Reconnaître la dérivée de ln(ax+b) (QCM) ----------
function genDeriveeLnFormuleQCM() {
  let a = nonZero(-6, 6);
  if (a === 1) a = 2; // évite que le distracteur "sans a" coïncide avec la réponse correcte
  const b = randInt(-6, 6);
  const expo = texAffine(a, b);
  const correct = `\\dfrac{${a}}{${expo}}`;
  const options = shuffle([correct, `\\dfrac{1}{${expo}}`, `\\dfrac{${a}}{${a}x}`, `${a} \\times \\ln(${expo})`]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Dérivée",
    prompt: `On considère \\(f(x) = \\ln(${expo})\\). Quelle est l'expression de \\(f'(x)\\) ?`,
    answer: correct,
    options,
    steps: [{ type: "regle", text: `f'(x) = \\dfrac{u'(x)}{u(x)} = ${correct}` }],
  };
}

// ---------- 9. Résoudre ln(x) = k (numeric) ----------
function genResoudreEquationLnNumeric() {
  const k = randInt(-3, 3);
  const answer = roundTo(Math.exp(k), 4);
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Équations",
    prompt: `Résous l'équation \\(\\ln(x) = ${k}\\) (avec x > 0). Donne la valeur de x arrondie au centième.`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{exp et ln sont réciproques : } \\ln(x) = k \\Leftrightarrow x = \\mathrm{e}^k.` },
      { type: "calcul", text: `x = \\mathrm{e}^{${k}}` },
      { type: "resultat", text: `x \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 10. Résoudre ln(a1x+b1) = ln(a2x+b2) (numeric) ----------
function genResoudreEquationLnEgaliteNumeric() {
  const x0 = randInt(-6, 6);
  const a1 = nonZero(-5, 5);
  let a2 = nonZero(-5, 5);
  if (a2 === a1) a2 += 1;
  const V = randInt(1, 12); // valeur commune des deux membres en x0, strictement positive
  const b1 = V - a1 * x0;
  const b2 = V - a2 * x0;
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Équations",
    prompt: `Résous l'équation \\(\\ln(${texAffine(a1, b1)}) = \\ln(${texAffine(a2, b2)})\\).`,
    answer: x0,
    steps: [
      { type: "regle", text: `\\text{La fonction ln est strictement croissante donc injective : } \\ln(A) = \\ln(B) \\Leftrightarrow A = B \\text{ (sous réserve que A et B soient strictement positifs).}` },
      { type: "calcul", text: `${texAffine(a1, b1)} = ${texAffine(a2, b2)}` },
      { type: "calcul", text: `${a1 - a2}x = ${b2 - b1}` },
      { type: "resultat", text: `x = ${x0}` },
    ],
  };
}

// ---------- 11. Signe de ln(x) (QCM) ----------
function genSigneLnQCM() {
  const cas = pick(["superieur", "inferieur", "unite"]);
  let texte, answer;
  if (cas === "superieur") {
    const x = randInt(2, 9);
    texte = `${x}`;
    answer = "Positif";
  } else if (cas === "inferieur") {
    const n = randInt(2, 9);
    texte = `\\dfrac{1}{${n}}`;
    answer = "Négatif";
  } else {
    texte = "1";
    answer = "Nul";
  }
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Signe et comparaison",
    prompt: `Quel est le signe de \\(\\ln(${texte})\\) ?`,
    answer,
    options: ["Positif", "Négatif", "Nul"],
    steps: [
      { type: "regle", text: `\\text{Le signe de ln(x) dépend de la position de x par rapport à 1 : ln(x)>0 si x>1, ln(x)<0 si } 0<x<1, \\ln(1)=0.` },
      { type: "resultat", text: answer === "Positif" ? "L'argument est strictement supérieur à 1." : answer === "Négatif" ? "L'argument est strictement compris entre 0 et 1." : "L'argument vaut 1." },
    ],
  };
}

// ---------- 12. Comparer ln(a) et ln(b) (QCM) ----------
function genComparerLnQCM() {
  const a = randInt(2, 20);
  let b = randInt(2, 20);
  if (b === a) b += 1;
  const answer = a < b ? `\\ln(${a}) < \\ln(${b})` : `\\ln(${a}) > \\ln(${b})`;
  const options = [`\\ln(${a}) < \\ln(${b})`, `\\ln(${a}) > \\ln(${b})`, `\\ln(${a}) = \\ln(${b})`];
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Signe et comparaison",
    prompt: `Compare \\(\\ln(${a})\\) et \\(\\ln(${b})\\) (la fonction ln est strictement croissante sur \\(]0;+\\infty[\\)).`,
    answer,
    options,
    steps: [{ type: "resultat", text: a < b ? `${a} < ${b} \\text{ donc } \\ln(${a}) < \\ln(${b})` : `${a} > ${b} \\text{ donc } \\ln(${a}) > \\ln(${b})` }],
  };
}

// ---------- 13. Limites usuelles du logarithme (QCM) ----------
function genLimiteLnQCM() {
  const cas = pick([
    { description: "\\lim\\limits_{x \\to 0^+} \\ln(x)", reponse: "-\\infty", explication: "C'est -∞ : quand x se rapproche de 0 par valeurs positives, ln(x) devient arbitrairement négatif (asymptote verticale en x=0)." },
    { description: "\\lim\\limits_{x \\to +\\infty} \\ln(x)", reponse: "+\\infty", explication: "C'est +∞ : ln(x) croît indéfiniment, mais beaucoup plus lentement que x." },
    { description: "\\lim\\limits_{x \\to +\\infty} \\dfrac{\\ln(x)}{x}", reponse: "0", explication: "C'est 0 : c'est le théorème de croissance comparée — x l'emporte toujours sur ln(x) en +∞." },
    { description: "\\lim\\limits_{x \\to 0^+} x\\ln(x)", reponse: "0", explication: "C'est 0 : c'est l'autre forme du théorème de croissance comparée — malgré la forme indéterminée de départ (0 × (-∞)), x l'emporte sur ln(x) près de 0." },
  ]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Limites",
    prompt: `Quelle est la limite \\(${cas.description}\\) ?`,
    answer: cas.reponse,
    options: ["-\\infty", "+\\infty", "0"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 14. Vrai ou faux sur les propriétés du logarithme (QCM) ----------
function genVraiFauxProprietesLnQCM() {
  const cas = pick([
    { description: "\\ln(a+b) = \\ln(a) + \\ln(b)", reponse: "Faux", explication: "C'est faux : la formule ln(a×b)=ln(a)+ln(b) concerne un produit, pas une somme. Par exemple ln(1+1)=ln(2)≈0,69 alors que ln(1)+ln(1)=0." },
    { description: "\\text{Pour } a,b>0, \\ln(a \\times b) = \\ln(a) + \\ln(b)", reponse: "Vrai", explication: "C'est vrai : c'est la propriété fondamentale du logarithme népérien qui transforme un produit en somme." },
    { description: "\\text{Pour tout réel } a, \\ln(a^2) = 2\\ln(a)", reponse: "Faux", explication: "C'est faux tel quel : ln(a) n'est défini que pour a>0. La formule correcte, valable pour tout a≠0, est ln(a²)=2ln(|a|)." },
    { description: "La fonction \\ln \\text{ est strictement croissante sur } \\left]0;+\\infty\\right[", reponse: "Vrai", explication: "C'est vrai : la fonction ln est strictement croissante sur son ensemble de définition ]0;+∞[." },
    { description: "\\ln(x) \\text{ est défini pour tout réel } x", reponse: "Faux", explication: "C'est faux : ln(x) n'est défini que pour x>0, ln n'existe pas pour x≤0." },
  ]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 15. Simplifier ln(e^a × e^b) (numeric) ----------
function genLnExponentielleReciproqueNumeric() {
  const a = randInt(-8, 8);
  const b = randInt(-8, 8);
  const answer = a + b;
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `Simplifie \\(\\ln\\left(\\mathrm{e}^{${a}} \\times \\mathrm{e}^{${b}}\\right)\\).`,
    answer,
    steps: [
      { type: "regle", text: "exp et ln sont réciproques : ln(e^k) = k." },
      { type: "calcul", text: `\\mathrm{e}^{${a}} \\times \\mathrm{e}^{${b}} = \\mathrm{e}^{${a}+${b}}` },
      { type: "resultat", text: `\\ln\\left(\\mathrm{e}^{${a}+${b}}\\right) = ${a} + ${b} = ${answer}` },
    ],
  };
}

const GENERATORS = [
  genLnProduitQCM,
  genLnQuotientQCM,
  genLnPuissanceCoefficientNumeric,
  genLnRacineFormuleQCM,
  genLnValeurRemarquableQCM,
  genDomaineDefinitionLnNumeric,
  genDeriveeLnAffineNumeric,
  genDeriveeLnFormuleQCM,
  genResoudreEquationLnNumeric,
  genResoudreEquationLnEgaliteNumeric,
  genSigneLnQCM,
  genComparerLnQCM,
  genLimiteLnQCM,
  genVraiFauxProprietesLnQCM,
  genLnExponentielleReciproqueNumeric,
];

const DIFFICULTY = {
  genLnProduitQCM: "facile",
  genLnQuotientQCM: "facile",
  genLnRacineFormuleQCM: "facile",
  genLnValeurRemarquableQCM: "facile",
  genDeriveeLnFormuleQCM: "facile",
  genLnPuissanceCoefficientNumeric: "standard",
  genDomaineDefinitionLnNumeric: "standard",
  genDeriveeLnAffineNumeric: "standard",
  genResoudreEquationLnNumeric: "standard",
  genSigneLnQCM: "standard",
  genComparerLnQCM: "standard",
  genResoudreEquationLnEgaliteNumeric: "expert",
  genLimiteLnQCM: "expert",
  genVraiFauxProprietesLnQCM: "expert",
  genLnExponentielleReciproqueNumeric: "expert",
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
    id: "logarithme-neperien-terminale-spe",
    title: "Logarithme népérien",
    description: "Propriétés algébriques, domaine de définition, dérivée, équations, signe et limites du logarithme népérien.",
    pourquoi: "Le logarithme népérien intervient partout où une croissance ou décroissance exponentielle doit être « inversée » : datation au carbone 14, calcul d'intérêts, désintégration radioactive.",
    level: "terminale-spe",
    free: false,
    order: 9,
    cours: {
      mindMap: {
        title: "Logarithme népérien",
        branches: [
          {
            title: "Définition et domaine",
            items: [
              "ln est définie uniquement sur \\(]0 ; +\\infty[\\) : piège classique très fréquent, un ln d'un nombre négatif ou nul n'existe pas.",
              "\\(\\ln(1)=0\\), \\(\\ln(e)=1\\).",
            ],
          },
          {
            title: "Propriétés algébriques",
            items: [
              "Transforme un produit en somme, un quotient en différence — exactement l'inverse de l'exponentielle : \\(\\mathrm{e}^{\\ln a}=a\\) (pour a>0) et \\(\\ln(\\mathrm{e}^k)=k\\) (pour tout réel k).",
              "Piège classique : \\(\\ln(a^2)=2\\ln(a)\\) n'est vrai que si a>0. Pour a réel non nul quelconque, la formule correcte est \\(\\ln(a^2)=2\\ln(|a|)\\).",
            ],
            formula: "\\(\\ln(ab)=\\ln a+\\ln b,\\quad \\ln\\left(\\dfrac{a}{b}\\right)=\\ln a-\\ln b,\\quad \\ln(a^n)=n\\ln a\\)",
          },
          {
            title: "Signe et sens de variation",
            items: [
              "ln est strictement croissante sur son domaine : \\(\\ln a < \\ln b \\iff a<b\\) (pour a, b > 0).",
              "\\(\\ln x > 0 \\iff x>1\\) ; \\(\\ln x<0 \\iff 0<x<1\\).",
            ],
          },
          {
            title: "Dérivée",
            items: [],
            formula: "\\((\\ln x)' = \\dfrac{1}{x},\\quad (\\ln u)' = \\dfrac{u'}{u}\\)",
          },
          {
            title: "Limites usuelles",
            items: [
              "En 0 par valeurs positives, ln tend vers \\(-\\infty\\) (asymptote verticale en x=0). En \\(+\\infty\\), ln tend vers \\(+\\infty\\), mais beaucoup plus lentement que x.",
              "Croissance comparée : \\(\\dfrac{\\ln x}{x} \\to 0\\) en \\(+\\infty\\), et \\(x\\ln x \\to 0\\) en \\(0^+\\) (malgré la forme indéterminée de départ \\(0 \\times (-\\infty)\\)) — x l'emporte toujours sur ln(x).",
            ],
          },
          {
            title: "Résoudre une équation avec ln",
            items: [
              "\\(\\ln A = \\ln B \\iff A=B\\) (à condition que A et B soient strictement positifs — à vérifier avant de conclure).",
              "Pour résoudre \\(\\ln(x) = k\\), passer à l'exponentielle des deux côtés : \\(x = \\mathrm{e}^k\\) (toujours solution unique, car \\(\\mathrm{e}^k>0\\)).",
              "Pour résoudre \\(e^x = k\\) (k > 0), passer au ln des deux côtés : \\(x = \\ln k\\).",
            ],
          },
        ],
      },
    },
  },
  generate,
};
