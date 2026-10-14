"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectInput } from "../validations/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export function ProjectForm({
  values,
  onSubmit,
  pending = false,
  error,
  submitLabel = "Create project",
  onCancel,
}: {
  values?: ProjectInput;
  onSubmit: (input: ProjectInput) => Promise<unknown> | void;
  pending?: boolean;
  error?: string;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: values ?? { name: "", description: "", status: "draft" },
  });
  const busy = pending || isSubmitting;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <fieldset disabled={busy} className="space-y-4 min-w-0">
        <div className="field">
          <label htmlFor="project-name">
            Project name <span className="text-accent">*</span>
          </label>
          <Input
            id="project-name"
            placeholder="e.g. Campus companion"
            maxLength={100}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" className="field-error">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="project-description">
            Description <span className="field-optional">Optional</span>
          </label>
          <Textarea
            id="project-description"
            className="min-h-32"
            placeholder="What are you building, and who is it for?"
            maxLength={2000}
            aria-invalid={!!errors.description}
            aria-describedby="description-hint description-error"
            {...register("description")}
          />
          <p id="description-hint" className="text-xs text-muted">
            A little context goes a long way. Up to 2,000 characters.
          </p>
          {errors.description && (
            <p id="description-error" className="field-error">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="project-status">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                id="project-status"
                name={field.name}
                value={field.value}
                disabled={busy}
                onValueChange={(value) => {
                  if (value !== null) field.onChange(value);
                }}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "active", label: "Active" },
                  { value: "completed", label: "Completed" },
                ]}
                triggerProps={{
                  ref: field.ref,
                  onBlur: field.onBlur,
                  "aria-invalid": !!errors.status,
                  "aria-describedby": errors.status
                    ? "status-error"
                    : undefined,
                }}
              />
            )}
          />
          {errors.status && (
            <p id="status-error" className="field-error">
              {errors.status.message}
            </p>
          )}
        </div>
      </fieldset>
      {error && <Notice>{error}</Notice>}
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button variant="primary" type="submit" loading={busy} className="w-full sm:w-auto">
          {busy ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
