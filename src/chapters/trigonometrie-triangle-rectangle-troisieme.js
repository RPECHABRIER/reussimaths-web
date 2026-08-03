// ---------------------------------------------------------------------------
// Chapitre : Trigonométrie dans le triangle rectangle (3e) — sous abonnement.
//
// Correspond au chapitre 11 du manuel de 3e : relations trigonométriques
// cosinus/sinus/tangente dans un triangle rectangle (identifier hypoténuse,
// côté adjacent et côté opposé à un angle donné), choisir la bonne relation
// selon les côtés connus, calculer une longueur connaissant un angle,
// calculer un angle par cosinus/sinus/tangente réciproque (arccos, arcsin,
// arctan), angles complémentaires dans un triangle rectangle, et problèmes
// contextualisés (hauteur, pente) combinant parfois le théorème de Pythagore
// et la trigonométrie.
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "trigonometrie-triangle-rectangle-troisieme")
// pour les mini-exercices "Calcul mental" associés.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
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
const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

// =========================== Relations trigonométriques ===========================

// ---------- 1. Identifier la relation à utiliser ----------
function genIdentifierRatioQCM() {
  const connus = pick([
    { cotes: "le côté adjacent et l'hypoténuse", ratio: "Cosinus" },
    { cotes: "le côté opposé et l'hypoténuse", ratio: "Sinus" },
    { cotes: "le côté opposé et le côté adjacent", ratio: "Tangente" },
  ]);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Relations trigonométriques",
    prompt: `Dans un triangle rectangle, on connaît ${connus.cotes} relatifs à un angle aigu. Quelle relation trigonométrique permet de calculer cet angle (ou le côté manquant) ?`,
    answer: connus.ratio,
    options: ["Cosinus", "Sinus", "Tangente"],
    steps: [
      `Rappel : cosinus = \\dfrac{\\text{adjacent}}{\\text{hypoténuse}}, \\ \\sin = \\dfrac{\\text{opposé}}{\\text{hypoténuse}}, \\ \\tan = \\dfrac{\\text{opposé}}{\\text{adjacent}}.`,
      `Ici, on connaît ${connus.cotes} : on utilise ${connus.ratio.toLowerCase()}.`,
    ],
  };
}

// ---------- 2. Identifier un côté (opposé, adjacent, hypoténuse) ----------
function genIdentifierCoteQCM() {
  const [s1, s2, s3] = shuffle(["A", "B", "C"]);
  const cible = pick(["hypoténuse", "côté opposé", "côté adjacent"]);
  let reponse;
  if (cible === "hypoténuse") reponse = `[${s2}${s3}]`;
  else if (cible === "côté opposé") reponse = `[${s2}${s3}]`;
  else reponse = `[${s1}${s2}]`;
  // Triangle rectangle en s1, angle étudié en s2 : hypoténuse = [s2 s3], côté adjacent à l'angle = [s1 s2], côté opposé = [s1 s3].
  const hyp = `[${s2}${s3}]`;
  const adj = `[${s1}${s2}]`;
  const opp = `[${s1}${s3}]`;
  const reponseFinale = cible === "hypoténuse" ? hyp : cible === "côté opposé" ? opp : adj;
  const options = shuffle([hyp, adj, opp]);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Relations trigonométriques",
    prompt: `${s1}${s2}${s3} est un triangle rectangle en ${s1}. Par rapport à l'angle \\(\\widehat{${s2}}\\), quel est le ${cible} ?`,
    answer: reponseFinale,
    options,
    steps: [`Le triangle est rectangle en ${s1}, donc l'hypoténuse est ${hyp}.`, `Par rapport à l'angle en ${s2}, le côté adjacent est ${adj} et le côté opposé est ${opp}.`],
  };
}

// ---------- 3. Calculer une longueur avec le cosinus ----------
function genCalculerLongueurCosinusNumeric() {
  const angle = randInt(20, 70);
  const hyp = randInt(8, 40);
  const adj = roundTo(hyp * Math.cos(toRad(angle)), 2);
  const askHyp = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Trigonométrie — Calculer une longueur ou une mesure d'angle",
    prompt: askHyp
      ? `Dans un triangle rectangle, un angle aigu mesure ${angle}° et le côté adjacent à cet angle mesure ${fr(adj)} cm. Calcule la longueur de l'hypoténuse (arrondie au dixième).`
      : `Dans un triangle rectangle, un angle aigu mesure ${angle}° et l'hypoténuse mesure ${hyp} cm. Calcule la longueur du côté adjacent à cet angle (arrondie au dixième).`,
    answer: askHyp ? roundTo(hyp, 1) : adj,
    tolerance: 0.15,
    steps: askHyp
      ? [`\\cos(${angle}°) = \\dfrac{${fr(adj)}}{\\text{hyp}}`, `\\text{hyp} = \\dfrac{${fr(adj)}}{\\cos(${angle}°)} \\approx ${fr(roundTo(hyp, 1))}`]
      : [`\\cos(${angle}°) = \\dfrac{\\text{adj}}{${hyp}}`, `\\text{adj} = ${hyp} \\times \\cos(${angle}°) \\approx ${fr(adj)}`],
  };
}

// ---------- 4. Calculer une longueur avec le sinus ----------
function genCalculerLongueurSinusNumeric() {
  const angle = randInt(20, 70);
  const hyp = randInt(8, 40);
  const opp = roundTo(hyp * Math.sin(toRad(angle)), 2);
  const askHyp = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Trigonométrie — Calculer une longueur ou une mesure d'angle",
    prompt: askHyp
      ? `Dans un triangle rectangle, un angle aigu mesure ${angle}° et le côté opposé à cet angle mesure ${fr(opp)} cm. Calcule la longueur de l'hypoténuse (arrondie au dixième).`
      : `Dans un triangle rectangle, un angle aigu mesure ${angle}° et l'hypoténuse mesure ${hyp} cm. Calcule la longueur du côté opposé à cet angle (arrondie au dixième).`,
    answer: askHyp ? roundTo(hyp, 1) : opp,
    tolerance: 0.15,
    steps: askHyp
      ? [`\\sin(${angle}°) = \\dfrac{${fr(opp)}}{\\text{hyp}}`, `\\text{hyp} = \\dfrac{${fr(opp)}}{\\sin(${angle}°)} \\approx ${fr(roundTo(hyp, 1))}`]
      : [`\\sin(${angle}°) = \\dfrac{\\text{opp}}{${hyp}}`, `\\text{opp} = ${hyp} \\times \\sin(${angle}°) \\approx ${fr(opp)}`],
  };
}

// ---------- 5. Calculer une longueur avec la tangente ----------
function genCalculerLongueurTangenteNumeric() {
  const angle = randInt(15, 75);
  const adj = randInt(5, 30);
  const opp = roundTo(adj * Math.tan(toRad(angle)), 2);
  const askAdj = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Trigonométrie — Calculer une longueur ou une mesure d'angle",
    prompt: askAdj
      ? `Dans un triangle rectangle, un angle aigu mesure ${angle}° et le côté opposé à cet angle mesure ${fr(opp)} cm. Calcule la longueur du côté adjacent (arrondie au dixième).`
      : `Dans un triangle rectangle, un angle aigu mesure ${angle}° et le côté adjacent à cet angle mesure ${adj} cm. Calcule la longueur du côté opposé (arrondie au dixième).`,
    answer: askAdj ? roundTo(adj, 1) : opp,
    tolerance: 0.15,
    steps: askAdj
      ? [`\\tan(${angle}°) = \\dfrac{${fr(opp)}}{\\text{adj}}`, `\\text{adj} = \\dfrac{${fr(opp)}}{\\tan(${angle}°)} \\approx ${fr(roundTo(adj, 1))}`]
      : [`\\tan(${angle}°) = \\dfrac{\\text{opp}}{${adj}}`, `\\text{opp} = ${adj} \\times \\tan(${angle}°) \\approx ${fr(opp)}`],
  };
}

// ---------- 6. Calculer un angle par arccos ----------
function genCalculerAngleArccosNumeric() {
  const angleReel = randInt(15, 75);
  const hyp = randInt(10, 40);
  const adj = roundTo(hyp * Math.cos(toRad(angleReel)), 2);
  const answer = Math.round(toDeg(Math.acos(adj / hyp)));
  return {
    type: "numeric",
    chapter: "Trigonométrie — Calculer une longueur ou une mesure d'angle",
    prompt: `Dans un triangle rectangle, un angle aigu a un côté adjacent de ${fr(adj)} cm et une hypoténuse de ${hyp} cm. Calcule la mesure de cet angle, arrondie au degré près.`,
    answer,
    steps: [`\\cos(\\widehat{x}) = \\dfrac{${fr(adj)}}{${hyp}}`, `\\widehat{x} \\approx ${answer}°`],
  };
}

// ---------- 7. Calculer un angle par arcsin ----------
function genCalculerAngleArcsinNumeric() {
  const angleReel = randInt(15, 75);
  const hyp = randInt(10, 40);
  const opp = roundTo(hyp * Math.sin(toRad(angleReel)), 2);
  const answer = Math.round(toDeg(Math.asin(opp / hyp)));
  return {
    type: "numeric",
    chapter: "Trigonométrie — Calculer une longueur ou une mesure d'angle",
    prompt: `Dans un triangle rectangle, un angle aigu a un côté opposé de ${fr(opp)} cm et une hypoténuse de ${hyp} cm. Calcule la mesure de cet angle, arrondie au degré près.`,
    answer,
    steps: [`\\sin(\\widehat{x}) = \\dfrac{${fr(opp)}}{${hyp}}`, `\\widehat{x} \\approx ${answer}°`],
  };
}

// ---------- 8. Calculer un angle par arctan ----------
function genCalculerAngleArctanNumeric() {
  const angleReel = randInt(15, 75);
  const adj = randInt(5, 30);
  const opp = roundTo(adj * Math.tan(toRad(angleReel)), 2);
  const answer = Math.round(toDeg(Math.atan(opp / adj)));
  return {
    type: "numeric",
    chapter: "Trigonométrie — Calculer une longueur ou une mesure d'angle",
    prompt: `Dans un triangle rectangle, un angle aigu a un côté opposé de ${fr(opp)} cm et un côté adjacent de ${adj} cm. Calcule la mesure de cet angle, arrondie au degré près.`,
    answer,
    steps: [`\\tan(\\widehat{x}) = \\dfrac{${fr(opp)}}{${adj}}`, `\\widehat{x} \\approx ${answer}°`],
  };
}

// ---------- 9. Vérifier qu'un nombre peut être un cosinus/sinus d'angle aigu ----------
function genValeurTrigoValideQCM() {
  const valid = Math.random() < 0.5;
  const valeur = valid ? roundTo(randInt(1, 99) / 100, 2) : pick([roundTo(1 + randInt(1, 50) / 100, 2), -roundTo(randInt(1, 50) / 100, 2)]);
  const fonction = pick(["cosinus", "sinus"]);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Relations trigonométriques",
    prompt: `Le nombre ${fr(valeur)} peut-il être le ${fonction} d'un angle aigu dans un triangle rectangle ?`,
    answer: valid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      `Rappel : dans un triangle rectangle, le cosinus et le sinus d'un angle aigu sont toujours compris strictement entre 0 et 1.`,
      valid ? `C'est bien le cas ici.` : `Ce n'est pas le cas ici.`,
    ],
  };
}

// =========================== Applications ===========================

// ---------- 10. Problème contextualisé : hauteur via tangente ----------
function genProblemeHauteurTangenteNumeric() {
  const prenom = pick(prenoms);
  const distance = randInt(5, 40);
  const angle = randInt(15, 60);
  const hauteur = roundTo(distance * Math.tan(toRad(angle)), 1);
  return {
    type: "numeric",
    chapter: "Trigonométrie — Applications",
    prompt: `${prenom} observe le sommet d'un arbre. L'angle entre le sol et sa ligne de visée est de ${angle}°. ${prenom} se trouve à ${distance} m du pied de l'arbre. En supposant que le terrain est horizontal et que la ligne de visée part du sol, calcule la hauteur de l'arbre (arrondie au dixième de mètre).`,
    answer: hauteur,
    tolerance: 0.2,
    steps: [`\\tan(${angle}°) = \\dfrac{\\text{hauteur}}{${distance}}`, `\\text{hauteur} = ${distance} \\times \\tan(${angle}°) \\approx ${fr(hauteur)}\\text{ m}`],
  };
}

// ---------- 11. Problème contextualisé : angle de pente ----------
function genProblemePenteAngleNumeric() {
  const hauteurColline = randInt(10, 80);
  const distanceParcourue = randInt(hauteurColline + 10, hauteurColline + 150);
  const answer = Math.round(toDeg(Math.asin(hauteurColline / distanceParcourue)));
  return {
    type: "numeric",
    chapter: "Trigonométrie — Applications",
    prompt: `La hauteur d'une colline est de ${hauteurColline} m. Un randonneur parcourt ${distanceParcourue} m du bas au sommet de la colline (en suivant la pente). Calcule l'angle de la pente avec l'horizontale (arrondi au degré).`,
    answer,
    steps: [`\\sin(\\widehat{x}) = \\dfrac{${hauteurColline}}{${distanceParcourue}}`, `\\widehat{x} \\approx ${answer}°`],
  };
}

// ---------- 12. Angles complémentaires dans un triangle rectangle ----------
function genAnglesComplementairesNumeric() {
  const angle = randInt(5, 85);
  const answer = 90 - angle;
  return {
    type: "numeric",
    chapter: "Trigonométrie — Relations trigonométriques",
    prompt: `Dans un triangle rectangle, un angle aigu mesure ${angle}°. Quelle est la mesure de l'autre angle aigu ?`,
    answer,
    steps: [`\\text{Les deux angles aigus d'un triangle rectangle sont complémentaires.}`, `90 - ${angle} = ${answer}`],
  };
}

// ---------- 13. Pythagore puis trigonométrie (problème à deux étapes) ----------
function genPythagoreEtTrigoNumeric() {
  const cote1 = randInt(6, 20);
  const cote2 = randInt(6, 20);
  const hyp = roundTo(Math.sqrt(cote1 * cote1 + cote2 * cote2), 2);
  const angle = Math.round(toDeg(Math.atan(cote2 / cote1)));
  return {
    type: "numeric",
    chapter: "Trigonométrie — Applications",
    prompt: `Un triangle ABC est rectangle en A, avec AB = ${cote1} cm et AC = ${cote2} cm. Calcule d'abord BC (arrondie au centième) grâce au théorème de Pythagore, puis donne la mesure de l'angle \\(\\widehat{ABC}\\) (arrondie au degré près).`,
    answer: angle,
    steps: [
      `BC^2 = AB^2 + AC^2 = ${cote1}^2 + ${cote2}^2 = ${cote1 * cote1 + cote2 * cote2}`,
      `BC = \\sqrt{${cote1 * cote1 + cote2 * cote2}} \\approx ${fr(hyp)}\\text{ cm}`,
      `\\tan(\\widehat{ABC}) = \\dfrac{AC}{AB} = \\dfrac{${cote2}}{${cote1}}`,
      `\\widehat{ABC} \\approx ${angle}°`,
    ],
  };
}

// ---------- 14. Problème contextualisé : hauteur via sinus (échelle) ----------
function genProblemeHauteurSinusNumeric() {
  const longueurEchelle = randInt(3, 8);
  const angle = randInt(50, 80);
  const hauteur = roundTo(longueurEchelle * Math.sin(toRad(angle)), 2);
  return {
    type: "numeric",
    chapter: "Trigonométrie — Applications",
    prompt: `Une échelle de ${longueurEchelle} m de long est appuyée contre un mur. Elle fait un angle de ${angle}° avec le sol. À quelle hauteur du mur (arrondie au centième de mètre) le sommet de l'échelle touche-t-il le mur ?`,
    answer: hauteur,
    tolerance: 0.03,
    steps: [`\\sin(${angle}°) = \\dfrac{\\text{hauteur}}{${longueurEchelle}}`, `\\text{hauteur} = ${longueurEchelle} \\times \\sin(${angle}°) \\approx ${fr(hauteur)}\\text{ m}`],
  };
}

// ---------- 15. Calculer l'hypoténuse directement (cosinus ou sinus) ----------
function genCalculerHypotenuseTrigoNumeric() {
  const angle = randInt(20, 70);
  const useCos = Math.random() < 0.5;
  const cote = randInt(5, 35);
  const hyp = useCos ? roundTo(cote / Math.cos(toRad(angle)), 1) : roundTo(cote / Math.sin(toRad(angle)), 1);
  return {
    type: "numeric",
    chapter: "Trigonométrie — Calculer une longueur ou une mesure d'angle",
    prompt: `Dans un triangle rectangle, un angle aigu mesure ${angle}° et le côté ${useCos ? "adjacent" : "opposé"} à cet angle mesure ${cote} cm. Calcule la longueur de l'hypoténuse (arrondie au dixième).`,
    answer: hyp,
    tolerance: 0.15,
    steps: [
      useCos ? `\\cos(${angle}°) = \\dfrac{${cote}}{\\text{hyp}}` : `\\sin(${angle}°) = \\dfrac{${cote}}{\\text{hyp}}`,
      `\\text{hyp} = \\dfrac{${cote}}{${useCos ? "\\cos" : "\\sin"}(${angle}°)} \\approx ${fr(hyp)}`,
    ],
  };
}

const GENERATORS = [
  genIdentifierRatioQCM,
  genIdentifierCoteQCM,
  genCalculerLongueurCosinusNumeric,
  genCalculerLongueurSinusNumeric,
  genCalculerLongueurTangenteNumeric,
  genCalculerAngleArccosNumeric,
  genCalculerAngleArcsinNumeric,
  genCalculerAngleArctanNumeric,
  genValeurTrigoValideQCM,
  genProblemeHauteurTangenteNumeric,
  genProblemePenteAngleNumeric,
  genAnglesComplementairesNumeric,
  genPythagoreEtTrigoNumeric,
  genProblemeHauteurSinusNumeric,
  genCalculerHypotenuseTrigoNumeric,
];

const DIFFICULTY = {
  genIdentifierRatioQCM: "facile",
  genIdentifierCoteQCM: "facile",
  genCalculerLongueurCosinusNumeric: "facile",
  genCalculerLongueurSinusNumeric: "facile",
  genCalculerLongueurTangenteNumeric: "facile",
  genCalculerAngleArccosNumeric: "standard",
  genCalculerAngleArcsinNumeric: "standard",
  genCalculerAngleArctanNumeric: "standard",
  genValeurTrigoValideQCM: "standard",
  genAnglesComplementairesNumeric: "standard",
  genCalculerHypotenuseTrigoNumeric: "standard",
  genProblemeHauteurTangenteNumeric: "expert",
  genProblemePenteAngleNumeric: "expert",
  genPythagoreEtTrigoNumeric: "expert",
  genProblemeHauteurSinusNumeric: "expert",
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
    id: "trigonometrie-triangle-rectangle-troisieme",
    title: "Trigonométrie dans le triangle rectangle",
    description: "Cosinus, sinus et tangente dans un triangle rectangle : identifier les côtés, calculer une longueur ou un angle (arccos, arcsin, arctan), angles complémentaires et problèmes contextualisés (hauteur, pente).",
    level: "troisieme",
    free: false,
    order: 12,
  },
  generate,
};
