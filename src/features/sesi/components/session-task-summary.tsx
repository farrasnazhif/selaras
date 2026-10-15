"use client";

import { BookOpen, FolderOpen, LayoutPanelTop } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CLASS_KEYS, GROUP_KEYS } from "@/features/kelas/constants/preview";
import { GROUP_COLORS, GROUP_LABELS } from "@/features/kelas/constants/groups";
import { GROUP_TASKS } from "@/features/sesi/constants/reference-content";
import { usePreview } from "@/features/shared/components/preview-provider";
import type { ClassKey, PreviewStudent } from "@/features/shared/types/preview";

export function SessionTaskSummary({ board = false, roster, gradePair }: { board?: boolean; roster?: PreviewStudent[]; gradePair?: Record<ClassKey, string> }) {
  const preview = usePreview();
  const grades = gradePair ?? preview.grades;
  const students = roster ?? preview.students;
  return <section><div className="mb-ui-sm flex flex-wrap items-center justify-between gap-ui-sm"><h2 className="flex items-center gap-2 text-lg font-bold"><LayoutPanelTop size={20} aria-hidden="true" />{board ? "Tugas mandiri" : "Tugas kelompok"}</h2></div><div className={`grid gap-ui-md ${board ? "" : "xl:grid-cols-2"}`}>{CLASS_KEYS.map((key) => <Card key={key} className="flex flex-col p-ui-sm"><div className="mb-ui-sm flex flex-wrap items-center justify-between gap-2 border-b border-line pb-ui-sm"><h3 className="text-sm font-bold">Daftar tugas Kelas {grades[key]}</h3><span className="rounded-chip bg-inset px-2 py-1 text-xs font-semibold">{students.filter((student) => student.classKey === key).length} siswa</span></div><div className="flex-1 space-y-ui-sm">{GROUP_KEYS.filter((group) => students.some((student) => student.classKey === key && student.group === group)).map((group) => {
    const task = GROUP_TASKS[key].find((item) => item.group === group);
    const count = students.filter((student) => student.classKey === key && student.group === group).length;
    return <div key={group} className="border-l-[3px] bg-inset p-ui-sm" style={{ borderLeftColor: GROUP_COLORS[group] }}><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-bold">Kelompok {GROUP_LABELS[group]} <span className="text-xs font-normal text-muted">({count} siswa)</span></h4>{task && <span className="rounded-chip bg-surface px-2 py-1 text-xs font-semibold">{task.title}</span>}</div><p className={`mt-2 font-semibold ${board ? "text-xl" : "text-xs"}`}>{task?.material ?? "Kegiatan belum ditetapkan"}</p><p className={`mt-2 leading-relaxed ${board ? "text-[28px] font-bold" : "text-xs text-muted"}`}>{task?.instruction ?? "Tugas untuk kelompok ini belum tersedia."}</p></div>;
  })}</div><p className="mt-ui-sm flex items-center gap-2 border-t border-line pt-ui-sm text-xs text-muted">{key === "first" ? <FolderOpen size={14} aria-hidden="true" /> : <BookOpen size={14} aria-hidden="true" />}Media: {key === "first" ? "Amplop tugas warna-warni" : "Buku bergaris & kartu domino kata"}</p></Card>)}</div></section>;
}
