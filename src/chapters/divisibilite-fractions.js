// ---------------------------------------------------------------------------
// Chapitre : Divisibilité, fractions (5e) — sous abonnement.
//
// Correspond au chapitre 2 du sommaire officiel : exploiter les multiples et
// les diviseurs, comparer des fractions, diviser par un nombre décimal,
// additionner/soustraire des fractions. Reprend la tâche intellectuelle des
// exercices fournis, avec des nombres, prénoms et contextes différents à
// chaque génération. Voir automatismes-cinquieme.js (thème "divisibilite-
// fractions") pour la Série 1 (Automatismes).
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

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

function pgcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

function ppcm(a, b) {
  return Math.abs(a * b) / pgcd(a, b);
}

function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

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
    freeLabels: [{ x: (A.x + B.x) / 2, y: y - 26, text: `${total} mm` }],
  };
}

// =========================== Exploiter les multiples et les diviseurs ===========================

// ---------- 1. Cars et places (division euclidienne en contexte) ----------
function genCarsEtPlaces() {
  const capacite = randInt(20, 60);
  const nbPersonnes = randInt(capacite * 2, capacite * 10);
  const nbCars = Math.ceil(nbPersonnes / capacite);
  const [ecole, sortie] = [pick(["l'école", "le collège"]), pick(["au musée", "à la patinoire", "au zoo", "en sortie scolaire"])];
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Multiples et diviseurs",
    prompt: `${nbPersonnes} élèves de ${ecole} partent ${sortie}. Chaque car peut transporter ${capacite} personnes. Combien de cars faut-il prévoir au minimum ?`,
    answer: nbCars,
    steps: [
      { type: "calcul", text: `${nbPersonnes} \\div ${capacite} = ${Math.floor(nbPersonnes / capacite)}${nbPersonnes % capacite ? ` reste ${nbPersonnes % capacite}` : ""}` },
      { type: "resultat", text: nbPersonnes % capacite ? `Il faut un car supplémentaire pour les personnes restantes : ${nbCars} cars.` : `${nbCars} cars suffisent exactement.` },
    ],
  };
}

// ---------- 2. Remplir des boîtes (multiple exact) ----------
function genRemplirBoites() {
  const parBoite = randInt(4, 20);
  const nbBoites = randInt(5, 30);
  const total = parBoite * nbBoites;
  const objet = pick(["œufs", "chocolats", "stylos", "billes", "cartes"]);
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Multiples et diviseurs",
    prompt: `On range ${total} ${objet} dans des boîtes de ${parBoite} ${objet} chacune, sans qu'il n'en reste. Combien de boîtes sont nécessaires ?`,
    answer: nbBoites,
    steps: [{ type: "calcul", text: `${total} \\div ${parBoite} = ${nbBoites}` }],
  };
}

// ---------- 3. Partage équitable avec reste ----------
function genPartageEquitableAvecReste() {
  const nbGroupes = randInt(3, 9);
  const parGroupe = randInt(5, 20);
  const reste = randInt(1, nbGroupes - 1 || 1);
  const total = nbGroupes * parGroupe + reste;
  const objet = pick(["bonbons", "images", "perles", "billes", "cartes"]);
  const prenom = pick(prenoms);
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Multiples et diviseurs",
    prompt: `${prenom} partage équitablement ${total} ${objet} entre ${nbGroupes} amis. Combien de ${objet} chaque ami reçoit-il ?`,
    answer: parGroupe,
    steps: [
      { type: "calcul", text: `${total} = ${nbGroupes} \\times ${parGroupe} + ${reste}` },
      { type: "resultat", text: `Chaque ami reçoit ${parGroupe} ${objet} (il en reste ${reste}).` },
    ],
  };
}

// ---------- 4. Mosaïque de carreaux carrés (diviseur commun contextualisé) ----------
// NOTE (audit programme 2026, 3.1) : le sigle « PGCD » n'apparaît nulle part
// dans le programme officiel du cycle 4 — retiré de l'étape de correction,
// remplacé par une formulation en langage courant (« plus grand diviseur
// commun », sans le nommer comme technique installée).
function genMosaiqueCarreauxPgcd() {
  const g = pick([2, 3, 4, 5, 6]);
  const longueur = g * randInt(3, 10);
  const largeur = g * randInt(2, 8);
  const côté = pgcd(longueur, largeur);
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Multiples et diviseurs",
    prompt: `Un rectangle de ${longueur} cm sur ${largeur} cm doit être entièrement pavé avec des carreaux carrés identiques, sans découpe. Quelle est la plus grande taille possible pour le côté d'un carreau, en cm ?`,
    answer: côté,
    steps: [{ type: "regle", text: `On cherche le plus grand diviseur commun à ${longueur} et ${largeur}, en essayant les diviseurs possibles : c'est ${côté}.` }],
  };
}

// ---------- 5. Nombre entre deux bornes divisible par... ----------
function genNombreEntreBornesDivisible() {
  const d = randInt(3, 12);
  let borneA = randInt(20, 80);
  let borneB = borneA + randInt(10, 20);
  const candidats = [];
  for (let n = borneA; n <= borneB; n++) if (n % d === 0) candidats.push(n);
  if (candidats.length === 0) {
    const base = Math.ceil(borneA / d) * d;
    borneB = Math.max(borneB, base);
    candidats.push(base);
  }
  const answer = candidats[0];
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Multiples et diviseurs",
    prompt: `Quel est le plus petit multiple de ${d} compris entre ${borneA} et ${borneB} (bornes incluses) ?`,
    answer,
    steps: [{ type: "calcul", text: `On cherche le premier multiple de ${d} à partir de ${borneA} : ${answer}.` }],
  };
}

// ---------- 6. Plus grand multiple sous une contrainte ----------
function genPlusGrandMultipleSousContrainte() {
  const d = randInt(4, 15);
  const limite = randInt(80, 300);
  const answer = Math.floor(limite / d) * d;
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Multiples et diviseurs",
    prompt: `Quel est le plus grand multiple de ${d} inférieur ou égal à ${limite} ?`,
    answer,
    steps: [
      { type: "calcul", text: `${limite} \\div ${d} = ${Math.floor(limite / d)}${limite % d ? ` reste ${limite % d}` : ""}` },
      { type: "calcul", text: `${Math.floor(limite / d)} \\times ${d} = ${answer}` },
    ],
  };
}

// ---------- 7. Un nombre est-il premier ? ----------
function genNombreEstPremierQCM() {
  const n = pick([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 4, 6, 8, 9, 10, 12, 15, 21, 25, 27, 33, 35, 49]);
  const prime = isPrime(n);
  return {
    type: "qcm",
    chapter: "Divisibilité, fractions — Multiples et diviseurs",
    prompt: `${n} est-il un nombre premier ?`,
    answer: prime ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      {
        type: "regle",
        text: prime
          ? `${n} n'a que deux diviseurs : 1 et lui-même. C'est un nombre premier.`
          : `${n} possède d'autres diviseurs que 1 et lui-même. Ce n'est pas un nombre premier.`,
      },
    ],
  };
}

// ---------- 8. Nombre de diviseurs d'un petit nombre premier ----------
function genNombreDiviseursDunPremier() {
  const p = pick([2, 3, 5, 7, 11, 13, 17, 19]);
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Multiples et diviseurs",
    prompt: `Combien ${p} possède-t-il de diviseurs ?`,
    answer: 2,
    steps: [{ type: "regle", text: `Un nombre premier a exactement deux diviseurs : 1 et lui-même.` }],
  };
}

// ---------- 9. Tester la primalité d'un résultat de calcul ----------
function genFormuleCalculPrimalite() {
  const n = randInt(2, 12);
  const valeur = n * n + n + 41; // formule d'Euler, souvent (mais pas toujours) premier
  const prime = isPrime(valeur);
  return {
    type: "qcm",
    chapter: "Divisibilité, fractions — Multiples et diviseurs",
    prompt: `On calcule \\(${n} \\times ${n} + ${n} + 41\\). Le résultat obtenu est-il un nombre premier ?`,
    answer: prime ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `${n} \\times ${n} + ${n} + 41 = ${valeur}` },
      { type: "resultat", text: prime ? `${valeur} n'a que deux diviseurs : 1 et lui-même. C'est un nombre premier.` : `${valeur} possède d'autres diviseurs que 1 et lui-même : ce n'est pas un nombre premier.` },
    ],
  };
}

// ---------- 10. Diviseur d'un nombre premier (piège : seuls 1 et lui-même) ----------
function genDiviseurDunNombrePremierQCM() {
  const p = pick([2, 3, 5, 7, 11, 13, 17, 19, 23]);
  const d = randInt(2, p - 1 || 2);
  const isDivisor = d === 1 || d === p;
  return {
    type: "qcm",
    chapter: "Divisibilité, fractions — Multiples et diviseurs",
    prompt: `${p} est un nombre premier. ${d} est-il un diviseur de ${p} ?`,
    answer: isDivisor ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `Les seuls diviseurs de ${p} (nombre premier) sont 1 et ${p}.` }],
  };
}

// =========================== Diviser par un nombre décimal ===========================

// ---------- 11. Transformer une division en division équivalente à diviseur entier ----------
function genTransformerDivisionDecimaleEnEntiere() {
  const decimals = pick([1, 2]);
  const diviseurDecimal = randDecimal(0.1, 9.9, decimals);
  const p = 10 ** decimals;
  const dividendeDecimal = randDecimal(1, 90, decimals);
  const nouveauDividende = roundTo(dividendeDecimal * p, decimals);
  const nouveauDiviseur = roundTo(diviseurDecimal * p, 0);
  return {
    type: "text",
    chapter: "Divisibilité, fractions — Diviser par un décimal",
    prompt: `On veut calculer \\(${frTex(dividendeDecimal)} \\div ${frTex(diviseurDecimal)}\\) en se ramenant à une division par un nombre entier. Par quel nombre entier doit-on diviser (nouveau diviseur) ?`,
    answer: `${nouveauDiviseur}`,
    steps: [{ type: "calcul", text: `On multiplie le dividende et le diviseur par ${p} : \\(${frTex(nouveauDividende)} \\div ${nouveauDiviseur}\\)` }],
  };
}

// ---------- 12. Longueur de ruban à découper (diviseur décimal) ----------
function genRubanDiviseurDecimal() {
  const morceau = randDecimal(0.1, 4.9, 1);
  const nbMorceaux = randInt(4, 20);
  const total = roundTo(morceau * nbMorceaux, 2);
  const objet = pick(["ruban", "corde", "tissu", "fil électrique"]);
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Diviser par un décimal",
    prompt: `Un ${objet} de ${fr(total)} m est découpé en morceaux de ${fr(morceau)} m chacun. Combien de morceaux obtient-on ?`,
    answer: nbMorceaux,
    steps: [{ type: "calcul", text: `${fr(total)} \\div ${fr(morceau)} = ${nbMorceaux}` }],
  };
}

// ---------- 13. Nombre de stylos qu'on peut acheter (diviseur décimal, prix) ----------
function genNombreStylosAchetes() {
  const prixUnitaire = randDecimal(0.5, 9.9, 2);
  const nbStylos = randInt(3, 25);
  const budget = roundTo(prixUnitaire * nbStylos, 2);
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Diviser par un décimal",
    prompt: `Un stylo coûte ${fr(prixUnitaire)} €. Combien de stylos peut-on acheter avec exactement ${fr(budget)} € ?`,
    answer: nbStylos,
    steps: [{ type: "calcul", text: `${fr(budget)} \\div ${fr(prixUnitaire)} = ${nbStylos}` }],
  };
}

// ---------- 14. Facteur d'agrandissement d'un rectangle (division décimale) ----------
function genFacteurAgrandissementRectangle() {
  const decimals = pick([1, 2]);
  const facteur = randDecimal(1.1, 4, decimals);
  const longueurInitiale = randInt(2, 15);
  const longueurFinale = roundTo(longueurInitiale * facteur, decimals);
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Diviser par un décimal",
    prompt: `Un rectangle de longueur ${longueurInitiale} cm est agrandi. Sa nouvelle longueur est de ${fr(longueurFinale)} cm. Par quel nombre la longueur initiale a-t-elle été multipliée ?`,
    answer: facteur,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `${fr(longueurFinale)} \\div ${longueurInitiale} = ${fr(facteur)}` }],
  };
}

// =========================== Comparer / additionner / soustraire des fractions ===========================

// ---------- 15. Simplifier une fraction au maximum ----------
function genSimplifierFractionAuMaximum() {
  let a0, b0;
  do {
    a0 = randInt(1, 8);
    b0 = randInt(2, 11);
  } while (pgcd(a0, b0) !== 1 || a0 >= b0);
  const k = randInt(2, 6);
  const num = a0 * k;
  const den = b0 * k;
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Fractions",
    prompt: `Simplifie au maximum : \\(\\dfrac{${num}}{${den}} = \\dfrac{?}{${b0}}\\)`,
    answer: a0,
    steps: [
      { type: "regle", text: `Pour simplifier une fraction, on divise le numérateur et le dénominateur par un même nombre (ici ${k}).` },
      { type: "calcul", text: `${num} \\div ${k} = ${a0}` },
      { type: "calcul", text: `${den} \\div ${k} = ${b0}` },
    ],
  };
}

// ---------- 16. Comparer deux fractions (dénominateurs différents) ----------
function genComparerFractionsDenominateursDifferentsQCM() {
  let a, b, c, d;
  do {
    a = randInt(1, 20);
    b = randInt(2, 20);
    c = randInt(1, 20);
    d = randInt(2, 20);
  } while (a * d === c * b);
  const correct = a * d < c * b ? "<" : ">";
  return {
    type: "qcm",
    chapter: "Divisibilité, fractions — Fractions",
    prompt: `Compare : \\(\\dfrac{${a}}{${b}}\\) ... \\(\\dfrac{${c}}{${d}}\\)`,
    answer: correct,
    options: ["<", ">", "="],
    steps: [{ type: "calcul", text: `On compare ${a} \\times ${d} = ${a * d} et ${c} \\times ${b} = ${c * b} (produits en croix).` }],
  };
}

// ---------- 17. Ranger des fractions dans l'ordre ----------
function genRangerFractionsCroissantQCM() {
  const values = new Map();
  while (values.size < 4) {
    const num = randInt(1, 11);
    const den = randInt(2, 12);
    const dec = roundTo(num / den, 4);
    if (![...values.values()].includes(dec)) values.set(`\\dfrac{${num}}{${den}}`, dec);
  }
  const entries = [...values.entries()];
  const asc = Math.random() < 0.5;
  const sorted = [...entries].sort((x, y) => (asc ? x[1] - y[1] : y[1] - x[1]));
  const correctOrder = sorted.map((e) => e[0]).join(" ; ");
  const wrongReverse = [...sorted].reverse().map((e) => e[0]).join(" ; ");
  const wrongRandom = shuffle(entries).map((e) => e[0]).join(" ; ");
  const options = shuffle([...new Set([correctOrder, wrongReverse, wrongRandom])]);
  return {
    type: "qcm",
    chapter: "Divisibilité, fractions — Fractions",
    prompt: `Range dans l'ordre ${asc ? "croissant" : "décroissant"} les fractions suivantes : \\(${entries.map((e) => e[0]).join(", ")}\\)`,
    answer: correctOrder,
    options: options.length >= 2 ? options : [correctOrder, wrongRandom],
    steps: [{ type: "regle", text: `On convertit chaque fraction en écriture décimale pour les comparer.` }],
  };
}

// ---------- 18. Additionner deux fractions (dénominateurs différents) ----------
// NOTE (audit programme 2026, 3.2) : le sigle « PPCM » n'apparaît nulle part
// dans le programme officiel du cycle 4 — retiré des étapes de correction
// (ici et dans genSoustraireFractionsDenominateursDifferentsLCM), remplacé
// par « dénominateur commun » en langage courant (le calcul reste correct).
function genAdditionnerFractionsDenominateursDifferentsLCM() {
  let b, d;
  do {
    b = randInt(3, 12);
    d = randInt(3, 12);
  } while (b === d);
  const L = ppcm(b, d);
  const numA = randInt(1, b - 1);
  const numD = randInt(1, d - 1);
  const newNumA = numA * (L / b);
  const newNumD = numD * (L / d);
  const answer = newNumA + newNumD;
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Fractions",
    prompt: `\\(\\dfrac{${numA}}{${b}} + \\dfrac{${numD}}{${d}} = \\dfrac{?}{${L}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [
      { type: "calcul", text: `On cherche un dénominateur commun à ${b} et ${d} : ${L}.` },
      { type: "calcul", text: `\\dfrac{${numA}}{${b}} = \\dfrac{${newNumA}}{${L}}\\ \\text{et}\\ \\dfrac{${numD}}{${d}} = \\dfrac{${newNumD}}{${L}}` },
      { type: "calcul", text: `${newNumA} + ${newNumD} = ${answer}` },
    ],
  };
}

// ---------- 19. Soustraire deux fractions (dénominateurs différents) ----------
function genSoustraireFractionsDenominateursDifferentsLCM() {
  let b, d;
  do {
    b = randInt(3, 12);
    d = randInt(3, 12);
  } while (b === d);
  const L = ppcm(b, d);
  let numA = randInt(1, b - 1);
  let numD = randInt(1, d - 1);
  let newNumA = numA * (L / b);
  let newNumD = numD * (L / d);
  if (newNumA < newNumD) {
    [numA, numD] = [numD, numA];
    [b, d] = [d, b];
    newNumA = numA * (L / b);
    newNumD = numD * (L / d);
  }
  const answer = newNumA - newNumD;
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Fractions",
    prompt: `\\(\\dfrac{${numA}}{${b}} - \\dfrac{${numD}}{${d}} = \\dfrac{?}{${L}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [
      { type: "calcul", text: `On cherche un dénominateur commun à ${b} et ${d} : ${L}.` },
      { type: "calcul", text: `\\dfrac{${numA}}{${b}} = \\dfrac{${newNumA}}{${L}}\\ \\text{et}\\ \\dfrac{${numD}}{${d}} = \\dfrac{${newNumD}}{${L}}` },
      { type: "calcul", text: `${newNumA} - ${newNumD} = ${answer}` },
    ],
  };
}

// ---------- 20. Comparer une fraction à 1 ou à 0,5 ----------
function genComparerFractionUniteEtDemiQCM() {
  const b = randInt(2, 12);
  const a = randInt(1, 2 * b - 1);
  const target1 = Math.random() < 0.5;
  const cmp = target1 ? a - b : 2 * a - b;
  const answer = cmp < 0 ? "Inférieure" : cmp > 0 ? "Supérieure" : "Égale";
  return {
    type: "qcm",
    chapter: "Divisibilité, fractions — Fractions",
    prompt: `La fraction \\(\\dfrac{${a}}{${b}}\\) est-elle inférieure, égale ou supérieure à ${target1 ? "1" : "0,5"} ?`,
    answer,
    options: ["Inférieure", "Égale", "Supérieure"],
    steps: target1
      ? [{ type: "regle", text: `On compare le numérateur ${a} et le dénominateur ${b}.` }]
      : [{ type: "regle", text: `On compare ${a} et la moitié de ${b}, soit ${fr(b / 2)}.` }],
  };
}

// ---------- 21. Problème : fraction totale d'un ensemble ----------
function genProblemeSachetsFractionSomme() {
  const d1 = pick([3, 4, 5, 6]);
  const d2 = pick([7, 8, 9, 10, 12]);
  const total = roundTo(1 / d1 + 2 / d2, 4);
  const [premier, second] = pick([
    ["bonbons au caramel", "bonbons aux fruits"],
    ["billes bleues", "billes vertes"],
    ["images rares", "images communes"],
  ]);
  const contenant = pick(["sachet", "lot", "paquet"]);
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Fractions",
    prompt: `Dans chaque ${contenant}, on met \\(\\dfrac{1}{${d1}}\\) de ${premier}, et \\(\\dfrac{2}{${d2}}\\) de ${second}. Quelle fraction du ${contenant} (en écriture décimale, arrondie au centième) représentent ces deux catégories réunies ?`,
    answer: total,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `On convertit chaque fraction en écriture décimale avant de les additionner.` },
      { type: "calcul", text: `\\dfrac{1}{${d1}} + \\dfrac{2}{${d2}} \\approx ${fr(total)}` },
    ],
  };
}

// ---------- 22. Problème : segment et point à une fraction donnée (figure) ----------
// NOTE (audit programme 2026, 3.7) : l'automatisme officiel de 5e prévoit de
// « prendre une fraction simple d'un nombre » (fractions unitaires : le
// tiers, le quart...). Fractions p/q limitées à des cas simples (unitaires
// ou proches, p ≤ 2) plutôt que des p/q quelconques, pour rester strictement
// dans le cadre de l'automatisme.
function genProblemeSegmentPointFractionAB() {
  const q = pick([3, 4, 5, 6]);
  const p = pick([1, Math.min(2, q - 1)]);
  const m = randInt(4, 12);
  const ab = q * m;
  const ac = p * m;
  const cb = ab - ac;
  return {
    type: "numeric",
    chapter: "Divisibilité, fractions — Fractions",
    prompt: `On trace un segment [AB] de ${ab} mm. On place le point C sur [AB] tel que AC mesure les \\(\\dfrac{${p}}{${q}}\\) de AB. Quelle est la longueur AC, en mm ?`,
    figure: buildSegmentAlignedFigure(ac, cb),
    answer: ac,
    steps: [
      { type: "regle", text: `Prendre les \\(\\dfrac{${p}}{${q}}\\) d'une longueur, c'est la multiplier par \\(\\dfrac{${p}}{${q}}\\).` },
      { type: "calcul", text: `\\dfrac{${p}}{${q}} \\times ${ab} = ${ac}` },
    ],
  };
}

const GENERATORS = [
  genCarsEtPlaces,
  genRemplirBoites,
  genPartageEquitableAvecReste,
  genMosaiqueCarreauxPgcd,
  genNombreEntreBornesDivisible,
  genPlusGrandMultipleSousContrainte,
  genNombreEstPremierQCM,
  genNombreDiviseursDunPremier,
  genFormuleCalculPrimalite,
  genDiviseurDunNombrePremierQCM,
  genTransformerDivisionDecimaleEnEntiere,
  genRubanDiviseurDecimal,
  genNombreStylosAchetes,
  genFacteurAgrandissementRectangle,
  genSimplifierFractionAuMaximum,
  genComparerFractionsDenominateursDifferentsQCM,
  genRangerFractionsCroissantQCM,
  genAdditionnerFractionsDenominateursDifferentsLCM,
  genSoustraireFractionsDenominateursDifferentsLCM,
  genComparerFractionUniteEtDemiQCM,
  genProblemeSachetsFractionSomme,
  genProblemeSegmentPointFractionAB,
];

const DIFFICULTY = {
  genNombreEstPremierQCM: "facile",
  genNombreDiviseursDunPremier: "facile",
  genDiviseurDunNombrePremierQCM: "facile",
  genSimplifierFractionAuMaximum: "facile",
  genComparerFractionUniteEtDemiQCM: "facile",
  genCarsEtPlaces: "standard",
  genRemplirBoites: "standard",
  genPartageEquitableAvecReste: "standard",
  genNombreEntreBornesDivisible: "standard",
  genPlusGrandMultipleSousContrainte: "standard",
  genFormuleCalculPrimalite: "standard",
  genTransformerDivisionDecimaleEnEntiere: "standard",
  genFacteurAgrandissementRectangle: "standard",
  genComparerFractionsDenominateursDifferentsQCM: "standard",
  genRangerFractionsCroissantQCM: "standard",
  genAdditionnerFractionsDenominateursDifferentsLCM: "standard",
  genSoustraireFractionsDenominateursDifferentsLCM: "standard",
  genMosaiqueCarreauxPgcd: "expert",
  genRubanDiviseurDecimal: "expert",
  genNombreStylosAchetes: "expert",
  genProblemeSachetsFractionSomme: "expert",
  genProblemeSegmentPointFractionAB: "expert",
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
    id: "divisibilite-fractions",
    title: "Divisibilité, fractions",
    description: "Multiples et diviseurs, nombres premiers, division par un décimal, comparer et additionner/soustraire des fractions.",
    pourquoi: "Reconnaître multiples, diviseurs et nombres premiers, c'est ce qui permet de simplifier une fraction sans erreur et de comprendre la structure des nombres.",
    level: "cinquieme",
    free: false,
    order: 3,
  },
  generate,
};
