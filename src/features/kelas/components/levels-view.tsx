"use client";

import { Check } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, type TableColumn } from "@/components/ui/table";
import { CLASS_KEYS } from "@/features/kelas/constants/preview";
import {
  CLASS_FOCUS,
  LITERACY_LEVELS,
  NUMERACY_LEVELS,
} from "@/features/kelas/constants/reference-content";
import type { PreviewStudent } from "@/features/shared/types/preview";
import { usePreview } from "@/features/shared/components/preview-provider";
import { DiagnosticGuide, LevelRubrics } from "@/features/kelas/components/level-rubrics";

export function LevelsView() {
  const { students, grades, setLevel } = usePreview();
  const columns: TableColumn<PreviewStudent>[] = [
    {
      id: "no",
      label: "No",
      value: (student) =>
        String(students.indexOf(student) + 1).padStart(2, "0"),
    },
    {
      id: "name",
      label: "Nama siswa",
      value: (student) => student.name,
      render: (student) => (
        <span className="font-semibold">{student.name}</span>
      ),
    },
    {
      id: "grade",
      label: "Kelas",
      value: (student) => grades[student.classKey],
      render: (student) => (
        <Badge tone="neutral">Kelas {grades[student.classKey]}</Badge>
      ),
    },
    {
      id: "literacy",
      label: "Tingkat literasi",
      value: (student) => student.literacy ?? "",
      render: (student) => (
        <Select
          value={student.literacy}
          options={LITERACY_LEVELS}
          placeholder="Pilih level"
          onValueChange={(value) => {
            if (value) setLevel(student.id, "literasi", value);
          }}
          triggerProps={{ "aria-label": `Tingkat literasi ${student.name}` }}
        />
      ),
    },
    {
      id: "numeracy",
      label: "Tingkat numerasi",
      value: (student) => student.numeracy ?? "",
      render: (student) => (
        <Select
          value={student.numeracy}
          options={NUMERACY_LEVELS}
          placeholder="Pilih level"
          onValueChange={(value) => {
            if (value) setLevel(student.id, "numerasi", value);
          }}
          triggerProps={{ "aria-label": `Tingkat numerasi ${student.name}` }}
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      value: () => "Tersimpan sementara",
      render: () => (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-green">
          <Check size={14} aria-hidden="true" />
          Tersimpan sementara
        </span>
      ),
    },
  ];
  return (
    <div className="space-y-5 text-ink">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DiagnosticGuide />
      </div>
      {students.length ? (
        <div className="space-y-4 [&_.ui-table]:text-sm [&_.ui-select-trigger]:min-w-44">
          {CLASS_KEYS.map((key) => {
            const roster = students.filter(
              (student) => student.classKey === key,
            );
            return (
              <section key={key}>
                <div
                  className={`rounded-t-window px-4 py-3 text-xs ${key === "first" ? "bg-accent-tint" : "bg-[var(--pastel-blue)]"}`}
                >
                  <span className="font-bold">
                    Kelas {grades[key]} ({roster.length} siswa)
                  </span>
                  <span className="ml-3 text-muted">
                    Fokus contoh: {CLASS_FOCUS[key]}
                  </span>
                </div>
                <Table
                  rows={roster}
                  columns={columns}
                  getRowId={(student) => student.id}
                  caption={`Level siswa fiktif kelas ${grades[key]}`}
                />
              </section>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Belum ada siswa"
          description="Tambahkan siswa contoh pada tab Siswa untuk mencoba penetapan level."
        />
      )}
      <LevelRubrics />
    </div>
  );
}
