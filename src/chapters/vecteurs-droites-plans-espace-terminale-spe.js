// ---------------------------------------------------------------------------
// Chapitre : Vecteurs, droites et plans de l'espace (Terminale, spécialité
// mathématiques) — sous abonnement.
//
// Correspond au chapitre 2 du programme de spécialité mathématiques de
// terminale : coordonnées d'un vecteur dans l'espace (à partir de deux
// points), norme d'un vecteur, somme et combinaison linéaire de vecteurs,
// milieu d'un segment, alignement de points (colinéarité de vecteurs de
// l'espace), représentation paramétrique d'une droite (calcul d'un point
// pour une valeur du paramètre, vérification qu'un point appartient à la
// droite), décomposition d'un vecteur dans une base de l'espace,
// coplanarité de vecteurs, positions relatives de droites et de plans.
// La correction du livre du professeur (source .tex, exercices 8-21 des
// sections Auto-évaluation et Travailler les automatismes) a servi à
// identifier la méthode ; les nombres et contextes sont générés
// aléatoirement à chaque tirage.
// Voir automatismes-terminale-spe.js (thème
// "vecteurs-droites-plans-espace-terminale-spe") pour les mini-exercices
// "Calcul mental" associés.
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

// Génère un point à coordonnées entières dans l'espace.
function point3(min, max) {
  return { x: randInt(min, max), y: randInt(min, max), z: randInt(min, max) };
}

// ---------- 1. Coordonnées d'un vecteur AB dans l'espace ----------
function genCoordonneesVecteurEspaceNumeric() {
  const A = point3(-8, 8);
  const B = point3(-8, 8);
  const composante = pick(["x", "y", "z"]);
  const answer = B[composante] - A[composante];
  return {
    type: "numeric",
    chapter: "Vecteurs de l'espace — Coordonnées",
    prompt: `On considère les points \\(A(${A.x} ; ${A.y} ; ${A.z})\\) et \\(B(${B.x} ; ${B.y} ; ${B.z})\\) de l'espace. Donne la coordonnée en ${composante} du vecteur \\(\\overrightarrow{AB}\\).`,
    answer,
    steps: [`${composante}_B - ${composante}_A = ${B[composante]} - (${A[composante]}) = ${answer}`],
  };
}

// ---------- 2. Norme d'un vecteur de l'espace (triplet pythagoricien en 3D) ----------
function genNormeVecteurEspaceNumeric() {
  // On construit un vecteur (a;b;c) tel que a²+b²+c² soit un carré parfait.
  const TRIPLETS_3D = [
    [1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11], [3, 4, 12, 13], [4, 4, 7, 9], [1, 4, 8, 9], [6, 6, 7, 11],
  ];
  const [a0, b0, c0, norme0] = pick(TRIPLETS_3D);
  const k = randInt(1, 3);
  const signes = [pick([1, -1]), pick([1, -1]), pick([1, -1])];
  const a = a0 * k * signes[0];
  const b = b0 * k * signes[1];
  const c = c0 * k * signes[2];
  const norme = norme0 * k;
  return {
    type: "numeric",
    chapter: "Vecteurs de l'espace — Coordonnées",
    prompt: `Calcule la norme du vecteur \\(\\vec{u}(${a} ; ${b} ; ${c})\\).`,
    answer: norme,
    steps: [`\\|\\vec{u}\\| = \\sqrt{${a}^2 + ${b}^2 + ${c}^2} = \\sqrt{${a * a + b * b + c * c}} = ${norme}`],
  };
}

// ---------- 3. Milieu d'un segment dans l'espace ----------
function genMilieuSegmentEspaceNumeric() {
  const A = point3(-10, 10);
  const B = point3(-10, 10);
  // On force B à avoir la même parité que A sur la composante interrogée pour un résultat entier lisible.
  const composante = pick(["x", "y", "z"]);
  if ((A[composante] + B[composante]) % 2 !== 0) B[composante] += 1;
  const answer = (A[composante] + B[composante]) / 2;
  return {
    type: "numeric",
    chapter: "Vecteurs de l'espace — Coordonnées",
    prompt: `On considère les points \\(A(${A.x} ; ${A.y} ; ${A.z})\\) et \\(B(${B.x} ; ${B.y} ; ${B.z})\\). Donne la coordonnée en ${composante} du milieu I de \\([AB]\\).`,
    answer,
    steps: [`${composante}_I = \\dfrac{${composante}_A + ${composante}_B}{2} = \\dfrac{${A[composante]} + ${B[composante]}}{2} = ${answer}`],
  };
}

// ---------- 4. Point d'une représentation paramétrique de droite pour une valeur de t ----------
function genPointRepresentationParametriqueNumeric() {
  const A = point3(-8, 8);
  const dir = { x: nonZero(-5, 5), y: nonZero(-5, 5), z: nonZero(-5, 5) };
  const t = randInt(-4, 4);
  const composante = pick(["x", "y", "z"]);
  const answer = A[composante] + t * dir[composante];
  return {
    type: "numeric",
    chapter: "Vecteurs de l'espace — Droites",
    prompt: `Une droite a pour représentation paramétrique \\(\\begin{cases} x = ${A.x} + ${dir.x}t \\\\ y = ${A.y} + ${dir.y}t \\\\ z = ${A.z} + ${dir.z}t \\end{cases}\\) avec \\(t \\in \\mathbb{R}\\). Calcule la coordonnée en ${composante} du point de cette droite obtenu pour \\(t = ${t}\\).`,
    answer,
    steps: [`${composante} = ${A[composante]} + ${dir[composante]} \\times ${t} = ${answer}`],
  };
}

// ---------- 5. Vérifier l'alignement de trois points (colinéarité dans l'espace) ----------
function genVerifierAlignementQCM() {
  const A = point3(-6, 6);
  const dir = { x: nonZero(-4, 4), y: nonZero(-4, 4), z: nonZero(-4, 4) };
  const k1 = nonZero(-3, 3);
  const B = { x: A.x + k1 * dir.x, y: A.y + k1 * dir.y, z: A.z + k1 * dir.z };
  const aligne = Math.random() < 0.5;
  let C;
  if (aligne) {
    const k2 = nonZero(-3, 3);
    C = { x: A.x + k2 * dir.x, y: A.y + k2 * dir.y, z: A.z + k2 * dir.z };
  } else {
    C = point3(-6, 6);
    // On s'assure que C n'est pas aligné en cassant la proportionnalité sur une composante.
    C.x = A.x + dir.x + nonZero(1, 3);
  }
  return {
    type: "qcm",
    chapter: "Vecteurs de l'espace — Alignement",
    prompt: `On considère les points \\(A(${A.x} ; ${A.y} ; ${A.z})\\), \\(B(${B.x} ; ${B.y} ; ${B.z})\\) et \\(C(${C.x} ; ${C.y} ; ${C.z})\\). Ces trois points sont-ils alignés ?`,
    answer: aligne ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`\\overrightarrow{AB}(${B.x - A.x} ; ${B.y - A.y} ; ${B.z - A.z})`, `\\overrightarrow{AC}(${C.x - A.x} ; ${C.y - A.y} ; ${C.z - A.z})`, aligne ? "Les deux vecteurs sont colinéaires : les points sont alignés." : "Les deux vecteurs ne sont pas colinéaires : les points ne sont pas alignés."],
  };
}

// ---------- 6. Décomposition d'un vecteur comme combinaison linéaire de deux autres ----------
function genDecompositionVecteurNumeric() {
  const u = { x: nonZero(-4, 4), y: nonZero(-4, 4), z: nonZero(-4, 4) };
  const v = { x: nonZero(-4, 4), y: nonZero(-4, 4), z: nonZero(-4, 4) };
  const k = nonZero(-3, 3);
  const kPrime = nonZero(-3, 3);
  const w = { x: k * u.x + kPrime * v.x, y: k * u.y + kPrime * v.y, z: k * u.z + kPrime * v.z };
  const demandeK = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Vecteurs de l'espace — Combinaisons linéaires",
    prompt: `On considère \\(\\vec{u}(${u.x} ; ${u.y} ; ${u.z})\\), \\(\\vec{v}(${v.x} ; ${v.y} ; ${v.z})\\) et \\(\\vec{w}(${w.x} ; ${w.y} ; ${w.z})\\), sachant que \\(\\vec{w} = k\\vec{u} + k'\\vec{v}\\). Donne la valeur de ${demandeK ? "k" : "k'"}.`,
    answer: demandeK ? k : kPrime,
    steps: [`\\vec{w} = ${k}\\vec{u} + ${kPrime}\\vec{v}`],
  };
}

// ---------- 7. Calculer les coordonnées d'une combinaison linéaire de deux vecteurs ----------
function genCalculerCombinaisonLineaireNumeric() {
  const u = { x: nonZero(-5, 5), y: nonZero(-5, 5), z: nonZero(-5, 5) };
  const v = { x: nonZero(-5, 5), y: nonZero(-5, 5), z: nonZero(-5, 5) };
  const k = nonZero(-4, 4);
  const kPrime = nonZero(-4, 4);
  const composante = pick(["x", "y", "z"]);
  const answer = k * u[composante] + kPrime * v[composante];
  return {
    type: "numeric",
    chapter: "Vecteurs de l'espace — Combinaisons linéaires",
    prompt: `On considère \\(\\vec{u}(${u.x} ; ${u.y} ; ${u.z})\\) et \\(\\vec{v}(${v.x} ; ${v.y} ; ${v.z})\\). On pose \\(\\vec{w} = ${k}\\vec{u} + ${kPrime}\\vec{v}\\). Donne la coordonnée en ${composante} de \\(\\vec{w}\\).`,
    answer,
    steps: [`${k} \\times ${u[composante]} + ${kPrime} \\times ${v[composante]} = ${answer}`],
  };
}

// ---------- 8. Vérifier qu'un point appartient à une droite (paramétrique) ----------
function genPointAppartientDroiteQCM() {
  const A = point3(-6, 6);
  const dir = { x: nonZero(-4, 4), y: nonZero(-4, 4), z: nonZero(-4, 4) };
  const appartient = Math.random() < 0.5;
  let M;
  if (appartient) {
    const t = randInt(-3, 3);
    M = { x: A.x + t * dir.x, y: A.y + t * dir.y, z: A.z + t * dir.z };
  } else {
    M = point3(-10, 10);
    M.x = A.x + dir.x + nonZero(1, 4);
  }
  return {
    type: "qcm",
    chapter: "Vecteurs de l'espace — Droites",
    prompt: `Une droite passe par \\(A(${A.x} ; ${A.y} ; ${A.z})\\) et a pour vecteur directeur \\(\\vec{u}(${dir.x} ; ${dir.y} ; ${dir.z})\\). Le point \\(M(${M.x} ; ${M.y} ; ${M.z})\\) appartient-il à cette droite ?`,
    answer: appartient ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`\\overrightarrow{AM}(${M.x - A.x} ; ${M.y - A.y} ; ${M.z - A.z})`, appartient ? "Ce vecteur est colinéaire à u : M appartient à la droite." : "Ce vecteur n'est pas colinéaire à u : M n'appartient pas à la droite."],
  };
}

// ---------- 9. Vecteur directeur d'une droite depuis deux points ----------
function genVecteurDirecteurDeuxPointsNumeric() {
  const A = point3(-8, 8);
  const B = point3(-8, 8);
  const composante = pick(["x", "y", "z"]);
  const answer = B[composante] - A[composante];
  return {
    type: "numeric",
    chapter: "Vecteurs de l'espace — Droites",
    prompt: `Une droite passe par les points \\(A(${A.x} ; ${A.y} ; ${A.z})\\) et \\(B(${B.x} ; ${B.y} ; ${B.z})\\). Donne la coordonnée en ${composante} d'un vecteur directeur de cette droite.`,
    answer,
    steps: [`\\overrightarrow{AB} \\text{ est un vecteur directeur : sa coordonnée en ${composante} vaut } ${B[composante]} - (${A[composante]}) = ${answer}`],
  };
}

// ---------- 10. Vrai ou faux sur les positions relatives de droites et de plans ----------
function genVraiFauxPositionsRelativesQCM() {
  const cas = pick([
    { description: "Deux droites parallèles de l'espace sont toujours coplanaires.", reponse: "Vrai" },
    { description: "Deux droites non parallèles de l'espace sont nécessairement sécantes.", reponse: "Faux" },
    { description: "Si deux plans sont sécants, leur intersection est une droite.", reponse: "Vrai" },
    { description: "Deux droites non coplanaires n'ont aucun point commun.", reponse: "Vrai" },
    { description: "Trois vecteurs de l'espace sont toujours coplanaires.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Vecteurs de l'espace — Positions relatives",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 11. Coordonnées du symétrique d'un point par rapport à un autre ----------
function genSymetriquePointNumeric() {
  const A = point3(-8, 8);
  const I = point3(-8, 8);
  const composante = pick(["x", "y", "z"]);
  // I est le milieu de [AB] : B = 2I - A
  const answer = 2 * I[composante] - A[composante];
  return {
    type: "numeric",
    chapter: "Vecteurs de l'espace — Coordonnées",
    prompt: `Le point \\(I(${I.x} ; ${I.y} ; ${I.z})\\) est le milieu du segment \\([AB]\\), avec \\(A(${A.x} ; ${A.y} ; ${A.z})\\). Donne la coordonnée en ${composante} de B.`,
    answer,
    steps: [`${composante}_B = 2 \\times ${I[composante]} - ${A[composante]} = ${answer}`],
  };
}

// ---------- 12. Coplanarité de trois vecteurs (résoudre un système simple) ----------
function genCoplanariteVecteursQCM() {
  const u = { x: 1, y: 0, z: 0 };
  const v = { x: 0, y: 1, z: 0 };
  const coplanaire = Math.random() < 0.5;
  let w;
  if (coplanaire) {
    const a = nonZero(-4, 4);
    const b = nonZero(-4, 4);
    w = { x: a * u.x + b * v.x, y: a * u.y + b * v.y, z: 0 };
  } else {
    w = { x: nonZero(-4, 4), y: nonZero(-4, 4), z: nonZero(1, 4) };
  }
  return {
    type: "qcm",
    chapter: "Vecteurs de l'espace — Coplanarité",
    prompt: `On considère \\(\\vec{u}(1 ; 0 ; 0)\\), \\(\\vec{v}(0 ; 1 ; 0)\\) et \\(\\vec{w}(${w.x} ; ${w.y} ; ${w.z})\\). Les trois vecteurs sont-ils coplanaires ?`,
    answer: coplanaire ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [coplanaire ? `\\vec{w} \\text{ a une coordonnée en z nulle : il s'écrit comme combinaison de } \\vec{u} \\text{ et } \\vec{v}, \\text{ les trois vecteurs sont coplanaires.}` : `\\vec{w} \\text{ a une coordonnée en z non nulle alors que } \\vec{u} \\text{ et } \\vec{v} \\text{ sont dans le plan } z=0 : \\text{les trois vecteurs ne sont pas coplanaires.}`],
  };
}

// ---------- 13. Norme d'un vecteur au carré (calcul intermédiaire) ----------
function genNormeCarreVecteurNumeric() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const c = nonZero(-8, 8);
  return {
    type: "numeric",
    chapter: "Vecteurs de l'espace — Coordonnées",
    prompt: `On considère \\(\\vec{u}(${a} ; ${b} ; ${c})\\). Calcule \\(\\|\\vec{u}\\|^2\\) (le carré de la norme).`,
    answer: a * a + b * b + c * c,
    steps: [`${a}^2 + ${b}^2 + ${c}^2 = ${a * a + b * b + c * c}`],
  };
}

// ---------- 14. Somme de deux vecteurs de l'espace ----------
function genSommeVecteursEspaceNumeric() {
  const u = { x: randInt(-9, 9), y: randInt(-9, 9), z: randInt(-9, 9) };
  const v = { x: randInt(-9, 9), y: randInt(-9, 9), z: randInt(-9, 9) };
  const composante = pick(["x", "y", "z"]);
  return {
    type: "numeric",
    chapter: "Vecteurs de l'espace — Coordonnées",
    prompt: `On considère \\(\\vec{u}(${u.x} ; ${u.y} ; ${u.z})\\) et \\(\\vec{v}(${v.x} ; ${v.y} ; ${v.z})\\). Donne la coordonnée en ${composante} du vecteur \\(\\vec{u} + \\vec{v}\\).`,
    answer: u[composante] + v[composante],
    steps: [`${u[composante]} + ${v[composante]} = ${u[composante] + v[composante]}`],
  };
}

// ---------- 15. Relation de Chasles dans l'espace ----------
function genRelationChaslesEspaceNumeric() {
  const A = point3(-8, 8);
  const B = point3(-8, 8);
  const C = point3(-8, 8);
  const composante = pick(["x", "y", "z"]);
  // AC = AB + BC, on vérifie la cohérence en donnant AB et BC pour trouver AC.
  const ab = B[composante] - A[composante];
  const bc = C[composante] - B[composante];
  const answer = ab + bc;
  return {
    type: "numeric",
    chapter: "Vecteurs de l'espace — Relation de Chasles",
    prompt: `On sait que la coordonnée en ${composante} de \\(\\overrightarrow{AB}\\) est ${ab} et que celle de \\(\\overrightarrow{BC}\\) est ${bc}. En utilisant la relation de Chasles, donne la coordonnée en ${composante} de \\(\\overrightarrow{AC}\\).`,
    answer,
    steps: [`\\overrightarrow{AC} = \\overrightarrow{AB} + \\overrightarrow{BC}`, `${ab} + ${bc} = ${answer}`],
  };
}

const GENERATORS = [
  genCoordonneesVecteurEspaceNumeric,
  genNormeVecteurEspaceNumeric,
  genMilieuSegmentEspaceNumeric,
  genPointRepresentationParametriqueNumeric,
  genVerifierAlignementQCM,
  genDecompositionVecteurNumeric,
  genCalculerCombinaisonLineaireNumeric,
  genPointAppartientDroiteQCM,
  genVecteurDirecteurDeuxPointsNumeric,
  genVraiFauxPositionsRelativesQCM,
  genSymetriquePointNumeric,
  genCoplanariteVecteursQCM,
  genNormeCarreVecteurNumeric,
  genSommeVecteursEspaceNumeric,
  genRelationChaslesEspaceNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "vecteurs-droites-plans-espace-terminale-spe",
    title: "Vecteurs, droites et plans de l'espace",
    description: "Coordonnées et norme d'un vecteur de l'espace, combinaisons linéaires, milieu d'un segment, alignement, représentation paramétrique d'une droite, coplanarité, positions relatives de droites et de plans.",
    level: "terminale-spe",
    free: false,
    order: 3,
  },
  generate,
};
