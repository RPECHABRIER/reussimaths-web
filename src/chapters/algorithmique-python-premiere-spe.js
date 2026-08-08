// ---------------------------------------------------------------------------
// Chapitre : Algorithmique et programmation en Python (Première Spécialité)
// — sous abonnement.
//
// NOUVEAU CHAPITRE (audit programme 2026, confiance élevée — deux sources
// concordantes) : le domaine « Algorithmique et programmation » était
// totalement absent des ~180 générateurs existants de Première Spécialité
// avant cet ajout, alors qu'il est un fil rouge du programme officiel,
// mobilisé transversalement (suites, second degré/dichotomie, probabilités
// simulées) plutôt que cantonné à un seul chapitre du manuel. Contenu
// couvert ici : lecture et interprétation de code Python (boucles for,
// conditions), complétion de boucles (range), calcul des n premiers termes
// d'une suite par script, recherche approchée d'une solution par dichotomie,
// simulation d'une expérience aléatoire avec la fonction random().
//
// Convention d'affichage du code : chaque ligne de code est affichée comme
// une ligne d'un texTable() à une seule colonne (texte brut via \text{}, pas
// de police à chasse fixe : KaTeX ne garantit pas le rendu de \texttt avec
// des caractères comme "_" en dehors de \text{}, on reste donc prudent et on
// s'appuie sur le rendu texte, déjà éprouvé partout ailleurs dans l'appli).
// Les lignes indentées (corps d'une boucle ou d'un bloc conditionnel) sont
// préfixées par ".. " (un niveau) ou ".. .. " (deux niveaux) — un marqueur
// ASCII simple, sans dépendre de la préservation des espaces multiples par
// KaTeX (les espaces répétés sont fusionnés en un seul en mode texte, comme
// dans tout document LaTeX classique). Aucun identifiant Python utilisé ici
// ne contient de "_" (underscore), pour éviter tout risque d'interprétation
// comme indice en mode mathématique si jamais un futur générateur réutilise
// ces morceaux de code hors de \text{}.
//
// Voir automatismes-premiere-spe.js (thème
// "algorithmique-python-premiere-spe") pour les mini-exercices "Calcul
// mental" associés.
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

// Affiche un bloc de code Python comme un tableau LaTeX à une colonne
// (chaque ligne = une ligne de code, rendue en texte brut via \text{}).
const pyBlock = (lines) => texTable(lines.map((l) => [l]));

// ---------- 1. Prévoir le résultat d'une boucle for (somme accumulée) ----------
function genPrevoirResultatBoucleForNumeric() {
  const n = randInt(3, 8);
  const code = pyBlock(["total = 0", `for i in range(1, ${n} + 1):`, ".. total = total + i", "print(total)"]);
  const answer = (n * (n + 1)) / 2;
  return {
    type: "numeric",
    chapter: "Algorithmique et Python — Boucles",
    prompt: `On exécute le programme Python suivant : ${code} Quelle valeur ce programme affiche-t-il ?`,
    answer,
    steps: [
      { type: "regle", text: `\\text{La boucle fait parcourir à i les entiers de 1 à ${n}, et accumule leur somme dans la variable total.}` },
      { type: "resultat", text: `total = 1 + 2 + \\cdots + ${n} = \\dfrac{${n} \\times (${n} + 1)}{2} = ${answer}` },
    ],
  };
}

// ---------- 2. Compléter une boucle for (choisir le bon range) ----------
function genCompleterBoucleForQCM() {
  const k = randInt(4, 10);
  const code = pyBlock(["for i in range(?):", ".. print(i)"]);
  const correct = `range(${k})`;
  const distracteurs = [`range(1, ${k})`, `range(${k + 1})`, `range(1, ${k + 1})`];
  const options = shuffle([correct, ...shuffle(distracteurs).slice(0, 2)]);
  return {
    type: "qcm",
    chapter: "Algorithmique et Python — Boucles",
    prompt: `On veut que ce programme affiche exactement ${k} valeurs, à savoir les entiers de 0 à ${k - 1} : ${code} Par quoi faut-il remplacer le « ? » ?`,
    answer: correct,
    options,
    steps: [{ type: "regle", text: `\\text{En Python, range(k) génère les k entiers 0, 1, ..., k-1 : pour obtenir exactement ${k} valeurs en partant de 0, il faut range(${k}).}` }],
  };
}

// ---------- 3. Calculer le n-ième terme d'une suite via un script ----------
function genCalculerTermeSuiteScriptNumeric() {
  const arithmetique = Math.random() < 0.5;
  const u0 = randInt(2, 10);
  const n = randInt(3, 6);
  if (arithmetique) {
    const r = nonZero(-5, 5);
    const code = pyBlock(["u = " + u0, `for i in range(${n}):`, `.. u = u + (${r})`, "print(u)"]);
    const answer = u0 + n * r;
    return {
      type: "numeric",
      chapter: "Algorithmique et Python — Calculer un terme de suite",
      prompt: `On exécute ce programme Python : ${code} Quelle valeur affiche-t-il ?`,
      answer,
      steps: [
        { type: "regle", text: `\\text{La boucle ajoute ${r} à u, exactement ${n} fois : c'est le calcul d'un terme de suite arithmétique de raison ${r}.}` },
        { type: "resultat", text: `u = ${u0} + ${n} \\times (${r}) = ${answer}` },
      ],
    };
  }
  const q = pick([2, 3, 0.5]);
  const code = pyBlock(["u = " + u0, `for i in range(${n}):`, `.. u = u * ${fr(q)}`, "print(u)"]);
  const answer = roundTo(u0 * q ** n, 4);
  return {
    type: "numeric",
    chapter: "Algorithmique et Python — Calculer un terme de suite",
    prompt: `On exécute ce programme Python : ${code} Quelle valeur affiche-t-il (arrondie au dix-millième si besoin) ?`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{La boucle multiplie u par ${fr(q)}, exactement ${n} fois : c'est le calcul d'un terme de suite géométrique de raison ${fr(q)}.}` },
      { type: "resultat", text: `u = ${u0} \\times ${fr(q)}^{${n}} = ${fr(answer)}` },
    ],
  };
}

// ---------- 4. Identifier ce que calcule un programme (somme ou produit) ----------
function genIdentifierRoleCodeQCM() {
  const estSomme = Math.random() < 0.5;
  const code = estSomme
    ? pyBlock(["total = 0", "for i in range(1, n + 1):", ".. total = total + i", "print(total)"])
    : pyBlock(["total = 1", "for i in range(1, n + 1):", ".. total = total * i", "print(total)"]);
  const bonneReponse = estSomme ? "la somme des entiers de 1 à n" : "le produit des entiers de 1 à n (soit n!)";
  const options = ["la somme des entiers de 1 à n", "le produit des entiers de 1 à n (soit n!)", "le plus grand entier parmi 1 et n"];
  return {
    type: "qcm",
    chapter: "Algorithmique et Python — Lire un programme",
    prompt: `n étant un entier positif déjà défini, que calcule ce programme ? ${code}`,
    answer: bonneReponse,
    options,
    steps: [{ type: "regle", text: estSomme ? `\\text{À chaque tour de boucle, on ajoute i à total : c'est le calcul d'une somme.}` : `\\text{À chaque tour de boucle, on multiplie total par i : c'est le calcul d'un produit.}` }],
  };
}

// ---------- 5. Une étape de dichotomie ----------
function genDichotomieEtapesNumeric() {
  const a = randInt(0, 4);
  const largeur = pick([4, 6, 8, 10]);
  const b = a + largeur;
  const milieu = (a + b) / 2;
  const fMilieuPositif = Math.random() < 0.5;
  const nouveauA = fMilieuPositif ? a : milieu;
  const nouveauB = fMilieuPositif ? milieu : b;
  const demanderA = Math.random() < 0.5;
  const code = pyBlock(["milieu = (a + b) / 2", "if f(milieu) < 0:", ".. a = milieu", "else:", ".. b = milieu"]);
  return {
    type: "numeric",
    chapter: "Algorithmique et Python — Dichotomie",
    prompt: `On cherche une solution de f(x) = 0 par dichotomie sur l'intervalle [${a} ; ${b}], où f est une fonction croissante telle que f(${a}) < 0 et f(${b}) > 0. Voici l'étape de mise à jour de l'intervalle : ${code} On calcule f(${fr(milieu)}) et on trouve un résultat ${fMilieuPositif ? "positif" : "négatif"}. Après cette étape, quelle est ${demanderA ? "la nouvelle valeur de a" : "la nouvelle valeur de b"} ?`,
    answer: demanderA ? nouveauA : nouveauB,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{f étant croissante, si f(milieu) est du même signe que f(a) (négatif), la solution est entre milieu et b : on remplace a par milieu. Sinon, la solution est entre a et milieu : on remplace b par milieu.}` },
      { type: "calcul", text: `\\text{milieu} = \\dfrac{${a} + ${b}}{2} = ${fr(milieu)}` },
      { type: "resultat", text: fMilieuPositif ? `\\text{f(milieu) > 0 : on remplace b par milieu, a reste égal à ${a}.}` : `\\text{f(milieu) < 0 : on remplace a par milieu, b reste égal à ${b}.}` },
    ],
  };
}

// ---------- 6. Simulation d'une expérience aléatoire ----------
function genSimulationAleatoireNumeric() {
  const p = pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.75, 0.8]);
  const code = pyBlock(["succes = 0", "for i in range(n):", `.. if random() < ${fr(p)}:`, ".. .. succes = succes + 1"]);
  return {
    type: "numeric",
    chapter: "Algorithmique et Python — Simulation",
    prompt: `On simule une expérience aléatoire avec ce programme (la fonction random() renvoie un nombre décimal aléatoire choisi uniformément entre 0 et 1) : ${code} Quelle est la probabilité de succès simulée à chaque répétition de la boucle ?`,
    answer: p,
    tolerance: 0.001,
    steps: [{ type: "regle", text: `\\text{Comme random() suit une loi uniforme sur [0 ; 1], la condition random() < ${fr(p)} est vraie avec une probabilité ${fr(p)}.}` }],
  };
}

// ---------- 7. Vocabulaire Python ----------
function genVocabulaireAlgoQCM() {
  const items = [
    {
      q: "Que renvoie l'instruction range(5) ?",
      correct: "Les entiers de 0 à 4",
      options: ["Les entiers de 0 à 4", "Les entiers de 1 à 5", "Les entiers de 0 à 5"],
    },
    {
      q: "Quelle condition Python teste si un entier n est pair ?",
      correct: "n % 2 == 0",
      options: ["n % 2 == 0", "n / 2 == 0", "n // 2 == 1"],
    },
    {
      q: "Que fait l'instruction break à l'intérieur d'une boucle ?",
      correct: "Elle interrompt immédiatement la boucle",
      options: ["Elle interrompt immédiatement la boucle", "Elle relance la boucle depuis le début", "Elle met la boucle en pause"],
    },
    {
      q: "Pourquoi écrit-on import random en début de programme ?",
      correct: "Pour pouvoir utiliser des fonctions de génération de nombres aléatoires",
      options: ["Pour pouvoir utiliser des fonctions de génération de nombres aléatoires", "Pour importer des valeurs depuis un fichier texte", "Pour accélérer l'exécution du programme"],
    },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Algorithmique et Python — Vocabulaire",
    prompt: it.q,
    answer: it.correct,
    options: shuffle(it.options),
    steps: [{ type: "regle", text: `\\text{Vocabulaire de base de l'algorithmique et de la programmation en Python.}` }],
  };
}

// ---------- 8. Compléter une condition (test de parité) ----------
function genCompleterConditionQCM() {
  const n = randInt(10, 50);
  const code = pyBlock(["n = " + n, "if ?:", ".. print('n est pair')", "else:", ".. print('n est impair')"]);
  const correct = "n % 2 == 0";
  const distracteurs = ["n % 2 == 1", "n / 2 == 0"];
  return {
    type: "qcm",
    chapter: "Algorithmique et Python — Lire un programme",
    prompt: `Pour afficher « n est pair » lorsque n est pair et « n est impair » sinon, par quoi faut-il remplacer le « ? » dans ce programme ? ${code}`,
    answer: correct,
    options: shuffle([correct, ...distracteurs]),
    steps: [{ type: "regle", text: `\\text{n % 2 est le reste de la division de n par 2 : ce reste vaut 0 si et seulement si n est pair.}` }],
  };
}

const GENERATORS = [
  genPrevoirResultatBoucleForNumeric,
  genCompleterBoucleForQCM,
  genCalculerTermeSuiteScriptNumeric,
  genIdentifierRoleCodeQCM,
  genDichotomieEtapesNumeric,
  genSimulationAleatoireNumeric,
  genVocabulaireAlgoQCM,
  genCompleterConditionQCM,
];

const DIFFICULTY = {
  genVocabulaireAlgoQCM: "facile",
  genCompleterBoucleForQCM: "facile",
  genCompleterConditionQCM: "facile",
  genSimulationAleatoireNumeric: "standard",
  genIdentifierRoleCodeQCM: "standard",
  genPrevoirResultatBoucleForNumeric: "standard",
  genCalculerTermeSuiteScriptNumeric: "standard",
  genDichotomieEtapesNumeric: "expert",
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
    id: "algorithmique-python-premiere-spe",
    title: "Algorithmique et programmation (Python)",
    description: "Lecture et complétion de code Python, boucles for, calcul des n premiers termes d'une suite par script, recherche approchée par dichotomie, simulation d'une expérience aléatoire.",
    pourquoi: "Écrire et lire un programme, c'est traduire un raisonnement mathématique en instructions précises — une compétence désormais évaluée au même titre que le calcul, et transversale à presque tous les autres chapitres (suites, second degré, probabilités).",
    level: "premiere-spe",
    free: false,
    order: 12,
    cours: {
      mindMap: {
        title: "Algorithmique et programmation (Python)",
        branches: [
          {
            title: "Boucle for et range()",
            items: [
              "\\(\\text{range(n)}\\) parcourt les entiers de 0 à n-1 (n valeurs, pas n+1).",
              "Piège classique très fréquent : oublier que range(n) s'arrête à n-1, pas à n.",
            ],
          },
          {
            title: "Calculer les termes d'une suite par script",
            items: [
              "Initialiser une variable avec le premier terme, puis la mettre à jour à chaque tour de boucle selon la relation de récurrence.",
              "Deux schémas d'accumulation à reconnaître : total = total + i (somme, on part de 0) et total = total * i (produit, on part de 1) — le choix de la valeur initiale dépend de l'opération.",
            ],
          },
          {
            title: "Conditions et vocabulaire de base",
            items: [
              "Structure if / else : le bloc if s'exécute si la condition est vraie, sinon c'est le bloc else qui s'exécute.",
              "\\(\\text{n \\% 2}\\) est le reste de la division de n par 2 : ce reste vaut 0 si et seulement si n est pair — le test de parité classique est \\(\\text{n \\% 2 == 0}\\).",
              "L'instruction break interrompt immédiatement la boucle en cours, sans attendre la fin normale du parcours.",
              "import random en début de programme donne accès aux fonctions de génération de nombres aléatoires (dont random()).",
            ],
          },
          {
            title: "Recherche par dichotomie",
            items: [
              "À chaque étape, on divise l'intervalle en deux et on garde la moitié qui contient la solution (test du signe au milieu).",
              "Plus le nombre d'étapes augmente, plus l'intervalle final est précis (il est divisé par 2 à chaque étape).",
            ],
          },
          {
            title: "Simulation aléatoire",
            items: [
              "\\(\\text{random()}\\) renvoie un nombre décimal aléatoire dans \\([0 ; 1[\\), utilisé pour simuler une expérience à plusieurs issues.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
