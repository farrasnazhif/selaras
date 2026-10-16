"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { usePreview } from "@/features/shared/components/preview-provider";
import { classPath, classroomTitle, displayDate } from "@/features/shared/constants/presentation";
import { getWeekDays, shiftDay } from "@/lib/calendar";

export function JadwalView() {
  const { classrooms, sessions } = usePreview();
  const [anchor, setAnchor] = useState(sessions.at(-1)?.date ?? new Date().toISOString().slice(0, 10));
  const days = getWeekDays(anchor);
  const rows = sessions.filter((session) => classrooms.some((classroom) => classroom.id === session.classroomId));
  return (
    <div className="space-y-ui-md">
      <header className="flex flex-wrap items-center justify-between gap-ui-sm">
        <div><h1 className="text-[28px] font-extrabold">Jadwal</h1><p className="mt-1 text-sm text-muted">Rencana mengajar selama satu pekan.</p></div>
        <Button variant="secondary" nativeButton={false} role="link" render={<Link href="/kelas" />}>Susun jadwal dari kelas</Button>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-ui-sm">
        <p aria-live="polite" className="flex flex-wrap items-center gap-2 text-sm font-extrabold"><time dateTime={days[0]}>{displayDate(days[0])}</time><ArrowRight size={16} aria-label="sampai" /><time dateTime={days[6]}>{displayDate(days[6])}</time></p>
        <div className="flex items-center gap-2" role="group" aria-label="Pilih pekan">
          <IconButton variant="secondary" label="Pekan sebelumnya" onClick={() => setAnchor(shiftDay(days[0], -7))}><ChevronLeft size={18} /></IconButton>
          <Button variant="secondary" onClick={() => setAnchor(new Date().toLocaleDateString("en-CA"))}>Pekan ini</Button>
          <IconButton variant="secondary" label="Pekan berikutnya" onClick={() => setAnchor(shiftDay(days[0], 7))}><ChevronRight size={18} /></IconButton>
        </div>
      </div>
      <div className="grid gap-ui-sm sm:grid-cols-2 lg:grid-cols-7">
        {days.map((date) => {
          const items = rows.filter((session) => session.date === date);
          return <section key={date} aria-labelledby={`day-${date}`} className="min-w-0 overflow-hidden rounded-window border border-line bg-surface">
            <h2 id={`day-${date}`} className="space-y-1 border-b border-line bg-inset p-ui-sm">
              <span className="block text-sm font-extrabold">{new Date(`${date}T00:00:00Z`).toLocaleDateString("id-ID", { weekday: "long", timeZone: "UTC" })}</span>
              <time dateTime={date} className="block text-xs font-semibold text-muted">{displayDate(date)}</time>
            </h2>
            <div className="space-y-ui-sm p-ui-sm">
              {items.length ? items.map((session) => <Link key={session.id} href={`${classPath(session.classroomId)}/sesi/${session.id}`} className="block rounded-card">
                <Card className="space-y-ui-sm p-ui-sm">
                  <h3 className="break-words text-sm font-extrabold">{classroomTitle({ id: session.classroomId, grades: session.grades })}</h3>
                  <p className="text-sm font-bold text-accent-ink">{session.subject === "literasi" ? "Literasi" : "Numerasi"}</p>
                  <p className="flex items-center gap-2 text-xs text-muted"><Clock3 size={14} className="shrink-0" aria-hidden="true" /><span>{session.duration} menit</span></p>
                </Card>
              </Link>) : <p className="py-ui-sm text-xs text-muted">Belum ada jadwal</p>}
            </div>
          </section>;
        })}
      </div>
    </div>
  );
}
