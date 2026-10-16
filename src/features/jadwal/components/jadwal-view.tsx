"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible } from "@/components/ui/collapsible";
import { EmptyState } from "@/components/ui/empty-state";
import { RotationGrid } from "@/features/sesi/components/rotation-grid";
import { SessionTaskSummary } from "@/features/sesi/components/session-task-summary";
import { usePreview } from "@/features/shared/components/preview-provider";
import { classPath, classroomTitle, displayDate } from "@/features/shared/constants/presentation";

export function JadwalView() {
  const { classrooms, sessions } = usePreview();
  const rows = [...sessions].filter((session) => classrooms.some((classroom) => classroom.id === session.classroomId)).sort((a, b) => b.date.localeCompare(a.date));
  const dates = [...new Set(rows.map((session) => session.date))];
  return (
    <div className="space-y-ui-group">
      <header className="flex flex-wrap items-center justify-between gap-ui-sm">
        <div><h1 className="text-[28px] font-extrabold">Jadwal</h1><p className="mt-1 text-sm text-muted">Semua jadwal belajar di kelas Anda, disusun per tanggal.</p></div>
        <Button variant="secondary" nativeButton={false} role="link" render={<Link href="/kelas" />}>Pilih kelas untuk membuat sesi</Button>
      </header>
      {dates.length ? dates.map((date) => (
        <section key={date} aria-label={`Jadwal ${displayDate(date)}`} className="space-y-ui-md">
          <h2 className="flex items-center gap-ui-sm border-b-2 border-line pb-ui-sm text-xl font-extrabold"><CalendarDays size={22} aria-hidden="true" /><time dateTime={date}>{displayDate(date)}</time></h2>
          {rows.filter((session) => session.date === date).map((session) => {
            const title = classroomTitle({ id: session.classroomId, grades: session.grades });
            const subject = session.lessonSubject;
            const focus = session.focus === "literasi" ? "Literasi" : "Numerasi";
            return (
              <article key={session.id} aria-label={`${title}, ${subject}`} className="space-y-ui-sm rounded-window border-2 border-line bg-surface p-ui-sm md:p-ui-md">
                <header className="flex flex-wrap items-center justify-between gap-ui-sm">
                  <div className="min-w-0"><h3 className="break-words text-lg font-extrabold">{subject}</h3>{session.topic && <p className="mt-1 break-words text-sm font-semibold">{session.topic}</p>}<div className="mt-1 flex flex-wrap gap-x-ui-sm gap-y-1 text-sm text-muted"><span>{title}</span><span>Fokus {focus}</span><span>{session.duration} menit</span><span>{session.roster.length} siswa</span></div></div>
                  <Button size="xs" variant="secondary" nativeButton={false} role="link" aria-label={`Buka ${title}, ${subject}, ${displayDate(date)}`} render={<Link href={`${classPath(session.classroomId)}/sesi/${session.id}`} />}>Buka sesi<ArrowRight size={14} aria-hidden="true" /></Button>
                </header>
                <RotationGrid focus={session.focus} lessonSubject={session.lessonSubject} topic={session.topic} roster={session.roster} gradePair={session.grades} />
                <div className="print-hidden"><Collapsible label="Lihat tugas tiap kelompok"><SessionTaskSummary focus={session.focus} lessonSubject={session.lessonSubject} topic={session.topic} roster={session.roster} gradePair={session.grades} /></Collapsible></div>
                <div className="hidden print:block"><SessionTaskSummary focus={session.focus} lessonSubject={session.lessonSubject} topic={session.topic} roster={session.roster} gradePair={session.grades} /></div>
              </article>
            );
          })}
        </section>
      )) : <Card><EmptyState title="Belum ada jadwal" description="Buka kelas dan pilih Sesi untuk menyusun jadwal belajar." icon={<CalendarDays size={28} aria-hidden="true" />} /></Card>}
    </div>
  );
}
