"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { z } from "zod";

export function ResendConfirmation({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy || !configured) return;
        setError("");
        setMessage("");
        const parsed = z.email().safeParse(email.trim());
        if (!parsed.success) {
          setError("Isi alamat email yang valid.");
          return;
        }
        setBusy(true);
        try {
          const { error } = await createClient().auth.resend({
            type: "signup",
            email: parsed.data,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?next=/kelas`,
            },
          });
          if (error) throw error;
          setMessage(
            "Jika akun membutuhkan konfirmasi, tautan baru akan dikirim. Periksa kotak masuk Anda.",
          );
        } catch {
          setError("Email belum dapat dikirim. Tunggu sebentar dan coba lagi.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="field">
        <label htmlFor="confirmation-email">Alamat email</label>
        <Input
          id="confirmation-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={busy || !configured}
        />
      </div>
      {!configured && (
        <Notice tone="info">
          Layanan email belum dikonfigurasi. Hubungi pengelola.
        </Notice>
      )}
      {error && <Notice>{error}</Notice>}
      {message && <Notice tone="success">{message}</Notice>}
      <Button
        variant="primary"
        type="submit"
        loading={busy}
        disabled={!configured || busy}
        className="w-full sm:w-auto"
      >
        {busy ? "Mengirim…" : "Kirim tautan baru"}
      </Button>
    </form>
  );
}
