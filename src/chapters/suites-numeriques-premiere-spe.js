// ---------------------------------------------------------------------------
// Chapitre : Suites numériques, modèles discrets (Première Spé)
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

// ---------- 1. Calcul d'un terme via une relation de récurrence arithmétique ----------
function genTermeRecurrenceArithmetiqueNumeric() {
  const u0 = randInt(-15, 15);
  const r = nonZero(-9, 9);
  const n = randInt(1, 4);
  const answer = u0 + n * r;
  return {
    type: "numeric",
    chapter: "Suites — Récurrence arithmétique",
    prompt: `Une suite \\((u_n)\\) est définie par \\(u_0 = ${u0}\\) et, pour tout entier \\(n\\), \\(u_{n+1} = u_n ${r >= 0 ? "+" : "-"} ${Math.abs(r)}\\). Calcule \\(u_{${n}}\\).`,
    answer,
    steps: [
      `\\text{On ajoute } ${r} \\text{ à chaque étape, } ${n} \\text{ fois de suite.}`,
      `u_{${n}} = ${u0} ${r >= 0 ? "+" : "-"} ${Math.abs(r)} \\times ${n} = ${answer}`,
    ],
  };
}

// ---------- 2. Calcul d'un terme via une relation de récurrence géométrique ----------
function genTermeRecurrenceGeometriqueNumeric() {
  const u0 = pick([1, 2, 3, 4, 5]) * pick([1, -1]);
  const q = pick([2, 3, -2, -3]);
  const n = randInt(1, 4);
  const answer = u0 * q ** n;
  return {
    type: "numeric",
    chapter: "Suites — Récurrence géométrique",
    prompt: `Une suite \\((u_n)\\) est définie par \\(u_0 = ${u0}\\) et, pour tout entier \\(n\\), \\(u_{n+1} = ${q} \\times u_n\\). Calcule \\(u_{${n}}\\).`,
    answer,
    steps: [
      `\\text{On multiplie par } ${q} \\text{ à chaque étape, } ${n} \\text{ fois de suite.}`,
      `u_{${n}} = ${u0} \\times ${q}^{${n}} = ${answer}`,
    ],
  };
}

// ---------- 3. Terme général d'une suite arithmétique ----------
function genTermeGeneralArithmetiqueNumeric() {
  const u0 = randInt(-20, 20);
  const r = nonZero(-8, 8);
  const n = randInt(5, 30);
  const answer = u0 + n * r;
  return {
    type: "numeric",
    chapter: "Suites — Terme général (arithmétique)",
    prompt: `\\((u_n)\\) est une suite arithmétique de premier terme \\(u_0 = ${u0}\\) et de raison \\(r = ${r}\\). Calcule \\(u_{${n}}\\) en utilisant la formule \\(u_n = u_0 + nr\\).`,
    answer,
    steps: [`u_{${n}} = u_0 + ${n} \\times r = ${u0} + ${n} \\times (${r}) = ${answer}`],
  };
}

// ---------- 4. Terme général d'une suite géométrique ----------
function genTermeGeneralGeometriqueNumeric() {
  const u0 = pick([1, 2, 3, 4, 5, -1, -2, -3]);
  const q = pick([2, 3, -2]);
  const n = randInt(2, 6);
  const answer = u0 * q ** n;
  return {
    type: "numeric",
    chapter: "Suites — Terme général (géométrique)",
    prompt: `\\((u_n)\\) est une suite géométrique de premier terme \\(u_0 = ${u0}\\) et de raison \\(q = ${q}\\). Calcule \\(u_{${n}}\\) en utilisant la formule \\(u_n = u_0 \\times q^n\\).`,
    answer,
    steps: [`u_{${n}} = u_0 \\times q^{${n}} = ${u0} \\times ${q}^{${n}} = ${u0} \\times ${q ** n} = ${answer}`],
  };
}

// ---------- 5. Déterminer la raison d'une suite arithmétique ----------
function genRaisonArithmetiqueNumeric() {
  const r = nonZero(-12, 12);
  const uA = randInt(-30, 30);
  const uB = uA + r;
  return {
    type: "numeric",
    chapter: "Suites — Raison arithmétique",
    prompt: `\\((u_n)\\) est une suite arithmétique telle que \\(u_5 = ${uA}\\) et \\(u_6 = ${uB}\\). Détermine la raison \\(r\\) de cette suite.`,
    answer: r,
    steps: [`r = u_6 - u_5 = ${uB} - (${uA}) = ${r}`],
  };
}

// ---------- 6. Déterminer la raison d'une suite géométrique ----------
function genRaisonGeometriqueNumeric() {
  const q = pick([2, 3, 4, -2, -3]);
  const uA = nonZero(-10, 10);
  const uB = uA * q;
  return {
    type: "numeric",
    chapter: "Suites — Raison géométrique",
    prompt: `\\((u_n)\\) est une suite géométrique telle que \\(u_3 = ${uA}\\) et \\(u_4 = ${uB}\\). Détermine la raison \\(q\\) de cette suite.`,
    answer: q,
    steps: [`q = \\dfrac{u_4}{u_3} = \\dfrac{${uB}}{${uA}} = ${q}`],
  };
}

// ---------- 7. Somme de termes consécutifs d'une suite arithmétique ----------
function genSommeArithmetiqueNumeric() {
  const u0 = randInt(-10, 10);
  const r = nonZero(-6, 6);
  const n = randInt(4, 12);
  const uN = u0 + n * r;
  const answer = ((n + 1) * (u0 + uN)) / 2;
  return {
    type: "numeric",
    chapter: "Suites — Somme (arithmétique)",
    prompt: `\\((u_n)\\) est une suite arithmétique de premier terme \\(u_0 = ${u0}\\) et de raison \\(r = ${r}\\). Sachant que \\(u_{${n}} = ${uN}\\), calcule la somme \\(u_0 + u_1 + \\dots + u_{${n}}\\) (${n + 1} termes).`,
    answer,
    steps: [
      `\\text{Somme = (nombre de termes)} \\times \\dfrac{\\text{premier terme + dernier terme}}{2}`,
      `S = ${n + 1} \\times \\dfrac{${u0} + ${uN}}{2} = ${answer}`,
    ],
  };
}

// ---------- 8. Somme 1 + 2 + ... + n ----------
function genSommeEntiersNumeric() {
  const n = randInt(5, 100);
  const answer = (n * (n + 1)) / 2;
  return {
    type: "numeric",
    chapter: "Suites — Somme des n premiers entiers",
    prompt: `Calcule la somme \\(1 + 2 + \\dots + ${n}\\) à l'aide de la formule \\(1 + 2 + \\dots + n = \\dfrac{n(n+1)}{2}\\).`,
    answer,
    steps: [`\\dfrac{${n} \\times (${n} + 1)}{2} = \\dfrac{${n} \\times ${n + 1}}{2} = ${answer}`],
  };
}

// ---------- 9. Somme géométrique 1 + q + ... + q^n ----------
function genSommeGeometriqueNumeric() {
  const q = pick([2, 3, 4]);
  const n = randInt(2, 5);
  const answer = (q ** (n + 1) - 1) / (q - 1);
  return {
    type: "numeric",
    chapter: "Suites — Somme géométrique",
    prompt: `Calcule la somme \\(1 + ${q} + ${q}^2 + \\dots + ${q}^{${n}}\\) à l'aide de la formule \\(1 + q + \\dots + q^n = \\dfrac{q^{n+1} - 1}{q - 1}\\).`,
    answer,
    steps: [`\\dfrac{${q}^{${n + 1}} - 1}{${q} - 1} = \\dfrac{${q ** (n + 1)} - 1}{${q - 1}} = \\dfrac{${q ** (n + 1) - 1}}{${q - 1}} = ${answer}`],
  };
}

// ---------- 10. Sens de variation d'une suite arithmétique ----------
function genSensVariationArithmetiqueQCM() {
  const r = nonZero(-9, 9);
  const answer = r > 0 ? "croissante" : "décroissante";
  return {
    type: "qcm",
    chapter: "Suites — Sens de variation (arithmétique)",
    prompt: `\\((u_n)\\) est une suite arithmétique de raison \\(r = ${r}\\). Quel est son sens de variation ?`,
    answer,
    options: ["croissante", "décroissante", "on ne peut pas savoir"],
    steps: [
      r > 0
        ? `\\text{Comme } r > 0, \\text{ chaque terme est obtenu en ajoutant un nombre positif : la suite est croissante.}`
        : `\\text{Comme } r < 0, \\text{ chaque terme est obtenu en ajoutant un nombre négatif : la suite est décroissante.}`,
    ],
  };
}

// ---------- 11. Sens de variation d'une suite géométrique à termes positifs ----------
function genSensVariationGeometriqueQCM() {
  const u0 = randInt(1, 10);
  const q = pick([0.5, 0.25, 0.2, 2, 3, 4]);
  const answer = q > 1 ? "croissante" : "décroissante";
  return {
    type: "qcm",
    chapter: "Suites — Sens de variation (géométrique)",
    prompt: `\\((u_n)\\) est une suite géométrique à termes strictement positifs, de premier terme \\(u_0 = ${u0}\\) et de raison \\(q = ${fr(q)}\\). Quel est son sens de variation ?`,
    answer,
    options: ["croissante", "décroissante", "constante"],
    steps: [
      q > 1
        ? `\\text{Comme } 0 < 1 < q, \\text{ et les termes sont positifs, la suite est croissante.}`
        : `\\text{Comme } 0 < q < 1, \\text{ et les termes sont positifs, la suite est décroissante.}`,
    ],
  };
}

// ---------- 12. Modéliser un phénomène discret (linéaire vs exponentiel) ----------
function genModeliserPhenomeneQCM() {
  const cas = pick([
    { description: "Un capital augmente chaque année du même montant fixe.", reponse: "Suite arithmétique" },
    { description: "Un capital augmente chaque année du même pourcentage.", reponse: "Suite géométrique" },
    { description: "Une population perd le même nombre d'individus chaque année.", reponse: "Suite arithmétique" },
    { description: "Une substance radioactive perd le même pourcentage de sa masse chaque année.", reponse: "Suite géométrique" },
    { description: "Un loyer augmente du même montant en euros chaque année.", reponse: "Suite arithmétique" },
    { description: "Un loyer augmente au même taux d'évolution chaque année.", reponse: "Suite géométrique" },
  ]);
  return {
    type: "qcm",
    chapter: "Suites — Modélisation d'un phénomène discret",
    prompt: `On modélise l'évolution suivante par une suite : « ${cas.description} » Quel type de suite convient ?`,
    answer: cas.reponse,
    options: ["Suite arithmétique", "Suite géométrique"],
    steps: [cas.reponse === "Suite arithmétique" ? `\\text{Accroissement constant} \\Rightarrow \\text{suite arithmétique.}` : `\\text{Taux d'évolution constant} \\Rightarrow \\text{suite géométrique.}`],
  };
}

// ---------- 13. Limite intuitive d'une suite géométrique ----------
function genLimiteGeometriqueQCM() {
  const u0 = randInt(1, 10);
  const cas = pick([
    { q: pick([2, 3, 4]), reponse: "\\(u_n\\) tend vers \\(+\\infty\\)" },
    { q: pick([0.5, 0.25, 0.2]), reponse: "\\(u_n\\) tend vers 0" },
  ]);
  return {
    type: "qcm",
    chapter: "Suites — Limite (géométrique)",
    prompt: `\\((u_n)\\) est une suite géométrique à termes positifs, de premier terme \\(u_0 = ${u0}\\) et de raison \\(q = ${fr(cas.q)}\\). Que peut-on conjecturer sur le comportement de \\(u_n\\) quand \\(n\\) devient très grand ?`,
    answer: cas.reponse,
    options: ["\\(u_n\\) tend vers \\(+\\infty\\)", "\\(u_n\\) tend vers 0", "\\(u_n\\) reste constante"],
    steps: [
      cas.q > 1
        ? `\\text{Comme } q > 1, \\text{ les termes d'une suite géométrique à termes positifs deviennent de plus en plus grands : } u_n \\to +\\infty.`
        : `\\text{Comme } 0 < q < 1, \\text{ les termes d'une suite géométrique à termes positifs se rapprochent de 0.}`,
    ],
  };
}

// ---------- 14. Reconnaître le mode de génération d'une suite ----------
function genReconnaitreModeGenerationQCM() {
  const cas = pick([
    { description: "\\(u_n = 3n - 2\\)", reponse: "Formule explicite" },
    { description: "\\(u_{n+1} = u_n + 5\\), avec \\(u_0\\) donné", reponse: "Relation de récurrence" },
    { description: "\\(u_n = 2^n\\)", reponse: "Formule explicite" },
    { description: "\\(u_{n+1} = 3u_n - 1\\), avec \\(u_0\\) donné", reponse: "Relation de récurrence" },
  ]);
  return {
    type: "qcm",
    chapter: "Suites — Modes de génération",
    prompt: `On définit une suite par : \\(${cas.description}\\). Quel est son mode de génération ?`,
    answer: cas.reponse,
    options: ["Formule explicite", "Relation de récurrence"],
    steps: [
      cas.reponse === "Formule explicite"
        ? `\\text{On peut calculer } u_n \\text{ directement en fonction de } n : \\text{c'est une formule explicite.}`
        : `\\text{Chaque terme se calcule à partir du précédent : c'est une relation de récurrence.}`,
    ],
  };
}

// ---------- 15. Terme d'une suite définie explicitement ----------
function genTermeExpliciteNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const n = randInt(3, 15);
  const answer = a * n + b;
  return {
    type: "numeric",
    chapter: "Suites — Formule explicite",
    prompt: `Une suite \\((u_n)\\) est définie pour tout entier naturel \\(n\\) par \\(u_n = ${a}n ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(u_{${n}}\\).`,
    answer,
    steps: [`u_{${n}} = ${a} \\times ${n} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
  };
}

const GENERATORS = [
  genTermeRecurrenceArithmetiqueNumeric,
  genTermeRecurrenceGeometriqueNumeric,
  genTermeGeneralArithmetiqueNumeric,
  genTermeGeneralGeometriqueNumeric,
  genRaisonArithmetiqueNumeric,
  genRaisonGeometriqueNumeric,
  genSommeArithmetiqueNumeric,
  genSommeEntiersNumeric,
  genSommeGeometriqueNumeric,
  genSensVariationArithmetiqueQCM,
  genSensVariationGeometriqueQCM,
  genModeliserPhenomeneQCM,
  genLimiteGeometriqueQCM,
  genReconnaitreModeGenerationQCM,
  genTermeExpliciteNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "suites-numeriques-premiere-spe",
    title: "Suites numériques, modèles discrets",
    description: "Modes de génération, suites arithmétiques et géométriques, sommes, sens de variation, limite intuitive.",
    level: "premiere-spe",
    order: 3,
  },
  generate,
};
