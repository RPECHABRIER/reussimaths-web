// ---------------------------------------------------------------------------
// Chapitre : Statistiques descriptives (2nde) — sous abonnement.
//
// Correspond au chapitre 10 du manuel de 2nde : moyenne (simple et pondérée),
// médiane d'une série (effectif pair ou impair), quartiles Q1 et Q3 (rang
// ⌈N/4⌉ et ⌈3N/4⌉ dans la série ordonnée, convention du programme français),
// écart interquartile, lecture d'effectifs cumulés croissants, comparaison
// de deux séries via médiane et écart interquartile, linéarité de la
// moyenne, diagrammes à échelle tronquée.
// La correction du livre du professeur (exercices 15-35 : médiane, quartiles,
// écart interquartile, effectifs cumulés, comparaison de séries) a servi à
// identifier la méthode et la convention de calcul des quartiles ; les
// séries sont générées aléatoirement (déjà triées) à chaque tirage.
// Voir automatismes-seconde.js (thème "statistiques-descriptives-seconde")
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

// Construit une série triée par ordre croissant de n valeurs entières entre min et max.
function serieTriee(n, min, max) {
  const valeurs = Array.from({ length: n }, () => randInt(min, max));
  valeurs.sort((a, b) => a - b);
  return valeurs;
}

function mediane(valeurs) {
  const n = valeurs.length;
  if (n % 2 === 1) return valeurs[(n - 1) / 2];
  return (valeurs[n / 2 - 1] + valeurs[n / 2]) / 2;
}

function quartile1(valeurs) {
  const rang = Math.ceil(valeurs.length / 4);
  return valeurs[rang - 1];
}

function quartile3(valeurs) {
  const rang = Math.ceil((3 * valeurs.length) / 4);
  return valeurs[rang - 1];
}

// ---------- 1. Moyenne simple d'une série ----------
function genMoyenneSimpleNumeric() {
  const n = randInt(4, 6);
  const valeurs = Array.from({ length: n }, () => randInt(0, 20));
  const somme = valeurs.reduce((a, b) => a + b, 0);
  // On ajuste la dernière valeur pour garantir une moyenne entière.
  const reste = somme % n;
  if (reste !== 0) valeurs[n - 1] += n - reste;
  const sommeFinale = valeurs.reduce((a, b) => a + b, 0);
  const moy = sommeFinale / n;
  return {
    type: "numeric",
    chapter: "Statistiques descriptives — Moyenne",
    prompt: `Calcule la moyenne de la série suivante : ${valeurs.join(" ; ")}.`,
    answer: moy,
    steps: [
      { type: "regle", text: `\\text{La moyenne d'une série est la somme des valeurs divisée par leur effectif.}` },
      { type: "resultat", text: `\\text{Moyenne} = \\dfrac{${valeurs.join(" + ")}}{${n}} = \\dfrac{${sommeFinale}}{${n}} = ${moy}` },
    ],
  };
}

// ---------- 2. Moyenne pondérée par effectifs ----------
function genMoyennePondereeNumeric() {
  const valeurs = [randInt(0, 5), randInt(6, 10), randInt(11, 15)];
  const effectifs = [randInt(2, 6), randInt(2, 6), randInt(2, 6)];
  const effectifTotal = effectifs.reduce((a, b) => a + b, 0);
  const somme = valeurs.reduce((s, v, i) => s + v * effectifs[i], 0);
  const moy = roundTo(somme / effectifTotal, 2);
  return {
    type: "numeric",
    chapter: "Statistiques descriptives — Moyenne",
    prompt: `Une série statistique est donnée par ce tableau : valeur ${valeurs.join(", ")} avec un effectif respectif de ${effectifs.join(", ")}. Calcule la moyenne de cette série (arrondie au centième).`,
    answer: moy,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{La moyenne pondérée se calcule en multipliant chaque valeur par son effectif, en additionnant, puis en divisant par l'effectif total.}` },
      { type: "resultat", text: `\\text{Moyenne} = \\dfrac{${valeurs.map((v, i) => `${v} \\times ${effectifs[i]}`).join(" + ")}}{${effectifTotal}} = \\dfrac{${somme}}{${effectifTotal}} \\approx ${moy}` },
    ],
  };
}

// ---------- 3. Médiane d'une série à effectif impair ----------
function genMedianeImpairNumeric() {
  const n = pick([7, 9, 11, 13, 15]);
  const valeurs = serieTriee(n, -10, 30);
  return {
    type: "numeric",
    chapter: "Statistiques descriptives — Médiane",
    prompt: `Voici une série ordonnée de ${n} valeurs : ${valeurs.join(" ; ")}. Détermine la médiane de cette série.`,
    answer: mediane(valeurs),
    steps: [
      { type: "regle", text: `\\text{Si l'effectif N est impair, la médiane est la valeur de rang } \\dfrac{N+1}{2}.` },
      { type: "resultat", text: `\\text{L'effectif } ${n} \\text{ est impair : rang } \\dfrac{${n}+1}{2} = ${(n + 1) / 2}, \\text{ soit } ${mediane(valeurs)}.` },
    ],
  };
}

// ---------- 4. Médiane d'une série à effectif pair ----------
function genMedianePairNumeric() {
  const n = pick([8, 10, 12, 14, 16]);
  const valeurs = serieTriee(n, -10, 30);
  const med = mediane(valeurs);
  return {
    type: "numeric",
    chapter: "Statistiques descriptives — Médiane",
    prompt: `Voici une série ordonnée de ${n} valeurs : ${valeurs.join(" ; ")}. Détermine la médiane de cette série.`,
    answer: med,
    steps: [
      { type: "regle", text: `\\text{Si l'effectif N est pair, la médiane est la moyenne des deux valeurs de rangs } \\dfrac{N}{2} \\text{ et } \\dfrac{N}{2}+1.` },
      { type: "resultat", text: `\\text{L'effectif } ${n} \\text{ est pair : moyenne des valeurs de rang } ${n / 2} \\text{ et } ${n / 2 + 1}, \\text{ soit } \\dfrac{${valeurs[n / 2 - 1]} + ${valeurs[n / 2]}}{2} = ${med}.` },
    ],
  };
}

// ---------- 5. Premier quartile Q1 ----------
function genQuartile1Numeric() {
  const n = randInt(9, 24);
  const valeurs = serieTriee(n, -10, 40);
  const rang = Math.ceil(n / 4);
  return {
    type: "numeric",
    chapter: "Statistiques descriptives — Quartiles",
    prompt: `Voici une série ordonnée de ${n} valeurs : ${valeurs.join(" ; ")}. Détermine le premier quartile \\(Q_1\\) de cette série.`,
    answer: quartile1(valeurs),
    steps: [
      { type: "regle", text: `\\text{Le premier quartile } Q_1 \\text{ est la valeur de rang } \\left\\lceil \\dfrac{N}{4} \\right\\rceil \\text{ dans la série ordonnée (au moins un quart des valeurs lui sont inférieures ou égales).}` },
      { type: "calcul", text: `\\text{Rang de } Q_1 = \\left\\lceil \\dfrac{${n}}{4} \\right\\rceil = ${rang}` },
      { type: "resultat", text: `Q_1 = ${quartile1(valeurs)} \\text{ (valeur de rang } ${rang}\\text{)}` },
    ],
  };
}

// ---------- 6. Troisième quartile Q3 ----------
function genQuartile3Numeric() {
  const n = randInt(9, 24);
  const valeurs = serieTriee(n, -10, 40);
  const rang = Math.ceil((3 * n) / 4);
  return {
    type: "numeric",
    chapter: "Statistiques descriptives — Quartiles",
    prompt: `Voici une série ordonnée de ${n} valeurs : ${valeurs.join(" ; ")}. Détermine le troisième quartile \\(Q_3\\) de cette série.`,
    answer: quartile3(valeurs),
    steps: [
      { type: "regle", text: `\\text{Le troisième quartile } Q_3 \\text{ est la valeur de rang } \\left\\lceil \\dfrac{3N}{4} \\right\\rceil \\text{ dans la série ordonnée (au moins trois quarts des valeurs lui sont inférieures ou égales).}` },
      { type: "calcul", text: `\\text{Rang de } Q_3 = \\left\\lceil \\dfrac{3 \\times ${n}}{4} \\right\\rceil = ${rang}` },
      { type: "resultat", text: `Q_3 = ${quartile3(valeurs)} \\text{ (valeur de rang } ${rang}\\text{)}` },
    ],
  };
}

// ---------- 7. Écart interquartile ----------
function genEcartInterquartileNumeric() {
  const n = randInt(9, 24);
  const valeurs = serieTriee(n, -10, 40);
  const q1 = quartile1(valeurs);
  const q3 = quartile3(valeurs);
  return {
    type: "numeric",
    chapter: "Statistiques descriptives — Quartiles",
    prompt: `Voici une série ordonnée de ${n} valeurs : ${valeurs.join(" ; ")}. Calcule l'écart interquartile \\(Q_3 - Q_1\\) de cette série.`,
    answer: q3 - q1,
    steps: [
      { type: "regle", text: `\\text{L'écart interquartile mesure la dispersion de la moitié centrale de la série : } Q_3 - Q_1.` },
      { type: "calcul", text: `Q_1 = ${q1}, \\quad Q_3 = ${q3}` },
      { type: "resultat", text: `Q_3 - Q_1 = ${q3} - ${q1} = ${q3 - q1}` },
    ],
  };
}

// ---------- 8. Lecture d'un effectif cumulé croissant ----------
function genEffectifCumuleNumeric() {
  const valeurs = [1, 2, 3, 4, 5];
  const effectifs = valeurs.map(() => randInt(2, 8));
  const cumules = [];
  let cumul = 0;
  for (const e of effectifs) {
    cumul += e;
    cumules.push(cumul);
  }
  const idx = randInt(0, valeurs.length - 1);
  return {
    type: "numeric",
    chapter: "Statistiques descriptives — Effectifs cumulés",
    prompt: `Tableau d'effectifs : valeur ${valeurs.join(", ")} avec un effectif respectif de ${effectifs.join(", ")}. Quel est l'effectif cumulé croissant de la valeur ${valeurs[idx]} ?`,
    answer: cumules[idx],
    steps: [
      { type: "regle", text: `\\text{L'effectif cumulé croissant d'une valeur est le nombre total d'individus ayant une valeur inférieure ou égale à celle-ci : on additionne les effectifs de toutes les valeurs jusqu'à elle incluse.}` },
      { type: "resultat", text: `\\text{Effectif cumulé} = ${effectifs.slice(0, idx + 1).join(" + ")} = ${cumules[idx]}` },
    ],
  };
}

// ---------- 9. Rang de la médiane selon l'effectif total ----------
function genRangMedianeQCM() {
  const n = randInt(6, 30);
  const impair = n % 2 === 1;
  const bonneReponse = impair ? `la valeur de rang ${(n + 1) / 2}` : `la moyenne des valeurs de rang ${n / 2} et ${n / 2 + 1}`;
  const mauvaise = impair ? `la moyenne des valeurs de rang ${(n - 1) / 2} et ${(n + 1) / 2}` : `la valeur de rang ${n / 2}`;
  return {
    type: "qcm",
    chapter: "Statistiques descriptives — Médiane",
    prompt: `Une série ordonnée comporte ${n} valeurs. Comment détermine-t-on sa médiane ?`,
    answer: bonneReponse,
    options: [bonneReponse, mauvaise],
    steps: [
      { type: "regle", text: `\\text{Si l'effectif } N \\text{ est impair, la médiane est la valeur de rang } \\dfrac{N+1}{2}. \\text{ Si } N \\text{ est pair, c'est la moyenne des valeurs de rang } \\dfrac{N}{2} \\text{ et } \\dfrac{N}{2}+1.` },
      { type: "resultat", text: impair ? `${n} \\text{ est impair : la médiane est } ${bonneReponse}.` : `${n} \\text{ est pair : la médiane est } ${bonneReponse}.` },
    ],
  };
}

// ---------- 10. Comparer deux séries via la médiane ----------
function genComparerMedianesQCM() {
  const nomA = "la classe A";
  const nomB = "la classe B";
  const nA = randInt(9, 15);
  const nB = randInt(9, 15);
  const valeursA = serieTriee(nA, 5, 20);
  const valeursB = serieTriee(nB, 5, 20);
  const medA = mediane(valeursA);
  let medB = mediane(valeursB);
  while (medB === medA) {
    const v = serieTriee(nB, 5, 20);
    valeursB.splice(0, valeursB.length, ...v);
    medB = mediane(valeursB);
  }
  const meilleure = medA > medB ? nomA : nomB;
  return {
    type: "qcm",
    chapter: "Statistiques descriptives — Comparer deux séries",
    prompt: `Notes de ${nomA} : ${valeursA.join(" ; ")}. Notes de ${nomB} : ${valeursB.join(" ; ")}. Quelle classe a obtenu de meilleurs résultats, au sens de la médiane ?`,
    answer: meilleure,
    options: [nomA, nomB],
    steps: [
      { type: "regle", text: `\\text{Pour comparer deux séries au sens de la médiane, on calcule la médiane de chacune : la série ayant la médiane la plus élevée obtient les meilleurs résultats.}` },
      { type: "calcul", text: `\\text{Médiane de } ${nomA} = ${medA}, \\quad \\text{Médiane de } ${nomB} = ${medB}` },
      { type: "resultat", text: `\\text{La classe avec la meilleure médiane est : } ${meilleure}.` },
    ],
  };
}

// ---------- 11. Comparer deux séries via l'écart interquartile (dispersion) ----------
function genComparerDispersionQCM() {
  const nomA = "la série A";
  const nomB = "la série B";
  const nA = randInt(9, 20);
  const nB = randInt(9, 20);
  const valeursA = serieTriee(nA, 0, 40);
  const valeursB = serieTriee(nB, 0, 40);
  const ecartA = quartile3(valeursA) - quartile1(valeursA);
  let ecartB = quartile3(valeursB) - quartile1(valeursB);
  while (ecartB === ecartA) {
    const v = serieTriee(nB, 0, 40);
    valeursB.splice(0, valeursB.length, ...v);
    ecartB = quartile3(valeursB) - quartile1(valeursB);
  }
  const plusDispersee = ecartA > ecartB ? nomA : nomB;
  return {
    type: "qcm",
    chapter: "Statistiques descriptives — Comparer deux séries",
    prompt: `${nomA} : ${valeursA.join(" ; ")}. ${nomB} : ${valeursB.join(" ; ")}. Quelle série présente les résultats les plus dispersés, au sens de l'écart interquartile ?`,
    answer: plusDispersee,
    options: [nomA, nomB],
    steps: [
      { type: "regle", text: `\\text{Pour comparer la dispersion de deux séries, on calcule leur écart interquartile } (Q_3 - Q_1) : \\text{ le plus grand écart correspond à la série la plus dispersée.}` },
      { type: "calcul", text: `\\text{Écart interquartile de } ${nomA} = ${ecartA}, \\quad \\text{Écart interquartile de } ${nomB} = ${ecartB}` },
      { type: "resultat", text: `\\text{La série la plus dispersée est : } ${plusDispersee}.` },
    ],
  };
}

// ---------- 12. Lecture d'un tableau d'effectifs (au moins / au plus) ----------
function genLectureTableauEffectifsQCM() {
  const valeurs = [1, 2, 3, 4, 5, 6];
  const effectifs = valeurs.map(() => randInt(2, 8));
  const effectifTotal = effectifs.reduce((a, b) => a + b, 0);
  const idx = randInt(1, valeurs.length - 2);
  const auMoins = Math.random() < 0.5;
  const nb = auMoins ? effectifs.slice(idx).reduce((a, b) => a + b, 0) : effectifs.slice(0, idx + 1).reduce((a, b) => a + b, 0);
  return {
    type: "numeric",
    chapter: "Statistiques descriptives — Effectifs cumulés",
    prompt: `Tableau d'effectifs : valeur ${valeurs.join(", ")} avec un effectif respectif de ${effectifs.join(", ")} (effectif total : ${effectifTotal}). Combien d'individus ont une valeur ${auMoins ? `supérieure ou égale à ${valeurs[idx]}` : `inférieure ou égale à ${valeurs[idx]}`} ?`,
    answer: nb,
    steps: [
      {
        type: "regle",
        text: auMoins
          ? `\\text{« Au moins } ${valeurs[idx]} \\text{ » signifie : on additionne les effectifs de toutes les valeurs supérieures ou égales à } ${valeurs[idx]}.`
          : `\\text{« Au plus } ${valeurs[idx]} \\text{ » signifie : on additionne les effectifs de toutes les valeurs inférieures ou égales à } ${valeurs[idx]}.`,
      },
      { type: "resultat", text: auMoins ? `${effectifs.slice(idx).join(" + ")} = ${nb}` : `${effectifs.slice(0, idx + 1).join(" + ")} = ${nb}` },
    ],
  };
}

// ---------- 13. Vrai ou faux sur la signification de la médiane ----------
function genSignificationMedianeQCM() {
  const cas = pick([
    {
      affirmation: "Au moins la moitié des valeurs de la série sont inférieures ou égales à la médiane.",
      reponse: "Vrai",
      explication: `\\text{C'est la définition même de la médiane : elle partage la série ordonnée en deux moitiés, donc au moins la moitié des valeurs lui sont inférieures ou égales.}`,
    },
    {
      affirmation: "La médiane est toujours égale à la moyenne de la série.",
      reponse: "Faux",
      explication: `\\text{Médiane et moyenne ne coïncident que pour des séries symétriques. Par exemple, pour la série } 1, 2, 3, 4, 100, \\text{ la médiane vaut } 3 \\text{ mais la moyenne vaut } 22.`,
    },
    {
      affirmation: "Au moins un quart des valeurs de la série sont inférieures ou égales à Q1.",
      reponse: "Vrai",
      explication: `\\text{C'est la définition même du premier quartile } Q_1 : \\text{ au moins un quart des valeurs de la série lui sont inférieures ou égales.}`,
    },
    {
      affirmation: "L'écart interquartile mesure la dispersion de la moitié centrale de la série.",
      reponse: "Vrai",
      explication: `\\text{L'écart interquartile } Q_3 - Q_1 \\text{ délimite l'intervalle contenant la moitié des valeurs centrales de la série : c'est bien une mesure de dispersion.}`,
    },
    {
      affirmation: "La médiane est toujours l'une des valeurs de la série.",
      reponse: "Faux",
      explication: `\\text{Quand l'effectif } N \\text{ est pair, la médiane est la moyenne des deux valeurs centrales, ce qui peut donner un nombre qui n'apparaît pas dans la série (par exemple, la médiane de } 2, 4 \\text{ est } 3).`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Statistiques descriptives — Médiane et quartiles",
    prompt: `Affirmation : « ${cas.affirmation} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }, { type: "resultat", text: cas.reponse === "Vrai" ? `\\text{L'affirmation est } \\textbf{vraie}.` : `\\text{L'affirmation est } \\textbf{fausse}.` }],
  };
}

// ---------- 14. Linéarité de la moyenne ----------
function genLineariteMoyenneNumeric() {
  const moyenneInitiale = randInt(5, 25);
  const variation = nonZero(-8, 8);
  const contexte = pick([
    { sujet: "la température moyenne mesurée dans plusieurs villes", unite: "°C" },
    { sujet: "le salaire moyen des employés d'une entreprise", unite: "€" },
    { sujet: "la taille moyenne des plants d'une serre", unite: "cm" },
  ]);
  return {
    type: "numeric",
    chapter: "Statistiques descriptives — Linéarité de la moyenne",
    prompt: `${contexte.sujet.charAt(0).toUpperCase() + contexte.sujet.slice(1)} valait ${moyenneInitiale} ${contexte.unite}. Chaque valeur de la série a ensuite ${variation >= 0 ? "augmenté" : "diminué"} de ${Math.abs(variation)} ${contexte.unite}. Quelle est la nouvelle moyenne ?`,
    answer: moyenneInitiale + variation,
    steps: [
      { type: "regle", text: `\\text{Si toutes les valeurs varient de la même quantité, la moyenne varie de cette même quantité.}` },
      { type: "resultat", text: `${moyenneInitiale} ${variation >= 0 ? "+" : "-"} ${Math.abs(variation)} = ${moyenneInitiale + variation}` },
    ],
  };
}

// ---------- 15. Diagramme à échelle tronquée (esprit critique) ----------
function genDiagrammeTronqueQCM() {
  return {
    type: "qcm",
    chapter: "Statistiques descriptives — Lecture critique de graphiques",
    prompt: `Un diagramme en barres représentant deux valeurs proches (par exemple 42 % et 44 %) est tracé avec un axe vertical qui commence à 40 % au lieu de 0 %. Quel est l'effet de ce choix sur la lecture visuelle du graphique ?`,
    answer: "Il exagère visuellement la différence entre les deux valeurs",
    options: ["Il exagère visuellement la différence entre les deux valeurs", "Il n'a aucun effet sur la lecture du graphique", "Il réduit visuellement la différence entre les deux valeurs"],
    steps: [{ type: "regle", text: `\\text{Une échelle tronquée (qui ne part pas de 0) fait paraître les écarts entre les barres beaucoup plus importants qu'ils ne le sont réellement.}` }],
  };
}

const GENERATORS = [
  genMoyenneSimpleNumeric,
  genMoyennePondereeNumeric,
  genMedianeImpairNumeric,
  genMedianePairNumeric,
  genQuartile1Numeric,
  genQuartile3Numeric,
  genEcartInterquartileNumeric,
  genEffectifCumuleNumeric,
  genRangMedianeQCM,
  genComparerMedianesQCM,
  genComparerDispersionQCM,
  genLectureTableauEffectifsQCM,
  genSignificationMedianeQCM,
  genLineariteMoyenneNumeric,
  genDiagrammeTronqueQCM,
];

const DIFFICULTY = {
  genMoyenneSimpleNumeric: "facile",
  genMedianeImpairNumeric: "facile",
  genRangMedianeQCM: "facile",
  genLectureTableauEffectifsQCM: "facile",
  genSignificationMedianeQCM: "facile",
  genMoyennePondereeNumeric: "standard",
  genMedianePairNumeric: "standard",
  genQuartile1Numeric: "standard",
  genQuartile3Numeric: "standard",
  genEcartInterquartileNumeric: "standard",
  genEffectifCumuleNumeric: "standard",
  genComparerMedianesQCM: "standard",
  genComparerDispersionQCM: "expert",
  genLineariteMoyenneNumeric: "expert",
  genDiagrammeTronqueQCM: "expert",
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
    id: "statistiques-descriptives-seconde",
    title: "Statistiques descriptives",
    description: "Moyenne simple et pondérée, médiane, quartiles Q1 et Q3, écart interquartile, effectifs cumulés, comparaison de séries, linéarité de la moyenne, lecture critique de graphiques.",
    pourquoi: "Moyenne, médiane et quartiles permettent de résumer un grand nombre de données pour en tirer une information claire — utilisé dans tous les métiers qui manipulent des chiffres.",
    level: "seconde",
    free: false,
    order: 12,
  },
  generate,
};
