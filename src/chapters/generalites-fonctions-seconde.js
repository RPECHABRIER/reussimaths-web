// ---------------------------------------------------------------------------
// Chapitre : Généralités sur les fonctions (2nde) — sous abonnement.
//
// Correspond au chapitre 1 du manuel de 2nde : vocabulaire des fonctions
// (image, antécédent, courbe représentative) et ses différentes formulations
// équivalentes (f(a) = b ⟺ « a a pour image b » ⟺ « A(a ; b) est un point de
// la courbe » ⟺ « a est une solution de f(x) = b » ⟺ « a est un antécédent
// de b »), calcul d'image et d'antécédent à partir d'une formule ou d'un
// tableau de valeurs, nombre d'antécédents d'un nombre, ensemble de
// définition (exclusion d'un dénominateur nul ou d'une racine carrée
// négative), tableau de signes d'un produit/quotient, appartenance d'un
// point à une courbe, modes de représentation d'une fonction, et résolution
// d'une équation par factorisation.
//
// NOTE (audit programme 2026, BO n°14 du 2 avril 2026) : les fonctions
// paires/impaires disparaissent du programme de 2nde (retirées ci-dessous).
// Ajout du tableau de signes pour une fonction produit ou quotient, et de la
// résolution d'équation/inéquation associée — nouveauté explicite du
// programme cible (« Tableau de signes pour une fonction produit ou
// quotient » ; « Résoudre une équation ou une inéquation de la forme
// f(x)=0, f(x)>0 à l'aide d'un tableau de signes, lorsque f est un produit
// ou un quotient »).
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-seconde.js (thème "generalites-fonctions-seconde") pour
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

const lettresFonctions = ["f", "g", "h", "p", "q"];

// =========================== Image, antécédent, vocabulaire ===========================

// ---------- 1. Calculer une image (fonction affine) ----------
function genImageFormuleAffineNumeric() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Généralités sur les fonctions — Image et antécédent",
    prompt: `On considère la fonction ${nom} définie par \\(${nom}(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(${nom}(${x})\\).`,
    answer,
    steps: [{ type: "calcul", text: `${nom}(${x}) = ${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}` }],
  };
}

// ---------- 2. Calculer une image (fonction du second degré simple) ----------
function genImageFormuleQuadratiqueNumeric() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-4, 4);
  const b = randInt(-10, 10);
  const x = randInt(-6, 6);
  const answer = a * x * x + b;
  return {
    type: "numeric",
    chapter: "Généralités sur les fonctions — Image et antécédent",
    prompt: `On considère la fonction ${nom} définie par \\(${nom}(x) = ${a}x^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(${nom}(${x})\\).`,
    answer,
    steps: [{ type: "calcul", text: `${nom}(${x}) = ${a} \\times ${x}^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${a} \\times ${x * x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}` }],
  };
}

// ---------- 3. Calculer un antécédent (fonction affine) ----------
function genAntecedentFormuleAffineNumeric() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const xSol = randInt(-10, 10);
  const k = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Généralités sur les fonctions — Image et antécédent",
    prompt: `On considère la fonction ${nom} définie par \\(${nom}(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Détermine l'antécédent de ${k} par ${nom} (c'est-à-dire résous \\(${nom}(x) = ${k}\\)).`,
    answer: xSol,
    steps: [
      { type: "donnee", text: `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${k}` },
      { type: "calcul", text: `${a}x = ${k - b}` },
      { type: "resultat", text: `x = \\dfrac{${k - b}}{${a}} = ${xSol}` },
    ],
  };
}

// ---------- 4. Convertir une formulation (image) ----------
function genVocabulaireImageQCM() {
  const nom = pick(lettresFonctions);
  const a = randInt(-8, 8);
  let b = randInt(-8, 8);
  while (b === a) b = randInt(-8, 8);
  const bonneReponse = `${a} a pour image ${b} par la fonction ${nom}`;
  const mauvaise1 = `${b} a pour image ${a} par la fonction ${nom}`;
  const mauvaise2 = `${a} est un antécédent de ${b - 1} par la fonction ${nom}`;
  return {
    type: "qcm",
    chapter: "Généralités sur les fonctions — Image et antécédent",
    prompt: `On sait que \\(${nom}(${a}) = ${b}\\). Laquelle de ces phrases traduit correctement cette égalité ?`,
    answer: bonneReponse,
    options: shuffle([bonneReponse, mauvaise1, mauvaise2]),
    steps: [{ type: "regle", text: `${nom}(${a}) = ${b} \\text{ signifie que « } ${bonneReponse} \\text{ ».}` }],
  };
}

// ---------- 5. Convertir une formulation (antécédent / point de la courbe) ----------
function genVocabulaireAntecedentQCM() {
  const nom = pick(lettresFonctions);
  const a = randInt(-8, 8);
  let b = randInt(-8, 8);
  while (b === a) b = randInt(-8, 8);
  const bonneReponse = `${a} est un antécédent de ${b} par la fonction ${nom}`;
  const mauvaise1 = `${b} est un antécédent de ${a} par la fonction ${nom}`;
  const mauvaise2 = `Le point de coordonnées (${b} ; ${a}) appartient à la courbe de ${nom}`;
  return {
    type: "qcm",
    chapter: "Généralités sur les fonctions — Image et antécédent",
    prompt: `Le point de coordonnées (${a} ; ${b}) appartient à la courbe représentative de la fonction ${nom}. Laquelle de ces phrases est équivalente à cette information ?`,
    answer: bonneReponse,
    options: shuffle([bonneReponse, mauvaise1, mauvaise2]),
    steps: [{ type: "regle", text: `\\text{Le point (}${a}\\text{ ; }${b}\\text{) sur la courbe signifie que } ${nom}(${a}) = ${b}\\text{, donc « } ${bonneReponse} \\text{ ».}` }],
  };
}

// =========================== Lecture d'un tableau de valeurs ===========================

// ---------- 6. Lire une image dans un tableau de valeurs ----------
function genLectureTableauImageNumeric() {
  const nom = pick(lettresFonctions);
  const xs = [-2, -1, 0, 1, 2];
  const ys = xs.map(() => randInt(-6, 6));
  const idx = randInt(0, xs.length - 1);
  return {
    type: "numeric",
    chapter: "Généralités sur les fonctions — Lecture d'un tableau",
    prompt: `Voici un tableau de valeurs de la fonction ${nom} : ${xs.map((x, i) => `${nom}(${x}) = ${ys[i]}`).join(", ")}. Quelle est l'image de ${xs[idx]} par ${nom} ?`,
    answer: ys[idx],
    steps: [{ type: "donnee", text: `${nom}(${xs[idx]}) = ${ys[idx]}` }],
  };
}

// ---------- 7. Compter le nombre d'antécédents d'un nombre depuis un tableau ----------
function genNombreAntecedentsTableauQCM() {
  const nom = pick(lettresFonctions);
  const xs = [-2, -1, 0, 1, 2];
  const valeurRepetee = randInt(-5, 5);
  const nbRepetitions = pick([1, 2]);
  const indicesRepetition = shuffle([0, 1, 2, 3, 4]).slice(0, nbRepetitions);
  const ys = xs.map((_, i) => (indicesRepetition.includes(i) ? valeurRepetee : nonZero(-8, 8) === valeurRepetee ? valeurRepetee + 1 : randInt(-8, 8)));
  // Sécurité : s'assurer qu'aucune autre valeur ne coïncide accidentellement avec valeurRepetee.
  for (let i = 0; i < ys.length; i++) {
    if (!indicesRepetition.includes(i) && ys[i] === valeurRepetee) ys[i] = valeurRepetee + 1;
  }
  const nombreAntecedents = ys.filter((y) => y === valeurRepetee).length;
  return {
    type: "qcm",
    chapter: "Généralités sur les fonctions — Lecture d'un tableau",
    prompt: `Voici un tableau de valeurs de la fonction ${nom} : ${xs.map((x, i) => `${nom}(${x}) = ${ys[i]}`).join(", ")}. Combien le nombre ${valeurRepetee} a-t-il d'antécédents par ${nom} (parmi les valeurs du tableau) ?`,
    answer: String(nombreAntecedents),
    options: ["0", "1", "2", "3"],
    steps: [
      { type: "regle", text: `\\text{Le nombre d'antécédents de } ${valeurRepetee}, \\text{ c'est le nombre de fois où } ${valeurRepetee} \\text{ apparaît comme image dans le tableau.}` },
      { type: "resultat", text: `${nombreAntecedents} \\text{ occurrence(s).}` },
    ],
  };
}

// =========================== Ensemble de définition ===========================

// ---------- 8. Ensemble de définition (dénominateur non nul) ----------
function genEnsembleDefinitionFractionQCM() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-9, 9);
  const valeurExclue = randInt(-8, 8);
  // f(x) = 1 / (x - valeurExclue)
  const testeValeurExclue = Math.random() < 0.5;
  const xTest = testeValeurExclue ? valeurExclue : randInt(-10, 10) === valeurExclue ? valeurExclue + 1 : randInt(-10, 10);
  const definie = xTest !== valeurExclue;
  return {
    type: "qcm",
    chapter: "Généralités sur les fonctions — Ensemble de définition",
    prompt: `On considère la fonction ${nom} définie par \\(${nom}(x) = \\dfrac{1}{x - ${valeurExclue}}\\). Le nombre ${xTest} appartient-il à l'ensemble de définition de ${nom} ?`,
    answer: definie ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Rappel : un dénominateur ne peut pas être nul, donc } x \\neq ${valeurExclue}.` },
      {
        type: "resultat",
        text: definie
          ? `${xTest} \\neq ${valeurExclue} : ${xTest} \\text{ appartient bien à l'ensemble de définition.}`
          : `${xTest} = ${valeurExclue} : \\text{ le dénominateur serait nul, donc } ${xTest} \\text{ n'appartient pas à l'ensemble de définition.}`,
      },
    ],
  };
}

// ---------- 9. Ensemble de définition (racine carrée) ----------
function genEnsembleDefinitionRacineQCM() {
  const nom = pick(lettresFonctions);
  const seuil = randInt(-8, 8);
  // f(x) = sqrt(x - seuil), défini pour x >= seuil
  const xTest = randInt(seuil - 8, seuil + 8);
  const definie = xTest >= seuil;
  return {
    type: "qcm",
    chapter: "Généralités sur les fonctions — Ensemble de définition",
    prompt: `On considère la fonction ${nom} définie par \\(${nom}(x) = \\sqrt{x - ${seuil}}\\). Le nombre ${xTest} appartient-il à l'ensemble de définition de ${nom} ?`,
    answer: definie ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Rappel : on ne peut pas calculer la racine carrée d'un nombre négatif, donc il faut } x - ${seuil} \\geqslant 0, \\text{ c'est-à-dire } x \\geqslant ${seuil}.` },
      {
        type: "resultat",
        text: definie ? `${xTest} \\geqslant ${seuil} : ${xTest} \\text{ appartient bien à l'ensemble de définition.}` : `${xTest} < ${seuil} : ${xTest} \\text{ n'appartient pas à l'ensemble de définition.}`,
      },
    ],
  };
}

// =========================== Tableau de signes (produit / quotient) ===========================
// NOTE (audit programme 2026) : nouveauté du programme cible — remplace les
// anciens générateurs sur la parité (fonctions paires/impaires), retirée du
// programme de 2nde 2026.

// ---------- 10. Signe d'un produit de deux facteurs affines ----------
function genSigneProduitDeuxFacteursQCM() {
  let r1 = randInt(-8, 8);
  let r2 = randInt(-8, 8);
  while (r2 === r1) r2 = randInt(-8, 8);
  const [rmin, rmax] = r1 < r2 ? [r1, r2] : [r2, r1];
  const zone = pick(["gauche", "milieu", "droite"]);
  const signe = zone === "milieu" ? "négatif" : "positif";
  const intervalTex = zone === "gauche" ? `]-\\infty ; ${rmin}[` : zone === "milieu" ? `]${rmin} ; ${rmax}[` : `]${rmax} ; +\\infty[`;
  return {
    type: "qcm",
    chapter: "Généralités sur les fonctions — Tableau de signes",
    prompt: `On considère \\(f(x) = (x - ${rmin})(x - ${rmax})\\). Quel est le signe de \\(f(x)\\) sur \\(${intervalTex}\\) ?`,
    answer: signe,
    options: ["positif", "négatif"],
    steps: [
      { type: "regle", text: `\\text{Un produit de deux facteurs est positif si les deux facteurs sont de même signe, négatif sinon. Les facteurs s'annulent en } ${rmin} \\text{ et } ${rmax}.` },
      {
        type: "resultat",
        text:
          zone === "milieu"
            ? `\\text{Entre les deux racines, les facteurs sont de signes opposés : } f(x) < 0.`
            : `\\text{À l'extérieur des deux racines, les facteurs sont de même signe : } f(x) > 0.`,
      },
    ],
  };
}

// ---------- 11. Résoudre une inéquation produit via tableau de signes ----------
function genResoudreInequationProduitQCM() {
  let r1 = randInt(-8, 8);
  let r2 = randInt(-8, 8);
  while (r2 === r1) r2 = randInt(-8, 8);
  const [rmin, rmax] = r1 < r2 ? [r1, r2] : [r2, r1];
  const strictPositif = Math.random() < 0.5;
  const bonneReponse = strictPositif ? `]-\\infty ; ${rmin}[ \\cup ]${rmax} ; +\\infty[` : `]${rmin} ; ${rmax}[`;
  const mauvaise = strictPositif ? `]${rmin} ; ${rmax}[` : `]-\\infty ; ${rmin}[ \\cup ]${rmax} ; +\\infty[`;
  return {
    type: "qcm",
    chapter: "Généralités sur les fonctions — Tableau de signes",
    prompt: `Résous l'inéquation \\((x - ${rmin})(x - ${rmax}) ${strictPositif ? ">" : "<"} 0\\).`,
    answer: bonneReponse,
    options: [bonneReponse, mauvaise],
    steps: [
      { type: "regle", text: `\\text{Un produit de deux facteurs affines change de signe en chacune de ses racines : entre les racines il est du signe opposé à celui pris à l'extérieur.}` },
      { type: "resultat", text: `\\text{Les solutions sont : } ${bonneReponse}` },
    ],
  };
}

// ---------- 12. Résoudre une équation quotient (attention au domaine) ----------
function genResoudreEquationQuotientNumeric() {
  const e = randInt(-8, 8);
  let xSol = randInt(-8, 8);
  while (xSol === e) xSol = randInt(-8, 8);
  const k = pick([-3, -2, 2, 3]);
  const r = xSol * (1 - k) + k * e;
  return {
    type: "numeric",
    chapter: "Généralités sur les fonctions — Tableau de signes",
    prompt: `Résous l'équation \\(\\dfrac{x - ${r >= 0 ? r : `(${r})`}}{x - ${e}} = ${k}\\) (avec \\(x \\neq ${e}\\)).`,
    answer: xSol,
    steps: [
      { type: "regle", text: `\\text{On multiplie les deux membres par } (x - ${e}) \\text{, qui est non nul puisque } x \\neq ${e}.` },
      { type: "calcul", text: `x - ${r} = ${k}(x - ${e})` },
      { type: "resultat", text: `x = ${xSol}` },
    ],
  };
}

// =========================== Courbe et modes de représentation ===========================

// ---------- 12. Un point appartient-il à la courbe ? ----------
function genPointAppartientCourbeQCM() {
  const nom = pick(lettresFonctions);
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  const vraiY = a * x + b;
  const appartient = Math.random() < 0.5;
  const yPropose = appartient ? vraiY : vraiY + nonZero(1, 4);
  return {
    type: "qcm",
    chapter: "Généralités sur les fonctions — Courbe représentative",
    prompt: `On considère la fonction ${nom} définie par \\(${nom}(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Le point de coordonnées (${x} ; ${yPropose}) appartient-il à la courbe représentative de ${nom} ?`,
    answer: appartient ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `${nom}(${x}) = ${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${vraiY}` },
      { type: "resultat", text: appartient ? `${vraiY} = ${yPropose} : \\text{ le point appartient bien à la courbe.}` : `${vraiY} \\neq ${yPropose} : \\text{ le point n'appartient pas à la courbe.}` },
    ],
  };
}

// ---------- 13. Mode de représentation d'une fonction ----------
function genModeRepresentationQCM() {
  const cas = pick([
    { description: "Une liste de couples (valeur de départ ; valeur d'arrivée), présentée en deux lignes.", reponse: "Tableau de valeurs" },
    { description: "Une égalité du type f(x) = 2x + 3, valable pour tout x de l'ensemble de définition.", reponse: "Expression algébrique" },
    { description: "Une ligne tracée dans un repère, reliant les points (x ; f(x)).", reponse: "Représentation graphique" },
    { description: "Une suite d'instructions à suivre dans l'ordre (choisir un nombre, lui appliquer des opérations successives).", reponse: "Programme de calcul" },
  ]);
  const options = shuffle(["Tableau de valeurs", "Expression algébrique", "Représentation graphique", "Programme de calcul"]);
  return {
    type: "qcm",
    chapter: "Généralités sur les fonctions — Modes de représentation",
    prompt: `Quel mode de représentation d'une fonction correspond à la description suivante : « ${cas.description} » ?`,
    answer: cas.reponse,
    options,
    steps: [{ type: "resultat", text: `Il s'agit d'un(e) ${cas.reponse.toLowerCase()}.` }],
  };
}

// ---------- 14. Résoudre une équation par factorisation (x³ - ax = 0) ----------
function genResoudreFactorisationCubiqueQCM() {
  const a = pick([1, 2, 3, 4, 5]);
  const racineExiste = a > 0;
  const nbSolutions = racineExiste ? 3 : 1;
  return {
    type: "qcm",
    chapter: "Généralités sur les fonctions — Résolution d'équations",
    prompt: `On veut résoudre l'équation \\(x^3 - ${a}x = 0\\). En factorisant par x, on obtient \\(x(x^2 - ${a}) = 0\\). Combien cette équation a-t-elle de solutions ?`,
    answer: String(nbSolutions),
    options: ["1", "2", "3"],
    steps: [
      { type: "regle", text: `\\text{Un produit de facteurs est nul si (et seulement si) l'un au moins des facteurs est nul.}` },
      { type: "calcul", text: `x(x^2 - ${a}) = 0 \\iff x = 0 \\text{ ou } x^2 = ${a}` },
      { type: "calcul", text: `x^2 = ${a} \\iff x = \\sqrt{${a}} \\text{ ou } x = -\\sqrt{${a}}` },
      { type: "resultat", text: `\\text{Il y a donc } ${nbSolutions} \\text{ solutions : } 0, \\sqrt{${a}} \\text{ et } -\\sqrt{${a}}.` },
    ],
  };
}

// ---------- 15. Résoudre f(x) = g(x) via un tableau croisé ----------
function genResoudreFEgalGTableauNumeric() {
  const nomF = "f";
  const nomG = "g";
  const xs = [-2, -1, 0, 1, 2];
  const idxEgal = randInt(0, xs.length - 1);
  const valeurCommune = randInt(-6, 6);
  const ysF = xs.map((_, i) => (i === idxEgal ? valeurCommune : randInt(-8, 8)));
  const ysG = xs.map((_, i) => (i === idxEgal ? valeurCommune : randInt(-8, 8)));
  // Sécurité : éviter une coïncidence accidentelle à un autre indice.
  for (let i = 0; i < xs.length; i++) {
    if (i !== idxEgal && ysF[i] === ysG[i]) ysG[i] = ysG[i] + 1;
  }
  return {
    type: "numeric",
    chapter: "Généralités sur les fonctions — Résolution d'équations",
    prompt: `Voici deux tableaux de valeurs : ${nomF} : ${xs.map((x, i) => `${nomF}(${x}) = ${ysF[i]}`).join(", ")}. ${nomG} : ${xs.map((x, i) => `${nomG}(${x}) = ${ysG[i]}`).join(", ")}. Détermine la solution de l'équation \\(${nomF}(x) = ${nomG}(x)\\) (parmi les valeurs du tableau).`,
    answer: xs[idxEgal],
    steps: [
      { type: "regle", text: `\\text{On cherche la valeur de x pour laquelle les deux tableaux donnent la même image.}` },
      { type: "resultat", text: `x = ${xs[idxEgal]}, \\text{ où les deux fonctions valent } ${valeurCommune}.` },
    ],
  };
}

const GENERATORS = [
  genImageFormuleAffineNumeric,
  genImageFormuleQuadratiqueNumeric,
  genAntecedentFormuleAffineNumeric,
  genVocabulaireImageQCM,
  genVocabulaireAntecedentQCM,
  genLectureTableauImageNumeric,
  genNombreAntecedentsTableauQCM,
  genEnsembleDefinitionFractionQCM,
  genEnsembleDefinitionRacineQCM,
  genSigneProduitDeuxFacteursQCM,
  genResoudreInequationProduitQCM,
  genResoudreEquationQuotientNumeric,
  genPointAppartientCourbeQCM,
  genModeRepresentationQCM,
  genResoudreFactorisationCubiqueQCM,
  genResoudreFEgalGTableauNumeric,
];

const DIFFICULTY = {
  genImageFormuleAffineNumeric: "facile",
  genVocabulaireImageQCM: "facile",
  genVocabulaireAntecedentQCM: "facile",
  genLectureTableauImageNumeric: "facile",
  genModeRepresentationQCM: "facile",
  genImageFormuleQuadratiqueNumeric: "standard",
  genAntecedentFormuleAffineNumeric: "standard",
  genNombreAntecedentsTableauQCM: "standard",
  genEnsembleDefinitionFractionQCM: "standard",
  genEnsembleDefinitionRacineQCM: "standard",
  genSigneProduitDeuxFacteursQCM: "standard",
  genResoudreInequationProduitQCM: "standard",
  genPointAppartientCourbeQCM: "standard",
  genResoudreEquationQuotientNumeric: "expert",
  genResoudreFactorisationCubiqueQCM: "expert",
  genResoudreFEgalGTableauNumeric: "expert",
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
    id: "generalites-fonctions-seconde",
    title: "Généralités sur les fonctions",
    description: "Vocabulaire (image, antécédent, courbe), calcul d'image et d'antécédent, lecture de tableaux de valeurs, ensemble de définition, tableau de signes d'un produit/quotient et résolution d'équations par factorisation.",
    pourquoi: "Lire une courbe ou un tableau de valeurs, c'est la compétence de base pour interpréter n'importe quel graphique scientifique ou économique.",
    level: "seconde",
    free: false,
    order: 3,
  },
  generate,
};
