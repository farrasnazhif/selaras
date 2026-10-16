import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";
import { z } from "zod";
import { taskVariationRequestSchema, parseTaskVariation, variationFieldsSchema } from "../src/features/sesi/validations/task-variation.ts";

const valid = taskVariationRequestSchema.parse({
  lessonSubject: "Bahasa Indonesia", focus: "literasi", level: "1", grade: "2", blockMinutes: 15,
  source: { title: "Pasangkan bentuk", instruction: "Guru menjelaskan secara lisan.", kind: "picture-match", passage: "", questions: [], values: [0, 1, 2] },
});

test("UI-24: AI requests exclude identities/photos and output cannot change activity kind or low-level safeguards", () => {
  assert.equal(taskVariationRequestSchema.safeParse({ ...valid, students: ["Ayu"] }).success, false);
  assert.equal(taskVariationRequestSchema.safeParse({ ...valid, source: { ...valid.source, photo: "private" } }).success, false);
  assert.equal(taskVariationRequestSchema.safeParse({ ...valid, source: { ...valid.source, kind: "written", questions: ["Baca ini"], values: [] } }).success, false);
  assert.throws(() => parseTaskVariation({ ...valid.source, values: [7] }, valid));
  assert.throws(() => parseTaskVariation({ ...valid.source, kind: "count-match", values: [2] }, valid));
  assert.throws(() => parseTaskVariation({ ...valid.source, questions: ["Baca ini"] }, valid));
  assert.deepEqual(parseTaskVariation(valid.source, valid), valid.source);
  const schema = z.toJSONSchema(variationFieldsSchema);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.required?.length, 6);
});

function loadRoute({ user = true, configured = true, reserved = true, fail = false } = {}) {
  let calls = 0;
  let reservations = 0;
  const compiled = ts.transpileModule(readFileSync(new URL("../src/app/api/worksheets/variation/route.ts", import.meta.url), "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports: Record<string, unknown> = {};
  const modules: Record<string, unknown> = {
    "next/server": { NextResponse: { json: (body: unknown, init?: ResponseInit) => Response.json(body, init) } },
    "@/lib/env": { isSupabaseConfigured: () => configured },
    "@/lib/supabase/server": { createClient: async () => ({
      auth: { getUser: async () => ({ data: { user: user ? { id: "teacher" } : null }, error: null }) },
      rpc: () => { reservations++; return { abortSignal: async () => ({ data: reserved, error: null }) }; },
    }) },
    "@/features/sesi/validations/task-variation": { taskVariationRequestSchema },
    "@/features/sesi/api/task-variation.server": { generateTaskVariation: async () => { calls++; if (fail) throw new Error("provider secret must not leak"); return valid.source; } },
  };
  new Function("require", "exports", compiled)((name: string) => {
    assert.ok(name in modules, `Unexpected dependency: ${name}`);
    return modules[name];
  }, exports);
  const post = exports.POST as (request: Request & { nextUrl: URL }) => Promise<Response>;
  return {
    send: (body: unknown, origin = "https://selaras.test", nextHost = "selaras.test") => post(Object.assign(new Request("https://selaras.test/api/worksheets/variation", {
      method: "POST", headers: { origin, host: "selaras.test", "content-type": "application/json" }, body: JSON.stringify(body),
    }), { nextUrl: new URL(`https://${nextHost}/api/worksheets/variation`) })),
    calls: () => calls, reservations: () => reservations,
  };
}

test("UI-24: the paid AI route rejects anonymous, cross-origin, invalid, oversized, and over-quota requests before generation", async (t) => {
  const previousKey = process.env.OPENAI_API_KEY;
  const previousLimit = process.env.AI_DAILY_REQUEST_LIMIT;
  process.env.OPENAI_API_KEY = "unit-test-no-network";
  process.env.AI_DAILY_REQUEST_LIMIT = "1";
  t.after(() => {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousKey;
    if (previousLimit === undefined) delete process.env.AI_DAILY_REQUEST_LIMIT; else process.env.AI_DAILY_REQUEST_LIMIT = previousLimit;
  });
  for (const [options, body, origin, status] of [
    [{ user: false }, valid, "https://selaras.test", 401],
    [{}, valid, "https://other.test", 403],
    [{ configured: false }, valid, "https://selaras.test", 503],
    [{}, { ...valid, level: "0" }, "https://selaras.test", 400],
    [{}, { text: "x".repeat(40001) }, "https://selaras.test", 413],
    [{ reserved: false }, valid, "https://selaras.test", 429],
  ] as const) {
    const route = loadRoute(options);
    assert.equal((await route.send(body, origin)).status, status);
    assert.equal(route.calls(), 0);
    if (status !== 429) assert.equal(route.reservations(), 0);
  }
  const failed = loadRoute({ fail: true });
  const response = await failed.send(valid);
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /provider secret/);
  assert.equal(failed.reservations(), 1);
  const success = loadRoute();
  assert.equal((await success.send(valid)).status, 200);
  assert.equal(success.calls(), 1);
  assert.equal((await loadRoute().send(valid, "https://selaras.test", "localhost")).status, 200);
  process.env.AI_DAILY_REQUEST_LIMIT = "";
  const unconfigured = loadRoute();
  assert.equal((await unconfigured.send(valid)).status, 503);
  assert.equal(unconfigured.calls(), 0);
});

// Ensure the server-only module uses the documented Responses wire contract without a live request.
test("UI-24: provider calls are bounded, un-stored, schema-checked and reject refusal/incomplete responses", async (t) => {
  const compiled = ts.transpileModule(readFileSync(new URL("../src/features/sesi/api/task-variation.server.ts", import.meta.url), "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports: Record<string, unknown> = {};
  const require = createRequire(import.meta.url);
  const modules: Record<string, unknown> = {
    "server-only": {},
    "zod": require("zod"),
    "@/features/kelas/constants/preview": { phaseForGrade: () => "A" },
    "../validations/task-variation": { parseTaskVariation, variationFieldsSchema },
  };
  new Function("require", "exports", compiled)((name: string) => modules[name], exports);
  const generate = exports.generateTaskVariation as (request: typeof valid, signal: AbortSignal) => Promise<unknown>;
  const previous = globalThis.fetch;
  t.after(() => { globalThis.fetch = previous; });
  let responseBody: unknown = { status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(valid.source) }] }] };
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    assert.equal(body.store, false);
    assert.equal(body.max_output_tokens, 2000);
    assert.equal(body.text.format.strict, true);
    assert.ok(init?.signal);
    return Response.json(responseBody);
  };
  assert.deepEqual(await generate(valid, AbortSignal.timeout(1000)), valid.source);
  for (const invalid of [
    { status: "incomplete", output: [] },
    { status: "completed", output: [{ type: "message", content: [{ type: "refusal" }] }] },
    { status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: "invalid json" }] }] },
  ]) { responseBody = invalid; await assert.rejects(generate(valid, AbortSignal.timeout(1000))); }
});
