"use client";

import { BookOpen, Clock3, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CLASS_KEYS } from "@/features/kelas/constants/preview";
import { LITERACY_ROTATION } from "@/features/sesi/constants/reference-content";
import { getIndependentTasks } from "@/features/sesi/constants/independent-tasks";
import { usePreview } from "@/features/shared/components/preview-provider";
import type { ClassKey, PreviewStudent } from "@/features/shared/types/preview";

export function RotationGrid({ builder = false, roster, gradePair }: { builder?: boolean; roster?: PreviewStudent[]; gradePair?: Record<ClassKey, string> }) {
  const preview = usePreview();
  const grades = gradePair ?? preview.grades;
  const students = roster ?? preview.getStudentsForSubject("literasi");
  return (
    <section aria-label="Jadwal belajar literasi " className="overflow-hidden rounded-window border border-line bg-surface text-ink">
      <div className="hidden grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)] bg-inset md:grid">
        <div className="p-ui-sm text-xs font-bold">{builder ? "Menit" : "Waktu"}</div>
        {CLASS_KEYS.map((key) => <div key={key} className="flex flex-wrap items-center justify-between gap-2 border-l border-line p-ui-sm text-xs"><span className="font-bold">Kelas {grades[key]}</span><span className="text-muted">{students.filter((student) => student.classKey === key).length} siswa</span></div>)}
      </div>
      <ol className="divide-y divide-line">
        {LITERACY_ROTATION.map((block, index) => (
          <li key={block.start} className="grid md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex items-center gap-2 bg-inset px-ui-sm py-ui-sm text-center text-xs md:flex-col md:justify-center"><Clock3 size={14} className="md:hidden" aria-hidden="true" /><span className="font-bold tabular-nums">{String(block.start).padStart(2, "0")}–{String(block.end).padStart(2, "0")}</span><span className="text-xs text-muted">{block.end - block.start} menit</span></div>
            {block.shared ? <div className="flex flex-wrap items-start gap-ui-sm bg-inset p-ui-sm md:col-span-2"><Badge tone="neutral">Bersama</Badge><div className="min-w-0 flex-1"><h3 className="text-sm font-bold">{block.shared.title}</h3><p className="mt-1 text-xs leading-relaxed text-muted">{block.shared.description}</p></div><span className="hidden text-xs text-muted xl:block">Kedua kelas</span></div> : CLASS_KEYS.map((key) => {
              const activity = block.activities![key];
              const guided = block.teacher === key;
              return <div key={key} className={`min-w-0 border-t border-line p-ui-sm md:border-t-0 ${guided ? "border-l-[3px] border-l-primary" : "md:border-l"}`}><div className="mb-ui-sm flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold text-muted md:hidden">Kelas {grades[key]}</span><Badge tone={guided ? "primary" : "neutral"}>{guided ? "Bersama guru" : activity.independentLabel ?? "Mandiri"}</Badge>{guided && <span className="text-xs text-muted">Bagian {index}</span>}</div><h3 className="text-sm font-bold">{guided ? builder ? "Bersama guru" : activity.title : "Tugas mandiri sesuai kemampuan"}</h3>{!guided ? <ul className="mt-2 space-y-2">{getIndependentTasks(students.filter((student) => student.classKey === key), "literasi", grades[key]).map((task) => <li key={task.level ?? "unassessed"} className="flex flex-wrap items-center gap-2 text-xs leading-relaxed"><span className="font-semibold">{task.title}</span><span className="text-muted">{task.students.length} siswa</span>{task.mode === "non-reading" && <Badge tone="primary">Tanpa membaca</Badge>}{task.mode === "phase" && <Badge tone="warning">Belum dipilih</Badge>}</li>)}</ul> : <p className="mt-2 text-xs leading-relaxed text-muted">{activity.description}</p>}<div className="mt-ui-sm flex items-center gap-2 border-t border-line pt-ui-sm text-xs text-muted">{guided ? <Users size={14} aria-hidden="true" /> : <BookOpen size={14} aria-hidden="true" />}{guided ? activity.note : "Lihat tugas tiap kelompok untuk pembagian anggota dan petunjuk kegiatan."}</div></div>;
            })}
          </li>
        ))}
      </ol>
    </section>
  );
}
