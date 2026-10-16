"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Eye, Printer, Save } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/ui/notice";
import { Collapsible } from "@/components/ui/collapsible";
import { classPath, classroomTitle, displayDate } from "@/features/shared/constants/presentation";
import { sessionPreviewSchema, type SessionPreviewInput } from "@/features/sesi/validations/session";
import { usePreview } from "@/features/shared/components/preview-provider";
import { ClassUnavailable } from "@/features/shared/components/class-unavailable";
import { RotationGrid } from "./rotation-grid";
import { SessionTaskSummary } from "./session-task-summary";
import { SESSION_DEFAULTS } from "@/features/sesi/constants/reference-content";
import { buildSessionPlan, getStudentPacket, validateSessionPlan } from "@/features/sesi/constants/scheduler";
import { LESSON_SUBJECTS, OTHER_SUBJECT } from "@/features/sesi/constants/lesson-subjects";
import { groupStudentsBySubject } from "@/features/kelas/constants/groups";
import { Dialog } from "@/components/ui/dialog";
import { ScheduleEditor } from "./schedule-editor";
import type { SessionPlan } from "@/features/sesi/types/schedule";
import { CLASS_KEYS } from "@/features/kelas/constants/preview";
import { PlanStatus } from "./plan-status";
import { StudentPacketView } from "./student-packet";

export function SessionBuilderView({ sessionId }: { sessionId?: string }) {
  const { classroom, grades: currentGrades, getStudentsForSubject, saveSession, sessions } = usePreview();
  const source = sessions.find((session) => session.id === sessionId && session.classroomId === classroom?.id);
  const initialInput = source ? sessionPreviewSchema.parse(source) : SESSION_DEFAULTS;
  const router = useRouter();
  const [draft, setDraft] = useState(() => {
    const roster = source?.roster ?? getStudentsForSubject(initialInput.focus);
    const grades = source?.grades ?? currentGrades;
    const result = source ? { plan: structuredClone(source.plan), validation: { errors: [] as string[] } } : buildSessionPlan(initialInput, roster, grades);
    return { input: initialInput, roster, grades, plan: result.plan, errors: result.validation.errors };
  });
  const [subjectChoice, setSubjectChoice] = useState(LESSON_SUBJECTS.some((option) => option.value === initialInput.lessonSubject) ? initialInput.lessonSubject : OTHER_SUBJECT);
  const [customSubject, setCustomSubject] = useState(subjectChoice === OTHER_SUBJECT ? initialInput.lessonSubject : "");
  const [manuallyEdited, setManuallyEdited] = useState(!!source);
  const [pendingInput, setPendingInput] = useState<SessionPreviewInput | null>(null);
  const [printing, setPrinting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveErrors, setSaveErrors] = useState<string[]>([]);
  const { control, register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<SessionPreviewInput>({
    resolver: zodResolver(sessionPreviewSchema), defaultValues: initialInput,
  });
  const selectedFocus = useWatch({ control, name: "focus" });
  if (!classroom || (sessionId && !source)) return <ClassUnavailable />;
  if (classroom.independent) return <Card><p className="text-sm">Gabungkan kelas ini dengan pasangannya sebelum menyusun sesi.</p><Button variant="secondary" nativeButton={false} role="link" className="mt-ui-sm" render={<Link href="/kelas" />}>Kembali ke Kelas</Button></Card>;
  const { input: preview, roster, grades, plan } = draft;
  const validation = plan ? validateSessionPlan(preview, roster, grades, plan) : { valid: false, errors: draft.errors, checks: [] };
  const available = !!plan && validation.valid;
  const packet = available ? getStudentPacket(preview, plan!, grades) : null;
  const formStudents = source ? selectedFocus === source.focus ? source.roster : groupStudentsBySubject(source.roster, selectedFocus) : getStudentsForSubject(selectedFocus);
  const path = classPath(classroom.id);
  const focusLabel = preview.focus === "literasi" ? "Literasi" : "Numerasi";
  function needsRebuild(input: SessionPreviewInput) {
    return !plan || input.focus !== preview.focus || input.duration !== preview.duration || input.blockMinutes !== preview.blockMinutes || JSON.stringify(input.phaseTasks) !== JSON.stringify(preview.phaseTasks);
  }
  function applyInput(input: SessionPreviewInput) {
    if (needsRebuild(input)) {
      const nextRoster = source ? input.focus === source.focus ? source.roster : groupStudentsBySubject(source.roster, input.focus) : getStudentsForSubject(input.focus);
      const nextGrades = source?.grades ?? currentGrades;
      const result = buildSessionPlan(input, nextRoster, nextGrades);
      if (!result.plan) { setSaveErrors(result.validation.errors); setPendingInput(null); return; }
      setDraft({ input, roster: nextRoster, grades: nextGrades, plan: result.plan, errors: result.validation.errors });
      setManuallyEdited(false);
    } else setDraft({ ...draft, input });
    reset(input);
    setPendingInput(null);
    setPrinting(false);
    setSaveErrors([]);
  }
  function applyForm(input: SessionPreviewInput) {
    if (needsRebuild(input) && manuallyEdited) setPendingInput(input);
    else applyInput(input);
  }
  function updatePlan(nextPlan: SessionPlan) {
    const input = { ...preview, duration: String(nextPlan.blocks.at(-1)?.end ?? 0) };
    setDraft({ ...draft, input, plan: nextPlan, errors: [] });
    reset(input);
    setManuallyEdited(true);
    setPrinting(false);
    setSaveErrors([]);
  }
  async function save() {
    if (!available || !plan || isDirty || saving) return;
    setSaving(true);
    const result = await saveSession({ ...preview, plan, roster, grades }, sessionId);
    if (!result.id) { setSaveErrors(result.errors); setSaving(false); return; }
    router.push(`${path}/sesi/${result.id}`);
  }
  return (
    <>
    <div className="print-hidden space-y-ui-md">
      <div className="print-hidden"><Breadcrumbs items={[{ label: "Kelas", href: "/kelas" }, { label: classroomTitle(classroom), href: path }, { label: "Sesi", href: `${path}/sesi` }, ...(source ? [{ label: source.lessonSubject, href: `${path}/sesi/${source.id}` }] : []), { label: source ? "Ubah sesi" : "Susun jadwal" }]} /></div>
      <header className="print-hidden">
        <h1 className="text-[28px] font-extrabold">{source ? "Ubah sesi belajar" : "Susun jadwal belajar"}</h1>
        <p className="mt-1 text-sm text-muted">Isi pelajaran dan pilih kemampuan yang ingin didampingi.</p>
      </header>
      <Card className="print-hidden p-ui-md">
        <form onSubmit={handleSubmit(applyForm)} noValidate className="grid items-start gap-ui-sm sm:grid-cols-2">
          <fieldset disabled={saving} className="contents" aria-label="Pilihan sesi">
          <div className="field">
            <label htmlFor="session-lesson-subject">Mata pelajaran</label>
            <Controller control={control} name="lessonSubject" render={({ field }) => <>
              <Select options={[...LESSON_SUBJECTS, { value: OTHER_SUBJECT, label: "Lainnya" }]} value={subjectChoice} onValueChange={(value) => {
                if (!value) return;
                setSubjectChoice(value);
                field.onChange(value === OTHER_SUBJECT ? customSubject : value);
              }} triggerProps={{ id: "session-lesson-subject", ref: subjectChoice !== OTHER_SUBJECT ? field.ref : undefined, onBlur: field.onBlur, "aria-invalid": !!errors.lessonSubject, "aria-describedby": errors.lessonSubject ? "session-lesson-subject-error" : "session-lesson-subject-help" }} />
              {subjectChoice === OTHER_SUBJECT && <><label htmlFor="session-custom-subject">Nama mata pelajaran</label><Input id="session-custom-subject" maxLength={80} required value={field.value} onBlur={field.onBlur} ref={field.ref} onChange={(event) => { setCustomSubject(event.target.value); field.onChange(event.target.value); }} aria-invalid={!!errors.lessonSubject} aria-describedby={errors.lessonSubject ? "session-lesson-subject-error" : "session-lesson-subject-help"} /></>}
            </>} />
            <p id="session-lesson-subject-help" className="text-xs text-muted">Pilih nama yang sesuai dengan kurikulum sekolah.</p>
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
          <div className="field">
            <label htmlFor="session-duration">Durasi sesi (menit)</label>
            <Input id="session-duration" type="number" min={20} max={240} step={1} required aria-invalid={!!errors.duration} aria-describedby={errors.duration ? "duration-error" : undefined} {...register("duration")} />
            {errors.duration && <p id="duration-error" className="field-error">{errors.duration.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="session-block">Lama giliran saat susun otomatis</label>
            <Controller control={control} name="blockMinutes" render={({ field }) => <Select options={[{ value: "10", label: "10 menit" }, { value: "15", label: "15 menit" }, { value: "20", label: "20 menit" }]} value={field.value} onValueChange={(value) => { if (value) field.onChange(value); }} triggerProps={{ id: "session-block", ref: field.ref, onBlur: field.onBlur, "aria-invalid": !!errors.blockMinutes, "aria-describedby": errors.blockMinutes ? "block-error" : undefined }} />} />
            {errors.blockMinutes && <p id="block-error" className="field-error">{errors.blockMinutes.message}</p>}
          </div>
          {CLASS_KEYS.filter((key) => formStudents.some((student) => student.classKey === key && student[selectedFocus === "literasi" ? "literacy" : "numeracy"] === "6")).map((key) => <div key={`${selectedFocus}-${key}`} className="field sm:col-span-2">
            <label htmlFor={`phase-task-${key}`}>Tugas awal sesuai capaian Kelas {grades[key]}</label>
            <p id={`phase-help-${key}`} className="text-xs text-muted">Dipakai saat susun otomatis untuk siswa yang melampaui kemampuan dasar. Sesuaikan dari buku/modul kelas. Untuk mengubah hasil yang sudah ada, gunakan Ubah tugas tiap kelompok. Hindari nama siswa dan label level; isi dicetak apa adanya.</p>
            <Textarea id={`phase-task-${key}`} maxLength={1000} placeholder="Tuliskan soal dan petunjuk yang bisa langsung dikerjakan siswa…" aria-invalid={!!errors.phaseTasks?.[selectedFocus]?.[key]} aria-describedby={`phase-help-${key}${errors.phaseTasks?.[selectedFocus]?.[key] ? ` phase-error-${key}` : ""}`} {...register(`phaseTasks.${selectedFocus}.${key}`)} />
            {errors.phaseTasks?.[selectedFocus]?.[key] && <p id={`phase-error-${key}`} className="field-error">{errors.phaseTasks?.[selectedFocus]?.[key]?.message}</p>}
          </div>)}
          <div className="flex flex-wrap items-center justify-between gap-ui-sm sm:col-span-2">
            <p className="text-sm text-muted">Pembukaan dan penutup masing-masing 5 menit. Blok hasil susunan dapat diubah di bawah.</p>
            <Button type="submit" variant="primary"><CalendarDays size={17} aria-hidden="true" />Lihat jadwal</Button>
          </div>
          </fieldset>
        </form>
      </Card>
      {saveErrors.length > 0 && <Notice>{saveErrors.join(" ")}</Notice>}
      {isDirty && <p role="status" className="print-hidden text-sm text-muted">Pilihan berubah. Pilih Lihat jadwal untuk memperbaruinya.</p>}
      <section className="space-y-ui-sm" aria-label="Rencana yang ditinjau">
        <header className="space-y-2">
          <h2 className="break-words text-xl font-bold">{preview.lessonSubject}</h2>
          {preview.topic && <p className="break-words text-sm font-semibold">{preview.topic}</p>}
          <div className="flex flex-wrap gap-x-ui-sm gap-y-1 text-sm text-muted">
            <span>{classroomTitle(classroom)}</span>
            <time dateTime={preview.date}>{displayDate(preview.date)}</time>
            <span>Fokus {focusLabel}</span><span>{preview.duration} menit</span>
          </div>
          <p className="text-sm text-muted">Siapkan materi tatap muka {preview.lessonSubject} sesuai tujuan belajar tiap kelas. Latihan mandiri dasar mengikuti fokus kemampuan, bukan bank materi semua mata pelajaran.</p>
        </header>
        <PlanStatus validation={validation} />
        {plan && <><p className="text-sm font-semibold">{plan.mode === "same-phase" ? "Blok pertama belajar bersama. Lihat giliran guru pada jadwal." : "Lihat pembagian pendampingan kedua kelas pada jadwal."}</p><RotationGrid plan={plan} grades={grades} lessonSubject={preview.lessonSubject} topic={preview.topic} /></>}
      </section>
      {plan && <fieldset disabled={isDirty || saving} className="space-y-ui-md">
        <legend className="mb-ui-sm text-lg font-bold">Sesuaikan rencana belajar</legend>
        {isDirty && <p className="text-sm text-muted">Terapkan pilihan di atas sebelum mengubah jadwal atau tugas.</p>}
        <Collapsible label="Ubah jadwal"><ScheduleEditor plan={plan} grades={grades} blockMinutes={preview.blockMinutes} onChange={updatePlan} /></Collapsible>
        <Collapsible label="Ubah tugas tiap kelompok"><SessionTaskSummary plan={plan} roster={roster} grades={grades} lessonSubject={preview.lessonSubject} blockMinutes={Number(preview.blockMinutes)} focus={preview.focus} onChange={updatePlan} /></Collapsible>
      </fieldset>}

      <div className="print-hidden flex flex-wrap items-center justify-between gap-ui-sm border-t-2 border-line pt-ui-md">
        <Link href={source ? `${path}/sesi/${source.id}` : `${path}/sesi`} className="text-sm font-semibold text-accent-ink underline underline-offset-4">{source ? "Batal dan kembali ke sesi" : "Kembali ke daftar sesi"}</Link>
        <div className="flex flex-wrap gap-ui-sm">
          <Button variant="secondary" disabled={!available || isDirty} onClick={() => setPrinting((current) => !current)}><Eye size={16} aria-hidden="true" />{printing ? "Tutup tampilan cetak" : "Lihat sebelum dicetak"}</Button>
          {printing && <Button variant="secondary" disabled={!available || isDirty} onClick={() => window.print()}><Printer size={16} aria-hidden="true" />Cetak / Simpan PDF</Button>}
          <Button variant="primary" loading={saving} disabled={!available || isDirty || saving} onClick={save}><Save size={16} aria-hidden="true" />{source ? "Simpan perubahan" : "Simpan jadwal"}</Button>
        </div>
      </div>
    </div>
    <Dialog open={!!pendingInput} onOpenChange={(open) => { if (!open) setPendingInput(null); }} title="Susun ulang jadwal dan tugas?" description="Perubahan fokus, durasi, lama giliran, atau tugas awal akan mengganti suntingan manual pada draf ini. Sesi yang sudah tersimpan belum berubah.">
      <div className="flex flex-wrap justify-end gap-ui-sm"><Button variant="secondary" onClick={() => setPendingInput(null)}>Batal</Button><Button variant="danger" onClick={() => { if (pendingInput) applyInput(pendingInput); }}>Susun ulang</Button></div>
    </Dialog>
    {packet && !isDirty && <StudentPacketView packet={packet} preview={printing} />}
    </>
  );
}
