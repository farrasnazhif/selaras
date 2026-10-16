import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { safeReturnPath } from "@/features/auth/validations/auth";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error)
        return NextResponse.redirect(
          new URL(safeReturnPath(params.get("next") ?? "/kelas"), request.url),
        );
    } else if (tokenHash && params.get("type") === "email") {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "email",
      });
      if (!error)
        return NextResponse.redirect(
          new URL(safeReturnPath(params.get("next") ?? "/kelas"), request.url),
        );
    }
  }
  return NextResponse.redirect(
    new URL(
      "/login?message=Konfirmasi+gagal+atau+kedaluwarsa.+Minta+tautan+baru.",
      request.url,
    ),
  );
}
