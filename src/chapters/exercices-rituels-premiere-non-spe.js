// ---------------------------------------------------------------------------
// Chapitre : Exercices rituels (Première, enseignement mathématique non
// spé) — sous abonnement.
//
// Synthèse de fin d'année mêlant les automatismes rapides du manuel ("chap
// exercices-rituels" : équations, ordres de grandeur, pourcentages, aires,
// identités remarquables, conversions de durées, comparaison de fractions,
// vitesse moyenne) et un rappel d'une compétence clé de chacun des 6
// chapitres du programme de Première non spé (tableaux croisés, probabilité
// conditionnelle, suites arithmétiques, suites géométriques, nombre dérivé,
// fonction dérivée). Comme pour les "Exercices de fin d'année" des niveaux
// précédents, ce chapitre ne correspond à aucun thème dédié dans
// Automatismes : il sert de brassage final.
// La correction du livre du professeur (source .tex, Rituels 1 à 16) a
// servi à identifier la méthode ; les nombres et contextes sont générés
// aléatoirement à chaque tirage.
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

// ---------- 1. Résoudre une équation linéaire avec x des deux côtés ----------
function genResoudreEquationDeuxCotesNumeric() {
  const xSol = nonZero(-10, 10);
  const a = nonZero(-8, 8);
  let c = nonZero(-8, 8);
  while (c === a) c = nonZero(-8, 8);
  const b = randInt(-15, 15);
  const d = (a - c) * xSol + b;
  return {
    type: "numeric",
    chapter: "Exercices rituels — Équations",
    prompt: `Résous l'équation : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}x ${d >= 0 ? "+" : "-"} ${Math.abs(d)}\\)`,
    answer: xSol,
    steps: [`${a - c}x = ${d - b}`, `x = ${xSol}`],
  };
}

// ---------- 2. Résoudre x² = k ----------
function genResoudreCarreEgalKNumeric() {
  const r = randInt(2, 15);
  const k = r * r;
  const demandeNegative = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Exercices rituels — Équations",
    prompt: `Résous l'équation \\(x^2 = ${k}\\) et donne ${demandeNegative ? "la solution négative" : "la solution positive"}.`,
    answer: demandeNegative ? -r : r,
    steps: [`x = ${r} \\text{ ou } x = ${-r}`],
  };
}

// ---------- 3. Ordre de grandeur d'un produit ----------
function genOrdreGrandeurProduitNumeric() {
  const a = pick([98, 99, 101, 102, 199, 201, 299, 301, 998, 1002]);
  const b = pick([49, 51, 69, 71, 19, 21, 9, 11, 29, 31]);
  const aArrondi = Math.round(a / 10) * 10;
  const bArrondi = Math.round(b / 10) * 10;
  return {
    type: "numeric",
    chapter: "Exercices rituels — Ordres de grandeur",
    prompt: `Donne un ordre de grandeur du produit \\(${a} \\times ${b}\\) en arrondissant chaque facteur à la dizaine la plus proche.`,
    answer: aArrondi * bArrondi,
    steps: [`${a} \\approx ${aArrondi} \\text{ et } ${b} \\approx ${bArrondi}`, `${aArrondi} \\times ${bArrondi} = ${aArrondi * bArrondi}`],
  };
}

// ---------- 4. Vitesse moyenne (distance / temps) ----------
function genVitesseMoyenneNumeric() {
  const vitesse = pick([20, 30, 40, 50, 60, 80, 90, 100, 120]);
  const temps = pick([0.5, 1, 1.5, 2, 2.5, 3]);
  const distance = roundTo(vitesse * temps, 2);
  return {
    type: "numeric",
    chapter: "Exercices rituels — Vitesse moyenne",
    prompt: `Un véhicule parcourt ${fr(distance)} km en ${fr(temps)} h. Calcule sa vitesse moyenne (en km/h).`,
    answer: vitesse,
    steps: [`\\dfrac{${fr(distance)}}{${fr(temps)}} = ${vitesse} \\text{ km/h}`],
  };
}

// ---------- 5. Aire d'un disque ----------
function genAireDisqueNumeric() {
  const rayon = randInt(2, 20);
  const answer = roundTo(Math.PI * rayon * rayon, 2);
  return {
    type: "numeric",
    chapter: "Exercices rituels — Aires",
    prompt: `Calcule l'aire d'un disque de rayon ${rayon} cm (arrondie au centième, en cm²).`,
    answer,
    tolerance: 0.1,
    steps: [`\\pi \\times ${rayon}^2 \\approx ${fr(answer)} \\text{ cm}^2`],
  };
}

// ---------- 6. Identité remarquable : différence de carrés pour un calcul rapide ----------
function genIdentiteRemarquableCalculRapideNumeric() {
  const centre = pick([50, 100, 200, 1000]);
  const ecart = randInt(1, 9);
  const a = centre + ecart;
  const b = centre - ecart;
  const answer = centre * centre - ecart * ecart;
  return {
    type: "numeric",
    chapter: "Exercices rituels — Calcul rapide",
    prompt: `En utilisant l'identité \\((a+b)(a-b) = a^2 - b^2\\), calcule rapidement \\(${a} \\times ${b}\\).`,
    answer,
    steps: [`${a} \\times ${b} = (${centre} + ${ecart})(${centre} - ${ecart}) = ${centre}^2 - ${ecart}^2 = ${centre * centre} - ${ecart * ecart} = ${answer}`],
  };
}

// ---------- 7. Comparer deux fractions ----------
function genComparerFractionsQCM() {
  const den1 = pick([2, 3, 4, 5, 6, 8, 10]);
  const num1 = randInt(1, den1 - 1);
  let den2 = pick([2, 3, 4, 5, 6, 8, 10]);
  let num2 = randInt(1, den2 - 1);
  // On régénère la seconde fraction (numérateur ET dénominateur) tant qu'elle
  // est égale à la première, pour éviter toute boucle infinie (par exemple
  // deux fractions de dénominateur 2, qui ne peuvent valoir que 1/2).
  while (roundTo(num1 / den1, 6) === roundTo(num2 / den2, 6)) {
    den2 = pick([2, 3, 4, 5, 6, 8, 10]);
    num2 = randInt(1, den2 - 1);
  }
  const plusGrande = num1 / den1 > num2 / den2 ? `\\dfrac{${num1}}{${den1}}` : `\\dfrac{${num2}}{${den2}}`;
  return {
    type: "qcm",
    chapter: "Exercices rituels — Fractions",
    prompt: `Quelle est la plus grande des deux fractions : \\(\\dfrac{${num1}}{${den1}}\\) ou \\(\\dfrac{${num2}}{${den2}}\\) ?`,
    answer: plusGrande,
    options: [`\\dfrac{${num1}}{${den1}}`, `\\dfrac{${num2}}{${den2}}`],
    steps: [`\\dfrac{${num1}}{${den1}} \\approx ${fr(roundTo(num1 / den1, 3))} \\text{ et } \\dfrac{${num2}}{${den2}} \\approx ${fr(roundTo(num2 / den2, 3))}`],
  };
}

// ---------- 8. Coefficient multiplicateur (rappel) ----------
function genCoefficientMultiplicateurRappelNumeric() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 90);
  const answer = direction === "augmente" ? roundTo(1 + p / 100, 4) : roundTo(1 - p / 100, 4);
  return {
    type: "numeric",
    chapter: "Exercices rituels — Pourcentages",
    prompt: `Une grandeur ${direction} de ${p} %. Donne le coefficient multiplicateur associé.`,
    answer,
    tolerance: 0.001,
    steps: [`${fr(answer)}`],
  };
}

// ---------- 9. Rappel chapitre 1 : proportion depuis un tableau croisé ----------
function genRappelProportionTableauNumeric() {
  const a = randInt(5, 40);
  const b = randInt(5, 40);
  const total = a + b;
  const answer = roundTo(a / total, 2);
  return {
    type: "numeric",
    chapter: "Exercices rituels — Rappel : tableaux croisés",
    prompt: `Dans un groupe de ${total} personnes, ${a} répondent « oui » à une question. Quelle proportion (arrondie au centième) cela représente-t-il ?`,
    answer,
    tolerance: 0.01,
    steps: [`\\dfrac{${a}}{${total}} \\approx ${fr(answer)}`],
  };
}

// ---------- 10. Rappel chapitre 2 : probabilité conditionnelle ----------
function genRappelProbabiliteConditionnelleNumeric() {
  const pA = pick([0.4, 0.5, 0.6, 0.8]);
  const pB_A = pick([0.2, 0.25, 0.5, 0.75]);
  const pAB = roundTo(pA * pB_A, 4);
  return {
    type: "numeric",
    chapter: "Exercices rituels — Rappel : probabilités",
    prompt: `On sait que \\(P(A) = ${fr(pA)}\\) et \\(P_A(B) = ${fr(pB_A)}\\). Calcule \\(P(A \\cap B)\\).`,
    answer: pAB,
    tolerance: 0.001,
    steps: [`${fr(pA)} \\times ${fr(pB_A)} = ${fr(pAB)}`],
  };
}

// ---------- 11. Rappel chapitre 3 : terme d'une suite arithmétique ----------
function genRappelTermeSuiteArithmetiqueNumeric() {
  const r = nonZero(-9, 9);
  const u0 = randInt(-15, 15);
  const n = randInt(2, 12);
  return {
    type: "numeric",
    chapter: "Exercices rituels — Rappel : suites arithmétiques",
    prompt: `Une suite arithmétique u a pour premier terme \\(u(0) = ${u0}\\) et pour raison \\(r = ${r}\\). Calcule \\(u(${n})\\).`,
    answer: r * n + u0,
    steps: [`${r} \\times ${n} + ${u0} = ${r * n + u0}`],
  };
}

// ---------- 12. Rappel chapitre 4 : terme d'une suite géométrique ----------
function genRappelTermeSuiteGeometriqueNumeric() {
  const q = pick([2, 3, 4, 5, 0.5]);
  const u0 = pick([1, 2, 3, 4, 5]);
  const n = randInt(2, 4);
  const answer = roundTo(u0 * q ** n, 6);
  return {
    type: "numeric",
    chapter: "Exercices rituels — Rappel : suites géométriques",
    prompt: `Une suite géométrique u a pour premier terme \\(u(0) = ${u0}\\) et pour raison \\(q = ${fr(q)}\\). Calcule \\(u(${n})\\).`,
    answer,
    tolerance: 0.001,
    steps: [`${u0} \\times ${fr(q)}^{${n}} = ${fr(answer)}`],
  };
}

// ---------- 13. Rappel chapitre 5 : nombre dérivé depuis deux points de la tangente ----------
function genRappelNombreDeriveNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-6, 6);
  const xA = randInt(-8, 8);
  let xB = randInt(-8, 8);
  while (xB === xA) xB = randInt(-8, 8);
  const m = nonZero(-6, 6);
  const p = randInt(-10, 10);
  const yA = m * xA + p;
  const yB = m * xB + p;
  return {
    type: "numeric",
    chapter: "Exercices rituels — Rappel : nombre dérivé",
    prompt: `La tangente à la courbe de ${nomFonction} au point d'abscisse ${a} passe par \\(A(${xA} ; ${yA})\\) et \\(B(${xB} ; ${yB})\\). Calcule \\(${nomFonction}'(${a})\\).`,
    answer: m,
    steps: [`\\dfrac{${yB} - (${yA})}{${xB} - (${xA})} = ${m}`],
  };
}

// ---------- 14. Rappel chapitre 6 : dérivée d'un trinôme ----------
function genRappelDeriveeTrinomeNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = nonZero(-6, 6);
  const b = randInt(-9, 9);
  const x = randInt(-5, 5);
  const answer = 2 * a * x + b;
  return {
    type: "numeric",
    chapter: "Exercices rituels — Rappel : fonction dérivée",
    prompt: `On considère \\(${nomFonction}(x) = ${a}x^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x\\). Calcule \\(${nomFonction}'(${x})\\).`,
    answer,
    steps: [`${nomFonction}'(x) = ${2 * a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`, `${nomFonction}'(${x}) = ${2 * a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
  };
}

// ---------- 15. Conversion durée décimale <-> minutes ----------
function genConversionDureeNumeric() {
  const heures = pick([0.25, 0.5, 0.75, 1.25, 1.5, 1.75, 2.25, 2.5]);
  const minutes = Math.round(heures * 60);
  const demanderMinutes = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Exercices rituels — Conversions",
    prompt: demanderMinutes
      ? `Une durée de ${fr(heures)} h correspond à combien de minutes ?`
      : `Une durée de ${minutes} minutes correspond à combien d'heures (valeur décimale) ?`,
    answer: demanderMinutes ? minutes : heures,
    tolerance: demanderMinutes ? 0 : 0.01,
    steps: [demanderMinutes ? `${fr(heures)} \\times 60 = ${minutes} \\text{ min}` : `${minutes} \\div 60 = ${fr(heures)} \\text{ h}`],
  };
}

const GENERATORS = [
  genResoudreEquationDeuxCotesNumeric,
  genResoudreCarreEgalKNumeric,
  genOrdreGrandeurProduitNumeric,
  genVitesseMoyenneNumeric,
  genAireDisqueNumeric,
  genIdentiteRemarquableCalculRapideNumeric,
  genComparerFractionsQCM,
  genCoefficientMultiplicateurRappelNumeric,
  genRappelProportionTableauNumeric,
  genRappelProbabiliteConditionnelleNumeric,
  genRappelTermeSuiteArithmetiqueNumeric,
  genRappelTermeSuiteGeometriqueNumeric,
  genRappelNombreDeriveNumeric,
  genRappelDeriveeTrinomeNumeric,
  genConversionDureeNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "exercices-rituels-premiere-non-spe",
    title: "Exercices rituels",
    description: "Brassage final de l'année de Première non spé : automatismes rapides (équations, ordres de grandeur, pourcentages, aires, identités remarquables) et rappel d'une compétence clé de chacun des 6 chapitres du programme.",
    level: "premiere-non-spe",
    free: false,
    order: 8,
  },
  generate,
};
