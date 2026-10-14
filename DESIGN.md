# DESIGN — Selaras

**Versi:** 1.0 — spesifikasi desain produk untuk ditinjau\
**Tanggal:** 14 Oktober 2026\
**Status:** Dokumentasi saja; layar Selaras belum diimplementasikan

Dokumen ini memetakan `SCR-01`–`SCR-07` dan kebutuhan PRD ke UI yang sudah ada. **[TETAP]** berarti aturan starter/user yang dipertahankan. **[RANCANGAN]** berarti komposisi produk dan ukuran konkret yang disusun dalam pekerjaan desain ini, bukan nilai yang diukur dari referensi atau bukti persetujuan tim. **[TERBUKA]** berarti keputusan belum tersedia; jangan menebaknya untuk membuat tiket Ready. Ukuran rancangan dapat ditinjau tanpa mengubah token global.

PRD.md tetap menentukan perilaku/lingkup; AGENTS.md menentukan implementasi. Route, login demo, nama level, parameter jadwal, dan format ekspor belum menjadi kontrak final. ID `DES-*` dan `DQ-*` stabil untuk referensi backlog. Dokumen ini tidak menyetujui jawaban baru untuk `Q-*` PRD.

## 1. DES-01 — Penggunaan referensi dan arah produk

Referensi yang tersedia adalah dokumen Classroomscreen pada DESIGN.md sebelumnya. Dokumen itu menyebut peninjauan situs/help publik, dengan warna, font, dimensi, dark theme, dan motion sebagai perkiraan. Tidak ada lampiran gambar tambahan yang ditemukan dalam pemeriksaan ini. Revisi ini memakai isi referensi lokal; tidak mengklaim audit browser baru atau token resmi Classroomscreen.

| Kualitas referensi | Penerapan Selaras | Batas |
| --- | --- | --- |
| Alat guru terasa ramah, sederhana, dan langsung berguna | Satu judul tugas, petunjuk pendek, kegiatan utama terlihat sebelum rincian | Bahasa/label final `DQ-06`; tidak menambah panel tutorial/desain. |
| Isi pengajaran mudah dibaca | Nama kelas/kelompok jelas, waktu dan status guru terbaca, instruksi tugas lebih besar dari metadata | Tidak menjanjikan mode proyektor atau whiteboard interaktif. |
| Pemisahan isi dan kontrol | Kontrol sesi di awal/akhir bagian; tugas dan jadwal memperoleh ruang utama | Tidak mengadopsi widget bar, drag/resize, atau floating toolbar. |
| Permukaan ringan dan whitespace di dalam panel | Canvas netral, Card yang ada, jarak konsisten 8/12/16/24 px | Tidak menyalin palet pastel, indigo, foto, logo, slogan, atau branding referensi. |

**[TETAP] Fondasi visual:** Inter normal, Beautiful UI/Base UI, Lucide, satu library di `src/components/ui/`, tindakan primer netral, radius dan shadows yang ada. Tidak menambah shadcn, font baru, brand assets, atau token warna baru. Spesifikasi referensi lama tentang Nunito Sans, tombol pill 48 px, indigo, marketing hero, dan classroom canvas tidak menjadi instruksi implementasi Selaras.

**[RANCANGAN] Karakter:** tenang, terbaca, dan cukup ringkas untuk guru menyiapkan satu sesi. Kepadatan sedang pada formulir, lebih ringkas pada daftar, lapang pada tugas. Penanda kemampuan berada dalam area guru; keluaran siswa memakai nama kelompok netral. Tidak menampilkan grafik analitik tambahan atau klaim dampak belajar.

## 2. DES-02 — Layout, spacing, dan kepadatan

**[TETAP] Beranda `/`:** satu Button terpusat menuju `/sandbox`; seluruh demo sandbox tetap publik. Auth, dashboard, dan proyek contoh tetap tersedia. Tidak menambahkan header bermerek bersama. Lokasi titik masuk Selaras dan perubahan navigasi AppShell menunggu PRD `Q-03`/`Q-08` (`DQ-01`).

**[RANCANGAN] Kontainer isi Selaras:** gunakan area isi route yang ditetapkan kelak, lebar penuh hingga 1040 px, terpusat pada area main yang tersedia. Ini lebar isi, tidak termasuk sidebar. Form konfigurasi maksimal 640 px. Jangan mengubah `.app-content`, sidebar 240 px, atau layout starter secara global. Jika memakai AppShell, gunakan gutter yang sudah ada; tidak menambah gutter kedua. Jika layar baru berdiri sendiri setelah keputusan route, gutter rancangan adalah 16 px mobile dan 24 px desktop.

| Elemen | Nilai rancangan | Pemakaian |
| --- | --- | --- |
| Ruang atas/bawah isi | 24 px mobile, 32 px desktop | Dalam area main; shell yang sudah memberi padding tidak ditambah lagi. |
| Jarak antarbagian | 24 px | Judul → isi; antarbagian kelas/hasil. |
| Jarak antar-panel | 16 px | Dua kelas, kelompok, dan kartu tugas. |
| Padding Card | 20 px bawaan | Pertahankan `.ui-card`; jangan override library menjadi kartu dekoratif besar. |
| Jarak dalam form | 16 px antarfield; 8 px label/input/error | Gunakan pola `.field` yang ada. |
| Jarak label/metadata | 4–8 px | Nama, kelas, tanggal; bukan instruksi panjang. |
| Baris roster/progres mobile | Padding vertikal 12 px; gap 12 px | Tinggi mengikuti isi, bukan baris fixed yang memotong nama/error. |
| Tombol berdampingan | 8 px antarButton | Gap internal Button tetap sesuai size yang ada. |
| Pemisah daftar | 1 px `--line` | Tanpa zebra berwarna menurut kelas atau level. |

Urutan bagian: judul dan konteks → field/hasil utama → kesalahan/status yang terkait → tindakan. Metadata tidak mendahului pekerjaan utama. Satu tindakan primer pada satu form/bagian aktif; tindakan sekunder tetap terlihat dengan label teks. Tidak ada footer tindakan fixed/sticky yang menutupi input atau keyboard mobile.

Bila wizard beberapa langkah diputuskan, gunakan Stepper sebagai indikator, bukan navigasi klik. Label langkah mengikuti layar yang disepakati; jangan mengunci jumlah langkah dari route usulan PRD. Tombol kembali/lanjut dan aturan pemulihan input menunggu `Q-08`/`Q-11`.

## 3. DES-03 — Hierarki tipografi dan ikon

**[TETAP]** Gunakan `--font-ui` = Inter dan ukuran shared controls. Tidak memakai font display referensi, uppercase pada nama siswa, atau judul hero marketing.

| Peran | Ukuran / line-height / bobot rancangan | Isi |
| --- | --- | --- |
| Judul layar (h1) | 24 / 32 px / 600 | Satu judul per layar; tetap 24 px di mobile. |
| Judul bagian (h2) | 18 / 28 px / 600 | Kelas, kelompok, rencana sesi. |
| Judul panel/item (h3) | 16 / 24 px / 500 | Nama kelompok/tugas. |
| Isi kerja | 14 / 20 px / 400 | Petunjuk guru, nama siswa, rincian aktivitas. |
| Label field | 14 / 20 px / 500 | Ikuti field yang ada; wajib ada label yang terhubung. |
| Metadata/helper | 12 / 18 px / 400 | Tanggal, jumlah anggota, fase; gunakan `--ink-2`. |
| Instruksi papan tulis | 18 / 28 px / 500 | Isi utama di layar, tidak menentukan ukuran cetak. |
| Waktu jadwal | 14 / 20 px / 500, angka tabular | Rentang menit; tidak memakai font kode. |
| Button md | 12.5 px / leading-none / 500 | Konvensi shared Button, bukan override dari tabel isi. |

Nilai h1/h2/h3/isi di atas berlaku pada komposisi fitur baru. Table/List/DescriptionList memiliki tipografi lebih ringkas; gunakan sebagai metadata atau komposisi yang sesuai, bukan mengubah semua shared controls. Nama panjang dan instruksi membungkus; jangan memotong satu-satunya teks yang dibutuhkan untuk memilih siswa/aktivitas. Label level final tetap `Q-02`.

Lucide saja: 16 px pada tindakan/metadata, 20 px pada heading/status, 24 px pada empty state. Pilihan rancangan: `Users` untuk kelompok, `Clock` untuk waktu, `BookOpen` untuk tugas, `Download` untuk PDF, `ArrowUp`/`Minus`/`ArrowDown` dengan teks naik/tetap/turun. Ikon dekoratif `aria-hidden`; tindakan penting memakai ikon dan label, bukan ikon sendiri. Kelas dan kelompok dibedakan dengan teks, tidak dengan satu warna per kelas.

## 4. DES-04 — Surfaces, token, dan dua tema

Sumber token yang diperiksa: `src/components/ui/globals.css`; alias, font, dan style komponen aplikasi: `src/app/globals.css`. Gunakan variabel yang ada, bukan menyalin hex referensi. Tidak ada perubahan token global yang diperlukan untuk rancangan ini.

| Pemakaian | Token yang ada | Light | Dark |
| --- | --- | --- | --- |
| Latar halaman | `--page` / alias `--background` | Netral hampir putih | Netral gelap |
| Area pendukung/shell | `--canvas` | Netral sedikit lebih gelap dari halaman | Netral sedikit lebih terang dari halaman |
| Card/menu/dialog | `--surface` | Putih | Permukaan gelap terangkat |
| Field/header tabel/area mandiri | `--inset` | Netral lembut | Gelap terbenam |
| Teks utama | `--ink` / `--foreground` | Ink gelap | Ink terang |
| Metadata | `--ink-2` / `--muted` | Ink sekunder | Ink sekunder terang |
| Hover / selection | `--hover`, `--hover-2`, `--primary-tint` | Tint netral | Tint netral terang |
| Batas | `--line`, `--line-strong` | Hairline netral | Hairline netral terang |
| Aksi normal | `--primary`, `--primary-foreground` | Ink dengan teks terang | Ink terang dengan teks gelap |
| Kesalahan/destruktif | `--red`, `--red-tint` / `--danger`, `--danger-soft` | Semantik error yang ada | Pasangan semantik dark yang ada |
| Konfirmasi/warning | `--green`/`--green-tint`, `--orange`/`--orange-tint` | Tint status terbatas | Tint status dark yang ada |

`--accent` adalah alias primer netral dalam starter, bukan izin indigo. Status berhasil/gagal boleh memakai tone semantik yang ada; tindakan normal tetap netral. Badge level/kelas/kelompok gunakan `tone="neutral"` secara eksplisit, bukan mapping status proyek `active/completed`. Naik/tetap/turun selalu punya teks dan ikon; jangan menyamakan penurunan level dengan error merah/destructive.

Radius aktual: chip 6 px, control 8 px, card 10 px, window 14 px dari `--radius` = 10 px. Dialog saat ini memakai radius 10 px; pertahankan style komponen, jangan memaksa seluruh overlay menjadi 14 px. Elevasi memakai `--shadow-card` untuk Card, `--shadow-btn` untuk Button sekunder, dan `--shadow-overlay` untuk popup/dialog; tidak menambahkan drop shadow buatan atau gradient.

**Tema [TETAP]:** RootLayout membaca cookie `theme` dan merender `data-theme`; ThemeProvider/`applyTheme` menyimpan preferensi setahun untuk seluruh situs. Navigasi, reset sandbox, dan portal tidak mereset tema. Jangan menetapkan tema terang pada halaman tugas untuk menyerupai kertas. Format PDF dapat memakai latar putih setelah format cetak diputuskan; itu bukan penggantian tema UI. Lokasi ThemeToggle baru menunggu keputusan shell, tetapi komponen/provider yang ada dipakai bila diperlukan.

## 5. DES-05 — Kontrol, perilaku Base UI, dan tindakan

| Kebutuhan | Komponen yang ada | Aturan |
| --- | --- | --- |
| Submit/lanjut/generate/unduh | `Button` (`button.tsx`) | Primer netral, loading mempertahankan label dan menonaktifkan submit ganda. `md` 32 px pada desktop; `lg` 40 px untuk aksi utama mobile. Tidak menambah size 44/48 px. |
| Kembali/batal/tindakan tambahan | `Button` secondary/ghost/quiet | Label teks; tindakan navigasi memakai render Link dengan `nativeButton={false}`, `role="link"`. Jangan menumpuk anchor dan button. |
| Hapus yang telah disetujui | `Button` danger + `AlertDialog` | Sebut objek dan dampak; jangan membuat fitur hapus dari usulan PRD. Batal netral; busy mencegah tutup/submit ulang. |
| Isian nama/angka | `Input`, pola `.field` | Label + helper + field error; gunakan `type="number"` hanya jika nilai/aturan durasi disepakati. `NumberInput` bukan wajib. |
| Pilihan kelas/level | `Select` atau `RadioGroup` | Nilai/options menunggu kontrak; tidak memilih default produk yang belum diputuskan. Select trigger diberi ID/nama terakses melalui `triggerProps`. |
| Detail terpisah | `Dialog` | Pertahankan focus trap, Escape, fokus kembali, title/description, scroll popup, dan busy. Jangan hand-roll overlay. |
| Status proses | `Spinner`, `Skeleton`, `Notice` | Label spesifik tindakan; skeleton dekoratif dan status teks terakses. Kesalahan dekat sumbernya, bukan hanya toast. |
| Konfirmasi singkat | `ToastProvider`/`useToast` bila diperlukan | Permukaan netral, ikon/tint semantik, tanpa border berwarna. Provider ini tersedia tetapi belum dipasang global; jangan menganggap toast otomatis aktif. |

Shared Button tetap: gap md 6 px, press scale 0.98, rounded-control, size xs/sm/md/lg = 24/28/32/40 px, serta variant primary/secondary/ghost/danger/quiet. Jangan memberi warna/shape per tombol. Kontrol form `.input` saat ini min-height 38 px dan border control 8 px.

Pada mobile gunakan tombol berlabel dan `lg` untuk aksi utama, jarak 8–12 px agar tidak berdesakan; jangan mengecilkan target dengan ikon xs untuk aksi penting. Pilihan standar target sentuh yang lebih besar memerlukan keputusan eksplisit (`DQ-05`), bukan override diam-diam pada shared Button. Perilaku Base UI untuk Select, RadioGroup, Tabs, Dialog, dan AlertDialog dipertahankan.

## 6. DES-06 — SCR-01: Titik masuk sesi

**PRD:** `J-01`, `Q-03`, `Q-08`, `ST-01`–`ST-04`. **[TERBUKA]** Lokasi, login/demo identity, daftar sesi, sesi terakhir, dan navigasi produk.

**[RANCANGAN untuk area yang kelak disepakati]:** judul h1, satu kalimat konteks, satu Button primer berlabel “Buat sesi”; jarak judul → konteks 8 px dan konteks → tindakan 16 px. Jangan menambahkan KPI, daftar contoh sesi, avatar guru, atau hero/foto tanpa kebutuhan. Bila ada label data demo, tampilkan sebagai Notice info di area konteks.

**Reuse:** `Button`, `Notice`; `AppShell` hanya jika route terlindungi diputuskan. `/` tetap tombol `/sandbox`; komposisi ini tidak ditempelkan ke beranda atau mengganti dashboard/proyek contoh. Komposisi daftar/sesi terakhir baru dapat dirancang setelah `DQ-01` dijawab.

## 7. DES-07 — SCR-02: Konfigurasi sesi

**PRD:** `FR-01`, `FR-04`; kontrak `Q-01`/`Q-12`/`Q-13`.

**[RANCANGAN]:** form satu Card maksimal 640 px, dengan dua field kelas. Mobile field bertumpuk; mulai 768 px dua kolom setara dengan gap 16 px. Di bawahnya, baris hasil fase memakai Badge netral dan teks “satu fase/lintas fase”; fase tidak berupa field editable. Pilihan mapel/durasi hanya muncul setelah kebutuhannya diputuskan, memakai urutan setelah kelas, bukan sidebar pengaturan.

Tindakan di bawah form dengan jarak 24 px, primer di akhir urutan baca. Di mobile bar tindakan membungkus dan tombol utama lebar penuh. Input error tepat di bawah field, ringkasan kegagalan simpan menggunakan Notice dalam Card di atas tindakan. Tidak memberi durasi/mapel/pasangan kelas default dari desain ini.

**Reuse:** `Card`, `Select`, `Badge`, `Input` untuk durasi bila disetujui, `Button`, `Notice`; `DescriptionList` untuk metadata ringkas setelah field. **Terbuka:** nilai yang valid, default, batas pasangan dan durasi (`DQ-02`), serta navigasi wizard (`DQ-01`/`DQ-04`).

## 8. DES-08 — SCR-03: Siswa dan level

**PRD:** `FR-01`–`FR-02`, `FR-07`–`FR-08`.

**[RANCANGAN]:** dua bagian berjudul kelas masing-masing. Mulai 768 px gunakan dua Card kolom setara, gap 16 px; di mobile urutan kelas pertama lalu kedua, keduanya tampak dalam satu halaman scroll. Jangan memakai Tabs untuk menyembunyikan salah satu roster secara default. Header bagian memiliki judul kelas dan jumlah siswa yang benar-benar ada.

Setiap siswa adalah baris form: nama/identitas yang sudah disetujui, lalu kontrol level berlabel untuk siswa tersebut; gap 12 px dan pemisah netral. Pada lebar sempit nama dan Select bertumpuk, Select lebar penuh. Area tambah siswa menggunakan Input dan Button bila alur input disepakati; edit/hapus belum diaktifkan hanya karena tersedia ikon. Tes opsional adalah tindakan sekunder di area penetapan level, tidak menjadi blok penghalang daftar atau CTA primer wajib.

**Reuse:** `Card`, `Input`, `Select`, `Button`, `Badge`, `Notice`, `EmptyState`, `Spinner`; `Dialog` hanya jika bentuk tes/edit dipilih. Komposisi baris form milik fitur, karena `List` merender judul 12 px dan belum menjadi form roster. Tidak memakai DataTable: search, sorting, dan pagination bawaan menambahkan perilaku yang belum masuk lingkup.

**Terbuka:** nama/indikator level dan tes, data siswa minimum, input/edit/hapus, kelas kosong/siswa tanpa level (`DQ-02`/`DQ-03`/`DQ-07`). Placeholder desain tidak disimpan sebagai level siswa. Nama lengkap tidak hilang lewat ellipsis.

## 9. DES-09 — SCR-04: Kelompok per kelas

**PRD:** `FR-03`; batas/hasil generate ulang `Q-04`/`Q-11`.

**[RANCANGAN]:** dua bagian kelas, dengan kelas pertama mendahului kedua dalam DOM. Di bawah setiap heading, susun hingga tiga Card kelompok menurut data; satu kolom mobile, sampai tiga kolom hanya pada lebar isi ≥900 px. Jangan memaksa tiga kartu sempit di samping tiga kartu kelas lain. Header Card: nama netral + jumlah anggota; daftar nama di bawahnya. Catatan level guru berada terpisah dari label kelompok, tidak dibawa ke keluaran siswa.

Pindah anggota tetap tindakan eksplisit yang dapat dioperasikan keyboard. Rancangan awal: pilih tujuan dalam kelas yang sama melalui Select dan Button berlabel pada komposisi pemindahan. Tujuan/tombol konfirmasi final dan cara membuka komposisi inline/dialog tetap `DQ-03`. Tidak menambahkan drag-and-drop, drag handles, atau library DnD. Kelompok kosong dan ukuran timpang tidak diberi pesan sukses palsu; teks/kebijakan menunggu kontrak.

**Reuse:** `Card`, `List` untuk daftar anggota read-only, `Badge` neutral, `Select`, `Button`, `Notice`; `Dialog` jika dipilih. **Gap:** komposisi daftar + kontrol pemindahan milik fitur, bukan kontrol generik baru. Regenerate tidak menjanjikan mempertahankan edit manual sebelum `DQ-04` dijawab.

## 10. DES-10 — SCR-05: Jadwal sesi

**PRD:** `FR-04`, `NFR-07`; parameter `Q-01`/`Q-13`.

**[RANCANGAN]:** h1, ringkasan kelas/fase/durasi yang diketahui, lalu blok waktu berurutan. Satu Card per interval dengan header rentang waktu 14 px dan konteks kegiatan bersama bila ada. Isi blok memiliki dua bagian kelas, gap 16 px; dua kolom mulai 768 px, bertumpuk di mobile. Tiap kelompok menunjukkan nama, aktivitas, dan teks status “Bimbingan guru” atau “Mandiri”. Tidak membuat kolom baru untuk setiap kelompok di layar 360 px.

Status bimbingan memakai Badge primary netral/ikon `Users`; status mandiri memakai Badge neutral dengan teks. Pembeda ini tidak menggantikan aturan guru tunggal. Kegiatan bersama satu fase ditampilkan sebagai satu kegiatan bersama dengan kelas yang terlibat, bukan dua penugasan guru simultan. Siswa level rendah diprioritaskan sesuai hasil domain, bukan dengan urutan visual yang menyembunyikan konflik.

Validasi gagal muncul sebagai Notice error sebelum blok/tindakan; sebut interval dan kelompok yang bermasalah bila diketahui, tanpa menganggap konflik mustahil. Jangan menampilkan status siap/unduhan berhasil untuk hasil invalid. Durasi, distribusi menit, dan alur koreksi/generate ulang tetap terbuka. Tidak menambahkan editor drag jadwal, mode live, atau countdown.

**Reuse:** `Card`, `DescriptionList` untuk ringkasan, `Badge`, `Notice`, `Button`; markup list/section terstruktur untuk blok. **Gap:** schedule blocks komposisi fitur. `Timeline` yang ada memerlukan `dateTime` dan memakai tipe 11–12 px; jangan membuat tanggal palsu untuk rentang menit atau menganggapnya scheduler siap pakai.

## 11. DES-11 — SCR-06: Tugas, PDF, dan papan tulis

**PRD:** `FR-05`; format/konten `Q-05`/`Q-09`/`Q-13`.

**[RANCANGAN]:** urutan kelas → kelompok, satu bagian tugas yang dapat dibaca per kelompok. Heading memuat kelas, nama kelompok netral, dan mapel jika diketahui; isi utama instruksi/contoh, lalu tindakan PDF/papan tulis. Desktop boleh dua kolom Card; mobile satu kolom. Tidak menggabungkan tugas beberapa kelompok menjadi teks panjang tanpa heading. Tidak menambahkan selector template atau tombol AI pada alur wajib.

Konten tugas layar memakai isi 14/20 px; instruksi utama papan tulis 18/28 px dengan batas baris alami. Aktivitas level terendah tidak bergantung pada instruksi panjang; tempat gambar/benda konkret harus bermakna sesuai konten yang ditinjau, bukan gambar dekoratif dari referensi. Alternatif teks/penjelasan guru mendampingi media yang membutuhkannya; aset dan indikator pedagogis belum diputuskan.

Button Download + label PDF tetap primer netral untuk tindakan ekspor; status loading/gagal berada di dekat tindakan. Versi papan tulis adalah bagian terstruktur dari tugas, bukan mode whiteboard/fullscreen baru. Pemilihan Tabs atau tampilan terpisah, cakupan satu/paket PDF, preview aktual PDF, ukuran kertas, margin, gambar hitam-putih, dan nomor halaman tetap `DQ-07`; jangan menganggap Card HTML sama dengan file PDF.

**Tema layar:** gunakan `--surface`/`--ink` pada kedua tema. **Keluaran cetak:** hindari label kemampuan dan UI interaktif; rancangan prinsipnya terbaca hitam-putih, dengan nama kelompok netral dan pemisahan kegiatan yang jelas. Ukuran font cetak dan pagination belum ditetapkan. File berhasil diunduh bisa dibuka offline; tidak ada badge aplikasi “offline ready”.

**Reuse:** `Card`, `Button`, `Notice`, `Spinner`, `Badge`; `Tabs` hanya bila mode tampilan diputuskan. **Gap:** komposisi worksheet/board dan pembuatan PDF milik fitur; tidak ada viewer/exporter PDF khusus yang sudah tersedia. Tidak otomatis membutuhkan library UI baru atau storage lampiran.

## 12. DES-12 — SCR-07: Progres siswa

**PRD:** `FR-06`; baseline dan level `Q-02`/`Q-10`.

**[RANCANGAN]:** pisahkan data per kelas. Di desktop gunakan Table sederhana dengan nama, penilaian pembanding (level + tanggal), penilaian terbaru (level + tanggal), dan perubahan. Di mobile gunakan daftar Card/baris terstruktur per siswa dengan label field eksplisit; urutannya nama → pembanding → terbaru → perubahan. Pembaruan level berada dekat siswa yang dipilih setelah alur penilaian ulang diputuskan. Tidak menambah chart, persentase keberhasilan, ranking, atau filter aplikasi.

Naik/tetap/turun memakai label dan ikon netral (`ArrowUp`/`Minus`/`ArrowDown`), bukan merah/hijau sebagai satu-satunya penanda. Penilaian pertama tidak menampilkan kenaikan palsu; teks “belum ada pembanding” adalah contoh copy, menunggu definisi baseline. Riwayat bertanggal tidak ditimpa; apakah riwayat lengkap membuka Dialog/Accordion masih `DQ-08`.

**Reuse:** `Table` untuk data desktop nonkosong, `Card`, `Badge`, `Select`, `Button`, `Notice`; `EmptyState` untuk daftar kosong. Jangan memakai DataTable search/sort/page tanpa scope. `Timeline` dapat dipertimbangkan untuk histori yang benar-benar bertanggal setelah format timestamp dan label diputuskan, bukan untuk blok sesi. **Terbuka:** baseline, histori/koreksi, waktu pembaruan, dan level per mapel (`DQ-02`/`DQ-08`).

## 13. DES-13 — Keadaan umum, aksesibilitas, dan responsivitas

| Keadaan | Presentasi / reuse | Batas perilaku |
| --- | --- | --- |
| Loading awal | Skeleton sesuai bentuk panel + Spinner dengan label tugas | Layout tidak bergeser besar; skeleton tidak dibaca sebagai isi siswa. |
| Kosong | EmptyState dengan judul/deskripsi spesifik dan ikon Lucide | Aksi tambah hanya bila alurnya disetujui; kosong tidak berarti error. |
| Gagal membaca | Notice error + Button secondary untuk coba lagi | Jangan menjanjikan data tersimpan jika belum diketahui. |
| Tidak tersedia | Pesan netral dan tindakan kembali yang valid | ID asing/tidak dikenal sama; tidak membocorkan pemilik. |
| Input salah | Error terkait field, `aria-invalid`, `aria-describedby` | Pertahankan nilai; ringkasan boleh menyebut field yang harus diperbaiki. |
| Mutasi/ekspor berjalan | Button loading + status dekat hasil | Busy tidak menghapus label/isian; cegah duplikasi. |
| Mutasi/ekspor gagal | Notice tetap terlihat di area tindakan | Tidak hanya toast; fokus tidak meloncat ke halaman kosong. |
| Berhasil | Status teks di area terkait; toast opsional | Setelah operasi benar-benar selesai; tidak menyimpulkan dampak belajar. |
| AI gagal/tidak dipakai | Tugas template tetap terlihat | Tidak menghalangi jadwal atau menambahkan promosi fitur AI. |

**Aksesibilitas [TETAP]:** satu h1, hierarki h2/h3, main landmark/skip link yang ada, label kontrol yang unik termasuk nama siswa/kelas, fokus terlihat 2 px dengan offset 3 px dari CSS saat ini, navigasi Tab yang mengikuti urutan baca. Pertahankan keyboard/indikator pilihan Base UI dan fokus kembali pada pemicu dialog. Untuk dialog controlled tanpa trigger, uji dan sediakan target kembali yang benar; jangan mengklaim semua komposisi otomatis mengembalikan fokus.

Semua status memiliki teks selain warna. Validasi dan proses memberi pengumuman terakses tanpa membacakan ulang seluruh daftar. Hindari memasang `role="alert"` pada setiap rerender validasi. Nama/level tidak diumumkan di toast global tanpa kebutuhan. Tidak mengubah RLS atau kontrol akses melalui presentasi.

| Lebar area isi | Susunan rancangan | Pemeriksaan |
| --- | --- | --- |
| 360–767 px | Satu kolom; dua kelas tetap berurutan; field/tombol membungkus | Tidak ada overflow halaman, label tertutup, atau aksi di bawah overlay keyboard. |
| 768–899 px | Dua kolom untuk pasangan field/roster/kelas dalam blok jadwal jika isi muat | Kelompok tetap satu kolom per bagian sampai ≥900 px. |
| ≥900 px | Maksimal tiga Card kelompok per kelas; kontainer isi ≤1040 px | Jangan hitung sidebar sebagai lebar isi atau membuat panel <240 px. |

Lebar di tabel adalah ruang main yang tersedia, bukan viewport mentah setelah sidebar. Bila ruang tidak cukup, turun ke susunan satu kolom. Tabel desktop boleh scroll dalam region bernama/focusable yang disediakan Table; layar utama tetap tidak scroll horizontal. Roster/progres mobile memiliki komposisi alternatif tanpa menyembunyikan data penting. Periksa zoom 200%/400%, nama panjang, enam kelompok, keyboard mobile, dan popup Select dekat tepi layar.

Reduced motion mengikuti CSS/provider yang ada: tanpa animasi dekoratif/drag, shimmer/spinner tidak menjadi satu-satunya bukti proses, press scale mengikuti aturan shared Button. Popup/menu/dialog memakai portal dan token tema; z-index existing popup 60, dialog 50, toast 70 dipertahankan, bukan skala layer baru. Scroll dialog tetap di popup yang tersedia.

## 14. DES-14 — Inventaris reuse dan gap yang beralasan

Semua nama/path di bawah telah diperiksa secara statis. UI Selaras belum ada; mapping bukan klaim implementasi. Path komponen relatif ke `src/components/ui/`.

| Gap / keputusan | Bukti pada komponen yang ada | Tindakan minimum dalam tiket berikutnya |
| --- | --- | --- |
| State dengan copy Selaras | `data-state.tsx` hard-code judul/copy/icon proyek | Pakai Spinner/Skeleton/EmptyState/Notice/Button dengan copy fitur; jangan duplikasi sistem state. Menambah props ke DataState hanya bila reuse lintas fitur dibutuhkan. |
| Roster editable dan pindah kelompok | `list.tsx` read-only composition; Select/Input tersedia | Komposisi kecil di fitur dengan label/name/error; tidak membuat library form baru. |
| Jadwal interval dan dua kelas | `timeline.tsx` menerima `time` + `dateTime`, bukan interval dan matriks aktivitas | Komposisi Card + list/section pada fitur, tanpa tanggal fiktif, chart, atau DnD. |
| Worksheet/board/PDF | Card/Notice/Button ada; tidak ada exporter/viewer PDF khusus | Pisahkan komposisi konten fitur dan artifact PDF; format/dependency hanya setelah keputusan `DQ-07`/ticket. |
| State tabel kosong | `table.tsx` hard-code “No results found.” | Tampilkan EmptyState saat kosong; jangan memakai search/DataTable untuk menghindari copy tersebut. |
| Lokalisasi yang belum diputuskan | Stepper/Timeline aria-label, Dialog close, AlertDialog Cancel, ThemeToggle/Toast labels memiliki teks Inggris | Setelah `DQ-06`, tambahkan props copy minimum di komponen terkait jika perlu; pertahankan callers, defaults, dan semantik. |
| Batas target sentuh | Button lg 40 px, Input min-height 38 px | Uji tugas mobile; keputusan perubahan standar ukuran `DQ-05`. Jangan menambah size/override per fitur diam-diam. |

Tidak ada gap yang membenarkan penggantian Base UI atau Beautiful UI. Jika tiket kelak menambah kontrol reusable, letakkan tetap di `src/components/ui/`, sertakan demo sandbox dan license notice. Komposisi yang khusus siswa/kelompok/jadwal tetap di folder kategori fitur; tidak membuat wrapper generik untuk setiap layar.

## 15. Pertanyaan desain dan dependensi

Pertanyaan ini menambah konteks presentasi, tanpa mengubah pertanyaan/keputusan PRD. Simpan jawaban di sumber yang sesuai sebelum menandai tiket terkait Ready.

| ID | Keputusan yang belum tersedia | Desain / PRD terdampak |
| --- | --- | --- |
| DQ-01 | Apa titik masuk produk, shell/navigasi, serta wizard satu layar/beberapa route? Adakah daftar sesi/sesi terakhir yang disetujui? | DES-02, DES-06–DES-07; SCR-01–SCR-07; Q-03/Q-08. `/` tetap sandbox. |
| DQ-02 | Apa nama/indikator/urutan level, mapel, tes, grade limits, dan parameter jadwal final? | DES-07–DES-10, DES-12; FR-01–FR-04/FR-06; Q-01/Q-02/Q-04/Q-12/Q-13. |
| DQ-03 | Apa data minimum/alur tambah-edit-hapus siswa; bagaimana pemindahan manual dikonfirmasi, dan kelompok kosong/timpang dijelaskan? | DES-08–DES-09; FR-01–FR-03/FR-07; Q-04/Q-09. Inline atau dialog pemindahan belum dipilih. |
| DQ-04 | Apa aturan kembali, reload/keluar, generate ulang, dan edit setelah hasil dibuat? | DES-02/DES-07–DES-11/DES-13; FR-03–FR-06/FR-08; Q-08/Q-11. Tidak menjanjikan autosave/draft recovery. |
| DQ-05 | Perangkat/jaringan/ambang uji apa, dan apakah standar target sentuh harus melebihi ukuran kontrol starter? | DES-02–DES-05/DES-13; NFR-01/NFR-03/NFR-09; Q-14/Q-15. Pertahankan shared sizes sampai diputuskan. |
| DQ-06 | Apakah UI dan label aksesibilitas seluruhnya Bahasa Indonesia? Apa copy final, istilah level, format tanggal/waktu, serta label demo? | DES-03/DES-05–DES-14; Q-02/Q-06/Q-10. Contoh copy Indonesia di dokumen ini belum kontrak lokalisasi. |
| DQ-07 | Apa bank tugas/visual yang ditinjau, mode tampilan worksheet/board, cakupan paket PDF, ukuran/orientasi, font/margin cetak, serta penyimpanan hasil? | DES-11/DES-14; FR-05/FR-07; Q-05/Q-09/Q-13. Jangan menambahkan gambar pedagogis rekaan. |
| DQ-08 | Apa baseline, tanpa pembanding, histori lengkap/koreksi, serta bentuk UI pembaruan? | DES-12; FR-06; Q-02/Q-10. Dialog/Accordion histori belum keputusan. |
| DQ-09 | Apakah tim menerima komposisi/ukuran rancangan dan kualitas referensi yang dipilih di DES-01–DES-14? | Semua layar; Q-15. Rancangan mempertahankan Inter/netral/shared Button; jika ingin mengubah konvensi, putuskan eksplisit dan realign AGENTS.md lebih dulu. |

Prioritas/cut scope tetap PRD `Q-07`; enam modul tidak dihapus oleh desain. Izin demo fiktif tetap `Q-06`; pilihan penyimpanan/akses tidak diselesaikan oleh tampilan. Tidak ada ticket/owner baru dibuat di dokumen ini.

## 16. Verifikasi dan catatan alignment

Revisi ini membaca PRD, AGENTS, reference sebelumnya, komponen, token, dan provider tema secara statis. Tidak ada perubahan UI, token, dependency, schema, route, atau provider. Ukuran rancangan bukan hasil pengukuran layout Selaras yang sudah berjalan.

Untuk implementasi kelak: cocokkan tiket dengan DES/PRD IDs; uji light/dark dari cookie saat reload/navigasi, popup/overlay, keyboard/fokus kembali, reduced motion, 360 px dan zoom; uji nama panjang, empty/error/busy states, semua kelas/kelompok, output hitam-putih dan PDF offline setelah format ditentukan. Jalankan typecheck/lint/tests/build sesuai AGENTS; tes render tidak menggantikan pemeriksaan browser.

**Konflik dokumentasi yang masih perlu alignment:** AGENTS.md saat ini mendeskripsikan DESIGN.md sebagai reference Classroomscreen dengan Nunito/indigo/48 px pills dan canvas. Bagian itu menjadi catatan historis setelah revisi ini; rancangan aktif di sini mempertahankan fondasi UI. PRD `Q-15` tetap terbuka untuk penerimaan komposisi. PRD/AGENTS/BACKLOG tidak diubah dalam pekerjaan ini. Setelah keputusan desain diterima, realign AGENTS dan prompt backlog terkait; jangan memakai prompt generik canvas dari reference lama.

### Sumber lokal yang diperiksa

- [Product requirements](PRD.md), [Agent rules](AGENTS.md), [Backlog status](BACKLOG.md).
- [Shared token file](src/components/ui/globals.css), [App aliases and component styles](src/app/globals.css).
- [Button](src/components/ui/button.tsx), [Card](src/components/ui/card.tsx), [Input](src/components/ui/input.tsx), [Select](src/components/ui/select.tsx), [RadioGroup](src/components/ui/radio-group.tsx).
- [Dialog](src/components/ui/dialog.tsx), [AlertDialog](src/components/ui/alert-dialog.tsx), [Notice](src/components/ui/notice.tsx), [Badge](src/components/ui/badge.tsx).
- [Table](src/components/ui/table.tsx), [DataTable](src/components/ui/data-table.tsx), [List](src/components/ui/list.tsx), [Timeline](src/components/ui/timeline.tsx), [Stepper](src/components/ui/stepper.tsx), [Tabs](src/components/ui/tabs.tsx), [DescriptionList](src/components/ui/description-list.tsx).
- [EmptyState](src/components/ui/empty-state.tsx), [DataState](src/components/ui/data-state.tsx), [Spinner](src/components/ui/spinner.tsx), [Skeleton](src/components/ui/skeleton.tsx), [Toasts](src/components/ui/toast.tsx), [ThemeToggle](src/components/ui/theme-toggle.tsx).
- [RootLayout](src/app/layout.tsx), [ThemeProvider](src/providers/theme-provider.tsx), [Theme helpers](src/lib/theme.ts).

### URL asal referensi (diwarisi, tidak diverifikasi ulang)

- [Classroomscreen homepage](https://classroomscreen.com/).
- [Widget catalog](https://classroomscreen.com/widgets/).
- [Product overview](https://classroomscreen.com/helpcenter/what-is-classroomscreen).
- [Setting up your screen](https://preview.classroomscreen.com/helpcenter/setting-up-your-screen).
- [Widget behavior](https://help.classroomscreen.com/article/180-widget-behavior).

Tautan ini menjaga provenance referensi, bukan instruksi menyalin branding atau klaim kesesuaian aksesibilitas Selaras. Tidak ada nilai referensi yang dianggap token produksi terukur.
