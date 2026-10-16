import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

if (!process.argv.includes("--confirm-development")) throw new Error("Use --confirm-development with a confirmed disposable development target.");
for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SERVICE_ROLE_KEY"]) {
  assert.ok(process.env[key], `Configure ${key} in .env.local.`);
}
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, options);
const makeClient = () => createClient(url, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, options);
const users = [];
const clients = [];
try {
  for (let index = 0; index < 2; index++) {
    const email = `selaras-isolation-${randomUUID()}@example.com`;
    const password = `${randomUUID()}Aa9!`;
    const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    assert.ifError(created.error);
    assert.ok(created.data.user);
    users.push(created.data.user.id);
    const client = makeClient();
    clients.push(client);
    assert.ifError((await client.auth.signInWithPassword({ email, password })).error);
  }
  const [alice, bob] = clients;
  const [aliceId, bobId] = users;
  const inserted = await alice.from("teacher_workspaces").insert({}).select().single();
  assert.ifError(inserted.error);
  assert.equal(inserted.data.user_id, aliceId);
  assert.equal(inserted.data.revision, 1);
  const read = await bob.from("teacher_workspaces").select().eq("user_id", aliceId);
  assert.ifError(read.error);
  assert.deepEqual(read.data, []);
  const stolen = await bob.from("teacher_workspaces").update({ state: inserted.data.state }).eq("user_id", aliceId).select();
  assert.ifError(stolen.error);
  assert.deepEqual(stolen.data, []);
  assert.ok((await bob.from("teacher_workspaces").insert({ user_id: aliceId })).error);
  assert.ok((await alice.from("teacher_workspaces").update({ user_id: bobId }).eq("user_id", aliceId)).error);
  assert.ok((await alice.from("teacher_workspaces").update({ revision: 100 }).eq("user_id", aliceId)).error);
  assert.ok((await alice.from("teacher_workspaces").update({ state: {} }).eq("user_id", aliceId)).error);
  const anon = await makeClient().from("teacher_workspaces").select();
  assert.ok(anon.error || anon.data.length === 0);
  const updated = await alice.from("teacher_workspaces").update({ state: inserted.data.state }).eq("user_id", aliceId).eq("revision", 1).select().single();
  assert.ifError(updated.error);
  assert.equal(updated.data.revision, 2);
  const stale = await alice.from("teacher_workspaces").update({ state: inserted.data.state }).eq("user_id", aliceId).eq("revision", 1).select();
  assert.ifError(stale.error);
  assert.deepEqual(stale.data, []);
  const reservations = await Promise.all([1, 2].map(() => alice.rpc("reserve_task_variation", { request_limit: 1 })));
  reservations.forEach((result) => assert.ifError(result.error));
  assert.deepEqual(reservations.map((result) => result.data).sort(), [false, true]);
  assert.equal((await bob.rpc("reserve_task_variation", { request_limit: 1 })).data, true);
  assert.ok((await alice.from("task_variation_usage").select()).error);
  assert.ok((await makeClient().rpc("reserve_task_variation", { request_limit: 1 })).error);
  console.log("Passed: teacher isolation, owner-derived inserts, immutable ownership/revisions, stale-write rejection, anonymous denial and atomic per-teacher AI quota. No paid requests made.");
} finally {
  await Promise.all(clients.map((client) => client.auth.signOut()));
  for (const id of users) {
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) console.error(`Remove disposable isolation account ${id} manually.`);
  }
}
