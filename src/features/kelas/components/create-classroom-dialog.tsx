"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Notice } from "@/components/ui/notice";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { GRADE_OPTIONS } from "@/features/kelas/constants/preview";
import { classPath } from "@/features/shared/constants/presentation";
import { classroomPreviewSchema, type ClassroomPreviewInput } from "@/features/kelas/validations/classroom";
import { usePreview } from "@/features/shared/components/preview-provider";

export function CreateClassroomDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { createClassroom } = usePreview();
  const { control, handleSubmit, formState: { errors } } = useForm<ClassroomPreviewInput>({ resolver: zodResolver(classroomPreviewSchema), defaultValues: { first: "1", second: "2" } });
  function create(input: ClassroomPreviewInput) {
    const id = createClassroom(input);
    if (!id) { setError("Pasangan kelas tidak tersedia. Pilih dua tingkat kelas yang berbeda satu."); return; }
    setError("");
    setOpen(false);
    router.push(`${classPath(id)}/siswa`);
  }
  return <Dialog title="Buat kelas rangkap" description="Pilih dua tingkat kelas yang belajar bersama." open={open} onOpenChange={setOpen} trigger={<Button variant="primary"><Plus size={16} aria-hidden="true" />Buat kelas rangkap</Button>}><form onSubmit={handleSubmit(create)} noValidate className="space-y-ui-md">{error && <Notice>{error}</Notice>}{(["first", "second"] as const).map((key, index) => <div key={key} className="field"><label htmlFor={`create-grade-${key}`}>Kelas {index === 0 ? "pertama" : "kedua"}</label><Controller name={key} control={control} render={({ field }) => <Select options={GRADE_OPTIONS} value={field.value} onValueChange={(value) => { if (value) field.onChange(value); }} triggerProps={{ id: `create-grade-${key}`, ref: field.ref, onBlur: field.onBlur, "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `create-grade-error-${key}` : undefined }} />}/>{errors[key] && <p id={`create-grade-error-${key}`} className="field-error">{errors[key]?.message}</p>}</div>)}<p className="text-xs leading-relaxed text-muted">Setelah membuat kelas, tambahkan siswa pada tab Siswa.</p><div className="flex justify-end gap-ui-sm"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Batal</Button><Button type="submit" variant="primary">Buat kelas rangkap</Button></div></form></Dialog>;
}
