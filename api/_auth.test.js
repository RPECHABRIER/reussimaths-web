import test from "node:test";
import assert from "node:assert/strict";
import { requireSupabaseUser } from "./_auth.js";

function responseRecorder() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("refuse une requête sans Bearer token", async () => {
  const res = responseRecorder();
  const user = await requireSupabaseUser({ headers: {} }, res, { auth: {} });
  assert.equal(user, null);
  assert.equal(res.statusCode, 401);
});

test("refuse un token Supabase invalide", async () => {
  const res = responseRecorder();
  const client = { auth: { getUser: async () => ({ data: {}, error: new Error("invalid") }) } };
  const user = await requireSupabaseUser({ headers: { authorization: "Bearer bad-token" } }, res, client);
  assert.equal(user, null);
  assert.equal(res.statusCode, 401);
});

test("retourne uniquement l'utilisateur vérifié par Supabase", async () => {
  const res = responseRecorder();
  const expected = { id: "verified-user", email: "user@example.test" };
  const client = { auth: { getUser: async (token) => ({ data: { user: token === "valid-token" ? expected : null }, error: null }) } };
  const user = await requireSupabaseUser({ headers: { authorization: "Bearer valid-token" } }, res, client);
  assert.deepEqual(user, expected);
  assert.equal(res.statusCode, null);
});
