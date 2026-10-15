"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { classPath, displayDate } from "@/features/shared/constants/presentation";
import { usePreview } from "@/features/shared/components/preview-provider";

export function ClassSessionsView() {
  const { classroom, sessions } = usePreview();
  if (!classroom) return null;
  const items = sessions.filter(
    (session) => session.classroomId === classroom.id,
  );
  return (
    <div className="space-y-ui-md text-ink">
      <div className="flex flex-wrap items-center justify-between gap-ui-sm">
        <div>
          <h2 className="text-xl font-bold">Sesi pembelajaran</h2>
          <p className="mt-1 text-sm text-muted">
            Tinjau rencana mengajar dan susun sesi berikutnya.
          </p>
        </div>
        <Button
          variant="primary"
          nativeButton={false}
          role="link"
          render={<Link href={`${classPath(classroom.id)}/sesi/baru`} />}
        >
          <Plus size={16} aria-hidden="true" />
          Susun jadwal
        </Button>
      </div>
      {items.length ? (
        <div className="grid gap-ui-sm xl:grid-cols-2">
          {items.map((session) => (
            <Link
              key={session.id}
              href={`${classPath(classroom.id)}/sesi/${session.id}`}
              className="block rounded-card"
            >
              <Card>
                <div className="flex items-center justify-between gap-ui-sm">
                  <h3 className="text-lg font-bold">
                    {session.subject === "literasi" ? "Literasi" : "Numerasi"},{" "}
                    {displayDate(session.date)}
                  </h3>
                  <ArrowRight size={17} aria-hidden="true" />
                </div>
                <div className="mt-ui-sm flex flex-wrap items-center gap-ui-sm text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={14} aria-hidden="true" />
                    {session.duration} menit
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} aria-hidden="true" />
                    Bergantian setiap {session.blockMinutes} menit
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Belum ada sesi"
          description="Susun sesi belajar untuk melihat jadwal dan tugas kelompok."
        />
      )}
    </div>
  );
}
