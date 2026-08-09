import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const API_FILES = [
  "create-checkout-session.js",
  "cancel-subscription.js",
  "admin-grant-access.js",
  "admin-class-codes.js",
  "notify-challenge.js",
];

test("tous les endpoints sensibles exigent un utilisateur Supabase vérifié", async () => {
  for (const file of API_FILES) {
    const source = await readFile(new URL(file, import.meta.url), "utf8");
    assert.match(source, /requireSupabaseUser\(req, res, supabaseAdmin\)/, file);
  }
});

test("les invitations classe sont temporaires et administrées exclusivement par l'admin", async () => {
  const [migration, endpoint] = await Promise.all([
    readFile(new URL("../supabase/class-invitations-expiry-migration-2026-08-09.sql", import.meta.url), "utf8"),
    readFile(new URL("admin-class-codes.js", import.meta.url), "utf8"),
  ]);
  assert.match(migration, /class_access_redemptions/);
  assert.match(migration, /v_code\.expires_at/);
  assert.match(migration, /v_code\.max_redemptions/);
  assert.match(migration, /class_access_expires_at/);
  assert.match(migration, /interval '7 days'/);
  assert.match(endpoint, /caller\.email\?\.toLowerCase\(\) !== ADMIN_EMAIL/);
  assert.match(endpoint, /crypto\.randomBytes/);
});

test("aucun endpoint sensible ne récupère l'identité de l'appelant dans le body", async () => {
  for (const file of API_FILES) {
    const source = await readFile(new URL(file, import.meta.url), "utf8");
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
