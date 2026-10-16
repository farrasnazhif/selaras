"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ClassKey } from "@/features/shared/types/preview";
import { previewStudentSchema, type PreviewStudentInput } from "@/features/kelas/validations/observation";
import { usePreview } from "@/features/shared/components/preview-provider";

export function AddStudentDialog({ classKey }: { classKey: ClassKey }) {
  const [open, setOpen] = useState(false);
  const { grades, addStudent } = usePreview();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PreviewStudentInput>({ resolver: zodResolver(previewStudentSchema), defaultValues: { name: "" } });

  function add(input: PreviewStudentInput) {
    addStudent(classKey, input.name);
    reset();
    setOpen(false);
  }

  return (
    <Dialog title={`Tambah siswa kelas ${grades[classKey]}`} description="Masukkan nama siswa yang ingin ditambahkan." open={open} onOpenChange={setOpen} trigger={<Button variant="secondary" className="mt-ui-md w-full"><Plus size={16} aria-hidden="true" />Tambah siswa</Button>}>
      <form noValidate className="space-y-ui-md" onSubmit={handleSubmit(add)}>
        <div className="field"><label htmlFor={`new-student-${classKey}`}>Nama siswa</label><Input id={`new-student-${classKey}`} placeholder="Masukkan nama siswa" autoComplete="off" aria-invalid={!!errors.name} aria-describedby={errors.name ? `new-student-error-${classKey}` : undefined} {...register("name")} />{errors.name && <p className="field-error" id={`new-student-error-${classKey}`}>{errors.name.message}</p>}</div>
        <p className="text-xs leading-relaxed text-muted">Siswa akan ditambahkan ke kelas ini. Kelompok dapat diubah pada bagian Kelompok.</p>
        <div className="flex flex-wrap justify-end gap-ui-sm"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Batal</Button><Button type="submit" variant="primary">Tambahkan siswa</Button></div>
      </form>
    </Dialog>
  );
}
