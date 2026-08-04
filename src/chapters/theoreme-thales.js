// ---------------------------------------------------------------------------
// Chapitre : Théorème de Thalès (4e) — sous abonnement.
//
// Correspond au chapitre 11 du sommaire officiel : calculer une longueur
// grâce au théorème de Thalès, utiliser la réciproque pour montrer que deux
// droites sont parallèles (ou non), problèmes contextualisés (hauteur d'un
// immeuble, agrandissement/réduction). Reprend la tâche intellectuelle des
// exercices fournis, avec des nombres, prénoms et contextes différents à
// chaque génération. Voir automatismes-quatrieme.js pour le thème "Calcul
// mental" associé.
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

function buildThalesFigure(ratio) {
  const A = { id: "A", x: 150, y: 20, dy: -10 };
  const B = { id: "B", x: 40, y: 190, dx: -14 };
  const C = { id: "C", x: 260, y: 190, dx: 14 };
  const M = { id: "M", x: A.x + ratio * (B.x - A.x), y: A.y + ratio * (B.y - A.y), dx: -16 };
  const N = { id: "N", x: A.x + ratio * (C.x - A.x), y: A.y + ratio * (C.y - A.y), dx: 16 };
  return {
    points: [A, B, C, M, N],
    segments: [
      { from: "A", to: "B" },
      { from: "A", to: "C" },
      { from: "B", to: "C" },
      { from: "M", to: "N", dashed: true },
    ],
  };
}

// =========================== Calculer une longueur grâce au théorème de Thalès ===========================

// ---------- 1. Calculer AN ----------
function genCalculerLongueurThalesANNumeric() {
  const AM = randInt(2, 10);
  const AB = randInt(AM + 2, AM + 15);
  const AC = randInt(6, 20);
  const ratio = AM / AB;
  const AN = roundTo(ratio * AC, 2);
  return {
    type: "numeric",
    chapter: "Théorème de Thalès — Calculer une longueur",
    prompt: `Dans un triangle ABC, M appartient à [AB] et N appartient à [AC], et les droites (MN) et (BC) sont parallèles. On donne AM = ${AM} cm, AB = ${AB} cm et AC = ${AC} cm. Calcule la longueur AN, en cm (arrondie au centième si nécessaire).`,
    figure: buildThalesFigure(ratio),
    answer: AN,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\dfrac{AM}{AB} = \\dfrac{AN}{AC}` },
      { type: "donnee", text: `\\dfrac{${AM}}{${AB}} = \\dfrac{AN}{${AC}}` },
      { type: "resultat", text: `AN = \\dfrac{${AM} \\times ${AC}}{${AB}} \\approx ${fr(AN)}` },
    ],
  };
}

// ---------- 2. Calculer MN ----------
function genCalculerLongueurThalesMNNumeric() {
  const AM = randInt(2, 10);
  const AB = randInt(AM + 2, AM + 15);
  const BC = randInt(6, 25);
  const ratio = AM / AB;
  const MN = roundTo(ratio * BC, 2);
  return {
    type: "numeric",
    chapter: "Théorème de Thalès — Calculer une longueur",
    prompt: `Dans un triangle ABC, M appartient à [AB] et N appartient à [AC], et les droites (MN) et (BC) sont parallèles. On donne AM = ${AM} cm, AB = ${AB} cm et BC = ${BC} cm. Calcule la longueur MN, en cm (arrondie au centième si nécessaire).`,
    figure: buildThalesFigure(ratio),
    answer: MN,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\dfrac{AM}{AB} = \\dfrac{MN}{BC}` },
      { type: "resultat", text: `MN = \\dfrac{${AM} \\times ${BC}}{${AB}} \\approx ${fr(MN)}` },
    ],
  };
}

// ---------- 3. Résoudre une proportion (forme algébrique du théorème) ----------
function genResoudreProportionThalesNumeric() {
  const a = randInt(2, 30);
  const b = randInt(2, 30);
  const c = randInt(2, 30);
  const x = roundTo((b * c) / a, 3);
  return {
    type: "numeric",
    chapter: "Théorème de Thalès — Calculer une longueur",
    prompt: `Sachant que \\(\\dfrac{${a}}{${b}} = \\dfrac{${c}}{x}\\), calcule x (arrondi au centième si nécessaire).`,
    answer: x,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `x = \\dfrac{${b} \\times ${c}}{${a}} \\approx ${fr(x)}` }],
  };
}

// ---------- 4. Quelle égalité de quotients utiliser ? ----------
function genFormeCorrecteEgaliteThalesQCM() {
  const AB = randInt(3, 15);
  const AM = randInt(2, AB - 1);
  const AC = randInt(3, 20);
  const correct = `\\dfrac{${AM}}{${AB}} = \\dfrac{AN}{${AC}}`;
  const wrong1 = `\\dfrac{${AB}}{${AM}} = \\dfrac{AN}{${AC}}`;
  const wrong2 = `\\dfrac{${AM}}{${AB}} = \\dfrac{${AC}}{AN}`;
  const wrong3 = `\\dfrac{${AM}}{${AC}} = \\dfrac{AN}{${AB}}`;
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])]);
  return {
    type: "qcm",
    chapter: "Théorème de Thalès — Calculer une longueur",
    prompt: `Dans un triangle ABC avec M sur [AB], N sur [AC], (MN) parallèle à (BC), AM = ${AM}, AB = ${AB}, AC = ${AC}. Quelle égalité de quotients permet de calculer AN d'après le théorème de Thalès ?`,
    answer: correct,
    options: options.length >= 2 ? options : [correct, wrong1],
    steps: [{ type: "regle", text: `D'après le théorème de Thalès : \\dfrac{AM}{AB} = \\dfrac{AN}{AC} = \\dfrac{MN}{BC}.` }],
  };
}

// =========================== Réciproque du théorème de Thalès ===========================

// ---------- 5. Les droites sont-elles parallèles ? (réciproque) ----------
function genReciproqueThalesParallelesQCM() {
  const q = randInt(2, 6);
  const p = randInt(1, q - 1);
  const AB = q * randInt(2, 8);
  const AC = q * randInt(2, 8);
  const AM = (AB * p) / q;
  const isParallel = Math.random() < 0.5;
  const AN = isParallel ? (AC * p) / q : (AC * p) / q + nonZero(1, 3);
  return {
    type: "qcm",
    chapter: "Théorème de Thalès — Réciproque",
    prompt: `Dans un triangle ABC, M appartient à [AB] et N appartient à [AC], avec AM = ${AM} cm, AB = ${AB} cm, AN = ${AN} cm et AC = ${AC} cm. Les droites (MN) et (BC) sont-elles parallèles ?`,
    answer: isParallel ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `\\dfrac{AM}{AB} = \\dfrac{${AM}}{${AB}}` },
      { type: "calcul", text: `\\dfrac{AN}{AC} = \\dfrac{${AN}}{${AC}}` },
      {
        type: "resultat",
        text: isParallel
          ? "Les quotients sont égaux : d'après la réciproque du théorème de Thalès, les droites sont parallèles."
          : "Les quotients sont différents : les droites ne sont pas parallèles.",
      },
    ],
  };
}

// ---------- 6. Les conditions d'application sont-elles vérifiées ? ----------
function genVerifierConditionsApplicationQCM() {
  const scenarios = [
    { desc: "M appartient au segment [AB], N appartient au segment [AC], et les droites (MN) et (BC) sont parallèles.", valid: true },
    { desc: "M appartient au segment [AB], N appartient au segment [AC], mais les droites (MN) et (BC) ne sont pas parallèles.", valid: false },
    { desc: "M appartient à la droite (AB) (mais pas forcément au segment [AB]), et les droites (MN) et (BC) sont parallèles.", valid: true },
    { desc: "Les droites (AB) et (AC) sont parallèles entre elles.", valid: false },
  ];
  const s = pick(scenarios);
  return {
    type: "qcm",
    chapter: "Théorème de Thalès — Réciproque",
    prompt: `${s.desc} Peut-on appliquer le théorème de Thalès (ou sa réciproque) dans cette configuration ?`,
    answer: s.valid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `Le théorème de Thalès s'applique lorsque les points sont alignés dans une configuration triangulaire (ou en papillon) avec deux droites parallèles.` }],
  };
}

// =========================== Problèmes ===========================

// ---------- 7. Agrandissement ou réduction (rapport des longueurs) ----------
function genRapportAgrandissementReductionThalesQCM() {
  let a = randInt(2, 20);
  let b = randInt(2, 20);
  while (a === b) b = randInt(2, 20);
  const answer = a < b ? "Réduction" : "Agrandissement";
  return {
    type: "qcm",
    chapter: "Théorème de Thalès — Problèmes",
    prompt: `Soit PRS un triangle tel que T appartient au côté [PR] et V appartient au côté [PS], avec les droites (TV) et (RS) parallèles. On donne PT = ${a} cm et PR = ${b} cm. Le triangle PTV est-il un agrandissement ou une réduction du triangle PRS ?`,
    answer,
    options: ["Agrandissement", "Réduction"],
    steps: [
      {
        type: "regle",
        text: `Le rapport PT/PR = ${fr(roundTo(a / b, 3))} ${a < b ? "< 1" : "> 1"} : c'est ${answer === "Réduction" ? "une réduction" : "un agrandissement"}.`,
      },
    ],
  };
}

// ---------- 8. Hauteur d'un immeuble par visée (configuration de Thalès) ----------
function genProblemeHauteurAvecViseeNumeric() {
  const hauteurArbre = randInt(3, 10);
  const distanceArbreImmeuble = randInt(20, 60);
  const reculArbre = randInt(2, 8);
  const hauteurYeux = roundTo(1.4 + Math.random() * 0.4, 2);
  const hauteurImmeubleMoinsYeux = roundTo(((hauteurArbre - hauteurYeux) * (distanceArbreImmeuble + reculArbre)) / reculArbre, 2);
  const hauteurImmeuble = roundTo(hauteurImmeubleMoinsYeux + hauteurYeux, 1);
  return {
    type: "numeric",
    chapter: "Théorème de Thalès — Problèmes",
    prompt: `Pour mesurer la hauteur d'un immeuble, une élève se place derrière un arbre de ${hauteurArbre} m de haut, situé à ${distanceArbreImmeuble} m de l'immeuble. Elle recule de ${reculArbre} m depuis l'arbre afin que son regard, situé à ${fr(hauteurYeux)} m du sol, soit aligné avec le sommet de l'arbre et le sommet de l'immeuble. Quelle est la hauteur de l'immeuble, en m (arrondie au dixième) ?`,
    answer: hauteurImmeuble,
    tolerance: 0.2,
    steps: [
      { type: "donnee", text: `\\dfrac{${reculArbre}}{${distanceArbreImmeuble} + ${reculArbre}} = \\dfrac{${fr(roundTo(hauteurArbre - hauteurYeux, 2))}}{h - ${fr(hauteurYeux)}}` },
      { type: "calcul", text: `h - ${fr(hauteurYeux)} \\approx ${fr(hauteurImmeubleMoinsYeux)}` },
      { type: "resultat", text: `h \\approx ${fr(hauteurImmeuble)}` },
    ],
  };
}

// ---------- 9. Longueur totale de corde d'un étendoir (configuration de Thalès répétée) ----------
function genProblemeCordesEtendoirNumeric() {
  const nSegments = randInt(6, 10);
  const BC = randInt(30, 80);
  const nStructures = randInt(2, 6);
  let total = 0;
  for (let i = 1; i <= nSegments - 1; i++) total += (i / nSegments) * BC;
  const totalPerStructure = roundTo(total, 2);
  const totalFinal = roundTo(totalPerStructure * nStructures, 2);
  return {
    type: "numeric",
    chapter: "Théorème de Thalès — Problèmes",
    prompt: `Un étendoir à linge est composé de ${nStructures} triangles identiques. Dans chaque triangle, les deux côtés égaux sont partagés en ${nSegments} segments de même longueur, et ${nSegments - 1} cordes parallèles à la base (de longueur ${BC} cm) sont tendues à chaque point de division. D'après le théorème de Thalès, quelle est la longueur totale de corde utilisée pour cet étendoir, en cm (arrondie au centième) ?`,
    answer: totalFinal,
    tolerance: 0.5,
    steps: [
      { type: "regle", text: `\\text{Chaque corde } i \\text{ mesure } \\dfrac{i}{${nSegments}} \\times ${BC}\\ \\text{cm}.` },
      { type: "calcul", text: `\\text{Somme pour un triangle} \\approx ${fr(totalPerStructure)}\\ \\text{cm}` },
      { type: "resultat", text: `${fr(totalPerStructure)} \\times ${nStructures} \\approx ${fr(totalFinal)}\\ \\text{cm}` },
    ],
  };
}

const GENERATORS = [
  genCalculerLongueurThalesANNumeric,
  genCalculerLongueurThalesMNNumeric,
  genResoudreProportionThalesNumeric,
  genFormeCorrecteEgaliteThalesQCM,
  genReciproqueThalesParallelesQCM,
  genVerifierConditionsApplicationQCM,
  genRapportAgrandissementReductionThalesQCM,
  genProblemeHauteurAvecViseeNumeric,
  genProblemeCordesEtendoirNumeric,
];

const DIFFICULTY = {
  genCalculerLongueurThalesANNumeric: "facile",
  genFormeCorrecteEgaliteThalesQCM: "facile",
  genCalculerLongueurThalesMNNumeric: "standard",
  genResoudreProportionThalesNumeric: "standard",
  genReciproqueThalesParallelesQCM: "standard",
  genVerifierConditionsApplicationQCM: "standard",
  genRapportAgrandissementReductionThalesQCM: "standard",
  genProblemeHauteurAvecViseeNumeric: "expert",
  genProblemeCordesEtendoirNumeric: "expert",
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
    id: "theoreme-thales",
    title: "Théorème de Thalès",
    description: "Calculer une longueur grâce au théorème de Thalès, utiliser la réciproque pour démontrer un parallélisme, problèmes contextualisés.",
    pourquoi: "Le théorème de Thalès permet de calculer une longueur inaccessible (une hauteur, une distance) sans la mesurer directement.",
    level: "quatrieme",
    free: false,
    order: 12,
  },
  generate,
};
