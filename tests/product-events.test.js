import test from "node:test";
import assert from "node:assert/strict";
import { cleanProductEventProperties, isAcceptedProductEvent } from "../api/_product-events.js";
import { getPageViewProperties } from "../src/lib/productAnalytics.js";

const anonymousId = "b3b2de42-2e6a-4dcc-8d8f-d4ac93872b31";

test("recovery_success et les événements du lot A sont acceptés", () => {
  for (const eventName of [
    "recovery_success", "exercise_started", "exercise_completed", "paywall_viewed",
    "subscription_activated", "pack_examen_activated",
  ]) assert.equal(isAcceptedProductEvent(eventName, anonymousId), true, eventName);
});

test("un événement non autorisé ou sans identifiant anonyme valide est rejeté", () => {
  assert.equal(isAcceptedProductEvent("student_answer", anonymousId), false);
  assert.equal(isAcceptedProductEvent("recovery_success", "not-a-uuid"), false);
});

test("les propriétés restent bornées et ne conservent que des scalaires", () => {
  const cleaned = cleanProductEventProperties({ answer: { raw: "secret" }, correct: true, chapterId: "x".repeat(200) });
  assert.deepEqual(cleaned.answer, null);
  assert.equal(cleaned.correct, true);
  assert.equal(cleaned.chapterId.length, 160);
});

test("les vues SEO sont qualifiées sans conserver de query string", () => {
  assert.deepEqual(
    getPageViewProperties("/cours/quatrieme/theoreme-pythagore", "https://www.google.fr/search?q=pythagore"),
    { contentType: "seo_course", levelId: "quatrieme", courseSlug: "theoreme-pythagore", source: "google" },
  );
  assert.deepEqual(getPageViewProperties("/niveau/sixieme", ""), { contentType: "seo_level", levelId: "sixieme", source: "direct" });
  assert.deepEqual(getPageViewProperties("/compte", "https://example.test/private?q=value"), {});
});
