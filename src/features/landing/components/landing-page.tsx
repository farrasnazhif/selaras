import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ClipboardList,
  Clock3,
  Flower2,
  Layers3,
  LayoutTemplate,
  NotebookPen,
  Printer,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: UsersRound,
    title: "Kenali kelas dan kelompoknya",
    description: "Atur dua kelas yang diajar bersama. Catat kemampuan siswa dari pengamatan, lalu sesuaikan kelompok di setiap kelas.",
    tone: "bg-primary-tint text-accent-ink",
  },
  {
    icon: Clock3,
    title: "Susun giliran belajar",
    description: "Pilih pelajaran dan durasi. Selaras menyusun giliran bersama guru dan tugas mandiri. Jadwal dan tugas tetap bisa Anda ubah.",
    tone: "bg-[var(--pastel-mint)] text-[var(--green)]",
  },
  {
    icon: Printer,
    title: "Bawa rencana ke kelas",
    description: "Periksa tugas tiap kelompok. Cetak lembar kegiatan atau salin instruksi ke papan tulis, sesuai fasilitas yang tersedia.",
    tone: "bg-[var(--pastel-yellow)] text-[var(--orange)]",
  },
];

function SessionPreview() {
  return (
    <figure className="relative min-w-0 rounded-[28px] bg-primary-tint p-ui-sm sm:p-ui-md">
      <figcaption className="mb-ui-sm flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-accent-ink">
        <span>SEKILAS SELARAS</span>
        <span>Ilustrasi sesi</span>
      </figcaption>
      <Card className="overflow-hidden !p-0">
        <div className="flex items-center gap-2 border-b border-line px-ui-sm py-ui-sm">
          <Layers3 size={20} className="text-accent" aria-hidden="true" />
          <span className="font-extrabold">Selaras</span>
          <span className="ml-auto rounded-full bg-[var(--pastel-mint)] px-3 py-1 text-xs font-bold text-[var(--green)]">Rencana sesi</span>
        </div>
        <div className="p-ui-sm sm:p-ui-md">
          <div className="mb-ui-sm flex flex-wrap items-start justify-between gap-ui-sm">
            <div>
              <p className="text-xs font-bold text-muted">KELAS 1 & 2</p>
              <h2 className="mt-1 text-2xl font-extrabold">Belajar bergantian,<br />tetap berkegiatan.</h2>
            </div>
            <BookOpen size={28} className="text-accent" aria-hidden="true" />
          </div>
          <div className="mb-ui-sm flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-md bg-primary-tint px-3 py-1 text-accent-ink">Literasi</span>
            <span className="flex items-center gap-1 rounded-md bg-canvas px-3 py-1 text-muted"><Clock3 size={14} aria-hidden="true" />70 menit</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full table-fixed text-left text-xs">
              <caption className="sr-only">Ilustrasi pembagian 70 menit untuk dua kelas dalam satu fase.</caption>
              <thead className="bg-canvas">
                <tr>
                  <th scope="col" className="w-[66px] p-2 font-bold">Menit</th>
                  <th scope="col" className="p-2 font-extrabold">Kelas 1</th>
                  <th scope="col" className="p-2 font-extrabold">Kelas 2</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-line">
                  <th scope="row" className="p-2 font-semibold tabular-nums text-muted">00–05</th>
                  <td colSpan={2} className="p-2 text-center font-bold">Pembukaan bersama</td>
                </tr>
                <tr className="border-t border-line">
                  <th scope="row" className="p-2 font-semibold tabular-nums text-muted">05–20</th>
                  <td colSpan={2} className="bg-primary-tint p-2 text-center font-bold text-accent-ink">Belajar bersama guru</td>
                </tr>
                {[
                  { time: "20–35", guided: 0 },
                  { time: "35–50", guided: 1 },
                  { time: "50–65", guided: 0 },
                ].map((block) => (
                  <tr key={block.time} className="border-t border-line">
                    <th scope="row" className="p-2 font-semibold tabular-nums text-muted">{block.time}</th>
                    {[0, 1].map((grade) => (
                      <td key={grade} className={`p-2 font-bold ${grade === block.guided ? "bg-primary-tint text-accent-ink" : "bg-[var(--pastel-mint)] text-[var(--green)]"}`}>
                        {grade === block.guided ? "Bersama guru" : "Tugas mandiri"}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-line">
                  <th scope="row" className="p-2 font-semibold tabular-nums text-muted">65–70</th>
                  <td colSpan={2} className="p-2 text-center font-bold">Penutup bersama</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-ui-sm flex items-start gap-2 text-xs font-bold text-[var(--green)]"><Check size={16} className="shrink-0" aria-hidden="true" />Giliran guru jelas. Setiap kelompok punya kegiatan.</p>
        </div>
      </Card>
    </figure>
  );
}

export function LandingPage() {
  return (
    <div lang="id" className="selaras-landing bg-white text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex min-h-[76px] max-w-[1200px] items-center justify-between gap-ui-sm px-ui-sm md:px-ui-md">
          <Link href="/" aria-label="Selaras, beranda" className="flex items-center gap-2 text-2xl font-extrabold">
            <Layers3 className="text-accent" size={28} aria-hidden="true" />Selaras
          </Link>
          <nav aria-label="Navigasi beranda" className="hidden items-center gap-ui-md text-sm font-extrabold md:flex">
            <a href="#cara-kerja" className="py-2 hover:text-accent-ink">Cara kerja</a>
            <a href="#hasil-sesi" className="py-2 hover:text-accent-ink">Hasil sesi</a>
          </nav>
          <Button variant="secondary" nativeButton={false} role="link" render={<Link href="/kelas" />}>
            Coba Selaras<ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </header>

      <main id="main-content">
        <section aria-labelledby="hero-title" className="mx-auto grid max-w-[1200px] items-center gap-ui-md px-ui-sm py-ui-group md:px-ui-md lg:grid-cols-[1fr_1.08fr] lg:gap-ui-group">
          <div>
            <p className="mb-ui-md inline-flex items-center gap-2 rounded-full bg-[var(--pastel-mint)] px-ui-sm py-2 text-sm font-bold text-[var(--green)]"><Flower2 size={18} aria-hidden="true" />Untuk guru kelas rangkap</p>
            <h1 id="hero-title" className="text-[42px] leading-[1.08] font-extrabold tracking-[-1.5px] sm:text-[56px] lg:text-[64px]">Dua kelas,<br />satu ritme<br /><span className="text-accent-ink">belajar.</span></h1>
            <p className="mt-ui-md max-w-[36ch] text-lg leading-relaxed text-[var(--body)]">Saat Anda mendampingi satu kelas, kelas lainnya tetap punya kegiatan. Atur giliran mengajar dan tugas mandiri sesuai kemampuan siswa bersama Selaras.</p>
            <div className="mt-ui-md flex flex-wrap items-center gap-ui-sm">
              <Button variant="primary" nativeButton={false} role="link" render={<Link href="/kelas" />}>Buka pratinjau<ArrowRight size={20} aria-hidden="true" /></Button>
              <a href="#cara-kerja" className="py-2 text-sm font-extrabold underline decoration-line-strong underline-offset-4 hover:text-accent-ink">Lihat cara kerjanya</a>
            </div>
            <p className="mt-ui-sm max-w-[44ch] text-xs leading-relaxed text-muted">Pratinjau dengan data fiktif. Perubahan hilang jika halaman dimuat ulang.</p>
          </div>
          <SessionPreview />
        </section>

        <section id="cara-kerja" aria-labelledby="workflow-title" className="border-y border-line bg-canvas">
          <div className="mx-auto max-w-[1200px] px-ui-sm py-ui-group md:px-ui-md">
            <p className="text-sm font-extrabold text-accent-ink">DARI RENCANA KE RUANG KELAS</p>
            <div className="mt-ui-sm grid gap-ui-sm md:grid-cols-2 md:gap-ui-md">
              <h2 id="workflow-title" className="max-w-[22ch] text-[32px] leading-tight font-extrabold tracking-tight sm:text-[38px]">Alur sederhana.<br />Kegiatan lebih tertata.</h2>
              <p className="max-w-[48ch] self-end text-[var(--body)]">Anda yang paling mengenal siswa. Selaras membantu menata rencana, sementara pilihan kegiatan tetap di tangan Anda.</p>
            </div>
            <ol className="mt-ui-md grid gap-ui-sm md:grid-cols-3 md:gap-ui-md">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <Card className="h-full">
                    <div className="mb-ui-md flex items-center justify-between">
                      <span className={`flex size-12 items-center justify-center rounded-xl ${step.tone}`}><step.icon size={24} aria-hidden="true" /></span>
                      <span className="text-sm font-extrabold text-muted">0{index + 1}</span>
                    </div>
                    <h3 className="text-xl leading-snug font-extrabold">{step.title}</h3>
                    <p className="mt-ui-sm text-sm leading-relaxed text-[var(--body)]">{step.description}</p>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="hasil-sesi" aria-labelledby="output-title" className="mx-auto grid max-w-[1200px] items-center gap-ui-md px-ui-sm py-ui-group md:px-ui-md lg:grid-cols-2 lg:gap-ui-group">
          <div className="rounded-[28px] bg-[var(--pastel-yellow)] p-ui-md sm:p-ui-group">
            <div className="rounded-xl border border-line bg-white p-ui-md">
              <div className="flex items-center justify-between gap-2 border-b border-line pb-ui-sm">
                <span className="flex items-center gap-2 font-extrabold"><Layers3 size={18} className="text-accent" aria-hidden="true" />Lembar kegiatan</span>
                <Printer size={18} className="text-muted" aria-hidden="true" />
              </div>
              <p className="mt-ui-md text-xs font-bold text-muted">ILUSTRASI TUGAS KELOMPOK</p>
              <h3 className="mt-2 text-xl font-extrabold">Kelompok Biru</h3>
              <p className="mt-ui-sm text-sm text-[var(--body)]">Cocokkan gambar yang sama. Guru menjelaskan instruksi sebelum kegiatan dimulai.</p>
              <div className="mt-ui-md grid grid-cols-3 gap-ui-sm text-accent-ink" aria-hidden="true">
                {[Flower2, BookOpen, Layers3, BookOpen, Layers3, Flower2].map((Icon, index) => <div key={index} className="flex aspect-square items-center justify-center rounded-xl bg-primary-tint"><Icon size={28} /></div>)}
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-extrabold text-accent-ink">SIAP DIBAWA MENGAJAR</p>
            <h2 id="output-title" className="mt-ui-sm text-[32px] leading-tight font-extrabold tracking-tight sm:text-[38px]">Rencananya di layar.<br />Belajarnya di kelas.</h2>
            <p className="mt-ui-sm text-[var(--body)]">Siswa tidak perlu membuka aplikasi. Gunakan rencana dan tugas dalam bentuk yang paling cocok untuk kelas Anda.</p>
            <ul className="mt-ui-md space-y-ui-md">
              {[
                { icon: ClipboardList, title: "Jadwal yang bisa disesuaikan", text: "Lihat giliran mengajar, ubah blok waktu, dan periksa pembagian kegiatan sebelum digunakan." },
                { icon: Printer, title: "Lembar tugas per kelompok", text: "Tinjau kegiatan, tambahkan foto bila perlu, lalu cetak atau simpan sebagai PDF melalui browser." },
                { icon: NotebookPen, title: "Versi papan tulis", text: "Salin instruksi kelompok ke papan tulis saat lembar cetak tidak tersedia." },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-ui-sm">
                  <item.icon size={22} className="mt-1 shrink-0 text-accent-ink" aria-hidden="true" />
                  <div><h3 className="font-extrabold">{item.title}</h3><p className="mt-1 text-sm text-[var(--body)]">{item.text}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="try-title" className="mx-auto max-w-[1200px] px-ui-sm pb-ui-group md:px-ui-md">
          <div className="flex flex-col items-start justify-between gap-ui-md rounded-[28px] bg-primary-tint p-ui-md sm:p-ui-group md:flex-row md:items-center">
            <div>
              <LayoutTemplate size={28} className="mb-ui-sm text-accent-ink" aria-hidden="true" />
              <h2 id="try-title" className="text-[32px] leading-tight font-extrabold tracking-tight">Mulai dari kelas Anda.</h2>
              <p className="mt-ui-sm max-w-[44ch] text-[var(--body)]">Jelajahi pratinjau dan coba susun satu sesi dengan data fiktif yang sudah tersedia.</p>
            </div>
            <Button variant="primary" nativeButton={false} role="link" render={<Link href="/kelas" />}>Coba Selaras<ArrowRight size={20} aria-hidden="true" /></Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-ui-md px-ui-sm py-ui-md md:px-ui-md">
          <div><p className="flex items-center gap-2 text-lg font-extrabold"><Layers3 size={22} className="text-accent" aria-hidden="true" />Selaras</p><p className="mt-1 text-xs text-muted">Untuk guru, bersama setiap kelompok belajar.</p></div>
          <nav aria-label="Navigasi footer" className="flex flex-wrap gap-ui-sm text-sm font-bold sm:gap-ui-md">
            <a className="py-2 hover:underline" href="#cara-kerja">Cara kerja</a>
            <Link className="py-2 hover:underline" href="/kelas">Buka kelas</Link>
            <Link className="py-2 text-muted hover:underline" href="/sandbox">Sandbox UI</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
