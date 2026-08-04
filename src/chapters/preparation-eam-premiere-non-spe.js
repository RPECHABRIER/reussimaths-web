// ---------------------------------------------------------------------------
// Chapitre : Préparation à l'EAM (Première non spé)
// Ce fichier ne contient QUE du contenu (générateurs d'exercices + métadonnées).
// L'affichage (mode Classique/Jeu, pavé numérique, QCM, aide progressive) est
// géré par le composant générique <ChapterRunner /> pour tous les chapitres.
//
// Génère des exercices dans l'esprit des deux parties de l'Épreuve Anticipée
// de Mathématiques (EAM) pour les élèves de Première SANS spécialité maths :
// Partie 1 « Automatismes - QCM » (6 points) et Partie 2 (14 points, exercices
// de probabilités conditionnelles et de suites, parfois de fonctions).
//
// Deux familles de générateurs :
// - Les générateurs « officiels » réutilisent, sous forme de banque de
//   questions à choix aléatoire, des énoncés RÉELS tombés à la session 2026
//   de l'EAM (sujets et corrigés officiels et publics). Chaque exercice
//   affiche sa source exacte (lieu, période, année) via le champ `chapter`,
//   qui sert d'étiquette au-dessus de l'énoncé (voir <ChapterRunner />).
// - Les générateurs « originaux » portent sur les mêmes compétences mais avec
//   des valeurs, contextes et nombres tirés aléatoirement à chaque exercice,
//   pour un entraînement illimité une fois les sujets officiels épuisés.
//
// Convention LaTeX : tout passage mathématique est entouré de \( ... \)
// (rendu ensuite en jolie notation par le composant <MathText />, voir
// src/components/MathText.jsx). Le reste du texte reste du français normal.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr() pour utiliser la virgule française — voir fr() ci-dessous.
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
const signedL = (n, withVar = "") => (n >= 0 ? `+ ${n}${withVar}` : `- ${Math.abs(n)}${withVar}`);

// ============================================================================
// ===================== 1. GÉNÉRATEURS OFFICIELS (sujets réels) ============
// ============================================================================

// ---------- Officiel 1. QCM Automatismes — Métropole, 12 juin 2026 ----------
function genQCMOfficielMetropole() {
  const banque = [
    {
      prompt: `Le nombre \\(\\dfrac{2}{5}\\) est égal à :`,
      options: ["0,2", "0,25", "0,4", "0,5"],
      answer: "0,4",
      steps: [`\\dfrac{2}{5} = \\dfrac{4}{10} = 0,4`],
    },
    {
      prompt: `30 % de 150 est égal à :`,
      options: ["15", "30", "45", "60"],
      answer: "45",
      steps: [`30\\% \\times 150 = \\dfrac{30}{100} \\times 150 = 45`],
    },
    {
      prompt: `On donne ci-dessous la représentation graphique d'une fonction \\(f\\). Parmi les nombres suivants, lequel est un antécédent de 3 par \\(f\\) ?`,
      options: ["0,5", "1", "1,5", "2"],
      answer: "1",
      steps: [`\\text{Un antécédent de 3 est un nombre } x \\text{ tel que } f(x) = 3 : \\text{d'après le graphique, c'est le cas de } x = 1 \\text{ (ainsi que de deux autres valeurs, non proposées ici).}`],
      graph: {
        xMin: -1,
        xMax: 4,
        yMin: -2,
        yMax: 6,
        curves: [{ fn: (x) => 3 - 0.25 * (x - 0.3) * (x - 1) * (x - 2.6), label: "Cf" }],
        lines: [{ a: 0, b: 3, color: "#6E7787", dashed: true, label: "y = 3" }],
        points: [{ x: 1, y: 3, label: "f(1) = 3", project: true }],
      },
    },
    {
      prompt: `La solution de l'équation \\(7x + 4 = 5x + 6\\) est :`,
      options: ["x = -1", "x = 0", "x = 2", "x = 1"],
      answer: "x = 1",
      steps: [`7x + 4 = 5x + 6 \\iff 2x = 2 \\iff x = 1`],
    },
    {
      prompt: `Un article coûte initialement 50 €. Son prix diminue de 10 %, puis ce nouveau prix augmente de 10 %. Le prix final de cet article est :`,
      options: ["49,50 €", "49,90 €", "50 €", "50,10 €"],
      answer: "49,50 €",
      steps: [
        { type: "regle", text: `\\text{Attention : des évolutions successives ne s'additionnent pas, elles se multiplient (coefficient multiplicateur par coefficient multiplicateur).}` },
        { type: "calcul", text: `50 \\times 0,9 = 45` },
        { type: "resultat", text: `45 \\times 1,1 = 49,50` },
      ],
    },
    {
      prompt: `On considère la courbe d'équation \\(y = 2x^2 - x + 3\\). Le point de cette courbe d'abscisse \\(-1\\) a pour coordonnées :`,
      options: ["(-1 ; 0)", "(-1 ; 2)", "(-1 ; 4)", "(-1 ; 6)"],
      answer: "(-1 ; 6)",
      steps: [`y = 2 \\times (-1)^2 - (-1) + 3 = 2 + 1 + 3 = 6`],
    },
    {
      prompt: `Une droite passe par les points \\(A(-1 ; 2)\\) et \\(B(-3 ; 4)\\). Son coefficient directeur est égal à :`,
      options: ["-2", "-1", "1", "2"],
      answer: "-1",
      steps: [`a = \\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{4 - 2}{-3 - (-1)} = \\dfrac{2}{-2} = -1`],
    },
    {
      prompt: `On s'intéresse au confort d'un hôtel. Les six dernières notes obtenues (sur 6 avis) sont : 2 ; 3 ; 5 ; 4 ; 2 ; 3. La médiane de cette série de notes est :`,
      options: ["2", "3", "3,5", "4"],
      answer: "3",
      steps: [`\\text{Série ordonnée : } 2 ; 2 ; 3 ; 3 ; 4 ; 5`, `\\text{Effectif pair (6 valeurs) : la médiane est la moyenne des 3e et 4e valeurs, soit } \\dfrac{3+3}{2} = 3`],
    },
  ];
  const q = pick(banque);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Sujet officiel (Métropole, 12 juin 2026)",
    prompt: q.prompt,
    answer: q.answer,
    options: q.options,
    steps: q.steps,
    ...(q.graph ? { graph: q.graph } : {}),
  };
}

// ---------- Officiel 2. QCM Automatismes — Antilles-Guyane, 12 juin 2026 ----------
function genQCMOfficielAntilles() {
  const banque = [
    {
      prompt: `\\(\\dfrac{2}{5} - \\dfrac{3}{10}\\) est égal à :`,
      options: ["-\\dfrac{3}{25}", "-\\dfrac{1}{5}", "\\dfrac{1}{10}", "\\dfrac{1}{5}"],
      answer: "\\dfrac{1}{10}",
      steps: [`\\dfrac{2}{5} - \\dfrac{3}{10} = \\dfrac{4}{10} - \\dfrac{3}{10} = \\dfrac{1}{10}`],
    },
    {
      prompt: `Parmi les fonctions suivantes, laquelle est représentée graphiquement par une droite ?`,
      options: ["f(x) = \\dfrac{5}{2}x - 5", "g(x) = x^3", "h(x) = -\\dfrac{1}{x} + 3", "i(x) = 2x^2 + 3x + 1"],
      answer: "f(x) = \\dfrac{5}{2}x - 5",
      steps: [`\\text{Seule une fonction affine } x \\mapsto ax+b \\text{ est représentée par une droite : c'est le cas de } f.`],
    },
    {
      prompt: `Dans le repère ci-dessous sont tracées quatre droites \\((d_1)\\), \\((d_2)\\), \\((d_3)\\) et \\((d_4)\\). Celle d'équation réduite \\(y = -\\dfrac{1}{2}x + 1\\) est :`,
      options: ["(d1)", "(d2)", "(d3)", "(d4)"],
      answer: "(d4)",
      steps: [`\\text{Le coefficient directeur } -\\dfrac{1}{2} \\text{ est négatif : c'est la seule droite décroissante du graphique, } (d_4).`],
      graph: {
        xMin: -4,
        xMax: 4,
        yMin: -4,
        yMax: 4,
        lines: [
          { a: 1, b: -2, label: "d1" },
          { a: 2, b: 1, label: "d2" },
          { a: 0, b: -1, label: "d3" },
          { a: -0.5, b: 1, label: "d4" },
        ],
      },
    },
    {
      prompt: `Un automobiliste roule à une vitesse moyenne de 60 km/h pendant 2 h 30 min. La distance parcourue est :`,
      options: ["150 km", "140 km", "130 km", "120 km"],
      answer: "150 km",
      steps: [`d = v \\times t = 60 \\times 2,5 = 150`],
    },
    {
      prompt: `Un article coûte 200 €. Après une augmentation de 20 %, son nouveau prix se calcule par :`,
      options: ["200 + 0,2", "200 \\times \\dfrac{20}{100}", "200 \\times 1,2", "100 \\times 0,20 + 200"],
      answer: "200 \\times 1,2",
      steps: [`\\text{Augmenter de 20 \\% revient à multiplier par } 1 + \\dfrac{20}{100} = 1,2`],
    },
    {
      prompt: `\\((2x-5)^2\\) développé et réduit est égal à :`,
      options: ["2x^2 - 10 + 25", "4x^2 - 20x - 25", "4x^2 - 20x + 25", "4x^2 - 25"],
      answer: "4x^2 - 20x + 25",
      steps: [`(2x-5)^2 = (2x)^2 - 2\\times 2x \\times 5 + 5^2 = 4x^2 - 20x + 25`],
    },
    {
      prompt: `La résistance \\(R\\) (en ohms) d'un appareil électrique vérifie \\(R = \\dfrac{U^2}{P}\\), où \\(U\\) est la tension (en volts) et \\(P\\) la puissance (en watts). Pour \\(U = 20\\) et \\(P = 80\\), \\(R\\) est égal à :`,
      options: ["\\dfrac{1}{2}", "2", "\\dfrac{1}{5}", "5"],
      answer: "5",
      steps: [`R = \\dfrac{20^2}{80} = \\dfrac{400}{80} = 5`],
    },
    {
      prompt: `On considère les nombres \\(A = \\dfrac{1}{8}\\), \\(B = \\dfrac{1}{9}\\), \\(C = \\dfrac{1}{12}\\) et \\(D = 0,1\\). Le plus petit de ces quatre nombres est :`,
      options: ["A", "B", "C", "D"],
      answer: "C",
      steps: [`\\text{Plus le dénominateur d'une fraction de numérateur 1 est grand, plus la fraction est petite : } \\dfrac{1}{12} < \\dfrac{1}{9} < \\dfrac{1}{8}`, `\\text{Et } 0,1 = \\dfrac{1}{10\\ }, \\text{ donc le plus petit nombre est } C = \\dfrac{1}{12}.`],
    },
  ];
  const q = pick(banque);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Sujet officiel (Antilles-Guyane, 12 juin 2026)",
    prompt: q.prompt,
    answer: q.answer,
    options: q.options,
    steps: q.steps,
    ...(q.graph ? { graph: q.graph } : {}),
  };
}

// ---------- Officiel 3. QCM Automatismes — Centres Étrangers, 8 juin 2026 ----------
function genQCMOfficielCentresEtrangers() {
  const banque = [
    {
      prompt: `\\(A = 4 - 2 \\times \\dfrac{1}{3}\\) est égal à :`,
      options: ["\\dfrac{2}{3}", "\\dfrac{10}{3}", "\\dfrac{4}{3}", "\\dfrac{11}{3}"],
      answer: "\\dfrac{10}{3}",
      steps: [`A = 4 - \\dfrac{2}{3} = \\dfrac{12}{3} - \\dfrac{2}{3} = \\dfrac{10}{3}`],
    },
    {
      prompt: `\\(B = 2 \\times 5^2 + 3\\) est égal à :`,
      options: ["103", "53", "97", "23"],
      answer: "53",
      steps: [`B = 2 \\times 25 + 3 = 50 + 3 = 53`],
    },
    {
      prompt: `25 % de 250 est égal à :`,
      options: ["62,5", "125", "50", "225"],
      answer: "62,5",
      steps: [`25\\% \\times 250 = \\dfrac{25}{100} \\times 250 = 62,5`],
    },
    {
      prompt: `Un article coûtant 300 € subit une baisse de 15 %. Son nouveau prix se calcule par :`,
      options: ["300 - 0,15", "300 \\times 0,85", "300 \\times 1,15", "300 \\times 0,15"],
      answer: "300 \\times 0,85",
      steps: [`\\text{Baisser de 15 \\% revient à multiplier par } 1 - 0,15 = 0,85`],
    },
    {
      prompt: `Dans le repère ci-dessous, la droite \\((AB)\\) passe par les points \\(A\\) et \\(B\\). Son équation réduite est :`,
      options: ["y = 4x + 2", "y = -2x + 2", "y = 2x + 4", "y = -0,5x + 2"],
      answer: "y = -0,5x + 2",
      steps: [`a = \\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{0-2}{4-0} = -0,5`, `\\text{L'ordonnée à l'origine est } y_A = 2, \\text{ donc } y = -0,5x + 2.`],
      graph: {
        xMin: -1,
        xMax: 5,
        yMin: -1,
        yMax: 3,
        points: [
          { x: 0, y: 2, label: "A" },
          { x: 4, y: 0, label: "B" },
        ],
        lines: [{ a: -0.5, b: 2, label: "(AB)" }],
      },
    },
    {
      prompt: `La valeur de \\(2x^2 - 3x - 4\\) pour \\(x = -1\\) est :`,
      options: ["-9", "-3", "-5", "1"],
      answer: "1",
      steps: [`2\\times(-1)^2 - 3\\times(-1) - 4 = 2 + 3 - 4 = 1`],
    },
    {
      prompt: `\\((x-4)^2\\) développé et réduit est égal à :`,
      options: ["x^2 - 8x + 16", "x^2 + 8x + 16", "x^2 - 8x - 16", "x^2 + 8x - 16"],
      answer: "x^2 - 8x + 16",
      steps: [`(x-4)^2 = x^2 - 2\\times 4x + 16 = x^2 - 8x + 16`],
    },
    {
      prompt: `Une fonction \\(f\\) est définie sur \\([-6 ; 5]\\). On donne ci-dessous sa représentation graphique, ainsi que la droite d'équation \\(y = 3\\). L'ensemble des solutions de l'inéquation \\(f(x) \\geq 3\\) est :`,
      options: ["[-6 ; -5] \\cup [-2 ; 5]", "\\{-5 ; -2\\}", "[-5 ; -2]", "\\{-3\\}"],
      answer: "[-5 ; -2]",
      steps: [`\\text{D'après le graphique, la courbe de } f \\text{ est au-dessus de la droite } y=3 \\text{ exactement pour } x \\in [-5 ; -2].`],
      graph: {
        xMin: -6,
        xMax: 5,
        yMin: -3,
        yMax: 6,
        curves: [{ fn: (x) => 3 - 1 * (x + 5) * (x + 2), label: "Cf" }],
        lines: [{ a: 0, b: 3, color: "#6E7787", dashed: true, label: "y = 3" }],
      },
    },
    {
      prompt: `L'ensemble des solutions de l'équation \\((2x+4)(-3x-9) = 0\\) est :`,
      options: ["\\{-5\\}", "\\{-4 ; 9\\}", "\\{-2 ; 3\\}", "\\{-3 ; -2\\}"],
      answer: "\\{-3 ; -2\\}",
      steps: [
        { type: "regle", text: `\\text{Un produit de facteurs est nul si et seulement si l'un au moins des facteurs est nul.}` },
        { type: "calcul", text: `2x+4=0 \\iff x=-2` },
        { type: "calcul", text: `-3x-9=0 \\iff x=-3` },
        { type: "resultat", text: `S = \\{-3 ; -2\\}` },
      ],
    },
    {
      prompt: `La loi de la gravitation universelle s'écrit \\(F = G \\times \\dfrac{m_1 \\times m_2}{R^2}\\). En isolant \\(m_1\\), on obtient :`,
      options: ["m_1 = \\dfrac{F \\times R^2}{G \\times m_2}", "m_1 = \\dfrac{G \\times m_2}{F \\times R^2}", "m_1 = F \\times G \\times m_2 \\times R^2", "m_1 = \\dfrac{F \\times G}{R^2 \\times m_2}"],
      answer: "m_1 = \\dfrac{F \\times R^2}{G \\times m_2}",
      steps: [
        { type: "regle", text: `\\text{On multiplie les deux membres par } R^2 \\text{ puis on divise par } G \\times m_2 \\text{ pour isoler } m_1.` },
        { type: "resultat", text: `F = G \\times \\dfrac{m_1 m_2}{R^2} \\iff m_1 = \\dfrac{F \\times R^2}{G \\times m_2}` },
      ],
    },
    {
      prompt: `On considère un arbre pondéré à deux niveaux d'évènements \\(A\\) et \\(B\\), avec \\(P(A) = 0,2\\), \\(P_A(B) = 0,3\\) et \\(P_{\\overline{A}}(B) = 0,4\\). La probabilité \\(P_{\\overline{A}}(\\overline{B})\\) est égale à :`,
      options: ["0,3", "0,48", "0,8", "0,6"],
      answer: "0,6",
      steps: [
        { type: "regle", text: `\\text{Sachant } \\overline{A}, \\text{ les évènements } B \\text{ et } \\overline{B} \\text{ se partagent toute la probabilité : } P_{\\overline{A}}(B) + P_{\\overline{A}}(\\overline{B}) = 1.` },
        { type: "resultat", text: `P_{\\overline{A}}(\\overline{B}) = 1 - P_{\\overline{A}}(B) = 1 - 0,4 = 0,6` },
      ],
    },
    {
      prompt: `Avec le même arbre pondéré (\\(P(A) = 0,2\\), \\(P_A(B) = 0,3\\), \\(P_{\\overline{A}}(B) = 0,4\\)), la probabilité \\(P_A(\\overline{B})\\) est égale à :`,
      options: ["0,3", "0,2", "0,14", "0,7"],
      answer: "0,7",
      steps: [
        { type: "regle", text: `\\text{Sachant } A, \\text{ les évènements } B \\text{ et } \\overline{B} \\text{ se partagent toute la probabilité : } P_A(B) + P_A(\\overline{B}) = 1.` },
        { type: "resultat", text: `P_A(\\overline{B}) = 1 - P_A(B) = 1 - 0,3 = 0,7` },
      ],
    },
  ];
  const q = pick(banque);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Sujet officiel (Centres Étrangers, 8 juin 2026)",
    prompt: q.prompt,
    answer: q.answer,
    options: q.options,
    steps: q.steps,
    ...(q.graph ? { graph: q.graph } : {}),
  };
}

// ---------- Officiel 4. Probabilités (tableau croisé) — Métropole, 12 juin 2026 ----------
function genProbaOfficielMetropole() {
  const contexte = `Dans un club sportif de 120 adhérents, chacun pratique soit le judo (évènement \\(J\\)), soit la natation en section aquatique (évènement \\(A\\)), et est scolarisé en seconde (\\(S\\)), en première (\\(P\\)) ou en terminale (\\(T\\)). Le tableau croisé des effectifs est le suivant. Judo : 10 en seconde, 6 en première, 8 en terminale (24 au total). Section aquatique : 40 en seconde, 50 en première, 6 en terminale (96 au total). Totaux par niveau : 50 en seconde, 56 en première, 14 en terminale, pour 120 adhérents en tout.`;
  const banque = [
    { question: `Calcule la probabilité \\(P(A \\cap S)\\) que l'adhérent choisi au hasard soit en section aquatique ET en seconde.`, answer: roundTo(40 / 120, 4), steps: [`P(A \\cap S) = \\dfrac{40}{120} = \\dfrac{1}{3} \\approx ${fr(roundTo(40 / 120, 4))}`] },
    { question: `Calcule la probabilité conditionnelle \\(P_S(A)\\) (probabilité de pratiquer la section aquatique sachant que l'adhérent est en seconde).`, answer: roundTo(40 / 50, 4), steps: [
      { type: "regle", text: `\\text{Pour une probabilité conditionnelle, on divise non pas par l'effectif total, mais par l'effectif du groupe déjà connu (ici les 50 élèves de seconde).}` },
      { type: "resultat", text: `P_S(A) = \\dfrac{40}{50} = ${fr(roundTo(40 / 50, 4))}` },
    ] },
    { question: `Calcule la probabilité \\(P(J)\\) que l'adhérent choisi au hasard pratique le judo.`, answer: roundTo(24 / 120, 4), steps: [`P(J) = \\dfrac{24}{120} = ${fr(roundTo(24 / 120, 4))}`] },
    { question: `Calcule la probabilité conditionnelle \\(P_T(J)\\) (probabilité de pratiquer le judo sachant que l'adhérent est en terminale).`, answer: roundTo(8 / 14, 4), steps: [`P_T(J) = \\dfrac{8}{14} = \\dfrac{4}{7} \\approx ${fr(roundTo(8 / 14, 4))}`] },
  ];
  const q = pick(banque);
  return {
    type: "numeric",
    chapter: "Préparation EAM — Sujet officiel (Métropole, 12 juin 2026)",
    prompt: `${contexte} ${q.question} (arrondis au dix-millième si besoin.)`,
    answer: q.answer,
    tolerance: 0.0005,
    steps: q.steps,
  };
}

// ---------- Officiel 5. Probabilités (arbre pondéré) — Antilles-Guyane, 12 juin 2026 ----------
function genProbaOfficielAntilles() {
  const contexte = `Dans une association, 40 % des élèves inscrits à un club ont choisi une activité artistique (évènement \\(A\\)) ; les autres élèves n'en ont pas choisi. Parmi les élèves ayant une activité artistique, 20 % pratiquent aussi une activité sportive (évènement \\(S\\)). Parmi les élèves n'ayant pas d'activité artistique, 40 % pratiquent une activité sportive.`;
  const banque = [
    { type: "numeric", question: `Calcule \\(P(A \\cap S)\\).`, answer: 0.08, tolerance: 0.0005, steps: [`P(A \\cap S) = P(A) \\times P_A(S) = 0,4 \\times 0,2 = 0,08`] },
    { type: "numeric", question: `Calcule \\(P(\\overline{A} \\cap S)\\).`, answer: 0.24, tolerance: 0.0005, steps: [`P(\\overline{A} \\cap S) = P(\\overline{A}) \\times P_{\\overline{A}}(S) = 0,6 \\times 0,4 = 0,24`] },
    { type: "numeric", question: `Sachant que \\(P(S) = 0,32\\), calcule \\(P_S(A)\\).`, answer: 0.25, tolerance: 0.0005, steps: [`P(A \\cap S) = 0,08`, `P_S(A) = \\dfrac{P(A \\cap S)}{P(S)} = \\dfrac{0,08}{0,32} = 0,25`] },
    {
      type: "qcm",
      question: `Les évènements \\(A\\) et \\(S\\) sont-ils indépendants ?`,
      options: ["Oui, car P_A(S) = P(S)", "Oui, car P(A) = P(S)", "Non, car P_A(S) \\neq P(S)", "Non, car P(A \\cap S) = 0"],
      answer: "Non, car P_A(S) \\neq P(S)",
      steps: [`P_A(S) = 0,2 \\text{ alors que } P(S) = 0,32 : \\text{ ces deux probabilités sont différentes, } A \\text{ et } S \\text{ ne sont donc pas indépendants.}`],
    },
  ];
  const q = pick(banque);
  const base = { chapter: "Préparation EAM — Sujet officiel (Antilles-Guyane, 12 juin 2026)", prompt: `${contexte} ${q.question}`, steps: q.steps };
  if (q.type === "numeric") return { type: "numeric", answer: q.answer, tolerance: q.tolerance, ...base };
  return { type: "qcm", answer: q.answer, options: q.options, ...base };
}

// ---------- Officiel 6. Probabilités (tableau croisé) — Centres Étrangers, 8 juin 2026 ----------
function genProbaOfficielCentresEtrangers() {
  const contexte = `Une compagnie aérienne interroge 1000 clients sur leur satisfaction. Parmi les 800 clients ayant réservé sur Internet (évènement \\(I\\)), 720 se disent satisfaits (évènement \\(S\\)) et 80 non. Parmi les 200 clients ayant réservé en agence, 180 se disent satisfaits et 20 non. Au total, 900 clients sur 1000 se disent satisfaits.`;
  const banque = [
    { type: "numeric", question: `Calcule \\(P(S)\\).`, answer: 0.9, tolerance: 0.0005, steps: [`P(S) = \\dfrac{900}{1000} = 0,9`] },
    { type: "numeric", question: `Calcule \\(P(S \\cap I)\\).`, answer: 0.72, tolerance: 0.0005, steps: [`P(S \\cap I) = \\dfrac{720}{1000} = 0,72`] },
    { type: "numeric", question: `Calcule la probabilité conditionnelle \\(P_S(I)\\).`, answer: 0.8, tolerance: 0.0005, steps: [
      { type: "regle", text: `\\text{Pour une probabilité conditionnelle, on divise par l'effectif du groupe déjà connu (ici les 900 clients satisfaits), pas par l'effectif total.}` },
      { type: "resultat", text: `P_S(I) = \\dfrac{720}{900} = 0,8` },
    ] },
    {
      type: "qcm",
      question: `Les évènements \\(I\\) et \\(S\\) sont-ils indépendants ?`,
      options: ["Oui, car P_S(I) = P(I) = 0,8", "Non, car P_S(I) \\neq P(I)", "Oui, car P(I \\cap S) = 0,72", "Non, car P(I) \\neq P(S)"],
      answer: "Oui, car P_S(I) = P(I) = 0,8",
      steps: [`P(I) = \\dfrac{800}{1000} = 0,8`, `P_S(I) = 0,8 = P(I) : \\text{ les deux probabilités sont égales, } I \\text{ et } S \\text{ sont donc indépendants.}`],
    },
  ];
  const q = pick(banque);
  const base = { chapter: "Préparation EAM — Sujet officiel (Centres Étrangers, 8 juin 2026)", prompt: `${contexte} ${q.question}`, steps: q.steps };
  if (q.type === "numeric") return { type: "numeric", answer: q.answer, tolerance: q.tolerance, ...base };
  return { type: "qcm", answer: q.answer, options: q.options, ...base };
}

// ---------- Officiel 7. Suites (deux placements) — Métropole, 12 juin 2026 ----------
function genSuitesOfficielMetropole() {
  const contexte = `En 2025, un particulier place un capital de 20 000 €. Il hésite entre deux placements. Placement A : chaque année, le capital augmente de 200 € ; on note \\(a_n\\) le capital, en euros, n années après 2025, avec \\(a_0 = 20\\,000\\). Placement B : chaque année, le capital est multiplié par 1,02 ; on note \\(b_n\\) le capital n années après 2025, avec \\(b_0 = 20\\,000\\).`;
  const banque = [
    { type: "numeric", question: `Calcule \\(a_1\\).`, answer: 20200, steps: [`a_1 = a_0 + 200 = 20\\,000 + 200 = 20\\,200`] },
    { type: "numeric", question: `Calcule \\(a_2\\).`, answer: 20400, steps: [`a_2 = a_1 + 200 = 20\\,400`] },
    { type: "qcm", question: `Quelle est la nature de la suite \\((a_n)\\) ?`, options: ["Arithmétique de raison 200", "Géométrique de raison 200", "Arithmétique de raison 1,02", "Ni arithmétique, ni géométrique"], answer: "Arithmétique de raison 200", steps: [`\\text{Chaque terme s'obtient en ajoutant 200 au précédent : } (a_n) \\text{ est arithmétique de raison } 200.`] },
    { type: "numeric", question: `En utilisant \\(a_n = 20\\,000 + 200n\\), calcule \\(a_{10}\\) (le capital en 2035).`, answer: 22000, steps: [`a_{10} = 20\\,000 + 200 \\times 10 = 22\\,000`] },
    { type: "numeric", question: `Calcule \\(b_1\\) (arrondi à l'euro près).`, answer: 20400, steps: [`b_1 = b_0 \\times 1,02 = 20\\,000 \\times 1,02 = 20\\,400`] },
    { type: "qcm", question: `Quelle est la nature de la suite \\((b_n)\\) ?`, options: ["Géométrique de raison 1,02", "Arithmétique de raison 1,02", "Géométrique de raison 200", "Ni arithmétique, ni géométrique"], answer: "Géométrique de raison 1,02", steps: [`\\text{Chaque terme s'obtient en multipliant le précédent par 1,02 : } (b_n) \\text{ est géométrique de raison } 1,02.`] },
    { type: "numeric", question: `À l'aide d'un tableur, on constate que le placement B dépasse 22 000 € pour \\(n = 5\\). En quelle année cela correspond-il ?`, answer: 2030, steps: [`2025 + 5 = 2030`] },
    { type: "qcm", question: `Quel placement permet d'atteindre 22 000 € le plus tôt ?`, options: ["Le placement A (2035)", "Le placement B (2030)", "Les deux à la même date", "Aucun des deux ne l'atteint"], answer: "Le placement B (2030)", steps: [`\\text{Le placement A atteint 22\\,000 € en 2035, le placement B dès 2030 : le placement B est donc plus intéressant.}`] },
  ];
  const q = pick(banque);
  const base = { chapter: "Préparation EAM — Sujet officiel (Métropole, 12 juin 2026)", prompt: `${contexte} ${q.question}`, steps: q.steps };
  if (q.type === "numeric") return { type: "numeric", answer: q.answer, ...base };
  return { type: "qcm", answer: q.answer, options: q.options, ...base };
}

// ---------- Officiel 8. Suites (deux forêts) — Antilles-Guyane, 12 juin 2026 ----------
function genSuitesOfficielAntilles() {
  const contexte = `En 2010, une région compte deux forêts. La forêt 1 comporte 1200 hectares ; chaque année, sa surface augmente de 100 hectares : on note \\(u_n\\) sa surface, en hectares, n années après 2010, avec \\(u_0 = 1200\\). La forêt 2 comporte 1000 hectares ; chaque année, sa surface est multipliée par 1,05 : on note \\(v_n\\) sa surface n années après 2010, avec \\(v_0 = 1000\\).`;
  const banque = [
    { type: "numeric", question: `Calcule \\(u_1\\).`, answer: 1300, steps: [`u_1 = 1200 + 100 = 1300`] },
    { type: "numeric", question: `Calcule \\(u_2\\).`, answer: 1400, steps: [`u_2 = u_1 + 100 = 1400`] },
    { type: "qcm", question: `Quelle est la nature de la suite \\((u_n)\\) ?`, options: ["Arithmétique de raison 100", "Géométrique de raison 100", "Géométrique de raison 1,05", "Ni arithmétique, ni géométrique"], answer: "Arithmétique de raison 100", steps: [`(u_n) \\text{ est arithmétique de raison } 100.`] },
    { type: "numeric", question: `On admet que \\(u_n = 1200 + 100n\\). À partir de quelle année a-t-on \\(u_n > 2950\\) ? (Donne l'année sous la forme AAAA.)`, answer: 2028, steps: [
      { type: "calcul", text: `1200 + 100n > 2950 \\iff n > 17,5` },
      { type: "regle", text: `\\text{n représente un nombre d'années, donc un entier : comme } n > 17,5, \\text{ le plus petit entier qui convient est } n = 18.` },
      { type: "resultat", text: `2010 + 18 = 2028` },
    ] },
    { type: "numeric", question: `Calcule \\(v_1\\) (arrondi à l'unité).`, answer: 1050, steps: [`v_1 = 1000 \\times 1,05 = 1050`] },
    { type: "qcm", question: `Quelle est la nature de la suite \\((v_n)\\) ?`, options: ["Géométrique de raison 1,05", "Arithmétique de raison 1,05", "Géométrique de raison 1000", "Ni arithmétique, ni géométrique"], answer: "Géométrique de raison 1,05", steps: [`(v_n) \\text{ est géométrique de raison } 1,05.`] },
    { type: "numeric", question: `D'après un tableau de valeurs, en 2038 la forêt 1 est encore plus grande que la forêt 2, mais en 2039 la forêt 2 devient plus grande. À partir de quelle année la forêt 2 dépasse-t-elle la forêt 1 ? (AAAA)`, answer: 2039, steps: [`u_{29} = 1200 + 2900 = 4100`, `v_{29} = 1000 \\times 1,05^{29} \\approx 4116 > 4100`, `\\text{La forêt 2 dépasse la forêt 1 à partir de } 2010 + 29 = 2039.`] },
  ];
  const q = pick(banque);
  const base = { chapter: "Préparation EAM — Sujet officiel (Antilles-Guyane, 12 juin 2026)", prompt: `${contexte} ${q.question}`, steps: q.steps };
  if (q.type === "numeric") return { type: "numeric", answer: q.answer, ...base };
  return { type: "qcm", answer: q.answer, options: q.options, ...base };
}

// ---------- Officiel 9. Suites (clubs basket / handball) — Centres Étrangers, 8 juin 2026 ----------
function genSuitesOfficielCentresEtrangers() {
  const contexte = `En 2025, un club de basket compte 900 adhérents ; chaque année, ce nombre diminue de 10 : on note \\(B_n\\) le nombre d'adhérents n années après 2025, avec \\(B_0 = 900\\). La même année, un club de handball compte 200 adhérents ; chaque année, ce nombre est multiplié par 1,2 : on note \\(H_n\\) le nombre d'adhérents n années après 2025, avec \\(H_0 = 200\\).`;
  const banque = [
    { type: "numeric", question: `Calcule \\(B_1\\).`, answer: 890, steps: [`B_1 = 900 - 10 = 890`] },
    { type: "numeric", question: `On admet que \\(B_n = 900 - 10n\\). Calcule \\(B_{10}\\) (le nombre d'adhérents au basket en 2035).`, answer: 800, steps: [`B_{10} = 900 - 100 = 800`] },
    { type: "qcm", question: `Quelle est la nature de la suite \\((B_n)\\) ?`, options: ["Arithmétique de raison -10", "Géométrique de raison -10", "Arithmétique de raison 900", "Ni arithmétique, ni géométrique"], answer: "Arithmétique de raison -10", steps: [`(B_n) \\text{ est arithmétique de raison } -10.`] },
    { type: "qcm", question: `Quelle est la nature de la suite \\((H_n)\\) ?`, options: ["Géométrique de raison 1,2", "Arithmétique de raison 1,2", "Géométrique de raison 200", "Ni arithmétique, ni géométrique"], answer: "Géométrique de raison 1,2", steps: [`(H_n) \\text{ est géométrique de raison } 1,2.`] },
    { type: "numeric", question: `Calcule \\(H_1\\).`, answer: 240, steps: [`H_1 = 200 \\times 1,2 = 240`] },
    { type: "numeric", question: `On admet que \\(H_n = 200 \\times 1,2^n\\). Calcule \\(H_8\\) (arrondi à l'unité).`, answer: 860, steps: [`H_8 = 200 \\times 1,2^8 \\approx 860`] },
    { type: "qcm", question: `Entre 2025 (900 adhérents) et 2035, le club de basket aura-t-il perdu plus de 10 % de ses adhérents ?`, options: ["Oui, car B_10 = 800 < 810 (90 % de 900)", "Non, car B_10 = 800 > 810", "Oui, car B_10 = 0", "On ne peut pas savoir"], answer: "Oui, car B_10 = 800 < 810 (90 % de 900)", steps: [`90\\% \\times 900 = 810`, `B_{10} = 800 < 810 : \\text{le club a bien perdu plus de 10 \\% de ses adhérents.}`] },
    { type: "numeric", question: `À partir de quelle année (AAAA) le nombre d'adhérents au handball dépasse-t-il celui du basket, sachant qu'en 2033 (n = 8) \\(H_8 \\approx 860\\) et \\(B_8 = 820\\), alors qu'en 2032 (n = 7) \\(H_7 \\approx 717\\) et \\(B_7 = 830\\) ?`, answer: 2033, steps: [`\\text{En } 2032, H_7 < B_7 ; \\text{ en } 2033, H_8 > B_8 : \\text{le dépassement a lieu en } 2033.`] },
  ];
  const q = pick(banque);
  const base = { chapter: "Préparation EAM — Sujet officiel (Centres Étrangers, 8 juin 2026)", prompt: `${contexte} ${q.question}`, steps: q.steps };
  if (q.type === "numeric") return { type: "numeric", answer: q.answer, ...base };
  return { type: "qcm", answer: q.answer, options: q.options, ...base };
}

// ---------- Officiel 10. Fonction (signe de la dérivée) — Centres Étrangers, 8 juin 2026 ----------
function genFonctionOfficielCentresEtrangers() {
  const banque = [
    {
      prompt: `On considère la fonction \\(f\\) définie sur \\([0 ; 10]\\) par \\(f(x) = -x^3 + 4,5x^2 - 6x + 2\\). L'expression de sa dérivée \\(f'(x)\\) est :`,
      options: ["-3x^2 + 9x - 6", "-3x^2 - 9x - 6", "3x^2 + 9x - 6", "-x^2 + 9x - 6"],
      answer: "-3x^2 + 9x - 6",
      steps: [
        { type: "regle", text: `\\text{On dérive terme par terme : la dérivée de } -x^3 \\text{ est } -3x^2, \\text{ celle de } 4,5x^2 \\text{ est } 9x, \\text{ celle de } -6x \\text{ est } -6, \\text{ et celle de la constante } 2 \\text{ est nulle.}` },
        { type: "resultat", text: `f'(x) = -3x^2 + 2 \\times 4,5 x - 6 = -3x^2 + 9x - 6` },
      ],
    },
    {
      prompt: `Avec \\(f'(x) = -3x^2 + 9x - 6\\), cette expression se factorise sous la forme :`,
      options: ["(3x-6)(1-x)", "(3x+6)(1-x)", "(3x-6)(1+x)", "(x-6)(3-x)"],
      answer: "(3x-6)(1-x)",
      steps: [`(3x-6)(1-x) = 3x - 3x^2 - 6 + 6x = -3x^2 + 9x - 6 = f'(x)`],
    },
    {
      prompt: `On donne \\(f'(x) = (3x-6)(1-x)\\), qui s'annule en \\(x=1\\) et \\(x=2\\). Sur quel intervalle inclus dans \\([0 ; 10]\\) la fonction \\(f\\) est-elle croissante ?`,
      options: ["[0 ; 1]", "[1 ; 2]", "[2 ; 10]", "[0 ; 10]"],
      answer: "[1 ; 2]",
      steps: [`\\text{Pour } x \\in ]1 ; 2[, \\text{ on a } (3x-6) < 0 \\text{ et } (1-x) < 0, \\text{ donc } f'(x) > 0 : f \\text{ est croissante sur } [1 ; 2].`],
    },
    {
      prompt: `Avec la même fonction \\(f\\), en quelle valeur de \\(x\\) la fonction \\(f\\) admet-elle un minimum local sur \\([0 ; 10]\\) ?`,
      options: ["x = 0", "x = 1", "x = 2", "x = 10"],
      answer: "x = 1",
      steps: [`f' \\text{ change de signe de négatif à positif en } x = 1 : f \\text{ admet un minimum local en } x = 1.`],
    },
  ];
  const q = pick(banque);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Sujet officiel (Centres Étrangers, 8 juin 2026)",
    prompt: q.prompt,
    answer: q.answer,
    options: q.options,
    steps: q.steps,
  };
}

// ============================================================================
// ===================== 2. GÉNÉRATEURS ORIGINAUX (aléatoires) ==============
// ============================================================================

// ---------- Original 1. Pourcentage d'un nombre ----------
function genPourcentageDeNombreOriginalQCM() {
  const p = pick([10, 15, 20, 25, 30, 40, 50, 60, 75, 80]);
  const k = randInt(2, 30);
  const base = Math.round((100 / p) * k);
  const correct = Math.round((p / 100) * base);
  const wrong1 = correct + randInt(3, 12);
  const wrong2 = Math.max(1, correct - randInt(3, 12));
  const wrong3 = Math.round(base - correct);
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])].map(String));
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `${p} % de ${base} est égal à :`,
    answer: String(correct),
    options,
    steps: [`${p}\\% \\times ${base} = \\dfrac{${p}}{100} \\times ${base} = ${correct}`],
  };
}

// ---------- Original 2. Évolution double (hausse/baisse successives) ----------
function genEvolutionDoubleOriginalQCM() {
  const prix = pick([40, 50, 60, 80, 100, 120, 150, 200]);
  const p = pick([5, 10, 15, 20, 25]);
  const q = pick([5, 10, 15, 20, 25]);
  const baisseHausse = Math.random() < 0.5;
  const coef1 = baisseHausse ? roundTo(1 - p / 100, 3) : roundTo(1 + p / 100, 3);
  const coef2 = baisseHausse ? roundTo(1 + q / 100, 3) : roundTo(1 - q / 100, 3);
  const etape1 = roundTo(prix * coef1, 2);
  const prixFinal = roundTo(etape1 * coef2, 2);
  const correct = `${fr(prixFinal)} €`;
  const wrong1 = `${fr(prix)} €`;
  const wrong2 = `${fr(roundTo(prix * (1 + (p - q) / 100), 2))} €`;
  const wrong3 = `${fr(roundTo(prixFinal + randInt(1, 5), 2))} €`;
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])]);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: baisseHausse
      ? `Un article coûte initialement ${fr(prix)} €. Son prix diminue de ${p} %, puis ce nouveau prix augmente de ${q} %. Le prix final de cet article est :`
      : `Un article coûte initialement ${fr(prix)} €. Son prix augmente de ${p} %, puis ce nouveau prix diminue de ${q} %. Le prix final de cet article est :`,
    answer: correct,
    options,
    steps: [`${fr(prix)} \\times ${fr(coef1)} = ${fr(etape1)}`, `${fr(etape1)} \\times ${fr(coef2)} = ${fr(prixFinal)}`],
  };
}

// ---------- Original 3. Équation affine des deux côtés ----------
function genEquationAffineOriginalQCM() {
  const a = nonZero(2, 9);
  let c = nonZero(2, 9);
  while (c === a) c = nonZero(2, 9);
  const xSol = randInt(-8, 8);
  const b = randInt(-10, 10);
  const d = a * xSol + b - c * xSol;
  const correct = `x = ${xSol}`;
  const wrong1 = `x = ${xSol + 1}`;
  const wrong2 = `x = ${-xSol}`;
  const wrong3 = `x = ${xSol - 2}`;
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])]);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `La solution de l'équation \\(${a}x ${signedL(b)} = ${c}x ${signedL(d)}\\) est :`,
    answer: correct,
    options,
    steps: [`${a}x ${signedL(b)} = ${c}x ${signedL(d)} \\iff ${a - c}x = ${d - b} \\iff x = ${xSol}`],
  };
}

// ---------- Original 4. Coefficient directeur ----------
function genCoefficientDirecteurOriginalQCM() {
  const xA = randInt(-6, 6);
  const yA = randInt(-6, 6);
  let xB = randInt(-6, 6);
  while (xB === xA) xB = randInt(-6, 6);
  let yB = randInt(-6, 6);
  while (yB === yA) yB = randInt(-6, 6);
  const num = yB - yA;
  const den = xB - xA;
  const a = roundTo(num / den, 2);
  const correct = fr(a);
  const wrong1 = fr(roundTo(-a, 2));
  const wrong2 = fr(roundTo(a + 1, 2));
  const wrong3 = fr(roundTo(a - 1, 2));
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])]);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `Une droite passe par les points \\(A(${xA} ; ${yA})\\) et \\(B(${xB} ; ${yB})\\). Son coefficient directeur est égal à :`,
    answer: correct,
    options,
    steps: [`a = \\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{${yB} - (${yA})}{${xB} - (${xA})} = \\dfrac{${num}}{${den}} = ${correct}`],
  };
}

// ---------- Original 5. Identité remarquable ----------
function genIdentiteRemarquableOriginalQCM() {
  const forme = pick(["carre_somme", "carre_difference", "produit_somme_difference"]);
  const a = pick([2, 3, 4, 5]);
  const b = nonZero(1, 9);
  let expr, correct, identite;
  if (forme === "carre_somme") {
    expr = `(${a}x + ${b})^2`;
    correct = `${a * a}x^2 + ${2 * a * b}x + ${b * b}`;
    identite = `(A+B)^2 = A^2 + 2AB + B^2`;
  } else if (forme === "carre_difference") {
    expr = `(${a}x - ${b})^2`;
    correct = `${a * a}x^2 - ${2 * a * b}x + ${b * b}`;
    identite = `(A-B)^2 = A^2 - 2AB + B^2`;
  } else {
    expr = `(${a}x + ${b})(${a}x - ${b})`;
    correct = `${a * a}x^2 - ${b * b}`;
    identite = `(A+B)(A-B) = A^2 - B^2`;
  }
  const wrong1 = `${a}x^2 ${signedL(b * b)}`;
  const wrong2 = forme === "produit_somme_difference" ? `${a * a}x^2 + ${b * b}` : `${a * a}x^2 ${signedL(b * b)}`;
  const wrong3 = `${2 * a}x ${signedL(b)}`;
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])]);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `La forme développée et réduite de \\(${expr}\\) est :`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: `\\text{On applique l'identité remarquable } ${identite} \\text{ avec } A = ${a}x \\text{ et } B = ${b}.` },
      { type: "resultat", text: correct },
    ],
  };
}

// ---------- Original 6. Médiane d'une série ----------
function genMedianeSerieOriginalQCM() {
  const taille = pick([5, 6, 7]);
  const serie = Array.from({ length: taille }, () => randInt(0, 10));
  const triee = [...serie].sort((x, y) => x - y);
  const mediane = taille % 2 === 1 ? triee[(taille - 1) / 2] : roundTo((triee[taille / 2 - 1] + triee[taille / 2]) / 2, 1);
  const correct = fr(mediane);
  const wrong1 = fr(triee[0]);
  const wrong2 = fr(triee[taille - 1]);
  const wrong3 = fr(roundTo(mediane + 1, 1));
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])]);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `On relève une série de notes (sur 10) : ${serie.join(" ; ")}. La médiane de cette série est :`,
    answer: correct,
    options,
    steps: [
      `\\text{Série ordonnée : } ${triee.join(" ; ")}`,
      taille % 2 === 1
        ? `\\text{Effectif impair : la médiane est la valeur centrale, soit } ${correct}`
        : `\\text{Effectif pair : la médiane est la moyenne des deux valeurs centrales, soit } ${correct}`,
    ],
  };
}

// ---------- Original 7. Isoler une variable dans une formule ----------
function genIsolerVariableFormuleOriginalQCM() {
  const formules = [
    { enonce: `v = \\dfrac{d}{t}`, cible: `t`, correct: `t = \\dfrac{d}{v}`, wrong: [`t = \\dfrac{v}{d}`, `t = d \\times v`, `t = d - v`] },
    { enonce: `v = \\dfrac{d}{t}`, cible: `d`, correct: `d = v \\times t`, wrong: [`d = \\dfrac{v}{t}`, `d = \\dfrac{t}{v}`, `d = v + t`] },
    { enonce: `P = U \\times I`, cible: `I`, correct: `I = \\dfrac{P}{U}`, wrong: [`I = \\dfrac{U}{P}`, `I = P \\times U`, `I = P - U`] },
    { enonce: `\\mathcal{A} = L \\times \\ell`, cible: `\\ell`, correct: `\\ell = \\dfrac{\\mathcal{A}}{L}`, wrong: [`\\ell = \\dfrac{L}{\\mathcal{A}}`, `\\ell = \\mathcal{A} \\times L`, `\\ell = \\mathcal{A} - L`] },
  ];
  const f = pick(formules);
  const options = shuffle([f.correct, ...f.wrong]);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `On donne la formule \\(${f.enonce}\\). En isolant \\(${f.cible}\\), on obtient :`,
    answer: f.correct,
    options,
    steps: [
      { type: "regle", text: `\\text{On isole la variable demandée dans la formule } ${f.enonce} \\text{ en multipliant ou divisant les deux membres par les mêmes quantités.}` },
      { type: "resultat", text: f.correct },
    ],
  };
}

// ---------- Original 8. Lecture d'un tableau de valeurs (image / antécédent) ----------
function genLectureTableauValeursOriginalQCM() {
  const xs = [-3, -2, -1, 0, 1, 2, 3];
  const a = nonZero(-3, 3);
  const b = randInt(-5, 5);
  const c = randInt(-4, 4);
  const f = (x) => a * x * x + b * x + c;
  const valeurs = xs.map((x) => f(x));
  const tableauTexte = xs.map((x, i) => `f(${x}) = ${valeurs[i]}`).join(" ; ");
  const modeAntecedent = Math.random() < 0.5;
  if (modeAntecedent) {
    const idx = randInt(0, xs.length - 1);
    const image = valeurs[idx];
    const antecedentsPossibles = xs.filter((_, i) => valeurs[i] === image);
    const xUnique = antecedentsPossibles[0];
    const wrongs = shuffle(xs.filter((x) => x !== xUnique))
      .slice(0, 3)
      .map(String);
    const options = shuffle([...new Set([String(xUnique), ...wrongs])]);
    return {
      type: "qcm",
      chapter: "Préparation EAM — Automatismes",
      prompt: `On donne le tableau de valeurs d'une fonction \\(f\\) : ${tableauTexte}. Un antécédent de ${image} par \\(f\\) est :`,
      answer: String(xUnique),
      options,
      steps: [`\\text{D'après le tableau, } f(${xUnique}) = ${image}, \\text{ donc } ${xUnique} \\text{ est un antécédent de } ${image}.`],
    };
  }
  const idx = randInt(0, xs.length - 1);
  const x0 = xs[idx];
  const image = valeurs[idx];
  const wrongs = shuffle([...new Set(valeurs.filter((v) => v !== image))])
    .slice(0, 3)
    .map(String);
  const options = shuffle([...new Set([String(image), ...wrongs])]);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `On donne le tableau de valeurs d'une fonction \\(f\\) : ${tableauTexte}. L'image de ${x0} par \\(f\\) est :`,
    answer: String(image),
    options,
    steps: [`\\text{D'après le tableau, } f(${x0}) = ${image}.`],
  };
}

// ---------- Original 9. Probabilités conditionnelles par tableau croisé ----------
function genProbaTableauCroiseOriginalNumeric() {
  const contextes = [
    { total: "clients d'un magasin", e: "acheter en ligne", f: "être fidélisé" },
    { total: "spectateurs d'un festival", e: "avoir moins de 25 ans", f: "venir en groupe" },
    { total: "salariés d'une entreprise", e: "télétravailler", f: "avoir plus de 5 ans d'ancienneté" },
  ];
  const ctx = pick(contextes);
  const eEtF = randInt(10, 40);
  const eEtNonF = randInt(10, 40);
  const nonEEtF = randInt(10, 40);
  const nonEEtNonF = randInt(10, 40);
  const totalE = eEtF + eEtNonF;
  const totalNonE = nonEEtF + nonEEtNonF;
  const totalF = eEtF + nonEEtF;
  const total = totalE + totalNonE;
  const banque = [
    { question: `Calcule la probabilité \\(P(E \\cap F)\\).`, answer: roundTo(eEtF / total, 4), steps: [`P(E \\cap F) = \\dfrac{${eEtF}}{${total}} \\approx ${fr(roundTo(eEtF / total, 4))}`] },
    { question: `Calcule la probabilité conditionnelle \\(P_E(F)\\).`, answer: roundTo(eEtF / totalE, 4), steps: [
      { type: "regle", text: `\\text{Pour une probabilité conditionnelle, on divise par l'effectif du groupe déjà connu (ici les } ${totalE} \\text{ personnes vérifiant } E\\text{), pas par l'effectif total.}` },
      { type: "resultat", text: `P_E(F) = \\dfrac{${eEtF}}{${totalE}} \\approx ${fr(roundTo(eEtF / totalE, 4))}` },
    ] },
    { question: `Calcule la probabilité \\(P(F)\\).`, answer: roundTo(totalF / total, 4), steps: [`P(F) = \\dfrac{${totalF}}{${total}} \\approx ${fr(roundTo(totalF / total, 4))}`] },
    { question: `Calcule la probabilité conditionnelle \\(P_{\\overline{E}}(F)\\).`, answer: roundTo(nonEEtF / totalNonE, 4), steps: [
      { type: "regle", text: `\\text{Sachant } \\overline{E}, \\text{ on divise par l'effectif du groupe } \\overline{E} \\text{ (ici } ${totalNonE}\\text{), pas par l'effectif total.}` },
      { type: "resultat", text: `P_{\\overline{E}}(F) = \\dfrac{${nonEEtF}}{${totalNonE}} \\approx ${fr(roundTo(nonEEtF / totalNonE, 4))}` },
    ] },
  ];
  const q = pick(banque);
  return {
    type: "numeric",
    chapter: "Préparation EAM — Probabilités",
    prompt: `Dans une enquête menée auprès de ${total} ${ctx.total}, on relève : ${eEtF} personnes qui vérifient à la fois « ${ctx.e} » (évènement \\(E\\)) et « ${ctx.f} » (évènement \\(F\\)) ; ${eEtNonF} qui vérifient « ${ctx.e} » mais pas « ${ctx.f} » ; ${nonEEtF} qui ne vérifient pas « ${ctx.e} » mais vérifient « ${ctx.f} » ; et ${nonEEtNonF} qui ne vérifient ni l'un ni l'autre. ${q.question} (arrondis au dix-millième si besoin.)`,
    answer: q.answer,
    tolerance: 0.0005,
    steps: q.steps,
  };
}

// ---------- Original 10. Probabilités conditionnelles par arbre pondéré ----------
function genProbaArbrePondereOriginalNumeric() {
  const pA = pick([0.3, 0.4, 0.45, 0.5, 0.6]);
  const pBSachantA = pick([0.1, 0.15, 0.2, 0.25]);
  const pBSachantNonA = pick([0.3, 0.35, 0.4, 0.45]);
  const pNonA = roundTo(1 - pA, 4);
  const contextes = [
    { nom: "un supermarché", a: "utiliser une carte de fidélité", b: "profiter d'une promotion" },
    { nom: "une salle de sport", a: "s'entraîner le matin", b: "prendre un coach personnel" },
    { nom: "une bibliothèque", a: "emprunter des bandes dessinées", b: "emprunter aussi un roman" },
  ];
  const ctx = pick(contextes);
  const banque = [
    { question: `Calcule \\(P(A \\cap B)\\).`, answer: roundTo(pA * pBSachantA, 4), steps: [`P(A \\cap B) = P(A) \\times P_A(B) = ${fr(pA)} \\times ${fr(pBSachantA)} = ${fr(roundTo(pA * pBSachantA, 4))}`] },
    { question: `Calcule \\(P(\\overline{A} \\cap B)\\).`, answer: roundTo(pNonA * pBSachantNonA, 4), steps: [`P(\\overline{A} \\cap B) = P(\\overline{A}) \\times P_{\\overline{A}}(B) = ${fr(pNonA)} \\times ${fr(pBSachantNonA)} = ${fr(roundTo(pNonA * pBSachantNonA, 4))}`] },
  ];
  const q = pick(banque);
  return {
    type: "numeric",
    chapter: "Préparation EAM — Probabilités",
    prompt: `Dans ${ctx.nom}, ${fr(roundTo(pA * 100, 2))} % des clients ont choisi de ${ctx.a} (évènement \\(A\\)). Parmi eux, ${fr(roundTo(pBSachantA * 100, 2))} % ont aussi choisi de ${ctx.b} (évènement \\(B\\)). Parmi les clients n'ayant pas choisi de ${ctx.a}, ${fr(roundTo(pBSachantNonA * 100, 2))} % ont choisi de ${ctx.b}. ${q.question}`,
    answer: q.answer,
    tolerance: 0.0005,
    steps: q.steps,
  };
}

// ---------- Original 11. Modélisation par une suite arithmétique ----------
function genSuiteArithmetiqueModelisationOriginalNumeric() {
  const contextes = [
    { nom: "une bibliothèque municipale", unite: "livres" },
    { nom: "une association sportive", unite: "adhérents" },
    { nom: "une entreprise", unite: "salariés" },
  ];
  const ctx = pick(contextes);
  const u0 = pick([80, 100, 150, 200, 300, 500]);
  const r = pick([10, 15, 20, 25, -10, -15, -20]);
  const banque = [
    { n: 1, question: `Calcule \\(u_1\\), le nombre de ${ctx.unite} un an après le début du suivi.` },
    { n: 2, question: `Calcule \\(u_2\\), le nombre de ${ctx.unite} deux ans après le début du suivi.` },
    { n: 5, question: `En utilisant \\(u_n = ${u0} ${signedL(r, "n")}\\), calcule \\(u_5\\).` },
  ];
  const q = pick(banque);
  const answer = u0 + q.n * r;
  return {
    type: "numeric",
    chapter: "Préparation EAM — Suites",
    prompt: `En 2025, ${ctx.nom} compte \\(u_0 = ${u0}\\) ${ctx.unite}. Chaque année, ce nombre ${r >= 0 ? "augmente" : "diminue"} de ${Math.abs(r)} : la suite \\((u_n)\\) est donc arithmétique de raison ${r}. ${q.question}`,
    answer,
    steps: [
      { type: "regle", text: `u_n = ${u0} ${signedL(r, "n")}` },
      { type: "resultat", text: `u_{${q.n}} = ${u0} ${r >= 0 ? "+" : "-"} ${Math.abs(r)} \\times ${q.n} = ${answer}` },
    ],
  };
}

// ---------- Original 12. Modélisation par une suite géométrique ----------
function genSuiteGeometriqueModelisationOriginalNumeric() {
  const contextes = [
    { nom: "une chaîne vidéo en ligne", unite: "abonnés" },
    { nom: "un capital placé", unite: "euros" },
    { nom: "une population de bactéries (en milliers)", unite: "milliers d'individus" },
  ];
  const ctx = pick(contextes);
  const v0 = pick([1000, 2000, 5000, 10000, 15000, 20000]);
  const hausse = Math.random() < 0.7;
  const p = pick([2, 3, 5, 8, 10]);
  const q = hausse ? roundTo(1 + p / 100, 3) : roundTo(1 - p / 100, 3);
  const banque = [
    { n: 1, question: `Calcule \\(v_1\\).` },
    { n: 2, question: `Calcule \\(v_2\\).` },
  ];
  const item = pick(banque);
  const answer = roundTo(v0 * q ** item.n, 2);
  return {
    type: "numeric",
    chapter: "Préparation EAM — Suites",
    prompt: `${ctx.nom} compte initialement \\(v_0 = ${v0}\\) ${ctx.unite}. Chaque année, ce nombre ${hausse ? "augmente" : "diminue"} de ${p} % : la suite \\((v_n)\\) est donc géométrique de raison ${fr(q)}. ${item.question} (arrondi au centième si besoin.)`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `v_n = v_0 \\times ${fr(q)}^n` },
      { type: "resultat", text: `v_{${item.n}} = ${v0} \\times ${fr(q)}^{${item.n}} = ${fr(answer)}` },
    ],
  };
}

// ---------- Original 13. Signe d'une dérivée factorisée et variations ----------
function genSigneDeriveeVariationsOriginalQCM() {
  const r1 = randInt(-6, 6);
  let r2 = randInt(-6, 6);
  while (r2 === r1) r2 = randInt(-6, 6);
  const petit = Math.min(r1, r2);
  const grand = Math.max(r1, r2);
  const coeffPositif = Math.random() < 0.5;
  const correctCroissant = coeffPositif ? `[${petit} ; ${grand}]` : `]-\\infty ; ${petit}] \\cup [${grand} ; +\\infty[`;
  const correctDecroissant = coeffPositif ? `]-\\infty ; ${petit}] \\cup [${grand} ; +\\infty[` : `[${petit} ; ${grand}]`;
  return {
    type: "qcm",
    chapter: "Préparation EAM — Fonctions",
    prompt: `On donne \\(f'(x) = ${coeffPositif ? "" : "-"}(x ${signedL(-r1)})(x ${signedL(-r2)})\\) pour une fonction \\(f\\) dérivable sur \\(\\mathbb{R}\\). Sur quel intervalle la fonction \\(f\\) est-elle croissante ?`,
    answer: correctCroissant,
    options: [correctCroissant, correctDecroissant, `\\mathbb{R}`, `\\{${petit} ; ${grand}\\}`],
    steps: [
      { type: "regle", text: `\\text{Les racines de } f' \\text{ sont } ${petit} \\text{ et } ${grand}.` },
      { type: "resultat", text: coeffPositif
        ? `f'(x) \\geq 0 \\text{ entre les racines : } f \\text{ est croissante sur } ${correctCroissant}.`
        : `f'(x) \\geq 0 \\text{ à l'extérieur des racines (coefficient dominant négatif) : } f \\text{ est croissante sur } ${correctCroissant}.` },
    ],
  };
}

// ============================================================================

const GENERATORS = [
  genQCMOfficielMetropole,
  genQCMOfficielAntilles,
  genQCMOfficielCentresEtrangers,
  genProbaOfficielMetropole,
  genProbaOfficielAntilles,
  genProbaOfficielCentresEtrangers,
  genSuitesOfficielMetropole,
  genSuitesOfficielAntilles,
  genSuitesOfficielCentresEtrangers,
  genFonctionOfficielCentresEtrangers,
  genPourcentageDeNombreOriginalQCM,
  genEvolutionDoubleOriginalQCM,
  genEquationAffineOriginalQCM,
  genCoefficientDirecteurOriginalQCM,
  genIdentiteRemarquableOriginalQCM,
  genMedianeSerieOriginalQCM,
  genIsolerVariableFormuleOriginalQCM,
  genLectureTableauValeursOriginalQCM,
  genProbaTableauCroiseOriginalNumeric,
  genProbaArbrePondereOriginalNumeric,
  genSuiteArithmetiqueModelisationOriginalNumeric,
  genSuiteGeometriqueModelisationOriginalNumeric,
  genSigneDeriveeVariationsOriginalQCM,
];

const DIFFICULTY = {
  genQCMOfficielMetropole: "facile",
  genQCMOfficielAntilles: "facile",
  genQCMOfficielCentresEtrangers: "facile",
  genProbaOfficielMetropole: "standard",
  genProbaOfficielAntilles: "standard",
  genProbaOfficielCentresEtrangers: "standard",
  genSuitesOfficielMetropole: "standard",
  genSuitesOfficielAntilles: "standard",
  genSuitesOfficielCentresEtrangers: "standard",
  genFonctionOfficielCentresEtrangers: "expert",
  genPourcentageDeNombreOriginalQCM: "facile",
  genEvolutionDoubleOriginalQCM: "facile",
  genEquationAffineOriginalQCM: "facile",
  genCoefficientDirecteurOriginalQCM: "facile",
  genIdentiteRemarquableOriginalQCM: "facile",
  genMedianeSerieOriginalQCM: "facile",
  genLectureTableauValeursOriginalQCM: "facile",
  genIsolerVariableFormuleOriginalQCM: "standard",
  genProbaTableauCroiseOriginalNumeric: "standard",
  genProbaArbrePondereOriginalNumeric: "standard",
  genSuiteArithmetiqueModelisationOriginalNumeric: "standard",
  genSuiteGeometriqueModelisationOriginalNumeric: "standard",
  genSigneDeriveeVariationsOriginalQCM: "expert",
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
    id: "preparation-eam-premiere-non-spe",
    title: "Préparation à l'EAM",
    description:
      "Exercices dans l'esprit de l'Épreuve Anticipée de Mathématiques (EAM) : automatismes-QCM, probabilités conditionnelles (tableau croisé, arbre pondéré), suites arithmétiques et géométriques, signe d'une dérivée. Comprend des sujets officiels de la session 2026 (source précisée : lieu, période, année) et des exercices originaux sur les mêmes compétences.",
    pourquoi:
      "Ce chapitre te met dans les conditions réelles de l'épreuve, avec des sujets et formats officiels, pour arriver serein le jour J.",
    level: "premiere-non-spe",
    order: 9,
  },
  generate,
};
