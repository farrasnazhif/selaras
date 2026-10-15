import type { Metadata } from "next";
import { PreviewShell } from "@/features/shared/components/preview-shell";
import { PreviewProvider } from "@/features/shared/components/preview-provider";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Fullstack Starter",
    template: "%s · Fullstack Starter",
  },
  description:
    "A small, complete foundation for your next hackathon. Next.js, Supabase, and a UI you own.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <QueryProvider><PreviewProvider><PreviewShell>{children}</PreviewShell></PreviewProvider></QueryProvider>
      </body>
    </html>
  );
}
