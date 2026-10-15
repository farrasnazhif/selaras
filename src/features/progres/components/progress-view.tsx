"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Minus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, type TableColumn } from "@/components/ui/table";
import { CLASS_KEYS } from "@/features/kelas/constants/preview";
import {
  LITERACY_LEVELS,
  NUMERACY_LEVELS,
} from "@/features/kelas/constants/reference-content";
import type { PreviewStudent, Subject } from "@/features/shared/types/preview";
import { usePreview } from "@/features/shared/components/preview-provider";
import { ObservationDialog } from "@/features/kelas/components/observation-dialog";

export function ProgressView({ embedded = false }: { embedded?: boolean }) {
  const { grades, students, assessments } = usePreview();
  const [subject, setSubject] = useState<Subject>("literasi");
  const levels = subject === "literasi" ? LITERACY_LEVELS : NUMERACY_LEVELS;
  function comparison(student: PreviewStudent) {
    const history = assessments.filter(
      (entry) => entry.studentId === student.id && entry.subject === subject,
    );
    const baseline = history[0];
    const latest = history.at(-1);
    const difference =
      baseline && latest ? Number(latest.level) - Number(baseline.level) : null;
    return { baseline, latest, difference };
  }
  function levelLabel(value?: string) {
    return (
      levels.find((level) => level.value === value)?.label ?? "Belum dinilai"
    );
  }
  function change(student: PreviewStudent) {
    const { difference } = comparison(student);
    if (difference === null)
      return <Badge tone="neutral">Belum ada pembanding</Badge>;
    const Icon = difference > 0 ? ArrowUp : difference < 0 ? ArrowDown : Minus;
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
        <Icon size={16} aria-hidden="true" />
        {difference > 0 ? "Naik" : difference < 0 ? "Turun" : "Tetap"}
      </span>
    );
  }
  const columns: TableColumn<PreviewStudent>[] = [
    { id: "name", label: "Nama siswa", value: (student) => student.name },
    {
      id: "baseline",
      label: "Level pembanding",
      value: (student) => levelLabel(comparison(student).baseline?.level),
    },
    {
      id: "latest",
      label: "Level terbaru",
      value: (student) => levelLabel(comparison(student).latest?.level),
    },
    { id: "change", label: "Perubahan", value: () => "", render: change },
    {
      id: "actions",
      label: "Catatan & riwayat",
      value: () => "",
      render: (student) => (
        <div className="flex flex-wrap gap-2">
          <ObservationDialog student={student} />
          <ObservationDialog student={student} history />
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-6 text-ink">
      {!embedded && <h1 className="text-[28px] font-bold">Progres siswa</h1>}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Perubahan level siswa</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Bandingkan penilaian pertama dan terbaru dalam pratinjau ini.
            Perbarui level pada tab Level.
          </p>
        </div>
        <div className="field min-w-48">
          <label htmlFor="progress-subject">Mata pelajaran</label>
          <Select
            value={subject}
            options={[
              { value: "literasi", label: "Literasi" },
              { value: "numerasi", label: "Numerasi" },
            ]}
            onValueChange={(value) => {
              if (value === "literasi" || value === "numerasi")
                setSubject(value);
            }}
            triggerProps={{ id: "progress-subject" }}
          />
        </div>
      </div>
      {CLASS_KEYS.map((classKey) => {
        const roster = students.filter(
          (student) => student.classKey === classKey,
        );
        return (
          <section key={classKey}>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Users size={19} aria-hidden="true" />
              Kelas {grades[classKey]}
              <Badge tone="neutral">{roster.length} siswa</Badge>
            </h3>
            <div className="hidden md:block [&_.ui-table]:text-sm">
              <Table
                rows={roster}
                columns={columns}
                getRowId={(student) => student.id}
                caption={`Progres ${subject} kelas ${grades[classKey]}`}
              />
            </div>
            <ul className="space-y-4 md:hidden">
              {roster.map((student) => (
                <li key={student.id}>
                  <Card>
                    <h4 className="font-bold">{student.name}</h4>
                    <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-xs text-muted">Pembanding</dt>
                        <dd className="mt-1">
                          {levelLabel(comparison(student).baseline?.level)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted">Terbaru</dt>
                        <dd className="mt-1">
                          {levelLabel(comparison(student).latest?.level)}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-4">{change(student)}</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <ObservationDialog student={student} />
                      <ObservationDialog student={student} history />
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
