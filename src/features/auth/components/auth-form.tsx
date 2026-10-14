"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  loginSchema,
  registerSchema,
  safeReturnPath,
  type AuthInput,
} from "../validations/auth";
import * as api from "../api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Card } from "@/components/ui/card";

export function AuthForm({
  mode,
  next,
  message,
  configured,
}: {
  mode: "login" | "register";
  next?: string;
  message?: string;
  configured: boolean;
}) {
  const signup = mode === "register";
  const router = useRouter();
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthInput>({
    resolver: zodResolver(signup ? registerSchema : loginSchema),
  });
  return (
    <Card className="max-w-md w-full">
      <p className="eyebrow">{signup ? "Let’s get started" : "Welcome back"}</p>
      <h1 className="text-[32px] leading-[1.2] font-[750] tracking-[-0.4px] mt-2">
        {signup ? "Make room for your ideas." : "Pick up where you left off."}
      </h1>
      <p className="text-muted text-base leading-relaxed mt-2 mb-6">
        {signup
          ? "One account. Your own private workspace."
          : "Sign in to your private workspace and keep building."}
      </p>
      {!configured && (
        <div className="mb-6">
          <Notice tone="info">
            Authentication needs your Supabase credentials. Follow the README,
            or{" "}
            <Link className="underline" href="/sandbox">
              explore the UI sandbox
            </Link>{" "}
            first.
          </Notice>
        </div>
      )}
      {message && (
        <div className="mb-6">
          <Notice tone="info">{message.slice(0, 200)}</Notice>
        </div>
      )}
      {confirmation ? (
        <Notice tone="success">
          Check your email for a confirmation link, then{" "}
          <Link className="underline" href="/login">
            sign in
          </Link>
          . If it expires, request a new link below.
        </Notice>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(async (input) => {
            setError("");
            try {
              const result = await (signup
                ? api.register(input)
                : api.login(input));
              if (!result.session) {
                setConfirmation(true);
                return;
              }
              router.replace(safeReturnPath(next ?? null));
              router.refresh();
            } catch (err) {
              setError(
                err instanceof Error
                  ? err.message
                  : "We couldn’t sign you in. Please try again.",
              );
            }
          })}
          className="space-y-4"
        >
          <fieldset disabled={!configured} className="space-y-4 min-w-0">
            <div className="field">
              <label htmlFor="email">Email address</label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" className="field-error">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                autoComplete={signup ? "new-password" : "current-password"}
                placeholder={signup ? "At least 8 characters" : "Your password"}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
              />
              {errors.password && (
                <p id="password-error" className="field-error">
                  {errors.password.message}
                </p>
              )}
            </div>
          </fieldset>
          {error && <Notice>{error}</Notice>}
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            className="w-full"
            disabled={!configured || isSubmitting}
          >
            {isSubmitting
              ? "Please wait…"
              : signup
                ? "Create account"
                : "Sign in"}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </form>
      )}
      <p className="text-sm text-muted mt-6">
        {signup ? "Already have an account?" : "New around here?"}{" "}
        <Link
          className="font-medium text-foreground underline underline-offset-4"
          href={signup ? "/login" : "/register"}
        >
          {signup ? "Sign in" : "Create an account"}
        </Link>
      </p>
      <Link
        href="/auth/confirm"
        className="inline-block text-xs text-muted underline underline-offset-4 mt-4"
      >
        Need a new confirmation email?
      </Link>
    </Card>
  );
}
