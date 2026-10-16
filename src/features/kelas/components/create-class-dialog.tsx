"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Notice } from "@/components/ui/notice";
import { GRADE_OPTIONS } from "../constants/preview";
import { usePreview } from "@/features/shared/components/preview-provider";

const schema = z.object({ grade: z.enum(["1", "2", "3", "4", "5", "6"]), section: z.enum(["A", "B"]) });
type Input = z.infer<typeof schema>;
export function CreateClassDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { createClassroom, saving } = usePreview();
  const { control, handleSubmit } = useForm<Input>({ resolver: zodResolver(schema), defaultValues: { grade: "1", section: "A" } });
  return <Dialog title="Tambah kelas" description="Pilih tingkat kelas dan rombongan belajarnya." open={open} busy={saving} onOpenChange={setOpen} trigger={<Button><Plus size={16} aria-hidden="true" />Tambah kelas</Button>}>
    <form className="space-y-ui-sm" onSubmit={handleSubmit(async (input) => {
      const id = await createClassroom({ first: input.grade, second: "" }, input.section);
      if (id) { setError(""); setOpen(false); } else setError("Kelas belum ditambahkan. Periksa apakah nama kelas sudah digunakan atau coba lagi.");
    })}>
      <div className="field"><label htmlFor="new-class-grade">Tingkat kelas</label><Controller control={control} name="grade" render={({ field }) => <Select disabled={saving} value={field.value} options={GRADE_OPTIONS} onValueChange={field.onChange} triggerProps={{ id: "new-class-grade", ref: field.ref, onBlur: field.onBlur }} />} /></div>
      <div className="field"><label htmlFor="new-class-section">Rombongan belajar</label><Controller control={control} name="section" render={({ field }) => <Select disabled={saving} value={field.value} options={[{ value: "A", label: "A" }, { value: "B", label: "B" }]} onValueChange={field.onChange} triggerProps={{ id: "new-class-section", ref: field.ref, onBlur: field.onBlur }} />} /></div>
      {error && <Notice>{error}</Notice>}
      <div className="flex justify-end gap-2"><Button type="button" variant="secondary" disabled={saving} onClick={() => setOpen(false)}>Batal</Button><Button type="submit" disabled={saving} loading={saving}>Tambah kelas</Button></div>
    </form>
  </Dialog>;
}
