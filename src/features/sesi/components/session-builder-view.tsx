"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Eye, Printer, Save } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Collapsible } from "@/components/ui/collapsible";
import { classPath, classroomTitle, displayDate } from "@/features/shared/constants/presentation";
import { sessionPreviewSchema, type SessionPreviewInput } from "@/features/sesi/validations/session";
import { usePreview } from "@/features/shared/components/preview-provider";
import { ClassUnavailable } from "@/features/shared/components/class-unavailable";
import { RotationGrid } from "./rotation-grid";
import { SessionTaskSummary } from "./session-task-summary";

const defaults: SessionPreviewInput = {
  lessonSubject: "Bahasa Indonesia",
  topic: "",
  focus: "literasi",
  duration: "70",
  blockMinutes: "15",
  date: "2026-10-14",
};

export function SessionBuilderView() {
  const { classroom, students, saveSession } = usePreview();
  const router = useRouter();
  const [preview, setPreview] = useState(defaults);
  const [printing, setPrinting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { control, register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<SessionPreviewInput>({
    resolver: zodResolver(sessionPreviewSchema), defaultValues: defaults,
  });
  if (!classroom) return <ClassUnavailable />;
  const available = students.length > 0;
  const path = classPath(classroom.id);
  const focusLabel = preview.focus === "literasi" ? "Literasi" : "Numerasi";
  function save() {
    if (!available || isDirty || saving) return;
    setSaving(true);
    const id = saveSession(preview);
    router.push(`${path}/sesi/${id}`);
  }
  return (
    <div className="space-y-ui-md">
      <div className="print-hidden"><Breadcrumbs items={[{ label: "Kelas", href: "/kelas" }, { label: classroomTitle(classroom), href: path }, { label: "Sesi", href: `${path}/sesi` }, { label: "Susun jadwal" }]} /></div>
      <header className="print-hidden">
        <h1 className="text-[28px] font-extrabold">Susun jadwal belajar</h1>
        <p className="mt-1 text-sm text-muted">Isi pelajaran dan pilih kemampuan yang ingin didampingi.</p>
      </header>
      <Card className="print-hidden p-ui-md">
        <form onSubmit={handleSubmit((input) => { setPreview(input); reset(input); setPrinting(false); })} noValidate className="grid items-start gap-ui-sm sm:grid-cols-2">
          <div className="field">
            <label htmlFor="session-lesson-subject">Mata pelajaran</label>
            <Input id="session-lesson-subject" placeholder="Bahasa Indonesia, Matematika, PPKn…" required maxLength={80} aria-invalid={!!errors.lessonSubject} aria-describedby={errors.lessonSubject ? "session-lesson-subject-error" : "session-lesson-subject-help"} {...register("lessonSubject")} />
            <p id="session-lesson-subject-help" className="text-xs text-muted">Gunakan nama pelajaran sesuai kurikulum sekolah.</p>
            {errors.lessonSubject && <p id="session-lesson-subject-error" className="field-error">{errors.lessonSubject.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="session-topic">Tema/topik (opsional)</label>
            <Input id="session-topic" placeholder="Lingkungan sekolah" maxLength={160} aria-invalid={!!errors.topic} aria-describedby={errors.topic ? "session-topic-error" : undefined} {...register("topic")} />
            {errors.topic && <p id="session-topic-error" className="field-error">{errors.topic.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="session-focus">Fokus kemampuan</label>
            <Controller control={control} name="focus" render={({ field }) => <Select
              options={[{ value: "literasi", label: "Literasi" }, { value: "numerasi", label: "Numerasi", tone: "cyan" }]}
              value={field.value}
              onValueChange={(value) => { if (value) field.onChange(value); }}
              triggerProps={{ id: "session-focus", ref: field.ref, onBlur: field.onBlur, "aria-invalid": !!errors.focus, "aria-describedby": errors.focus ? "session-focus-error" : "session-focus-help" }}
            />} />
            <p id="session-focus-help" className="text-xs text-muted">Kelompok dan panduan tugas mengikuti level kemampuan ini.</p>
            {errors.focus && <p id="session-focus-error" className="field-error">{errors.focus.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="session-date">Tanggal belajar</label>
            <Input id="session-date" type="date" required aria-invalid={!!errors.date} aria-describedby={errors.date ? "session-date-error" : undefined} {...register("date")} />
            {errors.date && <p id="session-date-error" className="field-error">{errors.date.message}</p>}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-ui-sm sm:col-span-2">
            <p className="text-sm text-muted">70 menit, bergantian mendampingi kelas setiap 15 menit.</p>
            <Button type="submit" variant="primary"><CalendarDays size={17} aria-hidden="true" />Lihat jadwal</Button>
          </div>
        </form>
      </Card>
      {isDirty && <p role="status" className="print-hidden text-sm text-muted">Pilihan berubah. Pilih Lihat jadwal untuk memperbaruinya.</p>}
      <section className="space-y-ui-sm" aria-label="Rencana yang ditinjau">
        <header className="space-y-2">
          <h2 className="break-words text-xl font-bold">{preview.lessonSubject}</h2>
          {preview.topic && <p className="break-words text-sm font-semibold">{preview.topic}</p>}
          <div className="flex flex-wrap gap-x-ui-sm gap-y-1 text-sm text-muted">
            <span>{classroomTitle(classroom)}</span>
            <time dateTime={preview.date}>{displayDate(preview.date)}</time>
            <span>Fokus {focusLabel}</span>
          </div>
          <p className="text-sm text-muted">Siapkan materi dan tugas {preview.lessonSubject} sesuai tujuan belajar tiap kelas. Jadwal ini menyediakan pembagian waktu dan panduan kemampuan.</p>
        </header>
        {available ? <RotationGrid focus={preview.focus} lessonSubject={preview.lessonSubject} topic={preview.topic} /> : <Card><EmptyState title="Belum ada siswa" description="Tambahkan siswa di tab Siswa sebelum menyusun jadwal." /></Card>}
      </section>
      {available && <>
        <div className="print-hidden">{printing && !isDirty ? <SessionTaskSummary focus={preview.focus} lessonSubject={preview.lessonSubject} topic={preview.topic} /> : <Collapsible label="Lihat tugas tiap kelompok"><SessionTaskSummary focus={preview.focus} lessonSubject={preview.lessonSubject} topic={preview.topic} /></Collapsible>}</div>
        <div className="hidden print:block"><SessionTaskSummary focus={preview.focus} lessonSubject={preview.lessonSubject} topic={preview.topic} /></div>
      </>}
      <div className="print-hidden flex flex-wrap items-center justify-between gap-ui-sm border-t-2 border-line pt-ui-md">
        <Link href={`${path}/sesi`} className="text-sm font-semibold text-accent-ink underline underline-offset-4">Kembali ke daftar sesi</Link>
        <div className="flex flex-wrap gap-ui-sm">
          <Button variant="secondary" disabled={!available || isDirty} onClick={() => setPrinting((current) => !current)}><Eye size={16} aria-hidden="true" />{printing ? "Tutup tampilan cetak" : "Lihat sebelum dicetak"}</Button>
          {printing && <Button variant="secondary" disabled={!available || isDirty} onClick={() => window.print()}><Printer size={16} aria-hidden="true" />Cetak / Simpan PDF</Button>}
          <Button variant="primary" loading={saving} disabled={!available || isDirty || saving} onClick={save}><Save size={16} aria-hidden="true" />Simpan jadwal</Button>
        </div>
      </div>
    </div>
  );
}
