// ---------------------------------------------------------------------------
// Chapitre : Probabilités (3e) — sous abonnement.
//
// Correspond au chapitre 9 du manuel de 3e : vocabulaire (expérience
// aléatoire, issue, univers, événement certain/impossible/élémentaire,
// événement contraire), calcul d'une probabilité dans une situation
// d'équiprobabilité (urne, dé, cartes, roue), reconnaître une situation
// d'équiprobabilité, propriété P(A) + P(non A) = 1 et somme des probabilités
// de tous les événements élémentaires égale à 1, lien entre probabilité
// théorique et effectif attendu sur un grand nombre d'expériences,
// comparaison de probabilités, et probabilité après un tirage sans remise.
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "probabilites-troisieme") pour les
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

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function reduceFrac(num, den) {
  const g = gcd(num, den) || 1;
  return [num / g, den / g];
}

const objetsUrne = ["boules", "billes", "jetons", "cartes", "pions"];
const couleurs = ["rouges", "bleus", "verts", "jaunes", "noirs", "blancs"];

// =========================== Généralités sur les probabilités ===========================

// ---------- 1. Identifier un événement certain / impossible / élémentaire ----------
function genIdentifierEvenementQCM() {
  const n = randInt(4, 10);
  const type = pick(["certain", "impossible", "elementaire"]);
  let prompt, answer;
  const options = ["Événement certain", "Événement impossible", "Événement élémentaire"];
  if (type === "certain") {
    prompt = `On lance un dé à ${n} faces numérotées de 1 à ${n}. Quel type d'événement est « Obtenir un nombre compris entre 1 et ${n} » ?`;
    answer = "Événement certain";
  } else if (type === "impossible") {
    prompt = `On lance un dé à ${n} faces numérotées de 1 à ${n}. Quel type d'événement est « Obtenir ${n + randInt(1, 5)} » ?`;
    answer = "Événement impossible";
  } else {
    prompt = `On lance un dé à ${n} faces numérotées de 1 à ${n}. Quel type d'événement est « Obtenir exactement le nombre ${randInt(1, n)} » ?`;
    answer = "Événement élémentaire";
  }
  return {
    type: "qcm",
    chapter: "Probabilités — Généralités",
    prompt,
    answer,
    options,
    steps: [
      answer === "Événement certain"
        ? `Cet événement se réalise à chaque lancer : il est certain.`
        : answer === "Événement impossible"
        ? `Cet événement ne peut jamais se réaliser : il est impossible.`
        : `Cet événement correspond à une seule issue possible : il est élémentaire.`,
    ],
  };
}

// ---------- 2. Nombre d'issues favorables ----------
function genNombreIssuesQCM() {
  const total = randInt(15, 40);
  const critere = pick(["un nombre pair", "un nombre impair", "un multiple de 3", "un multiple de 5"]);
  let favorables;
  if (critere === "un nombre pair") favorables = Math.floor(total / 2);
  else if (critere === "un nombre impair") favorables = Math.ceil(total / 2);
  else if (critere === "un multiple de 3") favorables = Math.floor(total / 3);
  else favorables = Math.floor(total / 5);
  const propositionsSet = new Set([favorables, favorables + randInt(1, 3), Math.max(1, favorables - randInt(1, 3))]);
  while (propositionsSet.size < 3) propositionsSet.add(favorables + propositionsSet.size + 1);
  const options = shuffle([...propositionsSet].map(String));
  return {
    type: "qcm",
    chapter: "Probabilités — Généralités",
    prompt: `On tire au hasard un jeton numéroté parmi ${total} jetons numérotés de 1 à ${total}. Combien de jetons portent ${critere} ?`,
    answer: String(favorables),
    options,
    steps: [`Parmi les nombres de 1 à ${total}, il y en a exactement ${favorables} qui portent ${critere}.`],
  };
}

// =========================== Calculs de probabilités ===========================

// ---------- 3. Probabilité simple dans une urne (situation d'équiprobabilité) ----------
function genProbabiliteUrneNumeric() {
  const c1 = randInt(2, 12);
  const c2 = randInt(2, 12);
  const c3 = randInt(2, 12);
  const total = c1 + c2 + c3;
  const [couleurA, couleurB, couleurC] = shuffle(couleurs).slice(0, 3);
  const objet = pick(objetsUrne);
  const [num, den] = [c1, total];
  const answer = roundTo(num / den, 3);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `Une urne contient ${c1} ${objet} ${couleurA}, ${c2} ${objet} ${couleurB} et ${c3} ${objet} ${couleurC}, indiscernables au toucher. On tire un ${objet.slice(0, -1)} au hasard. Donne la probabilité d'obtenir un ${objet.slice(0, -1)} ${couleurA} (sous forme décimale, arrondie au millième).`,
    answer,
    tolerance: 0.002,
    steps: [`Il y a ${total} ${objet} en tout, dont ${c1} ${couleurA}.`, `P = \\dfrac{${c1}}{${total}} \\approx ${fr(answer)}`],
  };
}

// ---------- 4. Événement contraire : P(A) + P(non A) = 1 ----------
function genEvenementContraireNumeric() {
  const pA = roundTo(randInt(5, 95) / 100, 2);
  const answer = roundTo(1 - pA, 2);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `On considère un événement A tel que P(A) = ${fr(pA)}. Quelle est la probabilité de l'événement contraire de A ?`,
    answer,
    tolerance: 0.01,
    steps: [`P(\\overline{A}) = 1 - P(A) = 1 - ${fr(pA)} = ${fr(answer)}`],
  };
}

// ---------- 5. Somme des probabilités des issues égale à 1 ----------
function genSommeProbabilitesNumeric() {
  const k = randInt(3, 5);
  const probasConnues = Array.from({ length: k - 1 }, () => roundTo(randInt(5, 25) / 100, 2));
  const sommeConnues = roundTo(probasConnues.reduce((a, b) => a + b, 0), 2);
  const answer = roundTo(1 - sommeConnues, 2);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `Une expérience aléatoire a ${k} issues possibles. On connaît les probabilités de ${k - 1} d'entre elles : ${probasConnues.map(fr).join(" ; ")}. Quelle est la probabilité de la dernière issue, sachant que la somme des probabilités de toutes les issues vaut 1 ?`,
    answer,
    tolerance: 0.01,
    steps: [`${probasConnues.map(fr).join(" + ")} = ${fr(sommeConnues)}`, `1 - ${fr(sommeConnues)} = ${fr(answer)}`],
  };
}

// ---------- 6. Lien probabilité théorique / effectif attendu sur un grand nombre d'expériences ----------
function genEffectifAttenduNumeric() {
  const den = pick([4, 5, 6, 8, 10]);
  const num = randInt(1, den - 1);
  const nbExperiences = den * randInt(10, 40);
  const answer = (num / den) * nbExperiences;
  return {
    type: "numeric",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `Un événement a une probabilité de ${num}/${den} de se réaliser à chaque expérience. On répète l'expérience ${nbExperiences} fois. Combien de fois peut-on s'attendre à ce que cet événement se réalise, en théorie ?`,
    answer,
    steps: [`\\dfrac{${num}}{${den}} \\times ${nbExperiences} = ${answer}`],
  };
}

// ---------- 7. Comparer deux probabilités ----------
function genComparerProbabilitesQCM() {
  const total = randInt(20, 40);
  const a = randInt(2, Math.floor(total / 2) - 1);
  let b = randInt(2, Math.floor(total / 2) - 1);
  while (b === a) b = randInt(2, Math.floor(total / 2) - 1);
  const evtA = "A";
  const evtB = "B";
  const plusProbable = a > b ? evtA : evtB;
  return {
    type: "qcm",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `Dans une expérience à ${total} issues équiprobables, l'événement A regroupe ${a} issues et l'événement B regroupe ${b} issues. Quel événement est le plus probable ?`,
    answer: plusProbable,
    options: ["A", "B"],
    steps: [`P(A) = \\dfrac{${a}}{${total}}`, `P(B) = \\dfrac{${b}}{${total}}`, `${a} ${a > b ? ">" : "<"} ${b}, donc ${plusProbable} est le plus probable.`],
  };
}

// ---------- 8. Probabilité avec un dé à 6 faces (lettre ou critère) ----------
function genProbabiliteDeNumeric() {
  const critere = pick(["pair", "impair", "multiple de 3", "supérieur ou égal à 4", "strictement inférieur à 3"]);
  let favorables;
  if (critere === "pair") favorables = 3;
  else if (critere === "impair") favorables = 3;
  else if (critere === "multiple de 3") favorables = 2;
  else if (critere === "supérieur ou égal à 4") favorables = 3;
  else favorables = 2;
  const [num, den] = reduceFrac(favorables, 6);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `On lance un dé équilibré à 6 faces numérotées de 1 à 6. Donne la probabilité, sous forme de fraction irréductible p/q, d'obtenir un nombre ${critere}. Donne le numérateur p.`,
    answer: num,
    steps: [`Il y a ${favorables} faces favorables sur 6.`, `\\dfrac{${favorables}}{6} = \\dfrac{${num}}{${den}}`],
  };
}

// ---------- 9. Probabilité dans un jeu de cartes ----------
function genProbabiliteCarteQCM() {
  const jeu32 = Math.random() < 0.5;
  const total = jeu32 ? 32 : 52;
  const critere = pick(["un roi", "un as", "une carte de cœur", "une carte rouge", "une figure (roi, dame ou valet)"]);
  let favorables;
  if (critere === "un roi" || critere === "un as") favorables = 4;
  else if (critere === "une carte de cœur") favorables = jeu32 ? 8 : 13;
  else if (critere === "une carte rouge") favorables = total / 2;
  else favorables = 12;
  const [num, den] = reduceFrac(favorables, total);
  const bonneReponse = `${num}/${den}`;
  const mauvaise1 = `${favorables}/${total}`;
  const mauvaise2 = `${num}/${den + 1}`;
  const options = num === favorables && den === total ? shuffle([bonneReponse, mauvaise2, `${num + 1}/${den}`]) : shuffle([bonneReponse, mauvaise1, mauvaise2]);
  return {
    type: "qcm",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `On tire une carte au hasard dans un jeu de ${total} cartes. Quelle est la probabilité, sous forme de fraction irréductible, d'obtenir ${critere} ?`,
    answer: bonneReponse,
    options: [...new Set(options)],
    steps: [`Il y a ${favorables} cartes favorables sur ${total}.`, `\\dfrac{${favorables}}{${total}} = \\dfrac{${num}}{${den}}`],
  };
}

// ---------- 10. Probabilité après un tirage sans remise ----------
function genProbabiliteApresRetraitNumeric() {
  const c1 = randInt(3, 10);
  const c2 = randInt(3, 10);
  const total = c1 + c2;
  const [couleurA] = shuffle(couleurs).slice(0, 1);
  const objet = pick(objetsUrne);
  const retireA = Math.random() < 0.5;
  const nouveauC1 = retireA ? c1 - 1 : c1;
  const nouveauTotal = total - 1;
  const answer = roundTo(nouveauC1 / nouveauTotal, 3);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `Une urne contient ${c1} ${objet} ${couleurA} et ${c2} ${objet} d'une autre couleur. On tire un ${objet.slice(0, -1)} au hasard, on constate qu'il est ${retireA ? couleurA : "d'une autre couleur"}, et on ne le remet pas dans l'urne. On tire alors un second ${objet.slice(0, -1)}. Quelle est la probabilité (arrondie au millième) que ce second ${objet.slice(0, -1)} soit ${couleurA} ?`,
    answer,
    tolerance: 0.002,
    steps: [
      `Après le premier tirage, il reste ${nouveauTotal} ${objet} dans l'urne, dont ${nouveauC1} ${couleurA}.`,
      `P = \\dfrac{${nouveauC1}}{${nouveauTotal}} \\approx ${fr(answer)}`,
    ],
  };
}

// ---------- 11. Reconnaître une situation d'équiprobabilité ----------
function genEquiprobabiliteQCM() {
  const equiprobable = Math.random() < 0.5;
  let effectifs;
  if (equiprobable) {
    const v = randInt(3, 10);
    effectifs = [v, v, v];
  } else {
    effectifs = [randInt(2, 8), randInt(9, 15), randInt(16, 20)];
  }
  const [c1, c2, c3] = shuffle(couleurs).slice(0, 3);
  const objet = pick(objetsUrne);
  return {
    type: "qcm",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `Une urne contient ${effectifs[0]} ${objet} ${c1}, ${effectifs[1]} ${objet} ${c2} et ${effectifs[2]} ${objet} ${c3}. En tirant un ${objet.slice(0, -1)} au hasard, est-on dans une situation d'équiprobabilité entre les trois couleurs ?`,
    answer: equiprobable ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      `Rappel : il y a équiprobabilité entre plusieurs issues si elles ont toutes les mêmes chances de se réaliser (même effectif ici).`,
      equiprobable ? `Les trois couleurs ont le même effectif (${effectifs[0]}) : il y a équiprobabilité.` : `Les effectifs (${effectifs.join(", ")}) sont différents : il n'y a pas équiprobabilité entre les couleurs.`,
    ],
  };
}

// ---------- 12. Vérifier qu'un nombre peut être une probabilité ----------
function genValeurProbabiliteQCM() {
  const valid = Math.random() < 0.5;
  let valeur;
  if (valid) {
    valeur = pick([0, 1, roundTo(randInt(1, 99) / 100, 2), `${randInt(1, 5)}/${randInt(6, 10)}`]);
  } else {
    valeur = pick([roundTo(1 + randInt(1, 50) / 100, 2), -roundTo(randInt(1, 50) / 100, 2), `${randInt(6, 10)}/${randInt(1, 5)}`]);
  }
  return {
    type: "qcm",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `Le nombre ${typeof valeur === "number" ? fr(valeur) : valeur} peut-il être la probabilité d'un événement ?`,
    answer: valid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      `Rappel : une probabilité est toujours un nombre compris entre 0 et 1 (inclus).`,
      valid ? `C'est bien le cas ici.` : `Ce n'est pas le cas ici : ce nombre n'est pas compris entre 0 et 1.`,
    ],
  };
}

// ---------- 13. Convertir un pourcentage en probabilité décimale ----------
function genProbabiliteDepuisPourcentageNumeric() {
  const p = randInt(1, 99);
  const answer = roundTo(p / 100, 2);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `Un événement a ${p} % de chances de se réaliser. Donne sa probabilité sous forme décimale.`,
    answer,
    tolerance: 0.005,
    steps: [`${p}\\% = \\dfrac{${p}}{100} = ${fr(answer)}`],
  };
}

// ---------- 14. Vérifier une loi de probabilité (tableau d'issues) ----------
function genVerifierLoiProbabiliteQCM() {
  const k = pick([3, 4]);
  const probas = Array.from({ length: k }, () => roundTo(randInt(10, 35) / 100, 2));
  const somme = roundTo(probas.reduce((a, b) => a + b, 0), 2);
  const valid = somme === 1;
  return {
    type: "qcm",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `Un tableau donne les probabilités des ${k} issues d'une expérience aléatoire : ${probas.map(fr).join(" ; ")}. Ce tableau peut-il correspondre à une véritable loi de probabilité ?`,
    answer: valid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      `Rappel : la somme des probabilités de toutes les issues d'une expérience aléatoire doit être égale à 1.`,
      `${probas.map(fr).join(" + ")} = ${fr(somme)}`,
      valid ? `La somme vaut bien 1 : c'est cohérent.` : `La somme ne vaut pas 1 : ce n'est pas cohérent.`,
    ],
  };
}

// ---------- 15. Probabilité combinant un critère numérique sur une plage ----------
function genProbabiliteMultipleNumeric() {
  const total = randInt(20, 60);
  const d = pick([2, 3, 4, 5]);
  const favorables = Math.floor(total / d);
  const [num, den] = reduceFrac(favorables, total);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculs de probabilités",
    prompt: `On tire au hasard un jeton numéroté parmi ${total} jetons numérotés de 1 à ${total}. Donne la probabilité, sous forme de fraction irréductible p/q, d'obtenir un multiple de ${d}. Donne le dénominateur q.`,
    answer: den,
    steps: [`Il y a ${favorables} multiples de ${d} entre 1 et ${total}.`, `\\dfrac{${favorables}}{${total}} = \\dfrac{${num}}{${den}}`],
  };
}

const GENERATORS = [
  genIdentifierEvenementQCM,
  genNombreIssuesQCM,
  genProbabiliteUrneNumeric,
  genEvenementContraireNumeric,
  genSommeProbabilitesNumeric,
  genEffectifAttenduNumeric,
  genComparerProbabilitesQCM,
  genProbabiliteDeNumeric,
  genProbabiliteCarteQCM,
  genProbabiliteApresRetraitNumeric,
  genEquiprobabiliteQCM,
  genValeurProbabiliteQCM,
  genProbabiliteDepuisPourcentageNumeric,
  genVerifierLoiProbabiliteQCM,
  genProbabiliteMultipleNumeric,
];

const DIFFICULTY = {
  genIdentifierEvenementQCM: "facile",
  genNombreIssuesQCM: "facile",
  genProbabiliteUrneNumeric: "facile",
  genProbabiliteDeNumeric: "facile",
  genEquiprobabiliteQCM: "facile",
  genValeurProbabiliteQCM: "facile",
  genEvenementContraireNumeric: "standard",
  genSommeProbabilitesNumeric: "standard",
  genEffectifAttenduNumeric: "standard",
  genComparerProbabilitesQCM: "standard",
  genProbabiliteCarteQCM: "standard",
  genProbabiliteDepuisPourcentageNumeric: "standard",
  genVerifierLoiProbabiliteQCM: "standard",
  genProbabiliteApresRetraitNumeric: "expert",
  genProbabiliteMultipleNumeric: "expert",
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
    id: "probabilites-troisieme",
    title: "Probabilités",
    description: "Vocabulaire des probabilités, calcul dans une situation d'équiprobabilité, événement contraire, somme des probabilités, effectif attendu, comparaison de probabilités et tirage sans remise.",
    level: "troisieme",
    free: false,
    order: 10,
  },
  generate,
};
