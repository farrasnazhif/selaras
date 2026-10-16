import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { generateTaskVariation } from "@/features/sesi/api/task-variation.server";
import { taskVariationRequestSchema } from "@/features/sesi/validations/task-variation";
import type { TeacherDatabase } from "@/features/shared/types/database";

export const runtime = "nodejs";
export const maxDuration = 20;

function failure(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: NextRequest) {
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(14000)]);
  // Next may normalize nextUrl.hostname; compare against the actual incoming Host instead.
  const origin = `${request.nextUrl.protocol}//${request.headers.get("host") ?? request.nextUrl.host}`;
  if (request.headers.get("origin") !== origin) return failure("Permintaan tidak diizinkan.", 403);
  if (!isSupabaseConfigured()) return failure("Layanan belum dikonfigurasi. Tugas asli tetap tersedia.", 503);
  const supabase = await createClient<TeacherDatabase>();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return failure("Silakan masuk kembali.", 401);
  const limit = Number(process.env.AI_DAILY_REQUEST_LIMIT);
  if (!process.env.OPENAI_API_KEY || !Number.isSafeInteger(limit) || limit < 1) {
    return failure("Variasi AI belum diaktifkan. Tetap gunakan atau ubah tugas yang tersedia.", 503);
  }
  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return failure("Isi permintaan tidak valid.", 400);
    let size = 0;
    let text = "";
    const decoder = new TextDecoder();
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 40000) { await reader.cancel(); return failure("Isi tugas terlalu panjang.", 413); }
      text += decoder.decode(chunk.value, { stream: true });
    }
    body = JSON.parse(text + decoder.decode());
  } catch { return failure("Isi permintaan tidak valid.", 400); }
  const parsed = taskVariationRequestSchema.safeParse(body);
  if (!parsed.success) return failure("Lengkapi tugas sumber yang sesuai level. Jangan sertakan data siswa atau foto.", 400);
  try {
    const { data: reserved, error: quotaError } = await supabase.rpc("reserve_task_variation", { request_limit: limit }).abortSignal(signal);
    if (quotaError) return failure("Variasi AI belum tersedia. Tugas asli tetap dapat digunakan.", 503);
    if (!reserved) return failure("Batas variasi AI hari ini sudah tercapai. Gunakan tugas asli atau coba besok.", 429);
    const variation = await generateTaskVariation(parsed.data, signal);
    return NextResponse.json({ variation }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return failure("Variasi AI belum berhasil. Tugas asli tetap tersedia; coba lagi atau lanjutkan tanpa AI.", 502);
  }
}
