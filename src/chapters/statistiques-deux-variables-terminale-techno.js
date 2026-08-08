// ---------------------------------------------------------------------------
// Chapitre : Statistiques à deux variables (Terminale technologique / STMG)
// Programme 2026 : changement de variable pour se ramener à un ajustement
// affine (ex : Y = u², Y = 1/t, Y = 1/√n, Y = log(y)), quand le nuage de
// points (x ; y) n'est pas directement ajustable par une droite. Capacité :
// représenter un nuage de points après un changement de variable donné,
// pour conjecturer une relation de linéarité, puis revenir au modèle
// d'origine.
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

// ---------- 1. Effectuer un changement de variable donné (calculer Y) ----------
function genCalculerChangementVariableNumeric() {
  const type = pick(["carre", "inverse", "log"]);
  const x = randInt(2, 20);
  if (type === "carre") {
    return {
      type: "numeric",
      chapter: "Statistiques à deux variables (Terminale techno) — Changement de variable",
      prompt: `On pose \\(Y = X^2\\). Calcule \\(Y\\) pour \\(X = ${x}\\).`,
      answer: x * x,
      steps: [{ type: "resultat", text: `Y = ${x}^2 = ${x * x}` }],
    };
  }
  if (type === "inverse") {
    const answer = roundTo(1 / x, 4);
    return {
      type: "numeric",
      chapter: "Statistiques à deux variables (Terminale techno) — Changement de variable",
      prompt: `On pose \\(Y = \\dfrac{1}{X}\\). Calcule \\(Y\\) pour \\(X = ${x}\\) (arrondi à 0,0001 près).`,
      answer,
      tolerance: 0.0005,
      steps: [{ type: "resultat", text: `Y = \\dfrac{1}{${x}} = ${fr(answer)}` }],
    };
  }
  const answer = roundTo(Math.log10(x), 3);
  return {
    type: "numeric",
    chapter: "Statistiques à deux variables (Terminale techno) — Changement de variable",
    prompt: `On pose \\(Y = \\log(X)\\). Calcule \\(Y\\) pour \\(X = ${x}\\) (arrondi au millième).`,
    answer,
    tolerance: 0.002,
    steps: [{ type: "resultat", text: `Y = \\log(${x}) \\approx ${fr(answer)}` }],
  };
}

// ---------- 2. Choisir le bon changement de variable selon la forme du nuage ----------
function genChoisirChangementVariableQCM() {
  const cas = pick([
    {
      description: "Le nuage de points (x ; y) suit une allure de parabole (croissance de plus en plus rapide, en escalier symétrique).",
      reponse: "Poser Y = y² (ou étudier x en fonction de √y)",
      explication: "Poser Y = y² (ou étudier x en fonction de √y) : une allure de parabole correspond à une relation du type y² proportionnel à x, donc c'est en élevant y au carré que le nuage transformé devient aligné.",
    },
    {
      description: "Le nuage de points (x ; y) suit une décroissance qui ralentit, en se rapprochant de 0 sans jamais l'atteindre.",
      reponse: "Poser Y = 1/y",
      explication: "Poser Y = 1/y : une décroissance qui ralentit vers 0 est caractéristique d'une relation en 1/x, donc c'est en inversant y qu'on retrouve un nuage aligné.",
    },
    {
      description: "Le nuage de points (x ; y) suit une croissance exponentielle très rapide.",
      reponse: "Poser Y = log(y)",
      explication: "Poser Y = log(y) : une croissance exponentielle devient une droite une fois qu'on prend le logarithme, car log(y) = log(a) + x·log(q) pour une suite géométrique de raison q.",
    },
  ]);
  return {
    type: "qcm",
    chapter: "Statistiques à deux variables (Terminale techno) — Changement de variable",
    prompt: `« ${cas.description} » Quel changement de variable peut permettre un ajustement affine du nuage transformé ?`,
    answer: cas.reponse,
    options: shuffle(["Poser Y = y² (ou étudier x en fonction de √y)", "Poser Y = 1/y", "Poser Y = log(y)"]),
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 3. Utiliser un ajustement affine sur la variable transformée pour revenir au modèle d'origine ----------
function genRevenirModeleOrigineNumeric() {
  const a = pick([2, 3, 0.5, -1, -2]);
  const b = randInt(-5, 15);
  const x = randInt(1, 15);
  // Y = log(y) = ax + b, donc y = 10^(ax+b)
  const Y = roundTo(a * x + b, 3);
  const answer = roundTo(10 ** Y, 2);
  return {
    type: "numeric",
    chapter: "Statistiques à deux variables (Terminale techno) — Retour au modèle",
    prompt: `On a effectué le changement de variable \\(Y = \\log(y)\\), et l'ajustement affine obtenu sur le nuage transformé est \\(Y = ${fr(a)}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). En revenant au modèle d'origine (\\(y = 10^Y\\)), estime la valeur de \\(y\\) pour \\(x = ${x}\\) (arrondi au centième).`,
    answer,
    tolerance: 0.5,
    steps: [
      { type: "calcul", text: `Y = ${fr(a)} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${fr(Y)}` },
      { type: "regle", text: "Comme Y = log(y), on revient à y en calculant y = 10^Y." },
      { type: "resultat", text: `y = 10^{${fr(Y)}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 4. Lire un nuage de points transformé (Y en fonction de x) et vérifier l'alignement ----------
function genLectureNuageTransformeQCM() {
  const alignes = Math.random() < 0.5;
  const a = pick([1, 2, -1]);
  const b = randInt(-3, 3);
  const points = [];
  for (let x = 1; x <= 6; x++) {
    const bruit = alignes ? 0 : pick([-2, 2, -3, 3]) * (x % 3 === 0 ? 1 : 0);
    points.push({ x, y: roundTo(a * x + b + bruit, 2) });
  }
  const answer = alignes ? "Le nuage transformé est globalement aligné : un ajustement affine est pertinent" : "Le nuage transformé n'est pas aligné : ce changement de variable n'est pas le bon";
  const explication = alignes
    ? "Les points (x ; Y) sont globalement alignés le long d'une droite : le changement de variable choisi était le bon, un ajustement affine est pertinent sur le nuage transformé."
    : "Les points (x ; Y) ne sont pas alignés (certains s'écartent nettement d'une droite) : ce changement de variable ne linéarise pas le phénomène, il faut en essayer un autre.";
  return {
    type: "qcm",
    chapter: "Statistiques à deux variables (Terminale techno) — Changement de variable",
    prompt: `On donne ci-dessous le nuage de points \\((x \\, ; \\, Y)\\) obtenu après un changement de variable. Que peut-on en conclure ?`,
    answer,
    options: ["Le nuage transformé est globalement aligné : un ajustement affine est pertinent", "Le nuage transformé n'est pas aligné : ce changement de variable n'est pas le bon"],
    steps: [{ type: "regle", text: explication }],
    graph: { xMin: 0, xMax: 7, yMin: Math.min(...points.map((p) => p.y)) - 2, yMax: Math.max(...points.map((p) => p.y)) + 2, points },
  };
}

// ---------- 5. Point moyen (rappel Première) ----------
function genPointMoyenNumeric() {
  const xs = [randInt(1, 15), randInt(1, 15), randInt(1, 15), randInt(1, 15)];
  const xMoy = roundTo(xs.reduce((a, b) => a + b, 0) / xs.length, 2);
  return {
    type: "numeric",
    chapter: "Statistiques à deux variables (Terminale techno) — Point moyen",
    prompt: `Un nuage de points a pour abscisses : ${xs.join(", ")}. Calcule \\(\\bar{x}\\) (arrondi au centième).`,
    answer: xMoy,
    tolerance: 0.02,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : x̄ = (x₁ + x₂ + ... + xₙ) / n." },
      { type: "resultat", text: `\\bar{x} = \\dfrac{${xs.join(" + ")}}{${xs.length}} = ${fr(xMoy)}` },
    ],
  };
}

// ---------- 6. Reconnaître pourquoi un ajustement affine direct ne convient pas ----------
function genReconnaitreAjustementDirectQCM() {
  const cas = pick([
    {
      description: "Le nuage de points (x ; y) présente une courbure nette (les points ne sont pas alignés, mais suivent une courbe régulière).",
      reponse: "Un ajustement affine direct n'est pas adapté : il faut un changement de variable",
      explication: "Un ajustement affine direct n'est pas adapté : une droite ne peut pas suivre une courbure nette. Il faut transformer une des deux variables (carré, inverse, log...) pour se ramener à un nuage aligné.",
    },
    {
      description: "Le nuage de points (x ; y) est globalement aligné le long d'une droite.",
      reponse: "Un ajustement affine direct est adapté, sans changement de variable",
      explication: "Un ajustement affine direct est adapté : si le nuage est déjà globalement aligné, une droite le modélise bien sans qu'il soit nécessaire de transformer une variable.",
    },
  ]);
  return {
    type: "qcm",
    chapter: "Statistiques à deux variables (Terminale techno) — Changement de variable",
    prompt: `« ${cas.description} » Quelle est la bonne approche ?`,
    answer: cas.reponse,
    options: ["Un ajustement affine direct n'est pas adapté : il faut un changement de variable", "Un ajustement affine direct est adapté, sans changement de variable"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

const GENERATORS = [
  genCalculerChangementVariableNumeric,
  genChoisirChangementVariableQCM,
  genRevenirModeleOrigineNumeric,
  genLectureNuageTransformeQCM,
  genPointMoyenNumeric,
  genReconnaitreAjustementDirectQCM,
];

const DIFFICULTY = {
  genCalculerChangementVariableNumeric: "facile",
  genPointMoyenNumeric: "facile",
  genReconnaitreAjustementDirectQCM: "facile",
  genChoisirChangementVariableQCM: "standard",
  genLectureNuageTransformeQCM: "standard",
  genRevenirModeleOrigineNumeric: "expert",
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
    id: "statistiques-deux-variables-terminale-techno",
    title: "Statistiques à deux variables (ajustement non affine)",
    description: "Changement de variable (Y = u², 1/t, log(y)...) pour se ramener à un ajustement affine, retour au modèle d'origine.",
    pourquoi: "Changer de variable pour ajuster un nuage de points, c'est aller au-delà de la simple droite pour modéliser des phénomènes qui accélèrent, ralentissent ou explosent.",
    level: "terminale-techno",
    order: 6,
    cours: {
      mindMap: {
        title: "Statistiques à deux variables (ajustement non affine)",
        branches: [
          {
            title: "Pourquoi changer de variable",
            items: [
              "Quand le nuage de points \\((x;y)\\) n'est pas aligné, une droite d'ajustement directe serait peu fiable.",
              "On transforme y en une nouvelle variable Y (ex : \\(Y=y^2\\), \\(Y=\\frac{1}{y}\\), \\(Y=\\ln y\\)) pour que le nuage \\((x;Y)\\) devienne, lui, aligné.",
            ],
          },
          {
            title: "Choisir le bon changement de variable",
            items: [
              "L'allure du nuage de départ guide le choix (courbe qui explose, qui plafonne, qui ralentit...).",
            ],
          },
          {
            title: "Ajustement affine sur les données transformées",
            items: [
              "Une fois le nuage \\((x;Y)\\) aligné, on lui applique les méthodes habituelles (Mayer, point moyen) pour trouver \\(Y=ax+b\\).",
            ],
          },
          {
            title: "Revenir au modèle d'origine",
            items: [
              "Piège classique très fréquent : oublier l'étape finale — remplacer Y par son expression en y pour retrouver le modèle en y.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
