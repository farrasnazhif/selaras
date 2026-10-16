import { PAGE_METADATA } from "@/constants/metadata";
export const metadata = PAGE_METADATA.auth;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      id="main-content"
      lang="id"
      className="auth-layout min-h-dvh flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
    >
      {children}
    </main>
  );
}
