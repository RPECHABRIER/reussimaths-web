// ---------------------------------------------------------------------------
// Chapitre : Exercices de fin d'année (4e) — sous abonnement.
//
// Ce chapitre reprend les exercices transversaux du manuel (qui mobilisent
// plusieurs chapitres à la fois : nombres relatifs, calcul littéral,
// équations, fonctions, statistiques, probabilités, Thalès, Pythagore,
// trigonométrie, translations, géométrie dans l'espace...), avec des
// nombres, prénoms et contextes différents à chaque génération, comme pour
// tous les autres chapitres. Il ne s'agit pas d'un chapitre du programme à
// proprement parler mais d'une révision finale mélangeant les notions vues
// toute l'année de 4e.
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

const PRENOMS = ["Léa", "Nathan", "Camille", "Yanis", "Inès", "Malo", "Sofia", "Adam", "Lina", "Théo", "Rania", "Enzo"];

const TRIPLETS = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
];

// ---------- 1. Programme de calcul : retrouver un nombre de départ (calcul littéral + équations) ----------
function genProgrammeCalculPointFixeNumeric() {
  const xSol = randInt(-8, 12);
  const b = randInt(2, 6);
  const c = randInt(-5, 5);
  const a = b * (xSol + c) - xSol;
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Programme de calcul",
    prompt: `On considère le programme de calcul suivant : 1. Choisir un nombre. 2. Lui ajouter ${a}. 3. Diviser le résultat obtenu par ${b}. 4. Retirer ${c} au résultat. Pour quel nombre choisi au départ obtient-on, en sortie du programme, le nombre choisi initialement ?`,
    answer: xSol,
    steps: [
      { type: "donnee", text: `\\dfrac{x + ${a}}{${b}} - ${c} = x` },
      { type: "calcul", text: `x + ${a} = ${b}(x + ${c})` },
      { type: "calcul", text: `x + ${a} = ${b}x + ${b * c}` },
      { type: "calcul", text: `${a} - ${b * c} = ${b}x - x = ${b - 1}x` },
      { type: "resultat", text: `x = ${xSol}` },
    ],
  };
}

// ---------- 2. Fonction affine contextualisée : trophées (fonctions + équations) ----------
function genFonctionTropheesNumeric() {
  const prenom = pick(PRENOMS);
  const base = randInt(1, 3);
  const inc = pick([0.5, 1]);
  const x = randInt(2, 20);
  const N = roundTo(base + inc * x, 2);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Fonctions et équations",
    prompt: `${prenom} a ${base} trophée(s) au départ dans un jeu vidéo, et gagne ${fr(inc)} trophée(s) supplémentaire(s) à chaque connexion. Après combien de connexions ${prenom} obtient-il ${fr(N)} trophées ?`,
    answer: x,
    steps: [
      { type: "regle", text: `N = ${base} + ${fr(inc)} \\times x` },
      { type: "calcul", text: `${fr(N)} = ${base} + ${fr(inc)} \\times x` },
      { type: "resultat", text: `x = \\dfrac{${fr(N)} - ${base}}{${fr(inc)}} = ${x}` },
    ],
  };
}

// ---------- 3. Diagramme circulaire (statistiques + proportionnalité) ----------
function genDiagrammeCirculaireAngleNumeric() {
  const T = pick([20, 24, 30, 36, 40, 50, 60]);
  const count = randInt(1, T - 1);
  const angle = roundTo((360 * count) / T, 1);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Statistiques",
    prompt: `Lors d'un sondage, ${count} personnes sur ${T} interrogées ont répondu « oui » à une question. Sur un diagramme circulaire, quelle est la mesure de l'angle correspondant à cette réponse, en degrés (arrondie au dixième si nécessaire) ?`,
    answer: angle,
    tolerance: 0.5,
    steps: [{ type: "calcul", text: `\\dfrac{${count}}{${T}} \\times 360 \\approx ${fr(angle)}°` }],
  };
}

// ---------- 4. Égalité de triangles + théorème de Pythagore ----------
function genTrianglesEgauxHypotenuseNumeric() {
  const [a0, b0, c0] = pick(TRIPLETS);
  const k = randInt(1, 3);
  const leg1 = a0 * k;
  const leg2 = b0 * k;
  const hyp = c0 * k;
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Triangles et Pythagore",
    prompt: `ABC et DEF sont deux triangles égaux (superposables), avec ABC rectangle en B tel que AB = ${leg1} cm et AC = ${hyp} cm (hypoténuse). Le côté [EF] du triangle DEF correspond au côté [BC] du triangle ABC. Calcule la longueur EF, en cm.`,
    answer: leg2,
    steps: [
      { type: "calcul", text: `BC^2 = AC^2 - AB^2 = ${hyp}^2 - ${leg1}^2 = ${hyp * hyp} - ${leg1 * leg1} = ${leg2 * leg2}` },
      { type: "calcul", text: `BC = \\sqrt{${leg2 * leg2}} = ${leg2}` },
      { type: "resultat", text: `\\text{Les triangles étant égaux, EF} = BC = ${leg2}\\ cm` },
    ],
  };
}

// ---------- 5. Périmètre d'un triangle rectangle aux côtés fractionnaires ----------
function genPerimetreTriangleFractionNumeric() {
  const k = pick([2, 4, 5, 10]);
  const [a0, b0, c0] = pick(TRIPLETS);
  const leg1 = roundTo(a0 / k, 2);
  const leg2 = roundTo(b0 / k, 2);
  const hyp = roundTo(c0 / k, 2);
  const perimetre = roundTo(leg1 + leg2 + hyp, 2);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Triangles et Pythagore",
    prompt: `Un triangle est rectangle, avec des côtés de l'angle droit mesurant ${fr(leg1)} cm et ${fr(leg2)} cm, et une hypoténuse de ${fr(hyp)} cm. Calcule le périmètre de ce triangle, en cm.`,
    answer: perimetre,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `P = ${fr(leg1)} + ${fr(leg2)} + ${fr(hyp)} = ${fr(perimetre)}\\ cm` }],
  };
}

// ---------- 6. Deux calculs donnent-ils le même résultat ? (nombres relatifs + calcul littéral) ----------
function genComparerCalculsIdentiteQCM() {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const c = randInt(2, 9);
  const isSame = Math.random() < 0.5;
  const b2 = isSame ? b : b + nonZero(1, 3);
  const expr1Val = a * (b + c);
  const expr2Val = a * b2 + a * c;
  return {
    type: "qcm",
    chapter: "Exercices de fin d'année — Nombres et calculs",
    prompt: `Calcul 1 : \\(${a} \\times (${b} + ${c})\\). Calcul 2 : \\(${a} \\times ${b2} + ${a} \\times ${c}\\). Ces deux calculs donnent-ils le même résultat ?`,
    answer: isSame ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `\\text{Calcul 1} = ${a} \\times ${b + c} = ${expr1Val}` },
      { type: "calcul", text: `\\text{Calcul 2} = ${a * b2} + ${a * c} = ${expr2Val}` },
    ],
  };
}

// ---------- 7. Probabilité (deux dés, dont un avec des nombres négatifs) ----------
function genProbabiliteDeuxDesSommeNumeric() {
  const t = pick([-1, 0, 1]);
  let count = 0;
  for (let d1 = 1; d1 <= 6; d1++) {
    for (let d2 = -6; d2 <= -1; d2++) {
      if (d1 + d2 >= t) count++;
    }
  }
  const prob = roundTo(count / 36, 4);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Probabilités",
    prompt: `Alix lance deux dés équilibrés à six faces : le premier a ses faces numérotées de 1 à 6, le second a ses faces numérotées de -1 à -6. Elle gagne si la somme des deux dés obtenus est supérieure ou égale à ${t}. Quelle est la probabilité qu'elle gagne, sous forme décimale (arrondie au millième) ?`,
    answer: prob,
    tolerance: 0.001,
    steps: [
      { type: "donnee", text: `\\text{Il y a } ${count} \\text{ issues favorables sur } 36.` },
      { type: "resultat", text: `P = \\dfrac{${count}}{36} \\approx ${fr(prob)}` },
    ],
  };
}

// ---------- 8. Réciproque du théorème de Thalès (contexte) ----------
function genThalesReciproqueContexteQCM() {
  const q = randInt(2, 5);
  const p = randInt(1, q - 1);
  const AC = q * randInt(2, 6);
  const AE = q * randInt(2, 6);
  const AB = (AC * p) / q;
  const isParallel = Math.random() < 0.5;
  const AD = isParallel ? (AE * p) / q : (AE * p) / q + nonZero(1, 2);
  return {
    type: "qcm",
    chapter: "Exercices de fin d'année — Thalès",
    prompt: `Soit ACE un triangle, B un point de [AC] et D un point de [AE]. On donne AB = ${AB} cm, AC = ${AC} cm, AD = ${AD} cm et AE = ${AE} cm. Les droites (BD) et (CE) sont-elles parallèles ?`,
    answer: isParallel ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `\\dfrac{AB}{AC} = \\dfrac{${AB}}{${AC}}` },
      { type: "calcul", text: `\\dfrac{AD}{AE} = \\dfrac{${AD}}{${AE}}` },
      {
        type: "resultat",
        text: isParallel
          ? "Les quotients sont égaux : d'après la réciproque du théorème de Thalès, les droites sont parallèles."
          : "Les quotients sont différents : les droites ne sont pas parallèles.",
      },
    ],
  };
}

// ---------- 9. Ajouter une valeur à une série pour obtenir une médiane donnée ----------
function genAjouterValeurMedianeNumeric() {
  const M = randInt(5, 7);
  const below = [];
  while (below.length < 3) {
    const v = roundTo(1 + Math.random() * 3, 1);
    if (!below.includes(v)) below.push(v);
  }
  const above = [];
  while (above.length < 3) {
    const v = roundTo(8 + Math.random() * 4, 1);
    if (!above.includes(v)) above.push(v);
  }
  const series = shuffle([...below, ...above]);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Statistiques",
    prompt: `On considère la série statistique suivante : ${series.map(fr).join(" ; ")}. Quelle valeur peut-on ajouter à cette série afin qu'elle admette ${fr(M)} comme médiane ?`,
    answer: M,
    tolerance: 0.05,
    steps: [
      { type: "donnee", text: `\\text{En triant : } ${below.sort((a, b) => a - b).map(fr).join(" ; ")} < ${fr(M)} < ${above.sort((a, b) => a - b).map(fr).join(" ; ")}` },
      { type: "resultat", text: `\\text{En ajoutant } ${fr(M)}\\text{, la série triée compte 7 valeurs, dont la 4}^e\\text{ (médiane) est } ${fr(M)}.` },
    ],
  };
}

// ---------- 10. Ajouter une valeur à une série pour obtenir une moyenne donnée ----------
function genAjouterValeurMoyenneNumeric() {
  const values = [randInt(1, 10), randInt(1, 10), randInt(1, 10), randInt(1, 10)].map((v) => roundTo(v + Math.random() * 0.9, 1));
  const S = roundTo(values.reduce((s, v) => s + v, 0), 2);
  const Mtarget = randInt(3, 8);
  const x = roundTo(Mtarget * (values.length + 1) - S, 1);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Statistiques",
    prompt: `On considère la série statistique suivante : ${values.map(fr).join(" ; ")}. Quelle valeur peut-on ajouter à cette série afin que sa moyenne soit égale à ${Mtarget} ?`,
    answer: x,
    tolerance: 0.05,
    steps: [
      { type: "donnee", text: `\\text{Somme actuelle} = ${fr(roundTo(S, 1))}` },
      { type: "regle", text: `\\dfrac{\\text{Somme} + x}{${values.length + 1}} = ${Mtarget}` },
      { type: "resultat", text: `x = ${Mtarget} \\times ${values.length + 1} - ${fr(roundTo(S, 1))} = ${fr(x)}` },
    ],
  };
}

// ---------- 11. Volume d'une pyramide (aire de base donnée, géométrie dans l'espace) ----------
function genVolumePyramideAireDonneeNumeric() {
  const cote = roundTo(2 + Math.random() * 8, 2);
  const aire = roundTo(cote * cote, 2);
  const hauteur = randInt(3, 12);
  const volume = roundTo((aire * hauteur) / 3, 2);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Géométrie dans l'espace",
    prompt: `Une pyramide a une base carrée de côté ${fr(cote)} cm (donc d'aire ${fr(aire)} cm²) et une hauteur de ${hauteur} cm. Calcule son volume, en cm³ (arrondi au centième).`,
    answer: volume,
    tolerance: 0.05,
    steps: [
      { type: "calcul", text: `\\text{Aire de la base} = ${fr(cote)}^2 = ${fr(aire)}\\ cm^2` },
      { type: "resultat", text: `V = \\dfrac{${fr(aire)} \\times ${hauteur}}{3} \\approx ${fr(volume)}\\ cm^3` },
    ],
  };
}

// ---------- 12. Patron d'un cône : génératrice puis angle du secteur ----------
function genPatronConeAngleSecteurNumeric() {
  const rayon = randInt(2, 8);
  const hauteur = randInt(3, 12);
  const generatrice = roundTo(Math.sqrt(rayon * rayon + hauteur * hauteur), 2);
  const angle = roundTo((360 * rayon) / generatrice, 1);
  return {
    type: "numeric",
    chapter: "Exercices de fin d'année — Géométrie dans l'espace",
    prompt: `On veut tracer le patron d'un cône de révolution de rayon de base ${rayon} cm et de hauteur ${hauteur} cm. Sachant que la mesure de l'angle au sommet du secteur du patron est donnée par \\(360° \\times \\dfrac{\\text{rayon}}{\\text{génératrice}}\\), calcule cette mesure d'angle, en degrés (arrondie au dixième).`,
    answer: angle,
    tolerance: 0.5,
    steps: [
      { type: "calcul", text: `\\text{génératrice} = \\sqrt{${rayon}^2 + ${hauteur}^2} \\approx ${fr(generatrice)}\\ cm` },
      { type: "resultat", text: `\\text{angle} = 360 \\times \\dfrac{${rayon}}{${fr(generatrice)}} \\approx ${fr(angle)}°` },
    ],
  };
}

// ---------- 13. Translation : nature du quadrilatère AA'B'B ----------
function genTranslationQuadrilatereContexteQCM() {
  const [A, B] = shuffle(["A", "B", "C", "D", "E", "F", "G", "H"]).slice(0, 2);
  return {
    type: "qcm",
    chapter: "Exercices de fin d'année — Translations",
    prompt: `${A}' est l'image du point ${A} par une translation. ${B}' est l'image du point ${B} par cette même translation. Que peut-on dire, en général, du quadrilatère ${A}${A}'${B}'${B} ?`,
    answer: "Parallélogramme",
    options: ["Parallélogramme", "Rectangle", "Losange", "Rien de particulier"],
    steps: [
      { type: "regle", text: `\\text{Une translation conserve les longueurs et le parallélisme : } (${A}${A}') // (${B}${B}') \\text{ et } ${A}${A}' = ${B}${B}'.` },
      { type: "resultat", text: `\\text{Donc } ${A}${A}'${B}'${B} \\text{ est un parallélogramme.}` },
    ],
  };
}

// ---------- 14. Réarranger l'égalité de Pythagore ----------
function genPythagoreFormuleRearrangementQCM() {
  const [R, X, Y] = shuffle(["H", "U", "L", "M", "N", "P", "S", "T", "V"]).slice(0, 3);
  const correct = `${R}${X}^2 = ${X}${Y}^2 - ${R}${Y}^2`;
  const wrong1 = `${R}${X}^2 = ${R}${Y}^2 + ${X}${Y}^2`;
  const wrong2 = `${R}${X}^2 = ${R}${Y}^2 - ${X}${Y}^2`;
  const options = shuffle([...new Set([correct, wrong1, wrong2])]);
  return {
    type: "qcm",
    chapter: "Exercices de fin d'année — Pythagore",
    prompt: `${X}${R}${Y} est un triangle rectangle en ${R}. Laquelle de ces formules permet de déterminer ${R}${X} ?`,
    answer: correct,
    options: options.length >= 2 ? options : [correct, wrong1],
    steps: [{ type: "regle", text: `\\text{Dans un triangle rectangle en } ${R}\\text{, l'hypoténuse est } [${X}${Y}]\\text{, donc } ${X}${Y}^2 = ${R}${X}^2 + ${R}${Y}^2.` }],
  };
}

// ---------- 15. Factoriser une expression littérale ----------
function genFactorisationExpressionQCM() {
  const gcdVal = randInt(2, 6);
  const m = randInt(2, 10);
  const n = randInt(1, 10);
  const a = gcdVal * m;
  const b = gcdVal * n;
  const correct = `${gcdVal}(${m}x + ${n})`;
  const wrong1 = `${a}(x + ${n})`;
  const wrong2 = `${a}x`;
  const wrong3 = `${gcdVal + 1}(${m}x + ${n})`;
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])]);
  return {
    type: "qcm",
    chapter: "Exercices de fin d'année — Calcul littéral",
    prompt: `L'expression \\(${a}x + ${b}\\) peut être factorisée sous la forme :`,
    answer: correct,
    options: options.length >= 2 ? options : [correct, wrong1],
    steps: [{ type: "calcul", text: `${a}x + ${b} = ${gcdVal}(${m}x + ${n})\\ \\text{ car } ${a} = ${gcdVal} \\times ${m}\\ \\text{ et } ${b} = ${gcdVal} \\times ${n}.` }],
  };
}

const GENERATORS = [
  genProgrammeCalculPointFixeNumeric,
  genFonctionTropheesNumeric,
  genDiagrammeCirculaireAngleNumeric,
  genTrianglesEgauxHypotenuseNumeric,
  genPerimetreTriangleFractionNumeric,
  genComparerCalculsIdentiteQCM,
  genProbabiliteDeuxDesSommeNumeric,
  genThalesReciproqueContexteQCM,
  genAjouterValeurMedianeNumeric,
  genAjouterValeurMoyenneNumeric,
  genVolumePyramideAireDonneeNumeric,
  genPatronConeAngleSecteurNumeric,
  genTranslationQuadrilatereContexteQCM,
  genPythagoreFormuleRearrangementQCM,
  genFactorisationExpressionQCM,
];

const DIFFICULTY = {
  genDiagrammeCirculaireAngleNumeric: "facile",
  genPythagoreFormuleRearrangementQCM: "facile",
  genTrianglesEgauxHypotenuseNumeric: "standard",
  genPerimetreTriangleFractionNumeric: "standard",
  genComparerCalculsIdentiteQCM: "standard",
  genThalesReciproqueContexteQCM: "standard",
  genAjouterValeurMoyenneNumeric: "standard",
  genVolumePyramideAireDonneeNumeric: "standard",
  genTranslationQuadrilatereContexteQCM: "standard",
  genFactorisationExpressionQCM: "standard",
  genProgrammeCalculPointFixeNumeric: "expert",
  genFonctionTropheesNumeric: "expert",
  genProbabiliteDeuxDesSommeNumeric: "expert",
  genAjouterValeurMedianeNumeric: "expert",
  genPatronConeAngleSecteurNumeric: "expert",
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
    id: "exercices-fin-annee-quatrieme",
    title: "Exercices de fin d'année",
    description: "Révision finale mélangeant les notions de tous les chapitres de 4e (exercices transversaux).",
    pourquoi: "Ce brassage de fin d'année permet de vérifier que toutes les notions de 4e sont bien consolidées avant d'aborder la 3e.",
    level: "quatrieme",
    free: false,
    order: 16,
  },
  generate,
};
