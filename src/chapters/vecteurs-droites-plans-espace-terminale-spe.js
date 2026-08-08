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
    steps: [
      { type: "regle", text: `\\text{Coordonnées de } \\overrightarrow{AB} \\text{ : on soustrait, composante par composante, les coordonnées de A à celles de B.}` },
      { type: "resultat", text: `${composante}_B - ${composante}_A = ${B[composante]} - (${A[composante]}) = ${answer}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Formule de référence (Pythagore généralisé à l'espace) : } \\|\\vec{u}(x;y;z)\\| = \\sqrt{x^2+y^2+z^2}.` },
      { type: "resultat", text: `\\|\\vec{u}\\| = \\sqrt{${a}^2 + ${b}^2 + ${c}^2} = \\sqrt{${a * a + b * b + c * c}} = ${norme}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Coordonnées du milieu d'un segment : on fait la moyenne des coordonnées des deux extrémités.}` },
      { type: "resultat", text: `${composante}_I = \\dfrac{${composante}_A + ${composante}_B}{2} = \\dfrac{${A[composante]} + ${B[composante]}}{2} = ${answer}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Pour obtenir un point de la droite, on remplace } t \\text{ par sa valeur dans l'équation de la coordonnée demandée.}` },
      { type: "resultat", text: `${composante} = ${A[composante]} + ${dir[composante]} \\times ${t} = ${answer}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{A, B, C sont alignés si et seulement si } \\overrightarrow{AB} \\text{ et } \\overrightarrow{AC} \\text{ sont colinéaires (l'un est un multiple de l'autre).}` },
      { type: "donnee", text: `\\overrightarrow{AB}(${B.x - A.x} ; ${B.y - A.y} ; ${B.z - A.z})` },
      { type: "donnee", text: `\\overrightarrow{AC}(${C.x - A.x} ; ${C.y - A.y} ; ${C.z - A.z})` },
      { type: "resultat", text: aligne ? "Les deux vecteurs sont colinéaires : les points sont alignés." : "Les deux vecteurs ne sont pas colinéaires : les points ne sont pas alignés." },
    ],
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
    steps: [
      { type: "regle", text: `\\text{On détermine k et k' en résolvant le système formé par les coordonnées de } \\vec{w} = k\\vec{u} + k'\\vec{v} \\text{ (deux équations suffisent, la troisième vérifie la cohérence).}` },
      { type: "resultat", text: `\\vec{w} = ${k}\\vec{u} + ${kPrime}\\vec{v} \\text{, donc } ${demandeK ? "k" : "k'"} = ${demandeK ? k : kPrime}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Pour une coordonnée de } \\vec{w} = k\\vec{u} + k'\\vec{v}, \\text{ on applique la même combinaison linéaire à cette coordonnée de } \\vec{u} \\text{ et } \\vec{v}.` },
      { type: "resultat", text: `${k} \\times ${u[composante]} + ${kPrime} \\times ${v[composante]} = ${answer}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{M appartient à la droite si et seulement si } \\overrightarrow{AM} \\text{ est colinéaire au vecteur directeur } \\vec{u} \\text{ (l'un est un multiple de l'autre).}` },
      { type: "donnee", text: `\\overrightarrow{AM}(${M.x - A.x} ; ${M.y - A.y} ; ${M.z - A.z})` },
      { type: "resultat", text: appartient ? "Ce vecteur est colinéaire à u : M appartient à la droite." : "Ce vecteur n'est pas colinéaire à u : M n'appartient pas à la droite." },
    ],
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
    steps: [{ type: "resultat", text: `\\overrightarrow{AB} \\text{ est un vecteur directeur : sa coordonnée en ${composante} vaut } ${B[composante]} - (${A[composante]}) = ${answer}` }],
  };
}

// ---------- 10. Vrai ou faux sur les positions relatives de droites et de plans ----------
function genVraiFauxPositionsRelativesQCM() {
  const cas = pick([
    { description: "Deux droites parallèles de l'espace sont toujours coplanaires.", reponse: "Vrai", explication: "C'est vrai : deux droites parallèles ont la même direction, on peut donc toujours construire un plan qui les contient toutes les deux (elles ne sont jamais gauches)." },
    { description: "Deux droites non parallèles de l'espace sont nécessairement sécantes.", reponse: "Faux", explication: "C'est faux : deux droites non parallèles peuvent être sécantes (un point commun) ou non coplanaires, c'est-à-dire gauches, sans aucun point commun. Par exemple, deux arêtes opposées d'un cube ne sont ni parallèles ni sécantes." },
    { description: "Si deux plans sont sécants, leur intersection est une droite.", reponse: "Vrai", explication: "C'est vrai : dans l'espace, si deux plans distincts se coupent, leur intersection est toujours une droite (jamais un seul point)." },
    { description: "Deux droites non coplanaires n'ont aucun point commun.", reponse: "Vrai", explication: "C'est vrai : si deux droites avaient un point commun, on pourrait toujours construire un plan les contenant toutes les deux, donc elles seraient coplanaires. Par contraposée, deux droites non coplanaires n'ont aucun point commun." },
    { description: "Trois vecteurs de l'espace sont toujours coplanaires.", reponse: "Faux", explication: "C'est faux : trois vecteurs ne sont coplanaires que si l'un peut s'écrire comme combinaison linéaire des deux autres. Par exemple, les vecteurs (1;0;0), (0;1;0) et (0;0;1) ne sont pas coplanaires : ils forment une base de l'espace." },
  ]);
  return {
    type: "qcm",
    chapter: "Vecteurs de l'espace — Positions relatives",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
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
    steps: [
      { type: "regle", text: `\\text{I milieu de [AB] signifie que A et B sont symétriques par rapport à I : donc } B = 2I - A \\text{ (composante par composante).}` },
      { type: "resultat", text: `${composante}_B = 2 \\times ${I[composante]} - ${A[composante]} = ${answer}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Trois vecteurs sont coplanaires si l'un s'écrit comme combinaison linéaire des deux autres.}` },
      {
        type: "resultat",
        text: coplanaire
          ? `\\vec{w} \\text{ a une coordonnée en z nulle : il s'écrit comme combinaison de } \\vec{u} \\text{ et } \\vec{v}, \\text{ les trois vecteurs sont coplanaires.}`
          : `\\vec{w} \\text{ a une coordonnée en z non nulle alors que } \\vec{u} \\text{ et } \\vec{v} \\text{ sont dans le plan } z=0 : \\text{les trois vecteurs ne sont pas coplanaires.}`,
      },
    ],
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
    steps: [
      { type: "regle", text: `\\|\\vec{u}(x;y;z)\\|^2 = x^2+y^2+z^2 \\text{ (on omet simplement la racine carrée).}` },
      { type: "resultat", text: `${a}^2 + ${b}^2 + ${c}^2 = ${a * a + b * b + c * c}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Pour additionner deux vecteurs, on additionne leurs coordonnées composante par composante.}` },
      { type: "resultat", text: `${u[composante]} + ${v[composante]} = ${u[composante] + v[composante]}` },
    ],
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
    steps: [
      { type: "regle", text: `\\overrightarrow{AC} = \\overrightarrow{AB} + \\overrightarrow{BC} \\text{ (relation de Chasles).}` },
      { type: "resultat", text: `${ab} + ${bc} = ${answer}` },
    ],
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

const DIFFICULTY = {
  genCoordonneesVecteurEspaceNumeric: "facile",
  genNormeVecteurEspaceNumeric: "facile",
  genMilieuSegmentEspaceNumeric: "facile",
  genVecteurDirecteurDeuxPointsNumeric: "facile",
  genNormeCarreVecteurNumeric: "facile",
  genSommeVecteursEspaceNumeric: "facile",
  genPointRepresentationParametriqueNumeric: "standard",
  genVerifierAlignementQCM: "standard",
  genCalculerCombinaisonLineaireNumeric: "standard",
  genPointAppartientDroiteQCM: "standard",
  genSymetriquePointNumeric: "standard",
  genDecompositionVecteurNumeric: "expert",
  genVraiFauxPositionsRelativesQCM: "expert",
  genCoplanariteVecteursQCM: "expert",
  genRelationChaslesEspaceNumeric: "expert",
};

function generate(difficulty) {
  if (difficulty) {
    const pool = GENERATORS.filter((fn) => (DIFFICULTY[fn.name] ?? "standard") === difficulty);
    if (pool.length) return pick(pool)();
  }
  return pick(GENERATORS)();
}

// ===================== Figures pour le Cours (carte mentale) =====================
// Pas de helper de figure existant dans ce fichier avant. Figure.jsx ne rend que
// du SVG 2D : les objets de l'espace sont donc projetés en perspective
// cavalière (convention manuel : axe (Ox) oblique à 45° réduit de moitié vers
// le bas-gauche, axe (Oy) horizontal vers la droite, axe (Oz) vertical vers
// le haut) avant d'être passés au composant Figure existant.
function project3D(x, y, z) {
  const scale = 18;
  const kx = 0.5 * Math.SQRT1_2; // réduction cavalière (0.5) x cos(45°)
  return { x: y * scale - x * kx * scale, y: -z * scale + x * kx * scale };
}

function build3DFigure(pts3D, segments = [], lines = []) {
  const points = pts3D.map((p) => {
    const proj = project3D(p.x, p.y, p.z);
    return { id: p.id, x: proj.x, y: proj.y, label: p.label ?? p.id, dx: p.dx ?? 8, dy: p.dy ?? -6, hideDot: p.hideDot, hideLabel: p.hideLabel };
  });
  return { points, segments, lines };
}

function buildCoursReperEspaceFigure() {
  return build3DFigure(
    [
      { id: "O", x: 0, y: 0, z: 0, hideLabel: true, dx: -10, dy: 10 },
      { id: "X", x: 3.4, y: 0, z: 0, hideDot: true, hideLabel: true },
      { id: "Y", x: 0, y: 3.2, z: 0, hideDot: true, hideLabel: true },
      { id: "Z", x: 0, y: 0, z: 3.2, hideDot: true, hideLabel: true },
      { id: "M", x: 2, y: 2, z: 2, label: "M" },
      { id: "Mxy", x: 2, y: 2, z: 0, hideDot: true, hideLabel: true },
      { id: "Mx", x: 2, y: 0, z: 0, hideDot: true, hideLabel: true },
      { id: "My", x: 0, y: 2, z: 0, hideDot: true, hideLabel: true },
    ],
    [
      { from: "M", to: "Mxy", dashed: true },
      { from: "Mxy", to: "Mx", dashed: true },
      { from: "Mxy", to: "My", dashed: true },
    ],
    [
      { from: "O", to: "X", extend: 0, arrowEnd: true },
      { from: "O", to: "Y", extend: 0, arrowEnd: true },
      { from: "O", to: "Z", extend: 0, arrowEnd: true },
      { from: "O", to: "M", extend: 0, arrowEnd: true },
    ]
  );
}

function buildCoursDroiteEspaceFigure() {
  return build3DFigure(
    [
      { id: "P1", x: -1.5, y: -0.5, z: 2.5, hideDot: true, hideLabel: true },
      { id: "P2", x: 4, y: 2.5, z: -1, hideDot: true, hideLabel: true },
      { id: "A", x: 1, y: 1, z: 1, label: "A" },
      { id: "U", x: 3, y: 2, z: 0, label: "u", dx: 8, dy: 6 },
    ],
    [],
    [
      { from: "P1", to: "P2", extend: 0 },
      { from: "A", to: "U", extend: 0, arrowEnd: true },
    ]
  );
}

function buildCoursBaseEspaceFigure() {
  return build3DFigure(
    [
      { id: "O", x: 0, y: 0, z: 0, hideLabel: true, dx: -10, dy: 10 },
      { id: "I", x: 2, y: 0, z: 0, label: "i", dy: 12 },
      { id: "J", x: 0, y: 2, z: 0, label: "j" },
      { id: "K", x: 0, y: 0, z: 2, label: "k", dx: -10 },
      { id: "V", x: 1.5, y: 1, z: 0, label: "v", dx: 8, dy: 8 },
      { id: "IJ", x: 2, y: 2, z: 0, hideDot: true, hideLabel: true },
    ],
    [
      { from: "I", to: "IJ", dashed: true },
      { from: "J", to: "IJ", dashed: true },
    ],
    [
      { from: "O", to: "I", extend: 0, arrowEnd: true },
      { from: "O", to: "J", extend: 0, arrowEnd: true },
      { from: "O", to: "K", extend: 0, arrowEnd: true },
      { from: "O", to: "V", extend: 0, arrowEnd: true },
    ]
  );
}

function buildCoursPlansParallelesFigure() {
  return build3DFigure(
    [
      { id: "A", x: 0, y: 0, z: 0, hideDot: true, hideLabel: true },
      { id: "B", x: 3, y: 0, z: 0, hideDot: true, hideLabel: true },
      { id: "C", x: 3, y: 2.2, z: 0, hideDot: true, hideLabel: true },
      { id: "D", x: 0, y: 2.2, z: 0, hideDot: true, hideLabel: true },
      { id: "A2", x: 0, y: 0, z: 2, hideDot: true, hideLabel: true },
      { id: "B2", x: 3, y: 0, z: 2, hideDot: true, hideLabel: true },
      { id: "C2", x: 3, y: 2.2, z: 2, hideDot: true, hideLabel: true },
      { id: "D2", x: 0, y: 2.2, z: 2, hideDot: true, hideLabel: true },
    ],
    [
      { from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "D" }, { from: "D", to: "A" },
      { from: "A2", to: "B2" }, { from: "B2", to: "C2" }, { from: "C2", to: "D2" }, { from: "D2", to: "A2" },
    ],
    []
  );
}

export default {
  meta: {
    id: "vecteurs-droites-plans-espace-terminale-spe",
    title: "Vecteurs, droites et plans de l'espace",
    description: "Coordonnées et norme d'un vecteur de l'espace, combinaisons linéaires, milieu d'un segment, alignement, représentation paramétrique d'une droite, coplanarité, positions relatives de droites et de plans.",
    pourquoi: "Les vecteurs de l'espace sont le langage utilisé pour décrire des positions et des déplacements en 3D : architecture, jeux vidéo, robotique.",
    level: "terminale-spe",
    free: false,
    order: 3,
    cours: {
      mindMap: {
        title: "Vecteurs, droites et plans de l'espace",
        branches: [
          {
            title: "Repère de l'espace, coordonnées et norme",
            items: [
              "Un repère de l'espace ajoute un troisième axe (Oz) aux deux axes du plan.",
              "Coordonnées de \\(\\overrightarrow{AB}\\) depuis deux points : on soustrait, composante par composante, les coordonnées de A à celles de B.",
              "Milieu I du segment [AB] : on fait la moyenne des coordonnées de A et de B, composante par composante.",
              "Somme de deux vecteurs : on additionne leurs coordonnées composante par composante. Relation de Chasles : \\(\\overrightarrow{AC}=\\overrightarrow{AB}+\\overrightarrow{BC}\\).",
            ],
            formula: "\\(\\overrightarrow{AB}(x_B-x_A;y_B-y_A;z_B-z_A)\\), \\(I\\left(\\dfrac{x_A+x_B}{2};\\dfrac{y_A+y_B}{2};\\dfrac{z_A+z_B}{2}\\right)\\), \\(\\|\\overrightarrow{OM}\\| = \\sqrt{x^2+y^2+z^2}\\)",
            figure: buildCoursReperEspaceFigure(),
          },
          {
            title: "Représentation paramétrique d'une droite",
            items: [
              "Un point A et un vecteur directeur \\(\\overrightarrow{u}\\) suffisent pour décrire tous les points de la droite.",
              "Alignement et appartenance à une droite : trois points A, B, C sont alignés (et un point M appartient à la droite passant par A de vecteur directeur \\(\\overrightarrow{u}\\)) si et seulement si les vecteurs concernés sont colinéaires — l'un est un multiple scalaire de l'autre.",
              "Piège classique : bien vérifier que le même paramètre t est utilisé sur les trois lignes (x, y, z) en même temps.",
            ],
            formula: "\\(\\begin{cases}x=x_A+ta \\\\ y=y_A+tb \\\\ z=z_A+tc\\end{cases},\\ t \\in \\mathbb{R}\\)",
            figure: buildCoursDroiteEspaceFigure(),
          },
          {
            title: "Base, décomposition et coplanarité",
            items: [
              "Trois vecteurs non coplanaires forment une base : tout vecteur de l'espace se décompose de façon unique sur cette base.",
              "Des vecteurs coplanaires restent « à plat » dans un même plan (comme \\(\\overrightarrow{v}\\) ici, combinaison de \\(\\overrightarrow{i}\\) et \\(\\overrightarrow{j}\\)).",
            ],
            figure: buildCoursBaseEspaceFigure(),
          },
          {
            title: "Positions relatives de droites et de plans",
            items: [
              "Deux droites de l'espace sont soit parallèles (même direction, donc toujours coplanaires), soit sécantes (un point commun, donc coplanaires), soit non coplanaires (« gauches ») — dans ce dernier cas, ni parallèles ni sécantes, sans aucun point commun.",
              "Deux plans sont parallèles si l'un contient deux vecteurs directeurs du plan de l'autre (ou s'ils sont confondus).",
              "Si deux plans sont sécants, leur intersection est toujours une droite (jamais un seul point).",
              "Une droite et un plan sont soit parallèles (aucun point commun ou droite incluse dans le plan), soit sécants en un seul point.",
            ],
            figure: buildCoursPlansParallelesFigure(),
          },
        ],
      },
    },
  },
  generate,
};
