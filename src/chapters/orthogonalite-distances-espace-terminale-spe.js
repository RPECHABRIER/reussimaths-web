// ---------------------------------------------------------------------------
// Chapitre : Orthogonalité et distances dans l'espace (Terminale,
// spécialité mathématiques) — sous abonnement.
//
// Correspond au chapitre 3 du programme de spécialité mathématiques de
// terminale : produit scalaire de deux vecteurs de l'espace, orthogonalité
// de deux vecteurs, vecteur normal à un plan (lecture directe des
// coefficients dans une équation cartésienne ax+by+cz+d=0), équation d'un
// plan connaissant un point et un vecteur normal, distance d'un point à un
// plan (formule du cours), vérification qu'un point appartient à un plan,
// colinéarité de deux vecteurs normaux (même plan ou plans parallèles),
// positions relatives de droites et de plans.
// La correction du livre du professeur (source .tex, exercices 9-18 de la
// section Auto-évaluation) a servi à identifier la méthode ; les nombres et
// contextes sont générés aléatoirement à chaque tirage.
// Voir automatismes-terminale-spe.js (thème
// "orthogonalite-distances-espace-terminale-spe") pour les mini-exercices
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

function point3(min, max) {
  return { x: randInt(min, max), y: randInt(min, max), z: randInt(min, max) };
}

function texPlan(a, b, c, d) {
  // variable === "" correspond au terme constant d : il ne faut jamais
  // supprimer le chiffre dans ce cas, même si |d| = 1 (bug déjà rencontré
  // avec un helper similaire dans equations-droites-seconde.js).
  const terme = (coeff, variable) => {
    if (variable === "") return `${coeff >= 0 ? "+" : "-"} ${Math.abs(coeff)}`;
    return `${coeff >= 0 ? "+" : "-"} ${Math.abs(coeff) === 1 ? "" : Math.abs(coeff)}${variable}`;
  };
  let s = `${a}x `;
  s += `${terme(b, "y")} `;
  s += `${terme(c, "z")} `;
  s += `${terme(d, "")}`;
  return `${s} = 0`;
}

// ---------- 1. Produit scalaire de deux vecteurs de l'espace ----------
function genProduitScalaireEspaceNumeric() {
  const u = { x: nonZero(-8, 8), y: nonZero(-8, 8), z: nonZero(-8, 8) };
  const v = { x: nonZero(-8, 8), y: nonZero(-8, 8), z: nonZero(-8, 8) };
  const answer = u.x * v.x + u.y * v.y + u.z * v.z;
  return {
    type: "numeric",
    chapter: "Orthogonalité et distances — Produit scalaire",
    prompt: `On considère \\(\\vec{u}(${u.x} ; ${u.y} ; ${u.z})\\) et \\(\\vec{v}(${v.x} ; ${v.y} ; ${v.z})\\). Calcule \\(\\vec{u} \\cdot \\vec{v}\\).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Formule de référence : } \\vec{u} \\cdot \\vec{v} = x_u x_v + y_u y_v + z_u z_v.` },
      { type: "resultat", text: `${u.x} \\times ${v.x} + ${u.y} \\times ${v.y} + ${u.z} \\times ${v.z} = ${answer}` },
    ],
  };
}

// ---------- 2. Vérifier l'orthogonalité de deux vecteurs ----------
function genVerifierOrthogonaliteQCM() {
  const u = { x: nonZero(-6, 6), y: nonZero(-6, 6), z: nonZero(-6, 6) };
  const orthogonal = Math.random() < 0.5;
  let v;
  if (orthogonal) {
    // On construit v orthogonal à u : u.x*v.x + u.y*v.y + u.z*v.z = 0.
    // On choisit v.x et v.y librement puis on résout v.z si possible (u.z divise le reste).
    let vx, vy, vz;
    do {
      vx = nonZero(-6, 6);
      vy = nonZero(-6, 6);
    } while ((u.x * vx + u.y * vy) % u.z !== 0);
    vz = -(u.x * vx + u.y * vy) / u.z;
    v = { x: vx, y: vy, z: vz };
  } else {
    v = point3(-6, 6);
    if (v.x === 0) v.x = nonZero(-6, 6);
  }
  const produit = u.x * v.x + u.y * v.y + u.z * v.z;
  const reponse = produit === 0 ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Orthogonalité et distances — Produit scalaire",
    prompt: `On considère \\(\\vec{u}(${u.x} ; ${u.y} ; ${u.z})\\) et \\(\\vec{v}(${v.x} ; ${v.y} ; ${v.z})\\). Ces deux vecteurs sont-ils orthogonaux ?`,
    answer: reponse,
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Deux vecteurs sont orthogonaux si et seulement si leur produit scalaire est nul.}` },
      { type: "donnee", text: `\\vec{u} \\cdot \\vec{v} = ${u.x} \\times ${v.x} + ${u.y} \\times ${v.y} + ${u.z} \\times ${v.z} = ${produit}` },
      { type: "resultat", text: reponse === "Oui" ? "Le produit scalaire est nul : les vecteurs sont orthogonaux." : "Le produit scalaire est non nul : les vecteurs ne sont pas orthogonaux." },
    ],
  };
}

// ---------- 3. Identifier un vecteur normal depuis l'équation cartésienne d'un plan ----------
function genVecteurNormalDepuisEquationNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const d = randInt(-15, 15);
  const composante = pick(["x", "y", "z"]);
  const answer = composante === "x" ? a : composante === "y" ? b : c;
  return {
    type: "numeric",
    chapter: "Orthogonalité et distances — Vecteur normal",
    prompt: `Un plan a pour équation cartésienne \\(${texPlan(a, b, c, d)}\\). Donne la coordonnée en ${composante} d'un vecteur normal à ce plan.`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Dans une équation cartésienne } ax+by+cz+d=0, \\text{ les coefficients a, b, c sont directement les coordonnées d'un vecteur normal au plan.}` },
      { type: "resultat", text: `\\vec{n}(${a} ; ${b} ; ${c})` },
    ],
  };
}

// ---------- 4. Calculer d dans l'équation d'un plan connaissant un point ----------
function genCalculerDEquationPlanNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const M = point3(-8, 8);
  const d = -(a * M.x + b * M.y + c * M.z);
  return {
    type: "numeric",
    chapter: "Orthogonalité et distances — Équation d'un plan",
    prompt: `Un plan a pour vecteur normal \\(\\vec{n}(${a} ; ${b} ; ${c})\\) et passe par le point \\(M(${M.x} ; ${M.y} ; ${M.z})\\). Son équation est de la forme \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}y ${c >= 0 ? "+" : "-"} ${Math.abs(c)}z + d = 0\\). Calcule d.`,
    answer: d,
    steps: [
      { type: "regle", text: `\\text{M appartient au plan si ses coordonnées vérifient l'équation : on substitue les coordonnées de M, puis on isole d.}` },
      { type: "calcul", text: `${a} \\times ${M.x} + ${b} \\times ${M.y} + ${c} \\times ${M.z} + d = 0` },
      { type: "resultat", text: `d = ${d}` },
    ],
  };
}

// ---------- 5. Distance d'un point à un plan ----------
function genDistancePointPlanNumeric() {
  // On construit un vecteur normal (a;b;c) de norme un entier (triplet pythagoricien 3D).
  const TRIPLETS_3D = [
    [1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11], [3, 4, 12, 13], [4, 4, 7, 9], [1, 4, 8, 9], [6, 6, 7, 11],
  ];
  const [a0, b0, c0, norme0] = pick(TRIPLETS_3D);
  const signes = [pick([1, -1]), pick([1, -1]), pick([1, -1])];
  const a = a0 * signes[0];
  const b = b0 * signes[1];
  const c = c0 * signes[2];
  const M = point3(-8, 8);
  const kEcart = nonZero(-6, 6);
  // On choisit d de sorte que a*Mx+b*My+c*Mz+d = kEcart * norme0 (distance exacte kEcart en valeur absolue).
  const d = kEcart * norme0 - (a * M.x + b * M.y + c * M.z);
  const distance = Math.abs(kEcart);
  return {
    type: "numeric",
    chapter: "Orthogonalité et distances — Distance point-plan",
    prompt: `Un plan a pour équation \\(${texPlan(a, b, c, d)}\\). Calcule la distance du point \\(M(${M.x} ; ${M.y} ; ${M.z})\\) à ce plan.`,
    answer: distance,
    steps: [
      { type: "regle", text: `\\text{Formule de référence à connaître : } d(M, \\mathcal{P}) = \\dfrac{|ax_M+by_M+cz_M+d|}{\\sqrt{a^2+b^2+c^2}} \\text{ où } (a;b;c) \\text{ est un vecteur normal du plan.}` },
      { type: "resultat", text: `d(M, \\mathcal{P}) = \\dfrac{|${a} \\times ${M.x} + ${b} \\times ${M.y} + ${c} \\times ${M.z} + (${d})|}{\\sqrt{${a}^2+${b}^2+${c}^2}} = \\dfrac{${Math.abs(kEcart * norme0)}}{${norme0}} = ${distance}` },
    ],
  };
}

// ---------- 6. Vérifier qu'un point appartient à un plan ----------
function genPointAppartientPlanQCM() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const c = nonZero(-8, 8);
  const appartient = Math.random() < 0.5;
  const M = point3(-8, 8);
  const d = appartient ? -(a * M.x + b * M.y + c * M.z) : -(a * M.x + b * M.y + c * M.z) + nonZero(1, 5);
  const valeur = a * M.x + b * M.y + c * M.z + d;
  return {
    type: "qcm",
    chapter: "Orthogonalité et distances — Équation d'un plan",
    prompt: `Un plan a pour équation \\(${texPlan(a, b, c, d)}\\). Le point \\(M(${M.x} ; ${M.y} ; ${M.z})\\) appartient-il à ce plan ?`,
    answer: valeur === 0 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{M appartient au plan si et seulement si ses coordonnées vérifient l'équation cartésienne (le résultat de la substitution vaut 0).}` },
      { type: "donnee", text: `${a} \\times ${M.x} + ${b} \\times ${M.y} + ${c} \\times ${M.z} + (${d}) = ${valeur}` },
      { type: "resultat", text: valeur === 0 ? "Le résultat est nul : M appartient au plan." : "Le résultat n'est pas nul : M n'appartient pas au plan." },
    ],
  };
}

// ---------- 7. Deux vecteurs normaux colinéaires définissent des plans parallèles ----------
function genVecteursNormauxColineairesQCM() {
  const a = nonZero(-6, 6);
  const b = nonZero(-6, 6);
  const c = nonZero(-6, 6);
  const colineaires = Math.random() < 0.5;
  const k = nonZero(-4, 4);
  let n2;
  if (colineaires) {
    n2 = { x: k * a, y: k * b, z: k * c };
  } else {
    n2 = point3(-8, 8);
    n2.x = a + nonZero(1, 4);
  }
  return {
    type: "qcm",
    chapter: "Orthogonalité et distances — Vecteur normal",
    prompt: `Un plan \\(\\mathcal{P}\\) a pour vecteur normal \\(\\vec{n}(${a} ; ${b} ; ${c})\\) et un plan \\(\\mathcal{P}'\\) a pour vecteur normal \\(\\vec{n'}(${n2.x} ; ${n2.y} ; ${n2.z})\\). Les plans \\(\\mathcal{P}\\) et \\(\\mathcal{P}'\\) sont-ils nécessairement parallèles ?`,
    answer: colineaires ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Deux plans sont parallèles si et seulement si leurs vecteurs normaux sont colinéaires (l'un est un multiple de l'autre).}` },
      { type: "resultat", text: colineaires ? "Les deux vecteurs normaux sont colinéaires : les plans sont parallèles." : "Les deux vecteurs normaux ne sont pas colinéaires : les plans ne sont pas parallèles." },
    ],
  };
}

// ---------- 8. Norme au carré d'un vecteur normal (calcul intermédiaire pour la distance) ----------
function genNormeCarreVecteurNormalNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Orthogonalité et distances — Distance point-plan",
    prompt: `Un plan a pour vecteur normal \\(\\vec{n}(${a} ; ${b} ; ${c})\\). Calcule \\(a^2+b^2+c^2\\) (le carré de la norme de \\(\\vec{n}\\)), utile dans la formule de distance.`,
    answer: a * a + b * b + c * c,
    steps: [
      { type: "regle", text: `\\|\\vec{n}(a;b;c)\\|^2 = a^2+b^2+c^2.` },
      { type: "resultat", text: `${a}^2 + ${b}^2 + ${c}^2 = ${a * a + b * b + c * c}` },
    ],
  };
}

// ---------- 9. Vrai ou faux sur les positions relatives droites/plans dans l'espace ----------
function genVraiFauxPositionsRelativesQCM() {
  const cas = pick([
    { description: "Une droite orthogonale à un plan est orthogonale à toutes les droites de ce plan.", reponse: "Vrai", explication: "C'est vrai : c'est la définition même d'une droite orthogonale à un plan — elle est orthogonale à toutes les droites de ce plan, pas seulement à deux d'entre elles." },
    { description: "Deux droites orthogonales à un même plan sont parallèles entre elles.", reponse: "Vrai", explication: "C'est vrai : deux droites orthogonales à un même plan ont toutes deux la direction du vecteur normal de ce plan, elles sont donc colinéaires, donc parallèles." },
    { description: "Deux plans dont les vecteurs normaux sont orthogonaux sont nécessairement perpendiculaires.", reponse: "Vrai", explication: "C'est vrai : c'est la caractérisation du cours — deux plans sont perpendiculaires si et seulement si leurs vecteurs normaux sont orthogonaux." },
    { description: "Une droite orthogonale à deux droites sécantes d'un plan est orthogonale à ce plan.", reponse: "Vrai", explication: "C'est vrai : c'est le théorème d'orthogonalité du cours — il suffit qu'une droite soit orthogonale à deux droites sécantes (non parallèles) d'un plan pour être orthogonale à ce plan tout entier." },
    { description: "Un vecteur normal à un plan est nécessairement unique.", reponse: "Faux", explication: "C'est faux : tout vecteur colinéaire à un vecteur normal est lui aussi normal au plan. Il existe une infinité de vecteurs normaux à un même plan, tous colinéaires entre eux (par exemple (1;2;3) et (2;4;6))." },
  ]);
  return {
    type: "qcm",
    chapter: "Orthogonalité et distances — Positions relatives",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 10. Trouver un paramètre inconnu pour que deux vecteurs soient orthogonaux ----------
function genTrouverParametreOrthogonaliteNumeric() {
  // On fixe le coefficient de m à 1 dans le produit scalaire (troisième
  // composante de u égale à 1) : m = -(ux*vx + uy*vy) est alors TOUJOURS un
  // entier exact, par construction, sans recherche par tâtonnement ni boucle.
  const ux = nonZero(-6, 6);
  const uy = nonZero(-6, 6);
  const vx = nonZero(-6, 6);
  const vy = nonZero(-6, 6);
  const m = -(ux * vx + uy * vy);
  return {
    type: "numeric",
    chapter: "Orthogonalité et distances — Produit scalaire",
    prompt: `On considère \\(\\vec{u}(${ux} ; ${uy} ; 1)\\) et \\(\\vec{v}(${vx} ; ${vy} ; m)\\). Détermine la valeur de m pour que \\(\\vec{u}\\) et \\(\\vec{v}\\) soient orthogonaux.`,
    answer: m,
    steps: [
      { type: "regle", text: `\\text{Deux vecteurs sont orthogonaux si et seulement si leur produit scalaire est nul : on pose } \\vec{u} \\cdot \\vec{v} = 0 \\text{ puis on résout.}` },
      { type: "calcul", text: `${ux} \\times ${vx} + ${uy} \\times ${vy} + 1 \\times m = 0` },
      { type: "resultat", text: `m = ${m}` },
    ],
  };
}

// ---------- 11. Distance entre deux points de l'espace ----------
function genDistanceDeuxPointsNumeric() {
  const TRIPLETS_3D = [
    [1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11], [3, 4, 12, 13], [4, 4, 7, 9], [1, 4, 8, 9], [6, 6, 7, 11],
  ];
  const [dx0, dy0, dz0, norme0] = pick(TRIPLETS_3D);
  const signes = [pick([1, -1]), pick([1, -1]), pick([1, -1])];
  const A = point3(-6, 6);
  const B = {
    x: A.x + dx0 * signes[0],
    y: A.y + dy0 * signes[1],
    z: A.z + dz0 * signes[2],
  };
  return {
    type: "numeric",
    chapter: "Orthogonalité et distances — Distances",
    prompt: `Calcule la distance AB, avec \\(A(${A.x} ; ${A.y} ; ${A.z})\\) et \\(B(${B.x} ; ${B.y} ; ${B.z})\\).`,
    answer: norme0,
    steps: [
      { type: "regle", text: `\\text{Formule de référence : } AB = \\sqrt{(x_B-x_A)^2+(y_B-y_A)^2+(z_B-z_A)^2}.` },
      { type: "resultat", text: `AB = \\sqrt{(${B.x - A.x})^2 + (${B.y - A.y})^2 + (${B.z - A.z})^2} = \\sqrt{${norme0 * norme0}} = ${norme0}` },
    ],
  };
}

// ---------- 12. Équation d'un plan orthogonal à une droite (vecteur normal = vecteur directeur) ----------
function genPlanOrthogonalDroiteQCM() {
  const dir = { x: nonZero(-6, 6), y: nonZero(-6, 6), z: nonZero(-6, 6) };
  const correspondance = Math.random() < 0.5;
  const nPlan = correspondance ? { ...dir } : { x: dir.x + nonZero(1, 3), y: dir.y, z: dir.z };
  return {
    type: "qcm",
    chapter: "Orthogonalité et distances — Vecteur normal",
    prompt: `Une droite a pour vecteur directeur \\(\\vec{u}(${dir.x} ; ${dir.y} ; ${dir.z})\\). Un plan orthogonal à cette droite a pour vecteur normal \\(\\vec{n}(${nPlan.x} ; ${nPlan.y} ; ${nPlan.z})\\). Est-ce cohérent ?`,
    answer: correspondance ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Un plan est orthogonal à une droite si et seulement si le vecteur directeur de la droite est un vecteur normal du plan (colinéaire à celui-ci).}` },
      { type: "resultat", text: correspondance ? "Le vecteur directeur de la droite est bien un vecteur normal du plan orthogonal : c'est cohérent." : "Le vecteur normal donné n'est pas égal (ni colinéaire) au vecteur directeur de la droite : ce n'est pas cohérent." },
    ],
  };
}

// ---------- 13. Produit scalaire nul avec un vecteur normal (vérifier qu'un vecteur est dans le plan) ----------
function genVecteurDansLePlanQCM() {
  const n = { x: nonZero(-6, 6), y: nonZero(-6, 6), z: nonZero(-6, 6) };
  const dansLePlan = Math.random() < 0.5;
  let w;
  if (dansLePlan) {
    let wx, wy;
    do {
      wx = nonZero(-6, 6);
      wy = nonZero(-6, 6);
    } while ((n.x * wx + n.y * wy) % n.z !== 0);
    const wz = -(n.x * wx + n.y * wy) / n.z;
    w = { x: wx, y: wy, z: wz };
  } else {
    w = point3(-6, 6);
    if (w.x === 0) w.x = nonZero(-6, 6);
  }
  const produit = n.x * w.x + n.y * w.y + n.z * w.z;
  const reponse = produit === 0 ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Orthogonalité et distances — Vecteur normal",
    prompt: `Un plan a pour vecteur normal \\(\\vec{n}(${n.x} ; ${n.y} ; ${n.z})\\). Le vecteur \\(\\vec{w}(${w.x} ; ${w.y} ; ${w.z})\\) est-il un vecteur directeur possible de ce plan (c'est-à-dire orthogonal à \\(\\vec{n}\\)) ?`,
    answer: reponse,
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Un vecteur est dans la direction du plan si et seulement s'il est orthogonal au vecteur normal, donc si leur produit scalaire est nul.}` },
      { type: "donnee", text: `\\vec{n} \\cdot \\vec{w} = ${produit}` },
      { type: "resultat", text: reponse === "Oui" ? "Le produit scalaire est nul : le vecteur est bien dans la direction du plan." : "Le produit scalaire n'est pas nul : ce vecteur n'est pas dans la direction du plan." },
    ],
  };
}

// ---------- 14. Distance d'un point à un plan (cas particulier : point sur un axe) ----------
function genDistanceOrigineNumeric() {
  const TRIPLETS_3D = [
    [1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11], [3, 4, 12, 13], [4, 4, 7, 9],
  ];
  const [a0, b0, c0, norme0] = pick(TRIPLETS_3D);
  const kEcart = nonZero(1, 6);
  const d = kEcart * norme0;
  return {
    type: "numeric",
    chapter: "Orthogonalité et distances — Distance point-plan",
    prompt: `Un plan a pour équation \\(${texPlan(a0, b0, c0, d)}\\). Calcule la distance de l'origine O à ce plan.`,
    answer: kEcart,
    steps: [
      { type: "regle", text: `\\text{On applique la formule de distance point-plan (cas particulier de l'origine } O(0;0;0)\\text{).}` },
      { type: "resultat", text: `d(O, \\mathcal{P}) = \\dfrac{|${d}|}{\\sqrt{${a0}^2+${b0}^2+${c0}^2}} = \\dfrac{${d}}{${norme0}} = ${kEcart}` },
    ],
  };
}

// ---------- 15. Comparer deux distances point-plan ----------
function genComparerDistancesQCM() {
  const TRIPLETS_3D = [
    [1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11], [3, 4, 12, 13],
  ];
  const [a, b, c, norme] = pick(TRIPLETS_3D);
  const k1 = nonZero(1, 8);
  let k2 = nonZero(1, 8);
  while (k2 === k1) k2 = nonZero(1, 8);
  const plusLoin = k1 > k2 ? "M1" : "M2";
  return {
    type: "qcm",
    chapter: "Orthogonalité et distances — Distance point-plan",
    prompt: `Pour un même plan de vecteur normal de norme ${norme}, on calcule \\(|a x_{M_1} + b y_{M_1} + c z_{M_1} + d| = ${k1 * norme}\\) pour M1, et \\(|a x_{M_2} + b y_{M_2} + c z_{M_2} + d| = ${k2 * norme}\\) pour M2. Quel point est le plus éloigné du plan ?`,
    answer: plusLoin,
    options: ["M1", "M2"],
    steps: [
      { type: "regle", text: `\\text{Pour un même plan, le dénominateur (norme du vecteur normal) est identique pour les deux points : on compare directement les numérateurs, puis on divise.}` },
      { type: "donnee", text: `d(M_1) = \\dfrac{${k1 * norme}}{${norme}} = ${k1}` },
      { type: "donnee", text: `d(M_2) = \\dfrac{${k2 * norme}}{${norme}} = ${k2}` },
      { type: "resultat", text: `\\text{Le plus éloigné est } ${plusLoin}.` },
    ],
  };
}

const GENERATORS = [
  genProduitScalaireEspaceNumeric,
  genVerifierOrthogonaliteQCM,
  genVecteurNormalDepuisEquationNumeric,
  genCalculerDEquationPlanNumeric,
  genDistancePointPlanNumeric,
  genPointAppartientPlanQCM,
  genVecteursNormauxColineairesQCM,
  genNormeCarreVecteurNormalNumeric,
  genVraiFauxPositionsRelativesQCM,
  genTrouverParametreOrthogonaliteNumeric,
  genDistanceDeuxPointsNumeric,
  genPlanOrthogonalDroiteQCM,
  genVecteurDansLePlanQCM,
  genDistanceOrigineNumeric,
  genComparerDistancesQCM,
];

const DIFFICULTY = {
  genProduitScalaireEspaceNumeric: "facile",
  genVecteurNormalDepuisEquationNumeric: "facile",
  genNormeCarreVecteurNormalNumeric: "facile",
  genDistanceDeuxPointsNumeric: "facile",
  genDistanceOrigineNumeric: "facile",
  genVerifierOrthogonaliteQCM: "standard",
  genCalculerDEquationPlanNumeric: "standard",
  genPointAppartientPlanQCM: "standard",
  genVecteursNormauxColineairesQCM: "standard",
  genTrouverParametreOrthogonaliteNumeric: "standard",
  genPlanOrthogonalDroiteQCM: "standard",
  genVecteurDansLePlanQCM: "standard",
  genDistancePointPlanNumeric: "expert",
  genVraiFauxPositionsRelativesQCM: "expert",
  genComparerDistancesQCM: "expert",
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
    id: "orthogonalite-distances-espace-terminale-spe",
    title: "Orthogonalité et distances dans l'espace",
    description: "Produit scalaire de l'espace, orthogonalité de vecteurs, vecteur normal à un plan, équation d'un plan, distance d'un point à un plan, colinéarité de vecteurs normaux, positions relatives de droites et de plans.",
    pourquoi: "Le produit scalaire dans l'espace permet de calculer des distances et des angles en 3D : architecture, jeux vidéo, robotique.",
    level: "terminale-spe",
    free: false,
    order: 4,
  },
  generate,
};
