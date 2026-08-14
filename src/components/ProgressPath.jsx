import { Check, Flag, Lock, Sparkles } from "lucide-react";
import { colors } from "../theme";

export default function ProgressPath({ steps, activeIndex = 0, compact = false }) {
  return (
    <div className={compact ? "progress-path progress-path-scroll flex snap-x gap-1 overflow-x-auto pb-1" : "progress-path flex flex-col"} aria-label="Chemin de progression">
      {steps.map((step, index) => {
        const done = !!step.done;
        const active = index === activeIndex && !done;
        const locked = !!step.locked;
        return (
          <div key={`${step.label}-${index}`} className={compact ? "relative min-w-[4.5rem] flex-1 snap-start text-center" : "relative flex gap-3 pb-5 last:pb-0"}>
            {compact && index < steps.length - 1 && (
              <span className="absolute left-[calc(50%+1rem)] right-[calc(-50%+1rem)] top-[15px] h-0.5" style={{ background: done ? colors.green : `${colors.ink}12` }}/>
            )}
            {!compact && index < steps.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-1.4rem)] w-0.5" style={{ background: done ? colors.green : `${colors.ink}12` }}/>} 
            <span className="relative z-10 mx-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: done ? colors.green : active ? colors.gold : colors.card, border: `2px solid ${done ? colors.green : active ? colors.gold : `${colors.ink}18`}`, boxShadow: active ? `0 0 0 5px ${colors.gold}18` : "none" }}>
              {done ? <Check size={15} color="white"/> : locked ? <Lock size={12} color={colors.slate}/> : active ? <Sparkles size={13} color={colors.ink}/> : index === steps.length - 1 ? <Flag size={12} color={colors.slate}/> : <span className="text-[10px] font-black" style={{color:colors.slate}}>{index + 1}</span>}
            </span>
            <div className={compact ? "mt-1" : "min-w-0 pt-1"}>
              <p className={compact ? "truncate text-[9px] font-black" : "text-sm font-black"} style={{ color: active ? colors.ink : done ? colors.green : colors.slate }}>{step.label}</p>
              {!compact && step.detail && <p className="mt-0.5 text-xs" style={{color:colors.slate}}>{step.detail}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
