import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import Link from "next/link.js";
import type { Button as UIButton } from "../src/components/ui/button.tsx";

// Node's strip-types runner cannot read JSX; compile the actual component in memory.
const compiled = ts.transpileModule(
  readFileSync(new URL("../src/components/ui/button.tsx", import.meta.url), "utf8"),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  },
).outputText;
const exports = {} as { Button: typeof UIButton };
new Function("require", "exports", compiled)(createRequire(import.meta.url), exports);
const { Button } = exports;

test("buttons retain defaults, labels, submit semantics, and disabled state", () => {
  const normal = renderToStaticMarkup(createElement(Button, null, "Continue"));
  assert.match(normal, /button-ghost button-sm/);
  assert.ok(!normal.includes('aria-busy="true"'));
  assert.ok(!normal.includes('disabled=""'));

  const disabled = renderToStaticMarkup(
    createElement(Button, { disabled: true, type: "submit" }, "Save"),
  );
  assert.match(disabled, /disabled=""/);
  assert.match(disabled, /type="submit"/);
  assert.match(disabled, />Save<\/button>/);
  assert.ok(!disabled.includes("<svg"));
});

test("buttons default to small and normalize legacy size requests", () => {
  const primary = renderToStaticMarkup(createElement(Button, { variant: "primary" }, "Continue"));
  assert.match(primary, /button-primary button-sm/);
  for (const size of ["xs", "sm", "md", "lg"] as const) {
    const markup = renderToStaticMarkup(createElement(Button, { variant: "primary", size }, "Continue"));
    assert.ok(markup.includes("button-sm"));
  }
});

test("loading disables every size/variant, marks it busy, and preserves its label", () => {
  for (const size of ["xs", "sm", "md", "lg"] as const) {
    for (const variant of ["primary", "secondary", "ghost", "danger", "quiet"] as const) {
      const markup = renderToStaticMarkup(
        createElement(Button, {
          variant,
          size,
          loading: true,
          disabled: false,
          "aria-busy": false,
          "aria-label": "Save project",
          type: "submit",
        }, "Saving…"),
      );
      assert.match(markup, /disabled=""/);
      assert.match(markup, /aria-busy="true"/);
      assert.match(markup, /data-loading="true"/);
      assert.ok(!markup.includes("data-accent="));
      assert.ok(markup.includes(`button-${variant}`));
      assert.ok(markup.includes("button-sm"));
      assert.match(markup, /aria-label="Save project"/);
      assert.match(markup, /type="submit"/);
      assert.match(markup, /<svg[^>]*aria-hidden="true"/);
      assert.match(markup, /motion-reduce:animate-none/);
      assert.match(markup, /Saving…<\/button>/);
    }
  }
});

test("link buttons render a single anchor with navigation and disabled semantics", () => {
  for (const state of ["normal", "disabled", "loading"] as const) {
    const markup = renderToStaticMarkup(
      createElement(Button, {
        variant: "secondary",
        nativeButton: false,
        role: "link",
        render: createElement(Link, { href: "/sandbox", target: "_blank", rel: "noreferrer" }),
        disabled: state === "disabled",
        loading: state === "loading",
      }, "Open sandbox"),
    );
    assert.match(markup, /^<a\s/);
    assert.ok(!markup.includes("<button"));
    assert.match(markup, /href="\/sandbox"/);
    assert.match(markup, /role="link"/);
    assert.match(markup, /target="_blank"/);
    assert.match(markup, /rel="noreferrer"/);
    assert.match(markup, /button-secondary button-sm/);
    assert.match(markup, /Open sandbox<\/a>/);
    if (state !== "normal") assert.match(markup, /aria-disabled="true"/);
    if (state === "loading") assert.match(markup, /aria-busy="true"/);
  }
});
