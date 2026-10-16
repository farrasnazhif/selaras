import { PAGE_METADATA } from "@/constants/metadata";
import { TeacherLayout } from "@/features/shared/components/teacher-layout";

export const dynamic = "force-dynamic";

export const metadata = PAGE_METADATA.product;

export default function SelarasLayout({ children }: { children: React.ReactNode }) {
  return <TeacherLayout>{children}</TeacherLayout>;
}
