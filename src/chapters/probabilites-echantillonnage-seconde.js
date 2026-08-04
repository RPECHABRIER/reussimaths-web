// ---------------------------------------------------------------------------
// Chapitre : Probabilités et échantillonnage (2nde) — sous abonnement.
//
// Correspond au chapitre 11 du manuel de 2nde : modèle équiprobable, calcul
// d'une probabilité (issues favorables / issues possibles), événement
// contraire, réunion de deux événements, univers d'une expérience à deux
// épreuves (somme et produit de deux dés), types d'événements (certain,
// impossible, élémentaire), tirage dans un jeu de cartes, distinction entre
// modèle équiprobable et étude statistique, fréquence observée dans un
// échantillon et rapprochement avec la probabilité théorique (loi des
// grands nombres, esprit du programme d'échantillonnage).
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

// ---------- 11. Fréquence observée dans un échantillon ----------
function genFrequenceEchantillonNumeric() {
  const taille = pick([20, 25, 40, 50, 80, 100, 200]);
  const succes = randInt(1, taille - 1);
  const g = gcd(succes, taille);
  return {
    type: "numeric",
    chapter: "Probabilités — Échantillonnage",
    prompt: `Dans un échantillon de ${taille} pièces produites par une usine, ${succes} sont défectueuses. Quelle est la fréquence de pièces défectueuses dans cet échantillon (sous forme décimale) ?`,
    answer: roundTo(succes / taille, 4),
    steps: [
      { type: "regle", text: `\\text{La fréquence observée dans un échantillon est } f = \\dfrac{\\text{effectif du caractère étudié}}{\\text{taille de l'échantillon}}.` },
      { type: "resultat", text: `f = \\dfrac{${succes}}{${taille}} = \\dfrac{${succes / g}}{${taille / g}} = ${roundTo(succes / taille, 4)}` },
    ],
  };
}

// ---------- 12. Nombre de succès attendu dans un échantillon (à partir d'une probabilité théorique) ----------
function genNombreAttenduEchantillonNumeric() {
  const [num, den, p] = pick([
    [1, 10, 0.1],
    [1, 5, 0.2],
    [1, 4, 0.25],
    [2, 5, 0.4],
    [1, 2, 0.5],
    [3, 5, 0.6],
    [3, 4, 0.75],
    [4, 5, 0.8],
  ]);
  const k = randInt(2, 20);
  const tailleFinale = den * k;
  const attendu = num * k;
  return {
    type: "numeric",
    chapter: "Probabilités — Échantillonnage",
    prompt: `Une expérience aléatoire a une probabilité de succès théorique de ${fr(p)}. Sur un échantillon de ${tailleFinale} répétitions, combien de succès peut-on espérer en moyenne ?`,
    answer: attendu,
    steps: [
      { type: "regle", text: `\\text{Le nombre de succès attendu en moyenne s'obtient en multipliant la taille de l'échantillon par la probabilité théorique de succès.}` },
      { type: "resultat", text: `${tailleFinale} \\times ${fr(p)} = ${attendu}` },
    ],
  };
}

// ---------- 13. Loi des grands nombres (rapprochement fréquence / probabilité) ----------
function genLoiGrandsNombresQCM() {
  return {
    type: "qcm",
    chapter: "Probabilités — Échantillonnage",
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
  genFrequenceEchantillonNumeric,
  genNombreAttenduEchantillonNumeric,
  genLoiGrandsNombresQCM,
  genVraiFauxProbabiliteQCM,
  genProbabiliteComplementaireContexteNumeric,
];

const DIFFICULTY = {
  genProbabiliteEquiprobableNumeric: "facile",
  genProbabiliteContraireNumeric: "facile",
  genTypeEvenementQCM: "facile",
  genFrequenceEchantillonNumeric: "facile",
  genProbabiliteReunionNumeric: "standard",
  genUniversDeuxEpreuvesQCM: "standard",
  genProbabiliteTirageCartesQCM: "standard",
  genProbabiliteTableauEffectifsNumeric: "standard",
  genModeliserExperienceQCM: "standard",
  genNombreAttenduEchantillonNumeric: "standard",
  genLoiGrandsNombresQCM: "standard",
  genVraiFauxProbabiliteQCM: "standard",
  genProbabiliteSommeDeuxDesNumeric: "expert",
  genProbabiliteProduitDeuxDesNumeric: "expert",
  genProbabiliteComplementaireContexteNumeric: "expert",
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
    title: "Probabilités et échantillonnage",
    description: "Modèle équiprobable, événement contraire, réunion d'événements, univers d'une expérience, lancers de dés, tirages de cartes, types d'événements, fréquence et échantillonnage.",
    pourquoi: "Comprendre le hasard et l'équiprobabilité, c'est la base pour interpréter un sondage, un jeu ou un tirage au sort.",
    level: "seconde",
    free: false,
    order: 13,
  },
  generate,
};
