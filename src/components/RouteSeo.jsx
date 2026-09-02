import { useLocation } from "react-router-dom";
import SeoHead from "./SeoHead";
import { getLevel } from "../levels";
import { CYCLE_LANDINGS, getLevelLanding } from "../seo/landingPages";

const PRIVATE_PREFIXES = ["/admin", "/compte", "/amis", "/pseudo", "/reviser", "/bilan", "/idees", "/retour-pilote"];

export default function RouteSeo() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/cours/")) return null;
  if (pathname === "/") return <SeoHead title="RéussiMaths — exercices de maths collège et lycée" description="Progresse en maths avec un diagnostic, des exercices ciblés, des corrections détaillées et des révisions adaptées du collège au lycée." path="/" />;
  if (pathname === "/college" || pathname === "/lycee") {
    const landing = CYCLE_LANDINGS[pathname.slice(1)];
    return <SeoHead title={landing.title} description={landing.description} path={pathname} />;
  }
  if (pathname === "/enseignant") return <SeoHead title="Automatismes de maths à projeter en classe | RéussiMaths" description="Créez gratuitement un rituel de 5 automatismes de maths, prêt à projeter en classe avec corrections détaillées." path="/enseignant" />;
  const levelId = pathname.match(/^\/niveau\/([^/]+)$/)?.[1];
  const level = getLevel(levelId);
  const landing = getLevelLanding(levelId);
  if (level && landing) return <SeoHead title={landing.title} description={landing.description} path={pathname} />;
  const noindex = PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix)) || pathname.startsWith("/chapitre/") || pathname.startsWith("/parcours/") || pathname === "/jeux" || pathname.startsWith("/jeux/");
  if (noindex) return <SeoHead title="RéussiMaths" description="Espace d’entraînement personnalisé RéussiMaths." path={pathname} noindex />;
  return null;
}
