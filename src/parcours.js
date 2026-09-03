import { getChapter, getChaptersByLevel } from "./chapters/registry";
import { getLevel } from "./levels";
import { CM2_REMEDIATION, getPreviousLevelId, LEVEL_FOUNDATIONS } from "./lib/prerequisites";
import { getDiagnosticRemediationIds } from "./lib/diagnosticProfile";
import { getStudyProgramme, hasConfiguredStudyProgramme } from "./lib/studyProgramme";
import { getDiagnosticShowcaseExercises, getDiscoveryShowcase } from "./discoveryShowcases";

// ---------------------------------------------------------------------------
// Parcours — AUTO-DÉRIVÉS du registre de chapitres, comme plannedChapters.js
// pour les sommaires. On ne stocke QUE la progression de l'élève en base
// (table parcours_progress, voir supabase/schema.sql) ; la définition d'un
// parcours (quels chapitres, quel ordre, quelle difficulté) vit ici, en dur,
// pour rester facile à ajuster sans migration.
//
// Un parcours = une suite ordonnée d'étapes. Chaque étape = un chapitre joué
// en série notée de `sessionLength` questions, à la difficulté du parcours
// (voir la convention DIFFICULTY par générateur, tâche #180 — les chapitres
// pas encore tagués retombent simplement sur un tirage sans filtre).
// ---------------------------------------------------------------------------

export const TIERS = [
  {
    id: "debutant",
    label: "Débutant",
    difficulty: "facile",
    description: "Pour prendre confiance, une question à la fois.",
  },
  {
    id: "avance",
    label: "Avancé",
    difficulty: "standard",
    description: "Le niveau attendu en classe.",
  },
  {
    id: "expert",
    label: "Expert",
    difficulty: "expert",
    description: "Pour viser l'excellence et les meilleures notes.",
  },
];

const SESSION_LENGTH = 8;

function stableProgressIndex(chapterId) {
  let hash = 0;
  for (let i = 0; i < chapterId.length; i++) hash = (hash * 31 + chapterId.charCodeAt(i)) & 0x7fffffff;
  return hash;
}

function stepForChapter(chapter) {
  return { chapterId: chapter.meta.id, title: chapter.meta.title, progressIndex: stableProgressIndex(chapter.meta.id) };
}

function levelChapters(levelId) {
  // Les chapitres "Réviser les bases" / Automatismes (gratuits ou freemium)
  // ne sont pas de vraies étapes de progression — on ne garde que les
  // chapitres de fond du niveau, dans leur ordre pédagogique.
  return getChaptersByLevel(levelId)
    .filter((c) => !c.meta.free && !c.meta.freemiumDaily)
    .slice()
    .sort((a, b) => (a.meta.order ?? 999) - (b.meta.order ?? 999));
}

export { getPreviousLevelId } from "./lib/prerequisites";

function tierParcoursId(levelId, tierId) {
  return `${levelId}-${tierId}`;
}

function buildTierParcours(levelId, tier) {
  const allCurrentChapters = levelChapters(levelId);
  let chapters = allCurrentChapters;
  const programmeConfigured = hasConfiguredStudyProgramme(levelId);
  const remediationIds = getDiagnosticRemediationIds(levelId);
  if (programmeConfigured || remediationIds.length > 0) {
    const selectedIds = new Set(Object.keys(getStudyProgramme(levelId)));
    const selected = programmeConfigured ? allCurrentChapters.filter((chapter) => selectedIds.has(chapter.meta.id)) : allCurrentChapters;
    const fallbackIds = levelId === "sixieme" ? Object.values(CM2_REMEDIATION) : (LEVEL_FOUNDATIONS[levelId] ?? []);
    const priorityIds = remediationIds.length || selected.length ? remediationIds : fallbackIds;
    const remediation = priorityIds.map(getChapter).filter(Boolean);
    chapters = [...new Map([...remediation, ...selected].map((chapter) => [chapter.meta.id, chapter])).values()];
  }
  if (chapters.length === 0) return null;
  const level = getLevel(levelId);
  return {
    id: tierParcoursId(levelId, tier.id),
    kind: "tier",
    levelId,
    tierId: tier.id,
    title: `${level?.label ?? levelId} — ${tier.label}`,
    tierLabel: tier.label,
    levelLabel: level?.label ?? levelId,
    description: tier.description,
    difficulty: tier.difficulty,
    sessionLength: SESSION_LENGTH,
    free: false,
    steps: chapters.map(stepForChapter),
  };
}

// Les 3 parcours (débutant/avancé/expert) disponibles pour un niveau donné.
// Retourne un tableau vide si le niveau n'a pas encore de chapitres réels.
export function getParcoursForLevel(levelId) {
  return TIERS.map((tier) => buildTierParcours(levelId, tier)).filter(Boolean);
}

// --- Parcours gratuit "Découverte" : un avant-goût multi-niveaux ----------
// Un chapitre (le premier chapitre de fond) pris dans plusieurs niveaux du
// collège et du lycée, pour donner un aperçu de l'appli sur toute sa
// progression et donner envie de s'abonner.
const DECOUVERTE_LEVEL_IDS = ["sixieme", "cinquieme", "quatrieme", "troisieme", "seconde", "premiere-spe"];
export const DECOUVERTE_ID = "decouverte";

// Une première série cohérente avec le niveau choisi. Elle reste volontairement
// courte et ne débloque qu'un chapitre : l'essai démontre la personnalisation
// sans transformer le catalogue payant en accès gratuit contournable.
export function getTrialParcours(levelId) {
  const showcase = getDiscoveryShowcase(levelId);
  if (!showcase) return null;
  const level = getLevel(levelId);
  return {
    id: `essai-${levelId}`,
    kind: "trial",
    levelId,
    tierId: "essai",
    title: `Première série — ${level?.label ?? levelId}`,
    tierLabel: "Essai personnalisé",
    levelLabel: level?.label ?? levelId,
    description: "Cinq questions choisies à ton niveau pour découvrir les explications et les animations RéussiMaths.",
    difficulty: "facile",
    sessionLength: 5,
    free: true,
    steps: [stepForChapter(showcase)],
  };
}

function decouverteSteps() {
  return DECOUVERTE_LEVEL_IDS.map((levelId) => {
    const chapters = levelChapters(levelId);
    if (chapters.length === 0) return null;
    const level = getLevel(levelId);
    return { ...stepForChapter(chapters[0]), levelLabel: level?.label ?? levelId };
  }).filter(Boolean);
}

export function getDecouverteParcours() {
  const steps = decouverteSteps();
  if (steps.length === 0) return null;
  return {
    id: DECOUVERTE_ID,
    kind: "decouverte",
    levelId: null,
    tierId: "decouverte",
    title: "Découverte",
    tierLabel: "Découverte",
    levelLabel: "Collège & Lycée",
    description: "Un avant-goût de RéussiMaths, du collège au lycée.",
    difficulty: "facile",
    sessionLength: 5,
    free: true,
    steps,
  };
}

// --- Mini-diagnostic de démarrage -----------------------------------------
// Les cinq questions existantes conservent leurs propres métadonnées.
// Le chapitre choisi par ailleurs ne doit jamais renommer la notion évaluée.
export function getDiagnosticChapters(levelId) {
  return getDiagnosticShowcaseExercises(levelId).map((exercise) => ({
    meta: {
      id: exercise.diagnostic.id,
      level: exercise.diagnostic.levelId,
      title: exercise.diagnostic.skill,
    },
    generate: () => exercise,
  }));
}

// Score (0 à 1) -> palier suggéré. Seuils volontairement larges : mieux vaut
// orienter un élève moyen vers "avancé" (le niveau attendu en classe) que de
// le décourager en le sous-estimant.
export function recommendTier(ratio) {
  if (ratio < 0.4) return "debutant";
  if (ratio < 0.75) return "avance";
  return "expert";
}

// Résout un id de parcours (ex: "sixieme-debutant" ou "decouverte") vers sa
// définition complète.
export function getParcours(parcoursId) {
  if (parcoursId === DECOUVERTE_ID) return getDecouverteParcours();
  if (parcoursId.startsWith("essai-")) return getTrialParcours(parcoursId.slice(6));
  const tier = TIERS.find((t) => parcoursId.endsWith(`-${t.id}`));
  if (!tier) return null;
  const levelId = parcoursId.slice(0, parcoursId.length - tier.id.length - 1);
  return buildTierParcours(levelId, tier);
}
