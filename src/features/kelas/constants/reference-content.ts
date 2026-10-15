import type { ClassKey } from "@/features/shared/types/preview";
export const LITERACY_LEVELS = [
  { value: "1", label: "1 · Pemula", description: "Mengenal kurang dari 4 huruf vokal/konsonan dasar" },
  { value: "2", label: "2 · Huruf", description: "Mengenal simbol huruf acak dan bunyinya" },
  { value: "3", label: "3 · Kata", description: 'Membaca dua suku kata secara terbuka (mis. "buku")' },
  { value: "4", label: "4 · Paragraf", description: "Membaca kalimat majemuk pendek tanpa mengeja" },
  { value: "5", label: "5 · Cerita", description: "Memahami narasi cerita anak dan menjawab pertanyaan deduktif" },
];
export const NUMERACY_LEVELS = [
  { value: "1", label: "1 · Pemula", description: "Belum konsisten membilang benda 1–5" },
  { value: "2", label: "2 · Angka 1–9", description: "Mengenal nilai lambang bilangan satuan tunggal" },
  { value: "3", label: "3 · Angka 11–99", description: "Memahami konsep puluhan dan urutan bilangan dua angka" },
  { value: "4", label: "4 · Pengurangan", description: "Menyelesaikan operasi hitung pengurangan 2 angka pinjam" },
  { value: "5", label: "5 · Pembagian", description: "Memahami pembagian sederhana berbasis pengelompokan merata" },
];
export const CLASS_FOCUS: Record<ClassKey, string> = {
  first: "Fonik, pengenalan suku kata & satuan puluhan",
  second: "Pemahaman kalimat, paragraf & operasi hitung terstruktur",
};
