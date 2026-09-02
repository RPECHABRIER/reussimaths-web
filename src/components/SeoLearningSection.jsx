import { CheckCircle2 } from "lucide-react";
import { colors, fonts, shadow } from "../theme";

export default function SeoLearningSection({ title, intro, details, topics }) {
  return (
    <section className="mt-10 rounded-[2rem] bg-white p-6 sm:p-8" style={{ boxShadow: shadow.soft }}>
      <h2 className="text-2xl font-black" style={{ color: colors.ink, fontFamily: fonts.display }}>{title}</h2>
      <div className="mt-4 grid gap-4 text-sm leading-relaxed sm:grid-cols-2" style={{ color: colors.slate }}>
        <p>{intro}</p>
        <p>{details}</p>
      </div>
      <h3 className="mt-6 font-black" style={{ color: colors.ink }}>Notions à travailler</h3>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <li key={topic} className="flex items-start gap-2 rounded-2xl px-3 py-2 text-sm" style={{ background: colors.bg, color: colors.ink }}>
            <CheckCircle2 className="mt-0.5 shrink-0" size={16} color={colors.green} />
            <span>{topic}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
