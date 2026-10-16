# PRD — Selaras

**Versi:** 1.1 (melengkapi draf berdasarkan Product Brief v4)\
**Tanggal:** 14 Oktober 2026\
**Status:** Spesifikasi MVP; keputusan terbuka belum siap diimplementasikan; belum divalidasi dengan guru\
**Event:** JOINTS 2026 Hackathon — Education, E6\
**Deadline:** 16 Oktober 2026, 23.50 WIB\
**Tim:** 4 orang

> **Konvensi:** **[BRIEF]** adalah kebutuhan yang ditandai berasal dari Product Brief v4 dalam draf PRD yang tersedia. **[STARTER]** adalah perilaku atau batasan repositori yang dipertahankan, bukan keputusan produk baru. **[USULAN]** belum disetujui dan tidak boleh dijadikan persyaratan implementasi. **[ASUMSI]** belum divalidasi. Jangan mempresentasikan asumsi atau target sebagai hasil penelitian.

**Sumber dan batas pemeriksaan:** Product Brief v4 tidak ditemukan sebagai berkas terpisah; isi draf PRD sebelumnya menjadi sumber brief untuk revisi ini. Kode, migrasi, konfigurasi, dan tes starter diperiksa secara statis; fitur Selaras fungsional belum tersedia dan layanan live tidak diverifikasi. Prototipe UI tanpa backend ditambahkan sesuai `UI-01`. Metadata event dan referensi eksternal dipertahankan dari draf, bukan dikonfirmasi ulang.

**ID stabil:** Pertahankan `FR-01`–`FR-06` yang sudah ada. `FR-07`–`FR-08` melengkapi kepemilikan dan keadaan gagal; `NFR-*` untuk kualitas, `ST-*` untuk keputusan starter, `J-*` untuk perjalanan, `SCR-*` untuk layar, dan `Q-*` untuk pertanyaan terbuka. Jangan menomori ulang ID saat urutan dokumen berubah. Acceptance criteria menggunakan ID induk dengan akhiran `AC-*`. Keputusan terbuka menghalangi bagian terkait, bukan otomatis seluruh produk.

## 1. Ringkasan produk

**Selaras** — _Satu guru, dua kelas, satu sesi yang tertata._

Selaras adalah aplikasi web untuk guru SD yang mengajar dua kelas dalam satu ruangan. Guru memilih pasangan kelas, memasukkan siswa, menetapkan level berdasarkan observasi, lalu mendapatkan kelompok per kelas, jadwal mengajar tanpa konflik waktu guru, dan tugas mandiri yang dapat dicetak atau dibuka tanpa sinyal. Setelah dua minggu guru dapat memperbarui level dan melihat perubahan. [BRIEF]

### 1.1 Masalah

- Guru kelas rangkap harus merencanakan pembelajaran untuk dua kelas dalam satu sesi.
- Pasangan kelas lintas fase kurikulum memerlukan capaian pembelajaran yang berbeda.
- Saat guru membimbing satu kelompok, kelompok lain perlu aktivitas mandiri yang sesuai kemampuan, termasuk aktivitas nonteks bagi siswa yang belum lancar membaca.

### 1.2 Tujuan

1. Menghasilkan rencana satu sesi kelas rangkap yang dapat dipakai guru.
2. Mencegah guru dijadwalkan membimbing dua kelompok pada waktu bersamaan.
3. Menyediakan aktivitas mandiri sesuai level siswa.
4. Memungkinkan guru mengevaluasi perubahan level dari waktu ke waktu.

### 1.3 Non-goals MVP

Tidak membangun aplikasi siswa/orang tua, absensi, pesan orang tua, pengelompokan lintas kelas otomatis, integrasi sistem sekolah, maupun PWA offline penuh. Tes level tidak wajib bagi guru. [BRIEF]
Penilaian tetap terbatas pada literasi/numerasi. UI-17 memperluas konteks rencana sesi ke
mata pelajaran lain yang diisi guru; bank materi dan penilaian mapel lain belum termasuk.

AI pembuat variasi bukan syarat keberhasilan MVP. Penyimpanan lampiran, pencarian/filter data aplikasi, realtime, kolaborasi multi-guru, dan dashboard analitik tambahan tidak masuk lingkup yang diberikan. Keputusan penyimpanan PDF tidak otomatis berarti fitur upload. Penghapusan fitur contoh starter, penggantian UI library, serta deployment bukan bagian dari pekerjaan dokumentasi ini.

## 2. Pengguna dan skenario

**Pengguna aplikasi:** guru SD yang mengajar dua kelas sekaligus, terutama pasangan lintas fase dan guru baru kelas rangkap. Siswa adalah penerima manfaat tetapi tidak login atau memakai aplikasi. [BRIEF]

**Batas peran:** Tidak ada peran admin sekolah, orang tua, atau siswa yang diberi akses oleh brief. Kebutuhan akun guru dan akses demo masih `Q-03`; jangan menganggap akun bersama sebagai izin mengakses data siswa nyata.

**Persona operasional [ASUMSI]:** guru menggunakan Android, mungkin hanya memiliki koneksi sebelum kelas, dan mungkin tidak memiliki printer.

**Skenario demo:** guru menyiapkan kelas 2 + 3, mengisi 15 siswa fiktif, menetapkan level, menghasilkan kelompok dan jadwal, membuka tugas dan mengunduh PDF, kemudian memperbarui level pada tampilan progres. [BRIEF; jumlah siswa untuk demo]

## 3. Lingkup dan prioritas

| Prioritas usulan   | Modul                                      | MVP                                                                              |
| ------------------ | ------------------------------------------ | -------------------------------------------------------------------------------- |
| P0                 | Atur pasangan kelas dan daftar siswa       | Wajib                                                                            |
| P0                 | Tentukan level siswa dari observasi        | Wajib                                                                            |
| P0                 | Kelompok otomatis dan edit manual          | Wajib                                                                            |
| P0                 | Jadwal sesi dengan constraint guru tunggal | Wajib                                                                            |
| P0                 | Tugas mandiri dan ekspor PDF/papan tulis   | Wajib                                                                            |
| P1                 | Tes singkat opsional                       | Termasuk fitur brief; urutan setelah alur inti belum disetujui sebagai penundaan |
| P1 [USULAN urutan] | Pembaruan level dan riwayat progres        | Tetap bagian MVP brief (`FR-06`); bukan fitur yang telah disetujui untuk ditunda |
| P2                 | Variasi konten tugas dengan AI             | Opsional; selalu ada template fallback                                           |

**Batas MVP:** Enam modul `FR-01`–`FR-06` tetap masuk lingkup brief. Tes pada `FR-02` opsional untuk digunakan guru; tidak berarti tim sudah boleh menghapus penyediaannya. AI bersifat opsional. Urutan P0/P1 di atas adalah **[USULAN]**, bukan izin menghapus fitur keenam atau menyebut demo parsial sebagai MVP lengkap. Persetujuan pemotongan lingkup tercatat di `Q-07` bila diperlukan.

## 4. Alur utama pengguna

### J-01 — Menyiapkan satu sesi (`FR-01`–`FR-05`)

Alur produk yang direncanakan; UI-22 menetapkan beranda `/` dengan CTA pratinjau `/kelas`.
Identitas dan integrasi produksi masih menunggu `Q-08`.

1. Guru membuka aplikasi dan memilih **Buat sesi**.
2. Guru memilih dua tingkat kelas yang berbeda; sistem menampilkan fase masing-masing.
3. Guru memasukkan siswa ke masing-masing kelas.
4. Guru menetapkan level tiap siswa; tes singkat hanya jika diperlukan.
5. Sistem membentuk hingga tiga kelompok **di dalam setiap kelas**; guru dapat memindahkan siswa.
6. Guru menentukan durasi sesi dan mata pelajaran [USULAN].
7. Sistem menyusun blok kegiatan bersama, bimbingan guru, dan kegiatan mandiri sesuai fase.
8. Guru meninjau dan mengunduh rencana sesi serta tugas per kelompok; tersedia versi ringkas untuk papan tulis.
9. Guru menggunakan PDF yang telah diunduh atau menyalin versi papan tulis di kelas.

### J-02 — Menilai ulang (`FR-06`)

Sekitar dua minggu kemudian, guru membuka data siswa yang sama, menetapkan level terbaru, dan membandingkan dengan baseline. Riwayat sebelumnya tetap ada. Aturan baseline, mata pelajaran, dan waktu pembaruan masih `Q-02`/`Q-10`.

### J-03 — Mengakses data sendiri (`FR-07`, `ST-01`)

Starter menyediakan registrasi, konfirmasi email/ulang kirim, login, dan logout. Jika alur Selaras memakai akun guru, identitas terverifikasi menentukan data yang dapat dibuka. Tata cara akses demo belum diputuskan (`Q-03`); beranda, sandbox, dan halaman auth sudah publik; tidak ada data siswa yang dibuka ke publik.

### J-04 — Memulihkan kegagalan (`FR-08`)

Guru melihat kesalahan pada langkah yang gagal, memperbaiki input atau mencoba lagi tanpa kehilangan isian akibat kegagalan submit. Tidak ada pesan sukses sebelum penyimpanan/ekspor selesai. Gangguan AI tetap memungkinkan keluaran template; gangguan jaringan tidak menjanjikan aplikasi offline.

## 5. Kebutuhan fungsional

### FR-01 — Konfigurasi kelas rangkap [P0]

**User story:** Sebagai guru, saya ingin memilih dua kelas dan memasukkan siswa agar sistem dapat merencanakan sesi sesuai fase.

**Persyaratan:**

- Pilih tepat dua tingkat berbeda dari kelas 1–6 [USULAN: pembatasan input untuk UI].
- Deteksi fase: A = 1–2; B = 3–4; C = 5–6. [BRIEF]
- Tampilkan status **satu fase** atau **lintas fase**.
- Daftar siswa harus terkait tepat satu kelas dalam pasangan tersebut.
- Guru dapat menambah, mengedit, dan menghapus siswa [USULAN].

**Acceptance criteria:**

- **FR-01-AC-01:** kelas 2 + 3 terdeteksi lintas fase; 3 + 4 terdeteksi satu fase dengan pemetaan fase di atas.
- **FR-01-AC-02:** siswa terkait satu kelas; tidak berpindah kelas tanpa tindakan eksplisit.
- **FR-01-AC-03 [USULAN]:** pasangan identik atau input di luar kelas 1–6 ditolak dengan pesan pada input; aturan ini menunggu `Q-12`.

**Belum diputuskan:** batas input pasangan kelas (`Q-12`), edit/hapus siswa dan siklus hidup kelas (`Q-09`), kapasitas daftar (`Q-04`).

### FR-02 — Penetapan level [P0]

**User story:** Sebagai guru, saya ingin menetapkan level berdasarkan observasi tanpa harus menguji semua siswa.

**Persyaratan:**

- Guru memilih level setiap siswa secara manual.
- Level ditetapkan terpisah untuk literasi dan numerasi sesuai spesifikasi enam level pengguna (`UI-14`).
- Tes singkat bersifat opsional; hasilnya menjadi saran, bukan penggantian otomatis observasi guru [USULAN].
- Gunakan enam level per mata pelajaran pada tabel `UI-14`; usulan tiga level Dasar/Berkembang/Mandiri digantikan. Jumlah kelompok tetap tiga per kelas.

**Acceptance criteria:**

- **FR-02-AC-01:** 15 siswa fiktif dapat diberi level dari observasi tanpa menjalankan tes.
- **FR-02-AC-02:** guru dapat mengubah level; tes tidak menjadi prasyarat menuju pengelompokan.
- **FR-02-AC-03 [sebagian tertunda]:** nama, urutan, dan indikator enam level mengikuti `UI-14`; isi/skor tes serta pemetaan hasil tes masih menunggu `Q-02`.

### FR-03 — Pengelompokan [P0]

**User story:** Sebagai guru, saya ingin kelompok terbentuk otomatis berdasarkan level, tetapi tetap dapat mengubah keanggotaannya.

**Persyaratan:**

- Pengelompokan hanya dalam kelas yang sama, maksimal tiga kelompok per kelas.
- Kelompok awal dibentuk dari level mata pelajaran sesi: Biru untuk 1–2, Hijau untuk 3–5, Oranye untuk 6 (`UI-15`).
- Guru dapat memindahkan siswa secara manual antar kelompok dalam kelas yang sama.
- Nama kelompok netral (misalnya Kelompok A/B/C), terutama pada keluaran cetak.
- Perubahan keanggotaan disimpan untuk sesi yang sedang direncanakan [USULAN].

**Acceptance criteria:**

- **FR-03-AC-01:** kelompok otomatis tidak mencampur kelas, menempatkan setiap siswa tepat sekali, dan tidak melebihi tiga kelompok per kelas.
- **FR-03-AC-02:** pemindahan manual dalam kelas yang sama mempertahankan keanggotaan tunggal; pemindahan lintas kelas ditolak.
- **FR-03-AC-03:** nama kelompok pada keluaran siswa netral, tanpa label kemampuan.

**Belum diputuskan:** kelompok kosong, siswa belum diberi level, ukuran kelompok, dan apakah perubahan manual bertahan setelah generate ulang (`Q-04`, `Q-11`).

### FR-04 — Penyusun jadwal [P0, inti produk]

**User story:** Sebagai guru, saya ingin jadwal blok yang realistis agar saya tahu kapan membimbing satu kelompok dan apa yang dikerjakan kelompok lain.

**Persyaratan [BRIEF]:**

- Pasangan satu fase mendukung blok kegiatan bersama.
- Pasangan lintas fase menggunakan rotasi terpisah.
- Tidak boleh ada dua kegiatan bimbingan guru yang berlangsung bersamaan.
- Kelompok dengan level terendah mendapat prioritas bimbingan lebih dulu.
- Setiap blok menjelaskan waktu, kelas, kelompok, aktivitas, dan status guru (membimbing/mandiri).

**Rancangan algoritme deterministik [USULAN]:**

1. Validasi pasangan kelas, kelompok, mata pelajaran, dan durasi.
2. Tentukan mode jadwal dari fase.
3. Urutkan kelompok dengan prioritas level terendah; gunakan urutan kelas sebagai tie-breaker.
4. Buat blok waktu berurutan; untuk setiap blok, tetapkan maksimal satu kelompok sebagai penerima bimbingan langsung.
5. Isi kegiatan mandiri kelompok lain dari bank template sesuai level dan mata pelajaran.
6. Untuk satu fase, izinkan blok pembuka/penutup bersama; untuk lintas fase, prioritaskan rotasi terpisah.
7. Validasi semua blok sebelum menyimpan atau mengekspor.

**Aturan validasi:** untuk setiap interval waktu `t`, `count(teacher_led_activities(t)) <= 1`; seluruh kegiatan berada dalam durasi sesi; tidak ada interval negatif atau tumpang tindih tak disengaja; semua kelompok mendapat kegiatan yang ditetapkan. [USULAN]

**Acceptance criteria:**

- **FR-04-AC-01:** contoh 2 + 3 menghasilkan rotasi lintas fase; 3 + 4 mendukung kegiatan bersama.
- **FR-04-AC-02:** pada setiap interval, maksimal satu kegiatan membutuhkan bimbingan guru. Kegiatan bersama satu fase adalah satu kegiatan bersama, bukan dua penugasan guru simultan.
- **FR-04-AC-03:** kelompok level terendah mendapat prioritas bimbingan pertama; aturan seri/tie-breaker menunggu `Q-01`.
- **FR-04-AC-04 [USULAN]:** tidak ada blok di luar durasi atau kelompok tanpa aktivitas; jadwal tidak valid tidak dapat dinyatakan siap/diekspor. Parameter durasi dan penanganan sesi terlalu singkat menunggu `Q-01`.

**Belum diputuskan:** alokasi menit, arti blok bersama, prioritas seri, dan cakupan capaian pembelajaran per fase (`Q-01`, `Q-13`).

**Batasan:** durasi per blok, distribusi menit, serta penanganan jumlah kelompok yang besar adalah parameter rancangan yang perlu diuji dengan guru; jangan mengklaim jadwal sebagai optimasi pedagogis tervalidasi.

### FR-05 — Tugas mandiri dan ekspor [P0]

**User story:** Sebagai guru, saya ingin tugas yang bisa dilakukan tanpa saya dampingi dan bisa dibawa ke kelas tanpa koneksi.

**Persyaratan:**

- Buat satu lembar tugas per kelompok berdasarkan mata pelajaran dan level.
- Level 1–2 pada kedua mapel hanya mendapat tugas tanpa membaca; level 3–5 latihan sesuai level (boleh tertulis); level 6 memakai capaian fase kelas (`UI-14`).
- Tersedia tampilan tugas per kelompok, PDF yang bisa diunduh, dan versi papan tulis.
- PDF yang telah diunduh dapat dibuka tanpa koneksi internet; ini **bukan** klaim bahwa seluruh aplikasi offline.
- Konten dari bank template harus tetap tersedia ketika API AI gagal.
- Guru dapat memeriksa isi tugas sebelum mencetak [USULAN].

**Acceptance criteria:**

- **FR-05-AC-01:** setiap kelompok mendapatkan tugas sesuai mata pelajaran dan level, termasuk tugas tanpa membaca pada level 1–2 dan tugas fase pada level 6 (`UI-14`).
- **FR-05-AC-02:** PDF yang berhasil diunduh dapat dibuka setelah koneksi diputus; aplikasi web tidak diwajibkan berjalan offline.
- **FR-05-AC-03:** versi papan tulis tersedia; waktu salin kurang dari lima menit tetap target uji, belum hasil terverifikasi.
- **FR-05-AC-04:** tanpa API AI, tugas template tetap tersedia dan penjadwalan tetap berfungsi.

**Belum diputuskan:** bank konten/indikator kurikulum, gambar hitam-putih, paket halaman PDF, dan penyimpanan hasil ekspor (`Q-05`, `Q-09`, `Q-13`).

### FR-06 — Pembaruan level dan progres [MVP; P1 hanya usulan urutan]

**User story:** Sebagai guru, saya ingin melihat perubahan kemampuan setelah dua minggu.

**Persyaratan:**

- Simpan histori penilaian level bertanggal.
- Guru dapat melakukan penilaian ulang setelah sekitar dua minggu; tidak perlu memblokir pembaruan lebih awal [USULAN].
- Bandingkan level terbaru dengan baseline secara terpisah per mata pelajaran (UI-14); aturan baseline menunggu Q-10.
- Tampilkan status **naik, tetap, turun** per siswa.
- Jangan menyimpulkan kausalitas bahwa perubahan terjadi karena aplikasi.

**Acceptance criteria:**

- **FR-06-AC-01:** pembaruan menambahkan histori bertanggal tanpa menimpa penilaian sebelumnya.
- **FR-06-AC-02:** pada urutan level yang disepakati, perubahan ke level lebih tinggi ditampilkan naik, level sama tetap, dan lebih rendah turun. Contoh: literasi Kata (3) → Paragraf (4) ditampilkan naik; urutan mengikuti UI-14.
- **FR-06-AC-03:** perbandingan tidak dinyatakan sebagai bukti dampak kausal aplikasi.

**Belum diputuskan:** baseline, mata pelajaran, penilaian pertama/tanpa pembanding, koreksi histori, dan waktu pembaruan (`Q-02`, `Q-10`).

### FR-07 — Kepemilikan dan akses data [BRIEF + STARTER]

**Persyaratan:** Data siswa berada di area guru. Batas akses privat starter harus tetap berlaku bila Selaras menyimpan data melalui akun: pemilik berasal dari identitas terverifikasi, bukan `teacher_id` kiriman client. Kelas, siswa, penilaian, sesi, kelompok, jadwal, dan tugas turunannya mengikuti pemilik yang sama; tidak ada akses guru lain atau akses publik yang diizinkan oleh brief. Model identitas final masih `Q-03`.

**Acceptance criteria:**

- **FR-07-AC-01:** untuk penyimpanan berbasis akun, guru B tidak dapat membaca/mengubah/menghapus data guru A, termasuk lewat ID langsung dan akses data di luar UI.
- **FR-07-AC-02:** penggantian ID pemilik dari client ditolak; referensi siswa/kelas/kelompok milik guru lain tidak dapat disimpan.
- **FR-07-AC-03:** logout atau perubahan akun membersihkan cache privat; data guru sebelumnya tidak tampil pada akun berikutnya.
- **FR-07-AC-04:** sandbox memakai sampel lokal; tidak mengakses nama siswa, penilaian, atau sesi privat.

**Batas:** RLS `projects` yang tersedia tidak memberi proteksi otomatis pada entitas Selaras yang belum dibuat. Retensi, penghapusan berantai, dan penggunaan data siswa nyata menunggu `Q-09`.

### FR-08 — Validasi dan keadaan gagal [STARTER; penerapan produk direncanakan]

**Persyaratan:** Pertahankan validasi pada form dan batas API, isian saat submit gagal, pencegahan submit ganda, dan pesan kesalahan yang dapat ditindaklanjuti. Jangan memberi sukses untuk mutasi yang tidak memengaruhi data. ID tidak dikenal dan ID milik pengguna lain sama-sama tidak tersedia.

**Acceptance criteria:**

- **FR-08-AC-01:** input tidak valid menampilkan kesalahan yang terkait field tanpa menyimpan hasil parsial sebagai sukses; submit yang gagal mempertahankan isian pada layar tersebut.
- **FR-08-AC-02:** saat submit berjalan, tindakan yang sama tidak menghasilkan mutasi ganda; kesalahan dapat dicoba ulang secara eksplisit.
- **FR-08-AC-03:** loading, daftar kosong, kegagalan baca, dan data tidak tersedia memiliki keadaan yang jelas; daftar kosong tidak disamakan dengan kegagalan jaringan.
- **FR-08-AC-04:** ekspor gagal tidak ditampilkan sebagai unduhan berhasil; kegagalan AI menggunakan template sesuai `FR-05-AC-04`.

**Belum diputuskan:** penyimpanan draft saat reload, keluar dari wizard, serta perubahan input setelah jadwal dibuat (`Q-11`). Mempertahankan isian saat submit gagal tidak menjanjikan pemulihan setelah browser ditutup.

### FR-09 — Color sandbox [instruksi pengguna]

- Semua aksen UI memakai palet: #7173FF primary/selection, #FF3C7F destructive/error,
  #95F447 success, #00E5E3 info, #F2F226 warning/pending. Tints dan teks kecil diturunkan
  dari palet untuk keterbacaan; permukaan netral dan warna asli aset tetap.
- Primary #7173FF, destructive Button background #FF3C7F; keduanya memakai teks putih yang tebal dan terbaca.
- Semua Button/IconButton mendukung xs (32 px) dan sm (40 px, default); ukuran lama md/lg fallback ke sm. Button/IconButton memakai radius 10 px.
- Colors demo saja menampilkan #7173FF, #FF3C7F, #95F447, #00E5E3, #F2F226, dengan hex di bawah swatch.
- Tidak ada color picker, preset selectable, accent preview state, atau persistensi warna. Preview card tetap putih tanpa gradient.
- Aplikasi hanya mode terang; cookie theme lama diabaikan. Error form/notice tetap memakai tone semantik yang terbaca.

**FR-09-AC-01:** lima warna dan hex ditampilkan hanya di Colors demo; tidak ada palet sidebar atau kontrol memilih/mengedit warna.
**FR-09-AC-02:** semua varian Button/IconButton mendukung xs/sm, default sm, dan ukuran lama md/lg fallback ke sm; filled primary/destructive memakai teks putih yang memenuhi kontras teks besar tebal.
**FR-09-AC-03:** cookie theme=dark tidak dapat mengaktifkan dark mode; icon Buttons tetap terakses dan input/error/loading behavior dipertahankan.
**FR-09-AC-04:** kontrol, highlight navigasi, status, tabel/tag, grafik, progress, dan dekorasi demo memakai lima warna atau turunannya; lime/cyan/yellow memakai teks gelap. Preview tetap putih dan tidak ada palet sidebar.

## 6. Persyaratan nonfungsional

| ID     | Area                   | Requirement / acceptance evidence                                                                                                                                                                                                           |
| ------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-01 | Perangkat              | Mobile-first, nyaman di browser Android [BRIEF]. Uji layar inti pada 360 px tanpa kontrol terpotong [STARTER]; perangkat/browser uji final `Q-14`.                                                                                          |
| NFR-02 | Konektivitas           | Koneksi diperlukan untuk alur utama; hanya PDF yang sudah diunduh dijanjikan bisa dibuka offline [BRIEF], diuji melalui `FR-05-AC-02`.                                                                                                      |
| NFR-03 | Performa               | Interaksi inti responsif pada ponsel kelas menengah; ambang, jaringan, dan metode ukur belum ditentukan (`Q-14`). Tidak ada angka performa yang dianggap lulus tanpa pengukuran.                                                            |
| NFR-04 | Privasi                | Data siswa hanya di area guru; label kemampuan tidak menjadi nama kelompok cetak [BRIEF]. Bukti melalui `FR-03`/`FR-07`; data nyata menunggu `Q-09`.                                                                                        |
| NFR-05 | Keamanan               | Pertahankan validasi, akses berdasarkan identitas, RLS untuk data privat, dan secret server-only [STARTER]. Jangan menganggap redirect/UI tersembunyi sebagai otorisasi.                                                                    |
| NFR-06 | Ketahanan              | AI gagal tidak menghalangi jadwal atau tugas template [BRIEF]; bukti `FR-05-AC-04`.                                                                                                                                                         |
| NFR-07 | Auditabilitas          | Aturan penjadwalan dapat dijelaskan dan diuji tanpa AI [BRIEF]; bukti `FR-04-AC-01`–`AC-03`.                                                                                                                                                |
| NFR-08 | Demo                   | Alur inti demo kurang dari 90 detik [BRIEF]. Gunakan kelas 2 + 3 dan 15 siswa fiktif; durasi demo bukan batas jumlah siswa produk.                                                                                                          |
| NFR-09 | Aksesibilitas dan tema | Pertahankan label, kesalahan, fokus, keyboard, reduced motion, dan mode terang tunggal [instruksi pengguna terbaru]. Periksa fokus kembali dari dialog dan palet statis dan kontras tombol; cookie theme lama tidak mengaktifkan dark mode. |

**Data demo:** seluruh nama dan profil siswa fiktif, dengan penanda jelas. Jangan mengklaim persona simulasi sebagai wawancara guru. Konfirmasi izin data fiktif secara tertulis kepada penyelenggara sesuai draf brief (`Q-06`).

## 7. Layar dan navigasi

Layar produk di bawah adalah kebutuhan alur, sedangkan pemisahan halaman dan route merupakan **[USULAN]**. Belum ada route Selaras ini di starter. Titik masuk produk dan struktur wizard menunggu `Q-08`; beranda starter tetap sesuai `ST-04`.

| ID     | Route usulan                | Layar / kebutuhan                  | Data, tindakan, dan keadaan                                                                                           |
| ------ | --------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| SCR-01 | Belum ditentukan            | Titik masuk sesi (`J-01`)          | Buat sesi; kebutuhan daftar/sesi terakhir belum disetujui (`Q-08`).                                                   |
| SCR-02 | `/sessions/new`             | Konfigurasi (`FR-01`, `FR-04`)     | Pasangan kelas dan fase; pilihan mapel/durasi menunggu `Q-01`/`Q-13`; input salah terlihat.                           |
| SCR-03 | `/sessions/[id]/students`   | Siswa dan level (`FR-01`, `FR-02`) | Dua daftar kelas, observasi, akses tes opsional; kosong, input salah, loading, gagal simpan.                          |
| SCR-04 | `/sessions/[id]/groups`     | Kelompok (`FR-03`)                 | Kelompok per kelas dan pindah anggota manual; cegah anggota lintas kelas; kondisi tanpa level/kelompok kosong `Q-04`. |
| SCR-05 | `/sessions/[id]/schedule`   | Jadwal (`FR-04`)                   | Waktu, kelas, kelompok, kegiatan, status guru; hasil gagal/tidak valid tidak diberi status siap.                      |
| SCR-06 | `/sessions/[id]/worksheets` | Tugas dan ekspor (`FR-05`)         | Tugas per kelompok, PDF, papan tulis; loading, gagal ekspor, fallback template saat AI gagal.                         |
| SCR-07 | `/progress`                 | Progres (`FR-06`)                  | Penilaian sebelumnya/terbaru dan naik/tetap/turun; tanpa baseline menunggu `Q-10`.                                    |

**Navigasi kembali [USULAN]:** wizard kembali ke langkah sebelumnya tanpa menghapus input. Penyimpanan setelah refresh dan dampak edit terhadap hasil yang sudah dibuat belum diputuskan (`Q-11`). Tidak ada dashboard analitik kompleks dalam lingkup.

### UI-01 — Prototipe antarmuka tanpa backend [instruksi pengguna]

**Riwayat:** komposisi wizard/placeholder berikut digantikan oleh `UI-02`; batas tanpa backend dan data fiktif tetap berlaku.

Pengguna menyetujui guided session flow dan halaman progres terpisah untuk pratinjau UI.
Route awal digantikan oleh path Bahasa Indonesia tanpa prefix pada `UI-06`; bukan keputusan akses produksi.
Gunakan 15 siswa fiktif dari skenario demo dan state lokal selama halaman aplikasi terbuka.
Nama/definisi level, durasi/blok, isi tes, tugas, dan format PDF memakai placeholder sampai
keputusan final tersedia. Jangan menghasilkan jadwal, menilai tes, mengekspor PDF, atau
menampilkan level/perubahan palsu. Penambahan siswa fiktif, catatan observasi, dan pemindahan anggota adalah interaksi
lokal untuk meninjau UI; bukan penyimpanan siswa atau kontrak domain final.

**UI-01-AC-01:** SCR-01–SCR-07 tersedia, wizard dapat maju/mundur, dan state lokal tetap ada
saat berpindah halaman pratinjau. Semua data ditandai fiktif; reload mengembalikan sampel.
**UI-01-AC-02:** kontrol dan dialog memakai shared UI; konfigurasi, catatan observasi, dan
pemindahan anggota dapat dicoba tanpa Supabase/API. Anggota hanya dipindah dalam kelasnya.
**UI-01-AC-03:** pilihan level, tes, waktu, tugas, dan PDF belum ditentukan memakai placeholder;
tidak ada klaim jadwal valid, hasil tes, unduhan berhasil, atau kenaikan level.
**UI-01-AC-04:** starter auth/dashboard/projects, `/` tombol sandbox, dan seluruh demo tetap
tersedia. Sandbox menyediakan tautan ke pratinjau aplikasi.

Q-01–Q-15 tetap terbuka untuk implementasi produk, selain pilihan navigasi prototipe di atas.
Prototipe ini bukan MVP fungsional atau bukti acceptance FR-01–FR-08.

### UI-02 — Konten dan hierarki dari empat screenshot [instruksi pengguna terbaru]

Empat screenshot menggantikan wizard/placeholder `UI-01` sebagai arah konten pratinjau.
Gunakan `/kelas` → `/kelas/[classId]` dengan tab Siswa/Level/Progres/Sesi →
`/kelas/[classId]/sesi/baru` dan `/kelas/[classId]/sesi/[sessionId]` (`UI-06`).
Breadcrumb: Kelas → Kelas Rangkap 2-3 → Sesi → Susun Sesi Baru atau Literasi, 14 Okt 2026.
`/sesi` dan `/progres` mengarah ke kelas contoh melalui redirect.

**UI-02-AC-01:** daftar rombel, detail kelas dengan empat tab, matriks level literasi/numerasi,
rubrik pada screenshot, pembuat sesi, dan detail sesi tersedia memakai shared UI/SidebarNav.
**UI-02-AC-02:** lima label level dan rubrik screenshot adalah konten historis, digantikan UI-14; sebelumnya disetujui
untuk UI; perubahan level, catatan, rombel, dan sesi hanya disimpan dalam state lokal.
**UI-02-AC-03:** contoh Literasi memakai 70 menit, blok 15 menit, pembukaan/penutup 5 menit,
dan kegiatan yang diberikan screenshot. Susun jadwal menampilkan template contoh, bukan
scheduler pedagogis final. Konten numerasi yang tidak diberikan tetap belum tersedia.
**UI-02-AC-04:** gunakan roster screenshot level (7 siswa Kelas 2, 8 siswa Kelas 3). Screenshot
sesi menunjukkan 8+7; jumlah kelompok/kelas pada UI dihitung dari roster untuk konsistensi.
**UI-02-AC-05:** simpan/tersimpan berarti state pratinjau sementara, bukan backend/autosave
persisten. Cetak/Simpan PDF membuka dialog cetak browser; versi papan tulis dapat dilihat.
Tidak ada Supabase, AI, backend, atau klaim validasi lengkap V1–V5.

Ini menerima komposisi dan fixture UI yang terlihat, bukan kontrak produksi untuk TaRL,
indikator kurikulum, aturan scheduler, baseline, retensi, atau format PDF final. Q-* yang
masih terkait tetap terbuka; isi tes diagnostik tidak diperoleh dari gambar rubrik saja.

### UI-03 — Kartu tanpa shadow dan footer profil [instruksi pengguna]

**UI-03-AC-01:** kartu/tabel aplikasi Selaras memakai border tipis tanpa shadow, termasuk hover
pada kartu yang ditautkan. Indikator fokus dan perilaku kontrol tetap dipertahankan.
**UI-03-AC-02:** footer SidebarNav menampilkan Avatar, nama dan email contoh, serta dropdown;
avatar tetap dapat dibuka saat sidebar collapsed dan pada Drawer mobile.
**UI-03-AC-03:** identitas ditandai demo, bukan akun autentikasi; keputusan profil produksi
tetap terbuka (`Q-03`).

### UI-04 — Pencarian, filter, dan halaman daftar siswa [instruksi pengguna]

**UI-04-AC-01:** tiap kartu kelas pada tab Siswa menampilkan pencarian nama dan filter
kelompok Biru/Hijau/Oranye di samping judul; kontrol membungkus pada layar sempit.
**UI-04-AC-02:** tampilkan maksimal lima siswa per halaman. Pagination muncul jika hasil
setelah pencarian/filter melebihi lima; masing-masing kelas memiliki state terpisah.
**UI-04-AC-03:** pencarian/filter digabungkan dalam kelas yang sama, menampilkan jumlah hasil,
dan kembali ke halaman pertama ketika kontrol berubah. Data kosong tetap dapat ditambah.
Ini menerima pencarian/filter lokal untuk tab Siswa saja, bukan layanan pencarian backend
atau perubahan lingkup layar lain.

### UI-05 — Pemilih kelas pada header detail [instruksi pengguna]

**UI-05-AC-01:** header detail kelas menyediakan Select di samping badge fase, dengan kelas
aktif terpilih dan opsi semua rombel yang tersedia dalam pratinjau lokal.
**UI-05-AC-02:** memilih rombel lain langsung membuka detail rombel tersebut pada tab yang
sama; breadcrumb, judul, fase, dan konten mengikuti rombel baru. State pencarian/filter tab
tidak terbawa ke rombel lain. Tidak menambahkan rombel fiktif atau backend baru.

### UI-06 — Path Bahasa Indonesia tanpa prefix aplikasi [instruksi pengguna]

**UI-06-AC-01:** halaman rombel memakai `/kelas`; detail memakai `/kelas/[classId]` dan
tab `/siswa`, `/level`, `/progres`, `/sesi`. Sesi baru memakai `/sesi/baru` di dalam kelas,
dan detail sesi memakai `/sesi/[sessionId]` di dalam kelas. Tidak ada prefix `/app`.
**UI-06-AC-02:** semua tautan, breadcrumb, navigasi, dan pemilih kelas mengikuti path baru.
Shell/provider memakai route group yang tidak muncul dalam URL; data pratinjau tetap terpisah
per rombel. Starter `/`, sandbox, auth, dashboard, dan projects tetap tersedia.

### UI-07 — Opsi dropdown akun [instruksi pengguna]

**UI-07-AC-01:** dropdown avatar hanya menampilkan Settings dan Sign out.
**UI-07-AC-02:** kedua opsi dinonaktifkan dalam pratinjau publik karena Settings belum punya
halaman dan profil demo tidak terautentikasi. Jangan mengarahkan ke halaman rekaan atau
memanggil logout terhadap sesi starter yang tidak terkait. Aktifkan setelah keputusan identitas
dan tujuan pengaturan diselesaikan pada `Q-03`.

### UI-09 — Penempatan tindakan Observasi [instruksi pengguna]

**UI-09-AC-01:** tabel tab Level memiliki kolom Observasi di antara Tingkat Numerasi dan
Status; tombol membuka form observasi untuk siswa pada baris terkait.
**UI-09-AC-02:** tab Progres tidak memiliki tombol tambah Observasi pada desktop maupun mobile.
Tindakan Riwayat tetap tersedia untuk membaca penilaian dan catatan yang sudah ada.

### UI-10 — Tampilan sederhana untuk guru [instruksi pengguna]

**UI-10-AC-01:** navigasi aplikasi berupa header dengan logo kiri, Kelas dan Jadwal di tengah,
serta profil kanan. Teks navigasi hitam dan garis ungu bergerak mengikuti halaman aktif,
dengan dukungan reduced motion. `/jadwal` menampilkan sesi dari seluruh kelas berdasarkan
tanggal yang tersedia; jangan mengarang jam pelajaran yang belum disimpan.
**UI-10-AC-02:** gunakan Nunito, alternatif rounded bebas lisensi SF Pro Rounded, dengan
fallback sistem untuk Android. Ukuran teks minimum 12 px, border utama 2 px, kartu putih
tanpa shadow. Setiap Select/menu memakai pastel dan teks gelap yang sesuai; status destruktif
tetap semantik dan fokus/keyboard tetap tersedia.
**UI-10-AC-03:** kartu kelas menampilkan maksimum tiga avatar inisial siswa yang tumpang tindih
dan jumlah anggota berupa angka. Detail kelas tidak menampilkan fase atau pemilih kelas.
**UI-10-AC-04:** Level tetap dikelompokkan per kelas, tanpa kolom Kelas, maksimum sepuluh siswa
per halaman per kelas. Riwayat observasi berada di antara Numerasi dan Status; riwayat dapat
dibaca lalu catatan baru ditambahkan. Tabel lain mempertahankan susunannya dengan gaya bersama.
**UI-10-AC-05:** hilangkan label “contoh” dan jargon teknis pada aplikasi. Gunakan bahasa
Indonesia langsung, serta satu pemberitahuan jelas bahwa perubahan hilang saat halaman dimuat
ulang. Tidak mengklaim penyimpanan backend atau identitas autentikasi.
**UI-10-AC-06:** sederhanakan sesi menjadi pilih mata pelajaran/tanggal → lihat jadwal →
simpan/cetak. Waktu yang hanya punya satu nilai ditampilkan sebagai ringkasan. Hilangkan
panel aturan teknis; tugas kelompok tetap dapat dibuka saat diperlukan. Jadwal dan kegiatan
yang belum disediakan tetap menyatakan belum tersedia. Tidak menetapkan level baru atau
mengubah alur penilaian/pengelompokan yang belum disepakati.

Ini menggantikan sidebar, pemilih kelas `UI-05`, dan copy teknis terdahulu untuk tampilan produk.

### UI-11 — Spasi, pencarian, Observasi, dan gabungan jadwal [instruksi pengguna]

**UI-11-AC-01:** gunakan spasi kecil 15 px, sedang 30 px, dan 60 px antar kelompok
konten pada tampilan produk. Jarak mikro ikon/label dan ukuran kontrol tetap.
**UI-11-AC-02:** SearchInput memiliki satu permukaan/border, ikon dan teks sejajar,
serta fokus terlihat. Pencarian kelas/siswa tetap berfungsi, dapat dikosongkan, dan tidak
terpotong pada layar sempit; perubahan pencarian siswa kembali ke halaman pertama.
**UI-11-AC-03:** di tab Level, pulihkan tombol Observasi yang langsung membuka formulir
catatan. Tetap di antara Numerasi dan Status; kolom, pilihan level, dan pagination tidak berubah.
Riwayat observasi di tempat lain tetap tersedia. Ini menggantikan aksi history-first Level pada
`UI-10-AC-04`.
**UI-11-AC-04:** `/jadwal` menggabungkan jadwal lengkap yang disimpan dari seluruh kelas,
dikelompokkan per tanggal, dengan kegiatan/rotasi tiap sesi, bukan hanya tabel tautan.
Gunakan daftar siswa dan kelas yang disimpan bersama sesi. Pertahankan tautan detail,
keadaan kosong, dan pemberitahuan materi yang belum tersedia. Jangan mengarang jam mulai,
urutan pelajaran dalam satu hari, atau aturan bentrok antar sesi yang belum ditetapkan.

### UI-14 — Enam level dan tugas mandiri, tetap tiga kelompok [instruksi pengguna]

**UI-14-AC-01:** dropdown, panduan, observasi, dan progres memakai enam level per mapel berikut.

| Level | Literasi | Kriteria literasi | Numerasi | Kriteria numerasi |
| --- | --- | --- | --- | --- |
| 1 | Pemula | Belum mengenal huruf | Pemula | Belum mengenal angka 1-9 |
| 2 | Huruf | Mengenal huruf, tetapi belum bisa membaca kata | Angka 1-9 | Mengenal angka 1-9, tetapi belum mengenal angka 11-99 |
| 3 | Kata | Membaca kata sederhana, tetapi belum bisa membaca paragraf | Angka 11-99 | Mengenal angka 11-99, tetapi belum bisa pengurangan |
| 4 | Paragraf | Membaca paragraf pendek, tetapi belum bisa membaca cerita | Pengurangan | Bisa pengurangan dua angka dengan meminjam, tetapi belum bisa pembagian |
| 5 | Cerita | Membaca cerita pendek dengan lancar | Pembagian | Bisa membagi bilangan tiga angka dengan satu angka |
| 6 | Sesuai fase | Sudah melampaui level dasar; tugas mengikuti capaian fase kelasnya | Sesuai fase | Sudah melampaui level dasar; tugas mengikuti capaian fase kelasnya |

**UI-14-AC-02:** simpan level 1–6 dalam state preview dan tambah histori saat penilaian berubah;
jangan menimpa histori. UI-15 memperbarui pengelompokan otomatis menurut level; perpindahan manual tetap berlaku per mapel.
**UI-14-AC-03:** pertahankan tepat tiga pilihan kelompok netral A/B/C per kelas serta pemindahan
manual dalam kelas. Enam level bukan enam kelompok. Dalam kelompok campuran, bedakan panduan
tugas menurut level tiap siswa pada mata pelajaran sesi; jangan menetapkan satu tugas tertulis
untuk semua anggota berdasarkan kelompoknya saja.
**UI-14-AC-04:** level 1–2 hanya tugas tanpa membaca pada kedua mapel (gambar/benda konkret);
level 3–5 latihan sesuai level, boleh tertulis; level 6 diarahkan ke fase kelas A/B/C, tanpa
fallback ke latihan level dasar. Siswa tanpa level tetap ditandai belum dinilai.
**UI-14-AC-05:** preview tugas, rotasi mandiri, papan tulis, dan cetak memakai aturan yang sama
serta roster/kelas/mapel sesi tersimpan. Konten fase yang belum dipilih dinyatakan belum tersedia;
jangan mengarang capaian kurikulum. Template latihan di UI merupakan panduan, bukan worksheet
visual yang telah ditinjau. Jadwal numerasi belum tersedia tidak boleh memakai rotasi literasi.

Keputusan ini menyelesaikan nama/urutan/indikator level dalam `Q-02`. Isi/skor tes, koreksi dan
baseline (`Q-02`, `Q-10`) serta konten/capaian fase dan bank visual (`Q-13`) masih terbuka. Pemetaan enam level ke tiga kelompok kemudian diterima pada UI-15; aturan penyimpanan produksi tetap belum diputuskan.

### UI-15 — Pengelompokan menurut mapel dan level anggota [instruksi pengguna]

**UI-15-AC-01:** setiap kelas tetap memiliki tiga kelompok: Biru (level 1–2), Hijau
(level 3–5), dan Oranye (level 6). Gunakan level literasi pada sesi literasi dan numerasi
pada sesi numerasi; jangan mencampur kelas atau memaksa jumlah anggota seimbang.
**UI-15-AC-02:** pada tab Siswa tersedia Select mata pelajaran untuk melihat kelompok.
Tabel siswa, filter kelompok, jumlah anggota, dan kartu kelompok memakai mapel yang sama.
Setiap nama anggota di kartu menampilkan nomor serta nama level mapel terpilih.
**UI-15-AC-03:** guru tetap dapat memindahkan anggota dalam kelas. Penyesuaian manual
berlaku hanya untuk mapel yang dipilih dan dipertahankan saat mengganti tampilan/mapel atau
memperbarui level. Anggota tanpa penyesuaian manual mengikuti pemetaan otomatis terbaru;
riwayat penilaian tidak dihapus atau diganti.
**UI-15-AC-04:** preview mempertahankan kelompok yang sudah dimiliki siswa tanpa level
(default Biru pada alur tambah siswa yang ada), dengan label Belum dinilai. Jangan menyamakan
belum dinilai dengan level 1 atau memberi tugas sebelum penilaian. Aturan produksi untuk
siswa tanpa level tetap menunggu Q-04. Kelompok kosong tetap dapat ditampilkan.
**UI-15-AC-05:** penyimpanan sesi lokal mengambil kelompok sesuai mapel sesi beserta salinan
roster/levelnya. Sesi yang sudah tersimpan tidak berubah ketika kelompok, mapel tampilan,
atau penilaian berikutnya berubah. Ringkasan tugas memakai kelompok mapel yang sama dan tetap
membedakan kebutuhan anggota yang dipindah manual.

**UI-15-AC-06:** tombol Panduan kelompok berada di samping Select Kelompok berdasarkan.
Dialog mengikuti pola Panduan level dan menjelaskan tiga rentang level, jenis tugas,
pemisahan per kelas/mapel, perpindahan manual, dan siswa yang belum dinilai.

Keputusan ini menerima pemetaan yang sebelumnya terbuka pada Q-04 dan menggantikan aturan
keanggotaan tetap untuk semua perubahan level pada UI-14. Tidak menambahkan backend, batas
kapasitas, algoritme balancing, atau kebijakan generate ulang sesi produksi.

### UI-17 — Mata pelajaran, topik, dan fokus kemampuan sesi [instruksi pengguna]

**UI-17-AC-01:** Susun jadwal memisahkan Mata pelajaran, Tema/topik (opsional), Fokus
kemampuan (Literasi/Numerasi), dan tanggal. Nama mapel diisi guru agar dapat memakai Bahasa
Indonesia, Matematika, PPKn/Pendidikan Pancasila, SBdP/Seni, PJOK, atau nama dalam kurikulumnya.
Nama wajib, dipangkas, maksimal 80 karakter; topik maksimal 160 karakter. Ini bukan daftar
mapel nasional yang dibakukan dan tidak menambahkan pemilih kurikulum.
**UI-17-AC-02:** fokus kemampuan menentukan pengelompokan, penyesuaian manual, level, dan
panduan tugas yang sudah diterima pada UI-14/UI-15. Tidak membuat level PPKn, PJOK, atau
mapel lain dari hasil literasi/numerasi. Riwayat penilaian tetap terpisah untuk dua kemampuan.
**UI-17-AC-03:** semua mapel/fokus dapat ditinjau dan disimpan lokal memakai struktur waktu
preview 70 menit yang sudah ada: pembuka 5 menit, empat blok bergantian 15 menit, penutup
5 menit. Struktur ini bersifat netral-mapel dan tidak mengisi kegiatan fonik/paragraf untuk
mapel lain. Guru menyiapkan materi sesuai tujuan mapel/topik; belum ada generator materi,
bank kurikulum, atau algoritme penjadwalan produksi. Keadaan tanpa siswa tetap menghalangi simpan.
**UI-17-AC-04:** daftar sesi, detail, Jadwal, papan tulis, dan cetak mempertahankan mapel,
topik, fokus, serta roster/kelas/kelompok snapshot yang sama. Perubahan form perlu diterapkan
melalui Lihat jadwal sebelum simpan/cetak; perubahan roster/level berikutnya tidak mengubah sesi lama.
**UI-17-AC-05:** keluaran menjelaskan bahwa tugas merupakan panduan berdasarkan fokus
kemampuan yang perlu disesuaikan guru ke mapel/topik. Aturan tanpa membaca pada level 1–2,
latihan pada 3–5, dan capaian fase pada 6 tetap berlaku. Materi fase yang belum dipilih tidak
diklaim tersedia. Tidak menambah backend, persistensi browser, atau PDF khusus.

Ini menggantikan batas preview dua pilihan mapel dan rotasi literasi saja pada UI-14-AC-05;
dua pilihan tersebut kini adalah fokus kemampuan. Kurikulum sekolah, tujuan/materi tiap mapel,
dan validasi pedagogisnya tetap Q-13. Parameter produksi/tie-breaker tetap Q-01.

### UI-18 — Penyusun sesi lokal, V1–V5, dan lembar aman [proposal pengguna]

**UI-18-AC-01:** fungsi TypeScript murni menghasilkan jadwal deterministik dengan pembuka/
penutup 5 menit dan blok inti 10/15/20 menit. Durasi menit bulat harus habis dibagi setelah
pengurangan 10 menit; maksimal 240 menit merupakan batas teknis preview. Lintas fase perlu
minimal dua blok inti. Satu fase memiliki blok inti pertama bersama. Berikutnya bergantian;
kelas dengan level minimum lebih rendah didahulukan, seri memakai kelas pertama. Parameter
pedagogis produksi tetap Q-01.
**UI-18-AC-02:** pemeriksa independen memeriksa V1 tepat satu penugasan guru (boleh kedua
kelas bersama), V2 tepat satu kegiatan per kelompok beranggota dan cakupan tugas, V3 waktu
berurutan/durasi tepat, V4 tiap kelas mendapat blok inti bersama guru, V5 tugas mandiri level
1–2 tanpa membaca. Periksa ulang sebelum simpan/cetak; invalid menampilkan sebab dan diblokir.
**UI-18-AC-03:** template draf asli literasi/numerasi 1–5 berisi latihan nyata dan gambar
hitam-putih untuk kegiatan tanpa membaca. Guru memeriksa kesesuaian sebelum digunakan; ini
bukan konten kurikulum/ASER tervalidasi. Level 6 perlu isian tugas guru per kelas, sesuai
capaian kelas; tidak diganti latihan dasar. Kelas kosong/siswa tanpa level menghalangi susun.
**UI-18-AC-04:** simpan snapshot roster/kelompok/tugas/blok dalam memori; perubahan berikutnya
tidak mengubah sesi lama. Builder, detail, Jadwal, papan tulis dan cetak memakai snapshot sama.
Mapel/topik UI-17 tetap tersedia; latihan mengikuti fokus kemampuan. Guru menyiapkan tatap muka.
**UI-18-AC-05:** guru melihat anggota/level/petunjuk. Papan tulis/lembar A4 memakai proyeksi
terpisah: kelas, nama kelompok netral, nomor kegiatan dan isi latihan; tanpa nama/ID siswa,
nomor/nama level, atau label fase. Setiap kelompok mulai halaman baru; kegiatan kelompok
campuran dibagikan secara lisan saat pembukaan. Konten panjang boleh berlanjut, tidak dipotong.
Petunjuk 1–2 diberikan lisan saat pembukaan; lembar tidak memerlukan membaca. Cetak browser.
**UI-18-AC-06:** tulis kontrak fase sama/lintas, V1–V5, parameter invalid, kelompok campuran,
snapshot dan proyeksi tanpa identitas. Tes tidak dijalankan sesuai instruksi pengguna.
Typecheck/lint/build tetap berlaku; tidak ada AI/backend/persistensi baru.

Tugas isian guru dipisahkan per kelas dan fokus; mengganti fokus tidak memakai tugas fokus lain.
Ini menggantikan rotasi konstan/panduan saja UI-17. Konten fase diisi guru sementara;
peninjauan pedagogis/kurikulum tetap Q-13. Aturan warna kelompok tetap UI-15.

### UI-19 — Penyunting sesi dan pilihan mapel [instruksi pengguna]

**UI-19-AC-01:** Mata pelajaran memakai Select Bahasa Indonesia, Matematika, PPKn/Pendidikan
Pancasila, SBdP/Seni, PJOK, IPAS, dan Lainnya. Lainnya menampilkan Input wajib; nama tersimpan
sebagai nama mapel sebenarnya, bukan label Lainnya. Pilihan ini bukan daftar kurikulum nasional.
**UI-19-AC-02:** guru dapat mengubah, menambah, menghapus, dan mengurutkan blok inti dengan
kontrol keyboard. Setiap blok inti boleh 10/15/20 menit dan memilih kelas bersama guru serta
catatan kegiatan. Pembuka/penutup tetap 5 menit. Rentang waktu dan durasi total dihitung ulang;
blok pertama satu fase tetap harus bersama. V1–V5 diperiksa pada hasil suntingan.
**UI-19-AC-03:** guru dapat mengubah judul, petunjuk, bacaan, soal, dan jenis aktivitas; menambah
atau menghapus kegiatan per kelompok/level anggotanya. Kegiatan visual memakai pola gambar
atau jumlah benda yang dapat disunting. Siswa 1–2 tidak mendapat pilihan tertulis; level 6
memakai tugas kelas dari guru. Siswa boleh menerima beberapa kegiatan, tetapi harus memiliki
minimal satu tugas. Setiap blok mandiri mengacu daftar kegiatan kelompok terbaru.
**UI-19-AC-04:** sesi tersimpan memiliki aksi Ubah sesi pada route lokal Bahasa Indonesia
`/kelas/[classId]/sesi/[sessionId]/ubah`. Simpan mempertahankan ID dan memperbarui snapshot
sesi itu saja. Batal/kembali tidak mengubah sesi lama. Roster tersimpan tetap menjadi dasar
suntingan; bukan otomatis mengambil level/kelompok terbaru.
**UI-19-AC-05:** perubahan metadata perlu diterapkan sebelum menyunting blok/tugas atau
mencetak. Perubahan mapel/topik/tanggal saja mempertahankan suntingan. Perubahan fokus,
durasi, panjang blok, atau tugas awal yang memerlukan penyusunan ulang meminta konfirmasi
sebelum mengganti suntingan. Pembatalan mempertahankan isian form dan draf saat ini.
**UI-19-AC-06:** simpan memakai rencana hasil suntingan, bukan menghasilkan ulang diam-diam.
Validasi konten dan V1–V5 berlaku sebelum simpan/cetak; proyeksi A4/papan tetap tanpa identitas
atau label level. Konten bebas dicetak apa adanya dan diperiksa guru. Semua perubahan tetap
memori saja, tanpa backend/AI. Tes kontrak ditulis tanpa dijalankan sesuai instruksi pengguna.

Ini memperluas UI-18: pemeriksaan V2 mengizinkan rangkaian tugas per siswa, V3 mengizinkan
campuran blok 10/15/20 menit. Durasi yang tidak habis dibagi hanya menghalangi generator awal,
bukan rencana manual yang seluruh bloknya valid dan jumlah menitnya tepat.

### UI-20 — Kelas mandiri dan alur gabung [instruksi pengguna dan tiga referensi UI]

**UI-20-AC-01:** daftar Kelas menyediakan kartu mandiri Kelas 1 sampai Kelas 6, masing-masing
32 siswa fiktif. Kartu membuka detail Siswa/Level/Progres satu kelas; penjadwalan menunggu
kelas digabung. Kartu memakai banner yang sudah tersedia, ikon, maksimal tiga avatar dan jumlah.
Penyempurnaan pengguna: ikuti tata letak kartu pada branch `main` (banner, ikon dan judul,
lalu footer berseparator dengan jumlah siswa dan sesi terakhir). Jumlah siswa tetap memakai
AvatarGroup branch ini, bukan ikon pengguna; pertahankan alur pilih/gabung yang sudah tersedia.
Lebar dan jarak juga mengikuti `main`: grid 1/2/3 kolom (sm/xl), gap 20 px, banner 72 px,
padding kartu 16 px, judul 20 px dan ikon 24 px.
**UI-20-AC-02:** tombol Gabungkan kelas melayang kanan bawah memasuki mode pilih. Guru memilih
tepat dua kelas mandiri, melihat batas 2 pilihan, lalu menekan tombol panah lanjut. Batal tidak
mengubah data. Pilihan aktif berborder ungu; pilihan tak cocok/nonmandiri tidak bisa dipilih.
Pasangan baru menerima dua tingkat kelas yang selisihnya tepat satu: 1+2, 2+3, 3+4, 4+5,
atau 5+6; kedua urutan diterima. Kelas setingkat atau berselisih lebih dari satu tidak diterima.
**UI-20-AC-03:** setelah digabung, daftar menampilkan dua kartu sumber dengan tanda plus di
antaranya dalam satu panel. Kartu mandiri sumber diganti pasangan itu, tanpa menggandakan siswa.
Panel gabungan memakai dua kolom grid pada sm ke atas, dengan gap 20 px; setiap kartu sumber
selebar kartu mandiri. Tanda plus diposisikan di tengah gap tanpa mengambil lebar kartu.
Detail pasangan mempertahankan kelas asal, ID siswa, histori dan penyesuaian kelompok. Pasangan
lama 2+3 dan sesi demonya dipertahankan; aturan baru tidak menghapus fixture lama.
**UI-20-AC-04:** penyimpanan tetap memori; aksi/provider memvalidasi pasangan, dua ID berbeda,
status mandiri, dan keberadaan kelas sebelum perubahan. Pasangan tidak sah tidak mengubah state.
Tampilan responsif menumpuk dua kartu pada layar sempit; aksi melayang memiliki label keyboard.
**UI-20-AC-05:** pisahkan daftar menjadi bagian Kelas gabungan di atas dan Kelas mandiri di
bawah, dengan judul dan pesan kosong masing-masing. Pencarian berlaku pada keduanya. Mode
pilih gabung tetap hanya menampilkan kelas mandiri; hasil gabung berpindah ke bagian atas.

### UI-21 — Foto opsional pada tugas kelompok [instruksi pengguna]

**UI-21-AC-01:** dialog tugas menyediakan pilihan foto JPG/PNG/WebP opsional, maksimal 5 MB,
pratinjau, keterangan aksesibel, ganti dan hapus. Gunakan shared Dropzone; jangan upload ke
layanan/server. Baca file sebagai data URL dalam memori, periksa format/ukuran dan decoding;
batalkan pembacaan saat dialog ditutup. Kesalahan mempertahankan isian dan foto sebelumnya.
**UI-21-AC-02:** foto yang disimpan tampil pada preview tugas guru, detail, papan tulis dan
lembar cetak dari snapshot yang sama. Membatalkan dialog tidak mengganti foto tugas lama.
Tidak menyimpan nama file atau identitas roster ke keluaran siswa. Teks/foto bebas tetap
perlu diperiksa guru agar tidak berisi identitas dan label kemampuan.
**UI-21-AC-03:** pada level 1–2, guru harus menyatakan bahwa foto tidak memerlukan membaca;
foto pengganti perlu konfirmasi ulang. V5 memeriksa pernyataan itu serta struktur kegiatan,
bukan melakukan OCR atau mengklaim isi gambar diaudit otomatis. Tanpa foto alur tetap bekerja.
Tidak menambah backend, penyimpanan lampiran permanen, AI/OCR atau persistensi browser.

### UI-22 — Beranda publik Selaras [instruksi pengguna]

**UI-22-AC-01:** `/` menjadi landing page berbahasa Indonesia untuk guru kelas rangkap,
menjelaskan kelas, kelompok, penyusunan sesi dan keluaran cetak/papan tulis. CTA membuka
pratinjau `/kelas`; `/sandbox` tetap tersedia melalui footer. Ini mengganti keputusan beranda
tombol tunggal pada ST-04, tanpa mengubah autentikasi, dashboard atau proyek starter.
**UI-22-AC-02:** gunakan desain bersama, navigasi bagian halaman dan ilustrasi sesi tanpa
identitas siswa. Jelaskan data fiktif dan perubahan hilang saat reload sebelum mencoba.
Tidak mengklaim penyimpanan permanen, AI aktif, dampak terukur atau dukungan offline aplikasi.
Tidak menambah backend, pendaftaran, harga atau testimoni rekaan.

## 8. Model data konseptual [USULAN]

| Entitas             | Field inti                                                                                            | Relasi                     |
| ------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------- |
| `teachers`          | `id`, `display_name`, `created_at`                                                                    | Memiliki sesi dan kelas    |
| `classrooms`        | `id`, `teacher_id`, `grade`, `name`                                                                   | Memiliki siswa             |
| `students`          | `id`, `classroom_id`, `display_name`                                                                  | Memiliki histori level     |
| `level_assessments` | `id`, `student_id`, `subject`, `level`, `assessed_at`, `source`                                       | Histori siswa              |
| `sessions`          | `id`, `teacher_id`, `class_a_id`, `class_b_id`, `subject`, `duration_minutes`, `phase_mode`, `status` | Memiliki kelompok dan blok |
| `groups`            | `id`, `session_id`, `classroom_id`, `label`, `level`                                                  | Memiliki anggota           |
| `group_members`     | `group_id`, `student_id`                                                                              | Keanggotaan sesi           |
| `schedule_blocks`   | `id`, `session_id`, `start_minute`, `end_minute`, `teacher_group_id`, `activity_json`                 | Blok jadwal                |
| `worksheets`        | `id`, `session_id`, `group_id`, `content_json`, `template_id`                                         | Lembar tugas               |

**Kepemilikan konseptual (`FR-07`):**

| Data                            | Pengelola / akses yang dibutuhkan                                  | Batas keputusan                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Identitas guru                  | Guru mengakses akun sendiri melalui mekanisme starter jika dipakai | Registrasi/login demo dan kebutuhan profil guru `Q-03`; tabel `teachers` belum wajib.                                    |
| Kelas dan siswa                 | Guru terkait; siswa tidak memiliki akun                            | Penyimpanan lintas sesi, edit/hapus, minimum identitas, dan retensi `Q-09`.                                              |
| Histori level                   | Guru terkait siswa; histori tetap ada saat penilaian baru          | Baseline/koreksi histori `Q-10`; level per mapel `Q-02`.                                                                 |
| Sesi, kelompok, anggota, jadwal | Pemilik sesi; semua relasi harus berasal dari guru yang sama       | Snapshot vs roster yang berubah, generate ulang `Q-11`.                                                                  |
| Tugas / PDF                     | Guru terkait; lembar siswa memakai nama kelompok netral            | Konten PDF dan retensi `Q-05`/`Q-09`. File unduhan berada di perangkat guru; tidak berarti URL unduhan publik disetujui. |
| Template / data demo            | Konten nonprivat; sampel fiktif terpisah dari siswa nyata          | Penanggung jawab/validasi konten `Q-13`; demo `Q-06`.                                                                    |
| Proyek contoh starter           | Akun Supabase pemilik proyek, sesuai RLS yang ada                  | Bukan sesi/kelas Selaras; keputusan adaptasi `Q-08`, tanpa konversi data otomatis.                                       |

**Aturan integritas:** `class_a_id != class_b_id`; semua siswa dalam `group_members` berasal dari `classroom_id` kelompok; satu siswa maksimal satu kelompok per sesi; `start_minute < end_minute`; histori level tidak ditimpa saat pembaruan.

Untuk hackathon, satu database dan satu aplikasi web sudah cukup. Pilihan penyimpanan data dan autentikasi harus diputuskan sesuai waktu; jangan menganggap tabel di atas sebagai skema migrasi final.

## 9. Arsitektur teknis [USULAN]

**Fondasi yang tersedia [STARTER]:** Next.js App Router, strict TypeScript, Tailwind CSS, Beautiful UI dengan Base UI dan Lucide, Supabase SSR/Postgres, TanStack Query, React Hook Form, dan Zod. Gunakan UI bersama di `src/components/ui/`; tidak menambahkan shadcn/ui.

**Konflik draf:** rekomendasi shadcn/ui pada PRD sebelumnya bertentangan dengan AGENTS.md dan library yang tersedia. Rekomendasi itu tidak dianggap keputusan produk yang diterima. Pengguna kemudian menyetujui restyle UI yang sudah ada dengan spesifikasi Classroomscreen: Nunito Sans, pastel, primary #7173FF, tombol bersudut 10 px, dan mode terang saja. Pengguna meminta Colors demo dengan palet statis; palet sidebar dihapus atas instruksi terbaru. Fondasi visual mengikuti DESIGN.md/AGENTS.md terbaru; komposisi layar produk masih `Q-15`.

**Jalur data [STARTER]:** komponen → hook TanStack Query → API fitur → Supabase SDK dengan RLS untuk CRUD biasa. Route Handler dipakai untuk integrasi eksternal terautentikasi dan implementasi server-only bila dibutuhkan. Lokasi pembuatan PDF, persistensi Selaras, serta kontrak domain di bawah masih usulan, bukan alasan menambah backend baru.

**Pembagian tanggung jawab:**

- **Client:** form wizard, validasi interaksi, preview kelompok/jadwal, progress.
- **Domain logic (pure functions):** `detectPhase`, `groupStudents`, `buildSchedule`, `validateSchedule`, `compareLevels`.
- **Database:** kelas, siswa, histori level, sesi, hasil jadwal.
- **Server-only:** PDF dan integrasi AI opsional; secret tidak diekspos ke browser.

**Prinsip utama:** fungsi fase, pengelompokan, dan penjadwalan deterministik dan diuji secara terpisah. AI tidak menentukan alokasi guru.

## 10. Kontrak fungsi dan API [USULAN]

### Fungsi domain

```ts
type Grade = 1 | 2 | 3 | 4 | 5 | 6;
type Phase = "A" | "B" | "C";
type Level = "1" | "2" | "3" | "4" | "5" | "6";

type PhaseMode = "same_phase" | "cross_phase";

function detectPhase(grade: Grade): Phase;
function getPhaseMode(a: Grade, b: Grade): PhaseMode;
function groupStudents(students: Student[]): Group[];
function buildSchedule(input: ScheduleInput): ScheduleBlock[];
function validateSchedule(blocks: ScheduleBlock[]): ValidationResult;
function compareLevels(previous: Level, current: Level): "up" | "same" | "down";
```

### Endpoint server yang mungkin diperlukan

| Method | Path                          | Tujuan                                                |
| ------ | ----------------------------- | ----------------------------------------------------- |
| `POST` | `/api/sessions/[id]/generate` | Generate jadwal dari data sesi yang sudah tervalidasi |
| `GET`  | `/api/sessions/[id]/export`   | Hasil PDF jadwal dan lembar tugas                     |
| `POST` | `/api/worksheets/variation`   | Variasi tugas berbasis AI, opsional                   |

CRUD mengikuti jalur Supabase SDK starter dengan RLS dan constraints yang benar sebelum data privat disimpan. Route Handler tidak otomatis menggantikan kontrol kepemilikan. Endpoint di atas adalah alternatif rancangan, bukan API yang tersedia atau persyaratan untuk MVP; scheduling deterministik tidak otomatis membutuhkan endpoint server. Enam level mengikuti UI-14; kontrak tes, durasi, dan penyimpanan menunggu `Q-01`/`Q-02`/`Q-09`.

## 11. Aturan konten tugas [aturan dasar diterima; bank konten belum ditetapkan]

| Level      | Literasi dasar                                                         | Numerasi dasar                        | Format                         |
| ---------- | ---------------------------------------------------------------------- | ------------------------------------- | ------------------------------ |
| Level 1–2 | Mencocokkan gambar tanpa membaca | Berhitung dengan benda konkret tanpa membaca | Tidak membutuhkan membaca, termasuk petunjuk tertulis |
| Level 3–5 | Latihan kata, paragraf, atau cerita sesuai level | Latihan angka, pengurangan, atau pembagian sesuai level | Boleh tertulis; sesuai kriteria UI-14 |
| Level 6 | Tugas sesuai capaian fase kelas | Tugas sesuai capaian fase kelas | Bank/capaian fase menunggu Q-13; tanpa fallback level dasar |

Batas tugas pada tabel mengikuti UI-14; worksheet dan capaian fase final masih menunggu Q-13. Ini **bukan** klaim kurikulum atau validasi pedagogis. Guru harus bisa meninjau kesesuaian tugas. Hindari penggunaan label level pada lembar siswa jika berpotensi menstigma.

## 12. Strategi pengujian

| ID  | Kasus uji                        | Ekspektasi                                             | Kriteria terkait               |
| --- | -------------------------------- | ------------------------------------------------------ | ------------------------------ |
| T01 | Grade 2 + 3                      | `cross_phase`                                          | FR-01-AC-01, FR-04-AC-01       |
| T02 | Grade 3 + 4                      | `same_phase`                                           | FR-01-AC-01, FR-04-AC-01       |
| T03 | Input 15 siswa tanpa tes         | Seluruh level tersimpan                                | FR-02-AC-01                    |
| T04 | Pengelompokan 2 kelas            | Maks. 3 kelompok per kelas, tanpa anggota lintas kelas | FR-03-AC-01                    |
| T05 | Pemindahan anggota               | Keanggotaan berubah dan tetap valid                    | FR-03-AC-02                    |
| T06 | Jadwal lintas fase               | Rotasi terpisah dan tidak ada konflik guru             | FR-04-AC-01–AC-02              |
| T07 | Jadwal satu fase                 | Mendukung blok bersama                                 | FR-04-AC-01                    |
| T08 | Prioritas level dasar            | Kelompok level terendah dibimbing lebih awal           | FR-04-AC-03                    |
| T09 | AI tidak tersedia                | Jadwal dan template tugas tetap tersedia               | FR-05-AC-04, NFR-06            |
| T10 | PDF diunduh lalu koneksi diputus | File tetap dapat dibuka                                | FR-05-AC-02, NFR-02            |
| T11 | Literasi Kata (3) → Paragraf (4)         | Status `up`                                            | FR-06-AC-02, UI-14 |
| T12 | Literasi Cerita (5) → Kata (3)       | Status `down`                                          | FR-06-AC-02, UI-14 |
| T13 | Siswa fiktif                     | Label demo jelas dan data tidak diklaim nyata          | NFR-08, Q-06                   |

## 13. Urutan kerja dari draf [USULAN; bukan backlog Ready]

Tabel draf dipertahankan untuk konteks perencanaan; `B*` bukan ID persyaratan atau tiket yang ditugaskan. Peran Dev 1–4 bukan owner nyata. BACKLOG.md tetap sumber tiket kanonis dan belum berisi tiket produk. Persetujuan prioritas/cut scope masih `Q-07`; tidak ada penugasan atau izin deployment dari tabel ini.

| ID  | Prioritas | Pekerjaan                              | Owner peran usulan | Dependensi              | Definition of Done            |
| --- | --------- | -------------------------------------- | ------------------ | ----------------------- | ----------------------------- |
| B01 | P0        | Setup Next.js, UI kit, database, env   | Dev 1              | —                       | App dapat dijalankan bersama  |
| B02 | P0        | Skema data, seed 15 siswa fiktif       | Dev 2              | B01                     | Seed dapat diulang            |
| B03 | P0        | Wizard pilih kelas, fase, daftar siswa | Dev 1              | B01–02                  | T01–T03 lulus                 |
| B04 | P0        | Form level dan grouping + edit         | Dev 2              | B02                     | T03–T05 lulus                 |
| B05 | P0        | Pure scheduling engine + unit test     | Dev 3              | Kontrak data disepakati | T06–T08 lulus                 |
| B06 | P0        | UI timeline jadwal + validasi          | Dev 3              | B05                     | Konflik terlihat dan diblokir |
| B07 | P0        | Bank tugas literasi/numerasi           | Dev 4              | Kontrak level           | Template semua level tersedia |
| B08 | P0        | PDF dan tampilan papan tulis           | Dev 4              | B07                     | T10 lulus                     |
| B09 | P0        | Integrasi wizard → output              | Semua              | B03–B08                 | Demo end-to-end <90 detik     |
| B10 | P1        | Tes singkat opsional                   | Dev 2              | B04                     | Tidak menghalangi tanpa tes   |
| B11 | P1        | Histori level + halaman progres        | Dev 2              | B02–04                  | T11–T12 lulus                 |
| B12 | P2        | AI variasi tugas + fallback            | Dev 4              | B07                     | T09 lulus                     |
| B13 | P0        | QA Android, error state, deploy        | Dev 1 + semua      | B09                     | URL demo berfungsi            |
| B14 | P0        | README, deck PDF, video ≤2 menit       | Semua              | Demo stabil             | Paket submission lengkap      |

### Urutan kerja

**14 Oktober:** sepakati kontrak data, setup repo, seed, mulai wizard dan scheduling engine secara paralel.\
**15 Oktober:** tuntaskan alur P0 dari input sampai PDF; integrasi dan pengujian aturan fase/konflik.\
**16 Oktober:** progres dan tes opsional jika stabil; QA mobile, video, deck, README, submit sebelum 23.50 WIB.

**Batas urutan kerja:** jangan mengorbankan jadwal deterministik, pengelompokan per kelas, atau keluaran tugas untuk AI/dashboard. Jadwal kerja di atas belum mengizinkan penghapusan `FR-06` atau tes opsional; persetujuan perubahan lingkup menunggu `Q-07`.

## 14. Metrik dan validasi

| Hipotesis                                | Cara ukur                                                                  | Status      |
| ---------------------------------------- | -------------------------------------------------------------------------- | ----------- |
| Persiapan sesi lebih cepat               | Bandingkan menit perencanaan manual vs dengan Selaras pada tugas sebanding | Belum diuji |
| Aktivitas mandiri lebih dapat dijalankan | Proporsi blok mandiri yang selesai                                         | Belum diuji |
| Siswa mengalami peningkatan level        | Proporsi siswa naik ≥1 level dalam dua minggu                              | Belum diuji |

**Catatan bukti:** angka penghematan perencanaan 31% dari EEF 2024 dan temuan TaRL J-PAL merupakan analogi dari konteks berbeda, bukan hasil Selaras. Jangan menampilkan angka tersebut sebagai dampak produk.

### Rencana validasi pascahackathon [USULAN]

Lakukan uji tugas dengan guru kelas rangkap; ukur waktu menyusun sesi, apakah jadwal dapat dilaksanakan, apakah tugas mandiri sesuai kemampuan, serta hambatan perangkat dan cetak. Revisi aturan blok dan level berdasarkan umpan balik.

## 15. Risiko dan mitigasi

| Risiko                                               | Mitigasi                                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Jadwal bentrok atau tidak realistis                  | Algoritme deterministik, validator, uji lintas fase                                   |
| Kelompok level terendah belum bisa membaca instruksi | Template visual/benda konkret/tutor sebaya; tinjauan guru                             |
| Ketergantungan AI                                    | Bank template sebagai sumber utama                                                    |
| Sinyal buruk                                         | PDF diunduh sebelum kelas; versi papan tulis                                          |
| Privasi dan stigma                                   | Data fiktif untuk demo, nama kelompok netral, akses khusus guru                       |
| Deadline ketat                                       | Urutan P0/P1 masih usulan; minta keputusan lingkup `Q-07` sebelum menunda fitur wajib |
| Klaim bukti berlebihan                               | Tandai hasil riset analogi dan asumsi secara eksplisit                                |

## 16. Acceptance dan kesiapan MVP

**Demo alur inti:** `J-01` memakai kelas 2 + 3 dan 15 siswa fiktif, memberi level tanpa tes, membuat serta mengedit kelompok per kelas, menghasilkan jadwal tanpa konflik guru dengan prioritas level terendah, lalu membuka/mengunduh tugas PDF dan papan tulis dalam kurang dari 90 detik (`NFR-08`). Ini bukti alur inti, bukan bukti seluruh MVP.

**MVP lengkap:** memenuhi `FR-01`–`FR-08` dan kriteria nonfungsional yang diputuskan, termasuk `J-02`/histori progres `FR-06` dan tes yang opsional bagi guru setelah kontraknya diputuskan. Uji satu fase 3 + 4 selain demo lintas fase 2 + 3. Verifikasi akses antar-guru bila menggunakan akun, keadaan gagal, mode terang/keyboard/360 px, dan PDF offline. Kriteria berlabel usulan/tertunda belum dapat dianggap lulus sebelum keputusan terkait dibuat; pengurangan lingkup membutuhkan jawaban `Q-07`.

T01–T13 di bagian 12 adalah rencana uji yang mengacu pada acceptance criteria, bukan hasil tes. Tes starter yang tersedia menguji auth/project contracts, query keys, tema, katalog, helper, dan rendering komponen; belum membuktikan kebutuhan Selaras. Revisi dokumentasi ini tidak menjalankan atau mengklaim kelulusan tes runtime, browser, RLS, maupun deployment.

## 17. Pertanyaan terbuka dan dampaknya

Jawaban berikut tidak boleh ditebak saat membuat tiket Ready. Bila suatu kebutuhan belum cukup ditentukan, implementasi bagian tersebut menunggu keputusan; kebutuhan lain yang independen dapat direncanakan.

| ID   | Keputusan yang dibutuhkan                                                                                                                                                                                               | Persyaratan / layar terdampak                                 |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Q-01 | Berapa durasi sesi/blok dan minimum bimbingan? Bagaimana pembagian menit, prioritas jika level sama, kegiatan bersama satu fase, dan sesi terlalu singkat?                                                              | FR-04, SCR-02, SCR-05, T06–T08                                |
| Q-02 | Nama/urutan/indikator enam level per mapel disetujui pada UI-14. Apa isi/skor tes, pemetaan hasil, status saran, dan koreksi guru?                                                                 | FR-02–FR-06, SCR-03–SCR-07, T03–T08, T11–T12                  |
| Q-03 | Apakah Selaras memakai registrasi/login guru starter? Bagaimana demo diakses: akun fiktif individual atau alur fiktif publik terpisah? Apakah profil guru diperlukan?                                                   | FR-07, J-03, ST-01, SCR-01, NFR-04–NFR-05                     |
| Q-04 | Bagaimana menangani kelas kosong, siswa sangat sedikit, kelompok kosong/ukuran timpang, batas jumlah siswa, serta kebijakan produksi untuk siswa tanpa level? Pemetaan level ke tiga kelompok diterima pada UI-15.                                                                                    | FR-01–FR-04, SCR-03–SCR-05, T03–T06                           |
| Q-05 | Bagaimana format tugas visual hitam-putih, ukuran/orientasi halaman, isi paket PDF (jadwal/tugas/nama siswa), dan versi papan tulis ditentukan?                                                                         | FR-05, SCR-06, T10, NFR-04                                    |
| Q-06 | Apakah penyelenggara sudah mengonfirmasi tertulis penggunaan siswa fiktif? Siapa memeriksa label dan izin demo?                                                                                                         | NFR-08, T13, J-01, ST-05                                      |
| Q-07 | Apakah urutan P0/P1 diterima? Bila tidak sempat, apakah tim mengizinkan penundaan progres atau penyediaan tes? Tanpa keputusan, enam modul tetap lingkup MVP brief.                                                     | FR-02, FR-06, bagian 3/13/16, T11–T12                         |
| Q-08 | UI-22 menetapkan `/` sebagai landing page dengan CTA ke `/kelas`. Adaptasi `/dashboard` dan `/projects`, identitas produksi dan alur produk persisten masih terbuka. | ST-02–ST-04, J-01, SCR-01–SCR-07 |
| Q-09 | Apakah kelas/roster digunakan lintas sesi dan disimpan di Supabase? Data identitas minimum, izin data nyata, retensi, edit/hapus, penghapusan berantai, dan penyimpanan PDF apa yang diperlukan?                        | FR-01, FR-05–FR-07, model data bagian 8, ST-03, NFR-04–NFR-05 |
| Q-10 | Apa baseline progres, aturan tanpa pembanding, koreksi histori, dan kebijakan pembaruan sebelum dua minggu?                                                                                                             | FR-06, J-02, SCR-07, T11–T12                                  |
| Q-11 | Apakah draft bertahan saat reload/keluar? Apakah edit siswa/level membatalkan hasil? Apakah generate ulang mempertahankan edit kelompok; roster snapshot atau data hidup?                                               | FR-03–FR-06, FR-08, J-04, SCR-03–SCR-06                       |
| Q-12 | Apakah tepat dua tingkat berbeda kelas 1–6 menjadi batas input final? Apa yang dilakukan untuk pasangan yang tidak didukung?                                                                                            | FR-01, SCR-02, FR-01-AC-03                                    |
| Q-13 | Kurikulum apa yang digunakan sekolah dan siapa meninjau tujuan/materi tiap mapel serta tugas fase A/B/C? UI-17 menerima satu mapel bebas per sesi dengan fokus literasi/numerasi; penggabungan mapel dan bank konten belum diputuskan. | FR-02, FR-04–FR-05, UI-17, SCR-02, SCR-05–SCR-06, bagian 11 |
| Q-14 | Apa perangkat, browser, jaringan, dan ambang performa untuk acceptance mobile?                                                                                                                                          | NFR-01, NFR-03, SCR-01–SCR-07                                 |
| Q-15 | Fondasi Nunito/#7173FF/pastel/10 px/light-only diterima lewat instruksi pengguna untuk restyle UI yang sudah ada. Apakah komposisi layar produk yang direncanakan diterima? Restyle tidak menambahkan classroom canvas. | ST-06, NFR-09, semua layar                                    |

### Keputusan eksplisit tentang starter

Status **pertahankan** di bawah mengikuti batas repositori saat ini; status **belum diputuskan** tidak berarti izin adaptasi/penghapusan. Semua fitur contoh tetap tersedia sampai ada keputusan produk dan tugas implementasi yang mengizinkannya.

| ID    | Fitur yang diperiksa                                                                                                                                               | Keputusan untuk pekerjaan ini / MVP                                                                                                                                                                                                                                                           |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ST-01 | Email/password, konfirmasi/ulang kirim, callback, logout (`src/features/auth/`, route auth, proxy)                                                                 | **Pertahankan fondasi dan kontrol sesi.** Kebutuhan login/registrasi dalam perjalanan Selaras belum diputuskan (`Q-03`); tidak menambah peran siswa/admin.                                                                                                                                    |
| ST-02 | Dashboard terlindungi menampilkan `ProjectsView`; `AppShell` bernavigasi Overview/Projects/sandbox                                                                 | **Pertahankan contoh; adaptasi produk belum diputuskan (`Q-08`).** Tidak menyebut statistik proyek sebagai progres belajar.                                                                                                                                                                   |
| ST-03 | CRUD `projects` dengan `name`, `description`, `status`, `user_id`, RLS, constraints, dan query keys per pengguna                                                   | **Pertahankan contoh dan batas kepemilikan.** Bukan model sesi Selaras; tidak mengganti nama tabel atau mengonversi data menjadi siswa/sesi tanpa keputusan `Q-08`/`Q-09`.                                                                                                                    |
| ST-04 | `/` semula berisi tombol terpusat menuju `/sandbox` | **Diganti atas instruksi pengguna (UI-22):** landing page Selaras, CTA `/kelas`, tautan `/sandbox` di footer. Starter auth/dashboard/projects tetap tersedia. |
| ST-05 | Sandbox publik dengan 81 demo, katalog pencarian, dan state contoh (`src/features/sandbox/`)                                                                       | **Pertahankan seluruh demo publik selain Theme Toggle yang dihapus atas instruksi pengguna.** Colors demo dengan palet statis tersedia, tanpa palet sidebar; pencarian katalog bukan pencarian data aplikasi; tidak menghubungkan demo ke siswa privat atau mengubahnya menjadi layar produk. |
| ST-06 | Beautiful UI/Base UI/Lucide, shared Button, Nunito/#7173FF/pastel, mode terang tunggal                                                                             | **Gunakan ulang dan pertahankan aksesibilitas.** Restyle Nunito/#7173FF/pastel/10 px/light-only disetujui pengguna untuk UI yang ada; tidak menambah shadcn atau library kedua. Komposisi layar produk tetap `Q-15`.                                                                          |
| ST-07 | Shared Axios dan controls AI/upload tersedia sebagai fondasi/demonstrasi; integrasi AI, storage lampiran, search/filter aplikasi, realtime belum diimplementasikan | **Tidak masuk MVP wajib.** AI hanya variasi opsional dengan fallback template, tidak menentukan alokasi guru. Upload/storage, search aplikasi, dan realtime memerlukan lingkup eksplisit terpisah.                                                                                            |

Theme Toggle/dark mode dihapus atas instruksi pengguna terbaru; auth/dashboard/projects tetap tersedia. Keputusan mempertahankan di atas tidak menjadikan CRUD proyek sebagai fitur produk Selaras. Guardrail mengikuti instruksi visual pengguna terbaru; keputusan perilaku Selaras yang masih terbuka tidak diimplementasikan oleh restyle.

## 18. Referensi dari Product Brief v4

- [INOVASI Phase I Completion Report (2020)](https://www.dfat.gov.au/sites/default/files/inovasi-phase-i-2016-2020-completion-report-june-2020.pdf)
- [Times Indonesia — Probolinggo (2023)](https://timesindonesia.co.id/indonesia-positif/458442/strategi-kabupaten-probolinggo-atasi-kekurangan-guru)
- [Permendikbudristek No. 12 Tahun 2024](https://peraturan.go.id/files/permendikbudristek-no-12-tahun-2024.pdf)
- [SEAMEO INNOTECH (2012)](https://www.locjkt.or.id/application/docliblcjkt/upload/PolRes_QualityIndicatorsOfMultigradeInstructionInSea.pdf)
- [World Bank — Kelas Rangkap (2011)](https://documents1.worldbank.org/curated/pt/130241468038713923/pdf/587580BRI0BAHA1rade1bahasa120110111.pdf)
- [EEF — ChatGPT in lesson preparation (2024)](https://educationendowmentfoundation.org.uk/news/teachers-using-chatgpt-alongside-a-guide-to-support-them-to-use-it-effectively-can-cut-lesson-planning-time-by-over-30-per-cent)
- [J-PAL — Teaching at the Right Level](https://www.povertyactionlab.org/case-study/teaching-right-level-improve-learning)
- Materi resmi JOINTS 2026 (sebagaimana dicatat dalam brief; tidak dilampirkan terpisah).

_Referensi ini diwarisi dari draf PRD yang menyebut Product Brief v4; berkas brief asli tidak tersedia terpisah dalam pemeriksaan ini. Referensi, aturan kurikulum, dan metadata event tidak diverifikasi ulang._
