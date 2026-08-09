// ---------------------------------------------------------------------------
// Chapitre : Statistiques (3e) — sous abonnement.
//
// Correspond au chapitre 8 du manuel de 3e : paramètres statistiques
// (moyenne, moyenne pondérée, médiane pour un effectif pair ou impair,
// étendue), lecture d'un tableau d'effectifs, représentations graphiques
// (angle d'un secteur dans un diagramme circulaire, cohérence d'un
// regroupement en classes de même amplitude), moyenne et médiane à partir
// d'un tableau à classes (valeur centrale), comparaison de deux séries
// (meilleurs résultats via la moyenne, régularité via l'étendue) et formule
// tableur pour calculer une moyenne.
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "statistiques-troisieme") pour les
// mini-exercices "Calcul mental" associés.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

import { texTable } from "../utils/texTable.js";

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

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

// =========================== Paramètres statistiques ===========================

// ---------- 1. Moyenne d'une série (effectif impair) ----------
function genMoyenneSimpleNumeric() {
  const n = pick([5, 7, 9]);
  const values = Array.from({ length: n }, () => randInt(2, 20));
  const somme = values.reduce((a, b) => a + b, 0);
  const answer = roundTo(somme / n, 2);
  return {
    type: "numeric",
    chapter: "Statistiques — Paramètres statistiques",
    prompt: `Calcule la moyenne de la série suivante : ${texTable([["Série", ...values]])}`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `\\dfrac{${values.join(" + ")}}{${n}} = \\dfrac{${somme}}{${n}} \\approx ${fr(answer)}` }],
  };
}

// ---------- 2. Moyenne pondérée (effectifs) ----------
function genMoyennePondereeNumeric() {
  const k = randInt(3, 5);
  const valeurs = shuffle(Array.from({ length: 8 }, (_, i) => i + 1)).slice(0, k);
  const effectifs = valeurs.map(() => randInt(2, 12));
  const sommeProduits = valeurs.reduce((s, v, i) => s + v * effectifs[i], 0);
  const total = effectifs.reduce((a, b) => a + b, 0);
  const answer = roundTo(sommeProduits / total, 2);
  const detail = valeurs.map((v, i) => `${v} \\times ${effectifs[i]}`).join(" + ");
  return {
    type: "numeric",
    chapter: "Statistiques — Paramètres statistiques",
    prompt: `Dans une classe, on a demandé le nombre de livres lus ce mois-ci. ${texTable([["Livres lus", ...valeurs], ["Nombre d'élèves", ...effectifs]])} Calcule le nombre moyen de livres lus par élève.`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `\\dfrac{${detail}}{${total}} = \\dfrac{${sommeProduits}}{${total}} \\approx ${fr(answer)}` }],
  };
}

// ---------- 3. Médiane, effectif impair ----------
function genMedianeImpairNumeric() {
  const n = pick([7, 9, 11]);
  const values = Array.from({ length: n }, () => randInt(1, 40));
  const sorted = [...values].sort((a, b) => a - b);
  const answer = sorted[(n - 1) / 2];
  return {
    type: "numeric",
    chapter: "Statistiques — Paramètres statistiques",
    prompt: `Détermine la médiane de la série suivante : ${texTable([["Série", ...values]])}`,
    answer,
    steps: [
      { type: "calcul", text: `On range les valeurs dans l'ordre croissant : ${sorted.join(" ; ")}.` },
      { type: "resultat", text: `Il y a ${n} valeurs, donc la médiane est la ${(n + 1) / 2}\\text{e} valeur, c'est-à-dire ${answer}.` },
    ],
  };
}

// ---------- 4. Médiane, effectif pair ----------
function genMedianePairNumeric() {
  const n = pick([6, 8, 10]);
  const values = Array.from({ length: n }, () => randInt(1, 40));
  const sorted = [...values].sort((a, b) => a - b);
  const v1 = sorted[n / 2 - 1];
  const v2 = sorted[n / 2];
  const answer = roundTo((v1 + v2) / 2, 2);
  return {
    type: "numeric",
    chapter: "Statistiques — Paramètres statistiques",
    prompt: `Détermine la médiane de la série suivante : ${texTable([["Série", ...values]])}`,
    answer,
    tolerance: 0.02,
    steps: [
      { type: "calcul", text: `On range les valeurs dans l'ordre croissant : ${sorted.join(" ; ")}.` },
      { type: "calcul", text: `Il y a ${n} valeurs, donc une médiane se situe entre la ${n / 2}\\text{e} et la ${n / 2 + 1}\\text{e} valeur, c'est-à-dire entre ${v1} et ${v2}.` },
      { type: "resultat", text: `\\dfrac{${v1} + ${v2}}{2} = ${fr(answer)}` },
    ],
  };
}

// ---------- 5. Étendue d'une série ----------
function genEtendueNumeric() {
  const n = pick([6, 7, 8, 9]);
  const values = Array.from({ length: n }, () => randInt(0, 50));
  const max = Math.max(...values);
  const min = Math.min(...values);
  const answer = max - min;
  return {
    type: "numeric",
    chapter: "Statistiques — Paramètres statistiques",
    prompt: `Calcule l'étendue de la série suivante : ${texTable([["Série", ...values]])}`,
    answer,
    steps: [
      { type: "donnee", text: `La valeur maximale est ${max} et la valeur minimale est ${min}.` },
      { type: "resultat", text: `Étendue : ${max} - ${min} = ${answer}` },
    ],
  };
}

// ---------- 6. Trouver une valeur manquante connaissant la moyenne ----------
function genValeurManquanteMoyenneNumeric() {
  const n = pick([5, 6, 7]);
  const xSol = randInt(2, 25);
  const autres = Array.from({ length: n - 1 }, () => randInt(2, 25));
  const moyenne = roundTo((autres.reduce((a, b) => a + b, 0) + xSol) / n, 2);
  const somme = roundTo(moyenne * n, 2);
  return {
    type: "numeric",
    chapter: "Statistiques — Paramètres statistiques",
    prompt: `Une série de ${n} valeurs est : ${texTable([["Série", ...autres, "x"]])} Sachant que la moyenne de cette série est ${fr(moyenne)}, détermine la valeur de x.`,
    answer: xSol,
    steps: [
      { type: "donnee", text: `\\dfrac{${autres.join(" + ")} + x}{${n}} = ${fr(moyenne)}` },
      { type: "calcul", text: `${autres.reduce((a, b) => a + b, 0)} + x = ${fr(moyenne)} \\times ${n} = ${fr(somme)}` },
      { type: "resultat", text: `x = ${fr(somme)} - ${autres.reduce((a, b) => a + b, 0)} = ${xSol}` },
    ],
  };
}

// ---------- 7. Comparer deux séries (moyenne et étendue) ----------
function genComparerSeriesQCM() {
  const prenom1 = pick(prenoms);
  const prenom2 = pick(prenoms.filter((p) => p !== prenom1));
  const n = pick([5, 6]);
  const notes1 = Array.from({ length: n }, () => randInt(6, 20));
  const notes2 = Array.from({ length: n }, () => randInt(6, 20));
  const moy1 = roundTo(notes1.reduce((a, b) => a + b, 0) / n, 2);
  const moy2 = roundTo(notes2.reduce((a, b) => a + b, 0) / n, 2);
  const askMeilleur = Math.random() < 0.5;
  if (askMeilleur && moy1 === moy2) {
    notes2[0] += 1;
  }
  const moy2f = roundTo(notes2.reduce((a, b) => a + b, 0) / n, 2);
  const etendue1 = Math.max(...notes1) - Math.min(...notes1);
  const etendue2 = Math.max(...notes2) - Math.min(...notes2);
  let answer, options, question, steps;
  if (askMeilleur) {
    const meilleur = moy1 > moy2f ? prenom1 : prenom2;
    answer = meilleur;
    options = shuffle([prenom1, prenom2]);
    question = `Qui a la meilleure moyenne ?`;
    steps = [
      { type: "calcul", text: `Moyenne de ${prenom1} : \\dfrac{${notes1.join(" + ")}}{${n}} = ${fr(moy1)}` },
      { type: "calcul", text: `Moyenne de ${prenom2} : \\dfrac{${notes2.join(" + ")}}{${n}} = ${fr(moy2f)}` },
      { type: "resultat", text: `${meilleur} a la meilleure moyenne.` },
    ];
  } else {
    if (etendue1 === etendue2) notes2[0] = Math.min(...notes2) === notes2[0] ? notes2[0] + 1 : notes2[0] - 1;
    const etendue2f = Math.max(...notes2) - Math.min(...notes2);
    const plusRegulier = etendue1 < etendue2f ? prenom1 : prenom2;
    answer = plusRegulier;
    options = shuffle([prenom1, prenom2]);
    question = `Qui est le plus régulier (l'étendue la plus faible) ?`;
    steps = [
      { type: "calcul", text: `Étendue de ${prenom1} : ${Math.max(...notes1)} - ${Math.min(...notes1)} = ${etendue1}` },
      { type: "calcul", text: `Étendue de ${prenom2} : ${Math.max(...notes2)} - ${Math.min(...notes2)} = ${etendue2f}` },
      { type: "resultat", text: `${plusRegulier} est le plus régulier.` },
    ];
  }
  return {
    type: "qcm",
    chapter: "Statistiques — Paramètres statistiques",
    prompt: `${texTable([[`Notes de ${prenom1}`, ...notes1]])}${texTable([[`Notes de ${prenom2}`, ...notes2]])} ${question}`,
    answer,
    options,
    steps,
  };
}

// =========================== Représentations graphiques ===========================

// ---------- 8. Angle d'un secteur dans un diagramme circulaire ----------
function genAngleDiagrammeCirculaireNumeric() {
  const k = pick([1, 2, 3]);
  const parts = shuffle([2, 3, 4, 5, 6]).slice(0, 3).map((p) => p * k);
  const total = parts.reduce((a, b) => a + b, 0);
  const i = randInt(0, 2);
  const angle = roundTo((parts[i] * 360) / total, 1);
  return {
    type: "numeric",
    chapter: "Statistiques — Représentations graphiques",
    prompt: `Dans une classe de ${total} élèves, ${parts[i]} pratiquent un sport donné. Pour représenter cette répartition avec un diagramme circulaire, quel doit être l'angle (en degrés, arrondi au dixième) du secteur correspondant à ce sport ?`,
    answer: angle,
    tolerance: 0.2,
    steps: [
      { type: "regle", text: `Angle du secteur = (effectif de la catégorie ÷ effectif total) × 360°.` },
      { type: "calcul", text: `\\dfrac{${parts[i]} \\times 360}{${total}} \\approx ${fr(angle)}\\text{°}` },
    ],
  };
}

// ---------- 9. Lecture d'un tableau d'effectifs ----------
const objetsSondage = ["mention obtenue", "couleur préférée", "sport pratiqué", "moyen de transport", "film préféré"];
function genLectureTableauEffectifsQCM() {
  const k = pick([4, 5]);
  const noms = shuffle(["A", "B", "C", "D", "E"]).slice(0, k);
  const effectifs = noms.map(() => randInt(2, 25));
  const total = effectifs.reduce((a, b) => a + b, 0);
  const objet = pick(objetsSondage);
  const askMax = Math.random() < 0.5;
  const idx = askMax ? effectifs.indexOf(Math.max(...effectifs)) : effectifs.indexOf(Math.min(...effectifs));
  return {
    type: "qcm",
    chapter: "Statistiques — Représentations graphiques",
    prompt: `Voici un tableau d'effectifs pour un sondage sur le(la) ${objet} : ${texTable([["Catégorie", ...noms], ["Effectif", ...effectifs]])} Quelle catégorie a le ${askMax ? "plus grand" : "plus petit"} effectif ?`,
    answer: noms[idx],
    options: shuffle([...noms]),
    steps: [
      { type: "donnee", text: `Effectif total : ${total}.` },
      { type: "resultat", text: `${askMax ? "Le plus grand effectif" : "Le plus petit effectif"} est ${effectifs[idx]}, obtenu pour la catégorie ${noms[idx]}.` },
    ],
  };
}

// ---------- 10. Vérifier si un regroupement en classes est cohérent ----------
function genRegroupementClassesQCM() {
  const amplitude = pick([5, 10]);
  const nbClasses = pick([4, 5]);
  const debut = randInt(0, 20);
  const valid = Math.random() < 0.5;
  const bornes = [debut];
  for (let j = 0; j < nbClasses; j++) bornes.push(bornes[j] + amplitude);
  let classesTexte;
  if (valid) {
    classesTexte = bornes.slice(0, -1).map((b, j) => `[${b} ; ${bornes[j + 1]}[`).join(", ");
  } else {
    const bornesBad = [...bornes];
    const idxBad = randInt(1, nbClasses - 1);
    bornesBad[idxBad] += pick([-2, 2, 3]);
    classesTexte = bornesBad.slice(0, -1).map((b, j) => `[${b} ; ${bornesBad[j + 1]}[`).join(", ");
  }
  return {
    type: "qcm",
    chapter: "Statistiques — Représentations graphiques",
    prompt: `Un tableau regroupe des valeurs dans les classes suivantes : ${classesTexte}. Toutes les classes ont-elles la même amplitude (${amplitude}) ?`,
    answer: valid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `Rappel : l'amplitude d'une classe [a ; b[ est b - a.` },
      { type: "resultat", text: valid ? `Chaque classe a bien une amplitude de ${amplitude}.` : `Au moins une classe n'a pas une amplitude de ${amplitude} : le regroupement n'est pas cohérent.` },
    ],
  };
}

// ---------- 11. Moyenne à partir d'un tableau à classes (valeur centrale) ----------
function genMoyenneClasseNumeric() {
  const amplitude = pick([10, 20]);
  const debut = randInt(0, 30);
  const nbClasses = 3;
  const bornes = [debut];
  for (let j = 0; j < nbClasses; j++) bornes.push(bornes[j] + amplitude);
  const effectifs = Array.from({ length: nbClasses }, () => randInt(2, 15));
  const centres = bornes.slice(0, -1).map((b, j) => (b + bornes[j + 1]) / 2);
  const total = effectifs.reduce((a, b) => a + b, 0);
  const sommeProduits = centres.reduce((s, c, j) => s + c * effectifs[j], 0);
  const answer = roundTo(sommeProduits / total, 1);
  const classeLabels = bornes.slice(0, -1).map((b, j) => `[${b}\\,;\\,${bornes[j + 1]}[`);
  const detail = centres.map((c, j) => `${fr(c)} \\times ${effectifs[j]}`).join(" + ");
  return {
    type: "numeric",
    chapter: "Statistiques — Représentations graphiques",
    prompt: `Voici un tableau d'effectifs par classes : ${texTable([["Classe", ...classeLabels], ["Effectif", ...effectifs]])} En utilisant la valeur centrale de chaque classe, calcule la moyenne de cette série (arrondie au dixième).`,
    answer,
    tolerance: 0.15,
    steps: [
      { type: "regle", text: `On utilise la valeur centrale de chaque classe : ${centres.map(fr).join(", ")}.` },
      { type: "resultat", text: `\\dfrac{${detail}}{${total}} = \\dfrac{${fr(sommeProduits)}}{${total}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 12. Dans quelle classe se situe la médiane ----------
function genMedianeClasseQCM() {
  const amplitude = pick([10]);
  const debut = randInt(0, 20);
  const nbClasses = 4;
  const bornes = [debut];
  for (let j = 0; j < nbClasses; j++) bornes.push(bornes[j] + amplitude);
  const effectifs = Array.from({ length: nbClasses }, () => randInt(3, 12));
  const total = effectifs.reduce((a, b) => a + b, 0);
  const rangMedian = total % 2 === 0 ? total / 2 : (total + 1) / 2;
  let cumul = 0;
  let classeMediane = 0;
  for (let j = 0; j < nbClasses; j++) {
    cumul += effectifs[j];
    if (cumul >= rangMedian) {
      classeMediane = j;
      break;
    }
  }
  const options = bornes.slice(0, -1).map((b, j) => `[${b} ; ${bornes[j + 1]}[`);
  const classeLabels = bornes.slice(0, -1).map((b, j) => `[${b}\\,;\\,${bornes[j + 1]}[`);
  return {
    type: "qcm",
    chapter: "Statistiques — Représentations graphiques",
    prompt: `Voici un tableau d'effectifs par classes : ${texTable([["Classe", ...classeLabels], ["Effectif", ...effectifs]])} Dans quelle classe se situe la médiane de cette série ?`,
    answer: options[classeMediane],
    options,
    steps: [
      { type: "calcul", text: `L'effectif total est ${total}, donc la médiane se situe autour de la ${rangMedian}\\text{e} valeur.` },
      { type: "resultat", text: `En cumulant les effectifs classe par classe, on atteint ce rang dans la classe ${options[classeMediane]}.` },
    ],
  };
}

// ---------- 13. Fréquence d'une valeur ----------
function genFrequenceNumeric() {
  const total = pick([20, 25, 40, 50]);
  const effectif = randInt(2, total - 2);
  const enPourcentage = Math.random() < 0.5;
  const freq = roundTo((effectif / total) * 100, 1);
  return {
    type: "numeric",
    chapter: "Statistiques — Paramètres statistiques",
    prompt: `Dans une série de ${total} valeurs, une valeur donnée apparaît ${effectif} fois. Calcule sa fréquence en pourcentage (arrondie au dixième).`,
    answer: freq,
    tolerance: 0.2,
    steps: [
      { type: "regle", text: `Fréquence en % = (effectif ÷ effectif total) × 100.` },
      { type: "calcul", text: `\\dfrac{${effectif}}{${total}} \\times 100 \\approx ${fr(freq)}\\ \\%` },
    ],
  };
}

// ---------- 14. Formule tableur pour calculer une moyenne ----------
function genFormuleTableurQCM() {
  const n = randInt(15, 40);
  const colonne = pick(["B", "C", "D"]);
  const bonneFormule = `=MOYENNE(${colonne}2:${colonne}${n + 1})`;
  const mauvaises = [
    `=SOMME(${colonne}2:${colonne}${n + 1})`,
    `=MOYENNE(${colonne}1:${colonne}${n})`,
    `=MEDIANE(${colonne}2:${colonne}${n + 1})`,
  ];
  const options = shuffle([bonneFormule, pick(mauvaises)]);
  return {
    type: "qcm",
    chapter: "Statistiques — Représentations graphiques",
    prompt: `Dans un tableur, les ${n} valeurs d'une série sont saisies dans les cellules ${colonne}2 à ${colonne}${n + 1}. Quelle formule permet de calculer leur moyenne ?`,
    answer: bonneFormule,
    options,
    steps: [
      { type: "regle", text: `La fonction MOYENNE calcule directement la moyenne d'une plage de cellules.` },
      { type: "resultat", text: `Il faut donc saisir ${bonneFormule}.` },
    ],
  };
}

// ---------- 15. Comparer moyenne et médiane (effet d'une valeur extrême) ----------
function genMoyenneMedianeExtremeQCM() {
  const base = Array.from({ length: 6 }, () => randInt(10, 20));
  const extreme = pick([true, false]);
  const values = extreme ? [...base, randInt(80, 150)] : [...base, randInt(10, 20)];
  const n = values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const moyenne = roundTo(values.reduce((a, b) => a + b, 0) / n, 1);
  const mediane = n % 2 === 0 ? roundTo((sorted[n / 2 - 1] + sorted[n / 2]) / 2, 1) : sorted[(n - 1) / 2];
  const answer = moyenne > mediane + 5 ? "La moyenne" : "Ni l'une ni l'autre nettement";
  const options = ["La moyenne", "La médiane", "Ni l'une ni l'autre nettement"];
  return {
    type: "qcm",
    chapter: "Statistiques — Paramètres statistiques",
    prompt: `Voici une série de valeurs : ${values.join(" ; ")}. Laquelle, de la moyenne ou de la médiane, est la plus influencée par une valeur extrême dans cette série ?`,
    answer: "La moyenne",
    options: ["La moyenne", "La médiane"],
    steps: [
      { type: "calcul", text: `Moyenne : \\dfrac{${values.join(" + ")}}{${n}} \\approx ${fr(moyenne)}` },
      { type: "calcul", text: `Une médiane : ${fr(mediane)}` },
      { type: "resultat", text: `La moyenne est beaucoup plus sensible aux valeurs extrêmes que la médiane, qui ne dépend que du rang des valeurs.` },
    ],
  };
}

const GENERATORS = [
  genMoyenneSimpleNumeric,
  genMoyennePondereeNumeric,
  genMedianeImpairNumeric,
  genMedianePairNumeric,
  genEtendueNumeric,
  genValeurManquanteMoyenneNumeric,
  genComparerSeriesQCM,
  genAngleDiagrammeCirculaireNumeric,
  genLectureTableauEffectifsQCM,
  genRegroupementClassesQCM,
  genMoyenneClasseNumeric,
  genMedianeClasseQCM,
  genFrequenceNumeric,
  genFormuleTableurQCM,
  genMoyenneMedianeExtremeQCM,
];

const DIFFICULTY = {
  genMoyenneSimpleNumeric: "facile",
  genMedianeImpairNumeric: "facile",
  genEtendueNumeric: "facile",
  genLectureTableauEffectifsQCM: "facile",
  genFrequenceNumeric: "facile",
  genMoyennePondereeNumeric: "standard",
  genMedianePairNumeric: "standard",
  genComparerSeriesQCM: "standard",
  genAngleDiagrammeCirculaireNumeric: "standard",
  genRegroupementClassesQCM: "standard",
  genFormuleTableurQCM: "standard",
  genValeurManquanteMoyenneNumeric: "expert",
  genMoyenneClasseNumeric: "expert",
  genMedianeClasseQCM: "expert",
  genMoyenneMedianeExtremeQCM: "expert",
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
    id: "statistiques-troisieme",
    title: "Statistiques",
    description: "Moyenne, moyenne pondérée, médiane, étendue, fréquence, lecture de tableaux d'effectifs, angle d'un diagramme circulaire, tableaux à classes et comparaison de séries.",
    pourquoi: "Moyenne, médiane et fréquence permettent de résumer et comparer des séries de données réelles, comme dans une étude statistique.",
    level: "troisieme",
    free: false,
    order: 9,
    cours: {
      mindMap: {
        title: "Statistiques",
        branches: [
          {
            title: "Moyenne, médiane, étendue",
            items: [
              "Moyenne = somme des valeurs ÷ effectif total (ou moyenne pondérée avec des effectifs différents).",
              "Médiane : on range les valeurs, puis on prend la valeur centrale (effectif impair) ou la moyenne des deux valeurs centrales (effectif pair).",
              "Étendue = valeur maximale - valeur minimale : elle mesure la dispersion d'une série.",
              "Pour retrouver une valeur manquante connaissant la moyenne, on utilise la relation inverse : somme des valeurs = moyenne × effectif total.",
              "Dans un tableur, on calcule une moyenne avec la formule MOYENNE(plage) — piège classique : bien faire commencer la plage après la ligne d'en-tête.",
            ],
          },
          {
            title: "Comparer deux séries",
            items: [
              "On compare les moyennes pour savoir qui a les meilleurs résultats en moyenne.",
              "On compare les étendues pour savoir qui est le plus régulier (étendue faible = résultats homogènes).",
              "Piège classique : la moyenne est très sensible à une valeur extrême, contrairement à la médiane.",
            ],
          },
          {
            title: "Tableau à classes",
            items: [
              "Toutes les classes d'un regroupement doivent avoir la même amplitude pour être comparables.",
              "Pour calculer une moyenne à partir de classes, on utilise la valeur centrale de chaque classe.",
              "Pour trouver la classe médiane, on cumule les effectifs classe par classe jusqu'à atteindre le rang médian.",
            ],
          },
          {
            title: "Diagramme circulaire",
            items: [
              "Angle du secteur = (effectif de la catégorie ÷ effectif total) × 360°.",
              "La fréquence en pourcentage se calcule par (effectif ÷ effectif total) × 100.",
            ],
            formula: "\\(\\text{angle} = \\dfrac{\\text{effectif}}{\\text{total}} \\times 360°\\)",
          },
        ],
      },
    },
  },
  generate,
};
