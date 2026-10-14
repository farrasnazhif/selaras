import type { Metadata } from "next";
import { PreviewProvider } from "@/features/selaras/components/preview-provider";
import { PreviewShell } from "@/features/selaras/components/preview-shell";

export const metadata: Metadata = {
  title: { default: "Selaras", template: "%s · Selaras" },
  description: "Satu guru, dua kelas, satu sesi yang tertata. Pratinjau antarmuka Selaras.",
};

export default function SelarasLayout({ children }: { children: React.ReactNode }) {
  return <PreviewProvider><PreviewShell>{children}</PreviewShell></PreviewProvider>;
}
