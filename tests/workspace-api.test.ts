import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import { emptyWorkspace, workspaceSchema, workspaceForStorage } from "../src/features/shared/validations/workspace.ts";

function loadApi() {
  const calls: [string, unknown][] = [];
  let result: { data: { revision: number } | null; error: Error | null } = { data: { revision: 2 }, error: null };
  const builder = {
    update(input: unknown) { calls.push(["update", input]); return this; },
    eq(field: string, value: unknown) { calls.push([field, value]); return this; },
    select() { return this; },
    maybeSingle: async () => result,
  };
  const modules: Record<string, unknown> = {
    "@/lib/supabase/client": { createClient: () => ({ from: (table: string) => { assert.equal(table, "teacher_workspaces"); return builder; } }) },
    "../validations/workspace": { workspaceSchema, workspaceForStorage },
  };
  const exports: Record<string, unknown> = {};
  const compiled = ts.transpileModule(readFileSync(new URL("../src/features/shared/api/workspace.ts", import.meta.url), "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function("require", "exports", compiled)((name: string) => modules[name], exports);
  return {
    save: exports.saveWorkspace as (user: string, revision: number, state: typeof emptyWorkspace) => Promise<{ revision: number }>,
    key: exports.workspaceKey as (user: string) => readonly string[],
    calls,
    setResult: (next: typeof result) => { result = next; },
  };
}

test("UI-24: workspace writes are owner/revision scoped and never claim success for stale or failed saves", async () => {
  const api = loadApi();
  assert.notDeepEqual(api.key("alice"), api.key("bob"));
  const saved = await api.save("alice", 1, emptyWorkspace);
  assert.equal(saved.revision, 2);
  assert.ok(api.calls.some(([field, value]) => field === "user_id" && value === "alice"));
  assert.ok(api.calls.some(([field, value]) => field === "revision" && value === 1));
  assert.deepEqual(api.calls.find(([name]) => name === "update")?.[1], { state: emptyWorkspace });
  api.setResult({ data: null, error: null });
  await assert.rejects(api.save("alice", 1, emptyWorkspace), /tab lain/);
  api.setResult({ data: null, error: new Error("database detail must not leak") });
  await assert.rejects(api.save("alice", 1, emptyWorkspace), /Perubahan belum tersimpan/);
});
