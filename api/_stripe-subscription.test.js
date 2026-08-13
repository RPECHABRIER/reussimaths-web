import test from "node:test";
import assert from "node:assert/strict";
import { getStripePeriodEndIso, getStripePeriodEndSeconds } from "./_stripe-subscription.js";

test("lit la période Stripe sur les anciennes réponses", () => {
  assert.equal(getStripePeriodEndSeconds({ current_period_end: 1_800_000_000 }), 1_800_000_000);
});

test("lit la période Stripe Dahlia sur les lignes d'abonnement", () => {
  const subscription = { items: { data: [{ current_period_end: 1_800_000_000 }, { current_period_end: 1_800_000_100 }] } };
  assert.equal(getStripePeriodEndSeconds(subscription), 1_800_000_100);
  assert.equal(getStripePeriodEndIso(subscription), new Date(1_800_000_100_000).toISOString());
});

test("refuse une réponse Stripe sans période exploitable", () => {
  assert.throws(() => getStripePeriodEndSeconds({ items: { data: [] } }), /Date de fin/);
});
