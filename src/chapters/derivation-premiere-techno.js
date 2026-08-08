// ---------------------------------------------------------------------------
// Chapitre : Dérivation (Première technologique)
// Programme 2026 : point de vue local (sécantes, taux de variation en un
// point, tangente comme position limite des sécantes, nombre dérivé comme
// limite du taux de variation, équation réduite de la tangente) ; point de
// vue global (fonction dérivée de x↦x² et x↦x³, dérivée d'une somme / de kf /
// d'un polynôme de degré ≤ 3, sens de variation lié au signe de la dérivée,
// tableau de variations, extremums). Capacités : interpréter le nombre
// dérivé comme coefficient directeur, construire/déterminer l'équation de la
// tangente, calculer une dérivée de degré ≤ 3, déterminer sens de variation
// et extremums.
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
const signedL = (n, withVar = "") => (n >= 0 ? `+ ${n}${withVar}` : `- ${Math.abs(n)}${withVar}`);

// ---------- 1. Taux de variation entre deux points ----------
function genTauxVariationNumeric() {
  const xA = randInt(-6, 6);
  const xB = xA + nonZero(1, 5);
  const yA = randInt(-8, 8);
  const m = nonZero(-5, 5);
  const yB = yA + m * (xB - xA);
  return {
    type: "numeric",
    chapter: "Dérivation (Première techno) — Taux de variation",
    prompt: `Une courbe passe par \\(A(${xA} ; ${yA})\\) et \\(B(${xB} ; ${yB})\\). Calcule le taux de variation entre A et B, \\(\\dfrac{f(${xB}) - f(${xA})}{${xB} - ${xA}}\\).`,
    answer: m,
    steps: [
      { type: "regle", text: "Le taux de variation entre A et B est le coefficient directeur de la droite (AB)." },
      { type: "resultat", text: `\\dfrac{${yB} - (${yA})}{${xB} - (${xA})} = \\dfrac{${yB - yA}}{${xB - xA}} = ${m}` },
    ],
    graph: {
      xMin: Math.min(xA, xB) - 2,
      xMax: Math.max(xA, xB) + 2,
      yMin: Math.min(yA, yB) - 2,
      yMax: Math.max(yA, yB) + 2,
      lines: [{ a: m, b: yA - m * xA, label: "(AB)" }],
      points: [{ x: xA, y: yA, label: "A" }, { x: xB, y: yB, label: "B" }],
    },
  };
}

// ---------- 2. Nombre dérivé = coefficient directeur de la tangente ----------
function genNombreDeriveTangenteNumeric() {
  const a = randInt(-5, 5);
  const m = nonZero(-6, 6);
  const p = m * a * -1 + randInt(-6, 6); // intercept b such that tangent passes through (a, f(a))
  const yA = m * a + p;
  return {
    type: "numeric",
    chapter: "Dérivation (Première techno) — Nombre dérivé",
    prompt: `On donne ci-dessous la courbe représentative d'une fonction \\(f\\) et sa tangente au point A d'abscisse ${a}. Détermine \\(f'(${a})\\), le coefficient directeur de cette tangente.`,
    answer: m,
    steps: [
      { type: "regle", text: `\\text{Le nombre dérivé } f'(${a}) \\text{ est le coefficient directeur de la tangente en A.}` },
      { type: "resultat", text: `f'(${a}) = ${m}` },
    ],
    graph: {
      xMin: a - 5,
      xMax: a + 5,
      yMin: Math.min(yA, m * (a - 5) + p, m * (a + 5) + p) - 2,
      yMax: Math.max(yA, m * (a - 5) + p, m * (a + 5) + p) + 2,
      lines: [{ a: m, b: p, label: "tangente" }],
      points: [{ x: a, y: yA, label: "A" }],
    },
  };
}

// ---------- 3. Équation réduite de la tangente ----------
function genEquationTangenteQCM() {
  const a = randInt(-4, 4);
  const fa = randInt(-6, 6);
  const fpa = nonZero(-5, 5);
  const b = roundTo(fa - fpa * a, 2);
  const correctRaw = `y = ${fpa}(x ${signedL(-a)}) ${fa >= 0 ? "+" : "-"} ${Math.abs(fa)}`;
  const wrong1 = `y = ${fa}(x ${signedL(-a)}) ${fpa >= 0 ? "+" : "-"} ${Math.abs(fpa)}`;
  const wrong2 = `y = ${fpa}x ${fa >= 0 ? "+" : "-"} ${Math.abs(fa)}`;
  const options = shuffle([correctRaw, wrong1, wrong2]);
  return {
    type: "qcm",
    chapter: "Dérivation (Première techno) — Équation de la tangente",
    prompt: `On sait que \\(f(${a}) = ${fa}\\) et \\(f'(${a}) = ${fpa}\\). Quelle est l'équation réduite de la tangente à la courbe de \\(f\\) au point d'abscisse ${a} ? (formule \\(y = f'(a)(x-a) + f(a)\\))`,
    answer: correctRaw,
    options,
    steps: [
      { type: "calcul", text: `y = f'(${a})(x - ${a}) + f(${a}) = ${fpa}(x ${signedL(-a)}) ${fa >= 0 ? "+" : "-"} ${Math.abs(fa)}` },
      { type: "resultat", text: `\\text{Sous forme développée : } y = ${fpa}x ${signedL(b)}` },
    ],
  };
}

// ---------- 4. Dérivée de x↦x² et x↦x³ ----------
function genDeriveeReferenceQCM() {
  const cas = pick([
    { fn: "x^2", deriv: "2x" },
    { fn: "x^3", deriv: "3x^2" },
  ]);
  const wrongs = cas.fn === "x^2" ? ["x", "2x^2"] : ["x^2", "3x"];
  const options = shuffle([cas.deriv, ...wrongs]);
  return {
    type: "qcm",
    chapter: "Dérivation (Première techno) — Fonctions de référence",
    prompt: `Quelle est la fonction dérivée de \\(f(x) = ${cas.fn}\\) ?`,
    answer: cas.deriv,
    options,
    steps: [
      { type: "regle", text: "Formules de référence à connaître : (x²)' = 2x et (x³)' = 3x²." },
      { type: "resultat", text: `f'(x) = ${cas.deriv}` },
    ],
  };
}

// ---------- 5. Dérivée d'un polynôme de degré ≤ 3 ----------
function genDeriveePolynomeNumeric() {
  const c3 = randInt(-4, 4);
  const c2 = randInt(-6, 6);
  const c1 = randInt(-8, 8);
  const x = randInt(-4, 4);
  const answer = 3 * c3 * x * x + 2 * c2 * x + c1;
  const parts = [];
  if (c3 !== 0) parts.push(`${c3 === 1 ? "" : c3 === -1 ? "-" : c3}x^3`);
  if (c2 !== 0) parts.push(signedL(c2, "x^2"));
  if (c1 !== 0) parts.push(signedL(c1, "x"));
  const fLatex = parts.join(" ") || "0";
  return {
    type: "numeric",
    chapter: "Dérivation (Première techno) — Dérivée d'un polynôme",
    prompt: `On considère \\(f(x) = ${fLatex}\\). Calcule \\(f'(${x})\\).`,
    answer,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : (ax³+bx²+cx+d)' = 3ax²+2bx+c." },
      { type: "calcul", text: `f'(x) = ${3 * c3}x^2 ${signedL(2 * c2, "x")} ${signedL(c1)}` },
      { type: "resultat", text: `f'(${x}) = ${3 * c3} \\times ${x}^2 ${signedL(2 * c2 * x)} ${signedL(c1)} = ${answer}` },
    ],
  };
}

// ---------- 6. Dérivée de kf (multiple d'une fonction) ----------
function genDeriveeMultipleNumeric() {
  const k = nonZero(-6, 6);
  const a = nonZero(-5, 5);
  const fpa = randInt(-6, 6);
  const answer = k * fpa;
  return {
    type: "numeric",
    chapter: "Dérivation (Première techno) — Dérivée de kf",
    prompt: `On sait que \\(f'(${a}) = ${fpa}\\). On pose \\(g = ${k}f\\). Calcule \\(g'(${a})\\) (formule \\((kf)' = kf'\\)).`,
    answer,
    steps: [{ type: "resultat", text: `g'(${a}) = ${k} \\times f'(${a}) = ${k} \\times ${fpa} = ${answer}` }],
  };
}

// ---------- 7. Signe de f' et sens de variation ----------
function genSigneDeriveeVariationQCM() {
  const fpa = nonZero(-6, 6);
  const answer = fpa > 0 ? "croissante" : "décroissante";
  return {
    type: "qcm",
    chapter: "Dérivation (Première techno) — Sens de variation",
    prompt: `Sur un intervalle, la dérivée d'une fonction \\(f\\) vérifie \\(f'(x) = ${fpa}\\) (signe constant). Quel est le sens de variation de \\(f\\) sur cet intervalle ?`,
    answer,
    options: ["croissante", "décroissante"],
    steps: [{ type: "regle", text: fpa > 0 ? `\\text{Comme } f'(x) > 0, \\text{ } f \\text{ est croissante.}` : `\\text{Comme } f'(x) < 0, \\text{ } f \\text{ est décroissante.}` }],
  };
}

// ---------- 8. Extremum et tableau de variations : lecture ----------
function genExtremumTableauVariationsQCM() {
  const a = randInt(-5, 5);
  const type = pick(["minimum", "maximum"]);
  const beta = randInt(-4, 8);
  const fn = type === "minimum" ? (x) => (x - a) * (x - a) + beta : (x) => -(x - a) * (x - a) + beta;
  return {
    type: "qcm",
    chapter: "Dérivation (Première techno) — Extremums",
    prompt: `On donne ci-dessous la courbe représentative de \\(f\\). Quel est l'extremum de \\(f\\) et en quelle valeur est-il atteint ?`,
    answer: `${type === "minimum" ? "Minimum" : "Maximum"} égal à ${beta}, atteint en \\(x = ${a}\\)`,
    options: shuffle([
      `${type === "minimum" ? "Minimum" : "Maximum"} égal à ${beta}, atteint en \\(x = ${a}\\)`,
      `${type === "minimum" ? "Maximum" : "Minimum"} égal à ${beta}, atteint en \\(x = ${a}\\)`,
      `${type === "minimum" ? "Minimum" : "Maximum"} égal à ${a}, atteint en \\(x = ${beta}\\)`,
    ]),
    steps: [{ type: "regle", text: `\\text{Le point le plus ${type === "minimum" ? "bas" : "haut"} de la courbe donne l'extremum : } ${beta} \\text{, atteint en } x = ${a}.` }],
    graph: { xMin: a - 5, xMax: a + 5, yMin: Math.min(beta, fn(a - 5), fn(a + 5)) - 2, yMax: Math.max(beta, fn(a - 5), fn(a + 5)) + 2, curves: [{ fn, label: "f" }], points: [{ x: a, y: beta, label: type === "minimum" ? "min" : "max" }] },
  };
}

// ---------- 9. Reconnaître une sécante d'une tangente ----------
function genReconnaitreSecanteTangenteQCM() {
  const cas = pick([
    { description: "Une droite qui coupe la courbe en deux points distincts A et B.", reponse: "Sécante", explication: "C'est une sécante : elle relie deux points distincts de la courbe." },
    { description: "La position limite des sécantes (AM) quand M se rapproche de A le long de la courbe.", reponse: "Tangente", explication: "C'est la tangente : elle est définie comme la position limite des sécantes lorsque le deuxième point se rapproche du premier." },
    { description: "Une droite dont le coefficient directeur est le taux de variation entre deux points de la courbe.", reponse: "Sécante", explication: "C'est une sécante : le taux de variation entre deux points est justement le coefficient directeur de la droite qui les relie." },
    { description: "Une droite dont le coefficient directeur est le nombre dérivé en un point.", reponse: "Tangente", explication: "C'est la tangente : le nombre dérivé en un point est par définition le coefficient directeur de la tangente en ce point." },
  ]);
  return {
    type: "qcm",
    chapter: "Dérivation (Première techno) — Sécantes et tangente",
    prompt: `« ${cas.description} » De quoi s'agit-il ?`,
    answer: cas.reponse,
    options: ["Sécante", "Tangente"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 10. Approximation du nombre dérivé via une sécante proche ----------
function genApproximationTauxVariationNumeric() {
  const a = randInt(-4, 4);
  const h = pick([0.1, 0.01, 0.5]);
  const fpa = nonZero(-5, 5);
  const fa = randInt(-6, 6);
  const faH = roundTo(fa + fpa * h, 4);
  const answer = roundTo((faH - fa) / h, 2);
  return {
    type: "numeric",
    chapter: "Dérivation (Première techno) — Approximation du nombre dérivé",
    prompt: `On donne \\(f(${a}) = ${fa}\\) et \\(f(${roundTo(a + h, 3)}) = ${fr(faH)}\\). Calcule le taux de variation \\(\\dfrac{f(${roundTo(a + h, 3)}) - f(${a})}{${fr(h)}}\\), qui approche \\(f'(${a})\\).`,
    answer,
    tolerance: 0.05,
    steps: [
      { type: "regle", text: "Le taux de variation entre a et a+h approche le nombre dérivé f'(a) lorsque h est petit." },
      { type: "resultat", text: `\\dfrac{${fr(faH)} - ${fa}}{${fr(h)}} = ${fr(answer)}` },
    ],
  };
}

const GENERATORS = [
  genTauxVariationNumeric,
  genNombreDeriveTangenteNumeric,
  genEquationTangenteQCM,
  genDeriveeReferenceQCM,
  genDeriveePolynomeNumeric,
  genDeriveeMultipleNumeric,
  genSigneDeriveeVariationQCM,
  genExtremumTableauVariationsQCM,
  genReconnaitreSecanteTangenteQCM,
  genApproximationTauxVariationNumeric,
];

const DIFFICULTY = {
  genTauxVariationNumeric: "facile",
  genDeriveeReferenceQCM: "facile",
  genSigneDeriveeVariationQCM: "facile",
  genReconnaitreSecanteTangenteQCM: "facile",
  genNombreDeriveTangenteNumeric: "standard",
  genDeriveeMultipleNumeric: "standard",
  genDeriveePolynomeNumeric: "standard",
  genApproximationTauxVariationNumeric: "standard",
  genEquationTangenteQCM: "expert",
  genExtremumTableauVariationsQCM: "expert",
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
    id: "derivation-premiere-techno",
    title: "Dérivation",
    description: "Sécantes, taux de variation, tangente et nombre dérivé, dérivée d'un polynôme de degré ≤ 3, sens de variation, extremums.",
    pourquoi: "La dérivée permet de savoir si une grandeur augmente ou diminue à un instant précis — indispensable pour optimiser un coût, une recette ou une production.",
    level: "premiere-techno",
    order: 4,
    cours: {
      mindMap: {
        title: "Dérivation",
        branches: [
          {
            title: "Sécante, taux de variation, tangente",
            items: [
              "Le taux de variation entre deux points est le coefficient directeur de la sécante qui les relie.",
              "Quand les deux points se rapprochent, la sécante « devient » la tangente : le nombre dérivé.",
              "Le taux de variation entre a et a+h, pour h très petit, donne une valeur approchée du nombre dérivé \\(f'(a)\\).",
            ],
          },
          {
            title: "Dérivées de référence",
            items: [
              "Pour un polynôme, on dérive chaque terme séparément puis on additionne (dérivée d'une somme = somme des dérivées).",
              "Dérivée de kf (un multiple d'une fonction) : on multiplie simplement la dérivée par k.",
              "Piège classique : dériver un polynôme terme à terme, sans oublier de baisser chaque exposant.",
            ],
            formula: "\\((ax^n)'=nax^{n-1}\\), \\((kf)'=kf'\\)",
          },
          {
            title: "Équation de la tangente",
            items: [
              "Il faut le nombre dérivé (pente) et un point de la courbe pour l'écrire.",
            ],
            formula: "\\(y=f'(a)(x-a)+f(a)\\)",
          },
          {
            title: "Signe de f' et sens de variation",
            items: [
              "\\(f'(x)>0\\) ⟹ f croissante ; \\(f'(x)<0\\) ⟹ f décroissante.",
              "En un extremum (maximum ou minimum), la tangente est horizontale : le signe de f' change en changeant de sens de part et d'autre.",
              "Piège classique très fréquent : le signe de f' donne le sens de variation, ce n'est pas le signe de f.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
