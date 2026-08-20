import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import { colors, fonts } from "../theme";

export default function NotFound() {
  return <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center" style={{ background: colors.bg, color: colors.ink, fontFamily: fonts.body }}><SeoHead title="Page introuvable | RéussiMaths" description="Cette page n’existe pas ou a été déplacée." path={window.location.pathname} noindex/><p className="text-sm font-black uppercase tracking-widest" style={{color:colors.gold}}>Erreur 404</p><h1 className="text-3xl font-black">Page introuvable</h1><p style={{color:colors.slate}}>La page demandée n’existe pas ou a été déplacée.</p><Link to="/" className="rounded-full px-6 py-3 font-bold" style={{background:colors.ink,color:colors.card}}>Retour à l’accueil</Link></main>;
}
