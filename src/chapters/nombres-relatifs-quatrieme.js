// ---------------------------------------------------------------------------
// Chapitre : Nombres relatifs (4e) — sous abonnement.
//
// Correspond au chapitre 1 du manuel de 4e : additionner et soustraire des
// nombres relatifs décimaux (règles de signes, opposé), multiplier et
// diviser des nombres relatifs (règle des signes, parité du nombre de
// facteurs négatifs), calculer une suite d'opérations en respectant les
// priorités (parenthèses, puis multiplication/division, puis addition/
// soustraction), et quelques exercices de raisonnement/bilan (programmes de
// calcul, signe d'un produit/quotient inconnu, durées, barèmes).
// Reprend la tâche intellectuelle des exercices du manuel (avec correction
// utilisée pour rédiger les steps), avec des nombres, prénoms et contextes
// différents à chaque génération pour éviter toute reproduction à l'identique.
// Voir automatismes-quatrieme.js (thème "nombres-relatifs-quatrieme") pour
// les mini-exercices "Calcul mental".
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
const randDecimal = (min, max, decimals) => roundTo(min + Math.random() * (max - min), decimals);
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");
const signedTex = (n) => `${n >= 0 ? "+" : ""}${frTex(n)}`;

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

// =========================== Additionner et soustraire des relatifs ===========================

// ---------- 1. Additionner deux relatifs de même signe (décimaux) ----------
function genAdditionnerRelatifsMemeSigneNumeric() {
  const sign = pick([1, -1]);
  const a = randDecimal(0.5, 30, 1) * sign;
  const b = randDecimal(0.5, 30, 1) * sign;
  const answer = roundTo(a + b, 2);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Additionner",
    prompt: `Calcule : \\(${signedTex(a)} + (${signedTex(b)})\\)`,
    answer,
    tolerance: 0.01,
    steps: [
      `Les deux nombres ont le même signe : on conserve le signe commun et on ajoute leurs distances à 0.`,
      `${sign > 0 ? "+" : "-"} (${fr(Math.abs(a))} + ${fr(Math.abs(b))}) = ${fr(answer)}`,
    ],
  };
}

// ---------- 2. Additionner deux relatifs de signes différents (décimaux) ----------
function genAdditionnerRelatifsSignesDifferentsNumeric() {
  const posVal = randDecimal(0.5, 40, 1);
  const negVal = randDecimal(0.5, 40, 1);
  const a = posVal;
  const b = -negVal;
  const answer = roundTo(a + b, 2);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Additionner",
    prompt: `Calcule : \\(${frTex(a)} + (${frTex(b)})\\)`,
    answer,
    tolerance: 0.01,
    steps: [
      `Les deux nombres ont des signes différents : le résultat a le signe du nombre ayant la plus grande distance à 0.`,
      `${answer >= 0 ? "+" : "-"} (${fr(Math.max(posVal, negVal))} - ${fr(Math.min(posVal, negVal))}) = ${fr(answer)}`,
    ],
  };
}

// ---------- 3. Soustraire un relatif en ajoutant son opposé ----------
function genSoustraireViaOpposeNumeric() {
  const a = randDecimal(-30, 30, 1);
  const b = randDecimal(-30, 30, 1);
  const answer = roundTo(a - b, 2);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Soustraire",
    prompt: `Calcule : \\(${frTex(a)} - (${signedTex(b)})\\)`,
    answer,
    tolerance: 0.01,
    steps: [`Soustraire un nombre revient à ajouter son opposé : ${fr(a)} - (${fr(b)}) = ${fr(a)} + (${fr(-b)})`, `= ${fr(answer)}`],
  };
}

// ---------- 4. Compléter une différence à trou ----------
function genCompleterDifferenceTrouNumeric() {
  const a = randDecimal(-20, 20, 1);
  const b = randDecimal(-20, 20, 1);
  const total = roundTo(a - b, 2);
  const trouEnPremier = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Compléter",
    prompt: trouEnPremier ? `Complète : \\(? - (${signedTex(b)}) = ${frTex(total)}\\)` : `Complète : \\(${frTex(a)} - ? = ${frTex(total)}\\)`,
    answer: trouEnPremier ? a : b,
    tolerance: 0.01,
    steps: [`On utilise l'opération inverse pour isoler le terme manquant.`],
  };
}

// ---------- 5. Programme de calcul (additionner/soustraire) ----------
function genProgrammeCalculAdditionSoustractionNumeric() {
  const depart = randInt(-15, 15);
  const step1 = pick(["ajouter", "soustraire"]);
  const val1 = nonZero(-10, 10);
  const step2 = pick(["ajouter", "soustraire"]);
  const val2 = nonZero(-10, 10);
  const apply = (n, op, v) => (op === "ajouter" ? n + v : n - v);
  const etape1 = apply(depart, step1, val1);
  const answer = apply(etape1, step2, val2);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Programme de calcul",
    prompt: `Programme de calcul : choisir un nombre, ${step1} ${val1}, puis ${step2} ${val2}. Quel résultat obtient-on en partant de ${depart} ?`,
    answer,
    steps: [`${depart} ${step1 === "ajouter" ? "+" : "-"} (${val1}) = ${etape1}`, `${etape1} ${step2 === "ajouter" ? "+" : "-"} (${val2}) = ${answer}`],
  };
}

// ---------- 6. Chaîne d'additions/soustractions décimales (3-4 termes) ----------
function genChaineAdditionsSoustractionsNumeric() {
  const n = randInt(3, 4);
  const termes = Array.from({ length: n }, () => randDecimal(-25, 25, 1));
  let total = termes[0];
  const parts = [`${frTex(termes[0])}`];
  for (let i = 1; i < n; i++) {
    total = roundTo(total + termes[i], 2);
    parts.push(`${termes[i] >= 0 ? "+" : "-"} ${frTex(Math.abs(termes[i]))}`);
  }
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Chaîne d'opérations",
    prompt: `Calcule : \\(${parts.join(" ")}\\)`,
    answer: total,
    tolerance: 0.02,
    steps: [`On additionne les termes de gauche à droite : ${fr(total)}`],
  };
}

// =========================== Multiplier et diviser des relatifs ===========================

// ---------- 7. Multiplier deux relatifs décimaux ----------
function genMultiplierRelatifsNumeric() {
  const a = randDecimal(-15, 15, 2);
  const b = randDecimal(-15, 15, 2);
  const answer = roundTo(a * b, 3);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Multiplier",
    prompt: `Calcule : \\(${frTex(a)} \\times ${signedTex(b)}\\)`,
    answer,
    tolerance: 0.01,
    steps: [`Règle des signes : les deux nombres sont ${Math.sign(a) === Math.sign(b) ? "de même signe, le résultat est positif" : "de signes différents, le résultat est négatif"}.`, `${fr(Math.abs(a))} \\times ${fr(Math.abs(b))} = ${fr(Math.abs(answer))}`],
  };
}

// ---------- 8. Diviser deux relatifs décimaux ----------
function genDiviserRelatifsNumeric() {
  const diviseur = randDecimal(1, 12, 1) * pick([1, -1]);
  const quotient = randDecimal(1, 12, 1) * pick([1, -1]);
  const dividende = roundTo(diviseur * quotient, 3);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Diviser",
    prompt: `Calcule : \\(${frTex(dividende)} \\div (${frTex(diviseur)})\\)`,
    answer: roundTo(quotient, 3),
    tolerance: 0.01,
    steps: [`Règle des signes : les deux nombres sont ${Math.sign(dividende) === Math.sign(diviseur) ? "de même signe, le résultat est positif" : "de signes différents, le résultat est négatif"}.`],
  };
}

// ---------- 9. Signe d'un produit de plusieurs facteurs négatifs ----------
function genSigneProduitPlusieursFacteursQCM() {
  const nbNegatifs = randInt(2, 7);
  const nbPositifs = randInt(0, 3);
  const positif = nbNegatifs % 2 === 0;
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Signe d'un produit",
    prompt: `Un produit est composé de ${nbNegatifs} facteur(s) négatif(s)${nbPositifs > 0 ? ` et ${nbPositifs} facteur(s) positif(s)` : ""}. Quel est le signe de ce produit ?`,
    answer: positif ? "Positif" : "Négatif",
    options: ["Positif", "Négatif"],
    steps: [`Le nombre de facteurs négatifs est ${positif ? "pair" : "impair"} : le produit est ${positif ? "positif" : "négatif"}. Les facteurs positifs n'influencent pas le signe.`],
  };
}

// ---------- 10. Produit de plusieurs facteurs tous égaux ----------
function genProduitFacteursEgauxNumeric() {
  const a = pick([-5, -4, -3, -2, 2, 3, 4, 5]);
  const n = randInt(2, 6);
  const answer = a ** n;
  const facteurs = Array.from({ length: n }, () => `${signedTex(a)}`).join(" \\times ");
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Produit de facteurs égaux",
    prompt: `Quel est le produit de ${n} facteurs tous égaux à ${a} ?`,
    answer,
    steps: [`${facteurs} = ${answer}`],
  };
}

// ---------- 11. Programme de calcul (multiplication) ----------
function genProgrammeCalculMultiplicationNumeric() {
  const depart = nonZero(-12, 12);
  const mult1 = nonZero(-10, 10);
  const add1 = nonZero(-15, 15);
  const etape1 = depart * mult1;
  const answer = etape1 + add1;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Programme de calcul",
    prompt: `Programme de calcul : choisir un nombre, le multiplier par ${mult1}, puis ajouter ${add1}. Quel résultat obtient-on en partant de ${depart} ?`,
    answer,
    steps: [`${depart} \\times ${mult1} = ${etape1}`, `${etape1} + (${add1}) = ${answer}`],
  };
}

// ---------- 12. Carré d'un nombre relatif (toujours positif) ----------
function genCarreDunRelatifNumeric() {
  const n = nonZero(-15, 15);
  const answer = n * n;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Carré d'un relatif",
    prompt: `Calcule : \\((${n})^2\\)`,
    answer,
    steps: [`(${n}) \\times (${n}) = ${answer}`, `Le carré d'un nombre relatif (positif ou négatif) est toujours positif.`],
  };
}

// =========================== Priorités opératoires ===========================

// ---------- 13. Calcul avec priorités (relatifs décimaux) ----------
function genPrioriteCalculDecimalNumeric() {
  const a = randDecimal(-20, 20, 1);
  const b = randDecimal(-9, 9, 1);
  const c = randDecimal(-9, 9, 1);
  const op1 = pick(["+", "-"]);
  const produit = roundTo(b * c, 2);
  const answer = roundTo(op1 === "+" ? a + produit : a - produit, 2);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Priorités",
    prompt: `Calcule en respectant les priorités : \\(${frTex(a)} ${op1} ${frTex(b)} \\times (${frTex(c)})\\)`,
    answer,
    tolerance: 0.02,
    steps: [`On calcule d'abord la multiplication : ${fr(b)} \\times (${fr(c)}) = ${fr(produit)}`, `${fr(a)} ${op1} ${fr(produit)} = ${fr(answer)}`],
  };
}

// ---------- 14. Compléter une chaîne de calculs (schéma) ----------
function genCompleterChaineCalculsNumeric() {
  const depart = nonZero(-10, 10);
  const op1 = pick(["+", "-", "×"]);
  const val1 = nonZero(-8, 8);
  const op2 = pick(["+", "-", "×"]);
  const val2 = nonZero(-8, 8);
  const apply = (n, op, v) => (op === "+" ? n + v : op === "-" ? n - v : n * v);
  const etape1 = apply(depart, op1, val1);
  const answer = apply(etape1, op2, val2);
  const askEtape1 = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Chaîne de calculs",
    prompt: askEtape1
      ? `On part de ${depart}, on applique l'opération "${op1} ${val1}", puis "${op2} ${val2}". Quelle est la valeur obtenue après la première opération ?`
      : `On part de ${depart}, on applique l'opération "${op1} ${val1}", puis "${op2} ${val2}". Quel est le résultat final ?`,
    answer: askEtape1 ? etape1 : answer,
    steps: [`${depart} ${op1} ${val1} = ${etape1}`, `${etape1} ${op2} ${val2} = ${answer}`],
  };
}

// ---------- 15. Erreur de calculatrice (priorités, parenthèses oubliées) ----------
function genErreurCalculatriceQCM() {
  const a = randInt(-10, 10);
  const b = nonZero(-8, 8);
  const c = nonZero(-8, 8);
  // Calcul voulu : a - b × (c + d) où d est un autre terme -> simplifions : a - b × (c)
  const d = nonZero(-8, 8);
  const correct = a - b * (c + d);
  const sansParentheses = a - b * c + d;
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Priorités (erreurs fréquentes)",
    prompt: `${p1} et ${p2} calculent \\(${a} - ${b} \\times (${c} + (${d}))\\). ${p1} trouve ${correct} et ${p2} trouve ${sansParentheses}. Qui a la bonne réponse ?`,
    answer: p1,
    options: [p1, p2],
    steps: [`Il faut calculer d'abord la parenthèse : ${c} + (${d}) = ${c + d}`, `Puis la multiplication : ${b} \\times ${c + d} = ${b * (c + d)}`, `Puis : ${a} - ${b * (c + d)} = ${correct}`],
  };
}

// ---------- 16. Priorités dans un contexte "réseau social" ----------
function genPrioriteReseauSocialQCM() {
  const a = randDecimal(1, 20, 1);
  const b = pick([2, 3, 4, 5]);
  const correct = roundTo(a - a * b, 2);
  const erreurParenthese = roundTo((a - a) * b, 2);
  const erreurSansMult = roundTo(a - b, 2);
  const options = shuffle([`${fr(correct)}`, `${fr(erreurParenthese)}`, `${fr(erreurSansMult)}`]).filter((v, i, arr) => arr.indexOf(v) === i);
  while (options.length < 3) {
    const candidate = `${fr(roundTo(correct + nonZero(-5, 5), 2))}`;
    if (!options.includes(candidate)) options.push(candidate);
  }
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Priorités (débat)",
    prompt: `Sur un fil de discussion, quelqu'un demande : quel est le résultat de \\(${fr(a)} - ${fr(a)} \\times ${b}\\) ?`,
    answer: `${fr(correct)}`,
    options,
    steps: [`La multiplication est prioritaire : ${fr(a)} \\times ${b} = ${fr(roundTo(a * b, 2))}`, `${fr(a)} - ${fr(roundTo(a * b, 2))} = ${fr(correct)}`],
  };
}

// ---------- 17. Comparer deux programmes de calcul ----------
function genComparerDeuxProgrammesQCM() {
  const depart = nonZero(-10, 10);
  const k = nonZero(-6, 6);
  const m = nonZero(-8, 8);
  const memeResultat = Math.random() < 0.5;
  // Programme A : (x + m) × k
  const resultA = (depart + m) * k;
  // Programme B "équivalente" (distributivité) : x × k + m × k -> toujours égal à A.
  // Programme B "différente" : x × k + m (sans multiplier m par k) -> généralement différent de A.
  const resultB = memeResultat ? depart * k + m * k : depart * k + m;
  const texteB = memeResultat ? `le multiplier par ${k}, puis ajouter ${m * k}` : `le multiplier par ${k}, puis ajouter ${m}`;
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Comparer deux programmes",
    prompt: `Programme A : choisir un nombre, ajouter ${m}, puis multiplier par ${k}. Programme B : choisir un nombre, ${texteB}. En partant de ${depart}, les deux programmes donnent-ils le même résultat ?`,
    answer: resultA === resultB ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`Programme A : (${depart} + (${m})) \\times ${k} = ${resultA}`, `Programme B : ${depart} \\times ${k} + (${memeResultat ? m * k : m}) = ${resultB}`],
  };
}

// ---------- 18. Durée entre deux années (relatifs, avant/après une origine) ----------
function genDureeEntreDeuxAnneesNumeric() {
  const debut = -randInt(50, 900);
  const duree = randInt(20, 90);
  const fin = debut + duree;
  const civilisation = pick(["un royaume ancien", "une cité antique", "un empire disparu", "une dynastie légendaire"]);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Durées",
    prompt: `${civilisation[0].toUpperCase()}${civilisation.slice(1)} a existé de l'an ${debut} à l'an ${fin >= 0 ? "+" : ""}${fin}. Combien d'années cette période a-t-elle duré ?`,
    answer: duree,
    steps: [`${fin} - (${debut}) = ${fin} + (${-debut}) = ${duree}`],
  };
}

// ---------- 19. Signe d'un facteur inconnu dans un produit ----------
function genSigneFacteurInconnuProduitQCM() {
  const produitPositif = Math.random() < 0.5;
  const nbNegatifsConnus = randInt(0, 3);
  const parite = nbNegatifsConnus % 2;
  // Si produit positif souhaité : il faut que le nombre total de négatifs soit pair.
  const inconnuNegatif = produitPositif ? parite === 1 : parite === 0;
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Signe d'un facteur inconnu",
    prompt: `Un produit est ${produitPositif ? "positif" : "négatif"}. Il contient déjà ${nbNegatifsConnus} facteur(s) négatif(s) connu(s), et un dernier facteur x dont on ne connaît pas le signe. Quel est le signe de x ?`,
    answer: inconnuNegatif ? "Négatif" : "Positif",
    options: ["Positif", "Négatif"],
    steps: [`Pour que le produit soit ${produitPositif ? "positif" : "négatif"}, le nombre total de facteurs négatifs doit être ${produitPositif ? "pair" : "impair"}. Il y en a déjà ${nbNegatifsConnus} : x doit donc être ${inconnuNegatif ? "négatif" : "positif"}.`],
  };
}

// ---------- 20. Signe d'un quotient inconnu ----------
function genSigneQuotientInconnuQCM() {
  const quotientPositif = Math.random() < 0.5;
  const numerateurNegatif = Math.random() < 0.5;
  const denominateurNegatif = quotientPositif ? numerateurNegatif : !numerateurNegatif;
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Signe d'un quotient",
    prompt: `Le quotient \\(\\dfrac{a}{b}\\) est ${quotientPositif ? "positif" : "négatif"}. Sachant que a est ${numerateurNegatif ? "négatif" : "positif"}, quel est le signe de b ?`,
    answer: denominateurNegatif ? "Négatif" : "Positif",
    options: ["Positif", "Négatif"],
    steps: [`Un quotient est ${quotientPositif ? "positif si le numérateur et le dénominateur sont de même signe" : "négatif si le numérateur et le dénominateur sont de signes différents"}. Comme a est ${numerateurNegatif ? "négatif" : "positif"}, b doit être ${denominateurNegatif ? "négatif" : "positif"}.`],
  };
}

// ---------- 21. Barème de QCM (bonne réponse / mauvaise réponse) ----------
function genBaremeQCMNumeric() {
  const nbQuestions = pick([15, 20, 25, 30]);
  const bonnes = randInt(5, nbQuestions - 5);
  const mauvaises = randInt(1, nbQuestions - bonnes - 1);
  const pointsBonne = pick([1, 2]);
  const pointsMauvaise = pick([-0.5, -1]);
  const answer = roundTo(bonnes * pointsBonne + mauvaises * pointsMauvaise, 2);
  const prenom = pick(prenoms);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Barème",
    prompt: `Lors d'un QCM de ${nbQuestions} questions, une bonne réponse rapporte ${fr(pointsBonne)} point(s), une mauvaise réponse retire ${fr(Math.abs(pointsMauvaise))} point(s), et une absence de réponse ne change rien. ${prenom} a coché ${bonnes} bonnes réponses et ${mauvaises} mauvaises réponses. Quelle note obtient ${prenom} ?`,
    answer,
    tolerance: 0.01,
    steps: [`${bonnes} \\times ${fr(pointsBonne)} + ${mauvaises} \\times (${fr(pointsMauvaise)}) = ${fr(answer)}`],
  };
}

// ---------- 22. Compléter un schéma d'opérations (valeur de départ inconnue) ----------
function genTrouverDepartSchemaNumeric() {
  const mult = nonZero(-6, 6);
  const add = nonZero(-12, 12);
  const depart = nonZero(-10, 10);
  const resultat = depart * mult + add;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Chaîne de calculs",
    prompt: `On applique à un nombre de départ les opérations "multiplier par ${mult}" puis "ajouter ${add}", et on obtient ${resultat}. Quel était le nombre de départ ?`,
    answer: depart,
    steps: [`${resultat} - (${add}) = ${resultat - add}`, `${resultat - add} \\div ${mult} = ${depart}`],
  };
}

const GENERATORS = [
  genAdditionnerRelatifsMemeSigneNumeric,
  genAdditionnerRelatifsSignesDifferentsNumeric,
  genSoustraireViaOpposeNumeric,
  genCompleterDifferenceTrouNumeric,
  genProgrammeCalculAdditionSoustractionNumeric,
  genChaineAdditionsSoustractionsNumeric,
  genMultiplierRelatifsNumeric,
  genDiviserRelatifsNumeric,
  genSigneProduitPlusieursFacteursQCM,
  genProduitFacteursEgauxNumeric,
  genProgrammeCalculMultiplicationNumeric,
  genCarreDunRelatifNumeric,
  genPrioriteCalculDecimalNumeric,
  genCompleterChaineCalculsNumeric,
  genErreurCalculatriceQCM,
  genPrioriteReseauSocialQCM,
  genComparerDeuxProgrammesQCM,
  genDureeEntreDeuxAnneesNumeric,
  genSigneFacteurInconnuProduitQCM,
  genSigneQuotientInconnuQCM,
  genBaremeQCMNumeric,
  genTrouverDepartSchemaNumeric,
];

const DIFFICULTY = {
  genAdditionnerRelatifsMemeSigneNumeric: "facile",
  genSoustraireViaOpposeNumeric: "facile",
  genMultiplierRelatifsNumeric: "facile",
  genDiviserRelatifsNumeric: "facile",
  genCarreDunRelatifNumeric: "facile",
  genAdditionnerRelatifsSignesDifferentsNumeric: "standard",
  genCompleterDifferenceTrouNumeric: "standard",
  genProgrammeCalculAdditionSoustractionNumeric: "standard",
  genChaineAdditionsSoustractionsNumeric: "standard",
  genSigneProduitPlusieursFacteursQCM: "standard",
  genProduitFacteursEgauxNumeric: "standard",
  genProgrammeCalculMultiplicationNumeric: "standard",
  genPrioriteCalculDecimalNumeric: "standard",
  genCompleterChaineCalculsNumeric: "standard",
  genPrioriteReseauSocialQCM: "standard",
  genSigneFacteurInconnuProduitQCM: "standard",
  genSigneQuotientInconnuQCM: "standard",
  genErreurCalculatriceQCM: "expert",
  genComparerDeuxProgrammesQCM: "expert",
  genDureeEntreDeuxAnneesNumeric: "expert",
  genBaremeQCMNumeric: "expert",
  genTrouverDepartSchemaNumeric: "expert",
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
    id: "nombres-relatifs-quatrieme",
    title: "Nombres relatifs",
    description: "Additionner, soustraire, multiplier et diviser des nombres relatifs décimaux, priorités opératoires, signe d'un produit ou d'un quotient, programmes de calcul.",
    level: "quatrieme",
    free: false,
    order: 2,
  },
  generate,
};
