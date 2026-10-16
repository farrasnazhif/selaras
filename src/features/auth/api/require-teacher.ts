import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function requireTeacher(next = "/kelas") {
  const login = `/login?next=${encodeURIComponent(next)}`;
  if (!isSupabaseConfigured()) redirect(login);
  const { data: { user }, error } = await (await createClient()).auth.getUser();
  if (error || !user) redirect(login);
  return user;
}
