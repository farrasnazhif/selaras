import { createClient } from "@/lib/supabase/client";
import { workspaceSchema, workspaceForStorage, type TeacherWorkspace } from "../validations/workspace";
import type { TeacherDatabase } from "../types/database";
import type { Json } from "@/types/database";

export type WorkspaceRecord = { state: TeacherWorkspace; revision: number };
export const workspaceKey = (userId: string) => ["teacher-workspace", userId] as const;

export async function getWorkspace(userId: string): Promise<WorkspaceRecord> {
  const client = createClient<TeacherDatabase>();
  const { error: insertError } = await client.from("teacher_workspaces")
    .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });
  if (insertError) throw new Error("Data belum tersedia. Periksa konfigurasi dan migration Supabase.");
  const { data, error } = await client.from("teacher_workspaces").select("state, revision").eq("user_id", userId).single();
  if (error) throw error;
  return { state: workspaceSchema.parse(data.state), revision: data.revision };
}

export async function saveWorkspace(userId: string, revision: number, input: TeacherWorkspace): Promise<WorkspaceRecord> {
  const state = workspaceSchema.parse(input);
  const { data, error } = await createClient<TeacherDatabase>().from("teacher_workspaces")
    .update({ state: workspaceForStorage(state) as Json }).eq("user_id", userId).eq("revision", revision)
    .select("revision").maybeSingle();
  if (error) throw new Error("Perubahan belum tersimpan. Periksa koneksi dan coba lagi.");
  if (!data) throw new Error("Data telah berubah di tab lain atau tidak tersedia. Muat ulang untuk melihat data terbaru.");
  return { state, revision: data.revision };
}
