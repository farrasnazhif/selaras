import { z } from "zod";

// Only the supplied reference timing is available in this UI preview.
export const sessionPreviewSchema = z.object({
  lessonSubject: z.string().trim().min(1, "Isi mata pelajaran.").max(80, "Maksimal 80 karakter."),
  topic: z.string().trim().max(160, "Maksimal 160 karakter."),
  focus: z.enum(["literasi", "numerasi"], { error: "Pilih fokus kemampuan." }),
  duration: z.literal("70"),
  blockMinutes: z.literal("15"),
  date: z.iso.date({ error: "Pilih tanggal yang valid." }),
});
export type SessionPreviewInput = z.infer<typeof sessionPreviewSchema>;
