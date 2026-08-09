import { Link, useLocation } from "react-router-dom";
import { BarChart3, Home, RotateCcw, UserRound } from "lucide-react";
import { colors, shadow } from "../theme";

const ITEMS = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/reviser", label: "Réviser", icon: RotateCcw },
  { to: "/bilan", label: "Bilan", icon: BarChart3 },
  { to: "/compte", label: "Compte", icon: UserRound },
];

export default function StudentDock() {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Navigation élève" className="sm:hidden fixed z-40 bottom-3 left-1/2 -translate-x-1/2 rounded-2xl px-2 py-1.5 flex items-center gap-1" style={{ backgroundColor: "rgba(255,255,255,.94)", boxShadow: shadow.floating, border: `1px solid ${colors.hairline}`, backdropFilter: "blur(16px)", width: "calc(100% - 24px)", maxWidth: 390 }}>
      {ITEMS.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return <Link key={to} to={to} className="flex-1 py-2 rounded-xl flex flex-col items-center gap-0.5" style={{ color: active ? colors.ink : colors.slate, backgroundColor: active ? `${colors.gold}15` : "transparent" }}><Icon size={17} color={active ? colors.gold : colors.slate} /><span className="text-[10px] font-bold">{label}</span></Link>;
      })}
    </nav>
  );
}
