import { ArrowLeft, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import Mascot from "./Mascot";
import { colors, fonts, shadow } from "../theme";

export default function AppHeader({ backTo = "/", backLabel = "Accueil", account = true, compact = false }) {
  return (
    <header className={`print-hide flex items-center justify-between gap-3 ${compact ? "py-2" : "py-3 sm:py-4"}`}>
      <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Accueil RéussiMaths">
        <Mascot size={compact ? 36 : 42} style={{ boxShadow: shadow.soft }} />
        <span className="truncate text-sm font-black sm:text-base" style={{ fontFamily: fonts.display, color: colors.ink }}>RéussiMaths</span>
      </Link>
      <nav className="flex items-center gap-2" aria-label="Navigation de la page">
        {backTo !== "/" && <Link to={backTo} aria-label={backLabel} className="inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-xs font-bold sm:px-3" style={{ color: colors.slate, background: colors.card, boxShadow: shadow.soft }}><ArrowLeft size={13}/><span className="hidden sm:inline">{backLabel}</span></Link>}
        {account && backTo !== "/compte" && <Link to="/compte" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-black" style={{ color: colors.ink, background: colors.card, boxShadow: shadow.soft }}><UserRound size={14}/> Compte</Link>}
      </nav>
    </header>
  );
}
