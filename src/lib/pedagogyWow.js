const PROFILES = {
  "grandeurs-mesures": {
    level: "sixieme",
    skills: [
      [/périmètre.*aire|comparer des aires|figure complexe/i, "Cherche si tu mesures le contour ou la surface.", "Pour le périmètre, additionne les longueurs du contour ; pour l’aire, compte ou calcule la surface intérieure."],
      [/unités de longueur|unités d'aire/i, "Regarde l’unité demandée avant de convertir.", "En longueur, chaque colonne vaut 10 ; en aire, chaque changement d’unité vaut 100."],
      [/durées|horaires|comparer des durées/i, "Sépare les heures et les minutes.", "Convertis dans une même unité ou calcule d’abord les heures, puis les minutes en échangeant 60 minutes si besoin."],
      [/cercle/i, "Le périmètre du cercle dépend de son rayon ou de son diamètre.", "Utilise 2 × π × rayon, ou π × diamètre, puis conserve l’unité de longueur."],
      [/volume|problèmes/i, "Identifie la grandeur et l’unité demandées.", "Choisis la formule adaptée, remplace les mesures, calcule puis écris l’unité correcte."],
    ],
    success: "Exact. La grandeur, le calcul et l’unité sont cohérents.",
  },
  "distances-symetries": {
    level: "sixieme",
    skills: [
      [/distance|comparer des longueurs/i, "Une distance est une longueur : repère ses deux extrémités.", "Lis ou calcule la longueur du segment, puis compare dans la même unité."],
      [/symétrie axiale|symétrie et médiatrice/i, "Le point et son image sont à la même distance de l’axe.", "Trace mentalement la perpendiculaire à l’axe : celui-ci coupe le segment reliant les deux points en son milieu."],
      [/médiatrice/i, "Cherche une droite perpendiculaire qui passe par le milieu.", "Vérifie les deux conditions : milieu du segment et angle droit avec ce segment."],
      [/cercles et disques|codage/i, "Lis les marques de la figure avant de mesurer.", "Utilise le centre, le rayon et les codages d’égalité sans te fier seulement à l’apparence."],
      [/contenances|durées|problèmes/i, "Mets d’abord les données dans la même unité.", "Convertis chaque mesure, effectue l’opération, puis contrôle l’unité du résultat."],
    ],
    success: "Exact. Tu as utilisé les bons repères de la figure.",
  },
  angles: {
    level: "sixieme",
    skills: [
      [/nature d'un angle|estimer un angle|mesurer un angle/i, "Repère le sommet et l’ouverture de l’angle.", "Place le centre du rapporteur sur le sommet, aligne un côté sur zéro et lis la graduation dans le bon sens."],
      [/supplémentaires|points alignés/i, "Un angle plat mesure 180°.", "Additionne les angles adjacents sur la même droite, puis retire la mesure connue à 180°."],
      [/angles d'un triangle|triangle rectangle|triangle isocèle/i, "Dans un triangle, la somme des trois angles vaut 180°.", "Écris la somme, utilise l’angle droit ou les angles égaux si présents, puis calcule l’angle manquant."],
      [/opposés par le sommet|adjacents/i, "Observe quels côtés sont dans le prolongement l’un de l’autre.", "Deux angles opposés par le sommet sont égaux ; deux angles adjacents partagent seulement un côté et le sommet."],
      [/bissectrice|existence d'un triangle|problèmes/i, "Repère la propriété demandée avant de calculer.", "La bissectrice partage l’angle en deux angles égaux ; pour un triangle, vérifie que la somme de deux angles reste inférieure à 180°."],
    ],
    success: "Exact. Le sommet, les côtés et la mesure de l’angle sont bien identifiés.",
  },
  puissances: {
    level: "cinquieme",
    skills: [
      [/notion de puissance/i, "L’exposant indique combien de fois la base est répétée.", "Développe mentalement aⁿ comme n facteurs égaux à a, puis calcule."],
      [/carré|cube/i, "Carré signifie deux facteurs ; cube, trois.", "Écris le produit répété avant de calculer pour ne pas multiplier base et exposant."],
      [/enchaîner des calculs/i, "Repère les puissances avant les autres opérations.", "Calcule les puissances, puis produits et quotients, enfin sommes et différences."],
    ],
    success: "Exact. La base et l’exposant ont le bon rôle.",
  },
  "calcul-litteral": {
    level: "cinquieme",
    skills: [
      [/traduire en formule/i, "Donne un nom à la quantité inconnue.", "Traduis chaque mot par une opération, dans l’ordre, avec des parenthèses si nécessaire."],
      [/tester une égalité/i, "Remplace la lettre par la valeur proposée des deux côtés.", "Calcule séparément les deux membres : l’égalité est vraie seulement s’ils donnent le même résultat."],
      [/distributivité/i, "Le facteur devant la parenthèse agit sur chaque terme.", "Multiplie chaque terme de la parenthèse par le facteur, puis réduis seulement les termes semblables."],
      [/résoudre une équation/i, "Cherche l’opération qui empêche la lettre d’être seule.", "Effectue l’opération inverse des deux côtés, puis vérifie la valeur obtenue."],
      [/démontrer|culture/i, "Appuie-toi sur une transformation valable pour toutes les valeurs.", "Écris les deux expressions, développe ou réduis, puis compare leurs formes obtenues."],
    ],
    success: "Exact. L’expression conserve bien le sens de la situation.",
  },
  "nombres-relatifs": {
    level: "cinquieme",
    skills: [
      [/droite graduée|repérages|comparer/i, "Sur la droite, le nombre le plus à droite est le plus grand.", "Repère zéro, respecte la graduation, puis compare les positions sans regarder seulement les distances à zéro."],
      [/opposé|valeur absolue|signe/i, "Distingue le côté de zéro et la distance à zéro.", "L’opposé change le signe ; la valeur absolue garde uniquement la distance à zéro."],
      [/additionner/i, "Compare les signes des deux nombres.", "Même signe : additionne les distances ; signes différents : soustrais-les et garde le signe du plus éloigné de zéro."],
      [/soustraire/i, "Soustraire revient à ajouter l’opposé.", "Transforme a−b en a+(−b), puis applique la règle de l’addition des relatifs."],
      [/enchaîner|contextes|culture/i, "Traduis chaque déplacement ou variation avec son signe.", "Construis le calcul dans l’ordre, puis vérifie que le signe final est cohérent avec la situation."],
    ],
    success: "Exact. Le signe et la distance à zéro sont correctement distingués.",
  },
  "multiplication-division-rationnels": {
    level: "quatrieme",
    skills: [
      [/multiplier/i, "Multiplie les numérateurs entre eux et les dénominateurs entre eux.", "Détermine le signe, simplifie les facteurs si possible, puis effectue les deux produits."],
      [/diviser/i, "Diviser par une fraction revient à multiplier par son inverse.", "Garde la première fraction, inverse la seconde, puis applique la règle de multiplication et simplifie."],
      [/priorités/i, "Les produits et quotients se calculent avant les sommes.", "Traite parenthèses, multiplications et divisions, puis additions et soustractions."],
      [/problèmes/i, "Traduis d’abord la relation entre les quantités.", "Écris le produit ou le quotient de fractions correspondant, calcule, simplifie puis interprète."],
    ],
    success: "Exact. Le signe, l’inverse et la simplification sont cohérents.",
  },
  "puissances-quatrieme": {
    level: "quatrieme",
    skills: [
      [/rappels/i, "Identifie la base, l’exposant et le signe.", "Applique la règle adaptée au produit, au quotient ou à la puissance d’une puissance, sans mélanger les bases."],
      [/notation scientifique/i, "Le premier facteur doit être compris entre 1 et 10.", "Déplace la virgule jusqu’à obtenir ce facteur ; le nombre de déplacements donne l’exposant, avec son signe."],
      [/racine carrée/i, "La racine carrée cherche un nombre dont le carré est donné.", "Repère le carré parfait ou encadre-le entre deux carrés consécutifs avant de conclure."],
    ],
    success: "Exact. La règle de puissance est appliquée sans changer la base.",
  },
  "calcul-litteral-quatrieme": {
    level: "quatrieme",
    skills: [
      [/exprimer|évaluer/i, "Remplace chaque lettre avec des parenthèses si la valeur est négative.", "Écris d’abord l’expression substituée, puis calcule en respectant les priorités."],
      [/réduire/i, "Regroupe seulement les termes qui ont la même partie littérale.", "Additionne leurs coefficients et laisse séparés les termes de nature différente."],
      [/développer/i, "Chaque terme de la parenthèse doit être multiplié.", "Distribue le facteur terme par terme en conservant les signes, puis réduis."],
      [/factoriser/i, "Cherche le facteur présent dans tous les termes.", "Place ce facteur devant la parenthèse et vérifie le contenu en redéveloppant."],
      [/problèmes/i, "Exprime chaque grandeur avant de transformer.", "Construis l’expression liée à la situation, développe ou réduis seulement si cela aide à répondre."],
    ],
    success: "Exact. La transformation conserve la valeur de l’expression.",
  },
  "automatismes-troisieme": {
    level: "troisieme",
    skills: [
      [/nombres entiers|calcul numérique|calcul littéral|équations/i, "Repère la règle de calcul utile.", "Effectue une transformation courte, puis contrôle le signe et les priorités."],
      [/notion de fonction|fonctions affines/i, "Distingue entrée, image et antécédent.", "Lis ou remplace la donnée connue dans la bonne relation."],
      [/proportionnalité|statistiques|probabilités/i, "Choisis le bon total de référence.", "Écris le rapport ou le coefficient, calcule puis interprète brièvement."],
      [/Thalès|trigonométrie|géométrie dans l'espace/i, "Identifie les données et la propriété adaptée.", "Écris directement la relation utile puis remplace les valeurs."],
      [/transformations|mesures et grandeurs/i, "Repère ce qui est conservé et l’unité demandée.", "Applique la propriété ou la conversion en une étape contrôlée."],
    ],
    success: "Exact. L’automatisme est maîtrisé.",
  },
  "calcul-numerique-troisieme": {
    level: "troisieme",
    skills: [
      [/fractions/i, "Vérifie l’opération avant de transformer les fractions.", "Pour une somme, utilise un dénominateur commun ; pour un produit, multiplie puis simplifie."],
      [/priorités/i, "Repère d’abord parenthèses et puissances.", "Calcule parenthèses et puissances, puis produits et quotients, enfin sommes et différences."],
      [/règles des puissances|puissances/i, "Vérifie que les bases sont compatibles.", "Applique la règle du produit, du quotient ou de la puissance d’une puissance sans additionner base et exposant."],
      [/écriture scientifique/i, "Le premier facteur doit appartenir à [1;10[.", "Déplace la virgule, compte les rangs et donne à 10 l’exposant signé correspondant."],
      [/racines carrées|problèmes/i, "Cherche les carrés parfaits ou la structure du calcul.", "Simplifie les racines exactes, respecte les priorités puis vérifie la plausibilité du résultat."],
    ],
    success: "Exact. Les priorités et les règles numériques sont respectées.",
  },
  "equations-troisieme": {
    level: "troisieme",
    skills: [
      [/premier degré/i, "Isole progressivement les termes contenant l’inconnue.", "Effectue la même opération aux deux membres, réduis puis divise par le coefficient de l’inconnue."],
      [/produit nul/i, "Un produit est nul si au moins un facteur est nul.", "Écris une équation pour chaque facteur, résous-les séparément puis rassemble les solutions."],
      [/programmes de calcul/i, "Traduis chaque programme par une expression.", "Écris l’égalité entre les deux résultats, réduis-la puis résous et vérifie."],
      [/modéliser un problème/i, "Choisis l’inconnue et traduis les données avant de résoudre.", "Construis l’équation, résous-la, vérifie les contraintes puis réponds dans le contexte."],
    ],
    success: "Exact. La solution conserve l’égalité et vérifie le problème.",
  },
  "automatismes-seconde": {
    level: "seconde",
    skills: [
      [/nombres et calculs/i, "Contrôle domaine, signes et priorités.", "Effectue la transformation utile puis vérifie l’ordre de grandeur."],
      [/fonctions|variations/i, "Distingue entrée, image, antécédent et variation.", "Lis la donnée dans la représentation adaptée, sans inverser les axes."],
      [/repérage|vecteur|colinéarité|droites/i, "Repère les coordonnées utiles.", "Calcule coordonnée par coordonnée puis applique le critère demandé."],
      [/informations chiffrées|statistiques|probabilités/i, "Choisis la population de référence.", "Écris le rapport ou l’indicateur, calcule puis interprète."],
    ],
    success: "Exact. Le contrôle rapide est cohérent.",
  },
  "variations-fonctions-seconde": {
    level: "seconde",
    skills: [
      [/comparaison d'images/i, "Vérifie d’abord l’ordre des antécédents et le sens de variation.", "Sur l’intervalle concerné, une fonction croissante conserve l’ordre ; une fonction décroissante l’inverse."],
      [/lecture d'un tableau de variations/i, "Lis le tableau de gauche à droite sur le bon intervalle.", "Relie chaque intervalle à sa flèche puis lis les valeurs aux bornes sans inventer les valeurs intermédiaires."],
      [/maximum et minimum|extremums/i, "Distingue la valeur extrême de l’endroit où elle est atteinte.", "Lis l’ordonnée extrême, puis son ou ses antécédents, en précisant l’intervalle étudié."],
      [/résolution graphique/i, "La solution est une abscisse, pas une ordonnée.", "Repère les intersections avec la droite de niveau demandée puis lis leurs abscisses."],
      [/vrai ou faux/i, "Cherche un intervalle ou un contre-exemple précis.", "Appuie la conclusion sur le tableau ou la courbe, en respectant le domaine considéré."],
    ],
    success: "Exact. La variation est interprétée sur le bon intervalle.",
  },
  "automatismes-premiere-spe": {
    level: "premiere-spe",
    skills: [
      [/second degré|dérivation|variations et courbes|fonction exponentielle/i, "Identifie la structure de la fonction.", "Applique la propriété adaptée et contrôle ses hypothèses."],
      [/suites numériques/i, "Repère le rang initial et le mode de définition.", "Utilise la relation explicite ou récurrente avec le rang réellement donné."],
      [/trigonométrie|produit scalaire|géométrie repérée/i, "Choisis la relation géométrique adaptée.", "Écris-la avec les données disponibles puis calcule."],
      [/probabilités conditionnelles|variables aléatoires/i, "Identifie l’univers ou la condition de référence.", "Écris la probabilité ou l’espérance correspondante avant de calculer."],
      [/algorithmique/i, "Suis l’état des variables instruction par instruction.", "Note chaque nouvelle valeur et respecte exactement la condition ou la boucle."],
    ],
    success: "Exact. La propriété est appliquée avec ses conditions.",
  },
  "suites-numeriques-premiere-spe": {
    level: "premiere-spe",
    skills: [
      [/modes de génération|formule explicite/i, "Repère si le terme dépend du rang ou du terme précédent.", "Une forme explicite donne uₙ avec n ; une récurrence calcule un terme à partir d’un terme antérieur."],
      [/somme des n premiers entiers/i, "Repère la dernière valeur, notée n dans la formule.", "Remplace n dans n(n+1)/2 par la dernière valeur de la somme, puis calcule le produit avant de diviser par 2."],
      [/arithmétique/i, "Cherche une différence constante entre deux termes consécutifs.", "Utilise le rang initial écrit dans l’énoncé : uₙ=uₚ+(n−p)r, puis adapte la somme au nombre réel de termes."],
      [/géométrique/i, "Cherche un quotient constant entre deux termes consécutifs.", "Utilise le rang initial écrit dans l’énoncé : uₙ=uₚ×q^(n−p), puis adapte la somme au premier terme présent."],
      [/sens de variation/i, "Relie la variation à la raison et aux signes des termes.", "Pour une suite arithmétique, étudie r ; pour une géométrique, contrôle q et le signe des termes avant de conclure."],
      [/modélisation|limite/i, "Identifie si l’évolution est additive ou multiplicative.", "Choisis le modèle, fixe le rang initial à partir du contexte puis interprète le terme ou la limite demandée."],
    ],
    success: "Exact. Le modèle et le rang initial sont correctement utilisés.",
  },
  "automatismes-premiere-non-spe": {
    level: "premiere-non-spe",
    skills: [
      [/information chiffrée|statistique|probabilités/i, "Choisis le bon total de référence.", "Calcule l’indicateur ou la proportion puis interprète-la."],
      [/croissance linéaire|variations globales/i, "Distingue variation absolue et relative.", "Écris la différence ou le coefficient correspondant avant de calculer."],
      [/croissance exponentielle/i, "Repère le coefficient multiplicateur constant.", "Applique le coefficient au bon nombre de périodes."],
      [/modélisation quadratique|variations instantanées/i, "Identifie le modèle et la grandeur demandée.", "Utilise la forme ou le taux adapté, puis contrôle l’unité."],
    ],
    success: "Exact. L’indicateur utilise la bonne référence.",
  },
  "suites-numeriques-premiere-techno": {
    level: "premiere-techno",
    skills: [
      [/modes de génération|formule explicite|représentation graphique/i, "Repère le rang initial et la façon dont la suite est définie.", "Lis le premier rang donné, puis utilise la formule explicite ou la relation de récurrence correspondante."],
      [/arithmétique/i, "Vérifie si l’écart entre deux termes est constant.", "À partir du rang p réellement donné, utilise uₙ=uₚ+(n−p)r."],
      [/géométrique/i, "Vérifie si le quotient entre deux termes est constant.", "À partir du rang p réellement donné, utilise uₙ=uₚ×q^(n−p)."],
      [/sens de variation/i, "Relie l’évolution à la raison et au signe des termes.", "Étudie r pour une suite arithmétique ; pour une géométrique, contrôle q et les termes avant de conclure."],
      [/modélisation|démonstration/i, "Décide si l’évolution est additive ou multiplicative.", "Choisis le modèle, fixe le rang initial depuis le contexte, puis vérifie la propriété sur deux termes consécutifs."],
    ],
    success: "Exact. Le type de suite et son rang initial sont cohérents.",
  },
  "automatismes-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/suites|limites|continuité|dérivation|logarithme|trigonométriques/i, "Identifie la propriété et ses hypothèses.", "Applique-la directement puis contrôle le domaine et le signe."],
      [/vecteurs|orthogonalité|distances/i, "Repère la relation vectorielle utile.", "Calcule avec les coordonnées puis applique le critère demandé."],
      [/primitives|calcul intégral/i, "Distingue primitive, dérivée et intégrale.", "Utilise la formule adaptée avec les bornes et les constantes correctes."],
      [/combinatoire|loi binomiale|variables aléatoires|grands nombres/i, "Identifie le modèle probabiliste.", "Écris le coefficient, la probabilité ou l’espérance avant de calculer."],
    ],
    success: "Exact. Le résultat respecte les hypothèses du modèle.",
  },
  "fonctions-exponentielles-terminale-techno": {
    level: "terminale-techno",
    skills: [
      [/calcul|propriétés algébriques/i, "Repère la même base avant de transformer les exposants.", "Pour un produit, additionne les exposants ; pour un quotient, soustrais-les, sans modifier la base."],
      [/allure|sens de variation/i, "Le sens dépend de la base du modèle exponentiel.", "Pour aˣ, la fonction croît si a>1 et décroît si 0<a<1 ; distingue cette base d’un taux."],
      [/taux d'évolution moyen/i, "Un taux moyen se compose multiplicativement.", "Cherche le coefficient par période avec une racine adaptée, puis transforme ce coefficient en taux."],
      [/coefficient|taux|modèle/i, "Distingue taux, coefficient multiplicateur et valeur obtenue.", "Traduis le taux par 1+t ou 1−t, puis élève ce coefficient au nombre de périodes."],
    ],
    success: "Exact. Le modèle exponentiel et le taux sont correctement distingués.",
  },
  "configurations-geometriques": {
    level: "sixieme",
    skills: [
      [/existence d'un triangle/i, "Compare les longueurs des trois côtés.", "Pour construire le triangle, chaque côté doit être plus court que la somme des deux autres."],
      [/triangles particuliers/i, "Lis les longueurs et les angles codés.", "Repère les côtés égaux ou l’angle droit, puis donne le nom précis du triangle."],
      [/angles d'un triangle|alignement/i, "Observe la ligne droite ou les trois angles du triangle.", "Utilise 180° pour un angle plat ou pour la somme des angles d’un triangle, puis calcule la mesure manquante."],
      [/problèmes/i, "Note ce que la figure donne et ce que tu cherches.", "Choisis une seule propriété adaptée aux codages, calcule, puis écris une courte conclusion."],
      [/représenter l'espace/i, "Repère les faces et les arêtes déjà visibles.", "Appuie-toi sur les sommets reliés et les codages de la figure, sans te fier seulement à son apparence."],
    ],
    success: "Exact. Les longueurs, les angles et les codages sont cohérents.",
  },
  "organisation-gestion-donnees": {
    level: "sixieme",
    skills: [
      [/diagramme|tableau de données|tableau à double entrée/i, "Lis d’abord le titre, les lignes et les colonnes.", "Repère la catégorie demandée, puis lis la valeur avec la bonne graduation ou à l’intersection correcte."],
      [/pourcentages et tableaux/i, "Quelle quantité représente le total ?", "Prends le total comme référence, puis calcule la part demandée sur 100."],
      [/probabilité|expérience aléatoire|issues d'un événement|urne|jeu de cartes|roue de loterie/i, "Compte les issues possibles et celles qui conviennent.", "Si les issues sont équiprobables, écris cas favorables sur cas possibles ; sinon, utilise les informations données."],
      [/fréquence|tableau d'expérience/i, "Repère le nombre total d’essais.", "Divise l’effectif observé par le nombre total d’essais, puis vérifie que le résultat est entre 0 et 1."],
      [/événement contraire|comparer des probabilités|égaliser des probabilités/i, "Décris précisément l’événement étudié.", "Utilise le bon univers de référence ; pour un événement contraire, calcule 1 moins la probabilité de l’événement."],
    ],
    success: "Exact. La donnée est lue avec le bon total de référence.",
  },
  "geometrie-espace": {
    level: "cinquieme",
    skills: [
      [/patrons/i, "Repère quelles faces doivent se rejoindre.", "Vérifie le nombre et la forme des faces, puis imagine le pliage sans superposer deux faces."],
      [/perspective cavalière/i, "Distingue les arêtes visibles et cachées.", "Conserve le parallélisme des arêtes correspondantes et utilise les pointillés pour les arêtes cachées."],
      [/volumes et capacités|conversions/i, "Mets les mesures dans la même unité.", "Pour les volumes, chaque changement d’unité cubique vaut 1 000 ; utilise aussi 1 dm³ = 1 L."],
      [/volumes/i, "Identifie le solide et ses dimensions utiles.", "Choisis la formule du volume, remplace les mesures dans une même unité, puis écris l’unité cubique."],
      [/culture mathématique/i, "Repère le solide ou la propriété décrite.", "Relie le vocabulaire à la forme, aux faces ou aux dimensions caractéristiques du solide."],
      [/aire du disque/i, "Repère le rayon du disque.", "Utilise π×rayon×rayon, puis écris une unité d’aire."],
    ],
    success: "Exact. Le solide, ses dimensions et son unité sont cohérents.",
  },
  "symetrie-centrale-parallelogrammes": {
    level: "cinquieme",
    skills: [
      [/symétrie centrale/i, "Le centre est le milieu entre un point et son image.", "Utilise l’alignement avec le centre et l’égalité des distances ; les longueurs, angles et aires sont conservés."],
      [/opposés par le sommet|adjacents et supplémentaires|bissectrice/i, "Observe les côtés communs et leurs prolongements.", "Utilise l’égalité des angles opposés, la somme de 180° des angles supplémentaires ou le partage en deux angles égaux."],
      [/droites parallèles|tester le parallélisme/i, "Repère la sécante et les angles codés.", "Compare les angles correspondants ou alternes-internes, puis cite la propriété avant de conclure."],
      [/parallélogramme|centre de symétrie/i, "Cherche les côtés ou les diagonales associés.", "Utilise une propriété complète : côtés opposés parallèles et égaux, ou diagonales qui se coupent en leur milieu."],
      [/culture mathématique/i, "Repère la propriété d’angle décrite.", "Relie le vocabulaire aux côtés, au sommet et aux droites de la figure avant de répondre."],
    ],
    success: "Exact. La propriété géométrique utilisée correspond aux codages.",
  },
  "resolution-equations": {
    level: "quatrieme",
    skills: [
      [/tester/i, "Remplace l’inconnue par la valeur proposée.", "Calcule séparément les deux membres : la valeur convient seulement s’ils sont égaux."],
      [/résoudre/i, "Quelle opération empêche l’inconnue d’être seule ?", "Effectue la même opération sur les deux membres, réduis, puis recommence jusqu’à isoler l’inconnue."],
      [/problèmes/i, "Choisis l’inconnue avant d’écrire le calcul.", "Traduis les deux expressions décrites par la situation, écris leur égalité, résous puis vérifie dans le contexte."],
    ],
    success: "Exact. Chaque transformation conserve l’égalité.",
  },
  "statistiques-quatrieme": {
    level: "quatrieme",
    skills: [
      [/moyennes/i, "Repère si certaines valeurs sont répétées.", "Additionne les valeurs en tenant compte de leurs effectifs, puis divise par l’effectif total."],
      [/médiane/i, "Range d’abord les valeurs dans l’ordre.", "Repère la ou les positions centrales selon que l’effectif est impair ou pair, sans calculer une moyenne de toute la série."],
      [/diagrammes/i, "Lis l’échelle et le total avant l’angle ou la fréquence.", "Relie chaque effectif à sa part du total, puis à la graduation ou à l’angle correspondant."],
      [/vocabulaire|problèmes/i, "Identifie la population, le caractère et l’effectif.", "Choisis l’indicateur demandé, utilise le bon total, puis interprète le résultat dans la situation."],
    ],
    success: "Exact. L’indicateur utilise toutes les données nécessaires.",
  },
  "notion-fonction-troisieme": {
    level: "troisieme",
    skills: [
      [/vocabulaire, image, antécédent/i, "Repère ce qui est donné et ce que tu cherches.", "Si l’entrée est connue, calcule sa sortie ; si la sortie est connue, cherche l’entrée qui la produit."],
      [/tableau de valeurs/i, "Pars de la ligne de la valeur connue.", "Associe les deux valeurs d’une même colonne sans inverser entrée et sortie."],
      [/cas particuliers/i, "Observe comment la sortie dépend de l’entrée.", "Compare la relation proposée aux formes usuelles en vérifiant plusieurs valeurs."],
      [/programmes de calcul|égalité de deux fonctions/i, "Traduis chaque fonction avant de les comparer.", "Écris les deux expressions avec la même entrée, puis résous leur égalité ou compare leurs valeurs."],
    ],
    success: "Exact. L’entrée et la sortie ont le bon rôle.",
  },
  "fonctions-affines-troisieme": {
    level: "troisieme",
    skills: [
      [/identifier a et b/i, "Dans ax+b, distingue la pente et la valeur de départ.", "Le coefficient a multiplie x ; b est la valeur obtenue pour x=0."],
      [/droites et coefficients/i, "Observe la variation verticale pour une variation horizontale.", "Calcule la pente dans le même ordre, puis lis l’ordonnée à l’origine sur l’axe vertical."],
      [/déterminer une fonction/i, "Commence par utiliser deux points pour trouver la pente.", "Calcule a, puis remplace les coordonnées d’un point dans y=ax+b pour déterminer b."],
      [/problèmes de tarifs/i, "Repère la part fixe et la part qui dépend de la quantité.", "Traduis chaque tarif par une fonction affine, puis compare-les pour la même quantité."],
    ],
    success: "Exact. Les coefficients sont interprétés dans la bonne relation.",
  },
  "fonctions-reference-seconde": {
    level: "seconde",
    skills: [
      [/images|antécédents/i, "Repère d’abord ce qui est donné et ce qui est cherché.", "Pour une image, remplace x ; pour un antécédent, résous l’équation de la fonction de référence en respectant son domaine."],
      [/sens de variation|comparaison d'images/i, "Identifie la fonction et l’intervalle étudié.", "Utilise ses variations sur cet intervalle ; la fonction carré ou inverse ne conserve pas toujours l’ordre sur tout son domaine."],
      [/équations et inéquations/i, "Repère les valeurs interdites et les symétries possibles.", "Ramène le problème à la fonction de référence, résous sur son domaine, puis contrôle chaque solution ou intervalle."],
      [/propriétés/i, "Nomme la fonction de référence avant de conclure.", "Utilise son domaine, sa parité, son signe ou ses variations selon l’information demandée."],
    ],
    success: "Exact. La propriété est appliquée sur le bon domaine.",
  },
  "reperage-configurations-seconde": {
    level: "seconde",
    skills: [
      [/coordonnées du milieu|centre de gravité/i, "Travaille coordonnée par coordonnée.", "Pour un milieu, fais la moyenne des abscisses puis celle des ordonnées ; adapte les coefficients au centre de gravité."],
      [/distance entre deux points|réciproque de Pythagore/i, "Repère les écarts horizontal et vertical.", "Calcule les deux différences dans le même ordre, puis utilise la somme de leurs carrés avant la racine."],
      [/alignement de points/i, "Compare deux directions à partir d’un même point.", "Calcule des vecteurs ou des coefficients directeurs, puis utilise un critère de colinéarité."],
      [/parallélogramme/i, "Choisis une propriété vérifiable avec les coordonnées.", "Compare les milieux des diagonales ou les vecteurs de côtés opposés, puis conclus avec la propriété complète."],
      [/types de repères|droites parallèles aux axes|symétrie/i, "Lis les axes et les coordonnées concernées.", "Utilise les propriétés du repère sans supposer qu’il est orthonormé si ce n’est pas indiqué."],
    ],
    success: "Exact. Le critère choisi est justifié par les coordonnées.",
  },
  "variations-courbes-premiere-spe": {
    level: "premiere-spe",
    skills: [
      [/parité/i, "Compare f(−x) à f(x) et à −f(x).", "Vérifie d’abord que le domaine est symétrique, puis établis l’égalité correspondant à une fonction paire ou impaire."],
      [/signe de f' et variations|lecture de tableaux/i, "Étudie le signe de la dérivée sur chaque intervalle.", "Relie f'>0 à la croissance et f'<0 à la décroissance, sans conclure à partir d’un seul point où f'=0."],
      [/extremum|optimisation/i, "Un point stationnaire ne suffit pas à conclure.", "Vérifie le changement de signe de f' ou les variations de part et d’autre, puis contrôle les bornes du domaine."],
      [/allure de la parabole|symétrie de la parabole/i, "Repère le sommet et le signe du coefficient dominant.", "Utilise l’axe de symétrie, le sommet et l’orientation pour décrire l’allure."],
      [/inégalités|position relative|vrai ou faux/i, "Compare les deux expressions sur le domaine concerné.", "Étudie le signe de leur différence ou fournis un contre-exemple précis avant de conclure."],
      [/fonctions constantes/i, "Observe si la valeur de la fonction change avec x.", "Une fonction constante garde la même image sur tout l’intervalle ; sa courbe est horizontale et sa dérivée y est nulle."],
    ],
    success: "Exact. La conclusion repose sur le signe et les variations.",
  },
  "fonction-exponentielle-premiere-spe": {
    level: "premiere-spe",
    skills: [
      [/propriétés algébriques/i, "Ramène les termes à une même structure exponentielle.", "Utilise e^(a+b)=e^a×e^b et e^(a−b)=e^a/e^b ; une exponentielle d’une somme n’est pas une somme d’exponentielles."],
      [/signe et variations|valeurs particulières/i, "Sépare la valeur de l’exponentielle de celle de son exposant.", "L’exponentielle est strictement positive et croissante ; utilise e^0=1 pour les comparaisons."],
      [/dérivation/i, "Identifie l’exposant et sa dérivée.", "Dérive e^{u(x)} en u'(x)e^{u(x)}, puis exploite le signe seulement sur le domaine étudié."],
      [/équations|inéquations|comparaison/i, "La fonction exponentielle est strictement croissante.", "Compare les exposants lorsque les deux membres sont exponentiels, ou transforme l’expression sans inventer de propriété additive."],
      [/modélisation/i, "Identifie la valeur initiale et le facteur d’évolution.", "Écris le modèle exponentiel, relie le nombre de périodes à l’exposant, puis interprète le résultat."],
    ],
    success: "Exact. La propriété exponentielle est utilisée dans le bon contexte.",
  },
  "statistique-probabilites-premiere-non-spe": {
    level: "premiere-non-spe",
    skills: [
      [/fréquences|statistiques à deux variables/i, "Vérifie d’abord quelle population sert de référence.", "Choisis le total de la ligne, de la colonne ou de l’ensemble correspondant exactement à la question, puis calcule le rapport."],
      [/probabilités conditionnelles|arbres pondérés/i, "Identifie l’événement qui sert de condition.", "Restreins l’univers à cette condition ; dans un arbre, multiplie le long d’un chemin et additionne seulement des chemins incompatibles."],
      [/indépendance/i, "Distingue indépendance et événements incompatibles.", "Vérifie P(A∩B)=P(A)P(B), ou une probabilité conditionnelle égale à la probabilité non conditionnée."],
      [/répétitions d'expériences/i, "Décris l’événement contraire de celui demandé.", "Pour « au moins un », calcule souvent 1 moins la probabilité de n’obtenir aucun succès, en vérifiant l’indépendance."],
    ],
    success: "Exact. La probabilité utilise le bon événement de référence.",
  },
  "croissance-lineaire-premiere-non-spe": {
    level: "premiere-non-spe",
    skills: [
      [/suites arithmétiques/i, "Repère le rang initial et la différence entre deux termes.", "Utilise uₙ=uₚ+(n−p)r avec le rang p réellement donné, puis vérifie le nombre de pas."],
      [/modélisation/i, "L’évolution ajoute-t-elle toujours la même quantité ?", "Identifie la valeur initiale, la variation par période et le nombre de périodes avant d’écrire le modèle."],
      [/fonctions affines/i, "Distingue valeur initiale et variation par unité.", "Dans ax+b, a représente la variation constante et b la valeur obtenue pour une entrée nulle."],
    ],
    success: "Exact. La croissance linéaire et son rang initial sont cohérents.",
  },
  "fonctions-second-degre-premiere-techno": {
    level: "premiere-techno",
    skills: [
      [/image|fonctions de référence/i, "Repère la forme de la fonction et la valeur donnée.", "Remplace l’entrée avec des parenthèses, puis calcule le carré avant les autres opérations."],
      [/racines|factorisation|signe/i, "Repère ce que la forme factorisée rend visible.", "Les racines annulent un facteur ; utilise ensuite leur ordre et le signe du coefficient pour étudier le signe."],
      [/allure|sommet et axe de symétrie/i, "Repère l’orientation et l’axe de la parabole.", "Utilise le signe du coefficient dominant et les coordonnées du sommet, sans confondre racine et extremum."],
      [/résolution graphique/i, "Les solutions cherchées sont des abscisses.", "Repère les intersections avec la droite de niveau demandée, puis lis leurs abscisses."],
      [/détermination de f/i, "Choisis la forme qui utilise directement les informations données.", "Remplace les points ou les racines dans la forme adaptée, puis détermine les coefficients restants."],
    ],
    success: "Exact. La forme du polynôme correspond à l’information utilisée.",
  },
  "derivation-premiere-techno": {
    level: "premiere-techno",
    skills: [
      [/taux de variation|sécantes et tangente|approximation du nombre dérivé/i, "Repère les deux accroissements comparés.", "Calcule le quotient dans le même ordre ; le nombre dérivé est la limite des pentes des sécantes."],
      [/nombre dérivé|équation de la tangente/i, "Distingue le point de contact et la pente.", "Utilise y=f'(a)(x−a)+f(a), en calculant séparément f(a) et f'(a)."],
      [/fonctions de référence|dérivée d'un polynôme|dérivée de kf/i, "Identifie chaque terme avant de dériver.", "Applique les dérivées de référence terme par terme et conserve les coefficients constants."],
      [/sens de variation|extremums/i, "Étudie le signe de f' sur les intervalles.", "Déduis les variations du signe de f' ; f'(a)=0 ne suffit à donner un extremum que si les variations changent."],
    ],
    success: "Exact. La dérivée est interprétée avec son signe et son contexte.",
  },
  "combinatoire-denombrement-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/principe multiplicatif|applications/i, "Décompose le choix en étapes compatibles.", "Multiplie les nombres de possibilités des étapes successives ; additionne seulement des cas distincts et incompatibles."],
      [/dénombrement de tirages/i, "Précise si l’ordre compte et si la répétition est autorisée.", "Choisis le modèle après ces deux vérifications, puis contrôle que chaque résultat est compté une seule fois."],
      [/factorielles/i, "Repère combien d’objets distincts sont ordonnés.", "Pour ordonner n objets distincts, utilise n! ; adapte si certaines positions ou certains objets sont déjà fixés."],
      [/coefficients binomiaux/i, "Ici, seul le groupe choisi compte, pas son ordre.", "Utilise le coefficient binomial pour choisir k éléments parmi n, puis vérifie les bornes 0≤k≤n."],
      [/parties d'un ensemble/i, "Pour chaque élément, deux choix sont possibles.", "Un sous-ensemble contient ou non chacun des n éléments, ce qui donne 2^n parties."],
    ],
    success: "Exact. Le dénombrement compte chaque possibilité une seule fois.",
  },
  "vecteurs-droites-plans-espace-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/coordonnées|relation de Chasles/i, "Identifie les vecteurs et le repère utilisés.", "Traduis la relation coordonnée par coordonnée, puis vérifie qu’elle respecte les points de départ et d’arrivée."],
      [/alignement/i, "Cherche une relation de colinéarité entre deux vecteurs.", "Calcule deux vecteurs issus d’un même point et vérifie l’existence d’un même coefficient dans les trois coordonnées."],
      [/combinaisons linéaires/i, "Identifie les vecteurs qui engendrent la direction recherchée.", "Écris l’égalité vectorielle avec des coefficients inconnus, puis résous le système coordonnée par coordonnée."],
      [/droites|positions relatives/i, "Compare les directions avant de chercher une intersection.", "Étudie la colinéarité des vecteurs directeurs, puis résous les représentations paramétriques si nécessaire."],
      [/coplanarité/i, "Cherche si un vecteur dépend de deux directions du plan.", "Exprime-le comme combinaison linéaire de deux vecteurs non colinéaires du plan, puis justifie la conclusion."],
    ],
    success: "Exact. La relation vectorielle est établie dans les trois coordonnées.",
  },
  "logarithme-decimal-terminale-techno": {
    level: "terminale-techno",
    skills: [
      [/valeurs immédiates|ordre de grandeur/i, "Relie le logarithme à une puissance de 10.", "Cherche l’exposant x tel que 10^x donne la valeur étudiée, puis interprète l’ordre de grandeur."],
      [/propriétés algébriques/i, "Transforme produits et quotients avant les logarithmes.", "Utilise log(ab)=log(a)+log(b) et log(a/b)=log(a)−log(b), avec des arguments strictement positifs."],
      [/résolution|calcul approché/i, "Vérifie d’abord que les quantités dans le logarithme sont positives.", "Isole la puissance ou le logarithme, applique la fonction réciproque adaptée, puis contrôle la solution."],
      [/sens de variation/i, "Le logarithme décimal est croissant sur les nombres positifs.", "Contrôle le domaine, puis conserve l’ordre lorsque tu appliques log ou la puissance de 10."],
    ],
    success: "Exact. Le logarithme est utilisé sur son domaine avec la bonne propriété.",
  },
  proportionnalite: {
    level: "sixieme",
    skills: [
      [/quatrième proportionnelle|coefficient de proportionnalité|compléter un tableau/i, "Cherche ce qui relie les deux grandeurs.", "Trouve le multiplicateur constant ou passe par la valeur pour une unité, puis complète avec la même relation."],
      [/reconnaître un tableau|identifier une situation/i, "Compare plusieurs couples de valeurs.", "Vérifie qu’un même multiplicateur relie toujours les deux grandeurs ; un seul couple ne suffit pas."],
      [/pourcentage|remises/i, "Repère la quantité qui représente le tout.", "Prends cette quantité comme 100 %, calcule la part demandée, puis ajoute ou retire seulement si la situation le demande."],
      [/échelles|recettes|consommation|peinture|partage|meilleur prix/i, "Commence par donner du sens à une unité.", "Passe à l’unité ou utilise la relation multiplicative du contexte, puis reviens à la quantité demandée avec les bonnes unités."],
      [/comparer deux proportions|pourcentage inverse/i, "Quelle grandeur sert de référence dans chaque rapport ?", "Écris chaque proportion avec son propre total, puis compare ou retrouve la valeur de départ sans appliquer une règle automatique."],
    ],
    success: "Exact. Les deux grandeurs sont reliées par la même relation.",
  },
  triangles: {
    level: "cinquieme",
    skills: [
      [/triangles — angles/i, "Dans un triangle, les trois angles forment 180°.", "Additionne les angles connus, puis retire cette somme à 180° en tenant compte des codages."],
      [/isocèle/i, "Repère les deux côtés ou les deux angles codés égaux.", "Dans un triangle isocèle, les angles à la base sont égaux ; utilise cette propriété avec la somme de 180°."],
      [/médiatrices|cercle circonscrit/i, "Observe quel point est à égale distance des sommets.", "La médiatrice d’un côté regroupe les points équidistants de ses extrémités ; leur intersection est le centre du cercle circonscrit."],
      [/hauteurs|médianes/i, "Repère le côté ou le milieu visé par la droite.", "Une hauteur est perpendiculaire au côté opposé ; une médiane relie un sommet au milieu du côté opposé."],
      [/aire|figures composées/i, "Choisis une base et la hauteur qui lui est perpendiculaire.", "Utilise base×hauteur÷2 pour un triangle, puis découpe ou additionne les figures sans compter deux fois une zone."],
      [/culture mathématique/i, "Lis les propriétés et les codages avant de nommer la figure.", "Relie le vocabulaire aux côtés, aux angles et aux droites réellement indiqués."],
    ],
    success: "Exact. La propriété utilisée correspond aux codages de la figure.",
  },
  "proportionnalite-troisieme": {
    level: "troisieme",
    skills: [
      [/ratios/i, "Identifie les deux quantités et leur ordre dans le rapport.", "Simplifie le ratio ou exprime chaque part par rapport au même total, puis interprète-le dans le contexte."],
      [/évolutions en pourcentage/i, "Distingue le taux du coefficient multiplicateur.", "Traduis chaque taux par 1+t ou 1−t ; pour plusieurs évolutions, multiplie les coefficients plutôt que d’additionner les taux."],
      [/coefficient réciproque|revenir/i, "Le retour se calcule à partir de la nouvelle valeur.", "Inverse le coefficient de l’évolution initiale, puis transforme ce coefficient réciproque en taux."],
      [/proportionnalité|appliquer/i, "Choisis la relation adaptée au contexte.", "Utilise passage à l’unité, coefficient ou linéarité selon les données, puis contrôle les unités et l’ordre de grandeur."],
    ],
    success: "Exact. Le rapport ou le coefficient traduit correctement la situation.",
  },
  "statistiques-troisieme": {
    level: "troisieme",
    skills: [
      [/paramètres statistiques/i, "Vérifie d’abord quelles données doivent intervenir.", "Range la série si nécessaire, tiens compte des effectifs, puis calcule uniquement l’indicateur demandé : moyenne, médiane ou étendue."],
      [/représentations graphiques/i, "Lis les axes, les classes et les graduations.", "Relie chaque hauteur, secteur ou point à son effectif ou sa fréquence, avec le bon total de référence."],
      [/comparer deux séries|tableau à classes|diagramme circulaire/i, "Choisis les mêmes indicateurs pour les deux séries.", "Calcule ou lis chaque indicateur avec sa population, puis formule une comparaison limitée à ce qu’il permet d’affirmer."],
    ],
    success: "Exact. L’indicateur statistique utilise les données pertinentes.",
  },
  "vecteurs-seconde": {
    level: "seconde",
    skills: [
      [/coordonnées d'un vecteur|vecteurs définis par des points/i, "Respecte l’ordre origine puis extrémité.", "Soustrais les coordonnées du point de départ à celles du point d’arrivée, coordonnée par coordonnée."],
      [/norme d'un vecteur/i, "La norme mesure une longueur, pas une direction.", "À partir des coordonnées, utilise la racine de la somme des carrés et vérifie que le résultat est positif."],
      [/égalité de vecteurs|translations|direction et sens/i, "Compare les coordonnées et le sens des déplacements.", "Deux vecteurs sont égaux s’ils ont les mêmes coordonnées ; interprète ensuite direction, sens et longueur dans la figure."],
      [/relation de Chasles|somme de vecteurs|vecteur opposé/i, "Repère les points de départ et d’arrivée.", "Enchaîne les déplacements par un point intermédiaire et simplifie les vecteurs dont les extrémités se suivent."],
      [/parallélogramme|milieu|équation vectorielle|multiplication|combinaison|propriétés/i, "Choisis une relation vectorielle cohérente avec la figure.", "Traduis-la coordonnée par coordonnée, résous les égalités obtenues puis vérifie le sens géométrique."],
    ],
    success: "Exact. Les coordonnées et le sens du vecteur sont cohérents.",
  },
  "colinearite-vecteurs-seconde": {
    level: "seconde",
    skills: [
      [/déterminant|reconnaître deux vecteurs colinéaires|propriétés/i, "Compare les directions avec un critère calculable.", "Calcule le déterminant dans un ordre constant ; il doit être nul pour conclure à la colinéarité."],
      [/coefficient de colinéarité|équation de colinéarité/i, "Cherche un même multiplicateur pour les deux coordonnées.", "Écris une coordonnée comme multiple de l’autre, puis vérifie que le même coefficient convient partout."],
      [/alignement de points/i, "Construis deux vecteurs à partir d’un même point.", "Vérifie leur colinéarité avec le critère de ton choix, puis seulement conclus sur l’alignement."],
      [/parallélisme|vecteurs directeurs|axes/i, "Repère les vecteurs qui donnent la direction des droites.", "Compare leurs directions par colinéarité, sans confondre droites parallèles et vecteurs égaux."],
    ],
    success: "Exact. La conclusion repose sur un critère de colinéarité vérifié.",
  },
  "vecteurs-produit-scalaire-premiere-spe": {
    level: "premiere-spe",
    skills: [
      [/calcul avec les coordonnées|vecteurs définis par des points|bilinéarité|symétrie/i, "Identifie la forme du produit scalaire avant de calculer.", "Utilise les coordonnées ou développe par bilinéarité, puis contrôle les signes et la symétrie du produit."],
      [/norme|cas particulier u·u|développement de normes/i, "Relie le produit d’un vecteur par lui-même à sa norme.", "Utilise u·u=||u||² et développe les normes carrées avant de prendre éventuellement une racine."],
      [/orthogonalité|triangle rectangle/i, "Quelle égalité permet de vérifier l’angle droit ?", "Calcule le produit scalaire avec les données disponibles ; sa nullité justifie l’orthogonalité, elle ne doit pas être supposée."],
      [/formule avec le cosinus|calcul d'un angle/i, "Repère les deux normes et l’angle entre les vecteurs.", "Utilise u·v=||u||×||v||×cos(θ), puis contrôle que le cosinus obtenu appartient à [−1;1]."],
      [/Al-Kashi/i, "Identifie le côté opposé à l’angle étudié.", "Écris la formule d’Al-Kashi avec les trois côtés dans leur rôle correct, puis isole la grandeur cherchée."],
      [/vrai ou faux/i, "Choisis une propriété vérifiable plutôt qu’une impression géométrique.", "Appuie la réponse sur un calcul de produit scalaire, de norme ou sur un contre-exemple précis."],
    ],
    success: "Exact. La formule du produit scalaire est utilisée avec ses hypothèses.",
  },
  "croissance-exponentielle-premiere-non-spe": {
    level: "premiere-non-spe",
    skills: [
      [/suites géométriques/i, "Repère le rang initial et le coefficient entre deux termes.", "Utilise uₙ=uₚ×q^(n−p) avec le rang réellement donné, puis interprète q comme coefficient par période."],
      [/fonctions exponentielles|modélisation/i, "Identifie la valeur initiale et la durée d’une période.", "Écris valeur initiale×coefficient^(nombre de périodes), puis interprète le résultat dans son unité et son contexte."],
      [/évolutions successives/i, "Un taux n’est pas encore un coefficient multiplicateur.", "Transforme chaque taux en coefficient, multiplie les coefficients successifs, puis reconvertis seulement le résultat global en taux."],
      [/taux d'évolution moyen/i, "Le même coefficient doit agir à chaque période.", "Prends la racine correspondant au nombre de périodes du coefficient global, puis retire 1 pour obtenir le taux moyen."],
    ],
    success: "Exact. Le modèle exponentiel respecte la valeur initiale et le nombre de périodes.",
  },
  "modelisation-quadratique-premiere-non-spe": {
    level: "premiere-non-spe",
    skills: [
      [/forme canonique et forme développée/i, "Choisis la forme qui rend visible l’information demandée.", "La forme développée donne les coefficients ; la forme canonique donne le sommet. Vérifie l’équivalence en développant."],
      [/discriminant|résolution d'une équation/i, "Repère les coefficients avec leurs signes.", "Calcule le discriminant, puis utilise le cas correspondant au nombre de solutions sans oublier le contexte du modèle."],
      [/signe d'un trinôme|inéquation/i, "Place les racines dans l’ordre et observe l’orientation de la parabole.", "Étudie le signe sur les intervalles délimités par les racines, puis conserve seulement les valeurs pertinentes pour la situation."],
      [/sommet de la parabole|modélisation/i, "Distingue la valeur extrême du moment où elle est atteinte.", "Lis ou calcule les deux coordonnées du sommet, puis interprète chacune dans les unités du problème."],
    ],
    success: "Exact. Le modèle quadratique est interprété dans la situation étudiée.",
  },
  "probabilites-quatrieme": {
    level: "quatrieme",
    skills: [
      [/calculer|équiprobabilité/i, "Décris l’univers et l’événement avant de calculer.", "Si les issues sont équiprobables, utilise cas favorables sur cas possibles ; sinon, appuie-toi sur les probabilités données."],
      [/vocabulaire/i, "Distingue issue, événement et univers.", "Décris précisément l’ensemble des issues concernées avant de qualifier l’événement."],
      [/événement contraire/i, "Quel événement complète exactement celui qui est donné ?", "Vérifie qu’ils sont incompatibles et couvrent tout l’univers, puis utilise P contraire = 1−P."],
      [/vérifier/i, "Contrôle le total et les bornes d’une probabilité.", "Chaque probabilité doit être entre 0 et 1 et la somme des probabilités de toutes les issues doit valoir 1."],
      [/problèmes/i, "Repère d’abord l’univers de référence.", "Traduis la question en événement, identifie les données utiles, puis choisis une relation sans supposer l’équiprobabilité."],
    ],
    success: "Exact. La probabilité utilise le bon univers de référence.",
  },
  "trigonometrie-premiere-spe": {
    level: "premiere-spe",
    skills: [
      [/radian|longueur d'arc/i, "Relie l’angle à un tour complet.", "Utilise π radians = 180° et longueur d’arc = rayon×angle en radians, avec des unités cohérentes."],
      [/valeurs remarquables/i, "Repère l’angle de référence sur le cercle trigonométrique.", "Utilise les coordonnées du point du cercle pour lire cosinus et sinus, puis contrôle leur signe."],
      [/relation fondamentale/i, "Relie sinus et cosinus d’un même angle.", "Utilise cos²(x)+sin²(x)=1, puis conserve seulement les signes compatibles avec le quadrant."],
      [/angles associés|signe selon le quadrant/i, "Identifie le quadrant et l’angle de référence.", "Déduis le signe de chaque coordonnée sur le cercle, puis applique la relation d’angle associé adaptée."],
      [/triangle rectangle|formules d'addition|formules de duplication/i, "Identifie les angles et les données réellement disponibles.", "Choisis la relation qui relie ces données, puis vérifie l’unité des angles et les signes avant de calculer."],
      [/équations trigonométriques/i, "Cherche d’abord les angles de référence.", "Résous sur le cercle, ajoute la périodicité, puis restreins les solutions à l’intervalle demandé."],
    ],
    success: "Exact. L’angle, son unité et son quadrant sont cohérents.",
  },
  "variations-instantanees-premiere-non-spe": {
    level: "premiere-non-spe",
    skills: [
      [/nombre dérivé|taux d'accroissement/i, "Distingue la variation de la fonction de celle de l’entrée.", "Calcule le quotient des accroissements dans le même ordre ; le nombre dérivé décrit la pente locale."],
      [/tangente/i, "Sépare le point de contact et la pente.", "Utilise la valeur de la fonction au point et le nombre dérivé comme coefficient directeur de la tangente."],
      [/interprétation physique/i, "Repère les unités des deux grandeurs.", "Interprète le nombre dérivé comme un taux instantané avec son unité, sans le confondre avec une variation totale."],
      [/sens de variation|extremum/i, "Étudie le signe de la dérivée autour du point.", "Déduis les variations intervalle par intervalle ; une dérivée nulle seule ne suffit pas à prouver un extremum."],
    ],
    success: "Exact. Le nombre dérivé est interprété comme une variation locale.",
  },
  "probabilites-conditionnelles-premiere-techno": {
    level: "premiere-techno",
    skills: [
      [/probabilités conditionnelles/i, "Quel événement définit la nouvelle population de référence ?", "Restreins l’univers à la condition, puis calcule la part de l’événement dans cette population."],
      [/indépendance/i, "Ne confonds pas indépendance et incompatibilité.", "Vérifie une égalité comme P(A∩B)=P(A)P(B) ou P_A(B)=P(B) avant de conclure."],
      [/probabilités totales/i, "Repère une partition complète de l’univers.", "Décompose l’événement selon les cas de la partition, calcule chaque intersection puis additionne ces cas incompatibles."],
      [/arbre pondéré|vrai ou faux/i, "Lis les conditions portées par chaque branche.", "Multiplie le long d’un chemin, additionne des chemins incompatibles et vérifie les sommes de branches avant de conclure."],
    ],
    success: "Exact. Le conditionnement utilise la bonne population de référence.",
  },
  "epreuves-independantes-premiere-techno": {
    level: "premiere-techno",
    skills: [
      [/Bernoulli/i, "Identifie le succès et l’échec.", "Vérifie qu’il existe exactement deux issues, puis note la probabilité constante du succès et celle de l’échec."],
      [/répétition de Bernoulli/i, "Vérifie le nombre d’épreuves et leur indépendance.", "Repère n, p et le nombre de succès visé ; compte les chemins correspondants avant de calculer leur probabilité."],
      [/arbre pondéré/i, "Chaque niveau représente une nouvelle épreuve.", "Multiplie les probabilités le long d’un chemin et additionne seulement les chemins correspondant à l’événement demandé."],
      [/au moins un|probabilité exacte|nombre de chemins/i, "Décris l’événement contraire ou le nombre de succès attendu.", "Pour « au moins un », utilise souvent le complément de zéro succès ; sinon, compte les chemins sans double comptage."],
    ],
    success: "Exact. Les hypothèses de l’épreuve répétée sont correctement utilisées.",
  },
  "orthogonalite-distances-espace-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/produit scalaire/i, "Identifie les deux directions comparées.", "Calcule le produit scalaire dans le repère donné et interprète sa nullité seulement après avoir vérifié les vecteurs utilisés."],
      [/vecteur normal/i, "Cherche une direction orthogonale au plan.", "Vérifie l’orthogonalité avec deux directions non colinéaires du plan, sans supposer le résultat à partir de la figure."],
      [/équation d'un plan/i, "Repère un point du plan et un vecteur normal.", "Construis l’équation cartésienne avec le vecteur normal, puis vérifie que le point donné la satisfait."],
      [/distance point-plan|distances/i, "Identifie la projection orthogonale ou l’équation du plan.", "Utilise la formule de distance avec un vecteur normal et normalise par sa norme, puis contrôle la positivité."],
      [/positions relatives/i, "Compare d’abord les directions et les vecteurs normaux.", "Étudie parallélisme ou orthogonalité avant de rechercher une éventuelle intersection."],
    ],
    success: "Exact. La propriété d’orthogonalité est justifiée dans l’espace.",
  },
  "limites-fonctions-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/fonctions rationnelles|fonctions polynomiales/i, "Identifie le terme dominant au voisinage étudié.", "Factorise par la puissance dominante ou compare les degrés, puis contrôle le signe selon la direction de la limite."],
      [/croissance comparée/i, "Repère les familles de fonctions en présence.", "Utilise une croissance comparée connue avec ses conditions, après avoir transformé l’expression dans une forme adaptée."],
      [/asymptotes/i, "Une valeur interdite seule ne prouve pas une asymptote.", "Calcule la limite au voisinage ou à l’infini ; conclus à une asymptote seulement si la limite correspondante le justifie."],
      [/opérations sur les limites/i, "Vérifie si la forme obtenue est déterminée.", "Applique les règles usuelles seulement hors forme indéterminée ; sinon, transforme l’expression avant de reprendre la limite."],
      [/théorème des gendarmes/i, "Cherche deux fonctions qui encadrent sur le même voisinage.", "Vérifie l’encadrement et l’égalité des deux limites avant d’appliquer le théorème."],
    ],
    success: "Exact. La limite est obtenue après contrôle de la forme et du voisinage.",
  },
  "continuite-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/théorème des valeurs intermédiaires/i, "Vérifie l’intervalle, la continuité et la valeur encadrée.", "Sur un intervalle fermé, une fonction continue prend toute valeur entre les images des bornes ; cela assure l’existence, pas toujours l’unicité."],
      [/nombre de solutions|unicité/i, "Sépare l’existence de l’unicité.", "Utilise le TVI pour l’existence et ajoute une stricte monotonie sur l’intervalle pour conclure à une solution unique."],
      [/fonctions usuelles|opérations sur les fonctions continues/i, "Identifie le domaine avant d’utiliser la continuité.", "Combine les théorèmes de continuité sur un domaine où chaque opération est définie, notamment hors dénominateur nul."],
      [/dichotomie/i, "Conserve un intervalle où les images encadrent la valeur cherchée.", "Teste le milieu, garde le sous-intervalle qui préserve l’encadrement, puis répète jusqu’à la précision demandée."],
      [/suites récurrentes/i, "Relie la récurrence à la fonction qui définit le terme suivant.", "Si une limite existe, elle doit vérifier l’équation du point fixe ; démontre séparément les conditions de convergence."],
    ],
    success: "Exact. Les hypothèses de continuité et d’unicité sont explicitement vérifiées.",
  },
  "automatismes-terminale-techno": {
    level: "terminale-techno",
    skills: [
      [/suites/i, "Repère le rang et le type de suite.", "Applique directement la relation adaptée au rang donné."],
      [/exponentielles/i, "Distingue taux, coefficient et exposant.", "Écris le coefficient par période, puis applique-le au bon nombre de périodes."],
      [/logarithme/i, "Relie le logarithme à une puissance de 10.", "Utilise la propriété adaptée sur des arguments positifs."],
      [/statistiques/i, "Repère l’indicateur et les données utiles.", "Calcule l’indicateur demandé avec le bon effectif."],
      [/probabilités/i, "Identifie la condition de référence.", "Lis le chemin ou la proportion correspondant exactement à l’événement."],
      [/variables aléatoires/i, "Repère n, p et l’événement sur X.", "Applique la formule binomiale ou l’espérance en une étape contrôlée."],
    ],
    success: "Exact. L’automatisme est maîtrisé.",
  },
  "probabilites-conditionnelles-terminale-techno": {
    level: "terminale-techno",
    skills: [
      [/partition de l'univers/i, "Vérifie que les cas sont incompatibles et couvrent tout l’univers.", "Décompose l’événement selon chaque cas de la partition avant de calculer les intersections."],
      [/probabilités totales/i, "Identifie tous les chemins qui mènent à l’événement.", "Multiplie sur chaque chemin, puis additionne les chemins incompatibles sans en oublier."],
      [/arbre pondéré/i, "Lis la condition associée à chaque branche.", "Vérifie que les branches issues d’un nœud totalisent 1, puis calcule le chemin demandé."],
      [/problème|piège classique/i, "Quel événement sert réellement de référence ?", "Écris la probabilité conditionnelle avec son événement conditionnant ; P_A(B) et P_B(A) ont des univers de référence différents."],
    ],
    success: "Exact. La probabilité conditionnelle utilise le bon événement de référence.",
  },
  "variables-aleatoires-terminale-techno": {
    level: "terminale-techno",
    skills: [
      [/reconnaître la loi binomiale/i, "Vérifie les hypothèses avant de nommer la loi.", "Il faut n répétitions indépendantes d’une même épreuve à deux issues, avec une probabilité de succès constante p."],
      [/triangle de Pascal|coefficients binomiaux/i, "Le coefficient compte les positions possibles des succès.", "Utilise la ligne n du triangle ou la relation adaptée, puis contrôle 0≤k≤n."],
      [/loi binomiale|calculer avec B/i, "Repère n, p et le nombre de succès k.", "Utilise P(X=k)=C(n,k)p^k(1−p)^(n−k), puis adapte si plusieurs valeurs de X sont demandées."],
      [/espérance/i, "Distingue espérance et valeur certaine.", "Calcule la somme pondérée des valeurs ou np dans le cas binomial, puis interprète-la sur un grand nombre de répétitions."],
      [/interprétation|évènements liés à X|cas particuliers/i, "Traduis l’événement en valeurs possibles de X.", "Écris l’égalité ou l’inégalité sur X, puis additionne les probabilités correspondantes ou utilise un complément."],
    ],
    success: "Exact. Le modèle probabiliste et l’événement sur X sont correctement identifiés.",
  },
  "reviser-les-bases": {
    level: "sixieme",
    skills: [
      [/nombres entiers/i, "Lis le nombre par groupes de trois chiffres.", "Repère millions, milliers et unités, puis traite un seul groupe à la fois."],
      [/automatismes/i, "Commence par l’opération la plus simple.", "Écris une étape par ligne et vérifie l’ordre des opérations."],
      [/géométrie/i, "Repère les mots qui décrivent la figure.", "Associe chaque propriété au bon objet : point, segment, droite ou angle."],
      [/problèmes/i, "Cherche ce que la question demande.", "Relève les données utiles, choisis l’opération, puis écris une phrase-réponse."],
    ],
    success: "Exact. Tu as utilisé la bonne base de calcul.",
  },
  "automatismes-sixieme": {
    level: "sixieme",
    skills: [
      [/fraction|dixièmes|quarts|pourcentage/i, "Imagine l’unité partagée en parts égales.", "Repère la taille d’une part, puis compte le nombre de parts."],
      [/angle|triangle|cercle|symétrie|longueur|aire|périmètre/i, "Observe la figure ou l’unité demandée.", "Choisis la propriété ou la conversion adaptée, puis fais un calcul court."],
      [/durée|heure|contenance|masse/i, "Mets les deux mesures dans la même unité.", "Convertis d’abord, puis effectue l’opération demandée."],
      [/addition|ajouter|soustraire|multiplier|multiplication|diviser|diviseur|multiple|calcul|table|décimal|arrondir|compléter|double|moitié|tiers|triple|distributivité|lexique|ordre de grandeur|rapport|égalité|suite|axe gradué/i, "Estime le résultat avant de calculer.", "Pose mentalement l’opération dans le bon ordre, puis contrôle avec ton estimation."],
    ],
    success: "Exact. Le calcul est rapide et bien contrôlé.",
  },
  "operations-decimaux": {
    level: "sixieme",
    skills: [
      [/multiplier deux décimaux/i, "Calcule d’abord comme avec des entiers.", "Effectue le produit, puis replace la virgule en comptant les chiffres décimaux des deux facteurs."],
      [/diviser|division euclidienne/i, "Cherche combien de fois le diviseur entre dans le nombre.", "Effectue la division étape par étape et vérifie avec diviseur × quotient + reste."],
      [/ordre de grandeur/i, "Arrondis les nombres à des valeurs faciles.", "Calcule avec les valeurs arrondies puis compare l’ordre de grandeur au résultat proposé."],
      [/aire et périmètre|problèmes|programme de calcul/i, "Traduis une seule information à la fois.", "Choisis la formule ou l’ordre des opérations, calcule, puis indique l’unité si nécessaire."],
      [/puissances de dix/i, "Observe le sens du déplacement de la virgule.", "Multiplier par 10, 100 ou 1 000 décale la virgule vers la droite du nombre de zéros correspondant."],
    ],
    success: "Exact. L’opération décimale et son ordre de grandeur sont cohérents.",
  },
  "reviser-les-bases-cinquieme": {
    level: "cinquieme",
    skills: [
      [/fractions/i, "Repère la taille des parts avant de calculer.", "Utilise des parts de même taille, puis compare ou calcule les numérateurs."],
      [/multiples et diviseurs/i, "Teste les critères les plus simples.", "Vérifie 2, 3, 5, 9 ou 10, puis effectue une division si nécessaire."],
      [/nombres décimaux/i, "Aligne les chiffres de même rang.", "Complète avec des zéros si besoin, puis calcule colonne par colonne."],
      [/pourcentages/i, "Prends 100 comme quantité de référence.", "Écris le pourcentage sous forme décimale, puis multiplie par la quantité totale."],
      [/géométrie|vocabulaire/i, "Relis le mot précis demandé.", "Associe la définition à la propriété avant de conclure."],
    ],
    success: "Exact. Le prérequis est bien maîtrisé.",
  },
  "automatismes-cinquieme": {
    level: "cinquieme",
    skills: [
      [/fraction|pourcentage|coefficient|proportion|échelle|vitesse/i, "Repère la quantité de référence.", "Écris la relation multiplicative puis effectue un seul calcul."],
      [/angle|triangle|disque|aire|volume|segment|symétrie|géométrie|distance|droite graduée|graduation|durée|masse|parallélogramme/i, "Identifie la propriété, l’unité ou la formule utile.", "Remplace les données dans la relation choisie et conserve l’unité."],
      [/probabilit|fréquence|moyenne|statistique|données|événement/i, "Compte les cas ou les valeurs utiles.", "Choisis le bon total de référence puis calcule le rapport demandé."],
      [/calcul|décim|puissance|carré|cube|divis|produit|somme|équation|égalité|facteur|formule|écart|répartir|suite|problème/i, "Repère l’opération prioritaire.", "Effectue une étape courte, puis vérifie le signe et l’ordre de grandeur."],
      [/boucle|entrées et sorties/i, "Suis les instructions dans l’ordre.", "Note la valeur après chaque étape ou répétition, sans anticiper la suivante."],
    ],
    success: "Exact. L’automatisme est correctement appliqué.",
  },
  "divisibilite-fractions": {
    level: "cinquieme",
    skills: [
      [/divisib|multiple|diviseur/i, "Teste d’abord un critère de divisibilité connu.", "Applique les critères de 2, 3, 5, 9 ou 10, puis confirme par une division entière."],
      [/fraction irréductible|simplif/i, "Cherche un diviseur commun aux deux nombres.", "Divise numérateur et dénominateur par le même facteur jusqu’à ce qu’ils soient premiers entre eux."],
      [/fraction|dénominateur commun/i, "Les parts doivent avoir la même taille.", "Trouve un multiple commun des dénominateurs, puis transforme les deux fractions sans changer leur valeur."],
    ],
    success: "Exact. Les propriétés de divisibilité sont bien utilisées.",
  },
  "reviser-les-bases-quatrieme": {
    level: "quatrieme",
    skills: [
      [/nombres relatifs|priorités/i, "Repère les signes et l’opération prioritaire.", "Traite les parenthèses, puis produits et quotients, avant les sommes et différences."],
      [/fractions/i, "Vérifie si les dénominateurs sont comparables.", "Réduis au même dénominateur lorsque l’opération l’exige, puis simplifie le résultat."],
      [/calcul littéral|fonctions/i, "Distingue la valeur connue de l’expression à calculer.", "Remplace ou transforme terme par terme, sans mélanger les termes de nature différente."],
      [/proportionnalité|statistiques/i, "Identifie le total ou le coefficient de référence.", "Écris la relation avant de calculer et interprète le résultat dans le contexte."],
      [/géométrie|puissances/i, "Choisis la propriété correspondant aux données.", "Écris la propriété ou la règle des puissances, puis applique-la avec les signes."],
    ],
    success: "Exact. Le raisonnement s’appuie sur le bon prérequis.",
  },
  "automatismes-quatrieme": {
    level: "quatrieme",
    skills: [
      [/rationnels|additionner|multiplier|priorités|puissances/i, "Contrôle d’abord les signes et les priorités.", "Écris une seule étape intermédiaire puis simplifie le résultat."],
      [/calcul littéral|équations|fonctions/i, "Repère l’expression ou l’inconnue concernée.", "Effectue la même transformation des deux côtés ou remplace la valeur demandée."],
      [/proportionnalité|statistiques|probabilités/i, "Choisis le bon total de référence.", "Écris le rapport ou le coefficient avant d’effectuer le calcul."],
      [/géométrie|Thalès|triangles rectangles/i, "Liste les données utiles de la figure.", "Choisis la propriété dont toutes les conditions sont vérifiées, puis remplace les longueurs."],
    ],
    success: "Exact. La méthode courte est bien choisie.",
  },
  "nombres-relatifs-quatrieme": {
    level: "quatrieme",
    skills: [
      [/additionner|soustraire|compléter/i, "Compare les signes avant de calculer les distances à zéro.", "Même signe : additionne les distances ; signes différents : soustrais-les et garde le signe du plus éloigné de zéro."],
      [/multiplier|diviser|signe d'un produit|signe d'un quotient|signe d'un facteur|carré|produit de facteurs/i, "Compte les facteurs négatifs.", "Un nombre pair de signes négatifs donne un résultat positif ; un nombre impair donne un résultat négatif."],
      [/priorités|chaîne/i, "Repère parenthèses, produits et quotients.", "Calcule d’abord les parenthèses, puis produits et quotients, enfin sommes et différences."],
      [/programme|barème|durées|comparer/i, "Traduis chaque étape avec son signe.", "Construis l’expression complète, puis calcule en contrôlant le sens du résultat."],
    ],
    success: "Exact. Les signes et les priorités sont cohérents.",
  },
  "reviser-les-bases-troisieme": {
    level: "troisieme",
    skills: [
      [/calcul littéral|équations/i, "Choisis la transformation qui conserve l’égalité.", "Réduis les expressions puis applique la même opération aux deux membres."],
      [/fractions|nombres relatifs|priorités|puissances/i, "Contrôle les signes et l’ordre des opérations.", "Traite une priorité à la fois, puis simplifie le résultat final."],
      [/fonctions|proportionnalité/i, "Identifie l’entrée, la sortie et la relation entre elles.", "Écris la formule ou le coefficient, puis remplace la donnée connue."],
      [/statistiques/i, "Repère la population et l’indicateur demandé.", "Choisis le bon effectif total, calcule puis interprète l’indicateur."],
      [/Pythagore/i, "Repère l’hypoténuse et vérifie l’angle droit.", "Écris l’égalité des carrés adaptée avant de remplacer les longueurs."],
    ],
    success: "Exact. La méthode choisie est justifiée.",
  },
  "nombres-entiers-troisieme": {
    level: "troisieme",
    skills: [
      [/divisibilité|division euclidienne|parité/i, "Teste la structure du nombre avant de diviser.", "Utilise un critère de divisibilité ou écris a=bq+r avec un reste compris entre 0 et b−1."],
      [/nombres premiers|facteurs premiers/i, "Teste les petits nombres premiers dans l’ordre.", "Divise successivement par 2, 3, 5, 7… jusqu’à obtenir uniquement des facteurs premiers."],
      [/PGCD/i, "Cherche les facteurs communs aux deux nombres.", "Décompose les deux nombres ou utilise l’algorithme d’Euclide, puis garde les facteurs communs."],
      [/fraction irréductible|simplifier une fraction/i, "Le numérateur et le dénominateur ont-ils un facteur commun ?", "Calcule leur PGCD puis divise les deux termes par ce même nombre."],
    ],
    success: "Exact. La propriété arithmétique est utilisée avec méthode.",
  },
  "reviser-les-bases-seconde": {
    level: "seconde",
    skills: [
      [/calcul littéral|équations|calcul numérique/i, "Identifie la structure avant de transformer.", "Respecte priorités et signes, puis effectue une transformation équivalente à chaque étape."],
      [/fonctions affines/i, "Distingue image, antécédent, pente et ordonnée à l’origine.", "Choisis la relation f(x)=ax+b, puis remplace uniquement la donnée connue."],
      [/proportionnalité|statistiques|probabilités/i, "Identifie la population ou la grandeur de référence.", "Écris le rapport adapté, calcule puis interprète le résultat."],
      [/Pythagore|trigonométrie/i, "Fais apparaître l’angle droit, les côtés connus et l’inconnue.", "Choisis la relation reliant exactement ces données, puis vérifie la plausibilité du résultat."],
    ],
    success: "Exact. Le prérequis est mobilisé sans étape inutile.",
  },
  "generalites-fonctions-seconde": {
    level: "seconde",
    skills: [
      [/ensemble de définition/i, "Cherche quelles valeurs de x rendent l’expression possible.", "Exclus les divisions par zéro et les racines carrées de nombres négatifs, puis écris l’ensemble obtenu."],
      [/image et antécédent|résolution d'équations/i, "Distingue ce qui est connu : x ou f(x).", "Pour une image, remplace x ; pour un antécédent, résous f(x)=valeur."],
      [/courbe représentative|lecture d'un tableau/i, "Pars de l’axe ou de la ligne correspondant à l’entrée.", "Relie l’abscisse à son ordonnée sans inverser image et antécédent."],
      [/tableau de signes/i, "Repère les zéros et les intervalles séparés.", "Lis le signe sur chaque intervalle et traite les zéros à part."],
      [/modes de représentation/i, "Demande-toi quelle information chaque représentation rend visible.", "Relie formule, tableau et courbe en utilisant les mêmes couples (x ; f(x))."],
    ],
    success: "Exact. La représentation et l’information recherchée sont cohérentes.",
  },
  "reviser-les-bases-premiere-spe": {
    level: "premiere-spe",
    skills: [
      [/calcul littéral|calcul numérique/i, "Analyse la structure et les signes avant de calculer.", "Effectue les transformations équivalentes une par une puis contrôle le résultat."],
      [/équations/i, "Détermine le domaine et la forme de l’équation.", "Choisis factorisation, produit nul ou isolement de l’inconnue, puis vérifie les solutions."],
      [/fonctions de référence/i, "Identifie la fonction de référence concernée.", "Utilise son domaine, ses variations et sa représentation avant de conclure."],
      [/proportionnalité/i, "Distingue taux, coefficient et valeur finale.", "Écris le coefficient multiplicateur adapté puis interprète le résultat."],
      [/vecteurs/i, "Choisis une base ou des coordonnées communes.", "Traduis la relation vectorielle coordonnée par coordonnée puis vérifie la direction obtenue."],
    ],
    success: "Exact. Le prérequis algébrique est maîtrisé.",
  },
  "reviser-les-bases-premiere-non-spe": {
    level: "premiere-non-spe",
    skills: [
      [/évolutions et pourcentages/i, "Identifie la valeur de référence et le sens de l’évolution.", "Transforme le taux en coefficient multiplicateur puis applique-le à la valeur initiale."],
      [/lecture de tableaux|statistiques|probabilités/i, "Repère la population de référence avant le calcul.", "Choisis la ligne, la colonne ou le total pertinent puis interprète le rapport."],
      [/fonctions affines|fonction carré/i, "Identifie la fonction et la donnée recherchée.", "Utilise la formule ou la représentation adaptée en distinguant image et antécédent."],
      [/calcul numérique|équations/i, "Contrôle les priorités et les signes.", "Transforme une étape à la fois puis vérifie le résultat dans l’expression initiale."],
    ],
    success: "Exact. L’information chiffrée est interprétée avec la bonne référence.",
  },
  "automatismes-premiere-techno": {
    level: "premiere-techno",
    skills: [
      [/évolutions/i, "Distingue le taux du coefficient multiplicateur.", "Utilise 1+t pour une hausse et 1−t pour une baisse, avec t en écriture décimale."],
      [/lecture de données|lecture graphique/i, "Vérifie les axes, unités et graduations.", "Repère la donnée de départ, lis la valeur correspondante puis interprète-la dans le contexte."],
      [/probabilités conditionnelles/i, "Quelle population sert de référence ?", "Restreins d’abord l’univers à la condition, puis calcule la proportion dans ce nouvel ensemble."],
      [/calcul littéral|équations|signe/i, "Identifie la structure avant de calculer.", "Applique une transformation équivalente, contrôle les signes et vérifie la solution."],
      [/vocabulaire et logique/i, "Distingue hypothèse, conclusion et réciproque.", "Traduis la phrase avec des conditions précises avant de décider si elle est vraie."],
    ],
    success: "Exact. L’automatisme est appliqué avec la bonne interprétation.",
  },
  "reviser-les-bases-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/dérivation/i, "Identifie la structure de la fonction avant de choisir la règle.", "Dérive avec la règle adaptée puis exploite le signe de la dérivée seulement si demandé."],
      [/fonctions exponentielles/i, "Ramène les expressions à une même base si possible.", "Utilise les propriétés de l’exponentielle en contrôlant domaine et monotonie."],
      [/suites/i, "Distingue définition explicite et récurrence.", "Choisis l’expression correspondant au rang demandé puis justifie toute propriété utilisée."],
      [/probabilités/i, "Identifie les événements et le conditionnement.", "Construis l’arbre ou la formule adaptée puis vérifie que les probabilités restent entre 0 et 1."],
      [/équations|vecteurs|évolutions/i, "Choisis le cadre algébrique correspondant aux données.", "Écris la relation complète, résous-la, puis vérifie les conditions du problème."],
    ],
    success: "Exact. Le prérequis est utilisé avec ses hypothèses.",
  },
  "suites-terminale-techno": {
    level: "terminale-techno",
    skills: [
      [/terme général.*arithmétique|preuve arithmétique/i, "Cherche une différence constante entre deux termes.", "Pour une suite arithmétique, utilise uₙ=u₀+nr ou la formule adaptée au rang initial."],
      [/terme général.*géométrique|preuve géométrique/i, "Cherche un quotient constant entre deux termes.", "Pour une suite géométrique, utilise uₙ=u₀×qⁿ ou la formule adaptée au rang initial."],
      [/somme.*arithmétique/i, "Compte le nombre de termes avant d’utiliser la formule.", "Multiplie le nombre de termes par la moyenne du premier et du dernier."],
      [/somme.*géométrique/i, "Repère le premier terme, la raison et le nombre de termes.", "Applique la somme géométrique avec ces trois données et traite séparément le cas q=1."],
      [/moyenne|modélisation/i, "Identifie le type d’évolution avant de choisir le modèle.", "Une variation additive suggère l’arithmétique ; une évolution multiplicative suggère la géométrique."],
    ],
    success: "Exact. Le modèle de suite et ses paramètres sont cohérents.",
  },
  "nombres-decimaux": {
    level: "sixieme",
    skills: [
      [/écrire en chiffres|écriture décimale|décomposition/i, "Construis le nombre classe par classe : unités, dixièmes, centièmes.", "Place chaque chiffre dans son rang, puis relis la partie entière et la partie décimale séparées par la virgule."],
      [/comparer|ranger/i, "Compare d’abord les parties entières.", "Si elles sont égales, complète mentalement avec des zéros et compare dixièmes, puis centièmes, de gauche à droite."],
      [/droite graduée|encadrer/i, "Cherche entre quels deux nombres entiers se trouve le nombre.", "Repère la valeur d’une petite graduation, puis avance depuis la graduation connue sans compter le point de départ."],
      [/fractions décimales/i, "Le dénominateur indique le rang du dernier chiffre.", "Des dixièmes correspondent à un dénominateur 10, des centièmes à 100 et des millièmes à 1 000."],
    ],
    success: "Exact. Tu as correctement utilisé la valeur de position des chiffres.",
  },
  "operations-sur-les-nombres": {
    level: "cinquieme",
    skills: [
      [/priorités opératoires/i, "Repère les parenthèses et les multiplications avant de calculer.", "Calcule d’abord les parenthèses, puis multiplications et divisions, enfin additions et soustractions."],
      [/nommer un calcul/i, "Observe l’opération effectuée en dernier.", "L’opération principale donne le nom de l’expression : somme, différence, produit ou quotient."],
      [/distributivité/i, "Le nombre devant la parenthèse agit sur chacun de ses termes.", "Multiplie ce nombre par chaque terme de la parenthèse, en conservant les signes, puis réduis."],
      [/programme de calcul|choisir une opération/i, "Traduis une seule instruction à la fois.", "Écris les opérations dans l’ordre du programme et ajoute des parenthèses pour conserver cet ordre."],
    ],
    success: "Exact. L’ordre des opérations est correctement respecté.",
  },
  "addition-soustraction-rationnels": {
    level: "quatrieme",
    skills: [
      [/rappels|simplif/i, "Cherche un diviseur commun au numérateur et au dénominateur.", "Divise le numérateur et le dénominateur par le même nombre jusqu’à obtenir une fraction irréductible."],
      [/comparer/i, "Pour comparer sûrement, donne la même taille aux parts.", "Réduis les fractions au même dénominateur, puis compare leurs numérateurs en tenant compte du signe."],
      [/additionner|soustraire|dénominateur/i, "Peut-on additionner directement des parts qui n’ont pas la même taille ?", "Cherche un dénominateur commun, transforme chaque fraction, puis calcule uniquement les numérateurs."],
      [/problèmes/i, "Identifie d’abord les fractions qui décrivent le même tout.", "Traduis la situation par une somme ou une différence de fractions avant de choisir le dénominateur commun."],
    ],
    success: "Exact. Les fractions ont été transformées sans changer leur valeur.",
  },
  fractions: {
    level: "sixieme",
    skills: [
      [/fraction|représent|droite graduée/i, "Relie d’abord le nombre de parts égales au dénominateur.", "Compte les parts d’une unité, puis les parts effectivement prises."],
      [/compar|ranger|encadrer/i, "Cherche ce qui est identique dans les deux fractions.", "Représente-les avec la même unité, puis compare les parts sans mélanger numérateur et dénominateur."],
      [/addition|soustraire/i, "Regarde si les parts ont la même taille.", "Si les dénominateurs sont égaux, garde la taille des parts et calcule seulement le nombre de parts."],
      [/multiplier|fraction d'un nombre/i, "Imagine plusieurs groupes contenant la même fraction.", "Multiplie le nombre de parts prises ; le dénominateur continue de décrire la taille d’une part."],
    ],
    success: "Exact. Tu as bien relié les parts à l’écriture de la fraction.",
  },
  "proportionnalite-cinquieme": {
    level: "cinquieme",
    skills: [
      [/identifier|reconnaître/i, "Vérifie si on multiplie toujours par le même nombre.", "Compare deux quotients correspondants ou cherche une droite passant par l’origine."],
      [/coefficient|valeur manquante/i, "Trouve d’abord ce que vaut une unité ou le multiplicateur constant.", "Calcule le coefficient, puis applique-le à la valeur demandée."],
      [/pourcentage/i, "Traduis le pourcentage comme une part sur 100.", "Calcule d’abord le montant du pourcentage, puis ajoute-le ou retire-le selon la situation."],
      [/échelle|vitesse/i, "Écris les deux grandeurs avec leurs unités.", "Repère la relation multiplicative, effectue le calcul, puis reconvertis l’unité si nécessaire."],
    ],
    success: "Exact. Tu as utilisé une relation multiplicative cohérente.",
  },
  "triangles-rectangles-quatrieme": {
    level: "quatrieme",
    skills: [
      [/hypoténuse/i, "Repère d’abord le côté opposé à l’angle droit.", "Nomme l’hypoténuse, écris l’égalité de Pythagore, puis remplace par les longueurs."],
      [/côté de l'angle droit/i, "Quel côté est l’hypoténuse dans cette figure ?", "Isole le carré du côté cherché en soustrayant le carré de l’autre côté à celui de l’hypoténuse."],
      [/réciproque/i, "Commence par identifier le plus grand côté.", "Compare son carré à la somme des carrés des deux autres avant de conclure."],
      [/problèmes|trigonométrie/i, "Fais un schéma et indique la longueur cherchée.", "Choisis la relation qui relie les données à l’inconnue, puis vérifie que le résultat est plausible."],
    ],
    success: "Exact. Les conditions et le rôle de l’hypoténuse sont correctement identifiés.",
  },
  "calcul-litteral-troisieme": {
    level: "troisieme",
    skills: [
      [/développer/i, "Observe le signe placé devant chaque parenthèse.", "Distribue terme par terme, puis réduis seulement les termes de même nature."],
      [/factoriser/i, "Cherche ce que tous les termes ont en commun.", "Mets le facteur commun devant la parenthèse, puis contrôle en redéveloppant."],
      [/programmes de calcul/i, "Traduis chaque instruction dans l’ordre avec une expression.", "Écris l’expression complète, réduis-la, puis résous l’équation obtenue."],
      [/problèmes/i, "Écris séparément chaque périmètre ou aire en fonction de x.", "Construis l’égalité correspondant à la situation avant de développer ou factoriser."],
    ],
    success: "Exact. La transformation conserve bien la valeur de l’expression.",
  },
  "fonctions-affines-seconde": {
    level: "seconde",
    skills: [
      [/image et antécédent/i, "Distingue ce que tu connais : x ou f(x).", "Pour une image, remplace x ; pour un antécédent, résous l’équation f(x)=valeur."],
      [/taux de variation/i, "Repère les deux variations : celle des images et celle des antécédents.", "Calcule le quotient des variations dans le même ordre : (f(b)-f(a))/(b-a)."],
      [/coefficients|droite représentative/i, "Dans ax+b, quel nombre mesure la pente ?", "Lis a comme coefficient directeur et b comme ordonnée à l’origine."],
      [/sens de variation/i, "Regarde uniquement le signe du coefficient directeur.", "Si a est positif la fonction croît ; s’il est négatif elle décroît ; s’il est nul elle est constante."],
      [/déterminer une fonction/i, "Utilise les deux points pour trouver d’abord la pente.", "Calcule a avec le taux de variation, puis remplace un point dans y=ax+b pour obtenir b."],
    ],
    success: "Exact. L’interprétation de la fonction affine est cohérente.",
  },
  "nombres-calculs-seconde": {
    level: "seconde",
    skills: [
      [/appartient.*intervalle/i, "Teste séparément chaque condition imposée par les bornes.", "Vérifie la valeur par rapport à la borne gauche puis à la borne droite, en respectant les crochets ouverts ou fermés."],
      [/encadrement/i, "Applique l’opération aux deux bornes en surveillant son sens.", "Pour une addition, additionne les bornes correspondantes ; pour une multiplication, examine les produits possibles avant de retenir le minimum et le maximum."],
      [/convertir.*intervalle|inégalité.*intervalle/i, "Repère la borne et demande-toi si elle est autorisée.", "Une inégalité large inclut la borne ; une inégalité stricte l’exclut. Traduis ensuite le sens vers la droite ou la gauche."],
      [/valeur absolue|distance/i, "Une valeur absolue représente une distance, donc elle ne peut pas être négative.", "Traduis |x-a| comme la distance entre x et a sur la droite réelle, puis traite les deux positions possibles si nécessaire."],
    ],
    success: "Exact. L’ensemble ou l’intervalle est interprété avec les bonnes bornes.",
  },
  "second-degre": {
    level: "premiere-spe",
    skills: [
      [/développement|factorisation/i, "Contrôle les signes avant de regrouper les termes.", "Développe facteur par facteur ou vérifie la factorisation en redéveloppant ; les deux formes doivent représenter le même trinôme."],
      [/discriminant|nombre de solutions|résolution/i, "Identifie a, b et c sans perdre leur signe.", "Calcule Δ=b²−4ac, puis choisis le cas Δ<0, Δ=0 ou Δ>0 avant d’écrire les racines."],
      [/forme canonique|formes multiples|détermination/i, "Choisis la forme qui rend visible l’information demandée.", "La forme développée donne les coefficients, la forme canonique le sommet et la forme factorisée les racines."],
      [/signe|inéquations/i, "Place d’abord les racines dans l’ordre et repère le signe de a.", "Le trinôme est du signe de a à l’extérieur des racines et du signe opposé entre elles."],
      [/modélisation/i, "Traduis d’abord la grandeur étudiée par un trinôme.", "Choisis ensuite la forme adaptée à la question et vérifie que la solution respecte le domaine concret."],
    ],
    success: "Exact. La forme du trinôme et son interprétation sont cohérentes.",
  },
  "derivation-premiere-spe": {
    level: "premiere-spe",
    skills: [
      [/taux de variation/i, "Que mesurent séparément le numérateur et le dénominateur ?", "Construis le quotient des accroissements dans le même ordre avant de simplifier."],
      [/nombre dérivé|tangente/i, "Dans f'(a), que représente exactement a ?", "Évalue la dérivée en a : le résultat est la pente de la tangente, pas son ordonnée."],
      [/signe de f'|variations/i, "Lis le signe de f' sur tout l’intervalle concerné.", "Relie f'>0 à la croissance et f'<0 à la décroissance, intervalle par intervalle."],
      [/extremum/i, "Une dérivée nulle suffit-elle toujours à conclure ?", "f'(a)=0 donne un point stationnaire ; vérifie le changement de signe de f' pour conclure à un extremum."],
      [/opérations|composée/i, "Identifie la structure avant de dériver.", "Choisis la règle produit, quotient ou composée, puis dérive chaque élément sans oublier le facteur intérieur."],
    ],
    success: "Exact. Le lien entre dérivée, pente et variation est correctement établi.",
  },
  "analyse-information-chiffree-premiere-non-spe": {
    level: "premiere-non-spe",
    skills: [
      [/proportions|taux/i, "Compare les proportions, pas seulement les effectifs.", "Calcule chaque part dans son propre total, puis compare les valeurs obtenues."],
      [/points de pourcentage/i, "Distingue une différence de taux d’une évolution relative.", "Soustrais les deux pourcentages pour obtenir des points de pourcentage."],
      [/tableaux croisés/i, "Quel total correspond exactement à la population demandée ?", "Choisis la bonne ligne ou colonne comme référence avant de calculer la proportion conditionnelle."],
      [/diagrammes/i, "Vérifie l’échelle avant d’interpréter la forme.", "Recalcule le rapport représenté et contrôle que les longueurs ou angles respectent cette proportion."],
      [/nuages de points/i, "Une corrélation décrit-elle forcément une cause ?", "Décris le sens et la force de l’association sans transformer automatiquement corrélation en causalité."],
    ],
    success: "Exact. L’indicateur est interprété avec la bonne population de référence.",
  },
  "statistiques-deux-variables-premiere-techno": {
    level: "premiere-techno",
    skills: [
      [/nuage de points/i, "Lis les coordonnées avec les graduations des deux axes.", "Pars de l’abscisse demandée, rejoins le point, puis lis son ordonnée avec l’échelle."],
      [/point moyen/i, "Le point moyen utilise toutes les coordonnées.", "Calcule séparément la moyenne des abscisses et celle des ordonnées."],
      [/ajustement affine/i, "Le coefficient directeur mesure une variation de y pour une variation de x.", "Calcule (y₂-y₁)/(x₂-x₁), puis interprète le signe dans le contexte."],
      [/Mayer/i, "Le partage doit conserver l’ordre des abscisses.", "Calcule le point moyen de chaque moitié, puis détermine la droite passant par ces deux points."],
    ],
    success: "Exact. Le modèle statistique est calculé et interprété dans son contexte.",
  },
  "reviser-les-bases-premiere-techno": {
    level: "premiere-techno",
    skills: [
      [/calcule .*% de/i, "Repère la quantité de référence : c’est elle qui représente 100 %.", "Écris le pourcentage sous forme décimale puis multiplie-le par la quantité de référence."],
      [/coefficient multiplicateur/i, "Un taux et un coefficient multiplicateur ne s’écrivent pas de la même façon.", "Pour une hausse, utilise 1+t ; pour une baisse, 1−t, avec t écrit sous forme décimale."],
      [/valeur finale/i, "Commence par identifier la valeur initiale et le sens de l’évolution.", "Construis le coefficient multiplicateur adapté, puis multiplie la valeur initiale par ce coefficient."],
      [/taux d'évolution global|augmente.*puis.*diminue/i, "Deux évolutions successives ne s’additionnent pas.", "Transforme chaque taux en coefficient multiplicateur, multiplie les coefficients, puis reconvertis le coefficient global en taux."],
      [/revenir exactement.*valeur initiale/i, "Le taux opposé ne ramène généralement pas à la valeur initiale.", "Prends l’inverse du premier coefficient multiplicateur, puis transforme ce coefficient réciproque en taux."],
    ],
    success: "Exact. Le pourcentage est appliqué à la bonne valeur de référence.",
  },
  "calcul-integral-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/signe et encadrement/i, "Quelle propriété des intégrales est réellement applicable ici ?", "Contrôle les hypothèses avant de conclure : une fonction positive donne une intégrale supérieure ou égale à zéro, pas nécessairement strictement positive."],
      [/aire/i, "Une aire géométrique peut-elle être négative ?", "Identifie la fonction supérieure et intègre leur différence ; si la courbe traverse l’axe, découpe l’intervalle."],
      [/Chasles|linéarité/i, "Écris la propriété avant de remplacer les valeurs.", "Respecte l’ordre des bornes et applique la linéarité terme à terme."],
      [/fonction définie par une intégrale/i, "Reconnais la forme du théorème fondamental.", "Si F(x)=∫c^x u(t)dt avec u continue, alors F'(x)=u(x)."],
      [/valeur moyenne/i, "La valeur moyenne dépend aussi de la longueur de l’intervalle.", "Divise l’intégrale par b-a, puis interprète le résultat comme une hauteur moyenne."],
    ],
    success: "Exact. La propriété d’intégration est utilisée avec ses hypothèses.",
  },
  "suites-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/limites/i, "Identifie d’abord la famille de la suite et le terme dominant.", "Applique la limite de référence avec ses hypothèses ; en cas de forme indéterminée, transforme l’expression avant de conclure."],
      [/théorèmes de convergence|comparaison|gendarmes/i, "Quel encadrement ou quelle monotonie est réellement démontré ?", "Énonce les hypothèses du théorème choisi, vérifie-les une par une, puis seulement conclus sur la limite."],
      [/arithmético-géométriques/i, "Cherche le point fixe avant de transformer la suite.", "Définis une suite auxiliaire centrée sur le point fixe, montre qu’elle est géométrique, puis reviens à la suite initiale."],
      [/sachant que.*calcule.*u_|calcule.*u_\{?n\+1/i, "Utilise seulement la relation donnée avec la valeur connue de uₙ.", "Remplace uₙ par sa valeur dans la relation de récurrence, puis effectue le calcul numérique ; aucune preuve par récurrence n’est nécessaire ici."],
      [/raisonnement par récurrence/i, "Distingue la propriété P(n), son initialisation et l’étape d’hérédité.", "Vérifie P au rang initial ; suppose P(n) vraie, démontre P(n+1), puis conclus explicitement pour tout entier du domaine."],
    ],
    success: "Exact. Le raisonnement sur la suite utilise les hypothèses nécessaires.",
  },
  "statistiques-deux-variables-terminale-techno": {
    level: "terminale-techno",
    skills: [
      [/changement de variable/i, "Quel modèle cherche-t-on à rendre affine ?", "Applique le changement de variable indiqué aux données ; l’allure seule ne suffit pas à justifier le modèle."],
      [/retour au modèle/i, "Il faut maintenant annuler le changement de variable.", "Exprime y avec la fonction réciproque adaptée, puis distingue la prédiction du modèle de la valeur réelle."],
      [/point moyen/i, "Utilise toutes les observations, avec leur effectif.", "Additionne les coordonnées concernées, divise par l’effectif, puis garde la précision demandée."],
    ],
    success: "Exact. Tu distingues correctement les données transformées, le modèle et son interprétation.",
  },
  "reviser-les-bases-terminale-techno": {
    level: "terminale-techno",
    skills: [
      [/augmente.*coefficient multiplicateur/i, "Traduis le taux en écriture décimale avant de construire le coefficient.", "Pour une hausse de t %, le coefficient multiplicateur vaut 1+t/100 ; contrôle qu’il est supérieur à 1."],
      [/diminue.*coefficient multiplicateur/i, "Une baisse doit produire un coefficient compris entre 0 et 1.", "Pour une baisse de t %, utilise 1−t/100, puis contrôle le sens économique du résultat."],
      [/évolutions successives|taux d'évolution global/i, "Évalue chaque évolution séparément avant d’interpréter l’ensemble.", "Multiplie les coefficients successifs, puis utilise CM global−1 pour obtenir le taux global et interprète son signe."],
      [/taux réciproque|revenir exactement/i, "Le retour dépend de la nouvelle base, pas de la valeur initiale.", "Inverse le coefficient de la première évolution, puis traduis ce coefficient réciproque en taux."],
      [/coefficient multiplicateur/i, "Distingue le taux, le coefficient et la valeur obtenue.", "Construis le coefficient à partir du taux et contrôle s’il est cohérent avec une hausse ou une baisse."],
    ],
    success: "Exact. Le coefficient traduit correctement le sens de l’évolution.",
  },
  "notion-fonctions": {
    level: "quatrieme",
    skills: [
      [/tableau de valeurs/i, "Repère d’abord ce qui est donné et ce que tu cherches.", "Dans un tableau, la ligne des entrées donne x et la ligne des sorties donne son image. Pour un antécédent, pars de la sortie et retrouve l’entrée correspondante."],
      [/image, antécédent/i, "Repère d’abord ce qui est donné et ce que tu cherches.", "Si x est donné, remplace x pour calculer son image. Si la sortie est donnée, cherche l’entrée qui produit cette valeur."],
      [/proportionnalité/i, "Vérifie si toutes les sorties s’obtiennent avec le même multiplicateur.", "Compare les rapports sortie/entrée pour plusieurs colonnes ; une seule égalité ne suffit pas à caractériser toute la fonction."],
      [/problèmes/i, "Identifie l’entrée et la grandeur qui en dépend.", "Traduis la situation par une expression, remplace l’entrée demandée, puis contrôle l’unité et le sens du résultat."],
    ],
    success: "Exact. Tu as distingué l’entrée, la sortie et la valeur recherchée.",
  },
  "proportionnalite-quatrieme": {
    level: "quatrieme",
    skills: [
      [/quatrième proportionnelle/i, "Cherche la relation multiplicative entre les grandeurs.", "Utilise le passage à l’unité ou le coefficient de proportionnalité, puis applique la même relation à la valeur demandée."],
      [/grandeurs produits et quotients/i, "Écris les deux grandeurs avec leurs unités.", "Choisis la relation adaptée : par exemple distance = vitesse × temps ou vitesse = distance ÷ temps, puis harmonise les unités."],
      [/représentation graphique/i, "Une situation proportionnelle possède un repère graphique précis.", "Vérifie que les points sont alignés sur une droite qui passe par l’origine ; l’alignement seul ne suffit pas."],
      [/agrandissement, réduction/i, "Repère le coefficient appliqué aux longueurs.", "Les longueurs sont multipliées par k, les aires par k² et les volumes par k³. Choisis la puissance adaptée à la grandeur."],
      [/problèmes/i, "Choisis d’abord la grandeur de référence.", "Organise les données dans un tableau ou passe par l’unité, puis contrôle que la relation reste multiplicative."],
    ],
    success: "Exact. La méthode de proportionnalité est adaptée à la situation.",
  },
  "theoreme-thales": {
    level: "quatrieme",
    skills: [
      [/calculer une longueur/i, "Repère les deux triangles et les côtés qui se correspondent.", "Vérifie les alignements et le parallélisme, écris les rapports dans le même ordre, puis isole seulement la longueur cherchée."],
      [/réciproque/i, "Commence par vérifier les alignements et l’ordre des points.", "Compare les rapports de longueurs correspondantes ; leur égalité permet de conclure au parallélisme seulement lorsque la configuration est établie."],
      [/problèmes/i, "Identifie la configuration avant tout calcul.", "Repère les droites parallèles, les alignements et les triangles concernés, puis associe les côtés correspondants avant d’utiliser les rapports."],
    ],
    success: "Exact. Les conditions de Thalès et la correspondance des côtés sont respectées.",
  },
  "probabilites-troisieme": {
    level: "troisieme",
    skills: [
      [/généralités/i, "Décris d’abord l’expérience, ses issues et l’événement demandé.", "Construis l’univers, puis compte uniquement les issues qui réalisent l’événement sans supposer qu’elles sont équiprobables si ce n’est pas indiqué."],
      [/calculs de probabilités/i, "Identifie l’univers et les cas favorables avant de calculer.", "Choisis la bonne référence, vérifie l’équiprobabilité si tu utilises favorable/possible, puis contrôle que le résultat appartient à [0 ; 1]."],
      [/contraire|dernière issue/i, "Toutes les probabilités de l’univers totalisent 1.", "Utilise P(non A)=1−P(A), ou retire de 1 la somme des probabilités déjà connues."],
      [/fréquence|effectif attendu/i, "Une fréquence observée et une probabilité théorique ne sont pas exactement la même chose.", "Multiplie la probabilité par le nombre d’essais pour obtenir un effectif attendu, puis interprète-le comme une prévision."],
    ],
    success: "Exact. La probabilité utilise le bon univers et la bonne référence.",
  },
  "thales-triangles-semblables-troisieme": {
    level: "troisieme",
    skills: [
      [/théorème de Thalès/i, "Vérifie d’abord les alignements et le parallélisme.", "Identifie les deux triangles, associe les côtés correspondants dans le même ordre, puis écris les rapports avant de calculer."],
      [/réciproque et parallélisme/i, "Les rapports ne suffisent qu’avec les alignements requis.", "Vérifie l’ordre des points, compare les rapports correspondants, puis conclus au parallélisme uniquement si toutes les conditions sont réunies."],
      [/agrandissement, réduction/i, "Repère quels côtés ou angles se correspondent.", "Pour des triangles semblables, les angles correspondants sont égaux et les longueurs correspondantes sont multipliées par le même coefficient ; les aires utilisent son carré."],
    ],
    success: "Exact. La configuration et les côtés correspondants sont correctement identifiés.",
  },
  "trigonometrie-triangle-rectangle-troisieme": {
    level: "troisieme",
    skills: [
      [/relations trigonométriques/i, "Repère l’angle considéré et nomme les côtés par rapport à lui.", "Dans le triangle rectangle, identifie hypoténuse, opposé et adjacent, puis choisis le rapport qui relie uniquement les données et l’inconnue."],
      [/calculer une longueur ou une mesure d'angle/i, "Commence par repérer l’angle, les côtés connus et l’inconnue.", "Choisis sinus, cosinus ou tangente à partir des deux côtés concernés ; utilise ensuite la fonction réciproque seulement pour chercher un angle."],
      [/applications/i, "Fais apparaître le triangle rectangle caché dans la situation.", "Place l’angle et les longueurs sur un schéma, identifie opposé, adjacent et hypoténuse, puis sélectionne la relation adaptée."],
    ],
    success: "Exact. Le rapport trigonométrique correspond aux données du triangle rectangle.",
  },
  "mesures-grandeurs-troisieme": {
    level: "troisieme",
    skills: [
      [/vitesse, énergie, débit/i, "Écris la grandeur cherchée et son unité.", "Choisis la relation reliant les trois grandeurs, harmonise les unités, puis isole la grandeur demandée avant de calculer."],
      [/échelles/i, "Une échelle agit sur les longueurs ; l’effet change pour une aire ou un volume.", "Utilise le rapport k pour une longueur, k² pour une aire et k³ pour un volume, puis effectue la conversion d’unité séparément."],
      [/problèmes/i, "Sépare la formule de grandeur et les conversions d’unités.", "Identifie longueur, aire, volume, durée ou débit, applique la formule adaptée, puis convertis le résultat dans l’unité demandée."],
    ],
    success: "Exact. La formule et l’unité sont cohérentes avec la grandeur demandée.",
  },
  "equations-droites-seconde": {
    level: "seconde",
    skills: [
      [/vecteur directeur/i, "Repère la direction de la droite, indépendamment du point choisi.", "À partir de ax+by+c=0, un directeur possible est (−b ; a) ; avec deux points, utilise la différence de leurs coordonnées, à un multiple non nul près."],
      [/équation cartésienne|équation réduite/i, "Choisis la forme qui utilise directement les données disponibles.", "Remplace les coordonnées d’un point dans l’équation choisie, ou convertis algébriquement entre ax+by+c=0 et y=mx+p sans imposer une méthode unique."],
      [/droites particulières/i, "Observe quelle coordonnée reste constante.", "Une droite verticale a une équation x=constante ; une droite horizontale a une équation y=constante."],
      [/position relative|intersection|systèmes/i, "Compare d’abord les directions des deux droites.", "Des directions différentes donnent une intersection unique ; des directions parallèles demandent ensuite de distinguer droites confondues et strictement parallèles."],
    ],
    success: "Exact. L’équation et l’interprétation géométrique décrivent la même droite.",
  },
  "informations-chiffrees-seconde": {
    level: "seconde",
    skills: [
      [/proportions|proportion d'une proportion|tableau croisé/i, "Repère la partie et le total qui sert de référence.", "Calcule partie/total pour une proportion. Dans un tableau croisé, choisis le total de ligne, de colonne ou général indiqué par la question avant de calculer."],
      [/coefficient multiplicateur/i, "Distingue le taux du nombre par lequel la valeur est multipliée.", "Une hausse de t utilise 1+t et une baisse 1−t, avec t en écriture décimale ; reconvertis CM−1 en taux si nécessaire."],
      [/évolutions successives|évolution réciproque/i, "Les taux successifs ne s’additionnent pas.", "Multiplie les coefficients pour l’évolution globale ; pour revenir à la valeur initiale, utilise l’inverse du coefficient global."],
      [/évolutions|variation absolue et relative/i, "Identifie la valeur initiale, qui sert de référence.", "La variation absolue vaut final−initial ; le taux vaut cette variation divisée par la valeur initiale."],
      [/proportion ou évolution/i, "Demande-toi si le pourcentage décrit une part ou un changement.", "Une proportion compare une partie à un total au même instant ; une évolution compare une valeur finale à une valeur initiale. Une différence de pourcentages s’exprime en points."],
    ],
    success: "Exact. Le pourcentage utilise la bonne valeur de référence.",
  },
  "statistiques-descriptives-seconde": {
    level: "seconde",
    skills: [
      [/moyenne/i, "Vérifie si chaque valeur possède le même poids.", "Pour une moyenne simple, additionne puis divise par l’effectif ; avec des effectifs, calcule la somme pondérée puis divise par l’effectif total."],
      [/médiane/i, "Ordonne la série et repère son effectif total.", "Pour un effectif impair, prends la valeur centrale ; pour un effectif pair, utilise les deux valeurs centrales selon la définition demandée."],
      [/quartiles/i, "Travaille sur la série ordonnée et utilise les rangs définis dans le cours.", "Repère les rangs de Q1 et Q3 sans interpoler automatiquement, puis calcule Q3−Q1 seulement pour l’écart interquartile."],
      [/effectifs cumulés/i, "Repère le sens de l’inégalité avant d’additionner.", "Additionne les effectifs jusqu’à la valeur incluse pour “inférieur ou égal”, ou depuis cette valeur pour “supérieur ou égal”."],
      [/comparer deux séries|lecture critique|écart type/i, "Choisis l’indicateur qui répond exactement à la comparaison.", "Compare le centre avec moyenne ou médiane et la dispersion avec étendue, écart interquartile ou écart type ; contrôle aussi l’échelle d’un graphique."],
      [/regroupement par classes/i, "Repère les intervalles, leurs effectifs et la grandeur demandée.", "Pour une moyenne approchée, utilise le milieu de chaque classe avec son effectif ; pour une classe médiane, cherche où l’effectif cumulé atteint la moitié du total."],
    ],
    success: "Exact. L’indicateur statistique est calculé et interprété avec la bonne série.",
  },
  "transformations-plan-troisieme": {
    level: "troisieme",
    skills: [
      [/coordonnées d'images/i, "Identifie la transformation, son centre ou son vecteur avant de calculer.", "Applique uniquement la règle correspondant aux données : translation par addition du vecteur, symétrie autour du centre donné ou rotation avec son angle et son sens."],
      [/homothéties/i, "Repère le centre et le rapport de l’homothétie.", "Depuis le centre, l’image reste sur la même droite ; multiplie la distance orientée par le rapport et tiens compte de son signe."],
      [/propriétés/i, "Cherche ce que la transformation conserve réellement.", "Les isométries conservent longueurs et angles ; une homothétie conserve les angles mais multiplie les longueurs par la valeur absolue de son rapport."],
    ],
    success: "Exact. La transformation et ses données ont été correctement identifiées.",
  },
  "geometrie-espace-troisieme": {
    level: "troisieme",
    skills: [
      [/sections de solides/i, "Repère le solide, le plan de coupe et les points réellement donnés.", "Identifie la forme de la section à partir des faces rencontrées, puis utilise seulement les longueurs ou propriétés indiquées par la configuration."],
      [/la sphère(?! terrestre)/i, "Distingue rayon, diamètre, aire et volume.", "Choisis la formule de la grandeur demandée, remplace le rayon dans la bonne unité, puis contrôle l’unité finale."],
      [/sphère terrestre/i, "Repère latitude, longitude et rayon avant de modéliser.", "Traduis l’angle en fraction de tour pour une distance sur un parallèle ou un méridien, puis distingue la distance sur la sphère d’une distance dans l’espace."],
    ],
    success: "Exact. La représentation du solide et le calcul sont cohérents.",
  },
  "geometrie-reperee-premiere-spe": {
    level: "premiere-spe",
    skills: [
      [/équation d'une droite|vecteur normal/i, "Identifie le rôle du vecteur donné avant de choisir une équation.", "Un vecteur normal (a ; b) conduit à ax+by+c=0 ; détermine c avec un point de la droite. Toute équation proportionnelle décrit la même droite."],
      [/projection orthogonale|distance point-droite/i, "Repère la perpendicularité et le point projeté.", "Détermine le projeté avec la droite perpendiculaire ou utilise la formule de distance après avoir identifié les coefficients de l’équation cartésienne."],
      [/équation de cercle/i, "Repère le centre et le rayon dans l’équation.", "Ramène l’expression à (x−a)²+(y−b)²=r², éventuellement en complétant les carrés, puis vérifie que r² est positif."],
      [/appartenance à un cercle/i, "Teste les coordonnées dans l’équation sans te fier au dessin.", "Calcule la distance au carré entre le point et le centre, puis compare-la au rayon au carré."],
      [/vrai ou faux/i, "Traduis l’affirmation avec les coordonnées et propriétés données.", "Choisis un critère adapté — équation, produit scalaire, distance ou déterminant — puis vérifie-le avant de conclure."],
    ],
    success: "Exact. Le critère géométrique et le calcul en coordonnées concordent.",
  },
  "probabilites-conditionnelles-premiere-spe": {
    level: "premiere-spe",
    skills: [
      [/probabilité conditionnelle|notations/i, "Identifie d’abord l’événement qui sert de condition.", "Dans P_A(B), A est la population de référence : utilise P(A∩B)/P(A), avec P(A)>0, sans intervertir A et B."],
      [/arbre de probabilités/i, "Lis chaque branche avec la condition portée par son nœud de départ.", "Multiplie les probabilités le long d’un chemin pour une intersection, puis additionne les chemins incompatibles correspondant à l’événement demandé."],
      [/probabilités totales|partition de l'univers/i, "Vérifie que les événements de départ forment une partition.", "Décompose l’événement suivant chaque branche de la partition, calcule chaque intersection, puis additionne-les."],
      [/indépendance/i, "L’indépendance doit être donnée ou vérifiée, jamais supposée.", "Compare P(A∩B) à P(A)P(B), ou P_A(B) à P(B) lorsque la probabilité conditionnelle est définie."],
      [/Bernoulli/i, "Vérifie les deux issues et la probabilité de succès.", "Pour des répétitions, contrôle qu’elles sont identiques et indépendantes avant d’utiliser un modèle de Bernoulli répété."],
      [/vrai ou faux/i, "Identifie la définition ou l’hypothèse réellement testée.", "Réécris l’affirmation avec intersections, conditionnement ou indépendance, puis vérifie-la avec les données sans déduire le raisonnement d’une valeur seule."],
    ],
    success: "Exact. La condition et la population de référence sont correctement utilisées.",
  },
  "complements-derivation-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/domaine de dérivabilité|dérivée d'un produit|dérivée d'une composée/i, "Identifie le domaine et la structure de la fonction avant de dériver.", "Vérifie la dérivabilité des fonctions en jeu, puis applique la règle du produit ou de la composée avec le facteur intérieur."],
      [/tangentes/i, "Une tangente utilise la valeur de la fonction et celle de sa dérivée au même point.", "Écris y=f'(a)(x−a)+f(a), puis remplace a seulement après avoir calculé f(a) et f'(a)."],
      [/convexité|dérivée seconde/i, "La convexité se lit sur le signe de la dérivée seconde.", "Étudie f'' sur l’intervalle : f''≥0 donne la convexité et f''≤0 la concavité, sous les hypothèses de dérivabilité requises."],
      [/points d'inflexion/i, "Une dérivée seconde nulle ne suffit pas à elle seule.", "Vérifie que la convexité change de sens, par exemple grâce à un changement de signe de f'', avant de conclure à un point d’inflexion."],
      [/extremum|variations/i, "Une dérivée nulle ne suffit pas à identifier un extremum.", "Étudie le signe de f' de part et d’autre du point : seul un changement de variation pertinent permet de conclure."],
    ],
    success: "Exact. La dérivée est interprétée avec les hypothèses et le signe nécessaires.",
  },
  "logarithme-neperien-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/domaine de définition/i, "L’argument d’un logarithme doit être strictement positif.", "Résous d’abord l’inéquation portant sur chaque argument de ln, puis travaille uniquement sur l’intersection des domaines obtenus."],
      [/propriétés algébriques/i, "Vérifie que les logarithmes sont définis avant toute transformation.", "Utilise ln(ab)=ln(a)+ln(b) et ln(a/b)=ln(a)−ln(b) pour a,b>0 ; aucune formule analogue n’existe pour ln(a+b)."],
      [/équations|signe et comparaison/i, "Commence par le domaine, puis utilise la stricte croissance de ln.", "Sur les arguments positifs, ln u=ln v équivaut à u=v et ln u≤ln v à u≤v ; conserve ensuite uniquement les solutions du domaine."],
      [/dérivée/i, "Repère l’argument intérieur et son domaine.", "Pour ln(u), utilise u'/u là où u>0, puis étudie le signe de la dérivée avec le domaine de définition."],
      [/limites/i, "Identifie la limite de l’argument avant celle du logarithme.", "Utilise les limites de référence de ln uniquement avec un argument positif et transforme l’expression si une forme indéterminée apparaît."],
      [/modélisation/i, "Relie le logarithme à la grandeur positive du modèle.", "Isole l’expression exponentielle ou multiplicative, applique ln sur des quantités positives, puis interprète la solution dans le domaine du problème."],
    ],
    success: "Exact. Le logarithme est utilisé sur son domaine et avec la propriété adaptée.",
  },
  "fonctions-trigonometriques-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/valeurs remarquables|signe|comparaison/i, "Repère l’angle sur le cercle et son quadrant.", "Réduis l’angle modulo 2π, utilise l’angle de référence, puis détermine le signe de sinus ou cosinus avec le quadrant."],
      [/parité et périodicité|propriétés/i, "Identifie la symétrie ou la période réellement utile.", "Utilise cos(−x)=cos x, sin(−x)=−sin x et la période 2π sans imposer une transformation inutile."],
      [/formules d'addition|formules de réduction|identité remarquable/i, "Choisis une identité qui correspond exactement aux angles présents.", "Écris l’identité avant de remplacer les valeurs, puis simplifie ; une autre méthode équivalente reste valide."],
      [/dérivée|nombre dérivé/i, "Distingue la fonction extérieure et l’angle intérieur.", "Dérive sinus ou cosinus en conservant le signe et multiplie par la dérivée de l’angle intérieur lorsqu’il est composé."],
      [/limites/i, "Utilise d’abord les bornes ou équivalents trigonométriques adaptés.", "Près de zéro, mobilise sin x/x→1 avec des angles en radians ; ailleurs, transforme ou encadre avant de conclure."],
      [/équations|lecture graphique/i, "Repère toutes les solutions sur une période.", "Résous sur une période avec le cercle trigonométrique, puis ajoute la périodicité en respectant l’intervalle demandé."],
    ],
    success: "Exact. L’identité ou la propriété trigonométrique est adaptée aux données.",
  },
  "primitives-equations-differentielles-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/condition initiale|solution particulière/i, "La constante dépend de la condition imposée.", "Remplace le point initial dans la famille de solutions, résous pour la constante, puis vérifie la solution dans l’équation par dérivation et substitution."],
      [/— équations différentielles/i, "Identifie l’équation et la présence éventuelle d’une condition initiale.", "Pour y'=ay, utilise Ce^{ax}. Pour y'=ay+b, cherche une solution particulière puis ajoute la solution de l’équation homogène, et détermine C avec la condition donnée."],
      [/— primitives/i, "Une primitive se vérifie en la dérivant.", "Détermine une famille F(x)+C, puis utilise une éventuelle condition pour fixer C ; contrôle ensuite que la dérivée redonne bien la fonction."],
    ],
    success: "Exact. La famille, la constante et la vérification correspondent au problème posé.",
  },
  "loi-binomiale-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/paramètres/i, "Vérifie le nombre d’épreuves et la probabilité de succès.", "Une loi B(n,p) modélise n répétitions identiques et indépendantes d’une épreuve à deux issues, avec une probabilité p constante."],
      [/coefficients binomiaux/i, "Repère le nombre de succès demandé parmi les répétitions.", "Le coefficient binomial compte les choix de k succès parmi n ; vérifie 0≤k≤n et utilise les propriétés de symétrie si elles simplifient le calcul."],
      [/calcul de probabilités/i, "Traduis précisément l’événement portant sur X.", "Pour X=k, utilise le terme binomial adapté ; pour “au moins” ou “au plus”, additionne les valeurs concernées ou passe au contraire lorsque c’est plus simple."],
      [/espérance et variance/i, "Identifie l’indicateur demandé avant d’appliquer une formule.", "Pour X suivant B(n,p), E(X)=np et V(X)=np(1−p) ; interprète l’espérance comme un nombre moyen de succès."],
    ],
    success: "Exact. Le modèle binomial, ses paramètres et l’événement sont cohérents.",
  },
  "sommes-variables-aleatoires-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/espérance/i, "L’espérance est linéaire, sans hypothèse d’indépendance.", "Utilise E(aX+bY)=aE(X)+bE(Y), puis interprète la somme ou la combinaison dans le contexte."],
      [/variance/i, "Vérifie si l’indépendance est réellement donnée.", "Pour des variables indépendantes, les variances d’une somme s’additionnent ; sans cette hypothèse, il faut tenir compte de la covariance ou rester avec les données fournies."],
      [/somme de n variables/i, "Identifie si les variables ont la même loi et si elles sont indépendantes.", "Additionne toujours les espérances ; pour la variance, n’utilise la somme des variances que lorsque l’indépendance est établie."],
    ],
    success: "Exact. Les propriétés d’espérance et de variance utilisent les bonnes hypothèses.",
  },
  "statistiques-probabilites": {
    level: "cinquieme",
    skills: [
      [/effectif et fréquence|diagramme circulaire|lire un tableau/i, "Repère l’effectif total et la partie étudiée.", "Lis les données utiles, puis calcule la fréquence comme effectif de la catégorie ÷ effectif total ; pour un diagramme, relie la part au tour complet."],
      [/moyenne/i, "Vérifie combien de valeurs sont prises en compte.", "Additionne toutes les valeurs, avec leur effectif si nécessaire, puis divise par l’effectif total."],
      [/qualifier un événement|expérience aléatoire|comparer des probabilités|classement/i, "Décris les issues possibles avant de comparer.", "Identifie l’univers et l’événement, puis utilise les mots impossible, possible ou certain, ou compare les probabilités sur la même échelle."],
      [/équiprobabilité|tirage dans une urne|roue de loterie|simplifier une probabilité/i, "Compte les issues favorables et toutes les issues possibles.", "Dans une situation équiprobable, écris favorables/possibles, puis simplifie la fraction sans changer le rapport."],
      [/fréquence et probabilité/i, "Distingue une observation d’un modèle théorique.", "La fréquence vient des essais réalisés ; la probabilité décrit le modèle. Avec beaucoup d’essais, la fréquence peut se rapprocher de la probabilité sans lui être toujours égale."],
    ],
    success: "Exact. Les données et le total de référence sont cohérents.",
  },
  fonctions: {
    level: "cinquieme",
    skills: [
      [/vocabulaire|relation de dépendance/i, "Repère la grandeur d’entrée et celle qui en dépend.", "Une fonction associe une sortie à chaque entrée autorisée ; distingue l’image obtenue de la valeur choisie au départ."],
      [/évaluer une formule|programme de calcul/i, "Remplace l’entrée par la valeur donnée.", "Effectue le programme dans l’ordre ou remplace la lettre entre parenthèses, puis respecte les priorités de calcul."],
      [/tableau de valeurs/i, "Lis d’abord la ligne des entrées.", "Dans la colonne de l’entrée demandée, lis ou calcule la sortie correspondante sans intervertir les deux lignes."],
      [/contexte :|éolienne|température ressentie|distance de freinage|volume d'un cylindre|aire d'un carré/i, "Identifie ce qui varie et l’unité demandée.", "Traduis la situation par la relation fournie, remplace la grandeur d’entrée, calcule puis interprète la sortie avec son unité."],
    ],
    success: "Exact. L’entrée, la règle et la sortie sont correctement reliées.",
  },
  "algorithmique-cinquieme": {
    level: "cinquieme",
    skills: [
      [/séquencer des instructions|prévoir un résultat/i, "Suis les instructions une par une.", "Note la valeur obtenue après chaque instruction, dans l’ordre, sans anticiper l’étape suivante."],
      [/entrées et sorties|vocabulaire/i, "Repère ce qui est fourni et ce que l’algorithme renvoie.", "L’entrée est la donnée de départ ; les instructions la transforment ; la sortie est le résultat produit."],
      [/traduire une formule|modifier un paramètre/i, "Distingue les nombres fixes de la valeur qui peut changer.", "Traduis chaque opération dans l’ordre et remplace seulement le paramètre demandé, en conservant la structure du calcul."],
      [/boucle inconditionnelle/i, "Repère le nombre exact de répétitions.", "Exécute le bloc une fois par tour, mets à jour les variables après chaque passage, puis arrête-toi au nombre de tours indiqué."],
    ],
    success: "Exact. Les instructions ont été suivies dans le bon ordre.",
  },
  "geometrie-plane": {
    level: "quatrieme",
    skills: [
      [/égalité de triangles/i, "Repère les côtés et les angles qui se correspondent.", "Utilise un critère d’égalité adapté aux données et conserve l’ordre des sommets ; n’ajoute pas une égalité seulement parce que la figure semble régulière."],
      [/translations/i, "Identifie le vecteur de la translation.", "Une translation déplace tous les points dans la même direction, le même sens et sur la même longueur ; elle conserve longueurs, angles, parallélisme et alignement."],
      [/image|coordonnées/i, "Applique le même déplacement aux deux coordonnées.", "Ajoute les coordonnées du vecteur à celles du point, coordonnée par coordonnée, puis vérifie le sens du déplacement."],
    ],
    success: "Exact. La propriété géométrique correspond aux données de la figure.",
  },
  "geometrie-espace-quatrieme": {
    level: "quatrieme",
    skills: [
      [/volumes/i, "Identifie le solide et l’unité de volume.", "Choisis la formule du solide, remplace les dimensions dans une même unité, puis écris une unité cubique."],
      [/vocabulaire/i, "Repère faces, arêtes et sommets sur le solide.", "Relie chaque terme à l’élément de l’espace concerné et utilise les propriétés du solide plutôt que son apparence en perspective."],
      [/patrons/i, "Imagine quelles arêtes se rejoignent au pliage.", "Vérifie le nombre et la forme des faces, puis suis les arêtes communes pour écarter les chevauchements ou les faces mal placées."],
      [/repérage/i, "Lis les trois axes dans l’ordre annoncé.", "Pars de l’origine, relève chaque coordonnée sur son axe et conserve le même ordre pour placer ou lire le point."],
    ],
    success: "Exact. Le solide, sa représentation et les unités sont cohérents.",
  },
  "probabilites-echantillonnage-seconde": {
    level: "seconde",
    skills: [
      [/modèle équiprobable|univers d'une expérience|types d'événements|tirage de cartes/i, "Définis l’univers et l’événement avant de calculer.", "Lorsque les issues sont équiprobables, compte les issues favorables et les issues possibles dans le même univers, puis forme leur rapport."],
      [/événement contraire|réunion d'événements|propriétés/i, "Traduis précisément l’événement demandé.", "Utilise P(non A)=1−P(A) ; pour une réunion, additionne puis retire l’intersection si les événements peuvent se produire ensemble."],
      [/lancer de deux dés/i, "Les couples de résultats forment l’univers.", "Liste ou organise les couples ordonnés équiprobables, puis compte ceux qui vérifient la condition sans confondre une somme avec une issue."],
      [/modéliser une expérience|loi des grands nombres/i, "Distingue modèle théorique et fréquences observées.", "Choisis l’équiprobabilité seulement si elle est justifiée ; sinon appuie le modèle sur les observations. Une grande taille stabilise les fréquences sans garantir une égalité exacte."],
      [/probabilités conditionnelles/i, "Identifie la population qui sert de condition.", "Restreins l’univers à la condition, puis calcule la proportion de l’événement dans cette population ; sur un arbre, multiplie le long d’un chemin."],
    ],
    success: "Exact. L’univers, l’événement et la référence sont correctement choisis.",
  },
  "variations-globales-premiere-non-spe": {
    level: "premiere-non-spe",
    skills: [
      [/fonction dérivée/i, "Identifie la forme de la fonction avant de dériver.", "Applique la dérivée de référence et la linéarité, puis évalue seulement après avoir obtenu l’expression de la dérivée."],
      [/tangentes horizontales/i, "Une tangente horizontale correspond à une dérivée nulle.", "Résous f'(x)=0 pour l’abscisse, puis utilise f(x) si l’équation de la tangente est demandée ; la nullité seule ne prouve pas un extremum."],
      [/sens de variation/i, "Étudie le signe de la dérivée sur l’intervalle.", "Une dérivée positive indique une fonction croissante et une dérivée négative une fonction décroissante ; pour un extremum, vérifie le changement de signe."],
    ],
    success: "Exact. Le signe de la dérivée est interprété sur le bon intervalle.",
  },
  "variables-aleatoires-premiere-techno": {
    level: "premiere-techno",
    skills: [
      [/loi de probabilité|notations/i, "Identifie les valeurs possibles de X et l’événement demandé.", "Additionne les probabilités correspondant exactement à l’événement ; la somme de toute la loi vaut 1."],
      [/loi de Bernoulli/i, "Vérifie qu’il existe exactement deux issues.", "Code le succès par 1 et l’échec par 0 avec une probabilité p ; alors l’espérance vaut p."],
      [/espérance/i, "Associe chaque valeur à sa probabilité.", "Calcule la somme des produits x×P(X=x), puis interprète ce résultat comme une moyenne à long terme, pas comme une issue certaine."],
      [/fluctuation d'échantillonnage|simulation/i, "Repère la taille de l’échantillon et la fréquence observée.", "Compare la fréquence à p avec l’échelle 1/√n ou résume les simulations ; augmenter n réduit la fluctuation typique sans la supprimer."],
    ],
    success: "Exact. La loi et l’indicateur probabiliste sont correctement interprétés.",
  },
  "variables-aleatoires-premiere-spe": {
    level: "premiere-spe",
    skills: [
      [/loi de probabilité|notations/i, "Traduis l’événement portant sur X.", "Sélectionne les valeurs de X concernées et additionne leurs probabilités ; contrôle que la loi complète totalise 1."],
      [/espérance|jeu équitable|comparaison de jeux/i, "Pondère chaque gain ou valeur par sa probabilité.", "Calcule E(X)=ΣxP(X=x) ; pour un jeu équitable, impose une espérance nulle, et pour comparer des jeux utilise le critère demandé."],
      [/variance|écart-type/i, "Distingue dispersion, variance et écart-type.", "Utilise V(X)=E(X²)−E(X)² puis σ(X)=√V(X), en contrôlant qu’une variance ne peut pas être négative."],
      [/linéarité de l'espérance|transformation de la variance/i, "Identifie l’indicateur transformé.", "Utilise E(aX+b)=aE(X)+b et V(aX+b)=a²V(X) ; une translation ne modifie pas la variance."],
      [/loi binomiale/i, "Vérifie les répétitions identiques et indépendantes.", "Identifie n, p et l’événement portant sur le nombre de succès avant d’appliquer la formule, l’espérance np ou la variance np(1−p)."],
      [/vrai ou faux/i, "Repère la définition ou la propriété réellement testée.", "Réécris l’affirmation avec la loi, l’espérance ou la variance concernée, puis vérifie ses hypothèses avant de conclure."],
    ],
    success: "Exact. La variable aléatoire et ses paramètres sont cohérents.",
  },
  "loi-grands-nombres-terminale-spe": {
    level: "terminale-spe",
    skills: [
      [/inégalité de Markov/i, "Vérifie que la variable et le seuil sont positifs.", "Pour X positive et a>0, applique P(X≥a)≤E(X)/a ; le résultat est une borne supérieure, à limiter à 1 si nécessaire."],
      [/Bienaymé-Tchebychev/i, "Repère la variance et l’écart à l’espérance.", "Pour a>0, utilise P(|X−E(X)|≥a)≤V(X)/a² ; passe à l’événement contraire seulement après avoir identifié l’inégalité stricte complémentaire."],
      [/moyenne empirique/i, "Distingue la variable X de la moyenne Mₙ.", "Sous les hypothèses données, E(Mₙ)=E(X) et, pour des répétitions indépendantes de même loi, V(Mₙ)=V(X)/n."],
      [/inégalité de concentration|loi des grands nombres/i, "Identifie n, la variance et la précision ε.", "Utilise la borne V(X)/(nε²), puis résous l’inégalité dans le bon sens ; elle montre une convergence en probabilité sans garantir l’égalité à chaque échantillon."],
    ],
    success: "Exact. Les hypothèses et le sens de l’inégalité sont respectés.",
  },
};

const ANNUAL_SHOWCASE_IDS = [
  "fractions",
  "proportionnalite-cinquieme",
  "triangles-rectangles-quatrieme",
  "calcul-litteral-troisieme",
  "fonctions-affines-seconde",
  "derivation-premiere-spe",
  "analyse-information-chiffree-premiere-non-spe",
  "statistiques-deux-variables-premiere-techno",
  "calcul-integral-terminale-spe",
  "statistiques-deux-variables-terminale-techno",
];

const BACK_TO_SCHOOL_SHOWCASE_IDS = [
  "nombres-decimaux",
  "operations-sur-les-nombres",
  "addition-soustraction-rationnels",
  "calcul-litteral-troisieme",
  "nombres-calculs-seconde",
  "second-degre",
  "analyse-information-chiffree-premiere-non-spe",
  "reviser-les-bases-premiere-techno",
  "suites-terminale-spe",
  "reviser-les-bases-terminale-techno",
];

const GENERALIZATION_LOT_1_IDS = [
  "reviser-les-bases",
  "automatismes-sixieme",
  "operations-decimaux",
  "reviser-les-bases-cinquieme",
  "automatismes-cinquieme",
  "divisibilite-fractions",
  "reviser-les-bases-quatrieme",
  "automatismes-quatrieme",
  "nombres-relatifs-quatrieme",
  "reviser-les-bases-troisieme",
  "nombres-entiers-troisieme",
  "reviser-les-bases-seconde",
  "generalites-fonctions-seconde",
  "reviser-les-bases-premiere-spe",
  "reviser-les-bases-premiere-non-spe",
  "automatismes-premiere-techno",
  "reviser-les-bases-terminale-spe",
  "suites-terminale-techno",
];

const GENERALIZATION_LOT_2_IDS = [
  "grandeurs-mesures",
  "distances-symetries",
  "angles",
  "puissances",
  "calcul-litteral",
  "nombres-relatifs",
  "multiplication-division-rationnels",
  "puissances-quatrieme",
  "calcul-litteral-quatrieme",
  "automatismes-troisieme",
  "calcul-numerique-troisieme",
  "equations-troisieme",
  "automatismes-seconde",
  "variations-fonctions-seconde",
  "automatismes-premiere-spe",
  "suites-numeriques-premiere-spe",
  "automatismes-premiere-non-spe",
  "suites-numeriques-premiere-techno",
  "automatismes-terminale-spe",
  "fonctions-exponentielles-terminale-techno",
];

const GENERALIZATION_LOT_3_IDS = [
  "configurations-geometriques",
  "organisation-gestion-donnees",
  "geometrie-espace",
  "symetrie-centrale-parallelogrammes",
  "resolution-equations",
  "statistiques-quatrieme",
  "notion-fonction-troisieme",
  "fonctions-affines-troisieme",
  "fonctions-reference-seconde",
  "reperage-configurations-seconde",
  "variations-courbes-premiere-spe",
  "fonction-exponentielle-premiere-spe",
  "statistique-probabilites-premiere-non-spe",
  "croissance-lineaire-premiere-non-spe",
  "fonctions-second-degre-premiere-techno",
  "derivation-premiere-techno",
  "combinatoire-denombrement-terminale-spe",
  "vecteurs-droites-plans-espace-terminale-spe",
  "logarithme-decimal-terminale-techno",
];

const GENERALIZATION_LOT_4A_IDS = [
  "proportionnalite",
  "triangles",
  "proportionnalite-troisieme",
  "statistiques-troisieme",
  "vecteurs-seconde",
  "colinearite-vecteurs-seconde",
  "vecteurs-produit-scalaire-premiere-spe",
  "croissance-exponentielle-premiere-non-spe",
  "modelisation-quadratique-premiere-non-spe",
  "fonctions-second-degre-premiere-techno",
];

const GENERALIZATION_LOT_4B_IDS = [
  "probabilites-quatrieme",
  "trigonometrie-premiere-spe",
  "variations-instantanees-premiere-non-spe",
  "probabilites-conditionnelles-premiere-techno",
  "epreuves-independantes-premiere-techno",
  "orthogonalite-distances-espace-terminale-spe",
  "limites-fonctions-terminale-spe",
  "continuite-terminale-spe",
  "automatismes-terminale-techno",
  "probabilites-conditionnelles-terminale-techno",
  "variables-aleatoires-terminale-techno",
];

const GENERALIZATION_LOT_5A_IDS = [
  "notion-fonctions",
  "proportionnalite-quatrieme",
  "theoreme-thales",
  "probabilites-troisieme",
  "thales-triangles-semblables-troisieme",
  "trigonometrie-triangle-rectangle-troisieme",
  "mesures-grandeurs-troisieme",
  "equations-droites-seconde",
  "informations-chiffrees-seconde",
  "statistiques-descriptives-seconde",
];

const GENERALIZATION_LOT_5B_IDS = [
  "transformations-plan-troisieme",
  "geometrie-espace-troisieme",
  "geometrie-reperee-premiere-spe",
  "probabilites-conditionnelles-premiere-spe",
  "complements-derivation-terminale-spe",
  "logarithme-neperien-terminale-spe",
  "fonctions-trigonometriques-terminale-spe",
  "primitives-equations-differentielles-terminale-spe",
  "loi-binomiale-terminale-spe",
  "sommes-variables-aleatoires-terminale-spe",
];

const PEDAGOGY_FINAL_LOT_A_IDS = [
  "statistiques-probabilites",
  "fonctions",
  "algorithmique-cinquieme",
  "geometrie-plane",
  "geometrie-espace-quatrieme",
  "probabilites-echantillonnage-seconde",
  "variations-globales-premiere-non-spe",
  "variables-aleatoires-premiere-techno",
  "variables-aleatoires-premiere-spe",
  "loi-grands-nombres-terminale-spe",
];

function findSkill(profile, exercise) {
  const label = `${exercise?.chapter ?? ""} ${exercise?.prompt ?? ""}`;
  return profile?.skills.find(([pattern]) => pattern.test(label));
}

export function prepareWowExercise(chapter, exercise) {
  const profile = PROFILES[chapter?.meta?.id];
  if (!profile || !exercise) return exercise;
  const skill = findSkill(profile, exercise);
  if (!skill) return { ...exercise, wowSuccess: profile.success };
  const [, lightHint, methodHint] = skill;
  return {
    ...exercise,
    hints: Array.isArray(exercise.hints) && exercise.hints.length >= 2 ? exercise.hints : [lightHint, methodHint],
    feedback: {
      ...exercise.feedback,
      default: exercise.feedback?.default ?? methodHint,
    },
    wowSuccess: profile.success,
  };
}

export function correctWowMessage(exercise, recovered = false) {
  if (recovered) return "✓ Cette fois, tu as réussi seul. La méthode est réparée.";
  return exercise?.wowSuccess ?? "✓ Exact. Tu peux poursuivre sans revoir toute la correction.";
}

function showcaseRows(ids) {
  return ids.map((chapterId) => ({
    chapterId,
    levelId: PROFILES[chapterId].level,
    diagnosticCount: PROFILES[chapterId].skills.length,
  }));
}

export const WOW_SHOWCASES = showcaseRows(ANNUAL_SHOWCASE_IDS);

export const BACK_TO_SCHOOL_SHOWCASES = showcaseRows(BACK_TO_SCHOOL_SHOWCASE_IDS);

export const PEDAGOGY_GENERALIZATION_LOT_1 = showcaseRows(GENERALIZATION_LOT_1_IDS);

export const PEDAGOGY_GENERALIZATION_LOT_2 = showcaseRows(GENERALIZATION_LOT_2_IDS);

export const PEDAGOGY_GENERALIZATION_LOT_3 = showcaseRows(GENERALIZATION_LOT_3_IDS);

export const PEDAGOGY_GENERALIZATION_LOT_4A = showcaseRows(GENERALIZATION_LOT_4A_IDS);

export const PEDAGOGY_GENERALIZATION_LOT_4B = showcaseRows(GENERALIZATION_LOT_4B_IDS);

export const PEDAGOGY_GENERALIZATION_LOT_5A = showcaseRows(GENERALIZATION_LOT_5A_IDS);

export const PEDAGOGY_GENERALIZATION_LOT_5B = showcaseRows(GENERALIZATION_LOT_5B_IDS);

export const PEDAGOGY_FINAL_LOT_A = showcaseRows(PEDAGOGY_FINAL_LOT_A_IDS);
