import MindMap from "./MindMap";
import { colors, fonts, shadow } from "../theme";

// ---------------------------------------------------------------------------
// Contenu de l'onglet "Cours" d'un chapitre (voir ChapterRunner.jsx, mode
// "cours") : l'essentiel du cours et des méthodes à connaître, AVANT de
// passer aux exercices — vidéos courtes (si Romain en a tourné pour ce
// chapitre) puis carte mentale (voir MindMap.jsx). Les deux blocs sont
// indépendamment optionnels : un chapitre peut n'avoir qu'une carte mentale
// (cas le plus courant au lancement), une carte mentale + vidéos, ou (pas
// encore vu en pratique) rien du tout — dans ce dernier cas ChapterRunner
// ne propose même pas l'onglet "Cours" (voir hasCours).
//
// Forme de `cours` (voir meta.cours dans src/chapters/*.js) :
//   { mindMap: {...}, videos: [{ title, youtubeId }] }
// `videos` est optionnel/vide tant que Romain n'a pas encore tourné de vidéo
// pour ce chapitre.
// ---------------------------------------------------------------------------
export default function CoursPanel({ cours }) {
  if (!cours) return null;
  const videos = cours.videos ?? [];

  return (
    <div className="rounded-3xl p-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
      {videos.length > 0 && (
        <div className="flex flex-col gap-4 mb-6">
          {videos.map((v, i) => (
            <div key={i}>
              <p className="text-sm font-semibold mb-2" style={{ color: colors.ink, fontFamily: fonts.display }}>
                {v.title}
              </p>
              <div
                style={{
                  position: "relative",
                  paddingTop: "56.25%",
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: shadow.soft,
                }}
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                  title={v.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <MindMap mindMap={cours.mindMap} />
    </div>
  );
}
