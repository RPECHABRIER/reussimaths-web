import { Link } from "react-router-dom";
import { colors, fonts } from "../../theme";

// Mise en page commune aux pages légales (mentions, CGU, confidentialité) —
// prose simple, lisible, cohérente avec la charte graphique de l'app.
export default function LegalLayout({ title, children }) {
  return (
    <div className="min-h-screen w-full p-6 sm:p-10" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Accueil
        </Link>
        <h1
          className="mt-4 mb-6"
          style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.9rem", fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          {title}
        </h1>
        <div className="legal-prose" style={{ color: "#33415a", lineHeight: 1.7, fontSize: "0.95rem" }}>
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
      `}</style>
    </div>
  );
}
