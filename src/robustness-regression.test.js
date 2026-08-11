import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { classifyLearningError } from "./lib/learningError.js";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("une erreur de révisions ne devient pas un faux état vide", async () => {
  const [tracking, page] = await Promise.all([
    read("./hooks/useSkillTracking.js"),
    read("./pages/Reviser.jsx"),
  ]);
  assert.match(tracking, /throw error/);
  assert.match(page, /!loadError && dueSkills\.length === 0/);
  assert.match(page, /Les révisions du jour n'ont pas pu être chargées/);
});

test("une erreur d'abonnement ne présente pas l'utilisateur comme gratuit", async () => {
  const [hook, account, chapter] = await Promise.all([
    read("./hooks/useProgress.js"),
    read("./pages/Account.jsx"),
    read("./pages/ChapterPage.jsx"),
  ]);
  assert.match(hook, /error, reload: load/);
  assert.match(account, /!isActive && !admin && !subscriptionLoading && !subscriptionError/);
  assert.match(chapter, /Impossible de vérifier ton accès à ce chapitre/);
});

test("les compteurs d'apprentissage utilisent des opérations atomiques", async () => {
  const [migration, tracking, practice, streak] = await Promise.all([
    read("../supabase/atomic-learning-migration-2026-08-09.sql"),
    read("./hooks/useSkillTracking.js"),
    read("./hooks/usePracticeTime.js"),
    read("./hooks/useDailyStreak.js"),
  ]);
  assert.match(tracking, /rpc\("record_learning_attempt"/);
  assert.match(practice, /rpc\("add_practice_seconds"/);
  assert.match(streak, /rpc\("mark_daily_practice"/);
  assert.match(migration, /attempts = sm\.attempts \+ 1/);
  assert.match(migration, /seconds = pt\.seconds \+ excluded\.seconds/);
  assert.doesNotMatch(migration, /create policy "skill_mastery: self read\/write"/);
  assert.match(migration, /create policy "skill_mastery: self read"/);
  assert.match(migration, /revoke all on function public\.record_learning_attempt[^;]+ from public/);
  assert.match(migration, /grant execute on function public\.record_learning_attempt[^;]+ to authenticated/);
});

test("une erreur client affiche un secours et remonte dans les journaux", async () => {
  const [main, boundary, reporter, endpoint] = await Promise.all([
    read("./main.jsx"),
    read("./components/AppErrorBoundary.jsx"),
    read("./lib/errorReporting.js"),
    read("../api/client-error.js"),
  ]);
  assert.match(main, /AppErrorBoundary/);
  assert.match(main, /installGlobalErrorReporting/);
  assert.match(boundary, /Ta progression reste enregistrée/);
  assert.match(reporter, /unhandledrejection/);
  assert.match(endpoint, /\[client-error\]/);
  assert.match(endpoint, /MAX_BODY_BYTES/);
});

test("la navigation élève reste disponible sans couvrir les exercices", async () => {
  const [app, dock, sound] = await Promise.all([read("./App.jsx"), read("./components/StudentDock.jsx"), read("./components/SoundManager.jsx")]);
  assert.match(app, /showStudentDock/);
  assert.match(app, /\/etape\//);
  assert.match(app, /\/chapitre\//);
  assert.match(dock, /Navigation élève/);
  assert.match(dock, /Réviser/);
  assert.match(dock, /Bilan/);
  assert.match(app, /avoidStudentDock=\{showStudentDock\}/);
  assert.match(sound, /bottom-24 sm:bottom-4/);
});

test("les droites graduées affichent toujours graduations, sens et point au-dessus", async () => {
  const [figure, decimals, fractions, relatives, auto6, auto5] = await Promise.all([
    read("./components/Figure.jsx"),
    read("./chapters/nombres-decimaux.js"),
    read("./chapters/fractions.js"),
    read("./chapters/nombres-relatifs.js"),
    read("./chapters/automatismes-sixieme.js"),
    read("./chapters/automatismes-cinquieme.js"),
  ]);
  assert.match(figure, /spec\.numberLine/);
  assert.match(figure, /tickCount/);
  assert.match(figure, /arrowEnd \?\? true/);
  assert.match(figure, /labelAbove/);
  for (const source of [decimals, fractions, relatives, auto6, auto5]) {
    assert.match(source, /numberLine:/);
  }
});

test("les repères cartésiens affichent toujours axes, flèches, graduations et coordonnées", async () => {
  const [figure, graph, relatives, transformations, reperage, equations] = await Promise.all([
    read("./components/Figure.jsx"),
    read("./components/Graph.jsx"),
    read("./chapters/nombres-relatifs.js"),
    read("./chapters/transformations-plan-troisieme.js"),
    read("./chapters/reperage-configurations-seconde.js"),
    read("./chapters/equations-droites-seconde.js"),
  ]);
  assert.match(figure, /spec\.coordinatePlane/);
  assert.match(figure, /Repère cartésien gradué/);
  assert.match(figure, /xTickCount/);
  assert.match(figure, /yTickCount/);
  assert.match(graph, /axis-arrow/);
  assert.match(graph, /markerEnd/);
  assert.match(graph, /xTicks\.map/);
  assert.match(graph, /yTicks\.map/);
  for (const source of [relatives, transformations, reperage, equations]) {
    assert.match(source, /coordinatePlane:/);
  }
});

test("tous les accès à l'essai commencent au niveau choisi, au programme puis au diagnostic", async () => {
  const [app, home, teacher, levels, programme, diagnostic, prerequisites, parcours] = await Promise.all([
    read("./App.jsx"),
    read("./pages/CycleSelect.jsx"),
    read("./pages/Enseignant.jsx"),
    read("./pages/LevelSelect.jsx"),
    read("./pages/ClassProgramme.jsx"),
    read("./pages/ParcoursDiagnostic.jsx"),
    read("./lib/prerequisites.js"),
    read("./parcours.js"),
  ]);
  assert.match(home, /Commencer gratuitement/);
  assert.doesNotMatch(home, /code pilote/);
  assert.doesNotMatch(home, /to="\/parcours\/decouverte"/);
  assert.doesNotMatch(teacher, /to="\/parcours\/decouverte"/);
  assert.match(app, /ClassProgramme/);
  assert.match(levels, /objectif=essai/);
  assert.match(levels, /\/programme\?objectif=essai/);
  assert.match(programme, /En cours/);
  assert.match(programme, /Déjà vu/);
  assert.match(programme, /tester mes acquis précédents/);
  assert.match(diagnostic, /getSelectedStudyChapterIds/);
  assert.match(diagnostic, /Faire ma série gratuite/);
  assert.match(prerequisites, /PREVIOUS_LEVEL/);
  assert.match(parcours, /getTrialParcours/);
  assert.match(parcours, /stableProgressIndex/);
});

test("les erreurs numériques sont catégorisées sans conserver la réponse brute", () => {
  const exercise = { type: "numeric", answer: 12 };
  assert.equal(classifyLearningError(exercise, "-12"), "sign_error");
  assert.equal(classifyLearningError(exercise, "120"), "place_value_error");
  assert.equal(classifyLearningError(exercise, "12,05"), "rounding_error");
});

test("tous les parcours numériques permettent les nombres négatifs et expliquent les erreurs", async () => {
  const [chapter, automatismes, duel, diagnostic, explanation, pedagogy] = await Promise.all([
    read("./components/ChapterRunner.jsx"),
    read("./components/AutomatismesRunner.jsx"),
    read("./components/MiniDuel.jsx"),
    read("./pages/ParcoursDiagnostic.jsx"),
    read("./components/LearningFeedback.jsx"),
    read("./lib/pedagogicalFeedback.js"),
  ]);
  for (const source of [chapter, automatismes, duel, diagnostic]) {
    assert.match(source, /"±"/);
    assert.match(source, /LearningFeedback/);
  }
  assert.match(diagnostic, /Ajouter ou retirer le signe moins/);
  assert.match(pedagogy, /son signe est inversé/);
  assert.match(pedagogy, /décalage de virgule ou de valeur de position/);
  assert.match(explanation, /Comprendre/);
  assert.match(explanation, /résultat recherché est un nombre négatif/);
  assert.match(explanation, /Méthode à retenir/);
});

test("une erreur déclenche une vérification proche et priorise les erreurs récurrentes", async () => {
  const [runner, tracking, review, chapterPage] = await Promise.all([
    read("./components/ChapterRunner.jsx"),
    read("./hooks/useSkillTracking.js"),
    read("./pages/Reviser.jsx"),
    read("./pages/ChapterPage.jsx"),
  ]);
  assert.match(runner, /practiceSimilar/);
  assert.match(runner, /generateMatchingSkill\(chapter, effectiveDifficulty, skill\)/);
  assert.match(runner, /Question de vérification — même notion, nouvelles données/);
  assert.match(tracking, /getRecurringErrors/);
  assert.match(tracking, /item\.count >= 2/);
  assert.match(review, /Priorité :/);
  assert.match(review, /recurring\.count/);
  assert.match(chapterPage, /focusError/);
});

test("la mesure produit et les retours restent minimaux", async () => {
  const [analytics, endpoint, feedback] = await Promise.all([read("./lib/productAnalytics.js"), read("../api/product-event.js"), read("../api/pilot-feedback.js")]);
  assert.match(analytics, /anonymousId/);
  assert.doesNotMatch(analytics, /user\.email|email:/);
  assert.match(endpoint, /ALLOWED_EVENTS/);
  assert.match(feedback, /slice\(0, 2000\)/);
});

test("le cahier pédagogique se synchronise sans réponse brute et avec isolation par compte", async () => {
  const history = await read("./lib/learningReviewHistory.js");
  const feedback = await read("./components/LearningFeedback.jsx");
  const migration = await read("../supabase/learning-review-cards-migration-2026-08-11.sql");
  assert.match(history, /response:\s*_response/);
  assert.match(feedback, /learning_review_cards/);
  assert.match(migration, /auth\.uid\(\) = user_id/g);
  assert.match(migration, /enable row level security/i);
  assert.match(migration, /revoke all on table public\.learning_review_cards from anon/i);
});

test("chaque correction possède désormais un support visuel, même hors familles illustrées", async () => {
  const visual = await read("./components/FeedbackVisual.jsx");
  assert.match(visual, /Le chemin de la méthode/);
  assert.match(visual, /family\.startsWith\("geometry"\)/);
  assert.match(visual, /calculus_derivative/);
  assert.match(visual, /exponential_logarithm/);
});

test("l’administration classe les notions fragiles et les corrections consultées", async () => {
  const admin = await read("./pages/AdminPreview.jsx");
  const migration = await read("../supabase/learning-review-admin-policy-2026-08-11.sql");
  assert.match(admin, /fragileSkills/);
  assert.match(admin, /reviewFamilies/);
  assert.match(admin, /Corrections les plus consultées/);
  assert.match(migration, /learning_review_cards: admin read/);
  assert.match(migration, /auth\.jwt\(\).*email/);
});

test("la conversion CM2 de 2,5 m affiche le tableau de longueurs et une méthode complète", async () => {
  const [diagnostic, showcase] = await Promise.all([
    read("./diagnostics/cm2.js"),
    read("./discoveryShowcases.js"),
  ]);
  for (const source of [diagnostic, showcase]) {
    assert.match(source, /Convertis 2,5 m en centimètres/);
    assert.match(source, /conversionTable:\s*\{ kind: "length", value: 2\.5, fromUnit: "m", toUnit: "cm", answer: 250 \}/);
    assert.match(source, /chiffre des unités, ici 2/);
  }
});
