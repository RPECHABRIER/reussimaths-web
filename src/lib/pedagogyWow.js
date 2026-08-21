const PROFILES = {
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
  "statistiques-deux-variables-terminale-techno": {
    level: "terminale-techno",
    skills: [
      [/changement de variable/i, "Quel modèle cherche-t-on à rendre affine ?", "Applique le changement de variable indiqué aux données ; l’allure seule ne suffit pas à justifier le modèle."],
      [/retour au modèle/i, "Il faut maintenant annuler le changement de variable.", "Exprime y avec la fonction réciproque adaptée, puis distingue la prédiction du modèle de la valeur réelle."],
      [/point moyen/i, "Utilise toutes les observations, avec leur effectif.", "Additionne les coordonnées concernées, divise par l’effectif, puis garde la précision demandée."],
    ],
    success: "Exact. Tu distingues correctement les données transformées, le modèle et son interprétation.",
  },
};

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

export const WOW_SHOWCASES = Object.entries(PROFILES).map(([chapterId, profile]) => ({
  chapterId,
  levelId: profile.level,
  diagnosticCount: profile.skills.length,
}));
