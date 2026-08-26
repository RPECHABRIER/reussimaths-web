import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, BookOpenCheck, CheckCircle2 } from "lucide-react";
import MathText from "../components/MathText";
import SeoHead from "../components/SeoHead";
import { coursePath, getPublicCourse, SITE_URL } from "../seo/publicPages";
import { colors, fonts, shadow } from "../theme";

export default function PublicCoursePage() {
  const { levelId, slug } = useParams();
  const page = getPublicCourse(levelId, slug);
  if (!page) return <Navigate to="/" replace />;
  const path = coursePath(page);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "LearningResource", name: page.title, description: page.description, educationalLevel: page.levelLabel, inLanguage: "fr", url: `${SITE_URL}${path}`, provider: { "@type": "Organization", name: "RéussiMaths", url: SITE_URL } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: `Maths ${page.levelLabel}`, item: `${SITE_URL}/niveau/${page.levelId}` },
        { "@type": "ListItem", position: 3, name: page.title, item: `${SITE_URL}${path}` },
      ] },
    ],
  };

  return (
    <div className="min-h-screen px-4 py-5 sm:px-8 sm:py-8" style={{ background: colors.bg, fontFamily: fonts.body, color: colors.ink }}>
      <SeoHead title={`${page.title} | RéussiMaths`} description={page.description} path={path} structuredData={structuredData} />
      <main className="mx-auto max-w-4xl">
        <nav aria-label="Fil d’Ariane" className="text-sm" style={{ color: colors.slate }}>
          <Link to="/">Accueil</Link> <span aria-hidden="true">›</span> <Link to={`/niveau/${page.levelId}`}>Maths {page.levelLabel}</Link>
        </nav>
        <header className="mt-6 rounded-[2rem] px-6 py-9 sm:px-10" style={{ background: colors.ink, color: colors.card, boxShadow: shadow.raised }}>
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: colors.gold }}>Cours gratuit · Programme de {page.levelLabel}</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl" style={{ fontFamily: fonts.display }}>{page.h1 ?? page.title}</h1>
          <p className="mt-5 max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,.78)" }}>{page.intro}</p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-labelledby="objectifs">
          <h2 id="objectifs" className="sr-only">Objectifs du cours</h2>
          {page.points.map((point) => <div key={point} className="flex items-start gap-2 rounded-2xl bg-white p-4" style={{ boxShadow: shadow.soft }}><CheckCircle2 className="mt-0.5 shrink-0" size={18} color={colors.green}/><span className="text-sm font-bold">{point}</span></div>)}
        </section>

        <section className="mt-10" aria-labelledby="cours">
          <h2 id="cours" className="text-2xl font-black" style={{ fontFamily: fonts.display }}>L’essentiel à retenir</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {page.rules.map((rule) => <article key={rule.title} className="rounded-3xl bg-white p-6" style={{ boxShadow: shadow.soft }}><h3 className="font-black">{rule.title}</h3><MathText as="p" text={rule.text} className="mt-2 text-sm leading-relaxed" style={{ color: colors.slate }}/>{rule.formula ? <MathText as="p" text={rule.formula} className="mt-3 overflow-x-auto rounded-xl px-3 py-2 text-sm" style={{ background: `${colors.gold}12` }}/> : null}</article>)}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="exercices">
          <h2 id="exercices" className="text-2xl font-black" style={{ fontFamily: fonts.display }}>Exercices corrigés</h2>
          <p className="mt-2 text-sm" style={{ color: colors.slate }}>Cherche chaque réponse avant d’ouvrir la correction.</p>
          <div className="mt-4 space-y-4">
            {page.exercises.map((exercise, index) => <article key={exercise.question} className="rounded-3xl bg-white p-5 sm:p-6" style={{ boxShadow: shadow.soft }}><h3 className="font-bold">Exercice {index + 1}</h3><MathText as="p" text={exercise.question} className="mt-2"/><details className="mt-4 rounded-2xl p-4" style={{ background: `${colors.green}10` }}><summary className="cursor-pointer font-bold" style={{ color: colors.green }}>Voir la correction</summary><MathText as="p" text={exercise.answer} className="mt-2 overflow-x-auto text-sm leading-relaxed"/></details></article>)}
          </div>
        </section>

        <aside className="mt-10 rounded-[2rem] p-6 text-center sm:p-9" style={{ background: `${colors.gold}18`, border: `1px solid ${colors.gold}45` }}>
          <BookOpenCheck className="mx-auto" color={colors.gold}/><h2 className="mt-3 text-2xl font-black">Passe du cours à la maîtrise</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed" style={{ color: colors.slate }}>Teste gratuitement cette notion avec 5 questions, des aides graduées et un bilan. Aucun compte ni carte bancaire nécessaire.</p><Link to={`/parcours/essai-${page.levelId}/etape/0?chapter=${encodeURIComponent(page.chapterId)}&trial_source=seo_course`} className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 font-black" style={{ background: colors.ink, color: colors.card }}>Teste-toi gratuitement sur cette notion <ArrowRight size={17}/></Link>
        </aside>
        {page.relatedLinks?.length ? <nav aria-label="Cours associés" className="mt-8 rounded-3xl bg-white p-5" style={{ boxShadow: shadow.soft }}><h2 className="font-black">Pour continuer</h2><div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm">{page.relatedLinks.map((link) => <Link key={link.path} to={link.path} className="underline underline-offset-4" style={{ color: colors.green }}>{link.label}</Link>)}</div></nav> : null}
        <footer className="mt-10 flex flex-wrap justify-center gap-5 pb-8 text-xs" style={{ color: colors.slate }}><Link to={`/niveau/${page.levelId}`}>Programme de {page.levelLabel}</Link><Link to="/enseignant">Espace enseignant</Link><Link to="/confidentialite">Confidentialité</Link></footer>
      </main>
    </div>
  );
}
