"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProjectMutations } from "../hooks/use-projects";
import { ProjectForm } from "./project-form";

export function CreateProject() {
  const [open, setOpen] = useState(false);
  const { create } = useProjectMutations();
  const router = useRouter();
  return (
    <Dialog
      title="Create a project"
      description="Start with an idea. You can refine the details later."
      open={open}
      onOpenChange={(next) => {
        create.reset();
        setOpen(next);
      }}
      busy={create.isPending}
      trigger={
        <Button variant="primary" >
          <Plus size={16} aria-hidden="true" />
          New project
        </Button>
      }
    >
      {open && (
        <ProjectForm
          pending={create.isPending}
          error={
            create.error
              ? "We couldn’t create your project. Please try again."
              : undefined
          }
          onCancel={() => setOpen(false)}
          onSubmit={async (input) => {
            try {
              const project = await create.mutateAsync(input);
              setOpen(false);
              router.push(`/projects/${project.id}?created=1`);
            } catch {
              /* The mutation keeps the form and displays the error. */
            }
          }}
        />
      )}
    </Dialog>
  );
}
