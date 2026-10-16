"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Eye, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Collapsible } from "@/components/ui/collapsible";
import { classPath } from "@/features/shared/constants/presentation";
import { sessionPreviewSchema, type SessionPreviewInput } from "@/features/sesi/validations/session";
import { usePreview } from "@/features/shared/components/preview-provider";
import { ClassUnavailable } from "@/features/shared/components/class-unavailable";
import { RotationGrid } from "./rotation-grid";
import { SessionTaskSummary } from "./session-task-summary";

const defaults: SessionPreviewInput = { subject: "literasi", duration: "70", blockMinutes: "15", date: "2026-10-14" };

export function SessionBuilderView() {
  const { classroom, students, saveSession } = usePreview();
  const router = useRouter();
  const [preview, setPreview] = useState(defaults);
  const [printing, setPrinting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { control, register, handleSubmit, formState: { errors } } = useForm<SessionPreviewInput>({ resolver: zodResolver(sessionPreviewSchema), defaultValues: defaults });
  const values = useWatch({ control });
  const changed = Object.keys(defaults).some((key) => values[key as keyof SessionPreviewInput] !== preview[key as keyof SessionPreviewInput]);
  if (!classroom) return <ClassUnavailable />;
  const available = preview.subject === "literasi" && classroom.grades.first === "2" && classroom.grades.second === "3" && students.length > 0;
  const path = classPath(classroom.id);
  function save() {
    if (!available || changed || saving) return;
    setSaving(true);
    const id = saveSession(preview);
    router.push(`${path}/sesi/${id}`);
  }
  return (
    <div className="space-y-ui-md">
      <header><h1 className="text-[28px] font-extrabold">Susun jadwal belajar</h1><p className="mt-1 text-sm text-muted">Pilih pelajaran dan tanggal, lalu periksa jadwal belajar.</p></header>
      <Card className="print-hidden p-ui-md">
        <form onSubmit={handleSubmit((input) => { setPreview(input); setPrinting(false); })} noValidate className="grid items-end gap-ui-sm sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          <div className="field"><label htmlFor="session-subject">Mata pelajaran</label><Controller control={control} name="subject" render={({ field }) => <Select options={[{ value: "literasi", label: "Literasi" }, { value: "numerasi", label: "Numerasi", tone: "cyan" }]} value={field.value} onValueChange={(value) => { if (value) field.onChange(value); }} triggerProps={{ id: "session-subject", ref: field.ref, onBlur: field.onBlur }} />} /></div>
          <div className="field"><label htmlFor="session-date">Tanggal belajar</label><Input id="session-date" type="date" aria-invalid={!!errors.date} aria-describedby={errors.date ? "session-date-error" : undefined} {...register("date")} />{errors.date && <p id="session-date-error" className="field-error">{errors.date.message}</p>}</div>
          <Button type="submit" variant="primary"><CalendarDays size={17} aria-hidden="true" />Lihat jadwal</Button>
          <div className="flex flex-wrap gap-ui-sm text-sm text-muted sm:col-span-2 lg:col-span-3"><span>Durasi 70 menit</span><span>Bergantian mendampingi kelas setiap 15 menit</span></div>
        </form>
      </Card>
      {changed && <p role="status" className="text-sm text-muted">Pilihan berubah. Pilih Lihat jadwal untuk memperbaruinya.</p>}
      {available ? <><RotationGrid builder /><div className="print-hidden">{printing ? <SessionTaskSummary /> : <Collapsible label="Lihat tugas tiap kelompok"><SessionTaskSummary /></Collapsible>}</div><div className="hidden print:block"><SessionTaskSummary /></div></> : <Card><EmptyState title="Materi belum tersedia" description={students.length ? "Saat ini tersedia jadwal Literasi untuk Kelas 2 dan 3." : "Tambahkan siswa di tab Siswa sebelum menyusun jadwal."} /></Card>}
      <div className="print-hidden flex flex-wrap items-center justify-between gap-ui-sm border-t border-line pt-ui-md">
        <Link href={`${path}/sesi`} className="text-sm font-semibold text-accent-ink underline underline-offset-4">Kembali ke daftar sesi</Link>
        <div className="flex flex-wrap gap-ui-sm"><Button variant="secondary" disabled={!available || changed} onClick={() => setPrinting((current) => !current)}><Eye size={16} aria-hidden="true" />{printing ? "Tutup tampilan cetak" : "Lihat sebelum dicetak"}</Button>{printing && <Button variant="secondary" onClick={() => window.print()}>Cetak / Simpan PDF</Button>}<Button variant="primary" loading={saving} disabled={!available || changed || saving} onClick={save}><Save size={16} aria-hidden="true" />Simpan jadwal</Button></div>
      </div>
    </div>
  );
}
