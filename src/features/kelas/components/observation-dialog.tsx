"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardPen, History, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { observationSchema, type ObservationInput } from "@/features/kelas/validations/observation";
import type { PreviewStudent } from "@/features/shared/types/preview";
import { LITERACY_LEVELS, NUMERACY_LEVELS } from "@/features/kelas/constants/reference-content";
import { usePreview } from "@/features/shared/components/preview-provider";

export function ObservationDialog({ student, mode = "history" }: { student: PreviewStudent; mode?: "history" | "create" }) {
  const [open, setOpen] = useState(false);
  const [writing, setWriting] = useState(mode === "create");
  const label = mode === "create" ? "Observasi" : "Riwayat observasi";
  const { grades, observations, addObservation, assessments, saving } = usePreview();
  const levelHistory = assessments.filter((entry) => entry.studentId === student.id);
  const records = observations.filter((record) => record.studentId === student.id);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ObservationInput>({ resolver: zodResolver(observationSchema), defaultValues: { note: "" } });
  async function record(input: ObservationInput) {
    if (!await addObservation(student.id, input.note)) return;
    reset();
    if (mode === "create") setOpen(false);
    else setWriting(false);
  }
  return (
    <Dialog busy={saving} open={open} onOpenChange={(next) => { setOpen(next); if (next) setWriting(mode === "create"); }} title={writing ? "Tambah catatan" : "Riwayat observasi"} description={`${student.name} · Kelas ${grades[student.classKey]}`} trigger={<Button size="xs" variant="secondary" aria-label={`${label} ${student.name}`}>{mode === "create" ? <ClipboardPen size={15} aria-hidden="true" /> : <History size={15} aria-hidden="true" />}{label}</Button>}>
      {writing ? (
        <form className="space-y-ui-md" onSubmit={handleSubmit(record)} noValidate>
          <div className="grid grid-cols-2 gap-ui-sm">{[{ label: "Literasi", levels: LITERACY_LEVELS, value: student.literacy }, { label: "Numerasi", levels: NUMERACY_LEVELS, value: student.numeracy }].map((subject) => <div key={subject.label}><p className="mb-2 text-xs text-muted">{subject.label}</p><Badge tone="primary">{subject.levels.find((level) => level.value === subject.value)?.label ?? "Belum dinilai"}</Badge></div>)}</div>
          <div className="field"><label htmlFor={`note-${student.id}`}>Apa yang Anda amati?</label><Textarea disabled={saving} autoFocus id={`note-${student.id}`} placeholder="Tuliskan perkembangan atau hal yang perlu dibantu…" aria-invalid={!!errors.note} aria-describedby={errors.note ? `note-error-${student.id}` : undefined} {...register("note")} />{errors.note && <p id={`note-error-${student.id}`} className="field-error">{errors.note.message}</p>}</div>
          <div className="flex flex-wrap justify-end gap-ui-sm"><Button type="button" variant="secondary" disabled={saving} onClick={() => { if (mode === "create") setOpen(false); else setWriting(false); }}>{mode === "create" ? "Batal" : "Kembali"}</Button><Button type="submit" variant="primary" disabled={saving} loading={saving}>Simpan catatan</Button></div>
        </form>
      ) : (
        <div className="space-y-ui-md">
          <Button autoFocus variant="primary" onClick={() => setWriting(true)}><Plus size={16} aria-hidden="true" />Tambah catatan</Button>
          <section><h3 className="mb-ui-sm text-base font-extrabold">Catatan pengamatan</h3>{records.length ? <ol className="space-y-ui-sm">{[...records].reverse().map((entry) => <li key={entry.id} className="rounded-control border-2 border-line p-ui-sm"><time dateTime={entry.recordedAt} className="text-xs text-muted">{new Date(entry.recordedAt).toLocaleDateString("id-ID")}</time><p className="mt-2 whitespace-pre-wrap break-words text-sm">{entry.note}</p></li>)}</ol> : <p className="text-sm text-muted">Belum ada catatan. Pilih Tambah catatan untuk mencatat perkembangan siswa.</p>}</section>
          <section><h3 className="mb-ui-sm text-base font-extrabold">Perubahan level</h3>{levelHistory.length ? <ol className="space-y-ui-sm">{[...levelHistory].reverse().map((entry) => <li key={entry.id} className="rounded-control border-2 border-line p-ui-sm"><time dateTime={entry.recordedAt} className="text-xs text-muted">{new Date(entry.recordedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</time><p className="mt-1 text-sm font-semibold">{entry.subject === "literasi" ? "Literasi" : "Numerasi"} · {(entry.subject === "literasi" ? LITERACY_LEVELS : NUMERACY_LEVELS).find((level) => level.value === entry.level)?.label}</p></li>)}</ol> : <p className="text-sm text-muted">Belum ada penilaian level.</p>}</section>
        </div>
      )}
    </Dialog>
  );
}
