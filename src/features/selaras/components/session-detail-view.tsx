"use client";

import { useState } from "react";
import { CircleCheck, LayoutPanelTop, Printer } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  classPath,
  classroomTitle,
  displayDate,
} from "../constants/presentation";
import { phaseForGrade } from "../constants/preview";
import { usePreview } from "./preview-provider";
import { ClassUnavailable } from "./class-unavailable";
import { RotationGrid } from "./rotation-grid";
import { SessionTaskSummary } from "./session-task-summary";

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
    <div className="space-y-6">
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
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[28px] font-bold">{title}</h1>
            <Badge tone="primary">
              {phaseForGrade(session.grades.first) ===
              phaseForGrade(session.grades.second)
                ? "Satu fase"
                : "Lintas fase"}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-muted">
            Durasi {session.duration} menit · panjang blok{" "}
            {session.blockMinutes} menit · {session.roster.length} siswa
          </p>
        </div>
        <div className="print-hidden flex flex-wrap gap-2">
          <Dialog
            open={boardOpen}
            onOpenChange={setBoardOpen}
            title="Versi papan tulis"
            description={`${title} · instruksi kelompok dari contoh referensi.`}
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
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-control bg-accent-tint px-4 py-3 text-xs text-accent-ink">
        <span className="flex items-center gap-2">
          <CircleCheck size={16} aria-hidden="true" />
          Sesi contoh dalam mode baca. Snapshot hanya tersedia di pratinjau ini.
        </span>
        <span className="font-semibold uppercase tracking-wide">Mode baca</span>
      </div>
      <RotationGrid roster={session.roster} gradePair={session.grades} />
      <SessionTaskSummary roster={session.roster} gradePair={session.grades} />
    </div>
  );
}
