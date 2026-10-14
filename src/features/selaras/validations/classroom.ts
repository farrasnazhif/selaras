import { z } from "zod";

export const classroomPreviewSchema = z.object({
  first: z.enum(["1", "2", "3", "4", "5", "6"]),
  second: z.enum(["1", "2", "3", "4", "5", "6"]),
}).refine((input) => input.first !== input.second, { path: ["second"], message: "Pilih dua tingkat kelas yang berbeda." });
export type ClassroomPreviewInput = z.infer<typeof classroomPreviewSchema>;
