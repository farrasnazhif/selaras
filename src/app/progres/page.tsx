import { redirect } from "next/navigation";
import { EXAMPLE_CLASS_ID } from "@/features/kelas/constants/preview";

export const metadata = { title: "Progres siswa" };

export default function ProgressPage() {
  redirect(`/kelas/${EXAMPLE_CLASS_ID}/progres`);
}
