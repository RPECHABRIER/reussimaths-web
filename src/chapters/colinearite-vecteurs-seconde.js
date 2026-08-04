// ---------------------------------------------------------------------------
// Chapitre : Colinéarité de vecteurs (2nde) — sous abonnement.
//
// Correspond au chapitre 7 du manuel de 2nde : déterminant de deux vecteurs
// (xy' - x'y), critère de colinéarité, application à l'alignement de trois
// points, au parallélisme de deux droites, résolution d'une équation pour
// qu'un vecteur soit colinéaire à un autre, coefficient de colinéarité,
// vecteurs directeurs d'une droite.
// La correction du livre du professeur (exercices 19-40 : déterminant,
// colinéarité, alignement, parallélisme) a servi à identifier la méthode ;
// les nombres et noms de points sont générés aléatoirement à chaque tirage.
// Voir automatismes-seconde.js (thème "colinearite-vecteurs-seconde") pour
// les mini-exercices "Calcul mental" associés.
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

const nomsPoints = ["A", "B", "C", "D", "M", "N", "P"];
function points4() {
  return shuffle(nomsPoints).slice(0, 4);
}

// ---------- 1. Calculer le déterminant de deux vecteurs ----------
function genCalculDeterminantNumeric() {
  const a = randInt(-9, 9);
  const b = randInt(-9, 9);
  const c = randInt(-9, 9);
  const d = randInt(-9, 9);
  const det = a * d - b * c;
  return {
    type: "numeric",
    chapter: "Colinéarité — Déterminant de deux vecteurs",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\) et \\(\\vec{v}(${c} ; ${d})\\). Calcule le déterminant \\(\\det(\\vec{u} , \\vec{v}) = x_{\\vec{u}} y_{\\vec{v}} - x_{\\vec{v}} y_{\\vec{u}}\\).`,
    answer: det,
    steps: [{ type: "calcul", text: `${a} \\times ${d} - ${c} \\times ${b} = ${a * d} - ${c * b} = ${det}` }],
  };
}

// ---------- 2. Deux vecteurs sont-ils colinéaires ? ----------
function genVecteursColineaireQCM() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const colineaires = Math.random() < 0.5;
  const k = nonZero(-4, 4);
  let c, d;
  if (colineaires) {
    c = k * a;
    d = k * b;
  } else {
    c = k * a + nonZero(1, 3);
    d = k * b;
  }
  const det = a * d - b * c;
  return {
    type: "qcm",
    chapter: "Colinéarité — Reconnaître deux vecteurs colinéaires",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\) et \\(\\vec{v}(${c} ; ${d})\\). Ces deux vecteurs sont-ils colinéaires ?`,
    answer: det === 0 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Deux vecteurs sont colinéaires si et seulement si leur déterminant est nul : } \\det(\\vec{u},\\vec{v}) = x_{\\vec{u}} y_{\\vec{v}} - x_{\\vec{v}} y_{\\vec{u}} = 0.` },
      { type: "calcul", text: `\\det(\\vec{u} , \\vec{v}) = ${a} \\times ${d} - ${c} \\times ${b} = ${det}` },
      { type: "resultat", text: det === 0 ? `\\text{Le déterminant est nul : les vecteurs sont colinéaires.}` : `\\text{Le déterminant n'est pas nul : les vecteurs ne sont pas colinéaires.}` },
    ],
  };
}

// ---------- 3. Alignement de trois points via le déterminant ----------
function genAlignementViaDeterminantQCM() {
  const [nomA, nomB, nomC] = points4();
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const dx = nonZero(-4, 4);
  const dy = nonZero(-4, 4);
  const alignes = Math.random() < 0.5;
  let k1 = nonZero(-3, 3);
  let k2 = nonZero(-3, 3);
  while (k2 === k1) k2 = nonZero(-3, 3);
  const xB = xA + k1 * dx;
  const yB = yA + k1 * dy;
  const xC = alignes ? xA + k2 * dx : xA + k2 * dx + nonZero(1, 3);
  const yC = alignes ? yA + k2 * dy : yA + k2 * dy;
  const detAB_AC = (xB - xA) * (yC - yA) - (xC - xA) * (yB - yA);
  const reponse = detAB_AC === 0 ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Colinéarité — Alignement de points",
    prompt: `${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}), ${nomC}(${xC} ; ${yC}). En utilisant le déterminant des vecteurs ${`\\overrightarrow{${nomA}${nomB}}`} et ${`\\overrightarrow{${nomA}${nomC}}`}, ces trois points sont-ils alignés ?`,
    answer: reponse,
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{A, B, C sont alignés si et seulement si les vecteurs } \\overrightarrow{AB} \\text{ et } \\overrightarrow{AC} \\text{ sont colinéaires, c'est-à-dire si leur déterminant est nul.}` },
      { type: "calcul", text: `\\det(\\overrightarrow{${nomA}${nomB}} , \\overrightarrow{${nomA}${nomC}}) = ${xB - xA} \\times ${yC - yA} - ${xC - xA} \\times ${yB - yA} = ${detAB_AC}` },
      { type: "resultat", text: reponse === "Oui" ? `\\text{Le déterminant est nul : les points sont alignés.}` : `\\text{Le déterminant n'est pas nul : les points ne sont pas alignés.}` },
    ],
  };
}

// ---------- 4. Parallélisme de deux droites via colinéarité ----------
function genParallelismeDroitesQCM() {
  const [nomA, nomB, nomC, nomD] = points4();
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const xB = randInt(-8, 8);
  const yB = randInt(-8, 8);
  const dxAB = xB - xA;
  const dyAB = yB - yA;
  const paralleles = Math.random() < 0.5;
  const k = nonZero(-3, 3);
  const xC = randInt(-8, 8);
  const yC = randInt(-8, 8);
  const xD = paralleles ? xC + k * dxAB : xC + k * dxAB + nonZero(1, 3);
  const yD = paralleles ? yC + k * dyAB : yC + k * dyAB;
  const dxCD = xD - xC;
  const dyCD = yD - yC;
  const det = dxAB * dyCD - dxCD * dyAB;
  return {
    type: "qcm",
    chapter: "Colinéarité — Parallélisme de deux droites",
    prompt: `${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}), ${nomC}(${xC} ; ${yC}), ${nomD}(${xD} ; ${yD}). Les droites (${nomA}${nomB}) et (${nomC}${nomD}) sont-elles parallèles ?`,
    answer: det === 0 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Deux droites sont parallèles si et seulement si leurs vecteurs directeurs sont colinéaires, c'est-à-dire si le déterminant de ces vecteurs est nul.}` },
      { type: "calcul", text: `\\det(\\overrightarrow{${nomA}${nomB}} , \\overrightarrow{${nomC}${nomD}}) = ${dxAB} \\times ${dyCD} - ${dxCD} \\times ${dyAB} = ${det}` },
      { type: "resultat", text: det === 0 ? `\\text{Les vecteurs directeurs sont colinéaires : les droites sont parallèles.}` : `\\text{Les vecteurs directeurs ne sont pas colinéaires : les droites ne sont pas parallèles.}` },
    ],
  };
}

// ---------- 5. Trouver une coordonnée pour que deux vecteurs soient colinéaires ----------
function genTrouverParametreColinéaireNumeric() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const k = nonZero(-4, 4);
  const demanderAbscisseDeV = Math.random() < 0.5;
  const xV = k * a;
  const yV = k * b;
  return {
    type: "numeric",
    chapter: "Colinéarité — Résoudre une équation de colinéarité",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\). Détermine ${demanderAbscisseDeV ? "l'abscisse" : "l'ordonnée"} du vecteur \\(\\vec{v}(${demanderAbscisseDeV ? "x" : xV} ; ${demanderAbscisseDeV ? yV : "y"})\\) pour que \\(\\vec{u}\\) et \\(\\vec{v}\\) soient colinéaires.`,
    answer: demanderAbscisseDeV ? xV : yV,
    steps: [
      { type: "regle", text: `\\text{Deux vecteurs sont colinéaires si et seulement si leur déterminant est nul : on pose } \\det(\\vec{u},\\vec{v}) = 0 \\text{, soit } ${a} \\times y_{\\vec{v}} - x_{\\vec{v}} \\times ${b} = 0.` },
      { type: "resultat", text: demanderAbscisseDeV ? `${a} \\times ${yV} - x \\times ${b} = 0 \\text{, donc } x = ${xV}` : `${a} \\times y - ${xV} \\times ${b} = 0 \\text{, donc } y = ${yV}` },
    ],
  };
}

// ---------- 6. Reconnaître par inspection si un vecteur est un multiple d'un autre ----------
function genReconnaitreColineaireMultipleQCM() {
  const a = nonZero(-6, 6);
  const b = nonZero(-6, 6);
  const estMultiple = Math.random() < 0.5;
  const k = nonZero(2, 4);
  const c = estMultiple ? k * a : k * a + nonZero(1, 3);
  const d = estMultiple ? k * b : k * b;
  const det = a * d - b * c;
  const reponse = det === 0 ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Colinéarité — Reconnaître deux vecteurs colinéaires",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\) et \\(\\vec{v}(${c} ; ${d})\\). Le vecteur \\(\\vec{v}\\) est-il un multiple du vecteur \\(\\vec{u}\\) (c'est-à-dire \\(\\vec{u}\\) et \\(\\vec{v}\\) colinéaires) ?`,
    answer: reponse,
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\vec{v} \\text{ est un multiple de } \\vec{u} \\text{ (donc colinéaire à } \\vec{u}\\text{) s'il existe un nombre k tel que chaque coordonnée de } \\vec{v} \\text{ vaut k fois la coordonnée correspondante de } \\vec{u}.` },
      { type: "resultat", text: reponse === "Oui" ? `\\vec{v} = ${k}\\vec{u} : \\text{ oui, c'est bien un multiple.}` : `\\text{Il n'existe pas de nombre k tel que } \\vec{v} = k\\vec{u}.` },
    ],
  };
}

// ---------- 7. Vrai ou faux sur les propriétés de la colinéarité ----------
function genVraiFauxColinéariteQCM() {
  const cas = pick([
    {
      affirmation: "Si deux vecteurs sont colinéaires, alors ils sont nécessairement égaux.",
      reponse: "Faux",
      explication: `\\text{Deux vecteurs colinéaires ont la même direction, mais peuvent avoir des normes ou des sens différents (} \\vec{v} = k\\vec{u} \\text{ avec } k \\neq 1 \\text{, par exemple).}`,
    },
    {
      affirmation: "Le vecteur nul est colinéaire à tout vecteur.",
      reponse: "Vrai",
      explication: `\\text{Pour tout } \\vec{u}(x;y), \\ \\det(\\vec{u}, \\vec{0}) = x \\times 0 - 0 \\times y = 0 : \\text{ le déterminant est toujours nul, donc le vecteur nul est colinéaire à tout vecteur.}`,
    },
    {
      affirmation: "Deux vecteurs colinéaires ont forcément la même norme.",
      reponse: "Faux",
      explication: `\\text{Si } \\vec{v} = k\\vec{u}, \\text{ alors } \\|\\vec{v}\\| = |k| \\times \\|\\vec{u}\\| : \\text{ les normes ne sont égales que si } |k| = 1.`,
    },
    {
      affirmation: "Si trois points sont alignés, alors deux vecteurs formés à partir de ces points sont colinéaires.",
      reponse: "Vrai",
      explication: `\\text{C'est la définition même de l'alignement : A, B, C sont alignés si et seulement si } \\overrightarrow{AB} \\text{ et } \\overrightarrow{AC} \\text{ sont colinéaires.}`,
    },
    {
      affirmation: "Si le déterminant de deux vecteurs est nul, alors ces vecteurs sont colinéaires.",
      reponse: "Vrai",
      explication: `\\text{C'est exactement le critère de colinéarité : } \\det(\\vec{u},\\vec{v}) = 0 \\iff \\vec{u} \\text{ et } \\vec{v} \\text{ sont colinéaires.}`,
    },
    {
      affirmation: "Deux droites de vecteurs directeurs colinéaires sont toujours confondues.",
      reponse: "Faux",
      explication: `\\text{Des vecteurs directeurs colinéaires garantissent que les droites sont parallèles, mais elles peuvent être strictement parallèles (disjointes) ou confondues — il faut vérifier en plus qu'elles partagent un point.}`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Colinéarité — Propriétés",
    prompt: `Affirmation : « ${cas.affirmation} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "resultat", text: cas.explication }],
  };
}

// ---------- 8. Trouver le coefficient de colinéarité ----------
function genCoefficientColinéaireNumeric() {
  const a = nonZero(-8, 8);
  const b = randInt(-8, 8);
  const k = nonZero(-5, 5);
  return {
    type: "numeric",
    chapter: "Colinéarité — Coefficient de colinéarité",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\) et \\(\\vec{v}(${k * a} ; ${k * b})\\) sont colinéaires, avec \\(\\vec{v} = k\\vec{u}\\). Détermine k.`,
    answer: k,
    steps: [
      { type: "regle", text: `\\text{Si } \\vec{v} = k\\vec{u} \\text{ avec } x_{\\vec{u}} \\neq 0, \\text{ alors } k \\text{ est le rapport entre coordonnées correspondantes : } k = \\dfrac{x_{\\vec{v}}}{x_{\\vec{u}}}.` },
      { type: "resultat", text: `k = \\dfrac{x_{\\vec{v}}}{x_{\\vec{u}}} = \\dfrac{${k * a}}{${a}} = ${k}` },
    ],
  };
}

// ---------- 9. Deux droites : parallèles ou sécantes ? ----------
function genDroitesParallelesOuSecantesQCM() {
  const dxAB = nonZero(-8, 8);
  const dyAB = nonZero(-8, 8);
  const paralleles = Math.random() < 0.5;
  const k = nonZero(-3, 3);
  const dxCD = paralleles ? k * dxAB : nonZero(-8, 8);
  let dyCD = paralleles ? k * dyAB : nonZero(-8, 8);
  let det = dxAB * dyCD - dxCD * dyAB;
  while (!paralleles && det === 0) {
    dyCD = nonZero(-8, 8);
    det = dxAB * dyCD - dxCD * dyAB;
  }
  const reponse = det === 0 ? "parallèles" : "sécantes";
  return {
    type: "qcm",
    chapter: "Colinéarité — Parallélisme de deux droites",
    prompt: `La droite (d) a pour vecteur directeur \\(\\vec{u}(${dxAB} ; ${dyAB})\\) et la droite (d') a pour vecteur directeur \\(\\vec{v}(${dxCD} ; ${dyCD})\\). Ces deux droites sont-elles parallèles ou sécantes ?`,
    answer: reponse,
    options: ["parallèles", "sécantes"],
    steps: [
      { type: "regle", text: `\\text{Deux droites sont parallèles si et seulement si leurs vecteurs directeurs sont colinéaires (déterminant nul) ; sinon elles sont sécantes.}` },
      { type: "calcul", text: `\\det(\\vec{u},\\vec{v}) = ${dxAB} \\times ${dyCD} - ${dxCD} \\times ${dyAB} = ${det}` },
      { type: "resultat", text: reponse === "parallèles" ? `\\text{Le déterminant est nul : les droites sont parallèles.}` : `\\text{Le déterminant n'est pas nul : les droites sont sécantes.}` },
    ],
  };
}

// ---------- 10. Trouver une coordonnée manquante pour un alignement ----------
function genCoordonneeInconnuePourAlignementNumeric() {
  const [nomA, nomB, nomC] = points4();
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const dx = nonZero(-4, 4);
  const dy = nonZero(-4, 4);
  const xB = xA + dx;
  const yB = yA + dy;
  const t = nonZero(-3, 3);
  const xC = xA + t * dx;
  const yCfinal = yA + t * dy;
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Colinéarité — Alignement de points",
    prompt: `${nomA}(${xA} ; ${yA}) et ${nomB}(${xB} ; ${yB}). Le point ${nomC} de coordonnées \\(${demanderAbscisse ? `(x ; ${yCfinal})` : `(${xC} ; y)`}\\) est aligné avec ${nomA} et ${nomB}. Détermine ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ${nomC}.`,
    answer: demanderAbscisse ? xC : yCfinal,
    steps: [
      { type: "regle", text: `\\text{A, B, C alignés} \\iff \\det(\\overrightarrow{AB}, \\overrightarrow{AC}) = 0.` },
      { type: "donnee", text: `\\overrightarrow{${nomA}${nomB}}(${dx} ; ${dy})` },
      { type: "calcul", text: `\\det(\\overrightarrow{${nomA}${nomB}}, \\overrightarrow{${nomA}${nomC}}) = 0` },
      { type: "resultat", text: demanderAbscisse ? `${dx} \\times (${yCfinal} - ${yA}) - x_{${nomC}} \\times ${dy} = 0 \\text{, en résolvant : } x_{${nomC}} = ${xC}` : `${dx} \\times y_{${nomC}} - (${xC} - ${xA}) \\times ${dy} = 0 \\text{, en résolvant : } y_{${nomC}} = ${yCfinal}` },
    ],
  };
}

// ---------- 11. Un vecteur est-il colinéaire à un axe du repère ? ----------
function genVecteurColineaireAxeQCM() {
  const axeHorizontal = Math.random() < 0.5;
  const a = axeHorizontal ? nonZero(-9, 9) : 0;
  const b = axeHorizontal ? 0 : nonZero(-9, 9);
  return {
    type: "qcm",
    chapter: "Colinéarité — Vecteurs colinéaires aux axes",
    prompt: `Le vecteur \\(\\vec{u}(${a} ; ${b})\\) est-il colinéaire à l'axe des ${axeHorizontal ? "abscisses" : "ordonnées"} ?`,
    answer: "Oui",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{L'axe des abscisses est dirigé par le vecteur } (1;0), \\text{ l'axe des ordonnées par } (0;1). \\text{ Un vecteur } (x;0) \\text{ est colinéaire à l'axe des abscisses ; un vecteur } (0;y) \\text{ est colinéaire à l'axe des ordonnées.}` },
      { type: "resultat", text: axeHorizontal ? `\\vec{u} \\text{ a une ordonnée nulle : il est colinéaire à l'axe des abscisses.}` : `\\vec{u} \\text{ a une abscisse nulle : il est colinéaire à l'axe des ordonnées.}` },
    ],
  };
}

// ---------- 12. Vérifier la colinéarité d'un vecteur construit par multiplication ----------
function genConstruireVecteurColineaireDeterminantNumeric() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const k = nonZero(-4, 4);
  return {
    type: "numeric",
    chapter: "Colinéarité — Déterminant de deux vecteurs",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\) et \\(\\vec{v} = ${k}\\vec{u}\\). Calcule le déterminant \\(\\det(\\vec{u} , \\vec{v})\\) (il doit être nul, car les vecteurs sont colinéaires par construction).`,
    answer: 0,
    steps: [
      { type: "donnee", text: `\\vec{v}(${k * a} ; ${k * b})` },
      { type: "resultat", text: `\\det(\\vec{u},\\vec{v}) = ${a} \\times ${k * b} - ${k * a} \\times ${b} = ${a * k * b} - ${k * a * b} = 0` },
    ],
  };
}

// ---------- 13. Le vecteur nul est-il colinéaire à tout vecteur ? ----------
function genColineaireAvecVecteurNulQCM() {
  const a = nonZero(-9, 9);
  const b = randInt(-9, 9);
  return {
    type: "qcm",
    chapter: "Colinéarité — Propriétés",
    prompt: `\\(\\vec{u}(${a} ; ${b})\\) et \\(\\vec{0}(0 ; 0)\\). Ces deux vecteurs sont-ils colinéaires ?`,
    answer: "Oui",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `\\det(\\vec{u}, \\vec{0}) = ${a} \\times 0 - 0 \\times ${b} = 0` },
      { type: "resultat", text: `\\text{Le déterminant est nul : le vecteur nul est colinéaire à tout vecteur.}` },
    ],
  };
}

// ---------- 14. Identifier un vecteur directeur parmi plusieurs propositions ----------
function genVecteurDirecteurDroiteQCM() {
  const dx = nonZero(-6, 6);
  let dy = nonZero(-6, 6);
  while (dy === dx || dy === -dx) dy = nonZero(-6, 6);
  const k = nonZero(2, 4);
  const bonneReponse = `(${k * dx} ; ${k * dy})`;
  const mauvaise1 = `(${dy} ; ${dx})`;
  const mauvaise2 = `(${dx + nonZero(1, 3)} ; ${dy})`;
  return {
    type: "qcm",
    chapter: "Colinéarité — Vecteurs directeurs d'une droite",
    prompt: `Une droite (d) admet \\(\\vec{u}(${dx} ; ${dy})\\) comme vecteur directeur. Parmi les vecteurs suivants, lequel est aussi un vecteur directeur de (d) ?`,
    answer: bonneReponse,
    options: shuffle([bonneReponse, mauvaise1, mauvaise2]),
    steps: [
      { type: "regle", text: `\\text{Un vecteur directeur de (d) doit être colinéaire à } \\vec{u}.` },
      { type: "resultat", text: `${bonneReponse} = ${k}\\vec{u} : \\text{ il convient.}` },
    ],
  };
}

// ---------- 15. Résoudre une équation de colinéarité (inconnue dans le premier vecteur) ----------
function genResoudreEquationColineaireAutreInconnueNumeric() {
  const c = nonZero(-8, 8);
  const d = nonZero(-8, 8);
  const k = nonZero(-4, 4);
  // On veut u = (x ; y) colinéaire à v(c ; d), avec u = k * v (pour garder un résultat exact).
  const xU = k * c;
  const yU = k * d;
  const demanderAbscisseDeU = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Colinéarité — Résoudre une équation de colinéarité",
    prompt: `\\(\\vec{v}(${c} ; ${d})\\). Détermine ${demanderAbscisseDeU ? "l'abscisse" : "l'ordonnée"} du vecteur \\(\\vec{u}(${demanderAbscisseDeU ? "x" : xU} ; ${demanderAbscisseDeU ? yU : "y"})\\) pour que \\(\\vec{u}\\) et \\(\\vec{v}\\) soient colinéaires.`,
    answer: demanderAbscisseDeU ? xU : yU,
    steps: [
      { type: "regle", text: `\\text{Deux vecteurs sont colinéaires si et seulement si leur déterminant est nul : on pose } \\det(\\vec{u},\\vec{v}) = 0 \\text{, soit } x_{\\vec{u}} \\times ${d} - ${c} \\times y_{\\vec{u}} = 0.` },
      { type: "resultat", text: demanderAbscisseDeU ? `x \\times ${d} - ${c} \\times ${yU} = 0 \\text{, donc } x = ${xU}` : `${xU} \\times ${d} - ${c} \\times y = 0 \\text{, donc } y = ${yU}` },
    ],
  };
}

const GENERATORS = [
  genCalculDeterminantNumeric,
  genVecteursColineaireQCM,
  genAlignementViaDeterminantQCM,
  genParallelismeDroitesQCM,
  genTrouverParametreColinéaireNumeric,
  genReconnaitreColineaireMultipleQCM,
  genVraiFauxColinéariteQCM,
  genCoefficientColinéaireNumeric,
  genDroitesParallelesOuSecantesQCM,
  genCoordonneeInconnuePourAlignementNumeric,
  genVecteurColineaireAxeQCM,
  genConstruireVecteurColineaireDeterminantNumeric,
  genColineaireAvecVecteurNulQCM,
  genVecteurDirecteurDroiteQCM,
  genResoudreEquationColineaireAutreInconnueNumeric,
];

const DIFFICULTY = {
  genCalculDeterminantNumeric: "facile",
  genVecteursColineaireQCM: "facile",
  genReconnaitreColineaireMultipleQCM: "facile",
  genVecteurColineaireAxeQCM: "facile",
  genColineaireAvecVecteurNulQCM: "facile",
  genAlignementViaDeterminantQCM: "standard",
  genParallelismeDroitesQCM: "standard",
  genTrouverParametreColinéaireNumeric: "standard",
  genVraiFauxColinéariteQCM: "standard",
  genCoefficientColinéaireNumeric: "standard",
  genDroitesParallelesOuSecantesQCM: "standard",
  genVecteurDirecteurDroiteQCM: "standard",
  genCoordonneeInconnuePourAlignementNumeric: "expert",
  genConstruireVecteurColineaireDeterminantNumeric: "expert",
  genResoudreEquationColineaireAutreInconnueNumeric: "expert",
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
    id: "colinearite-vecteurs-seconde",
    title: "Colinéarité de vecteurs",
    description: "Déterminant de deux vecteurs, critère de colinéarité, alignement de points, parallélisme de droites, coefficient de colinéarité, vecteurs directeurs.",
    pourquoi: "La colinéarité de vecteurs permet de démontrer un alignement ou un parallélisme sans mesurer sur une figure — un outil clé en géométrie comme en physique (forces, vitesses).",
    level: "seconde",
    free: false,
    order: 9,
  },
  generate,
};
