// ---------------------------------------------------------------------------
// Chapitre : Calcul intégral (Terminale Spé) — abonnement.
// Intégrale définie via une primitive, linéarité, relation de Chasles,
// signe et encadrement, aire sous une courbe et entre deux courbes,
// fonction définie par une intégrale, parité.
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

// ---------- 1. Intégrale d'une fonction affine simple (numeric) ----------
function genIntegralePolynomeNumeric() {
  const p = nonZero(-6, 6); // f(x) = 2p x, primitive F(x) = p x^2
  const a = randInt(-6, 6);
  let b = randInt(-6, 6);
  if (b === a) b += 1;
  const answer = p * (b * b - a * a);
  return {
    type: "numeric",
    chapter: "Calcul intégral — Intégrale d'une fonction",
    prompt: `Calcule \\(\\displaystyle\\int_{${a}}^{${b}} ${2 * p}x \\, \\mathrm{d}x\\).`,
    answer,
    steps: [
      { type: "regle", text: "Une intégrale se calcule à l'aide d'une primitive : ∫ₐᵇ f(x)dx = F(b) - F(a)." },
      { type: "calcul", text: `F(x) = ${p}x^2` },
      { type: "resultat", text: `F(${b}) - F(${a}) = ${p} \\times ${b}^2 - ${p} \\times ${a}^2 = ${answer}` },
    ],
  };
}

// ---------- 2. Intégrale de a·e^(ax+b) (numeric) ----------
function genIntegraleExpAffineNumeric() {
  const a = nonZero(-3, 3);
  const b = randInt(-4, 4);
  const x0 = randInt(-3, 3);
  let x1 = randInt(-3, 3);
  if (x1 === x0) x1 += 1;
  const answer = roundTo(Math.exp(a * x1 + b) - Math.exp(a * x0 + b), 4);
  return {
    type: "numeric",
    chapter: "Calcul intégral — Intégrale d'une fonction",
    prompt: `Calcule \\(\\displaystyle\\int_{${x0}}^{${x1}} ${a}\\mathrm{e}^{${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}} \\, \\mathrm{d}x\\), arrondi au centième.`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Une primitive de } ${a}\\mathrm{e}^{${a}x${b >= 0 ? "+" : ""}${b}} \\text{ est } \\mathrm{e}^{${a}x${b >= 0 ? "+" : ""}${b}}` },
      { type: "resultat", text: `\\mathrm{e}^{${a}\\times${x1}${b >= 0 ? "+" : ""}${b}} - \\mathrm{e}^{${a}\\times${x0}${b >= 0 ? "+" : ""}${b}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 3. Valeur moyenne d'une fonction (numeric) ----------
function genValeurMoyenneNumeric() {
  const a = randInt(-6, 6);
  let b = randInt(-6, 6);
  if (b <= a) b = a + randInt(1, 6);
  const m = randInt(-9, 9); // valeur moyenne recherchée
  const V = m * (b - a);
  return {
    type: "numeric",
    chapter: "Calcul intégral — Valeur moyenne",
    prompt: `On donne \\(\\displaystyle\\int_{${a}}^{${b}} f(x)\\,\\mathrm{d}x = ${V}\\). Calcule la valeur moyenne de f sur \\([${a};${b}]\\).`,
    answer: m,
    steps: [
      { type: "regle", text: "La valeur moyenne de f sur [a;b] est m = (1/(b-a)) × ∫ₐᵇ f(x)dx." },
      { type: "resultat", text: `\\dfrac{1}{${b} - ${a}} \\times ${V} = ${m}` },
    ],
  };
}

// ---------- 4. Linéarité de l'intégrale (numeric) ----------
function genLineariteIntegraleNumeric() {
  const F = randInt(-9, 9);
  const G = randInt(-9, 9);
  const k = nonZero(-6, 6);
  const answer = k * F + G;
  return {
    type: "numeric",
    chapter: "Calcul intégral — Linéarité",
    prompt: `On sait que \\(\\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x = ${F}\\) et \\(\\displaystyle\\int_a^b g(x)\\,\\mathrm{d}x = ${G}\\). Calcule \\(\\displaystyle\\int_a^b \\left[${k}f(x) + g(x)\\right] \\mathrm{d}x\\).`,
    answer,
    steps: [
      { type: "regle", text: "Linéarité de l'intégrale : ∫ₐᵇ[k·f(x) + g(x)]dx = k·∫ₐᵇf(x)dx + ∫ₐᵇg(x)dx." },
      { type: "resultat", text: `${k} \\times ${F} + ${G} = ${answer}` },
    ],
  };
}

// ---------- 5. Relation de Chasles (numeric) ----------
function genChaslesNumeric() {
  const a = randInt(-6, 6);
  const b = a + randInt(1, 5);
  const c = b + randInt(1, 5);
  const V1 = randInt(-9, 9);
  const V2 = randInt(-9, 9);
  const answer = V1 + V2;
  return {
    type: "numeric",
    chapter: "Calcul intégral — Relation de Chasles",
    prompt: `On sait que \\(\\displaystyle\\int_{${a}}^{${b}} f(x)\\,\\mathrm{d}x = ${V1}\\) et \\(\\displaystyle\\int_{${b}}^{${c}} f(x)\\,\\mathrm{d}x = ${V2}\\). Calcule \\(\\displaystyle\\int_{${a}}^{${c}} f(x)\\,\\mathrm{d}x\\).`,
    answer,
    steps: [
      { type: "regle", text: "Relation de Chasles : ∫ₐᶜf(x)dx = ∫ₐᵇf(x)dx + ∫ᵇᶜf(x)dx." },
      { type: "resultat", text: `${V1} + ${V2} = ${answer}` },
    ],
  };
}

// ---------- 6. Signe d'une intégrale (QCM) ----------
function genSigneIntegraleQCM() {
  const positive = Math.random() < 0.5;
  const a = randInt(-6, 6);
  const b = a + randInt(1, 6);
  return {
    type: "qcm",
    chapter: "Calcul intégral — Signe et encadrement",
    prompt: `Sur \\([${a};${b}]\\) (avec ${a} < ${b}), on a f ${positive ? "\\geqslant" : "\\leqslant"} 0. Quel est le signe de \\(\\displaystyle\\int_{${a}}^{${b}} f(x)\\,\\mathrm{d}x\\) ?`,
    answer: positive ? "Positif" : "Négatif",
    options: ["Positif", "Négatif"],
    steps: [{ type: "regle", text: positive ? "f est positive donc l'intégrale est positive." : "f est négative donc l'intégrale est négative." }],
  };
}

// ---------- 7. Encadrement d'une intégrale (numeric) ----------
function genEncadrementIntegraleNumeric() {
  const a = randInt(-6, 6);
  const b = a + randInt(1, 6);
  const m = randInt(-9, 8);
  const M = m + randInt(1, 9);
  const answer = M * (b - a);
  return {
    type: "numeric",
    chapter: "Calcul intégral — Signe et encadrement",
    prompt: `Pour tout x, on a \\(${m} \\leqslant f(x) \\leqslant ${M}\\) sur \\([${a};${b}]\\). Détermine le majorant de \\(\\displaystyle\\int_{${a}}^{${b}} f(x)\\,\\mathrm{d}x\\) obtenu en intégrant cette inégalité.`,
    answer,
    steps: [
      { type: "regle", text: "Si f(x) ≤ M sur [a;b], alors ∫ₐᵇf(x)dx ≤ ∫ₐᵇM dx = M×(b-a)." },
      { type: "resultat", text: `\\displaystyle\\int_{${a}}^{${b}} ${M}\\,\\mathrm{d}x = ${M} \\times (${b} - ${a}) = ${answer}` },
    ],
  };
}

// ---------- 8. Aire sous une courbe (numeric) ----------
function genAireSousCourbeNumeric() {
  const p = randInt(1, 6); // f(x) = 2p x, positive sur [0;b]
  const b = randInt(1, 6);
  const answer = p * b * b;
  return {
    type: "numeric",
    chapter: "Calcul intégral — Aire sous une courbe",
    prompt: `Calcule l'aire, en unités d'aire, du domaine délimité par la courbe de \\(f(x) = ${2 * p}x\\), l'axe des abscisses, et les droites d'équations x=0 et x=${b}.`,
    answer,
    steps: [
      { type: "regle", text: "Comme f ≥ 0 sur l'intervalle, l'aire sous la courbe est égale à l'intégrale de f." },
      { type: "resultat", text: `\\text{Aire} = \\displaystyle\\int_0^{${b}} ${2 * p}x\\,\\mathrm{d}x = \\left[${p}x^2\\right]_0^{${b}} = ${answer}` },
    ],
  };
}

// ---------- 9. Aire entre deux courbes (numeric) ----------
function genAireEntreCourbesNumeric() {
  const a = randInt(-6, 6);
  const b = a + randInt(1, 6);
  const k = randInt(1, 9); // g(x) - f(x) = k (constante positive) sur [a;b]
  const answer = k * (b - a);
  return {
    type: "numeric",
    chapter: "Calcul intégral — Aire entre deux courbes",
    prompt: `Sur \\([${a};${b}]\\), on a \\(g(x) - f(x) = ${k}\\) (avec g au-dessus de f). Calcule l'aire, en unités d'aire, comprise entre les courbes de f et g sur \\([${a};${b}]\\).`,
    answer,
    steps: [
      { type: "regle", text: "Comme g est au-dessus de f, l'aire entre les deux courbes est égale à l'intégrale de g(x)-f(x)." },
      { type: "resultat", text: `\\text{Aire} = \\displaystyle\\int_{${a}}^{${b}} \\left[g(x)-f(x)\\right]\\mathrm{d}x = \\displaystyle\\int_{${a}}^{${b}} ${k}\\,\\mathrm{d}x = ${k} \\times (${b}-${a}) = ${answer}` },
    ],
  };
}

// ---------- 10. Fonction définie par une intégrale (numeric) ----------
function genFonctionDefinieIntegraleNumeric() {
  const p = nonZero(-6, 6);
  const q = randInt(-6, 6);
  const x0 = randInt(-6, 6);
  const answer = p * x0 + q;
  return {
    type: "numeric",
    chapter: "Calcul intégral — Fonction définie par une intégrale",
    prompt: `On définit \\(f(x) = \\displaystyle\\int_{c}^{x} u(t)\\,\\mathrm{d}t\\), où \\(u(t) = ${p}t ${q >= 0 ? "+" : "-"} ${Math.abs(q)}\\) est continue. Calcule \\(f'(${x0})\\).`,
    answer,
    steps: [
      { type: "regle", text: "f'(x) = u(x) : c'est le théorème fondamental de l'analyse, la dérivée d'une fonction définie par une intégrale est la fonction intégrée." },
      { type: "resultat", text: `f'(${x0}) = u(${x0}) = ${p} \\times ${x0} ${q >= 0 ? "+" : "-"} ${Math.abs(q)} = ${answer}` },
    ],
  };
}

// ---------- 11. Vrai ou faux sur les intégrales (QCM) ----------
function genVraiFauxIntegralesQCM() {
  const cas = pick([
    { description: "Si \\(f \\leqslant 0\\) sur \\([a;b]\\) (avec \\(a<b\\)), alors \\(\\int_a^b f(x)\\,\\mathrm{d}x \\leqslant 0\\).", reponse: "Vrai", explication: "C'est vrai : si f est négative sur tout l'intervalle et que a<b, l'intégrale hérite de ce signe." },
    { description: "\\(\\int_a^b f(x)\\,\\mathrm{d}x = -\\int_b^a f(x)\\,\\mathrm{d}x\\).", reponse: "Vrai", explication: "C'est vrai : inverser les bornes d'une intégrale change son signe." },
    { description: "La valeur moyenne d'une fonction sur \\([a;b]\\) est toujours positive.", reponse: "Faux", explication: "C'est faux : la valeur moyenne a le même signe que l'intégrale, elle peut donc être négative si f est négative sur l'intervalle." },
    { description: "Si f est impaire, \\(\\int_{-a}^{a} f(x)\\,\\mathrm{d}x = 0\\).", reponse: "Vrai", explication: "C'est vrai : pour une fonction impaire, la partie négative sur [-a;0] compense exactement la partie positive sur [0;a] (symétrie par rapport à l'origine)." },
    { description: "L'intégrale d'un produit de fonctions est le produit des intégrales.", reponse: "Faux", explication: "C'est faux : contrairement à la somme, il n'existe pas de formule générale exprimant ∫(f×g) à partir de ∫f et ∫g." },
  ]);
  return {
    type: "qcm",
    chapter: "Calcul intégral — Signe et encadrement",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 12. Inverser les bornes d'une intégrale (numeric) ----------
function genInverserBornesNumeric() {
  const V = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Calcul intégral — Relation de Chasles",
    prompt: `On sait que \\(\\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x = ${V}\\). Calcule \\(\\displaystyle\\int_b^a f(x)\\,\\mathrm{d}x\\).`,
    answer: -V,
    steps: [{ type: "regle", text: `\\int_b^a f(x)\\,\\mathrm{d}x = -\\int_a^b f(x)\\,\\mathrm{d}x = ${-V}` }],
  };
}

// ---------- 13. Comparer deux intégrales (QCM) ----------
function genComparerIntegralesQCM() {
  return {
    type: "qcm",
    chapter: "Calcul intégral — Signe et encadrement",
    prompt: `Si \\(f \\leqslant g\\) sur \\([a;b]\\) (avec \\(a<b\\)), que peut-on dire de \\(\\int_a^b f(x)\\,\\mathrm{d}x\\) et \\(\\int_a^b g(x)\\,\\mathrm{d}x\\) ?`,
    answer: "\\int_a^b f(x)\\,dx \\leqslant \\int_a^b g(x)\\,dx",
    options: ["\\int_a^b f(x)\\,dx \\leqslant \\int_a^b g(x)\\,dx", "\\int_a^b f(x)\\,dx \\geqslant \\int_a^b g(x)\\,dx", "\\int_a^b f(x)\\,dx = \\int_a^b g(x)\\,dx"],
    steps: [{ type: "regle", text: "L'intégration conserve l'ordre : si f \\leqslant g alors \\int f \\leqslant \\int g." }],
  };
}

// ---------- 14. Intégrale et parité (QCM) ----------
function genIntegraleParieImpaireQCM() {
  const impaire = Math.random() < 0.5;
  const options = ["0", "2\\displaystyle\\int_0^a f(x)\\,\\mathrm{d}x", "\\text{Cela dépend de } f"];
  if (impaire) {
    return {
      type: "qcm",
      chapter: "Calcul intégral — Intégrale et parité",
      prompt: `f est impaire. Quelle est la valeur de \\(\\displaystyle\\int_{-a}^{a} f(x)\\,\\mathrm{d}x\\) ?`,
      answer: "0",
      options,
      steps: [{ type: "regle", text: "Pour une fonction impaire, l'intégrale sur un intervalle symétrique par rapport à 0 est nulle." }],
    };
  }
  return {
    type: "qcm",
    chapter: "Calcul intégral — Intégrale et parité",
    prompt: `f est paire. Comment exprimer \\(\\displaystyle\\int_{-a}^{a} f(x)\\,\\mathrm{d}x\\) en fonction de \\(\\displaystyle\\int_0^a f(x)\\,\\mathrm{d}x\\) ?`,
    answer: "2\\displaystyle\\int_0^a f(x)\\,\\mathrm{d}x",
    options,
    steps: [{ type: "regle", text: "Pour une fonction paire, l'intégrale sur un intervalle symétrique vaut le double de l'intégrale sur la moitié positive." }],
  };
}

// ---------- 15. Intégrale d'une fonction constante (numeric) ----------
function genIntegraleConstanteNumeric() {
  const a = randInt(-6, 6);
  const b = a + randInt(1, 6);
  const k = randInt(-9, 9);
  const answer = k * (b - a);
  return {
    type: "numeric",
    chapter: "Calcul intégral — Intégrale d'une fonction",
    prompt: `Calcule \\(\\displaystyle\\int_{${a}}^{${b}} ${k}\\,\\mathrm{d}x\\).`,
    answer,
    steps: [
      { type: "regle", text: "L'intégrale d'une fonction constante k sur [a;b] vaut k×(b-a)." },
      { type: "resultat", text: `${k} \\times (${b} - ${a}) = ${answer}` },
    ],
  };
}

const GENERATORS = [
  genIntegralePolynomeNumeric,
  genIntegraleExpAffineNumeric,
  genValeurMoyenneNumeric,
  genLineariteIntegraleNumeric,
  genChaslesNumeric,
  genSigneIntegraleQCM,
  genEncadrementIntegraleNumeric,
  genAireSousCourbeNumeric,
  genAireEntreCourbesNumeric,
  genFonctionDefinieIntegraleNumeric,
  genVraiFauxIntegralesQCM,
  genInverserBornesNumeric,
  genComparerIntegralesQCM,
  genIntegraleParieImpaireQCM,
  genIntegraleConstanteNumeric,
];

const DIFFICULTY = {
  genIntegralePolynomeNumeric: "facile",
  genSigneIntegraleQCM: "facile",
  genAireSousCourbeNumeric: "facile",
  genInverserBornesNumeric: "facile",
  genIntegraleConstanteNumeric: "facile",
  genIntegraleExpAffineNumeric: "standard",
  genValeurMoyenneNumeric: "standard",
  genLineariteIntegraleNumeric: "standard",
  genChaslesNumeric: "standard",
  genVraiFauxIntegralesQCM: "standard",
  genComparerIntegralesQCM: "standard",
  genEncadrementIntegraleNumeric: "expert",
  genAireEntreCourbesNumeric: "expert",
  genFonctionDefinieIntegraleNumeric: "expert",
  genIntegraleParieImpaireQCM: "expert",
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
    id: "calcul-integral-terminale-spe",
    title: "Calcul intégral",
    description: "Intégrale définie, linéarité, relation de Chasles, aire sous une courbe et entre deux courbes.",
    pourquoi: "Calculer une aire sous une courbe, c'est ce qui permet d'estimer une quantité totale (distance, volume, revenu cumulé) à partir d'une vitesse ou d'un débit qui varie dans le temps.",
    level: "terminale-spe",
    free: false,
    order: 12,
    cours: {
      mindMap: {
        title: "Calcul intégral",
        branches: [
          {
            title: "Intégrale = aire algébrique",
            items: [
              "Se calcule avec une primitive F de f : différence des valeurs de F aux bornes.",
              "Si f ⩾ 0 sur [a;b], l'intégrale est l'aire sous la courbe, en unités d'aire ; si f ⩽ 0, elle est négative.",
            ],
            formula: "\\(\\displaystyle\\int_a^b f(x)\\,dx = F(b)-F(a)\\)",
          },
          {
            title: "Linéarité et relation de Chasles",
            items: [
              "Découper l'intervalle d'intégration en plusieurs morceaux (Chasles) ou séparer une somme (linéarité) simplifie souvent le calcul.",
            ],
            formula: "\\(\\displaystyle\\int_a^c f = \\int_a^b f + \\int_b^c f\\)",
          },
          {
            title: "Signe et encadrement",
            items: [
              "Si \\(f \\leqslant g\\) sur [a;b], alors \\(\\int_a^b f \\leqslant \\int_a^b g\\).",
              "Piège classique : inverser les bornes change le signe de l'intégrale.",
            ],
          },
          {
            title: "Aire entre deux courbes",
            items: [
              "L'aire entre les courbes de f et g sur [a;b] (avec \\(f \\geqslant g\\)) s'obtient en intégrant \\(f-g\\).",
            ],
            formula: "\\(\\mathcal{A} = \\displaystyle\\int_a^b (f(x)-g(x))\\,dx\\)",
          },
          {
            title: "Valeur moyenne",
            items: [
              "C'est la « hauteur moyenne » de la courbe sur l'intervalle.",
            ],
            formula: "\\(m = \\dfrac{1}{b-a}\\displaystyle\\int_a^b f(x)\\,dx\\)",
          },
        ],
      },
    },
  },
  generate,
};
