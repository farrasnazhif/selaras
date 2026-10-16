"use client";

import { useState } from "react";
import { LayoutPanelTop, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible";
import { Dialog } from "@/components/ui/dialog";
import { displayDate } from "@/features/shared/constants/presentation";
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
  const title = `${session.subject === "literasi" ? "Literasi" : "Numerasi"}, ${displayDate(session.date)}`;
  return (
    <div className="space-y-ui-md">
      <header className="flex flex-wrap items-start justify-between gap-ui-sm border-b border-line pb-ui-md">
        <div>
          <div className="flex flex-wrap items-center gap-ui-sm">
            <h1 className="text-[28px] font-bold">{title}</h1>
          </div>
          <dl className="mt-ui-sm flex flex-wrap gap-ui-md text-sm">
            <div><dt className="text-xs text-muted">Durasi</dt><dd className="font-bold">{session.duration} menit</dd></div>
            <div><dt className="text-xs text-muted">Bergantian setiap</dt><dd className="font-bold">{session.blockMinutes} menit</dd></div>
            <div><dt className="text-xs text-muted">Siswa</dt><dd className="font-bold">{session.roster.length}</dd></div>
          </dl>
        </div>
        <div className="print-hidden flex flex-wrap gap-ui-sm">
          <Dialog
            open={boardOpen}
            onOpenChange={setBoardOpen}
            title="Versi papan tulis"
            description={<><span className="block">{title}</span><span className="block">Tugas belajar tiap kelompok.</span></>}
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
