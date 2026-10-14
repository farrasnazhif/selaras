# DESIGN — Selaras, inspired by Classroomscreen

**Versi:** 2.5 — extra-small and small buttons\
**Tanggal:** 14 Oktober 2026\
**Status:** Shared design plus an authorized UI-only Selaras preview; functional product contracts remain open

The user's explicit Classroomscreen specification supersedes the prior neutral visual direction.
The user selected restyling existing screens and demos, without adding the classroom canvas.
This document keeps stable `DES-*` / `DQ-*` IDs and the planned product-screen mappings below.
PRD still owns behavior; product identities, levels, schedules, PDF content, and routes remain open.
Supplied values are reproduction proposals accepted for this restyle, not measured production tokens.

## 1. DES-01 — Accepted visual direction and scope

The user supplied the Classroomscreen-inspired specification and explicitly selected **restyle
existing UI**. Its palette, Nunito Sans typography, larger controls, rounded surfaces, and derived
visual foundation replaces the former Inter/neutral/compact-button conventions. Keep Beautiful UI,
Base UI behavior, Lucide, authentication, project CRUD, the centered sandbox landing link, and
all public demos, except the removed Theme Toggle demo; Colors replaces it. Do not add a classroom canvas, widgets, marketing pages, or product features.

This is an inspired design using supplied reproduction values, not measured Classroomscreen
production CSS. Do not copy its logo, photography, brand assets, or claim certified accessibility.
Existing functional layouts remain; future Selaras screen compositions below stay proposed.

## 2. DES-02 — Layout, spacing, and density

Use a maximum 1200 px main content container, excluding the existing 240 px sidebar. Fluid
gutters: 16 px mobile, 32 px at 768 px, 48 px at 1024 px, and 64 px at 1280 px. These are adaptation
values for the existing starter, not a requirement to rebuild its navigation. Auth stays a
centered form up to 448 px; project detail stays a readable form up to 640 px.

| Element                      | Applied design                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------- |
| Main vertical padding        | 32 px mobile; 48 px desktop                                                       |
| Cards                        | 24 px padding, 20 px radius, hairline and soft small shadow                       |
| Widget/demo preview surfaces | 14 px radius, 16/24 px responsive padding, white background, no gradient          |
| Section spacing              | 32 px; related form fields 16 px; paired panels 24 px                             |
| Label/input/error gap        | 8 px; metadata micro-gap 4 px                                                     |
| Action gap                   | 8 px; actions wrap naturally on narrow screens                                    |
| Modal                        | 24/28 px existing padding, 20 px radius, constrained viewport and internal scroll |
| Touch actions                | Button xs/sm 32/40 px; IconButton 32/40 px square; input 48 px; Select 32 px       |

Retain the landing's single centered button; its backdrop and auth may use a subtle lavender
radial wash. Dashboard summary cards use lavender; project icons use pastel blue. Sandbox
previews are always white. Only the Colors catalog entry shows read-only color swatches with their hex values below. Assign these roles consistently, not random
colors per control. Do not add a shared branded header or a marketing hero.

## 3. DES-03 — Typography and icons

Use Nunito Sans from the existing Google Fonts CSS import, with system-ui/Apple/Segoe UI/sans-serif
fallback. Body is 16 px/1.55, weight 400. Keep a monospace font only for code and technical samples.

| Role                                          | Supplied / adapted size, weight, line-height    |
| --------------------------------------------- | ----------------------------------------------- |
| Marketing display (only if separately scoped) | 64/52/42/34 px, 800/800/800/750, 1.08–1.16      |
| Existing page heading                         | 32 px, 750, 1.2, -0.4 px tracking               |
| Section/dialog heading                        | 24 px, 750, 1.25, -0.2 px tracking              |
| Card/widget title                             | 20 px, 700, 1.3                                 |
| Body / compact body                           | 16/14 px, 400, 1.55/1.5                         |
| Navigation                                    | 15 px, 700, 1.4                                 |
| Default Button                                | 14 px, 750, 20 px line-height                   |
| Caption                                       | 12 px, 600, 1.4                                 |
| Future board instructions                     | 32 px, 700, 1.25; no new projector mode implied |

Retain compact typography in code, chart labels, dense tables, and imported component demos;
those are purposeful presentations, not marketing headings. Shared font, surfaces, accent,
radii, and shadows still apply to them. Long names/instructions wrap. Use tabular numerals for
counts/time; meaningful text never depends solely on color.

Use existing Lucide icons and preserve component-specific technical/source artwork. Normal
application icons are about 20 px; compact controls may keep 12–16 px icons. Decorative icons
are hidden from accessibility; icon-only actions have explicit names.

## 4. DES-04 — Light-only palette and color sandbox

The user removed dark mode. RootLayout does not read the old theme cookie or install a theme
provider; CSS has one light palette, and the theme toggle/demo is removed. Auth SSR remains intact.

| Role                                  | Value                                       |
| ------------------------------------- | ------------------------------------------- |
| Page / raised Card / sandbox preview  | #FFFFFF                                     |
| Supporting canvas / inset             | #F8F8FC                                     |
| Main / body / muted text              | #25253B / #44465A / #606377                 |
| Border                                | #E7E7F0                                     |
| Default primary                       | #7173FF                                     |
| Default hover / tint                  | #6668E6 / #EEEEFF                           |
| Text on primary/destructive fills     | #FFFFFF, bold 19 px labels                  |
| Accent ink / focus                    | #4F50A7 / #5A5CC4                           |
| Display palette                       | #7173FF, #FF3C7F, #95F447, #00E5E3, #F2F226 |
| Destructive Button fill / hover       | #FF3C7F / #E53672                           |
| Success / warning / danger text       | #47633F / #5B5B3E / #872F5A                 |
| Success / information / warning fills | #95F447 / #00E5E3 / #F2F226                 |
| Information text                      | #186876                                     |

The Colors demo displays the five supplied swatches, each with its hex label below. The sidebar has no palette.
There is no color picker, selectable preset, palette editing, preview override, or persistence.
Primary stays #7173FF; destructive Buttons use a solid #FF3C7F background. Both use white text.
Filled primary/destructive labels use bold 19 px typography so their contrast qualifies for
large-text readability while primary defaults remain compact at 40 px height. Error field,
notice, and badge tones use darker palette-derived text colors for readability.

The five supplied colors own all UI accents: purple for primary/selection, pink for destructive/error,
lime for success/additions, cyan for information/secondary content, and yellow for warnings/pending.
Apply them to shared controls, navigation highlights, status icons/badges, tables/tags, charts,
progress, and demo decorations. Soft backgrounds mix these colors with white; small text uses
darker shades mixed with ink. White labels stay on purple/pink fills; lime/cyan/yellow use dark ink.
Keep neutral page/card surfaces, borders, and body text. Original service logos and external
images retain their intrinsic colors; they are content assets rather than theme tokens.

Tokens stay in `src/components/ui/globals.css`; aliases, font, and component styles stay in
`src/app/globals.css`. Existing shadows and card radii remain; Buttons and IconButtons use 10 px
corners. The sandbox preview itself never uses a gradient or pastel background.

## 5. DES-05 — Shared controls, states, and accessibility

Keep the shared Button API and Base UI behavior. Primary/secondary actions use 10 px corners.
Every variant defaults to small: 40 px height and 16 px horizontal padding. Extra-small (`xs`)
uses 32 px height, 12 px horizontal padding, 12 px text, and 6 px gap. Legacy md/lg
size requests fall back to sm. Primary/destructive labels are white, bold 19 px with 24 px
line-height; other labels use 14 px with 20 px line-height. Internal gap stays 8 px.
IconButton is 32 px square for xs and 40 px square for sm, with 10 px radius. No new variants:
primary, secondary, ghost, danger, and quiet remain. Press scale stays 0.98.

Primary hover uses #6668E6; destructive hover uses #E53672; secondary uses raised surface and hairline.
Inputs have 48 px minimum height and 16 px text. Select triggers and option rows use 32 px
minimum height, 14 px text, 10 px horizontal padding, and 4 px vertical padding. Controls retain
10 px radius and raised backgrounds. This compact shared Select sizing follows the latest user request.
Textareas retain their taller content area. Focus is a visible 3 px accent focus outline with
3 px offset; input focus also uses the primary-soft halo. Invalid input keeps danger border and
explicit error text. Disabled/loading keeps its label and prevents duplicate actions.

Use Card for surfaces; Dialog for ordinary forms and AlertDialog for destructive confirmation.
AlertDialog supports a shared trigger for focus return and inline failure feedback. Keep neutral
cancel actions, busy dismissal protection, focus trap, Escape behavior, and actual mutation errors.
Toasts retain readable surfaces, status icons/tints, and no colored borders. Do not replace
forms with instructional panels or add unrequested application filters.

Button-like links retain `nativeButton={false}`, `role="link"`, and rendered Link; navigation rows
and linked cards keep their own presentation. Reduced motion follows the existing CSS. All
statuses have text as well as color. Keyboard, focus return, palette labels, and 360 px/browser checks are
required; rendering and palette contrast checks alone do not prove interactions.

## 6. DES-06 — SCR-01: Titik masuk sesi

**PRD:** `J-01`, `Q-03`, `Q-08`, `ST-01`–`ST-04`. **[TERBUKA]** Lokasi, login/demo identity, daftar sesi, sesi terakhir, dan navigasi produk.

**[RANCANGAN untuk area yang kelak disepakati]:** judul h1, satu kalimat konteks, satu Button primer indigo berlabel “Buat sesi”; jarak judul → konteks 8 px dan konteks → tindakan 16 px. Jangan menambahkan KPI, daftar contoh sesi, avatar guru, atau hero/foto tanpa kebutuhan. Bila ada label data demo, tampilkan sebagai Notice info di area konteks.

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

**[RANCANGAN]:** h1, ringkasan kelas/fase/durasi yang diketahui, lalu blok waktu berurutan. Satu Card per interval dengan header rentang waktu 16 px dan konteks kegiatan bersama bila ada. Isi blok memiliki dua bagian kelas, gap 16 px; dua kolom mulai 768 px, bertumpuk di mobile. Tiap kelompok menunjukkan nama, aktivitas, dan teks status “Bimbingan guru” atau “Mandiri”. Tidak membuat kolom baru untuk setiap kelompok di layar 360 px.

Status bimbingan memakai Badge primary indigo/ikon `Users`; status mandiri memakai Badge neutral dengan teks. Pembeda ini tidak menggantikan aturan guru tunggal. Kegiatan bersama satu fase ditampilkan sebagai satu kegiatan bersama dengan kelas yang terlibat, bukan dua penugasan guru simultan. Siswa level rendah diprioritaskan sesuai hasil domain, bukan dengan urutan visual yang menyembunyikan konflik.

Validasi gagal muncul sebagai Notice error sebelum blok/tindakan; sebut interval dan kelompok yang bermasalah bila diketahui, tanpa menganggap konflik mustahil. Jangan menampilkan status siap/unduhan berhasil untuk hasil invalid. Durasi, distribusi menit, dan alur koreksi/generate ulang tetap terbuka. Tidak menambahkan editor drag jadwal, mode live, atau countdown.

**Reuse:** `Card`, `DescriptionList` untuk ringkasan, `Badge`, `Notice`, `Button`; markup list/section terstruktur untuk blok. **Gap:** schedule blocks komposisi fitur. `Timeline` yang ada memerlukan `dateTime` dan memakai tipe 11–12 px; jangan membuat tanggal palsu untuk rentang menit atau menganggapnya scheduler siap pakai.

## 11. DES-11 — SCR-06: Tugas, PDF, dan papan tulis

**PRD:** `FR-05`; format/konten `Q-05`/`Q-09`/`Q-13`.

**[RANCANGAN]:** urutan kelas → kelompok, satu bagian tugas yang dapat dibaca per kelompok. Heading memuat kelas, nama kelompok netral, dan mapel jika diketahui; isi utama instruksi/contoh, lalu tindakan PDF/papan tulis. Desktop boleh dua kolom Card; mobile satu kolom. Tidak menggabungkan tugas beberapa kelompok menjadi teks panjang tanpa heading. Tidak menambahkan selector template atau tombol AI pada alur wajib.

Konten tugas layar memakai isi 16 px/1.55; instruksi utama papan tulis 32 px/1.25 dengan batas baris alami. Aktivitas level terendah tidak bergantung pada instruksi panjang; tempat gambar/benda konkret harus bermakna sesuai konten yang ditinjau, bukan gambar dekoratif dari referensi. Alternatif teks/penjelasan guru mendampingi media yang membutuhkannya; aset dan indikator pedagogis belum diputuskan.

Button Download + label PDF memakai primer indigo untuk tindakan ekspor; status loading/gagal berada di dekat tindakan. Versi papan tulis adalah bagian terstruktur dari tugas; restyle ini tidak menambahkan mode whiteboard/fullscreen baru. Pemilihan Tabs atau tampilan terpisah, cakupan satu/paket PDF, preview aktual PDF, ukuran kertas, margin, gambar hitam-putih, dan nomor halaman tetap `DQ-07`; jangan menganggap Card HTML sama dengan file PDF.

**Tema layar:** gunakan `--surface`/`--ink` pada mode terang tunggal. **Keluaran cetak:** hindari label kemampuan dan UI interaktif; rancangan prinsipnya terbaca hitam-putih, dengan nama kelompok netral dan pemisahan kegiatan yang jelas. Ukuran font cetak dan pagination belum ditetapkan. File berhasil diunduh bisa dibuka offline; tidak ada badge aplikasi “offline ready”.

**Reuse:** `Card`, `Button`, `Notice`, `Spinner`, `Badge`; `Tabs` hanya bila mode tampilan diputuskan. **Gap:** komposisi worksheet/board dan pembuatan PDF milik fitur; tidak ada viewer/exporter PDF khusus yang sudah tersedia. Tidak otomatis membutuhkan library UI baru atau storage lampiran.

## 12. DES-12 — SCR-07: Progres siswa

**PRD:** `FR-06`; baseline dan level `Q-02`/`Q-10`.

**[RANCANGAN]:** pisahkan data per kelas. Di desktop gunakan Table sederhana dengan nama, penilaian pembanding (level + tanggal), penilaian terbaru (level + tanggal), dan perubahan. Di mobile gunakan daftar Card/baris terstruktur per siswa dengan label field eksplisit; urutannya nama → pembanding → terbaru → perubahan. Pembaruan level berada dekat siswa yang dipilih setelah alur penilaian ulang diputuskan. Tidak menambah chart, persentase keberhasilan, ranking, atau filter aplikasi.

Naik/tetap/turun memakai label dan ikon netral (`ArrowUp`/`Minus`/`ArrowDown`), bukan merah/hijau sebagai satu-satunya penanda. Penilaian pertama tidak menampilkan kenaikan palsu; teks “belum ada pembanding” adalah contoh copy, menunggu definisi baseline. Riwayat bertanggal tidak ditimpa; apakah riwayat lengkap membuka Dialog/Accordion masih `DQ-08`.

**Reuse:** `Table` untuk data desktop nonkosong, `Card`, `Badge`, `Select`, `Button`, `Notice`; `EmptyState` untuk daftar kosong. Jangan memakai DataTable search/sort/page tanpa scope. `Timeline` dapat dipertimbangkan untuk histori yang benar-benar bertanggal setelah format timestamp dan label diputuskan, bukan untuk blok sesi. **Terbuka:** baseline, histori/koreksi, waktu pembaruan, dan level per mapel (`DQ-02`/`DQ-08`).

## 13. DES-13 — Keadaan umum, aksesibilitas, dan responsivitas

| Keadaan                | Presentasi / reuse                                         | Batas perilaku                                                           |
| ---------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| Loading awal           | Skeleton sesuai bentuk panel + Spinner dengan label tugas  | Layout tidak bergeser besar; skeleton tidak dibaca sebagai isi siswa.    |
| Kosong                 | EmptyState dengan judul/deskripsi spesifik dan ikon Lucide | Aksi tambah hanya bila alurnya disetujui; kosong tidak berarti error.    |
| Gagal membaca          | Notice error + Button secondary untuk coba lagi            | Jangan menjanjikan data tersimpan jika belum diketahui.                  |
| Tidak tersedia         | Pesan netral dan tindakan kembali yang valid               | ID asing/tidak dikenal sama; tidak membocorkan pemilik.                  |
| Input salah            | Error terkait field, `aria-invalid`, `aria-describedby`    | Pertahankan nilai; ringkasan boleh menyebut field yang harus diperbaiki. |
| Mutasi/ekspor berjalan | Button loading + status dekat hasil                        | Busy tidak menghapus label/isian; cegah duplikasi.                       |
| Mutasi/ekspor gagal    | Notice tetap terlihat di area tindakan                     | Tidak hanya toast; fokus tidak meloncat ke halaman kosong.               |
| Berhasil               | Status teks di area terkait; toast opsional                | Setelah operasi benar-benar selesai; tidak menyimpulkan dampak belajar.  |
| AI gagal/tidak dipakai | Tugas template tetap terlihat                              | Tidak menghalangi jadwal atau menambahkan promosi fitur AI.              |

**Aksesibilitas [TETAP]:** satu h1, hierarki h2/h3, main landmark/skip link yang ada, label kontrol yang unik termasuk nama siswa/kelas, fokus terlihat 3 px dengan offset 3 px dari CSS saat ini, navigasi Tab yang mengikuti urutan baca. Pertahankan keyboard/indikator pilihan Base UI dan fokus kembali pada pemicu dialog. Untuk dialog controlled tanpa trigger, uji dan sediakan target kembali yang benar; jangan mengklaim semua komposisi otomatis mengembalikan fokus.

Semua status memiliki teks selain warna. Validasi dan proses memberi pengumuman terakses tanpa membacakan ulang seluruh daftar. Hindari memasang `role="alert"` pada setiap rerender validasi. Nama/level tidak diumumkan di toast global tanpa kebutuhan. Tidak mengubah RLS atau kontrol akses melalui presentasi.

| Lebar area isi | Susunan rancangan                                                           | Pemeriksaan                                                                      |
| -------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 360–767 px     | Satu kolom; dua kelas tetap berurutan; field/tombol membungkus              | Tidak ada overflow halaman, label tertutup, atau aksi di bawah overlay keyboard. |
| 768–899 px     | Dua kolom untuk pasangan field/roster/kelas dalam blok jadwal jika isi muat | Kelompok tetap satu kolom per bagian sampai ≥900 px.                             |
| ≥900 px        | Maksimal tiga Card kelompok per kelas; kontainer isi ≤1200 px               | Jangan hitung sidebar sebagai lebar isi atau membuat panel <240 px.              |

Lebar di tabel adalah ruang main yang tersedia, bukan viewport mentah setelah sidebar. Bila ruang tidak cukup, turun ke susunan satu kolom. Tabel desktop boleh scroll dalam region bernama/focusable yang disediakan Table; layar utama tetap tidak scroll horizontal. Roster/progres mobile memiliki komposisi alternatif tanpa menyembunyikan data penting. Periksa zoom 200%/400%, nama panjang, enam kelompok, keyboard mobile, dan popup Select dekat tepi layar.

Reduced motion mengikuti CSS/provider yang ada: tanpa animasi dekoratif/drag, shimmer/spinner tidak menjadi satu-satunya bukti proses, press scale mengikuti aturan shared Button. Popup/menu/dialog memakai portal dan token aplikasi; z-index existing popup 60, dialog 50, toast 70 dipertahankan, bukan skala layer baru. Scroll dialog tetap di popup yang tersedia.

## 14. DES-14 — Inventaris reuse dan gap yang beralasan

Semua nama/path di bawah telah diperiksa secara statis. UI Selaras belum ada; mapping bukan klaim implementasi. Path komponen relatif ke `src/components/ui/`.

| Gap / keputusan                     | Bukti pada komponen yang ada                                                                      | Tindakan minimum dalam tiket berikutnya                                                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| State dengan copy Selaras           | `data-state.tsx` hard-code judul/copy/icon proyek                                                 | Pakai Spinner/Skeleton/EmptyState/Notice/Button dengan copy fitur; jangan duplikasi sistem state. Menambah props ke DataState hanya bila reuse lintas fitur dibutuhkan. |
| Roster editable dan pindah kelompok | `list.tsx` read-only composition; Select/Input tersedia                                           | Komposisi kecil di fitur dengan label/name/error; tidak membuat library form baru.                                                                                      |
| Jadwal interval dan dua kelas       | `timeline.tsx` menerima `time` + `dateTime`, bukan interval dan matriks aktivitas                 | Komposisi Card + list/section pada fitur, tanpa tanggal fiktif, chart, atau DnD.                                                                                        |
| Worksheet/board/PDF                 | Card/Notice/Button ada; tidak ada exporter/viewer PDF khusus                                      | Pisahkan komposisi konten fitur dan artifact PDF; format/dependency hanya setelah keputusan `DQ-07`/ticket.                                                             |
| State tabel kosong                  | `table.tsx` hard-code “No results found.”                                                         | Tampilkan EmptyState saat kosong; jangan memakai search/DataTable untuk menghindari copy tersebut.                                                                      |
| Lokalisasi yang belum diputuskan    | Stepper/Timeline aria-label, Dialog close, AlertDialog Cancel, Toast labels memiliki teks Inggris | Setelah `DQ-06`, tambahkan props copy minimum di komponen terkait jika perlu; pertahankan callers, defaults, dan semantik.                                              |
| Batas target sentuh                 | Default Button/input 48 px, IconButton 44 px; compact sizes remain intentional                    | Uji tugas mobile dan zoom; jangan membuat ukuran per-control tanpa kebutuhan.                                                                                           |

Tidak ada gap yang membenarkan penggantian Base UI atau Beautiful UI. Jika tiket kelak menambah kontrol reusable, letakkan tetap di `src/components/ui/`, sertakan demo sandbox dan license notice. Komposisi yang khusus siswa/kelompok/jadwal tetap di folder kategori fitur; tidak membuat wrapper generik untuk setiap layar.

## 15. Pertanyaan desain dan dependensi

Pertanyaan ini menambah konteks presentasi, tanpa mengubah pertanyaan/keputusan PRD. Simpan jawaban di sumber yang sesuai sebelum menandai tiket terkait Ready.

| ID    | Keputusan yang belum tersedia                                                                                                                        | Desain / PRD terdampak                                                                                                                           |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| DQ-01 | Apa titik masuk produk, shell/navigasi, serta wizard satu layar/beberapa route? Adakah daftar sesi/sesi terakhir yang disetujui?                     | DES-02, DES-06–DES-07; SCR-01–SCR-07; Q-03/Q-08. `/` tetap sandbox.                                                                              |
| DQ-02 | Apa nama/indikator/urutan level, mapel, tes, grade limits, dan parameter jadwal final?                                                               | DES-07–DES-10, DES-12; FR-01–FR-04/FR-06; Q-01/Q-02/Q-04/Q-12/Q-13.                                                                              |
| DQ-03 | Apa data minimum/alur tambah-edit-hapus siswa; bagaimana pemindahan manual dikonfirmasi, dan kelompok kosong/timpang dijelaskan?                     | DES-08–DES-09; FR-01–FR-03/FR-07; Q-04/Q-09. Inline atau dialog pemindahan belum dipilih.                                                        |
| DQ-04 | Apa aturan kembali, reload/keluar, generate ulang, dan edit setelah hasil dibuat?                                                                    | DES-02/DES-07–DES-11/DES-13; FR-03–FR-06/FR-08; Q-08/Q-11. Tidak menjanjikan autosave/draft recovery.                                            |
| DQ-05 | Perangkat/jaringan/ambang uji apa, dan bagaimana kontrol compact memenuhi kebutuhan uji sentuh?                                                      | DES-02–DES-05/DES-13; NFR-01/NFR-03/NFR-09; Q-14/Q-15. Shared sizes mengikuti DES-05; hardware/performance acceptance tetap terbuka.             |
| DQ-06 | Apakah UI dan label aksesibilitas seluruhnya Bahasa Indonesia? Apa copy final, istilah level, format tanggal/waktu, serta label demo?                | DES-03/DES-05–DES-14; Q-02/Q-06/Q-10. Contoh copy Indonesia di dokumen ini belum kontrak lokalisasi.                                             |
| DQ-07 | Apa bank tugas/visual yang ditinjau, mode tampilan worksheet/board, cakupan paket PDF, ukuran/orientasi, font/margin cetak, serta penyimpanan hasil? | DES-11/DES-14; FR-05/FR-07; Q-05/Q-09/Q-13. Jangan menambahkan gambar pedagogis rekaan.                                                          |
| DQ-08 | Apa baseline, tanpa pembanding, histori lengkap/koreksi, serta bentuk UI pembaruan?                                                                  | DES-12; FR-06; Q-02/Q-10. Dialog/Accordion histori belum keputusan.                                                                              |
| DQ-09 | Apakah tim menerima komposisi/ukuran rancangan dan kualitas referensi yang dipilih di DES-01–DES-14?                                                 | Semua layar; Q-15. Fondasi Nunito/primary #7173FF/10 px controls/light-only diterima untuk restyle; komposisi layar produk tetap perlu ditinjau. |

Prioritas/cut scope tetap PRD `Q-07`; enam modul tidak dihapus oleh desain. Izin demo fiktif tetap `Q-06`; pilihan penyimpanan/akses tidak diselesaikan oleh tampilan. Tidak ada ticket/owner baru dibuat di dokumen ini.

## 16. Verifikasi dan catatan alignment

Restyle mengubah shared tokens, font, ukuran kontrol, dan presentasi layar starter. Tidak ada perubahan dependency, schema, auth/data API, route, atau cache privat; theme provider dihapus sesuai permintaan. Hasil verifikasi aktual dilaporkan saat implementasi; jangan menganggap rencana pemeriksaan sebagai bukti browser.

Untuk implementasi kelak: cocokkan tiket dengan DES/PRD IDs; uji light-only dengan cookie theme lama, palet statis dan label hex, popup/overlay, keyboard/fokus kembali, reduced motion, 360 px dan zoom; uji nama panjang, empty/error/busy states, semua kelas/kelompok, output hitam-putih dan PDF offline setelah format ditentukan. Jalankan typecheck/lint/tests/build sesuai AGENTS; tes render tidak menggantikan pemeriksaan browser.

**Alignment:** AGENTS.md dan keputusan fondasi visual ST-06 PRD mengikuti instruksi pengguna
Nunito/#7173FF/10 px controls/light-only. Q-15/DQ-09 tetap menyangkut komposisi layar Selaras yang belum dibangun;
penerapan visual starter tidak menyelesaikan kontrak produk atau membuat backlog Ready.

### Sumber lokal yang diperiksa

- [Product requirements](PRD.md), [Agent rules](AGENTS.md), [Backlog status](BACKLOG.md).
- [Shared token file](src/components/ui/globals.css), [App aliases and component styles](src/app/globals.css).
- [Button](src/components/ui/button.tsx), [Card](src/components/ui/card.tsx), [Input](src/components/ui/input.tsx), [Select](src/components/ui/select.tsx), [RadioGroup](src/components/ui/radio-group.tsx).
- [Dialog](src/components/ui/dialog.tsx), [AlertDialog](src/components/ui/alert-dialog.tsx), [Notice](src/components/ui/notice.tsx), [Badge](src/components/ui/badge.tsx).
- [Table](src/components/ui/table.tsx), [DataTable](src/components/ui/data-table.tsx), [List](src/components/ui/list.tsx), [Timeline](src/components/ui/timeline.tsx), [Stepper](src/components/ui/stepper.tsx), [Tabs](src/components/ui/tabs.tsx), [DescriptionList](src/components/ui/description-list.tsx).
- [EmptyState](src/components/ui/empty-state.tsx), [DataState](src/components/ui/data-state.tsx), [Spinner](src/components/ui/spinner.tsx), [Skeleton](src/components/ui/skeleton.tsx), [Toasts](src/components/ui/toast.tsx).
- [RootLayout](src/app/layout.tsx), [Color palette](src/features/sandbox/components/color-palette.tsx), [Palette values](src/features/sandbox/constants/colors.ts).

### URL asal referensi (diwarisi, tidak diverifikasi ulang)

- [Classroomscreen homepage](https://classroomscreen.com/).
- [Widget catalog](https://classroomscreen.com/widgets/).
- [Product overview](https://classroomscreen.com/helpcenter/what-is-classroomscreen).
- [Setting up your screen](https://preview.classroomscreen.com/helpcenter/setting-up-your-screen).
- [Widget behavior](https://help.classroomscreen.com/article/180-widget-behavior).

Tautan ini menjaga provenance referensi, bukan instruksi menyalin branding atau klaim kesesuaian aksesibilitas Selaras. Tidak ada nilai referensi yang dianggap token produksi terukur.


## DES-17 — Accepted UI-only product preview

The user authorized the existing UI components for a guided session flow plus a separate
progress page, with placeholders for unresolved values and content (`UI-01`). This accepts
prototype compositions only; DQ/Q decisions for the functional product remain open.

- Original entry and guided-session routes are superseded by DES-18 and DES-22.
  Use shared Stepper, Card, Input, Select, Button, Dialog, Badge, Tabs, and EmptyState.
- Progress: class-separated comparison table on desktop and student cards on mobile.
  Observation/history dialogs are local previews; level changes stay unset.
- The preview shell uses shared SidebarNav (224 px expanded, 52 px collapsed) and Drawer on mobile.
  Primary rows navigate between the three preview routes; its unused secondary list is hidden.
  The desktop grid follows the sidebar's current width. Keep a 1200 px content max,
  16/32/48 px responsive gutters, 24 px card padding, and 16/24 px panel gaps. Existing starter
  layouts and landing remain intact. Main copy is Indonesian; the preview has its own lang attribute.
- Each screen has one h1; 24 px section headings, 20 px card headings, 14/16 px body text.
  Keep white cards, the current five-color tokens, xs/sm Buttons, and semantic states.
- Fictional student names and example group membership are labeled. Local fictional-student entry, class-preserving
  membership and observation edits are enabled. No scheduling/scoring algorithm is implied.
- Levels, timings, assessment questions, worksheet contents, and PDF fields remain explicitly
  unset. Disabled generation/export actions explain their missing input/content. No fake success.
- The app stores no data across reloads. No Supabase, auth facade, AI, new persistence, or PDFs.
  The sandbox's Open app button points to this public UI preview.


## DES-18 — Screenshot content and breadcrumb hierarchy

The user's four screenshots supersede DES-17's wizard/placeholder content for the preview
(`UI-02`). Retain the shared Nunito/palette/xs-sm controls and SidebarNav; the screenshots
provide content and organization, rather than a change to the typeface or black button styling.

- Class list: compact page header + create action, one linked class card, phase and fictional-data
  badges, student count, last-session date, and a quiet demo-data note.
- Class detail: Breadcrumbs, class title/phase/data badges, Siswa/Level/Progres/Sesi Tabs.
  Level tab contains class-separated Tables with both Select level controls, local-state status,
  diagnostic rubric dialog, and two rubric Cards. Use the reference's seven/eight roster split.
- Session builder: four labeled controls (subject/duration/block/date), a template-preview action,
  a two-lane rotation table, three principle Cards, and preview/save actions.
- Session detail: four-level Breadcrumbs, subject/date title, summary, board and print actions,
  read-only two-lane session blocks, and class-separated task/group summaries.
- Main heading 28–32 px; section titles 20 px; table/body 14 px; helpers 12 px. Keep 16/24 px
  spacing, white cards, quiet tinted table/group headers. Level selects use the shared 32 px height.
- On small screens, the session grid becomes stacked blocks; Tables retain accessible horizontal
  scroll. Controls wrap; sidebar remains in the shared Drawer. Print hides editing chrome and
  preserves monochrome-readable content without choosing a final paper size.
- Screenshot timings, five-level rubrics, and literacy activities are example content. Label
  memory-only saves clearly; do not repeat unsupported synchronized/backend or V1–V5 claims.

## DES-19 — Flat cards and sidebar account footer

The user requested shadow-free app cards and an avatar/email dropdown in the sidebar footer
(`UI-03`). Selaras Card and Table surfaces use a 1 px hairline border with no resting/hover
shadow. Remove shadow utilities from linked cards; retain focus indicators and overlay elevation.
Use the shared SidebarNav footer slot, Avatar, Button, and DropdownMenu. Show a clearly labeled
demo profile (Guru Demo, guru@selaras.example). The menu contains only Settings and Sign out;
both remain visibly disabled in the public UI preview because no settings page exists and the
demo profile has no authenticated session (`UI-07`, `Q-03`).
The avatar remains usable when the sidebar is collapsed; hide the copy then. The mobile Drawer
uses the same footer. Do not imply that the demo profile is authenticated.

## DES-20 — Student card search, group filter, and pagination

The user's student-tab request (`UI-04`) adds shared SearchInput and Select beside each
class-card title. Search by name and filter by the existing group labels; wrap the header
controls at narrow widths. Keep the current white, border-only Card and shared Table.
Show the filtered result count and five rows per page, with shared Pagination below the table
only when more than five results remain. Each class has independent controls; search/filter
changes reset its page. Keep AddStudentDialog available for empty results. Other tabs retain
their existing scope; this overrides the earlier exclusion of filters only for these cards.

## DES-21 — Class selector in the detail header

Place a shared compact Select beside the phase Badge above the class title and description
(`UI-05`). Use a 256 px width capped by the available space; wrap the row on narrow screens.
Show the current class title as the selected option and all locally available classrooms.
Selection immediately navigates to that classroom while retaining the active detail tab.
Reset the tab's local controls when changing classrooms; retain the shared preview data.

## DES-22 — Indonesian product paths

Use `/kelas` without an application prefix (`UI-06`). Class tabs use `siswa`, `level`,
`progres`, and `sesi`; new sessions use `sesi/baru`, and saved sessions use `sesi/[sessionId]`
under the current class. Breadcrumb labels and all shared navigation/selector links follow
these paths. The route-group name is implementation-only and does not appear in URLs.
