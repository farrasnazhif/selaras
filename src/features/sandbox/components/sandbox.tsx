"use client";

import { useState } from "react";
import Link from "next/link";
import { Command, RotateCcw, Menu, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Notice } from "@/components/ui/notice";
import { ProjectForm } from "@/features/projects/components/project-form";
import { ComponentPreview } from "@/components/ui/gallery";
import SidebarNav from "@/components/ui/sidebar-nav";
import { REGISTRY } from "@/components/ui/registry";
import { SANDBOX_COMPONENTS } from "../constants/catalog";
import { SharedDemo } from "./shared-demo";
import { ColorPalette } from "./color-palette";

export function Sandbox({ initialComponent = "buttons" }: { initialComponent?: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(initialComponent);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);

  function save() {
    setMessage("Sample form submitted successfully.");
    setOpen(false);
  }

  function startCreate() {
    setMessage("");
    setOpen(true);
  }

  function select(id: string) {
    setSelected(id);
    setNavigationOpen(false);
  }

  function reset() {
    setMessage("");
    setOpen(false);
    select("buttons");
    setResetVersion((version) => version + 1);
  }

  const component = SANDBOX_COMPONENTS.find((entry) => entry.id === selected);
  const demo = REGISTRY.find((entry) => entry.id === selected);
  const Demo = demo?.Demo;
  const sidebar = (
    <SidebarNav
      fill
      header={
        <Link href="/" className="flex items-center gap-2">
          <Command size={18} />
          UI sandbox
        </Link>
      }
      newChatLabel={null}
      navItems={[]}
      listLabel="Components"
      recents={SANDBOX_COMPONENTS.map((entry) => ({
        id: entry.id,
        label: entry.title,
        icon: <Layers3 size={16} />,
      }))}
      activeTitle={component?.title ?? null}
      onPick={(id) => select(id)}
      footerLabel="Reset sandbox"
      footerIcon={<RotateCcw size={14} />}
      onFooterClick={reset}
      className="py-4"
    />
  );

  return (
    <div className="min-h-screen">
      <main id="main-content" className="sandbox-layout">
        <div className="sandbox-navigation">{sidebar}</div>
        <div className="sandbox-content">
          <div className="mb-6 lg:hidden">
            <Dialog
              title="Explore components"
              description="Choose a component to preview."
              open={navigationOpen}
              onOpenChange={setNavigationOpen}
              trigger={
                <Button variant="secondary">
                  <Menu size={16} aria-hidden="true" />
                  Browse components
                </Button>
              }
            >
              <div className="h-[min(65dvh,640px)]">{sidebar}</div>
            </Dialog>
          </div>
          <div className="page-heading">
            <div>
              <h1>
                UI sandbox
              </h1>
              <p className="text-muted max-w-lg">
                One component library. Explore the details, then make it yours.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                nativeButton={false}
                role="link"
                render={<Link href="/dashboard" />}
              >
                Open app
              </Button>
            </div>
          </div>
          {component && (
            <ComponentPreview
              key={`${selected}:${resetVersion}`}
              title={component.title}
              caption={component.caption}
              variants={demo?.variants}
            >
              {(variant) =>
                selected === "colors" ? (
                  <ColorPalette />
                ) : Demo ? (
                  <Demo variant={variant} />
                ) : (
                  <SharedDemo id={selected} onOpenDialog={startCreate} />
                )
              }
            </ComponentPreview>
          )}
          {message && (
            <div className="mt-5">
              <Notice tone="success">{message}</Notice>
            </div>
          )}
        </div>
      </main>
      <Dialog
        title="Create sample project"
        description="This is a form preview. No data is saved."
        open={open}
        onOpenChange={setOpen}
      >
        {open && (
          <ProjectForm
            onSubmit={save}
            submitLabel="Submit sample"
            onCancel={() => setOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
}
