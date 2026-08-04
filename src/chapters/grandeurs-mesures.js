// ---------------------------------------------------------------------------
// Chapitre : Grandeurs et mesures (6e) — sous abonnement.
//
// Reprend la tâche intellectuelle des exercices fournis (Mémo 1 "périmètre
// d'une figure", Mémo 2 "aire d'une figure", Mémo 3 "unités de longueur",
// Mémo 4 "unités d'aire", Mémo 5 "unité de volume", la partie "manipuler les
// horaires, les durées", et une sélection de problèmes), avec des nombres,
// prénoms et contextes différents à chaque génération.
//
// Volontairement laissés de côté (pas automatisables avec le format actuel
// numeric/qcm/text/multi + figures point/segment/droite/cercle) : le comptage
// de cubes sur un dessin en perspective (Mémo 5, ex. 49-54), le tracé de
// figures à main levée ou aux instruments (ex. 12, 13, 34, 36), le placement
// des aiguilles d'une horloge (ex. 56, tâche de construction), et les
// problèmes à reproduction/justification graphique (ex. 88, 90, 91).
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

// Affichage français : virgule décimale. `fr` pour le texte normal, `frTex`
// pour l'intérieur d'un bloc LaTeX \( ... \) (accolades autour de la virgule
// pour éviter l'espacement supplémentaire que KaTeX ajoute après une virgule).
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");

function shuffleStatements(items) {
  const order = shuffle(items.map((_, i) => i));
  const options = order.map((i) => items[i].text);
  const answer = order.map((i, newIndex) => (items[i].correct ? newIndex : null)).filter((v) => v !== null);
  return { options, answer };
}

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

// =========================== Mémo 1-2 : périmètre et aire ===========================

// ---------- 1. Périmètre et aire d'un rectangle / carré ----------
function genRectangleGrandeurs() {
  const isCarre = Math.random() < 0.3;
  const L = randInt(3, 20);
  const l = isCarre ? L : randInt(2, 18);
  const perim = 2 * (L + l);
  const aire = L * l;
  const askAire = Math.random() < 0.5;
  const A = { id: "A", x: 20, y: 20 };
  const B = { id: "B", x: 20 + L * 10, y: 20 };
  const C = { id: "C", x: 20 + L * 10, y: 20 + l * 10 };
  const D = { id: "D", x: 20, y: 20 + l * 10 };
  const figure = {
    points: [A, B, C, D],
    segments: [
      { from: "A", to: "B", ticks: 1 },
      { from: "D", to: "C", ticks: 1 },
      { from: "A", to: "D", ticks: 2 },
      { from: "B", to: "C", ticks: 2 },
    ],
    rightAngles: [
      { at: "A", from: "D", to: "B" },
      { at: "B", from: "A", to: "C" },
      { at: "C", from: "B", to: "D" },
      { at: "D", from: "C", to: "A" },
    ],
    freeLabels: [
      { x: (A.x + B.x) / 2, y: A.y - 8, text: `${L} cm` },
      { x: A.x - 18, y: (A.y + D.y) / 2, text: `${l} cm` },
    ],
  };
  const shapeName = isCarre ? "carré" : "rectangle";
  if (askAire) {
    return {
      type: "numeric",
      chapter: "Grandeurs et mesures — Périmètre et aire",
      prompt: `Calcule l'aire de ce ${shapeName}, en cm².`,
      figure,
      answer: aire,
      steps: [
        { type: "regle", text: `Aire = longueur × largeur` },
        { type: "calcul", text: `${L} \\times ${l} = ${aire}` },
      ],
    };
  }
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Périmètre et aire",
    prompt: `Calcule le périmètre de ce ${shapeName}, en cm.`,
    figure,
    answer: perim,
    steps: [
      { type: "regle", text: `Périmètre = 2 × (longueur + largeur)` },
      { type: "calcul", text: `2 \\times (${L} + ${l}) = ${perim}` },
    ],
  };
}

// ---------- 2. Périmètre d'un cercle ----------
function genPerimetreCercle() {
  const r = randInt(2, 20);
  const D = 2 * r;
  const answer = roundTo(Math.PI * D, 2);
  const givenDiametre = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Périmètre d'un cercle",
    prompt: givenDiametre
      ? `Un cercle a un diamètre de ${D} cm. Quel est son périmètre, arrondi au centième ?`
      : `Un cercle a un rayon de ${r} cm. Quel est son périmètre, arrondi au centième ?`,
    answer,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `\\pi \\times ${D} \\approx ${answer}` }],
  };
}

// ---------- 3. Périmètre d'une portion de cercle ----------
function genPerimetreDemiCercle() {
  const r = randInt(2, 15);
  const D = 2 * r;
  const answer = roundTo(Math.PI * r + D, 2);
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Périmètre d'une portion de cercle",
    prompt: `Un demi-disque a un rayon de ${r} cm. Quel est le périmètre de ce demi-disque (demi-cercle + diamètre), arrondi au centième ?`,
    answer,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `\\pi \\times ${r} + ${D} \\approx ${answer}` }],
  };
}

// ---------- 4. Figure composée de deux rectangles (aire ou périmètre) ----------
function genFigureComposeeRectangles() {
  const W = randInt(8, 20);
  const H = randInt(6, 16);
  const w2 = randInt(2, W - 2);
  const h = randInt(2, H - 2);
  const scale = 8;
  const A = { id: "A", x: 20, y: 20 };
  const B = { id: "B", x: 20 + W * scale, y: 20 };
  const C = { id: "C", x: 20 + W * scale, y: 20 + h * scale };
  const D = { id: "D", x: 20 + w2 * scale, y: 20 + h * scale };
  const E = { id: "E", x: 20 + w2 * scale, y: 20 + H * scale };
  const F = { id: "F", x: 20, y: 20 + H * scale };
  const sideAB = W;
  const sideBC = h;
  const sideCD = W - w2;
  const sideDE = H - h;
  const sideEF = w2;
  const sideFA = H;
  const perimetre = sideAB + sideBC + sideCD + sideDE + sideEF + sideFA;
  const aire = W * h + w2 * (H - h);
  const figure = {
    points: [A, B, C, D, E, F],
    segments: [
      { from: "A", to: "B" },
      { from: "B", to: "C" },
      { from: "C", to: "D" },
      { from: "D", to: "E" },
      { from: "E", to: "F" },
      { from: "F", to: "A" },
    ],
    hidePointLabels: true,
    freeLabels: [
      { x: (A.x + B.x) / 2, y: A.y - 8, text: `${sideAB} cm` },
      { x: B.x + 16, y: (B.y + C.y) / 2, text: `${sideBC} cm` },
      { x: (C.x + D.x) / 2, y: C.y + 12, text: `${sideCD} cm` },
      { x: D.x - 18, y: (D.y + E.y) / 2, text: `${sideDE} cm` },
      { x: (E.x + F.x) / 2, y: E.y + 12, text: `${sideEF} cm` },
      { x: F.x - 18, y: (F.y + A.y) / 2, text: `${sideFA} cm` },
    ],
  };
  const askAire = Math.random() < 0.5;
  if (askAire) {
    return {
      type: "numeric",
      chapter: "Grandeurs et mesures — Figure complexe",
      prompt: `Calcule l'aire de cette figure (toutes les longueurs sont en cm), en cm².`,
      figure,
      answer: aire,
      steps: [{ type: "calcul", text: `Aire = ${W} \\times ${h} + ${w2} \\times ${H - h} = ${aire}` }],
    };
  }
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Figure complexe",
    prompt: `Calcule le périmètre de cette figure (toutes les longueurs sont en cm).`,
    figure,
    answer: perimetre,
    steps: [{ type: "calcul", text: `${sideAB} + ${sideBC} + ${sideCD} + ${sideDE} + ${sideEF} + ${sideFA} = ${perimetre}` }],
  };
}

// ---------- 5. Volume d'un pavé droit ----------
function genVolumePave() {
  const L = randInt(2, 15);
  const l = randInt(2, 12);
  const h = randInt(2, 10);
  const answer = L * l * h;
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Volume",
    prompt: `Un pavé droit a pour dimensions ${L} cm × ${l} cm × ${h} cm. Quel est son volume, en cm³ ?`,
    answer,
    steps: [{ type: "calcul", text: `${L} \\times ${l} \\times ${h} = ${answer}` }],
  };
}

// =========================== Mémo 3-4 : unités de longueur et d'aire ===========================

// ---------- 6. Convertir des unités de longueur ----------
const UNITES_LONGUEUR = ["km", "hm", "dam", "m", "dm", "cm", "mm"];
function genConvertirUnitesLongueur() {
  const i = randInt(0, UNITES_LONGUEUR.length - 2);
  const j = randInt(i + 1, UNITES_LONGUEUR.length - 1);
  const facteur = 10 ** (j - i);
  const value = randDecimal(0.5, 90, pick([0, 1, 2]));
  const result = roundTo(value * facteur, 6);
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Unités de longueur",
    prompt: `Convertis ${fr(value)} ${UNITES_LONGUEUR[i]} en ${UNITES_LONGUEUR[j]}.`,
    answer: result,
    steps: [{ type: "regle", text: `1 ${UNITES_LONGUEUR[i]} = ${facteur} ${UNITES_LONGUEUR[j]}` }],
  };
}

// ---------- 7. Convertir des unités d'aire ----------
const UNITES_AIRE = ["km2", "hm2", "dam2", "m2", "dm2", "cm2", "mm2"];
const UNITES_AIRE_LABEL = { km2: "km²", hm2: "hm²", dam2: "dam²", m2: "m²", dm2: "dm²", cm2: "cm²", mm2: "mm²" };
function genConvertirUnitesAire() {
  const i = randInt(0, UNITES_AIRE.length - 2);
  const j = randInt(i + 1, Math.min(UNITES_AIRE.length - 1, i + 3));
  const facteur = 100 ** (j - i);
  const value = randDecimal(0.5, 90, pick([0, 1, 2]));
  const result = roundTo(value * facteur, 6);
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Unités d'aire",
    prompt: `Convertis ${fr(value)} ${UNITES_AIRE_LABEL[UNITES_AIRE[i]]} en ${UNITES_AIRE_LABEL[UNITES_AIRE[j]]}.`,
    answer: result,
    steps: [{ type: "regle", text: `1 ${UNITES_AIRE_LABEL[UNITES_AIRE[i]]} = ${facteur} ${UNITES_AIRE_LABEL[UNITES_AIRE[j]]}` }],
  };
}

// ---------- 8. Comparer des aires ----------
const AIRE_FACTEURS = { mm2: 1, cm2: 100, dm2: 10000, m2: 1000000, dam2: 100000000, hm2: 10000000000 };
function randomAireExpr() {
  const unit = pick(["cm2", "dm2", "m2", "dam2", "hm2"]);
  const value = randInt(1, 500);
  const label = UNITES_AIRE_LABEL[unit];
  return { text: `${value} ${label}`, base: value * AIRE_FACTEURS[unit] };
}
function genComparerAiresQCM() {
  let e1, e2;
  do {
    e1 = randomAireExpr();
    e2 = randomAireExpr();
  } while (e1.base === e2.base);
  const correct = e1.base > e2.base ? e1.text : e2.text;
  return {
    type: "qcm",
    chapter: "Grandeurs et mesures — Comparer des aires",
    prompt: `Quelle est l'aire la plus grande ?`,
    answer: correct,
    options: [e1.text, e2.text],
    steps: [{ type: "calcul", text: `${e1.text} = ${e1.base} mm² ; ${e2.text} = ${e2.base} mm²` }],
  };
}

// =========================== Horaires et durées ===========================

// ---------- 9. Lire l'heure sur une horloge ----------
function buildClockFigure(heureAffichee, minute) {
  const R = 55;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const minuteAngleDeg = (minute / 60) * 360 - 90;
  const hourAngleDeg = (((heureAffichee % 12) + minute / 60) / 12) * 360 - 90;
  const minuteLen = R * 0.85;
  const hourLen = R * 0.55;
  const C = { id: "C", x: 0, y: 0, hideDot: true, hideLabel: true };
  const M = { id: "M", x: minuteLen * Math.cos(toRad(minuteAngleDeg)), y: minuteLen * Math.sin(toRad(minuteAngleDeg)), hideDot: true, hideLabel: true };
  const H = { id: "H", x: hourLen * Math.cos(toRad(hourAngleDeg)), y: hourLen * Math.sin(toRad(hourAngleDeg)), hideDot: true, hideLabel: true };
  const markLabel = (num, angleDeg) => ({ x: (R + 12) * Math.cos(toRad(angleDeg)), y: (R + 12) * Math.sin(toRad(angleDeg)) + 3, text: String(num) });
  return {
    points: [C, M, H],
    circles: [{ center: "C", radius: R }],
    segments: [{ from: "C", to: "M" }, { from: "C", to: "H" }],
    freeLabels: [markLabel(12, -90), markLabel(3, 0), markLabel(6, 90), markLabel(9, 180)],
  };
}
function genLireHeureHorloge() {
  const heureAffichee = randInt(1, 12);
  const minute = randInt(0, 11) * 5;
  const hStr = String(heureAffichee);
  const mStr = String(minute).padStart(2, "0");
  const accepted = minute === 0 ? [`${hStr}h`, `${hStr}h00`, `${hStr}:00`, `${hStr}h 00`] : [`${hStr}h${mStr}`, `${hStr}h ${mStr}`, `${hStr}:${mStr}`];
  return {
    type: "text",
    chapter: "Grandeurs et mesures — Horaires",
    prompt: `Quelle heure indique cette horloge ? (réponds au format 4h15)`,
    figure: buildClockFigure(heureAffichee, minute),
    answer: accepted,
    steps: [{ type: "donnee", text: `La petite aiguille est entre ${heureAffichee} et ${heureAffichee === 12 ? 1 : heureAffichee + 1}, la grande aiguille indique ${minute} minutes.` }],
  };
}

// ---------- 10. Convertir des durées : minutes / heures ----------
function genConvertirDureeMinutesHeures() {
  const mins = randInt(65, 500);
  const askHeures = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Durées",
    prompt: askHeures ? `${mins} min = ? h (partie entière)` : `${mins} min : combien de minutes restantes après les heures entières (le reste) ?`,
    answer: askHeures ? Math.floor(mins / 60) : mins % 60,
    steps: [{ type: "calcul", text: `${mins} = 60 \\times ${Math.floor(mins / 60)} + ${mins % 60}` }],
  };
}

// ---------- 11. Convertir des durées : jours / heures ----------
function genConvertirDureeJoursHeures() {
  const type = pick(["versJours", "versHeures"]);
  if (type === "versJours") {
    const heures = randInt(25, 400);
    const askJours = Math.random() < 0.5;
    return {
      type: "numeric",
      chapter: "Grandeurs et mesures — Durées",
      prompt: askJours ? `${heures} h = ? jours (partie entière)` : `${heures} h : combien d'heures restantes après les jours entiers ?`,
      answer: askJours ? Math.floor(heures / 24) : heures % 24,
      steps: [{ type: "calcul", text: `${heures} = 24 \\times ${Math.floor(heures / 24)} + ${heures % 24}` }],
    };
  }
  const jours = randInt(1, 10);
  const heuresReste = randInt(0, 23);
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Durées",
    prompt: `${jours} jours ${heuresReste} h = ? heures au total`,
    answer: jours * 24 + heuresReste,
    steps: [{ type: "calcul", text: `${jours} \\times 24 + ${heuresReste} = ${jours * 24 + heuresReste}` }],
  };
}

// ---------- 12. Convertir une durée sexagésimale / décimale (les deux sens) ----------
function genConvertirDureeSexagesimaleDecimale() {
  const forward = Math.random() < 0.5;
  if (forward) {
    const m = randInt(1, 9) * 6;
    const answer = roundTo(m / 60, 2);
    return {
      type: "numeric",
      chapter: "Grandeurs et mesures — Durées",
      prompt: `${m} min = ? h (écriture décimale)`,
      answer,
      steps: [{ type: "calcul", text: `${m} \\div 60 = ${fr(answer)}` }],
    };
  }
  const dixieme = randInt(1, 9);
  const heureDecimale = roundTo(dixieme / 10, 1);
  const answer = dixieme * 6;
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Durées",
    prompt: `${fr(heureDecimale)} h = ? min`,
    answer,
    steps: [{ type: "calcul", text: `${fr(heureDecimale)} \\times 60 = ${answer}` }],
  };
}

// ---------- 13. Comparer des durées ----------
const DUREE_UNITES = { minute: 60, heure: 3600, jour: 86400, mois: 2592000, an: 31536000, siecle: 3153600000 };
function randomDureeExpr() {
  const unit = pick(["minute", "heure", "jour", "mois", "an", "siecle"]);
  const value = randInt(1, unit === "siecle" ? 5 : unit === "an" ? 400 : 60);
  return { text: `${value} ${unit}${value > 1 ? "s" : ""}`, seconds: value * DUREE_UNITES[unit] };
}
function genComparerDureesQCM() {
  let d1, d2;
  do {
    d1 = randomDureeExpr();
    d2 = randomDureeExpr();
  } while (d1.seconds === d2.seconds);
  const correct = d1.seconds > d2.seconds ? d1.text : d2.text;
  return {
    type: "qcm",
    chapter: "Grandeurs et mesures — Comparer des durées",
    prompt: `Quelle est la durée la plus grande ?`,
    answer: correct,
    options: [d1.text, d2.text],
    steps: [{ type: "calcul", text: `${d1.text} = ${d1.seconds} s ; ${d2.text} = ${d2.seconds} s` }],
  };
}

// =========================== Problèmes ===========================

// ---------- 14. Durée hebdomadaire de travail ----------
function genProblemeDureeHebdomadaireTravail() {
  const joursTravailles = randInt(3, 5);
  const matinH = randInt(7, 9);
  const matinM = pick([0, 15, 30, 45]);
  const finMatinH = matinH + randInt(2, 4);
  const apresMidiH = finMatinH + randInt(1, 2);
  const finJourneeH = apresMidiH + randInt(2, 4);
  const dureeMatin = finMatinH * 60 + matinM - (matinH * 60 + matinM);
  const dureeApresMidi = finJourneeH * 60 + matinM - (apresMidiH * 60 + matinM);
  const dureeJournaliere = dureeMatin + dureeApresMidi;
  const totalMinutes = dureeJournaliere * joursTravailles;
  const totalHeures = roundTo(totalMinutes / 60, 2);
  const prenom = pick(prenoms);
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Problèmes",
    prompt: `${prenom} travaille ${joursTravailles} jours par semaine, de ${matinH} h ${String(matinM).padStart(2, "0")} à ${finMatinH} h ${String(matinM).padStart(2, "0")} et de ${apresMidiH} h ${String(matinM).padStart(2, "0")} à ${finJourneeH} h ${String(matinM).padStart(2, "0")}. Quelle est sa durée de travail hebdomadaire totale, en heures ?`,
    answer: totalHeures,
    tolerance: 0.02,
    steps: [
      { type: "calcul", text: `Durée par jour : ${dureeJournaliere} min` },
      { type: "calcul", text: `${dureeJournaliere} \\times ${joursTravailles} = ${totalMinutes} min = ${fr(totalHeures)} h` },
    ],
  };
}

// ---------- 15. Heure d'arrivée ----------
function genProblemeHeureArriveeTexte() {
  const depH = randInt(6, 20);
  const depM = pick([0, 10, 15, 20, 30, 40, 45, 50]);
  const dureeMin = randInt(15, 180);
  const totalMin = depH * 60 + depM + dureeMin;
  const arrH = Math.floor(totalMin / 60) % 24;
  const arrM = totalMin % 60;
  const prenom = pick(prenoms);
  const pronom = prenom.endsWith("e") ? "elle" : "il";
  const accepted =
    arrM === 0
      ? [`${arrH}h`, `${arrH}h00`, `${arrH}:00`]
      : [`${arrH}h${String(arrM).padStart(2, "0")}`, `${arrH}h ${String(arrM).padStart(2, "0")}`, `${arrH}:${String(arrM).padStart(2, "0")}`];
  return {
    type: "text",
    chapter: "Grandeurs et mesures — Problèmes",
    prompt: `${prenom} part à ${depH} h ${String(depM).padStart(2, "0")}. Son trajet dure ${dureeMin} minutes. À quelle heure arrive-t-${pronom} ? (réponds au format 14h30)`,
    answer: accepted,
    steps: [{ type: "calcul", text: `${depH * 60 + depM} + ${dureeMin} = ${totalMin} min → ${arrH} h ${String(arrM).padStart(2, "0")}` }],
  };
}

// ---------- 16. Durée entre deux heures ----------
function genProblemeDureeEntreDeuxHeures() {
  const h1 = randInt(6, 18);
  const m1 = pick([0, 10, 15, 20, 30, 40, 45, 50]);
  const dureeMin = randInt(20, 240);
  const totalMin = h1 * 60 + m1 + dureeMin;
  const h2 = Math.floor(totalMin / 60) % 24;
  const m2 = totalMin % 60;
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Problèmes",
    prompt: `Un trajet commence à ${h1} h ${String(m1).padStart(2, "0")} et se termine à ${h2} h ${String(m2).padStart(2, "0")}. Quelle est la durée du trajet, en minutes ?`,
    answer: dureeMin,
    steps: [{ type: "calcul", text: `${h2 * 60 + m2} - ${h1 * 60 + m1} = ${dureeMin}` }],
  };
}

// ---------- 17. Prix du grillage (périmètre) ----------
function genProblemeGrillagePerimetre() {
  const L = randInt(10, 60);
  const l = randInt(5, 40);
  const perim = 2 * (L + l);
  const prixMetre = randDecimal(2, 8, 2);
  const total = roundTo(perim * prixMetre, 2);
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Problèmes",
    prompt: `Un terrain rectangulaire mesure ${L} m sur ${l} m. Le grillage coûte ${fr(prixMetre)} € le mètre. Quel est le prix du grillage nécessaire pour clôturer ce terrain, en € ?`,
    answer: total,
    steps: [
      { type: "calcul", text: `Périmètre : 2 \\times (${L} + ${l}) = ${perim}` },
      { type: "calcul", text: `${perim} \\times ${fr(prixMetre)} = ${fr(total)}` },
    ],
  };
}

// ---------- 18. Prix de la moquette (aire) ----------
function genProblemeMoquetteAire() {
  const L = randInt(3, 15);
  const l = randInt(2, 10);
  const aire = L * l;
  const prixM2 = randDecimal(5, 30, 2);
  const total = roundTo(aire * prixM2, 2);
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Problèmes",
    prompt: `Une salle rectangulaire mesure ${L} m sur ${l} m. La moquette coûte ${fr(prixM2)} € le m². Quel est le prix total de la moquette nécessaire, en € ?`,
    answer: total,
    steps: [
      { type: "calcul", text: `Aire : ${L} \\times ${l} = ${aire}` },
      { type: "calcul", text: `${aire} \\times ${fr(prixM2)} = ${fr(total)}` },
    ],
  };
}

// ---------- 19. Comparer deux surfaces ----------
function genProblemeComparaisonSurfaces() {
  const L1 = randInt(5, 30);
  const l1 = randInt(3, 20);
  const L2 = randInt(5, 30);
  const l2 = randInt(3, 20);
  const aire1 = L1 * l1;
  const aire2 = L2 * l2;
  const optA = `Le terrain 1 (${L1} m × ${l1} m)`;
  const optB = `Le terrain 2 (${L2} m × ${l2} m)`;
  const optEq = "Les deux terrains ont la même aire";
  const correct = aire1 > aire2 ? optA : aire2 > aire1 ? optB : optEq;
  return {
    type: "qcm",
    chapter: "Grandeurs et mesures — Problèmes",
    prompt: `Quel terrain a la plus grande aire ?`,
    answer: correct,
    options: [optA, optB, optEq],
    steps: [{ type: "calcul", text: `Terrain 1 : ${aire1} m² ; Terrain 2 : ${aire2} m²` }],
  };
}

// ---------- 20. Fréquence sur une durée ----------
function genProblemeFrequenceTotal() {
  const freq = randInt(50, 90);
  const jours = pick([30, 90, 180, 365]);
  const total = freq * 60 * 24 * jours;
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Problèmes",
    prompt: `Un cœur bat environ ${freq} fois par minute. Combien de fois bat-il (environ) en ${jours} jours ?`,
    answer: total,
    steps: [{ type: "calcul", text: `${freq} \\times 60 \\times 24 \\times ${jours} = ${total}` }],
  };
}

// ---------- 21. Somme de distances (triathlon) ----------
function genProblemeSommeDistances() {
  const n = randInt(2, 3);
  const distances = Array.from({ length: n }, () => randInt(2, 50));
  const total = distances.reduce((a, b) => a + b, 0);
  const activites = shuffle(["natation", "vélo", "course à pied", "marche"]).slice(0, n);
  const detail = distances.map((d, i) => `${d} km en ${activites[i]}`).join(", puis ");
  return {
    type: "numeric",
    chapter: "Grandeurs et mesures — Problèmes",
    prompt: `Lors d'un triathlon, un athlète parcourt ${detail}. Quelle est la distance totale parcourue, en km ?`,
    answer: total,
    steps: [{ type: "calcul", text: `${distances.join(" + ")} = ${total}` }],
  };
}

// ---------- 22. Coche les questions auxquelles on peut répondre ----------
function genProblemeCocheQuestionsGrandeurs() {
  const L = randInt(3, 20);
  const items = [
    { text: `Quel est le périmètre de ce rectangle ?`, correct: true },
    { text: `Quelle est son aire ?`, correct: true },
    { text: `Quel est le volume de ce rectangle ?`, correct: false },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Grandeurs et mesures — Problèmes",
    prompt: `Un rectangle a pour longueur ${L} cm (la largeur n'est pas précisée ici). Coche les questions auxquelles on pourrait répondre si l'on connaissait aussi sa largeur.`,
    options,
    answer,
    steps: [{ type: "regle", text: `Un rectangle a un périmètre et une aire, mais pas de "volume" (notion réservée aux solides).` }],
  };
}

const GENERATORS = [
  genRectangleGrandeurs,
  genPerimetreCercle,
  genPerimetreDemiCercle,
  genFigureComposeeRectangles,
  genVolumePave,
  genConvertirUnitesLongueur,
  genConvertirUnitesAire,
  genComparerAiresQCM,
  genLireHeureHorloge,
  genConvertirDureeMinutesHeures,
  genConvertirDureeJoursHeures,
  genConvertirDureeSexagesimaleDecimale,
  genComparerDureesQCM,
  genProblemeDureeHebdomadaireTravail,
  genProblemeHeureArriveeTexte,
  genProblemeDureeEntreDeuxHeures,
  genProblemeGrillagePerimetre,
  genProblemeMoquetteAire,
  genProblemeComparaisonSurfaces,
  genProblemeFrequenceTotal,
  genProblemeSommeDistances,
  genProblemeCocheQuestionsGrandeurs,
];

const DIFFICULTY = {
  genPerimetreCercle: "facile",
  genConvertirUnitesLongueur: "facile",
  genLireHeureHorloge: "facile",
  genConvertirDureeMinutesHeures: "facile",
  genConvertirDureeJoursHeures: "facile",
  genRectangleGrandeurs: "standard",
  genPerimetreDemiCercle: "standard",
  genVolumePave: "standard",
  genConvertirUnitesAire: "standard",
  genComparerAiresQCM: "standard",
  genConvertirDureeSexagesimaleDecimale: "standard",
  genComparerDureesQCM: "standard",
  genFigureComposeeRectangles: "expert",
  genProblemeDureeHebdomadaireTravail: "expert",
  genProblemeHeureArriveeTexte: "expert",
  genProblemeDureeEntreDeuxHeures: "expert",
  genProblemeGrillagePerimetre: "expert",
  genProblemeMoquetteAire: "expert",
  genProblemeComparaisonSurfaces: "expert",
  genProblemeFrequenceTotal: "expert",
  genProblemeSommeDistances: "expert",
  genProblemeCocheQuestionsGrandeurs: "expert",
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
    id: "grandeurs-mesures",
    title: "Grandeurs et mesures",
    description: "Périmètre, aire, volume, unités de longueur et d'aire, horaires et durées.",
    pourquoi: "Calculer un périmètre, une aire ou une durée, ce sont des gestes du quotidien : peindre une pièce, planifier un trajet, cuisiner une recette.",
    level: "sixieme",
    free: false,
    order: 5,
  },
  generate,
};
