import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home, RotateCcw, ShieldCheck } from "lucide-react";
import { colors, fonts, shadow } from "../theme";
import { reportClientError } from "../lib/errorReporting";

export default class AppErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    reportClientError(error, { source: "react-boundary", componentStack: info.componentStack });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ background: colors.bg, fontFamily: fonts.body }}>
        <div className="w-full max-w-lg rounded-[2rem] p-6 sm:p-8 text-center" style={{ backgroundColor: colors.card, boxShadow: shadow.raised, border: `1px solid ${colors.hairline}` }}>
          <div className="mx-auto rounded-2xl flex items-center justify-center" style={{ width: 56, height: 56, backgroundColor: `${colors.gold}18` }}><AlertTriangle size={25} color={colors.gold} /></div>
          <p className="text-xs uppercase tracking-widest font-bold mt-5" style={{ color: colors.gold }}>Un imprévu est survenu</p>
          <h1 className="mt-2" style={{ fontFamily: fonts.display, color: colors.ink, fontWeight: 900, fontSize: "1.8rem", letterSpacing: "-0.03em" }}>Ta progression reste enregistrée.</h1>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: colors.slate }}>L’erreur technique a été signalée automatiquement. Recharge cette page ou reviens à l’accueil pour continuer.</p>
          <div className="grid sm:grid-cols-2 gap-2 mt-6">
            <button onClick={() => window.location.reload()} className="py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2" style={{ backgroundColor: colors.ink, color: colors.bg }}><RotateCcw size={15} /> Recharger</button>
            <Link to="/" onClick={() => this.setState({ error: null })} className="py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2" style={{ backgroundColor: colors.bg, color: colors.ink }}><Home size={15} /> Accueil</Link>
          </div>
          <p className="text-[11px] mt-5 flex items-center justify-center gap-1.5" style={{ color: colors.slate }}><ShieldCheck size={13} color={colors.green} /> Aucune réponse scolaire n’est perdue par cet écran.</p>
        </div>
      </div>
    );
  }
}
