import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { isAcceptedProductEvent } from "../api/_product-events.js";
import { teacherQuestionProperties, teacherSeriesProperties } from "../src/lib/teacherAnalytics.js";

const anonymousId = "b3b2de42-2e6a-4dcc-8d8f-d4ac93872b31";
const readTeacherPage = () => readFile(new URL("../src/pages/Enseignant.jsx", import.meta.url), "utf8");

test("les sessions 5e et 4e utilisent les identifiants canoniques", () => {
  assert.deepEqual(teacherSeriesProperties("cinquieme", 5), { levelId: "cinquieme", questionCount: 5 });
  assert.deepEqual(teacherSeriesProperties("quatrieme", 10), { levelId: "quatrieme", questionCount: 10 });
});

test("une question affichée utilise un index humain et aucune donnée pédagogique", () => {
  assert.deepEqual(teacherQuestionProperties("cinquieme", 0, 5), { levelId: "cinquieme", questionIndex: 1, questionCount: 5 });
  assert.deepEqual(teacherQuestionProperties("quatrieme", 3, 10), { levelId: "quatrieme", questionIndex: 4, questionCount: 10 });
  const properties = teacherQuestionProperties("quatrieme", 3, 10);
  for (const forbidden of ["prompt", "answer", "response", "email", "userId", "school", "className"]) {
    assert.equal(Object.hasOwn(properties, forbidden), false, forbidden);
  }
});

test("les trois événements enseignant sont acceptés sans élargir les événements inconnus", () => {
  for (const eventName of ["teacher_session_started", "teacher_question_viewed", "teacher_questions_regenerated"]) {
    assert.equal(isAcceptedProductEvent(eventName, anonymousId), true, eventName);
  }
  assert.equal(isAcceptedProductEvent("teacher_answer_recorded", anonymousId), false);
});

test("le diaporama mesure lancement, affichage unique et régénération sans heartbeat", async () => {
  const source = await readTeacherPage();
  assert.match(source, /trackProductEvent\("teacher_session_started", teacherSeriesProperties\(levelId, exercises\.length\)\)/);
  assert.match(source, /trackProductEvent\("teacher_question_viewed", teacherQuestionProperties\(levelId, index, exercises\.length\)\)/);
  assert.match(source, /trackProductEvent\("teacher_questions_regenerated", teacherSeriesProperties\(levelId, questionCount\)\)/);
  assert.match(source, /viewedTeacherQuestionsRef\.current\.has\(viewKey\)/);
  assert.match(source, /teacherSeriesRunRef\.current \+= 1/);
  assert.doesNotMatch(source, /teacher_(?:heartbeat|answer|correction|student)/);
  assert.doesNotMatch(source, /teacher_fullscreen_started/);
});

test("la navigation existante reste suivante uniquement et la relance compte une nouvelle série", async () => {
  const source = await readTeacherPage();
  assert.match(source, /const next = \(\) =>/);
  assert.doesNotMatch(source, /const previous =|teacher_question_previous/);
  assert.match(source, /const restartSameParams = \(\) => \{\s*startProjection\(\)/);
  assert.match(source, /onClick=\{startProjection\}/);
});
