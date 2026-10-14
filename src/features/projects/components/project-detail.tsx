"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useProject, useProjectMutations } from "../hooks/use-projects";
import { ProjectForm } from "./project-form";
import { DataState } from "@/components/ui/data-state";
import { Notice } from "@/components/ui/notice";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { projectSchema } from "../validations/project";

export function ProjectDetail({ id }: { id: string }) {
  const query = useProject(id);
  const { update, remove } = useProjectMutations();
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const project = query.data;
  return (
    <>
      <Button
        variant="quiet"
        className="mb-6"
        nativeButton={false}
        role="link"
        render={<Link href="/projects" />}
      >
        <ArrowLeft size={16} />
        Back to projects{" "}
      </Button>
      {query.isPending ? (
        <DataState state="loading" />
      ) : !project ? (
        <DataState
          state={
            query.error?.message === "This project is unavailable."
              ? "unavailable"
              : "error"
          }
          onRetry={() => void query.refetch()}
        />
      ) : (
        <>
          <div className="page-heading">
            <div>
              <p className="eyebrow">Project details</p>
              <h1 className="break-words">{project.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <Badge status={project.status} />
                <span className="text-xs text-muted">
                  Updated{" "}
                  {new Date(project.updated_at).toISOString().slice(0, 10)}
                </span>
              </div>
            </div>
          </div>
          <Card className="max-w-[640px]">
            {(saved || params.get("created") === "1") && (
              <div className="mb-4">
                <Notice tone="success">
                  {saved ? "Project saved." : "Project created. Make it yours."}
                </Notice>
              </div>
            )}
            <ProjectForm
              key={project.id}
              values={projectSchema.parse(project)}
              pending={update.isPending}
              error={
                update.error
                  ? "We couldn’t save your changes. Your project may no longer be available. Try again."
                  : undefined
              }
              submitLabel="Save changes"
              onSubmit={async (input) => {
                setSaved(false);
                try {
                  await update.mutateAsync({ id, input });
                  setSaved(true);
                } catch {
                  /* Keep the draft on failure. */
                }
              }}
            />
          </Card>
          <div className="max-w-[640px] mt-6 flex flex-wrap gap-4 items-center justify-between border-t border-line pt-6">
            <div>
              <h2 className="font-[750] text-2xl leading-[1.25]">Delete project</h2>
              <p className="text-xs text-muted mt-1">
                Permanently remove this project and its details.
              </p>
            </div>
            <AlertDialog
              title="Delete this project?"
              description={`“${project.name}” will be permanently deleted. This cannot be undone.`}
              open={confirm}
              onOpenChange={(next) => {
                remove.reset();
                setConfirm(next);
              }}
              busy={remove.isPending}
              error={remove.error ? "We couldn’t delete the project. Please try again." : undefined}
              trigger={
                <Button variant="danger" >
                  <Trash2 size={16} aria-hidden="true" />
                  Delete project
                </Button>
              }
            >
              <Button
                variant="danger"

                loading={remove.isPending}
                onClick={async () => {
                  try {
                    await remove.mutateAsync(id);
                    setConfirm(false);
                    router.replace("/projects");
                  } catch {
                    /* Keep confirmation open on failure. */
                  }
                }}
              >
                {remove.isPending ? "Deleting…" : "Delete permanently"}
              </Button>
            </AlertDialog>
          </div>
        </>
      )}
    </>
  );
}
