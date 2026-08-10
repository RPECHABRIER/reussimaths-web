import { classifyLearningError } from "./learningError.js";

function labelOf(exercise) {
  return `${exercise?.chapter ?? ""} ${exercise?.prompt ?? ""}`;
}

function expectedOf(exercise) {
  if (Array.isArray(exercise?.answer)) {
    if (Array.isArray(exercise?.options)) {
      return exercise.answer.map((answer) => typeof answer === "number" ? exercise.options[answer] : answer).join(" ; ");
    }
    return exercise.answer.join(" ; ");
  }
  return String(exercise?.answer ?? "");
}

function unitOf(exercise) {
  const stepTexts = Array.isArray(exercise?.steps)
    ? exercise.steps.map((step) => typeof step === "string" ? step : step?.text ?? "").join(" ")
    : "";
  const source = `${stepTexts} ${exercise?.prompt ?? ""}`;
  const matches = [...source.matchAll(/(?:\\text\{)?(dam|km|hm|dm|cm|mm|daL|kL|hL|dL|cL|mL|m|L)(?:\\text\})?(\^?[23]|[²³])?|(%|€|°)/g)];
  const last = matches.at(-1);
  if (!last) return "";
  if (last[3]) return last[3];
  const exponent = (last[2] ?? "").replace("^2", "²").replace("^3", "³");
  return `${last[1]}${exponent}`;
}

const FAMILY_FEEDBACK = [
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
    match: /évolution.*pourcentage|augmentation|diminution|taux d['’]évolution/i,
    intro: "Non, le pourcentage d’évolution ne doit pas être ajouté ou retiré comme un nombre ordinaire.",
    meaning: "Une évolution en pourcentage dépend de la valeur initiale. On calcule la part correspondante, puis on l’ajoute lors d’une augmentation ou on la retire lors d’une diminution.",
    rule: "Augmentation de t % : coefficient 1 + t/100. Diminution de t % : coefficient 1 − t/100.",
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
    id: "relative_numbers",
    match: /relatif|nombre négatif|signes contraires/i,
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
    match: /pourcentage|\d+\s*%|taux d['’]évolution/i,
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
    intro: "Non, les longueurs d’un triangle rectangle ne s’additionnent pas directement pour trouver l’hypoténuse.",
    meaning: "Repère d’abord l’angle droit : le côté opposé est l’hypoténuse. Le théorème de Pythagore porte sur les carrés des longueurs.",
    rule: "Après avoir calculé le carré de la longueur recherchée, n’oublie pas de prendre la racine carrée et de conclure avec l’unité.",
  },
  {
    id: "statistics",
    match: /statistique|moyenne|médiane|effectif/i,
    intro: "Non, les valeurs et les effectifs n’ont pas encore été associés correctement.",
    meaning: "Commence par dire ce que représente chaque donnée et calcule l’effectif total. Pour une moyenne pondérée, chaque valeur doit être multipliée par son effectif.",
    rule: "Additionne les produits valeur × effectif, puis divise par l’effectif total.",
  },
  {
    id: "geometry",
    match: /angle|triangle|cercle|symétr|géométr|périmètre|aire|volume/i,
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
