// ---------------------------------------------------------------------------
// Chapitre : Probabilités (2nde) — sous abonnement.
//
// NOTE (audit programme 2026, 4.4 / 5.4) : le programme 2026 supprime le volet
// formel « échantillonnage » (fréquence observée dans un échantillon, nombre
// de succès attendu, simulation) de la classe de 2nde. Les générateurs
// genFrequenceEchantillonNumeric et genNombreAttenduEchantillonNumeric ont
// donc été retirés. Seul l'énoncé qualitatif de la loi des grands nombres
// (la fréquence observée se rapproche de la probabilité théorique quand la
// taille de l'échantillon augmente) reste explicitement au programme ; il est
// conservé via genLoiGrandsNombresQCM. Le chapitre a été renommé
// « Probabilités » (au lieu de « Probabilités et échantillonnage »).
//
// NOTE (audit programme 2026, 3.5) : ajout des probabilités conditionnelles
// P_A(B) à partir d'un tableau croisé d'effectifs ou d'un arbre pondéré, avec
// la distinction entre P_A(B) et P_B(A) (contexte test de dépistage / faux
// positif), qui est un ajout du programme 2026 en 2nde.
//
// Correspond au chapitre 11 du manuel de 2nde : modèle équiprobable, calcul
// d'une probabilité (issues favorables / issues possibles), événement
// contraire, réunion de deux événements, univers d'une expérience à deux
// épreuves (somme et produit de deux dés), types d'événements (certain,
// impossible, élémentaire), tirage dans un jeu de cartes, distinction entre
// modèle équiprobable et étude statistique, probabilités conditionnelles.
// La correction du livre du professeur (exercices 18-42 : probabilités
// équiprobables, dés, cartes, types d'événements, modèles) a servi à
// identifier la méthode ; les nombres et contextes sont générés
// aléatoirement à chaque tirage.
// Voir automatismes-seconde.js (thème "probabilites-echantillonnage-seconde")
// pour les mini-exercices "Calcul mental" associés.
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

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

// ---------- 1. Probabilité dans un modèle équiprobable ----------
function genProbabiliteEquiprobableNumeric() {
  const total = randInt(10, 30);
  const favorables = randInt(1, total - 1);
  const g = gcd(favorables, total);
  const num = favorables / g;
  const den = total / g;
  return {
    type: "numeric",
    chapter: "Probabilités — Modèle équiprobable",
    prompt: `Une urne contient ${total} boules indiscernables au toucher, dont ${favorables} boules rouges. On tire une boule au hasard. Donne la probabilité d'obtenir une boule rouge sous forme décimale (arrondie au centième si besoin).`,
    answer: roundTo(favorables / total, 2),
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Dans un modèle équiprobable, } P = \\dfrac{\\text{nombre d'issues favorables}}{\\text{nombre d'issues possibles}}.` },
      { type: "resultat", text: `P = \\dfrac{${favorables}}{${total}} = \\dfrac{${num}}{${den}} \\approx ${roundTo(favorables / total, 2)}` },
    ],
  };
}

// ---------- 2. Événement contraire ----------
function genProbabiliteContraireNumeric() {
  const den = pick([4, 5, 8, 10, 20, 25, 50, 100]);
  const num = randInt(1, den - 1);
  const pA = num / den;
  return {
    type: "numeric",
    chapter: "Probabilités — Événement contraire",
    prompt: `On a \\(P(A) = \\dfrac{${num}}{${den}}\\). Calcule \\(P(\\bar{A})\\) (probabilité de l'événement contraire), sous forme décimale.`,
    answer: roundTo(1 - pA, 4),
    steps: [
      { type: "regle", text: `\\text{L'événement contraire } \\bar{A} \\text{ regroupe toutes les issues qui ne réalisent pas } A, \\text{ donc } P(\\bar{A}) = 1 - P(A).` },
      { type: "resultat", text: `P(\\bar{A}) = 1 - \\dfrac{${num}}{${den}} = \\dfrac{${den - num}}{${den}} = ${roundTo(1 - pA, 4)}` },
    ],
  };
}

// ---------- 3. Réunion de deux événements ----------
function genProbabiliteReunionNumeric() {
  const total = randInt(20, 40);
  const nA = randInt(4, 12);
  const nB = randInt(4, 12);
  const nAetB = randInt(1, Math.min(nA, nB));
  const nAouB = nA + nB - nAetB;
  return {
    type: "numeric",
    chapter: "Probabilités — Réunion d'événements",
    prompt: `Dans un univers de ${total} issues équiprobables, un événement A regroupe ${nA} issues, un événement B regroupe ${nB} issues, et A ∩ B (les deux à la fois) regroupe ${nAetB} issues. Combien d'issues regroupe A ∪ B (A ou B) ?`,
    answer: nAouB,
    steps: [
      { type: "regle", text: `\\text{card}(A \\cup B) = \\text{card}(A) + \\text{card}(B) - \\text{card}(A \\cap B) : \\text{ on soustrait l'intersection car ses issues auraient sinon été comptées deux fois.}` },
      { type: "resultat", text: `\\text{card}(A \\cup B) = ${nA} + ${nB} - ${nAetB} = ${nAouB}` },
    ],
  };
}

// ---------- 4. Univers d'une expérience à deux épreuves ----------
function genUniversDeuxEpreuvesQCM() {
  const cas = pick([
    { description: "On lance deux fois une pièce de monnaie.", reponse: 4, distracteurs: [2, 6, 8] },
    { description: "On lance deux dés à 6 faces (dés distinguables).", reponse: 36, distracteurs: [12, 6, 18] },
    { description: "On lance un dé à 6 faces puis on lance une pièce de monnaie.", reponse: 12, distracteurs: [6, 8, 36] },
    { description: "On tire une carte dans un jeu de 32 cartes puis on lance une pièce de monnaie.", reponse: 64, distracteurs: [32, 16, 96] },
    { description: "On lance trois fois une pièce de monnaie.", reponse: 8, distracteurs: [6, 4, 9] },
  ]);
  return {
    type: "qcm",
    chapter: "Probabilités — Univers d'une expérience",
    prompt: `${cas.description} Combien cette expérience a-t-elle d'issues possibles ?`,
    answer: String(cas.reponse),
    options: shuffle([cas.reponse, ...cas.distracteurs]).map(String),
    steps: [
      { type: "regle", text: `\\text{Pour une expérience à deux épreuves successives, le nombre total d'issues est le } \\textbf{produit} \\text{ du nombre d'issues de chaque épreuve (principe multiplicatif).}` },
      { type: "resultat", text: `\\text{Nombre d'issues} = ${cas.reponse}` },
    ],
  };
}

// ---------- 5. Probabilité de la somme de deux dés ----------
function genProbabiliteSommeDeuxDesNumeric() {
  const sommeCible = randInt(2, 12);
  let favorables = 0;
  for (let d1 = 1; d1 <= 6; d1++) {
    for (let d2 = 1; d2 <= 6; d2++) {
      if (d1 + d2 === sommeCible) favorables++;
    }
  }
  const g = gcd(favorables, 36) || 36;
  return {
    type: "numeric",
    chapter: "Probabilités — Lancer de deux dés",
    prompt: `On lance deux dés équilibrés à 6 faces (dés distinguables) et on note la somme des deux résultats. Quelle est la probabilité d'obtenir une somme égale à ${sommeCible}, sous forme décimale (arrondie au centième) ?`,
    answer: roundTo(favorables / 36, 2),
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Avec deux dés distinguables, l'univers compte } 6 \\times 6 = 36 \\text{ issues équiprobables. On dénombre celles dont la somme vaut } ${sommeCible}.` },
      { type: "calcul", text: `\\text{Nombre d'issues favorables} = ${favorables}` },
      { type: "resultat", text: `P = \\dfrac{${favorables}}{36} \\approx ${roundTo(favorables / 36, 2)}` },
    ],
  };
}

// ---------- 6. Probabilité du produit de deux dés ----------
function genProbabiliteProduitDeuxDesNumeric() {
  const produitsPossibles = new Set();
  const comptes = {};
  for (let d1 = 1; d1 <= 6; d1++) {
    for (let d2 = 1; d2 <= 6; d2++) {
      const p = d1 * d2;
      produitsPossibles.add(p);
      comptes[p] = (comptes[p] || 0) + 1;
    }
  }
  const produitCible = pick([...produitsPossibles]);
  const favorables = comptes[produitCible];
  return {
    type: "numeric",
    chapter: "Probabilités — Lancer de deux dés",
    prompt: `On lance deux dés équilibrés à 6 faces (dés distinguables) et on note le produit des deux résultats. Quelle est la probabilité d'obtenir un produit égal à ${produitCible}, sous forme décimale (arrondie au centième) ?`,
    answer: roundTo(favorables / 36, 2),
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Avec deux dés distinguables, l'univers compte } 6 \\times 6 = 36 \\text{ issues équiprobables. On dénombre celles dont le produit vaut } ${produitCible}.` },
      { type: "calcul", text: `\\text{Nombre d'issues favorables} = ${favorables}` },
      { type: "resultat", text: `P = \\dfrac{${favorables}}{36} \\approx ${roundTo(favorables / 36, 2)}` },
    ],
  };
}

// ---------- 7. Type d'événement (certain, impossible, élémentaire, non élémentaire) ----------
function genTypeEvenementQCM() {
  const cas = pick([
    {
      description: "On lance un dé à 6 faces. Événement : « obtenir un nombre entre 1 et 6 ».",
      reponse: "certain",
      explication: `\\text{Toutes les issues possibles (1, 2, 3, 4, 5, 6) réalisent cet événement : il se produit forcément, c'est un événement } \\textbf{certain}.`,
    },
    {
      description: "On lance un dé à 6 faces. Événement : « obtenir 7 ».",
      reponse: "impossible",
      explication: `\\text{Aucune face du dé ne porte le nombre 7 : cet événement ne peut jamais se produire, c'est un événement } \\textbf{impossible}.`,
    },
    {
      description: "On lance un dé à 6 faces. Événement : « obtenir 4 ».",
      reponse: "élémentaire",
      explication: `\\text{Cet événement ne correspond qu'à une seule issue possible (le 4) : c'est un événement } \\textbf{élémentaire}.`,
    },
    {
      description: "On lance un dé à 6 faces. Événement : « obtenir un nombre pair ».",
      reponse: "non élémentaire",
      explication: `\\text{Cet événement regroupe plusieurs issues (2, 4, 6) : c'est un événement } \\textbf{non élémentaire}.`,
    },
    {
      description: "On tire une carte dans un jeu de 32 cartes. Événement : « tirer une carte rouge ou noire ».",
      reponse: "certain",
      explication: `\\text{Toute carte est soit rouge, soit noire : cet événement regroupe toutes les issues possibles, c'est un événement } \\textbf{certain}.`,
    },
    {
      description: "On tire une carte dans un jeu de 32 cartes. Événement : « tirer un 2 ».",
      reponse: "impossible",
      explication: `\\text{Un jeu de 32 cartes ne contient aucun 2 (les cartes vont de 7 à l'as) : cet événement ne peut jamais se produire, c'est un événement } \\textbf{impossible}.`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Probabilités — Types d'événements",
    prompt: `${cas.description} Quel type d'événement est-ce ?`,
    answer: cas.reponse,
    options: ["certain", "impossible", "élémentaire", "non élémentaire"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 8. Probabilité de tirage dans un jeu de cartes ----------
function genProbabiliteTirageCartesQCM() {
  const jeu32 = Math.random() < 0.5;
  const total = jeu32 ? 32 : 52;
  const cas = jeu32
    ? pick([
        { description: "tirer un cœur", favorables: 8 },
        { description: "tirer une figure (valet, dame, roi)", favorables: 12 },
        { description: "tirer un as", favorables: 4 },
        { description: "tirer une carte rouge", favorables: 16 },
      ])
    : pick([
        { description: "tirer un cœur", favorables: 13 },
        { description: "tirer une figure (valet, dame, roi)", favorables: 12 },
        { description: "tirer un as", favorables: 4 },
        { description: "tirer une carte noire", favorables: 26 },
      ]);
  const g = gcd(cas.favorables, total);
  const bonneReponse = `${cas.favorables / g}/${total / g}`;
  const mauvaise1 = `${cas.favorables + 1}/${total}`;
  const mauvaise2 = `${total - cas.favorables}/${total}`;
  const optionsSet = new Set([bonneReponse, mauvaise1]);
  if (optionsSet.size < 3) optionsSet.add(`${cas.favorables}/${total + 4}`);
  else optionsSet.add(mauvaise2);
  return {
    type: "qcm",
    chapter: "Probabilités — Tirage de cartes",
    prompt: `On tire une carte au hasard dans un jeu de ${total} cartes. Quelle est la probabilité de ${cas.description} ?`,
    answer: bonneReponse,
    options: shuffle([...optionsSet]),
    steps: [
      { type: "regle", text: `\\text{Dans un jeu de cartes bien mélangé, chaque carte a la même chance d'être tirée : } P = \\dfrac{\\text{nombre de cartes favorables}}{\\text{nombre total de cartes}}.` },
      { type: "resultat", text: `P = \\dfrac{${cas.favorables}}{${total}} = \\dfrac{${cas.favorables / g}}{${total / g}}` },
    ],
  };
}

// ---------- 9. Probabilité depuis un tableau d'effectifs (boules colorées et numérotées) ----------
function genProbabiliteTableauEffectifsNumeric() {
  const couleurs = ["rouges", "bleues", "vertes"];
  const effectifs = couleurs.map(() => randInt(2, 8));
  const total = effectifs.reduce((a, b) => a + b, 0);
  const idx = randInt(0, couleurs.length - 1);
  return {
    type: "numeric",
    chapter: "Probabilités — Modèle équiprobable",
    prompt: `Une urne contient ${effectifs.map((e, i) => `${e} boules ${couleurs[i]}`).join(", ")}, indiscernables au toucher. On tire une boule au hasard. Quelle est la probabilité de tirer une boule ${couleurs[idx]}, sous forme décimale (arrondie au centième) ?`,
    answer: roundTo(effectifs[idx] / total, 2),
    tolerance: 0.01,
    steps: [
      { type: "calcul", text: `\\text{Total} = ${effectifs.join(" + ")} = ${total}` },
      { type: "resultat", text: `P = \\dfrac{${effectifs[idx]}}{${total}} \\approx ${roundTo(effectifs[idx] / total, 2)}` },
    ],
  };
}

// ---------- 10. Modèle équiprobable ou étude statistique ? ----------
function genModeliserExperienceQCM() {
  const cas = pick([
    { description: "Lancer un dé équilibré et regarder le résultat.", reponse: "modèle équiprobable" },
    { description: "L'heure d'arrivée d'un train, sujette aux aléas du trafic.", reponse: "étude statistique" },
    { description: "Tirer une carte au hasard dans un jeu de cartes bien mélangé.", reponse: "modèle équiprobable" },
    { description: "Le nombre de trèfles à quatre feuilles trouvés dans un pré.", reponse: "étude statistique" },
    { description: "Composer un code à 4 chiffres au hasard.", reponse: "modèle équiprobable" },
    { description: "Le temps qu'il fera demain.", reponse: "étude statistique" },
  ]);
  return {
    type: "qcm",
    chapter: "Probabilités — Modéliser une expérience",
    prompt: `« ${cas.description} » Faut-il se baser sur un modèle équiprobable ou sur une étude statistique pour modéliser cette situation ?`,
    answer: cas.reponse,
    options: ["modèle équiprobable", "étude statistique"],
    steps: [
      {
        type: "regle",
        text:
          cas.reponse === "modèle équiprobable"
            ? `\\text{Toutes les issues ont la même chance de se produire et sont dénombrables : on peut utiliser un modèle équiprobable.}`
            : `\\text{La situation dépend de facteurs non contrôlés (hasard réel, non symétrique) : il faut se baser sur une étude statistique (observations répétées).}`,
      },
    ],
  };
}

// ---------- 11. Probabilité conditionnelle depuis un tableau croisé ----------
const contextesConditionnelle = [
  { nomA: "malades", nomNonA: "non malades", nomB: "testés positifs", nomNonB: "testés négatifs", sujet: "patients", contexte: "un test de dépistage" },
  { nomA: "spams", nomNonA: "non spams", nomB: "contenant le mot gratuit", nomNonB: "ne contenant pas ce mot", sujet: "emails", contexte: "un filtre anti-spam" },
  { nomA: "défectueuses", nomNonA: "conformes", nomB: "détectées par le contrôle", nomNonB: "non détectées", sujet: "pièces", contexte: "un contrôle qualité en usine" },
];

function genProbabiliteConditionnelleTableauNumeric() {
  const ctx = pick(contextesConditionnelle);
  const nA = randInt(20, 40);
  const nNonA = randInt(60, 150);
  const total = nA + nNonA;
  const nAetB = randInt(1, nA - 1);
  const nAetNonB = nA - nAetB;
  const nNonAetB = randInt(1, nNonA - 1);
  const nNonAetNonB = nNonA - nNonAetB;
  const nB = nAetB + nNonAetB;
  const nNonB = nAetNonB + nNonAetNonB;

  const tableTex = texTable([
    ["", `\\text{${ctx.nomB}}`, `\\text{${ctx.nomNonB}}`, "\\text{Total}"],
    [`${ctx.nomA[0].toUpperCase()}${ctx.nomA.slice(1)}`, String(nAetB), String(nAetNonB), String(nA)],
    [`${ctx.nomNonA[0].toUpperCase()}${ctx.nomNonA.slice(1)}`, String(nNonAetB), String(nNonAetNonB), String(nNonA)],
    ["Total", String(nB), String(nNonB), String(total)],
  ]);

  return {
    type: "numeric",
    chapter: "Probabilités — Probabilités conditionnelles",
    prompt: `On étudie ${ctx.contexte} sur un groupe de ${total} ${ctx.sujet}, répartis selon le tableau croisé suivant : ${tableTex} On note A l'événement « être ${ctx.nomA} ». Parmi les ${ctx.sujet} ${ctx.nomA}, quelle est la proportion de ceux ${ctx.nomB} ? Donne le résultat sous forme décimale (arrondie au centième). C'est la probabilité conditionnelle notée \\(P_A(B)\\).`,
    answer: roundTo(nAetB / nA, 2),
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{La probabilité conditionnelle } P_A(B) \\text{ se calcule en se restreignant aux } \\textbf{${nA} ${ctx.sujet} ${ctx.nomA}} \\text{ (ligne A du tableau), puis en regardant la proportion de ceux qui sont } ${ctx.nomB}.` },
      { type: "resultat", text: `P_A(B) = \\dfrac{${nAetB}}{${nA}} \\approx ${roundTo(nAetB / nA, 2)}` },
    ],
  };
}

// ---------- 12. Probabilité conditionnelle via un arbre pondéré (probabilité d'une intersection) ----------
function genProbabiliteConditionnelleArbreNumeric() {
  const ctx = pick(contextesConditionnelle);
  const denA = pick([4, 5, 10, 20]);
  const numA = randInt(1, denA - 1);
  const pA = numA / denA;
  const denB = pick([4, 5, 10]);
  const numB = randInt(1, denB - 1);
  const pAB = numB / denB;
  const produit = roundTo(pA * pAB, 4);
  return {
    type: "numeric",
    chapter: "Probabilités — Probabilités conditionnelles",
    prompt: `On étudie ${ctx.contexte}. On sait que \\(P(A) = ${fr(pA)}\\) (proportion de ${ctx.sujet} ${ctx.nomA}) et que \\(P_A(B) = ${fr(pAB)}\\) (parmi les ${ctx.nomA}, proportion de ceux ${ctx.nomB}). En utilisant un arbre pondéré, calcule \\(P(A \\cap B)\\), sous forme décimale.`,
    answer: produit,
    steps: [
      { type: "regle", text: `\\text{Sur un arbre pondéré, la probabilité d'un chemin s'obtient en } \\textbf{multipliant} \\text{ les probabilités rencontrées : } P(A \\cap B) = P(A) \\times P_A(B).` },
      { type: "resultat", text: `P(A \\cap B) = ${fr(pA)} \\times ${fr(pAB)} = ${fr(produit)}` },
    ],
  };
}

// ---------- 13. Distinguer P_A(B) et P_B(A) (contexte dépistage / faux positif) ----------
function genDistinguerPAvBQCM() {
  const cas = pick([
    {
      enonce: "un test de dépistage d'une maladie",
      A: "être malade",
      B: "être testé positif",
      question: "la probabilité qu'un patient testé positif soit réellement malade (risque de faux positif)",
      reponse: "\\(P_B(A)\\)",
      explication: `\\text{On se restreint aux patients } \\textbf{testés positifs} \\text{ (événement B déjà réalisé) et on regarde la proportion de malades parmi eux : c'est } P_B(A), \\text{ pas } P_A(B).`,
    },
    {
      enonce: "un test de dépistage d'une maladie",
      A: "être malade",
      B: "être testé positif",
      question: "la probabilité qu'un patient malade soit détecté par le test (sensibilité du test)",
      reponse: "\\(P_A(B)\\)",
      explication: `\\text{On se restreint aux patients } \\textbf{malades} \\text{ (événement A déjà réalisé) et on regarde la proportion de tests positifs parmi eux : c'est } P_A(B), \\text{ pas } P_B(A).`,
    },
    {
      enonce: "un filtre anti-spam",
      A: "être un spam",
      B: "contenir le mot « gratuit »",
      question: "la probabilité qu'un email contenant le mot « gratuit » soit un spam",
      reponse: "\\(P_B(A)\\)",
      explication: `\\text{On se restreint aux emails } \\textbf{contenant le mot « gratuit »} \\text{ (événement B déjà réalisé) et on regarde la proportion de spams parmi eux : c'est } P_B(A), \\text{ pas } P_A(B).`,
    },
    {
      enonce: "un filtre anti-spam",
      A: "être un spam",
      B: "contenir le mot « gratuit »",
      question: "la probabilité qu'un spam contienne le mot « gratuit »",
      reponse: "\\(P_A(B)\\)",
      explication: `\\text{On se restreint aux emails } \\textbf{qui sont des spams} \\text{ (événement A déjà réalisé) et on regarde la proportion de ceux contenant « gratuit » parmi eux : c'est } P_A(B), \\text{ pas } P_B(A).`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Probabilités — Probabilités conditionnelles",
    prompt: `On étudie ${cas.enonce}. On note A l'événement « ${cas.A} » et B l'événement « ${cas.B} ». Quelle notation représente ${cas.question} ?`,
    answer: cas.reponse,
    options: ["P_A(B)", "P_B(A)"].map((s) => s),
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 14. Loi des grands nombres (rapprochement fréquence / probabilité) ----------
function genLoiGrandsNombresQCM() {
  return {
    type: "qcm",
    chapter: "Probabilités — Loi des grands nombres",
    prompt: `Lorsque la taille d'un échantillon augmente, que peut-on généralement observer concernant la fréquence observée d'un événement par rapport à sa probabilité théorique ?`,
    answer: "La fréquence observée se rapproche de la probabilité théorique",
    options: ["La fréquence observée se rapproche de la probabilité théorique", "La fréquence observée s'éloigne de la probabilité théorique", "La fréquence observée reste constante quelle que soit la taille"],
    steps: [{ type: "regle", text: `\\text{C'est la loi des grands nombres : plus l'échantillon est grand, plus la fréquence observée tend à se rapprocher de la probabilité théorique.}` }],
  };
}

// ---------- 14. Vrai ou faux sur les probabilités ----------
function genVraiFauxProbabiliteQCM() {
  const cas = pick([
    {
      affirmation: "Une probabilité est toujours comprise entre 0 et 1.",
      reponse: "Vrai",
      explication: `\\text{Par définition, une probabilité vaut } 0 \\text{ (jamais) au minimum et } 1 \\text{ (toujours) au maximum : elle est donc toujours dans l'intervalle } [0 ; 1].`,
    },
    {
      affirmation: "La somme des probabilités de toutes les issues d'un univers vaut toujours 1.",
      reponse: "Vrai",
      explication: `\\text{L'univers regroupe toutes les issues possibles : l'une d'elles se réalise nécessairement, donc la somme de leurs probabilités vaut } 1.`,
    },
    {
      affirmation: "Une probabilité peut être négative.",
      reponse: "Faux",
      explication: `\\text{Une probabilité est toujours comprise entre 0 et 1 : elle ne peut jamais être négative.}`,
    },
    {
      affirmation: "Si un événement est impossible, sa probabilité vaut 1.",
      reponse: "Faux",
      explication: `\\text{Un événement impossible ne se réalise jamais : sa probabilité vaut } 0, \\text{ pas } 1.`,
    },
    {
      affirmation: "Si un événement est certain, sa probabilité vaut 1.",
      reponse: "Vrai",
      explication: `\\text{Un événement certain se réalise à chaque fois : sa probabilité vaut bien } 1.`,
    },
    {
      affirmation: "P(A) + P(non A) = 1 pour tout événement A.",
      reponse: "Vrai",
      explication: `\\text{A et son événement contraire (non A) recouvrent à eux deux tout l'univers sans se chevaucher, donc } P(A) + P(\\bar{A}) = 1.`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Probabilités — Propriétés",
    prompt: `Affirmation : « ${cas.affirmation} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 15. Probabilité de ne pas obtenir un double (dominos, complémentaire) ----------
function genProbabiliteComplementaireContexteNumeric() {
  const total = pick([28, 36, 15, 20, 25]);
  const favorables = pick([...Array(Math.min(10, total - 1)).keys()].map((x) => x + 1));
  const g = gcd(favorables, total);
  return {
    type: "numeric",
    chapter: "Probabilités — Événement contraire",
    prompt: `Dans un jeu de dominos, il y a ${total} dominos au total, dont ${favorables} sont des « doubles ». On choisit un domino au hasard. Quelle est la probabilité de ne PAS obtenir un double, sous forme décimale (arrondie au centième) ?`,
    answer: roundTo((total - favorables) / total, 2),
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{« Ne pas obtenir un double » est l'événement contraire de « obtenir un double » : } P(\\text{pas de double}) = 1 - P(\\text{double}).` },
      { type: "calcul", text: `P(\\text{double}) = \\dfrac{${favorables}}{${total}}` },
      { type: "resultat", text: `P(\\text{pas de double}) = 1 - \\dfrac{${favorables}}{${total}} = \\dfrac{${total - favorables}}{${total}} \\approx ${roundTo((total - favorables) / total, 2)}` },
    ],
  };
}

const GENERATORS = [
  genProbabiliteEquiprobableNumeric,
  genProbabiliteContraireNumeric,
  genProbabiliteReunionNumeric,
  genUniversDeuxEpreuvesQCM,
  genProbabiliteSommeDeuxDesNumeric,
  genProbabiliteProduitDeuxDesNumeric,
  genTypeEvenementQCM,
  genProbabiliteTirageCartesQCM,
  genProbabiliteTableauEffectifsNumeric,
  genModeliserExperienceQCM,
  genProbabiliteConditionnelleTableauNumeric,
  genProbabiliteConditionnelleArbreNumeric,
  genDistinguerPAvBQCM,
  genLoiGrandsNombresQCM,
  genVraiFauxProbabiliteQCM,
  genProbabiliteComplementaireContexteNumeric,
];

const DIFFICULTY = {
  genProbabiliteEquiprobableNumeric: "facile",
  genProbabiliteContraireNumeric: "facile",
  genTypeEvenementQCM: "facile",
  genProbabiliteReunionNumeric: "standard",
  genUniversDeuxEpreuvesQCM: "standard",
  genProbabiliteTirageCartesQCM: "standard",
  genProbabiliteTableauEffectifsNumeric: "standard",
  genModeliserExperienceQCM: "standard",
  genLoiGrandsNombresQCM: "standard",
  genVraiFauxProbabiliteQCM: "standard",
  genDistinguerPAvBQCM: "standard",
  genProbabiliteSommeDeuxDesNumeric: "expert",
  genProbabiliteProduitDeuxDesNumeric: "expert",
  genProbabiliteComplementaireContexteNumeric: "expert",
  genProbabiliteConditionnelleTableauNumeric: "expert",
  genProbabiliteConditionnelleArbreNumeric: "expert",
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
    id: "probabilites-echantillonnage-seconde",
    title: "Probabilités",
    description: "Modèle équiprobable, événement contraire, réunion d'événements, univers d'une expérience, lancers de dés, tirages de cartes, types d'événements, probabilités conditionnelles (tableau croisé, arbre pondéré).",
    pourquoi: "Comprendre le hasard et l'équiprobabilité, c'est la base pour interpréter un sondage, un jeu ou un tirage au sort.",
    level: "seconde",
    free: false,
    order: 13,
    cours: {
      mindMap: {
        title: "Probabilités",
        branches: [
          {
            title: "Vocabulaire des événements",
            items: [
              "Événement certain : regroupe toutes les issues (probabilité 1). Événement impossible : ne regroupe aucune issue (probabilité 0). Événement élémentaire : ne correspond qu'à une seule issue de l'univers.",
              "Une probabilité est toujours un nombre entre 0 et 1 ; la somme des probabilités de toutes les issues d'un univers vaut toujours 1.",
            ],
          },
          {
            title: "Modèle équiprobable",
            items: [
              "Si toutes les issues ont la même chance de se produire, chaque probabilité vaut (nombre d'issues favorables) / (nombre d'issues possibles).",
              "On utilise un modèle équiprobable quand les issues sont symétriques et dénombrables (dé, pièce, carte) ; sinon (phénomène réel non contrôlé), on se base sur une étude statistique (fréquences observées).",
            ],
            formula: "\\(P(E) = \\dfrac{\\text{nb issues favorables}}{\\text{nb issues possibles}}\\)",
          },
          {
            title: "Événement contraire et réunion",
            items: [
              "\\(P(\\bar{E}) = 1 - P(E)\\) : utile quand « au moins un » est plus simple à compter en négatif.",
              "\\(P(A \\cup B) = P(A)+P(B)-P(A \\cap B)\\) : on retire l'intersection comptée deux fois.",
            ],
          },
          {
            title: "Univers à deux épreuves",
            items: [
              "Pour une expérience à deux épreuves successives, le nombre total d'issues est le produit du nombre d'issues de chaque épreuve (principe multiplicatif).",
              "Lister toutes les issues possibles (souvent en tableau double entrée) avant de compter les cas favorables.",
              "Piège classique : pour la somme de deux dés, les issues ne sont pas équiprobables (plus de façons d'obtenir 7 que 2).",
            ],
            formula: "\\(\\text{card}(\\text{univers}) = \\text{nb issues épreuve 1} \\times \\text{nb issues épreuve 2}\\)",
          },
          {
            title: "Probabilités conditionnelles",
            items: [
              "\\(P_A(B)\\) : probabilité de B sachant que A est déjà réalisé, lue dans la ligne/colonne A d'un tableau croisé.",
              "Sur un arbre pondéré, la probabilité d'un chemin s'obtient en multipliant les probabilités rencontrées : \\(P(A \\cap B) = P(A) \\times P_A(B)\\).",
              "Piège classique très fréquent : \\(P_A(B) \\neq P_B(A)\\) (ex : probabilité d'être malade sachant le test positif ≠ probabilité d'avoir un test positif sachant malade).",
            ],
          },
          {
            title: "Loi des grands nombres",
            items: [
              "Plus on répète une expérience aléatoire un grand nombre de fois, plus la fréquence observée d'un événement se rapproche de sa probabilité théorique.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
