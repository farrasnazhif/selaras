"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Table, type TableColumn } from "@/components/ui/table";
import { GROUP_LABELS } from "@/features/kelas/constants/groups";
import { getStudentPage } from "@/features/kelas/constants/student-list";
import type {
  ClassKey,
  GroupKey,
  PreviewStudent,
} from "@/features/shared/types/preview";
import { usePreview } from "@/features/shared/components/preview-provider";
import { AddStudentDialog } from "@/features/kelas/components/add-student-dialog";
import { ObservationDialog } from "@/features/kelas/components/observation-dialog";
import { GroupsStep } from "@/features/kelas/components/groups-step";
import { GroupGuide } from "@/features/kelas/components/group-guide";

export function ClassStudentsView() {
  const { groupSubject, setGroupSubject, classKeys } = usePreview();
  return (
    <div className="space-y-ui-group text-ink">
      <div className="flex flex-wrap items-end gap-ui-sm">
        <div className="field w-64 max-w-full">
          <label htmlFor="student-group-subject">Kelompok berdasarkan</label>
          <Select
            value={groupSubject}
            options={[
              { value: "literasi", label: "Literasi" },
              { value: "numerasi", label: "Numerasi" },
            ]}
            onValueChange={(value) => {
              if (value === "literasi" || value === "numerasi")
                setGroupSubject(value);
            }}
            triggerProps={{ id: "student-group-subject" }}
          />
        </div>
        <GroupGuide />
      </div>
      <div
        className={`grid items-start gap-ui-md ${classKeys.length > 1 ? "xl:grid-cols-2" : ""}`}
      >
        {classKeys.map((key) => (
          <StudentClassCard key={key} classKey={key} />
        ))}
      </div>
      <GroupsStep />
    </div>
  );
}

function StudentClassCard({ classKey }: { classKey: ClassKey }) {
  const { grades, students } = usePreview();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<GroupKey | "all">("all");
  const [page, setPage] = useState(1);
  const { rows, total, pageCount, currentPage } = getStudentPage(
    students,
    classKey,
    query,
    group,
    page,
  );
  const grade = grades[classKey];
  const columns: TableColumn<PreviewStudent>[] = [
    { id: "name", label: "Nama siswa", value: (student) => student.name },
    {
      id: "group",
      label: "Kelompok",
      value: (student) => GROUP_LABELS[student.group],
    },
    {
      id: "action",
      label: "Riwayat observasi",
      value: () => "",
      render: (student) => <ObservationDialog student={student} />,
    },
  ];
  return (
    <Card>
      <div className="mb-ui-sm flex flex-wrap items-center gap-ui-sm">
        <h2 className="mr-auto text-xl font-bold">Siswa kelas {grade}</h2>
        <div className="flex min-w-0 flex-1 basis-full flex-wrap items-center gap-ui-sm sm:basis-56">
          <div className="min-w-40 flex-1">
            <SearchInput
              label={`Cari nama siswa kelas ${grade}`}
              placeholder="Cari siswa…"
              value={query}
              clearLabel="Hapus pencarian siswa"
              onClear={() => {
                setQuery("");
                setPage(1);
              }}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="w-28 shrink-0">
            <Select
              value={group}
              options={[
                { value: "all", label: "Semua" },
                ...Object.entries(GROUP_LABELS).map(([value, label]) => ({
                  value,
                  label,
                })),
              ]}
              onValueChange={(value) => {
                if (
                  value === "all" ||
                  value === "A" ||
                  value === "B" ||
                  value === "C"
                ) {
                  setGroup(value);
                  setPage(1);
                }
              }}
              triggerProps={{
                "aria-label": `Filter kelompok siswa kelas ${grade}`,
              }}
            />
          </div>
        </div>
      </div>
      <p role="status" className="mb-ui-sm text-xs text-muted">
        {total} siswa{query || group !== "all" ? " ditemukan" : ""}
      </p>
      <Table
        minRows={5}
        emptyMessage="Tidak ada data yang ditampilkan."
        rows={rows}
        columns={columns}
        getRowId={(student) => student.id}
        caption={`Daftar siswa kelas ${grade}`}
      />
      {pageCount > 1 && (
        <div
          className="mt-8"
          role="group"
          aria-label={`Halaman siswa kelas ${grade}`}
        >
          <Pagination
            locale="id"
            page={currentPage}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </div>
      )}
      <AddStudentDialog classKey={classKey} />
    </Card>
  );
}
