import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import { SANDBOX_COMPONENTS } from "../src/features/sandbox/constants/catalog.ts";
import { getSandboxComponentId } from "../src/features/sandbox/validations/component.ts";
import { META, INTERNAL } from "../src/components/ui/meta.ts";
import { EXTENDED_COMPONENTS } from "../src/features/sandbox/constants/extended-catalog.ts";

test("one searchable sandbox list contains every imported and shared demo", () => {
  const ids = SANDBOX_COMPONENTS.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of [
    ...META.map((entry) => entry.id),
    ...EXTENDED_COMPONENTS.map((entry) => entry.id),
    "buttons",
    "inputs",
    "badges",
    "notices",
    "dialog",
    "switches",
    "tabs",
    "data-states",
    "colors",
  ]) {
    assert.ok(ids.includes(id), `Missing sandbox entry: ${id}`);
  }
  const titles = SANDBOX_COMPONENTS.map((entry) => entry.title);
  assert.deepEqual(
    titles,
    [...titles].sort((a, b) => a.localeCompare(b, "en")),
  );
  assert.ok(
    SANDBOX_COMPONENTS.every(
      (entry) => entry.caption && !/Base UI|Beautiful UI/.test(entry.title),
    ),
  );
  for (const entry of META) {
    assert.ok(
      existsSync(new URL(`../src/components/ui/${entry.file}`, import.meta.url)),
      `Missing component file: ${entry.file}`,
    );
  }
  for (const entry of EXTENDED_COMPONENTS) {
    assert.ok(existsSync(new URL(`../src/components/ui/${entry.file}`, import.meta.url)), `Missing shared component: ${entry.file}`);
  }
  for (const dependency of Object.values(INTERNAL)) {
    assert.ok(
      existsSync(new URL(`../${dependency.path}`, import.meta.url)),
      `Missing dependency: ${dependency.path}`,
    );
  }
});

test("direct sandbox destinations resolve Accordion and Dropdown and safely default invalid values", () => {
  assert.equal(getSandboxComponentId("colors"), "colors");
  assert.equal(getSandboxComponentId("accordion"), "accordion");
  assert.equal(getSandboxComponentId("dropdown-menu"), "dropdown-menu");
  for (const value of [undefined, null, "missing", "customization", ["accordion"], "toString"]) {
    assert.equal(getSandboxComponentId(value), "buttons");
  }
});
