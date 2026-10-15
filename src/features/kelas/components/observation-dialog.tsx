"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardPen, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { observationSchema, type ObservationInput } from "@/features/kelas/validations/observation";
import type { PreviewStudent } from "@/features/shared/types/preview";
import { LITERACY_LEVELS, NUMERACY_LEVELS } from "@/features/kelas/constants/reference-content";
import { usePreview } from "@/features/shared/components/preview-provider";

export function ObservationDialog({ student, history = false }: { student: PreviewStudent; history?: boolean }) {
  const [open, setOpen] = useState(false);
  const { grades, observations, addObservation, assessments } = usePreview();
  const levelHistory = assessments.filter((entry) => entry.studentId === student.id);
  const records = observations.filter((record) => record.studentId === student.id);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ObservationInput>({ resolver: zodResolver(observationSchema), defaultValues: { note: "" } });
  function record(input: ObservationInput) {
    addObservation(student.id, input.note);
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} title={history ? `Catatan ${student.name}` : "Catat observasi siswa"} description={`${student.name} · Kelas ${grades[student.classKey]} · siswa fiktif`} trigger={<Button size="xs" variant={history ? "quiet" : "secondary"} aria-label={`${history ? "Lihat catatan" : "Catat observasi"} ${student.name}`}>{history ? <History size={14} aria-hidden="true" /> : <ClipboardPen size={14} aria-hidden="true" />}{history ? "Riwayat" : "Observasi"}</Button>}>
      {history ? (
        <div className="space-y-6"><section><h3 className="mb-3 font-bold">Riwayat level</h3>{levelHistory.length ? <ol className="space-y-3">{levelHistory.map((entry) => <li key={entry.id} className="rounded-control border border-line p-3"><time dateTime={entry.recordedAt} className="text-xs text-muted">{new Date(entry.recordedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</time><p className="mt-1 text-sm font-semibold">{entry.subject === "literasi" ? "Literasi" : "Numerasi"} · {(entry.subject === "literasi" ? LITERACY_LEVELS : NUMERACY_LEVELS).find((level) => level.value === entry.level)?.label}</p></li>)}</ol> : <p className="text-sm text-muted">Belum ada penilaian level.</p>}</section><section><h3 className="mb-3 font-bold">Catatan observasi</h3>{records.length ? <ol className="space-y-3">{records.map((entry) => <li key={entry.id} className="rounded-control border border-line p-3"><time dateTime={entry.recordedAt} className="text-xs text-muted">{new Date(entry.recordedAt).toLocaleDateString("id-ID")}</time><p className="mt-2 whitespace-pre-wrap break-words text-sm">{entry.note}</p></li>)}</ol> : <EmptyState icon={<History size={24} />} title="Belum ada catatan" description="Catat observasi untuk melihat riwayat dalam pratinjau ini." />}</section></div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit(record)} noValidate>
          <div className="grid grid-cols-2 gap-3"><div><p className="mb-2 text-xs text-muted">Literasi</p><Badge tone="neutral">{LITERACY_LEVELS.find((level) => level.value === student.literacy)?.label ?? "Belum dinilai"}</Badge></div><div><p className="mb-2 text-xs text-muted">Numerasi</p><Badge tone="neutral">{NUMERACY_LEVELS.find((level) => level.value === student.numeracy)?.label ?? "Belum dinilai"}</Badge></div></div>
          <div className="field"><label htmlFor={`note-${student.id}`}>Catatan observasi</label><Textarea id={`note-${student.id}`} placeholder="Tuliskan hal yang Anda amati pada siswa…" aria-invalid={!!errors.note} aria-describedby={errors.note ? `note-error-${student.id}` : undefined} {...register("note")} />{errors.note && <p id={`note-error-${student.id}`} className="field-error">{errors.note.message}</p>}</div>
          <p className="text-xs leading-relaxed text-muted">Catatan hanya tersedia selama pratinjau ini terbuka. Gunakan contoh, bukan data siswa nyata.</p>
          <div className="flex flex-wrap justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Batal</Button><Button type="submit" variant="primary">Tambahkan catatan</Button></div>
        </form>
      )}
    </Dialog>
  );
}
