import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_COURSES, SITE_URL, coursePath } from "../src/seo/publicPages.js";

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
await emit("/", { title: "RéussiMaths — exercices de maths collège et lycée", description: homeDescription, path: "/", jsonLd: { "@context": "https://schema.org", "@graph": [{ "@type": "Organization", name: "RéussiMaths", url: SITE_URL }, { "@type": "WebSite", name: "RéussiMaths", url: SITE_URL, inLanguage: "fr" }] } }, shell(`<main><h1>Progresse en maths du collège au lycée</h1><p>${homeDescription}</p><p><a href="/college">Maths au collège</a> · <a href="/lycee">Maths au lycée</a> · <a href="/enseignant">Espace enseignant gratuit</a></p></main>`));

for (const cycle of ["college", "lycee"]) {
  const label = cycle === "college" ? "collège" : "lycée";
  const cycleLevels = levels.filter((entry) => entry[2] === cycle);
  const path = `/${cycle}`;
  const description = `Cours, exercices corrigés et entraînements de maths pour les élèves de ${label}, conformes aux programmes scolaires.`;
  await emit(path, { title: `Maths ${label} : cours et exercices corrigés | RéussiMaths`, description, path }, shell(`<main><h1>Maths au ${label}</h1><p>${description}</p><ul>${cycleLevels.map(([id, name]) => `<li><a href="/niveau/${id}">Programme de maths ${escapeHtml(name)}</a></li>`).join("")}</ul></main>`));
}

for (const [id, name, cycle] of levels) {
  const path = `/niveau/${id}`;
  const description = `Programme de maths ${name} : chapitres, cours gratuits, exercices corrigés et entraînements adaptés avec RéussiMaths.`;
  const courseLinks = PUBLIC_COURSES.filter((page) => page.levelId === id).map((page) => `<li><a href="${coursePath(page)}">${escapeHtml(page.title)}</a></li>`).join("");
  await emit(path, { title: `Maths ${name} : programme, cours et exercices | RéussiMaths`, description, path }, shell(`<nav><a href="/${cycle}">Maths ${cycle === "college" ? "collège" : "lycée"}</a></nav><main><h1>Programme de maths ${escapeHtml(name)}</h1><p>${description}</p>${courseLinks ? `<h2>Cours gratuits</h2><ul>${courseLinks}</ul>` : ""}<p>L’application interactive est disponible sur cette page.</p></main>`));
}

for (const page of PUBLIC_COURSES) {
  const path = coursePath(page);
  const jsonLd = { "@context": "https://schema.org", "@graph": [{ "@type": "LearningResource", name: page.title, description: page.description, educationalLevel: page.levelLabel, inLanguage: "fr", url: `${SITE_URL}${path}`, provider: { "@type": "Organization", name: "RéussiMaths", url: SITE_URL } }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL }, { "@type": "ListItem", position: 2, name: `Maths ${page.levelLabel}`, item: `${SITE_URL}/niveau/${page.levelId}` }, { "@type": "ListItem", position: 3, name: page.title, item: `${SITE_URL}${path}` }] }] };
  const body = shell(`<nav><a href="/">Accueil</a> › <a href="/niveau/${page.levelId}">Maths ${page.levelLabel}</a></nav><main><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.intro)}</p><h2>L’essentiel à retenir</h2>${page.rules.map((rule) => `<h3>${escapeHtml(rule.title)}</h3><p>${escapeHtml(rule.text)}</p>`).join("")}<h2>Exercices corrigés</h2>${page.exercises.map((exercise, index) => `<article><h3>Exercice ${index + 1}</h3><p>${escapeHtml(exercise.question)}</p><details><summary>Voir la correction</summary><p>${escapeHtml(exercise.answer)}</p></details></article>`).join("")}<p><a href="/chapitre/${page.chapterId}">Continuer l’entraînement dans RéussiMaths</a></p></main>`);
  await emit(path, { title: `${page.title} | RéussiMaths`, description: page.description, path, jsonLd }, body);
}

const teacherPath = "/enseignant";
const teacherDescription = "Créez gratuitement un rituel de 5 automatismes de maths, prêt à projeter en classe avec corrections détaillées.";
await emit(teacherPath, {
  title: "Automatismes de maths à projeter en classe | RéussiMaths",
  description: teacherDescription,
  path: teacherPath,
}, shell(`<nav><a href="/">Accueil</a></nav><main><h1>Votre rituel de maths, prêt à projeter</h1><p>${teacherDescription}</p><p>Choisissez un niveau et cinq questions, projetez les énoncés sans réponse, puis affichez toutes les corrections en fin de séance.</p><p><a href="/enseignant">Créer une séance gratuite</a> · <a href="/niveaux?objectif=essai">Découvrir l’expérience élève</a></p></main>`));

const sitemapPaths = ["/", "/college", "/lycee", ...levels.map(([id]) => `/niveau/${id}`), ...PUBLIC_COURSES.map(coursePath), "/enseignant"];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(join(dist, "sitemap.xml"), sitemap);

console.log(`SEO: ${sitemapPaths.length} URLs indexables, ${PUBLIC_COURSES.length} cours publics pré-rendus.`);
