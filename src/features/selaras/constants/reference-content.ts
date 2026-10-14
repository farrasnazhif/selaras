import type { ClassKey } from "../types/preview";

export const EXAMPLE_CLASS_ID = "kelas-rangkap-2-3";
export const EXAMPLE_SESSION_ID = "literasi-2026-10-14";
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
export const GROUP_LABELS = { A: "Biru", B: "Hijau", C: "Oranye" };
export const GROUP_COLORS = { A: "var(--cyan)", B: "var(--lime)", C: "var(--yellow)" };
export const GROUP_TASKS = {
  first: [
    { group: "A", title: "Fonik dasar", material: "Kartu bunyi awal & fonik", instruction: "Mencocokkan 8 kartu kata ba, bi, bu pada buku bergambar." },
    { group: "B", title: "Suku kata", material: "Kartu suku kata bergambar", instruction: "Menyambungkan suku kata menjadi benda di ruang kelas." },
    { group: "C", title: "Kalimat awal", material: "Membaca kalimat sederhana", instruction: "Membaca mandiri teks 2 baris lalu mewarnai bintang pencapaian." },
  ],
  second: [
    { group: "A", title: "Pengayaan kosa kata", material: "Susun kata kartu huruf", instruction: "Menyusun minimal 6 kata benda dari kumpulan huruf meja tengah." },
    { group: "B", title: "Menulis analitis", material: "Ringkasan cerita pendek", instruction: "Menjawab 3 pertanyaan inti (Siapa, Di mana, Mengapa) dari buku cerita pojok baca." },
  ],
} as const;

export type RotationBlock = {
  start: number;
  end: number;
  shared?: { title: string; description: string };
  teacher?: ClassKey;
  activities?: Record<ClassKey, { title: string; description: string; note: string; independentLabel?: string }>;
};
// Supplied screenshot content; this is a preview template, not a scheduling engine.
export const LITERACY_ROTATION: RotationBlock[] = [
  { start: 0, end: 5, shared: { title: "Pembukaan & pengondisian kelas", description: "Doa, presensi gabungan, dan pembagian tugas stasiun belajar." } },
  { start: 5, end: 20, teacher: "first", activities: {
    first: { title: "Eksplorasi bunyi konsonan rangkap", description: "Panduan langsung pengenalan fonik 'ny' dan 'ng' di papan tulis mini.", note: "Interaksi intensif guru kelas" },
    second: { title: "Menyusun kosakata kalimat baru", description: "Siswa bekerja pada kartu kerja mandiri LKS.", note: "Kelompok Biru & Hijau", independentLabel: "Kerja mandiri" },
  } },
  { start: 20, end: 35, teacher: "second", activities: {
    first: { title: "Mencocokkan kartu gambar & kata", description: "Latihan terpandu kelompok mandiri sesuai diferensiasi warna meja.", note: "Kelompok Biru, Hijau, Oranye", independentLabel: "Latihan mandiri" },
    second: { title: "Bedah ide pokok paragraf pendek", description: "Klarifikasi pemahaman teks narasi dan evaluasi temuan tugas mandiri.", note: "Fasilitasi pemahaman kritis" },
  } },
  { start: 35, end: 50, teacher: "first", activities: {
    first: { title: "Cek pelafalan & umpan balik cepat", description: "Mendengarkan membaca nyaring bergiliran dan bimbingan fonik langsung.", note: "Bimbingan membaca lancar" },
    second: { title: "Penyusunan ringkasan 3 kalimat", description: "Siswa menuliskan inti cerita pada buku catatan literasi.", note: "Format rubrik mandiri", independentLabel: "Menulis mandiri" },
  } },
  { start: 50, end: 65, teacher: "second", activities: {
    first: { title: "Membaca berpasangan & kartu kerja", description: "Merapikan portofolio lembar kerja dan membaca saling bergantian.", note: "Tutor sebaya mini", independentLabel: "Berpasangan / mandiri" },
    second: { title: "Refleksi menulis & uji kosakata", description: "Tinjauan cepat 2 perwakilan ringkasan dan pembentukan struktur kalimat.", note: "Validasi hasil karya tulis" },
  } },
  { start: 65, end: 70, shared: { title: "Penutup & apresiasi sesi", description: "Pengumpulan lembar refleksi emosi, apresiasi ketertiban kelas, doa pulang." } },
];
