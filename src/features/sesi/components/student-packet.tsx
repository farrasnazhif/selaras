import type { StudentPacket } from "@/features/sesi/types/schedule";
import { displayDate } from "@/features/shared/constants/presentation";
import { TaskPhoto } from "./task-photo";
import { TaskExercise } from "./task-exercise";

export function StudentPacketView({ packet, preview = false, board = false }: { packet: StudentPacket; preview?: boolean; board?: boolean }) {
  return <section aria-label={board ? "Tugas di papan tulis" : "Lembar cetak"} className={`student-packet ${preview || board ? "space-y-ui-md" : "hidden print:block"}`}>
    {!board && <article className="student-schedule rounded-card border border-line bg-white p-ui-md">
      <h2 className="break-words text-xl font-bold">{packet.lessonSubject}</h2>
      {packet.topic && <p className="mt-2 break-words font-semibold">{packet.topic}</p>}
      <p className="my-ui-sm text-sm">{displayDate(packet.date)}</p>
      <table className="w-full border-collapse text-sm"><caption className="mb-3 text-left font-bold">Jadwal belajar</caption><thead><tr><th className="border border-line p-2 text-left">Menit</th><th className="border border-line p-2 text-left">Bersama guru</th><th className="border border-line p-2 text-left">Kegiatan kelompok</th></tr></thead><tbody>{packet.blocks.map((block) => <tr key={block.start}><td className="border border-line p-2 align-top tabular-nums">{block.start}–{block.end}</td><td className="border border-line p-2 align-top">{block.teacher}{block.note && <p className="mt-1 break-words">{block.note}</p>}</td><td className="border border-line p-2"><ul>{block.activities.map((activity, index) => <li key={index}>{activity}</li>)}</ul></td></tr>)}</tbody></table>
    </article>}
    {packet.groups.map((group, index) => <article key={index} className={`student-group-sheet rounded-card border border-line bg-white p-ui-md ${board ? "text-lg" : ""}`}>
      <header className="mb-ui-md border-b border-current pb-ui-sm">
        <div className="flex flex-wrap items-center justify-between gap-ui-sm"><h2 className={board ? "text-[28px] font-extrabold" : "text-xl font-bold"}>Kelompok {group.groupLabel}</h2><span className="text-sm font-bold">{group.classLabel}</span></div>
        <p className="mt-2 break-words text-sm">{packet.lessonSubject}</p>{packet.topic && <p className="mt-1 break-words text-sm">{packet.topic}</p>}
      </header>
      <div className="space-y-ui-md">{group.activities.map((activity) => <section key={activity.number} className="student-activity space-y-ui-sm">
        <h3 className="text-base font-bold">Kegiatan {activity.number}: {activity.title}</h3>
        {activity.instruction && <p className="text-base">{activity.instruction}</p>}
        <TaskExercise content={activity.content} />{activity.photo && <TaskPhoto photo={activity.photo} />}
      </section>)}</div>
    </article>)}
  </section>;
}
