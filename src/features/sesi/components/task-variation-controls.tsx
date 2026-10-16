"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { useTaskVariation } from "../hooks/use-task-variation";
import {
  taskVariationRequestSchema,
  type TaskVariation,
} from "../validations/task-variation";
import { TaskExercise } from "./task-exercise";

export function TaskVariationControls({
  getRequest,
  onApply,
  disabled,
}: {
  getRequest: () => unknown;
  onApply: (variation: TaskVariation) => void;
  disabled?: boolean;
}) {
  const variation = useTaskVariation();
  const [error, setError] = useState("");
  function generate() {
    if (variation.isPending) return;
    setError("");
    const request = taskVariationRequestSchema.safeParse(getRequest());
    if (!request.success) {
      setError(
        "Lengkapi judul, petunjuk, dan kegiatan yang sesuai level sebelum membuat variasi.",
      );
      return;
    }
    variation.mutate(request.data);
  }
  function apply() {
    const current = taskVariationRequestSchema.safeParse(getRequest());
    if (
      !current.success ||
      JSON.stringify(current.data) !== JSON.stringify(variation.variables)
    ) {
      variation.reset();
      setError(
        "Tugas sumber sudah diubah. Buat variasi baru agar sesuai dengan perubahan Anda.",
      );
      return;
    }
    if (variation.data) onApply(variation.data);
    variation.reset();
  }
  const draft = variation.data;
  return (
    <section
      className="space-y-ui-sm rounded-window border border-line p-ui-sm"
      aria-label="Variasi tugas dengan AI"
    >
      <div className="flex items-end justify-between gap-ui-sm">
        <div>
          <h3 className="text-sm font-bold">Variasi kegiatan</h3>
          <p className="text-xs text-muted">
            Isi tugas, mata pelajaran, tingkat kemampuan, kelas, dan durasi
            dikirim ke AI. Namun, foto tidak dikirim otomatis.
          </p>
        </div>

        <Button
          type="button"
          size="xs"
          variant="secondary"
          className="button-ai-variation"
          disabled={disabled || variation.isPending}
          loading={variation.isPending}
          onClick={generate}
        >
          <Sparkles size={15} aria-hidden="true" />
          Buat variasi AI
        </Button>
      </div>

      {variation.isPending && (
        <p role="status" className="text-sm text-muted">
          Menyiapkan variasi…
        </p>
      )}
      {(error || variation.error) && (
        <Callout title="Variasi belum dapat digunakan" tone="warning">
          {error || variation.error?.message}
        </Callout>
      )}
      {draft && (
        <div className="space-y-ui-sm">
          <Badge tone="primary">Variasi AI</Badge>
          <Callout title="Periksa sebelum digunakan" tone="info">
            Pastikan isi dan tingkat kesulitannya sesuai. Draf ini belum
            mengganti tugas Anda.
          </Callout>
          <h4 className="font-bold">{draft.title}</h4>
          <p className="text-sm">{draft.instruction}</p>
          <TaskExercise
            content={
              draft.kind === "written"
                ? {
                    kind: "written",
                    passage: draft.passage,
                    questions: draft.questions,
                  }
                : { kind: draft.kind, values: draft.values }
            }
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="xs" onClick={apply}>
              Gunakan variasi
            </Button>
            <Button
              type="button"
              size="xs"
              variant="secondary"
              onClick={() => {
                variation.reset();
                setError("");
              }}
            >
              Abaikan
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
