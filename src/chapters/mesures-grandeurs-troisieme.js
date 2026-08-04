// ---------------------------------------------------------------------------
// Chapitre : Mesures et grandeurs (3e) — sous abonnement.
//
// Correspond au chapitre 14 du manuel de 3e : grandeurs composées et unités
// (vitesse v = d/t et ses conversions km/h ↔ m/s, énergie E = P × t, débit),
// échelles (distance sur un plan/une carte vers distance réelle et
// inversement, effet d'une échelle de réduction/agrandissement sur une
// surface au carré et sur un volume au cube), conversions d'unités de
// volume, et problèmes contextualisés (remplissage d'une piscine, autonomie
// d'un véhicule, durée d'un trajet avec vitesse moyenne).
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "mesures-grandeurs-troisieme") pour
// les mini-exercices "Calcul mental" associés.
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

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

// =========================== Vitesse, énergie, débit ===========================

// ---------- 1. Calculer une vitesse (v = d / t) ----------
function genVitesseNumeric() {
  const t = randInt(2, 8);
  const v = randInt(20, 130);
  const d = t * v;
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Vitesse, énergie, débit",
    prompt: `Une voiture parcourt ${d} km en ${t} h. Calcule sa vitesse moyenne (en km/h).`,
    answer: v,
    steps: [{ type: "calcul", text: `v = \\dfrac{d}{t} = \\dfrac{${d}}{${t}} = ${v}` }],
  };
}

// ---------- 2. Calculer une distance (d = v × t) ----------
function genDistanceDepuisVitesseNumeric() {
  const v = randInt(20, 130);
  const t = roundTo(randInt(2, 16) / 2, 1);
  const answer = roundTo(v * t, 1);
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Vitesse, énergie, débit",
    prompt: `Un train roule à une vitesse constante de ${v} km/h pendant ${fr(t)} h. Quelle distance parcourt-il (en km) ?`,
    answer,
    tolerance: 0.1,
    steps: [{ type: "calcul", text: `d = v \\times t = ${v} \\times ${fr(t)} = ${fr(answer)}` }],
  };
}

// ---------- 3. Calculer un temps (t = d / v) ----------
function genTempsDepuisVitesseNumeric() {
  const v = randInt(10, 100);
  const t = roundTo(randInt(2, 16) / 2, 1);
  const d = roundTo(v * t, 1);
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Vitesse, énergie, débit",
    prompt: `Un cycliste roule à une vitesse constante de ${v} km/h et parcourt ${fr(d)} km. Combien de temps roule-t-il (en h) ?`,
    answer: t,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `t = \\dfrac{d}{v} = \\dfrac{${fr(d)}}{${v}} = ${fr(t)}` }],
  };
}

// ---------- 4. Conversion km/h vers m/s ----------
function genConversionKmhVersMsNumeric() {
  const vKmh = pick([18, 36, 54, 72, 90, 108, 45, 63, 27]);
  const answer = roundTo(vKmh / 3.6, 2);
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Vitesse, énergie, débit",
    prompt: `Convertis une vitesse de ${vKmh} km/h en m/s.`,
    answer,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `${vKmh} \\text{ km/h} = \\dfrac{${vKmh} \\times 1000}{3600} \\text{ m/s} \\approx ${fr(answer)} \\text{ m/s}` }],
  };
}

// ---------- 5. Conversion m/s vers km/h ----------
function genConversionMsVersKmhNumeric() {
  const vMs = randInt(2, 40);
  const answer = roundTo(vMs * 3.6, 1);
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Vitesse, énergie, débit",
    prompt: `Convertis une vitesse de ${vMs} m/s en km/h.`,
    answer,
    tolerance: 0.1,
    steps: [{ type: "calcul", text: `${vMs} \\text{ m/s} = ${vMs} \\times 3,6 \\text{ km/h} = ${fr(answer)} \\text{ km/h}` }],
  };
}

// ---------- 6. Énergie, puissance, temps (E = P × t) ----------
function genEnergiePuissanceTempsNumeric() {
  const P = randInt(500, 3000);
  const t = randInt(1, 10);
  const askE = Math.random() < 0.5;
  const E = P * t;
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Vitesse, énergie, débit",
    prompt: askE
      ? `Un appareil électrique a une puissance de ${P} W et fonctionne pendant ${t} h. Calcule l'énergie consommée (en Wh), sachant que E = P × t.`
      : `Un appareil électrique de puissance ${P} W consomme une énergie de ${E} Wh. Combien de temps a-t-il fonctionné (en h), sachant que E = P × t ?`,
    answer: askE ? E : t,
    steps: askE
      ? [{ type: "calcul", text: `E = P \\times t = ${P} \\times ${t} = ${E}` }]
      : [{ type: "calcul", text: `t = \\dfrac{E}{P} = \\dfrac{${E}}{${P}} = ${t}` }],
  };
}

// ---------- 7. Débit (volume / temps) ----------
function genDebitNumeric() {
  const debit = randInt(5, 50);
  const temps = randInt(2, 20);
  const volume = debit * temps;
  const askDebit = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Vitesse, énergie, débit",
    prompt: askDebit
      ? `Un robinet remplit un bassin de ${volume} L en ${temps} minutes, à débit constant. Calcule son débit (en L/min).`
      : `Un robinet a un débit de ${debit} L/min. Combien de temps (en minutes) faut-il pour remplir un bassin de ${volume} L ?`,
    answer: askDebit ? debit : temps,
    steps: askDebit
      ? [{ type: "calcul", text: `\\text{débit} = \\dfrac{${volume}}{${temps}} = ${debit}` }]
      : [{ type: "calcul", text: `t = \\dfrac{${volume}}{${debit}} = ${temps}` }],
  };
}

// =========================== Échelles ===========================

// ---------- 8. Distance réelle depuis une distance sur un plan (échelle 1:n) ----------
function genEchelleDistanceReelleNumeric() {
  const echelle = pick([100, 200, 500, 1000, 2000, 25000, 50000]);
  const distancePlanCm = randInt(2, 40);
  const distanceReelleCm = distancePlanCm * echelle;
  const distanceReelleM = roundTo(distanceReelleCm / 100, 2);
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Échelles",
    prompt: `Sur un plan à l'échelle 1/${echelle}, une distance mesure ${distancePlanCm} cm. Quelle est la distance réelle correspondante (en m) ?`,
    answer: distanceReelleM,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `${distancePlanCm} \\times ${echelle} = ${distanceReelleCm}\\text{ cm} = ${fr(distanceReelleM)}\\text{ m}` }],
  };
}

// ---------- 9. Distance sur le plan depuis une distance réelle ----------
function genEchelleDistancePlanNumeric() {
  const echelle = pick([100, 200, 500, 1000, 2000]);
  const distanceReelleM = randInt(4, 80);
  const distancePlanCm = roundTo((distanceReelleM * 100) / echelle, 2);
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Échelles",
    prompt: `Sur un plan à l'échelle 1/${echelle}, quelle distance (en cm) représente une distance réelle de ${distanceReelleM} m ?`,
    answer: distancePlanCm,
    tolerance: 0.05,
    steps: [
      { type: "calcul", text: `${distanceReelleM}\\text{ m} = ${distanceReelleM * 100}\\text{ cm}` },
      { type: "resultat", text: `${distanceReelleM * 100} \\div ${echelle} = ${fr(distancePlanCm)}` },
    ],
  };
}

// ---------- 10. Surface réelle depuis une surface réduite (coefficient au carré) ----------
function genEchelleSurfaceNumeric() {
  const echelle = pick([50, 100, 200, 300]);
  const surfacePlanCm2 = roundTo(randInt(2, 30) / 10, 1);
  const surfaceReelleCm2 = roundTo(surfacePlanCm2 * echelle * echelle, 0);
  const surfaceReelleM2 = roundTo(surfaceReelleCm2 / 10000, 2);
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Échelles",
    prompt: `Sur un plan à l'échelle 1/${echelle}, une pièce a une surface de ${fr(surfacePlanCm2)} cm². Quelle est sa surface réelle (en m², arrondie au centième) ?`,
    answer: surfaceReelleM2,
    tolerance: 0.05,
    steps: [
      { type: "regle", text: `\\text{Le coefficient s'applique au carré sur les surfaces : } ${fr(surfacePlanCm2)} \\times ${echelle}^2 = ${fr(surfaceReelleCm2)}\\text{ cm}^2` },
      { type: "resultat", text: `${fr(surfaceReelleCm2)}\\text{ cm}^2 \\approx ${fr(surfaceReelleM2)}\\text{ m}^2` },
    ],
  };
}

// =========================== Problèmes contextualisés ===========================

// ---------- 11. Remplissage d'une piscine (volume et débit) ----------
function genRemplissagePiscineNumeric() {
  const longueur = randInt(6, 12);
  const largeur = randInt(3, 6);
  const hauteur = roundTo(randInt(10, 18) / 10, 1);
  const debitLparS = randInt(3, 15);
  const volumeM3 = roundTo(longueur * largeur * hauteur, 2);
  const volumeL = roundTo(volumeM3 * 1000, 0);
  const tempsS = roundTo(volumeL / debitLparS, 0);
  const tempsH = roundTo(tempsS / 3600, 1);
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Problèmes",
    prompt: `Une piscine rectangulaire mesure ${longueur} m de long, ${largeur} m de large et ${fr(hauteur)} m de profondeur. Elle est remplie avec un débit de ${debitLparS} L/s. Calcule le temps de remplissage (en heures, arrondi au dixième).`,
    answer: tempsH,
    tolerance: 0.2,
    steps: [
      { type: "calcul", text: `V = ${longueur} \\times ${largeur} \\times ${fr(hauteur)} = ${fr(volumeM3)}\\text{ m}^3 = ${fr(volumeL)}\\text{ L}` },
      { type: "resultat", text: `t = \\dfrac{${fr(volumeL)}}{${debitLparS}} \\approx ${fr(tempsS)}\\text{ s} \\approx ${fr(tempsH)}\\text{ h}` },
    ],
  };
}

// ---------- 12. Autonomie d'un véhicule (consommation) ----------
function genAutonomieVehiculeNumeric() {
  const consommation = roundTo(randInt(40, 90) / 10, 1);
  const reservoir = randInt(35, 70);
  const answer = roundTo((reservoir / consommation) * 100, 0);
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Problèmes",
    prompt: `Une voiture consomme ${fr(consommation)} L pour 100 km. Son réservoir contient ${reservoir} L d'essence. Quelle distance (en km, arrondie à l'unité) peut-elle parcourir avec un plein ?`,
    answer,
    tolerance: 3,
    steps: [{ type: "calcul", text: `d = \\dfrac{${reservoir} \\times 100}{${fr(consommation)}} \\approx ${answer}\\text{ km}` }],
  };
}

// ---------- 13. Vitesse moyenne avec conversion minutes → heures ----------
function genVitesseMoyenneAvecMinutesNumeric() {
  const prenom = pick(prenoms);
  const heures = randInt(1, 4);
  const minutes = pick([0, 15, 30, 45]);
  const tempsDecimal = roundTo(heures + minutes / 60, 2);
  const d = randInt(50, 300);
  const answer = roundTo(d / tempsDecimal, 1);
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Problèmes",
    prompt: `${prenom} parcourt ${d} km en ${heures} h ${minutes > 0 ? `${minutes} min` : ""}. Calcule sa vitesse moyenne (en km/h, arrondie au dixième).`,
    answer,
    tolerance: 0.2,
    steps: [
      { type: "calcul", text: `${heures} \\text{ h } ${minutes}\\text{ min} = ${fr(tempsDecimal)}\\text{ h}` },
      { type: "resultat", text: `v = \\dfrac{${d}}{${fr(tempsDecimal)}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 14. Volume réel depuis une échelle réduite (coefficient au cube) ----------
function genEchelleVolumeNumeric() {
  const echelle = pick([10, 20, 50, 100]);
  const volumeMaquetteCm3 = roundTo(randInt(5, 50) / 10, 1);
  const volumeReelCm3 = roundTo(volumeMaquetteCm3 * echelle ** 3, 0);
  const volumeReelM3 = roundTo(volumeReelCm3 / 1000000, 2);
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Échelles",
    prompt: `Une maquette est construite à l'échelle 1/${echelle}. Elle a un volume de ${fr(volumeMaquetteCm3)} cm³. Quel est le volume réel de l'objet représenté (en m³, arrondi au centième) ?`,
    answer: volumeReelM3,
    tolerance: 0.05,
    steps: [
      { type: "regle", text: `\\text{Le coefficient s'applique au cube sur les volumes : } ${fr(volumeMaquetteCm3)} \\times ${echelle}^3 = ${fr(volumeReelCm3)}\\text{ cm}^3` },
      { type: "resultat", text: `\\approx ${fr(volumeReelM3)}\\text{ m}^3` },
    ],
  };
}

// ---------- 15. Durée totale d'un trajet avec pauses ----------
function genDureeTrajetAvecPausesNumeric() {
  const prenom = pick(prenoms);
  const dureeRouleHeures = randInt(4, 10);
  const nbPauses = Math.floor(dureeRouleHeures / 2);
  const dureePauseMin = pick([10, 15, 20]);
  const totalPausesMin = nbPauses * dureePauseMin;
  const totalMin = dureeRouleHeures * 60 + totalPausesMin;
  const totalH = Math.floor(totalMin / 60);
  const resteMin = totalMin % 60;
  return {
    type: "numeric",
    chapter: "Mesures et grandeurs — Problèmes",
    prompt: `${prenom} prévoit ${dureeRouleHeures} h de route. Il prévoit de faire une pause de ${dureePauseMin} minutes toutes les 2 heures de conduite (on ne compte que les pauses complètes, une pause toutes les 2 h de conduite écoulées). Combien de minutes de pause au total ${prenom} doit-il prévoir ?`,
    answer: totalPausesMin,
    steps: [
      { type: "calcul", text: `${dureeRouleHeures} \\div 2 = ${Math.floor(dureeRouleHeures / 2)} \\text{ pauses (partie entière)}` },
      { type: "resultat", text: `${nbPauses} \\times ${dureePauseMin} = ${totalPausesMin}\\text{ min}` },
    ],
  };
}

const GENERATORS = [
  genVitesseNumeric,
  genDistanceDepuisVitesseNumeric,
  genTempsDepuisVitesseNumeric,
  genConversionKmhVersMsNumeric,
  genConversionMsVersKmhNumeric,
  genEnergiePuissanceTempsNumeric,
  genDebitNumeric,
  genEchelleDistanceReelleNumeric,
  genEchelleDistancePlanNumeric,
  genEchelleSurfaceNumeric,
  genRemplissagePiscineNumeric,
  genAutonomieVehiculeNumeric,
  genVitesseMoyenneAvecMinutesNumeric,
  genEchelleVolumeNumeric,
  genDureeTrajetAvecPausesNumeric,
];

const DIFFICULTY = {
  genVitesseNumeric: "facile",
  genDistanceDepuisVitesseNumeric: "facile",
  genTempsDepuisVitesseNumeric: "facile",
  genConversionKmhVersMsNumeric: "standard",
  genConversionMsVersKmhNumeric: "standard",
  genEnergiePuissanceTempsNumeric: "standard",
  genDebitNumeric: "standard",
  genEchelleDistanceReelleNumeric: "standard",
  genEchelleDistancePlanNumeric: "standard",
  genEchelleSurfaceNumeric: "expert",
  genRemplissagePiscineNumeric: "expert",
  genAutonomieVehiculeNumeric: "expert",
  genVitesseMoyenneAvecMinutesNumeric: "expert",
  genEchelleVolumeNumeric: "expert",
  genDureeTrajetAvecPausesNumeric: "expert",
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
    id: "mesures-grandeurs-troisieme",
    title: "Mesures et grandeurs",
    description: "Vitesse, énergie et débit (grandeurs composées et conversions d'unités), échelles (distances, surfaces au carré, volumes au cube) et problèmes contextualisés.",
    pourquoi: "Convertir vitesse, débit ou énergie, c'est ce qui permet de comparer des offres, lire une facture d'électricité ou comprendre une carte à l'échelle.",
    level: "troisieme",
    free: false,
    order: 15,
  },
  generate,
};
