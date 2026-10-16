"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Clock3,
  NotebookPen,
  Printer,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const cardImages = [
  {
    src: "/images/landing/cards/card-1.png",
    alt: "Ilustrasi aktivitas kelas rangkap 1",
    layoutClass: "z-10 -rotate-3 -translate-x-6 hover:-translate-y-16 hover:-rotate-1",
  },
  {
    src: "/images/landing/cards/card-2.png",
    alt: "Ilustrasi aktivitas kelas rangkap 2",
    layoutClass: "z-20 -mt-28 rotate-3 translate-x-12 hover:-translate-y-16 hover:rotate-1",
  },
  {
    src: "/images/landing/cards/card-3.png",
    alt: "Ilustrasi aktivitas kelas rangkap 3",
    layoutClass: "z-30 -mt-28 -rotate-1 -translate-x-10 hover:-translate-y-16 hover:rotate-0",
  },
];

const featureCards = [
  {
    src: "/images/landing/cards/card-4.png",
    alt: "Ilustrasi hasil sesi 1",
    layoutClass: "z-10 -rotate-2 -translate-x-15 hover:-translate-y-4 hover:rotate-0",
  },
  {
    src: "/images/landing/cards/card-5.png",
    alt: "Ilustrasi hasil sesi 2",
    layoutClass: "z-20 -mt-24 rotate-2 hover:-translate-y-4 hover:rotate-0 sm:-mt-28",
  },
];

const carouselItems = [
  {
    id: 1,
    title: "Kenali kelas dan kelompoknya",
    description: "Atur dua kelas yang diajar bersama. Catat kemampuan siswa dari pengamatan, lalu sesuaikan kelompok di setiap kelas.",
    icon: UsersRound,
    iconColor: "text-[#6669E3]",
  },
  {
    id: 2,
    title: "Susun giliran belajar",
    description: "Pilih pelajaran dan durasi. Selaras menyusun giliran bersama guru dan tugas mandiri. Jadwal dan tugas tetap bisa Anda ubah.",
    icon: Clock3,
    iconColor: "text-[#9AD95A]",
  },
  {
    id: 3,
    title: "Bawa rencana ke kelas",
    description: "Periksa tugas tiap kelompok. Cetak lembar kegiatan atau salin instruksi ke papan tulis, sesuai fasilitas yang tersedia.",
    icon: Printer,
    iconColor: "text-[#E34A72]",
  },
];

function SessionPreview() {
  return (
    <figure className="relative min-w-0 py-6">
      <div className="relative mx-auto flex max-w-[440px] flex-col items-center">
        {cardImages.map((card, index) => (
          <div
            key={index}
            className={`relative w-full rounded-[28px] border-4 border-white bg-canvas shadow-xl overflow-hidden transition-all duration-300 ease-out ${card.layoutClass}`}
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={card.src}
                alt={card.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 440px"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function FeatureCardsStack() {
  return (
    <figure className="relative min-w-0 py-6">
      <div className="relative mx-auto flex max-w-[440px] flex-col items-center">
        {featureCards.map((card, index) => (
          <div
            key={index}
            className={`relative w-full rounded-[28px] border-4 border-white bg-canvas shadow-xl overflow-hidden transition-all duration-300 ease-out ${card.layoutClass}`}
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={card.src}
                alt={card.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 440px"
              />
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(1);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative mx-auto w-full max-w-[1100px] py-12 px-4 overflow-hidden">
      {/* Cards Stage with expanded height & wider spacing */}
      <div className="relative flex items-center justify-center min-h-[460px] sm:min-h-[420px]">
        {carouselItems.map((item, index) => {
          const position = (index - activeIndex + carouselItems.length) % carouselItems.length;
          const IconComponent = item.icon;

          let transformClass = "scale-90 opacity-40 z-0 pointer-events-none translate-x-[-50%] -translate-y-1/2";
          if (position === 0) {
            transformClass = "scale-105 opacity-100 z-30 translate-x-[-50%] -translate-y-[calc(50%+25px)] rotate-0";
          } else if (position === 1) {
            transformClass = "scale-90 opacity-70 z-10 translate-x-[15%] sm:translate-x-[32%] -translate-y-1/2 rotate-6 blur-[0.5px]";
          } else if (position === carouselItems.length - 1) {
            transformClass = "scale-90 opacity-70 z-10 -translate-x-[115%] sm:-translate-x-[132%] -translate-y-1/2 -rotate-6 blur-[0.5px]";
          }

          return (
            <div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={`absolute top-1/2 left-1/2 w-[88%] max-w-[420px] transition-all duration-500 ease-out cursor-pointer ${transformClass}`}
            >
              <Card className="overflow-hidden rounded-[32px] border-[16px] border-[#6669E3] bg-white shadow-2xl !p-0 [box-sizing:border-box]">
                <div className="flex flex-col items-center text-center p-8 sm:p-12">
                  <div className="mb-8 flex justify-center">
                    <IconComponent size={40} className={item.iconColor} aria-hidden="true" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-ink leading-snug">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm text-[var(--body)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Playful Controls with increased top spacing */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          aria-label="Langkah sebelumnya"
          className="flex size-12 items-center justify-center rounded-full border-2 border-line bg-white text-ink shadow-md transition-transform hover:scale-110 active:scale-95 hover:border-[#6669E3]"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-3">
          {carouselItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Buka langkah ${i + 1}`}
              className={`h-3 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-9 bg-[#6669E3]" : "w-3 bg-line hover:bg-muted"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Langkah selanjutnya"
          className="flex size-11 items-center justify-center rounded-full border-2 border-line bg-white text-ink shadow-md transition-transform hover:scale-110 active:scale-95 hover:border-[#6669E3]"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div lang="id" className="selaras-landing bg-white text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex min-h-[76px] max-w-[1200px] items-center justify-between gap-ui-sm px-ui-sm md:px-ui-md">
          <Link href="/" aria-label="Selaras, beranda" className="flex items-center gap-2 text-2xl font-extrabold">
            <Image src="/main-logo.png" alt="Selaras" width={863} height={187} priority className="h-auto w-28 sm:w-36" />
          </Link>
          <nav aria-label="Navigasi beranda" className="hidden items-center gap-ui-md text-sm font-extrabold md:flex">
            <a href="#cara-kerja" className="py-2 hover:text-[#6669E3]">Cara kerja</a>
            <a href="#hasil-sesi" className="py-2 hover:text-[#6669E3]">Hasil sesi</a>
          </nav>
          <Button variant="secondary" nativeButton={false} role="link" render={<Link href="/kelas" />}>
            Coba Selaras<ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </header>

      <main id="main-content">
        <section aria-labelledby="hero-title" className="mx-auto grid max-w-[1200px] items-center gap-ui-md px-ui-sm py-ui-group md:px-ui-md lg:grid-cols-[1fr_1.08fr] lg:gap-ui-group">
          <div>
            <h1 id="hero-title" className="text-[42px] leading-[1.08] font-extrabold tracking-[-1.5px] sm:text-[56px] lg:text-[64px]">Dua kelas,<br />satu ritme<br /><span className="text-[#6669E3]">belajar.</span></h1>
            <p className="mt-ui-md max-w-[36ch] text-lg leading-relaxed text-[var(--body)]">Saat Anda mendampingi satu kelas, kelas lainnya tetap punya kegiatan. Atur giliran mengajar dan tugas mandiri sesuai kemampuan siswa bersama Selaras.</p>
            <div className="mt-ui-md flex flex-wrap items-center gap-ui-sm">
              <Button variant="primary" nativeButton={false} role="link" render={<Link href="/kelas" />}>Buka kelas<ArrowRight size={20} aria-hidden="true" /></Button>
              <a href="#cara-kerja" className="py-2 text-sm font-extrabold underline decoration-line-strong underline-offset-4 hover:text-[#6669E3]">Lihat cara kerjanya</a>
            </div>
            <p className="mt-ui-sm max-w-[44ch] text-xs leading-relaxed text-muted">Masuk dengan akun guru untuk menyimpan kelas dan rencana belajar Anda.</p>
          </div>
          <SessionPreview />
        </section>

        {/* Workflow Carousel Section */}
        <section id="cara-kerja" className="border-t border-line bg-canvas/60 py-16 px-ui-sm md:px-ui-md">
          <div className="mx-auto max-w-[1200px] text-center -mb-4">
            <h2 className="text-[28px] font-extrabold sm:text-[36px]">Alur Sederhana, Kegiatan Lebih Tertata</h2>
            <p className="mt-3 text-[var(--body)] max-w-[50ch] mx-auto">Anda yang paling mengenal siswa. Selaras membantu menata rencana, sementara pilihan kegiatan tetap di tangan Anda.</p>
          </div>
          <HeroCarousel />
        </section>

        {/* Output Section */}
        <section id="hasil-sesi" aria-labelledby="output-title" className="mx-auto max-w-[1200px] px-ui-sm py-ui-group md:px-ui-md">
          <div className="grid items-center gap-ui-md lg:grid-cols-2 lg:gap-ui-group">
            <FeatureCardsStack />
            <div>
              <h2 id="output-title" className="text-[32px] leading-tight font-extrabold tracking-tight sm:text-[38px]">Rencananya di layar.<br />Belajarnya di kelas.</h2>
              <p className="mt-ui-sm text-[var(--body)]">Siswa tidak perlu membuka aplikasi. Gunakan rencana dan tugas dalam bentuk yang paling cocok untuk kelas Anda.</p>
              <ul className="mt-ui-md space-y-ui-md">
                {[
                  { icon: ClipboardList, title: "Jadwal yang bisa disesuaikan", text: "Lihat giliran mengajar, ubah blok waktu, dan periksa pembagian kegiatan sebelum digunakan." },
                  { icon: Printer, title: "Lembar tugas per kelompok", text: "Tinjau kegiatan, tambahkan foto bila perlu, lalu cetak atau simpan sebagai PDF melalui browser." },
                  { icon: NotebookPen, title: "Versi papan tulis", text: "Salin instruksi kelompok ke papan tulis saat lembar cetak tidak tersedia." },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-ui-sm">
                    <item.icon size={22} className="mt-1 shrink-0 text-[#6669E3]" aria-hidden="true" />
                    <div><h3 className="font-extrabold">{item.title}</h3><p className="mt-1 text-sm text-[var(--body)]">{item.text}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Minimal Call-To-Action Section */}
        <section aria-label="Mulai menggunakan Selaras" className="mx-auto max-w-[1200px] px-ui-sm pb-ui-group pt-ui-md text-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <h2 className="text-2xl font-extrabold sm:text-3xl text-ink">
              Siapkan Sesi Kelas Anda Sekarang
            </h2>

            <Button
              variant="primary"
              size="lg"
              nativeButton={false}
              role="link"
              render={<Link href="/kelas" />}
              className="px-8 py-4 text-base font-extrabold shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              Mulai menggunakan Selaras <ArrowRight size={20} className="ml-1" aria-hidden="true" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-ui-md px-ui-sm py-ui-md md:px-ui-md">
          <div><Image src="/main-logo.png" alt="Selaras" width={863} height={187} className="h-auto w-32" /><p className="mt-1 text-xs text-muted">Untuk guru, bersama setiap kelompok belajar.</p></div>
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
