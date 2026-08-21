const PROFILES = {
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
