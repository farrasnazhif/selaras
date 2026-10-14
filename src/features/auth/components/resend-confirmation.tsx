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
          setError("Enter a valid email address.");
          return;
        }
        setBusy(true);
        try {
          const { error } = await createClient().auth.resend({
            type: "signup",
            email: parsed.data,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });
          if (error) throw error;
          setMessage(
            "If your account needs confirmation, a new link is on its way. Check your inbox.",
          );
        } catch {
          setError("We couldn’t send the email. Wait a moment and try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="field">
        <label htmlFor="confirmation-email">Email address</label>
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
          Configure Supabase in .env.local to send confirmation emails.
        </Notice>
      )}
      {error && <Notice>{error}</Notice>}
      {message && <Notice tone="success">{message}</Notice>}
      <Button
        variant="primary"
        type="submit"
        loading={busy}
        disabled={!configured}
        className="w-full sm:w-auto"
      >
        {busy ? "Sending…" : "Send a new link"}
      </Button>
    </form>
  );
}
