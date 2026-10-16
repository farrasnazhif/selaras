import type { ClassKey } from "@/features/shared/types/preview";
export const LITERACY_LEVELS = [
  { value: "1", prefix: "1", label: "Pemula", description: "Mengenal kurang dari 4 huruf vokal/konsonan dasar" },
  { value: "2", prefix: "2", label: "Huruf", description: "Mengenal simbol huruf acak dan bunyinya" },
  { value: "3", prefix: "3", label: "Kata", description: 'Membaca dua suku kata secara terbuka (mis. "buku")' },
  { value: "4", prefix: "4", label: "Paragraf", description: "Membaca kalimat majemuk pendek tanpa mengeja" },
  { value: "5", prefix: "5", label: "Cerita", description: "Memahami narasi cerita anak dan menjawab pertanyaan deduktif" },
];
export const NUMERACY_LEVELS = [
  { value: "1", prefix: "1", label: "Pemula", description: "Belum konsisten membilang benda 1–5" },
  { value: "2", prefix: "2", label: "Angka 1–9", description: "Mengenal nilai lambang bilangan satuan tunggal" },
  { value: "3", prefix: "3", label: "Angka 11–99", description: "Memahami konsep puluhan dan urutan bilangan dua angka" },
  { value: "4", prefix: "4", label: "Pengurangan", description: "Menyelesaikan operasi hitung pengurangan 2 angka pinjam" },
  { value: "5", prefix: "5", label: "Pembagian", description: "Memahami pembagian sederhana berbasis pengelompokan merata" },
];
export const CLASS_FOCUS: Record<ClassKey, string> = {
  first: "Fonik, pengenalan suku kata & satuan puluhan",
  second: "Pemahaman kalimat, paragraf & operasi hitung terstruktur",
};
