// ---------------------------------------------------------------------------
// Chapitre : Opérations sur les nombres (5e) — sous abonnement.
//
// Correspond au chapitre 1 du sommaire officiel : enchaîner des opérations en
// respectant les priorités, utiliser ou créer un programme de calcul, nommer
// un calcul, choisir des opérations pour résoudre un problème, utiliser la
// distributivité. Reprend la tâche intellectuelle des exercices fournis,
// avec des nombres, prénoms et contextes différents à chaque génération.
// Voir automatismes-cinquieme.js (thème "operations-sur-les-nombres") pour
// la Série 1 (Automatismes).
//
// Le contenu sur les multiples/diviseurs/nombres premiers/division par un
// décimal/fractions vit désormais dans divisibilite-fractions.js, et le
// contenu sur les puissances/carré/cube dans puissances.js — ce sont deux
// chapitres distincts dans le sommaire officiel, pas des sous-parties de
// "Calcul numérique" (renommage/découpage effectué après réception du
// sommaire détaillé du manuel).
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
const fr = (n) => String(n).replace(".", ",");

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

// =========================== Enchaîner des opérations en respectant les priorités ===========================

// ---------- 1. Calculer une expression avec priorités (sans parenthèses) ----------
function genCalculerExpressionPriorites() {
  const a = randInt(2, 15);
  const b = randInt(2, 12);
  const c = randInt(2, 15);
  const op1 = pick(["+", "-"]);
  // Expression a OP1 (b × c) sans parenthèses écrites, priorité mult avant add/sous.
  const result = op1 === "+" ? a + b * c : a - b * c;
  return {
    type: "numeric",
    chapter: "Opérations sur les nombres — Priorités opératoires",
    prompt: `Calcule en respectant les priorités : \\(${a} ${op1} ${b} \\times ${c}\\)`,
    answer: result,
    steps: [
      { type: "regle", text: `On effectue d'abord la multiplication : ${b} \\times ${c} = ${b * c}` },
      { type: "calcul", text: `Puis : ${a} ${op1} ${b * c} = ${result}` },
    ],
  };
}

// =========================== Nommer un calcul ===========================

// ---------- 2. Identifier si une expression est une somme ou un produit ----------
function genIdentifierSommeOuProduit() {
  const a = randInt(2, 20);
  const b = randInt(2, 20);
  const c = randInt(2, 20);
  const isSomme = Math.random() < 0.5;
  const expr = isSomme ? `${a} + ${b} \\times ${c}` : `(${a} + ${b}) \\times ${c}`;
  return {
    type: "qcm",
    chapter: "Opérations sur les nombres — Nommer un calcul",
    prompt: `L'expression \\(${expr}\\) est-elle une somme ou un produit ?`,
    answer: isSomme ? "Une somme" : "Un produit",
    options: ["Une somme", "Un produit"],
    steps: [
      {
        type: "regle",
        text: isSomme
          ? "La dernière opération à effectuer (en respectant les priorités) est une addition : c'est une somme."
          : "Grâce aux parenthèses, la dernière opération à effectuer est une multiplication : c'est un produit.",
      },
    ],
  };
}

// ---------- 3. Associer une expression à son résultat ----------
function genAssocierExpressionResultat() {
  const a = randInt(2, 10);
  const b = randInt(2, 10);
  const c = randInt(2, 10);
  const items = [
    { expr: `${a} + ${b} \\times ${c}`, value: a + b * c },
    { expr: `(${a} + ${b}) \\times ${c}`, value: (a + b) * c },
    { expr: `${a} \\times ${b} + ${c}`, value: a * b + c },
  ];
  const target = pick(items);
  const options = shuffle(items.map((it) => `${fr(it.value)}`));
  return {
    type: "qcm",
    chapter: "Opérations sur les nombres — Nommer un calcul",
    prompt: `Quel est le résultat de l'expression \\(${target.expr}\\) ?`,
    answer: `${fr(target.value)}`,
    options,
    steps: [{ type: "regle", text: `On applique les priorités opératoires (parenthèses, puis multiplication, puis addition).` }],
  };
}

// =========================== Utiliser la distributivité ===========================

// ---------- 4. Reconnaître deux expressions égales grâce à la distributivité ----------
function genReconnaitreExpressionsEgalesDistributivite() {
  const k = randInt(2, 12);
  const a = randInt(2, 20);
  const b = randInt(2, 20);
  const expr1 = `${k} \\times (${a} + ${b})`;
  const expr2Correct = `${k} \\times ${a} + ${k} \\times ${b}`;
  const expr2Wrong = `${k} \\times ${a} + ${b}`;
  const showCorrect = Math.random() < 0.5;
  const expr2 = showCorrect ? expr2Correct : expr2Wrong;
  return {
    type: "qcm",
    chapter: "Opérations sur les nombres — Distributivité",
    prompt: `Les expressions \\(${expr1}\\) et \\(${expr2}\\) sont-elles égales ?`,
    answer: showCorrect ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `\\(${k} \\times (${a} + ${b}) = ${k} \\times ${a} + ${k} \\times ${b}\\) (distributivité de la multiplication sur l'addition).` }],
  };
}

// ---------- 5. Calcul astucieux via un facteur commun ----------
function genCalculAstucieuxFacteurCommun() {
  const k = randInt(3, 25);
  const a = randInt(2, 40);
  const b = randInt(2, 40);
  const answer = k * (a + b);
  return {
    type: "numeric",
    chapter: "Opérations sur les nombres — Distributivité",
    prompt: `En utilisant la distributivité, calcule astucieusement : \\(${k} \\times ${a} + ${k} \\times ${b}\\)`,
    answer,
    steps: [{ type: "calcul", text: `${k} \\times ${a} + ${k} \\times ${b} = ${k} \\times (${a} + ${b}) = ${k} \\times ${a + b} = ${answer}` }],
  };
}

// ---------- 6. Aire d'un rectangle décomposé en deux rectangles (distributivité géométrique) ----------
function genAireRectangleDecompose() {
  const largeur = randInt(3, 15);
  const long1 = randInt(2, 20);
  const long2 = randInt(2, 20);
  const answer = largeur * (long1 + long2);
  return {
    type: "numeric",
    chapter: "Opérations sur les nombres — Distributivité",
    prompt: `Un rectangle de largeur ${largeur} cm est composé de deux parties accolées, de longueurs ${long1} cm et ${long2} cm. Quelle est l'aire totale du rectangle, en cm² ?`,
    answer,
    steps: [
      { type: "regle", text: `Aire totale = largeur × (somme des longueurs).` },
      { type: "calcul", text: `${largeur} \\times (${long1} + ${long2}) = ${largeur} \\times ${long1 + long2} = ${answer}` },
    ],
  };
}

// =========================== Utiliser ou créer un programme de calcul ===========================

// ---------- 7. Programme de calcul (texte, en remplacement du schéma boîtes/flèches) ----------
function genProgrammeCalculTexte() {
  const depart = randInt(2, 20);
  const add = randInt(1, 15);
  const mult = randInt(2, 6);
  const etape1 = depart + add;
  const answer = etape1 * mult;
  return {
    type: "numeric",
    chapter: "Opérations sur les nombres — Programme de calcul",
    prompt: `Programme de calcul : choisir un nombre, ajouter ${add}, puis multiplier le résultat par ${mult}. Quel résultat obtient-on en partant de ${depart} ?`,
    answer,
    steps: [
      { type: "calcul", text: `${depart} + ${add} = ${etape1}` },
      { type: "calcul", text: `${etape1} \\times ${mult} = ${answer}` },
    ],
  };
}

// ---------- 8. Retrouver le nombre de départ d'un programme de calcul ----------
function genRetrouverNombreDepartProgramme() {
  const depart = randInt(2, 20);
  const mult = randInt(2, 6);
  const sub = randInt(1, 10);
  const etape1 = depart * mult;
  const resultat = etape1 - sub;
  return {
    type: "numeric",
    chapter: "Opérations sur les nombres — Programme de calcul",
    prompt: `Un programme de calcul consiste à : choisir un nombre, le multiplier par ${mult}, puis soustraire ${sub}. En partant d'un nombre, on obtient ${resultat}. Quel était ce nombre de départ ?`,
    answer: depart,
    steps: [
      { type: "calcul", text: `${resultat} + ${sub} = ${etape1}` },
      { type: "calcul", text: `${etape1} \\div ${mult} = ${depart}` },
    ],
  };
}

// =========================== Choisir des opérations pour résoudre un problème ===========================

// ---------- 9. Choisir la bonne opération pour résoudre un problème ----------
function genChoisirOperationProblemeQCM() {
  const templates = [
    () => {
      const nbGroupes = randInt(3, 12);
      const parGroupe = randInt(4, 30);
      const prenom = pick(prenoms);
      const objet = pick(["chaises", "tables", "livres", "cahiers"]);
      return {
        prompt: `${prenom} range ${nbGroupes * parGroupe} ${objet} en ${nbGroupes} piles égales. Quelle opération permet de trouver le nombre de ${objet} par pile ?`,
        answer: "Une division",
      };
    },
    () => {
      const nbArticles = randInt(2, 8);
      const prix = randInt(3, 40);
      const prenom = pick(prenoms);
      return {
        prompt: `${prenom} achète ${nbArticles} articles identiques à ${prix} € l'un. Quelle opération permet de trouver le prix total ?`,
        answer: "Une multiplication",
      };
    },
    () => {
      const prenom = pick(prenoms);
      const a = randInt(20, 200);
      const b = randInt(5, 19);
      return {
        prompt: `${prenom} avait ${a} € et dépense ${b} €. Quelle opération permet de trouver la somme qu'il/elle a encore ?`,
        answer: "Une soustraction",
      };
    },
    () => {
      const [p1, p2] = shuffle(prenoms).slice(0, 2);
      const a = randInt(5, 60);
      const b = randInt(5, 60);
      return {
        prompt: `${p1} a lu ${a} pages et ${p2} en a lu ${b}. Quelle opération permet de trouver le nombre total de pages lues à eux deux ?`,
        answer: "Une addition",
      };
    },
  ];
  const options = ["Une addition", "Une soustraction", "Une multiplication", "Une division"];
  const { prompt, answer } = pick(templates)();
  return {
    type: "qcm",
    chapter: "Opérations sur les nombres — Choisir une opération",
    prompt,
    answer,
    options,
    steps: [{ type: "regle", text: `On identifie la situation (regrouper, répéter, retirer, réunir) pour choisir l'opération adaptée.` }],
  };
}

const GENERATORS = [
  genCalculerExpressionPriorites,
  genIdentifierSommeOuProduit,
  genAssocierExpressionResultat,
  genReconnaitreExpressionsEgalesDistributivite,
  genCalculAstucieuxFacteurCommun,
  genAireRectangleDecompose,
  genProgrammeCalculTexte,
  genRetrouverNombreDepartProgramme,
  genChoisirOperationProblemeQCM,
];

const DIFFICULTY = {
  genIdentifierSommeOuProduit: "facile",
  genCalculerExpressionPriorites: "standard",
  genAssocierExpressionResultat: "standard",
  genReconnaitreExpressionsEgalesDistributivite: "standard",
  genAireRectangleDecompose: "standard",
  genProgrammeCalculTexte: "standard",
  genCalculAstucieuxFacteurCommun: "expert",
  genRetrouverNombreDepartProgramme: "expert",
  genChoisirOperationProblemeQCM: "expert",
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
    id: "operations-sur-les-nombres",
    title: "Opérations sur les nombres",
    description: "Priorités opératoires, nommer un calcul, distributivité, programmes de calcul, choisir une opération.",
    pourquoi: "Connaître les priorités opératoires et choisir la bonne opération, c'est éviter les erreurs de calcul les plus fréquentes, à l'école comme dans la vie quotidienne.",
    level: "cinquieme",
    free: false,
    order: 2,
    cours: {
      mindMap: {
        title: "Opérations sur les nombres",
        branches: [
          {
            title: "Priorités opératoires",
            items: [
              "Dans une expression sans parenthèses : multiplications et divisions d'abord, puis additions et soustractions.",
              "Avec parenthèses : on calcule toujours ce qu'il y a à l'intérieur en premier.",
              "Piège classique : calculer de gauche à droite sans respecter les priorités.",
            ],
            formula: "\\(2 + 3 \\times 4 = 2 + 12 = 14\\)",
          },
          {
            title: "Nommer un calcul",
            items: [
              "La dernière opération effectuée (en respectant les priorités) donne le nom de l'expression.",
              "\\(a + b \\times c\\) est une somme ; \\((a + b) \\times c\\) est un produit.",
            ],
          },
          {
            title: "Distributivité",
            items: [
              "\\(k \\times (a + b) = k \\times a + k \\times b\\) : on peut développer ou factoriser.",
              "Utile pour calculer astucieusement en regroupant un facteur commun.",
            ],
            formula: "\\(k \\times (a + b) = k \\times a + k \\times b\\)",
          },
          {
            title: "Programme de calcul",
            items: [
              "On applique les étapes dans l'ordre donné, une par une.",
              "Pour retrouver le nombre de départ, on fait les opérations inverses en partant de la fin.",
            ],
          },
          {
            title: "Choisir la bonne opération",
            items: [
              "Regrouper en parts égales → division. Répéter un même prix/une même quantité → multiplication.",
              "Réunir deux quantités → addition. Ce qu'il reste après avoir retiré → soustraction.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
