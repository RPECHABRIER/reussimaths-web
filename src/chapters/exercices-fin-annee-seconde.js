// ---------------------------------------------------------------------------
// Chapitre : Exercices de fin d'année (2nde) — sous abonnement.
//
// Dernier chapitre du niveau 2nde : synthèse transversale mêlant les grands
// thèmes de l'année (fonctions affines, fonctions de référence, repérage et
// vecteurs, colinéarité, équations de droites, informations chiffrées,
// statistiques descriptives, probabilités), dans l'esprit des « Exercices
// transversaux » du manuel (problèmes combinant plusieurs notions, ex. 1-3 :
// fonction affine par morceaux, loi de probabilité, lecture graphique).
// Reprend la tâche intellectuelle de chaque type d'exercice déjà travaillé
// dans les chapitres dédiés de l'année, avec des nombres et contextes
// différents à chaque génération.
// Voir automatismes-seconde.js pour les mini-exercices "Calcul mental"
// associés à chaque chapitre individuel (ce chapitre de synthèse n'a pas de
// thème Automatismes dédié).
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
  while (b) [a, b] = [b, a % b];
  return a;
}

const nomsPoints = ["A", "B", "C", "D", "M", "N"];
function points2() {
  return shuffle(nomsPoints).slice(0, 2);
}

// ---------- 1. Fonctions affines — image et sens de variation ----------
function genFonctionAffineReviewNumeric() {
  const nom = pick(["f", "g", "h"]);
  const a = nonZero(-8, 8);
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Fonctions affines",
    prompt: `On considère la fonction affine ${nom} définie par \\(${nom}(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(${nom}(${x})\\).`,
    answer: a * x + b,
    steps: [{ type: "resultat", text: `${nom}(${x}) = ${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${a * x + b}` }],
  };
}

// ---------- 2. Résoudre une équation affine ----------
function genResoudreEquationAffineReviewNumeric() {
  const a = nonZero(-8, 8);
  const b = randInt(-10, 10);
  const xSol = randInt(-10, 10);
  const k = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Fonctions affines",
    prompt: `Résous l'équation \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${k}\\).`,
    answer: xSol,
    steps: [
      { type: "calcul", text: `${a}x = ${k - b}` },
      { type: "resultat", text: `x = \\dfrac{${k - b}}{${a}} = ${xSol}` },
    ],
  };
}

// ---------- 3. Fonctions de référence — comparer deux carrés ----------
function genComparerCarresReviewQCM() {
  const memeSignePositif = Math.random() < 0.5;
  const a = memeSignePositif ? randInt(1, 12) : randInt(-12, -1);
  let b = memeSignePositif ? randInt(1, 12) : randInt(-12, -1);
  while (b === a) b = memeSignePositif ? randInt(1, 12) : randInt(-12, -1);
  const [xmin, xmax] = a < b ? [a, b] : [b, a];
  const bonneReponse = memeSignePositif ? `${xmin}² < ${xmax}²` : `${xmin}² > ${xmax}²`;
  const mauvaise = memeSignePositif ? `${xmin}² > ${xmax}²` : `${xmin}² < ${xmax}²`;
  return {
    type: "qcm",
    chapter: "Exercices de fin d'année — Fonctions de référence",
    prompt: `On a \\(${xmin} < ${xmax}\\), ${memeSignePositif ? "tous deux positifs" : "tous deux négatifs"}. Que peut-on en déduire pour leurs carrés ?`,
    answer: bonneReponse,
    options: [bonneReponse, mauvaise],
    steps: [
      {
        type: "regle",
        text: memeSignePositif
          ? `\\text{La fonction carré est } \\textbf{croissante} \\text{ sur les nombres positifs : deux nombres positifs se comparent dans le même ordre que leurs carrés.}`
          : `\\text{La fonction carré est } \\textbf{décroissante} \\text{ sur les nombres négatifs : deux nombres négatifs se comparent dans l'ordre } \\textbf{inverse} \\text{ de celui de leurs carrés.}`,
      },
    ],
  };
}

// ---------- 4. Repérage — distance entre deux points ----------
function genDistanceReviewNumeric() {
  const [nomA, nomB] = points2();
  const [dx, dy, dist] = pick([
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
    [8, 15, 17],
  ]);
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const xB = xA + dx;
  const yB = yA + dy;
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Repérage",
    prompt: `Repère orthonormé. ${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}). Calcule ${nomA}${nomB}.`,
    answer: dist,
    steps: [
      { type: "regle", text: `\\text{La distance entre deux points s'obtient à partir des différences de coordonnées, grâce au théorème de Pythagore : } ${nomA}${nomB} = \\sqrt{(x_${nomB} - x_${nomA})^2 + (y_${nomB} - y_${nomA})^2}.` },
      { type: "resultat", text: `${nomA}${nomB} = \\sqrt{${dx}^2 + ${dy}^2} = ${dist}` },
    ],
  };
}

// ---------- 5. Vecteurs — coordonnées ----------
function genCoordonneesVecteurReviewNumeric() {
  const [nomA, nomB] = points2();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const xB = randInt(-10, 10);
  const yB = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Vecteurs",
    prompt: `${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} du vecteur \\(\\overrightarrow{${nomA}${nomB}}\\) ?`,
    answer: demanderAbscisse ? xB - xA : yB - yA,
    steps: [
      { type: "regle", text: `\\text{Les coordonnées du vecteur } \\overrightarrow{${nomA}${nomB}} \\text{ s'obtiennent en soustrayant les coordonnées du point de départ à celles du point d'arrivée.}` },
      { type: "resultat", text: demanderAbscisse ? `${xB} - ${xA} = ${xB - xA}` : `${yB} - ${yA} = ${yB - yA}` },
    ],
  };
}

// ---------- 6. Colinéarité — deux vecteurs colinéaires ? ----------
function genColineariteReviewQCM() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const colineaires = Math.random() < 0.5;
  const k = nonZero(-3, 3);
  const c = colineaires ? k * a : k * a + nonZero(1, 3);
  const d = k * b;
  const det = a * d - b * c;
  return {
    type: "qcm",
    chapter: "Exercices de fin d'année — Colinéarité",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\) et \\(\\vec{v}(${c} ; ${d})\\). Ces vecteurs sont-ils colinéaires ?`,
    answer: det === 0 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Deux vecteurs } \\vec{u}(a;b) \\text{ et } \\vec{v}(c;d) \\text{ sont colinéaires si et seulement si leur déterminant } ad - bc \\text{ est nul.}` },
      { type: "calcul", text: `\\det(\\vec{u},\\vec{v}) = ${a} \\times ${d} - ${b} \\times ${c} = ${det}` },
      { type: "resultat", text: det === 0 ? `\\text{Le déterminant est nul : les vecteurs sont colinéaires.}` : `\\text{Le déterminant n'est pas nul : les vecteurs ne sont pas colinéaires.}` },
    ],
  };
}

// ---------- 7. Équations de droites — point sur une droite cartésienne ----------
function genPointSurDroiteReviewQCM() {
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
    chapter: "Exercices de fin d'année — Équations de droites",
    prompt: `(d) : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}y ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = 0\\). Le point (${xTest} ; ${yTest}) appartient-il à (d) ?`,
    answer: valeur === 0 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Un point appartient à une droite d'équation } ax+by+c=0 \\text{ si et seulement si en remplaçant } x \\text{ et } y \\text{ par ses coordonnées, l'expression s'annule.}` },
      { type: "calcul", text: `${a} \\times ${xTest} + ${b} \\times ${yTest} + ${c} = ${valeur}` },
      { type: "resultat", text: valeur === 0 ? `\\text{L'expression vaut 0 : le point appartient à (d).}` : `\\text{L'expression ne vaut pas 0 : le point n'appartient pas à (d).}` },
    ],
  };
}

// ---------- 8. Informations chiffrées — taux d'évolution ----------
function genTauxEvolutionReviewNumeric() {
  const t = randInt(1, 80);
  const hausse = Math.random() < 0.5;
  const k = randInt(2, 15);
  const V0 = k * 100;
  const V1 = hausse ? k * (100 + t) : k * (100 - t);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Informations chiffrées",
    prompt: `Une quantité passe de ${V0} à ${V1}. Calcule le taux d'évolution (en %, positif pour une hausse, négatif pour une baisse).`,
    answer: hausse ? t : -t,
    steps: [
      { type: "regle", text: `\\text{Le taux d'évolution est } t = \\dfrac{\\text{valeur finale} - \\text{valeur initiale}}{\\text{valeur initiale}} \\times 100.` },
      { type: "resultat", text: `\\dfrac{${V1} - ${V0}}{${V0}} \\times 100 = ${hausse ? t : -t}` },
    ],
  };
}

// ---------- 9. Statistiques — médiane d'une série ----------
function genMedianeReviewNumeric() {
  const n = pick([7, 9, 11]);
  const valeurs = Array.from({ length: n }, () => randInt(0, 30)).sort((a, b) => a - b);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Statistiques",
    prompt: `Série ordonnée de ${n} valeurs : ${valeurs.join(" ; ")}. Détermine la médiane.`,
    answer: valeurs[(n - 1) / 2],
    steps: [
      { type: "regle", text: `\\text{L'effectif } ${n} \\text{ est impair : la médiane est la valeur de rang } \\dfrac{${n}+1}{2}.` },
      { type: "resultat", text: `\\text{Valeur de rang } \\dfrac{${n}+1}{2} = ${valeurs[(n - 1) / 2]}` },
    ],
  };
}

// ---------- 10. Probabilités — modèle équiprobable ----------
function genProbabiliteReviewNumeric() {
  const total = randInt(10, 30);
  const favorables = randInt(1, total - 1);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Probabilités",
    prompt: `Une urne contient ${total} boules dont ${favorables} rouges. On tire une boule au hasard. Donne la probabilité d'obtenir une boule rouge (décimale, arrondie au centième).`,
    answer: roundTo(favorables / total, 2),
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Dans un modèle équiprobable, } P = \\dfrac{\\text{nombre d'issues favorables}}{\\text{nombre d'issues possibles}}.` },
      { type: "resultat", text: `P = \\dfrac{${favorables}}{${total}} \\approx ${roundTo(favorables / total, 2)}` },
    ],
  };
}

// ---------- 11. Sens de variation d'une fonction affine ----------
function genSensVariationReviewQCM() {
  const nom = pick(["f", "g", "h"]);
  const a = pick([nonZero(-9, -1), nonZero(1, 9)]);
  const b = randInt(-10, 10);
  const sens = a > 0 ? "croissante" : "décroissante";
  return {
    type: "qcm",
    chapter: "Exercices de fin d'année — Fonctions affines",
    prompt: `\\(${nom}(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Quel est le sens de variation de ${nom} ?`,
    answer: sens,
    options: ["croissante", "décroissante"],
    steps: [
      { type: "regle", text: `\\text{Une fonction affine } x \\mapsto ax+b \\text{ est croissante si } a>0, \\text{ décroissante si } a<0.` },
      { type: "resultat", text: `\\text{Le coefficient directeur } ${a} \\text{ est } ${a > 0 ? "\\textbf{positif}" : "\\textbf{négatif}"} : \\text{ la fonction est } ${sens}.` },
    ],
  };
}

// ---------- 12. Nombre d'antécédents par la fonction carré ----------
function genAntecedentsCarreReviewQCM() {
  const cas = pick(["positif", "négatif", "nul"]);
  const k = cas === "nul" ? 0 : cas === "positif" ? nonZero(1, 100) : nonZero(-100, -1);
  const nb = cas === "négatif" ? 0 : cas === "nul" ? 1 : 2;
  return {
    type: "qcm",
    chapter: "Exercices de fin d'année — Fonctions de référence",
    prompt: `Combien le nombre ${k} a-t-il d'antécédents par la fonction carré ?`,
    answer: String(nb),
    options: ["0", "1", "2"],
    steps: [
      {
        type: "regle",
        text:
          cas === "positif"
            ? `\\text{Un nombre strictement positif a toujours } \\textbf{deux} \\text{ antécédents par la fonction carré (un opposé de l'autre) : } (\\pm\\sqrt{${k}})^2 = ${k}.`
            : cas === "nul"
              ? `\\text{Le nombre } 0 \\text{ a un seul antécédent par la fonction carré : } 0^2 = 0.`
              : `\\text{Un carré n'est jamais négatif : un nombre strictement négatif n'a } \\textbf{aucun} \\text{ antécédent par la fonction carré.}`,
      },
    ],
  };
}

// ---------- 13. Repérage — coordonnées du milieu ----------
function genMilieuReviewNumeric() {
  const [nomA, nomB] = points2();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const xB = randInt(-10, 10);
  const yB = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Repérage",
    prompt: `${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} du milieu de [${nomA}${nomB}] ?`,
    answer: demanderAbscisse ? (xA + xB) / 2 : (yA + yB) / 2,
    steps: [
      { type: "regle", text: `\\text{Les coordonnées du milieu d'un segment sont la moyenne des coordonnées de ses extrémités.}` },
      { type: "resultat", text: demanderAbscisse ? `\\dfrac{${xA} + ${xB}}{2} = ${(xA + xB) / 2}` : `\\dfrac{${yA} + ${yB}}{2} = ${(yA + yB) / 2}` },
    ],
  };
}

// ---------- 14. Informations chiffrées — évolutions successives ----------
function genEvolutionsSuccessivesReviewNumeric() {
  const t1 = randInt(1, 60);
  const hausse1 = Math.random() < 0.5;
  const t2 = randInt(1, 60);
  const hausse2 = Math.random() < 0.5;
  const cm1 = hausse1 ? (100 + t1) / 100 : (100 - t1) / 100;
  const cm2 = hausse2 ? (100 + t2) / 100 : (100 - t2) / 100;
  const tauxGlobal = roundTo((cm1 * cm2 - 1) * 100, 2);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Informations chiffrées",
    prompt: `Une quantité subit une ${hausse1 ? "hausse" : "baisse"} de ${t1} %, puis une ${hausse2 ? "hausse" : "baisse"} de ${t2} %. Quel est le taux d'évolution global (en %) ?`,
    answer: tauxGlobal,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Pour des évolutions successives, on ne les additionne pas : le coefficient multiplicateur global est le } \\textbf{produit} \\text{ des coefficients multiplicateurs de chaque évolution.}` },
      { type: "calcul", text: `\\text{CM}_1 = ${roundTo(cm1, 4)}, \\quad \\text{CM}_2 = ${roundTo(cm2, 4)}, \\quad \\text{CM global} = ${roundTo(cm1, 4)} \\times ${roundTo(cm2, 4)} \\approx ${roundTo(cm1 * cm2, 4)}` },
      { type: "resultat", text: `\\text{Taux global} = (${roundTo(cm1 * cm2, 4)} - 1) \\times 100 \\approx ${tauxGlobal}\\%` },
    ],
  };
}

// ---------- 15. Statistiques — écart interquartile ----------
function genEcartInterquartileReviewNumeric() {
  const n = randInt(9, 20);
  const valeurs = Array.from({ length: n }, () => randInt(-10, 40)).sort((a, b) => a - b);
  const q1 = valeurs[Math.ceil(n / 4) - 1];
  const q3 = valeurs[Math.ceil((3 * n) / 4) - 1];
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Statistiques",
    prompt: `Série ordonnée de ${n} valeurs : ${valeurs.join(" ; ")}. Calcule l'écart interquartile \\(Q_3 - Q_1\\).`,
    answer: q3 - q1,
    steps: [
      { type: "regle", text: `\\text{L'écart interquartile mesure la dispersion de la moitié centrale de la série : } Q_3 - Q_1.` },
      { type: "calcul", text: `Q_1 = ${q1}, \\quad Q_3 = ${q3}` },
      { type: "resultat", text: `Q_3 - Q_1 = ${q3} - ${q1} = ${q3 - q1}` },
    ],
  };
}

const GENERATORS = [
  genFonctionAffineReviewNumeric,
  genResoudreEquationAffineReviewNumeric,
  genComparerCarresReviewQCM,
  genDistanceReviewNumeric,
  genCoordonneesVecteurReviewNumeric,
  genColineariteReviewQCM,
  genPointSurDroiteReviewQCM,
  genTauxEvolutionReviewNumeric,
  genMedianeReviewNumeric,
  genProbabiliteReviewNumeric,
  genSensVariationReviewQCM,
  genAntecedentsCarreReviewQCM,
  genMilieuReviewNumeric,
  genEvolutionsSuccessivesReviewNumeric,
  genEcartInterquartileReviewNumeric,
];

const DIFFICULTY = {
  genFonctionAffineReviewNumeric: "facile",
  genResoudreEquationAffineReviewNumeric: "facile",
  genComparerCarresReviewQCM: "facile",
  genDistanceReviewNumeric: "facile",
  genCoordonneesVecteurReviewNumeric: "facile",
  genMilieuReviewNumeric: "facile",
  genColineariteReviewQCM: "standard",
  genPointSurDroiteReviewQCM: "standard",
  genTauxEvolutionReviewNumeric: "standard",
  genMedianeReviewNumeric: "standard",
  genProbabiliteReviewNumeric: "standard",
  genSensVariationReviewQCM: "standard",
  genAntecedentsCarreReviewQCM: "standard",
  genEvolutionsSuccessivesReviewNumeric: "expert",
  genEcartInterquartileReviewNumeric: "expert",
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
    id: "exercices-fin-annee-seconde",
    title: "Exercices de fin d'année",
    description: "Synthèse transversale des grands thèmes de 2nde : fonctions affines et de référence, repérage, vecteurs, colinéarité, équations de droites, informations chiffrées, statistiques, probabilités.",
    pourquoi: "Cette synthèse transversale permet de vérifier que les grands thèmes de 2nde sont bien acquis avant d'aborder le lycée post-seconde.",
    level: "seconde",
    free: false,
    order: 14,
  },
  generate,
};
