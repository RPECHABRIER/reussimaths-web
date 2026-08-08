// ---------------------------------------------------------------------------
// Chapitre : Algorithmique et programmation en Python (Première technologique)
// — sous abonnement.
//
// NOUVEAU CHAPITRE (audit programme 2026, M2) : le domaine « Algorithmique et
// programmation » (partie transversale du tronc commun, sauf STD2A) était
// totalement absent des générateurs existants de Première technologique
// avant cet ajout. Contenu couvert ici : écrire/reconnaître une fonction
// Python, interpréter et compléter un programme, corriger une erreur,
// manipuler des listes (extension, compréhension, itération), et les
// rubriques « Situations algorithmiques » citées par chaque partie
// thématique du programme : calculer un terme de suite par boucle
// (Suites), simuler un échantillon de Bernoulli (Variables aléatoires),
// balayage pour approcher une solution d'équation (Fonctions).
//
// Convention d'affichage du code : chaque ligne de code est affichée comme
// une ligne d'un texTable() à une seule colonne (texte brut via \text{}),
// même convention que algorithmique-python-premiere-spe.js. Les lignes
// indentées sont préfixées par ".. " (un niveau) ou ".. .. " (deux niveaux).
// Aucun identifiant Python utilisé ici ne contient de "_" (underscore), pour
// éviter tout risque d'interprétation comme indice en mode mathématique.
//
// Voir automatismes-premiere-techno.js pour d'éventuels mini-exercices
// "Calcul mental" associés (non ajoutés ici, faute de mandat explicite de
// l'audit sur ce fichier précis).
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr() pour utiliser la virgule française — voir fr() ci-dessous.
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

// Affiche un bloc de code Python comme un tableau LaTeX à une colonne.
const pyBlock = (lines) => texTable(lines.map((l) => [l]));

// ---------- 1. Reconnaître une fonction Python correcte ----------
function genEcrireFonctionQCM() {
  const cas = pick([
    {
      description: "calcule l'aire d'un rectangle de largeur l et de longueur L",
      correct: pyBlock(["def aire(l, L):", ".. return l * L"]),
      distracteurs: [pyBlock(["def aire(l, L):", ".. return l + L"]), pyBlock(["def aire(l, L):", ".. l * L"])],
    },
    {
      description: "renvoie le double d'un nombre x",
      correct: pyBlock(["def double(x):", ".. return 2 * x"]),
      distracteurs: [pyBlock(["def double(x):", ".. return x + x + x"]), pyBlock(["def double(x):", ".. x = 2 * x"])],
    },
  ]);
  const options = shuffle([cas.correct, ...cas.distracteurs]);
  return {
    type: "qcm",
    chapter: "Algorithmique et Python — Écrire une fonction",
    prompt: `Quelle fonction Python ${cas.description} ?`,
    answer: cas.correct,
    options,
    steps: [{ type: "regle", text: `\\text{Une fonction Python doit utiliser le mot-clé return pour renvoyer une valeur : une fonction qui ne fait qu'affecter une variable sans return ne renvoie rien.}` }],
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
    chapter: "Algorithmique et Python — Compléter un programme",
    prompt: `On veut que ce programme affiche exactement ${k} valeurs, à savoir les entiers de 0 à ${k - 1} : ${code} Par quoi faut-il remplacer le « ? » ?`,
    answer: correct,
    options,
    steps: [{ type: "regle", text: `\\text{range(k) génère les k entiers 0, 1, ..., k-1 : pour obtenir exactement ${k} valeurs en partant de 0, il faut range(${k}).}` }],
  };
}

// ---------- 3. Corriger une erreur dans un programme ----------
function genCorrigerProgrammeQCM() {
  const n = randInt(5, 10);
  const codeBuggue = pyBlock(["total = 0", `for i in range(1, ${n}):`, ".. total = total + i", "print(total)"]);
  const correct = `\\text{Il manque un terme : } range(1, ${n}) \\text{ s'arrête à ${n - 1}, il faut } range(1, ${n} + 1) \\text{ pour aller jusqu'à ${n}.}`;
  const distracteurs = [
    `\\text{Il faut initialiser total à 1 et non à 0.}`,
    `\\text{Il faut écrire total = i et non total = total + i.}`,
  ];
  return {
    type: "qcm",
    chapter: "Algorithmique et Python — Corriger un programme",
    prompt: `Ce programme est censé calculer la somme des entiers de 1 à ${n}, mais il contient une erreur : ${codeBuggue} Quelle est l'erreur ?`,
    answer: correct,
    options: shuffle([correct, ...distracteurs]),
    steps: [{ type: "regle", text: `\\text{En Python, range(a, b) parcourt les entiers de a à b-1 (b exclu) : pour inclure ${n}, il faut écrire range(1, ${n} + 1).}` }],
  };
}

// ---------- 4. Liste en extension / compréhension ----------
function genListeExtensionQCM() {
  const n = randInt(3, 5);
  const facteur = pick([2, 3]);
  const code = `[${facteur} * i for i in range(${n})]`;
  const correct = `[${Array.from({ length: n }, (_, i) => facteur * i).join(", ")}]`;
  const distracteurs = [
    `[${Array.from({ length: n }, (_, i) => facteur * (i + 1)).join(", ")}]`,
    `[${Array.from({ length: n + 1 }, (_, i) => facteur * i).join(", ")}]`,
  ];
  return {
    type: "qcm",
    chapter: "Algorithmique et Python — Listes",
    prompt: `En Python, quelle est la liste construite en extension par l'instruction \\(\\text{${code}}\\) ?`,
    answer: correct,
    options: shuffle([correct, ...distracteurs]),
    steps: [{ type: "regle", text: `\\text{Cette écriture en compréhension parcourt i de 0 à ${n - 1} et construit la liste des valeurs ${facteur} \\times i.}` }],
  };
}

// ---------- 5. Itération dans une liste (somme des éléments) ----------
function genIterationListeNumeric() {
  const valeurs = Array.from({ length: 5 }, () => randInt(1, 20));
  const code = pyBlock(["liste = [" + valeurs.join(", ") + "]", "total = 0", "for x in liste:", ".. total = total + x", "print(total)"]);
  const answer = valeurs.reduce((a, b) => a + b, 0);
  return {
    type: "numeric",
    chapter: "Algorithmique et Python — Listes",
    prompt: `On exécute ce programme Python : ${code} Quelle valeur affiche-t-il ?`,
    answer,
    steps: [
      { type: "regle", text: `\\text{La boucle « for x in liste » parcourt chaque élément de la liste et l'ajoute à total.}` },
      { type: "resultat", text: `total = ${valeurs.join(" + ")} = ${answer}` },
    ],
  };
}

// ---------- 6. Situation algorithmique (Suites) : terme via une boucle ----------
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
      chapter: "Algorithmique et Python — Situations algorithmiques (suites)",
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
    chapter: "Algorithmique et Python — Situations algorithmiques (suites)",
    prompt: `On exécute ce programme Python : ${code} Quelle valeur affiche-t-il (arrondie au dix-millième si besoin) ?`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{La boucle multiplie u par ${fr(q)}, exactement ${n} fois : c'est le calcul d'un terme de suite géométrique de raison ${fr(q)}.}` },
      { type: "resultat", text: `u = ${u0} \\times ${fr(q)}^{${n}} = ${fr(answer)}` },
    ],
  };
}

// ---------- 7. Situation algorithmique (Variables aléatoires) : simuler un échantillon de Bernoulli ----------
function genSimulationBernoulliNumeric() {
  const p = pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.75, 0.8]);
  const code = pyBlock(["succes = 0", "for i in range(n):", `.. if random() < ${fr(p)}:`, ".. .. succes = succes + 1"]);
  return {
    type: "numeric",
    chapter: "Algorithmique et Python — Situations algorithmiques (variables aléatoires)",
    prompt: `On simule un échantillon d'une loi de Bernoulli avec ce programme (la fonction random() renvoie un nombre décimal aléatoire uniforme entre 0 et 1) : ${code} Quelle est la probabilité de succès simulée à chaque répétition de la boucle ?`,
    answer: p,
    tolerance: 0.001,
    steps: [{ type: "regle", text: `\\text{Comme random() suit une loi uniforme sur [0 ; 1], la condition random() < ${fr(p)} est vraie avec une probabilité ${fr(p)}.}` }],
  };
}

// ---------- 8. Situation algorithmique (Fonctions) : balayage pour approcher une équation ----------
function genBalayageEquationNumeric() {
  // f(x) = x - k, on cherche par balayage (pas de 1) le premier x >= 0 où f(x) devient positif ou nul
  const k = randInt(3, 12);
  const code = pyBlock(["x = 0", "while x - k < 0:", ".. x = x + 1", "print(x)"]);
  return {
    type: "numeric",
    chapter: "Algorithmique et Python — Situations algorithmiques (balayage)",
    prompt: `On cherche, par balayage (pas de 1), la plus petite valeur entière \\(x \\geq 0\\) telle que \\(x - k \\geq 0\\), pour \\(k = ${k}\\) : ${code} Quelle valeur ce programme affiche-t-il ?`,
    answer: k,
    steps: [{ type: "regle", text: `\\text{Le programme teste x = 0, 1, 2, ... et s'arrête dès que } x - k \\geq 0\\text{, c'est-à-dire } x \\geq ${k}\\text{ : la première valeur qui convient est } x = ${k}.` }],
  };
}

// ---------- 9. Vocabulaire de l'algorithmique ----------
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
      q: "Que renvoie l'instruction len(liste) ?",
      correct: "Le nombre d'éléments de la liste",
      options: ["Le nombre d'éléments de la liste", "La plus grande valeur de la liste", "La somme des éléments de la liste"],
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

const GENERATORS = [
  genEcrireFonctionQCM,
  genCompleterBoucleForQCM,
  genCorrigerProgrammeQCM,
  genListeExtensionQCM,
  genIterationListeNumeric,
  genCalculerTermeSuiteScriptNumeric,
  genSimulationBernoulliNumeric,
  genBalayageEquationNumeric,
  genVocabulaireAlgoQCM,
];

const DIFFICULTY = {
  genVocabulaireAlgoQCM: "facile",
  genCompleterBoucleForQCM: "facile",
  genEcrireFonctionQCM: "facile",
  genListeExtensionQCM: "standard",
  genIterationListeNumeric: "standard",
  genSimulationBernoulliNumeric: "standard",
  genCalculerTermeSuiteScriptNumeric: "standard",
  genCorrigerProgrammeQCM: "expert",
  genBalayageEquationNumeric: "expert",
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
    id: "algorithmique-python-premiere-techno",
    title: "Algorithmique et programmation (Python)",
    description: "Écrire et reconnaître une fonction Python, compléter/corriger un programme, manipuler des listes, situations algorithmiques liées aux suites, aux variables aléatoires et à la résolution d'équations par balayage.",
    pourquoi: "Écrire et lire un programme, c'est traduire un raisonnement mathématique en instructions précises — une compétence désormais évaluée au même titre que le calcul, mobilisée dans presque tous les autres chapitres.",
    level: "premiere-techno",
    free: false,
    order: 10,
    cours: {
      mindMap: {
        title: "Algorithmique et programmation (Python)",
        branches: [
          {
            title: "Écrire et lire une fonction",
            items: [
              "Une fonction prend des paramètres, effectue des instructions, et renvoie un résultat avec \\(\\text{return}\\).",
              "Piège classique : \\(\\text{return}\\) arrête immédiatement la fonction — le code écrit après ne s'exécute jamais.",
            ],
          },
          {
            title: "Boucle for et listes",
            items: [
              "\\(\\text{range(n)}\\) parcourt les entiers de 0 à n-1 (n valeurs, pas n+1). \\(\\text{range(a, b)}\\) parcourt les entiers de a à b-1 (b exclu) : range(n) est un raccourci pour range(0, n).",
              "Parcourir une liste avec une boucle for permet de traiter chaque élément un par un.",
              "Écriture en compréhension : \\(\\text{[expression for i in range(n)]}\\) construit directement la liste des valeurs de l'expression, pour i variant de 0 à n-1.",
            ],
          },
          {
            title: "Calculer un terme de suite par boucle",
            items: [
              "Initialiser une variable avec le premier terme, puis la mettre à jour à chaque tour selon la relation de récurrence.",
            ],
          },
          {
            title: "Balayage et simulation",
            items: [
              "Balayage : tester successivement des valeurs pour approcher la solution d'une équation.",
              "\\(\\text{random()}\\) renvoie un nombre dans \\([0 ; 1[\\), utile pour simuler une expérience de Bernoulli.",
            ],
          },
          {
            title: "Vocabulaire Python de base",
            items: [
              "\\(\\text{len(liste)}\\) renvoie le nombre d'éléments de la liste.",
              "Test de parité d'un entier n : \\(\\text{n \\% 2 == 0}\\) (le reste de la division euclidienne par 2 vaut 0 si n est pair).",
              "\\(\\text{import random}\\) en début de programme est nécessaire pour pouvoir utiliser des fonctions de génération aléatoire comme \\(\\text{random()}\\).",
            ],
          },
        ],
      },
    },
  },
  generate,
};
