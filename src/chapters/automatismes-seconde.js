// ---------------------------------------------------------------------------
// Chapitre : Automatismes (2nde) — gratuit, freemium (5 questions/jour sans
// abonnement, illimité avec abonnement). Regroupe les mini-exercices de
// calcul rapide en tête de chaque chapitre du manuel de 2nde, un thème par
// chapitre du sommaire (voir THEMES ci-dessous) ; sera enrichi au fur et à
// mesure que les autres chapitres 2nde seront écrits — voir
// automatismes-troisieme.js pour le même principe en 3e.
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

// =========================== Chapitre 0 : Nombres et calculs ===========================
// (Mini-exercices "Calcul mental" en tête de page : priorités opératoires,
// puissances, racines carrées simples.)

// ---------- 1. Priorités opératoires (mental) ----------
function genAutoPrioritesMental() {
  const a = randInt(-15, 15);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const produit = b * c;
  const answer = a + produit;
  return {
    type: "numeric",
    chapter: "Automatismes — Nombres et calculs",
    prompt: `Calcule en respectant les priorités : \\(${a} + ${b} \\times (${c >= 0 ? "+" : ""}${c})\\)`,
    answer,
    steps: [`${b} \\times ${c} = ${produit}`, `${a} + ${produit} = ${answer}`],
  };
}

// ---------- 2. Puissance d'un nombre relatif (mental) ----------
function genAutoPuissanceMental() {
  const n = nonZero(-9, 9);
  const exp = pick([2, 3]);
  return {
    type: "numeric",
    chapter: "Automatismes — Nombres et calculs",
    prompt: `Calcule : \\((${n})^{${exp}}\\)`,
    answer: n ** exp,
    steps: [`${n}^{${exp}} = ${n ** exp}`],
  };
}

// ---------- 3. Racine carrée d'un carré parfait (mental) ----------
function genAutoRacineCarreeMental() {
  const n = randInt(2, 20);
  return {
    type: "numeric",
    chapter: "Automatismes — Nombres et calculs",
    prompt: `Calcule : \\(\\sqrt{${n * n}}\\)`,
    answer: n,
    steps: [`\\sqrt{${n * n}} = ${n}`],
  };
}

// ---------- 4. Valeur absolue simple (mental) ----------
function genAutoValeurAbsolueMental() {
  const a = randInt(-30, 30);
  const b = randInt(-30, 30);
  return {
    type: "numeric",
    chapter: "Automatismes — Nombres et calculs",
    prompt: `Calcule : \\(|${a} - (${b})|\\)`,
    answer: Math.abs(a - b),
    steps: [`|${a - b}| = ${Math.abs(a - b)}`],
  };
}

// ---------- 5. Appartenance à un intervalle (mental) ----------
function genAutoAppartientIntervalleMental() {
  const a = randInt(-10, 5);
  const b = randInt(a + 2, a + 15);
  const dedans = Math.random() < 0.5;
  const x = dedans ? randInt(a, b) : pick([randInt(a - 10, a - 1), randInt(b + 1, b + 10)]);
  return {
    type: "qcm",
    chapter: "Automatismes — Nombres et calculs",
    prompt: `${x} appartient-il à l'intervalle \\([${a} ; ${b}]\\) ?`,
    answer: dedans ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [dedans ? "Oui" : "Non"],
  };
}

const CH_NOMBRES_CALCULS_S = [genAutoPrioritesMental, genAutoPuissanceMental, genAutoRacineCarreeMental, genAutoValeurAbsolueMental, genAutoAppartientIntervalleMental];

// =========================== Chapitre 1 : Généralités sur les fonctions ===========================

// ---------- 1. Calculer une image (mental) ----------
function genAutoImageMental() {
  const nom = pick(["f", "g", "h"]);
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const x = randInt(-6, 6);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Généralités sur les fonctions",
    prompt: `\\(${nom}(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(${nom}(${x})\\).`,
    answer,
    steps: [`${nom}(${x}) = ${answer}`],
  };
}

// ---------- 2. Vocabulaire image/antécédent (mental) ----------
function genAutoVocabulaireMental() {
  const nom = pick(["f", "g", "h"]);
  const a = randInt(-8, 8);
  let b = randInt(-8, 8);
  while (b === a) b = randInt(-8, 8);
  const surAntecedent = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Automatismes — Généralités sur les fonctions",
    prompt: `On sait que \\(${nom}(${a}) = ${b}\\). ${surAntecedent ? `Quel est l'antécédent de ${b} par ${nom} ?` : `Quelle est l'image de ${a} par ${nom} ?`}`,
    answer: String(surAntecedent ? a : b),
    options: shuffle([String(a), String(b)]),
    steps: [`${nom}(${a}) = ${b}`],
  };
}

// ---------- 3. Nombre d'antécédents depuis un petit tableau (mental) ----------
function genAutoNombreAntecedentsMental() {
  const nom = pick(["f", "g", "h"]);
  const xs = [-1, 0, 1];
  const valeurRepetee = randInt(-5, 5);
  const nbRepetitions = pick([1, 2]);
  const indices = shuffle([0, 1, 2]).slice(0, nbRepetitions);
  const ys = xs.map((_, i) => (indices.includes(i) ? valeurRepetee : valeurRepetee + nonZero(1, 3)));
  const nb = ys.filter((y) => y === valeurRepetee).length;
  return {
    type: "qcm",
    chapter: "Automatismes — Généralités sur les fonctions",
    prompt: `${xs.map((x, i) => `${nom}(${x}) = ${ys[i]}`).join(", ")}. Combien ${valeurRepetee} a-t-il d'antécédents ?`,
    answer: String(nb),
    options: ["0", "1", "2", "3"],
    steps: [`${valeurRepetee} apparaît ${nb} fois comme image.`],
  };
}

// ---------- 4. Ensemble de définition — dénominateur (mental) ----------
function genAutoEnsembleDefinitionMental() {
  const nom = pick(["f", "g", "h"]);
  const valeurExclue = randInt(-6, 6);
  const testeExclue = Math.random() < 0.5;
  const xTest = testeExclue ? valeurExclue : valeurExclue + nonZero(1, 4);
  const definie = xTest !== valeurExclue;
  return {
    type: "qcm",
    chapter: "Automatismes — Généralités sur les fonctions",
    prompt: `\\(${nom}(x) = \\dfrac{1}{x - ${valeurExclue}}\\). ${xTest} appartient-il à l'ensemble de définition de ${nom} ?`,
    answer: definie ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`Il faut \\(x \\neq ${valeurExclue}\\).`],
  };
}

// ---------- 5. Fonction paire ou impaire (mental) ----------
function genAutoPariteMental() {
  const nom = pick(["f", "g", "h"]);
  const paire = Math.random() < 0.5;
  const a = nonZero(2, 9);
  const imageA = nonZero(-9, 9);
  const answer = paire ? imageA : -imageA;
  return {
    type: "numeric",
    chapter: "Automatismes — Généralités sur les fonctions",
    prompt: `${nom} est ${paire ? "paire" : "impaire"} et \\(${nom}(${a}) = ${imageA}\\). Que vaut \\(${nom}(${-a})\\) ?`,
    answer,
    steps: [paire ? `${nom}(-x) = ${nom}(x)` : `${nom}(-x) = -${nom}(x)`, `${nom}(${-a}) = ${answer}`],
  };
}

const CH_GENERALITES_FONCTIONS_S = [genAutoImageMental, genAutoVocabulaireMental, genAutoNombreAntecedentsMental, genAutoEnsembleDefinitionMental, genAutoPariteMental];

// =========================== Chapitre 2 : Variations de fonctions ===========================

function buildProfileMental(directions) {
  const nomF = pick(["f", "g", "h"]);
  const xs = [randInt(-5, -2)];
  for (let i = 0; i < directions.length; i++) xs.push(xs[xs.length - 1] + randInt(2, 3));
  const ys = [randInt(-5, 5)];
  for (let i = 0; i < directions.length; i++) {
    const delta = randInt(2, 5);
    ys.push(directions[i] === "croissante" ? ys[ys.length - 1] + delta : ys[ys.length - 1] - delta);
  }
  return { nomF, xs, ys, directions };
}

// ---------- 1. Lire une image sur un tableau à deux morceaux (mental) ----------
function genAutoLireTableauMental() {
  const profile = buildProfileMental([pick(["croissante", "décroissante"]), pick(["croissante", "décroissante"])]);
  const idx = randInt(0, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Variations de fonctions",
    prompt: `\\(${profile.nomF}(${profile.xs[0]}) = ${profile.ys[0]}\\), \\(${profile.nomF}(${profile.xs[1]}) = ${profile.ys[1]}\\), \\(${profile.nomF}(${profile.xs[2]}) = ${profile.ys[2]}\\). Que vaut \\(${profile.nomF}(${profile.xs[idx]})\\) ?`,
    answer: profile.ys[idx],
    steps: [`${profile.nomF}(${profile.xs[idx]}) = ${profile.ys[idx]}`],
  };
}

// ---------- 2. Sens de variation (mental) ----------
function genAutoSensVariationMental() {
  const direction = pick(["croissante", "décroissante"]);
  const nomF = pick(["f", "g", "h"]);
  const a = randInt(-5, -1);
  const b = a + randInt(2, 5);
  const ya = randInt(-6, 6);
  const yb = direction === "croissante" ? ya + nonZero(1, 6) : ya - nonZero(1, 6);
  return {
    type: "qcm",
    chapter: "Automatismes — Variations de fonctions",
    prompt: `${nomF}(${a}) = ${ya} et ${nomF}(${b}) = ${yb}, avec ${nomF} monotone sur \\([${a} ; ${b}]\\). Quel est son sens de variation sur cet intervalle ?`,
    answer: direction,
    options: ["croissante", "décroissante"],
    steps: [`${yb > ya ? "L'image augmente" : "L'image diminue"} : ${nomF} est ${direction} sur \\([${a} ; ${b}]\\).`],
  };
}

// ---------- 3. Maximum ou minimum d'un petit tableau (mental) ----------
function genAutoMaxMinMental() {
  const profile = buildProfileMental([pick(["croissante", "décroissante"]), pick(["croissante", "décroissante"])]);
  const demanderMax = Math.random() < 0.5;
  const answer = demanderMax ? Math.max(...profile.ys) : Math.min(...profile.ys);
  return {
    type: "numeric",
    chapter: "Automatismes — Variations de fonctions",
    prompt: `\\(${profile.nomF}(${profile.xs[0]}) = ${profile.ys[0]}\\), \\(${profile.nomF}(${profile.xs[1]}) = ${profile.ys[1]}\\), \\(${profile.nomF}(${profile.xs[2]}) = ${profile.ys[2]}\\). Quel est le ${demanderMax ? "maximum" : "minimum"} de ${profile.nomF} ?`,
    answer,
    steps: [`Le ${demanderMax ? "maximum" : "minimum"} parmi ${profile.ys.join(", ")} est ${answer}.`],
  };
}

// ---------- 4. Comparer deux images sur un même morceau monotone (mental) ----------
function genAutoComparerImagesMental() {
  const nomF = pick(["f", "g", "h"]);
  const direction = pick(["croissante", "décroissante"]);
  const a = randInt(-5, -1);
  const b = a + randInt(2, 5);
  const bonneReponse = direction === "croissante" ? `${nomF}(${a}) < ${nomF}(${b})` : `${nomF}(${a}) > ${nomF}(${b})`;
  const mauvaise = direction === "croissante" ? `${nomF}(${a}) > ${nomF}(${b})` : `${nomF}(${a}) < ${nomF}(${b})`;
  return {
    type: "qcm",
    chapter: "Automatismes — Variations de fonctions",
    prompt: `${nomF} est ${direction} sur \\([${a} ; ${b}]\\). Que peut-on dire de ${nomF}(${a}) et ${nomF}(${b}) ?`,
    answer: bonneReponse,
    options: [bonneReponse, mauvaise],
    steps: [bonneReponse],
  };
}

// ---------- 5. Nombre de solutions de f(x) = extremum (mental) ----------
function genAutoNombreSolutionsMental() {
  const nomF = pick(["f", "g", "h"]);
  const typeExtremum = pick(["maximum", "minimum"]);
  return {
    type: "qcm",
    chapter: "Automatismes — Variations de fonctions",
    prompt: `${nomF} est strictement croissante puis strictement décroissante sur \\([-3 ; 3]\\), avec un ${typeExtremum === "maximum" ? "maximum" : "maximum (donc un seul pic)"} atteint en \\(x = 0\\). Combien de fois ${nomF} atteint-elle ce maximum sur \\([-3 ; 3]\\) ?`,
    answer: "1",
    options: ["0", "1", "2"],
    steps: ["Le pic n'est atteint qu'une seule fois, en x = 0."],
  };
}

const CH_VARIATIONS_FONCTIONS_S = [genAutoLireTableauMental, genAutoSensVariationMental, genAutoMaxMinMental, genAutoComparerImagesMental, genAutoNombreSolutionsMental];

// =========================== Chapitre 3 : Fonctions affines ===========================

// ---------- 1. Identifier coefficient directeur / ordonnée à l'origine (mental) ----------
function genAutoCoefficientsMental() {
  const nom = pick(["f", "g", "h"]);
  const a = nonZero(-9, 9);
  const b = randInt(-10, 10);
  const demanderA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions affines",
    prompt: `\\(${nom}(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Quel est ${demanderA ? "le coefficient directeur" : "l'ordonnée à l'origine"} ?`,
    answer: demanderA ? a : b,
    steps: [demanderA ? `Coefficient directeur : ${a}` : `Ordonnée à l'origine : ${b}`],
  };
}

// ---------- 2. Sens de variation selon le signe de a (mental) ----------
function genAutoSensAffineMental() {
  const nom = pick(["f", "g", "h"]);
  const a = pick([nonZero(-9, -1), nonZero(1, 9)]);
  const sens = a > 0 ? "croissante" : "décroissante";
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions affines",
    prompt: `${nom} est une fonction affine de coefficient directeur ${a}. Quel est son sens de variation ?`,
    answer: sens,
    options: ["croissante", "décroissante"],
    steps: [`Le coefficient directeur est ${a > 0 ? "positif" : "négatif"} : ${nom} est ${sens}.`],
  };
}

// ---------- 3. Calculer une image (mental) ----------
function genAutoImageAffineMental() {
  const nom = pick(["f", "g", "h"]);
  const a = nonZero(-9, 9);
  const b = randInt(-10, 10);
  const x = randInt(-6, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions affines",
    prompt: `\\(${nom}(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(${nom}(${x})\\).`,
    answer: a * x + b,
    steps: [`${nom}(${x}) = ${a * x + b}`],
  };
}

// ---------- 4. Résoudre une équation affine simple (mental) ----------
function genAutoResoudreAffineMental() {
  const a = nonZero(-9, 9);
  const b = randInt(-10, 10);
  const xSol = randInt(-10, 10);
  const k = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions affines",
    prompt: `Résous : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${k}\\)`,
    answer: xSol,
    steps: [`x = ${xSol}`],
  };
}

// ---------- 5. Reconnaître une fonction affine (mental) ----------
function genAutoReconnaitreAffineMental() {
  const nom = pick(["f", "g", "h"]);
  const estAffine = Math.random() < 0.5;
  const a = nonZero(-6, 6);
  const b = randInt(-8, 8);
  if (estAffine) {
    return {
      type: "qcm",
      chapter: "Automatismes — Fonctions affines",
      prompt: `\\(${nom}(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). ${nom} est-elle une fonction affine ?`,
      answer: "Oui",
      options: ["Oui", "Non"],
      steps: ["C'est bien de la forme ax + b."],
    };
  }
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions affines",
    prompt: `\\(${nom}(x) = x^2 ${a >= 0 ? "+" : "-"} ${Math.abs(a)}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). ${nom} est-elle une fonction affine ?`,
    answer: "Non",
    options: ["Oui", "Non"],
    steps: ["Il y a un terme en x² : ce n'est pas une fonction affine."],
  };
}

const CH_FONCTIONS_AFFINES_S = [genAutoCoefficientsMental, genAutoSensAffineMental, genAutoImageAffineMental, genAutoResoudreAffineMental, genAutoReconnaitreAffineMental];

// =========================== Chapitre 4 : Fonctions de référence ===========================

// ---------- 1. Image par carré, cube ou racine carrée (mental) ----------
function genAutoImageReferenceMental() {
  const type = pick(["carré", "cube", "racine carrée"]);
  if (type === "carré") {
    const x = randInt(-12, 12);
    return {
      type: "numeric",
      chapter: "Automatismes — Fonctions de référence",
      prompt: `Calcule l'image de ${x} par la fonction carré.`,
      answer: x * x,
      steps: [`${x}^2 = ${x * x}`],
    };
  }
  if (type === "cube") {
    const x = randInt(-5, 5);
    return {
      type: "numeric",
      chapter: "Automatismes — Fonctions de référence",
      prompt: `Calcule l'image de ${x} par la fonction cube.`,
      answer: x ** 3,
      steps: [`${x}^3 = ${x ** 3}`],
    };
  }
  const racine = randInt(0, 12);
  const x = racine * racine;
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions de référence",
    prompt: `Calcule l'image de ${x} par la fonction racine carrée.`,
    answer: racine,
    steps: [`\\sqrt{${x}} = ${racine}`],
  };
}

// ---------- 2. Nombre d'antécédents par la fonction carré (mental) ----------
function genAutoAntecedentsCarreMental() {
  const cas = pick(["positif", "négatif", "nul"]);
  const k = cas === "nul" ? 0 : cas === "positif" ? nonZero(1, 100) : nonZero(-100, -1);
  const nb = cas === "négatif" ? 0 : cas === "nul" ? 1 : 2;
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions de référence",
    prompt: `Combien le nombre ${k} a-t-il d'antécédents par la fonction carré ?`,
    answer: String(nb),
    options: ["0", "1", "2"],
    steps: [`${nb} antécédent(s).`],
  };
}

// ---------- 3. Sens de variation carré/inverse (mental) ----------
function genAutoSensReferenceMental() {
  const fonction = pick(["carré", "inverse"]);
  const surPositifs = Math.random() < 0.5;
  const reponse = fonction === "carré" ? (surPositifs ? "croissante" : "décroissante") : "décroissante";
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions de référence",
    prompt: `Quel est le sens de variation de la fonction ${fonction} sur \\(${surPositifs ? "]0 ; +\\infty[" : "]-\\infty ; 0["}\\) ?`,
    answer: reponse,
    options: ["croissante", "décroissante"],
    steps: [`La fonction ${fonction} est ${reponse} sur cet intervalle.`],
  };
}

// ---------- 4. Comparer deux carrés (mental) ----------
function genAutoComparerCarresMental() {
  const a = randInt(1, 12);
  let b = randInt(1, 12);
  while (b === a) b = randInt(1, 12);
  const [xmin, xmax] = a < b ? [a, b] : [b, a];
  const bonneReponse = `${xmin}^2 < ${xmax}^2`;
  const mauvaise = `${xmin}^2 > ${xmax}^2`;
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions de référence",
    prompt: `On a \\(${xmin} < ${xmax}\\), tous deux positifs. Que peut-on dire de \\(${xmin}^2\\) et \\(${xmax}^2\\) ?`,
    answer: bonneReponse,
    options: [bonneReponse, mauvaise],
    steps: [`La fonction carré est croissante sur les positifs.`],
  };
}

// ---------- 5. Résoudre x² = a (mental) ----------
function genAutoResoudreCarreMental() {
  const r = nonZero(1, 10);
  const a = r * r;
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions de référence",
    prompt: `Résous \\(x^2 = ${a}\\).`,
    answer: `{-${r} ; ${r}}`,
    options: [`{-${r} ; ${r}}`, `{${r}}`, `\\emptyset`],
    steps: [`x = \\pm ${r}`],
  };
}

const CH_FONCTIONS_REFERENCE_S = [genAutoImageReferenceMental, genAutoAntecedentsCarreMental, genAutoSensReferenceMental, genAutoComparerCarresMental, genAutoResoudreCarreMental];

// =========================== Chapitre 5 : Repérage et configurations dans le plan ===========================

const TRIPLETS_PYTHAGORICIENS_S = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
];

// ---------- 1. Coordonnées du milieu (mental) ----------
function genAutoMilieuMental() {
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const xB = randInt(-10, 10);
  const yB = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Repérage dans le plan",
    prompt: `A(${xA} ; ${yA}) et B(${xB} ; ${yB}). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} du milieu de [AB] ?`,
    answer: demanderAbscisse ? (xA + xB) / 2 : (yA + yB) / 2,
    steps: [demanderAbscisse ? `(${xA} + ${xB}) / 2 = ${(xA + xB) / 2}` : `(${yA} + ${yB}) / 2 = ${(yA + yB) / 2}`],
  };
}

// ---------- 2. Distance entre deux points (mental) ----------
function genAutoDistanceMental() {
  const [a, b, c] = pick(TRIPLETS_PYTHAGORICIENS_S);
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const xB = xA + a;
  const yB = yA + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Repérage dans le plan",
    prompt: `Repère orthonormé. A(${xA} ; ${yA}) et B(${xB} ; ${yB}). Calcule AB.`,
    answer: c,
    steps: [`AB = \\sqrt{${a}^2 + ${b}^2} = ${c}`],
  };
}

// ---------- 3. Alignement de trois points (mental) ----------
function genAutoAlignementMental() {
  const xA = randInt(-6, 6);
  const yA = randInt(-6, 6);
  const dx = nonZero(-3, 3);
  const dy = nonZero(-3, 3);
  const alignes = Math.random() < 0.5;
  const xB = xA + dx;
  const yB = yA + dy;
  const xC = alignes ? xA + 2 * dx : xA + 2 * dx + nonZero(1, 2);
  const yC = alignes ? yA + 2 * dy : yA + 2 * dy;
  const produitCroise = (xB - xA) * (yC - yA) - (yB - yA) * (xC - xA);
  const reponse = produitCroise === 0 ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Automatismes — Repérage dans le plan",
    prompt: `A(${xA} ; ${yA}), B(${xB} ; ${yB}), C(${xC} ; ${yC}). Ces points sont-ils alignés ?`,
    answer: reponse,
    options: ["Oui", "Non"],
    steps: [reponse],
  };
}

// ---------- 4. Parallélogramme via milieu commun (mental) ----------
function genAutoParallelogrammeMental() {
  const xA = randInt(-6, 6);
  const yA = randInt(-6, 6);
  const xB = randInt(-6, 6);
  const yB = randInt(-6, 6);
  const xC = randInt(-6, 6);
  const yC = randInt(-6, 6);
  const estParallelogramme = Math.random() < 0.5;
  const xD_correct = xA + xC - xB;
  const yD_correct = yA + yC - yB;
  const xD = estParallelogramme ? xD_correct : xD_correct + nonZero(1, 3);
  const yD = yD_correct;
  return {
    type: "qcm",
    chapter: "Automatismes — Repérage dans le plan",
    prompt: `A(${xA} ; ${yA}), B(${xB} ; ${yB}), C(${xC} ; ${yC}), D(${xD} ; ${yD}). ABCD est-il un parallélogramme ?`,
    answer: estParallelogramme ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [estParallelogramme ? "Les diagonales [AC] et [BD] ont le même milieu." : "Les diagonales [AC] et [BD] n'ont pas le même milieu."],
  };
}

// ---------- 5. Type de repère (mental) ----------
function genAutoTypeRepereMental() {
  const angleDroit = Math.random() < 0.7;
  const memeUnite = Math.random() < 0.5;
  const uniteX = randInt(1, 3);
  const uniteY = memeUnite ? uniteX : uniteX + nonZero(1, 3);
  let reponse;
  if (!angleDroit) reponse = "ni orthogonal ni orthonormé";
  else if (uniteX === uniteY) reponse = "orthonormé";
  else reponse = "orthogonal (mais pas orthonormé)";
  return {
    type: "qcm",
    chapter: "Automatismes — Repérage dans le plan",
    prompt: `Angle des axes : ${angleDroit ? "90°" : "70°"}, OI = ${uniteX} cm, OJ = ${uniteY} cm. Quel type de repère ?`,
    answer: reponse,
    options: ["orthonormé", "orthogonal (mais pas orthonormé)", "ni orthogonal ni orthonormé"],
    steps: [reponse],
  };
}

const CH_REPERAGE_CONFIGURATIONS_S = [genAutoMilieuMental, genAutoDistanceMental, genAutoAlignementMental, genAutoParallelogrammeMental, genAutoTypeRepereMental];

// =========================== Chapitre 6 : Notion de vecteur ===========================

// ---------- 1. Coordonnées d'un vecteur (mental) ----------
function genAutoCoordonneesVecteurMental() {
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const xB = randInt(-10, 10);
  const yB = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Notion de vecteur",
    prompt: `A(${xA} ; ${yA}), B(${xB} ; ${yB}). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} du vecteur \\(\\overrightarrow{AB}\\) ?`,
    answer: demanderAbscisse ? xB - xA : yB - yA,
    steps: [demanderAbscisse ? `${xB} - ${xA} = ${xB - xA}` : `${yB} - ${yA} = ${yB - yA}`],
  };
}

// ---------- 2. Norme d'un vecteur (mental) ----------
function genAutoNormeVecteurMental() {
  const [dx, dy, norme] = pick([
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
  ]);
  return {
    type: "numeric",
    chapter: "Automatismes — Notion de vecteur",
    prompt: `Repère orthonormé. \\(\\vec{u}(${dx} ; ${dy})\\). Calcule \\(\\|\\vec{u}\\|\\).`,
    answer: norme,
    steps: [`\\sqrt{${dx}^2+${dy}^2} = ${norme}`],
  };
}

// ---------- 3. Image d'un point par une translation (mental) ----------
function genAutoImageTranslationMental() {
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const dx = randInt(-10, 10);
  const dy = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Notion de vecteur",
    prompt: `A(${xA} ; ${yA}), translation de vecteur \\(\\vec{u}(${dx} ; ${dy})\\). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de l'image de A ?`,
    answer: demanderAbscisse ? xA + dx : yA + dy,
    steps: [demanderAbscisse ? `${xA} + ${dx} = ${xA + dx}` : `${yA} + ${dy} = ${yA + dy}`],
  };
}

// ---------- 4. Vecteur opposé (mental) ----------
function genAutoVecteurOpposeMental() {
  const x = randInt(-12, 12);
  const y = randInt(-12, 12);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Notion de vecteur",
    prompt: `\\(\\vec{u}(${x} ; ${y})\\). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} du vecteur opposé \\(-\\vec{u}\\) ?`,
    answer: demanderAbscisse ? -x : -y,
    steps: [demanderAbscisse ? `-(${x}) = ${-x}` : `-(${y}) = ${-y}`],
  };
}

// ---------- 5. Somme de deux vecteurs (mental) ----------
function genAutoSommeVecteursMental() {
  const xU = randInt(-10, 10);
  const yU = randInt(-10, 10);
  const xV = randInt(-10, 10);
  const yV = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Notion de vecteur",
    prompt: `\\(\\vec{u}(${xU} ; ${yU})\\), \\(\\vec{v}(${xV} ; ${yV})\\). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de \\(\\vec{u} + \\vec{v}\\) ?`,
    answer: demanderAbscisse ? xU + xV : yU + yV,
    steps: [demanderAbscisse ? `${xU} + ${xV} = ${xU + xV}` : `${yU} + ${yV} = ${yU + yV}`],
  };
}

const CH_VECTEURS_S = [genAutoCoordonneesVecteurMental, genAutoNormeVecteurMental, genAutoImageTranslationMental, genAutoVecteurOpposeMental, genAutoSommeVecteursMental];

// =========================== Chapitre 7 : Colinéarité de vecteurs ===========================

// ---------- 1. Calculer un déterminant (mental) ----------
function genAutoDeterminantMental() {
  const a = randInt(-8, 8);
  const b = randInt(-8, 8);
  const c = randInt(-8, 8);
  const d = randInt(-8, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Colinéarité de vecteurs",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\), \\(\\vec{v}(${c} ; ${d})\\). Calcule \\(\\det(\\vec{u},\\vec{v}) = x_{\\vec{u}} y_{\\vec{v}} - x_{\\vec{v}} y_{\\vec{u}}\\).`,
    answer: a * d - b * c,
    steps: [`${a} \\times ${d} - ${c} \\times ${b} = ${a * d - b * c}`],
  };
}

// ---------- 2. Vecteurs colinéaires ? (mental) ----------
function genAutoColineaireMental() {
  const a = nonZero(-7, 7);
  const b = nonZero(-7, 7);
  const colineaires = Math.random() < 0.5;
  const k = nonZero(-3, 3);
  const c = colineaires ? k * a : k * a + nonZero(1, 2);
  const d = k * b;
  const det = a * d - b * c;
  return {
    type: "qcm",
    chapter: "Automatismes — Colinéarité de vecteurs",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\), \\(\\vec{v}(${c} ; ${d})\\). Colinéaires ?`,
    answer: det === 0 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`\\det = ${det}`],
  };
}

// ---------- 3. Coefficient de colinéarité (mental) ----------
function genAutoCoefficientColineaireMental() {
  const a = nonZero(-8, 8);
  const b = randInt(-8, 8);
  const k = nonZero(-4, 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Colinéarité de vecteurs",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\), \\(\\vec{v}(${k * a} ; ${k * b})\\), avec \\(\\vec{v} = k\\vec{u}\\). Trouve k.`,
    answer: k,
    steps: [`k = ${k * a} / ${a} = ${k}`],
  };
}

// ---------- 4. Parallélisme via colinéarité (mental) ----------
function genAutoParallelismeMental() {
  const dxAB = nonZero(-7, 7);
  const dyAB = nonZero(-7, 7);
  const paralleles = Math.random() < 0.5;
  const k = nonZero(-3, 3);
  const dxCD = paralleles ? k * dxAB : dxAB + nonZero(1, 3);
  const dyCD = paralleles ? k * dyAB : dyAB;
  const det = dxAB * dyCD - dxCD * dyAB;
  return {
    type: "qcm",
    chapter: "Automatismes — Colinéarité de vecteurs",
    prompt: `Vecteur directeur (d) : \\((${dxAB} ; ${dyAB})\\). Vecteur directeur (d') : \\((${dxCD} ; ${dyCD})\\). Parallèles ?`,
    answer: det === 0 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`\\det = ${det}`],
  };
}

// ---------- 5. Vecteur nul colinéaire à tout vecteur (mental) ----------
function genAutoVecteurNulColineaireMental() {
  const a = nonZero(-9, 9);
  const b = randInt(-9, 9);
  return {
    type: "qcm",
    chapter: "Automatismes — Colinéarité de vecteurs",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\) et \\(\\vec{0}(0 ; 0)\\) sont-ils colinéaires ?`,
    answer: "Oui",
    options: ["Oui", "Non"],
    steps: ["Le vecteur nul est colinéaire à tout vecteur."],
  };
}

const CH_COLINEARITE_VECTEURS_S = [genAutoDeterminantMental, genAutoColineaireMental, genAutoCoefficientColineaireMental, genAutoParallelismeMental, genAutoVecteurNulColineaireMental];

// =========================== Chapitre 8 : Équations de droites ===========================

// ---------- 1. Vecteur directeur depuis une équation cartésienne (mental) ----------
function genAutoVecteurDirecteurCartesienneMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = randInt(-9, 9);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Équations de droites",
    prompt: `(d) : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}y ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = 0\\). Vecteur directeur (-b ; a). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} ?`,
    answer: demanderAbscisse ? -b : a,
    steps: [demanderAbscisse ? `-b = ${-b}` : `a = ${a}`],
  };
}

// ---------- 2. Point sur une droite cartésienne (mental) ----------
function genAutoPointSurDroiteMental() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const c = -(a * xA + b * yA);
  const appartient = Math.random() < 0.5;
  const xTest = appartient ? xA : xA + nonZero(1, 3);
  const yTest = appartient ? yA : yA;
  const valeur = a * xTest + b * yTest + c;
  return {
    type: "qcm",
    chapter: "Automatismes — Équations de droites",
    prompt: `(d) : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}y ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = 0\\). Le point (${xTest} ; ${yTest}) appartient-il à (d) ?`,
    answer: valeur === 0 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`${a} \\times ${xTest} + ${b} \\times ${yTest} + ${c} = ${valeur}`],
  };
}

// ---------- 3. Droite verticale ou horizontale (mental) ----------
function genAutoVerticaleHorizontaleMental() {
  const verticale = Math.random() < 0.5;
  const k = randInt(-9, 9);
  return {
    type: "qcm",
    chapter: "Automatismes — Équations de droites",
    prompt: `La droite d'équation \\(${verticale ? `x = ${k}` : `y = ${k}`}\\) est-elle verticale ou horizontale ?`,
    answer: verticale ? "verticale" : "horizontale",
    options: ["verticale", "horizontale"],
    steps: [verticale ? "x = k est une droite verticale." : "y = k est une droite horizontale."],
  };
}

// ---------- 4. Position relative de deux droites (mental) ----------
function genAutoPositionRelativeMental() {
  const a1 = nonZero(-6, 6);
  const b1 = nonZero(-6, 6);
  const secantes = Math.random() < 0.5;
  const k = nonZero(-3, 3);
  const a2 = secantes ? nonZero(-6, 6) : k * a1;
  const b2 = secantes ? nonZero(-6, 6) : k * b1;
  const det = a1 * b2 - a2 * b1;
  return {
    type: "qcm",
    chapter: "Automatismes — Équations de droites",
    prompt: `Vecteurs directeurs : (d) → \\((-${b1} ; ${a1})\\), (d') → \\((-${b2} ; ${a2})\\). Les droites sont-elles sécantes ou parallèles ?`,
    answer: det !== 0 ? "sécantes" : "parallèles",
    options: ["sécantes", "parallèles"],
    steps: [`\\det = ${det}`],
  };
}

// ---------- 5. Résoudre un petit système (mental) ----------
function genAutoResoudreSystemeMental() {
  const xSol = randInt(-6, 6);
  const ySol = randInt(-6, 6);
  const b1 = nonZero(-5, 5);
  const c1 = xSol + b1 * ySol;
  const demanderX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Équations de droites",
    prompt: `\\(x + ${b1}y = ${c1}\\) et \\(x = ${xSol}\\). Trouve ${demanderX ? "x" : "y"}.`,
    answer: demanderX ? xSol : ySol,
    steps: [`x = ${xSol}, y = ${ySol}`],
  };
}

const CH_EQUATIONS_DROITES_S = [genAutoVecteurDirecteurCartesienneMental, genAutoPointSurDroiteMental, genAutoVerticaleHorizontaleMental, genAutoPositionRelativeMental, genAutoResoudreSystemeMental];

// =========================== Chapitre 9 : Informations chiffrées ===========================

// ---------- 1. Calculer une partie depuis une proportion (mental) ----------
function genAutoPartieProportionMental() {
  const p = randInt(5, 95);
  const k = randInt(2, 10);
  const total = k * 100;
  return {
    type: "numeric",
    chapter: "Automatismes — Informations chiffrées",
    prompt: `Calcule ${p} % de ${total}.`,
    answer: (total * p) / 100,
    steps: [`${p}\\% \\times ${total} = ${(total * p) / 100}`],
  };
}

// ---------- 2. Coefficient multiplicateur depuis un taux (mental) ----------
function genAutoCoefficientMultiplicateurMental() {
  const t = randInt(1, 90);
  const hausse = Math.random() < 0.5;
  const cm = hausse ? (100 + t) / 100 : (100 - t) / 100;
  return {
    type: "numeric",
    chapter: "Automatismes — Informations chiffrées",
    prompt: `Quel est le coefficient multiplicateur associé à une ${hausse ? "hausse" : "baisse"} de ${t} % ?`,
    answer: cm,
    steps: [`\\text{CM} = ${cm}`],
  };
}

// ---------- 3. Valeur finale après évolution (mental) ----------
function genAutoValeurFinaleMental() {
  const t = randInt(1, 60);
  const hausse = Math.random() < 0.5;
  const k = randInt(2, 10);
  const V0 = k * 100;
  const V1 = hausse ? k * (100 + t) : k * (100 - t);
  return {
    type: "numeric",
    chapter: "Automatismes — Informations chiffrées",
    prompt: `${V0} subit une ${hausse ? "hausse" : "baisse"} de ${t} %. Quelle est la valeur finale ?`,
    answer: V1,
    steps: [`${V0} \\times ${hausse ? (100 + t) / 100 : (100 - t) / 100} = ${V1}`],
  };
}

// ---------- 4. Variation relative / taux d'évolution (mental) ----------
function genAutoVariationRelativeMental() {
  const t = randInt(1, 60);
  const hausse = Math.random() < 0.5;
  const k = randInt(2, 10);
  const V0 = k * 100;
  const V1 = hausse ? k * (100 + t) : k * (100 - t);
  return {
    type: "numeric",
    chapter: "Automatismes — Informations chiffrées",
    prompt: `Une quantité passe de ${V0} à ${V1}. Quel est le taux d'évolution (en %) ?`,
    answer: hausse ? t : -t,
    steps: [`\\dfrac{${V1} - ${V0}}{${V0}} \\times 100 = ${hausse ? t : -t}`],
  };
}

// ---------- 5. Proportion ou évolution ? (mental) ----------
function genAutoProportionOuEvolutionMental() {
  const cas = pick([
    { texte: "Un prix baisse de 15 %.", reponse: "évolution" },
    { texte: "20 % des élèves ont eu 16 ou plus.", reponse: "proportion" },
    { texte: "Le nombre de vues augmente de 40 %.", reponse: "évolution" },
    { texte: "70 % du budget est consacré au logement.", reponse: "proportion" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Informations chiffrées",
    prompt: `« ${cas.texte} » Proportion ou évolution ?`,
    answer: cas.reponse,
    options: ["proportion", "évolution"],
    steps: [cas.reponse],
  };
}

const CH_INFORMATIONS_CHIFFREES_S = [genAutoPartieProportionMental, genAutoCoefficientMultiplicateurMental, genAutoValeurFinaleMental, genAutoVariationRelativeMental, genAutoProportionOuEvolutionMental];

// =========================== Chapitre 10 : Statistiques descriptives ===========================

// ---------- 1. Moyenne simple (mental) ----------
function genAutoMoyenneMental() {
  const n = 3;
  const valeurs = Array.from({ length: n }, () => randInt(0, 20));
  const somme = valeurs.reduce((a, b) => a + b, 0);
  const reste = somme % n;
  if (reste !== 0) valeurs[n - 1] += n - reste;
  const sommeFinale = valeurs.reduce((a, b) => a + b, 0);
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques descriptives",
    prompt: `Calcule la moyenne de : ${valeurs.join(" ; ")}.`,
    answer: sommeFinale / n,
    steps: [`${sommeFinale} / ${n} = ${sommeFinale / n}`],
  };
}

// ---------- 2. Médiane (mental, effectif impair) ----------
function genAutoMedianeMental() {
  const n = pick([5, 7]);
  const valeurs = Array.from({ length: n }, () => randInt(0, 20)).sort((a, b) => a - b);
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques descriptives",
    prompt: `Série ordonnée : ${valeurs.join(" ; ")}. Médiane ?`,
    answer: valeurs[(n - 1) / 2],
    steps: [`\\text{Valeur centrale} = ${valeurs[(n - 1) / 2]}`],
  };
}

// ---------- 3. Rang du premier quartile Q1 (mental) ----------
function genAutoRangQ1Mental() {
  const n = randInt(8, 20);
  const rang = Math.ceil(n / 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques descriptives",
    prompt: `Une série ordonnée comporte ${n} valeurs. Quel est le rang de \\(Q_1\\) (rang \\(\\lceil n/4 \\rceil\\)) ?`,
    answer: rang,
    steps: [`\\lceil ${n}/4 \\rceil = ${rang}`],
  };
}

// ---------- 4. Écart interquartile depuis Q1 et Q3 (mental) ----------
function genAutoEcartInterquartileMental() {
  const q1 = randInt(0, 15);
  const q3 = q1 + randInt(1, 20);
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques descriptives",
    prompt: `\\(Q_1 = ${q1}\\), \\(Q_3 = ${q3}\\). Calcule l'écart interquartile.`,
    answer: q3 - q1,
    steps: [`${q3} - ${q1} = ${q3 - q1}`],
  };
}

// ---------- 5. Linéarité de la moyenne (mental) ----------
function genAutoLineariteMoyenneMental() {
  const moyenneInitiale = randInt(5, 25);
  const variation = nonZero(-8, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques descriptives",
    prompt: `Une moyenne vaut ${moyenneInitiale}. Toutes les valeurs de la série ${variation >= 0 ? "augmentent" : "diminuent"} de ${Math.abs(variation)}. Nouvelle moyenne ?`,
    answer: moyenneInitiale + variation,
    steps: [`${moyenneInitiale} ${variation >= 0 ? "+" : "-"} ${Math.abs(variation)} = ${moyenneInitiale + variation}`],
  };
}

const CH_STATISTIQUES_DESCRIPTIVES_S = [genAutoMoyenneMental, genAutoMedianeMental, genAutoRangQ1Mental, genAutoEcartInterquartileMental, genAutoLineariteMoyenneMental];

// =========================== Chapitre 11 : Probabilités et échantillonnage ===========================

// ---------- 1. Probabilité équiprobable (mental) ----------
function genAutoProbabiliteEquiprobableMental() {
  const total = randInt(5, 20);
  const favorables = randInt(1, total - 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `Urne de ${total} boules dont ${favorables} rouges. P(rouge) ? (décimal, arrondi au centième)`,
    answer: roundTo(favorables / total, 2),
    tolerance: 0.01,
    steps: [`${favorables}/${total} \\approx ${roundTo(favorables / total, 2)}`],
  };
}

// ---------- 2. Événement contraire (mental) ----------
function genAutoEvenementContraireMental() {
  const den = pick([4, 5, 10, 20]);
  const num = randInt(1, den - 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `P(A) = ${num}/${den}. Calcule \\(P(\\bar{A})\\) (décimal).`,
    answer: roundTo(1 - num / den, 4),
    steps: [`1 - ${num}/${den} = ${roundTo(1 - num / den, 4)}`],
  };
}

// ---------- 3. Type d'événement (mental) ----------
function genAutoTypeEvenementMental() {
  const cas = pick([
    { description: "Lancer un dé : obtenir un nombre entre 1 et 6.", reponse: "certain" },
    { description: "Lancer un dé : obtenir 7.", reponse: "impossible" },
    { description: "Lancer un dé : obtenir 3.", reponse: "élémentaire" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Probabilités",
    prompt: `${cas.description} Type d'événement ?`,
    answer: cas.reponse,
    options: ["certain", "impossible", "élémentaire"],
    steps: [cas.reponse],
  };
}

// ---------- 4. Univers d'une expérience simple (mental) ----------
function genAutoUniversMental() {
  const cas = pick([
    { description: "Lancer une pièce deux fois.", reponse: 4 },
    { description: "Lancer deux dés à 6 faces.", reponse: 36 },
    { description: "Lancer une pièce trois fois.", reponse: 8 },
  ]);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `${cas.description} Nombre d'issues ?`,
    answer: cas.reponse,
    steps: [`${cas.reponse}`],
  };
}

// ---------- 5. Fréquence dans un échantillon (mental) ----------
function genAutoFrequenceMental() {
  const taille = pick([20, 25, 50, 100]);
  const succes = randInt(1, taille - 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `${succes} succès sur ${taille} essais. Fréquence (décimale) ?`,
    answer: roundTo(succes / taille, 4),
    steps: [`${succes}/${taille} = ${roundTo(succes / taille, 4)}`],
  };
}

const CH_PROBABILITES_ECHANTILLONNAGE_S = [genAutoProbabiliteEquiprobableMental, genAutoEvenementContraireMental, genAutoTypeEvenementMental, genAutoUniversMental, genAutoFrequenceMental];

const THEMES = [
  { id: "nombres-calculs-seconde", title: "Nombres et calculs", generators: CH_NOMBRES_CALCULS_S },
  { id: "generalites-fonctions-seconde", title: "Généralités sur les fonctions", generators: CH_GENERALITES_FONCTIONS_S },
  { id: "variations-fonctions-seconde", title: "Variations de fonctions", generators: CH_VARIATIONS_FONCTIONS_S },
  { id: "fonctions-affines-seconde", title: "Fonctions affines", generators: CH_FONCTIONS_AFFINES_S },
  { id: "fonctions-reference-seconde", title: "Fonctions de référence", generators: CH_FONCTIONS_REFERENCE_S },
  { id: "reperage-configurations-seconde", title: "Repérage et configurations dans le plan", generators: CH_REPERAGE_CONFIGURATIONS_S },
  { id: "vecteurs-seconde", title: "Notion de vecteur", generators: CH_VECTEURS_S },
  { id: "colinearite-vecteurs-seconde", title: "Colinéarité de vecteurs", generators: CH_COLINEARITE_VECTEURS_S },
  { id: "equations-droites-seconde", title: "Équations de droites", generators: CH_EQUATIONS_DROITES_S },
  { id: "informations-chiffrees-seconde", title: "Informations chiffrées", generators: CH_INFORMATIONS_CHIFFREES_S },
  { id: "statistiques-descriptives-seconde", title: "Statistiques descriptives", generators: CH_STATISTIQUES_DESCRIPTIVES_S },
  { id: "probabilites-echantillonnage-seconde", title: "Probabilités et échantillonnage", generators: CH_PROBABILITES_ECHANTILLONNAGE_S },
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
    id: "automatismes-seconde",
    title: "Automatismes",
    description: "Calcul rapide et automatismes du programme de 2nde, chapitre après chapitre.",
    pourquoi: "Les automatismes, c'est le calcul mental qui libère de la place dans ta tête pour réfléchir au problème plutôt qu'à l'arithmétique : quelques minutes régulières valent mieux qu'une révision unique la veille du contrôle.",
    level: "seconde",
    freemiumDaily: 5,
    order: 1,
    isAutomatismes: true,
  },
  themes: THEMES.map(({ id, title }) => ({ id, title })),
  generate,
};
