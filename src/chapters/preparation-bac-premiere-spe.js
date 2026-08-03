// ---------------------------------------------------------------------------
// Chapitre : Préparation au Bac — EAM (Première Spé)
// Ce fichier ne contient QUE du contenu (générateurs d'exercices + métadonnées).
// L'affichage (mode Classique/Jeu, pavé numérique, QCM, aide progressive) est
// géré par le composant générique <ChapterRunner /> pour tous les chapitres.
//
// Génère des exercices dans l'esprit de la partie « Automatismes - QCM » et
// des exercices de la deuxième partie de l'Épreuve Anticipée de Mathématiques
// (EAM, session 2026 — Métropole, Amérique du Nord, Centres Étrangers, etc.),
// avec des valeurs numériques, noms et contextes changés à chaque tirage.
//
// Convention LaTeX : tout passage mathématique est entouré de \( ... \)
// (rendu ensuite en jolie notation par le composant <MathText />, voir
// src/components/MathText.jsx). Le reste du texte reste du français normal.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr() pour utiliser la virgule française — voir fr() ci-dessous.
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
const signedL = (n, withVar = "") => (n >= 0 ? `+ ${n}${withVar}` : `- ${Math.abs(n)}${withVar}`);

// =========================== Générateurs paramétrés ===========================

// ---------- 1. Développement d'une identité remarquable (style Automatismes QCM) ----------
function genDeveloppementIdentiteQCM() {
  const a = pick([2, 3, 4, 5]);
  const b = nonZero(-9, 9);
  const correctRaw = `${a * a}x^2 ${signedL(2 * a * b, "x")} + ${b * b}`;
  const wrong1 = `${a}x^2 + ${b * b}`;
  const wrong2 = `${a * a}x^2 + ${b * b}`;
  const wrong3 = `${2 * a}x ${signedL(b)}`;
  const options = shuffle([correctRaw, wrong1, wrong2, wrong3]);
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Automatismes",
    prompt: `La forme développée et réduite de \\((${a}x ${signedL(b)})^2\\) est :`,
    answer: correctRaw,
    options,
    steps: [`(A+B)^2 = A^2 + 2AB + B^2`, `\\text{Ici : } ${correctRaw}`],
  };
}

// ---------- 2. Lecture graphique d'une fonction affine ----------
function genLectureGraphiqueAffineQCM() {
  const a = nonZero(-8, 8);
  const b = nonZero(-10, 10); // évite b = 0, qui ferait coïncider wrong2 avec correctRaw (signedL(0) === signedL(-0))
  const correctRaw = `f(x) = ${a}x ${signedL(b)}`;
  const wrong1 = `f(x) = ${-a}x ${signedL(b)}`;
  const wrong2 = `f(x) = ${a}x ${signedL(-b)}`;
  const options = shuffle([correctRaw, wrong1, wrong2]);
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Automatismes",
    prompt: `Une fonction affine \\(f\\) est représentée par une droite passant par le point \\((0 ; ${b})\\), avec un coefficient directeur égal à ${a}. Quelle est l'expression algébrique de \\(f\\) ?`,
    answer: correctRaw,
    options,
    steps: [`\\text{L'ordonnée à l'origine est } ${b}, \\text{ le coefficient directeur est } ${a}.`, correctRaw],
  };
}

// ---------- 3. Proportion complémentaire (effectif total) ----------
function genProportionComplementaireQCM() {
  const pMajoritaire = pick([60, 65, 70, 75, 80]);
  const pMinoritaire = 100 - pMajoritaire;
  const k = pick([2, 3, 4]);
  // pMinoritaire est toujours un multiple de 5 (100 - pMajoritaire, avec pMajoritaire multiple de 5),
  // donc effMin = (pMinoritaire/5) * k garantit un total entier exact.
  const effMin = (pMinoritaire / 5) * k;
  const total = Math.round((effMin * 100) / pMinoritaire);
  const optionA = total - randInt(4, 8);
  const optionC = total + randInt(2, 6);
  const optionD = total + randInt(8, 14);
  const options = shuffle([...new Set([total, optionA, optionC, optionD])].map(String));
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Automatismes",
    prompt: `Dans une promotion d'apprentis, ${pMajoritaire} % étudient la mécanique. Les autres étudient l'électricité : ils sont ${effMin}. Le nombre d'apprentis de cette promotion est égal à :`,
    answer: String(total),
    options,
    steps: [`\\text{Les } ${pMinoritaire}\\% \\text{ restants représentent } ${effMin} \\text{ apprentis.}`, `\\text{Total} = \\dfrac{${effMin} \\times 100}{${pMinoritaire}} = ${total}`],
  };
}

// ---------- 4. Coefficient multiplicateur (augmentation ou baisse) ----------
function genCoefficientMultiplicateurQCM() {
  const hausse = Math.random() < 0.5;
  const p = randInt(5, 40);
  const coefRaw = hausse ? roundTo(1 + p / 100, 3) : roundTo(1 - p / 100, 3);
  const reponse = hausse ? `Le prix a augmenté de ${p} %` : `Le prix a baissé de ${p} %`;
  const autre1 = hausse ? `Le prix a baissé de ${p} %` : `Le prix a augmenté de ${p} %`;
  const autre2 = `Le prix a augmenté de ${fr(roundTo(coefRaw * 100, 1))} %`;
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Automatismes",
    prompt: `Le prix d'un article est multiplié par \\(${fr(coefRaw)}\\). Cela signifie que :`,
    answer: reponse,
    options: [reponse, autre1, autre2],
    steps: [reponse],
  };
}

// ---------- 5. Ordre de grandeur d'une division ----------
function genOrdreGrandeurQCM() {
  const puissance = randInt(3, 5);
  const numerateur = randInt(1, 9) * 10 ** puissance;
  const denominateur = randInt(2, 9) * 10 ** randInt(1, 2);
  const valeurExacte = numerateur / denominateur;
  const ordresDeGrandeur = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000];
  const correct = ordresDeGrandeur.reduce((prev, curr) => (Math.abs(curr - valeurExacte) < Math.abs(prev - valeurExacte) ? curr : prev));
  const autres = shuffle(ordresDeGrandeur.filter((v) => v !== correct)).slice(0, 3);
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Automatismes",
    prompt: `Parmi les réponses proposées, la valeur la plus proche de \\(\\dfrac{${numerateur}}{${denominateur}}\\) est :`,
    answer: String(correct),
    options: shuffle([correct, ...autres]).map(String),
    steps: [`\\dfrac{${numerateur}}{${denominateur}} \\approx ${fr(roundTo(valeurExacte, 1))}`, `\\text{La valeur la plus proche parmi les propositions est } ${correct}.`],
  };
}

// ---------- 6. Débit / quantité par unité de temps ----------
function genDebitQCM() {
  const minutes = randInt(1, 3);
  const secondesSupp = pick([0, 20, 30, 40]);
  const dureeSecondes = minutes * 60 + secondesSupp;
  const debit = pick([12, 15, 20, 24, 30, 60]);
  const quantite = debit * dureeSecondes;
  const correct = debit;
  const autres = shuffle([debit * 2, Math.round(debit / 2), debit + randInt(3, 10)]);
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Automatismes",
    prompt: `Une animation, d'une durée de ${minutes} minute${minutes > 1 ? "s" : ""}${secondesSupp ? ` et ${secondesSupp} secondes` : ""}, contient ${quantite} images. Le nombre d'images par seconde est égal à :`,
    answer: `${correct} images/seconde`,
    options: shuffle([correct, ...autres]).map((v) => `${v} images/seconde`),
    steps: [`\\text{Durée totale} = ${dureeSecondes} \\text{ secondes}`, `\\dfrac{${quantite}}{${dureeSecondes}} = ${correct} \\text{ images/seconde}`],
  };
}

// ---------- 7. Appartenance à une courbe du second degré (forme canonique) ----------
function genAppartenanceCourbeQCM() {
  const a = pick([0.5, 1, 2, -0.5, -1]);
  const alpha = randInt(-4, 4);
  const beta = randInt(4, 12);
  const xTest = alpha + nonZero(1, 4);
  const yCorrect = roundTo(a * (xTest - alpha) ** 2 + beta, 2);
  const pointCorrect = `(${xTest} ; ${fr(yCorrect)})`;
  const pointWrong1 = `(${alpha} ; ${fr(beta)})`;
  const pointWrong2 = `(${xTest} ; ${fr(roundTo(yCorrect + a, 2))})`;
  const pointWrong3 = `(0 ; ${fr(roundTo(a * alpha * alpha + beta, 2))})`;
  const options = shuffle([...new Set([pointCorrect, pointWrong1, pointWrong2, pointWrong3])]);
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Automatismes",
    prompt: `On considère une fonction \\(f\\) définie sur \\(\\mathbb{R}\\) par : \\(f(x) = ${fr(a)}(x ${signedL(-alpha)})^2 ${signedL(beta)}\\). On note \\(\\mathcal{C}\\) sa courbe représentative. Un seul des points ci-dessous appartient à \\(\\mathcal{C}\\). Lequel ?`,
    answer: pointCorrect,
    options,
    steps: [`f(${xTest}) = ${fr(a)} \\times (${xTest - alpha})^2 ${signedL(beta)} = ${fr(yCorrect)}`, `\\text{Le point } ${pointCorrect} \\text{ appartient à } \\mathcal{C}.`],
  };
}

// ---------- 8. Calcul avec des puissances de 10 ----------
function genPuissancesDix10QCM() {
  const exp1 = randInt(1, 6);
  const exp2 = randInt(1, 4) * -1;
  const exp3 = randInt(1, 4);
  const answerExp = exp1 + exp2 - exp3 * 2;
  const answer = `10^{${answerExp}}`;
  // Décalages fixes (+1, +2, -1) : toujours distincts entre eux et de answerExp, quelle que soit sa valeur
  // (contrairement à un distracteur du type -answerExp, qui coïncidait avec la réponse ou un autre distracteur
  // lorsque answerExp valait 0 ou 1).
  const wrong1 = `10^{${answerExp + 1}}`;
  const wrong2 = `10^{${answerExp + 2}}`;
  const wrong3 = `10^{${answerExp - 1}}`;
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Automatismes",
    prompt: `On considère le nombre \\(A = \\dfrac{10^{${exp1}} \\times 10^{${exp2}}}{(10^{${exp3}})^2}\\). On peut affirmer que :`,
    answer: `A = ${answer}`,
    options: shuffle([`A = ${answer}`, `A = ${wrong1}`, `A = ${wrong2}`, `A = ${wrong3}`]),
    steps: [`A = 10^{${exp1} - ${Math.abs(exp2)} - ${2 * exp3}} = 10^{${answerExp}}`],
  };
}

// ---------- 9. Tableau de signes d'un produit de deux facteurs affines ----------
function genTableauSignesProduitQCM() {
  const r1 = nonZero(-9, 9);
  let r2 = nonZero(-9, 9);
  while (r2 === r1) r2 = nonZero(-9, 9);
  const petit = Math.min(r1, r2);
  const grand = Math.max(r1, r2);
  const correct = `\\text{positif à l'extérieur de } [${petit} ; ${grand}], \\text{ négatif entre les deux}`;
  const autre = `\\text{négatif à l'extérieur de } [${petit} ; ${grand}], \\text{ positif entre les deux}`;
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Automatismes",
    prompt: `On considère la fonction \\(A\\) définie sur \\(\\mathbb{R}\\) par \\(A(x) = (x ${signedL(-r1)})(x ${signedL(-r2)})\\). Quel est le signe de \\(A(x)\\) sur \\(\\mathbb{R}\\) ?`,
    answer: correct,
    options: [correct, autre, `\\text{toujours positif}`],
    steps: [`\\text{Les racines de A sont } ${r1} \\text{ et } ${r2}.`, `\\text{Un produit de deux facteurs du premier degré est du signe du coefficient dominant (ici positif) à l'extérieur des racines.}`],
  };
}

// ---------- 10. Probabilité conditionnelle par dénombrement (lettres d'un mot) ----------
function genProbabiliteConditionnelleDenombrementNumeric() {
  const mots = [
    { mot: "TIGRE", lettres: ["T", "I", "G", "R", "E"] },
    { mot: "PLAGE", lettres: ["P", "L", "A", "G", "E"] },
    { mot: "MUSEE", lettres: ["M", "U", "S", "E"] }, // E compté une fois pour l'ensemble des lettres distinctes
    { mot: "CARTE", lettres: ["C", "A", "R", "T", "E"] },
  ];
  const voyelles = ["A", "E", "I", "O", "U", "Y"];
  const cas = pick(mots);
  const lettresDistinctes = [...new Set(cas.lettres)];
  const nbVoyellesDansMot = lettresDistinctes.filter((l) => voyelles.includes(l)).length;
  const nbLettresMot = lettresDistinctes.length;
  const answer = roundTo(nbVoyellesDansMot / nbLettresMot, 4);
  return {
    type: "numeric",
    chapter: "Préparation au Bac — Probabilités conditionnelles",
    prompt: `Un enfant choisit une lettre au hasard parmi les 26 lettres de l'alphabet. On note \\(V\\) l'évènement « l'enfant choisit une voyelle » et \\(M\\) l'évènement « l'enfant choisit une lettre du mot ${cas.mot} ». On note \\(P_M(V)\\) la probabilité que l'enfant choisisse une voyelle sachant qu'il a choisi une lettre du mot ${cas.mot}. Calcule \\(P_M(V)\\) (valeur décimale arrondie au dix-millième si besoin).`,
    answer,
    tolerance: 0.0005,
    steps: [
      `\\text{Le mot ${cas.mot} contient } ${nbLettresMot} \\text{ lettres distinctes, dont } ${nbVoyellesDansMot} \\text{ voyelle(s).}`,
      `P_M(V) = \\dfrac{${nbVoyellesDansMot}}{${nbLettresMot}} = ${fr(answer)}`,
    ],
  };
}

// ---------- 11. Arbre pondéré : déduire une probabilité d'intersection ----------
function genArbrePondereIntersectionNumeric() {
  const pT = pick([0.5, 0.55, 0.6, 0.65, 0.7]);
  const pAsachantT = pick([0.1, 0.15, 0.2, 0.25, 0.3]);
  const answer = roundTo(pT * pAsachantT, 4);
  return {
    type: "numeric",
    chapter: "Préparation au Bac — Probabilités conditionnelles",
    prompt: `Dans un club sportif, ${fr(roundTo(pT * 100, 2))} % des adhérents pratiquent le tennis (évènement \\(T\\)), les autres pratiquent le badminton. Parmi les adhérents pratiquant le tennis, \\(${fr(roundTo(pAsachantT * 100, 2))}\\%\\) ont pris une licence compétition (évènement \\(A\\)). Calcule la probabilité que l'adhérent choisi au hasard pratique le tennis et ait pris une licence compétition, c'est-à-dire \\(P(T \\cap A)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [`P(T \\cap A) = P(T) \\times P_T(A) = ${fr(pT)} \\times ${fr(pAsachantT)} = ${fr(answer)}`],
  };
}

// ---------- 12. Probabilité conditionnelle sachant le complémentaire ----------
function genProbabiliteSachantComplementaireNumeric() {
  const pT = pick([0.5, 0.6, 0.7]);
  const pTBar = roundTo(1 - pT, 4);
  const pA = pick([0.2, 0.25, 0.3]);
  const pTinterA = pick([0.1, 0.12, 0.15]);
  const pTBarInterA = roundTo(pA - pTinterA, 4);
  const answer = roundTo(pTBarInterA / pTBar, 4);
  return {
    type: "numeric",
    chapter: "Préparation au Bac — Probabilités conditionnelles",
    prompt: `On donne \\(P(T) = ${fr(pT)}\\), \\(P(A) = ${fr(pA)}\\), et \\(P(T \\cap A) = ${fr(pTinterA)}\\). Calcule la probabilité \\(P_{\\overline{T}}(A)\\), c'est-à-dire la probabilité de \\(A\\) sachant \\(\\overline{T}\\) (valeur décimale arrondie au dix-millième si besoin).`,
    answer,
    tolerance: 0.0005,
    steps: [
      `P(\\overline{T} \\cap A) = P(A) - P(T \\cap A) = ${fr(pA)} - ${fr(pTinterA)} = ${fr(pTBarInterA)}`,
      `P(\\overline{T}) = 1 - ${fr(pT)} = ${fr(pTBar)}`,
      `P_{\\overline{T}}(A) = \\dfrac{P(\\overline{T} \\cap A)}{P(\\overline{T})} = \\dfrac{${fr(pTBarInterA)}}{${fr(pTBar)}} = ${fr(answer)}`,
    ],
  };
}

// ---------- 13. Vrai ou faux : discriminant dépendant d'un paramètre ----------
function genVraiFauxDiscriminantParametreQCM() {
  const signe = pick(["+", "-"]);
  const affirmation =
    signe === "+"
      ? `Quelle que soit la valeur du réel \\(u\\), l'équation \\(x^2 + x + u^2 = 0\\) possède deux solutions réelles distinctes.`
      : `Quelle que soit la valeur du réel \\(u\\), l'équation \\(x^2 + x - u^2 = 0\\) possède deux solutions réelles distinctes.`;
  const reponse = signe === "-" ? "Vrai" : "Faux";
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Vrai ou faux",
    prompt: `Affirmation : « ${affirmation} » Vrai ou faux ?`,
    answer: reponse,
    options: ["Vrai", "Faux"],
    steps:
      signe === "-"
        ? [`\\Delta = 1 - 4 \\times 1 \\times (-u^2) = 1 + 4u^2`, `\\text{Comme } 4u^2 \\geq 0, \\text{ on a } \\Delta \\geq 1 > 0 \\text{ pour tout } u : \\text{l'équation a toujours deux solutions distinctes.}`]
        : [`\\Delta = 1 - 4 \\times 1 \\times u^2 = 1 - 4u^2`, `\\text{Pour } u \\text{ suffisamment grand, } \\Delta < 0 : \\text{l'équation n'a alors aucune solution réelle. L'affirmation est donc fausse.}`],
  };
}

// ---------- 14. Vrai ou faux : nature d'une suite géométrique ----------
function genVraiFauxSuiteGeometriqueQCM() {
  const k = pick([2, 3, 4]);
  const raisonAnnoncee = pick([`\\dfrac{1}{${k}}`, `${k}`, `-\\dfrac{1}{${k}}`]);
  const raisonReelle = `\\dfrac{1}{${k}}`;
  const reponse = raisonAnnoncee === raisonReelle ? "Vrai" : "Faux";
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Vrai ou faux",
    prompt: `On considère la suite \\((u_n)\\) définie pour tout entier naturel \\(n\\) par \\(u_n = ${k}^{-n}\\). Affirmation : « La suite \\((u_n)\\) est une suite géométrique de raison ${raisonAnnoncee}. » Vrai ou faux ?`,
    answer: reponse,
    options: ["Vrai", "Faux"],
    steps: [`u_n = ${k}^{-n} = \\left(\\dfrac{1}{${k}}\\right)^n`, `\\text{C'est une suite géométrique de premier terme 1 et de raison } \\dfrac{1}{${k}}.`],
  };
}

// ---------- 15. Nombre de solutions d'une équation affine (cas particuliers) ----------
function genNombreSolutionsEquationAffineQCM() {
  const cas = pick(["une", "aucune", "infinite"]);
  const a = nonZero(2, 6);
  let equation, reponse;
  if (cas === "une") {
    const xSol = randInt(-8, 8);
    const b = randInt(-10, 10);
    const c = a * xSol + b;
    equation = `${a}x ${signedL(b)} = ${c}`;
    reponse = "Une seule solution";
  } else if (cas === "aucune") {
    const b1 = randInt(-9, 9);
    const b2 = b1 + nonZero(1, 9);
    equation = `${a}x ${signedL(b1)} = ${a}x ${signedL(b2)}`;
    reponse = "Aucune solution";
  } else {
    const b = randInt(-9, 9);
    equation = `${a}x ${signedL(b)} = ${a}x ${signedL(b)}`;
    reponse = "Une infinité de solutions";
  }
  return {
    type: "qcm",
    chapter: "Préparation au Bac — Automatismes",
    prompt: `L'équation \\(${equation}\\) admet :`,
    answer: reponse,
    options: ["Une seule solution", "Aucune solution", "Une infinité de solutions"],
    steps: [
      reponse === "Une seule solution"
        ? `\\text{Le coefficient de x ne s'annule pas dans la simplification : il existe une unique solution.}`
        : reponse === "Aucune solution"
        ? `\\text{Après simplification, les termes en x s'éliminent et il reste une égalité fausse entre deux constantes : aucune solution.}`
        : `\\text{Après simplification, l'équation devient une égalité toujours vraie : tout réel est solution.}`,
    ],
  };
}

const GENERATORS = [
  genDeveloppementIdentiteQCM,
  genLectureGraphiqueAffineQCM,
  genProportionComplementaireQCM,
  genCoefficientMultiplicateurQCM,
  genOrdreGrandeurQCM,
  genDebitQCM,
  genAppartenanceCourbeQCM,
  genPuissancesDix10QCM,
  genTableauSignesProduitQCM,
  genProbabiliteConditionnelleDenombrementNumeric,
  genArbrePondereIntersectionNumeric,
  genProbabiliteSachantComplementaireNumeric,
  genVraiFauxDiscriminantParametreQCM,
  genVraiFauxSuiteGeometriqueQCM,
  genNombreSolutionsEquationAffineQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "preparation-bac-premiere-spe",
    title: "Préparation au Bac (EAM)",
    description: "Exercices dans l'esprit de l'Épreuve Anticipée de Mathématiques : automatismes-QCM, probabilités conditionnelles, vrai ou faux.",
    level: "premiere-spe",
    order: 12,
  },
  generate,
};
