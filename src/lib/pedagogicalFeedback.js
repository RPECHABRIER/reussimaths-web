import { classifyLearningError } from "./learningError.js";

function labelOf(exercise) {
  return `${exercise?.chapter ?? ""} ${exercise?.prompt ?? ""}`;
}

function expectedOf(exercise) {
  if (exercise?.answerDisplay != null) return String(exercise.answerDisplay);
  if (Array.isArray(exercise?.answer)) {
    if (Array.isArray(exercise?.options)) {
      return exercise.answer.map((answer) => typeof answer === "number" ? exercise.options[answer] : answer).join(" ; ");
    }
    return exercise.answer.join(" ; ");
  }
  if (typeof exercise?.answer === "number") return String(exercise.answer).replace(".", ",");
  return String(exercise?.answer ?? "");
}

function unitOf(exercise) {
  if (typeof exercise?.answerUnit === "string") return exercise.answerUnit.trim();
  const stepTexts = Array.isArray(exercise?.steps)
    ? exercise.steps.map((step) => typeof step === "string" ? step : step?.text ?? "").join(" ")
    : "";
  const source = `${stepTexts} ${exercise?.prompt ?? ""}`;
  const matches = [...source.matchAll(/(?<![A-Za-zÀ-ÿ])(?:\\text\{)?(dam|km|hm|dm|cm|mm|daL|kL|hL|dL|cL|mL|m|L)(?:\\text\})?(\^?[23]|[²³])?(?![A-Za-zÀ-ÿ’'])|(%|€|°)/g)]
    .filter((match) => {
      if (match[3]) return true;
      const prefix = source.slice(Math.max(0, match.index - 20), match.index);
      return /(?:\d|en|de|soit|vaut)\s*$/i.test(prefix);
    });
  // Le pourcentage décrit ici l'évolution, pas l'unité du résultat.
  // Exemple : augmenter 80 € de 20 % donne encore un prix en euros.
  if (/augment|diminu|réduction|remise|évolution/i.test(source)) {
    const currency = matches.find((match) => match[3] === "€");
    if (currency) return "€";
  }
  const last = matches.at(-1);
  if (!last) return "";
  if (last[3]) return last[3];
  const exponent = (last[2] ?? "").replace("^2", "²").replace("^3", "³");
  return `${last[1]}${exponent}`;
}

const FAMILY_FEEDBACK = [
  {
    id: "whole_number_place_value",
    match: /numération.*grands nombres|milliers?|centaines?.*dizaines?/i,
    intro: "Non, la valeur des chiffres n’a pas été reliée correctement à leur position dans le nombre.",
    meaning: "Dans notre système décimal, chaque rang vaut dix fois le rang situé à sa droite. Un millier vaut 1 000, une centaine vaut 100, une dizaine vaut 10 et une unité vaut 1.",
    rule: "Décompose chaque rang séparément, puis additionne milliers, centaines, dizaines et unités.",
  },
  {
    id: "arithmetic_order",
    match: /calcul.*priorités|priorités? opératoires?|calcul.*multiplication.*addition/i,
    intro: "Non, les opérations ont été effectuées simplement de gauche à droite sans respecter leur priorité.",
    meaning: "Sans parenthèses, les multiplications et les divisions sont effectuées avant les additions et les soustractions. Les parenthèses, lorsqu’elles existent, passent en premier.",
    rule: "Parenthèses d’abord ; puis multiplications et divisions ; enfin additions et soustractions.",
  },
  {
    id: "number_theory",
    match: /nombres? entiers?|division euclidienne|divisib|multiple|diviseur|nombre premier|PGCD|facteurs premiers|parité/i,
    intro: "Non, la propriété des nombres entiers utilisée ne correspond pas encore à la question posée.",
    meaning: "Les questions de divisibilité s’appuient sur des relations exactes entre entiers : un diviseur ne laisse aucun reste, une décomposition en facteurs premiers ne contient que des nombres premiers et le PGCD rassemble les facteurs communs.",
    rule: "Identifie d’abord s’il faut diviser, tester un reste, décomposer ou chercher un diviseur commun, puis vérifie le résultat par une multiplication.",
  },
  {
    id: "combinatorics",
    match: /combinatoire|dénombrement|coefficients? binomiaux?|factorielle|\bparties d['’]un ensemble\b|principe multiplicatif/i,
    intro: "Non, le comptage ne tient pas correctement compte de l’ordre, de la répétition ou des choix successifs.",
    meaning: "Dénombrer consiste à compter chaque possibilité une seule fois. On multiplie le nombre de choix lors d’étapes successives ; on utilise une combinaison lorsque l’ordre des éléments choisis ne compte pas.",
    rule: "Demande-toi d’abord si l’ordre compte et si une répétition est autorisée, puis choisis produit, factorielle ou coefficient binomial.",
  },
  {
    id: "random_variables",
    match: /variables? aléatoires?|loi binomiale|Bernoulli|espérance.*variance|variance.*espérance|fluctuation d['’]échantillonnage/i,
    intro: "Non, la valeur possible de la variable, sa probabilité et l’indicateur demandé ont été confondus.",
    meaning: "Une variable aléatoire associe un nombre à chaque issue. Son espérance est une moyenne pondérée par les probabilités ; sa variance mesure la dispersion autour de cette moyenne. Pour une loi binomiale, les paramètres n et p décrivent le nombre d’épreuves et la probabilité de succès.",
    rule: "Écris les valeurs avec leurs probabilités, vérifie que les probabilités totalisent 1, puis applique la formule de l’espérance, de la variance ou de la loi binomiale.",
  },
  {
    id: "decimal_operations",
    match: /opérations? sur les décimaux|nombres? décimaux?/i,
    intro: "Non, la valeur de position des chiffres ou l’opération adaptée aux nombres décimaux n’a pas été respectée.",
    meaning: "Un nombre décimal représente des unités, des dixièmes, des centièmes, etc. Dans une addition ou une soustraction, les virgules s’alignent ; dans une multiplication ou une division, on calcule d’abord puis on contrôle l’ordre de grandeur.",
    rule: "Choisis l’opération à partir du sens de la question, pose les nombres en respectant les rangs et vérifie que le résultat a un ordre de grandeur plausible.",
  },
  {
    id: "calculation_strategy",
    match: /nommer un calcul|choisir une opération|programme de calcul|calcul numérique|réviser les bases.*(?:problèmes?|automatismes)|préparation (?:au brevet|au bac|EAM).*(?:nombres|automatismes)|automatismes.*(?:nombres et calculs|multiplier|diviser|facteur manquant|égalité à trou|ordre de grandeur|doubles et moitiés)|exercices transversaux.*révisions|exercices de fin d['’]année.*nombres et calculs/i,
    intro: "Non, l’opération choisie ou l’ordre des instructions ne traduit pas correctement la situation.",
    meaning: "Avant de calculer, il faut traduire les mots de l’énoncé : réunir ou augmenter conduit souvent à additionner, chercher un écart à soustraire, former des groupes égaux à multiplier et partager équitablement à diviser.",
    rule: "Écris en une phrase ce que représente le résultat recherché, traduis cette phrase par un calcul, puis vérifie l’unité et la vraisemblance de la réponse.",
  },
  {
    id: "compound_measures",
    match: /vitesse, énergie, débit|mesures et grandeurs.*(?:vitesse|énergie|débit)|distance.*temps|débit.*volume/i,
    intro: "Non, les grandeurs ou leurs unités n’ont pas été reliées par la bonne formule.",
    meaning: "Une vitesse compare une distance à une durée, un débit compare une quantité à une durée et une énergie peut être obtenue à partir d’une puissance et d’un temps. Les unités doivent être rendues compatibles avant le calcul.",
    rule: "Écris la formule avec les grandeurs, convertis les unités si nécessaire, remplace par les données puis indique l’unité du résultat.",
  },
  {
    id: "duration_calculation",
    match: /grandeurs et mesures.*durées|comparer des durées|convertis?.*(?:minutes|secondes|heures)|durée.*(?:minutes|secondes|heures)/i,
    intro: "Non, les heures, minutes et secondes ont été traitées comme les chiffres d’un nombre décimal ordinaire.",
    meaning: "Les unités de durée ne suivent pas une base 10 : une minute contient 60 secondes et une heure contient 60 minutes. Il faut donc convertir les deux durées dans une même unité avant de les comparer ou de les calculer.",
    rule: "Choisis une unité commune, utilise 1 h = 60 min et 1 min = 60 s, puis reconvertis le résultat si la question le demande.",
  },
  {
    id: "sequence_convergence",
    match: /suites?|somme des n premiers entiers/i,
    intro: "Non, le type de suite, son mode de définition ou l’argument de convergence n’a pas été identifié correctement.",
    meaning: "Une suite peut être donnée par une formule explicite ou une relation de récurrence. Pour étudier sa limite, on combine son sens de variation, ses bornes et les limites de référence ; une démonstration par récurrence comporte initialisation, hérédité et conclusion.",
    rule: "Repère d’abord comment la suite est définie et ce qui doit être démontré, puis utilise la formule, la récurrence ou le théorème de convergence adapté.",
  },
  {
    id: "integral_calculus",
    match: /calcul intégral|intégrale|primitive|aire sous (?:la )?courbe/i,
    intro: "Non, le signe de la fonction, les bornes ou la primitive n’ont pas été utilisés correctement.",
    meaning: "Une intégrale mesure une accumulation algébrique entre deux bornes. On cherche une primitive F de la fonction, puis on calcule F(b)−F(a). Si la fonction est positive, cette intégrale représente l’aire sous la courbe.",
    rule: "Vérifie les bornes et le signe, détermine une primitive, puis calcule toujours valeur à la borne haute moins valeur à la borne basse.",
  },
  {
    id: "real_number_sets",
    match: /nombres et calculs.*(?:intervalles|racines carrées|valeur absolue|comparer deux quantités)|calcul numérique.*racines carrées/i,
    intro: "Non, la définition de l’intervalle, de la valeur absolue ou de la racine carrée n’a pas été appliquée correctement.",
    meaning: "Un intervalle décrit un ensemble de réels, la valeur absolue mesure une distance à zéro et la racine carrée de a désigne le nombre positif dont le carré vaut a. Ces objets ont chacun des conditions d’utilisation précises.",
    rule: "Identifie l’objet demandé, vérifie les valeurs interdites ou les bornes, puis reviens à sa définition avant de calculer.",
  },
  {
    id: "space_vectors",
    match: /vecteurs? de l['’]espace|orthogonalité et distances|vecteur normal|distance point-plan|positions relatives/i,
    intro: "Non, les coordonnées ou la propriété géométrique des vecteurs de l’espace n’ont pas été exploitées correctement.",
    meaning: "Dans l’espace, un vecteur possède trois coordonnées. La colinéarité décrit une même direction, l’orthogonalité se vérifie avec un produit scalaire nul et un vecteur normal permet de décrire la direction perpendiculaire à un plan.",
    rule: "Écris les trois coordonnées, choisis colinéarité ou produit scalaire selon la question, puis interprète le résultat dans la configuration géométrique.",
  },
  {
    id: "decimal_place_value",
    match: /numération décimale|dixièmes?|centièmes?|millièmes?|valeur de position/i,
    intro: "Non, la valeur de chaque chiffre n’a pas été prise en compte correctement : un dixième vaut 0,1, un centième vaut 0,01 et un millième vaut 0,001.",
    meaning: "Dans un nombre décimal, la position du chiffre indique sa valeur. Pour additionner, transforme si nécessaire les dixièmes ou les centièmes en écriture décimale, puis place les virgules l’une sous l’autre.",
    rule: "Écris les nombres avec leurs virgules alignées, complète les positions manquantes par des zéros si besoin, puis calcule colonne par colonne.",
  },
  {
    id: "relative_product",
    match: /relatifs?.*(?:produit|multiplier|division)|(?:produit|multiplie|divise).*nombres? (?:négatifs?|relatifs?)/i,
    intro: "Non, la valeur absolue du calcul est correcte, mais la règle des signes du produit ou du quotient n’a pas été appliquée correctement.",
    meaning: "Deux nombres de même signe donnent un résultat positif ; deux nombres de signes opposés donnent un résultat négatif. On calcule ensuite avec les distances à zéro.",
    rule: "Détermine d’abord le signe du résultat, puis multiplie ou divise les distances à zéro.",
  },
  {
    id: "fraction_simplification",
    match: /fraction.*(?:simplif|irréductible)|(?:simplif|irréductible).*fraction/i,
    intro: "Non, la fraction obtenue a encore un diviseur commun au numérateur et au dénominateur : elle n’est donc pas encore irréductible.",
    meaning: "Simplifier une fraction consiste à diviser le nombre du haut et le nombre du bas par un même nombre. Cela ne change pas la valeur de la fraction.",
    rule: "Cherche un diviseur commun, divise en haut et en bas, puis recommence jusqu’à ce qu’il n’en reste plus.",
  },
  {
    id: "rounding",
    match: /arrond|valeur approchée/i,
    intro: "Non, tu as tronqué le nombre ou utilisé le mauvais chiffre pour décider de l’arrondi.",
    meaning: "Repère d’abord le chiffre situé au rang demandé, puis regarde uniquement le chiffre qui le suit. S’il vaut 5 ou plus, on augmente le chiffre conservé d’une unité.",
    rule: "Conserve tous les chiffres pendant les calculs et arrondis seulement à la fin, au rang demandé.",
  },
  {
    id: "fraction_of_number",
    match: /fraction d['’](?:un nombre|une quantité)|calculer.*fraction.*(?:nombre|quantité)/i,
    intro: "Non, la fraction n’a pas été appliquée correctement à la quantité de départ.",
    meaning: "Prendre une fraction d’une quantité, c’est partager d’abord cette quantité selon le dénominateur, le nombre du bas, puis prendre le nombre de parts indiqué par le numérateur.",
    rule: "Divise la quantité par le dénominateur, puis multiplie le résultat par le numérateur.",
  },
  {
    id: "fraction_equivalence",
    match: /fractions? égales|fraction équivalente/i,
    intro: "Non, le numérateur et le dénominateur n’ont pas été transformés par le même nombre.",
    meaning: "Une fraction conserve sa valeur lorsqu’on multiplie ou lorsqu’on divise son numérateur et son dénominateur par un même nombre non nul.",
    rule: "Repère le facteur utilisé en bas, puis applique exactement le même facteur en haut.",
  },
  {
    id: "fraction_comparison",
    match: /fractions?.*(?:comparer|ranger|encadrer)|(?:comparer|ranger|encadrer).*fractions?/i,
    intro: "Non, les deux fractions ne peuvent pas être comparées directement sous leur forme actuelle.",
    meaning: "Pour comparer sûrement deux fractions, donne-leur le même dénominateur afin que les parts aient la même taille. Il suffit alors de comparer les numérateurs.",
    rule: "Obtiens des dénominateurs identiques, puis compare les nombres de parts.",
  },
  {
    id: "fraction_multiplication",
    match: /fractions?.*multiplier|multiplier.*fractions?/i,
    intro: "Non, la multiplication de fractions n’utilise pas la méthode de l’addition.",
    meaning: "Pour multiplier deux fractions, on multiplie les numérateurs entre eux et les dénominateurs entre eux. Il n’est pas nécessaire d’obtenir un dénominateur commun.",
    rule: "Simplifie en priorité si c’est possible, puis multiplie en haut et en bas.",
  },
  {
    id: "equation_test",
    match: /équation.*tester|tester.*(?:égalité|solution|équation)/i,
    intro: "Non, la valeur proposée ne donne pas le même résultat dans les deux membres de l’équation.",
    meaning: "Tester une solution signifie remplacer l’inconnue par la valeur proposée, calculer séparément le membre de gauche et le membre de droite, puis comparer les deux résultats.",
    rule: "La valeur est solution si, et seulement si, les deux membres deviennent égaux.",
  },
  {
    id: "equation_product_zero",
    match: /produit nul/i,
    intro: "Non, la règle du produit nul n’a pas été appliquée à chacun des facteurs.",
    meaning: "Un produit est nul si, et seulement si, au moins l’un de ses facteurs est nul. Il faut donc résoudre séparément chaque équation obtenue.",
    rule: "A × B = 0 signifie A = 0 ou B = 0 : pense à chercher toutes les solutions.",
  },
  {
    id: "equation_square",
    match: /x²\s*=|x\^2\s*=|carré.*équation/i,
    intro: "Non, une équation de la forme x² = a peut avoir deux solutions, une seule ou aucune selon la valeur de a.",
    meaning: "Si a est strictement positif, les deux nombres opposés √a et −√a ont le même carré. Si a = 0, la seule solution est 0 ; si a est négatif, il n’existe aucune solution réelle.",
    rule: "Étudie d’abord le signe de a, puis n’oublie pas les deux solutions opposées lorsque a est positif.",
  },
  {
    id: "percentage_conversion",
    match: /(?:fraction|décimal).*vers pourcentage|convert(?:ir|is).*(?:probabilité|fraction|décimal).*pourcentage/i,
    intro: "Non, l’écriture obtenue ne représente pas la même proportion que le nombre de départ.",
    meaning: "Un pourcentage est une fraction sur 100. Pour passer d’un nombre décimal à un pourcentage, on le multiplie par 100 ; dans l’autre sens, on le divise par 100.",
    rule: "Contrôle que la proportion garde la même valeur avant et après l’ajout du symbole %.",
  },
  {
    id: "percentage_from_counts",
    match: /pourcentage.*effectif|effectifs?.*pourcentage|pourcentage depuis/i,
    intro: "Non, l’effectif favorable n’a pas été comparé à l’effectif total.",
    meaning: "Le pourcentage indique la proportion d’individus concernés parmi l’ensemble. On divise donc l’effectif favorable par l’effectif total.",
    rule: "Calcule effectif favorable ÷ effectif total, puis multiplie par 100.",
  },
  {
    id: "percentage_change",
    match: /évolution.*pourcentage|pourcentage.*évolution|augment(?:e[rz]?|ation)|diminu(?:e[rz]?|tion)|taux d['’]évolution|remise|réduction/i,
    intro: "Non, le pourcentage d’évolution ne doit pas être ajouté ou retiré comme un nombre ordinaire.",
    meaning: "Une évolution en pourcentage dépend de la valeur initiale. On calcule la part correspondante, puis on l’ajoute lors d’une augmentation ou on la retire lors d’une diminution.",
    rule: "Augmentation de t % : coefficient 1 + t/100. Diminution de t % : coefficient 1 − t/100.",
  },
  {
    id: "percentage_of_number",
    match: /calcule.*\d+(?:[,.]\d+)?\s*%\s+de|pourcentages?.*(?:calculer une proportion|proportion d['’]une quantité)/i,
    intro: "Non, le pourcentage a été utilisé comme un nombre ordinaire au lieu d’être appliqué à la quantité de référence.",
    meaning: "Un pourcentage représente une fraction sur 100 de la quantité de référence. On peut souvent calculer d’abord 10 %, puis obtenir le pourcentage demandé par multiplication ou addition.",
    rule: "t % d’une quantité = quantité × t ÷ 100.",
  },
  {
    id: "percentage_coefficient",
    match: /coefficient multiplicateur.*(?:hausse|baisse|pourcentage)|pourcentages?.*coefficient multiplicateur/i,
    intro: "Non, le taux en pourcentage et le coefficient multiplicateur ont été confondus.",
    meaning: "Le coefficient multiplicateur représente directement la proportion finale. Après une hausse de t %, la valeur finale représente 100+t % de la valeur initiale ; après une baisse, elle en représente 100−t %.",
    rule: "Hausse de t % : coefficient 1+t/100. Baisse de t % : coefficient 1−t/100.",
  },
  {
    id: "function_image",
    match: /fonctions?.*\bimages?\b(?!.*antécédent)|\bimage de\b|calcul(?:e|er).*f\s*\(/i,
    intro: "Non, tu as confondu le nombre de départ avec son résultat d’arrivée, ou tu n’as pas remplacé la variable par la valeur donnée.",
    meaning: "Pour calculer une image, le nombre de départ est connu. On le remplace à la place de x dans l’expression de la fonction, puis on effectue le calcul.",
    rule: "Image de a : écris f(a), remplace x par a, puis calcule.",
  },
  {
    id: "function_antecedent",
    match: /fonctions?.*antécédent|antécédent.*fonctions?/i,
    intro: "Non, tu as donné le résultat d’arrivée au lieu de rechercher le nombre de départ qui produit ce résultat.",
    meaning: "Chercher un antécédent de b signifie chercher toutes les valeurs de x telles que f(x)=b. Par le calcul, on résout une équation ; sur un graphique, on part de b sur l’axe des ordonnées.",
    rule: "Antécédent de b : résous f(x)=b et vérifie si plusieurs réponses sont possibles.",
  },
  {
    id: "function_affine_coefficients",
    match: /fonctions? affines?.*(?:coefficient|identifier a et b|déterminer)|(?:coefficient directeur|ordonnée à l['’]origine).*fonction/i,
    intro: "Non, le coefficient directeur et l’ordonnée à l’origine ont été confondus ou lus au mauvais endroit.",
    meaning: "Dans f(x)=ax+b, a mesure la variation de f lorsque x augmente d’une unité, tandis que b=f(0) est l’ordonnée du point où la droite coupe l’axe vertical.",
    rule: "Repère d’abord b à x=0, puis calcule a comme variation verticale ÷ variation horizontale.",
  },
  {
    id: "function_variations",
    match: /fonctions?.*(?:sens de variation|variations|croissante|décroissante)|variations.*fonctions?|variations? (?:globales|instantanées)|variations et courbes/i,
    intro: "Non, le sens de variation a été lu dans le mauvais sens ou sur le mauvais intervalle.",
    meaning: "On parcourt toujours les valeurs de x de gauche à droite. Si les images montent, la fonction est croissante ; si elles descendent, elle est décroissante.",
    rule: "Lis l’intervalle sur l’axe des abscisses, puis décris l’évolution des images de gauche à droite.",
  },
  {
    id: "function_domain",
    match: /ensemble de définition|domaine de définition/i,
    intro: "Non, l’ensemble proposé contient une valeur interdite ou oublie une partie des nombres pour lesquels la fonction existe.",
    meaning: "L’ensemble de définition regroupe toutes les valeurs de x que l’on peut utiliser. Un dénominateur ne peut pas être nul et une racine carrée réelle ne peut pas porter sur un nombre négatif.",
    rule: "Cherche les valeurs interdites, puis écris tous les x restants sous forme d’intervalle ou d’ensemble.",
  },
  {
    id: "statistics_mean",
    match: /statistiques?.*moyenne|\bmoyenne\b.*(?:effectif|série|statistique)/i,
    intro: "Non, toutes les valeurs n’ont pas été prises en compte avec leur effectif, ou la somme n’a pas été divisée par l’effectif total.",
    meaning: "La moyenne est la valeur que l’on obtiendrait en répartissant équitablement le total. Avec des effectifs, chaque valeur doit être comptée autant de fois qu’elle apparaît.",
    rule: "Calcule la somme des produits valeur × effectif, puis divise par l’effectif total.",
  },
  {
    id: "statistics_median",
    match: /médiane/i,
    intro: "Non, la série n’a pas été ordonnée ou la position centrale n’a pas été déterminée correctement.",
    meaning: "La médiane partage une série ordonnée en deux groupes de même effectif. Si l’effectif est impair, on prend la valeur centrale ; s’il est pair, on fait la moyenne des deux valeurs centrales.",
    rule: "Range d’abord les valeurs, compte l’effectif, puis repère la ou les positions centrales.",
  },
  {
    id: "statistics_quartiles",
    match: /quartile|diagramme en boîte/i,
    intro: "Non, la position du quartile n’a pas été repérée dans la série ordonnée.",
    meaning: "Le premier quartile est la première valeur pour laquelle au moins 25 % des données lui sont inférieures ou égales ; le troisième quartile correspond de même à 75 %.",
    rule: "Ordonne la série, calcule le rang par excès, puis lis la valeur située à ce rang.",
  },
  {
    id: "statistics_range",
    match: /étendue/i,
    intro: "Non, l’étendue n’est ni la plus grande valeur ni une moyenne.",
    meaning: "L’étendue mesure l’écart total entre les deux valeurs extrêmes de la série. Elle indique sur quelle largeur les données sont dispersées, sans tenir compte des valeurs intermédiaires.",
    rule: "Étendue = valeur maximale − valeur minimale.",
  },
  {
    id: "probability_contrary",
    match: /événement contraire|complémentaire/i,
    intro: "Non, l’événement contraire doit regrouper exactement tous les cas où l’événement de départ ne se produit pas.",
    meaning: "Un événement et son contraire ne peuvent pas se produire ensemble, mais l’un des deux se produit forcément. La somme de leurs probabilités vaut donc 1.",
    rule: "P(événement contraire)=1−P(événement).",
  },
  {
    id: "probability_conditional",
    match: /^(?!.*(?:arbre|indépendance|indépendants)).*(?:probabilit(?:é|és) conditionnelle|sachant que)/i,
    intro: "Non, la probabilité a été calculée dans l’univers de départ alors que l’information « sachant que » réduit les possibilités.",
    meaning: "Dans P_A(B), on sait que A est réalisé. A devient donc le nouvel univers et l’on cherche, parmi les cas de A, ceux qui réalisent aussi B.",
    rule: "P_A(B)=P(A∩B)÷P(A), à condition que P(A) ne soit pas nulle.",
  },
  {
    id: "probability_tree",
    match: /arbre (?:pondéré|de probabilités)/i,
    intro: "Non, les probabilités n’ont pas été combinées selon le chemin correspondant à l’événement.",
    meaning: "Sur un même chemin de l’arbre, on multiplie les probabilités. Pour réunir plusieurs chemins incompatibles conduisant au même événement, on additionne ensuite leurs probabilités.",
    rule: "Multiplie le long de chaque chemin, puis additionne les chemins qui conviennent.",
  },
  {
    id: "probability_independence",
    match: /indépendance|indépendants/i,
    intro: "Non, deux événements ne sont pas indépendants simplement parce qu’ils sont différents ou incompatibles.",
    meaning: "Deux événements sont indépendants lorsque savoir que l’un est réalisé ne change pas la probabilité de l’autre.",
    rule: "Vérifie P(A∩B)=P(A)×P(B), ou de façon équivalente P_A(B)=P(B).",
  },
  {
    id: "probability_frequency",
    match: /fréquence et probabilité|loi des grands nombres|fréquence.*expérience/i,
    intro: "Non, une fréquence observée et une probabilité théorique ne sont pas exactement le même objet.",
    meaning: "La fréquence dépend des résultats obtenus pendant l’expérience. Lorsque le nombre d’essais devient grand, elle tend à se rapprocher de la probabilité théorique.",
    rule: "Fréquence = nombre de réalisations de l’événement ÷ nombre total d’essais.",
  },
  {
    id: "geometry_thales",
    match: /Thalès|triangles semblables/i,
    intro: "Non, les longueurs n’ont pas été associées dans le même ordre, ou les conditions du théorème de Thalès ne sont pas vérifiées.",
    meaning: "Avant tout calcul, vérifie l’alignement des points et le parallélisme des droites. Les côtés correspondants des deux triangles sont alors proportionnels.",
    rule: "Écris les rapports dans le même ordre, remplace par les longueurs connues, puis résous l’égalité.",
  },
  {
    id: "geometry_trigonometry",
    match: /trigonométr|sinus|cosinus|tangente.*triangle/i,
    intro: "Non, le rapport trigonométrique choisi ne relie pas correctement les côtés connus et le côté recherché.",
    meaning: "Dans un triangle rectangle, commence par repérer l’hypoténuse, le côté opposé et le côté adjacent par rapport à l’angle étudié.",
    rule: "Cosinus = adjacent/hypoténuse ; sinus = opposé/hypoténuse ; tangente = opposé/adjacent.",
  },
  {
    id: "geometry_circle_measure",
    match: /(?:périmètre|aire).*(?:cercle|disque)|(?:cercle|disque).*(?:périmètre|aire)/i,
    intro: "Non, le rayon et le diamètre ont été confondus, ou la formule de l’aire a été utilisée à la place de celle du périmètre.",
    meaning: "Le périmètre mesure le tour du cercle et utilise 2πr, tandis que l’aire mesure la surface du disque et utilise πr². Le diamètre vaut deux fois le rayon.",
    rule: "Identifie d’abord rayon ou diamètre, choisis la formule correspondant à la grandeur demandée, puis écris l’unité adaptée.",
  },
  {
    id: "geometry_volume",
    match: /volume d['’](?:un|une)|volumes? (?:composés?|et capacités)|géométrie dans l'espace.*volumes?/i,
    intro: "Non, une dimension manque dans le calcul, ou la formule ne correspond pas au solide étudié.",
    meaning: "Un volume mesure l’espace occupé en trois dimensions. Repère la base du solide, calcule son aire, puis utilise la hauteur perpendiculaire à cette base.",
    rule: "Prisme ou cylindre : aire de base × hauteur. Pyramide ou cône : aire de base × hauteur ÷ 3.",
  },
  {
    id: "geometry_triangle_angles",
    match: /angles? d['’]un triangle|troisième angle|triangle isocèle.*angle/i,
    intro: "Non, la somme des angles du triangle ou la propriété du triangle particulier n’a pas été utilisée correctement.",
    meaning: "Dans tout triangle, la somme des trois angles vaut 180°. Dans un triangle isocèle, les deux angles à la base sont égaux ; dans un triangle rectangle, un angle vaut 90°.",
    rule: "Écris 180° moins les angles connus, puis utilise la propriété du triangle particulier si nécessaire.",
  },
  {
    id: "geometry_triangle_existence",
    match: /existence d['’]un triangle|inégalité triangulaire/i,
    intro: "Non, les trois longueurs ne permettent pas nécessairement de construire un triangle.",
    meaning: "Pour qu’un triangle non aplati existe, la plus grande longueur doit être strictement inférieure à la somme des deux autres.",
    rule: "Repère la plus grande longueur et compare-la à la somme des deux autres.",
  },
  {
    id: "geometry_transformations",
    match: /géométrie.*(?:symétrie|translation|rotation|homothétie)|transformations? —|distances et symétries|géométrie plane.*translations|exercices.*translations|automatisme.*symétrie|\b(?:rotation|homothétie)\b/i,
    intro: "Non, la transformation ou l’un de ses éléments caractéristiques n’a pas été identifié correctement.",
    meaning: "Une symétrie, une translation et une rotation conservent les longueurs et les angles. Une homothétie multiplie les longueurs par son rapport et les aires par le carré de ce rapport.",
    rule: "Identifie le centre, l’axe, le vecteur, l’angle ou le rapport avant de construire ou de calculer l’image.",
  },
  {
    id: "geometry_polygon_measure",
    match: /parallélogramme.*(?:aire|périmètre)|automatisme.*aire d['’]un triangle|opérations.*aire et périmètre|grandeurs.*périmètre et aire|périmètre d['’]une figure complexe/i,
    intro: "Non, la formule utilisée ne correspond pas à la grandeur ou à la figure demandée.",
    meaning: "Le périmètre mesure le contour et s’exprime avec une unité de longueur. L’aire mesure la surface et s’exprime avec une unité au carré. Une hauteur doit être perpendiculaire à la base choisie.",
    rule: "Identifie la figure, choisis une base et sa hauteur si nécessaire, puis utilise la formule et l’unité adaptées.",
  },
  {
    id: "geometry_parallelism",
    match: /droites parallèles|tester le parallélisme|perpendiculaires?/i,
    intro: "Non, la position des droites ne peut pas être conclue sans utiliser le codage ou une propriété précise.",
    meaning: "Deux droites parallèles ne se rencontrent pas. Deux droites perpendiculaires forment un angle droit. Des angles correspondants ou alternes-internes permettent aussi d’établir un parallélisme lorsque les conditions sont réunies.",
    rule: "Nomme la propriété utilisée et vérifie toutes ses conditions avant de conclure.",
  },
  {
    id: "geometry_coordinates",
    match: /géométrie repérée|repérage|coordonnées?.*(?:point|vecteur|milieu)/i,
    intro: "Non, les abscisses et les ordonnées ont été inversées ou la formule n’a pas été appliquée coordonnée par coordonnée.",
    meaning: "Dans les coordonnées (x ; y), x est l’abscisse lue horizontalement et y l’ordonnée lue verticalement. Pour un milieu ou un vecteur, on traite séparément les deux coordonnées.",
    rule: "Écris d’abord la formule sur x, puis la formule sur y, et conserve l’ordre (abscisse ; ordonnée).",
  },
  {
    id: "geometry_solids_vocabulary",
    match: /géométrie dans l'espace.*vocabulaire|patrons?|perspective cavalière/i,
    intro: "Non, l’élément nommé ne correspond pas à sa position ou à son rôle dans le solide.",
    meaning: "Une face est une surface plane, une arête est un segment commun à deux faces et un sommet est un point où plusieurs arêtes se rencontrent. La hauteur est perpendiculaire à la base.",
    rule: "Repère l’objet sur la figure avant de choisir son nom et distingue toujours hauteur, arête et génératrice.",
  },
  {
    id: "geometry_vectors",
    match: /vecteurs?|colinéarité/i,
    intro: "Non, les coordonnées, la direction ou le sens du vecteur n’ont pas été déterminés correctement.",
    meaning: "Les coordonnées du vecteur AB s’obtiennent en faisant arrivée moins départ pour chaque coordonnée : xB−xA puis yB−yA.",
    rule: "Traite séparément abscisses et ordonnées, puis vérifie la direction et le sens du vecteur obtenu.",
  },
  {
    id: "probability_basic",
    match: /issues? favorables?|boules?.*(?:rouge|bleue)|probabilit(?:é|és).*(?:dé|sac|urne)/i,
    intro: "Non, tu as comparé les issues favorables à une partie des autres issues, au lieu de les comparer à toutes les issues possibles.",
    meaning: "Dans une situation équiprobable, le numérateur compte les issues qui réalisent l’événement et le dénominateur compte toutes les issues possibles.",
    rule: "Probabilité = nombre d’issues favorables ÷ nombre total d’issues possibles. Vérifie ensuite que le résultat est compris entre 0 et 1.",
  },
  {
    id: "geometry_measure_unit",
    match: /quelle unité.*(?:aire|volume|longueur)|unité convient.*(?:aire|volume|longueur)|unité d['’](?:aire|un volume|une longueur)/i,
    intro: "Non, l’unité choisie ne correspond pas à la grandeur mesurée.",
    meaning: "Une longueur mesure une dimension et utilise une unité simple. Une aire mesure une surface en deux dimensions et utilise une unité au carré. Un volume mesure l’espace en trois dimensions et utilise une unité au cube.",
    rule: "Longueur : unité simple ; aire : unité² ; volume : unité³.",
  },
  {
    id: "multiple_choice_reasoning",
    match: /plusieurs réponses|sélectionne toutes|affirmations vraies/i,
    intro: "Non, au moins une affirmation vraie manque ou une affirmation fausse a été conservée.",
    meaning: "Dans une question à plusieurs réponses, chaque affirmation doit être testée séparément. Le fait d’en avoir trouvé une vraie ne permet pas de s’arrêter.",
    rule: "Teste toutes les propositions, élimine chacune de celles qui est fausse, puis vérifie que tu n’as oublié aucune proposition vraie.",
  },
  {
    id: "algebra_second_degree",
    match: /second degré|discriminant|trinôme/i,
    intro: "Non, les coefficients ou la formule du second degré n’ont pas été appliqués correctement.",
    meaning: "Dans ax²+bx+c, commence par identifier a, b et c avec leurs signes. Le discriminant Δ=b²−4ac indique ensuite le nombre de solutions réelles.",
    rule: "Identifie a, b et c ; calcule Δ ; puis choisis la formule adaptée au signe de Δ.",
  },
  {
    id: "calculus_derivative",
    match: /dériv|nombre dérivé|tangente/i,
    intro: "Non, la fonction dérivée ou la valeur où elle doit être calculée n’a pas été utilisée correctement.",
    meaning: "Le nombre dérivé f′(a) est le coefficient directeur de la tangente à la courbe au point d’abscisse a. Son signe indique localement si la fonction monte ou descend.",
    rule: "Détermine d’abord f′(x), puis remplace x par la valeur demandée ou étudie son signe.",
  },
  {
    id: "sequences",
    match: /suites? (?:arithmétiques?|géométriques?)|terme général.*suite|raison.*suite/i,
    intro: "Non, la formule du terme général ou le nombre d’étapes depuis le terme initial a été mal identifié.",
    meaning: "Une suite arithmétique ajoute toujours la même raison ; une suite géométrique multiplie toujours par la même raison. L’indice compte le nombre de passages depuis le terme initial.",
    rule: "Arithmétique : uₙ=u₀+n×r. Géométrique : uₙ=u₀×qⁿ.",
  },
  {
    id: "exponential_logarithm",
    match: /exponentielle|logarithme|\blog\s*\(|eˣ/i,
    intro: "Non, la relation entre l’exponentielle, le logarithme et leur exposant n’a pas été utilisée correctement.",
    meaning: "L’exponentielle et le logarithme permettent de retrouver un exposant. Avec le logarithme décimal, log(x)=a signifie x=10ᵃ.",
    rule: "Réécris les deux membres avec la même fonction, puis compare les exposants ou utilise la fonction réciproque.",
  },
  {
    id: "algorithm_assignments",
    match: /algorithm|affectation|boucle.*(?:ajoute|répète|inconditionnelle)/i,
    intro: "Non, les instructions n’ont pas été exécutées dans l’ordre ou la nouvelle valeur de la variable n’a pas remplacé l’ancienne.",
    meaning: "Une affectation remplace la valeur précédente de la variable. Dans une boucle, la même instruction est répétée exactement le nombre de fois indiqué.",
    rule: "Crée une ligne par instruction ou par tour de boucle et mets à jour la variable après chaque ligne.",
  },
  {
    id: "geometry_dot_product",
    match: /produit scalaire|vecteurs?.*orthogonaux/i,
    intro: "Non, le produit scalaire n’a pas été relié correctement à l’angle ou à l’orthogonalité des vecteurs.",
    meaning: "Le produit scalaire de deux vecteurs orthogonaux est nul. Réciproquement, pour deux vecteurs non nuls, un produit scalaire nul permet de conclure qu’ils sont orthogonaux.",
    rule: "Calcule le produit scalaire, puis utilise son signe ou sa nullité pour interpréter la géométrie.",
  },
  {
    id: "geometry_rectangle_measure",
    match: /aire d['’]un rectangle|rectangle.*(?:aire|périmètre)/i,
    intro: "Non, le périmètre et l’aire du rectangle ont été confondus ou une dimension n’a pas été utilisée correctement.",
    meaning: "Le périmètre mesure le contour du rectangle, tandis que l’aire mesure sa surface. L’aire est le produit de la longueur par la largeur.",
    rule: "Aire du rectangle = longueur × largeur, avec une unité au carré.",
  },
  {
    id: "area_conversion",
    match: /convert(?:ir|is).*aire|unités? d['’]aire/i,
    intro: "Non, tu n’as pas utilisé le coefficient correspondant à une aire. Une aire mesure une surface : le coefficient de conversion des longueurs doit donc être élevé au carré.",
    meaning: "Chaque changement d’unité occupe deux colonnes dans le tableau. Place d’abord le chiffre des unités dans son unité, puis lis la valeur dans l’unité demandée.",
    rule: "Entre deux unités d’aire consécutives, on multiplie ou on divise par 100.",
  },
  {
    id: "volume_conversion",
    match: /convert(?:ir|is).*\b(?:mm³|cm³|dm³|m³)|géométrie dans l'espace.*conversion/i,
    intro: "Non, le coefficient utilisé ne correspond pas à un volume. Un volume possède trois dimensions : longueur, largeur et hauteur.",
    meaning: "Chaque unité de volume occupe trois colonnes. Le coefficient de conversion des longueurs doit être élevé au cube.",
    rule: "Entre deux unités de volume consécutives, on multiplie ou on divise par 1 000.",
  },
  {
    id: "length_conversion",
    match: /convert(?:ir|is).*longueur|unités? de longueur/i,
    intro: "Non, le déplacement dans les unités de longueur n’est pas le bon. Il faut d’abord repérer l’unité de départ et l’unité d’arrivée.",
    meaning: "Dans le tableau, on place le chiffre des unités du nombre dans son unité, puis on complète jusqu’à l’unité demandée.",
    rule: "Entre deux unités de longueur consécutives, on multiplie ou on divise par 10.",
  },
  {
    id: "capacity_conversion",
    match: /convert(?:ir|is).*contenance|\b(?:kL|hL|daL|dL|cL|mL)\b/i,
    intro: "Non, le chiffre des unités n’a pas été placé dans la bonne colonne ou le déplacement entre les unités n’est pas correct.",
    meaning: "Pour convertir une contenance, place le chiffre des unités du nombre dans son unité de départ, puis complète les colonnes jusqu’à l’unité demandée.",
    rule: "Entre deux unités de contenance consécutives, on multiplie ou on divise par 10.",
  },
  {
    id: "measurement_problem",
    match: /grandeurs et mesures.*problèmes?/i,
    intro: "Non, les données de mesure n’ont pas encore été reliées à la grandeur recherchée par la bonne opération.",
    meaning: "Dans un problème de grandeurs, chaque nombre doit être associé à ce qu’il mesure et à son unité. On choisit ensuite la relation qui relie directement les données connues à la grandeur inconnue.",
    rule: "Nomme la grandeur recherchée, convertis les données dans des unités compatibles, écris le calcul puis conclus avec l’unité.",
  },
  {
    id: "continuity_reasoning",
    match: /continuité|dichotomie/i,
    intro: "Non, les conditions de continuité ou l’encadrement utilisé dans la dichotomie ne sont pas tous vérifiés.",
    meaning: "La continuité garantit qu’une fonction prend toutes les valeurs intermédiaires. La dichotomie conserve à chaque étape un intervalle où les valeurs aux extrémités encadrent la valeur recherchée, puis partage cet intervalle en deux.",
    rule: "Vérifie la continuité et le changement de signe ou l’encadrement, calcule le milieu, puis conserve le demi-intervalle qui contient encore la solution.",
  },
  {
    id: "exam_reasoning",
    match: /sujet officiel|préparation EAM/i,
    intro: "Non, une donnée du sujet ou une condition de la méthode choisie n’a pas été utilisée correctement.",
    meaning: "Dans une question d’examen, commence par identifier précisément la notion évaluée et les données utiles. Une réponse complète comporte la propriété ou la formule, son application aux données et une conclusion répondant à la question.",
    rule: "Entoure la question, sélectionne les données utiles, écris la méthode, effectue le calcul puis contrôle unité, signe et vraisemblance.",
  },
  {
    id: "automatic_calculation",
    match: /automatismes?/i,
    intro: "Non, le réflexe de calcul choisi ne correspond pas encore à la structure de la question.",
    meaning: "Un automatisme fiable ne consiste pas à aller vite au hasard : il faut reconnaître la structure, choisir une propriété courte, effectuer le calcul puis contrôler mentalement le résultat.",
    rule: "Repère les nombres et le signe, annonce l’opération ou la propriété, calcule puis vérifie par ordre de grandeur ou opération inverse.",
  },
  {
    id: "relative_numbers",
    match: /relatif|nombre négatif|signes contraires|automatismes.*signe/i,
    intro: "Non, le signe et la distance à zéro n’ont pas été traités avec la méthode correspondant à cette opération.",
    meaning: "Lorsque les deux nombres sont de signes opposés, le plus « fort », celui qui a la plus grande distance à zéro, donne son signe au résultat. Il perd ensuite les « points de vie » de l’autre nombre.",
    rule: "Compare d’abord les distances à zéro, puis soustrais la plus petite de la plus grande.",
  },
  {
    id: "fractions",
    match: /fraction|rationnel/i,
    intro: "Non, les fractions n’ont pas été transformées de façon à représenter des parts de même taille.",
    meaning: "On ne peut additionner ou soustraire directement que des fractions ayant le même dénominateur, le nombre situé en bas. On obtient un dénominateur commun en multipliant en haut et en bas par un même nombre, ce qui ne change pas la valeur de la fraction.",
    rule: "Obtiens d’abord le même dénominateur, calcule ensuite les numérateurs, puis simplifie si cela est possible.",
  },
  {
    id: "equations",
    match: /équation|inconnue|résoudre.*\bx\b/i,
    intro: "Non, la valeur proposée ne vérifie pas l’équation de départ. En la remplaçant à la place de l’inconnue, les deux membres ne donnent pas le même résultat.",
    meaning: "Imagine une balance à l’équilibre : pour conserver l’égalité, on agit de la même manière sur les deux plateaux afin d’obtenir l’inconnue toute seule d’un côté.",
    rule: "Effectue la même opération dans les deux membres, puis vérifie la solution en la remplaçant dans l’équation initiale.",
  },
  {
    id: "percentages",
    match: /pourcentage|\d+\s*%|taux d['’]évolution|informations? chiffrées?.*(?:proportion|taux|variation absolue|variation relative)|proportions? et taux/i,
    intro: "Non, attention : un pourcentage et le nombre écrit devant le symbole % ne représentent pas la même quantité. Un pourcentage est une proportion d’une valeur de référence.",
    meaning: "Commence par repérer la quantité de référence. Tu peux calculer 10 %, puis composer le pourcentage demandé, ou utiliser directement le coefficient multiplicateur.",
    rule: "Une augmentation de t % correspond au coefficient 1 + t/100 ; une diminution correspond à 1 − t/100.",
  },
  {
    id: "probabilities",
    match: /probabilit|issue favorable|événement/i,
    intro: "Non, les issues favorables n’ont pas été comparées à l’ensemble des issues possibles.",
    meaning: "Le numérateur compte les issues qui réalisent l’événement ; le dénominateur compte toutes les issues possibles lorsque celles-ci sont équiprobables.",
    rule: "Une probabilité est comprise entre 0 et 1 : 0 désigne un événement impossible et 1 un événement certain.",
  },
  {
    id: "functions",
    match: /fonction|image|antécédent/i,
    intro: "Non, le nombre de départ et le résultat d’arrivée semblent avoir été confondus.",
    meaning: "Pour chercher une image, on connaît le nombre de départ et on le remplace dans l’expression. Pour chercher un antécédent, on connaît le résultat d’arrivée et on résout une équation, ou on le lit sur le graphique.",
    rule: "Image : on calcule. Antécédent : on recherche le nombre de départ.",
  },
  {
    id: "distributivity",
    match: /développer|distribut|factoriser|calcul littéral/i,
    intro: "Non, tous les termes concernés par la multiplication n’ont pas été traités.",
    meaning: "Le facteur placé devant ou derrière une parenthèse multiplie chacun des termes situés à l’intérieur. TOUS les termes de la parenthèse doivent être multipliés.",
    rule: "Écris chaque produit séparément avant de réduire l’expression.",
  },
  {
    id: "powers",
    match: /puissance|exposant|élevé.*carré|\^\d/i,
    intro: "Non, la base, l’exposant ou le signe n’a pas été interprété correctement.",
    meaning: "Une puissance indique combien de fois la base est multipliée par elle-même. Les parenthèses précisent si le signe fait partie de la base.",
    rule: "Identifie d’abord toute la base, puis développe mentalement la puissance avant d’appliquer les règles de signe.",
  },
  {
    id: "proportionality",
    match: /proportionnal|échelle|coefficient multiplicateur/i,
    intro: "Non, tu as utilisé un raisonnement additif alors que les deux grandeurs sont proportionnelles.",
    meaning: "On peut commencer par calculer la valeur correspondant à une unité : c’est la méthode du retour à l’unité. On reconstruit ensuite la quantité demandée.",
    rule: "Si une grandeur est multipliée par un nombre, l’autre doit être multipliée par le même nombre.",
  },
  {
    id: "pythagoras",
    match: /Pythagore|hypoténuse|triangle rectangle/i,
    intro: "Non, on ne peut pas trouver la longueur de l’hypoténuse en additionnant directement les deux autres côtés.",
    meaning: "Repère d’abord l’angle droit : le côté opposé est l’hypoténuse. Le théorème de Pythagore relie les carrés des longueurs. La valeur proposée doit aussi respecter l’inégalité triangulaire : un côté est strictement plus court que la somme des deux autres.",
    rule: "Après avoir calculé le carré de la longueur recherchée, n’oublie pas de prendre la racine carrée et de conclure avec l’unité.",
  },
  {
    id: "statistics",
    match: /statistique|moyenne|médiane|effectif|organisation et gestion de données|diagramme en bâtons|tableau de données|tableau d['’]expérience|lecture de données|nuages? de points/i,
    intro: "Non, les valeurs et les effectifs n’ont pas encore été associés correctement.",
    meaning: "Commence par dire ce que représente chaque donnée et calcule l’effectif total. Pour une moyenne pondérée, chaque valeur doit être multipliée par son effectif.",
    rule: "Additionne les produits valeur × effectif, puis divise par l’effectif total.",
  },
  {
    id: "geometry",
    match: /angle|triangle|cercle|symétr|géométr|périmètre|aire|volume|parallélogramme/i,
    intro: "Non, la propriété choisie ou l’une de ses conditions n’est pas encore correctement utilisée.",
    meaning: "Reporte les données sur la figure, nomme précisément les objets et vérifie toutes les conditions avant d’appliquer une propriété.",
    rule: "Écris la propriété, remplace par les données, calcule, puis conclus par une phrase avec l’unité.",
  },
];

const ERROR_INTROS = {
  sign_error: "Non, la valeur obtenue est proche de la bonne valeur, mais son signe est inversé.",
  place_value_error: "Non, le résultat présente un décalage de virgule ou de valeur de position.",
  rounding_error: "Non, le calcul est très proche, mais l’arrondi final n’est pas effectué au rang demandé.",
  invalid_format: "Non, la réponse n’a pas été reconnue dans le format attendu.",
  choice_confusion: "Non, le choix retenu ne respecte pas toutes les informations de l’énoncé.",
  incomplete_reasoning: "Non, au moins une proposition n’a pas été évaluée correctement ou la réponse est incomplète.",
  vocabulary_or_reasoning: "Non, le terme choisi ne désigne pas précisément l’objet mathématique demandé.",
  calculation_error: "Non, une opération ou une étape du calcul doit être reprise.",
  unknown: "Non, cette réponse ne convient pas encore.",
};

export function buildPedagogicalFeedback(exercise, response) {
  const label = labelOf(exercise);
  const family = FAMILY_FEEDBACK.find((item) => item.match.test(label));
  const errorCode = classifyLearningError(exercise, response);
  const answer = expectedOf(exercise);
  const unit = exercise?.type === "numeric" ? unitOf(exercise) : "";
  const precision = {
    sign_error: "La distance à zéro ou la valeur numérique est cohérente, mais le signe final doit être repris.",
    place_value_error: "Le rapport entre ta réponse et la valeur attendue montre qu’une puissance de 10 a probablement été oubliée ou ajoutée.",
    rounding_error: "La valeur obtenue est très proche : conserve tous les chiffres pendant le calcul et arrondis seulement à la fin, au rang demandé.",
    invalid_format: "Utilise uniquement l’écriture demandée et, pour un nombre négatif, la touche ±.",
    incomplete_reasoning: "Teste chaque proposition indépendamment : chacune doit être vraie à elle seule pour être conservée.",
  }[errorCode];
  const intro = errorCode === "invalid_format"
    ? `${ERROR_INTROS.invalid_format} ${precision}`
    : `${family?.intro ?? ERROR_INTROS[errorCode] ?? ERROR_INTROS.unknown}${precision ? ` ${precision}` : ""}`;
  return {
    family: family?.id ?? "general",
    intro,
    meaning: family?.meaning ?? "Repars des données utiles et relie chacune d’elles à une étape précise de la méthode, sans effectuer plusieurs transformations mentalement en même temps.",
    rule: family?.rule ?? "Écris chaque étape, puis contrôle que le résultat répond exactement à la question.",
    conclusion: answer ? `On obtient donc ${answer}${unit ? ` ${unit}` : ""}. Reprends maintenant les étapes pour comprendre comment on l’obtient.` : "Reprends maintenant les étapes de la méthode.",
    steps: Array.isArray(exercise?.steps) ? exercise.steps.slice(0, 4) : [],
  };
}

export const PEDAGOGICAL_FEEDBACK_FAMILIES = FAMILY_FEEDBACK.map(({ id }) => id);
