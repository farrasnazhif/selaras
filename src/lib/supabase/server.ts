import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export async function createClient<Db = Database>() {
  const store = await cookies();
  const { url, key } = getPublicEnv();
  return createServerClient<Db>(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          // Server Components cannot write cookies; Proxy refreshes the session.
        }
      },
    },
  });
}
