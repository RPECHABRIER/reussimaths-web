// ---------------------------------------------------------------------------
// Chapitre : Croissance linéaire (Première, enseignement mathématique non
// spé) — sous abonnement.
//
// Correspond au chapitre 3 du programme d'enseignement mathématique de
// première (non spécialité) : suites arithmétiques (signe de la raison,
// calcul de la raison depuis deux termes, relation de récurrence
// u(n+1) = u(n) + r, expression explicite u(n) = r×n + u(0), calcul d'un
// terme de rang donné, modélisation d'une situation concrète discrète par
// une suite arithmétique, résolution d'inéquations u(n) ⩾ k ou u(n) ⩽ k pour
// déterminer un seuil), et fonctions affines associées à des phénomènes
// continus à croissance linéaire (coefficient directeur depuis deux points,
// distinction modèle discret / modèle continu).
// La correction du livre du professeur (source .tex, exercices 8-32 :
// Automatismes méthodes 1-4 sur les suites arithmétiques et les fonctions
// affines) a servi à identifier la méthode ; les nombres et contextes sont
// générés aléatoirement à chaque tirage.
// Voir automatismes-premiere-non-spe.js (thème
// "croissance-lineaire-premiere-non-spe") pour les mini-exercices
// "Calcul mental" associés.
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

// Écrit "r×n + b" en tenant compte des signes (utilisé pour u(n) = r n + u(0)).
function texSuiteExplicite(r, b) {
  const termeR = r === 1 ? "n" : r === -1 ? "-n" : `${r}n`;
  if (b === 0) return termeR;
  return `${termeR} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;
}

// ---------- 1. Signe de la raison depuis le sens de variation ----------
function genSigneRaisonQCM() {
  const sens = pick(["croissante", "décroissante"]);
  const nomSuite = pick(["u", "v", "w"]);
  return {
    type: "qcm",
    chapter: "Croissance linéaire — Suites arithmétiques",
    prompt: `La suite ${nomSuite} est arithmétique et ${sens}. Quel est le signe de sa raison r ?`,
    answer: sens === "croissante" ? "r > 0" : "r < 0",
    options: ["r > 0", "r < 0"],
    steps: [sens === "croissante" ? "Une suite arithmétique est croissante si et seulement si sa raison est strictement positive." : "Une suite arithmétique est décroissante si et seulement si sa raison est strictement négative."],
  };
}

// ---------- 2. Calculer la raison depuis deux termes consécutifs ----------
function genRaisonDepuisDeuxTermesNumeric() {
  const nomSuite = pick(["u", "v", "w"]);
  const r = nonZero(-9, 9);
  const u0 = randInt(-15, 15);
  const u1 = u0 + r;
  return {
    type: "numeric",
    chapter: "Croissance linéaire — Suites arithmétiques",
    prompt: `Une suite arithmétique ${nomSuite} vérifie \\(${nomSuite}(0) = ${u0}\\) et \\(${nomSuite}(1) = ${u1}\\). Calcule sa raison r.`,
    answer: r,
    steps: [`r = ${nomSuite}(1) - ${nomSuite}(0) = ${u1} - (${u0}) = ${r}`],
  };
}

// ---------- 3. Calcul par récurrence u(n+1) = u(n) + r ----------
function genTermeSuivantRecurrenceNumeric() {
  const nomSuite = pick(["u", "v", "w"]);
  const r = nonZero(-8, 8);
  const n = randInt(1, 6);
  const un = randInt(-30, 30);
  const unPlus1 = un + r;
  return {
    type: "numeric",
    chapter: "Croissance linéaire — Suites arithmétiques",
    prompt: `Une suite arithmétique ${nomSuite} de raison \\(r = ${r}\\) vérifie \\(${nomSuite}(${n}) = ${un}\\). Calcule \\(${nomSuite}(${n + 1})\\).`,
    answer: unPlus1,
    steps: [`${nomSuite}(${n + 1}) = ${nomSuite}(${n}) + r = ${un} + (${r}) = ${unPlus1}`],
  };
}

// ---------- 4. Calculer un terme via l'expression explicite u(n) = r×n + u(0) ----------
function genTermeExpressionExpliciteNumeric() {
  const nomSuite = pick(["u", "v", "w"]);
  const r = nonZero(-9, 9);
  const u0 = randInt(-20, 20);
  const n = randInt(2, 15);
  const answer = r * n + u0;
  return {
    type: "numeric",
    chapter: "Croissance linéaire — Suites arithmétiques",
    prompt: `Une suite arithmétique ${nomSuite} a pour expression explicite \\(${nomSuite}(n) = ${texSuiteExplicite(r, u0)}\\). Calcule \\(${nomSuite}(${n})\\).`,
    answer,
    steps: [`${nomSuite}(${n}) = ${r} \\times ${n} ${u0 >= 0 ? "+" : "-"} ${Math.abs(u0)} = ${answer}`],
  };
}

// ---------- 5. Déterminer le premier terme depuis un terme de rang n et la raison ----------
function genPremierTermeDepuisRaisonNumeric() {
  const nomSuite = pick(["u", "v", "w"]);
  const r = nonZero(-8, 8);
  const u0 = randInt(-15, 15);
  const n = randInt(2, 10);
  const un = r * n + u0;
  return {
    type: "numeric",
    chapter: "Croissance linéaire — Suites arithmétiques",
    prompt: `Une suite arithmétique ${nomSuite} a pour raison \\(r = ${r}\\) et vérifie \\(${nomSuite}(${n}) = ${un}\\). Calcule son premier terme \\(${nomSuite}(0)\\).`,
    answer: u0,
    steps: [`${nomSuite}(${n}) = r \\times ${n} + ${nomSuite}(0) \\text{ donc } ${nomSuite}(0) = ${un} - ${r} \\times ${n} = ${u0}`],
  };
}

// ---------- 6. Résoudre une inéquation u(n) ⩾ k pour trouver le plus petit rang ----------
function genResoudreInequationSeuilNumeric() {
  const nomSuite = pick(["u", "v", "w"]);
  const croissante = Math.random() < 0.5;
  const r = croissante ? randInt(1, 9) : nonZero(-9, -1);
  const u0 = randInt(-20, 20);
  const nSol = randInt(3, 25);
  // Construit le seuil k pour que le plus petit n entier vérifiant l'inéquation soit exactement nSol.
  const valeurAvant = r * (nSol - 1) + u0;
  const k = croissante ? valeurAvant + 1 : valeurAvant - 1;
  const sensInequation = croissante ? "\\geqslant" : "\\leqslant";
  return {
    type: "numeric",
    chapter: "Croissance linéaire — Suites arithmétiques",
    prompt: `Une suite arithmétique ${nomSuite} a pour expression explicite \\(${nomSuite}(n) = ${texSuiteExplicite(r, u0)}\\). Détermine le plus petit rang entier n à partir duquel \\(${nomSuite}(n) ${sensInequation} ${k}\\).`,
    answer: nSol,
    steps: [`${texSuiteExplicite(r, u0)} ${sensInequation} ${k}`, `n ${sensInequation} \\dfrac{${k} ${u0 >= 0 ? "-" : "+"} ${Math.abs(u0)}}{${r}}`, `\\text{Le plus petit entier convenable est } n = ${nSol}`],
  };
}

// ---------- 7. Modéliser une situation concrète par une suite arithmétique (raison) ----------
function genModeliserRaisonContexteNumeric() {
  const contexte = pick([
    { sujet: "un robinet débite de l'eau", unite: "cL", verbe: "chaque seconde" },
    { sujet: "le niveau d'une piscine augmente", unite: "cm", verbe: "chaque heure" },
    { sujet: "une population de bactéries augmente", unite: "individus", verbe: "chaque minute" },
    { sujet: "un capital augmente d'un montant fixe", unite: "€", verbe: "chaque mois" },
  ]);
  const r = randInt(5, 60);
  return {
    type: "numeric",
    chapter: "Croissance linéaire — Modélisation",
    prompt: `Dans une situation où ${contexte.sujet} de ${r} ${contexte.unite} ${contexte.verbe}, on modélise la quantité totale par une suite arithmétique. Quelle est la raison r de cette suite (en ${contexte.unite}) ?`,
    answer: r,
    steps: [`\\text{L'augmentation étant constante et égale à } ${r} \\text{ ${contexte.unite} à chaque étape, la raison est } r = ${r}`],
  };
}

// ---------- 8. Modéliser puis calculer un terme (contexte concret) ----------
function genModeliserCalculerTermeNumeric() {
  const contexte = pick([
    { sujet: "Un village compte", unite: "habitants", verbe: "chaque année" },
    { sujet: "Un réservoir contient", unite: "L", verbe: "chaque minute" },
    { sujet: "Un compte en banque contient", unite: "€", verbe: "chaque mois" },
  ]);
  const u0 = randInt(500, 3000);
  const r = randInt(5, 50);
  const n = randInt(2, 12);
  const answer = r * n + u0;
  return {
    type: "numeric",
    chapter: "Croissance linéaire — Modélisation",
    prompt: `${contexte.sujet} initialement ${u0} ${contexte.unite}, et cette quantité augmente de ${r} ${contexte.unite} ${contexte.verbe}. On modélise la quantité au bout de n étapes par une suite arithmétique h de premier terme \\(h(0) = ${u0}\\) et de raison \\(r = ${r}\\). Calcule \\(h(${n})\\).`,
    answer,
    steps: [`h(${n}) = ${r} \\times ${n} + ${u0} = ${answer}`],
  };
}

// ---------- 9. Modéliser puis résoudre une inéquation (temps pour atteindre un seuil) ----------
function genModeliserResoudreInequationNumeric() {
  const contexte = pick([
    { sujet: "Un robinet débite de l'eau à raison de", unite: "cL", uniteTemps: "secondes", objet: "une bouteille" },
    { sujet: "Une piscine se remplit à raison de", unite: "L", uniteTemps: "heures", objet: "la piscine" },
  ]);
  const r = randInt(5, 30);
  const u0 = randInt(0, 20);
  const nSol = randInt(3, 20);
  const valeurAvant = r * (nSol - 1) + u0;
  const k = valeurAvant + 1;
  return {
    type: "numeric",
    chapter: "Croissance linéaire — Modélisation",
    prompt: `${contexte.sujet} ${r} ${contexte.unite} par ${contexte.uniteTemps.slice(0, -1)}. On modélise la quantité totale par une suite arithmétique h de premier terme \\(h(0) = ${u0}\\) et de raison \\(r = ${r}\\). Combien de ${contexte.uniteTemps} minimum faut-il attendre pour que la quantité atteigne ${k} ${contexte.unite} ?`,
    answer: nSol,
    steps: [`h(n) = ${r}n + ${u0} \\geqslant ${k}`, `n \\geqslant \\dfrac{${k} - ${u0}}{${r}}`, `\\text{Le plus petit entier convenable est } n = ${nSol}`],
  };
}

// ---------- 10. Coefficient directeur d'une fonction affine depuis deux points ----------
function genCoefficientDirecteurDeuxPointsNumeric() {
  const xA = randInt(-8, 8);
  let xB = randInt(-8, 8);
  while (xB === xA) xB = randInt(-8, 8);
  const m = nonZero(-6, 6);
  const p = randInt(-10, 10);
  const yA = m * xA + p;
  const yB = m * xB + p;
  return {
    type: "numeric",
    chapter: "Croissance linéaire — Fonctions affines",
    prompt: `Une droite représentant un phénomène continu à croissance linéaire passe par les points \\(A(${xA} ; ${yA})\\) et \\(B(${xB} ; ${yB})\\). Calcule son coefficient directeur.`,
    answer: m,
    steps: [`m = \\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{${yB} - (${yA})}{${xB} - (${xA})} = ${m}`],
  };
}

// ---------- 11. Distinguer un modèle discret (suite) d'un modèle continu (fonction) ----------
function genDiscretOuContinuQCM() {
  const cas = pick([
    { description: "Le nombre d'élèves inscrits dans un collège, relevé chaque année.", reponse: "Modèle discret (suite)" },
    { description: "Le niveau d'eau dans une piscine qui se remplit en continu.", reponse: "Modèle continu (fonction)" },
    { description: "La quantité d'eau écoulée d'un robinet, mesurée toutes les secondes.", reponse: "Modèle discret (suite)" },
    { description: "La distance parcourue par un cycliste roulant à vitesse constante.", reponse: "Modèle continu (fonction)" },
    { description: "Le nombre de bactéries compté chaque heure dans une expérience.", reponse: "Modèle discret (suite)" },
    { description: "La température d'un four qui chauffe progressivement.", reponse: "Modèle continu (fonction)" },
  ]);
  return {
    type: "qcm",
    chapter: "Croissance linéaire — Modélisation",
    prompt: `« ${cas.description} » Quel type de modèle est le plus adapté pour décrire cette situation ?`,
    answer: cas.reponse,
    options: ["Modèle discret (suite)", "Modèle continu (fonction)"],
    steps: [`\\text{Cette situation correspond à un ${cas.reponse === "Modèle discret (suite)" ? "relevé à des instants séparés (valeurs entières) : c'est un modèle discret." : "phénomène qui évolue de façon continue au cours du temps : c'est un modèle continu."}}`],
  };
}

// ---------- 12. Calculer la raison depuis deux termes non consécutifs ----------
function genRaisonDepuisDeuxTermesNonConsecutifsNumeric() {
  const nomSuite = pick(["u", "v", "w"]);
  const r = nonZero(-7, 7);
  const p = randInt(1, 5);
  let q = randInt(1, 10);
  while (q === p) q = randInt(1, 10);
  const up = randInt(-20, 20);
  const uq = up + r * (q - p);
  return {
    type: "numeric",
    chapter: "Croissance linéaire — Suites arithmétiques",
    prompt: `Une suite arithmétique ${nomSuite} vérifie \\(${nomSuite}(${p}) = ${up}\\) et \\(${nomSuite}(${q}) = ${uq}\\). Calcule sa raison r.`,
    answer: r,
    steps: [`r = \\dfrac{${nomSuite}(${q}) - ${nomSuite}(${p})}{${q} - ${p}} = \\dfrac{${uq} - (${up})}{${q - p}} = ${r}`],
  };
}

// ---------- 13. Écrire l'expression explicite depuis le premier terme et la raison ----------
function genEcrireExpressionExpliciteQCM() {
  const nomSuite = pick(["u", "v", "w"]);
  const r = nonZero(-9, 9);
  const u0 = randInt(-15, 15);
  const bonneReponse = `${nomSuite}(n) = ${texSuiteExplicite(r, u0)}`;
  const candidats = [
    `${nomSuite}(n) = ${texSuiteExplicite(-r, u0)}`,
    `${nomSuite}(n) = ${texSuiteExplicite(r, -u0 || nonZero(-15, 15))}`,
    `${nomSuite}(n) = ${texSuiteExplicite(r, u0 + nonZero(1, 5))}`,
  ];
  const optionsSet = new Set([bonneReponse]);
  for (const c of candidats) {
    if (optionsSet.size >= 3) break;
    optionsSet.add(c);
  }
  return {
    type: "qcm",
    chapter: "Croissance linéaire — Suites arithmétiques",
    prompt: `Une suite arithmétique ${nomSuite} a pour premier terme \\(${nomSuite}(0) = ${u0}\\) et pour raison \\(r = ${r}\\). Quelle est son expression explicite ?`,
    answer: bonneReponse,
    options: shuffle([...optionsSet]),
    steps: [`${nomSuite}(n) = r \\times n + ${nomSuite}(0) = ${texSuiteExplicite(r, u0)}`],
  };
}

// ---------- 14. Vrai ou faux sur les suites arithmétiques ----------
function genVraiFauxSuitesQCM() {
  const cas = pick([
    { description: "Une suite arithmétique de raison nulle est constante.", reponse: "Vrai" },
    { description: "Pour une suite arithmétique, la différence entre deux termes consécutifs est toujours la même.", reponse: "Vrai" },
    { description: "Une suite arithmétique de raison négative est croissante.", reponse: "Faux" },
    { description: "Pour calculer un terme d'une suite arithmétique, il est toujours nécessaire de calculer tous les termes précédents un par un.", reponse: "Faux" },
    { description: "Une suite arithmétique modélise une situation où la quantité augmente (ou diminue) toujours de la même valeur à chaque étape.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Croissance linéaire — Suites arithmétiques",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 15. Lecture graphique d'une fonction affine (image) ----------
function genLectureGraphiqueImageNumeric() {
  const m = nonZero(-5, 5);
  const p = randInt(-8, 8);
  const x = randInt(-6, 6);
  const answer = m * x + p;
  return {
    type: "numeric",
    chapter: "Croissance linéaire — Fonctions affines",
    prompt: `Un phénomène continu à croissance linéaire est représenté par une droite d'équation \\(f(x) = ${texSuiteExplicite(m, p).replace("n", "x")}\\). Calcule \\(f(${x})\\).`,
    answer,
    steps: [`f(${x}) = ${m} \\times ${x} ${p >= 0 ? "+" : "-"} ${Math.abs(p)} = ${answer}`],
  };
}

const GENERATORS = [
  genSigneRaisonQCM,
  genRaisonDepuisDeuxTermesNumeric,
  genTermeSuivantRecurrenceNumeric,
  genTermeExpressionExpliciteNumeric,
  genPremierTermeDepuisRaisonNumeric,
  genResoudreInequationSeuilNumeric,
  genModeliserRaisonContexteNumeric,
  genModeliserCalculerTermeNumeric,
  genModeliserResoudreInequationNumeric,
  genCoefficientDirecteurDeuxPointsNumeric,
  genDiscretOuContinuQCM,
  genRaisonDepuisDeuxTermesNonConsecutifsNumeric,
  genEcrireExpressionExpliciteQCM,
  genVraiFauxSuitesQCM,
  genLectureGraphiqueImageNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "croissance-lineaire-premiere-non-spe",
    title: "Croissance linéaire",
    description: "Suites arithmétiques (raison, expression explicite, récurrence, résolution d'inéquations), modélisation de situations discrètes, fonctions affines et phénomènes continus à croissance linéaire.",
    level: "premiere-non-spe",
    free: false,
    order: 4,
  },
  generate,
};
