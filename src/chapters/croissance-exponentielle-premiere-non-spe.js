// ---------------------------------------------------------------------------
// Chapitre : Croissance exponentielle (Première, enseignement mathématique
// non spé) — sous abonnement.
//
// Correspond au chapitre 4 du programme d'enseignement mathématique de
// première (non spécialité) : suites géométriques (relation de récurrence
// u(n+1) = q×u(n), calcul de la raison depuis deux termes consécutifs,
// expression explicite u(n) = u(0)×q^n, sens de variation selon le signe de
// q-1), fonctions exponentielles (sens de variation selon la base),
// modélisation d'évolutions en pourcentage constant par une suite
// géométrique, coefficient multiplicateur global d'évolutions successives,
// et calcul d'un taux d'évolution moyen par période à partir d'un
// coefficient multiplicateur global (racine n-ième).
// La correction du livre du professeur (source .tex, exercices 6-26 :
// Automatismes méthodes 1-4 sur les suites géométriques et les évolutions en
// pourcentage) a servi à identifier la méthode ; les nombres et contextes
// sont générés aléatoirement à chaque tirage.
// Voir automatismes-premiere-non-spe.js (thème
// "croissance-exponentielle-premiere-non-spe") pour les mini-exercices
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

// Raisons "propres" (produits/quotients exacts en flottant avec des entiers usuels).
const RAISONS_PROPRES = [2, 3, 4, 5, 0.5, 0.25, 0.2, 0.1, 1.5, 2.5, 0.75, 0.8, 0.4];

// ---------- 1. Terme suivant par récurrence u(n+1) = q × u(n) ----------
function genAutoTermeSuivantGeometriqueNumeric() {
  const q = pick(RAISONS_PROPRES);
  const un = pick([2, 4, 5, 8, 10, 16, 20, 25, 40, 50, 80, 100]);
  const answer = roundTo(q * un, 4);
  return {
    type: "numeric",
    chapter: "Croissance exponentielle — Suites géométriques",
    prompt: `Une suite géométrique u de raison \\(q = ${fr(q)}\\) vérifie \\(u(n) = ${un}\\). Calcule \\(u(n+1)\\).`,
    answer,
    tolerance: 0.001,
    steps: [`u(n+1) = q \\times u(n) = ${fr(q)} \\times ${un} = ${fr(answer)}`],
  };
}

// ---------- 2. Calculer la raison depuis deux termes consécutifs ----------
function genRaisonDepuisDeuxTermesGeometriqueNumeric() {
  const q = pick(RAISONS_PROPRES);
  const u0 = pick([2, 4, 5, 8, 10, 16, 20, 25, 40, 50]);
  const u1 = roundTo(q * u0, 4);
  return {
    type: "numeric",
    chapter: "Croissance exponentielle — Suites géométriques",
    prompt: `Une suite géométrique u vérifie \\(u(0) = ${u0}\\) et \\(u(1) = ${fr(u1)}\\). Calcule sa raison q.`,
    answer: q,
    tolerance: 0.001,
    steps: [`q = \\dfrac{u(1)}{u(0)} = \\dfrac{${fr(u1)}}{${u0}} = ${fr(q)}`],
  };
}

// ---------- 3. Calculer un terme via l'expression explicite u(n) = u(0) × q^n ----------
function genTermeExpressionExpliciteGeometriqueNumeric() {
  const q = pick([2, 3, 0.5, 4, 0.25]);
  const u0 = pick([1, 2, 3, 4, 5]);
  const n = randInt(2, 5);
  const answer = roundTo(u0 * q ** n, 6);
  return {
    type: "numeric",
    chapter: "Croissance exponentielle — Suites géométriques",
    prompt: `Une suite géométrique u a pour premier terme \\(u(0) = ${u0}\\) et pour raison \\(q = ${fr(q)}\\). Calcule \\(u(${n})\\) grâce à la formule \\(u(n) = u(0) \\times q^n\\).`,
    answer,
    tolerance: 0.001,
    steps: [`u(${n}) = ${u0} \\times ${fr(q)}^{${n}} = ${fr(answer)}`],
  };
}

// ---------- 4. Sens de variation d'une suite géométrique selon la raison ----------
function genSensVariationSuiteGeometriqueQCM() {
  const cas = pick([
    { q: 2, reponse: "croissante" },
    { q: 3, reponse: "croissante" },
    { q: 1.5, reponse: "croissante" },
    { q: 2.5, reponse: "croissante" },
    { q: 0.5, reponse: "décroissante" },
    { q: 0.25, reponse: "décroissante" },
    { q: 0.1, reponse: "décroissante" },
    { q: 0.8, reponse: "décroissante" },
    { q: 1, reponse: "constante" },
  ]);
  return {
    type: "qcm",
    chapter: "Croissance exponentielle — Suites géométriques",
    prompt: `Une suite géométrique à termes positifs a pour raison \\(q = ${fr(cas.q)}\\). Cette suite est-elle croissante, décroissante ou constante ?`,
    answer: cas.reponse,
    options: ["croissante", "décroissante", "constante"],
    steps: [cas.q > 1 ? `q = ${fr(cas.q)} > 1 \\text{ donc la suite est croissante.}` : cas.q === 1 ? `q = 1 \\text{ donc la suite est constante.}` : `0 < q = ${fr(cas.q)} < 1 \\text{ donc la suite est décroissante.}`],
  };
}

// ---------- 5. Sens de variation d'une fonction exponentielle selon la base ----------
function genSensVariationExponentielleQCM() {
  const base = pick([1.2, 1.5, 2, 3, 0.3, 0.5, 0.7, 0.9]);
  const reponse = base > 1 ? "croissante" : "décroissante";
  return {
    type: "qcm",
    chapter: "Croissance exponentielle — Fonctions exponentielles",
    prompt: `On considère la fonction exponentielle définie par \\(f(x) = ${fr(base)}^x\\). Cette fonction est-elle croissante ou décroissante sur \\(\\mathbb{R}\\) ?`,
    answer: reponse,
    options: ["croissante", "décroissante"],
    steps: [base > 1 ? `\\text{La base } ${fr(base)} > 1 \\text{ donc f est croissante.}` : `\\text{La base } 0 < ${fr(base)} < 1 \\text{ donc f est décroissante.}`],
  };
}

// ---------- 6. Coefficient multiplicateur global d'évolutions successives ----------
function genCoefficientMultiplicateurGlobalNumeric() {
  const cm1 = pick([1.1, 1.2, 1.05, 1.4, 0.9, 0.8, 0.95, 1.15]);
  const cm2 = pick([1.1, 1.2, 1.05, 1.4, 0.9, 0.8, 0.95, 1.15]);
  const answer = roundTo(cm1 * cm2, 4);
  return {
    type: "numeric",
    chapter: "Croissance exponentielle — Évolutions successives",
    prompt: `Une grandeur subit deux évolutions successives de coefficients multiplicateurs \\(${fr(cm1)}\\) puis \\(${fr(cm2)}\\). Calcule le coefficient multiplicateur global de ces deux évolutions (arrondi au millième).`,
    answer,
    tolerance: 0.001,
    steps: [`${fr(cm1)} \\times ${fr(cm2)} = ${fr(answer)}`],
  };
}

// ---------- 7. Taux d'évolution moyen par période depuis un coefficient multiplicateur global ----------
function genTauxMoyenParPeriodeNumeric() {
  const cmGlobal = pick([1.1236, 1.21, 1.331, 0.81, 0.729, 1.5, 0.7, 1.728, 1.44]);
  const n = pick([2, 3, 4]);
  const cmMoyen = cmGlobal ** (1 / n);
  const answer = roundTo((cmMoyen - 1) * 100, 1);
  return {
    type: "numeric",
    chapter: "Croissance exponentielle — Évolutions successives",
    prompt: `Sur ${n} périodes identiques, une grandeur a subi une évolution globale de coefficient multiplicateur \\(${fr(cmGlobal)}\\). Calcule le taux d'évolution moyen par période (en %, arrondi au dixième).`,
    answer,
    tolerance: 0.2,
    steps: [`\\text{Coefficient multiplicateur moyen} = ${fr(cmGlobal)}^{\\frac{1}{${n}}} \\approx ${fr(roundTo(cmMoyen, 4))}`, `\\text{Taux moyen} \\approx ${fr(answer)}\\%`],
  };
}

// ---------- 8. Piège : le taux global n'est pas la somme des taux périodiques ----------
function genPiegeTauxGlobalQCM() {
  const t = pick([1, 2, 3, 4, 5]);
  const n = pick([6, 12, 24]);
  const naif = t * n;
  const reel = roundTo((1 + t / 100) ** n - 1, 4) * 100;
  return {
    type: "qcm",
    chapter: "Croissance exponentielle — Évolutions successives",
    prompt: `Un prix augmente de ${t} % chaque mois pendant ${n} mois. Le taux d'évolution global sur ces ${n} mois est-il exactement de ${naif} % ?`,
    answer: "Non",
    options: ["Oui", "Non"],
    steps: [`\\text{Le taux global n'est pas la somme des taux périodiques : il vaut } (1{,}${String(t).padStart(2, "0")})^{${n}} - 1 \\approx ${fr(roundTo(reel, 2))}\\%, \\text{ différent de } ${naif}\\%.`],
  };
}

// ---------- 9. Modéliser une évolution en pourcentage constant par une suite géométrique (raison) ----------
function genModeliserRaisonEvolutionNumeric() {
  const hausse = Math.random() < 0.5;
  const p = randInt(1, 30);
  const answer = hausse ? roundTo(1 + p / 100, 4) : roundTo(1 - p / 100, 4);
  return {
    type: "numeric",
    chapter: "Croissance exponentielle — Modélisation",
    prompt: `Une grandeur ${hausse ? "augmente" : "diminue"} de ${p} % à chaque période. On modélise son évolution par une suite géométrique. Quelle est la raison q de cette suite ?`,
    answer,
    tolerance: 0.001,
    steps: [`q = ${fr(answer)}`],
  };
}

// ---------- 10. Modéliser puis calculer un terme (contexte : capital, population) ----------
function genModeliserCalculerTermeGeometriqueNumeric() {
  const contexte = pick([
    { sujet: "Un capital initial de", unite: "€", verbe: "augmente" },
    { sujet: "Une population initiale de", unite: "habitants", verbe: "augmente" },
    { sujet: "Un stock initial de", unite: "unités", verbe: "diminue" },
  ]);
  const u0 = pick([1000, 2000, 5000, 10000]);
  const p = pick([2, 5, 10]);
  const q = contexte.verbe === "augmente" ? 1 + p / 100 : 1 - p / 100;
  const n = randInt(2, 4);
  const answer = roundTo(u0 * q ** n, 2);
  return {
    type: "numeric",
    chapter: "Croissance exponentielle — Modélisation",
    prompt: `${contexte.sujet} ${u0} ${contexte.unite} ${contexte.verbe} de ${p} % chaque année. On modélise la quantité au bout de n années par une suite géométrique u de premier terme \\(u(0) = ${u0}\\) et de raison \\(q = ${fr(roundTo(q, 4))}\\). Calcule \\(u(${n})\\) (arrondi au centième).`,
    answer,
    tolerance: 1,
    steps: [`u(${n}) = ${u0} \\times ${fr(roundTo(q, 4))}^{${n}} \\approx ${fr(answer)}`],
  };
}

// ---------- 11. Vrai ou faux sur les suites géométriques et fonctions exponentielles ----------
function genVraiFauxGeometriqueQCM() {
  const cas = pick([
    { description: "Une suite géométrique de raison q = 1 est constante.", reponse: "Vrai" },
    { description: "Une suite géométrique à termes positifs de raison q > 1 est croissante.", reponse: "Vrai" },
    { description: "Une suite géométrique de raison négative peut avoir des termes qui changent de signe.", reponse: "Vrai" },
    { description: "Une fonction exponentielle de base a avec 0 < a < 1 est croissante.", reponse: "Faux" },
    { description: "Pour une suite géométrique, chaque terme s'obtient en ajoutant toujours le même nombre au terme précédent.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Croissance exponentielle — Suites géométriques",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 12. Calculer un terme antérieur (division par la raison) ----------
function genTermeAnterieurNumeric() {
  const q = pick([2, 3, 4, 5]);
  // On choisit directement v(n-1), entier, puis on en déduit v(n) = v(n-1) × q
  // (toujours exact, aucune division flottante nécessaire).
  const uPrecedent = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50]);
  const uSuivant = uPrecedent * q;
  return {
    type: "numeric",
    chapter: "Croissance exponentielle — Suites géométriques",
    prompt: `Une suite géométrique v de raison \\(q = ${q}\\) vérifie \\(v(n) = ${uSuivant}\\). Calcule \\(v(n-1)\\).`,
    answer: uPrecedent,
    steps: [`v(n-1) = \\dfrac{v(n)}{q} = \\dfrac{${uSuivant}}{${q}} = ${uPrecedent}`],
  };
}

// ---------- 13. Reconnaître le premier terme d'une suite géométrique depuis un graphique ----------
function genPremierTermeGraphiqueNumeric() {
  const u0 = pick([1, 2, 3, 4, 5, 10]);
  const q = pick([2, 3, 0.5]);
  const u1 = roundTo(u0 * q, 4);
  return {
    type: "numeric",
    chapter: "Croissance exponentielle — Suites géométriques",
    prompt: `Le nuage de points d'une suite géométrique u montre que \\(u(1) = ${fr(u1)}\\) et que la raison est \\(q = ${fr(q)}\\). Calcule le premier terme \\(u(0)\\).`,
    answer: u0,
    tolerance: 0.001,
    steps: [`u(0) = \\dfrac{u(1)}{q} = \\dfrac{${fr(u1)}}{${fr(q)}} = ${u0}`],
  };
}

// ---------- 14. Comparer deux suites géométriques (laquelle croît le plus vite) ----------
function genComparerCroissanceQCM() {
  const qA = pick([1.2, 1.5, 2, 2.5]);
  let qB = pick([1.2, 1.5, 2, 2.5]);
  while (qB === qA) qB = pick([1.2, 1.5, 2, 2.5]);
  const plusRapide = qA > qB ? "la suite u" : "la suite v";
  return {
    type: "qcm",
    chapter: "Croissance exponentielle — Suites géométriques",
    prompt: `Deux suites géométriques à termes positifs u et v ont pour raisons respectives \\(q_u = ${fr(qA)}\\) et \\(q_v = ${fr(qB)}\\). Laquelle croît le plus rapidement à long terme ?`,
    answer: plusRapide,
    options: ["la suite u", "la suite v"],
    steps: [`\\text{Plus la raison est grande (supérieure à 1), plus la croissance est rapide : } ${fr(Math.max(qA, qB))} > ${fr(Math.min(qA, qB))}`],
  };
}

// ---------- 15. Calcul du coefficient multiplicateur réciproque (retour à la valeur initiale) ----------
function genCoefficientMultiplicateurReciproqueNumeric() {
  const p = randInt(5, 60);
  const cm = 1 + p / 100;
  const answer = roundTo(1 / cm, 4);
  return {
    type: "numeric",
    chapter: "Croissance exponentielle — Évolutions successives",
    prompt: `Une grandeur augmente de ${p} % (coefficient multiplicateur \\(${fr(roundTo(cm, 2))}\\)). Quel coefficient multiplicateur permettrait de revenir exactement à la valeur initiale (arrondi au dix-millième) ?`,
    answer,
    tolerance: 0.001,
    steps: [`\\dfrac{1}{${fr(roundTo(cm, 2))}} \\approx ${fr(answer)}`],
  };
}

const GENERATORS = [
  genAutoTermeSuivantGeometriqueNumeric,
  genRaisonDepuisDeuxTermesGeometriqueNumeric,
  genTermeExpressionExpliciteGeometriqueNumeric,
  genSensVariationSuiteGeometriqueQCM,
  genSensVariationExponentielleQCM,
  genCoefficientMultiplicateurGlobalNumeric,
  genTauxMoyenParPeriodeNumeric,
  genPiegeTauxGlobalQCM,
  genModeliserRaisonEvolutionNumeric,
  genModeliserCalculerTermeGeometriqueNumeric,
  genVraiFauxGeometriqueQCM,
  genTermeAnterieurNumeric,
  genPremierTermeGraphiqueNumeric,
  genComparerCroissanceQCM,
  genCoefficientMultiplicateurReciproqueNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "croissance-exponentielle-premiere-non-spe",
    title: "Croissance exponentielle",
    description: "Suites géométriques (raison, expression explicite, sens de variation), fonctions exponentielles, modélisation d'évolutions en pourcentage constant, coefficient multiplicateur global et taux d'évolution moyen par période.",
    level: "premiere-non-spe",
    free: false,
    order: 5,
  },
  generate,
};
