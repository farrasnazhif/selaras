import { z } from "zod";
import { MAX_TASK_PHOTO_PIXELS } from "../constants/task-photos.ts";

export const taskPhotoSchema = z.object({
  src: z.string().max(7 * 1024 * 1024, "Foto terlalu besar.").regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/, "Gunakan foto JPG, PNG, atau WebP dari perangkat."),
  alt: z.string().trim().min(1, "Isi keterangan foto.").max(160, "Keterangan maksimal 160 karakter."),
  width: z.number().int().min(1).max(10000), height: z.number().int().min(1).max(10000),
  nonReadingConfirmed: z.boolean(),
}).refine((photo) => photo.width * photo.height <= MAX_TASK_PHOTO_PIXELS, "Dimensi foto terlalu besar.");

const writtenContent = z.object({
  kind: z.literal("written"),
  passage: z.string().max(2000, "Bacaan maksimal 2.000 karakter.").optional(),
  questions: z.array(z.string().trim().min(1, "Soal tidak boleh kosong.").max(1000, "Soal maksimal 1.000 karakter.")).min(1, "Isi minimal satu soal.").max(10, "Maksimal 10 soal per kegiatan."),
});
const visualContent = z.object({
  kind: z.enum(["picture-match", "count-match", "count-number"]),
  values: z.array(z.number().int().min(0).max(9)).min(1).max(6).optional(),
}).superRefine((content, context) => {
  if (content.values?.some((value) => content.kind === "picture-match" ? value > 2 : value < 1)) context.addIssue({ code: "custom", message: "Pola gambar/jumlah benda tidak valid." });
});
export const taskTemplateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Isi judul kegiatan.").max(80, "Judul maksimal 80 karakter."),
  instruction: z.string().trim().min(1, "Isi petunjuk kegiatan.").max(1000, "Petunjuk maksimal 1.000 karakter."),
  requiresReading: z.boolean(),
  aiGenerated: z.literal(true).optional(),
  photo: taskPhotoSchema.optional(),
  content: z.union([writtenContent, visualContent]),
}).superRefine((task, context) => {
  if (task.requiresReading !== (task.content.kind === "written")) context.addIssue({ code: "custom", message: "Jenis tugas dan kebutuhan membaca tidak sesuai." });
});

export const taskEditorSchema = z.object({
  level: z.enum(["1", "2", "3", "4", "5", "6"]),
  title: z.string().trim().min(1, "Isi judul kegiatan.").max(80, "Maksimal 80 karakter."),
  kind: z.enum(["picture-match", "count-match", "count-number", "written"]),
  instruction: z.string().trim().min(1, "Isi petunjuk kegiatan.").max(1000, "Maksimal 1.000 karakter."),
  passage: z.string().trim().max(2000, "Maksimal 2.000 karakter."),
  questions: z.string().trim().max(10000, "Soal terlalu panjang."),
  values: z.string().trim(),
  photo: taskPhotoSchema.nullable().optional(),
}).superRefine((input, context) => {
  if ((input.level === "1" || input.level === "2") && input.photo && !input.photo.nonReadingConfirmed) context.addIssue({ code: "custom", path: ["photo", "nonReadingConfirmed"], message: "Pastikan foto tidak mengharuskan siswa membaca." });
  if ((input.level === "1" || input.level === "2") && input.kind === "written") context.addIssue({ code: "custom", path: ["kind"], message: "Level 1–2 hanya menerima kegiatan tanpa membaca." });
  if (input.level === "6" && input.kind !== "written") context.addIssue({ code: "custom", path: ["kind"], message: "Isi tugas sesuai capaian kelas untuk level 6." });
  if (input.kind === "written") {
    const questions = input.questions.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!questions.length || questions.length > 10 || questions.some((question) => question.length > 1000)) context.addIssue({ code: "custom", path: ["questions"], message: "Isi 1–10 soal, satu per baris, maksimal 1.000 karakter per soal." });
  } else {
    const values = input.values.split(",").map((value) => value.trim());
    const valid = input.kind === "picture-match" ? /^[0-2]$/ : /^[1-9]$/;
    if (!values.length || values.length > 6 || values.some((value) => !valid.test(value))) context.addIssue({ code: "custom", path: ["values"], message: input.kind === "picture-match" ? "Isi 1–6 bentuk: 0 lingkaran, 1 segitiga, 2 persegi; pisahkan koma." : "Isi 1–6 jumlah benda antara 1–9, pisahkan koma." });
  }
});
export type TaskEditorInput = z.infer<typeof taskEditorSchema>;
