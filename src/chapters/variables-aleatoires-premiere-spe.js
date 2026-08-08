// ---------------------------------------------------------------------------
// Chapitre : Variables aléatoires réelles (Première Spé)
// Ce fichier ne contient QUE du contenu (générateurs d'exercices + métadonnées).
// L'affichage (mode Classique/Jeu, pavé numérique, QCM, aide progressive) est
// géré par le composant générique <ChapterRunner /> pour tous les chapitres.
//
// Convention LaTeX : tout passage mathématique est entouré de \( ... \)
// (rendu ensuite en jolie notation par le composant <MathText />, voir
// src/components/MathText.jsx). Le reste du texte reste du français normal.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr() pour utiliser la virgule française — voir fr() ci-dessous.
//
// NOTE (audit programme 2026) : ajout de la loi binomiale nommée \(B(n,p)\)
// (genIdentifierParametresBinomialeQCM, genEsperanceLoiBinomialeNumeric,
// genVarianceLoiBinomialeNumeric, genEcartTypeLoiBinomialeNumeric,
// genProbabiliteExtremeBinomialeNumeric). Le calcul explicite de P(X=k) via
// les coefficients binomiaux \(\binom{n}{k}\) reste hors-programme ici (relève
// de la combinatoire, introduite en Terminale Spé) ; seuls les cas extrêmes
// P(X=0) et P(X=n), qui ne nécessitent aucun coefficient binomial, sont
// traités.
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

// =========================== Générateurs paramétrés ===========================

// ---------- 1. Loi de probabilité : retrouver une probabilité manquante ----------
function genLoiProbabiliteCompleterNumeric() {
  const p1 = pick([0.1, 0.2, 0.25, 0.3]);
  const p2 = pick([0.1, 0.2, 0.25, 0.3]);
  const p3 = pick([0.1, 0.2]);
  const answer = roundTo(1 - p1 - p2 - p3, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Loi de probabilité",
    prompt: `Une variable aléatoire \\(X\\) prend les valeurs \\(1\\), \\(2\\), \\(3\\), \\(4\\), avec \\(P(X=1) = ${fr(p1)}\\), \\(P(X=2) = ${fr(p2)}\\), \\(P(X=3) = ${fr(p3)}\\). Calcule \\(P(X=4)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{La somme des probabilités d'une loi vaut toujours 1.}` },
      { type: "resultat", text: `P(X=4) = 1 - ${fr(p1)} - ${fr(p2)} - ${fr(p3)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 2. Espérance d'une variable aléatoire ----------
function genEsperanceNumeric() {
  const valeurs = [randInt(-5, 0), randInt(1, 3), randInt(4, 8)];
  const p1 = pick([0.2, 0.3, 0.4]);
  const p2 = pick([0.2, 0.3]);
  const p3 = roundTo(1 - p1 - p2, 4);
  const answer = roundTo(valeurs[0] * p1 + valeurs[1] * p2 + valeurs[2] * p3, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Espérance",
    prompt: `Une variable aléatoire \\(X\\) suit la loi : \\(P(X=${valeurs[0]}) = ${fr(p1)}\\), \\(P(X=${valeurs[1]}) = ${fr(p2)}\\), \\(P(X=${valeurs[2]}) = ${fr(p3)}\\). Calcule l'espérance \\(E(X)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{Formule de référence : } E(X) = \\sum x_i \\times p_i.` },
      { type: "calcul", text: `E(X) = ${valeurs[0]} \\times ${fr(p1)} + ${valeurs[1]} \\times ${fr(p2)} + ${valeurs[2]} \\times ${fr(p3)}` },
      { type: "resultat", text: `E(X) = ${fr(roundTo(valeurs[0] * p1, 4))} + ${fr(roundTo(valeurs[1] * p2, 4))} + ${fr(roundTo(valeurs[2] * p3, 4))} = ${fr(answer)}` },
    ],
  };
}

// ---------- 3. Variance via la formule de König-Huygens ----------
function genVarianceKonigHuygensNumeric() {
  const EX = pick([1, 2, 3, -1, -2]);
  const EX2 = EX * EX + randInt(1, 8);
  const answer = roundTo(EX2 - EX * EX, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Variance",
    prompt: `Une variable aléatoire \\(X\\) vérifie \\(E(X) = ${EX}\\) et \\(E(X^2) = ${EX2}\\). Calcule la variance \\(V(X)\\) à l'aide de la formule de König-Huygens \\(V(X) = E(X^2) - [E(X)]^2\\).`,
    answer,
    steps: [{ type: "resultat", text: `V(X) = ${EX2} - (${EX})^2 = ${EX2} - ${EX * EX} = ${answer}` }],
  };
}

// ---------- 4. Écart-type à partir de la variance ----------
function genEcartTypeNumeric() {
  const variances = [4, 9, 16, 25, 36, 49, 64];
  const V = pick(variances);
  const answer = Math.sqrt(V);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Écart-type",
    prompt: `Une variable aléatoire \\(X\\) a pour variance \\(V(X) = ${V}\\). Calcule son écart-type \\(\\sigma(X) = \\sqrt{V(X)}\\).`,
    answer,
    steps: [{ type: "resultat", text: `\\sigma(X) = \\sqrt{${V}} = ${answer}` }],
  };
}

// ---------- 5. Linéarité de l'espérance : E(aX + b) ----------
function genLineariteEsperanceNumeric() {
  const EX = randInt(-6, 6);
  const a = nonZero(-5, 5);
  const b = randInt(-10, 10);
  const answer = a * EX + b;
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Linéarité de l'espérance",
    prompt: `Une variable aléatoire \\(X\\) vérifie \\(E(X) = ${EX}\\). Calcule \\(E(${a}X ${b >= 0 ? "+" : "-"} ${Math.abs(b)})\\) (formule \\(E(aX+b) = aE(X)+b\\)).`,
    answer,
    steps: [{ type: "resultat", text: `E(${a}X ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) = ${a} \\times ${EX} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${a * EX} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}` }],
  };
}

// ---------- 6. Linéarité de la variance : V(aX + b) = a²V(X) ----------
function genLineariteVarianceNumeric() {
  const VX = pick([2, 3, 4, 5, 6]);
  const a = nonZero(-4, 4);
  const answer = a * a * VX;
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Linéarité de la variance",
    prompt: `Une variable aléatoire \\(X\\) vérifie \\(V(X) = ${VX}\\). Calcule \\(V(${a}X + 5)\\) (formule \\(V(aX+b) = a^2 V(X)\\), le terme \\(b\\) n'a aucun effet sur la variance).`,
    answer,
    steps: [{ type: "resultat", text: `V(${a}X + 5) = ${a}^2 \\times V(X) = ${a * a} \\times ${VX} = ${answer}` }],
  };
}

// ---------- 7. Jeu équitable : déterminer le gain manquant ----------
function genJeuEquitableNumeric() {
  const gain1 = randInt(2, 10);
  const p1 = pick([0.2, 0.25, 0.4, 0.5]);
  const perte = randInt(1, 5);
  const p2 = roundTo(1 - p1, 4);
  const answer = roundTo((perte * p2) / p1, 2);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Jeu équitable",
    prompt: `Dans un jeu, on gagne \\(g\\) euros avec une probabilité de \\(${fr(p1)}\\), ou on perd \\(${perte}\\) euros avec une probabilité de \\(${fr(p2)}\\). Pour que le jeu soit équitable (espérance de gain nulle), calcule la valeur de \\(g\\) (valeur arrondie au centième).`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Un jeu est équitable quand l'espérance de gain est nulle : } E(\\text{gain}) = g \\times ${fr(p1)} - ${perte} \\times ${fr(p2)} = 0.` },
      { type: "resultat", text: `g = \\dfrac{${perte} \\times ${fr(p2)}}{${fr(p1)}} = ${fr(answer)}` },
    ],
  };
}

// ---------- 8. Lecture de P(X = a) dans une loi de probabilité ----------
function genLecturePXEgalANumeric() {
  const p1 = pick([0.1, 0.2, 0.3]);
  const p2 = pick([0.15, 0.25, 0.35]);
  const p3 = roundTo(1 - p1 - p2, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Loi de probabilité",
    prompt: `Une variable aléatoire \\(X\\) suit la loi : \\(P(X=1) = ${fr(p1)}\\), \\(P(X=2) = ${fr(p2)}\\), \\(P(X=3) = ${fr(p3)}\\). Donne la valeur de \\(P(X=3)\\).`,
    answer: p3,
    tolerance: 0.0005,
    steps: [{ type: "regle", text: `\\text{On lit directement la probabilité associée à la valeur 3 dans la loi de probabilité : } P(X=3) = ${fr(p3)}.` }],
  };
}

// ---------- 9. Calcul de P(X ≤ a) (cumul) ----------
function genPXInferieurEgalNumeric() {
  const p1 = pick([0.1, 0.15, 0.2]);
  const p2 = pick([0.2, 0.25, 0.3]);
  const p3 = pick([0.1, 0.15]);
  const p4 = roundTo(1 - p1 - p2 - p3, 4);
  const answer = roundTo(p1 + p2 + p3, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Loi de probabilité",
    prompt: `Une variable aléatoire \\(X\\) prend les valeurs \\(1, 2, 3, 4\\) avec \\(P(X=1) = ${fr(p1)}\\), \\(P(X=2) = ${fr(p2)}\\), \\(P(X=3) = ${fr(p3)}\\), \\(P(X=4) = ${fr(p4)}\\). Calcule \\(P(X \\leq 3)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `P(X \\leq 3) \\text{ est la somme des probabilités de toutes les valeurs inférieures ou égales à 3.}` },
      { type: "resultat", text: `P(X \\leq 3) = ${fr(p1)} + ${fr(p2)} + ${fr(p3)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 10. Interpréter les notations {X=a} et {X≤a} ----------
function genInterpreterNotationsQCM() {
  const cas = pick([
    {
      description: "P(X = 3)",
      reponse: "La probabilité que X soit exactement égal à 3",
      explication: `\\text{Le symbole '=' dans } P(X=3) \\text{ désigne une égalité stricte : c'est la probabilité que la variable prenne précisément la valeur 3, ni plus ni moins.}`,
    },
    {
      description: "P(X \\leq 3)",
      reponse: "La probabilité que X soit inférieur ou égal à 3",
      explication: `\\text{Le symbole '} \\leq \\text{' désigne un cumul : } P(X \\leq 3) \\text{ additionne les probabilités de toutes les valeurs possibles jusqu'à 3 inclus.}`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Variables aléatoires — Notations",
    prompt: `Comment interprète-t-on \\(${cas.description}\\) ?`,
    answer: cas.reponse,
    options: ["La probabilité que X soit exactement égal à 3", "La probabilité que X soit inférieur ou égal à 3"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 11. Calcul d'espérance dans un jeu simple ----------
function genEsperanceJeuNumeric() {
  const gain = randInt(5, 20);
  const perte = randInt(1, 8);
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4]);
  const q = roundTo(1 - p, 4);
  const answer = roundTo(gain * p - perte * q, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Espérance",
    prompt: `Dans un jeu, un joueur gagne \\(${gain}\\) euros avec une probabilité de \\(${fr(p)}\\), ou perd \\(${perte}\\) euros avec une probabilité de \\(${fr(q)}\\). Calcule l'espérance de gain de ce jeu.`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{L'espérance de gain est la somme des gains pondérés par leur probabilité (une perte compte négativement).}` },
      { type: "resultat", text: `E(\\text{gain}) = ${gain} \\times ${fr(p)} - ${perte} \\times ${fr(q)} = ${fr(roundTo(gain * p, 4))} - ${fr(roundTo(perte * q, 4))} = ${fr(answer)}` },
    ],
  };
}

// ---------- 12. Comparer deux jeux par leur espérance ----------
function genComparerJeuxQCM() {
  const e1 = roundTo(randInt(-5, 5) + Math.random() * 0.9, 2);
  let e2 = roundTo(randInt(-5, 5) + Math.random() * 0.9, 2);
  while (roundTo(e2, 1) === roundTo(e1, 1)) e2 = roundTo(randInt(-5, 5) + Math.random() * 0.9, 2);
  const meilleur = e1 > e2 ? "Jeu 1" : "Jeu 2";
  return {
    type: "qcm",
    chapter: "Variables aléatoires — Comparaison de jeux",
    prompt: `Le jeu 1 a une espérance de gain de \\(${fr(e1)}\\) euros. Le jeu 2 a une espérance de gain de \\(${fr(e2)}\\) euros. Quel jeu est le plus avantageux pour le joueur ?`,
    answer: meilleur,
    options: ["Jeu 1", "Jeu 2"],
    steps: [{ type: "regle", text: `\\text{Le jeu le plus avantageux est celui dont l'espérance de gain est la plus élevée : ${meilleur}.}` }],
  };
}

// ---------- 13. Vrai ou faux sur l'espérance et la variance ----------
function genVraiFauxVariablesAleatoiresQCM() {
  const cas = pick([
    {
      description: "L'espérance E(aX+b) est égale à aE(X)+b.",
      reponse: "Vrai",
      explication: `\\text{C'est la formule de linéarité de l'espérance, qui s'applique à toute transformation affine de X.}`,
    },
    {
      description: "La variance mesure la dispersion des valeurs autour de l'espérance.",
      reponse: "Vrai",
      explication: `\\text{Par définition, } V(X) = E\\left[(X - E(X))^2\\right] \\text{ : plus les valeurs de X s'écartent de sa moyenne, plus la variance est grande.}`,
    },
    {
      description: "V(X) = E(X²) + [E(X)]².",
      reponse: "Faux",
      explication: `\\text{Attention au signe : la formule de König-Huygens est } V(X) = E(X^2) - [E(X)]^2, \\text{ avec un MOINS, pas un plus.}`,
    },
    {
      description: "L'écart-type est toujours positif ou nul.",
      reponse: "Vrai",
      explication: `\\text{L'écart-type est défini comme } \\sigma(X) = \\sqrt{V(X)}, \\text{ une racine carrée, donc toujours} \\geq 0.`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Variables aléatoires — Vrai ou faux",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 14. Variance depuis une loi à deux valeurs (type Bernoulli) ----------
function genVarianceLoiDeuxValeursNumeric() {
  const x1 = 0;
  const x2 = 1;
  const p = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
  const q = roundTo(1 - p, 4);
  const EX = p;
  const EX2 = p; // car x2^2 = 1 = x2
  const answer = roundTo(EX2 - EX * EX, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Variance",
    prompt: `Une variable aléatoire \\(X\\) prend la valeur \\(1\\) avec probabilité \\(${fr(p)}\\), et la valeur \\(0\\) avec probabilité \\(${fr(q)}\\). Calcule la variance \\(V(X)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{On calcule d'abord } E(X) \\text{ et } E(X^2), \\text{ puis on applique } V(X) = E(X^2) - [E(X)]^2.` },
      { type: "calcul", text: `E(X) = 1 \\times ${fr(p)} + 0 \\times ${fr(q)} = ${fr(p)}, \\quad E(X^2) = 1^2 \\times ${fr(p)} + 0^2 \\times ${fr(q)} = ${fr(p)}` },
      { type: "resultat", text: `V(X) = ${fr(p)} - (${fr(p)})^2 = ${fr(answer)}` },
    ],
  };
}

// ---------- 15. Retrouver E(X) connaissant E(aX+b) ----------
function genRetrouverEsperanceNumeric() {
  const a = nonZero(-5, 5);
  const b = randInt(-10, 10);
  const EX = randInt(-8, 8);
  const EaXb = a * EX + b;
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Linéarité de l'espérance",
    prompt: `On sait que \\(E(${a}X ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) = ${EaXb}\\). Calcule \\(E(X)\\).`,
    answer: EX,
    steps: [
      { type: "regle", text: `\\text{On part de la formule de linéarité : } ${a} \\times E(X) ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${EaXb}, \\text{ et on isole } E(X).` },
      { type: "resultat", text: `E(X) = \\dfrac{${EaXb} ${b >= 0 ? "-" : "+"} ${Math.abs(b)}}{${a}} = \\dfrac{${EaXb - b}}{${a}} = ${EX}` },
    ],
  };
}

// ---------- 16. Identifier les paramètres n et p d'une loi binomiale ----------
function genIdentifierParametresBinomialeQCM() {
  const contextes = [
    { texte: "On lance un dé équilibré à 6 faces $n$ fois de suite et on compte le nombre de fois où l'on obtient un 6", n: pick([10, 15, 20]), p: "\\dfrac{1}{6}" },
    { texte: "On répète $n$ fois, de manière indépendante, un tirage avec remise dans une urne contenant 30% de boules rouges, et on compte le nombre de boules rouges obtenues", n: pick([8, 12, 25]), p: "0,3" },
    { texte: "Un examen QCM comporte $n$ questions indépendantes, chacune avec une probabilité de 0,25 de répondre juste au hasard ; on compte le nombre de bonnes réponses", n: pick([10, 20, 30]), p: "0,25" },
  ];
  const cas = pick(contextes);
  const texte = cas.texte.replace("$n$", cas.n);
  const correct = `\\(B(${cas.n} ; ${cas.p})\\)`;
  const distracteurs = shuffle([
    `\\(B(${cas.p} ; ${cas.n})\\)`,
    `\\(B(${cas.n + 1} ; ${cas.p})\\)`,
    `\\(\\mathcal{N}(${cas.n} ; ${cas.p})\\)`,
  ]).slice(0, 3);
  return {
    type: "qcm",
    chapter: "Variables aléatoires — Loi binomiale",
    prompt: `${texte}. On répète une épreuve de Bernoulli de manière identique et indépendante : quelle est la loi suivie par le nombre de succès \\(X\\) obtenus ?`,
    answer: correct,
    options: shuffle([correct, ...distracteurs]),
    steps: [{ type: "regle", text: `\\text{Quand on répète } n \\text{ fois, de façon indépendante, une épreuve de Bernoulli de paramètre } p, \\text{ le nombre de succès suit la loi binomiale } B(n ; p).` }],
  };
}

// ---------- 17. Espérance d'une loi binomiale : E(X) = np ----------
function genEsperanceLoiBinomialeNumeric() {
  const n = pick([10, 20, 25, 40, 50]);
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
  const answer = roundTo(n * p, 3);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Loi binomiale",
    prompt: `Une variable aléatoire \\(X\\) suit la loi binomiale \\(B(${n} ; ${fr(p)})\\). Calcule son espérance \\(E(X)\\) (formule \\(E(X) = np\\)).`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{Formule de référence à connaître : si } X \\sim B(n ; p), \\text{ alors } E(X) = np.` },
      { type: "resultat", text: `E(X) = ${n} \\times ${fr(p)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 18. Variance d'une loi binomiale : V(X) = np(1-p) ----------
function genVarianceLoiBinomialeNumeric() {
  const n = pick([10, 20, 25, 40, 50]);
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
  const q = roundTo(1 - p, 3);
  const answer = roundTo(n * p * q, 3);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Loi binomiale",
    prompt: `Une variable aléatoire \\(X\\) suit la loi binomiale \\(B(${n} ; ${fr(p)})\\). Calcule sa variance \\(V(X)\\) (formule \\(V(X) = np(1-p)\\)).`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{Formule de référence à connaître : si } X \\sim B(n ; p), \\text{ alors } V(X) = np(1-p).` },
      { type: "resultat", text: `V(X) = ${n} \\times ${fr(p)} \\times (1 - ${fr(p)}) = ${n} \\times ${fr(p)} \\times ${fr(q)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 19. Écart-type d'une loi binomiale ----------
function genEcartTypeLoiBinomialeNumeric() {
  const n = pick([16, 25, 36, 49, 64, 100]);
  const p = pick([0.25, 0.5]);
  const V = n * p * (1 - p);
  const answer = roundTo(Math.sqrt(V), 3);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Loi binomiale",
    prompt: `Une variable aléatoire \\(X\\) suit la loi binomiale \\(B(${n} ; ${fr(p)})\\). Calcule son écart-type \\(\\sigma(X) = \\sqrt{V(X)}\\) (valeur arrondie au millième).`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{On calcule d'abord la variance } V(X) = np(1-p), \\text{ puis } \\sigma(X) = \\sqrt{V(X)}.` },
      { type: "resultat", text: `V(X) = ${n} \\times ${fr(p)} \\times ${fr(roundTo(1 - p, 3))} = ${fr(roundTo(V, 3))} \\ \\Rightarrow \\ \\sigma(X) = \\sqrt{${fr(roundTo(V, 3))}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 20. Probabilité d'un cas extrême : P(X=0) ou P(X=n) ----------
function genProbabiliteExtremeBinomialeNumeric() {
  const n = pick([3, 4, 5]);
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
  const cas = pick(["zero", "n"]);
  const answer = roundTo(cas === "zero" ? (1 - p) ** n : p ** n, 4);
  const evenement = cas === "zero" ? "P(X=0)" : `P(X=${n})`;
  const explication =
    cas === "zero"
      ? `\\text{Aucun succès sur les } ${n} \\text{ répétitions signifie un échec à chaque fois : } P(X=0) = (1-p)^{${n}}.`
      : `\\text{Un succès à chaque répétition (les } ${n} \\text{ fois) : } P(X=${n}) = p^{${n}}.`;
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Loi binomiale",
    prompt: `Une variable aléatoire \\(X\\) suit la loi binomiale \\(B(${n} ; ${fr(p)})\\). Calcule \\(${evenement}\\) (valeur arrondie au dix-millième).`,
    answer,
    tolerance: 0.0001,
    steps: [
      { type: "regle", text: explication },
      { type: "resultat", text: `${evenement} = ${fr(answer)}` },
    ],
  };
}

const GENERATORS = [
  genLoiProbabiliteCompleterNumeric,
  genEsperanceNumeric,
  genVarianceKonigHuygensNumeric,
  genEcartTypeNumeric,
  genLineariteEsperanceNumeric,
  genLineariteVarianceNumeric,
  genJeuEquitableNumeric,
  genLecturePXEgalANumeric,
  genPXInferieurEgalNumeric,
  genInterpreterNotationsQCM,
  genEsperanceJeuNumeric,
  genComparerJeuxQCM,
  genVraiFauxVariablesAleatoiresQCM,
  genVarianceLoiDeuxValeursNumeric,
  genRetrouverEsperanceNumeric,
  genIdentifierParametresBinomialeQCM,
  genEsperanceLoiBinomialeNumeric,
  genVarianceLoiBinomialeNumeric,
  genEcartTypeLoiBinomialeNumeric,
  genProbabiliteExtremeBinomialeNumeric,
];

const DIFFICULTY = {
  genLoiProbabiliteCompleterNumeric: "facile",
  genEsperanceNumeric: "facile",
  genLecturePXEgalANumeric: "facile",
  genInterpreterNotationsQCM: "facile",
  genEcartTypeNumeric: "standard",
  genLineariteEsperanceNumeric: "standard",
  genJeuEquitableNumeric: "standard",
  genPXInferieurEgalNumeric: "standard",
  genEsperanceJeuNumeric: "standard",
  genVraiFauxVariablesAleatoiresQCM: "standard",
  genVarianceLoiDeuxValeursNumeric: "standard",
  genVarianceKonigHuygensNumeric: "expert",
  genLineariteVarianceNumeric: "expert",
  genComparerJeuxQCM: "expert",
  genRetrouverEsperanceNumeric: "expert",
  genIdentifierParametresBinomialeQCM: "standard",
  genEsperanceLoiBinomialeNumeric: "facile",
  genVarianceLoiBinomialeNumeric: "standard",
  genEcartTypeLoiBinomialeNumeric: "standard",
  genProbabiliteExtremeBinomialeNumeric: "expert",
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
    id: "variables-aleatoires-premiere-spe",
    title: "Variables aléatoires réelles",
    description: "Loi de probabilité, espérance, variance, écart-type, linéarité de l'espérance, jeu équitable, loi binomiale B(n,p).",
    pourquoi: "Une variable aléatoire et son espérance permettent de prévoir le résultat moyen d'un jeu, d'un pari ou d'une décision incertaine.",
    level: "premiere-spe",
    order: 11,
    cours: {
      mindMap: {
        title: "Variables aléatoires réelles",
        branches: [
          {
            title: "Loi de probabilité",
            items: [
              "Associe à chaque valeur possible de X sa probabilité ; la somme de toutes les probabilités vaut toujours 1.",
              "\\(P(X \\leqslant a)\\) (notation à ne pas confondre avec \\(P(X=a)\\)) s'obtient en additionnant les probabilités de toutes les valeurs inférieures ou égales à a.",
            ],
          },
          {
            title: "Espérance",
            items: [
              "L'espérance est la moyenne théorique : ce que l'on gagnerait en moyenne en répétant l'expérience un grand nombre de fois.",
              "Jeu équitable : espérance de gain nulle.",
              "Pour comparer deux jeux ou deux décisions, le plus avantageux est celui dont l'espérance est la plus grande.",
            ],
            formula: "\\(E(X) = \\sum_i p_i x_i\\)",
          },
          {
            title: "Variance et écart-type",
            items: [
              "La formule de König-Huygens évite de calculer les écarts à la moyenne un par un.",
              "L'écart-type (racine carrée de la variance) s'exprime dans la même unité que X, contrairement à la variance.",
            ],
            formula: "\\(V(X) = E(X^2) - [E(X)]^2\\), \\(\\sigma(X) = \\sqrt{V(X)}\\)",
          },
          {
            title: "Linéarité de l'espérance",
            items: [
              "Piège classique : la variance ne suit pas la même règle que l'espérance (le carré de a intervient).",
            ],
            formula: "\\(E(aX+b) = aE(X)+b\\), \\(V(aX+b) = a^2V(X)\\)",
          },
          {
            title: "Loi binomiale B(n,p)",
            items: [
              "Compte le nombre de succès sur n répétitions indépendantes d'une épreuve de Bernoulli de paramètre p.",
              "Cas extrêmes faciles à calculer sans coefficient binomial : aucun succès (échec à chaque fois), ou succès à chaque fois.",
            ],
            formula: "\\(E(X)=np\\), \\(V(X)=np(1-p)\\), \\(P(X=0)=(1-p)^n,\\ P(X=n)=p^n\\)",
          },
        ],
      },
    },
  },
  generate,
};
