// ---------------------------------------------------------------------------
// Chapitre : Automatismes (Première technologique)
// Reprend la liste officielle "Automatismes" du programme 2026 de Première
// technologique : évolutions/taux d'évolution, équation produit nul, signe
// d'une expression du 1er degré ou factorisée du 2nd degré, développer /
// factoriser / réduire, résoudre graphiquement f(x)=k, tracer une droite,
// lire l'équation réduite d'une droite, déterminer un coefficient directeur,
// lire un graphique / histogramme / diagramme, calculer des probabilités
// conditionnelles via un tableau croisé ou un arbre pondéré, distinguer
// P(A∩B) / P_A(B) / P_B(A). Découpé par thème (THEMES) pour laisser le choix
// à l'utilisateur, comme automatismes-premiere-spe.js.
//
// NOTE (audit programme 2026) :
// - M10 : genEvolutionReciproqueQCM calculait le même coefficient
//   multiplicateur que genCoefficientMultiplicateurQCM, sans jamais calculer
//   de taux réciproque (le taux qui compense une évolution pour revenir à la
//   valeur initiale). Corrigé.
// - M1 : ajout du thème "Vocabulaire et logique" (appartenance, inclusion,
//   équation/identité, contre-exemple, réciproque, condition nécessaire/
//   suffisante), absent malgré son statut de partie transversale officielle.
// - M3 : ajout du thème "Lecture de données" (diagramme en barres,
//   circulaire, en boîte, étendue, médiane), le thème lecture-graphique
//   existant ne couvrant que des droites malgré la promesse de l'en-tête.
// - M4/M5 : ajout au thème lecture-graphique d'une variante inéquation
//   (f(x) < k / f(x) > k) et d'une lecture graphique du signe.
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

// =========================== Évolutions et pourcentages ===========================

function genCoefficientMultiplicateurQCM() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 90);
  const answer = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  const wrong1 = roundTo(p / 100, 2);
  const wrong2 = direction === "augmente" ? roundTo(1 - p / 100, 2) : roundTo(1 + p / 100, 2);
  const options = shuffle([fr(answer), fr(wrong1), fr(wrong2)]);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Évolutions",
    prompt: `Une grandeur ${direction} de ${p} %. Le coefficient multiplicateur associé est :`,
    answer: fr(answer),
    options,
    steps: [`${fr(answer)}`],
  };
}

function genPourcentageEffectifQCM() {
  const total = pick([200, 400, 500, 800, 1000]);
  const p = pick([10, 15, 20, 25, 30]);
  const answer = (p / 100) * total;
  const options = shuffle([answer, p, total - answer, answer / 10].map(String));
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Évolutions",
    prompt: `Un groupe compte ${total} personnes. ${p} % d'entre elles ont une certaine caractéristique. Combien de personnes cela représente-t-il ?`,
    answer: String(answer),
    options,
    steps: [`${total} \\times \\dfrac{${p}}{100} = ${answer}`],
  };
}

function genEvolutionReciproqueQCM() {
  const p = randInt(5, 60);
  const augmente = Math.random() < 0.5;
  const coefInitial = augmente ? 1 + p / 100 : 1 - p / 100;
  const coefReciproque = roundTo(1 / coefInitial, 4);
  const tauxReciproque = roundTo((coefReciproque - 1) * 100, 2);
  const answer = fr(tauxReciproque);
  const naif = augmente ? -p : p;
  const options = shuffle([answer, fr(naif), fr(roundTo(-tauxReciproque, 2))]);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Évolutions",
    prompt: `Une grandeur ${augmente ? "augmente" : "diminue"} de ${p} %. Quel est le taux d'évolution (en %) qui permet de revenir exactement à la valeur initiale ?`,
    answer,
    options,
    steps: [
      `\\text{Coefficient multiplicateur initial : } ${fr(roundTo(coefInitial, 3))}.`,
      `\\text{Coefficient réciproque : } \\dfrac{1}{${fr(roundTo(coefInitial, 3))}} \\approx ${fr(coefReciproque)}, \\text{ soit un taux de } ${answer} \\ \\%.`,
      `\\text{Piège classique : les taux ne se compensent pas simplement, ce n'est pas } ${fr(naif)} \\ \\%.`,
    ],
  };
}

// =========================== Équations, signe, calcul littéral ===========================

function genEquationProduitNulQCM() {
  let r1 = randInt(-8, 8);
  let r2 = randInt(-8, 8);
  while (r2 === r1) r2 = randInt(-8, 8);
  const s1 = r1 >= 0 ? "-" : "+";
  const s2 = r2 >= 0 ? "-" : "+";
  const correctRaw = `${r1} \\text{ et } ${r2}`;
  const options = shuffle([correctRaw, `${r1} \\text{ et } ${-r2}`, `${-r1} \\text{ et } ${r2}`]);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Équations",
    prompt: `Quelles sont les solutions de \\((x ${s1} ${Math.abs(r1)})(x ${s2} ${Math.abs(r2)}) = 0\\) ?`,
    answer: correctRaw,
    options,
    steps: [`\\text{Un produit est nul si l'un des facteurs est nul : } x = ${r1} \\text{ ou } x = ${r2}.`],
  };
}

function genSigneExpressionPremierDegreQCM() {
  const a = nonZero(-6, 6);
  const b = randInt(-9, 9);
  const bound = fr(roundTo(-b / a, 3));
  const positifAvant = a < 0;
  const correctRaw = positifAvant ? `\\text{positive avant } ${bound} \\text{, négative après}` : `\\text{négative avant } ${bound} \\text{, positive après}`;
  const wrongRaw = positifAvant ? `\\text{négative avant } ${bound} \\text{, positive après}` : `\\text{positive avant } ${bound} \\text{, négative après}`;
  const options = shuffle([correctRaw, wrongRaw]);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Signe",
    prompt: `On étudie le signe de \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). L'expression s'annule en \\(x = ${bound}\\). Quel est son signe ?`,
    answer: correctRaw,
    options,
    steps: [`\\text{Une expression affine } ax+b \\text{ change de signe en changeant de côté de sa racine, selon le signe de } a = ${a}.`],
  };
}

function genSigneFactoriseSecondDegreQCM() {
  const a = pick([1, -1, 2, -2]);
  let r1 = randInt(-6, 6);
  let r2 = randInt(-6, 6);
  while (r2 === r1) r2 = randInt(-6, 6);
  const lo = Math.min(r1, r2);
  const hi = Math.max(r1, r2);
  const positifEntre = a < 0;
  const correctRaw = positifEntre ? `\\text{positive entre } ${lo} \\text{ et } ${hi} \\text{, négative à l'extérieur}` : `\\text{négative entre } ${lo} \\text{ et } ${hi} \\text{, positive à l'extérieur}`;
  const wrongRaw = positifEntre ? `\\text{négative entre } ${lo} \\text{ et } ${hi} \\text{, positive à l'extérieur}` : `\\text{positive entre } ${lo} \\text{ et } ${hi} \\text{, négative à l'extérieur}`;
  const options = shuffle([correctRaw, wrongRaw]);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Signe",
    prompt: `On donne \\(f(x) = ${a === 1 ? "" : a}(x - ${lo})(x - ${hi})\\), sous forme factorisée. Quel est le signe de \\(f\\) ?`,
    answer: correctRaw,
    options,
    steps: [`\\text{Un polynôme du second degré est du signe de son coefficient dominant } (${a}) \\text{ à l'extérieur des racines, et du signe opposé entre elles.}`],
  };
}

function genDevelopperReduireQCM() {
  const a = nonZero(-6, 6);
  const b = nonZero(-9, 9);
  const c = nonZero(-6, 6);
  // (ax + b) * cx = a c x^2 + b c x
  const correct = `${a * c}x^2 ${b * c >= 0 ? "+" : "-"} ${Math.abs(b * c)}x`;
  const wrong1 = `${a * c}x^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x`;
  const wrong2 = `${a}x^2 ${b * c >= 0 ? "+" : "-"} ${Math.abs(b * c)}x`;
  const options = shuffle([correct, wrong1, wrong2]);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Calcul littéral",
    prompt: `Développer et réduire : \\((${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) \\times ${c}x\\)`,
    answer: correct,
    options,
    steps: [`(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) \\times ${c}x = ${a * c}x^2 ${b * c >= 0 ? "+" : "-"} ${Math.abs(b * c)}x`],
  };
}

// =========================== Lecture graphique ===========================

function genResoudreGraphiquementQCM() {
  const a = pick([-2, -1, -0.5, 0.5, 1, 2]);
  const b = randInt(-3, 3);
  const k = randInt(-4, 4);
  const xSol = roundTo((k - b) / a, 2);
  const options = shuffle([fr(xSol), fr(xSol + nonZero(1, 3)), fr(roundTo(-xSol, 2))]);
  const xMin = Math.min(-6, xSol - 2);
  const xMax = Math.max(6, xSol + 2);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Lecture graphique",
    prompt: `On donne ci-dessous la représentation graphique d'une fonction affine f. Résous graphiquement \\(f(x) = ${k}\\).`,
    answer: fr(xSol),
    options,
    steps: [`\\text{On lit l'abscisse du point de la droite dont l'ordonnée vaut } ${k} : x = ${fr(xSol)}.`],
    graph: {
      xMin,
      xMax,
      yMin: Math.min(-8, a * xMin + b, k) - 1,
      yMax: Math.max(8, a * xMax + b, k) + 1,
      lines: [{ a, b, label: "f" }],
      points: [{ x: xSol, y: k, label: `(${fr(xSol)} ; ${k})`, project: true }],
    },
  };
}

function genLireEquationReduiteQCM() {
  const a = pick([-3, -2, -1, -0.5, 0.5, 1, 2, 3]);
  const b = randInt(-4, 4);
  const correctRaw = `y = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;
  const wrong1 = `y = ${-a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;
  const wrong2 = `y = ${a}x ${b >= 0 ? "-" : "+"} ${Math.abs(b)}`;
  const options = shuffle([correctRaw, wrong1, wrong2]);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Lecture graphique",
    prompt: `Quelle est l'équation réduite de la droite représentée ci-dessous ?`,
    answer: correctRaw,
    options,
    steps: [correctRaw],
    graph: { xMin: -5, xMax: 5, yMin: Math.min(-6, a * -5 + b - 1), yMax: Math.max(6, a * 5 + b + 1), lines: [{ a, b }] },
  };
}

function genCoefficientDirecteurDeuxPointsNumeric() {
  const xA = randInt(-6, 6);
  const xB = randInt(-6, 6) + nonZero(1, 5);
  const yA = randInt(-8, 8);
  const a = pick([-3, -2, -1, 1, 2, 3]);
  const yB = yA + a * (xB - xA);
  return {
    type: "numeric",
    chapter: "Automatismes (Première techno) — Lecture graphique",
    prompt: `Une droite passe par \\(A(${xA} ; ${yA})\\) et \\(B(${xB} ; ${yB})\\). Calcule son coefficient directeur.`,
    answer: a,
    steps: [`a = \\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{${yB} - (${yA})}{${xB} - (${xA})} = \\dfrac{${yB - yA}}{${xB - xA}} = ${a}`],
    graph: {
      xMin: Math.min(xA, xB) - 2,
      xMax: Math.max(xA, xB) + 2,
      yMin: Math.min(yA, yB) - 2,
      yMax: Math.max(yA, yB) + 2,
      lines: [{ a, b: yA - a * xA, label: "(AB)" }],
      points: [{ x: xA, y: yA, label: "A" }, { x: xB, y: yB, label: "B" }],
    },
  };
}

function genResoudreGraphiquementInequationQCM() {
  const a = pick([-2, -1, -0.5, 0.5, 1, 2]);
  const b = randInt(-3, 3);
  const k = randInt(-4, 4);
  const xSol = roundTo((k - b) / a, 2);
  const sens = pick([">", "<"]);
  const positifAvant = a > 0;
  const correctRaw = (sens === ">") === positifAvant ? `x > ${fr(xSol)}` : `x < ${fr(xSol)}`;
  const wrongRaw = (sens === ">") === positifAvant ? `x < ${fr(xSol)}` : `x > ${fr(xSol)}`;
  const options = shuffle([correctRaw, wrongRaw]);
  const xMin = Math.min(-6, xSol - 2);
  const xMax = Math.max(6, xSol + 2);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Lecture graphique",
    prompt: `On donne ci-dessous la représentation graphique d'une fonction affine f. Résous graphiquement \\(f(x) ${sens} ${k}\\).`,
    answer: correctRaw,
    options,
    steps: [`\\text{On lit les abscisses des points de la droite dont l'ordonnée est ${sens} ${k} : } ${correctRaw}.`],
    graph: {
      xMin,
      xMax,
      yMin: Math.min(-8, a * xMin + b, k) - 1,
      yMax: Math.max(8, a * xMax + b, k) + 1,
      lines: [{ a, b, label: "f" }],
      points: [{ x: xSol, y: k, label: `(${fr(xSol)} ; ${k})`, project: true }],
    },
  };
}

function genSigneGraphiqueQCM() {
  const a = nonZero(-3, 3);
  const b = randInt(-4, 4);
  const xZero = roundTo(-b / a, 2);
  const positifAvant = a < 0;
  const correctRaw = positifAvant ? `\\text{positive avant } ${fr(xZero)} \\text{, négative après}` : `\\text{négative avant } ${fr(xZero)} \\text{, positive après}`;
  const wrongRaw = positifAvant ? `\\text{négative avant } ${fr(xZero)} \\text{, positive après}` : `\\text{positive avant } ${fr(xZero)} \\text{, négative après}`;
  const options = shuffle([correctRaw, wrongRaw]);
  const xMin = Math.min(-6, xZero - 2);
  const xMax = Math.max(6, xZero + 2);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Lecture graphique",
    prompt: `On donne ci-dessous la représentation graphique d'une fonction affine f, qui s'annule en \\(x = ${fr(xZero)}\\). Quel est le signe de f, lu graphiquement ?`,
    answer: correctRaw,
    options,
    steps: [`\\text{La courbe est au-dessus de l'axe des abscisses là où f est positive, en dessous là où elle est négative.}`],
    graph: {
      xMin,
      xMax,
      yMin: Math.min(-8, a * xMin + b) - 1,
      yMax: Math.max(8, a * xMax + b) + 1,
      lines: [{ a, b, label: "f" }],
    },
  };
}

// =========================== Vocabulaire ensembliste et logique ===========================

function genAppartenanceEnsembleQCM() {
  const E = [2, 5, 7, 9, 12];
  const x = pick([...E, ...[1, 3, 4, 6, 8]]);
  const appartient = E.includes(x);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Vocabulaire et logique",
    prompt: `On donne l'ensemble \\(E = \\{${E.join(" ; ")}\\}\\). A-t-on \\(${x} \\in E\\) ?`,
    answer: appartient ? "Vrai" : "Faux",
    options: ["Vrai", "Faux"],
    steps: [appartient ? `${x} \\text{ figure dans } E \\text{ : l'appartenance est vraie.}` : `${x} \\text{ ne figure pas dans } E \\text{ : l'appartenance est fausse.}`],
  };
}

function genInclusionEnsembleQCM() {
  const E = [1, 2, 3, 4, 5, 6];
  const inclus = Math.random() < 0.5;
  const F = inclus ? shuffle(E).slice(0, randInt(2, 4)) : [...shuffle(E).slice(0, 2), pick([7, 8, 9])];
  const estInclus = F.every((x) => E.includes(x));
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Vocabulaire et logique",
    prompt: `\\(E = \\{${E.join(" ; ")}\\}\\), \\(F = \\{${F.join(" ; ")}\\}\\). A-t-on \\(F \\subset E\\) ?`,
    answer: estInclus ? "Vrai" : "Faux",
    options: ["Vrai", "Faux"],
    steps: [estInclus ? `\\text{Tous les éléments de F appartiennent à E : l'inclusion est vraie.}` : `\\text{Au moins un élément de F n'appartient pas à E : l'inclusion est fausse.}`],
  };
}

function genEquationOuIdentiteQCM() {
  const cas = pick([
    { description: "\\(2x + 3 = 7\\)", reponse: "une équation" },
    { description: "\\((x+1)^2 = x^2+2x+1\\)", reponse: "une identité" },
    { description: "\\(3x - 5 = 3x + 1\\)", reponse: "une équation" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Vocabulaire et logique",
    prompt: `${cas.description} est-elle une équation (vraie seulement pour certaines valeurs de x) ou une identité (vraie pour toutes les valeurs de x) ?`,
    answer: cas.reponse,
    options: ["une équation", "une identité"],
    steps: [cas.reponse],
  };
}

function genContreExempleQCM() {
  const cas = pick([
    { description: "Tout nombre entier est positif.", reponse: "\\(-3\\)", distracteur: "\\(4\\)" },
    { description: "Le carré d'un nombre est toujours supérieur au nombre.", reponse: "\\(0{,}5\\)", distracteur: "\\(3\\)" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Vocabulaire et logique",
    prompt: `Quelle valeur est un contre-exemple à l'affirmation : « ${cas.description} » ?`,
    answer: cas.reponse,
    options: [cas.reponse, cas.distracteur],
    steps: [`\\text{Un contre-exemple est une valeur qui rend l'affirmation fausse : } ${cas.reponse}.`],
  };
}

function genReciproqueQCM() {
  const description = "Si un nombre est un multiple de 4, alors il est pair.";
  const correct = "Si un nombre est pair, alors il est un multiple de 4.";
  const distracteur = "Si un nombre n'est pas un multiple de 4, alors il n'est pas pair.";
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Vocabulaire et logique",
    prompt: `Quelle est la réciproque de l'implication : « ${description} » ?`,
    answer: correct,
    options: [correct, distracteur],
    steps: [`\\text{La réciproque de "si P alors Q" est "si Q alors P".}`],
  };
}

function genConditionNecessaireSuffisanteQCM() {
  const cas = pick([
    { description: "Être un multiple de 6 est-il une condition nécessaire ou suffisante pour être un multiple de 3 ?", reponse: "suffisante" },
    { description: "Être un nombre pair est-il une condition nécessaire ou suffisante pour être un multiple de 4 ?", reponse: "nécessaire" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Vocabulaire et logique",
    prompt: cas.description,
    answer: cas.reponse,
    options: ["nécessaire", "suffisante"],
    steps: [cas.reponse],
  };
}

// =========================== Lecture de données ===========================

function genLireDiagrammeBarresQCM() {
  const categories = ["A", "B", "C", "D"];
  const effectifs = categories.map(() => randInt(5, 40));
  const maxIdx = effectifs.indexOf(Math.max(...effectifs));
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Lecture de données",
    prompt: `Un diagramme en barres donne les effectifs suivants : A = ${effectifs[0]}, B = ${effectifs[1]}, C = ${effectifs[2]}, D = ${effectifs[3]}. Quelle catégorie a le plus grand effectif ?`,
    answer: categories[maxIdx],
    options: categories,
    steps: [`\\text{La catégorie avec l'effectif le plus élevé est ${categories[maxIdx]} (${effectifs[maxIdx]}).}`],
  };
}

function genLireDiagrammeCirculaireNumeric() {
  const total = pick([200, 300, 400, 500]);
  const pourcentage = pick([10, 20, 25, 30, 40]);
  const answer = (pourcentage / 100) * total;
  return {
    type: "numeric",
    chapter: "Automatismes (Première techno) — Lecture de données",
    prompt: `Un diagramme circulaire représente une population de ${total} personnes. Un secteur occupe ${pourcentage} % du disque. Combien de personnes ce secteur représente-t-il ?`,
    answer,
    steps: [`${total} \\times \\dfrac{${pourcentage}}{100} = ${answer}`],
  };
}

function genLireDiagrammeBoiteQCM() {
  const min = randInt(0, 10);
  const q1 = randInt(11, 20);
  const med = randInt(21, 30);
  const q3 = randInt(31, 40);
  const max = randInt(41, 50);
  const valeurs = { min, q1, med, q3, max };
  const labels = { min: "minimum", q1: "premier quartile Q1", med: "médiane", q3: "troisième quartile Q3", max: "maximum" };
  const cible = pick(["min", "q1", "med", "q3", "max"]);
  const answer = valeurs[cible];
  const distracteurs = Object.entries(valeurs).filter(([k]) => k !== cible).map(([, v]) => v);
  const options = shuffle([answer, ...shuffle(distracteurs).slice(0, 2)]).map(String);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Lecture de données",
    prompt: `Un diagramme en boîte (boîte à moustaches) donne : minimum = ${min}, Q1 = ${q1}, médiane = ${med}, Q3 = ${q3}, maximum = ${max}. Quelle est la valeur du ${labels[cible]} ?`,
    answer: String(answer),
    options,
    steps: [`\\text{${labels[cible]} = ${answer}.}`],
  };
}

function genCalculerEtendueNumeric() {
  const serie = Array.from({ length: 8 }, () => randInt(1, 30)).sort((a, b) => a - b);
  const answer = serie[serie.length - 1] - serie[0];
  return {
    type: "numeric",
    chapter: "Automatismes (Première techno) — Lecture de données",
    prompt: `Série statistique : ${serie.join(" ; ")}. Calcule l'étendue de cette série.`,
    answer,
    steps: [`\\text{Étendue = valeur max} - \\text{valeur min} = ${serie[serie.length - 1]} - ${serie[0]} = ${answer}`],
  };
}

function genCalculerMedianeQCM() {
  const serie = Array.from({ length: 7 }, () => randInt(1, 30)).sort((a, b) => a - b);
  const answer = serie[3];
  const distracteurs = [serie[2], serie[4]];
  const options = shuffle([answer, ...distracteurs]).map(String);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Lecture de données",
    prompt: `Série statistique triée : ${serie.join(" ; ")}. Quelle est la médiane de cette série ?`,
    answer: String(answer),
    options,
    steps: [`\\text{La série est déjà triée et comporte 7 valeurs : la médiane est la 4e valeur, soit ${answer}.}`],
  };
}

// =========================== Probabilités conditionnelles (automatismes) ===========================

function genTableauCroiseProbaNumeric() {
  const total = pick([200, 250, 300, 400, 500]);
  const partA = randInt(30, 70);
  const effA = Math.round((partA / 100) * total);
  const partAB = randInt(10, Math.min(partA - 5, 60));
  const effAB = Math.round((partAB / 100) * total);
  const answer = roundTo(effAB / effA, 4);
  return {
    type: "numeric",
    chapter: "Automatismes (Première techno) — Probabilités conditionnelles",
    prompt: `Dans un tableau croisé de ${total} personnes, ${effA} appartiennent à la catégorie A, dont ${effAB} appartiennent aussi à la catégorie B. On choisit au hasard une personne de la catégorie A. Calcule la probabilité qu'elle appartienne aussi à B (valeur \\(P_A(B)\\), arrondie à 0,0001 près).`,
    answer,
    tolerance: 0.0005,
    steps: [`P_A(B) = \\dfrac{\\text{effectif de A et B}}{\\text{effectif de A}} = \\dfrac{${effAB}}{${effA}} = ${fr(answer)}`],
  };
}

function genDistinguerNotationsProbaQCM() {
  const cas = pick([
    { description: "La probabilité que A et B soient tous les deux réalisés.", reponse: "\\(P(A \\cap B)\\)" },
    { description: "La probabilité que B soit réalisé sachant que A est réalisé.", reponse: "\\(P_A(B)\\)" },
    { description: "La probabilité que A soit réalisé sachant que B est réalisé.", reponse: "\\(P_B(A)\\)" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes (Première techno) — Probabilités conditionnelles",
    prompt: `Quelle notation correspond à : « ${cas.description} » ?`,
    answer: cas.reponse,
    options: ["\\(P(A \\cap B)\\)", "\\(P_A(B)\\)", "\\(P_B(A)\\)"],
    steps: [cas.reponse],
  };
}

function genArbreProbabiliteBrancheNumeric() {
  const p1 = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
  const p2 = pick([0.1, 0.25, 0.4, 0.5, 0.6]);
  const answer = roundTo(p1 * p2, 4);
  return {
    type: "numeric",
    chapter: "Automatismes (Première techno) — Probabilités conditionnelles",
    prompt: `Dans un arbre pondéré, une première branche a pour probabilité \\(${fr(p1)}\\), suivie d'une branche de probabilité \\(${fr(p2)}\\). Calcule la probabilité du chemin complet (produit des probabilités le long du chemin).`,
    answer,
    tolerance: 0.0005,
    steps: [`${fr(p1)} \\times ${fr(p2)} = ${fr(answer)}`],
  };
}

// =========================== THEMES ===========================

const CH_EVOLUTIONS = [genCoefficientMultiplicateurQCM, genPourcentageEffectifQCM, genEvolutionReciproqueQCM];
const CH_EQUATIONS_SIGNE = [genEquationProduitNulQCM, genSigneExpressionPremierDegreQCM, genSigneFactoriseSecondDegreQCM, genDevelopperReduireQCM];
const CH_LECTURE_GRAPHIQUE = [
  genResoudreGraphiquementQCM,
  genLireEquationReduiteQCM,
  genCoefficientDirecteurDeuxPointsNumeric,
  genResoudreGraphiquementInequationQCM,
  genSigneGraphiqueQCM,
];
const CH_PROBABILITES = [genTableauCroiseProbaNumeric, genDistinguerNotationsProbaQCM, genArbreProbabiliteBrancheNumeric];
const CH_VOCABULAIRE_LOGIQUE = [
  genAppartenanceEnsembleQCM,
  genInclusionEnsembleQCM,
  genEquationOuIdentiteQCM,
  genContreExempleQCM,
  genReciproqueQCM,
  genConditionNecessaireSuffisanteQCM,
];
const CH_LECTURE_DONNEES = [
  genLireDiagrammeBarresQCM,
  genLireDiagrammeCirculaireNumeric,
  genLireDiagrammeBoiteQCM,
  genCalculerEtendueNumeric,
  genCalculerMedianeQCM,
];

const THEMES = [
  { id: "evolutions", title: "Évolutions et pourcentages", generators: CH_EVOLUTIONS },
  { id: "equations-signe", title: "Équations, signe, calcul littéral", generators: CH_EQUATIONS_SIGNE },
  { id: "lecture-graphique", title: "Lecture graphique", generators: CH_LECTURE_GRAPHIQUE },
  { id: "lecture-donnees", title: "Lecture de données", generators: CH_LECTURE_DONNEES },
  { id: "probabilites", title: "Probabilités conditionnelles", generators: CH_PROBABILITES },
  { id: "vocabulaire-logique", title: "Vocabulaire et logique", generators: CH_VOCABULAIRE_LOGIQUE },
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
    id: "automatismes-premiere-techno",
    title: "Automatismes",
    description: "Calcul rapide et automatismes du programme de Première technologique : évolutions, équations, signe, lecture graphique, lecture de données, probabilités conditionnelles, vocabulaire et logique.",
    pourquoi: "Les automatismes, c'est le calcul mental qui libère de la place dans ta tête pour réfléchir au problème plutôt qu'à l'arithmétique : quelques minutes régulières valent mieux qu'une révision unique la veille du contrôle.",
    level: "premiere-techno",
    freemiumDaily: 5,
    order: 1,
    isAutomatismes: true,
  },
  themes: THEMES.map(({ id, title }) => ({ id, title })),
  generate,
};
