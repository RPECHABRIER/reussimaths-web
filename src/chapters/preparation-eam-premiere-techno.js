// ---------------------------------------------------------------------------
// Chapitre : Préparation à l'EAM (Première technologique)
// Construit à partir des 4 sujets réels de l'Épreuve Anticipée de
// Mathématiques (voie technologique) du 12 juin 2026 (Métropole,
// Antilles-Guyane, Centres étrangers, Polynésie) : les questions directement
// extraites d'un sujet officiel le précisent via le champ `chapter` (lieu,
// période, année). Des exercices originaux, construits sur les mêmes
// compétences, viennent enrichir la banque (aucune mention de sujet réel
// dans leur cas).
//
// Les 4 sujets réels ont été rédigés sur l'ancien programme technologique ;
// ils restent presque intégralement compatibles avec le nouveau programme
// 2026 (aucune notion de discriminant utilisée, uniquement des formes
// factorisées / lectures graphiques / suites / probabilités conditionnelles
// déjà couvertes par le nouveau programme). Quand une question sortait du
// cadre (ex: signe d'une fonction générique non factorisée), elle a été
// adaptée ou écartée.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const fr = (n) => String(n).replace(".", ",");

// =========================== QCM officiels — Automatismes ===========================

// ---------- 1. QCM Automatismes — Métropole, 12 juin 2026 ----------
const QCM_METROPOLE = [
  { prompt: `Un lycée compte 500 élèves. 20 % des élèves sont externes. Le nombre d'externes est :`, answer: "100", options: ["10", "20", "100", "520"], explication: "20 % de 500 = 0,20 × 500 = 100." },
  { prompt: `Un lycée compte 500 élèves. L'effectif augmente de 5 % l'année suivante. Le nombre d'élèves est donc multiplié par :`, answer: "1,05", options: ["5", "1,05", "0,05", "25"], explication: "Une hausse de 5 % correspond à un coefficient multiplicateur de 1 + 5/100 = 1,05." },
  { prompt: `\\(4 \\times \\dfrac{2}{3} = \\)`, answer: "8/3", options: ["8/3", "8/12", "24/3", "24/9"], explication: "4 × 2/3 = (4×2)/3 = 8/3 (on multiplie le numérateur, le dénominateur ne change pas)." },
  { prompt: `Quelle équation admet deux solutions réelles ?`, answer: "x² = 4", options: ["2x = −1", "x² = −1", "x² = 4", "x/2 = 4"], explication: "x² = 4 a deux solutions, 2 et −2. Un carré est toujours positif ou nul, donc x² = −1 n'a aucune solution réelle. Les deux autres équations sont du premier degré : elles n'ont qu'une seule solution." },
  { prompt: `On considère la fonction f définie sur ℝ par \\(f(x) = x(3x-6)\\). L'image de \\(-2\\) par cette fonction est :`, answer: "24", options: ["−14", "−24", "24", "−48"], explication: "f(−2) = −2 × (3×(−2)−6) = −2 × (−12) = 24." },
  { prompt: `On considère la fonction f définie sur ℝ par \\(f(x) = x(3x-6)\\). Le nombre 0 admet :`, answer: "Deux antécédents : 0 et 2", options: ["Deux antécédents : 0 et 2", "Un seul antécédent : 0", "Un seul antécédent : −18", "Deux antécédents : 0 et −2"], explication: "f(x) = 0 ⇔ x = 0 ou 3x−6 = 0 (produit nul) ⇔ x = 0 ou x = 2. Il y a donc deux antécédents." },
  { prompt: `Une course automobile consiste à parcourir 20 tours d'une piste de 4 500 mètres. La distance totale de la course est :`, answer: "90 km", options: ["9 000 m", "9 km", "90 km", "45 km"], explication: "20 × 4 500 = 90 000 m = 90 km." },
  { prompt: `Un élève a obtenu la note de 10/20 à un devoir coefficienté 2 et la note de 16/20 à un devoir coefficienté 1. La moyenne de l'élève est :`, answer: "12", options: ["11", "12", "13", "14"], explication: "Moyenne pondérée = (10×2 + 16×1)/(2+1) = 36/3 = 12." },
  { prompt: `Un tableau croisé donne, sur 250 clients ayant acheté un aspirateur : 90 aspirateurs sans fil dont 20 avec sac. On interroge au hasard un client parmi ceux qui ont acheté un aspirateur sans fil. La probabilité que ce client ait acheté un aspirateur avec sac est :`, answer: "20/90", options: ["20/70", "20/90", "20/250", "20/122"], explication: "On se restreint aux clients ayant acheté un aspirateur sans fil : le dénominateur est 90 (et non 250), et parmi eux 20 ont un sac." },
];

function genQCMOfficielMetropole() {
  const q = pick(QCM_METROPOLE);
  const options = shuffle(q.options);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Sujet officiel (Métropole, 12 juin 2026)",
    prompt: q.prompt,
    answer: q.answer,
    options,
    steps: [{ type: "regle", text: q.explication }],
  };
}

// ---------- 2. QCM Automatismes — Antilles-Guyane, 12 juin 2026 ----------
const QCM_ANTILLES = [
  { prompt: `Un objet coûtait 100 €. Après une remise, il coûte 80 €. Quel était le pourcentage de cette remise ?`, answer: "20 %", options: ["0,2 %", "20 %", "0,8 %", "80 %"], explication: "La remise est de 100 − 80 = 20 €, soit 20/100 = 20 % du prix initial." },
  { prompt: `Dans une salle de cinéma, 60 % des personnes ont moins de 25 ans, dont 10 % sont mineurs. Quelle est la proportion de mineurs dans la salle ?`, answer: "0,06", options: ["0,1", "0,5", "0,06", "0,6"], explication: "Les mineurs sont 10 % des 60 % de moins de 25 ans : 0,10 × 0,60 = 0,06, soit 6 % de la salle." },
  { prompt: `Un prix augmente de 10 % puis diminue de 20 %. Quelle est l'évolution globale de ce prix ?`, answer: "Baisse de 12 %", options: ["Baisse de 10 %", "Baisse de 12 %", "Hausse de 10 %", "Baisse de 88 %"], explication: "On multiplie les coefficients successifs : 1,10 × 0,80 = 0,88, soit une baisse globale de 12 % (et non 10 %, car les évolutions successives ne s'additionnent pas)." },
  { prompt: `On utilise la formule \\(F = 1{,}8C + 32\\) pour convertir des degrés Celsius en Fahrenheit. Sachant que l'eau bout à 100 °C, la température d'ébullition de l'eau en °F est :`, answer: "212 °F", options: ["33,8 °F", "50 °F", "100 °F", "212 °F"], explication: "F = 1,8 × 100 + 32 = 180 + 32 = 212." },
  { prompt: `La formule permettant de transformer des °F en °C (à partir de \\(F = 1{,}8C+32\\)) est donc :`, answer: "C = (F−32)/1,8", options: ["C = F/1,8 − 32", "C = (F−32)/1,8", "C = (F−1,8)/32", "C = F/32 − 1,8"], explication: "On isole C : F = 1,8C + 32 ⟹ F − 32 = 1,8C ⟹ C = (F−32)/1,8." },
  { prompt: `On considère \\(A = \\dfrac{5/3}{15}\\). A est égal à :`, answer: "1/9", options: ["1/9", "25", "1/45", "5"], explication: "Diviser par 15 revient à multiplier par 1/15 : A = (5/3) × (1/15) = 5/45 = 1/9." },
  { prompt: `Dans un repère, on considère les points E(20 ; 25) et F(5 ; 15). Le coefficient directeur de la droite (EF) est égal à :`, answer: "2/3", options: ["2", "3/2", "2/3", "1/2"], explication: "Coefficient directeur = (y_F − y_E)/(x_F − x_E) = (15−25)/(5−20) = (−10)/(−15) = 2/3." },
  { prompt: `Les paramètres d'une série de notes sur 20 sont : minimum 2, premier quartile 5, médiane 10, troisième quartile 12, maximum 17. La proportion d'élèves ayant une note inférieure ou égale à 12 est :`, answer: "supérieure ou égale à 75 %", options: ["inférieure ou égale à 25 %", "égale à 50 %", "supérieure ou égale à 75 %", "égale à 100 %"], explication: "12 est le troisième quartile : par définition, au moins 75 % des valeurs de la série lui sont inférieures ou égales." },
  { prompt: `Une enquête auprès de 800 élèves donne : 200 garçons ne pratiquant aucune activité sportive, sur 500 garçons au total. On choisit au hasard un élève parmi les garçons. La probabilité qu'il ne pratique aucune activité sportive est :`, answer: "200/500", options: ["200/290", "200/800", "290/800", "200/500"], explication: "On se restreint aux garçons : le dénominateur est 500 (et non 800), et parmi eux 200 ne pratiquent aucun sport." },
];

function genQCMOfficielAntilles() {
  const q = pick(QCM_ANTILLES);
  const options = shuffle(q.options);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Sujet officiel (Antilles-Guyane, 12 juin 2026)",
    prompt: q.prompt,
    answer: q.answer,
    options,
    steps: [{ type: "regle", text: q.explication }],
  };
}

// ---------- 3. QCM Automatismes — Centres étrangers, 8 juin 2026 ----------
const QCM_CENTRES_ETRANGERS = [
  { prompt: `\\(5 - \\dfrac{3}{2} = \\)`, answer: "7/2", options: ["1", "7/2", "4", "−5/2"], explication: "5 − 3/2 = 10/2 − 3/2 = 7/2 (on met 5 au même dénominateur que 3/2)." },
  { prompt: `Un téléphone coûte 990 euros. Le prix baisse de 20 %. Son nouveau prix est :`, answer: "990 × 0,8", options: ["990 × 0,2", "990 × (1 + 20/100)", "990 × (−20/100)", "990 × 0,8"], explication: "Une baisse de 20 % correspond à un coefficient multiplicateur de 1 − 20/100 = 0,8." },
  { prompt: `On considère un dé truqué tel que la probabilité d'obtenir un 5 et celle d'obtenir un 6 sont chacune égales à 0,3. La probabilité d'obtenir un nombre supérieur ou égal à 5 est :`, answer: "0,6", options: ["2/6", "1/6", "0,6", "0,3"], explication: "Obtenir 5 ou 6 sont deux événements incompatibles : on additionne leurs probabilités, 0,3 + 0,3 = 0,6." },
  { prompt: `Les solutions de l'équation \\((x-2)(2x+1) = 0\\) sont :`, answer: "2 et −1/2", options: ["2 et −1/2", "−2 et 1", "2 et 1/2", "2 et −1"], explication: "Un produit de facteurs est nul si l'un des facteurs est nul : x−2=0 ⟹ x=2, ou 2x+1=0 ⟹ x=−1/2." },
  { prompt: `Notes obtenues dans une classe : 7 (×5 élèves), 10 (×7), 12 (×8), 14 (×10). La note médiane de ce contrôle est :`, answer: "12", options: ["12", "11", "11,37", "7,5"], explication: "Il y a 5+7+8+10 = 30 élèves. La médiane se situe entre la 15e et la 16e valeur classées par ordre croissant ; les 12 premières valeurs sont 7 ou 10 (12 élèves), les suivantes valent 12 : la 15e et la 16e valent donc 12." },
  { prompt: `Dans le lycée Alpha, il y a 500 élèves. 150 lycéens pratiquent un sport. Le pourcentage d'élèves pratiquant un sport est égal à :`, answer: "30 %", options: ["15 %", "35 %", "30 %", "65 %"], explication: "150/500 = 0,30 = 30 %." },
];

function genQCMOfficielCentresEtrangers() {
  const q = pick(QCM_CENTRES_ETRANGERS);
  const options = shuffle(q.options);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Sujet officiel (Centres étrangers, 8 juin 2026)",
    prompt: q.prompt,
    answer: q.answer,
    options,
    steps: [{ type: "regle", text: q.explication }],
  };
}

// ---------- 4. QCM Automatismes — Polynésie, 12 juin 2026 ----------
const QCM_POLYNESIE = [
  { prompt: `Le nombre \\((5^3)^2\\) est égal à :`, answer: "5⁶", options: ["5⁵", "5⁶", "5⁹", "5¹"], explication: "Pour une puissance de puissance, les exposants se multiplient : (5³)² = 5^(3×2) = 5⁶." },
  { prompt: `Pour calculer le prix d'un produit après une hausse de 25 %, en une seule opération, il faut multiplier le prix initial par :`, answer: "1,25", options: ["0,25", "0,75", "1,25", "1,75"], explication: "Une hausse de 25 % correspond à un coefficient multiplicateur de 1 + 25/100 = 1,25." },
  { prompt: `Dans un lycée, les adhérents de l'association sportive représentent un quart des élèves. Quelle est la proportion d'élèves qui ne sont pas adhérents ?`, answer: "75 %", options: ["25 %", "75 %", "40 %", "60 %"], explication: "Un quart, soit 25 %, sont adhérents ; les 100 % − 25 % = 75 % restants ne le sont pas." },
  { prompt: `Le nombre \\((1 + \\dfrac{1}{2}) \\times \\dfrac{2}{3}\\) est égal à :`, answer: "1", options: ["1", "2", "3", "4"], explication: "1 + 1/2 = 3/2, puis (3/2) × (2/3) = 6/6 = 1." },
  { prompt: `L'expression \\((2x+3)^2\\) est égale à :`, answer: "4x² + 12x + 9", options: ["2x² + 9", "4x² + 12x + 9", "4x² + 9", "2x² + 12x + 9"], explication: "On utilise l'identité remarquable (a+b)² = a² + 2ab + b² avec a=2x et b=3 : (2x)² + 2×2x×3 + 3² = 4x² + 12x + 9." },
  { prompt: `On lance un dé équilibré à 6 faces. Quelle est la probabilité d'obtenir un numéro inférieur ou égal à 2 ?`, answer: "1/3", options: ["1/6", "2/3", "1/2", "1/3"], explication: "Deux issues favorables (1 et 2) sur 6 possibles : P = 2/6 = 1/3." },
];

function genQCMOfficielPolynesie() {
  const q = pick(QCM_POLYNESIE);
  const options = shuffle(q.options);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Sujet officiel (Polynésie, 12 juin 2026)",
    prompt: q.prompt,
    answer: q.answer,
    options,
    steps: [{ type: "regle", text: q.explication }],
  };
}

// =========================== Officiels — Lecture graphique (droites) ===========================

function genLectureDroiteOfficielMetropole() {
  return {
    type: "qcm",
    chapter: "Préparation EAM — Sujet officiel (Métropole, 12 juin 2026)",
    prompt: `On donne ci-dessous une droite passant par le point \\((0 ; 3)\\) et le point \\((2 ; -1)\\). L'équation réduite de cette droite est :`,
    answer: "y = −2x + 3",
    options: shuffle(["y = −0,5x + 1,5", "y = −2x + 1,5", "y = 2x + 3", "y = −2x + 3"]),
    steps: [
      { type: "regle", text: `\\text{Ordonnée à l'origine : } 3. \\text{ Coefficient directeur : } \\dfrac{-1-3}{2-0} = -2.` },
      { type: "resultat", text: `y = -2x + 3` },
    ],
    graph: { xMin: -1.5, xMax: 3.5, yMin: -2, yMax: 4.5, lines: [{ a: -2, b: 3 }], points: [{ x: 0, y: 3, label: "" }, { x: 2, y: -1, label: "" }] },
  };
}

function genLectureDroiteOfficielAntilles() {
  return {
    type: "qcm",
    chapter: "Préparation EAM — Sujet officiel (Antilles-Guyane, 12 juin 2026)",
    prompt: `Dans le repère ci-dessous, on a représenté une droite (d) passant par \\((0 ; 2)\\) avec un coefficient directeur négatif, s'annulant en \\(x = 4\\). L'équation réduite de cette droite est :`,
    answer: "y = −0,5x + 2",
    options: shuffle(["y = −0,5x + 4", "y = −0,5x + 2", "y = −2x + 4", "y = −2x + 2"]),
    steps: [
      { type: "regle", text: `\\text{Ordonnée à l'origine : } 2. \\text{ La droite s'annule en } x=4, \\text{ donc } a = \\dfrac{-2}{4} = -0{,}5.` },
      { type: "resultat", text: `y = -0{,}5x + 2` },
    ],
    graph: { xMin: -1, xMax: 6, yMin: -1, yMax: 3.5, lines: [{ a: -0.5, b: 2 }] },
  };
}

function genLectureDroiteOfficielPolynesie() {
  return {
    type: "qcm",
    chapter: "Préparation EAM — Sujet officiel (Polynésie, 12 juin 2026)",
    prompt: `Dans un repère, on a tracé la droite passant par l'origine \\((0 ; 0)\\) et par le point \\((2 ; 6)\\). Une équation de cette droite est :`,
    answer: "y = 3x",
    options: shuffle(["y = 2x + 6", "y = 6x + 2", "y = 3x", "y = x"]),
    steps: [
      { type: "regle", text: `\\text{La droite passe par l'origine, donc } y = ax. \\text{ Avec } (2;6) : a = \\dfrac{6}{2} = 3.` },
      { type: "resultat", text: `y = 3x` },
    ],
    graph: { xMin: -1.5, xMax: 3.5, yMin: -3, yMax: 9, lines: [{ a: 3, b: 0 }], points: [{ x: 2, y: 6, label: "" }] },
  };
}

// =========================== Officiels — Suites ===========================

function genSuitesOfficielMetropole() {
  const q = pick([
    { type: "numeric", prompt: `Un abonnement coûte 250 € en 2026, puis augmente de 30 € par an. On note \\(a_n\\) le montant en \\(2026+n\\), avec \\(a_0 = 250\\). Calcule \\(a_2\\).`, answer: 310, steps: [{ type: "regle", text: "Un accroissement constant chaque année (+30 €) se traduit par \\(a_n = a_0 + n \\times 30\\)." }, { type: "resultat", text: `a_2 = 250 + 2 \\times 30 = 310` }] },
    { type: "numeric", prompt: `Un autre abonnement coûte 200 € en 2026, puis augmente de 10 % par an. On note \\(b_n\\) le montant en \\(2026+n\\), avec \\(b_0 = 200\\). Calcule \\(b_1\\), le montant en 2027.`, answer: 220, steps: [{ type: "regle", text: "Une hausse de 10 % chaque année correspond à un coefficient multiplicateur de 1,1 : \\(b_{n+1} = b_n \\times 1{,}1\\)." }, { type: "resultat", text: `b_1 = 200 \\times 1{,}1 = 220` }] },
    { type: "qcm", prompt: `La suite \\((a_n)\\), qui modélise un abonnement à 250 € augmentant de 30 € chaque année, est :`, answer: "arithmétique de raison 30", options: ["arithmétique de raison 30", "géométrique de raison 1,3", "arithmétique de raison 250"], steps: [{ type: "regle", text: `\\text{Accroissement constant (+30 € par an)} \\Rightarrow \\text{suite arithmétique de raison 30.}` }] },
    { type: "qcm", prompt: `La suite \\((b_n)\\), qui modélise un abonnement à 200 € augmentant de 10 % chaque année, est :`, answer: "géométrique de raison 1,1", options: ["arithmétique de raison 10", "géométrique de raison 1,1", "géométrique de raison 0,1"], steps: [{ type: "regle", text: `\\text{Taux d'évolution constant (+10 % par an)} \\Rightarrow \\text{suite géométrique de raison } 1{,}1.` }] },
  ]);
  const base = {
    chapter: "Préparation EAM — Sujet officiel (Métropole, 12 juin 2026)",
    prompt: q.prompt,
    steps: q.steps,
  };
  return q.type === "numeric" ? { ...base, type: "numeric", answer: q.answer } : { ...base, type: "qcm", answer: q.answer, options: shuffle(q.options) };
}

function genSuitesOfficielAntilles() {
  const q = pick([
    { type: "numeric", prompt: `Une installation d'éoliennes produit \\(u_0 = 3000\\) kWh en 2025, puis la production baisse de 5 % chaque année. Calcule \\(u_1\\), la production en 2026.`, answer: 2850, steps: [{ type: "regle", text: "Une baisse de 5 % chaque année correspond à un coefficient multiplicateur de 1 − 5/100 = 0,95." }, { type: "resultat", text: `u_1 = 3000 \\times 0{,}95 = 2850` }] },
    { type: "qcm", prompt: `Avec \\(u_{n+1} = 0{,}95 \\times u_n\\), la suite \\((u_n)\\) est :`, answer: "géométrique de raison 0,95", options: ["arithmétique de raison 0,95", "géométrique de raison 0,95", "géométrique de raison −0,05"], steps: [{ type: "regle", text: `u_{n+1} = 0{,}95 \\times u_n \\Rightarrow \\text{suite géométrique de raison } 0{,}95.` }] },
    { type: "qcm", prompt: `Sur un tableur, on a calculé les 30 premiers termes de \\((u_n)\\) (production décroissante par un facteur constant chaque année, à partir de 3000). Deux graphiques sont proposés : l'un montre des points qui se rapprochent de plus en plus lentement de 0 (la baisse ralentit), l'autre montre des points alignés qui continueraient de baisser jusqu'à devenir négatifs. Lequel représente \\((u_n)\\), une suite géométrique de raison 0,95 ?`, answer: "Celui où la baisse ralentit progressivement (les points se rapprochent de 0 sans jamais devenir négatifs)", options: ["Celui où la baisse ralentit progressivement (les points se rapprochent de 0 sans jamais devenir négatifs)", "Celui où les points sont alignés et continueraient de baisser en dessous de 0"], steps: [{ type: "regle", text: `\\text{Une suite géométrique de raison } 0{,}95 \\text{ (termes positifs) décroît en ralentissant, sans jamais devenir négative.}` }] },
  ]);
  const base = { chapter: "Préparation EAM — Sujet officiel (Antilles-Guyane, 12 juin 2026)", prompt: q.prompt, steps: q.steps };
  return q.type === "numeric" ? { ...base, type: "numeric", answer: q.answer } : { ...base, type: "qcm", answer: q.answer, options: shuffle(q.options) };
}

function genSuitesOfficielPolynesie() {
  const q = pick([
    { type: "numeric", prompt: `Un emprunt est remboursé par la Formule 1 : premier versement 1 025 €, puis chaque versement suivant augmente de 400 € par rapport au précédent. On note \\(u_n\\) le versement de l'année \\(2025+n\\), avec \\(u_0 = 1025\\). Calcule \\(u_1\\).`, answer: 1425, steps: [{ type: "regle", text: "Un accroissement constant d'un versement à l'autre (+400 €) se traduit par \\(u_{n+1} = u_n + 400\\)." }, { type: "resultat", text: `u_1 = 1025 + 400 = 1425` }] },
    { type: "qcm", prompt: `La suite \\((u_n)\\) de la Formule 1 (versement augmentant de 400 € chaque année) est :`, answer: "arithmétique de raison 400", options: ["arithmétique de raison 400", "géométrique de raison 400", "arithmétique de raison 1025"], steps: [{ type: "regle", text: `\\text{Accroissement constant (+400 € par an)} \\Rightarrow \\text{suite arithmétique de raison 400.}` }] },
    { type: "numeric", prompt: `Formule 2 : premier versement 1 550 €, puis chaque versement suivant augmente de 10 % par rapport au précédent. Calcule \\(v_1\\), le versement de la deuxième année.`, answer: 1705, steps: [{ type: "regle", text: "Une hausse de 10 % d'un versement à l'autre correspond à un coefficient multiplicateur de 1,1 : \\(v_{n+1} = v_n \\times 1{,}1\\)." }, { type: "resultat", text: `v_1 = 1550 \\times 1{,}1 = 1705` }] },
    { type: "qcm", prompt: `La suite \\((v_n)\\) de la Formule 2 (versement augmentant de 10 % chaque année) est :`, answer: "géométrique de raison 1,1", options: ["arithmétique de raison 10", "géométrique de raison 1,1", "géométrique de raison 0,1"], steps: [{ type: "regle", text: `\\text{Taux d'évolution constant (+10 % par an)} \\Rightarrow \\text{suite géométrique de raison } 1{,}1.` }] },
  ]);
  const base = { chapter: "Préparation EAM — Sujet officiel (Polynésie, 12 juin 2026)", prompt: q.prompt, steps: q.steps };
  return q.type === "numeric" ? { ...base, type: "numeric", answer: q.answer } : { ...base, type: "qcm", answer: q.answer, options: shuffle(q.options) };
}

// =========================== Officiels — Fonctions et dérivation ===========================

function genFonctionOfficielMetropole() {
  const fn = (x) => -x * x + 2 * x + 3;
  const q = pick([
    { type: "numeric", prompt: `On donne \\(f(x) = -x^2 + 2x + 3\\) sur \\([-3;4]\\). Calcule \\(f(-2)\\).`, answer: -5, steps: [{ type: "calcul", text: `f(-2) = -(-2)^2 + 2 \\times (-2) + 3 = -4 -4 +3` }, { type: "resultat", text: `f(-2) = -5` }] },
    { type: "numeric", prompt: `On donne \\(f(x) = -x^2 + 2x + 3\\) sur \\([-3;4]\\). Calcule \\(f(1)\\).`, answer: 4, steps: [{ type: "calcul", text: `f(1) = -1 + 2 + 3` }, { type: "resultat", text: `f(1) = 4` }] },
    { type: "qcm", prompt: `On donne \\(f(x) = -x^2+2x+3 = (x+1)(-x+3)\\) sur \\([-3;4]\\). Résous \\(f(x) = 0\\) : quelle est la plus petite solution ?`, answer: "−1", options: ["−1", "3", "0", "1"], steps: [{ type: "regle", text: `\\text{Un produit de facteurs est nul si l'un d'eux est nul : } x+1=0 \\Rightarrow x=-1\\text{, ou } -x+3=0 \\Rightarrow x=3. \\text{ La plus petite est } -1.` }] },
    { type: "qcm", prompt: `On donne \\(f'(x) = -2x + 2\\), dérivée de \\(f(x) = -x^2+2x+3\\). Sur quel intervalle \\(f\\) est-elle croissante ?`, answer: "]−∞ ; 1]", options: ["]−∞ ; 1]", "[1 ; +∞[", "ℝ tout entier"], steps: [{ type: "regle", text: `\\text{f est croissante là où } f'(x) \\geqslant 0 : -2x+2 \\geqslant 0 \\Leftrightarrow x \\leqslant 1.` }] },
  ]);
  const base = {
    chapter: "Préparation EAM — Sujet officiel (Métropole, 12 juin 2026)",
    prompt: q.prompt,
    steps: q.steps,
    graph: { xMin: -3.5, xMax: 4.5, yMin: -6, yMax: 5, curves: [{ fn, label: "f" }] },
  };
  return q.type === "numeric" ? { ...base, type: "numeric", answer: q.answer } : { ...base, type: "qcm", answer: q.answer, options: shuffle(q.options) };
}

function genFonctionOfficielCentresEtrangers() {
  const fn = (x) => -(x ** 3) + 9 * x * x - 24 * x + 16;
  const q = pick([
    { type: "numeric", prompt: `On donne \\(f(x) = -x^3+9x^2-24x+16\\) sur \\([0;4]\\). Calcule \\(f(0)\\).`, answer: 16, steps: [{ type: "resultat", text: `f(0) = 16 \\text{ (seul le terme constant subsiste quand } x=0\\text{)}` }] },
    { type: "qcm", prompt: `On donne \\(f(x) = -x^3+9x^2-24x+16\\), de dérivée \\(f'(x) = -3x^2+18x-24 = -3(x-2)(x-4)\\). Quel est le signe de \\(f'\\) sur \\([2;4]\\) ?`, answer: "f'(x) ⩾ 0 sur [2;4]", options: ["f'(x) ⩾ 0 sur [2;4]", "f'(x) ⩽ 0 sur [2;4]", "f' change de signe deux fois sur [2;4]"], steps: [{ type: "regle", text: `\\text{Entre les racines 2 et 4, } -3(x-2)(x-4) \\text{ est du signe opposé à } -3\\text{, donc positif.}` }] },
    { type: "qcm", prompt: `\\(f(x) = -x^3+9x^2-24x+16\\) sur \\([0;4]\\), avec \\(f'(x) = -3(x-2)(x-4)\\). En quelle valeur \\(f\\) atteint-elle son minimum sur \\([0;4]\\) ?`, answer: "En x = 2", options: ["En x = 0", "En x = 2", "En x = 4"], steps: [{ type: "regle", text: `f' \\text{ s'annule et change de signe (négatif puis positif) en } x=2 : \\text{minimum local en } x=2.` }] },
  ]);
  const base = {
    chapter: "Préparation EAM — Sujet officiel (Centres étrangers, 8 juin 2026)",
    prompt: q.prompt,
    steps: q.steps,
    graph: { xMin: -0.5, xMax: 4.5, yMin: Math.min(...[0, 1, 2, 3, 4].map(fn)) - 1, yMax: Math.max(...[0, 1, 2, 3, 4].map(fn)) + 1, curves: [{ fn, label: "f" }] },
  };
  return q.type === "numeric" ? { ...base, type: "numeric", answer: q.answer } : { ...base, type: "qcm", answer: q.answer, options: shuffle(q.options) };
}

function genFonctionOfficielPolynesie() {
  const fn = (x) => -0.5 * x * x + x + 7.5;
  const q = pick([
    { type: "numeric", prompt: `On donne \\(f(x) = -0{,}5x^2+x+7{,}5 = (0{,}5x+1{,}5)(-x+5)\\) sur \\([-4;6]\\). Calcule \\(f(3)\\).`, answer: 6, steps: [{ type: "calcul", text: `f(3) = -0{,}5 \\times 9 + 3 + 7{,}5 = -4{,}5+3+7{,}5` }, { type: "resultat", text: `f(3) = 6` }] },
    { type: "numeric", prompt: `La tangente à la courbe de \\(f(x) = -0{,}5x^2+x+7{,}5\\) au point d'abscisse 3 passe par les points \\((3;6)\\) et \\((4;4)\\). Détermine le nombre dérivé \\(f'(3)\\), coefficient directeur de cette tangente.`, answer: -2, steps: [{ type: "regle", text: "Le nombre dérivé f'(3) est le coefficient directeur de la tangente en ce point ; il se calcule avec deux points connus de cette droite." }, { type: "resultat", text: `f'(3) = \\dfrac{4-6}{4-3} = -2` }] },
    { type: "qcm", prompt: `\\(f(x) = (0{,}5x+1{,}5)(-x+5)\\) sur \\([-4;6]\\). Les solutions de l'inéquation \\(f(x) \\leqslant 0\\) forment :`, answer: "]−4 ; −3] ∪ [5 ; 6]", options: ["]−4 ; −3] ∪ [5 ; 6]", "[−3 ; 5]", "]−∞ ; −3] ∪ [5 ; +∞["], steps: [{ type: "regle", text: `\\text{Les racines sont } -3 \\text{ et } 5. \\text{ Comme } a=-0{,}5<0\\text{, } f \\text{ est négative à l'extérieur des racines, sur } [-4;6].` }] },
  ]);
  const base = {
    chapter: "Préparation EAM — Sujet officiel (Polynésie, 12 juin 2026)",
    prompt: q.prompt,
    steps: q.steps,
    graph: { xMin: -4.5, xMax: 6.5, yMin: -3, yMax: 9, curves: [{ fn, label: "f" }] },
  };
  return q.type === "numeric" ? { ...base, type: "numeric", answer: q.answer } : { ...base, type: "qcm", answer: q.answer, options: shuffle(q.options) };
}

// =========================== Officiels — Probabilités ===========================

function genProbaOfficielAntilles() {
  const q = pick([
    { type: "numeric", prompt: `Une étude sur 100 locataires HLM donne : 35 personnes sans enfant et ne vivant pas en couple. Calcule la probabilité que la personne interrogée soit sans enfant et ne vivant pas en couple.`, answer: 0.35, steps: [{ type: "resultat", text: `P = \\dfrac{35}{100} = 0{,}35` }] },
    { type: "numeric", prompt: `Dans la même étude, 18 personnes vivent en couple et ont au moins un enfant, sur 100 personnes. Calcule \\(P(C \\cap E)\\).`, answer: 0.18, steps: [{ type: "resultat", text: `P(C \\cap E) = \\dfrac{18}{100} = 0{,}18` }] },
    { type: "numeric", prompt: `Parmi les 53 personnes ayant au moins un enfant, 35 ne vivent pas en couple. Calcule la probabilité que la personne interrogée ne vive pas en couple sachant qu'elle a au moins un enfant.`, answer: roundTo(35 / 53, 4), tolerance: 0.001, steps: [{ type: "regle", text: "Une probabilité conditionnelle « sachant que » restreint le dénominateur au groupe donné (ici les 53 personnes avec au moins un enfant), et non à l'effectif total." }, { type: "resultat", text: `P_E(\\overline{C}) = \\dfrac{35}{53} \\approx ${fr(roundTo(35 / 53, 4))}` }] },
    { type: "numeric", prompt: `Une variable aléatoire X (nombre de pièces d'un logement) suit : \\(P(X=1)=0{,}07\\), \\(P(X=2)=0{,}2\\), \\(P(X=3)=0{,}4\\), \\(P(X=4)=0{,}25\\), \\(P(X=5)=0{,}08\\). Calcule \\(P(X \\geqslant 2)\\).`, answer: 0.93, tolerance: 0.001, steps: [{ type: "regle", text: "L'événement contraire de « X ⩾ 2 » est « X = 1 » : P(X⩾2) = 1 − P(X=1)." }, { type: "resultat", text: `P(X \\geqslant 2) = 1 - 0{,}07 = 0{,}93` }] },
    { type: "numeric", prompt: `Avec la loi de \\(X\\) précédente, vérifie que \\(E(X) = 3{,}07\\) en calculant \\(1 \\times 0{,}07 + 2 \\times 0{,}2 + 3 \\times 0{,}4 + 4 \\times 0{,}25 + 5 \\times 0{,}08\\).`, answer: 3.07, tolerance: 0.005, steps: [{ type: "calcul", text: `0{,}07+0{,}4+1{,}2+1+0{,}4` }, { type: "resultat", text: `E(X) = 3{,}07` }] },
  ]);
  return { type: "numeric", chapter: "Préparation EAM — Sujet officiel (Antilles-Guyane, 12 juin 2026)", prompt: q.prompt, answer: q.answer, tolerance: q.tolerance, steps: q.steps };
}

function genProbaOfficielPolynesie() {
  const q = pick([
    { prompt: `Un tableau croisé (200 clients d'un marchand de glaces) donne 28 sorbets sur 200. Donne la probabilité que le client interrogé ait choisi un sorbet (sous forme de fraction non simplifiée).`, answer: "28/200", explication: "On lit directement dans le tableau : 28 clients sur les 200 ont choisi un sorbet, d'où la probabilité 28/200 (le dénominateur est l'effectif total)." },
    { prompt: `Sur 200 clients, 12 ont choisi un sorbet dans un pot. Donne la probabilité que le client interrogé ait choisi un sorbet dans un pot.`, answer: "12/200", explication: "12 clients sur les 200 au total ont choisi un sorbet dans un pot, d'où la probabilité 12/200." },
    { prompt: `Sur 160 clients ayant choisi un cornet, 64 ont choisi une glace au lait. Sachant que le client a choisi un cornet, quelle est la probabilité qu'il ait choisi une glace au lait ?`, answer: "64/160", explication: "« Sachant que » restreint le dénominateur au groupe donné : ici les 160 clients ayant choisi un cornet, parmi lesquels 64 ont pris une glace au lait." },
    { prompt: `Sur 104 clients ayant choisi une crème glacée, 24 l'ont choisie dans un pot. Sachant que le client a choisi une crème glacée, quelle est la probabilité qu'il ait choisi un pot ?`, answer: "24/104", explication: "« Sachant que » restreint le dénominateur au groupe donné : ici les 104 clients ayant choisi une crème glacée, parmi lesquels 24 l'ont choisie dans un pot." },
  ]);
  return { type: "text", chapter: "Préparation EAM — Sujet officiel (Polynésie, 12 juin 2026)", prompt: q.prompt, answer: q.answer, steps: [{ type: "regle", text: q.explication }] };
}

// =========================== Originaux — Automatismes ===========================

function genPourcentageRemiseOriginalQCM() {
  const prixInitial = pick([50, 80, 100, 120, 150, 200]);
  const remise = pick([10, 15, 20, 25, 30]);
  const prixFinal = roundTo(prixInitial * (1 - remise / 100), 2);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `Un article coûtait ${prixInitial} €. Après une remise, il coûte ${fr(prixFinal)} €. Quel était le pourcentage de cette remise ?`,
    answer: `${remise} %`,
    options: shuffle([`${remise} %`, `${roundTo(remise / 10, 2)} %`, `${100 - remise} %`]),
    steps: [
      { type: "calcul", text: `\\text{Remise} = \\dfrac{${prixInitial} - ${fr(prixFinal)}}{${prixInitial}} \\times 100` },
      { type: "resultat", text: `\\text{Remise} = ${remise} \\%` },
    ],
  };
}

function genEvolutionSuccessiveOriginalQCM() {
  const p1 = pick([10, 15, 20, 25]);
  const p2 = pick([10, 15, 20]);
  const augmenteAugmente = Math.random() < 0.5;
  const coeff = augmenteAugmente ? (1 + p1 / 100) * (1 + p2 / 100) : (1 + p1 / 100) * (1 - p2 / 100);
  const evolutionGlobale = roundTo((coeff - 1) * 100, 2);
  const answer = evolutionGlobale >= 0 ? `Hausse de ${fr(evolutionGlobale)} %` : `Baisse de ${fr(Math.abs(evolutionGlobale))} %`;
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `Un prix augmente de ${p1} % puis ${augmenteAugmente ? "augmente" : "diminue"} de ${p2} %. Quelle est l'évolution globale de ce prix ?`,
    answer,
    options: shuffle([answer, `Hausse de ${p1 + p2} %`, `Baisse de ${p1 + p2} %`]),
    steps: [
      { type: "regle", text: "Pour deux évolutions successives, on multiplie les coefficients multiplicateurs (les pourcentages ne s'additionnent pas)." },
      { type: "calcul", text: `\\text{Coefficient global} = ${fr(roundTo(1 + p1 / 100, 3))} \\times ${fr(roundTo(augmenteAugmente ? 1 + p2 / 100 : 1 - p2 / 100, 3))} = ${fr(roundTo(coeff, 4))}` },
      { type: "resultat", text: answer },
    ],
  };
}

function genImageAntecedentSecondDegreOriginalQCM() {
  const a = pick([1, -1, 2, -2, 3]);
  const r1 = randInt(-6, 6);
  const r2 = randInt(-6, 6);
  const x = randInt(-8, 8);
  const answer = a * (x - r1) * (x - r2);
  const options = shuffle([String(answer), String(answer + nonZeroSmall()), String(-answer)]);
  function nonZeroSmall() {
    let n = 0;
    while (n === 0) n = randInt(-8, 8);
    return n;
  }
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `On considère \\(f(x) = ${a === 1 ? "" : a}(x - (${r1}))(x - (${r2}))\\). L'image de ${x} par f est :`,
    answer: String(answer),
    options,
    steps: [
      { type: "calcul", text: `f(${x}) = ${a} \\times (${x - r1}) \\times (${x - r2})` },
      { type: "resultat", text: `f(${x}) = ${answer}` },
    ],
  };
}

function genMoyennePondereeOriginalQCM() {
  const note1 = randInt(4, 18);
  const coeff1 = pick([1, 2, 3]);
  const note2 = randInt(4, 18);
  const coeff2 = pick([1, 2]);
  const answer = roundTo((note1 * coeff1 + note2 * coeff2) / (coeff1 + coeff2), 2);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `Un élève obtient ${note1}/20 à un devoir coefficienté ${coeff1} et ${note2}/20 à un devoir coefficienté ${coeff2}. Sa moyenne est :`,
    answer: fr(answer),
    options: shuffle([fr(answer), fr(roundTo((note1 + note2) / 2, 2)), fr(roundTo(answer + 1, 2))]),
    steps: [
      { type: "regle", text: "Formule de référence à connaître : moyenne pondérée = (note₁×coeff₁ + note₂×coeff₂) / (coeff₁+coeff₂)." },
      { type: "calcul", text: `\\dfrac{${note1} \\times ${coeff1} + ${note2} \\times ${coeff2}}{${coeff1}+${coeff2}}` },
      { type: "resultat", text: `${fr(answer)}` },
    ],
  };
}

function genTableauCroiseProbaOriginalQCM() {
  const total = pick([200, 250, 300, 400]);
  const catA = randInt(40, 120);
  const catAB = randInt(10, Math.min(catA - 5, 60));
  const answer = `${catAB}/${catA}`;
  return {
    type: "qcm",
    chapter: "Préparation EAM — Automatismes",
    prompt: `Un tableau croisé de ${total} personnes donne ${catA} personnes dans la catégorie A, dont ${catAB} sont aussi dans B. On interroge au hasard une personne de la catégorie A. La probabilité qu'elle soit aussi dans B est :`,
    answer,
    options: shuffle([answer, `${catAB}/${total}`, `${catA}/${total}`]),
    steps: [
      { type: "regle", text: "« Sachant que la personne est en catégorie A » restreint le dénominateur à l'effectif de A (et non à l'effectif total)." },
      { type: "resultat", text: `P_A(B) = \\dfrac{${catAB}}{${catA}}` },
    ],
  };
}

function genLectureDiagrammeCirculaireOriginalQCM() {
  const parts = [pick([30, 35, 40]), pick([15, 20, 25]), pick([10, 15])];
  const dernier = 100 - parts.reduce((a, b) => a + b, 0);
  return {
    type: "numeric",
    chapter: "Préparation EAM — Automatismes",
    prompt: `Un diagramme circulaire donne la répartition en pourcentage de 4 catégories : ${parts.join(" %, ")} % et une dernière catégorie. Calcule le pourcentage de cette dernière catégorie.`,
    answer: dernier,
    steps: [
      { type: "regle", text: "Les pourcentages d'un diagramme circulaire totalisent toujours 100 %." },
      { type: "resultat", text: `100 - (${parts.join(" + ")}) = ${dernier}` },
    ],
  };
}

// =========================== Originaux — Suites ===========================

function genSuiteModelisationOriginalNumeric() {
  const type = pick(["arithmetique", "geometrique"]);
  const u0 = randInt(100, 500);
  if (type === "arithmetique") {
    const r = pick([10, 20, 25, 50]) * pick([1, -1]);
    return {
      type: "numeric",
      chapter: "Préparation EAM — Suites",
      prompt: `Un abonnement coûte ${u0} € la première année, puis ${r >= 0 ? "augmente" : "diminue"} de ${Math.abs(r)} € chaque année suivante. On note \\(u_n\\) le prix la \\((n+1)\\)-ième année, avec \\(u_0 = ${u0}\\). Calcule \\(u_3\\).`,
      answer: u0 + 3 * r,
      steps: [
        { type: "regle", text: "Un accroissement constant chaque année se traduit par \\(u_n = u_0 + n \\times r\\)." },
        { type: "resultat", text: `u_3 = ${u0} + 3 \\times (${r}) = ${u0 + 3 * r}` },
      ],
    };
  }
  const p = pick([5, 10, 15]);
  const augmente = Math.random() < 0.5;
  const coeff = augmente ? 1 + p / 100 : 1 - p / 100;
  const answer = roundTo(u0 * coeff ** 3, 2);
  return {
    type: "numeric",
    chapter: "Préparation EAM — Suites",
    prompt: `Un capital de ${u0} € ${augmente ? "augmente" : "diminue"} de ${p} % chaque année. On note \\(u_n\\) sa valeur après n années, avec \\(u_0 = ${u0}\\). Calcule \\(u_3\\) (arrondi au centième).`,
    answer,
    tolerance: 0.05,
    steps: [
      { type: "regle", text: `Une évolution de ${p} % chaque année correspond à un coefficient multiplicateur constant appliqué n fois : \\(u_n = u_0 \\times q^n\\).` },
      { type: "resultat", text: `u_3 = ${u0} \\times ${fr(roundTo(coeff, 4))}^3 = ${fr(answer)}` },
    ],
  };
}

function genComparerDeuxOffresOriginalQCM() {
  const u0 = pick([200, 250, 300]);
  const r = pick([20, 30, 40]);
  const v0 = pick([150, 180, 200]);
  const p = pick([8, 10, 12]);
  const n = pick([3, 4, 5]);
  const un = u0 + n * r;
  const vn = roundTo(v0 * (1 + p / 100) ** n, 2);
  const answer = un > vn ? "Offre A" : "Offre B";
  return {
    type: "qcm",
    chapter: "Préparation EAM — Suites",
    prompt: `L'offre A coûte ${u0} € puis augmente de ${r} € par an. L'offre B coûte ${v0} € puis augmente de ${p} % par an. Après ${n} ans, quelle offre coûte le plus cher ?`,
    answer,
    options: ["Offre A", "Offre B"],
    steps: [
      { type: "calcul", text: `\\text{Offre A après ${n} ans : } ${u0} + ${n} \\times ${r} = ${un} \\text{ €}` },
      { type: "calcul", text: `\\text{Offre B après ${n} ans : } ${v0} \\times ${fr(roundTo(1 + p / 100, 3))}^{${n}} \\approx ${fr(vn)} \\text{ €}` },
      { type: "resultat", text: answer },
    ],
  };
}

// =========================== Originaux — Fonctions et dérivation ===========================

function genResoudreGraphiquementOriginalQCM() {
  const r1 = randInt(-5, 0);
  const r2 = r1 + nonZeroPos();
  function nonZeroPos() {
    return randInt(2, 6);
  }
  const a = pick([1, -1, 2, -2]);
  const fn = (x) => a * (x - r1) * (x - r2);
  const correctRaw = `${r1} \\text{ et } ${r2}`;
  const options = shuffle([correctRaw, `${r1 - 1} \\text{ et } ${r2 + 1}`, `${r1 + 1} \\text{ et } ${r2}`]);
  return {
    type: "qcm",
    chapter: "Préparation EAM — Fonctions",
    prompt: `On donne ci-dessous la courbe représentative d'une fonction polynôme du second degré \\(f\\). Résous graphiquement \\(f(x) = 0\\).`,
    answer: correctRaw,
    options,
    steps: [
      { type: "regle", text: "Résoudre f(x)=0 revient à lire les abscisses des points où la courbe coupe l'axe des abscisses." },
      { type: "resultat", text: `${r1} \\text{ et } ${r2}` },
    ],
    graph: { xMin: r1 - 3, xMax: r2 + 3, yMin: Math.min(-1, fn((r1 + r2) / 2)) - 2, yMax: Math.max(1, fn(r1 - 2), fn(r2 + 2)) + 2, curves: [{ fn, label: "f" }] },
  };
}

function genNombreDeriveTangenteOriginalNumeric() {
  const a = randInt(-4, 4);
  const m = (() => {
    let n = 0;
    while (n === 0) n = randInt(-5, 5);
    return n;
  })();
  const fa = randInt(-5, 5);
  return {
    type: "numeric",
    chapter: "Préparation EAM — Dérivation",
    prompt: `On donne ci-dessous la courbe d'une fonction f et sa tangente au point A d'abscisse ${a}, d'ordonnée ${fa}. Cette tangente passe aussi par le point \\((${a + 1} ; ${fa + m})\\). Détermine \\(f'(${a})\\).`,
    answer: m,
    steps: [
      { type: "regle", text: "Le nombre dérivé f'(a) est le coefficient directeur de la tangente en ce point ; il se calcule avec deux points connus de cette droite." },
      { type: "resultat", text: `f'(${a}) = \\dfrac{${fa + m} - ${fa}}{${a + 1} - ${a}} = ${m}` },
    ],
    graph: {
      xMin: a - 4,
      xMax: a + 4,
      yMin: Math.min(fa, fa + m) - 3,
      yMax: Math.max(fa, fa + m) + 3,
      lines: [{ a: m, b: fa - m * a, label: "tangente" }],
      points: [{ x: a, y: fa, label: "A" }],
    },
  };
}

function genDeriveePolynomeOriginalNumeric() {
  const c2 = randInt(-6, 6);
  const c1 = randInt(-8, 8);
  const c0 = randInt(-6, 6);
  const x = randInt(-4, 4);
  const answer = 2 * c2 * x + c1;
  return {
    type: "numeric",
    chapter: "Préparation EAM — Dérivation",
    prompt: `On donne \\(f(x) = ${c2}x^2 ${c1 >= 0 ? "+" : "-"} ${Math.abs(c1)}x ${c0 >= 0 ? "+" : "-"} ${Math.abs(c0)}\\). Calcule \\(f'(${x})\\).`,
    answer,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : (ax² + bx + c)' = 2ax + b." },
      { type: "calcul", text: `f'(x) = ${2 * c2}x ${c1 >= 0 ? "+" : "-"} ${Math.abs(c1)}` },
      { type: "resultat", text: `f'(${x}) = ${2 * c2} \\times ${x} ${c1 >= 0 ? "+" : "-"} ${Math.abs(c1)} = ${answer}` },
    ],
  };
}

// =========================== Originaux — Probabilités ===========================

function genProbaConditionnelleOriginalNumeric() {
  const total = pick([200, 250, 300, 400, 500]);
  const catA = randInt(60, 150);
  const catAB = randInt(10, Math.min(catA - 10, 80));
  const answer = roundTo(catAB / catA, 4);
  return {
    type: "numeric",
    chapter: "Préparation EAM — Probabilités",
    prompt: `Un tableau croisé de ${total} personnes donne ${catA} personnes de catégorie A, dont ${catAB} sont aussi de catégorie B. Calcule \\(P_A(B)\\) (valeur décimale arrondie à 0,0001 près).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: "« Sachant que la personne est en catégorie A » restreint le dénominateur à l'effectif de A (et non à l'effectif total)." },
      { type: "resultat", text: `P_A(B) = \\dfrac{${catAB}}{${catA}} = ${fr(answer)}` },
    ],
  };
}

function genEsperanceVariableAleatoireOriginalNumeric() {
  const valeurs = [1, 2, 3, 4];
  const p1 = pick([0.1, 0.15, 0.2]);
  const p2 = pick([0.2, 0.25, 0.3]);
  const p3 = pick([0.2, 0.25]);
  const p4 = roundTo(1 - p1 - p2 - p3, 4);
  const answer = roundTo(valeurs[0] * p1 + valeurs[1] * p2 + valeurs[2] * p3 + valeurs[3] * p4, 4);
  return {
    type: "numeric",
    chapter: "Préparation EAM — Probabilités",
    prompt: `Une variable aléatoire X prend les valeurs 1, 2, 3, 4 avec \\(P(X=1)=${fr(p1)}\\), \\(P(X=2)=${fr(p2)}\\), \\(P(X=3)=${fr(p3)}\\), \\(P(X=4)=${fr(p4)}\\). Calcule \\(E(X)\\) (arrondi au centième).`,
    answer: roundTo(answer, 2),
    tolerance: 0.01,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : E(X) = somme des (valeur × probabilité)." },
      { type: "resultat", text: `E(X) = 1 \\times ${fr(p1)} + 2 \\times ${fr(p2)} + 3 \\times ${fr(p3)} + 4 \\times ${fr(p4)} = ${fr(roundTo(answer, 2))}` },
    ],
  };
}

const GENERATORS = [
  genQCMOfficielMetropole,
  genQCMOfficielAntilles,
  genQCMOfficielCentresEtrangers,
  genQCMOfficielPolynesie,
  genLectureDroiteOfficielMetropole,
  genLectureDroiteOfficielAntilles,
  genLectureDroiteOfficielPolynesie,
  genSuitesOfficielMetropole,
  genSuitesOfficielAntilles,
  genSuitesOfficielPolynesie,
  genFonctionOfficielMetropole,
  genFonctionOfficielCentresEtrangers,
  genFonctionOfficielPolynesie,
  genProbaOfficielAntilles,
  genProbaOfficielPolynesie,
  genPourcentageRemiseOriginalQCM,
  genEvolutionSuccessiveOriginalQCM,
  genImageAntecedentSecondDegreOriginalQCM,
  genMoyennePondereeOriginalQCM,
  genTableauCroiseProbaOriginalQCM,
  genLectureDiagrammeCirculaireOriginalQCM,
  genSuiteModelisationOriginalNumeric,
  genComparerDeuxOffresOriginalQCM,
  genResoudreGraphiquementOriginalQCM,
  genNombreDeriveTangenteOriginalNumeric,
  genDeriveePolynomeOriginalNumeric,
  genProbaConditionnelleOriginalNumeric,
  genEsperanceVariableAleatoireOriginalNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "preparation-eam-premiere-techno",
    title: "Préparation à l'EAM",
    description: "Sujets officiels 2026 (Métropole, Antilles-Guyane, Centres étrangers, Polynésie) et exercices originaux sur les mêmes compétences.",
    pourquoi: "Ce chapitre te met dans les conditions réelles de l'épreuve, avec des sujets et formats officiels, pour arriver serein le jour J.",
    level: "premiere-techno",
    order: 9,
  },
  generate,
};
