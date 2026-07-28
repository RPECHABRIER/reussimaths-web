// ---------------------------------------------------------------------------
// Chapitre : Organisation et gestion de données (6e, abonnement). Couvre le
// Mémo 1 "Exploiter ou présenter des données" (tableaux, diagrammes en
// bâtons, tableaux à double entrée), le Mémo 2 "Comprendre la notion de
// probabilité" (expérience aléatoire, issues, échelle de probabilité) et le
// Mémo 3 "Calculer une probabilité" (urnes, dés, cartes, roue, fréquence),
// ainsi qu'une sélection des problèmes de la page "Je m'entraîne à résoudre
// des problèmes".
//
// Convention diagramme en bâtons : comme l'application n'a pas de composant
// de graphique dédié, on réutilise le composant Figure (SVG points/segments)
// pour dessiner de vrais "bâtons" : un point bas + un point haut par
// catégorie relié par un segment, plus un axe horizontal et des freeLabels
// pour les noms de catégories et les valeurs — voir buildBarChartFigure().
//
// Volontairement laissés de côté (pas automatisables avec le format actuel
// numeric/qcm/text/multi + figures point/segment/droite/cercle) : la lecture
// d'un diagramme circulaire réel (pas de tracé d'arc/secteur disponible dans
// Figure — remplacé par des exercices textuels équivalents sur les
// pourcentages d'un diagramme), les questions ouvertes type "invente une
// question" ou "qu'en penses-tu" (ex. 39c, "explique l'écart" 38d), le
// problème de covoiturage à choix multiples de contraintes croisées (ex. 10,
// trop d'inconnues pour une correction fiable), et la lecture d'une courbe
// donnée sous forme d'image (remplacée par des tableaux de données
// équivalents fournis sous forme de texte, ex. température/taille).
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
const prenoms = ["Léa", "Noa", "Zoé", "Younes", "Louise", "Théo", "Gabin", "Inès", "Malo", "Fatou", "Adam", "Chloé"];

function pgcd(a, b) {
  let x = a, y = b;
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

// Construit une figure "diagramme en bâtons" avec le composant Figure
// (points + segments + freeLabels uniquement — pas d'arc/rectangle dédié).
function buildBarChartFigure(data) {
  const maxVal = Math.max(...data.map((d) => d.value));
  const scale = 70 / maxVal;
  const dxCat = 30;
  const points = [{ id: "O", x: -14, y: 0, hideDot: true, hideLabel: true }];
  const segments = [];
  const freeLabels = [];
  const lastX = data.length * dxCat + 4;
  points.push({ id: "AxisEnd", x: lastX, y: 0, hideDot: true, hideLabel: true });
  segments.push({ from: "O", to: "AxisEnd" });
  data.forEach((d, i) => {
    const x = 8 + i * dxCat;
    const bId = `b${i}`;
    const tId = `t${i}`;
    points.push({ id: bId, x, y: 0, hideDot: true, hideLabel: true });
    points.push({ id: tId, x, y: -d.value * scale, hideDot: true, hideLabel: true });
    segments.push({ from: bId, to: tId });
    freeLabels.push({ x, y: 14, text: d.label });
    freeLabels.push({ x, y: -d.value * scale - 6, text: String(d.value) });
  });
  return { points, segments, freeLabels };
}

// =========================== Mémo 1 : exploiter/présenter des données ===========================

// ---------- 1. Lire un diagramme en bâtons (valeur d'une catégorie) ----------
function genLireDiagrammeBatonsValeur() {
  const categories = shuffle(["Bus", "Vélo", "À pied", "Voiture", "Trottinette"]).slice(0, 4);
  const values = categories.map(() => randInt(2, 24));
  const figure = buildBarChartFigure(categories.map((label, i) => ({ label, value: values[i] })));
  const idx = randInt(0, categories.length - 1);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Diagramme en bâtons",
    prompt: `Ce diagramme en bâtons donne le mode de transport de plusieurs élèves pour venir au collège. Quel est l'effectif de la catégorie « ${categories[idx]} » ?`,
    answer: values[idx],
    figure,
    steps: [`Le bâton « ${categories[idx]} » atteint la hauteur ${values[idx]}.`],
  };
}

// ---------- 2. Lire un diagramme en bâtons (effectif total) ----------
function genLireDiagrammeBatonsTotal() {
  const categories = shuffle(["Pop", "Rock", "Rap", "Jazz", "Classique"]).slice(0, 4);
  const values = categories.map(() => randInt(2, 20));
  const figure = buildBarChartFigure(categories.map((label, i) => ({ label, value: values[i] })));
  const total = values.reduce((a, b) => a + b, 0);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Diagramme en bâtons",
    prompt: `Ce diagramme en bâtons donne le nombre de titres téléchargés par style musical dans une playlist. Quel est l'effectif total (nombre total de titres) ?`,
    answer: total,
    figure,
    steps: [`${values.join(" + ")} = ${total}`],
  };
}

// ---------- 3. Lire un diagramme en bâtons (catégorie extrême) ----------
function genLireDiagrammeBatonsCategorieExtreme() {
  const categories = shuffle(["Citron", "Orange", "Coca", "Menthe", "Fraise"]).slice(0, 4);
  let values;
  do {
    values = categories.map(() => randInt(2, 20));
  } while (new Set(values).size < values.length);
  const figure = buildBarChartFigure(categories.map((label, i) => ({ label, value: values[i] })));
  const askMax = Math.random() < 0.5;
  const target = askMax ? categories[values.indexOf(Math.max(...values))] : categories[values.indexOf(Math.min(...values))];
  const options = shuffle(categories);
  return {
    type: "qcm",
    chapter: "Organisation et gestion de données — Diagramme en bâtons",
    prompt: `Ce diagramme en bâtons donne le nombre de bonbons de chaque parfum dans un sachet. Quel est le parfum le ${askMax ? "plus" : "moins"} présent ?`,
    answer: target,
    options,
    steps: [`Effectifs : ${categories.map((c, i) => `${c} → ${values[i]}`).join(", ")}.`],
  };
}

// ---------- 4. Lire un tableau de données (valeur à un instant donné) ----------
function genLireTableauDonneesValeur() {
  const n = prenoms[randInt(0, prenoms.length - 1)];
  const ages = [0, 6, 12, 18, 24, 30, 36];
  let tailles = [randInt(48, 54)];
  for (let i = 1; i < ages.length; i++) tailles.push(tailles[i - 1] + randInt(3, 9));
  const idx = randInt(1, ages.length - 1);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Tableau de données",
    prompt: `Voici l'évolution de la taille de ${n} (en cm) selon son âge (en mois) : ${ages.map((a, i) => `${a} mois → ${tailles[i]} cm`).join(" ; ")}. Quelle était la taille de ${n} à ${ages[idx]} mois ?`,
    answer: tailles[idx],
    steps: [`On lit la valeur associée à ${ages[idx]} mois dans le tableau : ${tailles[idx]} cm.`],
  };
}

// ---------- 5. Compléter une cellule d'un tableau à double entrée ----------
function genCompleterTableauDoubleEntreeCellule() {
  const fillesDP = randInt(30, 90);
  const fillesExt = randInt(20, 80);
  const garconsDP = randInt(30, 90);
  const garconsExt = randInt(20, 80);
  const totalFilles = fillesDP + fillesExt;
  const totalGarcons = garconsDP + garconsExt;
  const totalDP = fillesDP + garconsDP;
  const totalExt = fillesExt + garconsExt;
  const total = totalFilles + totalGarcons;
  const cellules = [
    { label: "de filles au total", val: totalFilles },
    { label: "de garçons au total", val: totalGarcons },
    { label: "de demi-pensionnaires au total", val: totalDP },
    { label: "d'externes au total", val: totalExt },
    { label: "d'élèves au total dans ce collège", val: total },
  ];
  const c = pick(cellules);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Tableau à double entrée",
    prompt: `Dans un collège : ${fillesDP} filles sont demi-pensionnaires et ${fillesExt} filles sont externes ; ${garconsDP} garçons sont demi-pensionnaires et ${garconsExt} garçons sont externes. Combien y a-t-il ${c.label} ?`,
    answer: c.val,
    steps: [
      `Filles : ${fillesDP} + ${fillesExt} = ${totalFilles}. Garçons : ${garconsDP} + ${garconsExt} = ${totalGarcons}.`,
      `Demi-pensionnaires : ${fillesDP} + ${garconsDP} = ${totalDP}. Externes : ${fillesExt} + ${garconsExt} = ${totalExt}. Total : ${total}.`,
    ],
  };
}

// ---------- 6. Calculer un pourcentage à partir d'un tableau à double entrée ----------
function genPourcentageSousGroupeTableau() {
  const oui1 = randInt(60, 140);
  const non1 = randInt(60, 140);
  const total = oui1 + non1;
  const pct = roundTo((oui1 / total) * 100, 1);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Pourcentages et tableaux",
    prompt: `Dans une classe de ${total} élèves, ${oui1} élèves pratiquent un sport. Quel pourcentage d'élèves pratiquent un sport ? (arrondis à 1 décimale)`,
    answer: pct,
    tolerance: 0.15,
    steps: [`\\(\\dfrac{${oui1}}{${total}} \\times 100 \\approx ${fr(pct)}\\%\\)`],
  };
}

// =========================== Mémo 2 : comprendre la notion de probabilité ===========================

// ---------- 7. Classer un événement sur l'échelle de probabilité ----------
function genClasserEvenementProbabilite() {
  const cases = [
    { texte: "obtenir un nombre pair en lançant un dé équilibré à 6 faces", correct: "une chance sur deux" },
    { texte: "obtenir 7 en lançant un dé équilibré à 6 faces numérotées de 1 à 6", correct: "impossible" },
    { texte: "obtenir un nombre inférieur ou égal à 6 en lançant un dé équilibré à 6 faces", correct: "certain" },
    { texte: "obtenir le 6 en lançant un dé équilibré à 6 faces", correct: "peu probable" },
    { texte: "obtenir Pile en lançant une pièce équilibrée", correct: "une chance sur deux" },
    { texte: "obtenir une boule rouge dans un sac contenant 1 boule rouge et 99 boules bleues", correct: "peu probable" },
    { texte: "obtenir une boule rouge dans un sac contenant 99 boules rouges et 1 boule bleue", correct: "très probable" },
  ];
  const c = pick(cases);
  const options = shuffle(["impossible", "peu probable", "une chance sur deux", "très probable", "certain"]);
  return {
    type: "qcm",
    chapter: "Organisation et gestion de données — Échelle de probabilité",
    prompt: `Comment qualifier l'événement suivant : « ${c.texte} » ?`,
    answer: c.correct,
    options,
    steps: [`On compare le nombre de cas favorables au nombre de cas possibles.`],
  };
}

// ---------- 8. Convertir "une chance sur X" en valeur décimale ----------
function genConvertirChanceSurXValeur() {
  const x = pick([2, 4, 5, 8, 10, 20, 25, 50]);
  const dec = roundTo(1 / x, 3);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Échelle de probabilité",
    prompt: `On dit qu'un événement a « une chance sur ${x} » de se réaliser. Quelle est sa probabilité, sous forme décimale ?`,
    answer: dec,
    tolerance: 0.002,
    steps: [`\\(\\dfrac{1}{${x}} = ${fr(dec)}\\)`],
  };
}

// ---------- 9. Compter le nombre d'issues d'une expérience aléatoire ----------
function genNombreIssuesExperience() {
  const cases = [
    { texte: "On lance un dé équilibré à 6 faces numérotées de 1 à 6.", n: 6 },
    { texte: "On lance une pièce de monnaie équilibrée.", n: 2 },
    { texte: "On tire une carte au hasard dans un jeu de 32 cartes.", n: 32 },
    { texte: "On lance un dé équilibré à 12 faces numérotées de 1 à 12.", n: 12 },
    { texte: "On tire une boule au hasard dans un sac contenant 3 boules rouges, 2 boules bleues et 1 boule verte (chaque boule est une issue possible différente si on distingue les couleurs).", n: 3 },
  ];
  const c = pick(cases);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Expérience aléatoire",
    prompt: `${c.texte} Combien y a-t-il d'issues possibles différentes (couleurs ou valeurs distinctes) ?`,
    answer: c.n,
    steps: [`On compte le nombre de résultats différents possibles : ${c.n}.`],
  };
}

// ---------- 10. Sélectionner les issues qui réalisent un événement (dé) ----------
function genIssuesRealisantEvenementDe() {
  const faces = pick([6, 8, 10, 12]);
  const eventTypes = [
    { texte: "obtenir un nombre pair", test: (v) => v % 2 === 0 },
    { texte: "obtenir un nombre impair", test: (v) => v % 2 === 1 },
    { texte: "obtenir un multiple de 3", test: (v) => v % 3 === 0 },
    { texte: "obtenir un nombre supérieur ou égal à " + Math.ceil(faces / 2), test: (v) => v >= Math.ceil(faces / 2) },
  ];
  const ev = pick(eventTypes);
  const options = Array.from({ length: faces }, (_, i) => String(i + 1));
  const answer = options.map((_, i) => i + 1).filter((v) => ev.test(v)).map((v) => v - 1);
  return {
    type: "multi",
    chapter: "Organisation et gestion de données — Issues d'un événement",
    prompt: `On lance un dé équilibré à ${faces} faces numérotées de 1 à ${faces}. Sélectionne toutes les issues qui réalisent l'événement « ${ev.texte} ».`,
    answer,
    options,
    steps: [`On regarde chaque face de 1 à ${faces} et on garde celles qui vérifient « ${ev.texte} ».`],
  };
}

// =========================== Mémo 3 : calculer une probabilité ===========================

// ---------- 11. Probabilité de tirer une couleur dans une urne ----------
function genProbabiliteUrneCouleur() {
  const rouge = randInt(2, 15);
  const bleu = randInt(2, 15);
  const vert = Math.random() < 0.5 ? randInt(1, 10) : 0;
  const total = rouge + bleu + vert;
  const couleurs = vert > 0 ? [["rouge", rouge], ["bleu", bleu], ["vert", vert]] : [["rouge", rouge], ["bleu", bleu]];
  const [couleur, effectif] = pick(couleurs);
  const p = roundTo(effectif / total, 3);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Probabilité (urne)",
    prompt: `Un sac contient ${couleurs.map(([c, n]) => `${n} boules ${c}s`).join(", ")}. On tire une boule au hasard. Quelle est la probabilité, sous forme décimale, d'obtenir une boule ${couleur} ? (arrondis à 3 décimales si besoin)`,
    answer: p,
    tolerance: 0.003,
    steps: [`\\(P(${couleur}) = \\dfrac{${effectif}}{${total}} \\approx ${fr(p)}\\)`],
  };
}

// ---------- 12. Probabilité dans un jeu de 32 cartes ----------
function genProbabiliteCarteJeu32() {
  const cases = [
    { texte: "un cœur", favorable: 8 },
    { texte: "une carte rouge (cœur ou carreau)", favorable: 16 },
    { texte: "un roi", favorable: 4 },
    { texte: "une figure (Roi, Dame ou Valet)", favorable: 12 },
    { texte: "un nombre (As compris, de 7 à As)", favorable: 32 },
    { texte: "un pique", favorable: 8 },
  ];
  const c = pick(cases);
  const p = roundTo(c.favorable / 32, 3);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Probabilité (jeu de cartes)",
    prompt: `On tire une carte au hasard dans un jeu de 32 cartes (4 catégories : cœur, carreau, pique, trèfle ; dans chaque catégorie : As, Roi, Dame, Valet, 10, 9, 8 et 7). Quelle est la probabilité, sous forme décimale, d'obtenir ${c.texte} ?`,
    answer: p,
    tolerance: 0.003,
    steps: [`\\(P = \\dfrac{${c.favorable}}{32} \\approx ${fr(p)}\\)`],
  };
}

// ---------- 13. Calculer une fréquence à partir d'effectifs ----------
function genFrequenceExperienceEffectifs() {
  const couleurs = ["rouge", "vert", "bleu"];
  const effectifs = couleurs.map(() => randInt(50, 300));
  const total = effectifs.reduce((a, b) => a + b, 0);
  const idx = randInt(0, couleurs.length - 1);
  const freq = roundTo(effectifs[idx] / total, 3);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Fréquence",
    prompt: `On a tiré une boule dans un sac et noté sa couleur, en la remettant à chaque fois, ${total} fois au total. On a obtenu : ${couleurs.map((c, i) => `${effectifs[i]} fois ${c}`).join(", ")}. Quelle est la fréquence d'apparition de la couleur ${couleurs[idx]} (sous forme décimale, arrondie à 3 décimales) ?`,
    answer: freq,
    tolerance: 0.003,
    steps: [`\\(\\dfrac{${effectifs[idx]}}{${total}} \\approx ${fr(freq)}\\)`],
  };
}

// ---------- 14. Compléter un effectif manquant (pile / face) ----------
function genCompleterEffectifPileFaceTotal() {
  const total = randInt(50, 2000);
  const pile = randInt(Math.round(total * 0.3), Math.round(total * 0.7));
  const face = total - pile;
  const askFace = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Tableau d'expérience",
    prompt: `On lance ${total} fois une pièce et on obtient Pile ${pile} fois. Combien de fois a-t-on obtenu ${askFace ? "Face" : "Pile"} ?`,
    answer: askFace ? face : pile,
    steps: [`Total = Pile + Face, donc Face = ${total} - ${pile} = ${face}.`],
  };
}

// ---------- 15. Probabilité de l'événement contraire ----------
function genProbabiliteComplementaire() {
  const dens = [4, 5, 8, 10, 20, 25, 50];
  const den = pick(dens);
  const num = randInt(1, den - 1);
  const p = roundTo(num / den, 3);
  const complement = roundTo(1 - p, 3);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Événement contraire",
    prompt: `La probabilité qu'un événement A se réalise est \\(P(A) = ${frTex(p)}\\). Quelle est la probabilité que A ne se réalise pas ?`,
    answer: complement,
    tolerance: 0.003,
    steps: [`\\(1 - ${fr(p)} = ${fr(complement)}\\)`],
  };
}

// ---------- 16. Probabilité sur une roue de loterie ----------
function genProbabiliteRoueLoterieSecteurs() {
  const nSecteurs = pick([6, 8, 10, 12]);
  const couleurs = ["bleu", "vert", "jaune", "orange"];
  let reste = nSecteurs;
  const repartition = [];
  for (let i = 0; i < couleurs.length - 1; i++) {
    const maxPossible = reste - (couleurs.length - 1 - i);
    if (maxPossible < 1) break;
    const v = randInt(1, Math.min(maxPossible, Math.ceil(nSecteurs / 2)));
    repartition.push(v);
    reste -= v;
  }
  repartition.push(reste);
  const idx = randInt(0, repartition.length - 1);
  const p = roundTo(repartition[idx] / nSecteurs, 3);
  const usedColors = couleurs.slice(0, repartition.length);
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Roue de loterie",
    prompt: `Une roue de loterie est partagée en ${nSecteurs} secteurs identiques : ${usedColors.map((c, i) => `${repartition[i]} ${c}(s)`).join(", ")}. On fait tourner la roue. Quelle est la probabilité, sous forme décimale, d'obtenir un secteur ${usedColors[idx]} ?`,
    answer: p,
    tolerance: 0.003,
    steps: [`\\(P = \\dfrac{${repartition[idx]}}{${nSecteurs}} \\approx ${fr(p)}\\)`],
  };
}

// ---------- 17. Comparer deux probabilités (galette et fève) ----------
function genProbabiliteFeveGalette() {
  const parts1 = pick([6, 8, 10, 12]);
  let parts2 = pick([6, 8, 10, 12]);
  while (parts2 === parts1) parts2 = pick([6, 8, 10, 12]);
  const p1 = 1 / parts1;
  const p2 = 1 / parts2;
  const meilleure = p1 > p2 ? `la galette coupée en ${parts1} parts` : `la galette coupée en ${parts2} parts`;
  const options = shuffle([`la galette coupée en ${parts1} parts`, `la galette coupée en ${parts2} parts`, "les deux se valent"]);
  return {
    type: "qcm",
    chapter: "Organisation et gestion de données — Comparer des probabilités",
    prompt: `On a confectionné deux galettes, chacune avec une seule fève. La première est coupée en ${parts1} parts égales, la deuxième en ${parts2} parts égales. Dans quelle galette a-t-on le plus de chances d'obtenir la fève en prenant une part au hasard ?`,
    answer: meilleure,
    options,
    steps: [`\\(\\dfrac{1}{${parts1}} ${p1 > p2 ? ">" : "<"} \\dfrac{1}{${parts2}}\\) : moins de parts égales donne une plus grande probabilité.`],
  };
}

// ---------- 18. Égaliser deux probabilités en retirant des boules ----------
function genEgaliserProbabiliteRetraitBoules() {
  const den = pick([3, 4, 5]);
  const num = randInt(1, den - 1);
  const g = pgcd(num, den);
  const a = num / g;
  const b = den / g;
  const m2 = randInt(2, 6);
  const rouge2 = a * m2;
  const bleu2 = (b - a) * m2;
  const x = randInt(1, 4);
  const k = randInt(1, 5);
  const rougeApres = a * k;
  const bleu1 = (b - a) * k;
  const rouge1 = rougeApres + x;
  return {
    type: "numeric",
    chapter: "Organisation et gestion de données — Égaliser des probabilités",
    prompt: `On mélange des stylos rouges et bleus dans deux boîtes. Boîte 1 : ${rouge1} stylos rouges et ${bleu1} stylos bleus. Boîte 2 : ${rouge2} stylos rouges et ${bleu2} stylos bleus. On veut avoir la même probabilité de tirer un stylo rouge dans chaque boîte. Combien de stylos rouges faut-il retirer de la boîte 1 (sans rien retirer d'autre) ?`,
    answer: x,
    steps: [
      `Dans la boîte 2 : \\(P = \\dfrac{${rouge2}}{${rouge2 + bleu2}} = \\dfrac{${a}}{${b}}\\).`,
      `Dans la boîte 1, il faut qu'il reste ${rougeApres} stylos rouges pour ${bleu1} bleus (même probabilité \\(\\dfrac{${a}}{${b}}\\)). Comme il y en a ${rouge1} au départ, il faut en retirer ${rouge1} - ${rougeApres} = ${x}.`,
    ],
  };
}

const GENERATORS = [
  genLireDiagrammeBatonsValeur,
  genLireDiagrammeBatonsTotal,
  genLireDiagrammeBatonsCategorieExtreme,
  genLireTableauDonneesValeur,
  genCompleterTableauDoubleEntreeCellule,
  genPourcentageSousGroupeTableau,
  genClasserEvenementProbabilite,
  genConvertirChanceSurXValeur,
  genNombreIssuesExperience,
  genIssuesRealisantEvenementDe,
  genProbabiliteUrneCouleur,
  genProbabiliteCarteJeu32,
  genFrequenceExperienceEffectifs,
  genCompleterEffectifPileFaceTotal,
  genProbabiliteComplementaire,
  genProbabiliteRoueLoterieSecteurs,
  genProbabiliteFeveGalette,
  genEgaliserProbabiliteRetraitBoules,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "organisation-gestion-donnees",
    title: "Organisation et gestion de données",
    description: "Lire et exploiter des tableaux et diagrammes, comprendre et calculer des probabilités.",
    level: "sixieme",
    free: false,
    order: 9,
  },
  generate,
};
