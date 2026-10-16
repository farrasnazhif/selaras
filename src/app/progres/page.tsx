import { PAGE_METADATA } from "@/constants/metadata";
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireTeacher } from "@/features/auth/api/require-teacher";

export const metadata = PAGE_METADATA.progres;

export default async function ProgressPage() {
  await requireTeacher("/progres");
  redirect("/kelas");
}
