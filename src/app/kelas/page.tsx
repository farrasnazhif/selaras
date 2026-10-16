import { PAGE_METADATA } from "@/constants/metadata";
import { ClassroomsView } from "@/features/kelas/components/classrooms-view";

export const metadata = PAGE_METADATA.kelas;

export default function ClassesPage() {
  return <ClassroomsView />;
}
