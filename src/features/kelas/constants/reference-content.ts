import type { ClassKey } from "@/features/shared/types/preview";

export const LITERACY_LEVELS = [
  { value: "1", prefix: "1", label: "Pemula", description: "Belum mengenal huruf" },
  { value: "2", prefix: "2", label: "Huruf", description: "Mengenal huruf, tetapi belum bisa membaca kata" },
  { value: "3", prefix: "3", label: "Kata", description: "Membaca kata sederhana, tetapi belum bisa membaca paragraf" },
  { value: "4", prefix: "4", label: "Paragraf", description: "Membaca paragraf pendek, tetapi belum bisa membaca cerita" },
  { value: "5", prefix: "5", label: "Cerita", description: "Membaca cerita pendek dengan lancar" },
  { value: "6", prefix: "6", label: "Sesuai fase", description: "Sudah melampaui level dasar; tugas mengikuti capaian fase kelasnya" },
];
export const NUMERACY_LEVELS = [
  { value: "1", prefix: "1", label: "Pemula", description: "Belum mengenal angka 1-9" },
  { value: "2", prefix: "2", label: "Angka 1-9", description: "Mengenal angka 1-9, tetapi belum mengenal angka 11-99" },
  { value: "3", prefix: "3", label: "Angka 11-99", description: "Mengenal angka 11-99, tetapi belum bisa pengurangan" },
  { value: "4", prefix: "4", label: "Pengurangan", description: "Bisa pengurangan dua angka dengan meminjam, tetapi belum bisa pembagian" },
  { value: "5", prefix: "5", label: "Pembagian", description: "Bisa membagi bilangan tiga angka dengan satu angka" },
  { value: "6", prefix: "6", label: "Sesuai fase", description: "Sudah melampaui level dasar; tugas mengikuti capaian fase kelasnya" },
];
export const CLASS_FOCUS: Record<ClassKey, string> = {
  first: "Fonik, pengenalan suku kata & satuan puluhan",
  second: "Pemahaman kalimat, paragraf & operasi hitung terstruktur",
};
