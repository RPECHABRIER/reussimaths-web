// ---------------------------------------------------------------------------
// Chapitre : Suites numériques (Première technologique)
// Programme 2026 : modes de génération d'une suite, sens de variation,
// représentation graphique (nuage de points (n, u(n))), suites arithmétiques
// ("croissance linéaire") et suites géométriques à termes positifs
// ("croissance exponentielle") : relation de récurrence, terme de rang n,
// sens de variation. Capacités : modéliser une situation, reconnaître le
// type de suite, calculer un terme, déterminer le sens de variation.
//
// NOTE (audit programme 2026) :
// - M11 : le texte officiel demande d'utiliser la notation fonctionnelle
//   u(n) préalablement à la notation indicielle u_n. Les générateurs de
//   niveau "facile" (récurrence arithmétique/géométrique, raison
//   arithmétique, formule explicite) utilisent désormais u(n) ; les
//   générateurs "standard"/"expert" gardent u_n, cohérent avec une
//   progression pédagogique croissante.
// - M8 : ajout de deux générateurs de démonstration qu'une suite est
//   arithmétique ou géométrique (genDemontrerArithmetiqueNumeric,
//   genDemontrerGeometriqueQCM), capacité citée par le programme mais
//   absente jusqu'ici (seuls le calcul et la reconnaissance existaient).
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

// ---------- 1. Terme via une relation de récurrence arithmétique ----------
function genTermeRecurrenceArithmetiqueNumeric() {
  const u0 = randInt(-15, 15);
  const r = nonZero(-9, 9);
  const n = randInt(1, 4);
  const answer = u0 + n * r;
  return {
    type: "numeric",
    chapter: "Suites numériques (Première techno) — Récurrence arithmétique",
    prompt: `Une suite \\((u_n)\\) est définie par \\(u(0) = ${u0}\\) et, pour tout entier \\(n\\), \\(u(n+1) = u(n) ${r >= 0 ? "+" : "-"} ${Math.abs(r)}\\). Calcule \\(u(${n})\\).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{On ajoute } ${r} \\text{ à chaque étape, } ${n} \\text{ fois de suite.}` },
      { type: "calcul", text: `u(${n}) = ${u0} ${r >= 0 ? "+" : "-"} ${Math.abs(r)} \\times ${n}` },
      { type: "resultat", text: `u(${n}) = ${answer}` },
    ],
  };
}

// ---------- 2. Terme via une relation de récurrence géométrique (termes positifs) ----------
function genTermeRecurrenceGeometriqueNumeric() {
  const u0 = pick([1, 2, 3, 4, 5]);
  const q = pick([2, 3, 1.5, 0.5]);
  const n = randInt(1, 4);
  const answer = roundTo(u0 * q ** n, 3);
  return {
    type: "numeric",
    chapter: "Suites numériques (Première techno) — Récurrence géométrique",
    prompt: `Une suite \\((u_n)\\), à termes positifs, est définie par \\(u(0) = ${u0}\\) et, pour tout entier \\(n\\), \\(u(n+1) = ${fr(q)} \\times u(n)\\). Calcule \\(u(${n})\\).`,
    answer,
    tolerance: 0.005,
    steps: [
      { type: "regle", text: `\\text{On multiplie par } ${fr(q)} \\text{ à chaque étape, } ${n} \\text{ fois de suite.}` },
      { type: "calcul", text: `u(${n}) = ${u0} \\times ${fr(q)}^{${n}}` },
      { type: "resultat", text: `u(${n}) = ${fr(answer)}` },
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
    chapter: "Suites numériques (Première techno) — Terme général (arithmétique)",
    prompt: `\\((u_n)\\) est une suite arithmétique de premier terme \\(u_0 = ${u0}\\) et de raison \\(r = ${r}\\). Calcule \\(u_{${n}}\\) en utilisant la formule \\(u_n = u_0 + nr\\).`,
    answer,
    steps: [
      { type: "calcul", text: `u_{${n}} = u_0 + ${n} \\times r = ${u0} + ${n} \\times (${r})` },
      { type: "resultat", text: `u_{${n}} = ${answer}` },
    ],
  };
}

// ---------- 4. Terme général d'une suite géométrique (positive) ----------
function genTermeGeneralGeometriqueNumeric() {
  const u0 = pick([1, 2, 3, 4, 5]);
  const q = pick([2, 3, 1.5]);
  const n = randInt(2, 6);
  const answer = roundTo(u0 * q ** n, 3);
  return {
    type: "numeric",
    chapter: "Suites numériques (Première techno) — Terme général (géométrique)",
    prompt: `\\((u_n)\\) est une suite géométrique à termes positifs, de premier terme \\(u_0 = ${u0}\\) et de raison \\(q = ${fr(q)}\\). Calcule \\(u_{${n}}\\) en utilisant la formule \\(u_n = u_0 \\times q^n\\).`,
    answer,
    tolerance: 0.005,
    steps: [
      { type: "calcul", text: `u_{${n}} = u_0 \\times q^{${n}} = ${u0} \\times ${fr(q)}^{${n}}` },
      { type: "resultat", text: `u_{${n}} = ${fr(answer)}` },
    ],
  };
}

// ---------- 5. Déterminer la raison d'une suite arithmétique ----------
function genRaisonArithmetiqueNumeric() {
  const r = nonZero(-12, 12);
  const uA = randInt(-30, 30);
  const uB = uA + r;
  return {
    type: "numeric",
    chapter: "Suites numériques (Première techno) — Raison arithmétique",
    prompt: `\\((u_n)\\) est une suite arithmétique telle que \\(u(5) = ${uA}\\) et \\(u(6) = ${uB}\\). Détermine la raison \\(r\\) de cette suite.`,
    answer: r,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : r = u(n+1) − u(n)." },
      { type: "resultat", text: `r = u(6) - u(5) = ${uB} - (${uA}) = ${r}` },
    ],
  };
}

// ---------- 6. Déterminer la raison d'une suite géométrique (positive) ----------
function genRaisonGeometriqueNumeric() {
  const q = pick([2, 3, 4, 1.5, 0.5]);
  const uA = randInt(2, 12);
  const uB = roundTo(uA * q, 3);
  return {
    type: "numeric",
    chapter: "Suites numériques (Première techno) — Raison géométrique",
    prompt: `\\((u_n)\\) est une suite géométrique à termes positifs telle que \\(u_3 = ${uA}\\) et \\(u_4 = ${fr(uB)}\\). Détermine la raison \\(q\\) de cette suite.`,
    answer: q,
    tolerance: 0.005,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : q = u_{n+1} / u_n." },
      { type: "resultat", text: `q = \\dfrac{u_4}{u_3} = \\dfrac{${fr(uB)}}{${uA}} = ${fr(q)}` },
    ],
  };
}

// ---------- 7. Sens de variation d'une suite arithmétique ----------
function genSensVariationArithmetiqueQCM() {
  const r = nonZero(-9, 9);
  const answer = r > 0 ? "croissante" : "décroissante";
  return {
    type: "qcm",
    chapter: "Suites numériques (Première techno) — Sens de variation",
    prompt: `\\((u_n)\\) est une suite arithmétique de raison \\(r = ${r}\\). Quel est son sens de variation ?`,
    answer,
    options: ["croissante", "décroissante"],
    steps: [{ type: "regle", text: r > 0 ? `\\text{Comme } r > 0, \\text{ chaque terme s'obtient en ajoutant un nombre positif : la suite est croissante.}` : `\\text{Comme } r < 0, \\text{ chaque terme s'obtient en ajoutant un nombre négatif : la suite est décroissante.}` }],
  };
}

// ---------- 8. Sens de variation d'une suite géométrique à termes positifs ----------
function genSensVariationGeometriqueQCM() {
  const u0 = randInt(1, 10);
  const q = pick([0.5, 0.25, 0.2, 1.5, 2, 3, 4]);
  const answer = q > 1 ? "croissante" : "décroissante";
  return {
    type: "qcm",
    chapter: "Suites numériques (Première techno) — Sens de variation",
    prompt: `\\((u_n)\\) est une suite géométrique à termes strictement positifs, de premier terme \\(u_0 = ${u0}\\) et de raison \\(q = ${fr(q)}\\). Quel est son sens de variation ?`,
    answer,
    options: ["croissante", "décroissante"],
    steps: [{ type: "regle", text: q > 1 ? `\\text{Comme } q > 1 \\text{ et les termes sont positifs, la suite est croissante.}` : `\\text{Comme } 0 < q < 1 \\text{ et les termes sont positifs, la suite est décroissante.}` }],
  };
}

// ---------- 9. Reconnaître arithmétique vs géométrique (modélisation) ----------
function genModeliserPhenomeneQCM() {
  const cas = pick([
    { description: "Un capital augmente chaque année du même montant fixe.", reponse: "Croissance linéaire (suite arithmétique)" },
    { description: "Un capital augmente chaque année du même pourcentage.", reponse: "Croissance exponentielle (suite géométrique)" },
    { description: "Un loyer augmente du même montant en euros chaque année.", reponse: "Croissance linéaire (suite arithmétique)" },
    { description: "Un loyer augmente au même taux d'évolution chaque année.", reponse: "Croissance exponentielle (suite géométrique)" },
    { description: "Une entreprise embauche le même nombre de salariés chaque année.", reponse: "Croissance linéaire (suite arithmétique)" },
    { description: "Le nombre d'utilisateurs d'une application augmente du même pourcentage chaque mois.", reponse: "Croissance exponentielle (suite géométrique)" },
  ]);
  return {
    type: "qcm",
    chapter: "Suites numériques (Première techno) — Modélisation",
    prompt: `On modélise l'évolution suivante par une suite : « ${cas.description} » Quel type de croissance convient ?`,
    answer: cas.reponse,
    options: ["Croissance linéaire (suite arithmétique)", "Croissance exponentielle (suite géométrique)"],
    steps: [{ type: "regle", text: cas.reponse.includes("linéaire") ? `\\text{Accroissement constant} \\Rightarrow \\text{croissance linéaire.}` : `\\text{Taux d'évolution constant} \\Rightarrow \\text{croissance exponentielle.}` }],
  };
}

// ---------- 10. Lecture d'un nuage de points (n, u(n)) ----------
function genLectureNuagePointsQCM() {
  const arithmetique = Math.random() < 0.5;
  const u0 = randInt(2, 8);
  const points = [];
  if (arithmetique) {
    const r = pick([1, 1.5, 2, 2.5, 3]);
    for (let n = 0; n <= 6; n++) points.push({ x: n, y: roundTo(u0 + n * r, 2) });
  } else {
    const q = pick([1.2, 1.3, 1.5]);
    for (let n = 0; n <= 6; n++) points.push({ x: n, y: roundTo(u0 * q ** n, 2) });
  }
  const answer = arithmetique ? "Suite arithmétique" : "Suite géométrique";
  return {
    type: "qcm",
    chapter: "Suites numériques (Première techno) — Représentation graphique",
    prompt: `On donne ci-dessous le nuage de points \\((n \\, ; \\, u_n)\\) d'une suite. Quel type de suite semble représentée ?`,
    answer,
    options: ["Suite arithmétique", "Suite géométrique"],
    steps: [
      {
        type: "regle",
        text: arithmetique
          ? `\\text{Les points semblent alignés : les termes progressent d'une valeur constante, c'est une suite arithmétique.}`
          : `\\text{Les points suivent une courbe qui s'accentue : la suite croît de plus en plus vite, c'est une suite géométrique.}`,
      },
    ],
    graph: { xMin: -0.5, xMax: 6.5, yMin: 0, yMax: Math.max(...points.map((p) => p.y)) + 2, points: points.map((p, i) => ({ x: p.x, y: p.y, label: i === 0 ? "u₀" : "" })) },
  };
}

// ---------- 11. Reconnaître le mode de génération d'une suite ----------
function genReconnaitreModeGenerationQCM() {
  const cas = pick([
    { description: "\\(u_n = 3n - 2\\)", reponse: "Formule explicite" },
    { description: "\\(u_{n+1} = u_n + 5\\), avec \\(u_0\\) donné", reponse: "Relation de récurrence" },
    { description: "\\(u_n = 2^n\\)", reponse: "Formule explicite" },
    { description: "\\(u_{n+1} = 1{,}2 \\times u_n\\), avec \\(u_0\\) donné", reponse: "Relation de récurrence" },
  ]);
  return {
    type: "qcm",
    chapter: "Suites numériques (Première techno) — Modes de génération",
    prompt: `On définit une suite par : ${cas.description}. Quel est son mode de génération ?`,
    answer: cas.reponse,
    options: ["Formule explicite", "Relation de récurrence"],
    steps: [{ type: "regle", text: cas.reponse === "Formule explicite" ? `\\text{On peut calculer } u_n \\text{ directement en fonction de } n.` : `\\text{Chaque terme se calcule à partir du précédent.}` }],
  };
}

// ---------- 12. Terme d'une suite définie explicitement ----------
function genTermeExpliciteNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const n = randInt(3, 15);
  const answer = a * n + b;
  return {
    type: "numeric",
    chapter: "Suites numériques (Première techno) — Formule explicite",
    prompt: `Une suite \\((u_n)\\) est définie pour tout entier naturel \\(n\\) par \\(u(n) = ${a}n ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(u(${n})\\).`,
    answer,
    steps: [
      { type: "calcul", text: `u(${n}) = ${a} \\times ${n} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}` },
      { type: "resultat", text: `u(${n}) = ${answer}` },
    ],
  };
}

// ---------- 13. Démontrer qu'une suite est arithmétique (M8) ----------
function genDemontrerArithmetiqueNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  return {
    type: "numeric",
    chapter: "Suites numériques (Première techno) — Démonstration",
    prompt: `Une suite \\((u_n)\\) est définie pour tout entier \\(n\\) par \\(u_n = ${a}n ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Pour démontrer qu'elle est arithmétique, calcule \\(u_{n+1} - u_n\\) (le résultat ne doit pas dépendre de n).`,
    answer: a,
    steps: [
      { type: "calcul", text: `u_{n+1} - u_n = \\left[${a}(n+1) ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right] - \\left[${a}n ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right]` },
      { type: "calcul", text: `= ${a}n + ${a} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} - ${a}n ${b >= 0 ? "-" : "+"} ${Math.abs(b)} = ${a}` },
      { type: "resultat", text: `u_{n+1} - u_n = ${a}\\text{, une constante indépendante de } n \\text{ : la suite est bien arithmétique, de raison } ${a}.` },
    ],
  };
}

// ---------- 14. Démontrer qu'une suite est géométrique (M8) ----------
function genDemontrerGeometriqueQCM() {
  const q = pick([2, 3, 0.5, 1.5]);
  const correct = `\\text{On calcule } \\dfrac{u_{n+1}}{u_n} = ${fr(q)} \\text{, une constante : la suite est géométrique de raison } ${fr(q)}.`;
  const wrong = `\\text{On calcule } u_{n+1} - u_n = ${fr(q)} \\text{, une constante : la suite est arithmétique de raison } ${fr(q)}.`;
  return {
    type: "qcm",
    chapter: "Suites numériques (Première techno) — Démonstration",
    prompt: `Une suite \\((u_n)\\), à termes strictement positifs, vérifie pour tout \\(n\\) : \\(u_{n+1} = ${fr(q)} \\times u_n\\). Quelle est la bonne façon de démontrer sa nature ?`,
    answer: correct,
    options: [correct, wrong],
    steps: [{ type: "regle", text: `\\text{Pour démontrer qu'une suite est géométrique, on calcule le quotient } \\dfrac{u_{n+1}}{u_n} \\text{ et on vérifie qu'il est constant (le calcul d'une différence prouve une nature arithmétique, pas géométrique).}` }],
  };
}

const GENERATORS = [
  genTermeRecurrenceArithmetiqueNumeric,
  genTermeRecurrenceGeometriqueNumeric,
  genTermeGeneralArithmetiqueNumeric,
  genTermeGeneralGeometriqueNumeric,
  genRaisonArithmetiqueNumeric,
  genRaisonGeometriqueNumeric,
  genSensVariationArithmetiqueQCM,
  genSensVariationGeometriqueQCM,
  genModeliserPhenomeneQCM,
  genLectureNuagePointsQCM,
  genReconnaitreModeGenerationQCM,
  genTermeExpliciteNumeric,
  genDemontrerArithmetiqueNumeric,
  genDemontrerGeometriqueQCM,
];

const DIFFICULTY = {
  genTermeRecurrenceArithmetiqueNumeric: "facile",
  genTermeRecurrenceGeometriqueNumeric: "facile",
  genRaisonArithmetiqueNumeric: "facile",
  genTermeExpliciteNumeric: "facile",
  genTermeGeneralArithmetiqueNumeric: "standard",
  genTermeGeneralGeometriqueNumeric: "standard",
  genRaisonGeometriqueNumeric: "standard",
  genSensVariationArithmetiqueQCM: "standard",
  genSensVariationGeometriqueQCM: "standard",
  genReconnaitreModeGenerationQCM: "standard",
  genModeliserPhenomeneQCM: "expert",
  genLectureNuagePointsQCM: "expert",
  genDemontrerArithmetiqueNumeric: "expert",
  genDemontrerGeometriqueQCM: "expert",
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
    id: "suites-numeriques-premiere-techno",
    title: "Suites numériques",
    description: "Modes de génération, suites arithmétiques (croissance linéaire) et géométriques (croissance exponentielle), sens de variation, nuage de points, démonstration de la nature d'une suite.",
    pourquoi: "Les suites arithmétiques et géométriques modélisent l'évolution d'un chiffre d'affaires, d'un stock ou d'un capital, année après année.",
    level: "premiere-techno",
    order: 2,
    cours: {
      mindMap: {
        title: "Suites numériques",
        branches: [
          {
            title: "Deux modes de génération",
            items: [
              "Récurrence : chaque terme se calcule à partir du précédent.",
              "Explicite : chaque terme se calcule directement à partir de n.",
            ],
          },
          {
            title: "Suite arithmétique",
            items: [
              "On ajoute toujours la même raison r. Le nuage de points \\((n ; u_n)\\) est aligné.",
              "Sens de variation : croissante si \\(r>0\\), décroissante si \\(r<0\\) (constante si \\(r=0\\)).",
            ],
            formula: "\\(u_{n+1}=u_n+r,\\quad u_n=u_0+rn\\)",
          },
          {
            title: "Suite géométrique",
            items: [
              "On multiplie toujours par la même raison q. Le nuage de points \\((n ; u_n)\\) dessine une courbe (croissance ou décroissance rapide).",
              "Sens de variation (termes positifs) : croissante si \\(q>1\\), décroissante si \\(0<q<1\\).",
              "Piège classique : ne pas confondre les deux formules — l'une additionne, l'autre multiplie.",
            ],
            formula: "\\(u_{n+1}=q \\times u_n,\\quad u_n=u_0 \\times q^n\\)",
          },
          {
            title: "Reconnaître une croissance linéaire ou exponentielle",
            items: [
              "Une évolution qui ajoute le même montant en euros à chaque étape (chiffre d'affaires, effectif d'une entreprise) est une croissance linéaire : suite arithmétique.",
              "Une évolution qui applique le même pourcentage à chaque étape (taux d'intérêt, taux de croissance) est une croissance exponentielle : suite géométrique.",
              "Sur un nuage de points \\((n \\, ; \\, u_n)\\) : points alignés → suite arithmétique ; points qui s'incurvent de plus en plus vite → suite géométrique.",
            ],
          },
          {
            title: "Démontrer la nature d'une suite",
            items: [
              "Arithmétique : calculer \\(u_{n+1}-u_n\\) et vérifier que c'est constant.",
              "Géométrique : calculer \\(\\frac{u_{n+1}}{u_n}\\) et vérifier que c'est constant (et que \\(u_n \\neq 0\\)).",
            ],
          },
        ],
      },
    },
  },
  generate,
};
