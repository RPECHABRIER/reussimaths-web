import { Link } from "react-router-dom";
import { FileCheck2, ShieldCheck } from "lucide-react";
import { colors, fonts, shadow } from "../../theme";

// Mise en page commune aux pages légales (mentions, CGU, confidentialité) —
// prose simple, lisible, cohérente avec la charte graphique de l'app.
export default function LegalLayout({ title, children, updated = "9 août 2026" }) {
  return (
    <div className="min-h-screen w-full p-6 sm:p-10" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Accueil
        </Link>
        <header className="rounded-[2rem] p-6 sm:p-8 mt-5 mb-6" style={{ backgroundColor: colors.ink, boxShadow: shadow.raised }}>
          <div className="rounded-xl flex items-center justify-center" style={{ width: 42, height: 42, backgroundColor: `${colors.gold}20` }}><FileCheck2 size={20} color={colors.gold} /></div>
          <p className="text-xs uppercase tracking-widest font-bold mt-5" style={{ color: colors.gold }}>Informations contractuelles</p>
          <h1 className="mt-2" style={{ fontFamily: fonts.display, color: "#fff", fontSize: "clamp(1.9rem, 5vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.035em" }}>{title}</h1>
          <p className="text-xs mt-3 flex items-center gap-1.5" style={{ color: "rgba(255,255,255,.62)" }}><ShieldCheck size={13} color={colors.green} /> Dernière mise à jour : {updated}</p>
        </header>
        <div className="legal-prose rounded-[2rem] p-5 sm:p-8" style={{ color: "#33415a", lineHeight: 1.75, fontSize: "0.95rem", backgroundColor: colors.card, boxShadow: shadow.soft, border: `1px solid ${colors.hairline}` }}>
          {children}
        </div>
        <div className="flex flex-wrap gap-4 mt-10 pt-6 text-xs" style={{ borderTop: `1px solid ${colors.hairline}`, color: colors.slate }}>
          <Link to="/mentions-legales" className="underline">
            Mentions légales
          </Link>
          <Link to="/cgu" className="underline">
            CGU
          </Link>
          <Link to="/confidentialite" className="underline">
            Confidentialité
          </Link>
        </div>
      </div>
      <style>{`
        .legal-prose h2 { font-family: ${fonts.display}; color: ${colors.ink}; font-size: 1.15rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.5rem; }
        .legal-prose p { margin-bottom: 0.9rem; }
        .legal-prose ul { list-style: disc; padding-left: 1.25rem; margin-bottom: 0.9rem; }
        .legal-prose li { margin-bottom: 0.35rem; }
        .legal-prose a { color: ${colors.ink}; text-decoration: underline; }
        .legal-prose .legal-callout { padding: 1rem; margin: 1.25rem 0; border-radius: 1rem; background: ${colors.gold}12; border: 1px solid ${colors.gold}35; }
        .legal-prose .legal-callout ul { margin-top: .75rem; margin-bottom: 0; }
      `}</style>
    </div>
  );
}
