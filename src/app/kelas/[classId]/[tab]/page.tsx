import { notFound } from "next/navigation";
import { ClassDetailView, type ClassTab } from "@/features/kelas/components/class-detail-view";

export const metadata = { title: "Detail kelas" };

export default async function ClassTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  if (!["siswa", "level", "progres", "sesi"].includes(tab)) notFound();
  return <ClassDetailView tab={tab as ClassTab} />;
}
