import { z } from "zod";

export const observationSchema = z.object({
  note: z.string().trim().min(1, "Tuliskan catatan observasi terlebih dahulu."),
});
export type ObservationInput = z.infer<typeof observationSchema>;

export const previewStudentSchema = z.object({
  name: z.string().trim().min(1, "Tuliskan nama siswa contoh terlebih dahulu."),
});
export type PreviewStudentInput = z.infer<typeof previewStudentSchema>;
