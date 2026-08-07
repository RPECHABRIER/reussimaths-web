// ---------------------------------------------------------------------------
// Chapitre : Automatismes (Première non spé) — gratuit, freemium (5
// questions/jour sans abonnement, illimité avec abonnement). Regroupe les
// mini-exercices de calcul rapide en tête de chaque chapitre du manuel de
// Première (enseignement mathématique, non spé), un thème par chapitre du
// sommaire (voir THEMES ci-dessous) ; sera enrichi au fur et à mesure que les
// autres chapitres de Première seront écrits — voir automatismes-seconde.js
// pour le même principe en 2nde.
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

// =========================== Chapitre 1 : Analyse de l'information chiffrée ===========================
// (Mini-exercices "Calcul mental" en tête de page : proportions simples,
// coefficient multiplicateur, angle d'un secteur circulaire, taux
// d'évolution, points de pourcentage.)

// ---------- 1. Proportion simple (mental) ----------
function genAutoProportionMental() {
  const total = randInt(20, 200);
  const partie = randInt(1, total - 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Analyse de l'information chiffrée",
    prompt: `Sur ${total} personnes interrogées, ${partie} répondent « oui ». Quelle proportion (arrondie au centième) cela représente-t-il ?`,
    answer: roundTo(partie / total, 2),
    tolerance: 0.01,
    steps: [`\\dfrac{${partie}}{${total}} \\approx ${fr(roundTo(partie / total, 2))}`],
  };
}

// ---------- 2. Coefficient multiplicateur (mental) ----------
function genAutoCoefficientMultiplicateurMental() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 90);
  const answer = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Analyse de l'information chiffrée",
    prompt: `Une grandeur ${direction} de ${p} %. Donne le coefficient multiplicateur associé.`,
    answer,
    tolerance: 0.001,
    steps: [`${fr(answer)}`],
  };
}

// ---------- 3. Angle d'un secteur circulaire (mental) ----------
function genAutoAngleSecteurMental() {
  const p = pick([5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 75]);
  return {
    type: "numeric",
    chapter: "Automatismes — Analyse de l'information chiffrée",
    prompt: `Dans un diagramme circulaire, un secteur représente ${p} % d'un total. Calcule la mesure de son angle, en degrés.`,
    answer: (p * 360) / 100,
    steps: [`${p}\\% \\times 360° = ${(p * 360) / 100}°`],
  };
}

// ---------- 4. Taux d'évolution simple (mental) ----------
function genAutoTauxEvolutionMental() {
  const k = randInt(2, 15);
  const t = randInt(1, 80);
  const hausse = Math.random() < 0.5;
  const V0 = k * 100;
  const V1 = hausse ? k * (100 + t) : k * (100 - t);
  return {
    type: "numeric",
    chapter: "Automatismes — Analyse de l'information chiffrée",
    prompt: `Une grandeur passe de ${V0} à ${V1}. Calcule le taux d'évolution (en %, positif pour une hausse, négatif pour une baisse).`,
    answer: hausse ? t : -t,
    steps: [`\\dfrac{${V1} - ${V0}}{${V0}} \\times 100 = ${hausse ? t : -t}\\%`],
  };
}

// ---------- 5. Écart en points de pourcentage (mental) ----------
function genAutoEcartPointsMental() {
  const p1 = randInt(10, 90);
  let p2 = randInt(10, 90);
  while (p2 === p1) p2 = randInt(10, 90);
  const [pMin, pMax] = p1 < p2 ? [p1, p2] : [p2, p1];
  return {
    type: "numeric",
    chapter: "Automatismes — Analyse de l'information chiffrée",
    prompt: `Une proportion passe de ${pMin} % à ${pMax} %. Quel est l'écart, en points de pourcentage ?`,
    answer: pMax - pMin,
    steps: [`${pMax} - ${pMin} = ${pMax - pMin}`],
  };
}

const CH_ANALYSE_INFO_CHIFFREE_PNS = [
  genAutoProportionMental,
  genAutoCoefficientMultiplicateurMental,
  genAutoAngleSecteurMental,
  genAutoTauxEvolutionMental,
  genAutoEcartPointsMental,
];

// =========================== Chapitre 2 : De la statistique aux probabilités ===========================
// (Mini-exercices "Calcul mental" en tête de page : fréquence conditionnelle,
// probabilité conditionnelle P_A(B), indépendance, probabilité d'un chemin
// dans un arbre pondéré, événement contraire.)

// ---------- 1. Fréquence conditionnelle simple (mental) ----------
function genAutoFrequenceConditionnelleMental() {
  const totalCategorie = pick([10, 12, 15, 20, 24, 25, 30]);
  const effectif = randInt(1, totalCategorie - 1);
  return {
    type: "numeric",
    chapter: "Automatismes — De la statistique aux probabilités",
    prompt: `Parmi ${totalCategorie} personnes d'une même catégorie, ${effectif} réalisent un événement E. Quelle est la fréquence conditionnelle de E dans cette catégorie (arrondie au centième) ?`,
    answer: roundTo(effectif / totalCategorie, 2),
    tolerance: 0.01,
    steps: [`\\dfrac{${effectif}}{${totalCategorie}} \\approx ${fr(roundTo(effectif / totalCategorie, 2))}`],
  };
}

// ---------- 2. Probabilité conditionnelle P_A(B) (mental) ----------
function genAutoProbabiliteConditionnelleMental() {
  const pAB = pick([0.05, 0.1, 0.15, 0.2, 0.24, 0.3]);
  const pA = pick([0.5, 0.6, 0.75, 0.8]);
  const pABValide = roundTo(pAB, 4) <= pA ? pAB : roundTo(pA / 2, 4);
  const answer = roundTo(pABValide / pA, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — De la statistique aux probabilités",
    prompt: `On sait que \\(P(A) = ${fr(pA)}\\) et \\(P(A \\cap B) = ${fr(pABValide)}\\). Calcule \\(P_A(B)\\) (arrondi au millième).`,
    answer,
    tolerance: 0.001,
    steps: [`P_A(B) = \\dfrac{${fr(pABValide)}}{${fr(pA)}} \\approx ${fr(answer)}`],
  };
}

// ---------- 3. Probabilité d'un événement contraire (mental) ----------
function genAutoProbabiliteContraireMental() {
  const p = pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9]);
  return {
    type: "numeric",
    chapter: "Automatismes — De la statistique aux probabilités",
    prompt: `On sait que \\(P(E) = ${fr(p)}\\). Calcule \\(P(\\overline{E})\\).`,
    answer: roundTo(1 - p, 2),
    tolerance: 0.001,
    steps: [`1 - ${fr(p)} = ${fr(roundTo(1 - p, 2))}`],
  };
}

// ---------- 4. Probabilité d'un chemin dans un arbre pondéré (mental) ----------
function genAutoProbabiliteCheminMental() {
  const pA = pick([0.4, 0.5, 0.6, 0.7, 0.8]);
  const pB_A = pick([0.2, 0.25, 0.5, 0.6, 0.75]);
  return {
    type: "numeric",
    chapter: "Automatismes — De la statistique aux probabilités",
    prompt: `Dans un arbre pondéré, \\(P(A) = ${fr(pA)}\\) et \\(P_A(B) = ${fr(pB_A)}\\). Calcule \\(P(A \\cap B)\\).`,
    answer: roundTo(pA * pB_A, 3),
    tolerance: 0.001,
    steps: [`${fr(pA)} \\times ${fr(pB_A)} = ${fr(roundTo(pA * pB_A, 3))}`],
  };
}

// ---------- 5. Vrai ou faux sur l'indépendance (mental) ----------
function genAutoIndependanceMental() {
  const cas = pick([
    { description: "Si \\(P_A(B) = P(B)\\), alors A et B sont indépendants.", reponse: "Vrai" },
    { description: "Deux événements incompatibles sont toujours indépendants.", reponse: "Faux" },
    { description: "Si A et B sont indépendants, \\(P(A \\cap B) = P(A) \\times P(B)\\).", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — De la statistique aux probabilités",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 6. Point moyen d'un petit nuage de points (mental) ----------
// NOTE (audit programme 2026, M2) : ajout, miroir du volet quantitatif des
// statistiques à deux variables introduit dans
// statistique-probabilites-premiere-non-spe.js.
function genAutoPointMoyenMental() {
  const xs = [1, 2, 3];
  const ys = xs.map(() => randInt(4, 20));
  const ybar = roundTo(ys.reduce((a, b) => a + b, 0) / 3, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — De la statistique aux probabilités",
    prompt: `Un nuage de points a pour ordonnées ${ys.join(", ")} (pour les abscisses 1, 2, 3). Calcule l'ordonnée du point moyen (arrondie au centième).`,
    answer: ybar,
    tolerance: 0.01,
    steps: [`\\dfrac{${ys.join(" + ")}}{3} = ${fr(ybar)}`],
  };
}

// ---------- 7. Coefficient directeur de la droite d'ajustement (mental) ----------
function genAutoCoefficientAjustementMental() {
  const x1 = 0;
  const xn = randInt(4, 8);
  const y1 = randInt(5, 20);
  const yn = randInt(5, 30);
  const a = roundTo((yn - y1) / (xn - x1), 2);
  return {
    type: "numeric",
    chapter: "Automatismes — De la statistique aux probabilités",
    prompt: `Le premier point d'un nuage est \\((${x1} ; ${y1})\\), le dernier est \\((${xn} ; ${yn})\\). Calcule le coefficient directeur de la droite passant par ces deux points (arrondi au centième).`,
    answer: a,
    tolerance: 0.01,
    steps: [`\\dfrac{${yn} - ${y1}}{${xn} - ${x1}} = ${fr(a)}`],
  };
}

const CH_STATISTIQUE_PROBABILITES_PNS = [
  genAutoFrequenceConditionnelleMental,
  genAutoProbabiliteConditionnelleMental,
  genAutoProbabiliteContraireMental,
  genAutoProbabiliteCheminMental,
  genAutoIndependanceMental,
  genAutoPointMoyenMental,
  genAutoCoefficientAjustementMental,
];

// =========================== Chapitre 3 : Croissance linéaire ===========================
// (Mini-exercices "Calcul mental" en tête de page : raison d'une suite
// arithmétique, calcul d'un terme par récurrence, calcul d'un terme via
// l'expression explicite, coefficient directeur, signe de la raison.)

// ---------- 1. Raison depuis deux termes consécutifs (mental) ----------
function genAutoRaisonMental() {
  const r = nonZero(-9, 9);
  const u0 = randInt(-15, 15);
  const u1 = u0 + r;
  return {
    type: "numeric",
    chapter: "Automatismes — Croissance linéaire",
    prompt: `Une suite arithmétique u vérifie \\(u(0) = ${u0}\\) et \\(u(1) = ${u1}\\). Calcule sa raison r.`,
    answer: r,
    steps: [`${u1} - (${u0}) = ${r}`],
  };
}

// ---------- 2. Terme suivant par récurrence (mental) ----------
function genAutoTermeSuivantMental() {
  const r = nonZero(-8, 8);
  const un = randInt(-30, 30);
  return {
    type: "numeric",
    chapter: "Automatismes — Croissance linéaire",
    prompt: `Une suite arithmétique u de raison \\(r = ${r}\\) vérifie \\(u(n) = ${un}\\). Calcule \\(u(n+1)\\).`,
    answer: un + r,
    steps: [`${un} + (${r}) = ${un + r}`],
  };
}

// ---------- 3. Terme via l'expression explicite (mental) ----------
function genAutoTermeExpliciteMental() {
  const r = nonZero(-9, 9);
  const u0 = randInt(-10, 10);
  const n = randInt(2, 10);
  return {
    type: "numeric",
    chapter: "Automatismes — Croissance linéaire",
    prompt: `Une suite arithmétique u vérifie \\(u(n) = ${r}n ${u0 >= 0 ? "+" : "-"} ${Math.abs(u0)}\\). Calcule \\(u(${n})\\).`,
    answer: r * n + u0,
    steps: [`${r} \\times ${n} ${u0 >= 0 ? "+" : "-"} ${Math.abs(u0)} = ${r * n + u0}`],
  };
}

// ---------- 4. Coefficient directeur depuis deux points (mental) ----------
function genAutoCoefficientDirecteurMental() {
  const xA = randInt(-6, 6);
  let xB = randInt(-6, 6);
  while (xB === xA) xB = randInt(-6, 6);
  const m = nonZero(-5, 5);
  const p = randInt(-8, 8);
  const yA = m * xA + p;
  const yB = m * xB + p;
  return {
    type: "numeric",
    chapter: "Automatismes — Croissance linéaire",
    prompt: `Une droite passe par \\(A(${xA} ; ${yA})\\) et \\(B(${xB} ; ${yB})\\). Calcule son coefficient directeur.`,
    answer: m,
    steps: [`\\dfrac{${yB} - (${yA})}{${xB} - (${xA})} = ${m}`],
  };
}

// ---------- 5. Signe de la raison (mental) ----------
function genAutoSigneRaisonMental() {
  const sens = pick(["croissante", "décroissante"]);
  return {
    type: "qcm",
    chapter: "Automatismes — Croissance linéaire",
    prompt: `Une suite arithmétique est ${sens}. Quel est le signe de sa raison ?`,
    answer: sens === "croissante" ? "r > 0" : "r < 0",
    options: ["r > 0", "r < 0"],
    steps: [sens === "croissante" ? "r > 0" : "r < 0"],
  };
}

const CH_CROISSANCE_LINEAIRE_PNS = [
  genAutoRaisonMental,
  genAutoTermeSuivantMental,
  genAutoTermeExpliciteMental,
  genAutoCoefficientDirecteurMental,
  genAutoSigneRaisonMental,
];

// =========================== Chapitre 4 : Croissance exponentielle ===========================
// (Mini-exercices "Calcul mental" en tête de page : terme suivant d'une
// suite géométrique, raison depuis deux termes, sens de variation selon la
// raison, coefficient multiplicateur global.)

// ---------- 1. Terme suivant d'une suite géométrique (mental) ----------
function genAutoTermeSuivantGeometriqueMental() {
  const q = pick([2, 3, 4, 5, 0.5]);
  const un = pick([2, 4, 5, 8, 10, 16, 20]);
  return {
    type: "numeric",
    chapter: "Automatismes — Croissance exponentielle",
    prompt: `Une suite géométrique u de raison \\(q = ${fr(q)}\\) vérifie \\(u(n) = ${un}\\). Calcule \\(u(n+1)\\).`,
    answer: roundTo(q * un, 4),
    tolerance: 0.001,
    steps: [`${fr(q)} \\times ${un} = ${fr(roundTo(q * un, 4))}`],
  };
}

// ---------- 2. Raison depuis deux termes consécutifs (mental) ----------
function genAutoRaisonGeometriqueMental() {
  const q = pick([2, 3, 4, 5, 0.5]);
  const u0 = pick([2, 4, 5, 8, 10]);
  const u1 = roundTo(q * u0, 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Croissance exponentielle",
    prompt: `Une suite géométrique u vérifie \\(u(0) = ${u0}\\) et \\(u(1) = ${fr(u1)}\\). Calcule sa raison q.`,
    answer: q,
    tolerance: 0.001,
    steps: [`\\dfrac{${fr(u1)}}{${u0}} = ${fr(q)}`],
  };
}

// ---------- 3. Sens de variation selon la raison (mental) ----------
function genAutoSensVariationGeometriqueMental() {
  const q = pick([2, 3, 0.5, 0.25, 1.5, 0.8]);
  return {
    type: "qcm",
    chapter: "Automatismes — Croissance exponentielle",
    prompt: `Une suite géométrique à termes positifs a pour raison \\(q = ${fr(q)}\\). Est-elle croissante ou décroissante ?`,
    answer: q > 1 ? "croissante" : "décroissante",
    options: ["croissante", "décroissante"],
    steps: [q > 1 ? "q > 1 : croissante" : "0 < q < 1 : décroissante"],
  };
}

// ---------- 4. Coefficient multiplicateur global (mental) ----------
function genAutoCoefficientMultiplicateurGlobalMental() {
  const cm1 = pick([1.1, 1.2, 0.9, 1.05, 0.8]);
  const cm2 = pick([1.1, 1.2, 0.9, 1.05, 0.8]);
  return {
    type: "numeric",
    chapter: "Automatismes — Croissance exponentielle",
    prompt: `Une grandeur subit deux évolutions successives de coefficients multiplicateurs \\(${fr(cm1)}\\) puis \\(${fr(cm2)}\\). Calcule le coefficient multiplicateur global (arrondi au millième).`,
    answer: roundTo(cm1 * cm2, 4),
    tolerance: 0.001,
    steps: [`${fr(cm1)} \\times ${fr(cm2)} = ${fr(roundTo(cm1 * cm2, 4))}`],
  };
}

// ---------- 5. Sens de variation d'une fonction exponentielle (mental) ----------
function genAutoSensVariationExponentielleMental() {
  const base = pick([1.2, 2, 3, 0.3, 0.5, 0.9]);
  return {
    type: "qcm",
    chapter: "Automatismes — Croissance exponentielle",
    prompt: `La fonction \\(f(x) = ${fr(base)}^x\\) est-elle croissante ou décroissante ?`,
    answer: base > 1 ? "croissante" : "décroissante",
    options: ["croissante", "décroissante"],
    steps: [base > 1 ? "base > 1 : croissante" : "0 < base < 1 : décroissante"],
  };
}

const CH_CROISSANCE_EXPONENTIELLE_PNS = [
  genAutoTermeSuivantGeometriqueMental,
  genAutoRaisonGeometriqueMental,
  genAutoSensVariationGeometriqueMental,
  genAutoCoefficientMultiplicateurGlobalMental,
  genAutoSensVariationExponentielleMental,
];

// =========================== Chapitre 4bis : Modélisation quadratique ===========================
// NOTE (audit programme 2026, M1) : nouveau thème, miroir de
// modelisation-quadratique-premiere-non-spe.js. (Mini-exercices "Calcul
// mental" en tête de page : signe de a, calcul rapide de Δ, nombre de
// solutions selon le signe de Δ.)

// ---------- 1. Signe du coefficient a (mental) ----------
function genAutoSigneCoefficientAMental() {
  const a = nonZero(-9, 9);
  const b = randInt(-9, 9);
  const c = randInt(-9, 9);
  return {
    type: "qcm",
    chapter: "Automatismes — Modélisation quadratique",
    prompt: `On considère le trinôme \\(${a}x^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)}\\). Quel est le signe de son coefficient a ?`,
    answer: a > 0 ? "positif" : "négatif",
    options: ["positif", "négatif"],
    steps: [`a = ${a}`],
  };
}

// ---------- 2. Calcul rapide du discriminant (mental) ----------
function genAutoCalculDiscriminantMental() {
  const a = nonZero(1, 4);
  const b = randInt(-6, 6);
  const c = randInt(-6, 6);
  const delta = b * b - 4 * a * c;
  return {
    type: "numeric",
    chapter: "Automatismes — Modélisation quadratique",
    prompt: `Calcule \\(\\Delta = b^2 - 4ac\\) pour \\(a = ${a}\\), \\(b = ${b}\\), \\(c = ${c}\\).`,
    answer: delta,
    steps: [`${b}^2 - 4 \\times ${a} \\times ${c} = ${delta}`],
  };
}

// ---------- 3. Nombre de solutions selon le signe de Δ (mental) ----------
function genAutoNombreSolutionsDeltaMental() {
  const delta = pick([-5, -3, -1, 0, 1, 3, 5, 8]);
  const nb = delta > 0 ? "2" : delta === 0 ? "1" : "0";
  return {
    type: "qcm",
    chapter: "Automatismes — Modélisation quadratique",
    prompt: `Une équation du second degré a un discriminant \\(\\Delta = ${delta}\\). Combien admet-elle de solutions réelles ?`,
    answer: nb,
    options: ["0", "1", "2"],
    steps: [delta > 0 ? "Δ > 0 : deux solutions." : delta === 0 ? "Δ = 0 : une solution." : "Δ < 0 : aucune solution."],
  };
}

const CH_MODELISATION_QUADRATIQUE_PNS = [genAutoSigneCoefficientAMental, genAutoCalculDiscriminantMental, genAutoNombreSolutionsDeltaMental];

// =========================== Chapitre 5 : Variations instantanées ===========================
// (Mini-exercices "Calcul mental" en tête de page : nombre dérivé depuis un
// déplacement sur la tangente, tangente horizontale, dérivée d'une fonction
// affine, signe du nombre dérivé.)

// ---------- 1. Nombre dérivé depuis un déplacement sur la tangente (mental) ----------
function genAutoNombreDeriveDeplacementMental() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-5, 5);
  const variation = nonZero(-8, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Variations instantanées",
    prompt: `Sur la tangente à la courbe de ${nomFonction} au point d'abscisse ${a}, l'ordonnée ${variation >= 0 ? "augmente" : "diminue"} de ${Math.abs(variation)} quand x augmente de 1. Calcule \\(${nomFonction}'(${a})\\).`,
    answer: variation,
    steps: [`${nomFonction}'(${a}) = ${variation}`],
  };
}

// ---------- 2. Tangente horizontale (mental) ----------
function genAutoTangenteHorizontaleMental() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-5, 5);
  return {
    type: "qcm",
    chapter: "Automatismes — Variations instantanées",
    prompt: `La tangente à la courbe de ${nomFonction} au point d'abscisse ${a} est horizontale. Que vaut \\(${nomFonction}'(${a})\\) ?`,
    answer: "0",
    options: ["0", "1"],
    steps: ["Une tangente horizontale a un coefficient directeur nul."],
  };
}

// ---------- 3. Nombre dérivé d'une fonction affine (mental) ----------
function genAutoNombreDeriveAffineMental() {
  const m = nonZero(-9, 9);
  const a = randInt(-10, 10);
  return {
    type: "numeric",
    chapter: "Automatismes — Variations instantanées",
    prompt: `On considère la fonction affine \\(f(x) = ${m}x + 5\\). Calcule \\(f'(${a})\\).`,
    answer: m,
    steps: [`f'(${a}) = ${m} \\text{ (coefficient directeur de la droite)}`],
  };
}

// ---------- 4. Signe du nombre dérivé (mental) ----------
function genAutoSigneNombreDeriveMental() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-5, 5);
  const fprime = nonZero(-8, 8);
  return {
    type: "qcm",
    chapter: "Automatismes — Variations instantanées",
    prompt: `On sait que \\(${nomFonction}'(${a}) = ${fprime}\\). ${nomFonction} est-elle localement croissante ou décroissante en ${a} ?`,
    answer: fprime > 0 ? "croissante" : "décroissante",
    options: ["croissante", "décroissante"],
    steps: [fprime > 0 ? "f'(a) > 0 : croissante" : "f'(a) < 0 : décroissante"],
  };
}

// ---------- 5. Ne pas confondre f(a) et f'(a) (mental) ----------
function genAutoDistinguerImageDeriveeMental() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-5, 5);
  const fa = randInt(-10, 10);
  const fprime = nonZero(-6, 6);
  const demandeImage = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Variations instantanées",
    prompt: `On sait que \\(${nomFonction}(${a}) = ${fa}\\) et \\(${nomFonction}'(${a}) = ${fprime}\\). Donne \\(${demandeImage ? `${nomFonction}(${a})` : `${nomFonction}'(${a})`}\\).`,
    answer: demandeImage ? fa : fprime,
    steps: [demandeImage ? `${fa}` : `${fprime}`],
  };
}

const CH_VARIATIONS_INSTANTANEES_PNS = [
  genAutoNombreDeriveDeplacementMental,
  genAutoTangenteHorizontaleMental,
  genAutoNombreDeriveAffineMental,
  genAutoSigneNombreDeriveMental,
  genAutoDistinguerImageDeriveeMental,
];

// =========================== Chapitre 6 : Variations globales ===========================
// (Mini-exercices "Calcul mental" en tête de page : dérivée d'une fonction
// affine, dérivée d'un trinôme, abscisse d'une tangente horizontale, signe
// de la dérivée et sens de variation.)

// ---------- 1. Dérivée d'une fonction affine (mental) ----------
function genAutoDeriveeAffineMental() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = nonZero(-9, 9);
  const b = randInt(-15, 15);
  return {
    type: "numeric",
    chapter: "Automatismes — Variations globales",
    prompt: `On considère \\(${nomFonction}(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Donne \\(${nomFonction}'(x)\\) (juste le coefficient).`,
    answer: a,
    steps: [`${nomFonction}'(x) = ${a}`],
  };
}

// ---------- 2. Dérivée d'un trinôme (mental) ----------
function genAutoDeriveeTrinomeMental() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = nonZero(-6, 6);
  const b = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Variations globales",
    prompt: `On considère \\(${nomFonction}(x) = ${a}x^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x\\). Donne le coefficient de x dans \\(${nomFonction}'(x)\\).`,
    answer: 2 * a,
    steps: [`${nomFonction}'(x) = ${2 * a}x + ${b}`],
  };
}

// ---------- 3. Abscisse d'une tangente horizontale (mental) ----------
function genAutoAbscisseTangenteHorizontaleMental() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = nonZero(-6, 6);
  const x0 = randInt(-8, 8);
  const b = -2 * a * x0;
  return {
    type: "numeric",
    chapter: "Automatismes — Variations globales",
    prompt: `La dérivée de ${nomFonction} est \\(${nomFonction}'(x) = ${2 * a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). En quel point la tangente est-elle horizontale ?`,
    answer: x0,
    steps: [`${2 * a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = 0 \\Rightarrow x = ${x0}`],
  };
}

// ---------- 4. Sens de variation depuis le signe de f' (mental) ----------
function genAutoSensVariationMental() {
  const nomFonction = pick(["f", "g", "h"]);
  const positive = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Automatismes — Variations globales",
    prompt: `${nomFonction}' est ${positive ? "positive" : "négative"} sur un intervalle. Quel est le sens de variation de ${nomFonction} sur cet intervalle ?`,
    answer: positive ? "croissante" : "décroissante",
    options: ["croissante", "décroissante"],
    steps: [positive ? "croissante" : "décroissante"],
  };
}

// ---------- 5. Vrai ou faux sur la dérivation (mental) ----------
function genAutoVraiFauxDerivationMental() {
  const cas = pick([
    { description: "La dérivée d'une constante est nulle.", reponse: "Vrai" },
    { description: "Ajouter une constante à une fonction change sa fonction dérivée.", reponse: "Faux" },
    { description: "Si f'(x) > 0 sur un intervalle, f y est croissante.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Variations globales",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const CH_VARIATIONS_GLOBALES_PNS = [
  genAutoDeriveeAffineMental,
  genAutoDeriveeTrinomeMental,
  genAutoAbscisseTangenteHorizontaleMental,
  genAutoSensVariationMental,
  genAutoVraiFauxDerivationMental,
];

const THEMES = [
  { id: "analyse-information-chiffree-premiere-non-spe", title: "Analyse de l'information chiffrée", generators: CH_ANALYSE_INFO_CHIFFREE_PNS },
  { id: "statistique-probabilites-premiere-non-spe", title: "De la statistique aux probabilités", generators: CH_STATISTIQUE_PROBABILITES_PNS },
  { id: "croissance-lineaire-premiere-non-spe", title: "Croissance linéaire", generators: CH_CROISSANCE_LINEAIRE_PNS },
  { id: "croissance-exponentielle-premiere-non-spe", title: "Croissance exponentielle", generators: CH_CROISSANCE_EXPONENTIELLE_PNS },
  { id: "modelisation-quadratique-premiere-non-spe", title: "Modélisation quadratique", generators: CH_MODELISATION_QUADRATIQUE_PNS },
  { id: "variations-instantanees-premiere-non-spe", title: "Variations instantanées", generators: CH_VARIATIONS_INSTANTANEES_PNS },
  { id: "variations-globales-premiere-non-spe", title: "Variations globales", generators: CH_VARIATIONS_GLOBALES_PNS },
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
    id: "automatismes-premiere-non-spe",
    title: "Automatismes",
    description: "Calcul rapide et automatismes du programme de Première (enseignement mathématique, non spé), chapitre après chapitre.",
    pourquoi: "Les automatismes, c'est le calcul mental qui libère de la place dans ta tête pour réfléchir au problème plutôt qu'à l'arithmétique : quelques minutes régulières valent mieux qu'une révision unique la veille du contrôle.",
    level: "premiere-non-spe",
    freemiumDaily: 5,
    order: 1,
    isAutomatismes: true,
  },
  themes: THEMES.map(({ id, title }) => ({ id, title })),
  generate,
};
