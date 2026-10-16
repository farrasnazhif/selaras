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
    defaultValues: signup
      ? { email: "", password: "" }
      : { email: "guru@laras.com", password: "guru123" },
  });
  return (
    <Card className="max-w-md w-full">
      <h1 className="text-center text-[32px] leading-[1.2] font-[750] tracking-[-0.4px] mt-2">
        {signup ? "Buat akun guru" : "Masuk ke Selaras"}
      </h1>
      <p className="text-center text-muted text-base leading-relaxed mb-6">
        {signup
          ? "Atur kelas dan kegiatan belajar Anda."
          : "Lanjutkan mengelola kelas dan rencana belajar Anda."}
      </p>
      {!configured && (
        <div className="mb-6">
          <Notice tone="info">
            Layanan masuk belum dikonfigurasi. Hubungi pengelola, atau{" "}
            <Link className="underline" href="/sandbox">
              lihat komponen antarmuka
            </Link>{" "}
            terlebih dahulu.
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
          Periksa email untuk konfirmasi akun, lalu{" "}
          <Link className="underline" href="/login">
            masuk
          </Link>
          . Jika tautan kedaluwarsa, minta tautan baru di bawah.
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
              router.replace(safeReturnPath(next ?? "/kelas"));
              router.refresh();
            } catch {
              setError(
                signup
                  ? "Akun belum dapat dibuat. Periksa isian dan koneksi, atau masuk jika sudah terdaftar."
                  : "Belum dapat masuk. Periksa email, kata sandi, konfirmasi akun, dan koneksi Anda.",
              );
            }
          })}
          className="space-y-4"
        >
          <fieldset
            disabled={!configured || isSubmitting}
            className="space-y-4 min-w-0"
          >
            <div className="field">
              <label htmlFor="email">Alamat email</label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="guru@sekolah.id"
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
              <label htmlFor="password">Kata sandi</label>
              <Input
                id="password"
                type="password"
                autoComplete={signup ? "new-password" : "current-password"}
                placeholder={signup ? "Minimal 8 karakter" : "Kata sandi Anda"}
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
            {isSubmitting ? "Mohon tunggu…" : signup ? "Buat akun" : "Masuk"}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </form>
      )}
      {/* Previous auth footer retained while registration is hidden.
      <p className="text-center text-sm text-muted mt-6">
        {signup ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
        <Link
          className="font-medium text-foreground underline underline-offset-4"
          href={signup ? "/login" : "/register"}
        >
          {signup ? "Masuk" : "Buat akun"}
        </Link>
      </p>
      */}
    </Card>
  );
}
