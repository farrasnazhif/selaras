export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      id="main-content"
      className="auth-layout min-h-dvh flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
    >
      {children}
    </main>
  );
}
