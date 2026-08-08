// ---------------------------------------------------------------------------
// Chapitre : Variables aléatoires (Première technologique)
// Programme 2026 : variable aléatoire discrète (loi de probabilité,
// espérance) ; loi de Bernoulli B(p), espérance. Capacités : interpréter
// {X=a} / {X≤a} et calculer P(X=a) / P(X≤a), calculer et interpréter
// l'espérance, reconnaître une situation de Bernoulli, interpréter la
// distance à p de la fréquence observée sur un échantillon (fluctuation
// d'échantillonnage, écart-type de l'ordre de 1/√n).
//
// NOTE (audit programme 2026, M12) : genFluctuationEchantillonnageQCM
// appliquait une règle de décision binaire stricte (écart <= 2 écarts-types
// → "cohérent", sinon → "on peut s'interroger sur p"), ce que le texte
// officiel écarte explicitement (« sans développer de théorie de décision ou
// de test »). Reformulé en question purement descriptive (à combien
// d'écarts-types correspond l'écart observé ?), sans validation vrai/faux
// stricte et sans vocabulaire de test d'hypothèse, pour faire percevoir la
// diversité des interprétations possibles plutôt qu'une règle automatique.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const fr = (n) => String(n).replace(".", ",");

// ---------- 1. Loi de probabilité : retrouver une probabilité manquante ----------
function genLoiProbabiliteCompleterNumeric() {
  const p1 = pick([0.1, 0.2, 0.25, 0.3]);
  const p2 = pick([0.1, 0.2, 0.25, 0.3]);
  const p3 = pick([0.1, 0.2]);
  const answer = roundTo(1 - p1 - p2 - p3, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Première techno) — Loi de probabilité",
    prompt: `Une variable aléatoire \\(X\\) prend les valeurs \\(1\\), \\(2\\), \\(3\\), \\(4\\), avec \\(P(X=1) = ${fr(p1)}\\), \\(P(X=2) = ${fr(p2)}\\), \\(P(X=3) = ${fr(p3)}\\). Calcule \\(P(X=4)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{La somme des probabilités vaut 1.}` },
      { type: "resultat", text: `P(X=4) = 1 - ${fr(p1)} - ${fr(p2)} - ${fr(p3)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 2. Interpréter {X=a} / {X≤a} ----------
function genInterpreterNotationsQCM() {
  const cas = pick([
    { description: "P(X = 3)", reponse: "La probabilité que X soit exactement égal à 3" },
    { description: "P(X \\leq 3)", reponse: "La probabilité que X soit inférieur ou égal à 3" },
  ]);
  return {
    type: "qcm",
    chapter: "Variables aléatoires (Première techno) — Notations",
    prompt: `Comment interprète-t-on \\(${cas.description}\\) ?`,
    answer: cas.reponse,
    options: ["La probabilité que X soit exactement égal à 3", "La probabilité que X soit inférieur ou égal à 3"],
    steps: [{ type: "regle", text: cas.reponse }],
  };
}

// ---------- 3. Calcul de P(X ≤ a) (cumul) ----------
function genPXInferieurEgalNumeric() {
  const p1 = pick([0.1, 0.15, 0.2]);
  const p2 = pick([0.2, 0.25, 0.3]);
  const p3 = pick([0.1, 0.15]);
  const p4 = roundTo(1 - p1 - p2 - p3, 4);
  const answer = roundTo(p1 + p2 + p3, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Première techno) — Loi de probabilité",
    prompt: `Une variable aléatoire \\(X\\) prend les valeurs \\(1, 2, 3, 4\\) avec \\(P(X=1) = ${fr(p1)}\\), \\(P(X=2) = ${fr(p2)}\\), \\(P(X=3) = ${fr(p3)}\\), \\(P(X=4) = ${fr(p4)}\\). Calcule \\(P(X \\leq 3)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: "P(X ⩽ 3) est la somme des probabilités de toutes les valeurs de X inférieures ou égales à 3." },
      { type: "resultat", text: `P(X \\leq 3) = P(X=1) + P(X=2) + P(X=3) = ${fr(p1)} + ${fr(p2)} + ${fr(p3)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 4. Reconnaître une situation de Bernoulli ----------
function genReconnaitreBernoulliQCM() {
  const cas = pick([
    { description: "X vaut 1 si une pièce tombe sur Pile, 0 sinon.", reponse: "Loi de Bernoulli", explication: "Loi de Bernoulli : X ne prend que deux valeurs, 0 et 1." },
    { description: "X est le numéro obtenu en lançant un dé à 6 faces.", reponse: "Pas une loi de Bernoulli", explication: "Pas une loi de Bernoulli : X peut prendre 6 valeurs différentes (de 1 à 6), pas seulement 0 et 1." },
    { description: "X vaut 1 si un produit testé est défectueux, 0 sinon.", reponse: "Loi de Bernoulli", explication: "Loi de Bernoulli : X ne prend que deux valeurs, 0 (conforme) et 1 (défectueux)." },
    { description: "X est le nombre de bonnes réponses sur 10 questions.", reponse: "Pas une loi de Bernoulli", explication: "Pas une loi de Bernoulli : X peut prendre 11 valeurs différentes (de 0 à 10), pas seulement 0 et 1." },
  ]);
  return {
    type: "qcm",
    chapter: "Variables aléatoires (Première techno) — Loi de Bernoulli",
    prompt: `« ${cas.description} » S'agit-il d'une loi de Bernoulli ?`,
    answer: cas.reponse,
    options: ["Loi de Bernoulli", "Pas une loi de Bernoulli"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 5. Espérance d'une loi de Bernoulli B(p) ----------
function genEsperanceBernoulliNumeric() {
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9]);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Première techno) — Loi de Bernoulli",
    prompt: `Une variable aléatoire \\(X\\) suit la loi de Bernoulli de paramètre \\(p = ${fr(p)}\\). Calcule son espérance \\(E(X)\\) (formule \\(E(X) = p\\)).`,
    answer: p,
    tolerance: 0.0005,
    steps: [{ type: "resultat", text: `E(X) = p = ${fr(p)}` }],
  };
}

// ---------- 6. Espérance d'une variable aléatoire à 3 valeurs ----------
function genEsperanceNumeric() {
  const valeurs = [randInt(-5, 0), randInt(1, 3), randInt(4, 8)];
  const p1 = pick([0.2, 0.3, 0.4]);
  const p2 = pick([0.2, 0.3]);
  const p3 = roundTo(1 - p1 - p2, 4);
  const answer = roundTo(valeurs[0] * p1 + valeurs[1] * p2 + valeurs[2] * p3, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Première techno) — Espérance",
    prompt: `Une variable aléatoire \\(X\\) suit la loi : \\(P(X=${valeurs[0]}) = ${fr(p1)}\\), \\(P(X=${valeurs[1]}) = ${fr(p2)}\\), \\(P(X=${valeurs[2]}) = ${fr(p3)}\\). Calcule l'espérance \\(E(X)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `E(X) = \\sum x_i \\times p_i` },
      { type: "calcul", text: `E(X) = ${valeurs[0]} \\times ${fr(p1)} + ${valeurs[1]} \\times ${fr(p2)} + ${valeurs[2]} \\times ${fr(p3)}` },
      { type: "resultat", text: `E(X) = ${fr(roundTo(valeurs[0] * p1, 4))} + ${fr(roundTo(valeurs[1] * p2, 4))} + ${fr(roundTo(valeurs[2] * p3, 4))} = ${fr(answer)}` },
    ],
  };
}

// ---------- 7. Comparer l'écart entre fréquence observée et p à l'écart-type s ----------
function genFluctuationEchantillonnageQCM() {
  const n = pick([50, 100, 200, 400]);
  const p = pick([0.3, 0.4, 0.5, 0.6]);
  const ecartType = roundTo(1 / Math.sqrt(n), 4);
  const nbEcartsTypes = pick([0.5, 1, 2, 3]);
  const freqObservee = roundTo(p + pick([-1, 1]) * ecartType * nbEcartsTypes, 3);
  const ecart = roundTo(Math.abs(freqObservee - p), 4);
  const ratio = roundTo(ecart / ecartType, 2);
  let categorie;
  if (ratio < 1) categorie = "moins d'un écart-type";
  else if (ratio < 2) categorie = "entre un et deux écarts-types";
  else if (ratio < 3) categorie = "entre deux et trois écarts-types";
  else categorie = "plus de trois écarts-types";
  const distracteurs = ["moins d'un écart-type", "entre un et deux écarts-types", "entre deux et trois écarts-types", "plus de trois écarts-types"].filter((c) => c !== categorie);
  const options = shuffle([categorie, ...shuffle(distracteurs).slice(0, 2)]);
  return {
    type: "qcm",
    chapter: "Variables aléatoires (Première techno) — Fluctuation d'échantillonnage",
    prompt: `Dans un échantillon de taille \\(n = ${n}\\), on suppose \\(p = ${fr(p)}\\) (l'écart-type de la fréquence est de l'ordre de \\(s = \\dfrac{1}{\\sqrt{n}} \\approx ${fr(ecartType)}\\)). On observe une fréquence de \\(${fr(freqObservee)}\\). À combien d'écarts-types \\(s\\) correspond environ l'écart entre cette fréquence et \\(p\\) ?`,
    answer: categorie,
    options,
    steps: [
      { type: "calcul", text: `\\text{Écart observé : } |${fr(freqObservee)} - ${fr(p)}| = ${fr(ecart)}` },
      { type: "regle", text: `\\text{On compare cet écart à } s \\approx ${fr(ecartType)} : \\dfrac{${fr(ecart)}}{${fr(ecartType)}} \\approx ${fr(ratio)}.` },
      { type: "resultat", text: `\\text{L'écart observé représente ${categorie}. Plusieurs interprétations restent possibles selon le contexte : ce n'est pas une règle de décision automatique.}` },
    ],
  };
}

// ---------- 8. Écart-type de l'ordre de 1/√n : effet de n ----------
function genEcartTypeOrdreNQCM() {
  const n1 = pick([25, 100]);
  const n2 = n1 * 4;
  const ratio = roundTo(Math.sqrt(n1 / n2), 3);
  return {
    type: "qcm",
    chapter: "Variables aléatoires (Première techno) — Fluctuation d'échantillonnage",
    prompt: `L'écart-type de la fréquence observée sur un échantillon de taille \\(n\\) est de l'ordre de \\(\\dfrac{1}{\\sqrt{n}}\\). Si on passe d'un échantillon de taille ${n1} à un échantillon de taille ${n2} (${n2 / n1} fois plus grand), que devient cet écart-type ?`,
    answer: "Il diminue",
    options: ["Il diminue", "Il augmente", "Il reste identique"],
    steps: [
      { type: "calcul", text: `\\dfrac{1}{\\sqrt{${n1}}} \\approx ${fr(roundTo(1 / Math.sqrt(n1), 4))} \\text{, et } \\dfrac{1}{\\sqrt{${n2}}} \\approx ${fr(roundTo(1 / Math.sqrt(n2), 4))}` },
      { type: "resultat", text: `\\text{Plus l'échantillon est grand, plus la fréquence observée se rapproche de } p.` },
    ],
  };
}

// ---------- 9. Simulation : lecture d'un histogramme de fréquences ----------
function genLectureHistogrammeFrequencesNumeric() {
  const p = pick([0.3, 0.4, 0.5, 0.6, 0.7]);
  const n = pick([50, 100]);
  const N = 8; // nombre d'échantillons simulés
  const freqs = Array.from({ length: N }, () => roundTo(p + (Math.random() - 0.5) * (2 / Math.sqrt(n)), 2));
  const moyenneFreqs = roundTo(freqs.reduce((a, b) => a + b, 0) / N, 3);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Première techno) — Simulation",
    prompt: `On simule \\(N = ${N}\\) échantillons de taille \\(n = ${n}\\) d'une loi de Bernoulli de paramètre \\(p = ${fr(p)}\\), et on obtient les fréquences suivantes : ${freqs.map(fr).join(", ")}. Calcule la moyenne de ces fréquences observées (arrondie au millième), qui doit être proche de \\(p\\).`,
    answer: moyenneFreqs,
    tolerance: 0.01,
    steps: [
      { type: "calcul", text: `\\text{Moyenne} = \\dfrac{${freqs.join(" + ")}}{${N}}` },
      { type: "resultat", text: `\\text{Moyenne} \\approx ${fr(moyenneFreqs)}\\text{, proche de } p = ${fr(p)}.` },
    ],
  };
}

const GENERATORS = [
  genLoiProbabiliteCompleterNumeric,
  genInterpreterNotationsQCM,
  genPXInferieurEgalNumeric,
  genReconnaitreBernoulliQCM,
  genEsperanceBernoulliNumeric,
  genEsperanceNumeric,
  genFluctuationEchantillonnageQCM,
  genEcartTypeOrdreNQCM,
  genLectureHistogrammeFrequencesNumeric,
];

const DIFFICULTY = {
  genLoiProbabiliteCompleterNumeric: "facile",
  genInterpreterNotationsQCM: "facile",
  genReconnaitreBernoulliQCM: "facile",
  genEsperanceBernoulliNumeric: "facile",
  genPXInferieurEgalNumeric: "standard",
  genEsperanceNumeric: "standard",
  genEcartTypeOrdreNQCM: "standard",
  genFluctuationEchantillonnageQCM: "expert",
  genLectureHistogrammeFrequencesNumeric: "expert",
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
    id: "variables-aleatoires-premiere-techno",
    title: "Variables aléatoires",
    description: "Loi de probabilité discrète, loi de Bernoulli et son espérance, fluctuation d'échantillonnage.",
    pourquoi: "Une variable aléatoire et son espérance permettent de prévoir le résultat moyen d'un jeu, d'un pari ou d'une décision incertaine.",
    level: "premiere-techno",
    order: 8,
    cours: {
      mindMap: {
        title: "Variables aléatoires",
        branches: [
          {
            title: "Loi de probabilité discrète",
            items: [
              "Associe à chaque valeur possible sa probabilité ; la somme de toutes les probabilités vaut 1.",
              "\\(P(X=a)\\) : probabilité que X soit exactement égal à a. \\(P(X \\leq a)\\) : probabilité cumulée, somme des \\(P(X=x_i)\\) pour toutes les valeurs \\(x_i \\leq a\\) — à ne pas confondre.",
            ],
          },
          {
            title: "Loi de Bernoulli",
            items: [
              "Deux issues : succès (1, probabilité p) ou échec (0, probabilité 1-p).",
            ],
            formula: "\\(E(X) = p\\)",
          },
          {
            title: "Espérance d'une variable aléatoire",
            items: [
              "La moyenne théorique, pondérée par les probabilités de chaque valeur.",
            ],
            formula: "\\(E(X) = \\sum_i p_i x_i\\)",
          },
          {
            title: "Fluctuation d'échantillonnage",
            items: [
              "D'un échantillon à l'autre, la fréquence observée varie autour de la probabilité théorique — c'est normal, ce n'est pas une erreur.",
              "Plus la taille de l'échantillon augmente, plus cette fluctuation diminue.",
            ],
            formula: "\\(s \\approx \\dfrac{1}{\\sqrt{n}}\\)",
          },
        ],
      },
    },
  },
  generate,
};
