// ---------------------------------------------------------------------------
// Chapitre : Théorème de Thalès et triangles semblables (3e) — sous abonnement.
//
// Correspond au chapitre 10 du manuel de 3e : théorème de Thalès (calculer
// une longueur à partir d'une configuration en triangle ou en papillon,
// résoudre une équation issue d'une configuration de Thalès), réciproque du
// théorème de Thalès (vérifier l'alignement des points et l'égalité des
// rapports pour conclure au parallélisme), agrandissement et réduction
// (coefficient, longueur transformée, périmètre proportionnel au coefficient,
// aire proportionnelle au carré du coefficient), et triangles semblables
// (reconnaître via les angles ou via l'égalité des rapports des côtés).
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "thales-triangles-semblables-troisieme")
// pour les mini-exercices "Calcul mental" associés.
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

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

// =========================== Le théorème de Thalès ===========================

// ---------- 1. Calculer une longueur (configuration triangle) ----------
function genThalesCalculerLongueurNumeric() {
  const k = roundTo(randInt(5, 30) / 10, 1);
  const AB = randInt(3, 12);
  const AC = randInt(3, 12);
  const AM = roundTo(AB * k, 1);
  const AN = roundTo(AC * k, 1);
  const askAM = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Thalès et triangles semblables — Le théorème de Thalès",
    prompt: `Dans un triangle ABC, les points M et N appartiennent respectivement aux droites (AB) et (AC), avec (MN) parallèle à (BC). On donne AB = ${AB} cm, AC = ${AC} cm et ${askAM ? `AN = ${fr(AN)} cm` : `AM = ${fr(AM)} cm`}. D'après le théorème de Thalès, calcule ${askAM ? "AM" : "AN"} (en cm).`,
    answer: askAM ? AM : AN,
    tolerance: 0.05,
    steps: [
      { type: "regle", text: `\\dfrac{AM}{AB} = \\dfrac{AN}{AC}` },
      { type: "resultat", text: askAM ? `AM = \\dfrac{AB \\times AN}{AC} = \\dfrac{${AB} \\times ${fr(AN)}}{${AC}} = ${fr(AM)}` : `AN = \\dfrac{AC \\times AM}{AB} = \\dfrac{${AC} \\times ${fr(AM)}}{${AB}} = ${fr(AN)}` },
    ],
  };
}

// ---------- 2. Calculer la troisième longueur (MN) ----------
function genThalesTroisiemeLongueurNumeric() {
  const k = roundTo(randInt(2, 8) / 10, 1);
  const AB = randInt(4, 12);
  const BC = randInt(4, 16);
  const AM = roundTo(AB * k, 2);
  const MN = roundTo(BC * k, 2);
  return {
    type: "numeric",
    chapter: "Thalès et triangles semblables — Le théorème de Thalès",
    prompt: `Dans un triangle ABC, M appartient à (AB), N appartient à (AC), et (MN) est parallèle à (BC). On donne AB = ${AB} cm, AM = ${fr(AM)} cm et BC = ${BC} cm. Calcule MN (en cm, arrondi au centième si besoin).`,
    answer: MN,
    tolerance: 0.02,
    steps: [
      { type: "regle", text: `\\dfrac{AM}{AB} = \\dfrac{MN}{BC}` },
      { type: "resultat", text: `MN = \\dfrac{${fr(AM)} \\times ${BC}}{${AB}} \\approx ${fr(MN)}` },
    ],
  };
}

// ---------- 3. Résoudre une équation issue d'une configuration de Thalès ----------
function genThalesEquationNumeric() {
  // Construction garantissant une solution exacte : (x + xSol) / den1 = (m x) / den2,
  // avec b = xSol et den2 = den1 * m / 2 (den1 choisi pair pour que den2 soit entier).
  const xSol = randInt(2, 12);
  const m = randInt(2, 6);
  const den1 = 2 * randInt(3, 8);
  const den2 = (den1 * m) / 2;
  return {
    type: "numeric",
    chapter: "Thalès et triangles semblables — Le théorème de Thalès",
    prompt: `Une configuration de Thalès donne l'égalité \\(\\dfrac{x + ${xSol}}{${den1}} = \\dfrac{${m}x}{${den2}}\\). Résous cette équation pour trouver x.`,
    answer: xSol,
    steps: [
      { type: "regle", text: `\\text{Dans une égalité de fractions } \\dfrac{a}{b} = \\dfrac{c}{d}, \\text{ on peut effectuer un produit en croix : } a \\times d = b \\times c.` },
      { type: "calcul", text: `${den2} \\times (x + ${xSol}) = ${m} \\times ${den1} \\times x` },
      { type: "calcul", text: `${den2}x + ${den2 * xSol} = ${m * den1}x` },
      { type: "calcul", text: `${den2 * xSol} = ${m * den1 - den2}x` },
      { type: "resultat", text: `x = ${xSol}` },
    ],
  };
}

// =========================== Réciproque et parallélisme ===========================

// ---------- 4. Vérifier l'alignement des points (condition de la réciproque) ----------
function genVerifierAlignementQCM() {
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const [c1, c2] = shuffle(["(AM)", "(AB)"]).slice(0, 2);
  const aligned = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Thalès et triangles semblables — Réciproque et parallélisme",
    prompt: aligned
      ? `${p1} affirme que les points A, M et B sont alignés dans cet ordre, et que les points A, N et C sont alignés dans cet ordre. Peut-on essayer d'appliquer la réciproque du théorème de Thalès pour prouver que (MN) et (BC) sont parallèles ?`
      : `${p1} affirme que les points M, A et B ne sont pas alignés (M n'est pas sur la droite (AB)). Peut-on appliquer la réciproque du théorème de Thalès dans cette configuration ?`,
    answer: aligned ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `Rappel : pour appliquer la réciproque du théorème de Thalès, il faut que les points soient alignés dans le même ordre sur chaque droite.` },
      { type: "resultat", text: aligned ? `C'est bien le cas ici : on peut appliquer la réciproque.` : `Ce n'est pas le cas ici : on ne peut pas appliquer la réciproque.` },
    ],
  };
}

// ---------- 5. Réciproque de Thalès : les droites sont-elles parallèles ? ----------
function genReciproqueThalesRapportsQCM() {
  const AB = randInt(4, 12);
  const AC = randInt(4, 12);
  const k = roundTo(randInt(2, 8) / 10, 2);
  const parallele = Math.random() < 0.5;
  const AM = roundTo(AB * k, 2);
  const AN = parallele ? roundTo(AC * k, 2) : roundTo(AC * k + nonZero(-1, 1) * randInt(1, 2) * 0.3, 2);
  const rapport1 = roundTo(AM / AB, 3);
  const rapport2 = roundTo(AN / AC, 3);
  const answer = Math.abs(rapport1 - rapport2) < 0.001 ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Thalès et triangles semblables — Réciproque et parallélisme",
    prompt: `Dans un triangle ABC, M appartient au segment [AB] et N appartient au segment [AC], avec les points A, M, B alignés dans cet ordre et A, N, C alignés dans cet ordre. On donne AB = ${AB} cm, AM = ${fr(AM)} cm, AC = ${AC} cm et AN = ${fr(AN)} cm. Les droites (MN) et (BC) sont-elles parallèles ?`,
    answer,
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `\\dfrac{AM}{AB} = \\dfrac{${fr(AM)}}{${AB}} \\approx ${fr(rapport1)}` },
      { type: "calcul", text: `\\dfrac{AN}{AC} = \\dfrac{${fr(AN)}}{${AC}} \\approx ${fr(rapport2)}` },
      { type: "resultat", text: answer === "Oui" ? `Les rapports sont égaux : d'après la réciproque du théorème de Thalès, (MN) et (BC) sont parallèles.` : `Les rapports ne sont pas égaux : (MN) et (BC) ne sont pas parallèles.` },
    ],
  };
}

// =========================== Agrandissement, réduction et triangles semblables ===========================

// ---------- 6. Coefficient d'agrandissement ou de réduction ----------
function genCoefficientAgrandissementNumeric() {
  const cote1 = randInt(2, 10);
  const k = roundTo(randInt(2, 40) / 10, 1);
  const cote2 = roundTo(cote1 * k, 1);
  return {
    type: "numeric",
    chapter: "Thalès et triangles semblables — Agrandissement, réduction",
    prompt: `Un triangle a un côté de ${cote1} cm. Sur une figure agrandie ou réduite à partir de ce triangle, le côté correspondant mesure ${fr(cote2)} cm. Quel est le coefficient d'agrandissement ou de réduction ?`,
    answer: k,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `k = \\dfrac{${fr(cote2)}}{${cote1}} = ${fr(k)}` }],
  };
}

// ---------- 7. Identifier agrandissement, réduction ou reproduction à l'identique ----------
function genIdentifierAgrandissementReductionQCM() {
  const k = pick([roundTo(randInt(11, 40) / 10, 1), roundTo(randInt(2, 9) / 10, 1), 1]);
  let answer;
  if (k > 1) answer = "Agrandissement";
  else if (k < 1) answer = "Réduction";
  else answer = "Reproduction à l'identique";
  return {
    type: "qcm",
    chapter: "Thalès et triangles semblables — Agrandissement, réduction",
    prompt: `Une figure est transformée avec un coefficient de ${fr(k)}. S'agit-il d'un agrandissement, d'une réduction, ou d'une reproduction à l'identique ?`,
    answer,
    options: ["Agrandissement", "Réduction", "Reproduction à l'identique"],
    steps: [
      { type: "regle", text: k > 1 ? `Le coefficient est supérieur à 1 : c'est un agrandissement.` : k < 1 ? `Le coefficient est inférieur à 1 : c'est une réduction.` : `Le coefficient est égal à 1 : la figure ne change pas de taille.` },
    ],
  };
}

// ---------- 8. Longueur après agrandissement/réduction ----------
function genLongueurApresAgrandissementNumeric() {
  const longueur = randInt(2, 20);
  const k = roundTo(randInt(2, 40) / 10, 1);
  const answer = roundTo(longueur * k, 2);
  return {
    type: "numeric",
    chapter: "Thalès et triangles semblables — Agrandissement, réduction",
    prompt: `Une figure de ${longueur} cm de long est transformée avec un coefficient de ${fr(k)}. Quelle est la longueur correspondante sur la figure transformée (en cm) ?`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `${longueur} \\times ${fr(k)} = ${fr(answer)}` }],
  };
}

// ---------- 9. Périmètre après agrandissement/réduction ----------
function genPerimetreApresAgrandissementNumeric() {
  const perimetre = randInt(10, 60);
  const k = roundTo(randInt(2, 40) / 10, 1);
  const answer = roundTo(perimetre * k, 2);
  return {
    type: "numeric",
    chapter: "Thalès et triangles semblables — Agrandissement, réduction",
    prompt: `Un triangle a un périmètre de ${perimetre} cm. On l'agrandit ou on le réduit avec un coefficient de ${fr(k)}. Quel est le périmètre du triangle obtenu (en cm) ?`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `Le périmètre est multiplié par le coefficient : ${perimetre} \\times ${fr(k)} = ${fr(answer)}` }],
  };
}

// ---------- 10. Aire après agrandissement/réduction (coefficient au carré) ----------
function genAireApresAgrandissementNumeric() {
  const aire = randInt(4, 50);
  const k = pick([2, 3, 0.5, 1.5, 4, 0.25]);
  const answer = roundTo(aire * k * k, 2);
  return {
    type: "numeric",
    chapter: "Thalès et triangles semblables — Agrandissement, réduction",
    prompt: `Une figure a une aire de ${aire} cm². On l'agrandit (ou on la réduit) avec un coefficient de ${fr(k)}. Quelle est l'aire de la figure obtenue (en cm²) ?`,
    answer,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `L'aire est multipliée par le carré du coefficient : ${aire} \\times ${fr(k)}^2 = ${aire} \\times ${fr(roundTo(k * k, 3))} = ${fr(answer)}` }],
  };
}

// ---------- 11. Coefficient réciproque ----------
function genCoefficientReciproqueNumeric() {
  const k = pick([2, 4, 5, 10, 0.5, 0.25, 0.2, 0.1]);
  const answer = roundTo(1 / k, 3);
  return {
    type: "numeric",
    chapter: "Thalès et triangles semblables — Agrandissement, réduction",
    prompt: `Une figure B est obtenue à partir d'une figure A avec un coefficient de ${fr(k)}. Quel coefficient permet de repasser de la figure B à la figure A ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `\\text{Coefficient réciproque} = \\dfrac{1}{${fr(k)}} = ${fr(answer)}` }],
  };
}

// ---------- 12. Troisième angle d'un triangle ----------
function genTroisiemeAngleTriangleNumeric() {
  const a1 = randInt(20, 90);
  const a2 = randInt(20, 90 - (a1 > 90 ? 0 : 0));
  const a3 = 180 - a1 - a2;
  if (a3 <= 5) return genTroisiemeAngleTriangleNumeric();
  return {
    type: "numeric",
    chapter: "Thalès et triangles semblables — Agrandissement, réduction",
    prompt: `Dans un triangle, deux angles mesurent ${a1}° et ${a2}°. Calcule la mesure du troisième angle.`,
    answer: a3,
    steps: [
      { type: "regle", text: `\\text{La somme des angles d'un triangle vaut toujours } 180°.` },
      { type: "calcul", text: `180 - ${a1} - ${a2} = ${a3}` },
    ],
  };
}

// ---------- 13. Triangles semblables : reconnaître via les angles ----------
function genTrianglesSemblablesAnglesQCM() {
  const a1 = randInt(20, 100);
  const a2 = randInt(20, 150 - a1);
  const a3 = 180 - a1 - a2;
  const semblables = Math.random() < 0.5;
  let b1, b2;
  if (semblables) {
    [b1, b2] = shuffle([a1, a2, a3]).slice(0, 2);
  } else {
    b1 = a1 + randInt(5, 15);
    b2 = a2 + randInt(5, 15);
    if (b1 + b2 >= 175) {
      b1 = Math.max(10, a1 - randInt(5, 15));
      b2 = Math.max(10, a2 - randInt(5, 15));
    }
  }
  const b3 = 180 - b1 - b2;
  const answer = semblables ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Thalès et triangles semblables — Agrandissement, réduction",
    prompt: `Un triangle ABC a des angles de ${a1}°, ${a2}° et ${a3}°. Un triangle DEF a des angles de ${b1}°, ${b2}° et ${b3}°. Ces deux triangles sont-ils semblables ?`,
    answer,
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `Rappel : deux triangles sont semblables si leurs angles sont deux à deux égaux (dans un ordre correspondant).` },
      { type: "resultat", text: semblables ? `Les angles de DEF (${b1}°, ${b2}°, ${b3}°) sont bien les mêmes que ceux de ABC : les triangles sont semblables.` : `Les angles de DEF (${b1}°, ${b2}°, ${b3}°) ne correspondent pas à ceux de ABC (${a1}°, ${a2}°, ${a3}°) : les triangles ne sont pas semblables.` },
    ],
  };
}

// ---------- 14. Triangles semblables : reconnaître via les rapports des côtés ----------
function genTrianglesSemblablesRapportsQCM() {
  const c1 = randInt(2, 8);
  const c2 = randInt(2, 8);
  const c3 = randInt(2, 8);
  const k = roundTo(randInt(11, 30) / 10, 1);
  const semblables = Math.random() < 0.5;
  const d1 = roundTo(c1 * k, 1);
  const d2 = roundTo(c2 * k, 1);
  const d3 = semblables ? roundTo(c3 * k, 1) : roundTo(c3 * k + randInt(1, 2), 1);
  const r1 = roundTo(d1 / c1, 3);
  const r2 = roundTo(d2 / c2, 3);
  const r3 = roundTo(d3 / c3, 3);
  const answer = Math.abs(r1 - r2) < 0.001 && Math.abs(r2 - r3) < 0.001 ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Thalès et triangles semblables — Agrandissement, réduction",
    prompt: `Un triangle ABC a pour côtés ${c1} cm, ${c2} cm et ${c3} cm. Un triangle DEF a pour côtés ${fr(d1)} cm, ${fr(d2)} cm et ${fr(d3)} cm (dans le même ordre de correspondance). Ces deux triangles sont-ils semblables ?`,
    answer,
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `\\dfrac{${fr(d1)}}{${c1}} \\approx ${fr(r1)}, \\ \\dfrac{${fr(d2)}}{${c2}} \\approx ${fr(r2)}, \\ \\dfrac{${fr(d3)}}{${c3}} \\approx ${fr(r3)}` },
      { type: "resultat", text: answer === "Oui" ? `Les trois rapports sont égaux : les triangles sont semblables.` : `Les trois rapports ne sont pas tous égaux : les triangles ne sont pas semblables.` },
    ],
  };
}

// ---------- 15. Configuration papillon (droites sécantes) ----------
function genThalesPapillonNumeric() {
  const k = roundTo(randInt(3, 25) / 10, 2);
  const DA = randInt(3, 12);
  const DB = randInt(3, 12);
  const AB = randInt(4, 15);
  const DF = roundTo(DA * k, 2);
  const DE = roundTo(DB * k, 2);
  const EF = roundTo(AB * k, 2);
  const askDF = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Thalès et triangles semblables — Le théorème de Thalès",
    prompt: `Les droites (AE) et (BF) sont sécantes en D, avec (AB) parallèle à (EF). On donne DA = ${DA} cm, DB = ${DB} cm, AB = ${AB} cm et ${askDF ? `DE = ${fr(DE)} cm` : `DF = ${fr(DF)} cm`}. D'après le théorème de Thalès, calcule ${askDF ? "DF" : "DE"} (en cm).`,
    answer: askDF ? DF : DE,
    tolerance: 0.05,
    steps: [
      { type: "regle", text: `\\dfrac{DA}{DF} = \\dfrac{DB}{DE} = \\dfrac{AB}{EF}` },
      { type: "calcul", text: `\\text{Coefficient} = \\dfrac{EF}{AB} = ${fr(k)}` },
      { type: "resultat", text: askDF ? `DF = DA \\times ${fr(k)} = ${fr(DF)}` : `DE = DB \\times ${fr(k)} = ${fr(DE)}` },
    ],
  };
}

const GENERATORS = [
  genThalesCalculerLongueurNumeric,
  genThalesTroisiemeLongueurNumeric,
  genThalesEquationNumeric,
  genVerifierAlignementQCM,
  genReciproqueThalesRapportsQCM,
  genCoefficientAgrandissementNumeric,
  genIdentifierAgrandissementReductionQCM,
  genLongueurApresAgrandissementNumeric,
  genPerimetreApresAgrandissementNumeric,
  genAireApresAgrandissementNumeric,
  genCoefficientReciproqueNumeric,
  genTroisiemeAngleTriangleNumeric,
  genTrianglesSemblablesAnglesQCM,
  genTrianglesSemblablesRapportsQCM,
  genThalesPapillonNumeric,
];

const DIFFICULTY = {
  genThalesCalculerLongueurNumeric: "facile",
  genCoefficientAgrandissementNumeric: "facile",
  genIdentifierAgrandissementReductionQCM: "facile",
  genLongueurApresAgrandissementNumeric: "facile",
  genTroisiemeAngleTriangleNumeric: "facile",
  genThalesTroisiemeLongueurNumeric: "standard",
  genThalesEquationNumeric: "standard",
  genVerifierAlignementQCM: "standard",
  genReciproqueThalesRapportsQCM: "standard",
  genPerimetreApresAgrandissementNumeric: "standard",
  genAireApresAgrandissementNumeric: "standard",
  genCoefficientReciproqueNumeric: "standard",
  genTrianglesSemblablesAnglesQCM: "standard",
  genTrianglesSemblablesRapportsQCM: "expert",
  genThalesPapillonNumeric: "expert",
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
    id: "thales-triangles-semblables-troisieme",
    title: "Théorème de Thalès et triangles semblables",
    description: "Théorème de Thalès (configurations triangle et papillon), réciproque et parallélisme, agrandissement/réduction (longueur, périmètre, aire) et reconnaissance de triangles semblables.",
    pourquoi: "Le théorème de Thalès permet de calculer une hauteur ou une distance inaccessible (un arbre, un bâtiment) sans la mesurer directement.",
    level: "troisieme",
    free: false,
    order: 11,
  },
  generate,
};
