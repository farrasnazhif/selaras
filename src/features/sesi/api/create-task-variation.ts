import { isAxiosError } from "axios";
import { http } from "@/lib/axios";
import { taskVariationRequestSchema, parseTaskVariation, type TaskVariationRequest } from "../validations/task-variation";

export async function createTaskVariation(input: TaskVariationRequest) {
  const parsed = taskVariationRequestSchema.parse(input);
  try {
    const { data } = await http.post("/worksheets/variation", parsed);
    return parseTaskVariation(data.variation, parsed);
  } catch (error) {
    if (isAxiosError(error) && typeof error.response?.data?.error === "string") throw new Error(error.response.data.error);
    throw new Error("Variasi AI belum berhasil. Tugas asli tetap tersedia; coba lagi atau lanjutkan tanpa AI.");
  }
}
