import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function createClient<Db = Database>() {
  const { url, key } = getPublicEnv();
  return createBrowserClient<Db>(url, key);
}
