import type { Metadata } from "next";
import { TeacherLayout } from "@/features/shared/components/teacher-layout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Selaras", template: "%s · Selaras" },
  description: "Satu guru, dua kelas, satu sesi yang tertata. Atur kegiatan belajar dengan mudah.",
};

export default function SelarasLayout({ children }: { children: React.ReactNode }) {
  return <TeacherLayout>{children}</TeacherLayout>;
}
