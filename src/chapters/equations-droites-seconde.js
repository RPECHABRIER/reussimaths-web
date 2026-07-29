// ---------------------------------------------------------------------------
// Chapitre : Équations de droites (2nde) — sous abonnement.
//
// Correspond au chapitre 8 du manuel de 2nde : équation cartésienne d'une
// droite (ax + by + c = 0), vecteur directeur associé (-b ; a), détermination
// d'une équation cartésienne à partir d'un point et d'un vecteur directeur ou
// de deux points, appartenance d'un point à une droite, droites verticales et
// horizontales, position relative de deux droites (sécantes, parallèles,
// confondues) via le déterminant, résolution de systèmes de deux équations à
// deux inconnues (substitution, combinaison linéaire), intersection de deux
// droites.
// La correction du livre du professeur (exercices 16-36 : vecteur directeur,
// équations cartésiennes, systèmes, intersections) a servi à identifier la
// méthode ; les nombres et noms de points sont générés aléatoirement à
// chaque tirage, en construisant les systèmes à l'envers depuis leur
// solution pour garantir des résultats entiers.
// Voir automatismes-seconde.js (thème "equations-droites-seconde") pour les
// mini-exercices "Calcul mental" associés.
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

function texCoeff(coeff, variable) {
  if (variable === "") return `${coeff}`;
  if (coeff === 1) return variable;
  if (coeff === -1) return `-${variable}`;
  return `${coeff}${variable}`;
}
function texTerme(coeff, variable) {
  if (coeff === 0) return "";
  const t = texCoeff(Math.abs(coeff), variable);
  return coeff > 0 ? ` + ${t}` : ` - ${t}`;
}
function texEquationCartesienne(a, b, c) {
  return `${texCoeff(a, "x")}${texTerme(b, "y")}${texTerme(c, "")} = 0`.replace(/\s+/g, " ").trim();
}

const nomsPoints = ["A", "B", "C", "D", "M", "N"];
function points2() {
  return shuffle(nomsPoints).slice(0, 2);
}

// ---------- 1. Vecteur directeur depuis une équation cartésienne ----------
function genVecteurDirecteurDepuisCartesienneNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = randInt(-9, 9);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Équations de droites — Vecteur directeur",
    prompt: `La droite (d) a pour équation cartésienne \\(${texEquationCartesienne(a, b, c)}\\). Un vecteur directeur de (d) a pour coordonnées \\((-b ; a)\\). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ce vecteur directeur ?`,
    answer: demanderAbscisse ? -b : a,
    steps: [demanderAbscisse ? `-b = -(${b}) = ${-b}` : `a = ${a}`],
  };
}

// ---------- 2. Équation cartésienne depuis un point et un vecteur directeur ----------
function genEquationCartesienneDepuisPointVecteurNumeric() {
  const [nomA] = points2();
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const dx = nonZero(-6, 6);
  const dy = nonZero(-6, 6);
  // Équation : dy*(x - xA) - dx*(y - yA) = 0, soit a = dy, b = -dx, c = -dy*xA + dx*yA.
  const a = dy;
  const b = -dx;
  const c = -dy * xA + dx * yA;
  return {
    type: "numeric",
    chapter: "Équations de droites — Équation cartésienne",
    prompt: `La droite (d) passe par ${nomA}(${xA} ; ${yA}) et admet \\(\\vec{u}(${dx} ; ${dy})\\) comme vecteur directeur. Son équation cartésienne s'écrit \\(${texCoeff(a, "x")}${texTerme(b, "y")} + c = 0\\). Détermine c.`,
    answer: c,
    steps: [`\\text{On utilise la colinéarité de } \\overrightarrow{${nomA}M}(x - ${xA} ; y - ${yA}) \\text{ et } \\vec{u}(${dx} ; ${dy}) :`, `${dy}(x - ${xA}) - ${dx}(y - ${yA}) = 0`, `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}y + c = 0 \\text{, avec } c = ${c}`],
  };
}

// ---------- 3. Équation cartésienne depuis deux points ----------
function genEquationCartesienneDepuisDeuxPointsNumeric() {
  const [nomA, nomB] = points2();
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const dx = nonZero(-6, 6);
  const dy = nonZero(-6, 6);
  const xB = xA + dx;
  const yB = yA + dy;
  const a = dy;
  const b = -dx;
  const c = -dy * xA + dx * yA;
  const demander = pick(["a", "b", "c"]);
  const answer = demander === "a" ? a : demander === "b" ? b : c;
  return {
    type: "numeric",
    chapter: "Équations de droites — Équation cartésienne",
    prompt: `La droite (${nomA}${nomB}) passe par ${nomA}(${xA} ; ${yA}) et ${nomB}(${xB} ; ${yB}). Son équation cartésienne s'écrit \\(ax + by + c = 0\\). Détermine ${demander}.`,
    answer,
    steps: [
      `\\overrightarrow{${nomA}${nomB}}(${dx} ; ${dy})`,
      `\\text{Équation : } ${dy}(x - ${xA}) - ${dx}(y - ${yA}) = 0`,
      `\\text{Soit } ${texEquationCartesienne(a, b, c)}`,
    ],
  };
}

// ---------- 4. Un point appartient-il à une droite cartésienne ? ----------
function genPointAppartientDroiteCartesienneQCM() {
  const [nomA] = points2();
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const c = -(a * xA + b * yA);
  const appartient = Math.random() < 0.5;
  const xTest = appartient ? xA : randInt(-8, 8);
  const yTest = appartient ? yA : (() => {
    let y = randInt(-8, 8);
    while (a * xTest + b * y + c === 0) y = randInt(-8, 8);
    return y;
  })();
  const valeur = a * xTest + b * yTest + c;
  const reponse = valeur === 0 ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Équations de droites — Équation cartésienne",
    prompt: `La droite (d) a pour équation \\(${texEquationCartesienne(a, b, c)}\\). Le point (${xTest} ; ${yTest}) appartient-il à (d) ?`,
    answer: reponse,
    options: ["Oui", "Non"],
    steps: [`${a} \\times ${xTest} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} \\times ${yTest} ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = ${valeur}`, reponse === "Oui" ? "Le résultat est nul : le point appartient à la droite." : "Le résultat n'est pas nul : le point n'appartient pas à la droite."],
  };
}

// ---------- 5. Droite verticale, horizontale, ou quelconque ? ----------
function genDroiteVerticaleHorizontaleQCM() {
  const type = pick(["verticale", "horizontale", "quelconque"]);
  const c = randInt(-9, 9);
  let a, b;
  if (type === "verticale") {
    a = nonZero(-9, 9);
    b = 0;
  } else if (type === "horizontale") {
    a = 0;
    b = nonZero(-9, 9);
  } else {
    a = nonZero(-9, 9);
    b = nonZero(-9, 9);
  }
  const equation = a === 0 ? `${texCoeff(b, "y")}${texTerme(c, "")} = 0` : b === 0 ? `${texCoeff(a, "x")}${texTerme(c, "")} = 0` : texEquationCartesienne(a, b, c);
  return {
    type: "qcm",
    chapter: "Équations de droites — Droites particulières",
    prompt: `La droite (d) a pour équation \\(${equation}\\). Cette droite est-elle verticale, horizontale, ou ni l'une ni l'autre ?`,
    answer: type === "quelconque" ? "ni l'une ni l'autre" : type,
    options: ["verticale", "horizontale", "ni l'une ni l'autre"],
    steps: [
      type === "verticale"
        ? "Le coefficient de y est nul : la droite est parallèle à l'axe des ordonnées, elle est verticale."
        : type === "horizontale"
          ? "Le coefficient de x est nul : la droite est parallèle à l'axe des abscisses, elle est horizontale."
          : "Les coefficients de x et de y sont tous les deux non nuls : la droite n'est ni verticale ni horizontale.",
    ],
  };
}

// ---------- 6. Équation d'une droite verticale ou horizontale passant par un point ----------
function genEquationDroiteVerticaleHorizontaleNumeric() {
  const [nomA] = points2();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const verticale = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Équations de droites — Droites particulières",
    prompt: `Détermine ${verticale ? "l'abscisse commune des points" : "l'ordonnée commune des points"} de la droite ${verticale ? "verticale" : "horizontale"} passant par ${nomA}(${xA} ; ${yA}).`,
    answer: verticale ? xA : yA,
    steps: [verticale ? `\\text{La droite verticale passant par } ${nomA} \\text{ a pour équation } x = ${xA}.` : `\\text{La droite horizontale passant par } ${nomA} \\text{ a pour équation } y = ${yA}.`],
  };
}

// ---------- 7. Un vecteur est-il un vecteur directeur d'une droite cartésienne ? ----------
function genVecteurDirecteurValideQCM() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const c = randInt(-8, 8);
  const estDirecteur = Math.random() < 0.5;
  const k = nonZero(-3, 3);
  const dx = estDirecteur ? k * -b : k * -b + nonZero(1, 3);
  const dy = k * a;
  const det = a * dy - b * dx;
  return {
    type: "qcm",
    chapter: "Équations de droites — Vecteur directeur",
    prompt: `La droite (d) a pour équation \\(${texEquationCartesienne(a, b, c)}\\). Le vecteur \\(\\vec{w}(${dx} ; ${dy})\\) est-il un vecteur directeur de (d) ?`,
    answer: det === 0 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`\\text{Un vecteur directeur de (d) est } (-b ; a) = (${-b} ; ${a})`, `\\det = ${a} \\times ${dy} - ${b} \\times ${dx} = ${det}`, det === 0 ? "Le déterminant est nul : c'est un vecteur directeur." : "Le déterminant n'est pas nul : ce n'est pas un vecteur directeur."],
  };
}

// ---------- 8. Position relative de deux droites cartésiennes ----------
function genPositionRelativeDroitesQCM() {
  const a1 = nonZero(-7, 7);
  const b1 = nonZero(-7, 7);
  const c1 = randInt(-7, 7);
  const cas = pick(["sécantes", "parallèles", "confondues"]);
  const k = nonZero(-3, 3);
  let a2, b2, c2;
  if (cas === "confondues") {
    a2 = k * a1;
    b2 = k * b1;
    c2 = k * c1;
  } else if (cas === "parallèles") {
    a2 = k * a1;
    b2 = k * b1;
    c2 = k * c1 + nonZero(1, 4);
  } else {
    a2 = nonZero(-7, 7);
    b2 = nonZero(-7, 7);
    c2 = randInt(-7, 7);
  }
  const det = a1 * b2 - a2 * b1;
  const reponseFinale = det !== 0 ? "sécantes" : a2 * c1 === a1 * c2 && b2 * c1 === b1 * c2 ? "confondues" : "parallèles";
  return {
    type: "qcm",
    chapter: "Équations de droites — Position relative de deux droites",
    prompt: `(d) : \\(${texEquationCartesienne(a1, b1, c1)}\\). (d') : \\(${texEquationCartesienne(a2, b2, c2)}\\). Quelle est la position relative de (d) et (d') ?`,
    answer: reponseFinale,
    options: ["sécantes", "parallèles", "confondues"],
    steps: [`\\det = ${a1} \\times ${b2} - ${a2} \\times ${b1} = ${det}`, reponseFinale === "sécantes" ? "Le déterminant n'est pas nul : les droites sont sécantes." : reponseFinale === "confondues" ? "Le déterminant est nul et les deux équations sont proportionnelles : les droites sont confondues." : "Le déterminant est nul mais les équations ne sont pas proportionnelles : les droites sont strictement parallèles."],
  };
}

// ---------- 9. Résoudre un système par substitution ----------
function genResoudreSystemeSubstitutionNumeric() {
  const xSol = randInt(-8, 8);
  const ySol = randInt(-8, 8);
  const a1 = 1;
  const b1 = nonZero(-6, 6);
  const c1 = a1 * xSol + b1 * ySol;
  const a2 = nonZero(-6, 6);
  const b2 = nonZero(-6, 6);
  const c2 = a2 * xSol + b2 * ySol;
  const demanderX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Équations de droites — Systèmes d'équations",
    prompt: `Résous le système \\(\\begin{cases} ${texCoeff(a1, "x")}${texTerme(b1, "y")} = ${c1} \\\\ ${texCoeff(a2, "x")}${texTerme(b2, "y")} = ${c2} \\end{cases}\\) et donne la valeur de ${demanderX ? "x" : "y"}.`,
    answer: demanderX ? xSol : ySol,
    steps: [`\\text{De la première équation : } x = ${c1} ${b1 >= 0 ? "-" : "+"} ${Math.abs(b1)}y`, `\\text{En substituant dans la deuxième équation, on trouve } y = ${ySol} \\text{ puis } x = ${xSol}.`],
  };
}

// ---------- 10. Résoudre un système par combinaison linéaire ----------
function genResoudreSystemeCombinaisonNumeric() {
  const xSol = randInt(-8, 8);
  const ySol = randInt(-8, 8);
  const a1 = nonZero(-6, 6);
  const b1 = nonZero(-6, 6);
  const c1 = a1 * xSol + b1 * ySol;
  const a2 = nonZero(-6, 6);
  const b2 = nonZero(-6, 6);
  const c2 = a2 * xSol + b2 * ySol;
  const demanderX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Équations de droites — Systèmes d'équations",
    prompt: `Résous le système \\(\\begin{cases} ${texCoeff(a1, "x")}${texTerme(b1, "y")} = ${c1} \\\\ ${texCoeff(a2, "x")}${texTerme(b2, "y")} = ${c2} \\end{cases}\\) et donne la valeur de ${demanderX ? "x" : "y"}.`,
    answer: demanderX ? xSol : ySol,
    steps: [`\\text{En combinant les deux équations pour éliminer une inconnue, on trouve } x = ${xSol} \\text{ et } y = ${ySol}.`],
  };
}

// ---------- 11. Point d'intersection de deux droites cartésiennes ----------
function genIntersectionDeuxDroitesNumeric() {
  const xSol = randInt(-8, 8);
  const ySol = randInt(-8, 8);
  const a1 = nonZero(-6, 6);
  const b1 = nonZero(-6, 6);
  const c1 = -(a1 * xSol + b1 * ySol);
  let a2 = nonZero(-6, 6);
  let b2 = nonZero(-6, 6);
  while (a1 * b2 - a2 * b1 === 0) {
    a2 = nonZero(-6, 6);
    b2 = nonZero(-6, 6);
  }
  const c2 = -(a2 * xSol + b2 * ySol);
  const demanderX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Équations de droites — Intersection de deux droites",
    prompt: `(d) : \\(${texEquationCartesienne(a1, b1, c1)}\\). (d') : \\(${texEquationCartesienne(a2, b2, c2)}\\). Détermine ${demanderX ? "l'abscisse" : "l'ordonnée"} du point d'intersection de (d) et (d').`,
    answer: demanderX ? xSol : ySol,
    steps: [`\\text{En résolvant le système formé par les deux équations, on trouve } x = ${xSol} \\text{ et } y = ${ySol}.`],
  };
}

// ---------- 12. Convertir une équation cartésienne en équation réduite ----------
function genConvertirCartesienneVersReduiteQCM() {
  const pente = nonZero(-6, 6);
  const ordonneeOrigine = randInt(-8, 8);
  // Équation réduite : y = pente*x + ordonneeOrigine, soit cartésienne : pente*x - y + ordonneeOrigine = 0.
  const a = pente;
  const b = -1;
  const c = ordonneeOrigine;
  const bonneReponse = `y = ${texCoeff(pente, "x")}${texTerme(ordonneeOrigine, "")}`;
  const mauvaise1 = `y = ${texCoeff(-pente, "x")}${texTerme(ordonneeOrigine, "")}`;
  const mauvaise2 = `y = ${texCoeff(pente, "x")}${texTerme(-ordonneeOrigine, "")}`;
  const optionsSet = new Set([bonneReponse, mauvaise1]);
  if (optionsSet.size < 3) optionsSet.add(`y = ${texCoeff(pente, "x")}${texTerme(ordonneeOrigine + nonZero(1, 4), "")}`);
  else optionsSet.add(mauvaise2);
  return {
    type: "qcm",
    chapter: "Équations de droites — Équation réduite",
    prompt: `La droite (d) a pour équation cartésienne \\(${texEquationCartesienne(a, b, c)}\\). Quelle est son équation réduite (de la forme \\(y = mx + p\\)) ?`,
    answer: bonneReponse,
    options: shuffle([...optionsSet]),
    steps: [`${texCoeff(a, "x")} - y + ${c} = 0 \\iff y = ${a}x + ${c}`],
  };
}

// ---------- 13. Convertir une équation réduite en équation cartésienne ----------
function genConvertirReduiteVersCartesienneNumeric() {
  const pente = nonZero(-8, 8);
  const ordonneeOrigine = randInt(-9, 9);
  const demander = pick(["a", "b", "c"]);
  // y = pente*x + ordonneeOrigine ⟺ pente*x - y + ordonneeOrigine = 0, soit a = pente, b = -1, c = ordonneeOrigine.
  const a = pente;
  const b = -1;
  const c = ordonneeOrigine;
  const answer = demander === "a" ? a : demander === "b" ? b : c;
  return {
    type: "numeric",
    chapter: "Équations de droites — Équation réduite",
    prompt: `La droite (d) a pour équation réduite \\(y = ${texCoeff(pente, "x")}${texTerme(ordonneeOrigine, "")}\\). Son équation cartésienne s'écrit \\(ax + by + c = 0\\). Détermine ${demander} (avec \\(b = -1\\)).`,
    answer,
    steps: [`y = ${pente}x ${ordonneeOrigine >= 0 ? "+" : "-"} ${Math.abs(ordonneeOrigine)} \\iff ${pente}x - y ${ordonneeOrigine >= 0 ? "+" : "-"} ${Math.abs(ordonneeOrigine)} = 0`],
  };
}

// ---------- 14. Nombre de solutions d'un système (position relative) ----------
function genNombreSolutionsSystemeQCM() {
  const a1 = nonZero(-7, 7);
  const b1 = nonZero(-7, 7);
  const c1 = randInt(-7, 7);
  const cas = pick(["une seule solution", "aucune solution", "une infinité de solutions"]);
  const k = nonZero(-3, 3);
  let a2, b2, c2;
  if (cas === "une infinité de solutions") {
    a2 = k * a1;
    b2 = k * b1;
    c2 = k * c1;
  } else if (cas === "aucune solution") {
    a2 = k * a1;
    b2 = k * b1;
    c2 = k * c1 + nonZero(1, 4);
  } else {
    a2 = nonZero(-7, 7);
    b2 = nonZero(-7, 7);
    c2 = randInt(-7, 7);
  }
  const det = a1 * b2 - a2 * b1;
  const reponseFinale = det !== 0 ? "une seule solution" : a2 * c1 === a1 * c2 && b2 * c1 === b1 * c2 ? "une infinité de solutions" : "aucune solution";
  return {
    type: "qcm",
    chapter: "Équations de droites — Systèmes d'équations",
    prompt: `Le système \\(\\begin{cases} ${texCoeff(a1, "x")}${texTerme(b1, "y")} = ${c1} \\\\ ${texCoeff(a2, "x")}${texTerme(b2, "y")} = ${c2} \\end{cases}\\) admet-il une seule solution, aucune solution, ou une infinité de solutions ?`,
    answer: reponseFinale,
    options: ["une seule solution", "aucune solution", "une infinité de solutions"],
    steps: [reponseFinale === "une seule solution" ? "Les deux droites associées sont sécantes : une seule solution." : reponseFinale === "aucune solution" ? "Les deux droites associées sont strictement parallèles : aucune solution." : "Les deux équations sont proportionnelles (droites confondues) : une infinité de solutions."],
  };
}

// ---------- 15. Vérifier un vecteur directeur par colinéarité (avec deux points) ----------
function genVecteurDirecteurDepuisDeuxPointsQCM() {
  const [nomA, nomB] = points2();
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const dx = nonZero(-6, 6);
  const dy = nonZero(-6, 6);
  const xB = xA + dx;
  const yB = yA + dy;
  const estDirecteur = Math.random() < 0.5;
  const k = nonZero(-3, 3);
  const wx = estDirecteur ? k * dx : k * dx + nonZero(1, 3);
  const wy = k * dy;
  const det = dx * wy - dy * wx;
  return {
    type: "qcm",
    chapter: "Équations de droites — Vecteur directeur",
    prompt: `La droite (${nomA}${nomB}) passe par ${nomA}(${xA} ; ${yA}) et ${nomB}(${xB} ; ${yB}). Le vecteur \\(\\vec{w}(${wx} ; ${wy})\\) est-il un vecteur directeur de (${nomA}${nomB}) ?`,
    answer: det === 0 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`\\overrightarrow{${nomA}${nomB}}(${dx} ; ${dy})`, `\\det(\\overrightarrow{${nomA}${nomB}}, \\vec{w}) = ${dx} \\times ${wy} - ${dy} \\times ${wx} = ${det}`, det === 0 ? "Le déterminant est nul : c'est un vecteur directeur." : "Le déterminant n'est pas nul : ce n'est pas un vecteur directeur."],
  };
}

const GENERATORS = [
  genVecteurDirecteurDepuisCartesienneNumeric,
  genEquationCartesienneDepuisPointVecteurNumeric,
  genEquationCartesienneDepuisDeuxPointsNumeric,
  genPointAppartientDroiteCartesienneQCM,
  genDroiteVerticaleHorizontaleQCM,
  genEquationDroiteVerticaleHorizontaleNumeric,
  genVecteurDirecteurValideQCM,
  genPositionRelativeDroitesQCM,
  genResoudreSystemeSubstitutionNumeric,
  genResoudreSystemeCombinaisonNumeric,
  genIntersectionDeuxDroitesNumeric,
  genConvertirCartesienneVersReduiteQCM,
  genConvertirReduiteVersCartesienneNumeric,
  genNombreSolutionsSystemeQCM,
  genVecteurDirecteurDepuisDeuxPointsQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "equations-droites-seconde",
    title: "Équations de droites",
    description: "Équation cartésienne d'une droite, vecteur directeur, position relative de deux droites, systèmes de deux équations à deux inconnues, intersection de droites, équation réduite.",
    level: "seconde",
    free: false,
    order: 10,
  },
  generate,
};
