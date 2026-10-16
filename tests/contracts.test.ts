import assert from "node:assert/strict";
import { test } from "node:test";
import {
  loginSchema,
  registerSchema,
  safeReturnPath,
} from "../src/features/auth/validations/auth.ts";
import {
  createProjectSchema,
  projectSchema,
  projectIdSchema,
} from "../src/features/projects/validations/project.ts";
import { projectKeys } from "../src/features/projects/constants/query-keys.ts";

test("project validation trims names and bounds all editable values", () => {
  assert.equal(
    projectSchema.parse({
      name: "  Campus  ",
      description: "",
      status: "draft",
    }).name,
    "Campus",
  );
  for (const input of [
    { name: " ", description: "", status: "draft" },
    { name: "x".repeat(101), description: "", status: "active" },
    { name: "Campus", description: "x".repeat(2001), status: "draft" },
    { name: "Campus", description: "", status: "admin" },
  ])
    assert.equal(projectSchema.safeParse(input).success, false);
  const parsed = projectSchema.parse({
    name: "x".repeat(100),
    description: "x".repeat(2000),
    status: "completed",
    user_id: "attacker",
    id: "attacker",
  });
  assert.equal("user_id" in parsed, false);
  assert.equal("id" in parsed, false);
  assert.equal(projectIdSchema.safeParse("not-a-uuid").success, false);
  assert.deepEqual(createProjectSchema.parse({ name: "Minimal" }), {
    name: "Minimal",
    description: "",
    status: "draft",
  });
});

test("auth validation handles spaces and requires a stronger registration password", () => {
  assert.equal(
    loginSchema.parse({ email: " user@example.com ", password: "x" }).email,
    "user@example.com",
  );
  assert.equal(
    registerSchema.safeParse({ email: "user@example.com", password: "short" })
      .success,
    false,
  );
  assert.equal(
    registerSchema.safeParse({ email: "broken", password: "password123" })
      .success,
    false,
  );
});

test("return destinations stay on the application origin", () => {
  for (const unsafe of [
    null,
    "https://evil.test",
    "//evil.test",
    "/\\evil.test",
    "/\nevil.test",
    "javascript:alert(1)",
    " /projects",
  ])
    assert.equal(safeReturnPath(unsafe), "/dashboard");
  assert.equal(safeReturnPath("/login?next=/login"), "/kelas");
  assert.equal(safeReturnPath("/auth/callback"), "/kelas");
  assert.equal(safeReturnPath("/projects?created=1"), "/projects?created=1");
  assert.equal(safeReturnPath("/projects/../dashboard"), "/dashboard");
});

test("list and detail caches are partitioned by account", () => {
  assert.notDeepEqual(projectKeys.list("alice"), projectKeys.list("bob"));
  assert.notDeepEqual(
    projectKeys.detail("alice", "id"),
    projectKeys.detail("bob", "id"),
  );
  assert.deepEqual(projectKeys.detail("alice", "id"), [
    "project",
    "alice",
    "id",
  ]);
});
