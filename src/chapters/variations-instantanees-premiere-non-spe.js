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
  const yTangence = m * a + p;
  const xs = [xA, xB, a];
  const ys = [yA, yB, yTangence];
  return {
    type: "numeric",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `On donne ci-dessous la tangente à la courbe représentative de ${nomFonction} au point d'abscisse ${a}, ainsi que deux points \\(A\\) et \\(B\\) de cette tangente. Calcule \\(${nomFonction}'(${a})\\).`,
    answer: m,
    steps: [
      { type: "regle", text: `\\text{Le nombre dérivé } ${nomFonction}'(${a}) \\text{ est le coefficient directeur de la tangente au point d'abscisse } ${a}, \\text{ que l'on calcule à partir de deux de ses points.}` },
      { type: "resultat", text: `${nomFonction}'(${a}) = \\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{${yB} - (${yA})}{${xB} - (${xA})} = ${m}` },
    ],
    graph: {
      xMin: Math.min(...xs) - 2,
      xMax: Math.max(...xs) + 2,
      yMin: Math.min(...ys) - 2,
      yMax: Math.max(...ys) + 2,
      lines: [{ a: m, b: p, label: "tangente" }],
      points: [
        { x: xA, y: yA, label: "A" },
        { x: xB, y: yB, label: "B" },
      ],
    },
  };
}

// ---------- 2. Nombre dérivé depuis un déplacement d'une unité sur la tangente ----------
function genNombreDeriveDeplacementNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-5, 5);
  const variation = nonZero(-8, 8);
  const bIntercept = -variation * a;
  return {
    type: "numeric",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `On donne ci-dessous la tangente à la courbe représentative de ${nomFonction} au point d'abscisse ${a}. Lorsqu'on se déplace d'une unité vers la droite sur cette tangente, l'ordonnée ${variation >= 0 ? "augmente" : "diminue"} de ${Math.abs(variation)}. Calcule \\(${nomFonction}'(${a})\\).`,
    answer: variation,
    steps: [
      { type: "regle", text: `\\text{Le nombre dérivé est le coefficient directeur de la tangente, c'est-à-dire la variation de l'ordonnée pour un déplacement horizontal de 1 unité : } ${nomFonction}'(${a}) = \\dfrac{\\text{variation verticale}}{1}.` },
      { type: "resultat", text: `${nomFonction}'(${a}) = ${variation}` },
    ],
    graph: {
      xMin: a - 4,
      xMax: a + 4,
      yMin: Math.min(0, variation) - 3,
      yMax: Math.max(0, variation) + 3,
      lines: [{ a: variation, b: bIntercept, label: "tangente" }],
      points: [
        { x: a, y: 0, label: "M", project: true },
        { x: a + 1, y: variation, label: "" },
      ],
    },
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
    steps: [{ type: "regle", text: horizontale ? `\\text{Une tangente horizontale a un coefficient directeur nul, donc le nombre dérivé vaut 0.}` : `\\text{Le nombre dérivé est égal au coefficient directeur de la tangente, soit 3.}` }],
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
    steps: [
      { type: "regle", text: `\\text{La courbe de f est une droite : la tangente en tout point est confondue avec cette droite, donc le nombre dérivé est constant et égal au coefficient directeur m.}` },
      { type: "resultat", text: `f'(${a}) = m = ${m}` },
    ],
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
    steps: [{ type: "resultat", text: `y = ${fprime}(${x} - ${a}) + ${fa} = ${fprime} \\times ${x - a} + ${fa} = ${answer}` }],
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
    steps: [
      { type: "regle", text: `\\text{La vitesse instantanée est le nombre dérivé de la position, donc le coefficient directeur de la tangente à la courbe de position.}` },
      { type: "resultat", text: `f'(${t}) = \\dfrac{${yB} - ${yA}}{${xB} - ${xA}} = ${vitesse} \\text{ m/s}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{L'accélération est le nombre dérivé de la vitesse : pour une fonction affine, ce nombre dérivé est constant et égal au taux de variation de la vitesse entre les deux instants.}` },
      { type: "resultat", text: `\\dfrac{${vitesseB} - ${vitesseA}}{${duree}} = ${acceleration} \\text{ m/s}^2` },
    ],
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
    steps: [{ type: "regle", text: fprime > 0 ? `${nomFonction}'(${a}) > 0 \\text{ donc } ${nomFonction} \\text{ est localement croissante en } ${a}.` : `${nomFonction}'(${a}) < 0 \\text{ donc } ${nomFonction} \\text{ est localement décroissante en } ${a}.` }],
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
    steps: [{ type: "resultat", text: `${nomFonction}'(${abscisses[indexChoisi]}) = ${fr(roundTo(derivees[indexChoisi], 1))}` }],
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
    steps: [
      { type: "regle", text: `\\text{Plus le nombre dérivé est grand, plus la tangente est \\textit{pentue} : il suffit donc de comparer les deux valeurs.}` },
      { type: "resultat", text: `\\max(${fprimeA} ; ${fprimeB}) = ${Math.max(fprimeA, fprimeB)}, \\text{ atteint en } ${plusGrand}` },
    ],
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
    steps: [{ type: "regle", text: `\\text{La tangente est horizontale là où le nombre dérivé est nul : en } ${abscisses[indexHorizontale]}` }],
  };
}

// ---------- 12. Vrai ou faux sur le nombre dérivé ----------
function genVraiFauxNombreDeriveQCM() {
  const cas = pick([
    {
      description: "Le nombre dérivé f'(a) est le coefficient directeur de la tangente à la courbe de f au point d'abscisse a.",
      reponse: "Vrai",
      explication: "\\text{C'est la définition même du nombre dérivé : } f'(a) \\text{ mesure la pente de la tangente en } a.",
    },
    {
      description: "Si f'(a) > 0, alors f(a) est nécessairement positif.",
      reponse: "Faux",
      explication: "\\text{Il ne faut pas confondre } f(a) \\text{ (l'image, la hauteur de la courbe) et } f'(a) \\text{ (le nombre dérivé, la pente de la tangente). Une courbe peut monter (}f'(a)>0\\text{) tout en restant en dessous de l'axe des abscisses, donc } f(a) \\text{ peut être négatif.}",
    },
    {
      description: "Le nombre dérivé d'une fonction affine est constant, quel que soit le point considéré.",
      reponse: "Vrai",
      explication: "\\text{La courbe d'une fonction affine est une droite : sa tangente en tout point est la droite elle-même, de coefficient directeur constant.}",
    },
    {
      description: "Une tangente horizontale signifie que le nombre dérivé en ce point est égal à 1.",
      reponse: "Faux",
      explication: "\\text{Une droite horizontale a un coefficient directeur nul, pas égal à 1. Une tangente horizontale signifie donc } f'(a) = 0.",
    },
    {
      description: "Si la tangente en un point a un coefficient directeur négatif, la fonction est localement décroissante en ce point.",
      reponse: "Vrai",
      explication: "\\text{Le signe du nombre dérivé donne le sens de variation local : } f'(a) < 0 \\text{ signifie que } f \\text{ décroît au voisinage de } a.",
    },
  ]);
  return {
    type: "qcm",
    chapter: "Variations instantanées — Nombre dérivé",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
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
    steps: [
      { type: "regle", text: `\\text{Ne pas confondre } ${nomFonction}(${a}) \\text{ (l'image de } ${a}\\text{, la hauteur de la courbe) et } ${nomFonction}'(${a}) \\text{ (le nombre dérivé, la pente de la tangente) : ce sont deux nombres différents.}` },
      { type: "resultat", text: demandeImage ? `${nomFonction}(${a}) = ${fa}` : `${nomFonction}'(${a}) = ${fprime}` },
    ],
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
    steps: [{ type: "resultat", text: `\\dfrac{${fr(faPlusH)} - ${fa}}{${fr(h)}} = ${taux}` }],
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
    steps: [
      { type: "regle", text: `\\text{En remplaçant } x \\text{ par } ${a} \\text{ et } y \\text{ par } ${nomFonction}(${a}) \\text{ dans } y = ${nomFonction}'(${a})x + p, \\text{ on isole p.}` },
      { type: "resultat", text: `p = ${nomFonction}(${a}) - ${nomFonction}'(${a}) \\times ${a} = ${fa} - ${fprime} \\times ${a} = ${p}` },
    ],
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

const DIFFICULTY = {
  genTangenteHorizontaleQCM: "facile",
  genNombreDeriveFonctionAffineNumeric: "facile",
  genSigneNombreDeriveQCM: "facile",
  genLectureTableauNombreDeriveNumeric: "facile",
  genIdentifierTangenteHorizontaleQCM: "facile",
  genNombreDeriveDeuxPointsNumeric: "standard",
  genNombreDeriveDeplacementNumeric: "standard",
  genEquationTangenteNumeric: "standard",
  genComparerNombresDerivesQCM: "standard",
  genVraiFauxNombreDeriveQCM: "standard",
  genTauxAccroissementApprocheNumeric: "standard",
  genVitesseDeriveePositionNumeric: "expert",
  genAccelerationDeriveeVitesseNumeric: "expert",
  genDistinguerImageEtNombreDeriveQCM: "expert",
  genOrdonneeOrigineTangenteNumeric: "expert",
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
    id: "variations-instantanees-premiere-non-spe",
    title: "Variations instantanées",
    description: "Nombre dérivé comme coefficient directeur de la tangente, tangente horizontale, dérivée d'une fonction affine, équation de la tangente, signe du nombre dérivé et sens de variation local, interprétation physique (vitesse, accélération).",
    pourquoi: "Le nombre dérivé permet de savoir à quel rythme une quantité évolue à un instant précis — la base de toute optimisation.",
    level: "premiere-non-spe",
    free: false,
    order: 7,
    cours: {
      mindMap: {
        title: "Variations instantanées",
        branches: [
          {
            title: "Nombre dérivé = coefficient directeur de la tangente",
            items: [
              "\\(f'(a)\\) est le coefficient directeur de la tangente à la courbe au point d'abscisse a.",
              "\\(f'(a) = 0\\) ⟺ la tangente en a est horizontale.",
            ],
          },
          {
            title: "Équation de la tangente",
            items: [
              "Pour l'écrire, il faut deux informations : le nombre dérivé (pente) et un point de la courbe (a ; f(a)).",
            ],
            formula: "\\(y = f'(a)(x-a) + f(a)\\)",
          },
          {
            title: "Signe du nombre dérivé et sens de variation",
            items: [
              "\\(f'(a) > 0\\) : f croissante autour de a. \\(f'(a) < 0\\) : f décroissante autour de a.",
              "Piège classique très fréquent : le signe de \\(f'(a)\\) donne le sens de variation de f, ce n'est pas le signe de \\(f(a)\\).",
            ],
          },
          {
            title: "Interprétation physique",
            items: [
              "Pour une position en fonction du temps, le nombre dérivé est la vitesse instantanée.",
              "Pour une vitesse en fonction du temps, le nombre dérivé est l'accélération.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
