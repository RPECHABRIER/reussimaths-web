// ---------------------------------------------------------------------------
// Chapitre : Préparation au Brevet (3e) — sous abonnement, dernier chapitre.
//
// Correspond au "Dossier Brevet" du manuel de 3e (chapitre 15) : révision
// transversale mêlant programmes de calcul (numériques et littéraux),
// identités remarquables, écriture scientifique, équations issues d'une
// aire composée ou de parenthèses, comparaison de deux tarifs (fonction
// linéaire vs affine, égalité et budget maximal), lecture d'image/antécédent
// d'une fonction affine, statistiques (moyenne pondérée), probabilités,
// théorème de Pythagore combiné à la trigonométrie, volume d'un cône, et
// pourcentages d'évolution — le tout dans l'esprit des exercices "type
// Brevet" qui combinent plusieurs notions du programme de 3e.
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Pas de thème Automatismes dédié pour ce chapitre de synthèse : il
// s'appuie sur les thèmes déjà présents dans automatismes-troisieme.js.
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

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

// ---------- 1. Programme de calcul numérique (2 étapes) ----------
function genProgrammeCalculNumeric() {
  const n = randInt(-10, 10);
  const a = nonZero(-8, 8);
  const b = nonZero(-6, 6);
  const etape1 = n + a;
  const answer = etape1 * b;
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Programmes de calcul",
    prompt: `Voici un programme de calcul : « Choisir un nombre. Ajouter ${a}. Multiplier le résultat par ${b}. » Applique ce programme au nombre ${n}.`,
    answer,
    steps: [
      { type: "calcul", text: `${n} + ${a} = ${etape1}` },
      { type: "resultat", text: `${etape1} \\times ${b} = ${answer}` },
    ],
  };
}

// ---------- 2. Programme de calcul littéral, développer et évaluer ----------
function genProgrammeLitteralNumeric() {
  const a = nonZero(-9, 9);
  const x = randInt(-8, 8);
  // Programme : choisir x, ajouter a, multiplier par x -> x(x+a) = x^2 + ax
  const answer = x * (x + a);
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Programmes de calcul",
    prompt: `Voici un programme de calcul : « Choisir un nombre x. Ajouter ${a}. Multiplier le résultat par x. » On peut montrer que ce programme donne toujours \\(x^2 ${a >= 0 ? "+" : "-"} ${Math.abs(a)}x\\). Calcule le résultat pour x = ${x}.`,
    answer,
    steps: [{ type: "calcul", text: `${x}^2 ${a >= 0 ? "+" : "-"} ${Math.abs(a)} \\times ${x} = ${x * x} ${a * x >= 0 ? "+" : "-"} ${Math.abs(a * x)} = ${answer}` }],
  };
}

// ---------- 3. Écriture scientifique valide ----------
function genEcritureScientifiqueQCM() {
  const coeff = roundTo(randInt(11, 99) / 10, 1);
  const exposant = nonZero(-8, 8);
  const bonneEcriture = `${fr(coeff)} \\times 10^{${exposant}}`;
  const mauvaiseCoeff = pick([roundTo(coeff * 10, 1), roundTo(coeff / 10, 2)]);
  const mauvaiseEcriture = `${fr(mauvaiseCoeff)} \\times 10^{${mauvaiseCoeff > coeff ? exposant - 1 : exposant + 1}}`;
  return {
    type: "qcm",
    chapter: "Préparation au Brevet — Nombres",
    prompt: `Un même nombre peut s'écrire \\(${bonneEcriture}\\) ou \\(${mauvaiseEcriture}\\). Laquelle de ces deux écritures est l'écriture scientifique correcte (coefficient compris entre 1 inclus et 10 exclu) ?`,
    answer: bonneEcriture,
    options: [bonneEcriture, mauvaiseEcriture],
    steps: [{ type: "regle", text: `L'écriture scientifique impose un coefficient a tel que \\(1 \\leqslant a < 10\\). Ici, ${fr(coeff)} convient, pas ${fr(mauvaiseCoeff)}.` }],
  };
}

// ---------- 4. Identité remarquable (a-b)(a+b) = a² - b² ----------
function genIdentiteRemarquableNumeric() {
  const a = randInt(3, 15);
  const b = randInt(1, a - 1);
  const answer = a * a - b * b;
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Calcul littéral",
    prompt: `On sait que \\((a-b)(a+b) = a^2 - b^2\\). Utilise cette égalité pour calculer \\(${a - b} \\times ${a + b}\\) (avec a = ${a} et b = ${b}).`,
    answer,
    steps: [{ type: "calcul", text: `${a}^2 - ${b}^2 = ${a * a} - ${b * b} = ${answer}` }],
  };
}

// ---------- 5. Aire composée et équation ----------
function genAireComposeeEquationNumeric() {
  const largeur = randInt(2, 5);
  const baseTriangle = randInt(2, 6);
  const hauteurTriangle = roundTo(randInt(10, 30) / 10, 1);
  const aireTriangle = roundTo((baseTriangle * hauteurTriangle) / 2, 2);
  const xSol = randInt(3, 15);
  const aireCible = roundTo(largeur * xSol + aireTriangle, 2);
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Équations",
    prompt: `Le sol d'un garage rectangulaire de largeur ${largeur} m et de longueur variable x (en m) est prolongé par un triangle rectangle de base ${baseTriangle} m et de hauteur ${fr(hauteurTriangle)} m. L'aire totale du sol est donnée par \\(${largeur}x + ${fr(aireTriangle)}\\) (en m²). Pour quelle valeur de x cette aire totale vaut-elle ${fr(aireCible)} m² ?`,
    answer: xSol,
    tolerance: 0.02,
    steps: [
      { type: "donnee", text: `${largeur}x + ${fr(aireTriangle)} = ${fr(aireCible)}` },
      { type: "calcul", text: `${largeur}x = ${fr(roundTo(aireCible - aireTriangle, 2))}` },
      { type: "resultat", text: `x = \\dfrac{${fr(roundTo(aireCible - aireTriangle, 2))}}{${largeur}} = ${xSol}` },
    ],
  };
}

// ---------- 6. Comparer deux tarifs (égalité) ----------
function genCompararTarifsEgaliteNumeric() {
  const a = randInt(6, 15);
  const c = randInt(2, a - 2);
  const xSol = randInt(3, 15);
  const b = (a - c) * xSol;
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Fonctions",
    prompt: `Un club propose deux tarifs pour x séances : le tarif A coûte ${a}x €, le tarif B coûte ${b} + ${c}x €. À partir de combien de séances (valeur entière) le tarif A devient-il plus cher que le tarif B (c'est-à-dire, pour quelle valeur de x les deux tarifs sont-ils égaux) ?`,
    answer: xSol,
    steps: [
      { type: "donnee", text: `${a}x = ${b} + ${c}x` },
      { type: "regle", text: `\\text{On regroupe les termes en x d'un côté en soustrayant } ${c}x \\text{ des deux côtés.}` },
      { type: "calcul", text: `${a - c}x = ${b}` },
      { type: "resultat", text: `x = \\dfrac{${b}}{${a - c}} = ${xSol}` },
    ],
  };
}

// ---------- 7. Comparer deux tarifs (nombre maximal avec un budget) ----------
function genCompararTarifsBudgetNumeric() {
  const a = randInt(4, 9);
  const b = randInt(10, 30);
  const c = randInt(1, a - 1);
  const budget = randInt(60, 150);
  const maxA = Math.floor(budget / a);
  const maxB = Math.floor((budget - b) / c);
  const meilleur = maxA >= maxB ? "A" : "B";
  const answer = Math.max(maxA, maxB);
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Fonctions",
    prompt: `Un tarif A coûte ${a} € par séance. Un tarif B coûte un forfait de ${b} € plus ${c} € par séance. Avec un budget de ${budget} €, quel est le nombre maximal de séances accessible (en choisissant le meilleur tarif) ?`,
    answer,
    steps: [
      { type: "calcul", text: `\\text{Tarif A : } \\lfloor ${budget} \\div ${a} \\rfloor = ${maxA}\\text{ séances}` },
      { type: "calcul", text: `\\text{Tarif B : } \\lfloor (${budget} - ${b}) \\div ${c} \\rfloor = ${maxB}\\text{ séances}` },
      { type: "resultat", text: `\\text{Le tarif } ${meilleur} \\text{ permet } ${answer} \\text{ séances.}` },
    ],
  };
}

// ---------- 8. Image et antécédent d'une fonction affine ----------
function genFonctionAffineImageAntecedentNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const askImage = Math.random() < 0.5;
  const x = randInt(-8, 8);
  const y = a * x + b;
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Fonctions",
    prompt: askImage
      ? `On considère la fonction affine f définie par \\(f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(f(${x})\\).`
      : `On considère la fonction affine f définie par \\(f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Détermine l'antécédent de ${y} par f (c'est-à-dire la valeur de x telle que \\(f(x) = ${y}\\)).`,
    answer: askImage ? y : x,
    steps: askImage
      ? [{ type: "calcul", text: `f(${x}) = ${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${y}` }]
      : [
          { type: "donnee", text: `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${y}` },
          { type: "calcul", text: `${a}x = ${y - b}` },
          { type: "resultat", text: `x = \\dfrac{${y - b}}{${a}} = ${x}` },
        ],
  };
}

// ---------- 9. Moyenne pondérée contextualisée ----------
function genMoyennePondereeBrevetNumeric() {
  const prenom = pick(prenoms);
  const notes = [randInt(8, 18), randInt(8, 18), randInt(8, 18)];
  const coeffs = [1, 2, 3];
  const shuffled = shuffle(coeffs);
  const sommeProduits = notes.reduce((s, n, i) => s + n * shuffled[i], 0);
  const totalCoeffs = shuffled.reduce((a, b) => a + b, 0);
  const answer = roundTo(sommeProduits / totalCoeffs, 2);
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Statistiques",
    prompt: `${prenom} a obtenu les notes suivantes, avec leurs coefficients : ${notes.map((n, i) => `${n} (coefficient ${shuffled[i]})`).join(", ")}. Calcule sa moyenne pondérée (arrondie au centième).`,
    answer,
    tolerance: 0.02,
    steps: [
      { type: "regle", text: `\\text{Pour une moyenne pondérée, on multiplie chaque note par son coefficient, on additionne ces produits, puis on divise par la somme des coefficients.}` },
      { type: "calcul", text: `\\dfrac{${notes.map((n, i) => `${n} \\times ${shuffled[i]}`).join(" + ")}}{${totalCoeffs}} = \\dfrac{${sommeProduits}}{${totalCoeffs}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 10. Probabilité simple contextualisée ----------
function genProbabiliteBrevetNumeric() {
  const total = randInt(20, 40);
  const favorables = randInt(3, total - 3);
  const answer = roundTo(favorables / total, 3);
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Probabilités",
    prompt: `Un sac contient ${total} jetons indiscernables au toucher, dont ${favorables} sont gagnants. On tire un jeton au hasard. Quelle est la probabilité de tirer un jeton gagnant (valeur décimale arrondie au millième) ?`,
    answer,
    tolerance: 0.002,
    steps: [{ type: "calcul", text: `P = \\dfrac{${favorables}}{${total}} \\approx ${fr(answer)}` }],
  };
}

// ---------- 11. Pythagore puis trigonométrie (problème à deux étapes) ----------
function genPythagoreTrigoBrevetNumeric() {
  const AB = randInt(6, 20);
  const AD = randInt(6, 20);
  const angleDeg = randInt(30, 60);
  const AC = roundTo(Math.sqrt(AB * AB + AD * AD), 2);
  const CD = roundTo(AC * Math.tan((angleDeg * Math.PI) / 180), 1);
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Géométrie",
    prompt: `ABC est un triangle rectangle en B, avec AB = ${AB} cm et BC = ${AD} cm. Les points B, C et D sont alignés, avec le triangle ACD rectangle en C. On donne \\(\\widehat{CAD} = ${angleDeg}°\\). Calcule d'abord AC (arrondie au centième), grâce au théorème de Pythagore, puis calcule CD (arrondie au dixième) à l'aide de la trigonométrie.`,
    answer: CD,
    tolerance: 0.15,
    steps: [
      { type: "calcul", text: `AC^2 = AB^2 + BC^2 = ${AB}^2 + ${AD}^2 = ${AB * AB + AD * AD}` },
      { type: "calcul", text: `AC = \\sqrt{${AB * AB + AD * AD}} \\approx ${fr(AC)}\\text{ cm}` },
      { type: "regle", text: `\\tan(${angleDeg}°) = \\dfrac{CD}{AC}` },
      { type: "resultat", text: `CD = ${fr(AC)} \\times \\tan(${angleDeg}°) \\approx ${fr(CD)}\\text{ cm}` },
    ],
  };
}

// ---------- 12. Volume d'un cône ----------
function genVolumeConeNumeric() {
  const R = randInt(2, 15);
  const h = randInt(3, 20);
  const answer = roundTo((1 / 3) * Math.PI * R * R * h, 1);
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Géométrie",
    prompt: `Calcule le volume d'un cône de révolution de rayon de base ${R} cm et de hauteur ${h} cm (valeur approchée au dixième, en cm³). Rappel : \\(V = \\dfrac{1}{3} \\times \\pi \\times R^2 \\times h\\).`,
    answer,
    tolerance: Math.max(0.5, answer * 0.01),
    steps: [{ type: "calcul", text: `V = \\dfrac{1}{3} \\times \\pi \\times ${R}^2 \\times ${h} \\approx ${fr(answer)}` }],
  };
}

// ---------- 13. Équation avec parenthèses ----------
function genEquationParenthesesNumeric() {
  const a = nonZero(-8, 8);
  const b = randInt(-10, 10);
  const xSol = randInt(-12, 12);
  const c = a * (xSol + b);
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Équations",
    prompt: `Résous l'équation : \\(${a}(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) = ${c}\\)`,
    answer: xSol,
    steps: [
      { type: "regle", text: `\\text{Pour isoler x, on annule d'abord ce qui a été fait en dernier : on divise les deux côtés par } ${a}, \\text{ puis on soustrait } ${Math.abs(b)}.` },
      { type: "calcul", text: `x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c} \\div ${a} = ${c / a}` },
      { type: "resultat", text: `x = ${c / a} ${b >= 0 ? "-" : "+"} ${Math.abs(b)} = ${xSol}` },
    ],
  };
}

// ---------- 14. Pourcentage d'évolution contextualisé ----------
function genPourcentageEvolutionBrevetNumeric() {
  const prixInitial = randInt(20, 200);
  const p = randInt(5, 40);
  const hausse = Math.random() < 0.5;
  const coefficient = hausse ? 1 + p / 100 : 1 - p / 100;
  const answer = roundTo(prixInitial * coefficient, 2);
  return {
    type: "numeric",
    chapter: "Préparation au Brevet — Pourcentages",
    prompt: `Un article coûte ${prixInitial} €. Son prix ${hausse ? "augmente" : "diminue"} de ${p} %. Calcule le nouveau prix (en €, arrondi au centime).`,
    answer,
    tolerance: 0.02,
    steps: [
      {
        type: "regle",
        text: hausse
          ? `\\text{Augmenter de } ${p}\\% \\text{ revient à multiplier par } 1 + \\dfrac{${p}}{100} = ${fr(roundTo(coefficient, 3))}.`
          : `\\text{Diminuer de } ${p}\\% \\text{ revient à multiplier par } 1 - \\dfrac{${p}}{100} = ${fr(roundTo(coefficient, 3))}.`,
      },
      { type: "calcul", text: `${prixInitial} \\times ${fr(roundTo(coefficient, 3))} = ${fr(answer)}` },
    ],
  };
}

// ---------- 15. Vrai ou faux avec justification par le calcul ----------
function genVraiFauxCalculQCM() {
  const a = randInt(3, 12);
  const b = randInt(3, 12);
  const propositionVraie = Math.random() < 0.5;
  const sommeCarres = a * a + b * b;
  const carreDeLaSomme = (a + b) * (a + b);
  const affirmation = propositionVraie
    ? `\\((${a} + ${b})^2 = ${a}^2 + 2 \\times ${a} \\times ${b} + ${b}^2\\)`
    : `\\((${a} + ${b})^2 = ${a}^2 + ${b}^2\\)`;
  return {
    type: "qcm",
    chapter: "Préparation au Brevet — Calcul littéral",
    prompt: `Un élève affirme que ${affirmation}. Cette affirmation est-elle vraie ?`,
    answer: propositionVraie ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Rappel : } (a+b)^2 = a^2 + 2ab + b^2 \\text{ (et non } a^2 + b^2\\text{, sauf cas particulier).}` },
      { type: "calcul", text: `\\text{Ici : } (${a}+${b})^2 = ${carreDeLaSomme}, \\text{ alors que } ${a}^2 + ${b}^2 = ${sommeCarres}.` },
      { type: "resultat", text: propositionVraie ? `L'affirmation utilise la bonne formule : elle est vraie.` : `L'affirmation omet le double produit \\(2ab\\) : elle est fausse.` },
    ],
  };
}

const GENERATORS = [
  genProgrammeCalculNumeric,
  genProgrammeLitteralNumeric,
  genEcritureScientifiqueQCM,
  genIdentiteRemarquableNumeric,
  genAireComposeeEquationNumeric,
  genCompararTarifsEgaliteNumeric,
  genCompararTarifsBudgetNumeric,
  genFonctionAffineImageAntecedentNumeric,
  genMoyennePondereeBrevetNumeric,
  genProbabiliteBrevetNumeric,
  genPythagoreTrigoBrevetNumeric,
  genVolumeConeNumeric,
  genEquationParenthesesNumeric,
  genPourcentageEvolutionBrevetNumeric,
  genVraiFauxCalculQCM,
];

const DIFFICULTY = {
  genEcritureScientifiqueQCM: "facile",
  genVolumeConeNumeric: "facile",
  genProgrammeCalculNumeric: "standard",
  genProgrammeLitteralNumeric: "standard",
  genIdentiteRemarquableNumeric: "standard",
  genCompararTarifsEgaliteNumeric: "standard",
  genFonctionAffineImageAntecedentNumeric: "standard",
  genMoyennePondereeBrevetNumeric: "standard",
  genProbabiliteBrevetNumeric: "standard",
  genEquationParenthesesNumeric: "standard",
  genVraiFauxCalculQCM: "standard",
  genAireComposeeEquationNumeric: "expert",
  genCompararTarifsBudgetNumeric: "expert",
  genPythagoreTrigoBrevetNumeric: "expert",
  genPourcentageEvolutionBrevetNumeric: "expert",
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
    id: "dossier-brevet-troisieme",
    title: "Préparation au Brevet",
    description: "Exercices de synthèse type Brevet : programmes de calcul, calcul littéral, équations, comparaison de tarifs, fonctions, statistiques, probabilités, géométrie (Pythagore, trigonométrie, volume d'un cône) et pourcentages.",
    pourquoi: "Ce dossier rassemble les grands types d'exercices du Brevet pour t'entraîner dans les conditions réelles de l'examen.",
    level: "troisieme",
    free: false,
    order: 16,
  },
  generate,
};
