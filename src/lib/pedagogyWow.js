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
