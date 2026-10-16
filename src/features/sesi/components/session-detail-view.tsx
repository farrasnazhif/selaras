"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutPanelTop, Pencil, Printer } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible";
import { Dialog } from "@/components/ui/dialog";
import {
  classPath,
  classroomTitle,
  displayDate,
} from "@/features/shared/constants/presentation";
import { usePreview } from "@/features/shared/components/preview-provider";
import { ClassUnavailable } from "@/features/shared/components/class-unavailable";
import { RotationGrid } from "@/features/sesi/components/rotation-grid";
import { SessionTaskSummary } from "@/features/sesi/components/session-task-summary";
import { sessionTurnLabel } from "@/features/sesi/constants/plan-editing";
import { validateSessionPlan, getStudentPacket } from "@/features/sesi/constants/scheduler";
import { PlanStatus } from "./plan-status";
import { StudentPacketView } from "./student-packet";

export function SessionDetailView({ sessionId }: { sessionId: string }) {
  const { classroom, sessions } = usePreview();
  const [boardOpen, setBoardOpen] = useState(false);
  const session = sessions.find(
    (item) => item.id === sessionId && item.classroomId === classroom?.id,
  );
  if (!classroom || !session) return <ClassUnavailable />;
  const path = classPath(classroom.id);
  const validation = validateSessionPlan(session, session.roster, session.grades, session.plan);
  const packet = validation.valid ? getStudentPacket(session, session.plan, session.grades) : null;
  const title = `${session.lessonSubject}, ${displayDate(session.date)}`;
  return (
    <>
    <div className="print-hidden space-y-ui-md">
      <div className="print-hidden">
        <Breadcrumbs
          items={[
            { label: "Kelas", href: "/kelas" },
            { label: classroomTitle(classroom), href: path },
            { label: "Sesi", href: `${path}/sesi` },
            { label: title },
          ]}
        />
      </div>
      <header className="flex flex-wrap items-start justify-between gap-ui-sm border-b border-line pb-ui-md">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-ui-sm">
            <h1 className="break-words text-[28px] font-bold">{title}</h1>
          </div>
          {session.topic && <p className="mt-2 break-words text-sm font-semibold">{session.topic}</p>}
          <div className="mt-2 flex flex-wrap gap-x-ui-sm gap-y-1 text-sm text-muted">
            <span>Fokus {session.focus === "literasi" ? "Literasi" : "Numerasi"}</span>
            <span>Durasi {session.duration} menit</span>
            <span>{sessionTurnLabel(session.plan)}</span>
            <span>{session.roster.length} siswa</span>
          </div>
        </div>
        <div className="print-hidden flex flex-wrap gap-ui-sm">
          <Button variant="secondary" nativeButton={false} role="link" render={<Link href={`${path}/sesi/${session.id}/ubah`} />}><Pencil size={16} aria-hidden="true" />Ubah sesi</Button>
          <Dialog
            open={boardOpen}
            onOpenChange={setBoardOpen}
            title="Versi papan tulis"
            description={`${title}. Panduan tugas belajar tiap kelompok.`}
            trigger={
              <Button variant="secondary" disabled={!validation.valid}>
                <LayoutPanelTop size={16} aria-hidden="true" />
                Versi papan tulis
              </Button>
            }
          >
            {packet && <StudentPacketView packet={packet} board />}
          </Dialog>
          <Button variant="primary" disabled={!validation.valid} onClick={() => { if (validateSessionPlan(session, session.roster, session.grades, session.plan).valid) window.print(); }}>
            <Printer size={16} aria-hidden="true" />
            Cetak / Simpan PDF
          </Button>
        </div>
      </header>
      <PlanStatus validation={validation} />
      <p className="text-sm text-muted">Materi tatap muka disiapkan guru. Latihan dasar ini mengikuti fokus kemampuan; periksa kesesuaiannya sebelum digunakan.</p>
      <RotationGrid plan={session.plan} grades={session.grades} lessonSubject={session.lessonSubject} topic={session.topic} />
      <Collapsible label="Periksa tugas tiap kelompok"><SessionTaskSummary plan={session.plan} roster={session.roster} grades={session.grades} /></Collapsible>
    </div>
    {packet && <StudentPacketView packet={packet} />}
    </>
  );
}
