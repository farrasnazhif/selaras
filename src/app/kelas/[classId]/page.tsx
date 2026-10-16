import { PAGE_METADATA } from "@/constants/metadata";
import { ClassDetailView } from "@/features/kelas/components/class-detail-view";

export const metadata = PAGE_METADATA.classDetail;

export default function ClassPage() {
  return <ClassDetailView />;
}
