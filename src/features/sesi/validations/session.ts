import { z } from "zod";

const classTasksSchema = z.object({ first: z.string().trim().max(1000, "Maksimal 1.000 karakter."), second: z.string().trim().max(1000, "Maksimal 1.000 karakter.") });

export const sessionPreviewSchema = z.object({
  lessonSubject: z.string().trim().min(1, "Isi mata pelajaran.").max(80, "Maksimal 80 karakter."),
  topic: z.string().trim().max(160, "Maksimal 160 karakter."),
  focus: z.enum(["literasi", "numerasi"], { error: "Pilih fokus kemampuan." }),
  duration: z.string().regex(/^\d+$/, "Isi durasi dalam menit bulat.").refine((value) => Number(value) > 10 && Number(value) <= 240, "Durasi harus lebih dari 10 dan maksimal 240 menit."),
  blockMinutes: z.enum(["10", "15", "20"], { error: "Pilih blok 10, 15, atau 20 menit." }),
  date: z.iso.date({ error: "Pilih tanggal yang valid." }),
  phaseTasks: z.object({ literasi: classTasksSchema, numerasi: classTasksSchema }),
});
export type SessionPreviewInput = z.infer<typeof sessionPreviewSchema>;
