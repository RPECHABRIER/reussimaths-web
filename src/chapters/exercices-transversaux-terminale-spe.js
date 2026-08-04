// ---------------------------------------------------------------------------
// Chapitre : Exercices transversaux (Terminale Spé) — abonnement.
// Chapitre de révision croisant les grands thèmes de l'année : combinatoire,
// vecteurs de l'espace, suites, limites, continuité, dérivation,
// logarithme, trigonométrie, primitives/équations différentielles, calcul
// intégral, loi binomiale, sommes de variables aléatoires, loi des grands
// nombres.
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

function factorielle(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function arrangement(n, k) {
  let r = 1;
  for (let i = 0; i < k; i++) r *= n - i;
  return r;
}
function combinaison(n, k) {
  if (k < 0 || k > n) return 0;
  return Math.round(arrangement(n, k) / factorielle(k));
}

const texAffine = (a, b) => `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;

// ---------- 1. Combinatoire : coefficient binomial (numeric) ----------
function genRevisionCombinatoireNumeric() {
  const n = randInt(4, 12);
  const k = randInt(1, n - 1);
  return {
    type: "numeric",
    chapter: "Exercices transversaux — Combinatoire",
    prompt: `Calcule \\(\\dbinom{${n}}{${k}}\\).`,
    answer: combinaison(n, k),
    steps: [`\\dbinom{${n}}{${k}} = ${combinaison(n, k)}`],
  };
}

// ---------- 2. Vecteurs de l'espace : produit scalaire (numeric) ----------
function genRevisionProduitScalaireNumeric() {
  const u = { x: nonZero(-8, 8), y: nonZero(-8, 8), z: nonZero(-8, 8) };
  const v = { x: nonZero(-8, 8), y: nonZero(-8, 8), z: nonZero(-8, 8) };
  const answer = u.x * v.x + u.y * v.y + u.z * v.z;
  return {
    type: "numeric",
    chapter: "Exercices transversaux — Vecteurs de l'espace",
    prompt: `\\(\\vec{u}(${u.x} ; ${u.y} ; ${u.z})\\) et \\(\\vec{v}(${v.x} ; ${v.y} ; ${v.z})\\). Calcule \\(\\vec{u} \\cdot \\vec{v}\\).`,
    answer,
    steps: [`${u.x} \\times ${v.x} + ${u.y} \\times ${v.y} + ${u.z} \\times ${v.z} = ${answer}`],
  };
}

// ---------- 3. Suites : limite d'une suite géométrique (QCM) ----------
function genRevisionLimiteGeometriqueQCM() {
  const cas = pick([
    { texte: "3", reponse: "+\\infty" },
    { texte: "0{,}5", reponse: "0" },
    { texte: "1{,}2", reponse: "+\\infty" },
    { texte: "0{,}2", reponse: "0" },
  ]);
  return {
    type: "qcm",
    chapter: "Exercices transversaux — Suites",
    prompt: `Quelle est la limite de \\(u_n = ${cas.texte}^n\\) quand n tend vers \\(+\\infty\\) ?`,
    answer: cas.reponse,
    options: ["+\\infty", "0"],
    steps: [cas.reponse],
  };
}

// ---------- 4. Limites de fonctions : forme indéterminée (QCM) ----------
function genRevisionFormeIndetermineeQCM() {
  const cas = pick([
    { description: "\\infty - \\infty", reponse: "Forme indéterminée" },
    { description: "0 \\times \\infty", reponse: "Forme indéterminée" },
    { description: "\\infty + 5", reponse: "Pas de forme indéterminée" },
  ]);
  return {
    type: "qcm",
    chapter: "Exercices transversaux — Limites de fonctions",
    prompt: `La forme \\(${cas.description}\\) est-elle une forme indéterminée ?`,
    answer: cas.reponse,
    options: ["Forme indéterminée", "Pas de forme indéterminée"],
    steps: [cas.reponse],
  };
}

// ---------- 5. Continuité : théorème des valeurs intermédiaires (QCM) ----------
function genRevisionTVIQCM() {
  const f1 = randInt(-8, -1);
  const f2 = randInt(1, 8);
  return {
    type: "qcm",
    chapter: "Exercices transversaux — Continuité",
    prompt: `f est continue sur \\([1;2]\\), \\(f(1) = ${f1}\\) et \\(f(2) = ${f2}\\). L'équation f(x)=0 admet-elle une solution sur \\([1;2]\\) ?`,
    answer: "Oui",
    options: ["Oui", "Non"],
    steps: [`f(1) \\times f(2) = ${f1 * f2} < 0 : une solution est garantie.`],
  };
}

// ---------- 6. Dérivation : dérivée d'une composée e^(ax+b) (numeric) ----------
function genRevisionDeriveeExpNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-6, 6);
  return {
    type: "numeric",
    chapter: "Exercices transversaux — Dérivation",
    prompt: `On considère \\(f(x) = \\mathrm{e}^{${texAffine(a, b)}}\\). Donne le coefficient devant \\(\\mathrm{e}^{${texAffine(a, b)}}\\) dans \\(f'(x)\\).`,
    answer: a,
    steps: [`f'(x) = ${a}\\mathrm{e}^{${texAffine(a, b)}}`],
  };
}

// ---------- 7. Logarithme : propriété algébrique (QCM) ----------
function genRevisionLnProduitQCM() {
  const m = randInt(2, 9);
  let n = randInt(2, 9);
  if (n === m) n += 1;
  const correct = `\\ln(${m}) + \\ln(${n})`;
  const options = shuffle([correct, `\\ln(${m}) \\times \\ln(${n})`, `\\ln(${m}) - \\ln(${n})`, `\\ln(${m + n})`]);
  return {
    type: "qcm",
    chapter: "Exercices transversaux — Logarithme népérien",
    prompt: `Quelle est l'expression de \\(\\ln(${m} \\times ${n})\\) en fonction de \\(\\ln(${m})\\) et \\(\\ln(${n})\\) ?`,
    answer: correct,
    options,
    steps: [`\\ln(${m} \\times ${n}) = ${correct}`],
  };
}

// ---------- 8. Trigonométrie : valeur remarquable (QCM) ----------
function genRevisionTrigonometrieQCM() {
  const table = [
    { tex: "0", cos: "1", sin: "0" },
    { tex: "\\dfrac{\\pi}{6}", cos: "\\dfrac{\\sqrt{3}}{2}", sin: "\\dfrac{1}{2}" },
    { tex: "\\dfrac{\\pi}{4}", cos: "\\dfrac{\\sqrt{2}}{2}", sin: "\\dfrac{\\sqrt{2}}{2}" },
    { tex: "\\dfrac{\\pi}{3}", cos: "\\dfrac{1}{2}", sin: "\\dfrac{\\sqrt{3}}{2}" },
    { tex: "\\dfrac{\\pi}{2}", cos: "0", sin: "1" },
  ];
  const allValues = ["0", "\\dfrac{1}{2}", "\\dfrac{\\sqrt{2}}{2}", "\\dfrac{\\sqrt{3}}{2}", "1"];
  const angle = pick(table);
  const fonction = pick(["cos", "sin"]);
  const correct = fonction === "cos" ? angle.cos : angle.sin;
  const distracteurs = shuffle(allValues.filter((v) => v !== correct)).slice(0, 3);
  return {
    type: "qcm",
    chapter: "Exercices transversaux — Fonctions trigonométriques",
    prompt: `Quelle est la valeur de \\(\\${fonction}\\left(${angle.tex}\\right)\\) ?`,
    answer: correct,
    options: shuffle([correct, ...distracteurs]),
    steps: [`\\${fonction}\\left(${angle.tex}\\right) = ${correct}`],
  };
}

// ---------- 9. Primitives : constante d'une équation différentielle (numeric) ----------
function genRevisionEquationDiffNumeric() {
  const a = nonZero(-6, 6);
  const v0 = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Exercices transversaux — Primitives, équations différentielles",
    prompt: `Les solutions de \\(y' = ${a}y\\) sont les fonctions \\(x \\mapsto C\\mathrm{e}^{${a}x}\\). Sachant que \\(F(0) = ${v0}\\), détermine C.`,
    answer: v0,
    steps: [`C = F(0) = ${v0}`],
  };
}

// ---------- 10. Calcul intégral : intégrale d'une fonction constante (numeric) ----------
function genRevisionIntegraleConstanteNumeric() {
  const a = randInt(-6, 6);
  const b = a + randInt(1, 6);
  const k = randInt(-9, 9);
  const answer = k * (b - a);
  return {
    type: "numeric",
    chapter: "Exercices transversaux — Calcul intégral",
    prompt: `Calcule \\(\\displaystyle\\int_{${a}}^{${b}} ${k}\\,\\mathrm{d}x\\).`,
    answer,
    steps: [`${k} \\times (${b} - ${a}) = ${answer}`],
  };
}

// ---------- 11. Loi binomiale : espérance et variance (numeric) ----------
function genRevisionLoiBinomialeNumeric() {
  const n = randInt(5, 60);
  const p = pick([0.1, 0.2, 0.25, 0.4, 0.5]);
  const varianceOuEsperance = Math.random() < 0.5;
  const answer = varianceOuEsperance ? roundTo(n * p, 4) : roundTo(n * p * (1 - p), 4);
  return {
    type: "numeric",
    chapter: "Exercices transversaux — Loi binomiale",
    prompt: `\\(X \\sim \\mathcal{B}(${n};${fr(p)})\\). Calcule \\(${varianceOuEsperance ? "E(X)" : "V(X)"}\\), arrondi au centième si nécessaire.`,
    answer,
    tolerance: 0.01,
    steps: [varianceOuEsperance ? `E(X) = np = ${n} \\times ${fr(p)} = ${fr(answer)}` : `V(X) = np(1-p) = ${n} \\times ${fr(p)} \\times ${fr(roundTo(1 - p, 4))} = ${fr(answer)}`],
  };
}

// ---------- 12. Sommes de variables aléatoires : linéarité de l'espérance (numeric) ----------
function genRevisionEsperanceLineaireNumeric() {
  const EX = randInt(-9, 9);
  const EY = randInt(-9, 9);
  const p = nonZero(-6, 6);
  const q = nonZero(-6, 6);
  const answer = p * EX + q * EY;
  return {
    type: "numeric",
    chapter: "Exercices transversaux — Sommes de variables aléatoires",
    prompt: `\\(E(X) = ${EX}\\), \\(E(Y) = ${EY}\\). Calcule \\(E(${p}X ${q >= 0 ? "+" : "-"} ${Math.abs(q)}Y)\\).`,
    answer,
    steps: [`${p} \\times ${EX} + ${q} \\times ${EY} = ${answer}`],
  };
}

// ---------- 13. Loi des grands nombres : inégalité de Bienaymé-Tchebychev (numeric) ----------
function genRevisionBienaymeTchebychevNumeric() {
  const VX = randInt(1, 30);
  const a = randInt(1, 10);
  const answer = roundTo(VX / (a * a), 4);
  return {
    type: "numeric",
    chapter: "Exercices transversaux — Loi des grands nombres",
    prompt: `\\(V(X) = ${VX}\\). D'après l'inégalité de Bienaymé-Tchebychev, majore \\(P(|X-E(X)| \\geqslant ${a})\\), arrondi au millième.`,
    answer,
    tolerance: 0.001,
    steps: [`\\dfrac{${VX}}{${a}^2} \\approx ${fr(answer)}`],
  };
}

// ---------- 14. Vrai/faux transversal (QCM) ----------
function genRevisionVraiFauxQCM() {
  const cas = pick([
    { description: "Pour \\(X \\sim \\mathcal{B}(n;p)\\), \\(E(X) = np\\).", reponse: "Vrai" },
    { description: "\\(\\ln(1) = 0\\).", reponse: "Vrai" },
    { description: "La fonction sinus est paire.", reponse: "Faux" },
    { description: "Deux primitives d'une même fonction diffèrent d'une constante.", reponse: "Vrai" },
    { description: "Si f est convexe sur I, sa courbe est en-dessous de ses tangentes.", reponse: "Faux" },
    { description: "\\(\\dbinom{n}{k} = \\dbinom{n}{n-k}\\).", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Exercices transversaux — Révisions",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 15. Nombre dérivé et tangente (numeric) ----------
function genRevisionTangenteNumeric() {
  const a = randInt(-6, 6);
  const m = nonZero(-6, 6);
  const p = randInt(-8, 8);
  let x1 = randInt(-6, 6);
  if (x1 === a) x1 += 1;
  const answer = m * (x1 - a) + p;
  return {
    type: "numeric",
    chapter: "Exercices transversaux — Dérivation",
    prompt: `On a \\(f(${a}) = ${p}\\) et \\(f'(${a}) = ${m}\\). La tangente en \\(x=${a}\\) a pour équation \\(y = ${m}(x - (${a})) + ${p}\\). Quelle est l'ordonnée du point de cette tangente d'abscisse ${x1} ?`,
    answer,
    steps: [`y = ${m} \\times (${x1} - (${a})) + ${p} = ${answer}`],
  };
}

const GENERATORS = [
  genRevisionCombinatoireNumeric,
  genRevisionProduitScalaireNumeric,
  genRevisionLimiteGeometriqueQCM,
  genRevisionFormeIndetermineeQCM,
  genRevisionTVIQCM,
  genRevisionDeriveeExpNumeric,
  genRevisionLnProduitQCM,
  genRevisionTrigonometrieQCM,
  genRevisionEquationDiffNumeric,
  genRevisionIntegraleConstanteNumeric,
  genRevisionLoiBinomialeNumeric,
  genRevisionEsperanceLineaireNumeric,
  genRevisionBienaymeTchebychevNumeric,
  genRevisionVraiFauxQCM,
  genRevisionTangenteNumeric,
];

const DIFFICULTY = {
  genRevisionLimiteGeometriqueQCM: "facile",
  genRevisionTVIQCM: "facile",
  genRevisionLnProduitQCM: "facile",
  genRevisionIntegraleConstanteNumeric: "facile",
  genRevisionCombinatoireNumeric: "standard",
  genRevisionProduitScalaireNumeric: "standard",
  genRevisionDeriveeExpNumeric: "standard",
  genRevisionTrigonometrieQCM: "standard",
  genRevisionLoiBinomialeNumeric: "standard",
  genRevisionEsperanceLineaireNumeric: "standard",
  genRevisionTangenteNumeric: "standard",
  genRevisionFormeIndetermineeQCM: "expert",
  genRevisionEquationDiffNumeric: "expert",
  genRevisionBienaymeTchebychevNumeric: "expert",
  genRevisionVraiFauxQCM: "expert",
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
    id: "exercices-transversaux-terminale-spe",
    title: "Exercices transversaux",
    description: "Révisions croisant tous les grands thèmes de l'année de Terminale Spécialité.",
    pourquoi: "Ces révisions croisées entraînent à mobiliser le bon outil parmi tous ceux vus dans l'année, comme le jour du Bac.",
    level: "terminale-spe",
    free: false,
    order: 16,
  },
  generate,
};
