import { Link } from "react-router-dom";
import { LEVELS } from "../levels";
import { getChaptersByLevel } from "../chapters/registry";
import { colors, fonts, shadow } from "../theme";

export default function LevelSelect() {
  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10 pt-4">
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Reussimaths
          </h1>
          <p className="text-sm mt-1.5" style={{ color: colors.slate }}>
            Choisis ton niveau
          </p>
          <div
            className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 rounded-full"
            style={{ backgroundColor: `${colors.gold}18` }}
          >
            <p className="text-xs font-semibold" style={{ color: colors.gold }}>
              Conforme aux nouveaux programmes 2026
            </p>
          </div>
          <div
            className="inline-flex flex-col items-center gap-0.5 mt-3 px-4 py-2.5 rounded-2xl"
            style={{ backgroundColor: `${colors.green}12` }}
          >
            <p className="text-xs font-semibold" style={{ color: colors.green }}>
              L'application qui te fait progresser en maths en seulement quelques minutes par jour
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {LEVELS.map((level) => {
            const available = getChaptersByLevel(level.id).length > 0;
            return (
              <Link key={level.id} to={`/niveau/${level.id}`}>
                <div
                  className="rounded-3xl px-5 py-4 flex items-center justify-between transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}
                >
                  <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.1rem", fontWeight: 700 }}>
                    {level.label}
                  </p>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: available ? `${colors.green}18` : `${colors.slate}14`,
                      color: available ? colors.green : colors.slate,
                    }}
                  >
                    {available ? "Disponible" : "Bientôt"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10 flex items-center justify-center gap-5">
          <Link to="/compte" className="text-sm font-medium" style={{ color: colors.ink }}>
            Mon compte
          </Link>
          <Link to="/amis" className="text-sm font-medium" style={{ color: colors.ink }}>
            Amis & défis
          </Link>
          <Link to="/reviser" className="text-sm font-medium" style={{ color: colors.ink }}>
            Réviser
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8 pt-5 text-xs" style={{ borderTop: `1px solid ${colors.hairline}`, color: colors.slate }}>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/cgu">CGU</Link>
          <Link to="/confidentialite">Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}
