// ---------------------------------------------------------------------------
// Registre de chapitres — AUTO-DÉCOUVERTE, ne pas éditer pour ajouter du contenu.
//
// Pour ajouter un nouveau chapitre : dépose un fichier `src/chapters/<slug>.js`
// qui exporte par défaut un objet { meta, generate } (voir second-degre.js comme
// modèle). Ce fichier est automatiquement repéré par Vite (import.meta.glob) et
// apparaît dans la liste des chapitres sans toucher à aucun autre fichier.
//
// meta attendu :
//   id          : identifiant unique (string), utilisé dans l'URL /chapitre/:id
//   title       : titre affiché
//   description : courte description affichée sur la page d'accueil
//   free        : true si accessible sans abonnement
//   order       : nombre optionnel pour l'ordre d'affichage (défaut 999)
//   unlockHint  : texte optionnel affiché si le chapitre est verrouillé
//                 (ex: "Débloqué en partageant à 5 amis actifs")
//
// generate() doit retourner un objet exercice : { type: "numeric" | "qcm",
// chapter, prompt, answer, options?, steps }, exactement comme dans
// second-degre.js.
// ---------------------------------------------------------------------------

const modules = import.meta.glob("./*.js", { eager: true });

export const chapters = Object.entries(modules)
  .filter(([path]) => !path.endsWith("registry.js"))
  .map(([, mod]) => mod.default)
  .filter(Boolean)
  .sort((a, b) => (a.meta.order ?? 999) - (b.meta.order ?? 999));

export function getChapter(id) {
  return chapters.find((c) => c.meta.id === id);
}
