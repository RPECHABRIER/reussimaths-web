// ---------------------------------------------------------------------------
// Chapitre : Nombres relatifs (5e) — sous abonnement.
//
// Reprend la tâche intellectuelle des exercices fournis (Séries 2 à 8 du
// chapitre "Nombres relatifs" : définition (opposé, valeur absolue, signe),
// droite graduée, comparer des relatifs, additionner des relatifs, soustraire
// des relatifs, enchaîner additions et soustractions, et un aperçu culturel
// inspiré de Brahmagupta), avec des nombres, prénoms et contextes différents
// à chaque génération. Voir automatismes-cinquieme.js (thème "nombres
// relatifs") pour la Série 1 (Automatismes, calcul décimal en contexte).
//
// Volontairement laissé de côté : la Série 8 (« Culture : les relatifs »)
// exercice 5, qui porte sur le signe d'un produit ou d'un quotient de deux
// relatifs — le manuel précise lui-même que c'est une notion « que tu
// apprendras l'année prochaine », donc hors-programme de 5e. Également
// laissés de côté : les carrés magiques (Série 7 ex.1) et la lecture directe
// de thermomètres/QCM en image (Série 2 ex.2-3), remplacés par des contextes
// équivalents en texte.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// Pour les écritures d'opérations avec parenthèses ("(+3,1) + (-3,5)"), voir
// signedTex() ci-dessous, qui ajoute le signe "+" explicite pour les nombres
// positifs, comme dans le manuel.
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
const nonZeroDecimal = (min, max, decimals) => {
  let n = 0;
  while (n === 0) n = randDecimal(min, max, decimals);
  return n;
};
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");
const signedTex = (n) => `${n >= 0 ? "+" : ""}${frTex(n)}`;

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

const romains = ["Marcus", "Livia", "Séverus", "Cassia", "Aurélia", "Tullius", "Octavia", "Décimus"];

function buildGraduatedLineFigure(markedValue, min, max, letter = "M") {
  const scale = 16;
  const y = 40;
  const toX = (v) => (v - min) * scale;
  const Lo = { id: "Lo", x: toX(min), y, hideDot: true, hideLabel: true };
  const Hi = { id: "Hi", x: toX(max), y, hideDot: true, hideLabel: true };
  const Mk = { id: letter, x: toX(markedValue), y, dy: -10 };
  const freeLabels = [];
  for (let v = min; v <= max; v++) {
    freeLabels.push({ x: toX(v), y: y + 16, text: `${v}` });
  }
  return { points: [Lo, Hi, Mk], lines: [{ from: "Lo", to: "Hi" }], freeLabels };
}

// =========================== Série 2 : Nombres relatifs (définition) ===========================

// ---------- 1. Opposé d'un nombre relatif ----------
function genOpposeDunNombre() {
  const n = Math.random() < 0.4 ? nonZero(-40, 40) : nonZeroDecimal(-40, 40, pick([1, 2]));
  const answer = -n;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Opposé",
    prompt: `Quel est l'opposé de ${fr(n)} ?`,
    answer,
    tolerance: 0.001,
    steps: [`L'opposé de ${fr(n)} est ${fr(answer)} (même distance à zéro, signe contraire).`],
  };
}

// ---------- 2. Valeur absolue (distance à zéro) ----------
function genValeurAbsolueDunNombre() {
  const n = Math.random() < 0.4 ? nonZero(-50, 50) : nonZeroDecimal(-50, 50, pick([1, 2]));
  const answer = Math.abs(n);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Valeur absolue",
    prompt: `Quelle est la valeur absolue (distance à zéro) de ${fr(n)} ?`,
    answer,
    tolerance: 0.001,
    steps: [`La distance à zéro de ${fr(n)} est ${fr(answer)}.`],
  };
}

// ---------- 3. Signe d'un nombre relatif ----------
function genSigneDunNombreQCM() {
  const n = Math.random() < 0.4 ? nonZero(-60, 60) : nonZeroDecimal(-60, 60, pick([1, 2]));
  const positif = n > 0;
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Signe",
    prompt: `Le nombre ${fr(n)} est-il positif ou négatif ?`,
    answer: positif ? "Positif" : "Négatif",
    options: ["Positif", "Négatif"],
    steps: [`${fr(n)} est ${positif ? "positif" : "négatif"}.`],
  };
}

// ---------- 4. Retrouver un nombre à partir de son opposé ----------
function genRetrouverNombreDepuisOppose() {
  const b = Math.random() < 0.4 ? nonZero(-40, 40) : nonZeroDecimal(-40, 40, pick([1, 2]));
  const answer = -b;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Opposé",
    prompt: `L'opposé d'un nombre a est ${fr(b)}. Quel est ce nombre a ?`,
    answer,
    tolerance: 0.001,
    steps: [`Si l'opposé de a vaut ${fr(b)}, alors a = ${fr(answer)}.`],
  };
}

// ---------- 5. Contexte immeuble (parking en sous-sol) ----------
function genContexteAscenseurNiveauQCM() {
  const sousSol = randInt(1, 4);
  const correct = `${-sousSol}`;
  const distracteurs = shuffle([`${sousSol}`, `${-(sousSol + 1)}`, `${-(sousSol - 1) || 1}`]).slice(0, 2);
  const options = shuffle([correct, ...distracteurs]);
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Contextes",
    prompt: `Un immeuble a un parking situé ${sousSol} niveau${sousSol > 1 ? "x" : ""} sous le rez-de-chaussée. Quel nombre relatif représente cet étage ?`,
    answer: correct,
    options,
    steps: [`Le rez-de-chaussée est au niveau 0. ${sousSol} niveau(x) en dessous correspond à ${correct}.`],
  };
}

// ---------- 6. Contexte profondeur / hauteur ----------
function genContexteProfondeurHauteurEcriture() {
  const isProfondeur = Math.random() < 0.5;
  const valeur = randDecimal(2, 400, pick([0, 1]));
  const answer = isProfondeur ? -valeur : valeur;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Contextes",
    prompt: isProfondeur
      ? `Un sous-marin plonge à ${fr(valeur)} m sous le niveau de la mer. Quel nombre relatif (en m) représente cette profondeur ?`
      : `Un drone vole à ${fr(valeur)} m au-dessus du niveau de la mer. Quel nombre relatif (en m) représente cette altitude ?`,
    answer,
    tolerance: 0.01,
    steps: [`Le niveau de la mer correspond à 0. ${isProfondeur ? "En dessous" : "Au-dessus"}, on utilise un nombre ${isProfondeur ? "négatif" : "positif"}.`],
  };
}

// =========================== Série 3 : Droite graduée ===========================

// ---------- 7. Lire l'abscisse d'un point sur une droite graduée ----------
function genAbscisseSurDroiteGraduee() {
  const markedValue = randInt(-7, 7);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Droite graduée",
    prompt: `Quelle est l'abscisse du point M sur la droite graduée ci-dessous ?`,
    figure: buildGraduatedLineFigure(markedValue, -8, 8, "M"),
    answer: markedValue,
    steps: [`Le point M est placé sur la graduation ${markedValue}.`],
  };
}

// ---------- 8. Comparer deux distances à zéro ----------
function genComparerDistancesAZeroQCM() {
  const a = nonZeroDecimal(-60, 60, pick([0, 1]));
  let b = nonZeroDecimal(-60, 60, pick([0, 1]));
  while (Math.abs(b) === Math.abs(a)) b = nonZeroDecimal(-60, 60, pick([0, 1]));
  const answer = Math.abs(a) > Math.abs(b) ? fr(a) : fr(b);
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Droite graduée",
    prompt: `Quel nombre a la plus grande distance à zéro : ${fr(a)} ou ${fr(b)} ?`,
    answer,
    options: shuffle([fr(a), fr(b)]),
    steps: [`Distance à zéro de ${fr(a)} : ${fr(Math.abs(a))}. Distance à zéro de ${fr(b)} : ${fr(Math.abs(b))}.`],
  };
}

// ---------- 9. Classer des dates (frise chronologique) ----------
function genClasserDatesFrise() {
  const labels = shuffle(["Fondation de la cité", "Grande éruption", "Traité de paix", "Construction du temple", "Grande crue"]).slice(0, 4);
  const years = new Set();
  while (years.size < 4) years.add(randInt(-800, 800));
  const events = labels.map((label, i) => ({ label, year: [...years][i] }));
  const sorted = [...events].sort((a, b) => a.year - b.year);
  const correctOrder = sorted.map((e) => e.label).join(" ; ");
  const wrongReverse = [...sorted].reverse().map((e) => e.label).join(" ; ");
  const wrongRandom = shuffle(events).map((e) => e.label).join(" ; ");
  const options = shuffle([...new Set([correctOrder, wrongReverse, wrongRandom])]);
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Droite graduée",
    prompt: `Range ces événements dans l'ordre chronologique (du plus ancien au plus récent) : ${events.map((e) => `${e.label} (an ${e.year})`).join(" ; ")}.`,
    answer: correctOrder,
    options: options.length >= 2 ? options : [correctOrder, wrongRandom],
    steps: [`On classe les années par ordre croissant (les années négatives sont les plus anciennes).`],
  };
}

// =========================== Série 4 : Comparer des relatifs ===========================

// ---------- 10. Comparer deux relatifs (< ou >) ----------
function genComparerDeuxRelatifsQCM() {
  const a = nonZeroDecimal(-80, 80, pick([0, 1]));
  let b = nonZeroDecimal(-80, 80, pick([0, 1]));
  while (b === a) b = nonZeroDecimal(-80, 80, pick([0, 1]));
  const correct = a < b ? "<" : ">";
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Comparer",
    prompt: `Complète par < ou > : \\(${frTex(a)}\\) ... \\(${frTex(b)}\\)`,
    answer: correct,
    options: ["<", ">"],
    steps: [`Un nombre négatif est toujours inférieur à un nombre positif ; entre deux négatifs, le plus grand est celui qui a la plus petite distance à zéro.`],
  };
}

// ---------- 11. Encadrer par deux entiers relatifs consécutifs ----------
function genEncadrerParEntiersRelatifsConsecutifs() {
  const x = nonZeroDecimal(-60.99, 60.99, 2);
  const answer = Math.floor(x);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Comparer",
    prompt: `Quel est l'entier relatif immédiatement inférieur à ${fr(x)} ?`,
    answer,
    steps: [`${answer} < ${fr(x)} < ${answer + 1}`],
  };
}

// ---------- 12. Ranger des relatifs (croissant ou décroissant) ----------
function genRangerRelatifsOrdreCroissantDecroissant() {
  const count = 4;
  const values = new Set();
  while (values.size < count) values.add(randDecimal(-50, 50, pick([0, 1])));
  const nums = [...values];
  const asc = Math.random() < 0.5;
  const sorted = [...nums].sort((a, b) => (asc ? a - b : b - a));
  const correctOrder = sorted.map(fr).join(" ; ");
  const wrongReverse = [...nums].sort((a, b) => (asc ? b - a : a - b)).map(fr).join(" ; ");
  const wrongRandom = shuffle(nums).map(fr).join(" ; ");
  const options = shuffle([...new Set([correctOrder, wrongReverse, wrongRandom])]);
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Comparer",
    prompt: `Range dans l'ordre ${asc ? "croissant" : "décroissant"} les nombres suivants : ${nums.map(fr).join(" ; ")}`,
    answer: correctOrder,
    options: options.length >= 2 ? options : [correctOrder, wrongRandom],
    steps: [`On place les nombres négatifs avant les positifs, puis on compare leurs distances à zéro.`, `Ordre correct : ${correctOrder}`],
  };
}

// =========================== Série 5 : Additionner des relatifs ===========================

// ---------- 13. Additionner deux relatifs de même signe ----------
function genAdditionnerDeuxRelatifsMemeSigne() {
  const positif = Math.random() < 0.5;
  const a = positif ? nonZeroDecimal(1, 50, pick([0, 1])) : -nonZeroDecimal(1, 50, pick([0, 1]));
  const b = positif ? nonZeroDecimal(1, 50, pick([0, 1])) : -nonZeroDecimal(1, 50, pick([0, 1]));
  const answer = roundTo(a + b, 2);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Additionner",
    prompt: `Calcule : \\((${signedTex(a)}) + (${signedTex(b)})\\)`,
    answer,
    tolerance: 0.01,
    steps: [`Les deux nombres ont le même signe : on garde ce signe et on additionne leurs distances à zéro.`, `${fr(a)} + ${fr(b)} = ${fr(answer)}`],
  };
}

// ---------- 14. Additionner deux relatifs de signes contraires ----------
function genAdditionnerDeuxRelatifsSignesContraires() {
  const a = nonZeroDecimal(1, 60, pick([0, 1])) * pick([1, -1]);
  let b = nonZeroDecimal(1, 60, pick([0, 1])) * pick([1, -1]);
  while (Math.sign(b) === Math.sign(a)) b = nonZeroDecimal(1, 60, pick([0, 1])) * pick([1, -1]);
  const answer = roundTo(a + b, 2);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Additionner",
    prompt: `Calcule : \\((${signedTex(a)}) + (${signedTex(b)})\\)`,
    answer,
    tolerance: 0.01,
    steps: [`Les deux nombres ont des signes contraires : on garde le signe du nombre ayant la plus grande distance à zéro, et on soustrait les distances à zéro.`, `${fr(a)} + ${fr(b)} = ${fr(answer)}`],
  };
}

// ---------- 15. Problème : température qui augmente ou baisse ----------
function genProblemeTemperatureAddition() {
  const t0 = randDecimal(-15, 15, pick([0, 1]));
  const delta = randDecimal(1, 20, pick([0, 1]));
  const augmente = Math.random() < 0.5;
  const answer = roundTo(augmente ? t0 + delta : t0 - delta, 2);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Additionner",
    prompt: `Il fait ${fr(t0)}°C. La température ${augmente ? "augmente" : "baisse"} de ${fr(delta)}°C. Quelle température fait-il ensuite, en °C ?`,
    answer,
    tolerance: 0.01,
    steps: [`${fr(t0)} ${augmente ? "+" : "-"} ${fr(delta)} = ${fr(answer)}`],
  };
}

// =========================== Série 6 : Soustraire des relatifs ===========================

// ---------- 16. Soustraire deux relatifs ----------
function genSoustraireDeuxRelatifs() {
  const a = nonZeroDecimal(-60, 60, pick([0, 1]));
  const b = nonZeroDecimal(-60, 60, pick([0, 1]));
  const answer = roundTo(a - b, 2);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Soustraire",
    prompt: `Calcule : \\((${signedTex(a)}) - (${signedTex(b)})\\)`,
    answer,
    tolerance: 0.01,
    steps: [`Soustraire un nombre revient à ajouter son opposé : (${signedTex(a)}) + (${signedTex(-b)})`, `= ${fr(answer)}`],
  };
}

// ---------- 17. Transformer une soustraction en addition de l'opposé ----------
function genTransformerSoustractionEnAddition() {
  const a = nonZeroDecimal(-40, 40, pick([0, 1]));
  const b = nonZeroDecimal(-40, 40, pick([0, 1]));
  const answer = -b;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Soustraire",
    prompt: `On veut écrire \\((${signedTex(a)}) - (${signedTex(b)})\\) sous la forme d'une addition : \\((${signedTex(a)}) + ?\\). Quel est le nombre manquant ?`,
    answer,
    tolerance: 0.001,
    steps: [`Soustraire (${signedTex(b)}) revient à ajouter son opposé, soit ${fr(answer)}.`],
  };
}

// ---------- 18. Durée de vie historique (années relatives) ----------
function genDureeVieHistorique() {
  const naissance = -randInt(20, 250);
  const dureeVie = randInt(20, 80);
  const mortAn = naissance + dureeVie;
  const nom = pick(romains);
  const mode = pick(["duree", "naissance"]);
  if (mode === "duree") {
    return {
      type: "numeric",
      chapter: "Nombres relatifs — Soustraire",
      prompt: `${nom} est né(e) en l'an ${naissance} et est mort(e) en l'an ${mortAn}. À quel âge est-il/elle mort(e) ?`,
      answer: dureeVie,
      steps: [`${mortAn} - (${naissance}) = ${dureeVie}`],
    };
  }
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Soustraire",
    prompt: `${nom} est mort(e) à ${dureeVie} ans, en l'an ${mortAn}. En quelle année est-il/elle né(e) ?`,
    answer: naissance,
    steps: [`${mortAn} - ${dureeVie} = ${naissance}`],
  };
}

// ---------- 19. Variation d'une quantité entre deux semaines ----------
function genVariationMasseSemaine() {
  const semaine1 = randDecimal(-15, 15, pick([0, 1]));
  const semaine2 = randDecimal(-15, 15, pick([0, 1]));
  const answer = roundTo(semaine2 - semaine1, 2);
  const grandeur = pick(["l'écart de masse (en kg, déchets jetés moins recyclés)", "la consommation d'énergie (en kWh, par rapport au mois précédent)"]);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Soustraire",
    prompt: `Voici ${grandeur} sur deux semaines : semaine 1 : ${fr(semaine1)} ; semaine 2 : ${fr(semaine2)}. Calcule la variation entre la semaine 1 et la semaine 2.`,
    answer,
    tolerance: 0.01,
    steps: [`${fr(semaine2)} - (${fr(semaine1)}) = ${fr(answer)}`],
  };
}

// =========================== Série 7 : Enchaîner additions et soustractions ===========================

// ---------- 20. Calculer une expression enchaînant + et - de relatifs ----------
function genCalculerExpressionRelatifsEnchainee() {
  const n = pick([3, 4]);
  const terms = Array.from({ length: n }, () => nonZeroDecimal(-30, 30, pick([0, 1])));
  const ops = Array.from({ length: n - 1 }, () => pick(["+", "-"]));
  let total = terms[0];
  let exprParts = [frTex(terms[0])];
  for (let i = 1; i < n; i++) {
    total = ops[i - 1] === "+" ? total + terms[i] : total - terms[i];
    exprParts.push(`${ops[i - 1]} (${signedTex(terms[i])})`);
  }
  total = roundTo(total, 2);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Enchaîner",
    prompt: `Calcule : \\(${exprParts.join(" ")}\\)`,
    answer: total,
    tolerance: 0.01,
    steps: [`On calcule de gauche à droite en transformant chaque soustraction en addition de l'opposé.`, `Résultat : ${fr(total)}`],
  };
}

// ---------- 21. Bilan carbone (somme de plusieurs relatifs en contexte) ----------
function genBilanCarboneAdditionSoustraction() {
  const n = pick([3, 4]);
  const libelles = shuffle(["émissions du matin", "économie d'éclairage", "livraisons", "plantation d'arbres", "trajet en voiture", "production locale"]).slice(0, n);
  const valeurs = Array.from({ length: n }, () => nonZeroDecimal(-40, 40, 0));
  const total = roundTo(valeurs.reduce((s, v) => s + v, 0), 2);
  const detail = libelles.map((lib, i) => `${lib} : ${valeurs[i] >= 0 ? "+" : ""}${fr(valeurs[i])} kg de CO2`).join(" ; ");
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Enchaîner",
    prompt: `Une commune étudie son bilan carbone journalier (en kg de CO2, positif si émission, négatif si économie) : ${detail}. Calcule le bilan total de la journée, en kg.`,
    answer: total,
    tolerance: 0.01,
    steps: [`${valeurs.map(fr).join(" + ")} = ${fr(total)}`],
  };
}

// ---------- 22. Évolution d'un écart au fil de plusieurs mois ----------
function genEcartEffectifsEvolution() {
  const depart = randInt(-20, 20);
  const variations = Array.from({ length: 3 }, () => nonZero(-10, 10));
  const final = variations.reduce((s, v) => s + v, depart);
  const mois = ["janvier", "février", "mars", "avril"];
  const detail = variations.map((v, i) => `en ${mois[i + 1]}, l'écart varie de ${v >= 0 ? "+" : ""}${v}`).join(" ; ");
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Enchaîner",
    prompt: `En ${mois[0]}, l'écart entre deux effectifs est de ${depart}. ${detail[0].toUpperCase()}${detail.slice(1)}. Quel est l'écart final ?`,
    answer: final,
    steps: [`${depart} ${variations.map((v) => `${v >= 0 ? "+" : ""}${v}`).join(" ")} = ${final}`],
  };
}

// =========================== Repérages : droite graduée et plan ===========================
// (Sous-thème "Repérer un point sur une droite, dans le plan" du chapitre,
// issu d'un module complémentaire "Repérages" reçu séparément.)

function buildRepereFigure(px, py, range = 4) {
  const scale = 24;
  const toX = (v) => v * scale;
  const toY = (v) => -v * scale;
  const OX1 = { id: "OX1", x: toX(-range - 0.5), y: toY(0), hideDot: true, hideLabel: true };
  const OX2 = { id: "OX2", x: toX(range + 0.5), y: toY(0), hideDot: true, hideLabel: true };
  const OY1 = { id: "OY1", x: toX(0), y: toY(-range - 0.5), hideDot: true, hideLabel: true };
  const OY2 = { id: "OY2", x: toX(0), y: toY(range + 0.5), hideDot: true, hideLabel: true };
  const A = { id: "A", x: toX(px), y: toY(py), dx: 8, dy: -8 };
  const freeLabels = [];
  for (let v = -range; v <= range; v++) {
    if (v === 0) continue;
    freeLabels.push({ x: toX(v), y: toY(0) + 14, text: `${v}` });
    freeLabels.push({ x: toX(0) - 12, y: toY(v) + 4, text: `${v}` });
  }
  return { points: [OX1, OX2, OY1, OY2, A], lines: [{ from: "OX1", to: "OX2" }, { from: "OY1", to: "OY2" }], freeLabels };
}

// ---------- 24. Compléter une graduation (demi-droite à échelle non unitaire) ----------
function genCompleterGraduationDemiDroite() {
  const min = pick([0, 800, 1000, 8000]);
  const nbIntervalles = pick([2, 4, 5]);
  const pas = pick([10, 20, 50, 100, 200]);
  const max = min + nbIntervalles * pas;
  const targetIndex = randInt(1, nbIntervalles - 1);
  const answer = min + targetIndex * pas;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Repérages",
    prompt: `Sur une demi-droite graduée régulièrement, la première graduation est ${min} et la dernière (après ${nbIntervalles} intervalles égaux) est ${max}. Quelle est la valeur de la ${targetIndex}${targetIndex === 1 ? "re" : "e"} graduation après ${min} ?`,
    answer,
    steps: [`Chaque intervalle vaut (${max} - ${min}) \\div ${nbIntervalles} = ${pas}.`, `${min} + ${targetIndex} \\times ${pas} = ${answer}`],
  };
}

// ---------- 25. Lire une coordonnée d'un point dans un repère (figure) ----------
function genLireCoordonneePointRepere() {
  const px = randInt(-4, 4);
  const py = randInt(-4, 4);
  const askAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Repérages",
    prompt: `Dans le repère ci-dessous, quelle est ${askAbscisse ? "l'abscisse" : "l'ordonnée"} du point A ?`,
    figure: buildRepereFigure(px, py),
    answer: askAbscisse ? px : py,
    steps: [`Le point A a pour coordonnées (${px} ; ${py}).`],
  };
}

// ---------- 26. Symétrique d'un point par rapport à l'origine (coordonnées) ----------
function genSymetriqueParRapportOrigineCoordonnees() {
  const px = nonZero(-9, 9);
  const py = nonZero(-9, 9);
  const askAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Repérages",
    prompt: `Le point A a pour coordonnées (${px} ; ${py}). Son symétrique A' par rapport à l'origine O du repère a pour coordonnées (?, ?). Quelle est ${askAbscisse ? "l'abscisse" : "l'ordonnée"} de A' ?`,
    answer: askAbscisse ? -px : -py,
    steps: [`Le symétrique par rapport à l'origine a des coordonnées opposées : A'(${-px} ; ${-py}).`],
  };
}

// ---------- 27. Symétrique d'un point par rapport à un axe (coordonnées) ----------
function genSymetriqueParRapportAxeCoordonnees() {
  const px = nonZero(-9, 9);
  const py = nonZero(-9, 9);
  const axeAbscisses = Math.random() < 0.5;
  const answer = axeAbscisses ? -py : -px;
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Repérages",
    prompt: `Le point A a pour coordonnées (${px} ; ${py}). Quelle est ${axeAbscisses ? "l'ordonnée" : "l'abscisse"} du symétrique de A par rapport à l'axe des ${axeAbscisses ? "abscisses" : "ordonnées"} ?`,
    answer,
    steps: axeAbscisses
      ? [`Le symétrique par rapport à l'axe des abscisses garde la même abscisse et change le signe de l'ordonnée : (${px} ; ${-py}).`]
      : [`Le symétrique par rapport à l'axe des ordonnées garde la même ordonnée et change le signe de l'abscisse : (${-px} ; ${py}).`],
  };
}

// ---------- 28. Signe des coordonnées selon la zone du plan ----------
function genQuadrantSigneCoordonneesQCM() {
  const px = nonZero(-9, 9);
  const py = nonZero(-9, 9);
  const zone =
    px > 0 && py > 0 ? "en haut à droite" : px < 0 && py > 0 ? "en haut à gauche" : px < 0 && py < 0 ? "en bas à gauche" : "en bas à droite";
  return {
    type: "qcm",
    chapter: "Nombres relatifs — Repérages",
    prompt: `Le point A a pour coordonnées (${px} ; ${py}). Dans quelle zone du plan (par rapport aux axes) se trouve-t-il ?`,
    answer: zone,
    options: shuffle(["en haut à droite", "en haut à gauche", "en bas à gauche", "en bas à droite"]),
    steps: [`On regarde le signe de l'abscisse (${px >= 0 ? "positive : droite" : "négative : gauche"}) et de l'ordonnée (${py >= 0 ? "positive : haut" : "négative : bas"}).`],
  };
}

// ---------- 29. Milieu d'un segment sur une droite graduée (abscisse) ----------
function genMilieuSegmentAbscisse() {
  const a = randInt(-30, 30);
  const c = randInt(-30, 30);
  const milieu = roundTo((a + c) / 2, 1);
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Repérages",
    prompt: `Sur une droite graduée, A a pour abscisse ${a} et C a pour abscisse ${c}. L est le milieu du segment [AC]. Quelle est l'abscisse de L ?`,
    answer: milieu,
    tolerance: 0.01,
    steps: [`(${a} + ${c}) \\div 2 = ${fr(milieu)}`],
  };
}

// =========================== Série 8 : Culture — les relatifs ===========================

// ---------- 23. Traduire une règle de calcul avec zéro (à la manière de Brahmagupta) ----------
function genTraduireOperationAvecZero() {
  const montant = randInt(2, 50);
  const kind = pick(["somme_dette", "dette_soustraite", "bien_soustrait"]);
  if (kind === "somme_dette") {
    return {
      type: "numeric",
      chapter: "Nombres relatifs — Culture",
      prompt: `La somme de zéro et d'une dette de ${montant} pièces est une dette de combien de pièces ? (réponds par un nombre relatif)`,
      answer: -montant,
      steps: [`0 + (${-montant}) = ${-montant}`],
    };
  }
  if (kind === "dette_soustraite") {
    return {
      type: "numeric",
      chapter: "Nombres relatifs — Culture",
      prompt: `Une dette de ${montant} pièces soustraite de zéro donne un bien de combien de pièces ? (réponds par un nombre relatif)`,
      answer: montant,
      steps: [`0 - (${-montant}) = ${montant}`],
    };
  }
  return {
    type: "numeric",
    chapter: "Nombres relatifs — Culture",
    prompt: `Un bien de ${montant} pièces soustrait de zéro donne une dette de combien de pièces ? (réponds par un nombre relatif)`,
    answer: -montant,
    steps: [`0 - ${montant} = ${-montant}`],
  };
}

const GENERATORS = [
  genOpposeDunNombre,
  genValeurAbsolueDunNombre,
  genSigneDunNombreQCM,
  genRetrouverNombreDepuisOppose,
  genContexteAscenseurNiveauQCM,
  genContexteProfondeurHauteurEcriture,
  genAbscisseSurDroiteGraduee,
  genComparerDistancesAZeroQCM,
  genClasserDatesFrise,
  genComparerDeuxRelatifsQCM,
  genEncadrerParEntiersRelatifsConsecutifs,
  genRangerRelatifsOrdreCroissantDecroissant,
  genAdditionnerDeuxRelatifsMemeSigne,
  genAdditionnerDeuxRelatifsSignesContraires,
  genProblemeTemperatureAddition,
  genSoustraireDeuxRelatifs,
  genTransformerSoustractionEnAddition,
  genDureeVieHistorique,
  genVariationMasseSemaine,
  genCalculerExpressionRelatifsEnchainee,
  genBilanCarboneAdditionSoustraction,
  genEcartEffectifsEvolution,
  genTraduireOperationAvecZero,
  genCompleterGraduationDemiDroite,
  genLireCoordonneePointRepere,
  genSymetriqueParRapportOrigineCoordonnees,
  genSymetriqueParRapportAxeCoordonnees,
  genQuadrantSigneCoordonneesQCM,
  genMilieuSegmentAbscisse,
];

const DIFFICULTY = {
  genOpposeDunNombre: "facile",
  genValeurAbsolueDunNombre: "facile",
  genSigneDunNombreQCM: "facile",
  genRetrouverNombreDepuisOppose: "facile",
  genAbscisseSurDroiteGraduee: "facile",
  genComparerDeuxRelatifsQCM: "facile",
  genAdditionnerDeuxRelatifsMemeSigne: "facile",
  genCompleterGraduationDemiDroite: "facile",
  genLireCoordonneePointRepere: "facile",
  genQuadrantSigneCoordonneesQCM: "facile",
  genTraduireOperationAvecZero: "facile",
  genContexteAscenseurNiveauQCM: "standard",
  genContexteProfondeurHauteurEcriture: "standard",
  genComparerDistancesAZeroQCM: "standard",
  genClasserDatesFrise: "standard",
  genEncadrerParEntiersRelatifsConsecutifs: "standard",
  genRangerRelatifsOrdreCroissantDecroissant: "standard",
  genAdditionnerDeuxRelatifsSignesContraires: "standard",
  genSoustraireDeuxRelatifs: "standard",
  genTransformerSoustractionEnAddition: "standard",
  genEcartEffectifsEvolution: "standard",
  genSymetriqueParRapportOrigineCoordonnees: "standard",
  genSymetriqueParRapportAxeCoordonnees: "standard",
  genMilieuSegmentAbscisse: "standard",
  genProblemeTemperatureAddition: "expert",
  genDureeVieHistorique: "expert",
  genVariationMasseSemaine: "expert",
  genCalculerExpressionRelatifsEnchainee: "expert",
  genBilanCarboneAdditionSoustraction: "expert",
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
    id: "nombres-relatifs",
    title: "Nombres relatifs",
    description: "Opposé, valeur absolue, droite graduée, comparer, additionner, soustraire, repérage dans le plan.",
    level: "cinquieme",
    free: false,
    order: 6,
  },
  generate,
};
