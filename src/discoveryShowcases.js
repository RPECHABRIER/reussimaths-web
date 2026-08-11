const n = (chapter, prompt, answer, steps, answerUnit, answerDisplay) => ({ type: "numeric", chapter, prompt, answer, steps, ...(answerUnit ? { answerUnit } : {}), ...(answerDisplay ? { answerDisplay } : {}) });
const t = (chapter, prompt, answer, steps) => ({ type: "text", chapter, prompt, answer, steps });
const q = (chapter, prompt, answer, options, steps) => ({ type: "qcm", chapter, prompt, answer, options, steps });
const s = (donnee, regle, calcul, resultat) => [
  { type: "donnee", text: donnee }, { type: "regle", text: regle },
  { type: "calcul", text: calcul }, { type: "resultat", text: resultat },
];

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
    n("Nombres relatifs — Produit", "Calcule : (−4) × (−3).", 12, [
      { type: "donnee", text: "On multiplie deux nombres négatifs : −4 et −3." },
      { type: "regle", text: "Pour un produit, deux nombres de même signe donnent un résultat positif ; deux nombres de signes opposés donnent un résultat négatif." },
      { type: "calcul", text: "Les deux facteurs sont négatifs, donc le produit est positif. On multiplie ensuite leurs distances à zéro : 4 × 3 = 12." },
      { type: "resultat", text: "Ainsi, (−4) × (−3) = 12." },
    ]),
    n("Équations — Résoudre", "Résous l’équation 4x − 7 = 13.", 5, [
      { type: "donnee", text: "L’équation 4x − 7 = 13 signifie que les deux membres ont la même valeur." },
      { type: "regle", text: "On utilise l’image d’une balance à l’équilibre : chaque opération effectuée dans un membre doit aussi être effectuée dans l’autre." },
      { type: "calcul", text: "On ajoute 7 dans les deux membres : 4x = 20. Pour isoler x, on divise ensuite les deux membres par 4." },
      { type: "resultat", text: "On obtient x = 5. Vérification : 4 × 5 − 7 = 20 − 7 = 13." },
    ]),
    n("Théorème de Pythagore — Hypoténuse", "ABC est rectangle en A, AB = 6 cm et AC = 8 cm. Calcule BC.", 10, [
      { type: "donnee", text: "Le triangle ABC est rectangle en A. Le côté opposé à l’angle droit est BC : c’est l’hypoténuse." },
      { type: "regle", text: "Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des deux autres côtés." },
      { type: "calcul", text: "BC² = AB² + AC² = 6² + 8² = 36 + 64 = 100. On cherche BC, et non BC² : il faut donc prendre la racine carrée." },
      { type: "resultat", text: "BC = √100 = 10 cm. Cette longueur est bien strictement inférieure à 6 + 8 = 14 cm." },
    ], "cm"),
    n("Proportionnalité — Vitesse", "Une voiture parcourt 150 km en 2 h à vitesse constante. Quelle est sa vitesse moyenne ?", 75, [
      { type: "donnee", text: "La voiture parcourt une distance de 150 km pendant une durée de 2 h." },
      { type: "regle", text: "Une vitesse moyenne indique la distance parcourue pendant une unité de temps. On calcule vitesse = distance ÷ durée." },
      { type: "calcul", text: "On cherche la distance parcourue en une heure : 150 ÷ 2 = 75." },
      { type: "resultat", text: "La vitesse moyenne de la voiture est donc 75 km/h. L’unité signifie bien « kilomètres parcourus en une heure »." },
    ], "km/h"),
    n("Statistiques — Moyenne", "Calcule la moyenne de 8, 10 et 15.", 11, [
      { type: "donnee", text: "La série contient trois valeurs : 8, 10 et 15." },
      { type: "regle", text: "Pour calculer une moyenne, on additionne toutes les valeurs, puis on partage équitablement cette somme entre le nombre de valeurs." },
      { type: "calcul", text: "La somme vaut 8 + 10 + 15 = 33. La série contient 3 valeurs, donc on calcule 33 ÷ 3 = 11." },
      { type: "resultat", text: "La moyenne est 11. Elle est bien comprise entre la plus petite valeur 8 et la plus grande valeur 15." },
    ]),
  ],
  troisieme: [
    n("Théorème de Thalès — Longueur", "Dans une configuration de Thalès, \\(\\dfrac{x}{6}=\\dfrac{4}{3}\\). Calcule \\(x\\).", 8, [
      { type: "donnee", text: "Les longueurs correspondantes vérifient la proportion \\(\\dfrac{x}{6}=\\dfrac{4}{3}\\). L’ordre des côtés est déjà indiqué par l’égalité." },
      { type: "regle", text: "Les droites parallèles forment deux triangles semblables : ils ont les mêmes angles et leurs longueurs correspondantes sont proportionnelles. On conserve exactement le même ordre dans chaque quotient." },
      { type: "calcul", text: "Pour isoler \\(x\\), on écrit \\(x=6\\times\\dfrac{4}{3}\\). On peut simplifier \\(6\\div3=2\\), puis calculer \\(2\\times4=8\\)." },
      { type: "resultat", text: "Ainsi, \\(x=8\\). Vérification : \\(\\dfrac{8}{6}=\\dfrac{4}{3}\\)." },
    ]),
    n("Équations — Produit nul", "Résous (x − 2)(x + 3) = 0. Donne la solution positive.", 2, [
      { type: "donnee", text: "Le membre de gauche est un produit de deux facteurs, (x − 2) et (x + 3), et ce produit est égal à zéro." },
      { type: "regle", text: "Un produit est nul si, et seulement si, au moins l’un de ses facteurs est nul." },
      { type: "calcul", text: "On résout séparément x − 2 = 0, ce qui donne x = 2, puis x + 3 = 0, ce qui donne x = −3." },
      { type: "resultat", text: "L’équation possède deux solutions, −3 et 2. La solution positive demandée est donc 2." },
    ]),
    n("Fonctions — Image", "Pour f(x) = 3x − 2, calcule l’image de 4.", 10, [
      { type: "donnee", text: "On demande l’image de 4 : le nombre de départ est donc connu et vaut 4." },
      { type: "regle", text: "Pour calculer une image, on remplace x par le nombre de départ dans l’expression de la fonction. Chercher un antécédent conduirait au contraire à résoudre une équation." },
      { type: "calcul", text: "On écrit f(4) = 3 × 4 − 2, puis on effectue le calcul : 12 − 2 = 10." },
      { type: "resultat", text: "Ainsi, l’image de 4 par la fonction f est 10." },
    ]),
    n("Pourcentages — Évolution", "Un article coûte 80 €. Son prix augmente de 20 %. Quel est le nouveau prix ?", 96, [
      { type: "donnee", text: "Le prix initial est 80 € et il augmente de 20 %. Attention : 20 % et le nombre 20 ne représentent pas la même quantité." },
      { type: "regle", text: "On peut calculer d’abord 10 %, le dixième du prix, puis doubler ce résultat. On peut aussi multiplier directement le prix initial par 1,20." },
      { type: "calcul", text: "Dix pour cent de 80 vaut 8, donc 20 % vaut 16. On ajoute cette augmentation au prix initial : 80 + 16 = 96." },
      { type: "resultat", text: "Le nouveau prix est 96 €. Vérification directe : 80 × 1,20 = 96." },
    ], "€"),
    n("Probabilités — Événement contraire", "On sait que P(A) = 0,3. Calcule P(non A).", 0.7, [
      { type: "donnee", text: "L’événement A a une probabilité de 0,3. On cherche la probabilité que A ne se réalise pas." },
      { type: "regle", text: "Un événement et son événement contraire regroupent tous les cas possibles. La somme de leurs probabilités est donc égale à 1." },
      { type: "calcul", text: "On calcule P(non A) = 1 − P(A) = 1 − 0,3 = 0,7." },
      { type: "resultat", text: "Ainsi, P(non A) = 0,7. On vérifie que 0,3 + 0,7 = 1." },
    ]),
  ],
  seconde: [
    n("Fonctions — Antécédent", "Pour f(x) = 2x + 1, cherche l’antécédent de 9.", 4, [
      { type: "donnee", text: "On connaît le résultat d’arrivée, 9, et on cherche le nombre de départ qui possède cette image." },
      { type: "regle", text: "Chercher un antécédent de 9 signifie résoudre l’équation f(x) = 9. Il peut parfois y avoir plusieurs antécédents, un seul ou aucun." },
      { type: "calcul", text: "On résout 2x + 1 = 9. On soustrait 1 dans les deux membres : 2x = 8, puis on divise les deux membres par 2." },
      { type: "resultat", text: "On obtient x = 4. Vérification : f(4) = 2 × 4 + 1 = 9." },
    ]),
    n("Fonctions affines — Coefficient directeur", "Une droite passe par A(1 ; 3) et B(4 ; 9). Calcule son coefficient directeur.", 2, [
      { type: "donnee", text: "La droite passe par A(1 ; 3) et B(4 ; 9). On connaît donc deux points distincts de la droite." },
      { type: "regle", text: "Le coefficient directeur mesure la variation verticale lorsque l’abscisse augmente d’une unité : m = (yB − yA) ÷ (xB − xA)." },
      { type: "calcul", text: "La variation verticale vaut 9 − 3 = 6 et la variation horizontale vaut 4 − 1 = 3. Ainsi, m = 6 ÷ 3." },
      { type: "resultat", text: "Le coefficient directeur est 2 : lorsque x augmente de 1, l’image augmente de 2." },
    ]),
    n("Statistiques — Médiane", "Détermine la médiane de la série ordonnée : 2 ; 5 ; 7 ; 9 ; 12.", 7, [
      { type: "donnee", text: "La série est déjà rangée dans l’ordre croissant et contient cinq valeurs." },
      { type: "regle", text: "La médiane partage une série ordonnée en deux groupes de même effectif. Lorsque l’effectif est impair, c’est la valeur située exactement au centre." },
      { type: "calcul", text: "Avec cinq valeurs, la position centrale est la troisième : deux valeurs se trouvent avant elle et deux valeurs après elle." },
      { type: "resultat", text: "La troisième valeur est 7. La médiane de la série est donc 7." },
    ]),
    t("Vecteurs — Coordonnées", "A(1 ; 2) et B(4 ; 6). Donne les coordonnées du vecteur AB.", "(3 ; 4)", [
      { type: "donnee", text: "Le vecteur AB décrit le déplacement qui permet d’aller du point A(1 ; 2) au point B(4 ; 6)." },
      { type: "regle", text: "Pour calculer les coordonnées du vecteur AB, on fait toujours coordonnées de l’arrivée B moins coordonnées du départ A." },
      { type: "calcul", text: "Horizontalement : 4 − 1 = 3. Verticalement : 6 − 2 = 4." },
      { type: "resultat", text: "Le vecteur AB a pour coordonnées (3 ; 4). Depuis A, avancer de 3 puis monter de 4 conduit bien à B." },
    ]),
    n("Probabilités — Événement contraire", "Si P(A) = 0,42, calcule P(non A).", 0.58, [
      { type: "donnee", text: "L’événement A a une probabilité de 0,42 et on cherche la probabilité qu’il ne se réalise pas." },
      { type: "regle", text: "A et son événement contraire couvrent tous les cas possibles : leurs probabilités ont donc pour somme 1." },
      { type: "calcul", text: "P(non A) = 1 − P(A) = 1 − 0,42 = 0,58." },
      { type: "resultat", text: "La probabilité cherchée est 0,58. Vérification : 0,42 + 0,58 = 1." },
    ]),
  ],
  "premiere-spe": [
    n("Second degré — Discriminant", "Pour x² − 5x + 6 = 0, calcule le discriminant Δ.", 1, s("L’équation est écrite sous la forme ax² + bx + c = 0.", "On relève les coefficients avec leurs signes, puis on utilise Δ = b² − 4ac.", "Ici a = 1, b = −5 et c = 6, donc Δ = (−5)² − 4 × 1 × 6 = 25 − 24.", "On obtient Δ = 1. Le signe positif indique que l’équation possède deux solutions réelles.")),
    n("Dérivation — Nombre dérivé", "Pour f(x) = x², calcule f′(3).", 6, s("On cherche le nombre dérivé de f au point d’abscisse 3.", "La fonction x ↦ x² a pour dérivée x ↦ 2x. Le nombre dérivé f′(3) est le coefficient directeur de la tangente au point d’abscisse 3.", "On remplace x par 3 dans f′(x) = 2x : f′(3) = 2 × 3.", "Ainsi f′(3) = 6 : la tangente a pour pente 6.")),
    n("Suites arithmétiques — Terme général", "Une suite arithmétique vérifie u₀ = 4 et a pour raison 3. Calcule u₅.", 19, s("La suite commence à u₀ = 4 et augmente de 3 à chaque nouveau terme.", "Pour une suite arithmétique indexée à partir de 0, uₙ = u₀ + n × r.", "Entre u₀ et u₅, on effectue cinq pas de raison 3 : u₅ = 4 + 5 × 3 = 4 + 15.", "On obtient u₅ = 19. On peut vérifier en énumérant 4, 7, 10, 13, 16, 19.")),
    n("Probabilités conditionnelles — Probabilité conditionnelle", "P(A∩B) = 0,2 et P(A) = 0,5. Calcule P_A(B).", 0.4, s("On connaît la probabilité de A et B simultanément ainsi que celle de A.", "Conditionner par A signifie que l’on se place uniquement parmi les cas où A est réalisé : P_A(B) = P(A∩B) ÷ P(A).", "On calcule 0,2 ÷ 0,5 = 0,4.", "Ainsi P_A(B) = 0,4. Cette probabilité est bien comprise entre 0 et 1.")),
    t("Produit scalaire — Orthogonalité", "Deux vecteurs ont un produit scalaire nul. Que peut-on conclure ?", "ils sont orthogonaux", s("Le produit scalaire des deux vecteurs est égal à zéro.", "Pour deux vecteurs non nuls, un produit scalaire nul caractérise l’orthogonalité.", "Il n’y a pas de calcul supplémentaire : on applique directement la caractérisation réciproque.", "Les deux vecteurs sont orthogonaux ; leurs directions forment un angle droit.")),
  ],
  "premiere-non-spe": [
    n("Pourcentages — Évolution", "Une quantité de 250 augmente de 8 %. Quelle est sa nouvelle valeur ?", 270, s("La valeur initiale est 250 et l’évolution est une hausse de 8 %.", "Une hausse de 8 % correspond au coefficient multiplicateur 1 + 8/100 = 1,08.", "On calcule directement 250 × 1,08 = 270. On peut aussi calculer 8 % de 250, soit 20, puis ajouter 20.", "La nouvelle valeur est 270.")),
    n("Fonctions affines — Image", "Pour f(x) = −2x + 7, calcule f(3).", 1, s("On cherche l’image de 3 : le nombre de départ est connu.", "Pour calculer une image, on remplace x par la valeur donnée en conservant les parenthèses et les signes.", "f(3) = −2 × 3 + 7 = −6 + 7.", "Ainsi f(3) = 1.")),
    n("Statistiques — Étendue", "Une série statistique va de 12 à 47. Calcule son étendue.", 35, s("La valeur minimale est 12 et la valeur maximale est 47 : ce sont les deux valeurs extrêmes de la série.", "L’étendue mesure l’écart entre ces deux extrêmes. On soustrait toujours la plus petite valeur à la plus grande : étendue = maximum − minimum.", "On calcule donc 47 − 12 = 35. Le résultat est positif, ce qui est cohérent puisqu’il représente une distance entre deux valeurs.", "L’étendue de la série est 35 : les données se répartissent sur un intervalle de largeur 35.")),
    n("Probabilités — Issues favorables", "Une urne contient 4 jetons gagnants sur 10. Quelle est la probabilité de gagner ?", 2/5, s("Il y a 4 issues favorables parmi 10 issues possibles équiprobables.", "Une probabilité se calcule par nombre d’issues favorables ÷ nombre total d’issues.", "La probabilité vaut d’abord 4/10. On simplifie le numérateur et le dénominateur par 2.", "La probabilité de gagner est 2/5, un nombre bien compris entre 0 et 1."), null, "2/5"),
    n("Algorithmique — Affectations", "On exécute x ← 4 puis x ← 3x + 2. Quelle est la valeur finale de x ?", 14, s("La première instruction affecte la valeur 4 à la variable x.", "Les instructions s’exécutent dans l’ordre ; à chaque nouvelle affectation, on utilise la valeur actuelle de la variable.", "Après x ← 4, on remplace x par 4 dans 3x + 2 : 3 × 4 + 2 = 12 + 2.", "La valeur finale de x est 14.")),
  ],
  "premiere-techno": [
    n("Pourcentages — Coefficient multiplicateur", "Quel coefficient multiplicateur correspond à une hausse de 15 % ?", 1.15, s("La valeur initiale représente 100 % et elle augmente de 15 %.", "Après une hausse de t %, le coefficient multiplicateur est 1 + t/100.", "On passe de 100 % à 115 %, puis 115 % = 115 ÷ 100 = 1,15.", "Le coefficient multiplicateur est 1,15. Il est supérieur à 1, ce qui est cohérent pour une hausse.")),
    n("Fonctions affines — Antécédent", "Pour f(x) = 5x − 3, cherche l’antécédent de 17.", 4, s("On connaît l’image 17 et on cherche le nombre de départ.", "Chercher un antécédent de 17 signifie résoudre f(x) = 17.", "On résout 5x − 3 = 17 : on ajoute 3 dans les deux membres, donc 5x = 20, puis on divise par 5.", "L’antécédent de 17 est 4. Vérification : 5 × 4 − 3 = 17.")),
    n("Second degré — Image", "Pour f(x) = x² − 4x + 1, calcule f(2).", -3, s("On cherche l’image de 2 par une fonction du second degré.", "On remplace chaque x par 2, en utilisant des parenthèses pour conserver correctement les signes et les puissances.", "f(2) = 2² − 4 × 2 + 1 = 4 − 8 + 1.", "Ainsi f(2) = −3. Le résultat négatif est possible : une image n’est pas nécessairement positive.")),
    n("Statistiques — Moyenne pondérée", "Une note 10 a coefficient 1 et une note 16 coefficient 2. Calcule la moyenne.", 14, s("La note 10 compte une fois et la note 16 compte deux fois.", "Pour une moyenne pondérée, on multiplie chaque valeur par son coefficient, puis on divise par la somme des coefficients.", "Somme pondérée : 10 × 1 + 16 × 2 = 42. Somme des coefficients : 1 + 2 = 3. On calcule 42 ÷ 3.", "La moyenne est 14, bien comprise entre 10 et 16.")),
    n("Algorithmique — Boucle", "Une boucle ajoute 3 à x quatre fois. Si x vaut 2 au départ, combien vaut-il à la fin ?", 14, s("La variable x vaut 2 au départ et la boucle répète quatre fois l’instruction ajouter 3.", "Une boucle applique exactement la même transformation autant de fois que l’indique son compteur.", "Quatre ajouts de 3 représentent 4 × 3 = 12. On ajoute cette variation à la valeur initiale : 2 + 12.", "À la fin de la boucle, x vaut 14. Une exécution pas à pas donne 2, 5, 8, 11, 14.")),
  ],
  "terminale-spe": [
    n("Fonction exponentielle — Équation", "Résous eˣ = e³.", 3, s("Les deux membres sont des exponentielles de même base e : leurs exposants sont x et 3.", "La fonction exponentielle est strictement croissante, donc injective : deux exponentielles sont égales si et seulement si leurs exposants sont égaux.", "On peut donc passer de eˣ = e³ à l’égalité des exposants x = 3. Il n’est pas nécessaire d’utiliser une valeur approchée de e.", "L’unique solution de l’équation est x = 3. La vérification est immédiate : e³ = e³.")),
    n("Dérivation — Tangente", "Pour f(x) = x² + 1, calcule le coefficient directeur de la tangente au point d’abscisse 2.", 4, s("La tangente est demandée au point d’abscisse 2 ; on cherche donc le nombre dérivé f′(2).", "Le coefficient directeur de la tangente à la courbe de f au point d’abscisse a est f′(a). Ici, la dérivée de x² + 1 est 2x.", "On remplace x par 2 dans la fonction dérivée : f′(2) = 2 × 2 = 4. On ne calcule pas f(2), qui donnerait l’ordonnée du point et non la pente.", "Le coefficient directeur de la tangente est 4 : lorsque x augmente localement de 1, la tangente monte de 4.")),
    n("Suites géométriques — Terme général", "Une suite géométrique vérifie u₀ = 3 et a pour raison 2. Calcule u₄.", 48, s("Le terme initial est u₀ = 3, la raison est q = 2 et on cherche le terme de rang 4.", "Pour une suite géométrique commençant au rang 0, uₙ = u₀ × qⁿ. L’exposant compte le nombre de multiplications par la raison entre u₀ et uₙ.", "On calcule u₄ = 3 × 2⁴ = 3 × 16 = 48. On retrouve aussi successivement 3, 6, 12, 24, 48.", "Ainsi u₄ = 48. Le calcul pas à pas confirme qu’il y a bien quatre multiplications par 2.")),
    n("Probabilités conditionnelles — Arbre pondéré", "Un chemin porte les probabilités 0,6 puis 0,4. Calcule la probabilité du chemin.", 0.24, s("Le chemin est constitué de deux branches successives portant les probabilités 0,6 puis 0,4.", "Dans un arbre pondéré, on multiplie les probabilités rencontrées le long d’un même chemin. On additionne seulement lorsqu’on réunit plusieurs chemins incompatibles.", "La probabilité du chemin vaut 0,6 × 0,4 = 0,24. Les deux facteurs étant compris entre 0 et 1, le produit est inférieur à chacun d’eux, ce qui est cohérent.", "La probabilité de ce chemin est 0,24, soit 24 %.")),
    t("Géométrie dans l'espace — Vecteurs", "Deux vecteurs directeurs sont colinéaires. Que peut-on dire des droites correspondantes ?", "elles sont parallèles", s("Chaque droite possède un vecteur directeur et les deux vecteurs donnés sont colinéaires.", "Deux vecteurs colinéaires ont la même direction, éventuellement avec des sens ou des longueurs différents. Deux droites dirigées par de tels vecteurs ont donc la même direction.", "Les droites ne peuvent pas être sécantes. Elles peuvent être distinctes et parallèles, ou confondues ; dans les deux cas, on dit qu’elles sont parallèles.", "Les droites correspondantes sont parallèles. La colinéarité des vecteurs directeurs fournit le critère de direction attendu.")),
  ],
  "terminale-techno": [
    n("Logarithme décimal — Équation", "Résous log(x) = 2.", 100, s("On cherche un nombre positif x dont le logarithme décimal est égal à 2.", "Le logarithme décimal et la puissance de 10 sont des opérations réciproques : log(x) = a équivaut à x = 10ᵃ, avec x strictement positif.", "On obtient x = 10², puis 10² = 10 × 10 = 100. La condition x > 0 est bien respectée.", "L’unique solution est x = 100. Vérification : log(100) = log(10²) = 2.")),
    n("Dérivation — Variations", "Une fonction vérifie f′(x) > 0 sur un intervalle. Quel code choisir : 1 pour croissante, −1 pour décroissante ?", 1, s("La dérivée f′ est strictement positive sur tout l’intervalle étudié.", "Le signe de la dérivée donne le sens de variation : si f′(x) > 0 sur un intervalle, alors f y est strictement croissante.", "Quand x augmente, les valeurs de f augmentent également. Parmi les deux codes proposés, 1 correspond à « croissante » et −1 à « décroissante ».", "Il faut choisir le code 1. Attention : le signe de f′ renseigne sur les variations de f, pas sur le signe de f.")),
    n("Suites géométriques — Évolution", "Une quantité vaut 200 et augmente de 5 % par an. Quelle est sa valeur après un an ?", 210, s("La valeur initiale est 200 et l’évolution annuelle est une hausse de 5 %.", "Une hausse de 5 % correspond au coefficient multiplicateur 1 + 5/100 = 1,05. Une évolution répétée conduit ainsi à une suite géométrique de raison 1,05.", "Après une année, on multiplie une fois par ce coefficient : 200 × 1,05 = 210. On peut aussi calculer 5 % de 200, soit 10, puis l’ajouter.", "La valeur après un an est 210. Elle est supérieure à 200, ce qui est cohérent avec une augmentation.")),
    n("Probabilités conditionnelles — Probabilité conditionnelle", "P(A∩B) = 0,18 et P(A) = 0,6. Calcule P_A(B).", 0.3, s("On connaît la probabilité de l’intersection A∩B, égale à 0,18, et celle de la condition A, égale à 0,6.", "Lorsque P(A) n’est pas nulle, la probabilité de B sachant A est P_A(B) = P(A∩B) ÷ P(A). Elle mesure la part des cas où B se réalise parmi ceux où A est réalisé.", "On calcule P_A(B) = 0,18 ÷ 0,6 = 0,3. On peut contrôler que 0,6 × 0,3 redonne bien 0,18.", "La probabilité conditionnelle P_A(B) vaut 0,3, soit 30 %.")),
    n("Statistiques — Moyenne pondérée", "Une valeur 20 a un effectif 3 et une valeur 30 un effectif 2. Calcule la moyenne.", 24, s("La valeur 20 apparaît trois fois et la valeur 30 apparaît deux fois : les effectifs jouent le rôle de poids.", "Pour calculer une moyenne pondérée, on additionne les produits valeur × effectif, puis on divise par l’effectif total.", "La somme pondérée est 20 × 3 + 30 × 2 = 60 + 60 = 120. L’effectif total vaut 3 + 2 = 5, donc la moyenne est 120 ÷ 5 = 24.", "La moyenne est 24. Elle est bien comprise entre la valeur minimale 20 et la valeur maximale 30.")),
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
