import { redirect } from "next/navigation";
import { EXAMPLE_CLASS_ID } from "@/features/kelas/constants/preview";

export const metadata = { title: "Rencana sesi" };

export default function SessionPage() {
  redirect(`/kelas/${EXAMPLE_CLASS_ID}/sesi/baru`);
}
