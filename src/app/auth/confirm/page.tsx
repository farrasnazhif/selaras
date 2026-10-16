import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResendConfirmation } from "@/features/auth/components/resend-confirmation";
import { isSupabaseConfigured } from "@/lib/env";

export default function ConfirmPage() {
  return (
    <main lang="id" id="main-content" className="max-w-[496px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Button
        variant="quiet"
        nativeButton={false}
        role="link"
        render={<Link href="/login" />}
      >
        ← Kembali ke halaman masuk
      </Button>
      <Card className="mt-6">
        <h1 className="text-[32px] leading-[1.2] font-[750] tracking-[-0.4px]">Konfirmasi email Anda</h1>
        <p className="text-base leading-relaxed text-muted mt-2 mb-6">
          Tautan kedaluwarsa? Minta tautan konfirmasi baru.
        </p>
        <ResendConfirmation configured={isSupabaseConfigured()} />
      </Card>
    </main>
  );
}
