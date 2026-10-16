import type { Metadata } from "next";

// Edit site defaults and page-specific metadata here.
export const PAGE_METADATA = {
  root: {
    icons: { icon: "/main-icon.png" },
    title: {
      default: "Selaras",
      template: "%s | Selaras",
    },
    description:
      "Satu guru, dua kelas, satu sesi yang tertata. Atur kegiatan belajar dengan mudah.",
  },
  landing: {
    title: { absolute: "Selaras | Dua kelas, satu ritme belajar" },
    description:
      "Rencanakan sesi kelas rangkap: atur kelompok, bagi waktu mengajar, dan siapkan tugas mandiri untuk dicetak atau disalin ke papan tulis. Coba pratinjau Selaras.",
  },
  product: {
    title: { default: "Selaras", template: "%s | Selaras" },
    description:
      "Satu guru, dua kelas, satu sesi yang tertata. Atur kegiatan belajar dengan mudah.",
  },
  auth: {
    title: { default: "Akun guru | Selaras", template: "%s | Selaras" },
  },
  login: { title: "Masuk" },
  register: { title: "Daftar akun guru" },
  kelas: { title: "Kelas" },
  classDetail: { title: "Kelas rangkap" },
  classTab: { title: "Detail kelas" },
  classSessions: { title: "Sesi kelas" },
  sessionCreate: { title: "Susun sesi pembelajaran" },
  sessionDetail: { title: "Sesi pembelajaran" },
  sessionEdit: { title: "Ubah sesi pembelajaran" },
  jadwal: { title: { absolute: "Jadwal | Selaras" } },
  sesi: { title: "Rencana sesi" },
  progres: { title: "Progres siswa" },
  sandbox: { title: "UI sandbox" },
} satisfies Record<string, Metadata>;
