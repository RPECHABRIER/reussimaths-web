import { Brain, Calculator } from "lucide-react";
import { colors } from "../theme";
import { getCalculationMode } from "../lib/calculationMode";
export { getCalculationMode } from "../lib/calculationMode";

export default function CalculationModeBadge({ exercise, large = false }) {
  const mental=getCalculationMode(exercise)==="mental";
  const Icon=mental?Brain:Calculator;
  return <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-black" style={{fontSize:large?"0.82rem":"0.66rem",backgroundColor:mental?`${colors.green}16`:`${colors.gold}18`,color:mental?colors.green:colors.ink,border:`1px solid ${mental?colors.green:colors.gold}30`}}><Icon size={large?16:13}/>{mental?"Calcul mental":"Calculatrice autorisée"}</span>;
}
