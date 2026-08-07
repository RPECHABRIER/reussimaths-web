// ---------------------------------------------------------------------------
// Chapitre : Proportionnalité (6e, abonnement) — dernier chapitre du
// programme de 6e couvert par l'application. Couvre le Mémo 1 "Identifier une
// situation de proportionnalité", le Mémo 2 "Résoudre un problème de
// proportionnalité" (quatrième proportionnelle, coefficient), le Mémo 3
// "Écrire une proportion" et le Mémo 4 "Calculer et appliquer un
// pourcentage", ainsi qu'une sélection de problèmes contextualisés (recettes,
// essence, peinture, remises, échelles, lots).
//
// Convention "vrai/faux conceptuel" : les questions du type "cette situation
// est-elle proportionnelle ?" qui demandent une justification en texte libre
// (ex. âge/masse d'un enfant, taille d'un arbre selon son âge) sont
// reformulées en QCM sur une banque fixe de situations connues (vraies ou
// fausses), avec l'explication en `steps` — voir
// genVraiFauxProportionnaliteConceptuel().
//
// Volontairement laissés de côté (pas automatisables avec le format actuel
// numeric/qcm/text/multi) : les questions "explique pourquoi" en texte libre
// (ex. 6, 74a), les problèmes à coloriage de grille/mosaïque (Mémo 3, ex.
// 34-38), le problème de lecture d'une carte donnée en image (ex. 31, la
// nôtre est un problème d'échelle générée par le texte à la place), et le
// problème très ouvert du calcul de l'assiette de gâteaux à partir d'une
// photo de vitrine (ex. 75).
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

import { texTable } from "../utils/texTable.js";

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

function shuffleStatements(items) {
  const order = shuffle(items.map((_, i) => i));
  const options = order.map((i) => items[i].text);
  const answer = order.map((i, newIndex) => (items[i].correct ? newIndex : null)).filter((v) => v !== null);
  return { options, answer };
}

// Contextes utilisés pour les tableaux de proportionnalité (exercices 2, 3, 4
// ci-dessous). Le programme 2025 précise explicitement qu'un tableau de
// proportionnalité doit toujours être rattaché à un contexte et à des
// grandeurs nommées, avec leur unité — jamais une simple liste de nombres
// sans nom ("il ne s'agira donc jamais de tableaux de listes de nombres
// proportionnelles sans qu'elles soient rattachées à un contexte et à des
// grandeurs"). D'où ces libellés systématiquement affichés au-dessus de
// chaque ligne du tableau.
const TABLE_CONTEXTS = [
  { g1: "Masse de pommes (en kg)", g2: "Prix (en euros)" },
  { g1: "Quantité d'essence (en L)", g2: "Prix (en euros)" },
  { g1: "Nombre de stylos", g2: "Prix (en euros)" },
  { g1: "Durée (en min)", g2: "Nombre de pièces produites" },
  { g1: "Nombre de billets de cinéma", g2: "Prix (en euros)" },
];

// =========================== Mémo 2 : résoudre un problème de proportionnalité ===========================

// ---------- 1. Quatrième proportionnelle (contextes variés) ----------
function genQuatriemeProportionnelleGenerique() {
  const contexts = [
    { montaire: true, tpl: (a, b, c) => `${a} kg de pommes coûtent ${fr(b)} €. Combien coûtent ${c} kg de pommes ?` },
    { montaire: true, tpl: (a, b, c) => `${a} L d'essence coûtent ${fr(b)} €. Combien coûtent ${c} L d'essence ?` },
    { montaire: true, tpl: (a, b, c) => `${a} stylos identiques coûtent ${fr(b)} €. Combien coûtent ${c} stylos ?` },
    { montaire: false, tpl: (a, b, c) => `Une machine produit ${b} pièces en ${a} minutes (à vitesse constante). Combien de pièces produit-elle en ${c} minutes ?` },
    { montaire: true, tpl: (a, b, c) => `${a} billets de cinéma coûtent ${fr(b)} €. Combien coûtent ${c} billets ?` },
  ];
  const ctx = pick(contexts);
  const k = ctx.montaire ? pick([0.5, 1, 1.5, 2, 2.5, 3, 4]) : pick([1, 2, 3, 4, 5]);
  const a = randInt(2, 12);
  const b = roundTo(a * k, 2);
  const c = randInt(2, 20);
  const d = roundTo(c * k, 2);
  const tpl = ctx.tpl;
  return {
    type: "numeric",
    chapter: "Proportionnalité — Quatrième proportionnelle",
    prompt: tpl(a, b, c),
    answer: d,
    steps: [
      { type: "calcul", text: `Coefficient : ${fr(b)} \\div ${a} = ${fr(k)}` },
      { type: "calcul", text: `${c} \\times ${fr(k)} = ${fr(d)}` },
    ],
  };
}

// ---------- 2. Calculer un coefficient de proportionnalité ----------
// Vocabulaire "coefficient" volontairement réservé à un niveau standard (et
// non facile) : le programme 2025 introduit cette notion progressivement,
// après la linéarité et le retour à l'unité (voir la carte mentale). Tableau
// toujours rattaché à un contexte avec grandeurs nommées (voir TABLE_CONTEXTS).
function genCoefficientDeProportionnalite() {
  const k = pick([0.5, 1.5, 2, 2.5, 3, 4, 5]);
  const a1 = randInt(2, 10);
  const b1 = roundTo(a1 * k, 2);
  const a2 = randInt(2, 10);
  const b2 = roundTo(a2 * k, 2);
  const ctx = pick(TABLE_CONTEXTS);
  const table = texTable([
    [ctx.g1, a1, a2],
    [ctx.g2, fr(b1), fr(b2)],
  ]);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Coefficient de proportionnalité",
    prompt: `Ce tableau de proportionnalité donne : ${table} Quel est le coefficient de proportionnalité (le nombre par lequel on multiplie une valeur de la première ligne pour obtenir celle de la deuxième ligne) ?`,
    answer: k,
    steps: [{ type: "calcul", text: `${fr(b1)} \\div ${a1} = ${fr(k)}` }],
  };
}

// ---------- 3. Reconnaître un tableau de proportionnalité ----------
// Tableau toujours rattaché à un contexte avec grandeurs nommées, jamais une
// liste de nombres seule (voir TABLE_CONTEXTS).
function genEstTableauProportionnel() {
  const isProportional = Math.random() < 0.5;
  const k = pick([0.5, 1.5, 2, 2.5, 3, 4]);
  const ctx = pick(TABLE_CONTEXTS);
  const tops = shuffle(Array.from({ length: 8 }, (_, i) => i + 2)).slice(0, 3).sort((a, b) => a - b);
  let bottoms = tops.map((t) => roundTo(t * k, 2));
  if (!isProportional) {
    const idx = randInt(0, 2);
    bottoms[idx] = roundTo(bottoms[idx] + (Math.random() < 0.5 ? 1 : -1) * nonZero(1, 3), 2);
  }
  const table = texTable([
    [ctx.g1, ...tops],
    [ctx.g2, ...bottoms.map(fr)],
  ]);
  return {
    type: "qcm",
    chapter: "Proportionnalité — Reconnaître un tableau",
    prompt: `Ce tableau est-il un tableau de proportionnalité ? ${table}`,
    answer: isProportional ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "calcul", text: `On calcule les rapports : ${tops.map((t, i) => `${fr(bottoms[i])} \\div ${t} = ${fr(roundTo(bottoms[i] / t, 3))}`).join(" ; ")}.` }],
  };
}

// ---------- 4. Compléter une valeur manquante dans un tableau de proportionnalité ----------
// Tableau toujours rattaché à un contexte avec grandeurs nommées ; étape
// reformulée sans le mot "coefficient" (réservé à genCoefficientDeProportionnalite,
// de niveau standard) pour rester sur le raisonnement "on multiplie toujours
// par le même nombre" (linéarité / retour à l'unité), conforme à la
// progressivité voulue par le programme 2025.
function genCompleterTableauProportionnaliteManquant() {
  const k = pick([0.5, 1.5, 2, 2.5, 3, 4, 5]);
  const a1 = randInt(2, 10);
  const b1 = roundTo(a1 * k, 2);
  const a2 = randInt(11, 25);
  const b2 = roundTo(a2 * k, 2);
  const a3 = randInt(2, 10);
  const ctx = pick(TABLE_CONTEXTS);
  const table = texTable([
    [ctx.g1, a1, a2, a3],
    [ctx.g2, fr(b1), fr(b2), "?"],
  ]);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Compléter un tableau",
    prompt: `Voici un tableau de proportionnalité : ${table} Quelle est la valeur manquante ?`,
    answer: roundTo(a3 * k, 2),
    steps: [
      { type: "calcul", text: `On cherche par quel nombre on multiplie toujours pour passer de la première grandeur à la deuxième : ${fr(b1)} \\div ${a1} = ${fr(k)}` },
      { type: "calcul", text: `${a3} \\times ${fr(k)} = ${fr(roundTo(a3 * k, 2))}` },
    ],
  };
}

// =========================== Mémo 4 : calculer et appliquer un pourcentage ===========================

// ---------- 5. Calculer un effectif à partir d'un pourcentage ----------
function genPourcentageEffectifCombien() {
  const pcts = [4, 5, 10, 20, 25, 30, 40, 50, 60, 75];
  const pct = pick(pcts);
  const base = randInt(4, 40) * (100 / pgcdPct(pct, 100));
  const n = Math.max(20, Math.min(900, Math.round(base / 10) * 10));
  const effectif = Math.round((n * pct) / 100);
  const activites = ["jouent du piano", "pratiquent un sport", "apprennent l'espagnol", "sont externes", "font du vélo pour venir"];
  const act = pick(activites);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Appliquer un pourcentage",
    prompt: `Dans une école de ${n} élèves, ${pct} % des élèves ${act}. Combien d'élèves cela représente-t-il ?`,
    answer: effectif,
    steps: [
      { type: "regle", text: `Prendre ${pct} % d'un nombre, c'est le multiplier par \\(\\dfrac{${pct}}{100}\\).` },
      { type: "calcul", text: `${n} \\times \\dfrac{${pct}}{100} = ${effectif}` },
    ],
  };
}
function pgcdPct(a, b) {
  let x = a, y = b;
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

// ---------- 6. Exprimer une proportion en pourcentage à partir de deux effectifs ----------
function genProportionEnPourcentageDepuisEffectifs() {
  const total = randInt(200, 900);
  const part = randInt(Math.round(total * 0.05), Math.round(total * 0.6));
  const pct = roundTo((part / total) * 100, 1);
  const activites = ["pratiquent la lutte", "sont volontaires pour la sortie", "ont répondu au questionnaire", "portent des lunettes"];
  const act = pick(activites);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Pourcentage depuis des effectifs",
    prompt: `Parmi les ${total} élèves du collège, ${part} ${act}. Exprime cela en pourcentage (arrondis à 1 décimale).`,
    answer: pct,
    tolerance: 0.15,
    steps: [
      { type: "regle", text: `Pour passer d'une fraction (effectif sur total) à un pourcentage, on multiplie par 100.` },
      { type: "calcul", text: `\\(\\dfrac{${part}}{${total}} \\times 100 \\approx ${fr(pct)}\\%\\)` },
    ],
  };
}

// ---------- 7. Appliquer une remise (prix final) ----------
function genRemisePourcentagePrixFinal() {
  const prix = randDecimal(15, 200, 2);
  const remise = pick([10, 15, 20, 25, 30, 50]);
  const prixFinal = roundTo(prix * (1 - remise / 100), 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Remises",
    prompt: `Un article coûte ${fr(prix)} €. On bénéficie d'une remise de ${remise} %. Combien doit-on payer après la réduction ? (arrondis au centime)`,
    answer: prixFinal,
    tolerance: 0.02,
    steps: [
      { type: "regle", text: `Une remise de ${remise} % signifie qu'on paie ${100 - remise} % du prix, donc on multiplie par \\(1 - \\dfrac{${remise}}{100}\\).` },
      { type: "calcul", text: `${fr(prix)} \\times (1 - \\dfrac{${remise}}{100}) = ${fr(prixFinal)}` },
    ],
  };
}

// ---------- 8. Remise sur un achat multiple ----------
function genRemiseAchatMultiple() {
  const prixUnite = randDecimal(1.5, 8, 2);
  const quantite = randInt(3, 10);
  const remise = pick([10, 20, 25, 50]);
  const prixTotal = roundTo(prixUnite * quantite * (1 - remise / 100), 2);
  const objets = ["tubes de colle", "cahiers", "crayons", "gommes", "règles"];
  const obj = pick(objets);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Remises",
    prompt: `Paul achète ${quantite} ${obj} qui coûtaient initialement ${fr(prixUnite)} € l'unité. En caisse, il bénéficie d'une remise de ${remise} % sur son achat. Combien paie-t-il en tout ? (arrondis au centime)`,
    answer: prixTotal,
    tolerance: 0.02,
    steps: [
      { type: "calcul", text: `${quantite} \\times ${fr(prixUnite)} = ${fr(roundTo(prixUnite * quantite, 2))}` },
      { type: "calcul", text: `${fr(roundTo(prixUnite * quantite, 2))} \\times (1 - \\dfrac{${remise}}{100}) = ${fr(prixTotal)}` },
    ],
  };
}

// =========================== Problèmes contextualisés ===========================

// ---------- 9. Échelle d'une carte ----------
function genEchelleCarteDistance() {
  const echelleM = pick([5, 10, 20, 25, 50, 100]);
  const longueurCm = randInt(2, 20);
  const distanceM = echelleM * longueurCm;
  return {
    type: "numeric",
    chapter: "Proportionnalité — Échelles",
    prompt: `Sur une carte, l'échelle est représentée ainsi : 1 cm sur la carte correspond à ${echelleM} m dans la réalité. Une route mesure ${longueurCm} cm sur la carte. Quelle est sa longueur réelle, en mètres ?`,
    answer: distanceM,
    steps: [{ type: "calcul", text: `${longueurCm} \\times ${echelleM} = ${distanceM}` }],
  };
}

// ---------- 10. Recette proportionnelle ----------
function genRecetteProportionnelle() {
  const ingredients = [
    ["L d'eau", "carottes"],
    ["kg de farine", "œufs"],
    ["L de lait", "sachets de sucre vanillé"],
    ["kg de riz", "verres d'eau"],
  ];
  const [ing1, ing2] = pick(ingredients);
  const a = randInt(2, 6);
  const b = randInt(2, 12);
  const c = a * randInt(2, 6);
  const answer = roundTo((c / a) * b, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Recettes",
    prompt: `Pour préparer une recette, il faut ${a} ${ing1} et ${b} ${ing2}. Avec ${c} ${ing1}, combien faut-il de ${ing2} ?`,
    answer,
    steps: [
      { type: "calcul", text: `Coefficient : ${c} \\div ${a} = ${fr(roundTo(c / a, 3))}` },
      { type: "calcul", text: `${b} \\times ${fr(roundTo(c / a, 3))} = ${fr(answer)}` },
    ],
  };
}

// ---------- 11. Consommation d'essence proportionnelle ----------
function genConsommationEssenceProportionnelle() {
  const consoAux100 = randDecimal(4, 9, 1);
  const distanceKm = randInt(50, 900);
  const litres = roundTo((consoAux100 * distanceKm) / 100, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Consommation d'essence",
    prompt: `Une voiture consomme ${fr(consoAux100)} litres d'essence pour parcourir 100 km. Combien de litres consomme-t-elle pour parcourir ${distanceKm} km ? (arrondis à 2 décimales)`,
    answer: litres,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `\\dfrac{${fr(consoAux100)}}{100} \\times ${distanceKm} = ${fr(litres)}` }],
  };
}

// ---------- 12. Peinture et surface totale ----------
function genPeintureSurfaceTotale() {
  const litresParM2 = pick([0.1, 0.15, 0.2, 0.25]);
  const surface1 = randInt(15, 40);
  const surface2 = randInt(15, 40);
  const totalSurface = surface1 + surface2;
  const litresNecessaires = roundTo(totalSurface * litresParM2, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Peinture et surfaces",
    prompt: `Un peintre utilise une peinture telle qu'il faut ${fr(litresParM2)} L de peinture par m². Il doit peindre deux pièces : une première pièce de ${surface1} m² et une deuxième pièce de ${surface2} m². Combien de litres de peinture sont nécessaires pour les deux pièces ?`,
    answer: litresNecessaires,
    tolerance: 0.05,
    steps: [
      { type: "calcul", text: `${surface1} + ${surface2} = ${totalSurface} \\text{ m}^2` },
      { type: "calcul", text: `${totalSurface} \\times ${fr(litresParM2)} = ${fr(litresNecessaires)}` },
    ],
  };
}

// ---------- 13. Partage équitable d'un lot ----------
function genPartageEquitableLots() {
  const nbTickets = pick([4, 5, 8, 10]);
  const prixLot = randInt(nbTickets * 2, nbTickets * 4);
  const nbRachetes = randInt(1, nbTickets - 1);
  const montant = roundTo((prixLot / nbTickets) * nbRachetes, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Partage équitable",
    prompt: `Antoine achète un lot de ${nbTickets} tickets pour ${prixLot} €. Carole veut lui en racheter ${nbRachetes}. Afin d'être équitable, combien Carole doit-elle donner à Antoine ? (en €, arrondis au centime)`,
    answer: montant,
    tolerance: 0.02,
    steps: [
      { type: "calcul", text: `Prix d'un ticket : ${prixLot} \\div ${nbTickets} = ${fr(roundTo(prixLot / nbTickets, 3))}` },
      { type: "calcul", text: `${nbRachetes} \\times ${fr(roundTo(prixLot / nbTickets, 3))} = ${fr(montant)}` },
    ],
  };
}

// ---------- 14. Trouver le meilleur lot (prix le plus avantageux) ----------
function genMeilleurLotAchat() {
  const base = randDecimal(0.4, 0.9, 2);
  const lots = [2, 3, 5].map((n) => {
    const remiseAleatoire = randDecimal(0.9, 1, 2);
    const prix = roundTo(n * base * remiseAleatoire, 2);
    return { n, prix, unitPrice: prix / n };
  });
  const meilleur = lots.reduce((best, l) => (l.unitPrice < best.unitPrice ? l : best));
  const options = lots.map((l) => `Lot de ${l.n} : ${fr(l.prix)} €`);
  const answer = `Lot de ${meilleur.n} : ${fr(meilleur.prix)} €`;
  return {
    type: "qcm",
    chapter: "Proportionnalité — Meilleur prix",
    prompt: `Une boulangerie propose 30 croissants à commander, avec ces lots : ${lots.map((l) => `lot de ${l.n} pour ${fr(l.prix)} €`).join(", ")}. Quel lot a le meilleur prix par croissant ?`,
    answer,
    options,
    steps: lots.map((l) => ({ type: "calcul", text: `Lot de ${l.n} : ${fr(l.prix)} \\div ${l.n} \\approx ${fr(roundTo(l.unitPrice, 3))} € par croissant` })),
  };
}

// ---------- 15. Reconnaître une situation NON proportionnelle (banque conceptuelle) ----------
function genVraiFauxProportionnaliteConceptuel() {
  const cases = [
    { texte: "Un enfant de 2 ans boit 400 mL de lait par jour. On considère qu'à 20 ans, il boira donc 4 000 mL de lait par jour.", correct: "Faux", explication: "La quantité de lait bue par jour n'est pas proportionnelle à l'âge d'une personne." },
    { texte: "Avec 5 L de peinture, on peint 18 m². On considère qu'avec 10 L de la même peinture, on peut peindre 36 m².", correct: "Vrai", explication: "La surface peinte est proportionnelle au volume de peinture utilisée." },
    { texte: "La taille des arbres est proportionnelle à leur âge : un arbre de 500 ans mesurerait alors 50 fois la taille d'un arbre de 10 ans.", correct: "Faux", explication: "La croissance d'un arbre ralentit avec l'âge, ce n'est pas une situation de proportionnalité." },
    { texte: "Pour une classe de 20 élèves, une sortie scolaire (bus à 300 € + 5 € par élève) coûte 400 €.", correct: "Vrai", explication: "300 + 20 \\times 5 = 400 : c'est cohérent, mais le coût total n'est pas proportionnel au nombre d'élèves à cause du forfait fixe du bus." },
    { texte: "Le prix d'une course de taxi (prise en charge fixe + prix au kilomètre) est proportionnel à la distance parcourue.", correct: "Faux", explication: "À cause de la prise en charge fixe, doubler la distance ne double pas le prix total." },
    { texte: "Si un robinet remplit un seau à débit constant, le volume d'eau versé est proportionnel à la durée d'écoulement.", correct: "Vrai", explication: "À débit constant, volume et durée sont bien proportionnels." },
    { texte: "Un enfant qui sait compter jusqu'à 13 à 4 ans saura compter jusqu'à 39 à 12 ans (3 fois plus).", correct: "Faux", explication: "Le développement des compétences d'un enfant n'est pas proportionnel à son âge." },
    { texte: "Le prix total d'un plein d'essence est proportionnel au nombre de litres achetés (à prix au litre fixe).", correct: "Vrai", explication: "Prix au litre constant : le prix total est bien proportionnel à la quantité." },
  ];
  const c = pick(cases);
  return {
    type: "qcm",
    chapter: "Proportionnalité — Identifier une situation",
    prompt: `Vrai ou faux ? « ${c.texte} »`,
    answer: c.correct,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: c.explication }],
  };
}

// ---------- 16. Cocher les affirmations vraies sur un calcul de pourcentage ----------
function genPourcentageResultatMultiStatements() {
  const n = randInt(60, 300);
  const pct = pick([15, 25, 35, 45, 55, 65, 75, 85]);
  const resultat = roundTo((n * pct) / 100, 2);
  const items = [
    { text: `Le résultat est plus grand que ${roundTo(n / 2, 1)}.`, correct: resultat > n / 2 },
    { text: `Le résultat est ${fr(resultat)}.`, correct: true },
    { text: `Le résultat s'obtient en calculant \\(${n} \\times ${fr(pct / 100)}\\).`, correct: true },
    { text: `Le résultat s'obtient en calculant \\(${n} \\div ${pct}\\).`, correct: false },
    { text: `Le résultat est plus petit que ${n}.`, correct: true },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Proportionnalité — Pourcentages (vrai/faux)",
    prompt: `On calcule ${pct} % de ${n}. Sélectionne toutes les affirmations vraies.`,
    answer,
    options,
    steps: [{ type: "calcul", text: `${pct}\\% \\text{ de } ${n} = ${n} \\times \\dfrac{${pct}}{100} = ${fr(resultat)}` }],
  };
}

// ---------- 17. Comparer deux pourcentages issus de deux effectifs ----------
function genPourcentageComparerDeuxEcoles() {
  const total1 = randInt(300, 700);
  const malades1 = randInt(20, Math.round(total1 * 0.3));
  const pct1 = roundTo((malades1 / total1) * 100, 1);
  const total2 = randInt(300, 700);
  const pct2 = pick([5, 10, 15, 20, 25]);
  const malades2 = Math.round((total2 * pct2) / 100);
  const askEcole1 = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Proportionnalité — Comparer deux proportions",
    prompt: askEcole1
      ? `Dans une école de ${total1} élèves, ${malades1} élèves sont malades aujourd'hui. Dans une autre école de ${total2} élèves, ${pct2} % des élèves sont malades. Quel est le pourcentage d'élèves malades dans la première école ? (arrondis à 1 décimale)`
      : `Dans une école de ${total1} élèves, ${malades1} élèves sont malades aujourd'hui (soit ${fr(pct1)} % environ). Dans une autre école de ${total2} élèves, ${pct2} % des élèves sont malades. Combien d'élèves sont malades dans la deuxième école ?`,
    answer: askEcole1 ? pct1 : malades2,
    tolerance: askEcole1 ? 0.15 : 0.5,
    steps: askEcole1
      ? [
          { type: "regle", text: `Pour passer d'une fraction (effectif sur total) à un pourcentage, on multiplie par 100.` },
          { type: "calcul", text: `\\(\\dfrac{${malades1}}{${total1}} \\times 100 \\approx ${fr(pct1)}\\%\\)` },
        ]
      : [
          { type: "regle", text: `Prendre ${pct2} % d'un nombre, c'est le multiplier par \\(\\dfrac{${pct2}}{100}\\).` },
          { type: "calcul", text: `${total2} \\times \\dfrac{${pct2}}{100} = ${malades2}` },
        ],
  };
}

// ---------- 18. Pourcentage inverse : retrouver le nombre initial ----------
function genPourcentageInverseTrouverNombreInitial() {
  const pct = pick([4, 5, 10, 20, 25, 40, 50]);
  const total = randInt(2, 30) * (100 / pgcdPct(pct, 100));
  const part = Math.round((total * pct) / 100);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Pourcentage inverse",
    prompt: `${part} représente ${pct} % d'un nombre. Quel est ce nombre ?`,
    answer: total,
    steps: [
      { type: "regle", text: `Pour retrouver le nombre initial à partir d'un pourcentage, on divise par \\(\\dfrac{${pct}}{100}\\).` },
      { type: "calcul", text: `${part} \\div \\dfrac{${pct}}{100} = ${part} \\times \\dfrac{100}{${pct}} = ${total}` },
    ],
  };
}

const GENERATORS = [
  genQuatriemeProportionnelleGenerique,
  genCoefficientDeProportionnalite,
  genEstTableauProportionnel,
  genCompleterTableauProportionnaliteManquant,
  genPourcentageEffectifCombien,
  genProportionEnPourcentageDepuisEffectifs,
  genRemisePourcentagePrixFinal,
  genRemiseAchatMultiple,
  genEchelleCarteDistance,
  genRecetteProportionnelle,
  genConsommationEssenceProportionnelle,
  genPeintureSurfaceTotale,
  genPartageEquitableLots,
  genMeilleurLotAchat,
  genVraiFauxProportionnaliteConceptuel,
  genPourcentageResultatMultiStatements,
  genPourcentageComparerDeuxEcoles,
  genPourcentageInverseTrouverNombreInitial,
];

const DIFFICULTY = {
  // "Coefficient" est un vocabulaire introduit progressivement, après la
  // linéarité et le retour à l'unité (voir commentaire au-dessus du
  // générateur) — d'où "standard" et non "facile".
  genCoefficientDeProportionnalite: "standard",
  genEstTableauProportionnel: "facile",
  genCompleterTableauProportionnaliteManquant: "facile",
  genQuatriemeProportionnelleGenerique: "standard",
  genPourcentageEffectifCombien: "standard",
  genProportionEnPourcentageDepuisEffectifs: "standard",
  genRemisePourcentagePrixFinal: "standard",
  genEchelleCarteDistance: "standard",
  genConsommationEssenceProportionnelle: "standard",
  genVraiFauxProportionnaliteConceptuel: "standard",
  genRemiseAchatMultiple: "expert",
  genRecetteProportionnelle: "expert",
  genPeintureSurfaceTotale: "expert",
  genPartageEquitableLots: "expert",
  genMeilleurLotAchat: "expert",
  genPourcentageResultatMultiStatements: "expert",
  genPourcentageComparerDeuxEcoles: "expert",
  genPourcentageInverseTrouverNombreInitial: "expert",
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
    id: "proportionnalite",
    title: "Proportionnalité",
    description: "Reconnaître, calculer et appliquer une situation de proportionnalité, pourcentages et problèmes contextualisés.",
    pourquoi: "Reconnaître une situation de proportionnalité, c'est l'une des compétences les plus utilisées au quotidien : recettes de cuisine, pourcentages, échelles de carte, conversions de devises.",
    level: "sixieme",
    free: false,
    order: 10,
    // Onglet "Cours" — voir le commentaire équivalent dans
    // src/chapters/nombres-decimaux.js.
    // Carte mentale organisée selon la progressivité voulue par le programme
    // 2025 (BO du 17 avril 2025, cycle 3) : la proportionnalité y est
    // enseignée en 3 définitions de plus en plus précises — d'abord la
    // linéarité (doubler/tripler...), puis le retour à l'unité, et enfin,
    // seulement en dernier lieu, le coefficient de proportionnalité comme
    // raccourci pratique. Le programme précise aussi qu'un tableau de
    // proportionnalité doit toujours être associé à des grandeurs nommées
    // avec leur unité, jamais une liste de nombres seule — d'où l'item dédié
    // dans la première branche. Le "produit en croix" reste volontairement
    // absent : il est explicitement exclu du programme de 6e ("la technique
    // du « produit en croix » n'est pas enseignée").
    cours: {
      mindMap: {
        title: "Proportionnalité",
        branches: [
          {
            title: "Reconnaître la proportionnalité",
            items: [
              "Deux grandeurs sont proportionnelles si, quand l'une est multipliée par un nombre, l'autre est multipliée par ce même nombre (si l'une double, l'autre double ; si l'une est divisée par 2, l'autre aussi).",
              "Beaucoup de situations qui semblent proportionnelles ne le sont pas (ex. l'âge et la pointure d'un enfant) : il faut toujours vérifier.",
              "Dans un tableau, on nomme toujours chaque grandeur avec son unité (ex. « Masse en kg », « Prix en € ») : jamais une liste de nombres seule.",
            ],
          },
          {
            title: "Trouver une valeur manquante",
            items: [
              "Méthode par linéarité : si la quantité de départ est multipliée (ou divisée) par un nombre, la quantité d'arrivée l'est aussi par ce même nombre.",
              "Méthode du retour à l'unité : on calcule d'abord la valeur pour UNE unité (ex. le prix d'1 kg), puis on multiplie par la quantité voulue.",
            ],
            formula: "\\(3\\text{ pers.} \\to 150\\text{ g} \\ \\Rightarrow\\ 1\\text{ pers.} \\to 50\\text{ g} \\ \\Rightarrow\\ 5\\text{ pers.} \\to 250\\text{ g}\\)",
          },
          {
            title: "Le coefficient de proportionnalité",
            items: [
              "Une fois les méthodes précédentes bien comprises, on peut aller plus vite avec le coefficient de proportionnalité : le nombre par lequel on multiplie toujours pour passer d'une grandeur à l'autre.",
              "On le trouve en divisant une valeur d'arrivée par la valeur de départ correspondante ; ensuite, on multiplie n'importe quelle valeur de départ par ce coefficient.",
            ],
            formula: "\\(\\text{valeur d'arrivée} = \\text{valeur de départ} \\times \\text{coefficient}\\)",
          },
          {
            title: "Pourcentages",
            items: [
              "Un pourcentage est une proportionnalité ramenée à un total de 100.",
              "Appliquer un pourcentage à une quantité, c'est la multiplier par ce pourcentage divisé par 100.",
            ],
            formula: "\\(20\\% \\times 80 = \\dfrac{20}{100}\\times 80 = 16\\)",
          },
        ],
      },
    },
  },
  generate,
};
