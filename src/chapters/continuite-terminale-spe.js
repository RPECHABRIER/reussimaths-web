// ---------------------------------------------------------------------------
// Chapitre : Continuité (Terminale, spécialité mathématiques) — sous
// abonnement.
//
// Correspond au chapitre 6 du programme de spécialité mathématiques de
// terminale : théorème des valeurs intermédiaires (TVI) et son corollaire
// (fonction continue et strictement monotone sur un intervalle : existence
// et unicité d'une solution à f(x) = k), continuité des fonctions usuelles
// (racine carrée, valeur absolue, exponentielle, fonctions rationnelles),
// opérations sur les fonctions continues (somme, produit, quotient),
// détermination du nombre de solutions d'une équation à partir d'un tableau
// de variations, signe du produit f(a)×f(b) pour amorcer une résolution par
// dichotomie, suites récurrentes définies par u(n+1) = f(u(n)) et leur
// limite (point fixe de f).
// La correction du livre du professeur (source .tex, exercices 9-17 de la
// section Auto-évaluation) a servi à identifier la méthode ; les nombres et
// contextes sont générés aléatoirement à chaque tirage.
// Voir automatismes-terminale-spe.js (thème "continuite-terminale-spe")
// pour les mini-exercices "Calcul mental" associés.
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
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const fr = (n) => String(n).replace(".", ",");

// ---------- 1. Le TVI garantit-il une solution ? ----------
function genTVIGarantieSolutionQCM() {
  const fa = randInt(-10, 10);
  let fb = randInt(-10, 10);
  while (fb === fa) fb = randInt(-10, 10);
  const [bas, haut] = fa < fb ? [fa, fb] : [fb, fa];
  const dansIntervalle = Math.random() < 0.5;
  const k = dansIntervalle ? randInt(bas, haut) : (Math.random() < 0.5 ? haut + nonZero(1, 5) : bas - nonZero(1, 5));
  const reponse = k >= bas && k <= haut ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Continuité — Théorème des valeurs intermédiaires",
    prompt: `Une fonction f est continue sur \\([a;b]\\), avec \\(f(a) = ${fa}\\) et \\(f(b) = ${fb}\\). D'après le théorème des valeurs intermédiaires, l'équation \\(f(x) = ${k}\\) admet-elle nécessairement au moins une solution sur \\([a;b]\\) ?`,
    answer: reponse,
    options: ["Oui", "Non"],
    steps: [`f(x) \\text{ prend toutes les valeurs entre } ${bas} \\text{ et } ${haut}`, reponse === "Oui" ? `${k} \\text{ est bien compris entre } ${bas} \\text{ et } ${haut} : \\text{une solution existe.}` : `${k} \\text{ n'est pas compris entre } ${bas} \\text{ et } ${haut} : \\text{le théorème ne garantit rien.}`],
  };
}

// ---------- 2. Corollaire du TVI : unicité de la solution (fonction strictement monotone) ----------
function genCorollaireTVIUniciteQCM() {
  const fa = randInt(-10, 10);
  let fb = randInt(-10, 10);
  while (fb === fa) fb = randInt(-10, 10);
  const [bas, haut] = fa < fb ? [fa, fb] : [fb, fa];
  const k = randInt(bas, haut);
  return {
    type: "qcm",
    chapter: "Continuité — Théorème des valeurs intermédiaires",
    prompt: `Une fonction f est continue et strictement monotone sur \\([a;b]\\), avec \\(f(a) = ${fa}\\) et \\(f(b) = ${fb}\\). Combien de solutions l'équation \\(f(x) = ${k}\\) admet-elle sur \\([a;b]\\) ?`,
    answer: "Exactement une",
    options: ["Exactement une", "Aucune", "Une infinité"],
    steps: [`\\text{D'après le corollaire du TVI, une fonction continue et strictement monotone réalise une bijection : chaque valeur entre } ${bas} \\text{ et } ${haut} \\text{ est atteinte exactement une fois.}`],
  };
}

// ---------- 3. Continuité des fonctions usuelles ----------
function genContinuiteFonctionsUsuellesQCM() {
  const cas = pick([
    { description: "La fonction racine carrée est continue sur \\(\\mathbb{R}\\).", reponse: "Faux" },
    { description: "La fonction racine carrée est continue sur \\([0 ; +\\infty[\\).", reponse: "Vrai" },
    { description: "La fonction exponentielle est continue sur \\(\\mathbb{R}\\).", reponse: "Vrai" },
    { description: "La fonction valeur absolue est continue sur \\(\\mathbb{R}\\).", reponse: "Vrai" },
    { description: "La fonction inverse \\(x \\mapsto \\frac{1}{x}\\) est continue sur \\(\\mathbb{R}\\).", reponse: "Faux" },
    { description: "Toute fonction dérivable sur un intervalle est continue sur cet intervalle.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Continuité — Fonctions usuelles",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 4. Opérations sur les fonctions continues ----------
function genOperationsFonctionsContinuesQCM() {
  const cas = pick([
    { description: "La somme de deux fonctions continues sur I est continue sur I.", reponse: "Vrai" },
    { description: "Le produit de deux fonctions continues sur I est continu sur I.", reponse: "Vrai" },
    { description: "Le quotient de deux fonctions continues sur I est toujours continu sur I, même si le dénominateur s'annule.", reponse: "Faux" },
    { description: "La racine carrée d'une fonction continue et positive sur I est continue sur I.", reponse: "Vrai" },
    { description: "La composée de deux fonctions continues est continue.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Continuité — Opérations sur les fonctions continues",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 5. Nombre de solutions depuis un tableau de variations (une seule branche monotone) ----------
function genNombreSolutionsTableauVariationsNumeric() {
  const fa = randInt(-10, 0);
  const fb = randInt(1, 15);
  const k = randInt(fa, fb);
  return {
    type: "numeric",
    chapter: "Continuité — Nombre de solutions",
    prompt: `Une fonction f est continue et strictement croissante sur \\([a;b]\\), avec \\(f(a) = ${fa}\\) et \\(f(b) = ${fb}\\). Combien de solutions l'équation \\(f(x) = ${k}\\) admet-elle sur \\([a;b]\\) ?`,
    answer: 1,
    steps: [`\\text{D'après le corollaire du TVI, exactement 1 solution.}`],
  };
}

// ---------- 6. Nombre de solutions depuis un tableau de variations en "V" (deux branches monotones) ----------
function genNombreSolutionsTableauEnVNumeric() {
  const minimum = randInt(-8, 0);
  const gauche = randInt(minimum + 3, minimum + 15);
  const droite = randInt(minimum + 3, minimum + 15);
  const k = randInt(minimum + 1, Math.min(gauche, droite) - 1);
  return {
    type: "numeric",
    chapter: "Continuité — Nombre de solutions",
    prompt: `Une fonction f est continue sur \\([a;b]\\), strictement décroissante sur \\([a;c]\\) puis strictement croissante sur \\([c;b]\\), avec \\(f(a) = ${gauche}\\), \\(f(c) = ${minimum}\\) (minimum) et \\(f(b) = ${droite}\\). Combien de solutions l'équation \\(f(x) = ${k}\\) admet-elle sur \\([a;b]\\) (avec ${k} strictement supérieur au minimum et strictement inférieur à ${Math.min(gauche, droite)}) ?`,
    answer: 2,
    steps: [`\\text{Sur } [a;c], \\text{ f est continue et strictement décroissante : 1 solution.}`, `\\text{Sur } [c;b], \\text{ f est continue et strictement croissante : 1 solution.}`, `\\text{Total : 2 solutions.}`],
  };
}

// ---------- 7. Signe du produit f(a)×f(b) pour amorcer une dichotomie ----------
function genSigneProduitDichotomieQCM() {
  const fa = nonZero(-10, 10);
  const fb = nonZero(-10, 10);
  const produit = fa * fb;
  const garantie = produit < 0;
  return {
    type: "qcm",
    chapter: "Continuité — Dichotomie",
    prompt: `Une fonction f est continue sur \\([a;b]\\), avec \\(f(a) = ${fa}\\) et \\(f(b) = ${fb}\\). Le signe de \\(f(a) \\times f(b)\\) garantit-il l'existence d'une solution à \\(f(x) = 0\\) sur \\([a;b]\\) ?`,
    answer: garantie ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`f(a) \\times f(b) = ${fa} \\times ${fb} = ${produit}`, garantie ? "Le produit est négatif : f(a) et f(b) sont de signes opposés, une solution existe (TVI)." : "Le produit est positif : f(a) et f(b) sont de même signe, on ne peut rien conclure directement."],
  };
}

// ---------- 8. Recherche d'un intervalle contenant une solution (balayage) ----------
function genIntervalleContientSolutionQCM() {
  const f1 = randInt(-8, -3); // toujours négatif
  const f3 = randInt(3, 8); // toujours positif
  const signeChange = Math.random() < 0.5;
  // Si signeChange, f2 est positif (signe opposé à f1, donc f1*f2 < 0 sur [1;2]).
  // Sinon, f2 est négatif (même signe que f1, donc f1*f2 > 0 sur [1;2]).
  const f2 = signeChange ? randInt(1, 6) : -randInt(1, 6);
  const contientEntre12 = f1 * f2 < 0;
  return {
    type: "qcm",
    chapter: "Continuité — Dichotomie",
    prompt: `Une fonction continue f vérifie \\(f(1) = ${f1}\\), \\(f(2) = ${f2}\\) et \\(f(3) = ${f3}\\). L'équation f(x) = 0 admet-elle une solution garantie sur l'intervalle \\([1;2]\\) ?`,
    answer: contientEntre12 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`f(1) \\times f(2) = ${f1} \\times ${f2} = ${f1 * f2}`, contientEntre12 ? "Le produit est négatif : une solution est garantie sur [1;2]." : "Le produit est positif ou nul : rien n'est garanti sur [1;2]."],
  };
}

// ---------- 9. Résoudre f(l) = l pour une suite récurrente (point fixe affine) ----------
function genPointFixeSuiteRecurrenteNumeric() {
  const m = pick([0.5, 2, 3, 0.25, -0.5]);
  const l = randInt(-8, 8);
  const p = roundTo(l - m * l, 4);
  return {
    type: "numeric",
    chapter: "Continuité — Suites récurrentes",
    prompt: `Une suite u vérifie \\(u_{n+1} = f(u_n)\\) avec \\(f(x) = ${fr(m)}x ${p >= 0 ? "+" : "-"} ${fr(Math.abs(p))}\\). Si la suite converge, sa limite l vérifie \\(f(l) = l\\). Résous cette équation pour trouver l.`,
    answer: l,
    tolerance: 0.01,
    steps: [`l = ${fr(m)}l ${p >= 0 ? "+" : "-"} ${fr(Math.abs(p))}`, `l(1 - ${fr(m)}) = ${fr(p)}`, `l = ${l}`],
  };
}

// ---------- 10. Vrai ou faux sur le théorème des valeurs intermédiaires ----------
function genVraiFauxTVIQCM() {
  const cas = pick([
    { description: "Le théorème des valeurs intermédiaires nécessite que la fonction soit continue sur l'intervalle considéré.", reponse: "Vrai" },
    { description: "Le théorème des valeurs intermédiaires garantit toujours l'unicité de la solution.", reponse: "Faux" },
    { description: "Si une fonction n'est pas continue, on ne peut pas appliquer le théorème des valeurs intermédiaires.", reponse: "Vrai" },
    { description: "Le corollaire du TVI (fonction strictement monotone) garantit l'existence ET l'unicité de la solution.", reponse: "Vrai" },
    { description: "La méthode de dichotomie permet de trouver une valeur exacte de la solution en une seule étape.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Continuité — Théorème des valeurs intermédiaires",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 11. Identifier une fonction continue mais non dérivable en un point ----------
function genContinueNonDerivableQCM() {
  const cas = pick([
    { description: "La fonction racine carrée en x = 0", reponse: "Continue mais non dérivable" },
    { description: "La fonction valeur absolue en x = 0", reponse: "Continue mais non dérivable" },
    { description: "La fonction carrée en x = 0", reponse: "Continue et dérivable" },
    { description: "La fonction exponentielle en x = 0", reponse: "Continue et dérivable" },
  ]);
  return {
    type: "qcm",
    chapter: "Continuité — Fonctions usuelles",
    prompt: `« ${cas.description} » est-elle continue et dérivable, ou seulement continue ?`,
    answer: cas.reponse,
    options: ["Continue et dérivable", "Continue mais non dérivable"],
    steps: [cas.reponse],
  };
}

// ---------- 12. Nombre de solutions total sur deux intervalles disjoints ----------
function genNombreSolutionsDeuxIntervallesNumeric() {
  const solutions1 = pick([0, 1]);
  const solutions2 = pick([0, 1]);
  return {
    type: "numeric",
    chapter: "Continuité — Nombre de solutions",
    prompt: `Une équation f(x) = k admet ${solutions1} solution${solutions1 > 1 ? "s" : ""} sur un intervalle \\(I_1\\) et ${solutions2} solution${solutions2 > 1 ? "s" : ""} sur un intervalle disjoint \\(I_2\\). Combien de solutions au total sur \\(I_1 \\cup I_2\\) ?`,
    answer: solutions1 + solutions2,
    steps: [`${solutions1} + ${solutions2} = ${solutions1 + solutions2}`],
  };
}

// ---------- 13. Initialisation d'une récurrence pour encadrer une suite ----------
function genInitialisationRecurrenceQCM() {
  const u0 = roundTo(Math.random() * 2, 2);
  const dansIntervalle = u0 >= 0 && u0 <= 2;
  return {
    type: "qcm",
    chapter: "Continuité — Suites récurrentes",
    prompt: `On veut démontrer par récurrence que, pour tout entier naturel n, \\(u_n \\in [0;2]\\). On sait que \\(u_0 = ${fr(u0)}\\). L'initialisation de la récurrence est-elle vérifiée ?`,
    answer: dansIntervalle ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [dansIntervalle ? `${fr(u0)} \\in [0;2] : \\text{l'initialisation est vérifiée.}` : `${fr(u0)} \\notin [0;2] : \\text{l'initialisation n'est pas vérifiée.}`],
  };
}

// ---------- 14. Calcul de f(a) × f(b) (préparation TVI) ----------
function genCalculerProduitImagesNumeric() {
  const fa = nonZero(-9, 9);
  const fb = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Continuité — Dichotomie",
    prompt: `Une fonction continue f vérifie \\(f(a) = ${fa}\\) et \\(f(b) = ${fb}\\). Calcule \\(f(a) \\times f(b)\\).`,
    answer: fa * fb,
    steps: [`${fa} \\times ${fb} = ${fa * fb}`],
  };
}

// ---------- 15. Identifier l'étape d'un raisonnement par dichotomie ----------
function genEtapeDichotomieQCM() {
  const etape = pick(["milieu", "signe", "recommencer"]);
  const descriptions = {
    milieu: "On calcule le milieu m de l'intervalle [a;b] actuel.",
    signe: "On calcule le signe de f(m) et on compare avec le signe de f(a) pour choisir le nouveau sous-intervalle.",
    recommencer: "On recommence le procédé sur le nouvel intervalle, deux fois plus petit, jusqu'à la précision souhaitée.",
  };
  return {
    type: "qcm",
    chapter: "Continuité — Dichotomie",
    prompt: `Dans la méthode de dichotomie : « ${descriptions[etape]} ». À quelle étape cela correspond-il ?`,
    answer: etape,
    options: ["milieu", "signe", "recommencer"],
    steps: [`\\text{Étape : ${etape}}`],
  };
}

const GENERATORS = [
  genTVIGarantieSolutionQCM,
  genCorollaireTVIUniciteQCM,
  genContinuiteFonctionsUsuellesQCM,
  genOperationsFonctionsContinuesQCM,
  genNombreSolutionsTableauVariationsNumeric,
  genNombreSolutionsTableauEnVNumeric,
  genSigneProduitDichotomieQCM,
  genIntervalleContientSolutionQCM,
  genPointFixeSuiteRecurrenteNumeric,
  genVraiFauxTVIQCM,
  genContinueNonDerivableQCM,
  genNombreSolutionsDeuxIntervallesNumeric,
  genInitialisationRecurrenceQCM,
  genCalculerProduitImagesNumeric,
  genEtapeDichotomieQCM,
];

const DIFFICULTY = {
  genTVIGarantieSolutionQCM: "facile",
  genContinuiteFonctionsUsuellesQCM: "facile",
  genIntervalleContientSolutionQCM: "facile",
  genInitialisationRecurrenceQCM: "facile",
  genCalculerProduitImagesNumeric: "facile",
  genCorollaireTVIUniciteQCM: "standard",
  genOperationsFonctionsContinuesQCM: "standard",
  genNombreSolutionsTableauVariationsNumeric: "standard",
  genNombreSolutionsTableauEnVNumeric: "standard",
  genVraiFauxTVIQCM: "standard",
  genEtapeDichotomieQCM: "standard",
  genSigneProduitDichotomieQCM: "expert",
  genPointFixeSuiteRecurrenteNumeric: "expert",
  genContinueNonDerivableQCM: "expert",
  genNombreSolutionsDeuxIntervallesNumeric: "expert",
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
    id: "continuite-terminale-spe",
    title: "Continuité",
    description: "Théorème des valeurs intermédiaires et son corollaire, continuité des fonctions usuelles, opérations sur les fonctions continues, nombre de solutions d'une équation, dichotomie, suites récurrentes et point fixe.",
    level: "terminale-spe",
    free: false,
    order: 7,
  },
  generate,
};
