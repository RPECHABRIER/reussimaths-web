// ---------------------------------------------------------------------------
// Système de son de l'appli : musique d'ambiance selon le "mode" (collège,
// lycée, jeux, révisions, courses) + bruitage de clic. Voir
// src/components/SoundManager.jsx (composant monté une seule fois dans
// App.jsx) qui utilise les fonctions de ce fichier.
//
// Fichiers audio : public/audio/{college,lycee,jeux,revisions,courses}.mp3
// (musiques, en boucle) + public/audio/click.wav (bruitage court).
// ---------------------------------------------------------------------------

import { getLevel } from "../levels";
import { getChapter } from "../chapters/registry";
import { getParcours } from "../parcours";

export const TRACKS = {
  college: "/audio/college.mp3",
  lycee: "/audio/lycee.mp3",
  jeux: "/audio/jeux.mp3",
  revisions: "/audio/revisions.mp3",
  courses: "/audio/courses.mp3",
};

export const CLICK_SOUND = "/audio/click.wav";

const MUTED_KEY = "reussimaths_sound_muted";
const VOLUME_KEY = "reussimaths_sound_volume";
export const DEFAULT_VOLUME = 0.35;
export const CLICK_VOLUME = 0.55;

export function getStoredMuted() {
  try {
    return localStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function setStoredMuted(muted) {
  try {
    localStorage.setItem(MUTED_KEY, muted ? "1" : "0");
  } catch {
    // stockage indisponible (navigation privée...) : on continue sans persister
  }
}

export function getStoredVolume() {
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    const value = raw === null ? DEFAULT_VOLUME : Number(raw);
    return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : DEFAULT_VOLUME;
  } catch {
    return DEFAULT_VOLUME;
  }
}

export function setStoredVolume(volume) {
  try {
    localStorage.setItem(VOLUME_KEY, String(volume));
  } catch {
    // idem
  }
}

// Retrouve le cycle ("college" | "lycee") d'un niveau à partir de son id, via
// src/levels.js.
function cycleForLevelId(levelId) {
  return getLevel(levelId)?.cycle ?? null;
}

// Détermine la "zone sonore" active à partir du chemin de l'URL courante.
// Retourne une clé de TRACKS, ou null pour rester silencieux (pages
// utilitaires : compte, amis, bilan, admin, mentions légales...).
export function getZoneForPath(pathname) {
  // Jeux de course (chrono) : ambiance énergique dédiée.
  if (
    pathname.startsWith("/jeux/course-tables") ||
    pathname.startsWith("/jeux/estimation-express") ||
    pathname.startsWith("/jeux/course-additions-cp-ce1")
  ) {
    return "courses";
  }
  // Jeux de memory : demandent beaucoup de concentration, même ambiance que
  // les révisions plutôt que l'ambiance "jeux" plus rythmée.
  if (pathname.startsWith("/jeux/memory-maths") || pathname.startsWith("/jeux/memory-cp-ce1")) {
    return "revisions";
  }
  // Hall des jeux (et tout futur jeu non encore catégorisé ci-dessus).
  if (pathname === "/jeux" || pathname.startsWith("/jeux/")) return "jeux";

  // Révisions.
  if (pathname.startsWith("/reviser")) return "revisions";

  // Accueil de cycle.
  if (pathname === "/college") return "college";
  if (pathname === "/lycee") return "lycee";

  // Page d'un niveau : /niveau/:levelId
  const niveauMatch = pathname.match(/^\/niveau\/([^/]+)/);
  if (niveauMatch) return cycleForLevelId(niveauMatch[1]);

  // Diagnostic ou sélection de parcours pour un niveau : /parcours/niveau/:levelId(...)
  const parcoursNiveauMatch = pathname.match(/^\/parcours\/niveau\/([^/]+)/);
  if (parcoursNiveauMatch) return cycleForLevelId(parcoursNiveauMatch[1]);

  // Étape ou aperçu d'un parcours : /parcours/:parcoursId(/etape/:stepIndex)
  const parcoursMatch = pathname.match(/^\/parcours\/([^/]+)/);
  if (parcoursMatch) {
    try {
      const parcours = getParcours(parcoursMatch[1]);
      if (parcours?.levelId) return cycleForLevelId(parcours.levelId);
    } catch {
      // parcours introuvable : on retombe sur le silence plus bas
    }
  }

  // Une fiche de chapitre : /chapitre/:id — on retrouve son niveau, donc son
  // cycle, via le registre des chapitres.
  const chapitreMatch = pathname.match(/^\/chapitre\/([^/]+)/);
  if (chapitreMatch) {
    try {
      const chapter = getChapter(chapitreMatch[1]);
      if (chapter?.meta?.level) return cycleForLevelId(chapter.meta.level);
    } catch {
      // chapitre introuvable : silence
    }
  }

  // Accueil, /niveaux, /compte, /pseudo, /amis, /bilan, /enseignant, /idees,
  // /admin, pages légales... : pas de musique.
  return null;
}
