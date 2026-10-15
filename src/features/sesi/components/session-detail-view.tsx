"use client";

import { useState } from "react";
import { LayoutPanelTop, Printer } from "lucide-react";
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

export function SessionDetailView({ sessionId }: { sessionId: string }) {
  const { classroom, sessions } = usePreview();
  const [boardOpen, setBoardOpen] = useState(false);
  const session = sessions.find(
    (item) => item.id === sessionId && item.classroomId === classroom?.id,
  );
  if (!classroom || !session) return <ClassUnavailable />;
  const path = classPath(classroom.id);
  const title = `${session.subject === "literasi" ? "Literasi" : "Numerasi"}, ${displayDate(session.date)}`;
  return (
    <div className="space-y-ui-md">
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
        <div>
          <div className="flex flex-wrap items-center gap-ui-sm">
            <h1 className="text-[28px] font-bold">{title}</h1>
          </div>
          <p className="mt-2 text-sm text-muted">
            Durasi {session.duration} menit · bergantian setiap{" "}
            {session.blockMinutes} menit · {session.roster.length} siswa
          </p>
        </div>
        <div className="print-hidden flex flex-wrap gap-ui-sm">
          <Dialog
            open={boardOpen}
            onOpenChange={setBoardOpen}
            title="Versi papan tulis"
            description={`${title} · tugas belajar tiap kelompok.`}
            trigger={
              <Button variant="secondary">
                <LayoutPanelTop size={16} aria-hidden="true" />
                Versi papan tulis
              </Button>
            }
          >
            <SessionTaskSummary
              board
              roster={session.roster}
              gradePair={session.grades}
            />
          </Dialog>
          <Button variant="primary" onClick={() => window.print()}>
            <Printer size={16} aria-hidden="true" />
            Cetak / Simpan PDF
          </Button>
        </div>
      </header>
      <RotationGrid roster={session.roster} gradePair={session.grades} />
      <div className="print-hidden"><Collapsible label="Lihat tugas tiap kelompok"><SessionTaskSummary roster={session.roster} gradePair={session.grades} /></Collapsible></div>
      <div className="hidden print:block"><SessionTaskSummary roster={session.roster} gradePair={session.grades} /></div>
    </div>
  );
}
