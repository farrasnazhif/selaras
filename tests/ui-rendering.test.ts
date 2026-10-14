import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createElement, type ComponentType, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { EXTENDED_COMPONENTS } from "../src/features/sandbox/constants/extended-catalog.ts";
import { SANDBOX_COMPONENTS } from "../src/features/sandbox/constants/catalog.ts";
import { Toast } from "@base-ui/react/toast";

// Compile the real JSX modules in memory for Node's strip-types test runner.
const root = fileURLToPath(new URL("../", import.meta.url));
const modules = new Map<string, Record<string, unknown>>();
function load(path: string): Record<string, unknown> {
  const filename = [path, `${path}.tsx`, `${path}.ts`].find(existsSync);
  assert.ok(filename, `Module missing: ${path}`);
  const cached = modules.get(filename);
  if (cached) return cached;
  const exports: Record<string, unknown> = {};
  modules.set(filename, exports);
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const require = createRequire(filename);
  new Function("require", "exports", compiled)(
    (id: string) =>
      id.startsWith("@/")
        ? load(resolve(root, "src", id.slice(2)))
        : id.startsWith(".")
          ? load(resolve(dirname(filename), id))
          : require(id),
    exports,
  );
  return exports;
}

const demos = load(
  resolve(root, "src/features/sandbox/components/extended-demo"),
).EXTENDED_DEMOS as Record<string, ComponentType>;
const SharedDemo = load(
  resolve(root, "src/features/sandbox/components/shared-demo"),
).SharedDemo as ComponentType<{ id: string; onOpenDialog: () => void }>;
const render = (child: ReactNode) => renderToStaticMarkup(child);

test("every additional catalog entry has a real demo that renders", () => {
  assert.deepEqual(
    Object.keys(demos).sort(),
    EXTENDED_COMPONENTS.map((entry) => entry.id).sort(),
  );
  for (const entry of EXTENDED_COMPONENTS) {
    const markup = render(
      createElement(SharedDemo, { id: entry.id, onOpenDialog: () => {} }),
    );
    assert.ok(markup.length > 20, `Empty demo: ${entry.id}`);
    assert.ok(!markup.includes("NaN"), `Invalid numbers: ${entry.id}`);
  }
  for (const entry of EXTENDED_COMPONENTS)
    assert.ok(SANDBOX_COMPONENTS.some((item) => item.id === entry.id));
});

test("new controls retain labels, native validation, disabled, and progress semantics", () => {
  const otp = render(createElement(demos["otp-input"]));
  assert.match(otp, /autoComplete="one-time-code"/);
  assert.match(otp, /pattern="\[0-9\]\{6\}"/);
  assert.match(otp, /maxLength="6"/);
  assert.match(otp, /required=""/);
  const checkbox = render(createElement(demos.checkbox));
  assert.match(checkbox, /aria-checked="mixed"/);
  assert.match(checkbox, /disabled=""/);
  const progress = render(createElement(demos["progress-bar"]));
  assert.match(progress, /role="progressbar"/);
  assert.match(progress, /aria-valuenow="65"/);
  assert.match(progress, /aria-valuenow="100"/);
  assert.match(progress, /data-indeterminate/);
  const calendar = render(createElement(demos.calendar));
  assert.match(calendar, /October 11, 2026/);
  assert.match(calendar, /aria-pressed="true"/);
  assert.match(calendar, /disabled=""/);
  const upload = render(createElement(demos.dropzone));
  assert.match(upload, /type="file"/);
  assert.match(upload, /multiple=""/);
  assert.match(upload, /Browse files/);
  const table = render(createElement(demos["data-table"]));
  assert.match(table, /<caption[^>]*>Team members/);
  assert.match(table, /Sort by Tasks/);
  assert.match(table, /Page 1 of 3/);
});

test("switches keep on/off semantics, disabled states, labels, and form values", () => {
  const Switch = load(resolve(root, "src/components/ui/switch"))
    .Switch as ComponentType<{
    defaultChecked?: boolean;
    disabled?: boolean;
    name: string;
    "aria-label": string;
  }>;
  for (const checked of [false, true]) {
    for (const disabled of [false, true]) {
      const markup = render(
        createElement(Switch, {
          defaultChecked: checked,
          disabled,
          name: "notifications",
          "aria-label": "Notifications",
        }),
      );
      assert.match(markup, /role="switch"/);
      assert.ok(markup.includes(`aria-checked="${checked}"`));
      assert.match(markup, /aria-label="Notifications"/);
      assert.match(markup, /name="notifications"/);
      assert.match(markup, /class="switch-thumb"/);
      if (disabled) {
        assert.match(markup, /data-disabled/);
        assert.match(markup, /aria-disabled="true"/);
        assert.match(markup, /tabindex="-1"/i);
      }
    }
  }
  const demo = render(
    createElement(SharedDemo, { id: "switches", onOpenDialog: () => {} }),
  );
  assert.equal((demo.match(/role="switch"/g) ?? []).length, 4);
  assert.match(demo, /Disabled off/);
  assert.match(demo, /Disabled on/);
});

test("badges accept arbitrary labels and map project statuses to primary or semantic tones", () => {
  const Badge = load(resolve(root, "src/components/ui/badge"))
    .Badge as ComponentType<{
    status?: string;
    tone?: "primary";
    children?: ReactNode;
  }>;
  assert.match(
    render(createElement(Badge, { status: "draft" })),
    /badge-neutral[^>]*>draft/,
  );
  assert.match(
    render(createElement(Badge, { status: "active" })),
    /badge-primary[^>]*>active/,
  );
  assert.match(
    render(createElement(Badge, { status: "completed" })),
    /badge-success[^>]*>completed/,
  );
  assert.match(
    render(createElement(Badge, null, "Beta")),
    /badge-neutral[^>]*>Beta/,
  );
  assert.match(
    render(createElement(Badge, { tone: "primary" }, "New")),
    /badge-primary[^>]*>New/,
  );
});

test("the full sandbox renders one unified catalog with the extracted controls", () => {
  const Sandbox = load(resolve(root, "src/features/sandbox/components/sandbox"))
    .Sandbox as ComponentType;
  const markup = render(createElement(Sandbox));
  for (const entry of SANDBOX_COMPONENTS)
    assert.ok(
      markup.includes(entry.title),
      `Missing sidebar entry: ${entry.id}`,
    );
  assert.ok(!markup.includes("Workspace preview"));
  assert.ok(!markup.includes("Customization"));
  assert.ok(!markup.includes("Simulate save failure"));
  assert.ok(!markup.includes('aria-label="Color palette"'));
  assert.ok(!markup.includes('type="color"'));
  assert.ok(!markup.includes("Accent presets"));
  assert.ok(!markup.includes("Use dark mode"));
  assert.ok(!markup.includes("Theme Toggle"));
  assert.ok(!markup.includes("Corner radius"));
  assert.match(markup, /button-danger/);
  assert.match(markup, />Destructive<\/button>/);
  assert.match(markup, /aria-label="Add item"/);
  assert.match(markup, /aria-label="Settings"/);
  assert.match(markup, /Reset sandbox/);
});

test("SidebarNav supports primary navigation without a secondary list", () => {
  const SidebarNav = load(resolve(root, "src/components/ui/sidebar-nav")).default as ComponentType<{
    header: ReactNode; listLabel: null; newChatLabel: null; activeNav: string;
    navItems: { key: string; label: string; icon: ReactNode }[];
  }>;
  const markup = render(createElement(SidebarNav, {
    header: "Selaras", listLabel: null, newChatLabel: null, activeNav: "/sesi",
    navItems: [{ key: "/sesi", label: "Rencana sesi", icon: null }],
  }));
  assert.match(markup, /aria-label="Rencana sesi" aria-current="page"/);
  assert.match(markup, /Collapse sidebar/);
  assert.ok(!markup.includes("Supplier records"));
  assert.ok(!markup.includes('placeholder="Search'));
});

test("Accordion and Dropdown destinations render their sidebar entries and actual controls", () => {
  const Sandbox = load(resolve(root, "src/features/sandbox/components/sandbox"))
    .Sandbox as ComponentType<{ initialComponent: string }>;
  const accordion = render(
    createElement(Sandbox, { initialComponent: "accordion" }),
  );
  assert.match(accordion, /aria-label="Accordion" aria-current="page"/);
  assert.match(accordion, /How do I get started\?/);
  assert.match(accordion, /aria-expanded="true"/);
  const dropdown = render(
    createElement(Sandbox, { initialComponent: "dropdown-menu" }),
  );
  assert.match(dropdown, /aria-label="Dropdown Menu" aria-current="page"/);
  assert.match(dropdown, /aria-haspopup="menu"/);
  assert.match(dropdown, />Actions /);
});

test("toast types render decorative status icons, readable content, and dismissal", () => {
  const filename = resolve(root, "src/components/ui/toast.tsx");
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const types = [
    "success",
    "error",
    "warning",
    "info",
    "custom",
    "constructor",
    "toString",
    undefined,
  ];
  const exports = {} as {
    ToastProvider: ComponentType<{ children?: ReactNode }>;
  };
  // Portals require a browser; expose their children and seed the manager for SSR.
  const toast = {
    ...Toast,
    Portal: ({ children }: { children: ReactNode }) => children,
    useToastManager: () => ({
      toasts: types.map((type, index) => ({
        id: String(index),
        type,
        title: `Notice ${index}`,
        description: "Your input is preserved.",
      })),
    }),
  };
  const require = createRequire(filename);
  new Function("require", "exports", compiled)(
    (id: string) =>
      id === "@base-ui/react/toast"
        ? { Toast: toast }
        : id.startsWith(".")
          ? load(resolve(dirname(filename), id))
          : require(id),
    exports,
  );
  const markup = renderToStaticMarkup(createElement(exports.ToastProvider));
  for (const icon of ["circle-check", "circle-x", "triangle-alert", "info"])
    assert.ok(markup.includes(`lucide-${icon}`));
  assert.equal(
    (markup.match(/class="ui-toast-icon"/g) ?? []).length,
    types.length,
  );
  assert.match(markup, /aria-hidden="true" class="ui-toast-icon"/);
  assert.match(markup, /Your input is preserved/);
  assert.match(markup, /aria-label="Dismiss notification"/);
});

test("destructive confirmations expose one shared, accessible trigger", () => {
  const AlertDialog = load(resolve(root, "src/components/ui/alert-dialog"))
    .AlertDialog as ComponentType<{
    open: boolean;
    onOpenChange: () => void;
    title: string;
    description: string;
    trigger: ReactNode;
    children?: ReactNode;
  }>;
  const Button = load(resolve(root, "src/components/ui/button"))
    .Button as ComponentType<{ variant: string; children?: ReactNode }>;
  const markup = render(
    createElement(AlertDialog, {
      open: false,
      onOpenChange: () => {},
      title: "Delete project?",
      description: "This cannot be undone.",
      trigger: createElement(Button, { variant: "danger" }, "Delete project"),
    }),
  );
  assert.equal((markup.match(/<button/g) ?? []).length, 1);
  assert.match(markup, /aria-haspopup="dialog"/);
  assert.match(markup, /aria-expanded="false"/);
  assert.match(markup, /button-danger/);
  assert.match(markup, /Delete project<\/button>/);
});

test("Colors shows only the supplied swatches and hex labels", () => {
  const Sandbox = load(resolve(root, "src/features/sandbox/components/sandbox"))
    .Sandbox as ComponentType<{ initialComponent: string }>;
  const markup = render(createElement(Sandbox, { initialComponent: "colors" }));
  assert.match(markup, /aria-label="Colors" aria-current="page"/);
  for (const color of ["#7173FF", "#FF3C7F", "#95F447", "#00E5E3", "#F2F226"]) {
    assert.ok(markup.includes(`background-color:${color}`));
    assert.ok(markup.includes(`>${color}</p>`));
  }
  assert.ok(!markup.includes('type="color"'));
  assert.ok(!markup.includes("Primary action"));
  assert.ok(!markup.includes("Accent presets"));
});

test("loading icon buttons show one indicator and retain their accessible label", () => {
  const IconButton = load(resolve(root, "src/components/ui/icon-button"))
    .IconButton as ComponentType<{
    label: string;
    variant: string;
    loading: boolean;
    children?: ReactNode;
  }>;
  const markup = render(
    createElement(
      IconButton,
      { label: "Saving item", variant: "primary", loading: true },
      createElement("svg", { "data-icon": "plus" }),
    ),
  );
  assert.match(markup, /aria-label="Saving item"/);
  assert.match(markup, /aria-busy="true"/);
  assert.match(markup, /disabled=""/);
  assert.match(markup, /button-primary button-sm/);
  assert.equal((markup.match(/<svg/g) ?? []).length, 1);
  assert.ok(!markup.includes('data-icon="plus"'));
});
