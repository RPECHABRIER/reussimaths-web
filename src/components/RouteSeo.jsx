import { useLocation } from "react-router-dom";
import SeoHead from "./SeoHead";
import { getLevel } from "../levels";

const PRIVATE_PREFIXES = ["/admin", "/compte", "/amis", "/pseudo", "/reviser", "/bilan", "/idees", "/retour-pilote"];

export default function RouteSeo() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/cours/")) return null;
  if (pathname === "/") return <SeoHead title="RéussiMaths — exercices de maths collège et lycée" description="Progresse en maths avec un diagnostic, des exercices ciblés, des corrections détaillées et des révisions adaptées du collège au lycée." path="/" />;
  if (pathname === "/college" || pathname === "/lycee") {
    const label = pathname === "/college" ? "collège" : "lycée";
    return <SeoHead title={`Maths ${label} : cours et exercices corrigés | RéussiMaths`} description={`Cours, exercices corrigés et entraînements de maths pour les élèves de ${label}, conformes aux programmes scolaires.`} path={pathname} />;
  }
  const levelId = pathname.match(/^\/niveau\/([^/]+)$/)?.[1];
  const level = getLevel(levelId);
  if (level) return <SeoHead title={`Maths ${level.label} : programme, cours et exercices | RéussiMaths`} description={`Programme de maths ${level.label} : chapitres, cours gratuits, exercices corrigés et entraînements adaptés avec RéussiMaths.`} path={pathname} />;
  const noindex = PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix)) || pathname.startsWith("/chapitre/") || pathname.startsWith("/parcours/") || pathname.startsWith("/jeux/");
  if (noindex) return <SeoHead title="RéussiMaths" description="Espace d’entraînement personnalisé RéussiMaths." path={pathname} noindex />;
  return null;
}
