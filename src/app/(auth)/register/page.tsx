import { PAGE_METADATA } from "@/constants/metadata";
export const metadata = PAGE_METADATA.register;

export const dynamic = "force-dynamic";

import { AuthForm } from "@/features/auth/components/auth-form";
import { isSupabaseConfigured } from "@/lib/env";

export default function RegisterPage() {
  return <AuthForm mode="register" configured={isSupabaseConfigured()} />;
}
