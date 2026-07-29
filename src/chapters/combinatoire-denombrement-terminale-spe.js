// ---------------------------------------------------------------------------
// Chapitre : Combinatoire et dénombrement (Terminale, spécialité
// mathématiques) — sous abonnement.
//
// Correspond au chapitre 1 du programme de spécialité mathématiques de
// terminale : principe multiplicatif (produit cartésien de choix
// indépendants), dénombrement de tirages avec ou sans remise, avec ou sans
// ordre (n-uplets, arrangements, combinaisons), calcul de factorielles,
// calcul d'un coefficient binomial \\(\\binom{n}{k}\\) et ses propriétés
// (symétrie, relation de Pascal, cas particuliers), nombre de parties d'un
// ensemble à n éléments.
// La correction du livre du professeur (source .tex, exercices 7-15 de la
// section Auto-évaluation, qui reprend une méthode par question) a servi à
// identifier la méthode ; les nombres et contextes sont générés
// aléatoirement à chaque tirage.
// Voir automatismes-terminale-spe.js (thème
// "combinatoire-denombrement-terminale-spe") pour les mini-exercices
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

function factorielle(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function arrangement(n, k) {
  let r = 1;
  for (let i = 0; i < k; i++) r *= n - i;
  return r;
}

function combinaison(n, k) {
  if (k < 0 || k > n) return 0;
  return Math.round(arrangement(n, k) / factorielle(k));
}

// ---------- 1. Principe multiplicatif (produit de choix indépendants) ----------
function genPrincipeMultiplicatifNumeric() {
  const contexte = pick([
    { sujet: "entrées", choix1: randInt(3, 8), sujet2: "plats", choix2: randInt(3, 8), sujet3: "desserts", choix3: randInt(2, 6) },
  ]);
  const total = contexte.choix1 * contexte.choix2 * contexte.choix3;
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Principe multiplicatif",
    prompt: `Un restaurant propose ${contexte.choix1} ${contexte.sujet}, ${contexte.choix2} ${contexte.sujet2} et ${contexte.choix3} ${contexte.sujet3}. Combien de menus différents (une entrée, un plat et un dessert) peut-on composer ?`,
    answer: total,
    steps: [`${contexte.choix1} \\times ${contexte.choix2} \\times ${contexte.choix3} = ${total}`],
  };
}

// ---------- 2. Tirages avec remise et avec ordre (n-uplets) ----------
function genTirageAvecRemiseNumeric() {
  const n = randInt(4, 10);
  const k = randInt(2, 4);
  const answer = n ** k;
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Dénombrement de tirages",
    prompt: `On tire successivement ${k} fois une boule avec remise dans une urne contenant ${n} boules numérotées. Combien de tirages ordonnés différents peut-on obtenir ?`,
    answer,
    steps: [`${n}^{${k}} = ${answer}`],
  };
}

// ---------- 3. Tirages sans remise et avec ordre (arrangements) ----------
function genTirageSansRemiseAvecOrdreNumeric() {
  const n = randInt(5, 12);
  const k = randInt(2, 4);
  const answer = arrangement(n, k);
  const facteurs = Array.from({ length: k }, (_, i) => n - i).join(" \\times ");
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Dénombrement de tirages",
    prompt: `On tire successivement et sans remise ${k} cartes parmi ${n} cartes numérotées. Combien de tirages ordonnés différents peut-on obtenir ?`,
    answer,
    steps: [`${facteurs} = ${answer}`],
  };
}

// ---------- 4. Calcul d'une factorielle ----------
function genFactorielleNumeric() {
  const n = randInt(3, 8);
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Factorielles",
    prompt: `Calcule \\(${n}!\\)`,
    answer: factorielle(n),
    steps: [`${Array.from({ length: n }, (_, i) => i + 1).join(" \\times ")} = ${factorielle(n)}`],
  };
}

// ---------- 5. Calcul d'un coefficient binomial ----------
function genCoefficientBinomialNumeric() {
  const n = randInt(4, 12);
  const k = randInt(1, n - 1);
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Coefficients binomiaux",
    prompt: `Calcule \\(\\dbinom{${n}}{${k}}\\)`,
    answer: combinaison(n, k),
    steps: [`\\dbinom{${n}}{${k}} = \\dfrac{${n}!}{${k}!(${n}-${k})!} = ${combinaison(n, k)}`],
  };
}

// ---------- 6. Symétrie des coefficients binomiaux ----------
function genSymetrieCoefficientBinomialNumeric() {
  const n = randInt(5, 15);
  const k = randInt(1, n - 1);
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Coefficients binomiaux",
    prompt: `Sachant que \\(\\dbinom{${n}}{${k}} = ${combinaison(n, k)}\\), et que \\(\\dbinom{n}{k} = \\dbinom{n}{n-k}\\), donne la valeur de \\(\\dbinom{${n}}{${n - k}}\\).`,
    answer: combinaison(n, k),
    steps: [`\\dbinom{${n}}{${n - k}} = \\dbinom{${n}}{${k}} = ${combinaison(n, k)}`],
  };
}

// ---------- 7. Relation de Pascal ----------
function genRelationPascalNumeric() {
  const n = randInt(5, 14);
  const k = randInt(1, n - 2);
  const answer = combinaison(n + 1, k + 1);
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Coefficients binomiaux",
    prompt: `On sait que \\(\\dbinom{${n}}{${k}} = ${combinaison(n, k)}\\) et \\(\\dbinom{${n}}{${k + 1}} = ${combinaison(n, k + 1)}\\). En utilisant la relation de Pascal, calcule \\(\\dbinom{${n + 1}}{${k + 1}}\\).`,
    answer,
    steps: [`\\dbinom{${n + 1}}{${k + 1}} = \\dbinom{${n}}{${k}} + \\dbinom{${n}}{${k + 1}} = ${combinaison(n, k)} + ${combinaison(n, k + 1)} = ${answer}`],
  };
}

// ---------- 8. Nombre de parties (sous-ensembles) d'un ensemble à n éléments ----------
function genNombrePartiesEnsembleNumeric() {
  const n = randInt(3, 12);
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Parties d'un ensemble",
    prompt: `Combien un ensemble de ${n} éléments possède-t-il de parties (sous-ensembles), y compris l'ensemble vide et l'ensemble entier ?`,
    answer: 2 ** n,
    steps: [`2^{${n}} = ${2 ** n}`],
  };
}

// ---------- 9. Tirages sans remise et sans ordre (combinaisons) ----------
function genTirageSansRemiseSansOrdreNumeric() {
  const n = randInt(6, 15);
  const k = randInt(2, 5);
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Dénombrement de tirages",
    prompt: `On tire simultanément ${k} boules parmi ${n} boules numérotées (l'ordre n'a pas d'importance). Combien de tirages différents peut-on obtenir ?`,
    answer: combinaison(n, k),
    steps: [`\\dbinom{${n}}{${k}} = ${combinaison(n, k)}`],
  };
}

// ---------- 10. Identifier le type de tirage adapté (QCM) ----------
function genIdentifierTypeTirageQCM() {
  const cas = pick([
    { description: "On tire successivement 3 cartes d'un jeu, sans les remettre, et l'ordre du tirage compte pour former un code.", reponse: "Arrangement (sans remise, avec ordre)" },
    { description: "On choisit un comité de 3 personnes parmi 10 candidats (l'ordre de sélection n'a pas d'importance).", reponse: "Combinaison (sans remise, sans ordre)" },
    { description: "On compose un code à 4 chiffres, chaque chiffre pouvant être répété.", reponse: "n-uplet (avec remise, avec ordre)" },
  ]);
  return {
    type: "qcm",
    chapter: "Combinatoire et dénombrement — Dénombrement de tirages",
    prompt: `« ${cas.description} » Quel type de dénombrement correspond à cette situation ?`,
    answer: cas.reponse,
    options: ["Arrangement (sans remise, avec ordre)", "Combinaison (sans remise, sans ordre)", "n-uplet (avec remise, avec ordre)"],
    steps: [`\\text{Cette situation correspond à un(e) : ${cas.reponse}}`],
  };
}

// ---------- 11. Nombre de nombres pairs constructibles avec une contrainte ----------
function genNombresPairsContrainteNumeric() {
  const chiffresDisponibles = randInt(6, 9);
  // Chiffres pairs parmi {1, ..., chiffresDisponibles} : 2, 4, 6, 8, ...
  const nbChiffresPairs = Math.floor(chiffresDisponibles / 2);
  const answer = chiffresDisponibles * chiffresDisponibles * nbChiffresPairs;
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Applications",
    prompt: `On forme des nombres à 3 chiffres en utilisant les chiffres de 1 à ${chiffresDisponibles} (chaque chiffre peut être répété). Combien de ces nombres sont pairs ?`,
    answer,
    steps: [`\\text{Choix libres pour les deux premiers chiffres : } ${chiffresDisponibles} \\times ${chiffresDisponibles}`, `\\text{${nbChiffresPairs} choix possibles pour le dernier chiffre (les chiffres pairs entre 1 et ${chiffresDisponibles})}`, `${chiffresDisponibles} \\times ${chiffresDisponibles} \\times ${nbChiffresPairs} = ${answer}`],
  };
}

// ---------- 12. Vrai ou faux sur les propriétés des coefficients binomiaux ----------
function genVraiFauxBinomialQCM() {
  const cas = pick([
    { description: "Pour tout entier naturel n, \\binom{n}{0} = 1.", reponse: "Vrai" },
    { description: "Pour tout entier naturel n, \\binom{n}{n} = 1.", reponse: "Vrai" },
    { description: "Pour tout entier naturel n et tout k compris entre 0 et n, \\binom{n}{k} = \\binom{n}{n-k}.", reponse: "Vrai" },
    { description: "Le nombre de combinaisons est toujours supérieur au nombre d'arrangements correspondants.", reponse: "Faux" },
    { description: "n! croît strictement plus vite que n² lorsque n devient grand.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Combinatoire et dénombrement — Coefficients binomiaux",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 13. Cas particuliers des coefficients binomiaux ----------
function genCasParticuliersBinomialNumeric() {
  const n = randInt(4, 20);
  const cas = pick(["0", "n", "1"]);
  const k = cas === "0" ? 0 : cas === "n" ? n : 1;
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Coefficients binomiaux",
    prompt: `Calcule \\(\\dbinom{${n}}{${k}}\\)`,
    answer: combinaison(n, k),
    steps: [cas === "0" ? `\\dbinom{n}{0} = 1` : cas === "n" ? `\\dbinom{n}{n} = 1` : `\\dbinom{n}{1} = n = ${n}`],
  };
}

// ---------- 14. Dénombrement avec exclusion (combinaison sur un sous-ensemble restreint) ----------
function genDenombrementAvecExclusionNumeric() {
  const n = randInt(8, 15);
  const nbExclus = randInt(1, 3);
  const k = randInt(2, 4);
  const nRestant = n - nbExclus;
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Applications",
    prompt: `On dispose de ${n} boules numérotées de 1 à ${n}. On tire simultanément ${k} boules, en interdisant ${nbExclus === 1 ? "le numéro 1" : `les ${nbExclus} premiers numéros`}. Combien de tirages différents sont possibles ?`,
    answer: combinaison(nRestant, k),
    steps: [`\\text{Il reste } ${nRestant} \\text{ numéros autorisés.}`, `\\dbinom{${nRestant}}{${k}} = ${combinaison(nRestant, k)}`],
  };
}

// ---------- 15. Nombre d'anagrammes / permutations d'objets distincts ----------
function genPermutationsObjetsNumeric() {
  const n = randInt(3, 8);
  return {
    type: "numeric",
    chapter: "Combinatoire et dénombrement — Applications",
    prompt: `De combien de façons différentes peut-on ranger ${n} livres tous différents sur une étagère ?`,
    answer: factorielle(n),
    steps: [`${n}! = ${factorielle(n)}`],
  };
}

const GENERATORS = [
  genPrincipeMultiplicatifNumeric,
  genTirageAvecRemiseNumeric,
  genTirageSansRemiseAvecOrdreNumeric,
  genFactorielleNumeric,
  genCoefficientBinomialNumeric,
  genSymetrieCoefficientBinomialNumeric,
  genRelationPascalNumeric,
  genNombrePartiesEnsembleNumeric,
  genTirageSansRemiseSansOrdreNumeric,
  genIdentifierTypeTirageQCM,
  genNombresPairsContrainteNumeric,
  genVraiFauxBinomialQCM,
  genCasParticuliersBinomialNumeric,
  genDenombrementAvecExclusionNumeric,
  genPermutationsObjetsNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "combinatoire-denombrement-terminale-spe",
    title: "Combinatoire et dénombrement",
    description: "Principe multiplicatif, dénombrement de tirages (avec/sans remise, avec/sans ordre), factorielles, coefficients binomiaux et leurs propriétés (symétrie, relation de Pascal), nombre de parties d'un ensemble.",
    level: "terminale-spe",
    free: false,
    order: 2,
  },
  generate,
};
