import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_COURSES, SITE_URL, coursePath } from "../src/seo/publicPages.js";
import { CYCLE_LANDINGS, LEVEL_LANDINGS } from "../src/seo/landingPages.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const template = await readFile(join(dist, "index.html"), "utf8");

const levels = [
  ["sixieme", "6e", "college"], ["cinquieme", "5e", "college"], ["quatrieme", "4e", "college"], ["troisieme", "3e", "college"],
  ["seconde", "2nde", "lycee"], ["premiere-spe", "Première spécialité", "lycee"], ["premiere-non-spe", "Première non spécialité", "lycee"],
  ["premiere-techno", "Première technologique", "lycee"], ["terminale-spe", "Terminale spécialité", "lycee"], ["terminale-techno", "Terminale technologique", "lycee"],
];

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function headFor({ title, description, path, jsonLd }) {
  const canonical = `${SITE_URL}${path}`;
  return template
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`)
    .replace("</head>", `${jsonLd ? `<script type="application/ld+json" data-reussimaths-seo="jsonld">${JSON.stringify(jsonLd).replaceAll("<", "\\u003c")}</script>` : ""}</head>`);
}

function shell(content) {
  return `<div style="max-width:900px;margin:0 auto;padding:32px 20px;font-family:Inter,Arial,sans-serif;color:#1B2A4A"><a href="/">RéussiMaths</a>${content}</div>`;
}

async function emit(path, metadata, body) {
  const output = path === "/" ? join(dist, "index.html") : join(dist, path.slice(1), "index.html");
  await mkdir(dirname(output), { recursive: true });
  const html = headFor(metadata).replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  await writeFile(output, html);
}

const homeDescription = "Progresse en maths avec un diagnostic, des exercices ciblés, des corrections détaillées et des révisions adaptées du collège au lycée.";
await emit("/", { title: "RéussiMaths — exercices de maths collège et lycée", description: homeDescription, path: "/", jsonLd: { "@context": "https://schema.org", "@graph": [{ "@type": "Organization", name: "RéussiMaths", url: SITE_URL }, { "@type": "WebSite", name: "RéussiMaths", url: SITE_URL, inLanguage: "fr" }] } }, shell(`<main><h1>Progresse en maths du collège au lycée</h1><p>${homeDescription}</p><h2>Un entraînement adapté à ce que tu fais en classe</h2><p>RéussiMaths repère les difficultés, propose une aide étape par étape et vérifie ensuite que la méthode peut être réutilisée sans aide. Les corrections expliquent le raisonnement au lieu de donner seulement le résultat.</p><h2>Choisir un niveau</h2><p><a href="/college">Maths au collège</a> · <a href="/lycee">Maths au lycée</a></p><ul>${levels.map(([id, name]) => `<li><a href="/niveau/${id}">Cours et exercices de maths ${escapeHtml(name)}</a></li>`).join("")}</ul><h2>Cours gratuits et exercices corrigés</h2><ul>${PUBLIC_COURSES.map((page) => `<li><a href="${coursePath(page)}">${escapeHtml(page.title)}</a></li>`).join("")}</ul><p><a href="/enseignant">Espace enseignant gratuit</a></p></main>`));

for (const cycle of ["college", "lycee"]) {
  const landing = CYCLE_LANDINGS[cycle];
  const cycleLevels = levels.filter((entry) => entry[2] === cycle);
  const path = `/${cycle}`;
  await emit(path, { title: landing.title, description: landing.description, path }, shell(`<main><h1>${escapeHtml(landing.h1)}</h1><p>${escapeHtml(landing.intro)}</p><p>${escapeHtml(landing.details)}</p><h2>Choisir une classe</h2><ul>${cycleLevels.map(([id, name]) => `<li><a href="/niveau/${id}">Programme, cours et exercices de maths ${escapeHtml(name)}</a></li>`).join("")}</ul><h2>Notions à travailler</h2><ul>${landing.topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}</ul></main>`));
}

for (const [id, name, cycle] of levels) {
  const landing = LEVEL_LANDINGS[id];
  const path = `/niveau/${id}`;
  const courseLinks = PUBLIC_COURSES.filter((page) => page.levelId === id).map((page) => `<li><a href="${coursePath(page)}">${escapeHtml(page.title)}</a></li>`).join("");
  await emit(path, { title: landing.title, description: landing.description, path }, shell(`<nav><a href="/${cycle}">Maths ${cycle === "college" ? "collège" : "lycée"}</a></nav><main><h1>${escapeHtml(landing.h1)}</h1><p>${escapeHtml(landing.intro)}</p><p>${escapeHtml(landing.method)}</p><h2>Notions à travailler en ${escapeHtml(landing.name)}</h2><ul>${landing.topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join("")}</ul>${courseLinks ? `<h2>Cours gratuits et exercices corrigés</h2><ul>${courseLinks}</ul>` : ""}<p>Choisis un chapitre pour commencer un entraînement adapté, obtenir des aides et consulter une correction détaillée.</p></main>`));
}

for (const page of PUBLIC_COURSES) {
  const path = coursePath(page);
  const jsonLd = { "@context": "https://schema.org", "@graph": [{ "@type": "LearningResource", name: page.title, description: page.description, educationalLevel: page.levelLabel, inLanguage: "fr", url: `${SITE_URL}${path}`, provider: { "@type": "Organization", name: "RéussiMaths", url: SITE_URL } }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL }, { "@type": "ListItem", position: 2, name: `Maths ${page.levelLabel}`, item: `${SITE_URL}/niveau/${page.levelId}` }, { "@type": "ListItem", position: 3, name: page.title, item: `${SITE_URL}${path}` }] }] };
  const relatedLinks = page.relatedLinks?.map((link) => `<li><a href="${escapeHtml(link.path)}">${escapeHtml(link.label)}</a></li>`).join("") ?? "";
  const body = shell(`<nav><a href="/">Accueil</a> › <a href="/niveau/${page.levelId}">Maths ${page.levelLabel}</a></nav><main><h1>${escapeHtml(page.h1 ?? page.title)}</h1><p>${escapeHtml(page.intro)}</p><h2>Objectifs du cours</h2><ul>${page.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul><h2>L’essentiel à retenir</h2>${page.rules.map((rule) => `<section><h3>${escapeHtml(rule.title)}</h3><p>${escapeHtml(rule.text)}</p>${rule.formula ? `<p>${escapeHtml(rule.formula)}</p>` : ""}</section>`).join("")}<h2>Exercices corrigés</h2>${page.exercises.map((exercise, index) => `<article><h3>Exercice ${index + 1}</h3><p>${escapeHtml(exercise.question)}</p><details><summary>Voir la correction</summary><p>${escapeHtml(exercise.answer)}</p></details></article>`).join("")}<p><a href="/chapitre/${page.chapterId}">${escapeHtml(page.ctaLabel ?? "Continuer l’entraînement dans RéussiMaths")}</a></p>${relatedLinks ? `<nav aria-label="Cours associés"><h2>Pour continuer</h2><ul>${relatedLinks}</ul></nav>` : ""}</main>`);
  await emit(path, { title: `${page.title} | RéussiMaths`, description: page.description, path, jsonLd }, body);
}

const teacherPath = "/enseignant";
const teacherDescription = "Créez gratuitement un rituel de 5 automatismes de maths, prêt à projeter en classe avec corrections détaillées.";
await emit(teacherPath, {
  title: "Automatismes de maths à projeter en classe | RéussiMaths",
  description: teacherDescription,
  path: teacherPath,
}, shell(`<nav><a href="/">Accueil</a></nav><main><h1>Votre rituel de maths, prêt à projeter</h1><p>${teacherDescription}</p><h2>Cinq automatismes pour commencer le cours</h2><p>Choisissez une classe du collège ou du lycée et cinq questions. Projetez d’abord les énoncés sans réponse, laissez les élèves chercher, puis affichez les corrections détaillées en fin de séance.</p><h2>Un support gratuit et sans compte élève</h2><p>Le rituel peut servir d’échauffement, de réactivation ou de vérification rapide des prérequis. Aucun compte élève n’est nécessaire pour projeter la séance.</p><p><a href="/enseignant">Créer une séance gratuite</a> · <a href="/niveaux?objectif=essai">Découvrir l’expérience élève</a></p></main>`));

const sitemapPaths = ["/", "/college", "/lycee", ...levels.map(([id]) => `/niveau/${id}`), ...PUBLIC_COURSES.map(coursePath), "/enseignant"];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(join(dist, "sitemap.xml"), sitemap);

console.log(`SEO: ${sitemapPaths.length} URLs indexables, ${PUBLIC_COURSES.length} cours publics pré-rendus.`);
