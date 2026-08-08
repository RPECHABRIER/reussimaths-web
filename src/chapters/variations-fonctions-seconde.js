// ---------------------------------------------------------------------------
// Chapitre : Variations de fonctions (2nde) — sous abonnement.
//
// Correspond au chapitre 2 du manuel de 2nde : lecture et exploitation d'un
// tableau de variations donné en toutes lettres (sens de variation sur un
// intervalle, valeurs aux bornes), maximum et minimum d'une fonction sur son
// ensemble de définition ou sur un sous-intervalle, comparaison d'images à
// partir de la monotonie, encadrement d'une image, nombre de solutions d'une
// équation f(x) = k lue sur le tableau, extrema locaux vs globaux.
// La correction du livre du professeur (exercices sur les tableaux de
// variations, ex. 14-16, 22-23, 27-30) a servi à identifier la méthode et le
// vocabulaire ; les nombres, lettres de fonction et intervalles sont générés
// aléatoirement à chaque tirage.
// Voir automatismes-seconde.js (thème "variations-fonctions-seconde") pour
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

// ---------- Construction d'un tableau de variations aléatoire ----------
// directions : tableau de "croissante"/"décroissante", un élément par morceau.
// gapMin/gapMax : écart (en abscisse) entre deux bornes consécutives.
function buildProfile(directions, gapMin = 2, gapMax = 4) {
  const nomF = pick(["f", "g", "h"]);
  const xs = [randInt(-6, -3)];
  for (let i = 0; i < directions.length; i++) xs.push(xs[xs.length - 1] + randInt(gapMin, gapMax));
  const ys = [randInt(-6, 6)];
  for (let i = 0; i < directions.length; i++) {
    const delta = randInt(2, 6);
    ys.push(directions[i] === "croissante" ? ys[ys.length - 1] + delta : ys[ys.length - 1] - delta);
  }
  return { nomF, xs, ys, directions };
}

function decrireTableau(profile) {
  const { nomF, xs, ys, directions } = profile;
  let desc = `La fonction ${nomF} est définie sur \\([${xs[0]} ; ${xs[xs.length - 1]}]\\), avec \\(${nomF}(${xs[0]}) = ${ys[0]}\\). `;
  for (let i = 0; i < directions.length; i++) {
    desc += `${nomF} est ${directions[i]} sur \\([${xs[i]} ; ${xs[i + 1]}]\\) (\\(${nomF}(${xs[i + 1]}) = ${ys[i + 1]}\\)). `;
  }
  return desc.trim();
}

function randomDirections(n) {
  return Array.from({ length: n }, () => pick(["croissante", "décroissante"]));
}

function profileYsUniques(directions, gapMin, gapMax) {
  let profile;
  do {
    profile = buildProfile(directions, gapMin, gapMax);
  } while (new Set(profile.ys).size !== profile.ys.length);
  return profile;
}

// ---------- 1. Lire une image aux bornes du tableau ----------
function genLireImageBorneNumeric() {
  const profile = buildProfile(randomDirections(2));
  const idx = randInt(0, profile.xs.length - 1);
  return {
    type: "numeric",
    chapter: "Variations de fonctions — Lecture d'un tableau de variations",
    prompt: `${decrireTableau(profile)} D'après ce tableau de variations, que vaut \\(${profile.nomF}(${profile.xs[idx]})\\) ?`,
    answer: profile.ys[idx],
    steps: [{ type: "donnee", text: `\\text{Le tableau de variations donne directement } ${profile.nomF}(${profile.xs[idx]}) = ${profile.ys[idx]}.` }],
  };
}

// ---------- 2. Maximum de la fonction ----------
function genMaximumFonctionNumeric() {
  const profile = profileYsUniques(randomDirections(3));
  const maxY = Math.max(...profile.ys);
  return {
    type: "numeric",
    chapter: "Variations de fonctions — Maximum et minimum",
    prompt: `${decrireTableau(profile)} Quel est le maximum de ${profile.nomF} sur \\([${profile.xs[0]} ; ${profile.xs[profile.xs.length - 1]}]\\) ?`,
    answer: maxY,
    steps: [
      { type: "regle", text: `\\text{Le maximum d'une fonction lue sur un tableau de variations est la plus grande des valeurs indiquées (aux bornes et aux changements de sens).}` },
      { type: "resultat", text: `\\text{Maximum} = ${maxY}.` },
    ],
  };
}

// ---------- 3. Minimum de la fonction ----------
function genMinimumFonctionNumeric() {
  const profile = profileYsUniques(randomDirections(3));
  const minY = Math.min(...profile.ys);
  return {
    type: "numeric",
    chapter: "Variations de fonctions — Maximum et minimum",
    prompt: `${decrireTableau(profile)} Quel est le minimum de ${profile.nomF} sur \\([${profile.xs[0]} ; ${profile.xs[profile.xs.length - 1]}]\\) ?`,
    answer: minY,
    steps: [
      { type: "regle", text: `\\text{Le minimum d'une fonction lue sur un tableau de variations est la plus petite des valeurs indiquées (aux bornes et aux changements de sens).}` },
      { type: "resultat", text: `\\text{Minimum} = ${minY}.` },
    ],
  };
}

// ---------- 4. En quelle valeur le maximum est-il atteint ----------
function genValeurXpourMaximumNumeric() {
  const profile = profileYsUniques(randomDirections(3));
  const maxY = Math.max(...profile.ys);
  const idx = profile.ys.indexOf(maxY);
  return {
    type: "numeric",
    chapter: "Variations de fonctions — Maximum et minimum",
    prompt: `${decrireTableau(profile)} En quelle valeur de x le maximum de ${profile.nomF} est-il atteint ?`,
    answer: profile.xs[idx],
    steps: [{ type: "resultat", text: `\\text{Le maximum } ${maxY} \\text{ est atteint pour } x = ${profile.xs[idx]}.` }],
  };
}

// ---------- 5. En quelle valeur le minimum est-il atteint ----------
function genValeurXpourMinimumNumeric() {
  const profile = profileYsUniques(randomDirections(3));
  const minY = Math.min(...profile.ys);
  const idx = profile.ys.indexOf(minY);
  return {
    type: "numeric",
    chapter: "Variations de fonctions — Maximum et minimum",
    prompt: `${decrireTableau(profile)} En quelle valeur de x le minimum de ${profile.nomF} est-il atteint ?`,
    answer: profile.xs[idx],
    steps: [{ type: "resultat", text: `\\text{Le minimum } ${minY} \\text{ est atteint pour } x = ${profile.xs[idx]}.` }],
  };
}

// ---------- 6. Sens de variation sur un intervalle donné ----------
function genLireSensVariationQCM() {
  const profile = buildProfile(randomDirections(3));
  const idx = randInt(0, 2);
  return {
    type: "qcm",
    chapter: "Variations de fonctions — Lecture d'un tableau de variations",
    prompt: `${decrireTableau(profile)} Quel est le sens de variation de ${profile.nomF} sur \\([${profile.xs[idx]} ; ${profile.xs[idx + 1]}]\\) ?`,
    answer: profile.directions[idx],
    options: ["croissante", "décroissante"],
    steps: [{ type: "donnee", text: `\\text{D'après le tableau, } ${profile.nomF} \\text{ est } ${profile.directions[idx]} \\text{ sur cet intervalle.}` }],
  };
}

// ---------- 7. Comparer deux images sur un même morceau monotone ----------
function genComparerImagesMemeSensQCM() {
  const profile = profileYsUniques(randomDirections(3));
  const idx = randInt(0, 2);
  const [xa, xb] = [profile.xs[idx], profile.xs[idx + 1]];
  const [ya, yb] = [profile.ys[idx], profile.ys[idx + 1]];
  const bonneReponse = ya < yb ? `${profile.nomF}(${xa}) < ${profile.nomF}(${xb})` : `${profile.nomF}(${xa}) > ${profile.nomF}(${xb})`;
  const mauvaise = ya < yb ? `${profile.nomF}(${xa}) > ${profile.nomF}(${xb})` : `${profile.nomF}(${xa}) < ${profile.nomF}(${xb})`;
  return {
    type: "qcm",
    chapter: "Variations de fonctions — Comparaison d'images",
    prompt: `${decrireTableau(profile)} On a \\(${xa} < ${xb}\\) et ${profile.nomF} est ${profile.directions[idx]} sur \\([${xa} ; ${xb}]\\). Que peut-on en déduire ?`,
    answer: bonneReponse,
    options: shuffle([bonneReponse, mauvaise, "On ne peut pas savoir"]),
    steps: [
      { type: "regle", text: `\\text{Si une fonction est croissante sur un intervalle, l'ordre des images suit l'ordre des antécédents ; si elle est décroissante, l'ordre est inversé.}` },
      { type: "resultat", text: `${profile.nomF} \\text{ est } ${profile.directions[idx]} \\text{ sur cet intervalle et } ${xa} < ${xb}, \\text{ donc } ${bonneReponse}.` },
    ],
  };
}

// ---------- 8. Encadrer une image à l'intérieur d'un morceau monotone ----------
function genEncadrerImageQCM() {
  const profile = buildProfile(randomDirections(2), 3, 6);
  const idx = randInt(0, 1);
  const xa = profile.xs[idx];
  const xb = profile.xs[idx + 1];
  const x0 = randInt(xa + 1, xb - 1);
  const ya = profile.ys[idx];
  const yb = profile.ys[idx + 1];
  const borneBas = Math.min(ya, yb);
  const borneHaut = Math.max(ya, yb);
  const bonneReponse = `${borneBas} < ${profile.nomF}(${x0}) < ${borneHaut}`;
  const mauvaise1 = `${borneHaut} < ${profile.nomF}(${x0}) < ${borneBas + (borneHaut - borneBas) + borneHaut}`;
  const mauvaise2 = `${profile.nomF}(${x0}) = ${borneBas}`;
  return {
    type: "qcm",
    chapter: "Variations de fonctions — Comparaison d'images",
    prompt: `${decrireTableau(profile)} ${profile.nomF} est ${profile.directions[idx]} sur \\([${xa} ; ${xb}]\\). Que peut-on affirmer sur \\(${profile.nomF}(${x0})\\), sachant que \\(${xa} < ${x0} < ${xb}\\) ?`,
    answer: bonneReponse,
    options: shuffle([bonneReponse, mauvaise1, mauvaise2]),
    steps: [
      { type: "regle", text: `\\text{Sur un intervalle de monotonie, l'image d'un nombre compris entre deux bornes est strictement comprise entre les images de ces deux bornes.}` },
      { type: "resultat", text: `${profile.nomF}(${xa}) = ${ya} \\text{ et } ${profile.nomF}(${xb}) = ${yb}, \\text{ donc } ${bonneReponse}.` },
    ],
  };
}

// ---------- 9. Nombre de solutions de f(x) = extremum ----------
function genNombreSolutionsExtremumQCM() {
  const premiereDirection = pick(["croissante", "décroissante"]);
  const secondeDirection = premiereDirection === "croissante" ? "décroissante" : "croissante";
  const profile = buildProfile([premiereDirection, secondeDirection]);
  const [x0, x1, x2] = profile.xs;
  const yExtremum = profile.ys[1];
  const typeExtremum = premiereDirection === "croissante" ? "maximum" : "minimum";
  return {
    type: "qcm",
    chapter: "Variations de fonctions — Résolution graphique",
    prompt: `${decrireTableau(profile)} Le nombre ${yExtremum} est le ${typeExtremum} de ${profile.nomF} sur \\([${x0} ; ${x2}]\\), atteint en \\(x = ${x1}\\). Combien l'équation \\(${profile.nomF}(x) = ${yExtremum}\\) a-t-elle de solutions sur \\([${x0} ; ${x2}]\\) ?`,
    answer: "1",
    options: ["0", "1", "2"],
    steps: [
      { type: "regle", text: `\\text{Une fonction strictement monotone sur un intervalle prend chaque valeur au plus une fois sur cet intervalle.}` },
      { type: "resultat", text: `${profile.nomF} \\text{ est strictement } ${premiereDirection} \\text{ puis strictement } ${secondeDirection} : \\text{ elle n'atteint la valeur } ${yExtremum} \\text{ (son } ${typeExtremum}\\text{) qu'une seule fois, en } x = ${x1}.` },
    ],
  };
}

// ---------- 10. Vrai ou faux sur le sens de variation ----------
function genVraiFauxSensVariationQCM() {
  const profile = buildProfile(randomDirections(3));
  const idx = randInt(0, 2);
  const direction = profile.directions[idx];
  const autreDirection = direction === "croissante" ? "décroissante" : "croissante";
  const affirmationVraie = Math.random() < 0.5;
  const directionAffichee = affirmationVraie ? direction : autreDirection;
  return {
    type: "qcm",
    chapter: "Variations de fonctions — Vrai ou faux",
    prompt: `${decrireTableau(profile)} Affirmation : « ${profile.nomF} est ${directionAffichee} sur \\([${profile.xs[idx]} ; ${profile.xs[idx + 1]}]\\) ». Cette affirmation est-elle vraie ou fausse ?`,
    answer: affirmationVraie ? "Vraie" : "Fausse",
    options: ["Vraie", "Fausse"],
    steps: [{ type: "resultat", text: `\\text{D'après le tableau, } ${profile.nomF} \\text{ est } ${direction} \\text{ sur cet intervalle, donc l'affirmation est } ${affirmationVraie ? "vraie" : "fausse"}.` }],
  };
}

// ---------- 11. Retrouver la bonne phrase décrivant le tableau ----------
function genTableauVersPhraseQCM() {
  const profile = buildProfile(randomDirections(2));
  const [x0, x1, x2] = profile.xs;
  const phraseCorrecte = `${profile.nomF} est ${profile.directions[0]} sur \\([${x0} ; ${x1}]\\), puis ${profile.directions[1]} sur \\([${x1} ; ${x2}]\\)`;
  const inverse0 = profile.directions[0] === "croissante" ? "décroissante" : "croissante";
  const inverse1 = profile.directions[1] === "croissante" ? "décroissante" : "croissante";
  const phraseFausse1 = `${profile.nomF} est ${inverse0} sur \\([${x0} ; ${x1}]\\), puis ${profile.directions[1]} sur \\([${x1} ; ${x2}]\\)`;
  const phraseFausse2 = `${profile.nomF} est ${profile.directions[0]} sur \\([${x0} ; ${x1}]\\), puis ${inverse1} sur \\([${x1} ; ${x2}]\\)`;
  return {
    type: "qcm",
    chapter: "Variations de fonctions — Lecture d'un tableau de variations",
    prompt: `${decrireTableau(profile)} Laquelle de ces phrases décrit correctement les variations de ${profile.nomF} ?`,
    answer: phraseCorrecte,
    options: shuffle([phraseCorrecte, phraseFausse1, phraseFausse2]),
    steps: [{ type: "resultat", text: `\\text{La phrase correcte est : « } ${phraseCorrecte} \\text{ ».}` }],
  };
}

// ---------- 12. Bornes de l'ensemble de définition ----------
function genIntervalleDeDefinitionNumeric() {
  const profile = buildProfile(randomDirections(2));
  const demanderBorneInf = Math.random() < 0.5;
  const xMin = profile.xs[0];
  const xMax = profile.xs[profile.xs.length - 1];
  return {
    type: "numeric",
    chapter: "Variations de fonctions — Lecture d'un tableau de variations",
    prompt: `${decrireTableau(profile)} Quelle est la borne ${demanderBorneInf ? "inférieure" : "supérieure"} de l'ensemble de définition de ${profile.nomF} ?`,
    answer: demanderBorneInf ? xMin : xMax,
    steps: [{ type: "resultat", text: `\\text{L'ensemble de définition est } [${xMin} ; ${xMax}], \\text{ donc la borne } ${demanderBorneInf ? "inférieure" : "supérieure"} \\text{ est } ${demanderBorneInf ? xMin : xMax}.` }],
  };
}

// ---------- 13. Nombre de changements de sens de variation ----------
function genNombreChangementsSensQCM() {
  const profile = buildProfile(randomDirections(3));
  let changements = 0;
  for (let i = 0; i < profile.directions.length - 1; i++) {
    if (profile.directions[i] !== profile.directions[i + 1]) changements++;
  }
  return {
    type: "qcm",
    chapter: "Variations de fonctions — Lecture d'un tableau de variations",
    prompt: `${decrireTableau(profile)} Combien de fois le sens de variation de ${profile.nomF} change-t-il sur \\([${profile.xs[0]} ; ${profile.xs[profile.xs.length - 1]}]\\) ?`,
    answer: String(changements),
    options: ["0", "1", "2"],
    steps: [{ type: "resultat", text: `\\text{On compte le nombre de fois où le sens passe de croissant à décroissant (ou l'inverse) : } ${changements}.` }],
  };
}

// ---------- 14. Extremum local vs extremum global ----------
function genCompareExtremumsLocauxGlobalQCM() {
  let directions;
  do {
    directions = randomDirections(3);
  } while (directions[0] === directions[1]);
  const profile = profileYsUniques(directions);
  const y1 = profile.ys[1];
  const maxY = Math.max(...profile.ys);
  const minY = Math.min(...profile.ys);
  const typeLocal = directions[0] === "croissante" ? "maximum" : "minimum";
  const estGlobal = typeLocal === "maximum" ? y1 === maxY : y1 === minY;
  return {
    type: "qcm",
    chapter: "Variations de fonctions — Extremums locaux et globaux",
    prompt: `${decrireTableau(profile)} En \\(x = ${profile.xs[1]}\\), ${profile.nomF} admet un ${typeLocal} local (égal à ${y1}). Ce ${typeLocal} local est-il aussi le ${typeLocal} global de ${profile.nomF} sur \\([${profile.xs[0]} ; ${profile.xs[3]}]\\) ?`,
    answer: estGlobal ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Un extremum local n'est un extremum global que s'il est aussi le plus grand (ou le plus petit) sur tout l'ensemble de définition.}` },
      {
        type: "resultat",
        text: estGlobal
          ? `\\text{Le } ${typeLocal} \\text{ global vaut } ${typeLocal === "maximum" ? maxY : minY} \\text{, c'est bien la valeur atteinte en } x = ${profile.xs[1]}.`
          : `\\text{Le } ${typeLocal} \\text{ global vaut } ${typeLocal === "maximum" ? maxY : minY} \\text{, ce n'est pas la valeur atteinte en } x = ${profile.xs[1]} \\text{ (} ${y1}\\text{) : il existe donc un } ${typeLocal} \\text{ encore plus } ${typeLocal === "maximum" ? "grand" : "petit"} \\text{ ailleurs.}`,
      },
    ],
  };
}

// ---------- 15. Maximum ou minimum sur un sous-intervalle ----------
function genMaxMinSousIntervalleQCM() {
  const profile = profileYsUniques(randomDirections(3));
  const si = randInt(0, 1);
  const ei = randInt(si + 1, 3);
  const sousYs = profile.ys.slice(si, ei + 1);
  const demanderMax = Math.random() < 0.5;
  const answer = demanderMax ? Math.max(...sousYs) : Math.min(...sousYs);
  return {
    type: "numeric",
    chapter: "Variations de fonctions — Maximum et minimum",
    prompt: `${decrireTableau(profile)} Quel est le ${demanderMax ? "maximum" : "minimum"} de ${profile.nomF} sur \\([${profile.xs[si]} ; ${profile.xs[ei]}]\\) (et non sur tout l'ensemble de définition) ?`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Sur un sous-intervalle, on ne considère que les valeurs prises aux bornes des morceaux monotones à l'intérieur de ce sous-intervalle.}` },
      { type: "resultat", text: `\\text{Valeurs prises} : ${sousYs.join(", ")}. \\text{ Le } ${demanderMax ? "maximum" : "minimum"} \\text{ est } ${answer}.` },
    ],
  };
}

const GENERATORS = [
  genLireImageBorneNumeric,
  genMaximumFonctionNumeric,
  genMinimumFonctionNumeric,
  genValeurXpourMaximumNumeric,
  genValeurXpourMinimumNumeric,
  genLireSensVariationQCM,
  genComparerImagesMemeSensQCM,
  genEncadrerImageQCM,
  genNombreSolutionsExtremumQCM,
  genVraiFauxSensVariationQCM,
  genTableauVersPhraseQCM,
  genIntervalleDeDefinitionNumeric,
  genNombreChangementsSensQCM,
  genCompareExtremumsLocauxGlobalQCM,
  genMaxMinSousIntervalleQCM,
];

const DIFFICULTY = {
  genLireImageBorneNumeric: "facile",
  genMaximumFonctionNumeric: "facile",
  genMinimumFonctionNumeric: "facile",
  genValeurXpourMaximumNumeric: "facile",
  genValeurXpourMinimumNumeric: "facile",
  genLireSensVariationQCM: "facile",
  genComparerImagesMemeSensQCM: "standard",
  genEncadrerImageQCM: "standard",
  genNombreSolutionsExtremumQCM: "standard",
  genVraiFauxSensVariationQCM: "standard",
  genTableauVersPhraseQCM: "standard",
  genIntervalleDeDefinitionNumeric: "standard",
  genNombreChangementsSensQCM: "standard",
  genCompareExtremumsLocauxGlobalQCM: "expert",
  genMaxMinSousIntervalleQCM: "expert",
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
    id: "variations-fonctions-seconde",
    title: "Variations de fonctions",
    description: "Lecture d'un tableau de variations, maximum et minimum sur un intervalle, comparaison et encadrement d'images à partir de la monotonie, extremums locaux et globaux.",
    pourquoi: "Lire un tableau de variations, c'est trouver rapidement où un phénomène est le plus grand ou le plus petit.",
    level: "seconde",
    free: false,
    order: 4,
    cours: {
      mindMap: {
        title: "Variations de fonctions",
        branches: [
          {
            title: "Lire un tableau de variations",
            items: [
              "Une flèche qui monte = fonction croissante sur l'intervalle ; qui descend = décroissante.",
              "Les valeurs écrites sont les images aux bornes des intervalles, pas les x.",
            ],
          },
          {
            title: "Maximum et minimum",
            items: [
              "Le maximum (resp. minimum) sur un intervalle est la plus grande (resp. petite) valeur lue en haut (resp. bas) d'une flèche.",
              "Piège classique : un extremum local (sommet d'une flèche qui change de sens) n'est pas forcément le maximum/minimum global.",
            ],
          },
          {
            title: "Comparer ou encadrer des images",
            items: [
              "Sur un intervalle où f est croissante : a < b entraîne f(a) < f(b) (l'ordre est conservé).",
              "Sur un intervalle où f est décroissante : a < b entraîne f(a) > f(b) (l'ordre est inversé).",
            ],
          },
          {
            title: "Nombre de solutions de f(x) = k",
            items: [
              "Sur chaque intervalle de monotonie, compter combien de fois la valeur k est atteinte.",
              "Additionner les solutions trouvées sur chaque morceau du tableau pour avoir le total.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
