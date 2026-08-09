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

test("tous les accès à l'essai commencent au niveau choisi et au diagnostic", async () => {
  const [home, teacher, levels, diagnostic, parcours] = await Promise.all([
    read("./pages/CycleSelect.jsx"),
    read("./pages/Enseignant.jsx"),
    read("./pages/LevelSelect.jsx"),
    read("./pages/ParcoursDiagnostic.jsx"),
    read("./parcours.js"),
  ]);
  assert.match(home, /Commencer gratuitement/);
  assert.doesNotMatch(home, /code pilote/);
  assert.doesNotMatch(home, /to="\/parcours\/decouverte"/);
  assert.doesNotMatch(teacher, /to="\/parcours\/decouverte"/);
  assert.match(levels, /objectif=essai/);
  assert.match(levels, /\/diagnostic\?objectif=essai/);
  assert.match(diagnostic, /Faire ma série gratuite/);
  assert.match(parcours, /getTrialParcours/);
});

test("les erreurs numériques sont catégorisées sans conserver la réponse brute", () => {
  const exercise = { type: "numeric", answer: 12 };
  assert.equal(classifyLearningError(exercise, "-12"), "sign_error");
  assert.equal(classifyLearningError(exercise, "120"), "place_value_error");
  assert.equal(classifyLearningError(exercise, "12,05"), "rounding_error");
});

test("la mesure produit et les retours restent minimaux", async () => {
  const [analytics, endpoint, feedback] = await Promise.all([read("./lib/productAnalytics.js"), read("../api/product-event.js"), read("../api/pilot-feedback.js")]);
  assert.match(analytics, /anonymousId/);
  assert.doesNotMatch(analytics, /user\.email|email:/);
  assert.match(endpoint, /ALLOWED_EVENTS/);
  assert.match(feedback, /slice\(0, 2000\)/);
});
