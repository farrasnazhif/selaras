import type { TaskTemplate } from "../types/schedule.ts";
import type { Subject } from "@/features/shared/types/preview";

// Original draft practice; teacher review is required before classroom use.
const pictureMatch: TaskTemplate = {
  id: "picture-match", title: "Pasangkan gambar",
  instruction: "Saat pembukaan, tunjukkan cara menarik garis antara dua gambar yang sama. Siswa melanjutkan pasangan berikutnya tanpa membaca.",
  requiresReading: false, content: { kind: "picture-match" },
};
export const TASK_TEMPLATES: Record<Subject, Record<string, TaskTemplate>> = {
  literasi: {
    "1": pictureMatch,
    "2": pictureMatch,
    "3": {
      id: "read-words", title: "Kata di sekitar kita", instruction: "Baca setiap kata, lalu salin pada tempat kosong.", requiresReading: true,
      content: { kind: "written", questions: ["buku: ____________________", "mata: ____________________", "kaki: ____________________", "sapu: ____________________"] },
    },
    "4": {
      id: "read-paragraph", title: "Di halaman sekolah", instruction: "Baca bacaan, lalu jawab pertanyaannya.", requiresReading: true,
      content: { kind: "written", passage: "Rani membawa sapu ke halaman sekolah. Ia menyapu daun bersama Budi. Setelah bersih, mereka menaruh sapu di dekat pintu.", questions: ["Apa yang dibawa Rani?", "Dengan siapa Rani menyapu?", "Di mana mereka menaruh sapu?"] },
    },
    "5": {
      id: "read-story", title: "Pot milik kelas", instruction: "Baca cerita, lalu jawab dengan kalimatmu sendiri.", requiresReading: true,
      content: { kind: "written", passage: "Pagi itu, Dini melihat tanaman kelas mulai layu. Tanah di dalam pot terasa kering. Dini mengajak Raka mengambil air. Mereka menyiram tanaman secukupnya, lalu memindahkan pot ke tempat yang terang. Keesokan harinya, daun tanaman tampak segar. Dini dan Raka mengajak teman-teman bergantian merawat tanaman setiap pagi.", questions: ["Mengapa Dini mengajak Raka mengambil air?", "Apa yang mereka lakukan setelah menyiram?", "Bagaimana cara teman-teman menjaga tanaman tetap segar?"] },
    },
  },
  numerasi: {
    "1": {
      id: "match-quantities", title: "Pasangkan banyak benda", instruction: "Saat pembukaan, peragakan cara memasangkan kumpulan titik dengan jumlah yang sama. Sediakan benda konkret untuk menghitung.", requiresReading: false,
      content: { kind: "count-match" },
    },
    "2": {
      id: "count-to-number", title: "Pasangkan benda dan angka", instruction: "Saat pembukaan, peragakan cara menghitung titik lalu menghubungkannya ke lambang angka yang sesuai. Sediakan benda konkret.", requiresReading: false,
      content: { kind: "count-number" },
    },
    "3": {
      id: "tens-and-ones", title: "Puluhan dan satuan", instruction: "Lengkapi setiap isian.", requiresReading: true,
      content: { kind: "written", questions: ["24 = ____ puluhan + ____ satuan", "37 = ____ puluhan + ____ satuan", "5 puluhan + 2 satuan = ____", "Urutkan dari kecil ke besar: 41, 14, 24."] },
    },
    "4": {
      id: "subtraction", title: "Hitung selisihnya", instruction: "Kerjakan pengurangan. Tuliskan caramu menghitung.", requiresReading: true,
      content: { kind: "written", questions: ["52 − 18 = ____", "74 − 29 = ____", "63 − 27 = ____", "81 − 36 = ____"] },
    },
    "5": {
      id: "division", title: "Bagi sama banyak", instruction: "Kerjakan pembagian. Tuliskan caramu menghitung.", requiresReading: true,
      content: { kind: "written", questions: ["126 ÷ 3 = ____", "248 ÷ 4 = ____", "315 ÷ 5 = ____", "432 ÷ 6 = ____"] },
    },
  },
};
