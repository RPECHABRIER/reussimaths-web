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
  assert.match(figure, /projection \? 640 : 360/);
  assert.match(figure, /spec\.numberLine \? "15" : "11"/);
  const teacher = await read(".\/pages\/Enseignant.jsx");
  assert.match(teacher, /<Figure spec=\{exercise\.figure\} projection/);
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
  const [analytics, endpoint, feedback, admin, app, account, runner] = await Promise.all([read("./lib/productAnalytics.js"), read("../api/product-event.js"), read("../api/pilot-feedback.js"), read("./pages/AdminPreview.jsx"), read("./App.jsx"), read("./pages/Account.jsx"), read("./components/ChapterRunner.jsx")]);
  assert.match(analytics, /anonymousId/);
  assert.doesNotMatch(analytics, /user\.email|email:/);
  assert.match(endpoint, /ALLOWED_EVENTS/);
  assert.match(feedback, /slice\(0, 2000\)/);
  assert.match(endpoint, /account_cta_clicked/);
  assert.match(endpoint, /signup_completed/);
  assert.match(analytics, /SIGNUP_PENDING_KEY/);
  assert.match(app, /trackCompletedSignup/);
  assert.match(account, /markSignupStarted/);
  assert.match(runner, /account_cta_clicked/);
  assert.match(admin, /strictFunnel/);
  assert.match(admin, /Trois abandons prioritaires du tunnel/);
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

test("les conversions de longueurs, aires et volumes utilisent toutes leur tableau spécialisé", async () => {
  const sources = await Promise.all([
    read("./chapters/grandeurs-mesures.js"),
    read("./chapters/automatismes-sixieme.js"),
    read("./chapters/operations-decimaux.js"),
    read("./chapters/geometrie-espace.js"),
    read("./diagnostics/cm2.js"),
    read("./discoveryShowcases.js"),
  ]);
  const joined = sources.join("\n");
  assert.match(joined, /kind: "length"/);
  assert.match(joined, /kind: "area"/);
  assert.match(joined, /kind: "volume"/);
  for (const source of sources.filter((text) => /UNITES_(?:LONGUEUR|AIRE)|Convertis 2,5 m|unites\[iFrom\]/.test(text))) {
    assert.match(source, /conversionTable:/);
  }
});

test("deux séries gratuites successives changent de banque et évitent les doublons internes", async () => {
  const [step, runner] = await Promise.all([read("./pages/ParcoursStep.jsx"), read("./components/ChapterRunner.jsx")]);
  assert.match(step, /reussimaths_trial_runs_/);
  assert.match(step, /reussimaths_trial_chapter_/);
  assert.match(step, /trialRun > 0/);
  assert.match(runner, /seenPromptsRef/);
  assert.match(runner, /for \(let attempt = 0; attempt < 12; attempt\+\+\)/);
});

test("les familles non géométriques prioritaires possèdent une animation spécialisée", async () => {
  const visual = await read("./components/FeedbackVisual.jsx");
  for (const family of ["fraction_of_number", "whole_number_place_value", "arithmetic_order", "function_affine_coefficients", "distributivity", "percentage_conversion", "probability_contrary", "probability_tree", "probability_independence", "multiple_choice_reasoning", "number_theory", "combinatorics", "random_variables", "decimal_operations", "calculation_strategy", "compound_measures", "duration_calculation", "sequence_convergence", "integral_calculus", "real_number_sets", "space_vectors", "continuity_reasoning"]) {
    assert.match(visual, new RegExp(family));
  }
});

test("le bilan parental propose une période, un plan familial et une version imprimable", async () => {
  const bilan = await read("./pages/Bilan.jsx");
  assert.match(bilan, /formatWeekRange/);
  assert.match(bilan, /Imprimer ou enregistrer en PDF/);
  assert.match(bilan, /Le petit plan familial/);
  assert.match(bilan, /Une priorité, trois séances courtes/);
  assert.match(bilan, /Deux questions simples à poser à votre enfant/);
  const css = await read("./index.css");
  assert.match(css, /@page/);
  assert.match(css, /A4 portrait/);
  assert.match(css, /\.weekly-report \.report-card/);
  assert.match(css, /break-inside: avoid/);
});

test("le rituel enseignant permet de composer et partager une séance exacte", async () => {
  const teacher = await read("./pages/Enseignant.jsx");
  assert.match(teacher, /Trois propositions sont affichées par thème/);
  assert.match(teacher, /deriveSimpleNumericQuestion/);
  assert.match(teacher, /Propositions et bonne réponse/);
  assert.match(teacher, /moveSelected/);
  assert.match(teacher, /Votre séance est prête/);
  assert.match(teacher, /encodeSession/);
  assert.match(teacher, /decodeSession/);
  assert.match(teacher, /value\.length > 40000/);
  assert.match(teacher, /Titre de la séance/);
  assert.match(teacher, /PDF des questions/);
  assert.match(teacher, /PDF du corrigé/);
  assert.match(teacher, /Minuteur par question/);
  assert.match(teacher, /const percentage/);
  assert.match(teacher, /const fraction/);
  assert.match(teacher, /const equation/);
  assert.match(teacher, /const conversion/);
});

test("chaque abonné reçoit une série quotidienne de calcul mental chronométrée", async () => {
  const [page, generator, level, app, badge, migration] = await Promise.all([
    read("./pages/DailyMentalMath.jsx"), read("./lib/dailyMentalMath.js"), read("./pages/Niveau.jsx"),
    read("./App.jsx"), read("./components/CalculationModeBadge.jsx"), read("../supabase/daily-mental-math-migration-2026-08-11.sql"),
  ]);
  assert.match(page, /QUESTION_SECONDS = 18/);
  assert.match(page, /Question \{index\+1\} \/ 10/);
  assert.match(page, /isFullAccessSubscription/);
  assert.match(generator, /\[add,subtract,multiply,divide,add,subtract,multiply,divide\]/);
  assert.match(generator, /for\(let i=0;i<2;i\+=1\)/);
  assert.match(level, /Ton calcul mental du jour/);
  assert.match(app, /calcul-mental\/:levelId/);
  assert.match(badge, /Calcul mental/);
  assert.match(badge, /Calculatrice autorisée/);
  assert.match(migration, /auth\.uid\(\) = user_id/g);
  assert.match(migration, /revoke all on table public\.daily_mental_sessions from anon/);
  assert.match(page, /7 derniers jours/);
  assert.match(page, /30 derniers jours/);
  assert.match(page, /Mon objectif quotidien/);
  assert.match(page, /recommendedAdjustment/);
  assert.match(page, /bestScore/);
  assert.match(generator, /average>=8/);
  assert.match(migration, /attempts integer not null default 1/);
});

test("le parcours découverte affiche les égalités de fractions en LaTeX", async () => {
  const showcases = await read("./discoveryShowcases.js");
  assert.match(showcases, /\\\\dfrac\{x\}\{6\}=\\\\dfrac\{4\}\{3\}/);
  assert.doesNotMatch(showcases, /Thalès, x\/6 = 4\/3/);
});
