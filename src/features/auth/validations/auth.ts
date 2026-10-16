import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email("Isi alamat email yang valid.")),
  password: z.string().min(1, "Isi kata sandi."),
});
export const registerSchema = loginSchema.extend({
  password: z
    .string()
    .min(8, "Gunakan minimal 8 karakter.")
    .max(128, "Maksimal 128 karakter."),
});
export type AuthInput = z.infer<typeof loginSchema>;

export function safeReturnPath(value: string | null) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u0020]/.test(value)
  )
    return "/dashboard";
  const url = new URL(value, "https://internal.invalid");
  if (url.origin !== "https://internal.invalid") return "/dashboard";
  if (["/login", "/register"].includes(url.pathname) || url.pathname.startsWith("/auth/")) return "/kelas";
  return url.pathname + url.search + url.hash;
}
