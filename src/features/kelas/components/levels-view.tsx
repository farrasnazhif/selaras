"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Table, type TableColumn } from "@/components/ui/table";
import { CLASS_KEYS } from "@/features/kelas/constants/preview";
import { LITERACY_LEVELS, NUMERACY_LEVELS } from "@/features/kelas/constants/reference-content";
import type { PreviewStudent } from "@/features/shared/types/preview";
import { usePreview } from "@/features/shared/components/preview-provider";
import { DiagnosticGuide, LevelRubrics } from "./level-rubrics";
import { ObservationDialog } from "./observation-dialog";

export function LevelsView() {
  const { students, grades, setLevel } = usePreview();
  const columns: TableColumn<PreviewStudent>[] = [
    { id: "no", label: "No", value: (student) => String(students.indexOf(student) + 1).padStart(2, "0") },
    { id: "name", label: "Nama siswa", value: (student) => student.name, render: (student) => <span className="font-bold">{student.name}</span> },
    { id: "literacy", label: "Tingkat literasi", value: (student) => student.literacy ?? "", render: (student) => <Select value={student.literacy} options={LITERACY_LEVELS} placeholder="Pilih level" onValueChange={(value) => { if (value) setLevel(student.id, "literasi", value); }} triggerProps={{ "aria-label": `Tingkat literasi ${student.name}` }} /> },
    { id: "numeracy", label: "Tingkat numerasi", value: (student) => student.numeracy ?? "", render: (student) => <Select value={student.numeracy} options={NUMERACY_LEVELS} placeholder="Pilih level" onValueChange={(value) => { if (value) setLevel(student.id, "numerasi", value); }} triggerProps={{ "aria-label": `Tingkat numerasi ${student.name}` }} /> },
    { id: "observation", label: "Riwayat observasi", value: () => "", render: (student) => <ObservationDialog student={student} /> },
    { id: "status", label: "Status", value: () => "Tercatat", render: () => <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-green"><Check size={15} aria-hidden="true" />Tercatat</span> },
  ];
  return (
    <div className="space-y-6 text-ink">
      <DiagnosticGuide />
      {students.length ? CLASS_KEYS.map((key) => <ClassLevels key={key} grade={grades[key]} rows={students.filter((student) => student.classKey === key)} columns={columns} />) : <EmptyState title="Belum ada siswa" description="Tambahkan siswa pada tab Siswa untuk mulai mencatat level." />}
      <LevelRubrics />
    </div>
  );
}

function ClassLevels({ grade, rows, columns }: { grade: string; rows: PreviewStudent[]; columns: TableColumn<PreviewStudent>[] }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(rows.length / 10));
  const current = Math.min(page, pageCount);
  return (
    <section className="space-y-3 [&_.ui-select-trigger]:min-w-40" aria-label={`Level kelas ${grade}`}>
      <div className="flex items-center gap-3"><h2 className="text-lg font-extrabold">Kelas {grade}</h2><span className="text-sm text-muted">{rows.length} siswa</span></div>
      <Table emptyMessage="Tidak ada data yang ditampilkan." rows={rows.slice((current - 1) * 10, current * 10)} columns={columns} getRowId={(student) => student.id} caption={`Level siswa kelas ${grade}`} />
      {pageCount > 1 && <div role="group" aria-label={`Halaman level kelas ${grade}`}><Pagination locale="id" page={current} pageCount={pageCount} onPageChange={setPage} /></div>}
    </section>
  );
}
