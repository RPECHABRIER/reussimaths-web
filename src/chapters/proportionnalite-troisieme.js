// ---------------------------------------------------------------------------
// Chapitre : Situations de proportionnalité (3e) — sous abonnement.
//
// Correspond au chapitre 7 du manuel de 3e : simplifier et reconnaître des
// ratios équivalents, exprimer un ratio en pourcentage, partager une
// quantité selon un ratio, appliquer une proportionnalité (recette à
// l'échelle), résoudre un problème avec ratio + différence, coefficient
// multiplicateur d'une évolution en pourcentage (dans les deux sens),
// calculer un prix final ou un prix initial après évolution, enchaîner deux
// évolutions successives, trouver le coefficient réciproque pour revenir au
// prix de départ, et comparer deux offres de réduction.
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "proportionnalite-troisieme") pour
// les mini-exercices "Calcul mental" associés.
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

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function coprimePair(min, max) {
  let a0, b0;
  do {
    a0 = randInt(min, max);
    b0 = randInt(min, max);
  } while (gcd(a0, b0) !== 1 || a0 === b0);
  return [a0, b0];
}

// =========================== Ratios ===========================

// ---------- 1. Simplifier un ratio sous sa forme irréductible ----------
function genSimplifierRatioNumeric() {
  const [p, q] = coprimePair(2, 9);
  const k = randInt(2, 9);
  const a = k * p;
  const b = k * q;
  const askP = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Proportionnalité — Ratios",
    prompt: `On simplifie le ratio ${a} : ${b} sous sa forme irréductible p : q. Quelle est la valeur de ${askP ? "p" : "q"} ?`,
    answer: askP ? p : q,
    steps: [`${a} : ${b} = ${p} : ${q} \\text{ (on divise chaque terme par } ${k}\\text{)}`],
  };
}

// ---------- 2. Reconnaître un ratio équivalent ----------
function genRatioEquivalentQCM() {
  const [p, q] = coprimePair(2, 9);
  const k1 = randInt(2, 6);
  const correct = `${p * k1} : ${q * k1}`;
  const wrong1 = `${p * k1 + 1} : ${q * k1}`;
  const wrong2 = `${p * k1} : ${q * k1 + 1}`;
  const options = shuffle([...new Set([correct, wrong1, wrong2])]);
  return {
    type: "qcm",
    chapter: "Proportionnalité — Ratios",
    prompt: `Quel ratio est équivalent à ${p} : ${q} ?`,
    answer: correct,
    options,
    steps: [`${p} : ${q} = ${p * k1} : ${q * k1} \\text{ (on multiplie chaque terme par } ${k1}\\text{)}`],
  };
}

// ---------- 3. Exprimer un ratio en pourcentage ----------
function genPourcentageDepuisRatioNumeric() {
  const n = pick([2, 4, 5, 10, 20, 25, 50]);
  const m = randInt(1, n - 1);
  const answer = (m * 100) / n;
  return {
    type: "numeric",
    chapter: "Proportionnalité — Ratios",
    prompt: `Dans un ratio ${m} : ${n - m}, quelle est la proportion (en %) de la première grandeur par rapport au total ?`,
    answer,
    steps: [`\\text{Total} = ${m} + ${n - m} = ${n}`, `\\dfrac{${m}}{${n}} \\times 100 = ${answer}\\%`],
  };
}

// ---------- 4. Partager une quantité selon un ratio ----------
function genPartagerSelonRatioNumeric() {
  const [p, q] = coprimePair(2, 9);
  const k = randInt(2, 20);
  const total = (p + q) * k;
  const partP = p * k;
  const partQ = q * k;
  const askP = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Proportionnalité — Ratios",
    prompt: `On partage ${total} € selon le ratio ${p} : ${q}. Quelle est la part correspondant ${askP ? "à la première grandeur" : "à la seconde grandeur"} ?`,
    answer: askP ? partP : partQ,
    steps: [`${p} + ${q} = ${p + q} \\text{ parts}`, `\\text{Une part} = \\dfrac{${total}}{${p + q}} = ${k}`, `\\text{Première grandeur} = ${p} \\times ${k} = ${partP}`, `\\text{Seconde grandeur} = ${q} \\times ${k} = ${partQ}`],
  };
}

// ---------- 5. Recette à l'échelle (proportionnalité, produit en croix) ----------
function genRecetteEchelleNumeric() {
  const u = randInt(5, 40);
  const qty1 = randInt(2, 9);
  const mass1 = u * qty1;
  let qty2;
  do {
    qty2 = randInt(2, 20);
  } while (qty2 === qty1);
  const mass2 = u * qty2;
  return {
    type: "numeric",
    chapter: "Proportionnalité — Ratios",
    prompt: `Une recette utilise ${qty1} unités d'un ingrédient pour une masse totale de ${mass1} g. Quelle masse totale correspond à ${qty2} unités (même recette) ?`,
    answer: mass2,
    steps: [`\\text{Masse par unité} = \\dfrac{${mass1}}{${qty1}} = ${u}\\text{ g}`, `${u} \\times ${qty2} = ${mass2}\\text{ g}`],
  };
}

// ---------- 6. Deux nombres dans un ratio donné avec une différence connue ----------
function genDeuxNombresRatioDifferenceNumeric() {
  let p, q;
  do {
    p = randInt(2, 9);
    q = randInt(2, 9);
  } while (gcd(p, q) !== 1 || p <= q);
  const g = randInt(2, 9);
  const diff = (p - q) * g;
  const x = p * g;
  const y = q * g;
  const askX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Proportionnalité — Ratios",
    prompt: `Deux nombres positifs x et y (avec x > y) sont dans le ratio ${p} : ${q} et leur différence vaut ${diff}. Quelle est la valeur de ${askX ? "x" : "y"} ?`,
    answer: askX ? x : y,
    steps: [`x = ${p}k \\text{ et } y = ${q}k \\text{ pour un même } k`, `${p}k - ${q}k = ${diff}`, `${p - q}k = ${diff}, \\text{ donc } k = ${g}`, `x = ${x}, \\quad y = ${y}`],
  };
}

// =========================== Évolutions en pourcentage ===========================

// ---------- 7. Coefficient multiplicateur d'une évolution ----------
function genCoefficientMultiplicateurNumeric() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 95);
  const answer = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Évolutions en pourcentage",
    prompt: `Une grandeur ${direction === "augmente" ? "augmente" : "diminue"} de ${p} %. Quel est le coefficient multiplicateur correspondant ?`,
    answer,
    tolerance: 0.001,
    steps: [direction === "augmente" ? `1 + \\dfrac{${p}}{100} = ${fr(answer)}` : `1 - \\dfrac{${p}}{100} = ${fr(answer)}`],
  };
}

// ---------- 8. Pourcentage d'évolution à partir d'un coefficient multiplicateur ----------
function genPourcentageDepuisCoefficientNumeric() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 95);
  const cm = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Évolutions en pourcentage",
    prompt: `Un coefficient multiplicateur de ${fr(cm)} correspond à une ${direction === "augmente" ? "augmentation" : "diminution"} de quel pourcentage ?`,
    answer: p,
    steps: [direction === "augmente" ? `${fr(cm)} - 1 = ${fr(roundTo(p / 100, 2))} = ${p}\\%` : `1 - ${fr(cm)} = ${fr(roundTo(p / 100, 2))} = ${p}\\%`],
  };
}

// ---------- 9. Taux d'évolution à partir de deux prix ----------
function genTauxEvolutionDepuisPrixNumeric() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 95);
  const cm = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  const P0 = randInt(20, 900);
  const P1 = roundTo(P0 * cm, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Évolutions en pourcentage",
    prompt: `Le prix d'un article passe de ${P0} € à ${fr(P1)} €. Calcule le pourcentage d'évolution, en valeur absolue (sans préciser s'il s'agit d'une hausse ou d'une baisse).`,
    answer: p,
    steps: [`\\text{Coefficient multiplicateur} = \\dfrac{${fr(P1)}}{${P0}} = ${fr(cm)}`, direction === "augmente" ? `${fr(cm)} - 1 = ${p}\\%` : `1 - ${fr(cm)} = ${p}\\%`],
  };
}

// ---------- 10. Calculer le prix final après une évolution ----------
function genCalculerPrixFinalNumeric() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 95);
  const cm = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  const P0 = randInt(20, 900);
  const P1 = roundTo(P0 * cm, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Évolutions en pourcentage",
    prompt: `Un article coûte ${P0} €. Son prix ${direction === "augmente" ? "augmente" : "diminue"} de ${p} %. Quel est son nouveau prix (en €) ?`,
    answer: P1,
    tolerance: 0.01,
    steps: [`${P0} \\times ${fr(cm)} = ${fr(P1)}`],
  };
}

// ---------- 11. Retrouver le prix initial à partir du prix final ----------
function genCalculerPrixInitialNumeric() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 95);
  const cm = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  const P0 = randInt(20, 900);
  const P1 = roundTo(P0 * cm, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Évolutions en pourcentage",
    prompt: `Après une ${direction === "augmente" ? "augmentation" : "diminution"} de ${p} %, un article coûte ${fr(P1)} €. Quel était son prix initial (en €) ?`,
    answer: P0,
    tolerance: 0.01,
    steps: [`\\text{Coefficient multiplicateur} = ${fr(cm)}`, `\\text{Prix initial} = \\dfrac{${fr(P1)}}{${fr(cm)}} = ${P0}`],
  };
}

// ---------- 12. Enchaîner deux évolutions successives ----------
function genEnchainementDeuxEvolutionsNumeric() {
  const P0 = randInt(20, 500);
  const p1 = randInt(5, 50);
  const p2 = randInt(5, 50);
  const dir1 = pick(["augmente", "diminue"]);
  const dir2 = pick(["augmente", "diminue"]);
  const cm1 = dir1 === "augmente" ? roundTo(1 + p1 / 100, 2) : roundTo(1 - p1 / 100, 2);
  const cm2 = dir2 === "augmente" ? roundTo(1 + p2 / 100, 2) : roundTo(1 - p2 / 100, 2);
  const P1 = roundTo(P0 * cm1, 2);
  const P2 = roundTo(P1 * cm2, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Évolutions en pourcentage",
    prompt: `Un article coûte ${P0} €. Son prix ${dir1 === "augmente" ? "augmente" : "diminue"} d'abord de ${p1} %, puis ${dir2 === "augmente" ? "augmente" : "diminue"} de ${p2} %. Quel est le prix final (en €) ?`,
    answer: P2,
    tolerance: 0.02,
    steps: [`${P0} \\times ${fr(cm1)} = ${fr(P1)}`, `${fr(P1)} \\times ${fr(cm2)} = ${fr(P2)}`],
  };
}

// ---------- 13. Coefficient réciproque pour revenir au prix de départ ----------
function genCoefficientReciproqueNumeric() {
  const pairs = [
    [20, 25],
    [50, 100],
    [60, 150],
    [75, 300],
    [80, 400],
  ];
  const [pDown, pUp] = pick(pairs);
  const cmDown = roundTo(1 - pDown / 100, 2);
  const cmUp = roundTo(1 + pUp / 100, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Évolutions en pourcentage",
    prompt: `Une action subit une baisse de ${pDown} %. Quel pourcentage d'augmentation permettrait de revenir exactement au prix de départ ?`,
    answer: pUp,
    steps: [`\\text{Coefficient de la baisse} = 1 - \\dfrac{${pDown}}{100} = ${fr(cmDown)}`, `\\text{Coefficient pour revenir au prix de départ} = \\dfrac{1}{${fr(cmDown)}} = ${fr(cmUp)}`, `\\text{Ce qui correspond à une augmentation de } ${pUp}\\%`],
  };
}

// ---------- 14. Comparer deux offres de réduction ----------
function genComparerDeuxReductionsQCM() {
  let P0, pSimple, p1, p2, cmSimple, finalSimple, cm1, cm2, finalDouble;
  do {
    P0 = randInt(50, 300);
    pSimple = randInt(20, 50);
    p1 = randInt(10, 30);
    p2 = randInt(10, 30);
    cmSimple = roundTo(1 - pSimple / 100, 2);
    finalSimple = roundTo(P0 * cmSimple, 2);
    cm1 = roundTo(1 - p1 / 100, 2);
    cm2 = roundTo(1 - p2 / 100, 2);
    finalDouble = roundTo(roundTo(P0 * cm1, 2) * cm2, 2);
  } while (finalSimple === finalDouble);
  const answer = finalSimple < finalDouble ? "Offre A" : "Offre B";
  return {
    type: "qcm",
    chapter: "Proportionnalité — Évolutions en pourcentage",
    prompt: `Un article coûte ${P0} €. L'offre A applique une réduction unique de ${pSimple} %. L'offre B applique deux réductions successives de ${p1} % puis ${p2} %. Quelle offre est la plus avantageuse (prix final le plus bas) ?`,
    answer,
    options: ["Offre A", "Offre B"],
    steps: [`\\text{Offre A} : ${P0} \\times ${fr(cmSimple)} = ${fr(finalSimple)}\\text{ €}`, `\\text{Offre B} : ${P0} \\times ${fr(cm1)} \\times ${fr(cm2)} = ${fr(finalDouble)}\\text{ €}`],
  };
}

const GENERATORS = [
  genSimplifierRatioNumeric,
  genRatioEquivalentQCM,
  genPourcentageDepuisRatioNumeric,
  genPartagerSelonRatioNumeric,
  genRecetteEchelleNumeric,
  genDeuxNombresRatioDifferenceNumeric,
  genCoefficientMultiplicateurNumeric,
  genPourcentageDepuisCoefficientNumeric,
  genTauxEvolutionDepuisPrixNumeric,
  genCalculerPrixFinalNumeric,
  genCalculerPrixInitialNumeric,
  genEnchainementDeuxEvolutionsNumeric,
  genCoefficientReciproqueNumeric,
  genComparerDeuxReductionsQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "proportionnalite-troisieme",
    title: "Situations de proportionnalité",
    description: "Ratios (simplifier, partager, échelle), coefficient multiplicateur d'une évolution en pourcentage, prix final/initial, enchaînement d'évolutions et comparaison d'offres de réduction.",
    level: "troisieme",
    free: false,
    order: 8,
  },
  generate,
};
