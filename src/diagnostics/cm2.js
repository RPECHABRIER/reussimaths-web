function chapter(id, title, generate) {
  return { meta: { id, title, level: "cm2", order: 0, diagnosticOnly: true }, generate };
}

export const CM2_DIAGNOSTIC_CHAPTERS = [
  chapter("cm2-numeration-decimale", "Numération décimale", () => ({
    type: "numeric", chapter: "Numération décimale", prompt: "Quel nombre obtient-on en ajoutant 7 dixièmes à 12,4 ?", answer: 13.1, steps: ["7 dixièmes = 0,7.", "12,4 + 0,7 = 13,1."],
  })),
  chapter("cm2-operations", "Calcul et opérations", () => ({
    type: "numeric", chapter: "Calcul et opérations", prompt: "Calcule : 36 × 25", answer: 900, steps: ["25 × 4 = 100.", "36 × 25 = 9 × 4 × 25 = 9 × 100 = 900."],
  })),
  chapter("cm2-fractions", "Fractions simples", () => ({
    type: "qcm", chapter: "Fractions simples", prompt: "Quelle fraction est égale à 0,75 ?", options: ["3/4", "7/5", "75/10", "1/3"], answer: "3/4", steps: ["0,75 = 75/100.", "En simplifiant par 25, on obtient 3/4."],
  })),
  chapter("cm2-proportionnalite", "Proportionnalité", () => ({
    type: "numeric", chapter: "Proportionnalité", prompt: "3 cahiers coûtent 6 €. Combien coûtent 5 cahiers au même prix ?", answer: 10, steps: ["Un cahier coûte 6 ÷ 3 = 2 €.", "5 cahiers coûtent 5 × 2 = 10 €."],
  })),
  chapter("cm2-grandeurs", "Grandeurs et mesures", () => ({
    type: "numeric",
    chapter: "Grandeurs et mesures — Unités de longueur",
    prompt: "Convertis 2,5 m en centimètres.",
    answer: 250,
    answerUnit: "cm",
    conversionTable: { kind: "length", value: 2.5, fromUnit: "m", toUnit: "cm", answer: 250 },
    steps: [
      "On place le chiffre des unités, ici 2, dans son unité, donc la colonne des mètres.",
      "Chaque déplacement d’une colonne vers la droite multiplie la mesure par 10 ; de m vers cm, on se déplace de deux colonnes.",
      "On complète le tableau jusqu’aux centimètres : 2,5 m = 250 cm.",
    ],
  })),
  chapter("cm2-geometrie", "Repères géométriques", () => ({
    type: "qcm", chapter: "Repères géométriques", prompt: "Combien de degrés mesure un angle droit ?", options: ["45°", "90°", "180°", "360°"], answer: "90°", steps: ["Par définition, un angle droit mesure 90°."],
  })),
];
