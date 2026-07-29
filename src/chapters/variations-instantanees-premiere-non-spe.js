// ---------------------------------------------------------------------------
// Chapitre : Variations instantanées (Première, enseignement mathématique
// non spé) — sous abonnement.
//
// Correspond au chapitre 5 du programme d'enseignement mathématique de
// première (non spécialité) : nombre dérivé f'(a) comme coefficient
// directeur de la tangente à la courbe au point d'abscisse a (calcul depuis
// deux points de la tangente ou depuis un déplacement horizontal/vertical),
// tangente horizontale équivalente à f'(a) = 0, nombre dérivé d'une fonction
// affine égal à son coefficient directeur (constant), équation de la
// tangente en un point, signe du nombre dérivé et sens de variation local,
// interprétation physique (vitesse = nombre dérivé de la position,
// accélération = nombre dérivé de la vitesse), lecture de tableaux de
// valeurs (a ; f(a) ; f'(a)).
// La correction du livre du professeur (source .tex, exercices 6-33 :
// Automatismes méthodes 1-2 sur les tangentes et le nombre dérivé) a servi à
// identifier la méthode ; les nombres et contextes sont générés
// aléatoirement à chaque tirage.
// Voir automatismes-premiere-non-spe.js (thème
// "variations-instantanees-premiere-non-spe") pour les mini-exercices
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

function texAffine(m, p) {
  const termeM = m === 1 ? "x" : m === -1 ? "-x" : `${m}x`;
  if (p === 0) return termeM;
  return `${termeM} ${p >= 0 ? "+" : "-"} ${Math.abs(p)}`;
}

// ---------- 1. Nombre dérivé depuis deux points de la tangente ----------
function genNombreDeriveDeuxPointsNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-6, 6);
  const xA = randInt(-8, 8);
  let xB = randInt(-8, 8);
  while (xB === xA) xB = randInt(-8, 8);
  const m = nonZero(-6, 6);
  const p = randInt(-10, 10);
  const yA = m * xA + p;
  const yB = m * xB + p;
  return {
    type: "numeric",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `La tangente à la courbe représentative de ${nomFonction} au point d'abscisse ${a} passe par les points \\(A(${xA} ; ${yA})\\) et \\(B(${xB} ; ${yB})\\). Calcule \\(${nomFonction}'(${a})\\).`,
    answer: m,
    steps: [`${nomFonction}'(${a}) = \\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{${yB} - (${yA})}{${xB} - (${xA})} = ${m}`],
  };
}

// ---------- 2. Nombre dérivé depuis un déplacement d'une unité sur la tangente ----------
function genNombreDeriveDeplacementNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-5, 5);
  const variation = nonZero(-8, 8);
  return {
    type: "numeric",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `Sur la tangente à la courbe représentative de ${nomFonction} au point d'abscisse ${a}, lorsqu'on se déplace d'une unité vers la droite, l'ordonnée ${variation >= 0 ? "augmente" : "diminue"} de ${Math.abs(variation)}. Calcule \\(${nomFonction}'(${a})\\).`,
    answer: variation,
    steps: [`${nomFonction}'(${a}) = ${variation}`],
  };
}

// ---------- 3. Tangente horizontale équivaut à un nombre dérivé nul ----------
function genTangenteHorizontaleQCM() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-5, 5);
  const horizontale = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `La tangente à la courbe représentative de ${nomFonction} au point d'abscisse ${a} est ${horizontale ? "horizontale" : "non horizontale, de coefficient directeur 3"}. Que peut-on en déduire sur \\(${nomFonction}'(${a})\\) ?`,
    answer: horizontale ? `${nomFonction}'(${a}) = 0` : `${nomFonction}'(${a}) = 3`,
    options: [`${nomFonction}'(${a}) = 0`, `${nomFonction}'(${a}) = 3`],
    steps: [horizontale ? "Une tangente horizontale a un coefficient directeur nul, donc le nombre dérivé vaut 0." : "Le nombre dérivé est égal au coefficient directeur de la tangente, soit 3."],
  };
}

// ---------- 4. Nombre dérivé d'une fonction affine (constant, égal à son coefficient directeur) ----------
function genNombreDeriveFonctionAffineNumeric() {
  const m = nonZero(-9, 9);
  const p = randInt(-15, 15);
  const a = randInt(-10, 10);
  return {
    type: "numeric",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `On considère la fonction affine f définie par \\(f(x) = ${texAffine(m, p)}\\). Calcule \\(f'(${a})\\).`,
    answer: m,
    steps: [`\\text{La courbe de f est une droite : la tangente en tout point est confondue avec cette droite.}`, `f'(${a}) = m = ${m}`],
  };
}

// ---------- 5. Équation de la tangente en un point ----------
function genEquationTangenteNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-6, 6);
  const fa = randInt(-10, 10);
  const fprime = nonZero(-6, 6);
  const x = randInt(-8, 8);
  // Équation de la tangente : y = f'(a)(x - a) + f(a). On demande l'image par la tangente en un point x.
  const answer = fprime * (x - a) + fa;
  return {
    type: "numeric",
    chapter: "Variations instantanées — Tangente",
    prompt: `On sait que \\(${nomFonction}(${a}) = ${fa}\\) et \\(${nomFonction}'(${a}) = ${fprime}\\). La tangente à la courbe de ${nomFonction} au point d'abscisse ${a} a pour équation \\(y = ${nomFonction}'(${a})(x - ${a}) + ${nomFonction}(${a})\\). Calcule l'ordonnée du point de cette tangente d'abscisse ${x}.`,
    answer,
    steps: [`y = ${fprime}(${x} - ${a}) + ${fa} = ${fprime} \\times ${x - a} + ${fa} = ${answer}`],
  };
}

// ---------- 6. Interprétation physique : vitesse = nombre dérivé de la position ----------
function genVitesseDeriveePositionNumeric() {
  const t = randInt(1, 10);
  const xA = t;
  const xB = t + 1;
  const yA = randInt(10, 60);
  const vitesse = nonZero(5, 40);
  const yB = yA + vitesse;
  return {
    type: "numeric",
    chapter: "Variations instantanées — Interprétation physique",
    prompt: `La distance parcourue par un mobile est donnée par une fonction f. La tangente à la courbe de f au point d'abscisse ${t} passe par \\(A(${xA} ; ${yA})\\) et \\(B(${xB} ; ${yB})\\). Calcule la vitesse du mobile à l'instant \\(t = ${t}\\) s (en m/s), sachant que la vitesse est égale au nombre dérivé de la position.`,
    answer: vitesse,
    steps: [`f'(${t}) = \\dfrac{${yB} - ${yA}}{${xB} - ${xA}} = ${vitesse} \\text{ m/s}`],
  };
}

// ---------- 7. Interprétation physique : accélération = nombre dérivé de la vitesse ----------
function genAccelerationDeriveeVitesseNumeric() {
  const vitesseA = randInt(5, 30);
  const duree = pick([1, 2, 4, 5]);
  const acceleration = nonZero(2, 15);
  const vitesseB = vitesseA + acceleration * duree;
  return {
    type: "numeric",
    chapter: "Variations instantanées — Interprétation physique",
    prompt: `La vitesse d'un véhicule, en m/s, est une fonction affine du temps. Elle passe de ${vitesseA} m/s à ${vitesseB} m/s en ${duree} secondes. Sachant que l'accélération est égale au nombre dérivé de la vitesse (constant pour une fonction affine), calcule l'accélération du véhicule (en m/s²).`,
    answer: acceleration,
    steps: [`\\dfrac{${vitesseB} - ${vitesseA}}{${duree}} = ${acceleration} \\text{ m/s}^2`],
  };
}

// ---------- 8. Signe du nombre dérivé et sens de variation local ----------
function genSigneNombreDeriveQCM() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-5, 5);
  const fprime = nonZero(-8, 8);
  return {
    type: "qcm",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `On sait que \\(${nomFonction}'(${a}) = ${fprime}\\). Que peut-on en déduire sur le comportement local de ${nomFonction} au voisinage de ${a} ?`,
    answer: fprime > 0 ? `${nomFonction} \\text{ est localement croissante}` : `${nomFonction} \\text{ est localement décroissante}`,
    options: [`${nomFonction} \\text{ est localement croissante}`, `${nomFonction} \\text{ est localement décroissante}`],
    steps: [fprime > 0 ? `${nomFonction}'(${a}) > 0 \\text{ donc } ${nomFonction} \\text{ est localement croissante en } ${a}.` : `${nomFonction}'(${a}) < 0 \\text{ donc } ${nomFonction} \\text{ est localement décroissante en } ${a}.`],
  };
}

// ---------- 9. Lecture d'un tableau de valeurs (a ; f(a) ; f'(a)) ----------
function genLectureTableauNombreDeriveNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const abscisses = [-2, -1, 1, 2, 3];
  const valeurs = abscisses.map(() => roundTo(randInt(-20, 20) / 10, 1));
  const derivees = abscisses.map(() => nonZero(-20, 20) / 10);
  const indexChoisi = randInt(0, abscisses.length - 1);
  const ligneA = abscisses.map((a) => a).join(" & ");
  const ligneF = valeurs.map((v) => fr(v)).join(" & ");
  const ligneFprime = derivees.map((v) => fr(roundTo(v, 1))).join(" & ");
  return {
    type: "numeric",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `Un tableau donne, pour une fonction ${nomFonction} : a = [${abscisses.join(" ; ")}], ${nomFonction}(a) = [${valeurs.map((v) => fr(v)).join(" ; ")}], ${nomFonction}'(a) = [${derivees.map((v) => fr(roundTo(v, 1))).join(" ; ")}]. Donne la valeur de \\(${nomFonction}'(${abscisses[indexChoisi]})\\).`,
    answer: roundTo(derivees[indexChoisi], 1),
    steps: [`${nomFonction}'(${abscisses[indexChoisi]}) = ${fr(roundTo(derivees[indexChoisi], 1))}`],
  };
}

// ---------- 10. Comparer deux nombres dérivés ----------
function genComparerNombresDerivesQCM() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-5, 5);
  let b = randInt(-5, 5);
  while (b === a) b = randInt(-5, 5);
  const fprimeA = nonZero(-8, 8);
  let fprimeB = nonZero(-8, 8);
  while (fprimeB === fprimeA) fprimeB = nonZero(-8, 8);
  const plusGrand = fprimeA > fprimeB ? a : b;
  return {
    type: "qcm",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `On sait que \\(${nomFonction}'(${a}) = ${fprimeA}\\) et \\(${nomFonction}'(${b}) = ${fprimeB}\\). En quel point la tangente a-t-elle le coefficient directeur le plus élevé ?`,
    answer: `${nomFonction}'(${plusGrand})`,
    options: [`${nomFonction}'(${a})`, `${nomFonction}'(${b})`],
    steps: [`\\max(${fprimeA} ; ${fprimeB}) = ${Math.max(fprimeA, fprimeB)}, \\text{ atteint en } ${plusGrand}`],
  };
}

// ---------- 11. Identifier l'abscisse où la tangente est horizontale ----------
function genIdentifierTangenteHorizontaleQCM() {
  const nomFonction = pick(["f", "g", "h"]);
  const abscisses = shuffle([-2, -1, 0, 1, 2]).slice(0, 3);
  const indexHorizontale = randInt(0, abscisses.length - 1);
  const valeurs = abscisses.map((a, i) => (i === indexHorizontale ? 0 : nonZero(-6, 6)));
  return {
    type: "qcm",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `On donne : ${abscisses.map((a, i) => `${nomFonction}'(${a}) = ${valeurs[i]}`).join(", ")}. En quel point d'abscisse la tangente à la courbe de ${nomFonction} est-elle horizontale ?`,
    answer: `${abscisses[indexHorizontale]}`,
    options: abscisses.map(String),
    steps: [`\\text{La tangente est horizontale là où le nombre dérivé est nul : en } ${abscisses[indexHorizontale]}`],
  };
}

// ---------- 12. Vrai ou faux sur le nombre dérivé ----------
function genVraiFauxNombreDeriveQCM() {
  const cas = pick([
    { description: "Le nombre dérivé f'(a) est le coefficient directeur de la tangente à la courbe de f au point d'abscisse a.", reponse: "Vrai" },
    { description: "Si f'(a) > 0, alors f(a) est nécessairement positif.", reponse: "Faux" },
    { description: "Le nombre dérivé d'une fonction affine est constant, quel que soit le point considéré.", reponse: "Vrai" },
    { description: "Une tangente horizontale signifie que le nombre dérivé en ce point est égal à 1.", reponse: "Faux" },
    { description: "Si la tangente en un point a un coefficient directeur négatif, la fonction est localement décroissante en ce point.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 13. Ne pas confondre f(a) et f'(a) ----------
function genDistinguerImageEtNombreDeriveQCM() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-5, 5);
  const fa = randInt(-10, 10);
  const fprime = nonZero(-6, 6);
  const demandeImage = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `On sait que \\(${nomFonction}(${a}) = ${fa}\\) (l'image de ${a} par ${nomFonction}) et \\(${nomFonction}'(${a}) = ${fprime}\\) (le nombre dérivé de ${nomFonction} en ${a}). Donne la valeur de \\(${demandeImage ? `${nomFonction}(${a})` : `${nomFonction}'(${a})`}\\).`,
    answer: demandeImage ? fa : fprime,
    steps: [demandeImage ? `${nomFonction}(${a}) = ${fa}` : `${nomFonction}'(${a}) = ${fprime}`],
  };
}

// ---------- 14. Calcul d'un nombre dérivé approché via un taux d'accroissement ----------
function genTauxAccroissementApprocheNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-5, 5);
  const h = pick([0.1, 0.5, 1]);
  const fa = randInt(-10, 10);
  const taux = nonZero(-8, 8);
  const faPlusH = roundTo(fa + taux * h, 4);
  return {
    type: "numeric",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `On sait que \\(${nomFonction}(${a}) = ${fa}\\) et \\(${nomFonction}(${a} + ${fr(h)}) = ${fr(faPlusH)}\\). Calcule le taux d'accroissement \\(\\dfrac{${nomFonction}(${a}+${fr(h)}) - ${nomFonction}(${a})}{${fr(h)}}\\), qui donne une approximation de \\(${nomFonction}'(${a})\\).`,
    answer: taux,
    tolerance: 0.01,
    steps: [`\\dfrac{${fr(faPlusH)} - ${fa}}{${fr(h)}} = ${taux}`],
  };
}

// ---------- 15. Équation réduite de la tangente (coefficient directeur et ordonnée à l'origine) ----------
function genOrdonneeOrigineTangenteNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-6, 6);
  const fa = randInt(-10, 10);
  const fprime = nonZero(-6, 6);
  // y = f'(a)x + p où p = f(a) - f'(a) × a
  const p = fa - fprime * a;
  return {
    type: "numeric",
    chapter: "Variations instantanées — Tangente",
    prompt: `On sait que \\(${nomFonction}(${a}) = ${fa}\\) et \\(${nomFonction}'(${a}) = ${fprime}\\). La tangente à la courbe de ${nomFonction} au point d'abscisse ${a} a pour équation réduite \\(y = ${fprime}x + p\\). Calcule p.`,
    answer: p,
    steps: [`p = ${nomFonction}(${a}) - ${nomFonction}'(${a}) \\times ${a} = ${fa} - ${fprime} \\times ${a} = ${p}`],
  };
}

const GENERATORS = [
  genNombreDeriveDeuxPointsNumeric,
  genNombreDeriveDeplacementNumeric,
  genTangenteHorizontaleQCM,
  genNombreDeriveFonctionAffineNumeric,
  genEquationTangenteNumeric,
  genVitesseDeriveePositionNumeric,
  genAccelerationDeriveeVitesseNumeric,
  genSigneNombreDeriveQCM,
  genLectureTableauNombreDeriveNumeric,
  genComparerNombresDerivesQCM,
  genIdentifierTangenteHorizontaleQCM,
  genVraiFauxNombreDeriveQCM,
  genDistinguerImageEtNombreDeriveQCM,
  genTauxAccroissementApprocheNumeric,
  genOrdonneeOrigineTangenteNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "variations-instantanees-premiere-non-spe",
    title: "Variations instantanées",
    description: "Nombre dérivé comme coefficient directeur de la tangente, tangente horizontale, dérivée d'une fonction affine, équation de la tangente, signe du nombre dérivé et sens de variation local, interprétation physique (vitesse, accélération).",
    level: "premiere-non-spe",
    free: false,
    order: 6,
  },
  generate,
};
