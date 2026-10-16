import { z } from "zod";
import { canCombineGrades } from "../constants/class-pairing.ts";

export const classroomPreviewSchema = z.object({
  first: z.enum(["1", "2", "3", "4", "5", "6"]),
  second: z.enum(["1", "2", "3", "4", "5", "6"]),
}).refine((input) => canCombineGrades(input.first, input.second), { path: ["second"], message: "Pilih pasangan kelas 1+2, 3+4, atau 5+6." });
export type ClassroomPreviewInput = z.infer<typeof classroomPreviewSchema>;
