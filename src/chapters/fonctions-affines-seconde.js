// ---------------------------------------------------------------------------
// Chapitre : Fonctions affines (2nde) — sous abonnement.
//
// Correspond au chapitre 3 du manuel de 2nde : reconnaître une fonction
// affine (développement/réduction d'une expression), coefficient directeur
// et ordonnée à l'origine, taux de variation entre deux points, sens de
// variation selon le signe du coefficient directeur, détermination d'une
// fonction affine à partir de deux points de sa courbe, résolution
// d'équations et d'inéquations affines, intersection de deux droites,
// problèmes de tarifs contextualisés.
// La correction du livre du professeur (exercices 17-36 : reconnaissance de
// fonctions affines, coefficients, sens de variation, taux de variation,
// vrai/faux) a servi à identifier la méthode ; les nombres, lettres de
// fonction et contextes sont générés aléatoirement à chaque tirage.
// Voir automatismes-seconde.js (thème "fonctions-affines-seconde") pour les
// mini-exercices "Calcul mental" associés.
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

const lettresFonctions = ["f", "g", "h", "p"];
const texAffine = (a, b) => `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;

// ---------- 1. Identifier le coefficient directeur et l'ordonnée à l'origine ----------
function genIdentifierCoefficientsNumeric() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-9, 9);
  const b = randInt(-10, 10);
  const demanderA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Coefficients",
    prompt: `On considère la fonction affine ${nom} définie par \\(${nom}(x) = ${texAffine(a, b)}\\). Quel est ${demanderA ? "le coefficient directeur" : "l'ordonnée à l'origine"} de ${nom} ?`,
    answer: demanderA ? a : b,
    steps: [demanderA ? `Le coefficient directeur est le nombre devant x : ${a}.` : `L'ordonnée à l'origine est le terme constant : ${b}.`],
  };
}

// ---------- 2. Sens de variation selon le signe du coefficient directeur ----------
function genSensVariationSigneAQCM() {
  const nom = pick(lettresFonctions);
  const a = pick([nonZero(-9, -1), nonZero(1, 9), 0]);
  const b = randInt(-10, 10);
  const sens = a > 0 ? "croissante" : a < 0 ? "décroissante" : "constante";
  return {
    type: "qcm",
    chapter: "Fonctions affines — Coefficients",
    prompt: `On considère la fonction affine ${nom} définie par \\(${nom}(x) = ${a === 0 ? `${b}` : texAffine(a, b)}\\). Quel est son sens de variation sur \\(\\mathbb{R}\\) ?`,
    answer: sens,
    options: ["croissante", "décroissante", "constante"],
    steps: [`Le coefficient directeur vaut ${a} : la fonction est ${sens}.`],
  };
}

// ---------- 3. Calculer le taux de variation (coefficient directeur) entre deux points ----------
function genCalculTauxVariationNumeric() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-8, 8);
  const b = randInt(-10, 10);
  let x1 = randInt(-8, 8);
  let x2 = randInt(-8, 8);
  while (x2 === x1) x2 = randInt(-8, 8);
  const y1 = a * x1 + b;
  const y2 = a * x2 + b;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Taux de variation",
    prompt: `La fonction affine ${nom} vérifie \\(${nom}(${x1}) = ${y1}\\) et \\(${nom}(${x2}) = ${y2}\\). Calcule le coefficient directeur de ${nom}.`,
    answer: a,
    steps: [`\\text{Coefficient directeur} = \\dfrac{${nom}(${x2}) - ${nom}(${x1})}{${x2} - ${x1}} = \\dfrac{${y2} - ${y1}}{${x2} - ${x1}} = \\dfrac{${y2 - y1}}{${x2 - x1}} = ${a}`],
  };
}

// ---------- 4. Déterminer une fonction affine à partir de deux points ----------
function genDeterminerFonctionDeuxPointsNumeric() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-7, 7);
  const b = randInt(-10, 10);
  let x1 = randInt(-8, 8);
  let x2 = randInt(-8, 8);
  while (x2 === x1) x2 = randInt(-8, 8);
  let x3 = randInt(-8, 8);
  while (x3 === x1 || x3 === x2) x3 = randInt(-8, 8);
  const y1 = a * x1 + b;
  const y2 = a * x2 + b;
  const answer = a * x3 + b;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Déterminer une fonction affine",
    prompt: `La fonction affine ${nom} vérifie \\(${nom}(${x1}) = ${y1}\\) et \\(${nom}(${x2}) = ${y2}\\). Calcule \\(${nom}(${x3})\\).`,
    answer,
    steps: [
      `\\text{Coefficient directeur} = \\dfrac{${y2} - ${y1}}{${x2} - ${x1}} = ${a}`,
      `\\text{Ordonnée à l'origine} : ${y1} = ${a} \\times ${x1} + b \\text{, donc } b = ${b}`,
      `${nom}(${x3}) = ${a} \\times ${x3} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`,
    ],
  };
}

// ---------- 5. Calculer une image via la formule ----------
function genImageAffineNumeric() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-9, 9);
  const b = randInt(-10, 10);
  const x = randInt(-9, 9);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Image et antécédent",
    prompt: `On considère la fonction affine ${nom} définie par \\(${nom}(x) = ${texAffine(a, b)}\\). Calcule \\(${nom}(${x})\\).`,
    answer,
    steps: [`${nom}(${x}) = ${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
  };
}

// ---------- 6. Vrai ou faux : une expression définit-elle une fonction affine ? ----------
function genVraiFauxAffineQCM() {
  const nom = pick(lettresFonctions);
  const estAffine = Math.random() < 0.5;
  const a = nonZero(-6, 6);
  const b = randInt(-8, 8);
  if (estAffine) {
    // On développe une expression du type a(x + k) + m qui se réduit bien à ax + b.
    const k = randInt(-5, 5);
    const m = b - a * k;
    return {
      type: "qcm",
      chapter: "Fonctions affines — Reconnaître une fonction affine",
      prompt: `On considère la fonction ${nom} définie par \\(${nom}(x) = ${a}(x ${k >= 0 ? "+" : "-"} ${Math.abs(k)}) ${m >= 0 ? "+" : "-"} ${Math.abs(m)}\\). Après réduction, ${nom} est-elle une fonction affine ?`,
      answer: "Oui",
      options: ["Oui", "Non"],
      steps: [`${nom}(x) = ${a}x ${a * k >= 0 ? "+" : "-"} ${Math.abs(a * k)} ${m >= 0 ? "+" : "-"} ${Math.abs(m)} = ${texAffine(a, b)}`, `C'est bien de la forme ax + b : ${nom} est affine.`],
    };
  }
  // On construit une expression avec un terme en x² qui ne se simplifie pas.
  const c = nonZero(-5, 5);
  return {
    type: "qcm",
    chapter: "Fonctions affines — Reconnaître une fonction affine",
    prompt: `On considère la fonction ${nom} définie par \\(${nom}(x) = x(x ${c >= 0 ? "+" : "-"} ${Math.abs(c)}) ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Après réduction, ${nom} est-elle une fonction affine ?`,
    answer: "Non",
    options: ["Oui", "Non"],
    steps: [`${nom}(x) = x^2 ${c >= 0 ? "+" : "-"} ${Math.abs(c)}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`, `Il reste un terme en x^2 : ${nom} n'est pas affine.`],
  };
}

// ---------- 7. Classer une fonction : constante / linéaire / affine non linéaire / non affine ----------
function genClasserFonctionQCM() {
  const nom = pick(lettresFonctions);
  const categorie = pick(["constante", "linéaire", "affine non linéaire", "non affine"]);
  let expression;
  if (categorie === "constante") {
    const b = nonZero(-10, 10);
    expression = `${b}`;
  } else if (categorie === "linéaire") {
    const a = nonZero(-8, 8);
    expression = `${a}x`;
  } else if (categorie === "affine non linéaire") {
    const a = nonZero(-8, 8);
    const b = nonZero(-10, 10);
    expression = texAffine(a, b);
  } else {
    const a = nonZero(-5, 5);
    const b = randInt(-8, 8);
    expression = `x^2 ${a >= 0 ? "+" : "-"} ${Math.abs(a)}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;
  }
  return {
    type: "qcm",
    chapter: "Fonctions affines — Reconnaître une fonction affine",
    prompt: `On considère la fonction ${nom} définie par \\(${nom}(x) = ${expression}\\). Comment peut-on classer cette fonction ?`,
    answer: categorie,
    options: ["constante", "linéaire", "affine non linéaire", "non affine"],
    steps: [`${nom}(x) = ${expression} : c'est une fonction ${categorie}.`],
  };
}

// ---------- 8. Comparer deux images à partir du sens de variation ----------
function genComparerImagesSigneAQCM() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-8, 8);
  const b = randInt(-8, 8);
  let x1 = randInt(-8, 8);
  let x2 = randInt(-8, 8);
  while (x2 === x1) x2 = randInt(-8, 8);
  const [xmin, xmax] = x1 < x2 ? [x1, x2] : [x2, x1];
  const bonneReponse = a > 0 ? `${nom}(${xmin}) < ${nom}(${xmax})` : `${nom}(${xmin}) > ${nom}(${xmax})`;
  const mauvaise = a > 0 ? `${nom}(${xmin}) > ${nom}(${xmax})` : `${nom}(${xmin}) < ${nom}(${xmax})`;
  return {
    type: "qcm",
    chapter: "Fonctions affines — Sens de variation",
    prompt: `On considère la fonction affine ${nom} définie par \\(${nom}(x) = ${texAffine(a, b)}\\), avec \\(${xmin} < ${xmax}\\). Que peut-on en déduire ?`,
    answer: bonneReponse,
    options: shuffle([bonneReponse, mauvaise, "On ne peut pas savoir"]),
    steps: [`Le coefficient directeur ${a} est ${a > 0 ? "positif" : "négatif"}, donc ${nom} est ${a > 0 ? "croissante" : "décroissante"} : ${bonneReponse}.`],
  };
}

// ---------- 9. Identifier la droite depuis sa pente et son ordonnée à l'origine ----------
function genIdentifierDroiteQCM() {
  const a = nonZero(-6, 6);
  const b = randInt(-8, 8);
  const bonneReponse = `y = ${texAffine(a, b)}`;
  const candidats = [`y = ${texAffine(-a, b)}`, `y = ${texAffine(a, -b)}`, `y = ${texAffine(-a, -b)}`, `y = ${texAffine(a, b + nonZero(1, 5))}`];
  const optionsSet = new Set([bonneReponse]);
  for (const c of candidats) {
    if (optionsSet.size >= 3) break;
    optionsSet.add(c);
  }
  return {
    type: "qcm",
    chapter: "Fonctions affines — Droite représentative",
    prompt: `Une droite a pour coefficient directeur ${a} et pour ordonnée à l'origine ${b}. Quelle est son équation ?`,
    answer: bonneReponse,
    options: shuffle([...optionsSet]),
    steps: [`Une droite de coefficient directeur a et d'ordonnée à l'origine b a pour équation y = ax + b, ici y = ${texAffine(a, b)}.`],
  };
}

// ---------- 10. Résoudre une équation affine ----------
function genResoudreEquationAffineNumeric() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-8, 8);
  const b = randInt(-10, 10);
  const xSol = randInt(-10, 10);
  const k = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Équations et inéquations",
    prompt: `Résous l'équation \\(${texAffine(a, b)} = ${k}\\).`,
    answer: xSol,
    steps: [`${a}x = ${k - b}`, `x = ${xSol}`],
  };
}

// ---------- 11. Résoudre une inéquation affine ----------
function genResoudreInequationAffineQCM() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-8, 8);
  const b = randInt(-10, 10);
  const xSol = randInt(-10, 10);
  const k = a * xSol + b;
  const bonneReponse = a > 0 ? `x > ${xSol}` : `x < ${xSol}`;
  const mauvaise1 = a > 0 ? `x < ${xSol}` : `x > ${xSol}`;
  const mauvaise2 = `x = ${xSol}`;
  return {
    type: "qcm",
    chapter: "Fonctions affines — Équations et inéquations",
    prompt: `Résous l'inéquation \\(${texAffine(a, b)} > ${k}\\).`,
    answer: bonneReponse,
    options: shuffle([bonneReponse, mauvaise1, mauvaise2]),
    steps: [`${a}x > ${k - b}`, a > 0 ? `x > ${xSol} \\text{ (on ne change pas le sens de l'inégalité car } a > 0\\text{)}` : `x < ${xSol} \\text{ (on change le sens de l'inégalité car } a < 0\\text{)}`],
  };
}

// ---------- 12. Un point appartient-il à la droite ? ----------
function genPointAppartientDroiteQCM() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-7, 7);
  const b = randInt(-9, 9);
  const x = randInt(-8, 8);
  const vraiY = a * x + b;
  const appartient = Math.random() < 0.5;
  const yPropose = appartient ? vraiY : vraiY + nonZero(1, 4);
  return {
    type: "qcm",
    chapter: "Fonctions affines — Droite représentative",
    prompt: `La droite représentant la fonction affine ${nom} a pour équation \\(y = ${texAffine(a, b)}\\). Le point de coordonnées (${x} ; ${yPropose}) appartient-il à cette droite ?`,
    answer: appartient ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`${nom}(${x}) = ${vraiY}`, appartient ? `${vraiY} = ${yPropose} : le point appartient à la droite.` : `${vraiY} \\neq ${yPropose} : le point n'appartient pas à la droite.`],
  };
}

// ---------- 13. Intersection de deux droites ----------
function genIntersectionDeuxDroitesNumeric() {
  const nomF = "f";
  const nomG = "g";
  let a1 = nonZero(-6, 6);
  let a2 = nonZero(-6, 6);
  while (a2 === a1) a2 = nonZero(-6, 6);
  const xSol = randInt(-8, 8);
  const b1 = randInt(-8, 8);
  const b2 = (a1 - a2) * xSol + b1;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Intersection de deux droites",
    prompt: `On considère les fonctions affines ${nomF} et ${nomG} définies par \\(${nomF}(x) = ${texAffine(a1, b1)}\\) et \\(${nomG}(x) = ${texAffine(a2, b2)}\\). Détermine l'abscisse du point d'intersection des deux droites qui les représentent (résous \\(${nomF}(x) = ${nomG}(x)\\)).`,
    answer: xSol,
    steps: [
      `${texAffine(a1, b1)} = ${texAffine(a2, b2)}`,
      `${a1 - a2}x = ${b2 - b1}`,
      `x = ${xSol}`,
    ],
  };
}

// ---------- 14. Problème de tarif contextualisé ----------
function genTarifContexteNumeric() {
  const prixFixe = randInt(5, 40);
  const prixUnitaire = randInt(2, 15);
  const quantite = randInt(2, 20);
  const contexte = pick([
    { objet: "une location de vélo", unite: "heure", verbe: "loue" },
    { objet: "un abonnement de téléphone", unite: "Go consommé", verbe: "paie" },
    { objet: "une course de taxi", unite: "kilomètre", verbe: "paie" },
  ]);
  const answer = prixFixe + prixUnitaire * quantite;
  return {
    type: "numeric",
    chapter: "Fonctions affines — Problèmes de tarifs",
    prompt: `Pour ${contexte.objet}, le tarif comprend un forfait fixe de ${fr(prixFixe)} € auquel s'ajoutent ${fr(prixUnitaire)} € par ${contexte.unite}. Combien ${contexte.verbe}-t-on pour ${quantite} ${contexte.unite}${quantite > 1 ? "s" : ""} ?`,
    answer,
    steps: [`\\text{Prix} = ${prixFixe} + ${prixUnitaire} \\times ${quantite} = ${prixFixe} + ${prixUnitaire * quantite} = ${answer}`],
  };
}

// ---------- 15. Quantité à partir d'un tarif (résolution inverse) ----------
function genTarifInverseNumeric() {
  const prixFixe = randInt(5, 40);
  const prixUnitaire = nonZero(2, 15);
  const quantiteSol = randInt(2, 20);
  const total = prixFixe + prixUnitaire * quantiteSol;
  const contexte = pick([
    { objet: "une location de vélo", unite: "heure" },
    { objet: "un abonnement de téléphone", unite: "Go consommé" },
    { objet: "une course de taxi", unite: "kilomètre" },
  ]);
  return {
    type: "numeric",
    chapter: "Fonctions affines — Problèmes de tarifs",
    prompt: `Pour ${contexte.objet}, le tarif comprend un forfait fixe de ${fr(prixFixe)} € auquel s'ajoutent ${fr(prixUnitaire)} € par ${contexte.unite}. Un client a payé ${fr(total)} €. Combien de ${contexte.unite}s a-t-il consommés ?`,
    answer: quantiteSol,
    steps: [`${prixFixe} + ${prixUnitaire} \\times n = ${total}`, `n = \\dfrac{${total - prixFixe}}{${prixUnitaire}} = ${quantiteSol}`],
  };
}

const GENERATORS = [
  genIdentifierCoefficientsNumeric,
  genSensVariationSigneAQCM,
  genCalculTauxVariationNumeric,
  genDeterminerFonctionDeuxPointsNumeric,
  genImageAffineNumeric,
  genVraiFauxAffineQCM,
  genClasserFonctionQCM,
  genComparerImagesSigneAQCM,
  genIdentifierDroiteQCM,
  genResoudreEquationAffineNumeric,
  genResoudreInequationAffineQCM,
  genPointAppartientDroiteQCM,
  genIntersectionDeuxDroitesNumeric,
  genTarifContexteNumeric,
  genTarifInverseNumeric,
];

const DIFFICULTY = {
  genIdentifierCoefficientsNumeric: "facile",
  genSensVariationSigneAQCM: "facile",
  genImageAffineNumeric: "facile",
  genClasserFonctionQCM: "facile",
  genPointAppartientDroiteQCM: "facile",
  genCalculTauxVariationNumeric: "standard",
  genDeterminerFonctionDeuxPointsNumeric: "standard",
  genVraiFauxAffineQCM: "standard",
  genComparerImagesSigneAQCM: "standard",
  genIdentifierDroiteQCM: "standard",
  genResoudreEquationAffineNumeric: "standard",
  genTarifContexteNumeric: "standard",
  genResoudreInequationAffineQCM: "expert",
  genIntersectionDeuxDroitesNumeric: "expert",
  genTarifInverseNumeric: "expert",
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
    id: "fonctions-affines-seconde",
    title: "Fonctions affines",
    description: "Coefficient directeur et ordonnée à l'origine, taux de variation, reconnaître une fonction affine, sens de variation, équations et inéquations affines, intersection de droites, problèmes de tarifs.",
    pourquoi: "Une fonction affine décrit toute situation qui évolue à taux constant : un forfait téléphonique, un trajet à vitesse constante.",
    level: "seconde",
    free: false,
    order: 5,
  },
  generate,
};
