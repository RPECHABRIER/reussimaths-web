// ---------------------------------------------------------------------------
// Chapitre : Réviser les bases (6e) — gratuit, illimité.
//
// Reprend la MÊME tâche intellectuelle que les exercices "Prendre un bon
// départ" (nombres entiers et calcul + géométrie) du manuel, mais génère à
// chaque fois des nombres, un contexte et des prénoms différents. Les
// exercices qui nécessitaient un vrai tracé à la main (construction au
// compas/à la règle) ont été laissés de côté pour l'instant : l'appli ne
// permet pas encore de dessiner (voir Figure.jsx pour ce qu'elle sait déjà
// afficher : points, segments, droites, cercles, angles droits).
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const nonZero = (min, max) => {
  let n = 0;
  while (n === 0) n = randInt(min, max);
  return n;
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// items: [{ text, correct }] -> mélange et renvoie { options, answer } où
// `answer` est la liste des index corrects APRÈS mélange (voir type "multi").
function shuffleStatements(items) {
  const order = shuffle(items.map((_, i) => i));
  const options = order.map((i) => items[i].text);
  const answer = order.map((i, newIndex) => (items[i].correct ? newIndex : null)).filter((v) => v !== null);
  return { options, answer };
}

function mkPoints(ids, coords) {
  return ids.map((id, i) => ({ id, x: coords[i][0], y: coords[i][1] }));
}

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];
const objectsPlural = ["billes", "autocollants", "cartes de collection", "bonbons", "coquillages", "timbres", "stylos", "perles"];

// ---------------------------------------------------------------------------
// Nombres entiers et calcul
// ---------------------------------------------------------------------------

function genChiffrePosition() {
  const n = randInt(1000, 987654);
  const s = String(n);
  const positions = [
    { name: "unités", idx: s.length - 1 },
    { name: "dizaines", idx: s.length - 2 },
    { name: "centaines", idx: s.length - 3 },
    { name: "milliers", idx: s.length - 4 },
  ].filter((p) => p.idx >= 0);
  const pos = pick(positions);
  const digit = Number(s[pos.idx]);
  return {
    type: "numeric",
    chapter: "Réviser les bases — Nombres entiers",
    prompt: `Dans le nombre ${n}, quel est le chiffre des ${pos.name} ?`,
    answer: digit,
    steps: [`On repère la position "${pos.name}" en partant de la droite.`, `Le chiffre à cette position est ${digit}.`],
  };
}

function genDecompositionAdditive() {
  const parts = [
    { mult: 1000000 },
    { mult: 100000 },
    { mult: 10000 },
    { mult: 1000 },
    { mult: 100 },
    { mult: 10 },
    { mult: 1 },
  ];
  const chosen = shuffle(parts)
    .slice(0, pick([3, 4]))
    .sort((a, b) => b.mult - a.mult);
  let total = 0;
  const terms = chosen.map((p) => {
    const c = nonZero(1, 8);
    total += c * p.mult;
    return `(${c} \\times ${p.mult})`;
  });
  return {
    type: "numeric",
    chapter: "Réviser les bases — Nombres entiers",
    prompt: `Quel nombre correspond à \\(${terms.join(" + ")}\\) ?`,
    answer: total,
    steps: [`On calcule chaque produit puis on additionne les résultats.`, `Résultat : ${total}`],
  };
}

function genConversionUnites() {
  const unite = pick([
    { name: "dizaines", val: 10 },
    { name: "centaines", val: 100 },
    { name: "milliers", val: 1000 },
  ]);
  const count = randInt(15, 950);
  const n = count * unite.val;
  const askNumber = Math.random() < 0.5;
  if (askNumber) {
    return {
      type: "numeric",
      chapter: "Réviser les bases — Nombres entiers",
      prompt: `Quel nombre correspond à ${count} ${unite.name} ?`,
      answer: n,
      steps: [`${count} \\times ${unite.val} = ${n}`],
    };
  }
  return {
    type: "numeric",
    chapter: "Réviser les bases — Nombres entiers",
    prompt: `${n} = combien de ${unite.name} ?`,
    answer: count,
    steps: [`${n} \\div ${unite.val} = ${count}`],
  };
}

function genNombrePrecedent() {
  const n = randInt(500, 500000);
  return {
    type: "numeric",
    chapter: "Réviser les bases — Nombres entiers",
    prompt: `Quel est l'entier qui précède immédiatement ${n} ?`,
    answer: n - 1,
    steps: [`Le nombre juste avant ${n} est ${n - 1}.`],
  };
}

function genCompleterRond() {
  const rond = pick([1000, 10000, 100]);
  const n = randInt(1, rond - 1);
  return {
    type: "numeric",
    chapter: "Réviser les bases — Nombres entiers",
    prompt: `Complète : \\(${n} + \\underline{\\hspace{1cm}} = ${rond}\\)`,
    answer: rond - n,
    steps: [`${rond} - ${n} = ${rond - n}`],
  };
}

function genSuiteLogique() {
  const start = randInt(100, 900);
  const step = pick([10, 20, 25, 50, 100]) * pick([1, -1]);
  const terms = [start, start + step, start + 2 * step];
  const answer = start + 3 * step;
  return {
    type: "numeric",
    chapter: "Réviser les bases — Nombres entiers",
    prompt: `Complète la suite logique : ${terms.join(" — ")} — ... ?`,
    answer,
    steps: [`On repère le pas entre deux termes consécutifs : ${step >= 0 ? "+" : ""}${step}.`, `${terms[2]} ${step >= 0 ? "+" : "-"} ${Math.abs(step)} = ${answer}`],
  };
}

function genProblemeCode() {
  const u = randInt(0, 3);
  const c = 3 * u;
  const m = randInt(1, 3);
  const d = 2 * m;
  const sum = m + d + c + u;
  const objet = pick(["cadenas de casier", "vélo", "coffre-fort", "téléphone"]);
  const prenom = pick(prenoms);
  const code = m * 1000 + c * 100 + d * 10 + u;
  return {
    type: "numeric",
    chapter: "Réviser les bases — Problèmes",
    prompt: `${prenom} a oublié le code à 4 chiffres de son ${objet}. Le chiffre des dizaines est le double de celui des milliers. Le chiffre des centaines est le triple de celui des unités. La somme des quatre chiffres est ${sum}. Quel est ce code ?`,
    answer: code,
    steps: [
      `On cherche des chiffres m (milliers), d (dizaines), c (centaines), u (unités) avec d = 2m et c = 3u.`,
      `En testant les petites valeurs qui vérifient la somme, on trouve m = ${m}, c = ${c}, d = ${d}, u = ${u}.`,
      `Le code est ${code}.`,
    ],
  };
}

function genProblemeSommeObjets() {
  const categories = shuffle(["vélos", "trottinettes", "planches à roulettes", "rollers", "skateboards"]).slice(0, 4);
  const counts = categories.map(() => randInt(120, 480));
  const total = counts.reduce((a, b) => a + b, 0);
  const lieu = pick(["Dans un entrepôt de sport,", "Dans un club omnisports,", "Lors d'une brocante,"]);
  const lines = categories.map((c, i) => `${counts[i]} ${c}`).join(", ");
  return {
    type: "numeric",
    chapter: "Réviser les bases — Problèmes",
    prompt: `${lieu} on recense ${lines}. Combien d'objets au total ont été recensés ?`,
    answer: total,
    steps: [`On additionne les quatre quantités : ${counts.join(" + ")} = ${total}.`],
  };
}

function genProblemeSoustractionPartie() {
  const total = randInt(400, 950);
  const partEtranger = randInt(100, total - 100);
  const partFrance = total - partEtranger;
  const fleuve = pick(["Le Rhône", "La Loire", "La Garonne", "La Seine", "Le Rhin"]);
  const pays = pick(["en Suisse", "en Espagne", "en Allemagne", "en Belgique"]);
  return {
    type: "numeric",
    chapter: "Réviser les bases — Problèmes",
    prompt: `${fleuve} est un fleuve de longueur totale ${total} km, dont ${partEtranger} km ${pays}. Combien de kilomètres mesure sa partie française ?`,
    answer: partFrance,
    steps: [`Partie française = longueur totale − partie à l'étranger.`, `${total} - ${partEtranger} = ${partFrance}`],
  };
}

function genProblemeConversionTemps() {
  if (Math.random() < 0.4) {
    const h = randInt(2, 6);
    return {
      type: "numeric",
      chapter: "Réviser les bases — Problèmes",
      prompt: `Combien y a-t-il de minutes dans ${h} heures ?`,
      answer: h * 60,
      steps: [`1 heure = 60 minutes.`, `${h} \\times 60 = ${h * 60}`],
    };
  }
  const m = randInt(20, 95);
  return {
    type: "numeric",
    chapter: "Réviser les bases — Problèmes",
    prompt: `Combien y a-t-il de secondes dans ${m} minutes ?`,
    answer: m * 60,
    steps: [`1 minute = 60 secondes.`, `${m} \\times 60 = ${m * 60}`],
  };
}

function genProblemeEcartTaille() {
  const smallerCm = randInt(120, 165);
  const ecart = randInt(5, 40);
  const largerCm = smallerCm + ecart;
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const lien = pick(["frère", "cousin", "camarade"]);
  return {
    type: "numeric",
    chapter: "Réviser les bases — Problèmes",
    prompt: `${p1} mesure ${largerCm} cm, c'est ${ecart} cm de plus que son ${lien} ${p2}. Quelle est la taille de ${p2}, en cm ?`,
    answer: smallerCm,
    steps: [`Taille de ${p2} = taille de ${p1} − écart.`, `${largerCm} - ${ecart} = ${smallerCm}`],
  };
}

function genProblemeMultiplicateur() {
  const base = randInt(15, 90);
  const facteur = pick([2, 3, 4]);
  const total = base * facteur;
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const objet = pick(objectsPlural);
  const mot = facteur === 2 ? "deux fois" : facteur === 3 ? "trois fois" : "quatre fois";
  return {
    type: "numeric",
    chapter: "Réviser les bases — Problèmes",
    prompt: `${p1} possède ${mot} plus de ${objet} que ${p2}, qui en a ${base}. Combien de ${objet} ${p1} possède-t-il ?`,
    answer: total,
    steps: [`${base} \\times ${facteur} = ${total}`],
  };
}

function genProblemeComparaisonFois() {
  const facteur = pick([2, 3, 4, 5]);
  const base = randInt(15, 60);
  const total = base * facteur;
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const contexte = pick(["économies (en €)", "billes", "images de collection"]);
  return {
    type: "numeric",
    chapter: "Réviser les bases — Problèmes",
    prompt: `${p1} et ${p2} comparent leurs ${contexte}. ${p1} en a ${total} ; ${p2} en a ${base}. Combien de fois plus ${p1} en a-t-il que ${p2} ?`,
    answer: facteur,
    steps: [`${total} \\div ${base} = ${facteur}`],
  };
}

function genPoserOperation() {
  const a = randInt(23, 89);
  const b = randInt(12, 47);
  return {
    type: "numeric",
    chapter: "Réviser les bases — Automatismes",
    prompt: `Pose et calcule : \\(${a} \\times ${b}\\)`,
    answer: a * b,
    steps: [`${a} \\times ${b} = ${a * b}`],
  };
}

function genAdditionSoustractionPosee() {
  if (Math.random() < 0.5) {
    const a = randInt(1200, 9800);
    const b = randInt(1200, 9800);
    return {
      type: "numeric",
      chapter: "Réviser les bases — Automatismes",
      prompt: `Pose et calcule : \\(${a} + ${b}\\)`,
      answer: a + b,
      steps: [`${a} + ${b} = ${a + b}`],
    };
  }
  const a = randInt(5000, 9999);
  const b = randInt(1000, a - 1);
  return {
    type: "numeric",
    chapter: "Réviser les bases — Automatismes",
    prompt: `Pose et calcule : \\(${a} - ${b}\\)`,
    answer: a - b,
    steps: [`${a} - ${b} = ${a - b}`],
  };
}

function genCalculAstucieux() {
  const nums = Array.from({ length: 4 }, () => randInt(10, 90));
  const total = nums.reduce((a, b) => a + b, 0);
  return {
    type: "numeric",
    chapter: "Réviser les bases — Automatismes",
    prompt: `Calcule astucieusement : \\(${nums.join(" + ")}\\)`,
    answer: total,
    steps: [`On peut regrouper les nombres pour former des dizaines ou centaines rondes avant d'additionner.`, `Total : ${total}`],
  };
}

function genRangerTableau() {
  const animals = shuffle(["Renard", "Loutre", "Blaireau", "Hérisson", "Faucon", "Lièvre"]).slice(0, 3);
  let values;
  do {
    values = animals.map(() => randInt(3, 97));
  } while (new Set(values).size < values.length);
  const asc = Math.random() < 0.5;
  const pairs = animals.map((a, i) => ({ a, v: values[i] }));
  const sorted = [...pairs].sort((p, q) => (asc ? p.v - q.v : q.v - p.v));
  const correctOrder = sorted.map((p) => p.a).join(", ");
  const wrongReverse = [...pairs].sort((p, q) => (asc ? q.v - p.v : p.v - q.v)).map((p) => p.a).join(", ");
  const wrongRandom = shuffle(pairs.map((p) => p.a)).join(", ");
  const options = shuffle([...new Set([correctOrder, wrongReverse, wrongRandom])]);
  const table = pairs.map((p) => `${p.a} : ${p.v} kg`).join(" — ");
  return {
    type: "qcm",
    chapter: "Réviser les bases — Nombres entiers",
    prompt: `Voici les masses (en kg) de quelques animaux : ${table}. Range-les par masse ${asc ? "croissante" : "décroissante"}.`,
    answer: correctOrder,
    options: options.length >= 2 ? options : [correctOrder, wrongRandom],
    steps: [`On compare les valeurs une à une puis on les ordonne.`, `Ordre correct : ${correctOrder}`],
  };
}

// ---------------------------------------------------------------------------
// Géométrie — utilise le composant <Figure /> (voir components/Figure.jsx)
// pour afficher points, segments, droites, cercles et angles droits.
// Les exercices de construction/tracé à la main sont laissés de côté pour
// l'instant (l'appli ne sait pas encore faire dessiner l'élève).
// ---------------------------------------------------------------------------

function genPointsAlignes() {
  const letters = shuffle(["A", "B", "C", "D", "E", "F"]).slice(0, 4);
  const [l1, l2, l3, l4] = letters;
  const angle = randInt(10, 80) * pick([1, -1]);
  const rad = (angle * Math.PI) / 180;
  const dirx = Math.cos(rad);
  const diry = Math.sin(rad);
  const origin = { x: 40, y: 100 };
  const t1 = randInt(10, 30);
  const t2 = t1 + randInt(25, 45);
  const t3 = t2 + randInt(25, 45);
  const p1 = { id: l1, x: origin.x + dirx * t1, y: origin.y + diry * t1 };
  const p2 = { id: l2, x: origin.x + dirx * t2, y: origin.y + diry * t2 };
  const p3 = { id: l3, x: origin.x + dirx * t3, y: origin.y + diry * t3 };
  const nx = -diry;
  const ny = dirx;
  const off = randInt(30, 50) * pick([1, -1]);
  const p4 = { id: l4, x: p2.x + nx * off, y: p2.y + ny * off };
  const askAligned = Math.random() < 0.5;
  let queryLetters;
  if (askAligned) queryLetters = [l1, l2, l3];
  else {
    const onTwo = shuffle([l1, l2, l3]).slice(0, 2);
    queryLetters = shuffle([...onTwo, l4]);
  }
  const figure = { points: [p1, p2, p3, p4], lines: [{ from: l1, to: l3, extend: 22 }] };
  const answer = askAligned ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Réviser les bases — Géométrie",
    prompt: `Observe la figure. Les points ${queryLetters.join(", ")} sont-ils alignés ?`,
    figure,
    answer,
    options: shuffle(["Oui", "Non"]),
    steps: [
      `Des points sont alignés s'ils appartiennent à une même droite.`,
      askAligned
        ? `${l1}, ${l2} et ${l3} sont bien placés sur la droite tracée : ils sont alignés.`
        : `${l4} n'appartient pas à la droite (${l1}${l3}) : les points ne sont pas tous alignés.`,
    ],
  };
}

function genAppartenanceMulti() {
  const letters = shuffle(["A", "B", "C", "M", "E", "H", "N", "K"]).slice(0, 5);
  const A = { id: letters[0], x: 30, y: 130 };
  const B = { id: letters[1], x: 190, y: 130 };
  const M = { id: letters[2], x: (30 + 190) / 2, y: 130, dy: 18 };
  const C = { id: letters[3], x: 100 + randInt(-15, 15), y: 30 + randInt(-10, 10) };
  const E = { id: letters[4], x: 230, y: 70 };
  const figure = {
    points: [A, B, M, C, E],
    segments: [
      { from: A.id, to: B.id },
      { from: B.id, to: C.id },
      { from: A.id, to: C.id },
    ],
  };
  const items = [
    { text: `${M.id} appartient au segment [${A.id}${B.id}].`, correct: true },
    { text: `${C.id} appartient au segment [${A.id}${B.id}].`, correct: false },
    { text: `${M.id} appartient à la droite (${A.id}${B.id}).`, correct: true },
    { text: `${E.id} appartient au segment [${B.id}${C.id}].`, correct: false },
    { text: `Les points ${A.id}, ${B.id} et ${C.id} sont alignés.`, correct: false },
    { text: `${B.id} appartient à la droite (${A.id}${M.id}).`, correct: true },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Réviser les bases — Géométrie",
    prompt: `Observe la figure. Coche toutes les affirmations correctes.`,
    figure,
    options,
    answer,
    steps: [
      `${M.id} est le milieu de [${A.id}${B.id}] : il appartient donc au segment ET à la droite (${A.id}${B.id}).`,
      `${C.id} n'est pas sur la droite (${A.id}${B.id}) : ${A.id}, ${B.id}, ${C.id} ne sont pas alignés.`,
      `${E.id} n'appartient pas au segment [${B.id}${C.id}].`,
    ],
  };
}

function genNatureDroites() {
  const kind = pick(["parallèles", "perpendiculaires", "sécantes"]);
  const angle1 = randInt(15, 75);
  const rad1 = (angle1 * Math.PI) / 180;
  const dir1 = { x: Math.cos(rad1), y: Math.sin(rad1) };
  let dir2;
  if (kind === "parallèles") dir2 = dir1;
  else if (kind === "perpendiculaires") dir2 = { x: -dir1.y, y: dir1.x };
  else {
    const angle2 = angle1 + pick([28, 35, 42, -28, -35, -42]);
    const rad2 = (angle2 * Math.PI) / 180;
    dir2 = { x: Math.cos(rad2), y: Math.sin(rad2) };
  }
  const c1 = { x: 90, y: 90 };
  const c2 = kind === "parallèles" ? { x: 90 - dir1.y * 45, y: 90 + dir1.x * 45 } : { x: 90, y: 90 };
  const len = 42;
  const points = [
    { id: "A", x: c1.x - dir1.x * len, y: c1.y - dir1.y * len, hideDot: true },
    { id: "B", x: c1.x + dir1.x * len, y: c1.y + dir1.y * len, hideDot: true },
    { id: "C", x: c2.x - dir2.x * len, y: c2.y - dir2.y * len, hideDot: true },
    { id: "D", x: c2.x + dir2.x * len, y: c2.y + dir2.y * len, hideDot: true },
  ];
  const figure = {
    points,
    lines: [
      { from: "A", to: "B", label: "(d₁)" },
      { from: "C", to: "D", label: "(d₂)" },
    ],
    hidePointLabels: true,
  };
  const sentences = {
    "parallèles": "Elles sont parallèles.",
    "perpendiculaires": "Elles sont perpendiculaires.",
    "sécantes": "Elles sont sécantes, mais ni parallèles ni perpendiculaires.",
  };
  const answer = sentences[kind];
  return {
    type: "qcm",
    chapter: "Réviser les bases — Géométrie",
    prompt: `Que peut-on dire des droites (d₁) et (d₂) représentées ci-dessous ?`,
    figure,
    answer,
    options: shuffle(Object.values(sentences)),
    steps: [`On observe si les droites se croisent, et si oui, en formant un angle droit ou non.`, answer],
  };
}

function genNatureQuadrilatereTriangle() {
  const shape = pick(["carre", "rectangle", "losange", "triangle_rectangle", "triangle_isocele"]);

  if (shape === "carre") {
    const s = randInt(60, 100);
    const ids = shuffle(["A", "B", "C", "D"]);
    const points = mkPoints(ids, [
      [20, 20],
      [20 + s, 20],
      [20 + s, 20 + s],
      [20, 20 + s],
    ]);
    const [a, b, c, d] = ids;
    const figure = {
      points,
      segments: [
        { from: a, to: b, ticks: 1 },
        { from: b, to: c, ticks: 1 },
        { from: c, to: d, ticks: 1 },
        { from: d, to: a, ticks: 1 },
      ],
      rightAngles: [
        { at: a, from: d, to: b },
        { at: b, from: a, to: c },
        { at: c, from: b, to: d },
        { at: d, from: c, to: a },
      ],
    };
    return {
      type: "text",
      chapter: "Réviser les bases — Géométrie",
      prompt: `Quelle est la nature du quadrilatère ${a}${b}${c}${d} ? (Réponds par un seul mot.)`,
      figure,
      answer: ["carré", "carre"],
      steps: [`4 côtés de même longueur (codés) et 4 angles droits : c'est un carré.`],
    };
  }

  if (shape === "rectangle") {
    const w = randInt(95, 140);
    const h = randInt(50, 80);
    const ids = shuffle(["A", "B", "C", "D"]);
    const points = mkPoints(ids, [
      [20, 20],
      [20 + w, 20],
      [20 + w, 20 + h],
      [20, 20 + h],
    ]);
    const [a, b, c, d] = ids;
    const figure = {
      points,
      segments: [
        { from: a, to: b, ticks: 1 },
        { from: b, to: c, ticks: 2 },
        { from: c, to: d, ticks: 1 },
        { from: d, to: a, ticks: 2 },
      ],
      rightAngles: [
        { at: a, from: d, to: b },
        { at: b, from: a, to: c },
        { at: c, from: b, to: d },
        { at: d, from: c, to: a },
      ],
    };
    return {
      type: "text",
      chapter: "Réviser les bases — Géométrie",
      prompt: `Quelle est la nature du quadrilatère ${a}${b}${c}${d} ? (Réponds par un seul mot.)`,
      figure,
      answer: ["rectangle"],
      steps: [`Côtés opposés de même longueur (codés) et 4 angles droits, mais tous les côtés ne sont pas égaux : c'est un rectangle.`],
    };
  }

  if (shape === "losange") {
    const p = randInt(45, 75);
    let q = randInt(45, 75);
    while (Math.abs(p - q) < 15) q = randInt(45, 75);
    const center = { x: 110, y: 90 };
    const ids = shuffle(["A", "B", "C", "D"]);
    const points = mkPoints(ids, [
      [center.x, center.y - p],
      [center.x + q, center.y],
      [center.x, center.y + p],
      [center.x - q, center.y],
    ]);
    const [a, b, c, d] = ids;
    const figure = {
      points,
      segments: [
        { from: a, to: b, ticks: 1 },
        { from: b, to: c, ticks: 1 },
        { from: c, to: d, ticks: 1 },
        { from: d, to: a, ticks: 1 },
      ],
    };
    return {
      type: "text",
      chapter: "Réviser les bases — Géométrie",
      prompt: `Quelle est la nature du quadrilatère ${a}${b}${c}${d} ? (Réponds par un seul mot.)`,
      figure,
      answer: ["losange"],
      steps: [`Les 4 côtés ont la même longueur (codés), mais les angles ne sont pas droits : c'est un losange.`],
    };
  }

  if (shape === "triangle_rectangle") {
    const w = randInt(60, 110);
    const h = randInt(50, 100);
    const ids = shuffle(["A", "B", "C"]);
    const points = mkPoints(ids, [
      [20, 20],
      [20 + w, 20],
      [20, 20 + h],
    ]);
    const [a, b, c] = ids;
    const figure = {
      points,
      segments: [
        { from: a, to: b },
        { from: b, to: c },
        { from: c, to: a },
      ],
      rightAngles: [{ at: a, from: b, to: c }],
    };
    return {
      type: "text",
      chapter: "Réviser les bases — Géométrie",
      prompt: `Quelle est la nature du triangle ${a}${b}${c} ? (Réponds par "triangle rectangle".)`,
      figure,
      answer: ["triangle rectangle"],
      steps: [`Un angle droit est codé en ${a} : c'est un triangle rectangle.`],
    };
  }

  // triangle_isocele
  const half = randInt(50, 90);
  const h = randInt(50, 90);
  const ids = shuffle(["A", "B", "C"]);
  const points = mkPoints(ids, [
    [110 - half, 130],
    [110 + half, 130],
    [110, 130 - h],
  ]);
  const [a, b, c] = ids;
  const figure = {
    points,
    segments: [
      { from: a, to: b },
      { from: a, to: c, ticks: 1 },
      { from: b, to: c, ticks: 1 },
    ],
  };
  return {
    type: "text",
    chapter: "Réviser les bases — Géométrie",
    prompt: `Quelle est la nature du triangle ${a}${b}${c} ? (Réponds par "triangle isocèle".)`,
    figure,
    answer: ["triangle isocèle", "triangle isocele"],
    steps: [`Deux côtés de même longueur sont codés (${a}${c} et ${b}${c}) : c'est un triangle isocèle en ${c}.`],
  };
}

function genMilieuSegment() {
  const half = randInt(15, 45);
  const total = half * 2;
  const giveTotal = Math.random() < 0.5;
  const A = { id: "A", x: 20, y: 100 };
  const B = { id: "B", x: 220, y: 100 };
  const M = { id: "M", x: 120, y: 100, dy: 20 };
  const figure = {
    points: [A, B, M],
    segments: [
      { from: "A", to: "M", ticks: 1 },
      { from: "M", to: "B", ticks: 1 },
    ],
  };
  if (giveTotal) {
    return {
      type: "numeric",
      chapter: "Réviser les bases — Géométrie",
      prompt: `M est le milieu du segment [AB]. Sachant que AB = ${total} cm, quelle est la longueur AM, en cm ?`,
      figure,
      answer: half,
      steps: [`Le milieu partage le segment en deux parties égales.`, `AM = AB \\div 2 = ${total} \\div 2 = ${half}`],
    };
  }
  return {
    type: "numeric",
    chapter: "Réviser les bases — Géométrie",
    prompt: `M est le milieu du segment [AB]. Sachant que AM = ${half} cm, quelle est la longueur AB, en cm ?`,
    figure,
    answer: total,
    steps: [`AB = 2 \\times AM = 2 \\times ${half} = ${total}`],
  };
}

function genPerimetreFigureCodee() {
  const L = randInt(6, 14);
  const l = randInt(3, 9);
  const perim = 2 * (L + l);
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
  return {
    type: "numeric",
    chapter: "Réviser les bases — Géométrie",
    prompt: `ABCD est un rectangle. Calcule son périmètre, en cm.`,
    figure,
    answer: perim,
    steps: [`Périmètre = 2 \\times (longueur + largeur)`, `2 \\times (${L} + ${l}) = ${perim}`],
  };
}

const GENERATORS = [
  genChiffrePosition,
  genDecompositionAdditive,
  genConversionUnites,
  genNombrePrecedent,
  genCompleterRond,
  genSuiteLogique,
  genProblemeCode,
  genProblemeSommeObjets,
  genProblemeSoustractionPartie,
  genProblemeConversionTemps,
  genProblemeEcartTaille,
  genProblemeMultiplicateur,
  genProblemeComparaisonFois,
  genPoserOperation,
  genAdditionSoustractionPosee,
  genCalculAstucieux,
  genRangerTableau,
  genPointsAlignes,
  genAppartenanceMulti,
  genNatureDroites,
  genNatureQuadrilatereTriangle,
  genMilieuSegment,
  genPerimetreFigureCodee,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "reviser-les-bases",
    title: "Réviser les bases",
    description: "Nombres entiers, calculs et géométrie de base — pour prendre un bon départ en 6e. Gratuit et illimité.",
    level: "sixieme",
    free: true,
    order: 0,
  },
  generate,
};
