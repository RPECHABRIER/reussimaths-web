import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, LayoutGrid, Zap } from "lucide-react";
import { colors, fonts, shadow } from "../theme";

const CP_GAMES = [
  { path: "/jeux/course-additions-cp-ce1", title: "La course des additions", description: "Calcule des additions jusqu’à 20 et fais avancer ton animal jusqu’à l’arrivée.", icon: Zap, accent: "#3fa66b" },
  { path: "/jeux/memory-cp-ce1", title: "Le memory des doubles", description: "Associe chaque double à son résultat et marque plus de points que le robot.", icon: LayoutGrid, accent: "#e56b8b" },
];

export default function JeuxCp() {
  return <div className="min-h-screen p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}><div className="mx-auto max-w-4xl">
    <Link to="/jeux" className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: colors.slate }}><ArrowLeft size={16}/> Tous les jeux</Link>
    <header className="my-7 rounded-[2rem] p-7 text-center sm:p-10" style={{ backgroundColor: colors.ink, boxShadow: shadow.raised }}><p className="text-xs font-black uppercase tracking-[.2em]" style={{ color: colors.gold }}>Espace découverte</p><h1 className="mt-2 text-4xl font-black" style={{ fontFamily: fonts.display, color: "white" }}>Jeux CP</h1><p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: "rgba(255,255,255,.72)" }}>Deux jeux aux règles simples pour automatiser les premières additions et reconnaitre les doubles.</p></header>
    <div className="grid gap-4 sm:grid-cols-2">{CP_GAMES.map(({ path, title, description, icon: Icon, accent }) => <Link key={path} to={path} className="interactive-card flex min-h-64 flex-col rounded-3xl p-6" style={{ backgroundColor: colors.card, borderTop: `5px solid ${accent}`, boxShadow: shadow.soft }}><span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}18` }}><Icon size={27} color={accent}/></span><h2 className="mt-5 text-xl font-black" style={{ fontFamily: fonts.display, color: colors.ink }}>{title}</h2><p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: colors.slate }}>{description}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-black" style={{ color: accent }}>Jouer <ChevronRight size={16}/></span></Link>)}</div>
  </div></div>;
}
