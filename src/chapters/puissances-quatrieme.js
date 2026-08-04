// ---------------------------------------------------------------------------
// Chapitre : Puissances (4e) — sous abonnement.
//
// Correspond au chapitre 4 du sommaire officiel : puissances de base
// quelconque et de base 10, règles de calcul sur les puissances (produit,
// quotient, puissance de puissance), notation scientifique et préfixes,
// racine carrée (carrés parfaits, encadrement, valeurs approchées). Reprend
// la tâche intellectuelle des exercices fournis, avec des nombres, prénoms
// et contextes différents à chaque génération. Voir automatismes-quatrieme.js
// pour le thème "Calcul mental" associé.
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

// =========================== Puissances de base quelconque et de 10 ===========================

// ---------- 1. Écrire un produit comme une puissance ----------
function genEcrireProduitCommePuissanceNumeric() {
  const a = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const n = randInt(2, 8);
  const factors = Array(n).fill(a).join(" \\times ");
  return {
    type: "numeric",
    chapter: "Puissances — Rappels",
    prompt: `On écrit \\(${factors} = ${a}^{?}\\). Quel est cet exposant ?`,
    answer: n,
    steps: [{ type: "regle", text: `Il y a ${n} facteurs égaux à ${a}, donc l'exposant est ${n}.` }],
  };
}

// ---------- 2. Calculer la valeur d'une puissance (base relative) ----------
function genValeurPuissanceNumeric() {
  const a = nonZero(-9, 9);
  const n = randInt(2, 5);
  const answer = a ** n;
  return {
    type: "numeric",
    chapter: "Puissances — Rappels",
    prompt: `Calcule : \\(\\left(${a}\\right)^{${n}}\\)`,
    answer,
    steps: [{ type: "calcul", text: `${Array(n).fill(`(${a})`).join(" \\times ")} = ${answer}` }],
  };
}

// ---------- 3. Calculer une puissance de 10 (valeur décimale) ----------
function genPuissanceDixValeurNumeric() {
  const n = randInt(-4, 6);
  const answer = 10 ** n;
  return {
    type: "numeric",
    chapter: "Puissances — Rappels",
    prompt: `Calcule : \\(10^{${n}}\\) (donne l'écriture décimale)`,
    answer,
    tolerance: Math.abs(answer) < 1 ? 0.00001 : 0.5,
    steps: [{ type: "calcul", text: `10^{${n}} = ${fr(answer)}` }],
  };
}

// ---------- 4. Règle du produit de puissances de même base ----------
function genRegleProduitPuissancesMemeBaseNumeric() {
  const a = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  const m = randInt(1, 9);
  const n = randInt(1, 9);
  return {
    type: "numeric",
    chapter: "Puissances — Rappels",
    prompt: `\\(${a}^{${m}} \\times ${a}^{${n}} = ${a}^{?}\\) — quel est cet exposant ?`,
    answer: m + n,
    steps: [{ type: "calcul", text: `${m} + ${n} = ${m + n}` }],
  };
}

// ---------- 5. Règle du quotient de puissances de même base ----------
function genRegleQuotientPuissancesMemeBaseNumeric() {
  const a = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  const m = randInt(1, 12);
  const n = randInt(1, 12);
  return {
    type: "numeric",
    chapter: "Puissances — Rappels",
    prompt: `\\(${a}^{${m}} \\div ${a}^{${n}} = ${a}^{?}\\) — quel est cet exposant ?`,
    answer: m - n,
    steps: [{ type: "calcul", text: `${m} - ${n} = ${m - n}` }],
  };
}

// ---------- 6. Règle de la puissance de puissance ----------
function genReglePuissanceDePuissanceNumeric() {
  const a = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  const m = randInt(2, 6);
  const n = randInt(2, 6);
  return {
    type: "numeric",
    chapter: "Puissances — Rappels",
    prompt: `\\(\\left(${a}^{${m}}\\right)^{${n}} = ${a}^{?}\\) — quel est cet exposant ?`,
    answer: m * n,
    steps: [{ type: "calcul", text: `${m} \\times ${n} = ${m * n}` }],
  };
}

// ---------- 7. L'exposant 0 ----------
function genExposantZeroQCM() {
  let a;
  do {
    a = nonZero(-20, 20);
  } while (a === 1);
  return {
    type: "qcm",
    chapter: "Puissances — Rappels",
    prompt: `Que vaut \\(${a}^{0}\\) ?`,
    answer: "1",
    options: ["0", "1", `${a}`],
    steps: [{ type: "regle", text: `Pour tout nombre non nul, l'exposant 0 donne toujours 1.` }],
  };
}

// ---------- 8. Signe du résultat d'une puissance ----------
function genSignePuissanceQCM() {
  const a = randInt(2, 9);
  const n = randInt(2, 9);
  const result = (-a) ** n;
  const sign = result > 0 ? "Positif" : "Négatif";
  return {
    type: "qcm",
    chapter: "Puissances — Rappels",
    prompt: `Le nombre \\((-${a})^{${n}}\\) est-il positif ou négatif ?`,
    answer: sign,
    options: ["Positif", "Négatif"],
    steps: [
      {
        type: "regle",
        text: n % 2 === 0 ? `L'exposant ${n} est pair : le résultat est positif.` : `L'exposant ${n} est impair : le résultat est négatif.`,
      },
    ],
  };
}

// =========================== Notation scientifique, préfixes ===========================

// ---------- 9. Reconnaître la notation scientifique d'un nombre ----------
function genEcritureScientifiqueQCM() {
  const aMantisse = roundTo(1 + Math.random() * 8.9, 1);
  const n = pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
  let nombre = roundTo(aMantisse * 10 ** n, 8);
  const correct = `${fr(aMantisse)} \\times 10^{${n}}`;
  const wrong1 = `${fr(aMantisse)} \\times 10^{${n + 1}}`;
  const wrong2 = `${fr(roundTo(aMantisse * 10, 2))} \\times 10^{${n - 1}}`;
  const wrong3 = `${fr(aMantisse)} \\times 10^{${-n}}`;
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])]);
  return {
    type: "qcm",
    chapter: "Puissances — Notation scientifique",
    prompt: `Quelle est la notation scientifique du nombre ${fr(nombre)} ?`,
    answer: correct,
    options: options.length >= 2 ? options : [correct, wrong1],
    steps: [{ type: "calcul", text: `${fr(nombre)} = ${correct}` }],
  };
}

// ---------- 10. Convertir une écriture scientifique en écriture décimale ----------
function genConvertirScientifiqueVersDecimalNumeric() {
  const aMantisse = roundTo(1 + Math.random() * 8.9, 1);
  const n = pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
  const answer = roundTo(aMantisse * 10 ** n, 8);
  return {
    type: "numeric",
    chapter: "Puissances — Notation scientifique",
    prompt: `Donne l'écriture décimale du nombre \\(${fr(aMantisse)} \\times 10^{${n}}\\).`,
    answer,
    tolerance: Math.max(0.00001, Math.abs(answer) * 0.001),
    steps: [{ type: "calcul", text: `${fr(aMantisse)} \\times 10^{${n}} = ${fr(answer)}` }],
  };
}

// ---------- 11. Une écriture est-elle en notation scientifique ? ----------
function genEstNotationScientifiqueQCM() {
  const aValide = roundTo(1 + Math.random() * 8.9, pick([1, 2]));
  const aInvalide = pick([roundTo(10 + Math.random() * 89, 1), roundTo(0.1 + Math.random() * 0.8, 2)]);
  const isValide = Math.random() < 0.5;
  const a = isValide ? aValide : aInvalide;
  const n = randInt(-6, 8);
  return {
    type: "qcm",
    chapter: "Puissances — Notation scientifique",
    prompt: `L'écriture \\(${fr(a)} \\times 10^{${n}}\\) est-elle la notation scientifique d'un nombre ?`,
    answer: isValide ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      {
        type: "regle",
        text: isValide
          ? `${fr(a)} vérifie bien \\(1 \\leqslant ${fr(a)} < 10\\) : c'est une notation scientifique.`
          : `${fr(a)} ne vérifie pas \\(1 \\leqslant a < 10\\) : ce n'est pas une notation scientifique.`,
      },
    ],
  };
}

// ---------- 12. Associer un préfixe métrique à sa puissance de 10 ----------
function genPrefixeMetriqueQCM() {
  const prefixes = [
    { nom: "giga", puissance: 9 },
    { nom: "méga", puissance: 6 },
    { nom: "kilo", puissance: 3 },
    { nom: "hecto", puissance: 2 },
    { nom: "déca", puissance: 1 },
    { nom: "déci", puissance: -1 },
    { nom: "centi", puissance: -2 },
    { nom: "milli", puissance: -3 },
    { nom: "micro", puissance: -6 },
    { nom: "nano", puissance: -9 },
  ];
  const target = pick(prefixes);
  const distractors = shuffle(prefixes.filter((p) => p.puissance !== target.puissance)).slice(0, 3);
  const options = shuffle([target, ...distractors].map((p) => `10^{${p.puissance}}`));
  return {
    type: "qcm",
    chapter: "Puissances — Notation scientifique",
    prompt: `À quelle puissance de 10 correspond le préfixe « ${target.nom} » ?`,
    answer: `10^{${target.puissance}}`,
    options,
    steps: [{ type: "regle", text: `Le préfixe « ${target.nom} » correspond à \\(10^{${target.puissance}}\\).` }],
  };
}

// ---------- 13. Produit de deux nombres en notation scientifique ----------
function genProduitNotationScientifiqueNumeric() {
  const a1 = roundTo(1 + Math.random() * 8.9, 1);
  const n1 = randInt(-6, 8);
  const a2 = roundTo(1 + Math.random() * 8.9, 1);
  const n2 = randInt(-6, 8);
  const answer = roundTo(a1 * 10 ** n1 * (a2 * 10 ** n2), 20);
  return {
    type: "numeric",
    chapter: "Puissances — Notation scientifique",
    prompt: `Calcule \\(\\left(${fr(a1)} \\times 10^{${n1}}\\right) \\times \\left(${fr(a2)} \\times 10^{${n2}}\\right)\\) et donne le résultat en écriture décimale.`,
    answer,
    tolerance: Math.max(0.00001, Math.abs(answer) * 0.005),
    steps: [
      { type: "calcul", text: `${fr(a1)} \\times ${fr(a2)} = ${fr(roundTo(a1 * a2, 4))}` },
      { type: "calcul", text: `10^{${n1}} \\times 10^{${n2}} = 10^{${n1 + n2}}` },
      { type: "resultat", text: `\\text{Résultat} \\approx ${fr(answer)}` },
    ],
  };
}

// =========================== Racine carrée ===========================

// ---------- 14. Un nombre est-il un carré parfait ? ----------
function genCarreParfaitQCM() {
  const carres = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
  const nonCarres = [2, 3, 5, 7, 8, 10, 12, 15, 18, 20, 24, 30, 40, 50, 65, 90, 130, 150, 175, 200];
  const isCarre = Math.random() < 0.5;
  const n = isCarre ? pick(carres) : pick(nonCarres);
  return {
    type: "qcm",
    chapter: "Puissances — Racine carrée",
    prompt: `${n} est-il un carré parfait ?`,
    answer: isCarre ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      {
        type: "regle",
        text: isCarre ? `${n} = ${Math.round(Math.sqrt(n))}^2, c'est un carré parfait.` : `Aucun entier élevé au carré ne donne ${n} : ce n'est pas un carré parfait.`,
      },
    ],
  };
}

// ---------- 15. Racine carrée exacte d'un carré parfait ----------
function genRacineCarreeExacteNumeric() {
  const racine = randInt(2, 20);
  const carre = racine * racine;
  return {
    type: "numeric",
    chapter: "Puissances — Racine carrée",
    prompt: `Calcule \\(\\sqrt{${carre}}\\).`,
    answer: racine,
    steps: [{ type: "regle", text: `Comme ${racine}^2 = ${carre} et ${racine} > 0, alors \\sqrt{${carre}} = ${racine}.` }],
  };
}

// ---------- 16. Encadrer une racine carrée entre deux entiers consécutifs ----------
function genEncadrementRacineCarreeNumeric() {
  const borneInf = randInt(2, 30);
  const borneSup = borneInf + 1;
  const n = randInt(borneInf * borneInf + 1, borneSup * borneSup - 1);
  return {
    type: "numeric",
    chapter: "Puissances — Racine carrée",
    prompt: `Entre quels deux entiers consécutifs \\(\\sqrt{${n}}\\) est-il encadré ? Donne l'entier le plus petit (la borne inférieure).`,
    answer: borneInf,
    steps: [
      { type: "calcul", text: `${borneInf}^2 = ${borneInf * borneInf} < ${n} < ${borneSup * borneSup} = ${borneSup}^2` },
      { type: "resultat", text: `Donc ${borneInf} < \\sqrt{${n}} < ${borneSup}.` },
    ],
  };
}

// ---------- 17. Valeur approchée d'une racine carrée (calculatrice) ----------
function genRacineCarreeApprocheeNumeric() {
  const n = randInt(2, 900);
  const answer = roundTo(Math.sqrt(n), 2);
  return {
    type: "numeric",
    chapter: "Puissances — Racine carrée",
    prompt: `À l'aide de la calculatrice, donne une valeur approchée de \\(\\sqrt{${n}}\\) au centième près.`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `\\sqrt{${n}} \\approx ${fr(answer)}` }],
  };
}

// ---------- 18. Côté d'un carré connaissant son aire (racine carrée en contexte) ----------
function genCoteCarreDepuisAireNumeric() {
  const cote = randInt(4, 200);
  const aire = cote * cote;
  return {
    type: "numeric",
    chapter: "Puissances — Racine carrée",
    prompt: `Un carré a une aire de ${aire} cm². Quel est son côté, en cm ?`,
    answer: cote,
    steps: [{ type: "calcul", text: `\\sqrt{${aire}} = ${cote}` }],
  };
}

const GENERATORS = [
  genEcrireProduitCommePuissanceNumeric,
  genValeurPuissanceNumeric,
  genPuissanceDixValeurNumeric,
  genRegleProduitPuissancesMemeBaseNumeric,
  genRegleQuotientPuissancesMemeBaseNumeric,
  genReglePuissanceDePuissanceNumeric,
  genExposantZeroQCM,
  genSignePuissanceQCM,
  genEcritureScientifiqueQCM,
  genConvertirScientifiqueVersDecimalNumeric,
  genEstNotationScientifiqueQCM,
  genPrefixeMetriqueQCM,
  genProduitNotationScientifiqueNumeric,
  genCarreParfaitQCM,
  genRacineCarreeExacteNumeric,
  genEncadrementRacineCarreeNumeric,
  genRacineCarreeApprocheeNumeric,
  genCoteCarreDepuisAireNumeric,
];

const DIFFICULTY = {
  genEcrireProduitCommePuissanceNumeric: "facile",
  genValeurPuissanceNumeric: "facile",
  genPuissanceDixValeurNumeric: "facile",
  genExposantZeroQCM: "facile",
  genSignePuissanceQCM: "facile",
  genConvertirScientifiqueVersDecimalNumeric: "facile",
  genEstNotationScientifiqueQCM: "facile",
  genPrefixeMetriqueQCM: "facile",
  genCarreParfaitQCM: "facile",
  genRacineCarreeExacteNumeric: "facile",
  genRegleProduitPuissancesMemeBaseNumeric: "standard",
  genRegleQuotientPuissancesMemeBaseNumeric: "standard",
  genReglePuissanceDePuissanceNumeric: "standard",
  genEcritureScientifiqueQCM: "standard",
  genProduitNotationScientifiqueNumeric: "standard",
  genRacineCarreeApprocheeNumeric: "standard",
  genEncadrementRacineCarreeNumeric: "expert",
  genCoteCarreDepuisAireNumeric: "expert",
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
    id: "puissances-quatrieme",
    title: "Puissances",
    description: "Puissances de base quelconque et de base 10, règles de calcul, notation scientifique et préfixes, racine carrée.",
    pourquoi: "Les puissances de 10 et la notation scientifique permettent de manipuler aussi bien l'infiniment petit (un atome) que l'infiniment grand (une distance dans l'espace).",
    level: "quatrieme",
    free: false,
    order: 5,
  },
  generate,
};
