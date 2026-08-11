const n = (chapter, prompt, answer, steps, answerUnit, answerDisplay) => ({ type: "numeric", chapter, prompt, answer, steps, ...(answerUnit ? { answerUnit } : {}), ...(answerDisplay ? { answerDisplay } : {}) });
const t = (chapter, prompt, answer, steps) => ({ type: "text", chapter, prompt, answer, steps });
const q = (chapter, prompt, answer, options, steps) => ({ type: "qcm", chapter, prompt, answer, options, steps });

function structureShowcaseExercise(exercise) {
  if (!Array.isArray(exercise.steps) || exercise.steps.length === 0) return exercise;
  if (exercise.steps.every((step) => step && typeof step === "object" && step.text)) return exercise;
  const texts = exercise.steps.map((step) => typeof step === "string" ? step : step?.text ?? "").filter(Boolean);
  const method = texts[0] ?? "On identifie la propriété ou la définition utile.";
  const result = texts.at(-1) ?? `On obtient ${exercise.answerDisplay ?? exercise.answer}.`;
  const calculation = texts.length > 2 ? texts.slice(1, -1).join(" ") : method;
  const given = exercise.prompt.replace(/[.?!]+\s*$/, "");
  return {
    ...exercise,
    steps: [
      { type: "donnee", text: `On relève précisément les informations utiles : ${given}.` },
      { type: "regle", text: method },
      { type: "calcul", text: `On applique cette règle aux valeurs de l’énoncé, sans changer leur ordre ni leur unité : ${calculation}` },
      { type: "resultat", text: result },
    ],
  };
}

const SHOWCASES = {
  sixieme: [
    n("Numération décimale — Valeur de position", "Quel nombre obtient-on en ajoutant 7 dixièmes à 12,4 ?", 13.1, [
      { type: "donnee", text: "Sept dixièmes s’écrit 0,7 : le chiffre 7 occupe la colonne des dixièmes." },
      { type: "regle", text: "Pour additionner des nombres décimaux, on place les unités sous les unités et les virgules l’une sous l’autre." },
      { type: "calcul", text: "On calcule donc 12,4 + 0,7. Quatre dixièmes et sept dixièmes donnent onze dixièmes, c’est-à-dire une unité et un dixième." },
      { type: "resultat", text: "On obtient finalement 13,1." },
    ]),
    n("Fractions — Partage", "Une unité est partagée en 4 parts égales et on en prend 3. Quelle fraction est coloriée ?", 0.75, [
      { type: "donnee", text: "L’unité est découpée en quatre parts de même taille : le dénominateur est donc 4." },
      { type: "regle", text: "Le numérateur, le nombre du haut, indique combien de parts sont prises." },
      { type: "calcul", text: "Trois parts sont coloriées parmi les quatre parts égales : la fraction est donc 3/4." },
      { type: "resultat", text: "La partie coloriée représente 3/4 de l’unité." },
    ], null, "3/4"),
    n("Proportionnalité — Retour à l’unité", "4 cahiers coûtent 10 €. Combien coûtent 6 cahiers ?", 15, [
      { type: "donnee", text: "Quatre cahiers identiques coûtent 10 € et on cherche le prix de six cahiers." },
      { type: "regle", text: "On commence par chercher le prix d’un cahier : c’est la méthode du retour à l’unité." },
      { type: "calcul", text: "Un cahier coûte 10 ÷ 4 = 2,50 €. Quatre cahiers coûtent 10 €, puis deux cahiers supplémentaires coûtent 2 × 2,50 = 5 €." },
      { type: "resultat", text: "Six cahiers coûtent donc 10 + 5 = 15 €." },
    ], "€"),
    n("Grandeurs et mesures — Aire d'un rectangle", "Un rectangle mesure 7 cm de long et 4 cm de large. Calcule son aire.", 28, [
      { type: "donnee", text: "Le rectangle a une longueur de 7 cm et une largeur de 4 cm." },
      { type: "regle", text: "L’aire mesure la surface occupée. Pour un rectangle, on multiplie la longueur par la largeur." },
      { type: "calcul", text: "Aire = longueur × largeur = 7 × 4 = 28." },
      { type: "resultat", text: "L’aire du rectangle est donc égale à 28 cm². L’unité est le centimètre carré, car on mesure une surface." },
    ], "cm²"),
    t("Géométrie repérée — Coordonnées", "Le point A a pour abscisse 3 et pour ordonnée −2. Écris ses coordonnées.", "(3 ; -2)", [
      { type: "donnee", text: "L’abscisse du point A vaut 3 et son ordonnée vaut −2." },
      { type: "regle", text: "Dans les coordonnées d’un point, on écrit toujours d’abord le déplacement horizontal, puis le déplacement vertical : (abscisse ; ordonnée)." },
      { type: "calcul", text: "On place donc 3 en première position et −2 en seconde position." },
      { type: "resultat", text: "Le point A a pour coordonnées (3 ; −2)." },
    ]),
  ],
  cinquieme: [
    n("Nombres relatifs — Addition de signes opposés", "Calcule : −7 + 12.", 5, [
      { type: "donnee", text: "On additionne deux nombres de signes opposés : −7 est négatif et 12 est positif." },
      { type: "regle", text: "Le plus « fort », celui qui a la plus grande distance à zéro, donne son signe au résultat, mais il perd les points de l’autre nombre." },
      { type: "calcul", text: "Douze est plus éloigné de zéro que sept : le résultat sera positif. Il perd ensuite 7 points de vie, donc 12 − 7 = 5." },
      { type: "resultat", text: "Ainsi, −7 + 12 = 5." },
    ]),
    n("Fractions — Addition", "Calcule : 2/3 + 1/4.", 11/12, [
      { type: "donnee", text: "Les deux fractions n’ont pas le même dénominateur : les parts n’ont donc pas encore la même taille." },
      { type: "regle", text: "On commence par obtenir un dénominateur commun en multipliant en haut et en bas par un même nombre, ce qui ne change pas la valeur de la fraction." },
      { type: "calcul", text: "On transforme 2/3 en 8/12 en multipliant par 4, et 1/4 en 3/12 en multipliant par 3. On peut alors additionner les numérateurs : 8 + 3 = 11." },
      { type: "resultat", text: "On obtient donc 2/3 + 1/4 = 11/12." },
    ], null, "11/12"),
    n("Pourcentages — Calculer une proportion", "Calcule 20 % de 80.", 16, [
      { type: "donnee", text: "On cherche une proportion de la quantité 80 : 20 % ne signifie pas ajouter le nombre 20." },
      { type: "regle", text: "Le plus simple est de calculer d’abord 10 %, c’est-à-dire le dixième, puis de doubler ce résultat pour obtenir 20 %." },
      { type: "calcul", text: "Dix pour cent de 80 vaut 80 ÷ 10 = 8. Vingt pour cent est le double de 10 %, donc 2 × 8 = 16." },
      { type: "resultat", text: "Ainsi, 20 % de 80 est égal à 16." },
    ]),
    n("Angles — Angles d'un triangle", "Un triangle possède deux angles de 50° et 60°. Calcule le troisième angle.", 70, [
      { type: "donnee", text: "Deux angles du triangle mesurent 50° et 60°. On cherche la mesure du troisième angle." },
      { type: "regle", text: "Dans tous les triangles, la somme des mesures des trois angles est égale à 180°." },
      { type: "calcul", text: "Les deux angles connus mesurent ensemble 50 + 60 = 110°. Il reste donc 180 − 110 = 70°." },
      { type: "resultat", text: "Le troisième angle mesure 70°. On vérifie bien que 50 + 60 + 70 = 180." },
    ], "°"),
    n("Probabilités — Issues favorables", "Un sac contient 3 boules rouges et 2 bleues. Quelle est la probabilité d’obtenir une rouge ?", 3/5, [
      { type: "donnee", text: "L’événement recherché est « obtenir une boule rouge ». Il y a 3 boules rouges : ce sont les issues favorables." },
      { type: "regle", text: "Pour calculer une probabilité dans une situation équiprobable, on compare le nombre d’issues favorables au nombre total d’issues possibles." },
      { type: "calcul", text: "Le sac contient 3 + 2 = 5 boules au total. La probabilité cherchée est donc nombre de boules rouges ÷ nombre total de boules = 3/5." },
      { type: "resultat", text: "La probabilité d’obtenir une boule rouge est 3/5. Ce résultat est bien compris entre 0 et 1." },
    ], null, "3/5"),
  ],
  quatrieme: [
    n("Nombres relatifs — Produit", "Calcule : (−4) × (−3).", 12, ["Deux nombres de même signe donnent un produit positif.", "4 × 3 = 12.", "(−4) × (−3) = 12."]),
    n("Équations — Résoudre", "Résous l’équation 4x − 7 = 13.", 5, ["On ajoute 7 dans les deux membres : 4x = 20.", "On divise les deux membres par 4.", "x = 5."]),
    n("Théorème de Pythagore — Hypoténuse", "ABC est rectangle en A, AB = 6 cm et AC = 8 cm. Calcule BC.", 10, ["BC est l’hypoténuse : BC² = AB² + AC².", "BC² = 6² + 8² = 100.", "BC = √100 = 10 cm."], "cm"),
    n("Proportionnalité — Vitesse", "Une voiture parcourt 150 km en 2 h à vitesse constante. Quelle est sa vitesse moyenne ?", 75, ["On cherche la distance parcourue en une heure.", "150 ÷ 2 = 75.", "La vitesse est 75 km/h."], "km/h"),
    n("Statistiques — Moyenne", "Calcule la moyenne de 8, 10 et 15.", 11, ["On additionne les valeurs : 8 + 10 + 15 = 33.", "Il y a 3 valeurs : 33 ÷ 3.", "La moyenne est 11."]),
  ],
  troisieme: [
    n("Théorème de Thalès — Longueur", "Dans une configuration de Thalès, x/6 = 4/3. Calcule x.", 8, ["Les côtés correspondants sont écrits dans le même ordre.", "x = 6 × 4 ÷ 3.", "x = 8."]),
    n("Équations — Produit nul", "Résous (x − 2)(x + 3) = 0. Donne la solution positive.", 2, ["Un produit est nul si l’un de ses facteurs est nul.", "x − 2 = 0 donne x = 2 ; x + 3 = 0 donne x = −3.", "La solution positive est 2."]),
    n("Fonctions — Image", "Pour f(x) = 3x − 2, calcule l’image de 4.", 10, ["On remplace x par 4 : f(4) = 3 × 4 − 2.", "3 × 4 − 2 = 12 − 2.", "f(4) = 10."]),
    n("Pourcentages — Évolution", "Un article coûte 80 €. Son prix augmente de 20 %. Quel est le nouveau prix ?", 96, ["20 % de 80 vaut 16.", "On ajoute l’augmentation au prix initial : 80 + 16.", "Le nouveau prix est 96 €."], "€"),
    n("Probabilités — Événement contraire", "On sait que P(A) = 0,3. Calcule P(non A).", 0.7, ["A et son contraire couvrent tous les cas.", "P(non A) = 1 − P(A).", "1 − 0,3 = 0,7."]),
  ],
  seconde: [
    n("Fonctions — Antécédent", "Pour f(x) = 2x + 1, cherche l’antécédent de 9.", 4, ["Chercher un antécédent signifie résoudre f(x) = 9.", "2x + 1 = 9, donc 2x = 8.", "x = 4."]),
    n("Fonctions affines — Coefficient directeur", "Une droite passe par A(1 ; 3) et B(4 ; 9). Calcule son coefficient directeur.", 2, ["Variation verticale : 9 − 3 = 6.", "Variation horizontale : 4 − 1 = 3.", "Coefficient directeur : 6 ÷ 3 = 2."]),
    n("Statistiques — Médiane", "Détermine la médiane de la série ordonnée : 2 ; 5 ; 7 ; 9 ; 12.", 7, ["L’effectif 5 est impair.", "La valeur centrale est la troisième.", "La médiane est 7."]),
    t("Vecteurs — Coordonnées", "A(1 ; 2) et B(4 ; 6). Donne les coordonnées du vecteur AB.", "(3 ; 4)", ["Abscisse : 4 − 1 = 3.", "Ordonnée : 6 − 2 = 4.", "Le vecteur AB a pour coordonnées (3 ; 4)."]),
    n("Probabilités — Événement contraire", "Si P(A) = 0,42, calcule P(non A).", 0.58, ["P(non A) = 1 − P(A).", "1 − 0,42 = 0,58.", "La probabilité cherchée est 0,58."]),
  ],
  "premiere-spe": [
    n("Second degré — Discriminant", "Pour x² − 5x + 6 = 0, calcule le discriminant Δ.", 1, ["a = 1, b = −5 et c = 6.", "Δ = b² − 4ac = (−5)² − 4 × 1 × 6.", "Δ = 25 − 24 = 1."]),
    n("Dérivation — Nombre dérivé", "Pour f(x) = x², calcule f′(3).", 6, ["La dérivée de x² est f′(x) = 2x.", "On remplace x par 3 : f′(3) = 2 × 3.", "f′(3) = 6."]),
    n("Suites arithmétiques — Terme général", "Une suite arithmétique vérifie u₀ = 4 et a pour raison 3. Calcule u₅.", 19, ["uₙ = u₀ + n × r.", "u₅ = 4 + 5 × 3.", "u₅ = 19."]),
    n("Probabilités conditionnelles — Probabilité conditionnelle", "P(A∩B) = 0,2 et P(A) = 0,5. Calcule P_A(B).", 0.4, ["P_A(B) = P(A∩B) ÷ P(A).", "0,2 ÷ 0,5 = 0,4.", "P_A(B) = 0,4."]),
    t("Produit scalaire — Orthogonalité", "Deux vecteurs ont un produit scalaire nul. Que peut-on conclure ?", "ils sont orthogonaux", ["Le produit scalaire mesure notamment l’orthogonalité.", "Un produit scalaire nul caractérise deux vecteurs orthogonaux.", "Les deux vecteurs sont orthogonaux."]),
  ],
  "premiere-non-spe": [
    n("Pourcentages — Évolution", "Une quantité de 250 augmente de 8 %. Quelle est sa nouvelle valeur ?", 270, ["8 % de 250 vaut 20.", "250 + 20 = 270.", "La nouvelle valeur est 270."]),
    n("Fonctions affines — Image", "Pour f(x) = −2x + 7, calcule f(3).", 1, ["f(3) = −2 × 3 + 7.", "−6 + 7 = 1.", "f(3) = 1."]),
    n("Statistiques — Étendue", "Une série statistique va de 12 à 47. Calcule son étendue.", 35, ["Étendue = maximum − minimum.", "47 − 12 = 35.", "L’étendue est 35."]),
    n("Probabilités — Issues favorables", "Une urne contient 4 jetons gagnants sur 10. Quelle est la probabilité de gagner ?", 2/5, ["La probabilité est d’abord 4/10.", "On simplifie en divisant par 2.", "La probabilité vaut 2/5."], null, "2/5"),
    n("Algorithmique — Affectations", "On exécute x ← 4 puis x ← 3x + 2. Quelle est la valeur finale de x ?", 14, ["Après la première affectation, x vaut 4.", "On remplace x par 4 dans 3x + 2.", "3 × 4 + 2 = 14."]),
  ],
  "premiere-techno": [
    n("Pourcentages — Coefficient multiplicateur", "Quel coefficient multiplicateur correspond à une hausse de 15 % ?", 1.15, ["Après une hausse de 15 %, on passe de 100 % à 115 %.", "115 % = 115 ÷ 100.", "Le coefficient est 1,15."]),
    n("Fonctions affines — Antécédent", "Pour f(x) = 5x − 3, cherche l’antécédent de 17.", 4, ["On résout 5x − 3 = 17.", "5x = 20.", "x = 4."]),
    n("Second degré — Image", "Pour f(x) = x² − 4x + 1, calcule f(2).", -3, ["f(2) = 2² − 4 × 2 + 1.", "4 − 8 + 1 = −3.", "f(2) = −3."]),
    n("Statistiques — Moyenne pondérée", "Une note 10 a coefficient 1 et une note 16 coefficient 2. Calcule la moyenne.", 14, ["Somme pondérée : 10 × 1 + 16 × 2 = 42.", "Somme des coefficients : 1 + 2 = 3.", "42 ÷ 3 = 14."]),
    n("Algorithmique — Boucle", "Une boucle ajoute 3 à x quatre fois. Si x vaut 2 au départ, combien vaut-il à la fin ?", 14, ["Quatre ajouts de 3 représentent 4 × 3 = 12.", "On ajoute 12 à la valeur initiale 2.", "x vaut finalement 14."]),
  ],
  "terminale-spe": [
    n("Fonction exponentielle — Équation", "Résous eˣ = e³.", 3, ["La fonction exponentielle est strictement croissante.", "Deux exponentielles sont égales lorsque leurs exposants sont égaux.", "x = 3."]),
    n("Dérivation — Tangente", "Pour f(x) = x² + 1, calcule le coefficient directeur de la tangente au point d’abscisse 2.", 4, ["Le coefficient directeur est f′(2).", "f′(x) = 2x.", "f′(2) = 4."]),
    n("Suites géométriques — Terme général", "Une suite géométrique vérifie u₀ = 3 et a pour raison 2. Calcule u₄.", 48, ["uₙ = u₀ × qⁿ.", "u₄ = 3 × 2⁴.", "u₄ = 48."]),
    n("Probabilités conditionnelles — Arbre pondéré", "Un chemin porte les probabilités 0,6 puis 0,4. Calcule la probabilité du chemin.", 0.24, ["Sur un même chemin, on multiplie.", "0,6 × 0,4 = 0,24.", "La probabilité du chemin est 0,24."]),
    t("Géométrie dans l'espace — Vecteurs", "Deux vecteurs directeurs sont colinéaires. Que peut-on dire des droites correspondantes ?", "elles sont parallèles", ["Des vecteurs colinéaires ont la même direction.", "Les droites dirigées par ces vecteurs ont donc la même direction.", "Les droites sont parallèles."]),
  ],
  "terminale-techno": [
    n("Logarithme décimal — Équation", "Résous log(x) = 2.", 100, ["log(x) = 2 signifie x = 10².", "10² = 100.", "x = 100."]),
    n("Dérivation — Variations", "Une fonction vérifie f′(x) > 0 sur un intervalle. Quel code choisir : 1 pour croissante, −1 pour décroissante ?", 1, ["Le signe de la dérivée donne le sens de variation.", "Une dérivée positive signifie que la fonction augmente.", "La fonction est croissante : code 1."]),
    n("Suites géométriques — Évolution", "Une quantité vaut 200 et augmente de 5 % par an. Quelle est sa valeur après un an ?", 210, ["Le coefficient multiplicateur est 1,05.", "200 × 1,05 = 210.", "La valeur après un an est 210."]),
    n("Probabilités conditionnelles — Probabilité conditionnelle", "P(A∩B) = 0,18 et P(A) = 0,6. Calcule P_A(B).", 0.3, ["P_A(B) = P(A∩B) ÷ P(A).", "0,18 ÷ 0,6 = 0,3.", "P_A(B) = 0,3."]),
    n("Statistiques — Moyenne pondérée", "Une valeur 20 a un effectif 3 et une valeur 30 un effectif 2. Calcule la moyenne.", 24, ["Somme pondérée : 20 × 3 + 30 × 2 = 120.", "Effectif total : 3 + 2 = 5.", "120 ÷ 5 = 24."]),
  ],
};

export function getDiscoveryShowcase(levelId) {
  const sourceExercises = SHOWCASES[levelId];
  if (!sourceExercises) return null;
  const exercises = sourceExercises.map(structureShowcaseExercise);
  return {
    meta: {
      id: `decouverte-${levelId}`,
      level: levelId,
      title: "Les essentiels du niveau",
      description: "Cinq questions choisies pour montrer comment RéussiMaths aide à comprendre.",
      free: true,
      order: 0,
    },
    showcaseExercises: exercises,
    generate: () => exercises[0],
  };
}

export function getAllDiscoveryShowcases() {
  return Object.entries(SHOWCASES).map(([levelId]) => getDiscoveryShowcase(levelId));
}

const CM2_FOUNDATIONS = [
  n("Numération — Grands nombres", "Quel est le nombre formé de 4 milliers, 3 centaines, 2 dizaines et 7 unités ?", 4327, ["4 milliers valent 4 000.", "3 centaines et 2 dizaines valent 300 et 20.", "4 000 + 300 + 20 + 7 = 4 327."]),
  n("Calcul — Priorités", "Calcule 6 + 4 × 5.", 26, ["La multiplication est prioritaire sur l’addition.", "4 × 5 = 20.", "6 + 20 = 26."]),
  n("Fractions — Fraction d'une quantité", "Calcule les 3/4 de 20.", 15, ["On partage 20 en 4 parts : 20 ÷ 4 = 5.", "On prend 3 parts : 3 × 5.", "Les 3/4 de 20 valent 15."]),
  n("Proportionnalité — Retour à l’unité", "5 objets identiques coûtent 15 €. Combien coûtent 2 objets ?", 6, ["Un objet coûte 15 ÷ 5 = 3 €.", "Deux objets coûtent 2 × 3.", "Deux objets coûtent 6 €."], "€"),
  {
    ...n("Grandeurs et mesures — Unités de longueur", "Convertis 2,5 m en centimètres.", 250, [
      "On place le chiffre des unités, ici 2, dans son unité, donc la colonne des mètres.",
      "Chaque déplacement d’une colonne vers la droite multiplie la mesure par 10 ; de m vers cm, on se déplace de deux colonnes.",
      "On complète le tableau jusqu’aux centimètres : 2,5 m = 250 cm.",
    ], "cm"),
    conversionTable: { kind: "length", value: 2.5, fromUnit: "m", toUnit: "cm", answer: 250 },
  },
];

const PREVIOUS_LEVEL = {
  cinquieme: "sixieme",
  quatrieme: "cinquieme",
  troisieme: "quatrieme",
  seconde: "troisieme",
  "premiere-spe": "seconde",
  "premiere-non-spe": "seconde",
  "premiere-techno": "seconde",
  "terminale-spe": "premiere-spe",
  "terminale-techno": "premiere-techno",
};

export function getDiagnosticShowcaseExercises(levelId) {
  const previous = levelId === "sixieme" ? CM2_FOUNDATIONS : SHOWCASES[PREVIOUS_LEVEL[levelId]] ?? [];
  return previous.slice(0, 5).map(structureShowcaseExercise);
}
