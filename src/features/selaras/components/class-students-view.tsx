"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Table, type TableColumn } from "@/components/ui/table";
import { CLASS_KEYS } from "../constants/preview";
import { GROUP_LABELS } from "../constants/reference-content";
import { getStudentPage } from "../constants/student-list";
import type { ClassKey, GroupKey, PreviewStudent } from "../types/preview";
import { usePreview } from "./preview-provider";
import { AddStudentDialog } from "./add-student-dialog";
import { ObservationDialog } from "./observation-dialog";
import { GroupsStep } from "./groups-step";

export function ClassStudentsView() {
  return (
    <div className="space-y-8 text-ink">
      <div className="grid items-start gap-5 xl:grid-cols-2">
        {CLASS_KEYS.map((key) => (
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
      label: "Kelompok contoh",
      value: (student) => GROUP_LABELS[student.group],
    },
    {
      id: "action",
      label: "Observasi",
      value: () => "",
      render: (student) => <ObservationDialog student={student} />,
    },
  ];
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-xl font-bold">Siswa kelas {grade}</h2>
        <div className="flex min-w-0 flex-1 basis-56 items-center gap-2">
          <div className="min-w-0 flex-1">
            <SearchInput
              label={`Cari nama siswa kelas ${grade}`}
              placeholder="Cari siswa…"
              value={query}
              className="min-h-10 py-2 text-sm leading-5"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="w-36 shrink-0">
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
      <p role="status" className="mb-3 text-xs text-muted">
        {total} siswa{query || group !== "all" ? " ditemukan" : ""}
      </p>
      <Table
        rows={rows}
        columns={columns}
        getRowId={(student) => student.id}
        caption={`Daftar siswa fiktif kelas ${grade}`}
      />
      {pageCount > 1 && (
        <div
          className="mt-4"
          role="group"
          aria-label={`Halaman siswa kelas ${grade}`}
        >
          <Pagination
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
