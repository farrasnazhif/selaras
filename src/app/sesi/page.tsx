export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireTeacher } from "@/features/auth/api/require-teacher";

export const metadata = { title: "Rencana sesi" };

export default async function SessionPage() {
  await requireTeacher("/sesi");
  redirect("/kelas");
}
