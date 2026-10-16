"use client";

import { LayoutPanelTop } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CLASS_KEYS, GROUP_KEYS } from "@/features/kelas/constants/preview";
import { GROUP_COLORS, GROUP_LABELS } from "@/features/kelas/constants/groups";
import { getIndependentTasks } from "@/features/sesi/constants/independent-tasks";
import { usePreview } from "@/features/shared/components/preview-provider";
import type { ClassKey, PreviewStudent, Subject } from "@/features/shared/types/preview";

export function SessionTaskSummary({ board = false, roster, gradePair, subject = "literasi" }: { board?: boolean; roster?: PreviewStudent[]; gradePair?: Record<ClassKey, string>; subject?: Subject }) {
  const preview = usePreview();
  const grades = gradePair ?? preview.grades;
  const students = roster ?? preview.getStudentsForSubject(subject);
  return <section>
    <h2 className="mb-ui-sm flex items-center gap-2 text-lg font-bold"><LayoutPanelTop size={20} aria-hidden="true" />{board ? "Tugas mandiri" : "Tugas kelompok"}</h2>
    <p className="mb-ui-sm text-sm text-muted">Panduan untuk guru. Siapkan kegiatan sesuai kemampuan anggota; level 1–2 tidak memerlukan membaca.</p>
    <div className={`grid gap-ui-md ${board ? "" : "xl:grid-cols-2"}`}>
      {CLASS_KEYS.map((key) => <Card key={key} className="p-ui-sm">
        <div className="mb-ui-sm flex flex-wrap items-center justify-between gap-2 border-b border-line pb-ui-sm"><h3 className="text-sm font-bold">Kelas {grades[key]}</h3><span className="text-xs font-semibold text-muted">{students.filter((student) => student.classKey === key).length} siswa</span></div>
        <div className="space-y-ui-sm">
          {GROUP_KEYS.map((group) => {
            const members = students.filter((student) => student.classKey === key && student.group === group);
            if (!members.length) return null;
            return <div key={group} className="border-l-[3px] bg-inset p-ui-sm" style={{ borderLeftColor: GROUP_COLORS[group] }}>
              <div className="mb-ui-sm flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-bold">Kelompok {GROUP_LABELS[group]}</h4><span className="text-xs text-muted">{members.length} siswa</span></div>
              <ul className="space-y-ui-sm">
                {getIndependentTasks(members, subject, grades[key]).map((task) => <li key={task.level ?? "unassessed"}>
                  <div className="flex flex-wrap items-center gap-2"><h5 className={board ? "text-xl font-bold" : "text-sm font-bold"}>{task.title}</h5>{task.mode === "non-reading" && <Badge tone="primary">Tanpa membaca</Badge>}{task.mode === "phase" && <Badge tone="warning">Belum dipilih</Badge>}</div>
                  <p className={`mt-2 leading-relaxed ${board ? "text-[28px] font-bold" : "text-sm"}`}>{task.instruction}</p>
                  <ul aria-label="Siswa yang menerima tugas" className="mt-2 flex flex-wrap gap-x-ui-sm gap-y-1 text-xs text-muted">{task.students.map((student) => <li key={student.id}>{student.name}</li>)}</ul>
                </li>)}
              </ul>
            </div>;
          })}
        </div>
      </Card>)}
    </div>
  </section>;
}
