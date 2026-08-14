import { MessageCircle, Quote, ShieldCheck } from "lucide-react";
import { HOME_TESTIMONIALS } from "../data/testimonials";
import { colors, fonts, shadow } from "../theme";

export default function HomeTestimonials({ testimonials = HOME_TESTIMONIALS }) {
  if (!Array.isArray(testimonials) || testimonials.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-24" aria-labelledby="testimonials-title">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black" style={{ background: `${colors.green}14`, color: colors.green }}>
          <MessageCircle size={13} /> Retours de familles
        </span>
        <h2 id="testimonials-title" className="mt-3 text-2xl font-black sm:text-3xl" style={{ color: colors.ink, fontFamily: fonts.display }}>
          Leur expérience avec RéussiMaths
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: colors.slate }}>
          Des témoignages recueillis auprès d’utilisateurs et publiés avec leur accord.
        </p>
      </div>

      <div className="mx-auto mt-7 grid max-w-5xl gap-4 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.id} className="relative overflow-hidden rounded-[1.75rem] p-6" style={{ background: colors.card, boxShadow: shadow.soft, border: `1px solid ${colors.hairline}` }}>
            <Quote aria-hidden="true" size={34} color={colors.gold} className="absolute right-5 top-5 opacity-20" />
            <blockquote className="relative pr-7 text-base font-bold leading-relaxed" style={{ color: colors.ink }}>
              « {testimonial.quote} »
            </blockquote>
            {testimonial.result && (
              <p className="mt-4 inline-flex rounded-full px-3 py-1.5 text-xs font-black" style={{ background: `${colors.gold}15`, color: colors.gold }}>
                {testimonial.result}
              </p>
            )}
            <figcaption className="mt-5 border-t pt-4" style={{ borderColor: colors.hairline }}>
              <p className="text-sm font-black" style={{ color: colors.ink }}>{testimonial.author}</p>
              <p className="mt-0.5 text-xs" style={{ color: colors.slate }}>{testimonial.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="mx-auto mt-4 flex max-w-5xl items-center justify-center gap-1.5 text-center text-[11px]" style={{ color: colors.slate }}>
        <ShieldCheck size={13} color={colors.green} /> Aucun témoignage n’est publié sans validation de son auteur.
      </p>
    </section>
  );
}
