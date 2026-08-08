// ---------------------------------------------------------------------------
// Chapitre : Algorithmique (5e) — sous abonnement.
//
// NOUVEAU CHAPITRE (audit programme 2026) : couvre le domaine « Pensée
// informatique » du nouveau programme officiel de cycle 4 (BO n°10 du 5 mars
// 2026, arrêté du 18-2-2026, applicable en 5e dès la rentrée 2026), qui était
// totalement absent de l'application avant cet ajout — c'est un domaine à
// part entière du programme, au même titre que « Nombres et calculs » ou
// « Espace et géométrie », pas une sous-partie optionnelle.
//
// Objectifs d'apprentissage officiels (Cinquième — La pensée informatique) :
// « Manipuler des instructions simples et les séquencer. Identifier les
// entrées et sorties d'un programme. Représenter des formules sous la forme
// d'une expression informatique dans un langage de programmation par blocs.
// Calculer la valeur de formules à l'aide d'une suite d'instruction dans un
// langage de programmation par blocs. Prévoir la valeur d'une expression
// informatique avant son exécution. Analyser un programme simple donné et
// modifier ses paramètres. Effectuer une boucle inconditionnelle simple
// permettant de répéter une séquence linéaire d'instructions un nombre
// précis de fois. »
//
// Restrictions strictes de 5e respectées ici :
// - la notion de variable est vue UNIQUEMENT sous l'angle de la lecture
//   d'une donnée saisie (« Lire n ») — pas de manipulation générale de
//   variable ni de réaffectation d'une même variable (ex. pas de
//   « n ← n + 1 »), qui relève de la Quatrième ;
// - seule la boucle INCONDITIONNELLE (répéter un nombre précis de fois) est
//   testée — la boucle conditionnelle relève de la Troisième.
//
// Les programmes sont représentés sous forme de « blocs » textuels au moyen
// de texTable() (voir ../utils/texTable.js) : une colonne pour le mot-clé de
// l'instruction (Lire / Calculer / Afficher / Répéter / Avancer de / ...),
// une colonne pour l'expression associée — cela évite tout débordement de
// texte hors du cadre de l'exercice (voir la correction apportée à
// proportionnalite.js pour le même problème).
// ---------------------------------------------------------------------------

import { texTable } from "../utils/texTable.js";

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// =========================== Séquencer des instructions ===========================

// ---------- 1. Ordre correct d'une séquence d'instructions ----------
function genSequencerInstructionsOrdreQCM() {
  const templates = [
    { desc: "le double de n", correct: "Lire n, puis afficher le double de n.", wrong: "Afficher le double de n, puis lire n." },
    { desc: "le triple de n", correct: "Lire n, puis afficher le triple de n.", wrong: "Afficher le triple de n, puis lire n." },
    { desc: "n augmenté de 5", correct: "Lire n, puis afficher n augmenté de 5.", wrong: "Afficher n augmenté de 5, puis lire n." },
    { desc: "la moitié de n", correct: "Lire n, puis afficher la moitié de n.", wrong: "Afficher la moitié de n, puis lire n." },
  ];
  const t = pick(templates);
  const options = shuffle([t.correct, t.wrong]);
  return {
    type: "qcm",
    chapter: "Algorithmique — Séquencer des instructions",
    prompt: `On veut un programme qui lit un nombre n saisi par l'utilisateur, puis affiche ${t.desc}. Quelle suite d'instructions est correcte ?`,
    answer: t.correct,
    options,
    steps: [{ type: "regle", text: `Un programme s'exécute dans l'ordre, ligne par ligne : il faut lire une valeur avant de pouvoir l'utiliser dans un calcul ou un affichage.` }],
  };
}

// =========================== Identifier les entrées et sorties ===========================

// ---------- 2. Identifier l'instruction d'entrée ou de sortie ----------
function genIdentifierEntreeSortieQCM() {
  const k = randInt(2, 9);
  const askEntree = Math.random() < 0.5;
  const table = texTable([
    ["Lire", "n"],
    ["Calculer", `p = ${k}n`],
    ["Afficher", "p"],
  ]);
  const lignes = ["Lire n", `Calculer p = ${k}n`, "Afficher p"];
  const answer = askEntree ? lignes[0] : lignes[2];
  const options = shuffle(lignes);
  return {
    type: "qcm",
    chapter: "Algorithmique — Entrées et sorties",
    prompt: `Voici un programme : ${table} Quelle est l'instruction ${askEntree ? "d'entrée" : "de sortie"} de ce programme ?`,
    answer,
    options,
    steps: [
      {
        type: "regle",
        text: askEntree
          ? `L'entrée d'un programme est la donnée saisie par l'utilisateur : c'est l'instruction « Lire ».`
          : `La sortie d'un programme est ce qu'il affiche à l'écran : c'est l'instruction « Afficher ».`,
      },
    ],
  };
}

// =========================== Représenter et calculer des formules ===========================

// ---------- 3. Traduire une formule en suite d'instructions ----------
function genTraduireFormuleProgrammeQCM() {
  const a = randInt(2, 9);
  const b = randInt(1, 15);
  const signe = Math.random() < 0.5 ? "+" : "-";
  const correct = `Lire n ; Calculer r = ${a}n ${signe} ${b} ; Afficher r`;
  const wrongOrder = `Calculer r = ${a}n ${signe} ${b} ; Lire n ; Afficher r`;
  const wrongFormula = `Lire n ; Calculer r = ${a}n ${signe === "+" ? "-" : "+"} ${b} ; Afficher r`;
  const options = shuffle([correct, wrongOrder, wrongFormula]);
  return {
    type: "qcm",
    chapter: "Algorithmique — Traduire une formule",
    prompt: `On veut un programme qui calcule et affiche la valeur de \\(r = ${a}n ${signe} ${b}\\) pour un nombre n saisi par l'utilisateur. Quelle suite d'instructions est correcte ?`,
    answer: correct,
    options,
    steps: [{ type: "regle", text: `Le programme doit d'abord lire n, puis calculer la formule demandée, puis afficher le résultat — dans cet ordre.` }],
  };
}

// ---------- 4. Prévoir le résultat affiché par un programme (formule directe) ----------
function genPrevoirResultatProgrammeNumeric() {
  const a = randInt(2, 9);
  const b = randInt(1, 15);
  const n = randInt(1, 12);
  const signe = Math.random() < 0.5 ? "+" : "-";
  const table = texTable([
    ["Lire", "n"],
    ["Calculer", `r = ${a}n ${signe} ${b}`],
    ["Afficher", "r"],
  ]);
  const answer = signe === "+" ? a * n + b : a * n - b;
  return {
    type: "numeric",
    chapter: "Algorithmique — Prévoir un résultat",
    prompt: `Voici un programme : ${table} On exécute ce programme avec n = ${n}. Quelle valeur affiche-t-il ?`,
    answer,
    steps: [{ type: "calcul", text: `r = ${a} \\times ${n} ${signe} ${b} = ${answer}` }],
  };
}

// ---------- 5. Calculer la valeur d'une formule via une suite d'instructions (2 étapes) ----------
function genCalculerFormuleDeuxEtapesNumeric() {
  const a = randInt(2, 6);
  const b = randInt(2, 9);
  const n = randInt(2, 10);
  const table = texTable([
    ["Lire", "n"],
    ["Calculer", `p = ${a}n`],
    ["Calculer", `r = p + ${b}`],
    ["Afficher", "r"],
  ]);
  const p = a * n;
  const answer = p + b;
  return {
    type: "numeric",
    chapter: "Algorithmique — Prévoir un résultat",
    prompt: `Voici un programme : ${table} On exécute ce programme avec n = ${n}. Quelle valeur affiche-t-il ?`,
    answer,
    steps: [
      { type: "calcul", text: `p = ${a} \\times ${n} = ${p}` },
      { type: "calcul", text: `r = ${p} + ${b} = ${answer}` },
    ],
  };
}

// ---------- 6. Analyser un programme et modifier un de ses paramètres ----------
function genModifierParametreProgrammeNumeric() {
  const a1 = randInt(2, 9);
  let a2 = randInt(2, 9);
  while (a2 === a1) a2 = randInt(2, 9);
  const b = randInt(1, 15);
  const n = randInt(1, 10);
  const table = texTable([
    ["Lire", "n"],
    ["Calculer", `r = ${a1}n + ${b}`],
    ["Afficher", "r"],
  ]);
  const answer = a2 * n + b;
  return {
    type: "numeric",
    chapter: "Algorithmique — Modifier un paramètre",
    prompt: `Voici un programme : ${table} On remplace le nombre ${a1} par ${a2} dans l'instruction « Calculer ». On exécute ensuite ce nouveau programme avec n = ${n}. Quelle valeur affiche-t-il ?`,
    answer,
    steps: [{ type: "calcul", text: `r = ${a2} \\times ${n} + ${b} = ${answer}` }],
  };
}

// =========================== Boucle inconditionnelle simple ===========================

// ---------- 7. Boucle : répéter un déplacement ----------
function genBoucleDistanceNumeric() {
  const nRep = randInt(3, 8);
  const d = randInt(2, 15);
  const table = texTable([
    ["Répéter", `${nRep}\\text{ fois}`],
    ["Avancer de", `${d}\\text{ m}`],
  ]);
  const answer = nRep * d;
  return {
    type: "numeric",
    chapter: "Algorithmique — Boucle inconditionnelle",
    prompt: `Un robot exécute le programme suivant : ${table} Quelle distance totale, en mètres, le robot a-t-il parcourue ?`,
    answer,
    steps: [
      { type: "regle", text: `La boucle répète l'instruction « Avancer de ${d} m » exactement ${nRep} fois.` },
      { type: "calcul", text: `${nRep} \\times ${d} = ${answer}` },
    ],
  };
}

// ---------- 8. Boucle : compter le nombre d'affichages ----------
function genBoucleAfficherNumeric() {
  const nRep = randInt(3, 9);
  const mot = pick(["Bravo", "Bonjour", "Chapeau", "Encore"]);
  const table = texTable([
    ["Répéter", `${nRep}\\text{ fois}`],
    ["Afficher", `\\text{${mot}}`],
  ]);
  return {
    type: "numeric",
    chapter: "Algorithmique — Boucle inconditionnelle",
    prompt: `Voici un programme : ${table} Combien de fois le mot « ${mot} » s'affiche-t-il à l'écran lors de l'exécution de ce programme ?`,
    answer: nRep,
    steps: [{ type: "regle", text: `Une boucle « Répéter ${nRep} fois » exécute exactement ${nRep} fois l'instruction qu'elle contient.` }],
  };
}

// ---------- 9. Boucle : accumulation d'un score ----------
function genBoucleScoreNumeric() {
  const nRep = randInt(3, 8);
  const pts = randInt(2, 8);
  const table = texTable([
    ["Répéter", `${nRep}\\text{ fois}`],
    ["Ajouter", `${pts}\\text{ points au score}`],
  ]);
  const answer = nRep * pts;
  return {
    type: "numeric",
    chapter: "Algorithmique — Boucle inconditionnelle",
    prompt: `Au départ, le score d'un joueur est 0. Il exécute le programme suivant : ${table} Quel est son score final ?`,
    answer,
    steps: [{ type: "calcul", text: `${nRep} \\times ${pts} = ${answer}` }],
  };
}

// =========================== Vocabulaire ===========================

// ---------- 10. Vocabulaire de la pensée informatique ----------
function genVocabulaireAlgorithmiqueQCM() {
  const items = [
    {
      q: "Dans un programme, comment appelle-t-on une donnée saisie par l'utilisateur avant l'exécution ?",
      correct: "Une entrée",
      options: ["Une entrée", "Une sortie", "Une boucle"],
    },
    {
      q: "Dans un programme, comment appelle-t-on ce qu'il affiche à l'écran ?",
      correct: "Une sortie",
      options: ["Une entrée", "Une sortie", "Une variable"],
    },
    {
      q: "Comment appelle-t-on une instruction qui répète une séquence un nombre précis de fois ?",
      correct: "Une boucle inconditionnelle",
      options: ["Une boucle inconditionnelle", "Une variable", "Une entrée"],
    },
    {
      q: "En 5e, à quoi sert une variable dans un programme ?",
      correct: "À stocker une donnée saisie en lecture",
      options: ["À stocker une donnée saisie en lecture", "À stocker le nom du programmeur", "À compter le nombre de lignes du programme"],
    },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Algorithmique — Vocabulaire",
    prompt: it.q,
    answer: it.correct,
    options: shuffle(it.options),
    steps: [{ type: "regle", text: `Vocabulaire de base de la pensée informatique, au programme de 5e.` }],
  };
}

const GENERATORS = [
  genSequencerInstructionsOrdreQCM,
  genIdentifierEntreeSortieQCM,
  genTraduireFormuleProgrammeQCM,
  genPrevoirResultatProgrammeNumeric,
  genCalculerFormuleDeuxEtapesNumeric,
  genModifierParametreProgrammeNumeric,
  genBoucleDistanceNumeric,
  genBoucleAfficherNumeric,
  genBoucleScoreNumeric,
  genVocabulaireAlgorithmiqueQCM,
];

const DIFFICULTY = {
  genSequencerInstructionsOrdreQCM: "facile",
  genIdentifierEntreeSortieQCM: "facile",
  genVocabulaireAlgorithmiqueQCM: "facile",
  genBoucleAfficherNumeric: "facile",
  genBoucleDistanceNumeric: "standard",
  genBoucleScoreNumeric: "standard",
  genTraduireFormuleProgrammeQCM: "standard",
  genPrevoirResultatProgrammeNumeric: "standard",
  genModifierParametreProgrammeNumeric: "standard",
  genCalculerFormuleDeuxEtapesNumeric: "expert",
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
    id: "algorithmique-cinquieme",
    title: "Algorithmique",
    description: "Séquencer des instructions, identifier les entrées/sorties, traduire et calculer des formules dans un programme par blocs, boucle inconditionnelle simple.",
    pourquoi: "La pensée informatique n'est pas réservée aux passionnés d'ordinateur : apprendre à séquencer des instructions et à prévoir le résultat d'un programme simple développe une rigueur logique utile dans toutes les matières — et c'est désormais un domaine à part entière du programme officiel de 5e.",
    level: "cinquieme",
    free: false,
    order: 13,
    cours: {
      mindMap: {
        title: "Algorithmique",
        branches: [
          {
            title: "Séquencer, entrées et sorties",
            items: [
              "Un programme s'exécute dans l'ordre, ligne par ligne : il faut lire une valeur avant de pouvoir l'utiliser.",
              "L'entrée, c'est la donnée saisie (« Lire »). La sortie, c'est ce qui est affiché (« Afficher »).",
            ],
          },
          {
            title: "Traduire et calculer une formule",
            items: [
              "Un programme suit toujours le même schéma : Lire → Calculer → Afficher.",
              "Pour prévoir un résultat, on exécute le programme « à la main », étape par étape, avec la valeur donnée.",
            ],
            formula: "Lire n ; Calculer r = an + b ; Afficher r",
          },
          {
            title: "Boucle inconditionnelle",
            items: [
              "« Répéter k fois » exécute exactement k fois les instructions qu'elle contient.",
              "Piège classique : bien compter le nombre total de répétitions avant de calculer un total (distance, score...).",
            ],
          },
          {
            title: "Vocabulaire",
            items: [
              "Variable : une donnée qu'on peut stocker (en 5e, uniquement une valeur lue en entrée).",
              "Boucle, entrée, sortie : le vocabulaire de base de la pensée informatique.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
