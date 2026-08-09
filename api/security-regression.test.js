import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const API_FILES = [
  "create-checkout-session.js",
  "cancel-subscription.js",
  "admin-grant-access.js",
  "notify-challenge.js",
];

test("tous les endpoints sensibles exigent un utilisateur Supabase vérifié", async () => {
  for (const file of API_FILES) {
    const source = await readFile(new URL(file, import.meta.url), "utf8");
    assert.match(source, /requireSupabaseUser\(req, res, supabaseAdmin\)/, file);
  }
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
