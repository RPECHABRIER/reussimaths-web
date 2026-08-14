import { Link } from "react-router-dom";
import { ArrowRight, Brain, Check, RotateCcw, Target, Timer } from "lucide-react";
import { colors, fonts, shadow } from "../theme";

export default function TodayPlan({ primary, mentalTo, mentalDone, dueCount = 0, levelLabel }) {
  const steps = [
    { icon: Brain, label: "Calcul mental", detail: mentalDone ? "10 questions terminées" : "10 réflexes · 3 min", done: mentalDone, to: mentalTo },
    { icon: Target, label: "Séance ciblée", detail: levelLabel ? `${levelLabel} · environ 8 min` : "Exercices adaptés · 8 min", active: true, to: primary.to },
    { icon: RotateCcw, label: "Consolidation", detail: dueCount ? `${dueCount} notion${dueCount > 1 ? "s" : ""} à revoir` : "Programmée au bon moment", done: dueCount === 0, to: dueCount ? "/reviser" : null },
  ];

  return (
    <section className="today-plan mt-5 rounded-[2rem] p-5 sm:p-7" style={{ background: `linear-gradient(145deg, ${colors.ink}, #243a66)`, boxShadow: shadow.floating }}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: colors.gold }}>Aujourd’hui</p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl" style={{ color: colors.card, fontFamily: fonts.display }}>Une seule étape pour avancer</h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed" style={{ color: "#dbe3f1" }}>{primary.detail}</p>
        </div>
        <Link to={primary.to} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-black" style={{ background: colors.gold, color: colors.ink }}>
          {primary.title} <ArrowRight size={16}/>
        </Link>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-3" aria-label="Plan de travail du jour">
        {steps.map(({ icon: Icon, label, detail, done, active, to }) => {
          const content = <div className="flex h-full items-center gap-3 rounded-2xl p-3.5" style={{ background: active ? colors.card : "rgba(255,255,255,.08)", border: active ? `2px solid ${colors.gold}` : "1px solid rgba(255,255,255,.08)" }}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: done ? `${colors.green}25` : active ? `${colors.gold}22` : "rgba(255,255,255,.1)" }}>
              {done ? <Check size={18} color={colors.green}/> : <Icon size={18} color={active ? colors.gold : colors.card}/>} 
            </span>
            <span className="min-w-0"><span className="block text-xs font-black" style={{ color: active ? colors.ink : colors.card }}>{label}</span><span className="mt-0.5 block text-[10px] leading-snug" style={{ color: active ? colors.slate : "#cbd5e5" }}>{detail}</span></span>
          </div>;
          return to ? <Link key={label} to={to} className="transition-transform active:scale-[.98]">{content}</Link> : <div key={label}>{content}</div>;
        })}
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px]" style={{ color: "#bfcbe0" }}><Timer size={12}/> Environ 15 minutes au total · sans travail inutile</p>
    </section>
  );
}
