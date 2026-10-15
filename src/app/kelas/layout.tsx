import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Selaras", template: "%s · Selaras" },
  description: "Satu guru, dua kelas, satu sesi yang tertata. Atur kegiatan belajar dengan mudah.",
};

export default function SelarasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
