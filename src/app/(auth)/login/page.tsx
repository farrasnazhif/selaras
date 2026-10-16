export const metadata = { title: "Masuk" };

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeReturnPath } from "@/features/auth/validations/auth";
import { AuthForm } from "@/features/auth/components/auth-form";
import { isSupabaseConfigured } from "@/lib/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; message?: string }>;
}) {
  const params = await searchParams;
  if (isSupabaseConfigured()) {
    const { data: { user } } = await (await createClient()).auth.getUser();
    if (user) redirect(safeReturnPath(params.next ?? "/kelas"));
  }
  return (
    <AuthForm
      mode="login"
      next={params.next}
      message={params.message}
      configured={isSupabaseConfigured()}
    />
  );
}
