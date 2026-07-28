// ---------------------------------------------------------------------------
// Chapitre : Statistiques, probabilités (5e) — sous abonnement.
//
// Correspond au chapitre 9 du sommaire officiel : recueillir et organiser des
// données (effectif, fréquence, tableaux simples et à double entrée),
// représenter et lire des données (diagramme en bâtons, diagramme
// circulaire), calculer une moyenne (simple, pondérée, écarts à la moyenne,
// valeurs extrêmes), et les probabilités (expérience aléatoire, issues,
// événements, équiprobabilité, événement contraire, fréquence et probabilité,
// somme de deux dés). Reprend la tâche intellectuelle des exercices fournis
// (modules C1 "Statistiques" et C2 "Probabilités"), avec des nombres,
// prénoms et contextes différents à chaque génération.
// Voir automatismes-cinquieme.js (thème "statistiques-probabilites") pour la
// Série 1 (Automatismes).
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
const randDecimal = (min, max, decimals) => roundTo(min + Math.random() * (max - min), decimals);
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

function pgcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

// =========================== Recueillir, organiser ===========================

// ---------- 1. Calculer une fréquence (pourcentage) ----------
function genCalculerFrequencePourcentageNumeric() {
  const total = randInt(20, 200);
  const effectif = randInt(1, total);
  const answer = roundTo((effectif / total) * 100, 2);
  const objet = pick(["élèves", "personnes interrogées", "clients", "spectateurs"]);
  return {
    type: "numeric",
    chapter: "Statistiques — Effectif et fréquence",
    prompt: `Dans une enquête menée auprès de ${total} ${objet}, ${effectif} ont répondu "oui". Quelle est la fréquence de cette réponse, en pourcentage (arrondi au centième) ?`,
    answer,
    tolerance: 0.05,
    steps: [`Fréquence = ${effectif} \\div ${total} \\times 100 \\approx ${fr(answer)} \\%`],
  };
}

// ---------- 2. Calculer l'effectif total d'un tableau simple ----------
function genCalculerEffectifTotalNumeric() {
  const nbCategories = randInt(4, 6);
  const effectifs = Array.from({ length: nbCategories }, () => randInt(3, 40));
  const total = effectifs.reduce((s, e) => s + e, 0);
  return {
    type: "numeric",
    chapter: "Statistiques — Effectif et fréquence",
    prompt: `Un tableau donne les effectifs suivants pour chaque catégorie : ${effectifs.join(" ; ")}. Quel est l'effectif total ?`,
    answer: total,
    steps: [`${effectifs.join(" + ")} = ${total}`],
  };
}

// ---------- 3. Angle d'un diagramme circulaire ----------
function genAngleDiagrammeCirculaireNumeric() {
  const total = pick([50, 100, 120, 200, 250, 300, 360, 500]);
  const effectif = randInt(1, total - 1);
  const answer = roundTo((effectif / total) * 360, 1);
  return {
    type: "numeric",
    chapter: "Statistiques — Diagramme circulaire",
    prompt: `Dans un diagramme circulaire représentant ${total} données au total, une catégorie a un effectif de ${effectif}. Quelle est la mesure de l'angle du secteur correspondant, en degrés (arrondi au dixième) ?`,
    answer,
    tolerance: 0.1,
    steps: [`Angle = (${effectif} \\div ${total}) \\times 360 \\approx ${fr(answer)}°`],
  };
}

// ---------- 4. Lire un tableau d'effectifs (maximum / minimum) ----------
function genLireTableauEffectifsQCM() {
  const categories = shuffle(["Football", "Basket", "Tennis", "Natation", "Danse", "Judo"]).slice(0, 4);
  const effectifs = categories.map(() => randInt(3, 50));
  const askMax = Math.random() < 0.5;
  const idx = askMax ? effectifs.indexOf(Math.max(...effectifs)) : effectifs.indexOf(Math.min(...effectifs));
  const table = categories.map((c, i) => `${c} : ${effectifs[i]}`).join(" ; ");
  return {
    type: "qcm",
    chapter: "Statistiques — Lire un tableau",
    prompt: `Un club sportif a recensé le nombre de licenciés par activité : ${table}. Quelle activité a ${askMax ? "le plus" : "le moins"} de licenciés ?`,
    answer: categories[idx],
    options: shuffle([...categories]),
    steps: [`On compare les effectifs : ${table}.`],
  };
}

// =========================== Moyenne ===========================

// ---------- 5. Calculer une moyenne simple ----------
function genCalculerMoyenneSimpleNumeric() {
  const n = randInt(4, 8);
  const valeurs = Array.from({ length: n }, () => randInt(0, 20));
  const total = valeurs.reduce((s, v) => s + v, 0);
  const answer = roundTo(total / n, 2);
  return {
    type: "numeric",
    chapter: "Statistiques — Moyenne",
    prompt: `Calcule la moyenne de la série statistique suivante (arrondie au centième si besoin) : ${valeurs.join(" ; ")}`,
    answer,
    tolerance: 0.02,
    steps: [`(${valeurs.join(" + ")}) \\div ${n} = ${total} \\div ${n} \\approx ${fr(answer)}`],
  };
}

// ---------- 6. Écart à la moyenne ----------
function genEcartALaMoyenneNumeric() {
  const n = randInt(4, 6);
  const valeurs = Array.from({ length: n }, () => randInt(5, 40));
  const total = valeurs.reduce((s, v) => s + v, 0);
  const moyenne = roundTo(total / n, 2);
  const idx = randInt(0, n - 1);
  const answer = roundTo(Math.abs(valeurs[idx] - moyenne), 2);
  return {
    type: "numeric",
    chapter: "Statistiques — Moyenne",
    prompt: `Une série statistique a pour valeurs : ${valeurs.join(" ; ")} (moyenne = ${fr(moyenne)}). Quel est l'écart à la moyenne (en valeur absolue) de la valeur ${valeurs[idx]} ?`,
    answer,
    tolerance: 0.02,
    steps: [`|${valeurs[idx]} - ${fr(moyenne)}| \\approx ${fr(answer)}`],
  };
}

// ---------- 7. Moyenne pondérée (à partir d'un tableau effectifs) ----------
function genMoyennePondereeNumeric() {
  const valeurs = shuffle([8, 10, 12, 14, 16, 18]).slice(0, 4);
  const effectifs = valeurs.map(() => randInt(2, 10));
  const sommeProduits = valeurs.reduce((s, v, i) => s + v * effectifs[i], 0);
  const totalEffectif = effectifs.reduce((s, e) => s + e, 0);
  const answer = roundTo(sommeProduits / totalEffectif, 2);
  const table = valeurs.map((v, i) => `${v} (effectif ${effectifs[i]})`).join(" ; ");
  return {
    type: "numeric",
    chapter: "Statistiques — Moyenne pondérée",
    prompt: `Voici les notes obtenues par une classe, avec leurs effectifs : ${table}. Quelle est la moyenne pondérée de la classe (arrondie au centième) ?`,
    answer,
    tolerance: 0.02,
    steps: [
      `Somme pondérée = ${valeurs.map((v, i) => `${v} \\times ${effectifs[i]}`).join(" + ")} = ${sommeProduits}`,
      `Moyenne = ${sommeProduits} \\div ${totalEffectif} \\approx ${fr(answer)}`,
    ],
  };
}

// ---------- 8. Recalculer la moyenne après avoir exclu les valeurs extrêmes ----------
function genExclureValeursExtremesMoyenneNumeric() {
  const n = randInt(5, 7);
  const valeurs = Array.from({ length: n }, () => randInt(10, 90));
  const max = Math.max(...valeurs);
  const min = Math.min(...valeurs);
  const restants = [...valeurs];
  restants.splice(restants.indexOf(max), 1);
  restants.splice(restants.indexOf(min), 1);
  const answer = roundTo(restants.reduce((s, v) => s + v, 0) / restants.length, 2);
  return {
    type: "numeric",
    chapter: "Statistiques — Moyenne",
    prompt: `Voici une série de résultats : ${valeurs.join(" ; ")}. On considère que la valeur la plus haute et la valeur la plus basse sont des contre-performances. Quelle est la moyenne de la série une fois ces deux valeurs extrêmes retirées (arrondie au centième) ?`,
    answer,
    tolerance: 0.02,
    steps: [`On retire ${max} et ${min}, il reste : ${restants.join(" ; ")}.`, `Moyenne = (${restants.join(" + ")}) \\div ${restants.length} \\approx ${fr(answer)}`],
  };
}

// ---------- 9. Comparer deux moyennes ----------
function genComparerMoyennesQCM() {
  const n = randInt(4, 6);
  const a = Array.from({ length: n }, () => randInt(5, 20));
  const b = Array.from({ length: n }, () => randInt(5, 20));
  const moyA = roundTo(a.reduce((s, v) => s + v, 0) / n, 2);
  const moyB = roundTo(b.reduce((s, v) => s + v, 0) / n, 2);
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  return {
    type: "qcm",
    chapter: "Statistiques — Moyenne",
    prompt: `${p1} a obtenu les notes suivantes : ${a.join(" ; ")}. ${p2} a obtenu : ${b.join(" ; ")}. ${p1} affirme : "J'ai une meilleure moyenne que ${p2} !" Est-ce exact ?`,
    answer: moyA > moyB ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`Moyenne de ${p1} \\approx ${fr(moyA)}`, `Moyenne de ${p2} \\approx ${fr(moyB)}`],
  };
}

// =========================== Probabilités ===========================

// ---------- 10. Qualifier un événement ----------
function genQualifierEvenementQCM() {
  const items = [
    { texte: "Obtenir un nombre pair en lançant un dé équilibré à 6 faces", r: "Probable (ni impossible ni certain)" },
    { texte: "Obtenir 7 en lançant un dé équilibré à 6 faces", r: "Impossible" },
    { texte: "Obtenir un nombre inférieur ou égal à 6 en lançant un dé équilibré à 6 faces", r: "Certain" },
    { texte: "Tirer une bille rouge dans un sac qui ne contient que des billes rouges", r: "Certain" },
    { texte: "Tirer une bille bleue dans un sac qui ne contient que des billes rouges", r: "Impossible" },
    { texte: "Obtenir Pile en lançant une pièce de monnaie équilibrée", r: "Probable (ni impossible ni certain)" },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Probabilités — Qualifier un événement",
    prompt: `Comment qualifier l'événement suivant : "${it.texte}" ?`,
    answer: it.r,
    options: shuffle(["Impossible", "Certain", "Probable (ni impossible ni certain)"]),
    steps: [`On compare les issues possibles de l'expérience à l'événement décrit.`],
  };
}

// ---------- 11. Probabilité en situation d'équiprobabilité (dé) ----------
function genProbabiliteDeNumeric() {
  const criteres = [
    { desc: "obtenir un nombre pair", favorables: 3 },
    { desc: "obtenir un multiple de 3", favorables: 2 },
    { desc: "obtenir un nombre supérieur ou égal à 4", favorables: 3 },
    { desc: "obtenir 1 ou 6", favorables: 2 },
    { desc: "obtenir un diviseur de 6", favorables: 4 },
  ];
  const it = pick(criteres);
  const answer = roundTo(it.favorables / 6, 4);
  return {
    type: "numeric",
    chapter: "Probabilités — Équiprobabilité",
    prompt: `On lance un dé équilibré à 6 faces numérotées de 1 à 6. Quelle est la probabilité de l'événement "${it.desc}" (sous forme décimale, arrondie au millième) ?`,
    answer,
    tolerance: 0.001,
    steps: [`P = (\\text{nombre d'issues favorables}) \\div (\\text{nombre d'issues possibles}) = ${it.favorables} \\div 6 \\approx ${fr(answer)}`],
  };
}

// ---------- 12. Probabilité de tirage dans une urne ----------
function genProbabiliteUrneTirageNumeric() {
  const rouges = randInt(2, 15);
  const bleues = randInt(2, 15);
  const vertes = randInt(2, 15);
  const total = rouges + bleues + vertes;
  const couleur = pick([
    { nom: "rouge", n: rouges },
    { nom: "bleue", n: bleues },
    { nom: "verte", n: vertes },
  ]);
  const answer = roundTo(couleur.n / total, 4);
  return {
    type: "numeric",
    chapter: "Probabilités — Tirage dans une urne",
    prompt: `Une urne contient ${rouges} billes rouges, ${bleues} billes bleues et ${vertes} billes vertes, indiscernables au toucher. On tire une bille au hasard. Quelle est la probabilité de tirer une bille ${couleur.nom} (sous forme décimale, arrondie au millième) ?`,
    answer,
    tolerance: 0.001,
    steps: [`P = ${couleur.n} \\div ${total} \\approx ${fr(answer)}`],
  };
}

// ---------- 13. Probabilité de l'événement contraire ----------
function genProbabiliteEvenementContraireNumeric() {
  const p = roundTo(randDecimal(0.05, 0.95, 2), 2);
  const answer = roundTo(1 - p, 2);
  return {
    type: "numeric",
    chapter: "Probabilités — Événement contraire",
    prompt: `Un événement A a une probabilité P(A) = ${fr(p)}. Quelle est la probabilité de l'événement contraire (ne pas réaliser A) ?`,
    answer,
    tolerance: 0.01,
    steps: [`P(\\text{contraire de A}) = 1 - P(A) = 1 - ${fr(p)} = ${fr(answer)}`],
  };
}

// ---------- 14. Comparer la probabilité de tirage entre plusieurs sacs ----------
function genComparerProbabilitesSacsQCM() {
  const noms = shuffle(prenoms).slice(0, 3);
  const sacs = noms.map(() => {
    const rouges = randInt(3, 100);
    const noires = randInt(3, 100);
    return { rouges, noires, p: rouges / (rouges + noires) };
  });
  let meilleur = 0;
  sacs.forEach((s, i) => {
    if (s.p > sacs[meilleur].p) meilleur = i;
  });
  const description = noms.map((nom, i) => `${nom} (${sacs[i].rouges} billes rouges et ${sacs[i].noires} billes noires)`).join(" ; ");
  return {
    type: "qcm",
    chapter: "Probabilités — Comparer des probabilités",
    prompt: `${description}. Chacun tire une bille au hasard dans son propre sac. Qui a la plus grande probabilité de tirer une bille rouge ?`,
    answer: noms[meilleur],
    options: [...noms],
    steps: [`On compare les proportions de billes rouges dans chaque sac : ${noms.map((n, i) => `${n} \\approx ${roundTo(sacs[i].p, 3)}`).join(", ")}.`],
  };
}

// ---------- 15. Probabilité de la somme de deux dés ----------
function genSommeDeuxDesProbabiliteNumeric() {
  const distribution = { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2, 12: 1 };
  const somme = randInt(2, 12);
  const favorables = distribution[somme];
  const answer = roundTo(favorables / 36, 4);
  return {
    type: "numeric",
    chapter: "Probabilités — Somme de deux dés",
    prompt: `On lance deux dés équilibrés à 6 faces et on additionne les résultats obtenus. Quelle est la probabilité d'obtenir une somme égale à ${somme} (sous forme décimale, arrondie au millième) ?`,
    answer,
    tolerance: 0.001,
    steps: [`Il y a ${favorables} façon(s) d'obtenir la somme ${somme} parmi les 36 issues possibles : P = ${favorables} \\div 36 \\approx ${fr(answer)}`],
  };
}

// ---------- 16. Fréquence et probabilité (loi des grands nombres) ----------
function genFrequenceVersProbabiliteQCM() {
  return {
    type: "qcm",
    chapter: "Probabilités — Fréquence et probabilité",
    prompt: `On répète un grand nombre de fois une expérience aléatoire. Que peut-on dire de la fréquence d'apparition d'un événement lorsque le nombre de répétitions augmente ?`,
    answer: "Elle se rapproche de la probabilité théorique de cet événement",
    options: shuffle([
      "Elle se rapproche de la probabilité théorique de cet événement",
      "Elle devient toujours égale à 0,5",
      "Elle s'éloigne de plus en plus de la probabilité théorique",
    ]),
    steps: [`C'est la loi des grands nombres : plus on répète l'expérience, plus la fréquence observée se rapproche de la probabilité théorique.`],
  };
}

// ---------- 17. Reconnaître une expérience aléatoire ----------
function genExperienceAleatoireQCM() {
  const items = [
    { texte: "Lancer un dé équilibré et regarder le numéro obtenu", r: "Oui" },
    { texte: "Demander la date de naissance de ta mère", r: "Non" },
    { texte: "Tirer une carte au hasard dans un jeu de cartes", r: "Oui" },
    { texte: "Additionner 2 et 3", r: "Non" },
    { texte: "Tourner une roue de loterie et regarder la case obtenue", r: "Oui" },
    { texte: "Mesurer la longueur d'une table avec un mètre", r: "Non" },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Probabilités — Expérience aléatoire",
    prompt: `"${it.texte}." Est-ce une expérience aléatoire (dont le résultat dépend du hasard) ?`,
    answer: it.r,
    options: ["Oui", "Non"],
    steps: [it.r === "Oui" ? `Le résultat n'est pas connu à l'avance : c'est une expérience aléatoire.` : `Le résultat est prévisible ou fixe : ce n'est pas une expérience aléatoire.`],
  };
}

// ---------- 18. Probabilité avec une roue de loterie à secteurs inégaux ----------
function genProbabiliteRoueSecteursInegauxNumeric() {
  const angle = pick([30, 45, 60, 72, 90, 120, 144, 180]);
  const answer = roundTo(angle / 360, 4);
  return {
    type: "numeric",
    chapter: "Probabilités — Roue de loterie",
    prompt: `Une roue de loterie est partagée en secteurs angulaires de tailles différentes. Un secteur donné a un angle de ${angle}°. Quelle est la probabilité que la flèche s'arrête sur ce secteur (sous forme décimale, arrondie au millième) ?`,
    answer,
    tolerance: 0.001,
    steps: [`P = \\dfrac{${angle}}{360} \\approx ${fr(answer)}`],
  };
}

// ---------- 19. Probabilité sous forme de fraction simplifiée (numérateur) ----------
function genProbabiliteFractionSimplifieeNumeric() {
  const total = randInt(10, 60);
  const favorables = randInt(1, total - 1);
  const d = pgcd(favorables, total);
  const numSimplifie = favorables / d;
  return {
    type: "numeric",
    chapter: "Probabilités — Simplifier une probabilité",
    prompt: `Dans une expérience à ${total} issues équiprobables, un événement a ${favorables} issues favorables. Une fois la fraction \\(\\dfrac{${favorables}}{${total}}\\) simplifiée au maximum, quel est son numérateur ?`,
    answer: numSimplifie,
    steps: [`\\text{PGCD}(${favorables}, ${total}) = ${d}`, `\\dfrac{${favorables}}{${total}} = \\dfrac{${numSimplifie}}{${total / d}}`],
  };
}

// ---------- 20. Classement de probabilités (ordonner) ----------
function genClassementProbabilitesQCM() {
  const evenements = [
    { nom: "A", p: 0 },
    { nom: "B", p: 1 },
    { nom: "C", p: 0.25 },
    { nom: "D", p: 0.5 },
    { nom: "E", p: 0.75 },
  ];
  const shuffled = shuffle(evenements);
  const plusProbable = shuffled.reduce((max, e) => (e.p > max.p ? e : max), shuffled[0]);
  const description = shuffled.map((e) => `P(${e.nom}) = ${fr(e.p)}`).join(" ; ");
  return {
    type: "qcm",
    chapter: "Probabilités — Classement",
    prompt: `On donne les probabilités de cinq événements : ${description}. Quel est l'événement le plus probable ?`,
    answer: plusProbable.nom,
    options: shuffled.map((e) => e.nom),
    steps: [`L'événement le plus probable est celui dont la probabilité est la plus proche de 1.`],
  };
}

const GENERATORS = [
  genCalculerFrequencePourcentageNumeric,
  genCalculerEffectifTotalNumeric,
  genAngleDiagrammeCirculaireNumeric,
  genLireTableauEffectifsQCM,
  genCalculerMoyenneSimpleNumeric,
  genEcartALaMoyenneNumeric,
  genMoyennePondereeNumeric,
  genExclureValeursExtremesMoyenneNumeric,
  genComparerMoyennesQCM,
  genQualifierEvenementQCM,
  genProbabiliteDeNumeric,
  genProbabiliteUrneTirageNumeric,
  genProbabiliteEvenementContraireNumeric,
  genComparerProbabilitesSacsQCM,
  genSommeDeuxDesProbabiliteNumeric,
  genFrequenceVersProbabiliteQCM,
  genExperienceAleatoireQCM,
  genProbabiliteRoueSecteursInegauxNumeric,
  genProbabiliteFractionSimplifieeNumeric,
  genClassementProbabilitesQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "statistiques-probabilites",
    title: "Statistiques, probabilités",
    description: "Effectif et fréquence, tableaux et diagrammes, moyenne (simple, pondérée, écarts), probabilités (équiprobabilité, événement contraire, somme de deux dés, fréquence et probabilité).",
    level: "cinquieme",
    free: false,
    order: 10,
  },
  generate,
};
