import { ArrowDown, ArrowRight } from "lucide-react";
import { colors } from "../theme";

export default function FeedbackVisual({ family }) {
  if (family === "percentage_change") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3 overflow-hidden" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Voir l’augmentation</p>
        <div className="mt-3 flex items-center gap-2 text-[11px] font-bold" style={{ color: colors.ink }}>
          <div className="h-8 rounded-lg flex items-center justify-center" style={{ width: "64%", background: `${colors.ink}18` }}>100 %</div>
          <div className="h-8 rounded-lg flex items-center justify-center animate-pulse" style={{ width: "22%", background: `${colors.gold}55` }}>+ 20 %</div>
        </div>
        <div className="flex justify-center my-1"><ArrowDown size={15} color={colors.gold} /></div>
        <div className="h-9 w-full rounded-lg flex items-center justify-center text-xs font-black" style={{ background: `${colors.green}18`, color: colors.green }}>120 % de la valeur initiale</div>
      </div>
    );
  }
  if (family === "function_antecedent") {
    return (
      <div className="mt-4 rounded-xl bg-white p-3" style={{ border: `1px solid ${colors.gold}35` }}>
        <p className="text-xs font-bold" style={{ color: colors.ink }}>Le sens de lecture</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold" style={{ color: colors.ink }}>
          <span className="rounded-lg px-3 py-2" style={{ background: `${colors.gold}18` }}>résultat connu</span>
          <ArrowRight size={17} color={colors.gold} className="animate-pulse" />
          <span className="rounded-lg px-3 py-2" style={{ background: `${colors.green}18` }}>nombre de départ recherché</span>
        </div>
      </div>
    );
  }
  return null;
}
