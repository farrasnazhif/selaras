import { z } from "zod";

// Only the supplied reference timing is available in this UI preview.
export const sessionPreviewSchema = z.object({
  subject: z.enum(["literasi", "numerasi"]),
  duration: z.literal("70"),
  blockMinutes: z.literal("15"),
  date: z.iso.date({ error: "Pilih tanggal yang valid." }),
});
export type SessionPreviewInput = z.infer<typeof sessionPreviewSchema>;
