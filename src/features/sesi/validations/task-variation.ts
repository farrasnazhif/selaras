import { z } from "zod";
import { taskEditorSchema } from "./task.ts";

export const variationFieldsSchema = z.object({
  title: z.string().trim().min(1).max(80),
  instruction: z.string().trim().min(1).max(1000),
  kind: z.enum(["picture-match", "count-match", "count-number", "written"]),
  passage: z.string().max(2000),
  questions: z.array(z.string().trim().min(1).max(1000)).max(10),
  values: z.array(z.number().int().min(0).max(9)).max(6),
}).strict();
export type TaskVariation = z.infer<typeof variationFieldsSchema>;

export function validVariationForLevel(source: TaskVariation, level: string) {
  if (source.kind === "written" && source.values.length) return false;
  if (source.kind !== "written" && (source.passage || source.questions.length)) return false;
  return taskEditorSchema.safeParse({
    ...source, level, photo: null,
    questions: source.questions.join("\n"), values: source.values.join(","),
  }).success;
}

export const taskVariationRequestSchema = z.object({
  lessonSubject: z.string().trim().min(1).max(80),
  focus: z.enum(["literasi", "numerasi"]),
  level: z.enum(["1", "2", "3", "4", "5", "6"]),
  grade: z.enum(["1", "2", "3", "4", "5", "6"]),
  blockMinutes: z.union([z.literal(10), z.literal(15), z.literal(20)]),
  source: variationFieldsSchema,
}).strict().refine((input) => validVariationForLevel(input.source, input.level), {
  message: "Lengkapi tugas sumber yang sesuai level sebelum membuat variasi.",
});
export type TaskVariationRequest = z.infer<typeof taskVariationRequestSchema>;

export function parseTaskVariation(input: unknown, request: TaskVariationRequest) {
  const variation = variationFieldsSchema.parse(input);
  if (variation.kind !== request.source.kind || !validVariationForLevel(variation, request.level)) {
    throw new Error("Variasi tidak sesuai jenis kegiatan atau level siswa.");
  }
  return variation;
}
