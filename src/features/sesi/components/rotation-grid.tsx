import { Clock3, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CLASS_KEYS } from "@/features/kelas/constants/preview";
import { GROUP_LABELS } from "@/features/kelas/constants/groups";
import type { ClassKey } from "@/features/shared/types/preview";
import type { SessionPlan } from "@/features/sesi/types/schedule";

export function RotationGrid({ plan, grades, lessonSubject, topic }: { plan: SessionPlan; grades: Record<ClassKey, string>; lessonSubject: string; topic: string }) {
  return <section aria-label={`Jadwal belajar ${lessonSubject}`} className="overflow-hidden rounded-window border border-line bg-surface text-ink">
    <div className="hidden grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)] bg-inset md:grid"><div className="p-ui-sm text-xs font-bold">Menit</div>{CLASS_KEYS.map((key) => <div key={key} className="border-l border-line p-ui-sm text-sm font-bold">Kelas {grades[key]}</div>)}</div>
    <ol className="divide-y divide-line">{plan.blocks.map((block) => {
      const shared = block.teacherAssignments[0]?.length === 2;
      return <li key={block.start} className="grid md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex items-center gap-2 bg-inset p-ui-sm text-xs md:flex-col md:justify-center"><Clock3 size={14} className="md:hidden" aria-hidden="true" /><span className="font-bold tabular-nums">{block.start}–{block.end}</span><span>{block.end - block.start} menit</span></div>
        {shared ? <div className="space-y-ui-sm bg-inset p-ui-sm md:col-span-2"><Badge tone="primary">Bersama guru, kedua kelas</Badge><h3 className="text-sm font-bold">{block.kind === "opening" ? "Pembukaan dan penjelasan tugas" : block.kind === "closing" ? "Penutup dan tinjauan hasil" : "Belajar bersama"}</h3><p className="break-words text-sm text-muted">{block.kind === "opening" ? "Jelaskan pembagian kegiatan tiap kelompok. Peragakan tugas gambar dan benda konkret secara lisan." : block.kind === "closing" ? "Tinjau hasil kedua kelas dan kumpulkan pekerjaan kelompok." : block.note || `Gunakan materi ${lessonSubject}${topic ? ` tentang ${topic}` : ""} yang disiapkan untuk kedua kelas.`}</p><ul className="flex flex-wrap gap-x-ui-sm gap-y-1 text-xs text-muted">{block.activities.map((activity) => <li key={`${activity.classKey}-${activity.group}`}>Kelas {grades[activity.classKey]}, Kelompok {GROUP_LABELS[activity.group]}</li>)}</ul></div> : CLASS_KEYS.map((classKey) => {
          const guided = block.teacherAssignments[0]?.includes(classKey);
          return <div key={classKey} className={`min-w-0 space-y-ui-sm border-t border-line p-ui-sm md:border-t-0 ${guided ? "border-l-[3px] border-l-primary" : "md:border-l"}`}>
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold md:hidden">Kelas {grades[classKey]}</span><Badge tone={guided ? "primary" : "neutral"}>{guided ? "Bersama guru" : "Mandiri"}</Badge></div>
            <p className="break-words text-sm">{guided && block.note ? block.note : guided ? `Pendampingan ${lessonSubject}${topic ? `: ${topic}` : ""}. Materi tatap muka disiapkan guru.` : "Kerjakan kegiatan kelompok yang telah dijelaskan saat pembukaan."}</p>
            <ul className="space-y-2 text-sm">{block.activities.filter((activity) => activity.classKey === classKey).map((activity) => <li key={activity.group} className="flex items-start gap-2">{guided && <Users size={15} className="mt-0.5 shrink-0" aria-hidden="true" />}<div><span className="font-bold">Kelompok {GROUP_LABELS[activity.group]}</span>{!guided && <ul className="mt-1 space-y-1 text-xs text-muted">{activity.taskIds.map((id, index) => <li key={id}>Kegiatan {index + 1}: {plan.tasks.find((task) => task.id === id)?.template?.title ?? "Tugas belum diisi"}</li>)}</ul>}</div></li>)}</ul>
          </div>;
        })}
      </li>;
    })}</ol>
  </section>;
}
