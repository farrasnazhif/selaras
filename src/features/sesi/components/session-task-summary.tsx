"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskEditor } from "./task-editor";
import { reflowPlan } from "@/features/sesi/constants/plan-editing";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CLASS_KEYS, GROUP_KEYS } from "@/features/kelas/constants/preview";
import { GROUP_LABELS } from "@/features/kelas/constants/groups";
import type { ClassKey, PreviewStudent, Subject } from "@/features/shared/types/preview";
import type { SessionPlan } from "@/features/sesi/types/schedule";
import { TaskPhoto } from "./task-photo";
import { TaskExercise } from "./task-exercise";

export function SessionTaskSummary({ plan, roster, grades, focus, lessonSubject, blockMinutes, onChange }: { plan: SessionPlan; roster: PreviewStudent[]; grades: Record<ClassKey, string>; focus?: Subject; lessonSubject: string; blockMinutes: number; onChange?: (plan: SessionPlan) => void }) {
  return <section className="space-y-ui-md">
    <div><h2 className="text-lg font-bold">Tugas tiap kelompok</h2><p className="mt-2 text-sm text-muted">Draf latihan dasar. Periksa kesesuaiannya sebelum mengajar. Nama dan level hanya ada di tampilan guru ini; bagikan nomor kegiatan secara lisan saat pembukaan.</p></div>
    {CLASS_KEYS.flatMap((classKey) => GROUP_KEYS.map((group) => {
      const tasks = plan.tasks.filter((task) => task.classKey === classKey && task.group === group);
      const members = roster.filter((student) => student.classKey === classKey && student.group === group);
      return members.length ? <Card key={`${classKey}-${group}`} className="space-y-ui-md">
        <div className="flex flex-wrap items-center justify-between gap-ui-sm"><h3 className="text-base font-bold">Kelas {grades[classKey]}, Kelompok {GROUP_LABELS[group]}</h3>{onChange && focus && <TaskEditor classKey={classKey} group={group} grade={grades[classKey]} focus={focus} lessonSubject={lessonSubject} blockMinutes={blockMinutes} members={members} onSave={(task) => onChange(reflowPlan({ ...plan, tasks: [...plan.tasks, task] }))} />}</div>
        {!tasks.length && <p className="text-sm text-muted">Belum ada kegiatan. Tambahkan tugas untuk setiap anggota sebelum menyimpan.</p>}
        {tasks.map((task, index) => <section key={task.id} className="space-y-ui-sm border-t border-line pt-ui-sm">
          <div className="flex flex-wrap items-center gap-2"><h4 className="font-bold">Kegiatan {index + 1}: {task.template?.title ?? "Tugas sesuai kelas belum diisi"}</h4><Badge tone="neutral">Level {task.level}</Badge>{task.template?.aiGenerated && <Badge tone="primary">Variasi AI</Badge>}{task.template && !task.template.requiresReading && <Badge tone="primary">Tanpa membaca</Badge>}</div>
          {onChange && focus && <div className="flex flex-wrap gap-2"><TaskEditor task={task} classKey={classKey} group={group} grade={grades[classKey]} focus={focus} lessonSubject={lessonSubject} blockMinutes={blockMinutes} members={members} onSave={(updated) => onChange(reflowPlan({ ...plan, tasks: plan.tasks.map((item) => item.id === task.id ? updated : item) }))} /><Button size="xs" variant="danger" aria-label={`Hapus kegiatan ${index + 1} Kelompok ${GROUP_LABELS[group]} Kelas ${grades[classKey]}`} onClick={() => onChange(reflowPlan({ ...plan, tasks: plan.tasks.filter((item) => item.id !== task.id) }))}><Trash2 size={14} aria-hidden="true" />Hapus</Button></div>}
          <p className="text-sm text-muted">{task.memberIds.map((id) => roster.find((student) => student.id === id)?.name).join(", ")}</p>
          {task.template ? <><p className="text-sm">{task.template.instruction}</p><TaskExercise content={task.template.content} />{task.template.photo && <TaskPhoto photo={task.template.photo} />}</> : <p className="text-sm text-muted">Isi tugas sesuai capaian Kelas {grades[classKey]} di formulir. Tugas dasar tidak digunakan sebagai pengganti.</p>}
        </section>)}
      </Card> : null;
    }))}
  </section>;
}
