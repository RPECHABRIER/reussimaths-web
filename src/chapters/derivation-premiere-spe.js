// ---------------------------------------------------------------------------
// Chapitre : Dérivation (Première Spé)
// Ce fichier ne contient QUE du contenu (générateurs d'exercices + métadonnées).
// L'affichage (mode Classique/Jeu, pavé numérique, QCM, aide progressive) est
// géré par le composant générique <ChapterRunner /> pour tous les chapitres.
//
// Convention LaTeX : tout passage mathématique est entouré de \( ... \)
// (rendu ensuite en jolie notation par le composant <MathText />, voir
// src/components/MathText.jsx). Le reste du texte reste du français normal.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr() pour utiliser la virgule française — voir fr() ci-dessous.
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

// =========================== Générateurs paramétrés ===========================

// ---------- 1. Taux de variation entre deux points (à partir des images) ----------
function genTauxVariationImagesNumeric() {
  const xA = randInt(-8, 8);
  let xB = randInt(-8, 8);
  while (xB === xA) xB = randInt(-8, 8);
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const yA = a * xA + b;
  const yB = a * xB + b;
  return {
    type: "numeric",
    chapter: "Dérivation — Taux de variation",
    prompt: `Une fonction \\(f\\) vérifie \\(f(${xA}) = ${yA}\\) et \\(f(${xB}) = ${yB}\\). Calcule le taux de variation de \\(f\\) entre ${xA} et ${xB} (pente de la sécante).`,
    answer: a,
    steps: [{ type: "resultat", text: `\\dfrac{f(${xB}) - f(${xA})}{${xB} - (${xA})} = \\dfrac{${yB} - (${yA})}{${xB - xA}} = \\dfrac{${yB - yA}}{${xB - xA}} = ${a}` }],
  };
}

// ---------- 2. Taux de variation de la fonction carré entre a et a+h ----------
function genTauxVariationCarreNumeric() {
  const a = randInt(-8, 8);
  const h = nonZero(1, 5);
  const fA = a * a;
  const fAh = (a + h) * (a + h);
  const answer = (fAh - fA) / h;
  return {
    type: "numeric",
    chapter: "Dérivation — Taux de variation",
    prompt: `On considère la fonction carré \\(f(x) = x^2\\). Calcule le taux de variation de \\(f\\) entre \\(${a}\\) et \\(${a + h}\\) (c'est-à-dire \\(\\dfrac{f(${a}+${h}) - f(${a})}{${h}}\\)).`,
    answer,
    steps: [
      { type: "calcul", text: `f(${a}) = ${fA}, \\quad f(${a + h}) = ${fAh}` },
      { type: "resultat", text: `\\dfrac{${fAh} - ${fA}}{${h}} = \\dfrac{${fAh - fA}}{${h}} = ${answer}` },
    ],
  };
}

// ---------- 3. Nombre dérivé à partir de la formule de f' ----------
function genNombreDeriveNumeric() {
  const a2 = nonZero(-6, 6);
  const a1 = randInt(-9, 9);
  const x0 = randInt(-6, 6);
  const answer = 2 * a2 * x0 + a1;
  return {
    type: "numeric",
    chapter: "Dérivation — Nombre dérivé",
    prompt: `Une fonction \\(f\\) a pour fonction dérivée \\(f'(x) = ${2 * a2}x ${signedL(a1)}\\). Calcule le nombre dérivé \\(f'(${x0})\\).`,
    answer,
    steps: [{ type: "resultat", text: `f'(${x0}) = ${2 * a2} \\times ${x0} ${signedL(a1)} = ${answer}` }],
  };
}

// ---------- 4. Équation de la tangente (coefficient directeur) ----------
function genEquationTangenteNumeric() {
  const a = randInt(-8, 8);
  const fa = randInt(-10, 10);
  const fpa = nonZero(-6, 6);
  let x = randInt(-5, 5);
  while (x === a) x = randInt(-5, 5);
  const answer = fa + fpa * (x - a);
  return {
    type: "numeric",
    chapter: "Dérivation — Équation de la tangente",
    prompt: `On donne \\(f(${a}) = ${fa}\\) et \\(f'(${a}) = ${fpa}\\). La tangente à la courbe de \\(f\\) au point d'abscisse ${a} a pour équation \\(y = f(${a}) + f'(${a})(x - ${a})\\). Calcule l'ordonnée du point de cette tangente d'abscisse \\(x = ${x}\\).`,
    answer,
    steps: [{ type: "resultat", text: `y = ${fa} + ${fpa} \\times (${x} - ${a}) = ${fa} + ${fpa} \\times (${x - a}) = ${answer}` }],
  };
}

// ---------- 5. Approximation linéaire f(a+h) ≈ f(a) + f'(a)h ----------
function genApproximationLineaireNumeric() {
  const fa = randInt(-15, 15);
  const fpa = nonZero(-8, 8);
  const h = roundTo(pick([0.1, 0.2, 0.5, -0.1, -0.2]), 2);
  const answer = roundTo(fa + fpa * h, 3);
  return {
    type: "numeric",
    chapter: "Dérivation — Approximation linéaire",
    prompt: `On donne \\(f(a) = ${fa}\\) et \\(f'(a) = ${fpa}\\). En utilisant l'approximation linéaire \\(f(a + h) \\approx f(a) + f'(a) \\times h\\), donne une valeur approchée de \\(f(a + h)\\) pour \\(h = ${fr(h)}\\).`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "resultat", text: `f(a+h) \\approx ${fa} + ${fpa} \\times ${fr(h)} = ${fr(answer)}` }],
  };
}

// ---------- 6. Dérivée de x^n (formule) ----------
function genDeriveePuissanceFormuleQCM() {
  const n = pick([2, 3, 4, 5]);
  const correctRaw = `${n}x^{${n - 1}}`;
  const wrong1 = `x^{${n - 1}}`;
  const wrong2 = `${n}x^{${n}}`;
  const wrong3 = `${n - 1}x^{${n - 1}}`;
  const options = shuffle([correctRaw, wrong1, wrong2, wrong3]);
  return {
    type: "qcm",
    chapter: "Dérivation — Fonctions de référence",
    prompt: `Quelle est la fonction dérivée de \\(f(x) = x^{${n}}\\) ?`,
    answer: correctRaw,
    options,
    steps: [
      { type: "regle", text: `\\text{Pour } f(x) = x^n, \\text{ on a } f'(x) = nx^{n-1}.` },
      { type: "resultat", text: `f'(x) = ${correctRaw}` },
    ],
  };
}

// ---------- 7. Dérivée de la fonction inverse ----------
function genDeriveeInverseQCM() {
  const correctRaw = `-\\dfrac{1}{x^2}`;
  const options = shuffle([correctRaw, `\\dfrac{1}{x^2}`, `-\\dfrac{1}{x}`, `\\dfrac{-1}{2x}`]);
  return {
    type: "qcm",
    chapter: "Dérivation — Fonctions de référence",
    prompt: `Quelle est la fonction dérivée de la fonction inverse \\(f(x) = \\dfrac{1}{x}\\) ?`,
    answer: correctRaw,
    options,
    steps: [{ type: "regle", text: `\\text{C'est une formule de référence à connaître : } f'(x) = -\\dfrac{1}{x^2}.` }],
  };
}

// ---------- 8. Dérivée de la fonction racine carrée ----------
function genDeriveeRacineCarreeQCM() {
  const correctRaw = `\\dfrac{1}{2\\sqrt{x}}`;
  const options = shuffle([correctRaw, `\\dfrac{1}{\\sqrt{x}}`, `2\\sqrt{x}`, `\\dfrac{1}{2x}`]);
  return {
    type: "qcm",
    chapter: "Dérivation — Fonctions de référence",
    prompt: `Quelle est la fonction dérivée de la fonction racine carrée \\(f(x) = \\sqrt{x}\\), pour \\(x > 0\\) ?`,
    answer: correctRaw,
    options,
    steps: [{ type: "regle", text: `\\text{C'est une formule de référence à connaître : } f'(x) = \\dfrac{1}{2\\sqrt{x}}.` }],
  };
}

// ---------- 9. Dérivée d'une somme (fonction polynôme) ----------
function genDeriveeSommeNumeric() {
  const a2 = nonZero(-5, 5);
  const a1 = randInt(-8, 8);
  const x0 = randInt(-5, 5);
  const answer = 2 * a2 * x0 + a1;
  return {
    type: "numeric",
    chapter: "Dérivation — Opérations (somme)",
    prompt: `On considère \\(f(x) = ${a2}x^2 ${signedL(a1, "x")} + 7\\), somme de plusieurs fonctions dérivables. Calcule \\(f'(${x0})\\).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{On dérive terme à terme.}` },
      { type: "calcul", text: `f'(x) = ${2 * a2}x ${signedL(a1)}` },
      { type: "resultat", text: `f'(${x0}) = ${2 * a2} \\times ${x0} ${signedL(a1)} = ${answer}` },
    ],
  };
}

// ---------- 10. Formule de la dérivée d'un produit ----------
function genDeriveeProduitFormuleQCM() {
  const correctRaw = `u'v + uv'`;
  const options = shuffle([correctRaw, `u'v'`, `u'v - uv'`, `uv' - u'v`]);
  return {
    type: "qcm",
    chapter: "Dérivation — Opérations (produit)",
    prompt: `\\(u\\) et \\(v\\) sont deux fonctions dérivables. Quelle est la formule de la dérivée du produit \\(uv\\) ?`,
    answer: correctRaw,
    options,
    steps: [{ type: "regle", text: `\\text{C'est une formule de référence à connaître : } (uv)' = u'v + uv'.` }],
  };
}

// ---------- 11. Formule de la dérivée d'un quotient ----------
function genDeriveeQuotientFormuleQCM() {
  const correctRaw = `\\dfrac{u'v - uv'}{v^2}`;
  const options = shuffle([correctRaw, `\\dfrac{u'v + uv'}{v^2}`, `\\dfrac{u'v - uv'}{v}`, `\\dfrac{u' - v'}{v^2}`]);
  return {
    type: "qcm",
    chapter: "Dérivation — Opérations (quotient)",
    prompt: `\\(u\\) et \\(v\\) sont deux fonctions dérivables, avec \\(v\\) qui ne s'annule pas. Quelle est la formule de la dérivée du quotient \\(\\dfrac{u}{v}\\) ?`,
    answer: correctRaw,
    options,
    steps: [{ type: "regle", text: `\\text{C'est une formule de référence à connaître : } \\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2}.` }],
  };
}

// ---------- 12. Sens de variation depuis le signe de f' ----------
function genSensVariationDeriveeQCM() {
  const positive = Math.random() < 0.5;
  const nomFonction = pick(["f", "g", "h"]);
  return {
    type: "qcm",
    chapter: "Dérivation — Signe de f' et variations",
    prompt: `Sur un intervalle \\(I\\), la fonction dérivée de ${nomFonction} vérifie \\(${nomFonction}'(x) ${positive ? ">" : "<"} 0\\). Quel est le sens de variation de ${nomFonction} sur \\(I\\) ?`,
    answer: positive ? "croissante" : "décroissante",
    options: ["croissante", "décroissante"],
    steps: [{ type: "regle", text: positive ? `\\text{f' positive} \\Rightarrow \\text{f croissante.}` : `\\text{f' négative} \\Rightarrow \\text{f décroissante.}` }],
  };
}

// ---------- 13. Extremum et tangente horizontale ----------
function genExtremumTangenteHorizontaleQCM() {
  const nomFonction = pick(["f", "g", "h"]);
  return {
    type: "qcm",
    chapter: "Dérivation — Extremum",
    prompt: `${nomFonction} admet un extremum local en \\(x = a\\) et est dérivable en ce point. Que peut-on dire de \\(${nomFonction}'(a)\\) ?`,
    answer: `${nomFonction}'(a) = 0`,
    options: [`${nomFonction}'(a) = 0`, `${nomFonction}'(a) > 0`, `${nomFonction}'(a) < 0`],
    steps: [{ type: "regle", text: `\\text{En un extremum local, la tangente est horizontale : } ${nomFonction}'(a) = 0.` }],
  };
}

// ---------- 14. Non-dérivabilité de la valeur absolue en 0 ----------
function genVraiFauxDerivationQCM() {
  const cas = pick([
    {
      description: "La fonction valeur absolue n'est pas dérivable en 0.",
      reponse: "Vrai",
      explication: "\\text{En 0, la courbe de la valeur absolue forme un \\textit{angle} (un point anguleux) : elle n'admet pas de tangente unique, donc pas de nombre dérivé en ce point.}",
    },
    {
      description: "La fonction racine carrée est dérivable en 0.",
      reponse: "Faux",
      explication: "\\text{En 0, la tangente à la courbe de la racine carrée est verticale : le taux de variation tend vers } +\\infty, \\text{ il n'y a donc pas de nombre dérivé fini en 0.}",
    },
    {
      description: "Si f'(a) existe, la courbe de f admet une tangente au point d'abscisse a.",
      reponse: "Vrai",
      explication: "\\text{C'est la définition même du nombre dérivé : } f'(a) \\text{ est précisément le coefficient directeur de cette tangente.}",
    },
    {
      description: "La dérivée d'une fonction constante est cette constante elle-même.",
      reponse: "Faux",
      explication: "\\text{La dérivée d'une fonction constante est toujours } \\textbf{nulle}, \\text{ pas égale à la constante : si } f(x) = 7, \\text{ alors } f'(x) = 0 \\text{ (et non } 7\\text{).}",
    },
  ]);
  return {
    type: "qcm",
    chapter: "Dérivation — Vrai ou faux",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 15. Pente d'une sécante (formulation géométrique) ----------
function genPenteSecanteNumeric() {
  const xA = randInt(-9, 9);
  let xB = randInt(-9, 9);
  while (xB === xA) xB = randInt(-9, 9);
  const yA = randInt(-12, 12);
  const yB = randInt(-12, 12);
  const answer = roundTo((yB - yA) / (xB - xA), 3);
  return {
    type: "numeric",
    chapter: "Dérivation — Taux de variation",
    prompt: `On donne ci-dessous deux points \\(A\\) et \\(B\\) d'une courbe représentative d'une fonction \\(f\\). Calcule la pente (coefficient directeur) de la sécante \\((AB)\\) (valeur arrondie au millième si besoin).`,
    answer,
    tolerance: 0.002,
    steps: [{ type: "resultat", text: `\\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{${yB} - (${yA})}{${xB} - (${xA})} = \\dfrac{${yB - yA}}{${xB - xA}} \\approx ${fr(answer)}` }],
    graph: {
      xMin: Math.min(xA, xB) - 2,
      xMax: Math.max(xA, xB) + 2,
      yMin: Math.min(yA, yB) - 2,
      yMax: Math.max(yA, yB) + 2,
      lines: [{ a: roundTo((yB - yA) / (xB - xA), 4), b: roundTo(yA - ((yB - yA) / (xB - xA)) * xA, 4), label: "(AB)" }],
      points: [
        { x: xA, y: yA, label: "A" },
        { x: xB, y: yB, label: "B" },
      ],
    },
  };
}

const GENERATORS = [
  genTauxVariationImagesNumeric,
  genTauxVariationCarreNumeric,
  genNombreDeriveNumeric,
  genEquationTangenteNumeric,
  genApproximationLineaireNumeric,
  genDeriveePuissanceFormuleQCM,
  genDeriveeInverseQCM,
  genDeriveeRacineCarreeQCM,
  genDeriveeSommeNumeric,
  genDeriveeProduitFormuleQCM,
  genDeriveeQuotientFormuleQCM,
  genSensVariationDeriveeQCM,
  genExtremumTangenteHorizontaleQCM,
  genVraiFauxDerivationQCM,
  genPenteSecanteNumeric,
];

const DIFFICULTY = {
  genTauxVariationCarreNumeric: "facile",
  genNombreDeriveNumeric: "facile",
  genDeriveePuissanceFormuleQCM: "facile",
  genDeriveeInverseQCM: "facile",
  genDeriveeRacineCarreeQCM: "facile",
  genTauxVariationImagesNumeric: "standard",
  genEquationTangenteNumeric: "standard",
  genDeriveeSommeNumeric: "standard",
  genDeriveeProduitFormuleQCM: "standard",
  genSensVariationDeriveeQCM: "standard",
  genExtremumTangenteHorizontaleQCM: "standard",
  genPenteSecanteNumeric: "standard",
  genApproximationLineaireNumeric: "expert",
  genDeriveeQuotientFormuleQCM: "expert",
  genVraiFauxDerivationQCM: "expert",
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
    id: "derivation-premiere-spe",
    title: "Dérivation",
    description: "Taux de variation, nombre dérivé, tangente, approximation linéaire, fonctions dérivées de référence et opérations.",
    pourquoi: "Le nombre dérivé mesure la vitesse instantanée d'un phénomène — la notion centrale pour étudier comment une quantité varie, en sciences comme en économie.",
    level: "premiere-spe",
    order: 4,
  },
  generate,
};
