import { Link } from "react-router-dom";

// Mise en page commune aux pages légales (mentions, CGU, confidentialité) —
// prose simple, lisible, cohérente avec la charte graphique de l'app.
export default function LegalLayout({ title, children }) {
  return (
    <div className="min-h-screen w-full p-6 sm:p-10" style={{ background: "#F7F4EC", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-sm underline" style={{ color: "#5C6B7A" }}>
          ← Accueil
        </Link>
        <h1
          className="mt-4 mb-6"
          style={{ fontFamily: "Fraunces, serif", color: "#1B2A4A", fontSize: "1.8rem", fontWeight: 600 }}
        >
          {title}
        </h1>
        <div className="legal-prose" style={{ color: "#33415a", lineHeight: 1.7, fontSize: "0.95rem" }}>
          {children}
        </div>
        <div className="flex flex-wrap gap-4 mt-10 pt-6 text-xs" style={{ borderTop: "1px solid #e4dfd0", color: "#5C6B7A" }}>
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
        .legal-prose h2 { font-family: Fraunces, serif; color: #1B2A4A; font-size: 1.15rem; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.5rem; }
        .legal-prose p { margin-bottom: 0.9rem; }
        .legal-prose ul { list-style: disc; padding-left: 1.25rem; margin-bottom: 0.9rem; }
        .legal-prose li { margin-bottom: 0.35rem; }
        .legal-prose a { color: #1B2A4A; text-decoration: underline; }
      `}</style>
    </div>
  );
}
