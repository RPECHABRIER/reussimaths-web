import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { authenticatedFetch } from "../lib/api";
import { trackProductEvent } from "../lib/productAnalytics";
import { colors, fonts, shadow } from "../theme";

function Rating({ label, value, onChange }) {
  return <fieldset><legend className="text-sm font-bold" style={{ color: colors.ink }}>{label}</legend><div className="flex gap-2 mt-2">{[1,2,3,4,5].map((n) => <button type="button" key={n} onClick={() => onChange(n)} className="w-10 h-10 rounded-full text-sm font-black" style={{ backgroundColor: value === n ? colors.gold : colors.bg, color: colors.ink }}>{n}</button>)}</div></fieldset>;
}

export default function PilotFeedback() {
  const [form, setForm] = useState({ role: "eleve", usefulness: 0, ease: 0, wouldRecommend: true, comment: "" });
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault(); setState("loading"); setError("");
    try {
      const response = await authenticatedFetch("/api/pilot-feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setState("done"); trackProductEvent("feedback_sent", { role: form.role });
    } catch (submitError) { setError(submitError.message); setState("idle"); }
  };
  return <div className="min-h-screen p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}><div className="max-w-xl mx-auto"><Link to="/compte" className="text-sm" style={{ color: colors.slate }}>← Mon compte</Link><div className="rounded-[2rem] p-6 sm:p-8 mt-6" style={{ backgroundColor: colors.card, boxShadow: shadow.raised }}>
    {state === "done" ? <div className="text-center py-8"><CheckCircle2 className="mx-auto" color={colors.green} /><h1 className="text-2xl font-black mt-3" style={{ color: colors.ink }}>Merci, ton retour est enregistré.</h1><p className="text-sm mt-2" style={{ color: colors.slate }}>Il servira à décider les prochaines améliorations.</p></div> : <form onSubmit={submit} className="flex flex-col gap-6"><div><p className="text-xs uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Pilote RéussiMaths</p><h1 className="text-3xl font-black mt-2" style={{ color: colors.ink }}>Aide-nous à améliorer l’expérience</h1><p className="text-sm mt-2" style={{ color: colors.slate }}>Trois réponses rapides, sans publier ton identité.</p></div>
      <label className="text-sm font-bold" style={{ color: colors.ink }}>Je réponds comme <select value={form.role} onChange={(e) => setForm({...form, role:e.target.value})} className="block w-full mt-2 rounded-xl p-3" style={{ backgroundColor: colors.bg }}><option value="eleve">Élève</option><option value="parent">Parent</option><option value="enseignant">Enseignant</option></select></label>
      <Rating label="Cette application peut-elle aider à progresser ?" value={form.usefulness} onChange={(value) => setForm({...form,usefulness:value})} />
      <Rating label="Est-elle facile à utiliser ?" value={form.ease} onChange={(value) => setForm({...form,ease:value})} />
      <label className="text-sm font-bold" style={{ color: colors.ink }}>La recommanderais-tu ? <select value={String(form.wouldRecommend)} onChange={(e) => setForm({...form,wouldRecommend:e.target.value === "true"})} className="block w-full mt-2 rounded-xl p-3" style={{ backgroundColor: colors.bg }}><option value="true">Oui</option><option value="false">Non</option></select></label>
      <label className="text-sm font-bold" style={{ color: colors.ink }}>La chose à améliorer en priorité <textarea value={form.comment} onChange={(e) => setForm({...form,comment:e.target.value})} maxLength={2000} rows={4} className="block w-full mt-2 rounded-xl p-3" style={{ backgroundColor: colors.bg }} /></label>
      {error && <p className="text-sm" style={{ color: colors.red }}>{error}</p>}<button disabled={!form.usefulness || !form.ease || state === "loading"} className="rounded-full py-3 font-bold" style={{ backgroundColor: colors.ink, color: colors.bg, opacity: form.usefulness && form.ease ? 1 : .5 }}>{state === "loading" ? "Envoi…" : "Envoyer mon retour"}</button>
    </form>}
  </div></div></div>;
}
