import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const API_FILES = [
  "create-checkout-session.js",
  "cancel-subscription.js",
  "admin-grant-access.js",
  "admin-class-codes.js",
  "notify-challenge.js",
  "checkout-status.js",
  "create-customer-portal.js",
  "pilot-feedback.js",
];

test("tous les endpoints sensibles exigent un utilisateur Supabase vérifié", async () => {
  for (const file of API_FILES) {
    const source = await readFile(new URL(`../api/${file}`, import.meta.url), "utf8");
    assert.match(source, /requireSupabaseUser\(req, res, supabaseAdmin\)/, file);
  }
});

test("le paiement évite les doublons, conserve le consentement et synchronise précisément l'accès", async () => {
  const [checkout, status, portal, webhook, migration] = await Promise.all([
    readFile(new URL("../api/create-checkout-session.js", import.meta.url), "utf8"),
    readFile(new URL("../api/checkout-status.js", import.meta.url), "utf8"),
    readFile(new URL("../api/create-customer-portal.js", import.meta.url), "utf8"),
    readFile(new URL("../api/stripe-webhook.js", import.meta.url), "utf8"),
    readFile(new URL("../supabase/prelaunch-conversion-learning-2026-08-09.sql", import.meta.url), "utf8"),
  ]);
  assert.match(checkout, /Un accès équivalent est déjà actif/);
  assert.match(checkout, /idempotencyKey/);
  assert.match(checkout, /purchase_consents/);
  assert.match(checkout, /CHECKOUT_SESSION_ID/);
  assert.match(status, /session\.client_reference_id !== user\.id/);
  assert.match(status, /subscription\?\.plan === expectedPlan/);
  assert.match(status, /new Date\(subscription\.current_period_end\) > new Date\(\)/);
  assert.match(portal, /billingPortal\.sessions\.create/);
  assert.match(webhook, /stripe\.subscriptions\.retrieve\(subscriptionId\)/);
  assert.match(webhook, /row\.current_period_end/);
  assert.match(webhook, /row\.cancel_at_period_end/);
  assert.match(webhook, /subscription_activated/);
  assert.match(webhook, /pack_examen_activated/);
  assert.match(webhook, /claimEvent\(event\.id\)/);
  assert.match(webhook, /source: "stripe_webhook"/);
  assert.match(migration, /immediate_access_accepted boolean not null check/);
});

test("Apple reste masqué tant que son OAuth n'est pas explicitement activé", async () => {
  const [account, envExample] = await Promise.all([
    readFile(new URL("../src/pages/Account.jsx", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);
  assert.match(account, /VITE_APPLE_AUTH_ENABLED === "true"/);
  assert.match(account, /APPLE_AUTH_ENABLED && <button/);
  assert.match(envExample, /VITE_APPLE_AUTH_ENABLED=false/);
});

test("les invitations classe suivent la durée choisie et restent réservées à l'admin", async () => {
  const [migration, endpoint] = await Promise.all([
    readFile(new URL("../supabase/class-invitations-admin-duration-migration-2026-08-09.sql", import.meta.url), "utf8"),
    readFile(new URL("../api/admin-class-codes.js", import.meta.url), "utf8"),
  ]);
  assert.match(migration, /class_access_redemptions/);
  assert.match(migration, /v_code\.expires_at/);
  assert.match(migration, /v_code\.max_redemptions/);
  assert.match(migration, /class_access_expires_at/);
  assert.match(migration, /v_code\.expires_at/);
  assert.doesNotMatch(migration, /least\s*\([^)]*interval '7 days'/s);
  assert.match(endpoint, /caller\.email\?\.toLowerCase\(\) !== ADMIN_EMAIL/);
  assert.match(endpoint, /crypto\.randomBytes/);
});

test("aucun endpoint sensible ne récupère l'identité de l'appelant dans le body", async () => {
  for (const file of API_FILES) {
    const source = await readFile(new URL(`../api/${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /const\s*\{[^}]*\b(?:userId|adminUserId|fromUserId)\b[^}]*\}\s*=\s*req\.body/, file);
  }
});

test("le schéma social ne conserve pas les anciennes policies permissives", async () => {
  const schema = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
  assert.doesNotMatch(schema, /friendships: self read\/write/);
  assert.doesNotMatch(schema, /challenges: participants update/);
  assert.doesNotMatch(schema, /referrals: referred user creates own row/);
  assert.match(schema, /accept_friend_request/);
  assert.match(schema, /submit_challenge_response/);
  assert.match(schema, /register_referral/);
});
