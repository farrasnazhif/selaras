import { PAGE_METADATA } from "@/constants/metadata";
import { notFound } from "next/navigation";
import { ClassDetailView, type ClassTab } from "@/features/kelas/components/class-detail-view";

export const metadata = PAGE_METADATA.classTab;

export default async function ClassTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  if (!["siswa", "level", "progres", "sesi"].includes(tab)) notFound();
  return <ClassDetailView tab={tab as ClassTab} />;
}
