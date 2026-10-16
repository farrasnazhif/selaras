import { z } from "zod";

export const observationSchema = z.object({
  note: z.string().trim().min(1, "Tuliskan catatan observasi terlebih dahulu.").max(1000, "Maksimal 1.000 karakter."),
});
export type ObservationInput = z.infer<typeof observationSchema>;

export const previewStudentSchema = z.object({
  name: z.string().trim().min(1, "Tuliskan nama siswa terlebih dahulu.").max(80, "Maksimal 80 karakter."),
});
export type PreviewStudentInput = z.infer<typeof previewStudentSchema>;
