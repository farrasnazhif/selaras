import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/components/landing-page";

export const metadata: Metadata = {
  title: { absolute: "Selaras — Dua kelas, satu ritme belajar" },
  description:
    "Rencanakan sesi kelas rangkap: atur kelompok, bagi waktu mengajar, dan siapkan tugas mandiri untuk dicetak atau disalin ke papan tulis. Coba pratinjau Selaras.",
};

export default function HomePage() {
  return <LandingPage />;
}
