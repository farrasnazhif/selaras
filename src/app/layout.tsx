import { PAGE_METADATA } from "@/constants/metadata";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

export const metadata = PAGE_METADATA.root;

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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
