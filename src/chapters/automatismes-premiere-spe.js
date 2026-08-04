// ---------------------------------------------------------------------------
// Chapitre : Automatismes (Première Spé) — gratuit, freemium (5
// questions/jour sans abonnement, illimité avec abonnement). Regroupe les
// mini-exercices de calcul rapide en tête de chaque chapitre du programme de
// Première (enseignement de spécialité mathématiques, voie générale), un
// thème par chapitre du programme (voir THEMES ci-dessous) ; sera enrichi au
// fur et à mesure que les autres chapitres de Première Spé seront écrits —
// voir automatismes-terminale-spe.js pour le même principe en Terminale.
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

// Retourne un fragment LaTeX signé, ex: signedL(-3, "x") -> "- 3x"
const signedL = (n, withVar = "") => (n >= 0 ? `+ ${n}${withVar}` : `- ${Math.abs(n)}${withVar}`);

// =========================== Chapitre : Second degré ===========================
// (Automatismes de calcul mental : discriminant, nombre de solutions, sommet.)

// ---------- 1. Calcul mental du discriminant ----------
function genAutoDiscriminantMental() {
  const a = nonZero(1, 4);
  const b = randInt(-6, 6);
  const c = randInt(-6, 6);
  const delta = b * b - 4 * a * c;
  return {
    type: "numeric",
    chapter: "Automatismes — Second degré",
    prompt: `Calcule le discriminant de \\(${a}x^2 ${signedL(b, "x")} ${signedL(c)} = 0\\).`,
    answer: delta,
    steps: [`\\Delta = ${b}^2 - 4 \\times ${a} \\times ${c} = ${delta}`],
  };
}

// ---------- 2. Nombre de solutions selon le signe de Δ (mental) ----------
function genAutoNombreSolutionsMental() {
  const delta = pick([-1, 0, 1]) * randInt(1, 20);
  const correct = delta > 0 ? "Deux solutions" : delta === 0 ? "Une solution" : "Aucune solution";
  return {
    type: "qcm",
    chapter: "Automatismes — Second degré",
    prompt: `Une équation du second degré a pour discriminant \\(\\Delta = ${delta}\\). Combien admet-elle de solutions réelles ?`,
    answer: correct,
    options: ["Aucune solution", "Une solution", "Deux solutions"],
    steps: [correct],
  };
}

// ---------- 3. Signe d'un trinôme à l'extérieur des racines (mental) ----------
function genAutoSigneTrinomeMental() {
  const a = pick([-3, -2, -1, 1, 2, 3]);
  const signe = a > 0 ? "positif" : "négatif";
  return {
    type: "qcm",
    chapter: "Automatismes — Second degré",
    prompt: `Un trinôme du second degré \\(ax^2 + bx + c\\) a pour coefficient \\(a = ${a}\\) et admet deux racines distinctes. Quel est son signe à l'extérieur des racines ?`,
    answer: signe,
    options: ["positif", "négatif"],
    steps: [`\\text{Le trinôme est du signe de } a \\text{ à l'extérieur des racines : ${signe}.}`],
  };
}

// ---------- 4. Abscisse du sommet (mental) ----------
function genAutoAbscisseSommetMental() {
  const a = nonZero(-4, 4);
  const b = randInt(-12, 12);
  const answer = roundTo(-b / (2 * a), 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Second degré",
    prompt: `Calcule l'abscisse du sommet de la parabole d'équation \\(y = ${a}x^2 ${signedL(b, "x")} + 5\\) (formule \\(\\alpha = \\dfrac{-b}{2a}\\)).`,
    answer,
    tolerance: 0.01,
    steps: [`\\alpha = \\dfrac{-(${b})}{2 \\times ${a}} = ${fr(answer)}`],
  };
}

// ---------- 5. Vrai ou faux sur le second degré (mental) ----------
function genAutoVraiFauxSecondDegreMental() {
  const cas = pick([
    { description: "Si \\(\\Delta < 0\\), l'équation \\(ax^2+bx+c=0\\) n'a aucune solution réelle.", reponse: "Vrai" },
    { description: "Un trinôme du second degré change de signe deux fois si \\(\\Delta > 0\\).", reponse: "Vrai" },
    { description: "Le sommet d'une parabole a toujours une abscisse positive.", reponse: "Faux" },
    { description: "Si \\(\\Delta = 0\\), l'équation a exactement deux solutions distinctes.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Second degré",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const CH_SECOND_DEGRE = [
  genAutoDiscriminantMental,
  genAutoNombreSolutionsMental,
  genAutoSigneTrinomeMental,
  genAutoAbscisseSommetMental,
  genAutoVraiFauxSecondDegreMental,
];

// =========================== Chapitre : Suites numériques ===========================
// (Automatismes de calcul mental : terme suivant, raison, sens de variation.)

// ---------- 1. Terme suivant d'une suite arithmétique (mental) ----------
function genAutoTermeSuivantArithmetiqueMental() {
  const u = randInt(-20, 20);
  const r = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Suites numériques",
    prompt: `\\((u_n)\\) est une suite arithmétique de raison \\(r = ${r}\\). Sachant que \\(u_n = ${u}\\), calcule \\(u_{n+1}\\).`,
    answer: u + r,
    steps: [`u_{n+1} = u_n + r = ${u} ${signedL(r)} = ${u + r}`],
  };
}

// ---------- 2. Terme suivant d'une suite géométrique (mental) ----------
function genAutoTermeSuivantGeometriqueMental() {
  const u = pick([1, 2, 3, 4, 5, -1, -2, -3, -4]);
  const q = pick([2, 3, -2]);
  return {
    type: "numeric",
    chapter: "Automatismes — Suites numériques",
    prompt: `\\((u_n)\\) est une suite géométrique de raison \\(q = ${q}\\). Sachant que \\(u_n = ${u}\\), calcule \\(u_{n+1}\\).`,
    answer: u * q,
    steps: [`u_{n+1} = q \\times u_n = ${q} \\times ${u} = ${u * q}`],
  };
}

// ---------- 3. Reconnaître une évolution arithmétique ou géométrique (mental) ----------
function genAutoTypeSuiteMental() {
  const cas = pick([
    { description: "on ajoute toujours le même nombre", reponse: "arithmétique" },
    { description: "on multiplie toujours par le même nombre", reponse: "géométrique" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Suites numériques",
    prompt: `Pour passer d'un terme au suivant, ${cas.description}. De quel type de suite s'agit-il ?`,
    answer: cas.reponse,
    options: ["arithmétique", "géométrique"],
    steps: [cas.reponse],
  };
}

// ---------- 4. Sens de variation express (mental) ----------
function genAutoSensVariationExpressMental() {
  const r = nonZero(-9, 9);
  const answer = r > 0 ? "croissante" : "décroissante";
  return {
    type: "qcm",
    chapter: "Automatismes — Suites numériques",
    prompt: `Une suite arithmétique a pour raison \\(r = ${r}\\). Est-elle croissante ou décroissante ?`,
    answer,
    options: ["croissante", "décroissante"],
    steps: [answer],
  };
}

// ---------- 5. Vrai ou faux sur les suites (mental) ----------
function genAutoVraiFauxSuitesMental() {
  const cas = pick([
    { description: "Une suite géométrique de raison \\(q = 1\\) est constante.", reponse: "Vrai" },
    { description: "Une suite arithmétique de raison nulle est constante.", reponse: "Vrai" },
    { description: "Une suite géométrique à termes positifs de raison \\(q > 1\\) est décroissante.", reponse: "Faux" },
    { description: "Dans une suite arithmétique, on passe d'un terme au suivant en multipliant par la raison.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Suites numériques",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const CH_SUITES_NUMERIQUES = [
  genAutoTermeSuivantArithmetiqueMental,
  genAutoTermeSuivantGeometriqueMental,
  genAutoTypeSuiteMental,
  genAutoSensVariationExpressMental,
  genAutoVraiFauxSuitesMental,
];

// =========================== Chapitre : Dérivation ===========================
// (Automatismes de calcul mental : taux de variation, dérivées usuelles, signe de f'.)

// ---------- 1. Taux de variation d'une fonction affine (mental) ----------
function genAutoTauxVariationAfineMental() {
  const a = nonZero(-8, 8);
  const b = randInt(-10, 10);
  return {
    type: "numeric",
    chapter: "Automatismes — Dérivation",
    prompt: `On considère \\(f(x) = ${a}x ${signedL(b)}\\). Quel est le taux de variation de \\(f\\) entre deux points quelconques ?`,
    answer: a,
    steps: [`\\text{Pour une fonction affine } f(x) = ax + b, \\text{ le taux de variation est toujours égal à } a = ${a}.`],
  };
}

// ---------- 2. Dérivée de la fonction carré en un point (mental) ----------
function genAutoDeriveeCarreMental() {
  const x0 = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Dérivation",
    prompt: `La fonction carré a pour dérivée \\(f'(x) = 2x\\). Calcule \\(f'(${x0})\\).`,
    answer: 2 * x0,
    steps: [`f'(${x0}) = 2 \\times ${x0} = ${2 * x0}`],
  };
}

// ---------- 3. Signe de f' et sens de variation (mental) ----------
function genAutoSigneDeriveeMental() {
  const positive = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Automatismes — Dérivation",
    prompt: `Sur un intervalle, \\(f'(x) ${positive ? ">" : "<"} 0\\). Quel est le sens de variation de \\(f\\) ?`,
    answer: positive ? "croissante" : "décroissante",
    options: ["croissante", "décroissante"],
    steps: [positive ? "croissante" : "décroissante"],
  };
}

// ---------- 4. Nombre dérivé nul en un extremum (mental) ----------
function genAutoExtremumMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Dérivation",
    prompt: `\\(f\\) est dérivable et admet un minimum local en \\(x = a\\). Que vaut \\(f'(a)\\) ?`,
    answer: "0",
    options: ["0", "1", "Cela dépend de f"],
    steps: [`\\text{En un extremum local d'une fonction dérivable, } f'(a) = 0.`],
  };
}

// ---------- 5. Vrai ou faux sur la dérivation (mental) ----------
function genAutoVraiFauxDerivationExpressMental() {
  const cas = pick([
    { description: "La dérivée d'une constante est nulle.", reponse: "Vrai" },
    { description: "La dérivée de la fonction carré est la fonction cube.", reponse: "Faux" },
    { description: "La fonction valeur absolue est dérivable en 0.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Dérivation",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const CH_DERIVATION = [
  genAutoTauxVariationAfineMental,
  genAutoDeriveeCarreMental,
  genAutoSigneDeriveeMental,
  genAutoExtremumMental,
  genAutoVraiFauxDerivationExpressMental,
];

// =========================== Chapitre : Variations et courbes représentatives ===========================
// (Automatismes de calcul mental : parité, signe de f', allure de la parabole.)

// ---------- 1. Parité d'une fonction simple (mental) ----------
function genAutoPariteMental() {
  const cas = pick([
    { description: "\\(f(x) = x^2\\)", reponse: "paire" },
    { description: "\\(f(x) = x^3\\)", reponse: "impaire" },
    { description: "\\(f(x) = 5\\)", reponse: "paire" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Variations et courbes",
    prompt: `La fonction ${cas.description} est-elle paire ou impaire ?`,
    answer: cas.reponse,
    options: ["paire", "impaire"],
    steps: [cas.reponse],
  };
}

// ---------- 2. Signe de f' et sens de variation (mental) ----------
function genAutoSigneDeriveeExpressMental() {
  const positive = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Automatismes — Variations et courbes",
    prompt: `Sur un intervalle, \\(f'(x) ${positive ? ">" : "<"} 0\\). f est-elle croissante ou décroissante sur cet intervalle ?`,
    answer: positive ? "croissante" : "décroissante",
    options: ["croissante", "décroissante"],
    steps: [positive ? "croissante" : "décroissante"],
  };
}

// ---------- 3. Allure de la parabole (mental) ----------
function genAutoAllureParaboleMental() {
  const a = nonZero(-9, 9);
  const reponse = a > 0 ? "un minimum" : "un maximum";
  return {
    type: "qcm",
    chapter: "Automatismes — Variations et courbes",
    prompt: `Pour \\(f(x) = ${a}x^2 + bx + c\\), la parabole admet-elle un minimum ou un maximum ?`,
    answer: reponse,
    options: ["un minimum", "un maximum"],
    steps: [reponse],
  };
}

// ---------- 4. Extremum et dérivée nulle (mental) ----------
function genAutoExtremumExpressMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Variations et courbes",
    prompt: `f est dérivable et admet un extremum local en \\(x = a\\). Que vaut \\(f'(a)\\) ?`,
    answer: "0",
    options: ["0", "1", "Cela dépend de f"],
    steps: [`f'(a) = 0`],
  };
}

// ---------- 5. Vrai ou faux express (mental) ----------
function genAutoVraiFauxVariationsExpressMental() {
  const cas = pick([
    { description: "La courbe d'une fonction impaire est symétrique par rapport à l'origine.", reponse: "Vrai" },
    { description: "Une fonction dont la dérivée est nulle sur un intervalle est constante sur cet intervalle.", reponse: "Vrai" },
    { description: "Une parabole avec \\(a < 0\\) admet un minimum.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Variations et courbes",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const CH_VARIATIONS_COURBES = [
  genAutoPariteMental,
  genAutoSigneDeriveeExpressMental,
  genAutoAllureParaboleMental,
  genAutoExtremumExpressMental,
  genAutoVraiFauxVariationsExpressMental,
];

// =========================== Chapitre : Fonction exponentielle ===========================
// (Automatismes de calcul mental : propriétés algébriques, signe, dérivée.)

// ---------- 1. Produit de deux exponentielles (mental) ----------
function genAutoProduitExponentiellesMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Fonction exponentielle",
    prompt: `Simplifie \\(e^{${a}} \\times e^{${b}}\\) sous la forme \\(e^{k}\\). Donne la valeur de \\(k\\).`,
    answer: a + b,
    steps: [`k = ${a} + ${b} = ${a + b}`],
  };
}

// ---------- 2. Signe de l'exponentielle (mental) ----------
function genAutoSigneExponentielleMental() {
  const x = randInt(-15, 15);
  return {
    type: "qcm",
    chapter: "Automatismes — Fonction exponentielle",
    prompt: `\\(e^{${x}}\\) est-il positif ou négatif ?`,
    answer: "positif",
    options: ["positif", "négatif"],
    steps: [`\\text{La fonction exponentielle est toujours strictement positive.}`],
  };
}

// ---------- 3. Sens de variation (mental) ----------
function genAutoSensVariationExpMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Fonction exponentielle",
    prompt: `La fonction exponentielle est-elle croissante ou décroissante sur \\(\\mathbb{R}\\) ?`,
    answer: "croissante",
    options: ["croissante", "décroissante"],
    steps: [`\\text{croissante}`],
  };
}

// ---------- 4. Dérivée de t ↦ e^{at} (mental) ----------
function genAutoDeriveeExponentielleMental() {
  let a = nonZero(-6, 6);
  if (a === 1 || a === -1) a = 3;
  return {
    type: "numeric",
    chapter: "Automatismes — Fonction exponentielle",
    prompt: `La dérivée de \\(t \\mapsto e^{${a}t}\\) est de la forme \\(k \\, e^{${a}t}\\). Donne la valeur de \\(k\\).`,
    answer: a,
    steps: [`k = ${a}`],
  };
}

// ---------- 5. Vrai ou faux express (mental) ----------
function genAutoVraiFauxExpMental() {
  const cas = pick([
    { description: "\\(e^0 = 1\\)", reponse: "Vrai" },
    { description: "\\(e^{-x}\\) peut être négatif pour certaines valeurs de x.", reponse: "Faux" },
    { description: "La fonction exponentielle est strictement croissante sur R.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Fonction exponentielle",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const CH_FONCTION_EXPONENTIELLE = [
  genAutoProduitExponentiellesMental,
  genAutoSigneExponentielleMental,
  genAutoSensVariationExpMental,
  genAutoDeriveeExponentielleMental,
  genAutoVraiFauxExpMental,
];

// =========================== Chapitre : Trigonométrie ===========================
// (Automatismes de calcul mental : valeurs remarquables, angles associés.)

// ---------- 1. Valeur remarquable du cosinus (mental) ----------
function genAutoValeurCosinusMental() {
  const cas = pick([
    { label: "0", valeur: "1" },
    { label: "\\dfrac{\\pi}{3}", valeur: "\\dfrac{1}{2}" },
    { label: "\\dfrac{\\pi}{2}", valeur: "0" },
    { label: "\\pi", valeur: "-1" },
  ]);
  const distracteurs = ["1", "0", "-1", "\\dfrac{1}{2}"].filter((v) => v !== cas.valeur);
  return {
    type: "qcm",
    chapter: "Automatismes — Trigonométrie",
    prompt: `Quelle est la valeur de \\(\\cos\\left(${cas.label}\\right)\\) ?`,
    answer: cas.valeur,
    options: shuffle([cas.valeur, ...shuffle(distracteurs).slice(0, 2)]),
    steps: [`\\cos\\left(${cas.label}\\right) = ${cas.valeur}`],
  };
}

// ---------- 2. Valeur remarquable du sinus (mental) ----------
function genAutoValeurSinusMental() {
  const cas = pick([
    { label: "0", valeur: "0" },
    { label: "\\dfrac{\\pi}{6}", valeur: "\\dfrac{1}{2}" },
    { label: "\\dfrac{\\pi}{2}", valeur: "1" },
    { label: "\\pi", valeur: "0" },
  ]);
  const distracteurs = ["1", "0", "\\dfrac{1}{2}", "-1"].filter((v) => v !== cas.valeur);
  return {
    type: "qcm",
    chapter: "Automatismes — Trigonométrie",
    prompt: `Quelle est la valeur de \\(\\sin\\left(${cas.label}\\right)\\) ?`,
    answer: cas.valeur,
    options: shuffle([cas.valeur, ...shuffle(distracteurs).slice(0, 2)]),
    steps: [`\\sin\\left(${cas.label}\\right) = ${cas.valeur}`],
  };
}

// ---------- 3. Parité du cosinus (mental) ----------
function genAutoPariteCosinusMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Trigonométrie",
    prompt: `La fonction cosinus est-elle paire ou impaire ?`,
    answer: "paire",
    options: ["paire", "impaire"],
    steps: [`\\cos(-x) = \\cos(x)`],
  };
}

// ---------- 4. Imparité du sinus (mental) ----------
function genAutoImpariteSinusMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Trigonométrie",
    prompt: `La fonction sinus est-elle paire ou impaire ?`,
    answer: "impaire",
    options: ["paire", "impaire"],
    steps: [`\\sin(-x) = -\\sin(x)`],
  };
}

// ---------- 5. Signe selon le quadrant (mental) ----------
function genAutoSigneQuadrantMental() {
  const cas = pick([
    { description: "\\(x\\) appartient au 1er quadrant", reponse: "positifs" },
    { description: "\\(x\\) appartient au 3e quadrant", reponse: "négatifs" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Trigonométrie",
    prompt: `Si ${cas.description}, \\(\\cos(x)\\) et \\(\\sin(x)\\) sont-ils positifs ou négatifs ?`,
    answer: cas.reponse,
    options: ["positifs", "négatifs"],
    steps: [cas.reponse],
  };
}

const CH_TRIGONOMETRIE = [
  genAutoValeurCosinusMental,
  genAutoValeurSinusMental,
  genAutoPariteCosinusMental,
  genAutoImpariteSinusMental,
  genAutoSigneQuadrantMental,
];

// =========================== Chapitre : Calcul vectoriel et produit scalaire ===========================
// (Automatismes de calcul mental : produit scalaire, orthogonalité, normes.)

// ---------- 1. Produit scalaire à partir des coordonnées (mental) ----------
function genAutoProduitScalaireMental() {
  const x1 = randInt(-8, 8);
  const y1 = randInt(-8, 8);
  const x2 = randInt(-8, 8);
  const y2 = randInt(-8, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Produit scalaire",
    prompt: `\\(\\vec{u}(${x1} ; ${y1})\\), \\(\\vec{v}(${x2} ; ${y2})\\). Calcule \\(\\vec{u} \\cdot \\vec{v}\\).`,
    answer: x1 * x2 + y1 * y2,
    steps: [`\\vec{u} \\cdot \\vec{v} = ${x1} \\times ${x2} + ${y1} \\times ${y2} = ${x1 * x2 + y1 * y2}`],
  };
}

// ---------- 2. Produit scalaire d'un vecteur avec lui-même (mental) ----------
function genAutoProduitAvecLuiMemeMental() {
  const norme = randInt(2, 12);
  return {
    type: "numeric",
    chapter: "Automatismes — Produit scalaire",
    prompt: `\\(\\|\\vec{u}\\| = ${norme}\\). Calcule \\(\\vec{u} \\cdot \\vec{u}\\).`,
    answer: norme * norme,
    steps: [`\\vec{u} \\cdot \\vec{u} = \\|\\vec{u}\\|^2 = ${norme * norme}`],
  };
}

// ---------- 3. Orthogonalité express (mental) ----------
function genAutoOrthogonaliteMental() {
  const produit = pick([0, nonZero(-9, 9)]);
  const reponse = produit === 0 ? "orthogonaux" : "non orthogonaux";
  return {
    type: "qcm",
    chapter: "Automatismes — Produit scalaire",
    prompt: `\\(\\vec{u} \\cdot \\vec{v} = ${produit}\\). Les vecteurs \\(\\vec{u}\\) et \\(\\vec{v}\\) sont-ils orthogonaux ?`,
    answer: reponse,
    options: ["orthogonaux", "non orthogonaux"],
    steps: [reponse],
  };
}

// ---------- 4. Symétrie du produit scalaire (mental) ----------
function genAutoSymetrieMental() {
  const uv = randInt(-15, 15);
  return {
    type: "numeric",
    chapter: "Automatismes — Produit scalaire",
    prompt: `\\(\\vec{v} \\cdot \\vec{u} = ${uv}\\). Calcule \\(\\vec{u} \\cdot \\vec{v}\\).`,
    answer: uv,
    steps: [`\\vec{u} \\cdot \\vec{v} = \\vec{v} \\cdot \\vec{u} = ${uv}`],
  };
}

// ---------- 5. Vrai ou faux express (mental) ----------
function genAutoVraiFauxProduitScalaireMental() {
  const cas = pick([
    { description: "Deux vecteurs orthogonaux ont un produit scalaire nul.", reponse: "Vrai" },
    { description: "Le produit scalaire de deux vecteurs est toujours positif.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Produit scalaire",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const CH_PRODUIT_SCALAIRE = [
  genAutoProduitScalaireMental,
  genAutoProduitAvecLuiMemeMental,
  genAutoOrthogonaliteMental,
  genAutoSymetrieMental,
  genAutoVraiFauxProduitScalaireMental,
];

// =========================== Chapitre : Géométrie repérée ===========================
// (Automatismes de calcul mental : vecteur normal, cercle, projection.)

// ---------- 1. Lire un vecteur normal (mental) ----------
function genAutoVecteurNormalMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie repérée",
    prompt: `La droite \\(d\\) a pour équation \\(${a}x ${signedL(b, "y")} ${signedL(c)} = 0\\). Donne l'ordonnée du vecteur normal \\((${a} ; b)\\).`,
    answer: b,
    steps: [`b = ${b}`],
  };
}

// ---------- 2. Rayon au carré d'un cercle (mental) ----------
function genAutoRayonCarreMental() {
  const r = randInt(2, 12);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie repérée",
    prompt: `Un cercle a pour rayon \\(r = ${r}\\). Donne la valeur de \\(r^2\\), utilisée dans son équation.`,
    answer: r * r,
    steps: [`r^2 = ${r}^2 = ${r * r}`],
  };
}

// ---------- 3. Projection sur une droite horizontale (mental) ----------
function genAutoProjectionHorizontaleMental() {
  const k = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie repérée",
    prompt: `\\(d\\) est la droite d'équation \\(y = ${k}\\). Quelle est l'ordonnée du projeté orthogonal de n'importe quel point sur \\(d\\) ?`,
    answer: k,
    steps: [`y_H = ${k}`],
  };
}

// ---------- 4. Vecteur normal depuis un vecteur directeur (mental) ----------
function genAutoNormalDepuisDirecteurMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie repérée",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\) dirige une droite \\(d\\). Un vecteur normal à \\(d\\) est \\((-${b} ; k)\\). Donne la valeur de \\(k\\).`,
    answer: a,
    steps: [`k = ${a}`],
  };
}

// ---------- 5. Vrai ou faux express (mental) ----------
function genAutoVraiFauxGeometrieRepereeMental() {
  const cas = pick([
    { description: "Le vecteur (a ; b) est normal à la droite d'équation ax + by + c = 0.", reponse: "Vrai" },
    { description: "Un cercle d'équation (x-a)² + (y-b)² = k existe toujours, quel que soit k.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Géométrie repérée",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const CH_GEOMETRIE_REPEREE = [
  genAutoVecteurNormalMental,
  genAutoRayonCarreMental,
  genAutoProjectionHorizontaleMental,
  genAutoNormalDepuisDirecteurMental,
  genAutoVraiFauxGeometrieRepereeMental,
];

// =========================== Chapitre : Probabilités conditionnelles et indépendance ===========================
// (Automatismes de calcul mental : indépendance, arbres, Bernoulli.)

// ---------- 1. Indépendance : calcul de P(A ∩ B) (mental) ----------
function genAutoIntersectionIndependantsMental() {
  const pA = pick([0.2, 0.3, 0.5]);
  const pB = pick([0.1, 0.4, 0.5]);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités conditionnelles",
    prompt: `A et B sont indépendants, avec \\(P(A) = ${fr(pA)}\\) et \\(P(B) = ${fr(pB)}\\). Calcule \\(P(A \\cap B)\\).`,
    answer: roundTo(pA * pB, 4),
    tolerance: 0.0005,
    steps: [`P(A \\cap B) = ${fr(pA)} \\times ${fr(pB)} = ${fr(roundTo(pA * pB, 4))}`],
  };
}

// ---------- 2. Partition : probabilité manquante (mental) ----------
function genAutoPartitionManquanteMental() {
  const p1 = pick([0.2, 0.3, 0.4]);
  const p2 = pick([0.1, 0.2, 0.3]);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités conditionnelles",
    prompt: `\\(A_1, A_2, A_3\\) forment une partition de l'univers. \\(P(A_1) = ${fr(p1)}\\), \\(P(A_2) = ${fr(p2)}\\). Calcule \\(P(A_3)\\).`,
    answer: roundTo(1 - p1 - p2, 4),
    tolerance: 0.0005,
    steps: [`P(A_3) = 1 - ${fr(p1)} - ${fr(p2)} = ${fr(roundTo(1 - p1 - p2, 4))}`],
  };
}

// ---------- 3. Arbre : probabilité d'une branche (mental) ----------
function genAutoBrancheArbreMental() {
  const p1 = pick([0.2, 0.4, 0.5, 0.6]);
  const p2 = pick([0.25, 0.5, 0.75]);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités conditionnelles",
    prompt: `Deux épreuves indépendantes de probabilités de succès \\(${fr(p1)}\\) et \\(${fr(p2)}\\). Calcule la probabilité des deux succès.`,
    answer: roundTo(p1 * p2, 4),
    tolerance: 0.0005,
    steps: [`${fr(p1)} \\times ${fr(p2)} = ${fr(roundTo(p1 * p2, 4))}`],
  };
}

// ---------- 4. Bernoulli : n succès consécutifs (mental) ----------
function genAutoBernoulliMental() {
  const p = pick([0.2, 0.5, 0.4]);
  const n = randInt(2, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités conditionnelles",
    prompt: `On répète \\(${n}\\) fois une épreuve de Bernoulli indépendante de probabilité de succès \\(p = ${fr(p)}\\). Calcule la probabilité d'obtenir \\(${n}\\) succès.`,
    answer: roundTo(p ** n, 4),
    tolerance: 0.0005,
    steps: [`p^{${n}} = ${fr(p)}^{${n}} = ${fr(roundTo(p ** n, 4))}`],
  };
}

// ---------- 5. Vrai ou faux express (mental) ----------
function genAutoVraiFauxIndependanceMental() {
  const cas = pick([
    { description: "Si A et B sont indépendants, P(A ∩ B) = P(A) × P(B).", reponse: "Vrai" },
    { description: "La somme des probabilités d'une partition de l'univers vaut 1.", reponse: "Vrai" },
    { description: "Deux évènements incompatibles sont toujours indépendants.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Probabilités conditionnelles",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const CH_PROBABILITES_CONDITIONNELLES = [
  genAutoIntersectionIndependantsMental,
  genAutoPartitionManquanteMental,
  genAutoBrancheArbreMental,
  genAutoBernoulliMental,
  genAutoVraiFauxIndependanceMental,
];

// =========================== Chapitre : Variables aléatoires réelles ===========================
// (Automatismes de calcul mental : espérance, variance, écart-type.)

// ---------- 1. Espérance simple (mental) ----------
function genAutoEsperanceSimpleMental() {
  const x1 = randInt(-6, 6);
  const x2 = randInt(-6, 6);
  const p1 = pick([0.2, 0.3, 0.4, 0.5, 0.6]);
  const p2 = roundTo(1 - p1, 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Variables aléatoires",
    prompt: `\\(P(X=${x1}) = ${fr(p1)}\\), \\(P(X=${x2}) = ${fr(p2)}\\). Calcule \\(E(X)\\).`,
    answer: roundTo(x1 * p1 + x2 * p2, 4),
    tolerance: 0.0005,
    steps: [`E(X) = ${x1} \\times ${fr(p1)} + ${x2} \\times ${fr(p2)} = ${fr(roundTo(x1 * p1 + x2 * p2, 4))}`],
  };
}

// ---------- 2. Variance via König-Huygens (mental) ----------
function genAutoVarianceMental() {
  const EX = pick([1, 2, 3, -1, -2]);
  const EX2 = EX * EX + randInt(1, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Variables aléatoires",
    prompt: `\\(E(X) = ${EX}\\), \\(E(X^2) = ${EX2}\\). Calcule \\(V(X)\\).`,
    answer: EX2 - EX * EX,
    steps: [`V(X) = ${EX2} - ${EX}^2 = ${EX2 - EX * EX}`],
  };
}

// ---------- 3. Écart-type (mental) ----------
function genAutoEcartTypeMental() {
  const V = pick([4, 9, 16, 25, 36]);
  return {
    type: "numeric",
    chapter: "Automatismes — Variables aléatoires",
    prompt: `\\(V(X) = ${V}\\). Calcule l'écart-type \\(\\sigma(X)\\).`,
    answer: Math.sqrt(V),
    steps: [`\\sigma(X) = \\sqrt{${V}} = ${Math.sqrt(V)}`],
  };
}

// ---------- 4. Linéarité de l'espérance (mental) ----------
function genAutoLineariteEsperanceMental() {
  const EX = randInt(-6, 6);
  const a = nonZero(-4, 4);
  const b = randInt(-8, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Variables aléatoires",
    prompt: `\\(E(X) = ${EX}\\). Calcule \\(E(${a}X ${b >= 0 ? "+" : "-"} ${Math.abs(b)})\\).`,
    answer: a * EX + b,
    steps: [`${a} \\times ${EX} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${a * EX + b}`],
  };
}

// ---------- 5. Vrai ou faux express (mental) ----------
function genAutoVraiFauxVariablesAleatoiresMental() {
  const cas = pick([
    { description: "E(aX+b) = aE(X) + b.", reponse: "Vrai" },
    { description: "L'écart-type peut être négatif.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Variables aléatoires",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const CH_VARIABLES_ALEATOIRES = [
  genAutoEsperanceSimpleMental,
  genAutoVarianceMental,
  genAutoEcartTypeMental,
  genAutoLineariteEsperanceMental,
  genAutoVraiFauxVariablesAleatoiresMental,
];

const THEMES = [
  { id: "second-degre", title: "Second degré", generators: CH_SECOND_DEGRE },
  { id: "suites-numeriques-premiere-spe", title: "Suites numériques, modèles discrets", generators: CH_SUITES_NUMERIQUES },
  { id: "derivation-premiere-spe", title: "Dérivation", generators: CH_DERIVATION },
  { id: "variations-courbes-premiere-spe", title: "Variations et courbes représentatives des fonctions", generators: CH_VARIATIONS_COURBES },
  { id: "fonction-exponentielle-premiere-spe", title: "Fonction exponentielle", generators: CH_FONCTION_EXPONENTIELLE },
  { id: "trigonometrie-premiere-spe", title: "Trigonométrie", generators: CH_TRIGONOMETRIE },
  { id: "vecteurs-produit-scalaire-premiere-spe", title: "Calcul vectoriel et produit scalaire", generators: CH_PRODUIT_SCALAIRE },
  { id: "geometrie-reperee-premiere-spe", title: "Géométrie repérée", generators: CH_GEOMETRIE_REPEREE },
  { id: "probabilites-conditionnelles-premiere-spe", title: "Probabilités conditionnelles et indépendance", generators: CH_PROBABILITES_CONDITIONNELLES },
  { id: "variables-aleatoires-premiere-spe", title: "Variables aléatoires réelles", generators: CH_VARIABLES_ALEATOIRES },
];

const GENERATORS = THEMES.flatMap((t) => t.generators);

function generate(themeId) {
  if (themeId && themeId !== "mix") {
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) return pick(theme.generators)();
  }
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "automatismes-premiere-spe",
    title: "Automatismes",
    description: "Calcul rapide et automatismes du programme de Première Spé, chapitre après chapitre.",
    pourquoi: "Les automatismes, c'est le calcul mental qui libère de la place dans ta tête pour réfléchir au problème plutôt qu'à l'arithmétique : quelques minutes régulières valent mieux qu'une révision unique la veille du contrôle.",
    level: "premiere-spe",
    freemiumDaily: 5,
    order: 1,
    isAutomatismes: true,
  },
  themes: THEMES.map(({ id, title }) => ({ id, title })),
  generate,
};
