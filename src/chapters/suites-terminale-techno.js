// ---------------------------------------------------------------------------
// Chapitre : Suites numériques (Terminale technologique / STMG)
// Programme 2026 : suites arithmétiques (moyenne arithmétique, terme de rang
// n, somme des n premiers termes, notation Σ) ; suites géométriques à
// termes positifs (moyenne géométrique, terme de rang n, somme des n
// premiers termes). Capacités : prouver que 3 nombres sont/ne sont pas des
// termes consécutifs d'une suite arithmétique/géométrique, déterminer la
// raison, exprimer le terme général, calculer la somme, reconnaître une
// situation de somme de termes consécutifs (ex : placements à intérêts
// composés avec versements réguliers).
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

// ---------- 1. Terme général d'une suite arithmétique ----------
function genTermeGeneralArithmetiqueNumeric() {
  const u0 = randInt(-20, 20);
  const r = nonZero(-9, 9);
  const n = randInt(5, 40);
  const answer = u0 + n * r;
  return {
    type: "numeric",
    chapter: "Suites (Terminale techno) — Terme général (arithmétique)",
    prompt: `\\((u_n)\\) est une suite arithmétique de premier terme \\(u_0 = ${u0}\\) et de raison \\(r = ${r}\\). Calcule \\(u_{${n}}\\).`,
    answer,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : u_n = u_0 + n × r." },
      { type: "resultat", text: `u_{${n}} = ${u0} + ${n} \\times (${r}) = ${answer}` },
    ],
  };
}

// ---------- 2. Terme général d'une suite géométrique ----------
function genTermeGeneralGeometriqueNumeric() {
  const u0 = pick([1, 2, 3, 5]);
  const q = pick([1.1, 1.2, 1.5, 2, 0.9, 0.8]);
  const n = randInt(3, 10);
  const answer = roundTo(u0 * q ** n, 3);
  return {
    type: "numeric",
    chapter: "Suites (Terminale techno) — Terme général (géométrique)",
    prompt: `\\((u_n)\\) est une suite géométrique à termes positifs, de premier terme \\(u_0 = ${u0}\\) et de raison \\(q = ${fr(q)}\\). Calcule \\(u_{${n}}\\) (arrondi au millième).`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : u_n = u_0 × q^n." },
      { type: "resultat", text: `u_{${n}} = ${u0} \\times ${fr(q)}^{${n}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 3. Prouver que 3 nombres sont des termes consécutifs d'une suite arithmétique ----------
function genProuverArithmetiqueQCM() {
  const consecutifs = Math.random() < 0.5;
  const a = randInt(-10, 15);
  const r = nonZero(-8, 8);
  let b = a + r;
  let c = b + r;
  if (!consecutifs) c = c + nonZeroSmall();
  function nonZeroSmall() {
    let n = 0;
    while (n === 0) n = randInt(-4, 4);
    return n;
  }
  const answer = consecutifs ? "Oui, ce sont bien 3 termes consécutifs" : "Non, ce ne sont pas 3 termes consécutifs";
  return {
    type: "qcm",
    chapter: "Suites (Terminale techno) — Preuve arithmétique",
    prompt: `Les nombres ${a}, ${b}, ${c} peuvent-ils être 3 termes consécutifs d'une suite arithmétique ?`,
    answer,
    options: ["Oui, ce sont bien 3 termes consécutifs", "Non, ce ne sont pas 3 termes consécutifs"],
    steps: [
      { type: "regle", text: "Trois nombres sont des termes consécutifs d'une suite arithmétique si et seulement si les deux différences successives sont égales." },
      { type: "calcul", text: `\\text{On compare } b-a = ${b - a} \\text{ et } c-b = ${c - b}.` },
      { type: "resultat", text: consecutifs ? `\\text{Les deux différences sont égales : c'est une suite arithmétique.}` : `\\text{Les deux différences sont différentes : ce n'est pas une suite arithmétique.}` },
    ],
  };
}

// ---------- 4. Prouver que 3 nombres sont des termes consécutifs d'une suite géométrique ----------
function genProuverGeometriqueQCM() {
  const consecutifs = Math.random() < 0.5;
  const a = pick([1, 2, 3, 4, 5]);
  const q = pick([2, 3, 1.5]);
  let b = roundTo(a * q, 3);
  let c = roundTo(b * q, 3);
  if (!consecutifs) c = roundTo(c + pick([1, -1, 2, -2]), 3);
  const answer = consecutifs ? "Oui, ce sont bien 3 termes consécutifs" : "Non, ce ne sont pas 3 termes consécutifs";
  return {
    type: "qcm",
    chapter: "Suites (Terminale techno) — Preuve géométrique",
    prompt: `Les nombres ${fr(a)}, ${fr(b)}, ${fr(c)} peuvent-ils être 3 termes consécutifs d'une suite géométrique ?`,
    answer,
    options: ["Oui, ce sont bien 3 termes consécutifs", "Non, ce ne sont pas 3 termes consécutifs"],
    steps: [
      { type: "regle", text: "Trois nombres non nuls sont des termes consécutifs d'une suite géométrique si et seulement si les deux quotients successifs sont égaux." },
      { type: "calcul", text: `\\text{On compare } \\dfrac{b}{a} = ${fr(roundTo(b / a, 3))} \\text{ et } \\dfrac{c}{b} = ${fr(roundTo(c / b, 3))}.` },
      { type: "resultat", text: consecutifs ? `\\text{Les deux quotients sont égaux : c'est une suite géométrique.}` : `\\text{Les deux quotients sont différents : ce n'est pas une suite géométrique.}` },
    ],
  };
}

// ---------- 5. Moyenne arithmétique de deux termes ----------
function genMoyenneArithmetiqueNumeric() {
  const a = randInt(-10, 10);
  const c = a + 2 * nonZero(-8, 8);
  const answer = (a + c) / 2;
  return {
    type: "numeric",
    chapter: "Suites (Terminale techno) — Moyenne arithmétique",
    prompt: `Dans une suite arithmétique, \\(u_5 = ${a}\\) et \\(u_7 = ${c}\\). Calcule \\(u_6\\), moyenne arithmétique de \\(u_5\\) et \\(u_7\\).`,
    answer,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : dans une suite arithmétique, un terme est la moyenne arithmétique de ses voisins immédiats : u_n = (u_(n-1) + u_(n+1)) / 2." },
      { type: "resultat", text: `u_6 = \\dfrac{${a} + ${c}}{2} = ${answer}` },
    ],
  };
}

// ---------- 6. Moyenne géométrique de deux termes ----------
function genMoyenneGeometriqueNumeric() {
  const q = pick([2, 3, 4]);
  const a = pick([1, 2, 3, 4, 5]);
  const c = a * q * q;
  const answer = a * q;
  return {
    type: "numeric",
    chapter: "Suites (Terminale techno) — Moyenne géométrique",
    prompt: `Dans une suite géométrique à termes positifs, \\(u_5 = ${a}\\) et \\(u_7 = ${c}\\). Calcule \\(u_6\\), moyenne géométrique de \\(u_5\\) et \\(u_7\\) (formule \\(u_6 = \\sqrt{u_5 \\times u_7}\\)).`,
    answer,
    steps: [
      { type: "calcul", text: `u_6 = \\sqrt{${a} \\times ${c}} = \\sqrt{${a * c}}` },
      { type: "resultat", text: `u_6 = ${answer}` },
    ],
  };
}

// ---------- 7. Somme des n premiers termes d'une suite arithmétique ----------
function genSommeArithmetiqueNumeric() {
  const u0 = randInt(-10, 10);
  const r = nonZero(-6, 6);
  const n = randInt(4, 15);
  const uN = u0 + n * r;
  const answer = ((n + 1) * (u0 + uN)) / 2;
  return {
    type: "numeric",
    chapter: "Suites (Terminale techno) — Somme (arithmétique)",
    prompt: `\\((u_n)\\) est une suite arithmétique de premier terme \\(u_0 = ${u0}\\) et de raison \\(r = ${r}\\). Sachant que \\(u_{${n}} = ${uN}\\), calcule \\(\\displaystyle\\sum_{k=0}^{${n}} u_k = u_0+u_1+\\dots+u_{${n}}\\).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Formule de référence : Somme = (nombre de termes)} \\times \\dfrac{\\text{premier + dernier}}{2}` },
      { type: "calcul", text: `S = ${n + 1} \\times \\dfrac{${u0} + ${uN}}{2}` },
      { type: "resultat", text: `S = ${answer}` },
    ],
  };
}

// ---------- 8. Somme des n premiers termes d'une suite géométrique ----------
function genSommeGeometriqueNumeric() {
  const q = pick([2, 3, 1.5]);
  const u0 = pick([1, 2, 3]);
  const n = randInt(3, 6);
  const answer = roundTo((u0 * (q ** (n + 1) - 1)) / (q - 1), 3);
  return {
    type: "numeric",
    chapter: "Suites (Terminale techno) — Somme (géométrique)",
    prompt: `\\((u_n)\\) est une suite géométrique de premier terme \\(u_0 = ${u0}\\) et de raison \\(q = ${fr(q)}\\). Calcule \\(\\displaystyle\\sum_{k=0}^{${n}} u_k\\) (arrondi au millième) à l'aide de la formule \\(u_0 \\times \\dfrac{q^{n+1}-1}{q-1}\\).`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "calcul", text: `S = ${u0} \\times \\dfrac{${fr(q)}^{${n + 1}} - 1}{${fr(q)} - 1}` },
      { type: "resultat", text: `S \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 9. Reconnaître une situation de somme de versements réguliers ----------
function genReconnaitreSommeVersementsQCM() {
  const cas = pick([
    {
      description: "Un épargnant verse le même montant chaque année sur un compte rémunéré à intérêts composés : on cherche le capital total après plusieurs années.",
      reponse: "Somme de termes d'une suite géométrique",
      explication: "Somme de termes d'une suite géométrique : chaque versement capitalise avec un taux d'intérêt constant, donc sa valeur future est multipliée chaque année par le même coefficient (1+taux) — c'est la marque d'une suite géométrique.",
    },
    {
      description: "Un épargnant verse le même montant chaque année sur un compte NON rémunéré : on cherche le capital total après plusieurs années.",
      reponse: "Somme de termes d'une suite arithmétique",
      explication: "Somme de termes d'une suite arithmétique : sans intérêts, chaque versement ajoute simplement le même montant fixe au capital, donc le capital total évolue en additionnant toujours la même quantité — c'est la marque d'une suite arithmétique.",
    },
  ]);
  return {
    type: "qcm",
    chapter: "Suites (Terminale techno) — Modélisation",
    prompt: `« ${cas.description} » Quelle notion mathématique permet de calculer ce capital total ?`,
    answer: cas.reponse,
    options: ["Somme de termes d'une suite géométrique", "Somme de termes d'une suite arithmétique"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 10. Calculer un versement régulier à intérêts composés (somme géométrique appliquée) ----------
function genPlacementVersementsNumeric() {
  const versement = pick([500, 1000, 1500, 2000]);
  const taux = pick([0.02, 0.03, 0.04]);
  const n = randInt(3, 6);
  // capital après n versements annuels (le premier versement capitalise n-1 fois, etc.)
  let total = 0;
  for (let k = 0; k < n; k++) total += versement * (1 + taux) ** k;
  const answer = roundTo(total, 2);
  return {
    type: "numeric",
    chapter: "Suites (Terminale techno) — Modélisation",
    prompt: `Un épargnant verse ${versement} € au début de chaque année sur un compte rémunéré à ${fr(taux * 100)} % par an (intérêts composés), pendant ${n} ans. Calcule le capital total juste après le ${n}-ième versement (arrondi au centime), sachant que ce capital est la somme \\(\\displaystyle\\sum_{k=0}^{${n - 1}} ${versement} \\times ${fr(1 + taux)}^k\\).`,
    answer,
    tolerance: 1,
    steps: [
      { type: "regle", text: "Cette somme de versements suit la formule de la somme des n premiers termes d'une suite géométrique." },
      { type: "calcul", text: `\\text{Capital} = ${versement} \\times \\dfrac{${fr(1 + taux)}^{${n}} - 1}{${fr(1 + taux)} - 1}` },
      { type: "resultat", text: `\\text{Capital} \\approx ${fr(answer)} \\text{ €}` },
    ],
  };
}

const GENERATORS = [
  genTermeGeneralArithmetiqueNumeric,
  genTermeGeneralGeometriqueNumeric,
  genProuverArithmetiqueQCM,
  genProuverGeometriqueQCM,
  genMoyenneArithmetiqueNumeric,
  genMoyenneGeometriqueNumeric,
  genSommeArithmetiqueNumeric,
  genSommeGeometriqueNumeric,
  genReconnaitreSommeVersementsQCM,
  genPlacementVersementsNumeric,
];

const DIFFICULTY = {
  genTermeGeneralArithmetiqueNumeric: "facile",
  genMoyenneArithmetiqueNumeric: "facile",
  genReconnaitreSommeVersementsQCM: "facile",
  genTermeGeneralGeometriqueNumeric: "standard",
  genMoyenneGeometriqueNumeric: "standard",
  genProuverArithmetiqueQCM: "standard",
  genSommeArithmetiqueNumeric: "standard",
  genProuverGeometriqueQCM: "expert",
  genSommeGeometriqueNumeric: "expert",
  genPlacementVersementsNumeric: "expert",
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
    id: "suites-terminale-techno",
    title: "Suites numériques",
    description: "Moyenne arithmétique/géométrique, terme de rang n, somme des n premiers termes, preuve de suites consécutives, versements réguliers.",
    pourquoi: "Les suites modélisent l'évolution d'un capital, d'un stock ou d'une population, année après année ou terme après terme.",
    level: "terminale-techno",
    order: 2,
    cours: {
      mindMap: {
        title: "Suites numériques",
        branches: [
          {
            title: "Terme de rang n",
            items: [
              "Arithmétique : on ajoute la raison r à chaque étape. Géométrique : on multiplie par la raison q.",
            ],
            formula: "\\(u_n=u_0+rn,\\quad u_n=u_0 \\times q^n\\)",
          },
          {
            title: "Somme des n premiers termes",
            items: [
              "Somme arithmétique = (nombre de termes) × (premier terme + dernier terme) / 2.",
            ],
            formula: "\\(u_0+u_1+\\cdots+u_n = (n+1) \\times \\dfrac{u_0+u_n}{2},\\quad u_0+u_0q+\\cdots+u_0q^{n-1} = u_0 \\times \\dfrac{1-q^n}{1-q}\\ (q \\neq 1)\\)",
          },
          {
            title: "Prouver la nature d'une suite",
            items: [
              "Arithmétique : calculer \\(u_{n+1}-u_n\\) et vérifier que c'est constant.",
              "Géométrique : calculer \\(\\frac{u_{n+1}}{u_n}\\) et vérifier que c'est constant.",
            ],
          },
          {
            title: "Moyenne arithmétique et moyenne géométrique",
            items: [
              "Dans une suite arithmétique, un terme est la moyenne arithmétique de ses deux voisins immédiats : \\(u_n = \\dfrac{u_{n-1}+u_{n+1}}{2}\\).",
              "Dans une suite géométrique à termes positifs, un terme est la moyenne géométrique de ses deux voisins immédiats : \\(u_n = \\sqrt{u_{n-1}\\times u_{n+1}}\\).",
            ],
          },
          {
            title: "Versements réguliers",
            items: [
              "Une suite de versements identiques placés à intérêts composés se modélise par une somme de termes géométriques.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
