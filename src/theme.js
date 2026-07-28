// ---------------------------------------------------------------------------
// Jetons de style partagés — direction "épurée / Apple" : fond quasi blanc,
// grandes cartes arrondies avec ombre douce (pas de bordure dure), typo
// bâton bien grasse pour les titres, une seule identité de couleur (marine +
// doré) utilisée avec parcimonie. Importés par toutes les pages/composants
// pour rester cohérent — voir aussi src/index.css pour les réglages globaux.
// ---------------------------------------------------------------------------

export const colors = {
  bg: "#F5F5F7", // fond de page (quasi blanc, teinté gris très léger)
  card: "#FFFFFF",
  ink: "#1B2A4A", // texte fort / identité de marque (bleu marine)
  slate: "#6E7787", // texte secondaire, gris neutre
  gold: "#D9A441", // accent (abonnement, mise en avant)
  green: "#3FA66B",
  red: "#D9534F",
  hairline: "rgba(27,42,74,0.07)", // liseré très discret, utilisé avec shadow.soft
};

export const shadow = {
  soft: "0 1px 2px rgba(16,24,40,0.04), 0 14px 32px -16px rgba(16,24,40,0.14)",
  raised: "0 2px 6px rgba(16,24,40,0.06), 0 26px 52px -20px rgba(16,24,40,0.20)",
};

export const fonts = {
  // Typo système : rend en San Francisco sur Apple, sinon Inter (chargée en
  // fallback web). Utilisée partout, y compris les titres (plus de serif).
  display: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
  body: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
  mono: "'Space Mono', monospace",
};

// Style de carte standard (fond blanc, coins très arrondis, ombre douce au
// lieu d'une bordure). `opacity` permet le rendu grisé (chapitre verrouillé).
export function cardStyle({ opacity = 1 } = {}) {
  return {
    backgroundColor: colors.card,
    boxShadow: shadow.soft,
    border: `1px solid ${colors.hairline}`,
    opacity,
  };
}
