"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, type TableColumn } from "@/components/ui/table";
import { usePreview } from "@/features/shared/components/preview-provider";
import { classPath, classroomTitle, displayDate } from "@/features/shared/constants/presentation";
import type { PreviewSession } from "@/features/shared/types/preview";

export function JadwalView() {
  const { classrooms, sessions } = usePreview();
  const rows = [...sessions].filter((session) => classrooms.some((classroom) => classroom.id === session.classroomId)).sort((a, b) => b.date.localeCompare(a.date));
  const columns: TableColumn<PreviewSession>[] = [
    { id: "date", label: "Tanggal", value: (session) => displayDate(session.date) },
    { id: "class", label: "Kelas", value: (session) => classroomTitle(classrooms.find((classroom) => classroom.id === session.classroomId)!) },
    { id: "subject", label: "Mata pelajaran", value: (session) => session.subject === "literasi" ? "Literasi" : "Numerasi" },
    { id: "duration", label: "Durasi", value: (session) => `${session.duration} menit` },
    { id: "open", label: "", value: () => "", render: (session) => <Button size="xs" variant="secondary" nativeButton={false} role="link" render={<Link href={`${classPath(session.classroomId)}/sesi/${session.id}`} />}>Lihat jadwal<ArrowRight size={14} aria-hidden="true" /></Button> },
  ];
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-[28px] font-extrabold">Jadwal</h1><p className="mt-1 text-sm text-muted">Semua jadwal belajar di kelas Anda.</p></div><Button variant="secondary" nativeButton={false} role="link" render={<Link href="/kelas" />}>Pilih kelas untuk membuat sesi</Button></header>
      {rows.length ? <Table emptyMessage="Tidak ada data yang ditampilkan." rows={rows} columns={columns} getRowId={(session) => session.id} caption="Jadwal seluruh kelas" /> : <Card><EmptyState title="Belum ada jadwal" description="Buka kelas dan pilih Sesi untuk menyusun jadwal belajar." icon={<CalendarDays size={28} aria-hidden="true" />} /></Card>}
    </div>
  );
}
