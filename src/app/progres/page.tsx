export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireTeacher } from "@/features/auth/api/require-teacher";

export const metadata = { title: "Progres siswa" };

export default async function ProgressPage() {
  await requireTeacher("/progres");
  redirect("/kelas");
}
