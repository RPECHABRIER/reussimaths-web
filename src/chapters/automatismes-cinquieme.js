// ---------------------------------------------------------------------------
// Chapitre : Automatismes (5e) — gratuit, freemium (5 questions/jour sans
// abonnement, illimité avec abonnement). Regroupe les mini-exercices de
// calcul rapide ("Série 1 Automatismes") rencontrés à la fin de chaque
// chapitre du manuel de 5e, un thème par chapitre du sommaire (voir THEMES
// ci-dessous) ; sera enrichi au fur et à mesure que les autres chapitres 5e
// seront écrits — voir automatismes-sixieme.js pour le même principe en 6e.
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
const randDecimal = (min, max, decimals) => roundTo(min + Math.random() * (max - min), decimals);
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");
const prenoms = ["Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo", "Sofia", "Tom", "Maya", "Adam"];

// =========================== Chapitres 1-3 : Opérations sur les nombres / ===========================
// =========================== Divisibilité, fractions / Puissances       ===========================
// (Les fonctions ci-dessous couvrent la Série 1 "Automatismes" des trois
// premiers chapitres du sommaire — voir la répartition dans les trois
// tableaux CH_OPERATIONS / CH_DIVISIBILITE_FRACTIONS / CH_PUISSANCES plus bas.)

// ---------- 1. Divisibilité (par 2, 3, 5, 9, 10) ----------
function genDivisibiliteQCM() {
  const n = randInt(100, 99999);
  const d = pick([2, 3, 5, 9, 10]);
  const digitSum = String(n).split("").reduce((s, c) => s + Number(c), 0);
  let divisible;
  if (d === 2) divisible = n % 2 === 0;
  else if (d === 5) divisible = n % 10 === 0 || n % 10 === 5;
  else if (d === 10) divisible = n % 10 === 0;
  else divisible = digitSum % d === 0;
  return {
    type: "qcm",
    chapter: "Automatismes — Divisibilité",
    prompt: `${n} est-il divisible par ${d} ?`,
    answer: divisible ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps:
      d === 2 || d === 5 || d === 10
        ? [{ type: "regle", text: `On regarde le chiffre des unités de ${n}.` }]
        : [{ type: "calcul", text: `On additionne les chiffres de ${n} : ${digitSum}. On regarde si ${digitSum} est multiple de ${d}.` }],
  };
}

// ---------- 2. Division euclidienne (quotient, reste ou dividende) ----------
function genDivisionEuclidienneCalcul() {
  const diviseur = randInt(4, 30);
  const quotient = randInt(3, 40);
  const reste = randInt(0, diviseur - 1);
  const dividende = quotient * diviseur + reste;
  const mode = pick(["quotient", "reste", "dividende"]);
  if (mode === "dividende") {
    return {
      type: "numeric",
      chapter: "Automatismes — Division euclidienne",
      prompt: `Dans une division euclidienne par ${diviseur}, le quotient est ${quotient} et le reste est ${reste}. Quel est le dividende ?`,
      answer: dividende,
      steps: [{ type: "calcul", text: `${quotient} \\times ${diviseur} + ${reste} = ${dividende}` }],
    };
  }
  return {
    type: "numeric",
    chapter: "Automatismes — Division euclidienne",
    prompt: `Quel est le ${mode === "quotient" ? "quotient entier" : "reste"} de la division euclidienne de ${dividende} par ${diviseur} ?`,
    answer: mode === "quotient" ? quotient : reste,
    steps: [{ type: "calcul", text: `${dividende} = ${diviseur} \\times ${quotient} + ${reste}` }],
  };
}

// ---------- 3. Trouver un facteur manquant ----------
function genTrouverFacteurManquant() {
  const a = randInt(2, 12);
  const b = randInt(2, 12);
  const produit = a * b;
  const askA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Facteur manquant",
    prompt: askA ? `${produit} = ? \\times ${b}` : `${produit} = ${a} \\times ?`,
    answer: askA ? a : b,
    steps: [{ type: "calcul", text: `${produit} \\div ${askA ? b : a} = ${askA ? a : b}` }],
  };
}

// ---------- 4. Écrire un nombre comme produit de deux facteurs ----------
function genFactorisationDeuxFacteurs() {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const n = a * b;
  return {
    type: "numeric",
    chapter: "Automatismes — Factoriser",
    prompt: `${n} peut s'écrire comme un produit de deux nombres entiers différents de 1, dont l'un est ${a}. Quel est l'autre facteur ?`,
    answer: b,
    steps: [{ type: "calcul", text: `${n} \\div ${a} = ${b}` }],
  };
}

// ---------- 5. Multiplier/diviser par 10, 100, 1000 ----------
function genMultDiviserPuissanceDix() {
  const n = randDecimal(0.001, 900, 3);
  const p = pick([10, 100, 1000]);
  const isMult = Math.random() < 0.5;
  const answer = roundTo(isMult ? n * p : n / p, 5);
  return {
    type: "numeric",
    chapter: "Automatismes — Puissances de dix",
    prompt: `Calcule : \\(${frTex(n)} ${isMult ? "\\times" : "\\div"} ${p}\\)`,
    answer,
    tolerance: 0.0005,
    steps: [{ type: "regle", text: `${isMult ? "Multiplier" : "Diviser"} par ${p} déplace la virgule de ${Math.log10(p)} rang(s) vers ${isMult ? "la droite" : "la gauche"}.` }],
  };
}

// ---------- 6. Compléter le multiplicateur (10, 100 ou 1000) ----------
function genCompleterMultiplicateurPuissanceDix() {
  const p = pick([10, 100, 1000]);
  const a = randDecimal(0.01, 20, 3);
  const b = roundTo(a * p, 3);
  return {
    type: "qcm",
    chapter: "Automatismes — Puissances de dix",
    prompt: `Complète : \\(${frTex(a)} \\times ? = ${frTex(b)}\\)`,
    answer: `${p}`,
    options: shuffle(["10", "100", "1000"]),
    steps: [{ type: "calcul", text: `${fr(b)} \\div ${fr(a)} = ${p}` }],
  };
}

// ---------- 7. Calculer astucieusement en regroupant ----------
function genCalculerAstucieusementRegroupement() {
  const isProduit = Math.random() < 0.5;
  if (isProduit) {
    const a = randDecimal(0.1, 2, 1);
    const b = pick([2, 4, 5, 10, 20, 25, 50]);
    const c = randDecimal(0.1, 2, 1);
    const total = roundTo(a * b * c, 3);
    return {
      type: "numeric",
      chapter: "Automatismes — Calcul astucieux",
      prompt: `Calcule astucieusement en regroupant : \\(${frTex(a)} \\times ${b} \\times ${frTex(c)}\\)`,
      answer: total,
      tolerance: 0.005,
      steps: [{ type: "regle", text: `On peut regrouper les nombres pour simplifier le calcul avant de multiplier.` }],
    };
  }
  const nums = Array.from({ length: 4 }, () => randInt(5, 95));
  const total = nums.reduce((s, n) => s + n, 0);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul astucieux",
    prompt: `Calcule astucieusement : \\(${nums.join(" + ")}\\)`,
    answer: total,
    steps: [{ type: "regle", text: `On peut regrouper les nombres pour former des dizaines ou centaines rondes avant d'additionner.` }],
  };
}

// ---------- 8. Additionner des décimaux ----------
function genAdditionnerDecimaux() {
  const a = randDecimal(1, 300, 2);
  const b = randDecimal(1, 300, 2);
  const answer = roundTo(a + b, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Additionner des décimaux",
    prompt: `Calcule : \\(${frTex(a)} + ${frTex(b)}\\)`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${fr(a)} + ${fr(b)} = ${fr(answer)}` }],
  };
}

// ---------- 9. Soustraire des décimaux ----------
function genSoustraireDecimaux() {
  const a = randDecimal(10, 400, 2);
  const b = randDecimal(1, a - 1, 2);
  const answer = roundTo(a - b, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Soustraire des décimaux",
    prompt: `Calcule : \\(${frTex(a)} - ${frTex(b)}\\)`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${fr(a)} - ${fr(b)} = ${fr(answer)}` }],
  };
}

// ---------- 10. Compléter une égalité à trou ----------
function genCompleterEgaliteATrou() {
  const isAdd = Math.random() < 0.5;
  const a = randDecimal(1, 60, 1);
  const b = randDecimal(1, 60, 1);
  const total = roundTo(isAdd ? a + b : a - b, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Égalité à trou",
    prompt: isAdd ? `Complète : \\(${frTex(a)} + ? = ${frTex(total)}\\)` : `Complète : \\(${frTex(a)} - ? = ${frTex(total)}\\)`,
    answer: b,
    steps: isAdd ? [{ type: "calcul", text: `${fr(total)} - ${fr(a)} = ${fr(b)}` }] : [{ type: "calcul", text: `${fr(a)} - ${fr(total)} = ${fr(b)}` }],
  };
}

// ---------- 11. Répartir une quantité en unités égales ----------
function genRepartirQuantiteEnUnites() {
  const unite = randDecimal(0.1, 2, 1);
  const nbUnites = randInt(3, 20);
  const total = roundTo(unite * nbUnites, 2);
  const contenants = ["verres", "bouteilles", "pots", "sachets", "gobelets"];
  const liquide = ["boisson", "jus de fruits", "eau", "sirop"];
  return {
    type: "numeric",
    chapter: "Automatismes — Répartir une quantité",
    prompt: `On répartit ${fr(total)} L de ${pick(liquide)} dans des ${pick(contenants)} contenant chacun ${fr(unite)} L. Combien de ${pick(contenants)} faut-il prévoir ?`,
    answer: nbUnites,
    steps: [{ type: "calcul", text: `${fr(total)} \\div ${fr(unite)} = ${nbUnites}` }],
  };
}

// ---------- 12. Un nombre est-il diviseur d'un autre ? ----------
function genDiviseurDeNombreQCM() {
  const d = randInt(3, 40);
  const k = randInt(5, 40);
  const isDivisor = Math.random() < 0.5;
  const n = isDivisor ? d * k : d * k + nonZero(1, d - 1 || 1);
  const divisible = n % d === 0;
  return {
    type: "qcm",
    chapter: "Automatismes — Diviseurs",
    prompt: `${d} est-il un diviseur de ${n} ?`,
    answer: divisible ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "calcul", text: `${n} \\div ${d}${divisible ? " est un nombre entier." : " n'est pas un nombre entier."}` }],
  };
}

// ---------- 13. Problème "de plus / de moins" ----------
function genProblemeDePlusDeMoins() {
  const base = randDecimal(2, 60, 1);
  const ecart = randDecimal(0.5, 20, 1);
  const plus = Math.random() < 0.5;
  const autre = roundTo(plus ? base + ecart : base - ecart, 2);
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const contextes = [
    { obj: "chambre", unite: "m²" },
    { obj: "trajet à vélo", unite: "km" },
    { obj: "pièce", unite: "m²" },
  ];
  const c = pick(contextes);
  return {
    type: "numeric",
    chapter: "Automatismes — Problèmes de plus / de moins",
    prompt: `La ${c.obj} de ${p1} mesure ${fr(base)} ${c.unite}. Celle de ${p2} a ${fr(ecart)} ${c.unite} ${plus ? "de plus" : "de moins"}. Quelle est la mesure de la ${c.obj} de ${p2}, en ${c.unite} ?`,
    answer: autre,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${fr(base)} ${plus ? "+" : "-"} ${fr(ecart)} = ${fr(autre)}` }],
  };
}

// ---------- 14. Produit décimal simple ----------
function genProduitDecimalSimple() {
  const a = randDecimal(0.01, 0.9, 2);
  const b = randInt(2, 9);
  const answer = roundTo(a * b, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Produits décimaux",
    prompt: `Calcule : \\(${frTex(a)} \\times ${b}\\)`,
    answer,
    tolerance: 0.002,
    steps: [{ type: "calcul", text: `${fr(a)} \\times ${b} = ${fr(answer)}` }],
  };
}

// ---------- 15. Écriture décimale d'une fraction simple ----------
function genEcritureDecimaleFractionSimple() {
  const fractions = [
    [1, 2, 0.5], [1, 4, 0.25], [3, 4, 0.75], [1, 5, 0.2], [2, 5, 0.4],
    [3, 5, 0.6], [4, 5, 0.8], [1, 10, 0.1], [3, 10, 0.3], [7, 10, 0.7],
    [9, 10, 0.9], [1, 20, 0.05], [1, 8, 0.125], [1, 100, 0.01],
  ];
  const [num, den, dec] = pick(fractions);
  return {
    type: "numeric",
    chapter: "Automatismes — Écriture décimale",
    prompt: `Quelle est l'écriture décimale de \\(\\dfrac{${num}}{${den}}\\) ?`,
    answer: dec,
    tolerance: 0.001,
    steps: [{ type: "calcul", text: `\\dfrac{${num}}{${den}} = ${num} \\div ${den} = ${fr(dec)}` }],
  };
}

// ---------- 16. Fraction d'un nombre entier (calcul mental) ----------
function genFractionDunNombreEntierMental() {
  const den = pick([2, 3, 4, 5, 10]);
  const k = randInt(2, 12);
  const nombre = den * k;
  const num = randInt(1, den - 1);
  const answer = num * k;
  return {
    type: "numeric",
    chapter: "Automatismes — Fraction d'un nombre",
    prompt: `Calcule mentalement : \\(\\dfrac{${num}}{${den}}\\) de ${nombre}`,
    answer,
    steps: [
      { type: "calcul", text: `${nombre} \\div ${den} = ${k}` },
      { type: "calcul", text: `${k} \\times ${num} = ${answer}` },
    ],
  };
}

// ---------- 17. Compléter un produit à trou (facteur entier) ----------
function genCompleterProduitTrouEntier() {
  const a = randInt(2, 12);
  const b = randInt(2, 12);
  const produit = a * b;
  return {
    type: "numeric",
    chapter: "Automatismes — Produit à trou",
    prompt: `Complète : \\(${a} \\times ? = ${produit}\\)`,
    answer: b,
    steps: [{ type: "calcul", text: `${produit} \\div ${a} = ${b}` }],
  };
}

// ---------- 18. Aire ou volume à partir d'un produit simple (avec unités) ----------
function genProduitAvecUnite() {
  const is3D = Math.random() < 0.4;
  if (is3D) {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const c = randInt(2, 9);
    return {
      type: "numeric",
      chapter: "Automatismes — Aires et volumes",
      prompt: `Calcule : ${a} cm × ${b} cm × ${c} cm = ? cm³`,
      answer: a * b * c,
      steps: [{ type: "calcul", text: `${a} \\times ${b} \\times ${c} = ${a * b * c}` }],
    };
  }
  const a = randInt(2, 12);
  const b = randInt(2, 12);
  return {
    type: "numeric",
    chapter: "Automatismes — Aires et volumes",
    prompt: `Calcule : ${a} cm × ${b} cm = ? cm²`,
    answer: a * b,
    steps: [{ type: "calcul", text: `${a} \\times ${b} = ${a * b}` }],
  };
}

// ---------- 19. Carré ou cube d'un petit nombre entier ----------
function genCarreOuCubeMental() {
  const n = randInt(2, 12);
  const mode = pick(["carre", "cube"]);
  const answer = mode === "carre" ? n * n : n * n * n;
  return {
    type: "numeric",
    chapter: "Automatismes — Carrés et cubes",
    prompt: `Quel est le ${mode === "carre" ? "carré" : "cube"} de ${n} ?`,
    answer,
    steps: [{ type: "calcul", text: mode === "carre" ? `${n} \\times ${n} = ${answer}` : `${n} \\times ${n} \\times ${n} = ${answer}` }],
  };
}

// ---------- 20. Calculer avec ou sans parenthèses (puissance) ----------
function genAvecSansParenthesesPuissanceMental() {
  const a = randInt(2, 6);
  const b = randInt(2, 6);
  const avecParentheses = Math.random() < 0.5;
  const answer = avecParentheses ? (a * b) ** 2 : a * b * b;
  return {
    type: "numeric",
    chapter: "Automatismes — Puissances",
    prompt: avecParentheses ? `Calcule : \\((${a} \\times ${b})^2\\)` : `Calcule : \\(${a} \\times ${b}^2\\)`,
    answer,
    steps: avecParentheses
      ? [
          { type: "calcul", text: `${a} \\times ${b} = ${a * b}` },
          { type: "calcul", text: `${a * b}^2 = ${answer}` },
        ]
      : [
          { type: "calcul", text: `${b}^2 = ${b * b}` },
          { type: "calcul", text: `${a} \\times ${b * b} = ${answer}` },
        ],
  };
}

function buildFractionOnLineFigure(value, max) {
  const scale = 60;
  const y = 40;
  const toX = (v) => 20 + v * scale;
  const Lo = { id: "Lo", x: toX(0), y, hideDot: true, hideLabel: true };
  const Hi = { id: "Hi", x: toX(max), y, hideDot: true, hideLabel: true };
  const M = { id: "M", x: toX(value), y, dy: -10 };
  const freeLabels = [];
  for (let v = 0; v <= max; v++) freeLabels.push({ x: toX(v), y: y + 16, text: `${v}` });
  return { points: [Lo, Hi, M], lines: [{ from: "Lo", to: "Hi" }], freeLabels };
}

// ---------- 21. Abscisse d'un point sur une demi-droite graduée (fraction) ----------
function genAbscisseDemiDroiteGradueeFraction() {
  const fractions = [0.25, 0.5, 0.75, 1.25, 1.5, 1.75, 2.25, 2.5];
  const value = pick(fractions);
  return {
    type: "numeric",
    chapter: "Automatismes — Droite graduée",
    prompt: `Chaque unité de la demi-droite ci-dessous est partagée en quarts égaux. Quelle est l'écriture décimale de l'abscisse du point M ?`,
    figure: buildFractionOnLineFigure(value, 3),
    answer: value,
    tolerance: 0.01,
    steps: [{ type: "donnee", text: `Le point M est placé sur la graduation ${fr(value)}.` }],
  };
}

// =========================== Chapitre 5 : Nombres relatifs ===========================
// (Série 1 "Automatismes" du chapitre — à ce stade, uniquement des révisions de
// calcul décimal en ligne / en contexte, sans nombres négatifs : ceux-ci sont
// travaillés dans le chapitre proprement dit, voir nombres-relatifs.js.)

function buildSegmentAlignedFigure(acLen, cbLen) {
  const total = acLen + cbLen;
  const scale = Math.min(14, 260 / total);
  const y = 40;
  const A = { id: "A", x: 20, y, dy: -10 };
  const C = { id: "C", x: 20 + acLen * scale, y, dy: -10 };
  const B = { id: "B", x: 20 + total * scale, y, dy: -10 };
  return {
    points: [A, C, B],
    segments: [
      { from: "A", to: "C" },
      { from: "C", to: "B" },
    ],
    freeLabels: [
      { x: (A.x + C.x) / 2, y: y + 16, text: `${acLen} cm` },
      { x: (A.x + B.x) / 2, y: y - 26, text: `${total} cm` },
    ],
  };
}

// ---------- 1. Compléter une égalité à trou (addition ou soustraction, terme au choix) ----------
function genCompleterEgaliteAdditionSoustractionTrou() {
  const a = randDecimal(1, 60, 1);
  const b = randDecimal(1, 60, 1);
  const isAdd = Math.random() < 0.5;
  const total = roundTo(isAdd ? a + b : a - b, 2);
  const trouEnPremier = Math.random() < 0.5;
  let prompt, answer;
  if (isAdd) {
    prompt = trouEnPremier ? `Complète : \\(? + ${frTex(b)} = ${frTex(total)}\\)` : `Complète : \\(${frTex(a)} + ? = ${frTex(total)}\\)`;
    answer = trouEnPremier ? a : b;
  } else {
    prompt = trouEnPremier ? `Complète : \\(? - ${frTex(b)} = ${frTex(total)}\\)` : `Complète : \\(${frTex(a)} - ? = ${frTex(total)}\\)`;
    answer = trouEnPremier ? a : b;
  }
  return {
    type: "numeric",
    chapter: "Automatismes — Égalité à trou",
    prompt,
    answer,
    tolerance: 0.01,
    steps: [{ type: "regle", text: `On isole le terme manquant en utilisant l'opération inverse.` }],
  };
}

// ---------- 2. Écart entre deux nombres ----------
function genEcartEntreDeuxNombres() {
  const a = randDecimal(2, 60, 1);
  const b = roundTo(a + randDecimal(1, 40, 1), 2);
  const answer = roundTo(b - a, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Écart entre deux nombres",
    prompt: `Quel est l'écart entre ${fr(a)} et ${fr(b)} ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${fr(b)} - ${fr(a)} = ${fr(answer)}` }],
  };
}

// ---------- 3. Compléter la longueur d'un segment (figure) ----------
function genSegmentComplementLongueur() {
  const acLen = randInt(2, 12);
  const cbLen = randInt(2, 12);
  return {
    type: "numeric",
    chapter: "Automatismes — Longueurs de segments",
    prompt: `A, C et B sont trois points alignés, avec C entre A et B. Sachant que AB = ${acLen + cbLen} cm et AC = ${acLen} cm, quelle est la longueur CB, en cm ?`,
    figure: buildSegmentAlignedFigure(acLen, cbLen),
    answer: cbLen,
    steps: [{ type: "calcul", text: `${acLen + cbLen} - ${acLen} = ${cbLen}` }],
  };
}

// ---------- 4. Masse d'un contenu (plein - vide) ----------
function genMassePleinVideDifference() {
  const vide = randDecimal(0.1, 2, 3);
  const contenu = randDecimal(0.2, 5, 3);
  const plein = roundTo(vide + contenu, 3);
  const contenant = pick(["panier", "sac à dos", "cartable", "seau", "carton"]);
  return {
    type: "numeric",
    chapter: "Automatismes — Masses",
    prompt: `Un ${contenant} plein pèse ${fr(plein)} kg. Vide, il pèse ${fr(vide)} kg. Quelle est la masse de son contenu, en kg ?`,
    answer: contenu,
    tolerance: 0.001,
    steps: [{ type: "calcul", text: `${fr(plein)} - ${fr(vide)} = ${fr(contenu)}` }],
  };
}

// ---------- 5. Distance parcourue (compteur départ / retour) ----------
function genDistanceParcourueCompteur() {
  const depart = randDecimal(1000, 90000, 1);
  const distance = randDecimal(50, 900, 1);
  const retour = roundTo(depart + distance, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Distances",
    prompt: `Au départ d'un trajet, le compteur d'une voiture indiquait ${fr(depart)} km. Au retour, il indiquait ${fr(retour)} km. Quelle distance a été parcourue, en km ?`,
    answer: distance,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${fr(retour)} - ${fr(depart)} = ${fr(distance)}` }],
  };
}

// ---------- 6. Prix total d'un achat (somme de plusieurs prix) ----------
function genPrixTotalAchat() {
  const nbArticles = randInt(2, 4);
  const prix = Array.from({ length: nbArticles }, () => randDecimal(0.5, 30, 2));
  const total = roundTo(prix.reduce((s, p) => s + p, 0), 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Prix total",
    prompt: `Calcule le prix total d'un achat composé d'articles à ${prix.map(fr).join(" € ; ")} €.`,
    answer: total,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${prix.map(fr).join(" + ")} = ${fr(total)}` }],
  };
}

// ---------- 7. Écart entre deux relevés de température (positifs) ----------
function genEcartTemperatureReleves() {
  const t1 = randDecimal(5, 30, 1);
  const t2 = randDecimal(5, 30, 1);
  const answer = roundTo(Math.abs(t1 - t2), 2);
  const moment1 = pick(["le matin", "à midi", "lundi"]);
  const moment2 = pick(["le soir", "à minuit", "mardi"]);
  return {
    type: "numeric",
    chapter: "Automatismes — Écarts de température",
    prompt: `${moment1[0].toUpperCase()}${moment1.slice(1)}, il fait ${fr(t1)}°C. ${moment2[0].toUpperCase()}${moment2.slice(1)}, il fait ${fr(t2)}°C. Quel est l'écart de température, en °C ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `On calcule la différence entre les deux températures : ${fr(Math.max(t1, t2))} - ${fr(Math.min(t1, t2))} = ${fr(answer)}` }],
  };
}

// ---------- 8. Trouver le terme manquant d'une somme de trois nombres ----------
function genTrouverTermeManquantSommeTrois() {
  const a = randDecimal(1, 30, 1);
  const b = randDecimal(1, 30, 1);
  const c = randDecimal(1, 30, 1);
  const total = roundTo(a + b + c, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Somme à trois termes",
    prompt: `Complète : \\(${frTex(a)} + ${frTex(b)} + ? = ${frTex(total)}\\)`,
    answer: c,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${fr(total)} - (${fr(a)} + ${fr(b)}) = ${fr(c)}` }],
  };
}

// ---------- 9. Durée entre deux instants (minutes) ----------
function genDureeEntreDeuxInstants() {
  const depart = randInt(0, 600);
  const duree = randInt(10, 180);
  const arrivee = depart + duree;
  const fmt = (m) => `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`;
  return {
    type: "numeric",
    chapter: "Automatismes — Durées",
    prompt: `Un film commence à ${fmt(depart)} et se termine à ${fmt(arrivee)}. Combien de temps dure-t-il, en minutes ?`,
    answer: duree,
    steps: [{ type: "calcul", text: `Durée = heure de fin - heure de début = ${duree} minutes.` }],
  };
}

// ---------- 10. Compléter une graduation manquante (demi-droite à échelle) ----------
function genCompleterGraduationDemiDroiteAutomatisme() {
  const min = pick([0, 10, 100]);
  const pas = pick([1, 2, 5, 10]);
  const nbIntervalles = pick([2, 4, 5]);
  const max = min + nbIntervalles * pas;
  const targetIndex = randInt(1, nbIntervalles - 1);
  const answer = min + targetIndex * pas;
  return {
    type: "numeric",
    chapter: "Automatismes — Graduations",
    prompt: `Une demi-droite est graduée régulièrement de ${min} à ${max} en ${nbIntervalles} intervalles égaux. Quelle est la valeur de la ${targetIndex}${targetIndex === 1 ? "re" : "e"} graduation après ${min} ?`,
    answer,
    steps: [
      { type: "donnee", text: `Chaque intervalle vaut ${pas}.` },
      { type: "calcul", text: `${min} + ${targetIndex} \\times ${pas} = ${answer}` },
    ],
  };
}

// ---------- 11. Lire l'abscisse d'un point sur une demi-droite graduée (figure) ----------
function genLireAbscissePointDemiDroiteFigure() {
  const max = pick([5, 10]);
  const value = randInt(1, max - 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Droite graduée",
    prompt: `Quelle est l'abscisse du point M sur la demi-droite graduée ci-dessous ?`,
    figure: buildFractionOnLineFigure(value, max),
    answer: value,
    steps: [{ type: "donnee", text: `Le point M est placé sur la graduation ${value}.` }],
  };
}

// ---------- 12. Lire une abscisse décimale entre 0 et 1 (figure) ----------
function genAbscissePointDecimalUniteFigure() {
  const value = roundTo(randDecimal(0.1, 0.9, 1), 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Droite graduée",
    prompt: `L'unité de cette demi-droite graduée est partagée en dixièmes égaux. Quelle est l'écriture décimale de l'abscisse du point M ?`,
    figure: buildFractionOnLineFigure(value, 1),
    answer: value,
    tolerance: 0.01,
    steps: [{ type: "donnee", text: `Le point M est placé sur la graduation ${fr(value)}.` }],
  };
}

const CH_NOMBRES_RELATIFS = [
  genCompleterEgaliteAdditionSoustractionTrou,
  genEcartEntreDeuxNombres,
  genSegmentComplementLongueur,
  genMassePleinVideDifference,
  genDistanceParcourueCompteur,
  genPrixTotalAchat,
  genEcartTemperatureReleves,
  genTrouverTermeManquantSommeTrois,
  genDureeEntreDeuxInstants,
  genCompleterGraduationDemiDroiteAutomatisme,
  genLireAbscissePointDemiDroiteFigure,
  genAbscissePointDecimalUniteFigure,
];

// =========================== Chapitre 4 : Calcul littéral ===========================
// (Série 1 "Automatismes" du chapitre — suites et motifs qui évoluent selon une
// règle, sans lettre ni écriture littérale à ce stade : celles-ci sont
// travaillées dans le chapitre proprement dit, voir calcul-litteral.js.)

// ---------- 1. Suite arithmétique : terme suivant ----------
function genSuiteArithmetiqueTermeSuivant() {
  const premier = randInt(1, 20);
  const raison = nonZero(-8, 8);
  const termes = [premier, premier + raison, premier + 2 * raison, premier + 3 * raison];
  const answer = premier + 4 * raison;
  return {
    type: "numeric",
    chapter: "Automatismes — Suites",
    prompt: `Voici une suite de nombres : ${termes.join(" ; ")} ; ... Quel est le nombre suivant ?`,
    answer,
    steps: [{ type: "regle", text: `On passe d'un terme au suivant en ${raison > 0 ? `ajoutant ${raison}` : `soustrayant ${-raison}`}.` }],
  };
}

// ---------- 2. Suite arithmétique : n-ième terme ----------
function genSuiteArithmetiqueNiemeTerme() {
  const premier = randInt(1, 15);
  const raison = randInt(2, 9);
  const n = randInt(5, 15);
  const answer = premier + (n - 1) * raison;
  return {
    type: "numeric",
    chapter: "Automatismes — Suites",
    prompt: `Une suite commence par ${premier} et on ajoute ${raison} à chaque étape. Quel est le ${n}${n === 1 ? "er" : "e"} terme de cette suite ?`,
    answer,
    steps: [{ type: "calcul", text: `${premier} + (${n} - 1) \\times ${raison} = ${answer}` }],
  };
}

// ---------- 3. Identifier la règle de passage d'un terme au suivant ----------
function genReglePassageDunTermeAuSuivantQCM() {
  const premier = randInt(1, 10);
  const raison = nonZero(-9, 9);
  const termes = [premier, premier + raison, premier + 2 * raison, premier + 3 * raison];
  const correct = raison > 0 ? `Ajouter ${raison}` : `Soustraire ${-raison}`;
  const wrong1 = raison > 0 ? `Soustraire ${raison}` : `Ajouter ${-raison}`;
  const wrong2 = `Multiplier par ${raison === 0 ? 2 : Math.abs(raison)}`;
  return {
    type: "qcm",
    chapter: "Automatismes — Suites",
    prompt: `Voici une suite de nombres : ${termes.join(" ; ")} ; ... Quelle règle permet de passer d'un terme au suivant ?`,
    answer: correct,
    options: shuffle([correct, wrong1, wrong2]),
    steps: [{ type: "regle", text: `On observe que chaque terme s'obtient à partir du précédent en ${correct.toLowerCase()}.` }],
  };
}

// ---------- 4. Pyramide de briques (nombre de briques à un niveau donné) ----------
function genPyramideBriquesNombreCarre() {
  const n = randInt(2, 10);
  const answer = n * n;
  return {
    type: "numeric",
    chapter: "Automatismes — Suites",
    prompt: `Dans une pyramide de briques, il y a 1 brique au 1er niveau, 4 briques au 2e niveau, 9 briques au 3e niveau, et ainsi de suite (le niveau k contient k² briques). Combien de briques y a-t-il au ${n}e niveau ?`,
    answer,
    steps: [{ type: "calcul", text: `${n}^2 = ${answer}` }],
  };
}

// ---------- 5. Pyramide de briques (total cumulé sur plusieurs niveaux) ----------
function genPyramideBriquesTotalCumule() {
  const n = randInt(2, 5);
  let total = 0;
  const detail = [];
  for (let k = 1; k <= n; k++) {
    total += k * k;
    detail.push(`${k}^2`);
  }
  return {
    type: "numeric",
    chapter: "Automatismes — Suites",
    prompt: `Dans une pyramide de briques, le niveau k contient k² briques. Combien de briques y a-t-il au total pour une pyramide de ${n} niveaux ?`,
    answer: total,
    steps: [{ type: "calcul", text: `${detail.join(" + ")} = ${total}` }],
  };
}

// ---------- 6. Motif de points qui évolue (suite arithmétique en contexte) ----------
function genMotifPointsCroissantLineaire() {
  const premier = randInt(1, 5);
  const raison = randInt(2, 6);
  const n = randInt(4, 10);
  const answer = premier + (n - 1) * raison;
  return {
    type: "numeric",
    chapter: "Automatismes — Suites",
    prompt: `Un motif de points évolue ainsi : à l'étape 1, il y a ${premier} point(s) ; à chaque étape suivante, on ajoute ${raison} points. Combien de points y a-t-il à l'étape ${n} ?`,
    answer,
    steps: [{ type: "calcul", text: `${premier} + (${n} - 1) \\times ${raison} = ${answer}` }],
  };
}

// ---------- 7. Motif de triangles qui pointent alternativement (suite en contexte) ----------
function genMotifTrianglesAlterneCompte() {
  const raison = randInt(2, 4);
  const n = randInt(4, 9);
  const answer = 1 + (n - 1) * raison;
  return {
    type: "numeric",
    chapter: "Automatismes — Suites",
    prompt: `Un motif de triangles qui pointent alternativement évolue ainsi : la figure 1 contient 1 triangle, puis on ajoute ${raison} triangles à chaque figure suivante. Combien de triangles contient la figure ${n} ?`,
    answer,
    steps: [{ type: "calcul", text: `1 + (${n} - 1) \\times ${raison} = ${answer}` }],
  };
}

const CH_CALCUL_LITTERAL = [
  genSuiteArithmetiqueTermeSuivant,
  genSuiteArithmetiqueNiemeTerme,
  genReglePassageDunTermeAuSuivantQCM,
  genPyramideBriquesNombreCarre,
  genPyramideBriquesTotalCumule,
  genMotifPointsCroissantLineaire,
  genMotifTrianglesAlterneCompte,
];

const CH_OPERATIONS = [
  genTrouverFacteurManquant,
  genMultDiviserPuissanceDix,
  genCompleterMultiplicateurPuissanceDix,
  genCalculerAstucieusementRegroupement,
  genAdditionnerDecimaux,
  genSoustraireDecimaux,
  genCompleterEgaliteATrou,
  genProblemeDePlusDeMoins,
  genProduitDecimalSimple,
  genCompleterProduitTrouEntier,
];

const CH_DIVISIBILITE_FRACTIONS = [
  genDivisibiliteQCM,
  genDivisionEuclidienneCalcul,
  genFactorisationDeuxFacteurs,
  genRepartirQuantiteEnUnites,
  genDiviseurDeNombreQCM,
  genEcritureDecimaleFractionSimple,
  genFractionDunNombreEntierMental,
  genAbscisseDemiDroiteGradueeFraction,
];

const CH_PUISSANCES = [genProduitAvecUnite, genCarreOuCubeMental, genAvecSansParenthesesPuissanceMental];

// =========================== Chapitre 7 : Symétrie centrale, parallélogrammes ===========================
// (Série 1 "Automatismes" du chapitre — reconnaissance rapide et calculs
// mentaux d'angles/longueurs, sans figure : le contenu avec figures et
// démonstrations est traité dans symetrie-centrale-parallelogrammes.js.)

// ---------- 1. Angles opposés par le sommet (mental) ----------
function genAutoAnglesOpposesSommet() {
  const angle = randInt(10, 170);
  return {
    type: "numeric",
    chapter: "Automatismes — Angles opposés par le sommet",
    prompt: `Deux angles opposés par le sommet : l'un mesure ${angle}°. Quelle est la mesure de l'autre, en degrés ?`,
    answer: angle,
    steps: [{ type: "regle", text: `Deux angles opposés par le sommet ont la même mesure.` }],
  };
}

// ---------- 2. Angles supplémentaires (mental) ----------
function genAutoAnglesSupplementaires() {
  const angle = randInt(10, 170);
  const answer = 180 - angle;
  return {
    type: "numeric",
    chapter: "Automatismes — Angles supplémentaires",
    prompt: `Deux angles supplémentaires : l'un mesure ${angle}°. Quelle est la mesure de l'autre, en degrés ?`,
    answer,
    steps: [{ type: "calcul", text: `180 - ${angle} = ${answer}` }],
  };
}

// ---------- 3. Bissectrice : moitié d'un angle (mental) ----------
function genAutoBissectriceMoitie() {
  const total = randInt(1, 90) * 2;
  return {
    type: "numeric",
    chapter: "Automatismes — Bissectrice",
    prompt: `Une bissectrice partage un angle de ${total}° en deux angles égaux. Quelle est la mesure de chacun de ces deux angles, en degrés ?`,
    answer: total / 2,
    steps: [{ type: "calcul", text: `${total} \\div 2 = ${total / 2}` }],
  };
}

// ---------- 4. Nombre de centres de symétrie (mental, QCM) ----------
function genAutoCentreSymetrieNombre() {
  const figures = [
    { nom: "un carré", n: 1 },
    { nom: "un rectangle", n: 1 },
    { nom: "un cercle", n: 1 },
    { nom: "un losange", n: 1 },
    { nom: "un triangle équilatéral", n: 0 },
  ];
  const { nom, n } = pick(figures);
  return {
    type: "qcm",
    chapter: "Automatismes — Centre de symétrie",
    prompt: `Combien de centre(s) de symétrie possède ${nom} ?`,
    answer: `${n}`,
    options: ["0", "1", "2"],
    steps: [{ type: "regle", text: n === 1 ? `${nom} possède un centre de symétrie.` : `${nom} ne possède pas de centre de symétrie.` }],
  };
}

// ---------- 5. Parallélogramme : côté opposé (mental) ----------
function genAutoParallelogrammeCoteOppose() {
  const cote = randDecimal(2, 20, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Parallélogramme",
    prompt: `ABCD est un parallélogramme avec AB = ${fr(cote)} cm. Quelle est la longueur CD, en cm ?`,
    answer: cote,
    steps: [{ type: "regle", text: `Dans un parallélogramme, les côtés opposés sont égaux : CD = AB = ${fr(cote)} cm.` }],
  };
}

// ---------- 6. Parallélogramme : angle opposé (mental) ----------
function genAutoParallelogrammeAngleOppose() {
  const angle = randInt(20, 160);
  return {
    type: "numeric",
    chapter: "Automatismes — Parallélogramme",
    prompt: `ABCD est un parallélogramme. L'angle \\(\\widehat{ABC}\\) mesure ${angle}°. Quelle est la mesure de l'angle \\(\\widehat{ADC}\\), en degrés ?`,
    answer: angle,
    steps: [{ type: "regle", text: `Dans un parallélogramme, les angles opposés sont égaux : ${angle}°.` }],
  };
}

const CH_SYMETRIE_PARALLELOGRAMMES = [
  genAutoAnglesOpposesSommet,
  genAutoAnglesSupplementaires,
  genAutoBissectriceMoitie,
  genAutoCentreSymetrieNombre,
  genAutoParallelogrammeCoteOppose,
  genAutoParallelogrammeAngleOppose,
];

// =========================== Chapitre 8 : Triangles ===========================
// (Série 1 "Automatismes" du chapitre — calculs mentaux rapides, sans figure :
// le contenu avec figures et démonstrations est traité dans triangles.js.)

// ---------- 1. Angle manquant dans un triangle (mental) ----------
function genAutoAngleManquantTriangle() {
  const a = randInt(20, 100);
  const b = randInt(20, 150 - a);
  const c = 180 - a - b;
  return {
    type: "numeric",
    chapter: "Automatismes — Angles dans un triangle",
    prompt: `Un triangle a des angles de ${a}° et ${b}°. Quelle est la mesure du troisième angle, en degrés ?`,
    answer: c,
    steps: [{ type: "calcul", text: `180 - ${a} - ${b} = ${c}` }],
  };
}

// ---------- 2. Triangle isocèle : angle à la base (mental) ----------
function genAutoTriangleIsoceleAngleBase() {
  const apex = randInt(10, 150);
  if ((180 - apex) % 2 !== 0) return genAutoTriangleIsoceleAngleBase();
  const base = (180 - apex) / 2;
  return {
    type: "numeric",
    chapter: "Automatismes — Triangle isocèle",
    prompt: `Un triangle isocèle a un angle au sommet de ${apex}°. Quelle est la mesure de chacun des deux angles à la base, en degrés ?`,
    answer: base,
    steps: [{ type: "calcul", text: `(180 - ${apex}) \\div 2 = ${base}` }],
  };
}

// ---------- 3. Aire d'un triangle (mental) ----------
function genAutoAireTriangleBaseHauteur() {
  const base = randInt(4, 20);
  const hauteur = pick([2, 4, 6, 8, 10, 12, 14, 16]);
  const answer = (base * hauteur) / 2;
  return {
    type: "numeric",
    chapter: "Automatismes — Aire d'un triangle",
    prompt: `Un triangle a une base de ${base} cm et une hauteur de ${hauteur} cm. Quelle est son aire, en cm² ?`,
    answer,
    steps: [{ type: "calcul", text: `(${base} \\times ${hauteur}) \\div 2 = ${answer}` }],
  };
}

// ---------- 4. Médiane et milieu (mental) ----------
function genAutoMedianeMilieu() {
  const bc = randInt(4, 40) * 2;
  return {
    type: "numeric",
    chapter: "Automatismes — Médianes",
    prompt: `Dans un triangle ABC, M est le milieu de [BC]. Sachant que BC = ${bc} cm, quelle est la longueur BM, en cm ?`,
    answer: bc / 2,
    steps: [{ type: "calcul", text: `${bc} \\div 2 = ${bc / 2}` }],
  };
}

// ---------- 5. Centre de gravité : ratio 2/3 (mental) ----------
function genAutoCentreGraviteRatio() {
  const am = randInt(3, 30) * 3;
  const answer = (2 / 3) * am;
  return {
    type: "numeric",
    chapter: "Automatismes — Centre de gravité",
    prompt: `G est le centre de gravité d'un triangle, sur la médiane [AM]. Sachant que AM = ${am} cm, quelle est la longueur AG, en cm ?`,
    answer,
    steps: [{ type: "calcul", text: `AG = (2/3) \\times AM = (2/3) \\times ${am} = ${answer}` }],
  };
}

// ---------- 6. Vocabulaire : orthocentre / centre de gravité (mental, QCM) ----------
function genAutoVocabulaireTriangleQCM() {
  const items = [
    { q: "point d'intersection des trois hauteurs", r: "L'orthocentre" },
    { q: "point d'intersection des trois médianes", r: "Le centre de gravité" },
    { q: "point d'intersection des trois médiatrices (centre du cercle circonscrit)", r: "Le centre du cercle circonscrit" },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Automatismes — Vocabulaire du triangle",
    prompt: `Comment appelle-t-on le ${it.q} d'un triangle ?`,
    answer: it.r,
    options: shuffle(["L'orthocentre", "Le centre de gravité", "Le centre du cercle circonscrit"]),
    steps: [{ type: "donnee", text: `Il s'agit de : ${it.r.toLowerCase()}.` }],
  };
}

const CH_TRIANGLES = [
  genAutoAngleManquantTriangle,
  genAutoTriangleIsoceleAngleBase,
  genAutoAireTriangleBaseHauteur,
  genAutoMedianeMilieu,
  genAutoCentreGraviteRatio,
  genAutoVocabulaireTriangleQCM,
];

// =========================== Chapitre 6 : Géométrie dans l'espace ===========================
// (Série 1 "Automatismes" du chapitre — calculs mentaux rapides de volumes et
// d'aires, sans figure : le contenu complet est traité dans geometrie-espace.js.)

// ---------- 1. Volume d'un pavé droit (mental) ----------
function genAutoVolumePaveDroit() {
  const L = randInt(2, 12);
  const l = randInt(2, 10);
  const h = randInt(2, 10);
  const answer = L * l * h;
  return {
    type: "numeric",
    chapter: "Automatismes — Volume d'un pavé droit",
    prompt: `Calcule le volume d'un pavé droit de dimensions ${L} cm × ${l} cm × ${h} cm, en cm³.`,
    answer,
    steps: [{ type: "calcul", text: `${L} \\times ${l} \\times ${h} = ${answer}` }],
  };
}

// ---------- 2. Volume d'un cube (mental) ----------
function genAutoVolumeCube() {
  const c = randInt(2, 12);
  const answer = c ** 3;
  return {
    type: "numeric",
    chapter: "Automatismes — Volume d'un cube",
    prompt: `Calcule le volume d'un cube d'arête ${c} cm, en cm³.`,
    answer,
    steps: [{ type: "calcul", text: `${c} \\times ${c} \\times ${c} = ${answer}` }],
  };
}

// ---------- 3. Aire d'un disque (mental, approché) ----------
function genAutoAireDisqueApprochee() {
  const r = randInt(2, 15);
  const answer = roundTo(Math.PI * r * r, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Aire du disque",
    prompt: `Calcule l'aire d'un disque de rayon ${r} cm, en cm², arrondie au centième.`,
    answer,
    tolerance: Math.max(0.05, roundTo(answer * 0.005, 2)),
    steps: [{ type: "calcul", text: `\\pi \\times ${r}^2 \\approx ${fr(answer)}` }],
  };
}

// ---------- 4. Correspondance volume / capacité (mental) ----------
function genAutoConversionVolumeCapacite() {
  const v = randDecimal(0.5, 200, 1);
  const versLitres = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Volumes et capacités",
    prompt: versLitres ? `Convertis ${fr(v)} dm³ en litres (L).` : `Convertis ${fr(v)} L en dm³.`,
    answer: v,
    tolerance: 0.01,
    steps: [{ type: "regle", text: `1 dm³ = 1 L, donc les deux valeurs sont égales : ${fr(v)}.` }],
  };
}

// ---------- 5. Faces latérales d'un prisme droit (mental) ----------
function genAutoFacesLateralesPrisme() {
  const n = randInt(3, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Patrons",
    prompt: `Un prisme droit a une base à ${n} côtés. Combien de faces latérales rectangulaires possède-t-il ?`,
    answer: n,
    steps: [{ type: "regle", text: `Autant de faces latérales que de côtés à la base : ${n}.` }],
  };
}

const CH_GEOMETRIE_ESPACE = [
  genAutoVolumePaveDroit,
  genAutoVolumeCube,
  genAutoAireDisqueApprochee,
  genAutoConversionVolumeCapacite,
  genAutoFacesLateralesPrisme,
];

// =========================== Chapitre 9 : Statistiques, probabilités ===========================
// (Série 1 "Automatismes" du chapitre — calculs mentaux rapides, sans figure :
// le contenu complet est traité dans statistiques-probabilites.js.)

// ---------- 1. Calculer une moyenne simple (mental) ----------
function genAutoMoyenneSimple() {
  const n = randInt(3, 5);
  const valeurs = Array.from({ length: n }, () => randInt(0, 20));
  const total = valeurs.reduce((s, v) => s + v, 0);
  const answer = roundTo(total / n, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Moyenne",
    prompt: `Calcule la moyenne de : ${valeurs.join(" ; ")}`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `(${valeurs.join(" + ")}) \\div ${n} \\approx ${fr(answer)}` }],
  };
}

// ---------- 2. Fréquence en pourcentage (mental) ----------
function genAutoFrequencePourcentage() {
  const total = pick([10, 20, 25, 50, 100]);
  const effectif = randInt(1, total - 1);
  const answer = roundTo((effectif / total) * 100, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Fréquence",
    prompt: `Sur ${total} personnes interrogées, ${effectif} répondent "oui". Quelle est la fréquence en pourcentage ?`,
    answer,
    tolerance: 0.1,
    steps: [{ type: "calcul", text: `(${effectif} \\div ${total}) \\times 100 = ${fr(answer)} \\%` }],
  };
}

// ---------- 3. Probabilité simple avec un dé (mental) ----------
function genAutoProbabiliteDe() {
  const criteres = [
    { desc: "obtenir un nombre pair", favorables: 3 },
    { desc: "obtenir un multiple de 3", favorables: 2 },
    { desc: "obtenir 6", favorables: 1 },
  ];
  const it = pick(criteres);
  const answer = roundTo(it.favorables / 6, 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `On lance un dé à 6 faces. Quelle est la probabilité de "${it.desc}" (sous forme décimale) ?`,
    answer,
    tolerance: 0.001,
    steps: [{ type: "calcul", text: `${it.favorables} \\div 6 \\approx ${fr(answer)}` }],
  };
}

// ---------- 4. Événement contraire (mental) ----------
function genAutoEvenementContraire() {
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9]);
  return {
    type: "numeric",
    chapter: "Automatismes — Événement contraire",
    prompt: `Un événement A a une probabilité P(A) = ${fr(p)}. Quelle est la probabilité de l'événement contraire ?`,
    answer: roundTo(1 - p, 2),
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `1 - ${fr(p)} = ${fr(roundTo(1 - p, 2))}` }],
  };
}

// ---------- 5. Qualifier un événement (mental, QCM) ----------
function genAutoQualifierEvenementQCM() {
  const items = [
    { texte: "Obtenir un nombre pair avec un dé à 6 faces", r: "Probable" },
    { texte: "Obtenir 7 avec un dé à 6 faces", r: "Impossible" },
    { texte: "Obtenir un nombre inférieur à 7 avec un dé à 6 faces", r: "Certain" },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Automatismes — Qualifier un événement",
    prompt: `Comment qualifier l'événement : "${it.texte}" ?`,
    answer: it.r,
    options: ["Impossible", "Certain", "Probable"],
    steps: [{ type: "regle", text: `On compare l'événement décrit aux issues possibles.` }],
  };
}

const CH_STATISTIQUES_PROBABILITES = [
  genAutoMoyenneSimple,
  genAutoFrequencePourcentage,
  genAutoProbabiliteDe,
  genAutoEvenementContraire,
  genAutoQualifierEvenementQCM,
];

// =========================== Chapitre 10 : Proportionnalité ===========================
// (Série 1 "Automatismes" du chapitre — calculs mentaux rapides, sans figure :
// le contenu complet est traité dans proportionnalite-cinquieme.js.)

// ---------- 1. Pourcentage d'une quantité (mental) ----------
function genAutoPourcentageDuneQuantite() {
  const p = pick([10, 20, 25, 50, 75]);
  const total = pick([20, 40, 60, 80, 100, 120, 200]);
  const answer = roundTo((p / 100) * total, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Pourcentages",
    prompt: `Calcule ${p} % de ${total}.`,
    answer,
    steps: [{ type: "calcul", text: `${total} \\times ${p} \\div 100 = ${fr(answer)}` }],
  };
}

// ---------- 2. Coefficient de proportionnalité (mental) ----------
function genAutoCoefficientProportionnalite() {
  const k = pick([2, 3, 4, 5, 0.5, 0.25]);
  const a = randInt(2, 12);
  const b = roundTo(a * k, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Coefficient",
    prompt: `Dans un tableau de proportionnalité, ${a} correspond à ${fr(b)}. Quel est le coefficient de proportionnalité ?`,
    answer: k,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${fr(b)} \\div ${a} = ${fr(k)}` }],
  };
}

// ---------- 3. Vitesse, distance, temps (mental) ----------
function genAutoVitesseDistanceTemps() {
  const vitesse = pick([10, 20, 30, 40, 50, 60, 80, 100, 120]);
  const temps = pick([1, 2, 3, 0.5]);
  const answer = vitesse * temps;
  return {
    type: "numeric",
    chapter: "Automatismes — Vitesse",
    prompt: `Un véhicule roule à ${vitesse} km/h pendant ${fr(temps)} h. Quelle distance parcourt-il, en km ?`,
    answer,
    steps: [{ type: "calcul", text: `${vitesse} \\times ${fr(temps)} = ${answer}` }],
  };
}

// ---------- 4. Échelle (mental) ----------
function genAutoEchelleDistance() {
  const echelleN = pick([100, 1000, 10000]);
  const distanceCarte = randInt(1, 10);
  const answerM = roundTo((distanceCarte * echelleN) / 100, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Échelles",
    prompt: `Sur une carte à l'échelle 1/${echelleN}, une distance mesure ${distanceCarte} cm. Quelle est la distance réelle, en mètres ?`,
    answer: answerM,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `${distanceCarte} \\times ${echelleN} = ${distanceCarte * echelleN} \\text{ cm} = ${fr(answerM)} \\text{ m}` }],
  };
}

// ---------- 5. Reconnaître une situation de proportionnalité (mental, QCM) ----------
function genAutoReconnaitreProportionnaliteQCM() {
  return {
    type: "qcm",
    chapter: "Automatismes — Reconnaître une situation",
    prompt: `Sur un graphique, les points représentant deux grandeurs sont alignés sur une droite passant par l'origine du repère. La situation est-elle proportionnelle ?`,
    answer: "Oui",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `Une droite passant par l'origine caractérise une situation de proportionnalité.` }],
  };
}

const CH_PROPORTIONNALITE = [
  genAutoPourcentageDuneQuantite,
  genAutoCoefficientProportionnalite,
  genAutoVitesseDistanceTemps,
  genAutoEchelleDistance,
  genAutoReconnaitreProportionnaliteQCM,
];

// =========================== Chapitre 11 : Fonctions ===========================
// (Série 1 "Automatismes" du chapitre — calculs mentaux rapides, sans figure :
// le contenu complet est traité dans fonctions.js.)

// ---------- 1. Évaluer une fonction affine (mental) ----------
function genAutoEvaluerFonctionAffine() {
  const a = nonZero(-6, 6);
  const b = randInt(-8, 8);
  const x = randInt(-6, 6);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Évaluer une fonction",
    prompt: `On considère \\(f(x) = ${a}x ${b >= 0 ? "+" : ""} ${b}\\). Calcule \\(f(${x})\\).`,
    answer,
    steps: [{ type: "calcul", text: `${a} \\times ${x} ${b >= 0 ? "+" : ""} ${b} = ${answer}` }],
  };
}

// ---------- 2. Programme de calcul (mental) ----------
function genAutoProgrammeCalculMental() {
  const add = randInt(1, 10);
  const mult = randInt(2, 5);
  const x = randInt(1, 15);
  const answer = (x + add) * mult;
  return {
    type: "numeric",
    chapter: "Automatismes — Programme de calcul",
    prompt: `Programme : ajouter ${add}, puis multiplier par ${mult}. Quel résultat obtient-on en partant de ${x} ?`,
    answer,
    steps: [{ type: "calcul", text: `(${x} + ${add}) \\times ${mult} = ${answer}` }],
  };
}

// ---------- 3. Vocabulaire des fonctions (mental, QCM) ----------
function genAutoVocabulaireFonctionsQCM() {
  return {
    type: "qcm",
    chapter: "Automatismes — Vocabulaire",
    prompt: `Sur un graphique représentant y en fonction de x, sur quel axe place-t-on x ?`,
    answer: "En abscisse",
    options: shuffle(["En abscisse", "En ordonnée", "Sur les deux axes"]),
    steps: [{ type: "regle", text: `x est la variable, elle se place en abscisse.` }],
  };
}

// ---------- 4. Aire d'un carré en fonction du côté (mental) ----------
function genAutoAireCarreFonctionCote() {
  const c = randInt(2, 15);
  const answer = c * c;
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions en contexte",
    prompt: `L'aire d'un carré de côté c vérifie A(c) = c × c. Quelle est l'aire d'un carré de côté ${c} cm, en cm² ?`,
    answer,
    steps: [{ type: "calcul", text: `${c} \\times ${c} = ${answer}` }],
  };
}

const CH_FONCTIONS = [
  genAutoEvaluerFonctionAffine,
  genAutoProgrammeCalculMental,
  genAutoVocabulaireFonctionsQCM,
  genAutoAireCarreFonctionCote,
];

const THEMES = [
  { id: "operations-sur-les-nombres", title: "Opérations sur les nombres", generators: CH_OPERATIONS },
  { id: "divisibilite-fractions", title: "Divisibilité, fractions", generators: CH_DIVISIBILITE_FRACTIONS },
  { id: "puissances", title: "Puissances d'un nombre, carré et cube", generators: CH_PUISSANCES },
  { id: "calcul-litteral", title: "Calcul littéral", generators: CH_CALCUL_LITTERAL },
  { id: "nombres-relatifs", title: "Nombres relatifs", generators: CH_NOMBRES_RELATIFS },
  { id: "geometrie-espace", title: "Géométrie dans l'espace", generators: CH_GEOMETRIE_ESPACE },
  { id: "symetrie-centrale-parallelogrammes", title: "Symétrie centrale, parallélogrammes", generators: CH_SYMETRIE_PARALLELOGRAMMES },
  { id: "triangles", title: "Triangles", generators: CH_TRIANGLES },
  { id: "statistiques-probabilites", title: "Statistiques, probabilités", generators: CH_STATISTIQUES_PROBABILITES },
  { id: "proportionnalite-cinquieme", title: "Proportionnalité", generators: CH_PROPORTIONNALITE },
  { id: "fonctions", title: "Fonctions", generators: CH_FONCTIONS },
];

const GENERATORS = THEMES.flatMap((t) => t.generators);

function generate(themeId) {
  if (themeId && themeId !== "mix") {
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) return pick(theme.generators)();
  }
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "automatismes-cinquieme",
    title: "Automatismes",
    description: "Calcul rapide et automatismes du programme de 5e, chapitre après chapitre.",
    pourquoi: "Les automatismes, c'est le calcul mental qui libère de la place dans ta tête pour réfléchir au problème plutôt qu'à l'arithmétique : quelques minutes régulières valent mieux qu'une révision unique la veille du contrôle.",
    level: "cinquieme",
    freemiumDaily: 5,
    order: 1,
    isAutomatismes: true,
  },
  themes: THEMES.map(({ id, title }) => ({ id, title })),
  generate,
};
