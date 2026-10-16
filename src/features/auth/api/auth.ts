import { createClient } from "@/lib/supabase/client";
import { loginSchema, registerSchema, type AuthInput } from "../validations/auth";

export async function login(input: AuthInput) {
  const { data, error } = await createClient().auth.signInWithPassword(
    loginSchema.parse(input),
  );
  if (error) throw error;
  return data;
}

export async function register(input: AuthInput) {
  const { data, error } = await createClient().auth.signUp({
    ...registerSchema.parse(input),
    options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/kelas` },
  });
  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await createClient().auth.signOut();
  if (error) throw error;
}
