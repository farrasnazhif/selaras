"use client";

import { useId, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TaskVariationControls } from "./task-variation-controls";
import { TaskPhotoInput } from "./task-photo-input";
import { GROUP_LABELS } from "@/features/kelas/constants/groups";
import { taskEditorSchema, type TaskEditorInput } from "@/features/sesi/validations/task";
import type { ClassKey, GroupKey, PreviewStudent, Subject } from "@/features/shared/types/preview";
import type { PlannedTask } from "@/features/sesi/types/schedule";

type Props = { task?: PlannedTask; classKey: ClassKey; group: GroupKey; grade: string; focus: Subject; lessonSubject: string; blockMinutes: number; members: PreviewStudent[]; onSave: (task: PlannedTask) => void };

export function TaskEditor(props: Props) {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen} title={props.task ? "Ubah kegiatan kelompok" : "Tambah kegiatan kelompok"} description="Periksa kesesuaian tugas. Judul, soal, dan bacaan akan dicetak apa adanya; hindari nama siswa dan label level." trigger={<Button size="xs" variant="secondary" aria-label={`${props.task ? "Ubah" : "Tambah"} kegiatan Kelompok ${GROUP_LABELS[props.group]} Kelas ${props.grade}`}>{props.task ? <Pencil size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}{props.task ? "Ubah" : "Tambah kegiatan"}</Button>}>
    {open && <TaskEditorForm {...props} onClose={() => setOpen(false)} />}
  </Dialog>;
}

function TaskEditorForm({ task, classKey, group, grade, focus, lessonSubject, blockMinutes, members, onSave, onClose }: Props & { onClose: () => void }) {
  const id = useId();
  const [photoBusy, setPhotoBusy] = useState(false);
  const [usedAi, setUsedAi] = useState(false);
  const levelField = focus === "literasi" ? "literacy" : "numeracy";
  const levels = ["1", "2", "3", "4", "5", "6"].filter((level) => members.some((student) => student[levelField] === level));
  const level = (task?.level ?? levels[0] ?? "1") as TaskEditorInput["level"];
  const template = task?.template;
  const content = template?.content;
  const defaultKind = level === "6" ? "written" : level === "1" || level === "2" ? focus === "numerasi" ? "count-match" : "picture-match" : "written";
  const kind = content?.kind ?? defaultKind;
  const defaults: TaskEditorInput = {
    level, title: template?.title ?? "", kind, instruction: template?.instruction ?? "Kerjakan kegiatan berikut.",
    passage: content?.kind === "written" ? content.passage ?? "" : "",
    questions: content?.kind === "written" ? content.questions.join("\n") : "",
    photo: template?.photo ?? null,
    values: content && content.kind !== "written" && content.values ? content.values.join(", ") : kind === "picture-match" ? "0, 1, 2" : "2, 5, 8",
  };
  const { register, control, handleSubmit, setValue, getValues, formState: { errors } } = useForm<TaskEditorInput>({ resolver: zodResolver(taskEditorSchema), defaultValues: defaults });
  const selectedKind = useWatch({ control, name: "kind" });
  const selectedLevel = useWatch({ control, name: "level" });
  const lowLevel = selectedLevel === "1" || selectedLevel === "2";
  function save(input: TaskEditorInput) {
    const taskId = task?.id ?? crypto.randomUUID();
    const cohort = members.filter((student) => student[levelField] === input.level);
    if (!cohort.length) return;
    onSave({ id: taskId, classKey, group, level: input.level, memberIds: cohort.map((student) => student.id), template: {
      id: input.level === "6" ? `class-task-${grade}` : `edited-${taskId}`,
      aiGenerated: usedAi || template?.aiGenerated ? true : undefined,
      title: input.title, instruction: input.instruction, requiresReading: input.kind === "written", photo: input.photo ?? undefined,
      content: input.kind === "written" ? { kind: "written", passage: input.passage, questions: input.questions.split("\n").map((question) => question.trim()).filter(Boolean) } : { kind: input.kind, values: input.values.split(",").map(Number) },
    } });
    onClose();
  }
  return <form onSubmit={handleSubmit(save)} noValidate className="space-y-ui-sm">
    <div className="field"><label htmlFor={`${id}-level`}>Untuk anggota</label><Controller control={control} name="level" render={({ field }) => <Select value={field.value} disabled={!!task} options={levels.map((value) => ({ value, label: `Level ${value}` }))} onValueChange={(value) => {
      if (!value) return;
      field.onChange(value);
      if (value === "1" || value === "2") { setValue("kind", focus === "numerasi" ? "count-match" : "picture-match"); setValue("values", focus === "numerasi" ? "2, 5, 8" : "0, 1, 2"); }
      if (value === "6") setValue("kind", "written");
    }} triggerProps={{ id: `${id}-level`, ref: field.ref, onBlur: field.onBlur }} />} /><p className="text-xs text-muted">{members.filter((student) => student[levelField] === selectedLevel).map((student) => student.name).join(", ")}</p></div>
    <div className="field"><label htmlFor={`${id}-title`}>Judul kegiatan</label><Input id={`${id}-title`} maxLength={80} aria-invalid={!!errors.title} aria-describedby={errors.title ? `${id}-title-error` : undefined} {...register("title")} />{errors.title && <p id={`${id}-title-error`} className="field-error">{errors.title.message}</p>}</div>
    <div className="field"><label htmlFor={`${id}-kind`}>Jenis kegiatan</label><Controller control={control} name="kind" render={({ field }) => <Select value={field.value} options={selectedLevel === "6" ? [{ value: "written", label: "Tugas sesuai kelas" }] : [
      { value: "picture-match", label: "Pasangkan gambar" }, { value: "count-match", label: "Pasangkan banyak benda" }, { value: "count-number", label: "Pasangkan benda dan angka" }, ...(!lowLevel ? [{ value: "written", label: "Bacaan / soal tertulis" }] : []),
    ]} onValueChange={(value) => { if (value) { field.onChange(value); if (value === "picture-match") setValue("values", "0, 1, 2"); else if (value !== "written") setValue("values", "2, 5, 8"); } }} triggerProps={{ id: `${id}-kind`, ref: field.ref, onBlur: field.onBlur, "aria-invalid": !!errors.kind, "aria-describedby": errors.kind ? `${id}-kind-error` : undefined }} />} />{errors.kind && <p id={`${id}-kind-error`} className="field-error">{errors.kind.message}</p>}{lowLevel && <p className="text-xs text-muted">Petunjuk dijelaskan lisan saat pembukaan. Tugas tidak mengharuskan membaca.</p>}</div>
    <div className="field"><label htmlFor={`${id}-instruction`}>{selectedKind === "written" ? "Petunjuk untuk siswa" : "Petunjuk lisan untuk guru"}</label><Textarea id={`${id}-instruction`} maxLength={1000} aria-invalid={!!errors.instruction} aria-describedby={errors.instruction ? `${id}-instruction-error` : undefined} {...register("instruction")} />{errors.instruction && <p id={`${id}-instruction-error`} className="field-error">{errors.instruction.message}</p>}</div>
    {selectedKind === "written" ? <>
      <div className="field"><label htmlFor={`${id}-passage`}>Bacaan (opsional)</label><Textarea id={`${id}-passage`} maxLength={2000} aria-invalid={!!errors.passage} aria-describedby={errors.passage ? `${id}-passage-error` : undefined} {...register("passage")} />{errors.passage && <p id={`${id}-passage-error`} className="field-error">{errors.passage.message}</p>}</div>
      <div className="field"><label htmlFor={`${id}-questions`}>Soal / kegiatan, satu per baris</label><Textarea id={`${id}-questions`} maxLength={10000} aria-invalid={!!errors.questions} aria-describedby={errors.questions ? `${id}-questions-error` : undefined} {...register("questions")} />{errors.questions && <p id={`${id}-questions-error`} className="field-error">{errors.questions.message}</p>}</div>
    </> : <div className="field"><label htmlFor={`${id}-values`}>{selectedKind === "picture-match" ? "Pola bentuk" : "Jumlah benda"}</label><Input id={`${id}-values`} aria-invalid={!!errors.values} aria-describedby={`${id}-values-help${errors.values ? ` ${id}-values-error` : ""}`} {...register("values")} /><p id={`${id}-values-help`} className="text-xs text-muted">{selectedKind === "picture-match" ? "0 lingkaran, 1 segitiga, 2 persegi. Pisahkan dengan koma; maksimal 6 bentuk." : "Isi angka 1–9, pisahkan dengan koma; maksimal 6 baris. Pasangan disusun otomatis."}</p>{errors.values && <p id={`${id}-values-error`} className="field-error">{errors.values.message}</p>}</div>}
    <TaskVariationControls disabled={photoBusy} getRequest={() => {
      const values = getValues();
      return {
        lessonSubject, focus, level: values.level, grade, blockMinutes,
        source: {
          title: values.title, instruction: values.instruction, kind: values.kind,
          passage: values.kind === "written" ? values.passage : "",
          questions: values.kind === "written" ? values.questions.split("\n").map((line) => line.trim()).filter(Boolean) : [],
          values: values.kind !== "written" ? values.values.split(",").map(Number) : [],
        },
      };
    }} onApply={(variation) => {
      setValue("title", variation.title, { shouldDirty: true, shouldValidate: true });
      setValue("instruction", variation.instruction, { shouldDirty: true, shouldValidate: true });
      setValue("passage", variation.passage, { shouldDirty: true, shouldValidate: true });
      setValue("questions", variation.questions.join("\n"), { shouldDirty: true, shouldValidate: true });
      setValue("values", variation.values.join(", "), { shouldDirty: true, shouldValidate: true });
      setUsedAi(true);
    }} />
    <Controller control={control} name="photo" render={({ field }) => <TaskPhotoInput value={field.value ?? undefined} onChange={(value) => field.onChange(value ?? null)} lowLevel={lowLevel} onBusyChange={setPhotoBusy} error={errors.photo?.message ?? errors.photo?.alt?.message ?? errors.photo?.src?.message ?? errors.photo?.nonReadingConfirmed?.message} />} />
    <div className="flex flex-wrap justify-end gap-ui-sm"><Button type="button" variant="secondary" onClick={onClose}>Batal</Button><Button type="submit" variant="primary" disabled={photoBusy} loading={photoBusy}>Simpan kegiatan</Button></div>
  </form>;
}
