"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { GROUP_KEYS } from "@/features/kelas/constants/preview";
import { GROUP_LABELS, GROUP_LEVELS } from "@/features/kelas/constants/groups";

const instructions = {
  A: "Kegiatan tanpa membaca, seperti mencocokkan gambar atau berhitung dengan benda konkret.",
  B: "Latihan sesuai level masing-masing siswa. Latihan boleh tertulis.",
  C: "Tugas mengikuti capaian fase kelasnya. Materi fase masih perlu dipilih oleh guru.",
};

export function GroupGuide() {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen} title="Panduan kelompok" description="Pembagian kelompok mengikuti level pada mata pelajaran yang dipilih." trigger={<Button size="xs" variant="quiet"><BookOpen size={16} aria-hidden="true" />Panduan kelompok</Button>}>
    <dl className="space-y-ui-sm">
      {GROUP_KEYS.map((group) => <div key={group} className="rounded-control border border-line p-ui-sm">
        <dt className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold"><span>Kelompok {GROUP_LABELS[group]}</span><span className="text-xs text-muted">{GROUP_LEVELS[group]}</span></dt>
        <dd className="mt-2 text-sm leading-relaxed">{instructions[group]}</dd>
      </div>)}
    </dl>
    <div className="mt-ui-md space-y-ui-sm text-sm leading-relaxed text-muted">
      <p>Setiap kelas memiliki tiga kelompok. Susunan Literasi dan Numerasi dapat berbeda.</p>
      <p>Gunakan tombol panah di samping nama siswa untuk memindahkan anggota dalam kelas yang sama. Perubahan hanya berlaku untuk mata pelajaran yang dipilih.</p>
      <p>Periksa level siswa berlabel Belum dinilai sebelum memberikan tugas.</p>
    </div>
  </Dialog>;
}
